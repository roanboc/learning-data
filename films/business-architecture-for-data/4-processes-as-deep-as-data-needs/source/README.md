# Rebuilding Processes, as deep as data needs

*Processes, as deep as data needs*, film 4 of 5 of *Business architecture for data*, is generated from code like *The map before the data*: the same engine, components, voice and tools (`films/enterprise-architecture/shared/tools/`, which run From words to data's), with the series' own components in [`../../shared/src/ba.js`](../../shared/src/ba.js). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its own source files (the series' `ba.js`, then `scenes.js`), the words the voice respells (Tomás, qanat, Mahan, Kerman, mirab, Farah, SIPOC, APQC, BPMN), its opening story (`"story": ["turns"]`, where music may play throughout) and the moment its poster shows (check readings at level three, with the estimated reading born in the estimate step). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the levels of the cycle, then the title; Farah's count, with the households that had estimates for four weeks or more; and Tomás's next note, then the end card. |
| `src/scenes.js` | The nine chapters, and this film's pictures (prefixed `b4_`): the cycle of turns as a ring of twelve days and one day's fifteen shares (`b4_cycle`), another qanat's twelve dividers (`b4_dividers`), the village with its gates and owners (`b4_village`, `B4_OWNERS`), the lots drawn for a place in the cycle (`b4_lots`), the cycle kept in levels down to single minutes (`b4_ladder`), and the water clock (`b4_clock`); Tomás's matrix (`b4_matrix`); Grace's process map in four bands (`B4_PMAP`, `b4_pmap`); the tree of levels (`b4_tree`, `b4_mini`); meter to cash at level two, its SIPOC, the concepts and ArchiMate's access lines (`b4_row`, `b4_sipoc`, `b4_con`, `b4_acc`); the meters, a household's bills and BPMN's shapes (`b4_meter`, `b4_bills`, `b4_legend`); check readings at level three in BPMN (`b4_bpmn`, `b4_data`), the data team's table and the glossary's entry (`b4_table`, `b4_gloss`); the data team's own processes on the data practice's map (`b4_pacc`); and where the chapters meet (`CHAPTER_JOINS`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: a cylinder music box and a cello, alone, in D major, tuned pure from D, the music box spreading its chords under the opening story and at a chapter's turn, and the cello's plain line under it; the film's figure twice (the cello's A, F sharp and D, with only the middle note divided by the music box into six quick notes, where a share goes down to minutes and where check readings goes to level three), and the series' mark (D, A, then F sharp held) under the title and the end card; the desert's wind, the water, the fields' gates, the lots and the water clock's cup in the story, and cards, paper, a pen, a stamp, knocks and taps at the utility. Each sound fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs The map before the data's tool (`films/enterprise-architecture/shared/tools/run.py`) on this film; `tools/quiet.py`, after `tools/audio.py`, runs the governance films' check of the sound (`films/data-governance/shared/tools/quiet.py`). |

## Rebuild

From this folder, `films/business-architecture-for-data/4-processes-as-deep-as-data-needs/source/`, with the packages in `requirements.txt` and the voice's models in `films/inner-life-of-data/source/models/`:

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
python tools/render.py     # the video, dist/processes-as-deep-as-data-needs.mp4 (the release workflow renders it)
```

## Publish

`python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/processes-as-deep-as-data-needs/` and draws the poster; then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/processes-as-deep-as-data-needs/think.en.js` and `think.es.js`: it stops after `levels`, `cash` and `flow`. Progress is stored under `ld-processes-as-deep-as-data-needs`. The soundtrack's pointer is `../audio.json` (`python site-tools/media.py index --film processes-as-deep-as-data-needs-en`).
