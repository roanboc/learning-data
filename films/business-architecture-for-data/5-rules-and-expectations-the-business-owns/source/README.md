# Rebuilding Rules and expectations the business owns

*Rules and expectations the business owns*, film 5 of 5 of *Business architecture for data*, is generated from code like *The map before the data*: the same engine, components, voice and tools (`films/enterprise-architecture/shared/tools/`, which run From words to data's), with the series' own components in [`../../shared/src/ba.js`](../../shared/src/ba.js). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its own source files (the series' `ba.js`, then `scenes.js`), the words the voice respells (Tomás, qanat, Sehdeh, Dastgerd, Parvar, Karton, muqannis, mirab, the 1960s and the 1600s, ISO 9000, ArchiMate, BPMN, DMN), its opening story (`"story": ["outlets"]`, where music may play throughout) and the moment its poster shows (the rule at the end of *Late, for whom?*: a reading late only against the step that needs it). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the title, once the opening story has reached the utility; the two answers to "late, for whom?", held side by side; and the series' part drawn on Tomás's map, then the end card. |
| `src/scenes.js` | The nine chapters, and this film's pictures (prefixed `b5_`): Sehdeh from above, its qanat's shafts, basin, three outlets and hamlets (`B5_CHAIN`, `B5_HAM`, `b5_plain`); the qanat cut away, the silt, the diggers and the mirab at the fields' gates (`b5_section`, `B5_GATES`, `B5_OWNERS`, `b5_lamp`); the deep well and its pump, and the water fallen (`b5_well`, `b5_fallen`); the shares, eight, eight and nine, whatever comes in (`b5_bars`); *Rules with a home*'s rules on their cards, with a requirement's glyph (`B5_RULES`, `b5_rule`, `b5_req`); the chain from policy to record (`B5_CH`, `b5_chainArrow`); check readings at level three in BPMN (`B5_BP`, `b5_bpmn`) and its decision table in DMN (`B5_DT`, `B5_DROWS`, `b5_table`); billing's day, the late readings and each step's card (`b5_day`, `b5_stepCard`, `b5_mark`); billing's expectation, the check built from it and ArchiMate's realisation (`b5_expect`, `b5_check`, `b5_realise`); Sehdeh's outlets in a card (`b5_inset`); the data product, its service and contract, with ArchiMate's access and aggregation lines (`b5_pacc`, `b5_agg`); what keeps a practice maturing (`b5_loop`); the series' part of Tomás's map (`b5_rbr`); and where the chapters meet (`CHAPTER_JOINS`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: a flugelhorn and a tenor saxophone, alone, in D major, tuned pure from D, the flugelhorn carrying the opening story's line and a note as each thing lands, and the saxophone's low line under it; the film's figure, *eight, eight and nine* (D, D and E, the E 9/8 of the D), where the shares are set, where a dry year gives each hamlet less but its share, where the expectation comes first and where the shares held; and the series' mark (D, A, then F sharp held) under the title and the end card; the desert's wind, the water, the silt, the diggers' windlass and pick, the fields' gates and the deep well's steel and pump in the story, and cards, paper, a pen, a stamp, knocks and taps at the utility. Each sound fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs The map before the data's tool (`films/enterprise-architecture/shared/tools/run.py`) on this film; `tools/quiet.py`, after `tools/audio.py`, runs the governance films' check of the sound (`films/data-governance/shared/tools/quiet.py`). |

## Rebuild

From this folder, `films/business-architecture-for-data/5-rules-and-expectations-the-business-owns/source/`, with the packages in `requirements.txt` and the voice's models in `films/inner-life-of-data/source/models/`:

```
python tools/tts.py        # the voice, into build/vo/, and src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/audio.py      # the score and the mix: dist/soundtrack.mp3
python tools/build.py      # again, with the soundtrack
python tools/check.py      # every frame draws; nothing shows twice where chapters meet
python tools/legible.py    # no text under 28 px on a phone
python tools/pace.py       # words a minute, voice share and pauses
python tools/quiet.py      # the sound's rules
python tools/captions.py   # captions/en.srt and en.vtt; FILM_LANG=es for es.srt and es.vtt
python tools/stills.py     # stills for review, into build/stills/
python tools/render.py     # the video, dist/rules-and-expectations-the-business-owns.mp4 (the release workflow renders it)
```

## Publish

`python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/rules-and-expectations-the-business-owns/` and draws the poster; then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/rules-and-expectations-the-business-owns/think.en.js` and `think.es.js`: it stops after `decide`, `set` and `source`. Progress is stored under `ld-rules-and-expectations-the-business-owns`. The soundtrack's pointer is `../audio.json` (`python site-tools/media.py index --film rules-and-expectations-the-business-owns-en`).
