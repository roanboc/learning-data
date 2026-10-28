/* Quality on the platform: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in Rules that run: control for a check, dueño, Planificación, el gobierno for the government, el tablero de calidad for the scorecard (el tablero for short),
   una incidencia, una advertencia, el equipo de aprendizaje and el equipo de datos, una encuesta, and the dimensions completitud and the others; numbers keep the picture's
   form (3.9). As in Governed in dbt: prueba for a test, una construcción for a build, la plataforma; as in Fixed where it starts, el formulario and una alerta, las
   insignias and sus créditos; as in Governed in Unity Catalog, versión preliminar for preview. Here monitoring is el monitoreo, the pipeline keeps its name (el pipeline,
   as in the analytics films), an expectation is una expectativa, a profile un perfil, an enrolment una inscripción, the learning domain el área de aprendizaje, and the
   owner on record el dueño registrado. dbt keeps its name. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In Planning's room, Clara Jensen checks the numbers before they leave.":
"En la sala de Planificación, Clara Jensen revisa los números antes de que salgan.",
"The census numbers go to the government, and the lists to the faculties.":
"Los números del censo van al gobierno, y las listas, a las facultades.",
"When Yusuf asked what slowed her down, Clara said: which number do I trust?":
"Cuando Yusuf le preguntó qué la frenaba, Clara dijo: ¿en qué número confío?",
"Checks ran every night, but a failed one said only its name, not whose data it was.":
"Los controles se ejecutaban cada noche, pero uno fallido solo decía su nombre, no de quién eran los datos.",
"A warning that emails were typed with spaces and capitals had run for a year, and nobody owned it.":
"Una advertencia de correos escritos con espacios y mayúsculas llevaba un año, y nadie era su dueño.",
"And data quality was a survey: people rated their data, 3.9 out of 5.":
"Y la calidad de datos era una encuesta: cada quien calificaba sus datos, 3.9 de 5.",
"So a broken night could change a number on its way to the government, and nobody knew whose it was to fix.":
"Así, una noche rota podía cambiar un número camino al gobierno, y nadie sabía a quién le tocaba arreglarlo.",
"Something had to change.":
"Algo tenía que cambiar.",
"Now every check names its owner, the kind of quality it checks, and the level its owner chose.":
"Ahora cada control nombra a su dueño, el tipo de calidad que verifica y el nivel que eligió su dueño.",
"Monitoring watches for what no rule names.":
"El monitoreo vigila lo que ninguna regla nombra.",
"And each morning, every result goes into one scorecard, with an issue for each owner.":
"Y cada mañana, cada resultado entra en un solo tablero de calidad, con una incidencia para cada dueño.",
"On the 19th of October, five more enrolments arrived with no email.":
"El 19 de octubre llegaron cinco inscripciones más sin correo.",
"That made six, more than the five the learning team allows.":
"Eran seis, más de las cinco que permite el equipo de aprendizaje.",
"Everything built from them stopped, so nothing wrong went out: Planning kept the day before's numbers.":
"Todo lo construido con ellas se detuvo, y nada erróneo salió: Planificación conservó los números del día anterior.",
"By noon, the learning team had added the six emails, and that night, all 160 checks passed.":
"Al mediodía, el equipo de aprendizaje había agregado los seis correos, y esa noche pasaron los 160 controles.",
"Now Clara knows each morning which numbers to trust, and who answers for each.":
"Ahora Clara sabe cada mañana en qué números confiar, y quién responde por cada uno.",
"In the project, each check is a dbt test, and each test names its owner and the kind of quality it checks, its dimension.":
"En el proyecto, cada control es una prueba de dbt, y cada prueba nombra a su dueño y el tipo de calidad que verifica, su dimensión.",
"The owner comes from the folder: every test on the short-course data is the learning team's.":
"El dueño viene de la carpeta: toda prueba sobre los datos de cursos cortos es del equipo de aprendizaje.",
"The dimension comes from the kind of test: a test for empty values checks completeness.":
"La dimensión viene del tipo de prueba: una prueba de valores vacíos verifica la completitud.",
"The level is in the test, as its owner chose: warn on one enrolment with no email, stop above five.":
"El nivel está en la prueba, como lo eligió su dueño: advertir con una inscripción sin correo, detener con más de cinco.",
"The decision log says who chose it, and why.":
"El registro de decisiones dice quién lo eligió, y por qué.",
"And a test without an owner or a dimension doesn't get in.":
"Y una prueba sin dueño o sin dimensión no entra.",
"After each night's build, two scripts read dbt's results.":
"Tras cada construcción nocturna, dos scripts leen los resultados de dbt.",
"One writes the scorecard: for each area and each dimension, how many tests passed.":
"Uno escribe el tablero de calidad: por cada área y cada dimensión, cuántas pruebas pasaron.",
"On the 19th, learning's completeness was six of seven.":
"El 19, la completitud del área de aprendizaje fue seis de siete.",
"The tests on what was built from the stopped data didn't run: they count as not run, not as failed.":
"Las pruebas sobre lo construido con los datos detenidos no se ejecutaron: cuentan como no ejecutadas, no como fallidas.",
"The other script writes each owner an issue to answer: what didn't pass, and why the level is there.":
"El otro script le escribe a cada dueño una incidencia que responder: qué no pasó, y por qué existe ese nivel.",
"A cause to fill in, and a date to answer by.":
"Una causa que completar, y una fecha para responder.",
"A dbt test, on what the data team builds, is one place to check.":
"Una prueba de dbt, sobre lo que construye el equipo de datos, es un lugar de control.",
"There are three more along the data's way: where it's typed, where it's loaded, and on the platform's tables, as monitoring.":
"Hay tres más en el camino de los datos: donde se escriben, donde se cargan, y en las tablas de la plataforma, como monitoreo.",
"Each catches what the others can't, and each tells the data's owner.":
"Cada uno atrapa lo que los otros no pueden, y cada uno avisa al dueño de los datos.",
"Prevent what you can, where it starts.":
"Prevén lo que puedas, donde empieza.",
"Check what you know.":
"Controla lo que conoces.",
"Watch for what you don't.":
"Vigila lo que no conoces.",
"Emails used to arrive as typed, with spaces and capitals, and every night the data team cleaned them.":
"Los correos llegaban tal como se escribían, con espacios y mayúsculas, y cada noche el equipo de datos los limpiaba.",
"From the 2nd of November, the sign-up form checks each email as it's typed.":
"Desde el 2 de noviembre, el formulario de inscripción revisa cada correo mientras se escribe.",
"A test on the source, as the data team reads it in, checks every email recorded since, and stops the build if one isn't clean.":
"Una prueba en la fuente, al leerla el equipo de datos, revisa cada correo desde esa fecha y detiene la construcción si uno no está limpio.",
"It should never fail: if it does, the form has broken.":
"Nunca debería fallar: si falla, el formulario se rompió.",
"Once the old emails are corrected, the clean-up goes, and the test checks every row.":
"Cuando se corrijan los correos viejos, la limpieza se va, y la prueba revisa cada fila.",
"Each night, the platform team's pipeline loads each system's files.":
"Cada noche, el pipeline del equipo de plataforma carga los archivos de cada sistema.",
"Its expectations, rules on each table, check that a row can be loaded at all.":
"Sus expectativas, reglas sobre cada tabla, verifican que una fila se pueda cargar.",
"An enrolment with no ID can't be told apart from another, so it's kept out, and counted.":
"Una inscripción sin ID no se distingue de otra, así que queda fuera, y se cuenta.",
"The count reaches its owner like any other result, and the row is fixed where it's kept, in the short-course platform.":
"El conteo llega a su dueño como cualquier otro resultado, y la fila se corrige donde se guarda, en la plataforma de cursos cortos.",
"One night, half the new badges arrived with no credit.":
"Una noche, la mitad de las insignias nuevas llegó sin créditos.",
"Every test passed: no rule said a microcredential carries credit.":
"Todas las pruebas pasaron: ninguna regla pedía créditos a una microcredencial.",
"Monitoring caught it.":
"El monitoreo lo detectó.",
"The platform learns when each table usually arrives, and how many rows it brings, with no rule to write; that's in preview.":
"La plataforma aprende cuándo suele llegar cada tabla y cuántas filas trae, sin escribir reglas; eso está en versión preliminar.",
"And a profile of the badges counts, each night, how many carry no credit: usually one in twelve.":
"Y un perfil de las insignias cuenta, cada noche, cuántas no llevan créditos: por lo general, una de cada doce.",
"That night, one in two.":
"Esa noche, una de cada dos.",
"An alert went to the owner on record, the learning team.":
"Una alerta fue al dueño registrado: el equipo de aprendizaje.",
"Once they'd confirmed it, the surprise became a test.":
"Una vez confirmado, la sorpresa se volvió una prueba.",
"The pipeline's counts and the monitors' results land on the platform, by table.":
"Los conteos del pipeline y los resultados del monitoreo quedan en la plataforma, por tabla.",
"Each table's owner is in the project, so the scorecard reads them too, in a table under the tests'.":
"El dueño de cada tabla está en el proyecto, así que el tablero también los lee, en una tabla bajo la de las pruebas.",
"Every result reaches one owner, not a shared inbox.":
"Cada resultado llega a un dueño, no a un buzón compartido.",
"And quality is measured, not surveyed: last night, 160 of 160 tests passed, one with a warning.":
"Y la calidad se mide, no se encuesta: anoche pasaron 160 de 160 pruebas, una con advertencia.",
"So did the platform's 22 checks, and every test had an owner and a dimension.":
"También los 22 controles de la plataforma, y cada prueba tenía dueño y dimensión.",
"This morning, Clara opens the scorecard before the numbers leave.":
"Esta mañana, Clara abre el tablero de calidad antes de que salgan los números.",
"One amber cell: an enrolment with no email, that the learning team is following up.":
"Una celda ámbar: una inscripción sin correo, que el equipo de aprendizaje está siguiendo.",
"Everything else passed, and every cell has an owner.":
"Todo lo demás pasó, y cada celda tiene dueño.",
"Clara knows which numbers to trust, and who answers for each.":
"Clara sabe en qué números confiar, y quién responde por cada uno.",
"Rules you write, and monitoring for the rest.":
"Reglas que escribes, y monitoreo para el resto."
});
