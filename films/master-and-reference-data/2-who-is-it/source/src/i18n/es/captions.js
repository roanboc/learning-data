/* Who is it?: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 1548, Martin Guerre left his village in the south of France, and his wife, Bertrande.":
"En 1548, Martin Guerre dejó su aldea en el sur de Francia, y a su esposa, Bertrande.",
"Eight years later, a man came back as Martin. He knew the house, the family, their stories, and they took him in.":
"Ocho años después, un hombre volvió como Martin. Conocía la casa, la familia, sus historias, y lo acogieron.",
"His uncle came to doubt him. In court, a hundred and fifty witnesses couldn't agree.":
"Su tío empezó a dudar de él. En el juicio, ciento cincuenta testigos no se pusieron de acuerdo.",
"On appeal, as the judges leaned his way, a man with a wooden leg walked in: the real Martin Guerre.":
"En la apelación, mientras los jueces se inclinaban por él, entró un hombre con pata de palo: el verdadero Martin Guerre.",
"Two people, taken for one, because so much matched.":
"Dos personas, tomadas por una, porque coincidía tanto.",
"First, two words.":
"Primero, dos palabras.",
"Master data is the things the business is about: Linh, an award, a supplier, a meter.":
"Los datos maestros son las cosas de las que trata el negocio: Linh, un título, un proveedor, un medidor.",
"Many rows, always growing, and matched across systems.":
"Muchas filas, siempre en aumento, y cotejadas entre sistemas.",
"Reference data is the short lists that sort them: countries, role types, statuses. Few rows, rarely changing, often from outside.":
"Los datos de referencia son las listas cortas que los clasifican: países, tipos de rol, estados. Pocas filas, casi sin cambios, a menudo de fuera.",
"Would you ever ask, “is this the same one as that?” Then it's master data.":
"¿Alguna vez preguntarías «¿es este el mismo que aquel?»? Entonces es un dato maestro.",
"If you only pick a value from a list, it's reference data.":
"Si solo eliges un valor de una lista, es un dato de referencia.",
"And a list that gets owners and a life of its own, like faculties, becomes master data.":
"Y una lista que gana responsables y vida propia, como las facultades, se vuelve dato maestro.",
"What matching builds is a master record, often called a golden record.":
"Lo que construye el cotejo es un registro maestro, a menudo llamado registro dorado.",
"An ID of its own, which never changes and is never reused.":
"Un ID propio, que nunca cambia y nunca se reutiliza.",
"For each detail, the best value, labelled with where it came from.":
"Para cada dato, el mejor valor, etiquetado con su origen.",
"And links to every record it came from, each kept as it arrived.":
"Y vínculos a cada registro del que viene, cada uno guardado tal como llegó.",
"So it can be explained, value by value, and undone, link by link.":
"Así se puede explicar, valor por valor, y deshacer, vínculo por vínculo.",
"Linh came back to study under a new student number.":
"Linh volvió a estudiar con un nuevo número de estudiante.",
"This term, for the first time, the registry runs a duplicate check across the university's systems.":
"Este semestre, por primera vez, la oficina de registro busca duplicados en los sistemas de la universidad.",
"Fifty thousand records would make over a billion pairs.":
"Cincuenta mil registros darían más de mil millones de pares.",
"So it compares only records that share something: an email, a number, or a birth year and a family name that sounds alike.":
"Así que solo compara registros que comparten algo: un correo, un número, o un año de nacimiento y un apellido que suena parecido.",
"It proposes pairs for Mei's office, the steward of the person. Here are three.":
"Propone pares a la oficina de Mei, encargada de la persona. Aquí hay tres.",
"The first pair is her two student numbers. Same name, same birth date.":
"El primer par: sus dos números de estudiante. Mismo nombre, misma fecha de nacimiento.",
"Out of a hundred, it scores 93: over the line where a pair links on its own.":
"Sobre cien, obtiene 93: por encima de la línea donde un par se vincula solo.",
"But in this first term, Mei's office checks the automatic links too, to test the rules.":
"Pero este primer semestre, la oficina de Mei también revisa los vínculos automáticos, para probar las reglas.",
"And Linh's application says she studied here before.":
"Y la postulación de Linh dice que ya estudió aquí.",
"So Mei links them, and writes down why.":
"Así que Mei los vincula, y anota por qué.",
"The registry merges the two numbers in its own system.":
"La oficina de registro fusiona los dos números en su propio sistema.",
"The second pair is harder: her new student number, and HR's record of her as a tutor.":
"El segundo par es más difícil: su nuevo número de estudiante y su registro de tutora en RR. HH.",
"Each thing compared adds weight, or takes it away.":
"Cada cosa comparada suma peso, o lo resta.",
"Given name, the same: plus 3.2. Family name, the same, but common: plus 2.":
"Nombre, igual: más 3,2. Apellido, igual, pero común: más 2.",
"Birth date, one digit apart, maybe a typo: plus 2.4. Email, different: minus 0.4.":
"Fecha de nacimiento, un dígito distinta, quizá una errata: más 2,4. Correo, distinto: menos 0,4.",
"Together, 74: between the lines, so a person decides.":
"En total, 74: entre las dos líneas, así que decide una persona.",
"If the birth dates agreed, it would score 93, like the first pair.":
"Si las fechas de nacimiento coincidieran, obtendría 93, como el primer par.",
"An AI helper drafts a note for Mei, with the names hidden: birth dates one digit apart, and the HR email on the university's domain.":
"Un asistente de IA redacta una nota para Mei, con los nombres ocultos: fechas de nacimiento a un dígito, y el correo de RR. HH. en el dominio de la universidad.",
"It suggests; Mei decides. She asks HR, and they check her contract: a typo.":
"Sugiere; Mei decide. Le pregunta a RR. HH., y revisan su contrato: una errata.",
"She links them, with that reason.":
"Los vincula, con ese motivo.",
"Which birth date to trust is the next film's question.":
"Qué fecha de nacimiento creer es la pregunta de la próxima película.",
"The third pair looks easy: a learning platform account with Aisha Karimi's student number.":
"El tercer par parece fácil: una cuenta de la plataforma de aprendizaje con el número de Aisha Karimi.",
"But the account is Aisha Rahman's, and the number was typed in by mistake.":
"Pero la cuenta es de Aisha Rahman, y el número se escribió por error.",
"Link them, and one student sees the other's results. Two people, taken for one.":
"Si se vinculan, una estudiante ve los resultados de la otra. Dos personas, tomadas por una.",
"A false merge costs more than a missed match.":
"Una fusión falsa cuesta más que una coincidencia perdida.",
"So Mei keeps them apart, and her “not the same” binds the matcher.":
"Así que Mei las mantiene separadas, y su «no son la misma» obliga al cotejo.",
"Two decisions, and Linh's five records point to one person.":
"Dos decisiones, y los cinco registros de Linh apuntan a una persona.",
"Nothing was destroyed: each record stays as it arrived. So if a real Martin ever walks in, any link can be undone.":
"Nada se destruyó: cada registro queda tal como llegó. Así, si alguna vez entra un Martin verdadero, cualquier vínculo se puede deshacer.",
"And no rule says two student numbers are never one person. A student who comes back has two.":
"Y ninguna regla dice que dos números de estudiante nunca son una persona. Quien vuelve a estudiar tiene dos.",
"Hospitals match people too. Merge two patients by mistake, and a test result follows the wrong one.":
"Los hospitales también cotejan personas. Si fusionan dos pacientes por error, un resultado sigue al equivocado.",
"So they keep each identifier with the system that issued it, and undoing a merge is part of the job.":
"Por eso guardan cada identificador con el sistema que lo emitió, y deshacer una fusión es parte del trabajo.",
"On the platform, in dbt, a query proposes the pairs without comparing everyone, and the decisions table becomes the person's queue.":
"En la plataforma, en dbt, una consulta propone los pares sin comparar a todos, y la tabla de decisiones se vuelve la cola de la persona.",
"A test fails when a pair waits more than a week: the queue has an owner, and a limit.":
"Una prueba falla cuando un par espera más de una semana: la cola tiene un responsable, y un límite.",
"In Databricks, the master records and their links, each with who decided and why.":
"En Databricks, los registros maestros y sus vínculos, cada uno con quién decidió y por qué.",
"Decide a match once, with a reason, and keep it.":
"Decide una coincidencia una vez, con un motivo, y consérvala."
});
