# When things go wrong · 2. Out of range

*Treatment for the second episode of [When things go wrong](../README.md), v0.1: a proposal for review before any script or picture. Status: proposal.*

**Series tagline:** Fail safely. Fix once.

## The promise

Same two audiences, same university, same platform, and Sam, the data engineer from the first episode, as the guide.

**The theme: a rule is only as good as what happens when it's broken.** Data expectations are the rules every row must meet: a mark between 0 and 100, a fee that's never negative, a room never fuller than its seats. They come from the business, live in the data contract from the first episode, and run on every row. Checking is the easy part. The real decision is what to do with a row that breaks the rule: keep it and warn, set it aside, or stop everything. The right answer depends on who is on the other end of the data.

**Logline.** A new marking tool writes −1 for "extension granted", and 38 students are about to be told they're failing. Watch three versions of the same Monday, one for each thing a platform can do with a bad row, and see why the right choice depends on the people it reaches.

**Why it's worth making.** Most teams add checks; few decide what should happen when a check fails, so the default decides for them. The film makes that choice visible and human, and shows that stopping everything isn't automatically the safe option.

## The spine: one bad value, three Mondays

Week six of semester. Student support runs an early-warning data product: each Monday morning, students whose average mark has dropped below 50% get a friendly check-in email from an advisor. It's a good service, and it runs on data.

On Friday, the learning platform team switches Data Science 101 to a new online marking tool. When a lecturer grants an extension, the tool records the mark as −1: a placeholder that means "not marked yet". Nobody outside the tool knows. Averaged in, −1 looks like a failing mark, and 38 students who have simply been given more time would be told the university is worried about them.

The contract says a mark is between 0 and 100. The platform checks that rule on every row. The question the film asks is what it does next.

| Chapter | What happens | What it teaches |
|---|---|---|
| **0. Monday, 9:00 am** | A student's phone lights up: "We've noticed your marks have dropped, and we'd like to help." She was given an extension; she hasn't even handed the work in. The picture freezes. The narrator: "This is one version of Monday. Let's go back to Friday." | Data reaches people. A wrong number can become a worrying message. |
| **1. The rule** | Back through the screen into the platform. The early-warning data product, its contract card, and the line that matters: a mark is between 0 and 100. At each gate, every row lights up green or amber against the rules. | What an expectation is: a rule from the business, written into the contract, checked row by row. |
| **2. Friday night** | The new tool's export arrives. Most marks glow green. 38 rows carry −1 and turn amber at the gate. | Out-of-range values, and placeholder values such as −1, 999 or 1 January 1900. |
| **3. Three Mondays** | The screen splits into three, and the same batch runs three ways. **Keep and warn:** the rows flow on with a warning in a log nobody reads before Monday, and 38 worrying emails go out. **Stop everything:** the load fails on the first bad row, so no emails go out at all, including to the 12 students who really are struggling this week. **Set aside and tell:** the 38 rows go to the quarantine tray, the rest flow on, the 12 students get their check-in, and the marks' owner gets a note: "38 marks out of range: −1." | The three things a platform can do with a bad row, and what each one costs. Stopping everything is not automatically safe: silence can hurt too. |
| **4. Who decides** | Noor, the student support advisor, and Dr Lena Fischer, who runs the course, choose the action by its consequence: a wrong "you're failing" email is worse than a day's delay for a few students, and silence for struggling students is worse than both. They also set a limit: if more than 2% of a batch breaks the rules, something bigger is wrong, such as a whole file on the wrong scale, so the load stops and people are called. | The action on failure is a business decision, made in advance and written into the contract. Thresholds: a few bad rows are set aside; many bad rows stop the load. |
| **5. What −1 means** | Lena opens the quarantine tray with Sam and sees what the tool meant: an extension, not a mark. Tomás's team changes the tool to send extensions as a status, not a number. The contract gains a line, the 38 rows are released and processed again, and nothing was lost. | Fix the cause at the source. A placeholder is a meaning hiding in a number: give it its own field. Quarantine keeps rows so they can be fixed and released. |
| **6. In range, still wrong** | A short coda. Another course's marks arrive as 7.2 instead of 72: every value passes the 0 to 100 rule, yet the class average drops from 68% to 7%. A monitor that watches the shape of the data, not single rows, notices. Other rules appear briefly: never empty, unique, and every mark belongs to an enrolled student. | Range checks don't catch everything. Expectations on rows, plus monitoring of distributions, cover different failures. |
| **7. Pull back** | Monday, the right version: 12 students get a kind check-in, and 38 get nothing until their marks exist. The camera pulls back to the whole platform, gates glowing along every path. The last line: "Every rule needs a plan for when it's broken." | Fail safely: decide in advance what happens when data breaks a rule. |

