/* Good enough for what?: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's pages (films/fit-for-use/series.json) and its shared numbers: la lista de graduación, el diploma for a degree certificate, impreso de
   nuevo for printed again, el título for an award, el control for a check, la responsable de graduaciones (Malia), la oficina de registro (Mei, as the earlier
   films say), Planificación, el Máster en Analítica de Datos. New here: el Aula Magna for the Great Hall, la carta for Mercator's chart and los navegantes for
   its sailors (ad usum navigantium), el rumbo for a bearing, la imprenta for the printer, los datos críticos, una etiqueta gobernada, aptitud para el uso
   for Juran's fitness for use, and DAMA's six questions as the Spanish DMBOK asks them. The films the narration names keep their Spanish titles (Reglas que se
   ejecutan, Demasiado bueno para ser verdad). Names on screen stay as they are: STEERING, COMPARING SIZES, S-19530, DEC25-3, critical_data, Ad usum navigantium. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Duisburg, 1569. The mapmaker Gerardus Mercator publishes a new chart of the world, made for sailors.":
"Duisburgo, 1569. El cartógrafo Gerardus Mercator publica una nueva carta del mundo, hecha para navegantes.",
"At sea, a pilot steered by compass, on a bearing: one fixed angle to north, held hour after hour.":
"En el mar, un piloto navegaba con brújula, a rumbo fijo: un mismo ángulo con el norte, hora tras hora.",
"But on the charts of the time, a straight line between two ports wasn't a bearing a ship could hold.":
"Pero en las cartas de la época, una línea recta entre dos puertos no era un rumbo que un barco pudiera mantener.",
"Steer the angle the chart showed, and the ship slowly left the line.":
"Siguiendo el ángulo de la carta, el barco se apartaba poco a poco de la línea.",
"On a long crossing, it could miss the coast it was making for, and its crew spend days more at sea, short of water.":
"En una travesía larga, podía errar la costa a la que iba, y su tripulación pasar días de más en el mar, con poca agua.",
"Sailors needed a chart they could steer by, not just look at.":
"Los marinos necesitaban una carta con la que pudieran navegar, no solo mirarla.",
"Mercator stretched his chart towards the poles, a little more at every degree, so every course on one bearing is a straight line.":
"Mercator estiró su carta hacia los polos, un poco más en cada grado, para que todo rumbo fijo sea una línea recta.",
"On his chart, a pilot could rule a line between two ports, read its angle, and steer it.":
"En su carta, un piloto podía trazar una línea entre dos puertos, leer su ángulo y seguirlo.",
"Thirty years later, Edward Wright worked out the stretch exactly, and most charts for sailors are still drawn this way.":
"Treinta años después, Edward Wright calculó el estiramiento exacto, y la mayoría de las cartas náuticas aún se dibuja así.",
"The price was chosen on purpose: far from the equator, every country swells.":
"El precio se eligió a propósito: lejos del ecuador, todo país se agranda.",
"Greenland looks as big as Africa, which is fourteen times larger.":
"Groenlandia parece tan grande como África, que es catorce veces mayor.",
"Right for steering, wrong for comparing countries: one chart, made for one use.":
"Correcta para navegar, incorrecta para comparar países: una carta, hecha para un uso.",
"Data is the same. In December 2025, a university's graduation list seated its Great Hall well.":
"Con los datos, igual. En diciembre de 2025, la lista de graduación de una universidad acomodó bien su Aula Magna.",
"And still, 41 of its degree certificates had to be printed again.":
"Y aun así, 41 de sus diplomas tuvieron que imprimirse de nuevo.",
"So the people who use the list, answer for it and build it wrote down what it's for.":
"Así que quienes usan la lista, responden por ella y la construyen escribieron para qué sirve.",
"Now each use has its own level, agreed with the people who use it.":
"Ahora cada uso tiene su propio nivel, acordado con quienes la usan.",
"December 2025, at the university: six ceremonies in the Great Hall, for 2,031 graduates.":
"Diciembre de 2025, en la universidad: seis ceremonias en el Aula Magna, para 2,031 graduados.",
"The graduation list says who graduates, at which ceremony, with which award, and the name printed on each certificate.":
"La lista de graduación dice quién se gradúa, en qué ceremonia, con qué título y el nombre impreso en cada diploma.",
"It goes to the printer about four weeks before the first ceremony. After that, any change means a certificate printed again.":
"Va a la imprenta unas cuatro semanas antes de la primera ceremonia. Después, cualquier cambio es un diploma impreso de nuevo.",
"That December, the list passed every check on it.":
"Ese diciembre, la lista pasó todos sus controles.",
"Still, 41 certificates were printed again: 26 had a wrong name, 9 a wrong award, and 6 graduates were missing from the list.":
"Aun así, 41 diplomas se imprimieron de nuevo: 26 con el nombre mal, 9 con el título mal, y 6 graduados faltaban en la lista.",
"Each cost about 120 dollars with its courier, and a graduate might cross the stage holding an empty folder.":
"Cada uno costó unos 120 dólares con su mensajería, y un graduado podía cruzar el escenario con una carpeta vacía.",
"The same list had seated the hall well: every ceremony's count was right to within a few seats.":
"La misma lista había acomodado bien el Aula Magna: cada ceremonia contó bien, con pocos asientos de diferencia.",
"Next December, Andrés Peñaloza will cross the same stage, with a Master of Data Analytics.":
"El próximo diciembre, Andrés Peñaloza cruzará el mismo escenario, con un Máster en Analítica de Datos.",
"The student system holds his name as Andres Penaloza, without its accents.":
"El sistema de estudiantes guarda su nombre como Andres Penaloza, sin sus tildes.",
"For seating, that's one graduate and one seat: right. On his certificate, it isn't his name.":
"Para los asientos, es un graduado y un asiento: correcto. En su diploma, no es su nombre.",
"So, was the list good? That depends what it's for.":
"Entonces, ¿la lista era buena? Depende de para qué sirva.",
"In January 2026, three people sat down with the list.":
"En enero de 2026, tres personas se sentaron con la lista.",
"Malia Fonoti, the graduations officer, who uses it most.":
"Malia Fonoti, la responsable de graduaciones, quien más la usa.",
"Mei Tanaka, in the registrar's office, who answers for its names and awards.":
"Mei Tanaka, de la oficina de registro, que responde por sus nombres y títulos.",
"And Jun Park, who builds it.":
"Y Jun Park, que la construye.",
"They didn't start by asking if it was good.":
"No empezaron preguntando si era buena.",
"They asked who uses it, for what, and what goes wrong, for whom, when it's wrong.":
"Preguntaron quién la usa, para qué, y qué sale mal, y para quién, cuando está mal.",
"The seating plan needs each ceremony's count. Within 2% is good enough: a few seats spare, or a few more chairs.":
"El plano de asientos necesita el conteo de cada ceremonia. Con un 2% basta: algunos asientos de sobra, o unas sillas más.",
"The certificates need every name, award and date exactly right. Zero wrong: one mistake is a certificate printed again.":
"Los diplomas necesitan cada nombre, título y fecha exactos. Cero errores: un error es un diploma impreso de nuevo.",
"The printed programme needs the same names as the certificates. A change after it's printed goes on a slip.":
"El programa impreso necesita los mismos nombres que los diplomas. Un cambio posterior va en una nota suelta.",
"And the government's count of awards, which Planning sends, needs each award counted once, exactly.":
"Y el conteo de títulos que Planificación envía al gobierno necesita cada título contado una sola vez, exacto.",
"One list, four uses, four levels.":
"Una lista, cuatro usos, cuatro niveles.",
"The quality pioneer Joseph Juran called quality fitness for use.":
"Joseph Juran, pionero de la calidad, la llamó aptitud para el uso.",
"Data is no different: good enough always means good enough for a use.":
"En datos es igual: lo bastante bueno siempre es lo bastante bueno para un uso.",
"For each use, they named the few things it can't do without: its critical data.":
"Para cada uso, nombraron lo poco que le es imprescindible: sus datos críticos.",
"Seating needs each graduate once, their ceremony, and whether they'll be there.":
"Los asientos necesitan a cada graduado una vez, su ceremonia y si va a asistir.",
"A certificate needs the name as printed, the award, and the date it was conferred.":
"Un diploma necesita el nombre tal como se imprime, el título y la fecha en que se otorgó.",
"Then they asked six questions of each. Is it complete? Unique? Valid? Consistent? Accurate? On time?":
"Luego preguntaron seis cosas de cada uno. ¿Completo? ¿Único? ¿Válido? ¿Coherente? ¿Exacto? ¿A tiempo?",
"These are DAMA's six dimensions of data quality. An ISO standard names fifteen; six are enough to start.":
"Son las seis dimensiones de calidad de datos de DAMA. Una norma ISO nombra quince; seis bastan para empezar.",
"Each use leans on different ones, as Mercator's chart chose angles over sizes.":
"Cada uso se apoya en distintas, como la carta de Mercator: ángulos antes que tamaños.",
"Seating needs the list complete: every graduate who crosses the stage, once.":
"Los asientos necesitan la lista completa: cada graduado que cruza el escenario, una vez.",
"A certificate needs it accurate: the name its graduate really has.":
"Un diploma la necesita exacta: el nombre que su graduado tiene de verdad.",
"Each level was agreed with the people who use it: Malia for the ceremonies, Planning for the government's count.":
"Cada nivel se acordó con quienes la usan: Malia para las ceremonias, Planificación para el conteo del gobierno.",
"And Mei owns every level, because she answers for the list.":
"Y Mei es dueña de cada nivel, porque responde por la lista.",
"How a check warns or stops, and whom it tells, is set in advance too: Rules that run and Too good to be true show how.":
"También se fija antes cómo avisa o detiene un control, y a quién: lo muestran Reglas que se ejecutan y Demasiado bueno para ser verdad.",
"Jun wrote it all down beside the data, in the file that describes the list.":
"Jun lo escribió todo junto a los datos, en el archivo que describe la lista.",
"Each use is a quality rule, written in words: its dimension, its level, who agreed it, and what a failure costs.":
"Cada uso es una regla de calidad, escrita en palabras: su dimensión, su nivel, quién la acordó y qué cuesta un fallo.",
"The columns each use can't do without are marked as critical data.":
"Las columnas imprescindibles para cada uso se marcan como datos críticos.",
"In dbt, every check on the list names its dimension and its owner.":
"En dbt, cada control de la lista nombra su dimensión y su responsable.",
"And on Databricks, each critical column carries a governed tag, so whoever finds the table sees what its uses depend on.":
"Y en Databricks, cada columna crítica lleva una etiqueta gobernada, para que quien encuentre la tabla vea de qué dependen sus usos.",
"If quality keeps failing anyway, look first at your governance, who owns the data and decides, and then at your tools.":
"Si la calidad sigue fallando, mira primero tu gobierno de datos, quién es dueño de los datos y decide, y luego tus herramientas.",
"Mercator's chart said what it was for, in its title: for the use of sailors.":
"La carta de Mercator decía para qué era, en su título: para el uso de los navegantes.",
"The graduation list now says what it's for, too: four uses, each with its level.":
"La lista de graduación ahora también dice para qué es: cuatro usos, cada uno con su nivel.",
"Next, the team looks at a hundred of its records, one by one.":
"Después, el equipo revisa cien de sus registros, uno por uno.",
"Ask what it's for before you ask if it's good.":
"Pregunta para qué es antes de preguntar si es bueno."
});
