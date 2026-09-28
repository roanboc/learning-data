# Rebuilding That's not quite right

*That's not quite right*, one of the two films on the Making of page, is generated from code like every Learning Data film. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, and the components of [*Data for Films*](../../1-data-for-films/source/README.md): the embedded *Inner Life of Data*, which draws its real frames live, code panels, browser windows and the scene helpers.

| File | What it holds |
|---|---|
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/breath.js` | The few longer pauses. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/process.js` | This film's components: the two lanes (the author's, warm, and Claude's, cool) and the messages between them, message bubbles, the analogy cards, renamed products, the timeline that re-times itself, and the crow's foot. It loads the pictures in `art/`. |
| `src/scenes.js` | The nine chapters. The title is part of the first one. |
| `art/` | Small copies of pictures from the making of, embedded in the player by `build.py`: the style boards, a first-cut frame and two style frames (from `site/journey/img/`), and the three later films' posters (from `site/assets/`). |
| `tools/` | The tools of *Data for Films*. `lang.py` also finds its components, in `../../1-data-for-films/source/src/`. |

## Render the video

Set up once as in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md), then run from this folder, `films/making-of/2-the-process/source/`:

```
python tools/tts.py
python tools/build.py
python tools/audio.py
python tools/build.py
python tools/check.py
python tools/render.py --workers 4
```

The video is `dist/thats-not-quite-right.mp4`. `python tools/pace.py` reports the pacing, and `python tools/captions.py` writes `../captions/en.srt` and `en.vtt`.

## Publish

The film plays at the top of the Making of page, after *Data for Films*. Like it, its player is sealed in a function and finds its elements by the prefix `nqr-`, so both films can play on one page.

```
cp dist/film.js ../../../../site/assets/making-of/thats-not-quite-right.js
cp dist/soundtrack.mp3 ../../../../site/assets/making-of/thats-not-quite-right.mp3
```

Then commit, merge, and run *Render and release the films*. A change to `../../1-data-for-films/source/src/frames.js`, or to *The Inner Life of Data*'s source, also changes this film: build and copy it again.
