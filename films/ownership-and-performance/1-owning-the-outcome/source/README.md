# Rebuilding Owning the outcome

*Owning the outcome*, film 1 of 4 of *Ownership and performance*, the last series of the module *Leading data people*, is generated from code like every other film here. It was drawn with the people kit, *Ink line*, before any other film ([`../../../people-first/shared/`](../../../people-first/shared/README.md)): whole people in the places where they work and meet, in flat colour with one even dark line. It also uses the agent films' camera and shots, *A Sharper Sketch*'s scenes and *The Inner Life of Data*'s engine, fonts and voice. The film never changes a shared kit for itself: only what is new in this film lives here, each top-level name prefixed `oo_` or `OO_`.

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, its own source files, the words the voice respells (Maathai, Zhamak Dehghani, Reyes and Jun), the chapter of its opening story, and the moment its poster shows (Helena hands Ivy a seedling in a pot on her first day as owner: "It's yours now."). |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The few longer pauses: holds after some lines, and the two wordless moments (Ivy looking up from her screen as the title card comes, and Ivy by her seedling as the end card comes). |
| `src/oo_kenya.js` | The opening, Kenya's central highlands from the 1970s to 2004: the hills with their forests cleared, a group's nursery under a shade of poles, the row of young trees on the slope, and the same hills years later with trees. Its people: Wangari Maathai, three women of the hills and two children, dressed for their time, never likenesses, and what they hold (firewood, a watering can, a tray of seedlings, a seedling, coins). Everyone stands on the near slope, sized by one eye line. |
| `src/oo_uni.js` | The university in 2027 and after, in the kit's places (the team's room, Helena's corner, the campus, a teaching room). What is this film's own in them: who sits where, the seedling Helena gives Ivy (it grows on the window's sill through the film), what Ivy's screen shows and the small cards that come out of it (the counts that dropped, one room's hour, her new check), the sensor's count by a teaching room's door, someone who passes on the campus, and the letters of a RACI chart worn by the people they belong to. |
| `src/oo_scenes.js` | The six chapters, shot by shot. Every picture has people in it, whole, doing what the line says; the words on screen are where and when, a name, or what someone says. The title card ends chapter 1, the end card chapter 6. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: a daxophone, bowed and played plainly, with a longer tongue bowed low as its partner; G major, E minor for the problem, every note tuned pure from G; the mark, B, D, then G, which wavers into place once, then stays. Music plays under the opening story, and after that only now and then. Each effect is something a person does or something that comes in on screen (water poured, coins paid, a pot handed over, a sheet pinned, a count, a marker on the board), at the same word and offset as in `src/oo_scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the people kit's tool (`../../../people-first/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. Playwright's version must match the Chromium it finds.

## Rebuild

Run from this folder, `films/ownership-and-performance/1-owning-the-outcome/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws; no word under 28 px; nothing twice, no jump; the people whole, in scale, at ease and alive
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python ../../../../site-tools/fits.py   # every piece of text inside its box
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, and nothing beats or pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
```

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/owning-the-outcome/`, with the Spanish captions (as `captions.es.js`), and draws the poster, `site/assets/owning-the-outcome-poster.jpg`, at the moment `film.json` names (`--keep-sound` when only the pictures changed). Then, from the repository's root, `python site-tools/media.py index --film owning-the-outcome-en` records the soundtrack in `../audio.json`, and `python site-tools/build_series.py` makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/owning-the-outcome/think.en.js` and `think.es.js`: it stops after `owns`, `monday` and `blame`, with one question each.
