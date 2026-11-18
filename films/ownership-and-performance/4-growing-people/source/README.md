# Rebuilding Growing people

*Growing people*, film 4 of 4 of *Ownership and performance*, the last series of the module *Leading data people*, is generated from code like every other film here. It is drawn with the people kit, *Ink line* ([`../../../people-first/shared/`](../../../people-first/shared/README.md)), as *Owning the outcome* is: whole people in the places where they work and meet, in flat colour with one even dark line. It also uses the agent films' camera and shots, *A Sharper Sketch*'s scenes and *The Inner Life of Data*'s engine, fonts and voice. Its first version, of 10 November 2026, was drawn in the module's *Sunlit plaster*; it was made again on 18 November 2026. The film never changes a shared kit for itself: only what is new in this film lives here, each top-level name prefixed `gp_` or `GP_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`growing-people`), title and subtitle, the page's line on what the colours mean, its own source files in order, the words the voice respells (jugyō kenkyū, DeNisi, Reyes, Novak, Jun, Mei, "A I"), the chapter of its opening story (`lesson`), no chapter where the score may pulse, and the moment its poster shows (the teachers who came to watch, one bent by the girl's desk to see her slate: chapter `lesson`, 5.4 s after `watch`). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, and the film's wordless moments, such as the title card and the end card. |
| `src/gp_meiji.js` | The opening in Japan from the 1870s: a village school's one classroom, with its sliding door, blackboard, clock and windows on the fields, and its blackboard seen close, with the chalk. Its people, never likenesses and dressed for their time: the village teacher, the children in plain kimono at their desks with slates, the teachers who come to watch, and Mr Okada, a head teacher of the 1880s. A kimono is drawn over the kit's person (`gp_robe`, `gp_sleeve`), its collar crossing left over right whichever way the person faces. Everyone in the room is sized by one eye line. |
| `src/gp_today.js` | The rest of the opening: a primary classroom in Japan today, where many teachers watch a research lesson; a classroom in the United States, with the book, the trial's table, the researcher's fractions materials and the children's paper strips; and an office at the end of a day, where a new analyst works alone. The rooms keep the classroom's eye line. |
| `src/gp_uni.js` | The university in 2027, in the kit's places (the team's room at each hour, Helena's corner by day and at a December dusk, the campus). What is this film's own in them: who sits where; Ivy's screens (what "used" means, her data product) and Jun's; Ivy's page of the route; Carmen's two boards; the five pages of notes, four of Ivy's and one of Helena's; Graham's call and his chat; the seedling in its pot; and the tag of Ivy's steps. |
| `src/gp_scenes.js` | The six chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says, and the ideas are written by hand at a board or in a notebook. The title card ends chapter 1, the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a fortepiano, the piano of the 1790s, and a second player on its low notes, four hands at one keyboard, made here; B flat major, G minor for the problem, every note tuned pure from B flat. The mark is a small figure in the treble that returns fuller, an octave lower. Music plays under the opening story, and after that only now and then. Each effect is something a person does or something that comes in on screen (the classroom's sliding door, a book or a sheet passed from hand to hand, a card, a mark on a screen, a call, a message sent, the marker on the board, a pen in a notebook); people's steps and the chalk have none. The board's and the notebooks' sounds come from the film itself, where it writes each row (the kit's `tools/pens.py`); the others use the same word and offset as in `src/gp_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the people kit's tool (`../../../people-first/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/ownership-and-performance/4-growing-people/source/`:

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
python tools/render.py --workers 4   # dist/growing-people.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/growing-people/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/growing-people-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film growing-people-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/growing-people/think.en.js` and `think.es.js`: it stops after `goals`, `tuesday` and `next`, with one question each. The release workflow renders the video, `growing-people.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
