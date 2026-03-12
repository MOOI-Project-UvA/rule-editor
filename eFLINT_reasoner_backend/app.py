"""
python -m venv .venv
uvicorn app:app --reload --host 127.0.0.1 --port 8001 --no-access-log
"""

from __future__ import annotations

from dataclasses import dataclass
import datetime as dt
from pathlib import Path
import fcntl
import json
import logging
import os
import select
import subprocess
import threading
import time
import traceback
import uuid

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="eFLINT Reasoner API")

SERVICE_NAME = "eflint-reasoner"
APP_ENV = os.getenv("APP_ENV", "dev")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()


def _to_python_log_level(level: str) -> int:
	normalized = (level or "INFO").upper()
	if normalized == "WARN":
		normalized = "WARNING"
	return getattr(logging, normalized, logging.INFO)


def _configure_logging() -> logging.Logger:
	service_logger = logging.getLogger(SERVICE_NAME)
	service_logger.setLevel(_to_python_log_level(LOG_LEVEL))
	service_logger.propagate = False

	if not service_logger.handlers:
		handler = logging.StreamHandler()
		handler.setFormatter(logging.Formatter("%(message)s"))
		service_logger.addHandler(handler)

	logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
	return service_logger


logger = _configure_logging()


def _log(level: str, message: str, **fields) -> None:
	event = {
		"timestamp": dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z"),
		"level": level,
		"service": SERVICE_NAME,
		"env": APP_ENV,
		"message": message,
		**fields,
	}
	logger.log(_to_python_log_level(level), json.dumps(event, default=str))


def _load_config():
	config_path = Path(__file__).parent / "config.json"
	try:
		with config_path.open("r", encoding="utf-8") as config_file:
			return json.load(config_file)
	except FileNotFoundError as exc:
		raise RuntimeError(f"Missing configuration file: {config_path}") from exc
	except json.JSONDecodeError as exc:
		raise RuntimeError(f"Invalid JSON in configuration file: {config_path}") from exc


CONFIG = _load_config()

app.add_middleware(
	CORSMiddleware,
	allow_origins=CONFIG["cors"]["allowOrigins"],
	allow_methods=CONFIG["cors"]["allowMethods"],
	allow_headers=CONFIG["cors"]["allowHeaders"],
)


@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
	started = time.perf_counter()
	request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())

	try:
		response = await call_next(request)
		status_code = response.status_code
	except Exception as exc:
		duration_ms = round((time.perf_counter() - started) * 1000, 2)
		_log(
			"ERROR",
			"request_failed",
			request_id=request_id,
			method=request.method,
			path=request.url.path,
			status_code=500,
			duration_ms=duration_ms,
			error_type=type(exc).__name__,
			error_message=str(exc),
			stack_trace=traceback.format_exc(),
		)
		raise

	duration_ms = round((time.perf_counter() - started) * 1000, 2)
	response.headers["X-Request-ID"] = request_id
	if request.url.path == "/health":
		level = "DEBUG"
	else:
		level = "ERROR" if status_code >= 500 else "WARN" if status_code >= 400 else "INFO"
	_log(
		level,
		"health_check" if request.url.path == "/health" else "request_completed",
		request_id=request_id,
		method=request.method,
		path=request.url.path,
		status_code=status_code,
		duration_ms=duration_ms,
	)
	return response


_log("INFO", "startup", log_level=LOG_LEVEL)


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


_repl_sessions: dict[str, ReplSession] = {}
_repl_lock = threading.Lock()


def _set_nonblocking(stream):
	fd = stream.fileno()
	flags = fcntl.fcntl(fd, fcntl.F_GETFL)
	fcntl.fcntl(fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)


