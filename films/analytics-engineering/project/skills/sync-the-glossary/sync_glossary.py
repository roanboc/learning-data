"""Compares each definition the conceptual models take from the business glossary with the term as it
stands there now, and, where they drift, proposes the update and reports what it touches.

The glossary is the home of a term it defines (DEC-PRJ-11); an entity with source: in its domain's
conceptual model keeps a reviewed copy of the term's words. This script reads the terms from a
glossary export, a JSON or CSV file with term, definition and, if known, owner and updated_on,
read from the official place (on Databricks, Unity Catalog's Glossary) by the step before it in
SKILL.md. For each entity with a source, it:

- compares the conceptual model's definition with the term's, ignoring line breaks and spacing;
- on a drift, shows the words removed and added, and flags what may change the meaning: numbers,
  negations and limits, and names of other entities;
- reports the impact, from what dbt parsed (target/manifest.json, so run dbt parse first): the
  generated doc block, other definitions that name the entity, the models and columns that show it
  with doc() or hold it in meta.glossary_term, their SQL and the project's macros they call,
  the decisions implemented in them, their tests, everything downstream and the exposures (with
  their owners) it reaches, and the catalog comments persist_docs rewrites on Databricks.

    python skills/sync-the-glossary/sync_glossary.py --glossary terms.json                 # compare; exit 1 on a drift
    python skills/sync-the-glossary/sync_glossary.py --glossary terms.json --report sync.md  # and write the report
    python skills/sync-the-glossary/sync_glossary.py --glossary terms.json --write          # and update the conceptual
                                                                                            # models, then regenerate

--write changes only the definition and synced_on of each drifted entity, then runs
scripts/generate/definitions.py. Open the change as a pull request with the report as its body:
the owner of the meaning approves it, and data governance confirms the term. It never writes to
the glossary.
"""
import argparse
import csv
import datetime
import difflib
import json
import re
import subprocess
import sys
import textwrap
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
CONCEPTUAL = sorted((ROOT / "models").glob("**/_*__conceptual.yml"))
MANIFEST = ROOT / "target" / "manifest.json"
DECISIONS = sorted(list((ROOT / "models").glob("**/_*__decisions.yml")) + list((ROOT / "sources").glob("*/_*__decisions.yml")))
LIMITS = re.compile(r"^(no|not|never|none|only|all|every|each|any|except|without|at least|at most|more|less|fewer|before|after|until|unless)$", re.I)


def words(text):
    return " ".join(str(text).split())


def read_glossary(path):
    """The terms, by lower-cased name: {term: {definition, owner, updated_on}}."""
    path = Path(path)
    if path.suffix == ".csv":
        rows = list(csv.DictReader(path.open(newline="")))
    else:
        data = json.loads(path.read_text())
        rows = data.get("terms", data) if isinstance(data, dict) else data
    terms = {}
    for row in rows:
        if not row.get("term") or not row.get("definition"):
            raise SystemExit(f"{path}: every term needs term and definition: {row}")
        terms[row["term"].strip().lower()] = row
    return terms


def synced_entities():
    """Every entity with source:, with its file and the names other definitions may use for it."""
    found = []
    for path in CONCEPTUAL:
        model = yaml.safe_load(path.read_text())
        for entity in model.get("entities", []):
            if entity.get("source"):
                found.append((path, model, entity))
    return found


def drift(old, new):
    """The words removed and added, and the flags that may mean the meaning changed."""
    a, b = words(old).split(), words(new).split()
    key = lambda w: w.strip(".,;:()\"'").lower()
    removed, added, shown = [], [], []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(a=[key(w) for w in a], b=[key(w) for w in b], autojunk=False).get_opcodes():
        if op == "equal":
            shown.append(" ".join(b[j1:j2]))
            continue
        if i2 > i1:
            removed += a[i1:i2]
            shown.append("~~" + " ".join(a[i1:i2]) + "~~")
        if j2 > j1:
            added += b[j1:j2]
            shown.append("**" + " ".join(b[j1:j2]) + "**")
    return removed, added, " ".join(shown)


def flags(removed, added, names):
    strip = lambda w: w.strip(".,;:()\"'").lower()
    changed = [strip(w) for w in removed + added]
    out = []
    if any(re.search(r"\d", w) for w in changed):
        out.append("a number changed")
    limits = sorted({w for w in changed if LIMITS.match(w)})
    if limits:
        out.append("a negation or limit changed: " + ", ".join(limits))
    entities = sorted({n for n in names if any(n == w or n + "s" == w for w in changed)})
    if entities:
        out.append("another entity is named or dropped: " + ", ".join(entities))
    return out


