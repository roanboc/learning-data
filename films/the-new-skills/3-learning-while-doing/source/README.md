# Rebuilding Learning while doing

*Learning while doing*, film 3 of 3 of *The new skills*, the first series of the module *Leading data people*, is generated from code like every other film here. It is drawn with the people kit, *Ink line* ([`../../../people-first/shared/`](../../../people-first/shared/README.md)): whole people in the places where they live, work and meet, the film's ideas written by hand at a board and in notebooks. It was first drawn in the module's *Sunlit plaster* and made again on 18 November 2026, word for word on the voice.

| File | What it holds |
|---|---|
| `film.json` | The film's key (`learning-while-doing`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (chapter `beside`, at `pair`), the words the voice respells (Angicos, Recife, Natal, Paulo Freire, Freire, Reyes, Jun, Noor, "A I"), its opening story (`circles`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, and the film's wordless moments, such as the title card and the end card. |
| `src/lwa_town.js` | Angicos in 1963, in ink line (prefix `lwa_`): the main street by day and at dusk, its windows lit; the culture circle's room at night, with the bulb, the picture on the wall and the coordinator's sheet; an adult class by day; a plain room abroad; the hammock's picture; and the people of Angicos, nobody's likeness. |
| `src/lw_uni.js` | The university in 2027, in the kit's places (the team's room, Helena's corner, the campus, a teaching room, the board seen close, the notebook): who sits where, a screen's callout, the boards' rows (the circle's sheet, what a count means, how adults learn at work) and the six pages of notes. |
| `src/lw_scenes.js` | The seven chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says, and the ideas are written by hand. Every moment is timed to a line's start or to a word in it (`wAt()`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a spoke harp, a bicycle wheel whose spokes are each tightened to a note and plucked, made here. The mark is a note found, then a second beside it, then a short tune built from them. Each sound uses the same word and offset as the picture in `src/lw_scenes.js`: change one, change both. The boards' and the notebooks' sounds come from the film itself, as each row is written (the people kit's `tools/pens.py`). |
| `tools/` | Each other tool runs the people kit's tool (`../../../people-first/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/the-new-skills/3-learning-while-doing/source/`:

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
python tools/render.py --workers 4   # dist/learning-while-doing.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/learning-while-doing/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/learning-while-doing-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film learning-while-doing-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/learning-while-doing/think.en.js` and `think.es.js`: it stops after `beside`, `teach` and `two`, with one question each. The release workflow renders the video, `learning-while-doing.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
