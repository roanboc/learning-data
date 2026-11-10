# Rebuilding One small change at a time

*One small change at a time*, film 2 of 4 of *Leading a data team*, the third series of the module *Leading data people*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/), whose [README](../../../the-new-skills/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `kz_` or `KZ_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows ("Ten minutes, checked"), the words the voice respells (Shewhart, W. Edwards Deming, Masaaki Imai, Reyes and Jun), its opening story (`wards`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the stair of small changes, each step ticked, as it becomes the title card; and the cycle, turning once more, as it becomes the end card. |
| `src/kz_hospital.js` | The opening, Colombo in 2000: the sky, the ground and two palms; the Castle Street Hospital for Women cut open, as the kit cuts open the teaching building, its wards, nursery, operating theatre, stores and entrance, each room lit and tidied as the new way reaches it, the infections outlined in amber; the store's shelves, from cluttered to sorted, set in order, clean and labelled; three of the staff, in the plain tunics of the time and never anyone real; the infections' fall, to scale; and the way's spread, to Sri Lanka's hospitals and fifteen African countries. Nothing Sri Lankan or Japanese is borrowed. |
| `src/kz_uni.js` | The university's July to October 2027, in the team's rooms: the wall clock, Ivy's Monday from six to eleven (the job, the promise, her two hours by hand, the hours not yet checked), the cycle, her six timed steps, the checklist, the job and its checks, the stair of minutes after each small change, a weekly chore, and a print of the hospital for the team room's wall. |
| `src/kz_scenes.js` | The six chapters, shot by shot. In each room the camera glides from one framing to the next and only what changes fades; a later moment in a room lets what was there leave first; between rooms a shot dissolves. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: the module's tubulum, open plastic pipes struck open with soft felt beaters, and its partner, the same tubulum's longest pipes with a larger, softer beater. The mark: E flat, G, F, D, short of home, then E flat, G, F, E flat, the last pipe cut a little shorter. E flat major, C minor for the problem, tuned pure. Each sound uses the same word and offset as the picture in `src/kz_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../the-new-skills/shared/tools/run.py`) on this film. |

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
