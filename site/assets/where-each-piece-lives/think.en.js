/* Learning Data: "Pause and think" for Where each piece lives, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (nine, home, check), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "nine":{q:"The planner's request waited nine days with Jun. Why did it go to him at all?",
    opts:[{t:"Jun is the owner of every table he builds."},{t:"The data platform's page for the table named him as its owner. It was typed by hand when he built the table, and nothing kept it in step, so it still named him after Clara became the owner in October.",ok:true},{t:"Clara had asked Jun to answer her requests while she was away."}],
    why:"The page was a copy of who owns the table, typed by hand once, and nobody kept it in step with the owner's home. So the request went to the wrong person, and had he said yes, someone who isn't the owner would have decided who may see it. Where you work, who would a request reach today: the owner, or whoever built the table?"},
  "home":{q:"What does one home mean, for a piece of governance?",
    opts:[{t:"Every piece is kept in one tool, and the other tools are switched off."},{t:"It's the one place where the piece is changed, with an owner who decides it. Every other place keeps a copy, made from the home one way, saying where it came from and when. Nobody writes in a copy: a fix goes to the home, and every copy follows.",ok:true},{t:"Each team keeps its own version, and the newest one wins."}],
    why:"Each team keeps its tool; what changes is that every piece has one place where it's changed, and an owner who decides it. A product's owner lives in the data team's repository, and the catalogue and the platform's page copy it. As with the annals, nobody writes in a copy. Pick one piece where you work, such as a table's owner: where is its home, and how many copies does it have?"},
  "check":{q:"Why does a check compare every copy with its home, every night?",
    opts:[{t:"Because the sync always makes mistakes, so every copy has to be typed again."},{t:"Because a copy can still drift, if someone types into it or a sync stops. Drift is something a check finds, not something a person remembers, as the historians climbed to each archive and wrote down what they found.",ok:true},{t:"So the platform team can decide each morning who owns each table."}],
    why:"Even a copy made one way can drift: someone types into it, or a sync stops and nobody notices. The first night, the check found three, and by morning the sync had put them right and each owner knew what changed. Which copies where you work would anyone notice if they drifted?"}
  }}};
