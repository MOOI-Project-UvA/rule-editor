# OSS Review Materials - Rule Editor

This folder is a point-in-time snapshot of the dependency and Docker inputs in the Rule Editor repository. The copied files under `manifests/` are inputs for the local generators and should be refreshed whenever the source manifests change.

Snapshot date: **2026-08-26**

## Inputs

- `manifests/python/` contains the five service `requirements.txt` files.
- `manifests/npm/` contains `gui/package.json` and `gui/package-lock.json`.
- `manifests/docker/` contains the Dockerfiles for `auth-service`, `eflint_server`, `flint-to-eflint`, `gui`, and `mongo-api`.
- `docker-compose.yml`, `mongodb/docker-compose.yml`, and `netlify.toml` do not declare versioned application dependencies, so they are not copied here.

## Regenerate the snapshot

From this directory:

```powershell
python compile_dependencies.py
python generate_ort_spdx.py
python generate_license_report.py
python validate_report.py
```

The commands produce:

- `combined-dependencies.txt`: sorted, deduplicated dependency inventory.
- `rule-editor.spdx.json`: SPDX 2.3 document suitable for ORT's `SpdxDocumentFile` analyzer.
- `license-report.md`: dependency license tables grouped by service, ecosystem, and scope, including descriptions and links to the version-specific license pages.
- `license-cache.json`: cached responses from the deps.dev public API.

`validate_report.py` checks that every rendered row has a version, description, SPDX identifier, and license link.

The license report resolves descriptions and declared licenses for npm and PyPI packages through their registries. Each included row links to the package's version-specific license page. Docker base images, OS packages, and packages whose registry metadata cannot be resolved are omitted from the report, while remaining in the combined inventory and SPDX document.

## Run ORT with Docker

Requires Docker:

```powershell
.\run-ort-docker.ps1
```

This runs ORT 13.0.0 against the generated SPDX document and writes the static HTML report to `ort-results/report/`. The generated `ort-results/` and `spdx-input/` folders are disposable.

For the most accurate ORT analysis, point ORT at the original manifests in the live repository. This folder is intended as a reproducible offline snapshot.
