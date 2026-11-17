# Rebuilding Wellbeing is in the work

*Wellbeing is in the work*, film 2 of 4 of *People first*, the series that opens the module *Leading data people*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/), whose [README](../../../the-new-skills/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `ww_` or `WW_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`wellbeing-in-the-work`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (chapter `page`, at `both`: Marta's week on one page, what the work asks beside what helps), the words the voice respells (Quehue, Apurímac, Deci, Novak, Jun, "A I"), its opening story (`bridge`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`: a year or a date, read as words. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land or a sheet a moment to be read, and two wordless moments: the requests lifted into rows, a blue slip under each card for its date, as the room becomes the title card; and the last line alone, as it becomes the end card. |
| `src/ww_place.js` | The gorge at Quehue, in Peru, drawn once for the films of *People first* that show the rope bridge, and copied into this film under its own prefix: both banks with a stone base on each, by a dry June sun or under a grey sky (`wwGorge`, `wwGorgeGrey`), and the left bank at people's height (`wwBank`, `wwBankGrey`). A drawing in the module's own style, never a likeness, and nothing is borrowed from the communities' own patterns or crafts. |
| `src/ww_bridge.js` | The rope bridge, drawn live over the gorge so it can be built, wear, sag and fall: six cables, as the sources have them (four for the floor and two handrails), the sides, the rods and the mat, each drawn by how far it has come, and last year's bridge cut loose in the river. |
| `src/ww_people.js` | The people of the four communities, as small whole figures for the wide view and as half-figures: dressed from the sources' photographs and words, in plain colours that mean nothing in these films. No pattern is invented or copied, and nobody drawn is a real person. |
| `src/ww_uni.js` | The university's side, in February 2027: the small room where Helena holds her half-hours (`wwOne`), the room where the people who asked meet her (`wwMeet`) and the team's room late on a Friday (`wwLate`); Marta Silva, Erin Walsh and Tomás Ortega, and the nine people who asked; a request as a small card with data's orange band, the 46 on the wall and the fourteen that wait on Marta; her week on one page; the five questions, and the seven's answers as counts. And, for the gorge, the two visitors of October 1972, the rain and the wind, and the bridge giving way. |
| `src/ww_scenes.js` | The nine chapters, shot by shot, on the module's camera and shots. In one room the camera glides from one framing to the next and only what changes fades; a later moment in a room (`later:true`) lets what was there leave first; between rooms a shot dissolves. The title card ends the opening chapter and the end card the last one. Every moment is timed to a line's start or to a word in it, with `wAt(sc, …)` written in full, since the build's check of those words reads only that form. So the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a portative organ, the small organ that sits on the player's knee, one hand on its keys and the other on its bellows, made here. It plays one line, a note at a time, and every phrase ends where the bellows must fill again; its two longest pipes, stopped, give the low notes under a turn. The mark is nine notes: played with no rests, each note thinner as the wind runs out, until the last doesn't sound; and played with its rests, three notes to a bellows, whole. B major, G sharp minor for the problem, tuned pure from B. Each sound uses the same word and offset as the picture in `src/ww_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../the-new-skills/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/people-first/2-wellbeing-in-the-work/source/`:

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
python tools/render.py --workers 4   # dist/wellbeing-in-the-work.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

The music is at one of `quiet.py`'s limits: it comes in five times in the 30 seconds from 5:31, where *An order, agreed* turns into *Where to look*. Lines voiced again there can move those moments closer together, and `quiet.py` then fails: space the score's entries there, in `tools/score.py`.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/wellbeing-in-the-work/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/wellbeing-in-the-work-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film wellbeing-in-the-work-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links what a newcomer can read next. "Pause and think" is `site/assets/wellbeing-in-the-work/think.en.js` and `think.es.js`: it stops after `needs`, `order` and `signs`, with one question each. The release workflow renders the video, `wellbeing-in-the-work.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

The film shows no code and no product: its requests are cards on a wall, and its evidence is one page. Its numbers are the module's for February 2027, and the questions it met while it was made, with the assumption taken for each, are in [the film's assumptions](../../../../docs/assumptions/10-leading-data-people/1-people-first/2-wellbeing-in-the-work.md).
