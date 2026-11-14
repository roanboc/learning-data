/* Learning Data: "Pause and think" for One platform, or many, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (layers, mesh, unavoid), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). A question's "stop" is the lab of the series it opens, on the series' labs page;
   a question without one has no lab link. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  layers:{q:"A third product would query both platforms where they are, so no data would move. What would it still cost?",
    opts:[{t:"A third set of rules: rights, masks, lineage and logs, each kept again, and kept in step with the other two.",ok:true},{t:"A third copy of the data, since it would keep both platforms' tables itself to answer each query quickly.",near:true},{t:"Nothing that lasts: once it's built, the analysts own it, and the platform team never needs to touch it."}],
    why:"Nothing would move, but every platform brings its own way to say who may see what, its own masks, lineage and log. A third product would mean customers' readings masked twice, two ways, an analyst's rights granted in three places, and the measure's lineage stopping at every border. The toll is paid in rules, not copies. How many places grant one analyst's rights in your organisation?"},
  mesh:{q:"In a data mesh, each domain owns its data. Does that mean each domain runs its own platform?",
    opts:[{t:"No: one central data team owns every domain's data, and each domain asks it, in a ticket, for what it needs."},{t:"Yes: owning its data means each domain picks and runs its own platform, under rules the domains agree.",near:true},{t:"No: each domain owns its data, as products, on one self-serve platform that every domain shares.",ok:true}],
    why:"Ownership is spread out; the platform isn't. Zhamak Dehghani's data mesh puts each domain's data products on a self-serve platform, under rules the domains agree together, and that platform is one, shared. Done that way, a mesh is often the simplest architecture: one platform, many owners. Done badly, it's the old teams with new names. Who owns each data product on your platform?"},
  unavoid:{stop:"second",q:"When is a second data platform worth keeping?",
    opts:[{t:"When a part of the business already bought one, since each domain should choose the tools it knows best."},{t:"Only for a reason you can name: a company just bought, a separate legal entity, data that must stay in its country.",ok:true},{t:"Whenever open table formats and a federated catalogue join the two, since then no rule has to be kept twice.",near:true}],
    why:"Open table formats and a federated catalogue lessen the harm: both platforms read the same files, and people find all the data in one place. But each platform keeps its own permissions, policies and logs, so the second set of rules stays. Like the shogunate's checkpoints, a second platform is kept only for a reason anyone can name; generation's had none, so it moved. Which of your platforms has a reason you could name?"}
  }}};
