/* Learning Data: "Pause and think" for Rules with a home, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (split, expect, std, onto), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). A question's "stop" is the lab of the series it opens, on the
   series' labs page (the page's .player data-labs is "../labs/"); a question without one has no lab link. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "split":{stop:"rule",q:"Day one's rule sat on the wall between the network and retail, and nobody owned it. Why is it really two rules?",
    opts:[{t:"The network and retail disagree about what it means."},{t:"Each side does its own part: the network replaces the estimate and sends it on, retail corrects the bill, and the replaced reading crosses on the agreed list.",ok:true},{t:"Two short rules are easier to test than one long one."}],
    why:"A rule that crosses a domain's edge is two rules, one on each side, joined by what crosses. On the wall, the rule belonged to no one, and the script that kept it failed for months without anyone noticing. Split, each rule has an owner who can fix it: Grace for the network's, the head of retail for retail's. Which of your rules lives between two teams?"},
  "expect":{q:"Where do the quality expectations for the meter readings come from?",
    opts:[{t:"From the data team's standard checklist."},{t:"From the step that uses them: its service level, its own steps and the rules attached to it.",ok:true},{t:"From whatever the checking tool can measure."}],
    why:"The read step sets them. Its service level gives timeliness: an estimate replaced within two working days. Its own steps give completeness: every estimate replaced, or explained. Another rule attached to it gives validity: every reading marked actual or estimated. Which step's service level sets what your data must meet?"},
  "std":{stop:"rule",q:"In ArchiMate 4, the standard the map follows, what is retail's rule, and what joins it to billing?",
    opts:[{t:"A business rule element, drawn inside the billing process."},{t:"A requirement, which billing realises: the step applies the rule, and the rule sits beside it.",ok:true},{t:"A goal, which billing helps to reach."}],
    why:"ArchiMate has no element called a rule, so the map makes data rules and business rules two kinds of requirement, one of the motivation elements. Its reason, the regulator's retail code, a driver, influences it; billing realises it; its owner and the data objects it applies to are associated with it. ArchiMate says where a rule sits, not how it's checked. Which of your rules could you place on a map this way?"},
  "onto":{q:"The rules and concepts are written as an ontology, ready for OWL. Why doesn't OWL find the uncorrected bill?",
    opts:[{t:"The ontology has no rule about bills."},{t:"OWL reasons only from what is said: to it, a correction that never happened is unknown, not a fault. Finding the bill is the tracking table's job.",ok:true},{t:"OWL can't read the billing system's data."}],
    why:"OWL works in an open world: what isn't said may still be true, so a correction that never happened is simply unknown. A data test wouldn't find it either: the data can all be right while a bill goes uncorrected. The tracking table generated from retail's rule lists every bill not corrected on the next bill, for the billing team each morning. In your work, what needs reasoning, and what needs only a list someone reviews?"}
  }}};
