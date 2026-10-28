/* Learning Data: "Pause and think" for Rules that run, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (runs, level, list), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "runs":{q:"A check fails at 2 a.m. Before this film, who would have heard about it?",
    opts:[{t:"The data team, who would fix the data themselves before morning."},{t:"Nobody in particular: the result named only the check, not whose it is.",ok:true},{t:"The system's owner, at the next spring survey."}],
    why:"A result said pass, warn or fail, and named only the check: not whose data it checked, or what kind of quality. That's how a warning ran every night for a year with nobody reading it. Once every check has an owner and a dimension in the rule register, the scorecard says whose it is, and a failure goes to its owner with a date. Which of your checks would reach a person tomorrow morning?"},
  "level":{q:"One enrolment with no email warns; six stop the night's update. Who chose that, and why?",
    opts:[{t:"Data governance, so every rule has the same level."},{t:"The learning team, who own the data: one or two walk-ins a term are normal, and more means something broke.",ok:true},{t:"The data team, because they run the checks."}],
    why:"The level is the owner's, not governance's. The learning team knows one or two walk-ins a term are normal and follows them up, so any warns; more than five means something broke, so it stops. Planning chose the opposite for its census number, because it goes to the government. Each owner signs the level and its reason on a rule card, because a rule its owner doesn't understand gets ignored, then switched off. Who should set the level of your most important check?"},
  "list":{q:"“Every walk-in is followed up within a week.” A check, or a list?",
    opts:[{t:"A check: if a walk-in waits more than a week, stop the night's update."},{t:"A list: it's about what people do, so it's cases the learning team works through.",ok:true},{t:"Neither: owners rate it each spring in the survey."}],
    why:"Following up a walk-in is about what people do, not about the data, so it never stops the update: it's a list of cases the learning team works through. The check stays about the data only: an enrolment with no email. Which of your rules are really about what people do?"}
  }}};
