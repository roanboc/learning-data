# Rebuilding Who it serves, and how it pays

*Who it serves, and how it pays*, film 2 of 11 of *The map before the data* (a working title), is generated from code like *Day one*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/`](../../shared/src/), which this film adds to: Farah, the customer advocate (`people.js`), and a labelled value proposition canvas and a way to place notes in the blocks of a business model canvas (`vpCanvas2`, `VPC.where`, `BMC_AT` in `ea.js`). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Tomás, Farah), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: Pearl Street lit and the title, the canvas stamped "fits", and the end card. |
| `src/plan.js` | This film's pictures (prefixed `d2_`): Pearl Street at dusk, a gas lamp beside an electric bulb, Edison's chemical meter on a balance, the annual report, small icons (a house, a heart, a shop, solar panels, the government, scales, a key, a bill), the cards for who pays, uses and decides, and a glass table. |
| `src/scenes.js` | The ten chapters. The households' canvas (`d2_households`) is drawn once from its notes and links, and carries across chapters 4 to 7. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: the series' palette (nylon plucks, a soft flute, warm pads, a lute and a drone for 1882), here in E major, and the series' mark at the title and the end. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Rebuild

As for [*Day one*](../../1-day-one/source/README.md), from this folder, `films/enterprise-architecture/2-who-it-serves/source/`; the video is `dist/who-it-serves.mp4`.

## Publish

As for [*Day one*](../../1-day-one/source/README.md#publish): `python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/who-it-serves/` and draws the poster, then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/who-it-serves/think.en.js` and `think.es.js`: it stops after `segments`, `fit` and `pays`. Progress is stored under `ld-who-it-serves`.
