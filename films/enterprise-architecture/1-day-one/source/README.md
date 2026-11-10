# Rebuilding Day one

*Day one*, the opening film of *The map before the data* (a working title), is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, *In the weeds of data crafting*'s motion helpers and finishing pass, and the series' own in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Tomás, Domesday), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and three wordless moments (the Domesday Book and the title, the wall half paper and half glass, and the end card). |
| `src/plan.js` | This film's pictures (prefixed `d1_`): the map of England, washed in county by county except the far north and Wales; the Domesday entry and the book; the utility's region at night; the pile of day one (a badge, an org chart, 140 systems, an invitation, a process manual, a strategy slide); jigsaw pieces; the methods' glyphs and cards; and a bill. |
| `src/scenes.js` | The ten chapters. The title card ends chapter 1, the end card chapter 10. Every shot drifts, and things arrive with a spring. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a lute over a low drone for 1085, nylon-string plucks and a soft flute over warm pads in A major for the present, and the series' mark, 1-3-5-8, at the title and the end. Nothing loops, and each effect (a knock, paper, a quill, a muffled key, a low felt note, a soft thud) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/enterprise-architecture/1-day-one/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py    # every piece of text must read on a phone (28 px or more in the frame, or marked as decoration)
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 960   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/day-one.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/day-one/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/day-one-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and each film's `site.json` (the words of its pages and its Spanish chapter names). "Pause and think" is `site/assets/day-one/think.en.js` and `think.es.js`: it stops after `pieces`, `looking` and `data`, with one question each. The films have no labs or scenarios yet, so their questions link to none. Progress is stored in the browser under `ld-day-one`. The release workflow renders the video, `day-one.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
