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

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHash, VerifyMismatchError
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


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


_default_secrets_file = Path(__file__).resolve().parent / "secrets.env"
_configured_secrets_file = Path(os.getenv("AUTH_SECRETS_FILE", str(_default_secrets_file)))
_load_env_file(_configured_secrets_file)

SERVICE_NAME = "auth-service"
APP_ENV = os.getenv("APP_ENV", "dev")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()


def _to_python_log_level(level: str) -> int:
    normalized = (level or "INFO").upper()
    if normalized == "WARN":
        normalized = "WARNING"
    return getattr(logging, normalized, logging.INFO)


def _configure_logging() -> logging.Logger:
    logger = logging.getLogger(SERVICE_NAME)
    logger.setLevel(_to_python_log_level(LOG_LEVEL))
    logger.propagate = False

    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter("%(message)s"))
        logger.addHandler(handler)

    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    return logger


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

app = FastAPI(title="Rule Editor Auth API")

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
SESSION_TTL_SECONDS = int(os.getenv("AUTH_SESSION_TTL_SECONDS", "28800"))
COOKIE_SECURE = _env_bool("AUTH_COOKIE_SECURE", default=False)
AUTH_DEBUG = _env_bool("AUTH_DEBUG", default=False)
USERS_JSON_RAW = os.getenv("AUTH_USERS_JSON", "").strip().strip('"').strip("'")

logger = _configure_logging()

_password_hasher = PasswordHasher()


def _load_auth_users() -> dict[str, str]:
    users: dict[str, str] = {}

    if USERS_JSON_RAW:
        try:
            parsed_json = json.loads(USERS_JSON_RAW)
            if isinstance(parsed_json, dict):
                for username, password_hash in parsed_json.items():
                    normalized_username = str(username).strip()
                    normalized_hash = str(password_hash).strip()
                    if normalized_username and normalized_hash:
                        users[normalized_username] = normalized_hash
        except json.JSONDecodeError:
            logger.warning("[AUTH] Ignoring invalid AUTH_USERS_JSON value")

    return users


AUTH_USERS = _load_auth_users()


def _debug(message: str) -> None:
    if AUTH_DEBUG:
        _log("DEBUG", message)


_debug(f"Loaded secrets file: {_configured_secrets_file}")
_debug(f"AUTH_USERS_JSON present: {bool(USERS_JSON_RAW)}")
_debug(f"AUTH_USERS entries loaded: {len(AUTH_USERS)}")
_debug(f"COOKIE_NAME={COOKIE_NAME}, COOKIE_SECURE={COOKIE_SECURE}, SESSION_TTL_SECONDS={SESSION_TTL_SECONDS}")
_log(
    "INFO",
    "startup",
    auth_debug=AUTH_DEBUG,
    auth_users_count=len(AUTH_USERS),
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


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=1, max_length=1000)


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


def _create_session_token(username: str) -> str:
    expires_at = int(time.time()) + SESSION_TTL_SECONDS
    payload = f"{username}:{expires_at}"
    payload_encoded = _b64url_encode(payload.encode("utf-8"))
    signature = _sign_payload(payload_encoded)
    return f"{payload_encoded}.{signature}"


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


def _set_auth_cookie(response: Response, token: str, request: Request) -> None:
    secure_cookie = COOKIE_SECURE or request.headers.get("x-forwarded-proto") == "https"
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=SESSION_TTL_SECONDS,
        httponly=True,
        secure=secure_cookie,
        samesite="lax",
        path="/",
    )


def _clear_auth_cookie(response: Response, request: Request) -> None:
    secure_cookie = COOKIE_SECURE or request.headers.get("x-forwarded-proto") == "https"
    response.set_cookie(
        key=COOKIE_NAME,
        value="",
        max_age=0,
        expires=0,
        httponly=True,
        secure=secure_cookie,
        samesite="lax",
        path="/",
    )


def _verify_credentials(username: str, password: str) -> bool:
    expected_hash = AUTH_USERS.get(username)
    if not expected_hash:
        _debug(f"Login rejected: unknown username (provided={username})")
        return False
    if not AUTH_USERS:
        _debug("Login rejected: no auth users configured")
        return False
    try:
        verified = _password_hasher.verify(expected_hash, password)
        _debug(f"Argon2 verification result: {verified}")
        return verified
    except (VerifyMismatchError, InvalidHash):
        _debug("Login rejected: password mismatch or invalid hash format")
        return False
    except Exception as exc:
        _debug(f"Login rejected: unexpected verify error {type(exc).__name__}: {exc}")
        return False


@app.post("/auth/login")
def login(req: LoginRequest, request: Request, response: Response):
    _debug(f"/auth/login called from origin={request.headers.get('origin')} host={request.headers.get('host')}")
    if not _verify_credentials(req.username, req.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = _create_session_token(req.username)
    _set_auth_cookie(response, token, request)
    _debug(f"Login success: cookie set for username={req.username}")
    return {"authenticated": True, "username": req.username}


@app.post("/auth/logout")
def logout(request: Request, response: Response):
    _clear_auth_cookie(response, request)
    return {"authenticated": False}


@app.get("/auth/me")
def me(request: Request):
    _debug("/auth/me called")
    username = _read_session_username(request)
    if not username or username not in AUTH_USERS:
        _debug(f"/auth/me unauthorized: session_username={username}, configured_users={len(AUTH_USERS)}")
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"authenticated": True, "username": username}


@app.get("/health")
def health():
    return {"status": "ok"}