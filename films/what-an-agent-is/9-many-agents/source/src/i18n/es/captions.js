/* Many agents, and what emerges: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the governance films: Planificación, la plataforma, el día del censo, el consejo, facultad and carrera; the faculties
   Artes y Educación, Negocios, Ingeniería y TI and Salud; un agente principal, ayudantes and un agente revisor for the lead, the helpers and the
   checking agent; de solo lectura and un entorno aislado for read-only and a sandbox; el tablero for the shared board; desertores for "dropouts";
   termitero for a termite mound and la emergencia for emergence; and tú, as "Imagina" and "prueba el grupo" speak to the viewer. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Harare, Zimbabwe, 1992. A property company asked the architect Mick Pearce for offices and shops in the heart of the city.":
"Harare, Zimbabue, 1992. Una empresa inmobiliaria le pidió al arquitecto Mick Pearce oficinas y tiendas en pleno centro de la ciudad.",
"Buildings that size were usually cooled by air conditioning: imported, expensive, and running all day.":
"Los edificios de ese tamaño solían enfriarse con aire acondicionado: importado, caro y encendido todo el día.",
"That meant high bills, and high rents for the shops and offices inside.":
"Eso significaba facturas altas, y alquileres altos para las tiendas y oficinas del edificio.",
"Something had to change. The owners asked for a building that would cool itself.":
"Algo tenía que cambiar. Los dueños pidieron un edificio que se enfriara solo.",
"Pearce looked to termite mounds, which were thought then to breathe like chimneys,":
"Pearce se fijó en los termiteros, que entonces se creía que respiraban como chimeneas:",
"warm air rising out of the top and drawing fresh air in below.":
"el aire caliente sale por arriba y hace entrar aire fresco por abajo.",
"So he built Eastgate to breathe that way, with many simple parts instead of one big machine.":
"Así que construyó Eastgate para que respirara así, con muchas piezas simples en vez de una gran máquina.",
"On Harare's cool nights, fans pull air in, and concrete under the floors stores the cool.":
"En las noches frescas de Harare, los ventiladores hacen entrar aire, y el concreto bajo los pisos guarda el fresco.",
"By day, warm air rises out through forty-eight brick chimneys.":
"De día, el aire caliente sube y sale por cuarenta y ocho chimeneas de ladrillo.",
"Eastgate opened in 1996, with no air conditioning.":
"Eastgate abrió en 1996, sin aire acondicionado.",
"It cost about a tenth less to build, and used far less energy.":
"Construirlo costó cerca de una décima parte menos, y usaba mucha menos energía.",
"Rents could be lower, and its shops and offices were let before it was finished.":
"Los alquileres podían bajar, y sus tiendas y oficinas se alquilaron antes de terminarlo.",
"At the university, after each census day, the council asks why each faculty's count changed.":
"En la universidad, después de cada día del censo, el consejo pregunta por qué cambió el conteo de cada facultad.",
"The reasons sit in four faculties' notes and emails. Last year, gathering them took two weeks, and the budgets were set before they came.":
"Las razones están en notas y correos de cuatro facultades. El año pasado, reunirlas tomó dos semanas, y los presupuestos se fijaron antes.",
"This year, many small agents shared the work: drafts by the afternoon, and a mistake no one had asked them to find.":
"Este año, muchos agentes pequeños se repartieron el trabajo: borradores esa tarde, y un error que nadie les había pedido buscar.",
"No termite holds the plan of a mound.":
"Ninguna termita tiene el plano del termitero.",
"Each drops its mud where its nestmates' scent is strongest, so pillars rise, then arches. The work itself tells the next worker what to do.":
"Cada una deja su barro donde más huelen sus compañeras, y se alzan pilares, luego arcos. La obra le dice a la siguiente qué hacer.",
"Ants leave scent too. Given two bridges to food, most soon take the shorter,":
"Las hormigas también dejan olor. Ante dos puentes a la comida, casi todas toman pronto el más corto,",
"where scent builds up faster, and their trails become the colony's shared memory.":
"donde el olor se acumula más rápido, y sus rastros se vuelven la memoria compartida de la colonia.",
"Starlings over Rome turn together in flocks of thousands, each bird watching only six or seven neighbours. No bird leads.":
"Los estorninos sobre Roma giran juntos en bandadas de miles, y cada uno mira solo a seis o siete vecinos. Ninguno guía.",
"This is emergence: the whole does what no part planned. As John Holland, who studied it for decades, put it: more comes out than was put in.":
"Esto es la emergencia: el todo hace lo que ninguna parte planeó. Como dijo John Holland, que la estudió décadas: sale más de lo que entra.",
"Emergence is in us, too: no neuron thinks alone, and no one can yet trace how thought comes from eighty-six billion of them.":
"Está en nosotros también: ninguna neurona piensa sola, y nadie sabe aún cómo nace el pensamiento de ochenta y seis mil millones de ellas.",
"In markets, too. On the sixth of May 2010, trading programs in America did something no one planned.":
"También en los mercados. El 6 de mayo de 2010, programas de compraventa en Estados Unidos hicieron algo que nadie planeó.",
"One sold a huge order, whatever the price, and fast programs passed contracts back and forth like a hot potato.":
"Uno vendió una orden enorme, a cualquier precio, y programas rápidos se pasaban los contratos como una papa caliente.",
"In minutes, share prices fell another five to six percent, then came back. Some shares traded for a penny.":
"En minutos, las acciones cayeron otro cinco o seis por ciento, y luego se recuperaron. Algunas se vendieron a un centavo.",
"Regulators took five months to explain it, and people still argue about why.":
"Los reguladores tardaron cinco meses en explicarlo, y aún se discute por qué pasó.",
"Now we are building crowds of a new kind, many AI agents working together, and they are coming fast.":
"Ahora creamos multitudes de un nuevo tipo, muchos agentes de IA trabajando juntos, y están llegando rápido.",
"Often, a lead agent splits the job among helpers, each with its own instructions, and another agent checks what they find.":
"A menudo, un agente principal reparte el trabajo entre ayudantes, cada uno con sus instrucciones, y otro agente revisa lo que encuentran.",
"Such teams can beat one agent on hard research, at many times the computing.":
"Estos equipos pueden superar a un solo agente en investigaciones difíciles, con mucho más cómputo.",
"Yet a 2025 study of seven such systems found them failing on forty-one to eighty-seven percent of tasks.":
"Pero un estudio de 2025 sobre siete sistemas así halló que fallaban en cuarenta y uno a ochenta y siete de cada cien tareas.",
"And together, they do things no one planned.":
"Y juntos hacen cosas que nadie planeó.",
"In 2025, researchers paired agents at random, again and again, to agree on a name. With no one in charge, the whole group settled on one.":
"En 2025, unos investigadores emparejaron agentes al azar, una y otra vez, para acordar un nombre. Sin nadie a cargo, el grupo eligió uno.",
"And the group leaned towards some names, though no agent did alone.":
"Y el grupo se inclinó por algunos nombres, aunque ningún agente lo hacía solo.",
"So testing each agent alone isn't enough: test the group.":
"Así que probar cada agente por separado no basta: prueba el grupo.",
"At the university, the counts come from the platform, the same way every time. The reasons are in words: work for agents.":
"En la universidad, los conteos salen de la plataforma, igual cada vez. Las razones están en palabras: trabajo para agentes.",
"A lead agent gives each faculty to one helper, which can read but not change, in a sandbox.":
"Un agente principal le da cada facultad a un ayudante, que puede leer pero no cambiar, en un entorno aislado.",
"Each pins what it finds, with its source, to one shared board, and reads what the others pin.":
"Cada uno fija lo que encuentra, con su fuente, en un tablero compartido, y lee lo que fijan los demás.",
"A checking agent compares each reason with the numbers.":
"Un agente revisor compara cada razón con los números.",
"Two things appeared that no one had asked for. First, a pattern: three faculties each had a small drop that no note explained.":
"Aparecieron dos cosas que nadie había pedido. Primero, un patrón: tres facultades tenían una pequeña baja que ninguna nota explicaba.",
"Side by side on the board, they were the same thirty-one students, who had moved to a new joint degree that the count put in no faculty.":
"Juntas en el tablero, eran los mismos treinta y un estudiantes, que pasaron a una carrera conjunta nueva que el conteo dejó sin facultad.",
"Second, a word. One helper called the thirty-one dropouts. The others read it and copied it, until every draft said it.":
"Segundo, una palabra. Un ayudante llamó desertores a los treinta y uno. Los otros la leyeron y copiaron, hasta que cada borrador la decía.",
"None had left: the checking agent flagged that all thirty-one were still studying.":
"Ninguno se había ido: el agente revisor señaló que los treinta y uno seguían estudiando.",
"The agents drafted; a person decided. Clara, in Planning, fixed the word and approved the reasons.":
"Los agentes redactaron; una persona decidió. Clara, de Planificación, corrigió la palabra y aprobó las razones.",
"The joint degree got its faculty, and a new test now catches the next one without an agent.":
"La carrera conjunta recibió su facultad, y una nueva prueba ahora detecta la próxima sin un agente.",
"Crowds of agents can seem alive. Are they?":
"Las multitudes de agentes pueden parecer vivas. ¿Lo están?",
"In Chile, in 1972, Humberto Maturana and Francisco Varela said a living thing makes itself: a cell keeps making the parts that make it.":
"En Chile, en 1972, Humberto Maturana y Francisco Varela dijeron que lo vivo se hace a sí mismo: una célula hace las partes que la hacen.",
"Around 1950, near Bristol, Grey Walter built a robot tortoise that kept itself going: when its battery ran low, it went home to recharge.":
"Hacia 1950, cerca de Bristol, Grey Walter construyó una tortuga robot que se mantenía sola: con la batería baja, volvía a casa a recargarse.",
"In 2020, American scientists shaped frog cells, to a computer's design, into tiny bodies that swim and heal.":
"En 2020, científicos estadounidenses dieron forma a células de rana, según un diseño de computadora, en cuerpos diminutos que nadan y sanan.",
"A year later, some gathered loose cells into new ones.":
"Un año después, algunos juntaron células sueltas en otros nuevos.",
"Today's agents do none of this: they don't make themselves, and they run only because we run them.":
"Los agentes de hoy no hacen nada de esto: no se hacen a sí mismos, y funcionan solo porque nosotros los hacemos funcionar.",
"Imagine, and this is only imagined, agents that start other agents, mend each other's work, and keep systems running through the night.":
"Imagina, y es solo imaginado, agentes que inician otros agentes, corrigen el trabajo ajeno y mantienen sistemas en marcha toda la noche.",
"They might find what no person could, or settle on habits no person chose. We don't know.":
"Podrían encontrar lo que ninguna persona podría, o adoptar hábitos que nadie eligió. No lo sabemos.",
"Neither did Eastgate's builders.":
"Tampoco lo sabían los constructores de Eastgate.",
"Years later, sensors in real mounds showed the air moves less like a chimney than a lung,":
"Años después, sensores en termiteros reales mostraron que el aire se mueve menos como chimenea que como pulmón,",
"pushed by the day's warmth and the night's cool.":
"impulsado por el calor del día y el fresco de la noche.",
"Eastgate was built on the wrong idea, a scientist said, and still, it works:":
"Eastgate se construyó sobre una idea equivocada, dijo un científico, y aun así funciona:",
"people kept measuring it, and tuned its controls when the offices ran warm.":
"la gente siguió midiéndolo, y ajustó sus controles cuando las oficinas se calentaban.",
"Jun's team keeps its agents the same way: measured, read-only, with a person deciding, so together they find what one of us would miss.":
"El equipo de Jun trata igual a sus agentes: medidos, de solo lectura, con una persona que decide, y juntos hallan lo que uno solo no vería.",
"When many work together, something new appears, and we don't yet know what.":
"Cuando muchos trabajan juntos, aparece algo nuevo, y todavía no sabemos qué.",
"Next: agents at work on data.":
"Después: agentes trabajando con datos."
});
