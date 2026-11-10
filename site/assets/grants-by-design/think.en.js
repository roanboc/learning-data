/* Learning Data: "Pause and think" for Grants by design, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (doors, tomorrow, code), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  doors:{q:"The help desk has SELECT on the learner table, and no right on the registrar's catalog or its core shelf. What can it read?",
    opts:[{t:"The learner table: SELECT is the right that reads it, wherever it's given.",near:true},{t:"The learner table and the rest of core, as a right on a table opens its shelf."},{t:"Nothing: without USE CATALOG and USE SCHEMA, its SELECT opens no door.",ok:true}],
    why:"A group reads a table only with all three rights: into the room (USE CATALOG), onto the shelf (USE SCHEMA) and into the table (SELECT). SELECT alone opens nothing, as a site on the islands is reached only from its landing, along its trail. Where you work, who holds a right on a table that leads nowhere?"},
  tomorrow:{q:"Tonight the job builds a new table on the registrar's core shelf. Who can read it tomorrow morning?",
    opts:[{t:"Every group that reads core, from its first minute: the shelf's grants reach it.",ok:true},{t:"Nobody yet: its owner grants each reader once someone asks for the new table.",near:true},{t:"Everyone in the account, since BROWSE lets anyone find it and see what it holds."}],
    why:"A grant on a shelf reaches every table on it, those there today and every one made later. Nobody asks and nobody grants: the registrar's office, the help desk, Planning and the study read it from its first minute, each seeing what the policies show them. BROWSE lets everyone find it and ask for it, never read it. Where you work, how long does a new table wait for its first reader?"},
  code:{q:"Planning needs to read the registrar's reference shelf too. How does it get the grant?",
    opts:[{t:"Sam grants it in Catalog Explorer now, and writes it in the file afterwards.",near:true},{t:"A change to the plan's file, reviewed by the data team, deployed from main.",ok:true},{t:"Planning's lead grants it, since a group may pass on what it can read."}],
    why:"The plan is written once, as code, beside the job's: a few lines for each shelf and its readers. Mei decides who may see her records; the data team reviews the change to the file, Mei is told what it touches, and it goes down the path to production. Nobody can grant by hand: only the owners' group can, and its one member deploys only from main. Where you work, where is the list of who may read what, and who reviews a change to it?"}
  }}};
