"""Writes CODEOWNERS: who reviews a pull request. The data team reviews the code; data governance
reviews only its own files. Owners and stewards don't review pull requests: they decide what their
data means in the glossary (or, for an enterprise contract, data governance's information architect
writes it), before any code, and the code is built from there. The impact check tells them what a
change touches (scripts/check/impact.py).

    the code, everywhere                    the data team
    the university's map, the conventions   the data architect, in the data team
    a domain's conceptual model and log     the data architect: they copy the glossary's terms,
                                            which are decided in the glossary, not here
    governance/: the owner register, the    data governance: these stand in for its own tools
    map, products, contracts, standards     (the directory, the architecture tool, the catalogue)
    governance's check and its tests        data governance and the data architect (DEC-PRJ-12)
    the team's memory, memory/              data governance, which owns the memory as a whole

Every owner the metadata names must still be in governance/2-owners/owners.yml, so the impact
check can reach them: an owner that isn't there stops the script.

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
REGISTER = ROOT / "governance" / "2-owners" / "owners.yml"
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
    # The reviewers can own things too, as data governance owns the team's memory.
    emails.update({person["name"]: person["email"] for person in register["reviewers"].values()})
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

    # Every owner the metadata names must be reachable, so the impact check can tell them what a change touches.
    reach(*(domain.get("owner") for domain in load(ROOT / "models" / "_shared" / "_shared__conceptual.yml")["domains"]))
    for kind in ("core", "marts"):
        for folder in sorted(p for p in (ROOT / "models" / kind).iterdir() if p.is_dir()):
            conceptual = folder / f"_{folder.name}__conceptual.yml"
            reach(*(conceptual_owners(load(conceptual)) if conceptual.exists() else []))
            for spec in folder.glob("_*__models.yml"):
                reach(*(meta(model).get("owner") for model in load(spec).get("models", [])))
    for spec in (ROOT / "sources").glob("*/_*__sources.yml"):
        reach(*(meta(source).get("owner") for source in load(spec).get("sources", [])))
    for spec in (ROOT / "seeds").glob("*/*/_*__seeds.yml"):
        reach(*(meta(seed).get("owner") for seed in load(spec).get("seeds", [])))
    for spec in (ROOT / "governance" / "4-data-products").glob("*.yml"):
        reach(load(spec).get("owner"))

    rules = [("*", [reviewers["code"]], "The code, everywhere: the data team. Owners and stewards don't review pull requests: they decide\n"
              "# what their data means in the glossary, before any code, and the impact check tells them what a change touches"),
             ("/models/_shared/", [reviewers["model"]], "The university's map and its decisions, and each domain's conceptual model and log: the data architect"),
             ("/models/core/*/_*__conceptual.yml", [reviewers["model"]], None),
             ("/models/core/*/_*__decisions.yml", [reviewers["model"]], None),
             ("/models/marts/*/_*__conceptual.yml", [reviewers["model"]], None),
             ("/models/marts/*/_*__decisions.yml", [reviewers["model"]], None),
             ("/docs/conventions.md", [reviewers["model"], reviewers["code"]], None),
             ("/governance/", [reviewers["governance"], reviewers["model"]],
              "Governance's own files, that stand in for its tools: the owner register, the map, products, contracts, standards")]

    rules.append((None, None, "Governance's rules (DEC-PRJ-12)"))
    for path in ("/scripts/check/governance.py", "/tests/governance/", "/scripts/generate/codeowners.py", "/docs/how-to/",
                 "/skills/review-for-governance/"):
        rules.append((path, [reviewers["governance"], reviewers["model"]], None))

    rules.append((None, None, "The team's memory: data governance, which owns it as a whole"))
    rules.append(("/memory/", [reviewers["governance"]], None))

    if unknown:
        raise SystemExit(f"{REGISTER.relative_to(ROOT)} doesn't say how to reach: {', '.join(sorted(unknown))}. "
                         "Add each owner, with an email")

    width = max(len(path) for path, _, _ in rules if path)
    lines = ["# Generated by scripts/generate/codeowners.py from the owners in the project's metadata and",
             "# governance/2-owners/owners.yml. Don't edit it: change the metadata, then run the script.",
             "# The last pattern that matches a file decides who reviews it: the data team, or data governance for its own files.",
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
