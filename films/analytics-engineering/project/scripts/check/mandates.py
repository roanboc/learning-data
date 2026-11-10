"""Checks each agent's mandate against the places that hold its lines, and fails when one allows more than the page.

A mandate (governance/8-mandates/<agent>.yml) says the one kind of task an agent may do alone, and where: its
folders, its checks, its limits on rounds, time and money, a switch that stops it and a way to undo each change
(README.md there). A page is only words, so each line is held by a tool. This reads each mandate and each place
that holds one of its lines, and fails if:

- the page isn't whole: a line missing, a kind other than requirement, a status other than in force or
  withdrawn, signed by anyone but its owner, or approved by nobody, or by its owner;
- on the map, the agent's owner isn't the mandate's, or a mandate in force isn't named on the agent's
  assignment beside the task it covers, at stage 5 (once the agent is on the map);
- its App's push ruleset (review-and-release/rulesets/<agent>-folders.json) lets it push anything but its
  folders' SQL, or puts its own App on the bypass list: a test, a seed, a contract or a definition lives
  outside them, or in the YAML beside its models, and so does the page itself;
- a SQL file in its folders sets dbt's config, which belongs in the YAML it can't change: a model could
  turn off its own contract or tests from there;
- its settings in the tools, written from the map (agents/<agent>/, by scripts/generate/agents.py), allow
  more than the page: a grant that writes anywhere but schemas of its own, a run with no timeout or a longer
  one than its hour, more rounds than the page, no plain check before it starts, or a rate limit in Unity
  Gateway above its budget, or none.

It runs in CI beside the other governance checks, so nothing that widens what an agent may do merges without
it. Until the project writes each agent's settings from the map (agents/), it checks the page, the map and the
ruleset, and says that the rest waits.

    python scripts/check/mandates.py
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
MANDATES = ROOT / "governance" / "8-mandates"
COMPONENTS = ROOT / "governance" / "3-architecture-map" / "5-application" / "application-components"
RULESETS = ROOT / "review-and-release" / "rulesets"
AGENTS = ROOT / "agents"
TOOLS = AGENTS / "tools.yml"
WRITER = ROOT / "scripts" / "generate" / "agents.py"

LINES = ("name", "kind", "owner", "task", "status", "agent", "definition", "in test", "in production", "folders",
         "never", "checks", "limits", "switch", "undo", "held by", "signed", "approved", "review", "change")
STATUSES = {"in force", "withdrawn"}
LIMITS = ("rounds", "minutes", "tokens a minute")
# Where an agent's folders may be: its models and its questions, never staging, the core, a test or a seed.
FOLDER_ROOTS = ("models/marts/", "models/intermediate/", "analyses/")
# Paths its App must never push, whatever its folders: the page itself, the rules, the tests, the seeds, the
# sources, the macros, the core, the release, and a model's YAML (its contract, tests and definitions).
NEVER = ("governance/8-mandates/workload-agent.yml", "governance/1-glossary/README.md", "tests/generic/builtin.sql",
         "seeds/reference/shared/key_sets.csv", "sources/hr_system/_hr_system__sources.yml", "macros/shared/time.sql",
         "models/staging/hr_system/stg_hr_system__contracts.sql", "models/core/course/core_award.sql",
         "review-and-release/rulesets/main.json", "agents/tools.yml", "AGENTS.md", "dbt_project.yml",
         ".github/workflows/release.yml", ".gitignore")
# What a grant may give an agent: to read, to use the tools it calls, and to make schemas of its own in the
# development catalog, which it then owns, and nothing else.
READS = {"USE CATALOG", "USE SCHEMA", "SELECT", "EXECUTE"}


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower().replace("'", "")).strip("-")


def person(name):
    """The person a name means, without their office: "Anil Kurian, Faculty of Health" is Anil Kurian."""
    return str(name or "").split(",")[0].strip().lower()


def glob(pattern, dots):
    """A path pattern as GitHub's push rules read it (fnmatch, with paths): * and ? stay inside a folder, and
    **/ is any number of folders, none included. GitHub doesn't say whether * matches a name that starts with
    a dot, so a path is checked both ways (dots, below)."""
    any_name = "[^/]*" if dots else "(?:[^/.][^/]*)?"
    out, i = "", 0
    while i < len(pattern):
        start = i == 0 or pattern[i - 1] == "/"
        if pattern.startswith("**/", i):
            out, i = out + ("(?:[^/]*/)*" if dots else "(?:[^/.][^/]*/)*"), i + 3
        elif pattern.startswith("**", i):
            out, i = out + ".*", i + 2
        elif pattern[i] == "*":
            out, i = out + (any_name if start else "[^/]*"), i + 1
        elif pattern[i] == "?":
            out, i = out + ("[^/.]" if start and not dots else "[^/]"), i + 1
        else:
            out, i = out + re.escape(pattern[i]), i + 1
    return re.compile(out + r"\Z")


def stops(path, restricted, ignored, dots):
    if any(glob(p, dots).match(path) for p in ignored):
        return False
    return any(glob(p, dots).match(path) for p in restricted)


def blocked(path, restricted, ignored):
    """Whether a push rule with these patterns stops a push that changes this path, however * reads a dot."""
    return all(stops(path, restricted, ignored, dots) for dots in (True, False))


def allowed(path, restricted, ignored):
    return not any(stops(path, restricted, ignored, dots) for dots in (True, False))


def check_page(path, page, problems):
    where = path.relative_to(ROOT).as_posix()
    missing = [line for line in LINES if line not in page]
    if missing:
        problems.append(f"{where}: no {', '.join(missing)}: a mandate says each of its lines (README.md there)")
    if page.get("kind") != "requirement":
        problems.append(f"{where}: kind is {page.get('kind')!r}: a mandate is a requirement, as the map writes a rule")
    if page.get("status") not in STATUSES:
        problems.append(f"{where}: status is {page.get('status')!r}, not one of {', '.join(sorted(STATUSES))}")
    if page.get("agent") and path.stem != slug(page["agent"]):
        problems.append(f"{where}: named {path.name}, for the {page['agent']}: name it {slug(page['agent'])}.yml")
    signed, approved = page.get("signed") or {}, page.get("approved") or {}
    if person(signed.get("by")) != person(page.get("owner")) or not isinstance(signed.get("date"), date):
        problems.append(f"{where}: signed by {signed.get('by')!r} on {signed.get('on')!r}: its owner, "
                        f"{page.get('owner')}, signs it, on a day (YYYY-MM-DD)")
    if not approved.get("by") or person(approved.get("by")) == person(page.get("owner")):
        problems.append(f"{where}: approved by {approved.get('by')!r}: a second person, not its owner, approves it")
    if isinstance(signed.get("date"), date) and isinstance(approved.get("date"), date) and approved["date"] < signed["date"]:
        problems.append(f"{where}: approved on {approved['on']}, before it was signed on {signed['on']}")
    limits = page.get("limits") or {}
    for limit in LIMITS:
        if not isinstance(limits.get(limit), int) or limits[limit] <= 0:
            problems.append(f"{where}: limits has no {limit} as a whole number: the tools hold each one")
    for folder in page.get("folders") or []:
        if not folder.endswith("/") or not folder.startswith(FOLDER_ROOTS):
            problems.append(f"{where}: the folder {folder!r} isn't one an agent may be given: a folder of its own "
                            f"under {', '.join(FOLDER_ROOTS)}, ending in /")


def check_map(path, page, problems):
    """The agent on the map: the same owner, and, in force, the mandate named beside its stage-5 task."""
    where = path.relative_to(ROOT).as_posix()
    element_path = COMPONENTS / f"{slug(page.get('agent', ''))}.yml"
    if not element_path.exists():
        return f"the {page.get('agent')} isn't on the map yet, so its assignment can't name the mandate"
    element = yaml.safe_load(element_path.read_text()) or {}
    if person(element.get("owner")) != person(page.get("owner")):
        problems.append(f"{where}: its owner is {page.get('owner')}, and the map's {page['agent']} is {element.get('owner')}'s")
    if page.get("status") != "in force":
        return None
    mine = path.relative_to(ROOT / "governance").as_posix()
    naming = [rel for rel in element.get("relationships") or [] if isinstance(rel, dict) and mine in names(rel.get("mandate"))]
    if not naming:
        problems.append(f"{element_path.relative_to(ROOT).as_posix()}: the {page['agent']}'s assignment doesn't name its "
                        f"mandate: add mandate: {mine}, beside its stage")
    for rel in naming:
        stage = (rel.get("stage") or {}).get(page.get("task"))
        if stage != 5:
            problems.append(f"{element_path.relative_to(ROOT).as_posix()}: the mandate is for {page.get('task')!r}, "
                            f"which the map puts at stage {stage}: a mandate is stage 5's gate")
    return None


def names(mandate):
    """An assignment's mandate: one page, or a list of them, each named from governance/."""
    return [] if mandate is None else [str(m) for m in mandate] if isinstance(mandate, list) else [str(mandate)]


