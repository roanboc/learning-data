# Only what you may see

*Proposal for the second series of the module Data protection and privacy: eight films on protecting data by what it is. The module's plan, [`../locks-before-the-data/proposal.md`](../locks-before-the-data/proposal.md), holds the brief, the reference, the insights, the advice, the world, the people, the look and the sound the three series share; this file holds what is this series' own. Status: set up on assumptions; the films are being made, one at a time, in order.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 3 November 2026 | Decided by the author: the series presents data classification, the ways to mask a value, and how they're built with Databricks' attribute-based access control, with tags carried downstream through lineage. |
| 5 November 2026 | *Only what you may see* (*Solo lo que puedes ver*), the module's second series, is eight films: *An agreement first*, *Know what you hold* and *Show the least* on the ideas; *Grants by design*, *Tags that travel*, *One policy for many tables*, *Copies that keep the rules* and *Proof it held* in Databricks and dbt; in `films/only-what-you-may-see/`, at `only-what-you-may-see/` on the site; its cards say "Film N of 8". *Locks before the data* comes before it; *Kept for a reason* follows. Its thread: Anil Kurian's request for learners' records for a Faculty of Health study, from a signed agreement to a proof that the protection held. Mei Tanaka guides it. |
| 5 November 2026 | Assumed: *Governed in Unity Catalog* stays as made, the overview; this series names it in a line and goes deeper on each mechanism, never re-showing its scenes. The classes are those of *Who may see it* (direct identifier, indirect identifier, special category, none), with a level for each table (public, internal, confidential, restricted). |
<!-- /decided -->

## The brief

The author, 28 October 2026: "another series for actual data protection (data agreements and contracts, RLS, CLS, unity catalog access management, abac, masking)". And on 3 November: "for data protection it's important to present the data classification, masking options, and implementations using Databricks abac with downstream tagging propagation", and "contributors are expected to have confidentiality agreements and other documents signed off with responsibility of the data they access as part of the governance".

So the series starts from paper and meaning (an agreement, a class, a choice of mask), then builds each in the tools: grants designed once, tags that travel with the data, one policy per class, copies that keep the rules, and a proof.

## The films

| # | Folder | Film (working title) | What it shows | The idea to take away |
|---|---|---|---|---|
| 1 | `1-an-agreement-first` | An agreement first | Each contributor's confidentiality agreement and responsibility for the data, signed once and renewed; and for each use a data sharing agreement and its contract: purpose, classes allowed, retention, end date, the owner's sign-off. The agreement becomes the grant | Access is the end of an agreement, not the start. |
| 2 | `2-know-what-you-hold` | Know what you hold | A level for each table (public, internal, confidential, restricted) and a class for each column (direct identifier, indirect identifier, special category, none), set once at the source by its owner; the class follows the data to everything made from it | You can't protect what you haven't named. |
| 3 | `3-show-the-least` | Show the least | The ways to hide a value (below): what each hides, whether it can be undone, what analysis still works | Show the least that still answers the question. |
| 4 | `4-grants-by-design` | Grants by design | Unity Catalog's privilege model: catalog, schema and table; ownership by groups; inheritance; workspace bindings; grants kept as code in the repository | Design the grants once, by area and role. |
| 5 | `5-tags-that-travel` | Tags that travel | Governed tags with set values; data classification proposing tags and the owner confirming them; classes written in dbt and set as tags; tags carried downstream through lineage, and what happens when two sources disagree | Tag once at the source; the tag follows the data. |
| 6 | `6-one-policy-for-many-tables` | One policy for many tables | Attribute-based access control: row filter and column mask policies set on a catalog or schema, matched by tag; a mask function for each way to hide a value; who is exempt; the compute it needs; policies kept as code | The policy follows the tag, so new tables are protected the day they appear. |
| 7 | `7-copies-that-keep-the-rules` | Copies that keep the rules | Development and test with masked or made-up data; sharing outside the university with the same rules; clean rooms; downloads and exports that would skip the rules, closed | Every copy keeps the protection, or isn't made. |
| 8 | `8-proof-it-held` | Proof it held | Access reviews, reads in the audit log, lineage of where protected columns went, a check that every personal column has a class and a policy, and access ending on its date | Protection you can't prove is protection you hope for. |

**The ways to hide a value** (*Show the least* teaches them; *One policy for many tables* builds them):

| Way | What the reader sees | Can it be undone? | What analysis still works | Fits when |
|---|---|---|---|---|
| Leave the column out | Nothing | No | None on it | Nobody needs it |
| Mask it whole | Stars, or nothing | No | Counts of rows | The value is never needed |
| Mask it in part | The last four digits; the first letter of an email | No | Recognising a record by eye | Support desks |
| Generalise | An age band, a year, a region | No | Trends by group | Reports and research |
| Keyed hash | A stable code | Only with the key | Joins and counts per person | Linking tables without names |
| Token | A token | Yes, by the vault's owner | Joins; the real value on request | Finding the person again for a lawful reason |
| Encryption | Unreadable text | Yes, with the key | None until decrypted | Storing or moving it safely |
| Totals, small counts hidden | Totals; cells under 10 hidden | No | Totals | Publishing figures |
| Filter rows | Only your rows | Not needed | Everything, on your rows | Each faculty sees its own learners |

## Builds on

*Who may see it* (classes, purpose, end dates, reviews) and *Governed in Unity Catalog* (the overview of grants, tags, policies, masks and audit), named in a line and never taught again; *Who owns what* (domains and access in dbt); *The marketplace* (requests with a purpose and an end date); *Locks before the data* (groups and identities).
