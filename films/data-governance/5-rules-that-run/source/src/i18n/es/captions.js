/* Rules that run: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series: gobernanza, dueño, Planificación, el informe, la carpeta nueve, el gobierno for the government; as in Fixed where it starts, control for a check,
   el tablero de calidad for the scorecard (el tablero for short), una incidencia, el equipo de aprendizaje and el equipo de datos; as in Teachers of data, una advertencia
   for a warning and el horario de atención for office hours. To run is ejecutarse, as in the film's Spanish title, Reglas que se ejecutan; the night's update is
   la actualización nocturna, a walk-in una inscripción en persona, the rule register el registro de reglas, and the six dimensions completitud, unicidad, validez,
   consistencia, exactitud and oportunidad. The Nile's measure is el nilómetro, in codos, read by el encargado; a guess is adivinar each time the film says it,
   so the analogy holds, and numbers keep the picture's form (3.9). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Fustat, in what is now Cairo, in 861.":
"Fustat, en lo que hoy es El Cairo, en 861.",
"Egypt's harvest depends on the Nile's summer flood.":
"La cosecha de Egipto depende de la crecida de verano del Nilo.",
"When the flood is low, the fields stay dry, and a land tax set by guess would take the grain a farmer's family needs to eat.":
"Con una crecida baja, los campos quedan secos, y un impuesto adivinado se llevaría el grano que una familia campesina necesita para comer.",
"A fair tax needs a measure.":
"Un impuesto justo necesita una medida.",
"On Roda Island, a new Nilometer is finished: a well open to the Nile, and a column marked in cubits.":
"En la isla de Roda, se termina un nuevo nilómetro: un pozo abierto al Nilo, y una columna marcada en codos.",
"The keeper reads the water every day, and the officials get the readings.":
"El encargado lee el agua cada día, y los funcionarios reciben las lecturas.",
"At sixteen cubits, the tax is due in full.":
"A los dieciséis codos, el impuesto se paga completo.",
"Below it, it isn't.":
"Por debajo, no.",
"So farmers pay what the river allows, and officials know the tax before the harvest.":
"Así, los campesinos pagan lo que el río permite, y los funcionarios conocen el impuesto antes de la cosecha.",
"That's what a quality score should be: a measure every day, a level set in advance, so those who decide know which data to trust.":
"Así debe ser un puntaje de calidad: una medida diaria, un nivel fijado de antemano, para que quien decide sepa en qué datos confiar.",
"At the university, binder nine says data quality is monitored.":
"En la universidad, la carpeta nueve dice que la calidad de datos se monitorea.",
"Here, monitored means a survey.":
"Aquí, monitorear significa una encuesta.",
"Each spring, every system's owner rates its data from one to five.":
"Cada primavera, el dueño de cada sistema califica sus datos del uno al cinco.",
"The short-course platform: four.":
"La plataforma de cursos cortos: cuatro.",
"Average: 3.9.":
"Promedio: 3.9.",
"David asks: can we trust the number we send to the government?":
"David pregunta: ¿podemos confiar en el número que enviamos al gobierno?",
"The survey can't say.":
"La encuesta no puede decirlo.",
"Like a guess at the flood, it measures how people feel about their data, not the data.":
"Como adivinar la crecida, mide cómo se sienten las personas con sus datos, no los datos.",
"Yusuf needs a measure.":
"Yusuf necesita una medida.",
"But like the keeper, the data team already measures, every night.":
"Pero, como el encargado, el equipo de datos ya mide, cada noche.",
"As the night's update brings in each system's data, a hundred and sixty checks run.":
"Mientras la actualización nocturna trae los datos de cada sistema, se ejecutan ciento sesenta controles.",
"Every learner has an ID.":
"Cada estudiante tiene un ID.",
"No learner appears twice.":
"Ningún estudiante aparece dos veces.",
"Planning's number matches the census report.":
"El número de Planificación coincide con el informe del censo.",
"Each check passes, warns or fails.":
"Cada control pasa, advierte o falla.",
"But a result names only the check.":
"Pero un resultado solo nombra el control.",
"Not whose it is, or what kind of quality it checks.":
"No de quién es, ni qué tipo de calidad verifica.",
"So Yusuf asks for two things on every check.":
"Así que Yusuf pide dos cosas en cada control.",
"An owner: whoever owns the data it checks.":
"Un dueño: quien sea dueño de los datos que verifica.",
"The short-course checks belong to the learning team.":
"Los controles de cursos cortos son del equipo de aprendizaje.",
"And a dimension: the kind of quality it checks.":
"Y una dimensión: el tipo de calidad que verifica.",
"There are six common ones: completeness, uniqueness, validity, consistency, accuracy and timeliness.":
"Hay seis comunes: completitud, unicidad, validez, consistencia, exactitud y oportunidad.",
"A check for empty values is about completeness; for duplicates, uniqueness.":
"Un control de valores vacíos es de completitud; uno de duplicados, de unicidad.",
"Jun writes both into the rule register, beside every check.":
"Jun escribe los dos en el registro de reglas, junto a cada control.",
"Now the scorecard writes itself, from last night's checks.":
"Ahora el tablero de calidad se escribe solo, con los controles de anoche.",
"A row for each area, a column for each dimension, and in each cell, how many checks passed, of how many.":
"Una fila por área, una columna por dimensión, y en cada celda, cuántos controles pasaron, de cuántos.",
"Under it, what didn't pass, and whose it is.":
"Debajo, lo que no pasó, y de quién es.",
"And David's question has an answer.":
"Y la pregunta de David tiene respuesta.",
"Planning's number matches the census report, faculty by faculty.":
"El número de Planificación coincide con el informe del censo, facultad por facultad.",
"That check is Planning's, and last night, it passed.":
"Ese control es de Planificación, y anoche pasó.",
"Each check needs its sixteen cubits.":
"Cada control necesita sus dieciséis codos.",
"But who sets the level?":
"Pero ¿quién fija el nivel?",
"Not governance: its owner.":
"No la gobernanza: su dueño.",
"An enrolment with no email: one or two walk-ins a term are normal, and the learning team follows them up.":
"Una inscripción sin correo: una o dos en persona por periodo son normales, y el equipo de aprendizaje les da seguimiento.",
"So they chose: warn on any, and stop the night's update above five.":
"Así que eligieron: advertir con cualquiera, y detener la actualización con más de cinco.",
"Planning chose the opposite.":
"Planificación eligió lo contrario.",
"Any difference from the census report stops it, because that number goes to the government.":
"Cualquier diferencia con el informe del censo la detiene, porque ese número va al gobierno.",
"Each owner signs the rule, with its level and reason; the data team writes it into the check.":
"Cada dueño firma la regla, con su nivel y su motivo; el equipo de datos la escribe en el control.",
"A rule its owner doesn't understand gets ignored, then switched off.":
"Una regla que su dueño no entiende se ignora, y luego se apaga.",
"At Thursday's office hours, Tom reads the learning row.":
"En el horario de atención del jueves, Tom lee la fila de aprendizaje.",
"One amber cell he knows: a walk-in from February, whose certificate still can't reach anyone.":
"Conoce una celda ámbar: una inscripción en persona de febrero, cuyo certificado aún no llega a nadie.",
"And one he's never seen: emails typed with spaces and capitals, warning every night for a year.":
"Y una que nunca vio: correos escritos con espacios y mayúsculas, advirtiendo cada noche desde hace un año.",
"The night's update cleans them, so nothing broke.":
"La actualización nocturna los limpia, así que nada se rompió.",
"Nobody owned the warning, so nobody read it.":
"La advertencia no tenía dueño, así que nadie la leyó.",
"Now it's his team's.":
"Ahora es de su equipo.",
"Following up the walk-ins isn't a check.":
"Seguir las inscripciones en persona no es un control.",
"It's about what people do, not the data, so it never stops the update: it's a list the learning team works through.":
"Trata de lo que hace la gente, no de los datos, así que nunca detiene la actualización: es una lista que atiende el equipo de aprendizaje.",
"One night, five more walk-ins arrive with no email.":
"Una noche, llegan cinco inscripciones en persona más, sin correo.",
"That's six, over the learning team's five, so the check fails.":
"Son seis, más que los cinco del equipo de aprendizaje, así que el control falla.",
"Everything built from the short courses stops, and keeps yesterday's numbers, Planning's too.":
"Todo lo que se construye con los cursos cortos se detiene y conserva los números de ayer, también los de Planificación.",
"In the morning, the scorecard has one red cell, and the learning team an issue, with a date.":
"En la mañana, el tablero tiene una celda roja, y el equipo de aprendizaje, una incidencia con fecha.",
"Tom knows what it means.":
"Tom sabe qué significa.",
"His team chose the level.":
"Su equipo eligió el nivel.",
"Their list shows the six.":
"Su lista muestra las seis.",
"By noon, they've registered them, with their emails.":
"Al mediodía, ya las registraron, con sus correos.",
"That night, the cell is green.":
"Esa noche, la celda está verde.",
"Binder nine's line runs now: every rule a check, with an owner, a level and a reason, and a scorecard read from what ran.":
"La línea de la carpeta nueve ya se ejecuta: cada regla, un control con dueño, nivel y motivo, y un tablero leído de lo que se ejecutó.",
"From now on, a rule without an owner and a dimension is sent back.":
"Desde ahora, una regla sin dueño ni dimensión se devuelve.",
"Like the Nilometer, the scorecard is a measure, not a guess.":
"Como el nilómetro, el tablero es una medida: no se adivina.",
"The university knows each morning which data it can trust, what's held back, and who fixes it.":
"Cada mañana, la universidad sabe en qué datos puede confiar, qué quedó retenido, y quién lo arregla.",
"Where problems like these start is the next film.":
"Dónde empiezan problemas como estos, en la próxima película.",
"A quality rule is a check with an owner.":
"Una regla de calidad es un control con dueño."
});
