/* Governed in dbt: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the governance series: gobernanza, dueño (and dueña for Mei), Planificación, la oficina de registro, título for an award, microcredenciales and créditos,
   el consejo and sus actas, "nombrar a los dueños de datos" as in Who decides, los cupos del próximo semestre as in A product with an owner, control for a check,
   prueba for a test, una advertencia for a warning, una clase for a class of personal data, and una solicitud de cambio for a pull request, as in Change without
   surprises. As in the analytics films: el ciclo for the team's loop and los vacíos for its gaps, el núcleo for the core, los marts, and las exposiciones for dbt's
   exposures. A pin is una chinche; dbt, GitHub and the script keep their names, and an agent's skill is una skill, as the file is named. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Today, in the data team's room.":
"Hoy, en la sala del equipo de datos.",
"Jun Park builds in ten steps round a loop, from a question to a new version, as the team's poster shows.":
"Jun Park construye en diez pasos, en un ciclo, de una pregunta a una nueva versión, como muestra el póster del equipo.",
"Now he opens a pull request, a change put up for review: a new table for Planning, the awards conferred this year, by faculty.":
"Ahora abre una solicitud de cambio, un cambio para revisar: una tabla nueva para Planificación, los títulos de este año, por facultad.",
"When Yusuf asked what slowed him down, Jun said: the rules arrive after I've built it.":
"Cuando Yusuf le preguntó qué lo frenaba, Jun dijo: las reglas llegan cuando ya lo construí.",
"One rule is that every table other teams use has an owner, someone who answers for what it means.":
"Una regla es que toda tabla que usan otros equipos tiene un dueño, alguien que responde por lo que significa.",
"For four months, the council's minutes carried the same action: name the data owners.":
"Durante cuatro meses, las actas del consejo arrastraron la misma acción: nombrar a los dueños de datos.",
"Without an owner, nobody answers for a number.":
"Sin un dueño, nadie responde por una cifra.",
"On census day, the Faculty of Health couldn't plan its places: Anil was sent from Jun, to Noor, to Planning, and back to Jun.":
"El día del censo, la Facultad de Salud no pudo planificar sus cupos: mandaron a Anil de Jun a Noor, a Planificación, y de vuelta a Jun.",
"Something had to change.":
"Algo tenía que cambiar.",
"Now the rules live in the project, beside the code, and a check runs them on every pull request.":
"Ahora las reglas viven en el proyecto, junto al código, y un control las ejecuta en cada solicitud de cambio.",
"In a minute, it answers Jun: no owner, and how to add one.":
"En un minuto, le responde a Jun: no hay dueño, y cómo agregar uno.",
"He adds two lines, and the check turns green.":
"Agrega dos líneas, y el control se pone en verde.",
"The change goes to Planning for review, by itself.":
"El cambio va solo a Planificación, para su revisión.",
"An action the council carried for four months is now a check that takes a minute.":
"Una acción que el consejo arrastró cuatro meses es ahora un control que tarda un minuto.",
"And for Jun, the rules arrive first, while he can still fix them.":
"Y para Jun, las reglas llegan primero, mientras todavía puede corregir lo que piden.",
"Governance puts a pin where each decision enters the loop:":
"La gobernanza pone una chinche donde cada decisión entra en el ciclo:",
"a term at the question, a class of personal data at the sources, an owner and a contract at the gaps,":
"un término en la pregunta, una clase de dato personal en las fuentes, un dueño y un contrato en los vacíos,",
"a rule at the tests, an approval at review, a version when it changes.":
"una regla en las pruebas, una aprobación en la revisión, una versión cuando cambia.",
"In dbt, each pin is a line beside the model's code.":
"En dbt, cada chinche es una línea junto al código del modelo.",
"The learner table names its owner, Mei, and the term it holds.":
"La tabla de estudiantes nombra a su dueña, Mei, y el término que guarda.",
"Each column says whether it identifies a person, and each test has an owner.":
"Cada columna dice si identifica a una persona, y cada prueba tiene un dueño.",
"All of it is reviewed with the code.":
"Todo se revisa junto con el código.",
"Groups and access decide who may build on what.":
"Los grupos y el acceso deciden quién puede construir sobre qué.",
"The data team's first layers are private to its group.":
"Las primeras capas del equipo de datos son privadas de su grupo.",
"Its core tables are public, for any team, and the marts protected, for this project only.":
"Sus tablas del núcleo son públicas, para cualquier equipo, y los marts, protegidos, solo para este proyecto.",
"Build on a private one, and dbt stops before anything runs.":
"Si construyes sobre una privada, dbt se detiene antes de ejecutar nada.",
"Jun's new table reads only public tables, so it builds.":
"La tabla nueva de Jun solo lee tablas públicas, así que se construye.",
"But who may read it is the platform's to decide, in the next film.":
"Pero quién puede leerla lo decide la plataforma, en la próxima película.",
"Every table other teams use has a contract: these columns, these types.":
"Toda tabla que usan otros equipos tiene un contrato: estas columnas, estos tipos.",
"Each build checks it, and a mismatch stops the table being replaced.":
"Cada construcción lo verifica, y una diferencia impide que la tabla se reemplace.",
"A change that would break a reader becomes a new version, beside the old one, with a date to go:":
"Un cambio que rompería a quien la lee se vuelve una versión nueva, junto a la anterior, con fecha de retiro:",
"credentials' first version goes on 31 March 2027.":
"la primera versión de credenciales se retira el 31 de marzo de 2027.",
"And exposures name who uses each table, and who answers for each use.":
"Y las exposiciones nombran quién usa cada tabla, y quién responde por cada uso.",
"Each pull request also says what it touches.":
"Cada solicitud de cambio también dice a qué afecta.",
"On Tuesday, Jun's first draft relabelled microcredentials of 6 credit points or more as awards.":
"El martes, la primera versión de Jun reetiquetaba como títulos las microcredenciales de 6 créditos o más.",
"The impact check wrote it into the pull request: five reports and apps depend on it, four owners to ask.":
"El control de impacto lo escribió en la solicitud de cambio: cinco informes y apps dependen de ella, cuatro dueños a consultar.",
"Mei said a change of meaning breaks, even when the columns don't.":
"Mei dijo que un cambio de significado rompe, aunque las columnas no se rompan.",
"So Jun added a column instead: counts as an award.":
"Así que Jun agregó una columna en su lugar: cuenta como título.",
"The check called it additive, with three owners to tell.":
"El control lo llamó aditivo, con tres dueños a quienes avisar.",
"A renamed column would fail: a breaking change needs a new version.":
"Una columna renombrada fallaría: un cambio que rompe necesita una versión nueva.",
"Who reviews what is made from the same owners.":
"Quién revisa qué sale de los mismos dueños.",
"A script writes the reviewers file: the registrar's office for credentials, Planning for its tables, Clara for her product.":
"Un script escribe el archivo de revisores: la oficina de registro para credenciales, Planificación para sus tablas, Clara para su producto.",
"GitHub asks them on every pull request, and a check fails if the file falls behind.":
"GitHub se lo pide en cada solicitud de cambio, y un control falla si el archivo se queda atrás.",
"Decisions are files too, with who decided, when and why.":
"Las decisiones también son archivos, con quién decidió, cuándo y por qué.",
"Every message says what to add, and where, and links a page on how, with who to ask.":
"Cada mensaje dice qué agregar, y dónde, y enlaza una página sobre cómo hacerlo, con a quién preguntar.",
"A new rule warns first.":
"Una regla nueva primero advierte.",
"Every column other teams read must say what it holds: until the first of December, that's a warning with its date, then an error.":
"Toda columna que leen otros equipos debe decir qué guarda: hasta el primero de diciembre es una advertencia con su fecha, y luego un error.",
"Week by week, the warnings fell from forty-one to none.":
"Semana a semana, las advertencias bajaron de cuarenta y una a ninguna.",
"When Anil added a column, the check showed him how to classify it.":
"Cuando Anil agregó una columna, el control le mostró cómo clasificarla.",
"And an agent reviews every pull request, against the same rules.":
"Y un agente revisa cada solicitud de cambio, con las mismas reglas.",
"It follows a skill the team wrote: run the checks, read what they can't, and draft what's missing.":
"Sigue una skill que escribió el equipo: ejecutar los controles, leer lo que ellos no pueden, y redactar lo que falta.",
"On Anil's first pull request, his faculty's call list, it found no owner, ten columns with no class, and a rule with no test.":
"En la primera solicitud de Anil, la lista de llamadas de su facultad, encontró: sin dueño, diez columnas sin clase, y una regla sin prueba.",
"It drafted each, with counts as evidence, never values, and said who decides.":
"Redactó cada uno, con conteos como evidencia, nunca valores, y dijo quién decide.",
"The agent never approves. People decide.":
"El agente nunca aprueba. Deciden las personas.",
"Jun's table goes in, with its owner, its classes, its contract and Planning's yes.":
"La tabla de Jun entra, con su dueño, sus clases, su contrato y el sí de Planificación.",
"On Noor's map, the project is the home of owners, classes, contracts, tests and decisions,":
"En el mapa de Noor, el proyecto es la casa de dueños, clases, contratos, pruebas y decisiones,",
"and their copies flow one way, to the platform and the catalogue.":
"y sus copias van en un solo sentido, a la plataforma y al catálogo.",
"The rules don't arrive after he's built it any more.":
"Las reglas ya no llegan cuando él ya lo construyó.",
"They arrive with every change.":
"Llegan con cada cambio.",
"The project carries governance with the code.":
"El proyecto lleva la gobernanza junto con el código."
});
