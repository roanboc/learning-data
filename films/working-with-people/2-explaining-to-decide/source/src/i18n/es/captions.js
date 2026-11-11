/* Explaining so people can decide: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in
   src/narration.js) maps to its caption. Only the captions change: the picture, the voice and the timings stay English, so the site plays the
   same film, and the video, which has no captions on its picture, takes es.srt. The Spanish page loads this before the film; tools/captions.py
   (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md and the earlier films have them: el equipo, la gestora de datos, el director de Instalaciones, el Consejo
   Universitario (never "el consejo", which is the data council), un nuevo edificio de aulas, la oficina de registro académico, el horario, las
   reservas, un aula, los sensores, Planificación; the agreed question as Many hats, one picture says it (¿tenemos pocas aulas, o pocas a ciertas horas?). This
   film's own: el hombre promedio, los aviadores, la cabina, el rango (the range a design fits), la franja (the middle band), el mapa de calor,
   el pico (the peak), reservada and usada (booked and used), utilización (Mei's word), la página and la imagen (the page and its picture).
   Numbers and units as the screen shows them: 4,063 and 1,055, 5 pies y 9 pulgadas, A$140 millones, 38%, 93%. Tú, as the film speaks to the
   viewer (Empieza, Muestra, Di, Pruébala). Dates in words as Spanish says them (martes 1 de junio), and Semester 1 is el primer semestre. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 1950, the United States Air Force measured more than four thousand of its flyers: 132 measurements each.":
"En 1950, la Fuerza Aérea de los Estados Unidos midió a más de cuatro mil de sus aviadores: 132 medidas a cada uno.",
"The figures went to the people who designed what flyers wear and where they sit: suits, helmets, cockpits.":
"Las cifras fueron a quienes diseñaban lo que los aviadores visten y dónde se sientan: trajes, cascos, cabinas.",
"Many designers took one figure from them: the average man, about five foot nine.":
"Muchos diseñadores tomaron de ellas una sola cifra: el hombre promedio, de unos 5 pies y 9 pulgadas.",
"He seemed the easiest flyer to fit, and the commonest.":
"Parecía el aviador más fácil de acomodar, y el más común.",
"But a doorway built to his height would make about half the men stoop.":
"Pero una puerta hecha a su altura haría agacharse a cerca de la mitad de los hombres.",
"In a cockpit it's worse: a control just out of reach, or a pedal too far away, and a pilot can't fly safely.":
"En una cabina es peor: un mando fuera de alcance, o un pedal demasiado lejos, y un piloto no puede volar seguro.",
"Cockpits built for him were failing the men who actually flew.":
"Las cabinas hechas para él les fallaban a los hombres que de verdad volaban.",
"In 1952, Lieutenant Gilbert Daniels was a scientist in the Air Force's anthropology section.":
"En 1952, el teniente Gilbert Daniels era científico en la sección de antropología de la Fuerza Aérea.",
"He asked a plain question: how many flyers are average?":
"Hizo una pregunta sencilla: ¿cuántos aviadores son promedio?",
"He took ten measurements used to size clothing.":
"Tomó diez medidas usadas para las tallas de ropa.",
"On each, a man counted as average if he was in the middle thirty percent: a generous band.":
"En cada una, un hombre contaba como promedio si estaba en el treinta por ciento del medio: una franja generosa.",
"Of 4,063 men, 1,055 were average in height.":
"De 4,063 hombres, 1,055 eran promedio en estatura.",
"Of those, 302 were average in chest too.":
"De ellos, 302 eran promedio también en el pecho.",
"Each measurement left fewer: 143, 73, 28, 12, 6, 3, 2.":
"Cada medida dejaba menos: 143, 73, 28, 12, 6, 3, 2.",
"Average on all ten: not one.":
"Promedio en las diez: ni uno.",
"His note, seven pages long, said so in its first lines: it is virtually impossible to find an average man in the Air Force.":
"Su nota, de siete páginas, lo decía al empezar: es prácticamente imposible encontrar un hombre promedio en la Fuerza Aérea.",
"Then it showed what a design turns on: the range. From five foot five to six foot one fits nine flyers in ten.":
"Luego mostraba de qué depende un diseño: el rango. De 5 pies y 5 pulgadas a 6 pies y 1 caben nueve aviadores de cada diez.",
"Designers came to fit the range, not the average.":
"Los diseñadores pasaron a ajustarse al rango, no al promedio.",
"By the 1970s, the Air Force designed its cockpits for the middle ninety pilots in every hundred.":
"Para los años setenta, la Fuerza Aérea diseñaba sus cabinas para los noventa pilotos del medio de cada cien.",
"The seats rise and fall, and the pedals move.":
"Los asientos suben y bajan, y los pedales se mueven.",
"A car's seat slides for the same reason.":
"El asiento de un auto se corre por lo mismo.",
"Data has its average men too: one number that seems to describe everything, and describes almost nothing.":
"Los datos también tienen sus hombres promedio: un número que parece describirlo todo, y casi no describe nada.",
"Lead with the decision, show the part of the data it turns on, and the people who decide can see what they're choosing.":
"Empieza por la decisión, muestra la parte de los datos de la que depende, y quienes deciden verán lo que eligen.",
"At a university, a year from now, Graham Ellis is the Director of Facilities.":
"En una universidad, dentro de un año, Graham Ellis es el director de Instalaciones.",
"He must decide whether to ask the University Council for a new teaching building: forty rooms, about A$140 million.":
"Debe decidir si pedir al Consejo Universitario un nuevo edificio de aulas: cuarenta aulas, unos A$140 millones.",
"It was proposed because the rooms are always full.":
"Se propuso porque las aulas siempre están llenas.",
"In February, the data team agreed his question with him, in writing: do we have too few rooms, or too few at some hours?":
"En febrero, el equipo de datos acordó con él su pregunta, por escrito: ¿tenemos pocas aulas, o pocas a ciertas horas?",
"By late April, they had the answer: too few, only at some hours.":
"A fines de abril, tenían la respuesta: pocas, solo a ciertas horas.",
"Now he must put it to the University Council on one page, by Tuesday 1 June.":
"Ahora debe presentarla al Consejo Universitario en una página, para el martes 1 de junio.",
"Ivy Reyes, a data analyst, drafts it with Helena Novak, the data manager.":
"Ivy Reyes, analista de datos, la redacta con Helena Novak, la gestora de datos.",
"Her first draft runs to twelve pages, in the order the work was done: the data, the method, the checks, and on page nine, the answer.":
"Su primer borrador ocupa doce páginas, en el orden del trabajo: los datos, el método, las revisiones y, en la página nueve, la respuesta.",
"Its first chart is the week's average: rooms booked 38% of the time.":
"Su primer gráfico es el promedio de la semana: aulas reservadas el 38% del tiempo.",
"It's how a thesis is written, and nothing in it is wrong.":
"Así se escribe una tesis, y nada en él está mal.",
"Helena asks one question: who will read it, and what will they decide with it?":
"Helena hace una pregunta: ¿quién lo leerá, y qué decidirá con él?",
"The University Council's members read a pile of papers before each meeting, and decide on each.":
"Los miembros del Consejo Universitario leen una pila de documentos antes de cada reunión, y deciden sobre cada uno.",
"So the page starts where they start: with the decision.":
"Así que la página empieza donde ellos empiezan: con la decisión.",
"Barbara Minto called it the pyramid: the answer at the top, then the reasons, then the evidence under each.":
"Barbara Minto lo llamó la pirámide: la respuesta arriba, luego las razones, luego la evidencia bajo cada una.",
"Ivy's page opens with the decision: a new building now, or not yet?":
"La página de Ivy abre con la decisión: ¿un nuevo edificio ahora, o todavía no?",
"Then the answer to the agreed question, in one sentence: rooms are short only from ten to two, Tuesday to Thursday.":
"Luego la respuesta a la pregunta acordada, en una frase: faltan aulas solo de diez a dos, de martes a jueves.",
"Under it, three lines: the peak, the bookings nobody used, and what it would take not to build.":
"Debajo, tres líneas: el pico, las reservas que nadie usó, y qué haría falta para no construir.",
"The method and the other charts move to the back, for anyone who wants them.":
"El método y los otros gráficos pasan al final, para quien los quiera.",
"So does one true finding: when people came, rooms were about half full.":
"También un hallazgo cierto: cuando la gente vino, las aulas estaban a medio llenar.",
"The decision doesn't turn on it: a half-full room still holds a class.":
"La decisión no depende de él: un aula a medio llenar igual alberga una clase.",
"Now the chart. The week's average, 38%, hides what the decision turns on.":
"Ahora el gráfico. El promedio semanal, 38%, esconde de qué depende la decisión.",
"So Ivy draws the whole week: a heat map, the days down the side, the hours across, each hour as dark as the share of rooms booked.":
"Ivy dibuja la semana entera: un mapa de calor, los días al costado, las horas a lo ancho, cada hora tan oscura como sus aulas reservadas.",
"From ten to two, Tuesday to Thursday, 93% of rooms are booked. Most other hours, about one in five.":
"De diez a dos, de martes a jueves, se reserva el 93% de las aulas. Casi todas las otras horas, una de cada cinco.",
"The academics who said the rooms are always full were right, at the peak.":
"Los académicos que decían que las aulas siempre están llenas tenían razón, en el pico.",
"So were Facilities, who saw empty corridors on Monday mornings and Friday afternoons.":
"También Instalaciones, que veía pasillos vacíos los lunes por la mañana y los viernes por la tarde.",
"Like Daniels's count, one picture shows what the average hid.":
"Como el conteo de Daniels, una imagen muestra lo que el promedio escondía.",
"And booked isn't used: in one booked hour in five, the sensors counted nobody.":
"Y reservada no es usada: en una de cada cinco horas reservadas, los sensores no contaron a nadie.",
"Edward Tufte's advice for charts: above all else, show the data.":
"El consejo de Edward Tufte para los gráficos: ante todo, muestra los datos.",
"Cole Nussbaumer Knaflic's: know who you're showing, and the one thing they need to see.":
"El de Cole Nussbaumer Knaflic: sabe a quién se lo muestras, y lo único que necesita ver.",
"So Ivy draws the picture as she writes the page, never after: the page says what to decide, and the picture shows what it turns on.":
"Así que Ivy dibuja la imagen mientras escribe la página, nunca después: la página dice qué decidir, y la imagen, de qué depende.",
"Helena, who thinks like an architect, keeps the same rule for anything that crosses teams: its route, in one picture.":
"Helena, que piensa como arquitecta, sigue la misma regla para todo lo que cruza equipos: su recorrido, en una imagen.",
"Beside the picture, what it would take not to build: move about one peak class in six to other hours, and release booked rooms nobody uses.":
"Junto a la imagen, qué haría falta para no construir: pasar una de cada seis clases del pico a otras horas, y liberar reservas sin uso.",
"That meets Planning's forecast to 2030: six percent more students.":
"Eso cubre el pronóstico de Planificación a 2030: un 6% más de estudiantes.",
"What isn't known goes on the page too: how many students there will really be by 2030.":
"Lo que no se sabe también va en la página: cuántos estudiantes habrá en realidad para 2030.",
"So it says how far the answer holds: even if students grew twice as fast, the peak would be no fuller than it is today.":
"Así que dice hasta dónde vale la respuesta: aunque los estudiantes crecieran el doble de rápido, el pico no estaría más lleno que hoy.",
"Before it goes, Ivy tries it on Mei, from the registrar's office, who wasn't in the work.":
"Antes de enviarla, Ivy la prueba con Mei, de la oficina de registro académico, que no participó en el trabajo.",
"Mei reads it in two minutes, and says it back.":
"Mei la lee en dos minutos, y la explica con sus palabras.",
"She stops at one word: utilisation. To her, it means seats filled. On the page, it meant rooms booked.":
"Se detiene en una palabra: utilización. Para ella, son asientos ocupados. En la página, eran aulas reservadas.",
"So the page says booked and used instead, each with what it means, in a line.":
"Así que la página dice reservada y usada, cada una con lo que significa, en una línea.",
"Then she asks what the University Council will ask: which classes would move?":
"Luego pregunta lo que preguntará el Consejo Universitario: ¿qué clases se moverían?",
"The page answers: the registrar's office would plan it with the faculties, from Semester 1 2028.":
"La página responde: la oficina de registro académico lo planearía con las facultades, desde el primer semestre de 2028.",
"Everyone gets the same page, with the same numbers: the University Council, the faculties and the registrar's office.":
"Todos reciben la misma página, con los mismos números: el Consejo Universitario, las facultades y la oficina de registro académico.",
"On Tuesday 1 June, Graham sends the page under his own name, with the week's picture beside it.":
"El martes 1 de junio, Graham envía la página con su propio nombre, con la imagen de la semana al lado.",
"On Thursday 24 June, the University Council meets.":
"El jueves 24 de junio, se reúne el Consejo Universitario.",
"Its members ask how sure the growth is, and which classes would move: both answered on the page.":
"Sus miembros preguntan qué tan seguro es el crecimiento, y qué clases se moverían: la página responde ambas cosas.",
"They defer the building for two years, and ask for the timetable change from Semester 1 2028, with a review in June 2029.":
"Aplazan el edificio dos años, y piden el cambio de horario desde el primer semestre de 2028, con una revisión en junio de 2029.",
"Afterwards, Graham says the meeting argued about the choice, not about the numbers.":
"Después, Graham dice que en la reunión se discutió la elección, no los números.",
"The page didn't decide for them. It let them see what they were choosing.":
"La página no decidió por ellos. Les dejó ver lo que estaban eligiendo.",
"Daniels didn't design a cockpit. He counted, said plainly what the count meant, and left the design to the designers.":
"Daniels no diseñó una cabina. Contó, dijo con claridad lo que significaba el conteo, y dejó el diseño a los diseñadores.",
"Ivy's page did the same: the decision first, the peak beside the average, and the choice left to the people who make it.":
"La página de Ivy hizo lo mismo: la decisión primero, el pico junto al promedio, y la elección en manos de quienes la toman.",
"On Monday, start with the decision, then the answer, in one sentence.":
"El lunes, empieza por la decisión, y luego la respuesta, en una frase.",
"Show what it turns on, the peak and the spread, in a picture you draw as you write.":
"Muestra de qué depende, el pico y la dispersión, en una imagen que dibujas mientras escribes.",
"Say what you don't know, in your readers' words, with the same numbers for everyone.":
"Di lo que no sabes, con las palabras de tus lectores, y los mismos números para todos.",
"Try it on someone who wasn't in the work. Then let the people who decide, decide.":
"Pruébala con alguien que no estuvo en el trabajo. Luego deja que decidan quienes deciden.",
"Lead with the decision; show what it turns on.":
"Empieza por la decisión; muestra de qué depende."
});
