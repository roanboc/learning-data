/* Learning Data: "Pause and think" for Explaining so people can decide, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (first, turns, unknown), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  first:{q:"Ivy's first draft ran to twelve pages, in the order the work was done. Why does the page she sends open with the decision?",
    opts:[{t:"Because the decision shows the work was done well, so it comes first, with the method and its checks just under it.",near:true},{t:"Because its readers start there: they decide on each paper, so the page puts the choice first and the reasons under it.",ok:true},{t:"Because the University Council asks for short papers, and a decision takes fewer words to say than a method does."}],
    why:"The University Council's members read a pile of papers and decide on each, so the page starts where they start: the decision, then the answer to the agreed question in one sentence, then the lines it rests on. The method and the other charts are still there, at the back, for anyone who wants them. What would the first line of your next report say?"},
  turns:{q:"The week's average says rooms are booked 38% of the time. What does the heat map show that the average hid?",
    opts:[{t:"That rooms are booked less than people thought, so a new building could be smaller than the forty rooms it planned."},{t:"That rooms are full at the peak and empty most other hours, so the academics were right and Facilities were wrong.",near:true},{t:"That 93% of rooms are booked from ten to two, Tuesday to Thursday, and about one in five at most of the other hours.",ok:true}],
    why:"Both sides were right: the academics at the peak, Facilities in the empty corridors on Monday mornings and Friday afternoons. The average, 38%, describes no hour of the week, as Daniels's average pilot described no flyer. One picture of the whole week shows what the decision turns on. Which of your averages hides a peak?"},
  unknown:{q:"Mei, who wasn't in the work, stops at the word utilisation. What does the page do about it?",
    opts:[{t:"It says booked and used instead, each with what it means in a line, so every reader takes the numbers the same way.",ok:true},{t:"It keeps utilisation and adds what it means in a line, since the word is right and its readers only need to learn it.",near:true},{t:"It leaves the word as it is, since Mei doesn't sit on the University Council, and its members will read it as Ivy meant."}],
    why:"To Mei, utilisation meant seats filled; on the page it meant rooms booked. A reader who takes a word another way reads another number. So the page uses its readers' own words, booked and used, each defined in a line, and everyone gets the same page with the same numbers. Who could you try your next page on, who wasn't in the work?"}
  }}};
