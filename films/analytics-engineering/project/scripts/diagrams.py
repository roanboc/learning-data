"""Writes the physical model of each domain of the core and marts, as a Mermaid diagram, from
target/manifest.json, into _<domain>__physical.md in the domain's folder (models/core/student/,
models/marts/planning/, ...). The conceptual diagram is drawn by hand; these are generated, so
they can't drift from the YAML.

    dbt parse --profiles-dir .
    python scripts/diagrams.py           # write every domain's physical model
    python scripts/diagrams.py --check   # fail if any is out of date
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAYERS = ("core", "marts")


def entity_name(node):
    return node["name"] + (f"_v{node['version']}" if node.get("version") is not None else "")


def is_latest(node):
    return node.get("version") is None or str(node["version"]) == str(node.get("latest_version"))


def grain(node):
    meta = node["config"].get("meta") or node.get("meta") or {}
    if not meta.get("grain"):
        raise SystemExit(f"{node['unique_id']} has no meta.grain: every core and mart model declares one")
    return meta["grain"].rstrip(".") + "."


def primary_key(node):
    for constraint in node.get("constraints", []):
        if constraint["type"] == "primary_key":
            return list(constraint["columns"])
    return [name for name, column in node["columns"].items()
            if any(c["type"] == "primary_key" for c in column.get("constraints", []))]


def ref_name(expression):
    match = re.search(r"ref\(\s*['\"]([^'\"]+)['\"]", expression or "")
    return match.group(1) if match else None


def load(manifest_path):
    manifest = json.loads(Path(manifest_path).read_text())
    models = {}
    deprecated = []
    for node in manifest["nodes"].values():
        if node["resource_type"] != "model" or node["fqn"][1] not in LAYERS:
            continue
        if not is_latest(node):
            deprecated.append(node)
            continue
        models[node["name"]] = node

    unique_columns = {}
    for node in manifest["nodes"].values():
        meta = node.get("test_metadata") or {}
        if node["resource_type"] == "test" and meta.get("name") == "unique":
            parent = manifest["nodes"].get(node.get("attached_node") or "", {})
            unique_columns.setdefault(parent.get("name"), set()).add(node.get("column_name"))

    edges = set()
    for node in manifest["nodes"].values():
        meta = node.get("test_metadata") or {}
        if node["resource_type"] != "test" or meta.get("name") != "relationships":
            continue
        child = manifest["nodes"].get(node.get("attached_node") or "")
        parent = ref_name(meta["kwargs"].get("to"))
        if child and is_latest(child) and child["name"] in models and parent in models:
            edges.add((parent, meta["kwargs"].get("field"), child["name"], node.get("column_name")))
    for child in models.values():
        for name, column in child["columns"].items():
            for constraint in column.get("constraints", []):
                parent = ref_name(constraint.get("to"))
                if constraint["type"] == "foreign_key" and parent in models:
                    edges.add((parent, constraint["to_columns"][0], child["name"], name))
    return models, deprecated, unique_columns, sorted(edges)


def domain(node):
    return node["fqn"][2]


def target(node):
    folder = Path(node["original_file_path"]).parent
    return ROOT / folder / f"_{domain(node)}__physical.md"


def render(manifest_path):
    """One page per domain of the core and the marts, keyed by the path it's written to."""
    models, deprecated, unique_columns, edges = load(manifest_path)
    pages = {}
    for node in models.values():
        pages.setdefault(target(node), []).append(node)
    return {path: render_domain(nodes, models, deprecated, unique_columns, edges)
            for path, nodes in sorted(pages.items())}


