/* Learning Data: "Pause and think" for Learning while doing, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (beside, teach, two), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  beside:{q:"For six weeks, Ivy and Jun finish one small change a day on the team's real models. Why is that a good way to learn?",
    opts:[{t:"The real models are too risky for a newcomer, so each change is practice on a copy until she's ready for the real work."},{t:"Each change is real work she can finish in a day, reviewed by someone else, so she learns by doing, a step at a time.",ok:true},{t:"Each change is real work she can finish in a day, and Jun reviews it himself, so nobody else needs to look at it.",near:true}],
    why:"Jun didn't hand Ivy a course: he opened the team's real models. Each day they finished one small change, a check, a description, a column's name, and because both of them wrote it, Noor or Sam reviewed it before it went in. Twenty-five in six weeks; by the sixth, she wrote them on her own. What small change to your real work could a newcomer finish beside you this week?"},
  teach:{q:"Ivy teaches the team what one sensor count means. How does teaching it help Ivy herself?",
    opts:[{t:"Getting ready shows her what she can't explain yet, so she leaves those parts out and keeps her twenty minutes clear.",near:true},{t:"It doesn't help her much: the team learns from it, but she'd learn more by spending those hours reading on her own."},{t:"Getting ready shows her what she can't explain yet, so she asks and learns it, and teaching it makes it last.",ok:true}],
    why:"Getting ready, Ivy found two things she couldn't explain, and asked Sam: that's when she really learned them. Logan Fiorella and Richard Mayer found the same: students who prepared to teach a lesson, then taught it, remembered more of it later than those who only studied it. And now the whole team reads a count the same way, not only Sam. What have you learned lately that you could teach in twenty minutes?"},
  two:{q:"By 30 June, every job that must keep running has at least two names. How did the team get there?",
    opts:[{t:"They paired on each job that had one name, a job at a time, and wrote each one down, step by step, as they went.",ok:true},{t:"They wrote each job down, step by step, so anyone could run it from the notes without ever having done it.",near:true},{t:"They hired someone new for each job that had one name, so the people who ran them alone could hand them over."}],
    why:"Five of the nine jobs had only one name. So the team paired on those too, a job at a time, and wrote each one down, step by step. A second name is someone who has done the job beside the one who knew it, with the steps written down for next time. By 30 June every job had two names, and anyone could be away. Which job on your team has only one name?"}
  }}};
