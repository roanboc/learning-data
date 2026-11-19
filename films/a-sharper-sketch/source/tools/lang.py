import os,pathlib
# FILM_LANG picks the language (default en). Other languages keep their narration, voice and on-screen text in src/i18n/<lang>/ and build into build/<lang>/ and dist/<lang>/.
ROOT=pathlib.Path(__file__).resolve().parents[1];LANG=os.environ.get('FILM_LANG','en');EN=LANG=='en';PACK=ROOT/'src/i18n'/LANG
# the film draws with the first film's components and engine, and uses its fonts and voice model, so a fix there lands here too
SHARED=ROOT.parents[1]/'inner-life-of-data'/'source'
BUILD=ROOT/'build' if EN else ROOT/'build'/LANG;DIST=ROOT/'dist' if EN else ROOT/'dist'/LANG
NARR=ROOT/'src/narration.js' if EN else PACK/'narration.js';VODUR=ROOT/'src/vodur.js' if EN else PACK/'vodur.js'
MODELS=ROOT/'models' if (ROOT/'models').exists() else SHARED/'models'
for _d in [BUILD/'vo',BUILD/'chunks',DIST]:_d.mkdir(parents=True,exist_ok=True)

# what the series' tools read from every film: its key, its own files, the chapters of its opening story and its urgent ones (film.json)
import json as _json
META=_json.loads((ROOT/'film.json').read_text())
def render_page(p,init=None):
    """Open dist/render.html in Chromium and wait until the film's assets are ready; init is a script to run first, such as captions."""
    b=p.chromium.launch(args=["--allow-file-access-from-files"]);pg=b.new_page(viewport={"width":1920,"height":1080})
    if init:pg.add_init_script(path=str(init))
    pg.goto((DIST/'render.html').as_uri());pg.wait_for_function("window.__READY__===true",timeout=120000)
    return b,pg
