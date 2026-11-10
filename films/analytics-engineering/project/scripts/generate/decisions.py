"""Checks the decision logs and writes their index, docs/decisions.md.

A decision is permanent: what was decided, why, and who decided. Each scope keeps its own log,
next to what it's about:

    models/_shared/_shared__decisions.yml               the project as a whole
    sources/<system>/_<system>__decisions.yml           a source
    models/core/<domain>/_<domain>__decisions.yml       a core domain
    models/marts/<consumer>/_<consumer>__decisions.yml  a consumer

The schema is in requirements/README.md. This script checks every log, and writes one read-only
index. A decision may relate to another decision, to a known limitation (meta.limitations on a
model or source) or to a requirement that's still open (requirements/).

    python scripts/generate/decisions.py           # write docs/decisions.md
    python scripts/generate/decisions.py --check   # fail if a log is wrong or the index is out of date
"""
import argparse
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
INDEX = ROOT / "docs" / "decisions.md"

# The steps of docs/process.md, in order: the moment in the data lifecycle a decision belongs to.
STEPS = ["scope", "source_reality", "consumer_output", "gaps_and_contracts", "tests", "build",
         "validate", "review_and_ship", "written_once", "operate_and_evolve"]
STATUSES = {"proposed", "agreed", "superseded"}
REQUIRED = ["id", "step", "title", "text", "why", "status"]
# Where each kind of log lives.
HOMES = {
    "project": lambda name: ROOT / "models" / "_shared" / "_shared__decisions.yml",
    "source": lambda name: ROOT / "sources" / name / f"_{name}__decisions.yml",
    "domain": lambda name: ROOT / "models" / "core" / name / f"_{name}__decisions.yml",
    "consumer": lambda name: ROOT / "models" / "marts" / name / f"_{name}__decisions.yml",
}


def logs():
    paths = sorted(list((ROOT / "models").glob("**/_*__decisions.yml"))
                   + list((ROOT / "sources").glob("*/_*__decisions.yml")))
    return [(path, *(lambda log: (log["scope"], log.get("decisions") or []))(yaml.safe_load(path.read_text())))
            for path in paths]


def other_ids():
    """The ids a decision may also relate to: known limitations and open requirements."""
    ids = set()
    for path in list((ROOT / "models").glob("**/*.yml")) + list((ROOT / "sources").glob("**/*.yml")):
        ids |= set(re.findall(r"\bid: (LIM-[A-Z]+-\d{2})\b", path.read_text()))
    for path in (ROOT / "requirements").glob("**/_*__requirements.yml"):
        ids |= {item["id"] for item in yaml.safe_load(path.read_text()).get("items") or []}
    return ids


def validate(loaded):
    problems, seen = [], {}
    for path, scope, decisions in loaded:
        where = path.relative_to(ROOT)
        kind, name, code = scope.get("kind"), scope.get("name"), scope.get("code")
        if kind not in HOMES:
            problems.append(f"{where}: scope kind must be one of {', '.join(HOMES)}")
            continue
        if path != HOMES[kind](name):
            problems.append(f"{where}: the {kind} log for {name} belongs at {HOMES[kind](name).relative_to(ROOT)}")
        for decision in decisions:
            decision_id = decision.get("id", "?")
            if not re.fullmatch(rf"DEC-{code}-\d{{2}}", decision_id):
                problems.append(f"{where}: {decision_id} should be DEC-{code}-<nn>")
            if decision_id in seen:
                problems.append(f"{where}: {decision_id} is also in {seen[decision_id]}")
            seen[decision_id] = where
            for field in REQUIRED:
                if not decision.get(field):
                    problems.append(f"{where}: {decision_id} has no {field}")
            if decision.get("step") not in STEPS:
                problems.append(f"{where}: {decision_id} has step {decision.get('step')!r}; use one of {', '.join(STEPS)}")
            if decision.get("status") not in STATUSES:
                problems.append(f"{where}: {decision_id} has status {decision.get('status')!r}; use one of {', '.join(sorted(STATUSES))}")
    known = set(seen) | other_ids()
    for path, _, decisions in loaded:
        for decision in decisions:
            for other in decision.get("relates_to", []):
                if other not in known:
                    problems.append(f"{path.relative_to(ROOT)}: {decision['id']} relates to {other}, which isn't a "
                                    "decision, a known limitation or an open requirement")
    return problems


