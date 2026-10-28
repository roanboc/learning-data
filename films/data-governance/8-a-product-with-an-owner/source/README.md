# Rebuilding A product with an owner

*A product with an owner*, film 8 of the first series on data governance, *Governance principles*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Yusuf, the bedesten, Anil, Mehmed, Jun and Noor, as the series says them), and the moment its poster shows (a buyer in the cap makers' street, under the three things she knows there). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the wordless moments (the street in the evening and the title, the finished card, the two cards on the glass, and the end card). |
| `src/past.js` | Istanbul, painted the series' way (prefixed `po_`): the bedesten in 1461, its yard, its door and its hall of locked cupboards; the market seen from above, its shops spreading along the open streets and filling them by the 1520s, then each trade's street tagged in the 1600s; a street of the 1520s at a buyer's height; the cap makers' street, its master, his apprentice and the guild's officer; the market inspector and his men at the cloth seller's stall, and the bolt a hand short of the rod. Its people wear their own time, and nothing borrows a style, a script or an ornament from the period's own art. |
| `src/plan.js` | The university's own papers, drawn on the series' rooms (prefixed `po_`): Yusuf's shelf and binder 22; Anil's desk, the near-award dashboard and the sheet of places; the corridor's card and its calendar; the question card and the product card, written in line by line; the catalogue, on Planning's wall screen and on Anil's; the cards on the floor's glass; Yusuf's notebook and its line of users; the register of tables and its six products; the change requests and the check's stamp; the record of who uses what; the board's four steps of a product's life, its cards and its calendar. `po_fadeCut` fades each word as the frame comes to cut it. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The nine chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a harp and soft strings, G major for the market and E-flat major for the university, every note tuned pure over G; a celesta for the moments that land, a question that stops short of home and a promise that reaches it; the series' mark, 1-5-4-8, on a horn under the title and the end card. Music plays under the opening story, and after that only now and then. Each effect (paper, cloth, the inspector's rod, a pencil, a pen, pins, a phone, a click, a stamp, pages, a soft knock for each tag) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/edges.py` | The film's own check that the frame never cuts a word, decoration included, wherever the word is anchored (a copy of *Fixed where it starts*' check). `tools/check.py` runs it after the series' check. |
| `tools/` | Each other tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/8-a-product-with-an-owner/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error, and the frame never cuts a word
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, and nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/a-product-with-an-owner.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against", and a word that isn't there falls back to the line's start (the score stops instead). `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/a-product-with-an-owner/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/a-product-with-an-owner-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/a-product-with-an-owner/think.en.js` and `think.es.js`: it stops after `promise`, `steps` and `life`, with one question each. Progress is stored in the browser under `ld-a-product-with-an-owner`. The release workflow renders the video, `a-product-with-an-owner.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
