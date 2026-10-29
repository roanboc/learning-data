"""Writes the data quality scorecard from the last run: every test, by the domain of the data it
checks and its quality dimension, with what failed and who owns it.

The scorecard isn't a survey or an opinion: each cell counts the tests that ran, from
target/run_results.json, and each test's owner and dimension come from its meta (the governance
check makes sure every test has both). A test that warns passed, but over a limit its owner
agreed to watch; a test that fails, or errors, stops the build, and its owner is named below the
table. A test that didn't run, because an earlier one failed and dbt skipped what's downstream,
counts as not run, never as failed. Tests in tests/governance/ check the project, not the data, and aren't scored.

On Databricks, the platform checks the tables too, and its results join the tests' with --platform:
the loading pipeline's expectations and the monitors, from analyses/quality/platform_results.sql,
saved as CSV. Each check is given its table's owner and domain from the source the project reads it
as, and goes in a table of its own, under the tests', with what didn't pass under both.

    dbt build --profiles-dir .
    python scripts/generate/scorecard.py           # write docs/scorecard.md from the last run
    python scripts/generate/scorecard.py --check   # fail if it's out of date
    python scripts/generate/scorecard.py --platform platform_results.csv --out scorecard.md
"""
import argparse
import csv
import json
import os
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "target" / "manifest.json"
RESULTS = ROOT / "target" / "run_results.json"
TARGET = ROOT / "docs" / "scorecard.md"
DIMENSIONS = ["completeness", "uniqueness", "validity", "consistency", "accuracy", "timeliness"]


def domain_of(test, nodes):
    """The domain of the data a test checks: the meta.domain of the model, seed or source it's
    attached to, else of the first it reads. An intermediate model has none: its folder is its
    domain (models/intermediate/student/)."""
    parents = ([test["attached_node"]] if test.get("attached_node") else []) + test["depends_on"]["nodes"]
    for unique_id in parents:
        node = nodes.get(unique_id)
        if node and node.get("meta", {}).get("domain"):
            return node["meta"]["domain"]
        if node and node["original_file_path"].startswith("models/intermediate/"):
            return Path(node["original_file_path"]).parent.name
    return "unknown"


def cell(counts):
    if not counts:
        return ""
    passed = counts["pass"] + counts["warn"]
    text = f"{passed}/{counts['total']}"
    notes = [f"{counts[k]} {k}" for k in ("warn", "fail", "error") if counts[k]]
    if counts["skipped"]:
        notes.append(f"{counts['skipped']} not run")
    return text + (f" ({', '.join(notes)})" if notes else "")


