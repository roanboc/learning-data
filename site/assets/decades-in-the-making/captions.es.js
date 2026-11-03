/* Decades in the making: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series: un agente de IA; un modelo; razona, con manos, en un ciclo; el equipo de datos de Jun; este semestre. In the opening, printing is la imprenta, a
   press una prensa, Mainz Maguncia, and a lender un prestamista. The transformer keeps its name, as Spanish-speaking researchers say it, and the paper keeps its English title,
   Attention Is All You Need. The sentence about "it" stays in English, in quotes, because the picture shows it in English and Spanish would drop the pronoun. Facts are hechos,
   never datos, which is data. Numbers are written as in the English captions; a billion is mil millones. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Europe, in the 1440s. Every book is copied by hand, letter by letter.":
"Europa, en la década de 1440. Cada libro se copia a mano, letra por letra.",
"So books are slow to make, and rare.":
"Así, los libros tardan en hacerse, y son escasos.",
"In 1424, the University of Cambridge's library held 122 books.":
"En 1424, la biblioteca de la Universidad de Cambridge tenía 122 libros.",
"And every new copy can add new mistakes.":
"Y cada copia nueva puede sumar errores nuevos.",
"Something has to change.":
"Algo tiene que cambiar.",
"The idea that will change it is already four hundred years old.":
"La idea que lo cambiará ya tiene cuatrocientos años.",
"In China, in the 1040s, Bi Sheng made a piece of baked clay for each character.":
"En China, en la década de 1040, Bi Sheng hizo una pieza de arcilla cocida para cada carácter.",
"He set them in an iron frame, printed a page, and used them again.":
"Las puso en un marco de hierro, imprimió una página, y las volvió a usar.",
"In Korea, in 1377, monks printed a book with characters cast in metal: the oldest that survives.":
"En Corea, en 1377, unos monjes imprimieron un libro con caracteres fundidos en metal: el más antiguo que se conserva.",
"In Mainz, around 1450, a metalworker, Johannes Gutenberg, brought the other pieces together.":
"En Maguncia, hacia 1450, un artesano del metal, Johannes Gutenberg, reunió las demás piezas.",
"Letters cast in metal, all alike; an ink that clings to them; a press, like a wine press; and paper, now made in Germany.":
"Letras fundidas en metal, todas iguales; una tinta que se les adhiere; una prensa, como la del vino; y papel, que ya se hacía en Alemania.",
"And a lender, Johann Fust, put up the money for years of trying.":
"Y un prestamista, Johann Fust, puso el dinero para años de intentos.",
"By 1500, presses in more than two hundred towns had printed some thirty thousand different books.":
"Hacia 1500, imprentas en más de doscientas ciudades habían impreso unos treinta mil libros distintos.",
"And books grew cheaper, reaching far more readers.":
"Y los libros se abarataron, y llegaron a muchos más lectores.",
"Printing seemed to arrive all at once. It had taken four hundred years.":
"La imprenta pareció llegar de golpe. Le había llevado cuatrocientos años.",
"This term, an AI agent joins Jun Park's data team: software that works through tasks, step by step.":
"Este semestre, un agente de IA se suma al equipo de datos de Jun Park: un software que resuelve tareas, paso a paso.",
"To some, it's come from nowhere. Some fear it; some expect magic.":
"Para algunos, salió de la nada. Unos le temen; otros esperan magia.",
"But its ideas are decades old, and seen as long work, it's something they can understand.":
"Pero sus ideas tienen décadas, y visto como un largo trabajo, es algo que pueden entender.",
"Our road starts in July 1958.":
"Nuestro camino empieza en julio de 1958.",
"The US Navy showed reporters a perceptron, a program by the psychologist Frank Rosenblatt that learns from examples.":
"La Marina de Estados Unidos mostró a la prensa un perceptrón, un programa del psicólogo Frank Rosenblatt que aprende de ejemplos.",
"Shown cards marked on the left or the right, it guessed, and each wrong guess nudged its numbers.":
"Ante tarjetas marcadas a la izquierda o a la derecha, adivinaba, y cada error ajustaba un poco sus números.",
"After fifty tries, it could tell them apart by itself.":
"Tras cincuenta intentos, podía distinguirlas por sí solo.",
"A newspaper said the Navy expected it to walk, talk, and be conscious of its existence.":
"Un periódico dijo que la Marina esperaba que caminara, hablara y fuera consciente de su existencia.",
"But a single layer can't learn some patterns at all, as a book showed in 1969, and money moved elsewhere.":
"Pero una sola capa no puede aprender algunos patrones, como mostró un libro en 1969, y el dinero se fue a otra parte.",
"In 1986, three researchers showed how a network with several layers can learn.":
"En 1986, tres investigadores mostraron cómo puede aprender una red de varias capas.",
"It makes a guess, and measures how wrong it is.":
"Hace una suposición, y mide cuánto se equivoca.",
"The error is passed back, layer by layer, and every connection is nudged to make it smaller.":
"El error vuelve hacia atrás, capa por capa, y cada conexión se ajusta un poco para reducirlo.",
"Over many examples, the layers in between find patterns no one told them to look for.":
"Con muchos ejemplos, las capas intermedias encuentran patrones que nadie les dijo que buscaran.",
"But computers were slow and examples few, and for twenty years these networks stayed small.":
"Pero las computadoras eran lentas y los ejemplos pocos, y durante veinte años estas redes siguieron pequeñas.",
"In 2012, the pieces came together.":
"En 2012, las piezas se juntaron.",
"A team in Toronto trained a much bigger network on more than a million labelled photos.":
"Un equipo en Toronto entrenó una red mucho más grande con más de un millón de fotos etiquetadas.",
"It ran on two graphics chips, made for video games, which do hundreds of small sums at once.":
"Funcionaba en dos chips gráficos, hechos para videojuegos, que hacen cientos de sumas pequeñas a la vez.",
"In an image contest, its five best guesses missed the answer 15 times in a hundred.":
"En un concurso de imágenes, sus cinco mejores respuestas fallaron 15 veces de cada cien.",
"The next best entry missed 26.":
"La siguiente mejor propuesta falló 26.",
"The ideas were old. What was new was the power to run them.":
"Las ideas eran viejas. Lo nuevo era la potencia para ejecutarlas.",
"In 2017, a paper called Attention Is All You Need changed how these networks read.":
"En 2017, un artículo llamado Attention Is All You Need cambió cómo leen estas redes.",
"Before, they read a sentence one word at a time.":
"Antes, leían una oración palabra por palabra.",
"Its design, the transformer, takes in all the words at once, and learns which matter to each other.":
"Su diseño, el transformer, toma todas las palabras a la vez, y aprende cuáles importan entre sí.",
"In \"The team fixed the report because it was wrong\", it learns that \"it\" is the report.":
"En «The team fixed the report because it was wrong», aprende que «it» es el informe.",
"Reading all at once splits the work across many chips, so models could grow far bigger.":
"Leer todo a la vez reparte el trabajo entre muchos chips, así que los modelos pudieron crecer mucho más.",
"From 2018 to 2020, researchers trained transformers on huge collections of text from the web and books.":
"De 2018 a 2020, unos investigadores entrenaron transformers con enormes colecciones de texto de la web y de libros.",
"The task was simple: guess the next word, check it, and adjust.":
"La tarea era simple: adivinar la palabra siguiente, comprobarla, y ajustar.",
"Billions of times over, a model picked up grammar, facts and ways of writing.":
"Miles de millones de veces, un modelo fue aprendiendo gramática, hechos y formas de escribir.",
"The largest, in 2020, had 175 billion numbers to tune.":
"El más grande, en 2020, tenía 175 mil millones de números que ajustar.",
"It wrote fluently, but it wasn't trying to help: it only carried on the text.":
"Escribía con fluidez, pero no intentaba ayudar: solo continuaba el texto.",
"In 2022, researchers asked people to rank a model's answers, from best to worst.":
"En 2022, unos investigadores pidieron a personas que ordenaran las respuestas de un modelo, de mejor a peor.",
"Then they trained it to give the kind of answers people preferred.":
"Luego lo entrenaron para dar el tipo de respuestas que la gente prefería.",
"People preferred its answers to those of a model a hundred times bigger.":
"La gente prefirió sus respuestas a las de un modelo cien veces más grande.",
"Since 2024, models have also been trained to work through a problem step by step before they answer.":
"Desde 2024, los modelos también se entrenan para resolver un problema paso a paso antes de responder.",
"And they can use tools: search, run a query, read a file, and work with what comes back.":
"Y pueden usar herramientas: buscar, ejecutar una consulta, leer un archivo, y trabajar con lo que vuelve.",
"A model that reasons, with hands for tools, in a loop: that's an agent.":
"Un modelo que razona, con manos para las herramientas, en un ciclo: eso es un agente.",
"So why did it seem so sudden?":
"Entonces, ¿por qué pareció tan repentino?",
"Because three things arrived together.":
"Porque llegaron tres cosas a la vez.",
"Computing power: since 2010, the computing used to train the largest models has doubled about every six months.":
"Potencia de cómputo: desde 2010, el cómputo usado para entrenar los modelos más grandes se ha duplicado más o menos cada seis meses.",
"Data: the web, and millions of labelled examples.":
"Datos: la web, y millones de ejemplos etiquetados.",
"And money: the first transformer cost about nine hundred dollars to train; by 2023, the biggest cost tens of millions or more.":
"Y dinero: entrenar el primer transformer costó unos novecientos dólares; en 2023, los más grandes costaban decenas de millones o más.",
"It wasn't a sudden discovery. It was long work that finally had the power to run.":
"No fue un descubrimiento repentino. Fue un largo trabajo que por fin tuvo la potencia para funcionar.",
"Printing waited four hundred years for metal letters, paper, a press and a lender.":
"La imprenta esperó cuatrocientos años a las letras de metal, el papel, una prensa y un prestamista.",
"These ideas waited decades for chips, data and money.":
"Estas ideas esperaron décadas a los chips, los datos y el dinero.",
"So nobody on Jun's team expects magic from the agent, or needs to fear it: they know where it came from.":
"Por eso nadie en el equipo de Jun espera magia del agente, ni necesita temerle: saben de dónde vino."
});
