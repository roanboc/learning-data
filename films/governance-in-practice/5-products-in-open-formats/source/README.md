# Rebuilding Products in open formats

*Products in open formats*, film 5 of 6 of the third series on data governance, *Governance you can use*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, the master and reference data series' watercolour and its people in pencil and wash, and *Governance principles*' university: its rooms and the things in them, its people, and what a film needs before it starts (all in [`../../../data-governance/shared/src/`](../../../data-governance/shared/src/)). This series' own pictures, painted once for its six films, are in [`../../shared/src/tools.js`](../../shared/src/tools.js): files as paper sheets, a tool's page drawn as a form, the data team's board with the series' six cards, name cards and tags. Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files (the series' `tools.js` first), the words the voice respells (Bitol and Ontos), and the moment its poster shows (census day next March, at dawn in the Faculty of Health, Clara's product open in the catalogue). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a number says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the fifth card on the data team's board becoming the title, and the end card. |
| `src/plan.js` | This film's pictures (prefixed `gp_` and `GP_`): Noor's room, her map and her board with the six data products, as stalls under their awnings, as *A product with an owner* drew them; Clara's card, and a catalogue's card typed by hand beside a table that changes week by week; the Faculty of Health, at Anil's desk by day and at dawn, with his report on next semester's places; Planning's office, close at Clara's desk; the files the film opens, each line copied from the example project or its worked examples (the product's file, its contract, the model's lines, the descriptors, the standards' README), with their line numbers; a pull request's checks, and the impact check's report; the data team's board, with its thirty-three tables, the ten other teams read, and two versions of Clara's table; the two standards, as books; Sam's desk, and Ontos's pages drawn as forms, from its user guide; the copy that goes one way; and the data team's desk from above, for files that run the frame's whole width. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The nine chapters, each a few shots cut together with short dissolves; shots in a row in the same place share one camera (`gp_run`). The title card ends chapter 1, the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a lute, plucked close, one string to a note, and a soft synthesiser, a plain sine-and-triangle voice with a slow attack, playing the same lines with it, both made in the score, in F major, every chord tuned pure. The two play under the opening story and after that only at a chapter's turn, under a moment on screen or in a wordless pause; the lute's marks mean the same all through (two notes rising a fourth when a file is written, a note the synthesiser joins in unison when another tool reads a file, and a single low note when a change is stopped). The series' mark, 1-5-4-8, plays at the title and the end. Nothing loops or pulses, and each effect (a knock, a breath of air as something crosses the frame, keys, a tap, paper, a sheet folded, a pin, a pencil and its stroke, a highlighter, a card slid, a stamp, a book set down) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/` | Each other tool runs *Governance principles*' tool (`../../../data-governance/shared/tools/run.py`) on this film: that series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/governance-in-practice/5-products-in-open-formats/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, and nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/products-in-open-formats.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead). One line is read differently from its caption ("the 31st of March 2027" is "the thirty-first of March twenty twenty-seven"), so a moment on that line waits for a word of what the voice says. `python ../../../data-governance/shared/tools/cues.py` lists it on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/products-in-open-formats/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/products-in-open-formats-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/products-in-open-formats/think.en.js` and `think.es.js`: it stops after `contract`, `break` and `catalogue`, with one question each. Progress is stored in the browser under `ld-products-in-open-formats`. The release workflow renders the video, `products-in-open-formats.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
