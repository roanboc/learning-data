"""Checks what data governance asks of the project, and measures it.

Four rules, each a line of the university's data governance policy that runs on every pull request
(DEC-PRJ-12). They apply to what other teams read: the public core models and the marts.

1. **An owner.** Every domain on the university's map, every entity, kind and relationship in a
   domain's conceptual model, and every public model and mart (meta.owner and meta.domain).
2. **A glossary term, or a confirmed absence.** Every entity in a core domain takes its definition
   from the business glossary (source:, DEC-PRJ-11), or data governance has confirmed the glossary
   has no term for it (no_glossary_term:, with who confirmed it and when). Every public model names
   the entity it holds (meta.glossary_term).
3. **Classified columns.** Every column of a public model or mart says whether it identifies a
   person: meta.personal_data is direct, pseudonymous or none.
4. **Tests with an owner and a dimension.** Every test on the data has meta.owner (by folder, in
   dbt_project.yml, or its own) and meta.dimension, one of DAMA's six (tests/generic/builtin.sql).
   Tests in tests/governance/ check the project, not the data, so they need an owner only.

It reads the conceptual models and target/manifest.json, so run dbt parse first, with
--no-partial-parse: a partial parse can drop a test's meta. Each problem says
what to add, and where; the rules are explained in docs/conventions.md, *Governance*.

    dbt parse --profiles-dir . --no-partial-parse
    python scripts/check/governance.py              # fail on any problem
    python scripts/check/governance.py --measures   # and print the measures
"""
import argparse
import json
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "target" / "manifest.json"
MAP = ROOT / "models" / "_shared" / "_shared__conceptual.yml"
DOMAINS = sorted((ROOT / "models" / "core").glob("*/_*__conceptual.yml"))
CONSUMERS = sorted((ROOT / "models" / "marts").glob("*/_*__conceptual.yml"))
CLASSES = {"direct", "pseudonymous", "none"}
DIMENSIONS = {"completeness", "uniqueness", "validity", "consistency", "accuracy", "timeliness"}
HOW = "see docs/conventions.md, Governance"


def shared(node):
    """A model other teams read: public, or a mart."""
    return node["resource_type"] == "model" and (
        node.get("access") == "public" or node["original_file_path"].startswith("models/marts/"))


def label(node):
    return node["name"] + (f" v{node['version']}" if node.get("version") is not None else "")


def owned(items, where, problems, counts):
    """Owners on entities, their kinds, and the relationships the map counts as entities."""
    for item in items:
        counts["owner"][1] += 1
        if item.get("owner"):
            counts["owner"][0] += 1
        else:
            problems.append(f"owner: {where}: {item['name']} has no owner. Name who decides what it means ({HOW})")
        for kind in item.get("kinds", []):
            counts["owner"][1] += 1
            if kind.get("owner"):
                counts["owner"][0] += 1
            else:
                problems.append(f"owner: {where}: kind {kind['name']} of {item['name']} has no owner ({HOW})")


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--measures", action="store_true", help="print how much of the project meets each rule")
    args = parser.parse_args()
    if not MANIFEST.exists():
        raise SystemExit("target/manifest.json is missing: run dbt parse --profiles-dir . first")
    manifest = json.loads(MANIFEST.read_text())
    problems = []
    # Each measure: [how many meet the rule, how many it applies to].
    counts = {name: [0, 0] for name in ("owner", "glossary", "columns", "tests")}

    # 1. An owner: on the map's domains, and in each domain's and consumer's conceptual model.
    university = yaml.safe_load(MAP.read_text())
    mapped = set()
    for domain in university["domains"]:
        counts["owner"][1] += 1
        if domain.get("owner"):
            counts["owner"][0] += 1
        else:
            problems.append(f"owner: {MAP.relative_to(ROOT)}: domain {domain['name']} has no owner ({HOW})")
        mapped |= {entity["name"] for entity in domain.get("entities", [])}
    for path in DOMAINS + CONSUMERS:
        model = yaml.safe_load(path.read_text())
        where = path.relative_to(ROOT)
        entities = model.get("entities", []) + [r for r in model.get("relationships", []) if r["name"] in mapped]
        owned(entities, where, problems, counts)

        # 2. A glossary term, or a confirmed absence, for every entity in a core domain.
        if path in DOMAINS:
            for entity in entities:
                counts["glossary"][1] += 1
                source, absent = entity.get("source") or {}, entity.get("no_glossary_term") or {}
                if source.get("term") or (absent.get("confirmed_by") and absent.get("confirmed_on")):
                    counts["glossary"][0] += 1
                else:
                    problems.append(f"glossary: {where}: {entity['name']} has neither source: (the glossary term "
                                    f"it takes its definition from) nor no_glossary_term: (who confirmed there's "
                                    f"none, and when). Ask data governance ({HOW})")

    for node in sorted(manifest["nodes"].values(), key=lambda n: n["unique_id"]):
        if shared(node):
            meta, where = node["meta"], f"{node['patch_path'].split('://')[-1]}: {label(node)}"
            counts["owner"][1] += 1
            missing = [key for key in ("owner", "domain") if not meta.get(key)]
            if missing:
                problems.append(f"owner: {where} has no meta.{' or meta.'.join(missing)} ({HOW})")
            else:
                counts["owner"][0] += 1
            if node.get("access") == "public":
                counts["glossary"][1] += 1
                if meta.get("glossary_term"):
                    counts["glossary"][0] += 1
                else:
                    problems.append(f"glossary: {where} has no meta.glossary_term: name the entity it holds ({HOW})")

            # 3. Classified columns.
            for column in node["columns"].values():
                counts["columns"][1] += 1
                value = column["meta"].get("personal_data")
                if value in CLASSES:
                    counts["columns"][0] += 1
                else:
                    says = f"meta.personal_data {value!r}" if value else "no meta.personal_data"
                    problems.append(f"columns: {where}: {column['name']} has {says}: say whether it identifies "
                                    f"a person, with direct, pseudonymous or none ({HOW})")

        # 4. Tests with an owner and a dimension.
        elif node["resource_type"] == "test":
            meta, where = node["meta"], node["original_file_path"]
            on_data = not where.startswith("tests/governance/")
            counts["tests"][1] += 1
            missing = [key for key in ("owner", "dimension") if not meta.get(key) and (on_data or key == "owner")]
            if meta.get("dimension") and meta["dimension"] not in DIMENSIONS:
                missing.append(f"dimension from {', '.join(sorted(DIMENSIONS))} (it says {meta['dimension']!r})")
            if missing:
                problems.append(f"tests: {where}: {node['name']} has no meta.{' or meta.'.join(missing)} ({HOW})")
            else:
                counts["tests"][0] += 1

    if args.measures:
        names = {"owner": "Domains, entities and shared models with an owner",
                 "glossary": "Core entities and public models with a glossary term, or none confirmed",
                 "columns": "Columns of shared models classified",
                 "tests": "Tests with an owner and a dimension"}
        print("| Measure | Meets it | Of | |\n|---|---|---|---|")
        for key, (met, of) in counts.items():
            print(f"| {names[key]} | {met} | {of} | {round(100 * met / of) if of else 100}% |")
    for problem in problems:
        print(problem)
    if problems:
        print(f"{len(problems)} problem(s): governance's rules aren't met", file=sys.stderr)
        sys.exit(1)
    print("Governance's rules are met: every owner, glossary term, column class and test is in place.")


if __name__ == "__main__":
    main()
