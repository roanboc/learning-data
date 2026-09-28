/* Older than the systems: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Almost four thousand years ago, student scribes in Mesopotamia practised on clay. Some of their school tablets hold a teacher's model, with the student's copy beside it.":
"Hace casi cuatro mil años, en Mesopotamia, los aprendices de escriba practicaban en arcilla. Algunas tablillas escolares tienen el modelo del maestro, con la copia del alumno al lado.",
"In medieval Europe, a journeyman became a master by making a masterpiece: one piece of work, judged by the masters of the guild.":
"En la Europa medieval, un oficial artesano se convertía en maestro haciendo una obra maestra: una sola pieza, juzgada por los maestros del gremio.",
"In China, imperial examinations tested candidates for thirteen centuries, and the rank they earned opened the way to office.":
"En China, los exámenes imperiales evaluaron a candidatos durante trece siglos, y el rango obtenido abría el camino a los cargos públicos.",
"At medieval universities, a chancellor granted the licence to teach, under a wax seal. Then came the diploma, the transcript, the digital badge, and today, a credential signed with a digital key.":
"En las universidades medievales, un canciller otorgaba la licencia para enseñar, bajo un sello de cera. Luego llegaron el diploma, el certificado de notas, la insignia digital y, hoy, una credencial firmada con una clave digital.",
"The materials changed every few centuries. The idea didn't.":
"Los materiales cambiaban cada tantos siglos. La idea, no.",
"Look closely, and every one of them has the same parts.":
"Mira de cerca, y todas tienen las mismas partes.",
"Someone trusted issues it: a guild, the examiners, a university.":
"Alguien de confianza la emite: un gremio, los examinadores, una universidad.",
"It names a holder, and makes a claim about them: this person can do this.":
"Nombra a un titular, y hace una afirmación sobre él: esta persona sabe hacer esto.",
"It rests on evidence: a masterpiece, an examination, an assessment. And it has a date.":
"Se apoya en evidencia: una obra maestra, un examen, una evaluación. Y tiene una fecha.",
"Someone else can check it: by the seal, by the signature, or today, by the digital key. Some expire. A few are revoked.":
"Otra persona puede comprobarla: por el sello, por la firma o, hoy, por la clave digital. Algunas vencen. Unas pocas se revocan.",
"Today's standard for digital credentials uses almost the same words: issuer, holder, verifier, claims and evidence.":
"El estándar actual de credenciales digitales usa casi las mismas palabras: emisor, titular, verificador, afirmaciones y evidencia.",
"A conceptual model can outlast every material it was ever written on.":
"Un modelo conceptual puede durar más que cualquier material en que se haya escrito.",
"At the university, credentials now live in five systems.":
"En la universidad, las credenciales hoy viven en cinco sistemas.",
"The student system holds awards. The learning platform, completions. Careers, badges. A digital wallet, the signed copies.":
"El sistema de estudiantes guarda títulos. La plataforma de aprendizaje, cursos completados. Empleabilidad, insignias. Una billetera digital, las copias firmadas.",
"And the new short-course platform, bought off the shelf, holds the microcredentials. It calls learners customers.":
"Y la nueva plataforma de cursos cortos, comprada lista para usar, guarda las microcredenciales. A los aprendices los llama clientes.",
"Buying a system means adopting its model, whether you look at it or not.":
"Comprar un sistema es adoptar su modelo, lo mires o no.",
"If you don't model your business, your vendors will do it for you.":
"Si no modelas tu negocio, tus proveedores lo harán por ti.",
"Connect five systems in pairs, and you need up to ten translations. Each one is a place where meaning can slip.":
"Conecta cinco sistemas de a pares, y necesitas hasta diez traducciones. En cada una, el significado puede desviarse.",
"In 1999, a spacecraft was lost at Mars. One team's software gave the thrusters' push in pound-force seconds. The navigation software expected newton-seconds.":
"En 1999, una nave espacial se perdió en Marte. El software de un equipo daba el empuje de los propulsores en libras-fuerza-segundo. El de navegación esperaba newtons-segundo.",
"Each side made sense on its own. The meaning broke between them.":
"Cada lado tenía sentido por sí solo. El significado se rompió entre los dos.",
"So translate each system once, to a shared model. Five translations instead of ten, and one place where the meaning is written down.":
"Así que traduce cada sistema una vez, a un modelo compartido. Cinco traducciones, no diez, y un solo lugar donde el significado queda escrito.",
"Take one learner, Aisha. She has four IDs: a student number, a platform login, a customer number and a wallet address.":
"Tomemos a una aprendiz: Aisha. Tiene cuatro ID: número de estudiante, usuario de la plataforma, número de cliente y dirección de billetera.",
"Her name comes from the student system, her email from IT, and her credentials from three different places.":
"Su nombre viene del sistema de estudiantes, su correo de TI, y sus credenciales de tres lugares distintos.",
"Choosing which system is the source of each fact, and linking the records that are the same person, is master data.":
"Elegir qué sistema es la fuente de cada dato, y unir los registros que son la misma persona, es gestionar datos maestros.",
"And shared lists of values, such as the kinds of credential, keep a word meaning the same thing in every system. That's reference data.":
"Y las listas de valores compartidas, como los tipos de credencial, hacen que una palabra signifique lo mismo en cada sistema. Eso son datos de referencia.",
"The sketch on paper says what matters. The logical model says it precisely.":
"El boceto en papel dice qué importa. El modelo lógico lo dice con precisión.",
"What identifies a credential? Who issued it, to whom, for what, and when.":
"¿Qué identifica a una credencial? Quién la emitió, a quién, qué afirma y cuándo.",
"Its attributes, and the values each may take: the level, the volume of learning, the status.":
"Sus atributos, y los valores que puede tomar cada uno: el nivel, el volumen de aprendizaje, el estado.",
"How many of one relate to another: one learner holds many credentials, and one microcredential can count towards several awards.":
"Cuántos de una cosa se relacionan con otra: un aprendiz tiene muchas credenciales, y una microcredencial puede contar para varios títulos.",
"And the rules: a revoked credential is never counted.":
"Y las reglas: una credencial revocada nunca se cuenta.",
"Still no technology. That's what makes it useful: it's the yardstick every system is held against, to choose a package, to map its fields, or to move to a new one.":
"Todavía sin tecnología. Eso es lo que lo hace útil: es la vara con la que se mide cada sistema, para elegir un paquete, relacionar sus campos o mudarse a uno nuevo.",
"Every part has an owner. The registrar owns the word award. The short-courses team owns microcredential.":
"Cada parte tiene un responsable. La palabra título es de Registro académico. Microcredencial, de Cursos cortos.",
"Noor, the data architect, owns the logical model, and each team owns its own tables.":
"Noor, la arquitecta de datos, es responsable del modelo lógico, y cada equipo, de sus tablas.",
"A change of meaning travels down, from the words to the systems. News of a change in a system travels up, before it ships.":
"Un cambio de significado baja, de las palabras a los sistemas. El aviso de un cambio en un sistema sube, antes de que salga.",
"Owners decide. Stewards keep it written down, and up to date.":
"Los responsables deciden. Los custodios lo mantienen escrito, y al día.",
"The short-course platform still calls them customers. Nothing inside it changed.":
"La plataforma de cursos cortos todavía los llama clientes. Por dentro, nada cambió.",
"But its customer now maps to learner, and its certificate to microcredential. The meaning is joined.":
"Pero ahora su cliente corresponde a aprendiz, y su certificado, a microcredencial. El significado queda unido.",
"Systems come and go every decade or so. The ideas underneath them are centuries old.":
"Los sistemas van y vienen cada década, más o menos. Las ideas de fondo tienen siglos.",
"Model them once, precisely, and hold every system up to that. Next: one model, many shapes.":
"Modélalas una vez, con precisión, y mide cada sistema con ellas. Siguiente: un modelo, muchas formas."
});
