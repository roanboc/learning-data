# Rebuilding Both at once

*Both at once*, a film in [From words to data](../../README.md) on hybrid databases, is generated from code like the other Learning Data films. It draws with *The Inner Life of Data*'s engine and components (the vaults, the glass, Genie's orb), *A Sharper Sketch*'s diagrams, *Silent change*'s version stamp (for a contract card of its own, drawn in that card's manner), and the series' own components in [`../../shared/src/words.js`](../../shared/src/words.js). Its tools are the series' shared tools ([`../../shared/tools/`](../../shared/tools/)); the scripts in `tools/` here run them on this film. Only what is this film's own lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title and subtitle, its own source files, and the moment its poster shows (the two stores inside one database). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/breath.js` | The few longer pauses: the title, the change log applied in the right order, and the ending. Every sentence already gets a beat of 0.8 s from `narration.js`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/both.js` | The film's pictures. 1879, drawn soft and warm: wood with grain, a brass register with a sheen, bottles, a lamp that flickers, a wall clock, the patent, and the bartender's hand, its sleeve running out of the frame. The present, drawn as crisp glass: a store of rows and a store of columns, the phone, the lakehouse, keys that match rows, change cards, the red ghost, calendar cards, question cards, the freshness scale, a small one-database capsule and the awards' data contract. The moon, the sun and the hourglass. And `LV`, the pictures its labs and scenarios draw, with every word taken from the words pack. |
| `src/scenes.js` | The nine chapters. The title is part of the first one. |
| `tools/score.py` | The music and the sound effects, played with the series' instruments (`../../shared/tools/music.py`): synth-pluck arpeggios at 100 bpm over a soft kick and hi-hat, in E minor, turning to E major at the end, with two interlocking arpeggios (three against two) for the two engines; and, for 1879, a felt-piano oom-pah in C with the cash register's keys, bell and drawer. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model in `films/inner-life-of-data/source/models/`, which every film shares.

## Render the video

From this folder:

```
python tools/tts.py
python tools/build.py
python tools/audio.py
python tools/build.py
python tools/check.py
python tools/render.py --workers 4
```

The video is `dist/both-at-once.mp4`, with no captions on its picture: they ship beside it as `.srt` files. `python tools/pace.py` reports the pacing, `python tools/captions.py` writes `../captions/en.srt` and `en.vtt`, and `python tools/stills.py` renders review stills into `build/stills/`. `tts.py` reuses a line's voice file in `build/vo/` if it exists: after changing a line's words, delete its file before voicing again.

**Spanish captions.** The Spanish page shows this English film with Spanish captions, from `src/i18n/es/captions.js`: each English narration line, exactly as in `src/narration.js`, and its caption. After changing a line, update its entry and run `FILM_LANG=es python tools/captions.py`.

## Publish

`python tools/publish.py` copies the player, the soundtrack and the captions to `site/assets/both-at-once/` and draws the poster, `site/assets/both-at-once-poster.jpg`. Then run `python site-tools/build_series.py` from the repository root, which makes the film's pages in English and Spanish from `../site.json`. Never edit the site's `film.js` by hand: the release workflow builds it from this source and stops unless the site's copy is the same, byte for byte.

The labs and scenarios' words are in `site/assets/both-at-once/learn.en.js` and `learn.es.js` (their `vis` block holds every word the pictures show), and the Pause and think questions in `think.en.js` and `think.es.js`, after the chapters `distance`, `sync`, `doesnt` and `questions`; `site/assets/from-words-to-data/learn.js` draws them for every film of the series. Progress is stored in the browser under `ld-both-at-once`.

A change to a shared component (in *The Inner Life of Data*, *A Sharper Sketch*, the characters, *Silent change* or `words.js`) also changes this film: build and publish it again, or the release stops.