def platform_results(path, manifest):
    """The platform's checks, from analyses/quality/platform_results.sql's CSV: each one given the
    owner and domain of the source its table is (by schema and name; by name alone if the platform
    gave no schema and only one source has that name)."""
    sources = list(manifest["sources"].values())
    checks = []
    with open(path, newline="") as f:
        for row in csv.DictReader(f):
            found = [s for s in sources if s["identifier"] == row["table_name"]
                     and (s["schema"] == row["schema_name"] or not row["schema_name"])]
            if len(found) != 1:
                raise SystemExit(f"{row['schema_name']}.{row['table_name']} in {path} isn't one of the project's sources")
            meta = found[0]["meta"]
            checks.append({**row, "owner": meta.get("owner", "no owner"), "domain": meta.get("domain", "unknown"),
                           "name": f"`{row['check_name']}` on `{found[0]['schema']}.{row['table_name']}`",
                           "rows": int(row["rows"]) if row["rows"] else None})
    return checks


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="fail if docs/scorecard.md is out of date")
    parser.add_argument("--platform", type=Path, help="the platform's results too: a CSV of analyses/quality/platform_results.sql")
    parser.add_argument("--out", type=Path, default=TARGET, help="where to write it (docs/scorecard.md)")
    args = parser.parse_args()
    for path in (MANIFEST, RESULTS):
        if not path.exists():
            raise SystemExit(f"{path.relative_to(ROOT)} is missing: run dbt build --profiles-dir . first")
    manifest = json.loads(MANIFEST.read_text())
    nodes = {**manifest["nodes"], **manifest["sources"]}
    results = {r["unique_id"]: r for r in json.loads(RESULTS.read_text())["results"]}

    table = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
    totals = defaultdict(lambda: defaultdict(int))
    problems, skipped = [], defaultdict(int)
    for unique_id, test in sorted(manifest["nodes"].items()):
        if test["resource_type"] != "test" or test["original_file_path"].startswith("tests/governance/"):
            continue
        result = results.get(unique_id)
        if not result:
            raise SystemExit(f"{test['name']} didn't run in the last run: run the whole build, then the scorecard")
        status = result["status"]
        meta = test["meta"]
        if not meta.get("dimension"):
            raise SystemExit(f"{test['name']} has no meta.dimension. A partial parse can drop it: run dbt build "
                             "--no-partial-parse, then the scorecard (or fix the test, with scripts/check/governance.py)")
        domain, dimension = domain_of(test, nodes), meta.get("dimension", "unknown")
        for counts in (table[domain][dimension], totals[dimension], table[domain]["all"], totals["all"]):
            counts[status] += 1
            counts["total"] += 1
        if status == "skipped":
            skipped[domain] += 1
        elif status != "pass":
            problems.append((status, domain, dimension, test["name"], meta.get("owner", "no owner"),
                             result.get("failures")))

    used = [d for d in DIMENSIONS if totals[d]["total"]]
    made = ("*Generated by `scripts/generate/scorecard.py` from the last run (`target/run_results.json`). "
            "Don't edit it: run the build, then the script. CI fails if it's out of date.*")
    if args.platform:
        made = ("*Generated by `scripts/generate/scorecard.py` from the last run (`target/run_results.json`) and the "
                f"platform's results (`{args.platform.name}`). Don't edit it: run the build and the platform's query, then the script.*")
    lines = ["# Data quality scorecard", "", made, "",
             "Every test that ran, by the domain of the data it checks and its quality dimension: how many "
             "passed, of how many. A warning passed, over a limit its owner agreed to watch; a failure stops "
             "the build, and the tests on what's built from it don't run. Each test's owner and dimension are in its `meta` (docs/conventions.md, *Governance*).", "",
             "| Domain | " + " | ".join(used) + " | All |",
             "|---|" + "---|" * (len(used) + 1)]
    for domain in sorted(table):
        lines.append(f"| `{domain}` | " + " | ".join(cell(table[domain].get(d)) for d in used)
                     + f" | {cell(table[domain]['all'])} |")
    lines.append("| **All** | " + " | ".join(cell(totals[d]) for d in used) + f" | {cell(totals['all'])} |")
    if args.platform:
        # The platform's checks, a table of their own: a warning is rows kept out, or a table unlike itself
        ptable = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
        ptotals = defaultdict(lambda: defaultdict(int))
        for c in platform_results(args.platform, manifest):
            for counts in (ptable[c["domain"]][c["dimension"]], ptotals[c["dimension"]], ptable[c["domain"]]["all"], ptotals["all"]):
                counts[c["status"]] += 1
                counts["total"] += 1
            if c["status"] not in ("pass", "skipped"):
                problems.append((c["status"], c["domain"], c["dimension"], c["name"], c["owner"], c["rows"] or ""))
        pused = [d for d in DIMENSIONS if ptotals[d]["total"]]
        lines += ["", "## On the platform", "",
                  "Every check the platform ran on the tables last night, by the domain of the table it checks and its "
                  "quality dimension: the loading pipeline's expectations, and the monitors. A warning is rows kept out "
                  "at loading, or a table that wasn't as usual: nothing stopped, and the table's owner is told. Not run: "
                  "a monitor still learning the table. Each table's owner and domain are its source's `meta`.", "",
                  "| Domain | " + " | ".join(pused) + " | All |", "|---|" + "---|" * (len(pused) + 1)]
        for domain in sorted(ptable):
            lines.append(f"| `{domain}` | " + " | ".join(cell(ptable[domain].get(d)) for d in pused)
                         + f" | {cell(ptable[domain]['all'])} |")
        lines.append("| **All** | " + " | ".join(cell(ptotals[d]) for d in pused) + f" | {cell(ptotals['all'])} |")
    lines += ["", "## Not passed", ""]
    if problems or skipped:
        lines += [f"| Status | Domain | Dimension | {'Test or check' if args.platform else 'Test'} | Owner | Rows |",
                  "|---|---|---|---|---|---|"]
        for status, domain, dimension, name, owner, failures in sorted(problems):
            lines.append(f"| {status} | `{domain}` | {dimension} | {name if '`' in name else f'`{name}`'} | {owner} | {failures} |")
        # Tests dbt skipped: one line per domain, with the failures that stopped them.
        stopped = ", ".join(f"`{name}`" for status, _, _, name, _, _ in sorted(problems) if status in ("fail", "error"))
        for domain, count in sorted(skipped.items()):
            lines.append(f"| not run | `{domain}` | | {count} test{'s' if count > 1 else ''} | | "
                         f"an earlier test failed: {stopped or 'see the run'} |")
    else:
        lines.append("Every test and check passed." if args.platform else "Every test passed.")
    text = "\n".join(lines) + "\n"

    if args.check:
        if args.platform:
            raise SystemExit("--check is for docs/scorecard.md, which scores the tests only")
        if not TARGET.exists() or TARGET.read_text() != text:
            print("docs/scorecard.md is out of date: run python scripts/generate/scorecard.py", file=sys.stderr)
            sys.exit(1)
        print("docs/scorecard.md is up to date")
    else:
        args.out.write_text(text)
        print(f"wrote {os.path.relpath(args.out)}")


if __name__ == "__main__":
    main()
