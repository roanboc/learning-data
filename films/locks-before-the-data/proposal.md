# Locks before the data

*Proposal for the first series of the module Data protection and privacy (Protección de datos y privacidad), and the plan for the whole module: three series, twenty-two films, on keeping the university's data safe, from who may reach the platform, to what each person may see, to how long data is kept and how a person is forgotten. Planned with the author from 28 October to 5 November 2026, and set up on 5 November on assumptions he asked for and will review. This file holds what the three series share: the brief, the reference, the insights, the advice, the world, the people, the look and the sound. Each of the other two keeps its own part in its folder: [`../only-what-you-may-see/`](../only-what-you-may-see/) and [`../kept-for-a-reason/`](../kept-for-a-reason/). Status: set up on assumptions; the films are being made, one at a time, in order.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 28 October 2026 | The author asked for a module on protecting data, in series on platform security, data protection and agentic security, focused on Databricks and GitHub and linked to the roles, functions and boundaries the architecture and governance series define. Every protection starts from a role, a boundary or a rule already defined on the architecture map or in the governance registers; nobody invents a group, a tag or a rule inside the platform. |
| 3 November 2026 | Decided by the author: each series starts with films that name no product (no Databricks, Azure, GitHub or dbt), the ideas in the university's own words, then shows how each idea is built, and each tool film says which idea film it builds. |
| 3 November 2026 | Decided by the author: passwordless sign-in is preferred, so no person manages a secret ("similar to workspace identities in Fabric instead of using service accounts"), and the films teach the sign-in methods still in use today, ranked from best to worst: for workloads, a managed identity the platform gives them; workload identity federation; a certificate; a client secret in a vault, rotated automatically; a service principal's personal token; and, worst, a person's token or a shared account's password in a job. For people: passkeys or a security key through single sign-on; single sign-on with an authenticator app; codes by text message; a password alone; a shared account. |
| 3 November 2026 | Decided by the author: direct access to storage is covered, because no mask or policy applies there. Data specialists, who have great power over data, each have a second, personal admin account for delicate work, raised only when needed, for a task, with a reason, and logged; business users and analysts never get one. Every contributor signs a confidentiality agreement and accepts responsibility for the data they access, as part of governance, before any access is given; an agent's owner signs for it. |
| 5 November 2026 | Decided by the author: the module's films use a digital security look of their own, unlike the agent films: *Night glass*, frosted glass with solid colour. A dark hall of frosted panes (frosted where it may not be read, clear where it may); badges, cards, chips and labels in full, clear colour (a gold chip; solid bands, pills and ticks with dark words on them); every word at least 4.5 to 1 against what is behind it. Cyan is an identity, green allowed, coral denied or closed, amber power switched on, violet hidden personal data. People keep the agent films' geometry, lit at night with a cool rim; the agent keeps its sphere, its band in the identity colour. |
| 5 November 2026 | Decided by the author on the review of missing series: the module becomes *Data protection and privacy* (*Protección de datos y privacidad*), with privacy and the data lifecycle (purpose, consent, retention, deletion, archiving) as a series of its own. |
| 5 November 2026 | Set up on assumptions, as the author asked on 5 November 2026, 11:53 UTC ("Work on the films with assumptions and merge them all. Give me a final checklist with the questions you had for each topic and the assumption and I will later review the entire report and will fix when I see the assumption was incorrect"): the plan's open questions are answered with the assumptions below, each listed for his review, and changed when he says. The films are made as the agent films are: no script review, one thread per film at the highest effort, no render and no review page, and each film merged once its checks pass, one at a time, in the module's order, for the release workflow he starts. |
| 5 November 2026 | Assumed: the module is three series, twenty-two films: *Locks before the data* (*Cerraduras antes que los datos*, `films/locks-before-the-data/`, nine films: four on the ideas, five in the tools), *Only what you may see* (*Solo lo que puedes ver*, `films/only-what-you-may-see/`, eight: three and five) and *Kept for a reason* (*Guardado por una razón*, `films/kept-for-a-reason/`, five: three and two), each at its folder's name on the site with its page once its opening film is out, under the topic *Data protection and privacy*, between *Data governance* and *AI agents in data work*. A series numbers its own films ("Film 2 of 9"). This file holds the module's plan, as *Data that moves* holds *Modern data basics*'. |
| 5 November 2026 | Assumed: the plan's third series, agentic security (*An agent with a badge*), isn't made. The module *AI agents in data work* has since covered it: an agent's own identity and owner, borrowed rights, tools as permissions, how agents go wrong, Unity Catalog and the AI gateway, review and the mandate (*Agents at work on data* and *From helper to colleague*, whose film *An agent with its own badge* also took the title). This module names those films in a line where it builds on them, and keeps what they don't teach: thinking like an attacker (in *Who is it, really?*) and personal data in logs, traces and prompts (in *Deleted means deleted*). |
| 5 November 2026 | Assumed: the reference is DAMA-DMBOK's data security area, for what is protected and why, so the module reads as one with data governance, and zero trust (NIST Special Publication 800-207), for how: identity is the boundary, not the network; every request is checked; the least rights. NIST's Cybersecurity Framework 2.0 is named once, to place the films on one map. For privacy, privacy by design and the principles shared by Europe's GDPR, ISO/IEC 27701 and most privacy laws (a lawful purpose, as little as needed, kept no longer than needed, people's rights over their data); the films teach the principles, never one country's law. Databricks' Security Reference Architecture and AI Security Framework, and GitHub's own security guides, are sources, cited, not taught. |
| 5 November 2026 | Assumed: *Governed in Unity Catalog* (*Governance you can use*) stays as made, the one-film overview. *Only what you may see* names it in a line and goes deeper on each mechanism, never re-showing its scenes. |
| 5 November 2026 | Assumed: the films show Azure as the university's cloud (Microsoft Entra ID, managed identities, privileged identity management, Key Vault, private endpoints, storage accounts), because the author's team works with Microsoft Fabric and Azure; the ideas films name no cloud. |
| 5 November 2026 | *Locks before the data* (*Cerraduras antes que los datos*), the module's first series, is nine films: *Who is it, really?*, *No secret to lose*, *Walls, doors and keys* and *Power you switch on* on the ideas; *People and groups*, *Workloads without secrets*, *Network, storage and keys*, *From a branch to production* and *Who did what* in Databricks, GitHub and Azure. Its thread: a nightly job that loads the registrar's data runs on Jun Park's personal token, from one workspace open to the internet; film by film Sam Okafor gives it a name of its own and no secret anyone keeps, behind private paths, deployed only through reviewed changes, and watched. *Only what you may see* follows. |
<!-- /decided -->

