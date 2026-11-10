/* What they tell us about ourselves: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps
   to its caption. Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions
   on its picture, takes es.srt. The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails
   if a line has no caption.
   Words as in the series: el agente, un modelo, la consulta, la oficina de registro, el equipo de Jun, este semestre, verificar. A rough copy is una copia tosca; the
   inner ear el oído interno, a hearing aid un audífono, the implant el implante, its electrodes los electrodos. Chalmers's hard problem is el problema difícil, as
   Spanish-speaking philosophers call it; consciousness is la conciencia. 'Waltzing Matilda' and OpenWorm keep their names. Numbers as the English captions write them,
   with the picture's comma (18,412; 139,255); a billion is mil millones. Tú, as the film's last line speaks to the viewer. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Melbourne, Australia, 1978.":
"Melbourne, Australia, 1978.",
"Rod Saunders had lost his hearing in a car accident.":
"Rod Saunders había perdido la audición en un accidente de auto.",
"He could read his wife Margaret's lips, but he couldn't hear her voice.":
"Podía leerle los labios a su esposa, Margaret, pero no podía oír su voz.",
"A hearing aid only makes sound louder, and his inner ears no longer passed sound to his brain at all.":
"Un audífono solo sube el volumen, y sus oídos internos ya no le pasaban ningún sonido al cerebro.",
"For people like Rod, deaf as adults, it meant a life cut off from voices.":
"Para quienes, como Rod, quedaban sordos de adultos, era una vida aislada de las voces.",
"Even a pioneer of the field doubted, in 1966, that an adult brain could ever learn to understand speech from electric signals:":
"Incluso un pionero del campo dudó, en 1966, de que un cerebro adulto pudiera aprender a entender el habla a partir de señales eléctricas:",
"a ‘foreign language’, he called it.":
"un ‘idioma extranjero’, lo llamó.",
"Something had to change.":
"Algo tenía que cambiar.",
"The surgeon Graeme Clark had watched his own father go deaf.":
"El cirujano Graeme Clark había visto a su propio padre quedarse sordo.",
"For ten years, he and his team worked on a rough copy of the inner ear:":
"Durante diez años, él y su equipo trabajaron en una copia tosca del oído interno:",
"an implant, a fine wire with ten electrodes, to carry sound to the nerve as electric pulses.":
"un implante, un cable fino con diez electrodos, para llevar el sonido al nervio como pulsos eléctricos.",
"On the first of August 1978, it went in.":
"El 1 de agosto de 1978, se lo implantaron.",
"When the team played ‘Waltzing Matilda’, Rod sang along.":
"Cuando el equipo puso ‘Waltzing Matilda’, Rod se puso a cantarla.",
"By December, he understood words with no lips to read.":
"Para diciembre, entendía palabras sin labios que leer.",
"The copy was rough: ten electrodes, where a healthy ear has thousands of tiny cells that turn sound into signals.":
"La copia era tosca: diez electrodos, donde un oído sano tiene miles de células diminutas que convierten el sonido en señales.",
"Rod's brain did the rest: with practice, it learned the ‘foreign language’.":
"El cerebro de Rod hizo el resto: con práctica, aprendió el ‘idioma extranjero’.",
"By 2019, more than seven hundred thousand implants had been fitted worldwide.":
"Para 2019, se habían colocado más de setecientos mil implantes en el mundo.",
"It's the same with the agents we build for data.":
"Lo mismo pasa con los agentes que creamos para los datos.",
"They're rough copies too, of neurons and of what people wrote.":
"También son copias toscas, de neuronas y de lo que la gente escribió.",
"Seeing where they're like us, and where they're not, shows a team what to hand them, and what to keep.":
"Ver en qué se parecen a nosotros, y en qué no, le muestra a un equipo qué encargarles, y qué conservar.",
"Today, at the university.":
"Hoy, en la universidad.",
"The agent has counted this term's students, 18,412, and shown the query behind the number.":
"El agente contó los estudiantes de este semestre, 18,412, y mostró la consulta detrás del número.",
"Mei, in the registrar's office, has checked it and signed.":
"Mei, en la oficina de registro, lo verificó y firmó.",
"Over coffee, the questions start.":
"Con un café, empiezan las preguntas.",
"Jun wonders if our brains work like this.":
"Jun se pregunta si nuestro cerebro funciona así.",
"Mei, if it could have an idea of its own.":
"Mei, si podría tener una idea propia.",
"Noor, if a perfect copy of a brain would be a mind.":
"Noor, si una copia perfecta de un cerebro sería una mente.",
"Sam, if it feels anything.":
"Sam, si siente algo.",
"And Yusuf asks what makes us human, then.":
"Y Yusuf pregunta qué nos hace humanos, entonces.",
"For some of these questions, there's no answer yet.":
"Algunas de estas preguntas todavía no tienen respuesta.",
"First: what has building them taught us about the brain?":
"Primero: ¿qué nos enseñó construirlos sobre el cerebro?",
"In 1958, the psychologist Frank Rosenblatt described the perceptron, a learning machine made as a rough copy of neurons,":
"En 1958, el psicólogo Frank Rosenblatt describió el perceptrón, una máquina que aprende, hecha como copia tosca de las neuronas,",
"to understand how a brain senses, remembers and acts.":
"para entender cómo un cerebro percibe, recuerda y actúa.",
"Today's models descend from it, and learn mostly by guessing the next word.":
"Los modelos de hoy descienden de él, y aprenden sobre todo adivinando la siguiente palabra.",
"In 2022, scientists recorded the brains of nine people listening to a podcast.":
"En 2022, unos científicos registraron el cerebro de nueve personas que escuchaban un pódcast.",
"Before each word came, their brains were already guessing it.":
"Antes de que llegara cada palabra, su cerebro ya la estaba adivinando.",
"Karl Friston and Andy Clark had long argued that this is what brains do: predict, and learn from the errors.":
"Karl Friston y Andy Clark sostenían desde hacía tiempo que eso hace el cerebro: predecir, y aprender de los errores.",
"Rod's brain did something like it, matching ten rough signals to the voices it remembered.":
"El cerebro de Rod hizo algo parecido: unió diez señales toscas con las voces que recordaba.",
"But the copy stops somewhere.":
"Pero la copia se detiene en algún punto.",
"A brain guesses at many levels at once, from the next word to where the story is going.":
"Un cerebro adivina en muchos niveles a la vez, desde la siguiente palabra hasta adónde va la historia.",
"To imitate one kind of brain cell, researchers needed a network five to eight layers deep.":
"Para imitar un tipo de célula cerebral, los investigadores necesitaron una red de cinco a ocho capas.",
"And how a brain learns from its errors, nobody knows yet.":
"Y cómo aprende un cerebro de sus errores, nadie lo sabe todavía.",
"Second: when a model writes a poem, is it creating, or mixing what it learned?":
"Segundo: cuando un modelo escribe un poema, ¿está creando, o mezclando lo que aprendió?",
"We learn from others too, and mix what we learned in new ways.":
"Nosotros también aprendemos de otros, y mezclamos lo aprendido de formas nuevas.",
"In 1843, Ada Lovelace wrote that the first design for a computer could do only ‘whatever we know how to order it to perform’.":
"En 1843, Ada Lovelace escribió que el primer diseño de una computadora solo podía hacer ‘lo que sepamos ordenarle que haga’.",
"In 1990, the philosopher Margaret Boden described three ways to be creative:":
"En 1990, la filósofa Margaret Boden describió tres maneras de ser creativo:",
"combining ideas, exploring a style, and changing the style's own rules.":
"combinar ideas, explorar un estilo, y cambiar las propias reglas del estilo.",
"A model can combine ideas and explore a style.":
"Un modelo puede combinar ideas y explorar un estilo.",
"But a person brings what a mix may not: a life, an intention, a reason to make it.":
"Pero una persona aporta lo que una mezcla quizá no: una vida, una intención, una razón para hacerlo.",
"Clark's reason was his father.":
"La razón de Clark fue su padre.",
"Boden said that whether a computer could ever really be creative is not for science alone to settle.":
"Boden dijo que si una computadora puede ser de verdad creativa no es algo que la ciencia pueda resolver sola.",
"It's partly about what we mean, and partly a choice we'll have to make.":
"En parte depende de lo que queremos decir, y en parte es una decisión que tendremos que tomar.",
"Third: if we copied a brain, wire by wire, would we get a mind?":
"Tercero: si copiáramos un cerebro, cable por cable, ¿tendríamos una mente?",
"By 1986, the wiring of a tiny worm's 302 neurons had been mapped.":
"Para 1986, ya se habían mapeado las conexiones de las 302 neuronas de un gusano diminuto.",
"Since 2011, an open project, OpenWorm, has worked on a copy of it on a computer.":
"Desde 2011, un proyecto abierto, OpenWorm, trabaja en una copia de él en una computadora.",
"It wriggles, but not much more: a map doesn't say how each connection works, or when.":
"Se retuerce, pero poco más: un mapa no dice cómo funciona cada conexión, ni cuándo.",
"In 2024, a fly's whole brain was mapped, 139,255 neurons,":
"En 2024, se mapeó el cerebro completo de una mosca, 139,255 neuronas,",
"and a model built from the map predicted which ones answer to sugar.":
"y un modelo hecho a partir del mapa predijo cuáles responden al azúcar.",
"We have about 86 billion.":
"Nosotros tenemos unos 86 mil millones.",
"And a copy can act like us without working like us.":
"Y una copia puede actuar como nosotros sin funcionar como nosotros.",
"Rod's implant did part of an ear's work, but not as an ear does:":
"El implante de Rod hacía parte del trabajo de un oído, pero no como lo hace un oído:",
"it was made for speech, and to many people with implants, music still sounds poor.":
"estaba hecho para el habla, y a muchas personas con implantes la música todavía les suena pobre.",
"Would a copy that worked exactly like us be a mind?":
"¿Una copia que funcionara exactamente como nosotros sería una mente?",
"The philosopher John Searle wrote that no one supposes a simulated rainstorm ‘will leave us all drenched’.":
"El filósofo John Searle escribió que nadie supone que una tormenta simulada ‘nos dejará a todos empapados’.",
"Others say a mind is what a brain does, so a perfect copy would be one.":
"Otros dicen que una mente es lo que hace un cerebro, así que una copia perfecta lo sería.",
"Nobody knows who's right.":
"Nadie sabe quién tiene razón.",
"Fourth, and hardest: why does it feel like anything to be us?":
"Cuarto, y lo más difícil: ¿por qué ser nosotros se siente como algo?",
"The implant turned sound into pulses.":
"El implante convertía el sonido en pulsos.",
"It didn't hear anything.":
"No oía nada.",
"Rod did.":
"Rod sí.",
"In 1995, the philosopher David Chalmers called this the hard problem:":
"En 1995, el filósofo David Chalmers llamó a esto el problema difícil:",
"‘Why should physical processing give rise to a rich inner life at all?’":
"‘¿Por qué el procesamiento físico habría de dar lugar a una rica vida interior?’",
"Scientists have theories.":
"Los científicos tienen teorías.",
"One says experience comes from how tightly a system's parts work as one.":
"Una dice que la experiencia viene de cuán unidas trabajan las partes de un sistema.",
"Another, from news shared across the whole brain at once.":
"Otra, de noticias compartidas por todo el cerebro a la vez.",
"In 2025, a test of both, with 256 people and rules both sides had agreed beforehand, challenged key parts of each.":
"En 2025, una prueba de ambas, con 256 personas y reglas acordadas antes por los dos bandos, cuestionó partes clave de cada una.",
"Science doesn't know yet.":
"La ciencia todavía no lo sabe.",
"Could a machine feel, then?":
"¿Podría sentir una máquina, entonces?",
"The neuroscientist Rodolfo Llinás, from Colombia, found that awake and dreaming, the brain hums about forty times a second.":
"El neurocientífico colombiano Rodolfo Llinás descubrió que, despierto y soñando, el cerebro oscila unas cuarenta veces por segundo.",
"He thought this rhythm ties what we sense into one moment.":
"Pensaba que este ritmo une lo que percibimos en un solo momento.",
"In deep sleep, it fades.":
"En el sueño profundo, se apaga.",
"Roger Penrose and Stuart Hameroff look deeper, to quantum effects in microtubules, tiny tubes inside our neurons.":
"Roger Penrose y Stuart Hameroff miran más hondo, a efectos cuánticos en los microtúbulos, tubos diminutos dentro de nuestras neuronas.",
"Critics say a warm, wet brain would wipe out such effects far too fast to matter.":
"Los críticos dicen que un cerebro tibio y húmedo borraría esos efectos demasiado rápido para que importen.",
"Penrose and Hameroff disagree, and the tests go on.":
"Penrose y Hameroff no están de acuerdo, y las pruebas siguen.",
"In 2001, Llinás wrote that he sincerely doubted the quantum idea.":
"En 2001, Llinás escribió que dudaba sinceramente de la idea cuántica.",
"Yet in 2007, he said he didn't know what in our cells produces feeling.":
"Pero en 2007, dijo que no sabía qué en nuestras células produce el sentir.",
"‘Filaments? Microtubules? Quantum mechanics?’":
"‘¿Filamentos? ¿Microtúbulos? ¿Mecánica cuántica?’",
"In 2023, nineteen researchers checked today's AI for fourteen signs of consciousness, drawn from the leading theories.":
"En 2023, diecinueve investigadores buscaron en la IA actual catorce señales de conciencia, tomadas de las principales teorías.",
"None of the systems seemed conscious, but nothing obvious stops us building ones that show the signs.":
"Ningún sistema parecía consciente, pero nada evidente impide construir sistemas que muestren esas señales.",
"Whether showing them means feeling anything, nobody knows.":
"Si mostrarlas significa sentir algo, nadie lo sabe.",
"Last: what makes us human, then?":
"Por último: ¿qué nos hace humanos, entonces?",
"In 1637, René Descartes wrote that a machine could never arrange its words in different ways,":
"En 1637, René Descartes escribió que una máquina nunca podría ordenar sus palabras de distintas maneras,",
"to answer whatever is said to it, as even the dullest people can.":
"para responder a lo que se le diga, como puede hacerlo hasta la persona más torpe.",
"Today, machines do.":
"Hoy, las máquinas lo hacen.",
"If not language, then what?":
"Si no es el lenguaje, ¿entonces qué?",
"A body that can be hurt?":
"¿Un cuerpo que puede sufrir daño?",
"A life lived with others?":
"¿Una vida vivida con otros?",
"Feelings?":
"¿Los sentimientos?",
"Choosing what matters, and answering for it?":
"¿Elegir lo que importa, y responder por ello?",
"Nobody has settled it.":
"Nadie lo ha resuelto.",
"Rod heard Margaret's voice again, through ten electrodes and a brain that learned.":
"Rod volvió a oír la voz de Margaret, con diez electrodos y un cerebro que aprendió.",
"Building copies keeps teaching us about ourselves: where they're like us, where they're not, and how much we still don't know.":
"Construir copias nos sigue enseñando sobre nosotros: en qué se parecen a nosotros, en qué no, y cuánto aún no sabemos.",
"Seeing that helps Jun's team decide what to hand the agent, and what to keep.":
"Ver eso ayuda al equipo de Jun a decidir qué encargarle al agente, y qué conservar.",
"We don't have the answers yet.":
"Todavía no tenemos las respuestas.",
"Keep wondering.":
"Sigue preguntándote."
});
