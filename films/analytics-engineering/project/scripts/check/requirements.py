"""Checks the open requirements in requirements/, and lists them.

A requirement is temporary: the metadata to watch while something is being built. It's not a
backlog: the team's backlog tool tracks the work, and an item links to it with `ticket`. When an
item is fulfilled, what lasts moves to its home (a decision log, meta.limitations, a test, the
model's YAML), and the item is deleted. So every item here is open or in progress, and says what
will show it's done.

    requirements/sources/<system>/_<system>__requirements.yml           a source
    requirements/models/<domain>/_<domain>__requirements.yml            a core domain
    requirements/exposures/<consumer>/_<consumer>__requirements.yml     a consumer
    requirements/_project__requirements.yml                             the project as a whole

The schema is in requirements/README.md.

    python scripts/check/requirements.py   # fail if an item is done, or doesn't follow the schema
"""
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
REQUIREMENTS = ROOT / "requirements"

TYPES = {"Q": "question", "REQ": "requirement", "GAP": "gap"}
STEPS = ["scope", "source_reality", "consumer_output", "gaps_and_contracts", "tests", "build",
         "validate", "review_and_ship", "written_once", "operate_and_evolve"]
STATUSES = {"open", "in_progress"}
RESOLUTIONS = {"fix_at_source", "rule_in_model", "accept"}
REQUIRED = ["id", "type", "step", "title", "text", "owner", "status", "done_when"]
GAP_REQUIRED = ["expectation", "reality", "resolution"]
HOMES = {
    "project": (lambda name: REQUIREMENTS / "_project__requirements.yml", lambda name: True),
    "source": (lambda name: REQUIREMENTS / "sources" / name / f"_{name}__requirements.yml",
               lambda name: (ROOT / "sources" / name).is_dir()),
    "domain": (lambda name: REQUIREMENTS / "models" / name / f"_{name}__requirements.yml",
               lambda name: (ROOT / "models" / "core" / name).is_dir()),
    "consumer": (lambda name: REQUIREMENTS / "exposures" / name / f"_{name}__requirements.yml",
                 lambda name: (ROOT / "exposures" / name).is_dir()),
}


def known_ids():
    """What an item may relate to: decisions, known limitations, and other items."""
    ids = set()
    for path in list((ROOT / "models").glob("**/*.yml")) + list((ROOT / "sources").glob("**/*.yml")):
        ids |= set(re.findall(r"\bid: ((?:DEC|LIM)-[A-Z]+-\d{2})\b", path.read_text()))
    return ids


def main():
    problems, seen, listed = [], {}, []
    loaded = [(path, yaml.safe_load(path.read_text())) for path in sorted(REQUIREMENTS.glob("**/_*__requirements.yml"))]
    for path, register in loaded:
        where = path.relative_to(ROOT)
        scope = register.get("scope") or {}
        kind, name, code = scope.get("kind"), scope.get("name"), scope.get("code")
        if kind not in HOMES:
            problems.append(f"{where}: scope kind must be one of {', '.join(HOMES)}")
            continue
        home, exists = HOMES[kind]
        if path != home(name):
            problems.append(f"{where}: the {kind} register for {name} belongs at {home(name).relative_to(ROOT)}")
        if not exists(name):
            problems.append(f"{where}: the project has no {kind} called {name}")
        items = register.get("items") or []
        if not items:
            problems.append(f"{where}: nothing is open: delete the register")
        for item in items:
            item_id = item.get("id", "?")
            match = re.fullmatch(r"(Q|REQ|GAP)-([A-Z]+)-(\d{2})", item_id)
            if not match or match.group(2) != code:
                problems.append(f"{where}: {item_id} should be Q, REQ or GAP-{code}-<nn>")
            elif TYPES[match.group(1)] != item.get("type"):
                problems.append(f"{where}: {item_id} is a {item.get('type')}, but its id says {TYPES[match.group(1)]}")
            if item_id in seen:
                problems.append(f"{where}: {item_id} is also in {seen[item_id]}")
            seen[item_id] = where
            if item.get("status") not in STATUSES:
                problems.append(f"{where}: {item_id} is {item.get('status')!r}. Only open and in-progress items stay "
                                "here: move what lasts to its home (a decision, meta.limitations, a test), then delete it")
            for field in REQUIRED + (GAP_REQUIRED if item.get("type") == "gap" else []):
                if not item.get(field):
                    problems.append(f"{where}: {item_id} has no {field}")
            if item.get("step") not in STEPS:
                problems.append(f"{where}: {item_id} has step {item.get('step')!r}; use one of {', '.join(STEPS)}")
            for resolution in item.get("resolution", []):
                if resolution not in RESOLUTIONS:
                    problems.append(f"{where}: {item_id} has resolution {resolution!r}; use {', '.join(sorted(RESOLUTIONS))}")
            for source in item.get("sources", []):
                if not (ROOT / "sources" / source).is_dir():
                    problems.append(f"{where}: {item_id} names source {source}, which the project hasn't")
            for field in ("priority", "estimate", "assignee", "sprint"):
                if field in item:
                    problems.append(f"{where}: {item_id} has {field}: that belongs in the backlog tool; link it with ticket")
            listed.append((item_id, item.get("status"), item.get("title"), item.get("done_when")))
    known = set(seen) | known_ids()
    for path, register in loaded:
        for item in register.get("items") or []:
            for other in item.get("relates_to", []):
                if other not in known:
                    problems.append(f"{path.relative_to(ROOT)}: {item['id']} relates to {other}, which isn't an open "
                                    "item, a decision or a known limitation")
    if problems:
        print("the requirements have problems:\n- " + "\n- ".join(problems), file=sys.stderr)
        return 1
    print(f"{len(listed)} requirements open:")
    for item_id, status, title, done_when in listed:
        print(f"- {item_id} ({status}) {title}. Done when: {' '.join(str(done_when).split())}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
