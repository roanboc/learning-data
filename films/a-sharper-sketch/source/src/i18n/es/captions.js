/* A Sharper Sketch: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"China, 1391. Ten years after the first Yellow Registers, the Ming court has them made again, as it will every ten years.":
 "China, 1391. Diez años después de los primeros Registros Amarillos, la corte Ming los manda hacer de nuevo, como hará cada diez años.",
"In ten years, a village changes: children are born, parents die, fields are bought and sold.":
 "En diez años, una aldea cambia: nacen niños, mueren padres, se compran y se venden campos.",
"But a new total can't show what changed. A household with less land might have sold a field, or hidden it under another name.":
 "Pero un total nuevo no muestra qué cambió. Un hogar con menos tierra pudo vender un campo, o esconderlo a nombre de otro.",
"And a hidden field's tax falls on the families who can't hide theirs.":
 "Y el impuesto del campo escondido cae sobre quienes no pueden esconder los suyos.",
"The court needed each number to show where it came from.":
 "La corte necesitaba que cada número mostrara de dónde venía.",
"So each household's entry has four columns: what it held ten years ago, what came in, what went out, and what it holds now.":
 "Así que la entrada de cada hogar tiene cuatro columnas: lo que tenía hace diez años, lo que entró, lo que salió y lo que tiene ahora.",
"The four must add up: a field that leaves one household's entry arrives in another's.":
 "Las cuatro deben cuadrar: un campo que sale de la entrada de un hogar llega a la de otro.",
"Each register is checked against the one before, and one that doesn't add up is sent back to be made again.":
 "Cada registro se coteja con el anterior, y uno que no cuadra se devuelve para hacerlo de nuevo.",
"So each number comes with its story: anyone can see what changed, and why.":
 "Así cada número trae su historia: cualquiera puede ver qué cambió, y por qué.",
"A data model has the same need: every number should say what it counts, and on which day.":
 "Un modelo de datos tiene la misma necesidad: cada número debe decir qué cuenta, y en qué día.",
"Our sketch of the university has a place on its map now: a student, a class, an enrolment, a term and a course.":
 "Nuestro boceto de la universidad ya tiene un lugar en su mapa: un estudiante, una clase, una inscripción, un periodo y una carrera.",
"But the map says where each box lives. It doesn't say the boxes are right.":
 "Pero el mapa dice dónde vive cada caja. No dice que las cajas estén bien.",
"It's an oversimplification: good enough to start, not good enough to count.":
 "Es una simplificación excesiva: basta para empezar, no para contar.",
"That's normal. Every model starts simple, and gets sharper when a real question needs it.":
 "Es normal. Todo modelo empieza sencillo, y gana precisión cuando una pregunta real lo necesita.",
"A few weeks after census date, the Head of School asks Genie a simple question.":
 "Semanas después de la fecha de corte, la dirección de la Escuela le pregunta algo simple a Genie.",
"How many students were enrolled in Data Science 101 on census date?":
 "¿Cuántos estudiantes estaban inscritos en Data Science 101 a la fecha de corte?",
"Genie says 131. The certified census report says 118.":
 "Genie dice 131. El reporte certificado de la fecha de corte dice 118.",
"Both come from clean data. Every test passed.":
 "Ambas cifras vienen de datos limpios. Todas las pruebas pasaron.",
"The difference isn't in the data. It's in the meaning.":
 "La diferencia no está en los datos. Está en el significado.",
"So before we change anything, we ask a wider question: how does this kind of business generally work?":
 "Así que, antes de cambiar nada, hacemos una pregunta más amplia: ¿cómo funciona, en general, este tipo de negocio?",
"In many industries, someone has already modelled it, and their model makes a good first template.":
 "En muchas industrias, alguien ya lo modeló, y su modelo es una buena primera plantilla.",
"Often there's more than one to choose from, so which one you pick, and why, matters too.":
 "A menudo hay más de uno para elegir, así que también importa cuál eliges, y por qué.",
"TCSI could be one of the choices: it's public, and it describes the data Australian universities report to government.":
 "TCSI podría ser una opción: es público, y describe los datos que las universidades australianas reportan al gobierno.",
"Many universities actually use MortarCAPS, the sector's own data standard. Here, we'll check our sketch against TCSI.":
 "En la práctica, muchas universidades usan MortarCAPS, el estándar de datos del propio sector. Aquí, compararemos nuestro boceto con TCSI.",
"It's a reference to check against, not a model to copy. We'll see where it fits our business, and where it doesn't.":
 "Es una referencia para comparar, no un modelo para copiar. Veremos dónde encaja con nuestro negocio, y dónde no.",
"First question: what is a class?":
 "Primera pregunta: ¿qué es una clase?",
"Lay the reference over our sketch, and it has no class at all. It has units of study, and enrolments in them.":
 "Pon la referencia sobre nuestro boceto: no tiene ninguna clase. Tiene unidades de estudio, e inscripciones en ellas.",
"Our one box was hiding three things.":
 "Nuestra única caja escondía tres cosas.",
"The unit: Data Science 101, the subject itself.":
 "La unidad: Data Science 101, la materia en sí.",
"The offering: that unit, in one teaching period, at one campus. This is what students enrol in.":
 "La oferta: esa unidad, en un periodo lectivo, en un campus. En esto se inscriben los estudiantes.",
"And the class: the Tuesday 9 am tutorial, a place in the timetable.":
 "Y la clase: la tutoría del martes a las 9, un lugar en el horario.",
"Genie counted places in tutorials, and some students sit in two.":
 "Genie contó lugares en tutorías, y algunos estudiantes asisten a dos.",
"So say exactly what one row stands for. That's called the grain.":
 "Así que di exactamente qué representa una fila. Eso se llama granularidad.",
"Next: where does the census date live?":
 "Siguiente: ¿dónde vive la fecha de corte?",
"Our sketch put it on the term: one date for everyone.":
 "Nuestro boceto la puso en el periodo: una fecha para todos.",
"The reference records it with each unit enrolment, because each unit of study has its own census date.":
 "La referencia la registra en cada inscripción a una unidad, porque cada unidad de estudio tiene su propia fecha de corte.",
"A summer intensive of Data Science 101 has a census date weeks away from the semester's.":
 "Un intensivo de verano de Data Science 101 tiene una fecha de corte a semanas de la del semestre.",
"Put each detail on the thing it truly describes. Here, we adopt the reference.":
 "Pon cada dato en la cosa que realmente describe. Aquí, adoptamos la referencia.",
"Now, two students appear twice in the count.":
 "Ahora, dos estudiantes se cuentan dos veces.",
"Each is studying a double degree: data science, and business.":
 "Cada uno estudia una doble titulación: ciencia de datos, y negocios.",
"Our sketch said a student belongs to one course. That's not how the university works.":
 "Nuestro boceto decía que un estudiante pertenece a una carrera. Así no funciona la universidad.",
"The reference already has the answer: a course admission. One student, in one course, from one start date.":
 "La referencia ya tiene la respuesta: una admisión a una carrera. Un estudiante, en una carrera, desde una fecha de inicio.",
"Each unit enrolment counts towards one course admission, so each student is counted once.":
 "Cada inscripción a una unidad cuenta para una admisión a una carrera, así que cada estudiante se cuenta una vez.",
"When two things connect many to many, the link often deserves its own box.":
 "Cuando dos cosas se conectan de muchos a muchos, el vínculo suele merecer su propia caja.",
"Last question: enrolled when?":
 "Última pregunta: ¿inscrito cuándo?",
"Genie counted today. The census report counted on census date.":
 "Genie contó hoy. El reporte de corte contó en la fecha de corte.",
"Enrolments change. A student is waitlisted, then enrolled, and later withdraws.":
 "Las inscripciones cambian. Un estudiante queda en lista de espera, luego se inscribe, y después se retira.",
"The reference keeps each enrolment's current status. We need its history, so we extend the model.":
 "La referencia guarda el estado actual de cada inscripción. Necesitamos su historial, así que extendemos el modelo.",
"Each change is kept with its date, and the census count becomes a snapshot of one day.":
 "Cada cambio se guarda con su fecha, y el conteo de corte se vuelve una foto de un día.",
"Like the four columns: what was there on census date, what came in, what went out, and what's there today.":
 "Como las cuatro columnas: lo que había en la fecha de corte, lo que entró, lo que salió y lo que hay hoy.",
"The sketch is sharper now. But it's still a sketch.":
 "El boceto es más preciso. Pero sigue siendo un boceto.",
"This is the conceptual model: the things that matter, and how they connect, agreed with the business.":
 "Este es el modelo conceptual: las cosas que importan, y cómo se conectan, acordado con el negocio.",
"Zoom in, and it becomes the logical model: what identifies each thing, its details, and how many of each.":
 "Acércate, y se vuelve el modelo lógico: qué identifica a cada cosa, sus datos, y cuántas hay de cada una.",
"Zoom in again, and it becomes the physical model: the actual tables in the platform.":
 "Acércate otra vez, y se vuelve el modelo físico: las tablas reales en la plataforma.",
"Same meaning, three levels of detail. The business owns the first, engineers own the last, and all three must agree.":
 "El mismo significado, tres niveles de detalle. El negocio es dueño del primero, los ingenieros del último, y los tres deben coincidir.",
"How to build those tables is a story for another film.":
 "Cómo construir esas tablas es tema de otra película.",
"Lift the reference away, and you can see the whole fit.":
 "Retira la referencia, y verás cómo encaja todo.",
"Check: before you invent something, look for it in a reference model.":
 "Revisar: antes de inventar algo, búscalo en un modelo de referencia.",
"Adopt: where it fits the business, use its ideas and its words.":
 "Adoptar: donde encaja con el negocio, usa sus ideas y sus palabras.",
"Extend: where the business needs more, add it, in the same style.":
 "Extender: donde el negocio necesita más, agrégalo, con el mismo estilo.",
"Record: write down every difference and why, so the next person knows what is standard and what is ours.":
 "Registrar: anota cada diferencia y su motivo, para que la próxima persona sepa qué es estándar y qué es nuestro.",
"A reference is a starting point, not a cage. Where the business is truly different, the business wins.":
 "Una referencia es un punto de partida, no una jaula. Donde el negocio es realmente distinto, gana el negocio.",
"The Head of School asks again.":
 "La dirección vuelve a preguntar.",
"This time, Genie asks back: enrolled on census date, in the Semester 1 offering?":
 "Esta vez, Genie repregunta: ¿inscritos a la fecha de corte, en la oferta del Semestre 1?",
"Then it answers: 118, and shows how it counted.":
 "Luego responde: 118, y muestra cómo contó.",
"The sketch has a new version, and a note that says why it changed.":
 "El boceto tiene una nueva versión, y una nota que dice por qué cambió.",
"It won't be the last. Models evolve: not often, but always.":
 "No será la última. Los modelos evolucionan: no a menudo, pero siempre.",
"The Yellow Registers didn't. Made every ten years, for taxes paid every year, they fell behind.":
 "Los Registros Amarillos, no. Hechos cada diez años, para impuestos que se pagaban cada año, se quedaron atrás.",
"By the late Ming, counties kept white registers, written each year, for the real work. The yellow ones became a formality.":
 "A fines de los Ming, los condados usaban registros blancos, hechos cada año, para el trabajo real. Los amarillos se volvieron un trámite.",
"A model that doesn't fit the business ends the same way: kept for show, while side copies do the work.":
 "Un modelo que no se ajusta al negocio termina igual: se guarda para mostrar, mientras copias aparte hacen el trabajo.",
"Check the reference. Fit it to the business.":
 "Revisa la referencia. Ajústala al negocio."
});
