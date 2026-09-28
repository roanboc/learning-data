# Rebuilding What's in a word

*What's in a word*, the film that opens [From words to data](../../README.md), is generated from code like the other Learning Data films. It draws with *The Inner Life of Data*'s engine and components, *A Sharper Sketch*'s diagrams, the series' people and *Silent change*'s components, and with the series' own components in [`../../shared/src/words.js`](../../shared/src/words.js). Its tools are the series' shared tools ([`../../shared/tools/`](../../shared/tools/)); the scripts in `tools/` here run them on this film. Only what is this film's own lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title and subtitle, its own source files, and the moment its poster shows. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/breath.js` | The few longer pauses. Every sentence already gets a beat of 0.8 s from `narration.js`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/whats.js` | This film's pictures: the animals, the baby, the brain's concept cell, the rabbit, the birds, the clay tablet; and `LV`, the pictures its labs and scenarios draw. |
| `src/scenes.js` | The ten chapters. The title is part of the first one. |
| `tools/score.py` | The music and the sound effects, played with the series' instruments (`../../shared/tools/music.py`): a kalimba, a breathy flute, a choir and a frame drum, in D. |

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

The video is `dist/whats-in-a-word.mp4`. `python tools/pace.py` reports the pacing, `python tools/captions.py` writes `../captions/en.srt` and `en.vtt`, and `python tools/stills.py` renders review stills into `build/stills/`. `tts.py` reuses a line's voice file in `build/vo/` if it exists: after changing a line's words, delete its file before voicing again.

## Publish

`python tools/publish.py` copies the player and the soundtrack to `site/assets/whats-in-a-word/` and draws the poster, `site/assets/whats-in-a-word-poster.jpg`. Then run `python site-tools/build_series.py` from the repository root, which makes the film's pages in English and Spanish. Never edit the site's `film.js` by hand: the release workflow builds it from this source and stops unless the site's copy is the same, byte for byte.

The labs and scenarios' words are in `site/assets/whats-in-a-word/learn.en.js` and `learn.es.js`, and the Pause and think questions in `think.en.js` and `think.es.js`; `site/assets/from-words-to-data/learn.js` draws them for every film of the series.

A change to a shared component (in *The Inner Life of Data*, *A Sharper Sketch*, the characters, *Silent change* or `words.js`) also changes this film: build and publish it again, or the release stops.
