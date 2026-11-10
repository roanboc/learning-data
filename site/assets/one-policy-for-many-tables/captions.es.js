/* One policy for many tables: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in Who may see it, Show the least and Governed in Unity Catalog: the classes are directa, indirecta, especial, seudónima and ninguna; a policy una política;
   a tag una etiqueta; a mask una máscara, and its stars asteriscos; a shelf (schema) un estante; a grant un permiso; the registrar's office la oficina de registro;
   the help desk la mesa de ayuda; the study el estudio; a row filter un filtro de filas. The ways: enmascararlo entero, enmascararlo en parte, generalizar, filtrar filas,
   dejarlo fuera. The guidebook la guía; a guide (its orange page) una guía; Guide 111 la Guía 111. The films: Conoce lo que guardas, Muestra lo mínimo, Permisos diseñados,
   Gobernanza en Unity Catalog, Etiquetas que viajan, Agentes de IA en el trabajo con datos, Prueba de que se cumplió, Copias que mantienen las reglas. Numbers keep the
   picture's comma (2,000); tool names (registrar-loader, Databricks Runtime) as written. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"North America, in the 1970s.":
"América del Norte, en los años setenta.",
"When a truck or a train carrying dangerous chemicals crashed, the first to arrive were firefighters and police.":
"Cuando chocaba un camión o un tren con sustancias peligrosas, los primeros en llegar eran bomberos y policías.",
"Their guide gave each chemical a page of its own: a few dozen in all.":
"Su guía daba a cada sustancia una página propia: unas pocas decenas en total.",
"To find the page, a crew had to know exactly what was inside,":
"Para hallar la página, el equipo tenía que saber exactamente qué llevaba,",
"often from papers in the driver's cab, close to the wreck.":
"a menudo por papeles en la cabina del conductor, junto al choque.",
"And thousands of chemicals had no page at all.":
"Y miles de sustancias no tenían ninguna página.",
"Guess wrong, and a crew might spray water on a chemical that gives off a poison gas when wet,":
"Si adivinaba mal, podía echar agua sobre una sustancia que, mojada, suelta un gas venenoso,",
"with families still in the houses nearby.":
"con familias aún en las casas cercanas.",
"Something had to change.":
"Algo tenía que cambiar.",
"In 1980, the US Department of Transportation changed the book.":
"En 1980, el Departamento de Transporte de EE. UU. cambió la guía.",
"Chemicals that behave alike in a fire or a spill share one guide, written once.":
"Las sustancias que se comportan igual en un incendio o derrame comparten una guía, escrita una vez.",
"Each chemical's four-digit number leads to its guide,":
"El número de cuatro cifras de cada sustancia lleva a su guía,",
"so a new chemical needs only one line: its number, and its guide.":
"así que una sustancia nueva solo necesita una línea: su número y su guía.",
"And a load no one can name gets Guide 111, which assumes every danger.":
"Y una carga que nadie puede nombrar recibe la Guía 111, que supone todos los peligros.",
"Today's book, from Canada, the United States and Mexico, has 62 guides for nearly 2,000 numbers.":
"La guía de hoy, de Canadá, Estados Unidos y México, tiene 62 guías para casi 2,000 números.",
"A crew reads the number through binoculars, from upwind,":
"El equipo lee el número con binoculares, a favor del viento,",
"and knows what to do, and how far back to keep people, before it goes near.":
"y sabe qué hacer, y a qué distancia mantener a la gente, antes de acercarse.",
"Data has the same problem: a mask written table by table protects nothing until someone writes it.":
"Los datos tienen el mismo problema: una máscara escrita tabla por tabla no protege nada hasta que alguien la escribe.",
"One policy for each class, found by its tag, protects every table that holds it, the day it appears.":
"Una política por clase, hallada por su etiqueta, protege cada tabla que la tenga, el día en que aparece.",
"So a learner's name stays hidden, wherever it lands.":
"Así, el nombre de un estudiante sigue oculto, llegue a donde llegue.",
"On Tuesday 13 October, Mei Tanaka gave every column of the registrar's data its class, in Know what you hold.":
"El martes 13 de octubre, Mei Tanaka dio su clase a cada columna de los datos de registro, en Conoce lo que guardas.",
"Show the least chose how to hide each one: a name masked whole, a date of birth cut to its year.":
"Muestra lo mínimo eligió cómo ocultar cada una: el nombre, enmascarado entero; la fecha de nacimiento, a su año.",
"Her catalog holds 38 tables with personal data: 140 columns to hide.":
"Su catálogo tiene 38 tablas con datos personales: 140 columnas que ocultar.",
"By hand, that's 140 masks, set one table at a time, by someone who remembers.":
"A mano, son 140 máscaras, puestas tabla por tabla, por alguien que se acuerde.",
"But Grants by design gives each shelf its readers, so a new table is read from its first minute.":
"Pero Permisos diseñados da a cada estante sus lectores: una tabla nueva se lee desde su primer minuto.",
"A mask set by hand comes later, if at all,":
"Una máscara puesta a mano llega después, si llega,",
"and until then, everyone on the shelf reads every name.":
"y hasta entonces, todos en el estante leen cada nombre.",
"So Sam Okafor, who runs the platform, writes one policy for each class, on the whole catalog.":
"Así que Sam Okafor, que lleva la plataforma, escribe una política por clase, en todo el catálogo.",
"A policy has four parts.":
"Una política tiene cuatro partes.",
"Where it sits: on the registrar's catalog, it covers every shelf and every table, now and later.":
"Dónde está: en el catálogo de registro, cubre cada estante y cada tabla, ahora y después.",
"Whom it covers: everyone, except the groups it lets through.":
"A quién cubre: a todos, salvo los grupos que deja pasar.",
"What it finds: each column whose class is direct, by its tag, in any table.":
"Qué encuentra: cada columna de clase directa, por su etiqueta, en cualquier tabla.",
"And what it does: mask it whole.":
"Y qué hace: enmascararla entera.",
"Governed in Unity Catalog wrote one like it.":
"Gobernanza en Unity Catalog escribió una así.",
"Sam writes one for each class that's hidden: special, direct, pseudonymous and indirect.":
"Sam escribe una por cada clase que se oculta: especial, directa, seudónima e indirecta.",
"One more decides rows, not values: the study sees only the Faculty of Health's learners.":
"Otra más decide filas, no valores: el estudio ve solo a los estudiantes de la Facultad de Salud.",
"It sits on the shelf the study reads, core, and finds each table's faculty column by its tag.":
"Está en el estante que lee el estudio, core, y halla la columna de facultad de cada tabla por su etiqueta.",
"A filter needs its column, so every table with learners in it carries their faculty:":
"Un filtro necesita su columna, así que cada tabla con estudiantes lleva su facultad:",
"one without would show the study every learner.":
"una sin ella le mostraría al estudio a todos.",
"Each way is a small function, written once, on the catalog's shelf for policies.":
"Cada forma es una pequeña función, escrita una vez, en el estante de políticas del catálogo.",
"Mask it whole: words become three stars, and anything else is left empty.":
"Enmascararlo entero: las palabras se vuelven tres asteriscos, y lo demás queda vacío.",
"Mask it in part, for the help desk: the last two digits, and the email's first letter.":
"Enmascararlo en parte, para la mesa de ayuda: los dos últimos dígitos, y la primera letra del correo.",
"Generalise: a date of birth becomes the first of January of its year.":
"Generalizar: una fecha de nacimiento se vuelve el primero de enero de su año.",
"A mask gives back the column's own type: a date stays a date, or the query fails.":
"Una máscara devuelve el tipo de la columna: una fecha sigue siendo fecha, o la consulta falla.",
"Filter rows: a yes or a no for each row: is this learner in the Faculty of Health?":
"Filtrar filas: un sí o un no por fila: ¿este estudiante es de la Facultad de Salud?",
"The other ways aren't masks.":
"Las otras formas no son máscaras.",
"The learner code is made at the source, with a key the registrar's office keeps.":
"El código del estudiante se hace en el origen, con una clave que guarda la oficina de registro.",
"And exam support is left out: the study has no grant to its shelf.":
"Y el apoyo en exámenes se deja fuera: el estudio no tiene permiso en su estante.",
"A policy covers everyone but the groups it lets through:":
"Una política cubre a todos menos a los grupos que deja pasar:",
"owning a table isn't enough, nor is an admin account.":
"ser dueño de una tabla no basta, ni una cuenta de administración.",
"Who's on each list is Mei's decision: her office sees the learner table whole.":
"Quién está en cada lista lo decide Mei: su oficina ve entera la tabla de estudiantes.",
"The builder, registrar-loader, is let through too, or every table it built would hold stars.":
"Quien construye, registrar-loader, también pasa, o cada tabla que construyera tendría asteriscos.",
"The help desk is let through the policy that masks names whole,":
"La mesa de ayuda pasa la política que enmascara los nombres enteros,",
"and given the one that masks them in part.":
"y recibe la que los enmascara en parte.",
"Each reader gets one mask for each column:":
"Cada lector recibe una máscara por columna:",
"two different masks for one person stop the query with an error.":
"dos máscaras distintas para una persona detienen la consulta con un error.",
"The study is let through the policy for the learner code:":
"El estudio pasa la política del código del estudiante:",
"its agreement allows a code in place of who they are.":
"su acuerdo permite un código en lugar de quiénes son.",
"An agent is never on a list: it reads with its own role's rights, as AI agents in data work shows.":
"Un agente nunca está en una lista: lee con los derechos de su rol, como muestra Agentes de IA en el trabajo con datos.",
"Only compute that applies policies can read these tables: serverless, or Databricks Runtime 16.4 and above.":
"Solo el cómputo que aplica políticas puede leer estas tablas: serverless, o Databricks Runtime 16.4 o superior.",
"Older compute is refused.":
"El cómputo más antiguo se rechaza.",
"On Wednesday 21 October, Jun's new model is built for the first time: each learner's progress, year by year.":
"El miércoles 21 de octubre, el nuevo modelo de Jun se construye por primera vez: el avance de cada estudiante, año a año.",
"Its columns bring their classes from its sources, as Tags that travel showed,":
"Sus columnas traen sus clases de sus fuentes, como mostró Etiquetas que viajan,",
"and Mei's level comes with it.":
"y el nivel de Mei viene con él.",
"It's the 39th table, and nobody writes a mask.":
"Es la tabla 39, y nadie escribe una máscara.",
"From its first minute, the help desk sees part of each student number, and Planning sees stars.":
"Desde su primer minuto, la mesa de ayuda ve parte de cada número de estudiante, y Planificación ve asteriscos.",
"And the study sees only Health's learners, each by their code.":
"Y el estudio ve solo a los estudiantes de Salud, cada uno por su código.",
"On the road, a load no one can name gets Guide 111, which assumes every danger.":
"En la carretera, una carga que nadie puede nombrar recibe la Guía 111, que supone todos los peligros.",
"Here, a table that comes without its level shows no rows to anyone but its builder,":
"Aquí, una tabla que llega sin su nivel no muestra filas a nadie más que a quien la construye,",
"until its owner gives it one.":
"hasta que su dueña le da uno.",
"But a policy hides only what has a tag.":
"Pero una política solo oculta lo que tiene etiqueta.",
"A column no one has classed shows as it is, until the morning check of Proof it held finds it.":
"Una columna sin clase se ve tal cual, hasta que la revisión matutina de Prueba de que se cumplió la encuentra.",
"The policies are code, kept beside the grants, in the registrar's bundle.":
"Las políticas son código, guardadas junto a los permisos, en el paquete de registro.",
"A change is a pull request that Mei approves, as the code owner.":
"Un cambio es un pull request que Mei aprueba, como dueña del código.",
"It runs in test, then in production after a release approver, as registrar-loader, never a person.":
"Corre en pruebas y luego en producción tras quien aprueba la entrega, como registrar-loader, nunca una persona.",
"Each file replaces its policy whole, so what the repository says is what runs.":
"Cada archivo reemplaza su política entera: lo que dice el repositorio es lo que corre.",
"On 14 October, the policies went in that morning, and the study's grant that afternoon:":
"El 14 de octubre, las políticas entraron esa mañana, y el permiso del estudio esa tarde:",
"rules first, then the door.":
"primero las reglas, luego la puerta.",
"On the road, one guide is written once, and a new chemical needs only a line.":
"En la carretera, una guía se escribe una vez, y una sustancia nueva solo necesita una línea.",
"Here, one policy is written once, and a new table needs only its tags.":
"Aquí, una política se escribe una vez, y una tabla nueva solo necesita sus etiquetas.",
"So a learner's name stays hidden wherever it lands, and the study sees only its own faculty's learners.":
"Así, el nombre de un estudiante sigue oculto llegue a donde llegue, y el estudio ve solo a los de su facultad.",
"The policy follows the tag, so new tables are protected the day they appear.":
"La política sigue a la etiqueta: las tablas nuevas quedan protegidas el día en que aparecen.",
"Next: Copies that keep the rules.":
"Siguiente: Copias que mantienen las reglas."
});
