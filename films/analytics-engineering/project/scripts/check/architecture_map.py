"""Checks the governance part of Noor's architecture map, and writes its views from it.

The map is in governance/3-architecture-map/: one YAML file per element, named after it, in the
folder of its layer and kind (README.md there). Elements name each other by name. The check fails if:

- a file isn't named after its element, or its kind doesn't fit its folder;
- two elements share a name, or an element has no name, owner or status, or its owner can't be
  reached (governance/2-owners/owners.yml);
- a relationship names an element that isn't on the map, or joins two kinds the map doesn't join
  that way;
- a business object hasn't exactly one home, or a copy isn't synced one way from the home (through
  other copies, with no loop), or has no drift check;
- a capability is coloured with no evidence, a service has no promise or no way to ask, or realizes
  no capability;
- an agent (an application component with `agent: 'yes'`) has no owner, no assignment to a role, or
  no stage from 1 to 5 for each kind of task on its assignment, or a `stage:` sits anywhere but on an
  agent's assignment;
- a role's rights don't come from its steps: a step only people do (`people only: 'yes'`) is
  assigned to a role an agent fills; a step of a role an agent fills doesn't say what it reads or
  writes, or no tool (an application service) serves it; a role with steps has a `may:` written by
  hand; an application service no component realizes, or that serves no step; `people only` sits
  anywhere but on a step, or `priority` anywhere but on a business object;
- a kind of task at stage 5 has no mandate beside it on the agent's assignment (`mandate:`, a page in
  governance/8-mandates/), or a mandate there isn't a page for one of its kinds of task at stage 5,
  in force, signed by the agent's owner and approved by someone else.

It writes three views into 6-views/, so nobody draws them by hand:

- services.md: what governance must be able to do, and the services it offers, with their
  promises and the steps that keep each promise;
- responsibilities.md: who does each step, who answers for it and who's told, from the steps;
- rights.md: each role's rights, from its steps: what each step reads (the governed context first,
  then what's marked `priority: second`), writes and calls, each right with the step it comes from,
  and, for a role an agent fills, who answers for what it reads and what's left out, with the reason.

    python scripts/check/architecture_map.py           # check the map and write its views
    python scripts/check/architecture_map.py --check   # check it, and fail if a view is out of date
"""
import argparse
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
MAP = ROOT / "governance" / "3-architecture-map"
REGISTER = ROOT / "governance" / "2-owners" / "owners.yml"
MANDATES = ROOT / "governance" / "8-mandates"
VIEWS = MAP / "6-views"
# Each kind's folder, in the map's reading order.
FOLDERS = {"principle": "1-motivation/principles", "capability": "2-strategy/capabilities",
           "business service": "3-business/services", "business role": "3-business/roles",
           "business actor": "3-business/actors", "business process": "3-business/process-steps",
           "business object": "4-information/business-objects",
           "application component": "5-application/application-components",
           "application service": "5-application/application-services"}
# Which relationship joins which kinds: from the element that holds it to the one it names.
JOINS = {"composition": {("capability", "capability")},
         "realization": {("business service", "capability"), ("business process", "business service"),
                         ("application component", "application service")},
         "assignment": {("business actor", "business role"), ("business process", "business role"),
                        ("application component", "business role")},
         "access (reads)": {("business process", "business object")},
         "access (writes)": {("business process", "business object")},
         "triggering": {("business process", "business process")},
         "serving": {("application service", "business process")}}
STATUSES = {"confirmed", "draft", "proposed"}
# What a relationship may say besides the element it names: on an agent's assignment, its stage for
# each kind of task, "<kind of task>: <1 to 5>", from 1 (it suggests) to 5 (a contributor with a
# mandate). ArchiMate has no element for how far an agent may act alone, so it's written there; and
# beside a kind of task at stage 5, the page in governance/8-mandates/ that gives it (`mandate:`).
DETAILS = {"assignment": {"stage", "mandate"}}
STAGES = range(1, 6)
# What a step reads comes in order: the governed context first, each part with an owner and changed
# only through review; then a business object marked `priority: second`, such as the team's memory,
# which nobody checks line by line. When the two disagree, the governed context wins.
PRIORITIES = {"second"}
HEADER = "*Generated by `scripts/check/architecture_map.py` from the map's elements. Don't edit it: change the elements, then run it.*\n"


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower().replace("'", "")).strip("-")


