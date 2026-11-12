# Rebuilding How it travels

*How it travels*, film 4 of 6 of *Data architecture*, is generated from code like the films of *The map before the data*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/da.js`](../../shared/src/da.js) (its title card, Inés Duarte, Project Cybersyn's pictures and the information layer's elements), which this film uses as they are. Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its own source files, the words the voice respells (Inés, Cybersyn, CORFO, DAMA), the chapter its opening story fills (`story`), and the moment its poster shows (the flow drawn across the wall on the data practice on the map, lit from its home to its copy). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the eleven paths Inés found across the wall, four of them on the map, then the title; the flow on the map, lit from its home to its copy; and the utility's flows with November's count, then the end card. |
| `src/plan.js` | This film's pictures (prefixed `d4_`): Chile at night in four places along one long table (`D4_CB`, `D4_CG`, `D4_CC`, `D4_CD`), its telex lines and their pulses one way or both ways (`d4_pulses`), telex strips (`d4_strip`), trucks, a shop and the trucks still running as small marks on the map (`d4_truck`, `d4_shop`, `d4_mini`); the utility as one room split by the wall (`d4_sides`, `d4_wall`, `d4_labels`), its six systems (`d4_sys`) and the eleven paths across the wall (`D4_P`, `d4_path`), the old queue, the grid of every connection point's readings, the Mendozas' home, the radio mast, the meter's readings with the estimate and its replacement (`d4_chart`), the replaced reading at home (`d4_rec`), the agreed list (`d4_list`), the three retailers, each with its two readers (`d4_ret`), a message (`d4_msg`); the three shapes' small systems (`d4_node`); the contract (`D4_TERMS`, `d4_contract`); the data practice on the map (`d4_map`) and its ledger of the eleven paths (`d4_ledger`); and the December bill. |
| `src/scenes.js` | The eight chapters, and the places they share in the room: the paths across the wall (`d4_W`), Quarry Lane to its left (`d4_Q`), the record, the list and the retailers below the paths (`d4_X`), the shapes beside them (`d4_S`), the contract to their left, and the map below, so the camera glides between them and the wall runs on through every place. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: an autoharp strummed slowly with a felt pick, one chord bar held down, so every string is crossed but only the chord's ring, and a euphonium, alone, soft and low, tuned pure in F major, with D minor and A minor for what goes wrong; the series' mark at the title and the end card, and the film's own figure, *published once*: the euphonium's note at the home, then one slow strum where only the chord's strings ring. Music under the opening story, then only at a chapter's turn, a moment on screen or a pause without words. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' `lang.py`, `build.py` and `quiet.py` (the governance films' sound check, with `held.py`), and From words to data's other tools and instruments. |

## Rebuild

From this folder, `films/data-architecture/4-how-it-travels/source/`:

```
python tools/tts.py          # the voice, and src/vodur.js (only lines whose words changed are voiced again)
python tools/build.py        # dist/render.html, dist/film.js, dist/film.html
python tools/captions.py     # ../captions/en.srt and en.vtt; FILM_LANG=es for the Spanish
python tools/audio.py        # dist/soundtrack.mp3, from tools/score.py and the voice
python tools/check.py        # every frame draws, and nothing shows twice where chapters meet
python tools/legible.py --overlaps
python tools/pace.py
python tools/quiet.py        # the sound follows the series' rules
python tools/render.py       # the video, dist/how-it-travels.mp4, in resumable chunks
```

## Publish

`python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/how-it-travels/` and draws the poster (`--keep-sound` when only the pictures changed), then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/how-it-travels/think.en.js` and `think.es.js`: it stops after `paths`, `once` and `contract`. Progress is stored under `ld-how-it-travels`.
