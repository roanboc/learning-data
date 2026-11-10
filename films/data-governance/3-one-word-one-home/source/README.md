# Rebuilding One word, one home

*One word, one home*, film 3 of 10 of the first series on data governance, *Governance principles*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Yusuf, Qin), and the moment its poster shows (the five glossaries and their three meanings). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title, after the board, and the end card). |
| `src/past.js` | The opening's pictures (prefixed `ow_`), in watercolour: Qin in 221 BC, a road through the loess hills with two ox carts in the same ruts, the town gate with its stall of standard measures and a courier with the court's orders, the court's slips, the county office at Qianling with its scribes, and the board of word rules as it was and as it was found in a well in 2002. Its people wear their own time, checked against the First Emperor's mausoleum museum's civil officials and the *Shiji* (the sources are in [the script](../script.md)'s rigour sheet); no characters are drawn, and the rules are given in English on cards. |
| `src/plan.js` | The university's pictures (prefixed `ow_`), in the series' rooms: the five glossaries round Mei, as *Who decides* leaves them; Yusuf's board of five cards; the 2019 tool's login page; the term card, and the glossary, the dictionary and the catalog side by side; the links that replace the copies; the sync's log at night and its pull request; the setting; the workshop's notes; the glossary's list; binder 12. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The eight chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds, a palette of wood: a recorder consort in E minor for Qin and G major for today, a low marimba for the moments that land, and the series' mark, 1-5-4-8, on the alto recorder at the title and the end. Each meaning of award has its marimba note (violet's, the one that stays, is home, G), and a glossary made to read from the one that stays steps home. Chords play under the opening only; after it, music comes in from time to time. Nothing loops, and each effect (ox carts' wheels, wooden slips, a brush of ink, paper, a pin, a sticky note, a muffled key, a rubber stamp) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The check on when the music plays: after the opening, no chapter has music for more than half its length or 12 seconds without a break, nothing beats on a phone's one speaker, and nothing pulses. |
| `tools/` | Each other tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/3-one-word-one-home/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error, and every place paint
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # when the music plays, and that nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/one-word-one-home.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and the score stops on a word that isn't there. `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/one-word-one-home/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/one-word-one-home-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/one-word-one-home/think.en.js` and `think.es.js`: it stops after `none`, `read`, `change` and `agree`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-one-word-one-home`. The release workflow renders the video, `one-word-one-home.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
