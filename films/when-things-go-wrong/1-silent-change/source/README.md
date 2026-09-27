# Rebuilding Silent change

*Silent change*, the first episode of *When things go wrong*, is generated from code like *The Inner Life of Data* and *A Sharper Sketch*. It shares the first film's engine, components, fonts and voice model, and draws its people with the series' [character sheet](../../characters/README.md). Only what is new lives here:

| File | What it holds |
|---|---|
| `src/narration.js` | The narration, one line per id, following the chapters of [the story](../story.md). The film re-times itself to the voice. |
| `src/breath.js` | The few longer pauses. Every sentence already gets a beat of 0.8 s from `narration.js`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/silent.js` | This episode's components: rooms at dawn, messages, the dashboard with its banner, video-call tiles, the lineage and its red thread, the quarantine tray, the sketch, the data contract and the platform in one row. |
| `src/scenes.js` | The eleven chapters. The title is part of the first one. |
| `src/page.html` | The standalone player page. |
| `tools/` | The first film's tools, pointed at this episode. `lang.py` finds the shared source in `../../../inner-life-of-data/source/` and the characters in `../../characters/`. |

## Setup (once)

Follow the setup in [the first film's build guide](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the first film's `models/`, so one download serves every film.

## Render the video

Run from this folder, `films/when-things-go-wrong/1-silent-change/source/`:

```
python tools/tts.py
python tools/build.py
python tools/audio.py
python tools/build.py
python tools/check.py
python tools/render.py --workers 4
```

The video is `dist/silent-change.mp4`, and `dist/film.html` is a standalone player with the soundtrack embedded. `python tools/pace.py` reports the pacing, and `python tools/captions.py` writes `../captions/en.srt` and `en.vtt`.

## Pace and sound

The episode follows the pacing feedback on the first film and *A Sharper Sketch*: it flows at about 130 words a minute, with a beat of 0.8 s after every sentence, no stops over 2.5 s inside a chapter, and three wordless moments in all (the title, the sketch gaining its new status, and the ending). The characters' messages are read by the narrator as they appear, so nobody has to stop and read.

The music is the episode's own: soft pads and a sparse felt piano in A minor while something is wrong, a quiet low pulse while Sam investigates, and a warm C major from the fix onwards. It sits under the voice and lifts about 4 dB in pauses, slowly, as the first film's [pacing review](../../../inner-life-of-data/pacing-review.md) recommends.

A change to a shared component in `../../../inner-life-of-data/source/src/` or to `../../characters/people.js` also changes this episode: run `tools/check.py` here after changing one.
