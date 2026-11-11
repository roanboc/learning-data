/* Learning Data: "Pause and think" for Ideas that last, features you test, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (recap, light, loop), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  recap:{q:"Each series showed its idea in Databricks and dbt. Why does the film say each idea is older than its tools?",
    opts:[{t:"Because the tools came first, and the ideas were written later to explain them."},{t:"Because the ideas came from old frameworks, so no tool is needed to apply them.",near:true},{t:"Because people agreed on, tested and governed data long before these tools did it.",ok:true}],
    why:"Agreeing what a field means, testing and releasing the same way, defining each measure in the open: teams did all of it by hand long before today's tools took on much of the work. The tools show the ideas; they don't make them. They still help, which is why the films show them. Which of these ideas does your team still do by hand?"},
  light:{q:"Your team doesn't use Databricks. What's the best thing to take from these films?",
    opts:[{t:"The ideas, and a check of what your own platform offers for each one.",ok:true},{t:"The ideas, and a move to Databricks, since the films showed them there.",near:true},{t:"Every button the films showed, since most platforms name them alike."}],
    why:"The ideas hold on any platform: agree what data means, test it, govern it, serve it when the business acts. Most platforms have an answer for each, under another name, and their own documentation says how. Choosing a platform because a film showed it isn't a real need. What does your platform call each of the four?"},
  loop:{q:"Rohan's team asks for a better way than typing invoices by hand. What does the first trial of a new feature look like?",
    opts:[{t:"Read the docs, then build it into the data project for every invoice at once.",near:true},{t:"Two days in a sandbox, on 200 of your own invoices, checked against what was typed.",ok:true},{t:"A year's pilot on every team's documents, so the result covers the whole university."}],
    why:"Adapt means small, on your own data, in a sandbox, for a set time. Two days on 200 invoices showed where the functions work and where they don't (188 matched; most of the 12 were poor scans), before anything reached the data project. Going straight to every invoice skips what the trial would have taught. Which feature would you try this way first?"}
  }}};
