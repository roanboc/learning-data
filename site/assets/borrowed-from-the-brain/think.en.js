/* Learning Data: "Pause and think" for Borrowed from the brain, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (cell, borrowed, sure), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "cell":{q:"A nerve cell's pulse is always the same size. So how does a brain learn anything?",
    opts:[{t:"Its cells fire more often as it learns, so a stronger pulse carries what it knows.",near:true},{t:"It grows a new nerve cell for each new thing it learns, and keeps it."},{t:"Its connections change: a link between two cells that fire together grows stronger.",ok:true}],
    why:"A pulse is all or nothing, so what changes is how strongly one cell's message reaches the next. Hebb proposed it in 1949, and experiments on rabbits in 1973 showed links growing stronger with use. Models took that one idea: a number for each connection, nudged as they learn. What in your work gets stronger the more it's used?"},
  "borrowed":{q:"What did today's models borrow from nerve cells?",
    opts:[{t:"An idea: simple units that add up weighted inputs, connections that change as they learn, and layers.",ok:true},{t:"A copy of how a brain works, scaled down: the same cells, pulses and chemistry, run on chips.",near:true},{t:"Only a name: the word neural was chosen to sell the idea, and nothing was taken from cells."}],
    why:"McCulloch and Pitts drew Cajal's cell as a unit that adds up its inputs and fires past a set level, Rosenblatt gave each connection a weight, and the layers came from Hubel and Wiesel's cells that fire for edges. But a real cell is far more complex: in 2021 it took a network of five to eight layers to mimic one, and a child learns a word from a few examples where a model needs a great many. Where else has a borrowed idea worked without copying the whole thing?"},
  "sure":{q:"Asked three times for a researcher's birthday, a model gave three different dates, all wrong. Why?",
    opts:[{t:"The fact was there, but each answer drew it from a different source, and those three sources disagreed.",near:true},{t:"The fact wasn't there, so it wrote likely words: a birthday has no pattern to learn, and tests reward a guess over a blank.",ok:true},{t:"Its temperature was turned up, so it made things up on purpose instead of giving the date it knew."}],
    why:"A model draws each word by chance from what's likely, and even turned right down a little chance stays, so a missing fact comes out a different way each time, each as fluent as the last. Brains fill gaps too, just as surely. A fluent answer isn't a checked one: check it against the evidence, as Cajal's drawings were checked. Which answers in your work arrive fluent, but unchecked?"}
  }}};
