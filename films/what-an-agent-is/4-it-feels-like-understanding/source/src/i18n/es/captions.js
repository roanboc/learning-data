/* It feels like understanding: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the governance films: la Facultad de Salud, los asesores, el semestre, el equipo de datos; la carga estudiantil
   for student load and equivalentes a tiempo completo for full-time equivalents; la evidencia adjunta; una verificación for a check and
   una marca for a tick; los navegantes for NASA's navigators, newton-segundos and libras-segundo for the units; un cierre for a zip; and
   tú, as "Prueba esto" and "Ahora explica" speak to the viewer. Numbers keep the picture's comma (2,880), as most of the site's Spanish
   captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In December 1998, NASA launched the Mars Climate Orbiter, to study the weather on Mars.":
"En diciembre de 1998, la NASA lanzó el Mars Climate Orbiter, para estudiar el clima de Marte.",
"On the way, small thrusters kept it pointing the right way, and each firing pushed it slightly off course.":
"En el camino, pequeños propulsores lo mantenían bien orientado, y cada encendido lo desviaba un poco.",
"The builders' software, in Colorado, worked out the size of every push.":
"El software de los fabricantes, en Colorado, calculaba el tamaño de cada empuje.",
"It sent the numbers in a file to NASA's navigators in California, who steer the craft.":
"Mandaba las cifras en un archivo a los navegantes de la NASA en California, que guían la nave.",
"The teams had agreed on newton-seconds, the metric unit.":
"Los equipos habían acordado usar newton-segundos, la unidad métrica.",
"But the file gave pound-seconds, each about four and a half times bigger.":
"Pero el archivo daba libras-segundo, cada una unas cuatro veces y media mayor.",
"So the navigators counted every push at less than a quarter of its size.":
"Así que los navegantes contaban cada empuje como menos de un cuarto de su tamaño.",
"Each team was sure the numbers meant the same to both.":
"Cada equipo estaba seguro de que las cifras decían lo mismo a ambos.",
"For nine months, small errors added up.":
"En nueve meses, se acumularon pequeños errores.",
"From April, the navigators saw that something didn't fit; they raised it in emails, but it was never settled.":
"Desde abril, los navegantes vieron que algo no cuadraba; lo plantearon por correo, pero nunca se resolvió.",
"After thirty years of success, orbiting Mars felt routine.":
"Tras treinta años de éxitos, orbitar Marte parecía rutina.",
"On the 23rd of September 1999, it fired its engine to enter orbit,":
"El 23 de septiembre de 1999, encendió su motor para entrar en órbita,",
"and passed behind Mars, 170 kilometres lower than planned.":
"y pasó por detrás de Marte, 170 kilómetros más abajo de lo previsto.",
"It was never heard from again.":
"Nunca más se supo de él.",
"Years of work, and the first weather satellite at another planet, were lost.":
"Se perdieron años de trabajo, y el primer satélite meteorológico en otro planeta.",
"Something had to change.":
"Algo tenía que cambiar.",
"So on the next orbiter, Mars Odyssey, the team wrote both units on every hand-off,":
"Así que en el siguiente orbitador, Mars Odyssey, el equipo escribió ambas unidades en cada entrega,",
"had every critical number checked independently,":
"hizo verificar por separado cada cifra crítica,",
"and added a second way to find the craft.":
"y añadió una segunda forma de ubicar la nave.",
"In October 2001, Odyssey went into orbit, and twenty years later it was still at work, the longest-lived spacecraft at Mars.":
"En octubre de 2001, Odyssey entró en órbita, y veinte años después seguía trabajando: la nave más longeva en Marte.",
"Agents bring the same risk to data work: a person and an agent, each sure the other means the same thing.":
"Los agentes traen el mismo riesgo al trabajo con datos: una persona y un agente, cada uno seguro de que el otro entiende lo mismo.",
"Say what a number means, check it against something else, and you can rely on it.":
"Di qué significa una cifra, compárala con otra cosa, y podrás confiar en ella.",
"Today, at the university, Anil Kurian plans the Faculty of Health's student advisers.":
"Hoy, en la universidad, Anil Kurian planifica los asesores estudiantiles de la Facultad de Salud.",
"Each adviser calls 240 students once a term, to see how they're doing.":
"Cada asesor llama a 240 estudiantes una vez por semestre, para ver cómo están.",
"So Anil asks Jun, in the data team, how many students the faculty has this term.":
"Anil le pregunta a Jun, del equipo de datos, cuántos estudiantes tiene la facultad este semestre.",
"Jun asks the agent.":
"Jun le pregunta al agente.",
"Its hands read the catalog and run a query, and it checks the count against the source.":
"Sus manos leen el catálogo y ejecutan una consulta, y compara el conteo con la fuente.",
"Seconds later: 2,160 students, 63 more than last year, with its evidence attached.":
"Segundos después: 2,160 estudiantes, 63 más que el año pasado, con su evidencia adjunta.",
"In a 2025 study, longer explanations made people more confident in an AI's answers, even when the answers were no more accurate.":
"En un estudio de 2025, las explicaciones más largas daban más confianza en las respuestas de una IA, aunque no fueran más exactas.",
"It feels like understanding, and it feels safe.":
"Se siente como entender, y se siente seguro.",
"Try this: how well do you understand how a zip works, from one to seven?":
"Prueba esto: ¿qué tan bien entiendes cómo funciona un cierre, del uno al siete?",
"Now explain, step by step, how it closes and opens.":
"Ahora explica, paso a paso, cómo se cierra y se abre.",
"In 2002, at Yale, Leonid Rozenblit and Frank Keil asked people to do just that, with everyday things like a zip.":
"En 2002, en Yale, Leonid Rozenblit y Frank Keil pidieron a varias personas hacer justo eso, con cosas cotidianas como un cierre.",
"After trying, they rated themselves lower.":
"Después de intentarlo, se calificaron más bajo.",
"Jun would give his understanding of the agent's answer a six.":
"Jun le daría un seis a lo que entiende de la respuesta del agente.",
"Which table did it read?":
"¿Qué tabla leyó?",
"What counted as a student?":
"¿Qué contó como estudiante?",
"What did its check compare?":
"¿Qué comparó su verificación?",
"He can't say, not even roughly.":
"No sabe decirlo, ni aproximadamente.",
"The feeling came from the answer, not from knowing what happened.":
"La sensación venía de la respuesta, no de saber qué había pasado.",
"For months, the agent had been right, so Jun had stopped opening the evidence.":
"Durante meses, el agente había acertado, así que Jun dejó de abrir la evidencia.",
"Early in the term, Anil wrote in a chat that the advisers' lists looked long.":
"A inicios del semestre, Anil escribió en un chat que las listas de los asesores se veían largas.",
"Jun replied that the agent had checked its source, and they both let it go.":
"Jun respondió que el agente había verificado su fuente, y ambos lo dejaron pasar.",
"In 2010, Raja Parasuraman and Dietrich Manzey reviewed the research on automated aids.":
"En 2010, Raja Parasuraman y Dietrich Manzey revisaron la investigación sobre ayudas automatizadas.",
"When an aid has been right for a long time, people stop checking it, above all when they're busy.":
"Cuando una ayuda lleva mucho tiempo acertando, la gente deja de revisarla, sobre todo si está ocupada.",
"It happens to experts too, and training alone doesn't prevent it.":
"Les pasa también a los expertos, y la capacitación por sí sola no lo evita.",
"Like orbiting Mars, the agent's answers had come to feel routine.":
"Como orbitar Marte, las respuestas del agente habían llegado a parecer rutina.",
"The faculty planned nine advisers.":
"La facultad planificó nueve asesores.",
"It needed twelve, and 720 students never had their call.":
"Necesitaba doce, y 720 estudiantes nunca recibieron su llamada.",
"At the end of the term, Anil counted the advisers' lists: 2,880 students.":
"Al final del semestre, Anil contó las listas de los asesores: 2,880 estudiantes.",
"The agent had counted from student load, the table the university reports to the government.":
"El agente había contado desde la carga estudiantil, la tabla que la universidad reporta al gobierno.",
"There, two half-time students count as one, and half the faculty studies half-time.":
"Ahí, dos estudiantes de medio tiempo cuentan como uno, y la mitad de la facultad estudia a medio tiempo.",
"So the table said 2,160: full-time equivalents, not people.":
"Así que la tabla decía 2,160: equivalentes a tiempo completo, no personas.",
"Jun meant people; the agent took the table's meaning.":
"Jun se refería a personas; el agente tomó el significado de la tabla.",
"Neither asked.":
"Ninguno preguntó.",
"People check they've understood each other: they say it back, or ask.":
"Las personas comprueban que se entendieron: lo repiten, o preguntan.",
"A 2024 study found that language models do this less, and presume we already agree.":
"Un estudio de 2024 halló que los modelos de lenguaje lo hacen menos, y suponen que ya estamos de acuerdo.",
"The agent's check had compared its total with that same table, so it passed.":
"La verificación del agente había comparado su total con esa misma tabla, así que pasó.",
"And the record of what its hands did showed it all along: it added up full-time equivalents.":
"Y el registro de lo que hicieron sus manos lo mostraba desde el principio: sumó equivalentes a tiempo completo.",
"NASA's review board put it plainly: mistakes happen, and checks are there to catch them.":
"La junta de revisión de la NASA fue clara: los errores ocurren, y las verificaciones están para detectarlos.",
"So Jun's team changed three things, as Odyssey's team did.":
"Así que el equipo de Jun cambió tres cosas, como hizo el equipo de Odyssey.",
"Say what you mean, and hear it said back: every count names its unit, and the agent reads the question back before it counts.":
"Di lo que quieres decir y escúchalo de vuelta: cada conteo nombra su unidad, y el agente repite la pregunta antes de contar.",
"Check against something the agent didn't make, like the faculty's own list of students,":
"Compara con algo que el agente no hizo, como la propia lista de estudiantes de la facultad,",
"and read what its hands did, not only what it says.":
"y lee lo que hicieron sus manos, no solo lo que dice.",
"Write every doubt in the team's log, with an owner, until it's answered.":
"Anota cada duda en el registro del equipo, con un responsable, hasta que tenga respuesta.",
"And a person decides; the agent's tick is only for reference.":
"Y decide una persona; la marca del agente es solo de referencia.",
"This term, Jun asks again, and the agent reads it back: students in the Faculty of Health, each person counted once?":
"Este semestre, Jun vuelve a preguntar, y el agente lo repite: ¿estudiantes de la Facultad de Salud, cada persona contada una vez?",
"Jun says yes.":
"Jun dice que sí.",
"It counts 2,880, and the faculty's own list agrees.":
"Cuenta 2,880, y la propia lista de la facultad coincide.",
"So the faculty plans twelve advisers, and every student gets their call.":
"Así que la facultad planifica doce asesores, y cada estudiante recibe su llamada.",
"A fluent answer, a green tick and a long run of success all make us feel we understand.":
"Una respuesta fluida, una marca verde y una larga racha de éxitos nos hacen sentir que entendemos.",
"Odyssey's team checked anyway, and their orbiter was still at work twenty years later.":
"El equipo de Odyssey verificó de todos modos, y su orbitador seguía trabajando veinte años después.",
"Checked like that, an agent's answer is one you can plan on.":
"Verificada así, la respuesta de un agente es una con la que puedes planificar.",
"Feeling sure is not knowing.":
"Sentirse seguro no es saber."
});
