/* Learning Data: "Pause and think" for Small, every week, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (thursdays, cycle, order, kept), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "thursdays":{q:"In January, the first idea was a big project: clean every name on the list, once, before March. Why did Mei ask for something smaller?",
    opts:[{t:"Her office had no time for a big project before March, so a smaller one was all it could fit in."},{t:"A clean-up takes too long, so the team would clean a few names by hand each Thursday instead.",near:true},{t:"A clean-up fixes the names once, and the next list brings the same errors back.",ok:true}],
    why:"Cleaning every name once leaves the list's errors where they're born, so next year's list arrives with the same ones. Cleaning a few names each Thursday would do the same, only slower. Mei asked for fifteen minutes a week to change how the list is made, one small change at a time, each one measured. Which of your fixes would the next load undo?"},
  "cycle":{q:"In October's turn, the team checked 78 names by hand, not 2,140. How did they know the change worked?",
    opts:[{t:"By two measures they kept already: the round's hours, and the perfect records in the hundred.",ok:true},{t:"By the round's hours alone: 26, not 240, and time saved is what the change was for.",near:true},{t:"By asking Malia after the ceremony whether any graduate had complained about a name."}],
    why:"Fewer hours could mean the team simply missed more names. So they planned two measures before they began, both kept already: the round's hours, which fell from 240 to 26, and the hundred records drawn at random, 97 of them perfect on 6 November. Only both together said the change worked. Which two measures would tell you your next change worked?"},
  "order":{q:"Before automating, the team measured the hand checks, cut them to the names a check holds, and settled each the same way. What would automating first have done?",
    opts:[{t:"Made the old work faster: all 2,140 names checked, so fewer errors would reach the printer.",near:true},{t:"Made the old work faster: all 2,140 names checked, though most of them never needed it.",ok:true},{t:"Nothing different: the order of the four steps stops mattering once the tool is chosen."}],
    why:"Automating the hand checks first would have checked every name, faster, when most names needed no check at all: the wrong work, done faster, and no more right than before. Measuring showed the 320 hours; simplifying left only the names a check holds; standardising gave each one a single way to be settled. Then there was something worth automating. What would you automate today that you haven't simplified yet?"},
  "kept":{q:"The hand checks now cover only the names a check holds. What keeps that change from slipping back?",
    opts:[{t:"Nothing needs to: once a change has worked, it stays, so the team can move on to the next."},{t:"The hundred records, drawn once in November, when 97 of the 100 were perfect.",near:true},{t:"The hundred records, every month: below 95 perfect, the next round checks more by hand.",ok:true}],
    why:"A change lasts only until someone forgets it, unless a check keeps it. A measure taken once, however good, says how it was in November, not how it is now. So the hundred records are drawn every month, at a level agreed with Malia: below 95 perfect, the next round checks more by hand. What keeps your last change in place?"}
  }}};
