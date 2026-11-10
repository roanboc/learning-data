/* More readers than people: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in Reports on demand and the series' page: el costo de la docencia ocasional, Finanzas, RR. HH., la Facultad de Salud (Salud), un reporte, el día de pago,
   las declaraciones (de horas) for the claims, una asignatura for a unit, la medida; una vista de métricas for a metric view, as Databricks' Spanish docs say it; un reflejo
   for Fabric's mirror, as Microsoft's Spanish docs say it (la creación de reflejo); el inicio de sesión, los permisos, el conector, un servidor de herramientas, un socio externo,
   el proyecto de datos. In 1968: la Convención sobre la Señalización Vial, its title in the United Nations' Spanish text; las señales; un auto, manejar, la ruta.
   The platform's names stay as they are on screen: Genie One, Unity Catalog, Databricks Apps, Power BI, Microsoft Fabric, OpenSharing; the agent's word, sessional teaching cost,
   stays in English, in «», as it is in its instructions. Noor, la arquitecta de datos, as the module's other Spanish captions say. Tú, as the rules speak to the viewer.
   Numbers keep the picture's point (A$1.84 millones), as the module's other Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Vienna, November 1968.":
"Viena, noviembre de 1968.",
"More people than ever drive from one country into the next.":
"Más gente que nunca maneja de un país al siguiente.",
"At a United Nations conference, countries have spent a month on the rules of the road.":
"En una conferencia de las Naciones Unidas, los países llevan un mes con las reglas del tránsito.",
"But their signs still differ. Many give their message in words, in the country's own language.":
"Pero sus señales aún difieren. Muchas dan su mensaje en palabras, en el idioma de cada país.",
"A driver from abroad can pass a warning of a sharp bend, and never know what it said.":
"Un conductor extranjero puede pasar un aviso de curva peligrosa sin saber nunca qué decía.",
"And on the road, a missed warning can end in a crash.":
"Y en la ruta, un aviso que no se entiende puede terminar en un choque.",
"Something has to change.":
"Algo tiene que cambiar.",
"So, on the 8th of November, 31 countries sign a treaty: the Convention on Road Signs and Signals.":
"Así, el 8 de noviembre, 31 países firman un tratado: la Convención sobre la Señalización Vial.",
"It defines each sign once: by its shape, its colour and its symbol.":
"Define cada señal una vez: por su forma, su color y su símbolo.",
"A triangle edged in red warns. A circle edged in red forbids, or sets a limit. A blue circle says what you must do.":
"Un triángulo con borde rojo advierte. Un círculo con borde rojo prohíbe o fija un límite. Un círculo azul dice qué hacer.",
"Today, 75 countries keep it, and a driver reads the same signs from one country to the next.":
"Hoy, 75 países la aplican, y un conductor lee las mismas señales de un país al siguiente.",
"And the signs have readers nobody planned for in 1968.":
"Y las señales tienen lectores que nadie previó en 1968.",
"Since July 2024, every new car in the European Union must read the speed limit off the signs it passes.":
"Desde julio de 2024, todo auto nuevo en la Unión Europea debe leer el límite de velocidad en las señales que pasa.",
"Data has readers nobody planned for, too.":
"Los datos también tienen lectores que nadie previó.",
"Casual teaching cost, defined once at the university, is read by people, Finance's reports, an app, an agent, and a partner outside.":
"El costo de la docencia ocasional, definido una vez, lo leen personas, los reportes de Finanzas, una app, un agente y un socio externo.",
"A reader that can't reach the definition counts its own way. One that reads as someone else sees what it shouldn't.":
"Un lector que no llega a la definición cuenta a su manera. Uno que lee como otro ve lo que no debería.",
"Read where it's defined, each as itself, every reader gives the same number, and sees only what it may.":
"Leyendo donde está definido, cada uno como sí mismo, todo lector da el mismo número y ve solo lo que puede.",
"Today, at the university, it's pay day: Thursday, the 5th of November.":
"Hoy, en la universidad, es día de pago: jueves 5 de noviembre.",
"Rohan Desai, in Finance, owns casual teaching cost: what a semester's casual teaching costs.":
"Rohan Desai, de Finanzas, es dueño del costo de la docencia ocasional: lo que cuesta la de un semestre.",
"In September, it was defined once, as a metric view in Unity Catalog.":
"En septiembre, se definió una vez, como una vista de métricas en Unity Catalog.",
"Genie One reads it there when he asks: for the Faculty of Health, 1.84 million dollars so far this semester.":
"Genie One lo lee ahí cuando él pregunta: para la Facultad de Salud, A$1.84 millones en lo que va del semestre.",
"But in this morning's budget pack, a Power BI report said 1.56 million, under the same name.":
"Pero en el paquete de presupuesto de esta mañana, un reporte de Power BI decía A$1.56 millones, con el mismo nombre.",
"Finance's analysts build their reports in Power BI, which reads the university's catalog through a mirror in Microsoft Fabric.":
"Los analistas de Finanzas arman sus reportes en Power BI, que lee el catálogo de la universidad por un reflejo en Microsoft Fabric.",
"The mirror shows tables, and reads their data where it lives. But metric views don't appear in it.":
"El reflejo muestra tablas y lee sus datos donde viven. Pero las vistas de métricas no aparecen en él.",
"So the report, built where the measure can't be seen, summed the pay paid, and called it casual teaching cost.":
"Así que el reporte, hecho donde la medida no se ve, sumó el sueldo pagado y lo llamó costo de la docencia ocasional.",
"And through the mirror, every query runs as the one sign-in that set it up. The catalog's rights stay behind.":
"Y por el reflejo, cada consulta corre como el único inicio de sesión que lo configuró. Los permisos del catálogo se quedan atrás.",
"So the report now reads the measure from Databricks itself, through Power BI's connector, each analyst signed in as themselves.":
"Así que ahora el reporte lee la medida desde el propio Databricks, con el conector de Power BI, cada analista con su propia sesión.",
"It asks for the measure by name, and gets 1.84 million, as Genie One does.":
"Pide la medida por su nombre y obtiene A$1.84 millones, igual que Genie One.",
"Noor, the data architect, writes the rule down: mirror only what every reader there may see, and read a measure where it's defined.":
"Noor, la arquitecta de datos, escribe la regla: refleja solo lo que todo lector ahí puede ver, y lee una medida donde está definida.",
"In the Faculty of Health, Anil Kurian is planning next semester's tutors.":
"En la Facultad de Salud, Anil Kurian planifica los tutores del próximo semestre.",
"The faculties plan in an app the data team built with Databricks Apps.":
"Las facultades planifican en una app que el equipo de datos hizo con Databricks Apps.",
"It shows what casual teaching cost the faculty so far, beside the hours each unit will need.":
"Muestra lo que la docencia ocasional le costó a la facultad hasta ahora, junto a las horas que necesitará cada asignatura.",
"Every faculty uses it, and each may see only its own.":
"Todas las facultades la usan, y cada una puede ver solo lo suyo.",
"An app can read in two ways: as itself, so everyone using it shares the app's rights, or as the person using it.":
"Una app puede leer de dos maneras: como sí misma, y quienes la usan comparten sus permisos, o como la persona que la usa.",
"This one reads as the person, and may only run queries for them.":
"Esta lee como la persona, y solo puede hacer consultas por ella.",
"And the claims behind the measure carry a filter by faculty, set in Unity Catalog.":
"Y las declaraciones detrás de la medida llevan un filtro por facultad, puesto en Unity Catalog.",
"So Anil sees Health's numbers, and nothing in the app's code decides who sees what.":
"Así, Anil ve las cifras de Salud, y nada en el código de la app decide quién ve qué.",
"Let an app read as the person using it, and keep the rules where the data lives.":
"Haz que una app lea como la persona que la usa, y deja las reglas donde viven los datos.",
"Every pay day, Rohan sends the deans each faculty's casual teaching cost so far.":
"Cada día de pago, Rohan les envía a los decanos el costo de la docencia ocasional de cada facultad hasta ahora.",
"Now Finance's pay-day agent drafts the note for him.":
"Ahora el agente del día de pago de Finanzas le redacta la nota.",
"It asks Genie One through a tool server, as any agent can, and Genie One answers from the same definition.":
"Le pregunta a Genie One por un servidor de herramientas, como puede cualquier agente, y Genie One responde desde la misma definición.",
"Its instructions say sessional teaching cost, and Genie One knows the word: it's one of the synonyms Rohan gave the measure.":
"Sus instrucciones dicen «sessional teaching cost», y Genie One conoce la palabra: es uno de los sinónimos que Rohan le dio a la medida.",
"Like a car reading the signs it passes, an agent reads the words a measure is given: its name, its description, its synonyms.":
"Como un auto que lee las señales que pasa, un agente lee las palabras de una medida: su nombre, su descripción, sus sinónimos.",
"The agent works alone, on a schedule, so it has a name of its own, under the same rules as people.":
"El agente trabaja solo, con un horario, así que tiene un nombre propio, con las mismas reglas que las personas.",
"It may ask Genie One, and read the measure. It can't read the claims themselves: who worked which hours, and what they were paid.":
"Puede preguntarle a Genie One y leer la medida. No puede leer las declaraciones: quién trabajó qué horas y cuánto se le pagó.",
"It drafts. Rohan checks the note, and sends it.":
"Redacta. Rohan revisa la nota y la envía.",
"Give every reader that works alone a name of its own, and only what its job reads.":
"Dale a todo lector que trabaja solo un nombre propio, y solo lo que su tarea lee.",
"Some readers are outside the university: a group of universities compares what teaching costs, faculty by faculty, each semester.":
"Hay lectores fuera de la universidad: un grupo de universidades compara lo que cuesta la docencia, facultad por facultad, cada semestre.",
"Sam shares it with them through OpenSharing: their own system reads it where it lives, so there's no copy to keep up to date.":
"Sam se lo comparte por OpenSharing: su propio sistema lo lee donde vive, así que no hay copia que mantener al día.",
"Ingrid, who answers for HR's data, asks for one more rule: totals by faculty, never by unit.":
"Ingrid, que responde por los datos de RR. HH., pide una regla más: totales por facultad, nunca por asignatura.",
"A unit with one tutor would give away what that tutor was paid.":
"Una asignatura con un solo tutor revelaría cuánto se le pagó a ese tutor.",
"So the share holds one small table, made from the measure: casual teaching cost by faculty, for semesters that have ended.":
"Así que se comparte una tabla pequeña, hecha desde la medida: el costo de la docencia ocasional por facultad, de semestres terminados.",
"The group reads the same definition's numbers, and nothing more.":
"El grupo lee las cifras de la misma definición, y nada más.",
"Outside the platform, share the least a partner needs, and make it from the definition.":
"Fuera de la plataforma, comparte lo mínimo que un socio necesita, y hazlo desde la definición.",
"Back in Finance, pay day ends with one number.":
"De vuelta en Finanzas, el día de pago termina con un número.",
"1.84 million dollars for Health so far: in Genie One, in Power BI, in the app, and in the agent's draft.":
"A$1.84 millones para Salud hasta ahora: en Genie One, en Power BI, en la app y en el borrador del agente.",
"And each reader sees only what it may.":
"Y cada lector ve solo lo que puede.",
"Like the signs agreed in Vienna, the definition was made once, for people, and machines read it too.":
"Como las señales acordadas en Viena, la definición se hizo una vez, para personas, y las máquinas también la leen.",
"But unlike a road sign, data isn't for anyone who passes: every reader shows who it is.":
"Pero, a diferencia de una señal, los datos no son para cualquiera que pase: cada lector muestra quién es.",
"And every reader is written down in the data project, so a change to the measure names who it touches.":
"Y cada lector queda anotado en el proyecto de datos, así que un cambio en la medida dice a quién afecta.",
"Read each measure where it's defined, through a door that carries it.":
"Lee cada medida donde está definida, por una puerta que la lleve.",
"Let each reader read as the person it acts for, or as itself, with only what it needs.":
"Que cada lector lea como la persona por la que actúa, o como sí mismo, con solo lo que necesita.",
"And outside, share the least.":
"Y afuera, comparte lo mínimo.",
"There are standards for all of this already, so don't reinvent the wheel.":
"Ya hay estándares para todo esto, así que no reinventes la rueda.",
"Investigate, adapt, implement, iterate, starting from the official docs.":
"Investiga, adapta, implementa, itera, empezando por la documentación oficial.",
"Even the road signs' convention keeps improving: a new text comes into force next week.":
"Hasta la convención de las señales sigue mejorando: un texto nuevo entra en vigor la semana próxima.",
"Next, the module's last film: files, read as data and as context.":
"Después, la última película del módulo: archivos, leídos como datos y como contexto."
});
