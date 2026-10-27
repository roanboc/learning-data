// Fixed where it starts, film 6 of the data governance series. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"clinics":{"name":"Two clinics","lead":1.4,"tail":1.0,"vo":[
 {"id":"v1847","gap":0.8,"text":"Vienna, 1847. The city's general hospital has two maternity clinics.","say":"Vienna, eighteen forty-seven. The city's general hospital has two maternity clinics."},
 {"id":"first","gap":0.8,"text":"In the first, where doctors and their students work, about one mother in ten dies of fever."},
 {"id":"second","gap":0.8,"text":"In the second, where midwives work, about one in thirty."},
 {"id":"looks","gap":0.8,"text":"Ignaz Semmelweis, a young doctor in the first clinic, looks for what's different."},
 {"id":"autopsy","gap":0.8,"text":"The doctors and students come to the ward from the autopsy room. The midwives don't."},
 {"id":"wash","gap":0.8,"text":"So he has everyone wash their hands in chlorinated lime before they examine a mother."},
 {"id":"fall","gap":0.8,"text":"Within months, deaths in the first clinic fall to the level of the second."},
 {"id":"showed","gap":0.8,"text":"The fever showed in the beds. It started on the doctors' hands, on their way in."},
 {"id":"lesson","gap":0.8,"text":"Where a problem shows is often not where it starts."}]},
"monday":{"name":"Still amber","lead":1.0,"tail":1.0,"vo":[
 {"id":"binder","gap":0.8,"text":"Today, Yusuf opens binder 15. Its policy says the root causes of data quality issues are addressed.","say":"Today, Yusuf opens binder fifteen. Its policy says the root causes of data quality issues are addressed."},
 {"id":"amber","gap":0.8,"text":"But on the quality scorecard, one cell is still amber."},
 {"id":"what","gap":0.8,"text":"Short-course emails, with spaces and capitals."},
 {"id":"issue","gap":0.8,"text":"The issue goes to their owner, Tom's learning team. The first answer is the old one: it's cleaned downstream."},
 {"id":"jun","gap":0.8,"text":"Every night for a year, the data team has trimmed each email and written it in lower case."},
 {"id":"wallet","gap":0.8,"text":"Without it, one learner could end up with two wallets."},
 {"id":"others","gap":0.8,"text":"And every system that reads these emails cleans them again."},
 {"id":"mop","gap":0.8,"text":"It's a mop under a leak. It works every night, and the leak never stops."}]},
"back":{"name":"Follow it back","lead":1.4,"tail":1.0,"vo":[
 {"id":"follow","gap":0.8,"text":"Yusuf follows one email back to where it's made."},
 {"id":"path","gap":0.8,"text":"From the wallet, through the data team's clean-up, to the short-course sign-up form."},
 {"id":"box","gap":0.8,"text":"The form keeps each email as it's typed, in a plain text box, so phones start it with a capital."},
 {"id":"space","gap":0.8,"text":"And picking a suggestion can leave a space at the end."},
 {"id":"third","gap":0.8,"text":"More than one email in three arrives that way."},
 {"id":"starts","gap":0.8,"text":"Nobody typed anything wrong. It shows downstream, but it starts here, at the form."}]},
"entry":{"name":"Fixed where it's typed","lead":1.0,"tail":1.0,"vo":[
 {"id":"time","gap":0.8,"text":"This time, the issue has an owner, a cause, a date, and a check that proves it's closed."},
 {"id":"email","gap":0.8,"text":"Tom's team makes the box an email box, so phones stop adding the capital."},
 {"id":"trims","gap":0.8,"text":"And the form trims each email, writes it in lower case and checks its shape, before it's saved."},
 {"id":"work","gap":0.8,"text":"Nobody has to type more carefully. The form does the work."},
 {"id":"before","gap":0.8,"text":"Tom's team corrects the old emails in their platform. Then the data team's clean-up can go."}]},
"never":{"name":"Should never fail","lead":1.4,"tail":1.2,"vo":[
 {"id":"stays","gap":0.8,"text":"The rule stays, as a check that should never fail: a promise to everyone who reads them."},
 {"id":"fails","gap":0.8,"text":"If it ever fails, the form has broken, and its owner hears first."},
 {"id":"green","gap":0.8,"text":"The cell turns green: not because the emails were cleaned, but because they were right where they were typed."}]},
"unknown":{"name":"What no rule names","lead":1.0,"tail":1.0,"vo":[
 {"id":"night","gap":0.8,"text":"One night, the learning platform sends something no rule names."},
 {"id":"half","gap":0.8,"text":"Half the new badges arrive with zero credit. Most are microcredentials that should carry five."},
 {"id":"pass","gap":0.8,"text":"Every check passes. The value is there, and it's a number."},
 {"id":"wallet","gap":0.8,"text":"But the wallet shows them as plain badges, with no credit."},
 {"id":"shape","gap":0.8,"text":"Monitoring knows each table's usual shape: when it arrives, how many rows, how many empty, how the values spread."},
 {"id":"usual","gap":0.8,"text":"Usually, one badge in twelve has no credit. Last night, one in two."},
 {"id":"tells","gap":0.8,"text":"It tells the owner on record: the learning team."}]},
"rule":{"name":"A surprise becomes a rule","lead":1.0,"tail":1.0,"vo":[
 {"id":"cause","gap":0.8,"text":"The cause is last week's update to the learning platform. Tom's team fixes it there, and sends the badges again."},
 {"id":"rule","gap":0.8,"text":"Then the surprise becomes a rule: a microcredential carries credit. A check, with an owner."},
 {"id":"three","gap":0.8,"text":"Prevent what you can, where it starts. Check what you know. Watch for what you don't."},
 {"id":"every","gap":0.8,"text":"And every surprise you confirm becomes a rule."}]},
"blame":{"name":"Nobody to blame","lead":1.0,"tail":1.0,"vo":[
 {"id":"blamed","gap":0.8,"text":"Nobody blamed Tom's team. The form did what it was built to do. They got the evidence, and help to change it."},
 {"id":"vienna","gap":0.8,"text":"Back in Vienna, Semmelweis was right. But the washing was slow, and it hurt the skin."},
 {"id":"proof","gap":0.8,"text":"Germs weren't known yet, so his only proof was his numbers. He waited years to publish them."},
 {"id":"letters","gap":0.8,"text":"And when doctors doubted him, he blamed them, in angry open letters."},
 {"id":"after","gap":0.8,"text":"Washing became the rule only after his death, once germs were known."},
 {"id":"lasts","gap":0.8,"text":"A fix at the start lasts when it's easy to keep, and when people get the evidence, not the blame."},
 {"id":"close","gap":0.8,"text":"Fix the cause. Then make the fix a check."}]}
};
