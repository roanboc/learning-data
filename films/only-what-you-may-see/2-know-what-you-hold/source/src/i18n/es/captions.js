/* Know what you hold: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in Who may see it and the series: the classes are directa, seudónima, indirecta, especial and ninguna; the levels pública, interna, confidencial and restringida;
   la oficina de registro, Planificación, gobernanza de datos, el dueño, un número de estudiante, un código, un correo; the octagon is el octágono, as Chile calls its sellos.
   The film is Conoce lo que guardas. Numbers keep the picture's figures (2012, 2016, 13). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Chile, 2012.":
"Chile, 2012.",
"Every packet of food lists its numbers on the back: energy, sugars, fats, sodium, in grams per hundred.":
"Cada envase de comida trae sus cifras atrás: energía, azúcares, grasas, sodio, en gramos por cien.",
"In small print, in a busy shop, a parent can't tell which foods are loaded with sugar.":
"En letra chica, en una tienda llena, un padre o una madre no distingue qué alimentos están cargados de azúcar.",
"Is thirty-three grams a lot?":
"¿Treinta y tres gramos es mucho?",
"And about one child in four starting school is obese, at risk of diabetes and heart disease later.":
"Y cerca de uno de cada cuatro niños que empiezan la escuela es obeso, en riesgo de diabetes y de enfermedades del corazón.",
"Parents need a label they can read at a glance.":
"Los padres necesitan una etiqueta que puedan leer de un vistazo.",
"That year, Congress passes a law proposed by five senators, from left, centre and right.":
"Ese año, el Congreso aprueba una ley que propusieron cinco senadores, de izquierda, centro y derecha.",
"The Ministry of Health sets limits for sugars, sodium, saturated fats and calories.":
"El Ministerio de Salud fija límites para azúcares, sodio, grasas saturadas y calorías.",
"From June 2016, a food over a limit carries a black octagon on the front of its pack, the shape of a stop sign: high in sugars.":
"Desde junio de 2016, un alimento sobre un límite lleva un octágono negro al frente, con forma de señal de alto: alto en azúcares.",
"Its maker, who knows the recipe, puts it there.":
"Quien lo fabrica, que conoce la receta, lo pone ahí.",
"And no food with one may be sold in a school, or advertised to children.":
"Y ningún alimento con uno puede venderse en una escuela, ni anunciarse a los niños.",
"In the first year and a half, households bought about a quarter less of the drinks that carried one than expected.":
"En el primer año y medio, los hogares compraron cerca de un cuarto menos de lo esperado de las bebidas que lo llevaban.",
"Makers took sugar and sodium out of many foods, to lose the octagon.":
"Los fabricantes quitaron azúcar y sodio a muchos alimentos, para perder el octágono.",
"The numbers are still on the back. The front says which to be careful with.":
"Las cifras siguen atrás. El frente dice con cuáles tener cuidado.",
"A university's tables list every value too. What they need is the front.":
"Las tablas de una universidad también listan cada valor. Lo que les falta es el frente.",
"Tuesday, 13 October. Anil Kurian is studying how the Faculty of Health's learners progress.":
"Martes 13 de octubre. Anil Kurian estudia cómo avanzan los estudiantes de la Facultad de Salud.",
"Yesterday, Mei Tanaka, in the registrar's office, signed his agreement.":
"Ayer, Mei Tanaka, de la oficina de registro, firmó su acuerdo.",
"In plain words, his study may have each learner's course and results, their year of birth, and a code in place of who they are.":
"En palabras sencillas, su estudio puede tener curso y resultados de cada estudiante, su año de nacimiento y un código en vez de quién es.",
"Never anything that names a learner, or anything about their health.":
"Nunca nada que nombre a un estudiante, ni nada sobre su salud.",
"But the platform reads columns, not plain words.":
"Pero la plataforma lee columnas, no palabras sencillas.",
"Mei's register asks each column one question: does it identify a person?":
"El registro de Mei le hace a cada columna una pregunta: ¿identifica a una persona?",
"By itself, that's direct: name, email, student number. Only with a key kept elsewhere, pseudonymous. Not at all, none.":
"Por sí sola, es directa: nombre, correo, número de estudiante. Solo con una clave guardada aparte, seudónima. Para nada, ninguna.",
"Course and results: none. Date of birth and exam support name no one either: none.":
"Curso y resultados: ninguna. La fecha de nacimiento y el apoyo en exámenes tampoco nombran a nadie: ninguna.",
"So the study could have both. But the agreement allows only the year of birth, and nothing about health.":
"Así, el estudio podría tener las dos. Pero el acuerdo solo permite el año de nacimiento, y nada sobre la salud.",
"Mei takes it to Yusuf, in data governance, who keeps the list of classes.":
"Mei se lo lleva a Yusuf, de gobernanza de datos, que guarda la lista de clases.",
"He keeps those three, and adds two.":
"Él mantiene esas tres, y agrega dos.",
"Indirect: it names no one alone, but with other columns it can single out one person.":
"Indirecta: sola no nombra a nadie, pero con otras columnas puede señalar a una persona.",
"In a course of twelve learners, a birthday points to one.":
"En un curso de doce estudiantes, un cumpleaños señala a uno.",
"And special: it tells something that could harm a person if it got out, like health, disability or faith.":
"Y especial: dice algo que podría dañar a una persona si saliera a la luz, como su salud, una discapacidad o su fe.",
"Five classes, strictest first. Each column gets the strictest that applies.":
"Cinco clases, de la más estricta a la menos. Cada columna recibe la más estricta que le aplica.",
"Now the agreement's plain words have classes.":
"Ahora las palabras sencillas del acuerdo tienen clases.",
"Nothing that names a learner: direct. Nothing about their health: special.":
"Nada que nombre a un estudiante: directa. Nada sobre su salud: especial.",
"A code in place of who they are: pseudonymous. Their year of birth: indirect. Course and results: none.":
"Un código en lugar de quién es: seudónima. Su año de nacimiento: indirecta. Curso y resultados: ninguna.",
"Columns get classes. Each table gets a level: how much harm if the whole table got out. Its owner sets it.":
"Las columnas reciben clases. Cada tabla recibe un nivel: cuánto daño haría si saliera entera. Lo fija su dueño.",
"Public, like published totals. Internal, for the university's own people, like the timetable.":
"Pública, como los totales publicados. Interna, para la gente de la universidad, como el horario.",
"Confidential, for those with a reason, like the learner table. Restricted, for a named few.":
"Confidencial, para quien tiene un motivo, como la tabla de estudiantes. Restringida, para unos pocos con nombre.",
"Two floors come from the columns. A table with anything that points to a person is never public.":
"Dos mínimos vienen de las columnas. Una tabla con algo que señale a una persona nunca es pública.",
"A table with anything special is restricted.":
"Una tabla con algo especial es restringida.",
"Back to exam support. Its values name no illness: extra time, a separate room, a reader.":
"De vuelta al apoyo en exámenes. Sus valores no nombran ninguna enfermedad: más tiempo, una sala aparte, un lector.",
"But Mei knows why a learner has them: for a disability.":
"Pero Mei sabe por qué un estudiante los tiene: por una discapacidad.",
"So the column tells something about their health: special.":
"Así que la columna dice algo sobre su salud: especial.",
"A column's name doesn't say what it holds. Its owner does.":
"El nombre de una columna no dice lo que guarda. Su dueño sí.",
"And one special column would make the whole learner table restricted, too strict for the help desk and Planning, who read it every day.":
"Una columna especial haría restringida toda la tabla de estudiantes: demasiado para la mesa de ayuda y Planificación, que la usan a diario.",
"So exam support moves to a table of its own, the support table, restricted, for the few who arrange exams.":
"Así que el apoyo en exámenes pasa a una tabla propia, la tabla de apoyos, restringida, para los pocos que organizan los exámenes.",
"The learner table stays confidential.":
"La tabla de estudiantes sigue confidencial.",
"Who names each column? Its owner, once, at the source, where the data is born.":
"¿Quién nombra cada columna? Su dueño, una vez, en el origen, donde nacen los datos.",
"Like the octagon: the Ministry sets the limits, and the maker, who knows the recipe, puts it on.":
"Como el octágono: el Ministerio fija los límites, y quien fabrica, que conoce la receta, lo pone.",
"Data governance keeps the list of classes, and the owner picks one for each column.":
"Gobernanza de datos guarda la lista de clases, y el dueño elige una para cada columna.",
"A scan can suggest one: this looks like an email. Only Mei knows that exam support is about health.":
"Un escaneo puede sugerir una: esto parece un correo. Solo Mei sabe que el apoyo en exámenes es sobre salud.",
"And a new column with no class doesn't go through. It comes back with a question: what does it tell about a person?":
"Y una columna nueva sin clase no pasa. Vuelve con una pregunta: ¿qué dice sobre una persona?",
"From the source, each column carries its class into everything made from it. Nobody names it again.":
"Desde el origen, cada columna lleva su clase a todo lo que se hace con ella. Nadie la nombra otra vez.",
"Course and results reach Anil's study as they are: none.":
"Curso y resultados llegan al estudio de Anil tal como son: ninguna.",
"Two change on the way. The student number becomes a learner code, made with a key the registrar's office keeps.":
"Dos cambian en el camino. El número de estudiante se vuelve un código, hecho con una clave que guarda la oficina de registro.",
"The date of birth becomes the year.":
"La fecha de nacimiento se vuelve el año.",
"A step that changes what a column holds gets its new class from the owner.":
"Un paso que cambia lo que guarda una columna recibe su nueva clase del dueño.",
"Mei names the code pseudonymous, and the year indirect: with a course, it can still point to one.":
"Mei le da al código la clase seudónima, y al año, indirecta: con un curso, aún puede señalar a uno.",
"Exam support never reaches the study.":
"El apoyo en exámenes nunca llega al estudio.",
"And Anil's totals by course, any count under ten hidden, get a new class, none, in a public table.":
"Y los totales por curso de Anil, con todo conteo menor de diez oculto, reciben una clase nueva, ninguna, en una tabla pública.",
"The class goes wherever the column goes, as the octagon goes with the pack.":
"La clase va adonde va la columna, como el octágono va con el envase.",
"The octagon took no sugar out by itself.":
"El octágono no quitó azúcar por sí solo.",
"It named what each pack held, where everyone could see it, and families, schools and makers acted on it.":
"Nombró lo que guardaba cada envase, donde todos podían verlo, y familias, escuelas y fabricantes actuaron.",
"Mei's classes protect nothing by themselves either.":
"Las clases de Mei tampoco protegen nada por sí solas.",
"But now every column says what it tells about a person, and every table how careful to be, before anyone opens it.":
"Pero ahora cada columna dice lo que cuenta de una persona, y cada tabla cuánto cuidado pide, antes de que nadie la abra.",
"Which way to hide each class is the next question.":
"Cómo ocultar cada clase es la siguiente pregunta.",
"You can't protect what you haven't named.":
"No puedes proteger lo que no has nombrado."});