## The brief

The author, 28 October 2026:

> We might need to start working a Data protection module, a series for platform security (identities, service principals, security groups, private endpoints, secret management, environments, etc); another series for actual data protection (data agreements and contracts, RLS, CLS, unity catalog access management, abac, masking); and another for agentic security (agent identities, tools and permissions, agents running as apps for permissions like in GitHub, etc). The series should focus on Databricks and GitHub security measures. The series should also link to definitions made as per roles, functions, boundaries defined in enterprise architecture and governance.

On 3 November 2026:

> Let's always start each series with agnostic elements (no Databricks, azure, dbt, etc) and then how that's implemented.

> Not sure I saw the preferred use of passwordless authentication, so secrets don't need to be managed by people, similar to workspace identities in Fabric instead of using service accounts. Let's bring the modern security practices and what should be the preferred authentication methods from best to worse (still used today).

> Also, for data protection it's important to present the data classification, masking options, and implementations using Databricks abac with downstream tagging propagation.

> For security, Yes include considerations on storage access where there is no making or policies at all, we usually have special admin accounts (each of the team members) to perform more delicate activities. We didn't mention but contributors are expected to have confidentiality agreements and other documents signed off with responsibility of the data they access as part of the governance. It is worth mentioning the additional permission elevation via admin accounts that would provide those additional risky access. That works for data specialists with a lot of power over data, not for standard business users or analysts.

On 5 November 2026, after the review of missing series, privacy and the data lifecycle joined this module, renamed *Data protection and privacy*; and that evening: "Work on the films with assumptions and merge them all. Give me a final checklist with the questions you had for each topic and the assumption and I will later review the entire report and will fix when I see the assumption was incorrect."

**The module's promise.** Protection that's real is built from things already decided: who each person is, what role they play, which area owns the data, what each column holds. The films show where each lock comes from, how it's built, and how to prove it held.

## The reference, and its alternatives

Assumed on 5 November 2026, for the author's review: DAMA-DMBOK's data security area for what is protected and why, so the module reads as one with data governance; zero trust for how.

