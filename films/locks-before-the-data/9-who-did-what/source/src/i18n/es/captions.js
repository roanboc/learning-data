/* Who did what: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in
   src/narration.js) maps to its caption. Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and
   the video, which has no captions on its picture, takes es.srt. The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes
   captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series: la plataforma, el registro for the record (registrar as a verb), el almacén for the store, la alarma for a bell, encender and
   apagar for switching power on and off, la cuenta de administrador, el acceso for a sign-in, la sesión, la extensión del navegador for an add-on, la guardia
   for the on-call, el directorio, la tabla de estudiantes, la copia bloqueada, un lugar aparte. GitHub, Databricks and the films' names keep theirs. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Australia, 1953.":
"Australia, 1953.",
"David Warren is a chemist at the Aeronautical Research Laboratories, and he knows aircraft fuel tanks.":
"David Warren es químico en los Laboratorios de Investigación Aeronáutica, y conoce los tanques de combustible de los aviones.",
"He's asked to help find out why two Comets, the world's first jet airliners, have crashed.":
"Le piden ayudar a averiguar por qué se estrellaron dos Comet, los primeros aviones de pasajeros a reacción del mundo.",
"In 1954, two more break up over the sea, and no one on board survives.":
"En 1954, otros dos se rompen sobre el mar, y nadie a bordo sobrevive.",
"No one is left to say what the crew saw or heard.":
"No queda nadie que diga qué vio u oyó la tripulación.",
"So the experts can only guess.":
"Los expertos solo pueden suponer.",
"And while they guess, the planes fly again, full of passengers, and the next one may fail the same way.":
"Y mientras suponen, los aviones vuelven a volar, llenos de pasajeros, y el próximo puede fallar igual.",
"Something has to change.":
"Algo tiene que cambiar.",
"In April 1954, Warren writes a short note.":
"En abril de 1954, Warren escribe una nota breve.",
"A small box could record the voices in the cockpit, over and over, so the last hours are always kept.":
"Una caja pequeña podría grabar las voces de la cabina, una y otra vez, para guardar siempre las últimas horas.",
"It would sit in the tail, where a crash is least likely to reach it.":
"Iría en la cola, donde es menos probable que la alcance un accidente.",
"Pilots fear a spy in the cockpit, and his boss tells him to get on with fuel tanks.":
"Los pilotos temen un espía en la cabina, y su jefe le dice que siga con los tanques de combustible.",
"By 1958, his team's box keeps four hours of voices and the instruments' readings.":
"Para 1958, la caja de su equipo guarda cuatro horas de voces y las lecturas de los instrumentos.",
"After one more crash that no one can explain, Australia is the first country to require recorders on its airliners, from 1963.":
"Tras otro accidente que nadie puede explicar, Australia es el primer país en exigir grabadoras en sus aviones de pasajeros, desde 1963.",
"Now, when a plane is lost, investigators can hear its last minutes, find the cause, and fix it on every other plane.":
"Ahora, cuando se pierde un avión, los investigadores oyen sus últimos minutos, hallan la causa y la corrigen en todos los demás.",
"A data platform needs a recorder too.":
"Una plataforma de datos también necesita una grabadora.",
"Without one, when something goes wrong, the team can only guess what was touched, and the way in stays open.":
"Sin ella, cuando algo sale mal, el equipo solo puede suponer qué se tocó, y la entrada sigue abierta.",
"With one, they can see who did what, close the way in, and show what didn't happen.":
"Con ella, pueden ver quién hizo qué, cerrar la entrada y demostrar lo que no pasó.",
"At the university, Sam Okafor has locked the platform's sign-ins, doors, power and changes.":
"En la universidad, Sam Okafor ha cerrado los accesos, las puertas, el poder y los cambios de la plataforma.",
"Now the security review asks him to show they held, with three questions about the last 90 days.":
"Ahora la revisión de seguridad le pide demostrar que aguantaron, con tres preguntas sobre los últimos 90 días.",
"Who signed in, and from where?":
"¿Quién entró, y desde dónde?",
"Who switched on admin power, and what did they do with it?":
"¿Quién encendió el poder de administrador, y qué hizo con él?",
"What changed production, and who approved it?":
"¿Qué cambió producción, y quién lo aprobó?",
"The answers are in four records, and each keeps its own time.":
"Las respuestas están en cuatro registros, y cada uno guarda su propio tiempo.",
"The platform's audit table keeps a year.":
"La tabla de auditoría de la plataforma guarda un año.",
"GitHub's audit log keeps six months, but who pushed or copied code, only a week.":
"El registro de auditoría de GitHub guarda seis meses, pero quién subió o copió código, solo una semana.",
"The directory keeps its sign-ins, and each switch-on of power, for a month.":
"El directorio guarda sus accesos, y cada encendido de poder, un mes.",
"And the storage keeps a log only where someone has asked it to.":
"Y el almacenamiento guarda un registro solo donde alguien se lo pidió.",
"So for two of the questions, part of the answer is already gone.":
"Así que, para dos de las preguntas, parte de la respuesta ya no está.",
"So every record is now sent, as it's written, to one store apart, kept by the security team.":
"Así que ahora cada registro se envía, al escribirse, a un almacén aparte, que guarda el equipo de seguridad.",
"A locked copy is kept for a year: until then, no one can change or delete it, not even an admin.":
"Una copia bloqueada se guarda un año: hasta entonces, nadie puede cambiarla ni borrarla, ni siquiera un administrador.",
"Switching a record off is recorded too, and if one goes quiet, someone is told at once.":
"Apagar un registro también queda registrado, y si uno se queda en silencio, se avisa a alguien al instante.",
"Everyone is in it under their own name, agents too, as AI agents in data work shows.":
"Todos están en él con su nombre, también los agentes, como muestra Agentes de IA en el trabajo con datos.",
"The record is about people, so it's kept like personal data: read by few, for a reason, and every search is recorded.":
"El registro trata de personas, así que se guarda como datos personales: lo leen pocos, con un motivo, y cada búsqueda queda registrada.",
"Warren's pilots feared a spy in the cockpit.":
"Los pilotos de Warren temían un espía en la cabina.",
"A record of who did what is read to find out what happened, not to watch the people in it.":
"Un registro de quién hizo qué se lee para saber qué pasó, no para vigilar a quienes aparecen en él.",
"A few moments ring a bell at once, and someone always answers it.":
"Algunos momentos hacen sonar una alarma al instante, y alguien siempre responde.",
"The first is power.":
"El primero es el poder.",
"One morning, last night's load has gone wrong, and Jun has to put the learner table back as it was.":
"Una mañana, la carga de anoche salió mal, y Jun tiene que dejar la tabla de estudiantes como estaba.",
"He switches on his admin account's power to restore a table, for an hour, with a reason, and Sam approves.":
"Enciende el poder de su cuenta de administrador para restaurar una tabla, por una hora, con un motivo, y Sam lo aprueba.",
"The platform team gets the alert at once, and checks it matches a known task.":
"El equipo de la plataforma recibe la alerta al instante y ve que coincide con una tarea conocida.",
"The record keeps the rest: the switch-on, the restore, made by Jun's admin account, and the switch-off, twenty minutes later.":
"El registro guarda el resto: el encendido, la restauración con su cuenta de administrador y el apagado, veinte minutos después.",
"The other bells: a risky sign-in, an emergency account used, a record gone quiet.":
"Las otras alarmas: un acceso de riesgo, una cuenta de emergencia usada, un registro en silencio.",
"Few bells, so none is ignored.":
"Pocas alarmas, así que ninguna se ignora.",
"One evening, at twenty to ten, the bell rings for a risky sign-in.":
"Una noche, a las diez menos veinte, suena la alarma por un acceso de riesgo.",
"Jun's session is in use from another country, at an hour he never works.":
"La sesión de Jun se está usando desde otro país, a una hora en que él nunca trabaja.",
"Jun is at home, and his laptop has been shut since six.":
"Jun está en casa, y su laptop está cerrada desde las seis.",
"A browser add-on he'd used for a year had changed hands, and its last update copied his sign-ins.":
"Una extensión del navegador que usaba desde hacía un año había cambiado de dueño, y su última actualización copió sus accesos.",
"Whoever holds a copied session is Jun, until the session ends.":
"Quien tenga una sesión copiada es Jun, hasta que la sesión termine.",
"So the first step is to end it.":
"Así que el primer paso es terminarla.",
"The security team's on-call switches his account off, and ends all his sessions: in the directory, in GitHub, and on the platform.":
"La guardia del equipo de seguridad apaga su cuenta y termina todas sus sesiones: en el directorio, en GitHub y en la plataforma.",
"Twelve minutes after the bell, GitHub and the platform refuse it.":
"Doce minutos después de la alarma, GitHub y la plataforma la rechazan.",
"Then they read, in the one store, what the copy did.":
"Luego leen en el almacén qué hizo la copia.",
"In GitHub, it downloaded the platform's code as a file.":
"En GitHub, descargó el código de la plataforma como un archivo.",
"No push, no change to a rule, no approval.":
"Ningún push, ningún cambio de regla, ninguna aprobación.",
"On the platform, nothing: it has no door on the open internet.":
"En la plataforma, nada: no tiene ninguna puerta abierta a internet.",
"The code holds no secret and no learner's data.":
"El código no guarda ningún secreto ni datos de estudiantes.",
"That night, the add-on is taken off every browser; the next morning, Jun is back at work on a clean laptop.":
"Esa noche, la extensión se quita de todos los navegadores; a la mañana siguiente, Jun vuelve al trabajo con una laptop limpia.",
"Nothing was changed, so nothing has to be put back: the record is how they know.":
"No se cambió nada, así que no hay nada que restaurar: lo saben por el registro.",
"The next day, a review without blame asks what made it possible, not who.":
"Al día siguiente, una revisión sin culpas pregunta qué lo hizo posible, no quién.",
"Now browsers take only add-ons the university approves, and GitHub takes requests only from the university's network.":
"Ahora los navegadores aceptan solo extensiones que aprueba la universidad, y GitHub solo acepta peticiones desde su red.",
"A leaked secret gets the same steps: end it first, then read what it did.":
"Un secreto filtrado sigue los mismos pasos: primero terminarlo, luego leer qué hizo.",
"Every admin power here is switched on for a task, and approved by someone else.":
"Aquí, todo poder de administrador se enciende para una tarea, y lo aprueba otra persona.",
"But what if the sign-in service fails, or a wrong rule locks every admin out?":
"¿Y si falla el servicio de acceso, o una regla errónea deja fuera a todos los administradores?",
"For that, the directory has two emergency accounts.":
"Para eso, el directorio tiene dos cuentas de emergencia.",
"They belong to no one, and their power is always on.":
"No son de nadie, y su poder siempre está encendido.",
"So they sign in only with security keys, kept in two safes, in two buildings.":
"Por eso solo entran con llaves de seguridad, guardadas en dos cajas fuertes, en dos edificios.",
"No rule that could lock everyone out applies to them, and any sign-in rings every bell.":
"No se les aplica ninguna regla que pudiera dejar fuera a todos, y cualquier acceso hace sonar todas las alarmas.",
"Every 90 days, two people open a safe, sign in, check it works, and lock the key away.":
"Cada 90 días, dos personas abren una caja fuerte, entran, comprueban que funciona y vuelven a guardar la llave.",
"The bell rings then too, and everyone knows it's the test.":
"La alarma también suena entonces, y todos saben que es la prueba.",
"The last lock is on the data itself.":
"La última cerradura está en los datos mismos.",
"A table's own history can undo most mistakes, for seven days.":
"El historial de una tabla deshace casi cualquier error, durante siete días.",
"But what if a mistake is found too late, or someone deletes a table and its history?":
"¿Pero y si un error se descubre demasiado tarde, o alguien borra una tabla y su historial?",
"Every night after the load, a copy of production's data goes to a place apart, with admins of its own.":
"Cada noche, tras la carga, una copia de los datos de producción va a un lugar aparte, con sus propios administradores.",
"For 30 days, no one can change or delete it, not even an admin.":
"Durante 30 días, nadie puede cambiarla ni borrarla, ni siquiera un administrador.",
"Once a month, the team restores one beside the real table, and checks they match.":
"Una vez al mes, el equipo restaura una junto a la tabla real, y comprueba que coinciden.",
"As Walls, doors and keys says, a copy nobody has restored is only a hope.":
"Como dice Muros, puertas y llaves, una copia que nadie ha restaurado es solo una esperanza.",
"Three months on, the review asks its three questions again.":
"Tres meses después, la revisión vuelve a hacer sus tres preguntas.",
"Sam answers them in an afternoon, from one place.":
"Sam las responde en una tarde, desde un solo lugar.",
"Of every sign-in, one was wrong: a copied session, stopped in twelve minutes.":
"De todos los accesos, uno estuvo mal: una sesión copiada, detenida en doce minutos.",
"Admin power was switched on 23 times, each with a reason, an approval, and a record of what was done.":
"El poder de administrador se encendió 23 veces, cada una con un motivo, una aprobación y un registro de lo que se hizo.",
"Production changed 11 times, each change reviewed, and each release approved.":
"Producción cambió 11 veces, cada cambio revisado y cada versión aprobada.",
"And every night at two, the job signed in as itself.":
"Y cada noche a las dos, el proceso entró con su propio nombre.",
"Warren's box doesn't keep a plane in the air.":
"La caja de Warren no mantiene un avión en el aire.",
"It means no one has to guess what happened.":
"Hace que nadie tenga que suponer qué pasó.",
"The record does the same for the platform.":
"El registro hace lo mismo por la plataforma.",
"If you can't see it, you can't say it's protected.":
"Si no puedes verlo, no puedes decir que está protegido."
});
