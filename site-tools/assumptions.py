"""Join every film's questions and assumptions (docs/assumptions/) into one Markdown file.

The folder keeps one file per film, so film pull requests never edit the same lines.
This joins them in the films' natural order (module, then series, then film) for reading:

    python site-tools/assumptions.py                  # prints to the terminal
    python site-tools/assumptions.py --out all.md     # writes one file (keep it out of Git)
"""
import argparse
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
FOLDER = ROOT / "docs" / "assumptions"


def natural(path):
    return [int(p) if p.isdigit() else p for p in re.split(r"(\d+)", path.name)]


def files(folder=FOLDER):
    def walk(d):
        for p in sorted(d.iterdir(), key=natural):
            if p.is_dir():
                yield from walk(p)
            elif p.suffix == ".md" and p.name != "README.md":
                yield p
    return list(walk(folder))


def title(path):
    first = path.read_text(encoding="utf-8").split("\n", 1)[0]
    return first[2:].strip() if first.startswith("# ") else path.stem


def demote(text):
    """One heading level down, so each file's title sits under the joined file's own."""
    lines, fenced = [], False
    for line in text.split("\n"):
        if line.startswith("```"):
            fenced = not fenced
        lines.append("#" + line if not fenced and re.match(r"#{1,5} ", line) else line)
    return "\n".join(lines)


def label(folder, series=False):
    """A module's or series' name, from its own metadata; the folder's name if it has none. A series' folder can be named as its
    module is (analytics-engineering, data-governance): it takes the series' title, not the module's name."""
    slug = folder.name.split("-", 1)[1]
    metas = [(ROOT / "modules" / slug / "module.json", "name"), (ROOT / "films" / slug / "series.json", "title")]
    for meta, key in metas[::-1] if series else metas:
        if meta.exists():
            value = json.loads(meta.read_text(encoding="utf-8")).get(key)
            return value["en"] if isinstance(value, dict) else value
    return slug.replace("-", " ").capitalize()


def joined(folder=FOLDER):
    parts = files(folder)
    out, seen = ["# Films' questions and assumptions, in order", ""], set()
    for p in parts:
        rel = p.relative_to(folder).parts
        for depth in range(len(rel) - 1):
            d = folder.joinpath(*rel[: depth + 1])
            if d not in seen:
                seen.add(d)
                out.append(f"{'  ' * depth}- **{label(d, depth > 0)}**")
        out.append(f"{'  ' * (len(rel) - 1)}- {title(p)}")
    for p in parts:
        out += ["", "---", "", demote(p.read_text(encoding="utf-8").rstrip())]
    return "\n".join(out) + "\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", help="write to this file instead of printing")
    a = ap.parse_args()
    text = joined()
    if a.out:
        pathlib.Path(a.out).write_text(text, encoding="utf-8")
        print(f"{len(files())} files joined into {a.out}")
    else:
        print(text, end="")


if __name__ == "__main__":
    main()
