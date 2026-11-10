# Rebuilding Measures that matter

*Measures that matter*, film 2 of 4 of *Small steps, measured*, the last series of the module *Data management*, is generated from code like every other film here. It draws with the modules' shared look, **Sunlit plaster**, in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/) ([its README](../../../the-new-skills/shared/README.md) says what each file holds and how a film uses it), which bundles the agent films' kit, *A Sharper Sketch*'s scene and *The Inner Life of Data*'s engine; the module's mark comes from [`../../../a-plan-in-ninety-days/shared/src/mark.js`](../../../a-plan-in-ninety-days/shared/src/mark.js). None of them is changed for this film. Only what is new in it lives here, with the prefix `mm_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files (the module's mark first), the words the voice respells (Novak's, Novak, Jun and "A I"), its opening story's chapter, no urgent chapter, and the moment its poster shows (Helena's page, eight measures in three groups). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year or a sum says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the two wordless moments (the team's room, as it becomes the title card; the page in December, as it becomes the end card). |
| `src/mm_1952.js` | New York in 1952, in the module's light, with no hospital's name, sign or crest: the delivery room (glazed tiles, the lamp over the mother's table, a cloth screen, a wall clock whose second hand sweeps on through every shot, the cot and the baby in it, its colour going grey-blue when it isn't breathing well) and the hospital's corridor wall, where the numbers of the time are pinned; the four people of the room (Virginia Apgar, a nurse in a starched cap, a junior doctor and an obstetrician), none a likeness or a copy of a photograph; and Apgar's card of five signs, each scored 0, 1 or 2. |
| `src/mm_page.js` | Helena's page as the screen on the team's wall shows it: eight tiles in three groups, each measure an orange line across the months with its baseline dashed beneath it (never a number lit red or green), load amber above its limit of six, the value tiles' green marks, the glossary's entry for days from ask to first use, and one measure drawn large. Every number comes from one table of months (`MM_MEASURES`), so every shot shows the same lines. |
| `src/mm_scenes.js` | The seven chapters, each a run of shots. The delivery room and the team's room are each one room: in a room the camera glides and only what changes fades (`later:true` lets what was there leave first), chapters 2 to 6 open where the last one ends (`ag_cutInto`), and only a change of place dissolves. What the screen shows slides across like a turned page, drawn on a spare canvas so nothing shows off the glass. The title card ends chapter 1, the end card chapter 7, both with the module's mark. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a wooden pitch pipe, the small boxwood pipe with a marked plunger that choirs blew to find their first note, made here from a stopped pipe's odd partials and a breath at each start, with a larger pipe an octave lower as its partner, which gives the baseline's low C. The mark is five notes on three marks of the stopper (0, 1, 2, 1, 2), as Apgar's score has five signs scored 0, 1 or 2; C major, A minor for the problem, every note tuned pure from C. Music plays under the opening story, and after that only now and then; nothing pulses. Each effect (a card, a tap, a slide, a pen, a tick) fires at the same word and offset as the thing it belongs to in `src/mm_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the modules' tool (`../../../the-new-skills/shared/tools/run.py`) on this film: their own `build.py` and `quiet.py`, the agent films' `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/small-steps-measured/2-measures-that-matter/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js (--keep-timings after a change to a line's words)
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, no word under 28 px, nothing shows twice, no arm jumps, nothing jumps in one room, nothing reaches past a person's picture
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, as low as the governance films', nothing beats, nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/publish.py    # the player, soundtrack, Spanish captions and poster into site/assets/ (--keep-sound when only the pictures changed)
python tools/render.py --workers 4   # dist/measures-that-matter.mp4
```

After `publish.py` changes the soundtrack, record it from the repository's root with `python site-tools/media.py index --film measures-that-matter-en` and commit the MP3 with `git add -f` beside `../audio.json` (AGENTS.md, *Published audio has per-film `audio.json` pointers*). Then run `python site-tools/build_series.py`: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/measures-that-matter/think.en.js` and `think.es.js`: it stops after `baseline`, `trend` and `team`, with one question each. The film shows nothing in the example project: the page is drawn as a dashboard on the platform, with one definition in the catalog's glossary.
