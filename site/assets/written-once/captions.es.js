/* Written once: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"By the 1850s, the note A sounded different from one city to the next, and it kept creeping higher.":
"Hacia 1850, la nota la sonaba distinta de una ciudad a otra, y seguía subiendo poco a poco.",
"In 1859, France fixed it by decree, and kept one tuning fork in Paris as its home.":
"En 1859, Francia la fijó por decreto y guardó un diapasón en París como su hogar.",
"Other forks were checked against it, and instruments were tuned from those, never the other way round.":
"Otros diapasones se comprobaban con él, y los instrumentos se afinaban con ellos, nunca al revés.",
"Today, before it plays, a whole orchestra still tunes to one note.":
"Hoy, antes de tocar, toda una orquesta aún se afina con una sola nota.",
"A definition can work like that: kept in one place, and everything else tuned from it.":
"Una definición puede funcionar así: guardada en un lugar, y todo lo demás afinado con ella.",
"The agent's review of the metadata found it: the definition of an award, in four places.":
"La revisión de metadatos del agente lo encontró: la definición de título, en cuatro lugares.",
"The wiki, a YAML description, the catalog, and the tooltip on Planning's dashboard.":
"La wiki, una descripción en YAML, el catálogo y el tooltip del dashboard de Planificación.",
"One says an award is given on paper. One has lost its credit points. One calls every award a degree.":
"Una dice que el título se entrega en papel. Otra perdió los créditos. Otra llama grado a todo título.",
"Only the tooltip still says what Mei approved, the words in the conceptual model.":
"Solo el tooltip dice aún lo que aprobó Mei, las palabras del modelo conceptual.",
"Nothing kept the others in step. They drifted, one small edit at a time.":
"Nada mantuvo a las demás alineadas. Se desviaron, un pequeño cambio a la vez.",
"The fix isn't a fifth copy, or a better one. The definition already has a home. Everything else has to be driven from it.":
"La solución no es una quinta copia, ni una mejor. La definición ya tiene un hogar. Todo lo demás debe salir de él.",
"Meaning lives in the conceptual model: what each thing is, its key, and who owns it.":
"El significado vive en el modelo conceptual: qué es cada cosa, su clave y quién es su dueño.",
"Decisions live in a log beside what they're about, with why and who. The gaps the team accepted live on the model, as known limitations.":
"Las decisiones viven en un registro junto a aquello de lo que tratan, con el porqué y el quién. Los vacíos que el equipo aceptó viven en el modelo, como limitaciones conocidas.",
"Everything the build uses lives in YAML: grain, keys, contracts, tests and owners.":
"Todo lo que usa el build vive en YAML: grano, claves, contratos, tests y dueños.",
"A decision log isn't a copy. It holds why, which a model's YAML has no place for.":
"Un registro de decisiones no es una copia. Guarda el porqué, y el YAML de un modelo no tiene lugar para él.",
"So the award is defined once, in the conceptual model.":
"Así que el título se define una vez, en el modelo conceptual.",
"A script turns each definition into a doc block, on a Markdown page it writes itself. Nobody edits that page.":
"Un script convierte cada definición en un doc block, en una página Markdown que escribe él mismo. Nadie la edita.",
"The YAML doesn't copy the definition. It names it, and dbt shows the definition there.":
"El YAML no copia la definición. La nombra, y dbt muestra ahí la definición.",
"To change the meaning, change one line, with Mei's approval. Edit the generated page instead, and the check in CI fails.":
"Para cambiar el significado, cambia una línea, con la aprobación de Mei. Edita la página generada, y falla el check en CI.",
"The agent's review runs again: in the project, no description written twice. The wiki now links to the docs site.":
"La revisión del agente corre otra vez: en el proyecto, ninguna descripción escrita dos veces. La wiki ahora enlaza al sitio de docs.",
"Diagrams drift too.":
"Los diagramas también se desvían.",
"The conceptual diagram is drawn by hand, for people. It changes only when the meaning does.":
"El diagrama conceptual se dibuja a mano, para personas. Solo cambia cuando cambia el significado.",
"The physical diagram is generated: every core and mart table, its columns, types and keys, read from what dbt parsed.":
"El diagrama físico se genera: cada tabla del core y de los marts, sus columnas, tipos y claves, leídos de lo que dbt analizó.",
"If the YAML changes and the diagram doesn't, CI fails.":
"Si el YAML cambia y el diagrama no, CI falla.",
"Draw the meaning. Generate the structure.":
"Dibuja el significado. Genera la estructura.",
"On Databricks, people find tables in the catalog, and read their descriptions there.":
"En Databricks, la gente encuentra las tablas en el catálogo y lee ahí sus descripciones.",
"So each build pushes the descriptions out to it, for each table and its columns.":
"Así que cada build le envía las descripciones, de cada tabla y sus columnas.",
"Nobody edits them there: a rebuild writes over the edit. Fix it at home, and it flows out.":
"Nadie las edita ahí: un nuevo build sobrescribe el cambio. Corrígelo en casa, y fluye hacia fuera.",
"One direction: from the files, out to the catalog and whatever reads it. Tuned from one source, never the other way round.":
"Una dirección: de los archivos hacia el catálogo y lo que lo lea. Afinado desde una fuente, nunca al revés.",
"Written once doesn't mean never changed.":
"Escrito una vez no significa que nunca cambie.",
"A credential can expire, and a true or false can't say so. So is_revoked becomes status: valid, expired or revoked.":
"Una credencial puede vencer, y un verdadero o falso no puede decirlo. Así que is_revoked pasa a status: vigente, vencida o revocada.",
"That breaks anyone who reads the old column. So it's a new version of the credential, beside the old one.":
"Eso rompe a quien lea la columna vieja. Así que es una nueva versión de la credencial, junto a la anterior.",
"Version one is built from version two, so the logic lives once. And it has a date to go: the 31st of March, 2027.":
"La versión uno se construye desde la dos, así que la lógica vive una vez. Y tiene fecha de salida: el 31 de marzo de 2027.",
"The exposures declared with the contracts say who to tell: only the wallet app. It pins version two.":
"Las exposures declaradas con los contratos dicen a quién avisar: solo a la app de la billetera. Fija la versión dos.",
"Anyone still reading version one gets dbt's warning, with the date, every time they build.":
"Quien aún lea la versión uno recibe el aviso de dbt, con la fecha, cada vez que hace build.",
"A breaking change arrives as a choice with a deadline, not as a surprise.":
"Un cambio que rompe llega como una decisión con plazo, no como una sorpresa.",
"That's the loop. A question, the sources, the consumers, gaps and contracts, tests, layers, the trusted number, review, written once, and change.":
"Ese es el ciclo. Una pregunta, las fuentes, los consumidores, vacíos y contratos, tests, capas, el número confiable, revisión, escrito una vez, y cambio.",
"At every step, the agent drafted and checked. At every step, a person approved.":
"En cada paso, el agente redactó y comprobó. En cada paso, una persona aprobó.",
"And a new question arrives, from the wallet team. The loop starts again, at the question.":
"Y llega una nueva pregunta, del equipo de la billetera. El ciclo vuelve a empezar, en la pregunta.",
"Declare it. Then build it.":
"Decláralo. Luego constrúyelo.",
});
