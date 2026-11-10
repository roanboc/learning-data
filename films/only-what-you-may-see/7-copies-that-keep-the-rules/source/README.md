# Rebuilding Copies that keep the rules

*Copies that keep the rules*, film 7 of 8 of *Only what you may see*, the second series of *Data protection and privacy*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, two files of the agent films' kit, and the module's look and tools in [`../../../locks-before-the-data/shared/`](../../../locks-before-the-data/shared/), whose [README](../../../locks-before-the-data/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `cp_` or `CP_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (Lascaux II opening on the hill, beside the cave that rests), the words the voice respells (Jun, AI and HR, as in every film of the module, and Lascaux, Malraux, Anil, Midwifery and OpenSharing), its opening story (`story`), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the seven chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice reads differently from its caption (a number or a date in words) says it in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/cp_cave.js` | Lascaux by night, in the module's light: the hill cut away like a drawing in a guidebook, with the cave down its passage on the left and Lascaux II's place on the right (`cpHill`); the cave's painted wall, lit from below by the lamps (`cpWall`), and a dimmed copy of it for the cards that frost it (`cpWallDim`); and Lascaux II's wall, the same rock in concrete, where the painters draw the same animals stroke by stroke (`cpWall2`). The bull, horse and stag are the film's own outlines, a dark line that tapers and a wash of ochre, never traced from the panels. The visitors are their lamps; the breath, algae and crystals are drawn over the wall as one harm. |
| `src/cp_pieces.js` | The pieces for the chapters in the hall, on the kit's glass: the hall with its pools of light (`cpHall`); a row of a table with each column's value and its class's gold chip, which can turn into what a reader is shown (`cp_record`); an agreement's card (`cp_agree`); the teaching hospital, a building drawn in light with an "H" over its door, never a red cross (`cp_hospital`); a label on frosted glass with a darker film behind its words, so they read on the cave's lit wall (`cp_tag`); a small window on a place of the opening (`cp_thumb`), which reads the place with `dp_place0` so the cards after it still frost the shot's own place; a person's name and role (`cp_who`), and a card for Elena, who isn't drawn (`cp_person`); a table's column names over frosted rows (`cp_cols`); lines as a tool writes them (`cp_code`); the laptop and the phone, in coral, for a download and a photo of a screen; and the coral line through what isn't made (`cp_strike`). |
| `src/scenes.js` | The seven chapters, each a few shots. The opening is on the hill and on the walls; the four copies are asked for in the hall, one room, so the camera never cuts there and each chapter glides on from the last (`ag_cutInto`); only the closing goes back to the hill. The title card ends chapter 1 and the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a handpan, the copy, a shell made to hold every note true, as Lascaux II holds every painting true; and a viola, the original, bowed low under the opening, which stops as the cave's door shuts and comes back once, muted, while the cave rests. A short mark, D, A, B flat, A, is bowed as the paintings appear and struck on the handpan as the painters copy them; in the data story it answers only where a copy keeps the rules. Just intonation from D. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/only-what-you-may-see/7-copies-that-keep-the-rules/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every word reads and stands out, places and people paint in time, nothing shows twice or jumps
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, held notes keep their level, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/copies-that-keep-the-rules.mp4
```

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/copies-that-keep-the-rules/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/copies-that-keep-the-rules-poster.jpg`, at the moment `film.json` names. The soundtrack is pointed to by `site/assets/copies-that-keep-the-rules/audio.json` (`python site-tools/media.py index --film copies-that-keep-the-rules-en`), as every film's audio is (see [docs/maintenance.md](../../../../docs/maintenance.md)). Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/copies-that-keep-the-rules/think.en.js` and `think.es.js`. The release workflow renders the video, `copies-that-keep-the-rules.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
