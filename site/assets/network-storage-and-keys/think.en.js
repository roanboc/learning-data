/* Learning Data: "Pause and think" for Network, storage and keys, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (files, walls, key), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "files":{q:"Six people used to read the files straight from the storage. Why does Sam send them through the catalog instead?",
    opts:[{t:"The catalog keeps a faster copy of every table, so reading through it saves the university time and money."},{t:"The storage keeps no record of who reads it, so a read straight from the files could never be checked later.",near:true},{t:"In the files no grant, mask or filter applies; through the catalog, each gets only what their group may see.",ok:true}],
    why:"In the storage, a file is just its rows: no grant, mask or filter applies to whoever reads it. The storage's own log does record every read, so the trouble isn't that reads go unseen; it's that nothing there applies the rules. Through the catalog, each read is checked against the reader's group's grants, with the masks and filters applied. Who can read your platform's files without asking its catalog?"},
  "walls":{q:"Jun has a grant on the registrar catalog, but a notebook in development can't read it. Why?",
    opts:[{t:"The catalog is bound to the production workspace, so from any other workspace it isn't there, grant or not.",ok:true},{t:"Binding the catalog took Jun's grant away, so he has to ask for it again in each workspace he works in.",near:true},{t:"The development workspace has no private endpoint, so its notebooks can't reach the catalog at all."}],
    why:"Jun's grant is still there: the binding decides where it counts. Production's catalogs are bound to the production workspace alone, so from development they aren't there, and a notebook there can't reach production's real records, grant or not. Every workspace has its private endpoint, so the network isn't what stops it. Which of your catalogs can be reached from a workspace that shouldn't see them?"},
  "key":{q:"The files were already encrypted. What does a key the university holds add?",
    opts:[{t:"Everyone with a grant needs the key as well, so a stolen sign-in alone can't open any of the files."},{t:"The university decides who may use the key, sees every use, and can take it back so nobody reads the files.",ok:true},{t:"The files are now encrypted for the first time, so a disk stolen from the cloud would show nothing.",near:true}],
    why:"The files were always encrypted, with a key the cloud provider kept for the university. Now the key is the university's own, in a vault its security team keeps: the storage may use it, never take it out, every use is recorded, and if the key is taken back, nobody can read the files, the provider included. People never handle the key: a grant is still what lets them read. Who could switch off or delete your platform's keys today?"}
  }}};
