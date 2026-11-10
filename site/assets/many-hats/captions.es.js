/* Many hats, one picture: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md has them: el equipo, la gestora de datos, un objetivo, el Consejo Universitario (never "el consejo",
   which is the data council). In Kaifeng, 1015: las puertas, un gran salón, un almacén del tesoro, la biblioteca imperial, las zanjas, el canal Bian, los
   escombros, los cavadores, los barqueros y los carreteros. At the university: la oficina de registro, el horario, las reservas, un aula,
   el sensor y su flujo, los conteos, el gobierno de datos, el catálogo y su linaje. "Depth" is what someone knows a fondo, and
   "T-shaped" is en forma de T. The films named keep their Spanish titles on the site: La vida interior de los datos, El mapa antes de los
   datos; the book keeps its title, Range. Tú, as the film speaks to the viewer (Profundiza, Aprende, Toma, Pregunta). Dates in words as
   Spanish says them (lunes 1 de marzo de 2027), and Easter is Semana Santa. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Kaifeng, China's capital under the Song dynasty, in the year 1015.":
"Kaifeng, la capital de China bajo la dinastía Song, en el año 1015.",
"One night, a fire breaks out in the emperor's palace, and spreads.":
"Una noche, se declara un incendio en el palacio del emperador, y se extiende.",
"By noon the next day, it has burned two gates, a great hall, a treasury and the imperial library.":
"Al mediodía siguiente, ha quemado dos puertas, un gran salón, un almacén del tesoro y la biblioteca imperial.",
"A senior minister, Ding Wei, who has run the state's finances and the building of a palace, is put in charge of the repairs.":
"Ding Wei, un alto ministro que ha dirigido las finanzas del Estado y la construcción de un palacio, queda a cargo de las obras.",
"Rebuilding means three jobs, each one slow and costly.":
"Reconstruir supone tres trabajos, cada uno lento y costoso.",
"Earth to build with must be dug far away, and carried in.":
"La tierra para construir hay que cavarla lejos, y traerla.",
"Timber, arriving by water, must be hauled through the streets.":
"La madera, que llega por agua, hay que arrastrarla por las calles.",
"And the burned rubble must be carted away.":
"Y los escombros quemados hay que sacarlos en carros.",
"Each job means carts crossing a crowded city, load after load: slow for the palace, costly for the state, and in everyone's way.":
"Cada trabajo son carros cruzando una ciudad llena, carga tras carga: lento para el palacio, caro para el Estado y un estorbo para todos.",
"Something has to change.":
"Algo tiene que cambiar.",
"Ding Wei's plan makes the three jobs one.":
"El plan de Ding Wei hace de los tres trabajos uno solo.",
"He has the main streets dug up for earth, and within days they're deep trenches.":
"Manda cavar las calles principales para sacar tierra, y en pocos días son zanjas profundas.",
"Then he breaks the bank of the Bian canal, the waterway that supplies the city, and lets its water in.":
"Luego rompe la orilla del canal Bian, la vía de agua que abastece la ciudad, y deja entrar el agua.",
"Rafts of timber and boats of materials float right up to the palace gate.":
"Balsas de madera y barcas con materiales llegan flotando hasta la puerta del palacio.",
"When the work is done, the rubble fills the trenches, and the streets are streets again.":
"Terminada la obra, los escombros llenan las zanjas, y las calles vuelven a ser calles.",
"One move, and three jobs done, wrote Shen Kuo, a scholar who told the story some seventy years later.":
"Una sola acción, y tres trabajos hechos, escribió Shen Kuo, un erudito que contó la historia unos setenta años después.",
"The state's saving, in his words, ran to hundreds of millions, and the city got its streets back.":
"El ahorro del Estado, en sus palabras, llegó a cientos de millones, y la ciudad recuperó sus calles.",
"The diggers, the boatmen and the carters each knew their job well. Ding Wei saw the three as one.":
"Los cavadores, los barqueros y los carreteros conocían bien su trabajo. Ding Wei vio los tres como uno solo.",
"Data work has its parts too, each kept by someone who knows it deeply.":
"Los datos también tienen sus partes, cada una en manos de quien la conoce a fondo.",
"Someone who learns enough of each to see them as one picture finds what falls between them.":
"Quien aprende lo suficiente de cada una para verlas como un todo encuentra lo que queda entre ellas.",
"Data work now asks for new skills, and leading the people who do it is a skill too.":
"El trabajo con datos pide hoy nuevas habilidades, y liderar a quienes lo hacen también es una habilidad.",
"These films take one practice at a time, in a data team at a university, a year from now.":
"Estas películas muestran una práctica a la vez, en un equipo de datos de una universidad, dentro de un año.",
"Monday 1 March 2027: Ivy Reyes joins the team, as a graduate data analyst.":
"Lunes 1 de marzo de 2027: Ivy Reyes se une al equipo, como analista de datos recién graduada.",
"Her degree is in statistics: that's her depth.":
"Estudió estadística: eso es lo que conoce a fondo.",
"Helena Novak, the data manager, wears two hats: product owner of the team's services, who thinks like an architect, and people leader.":
"Helena Novak, la gestora de datos, tiene dos roles: responsable de producto de los servicios, con mirada de arquitecta, y líder de personas.",
"For her, managing and leading are two sides of one role, not rivals: the plans, the dates and the measures serve the people.":
"Para ella, gestionar y liderar son dos caras del mismo trabajo, no rivales: los planes, las fechas y las métricas sirven a las personas.",
"She gives Ivy a month to learn the team's work, and one real question to follow through all of it.":
"Le da a Ivy un mes para conocer el trabajo del equipo, y una pregunta real para seguir a través de todo él.",
"It comes from Graham Ellis, the new Director of Facilities: should he ask the University Council for a new teaching building?":
"Viene de Graham Ellis, el nuevo director de Instalaciones: ¿debe pedir al Consejo Universitario un nuevo edificio de aulas?",
"His question, agreed with him in writing: do we have too few rooms, or too few at some hours?":
"Su pregunta, acordada con él por escrito: ¿tenemos pocas aulas, o pocas a ciertas horas?",
"In her first week, Ivy writes her first goals, and Helena agrees them.":
"En su primera semana, Ivy escribe sus primeros objetivos, y Helena los acuerda con ella.",
"The first: by Easter, know the whole route of one question's data.":
"El primero: para Semana Santa, conocer todo el recorrido de una pregunta.",
"She starts where the data is born.":
"Empieza donde nacen los datos.",
"In the registrar's office, Mei Tanaka keeps the timetable: every class, booked into one of 186 rooms, hour by hour.":
"En la oficina de registro, Mei Tanaka lleva el horario: cada clase, reservada en una de 186 aulas, hora por hora.",
"Sam Okafor runs the data platform, and the feed from each room's sensor, which counts the people in it every hour.":
"Sam Okafor gestiona la plataforma de datos y el flujo del sensor de cada aula, que cuenta a las personas presentes cada hora.",
"Yusuf Demir, who leads data governance, set the rule for that feed: counts, never people.":
"Yusuf Demir, que lidera el gobierno de datos, fijó la regla de ese flujo: conteos, nunca personas.",
"Noor Rahman, the data architect, keeps the map of where data is born and where it goes.":
"Noor Rahman, la arquitecta de datos, mantiene el mapa de dónde nacen los datos y adónde van.",
"Jun Park builds the models that turn raw data into tables people can trust.":
"Jun Park construye los modelos que convierten los datos en bruto en tablas confiables.",
"Every day, Ivy spends an hour beside him, changing real ones.":
"Cada día, Ivy pasa una hora a su lado, cambiando modelos reales.",
"How data moves, and how the map is drawn, have films of their own: The Inner Life of Data, and The map before the data.":
"Cómo se mueven los datos y cómo se dibuja el mapa tienen sus propias películas: La vida interior de los datos, y El mapa antes de los datos.",
"Each of them is deep in one part, and right about it.":
"Cada uno conoce a fondo una parte, y tiene razón en ella.",
"Ivy learns enough of each to follow: their words, their tools, and what worries them.":
"Ivy aprende lo suficiente de cada parte para seguirla: sus palabras, sus herramientas y lo que les preocupa.",
"And she asks each the same question: who uses this, and for which decision?":
"Y a cada uno le hace la misma pregunta: ¿quién usa esto, y para qué decisión?",
"In her fourth week, she draws the whole route of Graham's question on one page, starting from his decision.":
"En su cuarta semana, dibuja todo el recorrido de la pregunta de Graham en una página, empezando por su decisión.",
"At the top, the decision: whether to ask for the building, which the University Council weighs in June.":
"Arriba, la decisión: si pedir el edificio, que el Consejo Universitario evalúa en junio.",
"Under it, the question behind it: too few rooms, or too few at some hours?":
"Debajo, la pregunta que hay detrás: ¿pocas aulas, o pocas a ciertas horas?",
"Then the data that answers it: each room's bookings, beside the people counted in it.":
"Luego, los datos que la responden: las reservas de cada aula, junto a las personas contadas en ella.",
"Where that data is born: the timetable, and the sensors.":
"Dónde nacen esos datos: el horario y los sensores.",
"Who keeps it: Mei, Sam, Jun and Noor. And the rule: counts, never people.":
"Quién los cuida: Mei, Sam, Jun y Noor. Y la regla: conteos, nunca personas.",
"Where the bookings meet the counts, she sees what no one part could.":
"Donde las reservas se juntan con los conteos, ve lo que ninguna parte sola podía ver.",
"The two must name each room the same way, and for 172 rooms, they do.":
"Los dos deben nombrar cada aula igual, y en 172 aulas, lo hacen.",
"For 14, they don't: those rooms were renumbered in the timetable after their sensors went in.":
"En 14, no: esas aulas se renumeraron en el horario después de que les pusieran sus sensores.",
"Joined as they were, those 14 would drop out without a word, and Graham's answer would cover 172 rooms, not 186.":
"Unidos tal cual, esas 14 quedarían fuera sin aviso, y la respuesta de Graham cubriría 172 aulas, no 186.",
"Nobody was wrong: the timetable was right, and so were the sensors. They had never been put side by side.":
"Nadie se equivocó: el horario estaba bien, y los sensores también. Nunca se habían puesto lado a lado.",
"Ivy didn't need to know the timetable as Mei does, or the sensors as Sam does.":
"Ivy no necesitaba conocer el horario como Mei, ni los sensores como Sam.",
"She needed depth of her own, in statistics, and enough of the business, the systems and the data to join them.":
"Necesitaba conocer a fondo lo suyo, la estadística, y lo suficiente del negocio, los sistemas y los datos para unirlos.",
"That shape has a name: T-shaped. One deep stroke, and a wide bar across the top.":
"Esa forma tiene nombre: en forma de T. Un trazo profundo, y una barra ancha arriba.",
"Frameworks map the work: SFIA lists well over a hundred skills, and DAMA's body of knowledge names the roles of data work.":
"Los marcos describen el trabajo: SFIA reúne mucho más de cien habilidades, y el cuerpo de conocimiento de DAMA nombra los roles de datos.",
"Nobody holds them all deeply, and nobody needs to.":
"Nadie las domina todas a fondo, y nadie lo necesita.",
"In his book Range, David Epstein argues that specialists win where the rules stay fixed, as in chess.":
"En su libro Range, David Epstein sostiene que los especialistas ganan donde las reglas no cambian, como en el ajedrez.",
"Where problems are messy, people with range do better.":
"Donde los problemas son enredados, a quien tiene amplitud le va mejor.",
"Like the diggers and the boatmen, the specialists stay essential: Mei and Sam matched the 14 rooms in a day.":
"Como los cavadores y los barqueros, los especialistas siguen siendo esenciales: Mei y Sam emparejaron las 14 aulas en un día.",
"But someone has to see across them.":
"Pero alguien tiene que ver el conjunto.",
"On Thursday 25 March, just before Easter, Ivy's first goal is met: she knows the whole route.":
"El jueves 25 de marzo, justo antes de Semana Santa, Ivy cumple su primer objetivo: conoce todo el recorrido.",
"When the team takes up Graham's question the next week, it starts from her page, with all 186 rooms.":
"Cuando el equipo retoma la pregunta de Graham la semana siguiente, parte de su página, con las 186 aulas.",
"From April, the catalog draws much of that route by itself.":
"Desde abril, el catálogo dibuja buena parte de ese recorrido por sí solo.",
"Its lineage runs from the raw bookings and counts, through Jun's models, to the page Graham reads.":
"Su linaje va de las reservas y los conteos en bruto, por los modelos de Jun, hasta la página que lee Graham.",
"What it can't draw is the decision, and the question behind it. Those stay on Ivy's page.":
"Lo que no puede dibujar es la decisión, ni la pregunta que hay detrás. Eso queda en la página de Ivy.",
"In Kaifeng, Ding Wei didn't dig, float timber or cart rubble better than the people who did. He saw the three jobs as one.":
"En Kaifeng, Ding Wei no cavaba, ni traía madera, ni acarreaba escombros mejor que quienes lo hacían. Vio los tres trabajos como uno.",
"Ivy did the same with data: she saw the parts as one, and kept 14 rooms in Graham's answer.":
"Ivy hizo lo mismo con los datos: vio las partes como un todo, y mantuvo 14 aulas en la respuesta de Graham.",
"On Monday, keep your depth in one thing.":
"El lunes, sigue profundizando en una cosa.",
"Learn the words of the others, and spend time with each of them.":
"Aprende las palabras de los demás, y pasa tiempo con cada uno.",
"Take one real question, and draw its whole route on one page.":
"Toma una pregunta real, y dibuja todo su recorrido en una página.",
"Ask, of every part: who uses this, and for which decision?":
"Pregunta, en cada parte: ¿quién usa esto, y para qué decisión?",
"Go deep in one thing; learn enough of the others to see the whole.":
"Profundiza en una cosa; aprende lo suficiente de las demás para ver el todo."
});
