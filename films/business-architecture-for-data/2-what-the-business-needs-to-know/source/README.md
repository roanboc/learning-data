# Rebuilding What the business needs to know

*What the business needs to know*, film 2 of 5 of *Business architecture for data*, is generated from code like *The map before the data*: the same engine, components, voice and tools (`films/enterprise-architecture/shared/tools/`, which run From words to data's), with the series' own components in [`../../shared/src/ba.js`](../../shared/src/ba.js). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its own source files (the series' `ba.js`, then `scenes.js`), the words the voice respells (Tomás, qanat, Mahan, Kerman, CIM, IEC, ArchiMate, BIAN, HERM), its opening story (`"story": ["shares"]`, where music may play throughout) and the moment its poster shows (the connection point in glass, with the reference models' names kept beside it). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: Mahan's day of water, each of its fifteen shares lit in turn, then the title; hosting capacity put back on the map, its owner named and no data yet; and Tomás's next note, then the end card. |
| `src/scenes.js` | The nine chapters, and this film's pictures (prefixed `b2_`): the village cut away, its gates and shareholders (`b2_village`, `B2_GATES`, `B2_OWNERS`); the panel above it, in one place all through the story (`b2_panel`): one day of water in its owners' shares (`b2_daybar`), two turns of the water (`b2_turns`) and the deeds of the 1960s along one day (`B2_DEEDS`, `b2_deeds`); Mahan's days of water, the fifteen shares of one qanat and the three men's qanat beside it (`b2_mahanBar`, `b2_three`); Tomás's wall, its capabilities, the concepts beneath them, their domains and owners (`B2_CAPX`, `B2_NOTES`, `B2_LOC`, `B2_GROUPS`, `B2_DOM`, `b2_wall`, `b2_draft`, `b2_done`, `B2_ALL`); a concept lifted off the wall to be read, its name drawn only once (`b2_lift`); the industry's reference models, IEC 61968-1's business functions and the Smart Grid Architecture Model's planes (`B2_REF`, `B2_IRM`, `b2_fnGlyph`, `b2_sgam`); what each capability needs (`B2_NEED`, `B2_NEEDW`); the street of houses with solar on their roofs (`B2_HOUSES`, `b2_street`); the glossary (`B2_GLOSS`); and where the chapters meet (`CHAPTER_JOINS`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: a clavichord and an oboe in D major, tuned pure from D, the clavichord spreading its chords under the opening story and at a chapter's turn; the film's figure once (the oboe's A, answered by the clavichord's), and the series' mark (D, A, then F sharp held) under the title and the end card; the desert's wind, the water, the fields' gates and the deeds' paper slips in the story, and cards, paper, keys and a pen at the utility. Each sound fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs The map before the data's tool (`films/enterprise-architecture/shared/tools/run.py`) on this film; `tools/quiet.py`, after `tools/audio.py`, runs the governance films' check of the sound (`films/data-governance/shared/tools/quiet.py`). |

## Rebuild

From this folder, `films/business-architecture-for-data/2-what-the-business-needs-to-know/source/`, with the packages in `requirements.txt` and the voice's models in `films/inner-life-of-data/source/models/`:

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
python tools/render.py     # the video, dist/what-the-business-needs-to-know.mp4 (the release workflow renders it)
```

## Publish

`python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/what-the-business-needs-to-know/` and draws the poster; then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/what-the-business-needs-to-know/think.en.js` and `think.es.js`: it stops after `blank`, `words` and `missing`. Progress is stored under `ld-what-the-business-needs-to-know`. The soundtrack's pointer is `../audio.json` (`python site-tools/media.py index --film what-the-business-needs-to-know-en`).
