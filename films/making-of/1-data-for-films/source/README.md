# Rebuilding Data for Films

*Data for Films*, one of the two films on the Making of page, is generated from code like every Learning Data film. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, and it also carries *The Inner Life of Data* itself, so it can stop that film at 2:31 and read the real numbers of its pixels.

| File | What it holds |
|---|---|
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/breath.js` | The few longer pauses. Every sentence already gets a beat of 0.8 s from `narration.js`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/frames.js` | This film's components: the embedded frame and its pixels, the pixel zoom, code panels (simplified, and the real source of the films' own functions, read with `toString()` so it can never drift from what runs), the canvas stage and the rasterised edge, the tile in five layers, glows, the colour channels, a platform to fly over, the time slider and curves, and the pieces of *Two ways to play*. |
| `src/scenes.js` | The nine chapters. The title is part of the first one. |
| `src/page.html` | The standalone player page. |
| `tools/build.py` | Builds the player. It seals *The Inner Life of Data*'s English source (`../../../inner-life-of-data/source/src/`) inside one function, `ILD`, so its names don't meet this film's, and adds a hook to the engine so the page is ready only once that film's pictures and logos are. |
| `tools/` | The other tools of *Too good to be true*, pointed at this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Render the video

Run from this folder, `films/making-of/1-data-for-films/source/`:

```
python tools/tts.py
python tools/build.py
python tools/audio.py
python tools/build.py
python tools/check.py
python tools/render.py --workers 4
```

The video is `dist/data-for-films.mp4`, and `dist/film.html` is a standalone player with the soundtrack embedded. `python tools/pace.py` reports the pacing, and `python tools/captions.py` writes `../captions/en.srt` and `en.vtt`.

`tts.py` reuses a line's voice file in `build/vo/` if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) before voicing again.

## Publish

The film plays at the top of the Making of page, `site/journey/`, and on its Spanish twin, `site/es/journey/`, with Spanish chapter names around the English film.

1. **Build.** Run the steps above up to `check.py`, then `python tools/captions.py`.
2. **Copy the player and the soundtrack into the site:**

   ```
   cp dist/film.js ../../../../site/assets/making-of/data-for-films.js
   cp dist/soundtrack.mp3 ../../../../site/assets/making-of/data-for-films.mp3
   ```

   Never edit the site's copy by hand: the release workflow builds `dist/film.js` from the committed source and stops unless it is byte for byte the site's copy.
3. **Spanish captions.** The Spanish page shows this English film with Spanish captions, from `src/i18n/es/captions.js`: each English narration line, exactly as in `src/narration.js`, and its caption. After changing a line, update its entry, run `FILM_LANG=es python tools/captions.py` (it writes `../captions/es.srt` and `es.vtt`, and stops if a line has no caption), and copy the file into the site:

   ```
   cp src/i18n/es/captions.js ../../../../site/assets/making-of/data-for-films.captions.es.js
   ```

   `site-tools/check_site.py` checks that the copy matches, and that the Spanish page loads it before the film.
4. **The video.** Commit and merge, then run *Render and release the films* in the Actions tab. It publishes `data-for-films.mp4` and `data-for-films.en.srt` with the others.

## When The Inner Life of Data changes

This film draws *The Inner Life of Data* as it is in `../../../inner-life-of-data/source/src/`. A change there (a new scene, new timings, a renamed product) can change the frame at 2:31, and so the numbers this film reads from it, the pixel it dives into (`FOCUS` in `frames.js`), and the sizes in chapter 8. After such a change: build, run `check.py`, look at the stills of chapters 1, 2 and 9, check the figures in the script's rigour sheet, and copy the player again.
