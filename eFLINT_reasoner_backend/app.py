"""
python -m venv .venv
uvicorn app:app --reload --host 0.0.0.0 --port 8001
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import fcntl
import os
import select
import subprocess
import threading
import time
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="eFLINT Reasoner API")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["*"],
	allow_headers=["*"],
)


class ExecuteRequest(BaseModel):
	eflint: str = Field(..., min_length=1)


class ReplRequest(BaseModel):
	input: str = Field(..., min_length=1, max_length=20000)


class ReplInputRequest(BaseModel):
	input: str = Field(..., min_length=1, max_length=4000)


@dataclass
class ReplSession:
	id: str
	proc: subprocess.Popen
	created_at: float
	last_used_at: float


REPL_SESSION_TTL_SECONDS = 15 * 60
_repl_sessions: dict[str, ReplSession] = {}
_repl_lock = threading.Lock()


def _set_nonblocking(stream):
	fd = stream.fileno()
	flags = fcntl.fcntl(fd, fcntl.F_GETFL)
	fcntl.fcntl(fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)


def _read_available_output(proc: subprocess.Popen, idle_timeout: float = 0.15, max_duration: float = 1.5):
	stdout_chunks: list[str] = []
	stderr_chunks: list[str] = []
	started = time.time()
	last_data = started

	while time.time() - started < max_duration:
		ready, _, _ = select.select([proc.stdout, proc.stderr], [], [], idle_timeout)
		if not ready:
			if time.time() - last_data >= idle_timeout:
				break
			continue

		had_data = False
		if proc.stdout in ready:
			try:
				chunk = os.read(proc.stdout.fileno(), 8192).decode("utf-8", errors="replace")
			except BlockingIOError:
				chunk = ""
			if chunk:
				stdout_chunks.append(chunk)
				had_data = True

		if proc.stderr in ready:
			try:
				chunk = os.read(proc.stderr.fileno(), 8192).decode("utf-8", errors="replace")
			except BlockingIOError:
				chunk = ""
			if chunk:
				stderr_chunks.append(chunk)
				had_data = True

		if had_data:
			last_data = time.time()
		elif proc.poll() is not None:
			break

	return "".join(stdout_chunks), "".join(stderr_chunks)


def _cleanup_stale_repl_sessions():
	now = time.time()
	stale_ids: list[str] = []
	with _repl_lock:
		for session_id, session in _repl_sessions.items():
			if now - session.last_used_at > REPL_SESSION_TTL_SECONDS or session.proc.poll() is not None:
				stale_ids.append(session_id)

		for session_id in stale_ids:
			session = _repl_sessions.pop(session_id)
			try:
				session.proc.terminate()
			except OSError:
				pass


def _start_interactive_repl_session():
	_cleanup_stale_repl_sessions()
	eflint_image = os.getenv("EFLINT_DOCKER_IMAGE", "eflint")

	docker_cmd = [
		"docker",
		"run",
		"--rm",
		"-i",
		"--network",
		"none",
		"--pids-limit",
		"256",
		"--memory",
		"512m",
		"--cpus",
		"1.5",
		eflint_image,
		"repl",
	]

	try:
		proc = subprocess.Popen(
			docker_cmd,
			stdin=subprocess.PIPE,
			stdout=subprocess.PIPE,
			stderr=subprocess.PIPE,
		)
	except OSError as exc:
		raise HTTPException(status_code=500, detail="Failed to start interactive docker REPL") from exc

	if proc.stdout is None or proc.stderr is None or proc.stdin is None:
		raise HTTPException(status_code=500, detail="Failed to initialize REPL IO streams")

	_set_nonblocking(proc.stdout)
	_set_nonblocking(proc.stderr)

	session_id = str(uuid.uuid4())
	now = time.time()
	session = ReplSession(id=session_id, proc=proc, created_at=now, last_used_at=now)

	with _repl_lock:
		_repl_sessions[session_id] = session

	stdout, stderr = _read_available_output(proc, idle_timeout=0.2, max_duration=2.0)
	return session_id, stdout, stderr


def _get_repl_session_or_404(session_id: str):
	with _repl_lock:
		session = _repl_sessions.get(session_id)
	if session is None:
		raise HTTPException(status_code=404, detail="REPL session not found")
	if session.proc.poll() is not None:
		with _repl_lock:
			_repl_sessions.pop(session_id, None)
		raise HTTPException(status_code=410, detail="REPL session has ended")
	return session


def _run_eflint_in_docker(*args: str, stdin_data: str | None = None, timeout_seconds: int = 30):
	tests_dir = Path(__file__).parent / "eflint_tests"
	tests_dir.mkdir(parents=True, exist_ok=True)

	eflint_image = os.getenv("EFLINT_DOCKER_IMAGE", "eflint")

	docker_cmd = [
		"docker",
		"run",
		"--rm",
		"--network",
		"none",
		"--read-only",
		"--security-opt",
		"no-new-privileges:true",
		"--cap-drop",
		"ALL",
		"--pids-limit",
		"128",
		"--memory",
		"256m",
		"--cpus",
		"1.0",
		"--tmpfs",
		"/tmp:size=64m,noexec,nosuid,nodev",
		"--mount",
		f"type=bind,source={tests_dir.resolve()},target=/eflint_tests,readonly",
	]

	if stdin_data is not None:
		docker_cmd.extend(["-i"])

	docker_cmd.extend([
		eflint_image,
		*args,
	])

	try:
		return subprocess.run(
			docker_cmd,
			input=stdin_data,
			capture_output=True,
			text=True,
			check=False,
			timeout=timeout_seconds,
		)
	except subprocess.TimeoutExpired as exc:
		raise HTTPException(status_code=504, detail="eFLINT execution timed out") from exc
	except OSError as exc:
		raise HTTPException(status_code=500, detail="Failed to run docker") from exc


@app.post("/execute")
def execute(req: ExecuteRequest):
	tests_dir = Path(__file__).parent / "eflint_tests"
	tests_dir.mkdir(parents=True, exist_ok=True)

	temp_path = tests_dir / "temp.eflint"
	temp_path.write_text(req.eflint, encoding="utf-8")

	result = _run_eflint_in_docker("repl", "/eflint_tests/temp.eflint")

	if result.returncode != 0:
		raise HTTPException(
			status_code=400,
			detail={
				"message": "eFLINT execution failed",
				"stdout": result.stdout,
				"stderr": result.stderr,
				"code": result.returncode,
			},
		)

	return {"stdout": result.stdout, "stderr": result.stderr, "code": result.returncode}


@app.post("/repl")
def repl(req: ReplRequest):
	repl_input = req.input.rstrip()
	if not repl_input:
		raise HTTPException(status_code=400, detail="REPL input is empty")

	result = _run_eflint_in_docker("repl", stdin_data=f"{repl_input}\n", timeout_seconds=20)

	if result.returncode != 0:
		raise HTTPException(
			status_code=400,
			detail={
				"message": "eFLINT REPL execution failed",
				"stdout": result.stdout,
				"stderr": result.stderr,
				"code": result.returncode,
			},
		)

	return {"stdout": result.stdout, "stderr": result.stderr, "code": result.returncode}


@app.post("/repl/session/start")
def repl_session_start():
	session_id, stdout, stderr = _start_interactive_repl_session()
	return {"sessionId": session_id, "stdout": stdout, "stderr": stderr}


@app.post("/repl/session/{session_id}/input")
def repl_session_input(session_id: str, req: ReplInputRequest):
	_cleanup_stale_repl_sessions()
	session = _get_repl_session_or_404(session_id)

	command = req.input.rstrip("\r\n")
	if not command:
		raise HTTPException(status_code=400, detail="REPL input is empty")

	try:
		session.proc.stdin.write((command + "\n").encode("utf-8"))
		session.proc.stdin.flush()
	except OSError as exc:
		raise HTTPException(status_code=410, detail="REPL session is not writable") from exc

	stdout, stderr = _read_available_output(session.proc, idle_timeout=0.2, max_duration=2.0)
	session.last_used_at = time.time()

	return {
		"sessionId": session_id,
		"stdout": stdout,
		"stderr": stderr,
		"running": session.proc.poll() is None,
	}


@app.post("/repl/session/{session_id}/stop")
def repl_session_stop(session_id: str):
	with _repl_lock:
		session = _repl_sessions.pop(session_id, None)

	if session is None:
		return {"stopped": False, "reason": "not-found"}

	try:
		session.proc.terminate()
		try:
			session.proc.wait(timeout=2)
		except subprocess.TimeoutExpired:
			session.proc.kill()
	except OSError:
		pass

	return {"stopped": True}


@app.get("/health")
def health():
	return {"status": "ok"}
