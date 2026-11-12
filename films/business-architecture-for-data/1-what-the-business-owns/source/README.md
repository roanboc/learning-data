# Rebuilding What the business owns

*What the business owns*, film 1 of 5 of *Business architecture for data*, is generated from code like *The map before the data*: the same engine, components, voice and tools (`films/enterprise-architecture/shared/tools/`, which run From words to data's), with the series' own components in [`../../shared/src/ba.js`](../../shared/src/ba.js). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its own source files (the series' `ba.js`, then `scenes.js`), the words the voice respells (Tomás, Ama, qanat, mirab, muqannis, Gonabad, Qasabeh, BIZBOK), its opening story (`"story": ["water"]`, where music may play throughout) and the moment its poster shows (the qanat from above, the data team keeping the channel and the business owning the water). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and two wordless moments: the village from above, then the title; and Tomás's next note, then the end card. |
| `src/scenes.js` | The nine chapters, and this film's pictures (prefixed `b1_`): one turn of the water in one town, twelve days with the first opened into its fifteen shares (`b1_turn`); a digger's lamp (`b1_lamp`); the village's gates and shareholders (`B1_GATES`, `B1_OWNERS`); the qanat cut away, as each moment of the story leaves it (`b1_section`); the three layers this series covers on Tomás's map, and the brackets beside it (`B1_INSIDE`, `b1_rbr`); the ticket, the three counts and the 2025 reports (`B1_TICKET`, `B1_COUNTS`, `b1_report`); a business object as its owner defines it, the data team's merged table and a window onto the village (`b1_object`, `b1_script`, `b1_inset`); who owns what (`B1_BIZ`, `B1_TEAM`); BIZBOK's core, what sits around it and what lies beyond data, and the films to come with a numbered badge on each part they draw on (`B1_CORE`, `B1_AROUND`, `B1_WIDER`, `b1_badge`, `B1_NEXT`); and where *Three answers* glides on into *Whose meaning?* (`CHAPTER_JOINS`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: the series' consort of viols, here the bass viol bowed under the opening story and plucked at the utility, with the series' mark (D, A, then F sharp held) under the title and the end card; the desert's wind, the water, the earth, a windlass and a gate in the story, and paper, cards, keys and a pen at the utility. Each sound fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs The map before the data's tool (`films/enterprise-architecture/shared/tools/run.py`) on this film; `tools/quiet.py`, after `tools/audio.py`, runs the governance films' check of the sound (`films/data-governance/shared/tools/quiet.py`). |

## Rebuild

From this folder, `films/business-architecture-for-data/1-what-the-business-owns/source/`, with the packages in `requirements.txt` and the voice's models in `films/inner-life-of-data/source/models/`:

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
python tools/render.py     # the video, dist/what-the-business-owns.mp4 (the release workflow renders it)
```

## Publish

`python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/what-the-business-owns/` and draws the poster; then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/what-the-business-owns/think.en.js` and `think.es.js`: it stops after `whose`, `owns` and `answer`. Progress is stored under `ld-what-the-business-owns`. The soundtrack's pointer is `../audio.json` (`python site-tools/media.py index --film what-the-business-owns-en`).
