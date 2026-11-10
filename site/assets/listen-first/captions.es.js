/* Listen first: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md has them: la gestora de datos, la situación actual and la situación deseada, el referente de datos (a data partner),
   de la solicitud al primer uso. TOGAF's baseline is la línea base, as its Spanish texts say it; ArchiMate's layers are capas, as El mapa antes de los datos
   says them; data governance is la gobernanza de datos, as the governance films say it. At the university, as the sister films have it: el vicerrector
   (the deputy vice-chancellor), la oficina de registro, Planificación, Recursos Humanos, Finanzas, Instalaciones, la Facultad de Salud, el antiguo almacén
   de datos, el gestor de incidencias (the tracker, as Where each piece lives says it), la lista de graduación and los diplomas (as Small, every week has
   them), un panel (a dashboard), el personal temporal (casual staff), la cola de los agentes, and Semana Santa for Easter. In Accra, 1933: Acra, la Costa
   de Oro, el pueblo ga, la pelagra, curanderos (healers), and kwashiorkor kept as the mothers' word. Quotes in « », as Spanish writes them. The films named
   keep their Spanish titles on the site: Pequeño, cada semana; El mapa antes de los datos and its film Hoy, y hacia dónde va; the module Liderar equipos de
   datos. Lean's genchi genbutsu is ir a ver, el lugar real y la cosa real. Tú, as Helena's three questions and the last lines speak, and ustedes (díganme)
   where she writes to everyone at once. Numbers keep the picture's comma (310,000), as the module's other Spanish captions do. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Accra, in the early 1930s, on the Gold Coast, then a British colony, now Ghana.":
"Acra, a comienzos de los años treinta, en la Costa de Oro, entonces una colonia británica, hoy Ghana.",
"Cicely Williams, a doctor from Jamaica, cares for the Ga people's children, with their mothers.":
"Cicely Williams, una médica de Jamaica, atiende a los niños del pueblo ga, junto con sus madres.",
"Children of one to four were falling sick: their hands and feet swelled, their skin peeled, and they wasted away.":
"Niños de uno a cuatro años enfermaban: se les hinchaban las manos y los pies, se les pelaba la piel y se consumían.",
"Unless it was treated early, it nearly always killed them.":
"Si no se trataba a tiempo, casi siempre los mataba.",
"Many doctors took it for pellagra, a disease of a missing vitamin; treated that way, children kept dying.":
"Muchos médicos la tomaban por pelagra, una enfermedad por falta de una vitamina; tratados así, los niños seguían muriendo.",
"Williams couldn't find it in any medical book.":
"Williams no la encontraba en ningún libro de medicina.",
"Something had to change.":
"Algo tenía que cambiar.",
"So she listened: to mothers and grandmothers, to nurses and healers.":
"Así que escuchó: a madres y abuelas, a enfermeras y curanderos.",
"For three years, nobody said its name in front of her: the word was feared.":
"Durante tres años, nadie dijo su nombre delante de ella: la palabra daba miedo.",
"Then the mothers told her: kwashiorkor.":
"Entonces las madres se lo dijeron: kwashiorkor.",
"In Ga, the disease of the displaced child: the one moved from the breast when the next baby comes.":
"En ga, la enfermedad del niño desplazado: el que es apartado del pecho cuando llega el siguiente bebé.",
"It came when that child ate little but maize.":
"Llegaba cuando ese niño comía poco más que maíz.",
"Williams described it in 1933, and two years later gave it the mothers' word.":
"Williams la describió en 1933, y dos años después le dio la palabra de las madres.",
"Three children she saw early were given milk, eggs and fruit, and each went home apparently cured.":
"A tres niños que vio a tiempo les dieron leche, huevos y fruta, y cada uno volvió a casa aparentemente curado.",
"Doctors everywhere still call it by the mothers' name.":
"Los médicos de todo el mundo aún la llaman con el nombre de las madres.",
"They once blamed too little protein; today they know it's more than that.":
"Antes culpaban a la falta de proteínas; hoy saben que es más que eso.",
"But the mothers had seen when it comes.":
"Pero las madres habían visto cuándo llega.",
"Data is the same: the people who live with a problem often know it best.":
"Con los datos pasa lo mismo: quienes viven con un problema suelen conocerlo mejor.",
"A year from now, at a university, a request for data takes 41 working days, on average, to be used, and nobody sees the whole picture.":
"Dentro de un año, en una universidad, una solicitud de datos tarda 41 días hábiles, en promedio, en usarse, y nadie ve el panorama completo.",
"Its new data manager listens first: 31 people, three questions, and what the systems count.":
"Su nueva gestora de datos primero escucha: 31 personas, tres preguntas y lo que cuentan los sistemas.",
"Six weeks on, everyone can see where things stand, in their own words, with seven ways to do better.":
"Seis semanas después, todos pueden ver cómo están las cosas, en sus propias palabras, con siete formas de mejorar.",
"February 2027. Helena Novak is the university's new data manager.":
"Febrero de 2027. Helena Novak es la nueva gestora de datos de la universidad.",
"Her plan for ninety days starts with six weeks of listening.":
"Su plan de noventa días empieza con seis semanas de escucha.",
"Thirty-one conversations, from the deputy vice-chancellor to each of her own team.":
"Treinta y una conversaciones, desde el vicerrector hasta cada persona de su propio equipo.",
"She asks everyone the same three questions.":
"A todos les hace las mismas tres preguntas.",
"What do you decide?":
"¿Qué decides?",
"What data do you trust?":
"¿En qué datos confías?",
"What slows you down?":
"¿Qué te frena?",
"Asked of everyone, the same questions give answers she can lay side by side.":
"Hechas a todos, las mismas preguntas dan respuestas que puede poner lado a lado.",
"She goes to where people work: the registrar's counter, Finance, Facilities.":
"Va a donde trabaja la gente: el mostrador de la oficina de registro, Finanzas, Instalaciones.",
"Lean thinking calls it go and see, genchi genbutsu: the real place, and the real thing.":
"El pensamiento lean lo llama ir a ver, genchi genbutsu: el lugar real, y la cosa real.",
"She writes down what she hears in people's own words, as Williams kept the mothers' word.":
"Anota lo que oye con las palabras de cada persona, como Williams conservó la palabra de las madres.",
"Clara, in Planning: “I ask for one number, and I get three.”":
"Clara, en Planificación: «Pido un número, y me dan tres».",
"Ingrid, in HR: “Our staff list is right. It's the copies.”":
"Ingrid, en Recursos Humanos: «Nuestra lista de personal está bien. Son las copias».",
"Anil, in the Faculty of Health: “I keep my own spreadsheet. I can't wait.”":
"Anil, en la Facultad de Salud: «Llevo mi propia hoja de cálculo. No puedo esperar».",
"Mei, at the registrar's office: “Our Thursday fifteen minutes works. Keep it.”":
"Mei, en la oficina de registro: «Nuestros quince minutos de los jueves funcionan. Que sigan».",
"Graham Ellis, in Facilities, emails for a dashboard of room use by Easter: it waits its turn with the rest.":
"Graham Ellis, de Instalaciones, pide por correo un panel del uso de aulas para Semana Santa: espera su turno con el resto.",
"The leading data people module follows that one request, in The question behind the request.":
"El módulo Liderar equipos de datos sigue esa solicitud, en La pregunta detrás del pedido.",
"Before proposing anything, she reads what's already written.":
"Antes de proponer nada, lee lo que ya está escrito.",
"The university's strategy to 2030 has four goals:":
"La estrategia de la universidad hasta 2030 tiene cuatro objetivos:",
"students who succeed, research that reaches people, a campus used well, and finances that last.":
"estudiantes que tienen éxito, investigación que llega a la gente, un campus bien usado y finanzas que duran.",
"The digital strategy serves it, and measures data quality, integration and satisfaction.":
"La estrategia digital está a su servicio, y mide la calidad de los datos, la integración y la satisfacción.",
"An earlier assessment found twelve decisions the university makes with data every year.":
"Una evaluación anterior encontró doce decisiones que la universidad toma con datos cada año.",
"The budget, casual staff, the timetable and rooms, which courses to offer, research reporting, and seven more.":
"El presupuesto, el personal temporal, el horario y las aulas, qué cursos ofrecer, los informes de investigación, y siete más.",
"Every answer she hears can now be tied to a decision, and every decision to a goal.":
"Ahora cada respuesta que oye puede vincularse a una decisión, y cada decisión a un objetivo.",
"People show where it hurts; the systems show how much.":
"Las personas muestran dónde duele; los sistemas, cuánto.",
"The tracker: for the requests closed in February, 41 working days, on average, from the ask to first use.":
"El gestor de incidencias: para las solicitudes cerradas en febrero, 41 días hábiles, en promedio, de la solicitud al primer uso.",
"The old warehouse's own logs: 38 reports, on the university's own servers since 2012.":
"Los propios registros del antiguo almacén de datos: 38 informes, en los servidores de la universidad desde 2012.",
"Seventeen haven't been opened in a year.":
"Diecisiete no se han abierto en un año.",
"The other 21 are used, by about 260 people.":
"Los otros 21 los usan unas 260 personas.",
"It costs 310,000 Australian dollars a year, and its licence ends on 31 December.":
"Cuesta 310,000 dólares australianos al año, y su licencia vence el 31 de diciembre.",
"Laid beside what people said, three findings stand out.":
"Puestos junto a lo que dijo la gente, destacan tres hallazgos.",
"Requests arrive in eleven ways, from two inboxes to the agents' queue.":
"Las solicitudes llegan por once vías, desde dos bandejas de entrada hasta la cola de los agentes.",
"The staff list lives in three copies: HR's, the warehouse's, and a faculty's spreadsheet.":
"La lista de personal vive en tres copias: la de Recursos Humanos, la del almacén y la hoja de cálculo de una facultad.",
"And about 40 people in faculties and offices do data work part of their week, mostly in spreadsheets.":
"Y unas 40 personas en facultades y oficinas trabajan con datos parte de su semana, sobre todo en hojas de cálculo.",
"One thing already works: since January 2026, the graduation list's team has met for fifteen minutes every Thursday.":
"Algo ya funciona: desde enero de 2026, el equipo de la lista de graduación se reúne quince minutos cada jueves.",
"Reprinted certificates fell from 41 to 3.":
"Los diplomas impresos de nuevo bajaron de 41 a 3.",
"The data quality module tells how.":
"El módulo de calidad de datos cuenta cómo.",
"Write down what works too, so nobody breaks it.":
"Anota también lo que funciona, para que nadie lo rompa.",
"Then she writes down what is: the current state, or, as TOGAF's method calls it, the baseline.":
"Luego escribe lo que hay: la situación actual, o, como la llama el método de TOGAF, la línea base.",
"She writes it in the five layers architects use, each a page, with its picture beside it.":
"La escribe en las cinco capas que usan los arquitectos, cada capa en una página, con su dibujo al lado.",
"Strategy: the four goals, and what the university must be able to do. Governing data works; delivering it is slow.":
"Estrategia: los cuatro objetivos, y lo que la universidad debe poder hacer. La gobernanza de datos funciona; entregarlos es lento.",
"Business: the twelve decisions, the services people can ask for, the processes, and who does what.":
"Negocio: las doce decisiones, los servicios que se pueden pedir, los procesos y quién hace qué.",
"Its ways of working too: eleven ways to ask, and 41 working days to first use.":
"También sus formas de trabajar: once vías para pedir, y 41 días hábiles hasta el primer uso.",
"Information: what the data is about, and where each piece is born.":
"Información: de qué tratan los datos, y dónde nace cada dato.",
"Staff are born in HR's system, then copied twice.":
"Los datos del personal nacen en Recursos Humanos, y se copian dos veces.",
"Application: the systems and reports, the old warehouse's 38 beside the platform's.":
"Aplicación: los sistemas y los informes, los 38 del antiguo almacén junto a los de la plataforma.",
"Technology: where they run, the university's own servers and the cloud.":
"Tecnología: dónde funcionan, los servidores propios de la universidad y la nube.",
"ArchiMate, the architects' notation, has no information layer:":
"ArchiMate, la notación de los arquitectos, no tiene capa de información:",
"it keeps what the data is about in its business layer, and the data itself in its application layer.":
"guarda de qué tratan los datos en su capa de negocio, y los datos mismos en su capa de aplicación.",
"Helena gives information a layer of its own, because data is her job.":
"Helena le da a la información una capa propia, porque los datos son su trabajo.",
"Noor puts each page on her map, ready for the target.":
"Noor pone cada página en su mapa, lista para la situación deseada.",
"The map before the data shows that map, in Today, and where it's going.":
"El mapa antes de los datos muestra ese mapa, en Hoy, y hacia dónde va.",
"Any finding could read as someone's fault.":
"Cualquier hallazgo podría leerse como la culpa de alguien.",
"So she writes each one as an opportunity.":
"Así que escribe cada uno como una oportunidad.",
"Not “requests get lost”, but one way to ask.":
"No «las solicitudes se pierden», sino una sola vía para pedir.",
"Not “faculties keep their own copies”, but data partners in faculties and offices.":
"No «las facultades guardan sus propias copias», sino referentes de datos en facultades y oficinas.",
"Seven opportunities in all: one way to ask; retire the old warehouse; an owner for every report and product;":
"Siete oportunidades en total: una sola vía para pedir; retirar el antiguo almacén; un responsable para cada informe y producto;",
"data partners; measure delivery; write down the critical procedures; and agents with mandates.":
"referentes de datos; medir la entrega; escribir los procedimientos críticos; y agentes con mandatos.",
"Monday, 15 March: the discovery milestone.":
"Lunes 15 de marzo: el hito del descubrimiento.",
"The current state in five layers, and seven opportunities.":
"La situación actual en cinco capas, y siete oportunidades.",
"She sends a summary back to everyone she spoke to: this is what I heard; tell me what I got wrong.":
"Envía un resumen a todas las personas con quienes habló: esto es lo que oí; díganme en qué me equivoqué.",
"A few write back, and the pages change.":
"Algunos responden, y las páginas cambian.",
"In Accra, the mothers knew their children's sickness, and when it came; Williams asked, and wrote it in their word.":
"En Acra, las madres conocían la enfermedad de sus hijos, y cuándo llegaba; Williams preguntó, y la escribió con su palabra.",
"At the university, the people who live with data knew too: in their words, the current state is one they recognise.":
"En la universidad, quienes viven con los datos también sabían: en sus palabras, la situación actual es una que reconocen.",
"Next, she designs the target with them.":
"Lo siguiente: diseña con ellos la situación deseada.",
"Ask people, count from the systems, and write down what is.":
"Pregunta a las personas, cuenta desde los sistemas y escribe lo que hay."
});
