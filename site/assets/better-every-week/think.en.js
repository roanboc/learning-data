/* Learning Data: "Pause and think" for Better every week, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (six, kept, written), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  six:{q:"Noor finds that a request waits six working days for its first question back. What does the team do next?",
    opts:[{t:"Set each person a target of one day for every request they're given, and check it in the tracker every Friday."},{t:"Break the request's path into its steps, and question each one: why does every request wait for Monday's planning?",ok:true},{t:"Change the form, the planning day and the list all at once, so the wait comes down as fast as it possibly can.",near:true}],
    why:"They start where the pocket card does: break the job down, then question every detail. That's how they find the wait: every request sat until Monday's planning. Changing three things at once might cut the wait too, but nobody could tell which change helped, or keep only that one. A target for each person would push the wait onto people instead of taking it out of the work. Where does work wait longest in your team?"},
  kept:{q:"A week later, the team drops the ten minutes every morning. Why do they say so out loud?",
    opts:[{t:"So Helena can note who proposed it, and ask that person to think harder before they propose another change."},{t:"Because it cost more than it found: ten minutes a day from the whole team, and nothing new on the list.",near:true},{t:"So nobody goes on doing it out of habit: a dropped change is a result, and everyone knows it has stopped.",ok:true}],
    why:"Dropped is a result too. Said out loud, everyone knows the morning ten minutes have stopped, so nobody keeps them up out of habit. It's true that it cost more than it found, but that's why they dropped it, not why they said so. And nobody is blamed: the change was tried for a week, and the week gave its answer. What does your team still do only out of habit?"},
  written:{q:"Each kept change is written into its procedure that same day, with the date and why. What does that give the team?",
    opts:[{t:"It lasts: someone new learns it from the page, and it holds while the person who thought of it is away.",ok:true},{t:"It shows the wins: the fortnightly review can tell the people who asked what changed in the team, and why.",near:true},{t:"It settles the step: once a change is written into a procedure, the team keeps doing it that way for good."}],
    why:"So it lasts: a change that lives only in someone's head goes with them on leave, and someone new never learns it. The fortnightly review does show the small wins, but showing them doesn't keep a change going. And nothing is settled for good: like the pocket card's last step, each page is the best way so far, until a Friday finds a better one. Which of your team's ways of working live only in someone's head?"}
  }}};