def load():
    elements, problems = {}, []
    for kind, folder in FOLDERS.items():
        for path in sorted((MAP / folder).glob("*.yml")):
            element = yaml.safe_load(path.read_text()) or {}
            where = path.relative_to(ROOT)
            name = element.get("name")
            if not name:
                problems.append(f"{where}: no name")
                continue
            if path.stem != slug(name):
                problems.append(f"{where}: name it {slug(name)}.yml, after its element")
            if element.get("kind") != kind:
                problems.append(f"{where}: a {element.get('kind')} doesn't go in {folder}/, which holds a {kind}")
            if name in elements:
                problems.append(f"{where}: {name!r} is also {elements[name]['_path']}: names are unique")
            for key in ("owner", "status"):
                if not element.get(key):
                    problems.append(f"{where}: no {key}")
            if element.get("status") and element["status"] not in STATUSES:
                problems.append(f"{where}: status {element['status']!r} isn't one of {', '.join(sorted(STATUSES))}")
            element["_path"] = where
            elements[name] = element
    for path in MAP.rglob("*.yml"):
        if not any(path.parent == MAP / folder for folder in FOLDERS.values()):
            problems.append(f"{path.relative_to(ROOT)}: not in a kind's folder ({', '.join(FOLDERS.values())})")
    return elements, problems


def is_agent(element):
    return element.get("kind") == "application component" and element.get("agent") == "yes"


def mandate_problems(element, where, assignment):
    """Beside each kind of task at stage 5 on an agent's assignment, its mandate: a page in
    governance/8-mandates/ for that kind of task and that agent, in force, signed by the agent's owner
    and approved by someone else. A kind of task at stage 5 with none is a problem, and so is a mandate
    beside any other stage."""
    problems = []
    stage = assignment.get("stage") or {}
    named = assignment.get("mandate")
    named = [] if named is None else named if isinstance(named, list) else [named]
    covered = set()
    for name in named:
        page_path = MANDATES.parent / str(name)
        if page_path.parent != MANDATES or page_path.suffix != ".yml" or not page_path.is_file():
            problems.append(f"{where}: its mandate {name!r} isn't a page in governance/8-mandates/")
            continue
        page = yaml.safe_load(page_path.read_text()) or {}
        task, signed, approved = page.get("task"), page.get("signed") or {}, page.get("approved") or {}
        covered.add(task)
        if page.get("agent") != element.get("name"):
            problems.append(f"{where}: its mandate {name} is the {page.get('agent')}'s, not the {element.get('name')}'s")
        if stage.get(task) != 5:
            problems.append(f"{where}: its mandate {name} is for {task!r}, at stage {stage.get(task)!r} on its "
                            "assignment: a mandate sits beside a kind of task at stage 5")
        if page.get("status") != "in force":
            problems.append(f"{where}: its mandate {name} is {page.get('status')!r}, not in force: its task "
                            "moves down a stage, and the mandate leaves the assignment")
        if signed.get("by") != element.get("owner"):
            problems.append(f"{where}: its mandate {name} is signed by {signed.get('by')!r}, not by its owner, "
                            f"{element.get('owner')!r}")
        if not approved.get("by") or approved.get("by") == signed.get("by"):
            problems.append(f"{where}: its mandate {name} isn't approved by a second person")
    for task, level in stage.items():
        if level == 5 and task not in covered:
            problems.append(f"{where}: {task!r} is at stage 5 with no mandate beside it: stage 5's gate is a "
                            "mandate, a page in governance/8-mandates/, signed by its owner and approved by someone else")
    return problems


def rels(element, kind):
    return [target for rel in element.get("relationships") or [] for k, target in rel.items() if k == kind]


