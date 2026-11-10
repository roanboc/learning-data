/* Learning Data: "Pause and think" for Measures that matter, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (baseline, trend, team), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  baseline:{q:"Beside days from ask to first use, Helena puts a quality measure, sent back. What does it guard against?",
    opts:[{t:"The council reading one number alone, so that every measure on the page has a second one beside it."},{t:"Speed hiding rework: work sent out fast and half done, then back again, shows up as more sent back.",ok:true},{t:"Slow builders: each person's share sent back shows who needs help, and sets each of them a target.",near:true}],
    why:"Without it, speed could hide rework: fewer days to first use, but more work coming back for changes. Sent back is the team's measure, never one person's: a target for each builder would teach people to hide rework, not to cut it. Which of your speed measures has no quality measure beside it?"},
  trend:{q:"On 12 August, promises met stand at 82 percent, up from 58 in March. Why does the page show load beside it?",
    opts:[{t:"So the council can see how busy the team is, and give it more people when load goes over its limit."},{t:"Because load explains the gain: with nine pieces open, the team was getting more done than before.",near:true},{t:"Because a gain in one place can hide a loss in another: nine pieces were open against a limit of six.",ok:true}],
    why:"Alone, 82 percent looked fine. Beside it, nine pieces of work were open against a limit of six: new work was starting before old work finished, and that slows everything down. More open isn't more done. The team finished before it started, and by mid-September the load was six again. Which of your measures could look fine while another gets worse?"},
  team:{q:"Days from ask to first use ends when the work is first used. Who confirms that it was, and why?",
    opts:[{t:"The person who asked: the measure is about what they got, and a builder would be scoring their own work.",ok:true},{t:"A reviewer from the team: a second person checks the work, so nobody on the team scores their own.",near:true},{t:"The person who built it: they know when the work is done, and the tracker already records their date."}],
    why:"In the delivery room, doctors scored their own babies several points higher, so someone else took the score. First use is confirmed by the person who asked, because the measure is about what they got. A reviewer from the team is someone else, but not the person the work was for. Who confirms that your work was used?"}
  }}};
