# Rebuilding Governed in dbt

*Governed in dbt*, the opening film of the third series on data governance, *Governance you can use*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s scene helpers, the people of *When things go wrong*, *From words to data*'s people and helpers, *In the weeds of data crafting*'s people and motion helpers, the master and reference data series' watercolour and its people in pencil and wash, and *Governance principles*' university: its rooms and the things in them, its people, and what a film needs before it starts (all in [`../../../data-governance/shared/src/`](../../../data-governance/shared/src/)). This series' own pictures, painted once for its six films, are in [`../../shared/src/tools.js`](../../shared/src/tools.js): files as paper sheets, a pull request's checks as a strip of lights, a tool's page drawn as a form, a report in Markdown, the data team's board with the series' six cards, the team's poster with Yusuf's gold pins, the agent's star, name cards and tags. Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files (the series' `tools.js` first), the words the voice respells (Yusuf, Jun, Mei, Noor, Anil), and the moment its poster shows (Jun's line, changed to "The rules arrive first."). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the first card on the data team's board becoming the title, and the end card. |
| `src/plan.js` | This film's pictures (prefixed `gd_` and `GD_`): Jun's pull request and its checks and reviewers; his speech bubble; the rule and the council's minutes on Yusuf's desk, and census day on his board; the files the film opens, each line copied from the example project or one of its two worked examples (the learner table's YAML and three of its columns, the tests' owners, the groups and each layer's access, the near-award table's contract and SQL, two versions of the credentials table, three exposures, Tuesday's two drafts, the reviewers file, a decision, the check's messages and the page it links, a warning, Anil's YAML, the skill); the project as a site plan of who may build on what; the impact reports; the warnings' chart; the agent's review and the approvals; and the map's home of five things. `WC_PLACES` lists the places the film paints, once each. |
| `src/scenes.js` | The nine chapters, each a few shots cut together with short dissolves. The title card ends chapter 1, the end card chapter 9. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a muted string quartet, one player to a note and no vibrato, and a xylophone with soft rubber mallets, both made in the score, in B-flat major, every chord tuned pure. The quartet plays under the opening story and after that only at a chapter's turn, under a moment on screen or in a wordless pause; the xylophone's marks mean the same all through (one low note when a check turns red, two rising when it turns green, a soft falling third when a reviewer is asked), and each pin gets a note of its own, up the scale. The series' mark, 1-5-4-8, plays at the title and the end. Nothing loops or pulses, and each effect (keys, paper, a page, a pencil, a highlighter, a pin, a card, a knock for a person's yes, a stamp) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/quiet.py` | The film's own copy of the master data films' sound check: after the opening story, no chapter has music for more than half its length, or for 12 seconds without a break, and no two held notes beat. |
| `tools/` | Each other tool runs *Governance principles*' tool (`../../../data-governance/shared/tools/run.py`) on this film: that series' own `build.py` and `check.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/governance-in-practice/1-governed-in-dbt/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/quiet.py      # the music comes now and then, and nothing beats or pulses
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/governed-in-dbt.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead). `python ../../../data-governance/shared/tools/cues.py` lists them on its own.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/governed-in-dbt/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/governed-in-dbt-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/governed-in-dbt/think.en.js` and `think.es.js`: it stops after `access`, `impact` and `agent`, with one question each. Progress is stored in the browser under `ld-governed-in-dbt`. The release workflow renders the video, `governed-in-dbt.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
