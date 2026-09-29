# From words to data

*A series of seven short films on data modelling. In Spanish: De las palabras a los datos.*

**Tagline:** Agree what things are, write it down, and keep it true.

The series starts before technology, with how minds turn the world into words, and ends with how AI can help keep a business's meaning true, end to end. In between: why conceptual and logical models matter to systems, the shapes data takes for writing and for reading, hybrid databases, and the semantic layers, ontologies and industry standards that make meaning something a machine can read. It follows one idea through all seven films, older than any system: the credential, how people prove what they know. The university's new microcredentials are its newest form, and the "sketch v3?" that ends *A Sharper Sketch* is where the series begins. The promise, as for every Learning Data film: a newcomer follows it, and an expert agrees with every line; *What's in a word* also answers to linguists and cognitive scientists.

**On the site:** [From words to data](https://roanboc.github.io/learning-data/from-words-to-data/), in Spanish [De las palabras a los datos](https://roanboc.github.io/learning-data/es/from-words-to-data/). The films are in English, with English and Spanish captions; their pages, chapters, Pause and think questions, labs and scenarios are in English and Spanish. Each film stands alone, and each builds on the ones before it.

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Labs and scenarios | Script |
|---|---|---|---|---|---|
| [What's in a word](https://roanboc.github.io/learning-data/from-words-to-data/whats-in-a-word/) | Language and meaning | 6 min | 10 | 4 labs, 8 scenarios | [script](1-whats-in-a-word/script.md) · [source](1-whats-in-a-word/source/README.md) |
| [Older than the systems](https://roanboc.github.io/learning-data/from-words-to-data/older-than-the-systems/) | Models and systems | 5½ min | 8 | 3 labs, 8 scenarios | [script](2-older-than-the-systems/script.md) · [source](2-older-than-the-systems/source/README.md) |
| [Built to write, built to read](https://roanboc.github.io/learning-data/from-words-to-data/built-to-write-built-to-read/) | Shapes for data | 5 min | 8 | 3 labs, 8 scenarios | [script](3-built-to-write-built-to-read/script.md) · [source](3-built-to-write-built-to-read/source/README.md) |
| [Many ways to read](https://roanboc.github.io/learning-data/from-words-to-data/many-ways-to-read/) | Shapes for reading | 4 min | 8 | 3 labs, 8 scenarios | [script](4-many-ways-to-read/script.md) · [source](4-many-ways-to-read/source/README.md) |
| [Both at once](https://roanboc.github.io/learning-data/from-words-to-data/both-at-once/) | Hybrid databases | 4 min | 9 | 3 labs, 8 scenarios | [script](5-both-at-once/script.md) · [source](5-both-at-once/source/README.md) |
| [Meaning machines can read](https://roanboc.github.io/learning-data/from-words-to-data/meaning-machines-can-read/) | Meaning and AI | 4 min | 8 | 3 labs, 8 scenarios | [script](6-meaning-machines-can-read/script.md) · [source](6-meaning-machines-can-read/source/README.md) |
| [Keeping it true](https://roanboc.github.io/learning-data/from-words-to-data/keeping-it-true/) | Keeping meaning current | 5 min | 10 | 4 labs, 10 scenarios | [script](7-keeping-it-true/script.md) · [source](7-keeping-it-true/source/README.md) |
<!-- /films -->

The [proposal](proposal.md) records how the series was planned and the decisions taken on 28 September 2026: seven films, the title, the credential as the thread, and an opening film that starts before writing.

## The thread: the credential

| Film | What happens to the credential |
|---|---|
| What's in a word | Four offices give four answers to "how many credentials did we award?". They agree, on paper, what a credential is. |
| Older than the systems | Its idea turns out to be centuries old. It meets five systems, each with its own model of it. |
| Built to write, built to read | Awards are issued one by one on graduation day, and read ten years at a time by planners. |
| Many ways to read | Credentials from a new platform are integrated, presented and served as one learner record. |
| Both at once | An employer checks a credential live; a learner's wallet shows, now, how close she is to a graduate certificate. |
| Meaning machines can read | Genie is asked who is one microcredential away from a certificate, and must read the stacking rules, not guess them. |
| Keeping it true | The government adds a reporting rule, and a credential issued in error is revoked. AI spots both and drafts the change; people approve sketch v3. New shapes for data will keep coming; the credential's meaning, identity, grain and time are what remain. |

## Every film starts in the past

| Film | Opens with | Still true today |
|---|---|---|
| What's in a word | Vervet monkeys, with one alarm call for each hunter | A signal can stand for a kind of thing. |
| Older than the systems | A school tablet, a guild's masterpiece, a sealed licence to teach | Someone trusted makes a claim about someone, in a way others can check. |
| Built to write, built to read | Pacioli's journal and ledger, 1494 | One set of facts: a shape for writing, a shape for reading. |
| Many ways to read | A library's card catalogue | The same thing, reached many ways. |
| Both at once | The cash register, 1879 | Recording and counting in one place. |
| Meaning machines can read | Linnaeus, Wilkins and Nightingale | Shared definitions let strangers compare. Universal ones fail. |
| Keeping it true | Johnson's dictionary, 1755 | Meaning moves. Someone has to keep up. |

## What every film shares

- **The same world.** The fictional university and the platform from *The Inner Life of Data*, drawn with its engine and components, *A Sharper Sketch*'s diagrams and tables, and *Silent change*'s messages, dashboards and contract card.
- **The same people.** The square from *When things go wrong*, plus two: Noor Rahman, the data architect, who guides the series, and Tom Whitfield, who runs short courses. Mei Tanaka, from the registrar's office, owns the words.
- **The series' own components**, in [`shared/src/words.js`](shared/src/words.js): the credential card in every age (clay, wax, paper, badge, digital), wax seals, the offices' cards, the word–idea–thing triangle, pencil and paper, word histories, the warm backgrounds of the past, the title and end cards, and the four dots of the series' motif.
- **The same look for time:** the past is warm, like clay and parchment, with a date in the corner; the present is the films' dark glass.
- **One motif, seven sounds.** Every film plays the series' four notes (1, 5, 6, 3) at its title and its end, in its own key and on its own instrument; everything else about the music differs, so no film sounds like another:

| Film | Sound |
|---|---|
| What's in a word | A kalimba, a breathy flute, a choir and a frame drum, in D, between Dorian and major; birdsong, alarm calls and a stylus in clay |
| Older than the systems | Organ and reed drones with a harp and a lute for the past, then glass pads and an e-piano for today's systems, in A minor to C major; seals and quills |
| Built to write, built to read | A busy marimba and woodblock for writing against slow strings and a felt piano for reading, in B-flat; quills, keys and ledger pages |
| Many ways to read | Library jazz: an e-piano on seventh chords, a walking bass, brushes, in F; card drawers and date stamps |
| Both at once | Two interlocking synth arpeggios over a soft pulse, in E minor to major, after a ragtime piano and a cash register for 1879 |
| Meaning machines can read | Glass bells, glass pads and a celesta in C Lydian; a harp and strings for the eighteenth and nineteenth centuries |
| Keeping it true | Strings over a ticking clock and a felt piano, in C, drifting to A minor and back; *What's in a word*'s kalimba and *Older than the systems*' bell return at the end |

- **The same craft.** Narration only; a flowing pace of about 125 to 135 words a minute; four Pause and think questions per film (five in *Keeping it true*, for its chapter on what remains); labs and scenarios on the site, in English and Spanish. See [PLAYBOOK.md](../../PLAYBOOK.md), and its section on what this series added.

## How it's built

```
films/from-words-to-data/
  README.md, proposal.md       this page, and the plan the series was made from
  series.json                  the words of the series page, in English and Spanish
  shared/
    src/words.js               the series' components (see above), and its two new people
    src/page.html              the standalone player page, for every film
    tools/                     the series' tools: tts, build, audio, check, render, captions, pace, stills, publish;
                               music.py is the instrument library every film's score plays
  <n>-<film>/
    script.md                  the script, with its rigour sheet, sources and pacing report
    site.json                  the words of the film's pages, in English and Spanish
    captions/                  en.srt, en.vtt, es.srt and es.vtt, from the film's timeline (the video has no captions on its picture)
    source/
      film.json                its key, title, source files, poster moment and the words the voice respells
      src/                     narration.js, breath.js, vodur.js, its own pictures (<film>.js, with LV for the labs), scenes.js,
                               and i18n/es/captions.js, the Spanish captions (each English line, and its caption)
      tools/                   one line each, running the shared tools on this film; score.py is its music
```

Each film's `source/README.md` says how to rebuild it. The short version, from a film's `source/` folder: `python tools/tts.py`, `python tools/build.py`, `python tools/audio.py`, `python tools/build.py`, `python tools/check.py`, then `python tools/render.py --workers 4` for the video or `python tools/publish.py` for the site. `python tools/captions.py` writes the English captions, and `FILM_LANG=es python tools/captions.py` the Spanish ones. The release workflow renders every film from the committed source, like the other films.

On the site, [`site-tools/build_series.py`](../../site-tools/build_series.py) makes every page of the series, in both languages, from `series.json` and each film's `site.json`, source and words, and keeps the series' cards up to date on the home page, the topics page, *A Sharper Sketch*'s page and the overview's scenarios. Never edit those pages or blocks by hand; `site-tools/check_site.py` fails if they aren't what the generator makes. The labs and scenarios of all seven films run on one engine, [`site/assets/from-words-to-data/learn.js`](../../site/assets/from-words-to-data/learn.js), from each film's words in `site/assets/<film>/learn.en.js` and `learn.es.js`.

## Making the next one

1. Add a folder, copy `film.json`, `requirements.txt`, `.gitignore` and the one-line tools from another film, and add the folder to `series.json`.
2. Write the narration first, and voice it (`tools/tts.py`); check the pace (`tools/pace.py`).
3. Draw the film's own pictures and scenes, reviewing stills (`tools/stills.py`) at every cue, until `tools/check.py` says every moment draws.
4. Give it its own sound in `tools/score.py`, with the series' motif at the title and the end.
5. Write its labs, scenarios and Pause and think questions in English and Spanish, with its `site.json`, and its Spanish captions in `src/i18n/es/captions.js`.
6. Publish it (`tools/publish.py`), run `python site-tools/build_series.py`, then `python site-tools/check_site.py` and `python site-tools/smoke.py`.
