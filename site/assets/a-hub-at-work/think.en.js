/* Learning Data: "Pause and think" for A hub at work, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (why, ai, publish, friday), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series' labs and scenarios are its own, for all its films
   (assets/master-and-reference-data/), so no question has a "stop"; the page's .player data-labs leads to them. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "why":{q:"The rules gave Rafael's match 74. What if his two birth dates had agreed?",
    opts:[{t:"Still 74: birth dates don't count."},{t:"93, in the band where the rules link on their own, without asking anyone.",ok:true},{t:"The AI helper would have decided instead."}],
    why:"Each comparison adds weight or takes it away, and the band the score lands in says who acts: from 90, the rules link on their own; from 60 to 90, a person decides; under 60, the records stay apart. One digit in a birth date moved Rafael from one band to the other. Which field in your systems, mistyped, would change who decides?"},
  "ai":{q:"The AI helper reads Rafael's form and his old record, and suggests they're the same person. Why doesn't it link them itself?",
    opts:[{t:"It can't read a form."},{t:"It suggests and explains; the cases the rules are unsure of are decided by a person, whose name and reason are kept.",ok:true},{t:"It only links records at weekends."}],
    why:"Rules act on the clear cases; the helper reads meaning as well as spelling, and drafts a note; the close calls stay with people, who answer for them. Her decision also teaches the helper. Where would you draw the line on what an AI helper may do with records about people?"},
  "publish":{q:"The alumni office needs to know Rafael is applying. Why doesn't it see his birth date?",
    opts:[{t:"It was deleted when he graduated."},{t:"Each system reads only what concerns it, and a column mask hides his birth date from an office that doesn't need it.",ok:true},{t:"The feed carries changes, never people."}],
    why:"The hub publishes each change, and every system reads what concerns it, instead of having its records overwritten. What an office may see follows its purpose: the alumni office stops inviting him back without ever seeing his birth date. Think of a field your team receives but never uses. Should it?"},
  "friday":{q:"Leila checks fifty automatic links without seeing what the rules decided. Why hide it from her?",
    opts:[{t:"To make the check faster."},{t:"So she isn't swayed: a checker who sees the answer tends to agree with it.",ok:true},{t:"Because the rules' decisions are secret."}],
    why:"A blind check measures the rules honestly: this week, one link in fifty was wrong, and Mei unlinked it. The office agreed a rule too: if more than three in fifty are wrong, automatic linking stops, and every match waits for a person until new rules are agreed. What would your threshold be, and who would agree the new rules?"}
  }}};
