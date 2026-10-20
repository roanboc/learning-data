"""The film a tool works on, and where everything it needs lives.

Every tool of the series on master and reference data runs from a film's source folder, films/master-and-reference-data/<n>-<name>/source/,
which holds film.json: the film's key, title and subtitle, its own source files, the words the voice respells, and the moment
its poster shows. The films draw with The Inner Life of Data's engine and components, A Sharper Sketch's scene helpers, the people
of When things go wrong, From words to data's components (and Keeping it true's), In the weeds of data crafting's motion helpers,
The map before the data's components (its ArchiMate glyphs), and this series' own, in shared/src/: its watercolour look (wash.js),
its people (people.js) and the video's finishing pass (post.js). Most tools are From words to data's, run with this lang.py
(see run.py). The series is in English; another language is captions only, as in From words to data."""
import json, os, pathlib, sys

ROOT = pathlib.Path.cwd()
if not (ROOT / 'film.json').exists():
    raise SystemExit('Run this from a film\'s source folder, such as films/master-and-reference-data/1-one-person-many-roles/source/')
SERIES = pathlib.Path(__file__).resolve().parents[2]
FILMS = SERIES.parent
REPO = FILMS.parent
SHARED = FILMS / 'inner-life-of-data' / 'source'
SKETCH = FILMS / 'a-sharper-sketch' / 'source' / 'src'
CHARS = FILMS / 'when-things-go-wrong' / 'characters'
EP1 = FILMS / 'when-things-go-wrong' / '1-silent-change' / 'source' / 'src'
FWD = FILMS / 'from-words-to-data'
WORDS = FWD / 'shared' / 'src'
TRUE = FWD / '7-keeping-it-true' / 'source' / 'src'
WEEDS = FILMS / 'analytics-engineering' / 'shared' / 'src'
EA = FILMS / 'enterprise-architecture' / 'shared' / 'src'
MR = SERIES / 'shared' / 'src'
META = json.loads((ROOT / 'film.json').read_text())
LANG = os.environ.get('FILM_LANG', 'en')
EN = LANG == 'en'
PACK = ROOT / 'src' / 'i18n' / LANG
if not EN and (pathlib.Path(sys.argv[0]).name != 'captions.py' or not (PACK / 'captions.js').exists()):
    raise SystemExit('The films of this series are in English. Another language is captions only: '
                     'write src/i18n/%s/captions.js, then run FILM_LANG=%s python tools/captions.py' % (LANG, LANG))
BUILD, DIST = ROOT / 'build', ROOT / 'dist'
NARR, VODUR = ROOT / 'src' / 'narration.js', ROOT / 'src' / 'vodur.js'
MODELS = ROOT / 'models' if (ROOT / 'models').exists() else SHARED / 'models'
for _d in [BUILD / 'vo', BUILD / 'chunks', DIST]:
    _d.mkdir(parents=True, exist_ok=True)


def load_obj(path):
    """The JSON object inside a .js file such as narration.js or vodur.js."""
    s = open(path).read()
    return json.loads(s[s.index('{'):s.rindex('}') + 1])


def render_page(p, init=None):
    """Open dist/render.html in Chromium and wait until the film's assets are ready; init is a script to run first, such as captions."""
    b = p.chromium.launch(args=["--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1920, "height": 1080})
    if init:
        pg.add_init_script(path=str(init))
    pg.goto((DIST / 'render.html').as_uri())
    pg.wait_for_function("window.__READY__===true", timeout=120000)
    return b, pg
