# Rebuilding Forgetting a person

*Forgetting a person*, film 3 of 5 of *Kept for a reason*, the third series of *Data protection and privacy*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, two files of the agent films' kit, and the module's look and tools in [`../../../locks-before-the-data/shared/`](../../../locks-before-the-data/shared/), whose [README](../../../locks-before-the-data/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `fp_` or `FP_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (the opening's turn: his name in the search box, the link from it gone, the page still there), the words the voice respells (Jun, AI and HR, as in every film of the module, and Nguyen, Linh, Costeja and GDPR), its opening story (`story`: chapter 1), and no chapter where the score may pulse. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line whose voice reads differently from its caption (a year in words) says it in `say`. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/fp.js` | The opening's places, in the module's night light, each painted once (`AG_PLACES`) with a tag for its place and year: the print room in Barcelona under one lamp, with its table of papers (`fpPress`); the web as a dark hall of far panes (`fpNet`); two lit windows (`fpWindows`); the agency's hall (`fpAgency`); the court's portico (`fpCourt`), and `fp_dim`, which darkens a place behind glass so the words on it stand out. The page of 1998 and its notice, the window that comes round it as it goes online, the search box, the links from his name, a monitor, a phone, a desk and a laptop, the years passing, and the verdict cards. The two invented people of 2009, a client and a neighbour, are drawn with the kit's people in lamp light; Linh comes from the kit's cast. |
| `src/story.js` | Chapter 1, the opening story, shot by shot: Barcelona 1998, online by 2009, the agency in 2010, the court on 13 May 2014, Europe since, and the university in 2026, where Linh asks. The newspaper and the search engine are never named or shown, and Costeja is never drawn: his name is only typed into a search box. |
| `src/scenes.js` | Chapters 2 to 8: the four rights in four sentences; her identity, checked with her signed-in student account; every place she is (her six numbers, the four places around them, every table made from them, each with its owner, searched by every number and every form of her name, then lineage and the classes that mark personal data); the copy, with a reason for every part; her no on the person, and the list rebuilt each semester that can't add her back; what stays, with its reason and end date; and the end. In one room the camera glides on and only what changes fades; between rooms it cuts, and between the past and the present it dissolves. Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line, in Latin American Spanish. |
| `tools/score.py` | The film's music and sounds: humming tops, tin pump tops of the 1800s that hum only while they spin, and a cello, plain, with no vibrato, every chord tuned pure from F (D minor for the problem, F major for the answer). The notice of 1998 is a top: printed, it hums; through the years it slows and falls still; every search for his name spins it again; at "The page stays. The link from his name goes." it is pressed and let go, slowing to still under the cello. Linh's place on the mailing list is a top of its own, which the next semester's rebuild no longer spins. Each sound uses the same word and offset as the picture in `src/scenes.js` or `src/story.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/kept-for-a-reason/3-forgetting-a-person/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every word reads and stands out, places and people paint in time, nothing shows twice or jumps
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, held notes keep their level, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/forgetting-a-person.mp4
```

`tts.py` reuses a line's voice only while its spoken words, voice and model are unchanged, so an edited line is voiced again on its own. `captions.py` reads the lines from the built player, so run `build.py` first after changing one.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/forgetting-a-person/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/forgetting-a-person-poster.jpg`, at the moment `film.json` names. After a new soundtrack, `python site-tools/media.py index --film forgetting-a-person-en` from the repository's root records it in `../audio.json` (see [Audio outside Git](../../../../docs/maintenance.md#audio-outside-git)). Then run `python site-tools/build_series.py`: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`. "Pause and think" is `site/assets/forgetting-a-person/think.en.js` and `think.es.js`. The release workflow renders the video, `forgetting-a-person.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
