# Rebuilding Who owns what

*Who owns what*, from *In the weeds of data crafting*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, and the series' own in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (YAML, Jun, Mei, dbt, DuckDB, IDs), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title, over the register, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `wo_`): Adelaide in 1858 (the chain of deeds with one missing, the buyer's hand, the register book open on a certificate of title, the memorandum of transfer, signed with a quill and stamped); the code cards with their label; the four domains; the product card; dbt's three rings of access; tables with doors for grants; project boxes, groups, the shared ground, and the ten steps. |
| `src/scenes.js` | The eight chapters. The title card ends chapter 1, the end card chapter 8. Every shot drifts, things arrive with a spring, and what two chapters share carries across the cut: the register becomes the core card (1), the map shrinks beside its groups (2 to 3), the product card flies into the rings (3 to 4), the rings give way to arrows and doors (4 to 5), the one project slides left for Planning's (5 to 6), the two projects rise over their shared ground (6 to 7) and fold back into one (7 to 8). |
| `src/i18n/es/captions.js` | The Spanish captions (Latin American), one per narration line. |
| `tools/score.py` | The film's music and sounds: sustained reed-organ chords in B-flat major, and the series' mark, 1-4-5-8, on a low harmonium at the title and the end. Nothing loops, and each effect (a quill's soft scratch, a register page turning, the register closing, soft knocks for references and cards, a muted double knock for a refused reference, a wooden latch for a contract or a version, muffled keys, paper, felt notes, a low stamp) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/analytics-engineering/7-who-owns-what/source/`:

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
python tools/render.py --workers 4      # dist/who-owns-what.mp4
```

The video adds a finishing pass that stills and the site's player don't show (`../../shared/src/post.js`): motion blur and a soft glow. To see one finished frame, open `dist/render.html` in a browser and call `renderAt(seconds)`.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/who-owns-what/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/who-owns-what-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py`, `python site-tools/check_site.py` and `python site-tools/smoke.py`. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds, and renders the video from this source.

## What the film shows, and where it comes from

Every code card shows real lines from [`../../project/`](../../project/) and carries the label `runs on dbt Core · DuckDB`; the cards of chapter 6 and the README card of chapter 7 come from `examples/planning/`, which only dbt Cloud runs, and carry `sketch · dbt Cloud only` instead. dbt's refusal in chapter 4 is its real message, from a scratch copy of the project. The rigour sheet in [the script](../script.md) lists each file and line.

## Labs, scenarios and Pause and think

The labs and scenarios are `site/assets/who-owns-what/learn.en.js` and `learn.es.js`, drawn by *From words to data*'s engine (`site/assets/from-words-to-data/learn.js`); their pictures are this film's own, the `wo_` entries added to `LV` at the end of `src/plan.js`, which take their words from each language's `vis`. "Pause and think" is `think.en.js` and `think.es.js`: it stops after `domains`, `access`, `grants` and `shared`. The page texts are in `../site.json`. A change to `src/plan.js` changes the labs' pictures too, so build and publish again after one.
