# Rebuilding How it goes wrong

*How it goes wrong*, film 6 of 9 of *Agents at work on data*, the second series of the module *AI agents in data work*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, and the module's own look in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/): the lab, its people, the agent and its loop, the cards, and the finishing pass ([`../../../what-an-agent-is/shared/README.md`](../../../what-an-agent-is/shared/README.md) says what each file holds). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (Jun and "A I", as the series says them), its opening story's chapter, the one chapter whose sound may turn urgent (`loop`), and the moment its poster shows (the cutaway house and its timber cage, in Lisbon's morning light). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the wordless moments (the title card after the opening, and the end card). |
| `src/lisbon.js` | Lisbon in 1755 and today (prefixed `hw_`, as all of this film's own pieces): the city from the river, its houses, churches and waterfront, the tremble, the dust, the river drawn back and the wave, the fires' glow; the people of 1755 and of today, in the module's way; the church door, the engineers' room and the new plan over the old lanes, the cutaway house and its timber cage, the three houses and their walls above the roofs, the sheet of thirteen questions, the map of Portugal and its parishes, the priest's table and quill, the three parishes' answers, the lower town today and the archive. |
| `src/plan.js` | The room's pieces: where things stand, the six cards along the top of the wall and their grid at the end (each way and its design), each chapter's card, the draft and its build, the catalog card, the answer and what it counted, the census report, the plan's lines, the pull request's tests, the ticket and its hidden line, the three places a line can hide, the rule from `AGENTS.md`, the six tools, the night's clock, rounds and source, the limits, the budget, the plain check, the bars of cost and the count card. Colours keep the module's meanings. |
| `src/scenes.js` | The eight chapters, each a few shots cut together. The title card ends chapter 1, the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a trautonium, the electronic instrument of 1930, soft and filtered, with its undertones sounding below each note, and low bell plates struck with a felt mallet and damped, both made here. Each way an agent goes wrong turns on a note with an undertone that doesn't sit, and its design switches it, at once, to one that does. C minor for 1755, C major for the city rebuilt and for the close, every note tuned pure from C. Music plays under the opening story, and after that only now and then; a soft, low pulse, one to a round, only under the night's rounds. Each effect (paper, knocks, taps, keys, a low rumble and thud, a breath of air, a pencil and a quill, a pen struck through, the clock's steps) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film: the module's own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/agents-at-work-on-data/6-how-it-goes-wrong/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints without holding the page, nothing shows twice, no arm jumps
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, as low as the governance films', nothing beats, and only loop pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/how-it-goes-wrong.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead).

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/how-it-goes-wrong/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/how-it-goes-wrong-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/how-it-goes-wrong/think.en.js` and `think.es.js`: it stops after `number`, `ticket` and `loop`, with one question each. Progress is stored in the browser under `ld-how-it-goes-wrong`. The release workflow renders the video, `how-it-goes-wrong.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
