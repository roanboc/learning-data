# Rebuilding Every area, one job

*Every area, one job*, film 1 of 4 of *A plan in ninety days*, the first series of the module Data management, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' shots, and the look and tools the module shares with Leading data people, in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/), whose [README](../../../the-new-skills/shared/README.md) says how a film uses them. Its title and end cards draw the module's mark, `dm_mark`, from [`../../shared/src/mark.js`](../../shared/src/mark.js). Only what is new in this film lives here, and every name it declares starts with `ea_` or `EA_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order (the module's mark first), the moment its poster shows (Helena's plan once the strategy lane's three steps are in), the words the voice respells (Copiapó, Sougarret, Urzúa, Jun, Noor), its opening story (`rescue`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a date or a book's number says it in words for the voice (`say`), and shows the digits in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the desert at dusk, the camp's lights below the hill, as it becomes the title card; and Helena's one page, its three lanes side by side, as it becomes the end card. |
| `src/ea_rescue.js` | The opening's places and pictures, in the module's matte, sunlit language: the Atacama by day, the mountain cut open with the mine drawn live in it (the ramp, the block, the shelter and its 33 lamps, the probe, the tubes, the three drills and the capsule), the gate, the camp and the shelter by lamplight, and the desert at dusk; the miners, the engineer and the families, dressed for 2010, never likenesses. |
| `src/ea_uni.js` | The university's pictures, on the module's kit: the team's room on Monday morning and Friday afternoon, the tracker (three requests, never the whole list), DAMA-DMBOK's wheel with the requests as dots and the site's films on its areas, and Helena's ninety days on one page, in three lanes. |
| `src/ea_scenes.js` | The six chapters, each a few shots; in one room the camera glides and only what changes fades, and between rooms a shot dissolves. The title card ends chapter 1 and the end card chapter 6. Every moment is timed to a word of a line (`w()`, the film's shorthand for `wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: an Ondioline, made in code in three colours from one voice (reedy, hollow, bright), and its own low register with the percussion switch on, short and damped. The mark is one line passed through the three colours in turn; where every part runs at once, the three sound together. G major, E minor for the problem, C major at a chapter's turn, D major for the plan, tuned pure from G. Each sound uses the same word and offset as the picture in `src/ea_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../the-new-skills/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/a-plan-in-ninety-days/1-every-area-one-job/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js (a changed line is voiced again)
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, text reads on a phone, places paint in time, nothing shows twice or jumps, no paint past a person
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, held notes keep their level, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py, on the timeline build.py wrote
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/every-area-one-job.mp4
```

`audio.py` and `quiet.py` read the timeline from `dist/render.html`: after a line changes, run `build.py` before them.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/every-area-one-job/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/every-area-one-job-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack's pointer, `../audio.json`, records its checksum and its audio release (`python site-tools/media.py index --film every-area-one-job-en`). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/every-area-one-job/think.en.js` and `think.es.js`: it stops after `wheel`, `deep` and `lanes`, with one question each. The release workflow renders the video, `every-area-one-job.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
