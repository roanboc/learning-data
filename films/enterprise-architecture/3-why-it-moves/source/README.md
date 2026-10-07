# Rebuilding Why it moves

*Why it moves*, film 3 of 11 of *The map before the data* (a working title), is generated from code like *Day one*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/`](../../shared/src/), which this film adds to: Ama, the regulatory lead (`people.js`), and the rest of the motivation layer's ArchiMate glyphs, for drivers, assessments, outcomes and principles (`archGlyph` in `ea.js`). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Tomás, Farah, Ama), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the map relit and the title, the ropes going still under "principles", and the end card. |
| `src/plan.js` | This film's pictures (prefixed `d3_`): a sketch of a grid going dark from Niagara outwards, the relay, a rulebook, the letters, the utility's badge, the motivation layer's cards (`d3_card`: lavender paper while a draft, purple glass once confirmed, each headed with its kind and ArchiMate's glyph for it), a valley with a wind farm and a new line, and a gauge with a question. |
| `src/scenes.js` | The ten chapters. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: the series' palette (nylon plucks, a soft flute, warm pads, open strings and a drone for 1965), here in D major, and the series' mark at the title and the end. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Rebuild

As for [*Day one*](../../1-day-one/source/README.md), from this folder, `films/enterprise-architecture/3-why-it-moves/source/`; the video is `dist/why-it-moves.mp4`.
