# Rebuilding Everyone at the table

*Everyone at the table*, film 3 of 4 of *Making the case*, the second series of the module *Data management*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, the module's mark (`films/a-plan-in-ninety-days/shared/src/mark.js`), and the look and tools both people modules share, in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/), whose [README](../../../the-new-skills/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `et_` or `ET_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`everyone-at-the-table`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (chapter `map`, at `asked`), the words the voice respells (Derby, Mendelow, HR, Noor, Jun, Rohan, "A I"), its opening story (`elms`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, and the film's wordless moments, such as the title card and the end card. |
| [`mark.js`](../../../a-plan-in-ninety-days/shared/src/mark.js) | The module's mark, which every film of *Data management* draws on its title and end cards: five layers drawing themselves, one under another, and a dot above them for the people they serve. It lives in [*A plan in ninety days*' shared folder](../../../a-plan-in-ninety-days/shared/src/mark.js), so every film draws it the same way, and the film bundles it first. |
| `src/et_park.js` | The opening story's places, people and things, drawn as an architect draws a building's front, flat and calm, with the sun on the right, from what is known of them. |
| `src/et_uni.js` | The film's own pictures at the university: the plan and the moved month in blue, what's agreed and done in green, risk and what waits in amber, the reports and measures in orange. |
| `src/et_scenes.js` | The six chapters, shot by shot, on the module's camera and shots. Every moment is timed to a line's start or to a word in it (`wAt()`), so the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: people round a table whistling softly, made here. The mark is four notes passed round the table, one whistler each, then whistled by everyone together. Each sound uses the same word and offset as the picture in `src/et_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../the-new-skills/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/making-the-case/3-everyone-at-the-table/source/`:

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
python tools/render.py --workers 4   # dist/everyone-at-the-table.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/everyone-at-the-table/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/everyone-at-the-table-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film everyone-at-the-table-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/everyone-at-the-table/think.en.js` and `think.es.js`: it stops after `map`, `page` and `june`, with one question each. The release workflow renders the video, `everyone-at-the-table.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
