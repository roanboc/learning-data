# Rebuilding Silent change

*Silent change*, a film in the series *When things go wrong*, on changes and data contracts, is generated from code like *The Inner Life of Data* and *A Sharper Sketch*. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws the sharper conceptual model with *A Sharper Sketch*'s own components, and draws its people with the series' [character sheet](../../characters/README.md). Only what is new lives here:

| File | What it holds |
|---|---|
| `src/narration.js` | The narration, one line per id, following the chapters of [the story](../story.md). The film re-times itself to the voice. |
| `src/breath.js` | The few longer pauses. Every sentence already gets a beat of 0.8 s from `narration.js`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/silent.js` | This film's components: rooms at dawn, messages, Ana's dashboard in the style of Databricks (a KPI card for how full a class is, a bar chart, and an amber note when the data is old), video-call tiles, the lineage and its red thread, the quarantine tray, the sharper conceptual model from *A Sharper Sketch*, the data contract and the platform in one row. |
| `src/scenes.js` | The eleven chapters. The title is part of the first one. |
| `src/page.html` | The standalone player page. |
| `tools/` | The tools of *The Inner Life of Data*, pointed at this film. `lang.py` finds the shared source in `../../../inner-life-of-data/source/`, *A Sharper Sketch*'s components in `../../../a-sharper-sketch/source/src/` and the characters in `../../characters/`. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*, so one download serves every film.

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

## Publish

The film plays on the site at `site/when-things-go-wrong/silent-change/`, and on a Spanish page around the English film at `site/es/when-things-go-wrong/silent-change/`.

1. **Build.** Run the steps above up to `check.py`, then `python tools/captions.py`. The site needs the player and the soundtrack, not the video.
2. **Copy the player and the soundtrack into the site:**

   ```
   cp dist/film.js ../../../../site/assets/silent-change/film.js
   cp dist/soundtrack.mp3 ../../../../site/assets/silent-change/soundtrack.mp3
   ```

   Never edit the site's copy by hand. The release workflow ([`.github/workflows/release.yml`](../../../../.github/workflows/release.yml)) builds `dist/film.js` from the committed source (`tts.py --keep-timings`, then `build.py`) and stops unless it is byte for byte the same as `site/assets/silent-change/film.js`.
3. **The poster.** `site/assets/silent-change-poster.jpg`, 1280×720, is a frame from the first chapter: Ana at 7:58, with her dashboard and its note. It is the page's poster and `og:image`, and the picture on this film's topic cards. If that moment changes, make a new one: open `dist/render.html` in Playwright, wait for `window.__READY__`, and `renderAt(seconds, 0.93)` returns that frame as a 1920×1080 JPEG data URL; resize it to 1280×720.
4. **Progress.** The page's `section#watch` has `data-store="ld-silent-change"`, and the topic cards use `data-progress="ld-silent-change"`. Keep this prefix: visitors' "watched" mark is stored under it.
5. **If a chapter changes:** the player lists the chapters from `SCENES` by itself. By hand, update the Spanish chapter names in `site/es/when-things-go-wrong/silent-change/index.html` (by scene id), the "Pause and think" questions in `site/assets/silent-change/think.en.js` and `think.es.js` (they stop after `night`, `bronze`, `halves` and `contract`), and the chapter table in [the series README](../../README.md). A chapter link uses the chapter's start rounded up, such as `#t=145` for a start at 144.7 s.
6. **The video.** Commit and merge, then run *Render and release the films* in the Actions tab. It renders every film, and publishes `silent-change.mp4` and `silent-change.en.srt` with the others.

## Pace and sound

The film follows the pacing feedback on *The Inner Life of Data* and *A Sharper Sketch*: it flows at about 130 words a minute, with a beat of 0.8 s after every sentence, no stops over 2.5 s inside a chapter, and three wordless moments in all (the title, the sketch gaining its new status, and the ending). The characters' messages are read by the narrator as they appear, so nobody has to stop and read.

The music is the film's own: soft pads and a sparse felt piano in A minor while something is wrong, a quiet low pulse while Sam investigates, and a warm C major from the fix onwards. It sits under the voice and lifts about 4 dB in pauses, slowly, as the [pacing review](../../../inner-life-of-data/pacing-review.md) of *The Inner Life of Data* recommends.

A change to a shared component in `../../../inner-life-of-data/source/src/`, to `../../../a-sharper-sketch/source/src/sketch3.js` or to `../../characters/people.js` also changes this film: run `tools/check.py` here after changing one, then build and copy the player again (see Publish), or the release stops.
