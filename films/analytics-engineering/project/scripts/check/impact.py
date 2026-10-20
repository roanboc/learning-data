"""Reports what a pull request touches, and who to tell, before it merges: the glossary sync's impact
report (skills/sync-the-glossary/), for any change.

From the files the branch changed since its base (git diff), it finds the models, seeds, sources
and tests they define, and through them:

- what's downstream: models, tests, and the exposures that use them, with their owners;
- the contracts: for each public model and mart, whether its columns changed additively (added)
  or in a way that breaks a consumer (removed, renamed or retyped). A breaking change needs a new
  version, beside the old one, with a deprecation date (DEC-PRJ-02); additive changes are preferred;
- the meaning: a conceptual model's changed entities, and the models that hold them;
- the decisions implemented in what changed, still to be true;
- who to ask: the owners in the metadata of everything above.

It needs target/manifest.json for the branch (dbt parse) and, to compare contracts, the base's
manifest (dbt parse on the base, into another target path). It fails only on a breaking change to
a contract with no new version.

    python scripts/check/impact.py --base origin/main                                  # print it
    python scripts/check/impact.py --base origin/main --base-manifest base/manifest.json --report impact.md
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "target" / "manifest.json"
DECISIONS = sorted(list((ROOT / "models").glob("**/_*__decisions.yml")) + list((ROOT / "sources").glob("*/_*__decisions.yml")))


def changed_files(base):
    prefix = subprocess.run(["git", "rev-parse", "--show-prefix"], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
    out = subprocess.run(["git", "diff", "--name-only", f"{base}...HEAD", "--", "."], cwd=ROOT,
                         capture_output=True, text=True, check=True).stdout.split()
    return sorted(p[len(prefix):] for p in out if p.startswith(prefix))


def label(node):
    return node["name"] + (f" v{node['version']}" if node.get("version") is not None else "")


def owner(node):
    meta = node.get("meta") or {}
    if meta.get("owner"):
        return meta["owner"]
    who = node.get("owner") or {}
    return who.get("name") or who.get("email")


def shared(node):
    return node.get("resource_type") == "model" and (
        node.get("access") == "public" or node["original_file_path"].startswith("models/marts/"))


def entities_in(text):
    model = yaml.safe_load(text) or {}
    return {item["name"]: item for kind in ("entities", "relationships") for item in model.get(kind, []) if isinstance(item, dict)}


def changed_entities(path, base):
    """The entities and relationships a conceptual model changed, added or dropped since the base."""
    shown = subprocess.run(["git", "show", f"{base}:./{path}"], cwd=ROOT, capture_output=True, text=True)
    old = entities_in(shown.stdout) if shown.returncode == 0 else {}
    new = entities_in((ROOT / path).read_text())
    return sorted(name for name in set(old) | set(new) if old.get(name) != new.get(name))


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--base", default="origin/main", help="the branch the pull request merges into")
    parser.add_argument("--base-manifest", help="the base's target/manifest.json, to compare contracts")
    parser.add_argument("--report", help="write the report, as Markdown, to this file")
    args = parser.parse_args()
    if not MANIFEST.exists():
        raise SystemExit("target/manifest.json is missing: run dbt parse --profiles-dir . first")
    manifest = json.loads(MANIFEST.read_text())
    nodes = {**manifest["nodes"], **manifest["sources"], **manifest["exposures"], **manifest.get("unit_tests", {})}
    files = changed_files(args.base)

    base = json.loads(Path(args.base_manifest).read_text()) if args.base_manifest else None
    before = {**base["nodes"], **base["sources"], **base["exposures"]} if base else {}

    def modified(uid, node):
        """Changed against the base, as dbt's state:modified sees it; without the base, any node in a changed file."""
        if not base:
            return True
        old = before.get(uid)
        return old is None or any(old.get(k) != node.get(k) for k in ("checksum", "config", "columns", "description", "depends_on"))

    # What the changed files define, and why each is touched.
    touched, changed_tests = {}, []
    for uid, node in nodes.items():
        paths = {node.get("original_file_path"), (node.get("patch_path") or "").split("://")[-1]}
        hit = sorted(p for p in paths if p in files)
        if not hit or not modified(uid, node):
            continue
        if node["resource_type"] in ("model", "seed", "source", "exposure", "snapshot"):
            touched[uid] = f"changed in `{hit[0]}`"
        elif node["resource_type"] == "test":
            changed_tests.append(uid)
    macros = {m["unique_id"] for m in manifest["macros"].values() if m["original_file_path"] in files}
    for uid, node in manifest["nodes"].items():
        used = macros & set(node.get("depends_on", {}).get("macros", []))
        if used and node["resource_type"] == "model":
            touched.setdefault(uid, "uses the changed macro " + ", ".join(f"`{u.split('.')[-1]}`" for u in sorted(used)))
    meaning = {}
    for path in files:
        if path.endswith("__conceptual.yml") and (ROOT / path).exists():
            names = changed_entities(path, args.base)
            meaning[path] = names
            for uid, node in manifest["nodes"].items():
                if node["resource_type"] == "model" and (node.get("meta") or {}).get("glossary_term") in names:
                    touched.setdefault(uid, f"holds `{node['meta']['glossary_term']}`, from `{path}`")

    # Everything downstream of what changed.
    downstream, todo = {}, list(touched)
    while todo:
        for child in manifest["child_map"].get(todo.pop(), []):
            if child not in touched and child not in downstream:
                downstream[child] = True
                todo.append(child)
    reached = set(touched) | set(downstream)
    models = sorted(u for u in downstream if u.startswith("model."))
    tests = sorted(set(u for u in reached if u.startswith(("test.", "unit_test."))) | set(changed_tests))
    exposures = sorted(u for u in reached if u.startswith("exposure."))

    # Contracts: additive or breaking, against the base.
    contracts, breaking = [], []
    if base:
        for uid in sorted(touched):
            node = nodes[uid]
            if not shared(node) or uid not in before:
                if shared(node) and uid not in before:
                    contracts.append(f"`{label(node)}`: new")
                continue
            old = {c: v.get("data_type") for c, v in before[uid]["columns"].items()}
            new = {c: v.get("data_type") for c, v in node["columns"].items()}
            added = sorted(set(new) - set(old))
            removed = sorted(set(old) - set(new))
            retyped = sorted(c for c in set(old) & set(new) if old[c] != new[c])
            if removed or retyped:
                text = ", ".join(([f"removed {', '.join(removed)}"] if removed else [])
                                 + ([f"retyped {', '.join(retyped)}"] if retyped else [])
                                 + ([f"added {', '.join(added)}"] if added else []))
                contracts.append(f"`{label(node)}`: **breaking**: {text}. Needs a new version, with a deprecation date for this one")
                breaking.append(label(node))
            elif added:
                contracts.append(f"`{label(node)}`: additive: added {', '.join(added)}")
            else:
                contracts.append(f"`{label(node)}`: columns unchanged")

    names = {nodes[u]["name"] for u in touched} | {Path(f).stem for f in files}
    decisions = []
    for path in DECISIONS:
        for d in (yaml.safe_load(path.read_text()) or {}).get("decisions", []):
            if names & set(d.get("implemented_in") or []) and d.get("status") != "superseded":
                decisions.append(f"{d['id']}: {d['title']} (`{path.relative_to(ROOT)}`)")

    ask = sorted({o for u in list(touched) + models + exposures if (o := owner(nodes[u]))})
    lines = ["# What this change touches", "",
             f"{len(files)} file(s) changed in the project since `{args.base}`; {len(touched)} model(s), seed(s) "
             f"or source(s) changed, {len(changed_tests)} test(s) changed, {len(models)} downstream model(s), {len(tests)} test(s), {len(exposures)} exposure(s).", ""]
    if touched:
        lines += ["## Changed", ""] + [f"- `{label(nodes[u])}` ({nodes[u]['resource_type']}): {why}" for u, why in sorted(touched.items())] + [""]
    if meaning:
        lines += ["## Meaning", ""] + [f"- `{p}`: {', '.join(f'`{n}`' for n in names_)}. Its owners approve; data governance confirms any glossary term (DEC-PRJ-11)." for p, names_ in meaning.items()] + [""]
    if contracts:
        lines += ["## Contracts", ""] + [f"- {c}" for c in contracts] + [""]
    if models:
        lines += ["## Downstream", ""] + [f"- `{label(nodes[u])}`" for u in models] + [""]
    if exposures:
        lines += ["## Who uses it", ""] + [f"- `{nodes[u]['name']}`, owned by {owner(nodes[u]) or 'no owner'}" for u in exposures] + [""]
    if decisions:
        lines += ["## Decisions implemented in it, still true?", ""] + [f"- {d}" for d in decisions] + [""]
    if changed_tests:
        lines += ["## Tests changed", ""] + [f"- `{nodes[u]['name']}`, owned by {owner(nodes[u]) or 'no owner'}" for u in changed_tests] + [""]
    if touched:
        select = " ".join(sorted({nodes[u]["name"] + "+" for u in touched}))
        lines += ["## Tests", "", f"{len(tests)} test(s) on it and downstream. `dbt build --select {select} --profiles-dir .` runs them.", ""]
    lines += ["## Who to ask", "", "; ".join(ask) if ask else "Nobody named: a change to code only, reviewed by the analytics engineer.", ""]
    text = "\n".join(lines)
    print(text)
    if args.report:
        Path(args.report).write_text(text)
    if breaking:
        print(f"breaking change to {', '.join(breaking)} with no new version", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
