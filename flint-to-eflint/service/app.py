"""
cd flint-to-eflint
set -a; sed -i 's/\r$//' ./secrets.env; source ./secrets.env; set +a
uvicorn service.app:app --reload --host 0.0.0.0 --port 8000
"""

import base64
import datetime as dt
import hashlib
import hmac
import json
import logging
import os
import time
import traceback
import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from eflint_generator import generate_eflint


def _load_env_file(file_path: Path) -> None:
    if not file_path.exists() or not file_path.is_file():
        return

    for raw_line in file_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def _env_bool(name: str, default: bool = False) -> bool:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    normalized = raw_value.strip().strip('"').strip("'").lower()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False
    return default


_default_secrets_file = Path(__file__).resolve().parent.parent / "secrets.env"
_configured_secrets_file = Path(os.getenv("AUTH_SECRETS_FILE", str(_default_secrets_file)))
_load_env_file(_configured_secrets_file)

SERVICE_NAME = "flint-to-eflint"
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

app = FastAPI(title="eFLINT Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv(
            "AUTH_ALLOWED_ORIGINS",
            "http://localhost:5173,http://localhost:8888,http://127.0.0.1:5173,http://127.0.0.1:8888",
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COOKIE_NAME = os.getenv("AUTH_COOKIE_NAME", "rule_editor_session")
SESSION_SECRET = os.getenv("AUTH_SESSION_SECRET", "replace-me-in-production")
AUTH_DEBUG = _env_bool("AUTH_DEBUG", default=False)

logger = _configure_logging()

def _debug(message: str) -> None:
    if AUTH_DEBUG:
        _log("DEBUG", message)


_debug(f"Loaded secrets file: {_configured_secrets_file}")
_debug(f"COOKIE_NAME={COOKIE_NAME}")
_log(
    "INFO",
    "startup",
    auth_debug=AUTH_DEBUG,
    log_level=LOG_LEVEL,
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

class GenerateRequest(BaseModel):
    interpretation: dict


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode("utf-8").rstrip("=")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * ((4 - len(value) % 4) % 4)
    return base64.urlsafe_b64decode(value + padding)


def _sign_payload(payload: str) -> str:
    signature = hmac.new(
        SESSION_SECRET.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return _b64url_encode(signature)


def _read_session_username(request: Request) -> str | None:
    token = request.cookies.get(COOKIE_NAME)
    if not token or "." not in token:
        _debug("Session cookie missing or malformed")
        return None

    payload_encoded, signature = token.split(".", 1)
    expected_signature = _sign_payload(payload_encoded)
    if not hmac.compare_digest(signature, expected_signature):
        _debug("Session signature mismatch")
        return None

    try:
        payload = _b64url_decode(payload_encoded).decode("utf-8")
        username, expires_at = payload.rsplit(":", 1)
        if int(expires_at) < int(time.time()):
            _debug("Session token expired")
            return None
        _debug(f"Session token accepted for username={username}")
        return username
    except (ValueError, UnicodeDecodeError):
        _debug("Session token payload decode failed")
        return None


def _is_authenticated(request: Request) -> bool:
    username = _read_session_username(request)
    return bool(username)


def _ensure_authenticated(request: Request) -> None:
    if not _is_authenticated(request):
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.post("/generate-eflint")
def generate_eflint_endpoint(req: GenerateRequest, request: Request):
    _ensure_authenticated(request)
    eflint = generate_eflint(req.interpretation)
    return {"eflint": eflint}


@app.get("/health")
def health():
    return {"status": "ok"}