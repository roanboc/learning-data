# Rebuilding No secret to lose

*No secret to lose*, film 2 of 9 of *Locks before the data*, the first series of the module *Data protection and privacy*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, and draws with the module's kit, *Night glass* ([`../../shared/`](../../shared/README.md)), whose README says how a film uses it. Only what is new in this film lives here, and every name it declares starts with `ns_` or `NS_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`no-secret-to-lose`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (chapter `ladder`, at `goal`), the words the voice respells (Okafor, Jun, Mei, "A I", HR), its opening story (`city`, `bank`) and the chapters where the score may pulse (`city`). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, and the film's wordless moments, such as the title card and the end card. |
| `src/ns_city.js` | The opening's places in London's City in 1990, each painted once in the module's night light. |
| `src/ns_bank.js` | The Bank's long wall from the street, its vault behind a round door, and a back office with a screen of 1990; what moves or changes is drawn live. |
| `src/ns_kit.js` | The film's places in the module's hall, with the university's data platform as a tall block of clear glass with one lit door; the nightly job's badge and the sealed card clipped to it. |
| `src/ns_ladder.js` | The ladders: the ways a job proves who it is, from worst to best, by who holds a secret and for how long, and the same for people, rungs of frosted glass, worst at the bottom. |
| `src/ns_things.js` | Drawn live: a phone and its screen, a fake page and the real one, the face and fingerprint that unlock a passkey, the build service, the faces behind a shared account, and a number moved to a thief's phone. A secret is only ever a sealed card. |
| `src/scenes.js` | The seven chapters, shot by shot, on the module's camera and shots. Every moment is timed to a line's start or to a word in it (`wAt()`), so the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: an English concertina and a prepared piano, both made here. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/locks-before-the-data/2-no-secret-to-lose/source/`:

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
python tools/render.py --workers 4   # dist/no-secret-to-lose.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/no-secret-to-lose/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/no-secret-to-lose-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film no-secret-to-lose-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. The release workflow renders the video, `no-secret-to-lose.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
