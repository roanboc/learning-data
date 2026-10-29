/* Meaning on the platform: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the governance series: gobernanza de datos, dueña for Mei, la oficina de registro, Planificación, título for an award, microcredenciales and créditos,
   el informe del censo and el borrador de la entrega, as in Off the shelf; un solo lugar for a home, as in Una palabra, un solo lugar. As in Governed in dbt: el control
   for a check, una solicitud de cambio for a pull request, la columna cuenta como título, una construcción for a build, la plataforma and el catálogo. Here a term's page
   is una página, in beta, a setting is un parámetro, a metric view una vista de métricas, a count un conteo, and a layer una capa. Genie One, dbt and the setting's
   name keep their names. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Monday, in the registrar's office.":
"Lunes, en la oficina de registro.",
"Mei Tanaka owns what award means: the qualifications the university confers.":
"Mei Tanaka es dueña de lo que significa título: los grados que otorga la universidad.",
"Today, the meaning changes: microcredentials, the certificates of short courses, count too, from 6 credit points.":
"Hoy, el significado cambia: las microcredenciales, los certificados de cursos cortos, también cuentan, desde 6 créditos.",
"When Yusuf asked what slowed her down, Mei said: I approve the words, then never see them used.":
"Cuando Yusuf le preguntó qué la frenaba, Mei dijo: apruebo las palabras, y nunca veo dónde se usan.",
"Until now, award was kept in five glossaries, lists of what words mean, with three meanings between them.":
"Hasta ahora, título estaba en cinco glosarios, listas de lo que significan las palabras, con tres significados entre ellos.",
"So two reports counted awards two ways: Planning's census report said 4,812, the draft submission to the government 4,867.":
"Así, dos informes contaban títulos de dos maneras: el del censo de Planificación decía 4,812; el borrador de la entrega al gobierno, 4,867.",
"The university could have sent the government a number it couldn't explain.":
"La universidad pudo haber enviado al gobierno una cifra que no sabía explicar.",
"Something had to change.":
"Algo tenía que cambiar.",
"Now award has one page, on the platform, and every copy is checked against it each night.":
"Ahora título tiene una sola página, en la plataforma, y cada copia se compara con ella cada noche.",
"The 6 credit points are kept once, as a setting.":
"Los 6 créditos se guardan una sola vez, como parámetro.",
"And awards conferred is counted once, for every report and every agent.":
"Y los títulos otorgados se cuentan una sola vez, para cada informe y cada agente.",
"That night, the check finds Monday's change, and on Tuesday morning, Mei sees everything her words touch.":
"Esa noche, el control encuentra el cambio del lunes, y el martes por la mañana, Mei ve todo lo que tocan sus palabras.",
"On submission day, both reports say 4,867.":
"El día de la entrega, los dos informes dicen 4,867.",
"Her words reach the work, and the university sends one number.":
"Sus palabras llegan al trabajo, y la universidad envía una sola cifra.",
"On the platform, each term of the glossary is a page, in beta.":
"En la plataforma, cada término del glosario es una página, en beta.",
"Award's page has its words, its owner, Mei, and its domain, course.":
"La página de título tiene sus palabras, su dueña, Mei, y su dominio, curso.",
"It lists the tables that hold it, and where its words come from.":
"Muestra las tablas que lo contienen, y de dónde vienen sus palabras.",
"It's published from Noor's map, where each term is kept, so a change is made there, never on the page.":
"Se publica desde el mapa de Noor, donde se guarda cada término, así que un cambio se hace allí, nunca en la página.",
"People read it beside the data.":
"La gente la lee junto a los datos.",
"So does the platform's assistant, and it cites the page when it answers.":
"También el asistente de la plataforma, que cita la página cuando responde.",
"The data team keeps its own copy of each term, beside the models, so the tables that hold award describe it in the same words.":
"El equipo de datos guarda su copia de cada término junto a los modelos, así las tablas con título lo describen con las mismas palabras.",
"The copy names its source: the glossary's term, and the day it was synced.":
"La copia nombra su fuente: el término del glosario, y el día en que se sincronizó.",
"Each build then sends the descriptions on to the catalog, one way, never back.":
"Luego cada construcción manda las descripciones al catálogo, en un sentido, nunca de vuelta.",
"Every night, a check compares each copy with its term in the glossary.":
"Cada noche, un control compara cada copia con su término en el glosario.",
"On Monday night, award had changed.":
"El lunes por la noche, título había cambiado.",
"So the check proposed the change, in a pull request: the old words and the new, and what the new words touch.":
"Así que el control propuso el cambio, en una solicitud de cambio: las palabras viejas y las nuevas, y lo que tocan las nuevas.",
"Three tables, eight definitions that name award, the code that builds them, and three reports and apps to tell.":
"Tres tablas, ocho definiciones que nombran título, el código que las construye, y tres informes y aplicaciones por avisar.",
"On Tuesday morning, Mei approved the meaning, and data governance confirmed the term.":
"El martes por la mañana, Mei aprobó el significado, y gobernanza de datos confirmó el término.",
"This time, she saw where her words are used.":
"Esta vez, vio dónde se usan sus palabras.",
"The new words hold a number: 6 credit points.":
"Las palabras nuevas tienen un número: 6 créditos.",
"So it's kept in one place, as a setting: min award credit points, 6.":
"Así que se guarda en un solo lugar, como parámetro: min award credit points, 6.",
"Jun's new column, counts as an award, reads it, and every count of awards reads the column.":
"La nueva columna de Jun, cuenta como título, lo lee, y cada conteo de títulos lee esa columna.",
"If Mei and the faculties ever agree on another number, one line changes, in a reviewed pull request.":
"Si Mei y las facultades acuerdan otro número, cambia una línea, en una solicitud de cambio revisada.",
"A count is a meaning too: which credentials count, and in which year.":
"Un conteo también es un significado: qué credenciales cuentan, y en qué año.",
"So awards conferred is counted once, as a metric view: a count the platform defines once, for every tool that asks.":
"Así, títulos otorgados se cuenta una vez, como vista de métricas: un conteo que la plataforma define una vez, para toda herramienta.",
"It counts the credentials that count as an award, by the year they were issued.":
"Cuenta las credenciales que cuentan como título, por el año en que se emitieron.",
"The project builds it like its models, so every change to it is reviewed.":
"El proyecto la construye como a sus modelos, así que cada cambio en ella se revisa.",
"The draft submission reads it, and so does Planning's census report.":
"El borrador de la entrega la lee, y también el informe del censo de Planificación.",
"Neither counts awards its own way any more.":
"Ya ninguno cuenta los títulos a su manera.",
"And the platform's agents read the same meaning.":
"Y los agentes de la plataforma leen el mismo significado.",
"Clara asks Genie One, the platform's assistant, how many awards the university conferred this year.":
"Clara le pregunta a Genie One, el asistente de la plataforma, cuántos títulos otorgó la universidad este año.",
"It answers 4,867, from the metric, and cites award's page for what an award is.":
"Responde 4,867, desde la métrica, y cita la página de título para decir qué es un título.",
"It prefers the page to its own guess, and shows where its answer came from.":
"Prefiere la página a su propia suposición, y muestra de dónde salió su respuesta.",
"An agent the data team builds on the metric gives the same answer.":
"Un agente que el equipo de datos construye sobre la métrica da la misma respuesta.",
"People and agents read one meaning, so they get one number.":
"Personas y agentes leen un solo significado, y les da una sola cifra.",
"Meaning comes in three layers: what a word means, how a number is counted, and how things relate.":
"El significado viene en tres capas: qué significa una palabra, cómo se cuenta un número, y cómo se relacionan las cosas.",
"Each has one home.":
"Cada una tiene un solo lugar.",
"The words live on Noor's map, and the glossary copies them.":
"Las palabras viven en el mapa de Noor, y el glosario las copia.",
"How things relate lives there too, copied into the project.":
"Cómo se relacionan las cosas también vive allí, copiado al proyecto.",
"And the counts live in the project, which the platform serves as metric views.":
"Y los conteos viven en el proyecto, que la plataforma sirve como vistas de métricas.",
"Every copy is checked against its home, or built from it.":
"Cada copia se compara con su lugar, o se construye a partir de él.",
"Mei sees her words used now, in every table, count and answer that holds them.":
"Ahora Mei ve sus palabras en uso, en cada tabla, conteo y respuesta que las contiene.",
"She decides what award means, once, and the platform carries it everywhere it's read.":
"Ella decide qué significa título, una vez, y la plataforma lo lleva a todo lugar donde se lee.",
"On submission day, the draft and Planning's census report both say 4,867, counted by the same metric, with the same words.":
"El día de la entrega, el borrador y el informe del censo dicen 4,867, contados con la misma métrica y las mismas palabras.",
"One meaning, read by people, reports and agents.":
"Un solo significado, leído por personas, informes y agentes."
});
