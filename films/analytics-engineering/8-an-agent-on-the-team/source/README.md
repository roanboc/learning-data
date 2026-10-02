# Rebuilding An agent on the team

*An agent on the team*, a film of *In the weeds of data crafting*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s (the teal agent, its evidence and the gold tick), and the series' own in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (YAML, Jun, Mei, dbt, DuckDB, ID, CI, AI, Maskelyne), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title, over the comparer's desk and the printed page, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `ag_`): England in 1766 (the almanac's page of lunar distances, a map of England with letters posted from Greenwich, cottages, goose quills, an oak desk, a cedar pencil, a wooden press); the code card with the label that says where it runs; the process table; the key card and the doors of production; the claim clipped to its query and result; the pull request; the balance; the incremental stack; the four drifting copies. |
| `src/scenes.js` | The eight chapters. The title card ends chapter 1. Every shot drifts, things arrive with a spring, and the agent (throughout), the draft pull request (5 to 8) and the reconciliation and the diff (6, then the pull request's evidence in 7) carry across the cuts. |
| `src/i18n/es/captions.js` | Latin American Spanish captions, one per narration line. |
| `tools/score.py` | The film's music and sounds: analogue pads in E major, turning to C-sharp minor for *The shortcut*, strings for 1766, and the series' mark, 1-4-5-8, on a warm analogue synth at the title and the end. Nothing loops, and each effect (two quills far apart, paper, the comparer's pencil, a knock, a muted double knock for a failing test, a low felt note, the gold stamp's thud) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/analytics-engineering/8-an-agent-on-the-team/source/`:

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
python tools/render.py --workers 4   # dist/an-agent-on-the-team.mp4
```

The video adds a finishing pass that stills and the site's player don't show (`../../shared/src/post.js`): motion blur and a soft glow. To see one finished frame, open `dist/render.html` in a browser and call `renderAt(seconds)`.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/an-agent-on-the-team/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/an-agent-on-the-team-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py`, `python site-tools/check_site.py` and `python site-tools/smoke.py`. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds, and renders the video from this source.
