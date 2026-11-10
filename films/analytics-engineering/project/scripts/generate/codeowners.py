"""Writes CODEOWNERS from the owners in the metadata, so a change to what an owner decides asks that
owner to review it, without anyone remembering to.

    the code, everywhere                    the analytics engineer
    the university's map, the conventions   the data architect (and data governance)
    governance/: owners, map, products      data governance and the data architect
    a domain's conceptual model and log     the owners of its entities and kinds, the data
                                            architect, and data governance, which names the terms
    a core or mart model's YAML             the owners in its models' meta.owner, and the engineer
    a source's folder                       the source's owner, and the engineer
    a seed the business owns                the seed's owner
    a consumer's exposures                  the consumer
    governance's check and its tests        data governance and the data architect (DEC-PRJ-12)
    the team's memory, memory/              data governance, which owns the memory as a whole

Owners are named as people know them; governance/2-owners/owners.yml says where each one's
review request goes. An owner that isn't there stops the script: every owner must be reachable.

GitHub reads CODEOWNERS only at a repository's root, in .github/ or in docs/. If this project is a
repository of its own, the file goes in .github/; here, inside the learning-data repository, it is
an example, and GitHub doesn't read it.

Who reviews comes from the roles on the university's map (governance/3-architecture-map/3-business/):
the register's reviewers for the code, the model and governance must be the people the map assigns to
the analytics engineer's, the data architect's and the data governance lead's roles. The script also
writes review-and-release/teams.yml: GitHub's teams that the rules on main and the environments name,
one for each role whose people approve, with the people the map assigns to it. So someone who takes
over a role on the map takes over its reviews. It stops if a reviewer isn't the map's, if a role has
nobody, if the map gives one of these roles to an agent, or if a rule names a team that isn't one of
them: an agent's approval never counts.

    python scripts/generate/codeowners.py           # write CODEOWNERS and review-and-release/teams.yml
    python scripts/generate/codeowners.py --check   # fail if either is out of date
"""
import argparse
import json
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
REGISTER = ROOT / "governance" / "2-owners" / "owners.yml"
TARGET = ROOT / "CODEOWNERS"
MAP = ROOT / "governance" / "3-architecture-map"
RELEASE = ROOT / "review-and-release"
TEAMS = RELEASE / "teams.yml"
# The register's reviewers, by the role each holds on the map.
REVIEWS = {"code": "analytics engineer", "model": "data architect", "governance": "data governance lead"}
# GitHub's teams, one for each role whose people approve, and each team's id in review-and-release/'s
# files (this example's ids: in the organisation's own, put its teams', README.md there, The teams).
TEAM_ROLES = {"product-owners": ("product owner", 7300101),
              "data-owners": ("data owner", 7300102),
              "release-approvers": ("release approver", 7300103),
              "data-governance-leads": ("data governance lead", 7300104),
              "data-custodians": ("data custodian", 7300105)}
# Paths added after films cited CODEOWNERS by line: each goes in a section of its own at the end,
# not in its section's place, so the cited lines keep their numbers (AGENTS.md, Keep cited lines in
# place). Add a new folder or file here, with the section's title, when its place would move them.
LATER = {"The graduation list: its owner, its sources, its ceremonies and the people who use it":
         ("/models/marts/graduations/", "/sources/portal/", "/seeds/reference/graduations/",
          "/governance/4-data-products/graduation_list.yml", "/exposures/graduations/"),
         "The claims app: its owner, for the claims read where the app writes them":
         ("/sources/claims_app/",),
         "Payroll's export to Finance: the staff domain, the units and pay days it reads, and its products":
         ("/models/core/staff/", "/seeds/reference/course/units.csv", "/seeds/reference/staff/",
          "/governance/4-data-products/claims.yml", "/governance/4-data-products/payroll_export.yml")}


def load(path):
    return yaml.safe_load(path.read_text()) or {}


def meta(item):
    return (item.get("config") or {}).get("meta") or item.get("meta") or {}


def conceptual_owners(model):
    owners = []
    for item in model.get("entities", []) + model.get("relationships", []):
        owners += [item.get("owner")] + [kind.get("owner") for kind in item.get("kinds", [])]
    return owners


def holders(role, folder="3-business/actors"):
    """The elements in a folder of the map that it assigns to a role: its people and teams, or, in
    5-application/application-components, its agents."""
    return [element for element in map(load, sorted((MAP / folder).glob("*.yml")))
            if role in [rel.get("assignment") for rel in element.get("relationships") or []]]


def address(name, emails):
    """Where a review request reaches someone the map names: the register's entry for them, as people
    know them ("Noor" is "Noor, data architect"; the "Platform team" is "Sam, platform team")."""
    known = {entry.lower(): email for entry, email in emails.items()}
    if name.lower() in known:
        return known[name.lower()]
    for part in (0, 1):
        for entry, email in known.items():
            pieces = entry.split(", ", 1)
            if len(pieces) > part and pieces[part] == name.lower():
                return email
    return None


