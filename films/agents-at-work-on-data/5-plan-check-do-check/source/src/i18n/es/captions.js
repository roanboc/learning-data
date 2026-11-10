/* Plan, define the check, do, check: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: el conteo del día del censo and el informe del censo, Planificación; una verificación for a check and una
   prueba for a test, which pasa or falla; el plan, una página; las herramientas, which keep the names they have on screen (Catalog, Query, Docs), de solo
   lectura; su propia rama and su entorno aislado for its branch and its sandbox; producción; una ronda for a round; una solicitud de cambio for a pull
   request; el glosario, los metadatos, una skill (as the file is named), whose name is conciliar y comparar, as in Un agente en el equipo. The levels:
   pregrado, posgrado, and sin titulación for non-award; estudiantes de intercambio, asignaturas sueltas. In Singapore: parámetros for the measures (as
   water standards call them in Spanish), las normas de agua potable, el panel de expertos, el desfile, los embalses. Noor, la arquitecta de datos. Tú, as
   the film speaks to the viewer (Decide). Numbers keep the picture's comma (18,412; 60,000), as the series' other Spanish captions do, so a viewer reads
   the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Singapore, in the late 1990s: an island city of four million people, with little land to catch the rain.":
"Singapur, a finales de los noventa: una ciudad isla de cuatro millones de personas, con poca tierra para recoger la lluvia.",
"Much of its water is piped in from Malaysia, under two agreements: one ends in 2011, the other in 2061.":
"Gran parte de su agua llega por tubería desde Malasia, con dos acuerdos: uno termina en 2011 y el otro en 2061.",
"Engineers can clean used water, from the city's sinks and drains, until it's pure enough to drink.":
"Los ingenieros pueden limpiar el agua usada de fregaderos y desagües hasta que sea lo bastante pura para beber.",
"But would anyone drink water that had gone down a drain?":
"Pero ¿alguien bebería agua que se fue por un desagüe?",
"If people don't trust it, the country can't use it, and stays dependent on water from across the border.":
"Si la gente no confía en ella, el país no puede usarla, y sigue dependiendo del agua del otro lado de la frontera.",
"Something has to make it trustworthy, before anyone drinks a drop.":
"Algo tiene que hacerla confiable antes de que alguien beba una gota.",
"So, in 1998, the water agency and the environment ministry begin a study.":
"Así que, en 1998, la agencia del agua y el ministerio del ambiente empiezan un estudio.",
"Before the test plant makes any water, they write down how it will be judged:":
"Antes de que la planta de prueba produzca agua, escriben cómo se la va a juzgar:",
"190 measures, physical, chemical and microbiological, from the world's drinking-water standards.":
"190 parámetros, físicos, químicos y microbiológicos, de las normas de agua potable del mundo.",
"And a panel of experts, from Singapore and abroad, helps set the rules, and checks the results, for two years.":
"Y un panel de expertos, de Singapur y del extranjero, ayuda a fijar las reglas, y verifica los resultados, durante dos años.",
"In July 2002, the panel reports: the water is well within the standards.":
"En julio de 2002, el panel informa: el agua está holgadamente dentro de las normas.",
"That August, at the parade for the country's birthday, about 60,000 people raise a bottle of it, and drink.":
"Ese agosto, en el desfile del cumpleaños del país, unas 60,000 personas levantan una botella de esa agua, y beben.",
"Since 2003, it has flowed into the reservoirs: water the country makes itself.":
"Desde 2003, fluye a los embalses: agua que el país produce por sí mismo.",
"Today it's tested for about 300 measures, and experts from outside still audit it every year.":
"Hoy se analiza en unos 300 parámetros, y expertos externos todavía la auditan cada año.",
"At the university, Jun's agent is about to change the census-day count, the number the university reports to the government.":
"En la universidad, el agente de Jun está por cambiar el conteo del día del censo, el número que la universidad informa al gobierno.",
"If nobody decides first how its work will be checked, nobody can trust what it brings back.":
"Si nadie decide primero cómo se verificará su trabajo, nadie puede confiar en lo que trae de vuelta.",
"Decide the check before it starts, and its work is something the team can use.":
"Decide la verificación antes de que empiece, y su trabajo será algo que el equipo pueda usar.",
"Once, one of the team's agents was given a goal and nothing else: check the count against the census rules.":
"Una vez, a uno de los agentes del equipo le dieron un objetivo y nada más: verificar el conteo contra las reglas del censo.",
"Its plan didn't say what it could use, so it did what it knew: it searched the web for the census rules.":
"Su plan no decía qué podía usar, así que hizo lo que sabía: buscó en la web las reglas del censo.",
"It read 38 web pages, in 40 minutes.":
"Leyó 38 páginas web, en 40 minutos.",
"Docs, the tool with the university's own definitions, would have answered in one call.":
"Docs, la herramienta con las definiciones propias de la universidad, habría respondido en una llamada.",
"And the rule it brought back was another university's.":
"Y la regla que trajo era de otra universidad.",
"Jun caught it in review, and the work began again.":
"Jun lo detectó en la revisión, y el trabajo empezó de nuevo.",
"Nothing in the agent was broken: it used what it could find, because nobody had said what was there.":
"Nada en el agente estaba roto: usó lo que pudo encontrar, porque nadie le había dicho qué había.",
"Most of the waste with agents starts here, with a plan that doesn't say what the agent may use.":
"La mayor parte del desperdicio con agentes empieza aquí, con un plan que no dice qué puede usar el agente.",
"Now Clara, in Planning, asks for the census-day count by level of study, for the government's report.":
"Ahora Clara, de Planificación, pide el conteo del día del censo por nivel de estudio, para el informe al gobierno.",
"Before the agent starts, Jun writes one page.":
"Antes de que el agente empiece, Jun escribe una página.",
"The goal: students on census day, by level, undergraduate and postgraduate.":
"El objetivo: estudiantes el día del censo, por nivel, pregrado y posgrado.",
"What to read: the glossary's words for student, census day and level of study, and the census-day count it builds on.":
"Qué leer: las palabras del glosario para estudiante, día del censo y nivel de estudio, y el conteo del día del censo en que se basa.",
"The tools it may use: Catalog, Query and Docs, read only.":
"Las herramientas que puede usar: Catalog, Query y Docs, de solo lectura.",
"Where it may write: only its own branch, and its sandbox.":
"Dónde puede escribir: solo en su propia rama, y en su entorno aislado.",
"What it must never do: read names or student IDs, or write to production.":
"Lo que nunca debe hacer: leer nombres o códigos de estudiante, ni escribir en producción.",
"And a limit: ten rounds, then it stops and reports.":
"Y un límite: diez rondas, y luego se detiene e informa.",
"Then the line that matters most: how the result will be checked, decided now, before any work.":
"Luego, la línea que más importa: cómo se verificará el resultado, decidido ahora, antes de cualquier trabajo.",
"But nobody knows the answer yet: that's why Clara asked.":
"Pero nadie sabe todavía la respuesta: por eso Clara la pidió.",
"What Jun knows is what must be true of any right answer:":
"Lo que Jun sabe es lo que debe cumplir cualquier respuesta correcta:",
"the levels add up to 18,412, the count already matched to the census report;":
"los niveles suman 18,412, el conteo que ya coincide con el informe del censo;",
"and every student has exactly one level, as the glossary defines it.":
"y cada estudiante tiene exactamente un nivel, como lo define el glosario.",
"Neither says how many students are at any level: they check how the parts relate, and what the words mean.":
"Ninguna dice cuántos estudiantes hay en cada nivel: verifican cómo se relacionan las partes y qué significan las palabras.",
"The agent writes the two checks as tests, before any model, and Jun approves them.":
"El agente escribe las dos verificaciones como pruebas, antes de cualquier modelo, y Jun las aprueba.",
"From then on, only a person can change them, so the agent can't pass by moving the mark.":
"Desde entonces, solo una persona puede cambiarlas, así que el agente no puede pasar moviendo la marca.",
"And what everyone already uses can be wrong, sometimes for years: if the data disagrees, the agent says so, with its evidence.":
"Y lo que todos ya usan puede estar mal, a veces durante años: si los datos no coinciden, el agente lo dice, con su evidencia.",
"Where nobody can say what's right, it brings the options, each with its result, for a person to choose.":
"Donde nadie puede decir qué es lo correcto, trae las opciones, cada una con su resultado, para que una persona elija.",
"Like Singapore's 190 measures, written before the plant made any water:":
"Como los 190 parámetros de Singapur, escritos antes de que la planta produjera agua:",
"none said what the results would be, only what the water had to meet.":
"ninguno decía cuáles serían los resultados, solo lo que el agua debía cumplir.",
"Now the agent works, in its sandbox, with only the tools the plan gave it.":
"Ahora el agente trabaja, en su entorno aislado, solo con las herramientas que le dio el plan.",
"It reads the three words in Docs, finds the tables in Catalog, and builds the count by level.":
"Lee las tres palabras en Docs, encuentra las tablas en Catalog, y construye el conteo por nivel.",
"The first run fails a test: the two levels add up to 18,384.":
"La primera ejecución falla una prueba: los dos niveles suman 18,384.",
"Twenty-eight students are missing.":
"Faltan veintiocho estudiantes.",
"It looks, with Query: on census day, 28 students have no level.":
"Busca, con Query: el día del censo, 28 estudiantes no tienen nivel.",
"They're exchange students, taking single units, with no degree here.":
"Son estudiantes de intercambio, que toman asignaturas sueltas, sin un título aquí.",
"And it isn't new: since 2021, when exchange students moved to a system of their own, none has had a level.":
"Y no es nuevo: desde 2021, cuando los estudiantes de intercambio pasaron a un sistema propio, ninguno tiene nivel.",
"So every split by level since then was short, and nothing checked that the levels added up.":
"Así que cada desglose por nivel desde entonces quedó corto, y nada verificaba que los niveles sumaran.",
"It doesn't drop them, and it doesn't touch the test.":
"No los descarta, y no toca la prueba.",
"Which level they belong to is a meaning, and meanings are Mei's to decide.":
"A qué nivel pertenecen es un significado, y los significados los decide Mei.",
"So it stops, and asks her, with its query, the result, and two options that both add up:":
"Así que se detiene, y le pregunta, con su consulta, el resultado y dos opciones, y ambas suman:",
"a level of their own, or the level each one studies at home.":
"un nivel propio, o el nivel que cada uno cursa en su universidad de origen.",
"Mei checks the government's list: they count as non-award, a level of its own.":
"Mei revisa la lista del gobierno: cuentan como sin titulación, un nivel propio.",
"And the years before go to Planning, with the agent's evidence, for people to look into.":
"Y los años anteriores pasan a Planificación, con la evidencia del agente, para que las personas los revisen.",
"The agent adds the third level, and runs the tests again: 13,906, 4,478 and 28 add up to 18,412, and every student has one level.":
"El agente agrega el tercer nivel, y corre las pruebas de nuevo: 13,906, 4,478 y 28 suman 18,412, y cada estudiante tiene un nivel.",
"Both tests pass.":
"Las dos pruebas pasan.",
"It writes the model's description from the glossary, with its source, and opens a pull request:":
"Escribe la descripción del modelo a partir del glosario, con su fuente, y abre una solicitud de cambio:",
"what it changed, why, and the evidence for every claim.":
"qué cambió, por qué, y la evidencia de cada afirmación.",
"Now a person checks the work, against the plan, not against the agent's word.":
"Ahora una persona verifica el trabajo, contra el plan, no contra la palabra del agente.",
"Jun reads the pull request: the goal met, only the tools it was given, no names, and both tests untouched, and green.":
"Jun lee la solicitud de cambio: objetivo cumplido, solo las herramientas dadas, ningún nombre, y las dos pruebas intactas y en verde.",
"It took four of its ten rounds.":
"Le tomó cuatro de sus diez rondas.",
"Now the change is his: if the count is wrong, he answers for it, not the agent.":
"Ahora el cambio es suyo: si el conteo está mal, responde él, no el agente.",
"To reach production, a second person must approve it: Noor, the data architect.":
"Para llegar a producción, una segunda persona debe aprobarlo: Noor, la arquitecta de datos.",
"The agent can review, too, but only for reference: it never approves.":
"El agente también puede revisar, pero solo como referencia: nunca aprueba.",
"As in Singapore, the work is held to its checks by people who didn't do it.":
"Como en Singapur, personas que no hicieron el trabajo lo miden con sus verificaciones.",
"And each loop leaves something for the next one.":
"Y cada vuelta del bucle deja algo para la siguiente.",
"A decision, recorded: Mei's rule for exchange students, with her name.":
"Una decisión, registrada: la regla de Mei para estudiantes de intercambio, con su nombre.",
"Metadata: level of study, in the glossary and in the model's description, with its source.":
"Metadatos: nivel de estudio, en el glosario y en la descripción del modelo, con su fuente.",
"A skill, updated: reconcile and diff now checks that every split adds up to its total.":
"Una skill, actualizada: conciliar y comparar ahora verifica que cada desglose sume su total.",
"And the plan itself: the next one starts from this page.":
"Y el plan mismo: el próximo empieza desde esta página.",
"In Singapore, the measures were set before the first drop, and people from outside held the water to them.":
"En Singapur, los parámetros se fijaron antes de la primera gota, y personas externas midieron el agua con ellos.",
"So when 60,000 people raised a bottle, they had good reason to trust it.":
"Así, cuando 60,000 personas levantaron una botella, tenían motivos para confiar en ella.",
"At the university, the checks came before the agent's first step, and a person held its work to them.":
"En la universidad, las verificaciones llegaron antes del primer paso del agente, y una persona midió su trabajo con ellas.",
"So the count can go to the government, with its evidence.":
"Así que el conteo puede ir al gobierno, con su evidencia.",
"Decide how you'll check before the agent starts.":
"Decide cómo vas a verificar antes de que el agente empiece."
});
