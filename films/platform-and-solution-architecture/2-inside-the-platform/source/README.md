# Rebuilding Inside the platform

*Inside the platform*, film 2 of 8 of *Platform and solution architecture*, is generated from code like *Day one*: the same engine, components, voice and tools, *The map before the data*'s look and people from [`../../../enterprise-architecture/shared/`](../../../enterprise-architecture/shared/), and this series' own kit, [`../../shared/src/psa.js`](../../shared/src/psa.js), which every film of the series bundles: its title and end cards and mark, Ravi Menon, Japan's coast and the Tōkaidō, the road at dusk, its stations, horses and walkers, and the platform with each domain's logic set down on it. Only what is new for this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its source files (the series' kit, then `scenes.js`), the words the voice respells (Tomás, Ravi, Edo, Tōkaidō, shogunate, Odawara, Mishima, Hakone), and the moment its poster shows (the mountain stage made two). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and two wordless moments: the drawing whole, its last part lit, then the title; and the mountain at night, every station lit, then the end card. |
| `src/scenes.js` | The ten chapters, and what they share (prefixed `p2_`): the eight parts and what each does (`P2_ALONG`, `P2_ACROSS`), the products under them (`P2_PROD`, `P2_OBS`), the drawing that stays put from chapter to chapter (`p2_ref`), the platform as the first film drew it, with each domain watching its own (`p2_slab`), the road at dusk, an inn and the clerk's book (`p2_road`, `p2_inn`, `P2_BOOK`), a load moved from horse to horse (`p2_pack`), the map with its stations (`p2_map`), the mountain stage from the side with its lake, cedars and stations (`p2_mountain`), the opening's eight tiles (`p2_tiles`), the platform's bill, its own tables and its dashboard (`p2_bill`, `p2_table`, `p2_dash`), and the practice map's work package and associations (`p2_work`, `p2_assoc`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: the town band of about 1600, a cornett and a consort of sackbuts, in G major, E minor for what goes wrong, tuned pure from G; the series' mark, *the relay*, in G (the cornett's G, A and D rising, the D taken an octave down by a sackbut and carried to G), as the first load is moved on, under the title and at the close; no instrument, scale or sound of Japan, and the road heard only as hooves, feet and the clerk's paper. Music under the opening story, then only now and then; each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film: *The map before the data*'s `build.py`, *From words to data*'s other tools (its `legible.py`, with `--overlaps`, and its `music.py`), and the governance films' checks (`twice.py` and `hands.py` in `tools/check.py`; `quiet.py`, with `held.py`, in `tools/quiet.py`). |

## Rebuild

As for [*Day one*](../../../enterprise-architecture/1-day-one/source/README.md), from this folder, `films/platform-and-solution-architecture/2-inside-the-platform/source/`; then `python tools/quiet.py` after `tools/audio.py`, to check the sound. The video is `dist/inside-the-platform.mp4`.

## Publish

As for [*Day one*](../../../enterprise-architecture/1-day-one/source/README.md#publish): `python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/inside-the-platform/` and draws the poster, then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/inside-the-platform/think.en.js` and `think.es.js`: it stops after `products`, `nothing` and `whose`. Progress is stored under `ld-inside-the-platform`.
