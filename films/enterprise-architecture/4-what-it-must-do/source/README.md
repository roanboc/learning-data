# Rebuilding What it must be able to do

*What it must be able to do*, film 4 of 11 of *The map before the data* (a working title), is generated from code like *Day one*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/`](../../shared/src/), which this film draws on: the strategy layer's amber, the capability glyph and the level-1 map's boxes (`archEl`, `archGlyph` and `sticky` in `ea.js`), and the business owners (`people.js`: Grace, Farah and Ama). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Tomás, Farah, Ama, chasqui, Inca), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the road fading into the title, the map's depth fading out under "just enough", and the end card. |
| `src/plan.js` | This film's pictures (prefixed `d4_`): the road of the Andes in marker, its five relay posts, the message and the runner's band that changes at each post; the capability notes, which are paper while they're drafts and glass once confirmed; the heat map's colours, key and bar; a faint level; and a link line. |
| `src/scenes.js` | The ten chapters, and the map's places: level 1 along the top, level 2 under its parents, level 3 as a stack under *manage outages*. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a lute over a drone for the Andes, then nylon-string plucks, a soft flute and warm pads in G major, and the series' mark, 1-3-5-8, at the title and the end. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

As for [*Day one*](../../1-day-one/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model in `models/`.

## Rebuild

Run from this folder, `films/enterprise-architecture/4-what-it-must-do/source/`:

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
python tools/render.py --workers 4   # dist/what-it-must-do.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

Not on the site yet. When it is, `python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/what-it-must-do/`, with the Spanish captions, and draws the poster at the moment `film.json` names; the series' pages then come from a `series.json` and a `site.json`, as for the other series.
