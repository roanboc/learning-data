/* Hot, warm, cold: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   Words as in the module's pages: el personal ocasional for casual staff, la app de horas for the claims app, declarar for to claim, nómina, Finanzas, RR. HH., el día de pago,
   calientes, tibios y fríos for hot, warm and cold, la tabla de streaming, la vista materializada, el nivel de archivo for the archive tier, bancos de germoplasma for gene banks.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"February 2008. Deep in a frozen mountain on Svalbard, Norway's Arctic islands, a vault opens.":
"Febrero de 2008. Dentro de una montaña helada en Svalbard, islas árticas de Noruega, se abre una bóveda.",
"At minus eighteen degrees, it keeps copies of seeds from gene banks around the world.":
"A dieciocho grados bajo cero, guarda copias de semillas de bancos de germoplasma de todo el mundo.",
"Gene banks keep the seeds of crops and their wild relatives, so breeders can grow crops that stand drought and disease.":
"Guardan semillas de cultivos y sus parientes silvestres, para que los fitomejoradores logren cultivos que resistan sequía y enfermedad.",
"Near Aleppo, in Syria, a gene bank keeps 141,052 samples of wheat, barley, lentils and chickpeas, from the world's dry lands.":
"Cerca de Alepo, en Siria, un banco guarda 141,052 muestras de trigo, cebada, lentejas y garbanzos de las tierras secas del mundo.",
"From 2008, it sends copies of most of them to the vault.":
"Desde 2008, envía copias de la mayoría a la bóveda.",
"But a gene bank can be lost, to war, flood or a power cut, and a variety lost is lost for good.":
"Pero un banco puede perderse por guerra, inundación o un apagón, y una variedad perdida se pierde para siempre.",
"In 2012, war came close to Aleppo. Most of the bank's keepers had to leave, and it could no longer send seeds out.":
"En 2012, la guerra llegó cerca de Alepo. Casi todos los custodios del banco tuvieron que irse, y ya no pudo enviar semillas.",
"Breeders could no longer get the seeds they relied on, and every variety in the bank was at risk.":
"Los fitomejoradores ya no recibían las semillas de las que dependían, y cada variedad del banco corría peligro.",
"Something had to change.":
"Algo tenía que cambiar.",
"In 2015, the keepers did what no one had done before: they asked the vault for their copies.":
"En 2015, los custodios hicieron lo que nadie antes: le pidieron a la bóveda sus copias.",
"38,073 samples came out of the mountain, and that November they were sown in Lebanon and Morocco.":
"Salieron de la montaña 38,073 muestras, y ese noviembre se sembraron en el Líbano y en Marruecos.",
"By 2020, nothing was left of the collection in Aleppo.":
"Para 2020, no quedaba nada de la colección en Alepo.",
"Yet no more than 1,657 of its samples were lost, and breeders can order its seeds again.":
"Aun así, se perdieron a lo sumo 1,657 muestras, y los fitomejoradores vuelven a pedir sus semillas.",
"Seeds in use, kept close and ready; their copies, frozen far away, until the day they're needed.":
"Las semillas en uso, cerca y listas; sus copias, congeladas lejos, hasta el día en que se necesiten.",
"Data has a temperature too.":
"Los datos también tienen temperatura.",
"Until September, no one at the university had asked how fresh each kind of data must be, or how often it's read.":
"Hasta septiembre, nadie en la universidad había preguntado qué tan fresco debe estar cada tipo de dato, ni cada cuánto se lee.",
"Some came too slowly, and 23 tutors were paid two weeks late; some cost far more than it needed to.":
"Algunos llegaban muy lento, y 23 tutores cobraron dos semanas tarde; otros costaban mucho más de lo necesario.",
"Now each kind has its own temperature, and no tutor has waited for a contract since.":
"Ahora cada tipo tiene su propia temperatura, y desde entonces ningún tutor ha esperado un contrato.",
"In September, Noor, the data architect, asked each data owner two questions.":
"En septiembre, Noor, la arquitecta de datos, le hizo dos preguntas a cada dueño de datos.",
"How fresh must it be? And how often is it read?":
"¿Qué tan frescos deben estar? ¿Y cada cuánto se leen?",
"Needed within seconds or minutes, and read all the time: hot. Keep it small, and close to where it's used.":
"Se necesitan en segundos o minutos y se leen todo el tiempo: calientes. Que sean pocos y estén cerca de donde se usan.",
"Fresh to the hour or the day, and read often: warm. Work it out on a schedule.":
"Frescos a la hora o al día, y se leen a menudo: tibios. Se calculan en un horario fijo.",
"Rarely read, but kept: cold. Keep it cheap, until the date it may be deleted.":
"Se leen poco, pero se guardan: fríos. Guardarlos barato, hasta la fecha en que pueden borrarse.",
"Each answer goes into the data's contract: how fresh, and how long it's kept.":
"Cada respuesta va al contrato de los datos: qué tan frescos, y cuánto tiempo se guardan.",
"Casual staff claim their hours in the claims app, and claims approved by noon on Monday are paid on Thursday.":
"El personal ocasional declara sus horas en la app de horas, y lo aprobado antes del lunes a mediodía se paga el jueves.",
"The app checks each claim against the tutor's contract, which comes from the HR system.":
"La app revisa cada declaración contra el contrato del tutor, que viene del sistema de RR. HH.",
"Contracts change at short notice, and Ingrid's team in HR often records one on a Monday morning.":
"Los contratos cambian con poco aviso, y el equipo de Ingrid en RR. HH. suele registrar uno un lunes por la mañana.",
"Until September, the platform took in those changes once a night, so the app saw them on Tuesday.":
"Hasta septiembre, la plataforma recibía esos cambios una vez por noche, así que la app los veía el martes.",
"Too late for noon: that's how 23 tutors came to wait two more weeks for their pay.":
"Demasiado tarde para el mediodía: así fue como 23 tutores esperaron dos semanas más para cobrar.",
"Now the HR system pushes each change as it's made, through Zerobus Ingest.":
"Ahora el sistema de RR. HH. envía cada cambio en cuanto ocurre, con Zerobus Ingest.",
"A pipeline takes in each change as it arrives, and keeps a streaming table of every contract as it stands.":
"Un pipeline recibe cada cambio en cuanto llega, y mantiene una tabla de streaming con cada contrato tal como está.",
"The app sees each change within a minute.":
"La app ve cada cambio en menos de un minuto.",
"This Monday, eleven contracts changed in the morning, and every claim against them was approved by noon.":
"Este lunes, once contratos cambiaron en la mañana, y todo lo declarado contra ellos se aprobó antes del mediodía.",
"Hot costs the most, because something is always running: keep hot only what's needed within minutes.":
"Lo caliente es lo más caro, porque siempre hay algo en ejecución: deja caliente solo lo que se necesita en minutos.",
"Each morning, Rohan, in Finance, and the faculties' managers check what each faculty has spent this year against its budget.":
"Cada mañana, Rohan, de Finanzas, y los gerentes de las facultades revisan lo que cada facultad gastó este año contra su presupuesto.",
"Until September, every look read the finance system's ledger in place: slow, and a load on it while Finance worked.":
"Hasta septiembre, cada consulta leía en el sitio el libro mayor del sistema financiero: lento, y una carga mientras Finanzas trabajaba.",
"Yesterday's figures are fresh enough, so now it's a materialized view, worked out each night at two and ready to read.":
"Las cifras de ayer bastan, así que ahora es una vista materializada, calculada cada noche a las dos y lista para leer.",
"It's a dbt model Jun wrote, with its schedule, tested like any other.":
"Es un modelo de dbt que escribió Jun, con su horario, probado como cualquier otro.",
"It keeps only the answer, never a copy of the ledger.":
"Guarda solo la respuesta, nunca una copia del libro mayor.",
"Most of the university's data is warm, and should stay so: few questions need the minute, and hot costs more.":
"La mayoría de los datos de la universidad son tibios, y así deben seguir: pocas preguntas necesitan el minuto, y lo caliente cuesta más.",
"Every pay day, payroll sends the platform a record of each pay, with the hours each casual tutor worked.":
"Cada día de pago, nómina envía a la plataforma un registro de cada pago, con las horas que trabajó cada tutor ocasional.",
"Australian law asks employers to keep pay records for seven years, and after the first, they're rarely read.":
"La ley australiana pide a los empleadores guardar los registros de pago siete años, y después del primero casi no se leen.",
"Until September, every record sat in the costliest storage, and none was ever deleted: a cost, and a risk to everyone in them.":
"Hasta septiembre, cada registro iba al almacenamiento más caro y nunca se borraba: un costo, y un riesgo para todas las personas en él.",
"Now, a year after it's written, each file moves to the cloud's archive tier, its cheapest.":
"Ahora, un año después de escrito, cada archivo pasa al nivel de archivo de la nube, el más barato.",
"Like the copies on Svalbard, they sleep until someone needs them.":
"Como las copias de Svalbard, duermen hasta que alguien las necesita.",
"The table is told, so queries for recent pay still run, and one that needs an archived year says which files to bring back.":
"La tabla lo sabe: las consultas de pagos recientes siguen corriendo, y la que necesita un año archivado dice qué archivos recuperar.",
"Bringing them back takes hours, which is fine for an audit.":
"Recuperarlos toma horas, lo que está bien para una auditoría.",
"When a year's records turn seven, they're deleted, on a date set in advance, and their files removed for good.":
"Cuando los registros de un año cumplen siete, se borran en una fecha fijada de antemano, y sus archivos se eliminan para siempre.",
"In October, the oldest records, more than seven years old, were deleted.":
"En octubre se borraron los registros más antiguos, de más de siete años.",
"How to delete well is for the films on data protection.":
"Cómo borrar bien es tema de las películas sobre protección de datos.",
"One piece of data can cool as it ages.":
"Un mismo dato puede enfriarse con el tiempo.",
"On Monday morning, Linh's claim for last week's tutorials was hot.":
"El lunes temprano, la declaración de Linh de la semana pasada estaba caliente.",
"Payroll's list of claims still waiting read it in place, in the app, until her coordinator approved it.":
"La lista de declaraciones pendientes de nómina la leía en el sitio, en la app, hasta que se aprobó.",
"Paid today, it turns warm: part of what Health has spent, worked out each night.":
"Pagada hoy, se vuelve tibia: parte de lo que gastó Salud, calculado cada noche.",
"A year from now, it turns cold: her hours, in her pay record in the archive, until the seven years are up.":
"Dentro de un año, se volverá fría: sus horas, en su registro de pago en el archivo, hasta que se cumplan los siete años.",
"At each step, where it lives and how it moves follow how it's used.":
"En cada paso, dónde vive y cómo se mueve siguen a cómo se usa.",
"On Svalbard, the vault stays cold and still. In Lebanon and Morocco, the bank sends out its seeds again.":
"En Svalbard, la bóveda sigue fría y quieta. En el Líbano y Marruecos, el banco vuelve a enviar sus semillas.",
"At the university, data is kept the same way: contracts within a minute, spending each night, old pay records cheaply until they're deleted.":
"En la universidad, los datos se guardan igual: contratos en un minuto, gastos cada noche, pagos antiguos baratos hasta que se borran.",
"Today, 2,960 people are paid, 856 of them casual staff, Linh among them.":
"Hoy cobran 2,960 personas, 856 de ellas del personal ocasional, entre ellas Linh.",
"Freshness and reading decide how data moves and where it lives.":
"La frescura y la lectura deciden cómo se mueven los datos y dónde viven.",
"Storage has had tiers for years: there's no wheel to reinvent.":
"El almacenamiento ya tiene niveles hace años: no hay rueda que reinventar.",
"Start from the official docs, then investigate, adapt, implement, iterate.":
"Empieza por la documentación oficial; luego investiga, adapta, implementa, itera.",
"Next: one copy of the claims, for the app and for Finance.":
"Lo próximo: una copia de las declaraciones, para la app y para Finanzas."
});
