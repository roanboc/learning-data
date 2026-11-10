/* Skills and workflows: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the films before it: el conteo del día del censo, la cifra que la universidad informa al gobierno, estudiantes (never inscripciones),
   el informe del censo, carrera for a degree, la consulta, una prueba for a test, la oficina de registro, el sandbox. An agent's skill is una skill, as the file is
   named (as in Governed in dbt), and its name stays as it is on screen (reconcile-and-diff); the reconcile skill is la skill de conciliación; a router is un
   router, and a workflow un flujo de trabajo, as in the series' description. In Baghdad: al-Juarismi, as Spanish spells him, el califa, la Casa de la Sabiduría,
   calculistas for the reckoners, una herencia for an estate, un legado for a legacy, pleitos for lawsuits, and completar y equilibrar for the two moves (al-jabr
   keeps its name). Numbers with the picture's comma (18,412). Tú, as the film's first and last lines of advice speak to the viewer. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Baghdad, about twelve hundred years ago.":
"Bagdad, hace unos mil doscientos años.",
"Every day, its people need sums worked out.":
"Cada día, su gente necesita resolver cuentas.",
"Estates shared within families, legacies, fields divided, lawsuits, trade, land measured and canals dug.":
"Herencias repartidas en familia, legados, campos divididos, pleitos, comercio, tierras medidas y canales excavados.",
"The law sets each heir's share, and a legacy can leave part of an estate to someone outside the family.":
"La ley fija la parte de cada heredero, y un legado puede dejar parte de una herencia a alguien de fuera de la familia.",
"But each problem is worked out on its own, with its own tricks, and a new kind starts from nothing.":
"Pero cada problema se resuelve por separado, con sus propios trucos, y uno de un tipo nuevo empieza de cero.",
"One slip, and a widow or a child could get less than the law gives them.":
"Un error, y una viuda o un hijo podían recibir menos de lo que les da la ley.",
"And two reckoners could reach two answers for one estate.":
"Y dos calculistas podían llegar a dos respuestas para una misma herencia.",
"Something had to change.":
"Algo tenía que cambiar.",
"Encouraged by the caliph, Muhammad al-Khwarizmi, a scholar of the House of Wisdom, writes a short book.":
"Animado por el califa, Muhammad al-Juarismi, un sabio de la Casa de la Sabiduría, escribe un libro breve.",
"It teaches what people, in his words, constantly require.":
"Enseña lo que la gente, en sus palabras, necesita constantemente.",
"Two moves, completion and balancing, bring any problem to one of six forms.":
"Dos movimientos, completar y equilibrar, llevan cualquier problema a una de seis formas.",
"Each form has its own steps, worked through on an example, and proved with a drawn square.":
"Cada forma tiene sus pasos, resueltos con un ejemplo y probados con un cuadrado dibujado.",
"A square and ten roots make thirty-nine.":
"Un cuadrado y diez raíces dan treinta y nueve.",
"Halve the ten: five. Multiply it by itself: twenty-five. Add the thirty-nine: sixty-four. Take its root: eight. Take away the five: three.":
"La mitad de diez: cinco. Multiplícalo por sí mismo: veinticinco. Suma treinta y nueve: sesenta y cuatro. Su raíz: ocho. Resta cinco: tres.",
"Then come pages of real cases, legacies most of all.":
"Luego vienen páginas de casos reales, sobre todo de legados.",
"Now anyone who follows the steps can solve a problem they've never seen, the same way every time.":
"Ahora cualquiera que siga los pasos puede resolver un problema que nunca vio, de la misma forma cada vez.",
"The book was copied for centuries, and put into Latin in 1145.":
"El libro se copió durante siglos, y se tradujo al latín en 1145.",
"Its first move, al-jabr, gave us the word algebra; his own name gave us algorithm.":
"Su primer movimiento, al-jabr, nos dio la palabra álgebra; su propio nombre nos dio algoritmo.",
"Data teams have the same problem: a job solved in one chat is solved again in the next, from nothing.":
"Los equipos de datos tienen el mismo problema: una tarea resuelta en un chat se resuelve otra vez en el siguiente, desde cero.",
"Solve it once, write it down, and every agent can reuse it.":
"Resuélvelo una vez, escríbelo, y cualquier agente puede reutilizarlo.",
"Today, at the university, Jun's team keeps the census-day count right: 18,412 students, the number the university reports to the government.":
"Hoy, en la universidad, el equipo de Jun cuida el conteo del día del censo: 18,412 estudiantes, la cifra que se informa al gobierno.",
"Each time the count's code or its sources change, someone reconciles it.":
"Cada vez que cambian el código del conteo o sus fuentes, alguien lo concilia.",
"They check that it still matches the census report, the university's official count.":
"Revisan que siga coincidiendo con el informe del censo, el conteo oficial de la universidad.",
"When the two differ, someone has to find out why.":
"Cuando los dos difieren, alguien tiene que averiguar por qué.",
"The same few causes come back.":
"Vuelven las mismas pocas causas.",
"Students who withdrew after census day, and still count; a new degree that no faculty holds; a student counted twice.":
"Estudiantes que se retiraron tras el día del censo y aún cuentan; una carrera nueva sin facultad; un estudiante contado dos veces.",
"Each was found before, by a person or an agent, and settled by a person.":
"Cada una se encontró antes, por una persona o un agente, y la resolvió una persona.",
"But the answer stayed where it was found: in one chat, one note, one email.":
"Pero la respuesta quedó donde se encontró: en un chat, una nota, un correo.",
"So each time, the agent starts from nothing, and spends an afternoon finding what the team already knew.":
"Así que cada vez el agente empieza de cero, y pasa una tarde buscando lo que el equipo ya sabía.",
"And it may settle a cause another way than last time: two answers for one count.":
"Y puede resolver una causa de otra forma que la vez anterior: dos respuestas para un mismo conteo.",
"So Jun does the job once more, by hand, and writes down each step as he goes.":
"Así que Jun hace la tarea una vez más, a mano, y anota cada paso mientras avanza.",
"It becomes a skill: a file in the project, with a name, and a line that says when to use it.":
"Se convierte en una skill: un archivo del proyecto, con un nombre y una línea que dice cuándo usarla.",
"Then its steps: build the count, and compare it with the census report.":
"Luego sus pasos: construir el conteo y compararlo con el informe del censo.",
"Find the students behind any difference, and report each cause with its query.":
"Encontrar a los estudiantes detrás de cualquier diferencia, e informar cada causa con su consulta.",
"And then every cause met so far: how it shows, what settled it, and who decided.":
"Y luego cada causa vista hasta ahora: cómo se nota, qué la resolvió y quién decidió.",
"The agent doesn't read every skill all the time: just each one's name and line. It loads the steps only when a job needs them.":
"El agente no lee todas las skills todo el tiempo: solo el nombre y la línea de cada una. Carga los pasos solo cuando una tarea los necesita.",
"When a new case turns up, it gets a line too. Nothing is solved twice.":
"Cuando aparece un caso nuevo, también recibe su línea. Nada se resuelve dos veces.",
"It's al-Khwarizmi's book again: each form's steps, earned on real cases.":
"Es otra vez el libro de al-Juarismi: los pasos de cada forma, ganados con casos reales.",
"The project has seven skills, one for each job agents do most here.":
"El proyecto tiene siete skills, una para cada tarea que más hacen aquí los agentes.",
"So which one does a job need?":
"¿Y cuál necesita una tarea?",
"A router decides: a skill whose only job is to choose.":
"Lo decide un router: una skill cuya única tarea es elegir.",
"It reads the job, compares it with each skill's line, and loads the one that fits.":
"Lee la tarea, la compara con la línea de cada skill y carga la que encaja.",
"Check Jun's change before Noor signs it off: reconcile and diff.":
"Revisar el cambio de Jun antes de que Noor lo apruebe: reconcile-and-diff.",
"When no skill fits, it doesn't guess: it says so, and asks a person.":
"Cuando ninguna skill encaja, no adivina: lo dice y le pregunta a una persona.",
"That job is done by hand first, and may become the next skill.":
"Esa tarea se hace primero a mano, y puede volverse la próxima skill.",
"Completion and balancing did the same: they brought each problem to the one form whose steps would solve it.":
"Completar y equilibrar hacían lo mismo: llevaban cada problema a la forma cuyos pasos lo resolverían.",
"Some work needs no choosing. Every night, the count is built again from the day's records.":
"Hay trabajo que no exige elegir. Cada noche, el conteo se construye otra vez con los registros del día.",
"A workflow runs it: fixed steps, in order, the same way every time.":
"Lo ejecuta un flujo de trabajo: pasos fijos, en orden, de la misma forma cada vez.",
"Build. Count as on census day. Run the tests. Compare with the census report.":
"Construir. Contar como el día del censo. Ejecutar las pruebas. Comparar con el informe del censo.",
"When they agree, that's the whole job, and no agent is needed.":
"Cuando coinciden, ese es todo el trabajo, y no hace falta ningún agente.",
"Automate what's known with plain steps first; keep the agent for what isn't.":
"Automatiza primero lo conocido con pasos simples; deja al agente para lo que no se conoce.",
"Only when the numbers don't agree does the workflow call the agent, as one more step, with the reconcile skill.":
"Solo cuando las cifras no coinciden, el flujo de trabajo llama al agente, como un paso más, con la skill de conciliación.",
"The agent finds out why. A person decides.":
"El agente averigua por qué. Una persona decide.",
"In the book, too, a form's steps never change. The thinking is in bringing each problem to its form.":
"En el libro, también, los pasos de una forma nunca cambian. Lo que exige pensar es llevar cada problema a su forma.",
"One night in October, the numbers don't agree: 18,426 against 18,412.":
"Una noche de octubre, las cifras no coinciden: 18,426 contra 18,412.",
"The tests pass, so the workflow calls the agent.":
"Las pruebas pasan: el flujo de trabajo llama al agente.",
"It loads the reconcile skill, and checks the causes met so far, one by one. None fits.":
"Carga la skill de conciliación y revisa las causas vistas hasta ahora, una por una. Ninguna encaja.",
"So it finds the records behind the difference: fourteen, all made last week, and all dated back to February.":
"Así que busca los registros detrás de la diferencia: catorce, todos creados la semana pasada, y todos con fecha de febrero.",
"In its sandbox, it drafts a report: the cause, the query that shows it, and a question. Are these students?":
"En su sandbox, redacta un informe: la causa, la consulta que la muestra y una pregunta. ¿Son estudiantes?",
"In the morning, Mei, in the registrar's office, decides: they're test records, made to try a new screen, and test records never count.":
"Por la mañana, Mei, de la oficina de registro, decide: son registros de prueba, hechos para probar una pantalla nueva, y esos nunca cuentan.",
"Jun adds the cause to the skill, with Mei's answer, and turns the rule into one more fixed step, with a test.":
"Jun agrega la causa a la skill, con la respuesta de Mei, y convierte la regla en un paso fijo más, con una prueba.",
"Noor approves the change before it runs.":
"Noor aprueba el cambio antes de que se ejecute.",
"The next night, the workflow leaves the fourteen out by itself, and calls no agent.":
"La noche siguiente, el flujo de trabajo deja fuera a los catorce por sí solo, y no llama a ningún agente.",
"In Baghdad, al-Khwarizmi solved each kind of problem once, wrote it down, and people followed his steps for centuries.":
"En Bagdad, al-Juarismi resolvió cada tipo de problema una vez, lo escribió, y la gente siguió sus pasos durante siglos.",
"At the university, a job done once by hand became a skill. A router finds it. A workflow runs what's known, the same way every night.":
"En la universidad, lo hecho una vez a mano se volvió una skill. Un router la encuentra. Un flujo de trabajo ejecuta lo conocido cada noche.",
"The agent is called only where thinking is needed, and a person decides.":
"Al agente se le llama solo donde hace falta pensar, y una persona decide.",
"Each new case is written down, so it's never solved twice.":
"Cada caso nuevo queda escrito, así que nunca se resuelve dos veces.",
"Solve it once, write it down, reuse it.":
"Resuélvelo una vez, escríbelo, reutilízalo."});
