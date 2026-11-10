"""Writes each agent's settings in every tool from Noor's map, one way, and checks the tools hold no more.

An agent's rights come from its role's steps on the map (governance/3-architecture-map/): what each
step reads and writes (its `access (reads)` and `access (writes)` lines) and the tools it calls (the
`serving` lines of the application services). agents/tools.yml, the platform team's file, says
where each of those lives in each tool, and each agent's name there. From the two, this writes a
folder for every agent on the map whose role has steps, agents/<agent>/:

    README.md               who owns it, its role, and each right with the step it comes from
    grants.sql              Unity Catalog: the grants of its role's group, which it is a member of
    unity-gateway.yml       Unity Gateway: the model and the tool servers its steps call
    memory.yml              the team's memory store, read only
    github-app.yml          GitHub: its App's one repository and permissions, its branches, its runs' environment
    federation-policy.json  its service principal signs in only from that environment, with no secret
    workflow.yml            its run, in GitHub Actions, with its dbt target

and, for every agent, agents/rights-held.sql, which lists the rights each agent's group holds in Unity Catalog
now, and agents/nightly-check.yml, the check each night. Each run sets every variable dbt's agent target reads
(profiles.yml), or the script stops.

Nothing in those files is edited by hand, and no right is granted by hand: a new right starts on the
map, through review, and the tools follow. Each night, agents/nightly-check.yml exports what each
tool holds and runs --drift, which fails on a right a tool holds that the map doesn't give, and on a
right the map gives that a tool doesn't hold.

A film that sets more for one agent on top, such as a mandate's limits, fills extra_settings(), below,
so the files stay written one way.

    python scripts/generate/agents.py                # write agents/<agent>/ for every agent on the map
    python scripts/generate/agents.py --check        # fail if a file is out of date or isn't the script's (CI)
    python scripts/generate/agents.py --drift held/  # compare what the tools hold now with the map (each night)
"""
import argparse
import json
import re
import sys
import textwrap
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
MAP = ROOT / "governance" / "3-architecture-map"
AGENTS = ROOT / "agents"
TOOLS = AGENTS / "tools.yml"
HELD = AGENTS / "rights-held.sql"
NIGHTLY = AGENTS / "nightly-check.yml"
PROFILES = ROOT / "profiles.yml"
FILES = ("README.md", "grants.sql", "unity-gateway.yml", "memory.yml", "github-app.yml", "federation-policy.json",
         "workflow.yml")
HEADER = ("Written by scripts/generate/agents.py from Noor's map and agents/tools.yml.",
          "Don't edit it: change the map, then run the script.")
ISSUER = "https://token.actions.githubusercontent.com"


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower().replace("'", "")).strip("-")


def related(element, key):
    """The names an element's relationships of one kind point to."""
    return [rel[key] for rel in element.get("relationships") or [] if isinstance(rel, dict) and key in rel]


def load_map():
    elements = {}
    for path in sorted(MAP.glob("[1-5]-*/*/*.yml")):
        element = yaml.safe_load(path.read_text()) or {}
        if element.get("name"):
            element["_path"] = path.relative_to(ROOT).as_posix()
            elements[element["name"]] = element
    return elements


def extra_settings(agent, p, identity):
    """What a film sets for one agent on top of its rights, such as a mandate's limits, read from where they're
    decided. Return {"workflow": {...}} to add keys to its run's job (timeout-minutes, say), {"unity gateway":
    {...}} to add a section to its unity-gateway.yml (a rate limit, say), {"before": [...]} for steps its run
    takes before the agent starts (a plain check, say), or {"runner": [...]} for more of the runner's flags (a
    limit on rounds, say). Nothing, by default.

    An agent with a mandate in force (a page in governance/8-mandates/, named on its assignment beside its stage)
    gets each line of the page that its run holds: its hour as the run's timeout, its rounds as the runner's
    limit, its budget as a rate limit in tokens a minute on its own service principal, on each model it calls, and
    its plain check as the run's first step, reading what agents/tools.yml says tonight's copy is. With two
    mandates, each limit is the tighter. scripts/check/mandates.py fails when what this writes allows more than a
    page (A mandate, written and enforced)."""
    pages = []
    for rel in agent.get("relationships") or []:
        if isinstance(rel, dict) and "assignment" in rel:
            named = rel.get("mandate")
            for name in [] if named is None else named if isinstance(named, list) else [named]:
                page = yaml.safe_load((ROOT / "governance" / str(name)).read_text()) or {}
                if page.get("status") == "in force":
                    pages.append(dict(page, _path=f"governance/{name}"))
    if not pages:
        return {}
    limit = {key: min((page.get("limits") or {})[key] for page in pages) for key in ("minutes", "rounds", "tokens a minute")}
    models = sorted(full_name for securable, full_name in p["gateway"] if securable == "model_service")
    extra = {"mandates": [(page["_path"], page.get("task")) for page in pages], "limits": limit,
             "workflow": {"timeout-minutes": limit["minutes"]},
             "runner": [f"--max-rounds {limit['rounds']}"],
             "unity gateway": {"rate limits": [
                 {"securable type": "model_service", "full name": model,
                  "for": f"its budget, from its mandate: at most {limit['tokens a minute']} tokens a minute",
                  "body": {"key": "service_principal", "principal": p["sp"], "renewal_period": "minute",
                           "tokens": limit["tokens a minute"]}} for model in models]}}
    copy = identity.get("tonight's copy") or {}
    if copy and any((page.get("checks") or {}).get("first") for page in pages):
        source = copy["source"]
        extra["before"] = [{
            "name": "The plain check, before it starts - has tonight's copy arrived? If not, nothing starts",
            "why": [f"Plain code, not the agent: dbt reads when {source} last landed, and a copy from before",
                    f"{copy['since']} UTC today stops the run here, before the agent has started"],
            "run": f"dbt source freshness --select source:{source} --target agent || true   # its own limits are in days\n"
                   "last=$(jq -r '.results[0].max_loaded_at // empty' target/sources.json)\n"
                   'echo "The copy last landed at ${last:-no time}"\n'
                   f'[[ "$last" > "$(date -u +%Y-%m-%dT{copy["since"]})" ]]'}]
    return extra


