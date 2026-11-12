# Services with customers: questions and assumptions

*Data management* · *Architecture that keeps up*, film 1 · merged, PR #240 · [pull request](https://github.com/roanboc/learning-data/pull/240)

[Watch it on the site](https://data.learn-all.org/architecture-that-keeps-up/services-with-customers/)

> Copied from the film thread's notes on 10 November 2026. Paths such as `../briefs.md` point to the thread's working folder, not to this repository.

Data management film 13, *Architecture that keeps up* film 1. Made on 10 November 2026 by the thread *Make data management film 13 Services with customers*, while Rodrigo was away, from his advice for technical managers of 10 November 01:09 UTC (point 1, and point 2 for the pictures). Each row is a question he would have been asked, and the assumption taken, for his final checklist.

| # | Question | Assumption taken | Where it shows |
|---|---|---|---|
| 1 | Is the opening right: Aravind Eye Hospital, Madurai, 1976? | Yes, as the brief suggested. Checked: 11 beds, Dr Venkataswamy retired at 58, 6 of 11 beds for those who couldn't pay, eye camps, Aurolab from 1992, over 400,000 operations a year with more than half free or subsidised, 1.6% complications at Madurai in 2007 | The opening; the script's *Rigour* |
| 2 | Which numbers for the lenses and the outcomes? | Sources differ on the lens's price ($70 to $2; $8 in 2001), so "a few dollars each", no number. The "half the NHS's complications" claim isn't used: its source gives no comparison | The opening |
| 3 | How to show the harm of cataract blindness? | A farmer who can't work his field, a grandmother who needs a child to lead her, and the child leaving school: a general picture, said as such in the script, not a quote about Aravind | *Sight, for everyone* |
| 4 | Which four services? | As the brief: governed data products; the platform for data partners; analysis that answers a decision; advice and training | *Four services, one page* |
| 5 | Which suppliers? | The owners of payroll, the timetable, the rooms' sensors and HR, and digital services (the machines) | *Four services, one page* |
| 6 | The four customer groups' pains and drivers, in their words? | Written for this film from the module's world: people who decide (two numbers for the same thing / answers they can defend, in time); data partners (weeks waiting for access / build their own products); analysts and readers (which table to trust / find it, trust it, use it); staff and students (who can see their data / used fairly, kept safe) | *Who each is for* |
| 7 | Whose five layers, and how to name the frameworks? | Rodrigo's five; said once as ArchiMate's layers with TOGAF's data called information; *The map before the data* named, not retaught | *Down every layer* |
| 8 | Which service is walked down the layers, and what's on each? | Governed data products: strategy "decide from trusted data"; business the service and its promise (checked by 7 each morning) and owner, builder, reviewer; information rooms, bookings, counts; application the platform, the catalog, the project; technology "where it runs" (no product named) | *Down every layer*; the poster |
| 9 | "If a system serves no one, ask why": which example? | The old warehouse's 17 of 38 reports unopened in a year (numbers.md), asked about, not switched off | *Down every layer* |
| 10 | What happens on 7 June? (new numbers) | Of the 45 requests put in order (numbers.md), 42 land on a service: 15 products, 8 platform, 12 analysis, 7 advice; Graham's on analysis. 3 land on none: 2 for a new booking system go to digital services with a note; 1, help with a staff survey, joins advice and training. Add to numbers.md if other films use them | *Every request lands somewhere* |
| 11 | Data management has no mark yet: what goes on the title and end cards? | This film draws its own in its source (five layers drawing themselves); the module's opening film may set one for all | The title and end cards |
| 12 | Which sound? | A nyckelharpa (searched: in no score or palette), its own low strings plucked as partner; nothing from the opening's place (the nyckelharpa is Swedish; the opening is in India) | `tools/score.py`; palettes.md |
| 13 | Where does Graham appear? | Named, not drawn, in this film (his pain in *Who each is for*, his request on analysis); the film's people are Helena, Noor and the opening's three | The film |
| 14 | Its order: does it wait for films 1 to 12? | No: series order is within *Architecture that keeps up*, and it is its series' opening film. It waits only for PR #148 (the kit and draft label) and PR #205 (the series' setup) | The merge |
| 15 | The audio release | MP3 tracked beside `audio.json` (tag audio-services-with-customers-5ca789929fbd3093d9ad); the *Store audio outside Git* workflow publishes the release when the film reaches main (#243), so nothing is left for Rodrigo here | `audio.json` |

## The author's answer, 12 November 2026

The expert review asked about row 7: is it right for experts to present the five layers as ArchiMate's, with TOGAF's data called information? The architecture films' thread had found that ArchiMate has no information layer. Rodrigo answered in the project chat on 12 November 2026: DAMA names it data, so either word is fine at the enterprise level; the difference is already explained in a film, so "maybe just showing a note?"; and he wasn't sure what keeps the frameworks most consistent.

So the five layers stay, and row 7's wording is replaced. What changed, and what was assumed in changing it:

| # | Question | Assumption taken | Where it shows |
|---|---|---|---|
| 16 | How does the film name the frameworks now, so that none is misquoted? | "Four are ArchiMate's layers; information is what TOGAF calls data." Then: "At the level of the whole university, either word is fine; Between the business and the systems tells why." ArchiMate has strategy, business, application and technology, and no information layer: it keeps a business object in its business layer and a data object in its application layer | *Down every layer* |
| 17 | A note on screen only, as you suggested, or the voice too? | Both. The old line said out loud that the five were ArchiMate's layers, and a note can't correct a spoken line. So two lines were voiced again and the film has a new soundtrack (7:18.2, 918 words). On screen the information layer lights up under the note "TOGAF and DAMA call it data", then "More in Between the business and the systems" | *Down every layer*; `audio.json` |
| 18 | Which film is the one that already explains the difference? | *Between the business and the systems*, the opening film of *Data architecture*, on main since 12 November 2026, which tells data from information. The line no longer points to *The map before the data*, which draws the layers but doesn't explain the two words | *Down every layer* |
| 19 | DAMA is your reason. Is it said in the voice? | On screen only ("TOGAF and DAMA call it data"); the voice names TOGAF alone, to keep the line short. DAMA-DMBOK2 is added to the series' references | *Down every layer*; the series' `proposal.md` |
