# Rebuilding Less, on purpose

*Less, on purpose*, film 1 of 4 of *Leading a data team*, the third series of the module *Leading data people*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/), whose [README](../../../the-new-skills/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `lo_` or `LO_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the 17 reports switched off, not deleted), the words the voice respells (GOV.UK, Directgov, Dieter, *muda*, *kanso*, Noor, Jun, and "A I"), its opening story (`doless`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the few sheets kept, as they become the title card, and the last line, as it becomes the end card. |
| `src/lo_gov.js` | The opening, Britain from 2010 to 2013: the wall of small web pages in a government office, the person at home looking for the right one, the review of October 2010 as a sheet, the archive box, the two old sites read page by page, and the plain page with a green button. No crest, logo or typeface of a real website, and Martha Lane Fox is never drawn. |
| `src/lo_uni.js` | The university's May and June of 2027, in the team's room: the pile that thins to a few kept sheets, the series' four ideas, the old warehouse's 38 reports (the 17 nobody opened, the notes to their last readers, the switch-off), the week before and the week designed, the 60 alerts sorted into eight kinds, the ten ideas of the study, the team's board, the five hours back, and the 21 reports rebuilt with an owner each. |
| `src/lo_scenes.js` | The seven chapters, shot by shot. In each room the camera glides from one framing to the next and only what changes fades; a later moment in a room lets what was there leave first; between rooms a shot dissolves. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: the module's bass drum struck with felt, tuned to C2 and let ring short; and its partner, the same drum with its head pressed by the other palm, a little higher and shorter. The mark: a crowded figure of pressed notes that thins to two, then to the open drum alone. C major, A minor for the problem, tuned pure. Each sound uses the same word and offset as the picture in `src/lo_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../the-new-skills/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/leading-a-data-team/1-less-on-purpose/source/`:

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
python tools/render.py --workers 4   # dist/less-on-purpose.mp4
```

The voice cache knows each line's words: after changing a line, or a word the voice respells in `film.json`, run `tools/tts.py` again and it voices only what changed.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/less-on-purpose/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/less-on-purpose-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film less-on-purpose-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links what a newcomer can read next. "Pause and think" is `site/assets/less-on-purpose/think.en.js` and `think.es.js`: it stops after `use`, `stop` and `time`, with one question each. The release workflow renders the video, `less-on-purpose.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
