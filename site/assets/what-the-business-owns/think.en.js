/* Learning Data: "Pause and think" for What the business owns, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (whose, owns, answer), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop"
   (the lab it would open) and none links to one. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "whose":{q:"The data team's own table counts 352,000 customers, one per address. Why doesn't the team just fix it until it's right?",
    opts:[{t:"It's three years old, so rebuilding it from this year's accounts and connection points would make it right."},{t:"Its rule is wrong: merged by address, it misses customers, so the team should count billing's accounts instead.",near:true},{t:"Which customer the report means was never the team's to decide: the business owns each meaning, and must say.",ok:true}],
    why:"Each count is right about its own meaning: an account is someone who pays a bill, owned by the head of retail; a connection point is a place where power is delivered, owned by Grace. The merged table's meaning had no owner, so any fix the team chose would be one more guess. Which table in your organisation counts something nobody in the business ever confirmed?"},
  "owns":{q:"Grace's network wants meter readings checked for gaps every night. Who decides how many gaps are too many, and who builds the check?",
    opts:[{t:"Grace's network sets the threshold, as part of the quality it needs; the data team builds the check and runs it.",ok:true},{t:"Both are Grace's: she owns the readings, so her own team writes the check as well as the threshold it tests."},{t:"The data team sets the threshold, since it builds and runs the checks, then tells Grace's network when one fails.",near:true}],
    why:"The business owns the quality its data needs, so the threshold is Grace's to set. How data is stored, moved and checked is the data team's, so it builds the check and runs it, and Grace hears when it fails. Who sets the thresholds your checks test today?"},
  "answer":{q:"This year, the annual report and the regulator's return agree. What made them agree?",
    opts:[{t:"The data team picked the best of its three counts and used it in both, so the two can't differ.",near:true},{t:"Each number now comes from a definition its owner gave, so both count the same things, and say which.",ok:true},{t:"The regulator's return now copies the annual report's total, so the minister gets a single answer."}],
    why:"Ama, who asked, decided with the two owners: the report counts accounts as retail defines them and connection points as the network does, each by its own name. The data team builds both counts from those definitions and tests them, and Ama checks them before the ticket closes. Which of your reports gives one number for something that means two things?"}
  }}};
