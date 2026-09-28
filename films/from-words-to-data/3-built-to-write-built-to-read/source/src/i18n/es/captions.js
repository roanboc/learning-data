/* Built to write, built to read: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 1494, Luca Pacioli set down how Venetian merchants kept their books.":
"En 1494, Luca Pacioli describió cómo llevaban sus libros los mercaderes venecianos.",
"Every transaction was written into the journal, as it happened, one after another.":
"Cada operación se anotaba en el diario, cuando ocurría, una tras otra.",
"Then each entry was posted to the ledger, grouped by account, where it could be read, and balanced.":
"Después cada asiento se pasaba al libro mayor, agrupado por cuenta, donde se podía leer y cuadrar.",
"One set of facts, kept in two shapes: one for writing, and one for reading. And if the two sides didn't balance, something was wrong.":
"Un conjunto de hechos, guardado en dos formas: una para escribir y otra para leer. Y si los dos lados no cuadraban, algo andaba mal.",
"Five centuries later, the university has the same two jobs. On graduation day, thousands of awards are issued, each one complete and right. On planning day, someone reads ten years of them at once.":
"Cinco siglos después, la universidad tiene los mismos dos trabajos. El día de graduación se otorgan miles de títulos, cada uno completo y correcto. El día de planificación, alguien lee diez años de títulos a la vez.",
"A shape built to write keeps each fact in one place. The learner's name is stored once, not on every award.":
"Una forma hecha para escribir guarda cada dato en un solo lugar. El nombre del aprendiz se guarda una vez, no en cada título.",
"Every row has a key that identifies it, and rules the data must meet: every award belongs to a learner who exists.":
"Cada fila tiene una clave que la identifica, y reglas que los datos deben cumplir: cada título pertenece a un aprendiz que existe.",
"And issuing an award touches three things at once: the award, the learner's record, and the transcript. All three change, or none of them do. Half an award is never saved.":
"Y otorgar un título toca tres cosas a la vez: el título, el registro del aprendiz y el certificado analítico. Cambian las tres, o ninguna. Nunca se guarda medio título.",
"This is normalisation, with keys, constraints and transactions.":
"Esto es la normalización, con claves, restricciones y transacciones.",
"Store the learner's name on every award instead, and it lives in three places.":
"Si en cambio guardas el nombre del aprendiz en cada título, vive en tres lugares.",
"She changes her name. Two copies are corrected. One is missed.":
"Se cambia el nombre. Se corrigen dos copias. Una se pasa por alto.",
"Her next certificate prints the old name.":
"Su próximo certificado sale con el nombre viejo.",
"And if the only place a course is described is on its awards, deleting the last award deletes the course.":
"Y si el único lugar donde se describe un curso son sus títulos, borrar el último título borra el curso.",
"These are called update and delete anomalies. Keeping each fact once is how a shape built to write avoids them.":
"Se llaman anomalías de actualización y de borrado. Una forma hecha para escribir las evita guardando cada dato una sola vez.",
"Some systems write a whole thing at once, as one document: a digital credential, with its claim and its evidence inside, signed as a single piece.":
"Algunos sistemas escriben algo completo de una vez, como un documento: una credencial digital, con su afirmación y su evidencia dentro, firmada como una sola pieza.",
"Keep together what's written, and signed, together.":
"Mantén junto lo que se escribe, y se firma, junto.",
"Document databases are built for this. They shine when a whole thing is written, and read, at once.":
"Para eso están las bases de datos de documentos. Brillan cuando algo completo se escribe, y se lee, de una vez.",
"One document is easy to write and easy to check. Counting across a million of them is harder.":
"Un documento es fácil de escribir y de verificar. Contar sobre un millón de ellos es más difícil.",
"Planning day. How many awards, by faculty and by year, for the last ten years?":
"Día de planificación. ¿Cuántos títulos, por facultad y por año, en los últimos diez años?",
"A shape built to read starts with the grain: one row per credential awarded.":
"Una forma hecha para leer empieza con el grano: una fila por credencial otorgada.",
"The numbers to add up sit in the middle: the award itself, and its credit points.":
"Las cifras que se suman van en el centro: el título en sí, y sus créditos.",
"Around them sits everything you'd filter or group by: the learner, the kind of credential, the faculty, the date.":
"Alrededor, todo aquello por lo que filtrarías o agruparías: el aprendiz, el tipo de credencial, la facultad, la fecha.",
"A simple test: the facts are what you add up; the dimensions are the words after by, in the question.":
"Una prueba simple: los hechos son lo que sumas; las dimensiones, las palabras que van después de «por» en la pregunta.",
"It's called a star. Reading it takes two steps, not seven.":
"Se llama estrella. Leerla requiere dos pasos, no siete.",
"A learner moved faculty in the middle of the year. Do her awards count for the old faculty, or the new?":
"Una aprendiz cambió de facultad a mitad de año. ¿Sus títulos cuentan para la facultad anterior, o para la nueva?",
"Keep both, each with the dates it was true. Awards before the move count for the old faculty, and after it, for the new.":
"Guarda ambas, cada una con las fechas en que fue cierta. Antes del cambio, los títulos cuentan para la anterior; después, para la nueva.",
"An award that's revoked and reissued keeps its history too. Nothing is overwritten. Each change has a date.":
"Un título revocado y reemitido también guarda su historia. Nada se sobrescribe. Cada cambio tiene fecha.",
"Not every change needs history. Correcting a typo can simply overwrite. A move between faculties can't. Decide for each attribute, and write it down.":
"No todo cambio necesita historia. Para corregir un error de tipeo, basta con sobrescribir. Un cambio de facultad, no. Decídelo para cada atributo, y déjalo por escrito.",
"Engineers call this a slowly changing dimension.":
"Los ingenieros lo llaman dimensión lentamente cambiante.",
"Now ask both shapes the same question.":
"Ahora, la misma pregunta a las dos formas.",
"The shape built to write needs seven joins, and a puzzle about history.":
"La forma hecha para escribir necesita siete joins, y un rompecabezas de historia.",
"The shape built to read answers in two.":
"La forma hecha para leer responde con dos.",
"Then correct a name. Easy where it's stored once. Awkward in a shape that repeats it on purpose.":
"Después corrige un nombre. Fácil donde se guarda una vez. Engorroso en una forma que lo repite a propósito.",
"Each shape is fast at its own job.":
"Cada forma es rápida en su propio trabajo.",
"One sketch. Two shapes, both built from the same logical model.":
"Un boceto. Dos formas, ambas hechas a partir del mismo modelo lógico.",
"And a common confusion, cleared up: bronze, silver and gold say how refined data is, not what shape it has.":
"Y una confusión común, aclarada: bronce, plata y oro dicen qué tan refinados están los datos, no qué forma tienen.",
"Many platforms keep a normalised shape in silver, close to the sources, and stars in gold. That's a choice, not a rule.":
"Muchas plataformas guardan una forma normalizada en plata, cerca de las fuentes, y estrellas en oro. Es una decisión, no una regla.",
"Any layer can hold either shape. The next question is which shapes to use for reading. There are several.":
"Cualquier capa puede tener cualquiera de las dos formas. La próxima pregunta: qué formas usar para leer. Hay varias."
});
