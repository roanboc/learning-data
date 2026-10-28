# Rebuilding An agent that checks

*An agent that checks*, the ninth film of the first series on data governance, *Governance principles*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Anil Kurian, Yusuf Demir), and the moment its poster shows (Anil at his desk, with what the night shows: rules written as checks, an agent on every change, a person who decides). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (Anil resolving the agent's comment, then the title; and the end card). |
| `src/plan.js` | This film's pictures (prefixed `ac_`), in watercolour: the campus at dusk, at three in the morning and at dawn, its lamps and one lit window; the faculty's office at dusk, by day and in the morning, and its screen, close: Anil's change request, the agent's reading line and its note of three cards; the three readers' cards, and the outlines of a learner and of someone pretending to be them; the corner card of Jun's board, "Today"; the call list and its sign-off sheet, sent back with four gaps; Jun's board of changes waiting for him, and his page of what he checks; the advisers' desk, its phone and tray; Yusuf's board, the checklist written by hand, printed, and pinned up in copies, with its steps and don'ts; the agent's review, its three findings, the count of the email column and the two long codes; the classes, Anil's answer and the owners' approvals on the sign-off sheet; binder 26 open on the desk, the rules for AI helpers, Sam's desk and the agent's access request, and the register's page of who signs off what; binder 12 closed, policy 12's page as *Off the shelf* left it, the checklist on the data team's board; and the four parts of the night. Only the university's own papers: no files, code or tool screens. The agent is a turning four-pointed star on a dashed cyan card, never a face. Each column's class of personal data is the series' chip (`gv_classChip`, in *Who may see it*'s colours), in a dashed cyan pill when the agent drafts it, ringed or washed in gold when a person decides it. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The eight chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a nylon-string guitar under the opening, the imagined night, and after that only at a chapter's turn or for a rule that runs; a soft electric piano for the agent, two notes rising a fourth whenever it reads or drafts, and one low note for each thing it can't do; an alto flute falling home, 3-2-1, whenever a person decides; and the series' mark, 1-5-4-8, on the flute with the piano under it, at the title and the end. Every note is tuned just, so nothing beats on a phone's speaker. Each effect (night air, keys, paper, a pin, a pencil, a highlighter, a stamp, soft knocks) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The master data films' check of their sound, which this film follows: after the opening, no chapter has music for more than half its length, or for 12 seconds without a break; no two held notes beat; nothing pulses. |
| `tools/` | Each other tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/9-an-agent-that-checks/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error, and every place must paint
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes in from time to time, and nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/an-agent-that-checks.mp4
```

`stills.py --at` takes times in the film, not in a chapter: a chapter's start plus the moment.

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "waits for Jun" lands on the second sentence of its line, not the first "waits", and a word that isn't there falls back to the line's start. `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/an-agent-that-checks/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/an-agent-that-checks-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/an-agent-that-checks/think.en.js` and `think.es.js`: it stops after `today`, `decides` and `written`, with one question each. Progress is stored in the browser under `ld-an-agent-that-checks`. The release workflow renders the video, `an-agent-that-checks.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