def dbt_needs():
    """The variables dbt's agent target reads (profiles.yml), which each agent's run must set; None if there's no
    agent target."""
    for profile in (yaml.safe_load(PROFILES.read_text()) or {}).values():
        target = ((profile or {}).get("outputs") or {}).get("agent")
        if target:
            return sorted(set(re.findall(r"env_var\('(\w+)'", json.dumps(target))))
    return None


def in_order(steps):
    """A role's steps in the order its process runs them: each one triggers the next."""
    names = {s["name"]: s for s in steps}
    nexts = {s["name"]: [n for n in related(s, "triggering") if n in names] for s in steps}
    firsts = sorted(n for n in names if not any(n in after for after in nexts.values())) or sorted(names)
    ordered = []
    for first in firsts:
        step = first
        while step and step not in ordered:
            ordered.append(step)
            step = (nexts.get(step) or [None])[0]
    return [names[n] for n in ordered + sorted(set(names) - set(ordered))]


class Problems(list):
    def __call__(self, text):
        self.append(text)


def plan(agent, elements, tools, problems):
    """What one agent may do, from the map: its steps, and each right in each tool with the steps it comes from."""
    name = agent["name"]
    roles = related(agent, "assignment")
    if len(roles) != 1:
        problems(f"{agent['_path']}: an agent has one role on the map, and {name!r} has {len(roles)}")
        return None
    role = roles[0]
    steps = [step for step in elements.values() if step.get("kind") == "business process" and role in related(step, "assignment")]
    if not steps:
        return None  # no steps yet, so nothing to write: its folder comes once its role's steps are on the map
    services = [s for s in elements.values() if s.get("kind") == "application service"]
    identity = (tools.get("agents") or {}).get(name)
    if not identity:
        problems(f"{TOOLS.relative_to(ROOT)}: no line for {name!r}, which the map assigns to {role!r}: the platform team adds its name in each tool first")
        return None

    dbx, gh = tools["databricks"], tools["github"]
    short = name[:-len(" agent")] if name.endswith(" agent") else name
    p = {"name": name, "slug": slug(name), "owner": agent.get("owner"), "role": role, "definition": agent.get("definition", ""),
         "path": agent["_path"], "group": "_".join(role.split()) + "s", "sp": identity["service principal"],
         "app": slug(name), "branches": f"agent/{slug(short)}/*", "schema": "_".join(slug(name).split("-")),
         "repository": f"{gh['organization']}/{gh['repository']}", "steps": [], "uc": {}, "gateway": {}, "memory": {},
         "github": {}, "dbt": [], "app_steps": [], "extra": {}}
    p["environment"] = p["app"]

    def add(table, key, step, what):
        entry = table.setdefault(key, {"steps": [], "what": []})
        if step not in entry["steps"]:
            entry["steps"].append(step)
        if what and what not in entry["what"]:
            entry["what"].append(what)

    for step in in_order(steps):
        sname = step["name"]
        reads, writes = related(step, "access (reads)"), related(step, "access (writes)")
        calls = [s["name"] for s in services if sname in related(s, "serving")]
        if str(step.get("people only", "")).lower() in ("yes", "true"):
            problems(f"{step['_path']}: {sname!r} is a step only people do, and its role, {role!r}, is filled by {name!r}")
        if not (reads or writes) or not calls:
            problems(f"{step['_path']}: {sname!r}, a step of {role!r}, which {name!r} fills, must say what it reads or writes "
                     "and which tools it calls, or no tool can be set from it")
            continue
        p["steps"].append({"name": sname, "reads": reads, "writes": writes, "calls": calls})
        for access, objects in (("read", reads), ("write", writes)):
            for obj in objects:
                where = (tools.get("objects") or {}).get(obj)
                if where is None:
                    problems(f"{TOOLS.relative_to(ROOT)}: no line for {obj!r}, which {sname!r} {'reads' if access == 'read' else 'writes'}")
                    continue
                through = where.get("through") or []
                if through and not set(through) & set(calls):
                    problems(f"{step['_path']}: {sname!r} {'reads' if access == 'read' else 'writes'} {obj!r}, which a step reaches only "
                             f"through {' or '.join(through)}, and it calls none of them")
                uc = where.get("unity catalog") or {}
                if access == "read":
                    for schema in uc.get("read") or []:
                        add(p["uc"], ("USE CATALOG", "catalog", dbx["production"]), sname, obj)
                        add(p["uc"], ("USE SCHEMA", "schema", f"{dbx['production']}.{schema}"), sname, obj)
                        add(p["uc"], ("SELECT", "schema", f"{dbx['production']}.{schema}"), sname, obj)
                    if where.get("memory store"):
                        add(p["memory"], where["memory store"], sname, obj)
                if access == "write":
                    if uc.get("build") == "development":
                        add(p["uc"], ("USE CATALOG", "catalog", dbx["development"]), sname, obj)
                        add(p["uc"], ("CREATE SCHEMA", "catalog", dbx["development"]), sname, obj)
                    for permission in (where.get("github") or {}):
                        add(p["github"], permission, sname, obj)
                    if where.get("memory store"):
                        problems(f"{step['_path']}: {sname!r} writes {obj!r}, and no agent writes the team's memory: the platform keeps it")
        for call in calls:
            tool = (tools.get("services") or {}).get(call)
            if tool is None:
                problems(f"{TOOLS.relative_to(ROOT)}: no line for the tool {call!r}, which {sname!r} calls")
                continue
            for kind, full_name in ((tool.get("unity gateway") or {}).items()):
                securable = kind.replace(" ", "_")
                add(p["gateway"], (securable, full_name), sname, call)
                catalog, schema, _ = full_name.split(".")
                add(p["uc"], ("USE CATALOG", "catalog", catalog), sname, f"the {call} tool")
                add(p["uc"], ("USE SCHEMA", "schema", f"{catalog}.{schema}"), sname, f"the {call} tool")
            if tool.get("github") and sname not in p["app_steps"]:
                p["app_steps"].append(sname)
            if tool.get("dbt") and sname not in p["dbt"]:
                p["dbt"].append(sname)
    if not p["steps"]:
        return None
    p["extra"] = extra_settings(agent, p, identity) or {}
    return p


