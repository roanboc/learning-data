/* Learning Data: "Pause and think" for Governed in dbt, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (access, impact, agent), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "access":{q:"Planning's analyst can't build on an intermediate step of the data team's project, but could still read its table on the platform. Why?",
    opts:[{t:"dbt's access hides only a model's name, so its table is public anyway."},{t:"Groups and access in dbt decide who may build on a model in the project. Who may read a table is the platform's to decide, with its grants.",ok:true},{t:"Because the analyst belongs to the data team's group."}],
    why:"dbt checks every ref() when it reads the project, so a model outside the data team's group can't be built on one of its private steps: dbt stops before anything runs. Reading a table is another question, answered where the table lives, on the platform, which the next film shows. Where you work, who decides who may build on a table, and who decides who may read it?"},
  "impact":{q:"Jun's first draft changed no column, yet Mei said it breaks. Why doesn't the check catch that?",
    opts:[{t:"The check only looks at new tables."},{t:"The check compares columns and their types. A change of meaning, the same column holding something else, is for the meaning's owner to call, and Mei decided it breaks.",ok:true},{t:"Microcredentials aren't in any contract."}],
    why:"The impact check can say what a change reaches, five reports and apps and four owners to ask, because the project names them. It can't say what a column means: that's the glossary's, and its owner's. So it asks the owners, and Mei's answer made Jun add a column instead, which no reader had to change for. Has a change in your work kept every column, but changed what a number meant?"},
  "agent":{q:"The agent drafts award_key as pseudonymous, and says it isn't sure. Who decides its class, and why not the agent?",
    opts:[{t:"The agent, since it counted the rows."},{t:"The Faculty of Health, the table's owner: a class is a claim about the data, which its owner answers for. The agent drafts it, with counts as evidence, and flags it.",ok:true},{t:"Nobody: the check decides once the pull request merges."}],
    why:"Seven rows with only two distinct values may be keys to awards, not to people. The agent can count, draft and flag, and never sees a value; its review is a comment, not an approval. The owner decides, and every approval is a person's. Which decisions in your work would you let an agent draft, and which would you keep for people?"}
  }}};
