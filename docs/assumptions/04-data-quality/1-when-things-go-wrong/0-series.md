# When things go wrong: the series' own questions and assumptions

*Data quality* · *When things go wrong*, both films

[Watch the series on the site](https://data.learn-all.org/when-things-go-wrong/)

> Kept by the thread "Check that text stays inside its box", 12 November 2026.

The two films were made with the author, so they had no list here. On 12 November 2026 he saw words run past a card on a phone in another series, and asked: "Can we check this via code to fix those glitches?" The check (`site-tools/fits.py`) found three pieces of text past their boxes in these films. They were fixed while he was away. Each line: the question I would have asked, what I did instead, and where it shows.

| # | Film | Question | Assumption | Where it shows |
|---|---|---|---|---|
| 1 | 1. *Silent change* | The chip *9:00 · confirm classes*, top right while the dashboard is up, was narrower than its words. | The chip is as wide as its words at the size they are drawn. It keeps its right edge, so it grows to the left. | 0:06 to 0:27 |
| 2 | 1. *Silent change* | In the rows as they arrived in bronze, the dates ran past their rows, to the card's edge, and *waitlisted* stood right against them. | The card is 34 px wider, 17 on each side, and the last two columns are set for the words at the size they are drawn. | 2:06 to 2:24 |
| 3 | 2. *Too good to be true* | The pill *sync: safe to run twice* was narrower than its words. Widen it, or wrap? | Both: *sync:*, then *safe to run twice*, in a pill 40 px wider. It stands under the *Admissions system* card and is no wider than it. | 5:14 to 5:48 |
| 4 | 2. *Too good to be true* | In the same picture, the gauge's number, *+0.5%*, touched the line under it, *overnight change*: both are drawn larger for a phone. No text leaves a box there. Fix it anyway? | Yes: it is in this film's own code, in the picture being fixed. The line sits lower under the number, and the gauge stands 7 px higher, so the line is where it was, above the captions. The film's other gauges had room, and stay as they were. | 5:45 to 5:48 |
| 5 | 1. *Silent change* | On the dashboard, the small print *last 14 days* sits right under *▲ 2 pts vs last week*, and the two touch. No text leaves a box there. Fix it too? | Not here. The dashboard is drawn, at the sizes a phone needs, by code that 112 films carry in their players (`films/from-words-to-data/shared/src/phone.js`). A change there is a new version of each of them, so it wants its own pull request. | 0:00 to 0:27, and 5:12 to 5:18 |
| 6 | 1. *Silent change* | Draw the poster again? It shows the dashboard and the chip of row 1, as they were drawn before the film was made to read on a phone. | Not yet. A new poster would show the film as it plays now, with the two lines of row 5 touching, on the film's page before anyone presses Play. It is drawn again with that fix. *Too good to be true*'s poster shows a moment this change doesn't touch. | The film's page, before Play |
| 7 | Both | A change to *Silent change*'s own scenes sent 57 other films to be checked and rendered again, because their rows name its folder to borrow one file from it. Leave that? | No. The tool that reads each film's row (`.github/scripts/films.py`) now takes such a row as naming the one file those films borrow, `silent.js`, and a test holds it. *Silent change*'s row also gains `sketch3.js`, which it draws with and didn't name. | The pull request's checks: this film, not 58 |
