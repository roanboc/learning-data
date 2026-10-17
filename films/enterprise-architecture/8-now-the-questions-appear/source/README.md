# Rebuilding Now the questions appear

*Now the questions appear*, film 8 of 11 of *The map before the data* (a working title), is generated from code like *Day one*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/`](../../shared/src/), which this film uses as they are. Its own glyphs for a decision, a question, a measure and a data product (`d8_glyph`) live with its pictures. Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Tomás), and the moment its poster shows (a skipper at sea, calling the markets: two prices back, the third ringing). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the skipper's boat in at Chombala, where buyers wait, then the title; the goal's line and the request's line meeting at one decision; and the end card. |
| `src/plan.js` | This film's pictures (prefixed `d8_`): north Kerala's coast and India's south, sketched from longitude and latitude (`D8_INDIA`, `D8_KERALA`, `D8_CL`), with the survey's fifteen markets placed by their distances (`D8_MK`), the phone towers and their range (`D8_TW`, `D8_RANGE`), rivers and hills drawn, not surveyed (`D8_RIV`, `D8_RIDGE`), and a camera over the map (`d8_camAt`, `d8_map`); boats, buyers, a catch poured back and a sardine (`d8_boat`, `d8_buyer`, `d8_spill`, `d8_fish`); the beach at Badagara, with crows, a palm and baskets (`d8_beach`); a skipper's phone, close up and as a small icon (`d8_phone`, `d8_phoneIcon`); a skipper's question, as a bubble over his boat (`d8_qmark`); one morning as a line, with the price too late or in time (`d8_when`); the film's glyphs and elements (`d8_glyph`, `d8_el`, `d8_slot`); a request on an index card (`d8_card`), a line traced through points (`d8_trace`) and an owner's tag (`d8_owner`); households and the hardship register (`d8_homes`); a report as a dashboard tile, a measure's definition, a clock and a span of the timeline (`d8_report`, `d8_def`, `d8_clock`, `d8_span`); a small dashboard (`d8_dash`); and the two sides and the wall, as in *Who does it* (`d8_sides`, `d8_wall`). |
| `src/scenes.js` | The eleven chapters, and what they share: the boats of two mornings (`D8_BOATS`), the skippers who wonder at sea what the markets will pay (`D8_WONDER`), the backlog of forty-two requests (`D8_REQ`), the rows a request is traced up through (`D8_ROWS`), the goals and decisions (`D8_GOALS`, `D8_DEC`), the shape of a goal traced down (`D8_TREE`), the timeline of one connection (`D8_DX`), the measures and their homes (`D8_HOME`), the data products (`D8_PROD`), and the skipper's question traced back on the coast (`D8_KC`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: a celesta over bowed strings in A minor for the coast in 1997, with the sea, darker as the catch goes back, with a muted pulse that fades as the phones arrive; then the series' palette (nylon plucks, a soft flute, warm pads), here in C major, with the celesta back wherever an answer reaches someone in time, and the series' mark at the title and the end; and, back on the coast, the strings and the sea again, in A major, as the phones spread. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

## Rebuild

As for [*Day one*](../../1-day-one/source/README.md), from this folder, `films/enterprise-architecture/8-now-the-questions-appear/source/`; the video is `dist/now-the-questions-appear.mp4`.

## Publish

As for [*Day one*](../../1-day-one/source/README.md#publish): `python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/now-the-questions-appear/` and draws the poster, then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/now-the-questions-appear/think.en.js` and `think.es.js`: it stops after `up`, `count` and `build`. Progress is stored under `ld-now-the-questions-appear`.
