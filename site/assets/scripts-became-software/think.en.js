/* Learning Data: "Pause and think" for Scripts became software, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (laptop, project, release), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  laptop:{q:"Payroll's export worked for years, and nobody is to blame for it. So why could nobody change it safely once the spreadsheets stopped coming?",
    opts:[{t:"Its author had moved to another team, and only the person who writes a script may change it."},{t:"It was one copy, with no history of why it worked as it did, and no test to say if a change broke it.",ok:true},{t:"It was one copy, and nobody knew the claims app yet, though its tests showed what a change would break.",near:true}],
    why:"The script did its job, but everything it knew lived in one copy on one laptop: no history of why each line was there, and no test to say whether a change broke it. So when the claims moved, nobody could touch it without risking pay day. Where you work, which job runs from one person's machine, with nobody able to say what a change would break?"},
  project:{q:"Jun wrote the tests first, at the rule's edge: a claim approved at 11:59 on the Monday, and one at 12:01. Why test those two minutes?",
    opts:[{t:"That's where the rule changes its answer: one minute decides if a claim is paid that Thursday or two weeks later.",ok:true},{t:"That's where the rule changes its answer, so a test there checks that the claims app's clock keeps the right time.",near:true},{t:"Most claims are approved around noon on a Monday, so those two minutes cover most of what's paid each Thursday."}],
    why:"A rule is most likely to break where its answer flips. Approved at 11:59 on the Monday, a claim is paid that Thursday; at 12:01, two weeks later. A test on each side of the edge, written before the model, says at once if a change moves it. What rule in your data has an edge like that, and is it tested there?"},
  release:{q:"Once Noor approves, the same files go to production by the same steps as to test. Why does that matter?",
    opts:[{t:"Production can skip its own run then: the job has already run in test, and its results are copied across."},{t:"What ran in test runs in production, as long as whoever deploys it signs in with their own account.",near:true},{t:"What ran in test is what runs in production: the two can't drift apart, and nobody deploys from a laptop.",ok:true}],
    why:"The bundle lists the project's jobs and where each one runs, so test and production get the same files, by the same steps, every time. The job runs as the platform's own account, never a person's, so no one's laptop or sign-in is part of a release. Where you work, could test and production quietly differ today?"}
  }}};
