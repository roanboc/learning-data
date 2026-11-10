import os,pathlib
# FILM_LANG picks the language (default en). Other languages keep their narration, voice and on-screen text in src/i18n/<lang>/ and build into build/<lang>/ and dist/<lang>/.
ROOT=pathlib.Path(__file__).resolve().parents[1];LANG=os.environ.get('FILM_LANG','en');EN=LANG=='en';PACK=ROOT/'src/i18n'/LANG
BUILD=ROOT/'build' if EN else ROOT/'build'/LANG;DIST=ROOT/'dist' if EN else ROOT/'dist'/LANG
NARR=ROOT/'src/narration.js' if EN else PACK/'narration.js';VODUR=ROOT/'src/vodur.js' if EN else PACK/'vodur.js'
for _d in [BUILD/'vo',BUILD/'chunks',DIST]:_d.mkdir(parents=True,exist_ok=True)