| Body of knowledge | What it adds | Here |
|---|---|---|
| DAMA-DMBOK, data security (second edition, revised 2024) | Security as part of data management: classify, protect by class, owners decide access | *Only what you may see*'s spine; the link to data governance |
| Zero trust architecture (NIST Special Publication 800-207) | Identity is the boundary, not the network; every request checked; the least rights | *Locks before the data*'s spine |
| NIST Cybersecurity Framework 2.0 | Govern, identify, protect, detect, respond, recover: one map of a security programme | Named once, in *Who is it, really?* |
| Privacy by design, and the principles of Europe's GDPR, ISO/IEC 27701 and most privacy laws | A lawful purpose, as little as needed, kept no longer than needed, people's rights over their data | *Kept for a reason*'s spine; no country's law taught |
| Threat modelling (STRIDE and its kin) | Asking how a thing could go wrong before it's built | A chapter of *Who is it, really?* |
| Databricks' Security Reference Architecture and AI Security Framework; GitHub's security guides; Microsoft's Azure guides | How each idea is built today | The tool films' sources, cited, not taught |

Where the module differs: it teaches only what a data team does. Network design, endpoint security and the identity provider's own set-up are shown, not taught.

## The insights, and where each comes from

| Insight | Where it comes from | Film |
|---|---|---|
| Every protection starts from something already decided: a role, an area's boundary, a class, a rule | The author; *The map before the data*; data governance | Every film |
| Identity is the boundary, not the network | Zero trust | *Who is it, really?* |
| The best secret is the one nobody holds: managed identities and federation first, then the rest of the ladder | The author's practice | *No secret to lose*; *Workloads without secrets* |
| Storage has no masks or policies: only the catalog reaches it, and an admin account switched on for a task | The author's practice | *Power you switch on*; *Network, storage and keys* |
| Great power over data lives in a second, personal admin account, raised just in time and logged; never for business users or analysts | The author's practice | *Power you switch on*; *People and groups* |
| No access before a signed confidentiality agreement and responsibility for the data | The author's practice; data governance | *Who is it, really?*; *An agreement first* |
| Classify once, at the source; the class travels with the data to everything made from it | The author; DAMA-DMBOK | *Know what you hold*; *Tags that travel* |
| Many ways to hide a value, each keeping a different use | Privacy practice | *Show the least*; *One policy for many tables* |
| One policy matched by a tag protects every table, including the ones made tomorrow | The author; Databricks' attribute-based access control | *One policy for many tables* |
| Every copy keeps the protection, or isn't made | DAMA-DMBOK | *Copies that keep the rules* |
| Data is kept for a reason and a time; then it's archived or deleted, and deleting means the old files too | Privacy by design; records management | *Kept for a reason*'s films |

## Practical advice the films carry

- Give rights to groups that stand for roles, never to people; let the identity provider own the groups.
- Climb the sign-in ladder: a managed identity or federation for every new workload; a secret in a vault only where nothing else works, rotated by a machine.
- Keep power in a second account, switched on for a task, with a reason, then off; alert every time it's switched on.
- Close the back door: no one but the catalog reads the storage.
- Production changes only through a reviewed path, deployed by a workload identity, never by a person's hand.
- Classify at the source, by the owner; let tags carry the class downstream; protect by tag, not table by table.
- Choose the mask that keeps the use you need, and no more.
- Development and test get masked or made-up data, never a copy of production.
- Know why you keep each piece of personal data and until when; delete it on time, including old versions; prove it.

## The thread, the world and the people

The fictional university of the earlier films and its people. Each series follows one thread:

- *Locks before the data*: a nightly job that loads the registrar's data runs on Jun Park's personal token, from one workspace open to the internet. Sam Okafor, who runs the platform, is the guide: film by film the job gets a name of its own and no secret anyone keeps, the workspace goes behind private paths, the specialists' power moves into admin accounts switched on for a task, production changes only through review, and everything is watched.
- *Only what you may see*: Anil Kurian, an analyst in the Faculty of Health, asks for learners' records for a study of how health students progress. Mei Tanaka, who owns the registrar's data, is the guide, with Yusuf Demir (data governance) and Sam: the request becomes a signed agreement; every column gets its class; the class travels to every table made from it; one policy masks it wherever it lands; and a review proves it held.
- *Kept for a reason*: Linh Nguyen's tutoring contract ends on 20 November 2026 (the contract of *Modern data basics*, T-26188), and four days later she asks what the university holds about her, and to be taken off the tutors' mailing list. Ingrid Holm, who owns HR's data, is the guide, with Mei and Jun: what must be kept, for how long and why; what can go; and how deleting it on the platform really deletes it.

Numbers several films share are in the module's shared numbers before a script uses them, and the earlier films' numbers are reused exactly. Every story is blameless; no film shows a person's pay or a real secret. The example dbt project, `films/analytics-engineering/project/`, is where the data story happens: what a film shows in dbt comes from it, and what a film needs that it lacks is added in place, so no cited line moves.

## The look

