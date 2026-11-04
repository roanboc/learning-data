/* Context engineering: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: el día del censo, Planificación, la oficina de registro, las herramientas, which keep the
   names they have on screen (Catalog, Query, Docs), una consulta for a query, una prueba for a test, una receta for a recipe, el contrato,
   el glosario de negocio, el repositorio, las notas para agentes; los metadatos, las habilidades, ingeniería de contexto. The word the film
   is about stays as it is on screen, «commencing», and its first caption says what it is in Spanish, de nuevo ingreso; a course is un
   programa (a programme of study, as the glossary means it). In 1025: el canto for a chant, un cantor, los niños for Guido's boys, el
   maestro, el pentagrama for the staff, and the lines' notes by their Spanish names with the letters the picture shows, el fa (F) and el do
   (C); the books keep the names on screen, Leo and Albert. Tú, as the film speaks to the viewer (Pon, Escríbelo). Numbers keep the
   picture's comma (18,412), as the series' other Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Arezzo, in Italy, about the year 1025.":
"Arezzo, en Italia, hacia el año 1025.",
"A monk named Guido teaches boys to sing the church's chants, its prayers sung through the year.":
"Un monje llamado Guido enseña a unos niños a cantar los cantos de la Iglesia, sus oraciones cantadas durante el año.",
"Each chant is learned by ear, from a master, one at a time.":
"Cada canto se aprende de oído, de un maestro, uno por uno.",
"The books carry small signs above the words, to remind a singer how a chant goes, if he already knows it.":
"Los libros llevan pequeños signos sobre las palabras, para recordarle a un cantor cómo va un canto, si ya lo conoce.",
"A boy who has never heard a chant can't sing it from the page: the signs show up or down, but not how far.":
"Un niño que nunca ha oído un canto no puede cantarlo de la página: los signos muestran si sube o baja, pero no cuánto.",
"So he learns it from a master, and the masters don't agree.":
"Así que lo aprende de un maestro, y los maestros no se ponen de acuerdo.",
"Guido wrote that hardly one singer agreed with another, and there were as many chant books as masters: Leo's, or Albert's.":
"Guido escribió que apenas un cantor coincidía con otro, y que había tantos libros de canto como maestros: el de Leo, o el de Albert.",
"Learning the chants takes about ten years, and even then, a singer knows them imperfectly.":
"Aprender los cantos lleva unos diez años, y aun así, un cantor los sabe de forma imperfecta.",
"Something has to change.":
"Algo tiene que cambiar.",
"Guido's answer is lines across the page: each line, and each space between, one note.":
"La respuesta de Guido son líneas a lo ancho de la página: cada línea, y cada espacio entre ellas, una nota.",
"Two of the lines are coloured, red for F and yellow for C, so a singer always knows where he is.":
"Dos de las líneas tienen color, roja para el fa (F) y amarilla para el do (C), así un cantor siempre sabe dónde está.",
"Every sign now sits on a line or a space: what lived in the master's head is on the page.":
"Cada signo se asienta ahora en una línea o en un espacio: lo que vivía en la cabeza del maestro está en la página.",
"Within three days, some of his boys can sing chants they have never heard.":
"En tres días, algunos de sus niños pueden cantar cantos que nunca han oído.",
"In Guido's words, a singer who took ten years is now made in a year, or two at most.":
"En palabras de Guido, un cantor que tardaba diez años ahora se forma en un año, o dos como mucho.",
"In Rome, Pope John turns the pages of Guido's book, and won't leave his seat until he has learned a verse he has never heard.":
"En Roma, el papa Juan hojea el libro de Guido, y no deja su asiento hasta haber aprendido un verso que nunca ha oído.",
"With one more line, it's the staff musicians read today.":
"Con una línea más, es el pentagrama que hoy leen los músicos.",
"An agent is like a boy who has never heard the chant: it can only sing what's on the page.":
"Un agente es como un niño que nunca ha oído el canto: solo puede cantar lo que está en la página.",
"If a word's meaning lives only in someone's head, the agent guesses.":
"Si el significado de una palabra vive solo en la cabeza de alguien, el agente adivina.",
"Put the meaning on the page, and people and agents both read it right.":
"Pon el significado en la página, y personas y agentes lo leerán bien.",
"Today, at the university, Clara, in Planning, asks Jun a new question for next year's plan.":
"Hoy, en la universidad, Clara, de Planificación, le hace a Jun una pregunta nueva para el plan del año próximo.",
"Of the 18,412 students on census day, how many were commencing?":
"De los 18,412 estudiantes del día del censo, ¿cuántos eran «commencing», de nuevo ingreso?",
"Jun gives it to his agent, with its tools: Catalog, Query and Docs, each read only.":
"Jun se la pasa a su agente, con sus herramientas: Catalog, Query y Docs, cada una de solo lectura.",
"It reads what they reach: the tables, their columns, the code that builds them, and the team's docs.":
"Lee lo que ellas alcanzan: las tablas, sus columnas, el código que las construye y los documentos del equipo.",
"Nothing it reads says what commencing means.":
"Nada de lo que lee dice qué significa «commencing».",
"So it reasons from the names: commencing must mean a student whose enrolment began this year.":
"Así que razona a partir de los nombres: «commencing» debe ser un estudiante cuya matrícula empezó este año.",
"It counts 6,931, attaches its query, and sounds as sure as if it knew.":
"Cuenta 6,931, adjunta su consulta, y suena tan seguro como si lo supiera.",
"Jun reads the query: it's careful, and it runs, but is that what the word means?":
"Jun lee la consulta: es cuidadosa, y funciona, pero ¿es eso lo que significa la palabra?",
"He asks Mei, in the registrar's office.":
"Le pregunta a Mei, de la oficina de registro.",
"She knows at once: commencing means starting a course at the university for the first time.":
"Ella lo sabe al instante: «commencing» es empezar un programa en la universidad por primera vez.",
"A student coming back to their course after leave, or a break, isn't commencing: that's the government's rule too.":
"Un estudiante que vuelve a su programa tras una licencia, o una pausa, no es «commencing»: también es la regla del gobierno.",
"719 of the 6,931 were coming back: the right number is 6,212.":
"719 de los 6,931 estaban volviendo: la cifra correcta es 6,212.",
"Planning would have planned for 719 new students who weren't new.":
"Planificación habría planificado para 719 estudiantes nuevos que no lo eran.",
"The meaning was written down once, in 2021, in an email Mei sent to someone in Planning who has since moved on.":
"El significado se escribió una vez, en 2021, en un correo que Mei envió a alguien de Planificación que ya se fue.",
"It lived in one head, and one inbox, where no agent could read it.":
"Vivía en una cabeza, y en un buzón, donde ningún agente podía leerlo.",
"The agent wasn't careless: what an agent reads decides what it writes.":
"El agente no fue descuidado: lo que un agente lee decide lo que escribe.",
"Everything an agent reads for a job is its context, and in a data team it comes in four kinds.":
"Todo lo que un agente lee para un trabajo es su contexto, y en un equipo de datos viene en cuatro tipos.",
"Code: the repository, with its recipes, its tests, and its notes for agents.":
"Código: el repositorio, con sus recetas, sus pruebas y sus notas para agentes.",
"Metadata: what words mean, what each table promises, and where each number comes from.":
"Metadatos: qué significan las palabras, qué promete cada tabla y de dónde sale cada cifra.",
"Skills: how the team does a job, step by step.":
"Habilidades: cómo hace el equipo un trabajo, paso a paso.",
"And tools: what it can reach, and what it may do.":
"Y herramientas: lo que puede alcanzar, y lo que puede hacer.",
"Commencing was missing from the metadata, so the agent filled the gap with a guess, and said it like a fact.":
"«Commencing» faltaba en los metadatos, así que el agente llenó el hueco con una conjetura, y la dijo como un hecho.",
"Choosing what goes into that context, and writing it down, is context engineering.":
"Elegir qué entra en ese contexto, y escribirlo, es ingeniería de contexto.",
"Mei writes the meaning once, in the business glossary, where the university's words are defined, and she owns it.":
"Mei escribe el significado una vez, en el glosario de negocio, donde se definen las palabras de la universidad, y es su dueña.",
"The project copies it into Planning's data, with where it came from, and a new column carries it.":
"El proyecto lo copia en los datos de Planificación, con su origen, y una columna nueva lo lleva.",
"A test checks the column on four students: one new, one back from leave, one starting a second course, and one who began last year.":
"Una prueba revisa la columna con cuatro estudiantes: uno nuevo, uno de vuelta de licencia, uno en un segundo programa y uno del año pasado.",
"Planning's contract now promises the column, and says what it means.":
"El contrato de Planificación ahora promete la columna, y dice qué significa.",
"The notes for agents gain a rule: look a word up before you count by it; if it isn't there, ask its owner, don't guess.":
"Las notas para agentes suman una regla: busca una palabra antes de contar con ella; si no está, pregunta a su dueño, no adivines.",
"Until now, each person on the team wired up their own agent, with notes of their own.":
"Hasta ahora, cada persona del equipo armaba su propio agente, con sus propias notas.",
"Like the chant books named after their masters, each agent was its owner's: what one was told, no other knew.":
"Como los libros de canto con el nombre de sus maestros, cada agente era de su dueño: lo que a uno le decían, ningún otro lo sabía.",
"Now the team keeps one context, in the project, reviewed like code, with an owner for every meaning.":
"Ahora el equipo mantiene un solo contexto, en el proyecto, revisado como el código, con un dueño para cada significado.",
"Every agent, and every person, reads the same page.":
"Cada agente, y cada persona, lee la misma página.",
"When a meaning changes, its owner changes it once, and everyone reads the new one.":
"Cuando un significado cambia, su dueño lo cambia una vez, y todos leen el nuevo.",
"Jun asks his agent again.":
"Jun le pregunta otra vez a su agente.",
"This time it looks the word up, counts 6,212, and cites Mei's definition.":
"Esta vez busca la palabra, cuenta 6,212 y cita la definición de Mei.",
"A new analyst who joined Planning this week reads the same definition her agent reads.":
"Una analista nueva, que llegó a Planificación esta semana, lee la misma definición que lee su agente.",
"Like Guido's boys, they can both sing a chant they've never heard.":
"Como los niños de Guido, ambos pueden cantar un canto que nunca han oído.",
"Write it down once, and people and agents both use it.":
"Escríbelo una vez, y lo usan tanto las personas como los agentes."
});
