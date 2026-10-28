# Rebuilding Change without surprises

*Change without surprises*, film 7 of the series on data governance, *Governance you can use*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Yusuf, Mei, Dagen H), and the moment its poster shows (the crossroads at five, as the cars drive on along the right). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, while something happens on screen (the cars crossing and driving on, the covers swapped, the owners writing their lines, Mei's stamp, the two notes side by side, Marta's nod, the last look at Thursday), and two wordless moments (the officer lowering his glove before the title, and the ending before the end card). |
| `src/past.js` | Sweden from 1963 to 1967 (prefixed `cw_`), in watercolour: the town crossroads at dawn, at night and in the morning, with its shops, kiosk, clock, street light and signs, the cars, a lorry, a bus and a tow truck, drawn in perspective and painted the way people are (`cw_paint`); the border post where the road keeps right, the country road where a driver can't see past a lorry, and the two cars of the grey what-if; the commission's office and its plan; the road worker's ladder and the covers; the post office counter, the booklets and the postman's sack; the grocer's counter and its milk cartons; the desk with the accident reports of 1967 and 1966. Places of work and trade only. |
| `src/plan.js` | The university's papers and places (prefixed `cw_`), in plain words: Monday's change notice for *award*, signed by Mei; binder 19 and Yusuf's shelf; the change board's form and its calendar; Jun's change request and its impact note; the register's page "Who uses what", each line in its owner's hand; Planning's near-award dashboard, Finance's forecast and the wallet app; the table of credentials on paper, and its two editions; Mei's rule card and her stamp; the new mark; Jun's notice, in the data team's words and in the wallet team's; Marta's notebook; the two reports' cards; and the table no one owns yet. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The ten chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 10. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: violas for the chords, under the opening story in Sweden (C while the cars wait, then G at five, through E minor, a chord both keys share) and after that only now and then; a double bass, one low C under the years before, the crash and the fear, and plucked once under Mei's stamp; plucked violas for each owner's line in *Who uses what* and each owner's "ready", a step higher each time; the opening's chord in C each time the film goes back to 1967; the series' mark, 1-5-4-8, on a flugelhorn at the title and the end. Every chord is tuned pure, and no note pulses or trembles. Nothing loops, and each effect (engines, steps, a ladder, covers, booklets, a carton, paper, a pen, a pin, a stamp, a clip, a ledger) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/` | Each other tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/7-change-without-surprises/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error, and every place paints quickly
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, and nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/change-without-surprises.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against", and a word that isn't there falls back to the line's start (the score stops instead). `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

The cars of the opening come close to the camera, where a car can be many times the frame's size: `cw_paint` paints only what the frame can see, and keeps its canvases at a few sizes, so `check.py`, which draws every frame in one go, doesn't run out of memory.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/change-without-surprises/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/change-without-surprises-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/change-without-surprises/think.en.js` and `think.es.js`: it stops after `breaks`, `edition` and `words`, with one question each. Progress is stored in the browser under `ld-change-without-surprises`. The release workflow renders the video, `change-without-surprises.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
