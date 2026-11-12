# Rebuilding How long, and then what

*How long, and then what*, film 2 of 5 of *Kept for a reason*, the last series of the module *Data protection and privacy*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, two files of the agent films' kit, and the module's look and tools in [`../../../locks-before-the-data/shared/`](../../../locks-before-the-data/shared/), whose [README](../../../locks-before-the-data/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `hl_` or `HL_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`how-long-and-then-what`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (chapter `schedule`, at `signed`), the words the voice respells (Jun, "A I", HR, Yusuf Demir, Yusuf, Mei, Linh, Nguyen) and its opening story (`flood`, `before`). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, and the film's wordless moments, such as the title card and the end card. |
| `src/hl_past.js` | The opening's places, each painted once in the module's night light: a petrol sky, cool stone, warm windows and lamps. |
| `src/hl_open.js` | What the opening draws over its places: transfer boxes piling up, typed sheets and lists, a building in section, the Archives filling with drawers, and the Act and its schedule with their stamps. |
| `src/hl_uni.js` | The module's hall with the film's own lights: the platform as a block of clear glass whose shelves become glass drawers once the schedule labels them, the three stages of a record, the retention schedule, Linh's contracts and their end dates, a drawer under a hold, and a record's line through time. |
| `src/scenes.js` | The seven chapters, shot by shot, on the module's camera and shots. Every moment is timed to a line's start or to a word in it (`wAt()`), so the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a filing cabinet's steel drawers, each tuned and struck softly, and a euphonium, both made here. The mark is a short phrase in which each note is damped at its own set time, and the last is left to ring: each record ends at its date, and the few kept for good ring on. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/kept-for-a-reason/2-how-long-and-then-what/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, and nothing shows twice or jumps where the shot changes
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python ../../../../site-tools/fits.py   # every piece of text inside its box, and the captions on a phone
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/how-long-and-then-what.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/how-long-and-then-what/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/how-long-and-then-what-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film how-long-and-then-what-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/how-long-and-then-what/think.en.js` and `think.es.js`: it stops after `schedule`, `clock` and `hold`, with one question each. The release workflow renders the video, `how-long-and-then-what.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
