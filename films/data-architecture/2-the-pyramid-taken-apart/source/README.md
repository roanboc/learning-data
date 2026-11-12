# Rebuilding The pyramid, taken apart

*The pyramid, taken apart*, film 2 of 6 of *Data architecture*, is generated from code like the films of *The map before the data*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/da.js`](../../shared/src/da.js) (its title card, Inés Duarte, Project Cybersyn's pictures and the information layer's elements), which this film uses as they are. Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its own source files, the words the voice respells (Inés, Cyberstride, Cybersyn, DAMA, Ackoff), the chapter its opening story fills (`story`), and the moment its poster shows (the redrawing, with arrows both ways). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the warnings beside their factories' normal, then the title; the redrawing on the data practice on the map; and the next question, then the end card. |
| `src/plan.js` | This film's pictures (prefixed `d2_`): Chile at night, cards and telex strips, the mills and their usual days, the wall of figures, the software's chart with its normal band, the warnings, the clock and the printout; the utility's dial and the systems under it, the pinned question; the pyramid in glass, the poet's card and the dates; the bars, line by line; the definition card, the outage system's table of cuts, the meter's readings, the book; the column of the redrawing and its arrows (`D2_CHAIN`, `d2_chain`, `d2_link`), and the business object card (`d2_bo`). Helpers the series' kit doesn't have are copied here with the `d2_` prefix, so nothing in `da.js` changes for this film. |
| `src/scenes.js` | The eight chapters, and what they share: the camera on the wall (`d2_cam`) and its four places (the pyramid, what it gets right to its right, the question under it, and no raw data under that), the pyramid (`d2_pyramid`, `d2_split`), what it gets right (`d2_R`), the question first (`d2_F`), no raw data (`d2_W`), and the data practice on the map (`d2_map`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: a bowed psaltery and a slate lithophone, tuned pure in G major, with E minor for what goes wrong; the series' mark at the title, after the redrawing and at the end card, and the film's own figure, *both ways*, down on the psaltery and back up on the stones. Music under the opening story, then only at a chapter's turn, a moment on screen or a pause without words. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' `lang.py`, `build.py` and `quiet.py` (the governance films' sound check, with `held.py`), and From words to data's other tools and instruments. |

## Rebuild

From this folder, `films/data-architecture/2-the-pyramid-taken-apart/source/`:

```
python tools/tts.py          # the voice, and src/vodur.js (only lines whose words changed are voiced again)
python tools/build.py        # dist/render.html, dist/film.js, dist/film.html
python tools/captions.py     # ../captions/en.srt and en.vtt; FILM_LANG=es for the Spanish
python tools/audio.py        # dist/soundtrack.mp3, from tools/score.py and the voice
python tools/check.py        # every frame draws, and nothing shows twice where chapters meet
python tools/legible.py --overlaps
python tools/pace.py
python tools/quiet.py        # the sound follows the series' rules
python tools/render.py       # the video, dist/the-pyramid-taken-apart.mp4, in resumable chunks
```

## Publish

`python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/the-pyramid-taken-apart/` and draws the poster (`--keep-sound` when only the pictures changed), then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/the-pyramid-taken-apart/think.en.js` and `think.es.js`: it stops after `first`, `levels` and `both`. Progress is stored under `ld-the-pyramid-taken-apart`.
