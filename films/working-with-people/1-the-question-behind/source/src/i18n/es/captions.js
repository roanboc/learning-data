/* The question behind the request: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in
   src/narration.js) maps to its caption. Only the captions change: the picture, the voice and the timings stay English, so the site plays the
   same film, and the video, which has no captions on its picture, takes es.srt. The Spanish page loads this before the film; tools/captions.py
   (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md and the series' pages have them: el equipo, la gestora de datos (Helena), la arquitecta de datos (Noor),
   el director de Instalaciones (Graham), el Consejo Universitario (never "el consejo", which is the data council: so "on his advice" is "aconsejado
   por él"), el pedido (a request), el tablero (a dashboard), el informe (his paper), las aulas, el horario y sus reservas, los
   conteos de personas del sensor de cada aula, la hora pico, el promedio. In Pisa: el campanario, el comité internacional, la cimentación de
   prueba, los pesos de plomo, el lado norte, el ingeniero a cargo y su nota firmada. Humble inquiry is la indagación humilde, active listening
   la escucha activa; "used" is uso, as Graham's word. Graham is usted to Helena and Noor ("¿Qué decidirá con esto?"); the film speaks to the
   viewer as tú (pregunta, escucha, escribe). Dates as Spanish says them (jueves 11 de febrero de 2027), and Easter is Semana Santa. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Pisa, Italy. Its marble bell tower, begun in 1173, has leaned since it was being built, because the ground beneath it is soft.":
"Pisa, Italia. Su campanario de mármol, empezado en 1173, se inclina desde que lo construían, porque el suelo bajo él es blando.",
"By 1990, its top hangs about four and a half metres out past its base, and each year it leans a little further.":
"En 1990, su cima sobresale unos cuatro metros y medio más allá de su base, y cada año se inclina un poco más.",
"In March 1989, a medieval tower in another Italian city, Pavia, had suddenly collapsed, killing four people.":
"En marzo de 1989, en otra ciudad italiana, Pavía, una torre medieval se había derrumbado de repente: murieron cuatro personas.",
"In January 1990, Pisa's tower was closed to visitors, for fear it could fall too.":
"En enero de 1990, la torre de Pisa se cerró a los visitantes, por miedo a que también cayera.",
"Its stone was fragile: a fall could kill anyone near it, and take from the city the tower people cross the world to see.":
"Su piedra era frágil: una caída podía matar a quien estuviera cerca, y quitarle a la ciudad la torre que la gente cruza el mundo para ver.",
"And any work was a risk: the slightest disturbance to the ground on its leaning side could bring it down.":
"Y cualquier obra era un riesgo: la menor alteración del suelo del lado inclinado podía derribarla.",
"Something had to change, without the work itself toppling it.":
"Algo tenía que cambiar, sin que la propia obra la derribara.",
"That spring, Italy's government appointed an international committee: engineers, architects and experts in old monuments.":
"Esa primavera, el gobierno de Italia nombró un comité internacional: ingenieros, arquitectos y expertos en monumentos antiguos.",
"Before choosing how, they agreed what saving it would mean: a small change, about half a degree, too little for anyone to see.":
"Antes de elegir cómo, acordaron qué sería salvarla: un cambio pequeño, de cerca de medio grado, demasiado poco para que alguien lo viera.",
"But enough to ease the strain on its stone, and steady the ground beneath it.":
"Pero suficiente para aliviar la tensión de su piedra y asentar el suelo bajo ella.",
"Their method: draw a little soil from under the high, north side, so the tower would settle back towards it.":
"Su método: sacar un poco de tierra de debajo del lado alto, el norte, para que la torre se asentara de vuelta hacia él.",
"They tried it first on a test footing, while lead weights on the north side held the tower still.":
"Primero lo probaron en una cimentación de prueba, mientras pesos de plomo en el lado norte mantenían quieta la torre.",
"From February 1999, they did it under the tower itself, a little at a time, and it began to lean back.":
"Desde febrero de 1999 lo hicieron bajo la propia torre, de a poco, y empezó a enderezarse.",
"Every day, the engineer in charge signed a note: how the tower had moved, and exactly what to take out next.":
"Cada día, el ingeniero a cargo firmaba una nota: cómo se había movido la torre, y exactamente qué sacar después.",
"By the summer of 2001, its top had come back about 45 centimetres, to the lean it had in the early 1800s.":
"Para el verano de 2001, su cima había vuelto unos 45 centímetros, a la inclinación que tenía a principios del siglo XIX.",
"In December 2001, it reopened to visitors, still leaning, as it always has.":
"En diciembre de 2001 reabrió a los visitantes, todavía inclinada, como siempre.",
"Its engineers expect at least two hundred years before it leans as far again.":
"Sus ingenieros calculan al menos doscientos años antes de que vuelva a inclinarse tanto.",
"At a university, a request for a dashboard hid a decision worth about A$140 million.":
"En una universidad, el pedido de un tablero escondía una decisión de unos A$140 millones.",
"Half an hour of listening found it, and one page, agreed in writing, turned it into a question the team could answer.":
"Media hora de escuchar la encontró, y una página, acordada por escrito, la volvió una pregunta que el equipo podía responder.",
"These three films are about working with the people who ask for data.":
"Estas tres películas tratan de trabajar con las personas que piden datos.",
"Thursday 11 February 2027: Graham Ellis, new this year as Director of Facilities, emails the data team.":
"Jueves 11 de febrero de 2027: Graham Ellis, nuevo este año como director de Instalaciones, escribe al equipo de datos.",
"“Could I have a dashboard of room use, by Easter?”":
"“¿Podría tener un tablero del uso de las aulas para Semana Santa?”",
"It sounds clear: a thing, and a date.":
"Suena claro: una cosa, y una fecha.",
"But a request usually names someone's guess at a solution. What it's for, it doesn't say.":
"Pero un pedido suele nombrar lo que alguien supone que es la solución. Para qué es, no lo dice.",
"Build exactly what was asked, and a team can deliver on time and still help nobody.":
"Si hace exactamente lo pedido, un equipo puede entregar a tiempo y aun así no ayudar a nadie.",
"So Helena Novak, the data manager, asks Graham for half an hour, with Noor, the team's data architect.":
"Así que Helena Novak, la gestora de datos, le pide a Graham media hora, con Noor, la arquitecta de datos del equipo.",
"Tuesday 16 February, in Graham's office. They ask a few open questions, then mostly listen.":
"Martes 16 de febrero, en la oficina de Graham. Hacen unas pocas preguntas abiertas, y sobre todo escuchan.",
"What will you decide with it? Whether to ask the University Council for a new teaching building: forty rooms, about A$140 million.":
"¿Qué decidirá con esto? Si pedir al Consejo Universitario un nuevo edificio de aulas: cuarenta aulas, unos A$140 millones.",
"By when? His paper is due on 1 June, and the University Council decides on 24 June. Easter was a guess at a safe date.":
"¿Para cuándo? Su informe vence el 1 de junio, y el Consejo Universitario decide el 24 de junio. Semana Santa fue una fecha segura, a ojo.",
"Who else decides? The University Council, on his advice. And the academics will read it closely: they say the rooms are always full.":
"¿Quién más decide? El Consejo Universitario, aconsejado por él. Los académicos lo leerán con lupa: dicen que las aulas siempre están llenas.",
"What do you already trust? What he has seen on his walks: empty corridors on Monday mornings and Friday afternoons.":
"¿En qué confía ya? En lo que ha visto en sus recorridos: pasillos vacíos los lunes por la mañana y los viernes por la tarde.",
"What would change your mind? If rooms are short at every hour, he'll ask to build. If only at some hours, perhaps not.":
"¿Qué le haría cambiar de opinión? Si faltan aulas a todas horas, pedirá construir. Si solo a algunas horas, quizá no.",
"Edgar Schein called this humble inquiry: asking what you don't already know, out of real interest in the other person.":
"Edgar Schein lo llamó indagación humilde: preguntar lo que aún no sabes, por interés real en la otra persona.",
"Carl Rogers and Richard Farson called the other half active listening: hearing the whole meaning, then saying it back.":
"Carl Rogers y Richard Farson llamaron a la otra mitad escucha activa: oír todo el significado, y luego repetirlo.",
"Some teams ask “why?” five times over. Asked bluntly, it can sound like doubt; “what will you decide with it?” gets there kindly.":
"Algunos equipos preguntan “¿por qué?” cinco veces. Dicho sin tacto, suena a duda; “¿qué decidirá con esto?” llega ahí con amabilidad.",
"Near the end, Helena says back what she heard: a decision about a building, and a question about how the rooms are used.":
"Cerca del final, Helena repite lo que oyó: una decisión sobre un edificio, y una pregunta sobre cómo se usan las aulas.",
"In Pisa, saving meant half a degree, not a straight tower. Here, use means people in the room, not bookings.":
"En Pisa, salvarla era medio grado, no una torre recta. Aquí, uso significa personas en el aula, no reservas.",
"Graham stops her at one word: by “used”, he means people in the room. A booking isn't use.":
"Graham la detiene en una palabra: con “uso”, él quiere decir personas en el aula. Una reserva no es uso.",
"That one word decides the data: the timetable's bookings, beside the head counts from each room's sensor.":
"Esa sola palabra decide los datos: las reservas del horario, junto a los conteos de personas del sensor de cada aula.",
"Then Noor writes the question down with him, on one page.":
"Luego Noor escribe la pregunta con él, en una página.",
"“Do we have too few rooms, or too few at some hours?”":
"“¿Tenemos muy pocas aulas, o muy pocas a algunas horas?”",
"Under it go the decision, the dates, who decides, what would change his mind, and what “used” means.":
"Debajo van la decisión, las fechas, quién decide, qué le haría cambiar de opinión, y qué significa “uso”.",
"His own words stay at the top, beside the question, so anyone can see how one became the other.":
"Sus propias palabras quedan arriba, junto a la pregunta, para que cualquiera vea cómo una se volvió la otra.",
"That afternoon, Graham replies to the page: “Yes, that's it.”":
"Esa tarde, Graham responde a la página: “Sí, es eso.”",
"Then the request waits its turn, like every other, until the team takes it up on Tuesday 30 March.":
"Luego el pedido espera su turno, como todos, hasta que el equipo lo retoma el martes 30 de marzo.",
"In March, Ivy Reyes, a new graduate analyst, follows that question through the team's work, starting from the page.":
"En marzo, Ivy Reyes, una analista recién graduada, sigue esa pregunta por el trabajo del equipo, a partir de la página.",
"On 30 March, the team starts from the same page, and by 23 April it has an answer.":
"El 30 de marzo, el equipo empieza desde la misma página, y para el 23 de abril tiene una respuesta.",
"Across the whole week, the rooms are booked only 38% of the time.":
"En toda la semana, las aulas están reservadas solo el 38% del tiempo.",
"But between 10:00 and 14:00, Tuesday to Thursday, 93% of them are booked.":
"Pero entre las 10:00 y las 14:00, de martes a jueves, el 93% están reservadas.",
"And one booked hour in five, the sensors counted nobody there.":
"Y en una de cada cinco horas reservadas, los sensores no contaron a nadie.",
"So the answer to his question: not too few rooms, but too few at some hours.":
"Así que la respuesta a su pregunta: no muy pocas aulas, sino muy pocas a algunas horas.",
"The academics were right about the peak, and Graham about Monday mornings: the week's average had hidden both.":
"Los académicos tenían razón sobre la hora pico, y Graham sobre los lunes por la mañana: el promedio de la semana escondía ambas cosas.",
"A dashboard by Easter might have shown that average, and settled nothing.":
"Un tablero para Semana Santa quizá habría mostrado ese promedio, y no habría resuelto nada.",
"Instead, he had an answer to the question his decision turned on, weeks before his paper was due.":
"En cambio, tuvo una respuesta a la pregunta de la que dependía su decisión, semanas antes de entregar su informe.",
"In Pisa, the committee didn't start by digging. It first agreed what saving the tower would mean.":
"En Pisa, el comité no empezó cavando. Primero acordó qué sería salvar la torre.",
"Then every day, a signed note said how it had moved, and what to do next.":
"Luego, cada día, una nota firmada decía cómo se había movido, y qué hacer después.",
"Graham's request got the same care: the decision found, the question agreed in writing, and an answer in time.":
"El pedido de Graham tuvo el mismo cuidado: la decisión encontrada, la pregunta acordada por escrito, y una respuesta a tiempo.",
"From June, the team's front door, a form, asks five questions like these. A form can ask; listening hears what the answers mean.":
"Desde junio, la puerta de entrada del equipo, un formulario, hace cinco preguntas así. Un formulario pregunta; escuchar oye qué significan.",
"On Monday, when someone asks you for a report or a dashboard, ask what they'll decide with it, and by when.":
"El lunes, cuando alguien te pida un informe o un tablero, pregunta qué va a decidir con eso, y para cuándo.",
"Ask who else decides, what they already trust, and what would change their mind.":
"Pregunta quién más decide, en qué confía ya, y qué le haría cambiar de opinión.",
"Listen more than you talk, and say back what you heard.":
"Escucha más de lo que hablas, y repite lo que oíste.",
"Then write the question down beside their words, and agree it with them.":
"Luego escribe la pregunta junto a sus palabras, y acuérdala con esa persona.",
"Ask what it's for, and agree it in writing.":
"Pregunta para qué es, y acuérdalo por escrito."
});
