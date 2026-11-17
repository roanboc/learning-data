# Governance principles: the series' own questions and assumptions

*Data governance* · *Governance principles*, films 1, 3, 4 and 9

[Watch the series on the site](https://data.learn-all.org/data-governance/)

> Kept by the thread "Check that text stays inside its box", 12 November 2026.

A film of this series that has its own list keeps it beside this file. This list is for one change to four of the films. On 12 November 2026 the author saw words run past a card on a phone in another series, and asked: "Can we check this via code to fix those glitches?" The check (`site-tools/fits.py`) found five pieces of text past their boxes in four films of this series. Four were fixed while he was away, and one is meant. Each line: the question I would have asked, what I did instead, and where it shows. Each film's own *Decided* rows have the same change.

| # | Film | Question | Assumption | Where it shows |
|---|---|---|---|---|
| 1 | All four | Where a box is too small for its words: shorten the words, or change the box? | Keep every word, and make the box from its words. Two of the boxes are things a person holds, a card and a binder, which can't grow in the hands: there the words are a little smaller, and still above the 28 px a phone needs. The pictures the series shares are unchanged: each fix is in its film's own code. | The places below; the series' other six films had none |
| 2 | 1. *Off the shelf* | On the page of the framework's three steps, the gold light behind the third column, and the halo behind the item being read, were narrower than *Concerns for recovery*: it ran 25 px past both. | The lit column and an item's halo are as wide as their words. | 1:04 to 1:05 |
| 3 | 3. *One word, one home* | On the card Yusuf holds at Planning's door, *thank you* crossed the line drawn round the card, on both sides. A bigger card, two lines, or smaller words? | Smaller words, on one line as a card says it: about 32 px on the screen where they were 38, inside the line. The card stays the size two hands hold. | About 5:24 |
| 4 | 4. *Who may see it* | On the binder Yusuf takes from the shelf, the title's first line, *Who may*, was wider than the binder's label. A wider binder, or a smaller title? | A smaller title, in a label 8 px wider: about 30 px on the screen where it was 34. The binder stays as wide as the others on the shelf. | 1:53 to 1:55 |
| 5 | 4. *Who may see it* | In the award's code, *S-20417-GCDA*, a plum highlight marks the student number, *S-20417*. The check reads the highlight as the code's box, and the code as 125 px past it. A fault? | No: the highlight is meant to cover only part of the code. The film names it as text that is meant to leave a box (`spills` in its `film.json`, with that reason), so the check passes it and still holds every other piece of text. | About 3:22 |
| 6 | 9. *An agent that checks* | On the big screen near the end, the four parts stand in two columns, and the left column's words began 16 px before the screen's edge (*a checklist in plain words*). Move the words, or the columns? | The columns: both stand 76 px nearer the middle, so each part and its words are on the screen. | 6:00 to 6:08 |
