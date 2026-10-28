/* Who decides: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series: dueño, responsable de datos and custodio for the three roles, so they never share a word; gobernanza, because the film also speaks of
   the government; título for an award; Planificación, informe, carpeta, consejo, oficina de registro; área for an area of data. Its papers: hoja de aprobación
   (the sign-off sheet), solicitud de cambio, hoja de ruta (the routing slip), bitácora (Mei's log book) and libro de decisiones. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Japan, the 1960s. A car maker's engine line moves on, past a row of workers.":
"Japón, años sesenta. La línea de motores de una automotriz avanza ante una fila de obreros.",
"Any worker who finds a problem pulls a cord, or presses a button, within reach.":
"Cualquier obrero que halla un problema tira de una cuerda, o aprieta un botón, a su alcance.",
"A lamp lights on the andon, the board above the line, and the supervisor comes at once, to help.":
"Se enciende una lámpara en el andon, el tablero sobre la línea, y el supervisor llega enseguida, a ayudar.",
"If it can't be fixed before the job is done, the line stops, and the team fixes it together.":
"Si no se puede arreglar antes de terminar la tarea, la línea se detiene, y el equipo lo arregla entre todos.",
"Every worker could stop the line, and they did.":
"Todos los obreros podían detener la línea, y lo hacían.",
"It was within reach, and it brought someone who could decide, at once.":
"Estaba a su alcance, y traía enseguida a alguien que podía decidir.",
"A right to decide about data needs the same.":
"Un derecho a decidir sobre los datos necesita lo mismo.",
"Today, Yusuf opens the binder called Who decides.":
"Hoy, Yusuf abre la carpeta llamada Quién decide.",
"Its policy says every area of data, like students or courses, has an owner and a steward.":
"Su política dice que cada área de datos, como estudiantes o cursos, tiene un dueño y un responsable de datos.",
"Its register lists eight areas. Three owners, and half the stewards, are still to be confirmed.":
"Su registro enumera ocho áreas. Tres dueños, y la mitad de los responsables, siguen por confirmar.",
"So decisions are made in email, or not at all.":
"Así que las decisiones se toman por correo, o no se toman.",
"How award maps to the government's definition has gone round a thread of twenty-three replies. Nobody has decided.":
"Cómo se mapea título a la definición del gobierno ha dado vueltas en un hilo de veintitrés respuestas. Nadie ha decidido.",
"Then he asks the data team who they ask, when a meaning isn't clear.":
"Luego pregunta al equipo de datos a quién consultan si un significado no está claro.",
"Noor, the data architect, shows him the list on their board: who we ask, area by area. Every area has a name.":
"Noor, la arquitecta de datos, le muestra la lista de su tablero: a quién preguntamos, área por área. Cada área tiene un nombre.",
"For award, they ask Mei Tanaka, in the registrar's office.":
"Por título, le preguntan a Mei Tanaka, en la oficina de registro.",
"They wrote it down as they built, because they needed someone to ask.":
"Lo anotaron mientras construían, porque necesitaban a alguien a quien preguntar.",
"Yusuf takes each name to its office to confirm it, and asks for the names still missing.":
"Yusuf lleva cada nombre a su oficina para confirmarlo, y pide los nombres que aún faltan.",
"On the way, he sorts out three roles, whatever a policy calls them.":
"En el camino, aclara tres roles, como sea que los llame una política.",
"The owner answers for what the data means. Mei decides what an award is.":
"El dueño responde por lo que significan los datos. Mei decide qué es un título.",
"The steward keeps it right, day to day. Mei also decides whether two records are the same learner, and writes down why.":
"El responsable de datos los cuida día a día. Mei también decide si dos registros son el mismo estudiante, y anota por qué.",
"One person can hold both roles.":
"Una persona puede tener ambos roles.",
"The custodian runs the platform it lives on. Sam's team can change any table, but doesn't decide what an award means.":
"El custodio opera la plataforma donde están los datos. El equipo de Sam puede cambiar cualquier tabla, pero no decide qué es un título.",
"Each area decides what its own words mean.":
"Cada área decide qué significan sus propias palabras.",
"Governance sets only the few rules they all share, such as one glossary, and one way to classify data.":
"La gobernanza fija solo las pocas reglas que todas comparten, como un solo glosario y una sola forma de clasificar los datos.",
"When two areas disagree, or someone needs an exception, the council decides, by its next meeting.":
"Cuando dos áreas no coinciden, o alguien necesita una excepción, el consejo decide en su próxima reunión.",
"If it can't agree, the deputy vice-chancellor decides.":
"Si no se pone de acuerdo, decide el vicerrector.",
"Everything else, the owner decides, where the work is.":
"Todo lo demás lo decide el dueño, donde está el trabajo.",
"Then Yusuf and Noor make the owner required.":
"Luego Yusuf y Noor vuelven obligatorio nombrar un dueño.",
"Anything new that other teams will read has a sign-off sheet. One line on it is never left blank: who answers for what it means.":
"Todo lo nuevo que leerán otros equipos lleva una hoja de aprobación. Una línea nunca queda vacía: quién responde por lo que significa.",
"Jun's new report for Planning comes back with that line empty, and a note saying what to add.":
"El nuevo informe de Jun para Planificación vuelve con esa línea vacía, y una nota que dice qué agregar.",
"He asks Planning. Clara Jensen will answer for it, and signs.":
"Le pregunta a Planificación. Clara Jensen responderá por él, y firma.",
"The council's oldest action, name the data owners, is closed.":
"La acción más antigua del consejo, nombrar a los dueños de datos, se cierra.",
"Next, every change request gets a routing slip, filled in from the register.":
"Después, cada solicitud de cambio recibe una hoja de ruta, llenada a partir del registro.",
"Yusuf keeps the register: change a name there, and every slip follows.":
"Yusuf lleva el registro: si cambia un nombre ahí, todas las hojas de ruta lo siguen.",
"Jun's next change request maps award to the government's definition.":
"La siguiente solicitud de cambio de Jun mapea título a la definición del gobierno.",
"Its slip sends it to Mei, by name, then to Noor and Yusuf. Nobody had to remember to.":
"Su hoja de ruta la envía a Mei, por nombre, y luego a Noor y a Yusuf. Nadie tuvo que acordarse.",
"Like the cord on the line: the work calls the person who decides, at the moment it matters.":
"Como la cuerda en la línea: el trabajo llama a quien decide, en el momento en que importa.",
"When Mei decides, her decision is written down where the work is: what, who, when and why.":
"Cuando Mei decide, su decisión queda anotada donde está el trabajo: qué, quién, cuándo y por qué.",
"She already keeps a log book of which records are the same learner. The mapping will go in the course area's decision book.":
"Ya lleva una bitácora de qué registros son el mismo estudiante. El mapeo irá al libro de decisiones del área de cursos.",
"Each area keeps its own, so the next person can find why.":
"Cada área lleva el suyo, para que la próxima persona encuentre el porqué.",
"Not in an email thread nobody can find.":
"No en un hilo de correo que nadie encuentra.",
"Mei didn't ask to be an owner. She was named because she always answered.":
"Mei no pidió ser dueña. La nombraron porque siempre respondía.",
"So Yusuf asks her manager for the time it takes: two hours a week.":
"Así que Yusuf le pide a su jefa el tiempo que hace falta: dos horas a la semana.",
"He keeps her scope small and clear: award, not every word her office uses.":
"Mantiene su alcance pequeño y claro: título, no cada palabra que usa su oficina.",
"And she has someone to ask: Yusuf, or the council, when owners disagree.":
"Y tiene a quién preguntar: a Yusuf, o al consejo, cuando los dueños no coinciden.",
"A role without time is a name in a spreadsheet.":
"Un rol sin tiempo es un nombre en una hoja de cálculo.",
"On the line, the cord brought someone who could decide. Here, every change asks its owner.":
"En la línea, la cuerda traía a alguien que podía decidir. Aquí, cada cambio le pregunta a su dueño.",
"A decision right is real when the work asks for it.":
"Un derecho a decidir es real cuando el trabajo lo pide.",
"Then Mei opens Jun's change request, and asks a question nobody expected.":
"Entonces Mei abre la solicitud de cambio de Jun, y hace una pregunta que nadie esperaba.",
"Which award does she own? She has found it defined in five places, and they don't agree.":
"¿De qué título es dueña? Lo encontró definido en cinco lugares, y no coinciden."
});
