# Rebuilding Promises and proofs

*Promises and proofs*, from *In the weeds of data crafting*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, and the series' own in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (YAML, Jun, Mei, dbt, DuckDB), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title, over the struck hallmark, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `pp_`): London from 1300 (the oak bench, the silver cup, the hands with the scraper and the hammer, the punch, the assay balance, the leopard's head, Goldsmiths' Hall, the basket), and the present: the hollow seal, code cards with the label `runs on dbt Core · DuckDB`, the gap register and gap 1, the three decision tags, the credential cards, the core band and the two marts, the test glyphs, the traffic light, the clock, the loop of ten steps. |
| `src/scenes.js` | The eight chapters. The title card ends chapter 1. Every shot drifts, things arrive with a spring, and what two chapters share carries across the cut: the hallmark becomes the hollow seal (1 → 8), the core band moves from the layers to under the marts (3 → 4), the model outlines carry into the unit test (5 → 6), and Jordan's revoked badge returns for the unit test's dates (2 → 6). |
| `src/i18n/es/captions.js` | The Spanish captions (Latin American Spanish), one per narration line. |
| `tools/score.py` | The film's music and sounds: low brass chorale chords in F major, and the series' mark, 1-4-5-8, on a soft French horn at the title and the end. For 1300, the scraper's filtered scrape and the punch's thud; for the present, a felt note for a test that passes, a muted double knock for one that fails, a wooden latch for a contract that locks. Nothing loops, and each effect fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/analytics-engineering/5-promises-and-proofs/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 960   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt, from src/i18n/es/captions.js
python tools/render.py --workers 4   # dist/promises-and-proofs.mp4
```

The video adds a finishing pass that stills and the site's player don't show (`../../shared/src/post.js`): motion blur and a soft glow. To see one finished frame, open `dist/render.html` in a browser and call `renderAt(seconds)`.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/promises-and-proofs/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/promises-and-proofs-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py`, `python site-tools/check_site.py` and `python site-tools/smoke.py`. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds, and renders the video from this source.
