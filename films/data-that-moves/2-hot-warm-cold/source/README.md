# Rebuilding Hot, warm, cold

*Hot, warm, cold*, film 2 of 4 of *Data that moves*, the first series of the module *Modern data basics*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, and draws with the module's kit, the platform map drawn up close: its map, its people, its cards and the tools' pages, in [`../../shared/src/`](../../shared/src/), bundled as they are. Only what is new in this film lives here, each name with the prefix `hw_` (or `HW_` for its tables):

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the line on what the colours mean, its own source files, the opening story (`story`: *The pigeon post*), no chapter where the score may pulse (`urgent` is empty), the words the voice respells (Aachen, Reuter, Noor, Rohan, Linh, Jun, Zerobus, and "HR" said as letters), the official logos it draws (`logos`), and the moment its poster shows (in *When someone acts*, a moment after Noor's "hot") |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The longer pauses after a line (`hold`), where an idea or a picture needs a moment, and the two wordless moments: the title card after the opening story, and the end card. |
| `src/hw_look.js` | The film's own tints and the helpers every chapter uses: a pigeon seen from above, flapping, and a flock along an arc; a telegraph wire on its poles; pins and labels on the map; the three speeds as bands, cold, warm and hot; cards, tags and pills; and the university's three rows of data, each from where it's born to who acts on it, once a night until September, then each in time |
| `src/hw_places.js` | The film's place, painted once: a map of 1850 from London to Berlin, centred near Aachen, its land kept as bits read from NOAA's GLOBE data (see `NOTICE.md`), with Berlin, Aachen, Cologne, Liège, Brussels, Paris and London placed on it |
| `src/scenes.js` | The six chapters, each a few shots under a slow camera, gliding on in one room and cut or dissolved between rooms. The title card ends chapter 1, the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line: *frío*, *tibio* and *caliente* for the three speeds, *Aquisgrán* and *Bruselas*, *la vista* and *el pipeline*, *el camino frío* for the cold path |
| `tools/score.py` | The film's music and sounds: a serinette, the small bird organ of the 18th century, its pinned barrel opening tiny pipes one after another, and the merline, the larger bird organ, an octave lower, with stopped pipes for the ground. D major, B minor for the problem, tuned pure from D. The mark is D, F sharp, A, the last landing as something arrives in time; cold, warm and hot each have a pipe. No pulse anywhere. Each effect fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film: the module's own `build.py` and `quiet.py`, the agent films' `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/data-that-moves/2-hot-warm-cold/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error; places, dissolves, arms and people's edges too
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/hot-warm-cold.mp4
```

`build.py` stops if two files declare the same top-level name, if a key is named twice in one object, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/hot-warm-cold/`, with the Spanish captions (as `captions.es.js`), and draws the poster, `site/assets/hot-warm-cold-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `repo` links the example project's files for each chapter and whose `elsewhere` links the official docs. "Pause and think" is `site/assets/hot-warm-cold/think.en.js` and `think.es.js`: it stops after `cold`, `warm` and `hot`, with one question each. The worked example the film shows is in the example project, [`examples/hot-warm-cold/`](../../../analytics-engineering/project/examples/hot-warm-cold/), for Databricks only. The release workflow renders the video, `hot-warm-cold.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