def check(elements, owners):
    problems = []

    def target(where, name, kinds):
        found = elements.get(name)
        if not found:
            problems.append(f"{where}: {name!r} isn't on the map")
        elif found["kind"] not in kinds:
            problems.append(f"{where}: {name!r} is a {found['kind']}")
        return name if found else None

    for name, element in elements.items():
        where, kind = element["_path"], element["kind"]
        if element.get("owner") and element["owner"] not in owners:
            problems.append(f"{where}: owner {element['owner']!r} isn't in {REGISTER.relative_to(ROOT)}")
        agent = is_agent(element)
        if "agent" in element and not agent:
            problems.append(f"{where}: an agent is an application component with agent: 'yes', quoted "
                            "(YAML reads a bare yes as true)")
        if "stage" in element:
            problems.append(f"{where}: a stage sits only on an agent's assignment")
        for rel in element.get("relationships") or []:
            details = {k for k in rel if k in {d for ds in DETAILS.values() for d in ds}}
            joins = [k for k in rel if k not in details]
            if len(joins) != 1:
                problems.append(f"{where}: a relationship names one element: {', '.join(map(str, rel))}")
                continue
            rel_kind, = joins
            text = rel[rel_kind]
            for detail in sorted(details):
                if detail not in DETAILS.get(rel_kind, set()) or not agent:
                    problems.append(f"{where}: a {detail} sits only on an agent's assignment")
            allowed = {b for a, b in JOINS.get(rel_kind, set()) if a == kind}
            if not allowed:
                problems.append(f"{where}: a {kind} has no {rel_kind} relationship")
                continue
            target(where, text, allowed)
        if agent:
            assignments = [rel for rel in element.get("relationships") or [] if "assignment" in rel]
            if not assignments:
                problems.append(f"{where}: an agent with no assignment to a role")
            for rel in assignments:
                stage = rel.get("stage")
                if not isinstance(stage, dict) or not stage:
                    problems.append(f"{where}: no stage on its assignment to {rel['assignment']!r}: "
                                    "one line for each kind of task, '<kind of task>: <1 to 5>'")
                    continue
                for task, level in stage.items():
                    if isinstance(level, bool) or level not in STAGES:
                        problems.append(f"{where}: its stage for {task!r} is {level!r}, not one from 1 to 5")
                problems += mandate_problems(element, where, rel)
        if kind == "capability" and element.get("heat") and not element.get("evidence"):
            problems.append(f"{where}: coloured {element['heat']} with no evidence")
        if kind == "business service":
            for key in ("promise", "how_to_ask"):
                if not element.get(key):
                    problems.append(f"{where}: a service with no {key.replace('_', ' ')}")
            if not rels(element, "realization"):
                problems.append(f"{where}: realizes no capability")
        if kind == "business object":
            home = target(where, element["home"], {"application component"}) if element.get("home") else None
            if not home:
                problems.append(f"{where}: no home")
                continue
            synced = {home}
            for copy in element.get("copies") or []:
                place = target(where, copy.get("in", ""), {"application component"})
                source = copy.get("synced from")
                if place in synced:
                    problems.append(f"{where}: two homes or copies in {place}: one home, one copy per place")
                elif source not in synced:
                    problems.append(f"{where}: the copy in {place} is synced from {source or 'nowhere'}, "
                                    "which isn't the home or a copy before it")
                if str(copy.get("drift check")).lower() != "yes":
                    problems.append(f"{where}: the copy in {place} has no drift check")
                synced.add(place)
    return problems


def check_rights(elements):
    """A role's rights come from its steps: what each step reads and writes, and the tools it calls (the
    application services that serve it). So a step only people do can't be given to a role an agent
    fills, every step of such a role says what it reads or writes and which tools it calls, and no role
    with steps has its rights written by hand."""
    problems = []
    steps = of_kind(elements, "business process")
    for element in elements.values():
        where, kind = element["_path"], element["kind"]
        if "people only" in element and kind != "business process":
            problems.append(f"{where}: people only sits only on a step")
        elif "people only" in element and element["people only"] != "yes":
            problems.append(f"{where}: write people only: 'yes', quoted (YAML reads a bare yes as true)")
        if "priority" in element and kind != "business object":
            problems.append(f"{where}: priority sits only on a business object, read after the governed context")
        elif "priority" in element and element["priority"] not in PRIORITIES:
            problems.append(f"{where}: priority {element['priority']!r} isn't one of {', '.join(sorted(PRIORITIES))}")
    filled_by = {}
    for agent in (e for e in elements.values() if is_agent(e)):
        for role in rels(agent, "assignment"):
            filled_by.setdefault(role, []).append(agent["name"])
    calls = {}
    for service in of_kind(elements, "application service"):
        for step in rels(service, "serving"):
            calls.setdefault(step, []).append(service["name"])
    for role in of_kind(elements, "business role"):
        its_steps = [s for s in steps if role["name"] in rels(s, "assignment")]
        if its_steps and "may" in (role.get("rights") or {}):
            problems.append(f"{role['_path']}: a role with steps gets its rights from them: remove its may:, "
                            "which 6-views/rights.md makes from the steps")
        for agent in filled_by.get(role["name"], []):
            for step in its_steps:
                where, name = step["_path"], step["name"]
                if step.get("people only") == "yes":
                    problems.append(f"{where}: {name!r} is a step only people do, and its role, {role['name']!r}, "
                                    f"is filled by an agent, the {agent}")
                if not rels(step, "access (reads)") and not rels(step, "access (writes)"):
                    problems.append(f"{where}: {name!r}, a step of {role['name']!r}, which the {agent} fills, doesn't "
                                    "say what it reads or writes")
                if not calls.get(name):
                    problems.append(f"{where}: {name!r}, a step of {role['name']!r}, which the {agent} fills, calls no "
                                    "tool: a serving line on each application service it calls")
    realized = {s for c in of_kind(elements, "application component") for s in rels(c, "realization")}
    for service in of_kind(elements, "application service"):
        if service["name"] not in realized:
            problems.append(f"{service['_path']}: no component realizes {service['name']!r}")
        if not rels(service, "serving"):
            problems.append(f"{service['_path']}: {service['name']!r} serves no step")
    return problems


