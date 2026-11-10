# Request 2026-117 · due 24 Dec 2026

*An issue in the data team's repository, made from the issue form
[`privacy-request.yml`](privacy-request.yml), as it stood when it closed. It names no one: the
person's numbers are only in the restricted table `privacy.request_keys`, under the request's
number ([`docs/databricks-governance.md`](../../docs/databricks-governance.md), *A person's request*).*

**Label:** privacy request · **Opened** Tuesday 24 November 2026 · **Closed** Monday 7 December 2026, completed

## The request

- **Request number:** 2026-117
- **Due:** Thursday 24 December 2026
- **What the person asks:** see what's held; stop a use (news of tutoring work)

## Steps

- [x] Find every place: the search's run #1408, run as `privacy-finder`, 25 November
      ([`where_a_person_is.sql`](../../analyses/privacy/where_a_person_is.sql),
      [`find_a_person.sql`](../../analyses/privacy/find_a_person.sql)); systems off the platform
      searched by their owners: payroll, the claims app, the mailing tool, the signed contracts
- [x] The copy, by part: what, why, from where, who else, until when; other people's data left out;
      drafted 1 December
- [x] Off the mailing list: `mart_hr__tutors_mailing_list` and `mart_hr__tutor_news_sent`,
      `DELETE` and `REORG` on 25 November by `privacy-deleter`, `VACUUM` on 2 December (each
      table's `DESCRIBE HISTORY`); the mailing tool's sync, 25 November, 04:00; the no recorded by
      HR on 25 November
- [x] Owners check their parts: HR, the registrar's office, the research office, 3 December
- [x] Answer sent: 7 December, by a link opened by signing in, 17 days before it was due

Who read the keys this month: `privacy-finder`, `privacy-deleter` and the privacy office, and no one
else ([`who_read_the_keys.sql`](../../analyses/privacy/who_read_the_keys.sql)). The request's rows
left `privacy.request_keys` when it closed.
