/* Learning Data: "Pause and think" for When someone falls behind, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (cause, gap, time), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  cause:{q:"Tomás's work falls behind the team's. Before judging, what does Helena look for first?",
    opts:[{t:"What he could do better on his own: more hours, more care, and more effort in the weeks that went back.",near:true},{t:"What surrounds his work: what he was taught, what's in his way, and what he's asked to do.",ok:true},{t:"Which of his colleagues is fastest, so she can show him the pace the rest of the team keeps."}],
    why:"Mager and Pipe asked whether he could do it if he had to, and Gilbert said to look at what surrounds the work before the person. Helena asked Tomás what was in his way, and found three causes he couldn't clear alone: nobody had taught him the new tools, his strength was the readers more than the code, and a hard time at home. Whose work around you might be held back by what surrounds it?"},
  gap:{q:"From February to June, Tomás went from 40 days to 35, and the team from 41 to 24. How is his gap read?",
    opts:[{t:"Against the team's own change, since the new tools lifted everyone, and kept between him and Helena.",ok:true},{t:"Against the fastest person on the team, since that shows what the new tools make possible for him.",near:true},{t:"Against the 40 days he took in February, since he improved, so there is no real gap to talk about."}],
    why:"He did improve, but the team improved faster, because the tools lifted everyone. So his gap is read against the team's own change, not Helena's expectations, never against a colleague, and it stays between the two of them. What would your team's own change say about someone you worry about?"},
  time:{q:"By December the gap has closed by about half, and the gains still come unevenly. What does Helena tell Tomás?",
    opts:[{t:"That the gap is closed enough by now, so the plan can stop and his load can go back to normal.",near:true},{t:"That next time October goes badly, the team will take his reports and give them to someone else."},{t:"That the plan goes on into 2028, and if building isn't his strength, they'll talk about another role.",ok:true}],
    why:"Lifting someone's work can take months, or even years, and it comes unevenly: September went well, October went back twice. Helena says plainly that the plan goes on, and where it may lead, so he hears it now, not later. His measures stay his own, and his reasons private. What would you say honestly, now, to someone whose plan isn't finished?"}
  }}};
