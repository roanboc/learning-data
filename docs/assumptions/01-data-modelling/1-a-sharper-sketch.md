# A Sharper Sketch: questions and assumptions

*Data modelling* · *A Sharper Sketch*

[Watch it on the site](https://data.learn-all.org/sketch/)

> Kept by the thread "Check that text stays inside its box", 12 November 2026.

The film was made with the author, so it had no list here. On 12 November 2026 he saw words run past a card on a phone in another series, and asked: "Can we check this via code to fix those glitches?" The check (`site-tools/fits.py`) found one piece of text past its box in this film. It was fixed while he was away. Each line: the question I would have asked, what I did instead, and where it shows.

| # | Question | Assumption | Where it shows |
|---|---|---|---|
| 1 | At the end, the card *How it counted* has three lines. The first, *one row = one student in one unit offering*, ran past the card at the size a phone needs. Shorten it, widen the card, or wrap? | Wrap: *one row = one student*, then *in one unit offering*, with its blue bar beside both. The card grows downwards by that one line, and the two lines under it move down with it. The card keeps its width: it stands under the Genie card, which is as wide. | 5:18 to 5:23 |
| 2 | The film's own scenes sit in a folder that 89 later films name as theirs, because they borrow one file from it. So a change to this film alone would have sent all of them to be checked and rendered again. Leave that? | No. The tool that reads each film's row (`.github/scripts/films.py`) now takes such a row as naming the one file those films borrow, `sketch3.js`, and a test holds it. This film's scenes belong to this film only; a change to `sketch3.js` still reaches every film that draws with it. | The pull request's checks: one film, not 90 |
| 3 | Draw the poster again? | No. It shows a moment this change doesn't touch. | The film's page, before Play |
