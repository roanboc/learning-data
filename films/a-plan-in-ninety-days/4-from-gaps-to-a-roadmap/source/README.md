# Rebuilding From gaps to a roadmap

*From gaps to a roadmap*, film 4 of 4 of *A plan in ninety days*, the first series of the module *Data management*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' shots, and the look and tools the module shares with Leading data people, in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/), whose [README](../../../the-new-skills/shared/README.md) says how a film uses them. Its title and end cards draw the module's mark, `dm_mark`, from [`../../shared/src/mark.js`](../../shared/src/mark.js). Only what is new in this film lives here, and every name it declares starts with `gr_` or `GR_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`from-gaps-to-a-roadmap`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (chapter `stages`, at `rail`), the words the voice respells (Zürich, TOGAF, ArchiMate, Novak, HR, Noor, Jun, "A I"), its opening story (`clock`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, and the film's wordless moments, such as the title card and the end card. |
| [`mark.js`](../../../a-plan-in-ninety-days/shared/src/mark.js) | The module's mark, which every film of *Data management* draws on its title and end cards: five layers drawing themselves, one under another, and a dot above them for the people they serve. It lives in [*A plan in ninety days*' shared folder](../../../a-plan-in-ninety-days/shared/src/mark.js), so every film draws it the same way, and the film bundles it first. |
| `src/gr_swiss.js` | The opening story's places and pictures: a valley in soft layers, a station platform under a plain canopy with a plain clock, and a schematic map of the main lines with six cities named. Nothing copies a railway's own clock, logo or livery. |
| `src/gr_plan.js` | The data story's own pictures on the module's sheets: blue the plan and the target, green what is done or works, amber a gap, a cost or a wait. |
| `src/gr_scenes.js` | The seven chapters, shot by shot, on the module's camera and shots. Every moment is timed to a line's start or to a word in it (`wAt()`), so the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a double siren, the acousticians' instrument of the mid-1800s, made here. The mark is two short phrases, one on each disc, that arrive on the same chord at the same moment, as trains from two directions meet at a hub on the hour. Each sound uses the same word and offset as the picture in `src/gr_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../the-new-skills/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/a-plan-in-ninety-days/4-from-gaps-to-a-roadmap/source/`:

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
python tools/render.py --workers 4   # dist/from-gaps-to-a-roadmap.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/from-gaps-to-a-roadmap/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/from-gaps-to-a-roadmap-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film from-gaps-to-a-roadmap-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/from-gaps-to-a-roadmap/think.en.js` and `think.es.js`: it stops after `gaps`, `order` and `stages`, with one question each. The release workflow renders the video, `from-gaps-to-a-roadmap.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
