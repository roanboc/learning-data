# Rebuilding Why Unity Catalog and Unity Gateway govern them

*Why Unity Catalog and Unity Gateway govern them*, film 8 of 9 of *Agents at work on data*, the second series of the module *AI agents in data work*, is generated from code like every other film here. It draws with *The Inner Life of Data*'s engine and helpers, *A Sharper Sketch*'s scenes, and the module's own look in [`../../../what-an-agent-is/shared/`](../../../what-an-agent-is/shared/): the lab, its people, the agent and its loop, the cards, and the finishing pass ([`../../../what-an-agent-is/shared/README.md`](../../../what-an-agent-is/shared/README.md) says what each file holds). Only what is new in this film lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle and colour note, its own source files, the words the voice respells (Jun, Mei and "A I", as the series says them), its opening story's chapter, and the moment its poster shows (the agent at night, reading the learner table on Mei's key). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the wordless moments (the title card after the opening, and the end card). |
| `src/pieces.js` | The film's own pieces (prefixed `ug_`): where things stand in the room; the people of this film (Mei, Sam, Jun and Clara) in the module's way; Mei's key, its hook and its flight, the badge that drops in its place and the owner's tag; the faculties' question cards and the answers; the learner table's record, with its masks and its lock; the log's lines, the query that reads it, lineage's tables and the gateway's usage table; the agent's thread to its model; the frames of Unity Catalog and Unity Gateway, the model services, the checks, the prompt with its hidden address, the slip that tries to trick the agent and the dial of its limit; the policy, the groups, the grants, the function and the tool servers; the census count; and the cards for what comes next. Colours keep the module's meanings. |
| `src/scenes.js` | The eight chapters, each a few shots cut together. The title card ends chapter 1, the end card chapter 8. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: an electric clavichord, damped and soft, and a crumhorn, low in its range, both made here. The film's mark, B flat, E flat, D flat, G flat, is the same figure for a person and for an agent: Mei's key plays it on the clavichord alone; given a name of its own, the agent plays it on the crumhorn with the clavichord, together. E flat minor for the nights and the trouble, G flat major for what the rules give, every chord tuned pure from E flat. Music plays under the opening story, and after that only now and then. Each effect (paper, taps, knocks, a breath of air, a key's clink, a pen struck through, a pencil) fires at the same moment, with the same word and offset, as the thing it belongs to in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../what-an-agent-is/shared/tools/run.py`) on this film: the module's own `build.py`, `check.py` and `quiet.py`, and *From words to data*'s others. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/agents-at-work-on-data/8-unity-catalog-and-ai-gateway/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every place paints without holding the page, nothing shows twice, no arm jumps
python tools/legible.py --overlaps   # every piece of text must read on a phone, and none may cover another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, as low as the governance films', and nothing beats or pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/unity-catalog-and-ai-gateway.mp4
```

`build.py` stops if two files declare the same top-level name, if a caption would run to three lines in the player (a line, or its Spanish caption, over 140 characters), or if a moment waits for a word that isn't, whole, in its line: `wAt(sc, "line", "word")` in the scenes and `W(...)` in the score take the first place the word appears in what the voice reads, and a word that isn't there falls back to the line's start (the score stops instead).

`tts.py` reuses a line's voice file if it exists: after changing a line's words, delete its file (`build/vo/<chapter>__<id>.wav`) and run it again.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/unity-catalog-and-ai-gateway/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/unity-catalog-and-ai-gateway-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json` (the words of its page and its Spanish chapter names). "Pause and think" is `site/assets/unity-catalog-and-ai-gateway/think.en.js` and `think.es.js`: it stops after `holds`, `name` and `gateway`, with one question each. Progress is stored in the browser under `ld-unity-catalog-and-ai-gateway`. The release workflow renders the video, `unity-catalog-and-ai-gateway.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
