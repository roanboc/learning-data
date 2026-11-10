/* Learning Data: "Pause and think" for Good enough for what?, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (reprint, uses, needs), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "reprint":{q:"The list passed every check and seated the Great Hall well, and still 41 certificates were printed again. What does that show?",
    opts:[{t:"The list was good: 41 of 2,031 is about two in a hundred, a small share."},{t:"Good enough for seating isn't good enough for names: it needs more checks.",near:true},{t:"Good enough for seating isn't good enough for names: it depends on the use.",ok:true}],
    why:"The list passed every check on it, and none of those checks asked what each use needs. Seating needs a count per ceremony, and the counts were right to within a few seats. A certificate needs one graduate's name, exactly: Andrés's record seats him well and prints a name that isn't his. More checks, written before anyone asked what the list is for, would still miss it. Which of your tables is called good or bad for every use at once?"},
  "uses":{q:"Why does the seating plan accept a count within 2%, while the certificates accept zero wrong?",
    opts:[{t:"A few seats out costs a few chairs; one wrong name costs a certificate printed again.",ok:true},{t:"Seating matters less to the university, so its checks can be looser than the rest."},{t:"A few seats out costs a few chairs; one wrong name is easier to check than a count.",near:true}],
    why:"Malia, Mei and Jun asked who uses the list, for what, and what goes wrong, for whom, when it's wrong. A count a few seats out means a few seats spare, or a few more chairs, on the day. One wrong name means a certificate printed again, about 120 dollars with its courier, and a graduate who may cross the stage holding an empty folder. Each level comes from what a mistake costs its use, not from what's easiest to check. What does a mistake cost in your busiest table, and for whom?"},
  "needs":{q:"Andrés's record holds his name without its accents. Which dimension does that fail, and for which use?",
    opts:[{t:"Complete, for his certificate: the list holds a name, but not all of its letters.",near:true},{t:"Accurate, for his certificate: the list holds a name, but not the one he really has.",ok:true},{t:"Valid, for seating: a name without its accents breaks the rule for writing names."}],
    why:"Complete asks whether every graduate who crosses the stage is on the list, once, and Andrés is: one graduate, one seat. Andres Penaloza is a valid name, too. It just isn't his: a certificate needs the name its graduate really has, and that's accuracy. Each use leans on its own dimensions, as Mercator's chart chose angles over sizes. Which dimension does your most important use lean on?"}
  }}};
