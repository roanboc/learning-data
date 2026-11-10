# Rebuilding Five stages, not a switch

*Five stages, not a switch*, film 1 of 7 of *From helper to colleague*, the third series of the module *AI agents in data work*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, and the module's own look in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/): the lab, its people, the agent, the cards, and the finishing pass ([`../../../what-an-agent-is/shared/README.md`](../../../what-an-agent-is/shared/README.md) says what each file holds). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (Jun, Anil, Noor, HR and "A I", as the series says them), its opening story's chapter, no urgent chapter, and the moment its poster shows (the workload agent at its four stages). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the wordless moments (the title card after the opening, and the end card). |
| `src/nz.js` | New Zealand in the 1980s (prefixed `fs_`, as all of this film's own pieces): the hills by day and by night, painted once as two places of one room, the road, the car and the people in it, the three road signs, the switch, the young driver and the parent, and the corner tag. |
| `src/stages.js` | The five stages and their gates, `fs_stages`: five oak steps on the floor, each with its card, its three facts and the gate before it. It is self-contained, so the series' later films copy it whole, under their own prefix, and keep its look, its words and its colours. |
| `src/lab.js` | Where things stand in the room, the agent and its badge, the workload agent's answer card, the tasks' tags and their flight to their stages, the cards of lines, the pills, the plinth under the stages, the researchers' five levels and the fourteen nights in test. Colours keep the module's meanings. |
| `src/scenes.js` | The six chapters, each a run of shots. The hills are one room by day and by night, and the lab one room too: from chapter 2 on, each chapter opens where the last one ends (`ag_cutInto`), and only the opening's step into the lab and the close's step back to the hills dissolve. The title card ends chapter 1, the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: rototoms alone, small tuned drums struck softly with felt mallets, made here from the head's own modes. Five drums, one for each stage, each a whole step below its note until its gate is passed, then turned up to it, so a person's decision is heard as a drum turned up; D minor for the opening's problem on a sixth, low drum, F major from 1987 on, every note tuned pure from F. Music plays under the opening story, and after that only now and then; nothing pulses. Each effect (paper, a soft knock, a breath of air, a pencil) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film: the module's own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/from-helper-to-colleague/1-five-stages/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints without holding the page, nothing shows twice, no arm jumps, nothing jumps in one room, nothing reaches past a person's picture
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, as low as the governance films', nothing beats, nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/five-stages.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead).

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/five-stages/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/five-stages-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page, its Spanish chapter names, and the example project's files it links under *See it in the project*). "Pause and think" is `site/assets/five-stages/think.en.js` and `think.es.js`: it stops after `stages`, `tasks` and `down`, with one question each. Progress is stored in the browser under `ld-five-stages`. The release workflow renders the video, `five-stages.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
