"""Writes review-and-release/teams.yml: GitHub's teams that approve, from the roles on the university's map.

The rules on main (review-and-release/rulesets/main.json) and the environment production
(review-and-release/production.json) name teams, never people: one for each role whose people
approve, with the people the map assigns to that role (governance/3-architecture-map/3-business/).
So someone who takes over a role on the map takes over its approvals. Owners and stewards have no
team: they don't review pull requests. They decide what their data means in the glossary first,
and the impact check tells them what a change touches. Who reviews the code is CODEOWNERS'
(scripts/generate/codeowners.py).

It also checks the register's reviewers for the model and for governance against the map: they
must be the people it assigns to the data architect's and the data governance lead's roles. It
stops if a role has nobody, if the map gives any of these roles to an agent, if a reviewer isn't
the map's, or if a rule names a team that isn't one written here: an agent's approval never counts.

    python scripts/generate/teams.py           # write review-and-release/teams.yml
    python scripts/generate/teams.py --check   # fail if it's out of date
"""
import argparse
import json
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
REGISTER = ROOT / "governance" / "2-owners" / "owners.yml"
MAP = ROOT / "governance" / "3-architecture-map"
RELEASE = ROOT / "review-and-release"
TEAMS = RELEASE / "teams.yml"
# The register's reviewers, by the role each holds on the map. The code's reviewer is a team, the data team, not a role.
REVIEWS = {"model": "data architect", "governance": "data governance lead"}
# GitHub's teams, one for each role whose people approve, and each team's id in review-and-release/'s
# files (this example's ids: in the organisation's own, put its teams', README.md there, The teams).
TEAM_ROLES = {"release-approvers": ("release approver", 7300103),
              "data-governance-leads": ("data governance lead", 7300104),
              "data-custodians": ("data custodian", 7300105)}


def load(path):
    return yaml.safe_load(path.read_text()) or {}


def holders(role, folder="3-business/actors"):
    """The elements in a folder of the map that it assigns to a role: its people and teams, or, in
    5-application/application-components, its agents."""
    return [element for element in map(load, sorted((MAP / folder).glob("*.yml")))
            if role in [rel.get("assignment") for rel in element.get("relationships") or []]]


def address(name, emails):
    """Where a request reaches someone the map names: the register's entry for them, as people know
    them ("Noor" is "Noor, data architect"; the "Platform team" is "Sam, platform team")."""
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
    parser.add_argument("--check", action="store_true", help="fail if review-and-release/teams.yml is out of date")
    args = parser.parse_args()
    register = load(REGISTER)
    emails = {owner["name"]: owner["email"] for owner in register["owners"]}
    emails.update({person["name"]: person["email"] for person in register["reviewers"].values()})

    # Each reviewer must hold their role on the map, each team is the people the map assigns to its role,
    # and no agent may hold one of these roles.
    wrong, unknown, teams = [], set(), {}
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
    if unknown:
        raise SystemExit(f"{REGISTER.relative_to(ROOT)} doesn't say how to reach: {', '.join(sorted(unknown))}. "
                         "Add each one, with an email")
    if wrong:
        raise SystemExit("Who approves doesn't match the map:\n- " + "\n- ".join(wrong))

    text = "\n".join([
        "# Generated by scripts/generate/teams.py from the roles on the university's map",
        "# (governance/3-architecture-map/3-business/) and governance/2-owners/owners.yml. Don't edit it:",
        "# change the map, then run the script.",
        "#",
        "# GitHub's teams that the rules on main (rulesets/main.json) and the environment production",
        "# (production.json) name: one for each role whose people approve, with the people the map assigns",
        "# to that role. Someone who takes over a role on the map takes over its team, and its approvals.",
        "# Owners have no team: they don't review pull requests. The map gives these roles only to people,",
        "# so no agent is ever in one. A member that is a team on the map, such as the platform team, means",
        "# its people. Each joins with their own GitHub account, and a team's approval counts only if the",
        "# team has write access to the repository (README.md, The teams).",
        ""]) + yaml.safe_dump({"teams": teams}, sort_keys=False, allow_unicode=True, width=110)

    if args.check:
        if not TEAMS.exists() or TEAMS.read_text() != text:
            print(f"{TEAMS.relative_to(ROOT)} is out of date: run python scripts/generate/teams.py", file=sys.stderr)
            sys.exit(1)
        print(f"{TEAMS.relative_to(ROOT)} is up to date")
    else:
        TEAMS.write_text(text)
        print(f"wrote {TEAMS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
