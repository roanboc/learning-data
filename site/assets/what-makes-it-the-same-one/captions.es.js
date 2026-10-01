/* What makes it the same one: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In the 1880s, a Paris police clerk, Alphonse Bertillon, identified repeat offenders by measuring them.":
"En la década de 1880, Alphonse Bertillon, empleado de la policía de París, identificaba a los reincidentes midiéndolos.",
"Each measure went on a card, filed by its numbers.":
"Cada medida iba a una ficha, archivada por sus números.",
"In 1903, the story goes, a new prisoner at Leavenworth matched the card of a man already inside. Fingerprints told them apart.":
"En 1903, según se cuenta, un preso nuevo en Leavenworth coincidió con la ficha de otro que ya estaba allí. Las huellas los distinguieron.",
"Looking alike isn't being the same. Which brings us to Aisha.":
"Parecerse no es ser el mismo. Y eso nos lleva a Aisha.",
"Aisha has just completed a graduate certificate in data analytics.":
"Aisha acaba de completar un certificado de posgrado en analítica de datos.",
"The student system knows her by her student ID. The learning platform, by her account.":
"El sistema de estudiantes la conoce por su número de estudiante. La plataforma de aprendizaje, por su cuenta.",
"The short-course platform, by the email she typed, with a space either side, in mixed case.":
"La plataforma de cursos cortos, por el correo que escribió, con un espacio a cada lado y mayúsculas mezcladas.",
"Three keys. Each one means something only inside its own system.":
"Tres claves. Cada una significa algo solo dentro de su propio sistema.",
"None of them says which learner she is.":
"Ninguna dice qué estudiante es.",
"Before matching anything, Jun learns what the sources really hold. The agent profiles them, and every claim comes with the query that shows it.":
"Antes de emparejar nada, Jun averigua qué contienen de verdad las fuentes. El agente las perfila, y cada afirmación trae la consulta que la demuestra.",
"Four of forty-two platform accounts have no student ID.":
"Cuatro de cuarenta y dos cuentas de la plataforma no tienen número de estudiante.",
"Two students share one family email, and so do their two platform accounts.":
"Dos estudiantes comparten un correo familiar, y también sus dos cuentas de la plataforma.",
"Two short-course enrolments point at no customer, as typed. Trimmed and in lower case, every one with an email finds its customer.":
"Dos inscripciones a cursos cortos no apuntan a ningún cliente, tal como se escribieron. Sin espacios y en minúsculas, cada una con correo encuentra su cliente.",
"A claim without its query is a guess.":
"Una afirmación sin su consulta es una suposición.",
"First, the key sets from the question's model go to work.":
"Primero, los conjuntos de claves del modelo de la pregunta se ponen a trabajar.",
"Every key now carries the short code of the system it comes from, and that system's owner.":
"Cada clave lleva ahora el código corto del sistema del que viene, y el dueño de ese sistema.",
"Two systems can use the same-looking key for two different people. Qualified, they can't be confused.":
"Dos sistemas pueden usar una clave que parece igual para dos personas distintas. Calificadas, no se pueden confundir.",
"And staging writes every key one way: trimmed, and in one case. Aisha's email loses its spaces and its capitals.":
"Y staging escribe cada clave de una sola forma: sin espacios y en un solo tipo de letra. El correo de Aisha pierde sus espacios y sus mayúsculas.",
"Then: which keys are the same learner? Jun writes it as rules, most trusted first, one block of code for each.":
"Luego: ¿qué claves son el mismo estudiante? Jun lo escribe como reglas, la más confiable primero, un bloque de código para cada una.",
"A student ID is a learner.":
"Un número de estudiante es un estudiante.",
"A platform account is the student whose ID it holds.":
"Una cuenta de la plataforma es el estudiante cuyo número guarda.",
"An email names a student, but only if exactly one student has it.":
"Un correo identifica a un estudiante, pero solo si exactamente un estudiante lo tiene.",
"Anything left is a learner of its own.":
"Lo que queda es un estudiante por sí mismo.",
"Each key takes the most trusted rule that fits.":
"Cada clave toma la regla más confiable que le aplica.",
"Aisha's three keys resolve to her student ID. Across the university, ninety keys become forty-six learners.":
"Las tres claves de Aisha llevan a su número de estudiante. En toda la universidad, noventa claves se vuelven cuarenta y seis estudiantes.",
"The rules are written in words in the model, and in code in two models. Mei, who owns what a learner means, approved them.":
"Las reglas están escritas en palabras en el modelo, y en código en dos modelos. Mei, dueña de lo que significa estudiante, las aprobó.",
"But another Aisha has a platform account, and its student ID field holds our Aisha's number, typed by mistake.":
"Pero otra Aisha tiene una cuenta en la plataforma, y su campo de número de estudiante guarda el de nuestra Aisha, escrito por error.",
"The rules merge them. Aisha's wallet now shows six credentials, one she never earned. And every test still passes.":
"Las reglas las fusionan. La billetera de Aisha muestra ahora seis credenciales, una que nunca obtuvo. Y todas las pruebas siguen pasando.",
"No test knew they were two people, because nobody had written it down.":
"Ninguna prueba sabía que eran dos personas, porque nadie lo había escrito.",
"Mei checks, and records a decision: different people. A person's decision beats every rule.":
"Mei lo revisa y registra una decisión: personas distintas. La decisión de una persona vale más que cualquier regla.",
"The merge undoes, and Aisha holds five. The decision is data now: the code keeps them apart, and a test fails if anything merges them again.":
"La fusión se deshace, y Aisha tiene cinco. La decisión ahora es un dato: el código las mantiene separadas, y una prueba falla si algo vuelve a fusionarlas.",
"Jun hashes each learner's business key.":
"Jun calcula el hash de la clave de negocio de cada estudiante.",
"Sixty-four characters. Add one trailing space, and the hash is completely different.":
"Sesenta y cuatro caracteres. Agrega un espacio al final, y el hash es completamente distinto.",
"So one macro builds every hash. It trims each part, writes it in upper case, marks a missing part, and joins the parts with a bar.":
"Así que una sola macro construye cada hash. Quita los espacios de cada parte, la escribe en mayúsculas, marca la parte que falta y une las partes con una barra.",
"The same key gives the same hash, in every model, and on every engine.":
"La misma clave da el mismo hash, en cada modelo y en cada motor.",
"And the readable key stays beside the hash. A hash can't be read, or checked by eye.":
"Y la clave legible se queda junto al hash. Un hash no se puede leer ni revisar a simple vista.",
"Codes need the same care. Three systems, three codes, one meaning: studying.":
"Los códigos necesitan el mismo cuidado. Tres sistemas, tres códigos, un significado: estudiando.",
"A status map says so, one row per code. The registrar's office owns it, and approves every change.":
"Un mapa de estados lo dice, una fila por código. La oficina de registro es su dueña, y aprueba cada cambio.",
"Now every learner has one key. But one key can still mean many rows, and many versions.":
"Ahora cada estudiante tiene una clave. Pero una clave todavía puede significar muchas filas, y muchas versiones."
});
