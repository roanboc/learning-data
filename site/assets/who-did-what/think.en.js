/* Learning Data: "Pause and think" for Who did what, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (store, night, copy), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The module's labs come later, as one set, so no question
   has a "stop" yet, and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  store:{q:"Why does every record go to a store the security team keeps, with a locked copy?",
    opts:[{t:"Because the platform deletes its own audit table after 90 days, so the review needs a copy.",near:true},{t:"So it outlasts each tool's own memory, and none of the people it records can change it.",ok:true},{t:"So the platform team can tidy old records away once the review has signed them off."}],
    why:"Each tool keeps its record for its own time: the platform a year, GitHub six months and its pushes a week, the directory a month. Sent as they're written to a store apart, with a copy locked for a year, the records outlast them all, and nobody they record can change them. The platform keeps its own table a year, not 90 days. Where do your platform's records live, and who could change them?"},
  night:{q:"Why does the on-call end Jun's sessions before reading what the copy did?",
    opts:[{t:"Whoever holds the copy is Jun until it ends, so every minute it stays open it can still act.",ok:true},{t:"Because ending the sessions also deletes whatever the copy took from GitHub that night."},{t:"Because the store gets a session's record only once that session has been ended.",near:true}],
    why:"A copied session is bearer paper: whoever holds it is Jun until it ends, so reading first leaves the door open while you read. The records don't wait for the session to end: each one is sent as it's written. And ending a session takes back nothing that was already copied. In your team, who can end a person's sessions everywhere, at night?"},
  copy:{q:"A table was deleted by mistake three weeks ago, and nobody noticed. What brings it back?",
    opts:[{t:"Its own history, since a table can go back to any version it has ever had.",near:true},{t:"An emergency account, since its power is always on and needs no approval."},{t:"A locked copy from before the mistake, kept 30 days where no one could delete it.",ok:true}],
    why:"A table's history undoes mistakes for seven days; after that, its old versions are cleaned up. The nightly copies go to a place apart and are locked for 30 days, so a copy from before the mistake is still there, and no one could have deleted it. An emergency account gets someone in; it brings nothing back. When did your team last restore a copy, and check it?"}
  }}};
