# Rebuilding People before roles

*People before roles*, film 1 of 4 of *People first*, the series that opens the module *Leading data people*, is generated from code like every other film here. It is drawn with the people kit, *Ink line* ([`../../shared/`](../../shared/README.md)): whole people in the places where they work and meet, in flat colour with one even dark line. It also uses the agent films' camera and shots, *A Sharper Sketch*'s scenes and *The Inner Life of Data*'s engine, fonts and voice. Its first version, of 12 November 2026, was drawn in the module's *Sunlit plaster*; it was made again on 18 November 2026. The film never changes a shared kit for itself: only what is new in this film lives here, and every name it declares starts with `pb_`, `PB_`, `pbq_` or `PBQ_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (October 1972: the keeper on the bank with the two visitors, "We'll rebuild it when the New Year comes.": chapter `bridge`, at `rebuild`), the words the voice respells (Apurímac, minka, Jun, Noor, Yusuf, Tomás and four surnames), its opening story (`bridge`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and the wordless moments: the title card, Friday's page of notes as the seven names are played, and the end card. |
| `src/pb_gorge.js` | The gorge of the Apurímac in ink line, this film's copy (prefix `pbq_`) of the drawing the series' films at the bridge share: hills under snow peaks, the gorge's rock walls and the river far below, a stone base on each bank, in sun or under a grey sky; the rope bridge, drawn live so it can be new, sag, come apart or be made again, with walkers on it; the small steel truss up the gorge and a truck on it; and the people of the gorge, the two visitors of 1972 and a geographer of 1970, whole, with their hats, braids and coils of cord. A drawing, not a likeness of the place, and nobody drawn is a likeness of a real person. |
| `src/pb_uni.js` | The university in February 2027, in the kit's places (the team's room, Helena's corner, the campus, the lecture room, the board seen close, the notebook): who sits where, the chart pinned on the wall and the chart and list that come out of Helena's sheets, Carmen's two boards and the three pages of Helena's notebook, each drawn as a designer would and almost done (the kit's `PK.sk`: a graphic recording pinned over the board, a sketched page), the hand adding only the last words as the voice says them, and Erin's message to Jun. |
| `src/pb_scenes.js` | The six chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says, and the ideas are written by hand at the board or in the notebook. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a cor anglais and a bassoon, as a pair, both made here. The mark is *the names*: seven short figures, each the rhythm of one person's name said aloud. D-flat major, B-flat minor for the problem, tuned pure from D flat. Nothing Andean plays for the bridge. Music plays under the opening story, and after that only now and then; nothing pulses. The board's and the notebook's sounds come from the film itself, where it writes each row (the kit's `tools/pens.py`); the others use the same word and offset as in `src/pb_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the people kit's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/people-first/1-people-before-roles/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, nothing shows twice or jumps, and the people kit's checks (people.py, shown.py)
python ../../../../site-tools/shots.py   # every shot on screen long enough to be seen
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python ../../../../site-tools/fits.py   # every piece of text stays inside its box, and every caption inside the frame
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/people-before-roles.mp4
```

The voice cache knows each line's words: after changing a line, or a word the voice respells in `film.json`, run `tools/tts.py` again and it voices only what changed.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/people-before-roles/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/people-before-roles-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film people-before-roles-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links what a newcomer can read next. "Pause and think" is `site/assets/people-before-roles/think.en.js` and `think.es.js`: it stops after `seven`, `turn` and `friday`, with one question each. The release workflow renders the video, `people-before-roles.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