def impact(entity_name, label, manifest, current_path):
    """What the term reaches: definitions, models and columns, code, decisions, tests, downstream."""
    nodes = {**manifest["nodes"], **manifest.get("sources", {})}
    doc_id = f"doc.{manifest['metadata'].get('project_name', 'credentials')}.{entity_name}"
    holds = {}
    for uid, node in nodes.items():
        if node.get("resource_type") not in ("model", "seed", "snapshot", "source"):
            continue
        why = []
        meta = node.get("meta") or node.get("config", {}).get("meta") or {}
        if doc_id in (node.get("doc_blocks") or []):
            why.append(f'description: doc("{entity_name}")')
        if meta.get("glossary_term") == entity_name:
            why.append("meta.glossary_term")
        for column, col in (node.get("columns") or {}).items():
            if doc_id in (col.get("doc_blocks") or []) or (col.get("meta") or {}).get("glossary_term") == entity_name:
                why.append(f"column {column}")
        if why:
            holds[uid] = why

    downstream, seen, todo = {}, set(holds), list(holds)
    while todo:
        for child in manifest["child_map"].get(todo.pop(), []):
            if child not in seen:
                seen.add(child)
                todo.append(child)
                downstream[child] = 1
    exposures = {uid: manifest["exposures"][uid] for uid in downstream if uid in manifest.get("exposures", {})}
    downstream_models = sorted(uid for uid in downstream if uid.startswith("model."))
    tests = sorted({uid for uid in downstream if uid.startswith(("test.", "unit_test."))}
                   | {uid for uid in manifest.get("unit_tests", {}) if any(m in holds for m in manifest["unit_tests"][uid]["depends_on"]["nodes"])})

    code, macros = [], set()
    project = manifest["metadata"].get("project_name", "credentials")
    for uid in holds:
        node = nodes[uid]
        if node.get("resource_type") == "model":
            code.append(node["original_file_path"])
            macros |= {m for m in node["depends_on"].get("macros", []) if m.startswith(f"macro.{project}.")}
    code += sorted({manifest["macros"][m]["original_file_path"] for m in macros})

    variables = sorted({v for p in code for v in re.findall(r"var\(\s*['\"](\w+)['\"]", (ROOT / p).read_text())})
    names = {nodes[uid]["name"] for uid in holds} | {Path(p).stem for p in code}
    decisions = []
    for path in DECISIONS:
        for d in (yaml.safe_load(path.read_text()) or {}).get("decisions", []):
            if names & set(d.get("implemented_in") or []) and d.get("status") != "superseded":
                decisions.append((d["id"], d["title"], path.relative_to(ROOT)))

    mentions = []
    pattern = re.compile(rf"\b({re.escape(entity_name)}|{re.escape(label)})s?\b", re.I)
    for path in CONCEPTUAL:
        model = yaml.safe_load(path.read_text())
        for kind in ("entities", "relationships"):
            for item in model.get(kind, []):
                if not isinstance(item, dict) or (path == current_path and item.get("name") == entity_name):
                    continue
                parts = [item.get("definition", ""), item.get("label", "")] + list(item.get("rules", []))
                parts += [k.get("definition", "") for k in item.get("kinds", [])]
                text = " ".join(words(p) for p in parts)
                if pattern.search(text):
                    mentions.append((item["name"], path.relative_to(ROOT)))
    return holds, downstream_models, exposures, tests, code, variables, decisions, mentions, nodes


