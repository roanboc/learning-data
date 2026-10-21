"""The videos the release workflow renders, gathered from each film's own folder, so no two films edit the same list.

python .github/scripts/films.py           the FILMS list, as JSON: one entry per video
python .github/scripts/films.py --notes   the release notes' list of films, one line per film or series

Each film keeps its entry in release.json, in its own folder (films/<series>/<n-film>/release.json, or films/<film>/release.json
for a film on its own): a list, one entry per video (The Inner Life of Data has two, English and Spanish). An entry has:
  name, key            the video's name and its key, for the "films" input (such as silent-change-en)
  dir, lang            where its source is, and the language it's built in
  player, site_player  the player the source builds, and the site's copy, which must be the same file
  video, file          the rendered video, and its name in the release
  captions             its caption files, [path, name in the release]
  paths                everything the video is built from (git pathspecs): its own source, and the shared code it draws with.
                       A change under any of them means the video needs rendering again
  legibility           its row in films/legibility-report.md (texts, under_28, under_20, median, status), from
                       site-tools/legibility.py
The release notes take one line or more per film or series, from release-note.md in its folder (films/<series>/ or
films/<film>/); "{files}" there becomes the videos of its films, in order, so a new film needs no change to it.
The order is ORDER below, then by the films' numbers; a folder not in ORDER comes after, by name."""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
FILMS = ROOT / "films"
# the order of the release's list and its notes: the folders under films/
ORDER = ["inner-life-of-data", "a-sharper-sketch", "when-things-go-wrong", "making-of", "from-words-to-data",
         "analytics-engineering", "enterprise-architecture", "master-and-reference-data", "data-governance"]


def _top(p):
    """where a folder under films/ sorts"""
    return (ORDER.index(p) if p in ORDER else len(ORDER), p)


def _num(name):
    m = re.match(r"\d+", name)
    return (int(m.group()) if m else 0, name)


def files():
    """Every film's release.json, in order."""
    out = []
    for top in sorted((d for d in FILMS.iterdir() if d.is_dir()), key=lambda d: _top(d.name)):
        if (top / "release.json").exists():
            out.append(top / "release.json")
        out += [d / "release.json" for d in sorted(top.iterdir(), key=lambda d: _num(d.name)) if (d / "release.json").exists()]
    return out


def films():
    """The FILMS list: every video, in order."""
    return [e for f in files() for e in json.loads(f.read_text())]


def notes():
    """The release notes' list of films: each folder's release-note.md, with "{files}" filled in."""
    lines = []
    for top in sorted((d for d in FILMS.iterdir() if d.is_dir()), key=lambda d: _top(d.name)):
        note = top / "release-note.md"
        if not note.exists():
            continue
        mine = [e["file"] for f in files() if f.is_relative_to(top) for e in json.loads(f.read_text())]
        text = note.read_text().strip().replace("{files}", ", ".join(f"`{x}`" for x in mine))
        lines += ["- " + line for line in text.split("\n") if line.strip()]
    return "\n".join(lines)


if __name__ == "__main__":
    if "--notes" in sys.argv[1:]:
        print(notes())
    else:
        print(json.dumps(films(), indent=1, ensure_ascii=False))
