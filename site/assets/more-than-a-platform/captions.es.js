/* More than a platform: Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   tools/audio_es.py reads those captions aloud for the Spanish page, each line in its English line's time, so each caption stays about as long as its line.
   Words as on the site's Spanish pages: la plataforma, la ruta, los ramales, un agente de IA, arquitectura empresarial de datos, and each topic by the name
   the Topics page gives it. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"The introduction showed the basics: how a data platform carries data from a tap on a phone to a decision.":
"La introducción mostró lo básico: cómo una plataforma de datos lleva los datos de un toque en el teléfono a una decisión.",
"That part matters.":
"Esa parte importa.",
"But a platform alone doesn't make data useful to an organisation.":
"Pero una plataforma sola no hace que los datos sirvan a una organización.",
"Someone still has to know how the organisation works, what each word means, who decides, and who may see what.":
"Alguien tiene que saber cómo funciona la organización, qué significa cada palabra, quién decide y quién puede ver qué.",
"Many courses and much of the documentation give you only half of that.":
"Muchos cursos y buena parte de la documentación dan solo la mitad de eso.",
"Some are deeply technical, with no business and no governance around the code.":
"Algunos son muy técnicos, sin negocio ni gobernanza alrededor del código.",
"Others stay neutral, and never say what to do, or in which tool.":
"Otros son neutrales, y nunca dicen qué hacer ni con qué herramienta.",
"So you join the halves yourself, at work, under pressure.":
"Así que unes las mitades tú, en el trabajo, bajo presión.",
"That's how a model passes every test and answers the wrong question, or a policy never reaches the code.":
"Así un modelo pasa todas las pruebas y responde la pregunta equivocada, o una política nunca llega al código.",
"The author of this portal has worked in applications, data and enterprise architecture roles for more than sixteen years.":
"El autor de este portal ha trabajado en aplicaciones, datos y arquitectura empresarial por más de dieciséis años.",
"The pieces came together slowly, one project at a time.":
"Las piezas se juntaron despacio, un proyecto a la vez.",
"Nobody who works with data should need sixteen years to join them.":
"Nadie que trabaje con datos debería necesitar dieciséis años para unirlas.",
"So the key lessons are gathered here, in one place.":
"Por eso las lecciones clave están aquí, en un solo lugar.",
"This is Learning Data: the context and the practice, from how the organisation works down to the code.":
"Esto es Learning Data: el contexto y la práctica, desde cómo funciona la organización hasta el código.",
"Joining the two is what this portal calls enterprise data architecture.":
"Unir las dos es lo que este portal llama arquitectura empresarial de datos.",
"The portal is laid out as a route of stations, like a railway line, in an order that makes sense.":
"El portal está armado como una ruta de estaciones, como una línea de tren, en un orden con sentido.",
"It starts with the foundations.":
"Empieza por los fundamentos.",
"There are many conversations about tools, and far fewer about the foundations under them.":
"Se habla mucho de herramientas, y mucho menos de los fundamentos que las sostienen.",
"Enterprise architecture comes first.":
"Primero, la arquitectura empresarial.",
"It describes how a business works: what it does, what it needs, which systems serve it, and how they connect.":
"Describe cómo funciona un negocio: qué hace, qué necesita, qué sistemas lo sirven y cómo se conectan.",
"In the author's experience, it's rarely taught in context.":
"En la experiencia del autor, rara vez se enseña en contexto.",
"So people struggle to describe a business, and to understand the one they work in.":
"Por eso cuesta describir un negocio, y entender aquel en el que uno trabaja.",
"Then data governance: who decides what the data means, and who may use it.":
"Luego, la gobernanza de datos: quién decide qué significan y quién puede usarlos.",
"For years it was often seen as slow work that few wanted to do.":
"Por años se vio a menudo como un trabajo lento que pocos querían hacer.",
"Often the enterprise foundations under it were weak.":
"A menudo, los fundamentos de la empresa eran débiles.",
"Or the technology wasn't ready to deliver governance as a service, built into the daily work.":
"O la tecnología no estaba lista para dar gobernanza como servicio, dentro del trabajo diario.",
"So it stayed a set of policies.":
"Así quedó en políticas.",
"This portal shows the newer way: governance built into the work, from the glossary to the code.":
"Este portal muestra la forma nueva: gobernanza dentro del trabajo, del glosario al código.",
"Then the main line, where data is built and kept right.":
"Luego, la línea principal: construir los datos y cuidarlos.",
"Its stations go deeper into each layer the introduction showed.":
"Sus estaciones profundizan en cada capa que mostró la introducción.",
"Two branch lines leave it, and join it again further on.":
"Dos ramales salen de ella, y vuelven a unirse más adelante.",
"One shares and protects data.":
"Uno comparte y protege los datos.",
"The other puts AI agents to work on data, safely.":
"El otro pone agentes de IA a trabajar con datos, con seguridad.",
"The route ends on the whole picture: one plan for data management.":
"La ruta termina en el panorama completo: un plan para la gestión de datos.",
"And leading data people, for those who lead a data team, and for those being led.":
"Y liderar equipos de datos, para quien lidera un equipo, y para quien es liderado.",
"Along the main line, the films show a real project: a dbt project on GitHub, which runs on your own machine and on Databricks.":
"En la línea principal, los videos muestran un proyecto real: un proyecto de dbt en GitHub, que corre en tu máquina y en Databricks.",
"What the films show on screen is code you can open, and run.":
"Lo que los videos muestran en pantalla es código que puedes abrir y correr.",
"And it holds more than models and tests.":
"Y tiene más que modelos y pruebas.",
"Next to the code sit the folders most projects leave out.":
"Junto al código están las carpetas que la mayoría de los proyectos omite.",
"The business glossary, the owners, the architecture map, the data products and their contracts, and the decisions behind them.":
"El glosario del negocio, los dueños, el mapa de arquitectura, los productos de datos y sus contratos, y las decisiones detrás.",
"That is the business and governance metadata, kept in the same place as the code it describes.":
"Esos son los metadatos de negocio y gobernanza, en el mismo lugar que el código que describen.",
"People argue a lot about tools.":
"Se discute mucho sobre herramientas.",
"Here, dbt and Databricks show the ideas in a working solution, but any tools with the same capabilities would do.":
"Aquí, dbt y Databricks muestran las ideas en una solución real, pero serviría cualquier herramienta con las mismas capacidades.",
"What matters is using those capabilities well.":
"Lo que importa es usar bien esas capacidades.",
"This ground has been mapped before.":
"Este terreno ya se ha mapeado antes.",
"DAMA's wheel is the best known, and this portal covers it.":
"La rueda de DAMA es la más conocida, y este portal la cubre.",
"It also goes further, into enterprise architecture, AI agents in data work and leadership.":
"También va más allá: arquitectura empresarial, agentes de IA en el trabajo con datos y liderazgo.",
"It adds other frameworks that proved their worth over those years.":
"Suma otros marcos que probaron su valor en esos años.",
"Data has many paradigms.":
"Hay muchos paradigmas de datos.",
"Many were made by data people, for data, and look little at the enterprise around them.":
"Muchos los hizo gente de datos, para datos, y miran poco a la empresa que los rodea.",
"That is why this portal starts from the enterprise.":
"Por eso este portal parte de la empresa.",
"Enterprise data architecture means exactly that: data designed as part of the organisation it serves.":
"Arquitectura empresarial de datos es justo eso: datos diseñados como parte de la organización a la que sirven.",
"Every station is something to do, not only to watch.":
"Cada estación es algo que hacer, no solo que mirar.",
"In a film, a question stops the picture and asks what you'd do.":
"En un video, una pregunta detiene la imagen y te pregunta qué harías.",
"The answers are close: one is almost right, and the film has told you why it isn't.":
"Las respuestas se parecen: una casi acierta, y el video ya te dijo por qué no.",
"In a lab, you take an idea apart with your own hands.":
"En un laboratorio, desarmas una idea con tus propias manos.",
"Enrol a student, and watch the event race into the platform, in seconds.":
"Inscribe a un estudiante, y mira el evento llegar a la plataforma, en segundos.",
"In a scenario, you make the call in a real situation, put the steps in order, or sort what belongs where.":
"En un escenario, decides en una situación real, ordenas los pasos, o clasificas qué va dónde.",
"Each answer tells you why.":
"Cada respuesta te dice por qué.",
"Pick a goal, and the route lights up your stops.":
"Elige una meta, y la ruta ilumina tus paradas.",
"Search for a word, and find the film that says it.":
"Busca una palabra, y encuentra el video que la dice.",
"Your progress stays in your own browser.":
"Tu avance se queda en tu propio navegador.",
"Platforms have matured.":
"Las plataformas han madurado.",
"The hard part is everything else: the organisation, the meaning, the decisions and the people.":
"Lo difícil es todo lo demás: la organización, el significado, las decisiones y las personas.",
"Start there.":
"Empieza ahí."
});
