/* Defined in the open: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series' page and in Reports on demand: la docencia ocasional, el costo de la docencia ocasional, Finanzas, RR. HH., la Facultad de Salud (Salud), un reporte,
   un tablero, el día de pago, la nómina; una declaración de horas for a casual claim (las declaraciones); las cargas sociales for on-costs; un período lectivo, una asignatura,
   una tutoría. As the site's other Spanish captions say them: una vista de métricas for a metric view, un pull request, la capa semántica, El significado en la plataforma.
   The other two numbers' names: horas ocasionales contratadas and pago ocasional pagado. In 1889 and after: la bóveda, las copias, las pesas, una pesada, el patrón de masa,
   la balanza de Kibble, la constante de Planck. The platform's names stay as they are on screen: Unity Catalog, Genie, Genie One, the Ask Genie button, MetricFlow, Apache Ossie.
   Tú, as the film's last lines speak to the viewer (Elige, Deja, revisa, no los reinventes).
   Numbers keep the picture's comma and point (A$2.21M is 2.21 millones; 330 mil), as the module's other Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Near Paris, 1889. A small cylinder of platinum and iridium, kept in a vault, becomes the kilogram.":
"Cerca de París, 1889. Un pequeño cilindro de platino e iridio, guardado en una bóveda, pasa a ser el kilogramo.",
"Forty copies go out to countries around the world, and each country checks its weights against its copy.":
"Cuarenta copias salen a países de todo el mundo, y cada país verifica sus pesas con su copia.",
"But only the cylinder in the vault is the kilogram, so about every forty years, the copies come back to be weighed against it.":
"Pero solo el cilindro de la bóveda es el kilogramo, así que cada unos cuarenta años las copias vuelven a pesarse con él.",
"By 1989, they have drifted apart, by up to about fifty millionths of a gram.":
"Para 1989, se han ido separando, hasta unas cincuenta millonésimas de gramo.",
"Nobody can tell which has moved, because by definition, the cylinder is always exactly one kilogram.":
"Nadie puede saber cuál cambió, porque, por definición, el cilindro siempre es exactamente un kilogramo.",
"Every exact weighing in the world rests on one object, in one place, which could be scratched, or lost.":
"Toda pesada exacta del mundo depende de un objeto, en un lugar, que podría rayarse o perderse.",
"Something had to change.":
"Algo tenía que cambiar.",
"In 2018, the world's conference on weights and measures voted to define the kilogram anew.":
"En 2018, la conferencia mundial de pesas y medidas votó definir el kilogramo de nuevo.",
"From May 2019, it's set by a constant of nature, the Planck constant: the same everywhere, and fixed exactly.":
"Desde mayo de 2019, lo fija una constante de la naturaleza, la de Planck: la misma en todas partes, y fijada con exactitud.",
"Any well-equipped lab can make a kilogram from it, for example with a Kibble balance, which weighs a mass against an electromagnetic force.":
"Un laboratorio bien equipado hace un kilogramo con ella, como con una balanza de Kibble, que pesa una masa con una fuerza electromagnética.",
"One definition, the same for everyone, and held by no single object or place.":
"Una definición, la misma para todos, y no la guarda ningún objeto ni lugar.",
"In the United States, the standard of mass is now such a balance, in place of copy number 20.":
"En Estados Unidos, el patrón de masa es ahora una balanza así, en lugar de la copia número 20.",
"At the university, a measure had the same problem.":
"En la universidad, una medida tenía el mismo problema.",
"In August, three tools gave the Faculty of Health three numbers for casual teaching cost, and nobody could tell which one was the answer.":
"En agosto, tres herramientas dieron a la Facultad de Salud tres cifras del costo de la docencia ocasional: nadie supo cuál era la respuesta.",
"Now it's defined once, in a format any tool can read, and every tool gives the same number.":
"Ahora se define una vez, en un formato que cualquier herramienta puede leer, y todas dan la misma cifra.",

"Casual teaching is the teaching done by tutors hired a semester at a time, who claim the hours they teach.":
"La docencia ocasional es la que dan tutores contratados de semestre en semestre, que declaran las horas que enseñan.",
"Planning next year, the Faculty of Health asked what it had cost in Semester 1.":
"Al planificar el año siguiente, la Facultad de Salud preguntó cuánto había costado en el Semestre 1.",
"The faculty's spreadsheet said 2.46 million dollars: the hours in the tutors' contracts.":
"La hoja de cálculo de la facultad decía 2.46 millones de dólares: las horas de los contratos de los tutores.",
"Payroll's report said 1.88 million: the pay paid on the semester's pay days.":
"El reporte de nómina decía 1.88 millones: lo pagado en los días de pago del semestre.",
"Finance's report said 2.21 million: the claims approved for the semester's teaching, plus on-costs, what the university pays on top of pay.":
"El de Finanzas decía 2.21 millones: las declaraciones aprobadas por la docencia del semestre, más las cargas sociales sobre el sueldo.",
"Each was right for its own question, but all three were called casual teaching cost.":
"Cada una era correcta para su propia pregunta, pero las tres se llamaban costo de la docencia ocasional.",
"Budget on payroll's number, and Health would be 330 thousand dollars short next year: about one tutorial in seven with no money for a tutor.":
"Con la cifra de nómina, a Salud le faltarían 330 mil dólares el año siguiente: una de cada siete tutorías sin dinero para un tutor.",
"Rohan Desai, in Finance, owns this measure, but his definition lived only inside his report.":
"Rohan Desai, de Finanzas, es dueño de esta medida, pero su definición vivía solo dentro de su reporte.",

"Like the kilogram, it needed one definition that no single tool held.":
"Como el kilogramo, necesitaba una sola definición que no guardara ninguna herramienta.",
"In September, Rohan defined it once, with Jun Park, who builds the data project.":
"En septiembre, Rohan la definió una vez, con Jun Park, que construye el proyecto de datos.",
"Its owner is Rohan: he decides what it means, and approves every change to it.":
"Su dueño es Rohan: él decide qué significa y aprueba cada cambio que se le hace.",
"Its words: what the casual teaching in a teaching period costs. Also called sessional teaching cost.":
"Sus palabras: lo que cuesta la docencia ocasional de un período lectivo. También se le dice costo de la docencia por sesión.",
"Its rules: claims approved, by casual staff, for teaching: tutorials, marking and consultation, plus on-costs.":
"Sus reglas: declaraciones aprobadas, de personal ocasional, por docencia: tutorías, corrección y consultas, más cargas sociales.",
"Counted by the teaching period the teaching was done in, not the day it was paid.":
"Se cuenta por el período lectivo en que se dio la docencia, no por el día en que se pagó.",
"The claims are HR's data: Ingrid Holm answers for what each of their fields means.":
"Las declaraciones son datos de RR. HH.: Ingrid Holm responde por lo que significa cada uno de sus campos.",
"And the other two numbers get names of their own: casual hours contracted, for planning, and casual pay paid, for each pay day.":
"Y las otras dos cifras reciben nombre propio: horas ocasionales contratadas, para planificar, y pago ocasional pagado, por día de pago.",

"Its home is a metric view in Unity Catalog, beside the tables it's counted from.":
"Su hogar es una vista de métricas en Unity Catalog, junto a las tablas de las que se calcula.",
"A metric view holds a measure's definition once, and works out the right number however it's grouped: by faculty, unit or teaching period.":
"Una vista de métricas define una medida una vez, y da la cifra correcta como se agrupe: por facultad, asignatura o período lectivo.",
"Unity Catalog governs it like a table: who may read it, and what reads it.":
"Unity Catalog la gobierna como a una tabla: quién puede leerla y qué la lee.",
"So every tool on the platform reads this one.":
"Así, todas las herramientas de la plataforma leen esta.",
"Jun writes it as a few lines of YAML in the data project, which builds it, as Meaning on the platform built awards conferred.":
"Jun la escribe en unas líneas de YAML en el proyecto de datos, que la construye, como títulos otorgados en El significado en la plataforma.",
"Rohan approves its meaning in a pull request, and Noor Rahman, the data architect, approves the change to production.":
"Rohan aprueba su significado en un pull request, y Noor Rahman, la arquitecta de datos, aprueba el cambio a producción.",
"Its words go with it: a name to show, a description, synonyms for Genie, and its format, in Australian dollars.":
"Sus palabras van con ella: un nombre para mostrar, una descripción, sinónimos para Genie y su formato, en dólares australianos.",

"None of this is new: for decades, BI tools have kept a layer of business definitions over the tables.":
"Nada de esto es nuevo: hace décadas que las herramientas de BI guardan una capa de definiciones de negocio sobre las tablas.",
"But each kept them in its own format, so no other tool could read them, and a new tool meant writing them all again.":
"Pero cada una las guardaba en su propio formato, ninguna otra podía leerlas, y una herramienta nueva obligaba a escribirlas todas de nuevo.",
"dbt has a semantic layer too, MetricFlow, which reads measures defined in the project's YAML.":
"dbt también tiene una capa semántica, MetricFlow, que lee las medidas definidas en el YAML del proyecto.",
"Planning counts learners near a graduate certificate with it, in the same project.":
"Planificación cuenta con ella a los estudiantes cerca de un certificado de posgrado, en el mismo proyecto.",
"MetricFlow is open source, so other tools can build on it.":
"MetricFlow es de código abierto, así que otras herramientas pueden construir sobre él.",
"Either can be a measure's home. Choose one for each, near most of its readers, and never define it twice.":
"Cualquiera puede ser el hogar de una medida. Elige uno para cada una, cerca de la mayoría de sus lectores, y nunca la definas dos veces.",

"For tools to read each other's definitions, they need a common format: Apache Ossie.":
"Para que las herramientas lean las definiciones de las demás, necesitan un formato común: Apache Ossie.",
"It began as the Open Semantic Interchange, and more than fifty organisations now stand behind it, Databricks and dbt Labs among them.":
"Empezó como el Open Semantic Interchange, y hoy lo respaldan más de cincuenta organizaciones, entre ellas Databricks y dbt Labs.",
"Converters translate a definition between Ossie and each tool's own format: a metric view, MetricFlow, and many others.":
"Los conversores traducen una definición entre Ossie y el formato de cada herramienta: una vista de métricas, MetricFlow y muchos más.",
"dbt writes the project's measures in Ossie each time it reads the project, and it reads Ossie definitions too.":
"dbt escribe las medidas del proyecto en Ossie cada vez que lee el proyecto, y también lee definiciones en Ossie.",
"So casual teaching cost can go to any tool that reads Ossie, with its words and its rules, and nobody types it again.":
"Así, el costo de la docencia ocasional llega a cualquier herramienta que lea Ossie, con sus palabras y sus reglas, y nadie lo reescribe.",
"Keep each rule inside the measure, so it travels with it.":
"Deja cada regla dentro de la medida, para que viaje con ella.",
"And check what arrives: a converter says what it can't carry.":
"Y revisa lo que llega: un conversor avisa lo que no puede llevar.",

"Today, Thursday the fifth of November, is pay day.":
"Hoy, jueves 5 de noviembre, es día de pago.",
"Rohan asks Genie One what casual teaching has cost Health this semester so far: 1.84 million dollars.":
"Rohan le pregunta a Genie One cuánto le ha costado la docencia ocasional a Salud en este semestre: 1.84 millones de dólares.",
"The fortnightly dashboard's Ask Genie gives the same, from the same definition.":
"El botón Ask Genie del tablero quincenal da lo mismo, desde la misma definición.",
"Last semester's is 2.21 million, with the other two numbers beside it, each under its own name.":
"La del semestre pasado es 2.21 millones, con las otras dos cifras al lado, cada una con su propio nombre.",
"Rohan sets Health's budget for next year on the cost, with every tutorial's tutor in it.":
"Rohan fija con el costo el presupuesto de Salud del año siguiente, con el tutor de cada tutoría incluido.",
"Like the kilogram, casual teaching cost is one definition, written where anyone can read it, and held by no single tool.":
"Como el kilogramo, el costo de la docencia ocasional es una definición, escrita donde cualquiera la lee, y no la guarda ninguna herramienta.",
"The standards already exist, so don't reinvent them: investigate, adapt, implement, iterate, starting from the official docs.":
"Los estándares ya existen, así que no los reinventes: investiga, adapta, implementa, itera, empezando por la documentación oficial."
});
