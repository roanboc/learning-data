/* Hot, warm, cold: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   Words as in the module's pages: el personal ocasional for casual staff, la app de horas for the claims app, declarar for to claim, nómina, Finanzas, RR. HH., el día de pago,
   calientes, tibios y fríos for hot, warm and cold, la vista for the view, el pipeline, el camino frío for the cold path; Aquisgrán and Bruselas for Aachen and Brussels.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"April 1850. In Aachen, on Prussia's western border, Paul Julius Reuter sells the news of Europe's stock exchanges.":
"Abril de 1850. En Aquisgrán, en la frontera oeste de Prusia, Paul Julius Reuter vende las noticias de las bolsas de Europa.",
"A telegraph line runs from Berlin to Aachen. Another runs from Paris to Brussels.":
"Una línea de telégrafo va de Berlín a Aquisgrán. Otra va de París a Bruselas.",
"Between Aachen and Brussels, 122 kilometres with no wire.":
"Entre Aquisgrán y Bruselas, 122 kilómetros sin cable.",
"Bankers and merchants buy and sell on the prices from other cities' exchanges, and they act the same day.":
"Banqueros y comerciantes compran y venden según los precios de las bolsas de otras ciudades, y actúan el mismo día.",
"Across the gap, the prices went by train, and arrived hours after the day's trading had begun.":
"En ese tramo, los precios iban en tren, y llegaban horas después de empezar las operaciones del día.",
"A price that comes after you've had to decide is no use to you: someone else, with fresher news, has made the deal.":
"Un precio que llega después de que tuviste que decidir no te sirve: otro, con noticias más frescas, ya cerró el trato.",
"Reuter's clients didn't need the prices at once. They needed them before they acted, so the news had to cross the gap faster.":
"Los clientes de Reuter no necesitaban los precios al instante, sino antes de actuar, así que las noticias debían cruzar más rápido.",
"So Reuter and Heinrich Geller, an innkeeper in Aachen who bred pigeons, flew the prices across the gap.":
"Así que Reuter y Heinrich Geller, un posadero de Aquisgrán que criaba palomas, mandaron los precios volando.",
"Each bird carried a thin slip of paper, from Brussels to Aachen, and the telegraph sent it on to Berlin.":
"Cada ave llevaba una tira fina de papel, de Bruselas a Aquisgrán, y el telégrafo la enviaba a Berlín.",
"The birds crossed in about two hours, six hours ahead of the train, so the prices arrived while there was still time to use them.":
"Las aves cruzaban en unas dos horas, seis horas antes que el tren, así que los precios llegaban cuando aún servían.",
"And it was only for a while: the pigeons filled the gap until the wire was joined.":
"Y fue solo por un tiempo: las palomas cubrieron el tramo hasta que se unió el cable.",
"Fresh enough means there in time for whoever acts on it.":
"Bastante fresco quiere decir a tiempo para quien actúa con ello.",
"Until September, the university moved almost all its data once a night. And asked, everyone wanted theirs live.":
"Hasta septiembre, la universidad movía casi todos sus datos una vez por noche. Y, al preguntarles, todos los querían en vivo.",
"Some came too late: 23 tutors were paid two weeks late, and two people's pay went to a thief.":
"Algunos llegaban tarde: 23 tutores cobraron dos semanas tarde, y el pago de dos personas fue a un ladrón.",
"Now each kind of data arrives in time for the action it serves, and no sooner than it's needed.":
"Ahora cada tipo de dato llega a tiempo para la acción que sirve, y no antes de lo necesario.",
"In September, Noor, the data architect, asked one question of each kind of data: when does someone act on it?":
"En septiembre, Noor, la arquitecta de datos, hizo una pregunta sobre cada tipo de dato: ¿cuándo actúa alguien con él?",
"Ask people if they'd like their data fresher, and they'll always say yes.":
"Pregunta a la gente si quiere sus datos más frescos, y siempre dirá que sí.",
"So Noor didn't take the answer from a question. She looked at real use: when people open the data, and what they do next.":
"Así que Noor no tomó la respuesta de una pregunta. Miró el uso real: cuándo abren los datos, y qué hacen después.",
"Acted on days or weeks later: cold. A batch, once a night or once a week.":
"Si se actúa días o semanas después: frío. Un lote, una vez por noche o por semana.",
"Acted on within minutes or hours: warm. Small batches, every few minutes or every hour.":
"Si se actúa en minutos u horas: tibio. Lotes pequeños, cada pocos minutos o cada hora.",
"Acted on within a second or less, usually by a machine: hot. Each event, the moment it happens.":
"Si se actúa en un segundo o menos, casi siempre una máquina: caliente. Cada evento, en cuanto ocurre.",
"The platform should offer all three. Which one each kind of data gets is the business's call, not the platform's.":
"La plataforma debe ofrecer las tres. Cuál recibe cada tipo de dato lo decide el negocio, no la plataforma.",
"Each answer goes into the data's contract: how fresh, and the action it's fresh for.":
"Cada respuesta queda en el contrato de los datos: cuán frescos, y para qué acción.",
"Each morning, Rohan, in Finance, and the faculties' managers look at what each faculty has spent this year against its budget.":
"Cada mañana, Rohan, de Finanzas, y los gerentes de las facultades miran lo que cada facultad gastó este año frente a su presupuesto.",
"Asked in August, Finance wanted it live, to the minute.":
"Al preguntarle en agosto, Finanzas lo quería en vivo, al minuto.",
"Noor looked at what happens next: spending is talked over once a month, and only then does money move between budgets.":
"Noor miró qué pasa después: el gasto se revisa una vez al mes, y solo entonces se mueve dinero entre presupuestos.",
"Yesterday's figures are fresh enough. A view works them out each night at two, ready to read by seven.":
"Las cifras de ayer bastan. Una vista las calcula cada noche a las dos, listas para leer a las siete.",
"It's a dbt model Jun wrote, with its schedule, tested like any other.":
"Es un modelo de dbt que escribió Jun, con su horario, probado como cualquier otro.",
"Most analysis is like this, and should stay cold: people decide over days and weeks, and a nightly run costs a small part of a stream.":
"Casi todo el análisis es así, y debe seguir frío: se decide en días y semanas, y una corrida nocturna cuesta una parte pequeña de un stream.",
"Casual staff claim their hours in the claims app, and claims approved by noon on Monday are paid on Thursday.":
"El personal ocasional declara sus horas en la app de horas, y lo aprobado antes del lunes a mediodía se paga el jueves.",
"The app checks each claim against the tutor's contract, which lives in another system: HR's.":
"La app revisa cada declaración contra el contrato del tutor, que está en otro sistema: el de RR. HH.",
"Ingrid's team in HR often changes a contract on a Monday morning, while coordinators approve claims until noon.":
"El equipo de Ingrid en RR. HH. suele cambiar un contrato el lunes en la mañana, mientras los coordinadores aprueban hasta el mediodía.",
"Until September, the platform brought those changes across once a night, so the app saw them on Tuesday.":
"Hasta septiembre, la plataforma traía esos cambios una vez por noche, así que la app los veía el martes.",
"Too late for noon: that's how 23 tutors came to wait two more weeks for their pay.":
"Demasiado tarde para el mediodía: así fue como 23 tutores esperaron dos semanas más para cobrar.",
"Why through the platform at all? Ideally, contracts and claims would live in one system, and the new ERP will bring them together, in 2028.":
"¿Por qué pasar por la plataforma? Lo ideal sería un solo sistema para contratos y declaraciones, y el nuevo ERP los unirá en 2028.",
"Until then, the platform fills the gap, as the pigeons did.":
"Hasta entonces, la plataforma cubre el tramo, como las palomas.",
"Every organisation runs old systems beside new ones, so the ideal path is rare. Working around the gaps is part of the job.":
"Toda organización tiene sistemas viejos junto a nuevos, así que el camino ideal es raro. Sortear los huecos es parte del trabajo.",
"Now the HR system pushes each change as it's made, through Zerobus Ingest.":
"Ahora el sistema de RR. HH. envía cada cambio en cuanto ocurre, con Zerobus Ingest.",
"Every five minutes, a pipeline brings the changes into a table of every contract as it stands.":
"Cada cinco minutos, un pipeline lleva los cambios a una tabla de cada contrato tal como está.",
"This Monday, eleven contracts changed in the morning, and every claim against them was approved by noon.":
"Este lunes, once contratos cambiaron en la mañana, y todo lo declarado contra ellos se aprobó antes del mediodía.",
"Five minutes is fresh enough for a person who approves claims all morning, and it costs far less than a pipeline that never stops.":
"Cinco minutos bastan para quien aprueba declaraciones toda la mañana, y cuesta mucho menos que un pipeline que nunca se detiene.",
"Hot is for when no person is waiting to decide, and the action must come at once, or it's useless.":
"Lo caliente es para cuando ninguna persona espera para decidir, y la acción debe ser inmediata, o no sirve.",
"In August, someone stole two staff members' passwords, and changed their bank accounts the night before pay day.":
"En agosto, alguien robó las contraseñas de dos empleados, y cambió sus cuentas bancarias la noche antes del día de pago.",
"Their pay went to a stranger's account, and they waited three weeks to be paid again.":
"Su pago fue a la cuenta de un extraño, y esperaron tres semanas a que les pagaran de nuevo.",
"No report read the next morning could have stopped it: by then, the money had gone.":
"Ningún reporte leído a la mañana siguiente lo habría impedido: para entonces, el dinero ya no estaba.",
"Now each bank account change is checked the moment it's made, against the sign-in behind it.":
"Ahora cada cambio de cuenta bancaria se revisa en cuanto se hace, contra el inicio de sesión detrás de él.",
"If it comes from a new device close to pay day, a rule holds that one pay within a second, and asks the person to confirm.":
"Si viene de un dispositivo nuevo cerca del día de pago, una regla retiene ese pago en un segundo, y pide a la persona confirmar.",
"Since September, four changes were held. Three were the people themselves, confirmed within the hour; one was not.":
"Desde septiembre, se retuvieron cuatro cambios. Tres eran de las propias personas, confirmados en una hora; uno no.",
"But an event carries only what changed. The full record, and every correction, still comes in the nightly file.":
"Pero un evento lleva solo lo que cambió. El registro completo, y cada corrección, sigue llegando en el archivo nocturno.",
"So hot never comes alone: it needs the cold path beside it, and it costs the most, because it never stops.":
"Así que lo caliente nunca va solo: necesita el camino frío al lado, y es lo más caro, porque nunca se detiene.",
"Very few needs are like this. Keep hot for a machine that must act now.":
"Muy pocas necesidades son así. Deja lo caliente para una máquina que debe actuar ya.",
"In 1851, the wire closed the gap, and the pigeons were no longer needed.":
"En 1851, el cable cerró el tramo, y las palomas ya no hicieron falta.",
"Reuter took his news service to London, and from there to the world.":
"Reuter llevó su servicio de noticias a Londres, y de ahí al mundo.",
"At the university, each kind of data now arrives in time for the people, or the machine, that act on it.":
"En la universidad, cada tipo de dato llega ahora a tiempo para las personas, o la máquina, que actúan con él.",
"Spending, each night; contracts, every five minutes, until the ERP comes; a bank account change, within a second.":
"El gasto, cada noche; los contratos, cada cinco minutos, hasta que llegue el ERP; un cambio de cuenta bancaria, en un segundo.",
"Today, 2,960 people are paid, 856 of them casual staff, Linh among them.":
"Hoy cobran 2,960 personas, 856 de ellas del personal ocasional, entre ellas Linh.",
"How fresh data must be is set by when someone acts on it, not by what the platform can do.":
"Cuán frescos deben estar los datos lo fija cuándo alguien actúa con ellos, no lo que puede hacer la plataforma.",
"Where data is kept, and for how long, is another question, for a later film.":
"Dónde se guardan los datos, y por cuánto tiempo, es otra pregunta, para una película posterior.",
"Start from the official docs, then investigate, adapt, implement, iterate.":
"Empieza por la documentación oficial; luego investiga, adapta, implementa, itera.",
"Next: one copy of the claims, for the app and for Finance.":
"Lo próximo: una copia de las declaraciones, para la app y para Finanzas."
});
