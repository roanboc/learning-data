/* Learning Data: "Pause and think" for An agent on the team, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (skills, evidence, shortcut, ship), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "skills":{stop:"rule",q:"Why keep the agent's rules and skills as files in the project, not in a long prompt?",
    opts:[{t:"Files are versioned, reviewed in pull requests like code, and read the same way by every person and every agent.",ok:true},{t:"Files load faster than a prompt, so the agent reads its rules before every step without slowing down.",near:true},{t:"Files are private to each agent, so no other agent or person can change its rules by mistake."}],
    why:"A prompt lives in one session and changes without anyone seeing it. AGENTS.md and the skill files change by pull request, and everyone reads the same version."},
  "evidence":{stop:"claims",q:"What turns a claim about the data into a guess?",
    opts:[{t:"A query beside it, but no owner's sign-off.",near:true},{t:"Coming from an agent, not a person."},{t:"No query and no result beside it.",ok:true}],
    why:"A reviewer can rerun a query; they can't rerun a sentence. Even a right number, without its query, is a guess."},
  "shortcut":{stop:"review",q:"The reconciliation failed. Whose decision is it to change what the test expects?",
    opts:[{t:"The agent's, if it writes down the reason and a person approves the PR.",near:true},{t:"The test's owner's (Planning, in its meta), with the reason written down.",ok:true},{t:"The data team's, since the test runs in their build."}],
    why:"Never the agent's. Here the expectation was right and the code was wrong: the census report said 3, and 3 was true."},
  "ship":{stop:"review",q:"CI is green. Why does a person still approve?",
    opts:[{t:"CI checks what someone thought to write down. A person checks what the change means.",ok:true},{t:"CI can't see the data, so a person reruns the tests on production first.",near:true},{t:"So the change has one named owner who can be blamed if it goes wrong."}],
    why:"Whether the diff was expected, whether the model still says what was agreed, and whether the right owner signed off: no check written in advance can judge those."}
  }}};
