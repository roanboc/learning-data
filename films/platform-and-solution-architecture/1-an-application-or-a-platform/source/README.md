# Rebuilding An application or a platform?

*An application or a platform?*, film 1 of 8 of *Platform and solution architecture*, is generated from code like *Day one*: the same engine, components, voice and tools, *The map before the data*'s look and people from [`../../../enterprise-architecture/shared/`](../../../enterprise-architecture/shared/), and this series' own kit, [`../../shared/src/psa.js`](../../shared/src/psa.js), which every film of the series bundles: its title and end cards and mark, Ravi Menon, Japan's coast and the Gokaidō, the road at dusk, its stations, horses, walkers and palanquin, the order's paper, and the platform with each domain's logic set down on it. Only what is new for this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its source files (the series' kit, then `scenes.js`), the words the voice respells (Tomás, Ama, Ravi, Tokugawa Ieyasu, Edo, Gokaidō, Tōkaidō, shogunate, IT), and the moment its poster shows (the road at dusk, everyone on it). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and two wordless moments: the road at dusk, its travellers walking on, then the title; and the five roads lit at night, then the end card. |
| `src/scenes.js` | The eleven chapters, and what they share (prefixed `p1_`): the four domains and their owners (`P1_DOM`), the domains of 1601 as a patchwork over the land (`p1_domains`), a traveller or a letter as a light along the road (`p1_runner`), the road at dusk and the utility's room (`p1_road`, `p1_room`), a small copy of Tomás's map (`p1_miniMap`), the order each station received (`P1_ORDER`), the hundred and forty systems (`p1_tiles`), the platform product and the service round it (`P1_PROD`, `P1_AROUND`, `p1_product`), the capabilities (`P1_CAPS`), the measure's chart and its sources (`p1_chart`, `p1_src`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: a continuo, a harpsichord with a bassoon under it, in D major, B minor for what goes wrong, tuned pure from D; the series' mark, *the relay* (three notes rising on the harpsichord, the last taken by the bassoon and carried down), as the letter is first relayed, under the title and at the close; no instrument, scale or sound of Japan, and the road heard only as feet on the earth and a runner passing. Music under the opening story, then only now and then; each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film: *The map before the data*'s `build.py`, *From words to data*'s other tools (its `legible.py`, with `--overlaps`, and its `music.py`), and the governance films' checks (`twice.py` and `hands.py` in `tools/check.py`; `quiet.py`, with `held.py`, in `tools/quiet.py`). |

## Rebuild

As for [*Day one*](../../../enterprise-architecture/1-day-one/source/README.md), from this folder, `films/platform-and-solution-architecture/1-an-application-or-a-platform/source/`; then `python tools/quiet.py` after `tools/audio.py`, to check the sound. The video is `dist/an-application-or-a-platform.mp4`.

## Publish

As for [*Day one*](../../../enterprise-architecture/1-day-one/source/README.md#publish): `python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/an-application-or-a-platform/` and draws the poster, then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/an-application-or-a-platform/think.en.js` and `think.es.js`: it stops after `erp`, `minutes` and `owner`. Progress is stored under `ld-an-application-or-a-platform`.
