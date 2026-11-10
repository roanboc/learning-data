# Rebuilding Every change through review

*Every change through review*, film 6 of 7 of *From helper to colleague*, the third series of the module *AI agents in data work*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, and the module's own look in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/): the lab, its people, the agent, the cards, and the finishing pass ([`../../../what-an-agent-is/shared/README.md`](../../../what-an-agent-is/shared/README.md) says what each file holds). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (Noor, Mei, Yusuf, dbt, Jun and "A I", as the series says them), its opening story's chapter, no urgent chapter, and the moment its poster shows (the path every change takes, in the opening). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the wordless moments (the title card after the opening, and the end card). |
| `src/logos.js` | The tools' official logos, unaltered, drawn beside each tool's name where the narration names it: GitHub's mark (GitHub's Octicons, `mark-github`), and Databricks' and dbt's logos, as *The Inner Life of Data* draws them. `NOTICE.md` credits them; they aren't covered by the repository's licences. |
| `src/pieces.js` | The room's pieces, all prefixed `ec_`: where things stand, the two agents with their badges and owners' tags, the people at the left, the pull request, Planning's class plan, a class and a laboratory, the faculties, the path every change takes, the branches, a schema, the five stages (copied whole from *Five stages, not a switch*'s `fs_stages`, as the series asks: copy it again if that film changes it), the tests, the project's lineage, a terminal's lines, cards of rows, two tables side by side, the map's steps, the release's two jobs, its pass and a tool's logo with its name. Colours keep the module's meanings. |
| `src/scenes.js` | The seven chapters, each a run of shots, all in the lab, one room: the camera glides on from shot to shot and chapter to chapter (`ag_cutInto`), and a later moment, with other people, another agent or another page of cards, lets what was there leave first (`later:true`), so the two agents, which look alike, are never in one place at once. The title card ends chapter 1, the end card chapter 7. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, and the words they use. |
| `tools/score.py` | The film's music and sounds: tuned flowerpots of fired clay, struck softly with small mallets, and a nail violin, bowed softly, both made here from their modes. A pot set down only knocks; lifted, it rings: an agent sets its change down, a person lifts it. The nail violin plays only under a person's step. C major, every note tuned pure from C; A minor for the problems. Music plays under the opening story, and after that only now and then; nothing pulses. Each effect (a card, a sheet, a slide, keys, a tick, a tap, a pencil, a lock, a stop, a breath of air) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film: the module's own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/from-helper-to-colleague/6-every-change-through-review/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints without holding the page, nothing shows twice, no arm jumps, nothing jumps in one room, nothing reaches past a person's picture
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, as low as the governance films', nothing beats, nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/every-change-through-review.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead).

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/every-change-through-review/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/every-change-through-review-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page, its Spanish chapter names, and the example project's files it links under *See it in the project*). "Pause and think" is `site/assets/every-change-through-review/think.en.js` and `think.es.js`: it stops after `checks`, `review`, `rules` and `release`, with one question each. Progress is stored in the browser under `ld-every-change-through-review`. The release workflow renders the video, `every-change-through-review.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
