/* Learning Data: "Pause and think" for Many hats, one picture, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (parts, page, shape), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  parts:{q:"Ivy spends a few days with each part of the team's work. What is she there to learn?",
    opts:[{t:"Each of their jobs, well enough to do it alone, so she can stand in for anyone who is away from the team."},{t:"Enough of each part to follow it, its words and tools, so she can show each keeper how to do their part better.",near:true},{t:"Enough of each part to follow it: its words, its tools and its worries, and who uses it, for which decision.",ok:true}],
    why:"Each of them is deep in one part, and right about it. Ivy isn't there to take their place or to judge their work: she learns enough of each to follow, their words, their tools and what worries them, and asks each the same question: who uses this, and for which decision? Which part of your team's work could you not follow today?"},
  page:{q:"On Ivy's page, the bookings meet the counts. Why would 14 rooms have dropped out of Graham's answer?",
    opts:[{t:"The timetable renumbered them after their sensors went in, so the two named them differently, and a join by name lost them.",ok:true},{t:"Their sensors were put in the wrong rooms, so the two named those rooms differently, and a join by name lost them.",near:true},{t:"Nobody booked those 14 rooms in March, so there were no bookings to put beside the people the sensors counted in them."}],
    why:"Nobody was wrong: the timetable was right, and so were the sensors. Fourteen rooms were renumbered in the timetable after their sensors went in, so the two named them differently. Joined as they were, those rooms would drop out without a word, and Graham's answer would cover 172 rooms, not 186. Only someone who put the two side by side could see it. Where do two of your sources name the same thing two ways?"},
  shape:{q:"Ivy didn't need to know the timetable as Mei does, or the sensors as Sam does. What did she need?",
    opts:[{t:"Depth in every part the team keeps, from the timetable to the models, and enough of the business to join them.",near:true},{t:"Depth of her own, in statistics, and enough of the business, the systems and the data to join them.",ok:true},{t:"A manager's view of the whole team, leaving her statistics behind, so the specialists can do the deep work."}],
    why:"That's the T: one deep stroke, her statistics, and a wide bar across the top, enough of the business, the systems and the data to join them. Nobody holds every part deeply, and nobody needs to: Mei and Sam stayed essential, and matched the 14 rooms in a day. Someone had to see across them. What's your deep stroke, and what's on your bar?"}
  }}};
