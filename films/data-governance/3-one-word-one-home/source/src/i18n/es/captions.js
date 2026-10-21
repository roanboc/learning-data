/* One word, one home: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series: título for an award, Planificación, la oficina de registro, dueño, tablero, la app de billetera, glosario de negocio, un pull request.
   "One home" is "un solo lugar", as in the film's Spanish title, Una palabra, un solo lugar. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 221 BC, the king of Qin conquered the last of his rivals, and became China's first emperor.":
"En el 221 a. C., el rey de Qin venció al último de sus rivales y se convirtió en el primer emperador de China.",
"The old states had their own scripts, weights and cart widths. The empire made them one.":
"Los viejos estados tenían su propia escritura, sus pesos y su ancho de carro. El imperio los hizo uno.",
"It even decided which words its officials used: what had been the king's was now the emperor's.":
"Hasta decidió qué palabras usaban sus funcionarios: lo que había sido del rey ahora era del emperador.",
"Far to the south, a county scribe kept those rules on a wooden board, found in a well in 2002.":
"Muy al sur, un escriba de condado guardaba esas reglas en una tabla de madera, hallada en un pozo en 2002.",
"The county's records use the new words almost every time. The board was a glossary, and it was used.":
"Los registros del condado usan las palabras nuevas casi siempre. La tabla era un glosario, y se usaba.",
"A university needs the same: one glossary that everyone trusts, and every tool reading from it.":
"Una universidad necesita lo mismo: un glosario en el que todos confíen, y cada herramienta leyendo de él.",
"Mei owns what award means, and she has found it defined in five places.":
"Mei es dueña de lo que significa título, y lo encontró definido en cinco lugares.",
"Yusuf goes to look. There are five glossaries.":
"Yusuf va a mirar. Hay cinco glosarios.",
"The business glossary on the platform, with the words Mei approved. The data team's models copy from it.":
"El glosario de negocio en la plataforma, con las palabras que aprobó Mei. Los modelos del equipo de datos copian de él.",
"Planning's spreadsheet.":
"La hoja de cálculo de Planificación.",
"An appendix to the registrar's policy.":
"Un anexo de la política de la oficina de registro.",
"The faculties' dashboards, each with its own description.":
"Los tableros de las facultades, cada uno con su propia descripción.",
"And a glossary tool bought in 2019, with six hundred terms.":
"Y una herramienta de glosario comprada en 2019, con seiscientos términos.",
"Between them, three different awards.":
"Entre todos, tres sentidos de título.",
"Each was made for a good reason: a team needed words it could use, so it wrote its own.":
"Cada uno tuvo una buena razón: un equipo necesitaba palabras que usar, y escribió las suyas.",
"So they disagree. One counts microcredentials, three don't, and one says an award is a degree.":
"Así que no coinciden. Uno cuenta las microcredenciales, tres no, y uno dice que solo los grados son títulos.",
"Two can only be found by the people who made them.":
"A dos solo los encuentran quienes los hicieron.",
"And the biggest is the one nobody opens: the 2019 tool, last opened fourteen months ago.":
"Y el más grande es el que nadie abre: la herramienta de 2019, abierta por última vez hace catorce meses.",
"When award changed on Monday, only one glossary changed. The other four never heard.":
"Cuando título cambió el lunes, solo un glosario cambió. Los otros cuatro nunca se enteraron.",
"Five glossaries are no glossary. Nobody knows which to trust, so everyone keeps their own.":
"Cinco glosarios son como ninguno. Nadie sabe en cuál confiar, así que cada uno guarda el suyo.",
"So Yusuf brings the terms' owners together, to keep one glossary.":
"Así que Yusuf reúne a los dueños de los términos, para mantener un solo glosario.",
"Not the biggest. The one they can trust, and every tool can read: the glossary on the platform, beside the data.":
"No el más grande: uno confiable, que toda herramienta pueda leer. El glosario en la plataforma, junto a los datos.",
"Each term there has a definition, an owner, a status, and the date it last changed.":
"Cada término allí tiene una definición, un dueño, un estado y la fecha en que cambió por última vez.",
"It holds the business's words.":
"Guarda las palabras del negocio.",
"A data dictionary describes each table and column. A catalog helps people find the data, and shows both.":
"Un diccionario de datos describe cada tabla y columna. Un catálogo ayuda a encontrar los datos, y muestra ambos.",
"The other four are retired, or made to read from it.":
"Los otros cuatro se retiran, o pasan a leer de él.",
"The 2019 tool is retired. Its terms with an owner move across; the rest are archived.":
"La herramienta de 2019 se retira. Sus términos con dueño pasan al glosario; el resto se archiva.",
"Planning's spreadsheet links to each term, instead of keeping its own words.":
"La hoja de Planificación enlaza a cada término, en vez de guardar sus propias palabras.",
"The registrar's policy now says: award, as defined in the business glossary.":
"La política de registro ahora dice: título, como lo define el glosario de negocio.",
"The faculties' dashboards show the glossary's words, read from the platform, so they can't say anything else.":
"Los tableros de las facultades muestran las palabras del glosario, leídas de la plataforma, así que no pueden decir otra cosa.",
"The data team's copy already worked this way: it names where its words came from, and a sync checks it every night.":
"La copia del equipo de datos ya funcionaba así: dice de dónde vienen sus palabras, y una sincronización la revisa cada noche.",
"Every copy is made from the glossary, one way, never the other way round.":
"Cada copia se hace a partir del glosario, en un solo sentido, nunca al revés.",
"Without a sync, a change like Monday's is found months later, in a dashboard, when a number moves.":
"Sin sincronización, un cambio como el del lunes aparece meses después, en un tablero, cuando un número se mueve.",
"On Monday night, the sync found it, and opened a pull request: what the new words touch, and who owns each part.":
"El lunes en la noche, la sincronización lo encontró y abrió un pull request: qué tocan las palabras nuevas, y de quién es cada parte.",
"Planning's list of learners near an award. The wallet app. The census dashboard.":
"La lista de Planificación de estudiantes cerca de un título. La app de billetera. El tablero del censo.",
"Mei approved the new meaning. This time, she could see where her words are used.":
"Mei aprobó el nuevo significado. Esta vez, pudo ver dónde se usan sus palabras.",
"Jun saw a number in the words: six credit points.":
"Jun vio un número en las palabras: seis créditos.",
"A number in a meaning is a rule too. So it's kept in one place, as a setting the code reads.":
"Un número en un significado es también una regla. Se guarda en un lugar, como un parámetro que lee el código.",
"Monday's words weren't written at a desk.":
"Las palabras del lunes no salieron de un escritorio.",
"Mei and the faculties argued them out in a workshop: should a microcredential count, and from how many credit points?":
"Mei y las facultades las discutieron en un taller: ¿debía contar una microcredencial, y desde cuántos créditos?",
"The glossary keeps what they agreed. It doesn't make the agreement.":
"El glosario guarda lo que acordaron. No hace el acuerdo.",
"And the people who kept the other glossaries lose something they built.":
"Y quienes mantenían los otros glosarios pierden algo que construyeron.",
"So they're thanked, and their best definitions move into the one that stays.":
"Así que se les agradece, y sus mejores definiciones pasan al que se queda.",
"Policy 12 said reports count by the glossary's definitions.":
"La política 12 decía: los informes cuentan según las definiciones del glosario.",
"Now each word has one home, and every tool reads from it.":
"Ahora cada palabra tiene un solo lugar, y toda herramienta lee de él.",
"Many glossaries are no glossary. Keep one, and sync every tool from it.":
"Muchos glosarios son como ninguno. Quédate con uno, y sincroniza cada herramienta con él."
});
