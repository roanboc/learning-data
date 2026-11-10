/* Learning Data: "Pause and think" for The question behind the request, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (listen, agree, answer), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  listen:{q:"Graham asked for a dashboard of room use by Easter. What did Helena and Noor need to find out first?",
    opts:[{t:"The decision he'll make with it, by when, who else decides, and what would change his mind.",ok:true},{t:"The charts he'll want on it, by when, who else will open it, and what would make him use it.",near:true},{t:"Which data the team already holds on rooms, so the dashboard could be built before Easter."}],
    why:"A request names someone's guess at a solution. Behind Graham's dashboard was a decision: whether to ask the University Council, which decides on 24 June, for a new teaching building, and what would change his mind. A few open questions, and then mostly listening, found it in half an hour. What will the next person who asks you for a report decide with it?"},
  agree:{q:"Near the end, Graham stopped Helena at one word: “used”. Why did that word matter so much?",
    opts:[{t:"It showed he'd changed his mind: he no longer wanted a dashboard, so the team could drop it."},{t:"It decided the data: by “used” he meant rooms booked, so the timetable alone would answer him.",near:true},{t:"It decided the data: by “used” he meant people in the room, so bookings needed head counts too.",ok:true}],
    why:"By “used”, Graham meant people in the room, and a booking isn't use. That one word decided the data: the timetable's bookings, beside the head counts from each room's sensor. It went on the page in his words, under the question, beside his request. Which word in the last request you got could mean two things?"},
  answer:{q:"Across the week, the rooms were booked 38% of the time; at the peak, 93%. How did the agreed question help?",
    opts:[{t:"It asked about the whole week, not some hours, so the team showed the average the peak had hidden.",near:true},{t:"It asked about some hours, not only the week, so the team found the peak the average had hidden.",ok:true},{t:"It set a date of Easter, so the team gave Graham a quick first number, and could refine it later on."}],
    why:"The question, too few rooms or too few at some hours, sent the team to the hours: 93% of rooms booked from 10:00 to 14:00, Tuesday to Thursday, against 38% across the week. The academics were right about the peak, and Graham about Monday mornings: the week's average had hidden both. What would your last answer look like at its busiest hour?"}
  }}};
