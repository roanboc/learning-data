# Rebuilding Better every week

*Better every week*, film 3 of 4 of *Small steps, measured*, the last series of the module *Data management*, is generated from code like every other film here. It draws with the modules' shared look, **Sunlit plaster**, in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/) ([its README](../../../the-new-skills/shared/README.md) says what each file holds and how a film uses it), which bundles the agent films' kit, *A Sharper Sketch*'s scene and *The Inner Life of Data*'s engine; the module's mark comes from [`../../../a-plan-in-ninety-days/shared/src/mark.js`](../../../a-plan-in-ninety-days/shared/src/mark.js). None of them is changed for this film. Only what is new in it lives here, with the prefix `bw_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files (the module's mark first), the words the voice respells (Novak's, Jun, Noor and "A I"), its opening story's chapter, no urgent chapter, and the moment its poster shows (the ask procedure's page, its second step rewritten, with the date and why). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year or a number says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the two wordless moments (the team's Fridays, fourteen changes kept and an answer within a day, as they become the title card; the film's last line, in three pills, as it becomes the end card). |
| `src/bw_past.js` | The United States in 1940, in the module's light, with no company's name, sign or poster of the period, and nothing made that is a weapon: the factory hall under its saw-tooth roof, the factory floor's wall with its steel beam and rivets, and a training room (`bwHall`, `bwFloor`, `bwClass`); the supervisor and the worker, invented, dressed for their time, neither a likeness; the bench seen from the front; the job from above as the course's breakdowns (Exhibits 9 and 10 of the service's report) describe it, its trips as amber paths (`BW_WALK`, `BW_CARRY`), then the better way in green, the stamp and the scale struck through (`bw_plan`); the pocket card's four steps (`bw_card`); the two breakdown sheets, 30 details and 14 (`bw_breakdown`); and ten at a table (`bw_ten`). |
| `src/bw_uni.js` | The university in 2027: the team's room in late afternoon light (Fridays, `bwFriday`) and in morning light (Monday, `bwMon`); the tracker on the screen (`bw_tracker`); the week's calendar with the Friday half-hour in blue (`bw_week`); the ring of plan, do, study, act (`bw_pdca`); a request's four steps (`bw_steps`); the fifteen Fridays as chips (`bw_fridays`); the six procedures' pages (`bw_pages`); and the ask procedure's page, its second step struck through and rewritten (`bw_askPage`). |
| `src/bw_scenes.js` | The six chapters, each a run of shots. The factory floor, the training room and the team's room are each one room: in a room the camera glides and only what changes fades (`later:true` lets what was there leave first), chapters 2 to 5 open where the last one ends (`ag_cutInto`), and only a change of place dissolves. Sheets that share one spot take turns, the first gone before the next comes in, and a person behind a bench fades with it as one picture (`bw_whole`). The title card ends chapter 1, the end card chapter 6, both with the module's mark. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a psalmodikon, the long, narrow box with one bowed string that Nordic village schools and churches used in the 1800s to lead singing in tune, made here from one string stopped on staple frets in a long wooden box, each note pressed with a soft click and bowed plain at one level, with a larger psalmodikon an octave lower as its partner. The mark is the long way, then the better way: six notes that wind to the home note, then the same arrival in two. A flat major, F minor for the problem, every chord tuned pure from A flat. Music plays under the opening story, and after that only now and then; nothing pulses. Each effect (a card, a tap, a slide, a pen, a tick, a stamp) fires at the same word and offset as the thing it belongs to in `src/bw_scenes.js`, panned to where it's drawn: change one, change both. |
| `tools/` | Each other tool runs the modules' tool (`../../../the-new-skills/shared/tools/run.py`) on this film: their own `build.py` and `quiet.py`, the agent films' `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/small-steps-measured/3-better-every-week/source/`:

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
python tools/render.py --workers 4   # dist/better-every-week.mp4
```

After `publish.py` changes the soundtrack, record it from the repository's root with `python site-tools/media.py index --film better-every-week-en` and commit the MP3 with `git add -f` beside `../audio.json` (AGENTS.md, *Published audio has per-film `audio.json` pointers*). Then run `python site-tools/build_series.py`: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/better-every-week/think.en.js` and `think.es.js`: it stops after `six`, `kept` and `written`, with one question each. The film shows nothing in the example project: the tracker, the form and the procedures' pages are any team's.