def when(steps):
    return ", ".join(steps)


def order(p, steps):
    """Steps in the order the process runs them."""
    names = [s["name"] for s in p["steps"]]
    return sorted(steps, key=lambda n: names.index(n) if n in names else len(names))


# ----------------------------------------------------------------------------------------- the files


def grants_sql(p, tools):
    dbx = tools["databricks"]
    lines = [f"-- {HEADER[0]}", f"-- {HEADER[1]}", "--",
             f"-- The {p['name']}'s rights in Unity Catalog. Its role's group, {p['group']}, holds them, never its service",
             "-- principal itself, so a second agent in the role gets the same rights and no more. The group's members are",
             "-- the agents the map assigns to the role; the platform team adds each one in the account console, and the",
             "-- nightly check compares them with the map:",
             f"--   {p['name']}  {p['sp']}", "--",
             "-- Each grant says which thing on the map it's for, and which of its role's steps reads or writes it."]
    blocks = {}
    for (privilege, kind, securable), why in p["uc"].items():
        things = tuple(w for w in why["what"] if not w.startswith("the "))
        key = (things, tuple(order(p, why["steps"]))) if things else ((), ())
        blocks.setdefault(key, []).append((privilege, kind, securable))
    for (things, steps), grants in sorted(blocks.items(), key=lambda kv: not kv[0][0]):
        lines.append("")
        if things:
            reads = any(g[0] == "SELECT" for g in grants)
            lines.append(f"-- {', '.join(things)}, which {'it reads' if reads else 'it writes'} in: {when(steps)}")
            if dbx["development"] in {g[2] for g in grants}:
                lines.append(f"-- dbt builds a schema for each layer ({p['schema']}_staging, {p['schema']}_marts, ...), so it creates its")
                lines.append("-- own schemas in the development catalog, and owns only what it creates.")
            elif reads:
                lines.append("-- Names masked: the group isn't a reader of direct personal data, so the catalog's policy masks them.")
        else:
            lines.append("-- The tools its steps call, through Unity Gateway: their catalog and schemas. EXECUTE on each")
            lines.append("-- model and tool server is in unity-gateway.yml, with the steps that call it.")
        merged = {}
        for privilege, kind, securable in grants:
            merged.setdefault((kind, securable), []).append(privilege)
        for (kind, securable), privileges in merged.items():
            lines.append(f"grant {', '.join(x.lower() for x in privileges)} on {kind} {securable} to `{p['group']}`;")
    return "\n".join(lines) + "\n"