Decided by the author on 5 November 2026: *Night glass*, frosted glass with solid colour, a digital security look of its own, unlike the agent films'. A dark hall of frosted panes, frosted where it may not be read, clear where it may; cards of near-clear frost with bright rims; a gold chip; solid bands, pills and ticks with dark words on them; every word at least 4.5 to 1 against what is behind it. Colour means the same in every film: cyan an identity, green allowed, coral denied or closed, amber power switched on, violet hidden personal data. People keep the agent films' geometry and one three-quarter head, lit at night with a cool rim; an agent keeps its sphere, its band in the identity colour. The opening film's thread moves the prototype (`dp_glass_vars.js`, path A, in the project's style prototype) into this folder's `shared/`, with a README, and the other two series bundle it as it is.

Every check of 4 and 5 November 2026 holds: every word at least 28 px in the 1920-pixel frame and none under the captions; arms down and a hand only on what the story is about; a camera that glides in one room and cuts only between rooms; people faded whole; a page's work held back until the visitor reaches for the player; the night lighting of people prepared once when the player opens, not every frame.

## The sound

Each film has a palette of its own, made in its `tools/score.py`, with a lead instrument the site doesn't have, chosen by its thread after checking every `score.py` on main and on every branch, and written in the module's palettes list so no two threads take the same. Music plays under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words; nothing trembles, and nothing is held under the voice. Effects are soft, low, one at a time and tied to something on screen. An urgent pulse plays only where a story turns to a breach, a leak or a rush. `quiet.py` checks it all, and the mix is at -16 LUFS.

## The films

| # | Series | Folder | Film (working title) | What it shows | The idea to take away |
|---|---|---|---|---|---|
| 1 | *Locks before the data* | `1-who-is-it-really` | Who is it, really? | Zero trust: identity is the boundary. People, workloads and agents each have an identity; rights come from a role, never directly; joiners, movers and leavers; a signed confidentiality agreement before any access; thinking like an attacker before building | Every request says who it is, and gets the least it needs. |
| 2 | | `2-no-secret-to-lose` | No secret to lose | Passwordless first: the platform vouches for the workload, so no person creates, stores or rotates a secret; the sign-in ladder, best to worst | The best secret is the one nobody holds. |
| 3 | | `3-walls-doors-and-keys` | Walls, doors and keys | Boundaries drawn from the map's areas; who secures what (the cloud, the platform, the university); separate environments; private paths; encryption and who holds the keys; backups an attacker can't delete | Few doors, each with a lock you can see. |
| 4 | | `4-power-you-switch-on` | Power you switch on | Some work needs rights with no masks or policies (the storage itself, admin settings, restoring a table): a second, personal admin account for each data specialist, raised for a task with a reason, logged, then off; never for business users or analysts | Great power is a separate account, switched on for a task. |
| 5 | | `5-people-and-groups` | People and groups | Users and groups synced from Microsoft Entra ID, single sign-on with passkeys, account and workspace levels; admin accounts in their own groups, raised with privileged identity management; command-line sign-in by browser; personal tokens off | People sign in once, with no password to steal; power is borrowed, not kept. |
| 6 | | `6-workloads-without-secrets` | Workloads without secrets | Service principals; managed identities; GitHub Actions signing in to Databricks and Azure by federation; GitHub Apps in place of tokens; Key Vault only where nothing else works; secret scanning and push protection | A workload proves who it is without a password. |
| 7 | | `7-network-storage-and-keys` | Network, storage and keys | Private endpoints, no public access, IP access lists, serverless egress rules, workspaces bound to catalogs by area; the storage reached only through the catalog's managed identity, and directly only by a raised admin account; customer-managed keys | No path to the data skips the catalog, except the one you switch on and watch. |
| 8 | | `8-from-a-branch-to-production` | From a branch to production | Development, test and production; GitHub environments with required reviewers, rulesets, code owners; bundles deployed only by a service principal; the supply chain (dependency alerts, code scanning, actions pinned, the workflow token kept to read) | Production changes only through a reviewed path. |
| 9 | | `9-who-did-what` | Who did what | Audit logs in Databricks' system tables, GitHub's audit log and Azure's storage logs; an alert every time an admin account is raised; a leaked secret or a stolen session handled step by step; a break-glass account; restoring from a protected copy | If you can't see it, you can't say it's protected. |
| 10 | *Only what you may see* | `1-an-agreement-first` | An agreement first | Two kinds of signed paper: each contributor's confidentiality agreement and responsibility for data, and for each use a data sharing agreement and its contract (purpose, classes, retention, end date, the owner's sign-off); the agreement becomes the grant | Access is the end of an agreement, not the start. |
| 11 | | `2-know-what-you-hold` | Know what you hold | Classification: a level for each table (public, internal, confidential, restricted) and a class for each column (direct identifier, indirect identifier, special category, none), set once at the source by its owner; the class follows the data | You can't protect what you haven't named. |
| 12 | | `3-show-the-least` | Show the least | The ways to hide a value compared: leave it out, mask it whole or in part, generalise it, a keyed hash, a token, encryption, totals with small counts hidden, and filtering rows; what each keeps and whether it can be undone | Show the least that still answers the question. |
| 13 | | `4-grants-by-design` | Grants by design | Unity Catalog's privilege model: catalog, schema and table, ownership by groups, inheritance, workspace bindings; grants kept as code | Design the grants once, by area and role. |
| 14 | | `5-tags-that-travel` | Tags that travel | Governed tags with set values; data classification proposing tags and an owner confirming them; classes written in dbt and set as tags; tags carried downstream through lineage, and what happens when two sources disagree | Tag once at the source; the tag follows the data. |
| 15 | | `6-one-policy-for-many-tables` | One policy for many tables | Attribute-based access control: row filter and column mask policies on a catalog or schema, matched by tag; a mask function for each way to hide a value; who is exempt; policies kept as code | The policy follows the tag, so new tables are protected the day they appear. |
| 16 | | `7-copies-that-keep-the-rules` | Copies that keep the rules | Development and test with masked or made-up data; sharing outside the university with the same rules; clean rooms; downloads and exports that would skip them, closed | Every copy keeps the protection, or isn't made. |
| 17 | | `8-proof-it-held` | Proof it held | Access reviews, reads in the audit log, lineage of where protected columns went, a check that every personal column has a class and a policy, access ending on its date | Protection you can't prove is protection you hope for. |
| 18 | *Kept for a reason* | `1-a-reason-to-keep-it` | A reason to keep it | Every piece of personal data has a purpose; collect only what it needs; consent is one reason among several; a privacy check before a new use | Keep data for a reason you can say. |
| 19 | | `2-how-long-and-then-what` | How long, and then what | The life of data: in use, archived, deleted; a retention schedule by kind of record; holds that pause deletion; what must be kept by law and what mustn't be | Every record has an end date, decided before it's needed. |
| 20 | | `3-forgetting-a-person` | Forgetting a person | People's rights over their data: to see it, correct it, and have it erased; finding every place a person's data lives; what can't be erased, and saying why | A person can ask; you must be able to answer. |
| 21 | | `4-deleted-means-deleted` | Deleted means deleted | On the platform: a delete leaves old files until they're cleaned up (VACUUM, time travel's window); retention set on each table; archives in cold storage; finding copies through lineage; personal data in logs, traces and prompts | Deleting is done when the last copy is gone. |
| 22 | | `5-a-person-asks` | A person asks | Linh's request end to end: a ticket, her records found through the registrar's key and lineage, copies sent, the mailing list cleared, pay records kept for their legal time, and proof of each step in the repository and the audit log | A request answered on time, with proof. |

