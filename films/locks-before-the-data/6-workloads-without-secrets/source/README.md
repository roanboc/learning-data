# Rebuilding Workloads without secrets

*Workloads without secrets*, film 6 of 9 of *Locks before the data*, the first series of the module *Data protection and privacy*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, and draws with the module's kit, *Night glass* ([`../../shared/`](../../shared/README.md)), whose README says how a film uses it. Only what is new in this film lives here, and every name it declares starts with `ws_` or `WS_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`workloads-without-secrets`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (chapter `asked`, at `pass`), the words the voice respells (Okafor, Jun, "A I", HR), its opening story (`copy`, `asks`), no chapter where the score may pulse and `"logos": true` for the logos it shows. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, and the film's wordless moments, such as the title card and the end card. |
| `src/ws_kit.js` | Small things the chapters share: a chapter's moments made once, values that fade in and out at a word, the university's hall with the data platform, the job's badge and card, and Jun's token as a sealed card. |
| `src/ws_car.js` | The opening's places in the Netherlands in the mid-1990s: a street of narrow brick houses at night, the same street at dawn with one car gone, and the steering column's ignition lock. No car has a make or badge. |
| `src/ws_pages.js` | The tools' pages the film draws, named as their docs name them: the identity provider's application, the account console's service principal and its federation policy, the job's settings, the repository and its workflow, and the key vault's secret. |
| `src/scenes.js` | The nine chapters, shot by shot, on the module's camera and shots. Every moment is timed to a line's start or to a word in it (`wAt()`), so the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: jaw harps tuned one to a note, as in Scheibler's aura of 1816, and a soft, low trombone, both made here. The mark is a question and an answer, as the car asks the key's chip. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/locks-before-the-data/6-workloads-without-secrets/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, and nothing shows twice or jumps where the shot changes
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python ../../../../site-tools/fits.py   # every piece of text inside its box, and the captions on a phone
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/workloads-without-secrets.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/workloads-without-secrets/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/workloads-without-secrets-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film workloads-without-secrets-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. The release workflow renders the video, `workloads-without-secrets.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
