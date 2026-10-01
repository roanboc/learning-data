# Rebuilding Built in layers

*Built in layers*, a film of *In the weeds of data crafting*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, and the series' own in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (YAML, Jun, Mei, dbt, SQL, CTE, DuckDB, Auguste, Escoffier), and the moment its poster shows (the title card over the Savoy's kitchen). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title over the kitchen, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `bl_`): the Savoy's kitchen in the 1890s (cooks in whites and toques, copper, the coal range, bowls set out ahead, a plate gaining a part at each station, the chef at the pass); the four layers as columns; the code cards, each with its file and the label `runs on dbt Core · DuckDB`; the tests; Planning's tall table and the wallet's wide row; the CTE outline; views as glass and tables as stone; a balance for twelve and twelve. |
| `src/scenes.js` | The eight chapters. The title card ends chapter 1. Every shot drifts, things arrive with a spring, and the four columns carry across the cuts from staging to the marts, where they fold into a strip; Planning's table closes into its file (marts to CTEs), and the columns return in the last chapter beside the Savoy's four stations. |
| `src/i18n/es/captions.js` | The Spanish captions (Latin American Spanish), one per narration line. |
| `tools/score.py` | The film's music and sounds: a close string-quartet pad in C major, and the series' mark, 1-4-5-8, on a cello pizzicato at the title and the end. Nothing loops, and each effect (a knife on a board, a pan set down, a plate slid to the pass, a card folding shut, a felt note as a layer lights or a test turns green) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/analytics-engineering/6-built-in-layers/source/`:

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
python tools/render.py --workers 4   # dist/built-in-layers.mp4
```

The video adds a finishing pass that stills and the site's player don't show (`../../shared/src/post.js`): motion blur and a soft glow. To see one finished frame, open `dist/render.html` in a browser and call `renderAt(seconds)`.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/built-in-layers/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/built-in-layers-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py`, `python site-tools/check_site.py` and `python site-tools/smoke.py`. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds, and renders the video from this source.

## The project behind the cards

Every code card shows real lines of [`../../project/`](../../project/), the series' dbt project, as the script's table of files lists them; the numbers on screen (seven staging views, eight steps, 73 rows and 17 columns in Planning's mart, 14 columns in the wallet's, the faculties' 38, 15, 15 and 5 rows, and twelve near-award learners in both the mart and the census report) come from its build of 30 September 2026 on dbt Core with DuckDB.
