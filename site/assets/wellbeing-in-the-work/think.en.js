/* Learning Data: "Pause and think" for Wellbeing is in the work, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (needs, order, signs), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  needs:{q:"Fourteen urgent requests wait on Marta, in no order. What does Helena change first?",
    opts:[{t:"Marta's habits: a plan for her week, a way to push back on new requests, and a day off to rest.",near:true},{t:"Marta's desk: a faster laptop and fewer small annoyances, so each of the fourteen takes less time."},{t:"The work: she writes Marta's week on one page with her, to see what it asks and what helps.",ok:true}],
    why:"Helena could have asked Marta to cope, but the fourteen would still be there when she came back. So she looks at the work before the person. The page shows what is missing in it: Marta has no say in her order, finishes little, and is alone with the fourteen. Taking away what annoys her isn't the same as meeting those needs. Whose week would you write on one page first?"},
  order:{q:"Helena takes Marta's page to the nine people who asked. What is the least she can accept from them?",
    opts:[{t:"An agreed order, whatever it is, with a date for each request that is still needed.",ok:true},{t:"The order the team prefers, since the team knows best how long each request will take.",near:true},{t:"An apology from whoever called a request urgent when it could have waited a month."}],
    why:"She brings the page as evidence, with no blame: none of them had seen the others' requests. She comes prepared: what the team wants, what they want, what both want, and the least she can accept, which is an agreed order, whatever it is, with a date for each request. In half an hour, two requests were no longer needed, and twelve had an order and a date. Who would need to be in the room to agree an order for your team's work?"},
  signs:{q:"Someone on the team seems worn out and distant from the job. What is their manager's part?",
    opts:[{t:"To wait a few weeks before saying anything, since these signs often pass after a busy month."},{t:"To ask, listen and change the work first, and to point to professional help if it is more than work.",ok:true},{t:"To ask, listen and work out what is wrong with the person's health, then plan the work around it.",near:true}],
    why:"These are the World Health Organization's signs of burn-out, which comes from stress at work that has not been managed, and which it classes as a matter of work, not as a medical condition. So a manager who notices a sign asks, listens, and changes the work first. And a manager's part has an end: Helena is not a clinician, so when it is more than work she points to professional help, and keeps it private. What in your team's work would you change first?"}
  }}};
