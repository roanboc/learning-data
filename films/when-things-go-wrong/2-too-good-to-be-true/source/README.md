# Rebuilding Too good to be true

*Too good to be true*, a film in the series *When things go wrong*, on data quality checks, is generated from code like [*Silent change*](../../1-silent-change/source/README.md). It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *Silent change*'s components (the dashboard in the style of Databricks, messages, video-call tiles, the clock chip) and the series' [character sheet](../../characters/README.md). Only what is new lives here:

| File | What it holds |
|---|---|
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/breath.js` | The few longer pauses. Every sentence already gets a beat of 0.8 s from `narration.js`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/good.js` | This film's components: the gauge (a test on a number, with a warning band and an error band), the number painting, the contract card for applications, row checks, application tiles with IDs, the committee's dashboard, the planner's board, the alert channel and the version panes. The [style frames](../frames/README.md), the site's labs and its scenarios draw with them too. |
| `src/scenes.js` | The eight chapters. The title is part of the first one. |
| `src/page.html` | The standalone player page. |
| `tools/` | The tools of *Silent change*, pointed at this film. `lang.py` also finds *Silent change*'s components in `../../1-silent-change/source/src/`. Before a line is voiced, `pace.py` estimates its length at 171 words a minute, *Silent change*'s voiced rate. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*, so one download serves every film.

## Render the video

Run from this folder, `films/when-things-go-wrong/2-too-good-to-be-true/source/`:

```
python tools/tts.py
python tools/build.py
python tools/audio.py
python tools/build.py
python tools/check.py
python tools/render.py --workers 4
```

The video is `dist/too-good-to-be-true.mp4`, about 55 MB, and `dist/film.html` is a standalone player with the soundtrack embedded. `python tools/pace.py` reports the pacing, and `python tools/captions.py` writes `../captions/en.srt` and `en.vtt`. On four cores, the render takes about eight minutes.

`tts.py` reuses a line's voice file in `build/vo/` if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) before voicing again.

## Publish

The film plays on the site at `site/when-things-go-wrong/too-good-to-be-true/`, with its labs at `labs/` and its scenarios at `scenarios/`, and on Spanish pages around the English film at `site/es/when-things-go-wrong/too-good-to-be-true/`.

1. **Build.** Run the steps above up to `check.py`, then `python tools/captions.py`. The site needs the player and the soundtrack, not the video.
2. **Copy the player and the soundtrack into the site:**

   ```
   cp dist/film.js ../../../../site/assets/too-good-to-be-true/film.js
   cp dist/soundtrack.mp3 ../../../../site/assets/too-good-to-be-true/soundtrack.mp3
   ```

   Never edit the site's copy by hand. The release workflow ([`.github/workflows/release.yml`](../../../../.github/workflows/release.yml)) builds `dist/film.js` from the committed source (`tts.py --keep-timings`, then `build.py`) and stops unless it is byte for byte the same as `site/assets/too-good-to-be-true/film.js`. The labs and scenarios load the same file, for the gauge and the tiles, so a change to `good.js` needs this copy too.
3. **Spanish captions.** The Spanish page shows this English film with Spanish captions, from `src/i18n/es/captions.js`: each English narration line, exactly as in `src/narration.js`, and its caption. After changing a line, update its entry, run `FILM_LANG=es python tools/captions.py` (it writes `../captions/es.srt` and `es.vtt`, and stops if a line has no caption), and copy the file into the site:

   ```
   cp src/i18n/es/captions.js ../../../../site/assets/too-good-to-be-true/captions.es.js
   ```

   `site-tools/check_site.py` checks that the copy matches, and that the Spanish page loads it before the film.
4. **The poster.** `site/assets/too-good-to-be-true-poster.jpg`, 1280×720, is the three Tuesdays side by side, from chapter 4, without captions: open `dist/render.html` in Playwright, wait for `window.__READY__`, set `CAPS_ON=false`, and `renderAt(seconds, 0.95)` returns that frame as a 1920×1080 JPEG data URL; resize it to 1280×720.
5. **Progress.** The pages use the prefix `ld-too-good-to-be-true`: `section#watch` and the stepper for "watched", the labs for `visited`, and the scenarios for `quiz`. Keep this prefix: visitors' progress is stored under it.
6. **If a chapter changes:** the player lists the chapters from `SCENES` by itself. By hand, update the Spanish chapter names in `site/es/when-things-go-wrong/too-good-to-be-true/index.html` and in `site-tools/smoke.py` (by scene id), the "Pause and think" questions in `site/assets/too-good-to-be-true/think.en.js` and `think.es.js` (they stop after `night`, `tuesdays`, `level` and `reload`), and the chapter table in [the series README](../../README.md). The labs' "Watch this part" buttons find their chapter by id (`level`, `thread`, `reload`), in `learn.en.js` and `learn.es.js`.
7. **The video.** Commit and merge, then run *Render and release the films* in the Actions tab. It renders every film, and publishes `too-good-to-be-true.mp4` and `too-good-to-be-true.en.srt` with the others.

## Pace and sound

The film follows the series' pace: about 130 words a minute, a beat of 0.8 s after every sentence, no stops over 2.5 s inside a chapter, and four wordless moments (the title, the three Tuesdays side by side, the two cards in *Choosing the level*, and the ending). The characters' messages are read by the narrator as they appear.

The music is the film's own, from the series' palette: a bright C major for the committee's good news, which freezes into A minor; a quiet low pulse while the total rises and while Sam follows the thread; the third Tuesday and the fix resolve to a warm C major. It sits under the voice and lifts about 4 dB in pauses, slowly.

A change to a shared component in `../../../inner-life-of-data/source/src/`, to `../../../a-sharper-sketch/source/src/sketch3.js`, to `../../1-silent-change/source/src/silent.js` or to `../../characters/people.js` also changes this film: run `tools/check.py` here after changing one, then build and copy the player again (see Publish), or the release stops.