def gateway_yml(p):
    lines = [f"# {HEADER[0]}", f"# {HEADER[1]}", "#",
             f"# The {p['name']}'s calls through Unity Gateway: EXECUTE for its role's group, {p['group']}, on each model",
             "# and tool server its steps call, and no other. The platform team applies each entry as the body of",
             "# PATCH /api/2.1/unity-catalog/permissions/<securable type>/<full name> (grants.sql gives the group USE",
             "# CATALOG and USE SCHEMA on their catalog and schemas).", "", f"group: {p['group']}", "services:"]
    for (securable, full_name), why in sorted(p["gateway"].items(), key=lambda kv: (kv[0][0] != "model_service", kv[0][1])):
        lines += [f"  - securable type: {securable}",
                  f"    full name: {full_name}",
                  f"    for: the {why['what'][0]}{' tool' if securable == 'mcp_service' else ''}",
                  f"    called by: [{when(order(p, why['steps']))}]",
                  "    body: {changes: [{principal: " + p["group"] + ", add: [EXECUTE]}]}"]
    for key, value in (p["extra"].get("unity gateway") or {}).items():
        lines += ["", yaml.safe_dump({key: value}, sort_keys=False, width=110).rstrip()]
    return "\n".join(lines) + "\n"


def memory_yml(p):
    if not p["memory"]:
        return None
    lines = [f"# {HEADER[0]}", f"# {HEADER[1]}", "#",
             "# The team's memory, which the platform keeps in Lakebase: agents read it, second to the governed",
             "# definitions, and none writes it. A store's permissions don't take groups, so it's granted to each",
             "# agent the map assigns to the role, by its application ID, read only, by the store's creator, the",
             "# platform's memory keeper, with the AgentKit SDK:",
             "#     memory_stores.get(<store>).grant_permission(<application ID>, principal_type=\"SERVICE_PRINCIPAL\",",
             "#                                                   permission=\"READ\")", ""]
    for store, why in p["memory"].items():
        lines += [f"store: {store}", f"read by: [{when(order(p, why['steps']))}]", "grants:",
                  f"  - {{principal: {p['sp']}, agent: {p['name']}, permission: READ}}"]
    return "\n".join(lines) + "\n"


def github_yml(p, tools):
    gh = tools["github"]
    words = {"contents": "contents", "pull requests": "pull_requests"}

    def col(text, note):
        return text.ljust(max(44, len(text) + 2)) + "# " + note

    lines = [f"# {HEADER[0]}", f"# {HEADER[1]}", "#",
             f"# The {p['name']} in GitHub: its App, whose commits and pull requests read {p['app']}[bot], and the",
             "# environment its runs use. The App belongs to the university's organization, not to a person.", "",
             "app:", f"  name: {p['app']}", f"  owner: {gh['organization']}",
             col(f"  repositories: [{p['repository']}]", "installed on this one repository, and no other"),
             col("  permissions:", "from what its steps write there; every App also reads metadata")]
    for permission, why in p["github"].items():
        lines.append(col(f"    {words.get(permission, permission)}: write", f"{', '.join(why['what'])}, written in: {when(order(p, why['steps']))}"))
    lines += [col("  events: []", "it listens to nothing: each run starts it"),
              col("  key: in a vault, sign-only", "the token service signs with it; no run sees it"),
              col(f"  token service: {gh['token service']}", "hands each run a token for this repository and these"),
              col("", "permissions, which ends after an hour"),
              col(f"branches: {p['branches']}", "the only ones its repository tool writes; the rules on main stop a push to main"),
              "environment:",
              col(f"  name: {p['environment']}", "its runs' environment, which its federation policy names"),
              col("  deployment branches: [main]", "only the workflow as it is on main may use it")]
    return "\n".join(lines) + "\n"


def federation_json(p, tools):
    policy = {"oidc_policy": {"issuer": ISSUER, "audiences": [tools["databricks"]["account"]],
                              "subject": f"repo:{p['repository']}:environment:{p['environment']}"}}
    return json.dumps(policy, indent=2) + "\n"


