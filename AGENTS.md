# AGENTS.md

Guidance for any AI agent (Claude, Codex, Copilot, Gemini or others) working in this repository. [`PLAYBOOK.md`](PLAYBOOK.md) holds the detailed lessons behind the films; this file is the order to work in and the rules that always apply. The README's *What's here* explains the layout.

## The process for every new film, series or topic change

Go through the stages in order. The concept is settled before anything is drawn.

### 1. Conceptual foundation (always first)

1. **Ask for the reference framework.** Before drafting, ask the author which framework, standard or body of knowledge is the reference for the topic. Then suggest the others worth considering, with one line each on what they add (for data modelling: Kimball, Inmon, Data Vault, entity-centric; for enterprise architecture: TOGAF, Zachman, ArchiMate, BIZBOK, domain-driven design, DAMA-DMBOK). Say which one the films follow and why, and record where they adopt, extend or differ from it.
2. **Ground it in practice.** Ask the author for their real experience: what works, what goes wrong, what they would tell a newcomer. Check that every concept and process is something practitioners actually do, not only what a framework prescribes. Write that advice into the proposal's brief.
3. **Keep the essential.** Frameworks are inputs, not the syllabus. As *From words to data* did with modelling techniques and *The map before the data* with EA frameworks, name the bodies of knowledge once, then teach the insights they share. Cut what a newcomer doesn't need for the decision the film is about.
4. **Tools show, they don't lead.** Databricks and dbt are the main tools to demonstrate the ideas (dbt writes and tests the recipes; Databricks runs, stores and governs). Choose the concept first, then show it in the tools. A topic never exists because a product feature does.
5. **Write it down and confirm.** A `proposal.md` with the brief in the author's words, the reference and its alternatives, an insights table with where each comes from, the practical advice, the thread to follow, and a *Decided* table with dates. The author confirms it before any script is written.

*Ask: would an expert in each framework agree, and would a practitioner recognise it from real work?*

### 2. Story and world

Follow PLAYBOOK §1, §2, §8 and §9: the two-audience promise, one thing followed from where it's born to a human outcome, a metaphor tested against the hardest mechanism, openings varied across cultures and eras, people on every side of the problem, blameless and believable numbers, wrong drafts corrected by the people who know, and a rigour sheet for every scene.

**Every opening story has four beats, each said outright in the narration, in this order:**

1. **Scenario:** who, where, when, and what was happening.
2. **Problem:** what went wrong or what people feared, for whom, and why it mattered to them, as a harm a viewer can picture. Explain every word the story leans on (if a law lets town halls "check up on" residents: check what, and what could happen to them?), and say that something had to change.
3. **Solution:** what was done, and by whom.
4. **Benefits:** what got better, and for whom, with a number where the sources give one; then the same problem and benefit in the film's own data story.

The film comes back to the story along the way, and at the end to close on its benefit for data. Test it before the script goes to the author: someone who has never heard of the event can answer, from the narration alone, "why was that a problem?" and "what did the fix give people?". Each script has an *Opening story* table, a row for each beat and one for where the film comes back to the story, quoting the line that says it; `site-tools/check_site.py` fails a film whose table misses a row or quotes words its narration doesn't say. Films made before 28 October 2026 add theirs when their opening changes.

### 3. Video craft, at the highest effort

Run film and visual style work at the highest reasoning or effort setting your tool offers. Draft style frames, compare options, review full-size stills, and iterate until the result is the best you can make, not the first that passes. Apply PLAYBOOK §4 to §6 and its checklists, in particular:

- **Look:** one design language per series; colour carries meaning; living things drawn with tapering curves, weight and light; people dressed for their time; reusable components, not one-off drawings.
- **Phone legibility:** text at least 28 px in the 1920 px frame after zoom, or marked as decoration on purpose; lay out from the drawn size; take turns when room runs out; nothing in the caption band (below y ≈ 890).
- **Motion:** spring and settle, a slow camera (at least about 1.4 s, sine ease), things carried across cuts, motion blur, no film grain.
- **Narration and pace:** one idea per line; 120 to 135 words a minute (at most 140 in a chapter); voice at most 82% of any chapter; about 0.8 s after each sentence.
- **Sound:** a new palette for each film; sustained chords that follow the chapters; every effect tied to something on screen; effects soft and below about 2.5 kHz; an urgent pulse only where the story turns to an error or a rush; mix to -16 LUFS.
- **Known faults:** long labels spilling out of small boxes, a pointing person whose hand leaves the frame near the right edge (mirror them), labels under the captions.

