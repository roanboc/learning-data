/* Learning Data: "Pause and think" for People and groups, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (directory, power, tokens), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The module's labs come later, as one set, so no question
   has a "stop" yet, and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  directory:{q:"Someone in the registrar's office moves to Finance. What does Sam change on the platform?",
    opts:[{t:"He moves them to Finance's group in Databricks, and the directory copies the change."},{t:"Nothing: the platform copies the directory once a night, so they move by morning.",near:true},{t:"Nothing: the directory changes their groups, and the platform reads them as they sign in.",ok:true}],
    why:"Groups are changed in one place only, the directory, and Databricks reads a person's groups again each time they sign in, so the move needs nothing on the platform. It doesn't wait for a nightly copy; and a group from the directory can't be changed in Databricks at all. Where does a move between teams get recorded at your work?"},
  power:{q:"Jun has to restore a table this afternoon. What does he do?",
    opts:[{t:"He switches on the table group from his admin account, says why, and Sam approves.",ok:true},{t:"He signs in with his admin account, which stays in the table group, ready for this.",near:true},{t:"He asks Sam to put his everyday account in the table group just for the afternoon."}],
    why:"Admin power lives in groups no one is in. Jun's admin account is only eligible for admin_table_restorers: he switches it on for the task, gives the reason, Sam approves, and it ends by itself. An admin account that stays in the group is standing power, the key that outlives the stay; and his everyday account never gets admin power. Who in your team holds admin power right now, and since when?"},
  tokens:{q:"Why can the six people end their personal tokens without losing anything?",
    opts:[{t:"Sam gives each of them a token of the job's own, kept in a vault and changed monthly."},{t:"Their command line signs in through the browser now, and keeps its own short passes.",ok:true},{t:"Each now gets a token that ends after an hour, which they paste into the command line.",near:true}],
    why:"The Databricks CLI signs in through the browser, with the same passkey, and keeps its own passes, an hour long, in the computer's secure store: nothing to copy, nothing to paste. Short passes are right, but no one handles them; and a token of the job's own is for the job, not for people. Which tools on your laptop still ask you to paste a token?"}
  }}};
