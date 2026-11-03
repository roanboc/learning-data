/* Why we govern them: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the governance films: dueño for owner, gobernanza for governance and gobernar for the verb; el conteo del día del censo, estudiantes,
   el gobierno; de solo lectura and un entorno aislado for read-only and a sandbox; borradores for drafts; en pruebas for in test; producción; permisos for an
   agent's rights, un rol for a role, and el papel de la persona for the person's part in Feng, McDonald and Zhang's levels; un mandato for a mandate; revisar
   and revisión for checking and review, aprobar for approving; el maquinista for the train's driver, la cabina, la vía and los rieles. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Japan, 1964.":
"Japón, 1964.",
"The national railway is opening a new line from Tokyo to Osaka:":
"El ferrocarril nacional abre una nueva línea de Tokio a Osaka:",
"the world's first high-speed railway, built for trains at 210 kilometres an hour.":
"el primer tren de alta velocidad del mundo, hecho para trenes a 210 kilómetros por hora.",
"At that speed, a train covers a kilometre in seventeen seconds.":
"A esa velocidad, un tren recorre un kilómetro en diecisiete segundos.",
"Its driver can't read the signals beside the track in time, and the train can't slow down at once.":
"Su maquinista no alcanza a leer a tiempo las señales junto a la vía, y el tren no puede frenar de golpe.",
"A missed signal could cost lives: in Tokyo in 1962, a train ran past a red one, and in the crashes that followed, 160 people died.":
"Pasarse una señal puede costar vidas: en Tokio, en 1962, un tren pasó una en rojo, y en los choques que siguieron murieron 160 personas.",
"Passengers' lives would rest on one person seeing every signal in time.":
"La vida de los pasajeros dependería de que una persona viera a tiempo cada señal.",
"Something had to change.":
"Algo tenía que cambiar.",
"So the railway's engineers build the limits into the line itself.":
"Así que los ingenieros del ferrocarril ponen los límites en la propia vía.",
"A signal inside the driver's cab shows the speed allowed, and if the train goes faster, it slows itself down.":
"Una señal en la cabina muestra la velocidad permitida, y si el tren va más rápido, frena solo.",
"One control room watches every train on the line.":
"Una sala de control vigila cada tren de la línea.",
"And the driver still drives, and answers for the train.":
"Y el maquinista sigue conduciendo, y responde por el tren.",
"It worked.":
"Funcionó.",
"For passengers, the trip fell from six and a half hours to four.":
"Para los pasajeros, el viaje bajó de seis horas y media a cuatro.",
"And since that first day, no passenger on Japan's high-speed lines has died in a derailment or a collision.":
"Y desde ese primer día, ningún pasajero de la alta velocidad de Japón ha muerto en un descarrilamiento o un choque.",
"The limits weren't there because the trains were bad.":
"Los límites no estaban ahí porque los trenes fueran malos.",
"They were there because the trains were fast.":
"Estaban ahí porque los trenes eran rápidos.",
"At the university, Jun's agent is fast too, and no one can watch its every step.":
"En la universidad, el agente de Jun también es rápido, y nadie puede vigilar cada paso que da.",
"So we build its limits into how it works.":
"Así que sus límites van en cómo trabaja.",
"Then we can let it do more.":
"Así podemos dejar que haga más.",
"Jun's agent helps with the census-day count: the number of students the university sends the government.":
"El agente de Jun ayuda con el conteo del día del censo: el número de estudiantes que la universidad envía al gobierno.",
"A plain job counts them.":
"Un proceso simple los cuenta.",
"When it fails at night, the agent finds the cause in test, and people approve its fix.":
"Cuando falla de noche, el agente encuentra la causa en pruebas, y unas personas aprueban su arreglo.",
"Now the team wonders whether it could do more: work for all of them, or even change the pipeline itself.":
"Ahora el equipo se pregunta si podría hacer más: trabajar para todos, o incluso cambiar el propio flujo de datos.",
"An agent is capable: it knows more than any junior, and works faster.":
"Un agente es capaz: sabe más que cualquier junior, y trabaja más rápido.",
"It's convincing: it sounds sure, and feeling sure is not knowing.":
"Es convincente: suena seguro, y sentirse seguro no es saber.",
"And it's unaccountable: it can't answer for what it does.":
"Y no rinde cuentas: no puede responder por lo que hace.",
"The agent acts; a person answers.":
"El agente actúa; una persona responde.",
"So Yusuf, who leads data governance, asks what the university asks of any new colleague.":
"Así que Yusuf, líder de gobernanza de datos, pregunta lo que la universidad pide a todo colega nuevo.",
"Who answers for it?":
"¿Quién responde por él?",
"Under what name does it work?":
"¿Con qué nombre trabaja?",
"What may it touch?":
"¿Qué puede tocar?",
"And who checks its work?":
"¿Y quién revisa su trabajo?",
"An owner, an identity, limits and review.":
"Un dueño, una identidad, límites y revisión.",
"First, an owner.":
"Primero, un dueño.",
"An agent can't answer for what it does, so a person must, as the driver answered for the train.":
"Un agente no puede responder por lo que hace, así que debe hacerlo una persona, como el maquinista por el tren.",
"Jun set this agent up, so he owns it.":
"Jun creó este agente: es su dueño.",
"He decides what it's for, reads what it did, and can stop it.":
"Él decide para qué sirve, lee lo que hizo, y puede detenerlo.",
"If he moves on, he hands it over, or it stops.":
"Si Jun se va, lo entrega a otra persona, o se detiene.",
"And because an agent in the wrong hands does harm faster, not just anyone may own one.":
"Y como un agente en malas manos hace daño más rápido, no cualquiera puede ser dueño de uno.",
"Second, an identity: the name it works under.":
"Segundo, una identidad: el nombre con el que trabaja.",
"Today, Jun's agent works under Jun's name.":
"Hoy, el agente de Jun trabaja con el nombre de Jun.",
"While it's learning, with read-only tools and a sandbox for its drafts, that's fine.":
"Mientras aprende, con herramientas de solo lectura y un entorno aislado para sus borradores, está bien.",
"But its work looks like his, and to stop it, you'd have to stop Jun.":
"Pero su trabajo parece de Jun, y para detenerlo habría que detener a Jun.",
"To work for the team, it needs a name of its own.":
"Para trabajar para el equipo, necesita un nombre propio.",
"Then, as the control room saw each train, the team sees everything it does, and can stop it without stopping anyone else.":
"Entonces, como la sala de control veía cada tren, el equipo ve todo lo que hace, y puede detenerlo sin detener a nadie más.",
"Third, limits.":
"Tercero, límites.",
"An agent has no rights of its own, only its role's.":
"Un agente no tiene permisos propios, solo los de su rol.",
"A train can only go where its rails go.":
"Un tren solo puede ir adonde van sus rieles.",
"An agent can go wherever its tools reach.":
"Un agente puede ir adonde lleguen sus herramientas.",
"So each tool gets the fewest rights: read-only when reading is enough, writing only drafts in its sandbox, and no sensitive data.":
"Cada herramienta recibe los mínimos permisos: lectura si basta con leer, solo borradores en su entorno aislado, y ningún dato sensible.",
"How much it may do alone is our choice.":
"Cuánto puede hacer solo lo decidimos nosotros.",
"Its skill doesn't decide it.":
"Su capacidad no lo decide.",
"It's written down as a mandate its owner signs: which tasks, where, and how each is checked.":
"Se escribe como un mandato que firma su dueño: qué tareas, dónde, y cómo se revisa cada una.",
"Like the speed in the cab, it's set from outside, it can be lowered at any time, and the agent can never raise it.":
"Como la velocidad en la cabina, se fija desde fuera, puede bajarse en cualquier momento, y el agente nunca puede subirla.",
"Fourth, review.":
"Cuarto, revisión.",
"A person checks the agent's work, and because it sounds sure, checks its evidence, not its tone.":
"Una persona revisa el trabajo del agente, y como suena seguro, revisa su evidencia, no su tono.",
"It never approves its own work, and no agent approves anyone's: an agent's review is only for reference.":
"Nunca aprueba su propio trabajo, y ningún agente aprueba el de nadie: la revisión de un agente es solo de referencia.",
"No train turns its own signal green.":
"Ningún tren pone su propia señal en verde.",
"In test, away from the real work, an agent may do agreed tasks alone, and report what it did.":
"En pruebas, lejos del trabajo real, un agente puede hacer solo tareas acordadas, e informar lo que hizo.",
"But every change to production, the work people rely on, is checked by its owner and approved by a second person,":
"Pero cada cambio en producción, el trabajo del que dependen las personas, lo revisa su dueño y lo aprueba otra persona,",
"the same as people's changes.":
"como los cambios de las personas.",
"In most ways, an agent is treated like any colleague: a role, the same rules, the same security.":
"En casi todo, a un agente se le trata como a cualquier colega: un rol, las mismas reglas, la misma seguridad.",
"Four rules are special.":
"Cuatro reglas son especiales.",
"It has no rights of its own, only a role's.":
"No tiene permisos propios, solo los de un rol.",
"It always has a human owner.":
"Siempre tiene un dueño humano.",
"It never approves its own work: agents are never approvers.":
"Nunca aprueba su propio trabajo: los agentes nunca aprueban.",
"And its autonomy is a written mandate that can be taken back, with a person approving every change to production.":
"Y su autonomía es un mandato escrito que se puede retirar, con una persona que aprueba cada cambio en producción.",
"These ideas have names in the field:":
"Estas ideas ya tienen nombre:",
"levels of autonomy set by the person's role, from Feng, McDonald and Zhang;":
"niveles de autonomía según el papel de la persona, de Feng, McDonald y Zhang;",
"ISO/IEC 42001; and NIST's AI Risk Management Framework.":
"la ISO/IEC 42001; y el Marco de Gestión de Riesgos de IA del NIST.",
"Series 3 and 4 put them to work.":
"Las series 3 y 4 las ponen en práctica.",
"More than sixty years on, trains on that first line run at 285 kilometres an hour, and the limits are still built in.":
"Más de sesenta años después, los trenes de esa primera línea van a 285 kilómetros por hora, y los límites siguen en la vía.",
"Not because the trains are bad.":
"No porque los trenes sean malos.",
"Because they are fast.":
"Porque son rápidos.",
"We govern agents for the same reason: because they are capable, not because they are bad.":
"Gobernamos a los agentes por lo mismo: porque son capaces, no porque sean malos.",
"With an owner, a name, limits and review, Jun's team can let its agent do more,":
"Con un dueño, un nombre, límites y revisión, el equipo de Jun puede dejar que su agente haga más,",
"and still trust the number the university sends the government.":
"y seguir confiando en el número que la universidad envía al gobierno.",
"Next, what agents tell us about ourselves.":
"Después, qué nos dicen de nosotros los agentes.",
"Then, in series 2, Jun's agent goes to work.":
"Y en la serie 2, el agente de Jun se pone a trabajar."
});
