# Rebuilding Measure the work, not the people

*Measure the work, not the people*, film 2 of 4 of *Ownership and performance*, the last series of the module *Leading data people*, is generated from code like every other film here. It is drawn with the people kit, *Ink line* ([`../../../people-first/shared/`](../../../people-first/shared/README.md)), as *Owning the outcome* is: whole people in the places where they work and meet, in flat colour with one even dark line. It also uses the agent films' camera and shots, *A Sharper Sketch*'s scenes and *The Inner Life of Data*'s engine, fonts and voice. Its first version, of 10 November 2026, was drawn in the module's *Sunlit plaster*; it was made again on 18 November 2026. The film never changes a shared kit for itself: only what is new in this film lives here, each top-level name prefixed `mw_` or `MW_`.

| File | What it holds |
|---|---|
| `film.json` | The film's key (`measure-the-work`), title and subtitle, the page's line on what the colours mean, its own source files in order, the words the voice respells (Jun, "A I", Deming and Novak), the chapter of its opening story (`vision`), no chapter where the score may pulse, and the moment its poster shows (at dusk, the driver the cables held, unhurt, on the phone: chapter `vision`, at `care`). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land or a hand finishes a page, and the film's wordless moments: the title card, the page of *Not a target* written in the pause that ends it, Graham's answer from the campus, and the end card. |
| `src/mw_sweden.js` | The opening, Sweden from 1997: a two-lane country road through fields and pines, seen from its verge, by day and at dusk, with and without the barrier of steel cables down its middle; a family's kitchen at night; the road engineers' office with its wall map; a small town's roundabout. Its people, never likenesses and dressed for their time: an officer and a driver, a mother and her boy, two road engineers, the workers who set the barrier, people at the roundabout, the driver the cables held. And what they hold or use: the officer's pad, the decision, the tape, the clipboard, the barrier's posts, the map's dots. Nothing Swedish is drawn but the roads; no crash is shown. Everyone outdoors is sized by one eye line. |
| `src/mw_uni.js` | The university in 2027, in the kit's places (the team's room at each hour, Helena's corner, the campus). What is this film's own in them: who sits where; the panels from Ivy's screen (one request from start to end, a request accepted and its access asked for, the days to first use, promises met, the load against its limit); the five boards' rows, Carmen's and Helena's; the four pages of Helena's notebook; Helena's chat with Graham, Ivy's call with Mei, and the director's message and its answer. |
| `src/mw_scenes.js` | The six chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says, and the ideas are written by hand at the board or in the notebook. The title card ends chapter 1, the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: tuned saw blades struck softly with felt, and their partner, the largest blades, damped by the palm; F major, D minor for the problem, every note tuned pure from F. The mark is a note heard alone, then in its chord, where it means something else. Music plays under the opening story, and after that only now and then. Each effect is something a person does or something that comes in on screen (the officer's pen, the decision pinned up, a post set in the ground, a panel from Ivy's screen, the marker on the board, the pen in the notebook, a call, a message). The board's and the notebook's sounds come from the film itself, where it writes each row (the kit's `tools/pens.py`); the others use the same word and offset as in `src/mw_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the people kit's tool (`../../../people-first/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/ownership-and-performance/2-measure-the-work/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws; no word under 28 px; nothing twice, no jump; the people whole, in scale, at ease and alive
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python ../../../../site-tools/fits.py   # every piece of text inside its box, and the captions on a phone
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/measure-the-work.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/measure-the-work/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/measure-the-work-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film measure-the-work-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/measure-the-work/think.en.js` and `think.es.js`: it stops after `read`, `pairs` and `target`, with one question each. The release workflow renders the video, `measure-the-work.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
