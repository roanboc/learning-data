# Governed in dbt: questions and assumptions

*Data governance* · *Governance you can use*, film 1 of 6 · merged, PR #326 · [pull request](https://github.com/roanboc/learning-data/pull/326)

[Watch it on the site](https://data.learn-all.org/governance-in-practice/governed-in-dbt/)

## The question, and Rodrigo's answer (12 November 2026)

**Asked.** Assumed: only canonical tables get an enterprise contract in an open standard, written first by the information architect and built by the data team. Other models keep dbt contracts. Is that the line?

**Answered.** "Yes, canonical models are maintained by governance while there could be more contracts in the data team for data providers and consumers that do not need enterprise/governance agreement but team to team."

So the line holds, and one thing is added: the data team's other contracts, with the teams that send it data and the teams that read its data, are agreed team to team. Data governance isn't asked.

## What the film, the project and the labs said before

- **The film** already drew the line: "Only the canonical tables, the shared core, also have an enterprise contract, in an open standard." "Data governance's information architect writes it first, and the data team builds to it." Under the canonical tables, the board said "the marts: dbt contracts only". It never said who agrees those other contracts.
- **The example project** said "Other dbt contracts are the data team's" (its `AGENTS.md` and `governance/README.md`). Its process already has the consumer contract approved by the owner and the consumer, and its worked example of the HR system's interface has an input's contract agreed with the system's owner.
- **The labs and scenarios** of the three governance series never say who agrees a contract. Nothing in them contradicts the answer.

## What changed

- **The film, chapter 4 (*A promise the build keeps*).** One new line after the exposures: "Contracts like these are agreed team to team, with whoever reads the data or sends it, and don't wait on governance." One new picture on the board: a provider, the data team and a consumer, with a contract pinned between each pair, under a strip that says "agreed team to team" and a tag, "no agreement from data governance needed". The contracts are in the data team's green, and there is no gold on the board. Under the canonical tables, the label now reads "the marts: dbt contracts, team to team".
- **Spanish.** The caption: "Contratos como estos se pactan de equipo a equipo, con quien lee los datos o quien los envía, y no esperan a gobernanza."
- **Length.** The film is 9 seconds longer: 6:48, 896 words at 132 words a minute. Only the new line was voiced; every other line keeps its length. The soundtrack is mixed again, with a sheet of paper and two pins for the new picture.
- **The example project.** Its `AGENTS.md` (line 81) and `governance/README.md` (line 11) now say the data team's other contracts, a mart's dbt contract or an input's, are agreed team to team and need no agreement from data governance. Both lines changed in place, so no cited line moved.
- **The guidelines.** The rule in `AGENTS.md` (*Owners and stewards never review pull requests*) and PLAYBOOK §3 carry the answer, so later films follow it.
- **The labs.** Left as they are.

## Assumptions (for Rodrigo's final checklist)

1. **Said in the voice, not only on the board.** One spoken line and one picture, so the Spanish captions carry it too. A label alone would have been easy to miss.
2. **A provider and a consumer, not named teams.** The picture says "A provider · sends the data" and "A consumer · reads the data", since the rule holds for any team. The story's own examples (the HR system, Planning) are named in the script's rigour notes, not on screen.
3. **Agreed in a ticket, not in review.** Following the rule of 11 November 2026, the example project says the team-to-team agreement is asked for and given in a linked ticket. The film doesn't show the ticket.
4. **A canonical table's dbt contract still builds to its enterprise contract.** The new line comes before "Only the canonical tables … also have an enterprise contract", so "don't wait on governance" is about the contracts that aren't canonical. The film doesn't say this in more words.
5. **No new lab.** The series has nine labs, and none is about who agrees a contract. One could be added later if you want it practised.
6. **Not changed here.** The example project still writes open-standard contract files for the marts as well as the core (`scripts/generate/products.py`), as the script's rigour notes say, until *Products in open formats* is reworked to this rule.

## Release

Nothing for Rodrigo to run. The new soundtrack is indexed as `audio-governed-in-dbt-12faad7b2be02c305f20` and publishes itself when the change reaches main. The film isn't rendered here; the release workflow renders it.
