# Rebuilding One row of what, and when

*One row of what, and when*, a film of *In the weeds of data crafting*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, and the series' own in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (YAML, Jun, Mei, dbt, SQL, DuckDB, Priya), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title over the 1890 census cards, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `rw_`): the 1890 census (the calendar page pinned at June 1, the family schedule, the house and the census taker, the cradle, the clerk's pantograph punch, the punched cards and Hollerith's dial); code cards with the label "runs on dbt Core · DuckDB"; the grain sentence, consumer badges and date pins, tests, result tables; the renamed award's versions, Aisha's credit as a staircase, the sources' stacked versions and their bands on one timeline. |
| `src/scenes.js` | The eight chapters. The title card ends chapter 1. Every shot drifts, things arrive with a spring, and what two chapters share carries across the cut: the two words lifted from the 1890 card become the grain sentence (1 to 2), the grain test moves from the mart's YAML into the fan-out (2 to 3), and Aisha's staircase splits into the two consumers' views (4 to 5). |
| `src/i18n/es/captions.js` | The Spanish captions (Latin American Spanish), one per narration line. |
| `tools/score.py` | The film's music and sounds: a slow string pad in A minor, turning to A major at *As it was, as it is*, and the series' mark, 1-4-5-8, on a bass clarinet at the title and the end. Nothing loops, and each effect (a muffled knock per hole punched, a low felt note for the tabulator's dial, a low double thud for the fan-out, soft paper as each version stacks, a muted knock off to one side for the late withdrawal) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/analytics-engineering/4-one-row-of-what-and-when/source/`:

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
python tools/render.py --workers 4   # dist/one-row-of-what-and-when.mp4
```

The video adds a finishing pass that stills and the site's player don't show (`../../shared/src/post.js`): motion blur and a soft glow. To see one finished frame, open `dist/render.html` in a browser and call `renderAt(seconds)`.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/one-row-of-what-and-when/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/one-row-of-what-and-when-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py`, which makes the series' pages from `../../series.json` and `../site.json`, then `python site-tools/check_site.py` and `python site-tools/smoke.py`. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds, and renders the video from this source.

The labs' pictures are this film's own, the `rw_` entries added to `LV` at the end of `src/plan.js` (Aisha's credit staircase with a date line, and the renamed award's fan-out). A change to `src/plan.js` changes the labs' pictures too, so publish again after one.
