/* Design it simple: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md and Listen first have them: la gestora de datos, la situación actual and la situación deseada, el referente de datos (a data partner),
   capas (the five layers), el antiguo almacén (the old warehouse), la lista de personal (the staff list), días hábiles, la Facultad de Salud, el personal temporal
   (casual teaching: la docencia temporal), and Listen first's tú. For this film: los principios and what each descarta (rules out), la puerta de entrada (the front
   door), los procedimientos, each a página, pedir, elegir, construir, liberar, arreglar, retirar (the six), quién pide, decide, construye y revisa (the four roles),
   un revisor por turnos (a reviewer from a rota), el hito de definición (the define milestone), la hoja de ruta, and the data mesh kept as it's said. The opening:
   el rey Sejong, Joseon, Choe Manri, sus eruditos (his scholars), el hangul in lowercase, as Spanish writes the alphabet, un tribunal (a court), un carácter
   equivocado. The films named keep their Spanish titles on the site: El mapa antes de los datos and its film Qué la mueve, Una capacidad, no un proyecto, the
   series El mismo, en todas partes, Un producto con dueño, and the module Liderar equipos de datos. Its last line: "Parte de la decisión; diseña las menos piezas
   que le sirvan." */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Korea, in the 1440s: the kingdom of Joseon, under King Sejong.":
