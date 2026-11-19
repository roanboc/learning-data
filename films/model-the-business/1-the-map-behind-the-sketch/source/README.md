# Rebuilding The map behind the sketch

*The map behind the sketch*, the film that opens [Model the business](../../README.md), is generated from code like the other Learning Data films. It draws with *The Inner Life of Data*'s engine and components, *A Sharper Sketch*'s diagrams, *From words to data*'s helpers, the people of *When things go wrong*, and the series' own pictures in [`../../shared/src/registers.js`](../../shared/src/registers.js): the story's registers, fields and people. Its tools are the series' ([`../../shared/tools/`](../../shared/tools/): its own `build.py` and `quiet.py`, and *From words to data*'s other tools, used as they are); the scripts in `tools/` here run them on this film. Only what is this film's own lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title and subtitle, how to read it, its own source files, the moment its poster shows, and its opening story's chapters. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/breath.js` | The few longer pauses. Every sentence already gets a beat of 0.8 s from `narration.js`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/map.js` | The university's map, in four parts and their colours: its capabilities (from HERM), its data domains and their owners, its systems of record and the platform's copies, and its glossary; the sketch's five boxes placed on it; the two maps crossed; and a question's way from a ticket to a model. The names are the example project's. |
| `src/scenes.js` | The ten chapters. The title is part of the first one. |
| `src/i18n/es/captions.js` | The Spanish captions: each English narration line, and its caption. |
| `tools/score.py` | The music and the sound effects: a harpsichord for the weft and a bass clarinet for the warp, from F, with nothing borrowed from Chinese music. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model in `films/inner-life-of-data/source/models/`, which every film shares.

## Make it again

From this folder:

```
python tools/tts.py          # the voice, line by line (cached; only changed lines are voiced again)
python tools/build.py        # the player, dist/film.html
python tools/captions.py     # captions/en.srt and en.vtt; FILM_LANG=es for es.srt and es.vtt
python tools/audio.py        # the soundtrack: voice, music and effects, mixed to -16 LUFS
python tools/check.py        # every frame, nothing shown twice, every place timed
python tools/legible.py --overlaps
python ../../../../site-tools/fits.py
python ../../../../site-tools/shots.py
python tools/pace.py
python tools/quiet.py        # the sound, against the site's rules
python tools/stills.py --size 1920
python tools/publish.py      # the player, soundtrack, captions and poster, to site/assets/the-map-behind-the-sketch/
```

Then, from the repository's root, `python site-tools/build_series.py` and `python .github/scripts/affected.py --run`. The video for download is made by the release workflow, which the author starts.
