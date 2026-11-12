# Rebuilding Who owns which data

*Who owns which data*, film 5 of 6 of *Data architecture*, is generated from code like the films of *The map before the data*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/da.js`](../../shared/src/da.js) (its title card, Inés Duarte, Project Cybersyn's pictures and the information layer's elements), which this film uses as they are. Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its own source files, the words the voice respells (Inés, Cybersyn, CORFO, Allende, Ama), the chapter its opening story fills (`story`), and the moment its poster shows (each factory's own time, chosen by the engineers, with Beer's *designing freedom*). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the catalogue's 300 tables, each with the data team's chip, then the title; the data product drawn on the data practice on the map; and the claimed products in the catalogue, then the end card. |
| `src/plan.js` | This film's pictures (prefixed `d5_`): Chile at night, in lamp-light (`d5_night`), its cards and notes (`d5_card`, `d5_note`), the five numbers (`d5_five`), a telex strip (`d5_strip`), the clock for a factory's set time (`d5_clock`), and the levels a warning could go to, the centre in Santiago, that industry's committee at CORFO and five factories with their managers (`d5_hier`); the utility's catalogue, its tables and their owners' chips (`d5_catalogue`, `d5_chip`), hosting capacity's table, the engineers' method and the website (`d5_table`, `d5_method`, `d5_site`), the calendar (`d5_cal`), the ninety homes (`d5_homes`) and the verdicts (`d5_verdict`); a data product (`d5_prod`), its five things (`d5_productCard`) and the one catalogue's list (`d5_prodList`); the four words (`D5_STYLES`, `d5_style`); the baseline and the target (`d5_panel`), the roadmap (`d5_road`) and the archive (`d5_archive`); and the data practice on the map, its domains, their concepts and products (`D5_GR`, `d5_map`). |
| `src/scenes.js` | The eight chapters, and the places they share in the room: the catalogue (`d5_K`), hosting capacity's story to its right (`d5_D`), the rule under the catalogue (`d5_R`), the data product under hosting capacity (`d5_P`), the four words to its right (`d5_F`), the target and its gaps under them (`d5_G`), and the data practice on the map under the product (`d5_map`), so the camera glides between them. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: rototoms, small tuned drums struck softly with felt mallets, each tuned on its own stand, and two timpani, B flat and F, struck softly and left to ring only where something isn't solved in time and goes up, tuned pure in B flat major, with G minor and D minor for what goes wrong; the series' mark at the title and the end card, and the film's own figure, *in its own time*: a drum phrase ends open and a drum closes it, or, when nobody solves it in time, a rest and the timpani. Music under the opening story, then only at a chapter's turn, a moment on screen or a pause without words. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' `lang.py`, `build.py` and `quiet.py` (the governance films' sound check, with `held.py`), and From words to data's other tools and instruments. |

## Rebuild

From this folder, `films/data-architecture/5-who-owns-which-data/source/`:

```
python tools/tts.py          # the voice, and src/vodur.js (only lines whose words changed are voiced again)
python tools/build.py        # dist/render.html, dist/film.js, dist/film.html
python tools/captions.py     # ../captions/en.srt and en.vtt; FILM_LANG=es for the Spanish
python tools/audio.py        # dist/soundtrack.mp3, from tools/score.py and the voice
python tools/check.py        # every frame draws, and nothing shows twice where chapters meet
python tools/legible.py --overlaps
python tools/pace.py
python tools/quiet.py        # the sound follows the series' rules
python tools/render.py       # the video, dist/who-owns-which-data.mp4, in resumable chunks
```

## Publish

`python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/who-owns-which-data/` and draws the poster (`--keep-sound` when only the pictures changed), then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/who-owns-which-data/think.en.js` and `think.es.js`: it stops after `default`, `knows` and `words`. Progress is stored under `ld-who-owns-which-data`.