def of_kind(elements, kind):
    return [e for _, e in sorted(elements.items()) if e["kind"] == kind]


def ordered(steps):
    """The steps in the order they trigger each other, from the one nothing triggers."""
    by_name = {s["name"]: s for s in steps}
    triggered = {t for s in steps for t in rels(s, "triggering")}
    out, todo = [], [s for s in steps if s["name"] not in triggered]
    while todo:
        step = todo.pop(0)
        if step in out:
            continue
        out.append(step)
        todo += [by_name[t] for t in rels(step, "triggering") if t in by_name]
    return out + [s for s in steps if s not in out]


def services_view(elements):
    lines = ["# Governance: what it must do, and what it offers", "", HEADER,
             "## What it must be able to do", "", "| Capability | Owner | Heat | Evidence |", "|---|---|---|---|"]
    for cap in of_kind(elements, "capability"):
        lines.append(f"| {cap['name']} | {cap['owner']} | {cap.get('heat', '')} | {cap.get('evidence', '')} |")
    lines += ["", "## The services it offers", ""]
    for srv in of_kind(elements, "business service"):
        ask = srv["how_to_ask"]
        lines += [f"### {srv['name'][0].upper() + srv['name'][1:]}", "", f"**Promise.** {' '.join(srv['promise'].split())}", "",
                  f"**How to ask.** {ask[0].upper() + ask[1:]}. **Owner:** {srv['owner']}. "
                  f"**Realizes:** {', '.join(rels(srv, 'realization'))}.", ""]
        steps = [s for s in of_kind(elements, "business process") if srv["name"] in rels(s, "realization")]
        if steps:
            lines += ["| Step | Who does it | Reads | Writes | Then |", "|---|---|---|---|---|"]
            for step in ordered(steps):
                cell = lambda kind: ", ".join(rels(step, kind))
                lines.append(f"| {step['name']} | {cell('assignment')} | {cell('access (reads)')} "
                             f"| {cell('access (writes)')} | {cell('triggering')} |")
            lines.append("")
        else:
            lines += ["Its steps aren't on the map yet.", ""]
    return "\n".join(lines).rstrip() + "\n"


