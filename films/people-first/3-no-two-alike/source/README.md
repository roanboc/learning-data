# Rebuilding No two alike

*No two alike*, film 3 of 4 of *People first*, the series that opens the module *Leading data people*, is generated from code like every other film here. It draws with the module's kit, *Sunlit plaster* ([`../../../the-new-skills/shared/`](../../../the-new-skills/shared/)), the agent films' kit, *A Sharper Sketch*'s scenes and *The Inner Life of Data*'s engine, fonts and voice. Only what is new in this film lives here, and every name it declares starts with `na_` or `NA_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key (`no-two-alike`), title and subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (chapter `lu`, at `why`), the words the voice respells (Zilu, Ran You, Gongxi Hua, Kong Qiu, Yusuf Demir, Tomás, Noor, Jun, "A I"), its opening story (`lu`) and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice differs from its caption says so in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, where an idea needs a moment to land, and the film's two wordless moments: the title card and the end card. |
| `src/na_gorge.js`, `src/na_bridge.js` | The series' gorge and rope bridge, for the film's first two lines: copied from the series' shared version, as each film of the series copies it, with this film's prefix. Only the finished bridge is drawn, with three people crossing. |
| `src/na_people.js` | The film's own people: the four of Lu, who are nobody's likeness and are dressed from the texts, and Marta Silva, Erin Walsh and Tomás Ortega, copied as the module's numbers describe them. The agent films' kit draws them, and nothing is added to it. |
| `src/na_lu.js` | The opening story's place: a plain hall in Lu, about 2,500 years ago, with earth walls, timber posts, woven mats and rolls of bamboo slips that show no writing. |
| `src/na_uni.js` | The film's own pictures at the university: the team at its table, a small room for two, and what is on the wall (five scales with nobody's place on them, a scale cut in two with no letters on its labels, ten people who took a test twice, a page with five headings, and a meeting's four steps). The module's kit draws the rooms and people, and is never changed for this film. |
| `src/na_scenes.js` | The six chapters, shot by shot, on the module's camera and shots. Every moment is timed to a line's start or to a word in it (`wAt()`), so the pictures stay with the voice when it is recorded again. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a bass clarinet and a plucked double bass, as a pair, both made here. The mark is one question of three rising notes, asked by each instrument and answered by the other. Each sound uses the same word and offset as the picture in `src/na_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../the-new-skills/shared/tools/run.py`) on this film. |

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
