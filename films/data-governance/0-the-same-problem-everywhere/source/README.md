# Rebuilding The same problem, everywhere

*The same problem, everywhere*, the prologue to the first series on data governance, *Governance principles*, is generated from code like every other film here. It tells the real history behind the series: why data management got a body of knowledge, why governance is at its centre, and why the DMBOK still matters, with its additions for ethics and AI. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (DAMA, DMBOK), and the moment its poster shows (the board: three times the same question was asked, and the question). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the last light on the bank's floor, then the title; and Yusuf's office, waiting, then the end card). |
| `src/plan.js` | This film's pictures (prefixed `sp_`), in watercolour, each era with its place and year in the corner: a bank's risk floor at night, its board and the city in 2008; an office floor in the 1970s that begins to share its data, the data administrator's office and her dictionary; the meeting in Los Angeles in 1980, the association's chapters city after city, and each organisation alone, then together; a boardroom in 2002 and the report they sign; the body of knowledge on its shelf and open at its wheel, painted here, not copied; the regulators' room in Basel, the principles and the progress report ten years on, its thirty-one towers; a team room in 2017 and an office's front desk in 2018, with its register and its reply; a team training a model in 2024, the revised book, Europe's AI law and the third edition's draft; and today, the board of sketches round one question, the newest copy taken from the shelf, and Yusuf's office. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The eight chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a small chamber organ, stopped wooden pipes in a box whose shutters swell each chord in and out, and soft timpani, one stroke as each year appears in the corner. Each era has its own chord; the music plays under the story of 2008 until the title, then only at a chapter's turn, under a few moments and at the end; and the series' mark, 1-5-4-8, on the organ's flute with timpani, at the title and the end. Nothing loops or pulses, and each effect (printouts, pencil and marker, cork pins, pens, books, covers, a page, a rubber stamp, photos, sticky notes, a tag, footsteps) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | Checks the music keeps the series' rule: after the opening story, no more than half of any chapter, nothing held longer than 12 s, nothing that beats or pulses. Run it after `tools/audio.py`. |
| `tools/` | Each other tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/0-the-same-problem-everywhere/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes and goes, and nothing in it beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/the-same-problem-everywhere.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against", and a word that isn't there falls back to the line's start. `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/the-same-problem-everywhere/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/the-same-problem-everywhere-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/the-same-problem-everywhere/think.en.js` and `think.es.js`: it stops after `written`, `first` and `machines`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-the-same-problem-everywhere`. The release workflow renders the video, `the-same-problem-everywhere.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
