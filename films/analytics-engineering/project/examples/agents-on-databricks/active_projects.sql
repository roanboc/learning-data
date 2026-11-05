-- The count of active research projects in one faculty, written once, as a function any agent can
-- call: through the Unity Catalog functions tool server, or in SQL. Databricks only; CI doesn't run it.
--
-- It counts the research office's governed table of projects in production: the current version of
-- each project, with what the example data's research_system/projects.csv holds (its code, title, lead,
-- start and end) and the unit and faculty of the person who leads it, as the research office records
-- them. A project is active from the day it starts to the day it ends, by its current record, so a
-- project given more time counts until its new end date. Each counts once, in the faculty that leads it:
-- not the yearly research report's share, which gives each faculty half of a project it shares with
-- another, and not every unit with Health in its name (Engineering's Bridge Health Lab tests bridges).
-- Its comment is what an agent reads as the tool's description.
--
-- Created in production after review (Jun Park, the code) and approval (Noor Rahman), like any change
-- to production. Faculty names are the research office's own, such as Faculty of Health.

create or replace function <production catalog>.<research schema>.active_projects(
    faculty string comment 'The faculty that leads the projects, by its name, such as Faculty of Health'
)
returns bigint
comment 'Research projects active today in one faculty: started and not yet ended (by the current end date, so a project given more time still counts), each counted once, in the faculty that leads it. Not the yearly research report''s share, which counts a project shared with another faculty as half. A unit with Health in its name is not the Faculty of Health: Engineering''s Bridge Health Lab tests bridges.'
return
    select count(distinct project_code)
    from <production catalog>.<research schema>.projects
    where lead_faculty = active_projects.faculty
      and starts_on <= current_date()
      and ends_on >= current_date();
