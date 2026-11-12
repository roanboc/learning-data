# Quality on the platform: questions and assumptions

*Data governance* · *Governance you can use*, film 4

[Watch it on the site](https://data.learn-all.org/governance-in-practice/quality-on-the-platform/)

> Kept by the thread "Check that text stays inside its box", 12 November 2026.

On 12 November 2026 the author saw words run past a card on a phone in another series, and asked: "Can we check this via code to fix those glitches?" The check (`site-tools/fits.py`) passed this film. Then it was made to draw each film a second way, as the video is drawn: there, every letter of a film's own fonts sits on a whole pixel, and a line of code comes out about 1% longer. Drawn that way, two lines of this film left their box, and only that way. They were fixed while he was away. Each line: the question I would have asked, what I did instead, and where it shows.

| # | Question | Assumption | Where it shows |
|---|---|---|---|
| 1 | The sheet of `dbt_project.yml` is 1780 px wide, and line 103, its longest, is lit while the rule is read. In the video the line is 20 px longer, and the light behind it, which stops at the sheet's margin, ended 3 px before the line did. Leave 3 px, or give the line room? | Give it room: the sheet is as wide as its longest line and the light behind it need, 1796 px in the video, 16 more. In the site's player it is as it was. | 1:54 to 2:00 |
| 2 | The sheet of `credit_points`' tests is 1180 px wide. Line 68, the comment added with the new test, filled its green band to the last pixel in the site's player, and ran 12 px past it in the video. Widen the sheet, or show less of the line? | Widen: the sheet is as wide as that line with room in its band, 1210 px in the player and 1222 in the video. It grows to the left, so its right edge stays clear of the card beside it. The line is the example project's own, so it stays whole. | 4:47 to 4:52 and 5:21 to 5:25 |
| 3 | The sheets are drawn by tools the series' six films share. Change the tool, so every sheet is made from its lines? | Not here: that is a new version of all six films. The two sheets are sized in this film's own code, and the check, which now draws every film both ways, found no other sheet too narrow. | The pull request's checks |
