# Rebuilding Read often, kept close

*Read often, kept close*, film 4 of 4 of *Data that moves*, the first series of the module *Modern data basics*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, and draws with the module's kit, the platform map drawn up close: its map, its people, its cards and the tools' pages, in [`../../shared/src/`](../../shared/src/), bundled as they are. Only what is new in this film lives here, each name with the prefix `rk_` (or `RK_` for its tables):

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the line on what the colours mean, its own source files, the opening story (`story`: *The seed vault*), no chapter where the score may pulse (`urgent` is empty), the words the voice respells (Svalbard, Noor, Linh, and "HR" said as letters), the official logos it draws (`logos`), and the moment its poster shows (the tiers' costs, in *Read often, or rarely*) |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The longer pauses after a line (`hold`), where an idea or a picture needs a moment, and the two wordless moments: the title card after the opening story, and the end card. |
| `src/rk_look.js` | The film's own tints (a cool white for frost, snow, and the seeds' straw) and the helpers every chapter uses: the vault's halls and boxes drawn live so they can light, pins and arcs on the globe and the seeds that travel them, the storage tiers as a table (`rk_tiers`), the pay records' years as blocks of files, a storage shelf, frost laid over it, cards and tags |
| `src/rk_places.js` | The film's places, painted once: a globe of the North from Svalbard to the Mediterranean, its land kept as bits read from NOAA's GLOBE data (see `NOTICE.md`), with the vault, Aleppo, Terbol and Rabat placed on it; the vault cut open in the polar night, its tunnel and three halls; and a field at first light, for the seeds sown in Lebanon and Morocco |
| `src/scenes.js` | The five chapters, each a few shots under a slow camera, gliding on in one room and cut or dissolved between rooms. The title card ends chapter 1, the end card chapter 5. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line: *la bóveda* for the vault, *bancos de germoplasma*, the tiers as *caliente*, *templado*, *frío* and *archivo*, *el nivel de archivo*, and *los registros de pago* for the pay records |
| `tools/score.py` | The film's music and sounds: a pyrophone, the fire organ of the 1870s, made here, its note swelling in as a tube's air heats, holding, and fading as it cools; its own low tubes, E 2 to B 3, as the partner (made for *Hot, warm, cold* on 5 November 2026, and kept with the seed vault). E major, C sharp minor for the problem, tuned pure from E. The mark is a note that sounds while its tube is hot, softer as it cools and silent when cold. No pulse anywhere. Each effect fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both |
| `tools/` | Each other tool runs the module's tool (`../../shared/tools/run.py`) on this film: the module's own `build.py` and `quiet.py`, the agent films' `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/data-that-moves/4-read-often-kept-close/source/`:

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
python tools/render.py --workers 4   # dist/read-often-kept-close.mp4
```

`build.py` stops if two files declare the same top-level name, if a key is named twice in one object, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/read-often-kept-close/`, with the Spanish captions (as `captions.es.js`), and draws the poster, `site/assets/read-often-kept-close-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `repo` links the example project's files for each chapter and whose `elsewhere` links the official docs. "Pause and think" is `site/assets/read-often-kept-close/think.en.js` and `think.es.js`: it stops after `tiers`, `records` and `years`, with one question each. The worked example the film shows is in the example project, [`examples/hot-warm-cold/`](../../../analytics-engineering/project/examples/hot-warm-cold/), for Databricks only. The release workflow renders the video, `read-often-kept-close.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
