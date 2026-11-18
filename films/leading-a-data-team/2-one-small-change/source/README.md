# Rebuilding One small change at a time

*One small change at a time*, film 2 of 4 of *Leading a data team*, the third series of the module *Leading data people*, is generated from code like every other film here. It is drawn with the people kit, *Ink line* ([`../../../people-first/shared/`](../../../people-first/shared/README.md)): whole people in the places where they live, work and meet, the film's ideas written by hand at a board and in notebooks. It was first drawn in the module's *Sunlit plaster* and made again on 18 November 2026, word for word on the voice. Every name it declares starts with `kz_`, `KZ_`, `kzp_` or `KZP_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows ("Ten minutes, checked"), the words the voice respells (Shewhart, W. Edwards Deming, Masaaki Imai, Reyes and Jun), its opening story (`wards`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the team's room as the title card comes in, and as the end card comes in. |
| `src/kzp_hospital.js` | Colombo from 2000, in ink line (prefix `kzp_`): a ward with its beds and cots, a store room whose shelves go from cluttered to sorted and labelled, and the director's office with its board; and the hospital's staff, nobody's likeness. |
| `src/kz_uni.js` | The university in 2027, in the kit's places (the team's room, the corner, a teaching room, the board seen close, the notebook): who sits where, a screen's callout, the boards' rows and the notebooks' pages. |
| `src/kz_scenes.js` | The six chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says, and the ideas are written by hand. Every moment is timed to a line's start or to a word in it (`wAt()`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: the module's tubulum, open plastic pipes struck open with soft felt beaters, and its partner, the same tubulum's longest pipes with a larger, softer beater. The mark: E flat, G, F, D, short of home, then E flat, G, F, E flat, the last pipe cut a little shorter. E flat major, C minor for the problem, tuned pure. Each sound uses the same word and offset as the picture in `src/kz_scenes.js`: change one, change both. The boards' and the notebooks' sounds come from the film itself, as each row is written (the people kit's `tools/pens.py`). |
| `tools/` | Each other tool runs the people kit's tool (`../../../people-first/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/leading-a-data-team/2-one-small-change/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/one-small-change.mp4
```

The voice cache knows each line's words: after changing a line, or a word the voice respells in `film.json`, run `tools/tts.py` again and it voices only what changed.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/one-small-change/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/one-small-change-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film=one-small-change-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links what a newcomer can read next. "Pause and think" is `site/assets/one-small-change/think.en.js` and `think.es.js`: it stops after `measure`, `automate` and `leader`, with one question each. The release workflow renders the video, `one-small-change.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
