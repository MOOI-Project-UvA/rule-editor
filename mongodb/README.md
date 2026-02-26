# MongoDB Overview

This folder contains the MongoDB setup and schema used by the Rule Editor to store exported interpretation artifacts and their versions.

## What is stored

Database: `rule_editor`  
Collection: `task_collection`

Each saved entry is a **snapshot** of one project version and contains:

- `project_id`: stable id for a project (groups all versions)
- `project_version`: integer version within that project
- `task_id`: snapshot id (`<project_id>:v<project_version>`)
- `metadata`: owner, group, title, timestamps, optional tags/description
- `flint_spec`: FLINT interpretation payload
- `saved_artifact`: serialized export content (`application/json`)
- `eflint`: generated `specification` + `scenario` (+ generation metadata)

Schema validator source: [task_collection.validator.json](task_collection.validator.json)

---

## Save/Load logic (versioned projects)

### Save to MongoDB

When user saves remotely to MongoDB:

1. Determine `project_id` from current interpretation identity.
2. Query latest existing version for that `project_id`.
3. Set `project_version = latest + 1` (or `1` for first save).
4. Insert a **new** snapshot document.

So each save creates a new version, rather than overwriting an existing row.

### Load from MongoDB

Load flow supports two modes:

- **Default load**: user selects a project, app loads highest `project_version` (latest).
- **Specific version load**: user picks a project and chooses an exact `project_version`.

Loaded snapshot is applied to:

- interpretation (`flint_spec`)
- executable fields (`eflint.specification`, `eflint.scenario`)

---

## Important design decisions

- **Versioning by integer** (`project_version`), no `is_latest` flag.
- **Latest = max(project_version)** for deterministic behavior.
- **Project grouping is explicit** via `project_id` (not title-only).
- **Mongo endpoint decoupled from Triply key flow**:
  - Mongo save/load endpoints are not under `/api/serverless/*` edge protection path.
- **Fast-fail Mongo connectivity** in functions:
  - low connect/server-selection timeouts + initial ping.
- **Indexes for correctness and performance**:
  - unique `task_id`
  - unique (`project_id`, `project_version`)
  - metadata lookup/sort indexes

---

## Related files

- Init script: [init/01-init-rule-editor.js](init/01-init-rule-editor.js)
- Runbook: [INIT.md](INIT.md)
- Deployment notes: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Example document: [task_document.example.json](task_document.example.json)
