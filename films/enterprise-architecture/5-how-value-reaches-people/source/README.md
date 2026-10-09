# Rebuilding How value reaches people

*How value reaches people*, film 5 of 11 of *The map before the data* (a working title), is generated from code like *Day one*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/`](../../shared/src/), which this film adds to: ArchiMate's glyph for a value stream, a chevron (`archGlyph` in `ea.js`), and a `deco` option on `archEl`, for a map drawn too small to read, as texture. Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Tomás, Farah, dabbawala, BPMN), and the moment its poster shows (the title card). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). SIPOC is respelled for the voice in its line's `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the lunches still crossing the city, then the title; the two crews driving off in the rule's order; and the end card. |
| `src/plan.js` | This film's pictures (prefixed `d5_`): a sketch map of Mumbai with its two main suburban lines, its sorting stations and lunches flowing along them (`d5_mumbai`); Mumbai's sky, skyline and street, a home, stations, a train, an office tower, dabbawalas (`d5_man`: walking, sorting, carrying a crate of tins on the head; `d5_cyclist`), tins and crates, a lid and its marks; Hill Street at night (`d5_street`: houses, poles, the line, a tree drawn as overlapping masses of leaves (`d5_lobe`) on tapering wood (`d5_wood`), one of its limbs breaking, falling onto the line, sagging and snapping it and hanging from the trunk, leaves torn off, windows that go dark and come back, a crew's van) and a phone; the value stream's chevrons (`d5_chev`, `d5_stream`), swimlanes, process steps, the process map (`d5_pmap`), a SIPOC's headings, fault cards, vans, the BPMN diagram for who goes first (`d5_bpmn`) with its tokens, and data objects. |
| `src/scenes.js` | The ten chapters, and the stages, capabilities and steps they share (`D5_STAGES`, `D5_CAPS`, `D5_STEPS`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a warm electric piano for Mumbai and a muted metal tock for each hand-off (no borrowed Indian instruments), G minor for the storm, then the series' palette (nylon plucks, a soft flute, warm pads), here in B-flat major, and the series' mark at the title and the end. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Rebuild

As for [*Day one*](../../1-day-one/source/README.md), from this folder, `films/enterprise-architecture/5-how-value-reaches-people/source/`; the video is `dist/how-value-reaches-people.mp4`.
