/* A model, reasoning, hands and a loop: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: el día del censo and el informe del censo, Planificación, el equipo de Jun; una verificación
   for a check, el bucle for the loop, la retroalimentación for feedback, la evidencia; las herramientas, which keep the names they have on
   screen (Catalog, Query, Docs), un servidor de herramientas, and the Model Context Protocol, un estándar abierto; una receta for the recipe
   and una prueba for its test; un script sencillo for a plain script; in 1914, los giroscopios, los pistones, soltar los mandos, el piloto
   automático. Tú, as the film speaks to the viewer (Pon, Pídele, deja, Guarda, Úsalo). Numbers keep the picture's comma (18,412), as the
   series' other Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"On the 18th of June, 1914, crowds line the River Seine, just outside Paris, for a contest to make aeroplanes safer.":
"El 18 de junio de 1914, una multitud bordea el río Sena, a las afueras de París, para un concurso de seguridad aérea.",
"Last to fly is Lawrence Sperry, a young American, with his French mechanic, Emil Cachin.":
"El último en volar es Lawrence Sperry, un joven estadounidense, con su mecánico francés, Emil Cachin.",
"Flying is hard, tiring work.":
"Volar es un trabajo duro y agotador.",
"When a gust tips a wing, the pilot has to level it again, at once, all through the flight.":
"Cuando una ráfaga inclina un ala, el piloto tiene que nivelarla otra vez, enseguida, durante todo el vuelo.",
"On a long flight, his arms and back ache.":
"En un vuelo largo, le duelen los brazos y la espalda.",
"And if he's tired, or slow, a tipped aeroplane can slip sideways, and fall.":
"Y si está cansado, o es lento, un avión inclinado puede resbalar de lado, y caer.",
"Something has to change.":
"Algo tiene que cambiar.",
"Sperry's answer is a box of four gyroscopes: wheels that spin so fast they keep pointing the same way, however the aeroplane moves.":
"La respuesta de Sperry: una caja de cuatro giroscopios, ruedas que giran tan rápido que apuntan siempre igual, aunque el avión se mueva.",
"Each time the aeroplane tips, the box feels it, and pistons driven by air level it again.":
"Cada vez que el avión se inclina, la caja lo nota, y unos pistones movidos por aire lo nivelan otra vez.",
"Over the river, Sperry lets go, and raises his hands.":
"Sobre el río, Sperry suelta los mandos, y levanta las manos.",
"Cachin climbs out along the wing.":
"Cachin sale y camina por el ala.",
"The aeroplane dips under his weight, and the box brings it back.":
"El avión se hunde bajo su peso, y la caja lo endereza.",
"The judges give Sperry first prize, and now a pilot can let go, and rest.":
"Los jueces dan el primer premio a Sperry: ahora un piloto puede soltar los mandos y descansar.",
"His box grew into the autopilot: today, airline pilots fly by hand for only a few minutes of a typical flight.":
"Su caja se convirtió en el piloto automático: hoy, los pilotos de línea vuelan a mano solo unos minutos de un vuelo típico.",
"And they stay in their seats, to watch, and decide.":
"Y siguen en sus asientos, para vigilar, y decidir.",
"Sperry's box has hands, a check and a loop, but no model: it does one known job, the same way every time.":
"La caja de Sperry tiene manos, una verificación y un bucle, pero no un modelo: hace un solo trabajo conocido, siempre igual.",
"Put a model that reasons inside that loop, and you have an agent.":
"Pon un modelo que razona dentro de ese bucle, y tienes un agente.",
"Today, at the university, Planning asks Jun how the census-day count has changed since last year.":
"Hoy, en la universidad, Planificación pregunta a Jun cómo cambió el conteo del día del censo desde el año pasado.",
"Census day, the 31st of March, is when the university counts who is studying.":
"El día del censo, el 31 de marzo, es cuando la universidad cuenta quién está estudiando.",
"By hand, that's an afternoon of small corrections: find the tables, read the rules, query, check, fix.":
"A mano, es una tarde de pequeñas correcciones: buscar las tablas, leer las reglas, consultar, verificar, corregir.",
"So Jun gives it to an agent, which takes the steps and checks its own work, while he reviews and decides.":
"Así que Jun se lo encarga a un agente, que da los pasos y verifica su propio trabajo, mientras él revisa y decide.",
"An agent has four parts, and the first is a model.":
"Un agente tiene cuatro partes, y la primera es un modelo.",
"It has learned from a vast amount of writing, and it writes what's likely to come next.":
"Ha aprendido de una enorme cantidad de textos, y escribe lo que probablemente viene después.",
"Ask it for the census-day count, and the best it can write is a guess: it has never seen the university's records.":
"Pídele el conteo del día del censo, y lo mejor que escribirá es una conjetura: nunca vio los registros de la universidad.",
"On its own, a model can't look anything up, or check what it wrote.":
"Por sí solo, un modelo no puede consultar nada, ni verificar lo que escribió.",
"The second part is reasoning.":
"La segunda parte es el razonamiento.",
"Before it acts, the model writes out a plan: find the tables, count the students,":
"Antes de actuar, el modelo escribe un plan: buscar las tablas, contar los estudiantes,",
"and check the total against the census report, the university's official count.":
"y comparar el total con el informe del censo, el conteo oficial de la universidad.",
"It checks the plan against the rules Jun's team gave it: only the university's tools, only reading, and evidence for every answer.":
"Compara el plan con las reglas del equipo de Jun: solo herramientas de la universidad, solo leer, y evidencia para cada respuesta.",
"It reads each result as feedback, and changes the plan if it must.":
"Lee cada resultado como retroalimentación, y cambia el plan si hace falta.",
"Reasoning is feedback, and checks against rules.":
"Razonar es retroalimentación, y verificar contra reglas.",
"The third part is hands: a model can't open a table, but tools can.":
"La tercera parte son las manos: un modelo no abre una tabla; las herramientas, sí.",
"Jun's agent has three: Catalog, which lists the tables; Query, which reads the data; and Docs, with the university's definitions.":
"El agente de Jun tiene tres: Catalog, que lista las tablas; Query, que lee los datos; y Docs, con las definiciones de la universidad.",
"Each comes from a tool server: a small program that offers it to agents.":
"Cada una la ofrece un servidor de herramientas: un pequeño programa para agentes.",
"They plug in through an open standard, the Model Context Protocol, so any agent that follows it can use them.":
"Se conectan con un estándar abierto, el Model Context Protocol, así que cualquier agente que lo siga puede usarlas.",
"Reading is all this job needs, so these three can only read: their account can't change a single row.":
"Este trabajo solo necesita leer, así que estas tres solo pueden leer: su cuenta no puede cambiar ni una fila.",
"The fourth part is a loop: plan, act, check, and round again, until the goal is met.":
"La cuarta parte es un bucle: planificar, actuar, verificar, y otra vuelta, hasta cumplir el objetivo.",
"The agent finds the students' table in Catalog, and counts with Query.":
"El agente encuentra la tabla de estudiantes en Catalog, y cuenta con Query.",
"Then the check: its total is 476 short of the census report.":
"Luego la verificación: a su total le faltan 476 frente al informe del censo.",
"The model reads that feedback: did it count the students as they are today?":
"El modelo lee esa retroalimentación: ¿contó a los estudiantes como están hoy?",
"It reads the census rule in Docs: count each student as their record stood on census day.":
"Lee la regla del censo en Docs: contar a cada estudiante según su registro el día del censo.",
"A new query, with that date, gives 18,412.":
"Una nueva consulta, con esa fecha, da 18,412.",
"Its total matches the census report, and the check passes.":
"Su total coincide con el informe del censo, y la verificación pasa.",
"Unlike Sperry's box, which can only push back, the model decides what to try next.":
"A diferencia de la caja de Sperry, que solo sabe contrarrestar, el modelo decide qué probar después.",
"The loop stops when the checks pass, at its limit of tries, or when it needs a person.":
"El bucle para cuando pasan las verificaciones, en su límite de intentos, o cuando necesita a una persona.",
"The agent brings Jun its answer: 18,412 students on census day, 454 more than last year.":
"El agente le trae a Jun su respuesta: 18,412 estudiantes el día del censo, 454 más que el año pasado.",
"And its evidence: the tables it read, the rule, both queries, and the check that failed, then passed.":
"Y su evidencia: las tablas que leyó, la regla, las dos consultas, y la verificación que falló, y luego pasó.",
"Its check is evidence, not approval: Jun reads it, and decides what goes to Planning.":
"Su verificación es evidencia, no aprobación: Jun la lee, y decide qué va a Planificación.",
"Next March, Planning will want the same count, and now the steps are known.":
"El próximo marzo, Planificación querrá el mismo conteo, y ahora los pasos se conocen.",
"So Jun saves the query as a recipe in the project, with a test against the census report, and Noor approves it.":
"Así que Jun guarda la consulta como receta en el proyecto, con una prueba contra el informe del censo, y Noor la aprueba.",
"Every census day, it runs in seconds, for almost nothing, the same way every time, like Sperry's box.":
"Cada día del censo, corre en segundos, casi sin costo, siempre de la misma forma, como la caja de Sperry.",
"The agent took four minutes and twelve steps. A plain rerun needs no agent.":
"El agente tardó cuatro minutos y doce pasos. Repetirlo tal cual no necesita un agente.",
"An agent can also take the long way: one of the team's agents once searched the web for the census rules,":
"Un agente también puede dar un rodeo: uno de los agentes del equipo buscó una vez en la web las reglas del censo,",
"though Docs had them, because its plan didn't name its tools.":
"aunque Docs las tenía, porque su plan no nombraba sus herramientas.",
"Now each plan names its tools, and gives the agent only those the job needs.":
"Ahora cada plan nombra sus herramientas, y le da al agente solo las que el trabajo necesita.",
"Where the steps can be written down, let a plain script run them.":
"Donde los pasos se pueden escribir, deja que un script sencillo los ejecute.",
"Keep agents for the work whose steps nobody can write in advance.":
"Guarda los agentes para el trabajo cuyos pasos nadie puede escribir de antemano.",
"Sperry's box held the aeroplane level, the one job it knew, while the pilot stayed in his seat.":
"La caja de Sperry mantenía nivelado el avión, lo único que sabía hacer, mientras el piloto seguía en su asiento.",
"Jun's agent took the steps of a new question, and brought him the evidence to decide.":
"El agente de Jun dio los pasos de una pregunta nueva, y le trajo la evidencia para decidir.",
"An agent is a model that reasons, with hands, in a loop.":
"Un agente es un modelo que razona, con manos, en un bucle.",
"Use one only where a plain script can't do the job.":
"Úsalo solo donde un script sencillo no pueda hacer el trabajo."
});
