# Rebuilding Who creates it, who owns it

*Who creates it, who owns it*, film 3 of 5 of *Business architecture for data*, is generated from code like *The map before the data*: the same engine, components, voice and tools (`films/enterprise-architecture/shared/tools/`, which run From words to data's), with the series' own components in [`../../shared/src/ba.js`](../../shared/src/ba.js). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its own source files (the series' `ba.js`, then `scenes.js`), the words the voice respells (Tomás, qanat, Mahan, Kerman, mirab, Vakilabad, CRUD, Farah), its opening story (`"story": ["owners"]`, where music may play throughout) and the moment its poster shows (the matrix, with the connection point's C ringed and Grace's name landing under its column). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the Vakilabad's water, every share with its owner, then the title; a new home switched on, one account opened by retail and one first bill; and Tomás's next note, then the end card. |
| `src/scenes.js` | The nine chapters, and this film's pictures (prefixed `b3_`): the turn of the Vakilabad's water as a dial, its six shares, the keeper's share and the shares split finer (`b3_disc`, `b3_ring`, `b3_six`), the three men and the counts (`b3_three`, `b3_count`), the record of its owners (`b3_ledger`); the village with its owners, their meeting and votes, the mirab at each gate in its turn and his helpers (`b3_village`, `b3_mirab`, `b3_vote`, `B3_GATES`); the wall Tomás's next note comes to (`b3_wall`); the matrix, its capabilities, concepts, letters, owners and stewards (`B3_COLS`, `B3_CRUD`, `B3_STWN`, `b3_matrix`, `b3_lab`, `b3_mFull`); the new home, its accounts and first bills (`b3_home`); the owner's, the steward's and the data team's cards, each with its likeness on the qanat (`b3_role`, `b3_pic`, `b3_picGate`, `b3_picDigger`); the outage table and Tomás's questions (`b3_table`, `b3_q`); and where the chapters meet (`CHAPTER_JOINS`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: an English concertina and a low clarinet in D major, tuned pure from D, the concertina pressing its chords under the opening story and at a chapter's turn, and the clarinet coming in with the mirab and with each steward after him; the film's figure once (both on the same D where two capabilities create the account, the clarinet stepping down to B where the business decides), and the series' mark (D, A, then F sharp held) under the title and the end card; the desert's wind, the water, the tunnel's roof falling in, the fields' gates, the owners' votes and the record's pen in the story, and cards, paper, keys and a pen at the utility. Each sound fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs The map before the data's tool (`films/enterprise-architecture/shared/tools/run.py`) on this film; `tools/quiet.py`, after `tools/audio.py`, runs the governance films' check of the sound (`films/data-governance/shared/tools/quiet.py`). |

## Rebuild

From this folder, `films/business-architecture-for-data/3-who-creates-it-who-owns-it/source/`, with the packages in `requirements.txt` and the voice's models in `films/inner-life-of-data/source/models/`:

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
python tools/render.py     # the video, dist/who-creates-it-who-owns-it.mp4 (the release workflow renders it)
```

## Publish

`python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/who-creates-it-who-owns-it/` and draws the poster; then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/who-creates-it-who-owns-it/think.en.js` and `think.es.js`: it stops after `decides`, `stewards` and `unwritten`. Progress is stored under `ld-who-creates-it-who-owns-it`. The soundtrack's pointer is `../audio.json` (`python site-tools/media.py index --film who-creates-it-who-owns-it-en`).
