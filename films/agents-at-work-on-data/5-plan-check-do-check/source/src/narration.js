// Plan, define the check, do, check, the fifth film of Agents at work on data, the second series on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years and numbers in words). The few longer stops are in breath.js.
const NARR={
"water":{"name":"Water people can trust","lead":1.6,"tail":1.0,"vo":[
 {"id":"city","gap":0.8,"text":"Singapore, in the late 1990s: an island city of four million people, with little land to catch the rain.","say":"Singapore, in the late nineteen nineties: an island city of four million people, with little land to catch the rain."},
 {"id":"piped","gap":0.8,"text":"Much of its water is piped in from Malaysia, under two agreements: one ends in 2011, the other in 2061.","say":"Much of its water is piped in from Malaysia, under two agreements: one ends in twenty eleven, the other in twenty sixty-one."},
 {"id":"clean","gap":0.8,"text":"Engineers can clean used water, from the city's sinks and drains, until it's pure enough to drink."},
 {"id":"fear","gap":0.8,"text":"But would anyone drink water that had gone down a drain?"},
 {"id":"trust","gap":0.8,"text":"If people don't trust it, the country can't use it, and stays dependent on water from across the border."},
 {"id":"change","gap":0.8,"text":"Something has to make it trustworthy, before anyone drinks a drop."},
 {"id":"study","gap":0.8,"text":"So, in 1998, the water agency and the environment ministry begin a study.","say":"So, in nineteen ninety-eight, the water agency and the environment ministry begin a study."},
 {"id":"before","gap":0.3,"text":"Before the test plant makes any water, they write down how it will be judged:"},
 {"id":"measures","gap":0.8,"text":"190 measures, physical, chemical and microbiological, from the world's drinking-water standards.","say":"A hundred and ninety measures, physical, chemical and microbiological, from the world's drinking-water standards."},
 {"id":"panel","gap":0.8,"text":"And a panel of experts, from Singapore and abroad, helps set the rules, and checks the results, for two years."},
 {"id":"report","gap":0.8,"text":"In July 2002, the panel reports: the water is well within the standards.","say":"In July, twenty oh two, the panel reports: the water is well within the standards."},
 {"id":"parade","gap":0.8,"text":"That August, at the parade for the country's birthday, about 60,000 people raise a bottle of it, and drink.","say":"That August, at the parade for the country's birthday, about sixty thousand people raise a bottle of it, and drink."},
 {"id":"flows","gap":0.8,"text":"Since 2003, it has flowed into the reservoirs: water the country makes itself.","say":"Since twenty oh three, it has flowed into the reservoirs: water the country makes itself."},
 {"id":"today","gap":0.8,"text":"Today it's tested for about 300 measures, and experts from outside still audit it every year.","say":"Today it's tested for about three hundred measures, and experts from outside still audit it every year."},
 {"id":"data","gap":0.8,"text":"At the university, Jun's agent is about to change the census-day count, the number the university reports to the government."},
 {"id":"unless","gap":0.8,"text":"If nobody decides first how its work will be checked, nobody can trust what it brings back."},
 {"id":"first","gap":0.8,"text":"Decide the check before it starts, and its work is something the team can use."}
]},
"long":{"name":"The long way","lead":1.6,"tail":1.6,"vo":[
 {"id":"once","gap":0.8,"text":"Once, one of the team's agents was given a goal and nothing else: check the count against the census rules."},
 {"id":"knew","gap":0.8,"text":"Its plan didn't say what it could use, so it did what it knew: it searched the web for the census rules."},
 {"id":"pages","gap":0.8,"text":"It read 38 web pages, in 40 minutes.","say":"It red thirty-eight web pages, in forty minutes."},
 {"id":"docs","gap":0.8,"text":"Docs, the tool with the university's own definitions, would have answered in one call."},
 {"id":"other","gap":0.8,"text":"And the rule it brought back was another university's."},
 {"id":"caught","gap":0.8,"text":"Jun caught it in review, and the work began again."},
 {"id":"broken","gap":0.8,"text":"Nothing in the agent was broken: it used what it could find, because nobody had said what was there."},
 {"id":"waste","gap":0.8,"text":"Most of the waste with agents starts here, with a plan that doesn't say what the agent may use."}
]},
"plan":{"name":"Plan","lead":1.0,"tail":1.0,"vo":[
 {"id":"asks","gap":0.8,"text":"Now Clara, in Planning, asks for the census-day count by level of study, for the government's report."},
 {"id":"page","gap":0.8,"text":"Before the agent starts, Jun writes one page."},
 {"id":"goal","gap":0.8,"text":"The goal: students on census day, by level, undergraduate and postgraduate."},
 {"id":"reads","gap":0.8,"text":"What to read: the glossary's words for student, census day and level of study, and the census-day count it builds on."},
 {"id":"tools","gap":0.8,"text":"The tools it may use: Catalog, Query and Docs, read only."},
 {"id":"writes","gap":0.8,"text":"Where it may write: only its own branch, and its sandbox."},
 {"id":"never","gap":0.8,"text":"What it must never do: read names or student IDs, or write to production."},
 {"id":"limit","gap":0.8,"text":"And a limit: ten rounds, then it stops and reports."}
]},
"define":{"name":"Define the check","lead":1.0,"tail":1.4,"vo":[
 {"id":"matters","gap":0.8,"text":"Then the line that matters most: how the result will be checked, decided now, before any work."},
 {"id":"unknown","gap":0.8,"text":"But nobody knows the answer yet: that's why Clara asked."},
 {"id":"must","gap":0.3,"text":"What Jun knows is what must be true of any right answer:"},
 {"id":"adds","gap":0.3,"text":"the levels add up to 18,412, the count already matched to the census report;","say":"the levels add up to eighteen thousand four hundred and twelve, the count already matched to the census report;"},
 {"id":"one","gap":0.8,"text":"and every student has exactly one level, as the glossary defines it."},
 {"id":"neither","gap":0.8,"text":"Neither says how many students are at any level: they check how the parts relate, and what the words mean."},
 {"id":"tests","gap":0.8,"text":"The agent writes the two checks as tests, before any model, and Jun approves them."},
 {"id":"only","gap":0.8,"text":"From then on, only a person can change them, so the agent can't pass by moving the mark."},
 {"id":"wrong","gap":0.8,"text":"And what everyone already uses can be wrong, sometimes for years: if the data disagrees, the agent says so, with its evidence."},
 {"id":"options","gap":0.8,"text":"Where nobody can say what's right, it brings the options, each with its result, for a person to choose."},
 {"id":"like","gap":0.3,"text":"Like Singapore's 190 measures, written before the plant made any water:","say":"Like Singapore's hundred and ninety measures, written before the plant made any water:"},
 {"id":"meet","gap":0.8,"text":"none said what the results would be, only what the water had to meet."}
]},
"do":{"name":"Do","lead":1.0,"tail":1.0,"vo":[
 {"id":"works","gap":0.8,"text":"Now the agent works, in its sandbox, with only the tools the plan gave it."},
 {"id":"builds","gap":0.8,"text":"It reads the three words in Docs, finds the tables in Catalog, and builds the count by level."},
 {"id":"red","gap":0.8,"text":"The first run fails a test: the two levels add up to 18,384.","say":"The first run fails a test: the two levels add up to eighteen thousand three hundred and eighty-four."},
 {"id":"short","gap":0.8,"text":"Twenty-eight students are missing."},
 {"id":"looks","gap":0.8,"text":"It looks, with Query: on census day, 28 students have no level.","say":"It looks, with Query: on census day, twenty-eight students have no level."},
 {"id":"exchange","gap":0.8,"text":"They're exchange students, taking single units, with no degree here."},
 {"id":"since","gap":0.8,"text":"And it isn't new: since 2021, when exchange students moved to a system of their own, none has had a level.","say":"And it isn't new: since twenty twenty-one, when exchange students moved to a system of their own, none has had a level."},
 {"id":"split","gap":0.8,"text":"So every split by level since then was short, and nothing checked that the levels added up."},
 {"id":"doesnt","gap":0.8,"text":"It doesn't drop them, and it doesn't touch the test."},
 {"id":"meaning","gap":0.8,"text":"Which level they belong to is a meaning, and meanings are Mei's to decide."},
 {"id":"asks","gap":0.3,"text":"So it stops, and asks her, with its query, the result, and two options that both add up:"},
 {"id":"options","gap":0.8,"text":"a level of their own, or the level each one studies at home."},
 {"id":"mei","gap":0.8,"text":"Mei checks the government's list: they count as non-award, a level of its own."},
 {"id":"years","gap":0.8,"text":"And the years before go to Planning, with the agent's evidence, for people to look into."},
 {"id":"again","gap":0.8,"text":"The agent adds the third level, and runs the tests again: 13,906, 4,478 and 28 add up to 18,412, and every student has one level.","say":"The agent adds the third level, and runs the tests again: thirteen thousand nine hundred and six, four thousand four hundred and seventy-eight and twenty-eight add up to eighteen thousand four hundred and twelve, and every student has one level."},
 {"id":"pass","gap":0.8,"text":"Both tests pass."},
 {"id":"pr","gap":0.3,"text":"It writes the model's description from the glossary, with its source, and opens a pull request:"},
 {"id":"evidence","gap":0.8,"text":"what it changed, why, and the evidence for every claim."}
]},
"check":{"name":"Check","lead":1.2,"tail":1.2,"vo":[
 {"id":"person","gap":0.8,"text":"Now a person checks the work, against the plan, not against the agent's word."},
 {"id":"jun","gap":0.8,"text":"Jun reads the pull request: the goal met, only the tools it was given, no names, and both tests untouched, and green."},
 {"id":"rounds","gap":0.8,"text":"It took four of its ten rounds."},
 {"id":"his","gap":0.8,"text":"Now the change is his: if the count is wrong, he answers for it, not the agent."},
 {"id":"noor","gap":0.8,"text":"To reach production, a second person must approve it: Noor, the data architect."},
 {"id":"never","gap":0.8,"text":"The agent can review, too, but only for reference: it never approves."},
 {"id":"outside","gap":0.8,"text":"As in Singapore, the work is held to its checks by people who didn't do it."}
]},
"leaves":{"name":"What the loop leaves","lead":1.0,"tail":1.0,"vo":[
 {"id":"next","gap":0.8,"text":"And each loop leaves something for the next one."},
 {"id":"decision","gap":0.8,"text":"A decision, recorded: Mei's rule for exchange students, with her name."},
 {"id":"meta","gap":0.8,"text":"Metadata: level of study, in the glossary and in the model's description, with its source."},
 {"id":"skill","gap":0.8,"text":"A skill, updated: reconcile and diff now checks that every split adds up to its total."},
 {"id":"plan","gap":0.8,"text":"And the plan itself: the next one starts from this page."}
]},
"trust":{"name":"Trust, earned","lead":1.0,"tail":1.0,"vo":[
 {"id":"sg","gap":0.8,"text":"In Singapore, the measures were set before the first drop, and people from outside held the water to them."},
 {"id":"bottle","gap":0.8,"text":"So when 60,000 people raised a bottle, they had good reason to trust it.","say":"So when sixty thousand people raised a bottle, they had good reason to trust it."},
 {"id":"uni","gap":0.8,"text":"At the university, the checks came before the agent's first step, and a person held its work to them."},
 {"id":"send","gap":0.8,"text":"So the count can go to the government, with its evidence."},
 {"id":"take","gap":0.8,"text":"Decide how you'll check before the agent starts."}
]}
};
