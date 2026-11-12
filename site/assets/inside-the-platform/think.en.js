/* Learning Data: "Pause and think" for Inside the platform, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (products, nothing, whose), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question names a "stop"
   (the lab a question opens) and none has a lab link. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  products:{q:"Ravi draws the platform's eight parts before he names a single product. What does that give him?",
    opts:[{t:"Products change, so he leaves them off his drawings for good, and keeps a list of them somewhere else.",near:true},{t:"A drawing that lasts while the products change, and that shows at once a part with nothing under it.",ok:true},{t:"One product for each of the parts, so the platform never needs more than eight tools to run."}],
    why:"What a data platform has to do stays much the same, so drawn first, its parts last while the products under them change. Then a product goes under each part, and a part with nothing under it shows at once: here, observe. The products aren't left off for good, and a part can take more than one, as secure takes three. What would your own platform's eight parts have under them?"},
  nothing:{q:"Finance asks why the platform's bill is up by half since June. Why can't anyone say which jobs made it grow?",
    opts:[{t:"The platform keeps no record of its runs or what they cost, so there's nothing anyone can look at.",near:true},{t:"Finance owns the bill, so the domains and the platform team never see what their work costs."},{t:"The platform keeps its records, but nobody reads them: each domain watches only its own work.",ok:true}],
    why:"The platform writes down every job's runs, every query and what each one costs, in its system tables. Nobody read them: each domain watched its own data products, and nobody watched the whole. So the only choices were poor ones: pay the bill, or cut every domain back, whether it grew or not. Who reads your platform's own records today?"},
  whose:{q:"Who should build the part that watches the platform's health, and what it costs?",
    opts:[{t:"The platform team: watching the platform serves every domain, so no one domain should build it.",ok:true},{t:"Each domain, for its own share of the platform, since each owns the logic it runs on the platform.",near:true},{t:"Finance, since it raised the ticket, pays the whole bill and checks the result every month."}],
    why:"Each domain's logic belongs to the business, but the platform's health and cost belong to the platform team. Like the station on the mountain, which the road's owner kept for the whole road, watching the platform serves every domain. Finance asks in a ticket and checks the result; the platform team builds the part. Who watches your platform as a whole?"}
  }}};
