/* Learning Data: "Pause and think" for Workloads without secrets, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (asked, vault, found), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The module's labs come later, as one set, so no question
   has a "stop" yet, and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "asked":{q:"Someone copies the deploy workflow into their own repository and runs it. Why does it get no pass?",
    opts:[{t:"GitHub signs a note only for the platform's own repository, so the copy gets none.",near:true},{t:"The copy has no token in its settings, and a workflow can't sign in without one."},{t:"Its note says where it ran, and the policy names only the platform's repository.",ok:true}],
    why:"GitHub signs a note for any run that asks for one, wherever it runs, and the note says where: the repository and the environment. Azure Databricks checks the signature, then checks that the note says exactly what registrar-loader's policy names, the platform's repository in its production environment. The copy's note names another repository, so it gets no pass; and neither workflow ever held a token to steal. Which of your deploys still keep a token?"},
  "vault":{q:"Each month a function changes the password, in the vault too. Why does it need no secret to open the vault?",
    opts:[{t:"It signs in as its own managed identity, whose credentials nobody ever sees.",ok:true},{t:"It keeps a secret of its own in the same vault, so nothing is stored elsewhere.",near:true},{t:"It runs once a month, so a secret of its own would have no time to leak out."}],
    why:"The function signs in as its own managed identity: Azure keeps and changes its credentials, and nobody ever sees them, so there's no secret to open the vault with. A secret of its own, kept in the same vault, would need another way in to read it, and that way in would need one too. Which of your scripts open a vault with a secret kept somewhere else?"},
  "found":{q:"Jun's token is still in the repository's history. Why is it safe to leave it there?",
    opts:[{t:"Push protection now blocks the old commit, so nobody can read the token in it.",near:true},{t:"Jun ended the token that morning, so the copy in the history opens nothing.",ok:true},{t:"Secret scanning deleted each copy it found, so the history is clean again."}],
    why:"Ending a secret is what makes every copy worthless: once Jun ended his token, the copies in the history, the notebook and the laptop open nothing. Push protection stops a new push with a secret in it before it lands; it doesn't hide old commits, and secret scanning raises an alert but deletes nothing. Rewriting a shared history would break everyone's copies of the repository, and wouldn't reach the copies already made. Which of your old tokens still work?"}
  }}};
