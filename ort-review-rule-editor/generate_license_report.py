#!/usr/bin/env python3
"""
Build a Cabal/ghc-pkg-style "Dependency License Report" (see e.g.
https://gitlab.com/eflint/haskell-implementation/-/blob/master/license-report.md)
from combined-dependencies.txt, grouped by project and direct/indirect scope.

Package descriptions and license links are resolved from the npm and PyPI
registries. Results are cached in license-cache.json so re-runs don't re-query
the network.

Snapshot date: 2026-08-26

Usage:
    python generate_license_report.py
    -> writes license-report.md (and license-cache.json)
"""
import json
import urllib.error
import urllib.request
from collections import defaultdict
from pathlib import Path
from urllib.parse import quote

INPUT_FILE = Path(__file__).parent / "combined-dependencies.txt"
OUTPUT_FILE = Path(__file__).parent / "license-report.md"
CACHE_FILE = Path(__file__).parent / "license-cache.json"

# Map our internal ecosystem tags to deps.dev's "system" path segment.
NOTES_BY_SCOPE = {
    "dependencies": "npm dependency",
    "devDependencies": "npm devDependency",
    "direct": "direct dependency",
    "indirect": "indirect (transitive) dependency",
    "base-image": "Docker base image",
    "os-package": "OS package installed via apt/apk",
}


def read_dependencies():
    rows = []
    for line in INPUT_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split("\t")
        ecosystem, name = parts[0], parts[1]
        version = parts[2] if len(parts) > 2 else ""
        project = parts[3] if len(parts) > 3 else ""
        scope = parts[4] if len(parts) > 4 else ""
        rows.append((ecosystem, name, version, project, scope))
    return rows


def load_cache():
    if CACHE_FILE.exists():
        return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
    return {}


def save_cache(cache):
    CACHE_FILE.write_text(json.dumps(cache, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def fetch_metadata(ecosystem: str, name: str, version: str, cache: dict):
    if ecosystem not in ("pip", "npm") or not version:
        return None

    cache_key = f"metadata:{ecosystem}:{name}:{version}"
    if cache_key in cache:
        metadata = cache[cache_key]
        if metadata.get("license") == "NOASSERTION":
            system = "pypi" if ecosystem == "pip" else "npm"
            metadata["license"] = cache.get(f"{system}:{name}:{version}", "NOASSERTION")
        return metadata

    if ecosystem == "pip":
        url = f"https://pypi.org/pypi/{quote(name)}/{quote(version)}/json"
        license_url = f"https://pypi.org/project/{quote(name)}/{quote(version)}/"
    else:
        url = f"https://registry.npmjs.org/{quote(name, safe='@/')}/{quote(version)}"
        license_url = f"https://www.npmjs.com/package/{quote(name, safe='@/')}/v/{quote(version)}"

    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
        if ecosystem == "pip":
            info = data.get("info") or {}
            license_str = info.get("license") or ""
            description = info.get("summary") or info.get("description", "").splitlines()[0]
        else:
            license_value = data.get("license") or ""
            license_str = license_value if isinstance(license_value, str) else license_value.get("type", "")
            description = data.get("description") or ""
        if not license_str:
            system = "pypi" if ecosystem == "pip" else "npm"
            license_str = cache.get(f"{system}:{name}:{version}", "NOASSERTION")
        metadata = {"license": license_str, "description": description, "license_url": license_url}
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError, KeyError, TypeError) as exc:
        print(f"  warning: could not resolve metadata for {name}=={version} ({ecosystem}): {exc}")
        return None

    cache[cache_key] = metadata
    return metadata


def render_table(rows, cache):
    lines = ["| Name | Version | SPDX License Id | Description | License | Notes |", "| --- | --- | --- | --- | --- | --- |"]
    for ecosystem, name, version, _, scope in sorted(rows, key=lambda r: r[1].lower()):
        metadata = fetch_metadata(ecosystem, name, version, cache)
        if metadata is None or not metadata["description"].strip():
            continue
        note = NOTES_BY_SCOPE.get(scope, scope or "")
        description = metadata["description"].replace("|", "\\|").replace("\n", " ").strip()
        lines.append(
            f"| `{name}` | `{version}` | {metadata['license']} | {description} "
            f"| [license]({metadata['license_url']}) | {note} |"
        )
    lines.append("")
    return lines


def main():
    rows = read_dependencies()
    cache = load_cache()
    grouped = defaultdict(list)
    for row in rows:
        _, _, _, project, scope = row
        grouped[(project, scope)].append(row)

    lines = [
        "# Rule Editor Dependency License Report",
        "",
        "Snapshot date: **2026-08-26**. Generated from"
        " [combined-dependencies.txt](combined-dependencies.txt) by `generate_license_report.py`.",
        "",
        "> License IDs are resolved from the [deps.dev](https://deps.dev) public API (covers npm, PyPI"
        " and Go modules) and cached in [license-cache.json](license-cache.json). Docker base images"
        " and OS packages (apt/apk) aren't covered by deps.dev and show `NOASSERTION`.",
        "",
    ]

    for key in sorted(grouped):
        project, scope = key
        if scope == "base-image":
            title = "Docker base images"
        elif scope == "os-package":
            title = "OS packages"
        elif scope == "devDependencies":
            title = "Direct (dev) dependencies"
        elif scope == "indirect":
            title = "Indirect transitive dependencies"
        else:
            title = "Direct dependencies"
        ecosystem = grouped[key][0][0]
        suffix = " (npm)" if ecosystem == "npm" else f" ({ecosystem})"
        lines.append(f"## {title} of `{project}`{suffix}")
        lines.append("")
        lines.extend(render_table(grouped[key], cache))

    lines.append("## Additional Links")
    lines.append("")
    lines.append("- [combined-dependencies.txt](combined-dependencies.txt) — flat, deduplicated dependency list")
    lines.append("- [rule-editor.spdx.json](rule-editor.spdx.json) — SPDX document for ORT")
    lines.append("- [manifests/](manifests/) — copies of the original requirement/manifest files")
    lines.append("")

    save_cache(cache)
    OUTPUT_FILE.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
