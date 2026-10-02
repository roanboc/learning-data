/* Learning Data: "Pause and think" for Written once, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (four, where, diagrams, version), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "four":{stop:"home",q:"The tooltip is right. Why isn't it the fix?",
    opts:[{t:"It is: copy its words into the other three."},{t:"It's right by luck: a copy that happens to match the definition in model/conceptual.yml, and nothing keeps it so.",ok:true},{t:"Because people read the catalog, not the tooltip: fix the catalog first."}],
    why:"The tooltip matches the home, the definition Mei approved in model/conceptual.yml, but nothing keeps it that way. Fixing the three wrong copies by hand only makes four copies again; each has to be driven from the home."},
  "where":{stop:"where",q:"Is a decision log duplication?",
    opts:[{t:"Yes: the YAML already says what was decided."},{t:"No: the YAML says what is true now; the log says why, when and who decided.",ok:true},{t:"Only when the YAML has a description."}],
    why:"Nothing in the build holds why. Without the log, the next person reopens the decision."},
  "diagrams":{stop:"where",q:"Why draw one diagram by hand and generate the other?",
    opts:[{t:"Hand-drawn diagrams look better, so the important one is drawn."},{t:"The conceptual one shows meaning, which people decide and which rarely changes; the physical one shows structure, which changes with every YAML edit.",ok:true},{t:"dbt can't generate a conceptual diagram yet; one day both will be generated."}],
    why:"Drawn by hand, the conceptual diagram can say what matters and leave out the rest. The physical diagram shows every table, column and key; drawn by hand, it would be out of date within a week."},
  "version":{stop:"version",q:"When is a change breaking?",
    opts:[{t:"Whenever the model's SQL changes."},{t:"When a reader of the model as it is would get an error or a different meaning.",ok:true},{t:"When it adds a column."}],
    why:"A column removed or renamed, a type, a grain or a value's meaning changed. Adding a column usually isn't. A breaking change to a public model is a new version, with a deprecation date and the exposures told."}
  }}};