def rewrite(path, entity_name, definition, synced_on):
    """Replaces one entity's definition and synced_on in its conceptual model, keeping the rest as written."""
    lines = path.read_text().splitlines(keepends=True)
    start = next(i for i, l in enumerate(lines) if re.match(rf"\s*- name: {re.escape(entity_name)}\s*$", l))
    end = next((i for i in range(start + 1, len(lines)) if re.match(r"\s*- name: ", lines[i]) or re.match(r"\S", lines[i])), len(lines))
    d = next(i for i in range(start, end) if re.match(r"\s*definition:", lines[i]))
    indent = len(lines[d]) - len(lines[d].lstrip())
    body_end = d + 1
    while body_end < end and (not lines[body_end].strip() or len(lines[body_end]) - len(lines[body_end].lstrip()) > indent):
        body_end += 1
    pad = " " * (indent + 2)
    body = textwrap.fill(words(definition), width=100, initial_indent=pad, subsequent_indent=pad) + "\n"
    lines[d:body_end] = [" " * indent + "definition: >\n", body]
    text = "".join(lines)
    text = re.sub(rf"(- name: {re.escape(entity_name)}\b[\s\S]*?synced_on: )\S+", rf"\g<1>{synced_on}", text, count=1)
    path.write_text(text)


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--glossary", required=True, help="the glossary export: JSON or CSV with term, definition, owner, updated_on")
    parser.add_argument("--report", help="write the report, as a pull request body, to this file")
    parser.add_argument("--write", action="store_true", help="update each drifted definition and synced_on, then regenerate")
    args = parser.parse_args()

    terms = read_glossary(args.glossary)
    if not MANIFEST.exists():
        raise SystemExit("target/manifest.json is missing: run dbt parse --profiles-dir . first")
    manifest = json.loads(MANIFEST.read_text())
    all_names = set()
    for p in CONCEPTUAL:
        for e in yaml.safe_load(p.read_text()).get("entities") or []:
            all_names |= {e["name"]} | {k["name"] for k in e.get("kinds", [])}
    today = datetime.date.today().isoformat()

    report, drifted, missing = [], [], []
    for path, model, entity in synced_entities():
        source, name = entity["source"], entity["name"]
        term = terms.get(str(source["term"]).lower())
        rel = path.relative_to(ROOT)
        if term is None:
            missing.append(f"{name} ({rel}): term {source['term']} isn't in the export")
            continue
        if words(term["definition"]) == words(entity["definition"]):
            print(f"in step: {name} = {source['glossary']}, term {source['term']} (synced on {source['synced_on']})")
            continue
        drifted.append((path, entity, term))
        removed, added, shown = drift(entity["definition"], term["definition"])
        fl = flags(removed, added, all_names - {name})
        holds, models, exposures, tests, code, variables, decisions, mentions, nodes = impact(name, entity.get("label", name), manifest, path)
        print(f"drift: {name} ({rel}) differs from term {source['term']}: {len(removed)} word(s) removed, {len(added)} added"
              + (f"; {'; '.join(fl)}" if fl else "") + f"; reaches {len(holds)} model(s) directly, {len(models)} downstream, "
              f"{len(exposures)} exposure(s)")

        report += [f"## {name}: synced from {source['glossary']}, term {source['term']}", "",
                   f"Last synced on {source['synced_on']}; the term changed{' on ' + term['updated_on'] if term.get('updated_on') else ''}"
                   f"{', owner ' + term['owner'] if term.get('owner') else ''}. The owner of the meaning in `{rel}`: {entity.get('owner', 'not stated')}.", "",
                   "**Now in the conceptual model**", "", "> " + words(entity["definition"]), "",
                   "**In the glossary**", "", "> " + words(term["definition"]), "",
                   "**What changed** (removed ~~struck~~, added in **bold**)", "", "> " + shown, ""]
        report += ["**May change the meaning:** " + "; ".join(fl) + ". Read each against the models below." if fl
                   else "**May change the meaning:** nothing flagged (no number, limit or other entity changed); still read it.", ""]
        report += ["### What it touches", "",
                   f"- **Definitions.** The doc block `{name}` in `{rel.parent / rel.name.replace('__conceptual.yml', '__definitions.md')}`, regenerated."]
        report += [f"- Names it in its definition or rules: `{n}` in `{p}`: check it still reads true." for n, p in mentions]
        report += ["- **Models and columns** that show it or hold it:"] + [f"  - `{nodes[u]['name']}`: {', '.join(w)}" for u, w in sorted(holds.items())]
        if code:
            report += ["- **Code** that builds them, to check against the new meaning:"] + [f"  - `{c}`" for c in code]
        if variables:
            report += ["- **Vars** that code reads, in `dbt_project.yml`: a number in the meaning may belong in one: " + ", ".join(f"`{v}`" for v in variables)]
        if decisions:
            report += ["- **Decisions** implemented in them, still true?"] + [f"  - {i}: {t} (`{p}`)" for i, t, p in decisions]
        report += [f"- **Tests** on them and downstream: {len(tests)}. `dbt build --select " + " ".join(sorted(nodes[u]['name'] for u in holds)) + "+` runs them."]
        report += ["- **Downstream models:** " + (", ".join(f"`{'.'.join(u.split('.')[2:])}`" for u in models) or "none")]
        report += ["- **Exposures** to tell:"] + ([f"  - `{e['name']}`, owned by {e.get('owner', {}).get('name') or e.get('owner', {}).get('email') or 'no owner'}" for e in exposures.values()] or ["  - none"])
        report += ["- **Catalog.** On Databricks, persist_docs rewrites the comments of the models above on their next build.", ""]
        if fl:
            report += ["If the meaning changes what a model counts, that's a decision in the domain's log, and a breaking change to a public model is a new version.", ""]

    if missing:
        print("not in the export:\n- " + "\n- ".join(missing))
    if args.report and (drifted or missing):
        head = [f"# Sync from the glossary: {len(drifted)} term(s) drifted", "",
                f"Compared on {today} with `{Path(args.glossary).name}`, read from the glossary. "
                "Approve: the owner of each meaning; confirm the term: data governance (DEC-PRJ-11).", ""]
        tail = ["## Not in the export", ""] + [f"- {m}" for m in missing] + [""] if missing else []
        Path(args.report).write_text("\n".join(head + report + tail))
        print(f"wrote {args.report}")
    if args.write and drifted:
        for path, entity, term in drifted:
            rewrite(path, entity["name"], term["definition"], today)
            print(f"updated {entity['name']} in {path.relative_to(ROOT)}")
        subprocess.run([sys.executable, str(ROOT / "scripts" / "generate" / "definitions.py")], check=True)
    if not drifted and not missing:
        print("every synced definition matches the glossary")
    sys.exit(1 if (drifted or missing) and not args.write else 0)


if __name__ == "__main__":
    main()
