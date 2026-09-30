# Rebuilding A model is not a transformation

*A model is not a transformation*, the opening film of *In the weeds of data crafting*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, and the series' own in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (YAML, Jun), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the blueprint over the empty site, the title, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `mt_`): the 1870s house plan, printed in sunlight; the copies for the trades; the empty site; the four ways to transform data; the six shapes a model can take; the series' middle way; and the eight films to come. |
| `src/scenes.js` | The eleven chapters. The title card ends chapter 6. Every shot drifts, things arrive with a spring, and the model (chapters 2 to 4), the code file (5 to 6), the lineage graph (7 to 8) and the loop of ten steps (9 to 10) carry across the cuts. |
| `tools/score.py` | The film's music and sounds: sustained chords in D dorian, a harp roll for the 1870s, and the series' mark, 1-4-5-8, at the title and the end. Nothing loops, and each effect (a knock, a muffled key, paper, a felt note, a low stamp) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/analytics-engineering/1-a-model-is-not-a-transformation/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 960   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
python tools/render.py --workers 4   # dist/a-model-is-not-a-transformation.mp4
```

The video adds a finishing pass that stills and the site's player don't show (`../../shared/src/post.js`): motion blur and a soft glow. It takes about half a second a frame, about 20 minutes with four workers. To see one finished frame, open `dist/render.html` in a browser and call `renderAt(seconds)`.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Not yet

The film isn't on the site or in the release workflow yet. Publishing it needs a page for the series and the film, the release workflow's entry, Spanish captions, and Pause and think; `tools/publish.py` already copies the player and poster to `site/assets/a-model-is-not-a-transformation/`.
