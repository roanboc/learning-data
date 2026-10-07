/* Day one: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Nineteen years after conquering England, William the Conqueror still didn't know exactly what he ruled.":
"Diecinueve años después de conquistar Inglaterra, Guillermo el Conquistador todavía no sabía con exactitud qué gobernaba.",
"At Christmas 1085, he sent surveyors across most of the country.":
"En la Navidad de 1085, envió inspectores por casi todo el país.",
"Who holds this land? What is on it? What is it worth?":
"¿Quién tiene esta tierra? ¿Qué hay en ella? ¿Cuánto vale?",
"Ploughs, mills and meadows, then and now.":
"Arados, molinos y prados, antes y ahora.",
"Their record became the Domesday Book.":
"Su registro se convirtió en el Domesday Book.",
"Before you can govern a place, you have to know what it is.":
"Antes de gobernar un lugar, tienes que saber qué es.",
"Today, Tomás starts as an enterprise architect at an energy utility owned by the regional government.":
"Hoy, Tomás empieza como arquitecto empresarial en una empresa de energía del gobierno regional.",
"It runs the poles and wires for the region, owns a few hydro and wind farms, and sells power to homes and businesses.":
"Opera la red de postes y cables de la región, tiene algunas centrales hidroeléctricas y eólicas, y vende electricidad a hogares y empresas.",
"By lunchtime he has a badge, an org chart, a list of a hundred and forty systems, and an invitation: the transition program.":
"A la hora del almuerzo ya tiene una credencial, un organigrama, una lista de ciento cuarenta sistemas y una invitación: el programa de transición.",
"Everyone asks what he thinks.":
"Todos le preguntan qué opina.",
"He doesn't know what to think yet. He doesn't even know what to ask.":
"Todavía no sabe qué opinar. Ni siquiera sabe qué preguntar.",
"Everything he's been given is true. None of it explains the place.":
"Todo lo que le dieron es cierto. Nada de eso explica el lugar.",
"The org chart shows who reports to whom, not what the utility must be able to do.":
"El organigrama muestra quién reporta a quién, no lo que la empresa tiene que ser capaz de hacer.",
"The system list shows what was bought, not what it's for.":
"La lista de sistemas muestra lo que se compró, no para qué sirve.",
"The process manual runs to four hundred pages, last revised six years ago.":
"El manual de procesos tiene cuatrocientas páginas y se revisó por última vez hace seis años.",
"And the strategy is five words on a slide.":
"Y la estrategia son cinco palabras en una diapositiva.",
"Each is a piece of the picture, cut from a different puzzle.":
"Cada uno es una pieza del cuadro, pero de un rompecabezas distinto.",
"Enterprise architecture is a way of looking at an organisation in layers, from why it exists down to what runs it.":
"La arquitectura empresarial es una forma de mirar una organización por capas, desde por qué existe hasta qué la hace funcionar.",
"Three questions hold the layers.":
"Tres preguntas sostienen las capas.",
"Why does it exist, and for whom?":
"¿Por qué existe, y para quién?",
"How does it work: who does what, with which information?":
"¿Cómo funciona: quién hace qué, con qué información?",
"And what runs it: which applications, on which technology?":
"¿Y qué la hace funcionar: qué aplicaciones, sobre qué tecnología?",
"Each layer is worked out from the one above.":
"Cada capa se deduce de la de arriba.",
"Start from the bottom, and you'll describe every system perfectly, and still not know what they're for.":
"Si empiezas por abajo, describirás cada sistema a la perfección, y aun así no sabrás para qué sirven.",
"There's no shortage of methods.":
"Métodos no faltan.",
"TOGAF gives a way to do the work. ArchiMate, a language to draw it. Zachman, a grid to sort it.":
"TOGAF da una forma de hacer el trabajo. ArchiMate, un lenguaje para dibujarlo. Zachman, una cuadrícula para ordenarlo.",
"Business architecture brings capabilities and value streams, process frameworks bring catalogues, domain-driven design shows where meanings change, and data management shows who looks after information.":
"La arquitectura de negocio aporta capacidades y cadenas de valor; los marcos de procesos, catálogos; el diseño guiado por el dominio muestra dónde cambian los significados; y la gestión de datos, quién cuida la información.",
"Each has its champions. Under the vocabulary, they agree on more than they differ.":
"Cada uno tiene sus defensores. Bajo el vocabulario, coinciden en más de lo que difieren.",
"This series takes what they agree on.":
"Esta serie toma aquello en lo que coinciden.",
"And it starts rough.":
"Y empieza en borrador.",
"A canvas on a wall: who the utility serves, what they need, and how it's paid for.":
"Un lienzo en una pared: a quién sirve la empresa, qué necesitan y cómo se paga.",
"Sticky notes can be argued with in an afternoon.":
"Con notas adhesivas, se puede discutir en una tarde.",
"Later, they become a capability map, then value streams, and finally a model in a formal notation.":
"Después se convierten en un mapa de capacidades, luego en cadenas de valor y, al final, en un modelo con una notación formal.",
"Notation is earned.":
"La notación se gana.",
"Draw too precisely too early, and people correct your drawing instead of your understanding.":
"Si dibujas con demasiada precisión demasiado pronto, la gente corrige tu dibujo en lugar de tu comprensión.",
"Tomás sets himself two rules.":
"Tomás se pone dos reglas.",
"Every note names where it came from: the annual report, the regulator's decision, the owner's statement of expectations, an interview.":
"Cada nota dice de dónde salió: el informe anual, la decisión del regulador, la declaración de expectativas del dueño, una entrevista.",
"And every note stays a draft until the person who owns that part of the business says it's right.":
"Y cada nota sigue siendo un borrador hasta que la persona responsable de esa parte del negocio dice que es correcta.",
"A map nobody has confirmed is one person's opinion, drawn neatly.":
"Un mapa que nadie confirmó es la opinión de una persona, bien dibujada.",
"Why would a data architect care?":
"¿Por qué le importaría a un arquitecto de datos?",
"Because every data rule is a claim about the organisation.":
"Porque cada regla de datos es una afirmación sobre la organización.",
"Take this one: an estimated meter reading stands only until the next actual reading.":
"Por ejemplo: una lectura estimada del medidor vale solo hasta la siguiente lectura real.",
"Which process creates it? Who owns it? Which goal does it serve?":
"¿Qué proceso la crea? ¿Quién es responsable? ¿A qué objetivo sirve?",
"Without the map, a rule is a guess, and when it's wrong, nobody knows who should fix it.":
"Sin el mapa, una regla es una suposición, y cuando falla, nadie sabe quién debe corregirla.",
"With the map, the rule has a home.":
"Con el mapa, la regla tiene un hogar.",
"Over eleven films, Tomás builds the map, one layer at a time.":
"En once películas, Tomás construye el mapa, capa por capa.",
"Seven films to understand the utility: who it serves, why it moves, what it must be able to do, how value reaches people, who does what, and what runs it.":
"Siete películas para entender la empresa: a quién sirve, qué la mueve, qué tiene que ser capaz de hacer, cómo llega el valor a la gente, quién hace qué y qué la hace funcionar.",
"Then four on what it means for data: the questions that matter, rules with a home, a change in strategy, and a map that people and agents can read.":
"Luego cuatro sobre lo que significa para los datos: las preguntas que importan, reglas con un hogar, un cambio de estrategia y un mapa que pueden leer personas y agentes.",
"The surveyors' first questions still work.":
"Las primeras preguntas de los inspectores siguen sirviendo.",
"What is this place? Who holds it? What is it worth?":
"¿Qué es este lugar? ¿Quién lo tiene? ¿Cuánto vale?",
"Tomás writes the first note.":
"Tomás escribe la primera nota."
});