"Corea, en la década de 1440: el reino de Joseon, bajo el rey Sejong.",
"Its people wrote in Chinese characters: a sign for each word, thousands of them, made for another language.":
"Su gente escribía con caracteres chinos: un signo para cada palabra, miles de ellos, hechos para otra lengua.",
"Learning them took years, so most people couldn't write down what they wanted to say.":
"Aprenderlos llevaba años, así que la mayoría no podía escribir lo que quería decir.",
"In a court, a person's words were written down in characters they couldn't read.":
"En un tribunal, las palabras de una persona se escribían en caracteres que no sabía leer.",
"One wrong character could punish someone innocent, and they had no way to check.":
"Un carácter equivocado podía castigar a un inocente, y no tenía forma de comprobarlo.",
"Something had to change.":
"Algo tenía que cambiar.",
"King Sejong started from what people needed: to write the way they speak.":
"El rey Sejong partió de lo que la gente necesitaba: escribir como habla.",
"In 1443 he made 28 letters, the consonants drawn from the mouth and throat as they make each sound.":
"En 1443 creó 28 letras, las consonantes dibujadas desde la boca y la garganta al hacer cada sonido.",
"Five basic shapes, and a stroke added for a stronger sound.":
"Cinco formas básicas, y un trazo más para un sonido más fuerte.",
"The vowels come from three marks: a dot for heaven, a flat line for the earth, a standing line for a person.":
"Las vocales salen de tres marcas: un punto para el cielo, una línea plana para la tierra, una de pie para una persona.",
"Put together a syllable at a time, they write any word.":
"Juntas, una sílaba a la vez, escriben cualquier palabra.",
"One of his own scholars, Choe Manri, objected: it would turn people away from learning in characters.":
"Uno de sus propios eruditos, Choe Manri, se opuso: alejaría a la gente del estudio de los caracteres.",
"The king argued for it, and in 1446 published the letters, with a book eight of his scholars wrote to explain them.":
"El rey defendió sus letras, y en 1446 las publicó, con un libro que ocho de sus eruditos escribieron para explicarlas.",
"Its closing words say a quick learner can know them before the morning is over, and anyone within ten days.":
"Sus palabras finales dicen que quien aprende rápido las sabe antes de que acabe la mañana, y cualquiera en diez días.",
"Today we call them Hangul, and both Koreas write with them; in the South, about 98 adults in 100 can read and write.":
"Hoy las llamamos hangul, y las dos Coreas escriben con ellas; en el Sur, unos 98 de cada 100 adultos saben leer y escribir.",
"Data is the same: a design people can learn in a morning is a design they use.":
"Con los datos pasa lo mismo: un diseño que se aprende en una mañana es un diseño que se usa.",
"A year from now, at a university, there are eleven ways to ask for data, three copies of the staff list, and 41 working days to wait.":
"Dentro de un año, en una universidad, hay once formas de pedir datos, tres copias de la lista de personal y 41 días hábiles de espera.",
"Its new data manager and team design the target simply: five principles, a small team with partners, six procedures, one front door.":
"Su nueva gestora de datos y el equipo diseñan simple: cinco principios, un equipo pequeño con referentes, seis procedimientos, una puerta.",
"Simple enough that anyone there can learn it in a morning.":
"Tan simple que cualquiera allí puede aprenderlo en una mañana.",
"March 2027. Helena Novak, the university's data manager, has the current state on the wall, in five layers.":
"Marzo de 2027. Helena Novak, la gestora de datos de la universidad, tiene la situación actual en la pared, en cinco capas.",
"Next in her ninety days: define the target, the state to reach, by Monday 5 April.":
"Luego, en sus noventa días: definir la situación deseada, a la que llegar, para el lunes 5 de abril.",
"Before drawing anything, she and the team write the rules they'll design by: five principles.":
"Antes de dibujar nada, ella y el equipo escriben las reglas con las que diseñarán: cinco principios.",
"One: start from the decision. Nothing is built without a decision behind it.":
"Uno: partir de la decisión. Nada se construye sin una decisión detrás.",
"Two: one copy, governed once. No private copies of the things everyone shares.":
"Dos: una sola copia, gobernada una vez. Nada de copias privadas de lo que todos comparten.",
"Three: owners in the business, builders beside them. The data team doesn't decide what other people's data means.":
"Tres: dueños en el negocio, y quienes construyen a su lado. El equipo de datos no decide qué significan los datos de otros.",
"Four: simple before clever. No new tool where one they have will do.":
"Cuatro: simple antes que ingenioso. Ninguna herramienta nueva donde sirva una suya.",
"Five: measure what people use, not how busy the team is.":
"Cinco: medir lo que la gente usa, no lo ocupado que está el equipo.",
"Each says what it rules out: a principle nothing could fail can't settle a choice.":
"Cada uno dice qué descarta: un principio que nada podría incumplir no zanja ninguna elección.",
"The map before the data tests principles like these, in Why it moves.":
"El mapa antes de los datos pone a prueba principios como estos, en Qué la mueve.",
"Anyone can check a choice against them, without asking Helena.":
"Cualquiera puede contrastar una elección con ellos, sin preguntarle a Helena.",
"A tool of their own for the faculties? The platform the team already runs will do.":
"¿Una herramienta propia para las facultades? Sirve la plataforma que el equipo ya opera.",
"A copy of the staff list for each faculty? One list, governed once, read by everyone allowed to.":
"¿Una copia de la lista de personal para cada facultad? Una lista, gobernada una vez, que lee todo quien tiene permiso.",
"Five shapes made every letter; five principles can shape every choice.":
"Cinco formas hicieron cada letra; cinco principios pueden dar forma a cada elección.",
"Then Helena and Noor, the data architect, draw the target on Noor's map, in the same five layers.":
"Luego Helena y Noor, la arquitecta de datos, dibujan la situación deseada en el mapa de Noor, en las mismas cinco capas.",
"Strategy: the same four goals; delivering data becomes quick, and reporting happens in one place.":
"Estrategia: los mismos cuatro objetivos; entregar datos se vuelve rápido, y los reportes se hacen en un solo lugar.",
"Business: the same twelve decisions, served by a small team in the middle, data partners around it, six procedures and one front door.":
"Negocio: las mismas doce decisiones, servidas por un equipo pequeño en el centro, referentes alrededor, seis procedimientos y una puerta.",
"Information: one governed copy of each thing, with an owner in the business. One staff list, not three.":
"Información: una copia gobernada de cada cosa, con un dueño en el negocio. Una lista de personal, no tres.",
"Application: one platform for data and reports, its catalog, and agents, each with a written mandate. The old warehouse is gone.":
"Aplicación: una plataforma para datos y reportes, su catálogo, y agentes, cada uno con un mandato escrito. El antiguo almacén ya no está.",
"Technology: the platform, in the cloud; the old warehouse's servers, switched off.":
"Tecnología: la plataforma, en la nube; los servidores del antiguo almacén, apagados.",
"Each page has its picture, drawn with it, never after.":
"Cada página tiene su imagen, dibujada con ella, nunca después.",
"Drawn together, every system and every copy has a decision behind it.":
"Dibujados juntos, cada sistema y cada copia tienen una decisión detrás.",
"How to keep one copy of the people and things everyone shares: The same one, everywhere.":
"Cómo tener una sola copia de las personas y cosas que todos comparten: El mismo, en todas partes.",
"How each product keeps its promise: A product with an owner.":
"Cómo cada producto cumple su promesa: Un producto con dueño.",
"Who builds what? Today the university has the worst of two designs.":
"¿Quién construye qué? Hoy la universidad tiene lo peor de dos diseños.",
"At the centre, one queue: 41 working days.":
"En el centro, una cola: 41 días hábiles.",
"At the edges, people who can't wait keep their own copies: three staff lists, and numbers that disagree.":
"En los bordes, quienes no pueden esperar guardan sus propias copias: tres listas de personal, y cifras que no coinciden.",
"Helena designs the way between, as data mesh and Piethein Strengholt describe it.":
"Helena diseña el camino intermedio, como lo describen el data mesh y Piethein Strengholt.",
"A small team in the middle keeps the platform, the standards, the shared products and the guardrails, and it helps.":
"Un equipo pequeño en el centro mantiene la plataforma, los estándares, los productos compartidos y los límites, y ayuda.",
"Seven data partners, in four faculties and three offices, build their own area's products with the team's tools.":
"Siete referentes de datos, en cuatro facultades y tres oficinas, construyen los productos de su área con las herramientas del equipo.",
"Each spends about a day a week on it, given by their dean or director.":
"Cada uno le dedica cerca de un día a la semana, que le da su decano o director.",
"The leading data people module tells how a leader lets people decide.":
"El módulo Liderar equipos de datos cuenta cómo un líder deja decidir a la gente.",
"She sends the draft to everyone she spoke to. A head of school writes back: partners take people away from teaching.":
"Envía el borrador a todos con quienes habló. Un director de escuela responde: los referentes le quitan gente a la docencia.",
"It's a fair worry, and the design answers it.":
"Es una preocupación justa, y el diseño la responde.",
"About 40 people already do data work part of their week, in spreadsheets.":
"Unas 40 personas ya hacen trabajo con datos parte de su semana, en hojas de cálculo.",
"A partner's day is that same work, planned by the dean, and done with the team's tools and help.":
"El día de un referente es ese mismo trabajo, planificado por el decano, con las herramientas y la ayuda del equipo.",
"A good design still has to be argued for, as the king argued for his letters.":
"Un buen diseño igual hay que defenderlo, como el rey defendió sus letras.",
"How the work flows: six procedures, a page each. Ask, choose, build, release, fix, retire.":
"Cómo fluye el trabajo: seis procedimientos de una página. Pedir, elegir, construir, liberar, arreglar, retirar.",
"Each page names who asks, who decides, who builds and who checks, its steps, and what it leaves behind.":
"Cada página nombra quién pide, quién decide, quién construye y quién revisa, sus pasos, y lo que deja.",
"And each has its picture: the four roles, and how the work passes between them.":
"Y cada una tiene su imagen: los cuatro roles, y cómo pasa el trabajo entre ellos.",
"It all starts at one front door: one form, five questions.":
"Todo empieza en una puerta de entrada: un formulario, cinco preguntas.",
"What decision? By when? Who decides? What data do you use already? Who else needs it?":
"¿Qué decisión? ¿Para cuándo? ¿Quién decide? ¿Qué datos usas ya? ¿Quién más los necesita?",
"It opens on Monday 7 June.":
"Abre el lunes 7 de junio.",
"Behind it are governance's services too, each with its promise, as in A capability, not a project.":
"Detrás están también los servicios de gobernanza, cada uno con su promesa, como en Una capacidad, no un proyecto.",
"Before everyone uses them, one partner tries them.":
"Antes de que todos los usen, un referente los prueba.",
"Anil, in the Faculty of Health, kept his own spreadsheet because he couldn't wait.":
"Anil, de la Facultad de Salud, llevaba su propia hoja de cálculo porque no podía esperar.",
"Now he builds Health's report of casual teaching hours by the build page, from the one staff list.":
"Ahora arma el reporte de Salud de horas de docencia temporal con la página de construir, desde la única lista de personal.",
"Step four said: the team checks it.":
"El paso cuatro decía: el equipo lo revisa.",
"His change waited four working days: everyone thought someone else had it.":
"Su cambio esperó cuatro días hábiles: cada uno creía que otro lo tenía.",
"So step four now names one reviewer, from a rota, within two working days: never the person who built it.":
"Así que el paso cuatro ahora nombra a un revisor, por turnos, en dos días hábiles: nunca quien lo construyó.",
"Tried by one partner, fixed before everyone.":
"Los prueba un referente y se arreglan antes del resto.",
"Monday 5 April: the define milestone.":
"Lunes 5 de abril: el hito de definición.",
"The target in five layers, each with its picture; five principles; a small team and seven partners; six pages; one door.":
"La situación deseada en cinco capas, cada una con su imagen; cinco principios; un equipo chico y siete referentes; seis páginas; una puerta.",
"Every part fits on a page: a design simple enough to explain is simple enough to run.":
"Cada pieza cabe en una página: un diseño lo bastante simple para explicarlo lo es para operarlo.",
"In April, Anil becomes the first data partner.":
"En abril, Anil pasa a ser el primer referente de datos.",
"In 1446, the king's letters could be learned in a morning, so people used them, and wrote their own words.":
"En 1446, las letras del rey se podían aprender en una mañana, así que la gente las usó, y escribió sus propias palabras.",
"At the university, a design anyone can learn in a morning is one people use: to ask, to build, and to check.":
"En la universidad, un diseño que cualquiera aprende en una mañana es uno que se usa: para pedir, para construir y para revisar.",
"Next, the gaps between today and the target become a roadmap.":
"Luego, las brechas entre hoy y la situación deseada serán una hoja de ruta.",
"Start from the decision; design the fewest parts that serve it.":
"Parte de la decisión; diseña las menos piezas que le sirvan."
});
