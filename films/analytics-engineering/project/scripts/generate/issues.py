"""Writes an issue for each owner with a test that didn't pass in the last run: what didn't pass,
and the date to answer by. The scorecard shows everyone; this goes to each owner.

Each issue names its owner and where it goes (models/_shared/_shared__owners.yml), and for each of
their tests: the test, its domain and dimension, the rows it found, why its limit is set where it
is (the test's description, or its column's, where the agreed level is written), a cause for the owner to write in, the date
to answer by, and what closes it: the test passing. A failure is due the next working day; a
warning, a week after the run. A test dbt skipped because an earlier one failed isn't anyone's
issue: the failure that stopped it is.

At the university, a failure goes to its owner that morning, and warnings in one issue every
Monday. Here it's a dry run: the owners are fictional, so the issues are written to target/issues/,
one Markdown file per owner, and CI adds them to the run's summary.

    dbt build --profiles-dir . --no-partial-parse
    python scripts/generate/issues.py
"""
import json
import re
import shutil
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "target" / "manifest.json"
RESULTS = ROOT / "target" / "run_results.json"
REGISTER = ROOT / "models" / "_shared" / "_shared__owners.yml"
TARGET = ROOT / "target" / "issues"

# The scorecard's way of finding a test's domain.
from scorecard import domain_of  # noqa: E402


def next_working_day(day):
    day += timedelta(days=1)
    while day.weekday() >= 5:
        day += timedelta(days=1)
    return day


def why(test, nodes):
    """Why the limit is there: the test's description, else that of the column it checks, where the
    project writes the agreed level (docs/conventions.md, Tests)."""
    if test.get("description"):
        return test["description"]
    attached = nodes.get(test.get("attached_node") or "", {})
    column = (attached.get("columns") or {}).get(test.get("column_name") or "", {})
    return column.get("description") or ""


def main():
    for path in (MANIFEST, RESULTS):
        if not path.exists():
            raise SystemExit(f"{path.relative_to(ROOT)} is missing: run dbt build --profiles-dir . first")
    manifest = json.loads(MANIFEST.read_text())
    run = json.loads(RESULTS.read_text())
    nodes = {**manifest["nodes"], **manifest["sources"]}
    register = yaml.safe_load(REGISTER.read_text()) or {}
    emails = {o["name"]: o["email"] for o in register["owners"]}
    ran_on = datetime.fromisoformat(run["metadata"]["generated_at"].replace("Z", "+00:00")).date()

    by_owner = defaultdict(list)
    for result in run["results"]:
        test = manifest["nodes"].get(result["unique_id"])
        if not test or test["resource_type"] != "test" or result["status"] not in ("fail", "error", "warn"):
            continue
        meta = test["meta"]
        due = next_working_day(ran_on) if result["status"] in ("fail", "error") else ran_on + timedelta(days=7)
        by_owner[meta.get("owner", "no owner")].append({
            "status": result["status"], "name": test["name"], "domain": domain_of(test, nodes),
            "dimension": meta.get("dimension", "unknown"), "rows": result.get("failures"),
            "why": " ".join(why(test, nodes).split()), "due": due})

    if TARGET.exists():
        shutil.rmtree(TARGET)
    TARGET.mkdir(parents=True)
    for owner, tests in sorted(by_owner.items()):
        due = min(t["due"] for t in tests)
        lines = [f"# Data quality: {len(tests)} test{'s' if len(tests) > 1 else ''} to answer, by {due:%-d %B %Y}", "",
                 f"**Owner:** {owner} · **To:** {emails.get(owner, 'not in the owners register')} · "
                 f"**From the run of** {ran_on:%-d %B %Y}", ""]
        for t in sorted(tests, key=lambda t: (t["due"], t["name"])):
            lines += [f"## `{t['name']}`", "",
                      f"- **Status:** {t['status']}, {t['rows']} row{'s' if t['rows'] != 1 else ''}",
                      f"- **Domain:** `{t['domain']}` · **Dimension:** {t['dimension']}",
                      f"- **Why the limit is there:** {t['why'] or 'the test has no description: say why, in its YAML'}",
                      "- **Cause:** *(the owner writes it in)*",
                      f"- **Due:** {t['due']:%-d %B %Y}",
                      f"- **Closed when:** `{t['name']}` passes "
                      f"(`dbt build --select {t['name']} --profiles-dir .`)", ""]
        slug = re.sub(r"[^a-z0-9]+", "-", owner.lower()).strip("-")
        (TARGET / f"{slug}.md").write_text("\n".join(lines))
    print(f"{len(by_owner)} issue(s) in {TARGET.relative_to(ROOT)}/, from the run of {ran_on}"
          + (": " + ", ".join(sorted(by_owner)) if by_owner else ": every test passed"))


if __name__ == "__main__":
    main()