def workflow_yml(p, tools):
    dbx, gh = tools["databricks"], tools["github"]
    job_extra = "".join(f"    {k}: {v}\n" for k, v in (p["extra"].get("workflow") or {}).items())
    before = "".join(f"      - name: {s['name']}\n" + "".join(f"        # {line}\n" for line in s.get("why") or [])
                     + "        run: |\n" + "".join(f"          {line}\n" for line in s["run"].splitlines())
                     for s in p["extra"].get("before") or [])
    runner = "".join(f" {flag}" for flag in p["extra"].get("runner") or [])
    return f"""# {HEADER[0]}
# {HEADER[1]}
#
# The {p['name']}'s run, in GitHub Actions: in the project's own repository it would be
# .github/workflows/{p['slug']}.yml. It signs in with no secret the agent can see or leak. GitHub vouches for the
# run with a short-lived pass, which Databricks takes because the service principal's federation policy names this
# repository and this environment (federation-policy.json), and the token service takes to hand back the App's
# token. The agent's loop is the platform team's runner, the same for every agent; this run gives it its name, its
# tools and its dbt target, and nothing else.
name: {p['name']}

on:
  workflow_dispatch:
    inputs:
      ticket:
        description: The ticket it's given
        required: true

permissions:
  contents: read
  id-token: write              # its pass: GitHub vouches for this run

concurrency: {p['slug']}

jobs:
  run:
    runs-on: ubuntu-latest
    environment: {p['environment']}
{job_extra}    env:
      DATABRICKS_AUTH_TYPE: github-oidc
      DATABRICKS_HOST: {dbx['workspace']}
      DATABRICKS_CLIENT_ID: {p['sp']}   # its service principal's application ID: public, not a secret
      DATABRICKS_HTTP_PATH: {dbx['warehouse']}
      DATABRICKS_CATALOG: {dbx['development']}
      DBT_AGENT_SCHEMA: {p['schema']}           # dbt's agent target builds {p['schema']}_marts and the other layers here
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-python@v7
        with:
          python-version: "3.12"
      - name: dbt for Databricks, and the platform team's runner
        run: |
          pip install -r requirements-databricks.txt
          pip install --index-url https://packages.uni.example/simple agent-runner
      - name: Its pass for dbt, which signs in with it (profiles.yml, the agent output)
        # A pass lasts minutes, so the runner writes a new one here before each build, the same way
        run: |
          curl -sSf -H "Authorization: Bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \\
            "$ACTIONS_ID_TOKEN_REQUEST_URL&audience={dbx['account']}" | jq -r .value > "$RUNNER_TEMP/pass"
          echo "DATABRICKS_OIDC_TOKEN_FILEPATH=$RUNNER_TEMP/pass" >> "$GITHUB_ENV"
{before}      - name: Its App's token, for one repository and its permissions, for an hour
        id: app
        run: |
          pass=$(curl -sSf -H "Authorization: Bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \\
            "$ACTIONS_ID_TOKEN_REQUEST_URL&audience={gh['token service']}" | jq -r .value)
          token=$(curl -sSf -X POST -H "Authorization: Bearer $pass" {gh['token service']}/{p['app']} | jq -r .token)
          echo "::add-mask::$token"
          echo "token=$token" >> "$GITHUB_OUTPUT"
      - name: The {p['name']}, on its ticket
        env:
          GH_TOKEN: ${{{{ steps.app.outputs.token }}}}
          TICKET: ${{{{ inputs.ticket }}}}
        run: agent-runner --agent "{p['name']}" --ticket "$TICKET" --branches "{p['branches']}" --dbt-target agent{runner}
"""


def readme(p, tools, files):
    dbx = tools["databricks"]
    second = {name for name, e in tools.get("_elements", {}).items() if str(e.get("priority", "")) == "second"}

    def things(names):
        first = [n for n in names if n not in second]
        then = [n for n in names if n in second]
        return ", ".join(first) + (f"; second, {', '.join(then)}" if then else "") or "nothing"

    rows = "\n".join(f"| {s['name']} | {things(s['reads'])} | {things(s['writes'])} | {', '.join(s['calls'])} |" for s in p["steps"])
    tools_ = sorted(k[1] for k in p["gateway"] if k[0] == "mcp_service")
    models = sorted(k[1] for k in p["gateway"] if k[0] == "model_service")
    perms = " and ".join(p["github"])
    names = [f"| Databricks | Its service principal, \"{p['name']}\", `{p['sp']}` | Its role's group, `{p['group']}`: "
             f"reads production ({', '.join(sorted({k[2].split('.')[1] for k in p['uc'] if k[0] == 'SELECT'}))}, names masked), and builds only in "
             f"schemas of its own in `{dbx['development']}` | `grants.sql` |",
             f"| Unity Gateway | The same | `EXECUTE` on {len(models)} model ({', '.join(f'`{m}`' for m in models)}) and {len(tools_)} tool servers "
             f"({', '.join(f'`{t}`' for t in tools_)}) | `unity-gateway.yml` |"]
    if p["memory"]:
        names.append(f"| The team's memory | The same | Read only: {', '.join(f'`{s}`' for s in p['memory'])} | `memory.yml` |")
    names += [f"| GitHub | Its App, `{p['app']}`: its work reads `{p['app']}[bot]` | One repository, `{p['repository']}`; {perms}, write; "
              f"only branches `{p['branches']}` | `github-app.yml` |",
              f"| dbt | The target `agent` (`profiles.yml`), signed in as its service principal | Builds into `{p['schema']}_marts` and its other "
              f"layers in `{dbx['development']}` | `workflow.yml` |",
              f"| Its runs | GitHub Actions, in the environment `{p['environment']}` | Signs in with no secret it can see or leak | "
              "`workflow.yml`, `federation-policy.json` |"]
    names = "\n".join(names)
    return f"""---
owner: {p['owner']}
role: {p['role']}
---

# The {p['name']}

*{HEADER[0]} {HEADER[1]}*

{p['definition']} Its owner, {p['owner']}, answers for what it does. On Noor's map it's
`{p['path']}`, assigned to the role *{p['role']}*.

## What it may do, and where each right comes from

Its role's steps on the map say what it reads, writes and calls; every right below comes from one of them, and
nothing else does. The other steps of the services it works in are other roles', and its role's `may not:` says
what only people do.

| Step | Reads | Writes | Calls |
|---|---|---|---|
{rows}

## Its name and its rights in each tool

| Tool | Its name there | Its rights | File |
|---|---|---|---|
{names}

To change a right, change its step on the map, through review; the script writes these files again, and the
platform team applies them. A right given by hand in a tool is drift: the nightly check fails on it
(`agents/README.md`).
{mandate_section(p)}"""