## The people

The series keeps the same square: technical and business, on the side that produces the data and the side that uses it. Sam returns; the other corners are new, because this change happens in a different part of the university. Names are placeholders, and everyone is fictional.

| Character | Corner | Role | What they show |
|---|---|---|---|
| **Dr Lena Fischer** | Business, produces | Runs Data Science 101 and grants extensions | Knows what −1 means, and decides what the marks should say. |
| **Tomás Díaz** | Technical, produces | Learning platform team | Rolled out a good tool with one hidden habit, and fixes it at the source. |
| **Sam Okafor** | Technical, uses | Data engineer, the series' guide | Makes the three actions visible, and asks who should choose. |
| **Noor Haddad** | Business, uses | Student support advisor | The person who sends the check-ins, and who knows what a wrong one does to a student. |

A student appears only in the opening and closing shots, as the person on the other end of the data. She has no name and no lines: she stands for everyone the data reaches.

## Visual language

Everything from the first episode (the square of characters, Sam's screen as the door, the contract card, the quarantine tray), plus:

| New object | Stands for |
|---|---|
| A gate at each layer where every row lights green or amber | An expectation, checked row by row |
| A number that glows wrong: −1, 999, 1 January 1900 | Out-of-range and placeholder values |
| The screen split into three Mondays | The three actions: keep and warn, stop everything, set aside and tell |
| A gauge on the gate, with a red line at 2% | A threshold that turns a few bad rows into a stopped load |
| A class average drawn as a curve that suddenly sinks | Monitoring the shape of the data, for values that are in range but wrong |

**Tone.** Warmer than the first episode, because it reaches a student directly, and still calm. The opening message should feel real, not alarming. No villains: the tool, the placeholder and the early-warning service were all reasonable on their own.

## Pacing

About 115 words a minute, holds after each new idea, and a breather at the end of each chapter. The three Mondays need time: each version holds long enough to see who got what. Target length: 6 to 7 minutes.

## Labs and scenarios (for Learning Data)

- **Lab, *Pick the action*:** send a batch with a few bad rows through keep and warn, set aside, or stop, and see each Monday: who got an email, who didn't, and who was wrongly worried. Then move the threshold and send a batch that's wrong throughout.
- **Lab, *In range, still wrong*:** slide a column's scale and watch which checks notice: the range rule, or the monitor.
- **Scenarios:** choose the action for each:
  - a negative fee on a finance report
  - a lecture room showing 400 people in 40 seats on the live campus screen, from the first film
  - a date of birth of 1 January 1900
  - a whole file of marks out of 20 instead of 100

## Rigour to check when scripting

To confirm against current documentation, and record in the rigour sheet with the date checked:

- **Databricks pipeline expectations:**
  - the three actions: keep the row and record it (the default), drop the row, or fail the update
  - how a quarantine table is built, since dropping a row doesn't keep it
  - where expectation results are recorded (the pipeline's event log)
- **dbt:**
  - range tests (`accepted_range` in dbt-utils, and the current state of the dbt-expectations packages)
  - `severity`, and thresholds with `warn_if` and `error_if`
  - `store_failures`, to keep failing rows
- **Delta Lake:** `CHECK` constraints, which reject a whole write rather than single rows.
- **Databricks data quality monitoring:** its current name, and what it watches (profiles, drift, anomalies).
- **Early-warning systems in higher education:** how universities use them, and the care they need, so the opening scene is realistic and respectful.

## Decisions for the author

1. **The incident.** Placeholder marks of −1 reaching an early-warning email (recommended: it reaches a person, and shows why the action matters). Alternatives: a room showing 400 people in 40 seats on the live campus screen, or a negative fee in a finance report.
2. **The device.** Three Mondays side by side (recommended), or one timeline where the team tries each action in turn.
3. **The student on screen.** Shown in the opening and closing shots (recommended), or kept off screen, with only her phone.

## Next checkpoints

1. Agree this treatment.
2. Reuse the character sheet from the first episode, and add the new characters.
3. Script with a rigour sheet and pacing report.
4. Style frames: the gate with green and amber rows, the three Mondays, the gauge.
5. A voice test, and the first cut.
