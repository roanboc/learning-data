/* Learning Data: "Pause and think" for No secret to lose, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (ladder, climb, people), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The module's labs come later, as one set, so no question
   has a "stop" yet, and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "ladder":{q:"Why are the top two rungs the goal, and not a certificate?",
    opts:[{t:"A certificate's key goes out with every sign-in, so it can be copied on the way.",near:true},{t:"On the top two, the platform makes a pass for each run, and nobody keeps a secret.",ok:true},{t:"On the top two, a pass has no end date, so nobody ever has to renew anything."}],
    why:"On the top two rungs, the platform makes a new pass for each run; nobody sees it or stores it, and it ends within the hour. A certificate's key never leaves the job, which is why it ranks above a secret in a vault, but the key is still kept somewhere, and must be renewed before it ends. Which of your jobs still keep a secret somewhere?"},
  "climb":{q:"Jun moves to another team. Why does nothing break?",
    opts:[{t:"Sam gives the new team Jun's token, so the job signs in just as it did before."},{t:"The job now signs in with a token of its own, which Sam made before Jun left.",near:true},{t:"The job signs in as its own identity, with the loader role's rights, not Jun's.",ok:true}],
    why:"The job runs as registrar-loader, the platform vouches for it, and its rights come from the loader role, so it never depended on Jun. A token of the job's own would be one rung up from Jun's, but still bearer paper that someone has to keep. Whose name do your scheduled jobs run under?"},
  "people":{q:"A fake page looks exactly like the university's. Which sign-in gives it nothing it can use?",
    opts:[{t:"A passkey: it stays on your device, and it answers only the real site.",ok:true},{t:"An app on your phone: its code changes every few seconds, so it can't be used.",near:true},{t:"A long password: a fake page can't guess it, so it can't sign in as you."}],
    why:"A passkey answers only the real site, so a fake page gets nothing it can use. An app's code, or your yes, can be passed on by the fake page in the seconds it's valid; a code by text, the same; and a password typed into the page is simply handed over. How do you sign in to work today?"}
  }}};