def responsibilities_view(elements):
    """From the steps: who does it (the role assigned), who answers for it (the role of the actor who
    owns what it writes: the one their owner's name gives, as in "Noor, data architect", if it's one of
    theirs, or else each role they hold) and who's told (the roles of the steps that read what it writes)."""
    roles_of = {}
    for actor in of_kind(elements, "business actor"):
        for owner in {e["owner"] for e in elements.values()}:
            if owner.split(",")[0] == actor["name"]:
                held, named = rels(actor, "assignment"), owner.partition(",")[2].strip()
                roles_of.setdefault(owner, [named] if named in held else held)
    steps = of_kind(elements, "business process")
    table = {}
    for step in ordered(steps):
        row = {}
        for role in rels(step, "assignment"):
            row.setdefault(role, set()).add("does")
        for obj in rels(step, "access (writes)"):
            for role in roles_of.get(elements[obj]["owner"], []):
                row.setdefault(role, set()).add("answers")
            for other in steps:
                if other is not step and obj in rels(other, "access (reads)"):
                    for role in rels(other, "assignment"):
                        row.setdefault(role, set()).add("told")
        table[step["name"]] = row
    roles = sorted({r for row in table.values() for r in row})
    lines = ["# Governance: who does what", "", HEADER,
             "From the steps on the map: who **does** each step (the role assigned to it), who **answers** for it "
             "(the role of the person who owns what it writes) and who's **told** (the roles of the steps that "
             "read what it writes). Who's consulted isn't on the map: it's agreed in each step.", "",
             "| Step | " + " | ".join(roles) + " |", "|---|" + "---|" * len(roles)]
    for name, row in table.items():
        lines.append(f"| {name} | " + " | ".join(", ".join(m for m in ("does", "answers", "told") if m in row.get(r, ()))
                                                  for r in roles) + " |")
    return "\n".join(lines) + "\n"


