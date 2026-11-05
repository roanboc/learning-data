/* Learning Data: "Pause and think" for One word, one home, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (none, read, change, agree), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series' labs and scenarios are its own, for all its films
   (assets/data-governance/), so no question has a "stop"; the page's .player data-labs leads to them. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "none":{q:"Each of the five glossaries was made for a good reason. Why are five worse than one?",
    opts:[{t:"Each is trusted by its own team, so all five stay right, but reports can't be compared.",near:true},{t:"Nobody knows which to trust, so everyone keeps their own, and a change reaches only one.",ok:true},{t:"Most of them are wrong, so the reports their teams build from them are wrong too."}],
    why:"Each glossary is right for the team that wrote it. But between them they hold three meanings of award, two can only be found by the people who made them, and the biggest is never opened. When award changed on Monday, one changed and four never heard. How many places define a key word where you work?"},
  "read":{q:"Planning's spreadsheet still needs the word award. What should it do now?",
    opts:[{t:"Copy the glossary's definition into its own tab, and check it against the glossary each term.",near:true},{t:"Keep its own words, since Planning wrote them first and the glossary copied them."},{t:"Link to the term in the glossary, so it reads the words instead of keeping its own.",ok:true}],
    why:"A copy is fine only when it's made from the glossary, one way, and checked: the data team's copy says where its words came from, and it's checked against the glossary every night. A copy kept by hand drifts, as four did on Monday. Which of your tools keeps its own copy of a definition?"},
  "change":{q:"The new words say “at least 6 credit points”. Where should the 6 live?",
    opts:[{t:"In one place, as a business rule with an owner, which every report reads.",ok:true},{t:"In the glossary's words, which every report copies when it's built.",near:true},{t:"In each report that counts awards, worked out its own way."}],
    why:"A number in a meaning is a rule too. Kept once, as a business rule Mei owns, every report reads the same 6, and when the words change, the rule changes in one place. Look at a definition you use: does it hide a number?"},
  "agree":{q:"Who decided that a microcredential counts from 6 credit points?",
    opts:[{t:"The data team, when it kept the rule in one place for every report to read."},{t:"Mei and the faculties, who argued it out in a workshop; the glossary keeps what they agreed.",ok:true},{t:"Mei alone, as the term's owner; the faculties were told once the glossary was updated.",near:true}],
    why:"The glossary keeps the agreement; it doesn't make it. People argue the words out, and the term's owner approves them. And the people who kept the other glossaries lose something they built, so they're thanked, and their best definitions move into the one that stays. Whose work would you bring into the one glossary?"}
  }}};
