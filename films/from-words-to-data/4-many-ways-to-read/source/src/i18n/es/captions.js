/* Many ways to read: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"For most of the twentieth century, a library's card catalogue filed each book three times: under its author, its title and its subject.":
"Durante casi todo el siglo XX, el fichero de una biblioteca archivaba cada libro tres veces: por autor, por título y por tema.",
"One book on the shelf. Three ways in.":
"Un libro en el estante. Tres caminos.",
"Every card had to be kept in step with the book, or readers went to the wrong shelf.":
"Cada ficha debía mantenerse al día con el libro, o los lectores iban al estante equivocado.",
"Data for reading works the same way: copies arranged for the questions people ask.":
"Los datos para leer funcionan igual: copias ordenadas para las preguntas que hace la gente.",
"Ask four data engineers how to shape data for reading, and you may get four answers: a normalised core, a data vault, a star, or one wide table.":
"Pregunta a cuatro ingenieros de datos qué forma usar para leer, y quizá oigas cuatro respuestas: un núcleo normalizado, un data vault, una estrella o una sola tabla ancha.",
"The arguments have names: Inmon's integrated core, Kimball's stars, Linstedt's data vault, and one big table.":
"Cada postura tiene nombre: el núcleo integrado de Inmon, las estrellas de Kimball, el data vault de Linstedt y una sola gran tabla.",
"This week, there's a new source to add: credentials from the short-course platform.":
"Esta semana hay una fuente nueva que agregar: credenciales de la plataforma de cursos cortos.",
"There's no best shape. There's a best shape for each job.":
"No existe la mejor forma. Existe la mejor forma para cada trabajo.",
"The first job is to bring many sources together, under one meaning.":
"El primer trabajo es reunir muchas fuentes, bajo un mismo significado.",
"One way is a normalised core: a shape built to write, but for the whole university.":
"Una manera es un núcleo normalizado: una forma hecha para escribir, pero para toda la universidad.",
"Another is a data vault. Hubs hold the business keys, the things that identify a learner or a credential. Links hold the relationships between them.":
"Otra es un data vault. Los hubs guardan las claves de negocio, lo que identifica a un aprendiz o una credencial. Los links guardan las relaciones entre ellos.",
"Satellites hold the descriptions, and every change to them, with the source and the time each change arrived.":
"Los satélites guardan las descripciones, y todos sus cambios, con la fuente y la hora en que llegó cada uno.",
"A new source just adds new satellites. Nothing that exists has to change.":
"Una fuente nueva solo agrega satélites nuevos. Nada de lo que existe tiene que cambiar.",
"It's built for change, and for audit. It isn't built for people to query.":
"Está hecho para el cambio y la auditoría. No para que la gente lo consulte.",
"For people, there's the star: one for awards, one for enrolments, one for fees.":
"Para las personas, está la estrella: una de credenciales otorgadas, una de inscripciones, una de cuotas.",
"They share the same learner and the same calendar, so one question can cross them: awards and fees, for the same learners, in the same year.":
"Comparten el mismo aprendiz y el mismo calendario, así que una pregunta puede cruzarlas: credenciales y cuotas, de los mismos aprendices, en el mismo año.",
"These shared dimensions are called conformed. They make the stars agree with each other.":
"Estas dimensiones compartidas se llaman conformadas. Hacen que las estrellas coincidan.",
"Engineers plan them on a grid called a bus matrix: the business processes down the side, the shared dimensions across the top.":
"Los ingenieros las planean en una cuadrícula llamada matriz de bus: procesos de negocio en las filas, dimensiones compartidas en las columnas.",
"Some questions are always about one thing: one learner.":
"Algunas preguntas siempre tratan de una sola cosa: un aprendiz.",
"So build one wide row per learner: their current course, their credit so far, every credential, and what's next.":
"Así que arma una fila ancha por aprendiz: su curso actual, sus créditos hasta hoy, cada credencial y lo que sigue.",
"It's easy for people, for machine learning and for AI assistants. Most questions become a single lookup.":
"Es fácil para personas, aprendizaje automático y asistentes de IA. La mayoría de las preguntas se reducen a una búsqueda.",
"Which learners are close to a graduate certificate? With a wide table, that's one filter, not five joins.":
"¿Qué aprendices están cerca de un diplomado de posgrado? Con una tabla ancha, es un filtro, no cinco uniones.",
"The cost: many columns to maintain, and the same measure defined twice, unless you're careful.":
"El costo: muchas columnas que mantener, y la misma medida definida dos veces, si no tienes cuidado.",
"On the platform from The Inner Life of Data, each shape has its place.":
"En la plataforma de La vida interior de los datos, cada forma tiene su lugar.",
"Silver integrates, in a normalised core or a vault.":
"Plata integra, en un núcleo normalizado o en un vault.",
"Gold presents stars for people, and serves wide tables to tools.":
"Oro presenta estrellas a las personas, y sirve tablas anchas a las herramientas.",
"And a semantic layer can sit on top, so every tool asks for the same definitions.":
"Y encima puede ir una capa semántica, para que cada herramienta pida las mismas definiciones.",
"Many sources that keep changing, and auditors who ask where each value came from: a vault.":
"Muchas fuentes que no dejan de cambiar, y auditores que preguntan de dónde vino cada valor: un vault.",
"Many processes that share the same context: conformed stars.":
"Muchos procesos que comparten el mismo contexto: estrellas conformadas.",
"One entity, asked about in many ways, by people and by AI: wide tables.":
"Una entidad, consultada de muchas formas, por personas y por IA: tablas anchas.",
"And don't copy for its own sake. Every shape is another copy to keep in step, like the library's cards.":
"Y no copies por copiar. Cada forma es otra copia que mantener al día, como las fichas de la biblioteca.",
"Choose per question, not per fashion. Most platforms use more than one.":
"Elige según la pregunta, no según la moda. La mayoría de las plataformas usa más de una.",
"The short-course credentials arrived this week. The vault took them without changing a thing.":
"Las credenciales de cursos cortos llegaron esta semana. El vault las recibió sin cambiar nada.",
"The award star gained new rows, and each learner's wide row gained a column.":
"La estrella de credenciales sumó filas, y la fila ancha de cada aprendiz, una columna.",
"Next: what if the app and the analysts used the same database?":
"Siguiente: ¿y si la app y los analistas usaran la misma base de datos?"
});
