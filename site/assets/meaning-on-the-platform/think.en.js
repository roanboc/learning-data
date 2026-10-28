/* Learning Data: "Pause and think" for Meaning on the platform, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (copy, sync, agents), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "copy":{q:"A table's description in the catalog doesn't match award's page. Where should the fix be made?",
    opts:[{t:"In the catalog, by editing the table's description."},{t:"On award's page on the platform, where people read it."},{t:"At its home, the term on Noor's map. The page, the data team's copy and the catalog's descriptions follow, one way.",ok:true}],
    why:"Each copy flows one way from its home: the map publishes the term to the glossary, the nightly sync brings the data team's copy into step, and each build writes the descriptions on to the catalog. An edit in the catalog is gone at the next build, and an edit on the page at the next publish. Where you work, where is a definition changed, and how far does the change travel by itself?"},
  "sync":{q:"On Monday night, the sync finds that award's words have changed. Why does it propose the change in a pull request, instead of updating the copy by itself?",
    opts:[{t:"Because a new meaning can change what's counted: Mei approves it and data governance confirms the term, with everything the new words touch in front of them.",ok:true},{t:"Because the sync isn't allowed to write files."},{t:"Because every nightly run needs a pull request."}],
    why:"The new words hold a number and name another kind of credential, so they can move counts that go to the government. The pull request puts the old words and the new beside what they touch, three tables, eight definitions, the code and three reports, so the owner decides with the consequences in view, and the people who use them are told. Where you work, who sees a change of meaning before it reaches the numbers?"},
  "agents":{q:"Genie One says 4,867 awards were conferred this year. Why is it the same number as the census report's?",
    opts:[{t:"It learned the number from the university's documents."},{t:"It reads the same metric view, awards conferred, and cites award's page for what an award is, instead of guessing from the tables.",ok:true},{t:"Clara checks its answer against the census report each time."}],
    why:"An assistant that guesses from tables and column names picks a meaning of its own, as the old reports did. Here the count is defined once, as a metric view, and the meaning has one page, so people, reports and agents read the same rule and get the same number, and the answer shows where it came from. Where you work, what would an assistant read to answer \"how many\"?"}
  }}};
