/* Grants by design: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's films and pages: el permiso for a grant, dar un permiso for granting; el catálogo, el esquema, la tabla; el estante for the film's shelf
   and la sala for its room; los derechos for the three rights (the names on screen, USE CATALOG, USE SCHEMA, SELECT and BROWSE, stay as they are); el propietario
   for an owner in the catalog, and la dueña de los datos for Mei, as the series says, so "two kinds of owner" is dos tipos de dueño; la oficina del registro and
   los datos del registro; la mesa de ayuda, Planificación, el estudio, la Facultad de Salud; el apoyo en exámenes; el equipo de datos; desarrollo, pruebas y
   producción; el proceso for the job; el espacio de trabajo and vincular, as Red, almacenamiento y llaves says; la cuenta de administrador, encendida; quien aprueba
   las entregas, as De una rama a producción says; la credencial and la tabla de estudiantes, as the site says; las políticas, sin máscara. The shelves keep their
   names on screen (staging, intermediate, core, reference, published, support), and so do registrar owners, registrar-loader, studies, health progress and main.
   The islands: el parque nacional, la Estación Charles Darwin, los guías, el sendero, el desembarcadero, los lobos marinos, los flamencos, la laguna. The films the
   narration names keep their Spanish titles: Gobernanza en Unity Catalog, Red, almacenamiento y llaves, De una rama a producción. Numbers as the site writes them
   (290,404). The film is Permisos por diseño. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"The Galápagos, in the late 1960s.":
"Las Galápagos, a fines de los sesenta.",
"Volcanic islands, about a thousand kilometres west of Ecuador, whose animals don't fear people.":
"Islas volcánicas, a unos mil kilómetros al oeste de Ecuador, cuyos animales no temen a las personas.",
"Now boats bring visitors, more each year.":
"Ahora los barcos traen visitantes, más cada año.",
"Scientists and guides fear what all those feet will do.":
"Científicos y guías temen lo que harán tantos pies.",
"Visitors could walk anywhere, a step from nesting birds, iguanas and sea lions.":
"Podrían caminar por cualquier parte, a un paso de aves anidando, iguanas y lobos marinos.",
"Nests could be trampled and the lava worn down, and coral is already being carried off.":
"Los nidos podrían quedar pisoteados y la lava, desgastada, y ya se están llevando el coral.",
"Birds could leave for good, and many of the islands' animals live nowhere else.":
"Las aves podrían irse para siempre, y muchos animales de las islas no viven en otro lugar.",
"Something has to change, before visitors come in thousands.":
"Algo tiene que cambiar, antes de que los visitantes lleguen por miles.",
"So the national park, on the Darwin Research Station's advice, plans the visits once, for the whole park.":
"Así que el parque nacional, aconsejado por la Estación Charles Darwin, planifica las visitas una vez, para todo el parque.",
"Most of the park gets no visitors at all.":
"La mayor parte del parque no recibe visitas.",
"A few sites near the coast are open, each along its own marked trail.":
"Unos pocos sitios junto a la costa se abren, cada uno con su sendero marcado.",
"Every group walks with a trained guide.":
"Cada grupo camina con un guía capacitado.",
"And the rules are the same for everyone: keep to the trail; touch nothing, feed nothing, take nothing.":
"Y las reglas son las mismas para todos: seguir el sendero; no tocar nada, no alimentar nada, no llevarse nada.",
"A new boat, a new guide, a new visitor: each fits the plan the day they arrive.":
"Un barco nuevo, un guía nuevo, un visitante nuevo: cada uno encaja en el plan el día que llega.",
"In 1982, twenty-five thousand people visit, and the sites they walk are near pristine.":
"En 1982, veinticinco mil personas visitan las islas, y los sitios que recorren están casi intactos.",
"Flamingos have nested again beside a visited lagoon, for the first time in fourteen years.":
"Los flamencos han vuelto a anidar junto a una laguna visitada, por primera vez en catorce años.",
"In 2025, 290,404 people came, still on the trails, still with a guide.":
"En 2025 llegaron 290,404 personas, todavía por los senderos, todavía con un guía.",
"A university's data has visitors too.":
"Los datos de una universidad también tienen visitas.",
"Opened one table at a time, some wait for what they need, and some reach what they shouldn't.":
"Abiertos tabla por tabla, algunos esperan lo que necesitan, y otros alcanzan lo que no deberían.",
"So, as on the islands, its grants are designed once, by area and role.":
"Así que, como en las islas, sus permisos se diseñan una vez, por área y por rol.",
"Every person and every new table fits the plan from its first day.":
"Cada persona y cada tabla nueva encaja en el plan desde su primer día.",

"At the university, the data platform keeps each area's records in Unity Catalog.":
"En la universidad, la plataforma de datos guarda los registros de cada área en Unity Catalog.",
"In Governed in Unity Catalog, every table sat in one catalog, and its readers were groups.":
"En Gobernanza en Unity Catalog, cada tabla estaba en un solo catálogo, y sus lectores eran grupos.",
"But each grant was made by hand, on one table, when someone asked.":
"Pero cada permiso se daba a mano, sobre una tabla, cuando alguien lo pedía.",
"Fifty-eight tables, a hundred and sixty-three grants, each made on its own.":
"Cincuenta y ocho tablas, ciento sesenta y tres permisos, cada uno dado por separado.",
"A new table waited six days, on average, for its first reader.":
"Una tabla nueva esperaba seis días, en promedio, a su primer lector.",
"And whoever made a table owned it: nine belonged to a person, and two of those people had left.":
"Y quien hacía una tabla era su propietario: nueve eran de una persona, y dos de esas personas ya se habían ido.",
"To say who could read what, someone had to read every grant.":
"Para decir quién podía leer qué, alguien tenía que leer cada permiso.",
"Now each area has a catalog of its own, and the registrar's tables are moving into theirs.":
"Ahora cada área tiene su propio catálogo, y las tablas del registro se están mudando al suyo.",
"Mei Tanaka owns them, for the registrar's office, and asks for a plan before a single grant.":
"Mei Tanaka es su dueña, por la oficina del registro, y pide un plan antes de un solo permiso.",

"In Unity Catalog, a table sits in a schema, and a schema in a catalog.":
"En Unity Catalog, una tabla está en un esquema, y un esquema en un catálogo.",
"Think of the catalog as a room, and each schema as a shelf in it.":
"Piensa en el catálogo como una sala, y en cada esquema como un estante en ella.",
"To read a table, a group needs three rights: into the room, onto the shelf, and into the table.":
"Para leer una tabla, un grupo necesita tres derechos: entrar a la sala, al estante y a la tabla.",
"USE CATALOG, USE SCHEMA and SELECT.":
"USE CATALOG, USE SCHEMA y SELECT.",
"Like a landing, a trail and a site: all three, or none.":
"Como un desembarcadero, un sendero y un sitio: los tres, o ninguno.",
"SELECT on a table, without the first two, opens nothing.":
"SELECT en una tabla, sin los dos primeros, no abre nada.",
"One more right lets everyone look without reading: BROWSE.":
"Un derecho más deja que todos miren sin leer: BROWSE.",
"With it, anyone can find a table, see what it holds and who owns it, and ask for it.":
"Con él, cualquiera puede encontrar una tabla, ver qué guarda y quién es su propietario, y pedirla.",

"So the plan starts from who reads what, as the islands' plan started from where people may walk.":
"Así que el plan parte de quién lee qué, como el plan de las islas partió de por dónde se puede caminar.",
"Every area's catalog gets the same shelves, one for each set of readers.":
"El catálogo de cada área recibe los mismos estantes, uno por cada conjunto de lectores.",
"Staging and intermediate hold the build's own steps, and nobody reads them.":
"Staging e intermediate guardan los pasos de la propia construcción, y nadie los lee.",
"Core holds the area's records; reference, the lists they use; published, totals for everyone.":
"Core guarda los registros del área; reference, las listas que usan; published, totales para todos.",
"And the registrar's catalog has one more: support, for the exam support only a few may see.":
"Y el catálogo del registro tiene uno más: support, para el apoyo en exámenes que solo unos pocos pueden ver.",
"Then each shelf gets its readers, always a group, never a person.":
"Luego cada estante recibe a sus lectores: siempre un grupo, nunca una persona.",
"The registrar's office reads core and reference; the few who arrange exam support read support.":
"La oficina del registro lee core y reference; los pocos que organizan el apoyo en exámenes leen support.",
"The help desk and Planning read core, and the policies decide what each of them sees.":
"La mesa de ayuda y Planificación leen core, y las políticas deciden qué ve cada una.",
"The data team builds in development, on made-up records, so here it holds nothing of its own.":
"El equipo de datos construye en desarrollo, con registros inventados, así que aquí no tiene nada propio.",
"A grant goes on a catalog or a shelf, never on one table.":
"Un permiso va en un catálogo o un estante, nunca en una sola tabla.",
"A table that needs other readers belongs on another shelf.":
"Una tabla que necesita otros lectores va en otro estante.",

"A grant on a shelf reaches every table on it: those there today, and every one made later.":
"Un permiso en un estante llega a cada tabla que hay en él: las de hoy, y todas las que se hagan después.",
"When a new version of the credential table arrives, the readers of core read it from its first minute.":
"Cuando llega una nueva versión de la tabla de credenciales, los lectores de core la leen desde su primer minuto.",
"Nobody asks, and nobody grants.":
"Nadie lo pide, y nadie da permisos.",
"When the exam support table arrives, it goes on its own shelf, and only those who arrange exam support can read it.":
"Cuando llega la tabla de apoyo en exámenes, va a su propio estante, y solo quienes organizan ese apoyo pueden leerla.",
"The help desk, Planning and the study read core, so none of them ever sees it.":
"La mesa de ayuda, Planificación y el estudio leen core, así que ninguno la ve nunca.",
"Like a new boat at the islands, it keeps the plan from the day it arrives.":
"Como un barco nuevo en las islas, sigue el plan desde el día en que llega.",

"Every catalog, shelf and table has an owner, and the owner can do anything with it, even let anyone read it.":
"Cada catálogo, estante y tabla tiene un propietario, que puede hacer cualquier cosa con él, incluso dejar que cualquiera lo lea.",
"Whoever makes it is its first owner.":
"Quien lo hace es su primer propietario.",
"So the registrar's catalog, and everything in it, is handed to a group: registrar owners.":
"Así que el catálogo del registro, y todo lo que contiene, pasa a un grupo: registrar owners.",
"No person is in it, only registrar-loader, the identity that builds the tables and deploys the plan.":
"No hay ninguna persona en él, solo registrar-loader, la identidad que construye las tablas y despliega el plan.",
"When someone leaves, no table is left without its owner, and no one person can open one up.":
"Cuando alguien se va, ninguna tabla queda sin propietario, y ninguna persona sola puede abrir una.",
"Mei still decides who may see the records: she owns them, for the registrar's office.":
"Mei sigue decidiendo quién puede ver los registros: es su dueña, por la oficina del registro.",
"Two kinds of owner: Mei says who may see them, and the group is who may change them.":
"Dos tipos de dueño: Mei dice quién puede verlos, y el grupo es quien puede cambiarlos.",

"In Network, storage and keys, each catalog was bound to its own workspace, so a grant isn't enough from anywhere else.":
"En Red, almacenamiento y llaves, cada catálogo se vinculó a su espacio de trabajo: desde otro, un permiso no basta.",
"Anil Kurian's study works in a workspace of its own, studies, where nothing can be downloaded or copied out.":
"El estudio de Anil Kurian trabaja en un espacio de trabajo propio, studies, donde nada se puede descargar ni copiar afuera.",
"The registrar's catalog is bound there too, but read only.":
"El catálogo del registro también se vincula ahí, pero solo para leer.",
"From there, the study reads the learner table, as far as its grants allow, and can never write to it, whatever a grant says.":
"Desde ahí, el estudio lee la tabla de estudiantes según sus permisos, y nunca puede escribir en ella, diga lo que diga un permiso.",
"What it makes goes in its own space, health progress, made for its agreement and deleted when the agreement ends.":
"Lo que produce va a su propio espacio, health progress, hecho para su acuerdo y borrado cuando el acuerdo termina.",
"Look, don't touch, as on the islands' trails.":
"Mirar sin tocar, como en los senderos de las islas.",

"The plan is written once, as two files beside the job's code in GitHub.":
"El plan se escribe una vez, en dos archivos junto al código del proceso en GitHub.",
"Each shelf and its readers take a few lines.":
"Cada estante y sus lectores ocupan unas pocas líneas.",
"The data team reviews each change to those files, and Mei is told what it touches.":
"El equipo de datos revisa cada cambio en esos archivos, y a Mei le avisan qué toca.",
"A study's grant is made from its agreement's contract, and names it: 2026-14, until 30 June 2027.":
"El permiso de un estudio sale del contrato de su acuerdo, y lo nombra: 2026-14, hasta el 30 de junio de 2027.",
"The study's policies go in first, and its grant after them, so it never reads the table unmasked.":
"Primero entran las políticas del estudio, y su permiso después, así que nunca lee la tabla sin máscara.",
"Then the path of From a branch to production: test first, then production, once a release approver says yes.":
"Luego, el camino de De una rama a producción: primero pruebas, luego producción, cuando quien aprueba las entregas dice que sí.",
"And nobody can grant by hand: only the owners' group can, and its one member deploys only from main.":
"Y nadie puede dar permisos a mano: solo el grupo de propietarios, y su único miembro despliega solo desde main.",
"Anything else takes an admin account, switched on, approved and recorded.":
"Todo lo demás requiere una cuenta de administrador, encendida, aprobada y registrada.",

"On the islands, the plan came first, and every visitor since has walked inside it.":
"En las islas, el plan vino primero, y cada visitante desde entonces ha caminado dentro de él.",
"At the university, the plan comes first too.":
"En la universidad, el plan también viene primero.",
"The registrar's office reads its records; the study, only what its agreement allows; everyone else can find what exists, and ask.":
"La oficina del registro lee sus registros; el estudio, solo lo que permite su acuerdo; los demás pueden encontrar lo que existe, y pedirlo.",
"Every new table, and every new person, fits the plan from its first day.":
"Cada tabla nueva, y cada persona nueva, encaja en el plan desde su primer día.",
"Design the grants once, by area and role.":
"Diseña los permisos una vez, por área y por rol."
});