The number in the first column is the film's place in the module, for the threads that make it; on the site, each series numbers its own films. Films 1 to 4, 10 to 12 and 18 to 20 name no product; the others show Databricks, GitHub, dbt and Azure.

## Openings

Every film opens with a real story from outside data, in the four beats said outright (scenario, problem, solution, benefits), comes back to it, and closes on its benefit for data. Proposed by the module's setup, for each film's thread to check against its own sources and record in its own rows, keeping cultures and eras varied across the module: the tiger tallies of China's Warring States, two halves that had to match (*Who is it, really?*); a time lock on a bank vault, 1874 (*Power you switch on*); Japan's Hakone checkpoint, 1619 (*Walls, doors and keys*); the oath of Hippocrates and its promise of silence (*An agreement first*); the secret ballot of Victoria, 1856 (*Show the least*); the United States' Records Disposal Act of 1943 and its schedules (*How long, and then what*); Mario Costeja González and the newspaper notice of 1998, decided in 2014 (*Forgetting a person*). The other films' threads choose their own, avoiding the openings already used on the site.

## Rules from the plan

- Ideas first: the ideas films name no product; the tool films name what they show, as its docs name it on the day.
- Every protection starts from something already defined on the architecture map or in the governance registers, and the film says where.
- No film shows or says a feature's release status (preview, beta, generally available); each keeps the status it read, with its date, in its script's sources only.
- No real secret, token or key is ever shown, even a made-up one that looks real; secrets are drawn as sealed cards.
- An agent proposes and a person approves; agents never get admin accounts.
- The fictional university, people and numbers; no film names a real breach's victim as the subject. Spanish is captions and pages only. Each film has Pause and think questions; labs come later, as one set for the module.
