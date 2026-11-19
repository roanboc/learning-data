/* The map behind the sketch: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The words on screen stay as they are. The captions use the site's terms: boceto, inscripción, periodo, carrera and clase for the sketch (as in A Sharper Sketch),
   capacidad, dominio de datos, dueño, responsable de datos, sistema de registro and glosario de negocio (as in the governance films), fecha de corte, oficina de registro
   (académico), periodo lectivo and oferta de unidad for the university's words, and la urdimbre y la trama for the Ming History's warp and weft.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"China, 1368. After years of war, a new dynasty, the Ming, rules from Nanjing.":
 "China, 1368. Tras años de guerra, una nueva dinastía, los Ming, gobierna desde Nanjing.",
"Every household owes the state grain from its fields, and work: carrying grain, building walls, mending roads.":
 "Cada hogar le debe al Estado grano de sus campos, y trabajo: cargar grano, levantar murallas, arreglar caminos.",
"But the old registers were lost in the war, and no tax had a fixed measure.":
 "Pero los viejos registros se perdieron en la guerra, y ningún impuesto tenía una medida fija.",
"In the rich province of Zhejiang, landowners wrote their fields under other households' names, to escape the work.":
 "En la rica provincia de Zhejiang, los terratenientes anotaban sus campos a nombre de otros hogares, para librarse del trabajo.",
"So the burden fell on the families who couldn't hide their land.":
 "Así, la carga caía sobre las familias que no podían esconder su tierra.",
"The court didn't need a bigger count. It needed to know whose each field was, and who lived in each house.":
 "La corte no necesitaba un conteo más grande. Necesitaba saber de quién era cada campo, y quién vivía en cada casa.",
"So, before counting anything, the court decided what it needed to know, and gave each thing a register of its own.":
 "Así que, antes de contar nada, la corte decidió qué necesitaba saber, y le dio a cada cosa su propio registro.",
"From 1381, households went into the Yellow Registers, in village units of a hundred and ten, led by ten of them in turn.":
 "Desde 1381, los hogares entraron en los Registros Amarillos, en unidades de aldea de ciento diez, guiadas por diez de ellos por turnos.",
"From 1387, land went into the fish-scale registers. Students of the Imperial Academy measured every field: its shape, its size, and its owner's name.":
 "Desde 1387, la tierra entró en los registros de escamas de pez. Estudiantes de la Academia Imperial midieron cada campo: su forma, su tamaño y el nombre de su dueño.",
"Drawn plot by plot, the fields looked like the scales of a fish.":
 "Dibujados parcela por parcela, los campos parecían las escamas de un pez.",
"Each had one job: the land register settled who held a field; the household register, what each family owed.":
 "Cada uno tenía una sola tarea: el registro de tierras fijaba quién tenía un campo; el de hogares, lo que debía cada familia.",
"The Ming History calls them the warp and the weft: threads that run two ways, and together make a cloth.":
 "La Historia de los Ming los llama la urdimbre y la trama: hilos que corren en dos sentidos, y juntos hacen una tela.",
"By 1393, the court could count its people again: ten and a half million households.":
 "Para 1393, la corte podía volver a contar a su gente: diez millones y medio de hogares.",
"And when a field was sold, its tax went with it, so no family paid for land it no longer held.":
 "Y cuando se vendía un campo, su impuesto se iba con él, así ninguna familia pagaba por tierra que ya no tenía.",
"A university has the same need, and so does every data model.":
 "Una universidad tiene la misma necesidad, y también todo modelo de datos.",
"The Inner Life of Data ended on a promise: what it means, and who decides, is the rest of the story.":
 "La vida interior de los datos terminó con una promesa: qué significa, y quién decide, es el resto de la historia.",
"On the way, we drew a sketch: a student, a class, an enrolment, a term and a course.":
 "En el camino, dibujamos un boceto: un estudiante, una clase, una inscripción, un periodo y una carrera.",
"Noor, the data architect, is about to make it the university's shared model.":
 "Noor, la arquitecta de datos, está por convertirlo en el modelo común de la universidad.",
"But first, each box needs a place: what it's for, who answers for it, where it's written, and what it means.":
 "Pero antes, cada caja necesita un lugar: para qué sirve, quién responde por ella, dónde se escribe y qué significa.",
"That's the university's map. The enterprise architecture films draw one for an energy company.":
 "Ese es el mapa de la universidad. Las películas de arquitectura empresarial dibujan uno para una empresa de energía.",
"The map starts with what the university does: its capabilities.":
 "El mapa empieza por lo que hace la universidad: sus capacidades.",
"Universities share a reference for them, HERM, the Higher Education Reference Models, so nobody starts from a blank page.":
 "Las universidades comparten una referencia para ellas, HERM, los Modelos de Referencia de Educación Superior, y nadie empieza de cero.",
"A capability says what, not how. Systems and teams change; the need to award a degree doesn't.":
 "Una capacidad dice qué, no cómo. Los sistemas y los equipos cambian; la necesidad de otorgar un título, no.",
"Open learning and teaching, and the sketch's boxes start to belong somewhere: awards and courses, learner records, graduation.":
 "Abre aprendizaje y enseñanza, y las cajas del boceto empiezan a tener un lugar: títulos y carreras, legajos de estudiantes, graduación.",
"Counting students on census date sits elsewhere: in planning, under strategy.":
 "Contar estudiantes en la fecha de corte está en otro lado: en planificación, bajo estrategia.",
"Next, what the university needs to know, in data domains: person, student, course, staff, finance, and a few more.":
 "Luego, lo que la universidad necesita saber, en dominios de datos: persona, estudiante, carrera, personal, finanzas y algunos más.",
"Each domain has one owner: the area that answers for its data.":
 "Cada dominio tiene un dueño: el área que responde por sus datos.",
"Student and course belong to Mei's registrar's office, with the faculties for courses. Staff is HR's. Organisation is Planning's.":
 "Estudiante y carrera son de la oficina de registro de Mei, con las facultades para las carreras. Personal, de RR. HH.; Organización, de Planificación.",
"The student and the enrolment fall into the student domain; the course, the class and the term, into the course domain.":
 "El estudiante y la inscripción caen en el dominio de estudiantes; la carrera, la clase y el periodo, en el de carreras.",
"An owner doesn't build anything. An owner decides what the words mean, and what good data looks like.":
 "Un dueño no construye nada. Un dueño decide qué significan las palabras, y cómo se ven los datos buenos.",
"Then, where each thing is first written: its system of record.":
 "Después, dónde se escribe primero cada cosa: su sistema de registro.",
"Students, enrolments and courses are written in the student system. HR and Finance keep their own.":
 "Estudiantes, inscripciones y carreras se escriben en el sistema de estudiantes. RR. HH. y Finanzas llevan los suyos.",
"The data platform holds copies, to read and to count. A copy is useful, but it never decides.":
 "La plataforma de datos guarda copias, para leer y contar. Una copia es útil, pero nunca decide.",
"When the two disagree, the record wins, and a mistake is fixed where it was written.":
 "Cuando no coinciden, gana el registro, y un error se corrige donde se escribió.",
"Last, what each word means: the business glossary. Each term has a definition, and an owner who decides it.":
 "Por último, qué significa cada palabra: el glosario de negocio. Cada término tiene una definición, y un dueño que la decide.",
"A term is decided there first, and the model copies it, word for word.":
 "Un término se decide primero allí, y el modelo lo copia, palabra por palabra.",
"Look up the sketch's words, and two of them aren't the university's.":
 "Busca las palabras del boceto, y dos de ellas no son de la universidad.",
"The registrar's office speaks of unit offerings, not classes: a unit taught in a semester, on campus, online or both.":
 "La oficina de registro habla de ofertas de unidad, no de clases: una unidad dictada en un semestre, presencial, en línea o ambas.",
"And of teaching periods, not terms, whose census date Planning counts by, for government.":
 "Y de periodos lectivos, no de periodos a secas: Planificación cuenta por su fecha de corte, para el gobierno.",
"Owners decide the words, stewards keep them written, and the data team builds from them.":
 "Los dueños deciden las palabras, los responsables de datos las escriben, y el equipo de datos construye con ellas.",
"Now cross the two maps, like warp and weft: what the university does, and what it needs to know.":
 "Ahora cruza los dos mapas, como la urdimbre y la trama: lo que hace la universidad, y lo que necesita saber.",
"Each crossing says who creates a thing, and who only reads it: learning and teaching creates enrolments; Planning reads them.":
 "Cada cruce dice quién crea una cosa, y quién solo la lee: aprendizaje y enseñanza crea las inscripciones; Planificación las lee.",
"One creator for each thing; as many readers as need it.":
 "Un creador para cada cosa; tantos lectores como la necesiten.",
"The sketch now hangs on the map. Each box has an owner, a home and a meaning.":
 "Ahora el boceto cuelga del mapa. Cada caja tiene un dueño, una casa y un significado.",
"All but two: the class, whose word isn't the university's, and the term, whose date two areas share.":
 "Todas menos dos: la clase, cuya palabra no es la de la universidad, y el periodo, cuya fecha comparten dos áreas.",
"And when a new question comes, the map says where the work starts.":
 "Y cuando llega una pregunta nueva, el mapa dice dónde empieza el trabajo.",
"A ticket names the question. The map finds its things, their owners and their records. The glossary gives the words.":
 "Un ticket nombra la pregunta. El mapa encuentra sus cosas, sus dueños y sus registros. El glosario da las palabras.",
"A contract fixes the shape, and only then is the model built, from what already exists.":
 "Un contrato fija la forma, y solo entonces se construye el modelo, a partir de lo que ya existe.",
"The two registers let the court settle a field and set a tax, because each had one job, and one keeper.":
 "Con los dos registros, la corte podía asignar un campo y fijar un impuesto, porque cada uno tenía una tarea y un guardián.",
"The university's map does the same for its data: when a number is wrong, everyone knows whose record to check.":
 "El mapa de la universidad hace lo mismo con sus datos: cuando un número está mal, todos saben qué registro revisar.",
"The map says where each box lives. It doesn't say the boxes are right. That's the next film.":
 "El mapa dice dónde vive cada caja. No dice que las cajas estén bien. Eso es la próxima película.",
"Map it before you model it.":
 "Primero el mapa, luego el modelo."
});
