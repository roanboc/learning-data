# Rebuilding One platform, or many

*One platform, or many*, film 3 of 8 of *Platform and solution architecture*, is generated from code like *Day one*: the same engine, components, voice and tools, *The map before the data*'s look and people from [`../../../enterprise-architecture/shared/`](../../../enterprise-architecture/shared/), and this series' own kit, [`../../shared/src/psa.js`](../../shared/src/psa.js), which every film of the series bundles: its title and end cards and mark, Ravi Menon, Japan's coast and the five roads, the road at dusk, its stations, horses and walkers, and the platform with each domain's logic set down on it. Only what is new for this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its source files (the series' kit, then `scenes.js`), the words the voice respells (Tomás, Ama, Ravi, Yodo, Ise, Oda Nobunaga, Toyotomi Hideyoshi, Tokugawa, shogunate, Zhamak Dehghani, Kuwana, Hinaga, Tōkaidō), and the moment its poster shows (the two platforms and the third product, each with its own rules). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and two wordless moments: one platform with every domain on it, then the title; and the road between Kuwana and Hinaga, open, then the end card. |
| `src/scenes.js` | The ten chapters, and what they share (prefixed `p3_`): the utility's domains and generation (`P3_DOM`, `P3_GEN`), the four sets of rules every platform brings and their glyphs (`P3_RULES`, `p3_glyph`, `p3_band`, `p3_mini`, `p3_face`), the Yodo and the road to Ise on a map whose camera glides (`p3_cam`, `p3_river`, `p3_bars`, `p3_land`), a barrier on the river and a boat that pays at it (`p3_barrier`, `p3_boat`), a barrier on the road at dusk, an inn (`p3_gate`, `p3_inn`), the domains of the 1600s (`p3_domains`), the two platforms and their domains' blocks (`p3_two`), the three columns of rules side by side (`p3_cols`), complexity nobody manages (`p3_tangle`), the utility's cloud storage (`p3_store`), and the practice map's work package (`p3_work`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: an organ's open metal pipes, its principal, with a regal, the small reed organ of the 1500s, in C major, A minor for what goes wrong, tuned pure from C; the series' mark, *the relay*, in C (the organ's C, D and G rising, the G taken an octave down by the regal and carried to C), under the title and the end card; the film's own figure, a phrase the regal plays stopped at every barrier and the organ plays through, on one wind, in the opening and at the end; no instrument, scale or sound of Japan, and the river and the road heard only as water, coins, a wooden bar, feet and hooves. Music under the opening story, then only now and then; each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film: *The map before the data*'s `build.py`, *From words to data*'s other tools (its `legible.py`, with `--overlaps`, and its `music.py`), and the governance films' checks (`twice.py` and `hands.py` in `tools/check.py`; `quiet.py`, with `held.py`, in `tools/quiet.py`). |

## Rebuild

As for [*Day one*](../../../enterprise-architecture/1-day-one/source/README.md), from this folder, `films/platform-and-solution-architecture/3-one-platform-or-many/source/`; then `python tools/quiet.py` after `tools/audio.py`, to check the sound. The video is `dist/one-platform-or-many.mp4`.

## Publish

As for [*Day one*](../../../enterprise-architecture/1-day-one/source/README.md#publish): `python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/one-platform-or-many/` and draws the poster, then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/one-platform-or-many/think.en.js` and `think.es.js`: it stops after `layers`, `mesh` and `unavoid`. Progress is stored under `ld-one-platform-or-many`.
