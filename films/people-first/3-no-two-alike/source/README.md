# Rebuilding No two alike

*No two alike*, film 3 of 4 of *People first*, the series that opens the module *Leading data people*, is generated from code like every other film here. It is drawn with the people kit, *Ink line* ([`../../shared/`](../../shared/README.md)): whole people in the places where they work and meet, in flat colour with one even dark line. It also uses the agent films' camera and shots, *A Sharper Sketch*'s scenes and *The Inner Life of Data*'s engine, fonts and voice. Its first version, of 12 November 2026, was drawn in the module's *Sunlit plaster*; it was made again on 18 November 2026. The film never changes a shared kit for itself: only what is new in this film lives here, and every name it declares starts with `na_`, `NA_`, `naq_` or `NAQ_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`no-two-alike`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (chapter `lu`, at `why`), the words the voice respells (Zilu, Ran You, Gongxi Hua, Kong Qiu, Novak, Yusuf Demir, Tomás, Noor, Jun, "A I"), its opening story (`lu`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, and the film's two wordless moments: the title card and the end card. |
| `src/na_puna.js` | The high plain above Quehue in ink line, for the film's first two lines (prefix `nap_`): the world in metres and one camera, the q'oya tussocks (those far off painted once with the place, the near ones each frame, swaying), two women who cut with sickles in a cycle of their own (gather a handful, cut it, lay it down: `nap_cycle`), a man who ties a standing bundle, someone who carries a bundle off, and the bridge small in the gorge beyond. Everything is drawn far to near. A drawing, not a likeness of the place. |
| `src/na_lu.js` | The opening story in ink line: a plain hall in Lu, about 2,500 years ago (earth walls, timber posts, a beam, woven mats, a doorway onto a court with a tree, rolls of bamboo slips that show no writing), and its people, who are nobody's likeness and are dressed from the texts: a small cap over bound hair, robes closing to the right; they kneel on their mats. No Chinese characters are drawn. |
| `src/na_uni.js` | The university in February 2027, in the kit's places (the team's room, Helena's corner, the campus, the teaching room, the board seen close, the notebook): who sits where, the seven boards (the plan, five broad traits, understand or assess, what a type is, four rules, the shared pages, the meeting's steps) and the seven pages of Helena's notebook and Erin's, each drawn as a designer would and almost done (the kit's `PK.sk`: a graphic recording pinned over the board, a sketched page), the hand adding only the last words, a tick, a ring or a stroke as the voice says them. Nobody is placed on a scale, and no test is named. |
| `src/na_scenes.js` | The six chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says, and the ideas are written by hand at a board or in a notebook. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a bass clarinet and a plucked double bass, as a pair, both made here. The mark is one question of three rising notes, asked by each instrument and answered by the other. The boards' and the notebook's sounds come from the film itself, where it writes each row (the kit's `tools/pens.py`); the others use the same word and offset as in `src/na_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the people kit's tool (`../../shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/people-first/3-no-two-alike/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints in time, and nothing shows twice or jumps where the shot changes
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python ../../../../site-tools/fits.py   # every piece of text inside its box, and the captions on a phone
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/no-two-alike.mp4
```

`tts.py` voices a line again when its words, or a word the voice respells in `film.json`, have changed; `python tools/tts.py --keep-timings` voices them again and fails if a line's length has moved. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/no-two-alike/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/no-two-alike-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). The soundtrack is kept outside Git: `python site-tools/media.py index --film no-two-alike-en` records it in the film's [`audio.json`](../audio.json), and [docs/maintenance.md](../../../../docs/maintenance.md) says how it reaches its release. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/no-two-alike/think.en.js` and `think.es.js`: it stops after `degree`, `cut` and `page`, with one question each. The release workflow renders the video, `no-two-alike.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
