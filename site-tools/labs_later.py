"""Write site-tools/labs_later.json again from the packs as they stand: the films still with fewer than two labs, by series id and
film number (the author, 19 November 2026: two to four labs a film). check_site.py holds every film not listed to two."""
import collections
import json
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import build_series as b  # noqa: E402

P = pathlib.Path(__file__).resolve().parent / "labs_later.json"
d = json.loads(P.read_text(encoding="utf-8"))
out = {}
for S in b.SERIES:
    fs = b.films(S)[1]
    if not fs:
        continue
    SL = b.series_learn(S)
    c = collections.Counter(x["film"] for x in SL["en"]["labs"]) if SL else collections.Counter()
    short = [x["index"] + 1 for x in fs if c[x["index"] + 1] < 2]
    if short:
        out[S["id"]] = short
d["films"] = out
s = json.dumps(d, indent=1, ensure_ascii=False)
P.write_text(re.sub(r"\[\s+([^\]]*?)\s+\]", lambda m: "[" + re.sub(r"\s+", " ", m.group(1)) + "]", s) + "\n", encoding="utf-8")
print(f"{sum(map(len, out.values()))} films in {len(out)} series still have fewer than two labs")
