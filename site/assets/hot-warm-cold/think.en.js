/* Learning Data: "Pause and think" for Hot, warm, cold, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (cold, warm, hot), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "cold":{q:"Asked in August, Finance wanted spending live, to the minute. Why does a view worked out each night serve them better?",
    opts:[{t:"Money moves between budgets once a month, so yesterday's figures arrive in time, for far less.",ok:true},{t:"Yesterday's figures are fresh enough, because a stream can't read the finance system's ledger.",near:true},{t:"Finance asked for it live, so the nightly view only stands in until a stream is built for them."}],
    why:"Noor didn't take Finance's answer from a question: she looked at what happens next. Spending is talked over once a month, and only then does money move, so yesterday's figures are in time, and a nightly run costs a small part of a stream. The platform could stream it; the need doesn't ask for it. Where you work, which data is acted on days or weeks after it changes?"},
  "warm":{q:"Contract changes now come in every five minutes. Why not bring each one in within a second?",
    opts:[{t:"The HR system only sends its changes in batches, never one by one as they're made."},{t:"A second would be in time too, and it costs about the same as a pipeline every five minutes.",near:true},{t:"Coordinators approve claims all morning, so five minutes is in time, and costs far less.",ok:true}],
    why:"A coordinator approving claims until noon on Monday acts within minutes or hours, not seconds. Every five minutes is in time for that, and a pipeline that runs every five minutes costs far less than one that never stops. The HR system already pushes each change as it's made; how often the pipeline runs is the business's call. Where you work, who acts within the hour?"},
  "hot":{q:"A rule now holds a pay within a second of a suspicious bank account change. Why does the nightly file still come in?",
    opts:[{t:"The rule needs a second look: the file checks each change again at night, in case it missed one."},{t:"An event carries only what changed; the full record and every correction come in the file.",ok:true},{t:"An event carries only what changed, so the nightly file is kept only for the auditors to read.",near:true}],
    why:"Each event says only what changed, the moment it changed. The full pay record, and every correction made later, still arrive in the nightly file, so hot never comes alone: it needs the cold path beside it, and it costs the most, because it never stops. Where you work, is there an action a machine must take within a second?"}
  }}};
