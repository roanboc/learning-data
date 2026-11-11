/* Borrowed rights: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the films before it: el ayudante for a helper, el acceso for a person's sign-in (as the series' page says: "el ayudante de Jun, con su acceso"),
   permisos for rights, permisos prestados for borrowed rights, acotar for to narrow, una etapa for a stage, los encargos de Planificación and el agente de Planificación,
   el agente de carga docente for Anil's workload agent, los docentes, una solicitud de cambio is not said (the narration says "the fix": la corrección), una verificación
   for a check, producción, el registro for the log and for the record, una clave personal, un esquema, una rama, un sandbox, as the screen says, enmascarados for masked
   names, el espacio de desarrollo for the development workspace, fusionar for to merge, and un límite de seguridad for a security boundary. In Britain: una cubierta for a
   letter's cover, la franquicia for the frank, un miembro del Parlamento, el correo del penique, and el porte, what a letter pays to travel. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Britain, in the 1700s.":
"Gran Bretaña, en el siglo XVIII.",
"A letter is a folded sheet, sealed with wax, and the person who receives it pays.":
"Una carta es una hoja doblada, sellada con lacre, y la paga quien la recibe.",
"The further it travels, and the more sheets it holds, the more it costs.":
"Cuanto más lejos viaja, y cuantas más hojas lleva, más cuesta.",
"But a member of parliament may send his letters free.":
"Pero un miembro del Parlamento puede enviar sus cartas gratis.",
"He writes his name on the cover, and the post carries it for nothing: a frank.":
"Escribe su nombre en la cubierta, y el correo la lleva sin cobrar: una franquicia.",
"So whoever holds a cover he has signed can use his privilege.":
"Así que quien tenga una cubierta firmada por él puede usar su privilegio.",
"Members sign covers for family and friends.":
"Los miembros firman cubiertas para familiares y amigos.",
"Signed blank covers are given away, even sold, and signatures are copied.":
"Se regalan cubiertas firmadas en blanco, hasta se venden, y se copian firmas.",
"The post carries free letters no member ever sent, while everyone else pays dearly for theirs.":
"El correo lleva gratis cartas que ningún miembro envió, mientras los demás pagan caro por las suyas.",
"And nobody can tell who really sent a letter that carries a member's name.":
"Y nadie puede saber quién envió de verdad una carta que lleva el nombre de un miembro.",
"Rules try to narrow it.":
"Hay reglas que intentan acotarlo.",
"From 1764, the member must write the whole address in his own hand.":
"Desde 1764, el miembro debe escribir toda la dirección de su puño y letra.",
"From 1784, the town and the date as well, the day in words, and the letter posted that same day.":
"Desde 1784, también la ciudad y la fecha, el día en letras, y la carta enviada ese mismo día.",
"Still, the gap stays open: in the 1830s, about seven million letters a year travel free.":
"Aun así, el hueco sigue abierto: en la década de 1830, unos siete millones de cartas al año viajan gratis.",
"Tightening the rules hadn't worked. The free post itself had to go.":
"Endurecer las reglas no había funcionado. El correo gratuito tenía que desaparecer.",
"A schoolmaster, Rowland Hill, argues for a cheap post that the sender pays.":
"Un maestro de escuela, Rowland Hill, propone un correo barato que pague quien envía.",
"Parliament agrees.":
"El Parlamento acepta.",
"On the tenth of January 1840, the penny post begins: one penny a letter, anywhere in Britain, paid by its sender.":
"El 10 de enero de 1840 empieza el correo del penique: un penique por carta, a cualquier lugar del país, pagado por quien la envía.",
"And franking ends.":
"Y se acaba la franquicia.",
"In a year, letters more than double, from about 76 million to nearly 170 million.":
"En un año, las cartas se duplican con creces: de unos 76 millones a casi 170 millones.",
"A letter is cheap for everyone, and every letter pays its own way.":
"Una carta es barata para todos, y cada carta paga su propio porte.",
"Today, at the university, Jun Park's AI helper works on his sign-in, with everything Jun may do.":
"Hoy, en la universidad, el ayudante de IA de Jun Park trabaja con su acceso, con todo lo que Jun puede hacer.",
"Narrowed, those borrowed rights let it learn, safely, in a sandbox.":
"Acotados, esos permisos prestados le dejan aprender, sin riesgo, en un sandbox.",
"And once it works for the team, it needs a name of its own.":
"Y cuando trabaja para el equipo, necesita un nombre propio.",
"An AI helper in an editor or a chat starts on the sign-in of the person using it.":
"Un ayudante de IA en un editor o un chat empieza con el acceso de la persona que lo usa.",
"It's quick: nothing to set up, and it can do whatever that person can.":
"Es rápido: no hay nada que configurar, y puede hacer todo lo que esa persona puede.",
"Through 2026, Jun's helper drafted Planning's tickets for him: a new column, a filter, a new mart.":
"Durante 2026, el ayudante de Jun le redactó los encargos de Planificación: una columna nueva, un filtro, un mart nuevo.",
"The first three of the five stages all work on the person's sign-in.":
"Las tres primeras de las cinco etapas trabajan con el acceso de la persona.",
"At the first, it suggests: it drafts, runs nothing, and Jun accepts or rejects every line.":
"En la primera, sugiere: redacta, no ejecuta nada, y Jun acepta o rechaza cada línea.",
"At the second, it acts for him, step by step: it runs a query or a command, and Jun allows each one.":
"En la segunda, actúa por él, paso a paso: ejecuta una consulta o un comando, y Jun permite cada uno.",
"At the third, it acts for him within limits: it works alone, and Jun checks the result.":
"En la tercera, actúa por él dentro de límites: trabaja solo, y Jun verifica el resultado.",
"Each stage changes how much it may do, and what Jun does. The sign-in stays his.":
"Cada etapa cambia cuánto puede hacer, y qué hace Jun. El acceso sigue siendo suyo.",
"Jun's rights are wide: he builds the project, and he reviews and approves its code.":
"Los permisos de Jun son amplios: construye el proyecto, y revisa y aprueba su código.",
"On his sign-in, his helper can do all of that, at every stage.":
"Con su acceso, su ayudante puede hacer todo eso, en cada etapa.",
"Friday, the sixteenth of October.":
"Viernes, 16 de octubre.",
"The helper is drafting Planning's ticket for Monday's board: a new mart of teaching staff by school.":
"El ayudante redacta el encargo de Planificación para la junta del lunes: un mart nuevo de docentes por escuela.",
"Its change waits on a fix to the count of who teaches in each school.":
"Su cambio espera una corrección al conteo de quién enseña en cada escuela.",
"Anil Kurian's workload agent, which has a name of its own, proposed that fix.":
"El agente de carga docente de Anil Kurian, que tiene un nombre propio, propuso esa corrección.",
"It's in review for Jun, and its checks have passed.":
"Está en revisión para Jun, y sus verificaciones pasaron.",
"The helper's next step: approve it, as Jun Park.":
"El siguiente paso del ayudante: aprobarla, como Jun Park.",
"It's the thirty-eighth step Jun has been asked to allow that day.":
"Es el paso 38 que le piden a Jun permitir ese día.",
"He reads it, and says no.":
"Lo lee, y dice que no.",
"On Monday he reviews the fix himself, and Noor approves it for production.":
"El lunes revisa él mismo la corrección, y Noor la aprueba para producción.",
"Nobody did anything wrong: the helper was finishing its ticket, with the rights it had.":
"Nadie hizo nada mal: el ayudante estaba terminando su encargo, con los permisos que tenía.",
"Had Jun said yes, the record would read: approved by Jun Park.":
"Si Jun hubiera dicho que sí, el registro diría: aprobado por Jun Park.",
"On a person's sign-in, every step reads as that person's.":
"Con el acceso de una persona, cada paso queda como de esa persona.",
"Jun's log says Jun, for what he did and for what his helper did.":
"El registro de Jun dice Jun, por lo que hizo él y por lo que hizo su ayudante.",
"Like a franked cover, it can't say who really did each step.":
"Como una cubierta con franquicia, no dice quién dio de verdad cada paso.",
"The workload agent once ran on Anil's personal key, and the log couldn't tell his reads from his agent's.":
"El agente de carga docente usó la clave personal de Anil, y el registro no distinguía sus lecturas de las del agente.",
"Had the helper approved, an agent's change would have been approved by an agent, with a person's name on it.":
"Si el ayudante hubiera aprobado, el cambio de un agente lo habría aprobado un agente, con el nombre de una persona.",
"And the helper can't be narrowed or stopped on its own: to every tool, it is Jun.":
"Y al ayudante no se le puede acotar ni detener por separado: para cada herramienta, es Jun.",
"In 1988, a computer scientist, Norm Hardy, called this a confused deputy:":
"En 1988, un informático, Norm Hardy, llamó a esto un delegado confundido:",
"a program that acts for someone, with their rights, for a purpose that isn't theirs.":
"un programa que actúa por alguien, con sus permisos, para un fin que no es suyo.",
"And in the wrong hands, it's more dangerous still.":
"Y en malas manos, es todavía más peligroso.",
"Words hidden in a ticket it reads, or a stolen sign-in, could steer it to do anything Jun can, faster than any person.":
"Palabras ocultas en un encargo que lee, o un acceso robado, podrían llevarlo a hacer lo que Jun puede, más rápido que nadie.",
"Security experts call it excessive agency: more tools, more rights, or more freedom than a job needs.":
"Los expertos en seguridad lo llaman agencia excesiva: más herramientas, permisos o libertad de los que un trabajo necesita.",
"In 1975, two computer scientists, Jerome Saltzer and Michael Schroeder, wrote down the answer:":
"En 1975, dos informáticos, Jerome Saltzer y Michael Schroeder, escribieron la respuesta:",
"every program, and every person, should work with the fewest rights the job needs.":
"cada programa, y cada persona, debe trabajar con los menos permisos que su trabajo necesite.",
"From Monday, the nineteenth of October, Jun and Sam narrow what the helper borrows.":
"Desde el lunes 19 de octubre, Jun y Sam acotan lo que el ayudante toma prestado.",
"It works in a development workspace, with tools that only read.":
"Trabaja en un espacio de desarrollo, con herramientas que solo leen.",
"None of them writes outside its sandbox, approves, merges, or grants a right.":
"Ninguna escribe fuera de su sandbox, aprueba, fusiona ni da un permiso.",
"Its drafts go only into a sandbox of its own: a schema of Jun's in development, and a branch.":
"Sus borradores van solo a un sandbox propio: un esquema de Jun en desarrollo, y una rama.",
"It sees samples of at most twenty rows, with names masked.":
"Ve muestras de 20 filas como máximo, con los nombres enmascarados.",
"And what only Jun should do stays his: approve, merge, change production, change an approved test, grant a right.":
"Y lo que solo Jun debe hacer sigue siendo suyo: aprobar, fusionar, cambiar producción, cambiar una prueba aprobada, dar un permiso.",
"The project's page for agents now says so, for every helper on a person's sign-in.":
"La página del proyecto para agentes ahora lo dice, para todo ayudante con el acceso de una persona.",
"At the second stage, Jun still allows each step.":
"En la segunda etapa, Jun sigue permitiendo cada paso.",
"A helper's own setting can make it ask before each step, or go on without asking.":
"Un ajuste del propio ayudante puede hacer que pregunte antes de cada paso, o que siga sin preguntar.",
"One maker calls such a setting a productivity feature, not a security boundary.":
"Un fabricante llama a ese ajuste una función de productividad, no un límite de seguridad.",
"So the boundary is in its tools: each step is now a read, or a draft in its sandbox.":
"Así que el límite está en sus herramientas: cada paso ahora es una lectura, o un borrador en su sandbox.",
"At the third, it works alone, within a plan whose checks are set before it starts.":
"En la tercera, trabaja solo, dentro de un plan cuyas verificaciones se fijan antes de empezar.",
"Its allowed and blocked actions are written on the plan, and its evidence comes with its result.":
"Sus acciones permitidas y bloqueadas están escritas en el plan, y su evidencia llega con su resultado.",
"Jun checks the result against the plan's checks, and Noor approves whatever reaches production.":
"Jun verifica el resultado con las verificaciones del plan, y Noor aprueba todo lo que llega a producción.",
"At every stage, Jun owns his helper's work, and answers for it.":
"En cada etapa, Jun es dueño del trabajo de su ayudante, y responde por él.",
"And an agent never approves: not its own change, and not another agent's.":
"Y un agente nunca aprueba: ni su propio cambio, ni el de otro agente.",
"On Monday, the second of November, Lucía Ortega joins Planning.":
"El lunes 2 de noviembre, Lucía Ortega entra a Planificación.",
"Her helper starts where everyone starts: on her sign-in, with her rights, which are few.":
"Su ayudante empieza donde todos empiezan: con su acceso, con sus permisos, que son pocos.",
"Names masked, nothing written to production, and narrowed the same way from her first day.":
"Nombres enmascarados, nada escrito en producción, y acotado igual desde su primer día.",
"In its sandbox, it helps her learn the project, and every draft waits for her.":
"En su sandbox, la ayuda a aprender el proyecto, y cada borrador la espera.",
"Borrowed rights are for learning, in a sandbox.":
"Los permisos prestados son para aprender, en un sandbox.",
"The rules of 1764 and 1784 narrowed the frank, but a member's name still couldn't say who really sent a letter.":
"Las reglas de 1764 y 1784 acotaron la franquicia, pero el nombre de un miembro aún no decía quién envió de verdad una carta.",
"That took every letter paying its own way.":
"Eso lo logró que cada carta pagara su propio porte.",
"A helper that works for the team, not beside one person, needs the same: a name of its own.":
"Un ayudante que trabaja para el equipo, no junto a una persona, necesita lo mismo: un nombre propio.",
"That same Monday, Planning's tickets passed to the planning agent, a contributor with its own name, owned by Clara Jensen.":
"Ese mismo lunes, los encargos de Planificación pasaron al agente de Planificación, un colaborador con nombre propio, de Clara Jensen.",
"Before it took a single ticket, it was given a place on the university's map, like every colleague.":
"Antes de tomar un solo encargo, recibió un lugar en el mapa de la universidad, como todo colega.",
"How that place is made is where this series goes next.":
"Cómo se hace ese lugar es adonde va ahora esta serie."
});
