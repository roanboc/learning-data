/* Learning Data: "Pause and think" for One policy for many tables, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (parts, ways, through, appears), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  parts:{q:"Suppose Jun's new table had no faculty column. What would the study see in it?",
    opts:[{t:"No rows at all: a filter that can't decide on a row keeps it hidden."},{t:"Every learner's rows: a filter with no column to find doesn't apply.",ok:true},{t:"Only Health's rows: the filter on the shelf reaches every table in it.",near:true}],
    why:"A row filter needs the column it finds by its tag. The policy on the shelf does reach every table there, but where no column carries the faculty tag, it doesn't apply, and every row shows. That's why every table with learners in it carries their faculty. Which of your tables would a filter like this miss?"},
  ways:{q:"Mask it whole turns words into three stars. Why does it leave a date empty instead?",
    opts:[{t:"So the study can still count how many learners were born in each year."},{t:"Because a date is indirect, and an indirect value is always left empty.",near:true},{t:"Because a mask gives back the column's own type, and stars aren't a date.",ok:true}],
    why:"A mask must give back the same type as its column: a date column must still hold a date, or the query fails. Three stars are words, so for anything that isn't words, the mask gives back an empty value. A date of birth is indirect, but its own policy generalises it to a year, it doesn't empty it. Which columns in your data aren't words?"},
  through:{q:"The help desk gets the policy that masks names in part. Why is it also let through the policy that masks them whole?",
    opts:[{t:"So only one mask reaches each column: two different masks stop the query.",ok:true},{t:"So the help desk sees every value whole, as the registrar's office does."},{t:"So the mask in part runs first, and the mask that hides it whole runs last.",near:true}],
    why:"For one reader, each column may have only one mask. Two different ones don't run one after the other: the query stops with an error. So the help desk is let through the policy that masks names whole, and given the one that masks them in part. Where you work, who decides which readers see a value in part?"},
  appears:{q:"A new table comes without its level. Who can read its rows?",
    opts:[{t:"Everyone on its shelf, with each column masked by its class as usual.",near:true},{t:"Only its builder, until its owner gives it a level and the rules apply.",ok:true},{t:"Everyone on its shelf, as it is, until someone notices it has no level."}],
    why:"A table no one has levelled is closed to all but the job that builds it, like Guide 111's load that no one can name. The masks by class would apply to its classed columns, but the closure hides every row first, until Mei gives it its level. What would your platform show today for a table nobody has described?"}
  }}};
