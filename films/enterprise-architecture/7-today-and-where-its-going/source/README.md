# Rebuilding Today, and where it's going

*Today, and where it's going*, film 7 of 11 of *The map before the data* (a working title), is generated from code like *Day one*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/`](../../shared/src/), which this film adds to: ArchiMate's glyphs for a resource, a plateau and a gap (`archGlyph` in `ea.js`). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Tomás), and the moment its poster shows (the imagined street, the crew arriving). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). ArchiMate is respelled for the voice in its line's `say` ("Arky-mate"); Archi and LeanIX are shown on screen and not spoken, since the voice misreads them. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: today's list beside the imagined street, then the title; a light moving along the path, plateau by plateau; and the end card. |
| `src/plan.js` | This film's pictures (prefixed `d7_`): the imagined street at sunrise, with no poles or overhead lines (`d7_sky`; modern homes, `d7_house`, with solar glass, `d7_solar`, windows, `d7_glass`, a battery and a heat pump; street trees, `d7_tree`, and a street light, `d7_lamp`; the ground in section, `d7_ground`, with cables under the street and power moving in them; a kiosk with the street's transformer, `d7_kiosk`; an electric car at a charge post, `d7_ev` and `d7_charger`; and the crew's electric van, `d7_evan`) and a chart of a transformer's readings (`d7_trend`); the list of systems (`d7_list`, `D7_SYS`), a spreadsheet (`d7_sheet`), an empty capability slot (`d7_slot`), a "new" badge and links; and a decision record (`d7_adr`). |
| `src/scenes.js` | The ten chapters, and what they share: the capabilities and the systems placed under them (`D7_CAPS`, `D7_PLACE`), the three layers (`D7_L4C`, `D7_L4A`, `D7_L4T`), the canvas blocks and their elements (`D7_BLK`), the gaps (`D7_GAPS`), the plateaus and the work (`D7_PLAT`, `D7_WORK`) and the decision record (`D7_ADR`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a soft kalimba over airy pads in A-flat lydian for the imagined morning, then the series' palette (nylon plucks, a soft flute, warm pads), here in E-flat major, with the kalimba back at the target and along the path, and the series' mark at the title and the end. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Rebuild

As for [*Day one*](../../1-day-one/source/README.md), from this folder, `films/enterprise-architecture/7-today-and-where-its-going/source/`; the video is `dist/today-and-where-its-going.mp4`.

## Publish

As for [*Day one*](../../1-day-one/source/README.md#publish): `python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/today-and-where-its-going/` and draws the poster, then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/today-and-where-its-going/think.en.js` and `think.es.js`: it stops after `find`, `path` and `why`. Progress is stored under `ld-today-and-where-its-going`.
