/* Learning Data: "Pause and think" for Older than the systems, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (model, meet, person, logical), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "model":{stop:"parts",q:"A driving licence, a vendor certification and a PhD. What do they have in common?",
    opts:[{t:"Nothing much: they're different things, from different places."},{t:"The same parts: an issuer, a holder, a claim, evidence and a date, which someone else can check.",ok:true},{t:"They're all stored in databases."}],
    why:"The materials and the issuers differ; the parts don't. That's why one conceptual model fits every credential, and outlasts every system that stores one."},
  "meet":{stop:"fit",q:"Six systems each need to share credentials. Connected in pairs, how many translations could that take? And through one shared model?",
    opts:[{t:"Six in pairs, six through a model."},{t:"Fifteen in pairs, six through a model.",ok:true},{t:"Thirty in pairs, one through a model."}],
    why:"Every pair of six systems is 6 × 5 ÷ 2 = 15 translations. Through a shared model, each system is translated once: six, and the meaning is written in one place."},
  "person":{stop:"source",q:"Aisha's email differs between the learning platform and IT's directory. Which should everyone use?",
    opts:[{t:"Whichever was changed most recently."},{t:"The one in the system of record for email: IT's directory.",ok:true},{t:"The learning platform's, because she uses it most."}],
    why:"Each fact has one system of record, where it's created and corrected. Other systems hold copies, and should take them from there."},
  "logical":{stop:"fit",q:"The logical model names no database and no product. Why is that an advantage?",
    opts:[{t:"It isn't: it can't be built until it names one."},{t:"It can be held against any system: to choose a package, map its fields, or move to a new one.",ok:true},{t:"It saves licence costs."}],
    why:"Because it's precise but not technical, the logical model is a yardstick that outlasts every system held up to it."}
  }}};