### 4. Check, publish, learn

1. Per film, from its `source/`: `tools/build.py`, `tools/check.py` (every moment draws), `tools/legible.py --overlaps`, `tools/pace.py`, full-size stills (`tools/stills.py --size 1920`), then `tools/publish.py`. Then `site-tools/build_series.py`, and `.github/scripts/affected.py --run`: it runs `site-tools/check_site.py`, and `site-tools/smoke.py` only on the pages the change touched, never the whole site again. `dist/` is gitignored and can hold a stale soundtrack.
2. Spanish captions, pages, Pause and think questions, labs and scenarios match the film's names, numbers and colours.
3. **Share the video for review.** Whenever a new or changed video is made, render it and share it with the author on a review page, with the pull request link. `python site-tools/review_page.py <film folder> --pr <number> --note "<what changed>"` makes the page from the film's own files: a 720p copy under 15 MB (made by `site-tools/review_copy.py`), a button for each chapter, and the captions in each language. Publish it as a private artifact, one page per film (a new version goes to the same link), and share the link in the conversation. Don't attach video files: the chat may only offer them as a download, and a full render can't be downloaded from it. The author watches it and either asks for corrections or approves the pull request. Never call a film done before that.
4. Turn every review finding into a check, and write new lessons into `PLAYBOOK.md`.

## Rules that always apply

- **Look before you start.** Check open pull requests and unmerged branches for the same film or series, so nothing is made twice or overwritten.
- **Stay in the film's lane.** A series' shared source (such as `shared/src/*.js`) is bundled by every film in it; never change it for one film. Put the helper in that film's own source.
- **Each film keeps its own rows.** A film's entry in the release, its *Decided* rows, its legibility row and its *past* row live in its own folder (`release.json`, `decided.md`, `site.json`); a series finds its films by their numbered folders. The shared lists are made from them (README, *Each film keeps its own rows*), so threads never edit the same lines. On a clash in a generated list or page, run `site-tools/build_series.py` again.
- **Generated files are generated.** Pages made by `site-tools/build_series.py`, the *Decided* tables in `proposal.md` and the legibility report's table are never edited by hand, and `check_site.py` fails if they differ. Don't rename numbered film folders or `assets/film3/`: the release workflow and links use them.
- **Keep cited lines in place.** Rigour sheets cite files by line number (for example in the dbt project), so append or replace in place rather than shifting lines.
- **Definitions come from the glossary.** In the example dbt project, a term the business glossary holds is copied from it, with its `source:` (decision DEC-PRJ-11).
- **Spanish is captions and pages only.** Films are made in English. Spanish comes as captions and as the site's pages (page text, Pause and think, labs and scenarios); the video's visuals, on-screen words and voice are not translated. Keep each Spanish caption about as long as the English line.
- **A fictional world.** Organisations, people and numbers are invented composites. Never name a real company as the subject, or the author's private repositories used as reference.
- **Rights and respect.** Only original art; official logos unaltered and credited in `NOTICE.md`; code under MIT and content under CC BY 4.0. No visual styles or sounds borrowed from other cultures; check a story from another culture against its own sources, and label imagined futures as imagined.
- **Sources and names on the day.** List sources with the date checked. Check product names and maturity when publishing, and say "preview" when something is.
- **Write decisions down.** Every decision goes in the series' *Decided* table with its date, so the next session starts from it.
- **Heavy jobs.** Run one render at a time, in resumable chunks. A render to share for review is part of making a film; the release workflow (`release.yml`) runs only when the author starts it.
- **For every viewer.** Every interaction works by keyboard, every picture has a line of text saying what happened, pages work in dark mode and on a phone, and progress stays in the visitor's browser.
- **Plain words.** Short sentences in plain English, on the site and in docs. Internal names never appear as text on the site.
