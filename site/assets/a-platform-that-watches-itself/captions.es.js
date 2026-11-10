/* A platform that watches itself: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's pages: el personal ocasional for casual staff, la docencia ocasional, el costo de la docencia ocasional for casual teaching cost, nómina, Finanzas,
   RR. HH., la tarea for a job (la tarea de horas for the claims job), el arreglo for a fix, el día de pago, el sistema de nómina, la exportación de nómina, el linaje,
   la solicitud de cambio for a pull request, la rama, las pruebas, el dueño, producción; the tools keep their names (Genie ZeroOps), and so do the times as the screen shows them.
   In 1969: el módulo lunar, la computadora (Latin American), Houston, el oficial de guiado, abortar, alunizar; "go" as adelante. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"The twentieth of July, 1969.":
"El 20 de julio de 1969.",
"Neil Armstrong and Buzz Aldrin are flying their lunar module down to the Moon, its computer steering.":
"Neil Armstrong y Buzz Aldrin bajan a la Luna en su módulo lunar, guiado por su computadora.",
"Five minutes in, a light comes on, with a code: 1202.":
"A los cinco minutos se enciende una luz, con un código: 1202.",
"The computer has more work than time.":
"La computadora tiene más trabajo que tiempo.",
"The crew don't know the code, and ask Houston.":
"La tripulación no sabe el código, y pregunta a Houston.",
"If the computer stopped, nothing would steer them; if Houston called an abort, they'd turn back without landing.":
"Si la computadora se detenía, nada los guiaría; si Houston ordenaba abortar, volverían sin alunizar.",
"Someone had to decide, in seconds.":
"Alguien tenía que decidir, en segundos.",
"The computer's makers, at MIT, had built it to watch itself:":
"Sus creadores, en el MIT, la habían hecho para vigilarse a sí misma:",
"with too much to do, it starts again, keeps the steering and its most important work, and drops the rest.":
"con demasiado trabajo, se reinicia, conserva la guía y su trabajo más importante, y deja el resto.",
"And it raises the alarm, so people can decide.":
"Y da la alarma, para que decidan las personas.",
"In Houston, the guidance officer, Steve Bales, twenty-six, had just helped review its alarms:":
"En Houston, el oficial de guiado, Steve Bales, de veintiséis años, acababa de revisar sus alarmas:",
"1202 meant go on, unless it came too often or the descent went off course.":
"1202 significaba seguir, salvo que se repitiera demasiado o el descenso se desviara.",
"Half a minute after the alarm, the word goes up: go.":
"Medio minuto después de la alarma, sube la palabra: adelante.",
"Four more alarms come; each time, go.":
"Llegan cuatro alarmas más; cada vez, adelante.",
"And Eagle lands.":
"Y el Eagle aluniza.",
"The computer watched itself and said what was wrong, and people who knew decided.":
"La computadora se vigiló y dijo qué fallaba, y decidieron personas que sabían.",
"This November, a job that pays the university's casual staff fails one night.":
"Este noviembre, una noche, falla una tarea que paga al personal ocasional de la universidad.",
"By morning, the platform has found why and proposed a fix, and a person decides.":
"Al amanecer, la plataforma ya encontró la causa y propuso un arreglo, y decide una persona.",
"At the university, casual staff, paid by the hour, claim the hours they teach in an app.":
"En la universidad, el personal ocasional, pagado por hora, declara en una app las horas que enseña.",
"On the Monday before each pay day, at ten at night, the claims job builds the hours to pay, and sends them to the payroll system.":
"El lunes antes de cada día de pago, a las diez de la noche, la tarea de horas arma las horas a pagar y las envía a nómina.",
"On Monday the second of November, at 3:02 in the afternoon, a new version of the app goes live.":
"El lunes 2 de noviembre, a las 15:02, entra en producción una nueva versión de la app.",
"Tutors can now type their hours as they say them: 1:30 for an hour and a half, where it sent 1.50.":
"Ahora los tutores escriben sus horas como las dicen: 1:30 por una hora y media, donde enviaba 1.50.",
"Its contract still says decimal hours.":
"Su contrato aún dice horas decimales.",
"At 22:03, the job fails: it can't read 1:30 as a number.":
"A las 22:03, la tarea falla: no puede leer 1:30 como un número.",
"Nothing wrong reaches payroll: the job stops, and the hours wait.":
"Nada erróneo llega a nómina: la tarea se detiene, y las horas esperan.",
"Payroll needs them by noon on Tuesday, to pay 856 casual staff on Thursday.":
"Nómina las necesita el martes a mediodía, para pagarle el jueves a 856 personas.",
"But the platform is watching.":
"Pero la plataforma está vigilando.",
"Sam, who runs the platform, has Genie ZeroOps watching the pay run's jobs and tables:":
"Sam, que opera la plataforma, tiene a Genie ZeroOps vigilando las tareas y tablas del pago:",
"an agent that works in the background, with nobody asking.":
"un agente que trabaja en segundo plano, sin que nadie se lo pida.",
"It finds the failure, at 22:03.":
"Encuentra el fallo, a las 22:03.",
"It traces the cause through lineage, to the claims app's table, where the hours changed form at 3:02.":
"Sigue la causa por el linaje hasta la tabla de la app, donde las horas cambiaron de forma a las 15:02.",
"It says what the failure touches: the hours for the payroll system, payroll's export, and casual teaching cost.":
"Dice qué toca el fallo: las horas para el sistema de nómina, la exportación de nómina y el costo de la docencia ocasional.",
"And it proposes a fix: read 1:30 as one and a half.":
"Y propone un arreglo: leer 1:30 como una hora y media.",
"By morning, it's one insight in Sam's inbox, and nothing in production has changed.":
"Al amanecer, es un hallazgo en la bandeja de Sam, y nada ha cambiado en producción.",
"It can trace only what the platform knows, so keep the lineage, and who owns what.":
"Solo puede seguir lo que la plataforma sabe: mantén el linaje, y quién es dueño de qué.",
"Tuesday, half past eight.":
"Martes, ocho y media.",
"Sam checks the cause against the claims, and asks the agent to push its fix to a new branch.":
"Sam contrasta la causa con las horas declaradas, y le pide al agente subir su arreglo a una rama nueva.",
"It pushes only when a person asks, and confirms.":
"Solo lo sube si una persona lo pide, y lo confirma.",
"Sam opens a pull request, and its tests run, as they do for every change.":
"Sam abre una solicitud de cambio, y corren sus pruebas, como en todo cambio.",
"Then someone who didn't write it approves: Noor, at 9:05.":
"Luego la aprueba alguien que no la escribió: Noor, a las 9:05.",
"An agent never approves.":
"Un agente nunca aprueba.",
"At 9:20, the job runs again, and payroll has the hours by ten.":
"A las 9:20 la tarea corre de nuevo, y nómina tiene las horas antes de las diez.",
"On Thursday, 856 casual staff are paid, Linh Nguyen among them.":
"El jueves cobran 856 personas del personal ocasional, Linh Nguyen entre ellas.",
"The platform proposes; a person approves.":
"La plataforma propone; una persona aprueba.",
"The fix mended the night, not its cause.":
"El arreglo resolvió la noche, no su causa.",
"The app's change was a good one, for tutors; what was missing was a step.":
"El cambio de la app era bueno para los tutores; lo que faltó fue un paso.",
"So Sam's pull request also asks Ingrid Holm, in HR, who owns the claims' data, to change the contract first, next time.":
"Así que la solicitud de Sam también le pide a Ingrid Holm, de RR. HH., dueña de esos datos, cambiar primero el contrato.",
"Then everyone who reads the hours knows, before the app changes.":
"Así, quienes leen las horas lo saben antes de que cambie la app.",
"On Apollo 11, the cause took a night to find:":
"En el Apolo 11, encontrar la causa llevó una noche:",
"a document between two systems had said too little, so a radar's electronics took about 13% of the computer's time.":
"un documento entre dos sistemas decía muy poco, y la electrónica de un radar le quitó a la computadora un 13% de su tiempo.",
"For the next missions, the checklist changed, and the software learned to check.":
"Para las misiones siguientes cambió la lista de verificación, y el software aprendió a comprobarlo.",
"Watching systems isn't new: site reliability engineers have done it for years, with alerts, people on call and blameless reviews.":
"Vigilar sistemas no es nuevo: los ingenieros de confiabilidad lo hacen hace años, con alertas, guardias y revisiones sin culpables.",
"What's new is that the platform does the first hours of the work, overnight.":
"Lo nuevo es que la plataforma hace las primeras horas del trabajo, de noche.",
"Choose what it watches, keep the lineage and the owners it reads, and decide who reviews and who approves.":
"Elige qué vigila, mantén el linaje y los dueños que lee, y decide quién revisa y quién aprueba.",
"There are already standards, so don't reinvent the wheel:":
"Ya hay estándares, así que no reinventes la rueda:",
"investigate, adapt, implement, iterate, starting from the official docs.":
"investiga, adapta, implementa, itera, empezando por la documentación oficial."
});
