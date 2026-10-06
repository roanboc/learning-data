# Gap register

What the business expects, against what the sources hold: one line per gap, with a decision.
Each decision is one of three: fix at source, rule in the model, or accept and document.

| # | Expectation | Reality | Decision | Where |
|---|---|---|---|---|
| 1 | A revoked credential is known as revoked. | The learning platform has no revocation flag: it deletes a revoked badge. | **Rule in the model:** a badge that disappears is revoked from the day the platform stopped showing it. **Fix at source**, requested: a revocation flag and date. | `int_credentials_unioned` |
| 2 | Every learning platform account names its student. | Staff type the student ID in. 4 of 42 current accounts have none (`analyses/profile_null_keys.sql`); one holds another student's ID. | **Rule in the model:** match by email when exactly one student has it; a recorded decision beats the rules. **Fix at source**, requested: check the ID against the student system. | `int_learner_key_candidates` |
| 3 | One email, one learner. | Two students share a family email, in the student system and on the platform (`analyses/profile_shared_emails.sql`). | **Rule in the model:** an email matches only when exactly one learner has it. The registrar's office decides the rest. | `int_learner_key_candidates`, `int_learner_keys_matched`, `seeds/student/learner_identity_decisions.csv` |
| 4 | An email is written the same way everywhere. | The short-course platform keeps case and spaces as typed: 2 enrolments find no customer as typed, none once trimmed and lower-cased (`analyses/profile_orphans.sql`). | **Rule in the model:** trim every key and write it in one case before comparing: emails lower case, IDs upper case. The hash upper-cases every key too. | staging, `hash_key` |
| 5 | Every short-course enrolment has an email. | Walk-in enrolments can have none: one current enrolment, whose certificate can't reach anyone. | **Accept and document.** Warn on any; stop the build above five. | `stg_short_courses__enrolments` |
| 6 | A change is dated when it happened. | The student system records some changes late: a withdrawal effective on 27 March was recorded on 3 April (`analyses/profile_late_changes.sql`). The platforms only say when they recorded a change. | **Rule in the model:** use the student system's effective date. **Accept** that platform dates are the day the platform recorded the change. | `int_learner_timeline` |
| 7 | The student system says when an award was conferred. | It has no conferral record: the student's status turns completed. | **Rule in the model:** an award is conferred on the day the first completed version takes effect. **Fix at source**, requested. | `int_credentials_unioned` |
| 8 | A status means the same thing everywhere. | Three code sets: ENR, LOA, WD, CMP; active, inactive; 1, 0. | **Rule in the model:** one canonical set, mapped in `seeds/student/status_map.csv`, owned by the registrar's office. | `int_learner_timeline` |
| 9 | A certificate is a credential. | The short-course platform issues certificates of completion and of attendance in one table. | **Rule in the model:** only certificates of completion are credentials. | `int_credentials_unioned` |
| 10 | A credential can expire. | No source records an expiry. | **Accept and document.** `status` allows `expired`; nothing sets it yet. | `core_credential` |

## Known limitations

The gaps accepted above, and what follows from them:

- **Revocation dates are the day a source stopped showing a credential as held.** A badge: the day the platform stopped showing it. A short-course certificate: the day its enrolment stopped being completed. An award: the day a later record of the same award stopped being completed. It may have been revoked earlier, and a badge deleted for another reason also counts as revoked.
- **A learner the student system doesn't know keeps the key of the first system that recorded them**, the learning platform first on a tie. The key changes only when they're matched to a student ID, by a rule (a student ID in their platform account, an email only one student has) or by the registrar's office. Their old key stays in `int_learner_keys`.
- **A learner with two keys in one system gets one value per attribute.** Two platform accounts, or two short-course emails: on each date, that system's version recorded last wins.
- **The Planning mart applies identity as it's known today to the census date.** The census team matched two learners by hand before publishing on 14 April 2026; the registrar's office recorded the same matches as decisions D-001 and D-002 in October. Without those decisions, the mart counts 10 learners, not 12, and the reconciliation fails.
- **An enrolment with no email gives a credential no one holds.** It stays out of the core until the learning team adds the email.
- **Units count only towards the award they were taken under.** Credit moved between awards when a learner changes award is outside this slice.
- **An incremental run re-merges only what changed.** `core_credential` merges credentials whose source rows were written since the last run, and credentials whose holder was matched to another learner. A change to the model's logic reaches existing rows only with `--full-refresh`.
