# Rebuilding One language, kept

*One language, kept*, film 6 of 6 of *Data architecture*, is generated from code like the films of *The map before the data*: the same engine, components, voice and tools, and the series' own components in [`../../shared/src/da.js`](../../shared/src/da.js) (its title card, Inés Duarte, Project Cybersyn's pictures and the information layer's elements), which this film uses as they are. Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, how to read its pictures, its own source files, the words the voice respells (Inés, Cybersyn, CORFO, Allende, Ama), the chapter its opening story fills (`story`), and the moment its poster shows (the change built from the glossary's new term, its check and its review passed). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses, and three wordless moments: the change stopped in review, then the title; app user on the map, with its link to decision 7; and the first year's counts under the map, then the end card. After the coup, a longer silence. |
| `src/plan.js` | This film's pictures (prefixed `d6_`), with the series' helpers it reuses copied in, so the series' kit doesn't change: Chile at night, in lamp-light (`d6_night`), its cards and notes (`d6_card`, `d6_note`), the factories' telex strips (`d6_strip`, `d6_strips`), a factory's sheet of workers absent and how it's counted (`d6_count`), the one definition of social unease (`d6_def`), the operations room as it was designed, every factory shown with the same icons, and dismantled (`d6_opsroom`, `d6_icon`), the daily report (`d6_report`) and the presidential palace (`d6_palace`); the app team's change and its table (`d6_change`), everyone who signs in (`d6_who`), the glossary's entry for customer and its owners' chips (`d6_gloss`, `d6_chip`), the repository (`d6_repo`); a name built from its parts, the short list of kinds of value and an older system's name mapped once (`d6_parts`, `d6_kinds`, `d6_oldName`); the Common Information Model's classes and the utility's words mapped to them (`d6_cim`, `d6_words`); the principles (`D6_PRIN`, `d6_prin`); the decisions folder, the decision record and the meeting it outlives (`d6_files`, `d6_record`, `d6_meeting`); the ticket (`d6_ticket`); the data practice on the map, with app user joining retail's concepts (`D6_GR`, `d6_map`), and the first year's counts (`d6_year`); and Cybersyn as it was: what never ran as designed (`d6_built`), and the documents carried out (`d6_carry`). |
| `src/scenes.js` | The eight chapters. Chile in 1972 is a table of four pictures the camera glides along: the telex (A), two factories and the one definition (B), the operations room (C) and the daily report (D). The utility is one room, and each place in it is a neighbour of the last, so the camera never crosses a third: the change and the glossary (`D6_U`), the repository to its right (`D6_R`), names to its right (`D6_N`), the reference model above names (`D6_MO`), the principles to its left (`D6_PR`), the decision record to their left (`D6_DE`), above the change, where the camera comes back for the change kept, and the data practice on the map under the change (`D6_MP`). |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. Spanish is the captions and the page; the pictures stay in English. |
| `tools/score.py` | The film's music and sounds: a hammered dulcimer, each note struck on two strings tuned exactly together, low-passed under 2.2 kHz, and low handbells (E flat 3 to E flat 4), struck softly and damped at the shoulder, never a peal, tuned pure in E flat major, with C minor and G minor for what goes wrong; the series' mark at the title and the end card, and the film's own figure, *one name*: two dulcimer notes, B flat up to E flat, answered by a low handbell's E flat, where a name agrees with what is kept; the app's *customer* plays the same two notes but ends a step off, on F, and no bell answers. No music at the coup. Music under the opening story, then only at a chapter's turn, a moment on screen or a pause without words. Each effect fires with the thing it belongs to in `src/scenes.js`. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film: the series' `lang.py`, `build.py` and `quiet.py` (the governance films' sound check, with `held.py`), and From words to data's other tools and instruments. |

## Rebuild

From this folder, `films/data-architecture/6-one-language-kept/source/`:

```
python tools/tts.py          # the voice, and src/vodur.js (only lines whose words changed are voiced again)
python tools/build.py        # dist/render.html, dist/film.js, dist/film.html
python tools/captions.py     # ../captions/en.srt and en.vtt; FILM_LANG=es for the Spanish
python tools/audio.py        # dist/soundtrack.mp3, from tools/score.py and the voice
python tools/check.py        # every frame draws, and nothing shows twice where chapters meet
python tools/legible.py --overlaps
python ../../../../site-tools/fits.py   # every piece of text inside its box, and the captions on a phone
python tools/pace.py
python tools/quiet.py        # the sound follows the series' rules
python tools/render.py       # the video, dist/one-language-kept.mp4, in resumable chunks
```

## Publish

`python tools/publish.py` copies the player, the soundtrack and the Spanish captions to `site/assets/one-language-kept/` and draws the poster (`--keep-sound` when only the pictures changed), then `python site-tools/build_series.py` makes the pages. "Pause and think" is `site/assets/one-language-kept/think.en.js` and `think.es.js`: it stops after `fourth`, `model` and `kept`. Progress is stored under `ld-one-language-kept`.
