/* Learning Data: "Pause and think" for A path for every provider, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (tree, gone, paths), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  tree:{q:"A provider can give its changes since a given time, but can't say what was deleted. Which path does the tree give it?",
    opts:[{t:"Wait for the vendor to add deletions, and take no data from it until the preferred way is met."},{t:"Its changes every hour, and its full list compared with ours every night to find what was deleted.",ok:true},{t:"Its changes every hour, and a person who removes any booking that looks cancelled when they see one.",near:true}],
    why:"Changes since a time cover what was added or changed; only a full list, compared each night, shows what's gone. A person spotting cancellations by eye would miss most of them, and waiting for the vendor holds the data back. Which of your sources can't say what was deleted?"},
  gone:{q:"By the first week of teaching, the nightly comparison found 212 deleted bookings. Why does that matter to Graham?",
    opts:[{t:"It shows the platform was built badly, since a well-built platform would never hold a deleted booking."},{t:"It shows the timetable's vendor broke its contract, so the university can ask for its money back.",near:true},{t:"Each would have shown a room booked and empty: an hour that looks wasted, when it was free all along.",ok:true}],
    why:"The vendor kept to what it sells: changes, but no deletions, until its 2028 renewal. The platform did what it was given. What mattered is Graham's page: 212 hours that would have looked booked and empty stay off it. What would a missed deletion look like on your own reports?"},
  paths:{q:"Payroll's nightly comparison stops if a night's file is much smaller than the night before. Why?",
    opts:[{t:"A weaker path is checked more often: a file cut short would mark staff as gone who are still there.",ok:true},{t:"A smaller file means many staff have left, so a person should approve that many changes at once.",near:true},{t:"Payroll's system is old, so every one of its nightly files is checked by a person before it is used."}],
    why:"Comparing a whole file treats whatever is missing as deleted, so a file cut short looks like 2,400 people gone. The check stops it and asks a person. A big drop is rarely real leavers, and checking every file by hand wouldn't last. Which of your weaker paths has no stop?"}
  }}};
