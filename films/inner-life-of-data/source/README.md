# Rebuilding the film

Everything in *The Inner Life of Data* is generated from code: the pictures (a canvas animation engine in `src/`), the narration (a synthetic voice) and the music and sound effects (synthesised in `tools/audio.py`, placed on the story's cues).

## Setup

- Python 3.10 or later: `pip install -r requirements.txt`, then `playwright install chromium`.
- The Kokoro voice model files `kokoro-v1.0.onnx` and `voices-v1.0.bin`, from the [kokoro-onnx model release](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0), saved in `models/`.

## Steps

1. `python tools/tts.py` generates each narration line into `build/vo/` and writes the timings to `src/vodur.js`. Lines that already exist are skipped, so delete a line's file to re-voice it.
2. `python tools/build.py` builds `dist/render.html` (used for rendering) and `dist/film.html` (the player).
3. `python tools/audio.py` mixes narration, music and effects into `build/mix.wav` and `dist/soundtrack.mp3`.
4. `python tools/build.py` again, to embed the soundtrack in the player.
5. `python tools/render.py` renders 1080p frames at 30 fps and writes `dist/inner-life-of-data.mp4`. It renders in resumable chunks and takes about 20 minutes on one CPU core.

## Other languages

Set `FILM_LANG` to build another language, for example Latin American Spanish: `FILM_LANG=es python tools/tts.py`, then the same steps 2 to 5, each with `FILM_LANG=es`. Output goes to `build/es/` and `dist/es/`.

A language lives in `src/i18n/<lang>/`:

- `narration.js`: the narration, with the same line ids as the English, so the film re-times itself to the new voice.
- `voice.json`: the Kokoro voice, language and speed, plus `say` rules that respell words for the voice only (for example product names).
- `strings.js`: the on-screen text, as English → translation pairs, plus pattern rules for text built from numbers. `src/i18n.js` swaps every string drawn on the canvas, so boxes size to the translated text; check the frames for text that no longer fits.

## Editing

- Narration lives in `src/narration.js`. The film re-times itself to the voice, so after changing a line, re-run steps 1 to 5.
- Scenes live in `src/scA.js` to `src/scD.js`; shared visual components are in `src/style2.js` and `src/ui3.js`.
- `src/logos.js` embeds the official Databricks and dbt logos, unaltered, to identify those products (see `NOTICE.md` at the repository root).
