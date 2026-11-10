/* Learning Data: "Pause and think" for Decades in the making, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (learns, power, web), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The module's labs come later, as one set, so no question
   has a "stop", and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "learns":{q:"In 1958, a newspaper said the Navy expected the perceptron to walk, talk and be conscious of its existence. What could it actually do?",
    opts:[{t:"Tell cards marked on the left from cards marked on the right, after fifty tries, by nudging its numbers after each wrong guess.",ok:true},{t:"Learn any pattern at all, given enough cards and tries, which is why the Navy thought it might one day walk and talk."},{t:"Tell left-marked cards from right-marked ones from the first try, because its numbers had been set by hand for the task.",near:true}],
    why:"It learned one simple thing from examples, which was new and real. The hopes ran far ahead of it: a single layer can't learn some patterns at all, and computers were slow. When a new tool arrives where you work, how do you tell what it does today from what people hope it will do?"},
  "power":{q:"In 2012, a network far ahead of the rest won an image contest. What was new about it?",
    opts:[{t:"It was the first network with more than one layer, so it could find shapes inside shapes that a single layer missed."},{t:"A new way for networks to learn, found that year, which let it train on far fewer photos than the networks before it.",near:true},{t:"Not the ideas, which were decades old, but the data and the power: over a million labelled photos, and chips fast enough to train it.",ok:true}],
    why:"Learning from examples was from 1958, and learning from mistakes in many layers from 1986. What changed was data and power: a million labelled photos, and chips made for games that do hundreds of small sums at once. Its five best guesses missed 15 times in a hundred; the next best entry, 26. What in your own work has waited, not for a new idea, but for the data or the power to do it?"},
  "web":{q:"The largest model of 2020 wrote fluently. Why wasn't it trying to help?",
    opts:[{t:"It had learned to answer questions from web text, but without feedback it often answered a different question from the one asked.",near:true},{t:"It had learned only to guess the next word of web text and books, so it carried on whatever it was given, a question with more questions.",ok:true},{t:"It had been told to keep its answers short, so it stopped before giving any help, after a sentence or two."}],
    why:"Guessing the next word, billions of times over, taught it grammar, facts and ways of writing, but not what a person asking wants. In 2022, training on the answers people preferred made a model helpful. Fluent writing isn't the same as trying to help: where might a fluent answer have fooled you?"}
  }}};
