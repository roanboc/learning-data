/* Learning Data: "Pause and think" for A person asks, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (places, off, proof), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  places:{q:"The job looks for Linh's six numbers in every column the tags point to. Why would that alone miss the marts built for the wallet, planning and finance?",
    opts:[{t:"Their columns aren't tagged as personal, so the job never looks in them.",near:true},{t:"They're rebuilt every night, so her rows are gone before the job looks."},{t:"They hold her only as a code made from her number, not the number itself.",ok:true}],
    why:"The marts keep a code made from her student number in place of the number, so a search for the number finds nothing there. The tags still point to those columns, as pseudonymous, so the job makes the same code from her number and looks for that. Where you work, which tables hold people only as codes?"},
  off:{q:"Linh's row is deleted from the mailing list. What stops next semester's rebuild from adding her again?",
    opts:[{t:"Her no, kept on the person in place of her yes: the rebuild takes only a yes.",ok:true},{t:"Cleaning up the list table's old versions, seven days after the delete.",near:true},{t:"Her contract has ended, so she's no longer one of the casual tutors."}],
    why:"The rebuild reads the casual contracts of the last two years, so she's still among them, and it takes only people whose yes is on the person. Her no replaced her yes, so the rebuild leaves her out. Cleaning up old versions removes old copies of the list; it doesn't change what the next list takes. Where you work, what would bring a deleted person back?"},
  proof:{q:"How does the team show that only the privacy office and its jobs read Linh's numbers?",
    opts:[{t:"Her numbers were never typed, so nobody else could have read them."},{t:"The audit log lists every read of the table of keys, and who made it.",ok:true},{t:"The ticket links each step to the run that did it, and who ran it.",near:true}],
    why:"Every read of a table is in the audit log, with who made it, so the reads of the table of keys show who saw her numbers: the office and its two jobs. The ticket proves each step was done, and by whom, but not who else read the table. Not typing a number keeps it out of a query's text; it doesn't show who read the table. Where you work, could you show who read a person's data last month?"}
  }}
};
