/* Learning Data: "Pause and think" for One small change at a time, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (measure, automate, leader), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  measure:{q:"Before she changes anything, Ivy times each step of her Monday refresh. Why measure first?",
    opts:[{t:"So Helena can see how long the refresh takes, and compare Ivy's time with what the rest of the team takes."},{t:"So she can find the slowest step and automate it straight away, before she touches the rest of the refresh.",near:true},{t:"So she knows where the two hours go, and can check that each change saves time without losing anything.",ok:true}],
    why:"Six steps, a hundred and twenty minutes: now Ivy can ask of each step who needs it, and check every change against the number. Like the staff at Castle Street, she starts with her own corner of the work. Automating the slowest step first would only make a muddle faster, and the measure is hers, never a comparison with anyone else. Which step of your week would you time first?"},
  automate:{q:"Ivy writes the four steps left as one checklist, and Jun follows it to the same result, before she automates anything. Why that order?",
    opts:[{t:"A checklist is quicker to write than a job, so it leaves more of her Thursday learning time for teaching."},{t:"The same steps every time show what changes, and only a way that works by hand is worth automating.",ok:true},{t:"A checklist lets anyone do the work, so once Jun has followed it, the new checks need no review by Sam.",near:true}],
    why:"Automate a muddle, and you get a faster muddle. The checklist makes every Monday the same, so Ivy can see what changes, and Jun's Monday shows that anyone can follow it. Anyone can do the work, but each new check still goes in through Sam's review, and runs beside her own for a Monday before her hand check goes. What would you write down before you automate it?"},
  leader:{q:"Helena made none of these changes herself. What was her part?",
    opts:[{t:"She asked what was in the way, gave the time and kept it free, and showed the small wins, naming who did them.",ok:true},{t:"She set the refresh a target of ten minutes, and checked each Tuesday that Ivy was getting closer to it."},{t:"She gave the time and kept it free, and told Ivy which two steps to drop, so the refresh would be quicker.",near:true}],
    why:"Questions, time and a chart. She asked what was in the way each Tuesday, and made room in Sam's week for the reviews; she gave Thursday afternoons, and let no meeting take them; and on 7 October she put Ivy's chart in front of the people who use the product, and named Ivy, Jun and Sam. Ivy chose what to drop: the person who does the work improves it. No target, no programme, no speech. What's in the way of someone on your team?"}
  }}};
