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

## Editing

- Narration lives in `src/narration.js`. The film re-times itself to the voice, so after changing a line, re-run steps 1 to 5.
- Scenes live in `src/scA.js` to `src/scD.js`; shared visual components are in `src/style2.js` and `src/ui3.js`.
- `src/logos.js` embeds the official Databricks and dbt logos, unaltered, to identify those products (see `NOTICE.md` at the repository root).
