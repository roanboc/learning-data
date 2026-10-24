/* Learning Data: "Pause and think" for The same problem, everywhere, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (written, first, machines), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "written":{q:"Why does governance sit at the centre of the DMBOK's wheel?",
    opts:[{t:"Because it's the oldest area of data management."},{t:"Because the other areas only fit together, and stay in balance, when someone has the authority to decide.",ok:true},{t:"Because governance is the tool the other areas run on."}],
    why:"Architecture, modelling, security, quality and metadata each pull their own way. Without someone with the authority to decide, each area makes its own choices and they drift apart, like the bank's business lines in 2008, each with its own names for the same customers. Where you work, who decides when two areas disagree?"},
  "first":{q:"Ten years after the banks' principles, why had so few of the biggest banks met them all?",
    opts:[{t:"The principles asked for technology the banks didn't have yet."},{t:"Their programmes were often underfunded, narrow, and short of attention from their boards.",ok:true},{t:"Most banks had decided the principles didn't apply to them."}],
    why:"The regulators also found old systems and manual work, but systems weren't the whole story: making data add up takes decisions, money, and attention from the top. Who at the top of your organisation answers for its data?"},
  "machines":{q:"What does Europe's AI law ask for, about the data AI learns from?",
    opts:[{t:"That AI systems learn only from data their makers created themselves."},{t:"Governance of the data that high-risk systems learn from.",ok:true},{t:"Nothing: the law covers what AI systems do, not their data."}],
    why:"A machine learns whatever its data teaches it, so the people training it have to ask where the data came from, and who decided they could use it. In 2024, the DMBOK added governance and ethics for AI, and a third edition is being written. If your team trained a model tomorrow, who would decide which data it may learn from?"}
  }}};
