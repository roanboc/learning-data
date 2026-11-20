"""Bring a film's first labs back into its series' pack, beside its playground (the author, 19 November 2026: two to four labs a film).

    python site-tools/restore_labs.py <commit> <old pack, without .en.js> <new pack dir> id[=newid][@film][:chapter] ...

Reads each lab, as it was written at <commit>, from <old pack>.en.js and .es.js, and puts it into site/assets/<new pack dir>/learn.*.js
after the last lab of its film, so the labs stay in film order. A lab may take a new id (where a playground took its old one), a
film number (a film's own pack had none) and a chapter. Only the classic kinds come back (count, compose, pick, sort, steps), which
site/assets/learn/classic.js draws. Prints what it did; run build_series.py and check_site.py after."""
import re
import subprocess
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
CLASSIC = {"count", "compose", "pick", "sort", "steps"}


def objects(text, start):
    """The top-level {…} objects of the array that opens at text[start] ('['), as (begin, end) spans."""
    out, depth, i, q, b = [], 0, start + 1, None, None
    while i < len(text):
        c = text[i]
        if q:
            if c == "\\":
                i += 2
                continue
            if c == q:
                q = None
        elif c in "\"'`":
            q = c
        elif c == "/" and text[i + 1] == "*":
            i = text.index("*/", i) + 2
            continue
        elif c in "{[":
            if depth == 0 and c == "{":
                b = i
            depth += 1
        elif c in "}]":
            if depth == 0:
                return out
            depth -= 1
            if depth == 0 and c == "}":
                out.append((b, i + 1))
        i += 1
    return out


def header(t, film):
    """The lab with its first keys in the order series_learn reads: id, kind, film, chapter, c, name."""
    m = re.search(r"\b(?:idea|points|real|alt|w|vis):", t)
    head, rest = t[1:m.start()], t[m.start():]
    keys = {}
    for k, pat in (("id", r'id:"\w+"'), ("kind", r'kind:"\w+"'), ("film", r"film:\d+"), ("chapter", r'chapter:(?:"\w*"|null)'),
                   ("c", r'c:"#[0-9a-fA-F]{6}"'), ("name", r'name:"[^"]*"')):
        x = re.search(r"(?<![\w])" + pat + r",?", head)
        if x:
            keys[k] = x.group(0).rstrip(",")
            head = head[:x.start()] + head[x.end():]
    if film:
        keys["film"] = f"film:{film}"
    keys["c"] = keys["c"].lower()
    order = [keys[k] for k in ("id", "kind", "film", "chapter", "c", "name")]
    return "{" + ",".join(order) + "," + head.strip().lstrip(",") + rest


def labs_of(text):
    m = re.search(r"^labs:\[", text, re.M)
    return [(b, e, text[b:e]) for b, e in objects(text, m.end() - 1)]


def main():
    commit, old, new = sys.argv[1:4]
    specs = []
    for a in sys.argv[4:]:
        m = re.fullmatch(r"(\w+)(?:=(\w+))?(?:@(\d+))?(?::(\w+))?", a)
        specs.append(m.groups())
    for lg in ("en", "es"):
        src = subprocess.run(["git", "show", f"{commit}:{old}.{lg}.js"], cwd=ROOT, capture_output=True, text=True, check=True).stdout
        olds = {re.match(r'\{id:"(\w+)"', t)[1]: t for _, _, t in labs_of(src) if re.match(r'\{id:"', t)}
        p = ROOT / "site" / "assets" / new / f"learn.{lg}.js"
        text = p.read_text(encoding="utf-8")
        for oid, nid, film, chap in specs:
            t = header(olds[oid], film)
            kind = re.match(r'\{id:"\w+",kind:"(\w+)"', t)[1]
            if kind not in CLASSIC:
                sys.exit(f"{oid}: kind {kind} isn't one of the classic kinds")
            if nid:
                t = t.replace(f'{{id:"{oid}"', f'{{id:"{nid}"', 1)
            if chap:
                t = re.sub(r'(film:\d+,)chapter:(?:"\w*"|null),', rf'\g<1>chapter:"{chap}",', t, count=1)
            if "{id:\"" in t[1:] or t.count('kind:"') != 1:
                sys.exit(f"{oid}: holds {{id: or kind: inside, which series_learn counts")
            f = int(re.search(r",film:(\d+),", t)[1])
            cur = labs_of(text)
            ids = [re.match(r'\{id:"(\w+)"', x)[1] for _, _, x in cur]
            if (nid or oid) in ids:
                sys.exit(f"{nid or oid}: already in {p.name}")
            at = None
            for b, e, x in cur:
                if int(re.search(r",film:(\d+),", x)[1]) <= f:
                    at = e
            if at is None:
                at = cur[0][0] - 1
                text = text[:at + 1] + t + ",\n" + text[at + 1:]
            else:
                text = text[:at] + ",\n" + t + text[at:]
            print(f"{p.relative_to(ROOT)}: {oid}{' as ' + nid if nid else ''} ({kind}) after film {f}'s labs")
        text = text.replace("},,\n", "},\n")
        p.write_text(text, encoding="utf-8")


main()
