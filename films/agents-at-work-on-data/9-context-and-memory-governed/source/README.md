# Rebuilding Context and memory, governed

*Context and memory, governed*, film 9 of 9 of *Agents at work on data*, the second series of the module on AI agents in data work, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, and the module's look and tools in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/), whose [README](../../../what-an-agent-is/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `cm_` or `CM_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (Lucía's agent starting the day with the team's memory), the words the voice respells (Lucía, Ortega, Yusuf, Jun, AI), its opening story (`first`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose card stops differently from its film's voice says it as that film does (`say`), and shows the card's words in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/world.js` | Lucía's corner of Planning, painted once in the module's matte style, lit from the right, with the team's memory on the wall (`cmLab`), and the same wall quiet for the diagrams (`cmBoard`, `cmNight`); Lucía, drawn from the series' spec; her desk, screen and calendar; an agent's sphere and its name; the dots for students, on campus and online; and the library's card. |
| `src/memory.js` | The team's memory, drawn as *Memory: from one chat to the team* draws it: the oak card file and its standing cards, an entry pulled up with its fields, a proposal with its dashed edge and pen that turns into an entry when it's approved, the stamps, a session, the stores on the platform, the daily memory step, a plain script, and the arrows and reading lines between them. |
| `src/repo.js` | The team's context as code: the repository (the example project's files, as they're named there), `CODEOWNERS`, a pull request with its review and approvals, a file's history; and where agents read it on Databricks: a table in Unity Catalog with its comments, a skill in Unity Gateway, a line quoted from the docs, and a bin. |
| `src/close.js` | What an agent reads, as *Context engineering* draws it (the sphere, its four cards, and this film's memory card under it), the five questions as a table, the series' nine lessons, each as its film's end card says it, and the module's road of four series. |
| `src/scenes.js` | The six chapters, each a few shots, in Lucía's corner or on the quiet wall. On the wall the camera glides on from shot to shot, and a new picture waits for the last one to leave (`later:true`); between the corner and the wall it cuts. The title card ends chapter 1 and the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: struck glass bars, what the team knows, and a baritone sarrusophone, the people who look after it, sounding only where a person reviews, approves or owns something. D major, B minor for the wrong line, tuned pure from D. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/agents-at-work-on-data/9-context-and-memory-governed/source/`:

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
python tools/render.py --workers 4   # dist/context-and-memory-governed.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/context-and-memory-governed/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/context-and-memory-governed-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/context-and-memory-governed/think.en.js` and `think.es.js`: it stops after `reads`, `memory` and `keep`, with one question each. The release workflow renders the video, `context-and-memory-governed.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
