# Rebuilding Written once

*Written once*, the closing film of *In the weeds of data crafting*, is generated from code like every other film here. It shares the engine, components, fonts and voice model of *The Inner Life of Data*, draws with *A Sharper Sketch*'s diagrams, the people of *When things go wrong*, *From words to data*'s components and *Keeping it true*'s, and the series' own in [`../../shared/src/`](../../shared/src/). Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (YAML, Jun, Mei, dbt, DuckDB, CI), and the moment its poster shows (the title card, over the tuning fork in its case). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and two wordless moments (the title, and the end card that closes the series). |
| `src/plan.js` | This film's pictures (prefixed `wr_`): Paris, 1859 (tuning forks of polished steel, the decree and its seal, the standard fork in its lined case, a violin, an orchestra tuning to the oboe), project files on glass and on the blueprint, the four drifting copies of a definition, Planning's dashboard and its tooltip, the chain from the conceptual model to the docs site, CI checks, the two diagrams, the Unity Catalog panel, the business glossary on Databricks (drawn, outside the project) and the pull request that syncs a changed term, the credential's two versions, lineage nodes and badges, and the people's faces. |
| `src/scenes.js` | The eight chapters. The title card ends chapter 1; the end card ends chapter 8. Every shot drifts, things arrive with a spring, and the four copies and the conceptual model (2 → 3), the conceptual model into the chain (3 → 4), the wiki card (4 → 5), the chain (4 → 5) and the catalog (6 → 7) carry across the cuts. |
| `src/i18n/es/captions.js` | The Spanish captions (Latin American), one per English line. |
| `tools/score.py` | The film's music and sounds: sustained chords in D major (the opening film's key, the series back home), strings for 1859, and the series' mark, 1-4-5-8, on a felt piano at the title and, at the end, answered by the opening film's electric piano. Copies drifting apart are a detuned felt pair, low; a fork's bright ring is never used. Nothing loops, and each effect (a knock, a muffled key, paper, a felt note, a low stamp) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each tool runs the series' tool (`../../shared/tools/run.py`) on this film. |

Every code, YAML and Markdown card shows real lines from [`../../project/`](../../project/) (the workflow's CI steps are at the repository root, `.github/workflows/credential-project.yml`) and carries the label `runs on dbt Core · DuckDB`. The four copies of the award's definition (the wiki, a YAML description, the catalog and the tooltip) are drawn, not project files, and are tagged "as it drifts". The business glossary and the sync's pull request are drawn too: the glossary is tagged "outside dbt". The catalog panel is labelled `Databricks · Unity Catalog`, the story's stack. [The script](../script.md) lists the file and lines behind each card.

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/analytics-engineering/9-written-once/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every frame must draw without an error
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 960   # review stills -> build/stills/
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt, from src/i18n/es/captions.js
python tools/render.py --workers 4   # dist/written-once.mp4
```

The video adds a finishing pass that stills and the site's player don't show (`../../shared/src/post.js`): motion blur and a soft glow. The release workflow renders it from this source.

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/written-once/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/written-once-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py`, which makes the series' pages, then `python site-tools/check_site.py` and `python site-tools/smoke.py`. Never edit the site's copies by hand: the release workflow checks that the site's `film.js` is byte for byte the one this source builds, and renders the video from this source.
