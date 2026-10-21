# Rebuilding Who may see it

*Who may see it*, the fourth film of the series on data governance, *Governance you can use*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Yusuf Demir, Mei, ID and IDs), and the moment its poster shows (the mask following the column down the board). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the pencil line across the form and the title, the mask following the column down the board, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `ws_`), in watercolour: West Germany in 1983 (a town hall's register office and its counter, a street with an advertising column and a kiosk, a plain hall for the court's eight judges in red, and a table where a census form lies), and the clothes of its people (a judge's robe and cap, a parka, a long coat, an apron); the census form, its bundles, the register's card, the plan cards, the posters, the judgment's words, the four slips, the tin box, the tally and the shredder; binder 6 on the shelf and open on Yusuf's desk; the old path's papers (the request form, the printed approval, the desk calendar, the printout, the key on a string); the 41 names on Sam's screen; the classes' chips, the mask, the columns with their sample values, the model file's lines, the governance check and the credentials' keys; the platform team's tag and rule; the data team's board of cards on strings; Clara's request and the access card; Planning's near-award list, the learner table's card and the sticky note; the masked table, the scrambler and its slips; the agent's card, the copied spreadsheets, the tray and the tent calendar; and the line across the form that becomes the line between a table's columns. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The eight chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: soft strings that hold A minor's chords under the 1983 story and C major's for today, a felt piano over them, a darkened glockenspiel for the court's line (two notes rising) and each mask settling (a falling third), and the series' mark, 1-5-4-8, on a low clarinet at the title and the end. Music plays under the opening story, then only at a chapter's turn, under a moment on screen and in the wordless pauses. Each effect (paper, a bundle's string, a pencil, the tin box's lid, the shredder, keys, a pin, a chip, the scrambler's gears) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/4-who-may-see-it/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/who-may-see-it.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against". The score's `W()` stops with an error when a word isn't there. `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/who-may-see-it/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/who-may-see-it-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/who-may-see-it/think.en.js` and `think.es.js`: it stops after `column`, `purpose` and `stars`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-who-may-see-it`. The release workflow renders the video, `who-may-see-it.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
