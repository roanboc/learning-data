# Decisions

What was decided, why, and who decided. The university, its people and the dates are fictional:
the decisions happen in the story the films tell, in October 2026. Gaps between what the business
expects and what the sources hold have their own register, [gaps.md](gaps.md).

| Date | Decision | Why | Who |
|---|---|---|---|
| 1 Oct 2026 | Scope: the entities Planning's question touches, and no more: learner, credential, award, and credit towards an award. | "Model the university" never ends. A question does. | Noor, data architect, with Planning |
| 2 Oct 2026 | A microcredential is a kind of credential, not an entity of its own. So is a badge. | Same identity (the issuer's identifier) and the same lifecycle (issued, maybe revoked). Only the credit points differ. | Mei Tanaka, registrar's office |
| 2 Oct 2026 | A certificate of attendance isn't a credential. | It says someone was there, not what they can do. | Mei Tanaka, registrar's office |
| 5 Oct 2026 | Keys are qualified by where they come from: key sets `SIS`, `LMS` and `SC`. Every hash is kept beside its readable key. | Two systems can use the same-looking key for different people. A hash alone can't be read or checked. | Noor, data architect |
| 5 Oct 2026 | The learner's business key is the student ID, which the registrar's office issues. A learner the student system doesn't know keeps the key of the first system that knew them. | The student system is the system of record for learners. Short-course customers and platform-only learners still need a key. | Mei Tanaka and Noor |
| 6 Oct 2026 | Keys are matched by rules, most trusted first. A person's recorded decision beats every rule, and a decision that two keys are different people stops any rule from matching them. | An email two people share, or a student ID typed wrong, would merge two learners. Some matches only a person can make. | Mei Tanaka, registrar's office |
| 8 Oct 2026 | Planning's mart is as it was at census, dated by when things took effect. The wallet's marts are as they are now. | Planning compares with the census report; the wallet shows the learner today. Both build on the same core. | Planning, the wallet app team and Noor |
| 8 Oct 2026 | Credit counts from the day a result is released or a credential issued, until it's amended or revoked; every change is a new version. | "As at census" needs the credit held on that day, not today. | Mei Tanaka, registrar's office |
| 8 Oct 2026 | A credential keeps its whole life: issued on a date, revoked on a date, read from every version the source kept. A revoked credential stays, marked revoked. | "As at census" needs what counted then, even if it was revoked since; the wallet shows a revoked credential as revoked, not gone. | Mei Tanaka, registrar's office |
| 9 Oct 2026 | An enrolment with no email: warn when there's any, stop the build when more than five. | One or two walk-ins a term are expected, and the learning team follows them up. More means something broke. | The learning team |
| 10 Oct 2026 | Every core model is versioned, from version 1, and consumers pin the version they read. | A breaking change then arrives as a new version beside the old one, with a deprecation date, not as a surprise. | Noor, data architect |
| 12 Oct 2026 | One group owns staging, intermediate and core while one team builds them; Planning and the wallet each own their marts. Split into projects when teams own their domains. | Groups control who can `ref()` what within a project. Separate projects add cost that pays off only with separate teams. | Noor, data architect |
| 13 Oct 2026 | `core_credential` version 2 replaces `is_revoked` with `status` (valid, expired or revoked). Version 1 stays until 31 March 2027, built from version 2. | A credential can also expire, and a true/false can't say so. Consumers get time to move; the exposures say who to tell. | Noor and Mei Tanaka; the wallet app team told |
| 14 Oct 2026 | Definitions are written once, in `model/conceptual.yml`, and generated into doc blocks. The physical diagram is generated from the manifest. Descriptions go to Unity Catalog with `persist_docs`. | Four copies of a definition drift apart. One home, and one direction of sync, keeps them the same. | Jun Park and Noor |
| 15 Oct 2026 | The project is organised by domain, following TCSI: `student` and `course` in the core, `planning` and `wallet` in the marts. Each domain's conceptual model, definitions, column descriptions and physical diagram live in its folder; `docs/` keeps the process. | In a large project, each domain owns its meaning and changes it on its own. Definitions kept beside their models are found and reviewed with them. A public reference model gives the domains names others recognise. | Noor, data architect |
| 16 Oct 2026 | The conceptual model is written at two levels: a map of the university's domains and key entities (at most 50, modelled or planned, following TCSI), and each core domain and mart's own. Sources, models and exposures each get a top-level folder. | The map shows where each domain sits and what's still to model, without the detail; the detail stays with its owner. A consumer's question belongs to the consumer. What comes in, what's built and who uses it are different things, and each is easy to find on its own. | Noor, data architect |

## Engine choices

| Decision | Why |
|---|---|
| DuckDB runs the project here and in CI; Databricks runs it for the university. | Anyone can run it with no account, and the same code runs on the university's platform. |
| Primary and foreign keys are declared for Databricks and left out on DuckDB. Tests check keys on both. | Databricks records them as information and doesn't enforce them. DuckDB enforces them, and won't rename or drop a table a foreign key points to, which dbt does to rebuild it. |
| `core_credential` version 2 is incremental, merged on `credential_key`, on both engines. | One strategy, `merge`, that both engines support. |
