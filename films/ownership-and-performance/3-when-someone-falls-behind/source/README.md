# Rebuilding When someone falls behind

*When someone falls behind*, film 3 of 4 of *Ownership and performance*, the last series of the module *Leading data people*, is generated from code like every other film here. It is drawn with the people kit, *Ink line* ([`../../../people-first/shared/`](../../../people-first/shared/README.md)), as *Owning the outcome* and *Measure the work, not the people* are: whole people in the places where they work and meet, in flat colour with one even dark line. It also uses the agent films' camera and shots, *A Sharper Sketch*'s scenes and *The Inner Life of Data*'s engine, fonts and voice. Its first version, of 10 November 2026, was drawn in the module's *Sunlit plaster*; it was made again on 18 November 2026. The film never changes a shared kit for itself: only what is new in this film lives here, each top-level name prefixed `fb_` or `FB_`.

| File | What it holds |
|---|---|
| `film.json` | The film's key (`when-someone-falls-behind`), title and subtitle, the page's line on what the colours mean, its own source files in order, the words the voice respells (NUMMI, Tomás, Jun, Mager, "A I", Ortega and Novak), the chapter of its opening story (`nummi`), no chapter where the score may pulse, and the moment its poster shows, from the opening story (the lit hall of 1984, the line stopped and the lamp lit, as the team leader works at Joe's place while he looks on: chapter `nummi`, at `cord`). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, a board or a page is written, or a chat's messages come in (Jun's two, Tomás's answer, and hers from the campus), and the film's two wordless moments: Tomás at his desk as the title comes, and the end card. |
| `src/fb_plant.js` | The opening, Fremont from 1982: the plant seen from the road, by its gate, on a grey morning in 1982 and a clear one in 1984; its hall, dim and worn in 1982 and lit in 1984, with the cord above the line and the board of lamps a pull of it lights; and the hall of a Toyota plant in Japan, where groups from Fremont worked beside the people there. Its people, never likenesses and dressed for their time: five who worked the line (Ray, Lupe, Dale, Nita and Joe), the same people in 1982 and 1984, in the plant's work jacket in 1984; a manager, a supervisor, an inspector, two of the Toyota plant's own people, and a family whose car went wrong. And what they hold or use: lunch cans, a box of things from a desk, a complaint, the supervisor's desk piled with forms, a clipboard, the cars of the early 1980s with no maker's badge. Nothing Japanese is drawn for Toyota but its people, in plain work clothes. Everyone outdoors or in a hall is sized by one eye line. |
| `src/fb_uni.js` | The university in 2027, in the kit's places (the team's room, Helena's corner, a teaching room, the campus) and two of this film's own (a seminar room, and Helena's corner on a December evening). What is this film's own in them: who sits where; the binders of the old warehouse's reports on Tomás's desk, which Helena carries away; the team's board of sticky notes, moving from the old warehouse's side to the platform's; the panels that come out of a screen (a review, the team's days to first use, Tomás's weeks, the gap between his days and the team's); Carmen's three boards; Tomás's plan in his notebook and two pages of Helena's; and the chat in which Jun sends a report back. Tomás's reasons are on no board, page or screen. |
| `src/fb_scenes.js` | The six chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says, and the ideas are written by hand at the board or in a notebook. The title card ends chapter 1, the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a lute-harpsichord, a harpsichord strung with gut, made here, and its buff stop; E major, C sharp minor for the problem, every note tuned pure from E. The mark is a phrase that stumbles, then steadies. Music plays under the opening story, and after that only now and then. Each effect is something a person does or something that comes in on screen (the gate rolled shut and open, the line heard from its floor, a complaint handed over, the cord pulled and the line stopping, a note pressed on the board, a panel from a screen, a message, the binders lifted, the marker on the board, the pen in a notebook). The boards' and the notebooks' sounds come from the film itself, where it writes each row (the kit's `tools/pens.py`); the others use the same word and offset as in `src/fb_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the people kit's tool (`../../../people-first/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/ownership-and-performance/3-when-someone-falls-behind/source/`:

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
python tools/render.py --workers 4   # dist/when-someone-falls-behind.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/when-someone-falls-behind/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/when-someone-falls-behind-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film when-someone-falls-behind-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/when-someone-falls-behind/think.en.js` and `think.es.js`: it stops after `cause`, `gap` and `time`, with one question each. The release workflow renders the video, `when-someone-falls-behind.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
