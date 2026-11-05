/* Learning Data: "Pause and think" for Context engineering, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (word, reads, team), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "word":{q:"The agent's answer comes with its query, and sounds sure. What should Jun check before Planning uses it?",
    opts:[{t:"What the word means, and who says so.",ok:true},{t:"That the query counts the right table.",near:true},{t:"That the number is close to last year's."}],
    why:"A query that runs can still count the wrong thing. The answer is only as right as the meaning it counted by, and that meaning has an owner. Where you work, which words would an agent have to guess?"},
  "reads":{q:"The meaning of “commencing” was missing from the agent's context. Which of the four kinds should hold it?",
    opts:[{t:"Code: the repository's recipes and their tests."},{t:"Metadata: what words mean, written by their owners.",ok:true},{t:"Memory: what past sessions learned about the word.",near:true}],
    why:"A word's meaning belongs in the metadata, where its owner writes it once. The project's code then copies it with where it came from, so the column, the test and the contract all say the same. Where is a word's meaning written down where you work?"},
  "team":{q:"Each person on the team had wired up their own agent, with notes of their own. What goes wrong?",
    opts:[{t:"The agents share one memory, so a wrong note from one reaches all of them."},{t:"Each agent's notes are careful, so the answers agree, but nobody reviews them.",near:true},{t:"Each agent knows only what its owner told it, so their answers disagree.",ok:true}],
    why:"Three sets of notes gave one word three meanings, like the chant books named after their masters. One context, in the project, reviewed like code, with an owner for every meaning, gives every person and every agent the same page, and a change made once reaches them all. Whose notes would your agents need to read today?"}
  }}};
