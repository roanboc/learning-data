# Rebuilding Working with agents on Databricks

*Working with agents on Databricks*, film 7 of 9 of *Agents at work on data*, the second series of the module on AI agents in data work, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, and the module's look and tools in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/), whose [README](../../../what-an-agent-is/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `od_` or `OD_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the three answers over the three desks), the words the voice respells (Anil Kurian, as the governance films say his name, Jun, Mei, MCP, AI), its opening story (`three`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the three agents reading the same data as it becomes the title card, and the end card. |
| `src/faculty.js` | The opening's and the close's place, the Faculty of Health's office, painted once in the module's matte style, lit from the right (the marble wall, the oak floor, a tall window, three oak desks), and what stands in it, drawn live: Anil and his two colleagues, each person's own agent on their desk, its grey cable to that person's own copy (the spreadsheet made for the yearly research report, the laptop's copy of the projects table, the folder of reports), the question, the three answers with their evidence or its empty slot, and Anil's plan. |
| `src/platform.js` | The platform's pieces, in the module's colours and never a product's own look, with the official logo beside each product the voice names (`od_mark`): the shelf of the opening, the four ways along the top of the wall, the platform's card with Unity Catalog in it, the pages drawn for the film (Genie One, the *Research projects* Genie Agent, the Lakeflow Pipelines Editor with Genie Code), the tool servers and the panel they run in, the count of active projects as a function, the nightly job, Agent Bricks and Agent Runtime, the trace, the evaluation, the screens of the wide shot, and the drafts. |
| `src/marks.js` | MCP's mark, the one logo the film adds to *The Inner Life of Data*'s Databricks and dbt logos (`logos.js`, which `"logos": true` in `film.json` bundles); embedded unaltered, and credited in NOTICE.md. |
| `src/scenes.js` | The seven chapters, each a few shots cut together, a dissolve only where a shot adds a veil and a card. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a tonewheel organ, three drawbars and no rotating speaker, every key drawing on the same turning wheels, as every agent on the platform draws on the same data and tools; and three Wagner tubas, each its own player on its own note, each person's own agent. The mark is three chords from the same wheels (G-flat major, E-flat minor, C-flat major), which share G-flat. E-flat minor, then G-flat major, tuned pure. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/agents-at-work-on-data/7-agents-on-databricks/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice in a dissolve, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/agents-on-databricks.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, or a word the voice respells in `film.json`, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/agents-on-databricks/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/agents-on-databricks-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/agents-on-databricks/think.en.js` and `think.es.js`: it stops after `ask`, `tools` and `build`, with one question each. The release workflow renders the video, `agents-on-databricks.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

The worked example the film shows is in the example project, [`films/analytics-engineering/project/examples/agents-on-databricks/`](../../../analytics-engineering/project/examples/agents-on-databricks/): the count of active research projects as a Unity Catalog function, the *Research projects* Genie Agent with its benchmarks, and the project check agent's evaluation cases.
