# Rebuilding What makes it the same one

*What makes it the same one*, a film of *In the weeds of data crafting*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, and the series' own in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (YAML, Jun, Mei, dbt, SQL, DuckDB, Bertillon), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title over the two look-alike cards, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `sm_`): the past drawn with care (a graphite profile, brass calipers, a tape, a hand, ink cards, an oak card drawer, fingerprints drawn ridge by ridge) and the present in dark glass (code files labelled `runs on dbt Core · DuckDB`, keys whose stray spaces show as amber dots, source streams, rule cards, a wallet, a test list, a hash that rolls out, ninety keys falling into forty-six learners). |
| `src/scenes.js` | The eight chapters. The title card ends chapter 1, the end card chapter 8. Every shot drifts, things arrive with a spring, and Aisha's outline (1 to 2), her keys (4 to 5), her learner (5 to 6 to 7) and her key row (7 to 8) carry across the cuts. |
| `src/i18n/es/captions.js` | Latin American Spanish captions, one per narration line. |
| `tools/score.py` | The film's music and sounds: low divided strings in E-flat major, C minor and a bassoon line for the past, and the series' mark, 1-4-5-8, on a soft vibraphone at the title and the end. Nothing loops, and each effect (a caliper click, the drawer, knocks, muffled keys, paper, felt notes, a low stamp) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

Every code, CSV and YAML card shows real lines from [`../../project/`](../../project/), as [the script](../script.md) lists them.

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/analytics-engineering/3-what-makes-it-the-same-one/source/`:

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
python tools/render.py --workers 4   # dist/what-makes-it-the-same-one.mp4
```

The video adds a finishing pass that stills and the site's player don't show (`../../shared/src/post.js`): motion blur and a soft glow. To see one finished frame, open `dist/render.html` in a browser and call `renderAt(seconds)`.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/what-makes-it-the-same-one/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/what-makes-it-the-same-one-poster.jpg`, at the moment `film.json` names. Then the series' pages are made by `python site-tools/build_series.py`, and checked by `site-tools/check_site.py` and `site-tools/smoke.py`. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds, and renders the video from this source.
