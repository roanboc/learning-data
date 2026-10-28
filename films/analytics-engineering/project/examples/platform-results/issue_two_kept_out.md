# Data quality: 1 test and 1 check to answer, by 4 November 2026

**Owner:** Learning team · **To:** learning@uni.example · **From the run of** 28 October 2026

## `has_an_id` on `short_courses.enrolments`

- **Status:** warn, 2 rows · **Checked by** the platform's pipeline expectation
- **Domain:** `learning` · **Dimension:** completeness
- **Why the limit is there:** A row with no system key can't be told apart from another, or versioned: it's kept out at loading, and counted, until it's fixed where it's kept.
- **Cause:** *(the owner writes it in)*
- **Due:** 4 November 2026
- **Closed when:** the platform's check passes, on the next night's results

## `not_null_stg_short_courses__enrolments_customer_bk`

- **Status:** warn, 1 row
- **Domain:** `learning` · **Dimension:** completeness
- **Why the limit is there:** The customer who enrolled, by email. An enrolment with no email can't be matched to a learner. The learning team agreed: warn when any current enrolment has none, stop the build when more than five do (see DEC-SC-01 and LIM-SC-02).
- **Cause:** *(the owner writes it in)*
- **Due:** 4 November 2026
- **Closed when:** `not_null_stg_short_courses__enrolments_customer_bk` passes (`dbt build --select not_null_stg_short_courses__enrolments_customer_bk --profiles-dir .`)
