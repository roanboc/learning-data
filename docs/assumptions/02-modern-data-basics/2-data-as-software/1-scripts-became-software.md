# Scripts became software: questions and assumptions

*Modern data basics* · *Data as software*, film 1 · merged, PR #179 · [pull request](https://github.com/roanboc/learning-data/pull/179)

[Watch it on the site](https://data.learn-all.org/data-as-software/scripts-became-software/)

> Copied from the film thread's notes on 10 November 2026. Paths such as `../briefs.md` point to the thread's working folder, not to this repository.

Kept by the film's thread ("Make data basics film 4 Scripts became software"), for Rodrigo to review later, as he asked on 5 November 2026 at 11:53 UTC. One line each: the question, the assumption made instead, and where it shows.

Merged into main as a draft on 10 November 2026, as [PR #179](https://github.com/roanboc/learning-data/pull/179). Its soundtrack is published (release `audio-scripts-became-software-b9fe73467a29243d5d33`, made on merge), and these 21 questions are also on the Films to check list.

| # | Question | Assumption made | Where it shows | If it's wrong |
|---|---|---|---|---|
| 1 | Which opening story? The plan's, Pacioli's double entry (Venice, 1494), already opens *Built to write, built to read* (From words to data, film 3). | The Tacoma Narrows Bridge, 1940 to 1950: a bridge designed by the accepted theory of its day fell four months after it opened, because nobody had tested how wind would move its deck; its replacement was tested first as models in a wind tunnel, as aircraft had been since the Wright brothers (1901), and that became a standard step for long bridges. A practice known next door, taken up, as data work took up software's. Not the plan's fallback, the NATO conference at Garmisch (October 1968), since films 5 and 8 open in July 1969 and November 1968. | The opening and the close; `openings.md` | The opening is replaced; Garmisch 1968 is ready |
| 2 | Is a third opening set in the United States too many (Apollo 11 in film 5, the logbooks in Washington in film 9)? | It's fine: three different eras and kinds of story (a bridge, a landing, a naval office), among nine. | The opening | Garmisch 1968, in Germany |
| 3 | What exactly is payroll's export? | What casual staff are paid on each pay day, from the approved claims, by faculty and unit, totals only: Finance's *casual pay paid*. Salaried staff are paid from their contracts in the payroll system, not from claims, so they aren't in it. | The data story; `mart_finance__casual_pay_paid` | The model's scope and the film's words change |
| 4 | Who owns the export? | HR, as Ingrid Holm, who answers for what payroll's figures mean; Finance (Rohan Desai) reads it. The table sits in Finance's folder, as Finance's marts do; its owner is HR. | The film's people; the model's and the product's owner | The owner becomes Finance in the YAML, the product and CODEOWNERS |
| 5 | What is payroll's rule, and its calendar? | A claim approved by 12:00 on the Monday before a pay day is paid that Thursday, otherwise a fortnight later; pay days every second Thursday from 26 February 2026; Easter (claims close the Thursday before Good Friday) and the summer close (a week early) move it. Invented, as the module's other numbers are. | The unit test on screen (11:59 and 12:01); the pay days seed | The seed and the test change |
| 6 | Who does what in the move? | Jun Park writes the model and its tests, Sam Okafor the job, and each reviews the other's pull request; Ingrid confirms the rule; Noor approves it for production; Rohan reads the figures. Linh isn't drawn (the module draws her in films 1, 3 and 9). | Every chapter | The people change in the pictures and the voice |
| 7 | When did the export move, and why then? | The claims app went live on Monday 23 February 2026, and the spreadsheets the script read stopped coming; the move was decided on 4 March, and the export has run for every pay day since 12 March: 5 November is its eighteenth. The script's author, unnamed, moved to another team in 2024. | The data story; the decisions' dates | Dates in the decisions and the voice change |
| 8 | Marts can't read the claims app's staging model, which is private. Add a core model? | Yes: `core_claim`, version 1, in a new core domain, `staff` (the university's map already had it, owned by HR), an extension of TCSI's Staff packet, with data governance's confirmation that the glossary has no term for a claim. Agreed with films 5 and 7, which read it. | The example project | The claim gets a glossary term, or another home |
| 9 | How does a change reach production? | A branch; a pull request whose checks build and test it; one approval from someone other than its author; once merged, the same files deployed to test and run there; then to production when Noor, the production environment's required reviewer, approves; test and production run as the platform's service principal. With GitHub Actions and Declarative Automation Bundles, as an example in `examples/scripts-became-software/` that never runs here. | The road on screen; DEC-PRJ-16 | The road's steps change in the example and the picture |
| 10 | How often does the job run? | 06:00 every Thursday, Sydney time: a schedule can't say "every second Thursday", and on a Thursday that isn't a pay day it builds the same figures. | The job's file; one line on screen | A trigger after each pay run instead |
| 11 | Should the film name the bundles' old name? | The film says only "Declarative Automation Bundles"; the page's link to the docs adds "formerly Databricks Asset Bundles", for those who know it by that name. The date of the rename isn't on the pages read, so it's said nowhere. | The film's page | One line on the page |
| 12 | Which Git host? | GitHub, with its official mark, as the example project's own repository is there; Git is named as the idea. | The pull request on screen | The mark and one word change |
| 13 | How much of Git, CI and deployment does the film teach? | One road, once, at the level of architecture, with the tools named and the official docs linked; no commands on screen. "Not new": software has been made this way for decades, and data work took it up. | Every chapter | A lab goes deeper |
| 14 | Which earlier films does it name, not teach? | *Declare it, then build it*, *Promises and proofs* and *Built in layers* (*In the weeds of data crafting*), *Change without surprises*, and the agents' rule: an agent proposes, a person approves. | One line each | The lines change |
| 15 | Which partner for the ophicleide? | A second ophicleide, higher, reading the same part: every light plucked or struck colour the site lacks belongs to another culture or sounds like one the site has. | The score; `palettes.md` | The score is made again with another partner |
| 16 | How long, and how many chapters? | 6:20.8 in seven chapters, at 131 words a minute: longer than the plan's four minutes, since the opening needs its four beats said outright and the road its five steps. | The whole film | A chapter is cut (the tunnel's or the review's), and the film is timed again |
| 17 | May the film draw Frederick Farquharson, a real engineer? | Yes, as a man of the 1940s (a dark suit, a tie, round glasses) at the tunnel, not a likeness; no photograph is shown, and the film says only what the sources say he did. | The tunnel, in the opening | He is left out of the picture, and only named |
| 18 | Which Spanish word for "laptop"? | "el portátil", as the series' page already says it. | Three Spanish captions and the page | One word in each |
| 19 | Which chapters stop for Pause and think? | Three: after *A script on a laptop*, *Into the project* and *The same way, every time*, one question each with a near miss. | The film's page | Questions move or are added |
| 20 | Where do Spanish readers go for the docs? | Databricks' own pages have no Spanish, so the Spanish page links Azure Databricks' pages on Microsoft Learn in Spanish, which say the same; dbt's are marked "(en inglés)"; GitHub's are in Spanish. | The film's page, *Go further in the official docs* | The Spanish page links the English pages |
| 21 | Does the score sound right? | It passes every sound check (quiet.py and held notes) and is mixed to -16 LUFS, but nobody has listened to it: the ophicleides are made from code, as the module's other scores are. | The whole soundtrack | The score is made again |

## Who approves what (11 November 2026)

After Rodrigo's feedback that Finance and other users request and approve tickets, linked to the branch and pull request, while technical people review pull requests and users validate before the ticket closes. Made on these assumptions:

| # | Question | Assumption made | Where it shows | If it's wrong |
|---|---|---|---|---|
| 22 | Which ticket system? | None named: "a ticket", with a Jira-like key, FIN-212, since Rodrigo named Jira or GitHub issues and the film names no tool it doesn't need. | Chapters 4 and 5 | The key becomes an issue number, such as #212 |
| 23 | Where does the user check the result? | In test, after the merge and before Noor's release approval: Rohan compares the figures with his own, and the ticket stays open until he says they're right. | Chapter 5 | He checks after production instead, before the ticket closes |
| 24 | Does Noor still approve the release? | Yes: she is the data architect, a technical approver of production, not a user. | Chapter 5 | Production goes on after Rohan's check alone |
| 25 | Does *A platform that watches itself* need the same fix? | Not in this change: its line "Sam's pull request also asks Ingrid Holm, in HR, ... to change the contract first" is left for a change of its own. | Film 2 of the series | The same fix there: Ingrid gets a ticket, not a pull request |

## 12 November 2026: text inside its box (thread "Check that text stays inside its box")

The author saw words run past a card on a phone in another series, and asked: "Can we check this via code to fix those glitches?" The check (`site-tools/fits.py`) found one piece of text past its box in this film. It was fixed while he was away.

- **Question:** on the card of the spreadsheets, the second line, *from each faculty*, ran 10 px past the card. Widen the card, and which way?
- **Assumption taken:** to the left, by 20 px, and the *Claims app* card under it with it, so the two stay one width. The laptop beside them stays where it is: the next chapter's panel takes its place, so it can't move. No word changed. It shows at 2:15 to 2:56.
