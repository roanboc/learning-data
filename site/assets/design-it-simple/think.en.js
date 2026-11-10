/* Learning Data: "Pause and think" for Design it simple, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (rules, team, pages), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  rules:{q:"Each of the five principles says what it rules out. Why does that matter?",
    opts:[{t:"So the five sound strict enough that the faculties take them seriously, and follow them."},{t:"So Helena can check every new choice against them, and then settle it herself for everyone.",near:true},{t:"So anyone can test a choice against them: a principle nothing could fail settles nothing.",ok:true}],
    why:"A principle earns its place by what it rules out. Simple before clever says no to a tool of the faculties' own, since the platform the team runs will do; one copy, governed once, says no to a staff list for each faculty. A principle nothing could fail can't settle a choice. And anyone can check a choice against them, without asking Helena. What would one of your principles rule out?"},
  team:{q:"In the target, who builds the Faculty of Health's own reports?",
    opts:[{t:"Health's data partner, about a day a week, with the team's tools, standards and help.",ok:true},{t:"The small team in the middle, which keeps the platform and builds every report on it.",near:true},{t:"Whoever in Health needs a report, in their own spreadsheet, so nobody has to wait."}],
    why:"The small team in the middle keeps the platform, the standards, the shared products and the guardrails, and helps. If it built every area's reports too, it would be the 41-day queue again; if everyone built their own, there'd be three staff lists again. Each of seven data partners builds their own area's products with the team's tools, about a day a week, given by their dean or director. Who already does this work where you are, in spreadsheets?"},
  pages:{q:"Anil's change waited four working days at step four. What did his try-out change?",
    opts:[{t:"Step four names a reviewer in Health, who knows best what Health's report should say.",near:true},{t:"Step four names one reviewer from a rota, within two working days, never the builder.",ok:true},{t:"Partners now check their own changes, so nothing waits for the small team any more."}],
    why:"Step four said only \"the team checks it\", so everyone thought someone else had it. Now it names one reviewer from the data team's rota, within two working days, and never the person who built it. What a report means is settled before the build, in the glossary, by its owner in the business; the reviewer checks the code. Tried by one partner, the gap was fixed before everyone met it. Which step in your work says \"the team\" where it should name one person?"}
  }}};
