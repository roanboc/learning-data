# What remains

*Proposal for a closing film of the series From words to data, v0.1. In Spanish: Lo que permanece. Status: proposed on 29 September 2026, for the author's decisions below. The [series proposal](proposal.md) is the plan the other seven films were made from.*

## The brief

From the author (29 September 2026): a final film on the future of data. What remains and what changes? Anchor, Hook, Puppini bridges and other models have been proposed; what is important in the end, and what do we need to understand? The author's view: the conceptual models are the key thing. Explore and propose.

## The answer, in one line

**The shapes keep changing; the questions they answer don't.** Every modelling pattern, old or new, is a different way of storing the same four answers: what one thing is, how things relate, what changed and when, and what it means. Those four answers are the conceptual model, with its grain. They are what remains.

## Analysis

**The author is right, with one sharpening.** "The conceptual model is the key thing" is true, but on its own a newcomer hears "draw boxes, skip the rest", and an engineer disagrees. What lasts is the conceptual model *and the four decisions that tie it to data*:

| What remains | The question | Where the series taught it |
|---|---|---|
| **Meaning** | What is a credential, and what isn't? Who owns the word? | *What's in a word*, *Older than the systems* |
| **Identity** | What makes one credential one credential, in every system? (the business key) | *Older than the systems* |
| **Grain** | What is one row? One award, one learner, one day? | *A Sharper Sketch*, *Built to write, built to read* |
| **Time** | When was it true, and when did we know? (issued, then revoked) | *Built to write, built to read*, *Keeping it true* |

Everything else, the physical shape, is chosen for an engine, a budget and a job, and it changes when they change.

**The evidence: look at the new patterns side by side.** Each one is a new answer to *how to store* those four things. None changes *what* they are.

| Pattern | Year | What it keeps well | What it gives up | What it's built on |
|---|---|---|---|---|
| Normalised core (Inmon) | 1992 | One integrated truth | Easy reading | Business entities and keys |
| Star schema (Kimball) | 1996 | Easy, fast reading | Change is costly | The grain, declared first |
| Data Vault (Linstedt) | 2000, 2.0 in 2015 | New sources, audit, history | Readability | Hubs: business keys |
| Anchor Modeling (Rönnbäck and others) | 2009 | Change without altering tables (sixth normal form) | Many tables, many joins | Anchors: identities |
| Unified Star Schema, with the Puppini bridge (Puppini and Inmon) | 2020 | One star for every question, no fan or chasm traps | A bridge table no business user reads | The keys of every entity, in one bridge |
| Activity Schema (Elsamadisi) | about 2021 | Behaviour over time, in one table | Everything that isn't "an entity did something" | An entity, an activity, a time |
| Hook (Foad) | about 2023 | Raw data kept as it came, organised late | A shape for reading, still to build | Hooks: business keys aligned to the glossary's concepts |
| One big table | 2010s | Speed on columnar engines | Consistency between tables | The grain of the table |

The last column is the finding. Every pattern stands on identities and business keys, and the newest ones say so out loud: Hook asks for the business glossary before the warehouse; Data Vault's hubs and Anchor's anchors are the concepts' identities; the Puppini bridge is a list of every entity's keys. **The patterns are dialects; the conceptual model is the language.** That line closes the series' arc from words to data.

**What changes, honestly:**

- **Engines and economics.** Storage became cheap, columnar engines made wide tables fast, the lakehouse put many shapes side by side (*Many ways to read*), hybrid databases removed a copy (*Both at once*). Each shift made a different shape fashionable. More shifts will come.
- **Who draws the physical shapes.** Automation tools already generate vaults and stars from metadata; AI agents now draft logical and physical models from a conceptual one in seconds (*Keeping it true*). Shapes get cheap to make, and cheap to change.
- **Who reads the meaning.** Semantic layers and ontologies make meaning machine-readable (*Meaning machines can read*). The Open Semantic Interchange specification, v1.0 in January 2026 and now incubating at Apache as Ossie, is a first open format for sharing those definitions between tools.
- **Similarity is not identity.** Embeddings and vector search find credentials that *look alike*; only a model says whether two records are *the same* credential. AI makes that distinction more important, not less.

**What an expert will say, and the answer the film gives:**

