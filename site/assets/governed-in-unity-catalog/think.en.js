/* Learning Data: "Pause and think" for Governed in Unity Catalog, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (tag, key, groups), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "tag":{q:"A new table for another team holds an email, and its model doesn't class the column. What happens?",
    opts:[{t:"The policy masks it anyway, because it looks like an email."},{t:"The governance check fails its pull request: it can't merge until the column has a class, so the table never reaches the platform without its tag.",ok:true},{t:"The platform's classifier tags it direct by itself."}],
    why:"The policy goes by the tag, not by what a column looks like: a column with no tag would show its values. So the project doesn't let in a model other teams read without a class on every column, and the build writes the tag. For tables the project doesn't build, the platform's classifier suggests, and their owner classes them. Where you work, which tables could hold personal data with nothing to say so?"},
  "key":{q:"The learner code is still personal. Why doesn't the policy show stars in it too?",
    opts:[{t:"Planning counts and joins learners by it, without names, and stars would stop that. So it's protected by who may read the table, for what, and until when.",ok:true},{t:"Because a scrambled code can't be matched to anyone."},{t:"Because the policy only masks columns that hold names."}],
    why:"Scrambled isn't anonymous: with the registrar's list, anyone could scramble each number and match it. So the code stays personal, and reading it takes a purpose and an end date, as Clara's access does, through a group. Stars would hide it from the very counting it's kept for. In your data, which columns are scrambled, and who could match them back?"},
  "groups":{q:"Clara moves to Finance in January. What happens to her access to the learner table?",
    opts:[{t:"She keeps it until someone takes it away by hand."},{t:"Finance's groups get her access to the learner table."},{t:"It already ended on 15 December, with her place in the group. And whenever someone changes jobs, the directory moves them out of their old team's groups, and the platform's access follows.",ok:true}],
    why:"Access goes to groups, and the end date is kept where the group's members are, in the university's directory, which the platform reads. Nobody has to remember to take it away: the nine who had moved on kept theirs because the old access went to people, by hand. Where you work, how does someone's access end when they change jobs?"}
  }}};
