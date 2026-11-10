/* A person asks: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: la oficina de privacidad, la petición (a request) y su plazo, el ticket, la tabla de claves, el registro maestro, el linaje,
   las etiquetas, un trabajo (a job) con su propia identidad, los marts, la lista de correo de tutores, la reconstrucción (the rebuild), las versiones antiguas, el historial
   de la tabla, el registro de auditoría, RR. HH., el dueño and la dueña, los expedientes; the films and series by their Spanish titles (Conoce lo que guardas, Una razón para
   guardarlo, Borrado es borrado, Cerraduras antes que los datos, Solo lo que puedes ver, Agentes de IA en el trabajo con datos). In 1676: el carcelero (the keeper), la orden
   de prisión (the warrant), una fianza (bail), el habeas corpus, which keeps its Latin name, as the voice says it; the Habeas Corpus Act as la Ley de Habeas Corpus. Numbers and
   dates keep the picture's figures (2026-117, P-10482), so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"London, June 1676.":
"Londres, junio de 1676.",
"Francis Jenkes, a linen draper, sits on the City's council.":
"Francis Jenkes, lencero, forma parte del consejo de la City.",
"At the Guildhall, he stands up and asks for a new Parliament, to mend the City's trade.":
"En el Guildhall, se pone de pie y pide un nuevo Parlamento, para reparar el comercio de la City.",
"Four days later, the King's Council sends him to the Gatehouse, a prison at Westminster, to be kept there until the law sets him free.":
"Cuatro días después, el Consejo del Rey lo envía al Gatehouse, una prisión en Westminster, a quedarse ahí hasta que la ley lo libere.",
"It names no day.":
"No fija ningún día.",
"He asks the keeper for a copy of the warrant, the order that holds him.":
"Le pide al carcelero una copia de la orden de prisión, la orden que lo retiene.",
"The keeper promises it, and stalls.":
"El carcelero se la promete, y da largas.",
"His friends offer bail, a pledge of money, so he can wait for his trial at home.":
"Sus amigos ofrecen una fianza, una garantía en dinero, para que espere su juicio en casa.",
"Refused.":
"Rechazada.",
"They ask a judge for habeas corpus.":
"Piden a un juez un habeas corpus.",
"It's Latin for \"have the body\": an order to bring the prisoner before a judge, and say why he's held.":
"Es latín, \"que tengas el cuerpo\": una orden de llevar al preso ante un juez, y decir por qué lo retienen.",
"The judge refuses, for one reason only: the courts are on their summer holiday.":
"El juez se niega, por una sola razón: los tribunales están de vacaciones de verano.",
"In August, Jenkes is still inside, writing of his great loss, and the harm to his health.":
"En agosto, Jenkes sigue preso, y escribe sobre su gran pérdida, y el daño a su salud.",
"Without that order, a person could be held for months, with no judge to hear why.":
"Sin esa orden, alguien podía pasar meses preso, sin un juez que oyera por qué.",
"Something had to change.":
"Algo tenía que cambiar.",
"In 1679, Parliament passes the Habeas Corpus Act.":
"En 1679, el Parlamento aprueba la Ley de Habeas Corpus.",
"Once the order is served, the keeper has three days to bring the prisoner before a judge, and certify the true causes of holding him.":
"Entregada la orden, el carcelero tiene tres días para llevar al preso ante un juez, y certificar las causas verdaderas de su prisión.",
"Ten days if the prison is more than twenty miles away, twenty if it's more than a hundred.":
"Diez días si la prisión está a más de veinte millas, veinte si está a más de cien.",
"The courts' holiday is no excuse: any judge must grant the order.":
"Las vacaciones no son excusa: cualquier juez debe dar la orden.",
"A copy of the warrant, within six hours of asking.":
"Una copia de la orden, en menos de seis horas.",
"And a keeper who stalls pays the prisoner a hundred pounds.":
"Y el carcelero que da largas le paga al preso cien libras.",
"The second time, two hundred, and he loses his post.":
"La segunda vez, doscientas, y pierde su puesto.",
"So a prisoner learns why he's held within hours, and stands before a judge within days, not a summer.":
"Así, un preso sabe en horas por qué lo retienen, y está ante un juez en días, no en un verano.",
"A century later, the United States writes the writ into its Constitution.":
"Un siglo después, Estados Unidos escribe el habeas corpus en su Constitución.",
"Today, a person can ask a university too: what do you hold about me, and why?":
"Hoy, una persona también puede preguntarle a una universidad: ¿qué guardas sobre mí, y por qué?",
"Left in an inbox, a request waits, and nobody can show what was searched.":
"En un buzón, una petición espera, y nadie puede mostrar dónde se buscó.",
"Given a clock, the true reasons and proof, it's answered on time, and the answer can be trusted.":
"Con un plazo, las razones verdaderas y pruebas, se responde a tiempo, y la respuesta es de fiar.",
"On 24 November, Linh Nguyen writes to the university.":
"El 24 de noviembre, Linh Nguyen le escribe a la universidad.",
"Her tutoring contract ended four days ago.":
"Su contrato de tutora terminó hace cuatro días.",
"She's signed in with her student account, on the privacy office's form, so the office knows it's her, and asks for nothing more.":
"Entró con su cuenta de estudiante, en el formulario de la oficina de privacidad, así que la oficina sabe que es ella, y no pide nada más.",
"\"Please tell me what you hold about me, and take me off the tutors' mailing list.\"":
"\"Por favor, díganme qué guardan sobre mí, y sáquenme de la lista de correo de tutores.\"",
"The privacy office logs it: request 2026-117.":
"La oficina de privacidad la registra: petición 2026-117.",
"Like the writ, it has a clock: thirty days, so it's due on 24 December.":
"Como el habeas corpus, tiene un plazo: treinta días, así que vence el 24 de diciembre.",
"Ingrid Holm, who owns HR's data, takes HR's part.":
"Ingrid Holm, dueña de los datos de RR. HH., toma esa parte.",
"The data team gets a ticket in its repository.":
"El equipo de datos recibe un ticket en su repositorio.",
"It names no one: just the request's number, the date it's due, and the steps.":
"No nombra a nadie: solo el número de la petición, su fecha límite y los pasos.",
"Her numbers go in one place: a table on the platform that only the privacy office and its jobs may read.":
"Sus números van a un solo lugar: una tabla en la plataforma que solo la oficina de privacidad y sus trabajos pueden leer.",
"Mei's office keeps Linh's master record, P-10482.":
"La oficina de Mei guarda el registro maestro de Linh, P-10482.",
"From its links come her numbers in every system: six in all.":
"De sus vínculos salen sus números en cada sistema: seis en total.",
"In the data project, dbt lists every model built from those five systems: more than thirty.":
"En el proyecto de datos, dbt lista cada modelo hecho a partir de esos cinco sistemas: más de treinta.",
"On the platform, lineage adds the rest: a notebook's table, a dashboard, another team's job.":
"En la plataforma, el linaje agrega el resto: la tabla de un notebook, un panel, el trabajo de otro equipo.",
"And the tags from Know what you hold point to each column that names a person, or holds a code for one.":
"Y las etiquetas de Conoce lo que guardas señalan cada columna que nombra a una persona, o guarda un código de una.",
"Then a job runs, as its own identity.":
"Luego corre un trabajo, con identidad propia.",
"Table by table, it looks in those columns, for her numbers, and for the codes made from them.":
"Tabla por tabla, busca en esas columnas sus números, y los códigos hechos con ellos.",
"In the marts built for the wallet, planning and finance, she's there only as a code.":
"En los marts de la billetera, la planificación y las finanzas, ella está solo como un código.",
"A search for her numbers alone would miss them all.":
"Una búsqueda solo por sus números los pasaría todos por alto.",
"And none of her numbers is typed into a query, whose text the platform keeps for a year.":
"Y ninguno de sus números se escribe en una consulta, cuyo texto la plataforma guarda un año.",
"Instead, each query joins the table of keys, by the request's number.":
"En cambio, cada consulta se une a la tabla de claves, por el número de la petición.",
"Lineage only sees the platform, so the owners of payroll, the claims app, the mailing tool and her signed contracts search their own.":
"El linaje solo ve la plataforma: los dueños de la nómina, la app de horas, la herramienta de correo y sus contratos buscan en lo suyo.",
"What Linh gets back isn't a pile of tables.":
"Lo que Linh recibe no es un montón de tablas.",
"It's a copy of what's held, written for her to read.":
"Es una copia de lo que se guarda, escrita para que ella la lea.",
"For each part: what it is, why it's held, where it came from, who else gets it, and until when.":
"Para cada parte: qué es, por qué se guarda, de dónde vino, quién más la recibe, y hasta cuándo.",
"Like the true causes on the keeper's answer, each reason is a plain one, from A reason to keep it.":
"Como las causas verdaderas en la respuesta del carcelero, cada razón es simple, de Una razón para guardarlo.",
"A contract, for her contracts and hours.":
"Un contrato, para sus contratos y horas.",
"A law, for her pay records: seven years after each contract, the last until 20 November 2033.":
"Una ley, para sus registros de pago: siete años después de cada contrato, el último hasta el 20 de noviembre de 2033.",
"A public task, for her degrees and results, kept for good.":
"Una tarea pública, para sus títulos y resultados, guardados para siempre.",
"Her research project's data, as long as its rules require.":
"Los datos de su proyecto de investigación, mientras lo pidan sus reglas.",
"Anything about other people is left out, such as the marks she gave her students.":
"Todo lo que trata de otras personas queda fuera, como las notas que puso a sus estudiantes.",
"On 3 December, each owner checks their part: Ingrid for HR, Mei for the registrar's records, the research office for her project.":
"El 3 de diciembre, cada dueño revisa su parte: Ingrid, la de RR. HH.; Mei, los expedientes; la oficina de investigación, su proyecto.",
"Her second ask was done first.":
"Su segundo pedido se hizo primero.",
"In the night of 25 November, the deletion job takes her row out of the list's table, and out of its log of what was sent.":
"En la noche del 25 de noviembre, el trabajo de borrado saca su fila de la tabla de la lista, y de su registro de envíos.",
"The mailing tool drops her at its next sync.":
"La herramienta de correo la quita al sincronizar.",
"That morning, Ingrid puts her no on the person, in place of the yes she gave in 2023.":
"Esa mañana, Ingrid pone su no en la persona, en lugar del sí que dio en 2023.",
"The list is rebuilt each semester from HR's casual contracts of the last two years, and takes only those whose yes is on the person.":
"La lista se rehace cada semestre con los contratos ocasionales de los últimos dos años, y toma solo a quienes tienen un sí en la persona.",
"So the next rebuild leaves her out.":
"Así, la próxima reconstrucción la deja fuera.",
"The table's old versions hold her row for seven days more, then they're cleaned up, on 2 December, as Deleted means deleted showed.":
"Las versiones antiguas de la tabla guardan su fila siete días más, y luego se limpian, el 2 de diciembre, como mostró Borrado es borrado.",
"Deleting her row alone wouldn't have been enough: with her yes still there, the next rebuild would have brought her back.":
"Borrar solo su fila no habría bastado: con su sí todavía ahí, la próxima reconstrucción la habría traído de vuelta.",
"Every step leaves proof.":
"Cada paso deja una prueba.",
"In the ticket, each box is ticked with a link.":
"En el ticket, cada casilla se marca con un enlace.",
"The search's run shows who ran it: the job, as itself.":
"La ejecución de la búsqueda muestra quién la hizo: el trabajo mismo.",
"The list table's history shows her row deleted, and the old versions cleaned up.":
"El historial de la tabla de la lista muestra su fila borrada, y las versiones antiguas limpiadas.",
"The audit log shows who read the table of keys: only the office and its jobs.":
"El registro de auditoría muestra quién leyó la tabla de claves: solo la oficina y sus trabajos.",
"The privacy office keeps a table of every request and the day it's due.":
"La oficina de privacidad lleva una tabla de cada petición y el día en que vence.",
"A request near its date shows up there, for the office to work through.":
"Una petición cerca de su fecha aparece ahí, para que la oficina la atienda.",
"A late answer isn't wrong data: it's work still to do.":
"Una respuesta atrasada no son datos erróneos: es trabajo pendiente.",
"On 7 December, Linh's answer is ready, seventeen days early, and she opens it by signing in.":
"El 7 de diciembre, la respuesta de Linh está lista, diecisiete días antes, y ella la abre al iniciar sesión.",
"The ticket closes. Her numbers stay in the table of keys until the last locked copy is gone, on 24 December.":
"El ticket se cierra. Sus números siguen en la tabla de claves hasta que no quede ninguna copia bloqueada, el 24 de diciembre.",
"In 1679, a keeper answered the writ with the body, and the true causes, within days.":
"En 1679, un carcelero respondía al habeas corpus con el cuerpo, y las causas verdaderas, en días.",
"Here, it's what's held, the true reasons, on time, and proof of each step.":
"Aquí, es lo que se guarda, las razones verdaderas, a tiempo, y la prueba de cada paso.",
"Five films, one person's data.":
"Cinco películas, los datos de una persona.",
"Keep data for a reason you can say.":
"Guarda los datos por una razón que puedas decir.",
"Every record has an end date, decided before it's needed.":
"Cada registro tiene una fecha de fin, decidida antes de necesitarla.",
"A person can ask, and you must be able to answer.":
"Una persona puede preguntar, y tú debes poder responder.",
"Deleting is done when the last copy is gone.":
"Borrar termina cuando ya no queda la última copia.",
"And a request is answered on time, with proof.":
"Y una petición se responde a tiempo, con pruebas.",
"With Locks before the data and Only what you may see, that's data protection and privacy.":
"Con Cerraduras antes que los datos y Solo lo que puedes ver, eso es protección de datos y privacidad.",
"Who may come in, what each may see, and how long anything stays.":
"Quién puede entrar, qué puede ver cada uno, y cuánto tiempo se queda cada cosa.",
"Next: AI agents in data work, where agents work under the same rules.":
"Después: Agentes de IA en el trabajo con datos, con las mismas reglas."
});
