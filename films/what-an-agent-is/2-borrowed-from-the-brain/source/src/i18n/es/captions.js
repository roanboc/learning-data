/* Borrowed from the brain: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words: la célula nerviosa and la neurona; el espacio for the gap between cells (the picture says "The gap"); la maraña for the thicket; una tinción for
   Golgi's stain; las rapaces for Wright's buzzards; el perceptrón; los pesos for weights; la temperatura and las porciones of la ruleta for the wheel's
   slices; the model's words in the bee's sentence are translated (bailando, zumbando), as the governance films translate the faculties' names; verificar
   for a check, as in the series; la ascidia for the sea squirt; el error de predicción; el bucle for the loop, as in A model, reasoning, hands and a loop; billones for English trillions and mil millones for billions; and tú, as the film speaks to the viewer. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 1958, the psychologist Frank Rosenblatt showed a program that learned from examples: the perceptron.":
"En 1958, el psicólogo Frank Rosenblatt mostró un programa que aprendía de ejemplos: el perceptrón.",
"He modelled it on a nerve cell.":
"Lo basó en una célula nerviosa.",
"Why look to nature to build a machine?":
"¿Por qué mirar a la naturaleza para crear máquinas?",
"Because nature has been trying out designs for billions of years, and keeping the ones that work.":
"Porque la naturaleza lleva miles de millones de años probando diseños, y conservando los que funcionan.",
"People watched birds for centuries before they could fly.":
"La gente observó a las aves durante siglos antes de poder volar.",
"Wilbur Wright noticed buzzards twisting their wingtips to keep their balance.":
"Wilbur Wright notó que las rapaces torcían la punta de las alas para mantener el equilibrio.",
"So the brothers built that twist into their wings.":
"Así que los hermanos pusieron esa torsión en sus alas.",
"And for a machine that learns, nature had the only working example: a brain.":
"Y para una máquina que aprende, la naturaleza tenía el único ejemplo que funcionaba: un cerebro.",
"But in 1888, nobody could see how a brain was wired.":
"Pero en 1888, nadie podía ver cómo estaba conectado un cerebro.",
"Barcelona, 1888. Santiago Ramón y Cajal, a doctor, teaches anatomy.":
"Barcelona, 1888. Santiago Ramón y Cajal, médico, enseña anatomía.",
"He looks at thin slices of brain under a microscope.":
"Observa al microscopio finas láminas de cerebro.",
"Under the lens, the brain is a thicket of fibres, too dense to follow.":
"Bajo la lente, el cerebro es una maraña de fibras, demasiado densa para seguirla.",
"Many scientists, among them the Italian Camillo Golgi, think the fibres are fused into one continuous net.":
"Muchos científicos, entre ellos el italiano Camillo Golgi, creen que las fibras se funden en una sola red continua.",
"If they are, nobody can say where a message starts, or how a brain learns.":
"Si es así, nadie puede decir dónde empieza un mensaje, ni cómo aprende un cerebro.",
"When a stroke cuts off the blood to part of someone's brain, it can take away their speech.":
"Cuando un derrame corta la sangre a una parte del cerebro de alguien, puede quitarle el habla.",
"Doctors can't tell what it has broken, or whether it will heal.":
"Los médicos no pueden saber qué ha dañado, ni si sanará.",
"Something has to change.":
"Algo tiene que cambiar.",
"Golgi himself had found a stain that turns a few cells black, and leaves the rest clear.":
"El propio Golgi había hallado una tinción que vuelve negras unas pocas células y deja claras las demás.",
"Which few, it seems to pick at random. Nobody knows why, even today.":
"Cuáles, parece elegirlas al azar. Nadie sabe por qué, ni siquiera hoy.",
"Cajal makes it work reliably, and uses the brains of young birds, where the thicket is thinner.":
"Cajal logra que funcione siempre, y usa cerebros de aves jóvenes, donde la maraña es menos densa.",
"Each black cell stands out whole, like a tree in winter.":
"Cada célula negra se ve entera, como un árbol en invierno.",
"He draws what he sees: separate cells, their branches reaching close to other cells, but never joined.":
"Dibuja lo que ve: células separadas, con ramas que llegan cerca de otras células, pero nunca unidas.",
"And he argues that a message travels one way: in through the branches, and out along one long fibre.":
"Y sostiene que un mensaje va en un solo sentido: entra por las ramas y sale por una fibra larga.",
"In Berlin, in 1889, the leading anatomists look down his microscopes, and agree.":
"En Berlín, en 1889, los principales anatomistas miran por sus microscopios, y le dan la razón.",
"In 1906, he and Golgi share the Nobel Prize, though Golgi still defends his net.":
"En 1906, él y Golgi comparten el Premio Nobel, aunque Golgi aún defiende su red.",
"The separate nerve cell, the neuron, became the starting point of brain science.":
"La célula nerviosa separada, la neurona, se volvió el punto de partida de la ciencia del cerebro.",
"Today, many medicines for the brain work at the gaps he drew.":
"Hoy, muchos medicamentos para el cerebro actúan en los espacios que él dibujó.",
"Machines had the same problem: without a picture of how a brain is wired, there was nothing to copy.":
"Las máquinas tenían el mismo problema: sin una imagen de cómo está conectado un cerebro, no había nada que copiar.",
"His picture gave them a design: many simple cells, each listening to many others, passing one message on.":
"Su imagen les dio un diseño: muchas células simples, cada una atenta a muchas otras, que pasan un mensaje.",
"Today's models are still built from it.":
"Los modelos de hoy aún parten de ella.",
"A neuron is a cell that carries messages.":
"Una neurona es una célula que lleva mensajes.",
"Its branches take in signals from thousands of other cells.":
"Sus ramas reciben señales de miles de otras células.",
"When enough arrive together, it fires: a pulse of electricity runs down its long fibre.":
"Cuando llegan suficientes a la vez, se dispara: un pulso eléctrico recorre su fibra larga.",
"The pulse is always the same size: all or nothing.":
"El pulso tiene siempre el mismo tamaño: todo o nada.",
"At the end, it almost touches the next cell, and chemical messengers carry the signal across the gap.":
"Al final, casi toca la célula siguiente, y unos mensajeros químicos llevan la señal a través del espacio.",
"Some connections excite the next cell; others hold it back.":
"Algunas conexiones excitan a la célula siguiente; otras la frenan.",
"And connections change.":
"Y las conexiones cambian.",
"In 1949, the psychologist Donald Hebb proposed that when two cells fire together, the link between them grows stronger.":
"En 1949, el psicólogo Donald Hebb propuso que, cuando dos células se disparan juntas, el vínculo entre ellas se fortalece.",
"In 1973, experiments on rabbits showed links growing stronger with use.":
"En 1973, experimentos con conejos mostraron vínculos que se fortalecían con el uso.",
"That's learning, inside a brain: connections that change.":
"Eso es aprender, dentro de un cerebro: conexiones que cambian.",
"Nature has tried out nerve cells for more than six hundred million years.":
"La naturaleza ha probado células nerviosas durante más de seiscientos millones de años.",
"A jellyfish has no brain: just a net of nerve cells, enough to swim and catch food.":
"Una medusa no tiene cerebro: solo una red de células nerviosas, suficiente para nadar y atrapar comida.",
"A sea slug has about twenty thousand nerve cells, some big enough to see.":
"Una babosa de mar tiene unas veinte mil células nerviosas, algunas tan grandes que se ven.",
"Eric Kandel showed that when it learns, its connections change.":
"Eric Kandel mostró que, cuando aprende, sus conexiones cambian.",
"A honeybee has about a million, in a brain smaller than a sesame seed.":
"Una abeja tiene cerca de un millón, en un cerebro menor que un grano de sésamo.",
"Bees learn colours, scents and the way home, and dance to tell each other where food is.":
"Las abejas aprenden colores, aromas y el camino a casa, y bailan para indicarse dónde hay comida.",
"An octopus has about half a billion, two thirds of them in its arms: each arm can taste on its own.":
"Un pulpo tiene unos quinientos millones, dos tercios en sus brazos: cada brazo puede saborear por sí solo.",
"A young zebra finch learns its song from its father, practising for weeks.":
"Un pinzón cebra joven aprende su canto de su padre, practicando durante semanas.",
"And a human brain has about 86 billion, joined by more than a hundred trillion connections.":
"Y un cerebro humano tiene unos 86 mil millones, unidos por más de cien billones de conexiones.",
"It runs on about 20 watts, the power of a dim light bulb.":
"Funciona con unos 20 vatios, la potencia de una bombilla tenue.",
"A brain doesn't take in everything: it fills gaps with what's likely.":
"Un cerebro no lo capta todo: rellena los huecos con lo probable.",
"Where the nerve leaves each eye, there are no cells to catch light: a blind spot.":
"Donde el nervio sale de cada ojo, no hay células que capten la luz: un punto ciego.",
"You never see a hole there. Your brain fills it in, from what's around it.":
"Nunca ves ahí un agujero. Tu cerebro lo rellena con lo que hay alrededor.",
"In 1943, Warren McCulloch and Walter Pitts drew Cajal's nerve cell as a simple unit.":
"En 1943, Warren McCulloch y Walter Pitts dibujaron la célula nerviosa de Cajal como una unidad simple.",
"It adds up its inputs, and fires if the total passes a set level.":
"Suma sus entradas y se dispara si el total pasa de un nivel fijado.",
"Rosenblatt's perceptron gave each connection a weight, a number nudged up or down as it learns, like Hebb's links.":
"El perceptrón de Rosenblatt dio a cada conexión un peso, un número que sube o baja un poco al aprender, como los vínculos de Hebb.",
"In 1959, David Hubel and Torsten Wiesel found cells in a cat's brain that fire for edges at one angle.":
"En 1959, David Hubel y Torsten Wiesel hallaron células en el cerebro de un gato que se disparan ante bordes en un ángulo.",
"They feed cells that respond to shapes.":
"Estas alimentan a células que responden a formas.",
"Networks that read pictures borrowed those layers.":
"Las redes que leen imágenes tomaron prestadas esas capas.",
"Today's models still add up weighted inputs, with billions of weights set by training.":
"Los modelos de hoy aún suman entradas con pesos, con miles de millones de pesos fijados por el entrenamiento.",
"But they borrowed an idea, not a brain.":
"Pero tomaron prestada una idea, no un cerebro.",
"A real nerve cell is far more complex: in 2021, it took a network of five to eight layers to mimic just one.":
"Una célula nerviosa real es mucho más compleja: en 2021, hizo falta una red de cinco a ocho capas para imitar solo una.",
"A child can learn a new word from a few examples; a model needs a great many.":
"Un niño puede aprender una palabra nueva con pocos ejemplos; un modelo necesita muchísimos.",
"Like a plane, which borrowed the wing, but not the flapping.":
"Como un avión, que tomó prestada el ala, pero no el aleteo.",
"A model writes one word at a time.":
"Un modelo escribe una palabra a la vez.",
"For the next word, it gives every word it knows a chance.":
"Para la siguiente, le da una posibilidad a cada palabra que conoce.",
"After \"A bee tells the hive where food is by\", \"dancing\" might get 70 chances in a hundred, and \"buzzing\" 12.":
"Tras «Una abeja le indica a la colmena dónde hay comida», «bailando» podría tener 70 posibilidades de cien, y «zumbando», 12.",
"Then it draws one, like spinning a wheel: big slices win most often, but not always.":
"Luego elige una, como al girar una ruleta: las porciones grandes ganan más a menudo, pero no siempre.",
"So the same question can bring a different answer: one word changes early on, and the rest follows.":
"Así, la misma pregunta puede dar otra respuesta: una palabra cambia al principio, y el resto la sigue.",
"A setting called temperature changes the slices.":
"Un ajuste llamado temperatura cambia las porciones.",
"Turned down, the biggest slice almost always wins, and answers stick to the patterns the model saw most.":
"Si se baja, la porción mayor casi siempre gana, y las respuestas se apegan a los patrones que el modelo vio más.",
"Turned up, small slices grow: answers vary more, sometimes in new ways, and more often go wrong.":
"Si se sube, las porciones pequeñas crecen: las respuestas varían más, a veces de formas nuevas, y fallan más a menudo.",
"Even turned right down, a little chance stays.":
"Aun al mínimo, queda un poco de azar.",
"When a model answers many people at once, its sums can come out a hair different, and tip a close choice.":
"Cuando un modelo responde a mucha gente a la vez, sus cuentas pueden salir apenas distintas, e inclinar una elección reñida.",
"And when the fact isn't there, the model still writes likely words.":
"Y cuando el dato no está, el modelo igual escribe palabras probables.",
"In a 2025 study, a model asked three times for a researcher's birthday gave three different dates, all wrong.":
"En un estudio de 2025, a un modelo se le pidió tres veces el cumpleaños de un investigador: dio tres fechas distintas, todas mal.",
"A birthday is a fact a model may have seen once, or never: there's no pattern to learn.":
"Un cumpleaños es un dato que un modelo quizá vio una vez, o nunca: no hay patrón que aprender.",
"And the tests models are trained to pass reward a guess over \"I don't know\": a guess might score; a blank never will.":
"Y las pruebas que los modelos se entrenan para aprobar premian adivinar sobre «no lo sé»: adivinar puede sumar; en blanco, nunca.",
"Brains fill gaps too, with what's likely, and just as surely.":
"Los cerebros también rellenan huecos con lo probable, y con la misma seguridad.",
"So a fluent answer isn't a checked one.":
"Así que una respuesta fluida no está verificada.",
"Cajal's picture held because others could check it.":
"La imagen de Cajal se sostuvo porque otros pudieron verificarla.",
"In the 1950s, electron microscopes showed the gap he had drawn, about twenty millionths of a millimetre wide.":
"En los años cincuenta, los microscopios electrónicos mostraron el espacio que dibujó, de unas veinte millonésimas de milímetro.",
"Models are built on that picture: simple units, and connections that change.":
"Los modelos se basan en esa imagen: unidades simples y conexiones que cambian.",
"Like brains, they fill gaps with what's likely, a little differently each time.":
"Como los cerebros, rellenan huecos con lo probable, cada vez de forma un poco distinta.",
"Knowing that, you know when to check them: against the evidence, as Cajal's drawings were checked.":
"Sabiéndolo, sabes cuándo verificarlos: contra la evidencia, como se verificaron los dibujos de Cajal.",
"Next, what an agent is: a model that reasons, with hands, in a loop.":
"A continuación, qué es un agente: un modelo que razona, con manos, en un bucle.",
"Off a rocky shore, a tadpole about a millimetre long swims through the sea.":
"Frente a una costa rocosa, un renacuajo de un milímetro nada por el mar.",
"It's a young sea squirt, with an eye spot, a tail, and a tiny brain of about 180 nerve cells.":
"Es una ascidia joven, con una mancha ocular, una cola y un cerebro diminuto de unas 180 células nerviosas.",
"For a few hours, it swims, looking for a rock to live on.":
"Durante unas horas, nada, buscando una roca donde vivir.",
"Then it glues its head to the rock, and never moves again.":
"Luego pega la cabeza a la roca, y nunca vuelve a moverse.",
"People say it eats its own brain. Not quite: its body takes the tail, and most of the brain, apart, and uses them again.":
"Se dice que se come su propio cerebro. No del todo: su cuerpo desarma la cola, y casi todo el cerebro, y los reutiliza.",
"On a rock, there's nothing left to steer.":
"En una roca, ya no hay nada que dirigir.",
"Brains are for animals that move: to find food, and not to become food.":
"Los cerebros son para animales que se mueven: para encontrar comida, y no volverse comida.",
"And moving well means guessing what comes next.":
"Y moverse bien es adivinar lo que viene.",
"Many scientists now think a brain fills in all the time, not just in one spot.":
"Hoy, muchos científicos creen que un cerebro rellena todo el tiempo, no solo en un punto.",
"It guesses what comes next, a moment ahead, and checks the guess against what the senses bring.":
"Adivina lo que viene, un momento por delante, y compara la predicción con lo que traen los sentidos.",
"A dragonfly doesn't chase a midge: it flies to where the midge will be, and catches about nine in ten.":
"Una libélula no persigue a un mosquito: vuela adonde estará el mosquito, y atrapa unos nueve de cada diez.",
"Step onto an escalator that has stopped, and you stumble: your legs were ready for it to move.":
"Pisa una escalera mecánica detenida, y tropiezas: tus piernas estaban listas para que se moviera.",
"What a brain expected, it barely notices. What it didn't, it notices at once: a prediction error.":
"Lo que un cerebro esperaba, apenas lo nota. Lo que no, lo nota al instante: un error de predicción.",
"In the 1990s, Wolfram Schultz listened to cells deep in monkeys' brains: a light came on, then a drop of juice.":
"En los años noventa, Wolfram Schultz escuchó células en lo hondo del cerebro de monos: se encendía una luz, y luego, una gota de jugo.",
"At first, the cells fired at the juice. Once the monkeys learned that the light came first, they fired at the light instead.":
"Al principio, las células se disparaban con el jugo. Cuando los monos aprendieron que la luz venía antes, se disparaban con la luz.",
"And when the light came but the juice didn't, they fell silent, just when the juice was due.":
"Y cuando llegaba la luz pero no el jugo, callaban, justo cuando tocaba el jugo.",
"Guess, check, learn from the miss: that's how an animal on the move finds food, and stays out of reach.":
"Predecir, verificar, aprender del error: así un animal en movimiento encuentra comida, y se mantiene fuera de alcance.",
"So what does a brain that guesses ahead mean for work with data?":
"¿Y qué significa un cerebro que adivina por delante para el trabajo con datos?",
"A lot of data work runs like a reflex: a trigger comes, a script runs the same steps, and stops.":
"Mucho trabajo con datos funciona como un reflejo: llega un disparador, un script hace los mismos pasos, y se detiene.",
"Every night, a script loads the day's course registrations, and checks one rule: the table isn't empty.":
"Cada noche, un script carga las inscripciones a cursos del día, y revisa una regla: la tabla no está vacía.",
"One Monday, only half the rows arrive. The rule passes, and the reports go out wrong.":
"Un lunes, solo llega la mitad de las filas. La regla pasa, y los informes salen mal.",
"An agent can work more like a brain: before it looks, it says what it expects.":
"Un agente puede trabajar más como un cerebro: antes de mirar, dice qué espera.",
"About 4,100 rows, as on most Mondays, from three campuses.":
"Unas 4,100 filas, como casi todos los lunes, de tres campus.",
"Then it looks, and measures the gap: 2,030 rows. A prediction error.":
"Luego mira, y mide la diferencia: 2,030 filas. Un error de predicción.",
"So it goes looking, as a forager would: it counts each campus, and finds that one sent nothing.":
"Así que va a buscar, como un animal en busca de alimento: cuenta cada campus, y ve que uno no envió nada.",
"When an assumption fails, a column renamed or a field left empty, it doesn't crash: it changes its plan, and writes down what changed.":
"Cuando falla una suposición, una columna renombrada o un campo vacío, no se cae: cambia su plan, y anota lo que cambió.",
"And it doesn't fix the reports on its own: it shows a person the gap, with its evidence.":
"Y no corrige los informes por su cuenta: le muestra la diferencia a una persona, con su evidencia.",
"Where nothing surprises, a plain script is still the right tool: cheaper, and the same every time.":
"Donde nada sorprende, un script sencillo sigue siendo la herramienta adecuada: más barato, e igual cada vez.",
"Expect, act, check, and adapt: the loop that kept moving animals alive.":
"Esperar, actuar, verificar y adaptarse: el bucle que mantuvo vivos a los animales que se mueven.",
"Agents borrowed the loop, not the brain.":
"Los agentes tomaron el bucle, no el cerebro."
});
