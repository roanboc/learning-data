# Rebuilding Between the business and the systems

*Between the business and the systems*, film 1 of 6 of *Data architecture*, is generated from code like the films of *The map before the data*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/da.js`](../../shared/src/da.js) (its title card, Inés Duarte, Project Cybersyn's pictures and the information layer's elements), which this film uses as they are. Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its own source files, the words the voice respells (Tomás, Inés, CORFO, Cybersyn, ArchiMate, TOGAF, DAMA), the chapter its opening story fills (`story`), and the moment its poster shows (connection point and its six records). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the engineers' drawing, then the title; the data practice's two layers, with every line owned; and the outage text reaching every home, then the end card. |
| `src/plan.js` | This film's pictures (prefixed `d1_`): Chile at night and its map in lamp-light, CORFO's card, the calendar and the January report that arrives six months late, the table where CORFO's team and Stafford Beer sit, the textile mill and its hall, the mill's drawing and the people who work there; the utility's wall, its sheets and pins, the three sheets of "information architecture" (a website's pages, an analyst's model, TOGAF's cycle of phases), DAMA's book and its two words, TOGAF's four domains and ArchiMate's bands; the model's records and their routes to the business object, the faint and the owned lines, the ID chip, the storm, the homes, the outage text and the two addresses; and the life chart of the systems and the connection points. |
| `src/scenes.js` | The eight chapters, and what they share: the camera on the wall (`d1_cam`), Inés's look (`d1_face`), Tomás's map (`d1_map`), the team's decision (`d1_rule`), the model with its business object, its owner, its six records and their lines (`d1_model5`, `D1_X0`, `D1_ORD`), and the homes (`D1_HOMES`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: an anémocorde, a keyboard whose strings are sounded by wind, and its own bass strings, tuned pure in E major, with C-sharp minor for what goes wrong; the series' mark at the title, where the map's layer is drawn, where Inés drew the business first and at the end card. Music under the opening story, then only at a chapter's turn, a moment on screen or a pause without words. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' `lang.py`, `build.py` and `quiet.py` (the governance films' sound check, with `held.py`), and From words to data's other tools and instruments. |

## Rebuild

From this folder, `films/data-architecture/1-between-the-business-and-the-systems/source/`:

```
python tools/tts.py          # the voice, and src/vodur.js (only lines whose words changed are voiced again)
python tools/build.py        # dist/render.html, dist/film.js, dist/film.html
python tools/captions.py     # ../captions/en.srt and en.vtt; FILM_LANG=es for the Spanish
python tools/audio.py        # dist/soundtrack.mp3, from tools/score.py and the voice
python tools/check.py        # every frame draws
python tools/legible.py --overlaps
python tools/pace.py
python tools/quiet.py        # the sound follows the series' rules
python tools/render.py       # the video, dist/between-the-business-and-the-systems.mp4, in resumable chunks
```

## Publish

`python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/between-the-business-and-the-systems/` and draws the poster (`--keep-sound` when only the pictures changed), then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/between-the-business-and-the-systems/think.en.js` and `think.es.js`: it stops after `dama`, `point` and `own`. Progress is stored under `ld-between-the-business-and-the-systems`.
