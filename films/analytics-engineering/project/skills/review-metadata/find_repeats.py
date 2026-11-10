"""Lists descriptions written out, word for word, in more than one place in the project's YAML.
A description shown with doc() is written once, so it isn't counted.

    python skills/review-metadata/find_repeats.py
"""
import collections
import pathlib

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[2]
seen = collections.defaultdict(list)


def walk(node, path, owner=""):
    if isinstance(node, dict):
        name = node.get("name", owner)
        text = node.get("description")
        if isinstance(text, str) and "doc(" not in text:
            seen[" ".join(text.split())].append(f"{path}: {name}")
        for value in node.values():
            walk(value, path, name)
    elif isinstance(node, list):
        for value in node:
            walk(value, path, owner)


for path in sorted(ROOT.glob("**/*.yml")):
    parts = path.relative_to(ROOT).parts
    if parts[0] in ("target", "logs", "model") or path.name in ("dbt_project.yml", "profiles.yml"):
        continue
    walk(yaml.safe_load(path.read_text()), path.relative_to(ROOT))

repeats = {text: where for text, where in seen.items() if len(where) > 1}
for text, where in repeats.items():
    print(f"{len(where)}x  {text[:80]}")
    for place in where:
        print(f"      {place}")
print(f"{len(repeats)} description(s) written more than once")
