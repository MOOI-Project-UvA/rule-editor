# Logging Contract (v1)

This document defines the minimum logging standard for all Rule Editor components.

## Scope

Applies to:
- `auth-service`
- `flint-to-eflint`
- `mongo-api`
- `eFLINT_reasoner_backend`
- frontend operational logs (browser-side, limited)

## Goals

- Make logs searchable and comparable across services.
- Enable fast incident triage and root-cause analysis.
- Support later centralization (Grafana/Loki, ELK, OpenSearch, etc.) without refactors.

## Output Format

- **Default format**: JSON (single-line per event).
- **Transport**: stdout/stderr (container-native).
- **Timestamp**: ISO-8601 UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`).

## Required Fields

Every log event MUST include:

- `timestamp` (string, UTC ISO-8601)
- `level` (`DEBUG` | `INFO` | `WARN` | `ERROR`)
- `service` (e.g. `auth-service`)
- `env` (e.g. `dev`, `staging`, `prod`)
- `message` (short, human-readable summary)

Request/response logs MUST also include:
- `request_id` (correlation id)
- `method`
- `path`
- `status_code`
- `duration_ms`

Error logs MUST also include:
- `error_type`
- `error_message`
- `stack_trace` (for server-side exceptions; optional in prod if policy forbids)

## Optional Fields

Use when relevant:
- `username` (only non-sensitive IDs)
- `project_id`
- `project_version`
- `owner_username`
- `upstream_service`
- `retry_count`

## Log Levels

### Universal semantics

- `DEBUG`: Detailed internal diagnostics; disabled by default in production.
- `INFO`: Normal lifecycle and business milestones (startup, login success, save success, health transitions).
- `WARN`: Recoverable issues, degraded behavior, retries, fallbacks.
- `ERROR`: Failed operations, unhandled exceptions, data consistency/security issues.

### Level configuration policy

- Keep **per-service** `LOG_LEVEL` (flexibility per component).
- Optionally support a global fallback `LOG_LEVEL_DEFAULT`.
- Recommended defaults:
  - `dev`: `DEBUG`
  - `staging`: `INFO`
  - `prod`: `INFO`

## Correlation and Traceability

- Standardize on `X-Request-ID`.
- If absent at ingress, generate one and return it in response headers.
- Propagate `X-Request-ID` in internal HTTP calls between services.
- Include `request_id` in every request-scoped log line.

## Message Style

- Keep `message` concise and action-oriented.
- Put dynamic details into structured fields, not long free-text strings.
- Prefer stable event names in fields if needed (e.g. `event=task_saved`).

## Security and Privacy Rules

Never log:
- plaintext passwords
- session cookies
- auth tokens/API keys
- full sensitive payloads that may contain personal data

If needed for debugging:
- log only metadata (sizes, IDs, counts), not secret content.
- mask values (`***`) for partially visible identifiers.

## Health and Startup Logging

At startup, each service SHOULD log:
- service name/version
- effective `LOG_LEVEL`
- enabled major integrations (without secrets)

Health endpoints SHOULD log at most `DEBUG` (or sampled) to avoid noise.

## Retention and Rotation (Minimum)

- In containerized environments, rely on platform/runtime rotation settings.
- Keep enough retention for incident analysis (recommended: 7–30 days depending on environment).

## Adoption Checklist

Each service should implement:

1. JSON logger setup
2. `LOG_LEVEL` env support
3. request logging middleware with `request_id`, status, latency
4. exception logging hook
5. redaction guardrails for sensitive fields

## Versioning

- Current version: `v1`
- Changes should be backward-compatible where possible and documented in PR notes.
