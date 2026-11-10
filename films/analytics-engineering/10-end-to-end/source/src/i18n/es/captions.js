/* End to end: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In the fourteenth century, the masons building York Minster drew their windows full size, on a floor of plaster.":
"En el siglo XIV, los canteros que construían la catedral de York dibujaban sus ventanas a tamaño real, sobre un piso de yeso.",
"From each drawing they cut a wooden template, and carved the stone to match it.":
"De cada dibujo cortaban una plantilla de madera, y tallaban la piedra para que coincidiera con ella.",
"When a window was done, the next was drawn over it. In time, the floor was plastered again.":
"Cuando una ventana estaba lista, la siguiente se dibujaba encima. Con el tiempo, el piso se cubría otra vez de yeso.",
"The drawings were for the work. The windows are what stayed.":
"Los dibujos eran para el trabajo. Las ventanas son lo que quedó.",
"A project has both: files for the work, deleted when it's done, and files that stay. This is one new question, from start to end.":
"Un proyecto tiene ambos: archivos para el trabajo, que se borran cuando está hecho, y archivos que se quedan. Esta es una pregunta nueva, de principio a fin.",
"A new consumer arrives: Finance.":
"Llega un consumidor nuevo: Finanzas.",
"How much tuition does recognised credit save learners, by faculty, as at census date?":
"¿Cuánto ahorran los estudiantes en matrícula gracias a los créditos reconocidos, por facultad, a la fecha del censo?",
"The answer sets next year's revenue forecast, and what a microcredential should cost.":
"La respuesta fija la previsión de ingresos del año próximo, y cuánto debería costar una microcredencial.",
"Finance is a business domain: it decides with the data. So it gets folders of its own, named for it, from the first commit.":
"Finanzas es un dominio de negocio: decide con los datos. Así que tiene carpetas propias, con su nombre, desde el primer commit.",
"Step one is the scope. Its conceptual model holds the question; its decision log, the first decision: recognised credit only, read from the public core.":
"El paso uno es el alcance. Su modelo conceptual guarda la pregunta; su registro de decisiones, la primera decisión: solo créditos reconocidos, leídos del núcleo público.",
"And one file that won't last: Finance's open requirements. The first says what done looks like: match Finance's own number.":
"Y un archivo que no va a durar: los requisitos abiertos de Finanzas. El primero dice cómo se ve el trabajo terminado: dar el mismo número que Finanzas.",
"Who does the work, and when, lives in the team's backlog tool. The project keeps only what's still open.":
"Quién hace el trabajo, y cuándo, vive en la herramienta de backlog del equipo. El proyecto guarda solo lo que sigue abierto.",
"Step two: what the data really holds. Finance reads the core, not the sources, so the agent profiles the core.":
"Paso dos: lo que de verdad contienen los datos. Finanzas lee el núcleo, no las fuentes, así que el agente perfila el núcleo.",
"Recognised credit counts towards every award it could count towards. Aisha's counts towards three.":
"Los créditos reconocidos cuentan para cada título para el que podrían contar. Los de Aisha cuentan para tres.",
"Added up across awards, that's 385 credit points. In the award each learner is enrolled in, 160.":
"Sumados entre títulos, son 385 créditos. En el título en que está inscrito cada estudiante, 160.",
"Which one saves the tuition? No rule can say. A question opens, with the query as evidence, and Finance owns the answer.":
"¿Cuál ahorra la matrícula? Ninguna regla puede decirlo. Se abre una pregunta, con la consulta como evidencia, y la respuesta es de Finanzas.",
"Finance brings one thing of its own: the tuition rates it publishes, as reference data it owns.":
"Finanzas aporta algo propio: las tarifas de matrícula que publica, como datos de referencia de los que es dueña.",
"Step three: the output. First, Finance answers: only the award the learner is enrolled in, on census day.":
"Paso tres: el resultado. Primero, Finanzas responde: solo el título en que el estudiante está inscrito, el día del censo.",
"The answer goes where it lasts: a rule in Finance's conceptual model, and a decision in its log.":
"La respuesta va donde perdura: una regla en el modelo conceptual de Finanzas, y una decisión en su registro.",
"And the question is deleted. Git keeps it, and the decision says where it came from.":
"Y la pregunta se borra. Git la conserva, y la decisión dice de dónde vino.",
"Then the output, before any code: one row per learner per award they're enrolled in, as at census date.":
"Luego el resultado, antes de cualquier código: una fila por estudiante y por título en que está inscrito, a la fecha del censo.",
"That's a requirement too, open until a contract enforces it.":
"Eso también es un requisito, abierto hasta que un contrato lo haga cumplir.",
"Step four: the promise. Finance's mart gets a contract: the columns and types the forecast needs, enforced.":
"Paso cuatro: la promesa. El mart de Finanzas recibe un contrato: las columnas y los tipos que necesita la previsión, exigidos.",
"For now it's an empty table, the right shape with no rows, and the forecast is declared as what depends on it.":
"Por ahora es una tabla vacía, con la forma correcta y sin filas, y la previsión se declara como lo que depende de ella.",
"One gap: the project knows the published rate, not what each learner was charged. Scholarships and discounts aren't in.":
"Una brecha: el proyecto conoce la tarifa publicada, no lo que se le cobró a cada estudiante. Las becas y los descuentos no están.",
"Finance accepts it. It becomes a known limitation, on the mart, with a decision that says why.":
"Finanzas la acepta. Se vuelve una limitación conocida, en el mart, con una decisión que dice por qué.",
"Step five: the tests, before the logic.":
"Paso cinco: las pruebas, antes de la lógica.",
"The grain, tested as a key. Learners that exist. Only the award types Finance prices.":
"La granularidad, probada como clave. Estudiantes que existen. Solo los tipos de título a los que Finanzas pone precio.",
"A unit test for the rule: credit that counts towards two awards still saves tuition once.":
"Una prueba unitaria para la regla: un crédito que cuenta para dos títulos ahorra matrícula una sola vez.",
"And Finance's own number, from its spreadsheet, as an expected seed that no model may read. A reconciliation compares the two.":
"Y el número propio de Finanzas, de su planilla, como un seed esperado que ningún modelo puede leer. Una conciliación compara los dos.",
"Nothing can pass yet. The unit test fails, so dbt doesn't even build the mart.":
"Todavía nada puede pasar. La prueba unitaria falla, así que dbt ni siquiera construye el mart.",
"But the grain is tested and the contract enforced, so the output requirement is done, and deleted.":
"Pero la granularidad está probada y el contrato se cumple, así que el requisito del resultado está hecho, y se borra.",
"Step six: the logic.":
"Paso seis: la lógica.",
"It reads the core as it was on census day, keeps the award each learner was enrolled in, and prices the credit at that year's rate.":
"Lee el núcleo tal como estaba el día del censo, se queda con el título en que estaba inscrito cada estudiante, y pone precio al crédito con la tarifa de ese año.",
"It reads nothing but the public core and Finance's own rates. No other team's model changes.":
"No lee nada más que el núcleo público y las tarifas de Finanzas. No cambia el modelo de ningún otro equipo.",
"It's short, because the core already did the hard parts: identity, timelines, and the credit itself.":
"Es corta, porque el núcleo ya hizo lo difícil: la identidad, las líneas de tiempo y el propio crédito.",
"Every test passes: 67,800 dollars, across four faculties.":
"Pasan todas las pruebas: 67 800 dólares, en cuatro facultades.",
"Step seven: validate. Faculty by faculty, against Finance's report. The difference is zero.":
"Paso siete: validar. Facultad por facultad, contra el informe de Finanzas. La diferencia es cero.",
"Then the diff against main, built from scratch: every core table, Planning's mart, the wallet's.":
"Luego el diff contra main, construido desde cero: cada tabla del núcleo, el mart de Planificación, el de la billetera.",
"No key added, none lost, no column changed. A new consumer moved nobody else's numbers.":
"Ninguna clave agregada, ninguna perdida, ninguna columna cambiada. Un consumidor nuevo no movió los números de nadie más.",
"Finance signs off, with every row in front of it.":
"Finanzas aprueba, con cada fila delante.",
"Step eight: review and ship.":
"Paso ocho: revisar y publicar.",
"The last open item, match Finance's number, is done: the reconciliation enforces it on every build.":
"El último punto abierto, dar el número de Finanzas, está hecho: la conciliación lo exige en cada build.",
"So the item is deleted, and with it Finance's requirements file, and its folder.":
"Así que el punto se borra, y con él el archivo de requisitos de Finanzas, y su carpeta.",
"A check in CI makes sure of it: nothing stays in requirements unless it's still open.":
"Una verificación en la CI se asegura de eso: nada se queda en los requisitos salvo que siga abierto.",
"Jun approves the code, and Finance its number. The agent never merges.":
"Jun aprueba el código, y Finanzas su número. El agente nunca fusiona.",
"Step nine: the agent reviews the metadata.":
"Paso nueve: el agente revisa los metadatos.",
"Two descriptions were written twice, word for word: the award's code and its name, in Finance's YAML and in Planning's.":
"Dos descripciones estaban escritas dos veces, palabra por palabra: el código del título y su nombre, en el YAML de Finanzas y en el de Planificación.",
"The award belongs to the course domain, so each becomes one doc block there, shown everywhere it's needed.":
"El título pertenece al dominio course, así que cada una se vuelve un doc block allí, que se muestra dondequiera que haga falta.",
"Zero descriptions written twice. The generated pages, the definitions, the diagram and the index of decisions, keep up on their own.":
"Cero descripciones escritas dos veces. Las páginas generadas, las definiciones, el diagrama y el índice de decisiones, se mantienen al día solas.",
"Step ten: operate and evolve. Finance pins the versions of the core it reads.":
"Paso diez: operar y evolucionar. Finanzas fija las versiones del núcleo que lee.",
"A new version reaches Finance as a choice with a date, and the lineage names Finance among who to tell.":
"Una versión nueva le llega a Finanzas como una elección con fecha, y el linaje nombra a Finanzas entre a quién avisar.",
"And because Finance's folders were named for it from the first commit, Finance can move out to a project of its own, whole.":
"Y como las carpetas de Finanzas llevan su nombre desde el primer commit, Finanzas puede mudarse a un proyecto propio, entera.",
"Its marts, its exposure, its seeds, its decisions, and the test and two analyses it was built with.":
"Sus marts, su exposición, sus seeds, sus decisiones, y la prueba y los dos análisis con que se construyó.",
"Four phases, ten steps, ten commits. You can replay them one by one, in the repository.":
"Cuatro fases, diez pasos, diez commits. Puedes repetirlos uno por uno, en el repositorio.",
"Some files arrived to stay: the question, the decisions, the contract, the tests, the model.":
"Algunos archivos llegaron para quedarse: la pregunta, las decisiones, el contrato, las pruebas, el modelo.",
"Some were for the work: three open items, and the file that held them. They're gone. The project says only what's still open.":
"Otros eran para el trabajo: tres puntos abiertos, y el archivo que los contenía. Ya no están. El proyecto dice solo lo que sigue abierto.",
"Every file has a home. Sources by system: application domains. The core by meaning: data domains. Marts and exposures by who decides: business domains.":
"Cada archivo tiene un hogar. Las fuentes, por sistema: dominios de aplicación. El núcleo, por significado: dominios de datos. Los marts y las exposiciones, por quién decide: dominios de negocio.",
"And every file has a lifetime: written by hand, generated, or kept only while the work goes on.":
"Y cada archivo tiene una vida: escrito a mano, generado, o guardado solo mientras dura el trabajo.",
"The next question will start the same way: in folders of its own, with one file that won't last.":
"La próxima pregunta empezará igual: en carpetas propias, con un archivo que no va a durar.",
"That's the series. A question and its meaning, the sources, the consumers, promises and proofs, layers, the trusted number, an agent on the team, written once, and change.":
"Esa es la serie. Una pregunta y su significado, las fuentes, los consumidores, promesas y pruebas, capas, el número confiable, un agente en el equipo, escrito una sola vez, y el cambio.",
"The model is the blueprint. dbt is how you build it.":
"El modelo es el plano. dbt es cómo lo construyes.",
"Declare it. Then build it.":
"Decláralo. Luego constrúyelo.",
});
