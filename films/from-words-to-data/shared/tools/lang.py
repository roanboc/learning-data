"""The film a tool works on, and where everything it needs lives.

Every tool of the series runs from a film's source folder, films/from-words-to-data/<n>-<name>/source/, which holds film.json:
the film's key, title and subtitle, its own source files, the words the voice respells, and the moment its poster shows.
The films draw with The Inner Life of Data's engine and components, A Sharper Sketch's diagrams, the series' people
(When things go wrong), Silent change's messages and dashboards, and this series' own components in shared/src/words.js.
The series is in English: the Spanish pages on the site wrap the English films."""
import json, os, pathlib, sys

ROOT = pathlib.Path.cwd()
if not (ROOT / 'film.json').exists():
    raise SystemExit('Run this from a film\'s source folder, such as films/from-words-to-data/1-whats-in-a-word/source/')
SERIES = pathlib.Path(__file__).resolve().parents[2]
FILMS = SERIES.parent
REPO = FILMS.parent
SHARED = FILMS / 'inner-life-of-data' / 'source'
SKETCH = FILMS / 'a-sharper-sketch' / 'source' / 'src'
CHARS = FILMS / 'when-things-go-wrong' / 'characters'
EP1 = FILMS / 'when-things-go-wrong' / '1-silent-change' / 'source' / 'src'
WORDS = SERIES / 'shared' / 'src'
META = json.loads((ROOT / 'film.json').read_text())
LANG = os.environ.get('FILM_LANG', 'en')
if LANG != 'en':
    raise SystemExit('The films of From words to data are in English; the Spanish pages wrap the English film.')
EN = True
BUILD, DIST = ROOT / 'build', ROOT / 'dist'
NARR, VODUR = ROOT / 'src' / 'narration.js', ROOT / 'src' / 'vodur.js'
MODELS = ROOT / 'models' if (ROOT / 'models').exists() else SHARED / 'models'
for _d in [BUILD / 'vo', BUILD / 'chunks', DIST]:
    _d.mkdir(parents=True, exist_ok=True)


def load_obj(path):
    """The JSON object inside a .js file such as narration.js or vodur.js."""
    s = open(path).read()
    return json.loads(s[s.index('{'):s.rindex('}') + 1])


def render_page(p):
    """Open dist/render.html in Chromium and wait until the film's assets are ready."""
    b = p.chromium.launch(args=["--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto((DIST / 'render.html').as_uri())
    pg.wait_for_function("window.__READY__===true", timeout=120000)
    return b, pg
