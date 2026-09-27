/* Learning Data: "Pause and think" for Silent change, in English. Keep the keys in step with think.es.js.
   The film stops after four chapters (night, bronze, halves, contract) to ask one question. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is the lab of The Inner Life of Data
   that teaches the same idea; the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "night":{stop:"refine",q:"The test failed at 2:40 am. Why did nobody need to be woken up?",
    opts:[{t:"The build stopped, and yesterday's good numbers stayed, labelled as yesterday's.",ok:true},{t:"The test fixed the data by itself."},{t:"The alert was switched off for the night."}],
    why:"A failing test skips everything downstream, so the last good data stays, with a note that says how old it is. Nothing wrong reached anyone, so the alert could wait until morning."},
  "bronze":{stop:"capture",q:"Bronze kept the rows with the new status. Why is that better than dropping them?",
    opts:[{t:"Nothing is lost: once the new status has a meaning, the platform rebuilds from what arrived.",ok:true},{t:"Dashboards read straight from bronze."},{t:"Databricks can't delete rows."}],
    why:"Bronze keeps what arrived, even a value nothing downstream understands yet. After the fix, silver and gold are rebuilt from it, without asking the student system to send the data again."},
  "halves":{stop:"meaning",q:"Who should decide whether a waitlisted student counts as enrolled?",
    opts:[{t:"The business owner of what “enrolled” means.",ok:true},{t:"The data team that found the problem."},{t:"The team that added the new status."}],
    why:"What a value means is a business decision. Ben's team knew what changed, and Sam's team can build the rule, but only the owner of the definition can say what counts. Mei decided: enrolled means holding a seat on census date."},
  "contract":{stop:"gold",q:"When is a data contract checked?",
    opts:[{t:"On every load, and on every proposed change before it ships.",ok:true},{t:"Once, when both sides sign it."},{t:"Only when a test fails."}],
    why:"A contract helps only if it keeps being checked. The platform checks every load, and the student system's test environment checks every proposed change before release. That's how the next change reached both sides as a conversation, not a surprise."}}}};
