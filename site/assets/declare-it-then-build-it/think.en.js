/* Learning Data: "Pause and think" for A model is not a transformation, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (recap, name, lives, steps), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "recap":{stop:"blueprint",q:"Two teams count credentials and get different numbers. Is the data wrong, or the meaning?",
    opts:[{t:"The data: one team's pipeline has a bug."},{t:"Usually the meaning: each team counts what it thinks a credential is.",ok:true},{t:"Neither: numbers always differ a little."}],
    why:"Four offices gave four numbers, and none was wrong: each counted a different idea under the same word. Agree the meaning first, then build."},
  "name":{stop:"blueprint",q:"dbt shows you a file called a model. What does it actually hold?",
    opts:[{t:"The data model: what the data must be."},{t:"One query: a step that makes one table or view.",ok:true},{t:"The table itself, with its rows."}],
    why:"A dbt model is a SELECT and its configuration: one step of the building work. The data model is what that table must be, declared beside it."},
  "lives":{stop:"lives",q:"You need to know what one row of a table means. Where do you look?",
    opts:[{t:"In the SQL that builds it."},{t:"In its YAML (the grain, the key, the contract) and the Markdown it points to.",ok:true},{t:"In the table: count the rows."}],
    why:"The SQL says how the table is made, not what one row must be. The grain, the keys and the meaning are declared in YAML and Markdown, beside the code."},
  "steps":{stop:"steps",q:"An agent drafts your tests and your SQL. What's still yours?",
    opts:[{t:"Nothing: if the tests pass, it's done."},{t:"Approving: the meaning, the contract and the change. The agent drafts and checks, with evidence.",ok:true},{t:"Only typing the commit message."}],
    why:"The agent recommends; people approve. Drafting is cheap now; judging the draft, and owning the meaning, is still the job."}
  }}};
