# How the films read on a phone

*A report of 7 October 2026, from `site-tools/legibility.py`. A phone held sideways, full screen, shows the 1920-pixel frame about 850 pixels wide, so text smaller than about 28 px in the frame is too small to read there. The rule, and how to meet it, is in the [playbook](../PLAYBOOK.md) (§4, "Make it read on a phone"). Run the tool again after reworking a film.*

## What's already done for every film

The player now draws captions larger as it shrinks: on a phone held upright they stay about 15 px on screen, where they used to be 8 px (`films/inner-life-of-data/source/src/engine3.js`, `drawCaption`). Every film's player on the site was rebuilt with it. Nothing else in the picture changed, and the videos are unaffected: their captions ship beside them as `.srt` files, which phones already size for the screen.

## Where each film stands

"Texts" counts the different pieces of on-screen text; "under 28 px" is the share too small to read on a phone; "median" is the typical size, in pixels of the 1920-wide frame.

| Film | Texts | Under 28 px | Under 20 px | Median | Rework |
|---|---|---|---|---|---|
| Day one | 309 | 0% | 0 | 30 | Done |
| Who it serves, and how it pays | 255 | 0% | 0 | 32 | Done |
| What's in a word | 316 | 76% | 93 | 22 | Light |
| Both at once | 375 | 82% | 88 | 23 | Light |
| Built to write, built to read | 491 | 82% | 72 | 22 | Light |
| Older than the systems | 439 | 86% | 89 | 22 | Light |
| Many ways to read | 413 | 92% | 130 | 21 | Light |
| That's not quite right | 181 | 85% | 34 | 20 | Light |
| Silent change | 485 | 88% | 213 | 21 | Medium |
| Too good to be true | 423 | 85% | 228 | 19 | Medium |
| A Sharper Sketch | 355 | 89% | 209 | 18 | Medium |
| Data for Films | 597 | 87% | 287 | 20 | Medium |
| Meaning machines can read | 577 | 90% | 355 | 17 | Heavy |
| Keeping it true | 656 | 90% | 377 | 19 | Heavy |
| The Inner Life of Data (English and Spanish) | 576 | 93% | 422 | 17 | Heavy |
| Declare it, then build it | 441 | 90% | 229 | 20 | Heavy |
| Start from a question | 485 | 93% | 297 | 18 | Heavy |
| What makes it the same one | 573 | 94% | 271 | 20 | Heavy |
| One row of what, and when | 684 | 95% | 535 | 18 | Heavy |
| Promises and proofs | 649 | 96% | 404 | 19 | Heavy |
| Built in layers | 592 | 98% | 429 | 18 | Heavy |
| Who owns what | 483 | 98% | 301 | 19 | Heavy |
| An agent on the team | 633 | 99% | 469 | 19 | Heavy |
| Written once | 701 | 97% | 570 | 18 | Heavy |
| End to end | 1052 | 98% | 825 | 18 | Heavy |

## What the rework means

- **Light** (median about 21 to 23 px, few very small labels): raise the sizes in the shared components and the scenes, shorten a few labels, and mark texture as decoration. Mostly mechanical, then a review of stills.
- **Medium** (dashboards, sketches and diagrams with small labels): as above, plus the camera moving in on the part of a picture the narration is about, as *Who it serves, and how it pays* does with its canvases.
- **Heavy** (code, YAML, lineage graphs, many small cards): code can't simply be made larger and still fit, so these need fewer lines on screen at once, the camera on the lines that matter, and the rest marked as texture. *In the weeds of data crafting* is the most work, because every film shows real code.

Every rework is a change to the picture, so each film needs its stills reviewed again and a new render, and its labs and scenarios, which draw with the same components, need checking too.
