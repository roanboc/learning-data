"""Drafts a class for each column of a public model or mart that has none, with the evidence for it,
for its owner to approve. It never writes the class: the agent proposes it in the pull request.

The evidence is counts, never values: how many rows, how many distinct values, and how many look
like an email, a student or staff ID, a key that holds one, or a sha-256 hash. A column whose name
says it holds a name, an address, a phone number or a birth date is flagged whatever its values.

    dbt build --select <the changed models> --profiles-dir .
    python skills/review-for-governance/draft_classes.py
"""
import json
import re
from pathlib import Path

import duckdb

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "target" / "manifest.json"
DATABASE = ROOT / "target" / "credentials.duckdb"
NAMES = re.compile(r"(full|first|last|given|family|preferred|legal|customer)_?name|email|phone|mobile|address|birth|passport", re.I)
TESTS = {
    "email": r"^[^@\s]+@[^@\s]+\.[^@\s]+$",
    "person ID": r"(^|\|)[SEAR]-\d{4,5}(\||$)",
    "hash": r"^[0-9a-f]{64}$",
}


def main():
    manifest = json.loads(MANIFEST.read_text())
    con = duckdb.connect(str(DATABASE), read_only=True)
    rows = []
    for node in sorted(manifest["nodes"].values(), key=lambda n: n["unique_id"]):
        if node["resource_type"] != "model" or not (node.get("access") == "public" or node["original_file_path"].startswith("models/marts/")):
            continue
        for name, column in node["columns"].items():
            if column["meta"].get("personal_data"):
                continue
            counts = ", ".join(f"count(case when regexp_matches(cast({name} as varchar), '{rx}') then 1 end)" for rx in TESTS.values())
            total, distinct, *matches = con.execute(
                f"select count(*), count(distinct {name}), {counts} from {node['relation_name']}").fetchone()
            found = {kind: n for kind, n in zip(TESTS, matches) if n}
            if found.get("email") or found.get("person ID"):
                draft = "direct"
            elif found.get("hash"):
                draft = "pseudonymous: check it hashes a key that identifies a person"
            elif NAMES.search(name):
                draft = "direct? its name says so; ask the owner"
            else:
                draft = "none"
            evidence = f"{total} rows, {distinct} distinct" + "".join(f"; {n} look like {kind}" for kind, n in found.items())
            rows.append((node["name"], name, draft, evidence))
    if not rows:
        print("Every column of the public models and marts is classified.")
        return
    print("| Model | Column | Draft class | Evidence |\n|---|---|---|---|")
    for row in rows:
        print("| `{}` | `{}` | {} | {} |".format(*row))


if __name__ == "__main__":
    main()
