/* Learning Data: "Pause and think" for Rules that let people decide, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (rules, tools, labs), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  rules:{q:"Yusuf's first list had eleven rules. Why did only three go to the faculties?",
    opts:[{t:"The officers could learn only three at first; the other eight would follow, one a month, as they settled in.",near:true},{t:"Of each, they asked what goes wrong here, now, without it, and only three guarded against a problem they had now.",ok:true},{t:"Helena chose the three she liked best and set them for the officers, so that nobody had to argue about the rest."}],
    why:"Every rule on the list guarded against something that had gone wrong somewhere. Only three guarded against something that would go wrong here, now: numbers that don't add up, people watched, and a new measure that means two things. The other eight went in a drawer, to come out when a real problem shows, as one did in November. Which of your rules would you keep, if you asked that of each?"},
  tools:{q:"Ivy and Jun's template shows booked hours beside counted ones, with room use worked out the agreed way. What does it add to the rules?",
    opts:[{t:"It makes the right way the only way: the officers can't change the page, so every faculty shows the same numbers.",near:true},{t:"It replaces the rules: with the page there, nobody needs to know why room use means one thing, or to ask Ivy."},{t:"It makes the right way the easy way: an officer copies it, and starts from numbers that already mean one thing.",ok:true}],
    why:"Rules say what's right; tools make it easy. The template locks nothing: an officer copies it, picks their faculty's rooms and asks their own questions, starting from numbers worked out the agreed way. And its box says who decides what, so nobody has to guess. What would make the right way the easy way in your team?"},
  labs:{q:"Engineering's empty labs had never been in a room report. Why was it Lucy who found them?",
    opts:[{t:"She knew her faculty's labs and who books them, and the template let her put their bookings beside the counts.",ok:true},{t:"The data team added the labs to the product that Monday, so the template showed every faculty's empty labs at once.",near:true},{t:"The labs' sensors were new that semester, so the counts that showed the empty Monday mornings had only just begun."}],
    why:"The knowledge was in Engineering: Lucy knew the labs, who books them, and who to ask about the Monday bookings. The template gave her the counts and the agreed way to read them, so she could ask what nobody at the centre had thought to ask. The team built her measure into the product only after she found it. What does your team not know to ask, that the people closest to the work do?"}
  }}};
