/* Learning Data: "Pause and think" for Owning the outcome, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (owns, monday, blame), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The module's labs come later, as one set, so no question
   has a "stop", and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  owns:{q:"Ivy's product is refreshed every Monday by seven. What does she own?",
    opts:[{t:"The sensors, the platform and the reviews, since she's the one person who is accountable for it all."},{t:"That the timetable change is judged on true counts, for the readers who will choose rooms with them.",ok:true},{t:"That the refresh runs every Monday by seven, with the week before, as the product's promise says.",near:true}],
    why:"Many people do part of the work: Facilities keeps the sensors, Sam the platform, and Jun reviews her changes. Ivy answers for the outcome: next year's timetable will move about one peak class in six and release rooms nobody uses, and the readers will choose which from her counts. The refresh by seven is the promise; true counts are the point. What is your work for, and who decides with it?"},
  monday:{q:"The refresh ran at seven and every check passed. Why did Ivy write to the readers before she knew the cause?",
    opts:[{t:"Because a check had failed, and a failed refresh has to be reported to its readers the same day."},{t:"So the readers could look into the forty rooms themselves, and tell her which counts were wrong.",near:true},{t:"So nobody used the forty rooms' counts yet: saying it first, before the fix, is part of owning it.",ok:true}],
    why:"Every check passed, but in forty rooms the counts had dropped to about a quarter, and booked hours with nobody in them had jumped from one in five to more than half. If nobody noticed, the timetable team would release rooms that classes really use. So at ten past eight she wrote: the counts look wrong; don't use them yet; the right ones by tomorrow. Finding the fix was hers, not the readers'. Who would you tell first, if your work looked wrong?"},
  blame:{q:"Better sensors, a platform that loaded every count, a step right for its data. What does Helena ask first?",
    opts:[{t:"What happened, and what Ivy needs, so the way the parts fit together goes better next time.",ok:true},{t:"Who changed the sensors without telling the data team, so that it doesn't happen again.",near:true},{t:"Whether to stop the Monday refresh until every sensor's new counts have been tested."}],
    why:"Nobody did anything wrong: each part was right about what it saw, and what failed was the way the parts fit together. In a just culture, the first question is what happened and what must change, not who to blame. That's why Ivy could say it first: where nobody is blamed, saying it early is safe. What would make it safe, in your team, to say early that something's wrong?"}
  }}};
