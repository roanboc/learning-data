# Rebuilding Rights follow the role

*Rights follow the role*, film 4 of 7 of *From helper to colleague*, the last series of the module *AI agents in data work*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, and the module's own look in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/): the lab, its people, the agent, the cards, and the finishing pass ([`../../../what-an-agent-is/shared/README.md`](../../../what-an-agent-is/shared/README.md) says what each file holds). Only what is new in this film lives here, and every name it declares starts with `rf_` or `RF_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`rights-follow-the-role`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (chapter `steps`, at `exactly`), the words the voice respells (Jun, "A I", Noor, Mei), its opening story (`ward`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, and the film's wordless moments, such as the title card and the end card. |
| `src/rf_past.js` | The opening's hospitals, painted full-frame in the module's matte way with a palette of their own: pale green walls, white enamel, glass, linoleum and daylight from tall windows on the right. |
| `src/rf_lab.js` | Where things stand in the module's lab, and the film's pieces there: the planning agent and its badge, Jun's helper (only in a later moment, never beside it), and the seven steps of changing a data product along the lower wall. |
| `src/scenes.js` | The seven chapters, shot by shot, on the module's camera and shots. Every moment is timed to a line's start or to a word in it (`wAt()`), so the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: brake drums struck softly and damped at once, and a prepared instrument, both made here. The mark is three prepared notes, one for each of the planning agent's steps, then one damped stroke where its steps end: nothing sounds that wasn't prepared. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/from-helper-to-colleague/4-rights-follow-the-role/source/`:

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
python tools/render.py --workers 4   # dist/rights-follow-the-role.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/rights-follow-the-role/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/rights-follow-the-role-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film rights-follow-the-role-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/rights-follow-the-role/think.en.js` and `think.es.js`: it stops after `borrowed`, `reads` and `change`, with one question each. The release workflow renders the video, `rights-follow-the-role.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
