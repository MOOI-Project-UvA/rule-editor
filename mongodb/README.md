# MongoDB Overview

This folder contains the MongoDB setup and schema used by the Rule Editor to store exported interpretation artifacts and their versions.

## What is stored

Database: `rule_editor`  
Collection: `task_collection`

Each saved entry is a **snapshot** of one project version and contains:

- `owner_username`: canonical user id used to scope read/write access
- `project_id`: stable id for a project (groups all versions)
- `project_version`: integer version within that project
- `task_id`: snapshot id (`<owner_username>:<project_id>:v<project_version>`)
- `metadata`: owner, group, title, timestamps, optional tags/description
- `flint_spec`: FLINT interpretation payload
- `saved_artifact`: serialized export content (`application/json`)
- `eflint`: generated `specification` + `scenario` (+ generation metadata)

Schema validator source: [task_collection.validator.json](task_collection.validator.json)

---

## Save/Load logic (versioned projects)

### Save to MongoDB

When user saves remotely to MongoDB:

1. Resolve `owner_username` from the active editor identity.
2. Determine `project_id` from current interpretation identity.
3. Query latest existing version for that `(owner_username, project_id)` pair.
4. Set `project_version = latest + 1` (or `1` for first save).
5. Insert a **new** snapshot document.

So each save creates a new version, rather than overwriting an existing row.

### Load from MongoDB

Load flow supports two modes (always scoped to `owner_username`):

- **Default load**: user selects a project, app loads highest `project_version` for that user.
- **Specific version load**: user picks a project and chooses an exact `project_version` for that user.

Loaded snapshot is applied to:

- interpretation (`flint_spec`)
- executable fields (`eflint.specification`, `eflint.scenario`)

---

## Important design decisions

- **Per-user ownership key** via `owner_username` for filtering and indexing.
- **Versioning by integer** (`project_version`), no `is_latest` flag.
- **Latest = max(project_version)** for deterministic behavior.
- **Project grouping is explicit** via `project_id` (not title-only).
- **Legacy fallback on reads**: if `owner_username` is absent, ownership falls back to `metadata.owner`.
- **Mongo endpoint decoupled from Triply key flow**:
  - Mongo save/load endpoints are not under `/api/serverless/*` edge protection path.
- **Fast-fail Mongo connectivity** in functions:
  - low connect/server-selection timeouts + initial ping.
- **Indexes for correctness and performance**:
  - unique `task_id`
  - unique (`owner_username`, `project_id`, `project_version`)
  - metadata lookup/sort indexes

---

## Related files

- Init script: [init/01-init-rule-editor.js](init/01-init-rule-editor.js)
- Runbook: [INIT.md](INIT.md)
- Deployment notes: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Example document: [task_document.example.json](task_document.example.json)
