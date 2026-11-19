# Rebuilding How, more than who

*How, more than who*, film 4 of 4 of *People first*, the series that opens the module *Leading data people*, is generated from code like every other film here. It is drawn with the people kit, *Ink line* ([`../../shared/`](../../shared/README.md)): whole people in the places where they work and meet, in flat colour with one even dark line. It also uses the agent films' camera and shots, *A Sharper Sketch*'s scenes and *The Inner Life of Data*'s engine, fonts and voice. Its first version, of 12 November 2026, was drawn in the module's *Sunlit plaster*; it was made again on 18 November 2026. The film never changes a shared kit for itself: only what is new in this film lives here, and every name it declares starts with `hm_`, `HM_`, `hmq_`, `HMQ_`, `hmv_` or `HMV`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`how-more-than-who`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (day one on the bank: a woman hands her family's cord to the man who checks it, the author's pick for the film's tile), the words the voice respells (Quehue, Apurímac, Quechua, Tomás, Jun, Novak, Ortega and Reyes), its opening story (`days`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and the film's two wordless moments: the title card and the end card. |
| `src/hm_gorge.js` | The gorge of the Apurímac in ink line, this film's copy (prefix `hmq_`) of the drawing the series' films at the bridge share: the banks, the stone bases, the bridge at any age, built cable by cable, its fall, the steel bridge, and the communities' people, walking, kneeling to braid and hauling. The film looks at it from places of its own (`src/hm_scenes.js`): high over the bridge's head, down from the rim, at the left bank's stone base, at its head, and from up the gorge. A drawing, not a likeness of the place. |
| `src/hm_bank.js` | Day one on the bank above the gorge, in the same world and ink line (prefix `hmv_`): the families' coils checked in and laid out in rows, a woman handing her family's cord to the man who checks it, who looks it over and kneels to lay it down, more people coming down from the hill and women twisting the last of their cord (`hmv_check`); and three ropes braided into a cable, one man with hands and feet, replaced when he tires, many hands along it (`hmv_braid`). What doesn't move is painted once, as a place (`hmCheck`, `hmBraid`); the people are drawn over it every frame, the furthest first, and a cord is in one place at a time. Nobody drawn is a likeness. |
| `src/hm_uni.js` | The university in February 2027, in the kit's places (the team's room, Helena's corner, the campus, the teaching room, the board seen close, the notebook): who sits where, the nine boards (Google's study, the two numbers, conflict studies, the three things, non-violent communication, students and learners, collective intelligence, the team's page, trust and a charter) and the six pages of Helena's notebook, each drawn as a designer would and almost done (the kit's `PK.sk`: a graphic recording pinned over the board, a sketched page), the hand adding only the last words, a tick, a ring or a stroke as the voice says them. |
| `src/hm_scenes.js` | The eight chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says, and the ideas are written by hand at a board or in a notebook. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a viola and a cello as a pair, a player to each, who make one tune only by taking turns, as the two builders weave from the two banks. The boards' and the notebook's sounds come from the film itself, where it writes each row (the kit's `tools/pens.py`); the others use the same word and offset as in `src/hm_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the people kit's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/people-first/4-how-more-than-who/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, and hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python ../../../../site-tools/fits.py   # every piece of text stays inside its box, the captions too
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/how-more-than-who.mp4
```

The voice cache knows each line's words: after changing a line, or a word the voice respells in `film.json`, run `tools/tts.py` again and it voices only what changed. The music is at the limit of how often it may come in from 6:41, where a pair of notes answers each line of the team's page as it is written: after voicing a line again, run `tools/quiet.py` before anything else.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/how-more-than-who/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/how-more-than-who-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film how-more-than-who-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links what a newcomer can read next. "Pause and think" is `site/assets/how-more-than-who/think.en.js` and `think.es.js`: it stops after `three`, `turn`, `page` and `limits`, with one question each. The release workflow renders the video, `how-more-than-who.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.

The film shows no code from the example project: the glossary's two words are a card. The example project already keeps a learner wider than a student, and its own definition of a learner is longer than the card's.
