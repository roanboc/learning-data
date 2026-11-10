# Rebuilding Rules that let people decide

*Rules that let people decide*, film 4 of 4 of *Leading a data team*, the third series of the module *Leading data people*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, the agent films' kit, and the module's own look in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/): the team's rooms and their light, the people, the sheets on the wall, the things in a room, and the tools that build and check a film ([`../../../the-new-skills/shared/README.md`](../../../the-new-skills/shared/README.md) says what each file holds). Only what is new in this film lives here, prefixed `rd_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (subak and subaks, Jun and "A I", as the module says them), its opening story's chapter, no urgent chapter, and the moment its poster shows (Lucy's page at the empty Monday labs). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the wordless moments (the title card after the opening, and the end card). |
| `src/rd_bali.js` | Bali in the 1970s and 1980s, in the module's matte look, lit from the right like the rooms: the terraces under a volcano in haze, with the water moving from field to field; the water temple, drawn plainly (a stone wall with a split gate, a shrine of stacked thatched roofs, an open pavilion), with no ornament copied from Balinese art; farmers of the time in plain shirts, never likenesses; and the model, 172 cells between two rivers on a printed map, with a harvest line that has no numbers. The researchers are named in the voice, never drawn. |
| `src/rd_uni.js` | The university in the spring of 2027: the team's room on a morning and late in the afternoon, a faculty's office and Engineering's; Lucy Tran, new in this film, and the other three faculties' timetable officers, never named; every decision through one place, the queue of room reports, Yusuf's eleven rules and the drawer, the rule cards, the template with its box that says who decides what, the four faculties' copies, and Engineering's labs. |
| `src/rd_scenes.js` | The seven chapters, each a run of shots. In one room the camera glides on and only what changes fades; a later moment in a room (`later:true`) lets what was there leave first; between rooms a shot dissolves, or cuts where both show the same people. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: whirly tubes, made here, each swung to settle on one overtone, steady, and a longer tube swung slowly for the bass, one instrument in two sizes (the module's `palettes.md`). The mark, at the model's calendar, the title, when Helena stops deciding, when groups planting together emerge and at the close: tubes finding notes that fit together, until three hold F sharp, A and D, a chord nobody played alone. D major, B minor for the problem, every tube cut to a note of D major's harmonic series and tuned pure from D. Nothing Balinese plays for Bali. Music plays under the opening story, and after that only now and then; nothing pulses. Each effect fires at the same moment, with the same word and offset, as the thing it belongs to in `src/rd_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../the-new-skills/shared/tools/run.py`) on this film: the module's own `build.py` and `quiet.py`, and the agent films' and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/leading-a-data-team/4-rules-to-decide/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints without holding the page, nothing shows twice, no arm jumps, nothing jumps in one room, nothing reaches past a person's picture
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, as low as the governance films', nothing beats, nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/publish.py    # the site's player, Spanish captions, poster and soundtrack (--keep-sound when only the pictures change)
python tools/render.py --workers 4   # dist/rules-to-decide.mp4
```

The soundtrack's published copy is kept outside Git once its release exists: `audio.json`, beside the script, records its checksum and release (`python site-tools/media.py index --film rules-to-decide-en`, from the repository's root).
