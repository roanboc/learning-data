"""The film a tool works on, and where everything it needs lives.

Every tool of the films of Leading data people (and of Data management, which shares the look) runs from a film's source folder,
such as films/the-new-skills/1-many-hats/source/, which holds film.json: the film's key, title and subtitle, its own source files,
the words the voice respells, the chapters of its opening story, and the moment its poster shows. The films draw with The Inner Life
of Data's engine and helpers (core.js, style2.js, ui3.js, engine3.js, and its logos.js), A Sharper Sketch's scene() (sketch3.js), the
agent films' kit, people and agent (films/what-an-agent-is/shared/src/kit.js, people.js, agent.js and finish.js) and the module's own
look in films/the-new-skills/shared/src/ (look.js, people.js, cards.js, things.js and section.js; its README says what each holds). Most tools are From words to data's, run with this lang.py (see run.py). The films are in English; another language is
captions only, as in From words to data."""
import json, os, pathlib, sys

ROOT = pathlib.Path.cwd()
if not (ROOT / 'film.json').exists():
    raise SystemExit('Run this from a film\'s source folder, such as films/the-new-skills/1-many-hats/source/')
SERIES = ROOT.parent.parent
FILMS = pathlib.Path(__file__).resolve().parents[3]
REPO = FILMS.parent
SHARED = FILMS / 'inner-life-of-data' / 'source'
SKETCH = FILMS / 'a-sharper-sketch' / 'source' / 'src'
AGS = FILMS / 'what-an-agent-is' / 'shared' / 'src'
LPS = pathlib.Path(__file__).resolve().parents[1] / 'src'
META = json.loads((ROOT / 'film.json').read_text())
LANG = os.environ.get('FILM_LANG', 'en')
EN = LANG == 'en'
PACK = ROOT / 'src' / 'i18n' / LANG
if not EN and (pathlib.Path(sys.argv[0]).name != 'captions.py' or not (PACK / 'captions.js').exists()):
    raise SystemExit('The module\'s films are in English. Another language is captions only: '
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
