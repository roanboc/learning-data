/* Learning Data: "Pause and think" for A reason to keep it, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (six, yes, newuse), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  six:{q:"HR holds Linh's bank details. Which of the six reasons allows it?",
    opts:[{t:"Her consent: she wrote them on the form when she applied.",near:true},{t:"A contract: HR needs them to pay her for the work she does.",ok:true},{t:"A fair interest: payroll finds them handy to keep on file."}],
    why:"HR employs Linh and pays her, so her bank details rest on her contract: without them, it couldn't pay her. She did write them on the 2023 form, but giving a piece isn't agreeing to it, and her no couldn't have stopped her pay, so consent isn't the reason. Which pieces in your work rest on a contract?"},
  yes:{q:"Why was “I agree to the university using my personal data for HR purposes” the wrong reason?",
    opts:[{t:"It didn't say how long HR would keep her personal data.",near:true},{t:"Consent can only be asked for once a tutor has been hired."},{t:"A no couldn't stop what the law and her contract need.",ok:true}],
    why:"A yes is a reason only where a no is a real choice. Had Linh said no, HR would still have to keep her pay records, because a law requires it, and couldn't pay her without her bank details, which her contract needs. The old form did leave out how long HR keeps each piece, but that's a gap in what she was told, not why her yes was the wrong reason. Where does a form you know ask for a yes that a no couldn't change?"},
  newuse:{q:"Planning asks for the tutors' hours. What makes Ingrid's yes safe?",
    opts:[{t:"Hours by unit and period, small units joined, and no names at all.",ok:true},{t:"No names are shared, so every unit's hours can be shown as they are.",near:true},{t:"Planning is part of the university, so the data stays inside it."}],
    why:"Clara's plan needs hours by unit and teaching period, so that's all she gets: no names, no pay, no bank details. Taking the names away isn't enough on its own: a unit with one tutor would show that tutor's hours, so small units are counted together. Staying inside the university doesn't make a new use fit: the check asks what it's for. Which counts in your work could show one person?"}
  }}};
