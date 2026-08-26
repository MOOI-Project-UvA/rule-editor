#!/usr/bin/env python3
"""
Turn combined-dependencies.txt into an SPDX 2.3 document that the OSS Review
Toolkit (ORT) can analyze directly via its built-in "SpdxDocumentFile" package
manager (https://oss-review-toolkit.org/ort/docs/tools/analyzer#spdxdocumentfile).

ORT recognizes any file ending in .spdx.yml/.spdx.yaml/.spdx.json as an
analyzable "project" and turns each listed package into a dependency, which is
the standard way to feed ORT a dependency list that isn't tied to a real
package-manager manifest.

Snapshot date: 2026-08-26

Usage:
    python generate_ort_spdx.py
    -> writes rule-editor.spdx.json next to this script
"""
import json
import re
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import quote

INPUT_FILE = Path(__file__).parent / "combined-dependencies.txt"
OUTPUT_FILE = Path(__file__).parent / "rule-editor.spdx.json"

SNAPSHOT_DATE = "2026-08-26"
DOCUMENT_NAMESPACE = f"https://github.com/Alk0u/rule-editor/spdx/{SNAPSHOT_DATE}"

# Map our internal ecosystem tags to purl (package URL) types.
PURL_TYPES = {
    "pip": "pypi",
    "npm": "npm",
    "go": "golang",
    "docker-image": "docker",
    "os-package": "generic",
}

_PYPI_URL_CACHE: dict[tuple[str, str], str] = {}


def to_spdx_id(text: str) -> str:
    """SPDX IDs may only contain letters, digits, '.' and '-'."""
    return re.sub(r"[^A-Za-z0-9.\-]", "-", text)


def to_purl(ecosystem: str, name: str, version: str) -> str:
    purl_type = PURL_TYPES.get(ecosystem, "generic")
    if purl_type == "npm" and name.startswith("@") and "/" in name:
        scope, _, rest = name.partition("/")
        name_part = f"{quote(scope, safe='')}/{quote(rest, safe='')}"
    else:
        name_part = quote(name, safe="/")
    purl = f"pkg:{purl_type}/{name_part}"
    if version:
        purl += f"@{quote(version, safe='')}"
    return purl


def npm_download_url(name: str, version: str) -> str:
    # Deterministic npm registry tarball URL: registry.npmjs.org/<name>/-/<basename>-<version>.tgz
    basename = name.rsplit("/", 1)[-1]
    return f"https://registry.npmjs.org/{quote(name, safe='@/')}/-/{quote(basename)}-{quote(version)}.tgz"


def go_download_url(module: str, version: str) -> str:
    # Go module proxy escapes uppercase letters as "!" + lowercase letter.
    escaped = re.sub(r"[A-Z]", lambda m: "!" + m.group(0).lower(), module)
    return f"https://proxy.golang.org/{quote(escaped, safe='/.-_!')}/@v/{quote(version, safe='+')}.zip"


def pypi_download_url(name: str, version: str) -> str:
    cache_key = (name, version)
    if cache_key in _PYPI_URL_CACHE:
        return _PYPI_URL_CACHE[cache_key]

    url = "NOASSERTION"
    api_url = f"https://pypi.org/pypi/{quote(name)}/{quote(version)}/json"
    try:
        with urllib.request.urlopen(api_url, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
        release_urls = data.get("urls", [])
        sdist = next((u for u in release_urls if u.get("packagetype") == "sdist"), None)
        chosen = sdist or (release_urls[0] if release_urls else None)
        if chosen:
            url = chosen["url"]
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError, KeyError) as exc:
        print(f"  warning: could not resolve PyPI download URL for {name}=={version}: {exc}")

    _PYPI_URL_CACHE[cache_key] = url
    return url


def to_download_location(ecosystem: str, name: str, version: str) -> str:
    if not version:
        return "NOASSERTION"
    if ecosystem == "npm":
        return npm_download_url(name, version)
    if ecosystem == "go":
        return go_download_url(name, version)
    if ecosystem == "pip":
        return pypi_download_url(name, version)
    # docker-image / os-package aren't source-code dependencies ORT can scan.
    return "NOASSERTION"


def read_dependencies():
    deps = []
    for line in INPUT_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split("\t")
        ecosystem, name = parts[0], parts[1]
        version = parts[2] if len(parts) > 2 else ""
        deps.append((ecosystem, name, version))
    return deps


def build_spdx_document(deps):
    root_id = "SPDXRef-Package-rule-editor"
    packages = [
        {
            "SPDXID": root_id,
            "name": "rule-editor",
            "versionInfo": "NOASSERTION",
            "downloadLocation": "NOASSERTION",
            "licenseConcluded": "NOASSERTION",
            "licenseDeclared": "NOASSERTION",
            "copyrightText": "NOASSERTION",
        }
    ]
    relationships = [
        {
            "spdxElementId": "SPDXRef-DOCUMENT",
            "relatedSpdxElement": root_id,
            "relationshipType": "DESCRIBES",
        }
    ]

    seen_ids = set()
    for index, (ecosystem, name, version) in enumerate(deps, start=1):
        pkg_id = f"SPDXRef-Package-{to_spdx_id(ecosystem)}-{to_spdx_id(name)}-{index}"
        while pkg_id in seen_ids:
            pkg_id += "x"
        seen_ids.add(pkg_id)

        packages.append(
            {
                "SPDXID": pkg_id,
                "name": name,
                "versionInfo": version or "NOASSERTION",
                "downloadLocation": to_download_location(ecosystem, name, version),
                "licenseConcluded": "NOASSERTION",
                "licenseDeclared": "NOASSERTION",
                "copyrightText": "NOASSERTION",
                "externalRefs": [
                    {
                        "referenceCategory": "PACKAGE_MANAGER",
                        "referenceType": "purl",
                        "referenceLocator": to_purl(ecosystem, name, version),
                    }
                ],
            }
        )
        relationships.append(
            {
                "spdxElementId": root_id,
                "relatedSpdxElement": pkg_id,
                "relationshipType": "DEPENDS_ON",
            }
        )

    return {
        "spdxVersion": "SPDX-2.3",
        "dataLicense": "CC0-1.0",
        "SPDXID": "SPDXRef-DOCUMENT",
        "name": "rule-editor-dependencies",
        "documentNamespace": DOCUMENT_NAMESPACE,
        "creationInfo": {
            "created": f"{SNAPSHOT_DATE}T00:00:00Z",
            "creators": ["Tool: compile_dependencies.py-generate_ort_spdx.py"],
        },
        "packages": packages,
        "relationships": relationships,
    }


def main():
    deps = read_dependencies()
    document = build_spdx_document(deps)
    OUTPUT_FILE.write_text(json.dumps(document, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote SPDX document with {len(deps)} packages to {OUTPUT_FILE}")
    print("Point ORT's analyzer at this file, e.g.:")
    print(f"  ort analyze -i {OUTPUT_FILE.name} -o ort-results/")


if __name__ == "__main__":
    main()
