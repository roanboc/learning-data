# Rebuilding the film

Everything in *The Inner Life of Data* is generated from code: the pictures (a canvas animation engine in `src/`), the narration (a synthetic voice) and the music and sound effects (synthesised in `tools/audio.py`, placed on the story's cues). The film exists in English and in Latin American Spanish (*La vida interior de los datos*), built from the same code.

Run every command below from this folder, `films/inner-life-of-data/source/`.

## Setup (once)

1. Python 3.10 or later, then:

   ```
   pip install -r requirements.txt
   playwright install chromium
   ```

2. The Kokoro voice model, about 350 MB, in `models/`:

   ```
   mkdir models
   curl -L -o models/kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
   curl -L -o models/voices-v1.0.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
   ```

The fonts are in `fonts/`, so rendering needs no internet connection. `models/`, `build/` and `dist/` are not committed.

## Render the videos

English:

```
python tools/tts.py
python tools/build.py
python tools/audio.py
python tools/build.py
python tools/render.py --workers 4
```

The video is `dist/inner-life-of-data.mp4`.

Spanish: the same five commands with `FILM_LANG=es` in front of each, for example `FILM_LANG=es python tools/tts.py`. The video is `dist/es/inner-life-of-data.es.mp4`. On Windows PowerShell, run `$env:FILM_LANG="es"` once instead, and `Remove-Item Env:FILM_LANG` to go back to English.

| Step | What it does |
|---|---|
| `tts.py` | Voices each narration line into `build/vo/` and writes the timings to `src/vodur.js`. Lines that already exist are skipped, so delete a line's file to re-voice it. With `--keep-timings` it leaves `vodur.js` alone and fails if a line is more than 0.05 s off it. |
| `build.py` | Builds `dist/render.html` (used for rendering), `dist/film.html` (a standalone player, with chapters, captions and full screen) and `dist/film.js` (the same player code, which the site loads). |
| `audio.py` | Mixes narration, music and effects into `build/mix.wav` and `dist/soundtrack.mp3`. |
| `build.py` again | Embeds the soundtrack in the player. |
| `render.py` | Renders 1080p frames at 30 fps and writes the MP4, with no captions on the picture: they go beside it as `.srt` files (`captions.py`), so platforms and players show the language a viewer picks. |

Before a long render, run `python tools/check.py` (or with `FILM_LANG=es`): it draws every frame the video will (30 a second) on a small canvas, in about a minute, and lists any moment that fails. To check that every word reads on a phone, run `python tools/legible.py --overlaps` (or with `FILM_LANG=es`): it lists text under 28 px in the frame, with the function that drew it, and text that runs off the frame or over other text. To see how dense the narration is, run `python tools/pace.py` (or with `FILM_LANG=es`) after `tts.py`: it reports words per minute, how much of the time the voice speaks, and the longest quiet moment in each chapter, and it flags sentences with no breath after them and long stops inside a chapter. [PLAYBOOK.md](../../../PLAYBOOK.md) explains the targets.

About `render.py`:

- **Speed.** `--workers` sets how many browsers render at the same time. Use about one per CPU core. With 4 workers, a film takes about 7 minutes; with 1 (the default), about 20 to 25.
- **Resuming.** It renders in chunks of 20 seconds. If it stops, run it again and it continues from the finished chunks. After you change the film and run `build.py`, it starts again from scratch on its own.
- **Quality.** H.264 at CRF 18, AAC audio at 192 kbps, loudness normalised to -16 LUFS for the web. The file is about 200 MB, which LinkedIn and most platforms accept as it is.

## Publish

1. **The player.** The film plays on the site's home page, and its labs draw with the same code. Copy the code and the soundtrack of each language into the site:

   ```
   cp dist/film.js ../../../site/assets/film/film.js
   cp dist/soundtrack.mp3 ../../../site/assets/film/soundtrack.mp3
   cp dist/es/film.js ../../../site/assets/film/film.es.js
   cp dist/es/soundtrack.mp3 ../../../site/assets/film/soundtrack.es.mp3
   ```

   `dist/film.html` is a standalone player with the soundtrack embedded, for sharing or watching offline. The old player addresses, `films/inner-life-of-data/` and `es/films/inner-life-of-data/`, now redirect to the home page and keep `#t=` chapter links working.

2. **The captions.** `python tools/captions.py` writes `../captions/en.srt` and `en.vtt`, and `FILM_LANG=es python tools/captions.py` writes the Spanish ones.
3. **The videos.** Commit and merge steps 1 and 2 first. Then, in the Actions tab, run *Render and release the films* ([`.github/workflows/release.yml`](../../../.github/workflows/release.yml)) with a new tag, such as `v2.1`. Leave *films* at `changed` to render only the films whose source changed since the latest release, or set it to `all`, or to keys such as `inner-life-of-data-en,inner-life-of-data-es`. It runs the steps above on GitHub's machines, in about 30 to 45 minutes, and publishes the videos and the `.srt` captions to a release with that tag; the videos it didn't render are copied from the latest release, so every release carries every film. Tick *draft* to watch the videos before the site's download buttons point to them; running again with the same tag replaces its files.

   The workflow keeps the committed timings (`tts.py --keep-timings`), so the video, the site's player and the captions share one timeline. It stops early if a line's voice no longer matches `vodur.js` (run `tts.py` and commit it), or if the site's `film.js` isn't built from this source (do step 1). It also draws every moment first (`check.py`), and puts the pacing report in the run's summary.

   The two Making of films carry this film's English source inside their players (they stop it at 2:31, and draw its frames live), from a frozen copy of its narration, timings, pauses and scenes (`films/making-of/1-data-for-films/source/src/ild/`), so changing those here doesn't change them. They still draw with the shared components and engine (`src/core.js`, `logos.js`, `style2.js`, `ui3.js`, `engine3.js`), as every other film does: after changing one of those, build every film and copy its player, as their READMEs say, or the release stops at their check.

   To publish a video you rendered yourself, upload it to a release (Releases → Draft a new release), named exactly `inner-life-of-data.mp4` or `inner-life-of-data.es.mp4`: the download buttons point to these names in the latest release. Don't commit videos to the repository: GitHub rejects files over 100 MB, and the release keeps clones small.

## Other languages

A language lives in `src/i18n/<lang>/`, and `FILM_LANG=<lang>` builds it into `build/<lang>/` and `dist/<lang>/`:

- `narration.js`: the narration, with the same line ids as the English, so the film re-times itself to the new voice.
- `voice.json`: the Kokoro voice, language and speed, plus `say` rules that respell words for the voice only (for example product names). The voice can be a blend of Kokoro voices, such as `{"ef_dora": 0.4, "af_heart": 0.6}`: the Spanish film blends the Spanish voice with the English narrator's, which sounds more natural than the Spanish voice alone.
- `strings.js`: the on-screen text, as English → translation pairs, plus pattern rules for text built from numbers, and the player's Play and Pause labels. `src/i18n.js` swaps every string drawn on the canvas, so boxes size to the translated text.
- `page.json`: the player page's text, as English → translation pairs.

To add a language, copy `src/i18n/es/`, translate the four files, and run the steps with the new `FILM_LANG`. Then look at frames from every scene: text in fixed-size boxes (the phone, the Genie question bubble, the knowledge cards and the chart captions) may need shorter wording. For the site, add pages under `site/<lang>/` next to `site/es/`, and a link in each page's language toggle.

The other films take a lighter route: captions only. Their `src/i18n/<lang>/captions.js` maps each English narration line to its caption, and a page that loads it before the film (as `CAPTIONS`) gets the same picture, voice and timings, captioned in that language (`src/engine3.js`, `capText`). `FILM_LANG=<lang> python tools/captions.py` then writes that language's `.srt` and `.vtt` from the English timeline.

## Editing

- Narration lives in `src/narration.js` (and `src/i18n/<lang>/narration.js`). The film re-times itself to the voice, so after changing a line, run the steps again.
- Each line that ends a sentence sets its own beat after it (`"gap"` in `src/narration.js`: 0.8 s in English; in `src/i18n/es/narration.js`, 0.8 to 1.1 s, longer in the denser chapters); where a sentence runs on into the next line, the engine leaves 0.3 s (`src/engine3.js`, shared by every film, so its defaults stay as they are). Other pauses live in `src/breath.js`, shared by every language: a `hold` after a line, a `pause` before one, and a wordless `breathe` at the end of a chapter (only the sketch, the people and the end have one), whose picture starts at the scene's `breath` cue. `tools/pace.py` checks the result against the later films' limits.
- Scenes live in `src/scA.js` to `src/scD.js`; shared visual components are in `src/style2.js` and `src/ui3.js`. Every other film draws with these components too, and the site's labs (`site/assets/learn/`) draw with this film's player, so change the scenes, not the components: a scene that needs a variant gets a helper of its own. The film's text is raised to read on a phone by From words to data's `phone.js`, which `src/phonefit.js` keeps to the film's own frame, so the labs keep their sizes.
- The player sets `window.FILM` (`ready`, `seek`, `play`, `pause`, `playScene`, `sceneStart`; `playScene(id, true)` stops at the end of that chapter), which the site uses for its "Watch this part" buttons.
- `src/logos.js` embeds the official Databricks and dbt logos, unaltered, to identify those products (see `NOTICE.md` at the repository root).
- `fonts/` holds Manrope and IBM Plex Mono (SIL Open Font License 1.1, see the `OFL-*.txt` files there).
