/* Off the shelf: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the other series: Planificación, informe, dueño, título for an award. Governance is "gobernanza", because this film also speaks of the government (el gobierno). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 1215, Magna Carta made a promise.":
"En 1215, la Carta Magna hizo una promesa.",
"“There is to be one measure of wine throughout our kingdom, and one measure of ale, and one measure of corn.”":
"“Habrá una sola medida de vino en todo nuestro reino, una sola medida de cerveza y una sola medida de grano.”",
"For six hundred years, the promise was repeated, and measures still differed from town to town.":
"Durante seiscientos años, la promesa se repitió, y las medidas seguían cambiando de un pueblo a otro.",
"Kings sent standards to the towns. Officers checked them now and then.":
"Los reyes enviaban patrones a los pueblos. Unos oficiales los revisaban a veces.",
"It wasn't enough. In 1871, a member of Parliament said that in his county alone, a bushel meant thirty-two different measures.":
"No bastó. En 1871, un diputado dijo que, solo en su condado, un bushel equivalía a treinta y dos medidas distintas.",
"What finally worked was all of it together:":
"Lo que por fin funcionó fue todo junto:",
"one definition in law, a copy in every county, and an inspector who checked against it, again and again, with the law behind him.":
"una definición en la ley, una copia en cada condado y un inspector que comparaba con ella, una y otra vez, con la ley detrás.",
"Today, Yusuf Demir starts as the university's data governance lead.":
"Hoy, Yusuf Demir empieza como líder de gobernanza de datos de la universidad.",
"He inherits a shelf of thirty-four policies, and a maturity score: 2.1 out of 5.":
"Hereda un estante con treinta y cuatro políticas y una puntuación de madurez: 2.1 de 5.",
"A chart of who's responsible for what, with half its names still to be confirmed.":
"Un cuadro de quién es responsable de qué, con la mitad de los nombres aún por confirmar.",
"And the minutes of a council that meets once a month.":
"Y las actas de un consejo que se reúne una vez al mes.",
"His brief: fix governance before the next submission to the government.":
"Su encargo: arreglar la gobernanza antes de la próxima entrega al gobierno.",
"The same week, two reports disagree.":
"Esa misma semana, dos informes no coinciden.",
"Planning's census report says 4,812 awards were conferred this year.":
"El informe del censo de Planificación dice que este año se otorgaron 4,812 títulos.",
"The draft submission to the government says 4,867.":
"El borrador de la entrega al gobierno dice 4,867.",
"Which number is right?":
"¿Cuál número es el correcto?",
"Yusuf follows the numbers back.":
"Yusuf sigue el rastro de los números.",
"Both are right, each by its own meaning of award.":
"Ambos son correctos, cada uno con su sentido de título.",
"On Monday, the word changed: microcredentials of at least six credit points now count.":
"El lunes, la palabra cambió: ahora cuentan las microcredenciales de al menos seis créditos.",
"One report ran before the change, the other after.":
"Un informe se generó antes del cambio; el otro, después.",
"But the government counts awards by its own definition. Who decides how ours maps to it?":
"Pero el gobierno cuenta los títulos con su propia definición. ¿Quién decide cómo se mapea la nuestra a la suya?",
"Mei owns what award means here. Jun builds what the model says. Planning reports what it's given.":
"Mei es dueña de lo que significa título aquí. Jun construye lo que dice el modelo. Planificación informa lo que recibe.",
"And the chart says: to be confirmed.":
"Y el cuadro dice: por confirmar.",
"Policy 12 says that business terms are defined consistently.":
"La política 12 pide definir los términos de negocio de forma consistente.",
"It doesn't say who decides, or how a decision reaches the work.":
"No dice quién decide, ni cómo una decisión llega al trabajo.",
"That's what governance is for: deciding who decides, and making sure each decision reaches the work.":
"Para eso es la gobernanza: para decidir quién decide y asegurar que cada decisión llegue al trabajo.",
"Like the inspector at the market: a rule, a copy where the work happens, and someone who checks.":
"Como el inspector del mercado: una regla, una copia donde se hace el trabajo y alguien que verifica.",
"Governance sets the rules and checks they're kept. Management does the work.":
"La gobernanza fija las reglas y verifica que se cumplan. La gestión hace el trabajo.",
"Yusuf doesn't write a thirty-fifth policy. He asks everyone the same question: what slows you down?":
"Yusuf no escribe una política número treinta y cinco. Les hace a todos la misma pregunta: ¿qué te frena?",
"For Jun, the rules arrive after the work is built.":
"Para Jun, las reglas llegan cuando el trabajo ya está hecho.",
"Mei approves the words, then never sees where they're used.":
"Mei aprueba las palabras y luego nunca ve dónde se usan.",
"Sam could protect a column in minutes, if anyone said which.":
"Sam podría proteger una columna en minutos, si alguien le dijera cuál.",
"Planning doesn't know which number to trust.":
"Planificación no sabe en qué número confiar.",
"The people who wrote the binder weren't the problem. They wrote what they were asked for.":
"Quienes escribieron la carpeta no eran el problema. Escribieron lo que se les pidió.",
"Governance is people's work. Tools can carry out what people agree, but they can't make them agree.":
"La gobernanza es trabajo de personas. Las herramientas ejecutan lo que la gente acuerda, pero no logran que se pongan de acuerdo.",
"So he opens the binder, with one question for every line: where does it run?":
"Así que abre la carpeta, con una pregunta para cada línea: ¿dónde se ejecuta?",
"Some lines can run in the work itself, as a field no one can leave empty, a check that runs every night, or a label.":
"Algunas pueden ejecutarse en el trabajo: un campo que nadie puede dejar vacío, una validación cada noche o una etiqueta.",
"Some are decisions: someone owns each one, and writes it down where the work can find it.":
"Otras son decisiones: cada una tiene un dueño, que la anota donde el trabajo pueda encontrarla.",
"And some can go.":
"Y otras sobran.",
"Behind every line that stays, there's something worth keeping, and someone to keep it.":
"Detrás de cada línea que queda hay algo que vale la pena mantener, y alguien que lo mantenga.",
"Rules, each with an owner, that reach Jun before he builds.":
"Reglas, cada una con su dueño, que le llegan a Jun antes de construir.",
"One glossary every report reads from, so Mei sees where her words are used.":
"Un solo glosario para todos los informes, así Mei ve dónde se usan sus palabras.",
"A class for each kind of personal data, so Sam knows which columns to protect.":
"Una clase para cada tipo de dato personal, para que Sam sepa qué columnas proteger.",
"And a list of who owns what, so Planning knows who answers for each number.":
"Y una lista de dueños, para que Planificación sepa quién responde por cada cifra.",
"Owners decide. Stewards keep it all up to date.":
"Los dueños deciden. Los responsables de datos lo actualizan.",
"The teams who do the work use it, and governance checks it's kept.":
"Los equipos que hacen el trabajo lo usan, y la gobernanza revisa que se mantenga.",
"Over nine more films, Yusuf follows one symptom at a time to what's worth keeping, and to who decides and acts.":
"En nueve películas más, Yusuf sigue un síntoma a la vez hasta lo que vale la pena mantener, y hasta quién decide y actúa.",
"Then three draw it all as one model, on the university's architecture map.":
"Luego, tres lo dibujan como un solo modelo, en el mapa de arquitectura de la universidad.",
"And six build it, with dbt and Databricks.":
"Y seis lo construyen, con dbt y Databricks.",
"A policy that doesn't run anywhere is a wish.":
"Una política que no se ejecuta en ningún lado es un deseo."
});
