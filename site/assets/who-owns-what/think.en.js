/* Learning Data: "Pause and think" for Who owns what, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (domains, access, grants, shared), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "domains":{stop:"domains",q:"Who owns the meaning of a microcredential?",
    opts:[{t:"Mei, at the registrar's office: she owns every credential."},{t:"The learning team: it owns the microcredential kind, within the credential Mei owns.",ok:true},{t:"Noor's group: it builds core_credential."}],
    why:"The student domain's conceptual model, models/core/student/_student__conceptual.yml, names the learning team owner of the microcredential kind (and of badges). The credential as a whole is Mei's, which is why core_credential's meta.owner is hers; the learning team decides what a microcredential is, within it. The LMS and SC key sets are the learning team's too, written on its sources."},
  "access":{stop:"access",q:"The wallet refers to Planning's mart, and dbt allows it. Why is that still wrong?",
    opts:[{t:"It isn't: if dbt allows it, it's fine."},{t:"The mart is shaped for Planning's question and changes when Planning needs it to. The wallet should build on the public core.",ok:true},{t:"Because the mart is private to Planning's group."}],
    why:"The mart is Planning's consumer contract. The wallet would silently depend on another consumer's choices. Consumers build on the public core; in one project, only review stops the shortcut."},
  "grants":{stop:"read",q:"Can a private model's table be read?",
    opts:[{t:"No: private hides it from everyone outside its group."},{t:"Yes, if a grant allows it.",ok:true},{t:"Only by models in the same group."}],
    why:"Access is about which models can ref() which, when dbt parses. Reading a table is the platform's grants."},
  "shared":{stop:"shared",q:"What breaks first when domains stop sharing keys?",
    opts:[{t:"The build: the key tests fail."},{t:"Joins across domains: the same learner gets two keys, and joins find nothing.",ok:true},{t:"Nothing, as long as each project's keys are unique."}],
    why:"The same learner gets two keys, joins across domains find nothing, and counts drift apart, with no test failing in either project."}
  }}};
