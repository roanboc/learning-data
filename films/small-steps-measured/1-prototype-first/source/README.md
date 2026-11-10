# Rebuilding Prototype first

*Prototype first*, film 1 of 4 of *Small steps, measured*, the last series of the module *Data management*, is generated from code like every other film here. It draws with the modules' shared look, **Sunlit plaster**, in [`../../../the-new-skills/shared/`](../../../the-new-skills/shared/) ([its README](../../../the-new-skills/shared/README.md) says what each file holds and how a film uses it), which bundles the agent films' kit, *A Sharper Sketch*'s scene and *The Inner Life of Data*'s engine; the module's mark comes from [`../../../a-plan-in-ninety-days/shared/src/mark.js`](../../../a-plan-in-ninety-days/shared/src/mark.js). None of them is changed for this film. Only what is new in it lives here, with the prefix `pf_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files (the module's mark first), the words the voice respells (Curitiba, Rua Quinze de Novembro, Jaime Lerner, Novak's, Jun and "A I"), its opening story's chapter, no urgent chapter, and the moment its poster shows (the dashboard with its three figures, in the third round). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the two wordless moments (the street people use, as it becomes the title card; the three rounds, as they become the end card). |
| `src/pf_street.js` | Curitiba in May 1972, drawn as an architect draws an elevation: the street in four lights (Friday's dusk, any day before, Saturday's grey morning, a sunny weekend after), one room, so the camera glides between them; the traffic, the crews' trucks and barriers, the stones, streetlights, kiosks and beds of flowers, the strip of paper and the children painting it, the widening plan, the shopkeeper. Small figures with no faces, and nothing a likeness or a copy of a photograph. |
| `src/pf_uni.js` | The university from February to June 2027: Graham's office, the team's room in the mornings and on Fridays, the council's room; the dashboard (the week's heat map, booked or used, and three figures), the requests waiting, Ivy's page, the agent's draft and its note, the rounds, the working days from asking to first use, the teaching building at the peak and at a quiet hour, and the loop of something real, learn, repeat. |
| `src/pf_scenes.js` | The six chapters, each a run of shots. The street is one room and the team's room another: in a room the camera glides and only what changes fades (`later:true` lets what was there leave first), chapters 3 to 5 open where the last one ends (`ag_cutInto`), and only a change of place dissolves. The title card ends chapter 1, the end card chapter 6, both with the module's mark. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: elastic bands stretched over a small open wooden box and plucked, with a bigger box of thicker bands an octave lower as its partner, made here from the band's partials and the box's air. The mark is a rough phrase made better over three rounds, home to E flat on the third, and there is no fourth; E flat major, C minor for the problem, every note tuned pure from E flat. Music plays under the opening story, and after that only now and then; nothing pulses. Each effect (a card, a tap, a slide, a pen, a knock, stones, a rustle, a brush) fires at the same word and offset as the thing it belongs to in `src/pf_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the modules' tool (`../../../the-new-skills/shared/tools/run.py`) on this film: their own `build.py` and `quiet.py`, the agent films' `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/small-steps-measured/1-prototype-first/source/`:

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
python tools/render.py --workers 4   # dist/prototype-first.mp4
```

After `publish.py` changes the soundtrack, record it from the repository's root with `python site-tools/media.py index --film prototype-first-en` and commit the MP3 with `git add -f` beside `../audio.json` (AGENTS.md, *Published audio has per-film `audio.json` pointers*).
