/* A place on the map: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: Planificación, el agente de Planificación, el ayudante (as the series' name, De ayudante a colega), los encargos for the tickets, el acceso de Jun for his
   sign-in (as the series' page says them), permisos for rights, un pull request, una verificación for a check, el sandbox, una dueña and un dueño, la arquitecta de datos; and, as the map films say them,
   una capacidad, un proceso, un paso, un rol, separación de funciones. The roles keep a Spanish name (colaborador de Planificación), the agents too (el agente de carga de trabajo,
   el agente de revisión de gobernanza); the picture shows them in English. Una etapa for a stage, su puerta for its gate (the series' page: cinco etapas y sus puertas). 1970: las cuadrillas, las agencias, los camiones,
   el Sistema de Comando de Incidentes (its name in Spanish in the United States), FIRESCOPE. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Southern California, the autumn of 1970. For thirteen days, wildfires burned across the hills.":
"El sur de California, otoño de 1970. Durante trece días, los incendios forestales ardieron en las colinas.",
"Sixteen people died, and about seven hundred homes and other buildings were lost.":
"Murieron dieciséis personas, y se perdieron unas setecientas casas y otros edificios.",
"Some twenty thousand firefighters came to help, from about five hundred agencies: city, county, state and federal.":
"Unos veinte mil bomberos llegaron a ayudar, de unas quinientas agencias: municipales, de condado, estatales y federales.",
"Each agency organised its crews its own way, with its own words, on its own radio channels.":
"Cada agencia organizaba sus cuadrillas a su manera, con sus propias palabras y en sus propios canales de radio.",
"Near the fires, crews struggled to reach each other: too many voices, on too many channels.":
"Cerca del fuego, a las cuadrillas les costaba comunicarse: demasiadas voces, en demasiados canales.",
"And nobody had one up-to-date picture of all the fires.":
"Y nadie tenía una imagen actualizada de todos los incendios.",
"So it was hard, sometimes impossible, to send scarce engines and crews where they were needed most.":
"Así que era difícil, a veces imposible, enviar los pocos camiones y cuadrillas adonde más se necesitaban.",
"Every agency cooperated as well as it could. What was missing was one way of working they all shared.":
"Cada agencia cooperó lo mejor que pudo. Lo que faltaba era una forma de trabajar que todas compartieran.",
"Something had to change.":
"Algo tenía que cambiar.",
"In 1972, seven of those agencies began to build that way of working, together. Their programme was called FIRESCOPE.":
"En 1972, siete de esas agencias empezaron a construir juntas esa forma de trabajar. Su programa se llamó FIRESCOPE.",
"Its Incident Command System starts where help arrives: everyone who comes checks in.":
"Su Sistema de Comando de Incidentes empieza donde llega la ayuda: todo el que llega se registra.",
"Each crew is written on a card, and the card takes its place on one board, in one structure.":
"Cada cuadrilla se anota en una tarjeta, y la tarjeta ocupa su lugar en un solo tablero, en una sola estructura.",
"Each place has a role, and one person it answers to.":
"Cada lugar tiene un rol, y una persona ante quien responde.",
"Nobody leads more than about seven.":
"Nadie tiene a su cargo a más de unos siete.",
"And everyone uses the same plain words, with no codes.":
"Y todos usan las mismas palabras sencillas, sin códigos.",
"By 1981, the major fire agencies of Southern California used it widely, and more and more for emergencies other than fires.":
"Para 1981, las grandes agencias de bomberos del sur de California lo usaban mucho, y cada vez más en otras emergencias.",
"In 2004, it became part of the national standard in the United States, for emergencies of every kind.":
"En 2004, pasó a formar parte del estándar nacional de Estados Unidos, para emergencias de todo tipo.",
"Crews from anywhere could arrive, check in, and work as one team, each knowing their place and who they answered to.":
"Cuadrillas de cualquier lugar podían llegar, registrarse y trabajar como un solo equipo, sabiendo su lugar y ante quién respondían.",
"At the university, on Monday, 2 November 2026, a new kind of colleague joined Planning: the planning agent.":
"En la universidad, el lunes 2 de noviembre de 2026, un nuevo tipo de colega se unió a Planificación: el agente de Planificación.",
"It will work on its own. If it simply started, nobody could say what it may do, who answers for it, or who can stop it.":
"Trabajará por su cuenta. Si simplemente empezara, nadie podría decir qué puede hacer, quién responde por él ni quién puede detenerlo.",
"So, like a crew at a fire, it checks in first and takes its place on the map. Then anyone can see what it may do, and who answers for it.":
"Como una cuadrilla en un incendio, primero se registra y toma su lugar en el mapa. Así todos ven qué puede hacer y quién responde por él.",
"That Monday, Planning had two newcomers: Lucía Ortega, and the planning agent.":
"Ese lunes, Planificación tuvo dos recién llegados: Lucía Ortega y el agente de Planificación.",
"All year, Jun's helper had drafted Planning's tickets on his own sign-in. Now the planning agent takes them, under a name of its own.":
"Todo el año, el ayudante de Jun redactó los encargos de Planificación con el acceso de Jun. Ahora el agente los toma, con un nombre propio.",
"Both are welcomed the same way, line by line.":
"Los dos reciben la misma bienvenida, línea por línea.",
"Lucía gets her badge. The agent gets an identity of its own, set up by Sam: never a person's.":
"Lucía recibe su credencial de empleada. El agente recibe una identidad propia, creada por Sam: nunca la de una persona.",
"Lucía has her role in Planning. The agent has a role too: planning contributor.":
"Lucía tiene su rol en Planificación. El agente también tiene un rol: colaborador de Planificación.",
"Lucía has a manager she answers to. The agent has an owner who answers for it: Clara Jensen.":
"Lucía tiene un jefe ante quien responde. El agente tiene una dueña que responde por él: Clara Jensen.",
"Lucía's rights come from Planning's group. The agent's come from its role's group: never its own, and never an admin's.":
"Los permisos de Lucía vienen del grupo de Planificación. Los del agente, del grupo de su rol: nunca propios, ni de administrador.",
"An agent with an admin's rights, in the wrong hands, could do anything an admin can, only faster.":
"Un agente con permisos de administrador, en malas manos, podría hacer todo lo que hace un administrador, solo que más rápido.",
"Lucía signed the confidentiality agreement. An agent can't sign, so Clara signs it on its behalf, and answers for the data it touches.":
"Lucía firmó el acuerdo de confidencialidad. Un agente no puede firmar, así que Clara firma por él y responde por los datos que toca.",
"One thing differs. Lucía's helper works on her sign-in, with her rights, while she watches.":
"Algo es distinto. El ayudante de Lucía trabaja con el acceso de ella, con sus permisos, mientras ella mira.",
"The planning agent works alone, so it needs a place of its own.":
"El agente de Planificación trabaja solo, así que necesita un lugar propio.",
"A week before it started, Noor, the data architect, gave it a place on the university's map.":
"Una semana antes de que empezara, Noor, la arquitecta de datos, le dio un lugar en el mapa de la universidad.",
"She started from the work: the capability Planning's tickets serve, provide data products.":
"Empezó por el trabajo: la capacidad a la que sirven los encargos de Planificación, proveer productos de datos.",
"Each ticket goes through one process, change a data product: seven steps, from a ticket to production.":
"Cada encargo pasa por un proceso, cambiar un producto de datos: siete pasos, de un encargo a producción.",
"Each step is assigned to a role, whoever fills it: a person or an agent.":
"Cada paso se asigna a un rol, sin importar quién lo ocupe: una persona o un agente.",
"One new role, planning contributor, drafts the change, builds it in development, and opens a pull request.":
"Un rol nuevo, colaborador de Planificación, redacta el cambio, lo construye en desarrollo y abre un pull request.",
"People keep the rest. Jun reviews the code, Clara approves the change, and Noor releases it to production.":
"Las personas conservan el resto. Jun revisa el código, Clara aprueba el cambio y Noor lo libera a producción.",
"So whoever drafts a change never approves or releases it: separation of duties, on the map.":
"Así, quien redacta un cambio nunca lo aprueba ni lo libera: separación de funciones, en el mapa.",
"Then Noor assigned the planning agent to that role, with Clara as its owner.":
"Luego Noor asignó el agente de Planificación a ese rol, con Clara como su dueña.",
"Its role says what it may do: read the project and production, with names masked, and draft on its own branches.":
"Su rol dice qué puede hacer: leer el proyecto y producción, con los nombres enmascarados, y redactar en sus propias ramas.",
"It may also build in its own development schema, and open a pull request.":
"También puede construir en su propio esquema de desarrollo y abrir un pull request.",
"What it may not do: approve, merge, change production, change an approved test, change what a word means, or grant itself rights.":
"Lo que no puede hacer: aprobar, fusionar, cambiar producción o una prueba aprobada, cambiar qué significa una palabra ni darse permisos.",
"And whom it asks: Clara for what Planning needs, Mei for what a word means, Noor for the model, and Jun for the code.":
"Y a quién consulta: a Clara, lo que necesita Planificación; a Mei, qué significa una palabra; a Noor, el modelo; a Jun, el código.",
"When it isn't sure, it doesn't guess. It asks, and a person decides.":
"Cuando no está seguro, no adivina. Pregunta, y una persona decide.",
"Where each of those rights comes from is the next film's story.":
"De dónde sale cada uno de esos permisos es la historia de la próxima película.",
"The same day, Noor placed Anil Kurian's workload agent. It had its own identity since September, but no place on the map.":
"El mismo día, Noor ubicó el agente de carga de trabajo de Anil Kurian: con identidad propia desde septiembre, pero sin lugar en el mapa.",
"Its stage for each kind of task went on its assignment.":
"Su etapa para cada tipo de tarea quedó escrita en su asignación.",
"Now the map holds three agents, each with a role and an owner.":
"Ahora el mapa tiene tres agentes, cada uno con un rol y un dueño.",
"The third, Yusuf's governance review agent, was already there: it reviews pull requests, and never approves them.":
"El tercero, el agente de revisión de gobernanza de Yusuf, ya estaba: revisa pull requests y nunca los aprueba.",
"One thing came before it worked alone: its gate.":
"Antes de trabajar solo, tuvo que pasar por su puerta.",
"The week before, in a sandbox, where nothing it did could reach anyone, it redid Planning's last forty tickets.":
"La semana anterior, en un sandbox, donde nada de lo que hiciera podía llegar a nadie, rehízo los últimos cuarenta encargos de Planificación.",
"Clara and Jun had set the bar first: at least thirty-six done as a person had done them, and none wrong without saying so.":
"Clara y Jun habían fijado antes la meta: al menos treinta y seis hechos como los hizo una persona, y ninguno mal sin decirlo.",
"Thirty-seven matched. On three, it said it wasn't sure, and asked. None was confidently wrong.":
"Treinta y siete coincidieron. En tres, dijo que no estaba seguro, y preguntó. Ninguno estuvo mal sin que lo dijera.",
"That last number matters most: an agent that says when it isn't sure can be trusted with work of its own.":
"Ese último número es el que más importa: a un agente que dice cuándo no está seguro se le puede confiar trabajo propio.",
"Audit is on from its first run: everything it does is recorded under its own name.":
"La auditoría está activa desde su primera ejecución: todo lo que hace queda registrado con su propio nombre.",
"So Clara agreed stage four for Planning's tickets: it proposes, and people review.":
"Así que Clara aprobó la etapa cuatro para los encargos de Planificación: propone, y las personas revisan.",
"Noor wrote it on its assignment, on the map, with stage one for what a word means: it only suggests.":
"Noor la escribió en su asignación, en el mapa, con la etapa uno para qué significa una palabra: solo sugiere.",
"From then on, a check fails any agent on the map without an owner, a role, or a stage for each kind of task.":
"Desde entonces, una verificación rechaza a cualquier agente del mapa sin dueño, sin rol o sin una etapa para cada tipo de tarea.",
"Who may do what with an agent is written down too.":
"Quién puede hacer qué con un agente también está por escrito.",
"Only a person may own an agent, never a team. Clara answers for everything the planning agent does, and only she may sign for it.":
"Solo una persona, nunca un equipo, puede ser dueña de un agente. Clara responde por todo lo que hace, y solo ella puede firmar por él.",
"Only Sam's platform team may set an agent up: for its owner, and once it has a place on the map.":
"Solo el equipo de plataforma de Sam puede crear un agente: para su dueño, y una vez que tiene un lugar en el mapa.",
"Clara may stop it. So may Sam, at any hour, without asking first.":
"Clara puede detenerlo. Sam también, a cualquier hora, sin preguntar antes.",
"And anyone who sees it go wrong may ask them to, as anyone on a production line may pull the cord.":
"Y cualquiera que lo vea fallar puede pedírselo, como en una línea de producción cualquiera puede tirar del cordón.",
"In 1970, help couldn't become one team until there was one structure to join.":
"En 1970, la ayuda no podía ser un solo equipo hasta que hubo una estructura a la cual sumarse.",
"Since then, crews from anywhere check in, take their place, and know who they answer to.":
"Desde entonces, cuadrillas de cualquier lugar se registran, ocupan su lugar y saben ante quién responden.",
"The planning agent has done the same: a place in Planning's work, a role, an owner, and a stage for each kind of task.":
"El agente de Planificación hizo lo mismo: un lugar en el trabajo de Planificación, un rol, una dueña y una etapa para cada tipo de tarea.",
"So everyone knows what it may do, who answers for it, and who can stop it.":
"Así todos saben qué puede hacer, quién responde por él y quién puede detenerlo.",
"Before an agent works alone, it's architected like a colleague.":
"Antes de trabajar solo, un agente se integra a la arquitectura como un colega.",
"Next: rights that come from the work, and not from a person's.":
"Después: permisos que vienen del trabajo, no de una persona."
});
