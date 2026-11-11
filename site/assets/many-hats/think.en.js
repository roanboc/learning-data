/* Learning Data: "Pause and think" for Many hats, one picture, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (parts, page, shape), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  parts:{q:"Helena gives Ivy a month with every part of the team's work. What is that month for, as Helena sees it?",
    opts:[{t:"So Ivy can learn each job well enough to stand in for anyone on the team who is away."},{t:"So Ivy can learn enough of each part to follow it, and show each keeper how to do it better.",near:true},{t:"So Ivy can learn enough of each part to follow it, and see what falls between people's hats.",ok:true}],
    why:"Each of them is deep in one part, and right about it, and each wears more hats than their title says. Helena doesn't want a stand-in or a judge: she wants someone who learns enough of each part to follow it, and asks each who uses it, for which decision, so that what falls between the hats gets seen. Who in your team could see across its parts today?"},
  page:{q:"On Ivy's page, the bookings meet the counts. Why had nobody seen that 14 rooms would drop out?",
    opts:[{t:"The rooms were renumbered in one system and not the other, and the join sat between two people's hats.",ok:true},{t:"The sensors in those rooms were put in the wrong place, and the join sat between two people's hats.",near:true},{t:"Nobody booked those 14 rooms in March, so there were no bookings to set beside what the sensors counted."}],
    why:"Nobody was wrong: the timetable was right, and so were the sensors. Fourteen rooms were renumbered in the timetable after their sensors went in, and the join sat between Mei's hats and Sam's, so checking it was nobody's job. Joined as they were, those rooms would drop out without a word. Helena then gave the join an owner. What in your team sits between two people's hats?"},
  shape:{q:"Helena didn't need Ivy to know the timetable as Mei does, or the sensors as Sam does. What did she need from her?",
    opts:[{t:"Depth in every part the team keeps, from the timetable to the models, and enough of the business to join them.",near:true},{t:"Her own depth, in statistics, and enough of the business, the systems and the data to join them.",ok:true},{t:"A manager's view of the whole team, leaving her statistics behind, so the specialists do the deep work."}],
    why:"That's the T: one deep stroke, her statistics, and a wide bar across the top. No leader should expect anyone to hold every part deeply: Mei and Sam stayed essential, and matched the 14 rooms in a day. But someone has to see across them, and a leader makes sure someone does. Whose bar in your team would you widen first?"}
  }}};
