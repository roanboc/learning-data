"""Checks the requirements registers and writes their index, docs/registers.md.

Every question, requirement, decision, gap and limitation is an item in a register in
requirements/, in the folder of what it's about:

    requirements/_project__requirements.yml                   what every domain shares
    requirements/sources/<system>/_<system>__requirements.yml   a source
    requirements/models/<domain>/_<domain>__requirements.yml    a core domain
    requirements/exposures/<consumer>/_<consumer>__requirements.yml  a consumer

The schema is in requirements/README.md. This script checks every register against it, and that
each folder names a source, domain or consumer the project has, then writes one read-only index.

    python scripts/generate/registers.py           # write docs/registers.md
    python scripts/generate/registers.py --check   # fail if a register is wrong or the index is out of date
"""
import argparse
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
REQUIREMENTS = ROOT / "requirements"
INDEX = ROOT / "docs" / "registers.md"

TYPES = {"Q": "question", "REQ": "requirement", "DEC": "decision", "GAP": "gap", "LIM": "limitation"}
# The steps of docs/process.md, in order: the moment in the data lifecycle an item belongs to.
STEPS = ["scope", "source_reality", "consumer_output", "gaps_and_contracts", "tests", "build",
         "validate", "review_and_ship", "written_once", "operate_and_evolve"]
STATUSES = {"open", "agreed", "delivered", "superseded"}
RESOLUTIONS = {"fix_at_source", "rule_in_model", "accept"}
REQUIRED = {
    "question": ["text", "raised_by", "owner"],
    "requirement": ["text", "raised_by", "owner"],
    "decision": ["text", "why"],
    "gap": ["expectation", "reality", "resolution", "text", "owner"],
    "limitation": ["text"],
}
# Where each kind of register lives, and where the thing it's about must exist.
KINDS = {
    "source": ("sources", lambda name: (ROOT / "sources" / name).is_dir()),
    "domain": ("models", lambda name: any((ROOT / "models").glob(f"*/{name}"))),
    "consumer": ("exposures", lambda name: (ROOT / "exposures" / name).is_dir()),
}


def registers():
    return sorted(REQUIREMENTS.glob("**/_*__requirements.yml"))


def load():
    """Every register, as (path, scope, items)."""
    return [(path, *(lambda r: (r["scope"], r.get("items") or []))(yaml.safe_load(path.read_text())))
            for path in registers()]


def items_by_id():
    return {item["id"]: (scope, item) for _, scope, items in load() for item in items}


def validate(loaded):
    problems = []
    seen = {}
    for path, scope, items in loaded:
        where = path.relative_to(ROOT)
        kind, name, code = scope.get("kind"), scope.get("name"), scope.get("code")
        if kind == "project":
            expected = REQUIREMENTS / "_project__requirements.yml"
        elif kind in KINDS:
            folder, exists = KINDS[kind]
            expected = REQUIREMENTS / folder / name / f"_{name}__requirements.yml"
            if not exists(name):
                problems.append(f"{where}: the project has no {kind} called {name}")
        else:
            problems.append(f"{where}: scope kind must be project, source, domain or consumer")
            continue
        if path != expected:
            problems.append(f"{where}: a {kind} register for {name} belongs at {expected.relative_to(ROOT)}")
        for item in items:
            item_id = item.get("id", "?")
            match = re.fullmatch(r"(Q|REQ|DEC|GAP|LIM)-([A-Z]+)-(\d{2})", item_id)
            if not match:
                problems.append(f"{where}: {item_id} isn't <TYPE>-<SCOPE>-<nn>, like DEC-{code}-01")
                continue
            if match.group(2) != code:
                problems.append(f"{where}: {item_id} is in the {code} register, so its id needs {code}")
            if TYPES[match.group(1)] != item.get("type"):
                problems.append(f"{where}: {item_id} is a {item.get('type')}, but its id says {TYPES[match.group(1)]}")
            if item_id in seen:
                problems.append(f"{where}: {item_id} is also in {seen[item_id]}")
            seen[item_id] = where
            if item.get("step") not in STEPS:
                problems.append(f"{where}: {item_id} has step {item.get('step')!r}; use one of {', '.join(STEPS)}")
            if item.get("status") not in STATUSES:
                problems.append(f"{where}: {item_id} has status {item.get('status')!r}; use one of {', '.join(sorted(STATUSES))}")
            if not item.get("title"):
                problems.append(f"{where}: {item_id} has no title")
            for field in REQUIRED.get(item.get("type"), []):
                if not item.get(field):
                    problems.append(f"{where}: {item_id} is a {item['type']}, so it needs {field}")
            for resolution in item.get("resolution", []):
                if resolution not in RESOLUTIONS:
                    problems.append(f"{where}: {item_id} has resolution {resolution!r}; use {', '.join(sorted(RESOLUTIONS))}")
            for source in item.get("sources", []):
                if not (ROOT / "sources" / source).is_dir():
                    problems.append(f"{where}: {item_id} names source {source}, which the project hasn't")
    for path, _, items in loaded:
        for item in items:
            for other in item.get("relates_to", []):
                if other not in seen:
                    problems.append(f"{path.relative_to(ROOT)}: {item['id']} relates to {other}, which no register has")
    return problems


