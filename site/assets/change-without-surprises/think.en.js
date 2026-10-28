/* Learning Data: "Pause and think" for Change without surprises, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (breaks, edition, words), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "breaks":{q:"The table would have looked the same. Why did Jun's first draft break?",
    opts:[{t:"It renamed a column, so every report that used it would have failed."},{t:"It changed what existing data means: some microcredentials would have become awards, so the credit Planning's dashboard and Finance's forecast count would have dropped, and wallets would have shown awards learners don't hold.",ok:true},{t:"It added a new mark that the wallet app couldn't read."}],
    why:"A change can break without touching the table's shape. Relabelled as awards, the big microcredentials would have dropped out of the credit towards an award, so two numbers nobody meant to move would have moved, and learners' wallets would have shown awards they don't hold, all without those teams being told. Like switching sides of the road, everyone who uses the table would have had to change at once. Mei, who owns the meaning, decides it breaks. Which change in your work looked safe because the table looked the same?"},
  "edition":{q:"When does a change need a new edition?",
    opts:[{t:"Whenever a table changes, so nobody is surprised."},{t:"Only when it can't be added: something taken away or renamed, or a value that now means something else. The new edition goes beside the old one, which stays until a date everyone knows.",ok:true},{t:"Never: change the old edition in place, and tell everyone."}],
    why:"Adding breaks nothing, so it comes first: a new mark, and nothing changes for anyone until they choose it. A new edition is the last resort, for what can't be added, like taking a piece of information away. Then it goes beside the old one, like Sweden's new signs, and the old one stays until a date everyone knows: credentials' edition 1 retires on 31 March 2027. Which of your changes could have been added instead?"},
  "words":{q:"The note lists who a change reaches. What does each of them need to hear?",
    opts:[{t:"The change request's number, so they can look it up."},{t:"What changes for them, from when, and what they need to do, if anything, in their words, and who will help, before the change goes in.",ok:true},{t:"Nothing, as long as the change doesn't break anything."}],
    why:"Half of change control is telling people. Like Sweden's booklet, Jun's notice says what changes, from when, and what to do, in the wallet team's words, not the data team's, and he adds who will help. Nothing breaks for the wallet team, and they still hear first. The note says who must be told; the notice is how they hear it, before the change goes in. Who would need to hear about your next change, and in whose words?"}
  }}};
