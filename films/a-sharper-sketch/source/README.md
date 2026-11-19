# Rebuilding the film

*A Sharper Sketch* is generated from code like *The Inner Life of Data*, and shares its engine, components, fonts and voice model. Only what is new lives here:

| File | What it holds |
|---|---|
| `src/narration.js` | The narration, one line per id. The film re-times itself to the voice. |
| `src/breath.js` | The pauses: a `hold` after a line, and a wordless `breathe` at the end of each chapter. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/sketch3.js` | This film's components: entity boxes with pins, relationships with crow's feet, the tracing paper with the reference model (TCSI), the comparison in the corner, the version stamp, tables and the film strip. |
| `src/scenes.js` | The ten scenes. Since 19 November 2026 the film is the second of *Model the business*, so it also draws with what that series draws with, as *The map behind the sketch* does: the Ming registers (`../../model-the-business/shared/src/registers.js`), *From words to data*'s components (`words.js`), and the university's people and messages from *When things go wrong*. `tools/build.py` bundles them, and stops on a file that's missing. |
| `film.json` | The film's key, its title, its opening story's chapter (`story`) and its urgent chapters (none), read by the sound check and the site's checks. |
| `tools/score.py` | The music and sounds, at their words and offsets: the film's own palette (a felt piano over a soft held voice, in D major), played by *From words to data*'s mixer (`tools/audio.py`). |
| `src/page.html` | The standalone player page. |
| `tools/` | The tools of *The Inner Life of Data*, pointed at this film. `lang.py` finds the shared source in `../../inner-life-of-data/source/`. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise those of *The Inner Life of Data*, so one download serves both.

## Render the video

Run from this folder, `films/a-sharper-sketch/source/`:

```
python tools/tts.py
python tools/build.py
python tools/audio.py
python tools/build.py
python tools/check.py
python tools/legible.py --overlaps
python ../../../site-tools/fits.py
python ../../../site-tools/shots.py
python tools/pace.py
python tools/quiet.py
python tools/render.py --workers 4
```

`tools/quiet.py` is the governance films' sound check (`../../data-governance/shared/tools/quiet.py`), run with this film's score: music under the opening story, then only from time to time, no figure played again soon after itself, nothing louder than the governance films'.

The video is `dist/a-sharper-sketch.mp4`, and `dist/film.html` is a standalone player with the soundtrack embedded. `python tools/pace.py` reports the pacing, and `python tools/captions.py` writes `../captions/en.srt` and `en.vtt`. The steps are the same as for *The Inner Life of Data*, described there.

**Spanish captions.** The Spanish page shows this English film with Spanish captions, from `src/i18n/es/captions.js`: each English narration line, exactly as in `src/narration.js`, and its caption. After changing a line, update its entry, run `FILM_LANG=es python tools/captions.py` (it writes `../captions/es.srt` and `es.vtt`, and stops if a line has no caption), and copy the file into the site:

```
cp src/i18n/es/captions.js ../../../site/assets/film3/captions.es.js
```

`site-tools/check_site.py` checks that the copy matches, and that the Spanish page loads it before the film.

A change to a shared component in `../../inner-life-of-data/source/src/`, or to the phone layer (`../../from-words-to-data/shared/src/phone.js`), also changes this film: run `tools/check.py` and `tools/legible.py --overlaps` here after changing one.
