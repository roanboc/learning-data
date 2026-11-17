# Rebuilding People before roles

*People before roles*, film 1 of 4 of *People first*, the series that opens the module *Leading data people*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, the agent films' kit and people, and the module's look and tools in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/), whose [README](../../../the-new-skills/shared/README.md) says how a film uses them. The film never changes that kit. Only what is new in this film lives here, and every name it declares starts with `pb_` or `PB_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the chart on the wall, every box lit, with the seven people beneath it), the words the voice respells (Apurímac, minka, Jun, Noor, Yusuf, Tomás and four surnames), its opening story (`bridge`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and the wordless moments: the room clearing into the title card, each of the seven arriving, Friday's seven names, and the end card. |
| `src/pb_place.js` | The gorge of the Apurímac, in the module's matte, sunlit look: both banks with a stone base on each, the river low in the frame, by a dry sun or under a grey sky, and the left bank at people's height. This film's copy of the drawing that the series' films at the bridge share; each keeps its own copy, under its own prefix. A drawing, not a likeness of the place. |
| `src/pb_bridge.js` | The rope bridge, drawn live over the gorge so it can be new, sag and come apart: six cables, the sides, the floor and its mat, with the grass's colour by its age. |
| `src/pb_people.js` | The people of the gorge: small whole figures for the wide view, and half-figures on the bank, dressed from the sources' photographs and words in plain colours, with no pattern invented and none copied. Nobody drawn is a likeness of a real person. |
| `src/pb_uni.js` | The university in February 2027: Helena's room, the team's office by day and late in the afternoon, the team's room, and Helena's desk seen from above; Marta Silva, Erin Walsh and Tomás Ortega, copied from the module's shared numbers; the chart of seven boxes, the list of 46 open requests, the pencil and its lines, and the sheet of Helena's first week. |
| `src/pb_scenes.js` | The six chapters, shot by shot. In one room the camera glides from one framing to the next and only what changes fades; a later moment in a room lets what was there leave first; between rooms a shot dissolves. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a cor anglais and a bassoon, as a pair, both made here. The mark is *the names*: seven short figures, each the rhythm of one person's name said aloud, each starting on its own note of the scale. D-flat major, B-flat minor for the problem, tuned pure from D flat. Nothing Andean plays for the bridge. Music plays under the opening story, and after that only now and then; nothing pulses. Each sound uses the same word and offset as the picture in `src/pb_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../the-new-skills/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/people-first/1-people-before-roles/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, no arm jumps, nothing reaches past a person's picture
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python ../../../../site-tools/fits.py   # every piece of text stays inside its box, and every caption inside the frame
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/people-before-roles.mp4
```

The voice cache knows each line's words: after changing a line, or a word the voice respells in `film.json`, run `tools/tts.py` again and it voices only what changed.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/people-before-roles/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/people-before-roles-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film people-before-roles-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links what a newcomer can read next. "Pause and think" is `site/assets/people-before-roles/think.en.js` and `think.es.js`: it stops after `seven`, `turn` and `friday`, with one question each. The release workflow renders the video, `people-before-roles.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