def _read_available_output(proc: subprocess.Popen, idle_timeout: float | None = None, max_duration: float | None = None):
	repl_config = CONFIG["repl"]
	resolved_idle_timeout = idle_timeout if idle_timeout is not None else repl_config["readIdleTimeoutSeconds"]
	resolved_max_duration = max_duration if max_duration is not None else repl_config["readMaxDurationSeconds"]
	stdout_chunks: list[str] = []
	stderr_chunks: list[str] = []
	started = time.time()
	last_data = started

	while time.time() - started < resolved_max_duration:
		ready, _, _ = select.select([proc.stdout, proc.stderr], [], [], resolved_idle_timeout)
		if not ready:
			if time.time() - last_data >= resolved_idle_timeout:
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
	session_ttl = CONFIG["repl"]["sessionTtlSeconds"]
	with _repl_lock:
		for session_id, session in _repl_sessions.items():
			if now - session.last_used_at > session_ttl or session.proc.poll() is not None:
				stale_ids.append(session_id)

		for session_id in stale_ids:
			session = _repl_sessions.pop(session_id)
			try:
				session.proc.terminate()
			except OSError:
				pass


def _start_interactive_repl_session():
	_cleanup_stale_repl_sessions()
	eflint_image = CONFIG["docker"]["image"]
	interactive_config = CONFIG["docker"]["interactive"]
	repl_config = CONFIG["repl"]

	docker_cmd = [
		"docker",
		"run",
		"--rm",
		"-i",
		"--network",
		interactive_config["network"],
		"--pids-limit",
		str(interactive_config["pidsLimit"]),
		"--memory",
		interactive_config["memory"],
		"--cpus",
		str(interactive_config["cpus"]),
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

	stdout, stderr = _read_available_output(
		proc,
		idle_timeout=repl_config["sessionStartReadIdleTimeoutSeconds"],
		max_duration=repl_config["sessionStartReadMaxDurationSeconds"],
	)
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


def _run_eflint_in_docker(*args: str, stdin_data: str | None = None, timeout_seconds: int | None = None):
	tests_dir = Path(__file__).parent / "eflint_tests"
	tests_dir.mkdir(parents=True, exist_ok=True)

	eflint_image = CONFIG["docker"]["image"]
	execute_config = CONFIG["docker"]["execute"]
	resolved_timeout = timeout_seconds if timeout_seconds is not None else execute_config["timeoutSeconds"]

	docker_cmd = [
		"docker",
		"run",
		"--rm",
		"--network",
		execute_config["network"],
		"--security-opt",
		"no-new-privileges:true",
		"--pids-limit",
		str(execute_config["pidsLimit"]),
		"--memory",
		execute_config["memory"],
		"--cpus",
		str(execute_config["cpus"]),
		"--tmpfs",
		execute_config["tmpfs"],
		"--mount",
		f"type=bind,source={tests_dir.resolve()},target=/eflint_tests,readonly",
	]

	if execute_config["readOnly"]:
		docker_cmd.insert(6, "--read-only")

	if execute_config["securityNoNewPrivileges"] is False:
		security_idx = docker_cmd.index("--security-opt")
		del docker_cmd[security_idx:security_idx + 2]

	if execute_config["capDropAll"]:
		docker_cmd.extend(["--cap-drop", "ALL"])

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
			timeout=resolved_timeout,
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

	result = _run_eflint_in_docker(
		"repl",
		stdin_data=f"{repl_input}\n",
		timeout_seconds=CONFIG["repl"]["singleShotTimeoutSeconds"],
	)

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

	repl_config = CONFIG["repl"]
	stdout, stderr = _read_available_output(
		session.proc,
		idle_timeout=repl_config["sessionInputReadIdleTimeoutSeconds"],
		max_duration=repl_config["sessionInputReadMaxDurationSeconds"],
	)
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
			session.proc.wait(timeout=CONFIG["repl"]["sessionStopWaitTimeoutSeconds"])
		except subprocess.TimeoutExpired:
			session.proc.kill()
	except OSError:
		pass

	return {"stopped": True}


@app.get("/health")
def health():
	return {"status": "ok"}
