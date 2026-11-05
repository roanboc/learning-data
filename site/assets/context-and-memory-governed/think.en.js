/* Learning Data: "Pause and think" for Context and memory, governed, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (reads, memory, keep), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "reads":{q:"A teammate keeps a note in their own chat, \"leave out test records\", and their agent follows it. What's wrong with that?",
    opts:[{t:"Nothing: the agent follows it, so the count comes out right."},{t:"Nobody else owns it, reads it or reviews it, and nobody knows how long it's kept or where to delete it.",ok:true},{t:"A chat is too slow for an agent to read."}],
    why:"A note in one person's chat answers none of the five questions well: who owns it, who may read and change it, who reviews a change, how long it's kept, and how it's deleted. Written into the team's context, with an owner and a review, the same rule answers all five, and every agent reads it. Where you work, which rules live only in one person's chat?"},
  "memory":{q:"The platform's daily step can rewrite, merge, split or delete any entry in the store it writes to. Why does the team let it write only proposals?",
    opts:[{t:"Because the step is too slow to write entries every day."},{t:"Because it changes entries with no person reviewing them, as it did to the campus line.",ok:true},{t:"Because proposals take less room in the store."}],
    why:"The step is built to merge and rewrite, and that's how the campus line lost its three words. So it writes only to a store no agent reads. Each proposal comes as a file in a pull request, the person whose session it came from confirms what they meant, the owner of its meaning approves it, and only then does a script load it where agents read. Which of your agents' notes could change without anyone seeing?"},
  "keep":{q:"The campus line came from a chat in May. Why doesn't deleting that chat remove the line?",
    opts:[{t:"Because chats are kept for ever."},{t:"Because deleting a session doesn't delete the memory kept from it: the line lives in its own file, and in the store.",ok:true},{t:"Because only an agent can delete its own memory."}],
    why:"Deleting a session doesn't delete the memory kept from it, so the team deletes where a thing is kept: the line's file, in a pull request that says why, and its entry in the store, at the next load. The record of who added it, who deleted it and why stays. Where you work, where else is a lesson kept once it's learned?"}
  }}};