def mandate_section(p):
    """What its mandate adds on top of its rights, if it has one in force."""
    mandates, limit = p["extra"].get("mandates"), p["extra"].get("limits")
    if not mandates:
        return ""
    pages = " and ".join(f"`{path}` ({task})" for path, task in mandates)
    check = ", and a plain check as its run's first step (`workflow.yml`)" if p["extra"].get("before") else ""
    text = (f"Its mandate, {pages}, says what it may do alone. Its limits are written on top of its rights, in the "
            f"same files: {limit['minutes']} minutes as its run's timeout and {limit['rounds']} rounds as the runner's limit "
            f"(`workflow.yml`), {limit['tokens a minute']} tokens a minute as a rate limit on its service principal "
            f"(`unity-gateway.yml`){check}. `scripts/check/mandates.py` fails when any of them allows more than the page.")
    return "\n## Its mandate\n\n" + textwrap.fill(text, width=110, break_long_words=False, break_on_hyphens=False) + "\n"


def rights_held_sql(plans):
    groups = sorted({p["group"] for p in plans})
    sps = sorted({p["sp"] for p in plans})
    who = ", ".join(f"'{g}'" for g in groups + sps) or "''"
    return f"""-- {HEADER[0]}
-- {HEADER[1]}
--
-- The rights every agent's group, and every agent's service principal, holds in Unity Catalog now, granted
-- directly on a catalog, a schema or a table. agents/nightly-check.yml runs it on a SQL warehouse, as the
-- platform's rights reader, and scripts/generate/agents.py --drift compares the rows with the map. A service
-- principal holds nothing itself: a row for one is drift.
select grantee, privilege_type as privilege, 'catalog' as securable_type, catalog_name as securable
from system.information_schema.catalog_privileges
where grantee in ({who}) and coalesce(inherited_from, 'NONE') = 'NONE'
union all
select grantee, privilege_type, 'schema', catalog_name || '.' || schema_name
from system.information_schema.schema_privileges
where grantee in ({who}) and coalesce(inherited_from, 'NONE') = 'NONE'
union all
select grantee, privilege_type, 'table', table_catalog || '.' || table_schema || '.' || table_name
from system.information_schema.table_privileges
where grantee in ({who}) and coalesce(inherited_from, 'NONE') = 'NONE'
order by grantee, securable_type, securable, privilege
"""


