/* Five stages, not a switch: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the films before it: una etapa for a stage, una puerta for a gate, un interruptor for a switch; el agente de carga docente for Anil's
   workload agent, los directores de escuela, la Facultad de Salud, Recursos Humanos, los docentes, temporales for casual staff and este periodo for this term (as in
   Por qué Unity Catalog y Unity Gateway los gobiernan); el dueño, un rol, un mandato, en pruebas for in test, producción, la compilación for the build, la solicitud de
   cambio for a pull request, una verificación for a check, el esquema for a schema, un sandbox, as the screen says, permisos for an agent's rights, and the person's
   part in Feng, McDonald and Zhang's levels as in Por qué los gobernamos; los encargos de Planificación and el agente de Planificación, as the series' page says.
   In New Zealand: la licencia de conducir, aprendiz, la licencia restringida and la licencia completa, manejar and el auto. Tú, as the stages speak to the viewer. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"New Zealand, in the 1980s.":
"Nueva Zelanda, en los años ochenta.",
"At fifteen, a young person could pass the driving tests and get a licence.":
"A los quince años, un joven podía aprobar los exámenes de manejo y obtener su licencia.",
"From that day, they could drive alone, at any hour, with a car full of friends.":
"Desde ese día, podía manejar solo, a cualquier hora, con el auto lleno de amigos.",
"New drivers that young crashed far more often than older ones, most of all at night, and with friends in the car.":
"Los conductores nuevos tan jóvenes chocaban mucho más que los mayores, sobre todo de noche, y con amigos en el auto.",
"Many were badly hurt, and some were killed.":
"Muchos quedaban gravemente heridos, y algunos morían.",
"The licence was a switch: off one day, fully on the next, and experience came only after it.":
"La licencia era un interruptor: apagado un día, del todo encendido al siguiente, y la experiencia llegaba solo después.",
"Something had to change.":
"Algo tenía que cambiar.",
"On the first of August, 1987, the country made the licence come in three stages.":
"El primero de agosto de 1987, el país hizo que la licencia llegara en tres etapas.",
"First, six months as a learner, driving only with a fully licensed driver beside you.":
"Primero, seis meses como aprendiz, manejando únicamente con un conductor con licencia completa a tu lado.",
"Then a test, and a restricted licence: you could drive alone, but not between ten at night and five in the morning,":
"Luego un examen, y una licencia restringida: podías manejar solo, pero no entre las diez de la noche y las cinco de la mañana,",
"and with no passengers, unless a fully licensed driver sat beside you.":
"y sin pasajeros, salvo que un conductor con licencia completa fuera a tu lado.",
"Eighteen months on, another test, and only then the full licence.":
"Dieciocho meses después, otro examen, y solo entonces la licencia completa.",
"The riskiest driving, at night and with friends, came last.":
"Lo más riesgoso, manejar de noche y con amigos, llegaba al final.",
"In the years that followed, serious car-crash injuries among 15 to 19 year olds fell by almost a quarter.":
"En los años siguientes, las lesiones graves por choques de auto entre los 15 y los 19 años bajaron casi una cuarta parte.",
"Not all of that was the stages: injuries fell at other ages too, and fewer young people drove.":
"No todo fue por las etapas: las lesiones bajaron también en otras edades, y menos jóvenes manejaban.",
"But the stages did their part: when restricted drivers crashed, fewer of those crashes were at night, or with passengers.":
"Pero las etapas cumplieron su parte: cuando chocaba alguien con licencia restringida, menos choques eran de noche, o con pasajeros.",
"It was the world's first licence in stages, and every American state has one now.":
"Fue la primera licencia en etapas del mundo, y hoy cada estado de Estados Unidos tiene una.",
"At the university, an agent earns its freedom the same way.":
"En la universidad, un agente se gana su libertad de la misma manera.",
"Anil's workload agent tells Health's heads of school how many people teach in each school this term, and how many are casual.":
"El agente de carga docente de Anil dice a los directores de Salud cuántos enseñan en cada escuela este periodo, y cuántos son temporales.",
"Given every right at once, like a full licence at fifteen,":
"Con todos los permisos de una vez, como una licencia completa a los quince,",
"it could change how those numbers are made, alone, at night, before it had shown it could,":
"podría cambiar cómo se calculan esas cifras, solo, de noche, antes de haber mostrado que sabía hacerlo,",
"and the heads of school would plan the next semester on numbers no one had checked.":
"y los directores de escuela planificarían el próximo semestre con cifras que nadie había revisado.",
"So its freedom comes a stage at a time, for each kind of task, and the team can stand behind its answers.":
"Así que su libertad llega por etapas, para cada tipo de tarea, y el equipo puede respaldar sus respuestas.",
"An agent's road, from a junior assistant to a team contributor, has five stages.":
"El camino de un agente, de asistente junior a colaborador del equipo, tiene cinco etapas.",
"Each stage changes three things: whose identity the agent uses, how much it may do, and what the person does.":
"Cada etapa cambia tres cosas: qué identidad usa el agente, cuánto puede hacer, y qué hace la persona.",
"Stage one: it suggests. It runs nothing, and you accept or reject every line.":
"Etapa uno: sugiere. No ejecuta nada, y tú aceptas o rechazas cada línea.",
"Stage two: it acts for you, step by step, on your sign-in, and you approve each action.":
"Etapa dos: actúa por ti, paso a paso, con tu acceso, y tú apruebas cada acción.",
"Stage three: it acts for you within limits, alone, with drafts only in a sandbox,":
"Etapa tres: actúa por ti dentro de límites, solo, con borradores únicamente en un sandbox,",
"and you check the result against the checks you set first.":
"y tú revisas el resultado con las verificaciones que fijaste antes.",
"Stage four: a contributor that proposes, under its own identity. Its owner reviews every change.":
"Etapa cuatro: un colaborador que propone, con su propia identidad. Su dueño revisa cada cambio.",
"Stage five: a contributor with a mandate, written and signed by its owner. In test, it does agreed tasks alone, and reports;":
"Etapa cinco: un colaborador con un mandato, escrito y firmado por su dueño. En pruebas, hace a solas las tareas acordadas, e informa;",
"in production, it drafts the fix, and another person approves every change.":
"en producción, redacta el arreglo, y otra persona aprueba cada cambio.",
"And before each stage, a gate: what must be true before it moves up.":
"Y antes de cada etapa, una puerta: lo que debe cumplirse antes de que suba.",
"The team's conventions and glossary, written down for it to read;":
"Las convenciones y el glosario del equipo, escritos para que los lea;",
"a development space, with no sensitive data;":
"un espacio de desarrollo, sin datos sensibles;",
"its limits, and how it will be checked, set before it starts;":
"sus límites, y cómo se revisará, fijados antes de empezar;",
"a place on the map, with an owner and a role;":
"un lugar en el mapa, con un dueño y un rol;",
"and a track record, and a mandate its owner signs.":
"y un historial, y un mandato que firma su dueño.",
"A person decides when it has passed.":
"Una persona decide cuándo la ha pasado.",
"Five stages, not a switch.":
"Cinco etapas, no un interruptor.",
"Anil's workload agent has had its own identity since September.":
"El agente de carga docente de Anil tiene su propia identidad desde septiembre.",
"But it isn't at one stage: each kind of task has its own.":
"Pero no está en una sola etapa: cada tipo de tarea tiene la suya.",
"What a word about staff means: stage one. It only suggests, and HR decides.":
"Qué significa una palabra sobre el personal: etapa uno. Solo sugiere, y Recursos Humanos decide.",
"A new question about teaching staff: stage three. It works alone in its own schema, and Anil checks the result against the plan.":
"Una pregunta nueva sobre los docentes: etapa tres. Trabaja solo en su propio esquema, y Anil revisa el resultado contra el plan.",
"Fixing a model: stage four. It proposes a pull request, Jun reviews it, and Noor approves the change to production.":
"Arreglar un modelo: etapa cuatro. Propone una solicitud de cambio, Jun la revisa, y Noor aprueba el cambio en producción.",
"Finding why the night build failed, in test: stage five. It works alone, within its mandate, and reports by morning.":
"Encontrar por qué falló la compilación nocturna, en pruebas: etapa cinco. Trabaja solo, dentro de su mandato, e informa por la mañana.",
"In production, the same task is at stage four: it finds the cause and drafts the fix, and Noor approves it.":
"En producción, la misma tarea está en la etapa cuatro: encuentra la causa y redacta el arreglo, y Noor lo aprueba.",
"It never just runs the build again: a plain job does that.":
"Nunca se limita a correr la compilación otra vez: eso lo hace un trabajo sencillo.",
"Like a restricted driver, free by day but not at night, the same task has more freedom in test than in production.":
"Como una licencia restringida, libre de día pero no de noche, la misma tarea tiene más libertad en pruebas que en producción.",
"Identity belongs to the agent. The stage belongs to each kind of task, in each place.":
"La identidad es del agente. La etapa es de cada tipo de tarea, en cada lugar.",
"One night in October, the build failed in test, and the agent set to work on it alone, as agreed.":
"Una noche de octubre, la compilación falló en pruebas, y el agente se puso a trabajar en ella solo, como estaba acordado.",
"To make it pass, it also changed a model that wasn't its own, one that other teams' reports are built on.":
"Para que pasara, también cambió un modelo que no era suyo, uno sobre el que se construyen los informes de otros equipos.",
"It was only in test, and nothing reached production; Jun saw it in the morning.":
"Fue solo en pruebas, y nada llegó a producción; Jun lo vio por la mañana.",
"That day, Anil moved the night task down a stage, from five to four.":
"Ese día, Anil bajó la tarea nocturna una etapa, de cinco a cuatro.",
"Each time the build failed, it waited for Anil to start it, and only proposed its fix.":
"Cada vez que fallaba la compilación, esperaba a que Anil lo pusiera en marcha, y solo proponía su arreglo.",
"Only that task moved; its other tasks kept their stages.":
"Solo esa tarea cambió; sus otras tareas mantuvieron sus etapas.",
"To go back up, it had to pass the gate again:":
"Para volver a subir, tuvo que pasar la puerta otra vez:",
"the folders it may change, written down and held by the tools;":
"las carpetas que puede cambiar, escritas y aplicadas por las herramientas;",
"limits on rounds, time and money, and a plain check before it starts;":
"límites de rondas, tiempo y dinero, y una verificación sencilla antes de empezar;",
"and fourteen nights in test without a miss.":
"y catorce noches en pruebas sin un error.",
"On the thirtieth of October, Anil signed its mandate, and the night task went back up.":
"El treinta de octubre, Anil firmó su mandato, y la tarea nocturna volvió a subir.",
"A step down for one task, not a switch turned off: the team kept its help while it earned the task back.":
"Un paso abajo en una tarea, no un interruptor apagado: el equipo conservó su ayuda mientras se ganaba la tarea de nuevo.",
"Under every stage, some things never change.":
"Bajo cada etapa, algunas cosas nunca cambian.",
"A person owns the agent, answers for its work, and stays in every critical loop.":
"Una persona es dueña del agente, responde por su trabajo, y está en cada ciclo crítico.",
"Every change to production is approved by a person who didn't make it, for agents as for people.":
"Cada cambio en producción lo aprueba una persona que no lo hizo, para agentes como para personas.",
"Agents never approve: an agent's review is only for reference.":
"Los agentes nunca aprueban: la revisión de un agente es solo de referencia.",
"And an agent never approves its own change, never weakens a check to pass it, and never grants itself rights.":
"Y un agente nunca aprueba su propio cambio, nunca debilita una verificación para pasarla, y nunca se da permisos a sí mismo.",
"Researchers describe five levels of autonomy by what the person does, from operator to observer.":
"Unos investigadores describen cinco niveles de autonomía según lo que hace la persona, de operador a observador.",
"Here, a person always approves production, so no stage leaves people only watching.":
"Aquí, una persona siempre aprueba producción, así que ninguna etapa deja a las personas solo mirando.",
"Europe's AI law asks for people who can understand a high-risk system, watch it, and stop it;":
"La ley de IA de Europa pide personas que puedan entender un sistema de alto riesgo, vigilarlo, y detenerlo;",
"and ISO/IEC 42001, the standard for managing AI, asks who is responsible for what.":
"y la ISO/IEC 42001, la norma para gestionar la IA, pregunta quién es responsable de qué.",
"In New Zealand, freedom on the road came a stage at a time, with the riskiest driving last.":
"En Nueva Zelanda, la libertad en la carretera llegó por etapas, con lo más riesgoso al final.",
"An agent earns its freedom the same way: each kind of task through its own gates, and back down a stage when something goes wrong.":
"Un agente se gana su libertad igual: cada tipo de tarea por sus propias puertas, y una etapa abajo cuando algo sale mal.",
"Each stage is written on the university's map, beside its kind of task.":
"Cada etapa está escrita en el mapa de la universidad, junto a su tipo de tarea.",
"On the second of November, Planning's tickets passed from Jun's helper, on his sign-in, to the planning agent, with a name of its own.":
"El 2 de noviembre, los encargos de Planificación pasaron del ayudante de Jun, con su acceso, al agente de Planificación, con nombre propio.",
"The films that follow take it along that road.":
"Las películas que siguen lo llevan por ese camino.",
"The agents do more as they earn it, and the team still stands behind every number.":
"Los agentes hacen más a medida que se lo ganan, y el equipo sigue respaldando cada cifra.",
"Autonomy is earned one kind of task at a time.":
"La autonomía se gana un tipo de tarea a la vez."
});
