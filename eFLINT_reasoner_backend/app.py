"""
python -m venv .venv
uvicorn app:app --reload --host 0.0.0.0 --port 8001
"""

from __future__ import annotations

from pathlib import Path
import subprocess

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="eFLINT Reasoner API")


class ExecuteRequest(BaseModel):
	eflint: str = Field(..., min_length=1)


@app.post("/execute")
def execute(req: ExecuteRequest):
	tests_dir = Path(__file__).parent / "eflint_tests"
	tests_dir.mkdir(parents=True, exist_ok=True)

	temp_path = tests_dir / "temp.eflint"
	temp_path.write_text(req.eflint, encoding="utf-8")

	docker_cmd = [
		"docker",
		"run",
		"--rm",
		"-v",
		f"{tests_dir.resolve()}:/eflint_tests",
		"eflint",
		"repl",
		"/eflint_tests/temp.eflint",
	]

	try:
		result = subprocess.run(
			docker_cmd,
			capture_output=True,
			text=True,
			check=False,
			timeout=30,
		)
	except subprocess.TimeoutExpired as exc:
		raise HTTPException(status_code=504, detail="eFLINT execution timed out") from exc
	except OSError as exc:
		raise HTTPException(status_code=500, detail="Failed to run docker") from exc

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


@app.get("/health")
def health():
	return {"status": "ok"}
