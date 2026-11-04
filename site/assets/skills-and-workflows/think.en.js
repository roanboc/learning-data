/* Learning Data: "Pause and think" for Skills and workflows, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (skill, workflow, night), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "skill":{q:"Why does Jun do the job once more by hand before he writes the skill?",
    opts:[{t:"To show the agent how fast a person can do it."},{t:"So the skill holds the steps and the causes the real job taught, not a guess about them.",ok:true},{t:"Because an agent can't read a file it didn't write."}],
    why:"Like al-Khwarizmi's forms, earned on real cases, a skill is worth what the job behind it taught: its steps, and every cause met so far, with who settled it. The agent reads only each skill's name and line until a job needs the steps. Which job do you do often enough that writing it down once would save the next person a day?"},
  "workflow":{q:"Every night, the count is built, tested and compared with the census report. Where does the agent belong in that job?",
    opts:[{t:"In every step, so it can catch anything unusual."},{t:"Only when the numbers don't agree, as one more step, to find out why; a person decides.",ok:true},{t:"Nowhere: once there's a workflow, an agent is never needed."}],
    why:"Known steps run best as plain steps: the same way every time, cheaper, and easy to check. Thinking is needed only when the count and the census report differ and nobody knows why yet. Even then, the agent drafts; a person decides. Which step in your work is done by judgment when plain steps would do?"},
  "night":{q:"On the night of 21 October, none of the skill's causes fits the fourteen extra records. What happens next?",
    opts:[{t:"The agent leaves them out, and tells the team in the morning."},{t:"The agent asks in its report; Mei decides; Jun adds the cause to the skill and a fixed step with a test; Noor approves.",ok:true},{t:"The workflow stops until someone writes a new skill."}],
    why:"The agent finds and asks, in its sandbox; it never decides what counts. A person settles the new cause, it's written into the skill, and since the rule is now known, it becomes a plain step: the next night, no agent is called. Each new case, written down once, is never solved twice. Where is the last cause your team settled written down?"}
  }}};
