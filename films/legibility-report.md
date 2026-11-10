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
The table isn't kept in this file, so films that merge at once don't clash on it. Each film's row is `legibility` in its `release.json`: `python site-tools/build_series.py --legibility` prints this report with its table, and every publish of the site shows it in its run's summary.
<!-- /films -->

## What's left

Nothing: every film reads on a phone. Every rework changes the picture, so a reworked film's videos are rendered again by the release workflow.
