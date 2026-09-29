# Rebuilding Keeping it true

*Keeping it true*, the film of the series *From words to data* on keeping meaning current (drift, an AI agent that watches and drafts, people who decide, versions end to end, and what remains as the shapes of data keep changing), is generated from code like the rest of the series. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams, *Silent change*'s dashboards, the series' people and the series' own components in [`../../shared/src/words.js`](../../shared/src/words.js). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, and the moment its poster shows (the end to end chain, with the sketch's stamp reading v3). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: a handful of holds, and three wordless moments (the title, the chain once v3 is approved, and the end card). |
| `src/true.js` | This film's pictures (prefixed `kt_`): the agent (a teal, geometric orb), Johnson's book, the OED page, the planets, the kilogram, the calendar, the government's form, the dashboards, the glossary and code cards, the change package, the chain of layers, the modelling patterns (data vault, anchor, hook, Puppini bridge, activity stream) with the four answers each holds, the old report, the clay tablet and the diploma. The history is drawn organically (soft curves, light and shadow, paper grain, gentle motion); the systems stay crisp glass. It also holds `LV`, the pictures of the labs and the scenarios, whose words come from `FW.vis`. |
| `src/scenes.js` | The ten chapters. The title card is part of the first one. |
| `tools/score.py` | The film's music and sounds: strings over a clock at 60 beats a minute and a felt piano, in C major, leaning into A minor where the model drifts, and ending on the series' motif on the kalimba in D, answered by a tubular bell. |
| `tools/` | The series' shared tools (`../../shared/tools/`), each run on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/from-words-to-data/7-keeping-it-true/source/`:

```
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 960   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
```

The voice files are in `build/vo/`. `tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run `python tools/tts.py`, which voices only the missing lines and rewrites `src/vodur.js`.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/keeping-it-true/` and draws the poster, `site/assets/keeping-it-true-poster.jpg`, at the moment `film.json` names. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds.

The labs and scenarios are `site/assets/keeping-it-true/learn.en.js` and `learn.es.js`, and "Pause and think" is `think.en.js` and `think.es.js` (it stops after `arrives`, `watch`, `decide` and `e2e`). They use the prefix `ld-keeping-it-true` for progress in the browser. The labs' "Watch this part" buttons find their chapter by id (`stale`, `decide`, `e2e`). A change to `src/true.js` changes the labs' pictures too, so copy the player again after one.

A change to a shared component (*The Inner Life of Data*'s engine, `sketch3.js`, `people.js`, `silent.js` or `words.js`) also changes this film: run `tools/check.py` here after changing one, then build and publish again.
