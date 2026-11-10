# Rebuilding Strategy is a habit

*Strategy is a habit*, film 4 of 4 of *Small steps, measured* and the last film of *Data management*, is generated from code. It draws with the leading data people module's kit (`films/the-new-skills/shared/`), bundled as it is, and puts the module's mark (`films/a-plan-in-ninety-days/shared/src/mark.js`) on its title and end cards. Only what is new lives here:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, sources in bundle order, poster moment, the voice's pronunciations, and which chapter is the opening story |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice |
| `src/breath.js` | The few longer pauses; every sentence already gets its beat from `narration.js` |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py` |
| `src/sih_ozone.js` | The opening's places and drawings: the 1970s kitchen, the sky cut open, Halley's station and its readings, the Montreal hall and its delegates, the treaty's plan |
| `src/sih_uni.js` | The university's papers: the one-page strategy, the calendar, the measures, the risks, the map's history, the roadmap, Noor's map, the ledger, the list and the loop |
| `src/sih_scenes.js` | The six chapters, shot by shot |
| `src/i18n/es/captions.js` | The Spanish captions |
| `tools/score.py` | The music and sounds (sound stones), played by `tools/audio.py` |
| `tools/*.py` | The module's tools, pointed at this film (`films/the-new-skills/shared/tools/run.py` finds them) |

## Make and check it

From this folder, `films/small-steps-measured/4-strategy-is-a-habit/source/`, as AGENTS.md has it:

```
python tools/tts.py
python tools/build.py
python tools/audio.py
python tools/build.py
python tools/check.py
python tools/legible.py --overlaps
python tools/pace.py
python tools/quiet.py
python tools/stills.py --size 1920
python tools/captions.py
python tools/publish.py
```

`tools/publish.py --keep-sound` when only the pictures changed. Then, from the repository's root, `python site-tools/build_series.py` and `python .github/scripts/affected.py --run`.