def render_domain(nodes, models, deprecated, unique_columns, edges):
    names = {node["name"] for node in nodes}
    name = domain(nodes[0])
    layer = nodes[0]["fqn"][1]
    order = sorted(nodes, key=lambda n: n["name"])
    # A relationship is drawn in its child's domain. A parent from another domain is drawn with
    # only the key the relationship uses; its own page has the rest.
    edges = [edge for edge in edges if edge[2] in names]
    foreign = {(child, column) for _, _, child, column in edges}
    outside = {}
    for parent, field, _, _ in edges:
        if parent not in names:
            outside.setdefault(parent, set()).add(field)

    lines = ["```mermaid", "erDiagram"]
    for node in order:
        pk = primary_key(node)
        lines.append(f"    {entity_name(node)} {{")
        for column_name, column in node["columns"].items():
            data_type = re.sub(r"\W+", "_", column.get("data_type") or "unknown").strip("_")
            marks = (["PK"] if column_name in pk else []) + (["FK"] if (node["name"], column_name) in foreign else [])
            lines.append(f"        {data_type} {column_name}{' ' + ', '.join(marks) if marks else ''}")
        lines.append("    }")
    for parent in sorted(outside):
        node = models[parent]
        pk = primary_key(node)
        lines.append(f"    {entity_name(node)} {{")
        for column_name in sorted(outside[parent]):
            data_type = re.sub(r"\W+", "_", node["columns"][column_name].get("data_type") or "unknown").strip("_")
            lines.append(f"        {data_type} {column_name}{' PK' if column_name in pk else ''}")
        lines.append("    }")
    for parent, field, child, column in edges:
        parent_node = models[parent]
        one = primary_key(parent_node) == [field] or field in unique_columns.get(parent, set())
        left = "||" if one else "}|"
        lines.append(f'    {entity_name(parent_node)} {left}--o{{ {entity_name(models[child])} : "{column}"')
    lines.append("```")

    table = ["| Model | Grain | Access | Contract |", "|---|---|---|---|"]
    for node in order:
        contract = "enforced" if node["config"].get("contract", {}).get("enforced") else "none"
        table.append(f"| `{entity_name(node)}` | {grain(node)} | "
                     f"{node['config'].get('access') or node.get('access')} | {contract} |")

    what = ("part of the enterprise contract" if layer == "core" else "a consumer contract")
    parts = [
        f"# {name.capitalize()} domain: physical model",
        "",
        "*Generated by `scripts/diagrams.py` from `target/manifest.json`. Don't edit this file: change "
        "the YAML, run `dbt parse`, then run the script. CI fails if it's out of date.*",
        "",
        f"The {layer.rstrip('s')} models of the {name} domain ({what}), at their latest versions: every column "
        "with its contracted type, primary keys (PK), and the relationships the tests check (FK). "
        "A model from another domain shows only the key a relationship uses; its own domain's page "
        "has the rest. `||--o{` points from a key that is unique; `}|--o{` from a key that has "
        "versions, so several rows share it.",
        "",
        *lines,
        "",
        *table,
        "",
    ]
    older = [node for node in deprecated if node["name"] in names]
    if older:
        parts += ["Older versions still built, until their deprecation date:", ""]
        for node in sorted(older, key=entity_name):
            parts.append(f"- `{entity_name(node)}`: deprecated on {str(node.get('deprecation_date'))[:10]}.")
        parts.append("")
    return "\n".join(parts)


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--manifest", default=str(ROOT / "target" / "manifest.json"))
    parser.add_argument("--check", action="store_true", help="fail if a physical model is out of date")
    args = parser.parse_args()
    if not Path(args.manifest).exists():
        print(f"{args.manifest} not found: run dbt parse first", file=sys.stderr)
        return 2
    pages = render(args.manifest)
    if args.check:
        stale = [path for path, text in pages.items() if not path.exists() or path.read_text() != text]
        for path in stale:
            print(f"{path.relative_to(ROOT)} is out of date: run dbt parse, then python scripts/diagrams.py",
                  file=sys.stderr)
        if stale:
            return 1
        print("the physical models are up to date")
        return 0
    for path, text in pages.items():
        path.write_text(text)
        print(f"wrote {path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
