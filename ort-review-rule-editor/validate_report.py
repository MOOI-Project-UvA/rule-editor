import re
import sys
from pathlib import Path

report_path = Path("license-report.md")
if not report_path.exists():
    print(f"Error: {report_path} does not exist.")
    sys.exit(1)

lines = report_path.read_text(encoding="utf-8").splitlines()

current_section = None
section_rows = {}
section_headers = {}

# Parse headers and data
all_warnings = []
noassertions = []

expected_header = ["Name", "Version", "SPDX License Id", "Description", "License", "Notes"]

# We'll go line by line
i = 0
while i < len(lines):
    line = lines[i].strip()
    if line.startswith("## "):
        current_section = line[3:].strip()
        section_rows[current_section] = 0
        section_headers[current_section] = []
        i += 1
        continue
    
    # Check if this is the start of a table
    if line.startswith("|") and current_section:
        # Check if the header matches
        cols = [c.strip() for c in line.split("|")[1:-1]]
        # If it matches our table headers, let's validate it
        if cols == expected_header:
            section_headers[current_section].append(cols)
            # Next line should be separator
            i += 1
            if i < len(lines):
                sep_line = lines[i].strip()
                if not (sep_line.startswith("|") and "---" in sep_line):
                    all_warnings.append(f"In section '{current_section}', expected table separator line after header, got: {sep_line}")
            # Now let's process data rows for this table
            i += 1
            while i < len(lines):
                row_line = lines[i].strip()
                if not row_line.startswith("|"):
                    # Table ends or empty line
                    break
                row_cols = [c.strip() for c in row_line.split("|")[1:-1]]
                if not row_cols:
                    i += 1
                    continue
                
                # Check column count
                if len(row_cols) != 6:
                    all_warnings.append(f"In section '{current_section}', row has {len(row_cols)} columns instead of 6: {row_line}")
                else:
                    section_rows[current_section] += 1
                    name, version, spdx, desc, lic, notes = row_cols
                    
                    # 1. Every data row has a [license](...) link
                    # Let's verify [license](...) regular expression
                    if not re.search(r"\[license\]\(https?://.*\)", lic):
                        all_warnings.append(f"In '{current_section}', package '{name}' is missing/invalid license link: {lic}")
                    
                    # 2. Descriptions are populated for included rows
                    if not desc:
                        all_warnings.append(f"In '{current_section}', package '{name}' has empty description")
                    
                    # 3. Report any rows still showing NOASSERTION
                    if spdx == "NOASSERTION":
                        noassertions.append((current_section, name, version))
                        
                i += 1
            continue
    i += 1

print("--- VALIDATION RESULTS ---")
print(f"Total sections scanned: {len(section_rows)}")
print("\nRow distribution by section:")
for sect, count in section_rows.items():
    print(f"- {sect}: {count} rows")
    # Verify header existence
    headers_found = section_headers.get(sect, [])
    if not headers_found:
        print(f"  WARNING: Section '{sect}' does not have the expected active table or matching headers!")

print("\n--- WARNINGS ---")
if all_warnings:
    for w in all_warnings:
        print(f"WARNING: {w}")
else:
    print("None!")

print("\n--- NOASSERTION LICENSE IDS ---")
if noassertions:
    print(f"Total NOASSERTION rows: {len(noassertions)}")
    for sect, name, ver in noassertions:
        print(f"- {sect}: {name} ({ver})")
else:
    print("None!")
