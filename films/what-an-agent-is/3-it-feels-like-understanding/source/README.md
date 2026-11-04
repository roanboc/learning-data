# Rebuilding It feels like understanding

*It feels like understanding*, film 3 of 9 of *What an agent is*, the first series of the module on AI agents in data work, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, and uses the module's look, marble and oak: its room, its people, the agent and its cards, in [`../../shared/src/`](../../shared/src/), bundled as they are. Only what is new in this film lives here, each name with the prefix `fu_` (or `FU_`):

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the line on what the colours mean, its own source files, the opening story (`story`) and the one chapter where the score may pulse (`urgent`: the orbiter's loss), the words the voice respells (Anil Kurian, Jun, Keil, Parasuraman, Dietrich, Manzey, and "AI" said whole), and the moment its poster shows (the agent's answer, its check passed, its evidence attached). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: the title card after the opening, and the end card. |
| `src/plan.js` | This film's places and 1999: the marble wall and the two desks of 1999 (beige monitors, a desk phone, printed plots, binders), the builders and the navigators in their clothes of 1999, Earth, Mars and the ways between them drawn in graphite on the wall, the orbiter with its one wing and Odyssey, the pushes off course, the radio line, the file "Small forces" with its empty unit tag, the units' bubbles, the envelopes, the signs at each desk, and the blue cards of Odyssey's changes. |
| `src/work.js` | Today: the Faculty of Health and Anil's desk, the advisers and their lists, Jun's desk and the agent (its tool cards, its hands, its ring, behind frosted glass when he can't see in), the answer and what its hands did (`FU_EV`), the 2025 study's cards and bars, the zip and its scale, the calendar of ticks, the chat, the people of the 2010 review and their aids, the student load table and its students as plain shapes, the gap between the lists and the agent's count, the board of chapter 6 (unit cards, the comparison, the record, the team's log, a person's decision), and the soft glow of a fluent answer. |
| `src/scenes.js` | The seven chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line: *la carga estudiantil* and *equivalentes a tiempo completo*, *los asesores*, *la evidencia adjunta*, *una verificación* for a check, *los navegantes* and *newton-segundos* and *libras-segundo*, *un cierre* for the zip. Numbers keep the picture's comma (2,880). |
| `tools/score.py` | The film's music and sounds: a steel tongue drum (the agent, and the fluent answer) and a bowed psaltery (the person who stops and checks), both made here. B minor for 1999, D major from Odyssey on, every chord tuned pure; one urgent pulse, from "the 23rd of September" to "passed behind Mars". Each effect (a pencil, a puff, a card slid, envelopes, ticks, the zip, a chair, keys, a folder, a pen) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film: the module's own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/what-an-agent-is/3-it-feels-like-understanding/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, nothing beats, and only the opening pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/it-feels-like-understanding.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/it-feels-like-understanding/`, with the Spanish captions (as `captions.es.js`), and draws the poster, `site/assets/it-feels-like-understanding-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/it-feels-like-understanding/think.en.js` and `think.es.js`: it stops after `fluent`, `meanings` and `knowing`, with one question each. The release workflow renders the video, `it-feels-like-understanding.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
