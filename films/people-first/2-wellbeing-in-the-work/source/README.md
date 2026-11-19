# Rebuilding Wellbeing is in the work

*Wellbeing is in the work*, film 2 of 4 of *People first*, the series that opens the module *Leading data people*, is generated from code like every other film here. It is drawn with the people kit, *Ink line* ([`../../shared/`](../../shared/README.md)): whole people in the places where they work and meet, in flat colour with one even dark line. It also uses the agent films' camera and shots, *A Sharper Sketch*'s scenes and *The Inner Life of Data*'s engine, fonts and voice. Its first version, of 12 November 2026, was drawn in the module's *Sunlit plaster*; it was made again on 18 November 2026, and on 19 November 2026 its opening was drawn again in depth and its boards and notebook designed. The film never changes a shared kit for itself: only what is new in this film lives here, and every name it declares starts with `ww_`, `WW_`, `wwq_`, `WWQ_`, `wwv_` or `WWV`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (at home in Quehue, June 2021, a family making its cord again: chapter `bridge`, 0.6 s after `june`, the author's pick of 19 November 2026), the words the voice respells, its opening story (`bridge`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and the wordless moments under the title card and the end card. |
| `src/ww_gorge.js` | The gorge of the Apurímac in depth and in ink line, this film's copy (prefix `wwq_`) of the gorge *People before roles* draws: laid out in metres and seen through cameras placed in it, everyone at their own depth and whoever is nearer drawn over whoever is further. This film's views are its own: from the river, below the rim, the bridge high above (`WW_VR` in `src/ww_scenes.js`), and from the left bank, upstream, at the bridge's head (`WW_VU`). What it adds: the far handrail hanging lower as the bridge sags (`tilt`), and rain and wind over the gorge. The rope bridge is drawn live so it can be new, wear, sag, fall and be woven again; the people of the gorge are whole, with their hats, braids and coils of cord. A drawing, not a likeness of the place, and nobody drawn is a likeness of a real person. |
| `src/ww_home.js` | At home in Quehue, June 2021 (`WWV`, `wwv_`): a family in its yard making the cord it gives the bridge, twisted by hand from dried grass with the children taking part, as the Ministry of Culture's study of 2015 describes, and coiled by the wall. Drawn in the gorge's world and ink line; what doesn't move is painted once, as a place (`wwHome`). The film's tile. No one house and nobody drawn is a likeness of a real one. |
| `src/ww_uni.js` | The university in February 2027, in the kit's places (the team's room, Helena's corner, the campus, the teaching room, the board seen close, the notebook): who sits where, Marta's requests as her screen shows them, Helena's five questions, and the six boards and the six pages of Helena's notebook, each drawn as a designer would and almost done (the kit's `PK.sk`: a graphic recording pinned over the board, a sketched page), the hand adding only the last words as the voice says them. |
| `src/ww_scenes.js` | The nine chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says, and the ideas are written by hand at a board or in the notebook. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a portative organ, the small organ played on the knee, made here; its mark is nine notes, on one bellows or on three. B major, G sharp minor for the problem, tuned pure from B. Music plays under the opening story, and after that only now and then; nothing pulses. The boards' and the notebook's sounds come from the film itself, where it writes each row (the kit's `tools/pens.py`); the others use the same word and offset as in `src/ww_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the people kit's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/people-first/2-wellbeing-in-the-work/source/`:

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
python tools/render.py --workers 4   # dist/wellbeing-in-the-work.mp4
```

The voice cache knows each line's words: after changing a line, or a word the voice respells in `film.json`, run `tools/tts.py` again and it voices only what changed.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/wellbeing-in-the-work/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/wellbeing-in-the-work-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film wellbeing-in-the-work-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links what a newcomer can read next. "Pause and think" is `site/assets/wellbeing-in-the-work/think.en.js` and `think.es.js`: it stops after `seven`, `turn` and `friday`, with one question each. The release workflow renders the video, `wellbeing-in-the-work.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
