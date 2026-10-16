# Rebuilding Who does it, and where meaning changes

*Who does it, and where meaning changes*, film 6 of 11 of *The map before the data* (a working title), is generated from code like *Day one*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/`](../../shared/src/), which this film adds to: ArchiMate's glyphs for an actor (a stick figure) and a contract (`archGlyph` in `ea.js`). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Tomás, Ama, Priya), and the moment its poster shows (Japan's line in 2011, power piling up in the west). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: power still piling up at Japan's line, then the title; envelopes crossing the gate both ways; and the end card. |
| `src/plan.js` | This film's pictures (prefixed `d6_`): a sketch map of Japan's four main islands with the frequency line, the two grids, the power stations of 2011, power piling up and a thin stream crossing, the converter stations and the turns of power cuts (`d6_japan`); an early generator (`d6_gen`), its wave (`d6_wave`) and a converter close up (`d6_conv`, `d6_convPanel`); process steps with names pencilled on (`d6_step`, `d6_slip`), ArchiMate's assignment (`d6_assign`) and grouping (`d6_group`), a contract (`d6_contract`); outage reports and the agent's rights (`d6_report`, `d6_rights`); a house with its connection point, a removal van and two big numbers (`d6_house`, `d6_movevan`, `d6_count`); the two sides, the wall and its gate (`d6_sides`, `d6_wall`), paper lists, a battery, an envelope and a storm cloud. |
| `src/scenes.js` | The ten chapters, and the steps, roles and actors they share (`D6_STEPS`, `D6_ROLES`), the two domains (`D6_DOM`) and what may cross the edge (`D6_CROSS`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a soft marimba over two low hums a minor third apart for Japan (fifty and sixty cycles are in the ratio five to six), and no borrowed Japanese instruments; then the series' palette (nylon plucks, a soft flute, warm pads), here in G major, with the two hums back, softly, wherever the film stands at the edge; and the series' mark at the title and the end. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Rebuild

As for [*Day one*](../../1-day-one/source/README.md), from this folder, `films/enterprise-architecture/6-who-does-it/source/`; the video is `dist/who-does-it.mp4`.

## Publish

As for [*Day one*](../../1-day-one/source/README.md#publish): `python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/who-does-it/` and draws the poster, then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/who-does-it/think.en.js` and `think.es.js`: it stops after `names`, `agent` and `one`. Progress is stored under `ld-who-does-it`.
