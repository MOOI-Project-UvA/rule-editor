<#
.SYNOPSIS
    Run the OSS Review Toolkit (ORT) analyzer + reporter against the SPDX
    dependency snapshot in this folder, using the official ORT Docker image.

.DESCRIPTION
    Mounts this folder into the ORT container and runs:
    1. `ort analyze`  -> reads rule-editor.spdx.json, writes analyzer-result.json
      2. `ort report`   -> turns the analyzer result into a static HTML report

    Note: this script does NOT run `ort scan`. ORT's bundled scanner is ScanCode,
    which takes several hours to fully scan ~140 packages' downloaded source.
    For real per-package license IDs, use generate_license_report.py instead —
    it resolves them from the deps.dev API in seconds (see README.md).

.EXAMPLE
    ./run-ort-docker.ps1
#>

$ErrorActionPreference = "Stop"

$ortImage = "ghcr.io/oss-review-toolkit/ort:13.0.0"
$workDir = $PSScriptRoot
$outDir = Join-Path $workDir "ort-results"
# ORT's analyzer -i must be a directory; isolate the SPDX file here so ORT
# doesn't also try to analyze the copied manifests/ files as separate projects.
$spdxInputDir = Join-Path $workDir "spdx-input"

# ORT 13.x refuses to write into an existing output directory (no --force-overwrite option).
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue $outDir
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
New-Item -ItemType Directory -Force -Path $spdxInputDir | Out-Null
Copy-Item -Force (Join-Path $workDir "rule-editor.spdx.json") $spdxInputDir

# Only pull if the image isn't already available locally, so re-runs don't re-download it.
$imageExists = docker images -q $ortImage
if (-not $imageExists) {
    Write-Host "Pulling $ortImage ..."
    docker pull $ortImage
} else {
    Write-Host "Using local image $ortImage (already pulled)."
}

Write-Host "Running ORT analyzer against rule-editor.spdx.json ..."
docker run --rm `
    -v "${workDir}:/project" `
    -w /project `
    $ortImage analyze `
    -i /project/spdx-input `
    -o /project/ort-results/analyzer `
    -f JSON

Write-Host "Generating static HTML report ..."
docker run --rm `
    -v "${workDir}:/project" `
    -w /project `
    $ortImage report `
    -i /project/ort-results/analyzer/analyzer-result.json `
    -o /project/ort-results/report `
    -f StaticHtml

Write-Host "Done. Results in $outDir"

