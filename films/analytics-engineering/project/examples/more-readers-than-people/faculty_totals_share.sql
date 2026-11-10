-- The share with a group of universities that compares teaching costs (exposure faculty_totals_share,
-- DEC-FIN-06): one table, casual teaching cost by faculty for the teaching periods Finance has
-- reported, never by unit. Their own system reads it where it lives, through OpenSharing's open
-- protocol, so there's no copy to keep up to date. Run once by Sam, on the platform team, who owns the
-- share. Databricks only.

CREATE SHARE IF NOT EXISTS teaching_costs
  COMMENT 'Casual teaching cost by faculty, for the teaching periods Finance has reported (DEC-FIN-06). Totals by faculty, never by unit.';

ALTER SHARE teaching_costs
  ADD TABLE university.prod_marts.mart_finance__faculty_totals
  AS finance.faculty_totals;

-- A recipient outside Databricks: with no sharing identifier, it's an open recipient, which gets an
-- activation link to its credential, sent to the group's contact.
CREATE RECIPIENT IF NOT EXISTS university_cost_group
  COMMENT 'A group of universities that compares teaching costs, faculty by faculty, each semester';

GRANT SELECT ON SHARE teaching_costs TO RECIPIENT university_cost_group;
