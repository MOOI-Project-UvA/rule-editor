import datetime as dt
import json
import logging
import os
import time
import traceback
import uuid
from typing import Any

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import DESCENDING, MongoClient


def _parse_allowed_origins() -> list[str]:
    raw = os.getenv(
        "AUTH_ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:8888,http://127.0.0.1:5173,http://127.0.0.1:8888",
    )
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


SERVICE_NAME = "mongo-api"
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
    logging.getLogger("pymongo").setLevel(logging.WARNING)
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


def _normalize_username(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def _resolve_username(username_header: str | None, body_username: str | None) -> str:
    return _normalize_username(username_header or body_username)


def _owner_scoped_query(username: str, base_query: dict[str, Any] | None = None) -> dict[str, Any]:
    query = base_query.copy() if base_query else {}
    query["$or"] = [
        {"owner_username": username},
        {
            "owner_username": {"$exists": False},
            "metadata.owner": username,
        },
    ]
    return query


def _parse_mongo_date(value: Any, default_value: dt.datetime) -> dt.datetime:
    if isinstance(value, dt.datetime):
        return value
    if isinstance(value, str):
        try:
            return dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return default_value
    if isinstance(value, dict) and "$date" in value:
        raw = value.get("$date")
        if isinstance(raw, str):
            try:
                return dt.datetime.fromisoformat(raw.replace("Z", "+00:00"))
            except ValueError:
                return default_value
    return default_value


def _serialize_value(value: Any) -> Any:
    if isinstance(value, dt.datetime):
        return value.isoformat()
    if isinstance(value, dict):
        return {key: _serialize_value(val) for key, val in value.items()}
    if isinstance(value, list):
        return [_serialize_value(item) for item in value]
    return value


class SaveTaskRequest(BaseModel):
    task: dict[str, Any]
    username: str | None = None


class ProjectsRequest(BaseModel):
    username: str | None = None


class VersionsRequest(BaseModel):
    project_id: str
    username: str | None = None


class GetTaskRequest(BaseModel):
    project_id: str
    project_version: int | None = None
    username: str | None = None


app = FastAPI(title="Rule Editor Mongo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


def _get_collection():
    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri:
        raise RuntimeError("MONGODB_URI is not configured")

    db_name = os.getenv("MONGODB_DB_NAME", "rule_editor")
    collection_name = os.getenv("MONGODB_COLLECTION_NAME", "task_collection")

    client = MongoClient(
        mongo_uri,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        socketTimeoutMS=10000,
    )
    client.admin.command("ping")
    return client[db_name][collection_name]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/mongo-api/saveTask")
def save_task(
    payload: SaveTaskRequest,
    x_editor_username: str | None = Header(default=None, alias="X-Editor-Username"),
):
    username = _resolve_username(x_editor_username, payload.username)
    if not username:
        raise HTTPException(status_code=401, detail="Missing username context")

    task = payload.task
    now = dt.datetime.now(dt.timezone.utc)
    collection = _get_collection()

    project_id = (
        task.get("project_id")
        or task.get("task_id")
        or (task.get("flint_spec") or {}).get("id")
        or str(uuid.uuid4())
    )

    latest_version = collection.find_one(
        _owner_scoped_query(username, {"project_id": project_id}),
        sort=[("project_version", DESCENDING)],
    )

    next_version = int((latest_version or {}).get("project_version", 0)) + 1
    snapshot_task_id = f"{username}:{project_id}:v{next_version}"

    latest_meta = (latest_version or {}).get("metadata") or {}
    task_meta = task.get("metadata") or {}
    task_eflint = task.get("eflint") or {}

    created_at = latest_meta.get("created_at") or _parse_mongo_date(task_meta.get("created_at"), now)
    modified_at = now
    generated_at = _parse_mongo_date(task_eflint.get("generated_at"), now)
    owner_group = task_meta.get("owner_group") or ""

    document = {
        **task,
        "owner_username": username,
        "project_id": project_id,
        "project_version": next_version,
        "task_id": snapshot_task_id,
        "metadata": {
            **task_meta,
            "owner": username,
            "owner_group": owner_group,
            "created_at": created_at,
            "modified_at": modified_at,
        },
        "eflint": {
            **task_eflint,
            "generated_at": generated_at,
        },
    }

    collection.insert_one(document)

    return {
        "message": "Task version saved to MongoDB!",
        "owner_username": username,
        "project_id": project_id,
        "project_version": next_version,
        "task_id": snapshot_task_id,
    }


@app.post("/mongo-api/projects")
def get_projects(
    payload: ProjectsRequest,
    x_editor_username: str | None = Header(default=None, alias="X-Editor-Username"),
):
    username = _resolve_username(x_editor_username, payload.username)
    if not username:
        raise HTTPException(status_code=401, detail="Missing username context")

    collection = _get_collection()

    projects = list(
        collection.aggregate(
            [
                {
                    "$match": {
                        "$or": [
                            {"owner_username": username},
                            {
                                "owner_username": {"$exists": False},
                                "metadata.owner": username,
                            },
                        ],
                    }
                },
                {"$sort": {"project_id": 1, "project_version": -1}},
                {
                    "$group": {
                        "_id": "$project_id",
                        "latest": {"$first": "$$ROOT"},
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "project_id": "$_id",
                        "latest_version": "$latest.project_version",
                        "task_id": "$latest.task_id",
                        "title": "$latest.metadata.title",
                        "owner": "$latest.metadata.owner",
                        "owner_group": "$latest.metadata.owner_group",
                        "owner_username": "$latest.owner_username",
                        "modified_at": "$latest.metadata.modified_at",
                    }
                },
                {"$sort": {"modified_at": -1}},
            ]
        )
    )

    return {"message": "Projects retrieved!", "projects": _serialize_value(projects)}


@app.post("/mongo-api/project-versions")
def get_project_versions(
    payload: VersionsRequest,
    x_editor_username: str | None = Header(default=None, alias="X-Editor-Username"),
):
    username = _resolve_username(x_editor_username, payload.username)
    if not username:
        raise HTTPException(status_code=401, detail="Missing username context")

    collection = _get_collection()
    query = _owner_scoped_query(username, {"project_id": payload.project_id})

    versions = list(
        collection.find(
            query,
            {
                "_id": 0,
                "owner_username": 1,
                "project_id": 1,
                "project_version": 1,
                "task_id": 1,
                "metadata.title": 1,
                "metadata.owner": 1,
                "metadata.modified_at": 1,
            },
        ).sort("project_version", DESCENDING)
    )

    return {"message": "Project versions retrieved!", "versions": _serialize_value(versions)}


@app.post("/mongo-api/task")
def get_task(
    payload: GetTaskRequest,
    x_editor_username: str | None = Header(default=None, alias="X-Editor-Username"),
):
    username = _resolve_username(x_editor_username, payload.username)
    if not username:
        raise HTTPException(status_code=401, detail="Missing username context")

    collection = _get_collection()

    if payload.project_version is not None:
        base_query = {
            "project_id": payload.project_id,
            "project_version": int(payload.project_version),
        }
        task = collection.find_one(
            _owner_scoped_query(username, base_query),
            {"_id": 0},
        )
    else:
        task = collection.find_one(
            _owner_scoped_query(username, {"project_id": payload.project_id}),
            {"_id": 0},
            sort=[("project_version", DESCENDING)],
        )

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task retrieved!", "task": _serialize_value(task)}