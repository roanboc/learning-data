# Rebuilding Off the shelf

*Off the shelf*, the opening film of the series on data governance, *Governance you can use*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Yusuf Demir), and the moment its poster shows (the shelf). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the inspector's mark and the title, the pinned poster, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `os_`), in watercolour: the market town from 1215 to the 1880s (the market and its cross, the wine stall's jugs, the market hall and the king's standards, the corn exchange and its bushels, the grocer's shop, the inspector's case, scale, punch and mallet); Yusuf's box; the shelf of binders, the score, the chart and the council's minutes; Planning's census screen, the draft submission, the reports' cards, Jun's glossary and test screens, the registrar's manual and tent card; binder 12, open and closed, the sticky notes, the highlighters and policy 12's page; DAMA's book and its wheel; the answers on Yusuf's board; the loop's pins and rings; the nine binders, and the cards for the films on governance as a capability and with the tools. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The ten chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 10. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a soft brass choir in D dorian for the market town and F major for today, a low music box for the moments that land, the series' mark, 1-5-4-8, on a horn at the title and the end, and one low pulse under the two numbers that disagree. Nothing loops, and each effect (a knock, paper, a cork pin, a rubber stamp, a mallet's thud) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/1-off-the-shelf/source/`:

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
python tools/render.py --workers 4   # dist/off-the-shelf.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against", and a word that isn't there falls back to the line's start. `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/off-the-shelf/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/off-the-shelf-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/off-the-shelf/think.en.js` and `think.es.js`: it stops after `decides`, `for` and `runs`, with one question each. The series has no labs or scenarios yet, so the questions link to none. Progress is stored in the browser under `ld-off-the-shelf`. The release workflow renders the video, `off-the-shelf.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
