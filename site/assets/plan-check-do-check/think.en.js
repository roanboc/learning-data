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
  "define":{q:"Nobody knows yet how many students are at each level. So what can Jun's two checks say?",
    opts:[{t:"The number at each level, from last year's report."},{t:"What any right answer must meet: the levels add up to 18,412, and every student has exactly one level.",ok:true},{t:"Nothing, until the agent has a result to look at."}],
    why:"Nobody knows the answer yet: that's why Clara asked. But any right answer must meet two things: the levels add up to 18,412, the count already matched to the census report, and every student has exactly one level, as the glossary defines it. They check how the parts relate and what the words mean, not the numbers, and Jun approves them before any work. What must be true of an answer you don't know yet?"},
  "do":{q:"Twenty-eight students have no level. Why doesn't the agent put them in undergraduate and move on?",
    opts:[{t:"Because the test would still fail."},{t:"Because which level they belong to is a meaning, and Mei owns it.",ok:true},{t:"Because it had used up its rounds."}],
    why:"Putting them in undergraduate would turn the test green and make the count wrong. The agent doesn't drop rows or touch a test to pass: it stops, and asks the meaning's owner, with its query, the result and two options that both add up. Mei checks the government's list: non-award, a level of its own. And since none had had a level since 2021, the years before go to Planning, for people to look into. Who owns the meanings your agents would meet?"},
  "check":{q:"Both tests pass. Why does the change still need Jun and Noor?",
    opts:[{t:"It doesn't: once the tests are green, the change can go to production."},{t:"A person checks it against the plan and answers for it, and a second person approves it.",ok:true},{t:"The agent's own review found a problem it couldn't fix."}],
    why:"Green tests show the work meets its checks, not that it kept to the plan. Jun reads the pull request against the plan, and once he accepts it, the change is his to answer for. Noor, a second person, approves it for production. The agent can review too, only for reference: it never approves. Who would be the second person where you work?"}
  }}};
