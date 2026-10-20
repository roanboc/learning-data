"""Writes CODEOWNERS from the owners in the metadata, so a change to what an owner decides asks that
owner to review it, without anyone remembering to.

    the code, everywhere                    the analytics engineer
    the map, the owners, the conventions    the data architect (and data governance)
    a domain's conceptual model and log     the owners of its entities and kinds, the data
                                            architect, and data governance, which names the terms
    a core or mart model's YAML             the owners in its models' meta.owner, and the engineer
    a source's folder                       the source's owner, and the engineer
    a seed the business owns                the seed's owner
    a consumer's exposures                  the consumer
    governance's check and its tests        data governance and the data architect (DEC-PRJ-12)

Owners are named as people know them; models/_shared/_shared__owners.yml says where each one's
review request goes. An owner that isn't there stops the script: every owner must be reachable.

GitHub reads CODEOWNERS only at a repository's root, in .github/ or in docs/. If this project is a
repository of its own, the file goes in .github/; here, inside the learning-data repository, it is
an example, and GitHub doesn't read it.

    python scripts/generate/codeowners.py           # write CODEOWNERS
    python scripts/generate/codeowners.py --check   # fail if it's out of date
"""
import argparse
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
REGISTER = ROOT / "models" / "_shared" / "_shared__owners.yml"
TARGET = ROOT / "CODEOWNERS"


def load(path):
    return yaml.safe_load(path.read_text()) or {}


def meta(item):
    return (item.get("config") or {}).get("meta") or item.get("meta") or {}


def conceptual_owners(model):
    owners = []
    for item in model.get("entities", []) + model.get("relationships", []):
        owners += [item.get("owner")] + [kind.get("owner") for kind in item.get("kinds", [])]
    return owners


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="fail if CODEOWNERS is out of date")
    args = parser.parse_args()
    register = load(REGISTER)
    emails = {owner["name"]: owner["email"] for owner in register["owners"]}
    reviewers = {role: person["email"] for role, person in register["reviewers"].items()}
    unknown = set()

    def reach(*names):
        found = []
        for name in names:
            if not name:
                continue
            if name in emails:
                found.append(emails[name])
            elif name in reviewers.values():
                found.append(name)
            else:
                unknown.add(name)
        return list(dict.fromkeys(found))

    # The map's domain owners must be reachable too, though the map itself is the data architect's.
    reach(*(domain.get("owner") for domain in load(ROOT / "models" / "_shared" / "_shared__conceptual.yml")["domains"]))
    rules = [("*", [reviewers["code"]], "The code, everywhere: the analytics engineer"),
             ("/models/_shared/", [reviewers["model"]], "The university's map, its decisions and its owners"),
             ("/models/_shared/_shared__owners.yml", [reviewers["governance"], reviewers["model"]], None),
             ("/docs/conventions.md", [reviewers["model"], reviewers["governance"]], None)]

    for kind in ("core", "marts"):
        rules.append((None, None, f"Meaning and contracts: {'core domains' if kind == 'core' else 'consumers'}"))
        for folder in sorted(p for p in (ROOT / "models" / kind).iterdir() if p.is_dir()):
            name = folder.name
            path = f"/models/{kind}/{name}/"
            conceptual = folder / f"_{name}__conceptual.yml"
            meaning = conceptual_owners(load(conceptual)) if conceptual.exists() else []
            # A core domain's terms are named by data governance (DEC-PRJ-11).
            extra = [reviewers["governance"]] if kind == "core" else []
            for log in (conceptual, folder / f"_{name}__decisions.yml"):
                if log.exists():
                    rules.append((path + log.name, reach(*meaning) + [reviewers["model"]] + extra, None))
            for spec in sorted(folder.glob("_*__models.yml")):
                owners = [meta(model).get("owner") for model in load(spec).get("models", [])]
                rules.append((path + spec.name, reach(*owners) + [reviewers["code"]], None))

    rules.append((None, None, "What comes in: each source's owner"))
    for spec in sorted((ROOT / "sources").glob("*/_*__sources.yml")):
        owners = [meta(source).get("owner") for source in load(spec).get("sources", [])]
        rules.append((f"/sources/{spec.parent.name}/", reach(*owners) + [reviewers["code"]], None))

    rules.append((None, None, "Data the business owns: each seed's owner"))
    for spec in sorted((ROOT / "seeds").glob("*/*/_*__seeds.yml")):
        for seed in load(spec).get("seeds", []):
            csv = spec.parent / f"{seed['name']}.csv"
            if seed["name"] != "key_sets":  # generated from the sources
                rules.append(("/" + csv.relative_to(ROOT).as_posix(), reach(meta(seed).get("owner")), None))

    rules.append((None, None, "Data products: each product's owner"))
    for spec in sorted((ROOT / "products").glob("*.yml")):
        product = load(spec)
        rules.append((f"/products/{spec.name}", reach(product.get("owner")), None))

    rules.append((None, None, "Who uses it: each consumer"))
    for spec in sorted((ROOT / "exposures").glob("*/_*__exposures.yml")):
        owners = [exposure["owner"].get("email") for exposure in load(spec).get("exposures", [])]
        rules.append((f"/exposures/{spec.parent.name}/", list(dict.fromkeys(owners)), None))

    rules.append((None, None, "Governance's rules (DEC-PRJ-12)"))
    for path in ("/scripts/check/governance.py", "/tests/governance/", "/scripts/generate/codeowners.py"):
        rules.append((path, [reviewers["governance"], reviewers["model"]], None))

    if unknown:
        raise SystemExit(f"{REGISTER.relative_to(ROOT)} doesn't say how to reach: {', '.join(sorted(unknown))}. "
                         "Add each owner, with an email")

    width = max(len(path) for path, _, _ in rules if path)
    lines = ["# Generated by scripts/generate/codeowners.py from the owners in the project's metadata and",
             "# models/_shared/_shared__owners.yml. Don't edit it: change the metadata, then run the script.",
             "# The last pattern that matches a file decides who reviews it.",
             "#",
             "# GitHub reads this file only at a repository's root, in .github/ or in docs/. Here, inside the",
             "# learning-data repository, it is an example; in the project's own repository it goes in .github/."]
    for path, owners, comment in rules:
        if comment:
            lines += ["", f"# {comment}"]
        if path:
            lines.append(f"{path.ljust(width)}  {' '.join(owners)}".rstrip())
    text = "\n".join(lines) + "\n"

    if args.check:
        if not TARGET.exists() or TARGET.read_text() != text:
            print("CODEOWNERS is out of date: run python scripts/generate/codeowners.py", file=sys.stderr)
            sys.exit(1)
        print("CODEOWNERS is up to date")
    else:
        TARGET.write_text(text)
        print(f"wrote {TARGET.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
