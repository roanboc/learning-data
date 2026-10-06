/* Declare it, then build it: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In the 1870s, architects began copying their drawings as blueprints: white lines on blue paper, one copy for every trade on site.":
"En la década de 1870, los arquitectos empezaron a copiar sus planos como cianotipos: líneas blancas sobre papel azul, una copia para cada oficio de la obra.",
"A blueprint says exactly what the building will be: where every wall stands, how thick it is, and what it carries.":
"Un plano dice exactamente cómo será el edificio: dónde va cada muro, qué grosor tiene y qué soporta.",
"It doesn't lay a single brick.":
"No pone ni un solo ladrillo.",
"Data has blueprints too.":
"Los datos también tienen planos.",
"At a university, four offices once gave four different answers to one question: how many credentials did we award?":
"En una universidad, cuatro oficinas dieron una vez cuatro respuestas distintas a una misma pregunta: ¿cuántas credenciales otorgamos?",
"So they agreed what a credential is, and wrote it down as a model.":
"Así que acordaron qué es una credencial, y lo escribieron como un modelo.",
"A model answers four questions. What a thing is. What makes it the same one everywhere. What one row holds. And when each thing was true.":
"Un modelo responde cuatro preguntas. Qué es una cosa. Qué la hace la misma en todas partes. Qué contiene una fila. Y cuándo fue cierta cada cosa.",
"Meaning, identity, grain and time.":
"Significado, identidad, granularidad y tiempo.",
"Version three of the university's model has just been approved.":
"Acaba de aprobarse la versión tres del modelo de la universidad.",
"The series From words to data tells that story. This is all you need from it.":
"La serie De las palabras a los datos cuenta esa historia. Esto es todo lo que necesitas de ella.",
"A model can be written down in many shapes: a normalised core, stars, a data vault, anchors, hooks, one wide table per entity.":
"Un modelo se puede escribir de muchas formas: un núcleo normalizado, estrellas, un data vault, anclas, hooks, una tabla ancha por entidad.",
"Each has its champions. Look inside any of them, and you find the same four answers.":
"Cada una tiene sus defensores. Mira dentro de cualquiera, y encontrarás las mismas cuatro respuestas.",
"This series takes a middle way. Integrate on business keys, keep every version, and serve each entity as one wide row, with stars where people need them.":
"Esta serie toma un camino intermedio. Integrar sobre claves de negocio, guardar cada versión, y servir cada entidad como una fila ancha, con estrellas donde la gente las necesita.",
"But an approved model is still a blueprint.":
"Pero un modelo aprobado sigue siendo un plano.",
"The data arrives from three systems, each with its own keys, its own codes, and every version it has ever had.":
"Los datos llegan de tres sistemas, cada uno con sus propias claves, sus propios códigos, y cada versión que ha tenido.",
"Someone has to turn what arrives into what was agreed, and show that it matches.":
"Alguien tiene que convertir lo que llega en lo que se acordó, y demostrar que coincide.",
"That's the work of an analytics engineer. At the university, that's Jun.":
"Ese es el trabajo de un analytics engineer. En la universidad, es Jun.",
"The building work is transformation: select, join, clean and reshape.":
"La obra es la transformación: seleccionar, unir, limpiar y dar forma.",
"It can be done in notebooks, in stored procedures, or in pipeline tools. Jun's team uses dbt, a widely used tool for it.":
"Se puede hacer en notebooks, en procedimientos almacenados o en herramientas de pipelines. El equipo de Jun usa dbt, una herramienta muy usada para esto.",
"Each transformation is a SQL query, in its own file.":
"Cada transformación es una consulta SQL, en su propio archivo.",
"dbt works out the order from how the queries refer to each other, builds each result as a table or a view on the platform, and keeps the tests and documentation beside the code.":
"dbt deduce el orden a partir de cómo se refieren unas consultas a otras, construye cada resultado como una tabla o una vista en la plataforma, y guarda las pruebas y la documentación junto al código.",
"dbt calls each of these queries a model. It's a useful name, and a misleading one.":
"dbt llama modelo a cada una de estas consultas. Es un nombre útil, y engañoso.",
"A query is one step of the building work. The model is the blueprint.":
"Una consulta es un paso de la obra. El modelo es el plano.",
"This series is about keeping the two apart, and connecting them. It's for analytics engineers, and it goes into the weeds.":
"Esta serie trata de mantener separadas las dos cosas, y de conectarlas. Es para analytics engineers, y entra en el detalle.",
"A year from now, Jun's project could hold three hundred of these files, in four layers, each folder named for its domain.":
"Dentro de un año, el proyecto de Jun podría tener trescientos de estos archivos, en cuatro capas, cada carpeta con el nombre de su dominio.",
"Most are steps: one tidies a source, one matches a learner's three keys, one stitches their history into a single timeline.":
"La mayoría son pasos: uno ordena una fuente, otro une las tres claves de un estudiante, otro cose su historia en una sola línea de tiempo.",
"Only the core holds what the blueprint names: a learner, a credential, an award. The marts serve each consumer what it asked for.":
"Solo el núcleo contiene lo que nombra el plano: un estudiante, una credencial, un título. Los marts sirven a cada consumidor lo que pidió.",
"So which file is the data model? None of them.":
"Entonces, ¿qué archivo es el modelo de datos? Ninguno.",
"The model lives beside the code.":
"El modelo vive junto al código.",
"In YAML: what one row holds, which key makes it unique, how it relates to the rest, and the contract each table promises.":
"En YAML: qué contiene una fila, qué clave la hace única, cómo se relaciona con el resto, y el contrato que promete cada tabla.",
"In a conceptual model, with a diagram anyone can read: what each thing means. And in a decision log beside it: why it was decided that way.":
"En un modelo conceptual, con un diagrama que cualquiera puede leer: qué significa cada cosa. Y en un registro de decisiones a su lado: por qué se decidió así.",
"The queries make the tables. The YAML and the Markdown say what those tables must be, and the tests check that they are.":
"Las consultas hacen las tablas. El YAML y el Markdown dicen qué deben ser esas tablas, y las pruebas comprueban que lo son.",
"Jun works in ten steps.":
"Jun trabaja en diez pasos.",
"Start from a question. Learn what the sources really hold. Define what each consumer needs.":
"Empezar por una pregunta. Conocer lo que de verdad contienen las fuentes. Definir lo que necesita cada consumidor.",
"Name the gaps, and write the contracts. Write the tests, before any code. Build, layer by layer.":
"Nombrar las brechas, y escribir los contratos. Escribir las pruebas, antes de cualquier código. Construir, capa por capa.",
"Validate against a number people trust. Review and ship. Keep each fact written once. And let the model evolve without breaking anyone.":
"Validar contra una cifra en la que la gente confía. Revisar y publicar. Escribir cada dato una sola vez. Y dejar que el modelo evolucione sin romper nada a nadie.",
"An AI agent can help at every step. At every step, a person approves.":
"Un agente de IA puede ayudar en cada paso. En cada paso, aprueba una persona.",
"The next eight films take the steps in turn.":
"Las próximas ocho películas recorren los pasos uno a uno.",
"Scoping a model from a question. What makes a learner the same one across systems, and how keys and hashes make it explicit. Grain and time.":
"Delimitar un modelo a partir de una pregunta. Qué hace que un estudiante sea el mismo en todos los sistemas, y cómo las claves y los hashes lo hacen explícito. Granularidad y tiempo.",
"Contracts and tests. Building in layers. Who owns what, across domains. Working with an agent, responsibly. And writing it all down, once.":
"Contratos y pruebas. Construir por capas. Quién es dueño de qué, entre dominios. Trabajar con un agente, con responsabilidad. Y escribirlo todo, una sola vez.",
"A blueprint says what a building will be. The building work makes it true.":
"Un plano dice cómo será un edificio. La obra lo hace realidad.",
"In data, the model is the blueprint, and dbt is one way to build it.":
"En los datos, el modelo es el plano, y dbt es una forma de construirlo.",
"Declare it. Then build it.":
"Decláralo. Luego constrúyelo.",
"Everything they show is real code and real data. It runs on dbt Core, with DuckDB, and you can run it yourself.":
"Todo lo que muestran es código real y datos reales. Corre en dbt Core, con DuckDB, y puedes ejecutarlo tú mismo.",
});
