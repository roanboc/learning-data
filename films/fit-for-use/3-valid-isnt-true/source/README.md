# Rebuilding Valid isn't true

*Valid isn't true*, film 3 of 4 of *Fit for use*, the first series of the module *Data quality*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, the agent films' kit, and the module's own look in [`../../shared/`](../../shared/): the quality bench, its people, the cards, gauges and tags, the tools' windows, and the tools that build and check a film ([`../../shared/README.md`](../../shared/README.md) says what each file holds). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (Jun, Mei and "A I", as the module says them, and Tadataka, Edo, Ezo, Hokkaido, shogunate and Lefèvre), its opening story's chapter, no urgent chapter, the moment its poster shows (the list to the printer, at the end), and the tools' marks (`"logos": true`). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the wordless moments (the title card after the opening, and the end card). |
| `src/past.js` | Japan, 1800 to 1821 (prefixed `vt_`, as all of this film's own pieces): Edo at dawn, a map of the time, Ezo's shore by day and by night, and the map of all Japan, each painted once in the module's matte look; the people of 1800 seen from behind or far off, dressed for their time; the rope and its poles, the compass, the quadrant, the stars, the walked line in steel blue and the line of latitude in brass. The land is Natural Earth's 1:50m land (public domain), from the world-atlas package, projected and simplified for the frame; `NOTICE.md` credits it. |
| `src/bench.js` | The university's things on the quality bench: Zoë Lefèvre, new in this film; the list in its card tray; the rules as gauge cards; the portal's page with its two buttons; the three references (the graduate, the folder seen at enrolment, always closed and tied, and the exam boards' bound lists); award cards; a bar that fills as the graduates answer; the envelope to the printer. |
| `src/scenes.js` | The seven chapters, each a run of shots. The opening's rooms dissolve into each other, and its walk and stars glide on in one room. The bench is one room: from chapter 2 on, each chapter opens where the last one ends (`ag_cutInto`); a person who leaves or comes is drawn whole and faded as one picture, and never crosses another in the same place. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. The project's files in chapter 6 are the example project's own, trimmed: the checks' `meta`, the contract's rule and the scorecard. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a singing arc, the arc lamp of 1900 made to sing by its circuit, for what a check measures, and a terpodion, Berlin's rubbed wooden bars of 1816, for the reference, both made here. The mark, at the title and the end: the terpodion's E, the arc's E a little flat, then true, then both together. E major for what's true, C-sharp minor for the problem, every chord tuned pure from E. Music plays under the opening story, and after that only now and then; nothing pulses. Each effect fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film: the module's own `build.py` and `quiet.py`, and the agent films' and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/fit-for-use/3-valid-isnt-true/source/`:

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
python tools/render.py --workers 4   # dist/valid-isnt-true.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead).

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/valid-isnt-true/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/valid-isnt-true-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). After a new soundtrack, `python site-tools/media.py index --film valid-isnt-true-en` writes the film's `audio.json`. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page, its Spanish chapter names, the example project's files it links under *See it in the project*, and its Draft label). "Pause and think" is `site/assets/valid-isnt-true/think.en.js` and `think.es.js`: it stops after `allowed`, `ask`, `apart` and `which`, with one question each. Progress is stored in the browser under `ld-valid-isnt-true`. The release workflow renders the video, `valid-isnt-true.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
