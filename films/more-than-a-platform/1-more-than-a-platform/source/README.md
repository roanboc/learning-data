# Rebuilding More than a platform

*More than a platform*, the film that follows *The Inner Life of Data*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/) and the look of *Modern data basics* in [`../../../data-that-moves/shared/`](../../../data-that-moves/shared/README.md), unchanged.

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the whole route, as the last station is named), the words the voice respells (AI, dbt, DAMA), its opening (`beyond`), where music may play throughout, and the product marks it draws (`logos`). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, which keep every chapter at or under 140 words a minute, and two wordless moments: the title card after the opening, and the end card. |
| `src/mp_draw.js` | The film's own pictures: the learning route as the Topics page draws it (`mp_route`, with its stations, names and groups), the opening's four places, a code card and a boxes card, the author's roles on a timeline, the project's folder tree with its governance folders, a wheel with a hub and ten parts, diagrams turned inward, and the shapes for what a visitor can do. |
| `src/scenes.js` | The eight chapters. The whole film is on the module's map, one room, and the camera never moves: a new moment is a later one (`later:true`), and a chapter opens on what the one before ends on (`ag_cutInto`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: chime bars, made here, as a station's announcement plays them. G major for the route, E minor for the half courses leave out, C major for the foundations and enterprise data architecture, tuned pure from G. Each sound uses the same timing as its picture. |
| `tools/audio_es.py` | The Spanish narration: each Spanish caption read aloud (es-MX-DaliaNeural) from its English line's cue, over the same score, as `soundtrack.es.mp3`. It needs the network for the voice. |
| `tools/` | Each other tool runs the module's tool (`../../../data-that-moves/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/more-than-a-platform/1-more-than-a-platform/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, no word under 28 px, nothing shows twice, nothing jumps
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # words a minute, chapter by chapter
python tools/quiet.py      # the sound, before it's mixed
python tools/audio.py      # mixes voice, music and sounds into dist/soundtrack.mp3
python tools/build.py      # again, so the standalone player carries the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/audio_es.py   # the Spanish narration, into dist/ and the site's assets
python tools/publish.py    # the player, the soundtrack, the Spanish captions and the poster, into the site
python tools/render.py --workers 4      # dist/more-than-a-platform.mp4
```

Then, from the repository's root, `python site-tools/build_series.py` makes its page, and `python .github/scripts/affected.py --run` checks what changed.
