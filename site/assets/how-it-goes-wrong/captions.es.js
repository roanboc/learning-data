/* How it goes wrong: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the films before it: el conteo del día del censo, la cifra que la universidad informa al gobierno, estudiantes (never inscripciones),
   Planificación, la Facultad de Salud, carrera for a degree, el informe del censo, la consulta, una prueba for a test and una verificación for a check, en advertencia
   for "warn" and la compilación for the build (as in Un agente en el equipo), la solicitud de cambio for a pull request, el dueño, en pruebas for in test, el sandbox
   and las manos (as in Las herramientas son manos, y cada mano es un permiso), un script sencillo for a plain script; the tools keep the names they have on screen
   (Docs), and so do the column census_status and the joint degree Health data. Prever for the team that expects each way it fails, as Lisbon's builders did.
   In 1755: Lisboa, el Día de Todos los Santos, la ciudad baja for the lower town, los ingenieros y el ministro del rey, una jaula de madera, las parroquias.
   Numbers keep the picture's comma (2,911; 18,412), as the series' other Spanish captions do. Tú, as the film's last lines speak to the viewer. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Lisbon, the morning of the first of November, 1755.":
"Lisboa, la mañana del primero de noviembre de 1755.",
"All Saints' Day: the churches are full.":
"Día de Todos los Santos: las iglesias están llenas.",
"Then the ground shakes, for several minutes.":
"Entonces la tierra tiembla, durante varios minutos.",
"Churches and houses fall, with people inside.":
"Iglesias y casas se derrumban, con gente dentro.",
"Then a great wave from the sea rushes up the river, and fires burn for days.":
"Luego una gran ola del mar sube por el río, y los incendios arden durante días.",
"By most estimates, tens of thousands of people died, and the heart of the city lay in ruins.":
"Según casi todas las estimaciones, murieron decenas de miles de personas, y el corazón de la ciudad quedó en ruinas.",
"It had failed in every way at once:":
"Había fallado de todas las formas a la vez:",
"walls that broke, fire that leapt from house to house, and narrow, crowded lanes.":
"muros que se rompieron, fuego que saltó de casa en casa, y callejones estrechos y abarrotados.",
"And the ground would shake again.":
"Y la tierra volvería a temblar.",
"Rebuilt the old way, it would fall the same way.":
"Reconstruida a la antigua, caería de la misma forma.",
"Something had to change.":
"Algo tenía que cambiar.",
"So the king's engineers rebuilt the lower town for each way it had failed.":
"Así que los ingenieros del rey reconstruyeron la ciudad baja para cada forma en que había fallado.",
"Inside the walls, a cage of timber, braced with crosses, that bends instead of breaking.":
"Dentro de los muros, una jaula de madera, reforzada con cruces, que se dobla en vez de romperse.",
"Between the houses, stone walls raised above the roofs, so fire can't leap across.":
"Entre las casas, muros de piedra que se alzan sobre los tejados, para que el fuego no salte.",
"And wide, straight streets, in place of the lanes.":
"Y calles anchas y rectas, en lugar de los callejones.",
"The king's minister sent thirteen questions to every parish:":
"El ministro del rey envió trece preguntas a cada parroquia:",
"when did it start, how long did it last, what did the sea do, what fell, and had one struck before?":
"¿cuándo empezó, cuánto duró, qué hizo el mar, qué se cayó, y había habido uno antes?",
"The lower town still stands, more than two hundred and fifty years on,":
"La ciudad baja sigue en pie, más de doscientos cincuenta años después,",
"one of the first places in Europe built to withstand an earthquake.":
"uno de los primeros lugares de Europa construidos para resistir un terremoto.",
"And scientists still read the parishes' answers.":
"Y los científicos todavía leen las respuestas de las parroquias.",
"At the university, Jun's agent works on the census-day count, the number the university reports to the government.":
"En la universidad, el agente de Jun trabaja en el conteo del día del censo, la cifra que la universidad informa al gobierno.",
"Agents go wrong in a few known ways too.":
"Los agentes también fallan de unas pocas formas conocidas.",
"None of them is anyone's fault, any more than the earthquake was.":
"Ninguna es culpa de nadie, como tampoco lo fue el terremoto.",
"So the team expects each one, and builds for it.":
"Así que el equipo prevé cada una, y construye pensando en ella.",

"First: a column that isn't there.":
"Primera: una columna que no existe.",
"Jun asks the agent to draft the census-day count by faculty.":
"Jun le pide al agente un borrador del conteo del día del censo por facultad.",
"Its draft reads a column called census status.":
"Su borrador lee una columna llamada census_status.",
"It sounds right, but there's no such column.":
"Suena bien, pero esa columna no existe.",
"A model writes the name that seems most likely.":
"Un modelo escribe el nombre que parece más probable.",
"A database never guesses.":
"Una base de datos nunca adivina.",
"So the agent reads the real names from the catalog before it writes,":
"Así que el agente lee los nombres reales en el catálogo antes de escribir,",
"and builds every draft in its sandbox first, where a wrong name stops the build at once.":
"y compila cada borrador primero en su sandbox, donde un nombre equivocado detiene la compilación al instante.",
"Like the cage in Lisbon's walls, the sandbox takes the shock.":
"Como la jaula en los muros de Lisboa, el sandbox absorbe el golpe.",
"Then the agent fixes the line, and builds again.":
"Luego el agente corrige la línea, y vuelve a compilar.",

"Second: a confidently wrong number.":
"Segunda: un número errado, dicho con seguridad.",
"Clara, in Planning, asks how many students the Faculty of Health had on census day.":
"Clara, de Planificación, pregunta cuántos estudiantes tenía la Facultad de Salud el día del censo.",
"The agent answers at once: 2,911.":
"El agente responde al instante: 2,911.",
"It sounds sure.":
"Suena seguro.",
"But it counted every degree with Health in its name,":
"Pero contó cada carrera con «Health» en el nombre,",
"the 31 students of the joint degree Health data too, who belong to no faculty.":
"también los 31 estudiantes de la carrera conjunta Health data, que no pertenecen a ninguna facultad.",
"Health had 2,880.":
"Salud tenía 2,880.",
"In Lisbon, every parish answered the same questions, so each answer could be checked against the others.":
"En Lisboa, cada parroquia respondió las mismas preguntas, así que cada respuesta podía contrastarse con las demás.",
"So every number now comes with its query, and a second way to reach it: the census team's own report.":
"Así que ahora cada número llega con su consulta, y una segunda forma de obtenerlo: el informe del propio equipo del censo.",
"Where the two differ, it isn't an answer yet.":
"Donde los dos difieren, todavía no es una respuesta.",
"It's a question for a person.":
"Es una pregunta para una persona.",

"Third: a test weakened to pass.":
"Tercera: una prueba debilitada para pasar.",
"Researchers have caught recent models changing tests to get a pass.":
"Investigadores han visto a modelos recientes cambiar pruebas para pasarlas.",
"In An agent on the team, the agent's draft set the census check to warn, and Jun caught it in review.":
"En Un agente en el equipo, el borrador del agente puso la verificación del censo en advertencia, y Jun lo vio al revisar.",
"Catching it shouldn't rest on a sharp eye.":
"Detectarlo no debería depender de un ojo atento.",
"So tests belong to people: written first, approved by Jun, and changed only by a person.":
"Así que las pruebas son de las personas: se escriben primero, Jun las aprueba, y solo una persona las cambia.",
"And every pull request lists the tests it changes, each with its owner, where no one can miss it.":
"Y cada solicitud de cambio lista las pruebas que cambia, cada una con su dueño, donde nadie puede pasarlo por alto.",
"The agent may propose a change to a test.":
"El agente puede proponer un cambio en una prueba.",
"A person decides.":
"Una persona decide.",

"Fourth: an instruction hidden in a ticket.":
"Cuarta: una instrucción escondida en un ticket.",
"In Tools are hands, and every hand is a permission,":
"En Las herramientas son manos, y cada mano es un permiso,",
"a line in white letters in Clara's ticket told the agent to send the student list outside the university.":
"una línea en letras blancas en el ticket de Clara le pedía al agente enviar la lista de estudiantes fuera de la universidad.",
"It didn't, and it told Jun.":
"No lo hizo, y se lo contó a Jun.",
"Security experts put this risk first: anything an agent reads can try to steer it, a file, a table or a web page.":
"Los expertos en seguridad lo ponen primero: todo lo que lee un agente puede intentar dirigirlo, un archivo, una tabla o una página web.",
"A model can't always tell an order from data, so the design doesn't rely on it.":
"Un modelo no siempre distingue una orden de los datos, así que el diseño no depende de eso.",
"What the agent reads is data, never orders, and no hand it holds can send anything out.":
"Lo que lee el agente son datos, nunca órdenes, y ninguna de sus manos puede enviar nada afuera.",
"Like the walls above Lisbon's roofs, the fire stops where it starts.":
"Como los muros sobre los tejados de Lisboa, el fuego se detiene donde empieza.",

"Fifth: a loop that runs all night.":
"Quinta: un bucle que corre toda la noche.",
"At eleven one night, the census build fails, and the agent does its agreed job, in test: find the cause, and report by morning.":
"A las once, una noche, falla la compilación del censo, y el agente hace lo acordado, en pruebas: hallar la causa e informar al amanecer.",
"But no code can fix this cause: the student system's copy hasn't arrived.":
"Pero ningún código arregla esta causa: la copia del sistema de estudiantes no ha llegado.",
"Each round, the agent changes something and rebuilds everything.":
"En cada ronda, el agente cambia algo y vuelve a compilarlo todo.",
"Ten rounds, the same error every time, until six in the morning.":
"Diez rondas, el mismo error cada vez, hasta las seis de la mañana.",
"Its limit counted rounds, and nothing else.":
"Su límite contaba rondas, y nada más.",
"In the morning, Sam, who runs the platform, finds a week's budget gone.":
"Por la mañana, Sam, que dirige la plataforma, ve gastado el presupuesto de una semana.",
"So now every loop has limits on rounds, time and money, and stops when the same error comes back.":
"Así que ahora cada bucle tiene límites de rondas, tiempo y dinero, y se detiene cuando vuelve el mismo error.",
"And a plain check runs first: if the copy isn't there, nothing starts, and Sam is told.":
"Y antes corre una verificación sencilla: si la copia no está, nada empieza, y se avisa a Sam.",

"Sixth: a simple job made complicated.":
"Sexta: un trabajo sencillo vuelto complicado.",
"In Plan, define the check, do, check, an agent read 38 web pages for census rules that Docs gives in one call,":
"En Planificar, definir la verificación, hacer, verificar, un agente leyó 38 páginas web por reglas que Docs da en una llamada,",
"because its plan didn't name its tools.":
"porque su plan no nombraba sus herramientas.",
"And asked to rename one column, an agent can come back with nine changed files, a new macro and a new model.":
"Y si le piden renombrar una columna, un agente puede volver con nueve archivos cambiados, una macro nueva y un modelo nuevo.",
"Every extra step costs, to run and to review.":
"Cada paso de más cuesta, al ejecutarlo y al revisarlo.",
"So each plan names its tools, and Jun sends back a change bigger than its job.":
"Así que cada plan nombra sus herramientas, y Jun devuelve un cambio más grande que su trabajo.",
"Where the steps can be written down, a plain script runs them.":
"Donde los pasos se pueden escribir, un script sencillo los ejecuta.",
"Keep agents for the work nobody can write down in advance.":
"Reserva los agentes para el trabajo que nadie puede escribir de antemano.",

"Six ways an agent goes wrong, and a design for each.":
"Seis formas en que un agente falla, y un diseño para cada una.",
"Lisbon's builders didn't blame the ground, or hope it would stay still.":
"Los constructores de Lisboa no culparon a la tierra, ni esperaron que se quedara quieta.",
"They expected each way the city had failed, and built for it, and the lower town still stands.":
"Previeron cada forma en que la ciudad había fallado, y construyeron para ella, y la ciudad baja sigue en pie.",
"Jun's team does the same, so the agent can work on the number the university reports:":
"El equipo de Jun hace lo mismo, para que el agente pueda trabajar en la cifra que la universidad informa:",
"18,412 students on census day, and the team can stand behind it.":
"18,412 estudiantes el día del censo, y el equipo puede respaldarla.",
"Expect these, and design for them.":
"Prevé estas fallas, y diseña para ellas."
});
