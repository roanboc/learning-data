/* Learning Data: "Pause and think" for Tags that travel, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (found, follows, conflict), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  found:{q:"A scan proposes no class for a column of free-text notes. What does that tell its owner?",
    opts:[{t:"That it holds nothing personal: the scan knows the classes and found none there.",near:true},{t:"Nothing yet: a scan proposes only what it recognises, so its owner looks.",ok:true},{t:"That it can stay as it is until a later scan proposes something."}],
    why:"A scan proposes what it recognises, such as a name, an email or a date of birth. A note can hold anything, and what makes it personal may be only in its meaning, as with exam support, given for a disability. Finding nothing isn't the same as nothing being there: the owner reads the column and decides. Which of your columns would no scan ever flag?"},
  follows:{q:"Anil makes a new table from the study's copy, with the learner code in it. Which class does the code carry?",
    opts:[{t:"Pseudonymous, carried in from the copy by propagation, with nobody tagging it.",ok:true},{t:"None until Anil tags it himself, since he made the table in his own space."},{t:"Pseudonymous, but only once Mei confirms it in a file, as she did at the source.",near:true}],
    why:"Propagation follows lineage: a table made from a tagged column gets its class within minutes, with nobody tagging it. Mei named the class once, at the source, and nothing downstream waits for her; only a table's level is hers to give each time. Where does someone in your platform still set a class again by hand?"},
  conflict:{q:"One column of a new table is made from a column tagged direct and one tagged pseudonymous. What does it get?",
    opts:[{t:"Pseudonymous: the platform keeps the milder value, so the column stays usable."},{t:"Direct: the stricter of the two values that met in it, so nothing is shown.",near:true},{t:"Special: two values meeting is a conflict, and the value set in advance applies.",ok:true}],
    why:"Propagation doesn't compare values. Two values for one tag in one column is a conflict, and the platform applies the value set in advance for that tag, here special, the strictest. Nothing shows that shouldn't, but the column now says the wrong thing and passes it on, so the fix is at the source. Which of your columns are made from two tagged ones?"}
  }}
};