def check_ruleset(path, page, problems, apps):
    """Its App's push rules: everything blocked but its folders' SQL, and its own App on no bypass list."""
    where = path.relative_to(ROOT).as_posix()
    rules_path = RULESETS / f"{path.stem}-folders.json"
    if not rules_path.exists():
        problems.append(f"{where}: no push ruleset for its App, {rules_path.relative_to(ROOT).as_posix()}: nothing holds its folders")
        return
    rules = json.loads(rules_path.read_text())
    there = rules_path.relative_to(ROOT).as_posix()
    if rules.get("target") != "push" or rules.get("enforcement") != "active":
        problems.append(f"{there}: a push ruleset, active, holds an App's folders (it's {rules.get('target')}, {rules.get('enforcement')})")
    paths = [r.get("parameters") or {} for r in rules.get("rules") or [] if r.get("type") == "file_path_restriction"]
    if not paths:
        problems.append(f"{there}: no file_path_restriction rule: its App could push anywhere")
        return
    restricted = [p for rule in paths for p in rule.get("restricted_file_paths") or []]
    ignored = [p for rule in paths for p in rule.get("ignored_file_paths") or []]
    folders = page.get("folders") or []
    for pattern in ignored:
        if not pattern.endswith(".sql") or not any(pattern.startswith(folder) for folder in folders):
            problems.append(f"{there}: lets its App push {pattern!r}: only its folders' SQL, never their YAML, which "
                            "holds a model's contract, tests and definitions")
    for folder in folders:
        for sql in (f"{folder}a_model.sql", f"{folder}a/deeper/one.sql"):
            if not allowed(sql, restricted, ignored):
                problems.append(f"{there}: blocks {sql}, in a folder the page gives it")
        for kept in (f"{folder}_its__models.yml", f"{folder}a/_deeper__models.yml", f"{folder}notes.md",
                     f"{folder}data.csv"):
            if not blocked(kept, restricted, ignored):
                problems.append(f"{there}: lets its App push {kept}: its folders' SQL only")
    for kept in NEVER + (where,):
        if not blocked(kept, restricted, ignored):
            problems.append(f"{there}: lets its App push {kept}, which no mandate gives an agent")
    own = apps.get(page.get("agent"))
    exempt = [a for a in rules.get("bypass_actors") or [] if a.get("actor_type") == "Integration"]
    if own is not None and any(a.get("actor_id") == own for a in exempt):
        problems.append(f"{there}: its own App ({own}) is on the bypass list, so the rule holds nothing")
    for name, app in apps.items():
        if name != page.get("agent") and not any(a.get("actor_id") == app for a in exempt):
            problems.append(f"{there}: the {name}'s App ({app}) isn't on the bypass list, so this rule blocks it too")
    for actor in rules.get("bypass_actors") or []:
        if actor.get("actor_type") not in ("RepositoryRole", "Integration"):
            problems.append(f"{there}: bypassed by a {actor.get('actor_type')}: people bypass it by their role, "
                            "and other agents by their App")


