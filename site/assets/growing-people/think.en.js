/* Learning Data: "Pause and think" for Growing people, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (goals, tuesday, next), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  goals:{q:"Ivy has just joined the team, in her first job. How do her first goals come about?",
    opts:[{t:"Helena sets three from the team's measures, so that Ivy's growth adds to what the team is judged on.",near:true},{t:"Helena hands her a list on her first day, so that she knows from the start what she'll be graded on."},{t:"Ivy writes three of her own in her first week, they agree them, and Helena gives her real work to grow on.",ok:true}],
    why:"Ivy wrote her own goals and agreed them with Helena on Friday 5 March, as the teachers in Japan chose the goal of their lesson. Helena's part was real work to grow on: Graham's question about the teaching rooms. The team's measures stay the team's, and never become her targets. What would someone new on your team choose to grow in, if you asked?"},
  tuesday:{q:"On Tuesday 13 April, Helena wants to tell Ivy that her review of the agent's draft was good. What does she say?",
    opts:[{t:"Last Wednesday you checked the draft against Graham's word for “used”, so his answer counts people.",ok:true},{t:"You're brilliant at reviews, and I'm proud of you, so keep doing them just the way you did that one.",near:true},{t:"Nothing for now: it waits for her review at the end of the year, so the feedback is complete and fair."}],
    why:"Helena's feedback has three parts: the situation (last Wednesday's review), what Ivy did (she checked the draft against Graham's own word) and its effect (his answer counts people in rooms, not bookings). Praise about who someone is helps least: Kluger and DeNisi found feedback did worst when it turned attention from the task to the person. What did someone on your team do this week, and what did it change?"},
  next:{q:"On Tuesday 20 July, Helena and Ivy have her mid-year conversation, with all three goals met. What do they talk about?",
    opts:[{t:"A grade for her half year, from the three goals she met, written down and kept for the end of the year."},{t:"What went well, what she'd do differently, what she wants next, and what she needs to get there.",ok:true},{t:"Everything she did well and badly since March, item by item, so the record of her half year is complete.",near:true}],
    why:"They look back at her half year, and forward: Graham's page went well, she'd ask for review earlier, and she wants to make her Monday refresh better and to teach what she learns. A growth conversation looks forward, and by December her next goal is one she chose: to coach the next graduate. Where does someone on your team want to go next?"}
  }}};
