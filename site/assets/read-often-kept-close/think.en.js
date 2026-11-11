/* Learning Data: "Pause and think" for Read often, kept close, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (tiers, records, years), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "tiers":{q:"Cloud storage tiers are named hot, cool, cold and archive. What decides which tier a file belongs in?",
    opts:[{t:"How fresh it must be: hot when someone acts on it at once, archive when years later.",near:true},{t:"How old it is: every file moves down one tier each year, whoever still reads it."},{t:"How often it's read: often, where reading is cheap; rarely, where keeping is cheap.",ok:true}],
    why:"The tiers sound like data's temperature, but they answer another question: not when someone acts on the data, but how often anyone reads it. Each tier down costs less to keep and more to read, so what's read often stays where reading is cheap. Where you work, what's kept in the costliest storage but rarely read?"},
  "records":{q:"Pay records more than a year old now sit in the archive tier, the cheapest to keep. What does the university give up for that?",
    opts:[{t:"Speed: an archived year takes hours to bring back before it's read, which is fine for an audit.",ok:true},{t:"Nothing: an archived year reads as fast as a recent one, since the table knows where its files are.",near:true},{t:"The right to delete them: once archived, the records must be kept for good, past seven years."}],
    why:"The archive tier is the cheapest place to keep data, and the slowest to read: a file there can't be read until it's brought back, which takes hours. The table is told which files are archived, so a query says which to bring back; it doesn't make them quick. For pay records read once in a while, for an audit, that's a fair trade. Where you work, what's kept for years but rarely read?"},
  "years":{q:"Seven years after Linh's contract ends, her pay record is deleted. What decides that it's seven years?",
    opts:[{t:"The platform: the archive tier deletes any file it has held for seven years, on its own."},{t:"The law and the business, and the rule is written into the pay records' contract.",ok:true},{t:"How often it's read: once nobody has read it for a while, the record can be deleted.",near:true}],
    why:"How often data is read decides where it's kept; how long it's kept at all is set by the law and the business. Australian law asks for pay records to be kept seven years, and the rule goes into the data's contract, so a deletion runs on a date set in advance. Where you work, who decides how long each kind of data is kept?"}
  }}};