def cell(text):
    return " ".join(str(text).split()).replace("|", "\\|")


def date(value):
    return value.strftime("%-d %b %Y") if hasattr(value, "strftime") else (value or "")


def render(loaded):
    rows = sorted(((scope, item, path) for path, scope, items in loaded for item in items),
                  key=lambda row: (STEPS.index(row[1]["step"]), row[1]["id"]))

    def link(scope, item, path):
        return f"[{item['id']}](../{path.relative_to(ROOT)})"

    def scope_name(scope):
        return "project" if scope["kind"] == "project" else f"{scope['kind']} `{scope['name']}`"

    sections = {
        "question": ("Questions", ["ID", "Step", "Scope", "Question", "Decision it supports", "Raised by", "Status"],
                     lambda s, i: [cell(i["text"]), cell(i.get("decision", "")), cell(i["raised_by"]), i["status"]]),
        "requirement": ("Requirements", ["ID", "Step", "Scope", "Requirement", "Raised by", "Status"],
                        lambda s, i: [cell(i["text"]), cell(i["raised_by"]), i["status"]]),
        "decision": ("Decisions", ["ID", "Step", "Scope", "Decision", "Why", "Who", "When", "Told"],
                     lambda s, i: [cell(i["text"]), cell(i["why"]), cell(i.get("decided_by", "")),
                                   date(i.get("decided_on")), cell(", ".join(i.get("informed", [])))]),
        "gap": ("Gaps", ["ID", "Step", "Scope", "Expectation", "Reality", "Resolution", "Status"],
                lambda s, i: [cell(i["expectation"]), cell(i["reality"]),
                              f"**{', '.join(r.replace('_', ' ') for r in i['resolution'])}:** {cell(i['text'])}",
                              i["status"]]),
        "limitation": ("Known limitations", ["ID", "Step", "Scope", "Limitation", "What follows"],
                       lambda s, i: [cell(i["title"]), cell(i["text"])]),
    }
    parts = [
        "# Registers",
        "",
        "*Generated by `scripts/generate/registers.py` from the registers in `requirements/`. Don't "
        "edit this file: change the register, then run the script. CI fails if it's out of date.*",
        "",
        "Every question, requirement, decision, gap and known limitation, wherever it's kept: each in "
        "the register of the source, domain or consumer it's about, tagged with the step of "
        "[the process](process.md) it belongs to. The schema is in "
        "[`requirements/README.md`](../requirements/README.md). The university, its people and the "
        "dates are fictional: the story the films tell, in October 2026.",
        "",
    ]
    for kind, (title, header, columns) in sections.items():
        chosen = [row for row in rows if row[1]["type"] == kind]
        if not chosen:
            continue
        parts += [f"## {title}", "", "| " + " | ".join(header) + " |", "|" + "---|" * len(header)]
        for scope, item, path in chosen:
            values = [link(scope, item, path), f"`{item['step']}`", scope_name(scope)] + columns(scope, item)
            parts.append("| " + " | ".join(values) + " |")
        parts.append("")

    scopes = []
    for _, scope, _ in loaded:
        if scope_name(scope) not in [scope_name(s) for s in scopes]:
            scopes.append(scope)
    used_steps = [step for step in STEPS if any(row[1]["step"] == step for row in rows)]
    parts += ["## By scope and step", "",
              "How many items each register holds at each step. A domain's project, when it has one, "
              "takes its registers with it.", "",
              "| Scope | " + " | ".join(f"`{s}`" for s in used_steps) + " |",
              "|---|" + "---|" * len(used_steps)]
    for scope in scopes:
        counts = [sum(1 for s, i, _ in rows if scope_name(s) == scope_name(scope) and i["step"] == step)
                  for step in used_steps]
        parts.append(f"| {scope_name(scope)} | " + " | ".join(str(c) if c else "" for c in counts) + " |")
    parts.append("")
    return "\n".join(parts)


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="fail if a register is wrong or the index is out of date")
    args = parser.parse_args()
    loaded = load()
    problems = validate(loaded)
    if problems:
        print("the registers have problems:\n- " + "\n- ".join(problems), file=sys.stderr)
        return 1
    text = render(loaded)
    if args.check:
        if not INDEX.exists() or INDEX.read_text() != text:
            print("docs/registers.md is out of date: run python scripts/generate/registers.py", file=sys.stderr)
            return 1
        print("the registers are valid and docs/registers.md is up to date")
        return 0
    INDEX.write_text(text)
    print(f"wrote {INDEX.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
