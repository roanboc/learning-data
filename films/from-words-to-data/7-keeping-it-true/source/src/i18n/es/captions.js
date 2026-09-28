/* Keeping it true: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 1755, Samuel Johnson published his dictionary. He had hoped to fix the English language in place.":
"En 1755, Samuel Johnson publicó su diccionario. Había esperado fijar la lengua inglesa para siempre.",
"In its preface, he admitted that no dictionary can embalm a language. The Oxford English Dictionary is still being revised today.":
"En el prefacio, admitió que ningún diccionario puede embalsamar una lengua. El Oxford English Dictionary se sigue revisando hoy.",
"In 2006, astronomers agreed a definition of planet. Nothing in the sky changed, and the count went from nine to eight.":
"En 2006, los astrónomos acordaron una definición de planeta. Nada cambió en el cielo, y la cuenta pasó de nueve a ocho.",
"In 2019, even the kilogram got a new definition.":
"En 2019, hasta el kilogramo recibió una nueva definición.",
"Meaning moves. Every definition needs an owner, a date and a version.":
"El significado se mueve. Toda definición necesita un responsable, una fecha y una versión.",
"At the university, three changes arrive in one month.":
"En la universidad, llegan tres cambios en un mismo mes.",
"The government adds a new field to what universities report about microcredentials.":
"El gobierno agrega un campo nuevo a lo que las universidades informan sobre microcredenciales.",
"A credential was issued in error, and has to be revoked.":
"Una credencial se emitió por error, y hay que revocarla.",
"And a new measure, completion rate, appears in three dashboards, with three different definitions.":
"Y una medida nueva, la tasa de finalización, aparece en tres tableros, con tres definiciones distintas.",
"Models rarely break all at once. They drift.":
"Los modelos rara vez se rompen de golpe. Se desvían.",
"A value nobody announced, as in Silent change. A column whose meaning slowly shifts. One measure, defined twice. A standard, updated for a new year.":
"Un valor que nadie anunció, como en Cambio silencioso. Una columna cuyo significado cambia poco a poco. Una medida, definida dos veces. Un estándar, actualizado para un año nuevo.",
"Drift is the gap between what's written down and what's actually used.":
"La deriva es la brecha entre lo que está escrito y lo que realmente se usa.",
"This is where AI helps first. An agent can read the catalog, the lineage, the queries people run, and new data as it arrives.":
"Aquí es donde la IA ayuda primero. Un agente puede leer el catálogo, el linaje, las consultas que ejecuta la gente, y los datos nuevos a medida que llegan.",
"It compares each definition in the glossary with the code that calculates it, and spots where the two have parted.":
"Compara cada definición del glosario con el código que la calcula, y detecta dónde se separaron.",
"It flags each drift, with evidence: three definitions of completion rate, and the dashboards that use each one.":
"Señala cada deriva, con evidencia: tres definiciones de la tasa de finalización, y los tableros que usan cada una.",
"Noticing is tedious for people, and cheap for machines.":
"Notar es tedioso para las personas, y barato para las máquinas.",
"Then it drafts the change.":
"Luego redacta el cambio.",
"A new entry for the glossary. A new statement in the ontology. The logical model, the mapping to the government's field, the semantic layer, the contract, the tests, and a note saying why.":
"Una entrada nueva para el glosario. Una afirmación nueva en la ontología. El modelo lógico, la correspondencia con el campo del gobierno, la capa semántica, el contrato, las pruebas, y una nota que dice por qué.",
"Drafting is cheap now. Judging the draft is still the job.":
"Redactar ya es barato. El trabajo sigue siendo evaluar el borrador.",
"Mei, from the registrar's office, approves the meaning. Noor, the architect, approves the model. The teams approve the build.":
"Mei, de Registro académico, aprueba el significado. Noor, la arquitecta, aprueba el modelo. Los equipos aprueban la construcción.",
"The agent's draft goes through the same review as anyone's. The tests run on the proposed change, before anything ships.":
"El borrador del agente pasa por la misma revisión que el de cualquiera. Las pruebas se ejecutan sobre el cambio propuesto, antes de publicar nada.",
"The agent recommends. People approve. Everything is versioned.":
"El agente recomienda. Las personas aprueban. Todo queda versionado.",
"A confident draft can invent a definition that nobody agreed.":
"Un borrador seguro de sí mismo puede inventar una definición que nadie acordó.",
"A change can slip through that nobody reviewed. And an agent that learns from old reports can propose an old meaning back.":
"Puede colarse un cambio que nadie revisó. Y un agente que aprende de informes antiguos puede proponer de nuevo un significado antiguo.",
"So the tests and the contracts check the agent's work too, just as they check ours.":
"Por eso las pruebas y los contratos comprueban también el trabajo del agente, igual que el nuestro.",
"Follow one change all the way through.":
"Sigue un cambio de punta a punta.",
"Completion rate gets one definition in the glossary, one statement in the ontology, one measure in the semantic layer, and one test.":
"La tasa de finalización recibe una definición en el glosario, una afirmación en la ontología, una medida en la capa semántica, y una prueba.",
"The three dashboards agree. Genie gives the same number, and shows why.":
"Los tres tableros coinciden. Genie da la misma cifra, y muestra por qué.",
"Last year's report still reads with last year's definition, version two, unchanged. Each number keeps the meaning it had.":
"El informe del año pasado se sigue leyendo con la definición de ese año, la versión dos, sin cambios. Cada cifra conserva el significado que tenía.",
"And the sketch's stamp finally reads: version three.":
"Y el sello del boceto por fin dice: versión tres.",
"Back to the start of the series: a word, an idea, a thing, and a mark in clay.":
"De vuelta al comienzo de la serie: una palabra, una idea, una cosa, y una marca en la arcilla.",
"A credential is a claim that others can check. So is every number in a report.":
"Una credencial es una afirmación que otros pueden comprobar. También lo es cada cifra de un informe.",
"The tools have changed. The job hasn't: agree what things are, write it down, and keep it true.":
"Las herramientas cambiaron. El trabajo no: acordar qué son las cosas, escribirlo, y que siga siendo verdad."
});
