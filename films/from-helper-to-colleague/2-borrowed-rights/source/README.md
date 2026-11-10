# Rebuilding Borrowed rights

*Borrowed rights*, film 2 of 7 of *From helper to colleague*, the third series of the module *AI agents in data work*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, and the module's own look in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/): the lab, its people, the agent, the cards, and the finishing pass ([`../../../what-an-agent-is/shared/README.md`](../../../what-an-agent-is/shared/README.md) says what each file holds). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (Jun, Anil Kurian, Noor, Lucía, Ortega and "A I", as the series says them), its opening story's chapter, no urgent chapter, and the moment its poster shows (the helper's next step, "Approve, as Jun Park"). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the wordless moments (the title card after the opening, and the end card). |
| `src/frank.js` | Britain before 1840 (prefixed `br_`, as all of this film's own pieces): a member's writing table seen close, his study and the letter office, each painted once; handwriting that writes itself on; a letter's cover, its back and its front, each part written on when its word is said (the address, the charge the receiver pays, the frank, the town and the date of 1784's rule, the red PAID of 1840); the people of the time, dressed for it; Rowland Hill's pamphlet, the notice of 1840, a penny, and the two years' piles of letters. |
| `src/stages.js` | The five stages and their gates, `br_stages`: 3.1's `fs_stages` copied whole under this film's prefix, as 3.1's file says a later film may, so the series' picture of the stages keeps its look, its words and its colours. Copy it again if 3.1 changes it. |
| `src/pieces.js` | Where things stand in the lab, and the film's pieces there: a helper wearing its person's badge on a blue lanyard, and an agent with a name of its own wearing its own, its owner beside it; the cards, lists, tickets and pills; the step a helper asks to be allowed; the record that would have been; a log with who really did each step; the helper's own setting; a sample with names masked; the project's page for agents; drafts in the sandbox; a place on the university's map; the corner tag. Colours keep the module's meanings. |
| `src/scenes.js` | The seven chapters, each a run of shots. The opening's three rooms dissolve into each other; in the letter office the camera glides on, and a year later (`later:true`) what was there leaves first. The lab is one room: from chapter 2 on, each chapter opens where the last one ends (`ag_cutInto`), and Lucía's first day and the planning agent's are later moments in it, so two helpers are never seen at once. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a kit, the dancing master's pocket fiddle, bowed softly with no vibrato, for the lesson and for whoever borrows a person's rights, and a gemshorn, a tenor horn flute kept low, only for a person, both made here. The person's phrase (D, B flat, D, F, A, B flat) is played whole, then narrowed to the kit's open strings only, the film's mark; a person's decision is the gemshorn's rising fifth. B-flat major, G minor for the problem, E-flat major at "Something had to change", every chord tuned pure from B flat. Music plays under the opening story, and after that only now and then; nothing pulses. Each effect fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film: the module's own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/from-helper-to-colleague/2-borrowed-rights/source/`:

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
python tools/render.py --workers 4   # dist/borrowed-rights.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead).

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/borrowed-rights/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/borrowed-rights-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page, its Spanish chapter names, the example project's files it links under *See it in the project*, and its Draft label). "Pause and think" is `site/assets/borrowed-rights/think.en.js` and `think.es.js`: it stops after `wide`, `who` and `checked`, with one question each. Progress is stored in the browser under `ld-borrowed-rights`. The release workflow renders the video, `borrowed-rights.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
