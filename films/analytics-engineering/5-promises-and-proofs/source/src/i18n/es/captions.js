/* Promises and proofs: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Under a law of 1300, English silver had to meet one standard: sterling.":
"Por una ley de 1300, la plata inglesa debía cumplir un estándar: la ley esterlina.",
"No piece could leave the workshop until it was tested, then marked.":
"Ninguna pieza salía del taller sin ser ensayada y, después, marcada.",
"From 1478, the testing was done at Goldsmiths' Hall: the hall in hallmark.":
"Desde 1478, el ensayo se hacía en Goldsmiths' Hall: el hall de hallmark, el contraste.",
"Buyers still trust the mark, without testing the silver themselves.":
"Los compradores aún confían en la marca, sin ensayar ellos la plata.",
"A core model makes the same promise. Its tests are the assay, and they come before the mark.":
"Un modelo del núcleo hace la misma promesa. Sus pruebas son el ensayo, y van antes de la marca.",
"Step four: name the gaps.":
"Paso cuatro: nombrar las brechas.",
"Jun's gap register lists them beside each source, while they're open: what the business expects, beside what the source holds, one line per gap.":
"El registro de brechas de Jun las anota junto a cada fuente, mientras siguen abiertas: lo que espera el negocio, junto a lo que tiene la fuente, una línea por brecha.",
"The business expects a revoked credential to be known as revoked. The learning platform just deletes it.":
"El negocio espera que una credencial revocada conste como revocada. La plataforma de aprendizaje simplemente la borra.",
"Every gap gets one of three decisions. Fix it at the source. Write a rule in the model. Or accept it, and write it down.":
"Cada brecha recibe una de tres decisiones. Corregirla en la fuente. Escribir una regla en el modelo. O aceptarla, y dejarla por escrito.",
"This one gets two. Anything the platform stops showing is revoked from that day. And the platform is asked for a proper flag.":
"Esta recibe dos. Lo que la plataforma deja de mostrar queda revocado desde ese día. Y se le pide a la plataforma un indicador propio.",
"Jordan's microcredential vanished on the twelfth of August. From that day, it reads as revoked.":
"La microcredencial de Jordan desapareció el doce de agosto. Desde ese día, figura como revocada.",
"Ten gaps, ten decisions. Mei approves the ones about meaning.":
"Diez brechas, diez decisiones. Mei aprueba las que tratan del significado.",
"Then each gap leaves the register. A rule in the model becomes a decision, in its source's log. An accepted gap becomes a known limitation, on the model. Only a fix still awaited stays open.":
"Luego cada brecha sale del registro. Una regla en el modelo se vuelve una decisión, en el registro de decisiones de su fuente. Una brecha aceptada se vuelve una limitación conocida, en el modelo. Solo queda abierto un arreglo que aún se espera.",
"Then the contracts. The core is what everything else builds on, so it makes the strongest promise.":
"Luego, los contratos. Todo lo demás se construye sobre el núcleo, así que hace la promesa más fuerte.",
"The whole core folder gets two settings. Public: other projects may build on it. And a contract, enforced.":
"Toda la carpeta del núcleo recibe dos ajustes. Público: otros proyectos pueden construir sobre él. Y un contrato, obligatorio.",
"The credential's YAML lists every column, its type, and what can't be empty. Its grain: one row per credential.":
"El YAML de la credencial lista cada columna, su tipo y lo que no puede estar vacío. Su granularidad: una fila por credencial.",
"Let the query and the contract disagree on a column's type, and the build stops before the table is made.":
"Si la consulta y el contrato no coinciden en el tipo de una columna, la construcción se detiene antes de crear la tabla.",
"The contract is checked at every build, not read once and forgotten. Noor approves it.":
"El contrato se verifica en cada construcción, no se lee una vez y se olvida. Noor lo aprueba.",
"Each consumer gets a contract of its own, on the same core.":
"Cada consumidor recibe su propio contrato, sobre el mismo núcleo.",
"Each carries the grain it declared: Planning's as it was on census day, the wallet's as it is now.":
"Cada uno lleva la granularidad que declaró: la de Planificación, como era el día del censo; la de la billetera, como es hoy.",
"Both are enforced, and protected: only this project can build on them.":
"Ambos son obligatorios y protegidos: solo este proyecto puede construir sobre ellos.",
"And each declares an exposure: the dashboard or the app that reads it, with an owner and an email.":
"Y cada uno declara una exposición: el tablero o la app que lo lee, con un responsable y un correo.",
"Change the credential in the core, and the lineage finds one exposure: the wallet app. That's who to tell.":
"Si cambias la credencial en el núcleo, el linaje encuentra una exposición: la app de billetera. A ellos hay que avisar.",
"Planning and the wallet team each approve their own.":
"Planificación y el equipo de la billetera aprueban cada uno el suyo.",
"Step five: the tests, before the code they check. They say what done looks like.":
"Paso cinco: las pruebas, antes del código que verifican. Dicen cómo se ve lo terminado.",
"Every key, unique and never empty. Every relationship, pointing at something real.":
"Cada clave, única y nunca vacía. Cada relación, apuntando a algo que existe.",
"Every closed list, from agreed values. Every history, with versions that never overlap.":
"Cada lista cerrada, con valores acordados. Cada historia, con versiones que nunca se superponen.",
"And one number people already trust: the census report's twelve learners.":
"Y un número en el que ya se confía: los doce estudiantes del informe del censo.",
"A test compares the model's count with the report, and fails on any faculty that differs.":
"Una prueba compara el conteo del modelo con el informe, y falla en cualquier facultad que difiera.",
"The agent drafts the tests from the contracts and the register. Jun reviews them.":
"El agente redacta las pruebas a partir de los contratos y el registro. Jun las revisa.",
"Data tests check the tables. Some logic needs checking on its own, with a few rows made up for the purpose. That's a unit test.":
"Las pruebas de datos verifican las tablas. Cierta lógica se verifica por separado, con unas filas inventadas para eso. Eso es una prueba unitaria.",
"The credit rule, in two made-up rows. A passed unit of study counts from the tenth of January. A microcredential counts from the second of February, until it's revoked on the twelfth of August.":
"La regla de créditos, en dos filas inventadas. Una asignatura aprobada cuenta desde el diez de enero. Una microcredencial cuenta desde el dos de febrero, hasta que se revoca el doce de agosto.",
"Credit changes twice, so the answer is three versions: fifteen, twenty, then fifteen again.":
"El crédito cambia dos veces, así que la respuesta son tres versiones: quince, veinte y otra vez quince.",
"The microcredential's dates are Jordan's. The rule is proved before a single real row arrives.":
"Las fechas de la microcredencial son las de Jordan. La regla se prueba antes de que llegue una sola fila real.",
"Not every failure should stop everything. A test can warn, or it can stop the build.":
"No toda falla debe detenerlo todo. Una prueba puede advertir, o puede detener la construcción.",
"One short-course enrolment has no email: a walk-in, whose certificate can't reach anyone.":
"Una inscripción a un curso corto no tiene correo: alguien que llegó sin registro, cuyo certificado no llega a nadie.",
"The learning team agreed: warn when there's any, stop when there are more than five. One or two a term are expected. More means something broke.":
"El equipo de aprendizaje acordó: advertir si hay alguna, detener si hay más de cinco. Se esperan una o dos por período. Más significa que algo se rompió.",
"Today, the build warns once, and carries on.":
"Hoy, la construcción advierte una vez y sigue.",
"Freshness works the same way: warn when a source is a day late, fail at three.":
"La frescura funciona igual: advertir si una fuente lleva un día de retraso, fallar a los tres.",
"Who sets the level? The data's owner, with the reason written down.":
"¿Quién fija el nivel? El responsable de los datos, con la razón por escrito.",
"112 data tests. Four unit tests. Every promise written down, with its proof beside it.":
"112 pruebas de datos. Cuatro pruebas unitarias. Cada promesa por escrito, con su prueba al lado.",
"Each is written before the code it checks, so until that code is built, it can't pass. That's on purpose.":
"Cada una se escribe antes del código que verifica, así que hasta que ese código exista, no puede pasar. Es a propósito.",
"Next, the least code that turns them green, in the right place.":
"Luego, el mínimo código que las ponga en verde, en el lugar correcto."
});
