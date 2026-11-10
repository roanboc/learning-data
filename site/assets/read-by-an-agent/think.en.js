/* Learning Data: "Pause and think" for Read by an agent, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (empty, proposes, before), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "empty":{q:"The agent counted 412 graduates whose confirmation date was empty. What made its answer wrong?",
    opts:[{t:"Its query read the wrong column, not the confirmation date."},{t:"Empty meant two things, and the agent didn't ask Mei which.",near:true},{t:"Empty meant two things, and nothing written said which.",ok:true}],
    why:"The agent counted exactly what it was asked to, from what it could read. Empty meant both \"not yet\" and \"confirmed on paper\", and only Mei knew it. An agent can't walk over to her desk, so the meaning has to be in the data and its description. Which of your columns would an agent misread today?"},
  "proposes":{q:"Genie Code proposed a check that fails whenever a graduate hasn't confirmed their name yet. Why did Jun turn it down?",
    opts:[{t:"An agent proposed it, and only people may write the checks."},{t:"It's about what people do, so it becomes a count Malia follows.",ok:true},{t:"It's about what people do, so it becomes a check that holds for Malia.",near:true}],
    why:"A check says whether the data is right. Graduates who haven't answered yet aren't wrong data; they're work still to do, and Malia's. So it's a count she follows each week, kept in its own model, and the agent's trusted answer to her question. The agent's other two proposals became checks, so who proposed it wasn't the reason. What does your team fail as a check that's really a task?"},
  "before":{q:"An agent answers your question at once, sure of itself, and shows its query. What should you do before acting on it?",
    opts:[{t:"Check it fits what you know, and ask the data's owner if it doesn't.",ok:true},{t:"Check it fits what you know, and ask the agent again if it doesn't.",near:true},{t:"Trust it: the agent showed the query it ran, so the count is right."}],
    why:"An answer can be confident, come with its query, and still count the wrong thing. Malia saw that a fifth of the list didn't fit a portal that 95 in 100 graduates answer within two weeks, and asked Mei, who knew what empty meant. Asking the agent again would have read the same silence. Whose answer would you check before acting on it this week?"}
  }}};
