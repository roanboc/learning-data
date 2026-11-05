/* Learning Data: "Pause and think" for Plan, define the check, do, check, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (long, define, do, check), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "long":{q:"The agent read 38 web pages for a rule Docs gives in one call. What would have saved it the trouble?",
    opts:[{t:"A faster agent, so it reads the pages sooner."},{t:"A plan that names its tools, and gives it only those.",ok:true},{t:"Telling it to read fewer web pages."}],
    why:"The agent wasn't broken: it used what it could find, because nobody had said what was there. A plan that names Catalog, Query and Docs sends it to the university's own rules, in one call. Where you work, what would an agent have to be told is there?"},
  "define":{q:"Why does Jun approve the two tests before the agent builds anything?",
    opts:[{t:"So the agent can start building sooner, with fewer questions."},{t:"So what counts as right is set before the result, and the agent can't pass by moving the mark.",ok:true},{t:"Because a test written later would run more slowly."}],
    why:"A check decided after the work tends to bend to fit it. Written first, approved by a person and changed only by a person, the tests say what right means before there's a result, like Singapore's 190 measures, written before the plant made any water. What would your first two checks be?"},
  "do":{q:"Twenty-eight students have no level. Why doesn't the agent put them in undergraduate and move on?",
    opts:[{t:"Because the test would still fail."},{t:"Because which level they belong to is a meaning, and Mei owns it.",ok:true},{t:"Because it had used up its rounds."}],
    why:"Putting them in undergraduate would turn the test green and make the count wrong. The agent doesn't drop rows or touch a test to pass: it stops, and asks the meaning's owner, with its query and the result. Mei checks the government's list: non-award, a level of its own. Who owns the meanings your agents would meet?"},
  "check":{q:"Both tests pass. Why does the change still need Jun and Noor?",
    opts:[{t:"It doesn't: once the tests are green, the change can go to production."},{t:"A person checks it against the plan and answers for it, and a second person approves it.",ok:true},{t:"The agent's own review found a problem it couldn't fix."}],
    why:"Green tests show the work meets its checks, not that it kept to the plan. Jun reads the pull request against the plan, and once he accepts it, the change is his to answer for. Noor, a second person, approves it for production. The agent can review too, only for reference: it never approves. Who would be the second person where you work?"}
  }}};
