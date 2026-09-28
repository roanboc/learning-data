# Rebuilding Older than the systems

*Older than the systems*, a film in the series *From words to data*, on why the concepts outlive every system, is generated from code like the series' other films. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams, the series' characters, *Silent change*'s components and the series' own components (`../../shared/src/words.js`). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files and the moment its poster shows. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/breath.js` | The few longer pauses. Every sentence already gets a beat of 0.8 s from `narration.js`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/older.js` | This film's components: the museum's exhibits (a clay school tablet, a guild's lock, an examination scroll, a licence under a wax seal, a diploma, a transcript, a digital badge, a signed credential), drawn with organic edges and a slow light; the conceptual model; the system cards with their own models; the vendor's box; the ring, the hub and the lost spacecraft; the learner's records and the code list; the logical model and the yardstick. It also holds `LV`, the pictures of the labs and scenarios, which take every word they draw from the page's words (`FW.vis`). |
| `src/scenes.js` | The eight chapters. The title is part of the first one, the end card part of the last. |
| `tools/score.py` | The film's music and sounds, played with the series' instruments (`../../shared/tools/music.py`). |
| `tools/*.py` | Thin wrappers that run the series' tools (`../../shared/tools/`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/from-words-to-data/2-older-than-the-systems/source/`:

```
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every 0.1 s must draw without an error
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2]   # review stills in build/stills/
python tools/audio.py      # dist/soundtrack.mp3, from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
python tools/render.py --workers 4   # optional: dist/older-than-the-systems.mp4
```

The narration is voiced once with `python tools/tts.py`; it reuses a line's file in `build/vo/` if it exists, so after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) before voicing again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/older-than-the-systems/`, and draws the poster (`site/assets/older-than-the-systems-poster.jpg`, 1280×720, at the moment `film.json` names: the table of five exhibits with every part lit). Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds.

The labs and scenarios live beside the player: `learn.en.js`, `learn.es.js` (the words, including `vis`, the words the pictures draw) and `think.en.js`, `think.es.js` (Pause and think, at the ends of `model`, `meet`, `person` and `logical`). They use the progress prefix `ld-older-than-the-systems`. The labs' "Watch this part" buttons find their chapter by id (`model`, `person`, `logical`).

A change to a shared component (`../../shared/src/words.js`, *The Inner Life of Data*'s engine, *A Sharper Sketch*'s `sketch3.js`, the characters or *Silent change*'s `silent.js`) also changes this film: run `tools/check.py` here, then build and publish again.