def cell(text):
    return " ".join(str(text).split()).replace("|", "\\|")


def date(value):
    return value.strftime("%-d %b %Y") if hasattr(value, "strftime") else ""


def scope_name(scope):
    return "project" if scope["kind"] == "project" else f"{scope['kind']} `{scope['name']}`"


def render(loaded):
    rows = sorted(((scope, decision, path) for path, scope, decisions in loaded for decision in decisions),
                  key=lambda row: (STEPS.index(row[1]["step"]), row[1]["id"]))
    parts = [
        "# Decisions",
        "",
        "*Generated by `scripts/generate/decisions.py` from each scope's decision log. Don't edit this "
        "file: change the log, then run the script. CI fails if it's out of date.*",
        "",
        "What was decided, why, and who decided, for every source, domain and consumer, and the project "
        "as a whole. Each log lives next to what it's about; the schema is in "
        "[`requirements/README.md`](../requirements/README.md). Known limitations are on the model or "
        "source they affect (`meta.limitations`), and what's still open is in "
        "[`requirements/`](../requirements/). The university, its people and the dates are fictional: "
        "the story the films tell, in October 2026.",
        "",
    ]
    for step in STEPS:
        chosen = [row for row in rows if row[1]["step"] == step]
        if not chosen:
            continue
        parts += [f"## `{step}`", "", "| ID | Scope | Decision | Why | Who | When | Status |", "|---|---|---|---|---|---|---|"]
        for scope, decision, path in chosen:
            told = f" Told: {', '.join(decision['informed'])}." if decision.get("informed") else ""
            was = f" (was {decision['was']})" if decision.get("was") else ""
            parts.append(f"| [{decision['id']}](../{path.relative_to(ROOT)}){was} | {scope_name(scope)} | "
                         f"**{cell(decision['title'])}.** {cell(decision['text'])} | {cell(decision['why'])} | "
                         f"{cell(decision.get('decided_by', ''))}{told} | {date(decision.get('decided_on'))} | "
                         f"{decision['status']} |")
        parts.append("")
    scopes = []
    for _, scope, _ in loaded:
        if scope_name(scope) not in [scope_name(s) for s in scopes]:
            scopes.append(scope)
    used = [step for step in STEPS if any(row[1]["step"] == step for row in rows)]
    parts += ["## By scope and step", "",
              "How many decisions each log holds at each step. A domain's project, when it has one, takes "
              "its logs with it.", "",
              "| Scope | " + " | ".join(f"`{s}`" for s in used) + " |", "|---|" + "---|" * len(used)]
    for scope in scopes:
        counts = [sum(1 for s, d, _ in rows if scope_name(s) == scope_name(scope) and d["step"] == step) for step in used]
        parts.append(f"| {scope_name(scope)} | " + " | ".join(str(c) if c else "" for c in counts) + " |")
    parts.append("")
    return "\n".join(parts)


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="fail if a log is wrong or the index is out of date")
    args = parser.parse_args()
    loaded = logs()
    problems = validate(loaded)
    if problems:
        print("the decision logs have problems:\n- " + "\n- ".join(problems), file=sys.stderr)
        return 1
    text = render(loaded)
    if args.check:
        if not INDEX.exists() or INDEX.read_text() != text:
            print("docs/decisions.md is out of date: run python scripts/generate/decisions.py", file=sys.stderr)
            return 1
        print("the decision logs are valid and docs/decisions.md is up to date")
        return 0
    INDEX.write_text(text)
    print(f"wrote {INDEX.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
