# Rebuilding What it must be able to do

*What it must be able to do*, film 4 of 11 of *The map before the data* (a working title), is generated from code like *Day one*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/`](../../shared/src/), which it draws with unchanged: Tomás, Grace and Ama (`people.js`), the wall, sticky notes, the six layers, ArchiMate's glyphs and the rule card (`ea.js`). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Tomás, Ama, chasqui, khipu), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the messages running along the lit road, then the title; the one capability that hurts, lit alone; and the end card. |
| `src/plan.js` | This film's pictures (prefixed `d4_`): the Andes at dusk, the road and its relay posts, the chasqui runners (tapered limbs, a swinging tunic, a gait), a khipu, the stones of a rebuilt stretch, a printed org chart, the capability card (`d4_cap`: amber paper while a draft, glass in the strategy layer's amber once confirmed, with a heat band, evidence and an owner's tag), and a street whose rooftops feed power back to its transformer. |
| `src/scenes.js` | The ten chapters, and the utility's level-1 capabilities, their owners and their heat (`D4_L1`, `D4_HEAT`), which chapters 5 to 10 share. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a dark harp over a drone and open fifths for the 1400s (no borrowed Andean instruments), then the series' palette (nylon plucks, a soft flute, warm pads), here in F major, and the series' mark at the title and the end. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Rebuild

As for [*Day one*](../../1-day-one/source/README.md), from this folder, `films/enterprise-architecture/4-what-it-must-do/source/`; the video is `dist/what-it-must-do.mp4`.

## Publish

As for [*Day one*](../../1-day-one/source/README.md#publish): `python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/what-it-must-do/` and draws the poster, then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/what-it-must-do/think.en.js` and `think.es.js`: it stops after `who`, `how` and `heat`. Progress is stored under `ld-what-it-must-do`.
