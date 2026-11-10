# Rebuilding The map, enforced

*The map, enforced*, film 5 of 7 of *From helper to colleague*, the third series of the module on AI agents in data work, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts, voice model and logos, *A Sharper Sketch*'s `scene()`, and the module's look and tools in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/), whose [README](../../../what-an-agent-is/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `ob_` or `OB`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (Sam, the planning agent and its badge, as it's written into every tool), the official logos it bundles (`"logos": true`), the words the voice respells (Anil, Noor, Lucía, Mei, Jun, dbt), its opening story (`whose`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a name the voice can't read as written (`planning-agent[bot]`, `agent/planning`, `planning_agent_marts`) says it in words (`say`), and its caption keeps the name as the screen shows it. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/marks.js` | GitHub's official marks, the Invertocat and the lockup, in black, unaltered, from GitHub's logo pack (Databricks' and dbt's come from *The Inner Life of Data*'s `logos.js`). Each is shown only where the voice names its tool, and credited in the repository's `NOTICE.md`. |
| `src/pieces.js` | The room's own pieces: a person at the left and the agent in its ring on the wall, its badge on a hook and its paper tags; a name card, a ticket, the year's 214 changes as tiles, the switches, the badge's card with its three tools, the run and its pass, the tokens with their clocks, Noor's map (an element, a step with what it reads, writes and calls), the tools' cards (the group and its grants, Unity Gateway, the App, the dbt target, the check each night), the branches and `main`, the development catalog and its schemas, the logs (commits, the query history, the audit log's table), the search, and the switches in each tool. Several are copied from *Why Unity Catalog and Unity Gateway govern them*'s pieces, under this film's prefix, so the badge looks the same from one film to the next. |
| `src/scenes.js` | The six chapters, all in the one room. The camera glides on from shot to shot, and a new picture waits for the last one to leave (`later:true`); each chapter opens where the last one ends. The title card ends chapter 1 and the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: almglocken, a bell for each agent (the planning agent's A, the workload agent's high D), and boobams for the people. D major, B minor for the year nobody could place, tuned pure from D. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/from-helper-to-colleague/5-the-map-enforced/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/the-map-enforced.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/the-map-enforced/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/the-map-enforced-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/the-map-enforced/think.en.js` and `think.es.js`: it stops after `map`, `own`, `logs` and `stop`, with one question each. The release workflow renders the video, `the-map-enforced.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
