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
| `tts.py` | Voices each narration line into `build/vo/` and writes the timings to `src/vodur.js`. Lines that already exist are skipped, so delete a line's file to re-voice it. |
| `build.py` | Builds `dist/render.html` (used for rendering), `dist/film.html` (a standalone player, with chapters, captions and full screen) and `dist/film.js` (the same player code, which the site loads). |
| `audio.py` | Mixes narration, music and effects into `build/mix.wav` and `dist/soundtrack.mp3`. |
| `build.py` again | Embeds the soundtrack in the player. |
| `render.py` | Renders 1080p frames at 30 fps and writes the MP4. |

About `render.py`:

- **Speed.** `--workers` sets how many browsers render at the same time. Use about one per CPU core. With 4 workers, a film takes about 7 minutes; with 1 (the default), about 20 to 25.
- **Resuming.** It renders in chunks of 20 seconds. If it stops, run it again and it continues from the finished chunks. After you change the film and run `build.py`, it starts again from scratch on its own.
- **Quality.** H.264 at CRF 18, AAC audio at 192 kbps, loudness normalised to -16 LUFS for the web. The file is about 150 MB, which LinkedIn and most platforms accept as it is.

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
3. **The videos.** Upload them to a GitHub release (Releases → Draft a new release), named exactly `inner-life-of-data.mp4` and `inner-life-of-data.es.mp4`. The site's download buttons point to these names in the latest release. Don't commit videos to the repository: GitHub rejects files over 100 MB, and the release keeps clones small.

## Other languages

A language lives in `src/i18n/<lang>/`, and `FILM_LANG=<lang>` builds it into `build/<lang>/` and `dist/<lang>/`:

- `narration.js`: the narration, with the same line ids as the English, so the film re-times itself to the new voice.
- `voice.json`: the Kokoro voice, language and speed, plus `say` rules that respell words for the voice only (for example product names).
- `strings.js`: the on-screen text, as English → translation pairs, plus pattern rules for text built from numbers, and the player's Play and Pause labels. `src/i18n.js` swaps every string drawn on the canvas, so boxes size to the translated text.
- `page.json`: the player page's text, as English → translation pairs.

To add a language, copy `src/i18n/es/`, translate the four files, and run the steps with the new `FILM_LANG`. Then look at frames from every scene: text in fixed-size boxes (the phone, the Genie question bubble, the knowledge cards and the chart captions) may need shorter wording. For the site, add pages under `site/<lang>/` next to `site/es/`, and a link in each page's language toggle.

## Editing

- Narration lives in `src/narration.js` (and `src/i18n/<lang>/narration.js`). The film re-times itself to the voice, so after changing a line, run the steps again.
- Scenes live in `src/scA.js` to `src/scD.js`; shared visual components are in `src/style2.js` and `src/ui3.js`. The site's labs (`site/assets/learn/`) draw with these same components, so a change here also shows up there: check the labs after changing a component's signature.
- The player sets `window.FILM` (`ready`, `seek`, `play`, `pause`, `playScene`, `sceneStart`), which the site uses for its "Watch this part" buttons.
- `src/logos.js` embeds the official Databricks and dbt logos, unaltered, to identify those products (see `NOTICE.md` at the repository root).
- `fonts/` holds Manrope and IBM Plex Mono (SIL Open Font License 1.1, see the `OFL-*.txt` files there).
