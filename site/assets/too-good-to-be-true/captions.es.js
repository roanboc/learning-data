/* Too good to be true: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"It's 10:05 on a Tuesday, in the middle of admissions season.":
 "Son las 10:05 de un martes, en plena temporada de admisiones.",
"The planning committee is deciding how many first-year places to offer next year.":
 "El comité de planificación decide cuántas vacantes de primer año ofrecer el próximo año.",
"On the screen, one number: applications for next year, up 38% overnight.":
 "En pantalla, una cifra: solicitudes para el próximo año, un 38% más de un día para otro.",
"It's good news, and nobody questions it. The committee approves six hundred extra places. Rooms are booked, and tutors will be hired.":
 "Es una buena noticia, y nadie la cuestiona. El comité aprueba seiscientas vacantes más. Se reservan salones, y se contratarán tutores.",
"This is one version of Tuesday. Let's go back to Monday.":
 "Esta es una versión del martes. Volvamos al lunes.",
"Sam, the data engineer, looks after the platform behind that number.":
 "Sam, de ingeniería de datos, cuida la plataforma detrás de esa cifra.",
"Through Sam's screen, it's a gold painting: applications for next year. On Monday, 8,200 so far.":
 "En la pantalla de Sam, es una pintura de oro: solicitudes para el próximo año. El lunes, 8,200 hasta ahora.",
"Beside it sits its contract card. One line matters this week: how much the total may change overnight.":
 "A su lado está su tarjeta de contrato. Esta semana importa una línea: cuánto puede cambiar el total de un día para otro.",
"Leila, who manages the admissions office, helped set it. On a closing date, applications really do jump, by up to about 15%.":
 "Leila, que dirige la oficina de admisión, ayudó a fijarla. En un cierre de solicitudes, estas sí saltan, hasta cerca de un 15%.",
"So above 10%, a test raises a warning: worth a look, but the data goes through.":
 "Así que por encima del 10%, una prueba lanza una advertencia: merece una mirada, pero los datos pasan.",
"Above 25%, it raises an error: this must not reach a decision, so the build stops.":
 "Por encima del 25%, lanza un error: esto no debe llegar a una decisión, así que la actualización se detiene.",
"A test on the number itself, not just on each row, with levels the business helped choose.":
 "Una prueba sobre la cifra misma, no solo sobre cada fila, con niveles que el negocio ayudó a elegir.",
"At eleven on Monday night, the admissions system syncs with the application portal.":
 "A las once de la noche del lunes, el sistema de admisión se sincroniza con el portal de solicitudes.",
"Tonight, the sync times out and restarts. It copies the whole week's applications again, 3,100 of them, and gives every copy a new ID.":
 "Esta noche, la sincronización se queda sin tiempo y se reinicia. Copia otra vez las solicitudes de toda la semana, 3,100, y le da a cada copia un ID nuevo.",
"The admissions system now holds each of those applications twice. The platform copies what the source holds, faithfully.":
 "Ahora el sistema de admisión tiene cada una de esas solicitudes dos veces. La plataforma copia fielmente lo que tiene el origen.",
"At two, the nightly build begins, and the checks run, one row at a time. Every ID is unique. No field is empty. Every course exists.":
 "A las dos, empieza la actualización nocturna, y los controles corren, fila por fila. Cada ID es único. Ningún campo está vacío. Cada carrera existe.",
"Then the total reaches its test: 11,340. Up 38% in one night, when the real growth was forty.":
 "Luego el total llega a su prueba: 11,340. Un 38% más en una noche, cuando el crecimiento real fue de cuarenta.",
"The needle swings past amber, into red.":
 "La aguja pasa el ámbar, y entra en el rojo.",
"Every row was valid. Only a test on the total could see that there were too many.":
 "Cada fila era válida. Solo una prueba sobre el total podía ver que sobraban.",
"What happens next depends on that test. Here are three versions of the same Tuesday.":
 "Lo que pasa después depende de esa prueba. Aquí hay tres versiones del mismo martes.",
"In the first, there's no test. 11,340 reaches the painting, and the committee approves six hundred places.":
 "En la primera, no hay prueba. 11,340 llega a la pintura, y el comité aprueba seiscientas vacantes.",
"Three weeks later, the copies are found. The places are cut again, the rooms released, and nobody trusts the dashboard.":
 "Tres semanas después, se encuentran las copias. Se recortan las vacantes, se liberan los salones, y nadie confía en el dashboard.",
"In the second, the test is only a warning. It turns amber, and the number is published anyway.":
 "En la segunda, la prueba es solo una advertencia. Se pone en ámbar, y la cifra se publica de todos modos.",
"The warning lands in a channel with forty others. Nobody reads it before ten, and the committee makes the same decision.":
 "La advertencia cae en un canal con otras cuarenta. Nadie la lee antes de las diez, y el comité toma la misma decisión.",
"In the third, the test is an error. The build stops before gold.":
 "En la tercera, la prueba es un error. La actualización se detiene antes del oro.",
"The painting keeps Monday's 8,200, with a note: last good data, as of 2 am on Monday. Checking an unusual change.":
 "La pintura conserva los 8,200 del lunes, con un aviso: últimos datos buenos, de las 2 am del lunes. Revisando un cambio inusual.",
"David, who chairs the committee, moves the decision to Wednesday. A day late, and right.":
 "David, que preside el comité, pasa la decisión al miércoles. Un día tarde, pero bien.",
"A wrong number gets acted on. A late number, clearly labelled, simply waits.":
 "Con una cifra equivocada, se actúa. Una cifra atrasada, bien etiquetada, simplemente espera.",
"At our university, this test is an error. So this is the Tuesday that happens.":
 "En nuestra universidad, esta prueba es un error. Así que este es el martes que ocurre.",
"So why not make every test an error?":
 "¿Por qué no hacer de cada prueba un error?",
"Because on a closing date, a jump of 14% is real. Stopping it would hold back good data, and teach people to ignore alarms.":
 "Porque en un cierre de solicitudes, un salto del 14% es real. Detenerlo retendría datos buenos, y enseñaría a ignorar las alarmas.",
"So this number has two levels. Amber, for worth a look. Red, for must not reach a decision.":
 "Así que esta cifra tiene dos niveles. Ámbar: merece una mirada. Rojo: no debe llegar a una decisión.",
"A warning only helps if someone reads it, so each one has an owner.":
 "Una advertencia solo sirve si alguien la lee: cada una tiene un responsable.",
"Choose the level by what a wrong number would cost.":
 "Elige el nivel según lo que costaría una cifra equivocada.",
"That cost is easy to count once something goes wrong. The value of a right number, on an ordinary day, is much harder to see.":
 "Ese costo es fácil de contar cuando algo sale mal. El valor de una cifra correcta, en un día normal, es mucho más difícil de ver.",
"At 8:15 on Tuesday, Sam follows the thread upstream, from the painting, through silver, to bronze.":
 "A las 8:15 del martes, Sam sigue el hilo río arriba, de la pintura, por plata, hasta bronce.",
"In bronze, 3,100 pairs of rows are identical, except for their ID and when they were created.":
 "En bronce, 3,100 pares de filas son idénticos, salvo por su ID y la hora en que se crearon.",
"The uniqueness test checked the ID, and every ID was unique.":
 "La prueba de unicidad revisó el ID, y cada ID era único.",
"But in the real world, an application is one applicant, for one course, in one intake. That's its business key.":
 "Pero en el mundo real, una solicitud es un solicitante, para una carrera, en un ingreso. Esa es su clave de negocio.",
"Test uniqueness on what makes a thing unique in the real world, not only on the system's ID.":
 "Prueba la unicidad en lo que hace única a una cosa en el mundo real, no solo en el ID del sistema.",
"Sam messages Rosa, on the admissions system team. Her team finds the restart within the hour.":
 "Sam le escribe a Rosa, del equipo del sistema de admisión. Su equipo encuentra el reinicio en menos de una hora.",
"The copies are in the admissions system itself, so that's where they're removed. And the sync is changed, so it's safe to run twice.":
 "Las copias están en el propio sistema de admisión, así que ahí se eliminan. Y se cambia la sincronización, para que sea seguro correrla dos veces.",
"The platform doesn't patch its copy by hand. It loads the affected week again, from the corrected system, so its copy matches the source.":
 "La plataforma no parcha su copia a mano. Vuelve a cargar la semana afectada, desde el sistema corregido, para que su copia coincida con el origen.",
"Silver and gold are rebuilt from it.":
 "Plata y oro se reconstruyen desde ahí.",
"Time travel lays Monday night's total beside today's: 11,340 then, 8,240 now. Forty more than Monday, as it should be.":
 "Time travel pone el total del lunes por la noche junto al de hoy: 11,340 entonces, 8,240 ahora. Cuarenta más que el lunes, como debe ser.",
"On Wednesday, the committee plans with the right number.":
 "El miércoles, el comité planifica con la cifra correcta.",
"The incident leaves a new test behind: one application per applicant, course and intake.":
 "El incidente deja una prueba nueva: una solicitud por solicitante, carrera e ingreso.",
"Syncs will time out again. When in doubt, keep the last good number, and say so.":
 "Las sincronizaciones volverán a fallar. Ante la duda, conserva la última cifra buena, y dilo.",
"Stale and labelled beats fresh and wrong.":
 "Mejor vieja y etiquetada que fresca y equivocada."
});
