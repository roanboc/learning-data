// A hundred records, film 2 of 4 of Fit for use, the first series of Data quality. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
// Every number is the module's shared one (numbers.md, *The hundred-record measure*, *What profiling found* and *The first checks*). The narration says "check", never "test".
const NARR={
"first":{"name":"A few careful trials","lead":2.4,"tail":1.4,"vo":[
 {"id":"dublin","gap":0.8,"text":"Dublin, 1899. A young chemist, William Gosset, joins a large brewery.","say":"Dublin, eighteen ninety-nine. A young chemist, William Gosset, joins a large brewery."},
 {"id":"barley","gap":0.8,"text":"It wants better barley: which kind to grow, and how, for the best beer."},
 {"id":"field","gap":0.8,"text":"But a trial means sowing a few plots and waiting a whole season, so it gives only a handful of results."},
 {"id":"mislead","gap":0.8,"text":"And a handful can mislead. The brewery could choose the wrong barley and live with it for a year, or turn good barley away."},
 {"id":"maths","gap":0.8,"text":"The mathematics of the day worked for large numbers of measurements. Nobody could say how far a few could be trusted."},
 {"id":"change","gap":0.8,"text":"The brewery couldn't wait for large numbers it would never have."},
 {"id":"worked","gap":0.8,"text":"So Gosset worked out how much a few results can tell you, and how sure of it you can be."},
 {"id":"cards","gap":0.8,"text":"Before he could prove it on paper, he tried it by hand: 3,000 measurements on 3,000 cards, shuffled, and drawn four at a time.","say":"Before he could prove it on paper, he tried it by hand: three thousand measurements on three thousand cards, shuffled, and drawn four at a time."},
 {"id":"student","gap":0.8,"text":"In 1908 he published it, with tables anyone could use, as Student: the brewery let its staff publish, but not under their own names.","say":"In nineteen oh eight he published it, with tables anyone could use, as Student: the brewery let its staff publish, but not under their own names."},
 {"id":"enough","gap":0.8,"text":"Now a few careful trials were enough to decide, and his tables said when more were needed."},
 {"id":"kiln","gap":0.8,"text":"In his paper, eleven pairs of trials showed that seed dried in a kiln probably gave a little more grain, and almost certainly worse barley."},
 {"id":"still","gap":0.8,"text":"His way is still used wherever people can't measure everything: in medicine, in farming, in factories."},
 {"id":"data","gap":0.8,"text":"And for data: a few records, looked at closely, can say how good a whole list is."},
 {"id":"uni","gap":0.8,"text":"At the university, the graduation list passed every check. Yet in December, 41 degree certificates were printed again.","say":"At the university, the graduation list passed every check. Yet in December, forty-one degree certificates were printed again."},
 {"id":"friday","gap":0.8,"text":"So, on a Friday in February, three people looked closely at a hundred of its records."},
 {"id":"honest","gap":0.8,"text":"79 were perfect: an honest number, and a map of where to look, before a single new check was written.","say":"Seventy-nine were perfect: an honest number, and a map of where to look, before a single new check was written."}
]},
"look":{"name":"A hundred, by hand","lead":1.0,"tail":1.0,"vo":[
 {"id":"bench","gap":0.8,"text":"Friday, 6 February, two o'clock, at the data team's bench.","say":"Friday, the sixth of February, two o'clock, at the data team's bench."},
 {"id":"who","gap":0.8,"text":"Malia Fonoti runs the ceremonies. Mei Tanaka, in the registrar's office, answers for names and awards. Jun Park builds the list."},
 {"id":"january","gap":0.8,"text":"In January, they agreed what the list is for, and what each use needs. A certificate needs every name exactly right."},
 {"id":"hundred","gap":0.8,"text":"Jun brings December's list, the last one built in full, and its hundred most recent records."},
 {"id":"fields","gap":0.8,"text":"For each, the fields a certificate and a ceremony need: the names, the award, the ceremony, and the date the degree is conferred."},
 {"id":"mark","gap":0.8,"text":"They go through them one by one, and mark every field that's wrong. A record with nothing marked is perfect."},
 {"id":"later","gap":0.8,"text":"Two hours later: 79 perfect.","say":"Two hours later: seventy-nine perfect."},
 {"id":"errors","gap":0.8,"text":"21 have at least one error, 26 errors in all.","say":"Twenty-one have at least one error, twenty-six errors in all."},
 {"id":"names","gap":0.8,"text":"15 are in names: accents lost, names cut short, given and family names swapped.","say":"Fifteen are in names: accents lost, names cut short, given and family names swapped."},
 {"id":"rest","gap":0.8,"text":"6 are in awards, 3 in ceremonies, 2 in dates.","say":"Six are in awards, three in ceremonies, two in dates."},
 {"id":"redman","gap":0.8,"text":"Thomas Redman, a pioneer of data quality, calls this the Friday afternoon measurement."},
 {"id":"tools","gap":0.8,"text":"It needs no special tools: a hundred records, the people who know them, and an afternoon."}
]},
"sure":{"name":"Is a hundred enough?","lead":1.0,"tail":1.0,"vo":[
 {"id":"all","gap":0.8,"text":"December's list has 2,031 graduates. Can a hundred records speak for them all?","say":"December's list has two thousand and thirty-one graduates. Can a hundred records speak for them all?"},
 {"id":"question","gap":0.8,"text":"It's Gosset's question again: how far can a few be trusted?"},
 {"id":"margin","gap":0.8,"text":"If the hundred are like the rest, the answer is good to about eight either way: between 71 and 87 perfect in every hundred.","say":"If the hundred are like the rest, the answer is good to about eight either way: between seventy-one and eighty-seven perfect in every hundred."},
 {"id":"act","gap":0.8,"text":"Not exact. But enough to act on: about one record in five is wrong."},
 {"id":"recent","gap":0.8,"text":"Why the most recent? They show the list as it's made now, not as it was made years ago."},
 {"id":"plain","gap":0.8,"text":"And everyone understands 79 of a hundred.","say":"And everyone understands seventy-nine of a hundred."},
 {"id":"puzzle","gap":0.8,"text":"It also raises a puzzle. December's 41 reprints were about 2 certificates in 100.","say":"It also raises a puzzle. December's forty-one reprints were about two certificates in a hundred."},
 {"id":"over","gap":0.8,"text":"The hundred say 21 records in 100 have an error: over 400 on December's list.","say":"The hundred say twenty-one records in a hundred have an error: over four hundred on December's list."},
 {"id":"hidden","gap":0.8,"text":"So someone had been putting most of them right by hand before the list went, and nobody counted that work."},
 {"id":"factory","gap":0.8,"text":"The hidden factory, a later film, follows it."}
]},
"profile":{"name":"The whole list, described","lead":1.0,"tail":1.0,"vo":[
 {"id":"where","gap":0.8,"text":"A hundred records say how good the list is, not where to look among two thousand."},
 {"id":"describe","gap":0.8,"text":"So Jun has the platform describe the whole list."},
 {"id":"notebook","gap":0.8,"text":"A notebook shows a quick profile in one click. For one the team keeps and refreshes, he sets up Databricks' data profiling."},
 {"id":"profiling","gap":0.8,"text":"It reads every row and describes each column."},
 {"id":"columns","gap":0.8,"text":"How many values are empty, how many are different, which are shortest and longest, and which come up most."},
 {"id":"december","gap":0.8,"text":"He profiles December's list, all 2,031 graduates.","say":"He profiles December's list, all two thousand and thirty-one graduates."},
 {"id":"stand","gap":0.8,"text":"Two things stand out."},
 {"id":"thirty","gap":0.8,"text":"The longest family name is exactly 30 characters: the length of the field in the student system. Names cut short.","say":"The longest family name is exactly thirty characters: the length of the field in the student system. Names cut short."},
 {"id":"capitals","gap":0.8,"text":"And among the most frequent family names, the same name twice: once as written, once in capitals."},
 {"id":"metrics","gap":0.8,"text":"So Jun adds counts of his own, as custom metrics."},
 {"id":"fortyone","gap":0.8,"text":"41 family names exactly 30 characters long.","say":"Forty-one family names exactly thirty characters long."},
 {"id":"caps","gap":0.8,"text":"312 in capitals only, every one of a student admitted before 2020.","say":"Three hundred and twelve in capitals only, every one of a student admitted before twenty twenty."},
 {"id":"accents","gap":0.8,"text":"And not one name with a letter outside A to Z. Eight in the hundred had lost their accents. Here, every accent is gone.","say":"And not one name with a letter outside A to Z. Eight in the hundred had lost their accents. Here, every accent is gone."},
 {"id":"since","gap":0.8,"text":"The hundred had none in capitals: all of them were students admitted since 2020.","say":"The hundred had none in capitals: all of them were students admitted since twenty twenty."},
 {"id":"everyrow","gap":0.8,"text":"Only the profile, which reads every row, could see them."},
 {"id":"said","gap":0.8,"text":"The hundred said how good. The profile said where to look."}
]},
"checks":{"name":"Then the checks","lead":1.6,"tail":2.0,"vo":[
 {"id":"now","gap":0.8,"text":"Only now does Jun write checks, starting with what the profile showed."},
 {"id":"cut","gap":0.8,"text":"A family name exactly as long as the field may have been cut short."},
 {"id":"upper","gap":0.8,"text":"A family name in capitals only."},
 {"id":"none","gap":0.8,"text":"And a list of more than 200 names without a single accent.","say":"And a list of more than two hundred names without a single accent."},
 {"id":"chance","gap":0.8,"text":"Eight in the hundred had lost theirs, so a list with none isn't chance."},
 {"id":"owner","gap":0.8,"text":"Mei owns all three. Before any ran, she and Malia agreed their level."},
 {"id":"level","gap":0.8,"text":"Each holds the list for a person to look; none stops it on its own."},
 {"id":"dbt","gap":0.8,"text":"Jun writes them in the project, with dbt. From Monday, they run every night."},
 {"id":"monitor","gap":0.8,"text":"The platform's monitoring watches the rest, such as whether each table arrives on time, as Quality on the platform showed."},
 {"id":"cant","gap":0.8,"text":"But some of the hundred's errors, no check of the list can see."},
 {"id":"allowed","gap":0.8,"text":"The swapped names, the awards, the ceremonies and the dates were all allowed values. Allowed, and wrong."},
 {"id":"outside","gap":0.8,"text":"To find those, the list needs something outside it to compare with. That's the next film."}
]},
"close":{"name":"Look first","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Back in Dublin, Gosset never tried every barley. A few careful trials were enough, and his tables said when more were needed."},
 {"id":"same","gap":0.8,"text":"The team did the same with its list: a hundred records, looked at by the people who know them, then the whole list described."},
 {"id":"start","gap":0.8,"text":"79 is where they start. Each time they measure again, the number will say whether their changes worked.","say":"Seventy-nine is where they start. Each time they measure again, the number will say whether their changes worked."},
 {"id":"measured","gap":0.8,"text":"And because they measured first, the checks go where the errors are, not where checks are easy to write."},
 {"id":"takeaway","gap":0.8,"text":"Look at a hundred records before you write a single check."}
]}
};
