/* Learning Data: "Pause and think" for The draft and the decision, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (assumed, frame, review), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  assumed:{q:"The agent's draft was tidy, and all four of its tests passed. Why was its answer still wrong?",
    opts:[{t:"It had too few tests: with more of them, run on the same data, it would have caught the booked hours nobody came to.",near:true},{t:"It took a booked hour as a used hour, and its tests check the data's form, not what Graham means by used.",ok:true},{t:"The sensors' feed was late that week, so the agent had no counts to use, and it fell back on the timetable's bookings."}],
    why:"The tests passed because they check the data's form: no room counted twice, no hour left out. No test can know what Graham means by used: people in the room, not a booking. The agent said what it assumed, and that line is where Ivy found it. What would your tests miss if a word meant something else?"},
  frame:{q:"Before she asks again, Ivy frames the work. What does she give the agent the second time?",
    opts:[{t:"The same task, worded more carefully, with an example of the result she expects and a time by which she needs it."},{t:"The decision, the words and what counts, and she lets the agent write the definition of room use for her.",near:true},{t:"The decision it serves, the words as the glossary has them, and what counts: teaching hours, booked and used.",ok:true}],
    why:"Three things, not one: the decision it serves (whether to ask the University Council for a new building), the words to use (room use, as the glossary has it, approved by Graham as its owner) and what counts (teaching hours, with booked and used side by side). The definition starts in the glossary, so every draft starts from it. What does your next request to an agent leave out?"},
  review:{q:"The agent wrote the first draft, and Ivy changed and checked it. Who approves her pull request?",
    opts:[{t:"Jun, who builds the team's models: nobody approves their own work, and never the agent, whoever drafted it.",ok:true},{t:"Ivy herself, since she checked the draft by hand against one room's week and keeps the reasoning in it.",near:true},{t:"Graham, as the owner of room use, since every change to the model must pass him before it reaches his page."}],
    why:"Ivy is the author, so she answers for it, whoever wrote the first draft, and nobody approves their own work: not Ivy, and never the agent. Jun reviews it and asks which room she checked by hand. Graham owns the word in the glossary; he's told what the change touches, and doesn't review the code. Who reviews your work, and could they follow your reasoning?"}
  }}};
