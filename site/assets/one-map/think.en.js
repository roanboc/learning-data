/* Learning Data: "Pause and think" for One map, in the repo, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (copies, repo, change), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "copies":{q:"Each of Helena's three pictures was right the day it was made. Why did they come to disagree?",
    opts:[{t:"The architecture tool fell out of date first, and the wiki and the slides, which copy it, took on its mistakes each time."},{t:"Each was changed by hand, on its own, so a change made in one never reached the other two, and nothing showed which was current.",ok:true},{t:"Nobody owned them; with an owner each for the tool, the wiki and the slides, updating them by hand, the three would stay in step.",near:true}],
    why:"Three copies, each changed on its own, drift apart however careful their keepers are: Ordnance Survey's users found the same with their own records. Owners only make three careful copies. The fix is one source, and every other picture made from it. Where does your team keep the same picture more than once?"},
  "repo":{q:"Why does the team keep its diagrams as text, in Mermaid or draw.io files, in the repository?",
    opts:[{t:"So each diagram is backed up with the code, and an older one can be restored if a picture is ever lost or broken.",near:true},{t:"Because a picture drawn in an architecture tool can't be stored in a repository at all, so text is the only way in."},{t:"So a change to a picture is a change anyone can read in a review, with its reason, beside the code it describes.",ok:true}],
    why:"A picture saved as an image changes without anyone being able to see what moved. As text, the change shows line by line in the pull request, and the history says who changed it, when and why. A backup keeps old pictures; a review stops a wrong one. Which of your diagrams would you trust after a year without review?"},
  "change":{q:"In July, Sam's team adds the rooms' sensor feed to the platform. When is the map's current state updated?",
    opts:[{t:"In the same pull request that adds the feed, reviewed with the code, so the code and the map change together.",ok:true},{t:"At the next funded project, when the architect has the time and the budget to redraw the current and target state."},{t:"Right after the feed goes live, in a second pull request, once the team has seen that the feed works as planned.",near:true}],
    why:"A second pull request is the one that gets forgotten, and the map starts to drift again; a check that fails when a new source has no place on the map makes sure it can't. Waiting for a funded project is how a team builds tomorrow's legacy. What changed in your platform last month that its map doesn't show yet?"}
  }}};
