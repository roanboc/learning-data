/* Learning Data: "Pause and think" for Proof it held, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (review, gap, reads, ends), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The module's labs come later, as one set, so no question
   has a "stop" yet, and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "review":{q:"Elena moved to another project in December. Why did she keep her place in the study's group?",
    opts:[{t:"Her confidentiality agreement was current, and that alone keeps a place in the group.",near:true},{t:"The review was set to keep everyone whose reviewer didn't answer within a week."},{t:"She still worked at the university, so nothing told the directory she'd moved.",ok:true}],
    why:"Moving to another project isn't something the directory hears of: her account kept working, and so did her place. A current confidentiality agreement is needed to stay in the group, but it takes no one out who has moved on. The review is the net that catches it, and from now on Anil tells Yusuf the day anyone leaves. Where you work, what happens to someone's access when they change teams?"},
  "gap":{q:"From half past nine on 8 January, the new mobile column was masked. What masked it?",
    opts:[{t:"Mei gave it the class direct, and the policy for direct covered it at once.",ok:true},{t:"Sam wrote a mask for that one column, as soon as the alert reached him."},{t:"Classification found it a phone number, and that finding masks it by itself.",near:true}],
    why:"The policy follows the class, not the column: once Mei, its owner, classed it direct, the policy for direct masked it, with no new rule written. Classification only says what a column looks like; its owner decides its class. Where you work, who decides the class of a new column, and how soon?"},
  "reads":{q:"How does the team know nobody saw a mobile number while the column had no class?",
    opts:[{t:"Nobody reported seeing one, and the agreement forbids taking any data out."},{t:"The audit log shows only the night load read it, and lineage shows it went nowhere.",ok:true},{t:"The policy for direct masked every new column until its owner had classed it.",near:true}],
    why:"That nobody reported anything is hope, not proof. The policy couldn't help either: it hides a class, and the column had none yet. The proof is in two records the platform keeps: the audit log, which shows who read the table and when, and lineage, which shows where each column went. Which of your data's protections could you prove today, from a record?"},
  "ends":{q:"On 30 June 2027, what takes Anil out of the study's group?",
    opts:[{t:"His place in the group ends on that date, and the directory removes it.",ok:true},{t:"Mei's last review of the study, where she answers no for every member.",near:true},{t:"Yusuf, who empties the group by hand at the end of the agreement's last day."}],
    why:"Each place in the group was given until the agreement's end, so it ends by itself, with no one's answer needed, and the grants made from the contract end the same day. Reviews keep checking until then, and Yusuf's check on 1 July proves it ended. Where you work, which access has no end date at all?"}
  }}};