def rights_view(elements):
    """Each role's rights, from its steps on the map: what each step reads, writes and calls. For a role an
    agent fills, that's all it may do, so the view also says who answers for each thing it reads and what's
    left out of the services it works in, with the reason. For a role people fill, it's their part only."""
    second = {o["name"] for o in of_kind(elements, "business object") if o.get("priority") in PRIORITIES}
    calls, kept = {}, {}
    for service in of_kind(elements, "application service"):
        for step in rels(service, "serving"):
            calls.setdefault(step, []).append(service["name"])
    for component in of_kind(elements, "application component"):
        for service in rels(component, "realization"):
            kept.setdefault(service, []).append(component["name"])
    steps = [s for srv in of_kind(elements, "business service")
             for s in ordered([s for s in of_kind(elements, "business process") if srv["name"] in rels(s, "realization")])]
    steps += [s for s in of_kind(elements, "business process") if s not in steps]
    service_of = {s["name"]: ", ".join(rels(s, "realization")) for s in steps}
    writers = {}
    for step in steps:
        for obj in rels(step, "access (writes)"):
            writers.setdefault(obj, []).append(step)
    fills = {}
    for element in of_kind(elements, "business actor") + of_kind(elements, "application component"):
        for role in rels(element, "assignment"):
            fills.setdefault(role, []).append(element)
    roles_of_step = {s["name"]: rels(s, "assignment") for s in steps}

    def reads(step):
        first = [o for o in rels(step, "access (reads)") if o not in second]
        then = [o for o in rels(step, "access (reads)") if o in second]
        return ", ".join(first) + (f"; second: {', '.join(then)}" if then else "")

    def who(role):
        names = []
        for e in fills.get(role, []):
            if is_agent(e):
                names.append(f"the {e['name']}, an agent, whose owner is {e['owner']}")
            else:
                names.append(f"{e['name']}" + (", a team" if e.get("actor") == "team" else ""))
        return " and ".join(names) or "nobody on the map yet"

    def step_name(step):
        return step["name"] + (" (only people)" if step.get("people only") == "yes" else "")

    lines = ["# Governance: each role's rights, from its steps", "", HEADER,
             "A role's rights are what its steps read, write and call, each with the step it comes from. "
             "For a role an agent fills, that's all it may do: a right no step needs isn't one, and when its work "
             "changes, a step changes on the map first. For a role people fill, it's only their part in the "
             "services on this map.", "",
             "A step reads in order: first the governed context, each part with an owner and changed only through "
             "review; then what's marked `priority: second`, such as the team's memory, which nobody checks line "
             "by line. When they disagree, the governed context wins, and the agent says so in its report, so the "
             "owner of the definition sees it.", ""]
    roles = [r for r in of_kind(elements, "business role") if any(r["name"] in roles_of_step[s["name"]] for s in steps)]
    by_agent = [r for r in roles if any(is_agent(e) for e in fills.get(r["name"], []))]
    for heading, group in (("Roles an agent fills", by_agent), ("Roles people fill", [r for r in roles if r not in by_agent])):
        lines += [f"## {heading}", ""]
        for role in group:
            name = role["name"]
            mine = [s for s in steps if name in roles_of_step[s["name"]]]
            lines += [f"### {name[0].upper() + name[1:]}", "", f"Filled by {who(name)}.", "",
                      "| Step | In the service | Reads | Writes | Calls |", "|---|---|---|---|---|"]
            for step in mine:
                lines.append(f"| {step_name(step)} | {service_of[step['name']]} | {reads(step)} "
                             f"| {', '.join(rels(step, 'access (writes)'))} | {', '.join(calls.get(step['name'], []))} |")
            lines.append("")
            if role not in by_agent:
                continue
            rights = {}
            for step in mine:
                firsts = [("reads", o) for o in rels(step, "access (reads)") if o not in second]
                thens = [("reads", o) for o in rels(step, "access (reads)") if o in second]
                for right in firsts + thens + [("writes", o) for o in rels(step, "access (writes)")] \
                        + [("calls", c) for c in calls.get(step["name"], [])]:
                    rights.setdefault(right, []).append(step["name"])
            lines += ["Each right, with the step it comes from:", "", "| Right | Kept in | From the step |", "|---|---|---|"]
            for (verb, thing), its in rights.items():
                where = ", ".join(kept.get(thing, [])) if verb == "calls" else elements[thing].get("home", "")
                lines.append(f"| {verb} {thing}{', second' if thing in second and verb == 'reads' else ''} | {where} | {', '.join(its)} |")
            read = [o for s in mine for o in rels(s, "access (reads)")]
            read = [o for o in dict.fromkeys(read) if o not in second] + [o for o in dict.fromkeys(read) if o in second]
            lines += ["", "What it reads, and who answers for it:", "", "| It reads | Owner | Written in the step |", "|---|---|---|"]
            for obj in read:
                by = writers.get(obj, [])
                written = ", ".join(f"{s['name']} ({', '.join(roles_of_step[s['name']])})" for s in by) or "none on this map"
                lines.append(f"| {obj}{', second' if obj in second else ''} | {elements[obj]['owner']} | {written} |")
            services = {service_of[s["name"]] for s in mine}
            left = [s for s in steps if service_of[s["name"]] in services and s not in mine]
            lines += ["", "What's left out, and why:", "", "| Step | Whose it is | Why it isn't this role's |", "|---|---|---|"]
            for step in left:
                whose = "; ".join(f"{r}: {who(r)}" for r in roles_of_step[step["name"]])
                why = "another role's step" + (", and only people do it" if step.get("people only") == "yes" else "")
                lines.append(f"| {step['name']} | {whose} | {why} |")
            mine_writes = {o for s in mine for o in rels(s, "access (writes)")}
            never = [o for s in left for o in rels(s, "access (writes)") if o not in mine_writes]
            if never:
                never = list(dict.fromkeys(never))
                listed = ", ".join(never[:-1]) + " or " + never[-1] if len(never) > 1 else never[0]
                lines += ["", f"So it writes no {listed}: only the steps left out do.", ""]
            else:
                lines.append("")
    rest = [r["name"] for r in of_kind(elements, "business role") if r not in roles]
    if rest:
        lines += ["## Roles with no steps on the map yet", "",
                  f"{', '.join(rest[:-1])} and {rest[-1]}" if len(rest) > 1 else rest[0], ""]
        lines[-2] = lines[-2][0].upper() + lines[-2][1:] + ": no rights are made from steps for them yet."
    return "\n".join(lines).rstrip() + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="fail if a view is out of date")
    args = parser.parse_args()
    register = yaml.safe_load(REGISTER.read_text()) or {}
    owners = {o["name"] for o in register["owners"]} | {r["name"] for r in register["reviewers"].values()}
    elements, problems = load()
    problems += check(elements, owners)
    problems += check_rights(elements)
    if problems:
        raise SystemExit("the map has problems:\n" + "\n".join(problems))
    views = {VIEWS / "services.md": services_view(elements), VIEWS / "responsibilities.md": responsibilities_view(elements),
             VIEWS / "rights.md": rights_view(elements)}
    stale = [p for p, text in views.items() if not p.exists() or p.read_text() != text]
    if args.check:
        if stale:
            print("out of date: run python scripts/check/architecture_map.py\n"
                  + "\n".join(str(p.relative_to(ROOT)) for p in stale), file=sys.stderr)
            sys.exit(1)
    else:
        VIEWS.mkdir(exist_ok=True)
        for path, text in views.items():
            path.write_text(text)
    print(f"{len(elements)} elements, all well formed; views {'up to date' if args.check else 'written'}")


if __name__ == "__main__":
    main()