- *"Physical design still matters: cost, speed, concurrency."* Yes. It is chosen per engine and changes with it; the film says so, and shows it being re-chosen, not ignored.
- *"A conceptual model nobody links to the data is shelfware."* Yes: that is *Keeping it true*. The film's point is the model plus identity, grain and time, linked to the data and versioned.
- *"You're dismissing these patterns."* No. Each gets its fair line: what it keeps well and what it gives up, as in *Many ways to read*. Choose per job, not per fashion.

**What to leave out.** No ranking of patterns, no prediction of products, no dates for the future. Graph databases, event sourcing and data mesh stay parked, as in the series proposal; each can get one label in the timeline at most.

## The film

**Working title.** *What remains*. In Spanish, *Lo que permanece*.

**Logline.** A new modelling pattern every few years: anchors, hooks, bridges, activity streams. Look at them side by side and the same four answers sit inside each one. The shapes will keep changing. The meaning is what we keep.

**The question.** "Ten years from now, how will we model a credential?" The idea that lands: *we can't know the shape; we can know the meaning, and that is the part to get right.*

**It opens in the past, like every film.** Recommended: **Mercator's map, 1569.** No flat map can show the round Earth without distorting it. Mercator kept angles true for sailors and let areas swell; Greenland looks as big as Africa. Other projections keep areas and bend shapes. People have argued about maps for centuries, and the globe hasn't changed. *Still true today: many projections, one world. Every shape keeps something and gives something up.*

**Chapters.** About 5 minutes, eight chapters, at the series' pace.

| Chapter | What happens | What it teaches |
|---|---|---|
| Many maps, one world | Mercator's map, 1569, beside an equal-area map and a globe. Greenland and Africa, side by side. "Every map keeps something true, and gives something up." | A projection is a choice for a job, not the world. |
| A new shape every few years | Noor's desk, a timeline of patterns: normalised core, star, vault, anchor, bridge, activity stream, hook, one wide table. The credential drawn in each, in the series' components. The arguments, on sticky notes. | Many patterns, each with a purpose. |
| What each one keeps | Each pattern lights what it keeps well and dims what it gives up, like the projections: vault and anchor keep change and history, the star keeps reading easy, the bridge keeps questions safe from double counting, the activity stream keeps time, the hook keeps the raw data and lets meaning arrive later. | Choose per job, not per fashion. |
| The same four answers | An X-ray pass across all of them: the same highlights appear in each. The credential's key; its links to learner and issuer; issued and revoked, with dates; the definition from *What's in a word*. The sketch, v3, sits behind every one. | The patterns are dialects; the conceptual model is the language. |
| What changes | The engines shift; the agent from *Keeping it true* drafts a vault, a star and a wide table from sketch v3 in seconds. A vector search says two credentials look alike; the model says whether they are the same one. | Shapes are getting cheap. Meaning, identity and judgement aren't. |
| What remains | Four cards settle on the table: meaning, identity, grain, time. Each with its owner and version. | The skills that last: name and define things; say what makes one thing one; declare the grain; keep time. |
| Ten years on | "How many credentials did we award?" asked once more, in a system nobody has built yet, drawn as an outline. The answer comes from the same definition, with the same owner, at version five. | The question outlives every system that answers it. |
| Pull back | The series in one sweep: the clay mark, the word, the triangle, the shapes, the layers, the chain. Back to the globe. "Agree what things are, write it down, and keep it true." | The series' tagline, earned. |

**The thread: the credential.** *It is modelled eight ways, and it is the same credential in each.* This row joins the series README's table.

**Labs.**

1. *Which projection?* Six needs (an auditor, a planner, a data scientist, a new source every month, an AI agent, a dashboard); pick the shape that keeps what each needs, and say what it gives up.
2. *Find the credential.* The same credential in four patterns; click its identity, its grain and its dates in each.
3. *In ten years?* Sort statements into "will still be true" and "will probably change": "a credential is revoked on a date"; "awards are stored in a star"; "Mei owns the word *award*"; "we use sixth normal form"…

**Scenarios.** Eight short cases in the series' form, for example: a vendor pitches a new pattern (what four questions to ask of it); an agent proposes merging two "duplicate" credentials that are only similar; a migration to a new engine (what carries over unchanged).

**Sound.** The series' motif at the title and the end, in a new key and on a new instrument, as every film has. Proposed: a solo cello and a music box. The cello for the long line of meaning, the music box for the shapes that turn and change; at the end, all seven films' instruments state the motif once each, briefly, then the cello alone.

