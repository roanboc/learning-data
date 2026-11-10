/* Learning Data: "Pause and think" for Defined in the open, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (three, dbt, open), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  three:{q:"In August, Health got A$2.46M, A$1.88M and A$2.21M for casual teaching cost. Why three numbers?",
    opts:[{t:"Each counted something else under one name: hours contracted, pay paid, claims approved.",ok:true},{t:"Only Finance's report was right; the spreadsheet and payroll's report counted it wrongly.",near:true},{t:"Each tool read its own copy of the claims, taken at a different time in the semester."}],
    why:"Each number was right for its own question: the hours in the tutors' contracts, the pay paid on the semester's pay days, and the claims approved for the semester's teaching, plus on-costs. Finance's is the one Rohan means by casual teaching cost, but the other two weren't wrong, only named the same. So the fix isn't to correct two reports: it's one definition for the measure, and names of their own for the other two numbers. Which of your measures goes by one name in two tools that count it differently?"},
  dbt:{q:"Casual teaching cost could live in a metric view or in dbt's MetricFlow. Where should it be defined?",
    opts:[{t:"In both, so the platform's tools and the dbt project's tools each read it in their own format.",near:true},{t:"In the BI tool most of its readers use, in that tool's own layer of business definitions."},{t:"In one of them, near most of its readers, and never defined a second time in the other.",ok:true}],
    why:"Either can be a measure's home. Choose one for each measure, near most of its readers, and never define it twice: two definitions drift apart, as the kilogram's copies did. Casual teaching cost lives in a metric view, beside the tables it's counted from; Planning's learners near a graduate certificate live in MetricFlow. A BI tool's own layer is how it was done for decades, in a format no other tool could read. Where does each of your team's measures live, and is any defined twice?"},
  open:{q:"Casual teaching cost goes to another tool in Apache Ossie. What makes sure its rules arrive with it?",
    opts:[{t:"A filter on the whole metric view, so every measure in the view is counted the same way.",near:true},{t:"Each rule kept inside the measure, and a look at what the converter says it couldn't carry.",ok:true},{t:"Its rules typed again in the new tool, so they match the definition in the metric view."}],
    why:"A converter carries what's inside the measure, so keep each rule there: the claims for teaching are counted by the measure's own FILTER. A filter on the whole view stays behind. And check what arrives: a converter says what it can't carry. Typing the rules again in each tool is the problem the film began with. Which of your definitions keeps a rule outside the measure it belongs to?"}
  }}};
