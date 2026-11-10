/* Learning Data: "Pause and think" for An agreement first, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (promise, agreement, grant), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  promise:{q:"Anil hasn't renewed his confidentiality agreement this year. What happens to his access?",
    opts:[{t:"Nothing yet: the study's agreement runs until 30 June 2027, so his access holds until then.",near:true},{t:"His groups pause until he renews it; the study's agreement and its grant stay as they are.",ok:true},{t:"Mei renews it for him, since she owns the records the study uses and signs its agreement."}],
    why:"Each person's confidentiality agreement is a condition of being in any group that gives access: while it's signed and current, they're in; when it lapses, their groups pause until it's renewed. The study's agreement doesn't change, and nobody can sign someone else's promise. Where you work, who checks that everyone with access has signed, this year?"},
  agreement:{q:"Anil wants to check the study's numbers on his laptop at home. What does the agreement let him take?",
    opts:[{t:"A copy of the records, once the names and the exam support are taken out of it.",near:true},{t:"Anything, as long as he's signed his confidentiality agreement and keeps it to himself."},{t:"Only totals, with any count under 10 hidden; the records stay in the study's own space.",ok:true}],
    why:"The agreement says where the study may work, on the platform in its own space with nothing downloaded, and what may leave: totals, with any count under 10 hidden. Taking the names out still leaves each learner's results, year of birth and code on a laptop. What may leave your platform today, and who decided it?"},
  grant:{q:"The faculty asks the study for the names of learners who need support, to call them. What should happen?",
    opts:[{t:"The support team asks the owner for an agreement of its own, for that purpose.",ok:true},{t:"The study's agreement is widened to add the names, since it's the same learners' data.",near:true},{t:"Anil sends the names he can work out, since he already holds the learners' records."}],
    why:"A new purpose needs a new agreement: the study's says what it's for, and calling learners isn't it. The support team asks Mei, the owner, who decides; how someone is reached without the study learning who they are is for Show the least. Which of your agreements has quietly stretched to a new use?"}
  }}
};