**Posters and look.** The past as warm parchment (Mercator's map, with its cartouches); the present as glass. The patterns drawn with the components the series already has (vault from *Many ways to read*, star from *Built to write, built to read*, chain from *Keeping it true*), plus three new ones: anchor, hook and bridge. The future drawn as a dashed outline, never as a product.

## What changes in the series

- The series becomes eight films; the README, `series.json` and the site's cards say so. *Keeping it true* stops being the last; its ending, "the tools changed; the job didn't", becomes the step into this film.
- The rows for this film join the README's tables: the thread, "Every film starts in the past" (*Mercator's map, 1569 · Many projections, one world*), and the sounds.
- The concept table gains "Newer patterns: Anchor, Unified Star Schema, Activity Schema, Hook" and "What stays: meaning, identity, grain, time".

## Rigour to check when scripting

- Mercator's projection (1569) preserves angles, not areas; the Gall–Peters debate of the 1970s and 1980s; equal-area projections. Greenland is about 2.2 million km², Africa about 30 million.
- Regardt, Rönnbäck and others, "Anchor Modeling", ER 2009 (best paper): anchors, attributes, ties and knots, sixth normal form, non-destructive change.
- Inmon and Puppini, *The Unified Star Schema* (Technics Publications, 2020): the Puppini bridge, and the fan and chasm traps it avoids.
- The Activity Schema specification (v2.0, on GitHub), from Ahmed Elsamadisi and Narrator: one activity stream per entity.
- Andrew Foad's Hook (articles from about 2023, and the Hook Cookbook): hooks, bags, business concepts from the glossary. Check the first publication date.
- Data Vault's origin (Linstedt, about 2000) and 2.0 (Linstedt and Olschimke, 2015); ensemble modelling as the family name.
- The Open Semantic Interchange: v1.0 on 27 January 2026; entered the Apache Incubator as Apache Ossie on 10 July 2026. Check the name and status on the day.
- Vector similarity versus identity: embeddings measure closeness, not sameness; entity resolution still needs keys and rules.
- Keep product names to labels and the rigour sheet, as the series does (PLAYBOOK §3).

## Decisions for the author

1. **Title.** *What remains* (recommended), *Many maps, one world*, or *The part that lasts*.
2. **The opening.** Mercator's map, 1569 (recommended: projections are the exact picture of physical models). Or Mendeleev's table, 1869 (one ordering of the elements, drawn in many layouts, with gaps it predicted before the data came). Or the ship of Theseus (every plank replaced: is it the same ship? The identity question, sharpest of all, but only one of the four).
3. **How many patterns to name.** All eight on the timeline, with four drawn in full (vault, anchor, bridge, hook: recommended), or all eight drawn in full, which adds about a minute.
4. **The future scene.** "Ten years on" as a dashed outline with no date (recommended), or a date on screen, such as 2036.
5. **The labs' third question.** Keep "In ten years?" as a sorting lab (recommended), or make it a Pause and think question only.

## Next checkpoints

1. Decisions 1 and 2.
2. The script, with its rigour sheet started from the list above.
3. Style frames: Mercator's map beside the globe, the pattern timeline, the X-ray pass, the four cards.
4. Build as the other films: narration and voice, pictures and scenes, score, labs and scenarios in English and Spanish, captions, then publish.

## Sources

Checked 29 September 2026.

- Regardt, Rönnbäck and others, [Anchor Modeling](https://link.springer.com/chapter/10.1007/978-3-642-04840-1_19), ER 2009.
- Inmon and Puppini, [The Unified Star Schema](https://technicspub.com/uss/), Technics Publications, 2020.
- [Activity Schema specification](https://github.com/ActivitySchema/ActivitySchema/blob/main/2.0.md), v2.0.
- Andrew Foad, [Introducing HOOK](https://www.linkedin.com/pulse/introducing-hook-data-warehousing-made-easy-andrew-foad-1c), and the [Hook Cookbook](https://hookcookbook.substack.com/p/chapter-2-hook-overview).
- [Open Semantic Interchange updates](https://open-semantic-interchange.org/updates/), and [Apache Ossie](https://ossie.apache.org/updates/osi-april-2026-community-update/).
