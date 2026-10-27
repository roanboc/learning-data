# Rebuilding Teachers of data

*Teachers of data*, film 10 of the series on data governance, *Governance you can use*, and the last of its first part, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, and the master and reference data series' watercolour and its people in pencil and wash. The series' own places live in [`../../shared/src/`](../../shared/src/): the university's rooms and the things in them (`rooms.js`), its people (`people.js`), and what a film needs before it starts and the video's finishing pass (`finish.js`). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the opening story (`story`, for `tools/quiet.py`), the words the voice respells (Anil Kurian, Anil, Yusuf, ADKAR), and the moment its poster shows (the mime at the crossing). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the light turning green at the crossing and the title, the calendar's weeks crossed off, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `tt_` and `TT_`), in watercolour: a crossing in the centre of Bogotá, in 1995 and in 2012, laid out in metres and seen through two cameras, so a cut keeps every car and person where they were (the avenue and its buildings, the eastern hills and Monserrate, the signals, the cars and their drivers, the people on foot and a step back from a car that edges forward, the mimes, the traffic officer and his notebook, the whistles and the applause); Mei's submission on the floor; Yusuf's board, its three Bogotá panels and the bar of the binder's last count; Anil's screen, with his table in plain words, his change sent back on the series' sign-off sheet (`gv_signoff`) and the guide beside it, then signed; Jun's screen, his change signed on the same sheet with its warning in the series' amber; the stewards' meeting room, its screen, whiteboard, notes, stamp box, wheel and calendar; Yusuf's office, with the series' newest DMBOK on his desk (`gv_deskBook`), the framed score, binder 29, the in-tray, the box marked "retired", the card on his door and the measures; the sketch and the path for new analysts; and the cards on Noor's map. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The eight chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a double-reed trio, oboe, cor anglais and bassoon, under the opening story in Bogotá (G major) and after that only now and then (the university in E-flat major, Bogotá in 2012 in E-flat minor). One phrase of five notes is played by one voice and copied by another, as teaching is; the mimes get soft staccato notes, and the fine, and every check that stops the work, one low bassoon note; the voices come in one at a time as things arrive in order; the series' mark, 1-5-4-8, on the cor anglais, answered by the bassoon, plays at the title and the end. Every chord is tuned pure, and no note pulses or trembles. Nothing loops, and each effect (the cars, whistles, applause, the notebook, paper, pins, the marker, keys, the frame lifted off its nail, a pencil on the calendar) fires at the same moment, with the same word and offset, and for the cars and the mimes the same paths, as the thing it belongs to in `src/scenes.js` and `src/plan.js`: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/` | Each other tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/data-governance/10-teachers-of-data/source/`:

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
python tools/render.py --workers 4   # dist/teachers-of-data.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, so "again" would land on "against", and a word that isn't there falls back to the line's start (the score stops instead). `python ../../shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/teachers-of-data/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/teachers-of-data-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/teachers-of-data/think.en.js` and `think.es.js`: it stops after `beside`, `warn` and `measured`, with one question each. Progress is stored in the browser under `ld-teachers-of-data`. The release workflow renders the video, `teachers-of-data.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
