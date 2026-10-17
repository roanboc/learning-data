/* Learning Data: "Pause and think" for Lists everyone uses, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (typed, home, change, people), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "typed":{q:"A count of people by country lists Linh's country three times. Why?",
    opts:[{t:"She has lived in three countries."},{t:"Three systems spell her country three ways, Vietnam, Viet Nam and VN, and no shared list says they're one value.",ok:true},{t:"The count adds each person once for every system."}],
    why:"Each system typed its own list of countries, so one country has three spellings, and a count groups by spelling. One list of countries, with one code for each, makes it one row. Where have you seen the same thing spelled two ways in one report?"},
  "home":{q:"HR calls Linh's role Casual Academic, payroll CAS, and the learning platform tutor. What does Jun's mapping do?",
    opts:[{t:"It renames the role to tutor in every system."},{t:"It writes down that each system's name means one value in the list, tutor, so each system can keep its own name.",ok:true},{t:"It deletes the names that don't match."}],
    why:"Systems keep their own codes. The list holds the one value they all mean, with its owner and the date it applies from, and the mapping says which name means which, so nobody has to change a system to agree on a meaning. In your organisation, who would own the list of role types?"},
  "change":{q:"HR's new name for the role applies from 1 January. Why is the old name ended, not deleted?",
    opts:[{t:"Deleting it would break the spreadsheet."},{t:"Linh's past contracts still use it, so it stays valid for the dates it applied.",ok:true},{t:"HR might change its mind."}],
    why:"A list's values have dates: each applies from a day, and can end on a day, so old records still read correctly. The change arrives as a pull request, and the list's owner approves it before it applies. Which list you know has changed a name over the years?"},
  "people":{q:"Why does the form stop asking for a title, Mr, Mrs, Miss, Ms or Mx?",
    opts:[{t:"Titles take too much room to store."},{t:"A title can say whether someone is married, and the university doesn't need it, so it isn't asked.",ok:true},{t:"Only one title can be chosen."}],
    why:"Lists about people stay short and inclusive, and each is asked for only with a purpose, like the gender the government asks universities to report, with a line for another term and a choice not to say. Think of a form you've filled in: which question had no purpose you could see?"}
  }}};