def teams_named(rules):
    """The ids of the teams a ruleset or an environment names, as reviewers or as actors."""
    if isinstance(rules, dict):
        found = [rules["id"]] if rules.get("type") == "Team" else []
        found += [rules["actor_id"]] if rules.get("actor_type") == "Team" else []
        return found + [team for value in rules.values() for team in teams_named(value)]
    if isinstance(rules, list):
        return [team for value in rules for team in teams_named(value)]
    return []


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="fail if CODEOWNERS or review-and-release/teams.yml is out of date")
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

    # Who reviews and approves comes from the roles on the map: each reviewer must hold their role there,
    # each team is the people the map assigns to its role, and no agent may hold one of these roles.
    wrong, teams = [], {}
    for key, role in REVIEWS.items():
        named, person = [actor["name"] for actor in holders(role)], register["reviewers"][key]["name"]
        if person.split(", ")[0] not in named:
            wrong.append(f"the {key} reviewer is {person}, but the map gives the role {role} to {', '.join(named) or 'nobody'}")
    for team, (role, team_id) in TEAM_ROLES.items():
        members = []
        for actor in holders(role):
            email = address(actor["name"], emails)
            if not email:
                unknown.add(actor["name"])
            members.append({"name": actor["name"], "actor": actor.get("actor", "person"), "email": email})
        if not members:
            wrong.append(f"nobody holds the role {role} on the map, so the team {team} would have nobody to approve")
        teams[team] = {"role": role, "id": team_id, "members": members}
    for role in dict.fromkeys([*REVIEWS.values(), *(role for role, _ in TEAM_ROLES.values())]):
        for agent in holders(role, "5-application/application-components"):
            wrong.append(f"the map gives the role {role} to {agent['name']}, an agent: an agent's approval never counts")
    ids = {info["id"] for info in teams.values()}
    for path in sorted(RELEASE.rglob("*.json")):
        for team_id in teams_named(json.loads(path.read_text())):
            if team_id not in ids:
                wrong.append(f"{path.relative_to(ROOT)} names the team {team_id}, which isn't one written from the map")

    # The map's domain owners must be reachable too, though the map itself is the data architect's.
    reach(*(domain.get("owner") for domain in load(ROOT / "models" / "_shared" / "_shared__conceptual.yml")["domains"]))
    rules = [("*", [reviewers["code"]], "The code, everywhere: the analytics engineer"),
             ("/models/_shared/", [reviewers["model"]], "The university's map and its decisions"),
             ("/governance/", [reviewers["governance"], reviewers["model"]], "Governance's definitions, that could live in another tool: the owners, the architecture map, the standards"),
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
    for spec in sorted((ROOT / "governance" / "4-data-products").glob("*.yml")):
        product = load(spec)
        rules.append((f"/governance/4-data-products/{spec.name}", reach(product.get("owner")), None))

    rules.append((None, None, "Who uses it: each consumer"))
    for spec in sorted((ROOT / "exposures").glob("*/_*__exposures.yml")):
        owners = [exposure["owner"].get("email") for exposure in load(spec).get("exposures", [])]
        rules.append((f"/exposures/{spec.parent.name}/", list(dict.fromkeys(owners)), None))

    rules.append((None, None, "Governance's rules (DEC-PRJ-12)"))
    for path in ("/scripts/check/governance.py", "/tests/governance/", "/scripts/generate/codeowners.py", "/docs/how-to/",
                 "/skills/review-for-governance/"):
        rules.append((path, [reviewers["governance"], reviewers["model"]], None))

    # Last, so the lines above keep their numbers.
    rules.append((None, None, "The team's memory: data governance, which owns it as a whole"))
    rules.append(("/memory/", [reviewers["governance"]], None))

    # Then what came after the films cited the lines above, each section in the order it came.
    for title, prefixes in LATER.items():
        later = [rule for rule in rules if rule[0] and rule[0].startswith(prefixes)]
        rules = [rule for rule in rules if rule not in later] + [(None, None, title)] + later

    if unknown:
        raise SystemExit(f"{REGISTER.relative_to(ROOT)} doesn't say how to reach: {', '.join(sorted(unknown))}. "
                         "Add each owner, with an email")
    if wrong:
        raise SystemExit("Who reviews and approves doesn't match the map:\n- " + "\n- ".join(wrong))

    width = max(len(path) for path, _, _ in rules if path)
    lines = ["# Generated by scripts/generate/codeowners.py from the owners in the project's metadata and",
             "# governance/2-owners/owners.yml. Don't edit it: change the metadata, then run the script.",
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

    teams_text = "\n".join([
        "# Generated by scripts/generate/codeowners.py from the roles on the university's map",
        "# (governance/3-architecture-map/3-business/) and governance/2-owners/owners.yml. Don't edit it:",
        "# change the map, then run the script.",
        "#",
        "# GitHub's teams that the rules on main (rulesets/main.json) and the environment production",
        "# (production.json) name: one for each role whose people approve, with the people the map assigns",
        "# to that role. Someone who takes over a role on the map takes over its team, and its reviews. The",
        "# map gives these roles only to people, so no agent is ever in one. A member that is a team on the",
        "# map, such as the platform team, means its people. Each joins with their own GitHub account, and a",
        "# team's approval counts only if the team has write access to the repository (README.md, The teams).",
        ""]) + yaml.safe_dump({"teams": teams}, sort_keys=False, allow_unicode=True, width=110)

    outputs = [(TARGET, text), (TEAMS, teams_text)]
    if args.check:
        stale = [path.relative_to(ROOT).as_posix() for path, wanted in outputs
                 if not path.exists() or path.read_text() != wanted]
        if stale:
            print(f"{' and '.join(stale)} out of date: run python scripts/generate/codeowners.py", file=sys.stderr)
            sys.exit(1)
        print("CODEOWNERS and review-and-release/teams.yml are up to date")
    else:
        for path, wanted in outputs:
            path.write_text(wanted)
        print(f"wrote {TARGET.relative_to(ROOT)} and {TEAMS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