def nightly_yml(plans, tools):
    dbx, gh = tools["databricks"], tools["github"]
    groups = " ".join(sorted({p["group"] for p in plans}))
    services = " ".join(sorted({f"{k[0]}/{k[1]}" for p in plans for k in p["gateway"]}))
    stores = " ".join(sorted({s for p in plans for s in p["memory"]}))
    apps = " ".join(sorted({p["app"] for p in plans}))
    return f"""# {HEADER[0]}
# {HEADER[1]}
#
# The check each night: the rights each tool holds for the agents, against what Noor's map gives them. In the
# project's own repository it would be .github/workflows/agents-nightly-check.yml. It runs as the platform's rights
# reader, a service principal that may read grants and permissions and change nothing, signed in with no secret;
# the team's memory store lists its grants only to its creator, the memory keeper, so that one step signs in as
# it; and GitHub's side is read with the token service's read-only token. It fails on a right a tool holds that
# the map doesn't give, and on one the map gives that a tool doesn't hold, and the platform team sees it in the
# morning. Nobody fixes drift in the tool: the right is taken back, or the map changes first, through review.
name: agents' rights against the map

on:
  schedule:
    - cron: "0 2 * * *"        # 02:00 UTC, every night
  workflow_dispatch:

permissions:
  contents: read
  id-token: write

jobs:
  check:
    runs-on: ubuntu-latest
    environment: rights-reader
    env:
      DATABRICKS_AUTH_TYPE: github-oidc
      DATABRICKS_HOST: {dbx['workspace']}
      DATABRICKS_CLIENT_ID: {dbx['rights reader']}   # the rights reader's application ID
    steps:
      - uses: actions/checkout@v7
      - uses: databricks/setup-cli@main
      - run: pip install pyyaml databricks-sdk "databricks-agentbricks>=0.8.0"
      - name: Unity Catalog, the grants each agent's group holds (rights-held.sql)
        run: |
          mkdir -p held
          jq -n --rawfile sql agents/rights-held.sql --arg w "{dbx['warehouse'].rsplit('/', 1)[-1]}" \\
            '{{statement: $sql, warehouse_id: $w, wait_timeout: "50s", disposition: "INLINE", format: "JSON_ARRAY"}}' > held/request.json
          databricks api post /api/2.0/sql/statements --json @held/request.json |
            jq '[.result.data_array[] | {{grantee: .[0], privilege: .[1], securable_type: .[2], securable: .[3]}}]' > held/unity-catalog.json
      - name: Unity Catalog, each group's members, by their application IDs
        run: |
          for group in {groups}; do
            ids=$(databricks groups list --filter "displayName eq \\"$group\\"" -o json | jq -r '.[0].members[]?.value')
            for id in $ids; do databricks service-principals get "$id" -o json | jq -r '.applicationId // empty'; done |
              jq -R . | jq -s --arg g "$group" '{{($g): .}}'
          done | jq -s 'add // {{}}' > held/groups.json
      - name: Unity Gateway, who may call each model and tool server
        run: |
          for service in {services}; do
            databricks api get "/api/2.1/unity-catalog/permissions/$service" |
              jq --arg s "${{service#*/}}" '[.privilege_assignments[]? | {{securable: $s, principal, privileges}}]'
          done | jq -s 'add // []' > held/unity-gateway.json
      - name: The team's memory, who may read each store, listed by its creator
        env:
          DATABRICKS_CLIENT_ID: {dbx['memory keeper']}   # the memory keeper's application ID
        run: |
          python - <<'PY'
          import json
          from databricks.sdk import WorkspaceClient
          from databricks_agentkit import AgentKitClient
          client = AgentKitClient(WorkspaceClient())
          rows = [{{"store": store, "principal": grant.principal.name,
                   "permission": getattr(grant.permission, "value", grant.permission)}}
                  for store in "{stores}".split() for grant in client.memory_stores.get(store).list_permissions(page_size=100)]
          json.dump(rows, open("held/memory.json", "w"))
          PY
      - name: GitHub, each App's installation, its repositories and permissions
        run: |
          pass=$(curl -sSf -H "Authorization: Bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \\
            "$ACTIONS_ID_TOKEN_REQUEST_URL&audience={gh['token service']}" | jq -r .value)
          export GH_TOKEN=$(curl -sSf -X POST -H "Authorization: Bearer $pass" {gh['token service']}/rights-reader | jq -r .token)
          echo "::add-mask::$GH_TOKEN"
          for app in {apps}; do
            install=$(gh api "/orgs/{gh['organization']}/installations" --paginate --jq ".installations[] | select(.app_slug == \\"$app\\")")
            [ -z "$install" ] && continue
            if [ "$(jq -r .repository_selection <<< "$install")" = all ]; then repos='["all"]'
            else repos=$(gh api "/orgs/{gh['organization']}/installations/$(jq -r .id <<< "$install")/repositories" --paginate \\
              --jq '[.repositories[].full_name]' | jq -s 'add'); fi
            jq -n --arg app "$app" --argjson i "$install" --argjson r "$repos" '{{app: $app, repositories: $r, permissions: $i.permissions}}'
          done | jq -s . > held/github.json
      - name: Against the map
        run: python scripts/generate/agents.py --drift held/
"""


# ----------------------------------------------------------------------------------------- the check each night


def expected(plans, tools):
    want = {"unity catalog": set(), "groups": {}, "unity gateway": set(), "memory": set(), "github": {}}
    for p in plans:
        want["groups"].setdefault(p["group"], set()).add(p["sp"])
        for (privilege, kind, securable) in p["uc"]:
            want["unity catalog"].add((p["group"], privilege, kind, securable))
        for (securable, full_name) in p["gateway"]:
            want["unity gateway"].add((full_name, p["group"], "EXECUTE"))
        for store in p["memory"]:
            want["memory"].add((store, p["sp"], "READ"))
        want["github"][p["app"]] = {"repositories": [p["repository"]],
                                    "permissions": dict({"metadata": "read"}, **{k.replace(" ", "_"): "write" for k in p["github"]})}
    return want


def drift(plans, tools, folder):
    """What the tools hold now (the nightly export, in folder) against what the map gives."""
    want, found = expected(plans, tools), []
    principals = set(want["groups"]) | {sp for members in want["groups"].values() for sp in members}

    def read(name, default):
        path = Path(folder) / name
        if not path.exists():
            found.append(f"{path}: not exported tonight, so that tool wasn't compared")
            return default
        return json.loads(path.read_text())

    held = {(r["grantee"], r["privilege"].upper(), r["securable_type"], r["securable"]) for r in read("unity-catalog.json", [])
            if r["grantee"] in principals}
    for right in sorted(held - want["unity catalog"]):
        found.append(f"Unity Catalog: {right[0]} holds {right[1]} on {right[2]} {right[3]}, which the map doesn't give it")
    for right in sorted(want["unity catalog"] - held):
        found.append(f"Unity Catalog: {right[0]} lacks {right[1]} on {right[2]} {right[3]}, which the map gives it")
    members = {group: set(ids) for group, ids in read("groups.json", {}).items() if group in want["groups"]}
    for group, ids in want["groups"].items():
        for sp in sorted(members.get(group, set()) - ids):
            found.append(f"Unity Catalog: {sp} is in {group}, and the map doesn't assign it to the role")
        for sp in sorted(ids - members.get(group, set())):
            found.append(f"Unity Catalog: {sp} isn't in {group}, though the map assigns it to the role")
    held = {(r["securable"], r["principal"], privilege.upper()) for r in read("unity-gateway.json", [])
            for privilege in r["privileges"] if r["principal"] in principals}
    for right in sorted(held - want["unity gateway"]):
        found.append(f"Unity Gateway: {right[1]} may call {right[0]}, which the map doesn't give it")
    for right in sorted(want["unity gateway"] - held):
        found.append(f"Unity Gateway: {right[1]} can't call {right[0]}, which its steps call")
    held = {(r["store"], r["principal"], r["permission"].upper()) for r in read("memory.json", []) if r["principal"] in principals}
    for right in sorted(held - want["memory"]):
        found.append(f"Memory: {right[1]} holds {right[2]} on {right[0]}, which the map doesn't give it")
    for right in sorted(want["memory"] - held):
        found.append(f"Memory: {right[1]} can't read {right[0]}, which its steps read")
    installs = {i["app"]: i for i in read("github.json", []) if i["app"] in want["github"]}
    for app, should in want["github"].items():
        now = installs.get(app)
        if not now:
            found.append(f"GitHub: {app} isn't installed, and the map gives it work there")
            continue
        for repository in sorted(set(now.get("repositories", [])) ^ set(should["repositories"])):
            verb = "is installed on" if repository in now.get("repositories", []) else "isn't installed on"
            found.append(f"GitHub: {app} {verb} {repository}, and the map says {', '.join(should['repositories'])}")
        for permission in sorted(set(now.get("permissions", {})) | set(should["permissions"])):
            if now.get("permissions", {}).get(permission) != should["permissions"].get(permission):
                found.append(f"GitHub: {app} has {permission}: {now.get('permissions', {}).get(permission, 'none')}, "
                             f"and the map gives {should['permissions'].get(permission, 'none')}")
    return found


