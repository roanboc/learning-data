/* Learning Data: "Pause and think" for Know what you hold, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (classes, holds, follows), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  classes:{q:"A learner's home postcode names no one by itself. Which class does it get?",
    opts:[{t:"None: it names no one by itself, so it says nothing about who they are.",near:true},{t:"Indirect: alone it names no one, but with a course it can single one out.",ok:true},{t:"Direct: a postcode is part of an address, and an address names a person."}],
    why:"A postcode names no one, but few learners share one, and with a course or a year of birth it can point to a single person. That's what indirect means: it singles someone out with other columns. Where you work, which columns name no one alone, but could point to one person together?"},
  holds:{q:"A column called dietary needs holds values like halal, kosher and vegetarian. Which class does it get?",
    opts:[{t:"Special: some values can tell a learner's faith, and the strictest applies.",ok:true},{t:"None: what someone eats is a choice, and it names no one by itself."},{t:"Indirect: with a course and a birthday, a diet could single out one learner.",near:true}],
    why:"Halal and kosher can tell a learner's faith, and faith is special, like health. A diet might also help single someone out, but a column gets the strictest class that applies, and its owner, who knows what the values mean, decides. Where you work, which column's name hides what its values tell?"},
  follows:{q:"Anil's totals by course are counted from columns that point to learners. Where does their class come from?",
    opts:[{t:"From the columns they're counted from: a class follows its data everywhere.",near:true},{t:"From whoever runs the count, since they make the new table themselves."},{t:"From the owner: a total holds something new, so it gets its class anew.",ok:true}],
    why:"A column carried as it is keeps its class. A step that changes what it holds, a code, a year, a total, makes something new, and the owner names it: here, none, in a public table, with any count under ten hidden. Where you work, who names the class of a table made from others?"}
  }}};
