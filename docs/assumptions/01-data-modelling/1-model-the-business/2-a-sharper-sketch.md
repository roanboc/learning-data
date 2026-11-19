# A Sharper Sketch: questions and assumptions

*Data modelling* · *Model the business*, film 2 (until 19 November 2026, a film on its own)

[Watch it on the site](https://data.learn-all.org/sketch/)

> Kept by the thread "Check that text stays inside its box", 12 November 2026.

The film was made with the author, so it had no list here. On 12 November 2026 he saw words run past a card on a phone in another series, and asked: "Can we check this via code to fix those glitches?" The check (`site-tools/fits.py`) found one piece of text past its box in this film. It was fixed while he was away. Each line: the question I would have asked, what I did instead, and where it shows.

| # | Question | Assumption | Where it shows |
|---|---|---|---|
| 1 | At the end, the card *How it counted* has three lines. The first, *one row = one student in one unit offering*, ran past the card at the size a phone needs. Shorten it, widen the card, or wrap? | Wrap: *one row = one student*, then *in one unit offering*, with its blue bar beside both. The card grows downwards by that one line, and the two lines under it move down with it. The card keeps its width: it stands under the Genie card, which is as wide. | 5:18 to 5:23 |
| 2 | The film's own scenes sit in a folder that 89 later films name as theirs, because they borrow one file from it. So a change to this film alone would have sent all of them to be checked and rendered again. Leave that? | No. The tool that reads each film's row (`.github/scripts/films.py`) now takes such a row as naming the one file those films borrow, `sketch3.js`, and a test holds it. This film's scenes belong to this film only; a change to `sketch3.js` still reaches every film that draws with it. | The pull request's checks: one film, not 90 |
| 3 | Draw the poster again? | No. It shows a moment this change doesn't touch. | The film's page, before Play |

## Made film 2 of *Model the business*

> Kept by the series' thread, 19 November 2026.

Made while Rodrigo was away, on stated assumptions, as he asked for the series. The series' own questions are in [0-series.md](0-series.md). One line each: the question, the assumption made instead, where it shows, and what changes if it's wrong. The same choices are in the film's *Decided* rows (`films/a-sharper-sketch/decided.md`).

| # | Question | Assumption made | Where it shows | If it's wrong |
|---|---|---|---|---|
| 4 | Is the registers' four columns the right part of the story for this film, and are its facts right? | Yes. The *Ming History* (*Mingshi*, juan 77): the Yellow Registers made again every ten years, so 1391 is the first remaking; each household's entry in four columns, 舊管、新收、開除、實在; the registers checked each year. Zhang (2008, p. 153): the county checked each register against the earlier ones. Chinese Wikipedia (*黃冊*): faulty registers were rejected and made again. | *Four columns* | A line or two of narration |
| 5 | How does the voice say the four columns? | In plain words, never their Chinese names: *what it held ten years ago, what came in, what went out, and what it holds now*. | *Four columns* | One line |
| 6 | Which households and numbers? | Invented, small and round: a seller with 5 fields, now 4, and a buyer with 3, now 4. The sources give no household's numbers. | *Four columns* | The picture's numbers in `source/src/scenes.js` |
| 7 | What didn't the story achieve? | The yellow registers, made every ten years for taxes paid every year, fell behind; the counties kept white registers, written each year, for the real work, and the yellow ones became a formality. From the *Ming History* (其後黃冊只具文…曰白冊) and Yang Guo'an (*Guangming Daily*, 3 December 2018). *By the late Ming* doesn't say when the first white register was written: in the south, some were kept from early in the dynasty. | *Pull back* | Two lines |
| 8 | Does the recap still name *The Inner Life of Data*? | No: it starts from the map the film before placed the sketch on (*Our sketch of the university has a place on its map now*), with that film's pins, and the board reads *Conceptual model · the sketch, on the map*. | *The sketch on the map* | One line, and what `site-tools/smoke.py` looks for |
| 9 | When does the Head of School ask? | *A few weeks after census date*, not *the day after*: Genie counts on 26 April, and census date is 31 March. | *Two numbers* | One line |
| 10 | Which numbers fill the four columns in *Enrolled when?* | 118 on census date, 2 late enrolments approved after it, 1 withdrawal, and 119 today: the 119 Genie had counted before the model was sharp enough. | *Enrolled when?* | The card's numbers |
| 11 | Which sound? | The film's own palette, as before: a felt piano over a soft held voice, in D major, mixed again to today's rules. Its mark, D, F sharp, A, D, is the four columns. Nothing borrowed from Chinese music. | The score | `source/tools/score.py`, mixed again |
| 12 | Voice the old lines again? | No: every line keeps its voice; the new lines are in the same voice. Two chapters get a little more room instead (*Four columns* and *Check, adopt, extend, record*, now 139 words a minute). | The whole film | `source/src/breath.js` |
| 13 | Draw the poster again? | No: it shows the sketch at *Check, adopt, extend*, which this change doesn't touch. | The film's page, before Play | `site/assets/sketch-poster.jpg` |
| 14 | Its labs? | The six labs and twelve scenarios stay until the next pull request, which makes *Enrolled when?* the film's playground and brings it into the series' evaluation. | `sketch/labs/`, `sketch/scenarios/` | That pull request |
| 15 | A review page before merging? | No render or review page in the thread: the author reviews the film on the site, with its Draft label, as he asked for every thread. | The pull request | Make one from the merged film |
