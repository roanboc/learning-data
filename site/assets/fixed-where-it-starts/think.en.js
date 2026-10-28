/* Learning Data: "Pause and think" for Fixed where it starts, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (back, never, rule), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "back":{q:"The data team cleaned the emails every night, and nothing broke. Why wasn't that enough?",
    opts:[{t:"The clean-up was too slow to clean every email in time."},{t:"It cleaned where the problem showed, not where it started: the form kept making new ones, and every other system that read the emails had to clean them again.",ok:true},{t:"The policy doesn't allow the data team to clean emails."}],
    why:"The mop works every night, and the leak never stops. The form kept each email as it was typed, and finance and the mailing list cleaned the same emails again. Followed back, one email led to the form, where nobody had typed anything wrong. As in Vienna, it showed downstream, but it started on the way in. Where in your work is the same thing cleaned twice?"},
  "never":{q:"The form now trims and checks every email. Why keep a check that should never fail?",
    opts:[{t:"The scorecard needs a check in that cell to show green."},{t:"It's a promise to everyone who reads the emails, and if the form ever breaks, after an update say, its owner hears first, before anyone downstream.",ok:true},{t:"The data team still cleans the emails, and the check watches the clean-up."}],
    why:"A fix at the source can undo itself: a new version of the form, a supplier's update. The rule stays as a check, so if it ever fails, the learning team hears first, before anyone downstream, and the data team's clean-up can go for good. Which of your fixes would nobody notice if it quietly stopped working?"},
  "rule":{q:"Rule or monitoring? \u201cA microcredential carries credit.\u201d \u201cLast night's badges don't look like other nights'.\u201d",
    opts:[{t:"Both are rules: write a check for each."},{t:"The first is something you know, so it's a check with an owner. The second is what monitoring catches; once you confirm what it found, it becomes a rule.",ok:true},{t:"Both are monitoring: let it learn what's normal."}],
    why:"Check what you know; watch for what you don't. Every check passed on the night half the badges arrived with zero credit, because no rule named it. Monitoring knew the usual shape, one badge in twelve with no credit, and told the owner on record. Once the cause was confirmed, the surprise became a rule, a check with an owner, and next time it's stopped before it reaches a wallet. What has surprised your team that no check would catch yet?"}
  }}};
