# What Genie Code proposed for the graduation list, and what was decided

After the agent's 412, Jun Park asked Genie Code, the data team's coding agent, to read the
graduation list and the checks it already runs. It profiled every column, drafted a description for
each column that had a thin one, and proposed three checks. Each draft was a start: it could say what
a column's name suggests, not what only its owner knows. Jun reviewed each one, and Mei Tanaka, who
answers for the list, set the levels. The agent proposes; people decide.

| Genie Code proposed | Jun's review | Mei's level | Where it is now |
|---|---|---|---|
| A check: a name on the list that isn't the name its graduate gave in the portal | Kept. Compare the printer's file with each graduate's last answer, a correction waiting for its check included | Stop the printer's file until a person settles each name (error) | `tests/rules/printers_file_has_the_names_graduates_gave.sql`. On 22 October it found three: names changed since enrolment, still waiting for a document |
| A check: `name_confirmed_on` and `name_confirmed_how` agree | Kept. Both come from the same answers, so a difference is a fault in the code | Hold for Jun (warn) | `tests/rules/name_confirmation_columns_agree.sql`. It passes |
| A check: every graduate on the list has confirmed their name | Not a check. It would fail every night a graduate hadn't confirmed yet: that's about what people do, not whether the data is right (`docs/conventions.md`, *Tests*) | | `mart_graduations__names_to_confirm`, a count Malia follows each week, and the agent's trusted answer to her question |
| Descriptions for the columns with thin ones | Each read against what Mei knows; the two confirmation columns rewritten in her words, with what empty means | | `models/marts/graduations/_graduations__models.yml` |

Genie Code drafts in Jun's branch, and its changes reach the project only through a pull request that
a person reviews and approves (`AGENTS.md`, *Who approves what*).
