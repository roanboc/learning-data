# Rebuilding End to end

*End to end*, the closing film of *In the weeds of data crafting*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, and the series' own in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (YAML, Jun, dbt, CI), and the moment its poster shows (the title card, over the tracing floor). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title, and the end card that closes the series). |
| `src/plan.js` | This film's pictures (prefixed `ee_`): York, the fourteenth century (the plaster floor, the dividers cutting a window and a rose into it, fresh plaster spread over them, a wooden template, the stone carved to match, the finished window with light through its glass); the ledger of the ten commits along the top; the commit card with its files (+ added, ~ changed, − deleted; temporary files dashed, generated ones with a cog); code cards, tables, folders and CI checks; Finance's team, its badge and its question card; lineage nodes and flows; and the faculty bars. |
| `src/scenes.js` | The twelve chapters: the tracing floor, the ten steps (one chapter each, with that step's commit on the left), and the whole building. The title card ends chapter 1; the end card ends chapter 12. Every shot drifts and things arrive with a spring. |
| `src/i18n/es/captions.js` | The Spanish captions (Latin American), one per English line. |
| `tools/score.py` | The film's music and sounds: the tracing floor in D Dorian on strings, open fifths like a stone nave; the present in D major (the opening film's key); the series' mark, 1-4-5-8, on a felt piano at the title and, at the end, answered by the opening film's electric piano. Credit counted twice is a detuned felt pair, low. Nothing loops, and each effect (a dividers' scrape, a chisel, a trowel, a knock, a muffled key, paper, a felt note, a low stamp) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

Every code, YAML, CSV and Markdown card shows real lines from [`../../project/`](../../project/) as the step's commit left them; each chapter's commit is named on its card, with its short hash, and the ledger along the top counts each commit's files. The CI checks are the steps of the repository's workflow, `.github/workflows/credential-project.yml`. Command output (`dbt build`, `find_repeats.py`, `requirements.py`) comes from running those commands on the DuckDB build; the table of the diff against main sums up `scripts/tools/diff_against_main.py`'s report. [The script](../script.md) lists the file and commit behind each card.

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/analytics-engineering/10-end-to-end/source/`:

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
python tools/render.py --workers 4   # dist/end-to-end.mp4
```

The video adds a finishing pass that stills and the site's player don't show (`../../shared/src/post.js`): motion blur and a soft glow. The release workflow renders it from this source.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/end-to-end/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/end-to-end-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py`, which makes the series' pages, then `python site-tools/check_site.py` and `python site-tools/smoke.py`. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds, and renders the video from this source.
