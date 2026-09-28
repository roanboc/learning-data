import os,pathlib
# FILM_LANG picks the language (default en). Other languages would keep their narration, voice and on-screen text in src/i18n/<lang>/ and build into build/<lang>/ and dist/<lang>/.
ROOT=pathlib.Path(__file__).resolve().parents[1];LANG=os.environ.get('FILM_LANG','en');EN=LANG=='en';PACK=ROOT/'src/i18n'/LANG
# the film draws with the first film's components and engine, and uses its fonts and voice model, so a fix there lands here too.
# It also carries The Inner Life of Data itself (its English source), sealed in its own scope, to draw and take apart its real frames.
SHARED=ROOT.parents[2]/'inner-life-of-data'/'source'
# the first Making of film's components: the embedded film, code panels, browser windows, and the scene helpers
F1=ROOT.parents[1]/'1-data-for-films'/'source'/'src'
BUILD=ROOT/'build' if EN else ROOT/'build'/LANG;DIST=ROOT/'dist' if EN else ROOT/'dist'/LANG
NARR=ROOT/'src/narration.js' if EN else PACK/'narration.js';VODUR=ROOT/'src/vodur.js' if EN else PACK/'vodur.js'
MODELS=ROOT/'models' if (ROOT/'models').exists() else SHARED/'models'
for _d in [BUILD/'vo',BUILD/'chunks',DIST]:_d.mkdir(parents=True,exist_ok=True)
