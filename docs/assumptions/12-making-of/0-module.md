# Making of: the two films' questions and assumptions

*Making of* · *Data for Films* and *That's not quite right*

[Watch them on the site](https://data.learn-all.org/journey/)

> Kept by the thread "Check that text stays inside its box", 12 November 2026.

The two films were made with the author, so they had no list here. On 12 November 2026 he saw words run past a card on a phone in another series, and asked: "Can we check this via code to fix those glitches?" The check (`site-tools/fits.py`) found three pieces of text past their boxes in these films. They were fixed while he was away. Each line: the question I would have asked, what I did instead, and where it shows.

| # | Film | Question | Assumption | Where it shows |
|---|---|---|---|---|
| 1 | 1. *Data for Films* | Where the film is drawn as a video, the small browser's caption, *a browser with no window, drawing every frame*, ran 154 px past the window at the size a phone needs. Shorten it, or wrap? | Wrap: *a browser with no window,* then *drawing every frame*. | 4:02 to 4:15 |
| 2 | 1. *Data for Films* | In the same picture, two more pieces of text ran past their boxes, and the check can't hold them: the clock's line changes every frame (*has played 0:00.00 → draw that moment*), so the check takes it for a moment in passing, and the pill *every screen refresh* stands over nothing it could be held to. Fix them too? | Yes, found by eye in the picture being fixed. The clock's line takes two lines and its card grows by one; the pill is made from its words at the size they are drawn. | 4:02 to 4:15 |
| 3 | 1. *Data for Films* | The window and the card are drawn by a file that *That's not quite right* borrows. Change it there? | No: the fix is in this film's own scenes, where they call that file, so the second film is untouched by it. | The pull request's checks |
| 4 | 2. *That's not quite right* | Two speech bubbles broke their lines for a smaller size than the words are drawn at: *Five analogies to test first…* ran 177 px past its bubble, and *The style follows what the audience needs…* 58 px. | A bubble breaks its lines at the size they are drawn, so both take more lines and grow with them. | 0:26 to 0:34 and 2:18 to 2:30 |
| 5 | Both | Draw the posters again? | No. These two films have no publishing tool: their players are copied to the site, and the page shows no poster of theirs that this change touches. | The Making of page |