# ----------------------------------------------------------------------------------------- main


def build(problems):
    tools = yaml.safe_load(TOOLS.read_text()) or {}
    elements = load_map()
    tools["_elements"] = elements
    names = {name for name, e in elements.items() if e.get("kind") == "application component" and str(e.get("agent", "")).lower() in ("yes", "true")}
    for name in tools.get("agents") or {}:
        if name not in names:
            problems(f"{TOOLS.relative_to(ROOT)}: {name!r} isn't an agent on the map: an agent gets a name in the tools only once it has a place there")
    plans = [p for p in (plan(elements[name], elements, tools, problems) for name in sorted(names)) if p]
    needs = dbt_needs()
    if plans and needs is None:
        problems(f"{PROFILES.relative_to(ROOT)}: no agent target, which each agent's run builds with")
    files = {}
    for p in plans:
        folder = AGENTS / p["slug"]
        run = workflow_yml(p, tools)
        for name in needs or []:
            if not re.search(rf"\b{name}[:=]", run):
                problems(f"agents/{p['slug']}/workflow.yml doesn't set {name}, which dbt's agent target reads ({PROFILES.relative_to(ROOT)})")
        for file_name, text in (("grants.sql", grants_sql(p, tools)), ("unity-gateway.yml", gateway_yml(p)),
                                ("memory.yml", memory_yml(p)), ("github-app.yml", github_yml(p, tools)),
                                ("federation-policy.json", federation_json(p, tools)), ("workflow.yml", run)):
            if text:
                files[folder / file_name] = text
        files[folder / "README.md"] = readme(p, tools, files)
    if plans:
        files[HELD] = rights_held_sql(plans)
        files[NIGHTLY] = nightly_yml(plans, tools)
    return plans, tools, files


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="fail if a file is out of date, or isn't the script's")
    parser.add_argument("--drift", metavar="FOLDER", help="compare what the tools hold now, exported to FOLDER, with the map")
    args = parser.parse_args()
    problems = Problems()
    plans, tools, files = build(problems)
    if problems:
        print("\n".join(problems), file=sys.stderr)
        sys.exit(1)

    if args.drift:
        found = drift(plans, tools, args.drift)
        print("\n".join(found) if found else f"Every tool holds what the map gives its {len(plans)} agent(s), and no more")
        sys.exit(1 if found else 0)

    # Every folder in agents/ is the script's: one for each agent on the map whose role has steps.
    theirs = {path.parent for path in files if path.parent != AGENTS}
    strays = [f for f in sorted(AGENTS.glob("*/*")) if f.is_file() and (f.parent not in theirs or f not in files)]
    if args.check:
        stale = [path for path, text in files.items() if not path.exists() or path.read_text() != text]
        for path in stale:
            print(f"{path.relative_to(ROOT)} is out of date: run python scripts/generate/agents.py", file=sys.stderr)
        for path in strays:
            print(f"{path.relative_to(ROOT)} isn't written from the map: an agent's settings come only from its steps there",
                  file=sys.stderr)
        if stale or strays:
            sys.exit(1)
        print(f"agents/ is up to date: {len(plans)} agent(s), each with its rights from the map")
    else:
        for path, text in files.items():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        print(f"wrote agents/ for {len(plans)} agent(s): {', '.join(p['name'] for p in plans) or 'none'}")
        for path in strays:
            print(f"{path.relative_to(ROOT)} isn't written from the map: remove it, or give its agent steps on the map",
                  file=sys.stderr)
        if strays:
            sys.exit(1)


if __name__ == "__main__":
    main()
