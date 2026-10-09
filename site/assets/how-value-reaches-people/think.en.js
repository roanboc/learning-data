/* Learning Data: "Pause and think" for How value reaches people, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (side, teams, first), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "side":{q:"Drawn from the household's side, what does each stage of the value stream end with?",
    opts:[{t:"Something the household gets, such as help on its way.",ok:true},{t:"A team handing the work on."},{t:"A system being updated."}],
    why:"The household sees no teams and no systems, only a few stages in order: someone knows the power's out, help is on its way, the lights come back, and someone says what happened. That's a value stream: get the power back."},
  "teams":{q:"The call passes through the contact centre, the control room and the field crews. Where does the household feel it?",
    opts:[{t:"At every step of every team."},{t:"Only at the hand-offs that go wrong.",ok:true},{t:"Nowhere: the household can't see any of it."}],
    why:"As with the dabbawalas' tins, the detail belongs where the work changes hands. Where does work change hands on its way to your customers, and which hand-off do they notice when it goes wrong?"},
  "first":{q:"Three faults, two free crews. Which fault comes first?",
    opts:[{t:"The fault with the most homes."},{t:"Whichever was reported first."},{t:"Wires down first, for safety; then life support; then whatever brings back the most homes.",ok:true}],
    why:"Left to habit, both crews would go to the biggest fault. A rule that depends on order and state is where a process earns detail, step by step, in a notation such as BPMN. Is a rule like that written down where you work, and who owns it?"}
  }}};
