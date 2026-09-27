# Rebuilding the film

*A Sharper Sketch* is generated from code like *The Inner Life of Data*, and shares its engine, components, fonts and voice model. Only what is new lives here:

| File | What it holds |
|---|---|
| `src/narration.js` | The narration, one line per id. The film re-times itself to the voice. |
| `src/breath.js` | The pauses: a `hold` after a line, and a wordless `breathe` at the end of each chapter. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/sketch3.js` | This film's components: entity boxes with pins, relationships with crow's feet, the tracing paper with the reference model (TCSI), the comparison in the corner, the version stamp, tables and the film strip. |
| `src/scenes.js` | The nine scenes. |
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
python tools/render.py --workers 4
```

The video is `dist/a-sharper-sketch.mp4`, and `dist/film.html` is a standalone player with the soundtrack embedded. `python tools/pace.py` reports the pacing, and `python tools/captions.py` writes `../captions/en.srt` and `en.vtt`. The steps are the same as for *The Inner Life of Data*, described there.

A change to a shared component in `../../inner-life-of-data/source/src/` also changes this film: run `tools/check.py` here after changing one.
