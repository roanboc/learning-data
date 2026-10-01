# Rebuilding Start from a question

*Start from a question*, the film after *A model is not a transformation* in *In the weeds of data crafting*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, and the series' own in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (YAML, Jun, Mei, DuckDB), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title over the 1854 map, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `sq_`): John Snow's map of Soho, drawn by a steel nib in a wooden holder, one bar per death round the Broad Street pump; the project's code cards with their "runs on dbt Core · DuckDB" label; the consumers' badges; the question card; glossary cards; the slice as a blueprint; business keys with their key set's colour; the owners' faces; the small loop of ten steps; the three sources, and Aisha under three keys. |
| `src/scenes.js` | The eight chapters. The title card ends chapter 1. Every shot drifts, things arrive with a spring, and the question card (chapters 2 to 3), the four things and their blueprint (3 to 6) carry across the cuts. |
| `src/i18n/es/captions.js` | The Spanish captions (Latin American), one per English line. |
| `tools/score.py` | The film's music and sounds: a solo cello in G minor for 1854; for the present, warm chords in G major with a mixolydian colour over a low open fifth; the series' mark, 1-4-5-8, on a nylon-string guitar at the title and the end. Nothing loops, and each effect (a pen nib, the pump's creak once, a pin for each entity, a muffled key per line, paper, a felt note, a low stamp) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/analytics-engineering/2-start-from-a-question/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 960   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/start-from-a-question.mp4
```

The video adds a finishing pass that stills and the site's player don't show (`../../shared/src/post.js`): motion blur and a soft glow. To see one finished frame, open `dist/render.html` in a browser and call `renderAt(seconds)`.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/start-from-a-question/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/start-from-a-question-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py`, `python site-tools/check_site.py` and `python site-tools/smoke.py`. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds, and renders the video from this source.
