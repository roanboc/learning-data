"""Module metadata and a generated portal-to-source index. No browser or third-party packages needed."""
import argparse
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]


def load_modules(root=ROOT):
    modules, orders, items = [], set(), set()
    for path in sorted((root / "modules").glob("*/module.json")):
        m = json.loads(path.read_text(encoding="utf-8"))
        required = {"id", "order", "items", "name", "who", "line"}
        if set(m) != required or m["id"] != path.parent.name or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", m["id"]):
            raise ValueError(f"{path}: invalid module fields or id")
        if type(m["order"]) is not int or m["order"] < 0 or m["order"] in orders:
            raise ValueError(f"{path}: order must be a unique nonnegative integer")
        orders.add(m["order"])
        for field in ("name", "who", "line"):
            if not isinstance(m[field], dict) or set(m[field]) != {"en", "es"} or not all(isinstance(v, str) and v.strip() for v in m[field].values()):
                raise ValueError(f"{path}: {field} needs English and Spanish text")
        if not isinstance(m["items"], list) or not m["items"] or not all(isinstance(i, str) for i in m["items"]):
            raise ValueError(f"{path}: items must be a nonempty list of ids")
        for item in m["items"]:
            if item in items:
                raise ValueError(f"{path}: {item} belongs to more than one module")
            items.add(item)
        modules.append(m)
    if not modules:
        raise ValueError("no modules/*/module.json files found")
    return [{k: v for k, v in m.items() if k != "order"} for m in sorted(modules, key=lambda m: m["order"])]


def catalog():
    import build_series as b
    releases = {}
    for path in sorted((ROOT / "films").rglob("release.json")):
        for entry in json.loads(path.read_text(encoding="utf-8")):
            releases.setdefault(path.parent.relative_to(ROOT).as_posix(), []).append(entry)

    def film(folder, url=None):
        source = ROOT / folder / "source"
        meta_path = source / "film.json"
        entries = releases.get(folder, [])
        meta = json.loads(meta_path.read_text(encoding="utf-8")) if meta_path.exists() else {}
        key = meta.get("key") or (entries[0]["key"].removesuffix("-en") if entries else pathlib.Path(folder).name)
        asset_dirs = {str(pathlib.PurePosixPath(e["site_player"]).parent) for e in entries}
        learning = sorted({p.relative_to(ROOT).as_posix() for d in asset_dirs for p in (ROOT / d).glob("learn.*.js")})
        return dict(id=key, title=meta.get("title") or (entries[0]["name"] if entries else key), path=folder,
                    url=url, published=any((ROOT / e["site_player"]).exists() for e in entries),
                    release_keys=[e["key"] for e in entries], learning=learning,
                    checks=(source / "tools").relative_to(ROOT).as_posix())

    series = {s["id"]: s for s in b.SERIES}
    known = set(series) | set(b.HAND)
    modules = load_modules()
    assigned = {i for m in modules for i in m["items"]}
    if assigned != known:
        raise ValueError(f"module membership differs from portal: unknown {sorted(assigned-known)}, missing {sorted(known-assigned)}")
    out, owned = [], set()
    for module in modules:
        records = []
        for item in module["items"]:
            if item in series:
                s = series[item]
                folder = "films/" + s["dir"]
                fs = []
                for name in b.series_data(s)["films"]:
                    f = film(folder + "/" + name)
                    f["url"] = b.film_path(s, f["id"])
                    fs.append(f)
                learning = sorted(p.relative_to(ROOT).as_posix() for p in
                                  (ROOT / "site/assets" / s.get("learn", {}).get("dir", s["dir"])).glob("learn.*.js"))
                records.append(dict(id=item, title=s["name"], path=folder, url=s["slug"] + "/", films=fs, learning=learning))
                owned.update(f["path"] for f in fs)
            else:
                hand = b.HAND[item]
                folder = hand["source"]
                if hand.get("films"):
                    fs = [film("films/" + path, hand["href"] + key + "/") for key, _, path in hand["films"]]
                else:
                    fs = [film(folder, hand["href"])]
                    fs[0]["title"] = hand["title"]["en"]
                learning = hand.get("learning", [])
                records.append(dict(id=item, title=hand["title"], path=folder, url=hand["href"], films=fs, learning=learning))
                owned.update(f["path"] for f in fs)
        out.append(dict(id=module["id"], title=module["name"], items=records))
    extras = [film(folder, "journey/") for folder in releases if folder not in owned]
    return dict(version=1, modules=out, extras=extras)


def markdown(data):
    lines = ["# Portal-to-source catalog", "", "Generated by `python site-tools/catalog.py --write`; edit each module's `module.json` and the films' own metadata.",
             "", "Folders currently keep their established paths. Module membership, public URLs and release keys are explicit, so a later folder migration can preserve them.", ""]
    for module in data["modules"]:
        lines += [f"## {module['title']['en']}", "", f"Module: `{module['id']}` · [metadata]({module['id']}/module.json)", ""]
        for item in module["items"]:
            lines += [f"### {item['title']['en']}", "", f"Source: [{item['path']}](../{item['path']}/) · Portal: `/{item['url']}`", ""]
            for f in item["films"]:
                lines.append(f"- [{f['title']}](../{f['path']}/) — `{f['id']}`" + (" (not published)" if not f["published"] else ""))
                if f["learning"]:
                    lines += ["", "  Labs and assessments: " + ", ".join(f"[{pathlib.Path(p).name}](../{p})" for p in f["learning"]), ""]
            if not item["films"]:
                lines.append("No film source yet.")
            learning = item["learning"]
            if learning:
                lines += ["", "Labs and assessments: " + ", ".join(f"[{p}](../{p})" for p in learning)]
            lines.append("")
    if data["extras"]:
        lines += ["## Making of and supplementary films", ""]
        lines += [f"- [{f['title']}](../{f['path']}/)" for f in data["extras"]]
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--json", action="store_true")
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()
    data = catalog()
    text = markdown(data)
    path = ROOT / "modules/README.md"
    if args.write:
        path.write_text(text, encoding="utf-8")
    elif args.check:
        if not path.exists() or path.read_text(encoding="utf-8") != text:
            parser.exit(1, "module catalog is stale: run python site-tools/catalog.py --write\n")
        print("Module catalog matches the portal and source metadata.")
    else:
        print(json.dumps(data, ensure_ascii=False, indent=2) if args.json else text, end="\n" if args.json else "")


if __name__ == "__main__":
    main()
