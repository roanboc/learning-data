# Rebuilding A reason to keep it

*A reason to keep it*, film 1 of 5 of *Kept for a reason*, the third series of the module *Data protection and privacy*, is generated from code like every other film here. It bundles *The Inner Life of Data*'s engine, fonts and voice model, *A Sharper Sketch*'s `scene()`, two files of the agent films' kit, and the module's look and tools in [`../../../locks-before-the-data/shared/`](../../../locks-before-the-data/shared/), whose [README](../../../locks-before-the-data/shared/README.md) says how a film uses them. Only what is new in this film lives here, and every name it declares starts with `rk_` or `RK_`:

| File | What it holds |
|---|---|
| `film.json` | The film's key, title, subtitle, the page's line on what the colours mean, its own source files in order, the moment its poster shows (*Six reasons*, as Mei comes in), the words the voice respells (Jun, HR, Mei, Yusuf, Linh Nguyen), its opening story (`number`), and no chapter where the score may pulse. It names no tool, so it shows no logos. |
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). The film re-times itself to the voice. A line with a year or a number says it in words for the voice (`say`), and shows it as written in its caption. |
| `src/vodur.js` | The voiced length of each line, written by `tools/tts.py`. |
| `src/breath.js` | The holds after some lines, and two wordless moments: the title card after the opening, and the end card. |
| `src/rk_oregon.js` | The opening's world, in the module's night light: a street of low brick buildings on a December evening in the rain, the public health clinic's door and window frosted and lit warm from inside; the clinic inside, by night and by day (one room); the people of 1986, ordinary adults dressed for their time, with no sign of illness (a counsellor, Daniel, and four people waiting); the tubes and their labels, the index card of a name and a result, the cabinet and its cards, the name card and the number card, and the two counts. A result is never shown: only a card lying face down. |
| `src/rk_hall.js` | The hall at night and what is shown in it: Ingrid at the left in every chapter, and Mei, Clara and Linh in turn at the right; Linh's ten pieces, each a glass card with its label clear and its value under violet frost; each reason as a green pill on a card's top edge, or an empty outline, "for: ?"; the band of the six reasons; the 2023 and 2027 application forms; the consent line; Linh's wishes and the mailing list built from them; the privacy check, the counts it allows and the deeper check; what HR can tell Linh it holds, and why; and the small cards that bring back Oregon. |
| `src/scenes.js` | The seven chapters. The street and the clinic are the opening's rooms, the hall is one room for the rest: in each, the camera glides from one framing to the next and what changes fades; a later moment in the hall (`later: true`) lets what was there leave before the next comes in, and Ingrid stays in her place. Chapters open where the one before ends (`ag_cutInto`). Every moment is timed to a word of a line (`wAt()`), so the pictures stay with the voice. |
| `src/i18n/es/captions.js` | The Spanish captions, one per English line. |
| `tools/score.py` | The film's music and sounds: an oboe d'amore, played softly, and a low marimba struck with yarn mallets. The six reasons are six notes of one chord, A major's five notes with no semitone, one struck as each reason lands; each piece sounds its reason's note, and a piece with no reason gets none. A major, F-sharp minor for the problem, tuned pure. Each sound uses the same word and offset as the picture in `src/scenes.js`: change one, change both. |
| `tools/` | Each other tool runs the module's tool (`../../../locks-before-the-data/shared/tools/run.py`) on this film. |

## Setup (once)

Follow the setup in [the build guide of *The Inner Life of Data*](../../../inner-life-of-data/source/README.md): Python, `pip install -r requirements.txt`, Chromium for Playwright, and the Kokoro voice model. The tools use `models/` here if it exists, and otherwise the `models/` of *The Inner Life of Data*.

## Rebuild

Run from this folder, `films/kept-for-a-reason/1-a-reason-to-keep-it/source/`:

```
python tools/tts.py        # voices each line into build/vo/ and writes src/vodur.js
python tools/build.py      # dist/render.html, dist/film.js, dist/film.html
python tools/check.py      # every moment draws, every word reads and stands out, every place and person paints in time, nothing shows twice or jumps, hands stay steady
python tools/legible.py --overlaps   # every piece of text reads on a phone, and none covers another
python tools/pace.py       # pacing per chapter
python tools/stills.py [chapter ...] [--at 12.5 ...] [--every 2] --size 1920   # review stills -> build/stills/
python tools/quiet.py      # the music comes now and then, nothing beats, and nothing pulses
python tools/audio.py      # mixes dist/soundtrack.mp3 from build/vo and tools/score.py
python tools/build.py      # again, to embed the soundtrack
python tools/captions.py   # ../captions/en.srt and en.vtt
FILM_LANG=es python tools/captions.py   # ../captions/es.srt and es.vtt
python tools/render.py --workers 4   # dist/a-reason-to-keep-it.mp4
```

The voice cache knows which lines changed: after changing a line's words, or a word the voice respells in `film.json`, run `tools/tts.py` again and it voices only those lines.

## Publish

`python tools/publish.py` copies `dist/film.js` and `dist/soundtrack.mp3` to `site/assets/a-reason-to-keep-it/`, with the Spanish captions (`src/i18n/es/captions.js`, as `captions.es.js`), and draws the poster, `site/assets/a-reason-to-keep-it-poster.jpg`, at the moment `film.json` names. Then run `python site-tools/build_series.py` from the repository's root: it makes the series' pages, in English and Spanish, from the series' `series.json` and the film's `site.json`, whose `elsewhere` links the texts the film's ideas come from. "Pause and think" is `site/assets/a-reason-to-keep-it/think.en.js` and `think.es.js`: it stops after `six`, `yes` and `newuse`, with one question each. The release workflow renders the video, `a-reason-to-keep-it.mp4`, and checks that the site's `film.js` is byte for byte the one this source builds: publish again after any change to the source.