def check_folders(path, page, problems):
    """No SQL in its folders sets dbt's config: a model's config is in its YAML, which the agent can't change."""
    for folder in page.get("folders") or []:
        for sql in sorted((ROOT / folder).rglob("*.sql")) if (ROOT / folder).is_dir() else []:
            if re.search(r"\bconfig\s*\(", sql.read_text()):
                problems.append(f"{sql.relative_to(ROOT).as_posix()}: sets dbt's config in its SQL, in the "
                                f"{page.get('agent')}'s folders: move it to the YAML beside it, which only people change")


def grants(text):
    """Each grant in a grants.sql: (privileges, kind, securable)."""
    found = []
    for privileges, kind, securable in re.findall(r"^\s*grant\s+(.+?)\s+on\s+(\w+)\s+(\S+)\s+to\s+", text, re.I | re.M):
        found.append(({p.strip().upper() for p in privileges.split(",")}, kind.lower(), securable))
    return found


def starts_agent(step):
    """The step that starts the agent: the runner's own command, not the step that installs it."""
    return bool(re.search(r"(?m)^\s*agent-runner\s+--", str(step.get("run", ""))))


def check_tools(path, page, problems, tools):
    """Its settings in each tool, written from the map, against the page."""
    where = path.relative_to(ROOT).as_posix()
    folder = AGENTS / slug(page.get("agent", ""))
    if not folder.is_dir():
        problems.append(f"{where}: no {folder.relative_to(ROOT).as_posix()}/: the map gives the {page.get('agent')} no "
                        "steps yet, or agents/tools.yml has no line for it, so no tool holds the page")
        return
    there = folder.relative_to(ROOT).as_posix()
    limits = page.get("limits") or {}
    development = ((tools.get("databricks") or {}).get("development"))

    sql = folder / "grants.sql"
    for privileges, kind, securable in grants(sql.read_text()) if sql.exists() else []:
        writes = privileges - READS
        if writes and not (writes == {"CREATE SCHEMA"} and kind == "catalog" and securable == development):
            problems.append(f"{there}/grants.sql: grants {', '.join(sorted(writes))} on {kind} {securable}: the page "
                            f"lets it write only schemas of its own, made in {development}")
    if not sql.exists():
        problems.append(f"{there}/grants.sql is missing: nothing says where it may write")

    workflow = yaml.safe_load((folder / "workflow.yml").read_text()) if (folder / "workflow.yml").exists() else {}
    jobs = workflow.get("jobs") or {}
    run = next((job for job in jobs.values() if any(starts_agent(s) for s in job.get("steps") or [])), None)
    if run is None:
        problems.append(f"{there}/workflow.yml: no job runs the agent, so nothing counts its rounds or times its run")
        return
    minutes = run.get("timeout-minutes")
    if not isinstance(minutes, int) or minutes > limits.get("minutes", 0):
        problems.append(f"{there}/workflow.yml: its run's timeout is {minutes!r} minutes; the page gives it {limits.get('minutes')}")
    steps = run.get("steps") or []
    at = next(i for i, s in enumerate(steps) if starts_agent(s))
    rounds = re.search(r"--max-rounds\s+(\d+)", str(steps[at].get("run", "")))
    if not rounds or int(rounds.group(1)) > limits.get("rounds", 0):
        problems.append(f"{there}/workflow.yml: the runner stops after {rounds.group(1) if rounds else 'no limit of'} rounds; "
                        f"the page gives it {limits.get('rounds')}")
    needs = run.get("needs") or []
    needs = [needs] if isinstance(needs, str) else needs
    first = [job for name, job in jobs.items() if name in needs] + [{"steps": steps[:at]}]
    if not any(str(s.get("name", "")).lower().startswith("the plain check") for job in first for s in job.get("steps") or []):
        problems.append(f"{there}/workflow.yml: no plain check before the agent starts "
                        f"({(page.get('checks') or {}).get('first')})")

    gateway = yaml.safe_load((folder / "unity-gateway.yml").read_text()) if (folder / "unity-gateway.yml").exists() else {}
    sp = ((tools.get("agents") or {}).get(page.get("agent")) or {}).get("service principal")
    limits_set = [r.get("body") or {} for r in gateway.get("rate limits") or []]
    own = [b for b in limits_set if b.get("principal") == sp and b.get("renewal_period") == "minute" and "tokens" in b]
    if not own:
        problems.append(f"{there}/unity-gateway.yml: no rate limit in tokens a minute on its own service principal: "
                        "nothing holds its budget")
    for body in own:
        if body["tokens"] > limits.get("tokens a minute", 0):
            problems.append(f"{there}/unity-gateway.yml: a limit of {body['tokens']} tokens a minute; the page gives it "
                            f"{limits.get('tokens a minute')}")


def main():
    pages = sorted(MANDATES.glob("*.yml"))
    tools = yaml.safe_load(TOOLS.read_text()) or {} if TOOLS.exists() else {}
    apps = {name: identity.get("github app") for name, identity in (tools.get("agents") or {}).items()
            if isinstance(identity, dict) and identity.get("github app") is not None}
    problems, waiting = [], set()
    for path in pages:
        page = yaml.safe_load(path.read_text()) or {}
        check_page(path, page, problems)
        if page.get("status") != "in force":
            continue
        note = check_map(path, page, problems)
        if note:
            waiting.add(note)
        check_ruleset(path, page, problems, apps)
        check_folders(path, page, problems)
        if WRITER.exists():
            check_tools(path, page, problems, tools)
        else:
            waiting.add("each agent's settings aren't written from the map yet (agents/), so its grants, run and "
                        "rate limit wait")
    for note in sorted(waiting):
        print(f"waits: {note}")
    for problem in problems:
        print(problem)
    if problems:
        print(f"{len(problems)} problem(s): a tool allows more than a mandate, or a mandate isn't whole", file=sys.stderr)
        sys.exit(1)
    print(f"{len(pages)} mandate(s), each held: no tool allows more than its page")


if __name__ == "__main__":
    main()
