/* Reports on demand: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series' page: la docencia ocasional, el costo de la docencia ocasional, Finanzas, RR. HH., la Facultad de Salud (Salud), un reporte, un tablero, a pedido;
   el día de pago and la nómina for the pay day and the pay run; una declaración de horas for a casual claim (las declaraciones); las cargas sociales for on-costs;
   in 1936, la central telefónica, la operadora, Correos for the Post Office and el reloj parlante for the speaking clock, whose number, TIM, keeps its English word («time»).
   The platform's names stay as they are on screen: Genie One, a Genie Agent, the Ask Genie button. Tú, as the film's last lines speak to the viewer (no reinventes, Pide).
   Numbers keep the picture's comma and point (2,960; A$1.84 millones), as the module's other Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"London, 1936.":
"Londres, 1936.",
"To know the exact time, people rang the telephone exchange, and asked the operator.":
"Para saber la hora exacta, la gente llamaba a la central telefónica y le preguntaba a la operadora.",
"She read it from the clock on the exchange wall.":
"Ella la leía en el reloj de la pared de la central.",
"But it was never quite exact to the second.":
"Pero nunca era del todo exacta al segundo.",
"And the exchange couldn't always answer just when a caller asked.":
"Y la central no siempre podía responder justo cuando alguien preguntaba.",
"So a clock or a watch set by that answer could be out.":
"Así, un reloj ajustado con esa respuesta podía quedar desfasado.",
"And the time is a question everyone asks, again and again.":
"Y la hora es una pregunta que todos hacen, una y otra vez.",
"Something had to change.":
"Algo tenía que cambiar.",
"So the Post Office's own engineers built a machine to answer it: the speaking clock.":
"Así que los propios ingenieros de Correos construyeron una máquina para responderla: el reloj parlante.",
"Jane Cain, one of the operators, recorded its words on glass discs.":
"Jane Cain, una de las operadoras, grabó sus palabras en discos de vidrio.",
"A clock played them at the right moment.":
"Un reloj las reproducía en el momento justo.",
"And every hour, it was checked against Greenwich, where Britain's time was kept.":
"Y cada hora se comparaba con Greenwich, donde se llevaba la hora de Gran Bretaña.",
"From 24 July 1936, anyone in London could dial TIM, for time.":
"Desde el 24 de julio de 1936, cualquiera en Londres podía marcar TIM, de «time».",
"They heard the time, right to a tenth of a second, at any hour of the day or night.":
"Oían la hora, exacta a la décima de segundo, a cualquier hora del día o de la noche.",
"In less than a year, it answered more than 12 million calls.":
"En menos de un año, respondió más de 12 millones de llamadas.",
"The exact time, on demand, for anyone.":
"La hora exacta, a pedido, para cualquiera.",
"And that question no longer needed an operator.":
"Y esa pregunta ya no necesitaba una operadora.",
"At the university, the questions asked every pay day came in a 40-page report.":
"En la universidad, las preguntas de cada día de pago llegaban en un reporte de 40 páginas.",
"Any other question waited a week, for a report of its own.":
"Cualquier otra pregunta esperaba una semana por un reporte propio.",
"Now any question is answered when it's asked.":
"Ahora cualquier pregunta se responde cuando se hace.",
"And the questions that come back have a dashboard of their own.":
"Y las preguntas que se repiten tienen su propio tablero.",
"Thursday, 5 November 2026: pay day at the university.":
"Jueves 5 de noviembre de 2026: día de pago en la universidad.",
"Rohan Desai, in Finance, is setting next year's budget for casual teaching in the Faculty of Health.":
"Rohan Desai, de Finanzas, está fijando el presupuesto del año próximo para la docencia ocasional en la Facultad de Salud.",
"Casual teaching is done by staff paid for the hours they work, like Linh Nguyen, who tutors health informatics.":
"La docencia ocasional la da personal que cobra por las horas que trabaja, como Linh Nguyen, tutora de informática de la salud.",
"First he needs one number: what casual teaching has cost Health this semester, so far.":
"Primero necesita un número: cuánto le ha costado la docencia ocasional a Salud este semestre, hasta ahora.",
"That used to take a report from the data team, and a week.":
"Antes eso pedía un reporte del equipo de datos, y una semana.",
"Today he asks Genie One, in his own words.":
"Hoy le pregunta a Genie One, con sus palabras.",
"Like the time in 1936, the answer comes when he asks: A$1.84 million, so far.":
"Como la hora en 1936, la respuesta llega cuando pregunta: A$1.84 millones, hasta ahora.",
"With it, Genie says what it counted: the claims approved for casual teaching, plus on-costs.":
"Con ella, Genie dice qué contó: las declaraciones de horas aprobadas de docencia ocasional, más las cargas sociales.",
"On-costs are what the university pays on top of pay.":
"Las cargas sociales son lo que la universidad paga además del sueldo.",
"And it shows the query it ran, so anyone can check it.":
"Y muestra la consulta que corrió, para que cualquiera la revise.",
"His next question: and Semester 1?":
"Su siguiente pregunta: ¿y el semestre 1?",
"A$2.21 million, with every claim in.":
"A$2.21 millones, con todo ya declarado.",
"By lunch, Health's casual teaching budget is set, from this year's numbers.":
"Antes del almuerzo, el presupuesto de Salud queda fijado, con las cifras de este año.",
"Genie One answered from a Genie Agent, which Sam and Jun, in the data team, set up for this one subject.":
"Genie One respondió desde un Genie Agent, que Sam y Jun, del equipo de datos, configuraron para este único tema.",
"Two earlier films show how one is built.":
"Dos películas anteriores muestran cómo se arma uno.",
"Here is what the team put in it.":
"Esto es lo que el equipo puso en él.",
"Its data: one measure, casual teaching cost, by faculty, unit and teaching period.":
"Sus datos: una medida, el costo de la docencia ocasional, por facultad, asignatura y período lectivo.",
"Rohan defined it once, in September, as the next film shows.":
"Rohan la definió una vez, en septiembre, como muestra la próxima película.",
"Its rules, in their owners' words.":
"Sus reglas, con las palabras de sus dueños.",
"Rohan's: what cost means, and what this semester means.":
"Las de Rohan: qué significa costo, y qué significa este semestre.",
"Ingrid's, in HR: totals only, never one person's pay.":
"La de Ingrid, de RR. HH.: solo totales, nunca el sueldo de alguien.",
"So it reads the measure, never anyone's claims.":
"Así que lee la medida, nunca las declaraciones de nadie.",
"Its examples: questions Finance asks, each with the query that answers it.":
"Sus ejemplos: preguntas que hace Finanzas, cada una con la consulta que la responde.",
"And its tests: questions with known answers, run after every change.":
"Y sus pruebas: preguntas con respuestas conocidas, que se corren tras cada cambio.",
"Each answer runs as the person asking, so they see only what they may read.":
"Cada respuesta se ejecuta como la persona que pregunta, así que ve solo lo que puede leer.",
"So the data team's work has moved.":
"Así se movió el trabajo del equipo de datos.",
"Not a report for each question, but good models and their context, built once, for people and agents to explore.":
"No un reporte para cada pregunta, sino buenos modelos y su contexto, construidos una vez, para que personas y agentes los exploren.",
"They started small, and Rohan, who knows the subject best, was its first user.":
"Empezaron con poco, y Rohan, quien mejor conoce el tema, fue su primer usuario.",
"Some questions come back every pay day, from the same people.":
"Algunas preguntas vuelven cada día de pago, de las mismas personas.",
"What did the pay run cost?":
"¿Cuánto costó la nómina?",
"How many casual hours, in each faculty?":
"¿Cuántas horas ocasionales, en cada facultad?",
"How many claims still wait for approval?":
"¿Cuántas declaraciones esperan todavía aprobación?",
"Like the time in 1936, they get a machine of their own: one dashboard, read at a glance.":
"Como la hora en 1936, reciben una máquina propia: un tablero, que se lee de un vistazo.",
"It refreshes after each pay run, and goes to the people who act on it.":
"Se actualiza tras cada nómina, y llega a las personas que actúan con él.",
"Today: A$9.6 million, paid to 2,960 people.":
"Hoy: A$9.6 millones, pagados a 2,960 personas.",
"And 143 claims still waiting, for the next pay run.":
"Y 143 declaraciones siguen esperando, para la próxima nómina.",
"For a question it doesn't show, its Ask Genie button opens the same Genie Agent.":
"Para una pregunta que no muestra, su botón Ask Genie abre el mismo Genie Agent.",
"It replaced a 40-page report, emailed every pay day.":
"Reemplazó un reporte de 40 páginas, por correo cada día de pago.",
"The three figures people read were on its first page.":
"Las tres cifras que la gente leía estaban en su primera página.",
"Now it's retired.":
"Ahora está retirado.",
"A rule of thumb: a question deserves a dashboard when it comes back on a schedule, and someone acts on what it shows.":
"Una regla práctica: una pregunta merece un tablero cuando vuelve con un calendario fijo, y alguien actúa según lo que muestra.",
"Every other question is asked when it's needed.":
"Cualquier otra pregunta se hace cuando se necesita.",
"In 1936, the question everyone asked got a machine of its own, and anyone could ask it, at any hour.":
"En 1936, la pregunta que todos hacían tuvo una máquina propia, y cualquiera podía hacerla, a cualquier hora.",
"At the university, the questions that come back have one dashboard.":
"En la universidad, las preguntas que se repiten tienen un tablero.",
"Every other question is answered when it's asked, from good models and their context, built once.":
"Cualquier otra pregunta se responde cuando se hace, desde buenos modelos y su contexto, construidos una vez.",
"And Health's casual teaching budget was set from this year's numbers, in a morning, not a week.":
"Y el presupuesto de docencia ocasional de Salud se fijó con las cifras de este año, en una mañana, no en una semana.",
"None of these ideas is new; the tools now make them easier.":
"Ninguna de estas ideas es nueva; las herramientas ahora las hacen más fáciles.",
"So don't reinvent the wheel: investigate, adapt, implement and iterate, starting from the official docs, linked on this page.":
"Así que no reinventes la rueda: investiga, adapta, implementa e itera, empezando por la documentación oficial, enlazada en esta página.",
"Ask for the answer; keep dashboards for the questions that come back.":
"Pide la respuesta; deja los tableros para las preguntas que se repiten.",
"Next: casual teaching cost, defined in the open, so every reader counts it the same way.":
"Después: el costo de la docencia ocasional, definido en formato abierto, para que todos lo cuenten igual."
});
