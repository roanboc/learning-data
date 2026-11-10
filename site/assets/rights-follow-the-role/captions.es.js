/* Rights follow the role: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and A place on the map: Planificación, el agente de Planificación, el ayudante, los encargos for the tickets, el acceso de Jun for his sign-in, permisos for
   rights, un pull request, una verificación for a check, una dueña and un dueño, un paso, un rol, colaborador de Planificación, separación de funciones, liberar a producción, los nombres
   enmascarados, su esquema de desarrollo, su propia rama; and, for this film, cambiar un producto de datos for the service, el contexto gobernado, la memoria del equipo, una deriva for
   drift. Each role is said as who fills it where a person is named (de quien lo solicita, de quien aprueba la liberación). The ward: una sala de hospital, las existencias for the
   stock, la orden del médico and its copia, el farmacéutico, la enfermera, un cajón for each patient, dosis únicas, etiquetadas. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"An American hospital ward, in the late 1950s.":
"Una sala de hospital estadounidense, a fines de los cincuenta.",
"Its medicines were kept on the ward, as stock: big bottles on a shelf, for every patient.":
"Sus medicamentos se guardaban en la sala, como existencias: frascos grandes en un estante, para todos los pacientes.",
"Nurses poured each patient's doses from the shared bottles, by hand.":
"Las enfermeras servían a mano las dosis de cada paciente, de los frascos compartidos.",
"Often the pharmacist never saw the doctor's order, only a copy, written out by a nurse or a ward clerk.":
"A menudo el farmacéutico nunca veía la orden del médico, solo una copia, escrita por una enfermera o un empleado de la sala.",
"So a slip in copying it went unnoticed, and a patient got the wrong drug, the wrong amount, or an injection meant to be swallowed.":
"Así, un error al copiarla pasaba inadvertido: un paciente recibía el fármaco o la dosis equivocados, o inyectado lo que debía tragarse.",
"Every medicine on the shelf was within reach of every hand, for every patient.":
"Cada medicamento del estante estaba al alcance de todas las manos, para todos los pacientes.",
"Something had to change.":
"Algo tenía que cambiar.",
"In the early 1960s, pharmacists at the University of Arkansas Medical Center, in Little Rock, tried another way.":
"A principios de los años sesenta, farmacéuticos del Centro Médico de la Universidad de Arkansas, en Little Rock, probaron otra forma.",
"A pharmacist read each doctor's order, and the pharmacy sent single doses, labelled and ready to give, each as it fell due.":
"Un farmacéutico leía cada orden del médico, y la farmacia enviaba dosis únicas, etiquetadas y listas, cada una a su hora.",
"The doctor ordered, the pharmacist checked and filled, and the nurse gave.":
"El médico ordenaba, el farmacéutico revisaba y llenaba, y la enfermera daba.",
"In their study, mistakes other than timing fell from almost one dose in five to one in thirty.":
"En su estudio, los errores, sin contar los de horario, bajaron de casi una dosis de cada cinco a una de cada treinta.",
"As other hospitals took it up, each patient got a drawer, filled from the order, with no more than one day's doses.":
"Cuando otros hospitales lo adoptaron, cada paciente tuvo un cajón, llenado desde la orden, con no más de un día de dosis.",
"By 1990, nine American hospitals in ten worked this way.":
"Para 1990, nueve de cada diez hospitales de EE. UU. trabajaban así.",
"At the university, in October, Planning's new agent raised the same question: what should it be able to reach?":
"En la universidad, en octubre, el nuevo agente de Planificación planteó la misma pregunta: ¿a qué debería poder llegar?",
"Give it a person's rights, and it reaches the whole shelf: everything that person can do, approving and changing production included.":
"Dale los permisos de una persona y llega a todo el estante: todo lo que esa persona puede hacer, incluso aprobar y cambiar producción.",
"Give it the rights of its work, and it reaches only what each of its steps needs: a drawer, filled from the order.":
"Dale los permisos de su trabajo y llega solo a lo que necesita cada uno de sus pasos: un cajón, llenado desde la orden.",
"Then a slip can't reach any further than its work.":
"Así, un error no puede llegar más allá de su trabajo.",
"On Thursday, the 22nd of October, Clara Jensen asked for the simple way.":
"El jueves 22 de octubre, Clara Jensen pidió la forma sencilla.",
"“Give it what Jun's helper had. It worked.”":
"“Dale lo que tenía el ayudante de Jun. Funcionó.”",
"All year, Jun's helper had drafted Planning's tickets on Jun's own sign-in, with every right he has.":
"Todo el año, el ayudante de Jun redactó los encargos de Planificación con el acceso de Jun, con todos sus permisos.",
"That's 46 rights, gathered over the years.":
"Son 46 permisos, reunidos a lo largo de los años.",
"Some are for his work today: he builds the project, and reviews and approves its code.":
"Algunos son para su trabajo de hoy: construye el proyecto, y revisa y aprueba su código.",
"Some only a person should use: to approve, to merge, to change production.":
"Algunos solo debería usarlos una persona: aprobar, fusionar, cambiar producción.",
"And some are left from old work, like the research system's projects, for a report in 2024.":
"Y otros quedan de trabajos viejos, como los proyectos del sistema de investigación, para un informe de 2024.",
"Copying them would fail twice.":
"Copiarlos fallaría dos veces.",
"They're too wide: the agent would get what only people may do, and tables no ticket needs.":
"Son demasiado amplios: el agente tendría lo que solo pueden hacer las personas, y tablas que ningún encargo necesita.",
"And they grew from years of a person's work: the agent has no years, so none of them was made for it.":
"Y crecieron con años de trabajo de una persona: el agente no tiene años, así que ninguno se hizo para él.",
"So Noor and Sam went the other way: from the work to the rights.":
"Así que Noor y Sam fueron al revés: del trabajo a los permisos.",
"On Monday the 26th, the planning agent took its place on the map, in the role of planning contributor.":
"El lunes 26, el agente de Planificación tomó su lugar en el mapa, en el rol de colaborador de Planificación.",
"Its work is one service, change a data product: seven steps, from a ticket to production.":
"Su trabajo es un servicio, cambiar un producto de datos: siete pasos, de un encargo a producción.",
"The planning contributor does three of them: draft the change, build it in development, and open a pull request.":
"El colaborador de Planificación hace tres: redactar el cambio, construirlo en desarrollo y abrir un pull request.",
"Each step says what it reads, what it writes, and which tools it calls.":
"Cada paso dice qué lee, qué escribe y qué herramientas llama.",
"To draft the change, it reads the ticket and what the change touches, and writes on its own branch.":
"Para redactar el cambio, lee el encargo y lo que el cambio toca, y escribe en su propia rama.",
"To build it, it reads production, names masked, and writes its tests' results in its own development schema.":
"Para construirlo, lee producción con los nombres enmascarados y escribe los resultados de sus pruebas en su esquema de desarrollo.",
"To open the pull request, it reads its change and its results, and writes one pull request.":
"Para abrir el pull request, lee su cambio y sus resultados, y escribe un pull request.",
"Its rights are exactly those, and every right names the step that needs it.":
"Sus permisos son exactamente esos, y cada permiso nombra el paso que lo necesita.",
"Like the drawer: filled from the order, not from the shelf.":
"Como el cajón: llenado desde la orden, no desde el estante.",
"The list is short, and nobody wrote it by hand: the map makes it from the steps.":
"La lista es corta, y nadie la escribió a mano: el mapa la hace a partir de los pasos.",
"That Monday, Sam set up its grants from that list, and nothing more.":
"Ese lunes, Sam le dio sus permisos a partir de esa lista, y nada más.",
"What a role reads is part of its rights, and the order matters.":
"Lo que lee un rol es parte de sus permisos, y el orden importa.",
"First, the governed context: its place on the map, the glossary, the business and data rules, and the data's own descriptions.":
"Primero, el contexto gobernado: su lugar en el mapa, el glosario, las reglas de negocio y de datos, y las descripciones de los datos.",
"Each has an owner, and changes only through review.":
"Cada uno tiene un dueño y solo cambia con una revisión.",
"Second, the team's memory: what agents learned in earlier sessions, kept by the platform.":
"Segundo, la memoria del equipo: lo que los agentes aprendieron en sesiones anteriores, guardado por la plataforma.",
"Memory helps, but it can be wrong, and nobody checks every line of it.":
"La memoria ayuda, pero puede estar equivocada, y nadie revisa cada una de sus líneas.",
"So when memory and a definition disagree, the definition wins.":
"Así que cuando la memoria y una definición no coinciden, gana la definición.",
"And the agent says so in its report, so the definition's owner sees it.":
"Y el agente lo dice en su informe, para que lo vea el dueño de la definición.",
"Like the pharmacist with the doctor's own order: the original first, a copy only second.":
"Como el farmacéutico con la orden del propio médico: primero el original, una copia solo después.",
"What's left out is written down too, with the reason.":
"Lo que queda fuera también se escribe, con su motivo.",
"The other four steps belong to other roles.":
"Los otros cuatro pasos son de otros roles.",
"Raising a ticket is the requester's: Clara's.":
"Abrir un encargo es de quien lo solicita: de Clara.",
"Reviewing the code is the analytics engineer's: Jun's.":
"Revisar el código es del ingeniero de analítica: de Jun.",
"Approving the change is the product owner's: Clara's again.":
"Aprobar el cambio es de la dueña del producto: otra vez de Clara.",
"Releasing to production is the release approver's: Noor's.":
"Liberar a producción es de quien aprueba la liberación: de Noor.",
"And what a word means is decided by its owner, such as Mei for the students' words, before it goes into the glossary.":
"Y lo que significa una palabra lo decide su dueño, como Mei para las palabras de los estudiantes, antes de que entre al glosario.",
"So it never approves, never releases, never changes what a word means, and never writes to production.":
"Así que nunca aprueba, nunca libera, nunca cambia lo que significa una palabra y nunca escribe en producción.",
"Nobody had to forbid each one: separation of duties falls out of the steps.":
"Nadie tuvo que prohibir cada uno: la separación de funciones sale de los pasos.",
"As on the ward: one ordered, one filled, and one gave.":
"Como en la sala: uno ordenaba, otro llenaba y otro daba.",
"And a check fails the map if a step only people do is given to a role an agent fills.":
"Y una verificación rechaza el mapa si un paso que solo hacen personas se da a un rol que ocupa un agente.",
"Work changes, and the rights follow it, never the other way round.":
"El trabajo cambia, y los permisos lo siguen, nunca al revés.",
"Say Planning wants the agent to answer its questions too, not only draft its changes.":
"Digamos que Planificación quiere que el agente también responda sus preguntas, no solo redacte sus cambios.",
"That's new work, so first it's a new step on the map, saying what it reads, writes and calls.":
"Es trabajo nuevo, así que primero es un paso nuevo en el mapa, que dice qué lee, qué escribe y qué llama.",
"Noor adds it to the role once Clara and the owners of what it reads agree.":
"Noor lo agrega al rol cuando Clara y los dueños de lo que lee están de acuerdo.",
"Then its rights follow: new lines, each with the new step.":
"Luego sus permisos lo siguen: líneas nuevas, cada una con el paso nuevo.",
"And the tools follow the rights, never a grant by hand.":
"Y las herramientas siguen a los permisos, nunca un permiso dado a mano.",
"Until then, if a ticket needs more than its steps give, the agent doesn't borrow a way in: it stops, and asks.":
"Hasta entonces, si un encargo necesita más de lo que dan sus pasos, el agente no toma prestado un acceso: se detiene y pregunta.",
"When a step goes, its rights go with it.":
"Cuando un paso se va, sus permisos se van con él.",
"A right given by hand is drift, and the next film shows the check that finds it.":
"Un permiso dado a mano es una deriva, y la próxima película muestra la verificación que la encuentra.",
"On the ward, each patient's drawer held one day's doses, filled from one order.":
"En la sala, el cajón de cada paciente tenía las dosis de un día, llenado desde una orden.",
"Here, the planning agent holds what its three steps need, and nothing more.":
"Aquí, el agente de Planificación tiene lo que necesitan sus tres pasos, y nada más.",
"Every right it holds has a reason anyone can read, and none of them reaches production.":
"Cada permiso suyo tiene un motivo que cualquiera puede leer, y ninguno llega a producción.",
"And Jun's rights stay his own.":
"Y los permisos de Jun siguen siendo suyos.",
"An agent's rights come from its work, not from a person's.":
"Los permisos de un agente vienen de su trabajo, no del de una persona."});
