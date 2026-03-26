# eFLINT Server API

Minimal REST wrapper around `eflint-server`.

Each session gets its own isolated `eflint-server` subprocess with its own spec, port, and runtime state.

## Run

From repository root:

```powershell
docker compose up -d --build eflint_server
```

Base URL: `http://localhost:8080`

## Configuration

All parameters are set via environment variables (see `docker-compose.yml`):

| Variable | Default | Description |
|---|---|---|
| `EFLINT_SPEC_PATH` | `/app/default_spec.eflint` | Default spec file copied to new sessions |
| `EFLINT_SESSIONS_DIR` | `/tmp/eflint_sessions` | Directory for per-session spec files |
| `EFLINT_BASE_PORT` | `9001` | Starting port for eFLINT subprocess allocation |
| `EFLINT_MAX_SESSIONS` | `10` | Maximum concurrent sessions |
| `EFLINT_SESSION_TTL_SECONDS` | `1800` | Idle timeout before auto-cleanup (30 min) |
| `EFLINT_CLEANUP_INTERVAL_SECONDS` | `60` | How often the cleanup loop runs |
| `EFLINT_CONNECT_RETRIES` | `30` | TCP connection retries when a session starts |
| `EFLINT_CONNECT_RETRY_DELAY_SECONDS` | `0.1` | Delay between retries |
| `EFLINT_STARTUP_DELAY_SECONDS` | `0.3` | Initial wait before first TCP attempt |
| `LOG_LEVEL` | `INFO` | Service log level (`DEBUG`/`INFO`/`WARN`/`ERROR`) |

## Logging

- Logs are emitted as one-line JSON events to stdout.
- Request logs include `request_id`, `method`, `path`, `status_code`, and `duration_ms`.
- The service propagates `X-Request-ID` in response headers (generated when missing).
- `GET /health` is logged at `DEBUG` level to reduce noise.

## Session model

- Create a session with `POST /sessions`
- Pass that session ID on every further request via header `X-Session-Id`
- Delete the session with `DELETE /sessions/{session_id}` when done

Each session has its own:
- `eflint-server` subprocess on a dedicated port
- Spec file on disk (`/tmp/eflint_sessions/<id>/spec.eflint`)
- Runtime state (facts, history, trace)

Sessions idle longer than `EFLINT_SESSION_TTL_SECONDS` are cleaned up automatically.  
Missing or unknown `X-Session-Id` returns `400` or `404`.

## Session isolation

Every session is fully isolated:

- Registering a spec type in session A does **not** affect session B
- Adding facts in session A does **not** appear in session B's fact list
- A `?Holds` query succeeds in session A (types declared) and returns a compilation error in session B (types not declared)

## Endpoints

- `POST /sessions`
  Create a new session.

- `GET /sessions`
  List active sessions.

- `DELETE /sessions/{session_id}`
  Delete one session.

- `GET /health`  
  Minimal service health response.

- `GET /status`  
  Current eFLINT status response for the session in `X-Session-Id`.

- `GET /facts`  
  Facts in current state for the session in `X-Session-Id`.

- `GET /types`  
  Declared specification types for the session in `X-Session-Id`.

- `GET /history`  
  Current execution history/path for the session in `X-Session-Id`.

- `GET /trace-heads`  
  Current graph heads for the session in `X-Session-Id`.

- `POST /statement`  
  Execute one phrase for the session in `X-Session-Id`.

  Body:
  ```json
  { "text": "+[ landlords](\"landlord1\") ." }
  ```

- `POST /statements`  
  Execute multiple newline-separated phrases for the session in `X-Session-Id`.

  Body:
  ```json
  { "text": "+[ landlords](\"landlord1\") .\n+[Authority (minister)](\"minister1\") ." }
  ```

- `POST /spec/register`  
  Register/extend declarations (`Fact`, `Bool`, `Act`, ...) for the session in `X-Session-Id`.

  Body:
  ```json
  { "text": "Fact [ landlords] Identified by string." }
  ```

- `POST /query/holds`  
  Execute `?Holds(...)` phrase query for the session in `X-Session-Id`.

  Body:
  ```json
  { "text": "?Holds([request subsidy ...])." }
  ```

- `POST /reset`  
  Revert session state.

  Body:
  ```json
  { "value": -1, "destructive": true }
  ```

## End-to-end example (`?Holds`)

### 1) Create session

```powershell
$session = Invoke-RestMethod -Method Post -Uri http://localhost:8080/sessions -ContentType 'application/json' -Body (@{} | ConvertTo-Json -Compress)
$sid = $session.session_id
```

### 2) Reset state

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/reset -Headers @{ 'X-Session-Id' = $sid } -ContentType 'application/json' -Body (@{ value = -1; destructive = $true } | ConvertTo-Json -Compress)
```

### 3) Register specification

```powershell
$spec = @'
Fact [ landlords] Identified by string.
Fact [Authority (minister)] Identified by string.
Bool [above €25,000].
Bool [(New regulation) new adjustment ].
Bool [submitted before the activities took place].
Bool [process the application].
Act [request subsidy (New regulation) new adjustment   landlords Authority (minister)] Actor [ landlords] Recipient [Authority (minister)] Holds when ([(New regulation) new adjustment ] && [submitted before the activities took place] && [above €25,000]) Creates [process the application].
'@
Invoke-RestMethod -Method Post -Uri http://localhost:8080/spec/register -Headers @{ 'X-Session-Id' = $sid } -ContentType 'application/json' -Body (@{ text = $spec } | ConvertTo-Json -Compress)
```

### 4) Add instances

```powershell
$instances = @'
+[ landlords]("landlord1") .
+[Authority (minister)]("minister1") .
+[(New regulation) new adjustment ] .
+[above €25,000] .
+[submitted before the activities took place] .
'@
Invoke-RestMethod -Method Post -Uri http://localhost:8080/statements -Headers @{ 'X-Session-Id' = $sid } -ContentType 'application/json' -Body (@{ text = $instances } | ConvertTo-Json -Compress)
```

### 5) Run `?Holds` query

```powershell
$query = '?Holds([request subsidy (New regulation) new adjustment   landlords Authority (minister)]([ landlords]("landlord1"), [Authority (minister)]("minister1"))).'
Invoke-RestMethod -Method Post -Uri http://localhost:8080/query/holds -Headers @{ 'X-Session-Id' = $sid } -ContentType 'application/json' -Body (@{ text = $query } | ConvertTo-Json -Compress)
```

Check field `query-results` in the response.

### 6) Run `?Holds` query for the old regulation

```powershell
$queryOld = '?Holds([request subsidy (old regulation) old SVOH, the application  landlords Authority (minister)]([ landlords]("landlord1"), [Authority (minister)]("minister1"))).'
Invoke-RestMethod -Method Post -Uri http://localhost:8080/query/holds -Headers @{ 'X-Session-Id' = $sid } -ContentType 'application/json' -Body (@{ text = $queryOld } | ConvertTo-Json -Compress)
```

Check field `query-results` in the response.

### 7) Optional: check service health

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:8080/health
```

### 8) Delete session

```powershell
Invoke-RestMethod -Method Delete -Uri "http://localhost:8080/sessions/$sid"
```
