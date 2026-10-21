/* Learning Data: "Pause and think" for One word, one home, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (none, read, change, agree), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "none":{q:"Each of the five glossaries was made for a good reason. Why are five worse than one?",
    opts:[{t:"Five take too long to read, so people stop reading them."},{t:"Nobody knows which to trust, so everyone keeps their own, and a change reaches only one.",ok:true},{t:"Most of them are wrong, so their teams' reports are wrong too."}],
    why:"Each glossary is right for the team that wrote it. But between them they hold three meanings of award, two can only be found by the people who made them, and the biggest is never opened. When award changed on Monday, one changed and four never heard. How many places define a key word where you work?"},
  "read":{q:"Planning's spreadsheet still needs the word award. What should it do now?",
    opts:[{t:"Copy the glossary's definition into its own tab, and update it each term."},{t:"Keep its own words, since Planning wrote them first."},{t:"Link to the term in the glossary, so it reads the words instead of keeping its own.",ok:true}],
    why:"A copy is fine only when it's made from the glossary, one way, and checked: the data team's copy names where its words came from, and a sync checks it every night. A copy kept by hand drifts, as four did on Monday. Which of your tools keeps its own copy of a definition?"},
  "change":{q:"The new words say “at least 6 credit points”. Where should the 6 live?",
    opts:[{t:"In one place, as a setting the code reads, beside the words that say it.",ok:true},{t:"In each model that counts awards, written into its code."},{t:"Only in the glossary's words, for people to read."}],
    why:"A number in a meaning is a rule too. Jun keeps it as one setting in the project, so every model reads the same 6, and a later change to the words changes the code in one place. Look at a definition you use: does it hide a number?"},
  "agree":{q:"Who decided that a microcredential counts from 6 credit points?",
    opts:[{t:"The glossary, when the term was updated on Monday."},{t:"Mei and the faculties, who argued it out in a workshop; the glossary keeps what they agreed.",ok:true},{t:"The data team, when it added the setting."}],
    why:"The glossary keeps the agreement; it doesn't make it. People argue the words out, and the term's owner approves them. And the people who kept the other glossaries lose something they built, so they're thanked, and their best definitions move into the one that stays. Whose work would you bring into the one glossary?"}
  }}};
