# From helper to colleague: the series' own questions and assumptions

> Copied from the film thread's notes on 10 November 2026. Paths such as `../briefs.md` point to the thread's working folder, not to this repository.

For Rodrigo's final checklist (5 November 2026, 11:53: "Give me a final checklist with the questions you had for each topic and the assumption"). Kept by the series thread; each film keeps its own list in its folder here (`<folder>/assumptions.md`), in the same form.

| # | Topic | The question I'd have asked Rodrigo | The assumption I took | Where it shows | Easy to change? |
|---|---|---|---|---|---|
| 1 | Cast | Who is the agent with a history in 3.1 and 3.7, now the census agent is off? | One from series 2's new examples, by default Anil Kurian's workload agent: the plan's recommended option (the card was closed on it when you said to go on with assumptions, and the plan you approved keeps it) | 3.1's two chapters, 3.7's story, `series.json`'s people | Medium: two chapters of 3.1 and 3.7's story re-voiced and redrawn |
| 2 | Order | Restart the films now, or wait for the rework of 2.7 to 2.9 to merge? | Restart now from their branches; merge only after the rework, in order, 3.1 first | Each film's merge | Easy |
| 3 | 3.4's opening | Which story opens *Rights follow the role*? | Unit-dose dispensing in hospitals (the 1960s), checked first; or one from outside the English-speaking world, since 3.1 to 3.3 all come from it | 3.4's opening | Medium: one chapter |
| 4 | Memory | What happens when an agent's memory disagrees with a governed definition? | The definition wins, and the agent says so in its report, so the definition's owner sees it; nobody approves memories | 3.4, 3.5; `decided.md` | Easy: a line |
| 5 | Logos | Do the tool films show the tools' logos, as series 2 now does? | Yes: official and unaltered, where the narration names a tool, credited in `NOTICE.md` | 3.5 to 3.7 | Easy |
| 6 | Draft label | How is the draft label set, and when does it come off a film? | Once for the whole series (`"draft": true` in `series.json`, pull request #152), so every film's page shows it with no change of its own; it comes off a film when you have seen it (`"draft": false` in its `site.json`) | `series.json`; `decided.md`; each film's page | Easy: one line per film |
| 7 | Folders | Rename the unpublished folders to the new titles? | Yes: `3-a-place-on-the-map` and `5-the-map-enforced`; `4-rights-follow-the-role` is new | The films' addresses on the site | Easy before the first merge; never after |
| 8 | Census agent | May the census agent still appear? | Only as a name, in a line; its count and census stories aren't shown, and 3.3 doesn't place it on the map (row 9) | 3.5's logs | Easy |
| 9 | Agents on the map | Should every agent with a name of its own be on the map by the end of series 3? | No: 3.3 places the three the series follows (the planning agent, the workload agent and the governance review agent); Jun's project check agent (the reworked *Why Unity Catalog and Unity Gateway govern them*) and the census agent join when a film needs them, and at the latest with series 4's register of agents, made from the map | 3.3's map (`governance/3-architecture-map/5-application/application-components/`) | Easy: one file for each agent |

## 10 November 2026: review order (thread "Fix review order in Helper to colleague films")

- **Question:** who approves the change on the map, now that owners and stewards never review or approve a pull request (Rodrigo, 10 Nov 01:08)?
- **Assumption taken:** the release approver (Noor), whose role already reads "Approves a change for production and releases it", and who approves every change to production in 3.1. Clara stays on the map as requester (raises the ticket) and product owner (answers for the product, told of changes). The seven steps and their order stay, so 3.3 and 3.4 keep their layout. Alternative not taken: a new first step, "check the glossary", which would move every step's place in 3.3 and 3.4.
