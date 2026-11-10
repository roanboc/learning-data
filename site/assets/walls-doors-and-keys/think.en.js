/* Learning Data: "Pause and think" for Walls, doors and keys, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (who, doors, copies), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "who":{q:"The university's data sits in a cloud provider's buildings. Whose job is it to decide who may read it?",
    opts:[{t:"The university's: who gets in, and what each may do, is always its own.",ok:true},{t:"The cloud provider's: it secures the buildings, machines and network."},{t:"The platform's makers': their software checks every request that comes in.",near:true},{t:"Whoever the contract names: a contract can hand the data to someone else."}],
    why:"The cloud provider secures its buildings, its machines and the network between them; the platform's makers secure the software, and how it checks each request, by the rules it's given. Who gets in, and what each may do, are the university's to set, whatever the contract says: the data is always its own to protect. Who sets those rules for your data today?"},
  "doors":{q:"Someone reads the data's files straight from storage. What have they gone round?",
    opts:[{t:"Nothing much: storage keeps the same rules as the catalog, file by file."},{t:"The short list: storage can send its files anywhere, list or no list."},{t:"The catalog's checks: storage holds the files, with no masks and no rules.",ok:true},{t:"The masks only: storage still keeps every rule, apart from the masks.",near:true}],
    why:"Storage keeps files, and can say who may read a file, but it knows nothing of columns, masks or rules for rows: the catalog applies those, on every request that goes through it. Read the files straight from storage and all of them are skipped, which is why the back door stays shut, and only an admin account switched on for the task opens it. Who can read your storage directly today?"},
  "copies":{q:"An attacker takes over an admin account in the backups' own place apart. Why can't they wipe the copies?",
    opts:[{t:"The copies are encrypted, so without the key they can't be found."},{t:"Each copy is locked for thirty days: no one can delete it, not even an admin.",ok:true},{t:"The copies sit in a place apart, with admins of their own.",near:true},{t:"A copy is restored each month, so any deleted one comes back."}],
    why:"The place apart keeps production's admins away from the copies, but this attacker is one of its own admins. What stops them is the lock: for thirty days nobody can change or delete a copy, an admin included. The monthly restore proves a copy works; it doesn't bring back one that's gone. Could anyone with your admin rights delete your backups today?"}
  }}};
