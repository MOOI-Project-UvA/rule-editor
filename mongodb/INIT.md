# MongoDB Initialization Runbook

This is the recommended initialization path for replacing Triply with MongoDB.

## Files added

- [docker-compose.yml](docker-compose.yml) uses:
  - `.env` values for credentials
  - named volume `mongodb_data` for `/data/db`
  - boot-time init scripts in `./init`
- [init/01-init-rule-editor.js](init/01-init-rule-editor.js):
  - creates app user
  - creates/updates `task_collection` validator
  - creates indexes
- [.env.example](.env.example): credential template

## 1) Prepare environment

From the `mongodb` folder:

1. Copy env template:

```bash
cp .env.example .env
```

2. Edit `.env` and set strong passwords.

## 2) First initialization (clean start)

If this is your first start (or you want to re-run entrypoint init), start with a fresh Mongo volume.

```bash
docker compose down -v
docker compose up -d
```

Entry-point init scripts are executed only on first initialization of the Mongo data volume.

## 3) Verify initialization

```bash
docker compose exec mongodb mongosh -u root -p "<ROOT_PASSWORD>" --authenticationDatabase admin --eval "db.getSiblingDB('rule_editor').task_collection.getIndexes()"
```

Expected indexes include:
- `task_id` (unique)
- `metadata.owner`
- `metadata.owner_group`
- `metadata.modified_at`

## 4) App connection string

Use the app user (not root):

```text
mongodb://rule_editor_app:<APP_DB_PASSWORD>@localhost:27017/rule_editor?authSource=rule_editor
```

## 5) Re-apply schema later (existing data dir)

If data already exists, entrypoint scripts do not rerun automatically. Run this manually:

```bash
docker compose exec mongodb mongosh -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin /docker-entrypoint-initdb.d/01-init-rule-editor.js
```

This script is idempotent for schema and indexes.

## Notes for Online EXPORT / IMPORT

- Online EXPORT should write the same JSON structure you already export locally.
- Online IMPORT should read that document and use:
  - `flint_spec` for interpretation load
  - `eflint.specification` and `eflint.scenario` for executable state load
