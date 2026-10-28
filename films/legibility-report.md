# How the films read on a phone

*A report of 13 October 2026, from `site-tools/legibility.py`. A phone held sideways, full screen, shows the 1920-pixel frame about 850 pixels wide, so text smaller than about 28 px in the frame is too small to read there. The rule, and how to meet it, is in the [playbook](../PLAYBOOK.md) (§4, "Make it read on a phone"). Run the tool again after reworking a film.*

## What's done

- **Captions grow as the player shrinks.** On a phone held upright they stay about 15 px on screen, where they used to be 8 px (`films/inner-life-of-data/source/src/engine3.js`, `drawCaption`). The videos are unaffected: their captions ship beside them as `.srt` files, which phones already size for the screen.
- **Every film made before *The map before the data* was reworked,** *The Inner Life of Data* last, in English and Spanish (measured again on 15 October 2026; before, 91% of its text was under 28 px). *Meaning machines can read*, with its fifth chapter, *One map, many views*, and *What's in a word*, with its two new labels, were measured again on 16 October 2026. A shared layer, `films/from-words-to-data/shared/src/phone.js`, raises every piece of text that isn't decoration to 28 px after the camera's zoom, and each film's scenes were rearranged to make room: cards that take turns, code that shows the lines the narration reads, shorter names, and the camera closer on what's being talked about. Texture (a period page, a picture seen from afar, a card behind another) is marked as decoration and not counted.
- **Each film checks itself.** `tools/legible.py --overlaps` draws the film every half second and lists any text under 28 px, running off the frame or drawn over other words. Every reworked film passes; what it still lists are moments in passing, such as a card flying in, a fade or the camera moving in on part of a diagram.
- **The labs and scenarios keep their sizes.** They're read up close, and size their text for their real width, so the phone layer loads only in the films.

## Where each film stands

"Texts" counts the different pieces of on-screen text; "under 28 px" is the share too small to read on a phone; "median" is the typical size, in pixels of the 1920-wide frame. This report now measures the text as it's drawn, after the phone layer, where the first report measured the size each component asked for.

<!-- films: made by site-tools/build_series.py from each film's release.json -->
| Film | Texts | Under 28 px | Under 20 px | Median | Status |
|---|---|---|---|---|---|
| The Inner Life of Data, English | 262 | 0% | 0 | 28 | Reworked |
| The Inner Life of Data, Spanish | 262 | 0% | 0 | 28 | Reworked |
| A Sharper Sketch | 323 | 0% | 0 | 28 | Reworked |
| Silent change | 334 | 0% | 0 | 28 | Reworked |
| Too good to be true | 246 | 0% | 0 | 28 | Reworked |
| Data for Films | 463 | 0% | 0 | 28 | Reworked |
| That's not quite right | 146 | 0% | 0 | 28 | Reworked |
| What's in a word | 239 | 0% | 0 | 28 | Reworked |
| Older than the systems | 293 | 0% | 0 | 28 | Reworked |
| Built to write, built to read | 426 | 0% | 0 | 28 | Reworked |
| Many ways to read | 251 | 0% | 0 | 28 | Reworked |
| Both at once | 262 | 0% | 0 | 28 | Reworked |
| Meaning machines can read | 415 | 0% | 0 | 28 | Reworked |
| Keeping it true | 475 | 0% | 0 | 28 | Reworked |
| Declare it, then build it | 317 | 0% | 0 | 28 | Reworked |
| Start from a question | 360 | 0% | 0 | 28 | Reworked |
| What makes it the same one | 443 | 0% | 0 | 28 | Reworked |
| One row of what, and when | 459 | 0% | 0 | 28 | Reworked |
| Promises and proofs | 440 | 0% | 0 | 28 | Reworked |
| Built in layers | 498 | 0% | 0 | 28 | Reworked |
| Who owns what | 394 | 0% | 0 | 28 | Reworked |
| An agent on the team | 506 | 0% | 0 | 28 | Reworked |
| Written once | 653 | 0% | 0 | 28 | Reworked |
| End to end | 900 | 0% | 0 | 28 | Reworked |
| Day one | 213 | 0% | 0 | 30.3 | Drawn to the rule |
| Who it serves, and how it pays | 197 | 0% | 0 | 31.6 | Drawn to the rule |
| Why it moves | 158 | 0% | 0 | 30.1 | Drawn to the rule |
| What it must be able to do | 201 | 0% | 0 | 30 | Drawn to the rule |
| How value reaches people | 207 | 0% | 0 | 30 | Drawn to the rule |
| Who does it, and where meaning changes | 191 | 0% | 0 | 30 | Drawn to the rule |
| Today, and where it's going | 175 | 0% | 0 | 28.5 | Drawn to the rule |
| Now the questions appear | 242 | 0% | 0 | 28.7 | Drawn to the rule |
| Rules with a home | 386 | 0% | 0 | 29.8 | Drawn to the rule |
| When strategy moves | 423 | 0% | 0 | 28.4 | Drawn to the rule |
| A map people and agents can read | 617 | 0% | 0 | 28 | Drawn to the rule |
| One person, many roles | 314 | 0% | 0 | 30 | Drawn to the rule |
| Who is it? | 299 | 0% | 0 | 28.5 | Drawn to the rule |
| Which value wins | 303 | 0% | 0 | 28.5 | Drawn to the rule |
| Roles come and go | 326 | 0% | 0 | 28 | Drawn to the rule |
| Lists everyone uses | 285 | 0% | 0 | 28.5 | Drawn to the rule |
| For this purpose only | 256 | 0% | 0 | 28 | Drawn to the rule |
| One person, many systems | 193 | 0% | 0 | 29.1 | Drawn to the rule |
| A hub at work | 239 | 0% | 0 | 30 | Drawn to the rule |
| Kept, not cleaned | 287 | 0% | 0 | 30 | Drawn to the rule |
| The same problem, everywhere | 237 | 0% | 0 | 32.5 | Drawn to the rule |
| Off the shelf | 317 | 0% | 0 | 34.0 | Drawn to the rule |
| Who decides | 346 | 0% | 0 | 32.7 | Drawn to the rule |
| One word, one home | 333 | 0% | 0 | 30.0 | Drawn to the rule |
| Who may see it | 349 | 0% | 0 | 30.3 | Drawn to the rule |
<!-- /films -->

## What's left

Nothing: every film reads on a phone. Every rework changes the picture, so a reworked film's videos are rendered again by the release workflow.
