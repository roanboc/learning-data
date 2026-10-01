/* Built in layers: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"At the Savoy hotel in London, in the 1890s, the chef Auguste Escoffier ran his kitchen as a brigade.":
"En el hotel Savoy de Londres, en la década de 1890, el chef Auguste Escoffier organizó su cocina como una brigada.",
"Each station had one job: sauces, roasts, fish, vegetables.":
"Cada estación tenía una sola tarea: salsas, asados, pescados, verduras.",
"Each prepared its part ahead, and every plate was checked at the pass.":
"Cada una preparaba su parte antes, y cada plato se revisaba en el pase.",
"Jun's credential project is a kitchen too: four stations, one job each, and a pass.":
"El proyecto de credenciales de Jun es otra cocina: cuatro estaciones, una tarea cada una, y un pase.",
"The tests are written. Now the code has to pass them, layer by layer.":
"Las pruebas ya están escritas. Ahora el código tiene que pasarlas, capa por capa.",
"The agent writes a first draft of each model, runs its tests, and watches them fail. Then it writes the least code that turns them green. Jun reviews every line.":
"El agente escribe un primer borrador de cada modelo, corre sus pruebas y las ve fallar. Luego escribe el mínimo código que las pone en verde. Jun revisa cada línea.",
"The first station is staging. One model per source table: seven of them.":
"La primera estación es staging. Un modelo por tabla de origen: siete en total.",
"Staging renames and casts. It trims, and writes each key in one case. It adds the readable key, with its key set, and its hash.":
"Staging renombra y convierte tipos. Recorta y escribe cada clave en un solo formato. Agrega la clave legible, con su conjunto de claves, y su hash.",
"No joins, and no rules. A short-course customer is still called a customer here.":
"Sin joins y sin reglas. Un cliente de cursos cortos aquí todavía se llama cliente.",
"Next, intermediate. Eight models, and each one is a step, not a product.":
"Luego, intermediate. Ocho modelos, y cada uno es un paso, no un producto.",
"Match a learner's keys. Stitch three timelines into one. Gather the credentials from three systems. Apply the credit rule.":
"Unir las claves de un estudiante. Coser tres historiales en uno. Reunir las credenciales de tres sistemas. Aplicar la regla de créditos.",
"Here the sources' words become the model's: a customer becomes a learner.":
"Aquí el vocabulario del origen pasa a ser el del modelo: un cliente se vuelve estudiante.",
"Read the names of one model's steps, top to bottom, and you have its recipe.":
"Lee los nombres de los pasos de un modelo, de arriba abajo, y tienes su receta.",
"Then the core: what the blueprint names. A learner, an award, a credential, and credit towards an award.":
"Después, el core: lo que nombra el plano. Un estudiante, un título, una credencial y el crédito hacia un título.",
"Each at its declared grain, public, under an enforced contract.":
"Cada uno con su granularidad declarada, público, bajo un contrato exigido.",
"Jun builds it, and the tests turn green.":
"Jun lo construye y las pruebas pasan a verde.",
"The award skips intermediate. It has one source, and nothing to resolve, so staging feeds the core directly.":
"El título se salta intermediate. Tiene un solo origen y nada que resolver, así que staging alimenta el core directamente.",
"Noor reviews the core. It's her model, built.":
"Noor revisa el core. Es su modelo, construido.",
"Last, the marts: each built for one consumer, and shaped for how it's read.":
"Por último, los marts: cada uno hecho para un consumidor, y con la forma en que se lee.",
"Planning's is long and narrow: seventy-three rows, one per learner per award, ready to count by faculty.":
"El de Planificación es largo y angosto: setenta y tres filas, una por estudiante y título, listas para contar por facultad.",
"The wallet's is wide: everything about a learner in one row, so the app reads it in one lookup.":
"El de la billetera es ancho: todo sobre un estudiante en una fila, así la app lo lee en una sola consulta.",
"Each mart builds on the core, never on another mart.":
"Cada mart se construye sobre el core, nunca sobre otro mart.",
"Open Planning's mart. It's written as named steps, each called a CTE, and it reads like a recipe too.":
"Abre el mart de Planificación. Está escrito como pasos con nombre, cada uno llamado CTE, y también se lee como una receta.",
"First, import CTEs: one for each model it reads, and nothing else.":
"Primero, las CTE de importación: una por cada modelo que lee, y nada más.",
"Then logical CTEs, one step each, named for what they hold: learners at census, not CTE two.":
"Luego, las CTE lógicas, un paso cada una, con el nombre de lo que contienen: estudiantes al censo, no CTE dos.",
"Last, a final select that lists every column, in the contract's order.":
"Por último, un select final que lista cada columna, en el orden del contrato.",
"A reviewer reads it top to bottom, and can see where every column comes from.":
"Quien revisa lo lee de arriba abajo, y puede ver de dónde viene cada columna.",
"How each model is stored follows how it's used.":
"Cómo se guarda cada modelo depende de cómo se usa.",
"Staging and the steps are views: nothing stored twice, and the agent can query any one of them.":
"Staging y los pasos son vistas: nada se guarda dos veces, y el agente puede consultar cualquiera de ellas.",
"The core and the marts are tables, because people read them all day.":
"El core y los marts son tablas, porque la gente las lee todo el día.",
"The credential table is incremental. Each run merges only what changed, matched on the credential's key. Run it twice, and the second run merges nothing.":
"La tabla de credenciales es incremental. Cada corrida fusiona solo lo que cambió, según la clave de la credencial. Córrela dos veces, y la segunda no fusiona nada.",
"On Databricks, the same file clusters it by learner. And when the logic changes, rebuild it in full.":
"En Databricks, el mismo archivo la agrupa por estudiante. Y cuando la lógica cambia, reconstrúyela completa.",
"Planning's rule is written once: near an award means more than nothing left, and no more than fifteen points.":
"La regla de Planificación se escribe una vez: cerca de un título significa que falta algo, y no más de quince créditos.",
"The count by faculty is one macro. And the metric the dashboards ask for, defined in dbt's semantic layer, counts the same column.":
"El conteo por facultad es una macro. Y la métrica que piden los tableros, definida en la capa semántica de dbt, cuenta la misma columna.",
"Then the pass. Planning's mart against the census report, faculty by faculty: twelve, and twelve. Green.":
"Después, el pase. El mart de Planificación contra el informe del censo, facultad por facultad: doce, y doce. Verde.",
"Each layer has one job. Each CTE, one step.":
"Cada capa tiene una tarea. Cada CTE, un paso.",
"It's built by one team, in one project. But the registrar owns learners, the learning team owns microcredentials, and Planning wants a project of its own.":
"Lo construye un equipo, en un proyecto. Pero registro académico es dueño de los estudiantes, el equipo de aprendizaje de las microcredenciales, y Planificación quiere un proyecto propio."
});
