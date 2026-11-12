# Rebuilding Where each fact is born

*Where each fact is born*, film 3 of 6 of *Data architecture*, is generated from code like the films of *The map before the data*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/da.js`](../../shared/src/da.js) (its title card, Inés Duarte, Project Cybersyn's pictures and the information layer's elements), which this film uses as they are. Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its own source files, the words the voice respells (Inés, Cybersyn, DAMA), the chapter its opening story fills (`story`), and the moment its poster shows (the data practice on the map, each data object naming its home). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the factory's telex reaching Santiago as a copy, then the title; the data practice on the map, its copies lit along their lines back; and the family's call finding the cut, then the end card. |
| `src/plan.js` | This film's pictures (prefixed `d3_`): Chile at night, cards and telex strips, the software's chart with today's slot, the clock, the gold star where a fact is born (`d3_star`); the utility's systems as glass records (`d3_rec`, `D3_CW`), copies drawn fainter with a dashed line back (`d3_back`), a record moving as a dashed outline (`d3_ghost`); the home at 14 Quarry Lane, the calendar, the sign-up form, the call bubble, the dial and the card of homes created twice; the matrix of creates and copies (`D3_SYS`, `D3_ROWS`, `d3_matrix`, `d3_cell`); and the data practice on the map (`D3_DO`, `d3_map`). Helpers the series' kit doesn't have are copied here with the `d3_` prefix, so nothing in `da.js` changes for this film. |
| `src/scenes.js` | The eight chapters, and what they share: the four systems round the home (`d3_Q`, their places in `D3_BL`, `D3_NM`, `D3_CS` and `D3_OU`), the matrix to the right of them (`D3_X2`), and the map below it (`D3_Y1`), so the camera glides between them in one room. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: glass bars struck with yarn and a monochord plucked at its middle, tuned pure in C major, with A minor for what goes wrong; the series' mark at the title, at the rule and at the end card, and the film's own figure, *born once*: the monochord where a fact is born, and the glass bars ringing its own harmonics above it, as copies born of it. Music under the opening story, then only at a chapter's turn, a moment on screen or a pause without words. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' `lang.py`, `build.py` and `quiet.py` (the governance films' sound check, with `held.py`), and From words to data's other tools and instruments. |

## Rebuild

From this folder, `films/data-architecture/3-where-each-fact-is-born/source/`:

```
python tools/tts.py          # the voice, and src/vodur.js (only lines whose words changed are voiced again)
python tools/build.py        # dist/render.html, dist/film.js, dist/film.html
python tools/captions.py     # ../captions/en.srt and en.vtt; FILM_LANG=es for the Spanish
python tools/audio.py        # dist/soundtrack.mp3, from tools/score.py and the voice
python tools/check.py        # every frame draws, and nothing shows twice where chapters meet
python tools/legible.py --overlaps
python tools/pace.py
python tools/quiet.py        # the sound follows the series' rules
python tools/render.py       # the video, dist/where-each-fact-is-born.mp4, in resumable chunks
```

## Publish

`python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/where-each-fact-is-born/` and draws the poster (`--keep-sound` when only the pictures changed), then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/where-each-fact-is-born/think.en.js` and `think.es.js`: it stops after `born`, `lineage` and `three`. Progress is stored under `ld-where-each-fact-is-born`.
