/* Why Unity Catalog and Unity Gateway govern them: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in
   src/narration.js) maps to its caption. Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and
   the video, which has no captions on its picture, takes es.srt. The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes
   captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in Working with agents on Databricks and the series: la Facultad de Salud, los directores de escuela, la oficina de la facultad, Recursos Humanos,
   la tabla de personal, el código de personal, los docentes, temporales for casual staff, asteriscos for a mask's stars, etiquetada directa, una política,
   un permiso for a grant (conceder, to grant), una bitácora for the log, el linaje, un esquema de desarrollo, una entidad de servicio for a service principal,
   un servidor de herramientas, un prompt, los tokens, dueño (Anil), los proyectos activos and el gobierno. Anil's agent, the workload agent, is el agente de
   carga docente; Jun's project check agent is el agente que revisa proyectos, as in Working with agents on Databricks; a personal key is una clave personal; a check on a model
   service is un control. Unity Catalog and Unity Gateway keep their names, and "one set of rules" is unas mismas reglas. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Today, at the university.":
"Hoy, en la universidad.",
"Every week, the Faculty of Health's heads of school ask the same questions: how many teach this term, and how many are casual.":
"Cada semana, los directores de escuela de la Facultad de Salud preguntan lo mismo: cuántos enseñan este periodo, y cuántos son temporales.",
"So Anil Kurian, who runs the faculty's office, set up an agent that answers them at night, on its own.":
"Así que Anil Kurian, que dirige la oficina de la facultad, creó un agente que las responde de noche, por su cuenta.",
"He set it up in an afternoon, with his personal key: a code that lets software sign in as him.":
"Lo armó en una tarde, con su clave personal: un código que permite a un programa entrar como él.",
"Each month, Sam Okafor, who runs the data platform, checks the platform's log:":
"Cada mes, Sam Okafor, que dirige la plataforma de datos, revisa su bitácora:",
"who read the staff table, with every staff member's name, birth date and email.":
"quién leyó la tabla de personal, con el nombre, la fecha de nacimiento y el correo de cada persona.",
"One Sunday night, Anil read it 2,300 times.":
"Un domingo por la noche, Anil la leyó 2,300 veces.",
"He was asleep. The reads were his agent's.":
"Estaba dormido. Las lecturas eran de su agente.",
"Acting as him, it could read everything he can, though all it needed was counts.":
"Actuando como él, podía leer todo lo que él puede, aunque solo necesitaba conteos.",
"A cleverly worded question could have tricked it into handing names over.":
"Una pregunta astuta podría haberlo engañado para que entregara nombres.",
"It called its model with another key of his, paid from no one's budget, and no one saw what the calls carried.":
"Llamaba a su modelo con otra clave suya, sin cargo a ningún presupuesto, y nadie veía qué llevaban las llamadas.",
"And if names ever leaked, the log would point at Anil.":
"Y si alguna vez se filtraban nombres, la bitácora señalaría a Anil.",
"He did nothing wrong: a personal key can't hand over less than everything he has.":
"Él no hizo nada mal: una clave personal no puede dar menos que todo lo que él tiene.",
"Something had to change.":
"Algo tenía que cambiar.",
"So Sam gives the agent a name of its own, under the same rules as people.":
"Así que Sam le da al agente un nombre propio, bajo las mismas reglas que las personas.",
"Unity Catalog, where the platform keeps its rules,":
"Unity Catalog, donde la plataforma guarda sus reglas,",
"gives it only the grants its job needs, and stars where the names are.":
"le da solo los permisos que necesita, y asteriscos donde están los nombres.",
"Unity Gateway, its gate to models, lets it call only the ones it's allowed, and counts what it spends.":
"Unity Gateway, su puerta a los modelos, le deja llamar solo a los permitidos, y cuenta lo que gasta.",
"It worked. The heads of school get the same answers every morning.":
"Funcionó. Los directores de escuela reciben las mismas respuestas cada mañana.",
"Since then, it hasn't seen a single name, and its calls cost about 300 dollars a month, from the faculty's own budget.":
"Desde entonces no ha visto ni un nombre, y sus llamadas cuestan unos 300 dólares al mes, que paga la propia facultad.",
"And the log says whose reads they were.":
"Y la bitácora dice de quién eran las lecturas.",
"Jun's project check agent, which checks each night's count of research projects, works the same way:":
"El agente de Jun que revisa cada noche el conteo de proyectos de investigación funciona igual:",
"one set of rules for people and agents.":
"unas mismas reglas para personas y agentes.",
"The project's page for agents already says: never copy names, emails or student IDs into a prompt.":
"La página del proyecto para agentes ya dice: nunca copies nombres, correos ni números de estudiante en un prompt.",
"But a rule an agent is told is a request.":
"Pero una regla dicha a un agente es una petición.",
"It can misread it, lose it in a long task, or be talked out of it by words hidden in what it reads.":
"Puede entenderla mal, perderla en una tarea larga, o abandonarla por palabras ocultas en lo que lee.",
"A rule the platform enforces holds, whatever the agent is told: it can't copy a name it only ever sees as stars.":
"Una regla impuesta por la plataforma se cumple, le digan lo que le digan: no puede copiar un nombre que solo ve como asteriscos.",
"So the team does both. It tells its agents the rules, and enforces them where the data and the models live.":
"Así que el equipo hace las dos cosas: les dice las reglas a sus agentes, y las impone donde viven los datos y los modelos.",
"Two places keep them.":
"Dos lugares las guardan.",
"Unity Catalog governs what agents touch:":
"Unity Catalog gobierna lo que tocan los agentes:",
"the tables, the functions they run as tools, and the log of who read what.":
"las tablas, las funciones que usan como herramientas, y la bitácora de quién leyó qué.",
"Unity Gateway, part of the catalog, governs the models and tool servers they call.":
"Unity Gateway, parte del catálogo, gobierna los modelos y servidores de herramientas que llaman.",
"First, a name.":
"Primero, un nombre.",
"An agent that helps one person, while they're there, can use that person's sign-in.":
"Un agente que ayuda a una persona, mientras está presente, puede entrar con su cuenta.",
"One that works on its own, like Anil's at night, needs a name of its own.":
"Uno que trabaja solo, como el de Anil de noche, necesita un nombre propio.",
"On Databricks, that's a service principal: an identity made for software, not for a person.":
"En Databricks, eso es una entidad de servicio: una identidad hecha para un programa, no para una persona.",
"Sam makes one for Anil's agent, the workload agent, and grants it only what its job needs:":
"Sam crea una para el agente de Anil, el agente de carga docente, y le concede solo lo que su tarea necesita:",
"it may read the HR tables its answers come from, and write nowhere.":
"puede leer las tablas de Recursos Humanos que dan sus respuestas, y no escribir en ninguna parte.",
"Jun's project check agent already has its own: it reads the research tables, and writes only to its own development schema.":
"El agente de Jun que revisa proyectos ya tiene la suya: lee las tablas de investigación, y solo escribe en su propio esquema de desarrollo.",
"To stop an agent, Sam switches off its service principal, and everyone else works on.":
"Para detener un agente, Sam desactiva su entidad de servicio, y todos los demás siguen trabajando.",
"And Anil stays its owner: he answers for what it does.":
"Y Anil sigue siendo su dueño: responde por lo que hace.",
"Then the masks. One policy shows stars in every column tagged direct, to everyone outside HR and the faculty offices.":
"Luego, las máscaras. Una política muestra asteriscos en cada columna etiquetada directa a todos fuera de Recursos Humanos y las facultades.",
"It's written for all the account's users, and on Databricks, they include every service principal.":
"Está escrita para todos los usuarios de la cuenta, y en Databricks, eso incluye cada entidad de servicio.",
"The workload agent isn't in their group: all it needs is counts.":
"El agente de carga docente no está en su grupo: solo necesita conteos.",
"So it reads the staff table as Clara does:":
"Así que lee la tabla de personal como Clara:",
"each person's staff code, and stars where the names, birth dates and emails are.":
"el código de personal de cada uno, y asteriscos donde están los nombres, las fechas de nacimiento y los correos.",
"Nobody wrote a rule for agents. The rule for people already covered them.":
"Nadie escribió una regla para agentes. La regla para personas ya los cubría.",
"A row filter works the same way, for an agent as for a person.":
"Un filtro de filas funciona igual, para un agente que para una persona.",
"And the staff code stays readable for counting,":
"Y el código de personal sigue legible para contar,",
"so the workload agent counts each school's teachers without a single name.":
"así que el agente de carga docente cuenta a los docentes de cada escuela sin un solo nombre.",
"Agents' tools live in the catalog too.":
"Sus herramientas también viven en el catálogo.",
"The count of active projects, which the data team wrote once, is a function there.":
"El conteo de proyectos activos, que el equipo de datos escribió una vez, es una función allí.",
"Running it takes a grant, the same one a person needs.":
"Ejecutarla requiere un permiso, el mismo que necesita una persona.",
"Jun's agent has it: it may run the count, and can't change it.":
"El agente de Jun lo tiene: puede ejecutar el conteo, y no puede cambiarlo.",
"And the tool servers agents call are registered there, through Unity Gateway,":
"Y los servidores de herramientas que llaman los agentes se registran ahí, con Unity Gateway,",
"each with its own grant: an agent can reach these, and only these.":
"cada uno con su propio permiso: un agente puede usar estos, y solo estos.",
"Each gets the fewest rights: the workload agent's tools only read.":
"Cada uno, con los mínimos permisos: las del agente de carga docente solo leen.",
"Then the models. In Unity Gateway, each model the university allows is a service in the catalog,":
"Luego, los modelos. En Unity Gateway, cada modelo que la universidad permite es un servicio en el catálogo,",
"and only those granted it can call it.":
"y solo quienes tienen permiso pueden llamarlo.",
"The workload agent is granted one, and Anil's keys are taken back.":
"Al agente de carga docente se le concede uno, y a Anil se le retiran las claves.",
"Checks on each service look at what goes in and what comes out.":
"Los controles de cada servicio miran lo que entra y lo que sale.",
"One finds an email address in a prompt, and hides it or stops the call.":
"Uno encuentra un correo en un prompt, y lo oculta o detiene la llamada.",
"Another looks for words written to trick the agent.":
"Otro busca palabras escritas para engañar al agente.",
"A limit sets how many calls a minute it may make.":
"Un límite fija cuántas llamadas por minuto puede hacer.",
"And every call is counted under its name, so the faculty sees what its agent costs, in its own budget.":
"Y cada llamada se cuenta a su nombre, así la facultad ve lo que cuesta su agente, en su propio presupuesto.",
"A month later, Sam checks the log again.":
"Un mes después, Sam vuelve a revisar la bitácora.",
"The same question, who read the staff table this month, lists Anil on weekday mornings, and the workload agent at night.":
"La misma pregunta, quién leyó la tabla de personal este mes, lista a Anil las mañanas de semana y al agente de carga docente de noche.",
"Whose reads were those? Now the log says.":
"¿De quién eran esas lecturas? Ahora la bitácora lo dice.",
"Lineage shows the tables its queries read.":
"El linaje muestra las tablas que leen sus consultas.",
"The gateway's own table lists every call it made, and the tokens it used.":
"La tabla de Unity Gateway lista cada llamada que hizo, y los tokens que usó.",
"If something looks wrong, Sam can stop the agent alone, and nobody else stops with it.":
"Si algo se ve mal, Sam puede detener solo al agente, y nadie más se detiene con él.",
"And no read of the agent's is taken for Anil's again.":
"Y ninguna lectura del agente vuelve a pasar por una de Anil.",
"Why keep the rules where the data and the models live, and not only in what agents are told?":
"¿Por qué guardar las reglas donde viven los datos y los modelos, y no solo en lo que se les dice a los agentes?",
"Because there, they hold for every agent, every tool and every person, whatever anyone types.":
"Porque ahí se cumplen para cada agente, cada herramienta y cada persona, escriba lo que escriba quien sea.",
"And because they're the rules people already work under, there's one set to keep, one log to read, and one review.":
"Y como la gente ya trabaja con esas reglas, hay un solo conjunto que mantener, una bitácora que leer y una sola revisión.",
"Jun's project check agent works under them too.":
"El agente de Jun que revisa proyectos también trabaja con ellas.",
"The count Anil plans lab space from, 168 projects,":
"El conteo con el que Anil planifica el espacio de laboratorio, 168 proyectos,",
"is checked by an agent the team can see, limit and account for.":
"la revisa un agente que el equipo puede ver, limitar y por el que responde.",
"And every morning, the answers for the heads of school wait under the workload agent's own name.":
"Y cada mañana, las respuestas para los directores de escuela esperan a nombre del agente de carga docente.",
"One set of rules for people and agents, enforced where the data and the models live.":
"Unas mismas reglas para personas y agentes, aplicadas donde viven los datos y los modelos.",
"Next: the team's context and memory, governed like any data.":
"Después: el contexto y la memoria del equipo, gobernados como cualquier dato."
});
