/* Start from a question: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 1854, cholera killed hundreds of people in a few streets of Soho.":
"En 1854, el cólera mató a cientos de personas en unas pocas calles del Soho.",
"John Snow asked one question: where did the dead get their water?":
"John Snow se hizo una pregunta: ¿de dónde sacaban el agua los muertos?",
"He marked each death at its address, and the deaths gathered around one pump, on Broad Street.":
"Marcó cada muerte en su dirección, y las muertes se agruparon alrededor de una bomba, en Broad Street.",
"His map showed only what the question needed.":
"Su mapa mostraba solo lo que la pregunta necesitaba.",
"Jun's model starts the same way: with one question, from Planning.":
"El modelo de Jun empieza igual: con una pregunta, de Planificación.",
"Step one: start from a question.":
"Paso uno: empieza por una pregunta.",
"How many learners are within 15 credit points of a graduate certificate, by faculty, as at census date?":
"¿Cuántos estudiantes están a 15 créditos o menos de un certificado de posgrado, por facultad, a la fecha del censo?",
"Behind it, a decision: how many places to offer in each faculty's final graduate certificate units next semester.":
"Detrás hay una decisión: cuántos cupos ofrecer en las últimas unidades del certificado de posgrado de cada facultad el próximo semestre.",
"A second consumer, the learner's wallet app, will read the same facts, as they are today.":
"Un segundo consumidor, la app de billetera del estudiante, leerá los mismos hechos, tal como son hoy.",
"The decision says what done looks like. The census report counted twelve. The model has to reach the same number.":
"La decisión dice cómo se ve el trabajo terminado. El informe del censo contó doce. El modelo tiene que llegar al mismo número.",
"The code and the data on screen are real. They run on dbt Core, with DuckDB, in the series' repository, so anyone can run them.":
"El código y los datos en pantalla son reales. Corren en dbt Core, con DuckDB, en el repositorio de la serie, así que cualquiera puede correrlos.",
"The university's own platform is Databricks, with dbt Cloud, and the same project runs there too.":
"La plataforma de la universidad es Databricks, con dbt Cloud, y el mismo proyecto también corre allí.",
"Only the connection changes, and one function: the one that turns a key into a hash.":
"Solo cambian la conexión y una función: la que convierte una clave en un hash.",
"The university's glossary has a term for everything it does: fees, timetables, rooms, staff.":
"El glosario de la universidad tiene un término para todo lo que hace: aranceles, horarios, salas, personal.",
"The question touches four: a learner, a credential, an award, and the credit a learner holds towards an award.":
"La pregunta toca cuatro: un estudiante, una credencial, un título, y los créditos que un estudiante tiene hacia un título.",
"Everything else stays out, however central it seems.":
"Todo lo demás queda fuera, por central que parezca.",
"Noor agreed that scope with Planning, and wrote down why. Model the university, and you never finish. A question, you can finish.":
"Noor acordó ese alcance con Planificación y dejó escrito por qué. Si modelas la universidad, nunca terminas. Una pregunta, sí la terminas.",
"Each of the four is written down once, in YAML.":
"Cada una de las cuatro se escribe una sola vez, en YAML.",
"The learner: a definition, an owner, and the rule for its key.":
"El estudiante: una definición, un responsable y la regla de su clave.",
"The definition is in the business's words, not a system's: a person the university has recorded learning with it, in any of its systems.":
"La definición está en palabras del negocio, no de un sistema: una persona que la universidad registró aprendiendo con ella, en cualquiera de sus sistemas.",
"Beside it, a diagram drawn by hand: a learner holds credentials, and holds credit towards an award.":
"Al lado, un diagrama hecho a mano: un estudiante tiene credenciales, y tiene créditos hacia un título.",
"The YAML holds the meaning. The diagram lets anyone read it.":
"El YAML guarda el significado. El diagrama deja que cualquiera lo lea.",
"Next, what identifies each one in business terms, before anyone opens a source.":
"Luego, qué identifica a cada una en términos del negocio, antes de que nadie abra una fuente.",
"A learner is their student ID, which the registrar's office issues. An award is its code. A credential is the ID its issuer gave it.":
"Un estudiante es su ID de estudiante, que emite la oficina de registro. Un título es su código. Una credencial es el ID que le dio su emisor.",
"Each key is tagged with the system it comes from: the student system, the learning platform, or the short-course platform.":
"Cada clave lleva la marca del sistema de donde viene: el sistema de estudiantes, la plataforma de aprendizaje o la de cursos cortos.",
"And each meaning has an owner. Mei, in the registrar's office, owns learner, credential and award. The learning team owns microcredentials and badges.":
"Y cada significado tiene un responsable. Mei, en la oficina de registro, es dueña de estudiante, credencial y título. El equipo de aprendizaje, de microcredenciales e insignias.",
"The sources will disagree. The owner is the person who decides which meaning wins.":
"Las fuentes no van a coincidir. El responsable es la persona que decide qué significado gana.",
"Then a harder call. Is a microcredential a kind of credential, or a thing of its own?":
"Luego, una decisión más difícil. ¿Una microcredencial es un tipo de credencial, o algo aparte?",
"Compare what identifies it: the issuer's own identifier. Compare its life: issued on a date, and perhaps revoked.":
"Compara qué la identifica: el identificador propio del emisor. Compara su vida: emitida en una fecha, y quizá revocada.",
"Both match any credential. Only the credit points differ.":
"Ambas coinciden con cualquier credencial. Solo difieren los créditos.",
"Same identity, same lifecycle: one entity, with kinds. A different identity, grain or lifecycle, and you split.":
"Misma identidad, mismo ciclo de vida: una entidad, con tipos. Otra identidad, granularidad o ciclo de vida, y separas.",
"A certificate of attendance asks to join. It says someone was there, not what they can do. It stays out.":
"Un certificado de asistencia pide entrar. Dice que alguien estuvo ahí, no lo que sabe hacer. Queda fuera.",
"Jun doesn't write all this alone. An AI agent drafts it, following a skill kept in the project.":
"Jun no escribe todo esto solo. Un agente de IA hace el borrador, siguiendo una skill guardada en el proyecto.",
"Write the question first. List only what it touches. Propose combine or split, with the reasons.":
"Escribe primero la pregunta. Enumera solo lo que toca. Propón unir o separar, con las razones.",
"The draft defined the credential, but let certificates of attendance in.":
"El borrador definió la credencial, pero dejó entrar los certificados de asistencia.",
"Mei adds one clause: a certificate of attendance isn't one.":
"Mei agrega una cláusula: un certificado de asistencia no es una.",
"The agent drafts. The owner approves the meaning, and the decision goes in the log, with her name and the date.":
"El agente redacta. La responsable aprueba el significado, y la decisión va al registro, con su nombre y la fecha.",
"One question. Four things to model. Two owners of meaning. Nothing else.":
"Una pregunta. Cuatro cosas que modelar. Dos responsables del significado. Nada más.",
"Now, the sources.":
"Ahora, las fuentes.",
"The model says a learner is one person. The sources say one learner, Aisha, is three.":
"El modelo dice que un estudiante es una persona. Las fuentes dicen que una estudiante, Aisha, es tres."
});
