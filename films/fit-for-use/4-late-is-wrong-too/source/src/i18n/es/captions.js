/* Late is wrong too: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's pages (films/fit-for-use/series.json) and Good enough for what?'s captions: la lista de graduación, el diploma for a degree certificate, el título for an
   award, el control for a check, la imprenta for the printer, el sistema de estudiantes, el Aula Magna, Planificación, la actualización nocturna for the night's update,
   la frescura (dbt's freshness) and la puntualidad (the dimension, timeliness), as the series' page says. New here: la antigüedad for how old the data is ("la lista
   dice su antigüedad"), el archivo nocturno for the nightly file, atrasado for late, las juntas de examen for the exam boards, el envío for the send, un trabajo for a
   job (as Microsoft Learn's Spanish pages call a Lakeflow job), el registro for a record and la carga for a load; for the opening, Pakistán Oriental and Bangladés (the Real Academia's spelling), la marejada
   ciclónica for the storm surge, la señal de gran peligro, la última milla, la Sociedad de la Cruz Roja de Bangladés and el Programa de Preparación ante Ciclones.
   The films the voice names keep their Spanish titles (Reglas que se ejecutan, Demasiado bueno para ser verdad, Caliente, tibio, frío, Apto para su uso, La calidad
   como hábito). Names on screen stay as they are: EVERY CHECK PASSES, 30 HOURS OLD, student_system_as_of, nightly_files, newest_record_at, and the three dates'
   names (business date, system date, load date). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"November 1970: the coast of East Pakistan, now Bangladesh.":
"Noviembre de 1970: la costa de Pakistán Oriental, hoy Bangladés.",
"Farming and fishing families live on low islands, where great rivers meet the sea.":
"Familias de agricultores y pescadores viven en islas bajas, donde grandes ríos se unen al mar.",
"On the twelfth, a cyclone comes ashore in the evening, with the high tide.":
"El día doce, un ciclón toca tierra al anochecer, con la marea alta.",
"Forecasters warn of danger, and as it nears, the radio broadcasts a great danger signal.":
"Los meteorólogos advierten del peligro y, cuando se acerca, la radio emite una señal de gran peligro.",
"On the islands it means little: survivors said later they took signal number one to be the worst.":
"En las islas significa poco: los sobrevivientes contaron después que creían que la señal número uno era la peor.",
"Most people know a storm is coming, yet almost nobody takes shelter.":
"Casi todos saben que viene una tormenta, pero casi nadie busca refugio.",
"That night a storm surge, the sea driven inland by the wind, sweeps over the islands.":
"Esa noche, una marejada ciclónica, el mar empujado tierra adentro por el viento, barre las islas.",
"At least three hundred thousand people die, perhaps half a million.":
"Mueren al menos trescientas mil personas, quizá medio millón.",
"A warning people can't read, or don't act on, is no warning. The next one has to reach every village in time.":
"Un aviso que la gente no sabe leer, o no sigue, no es un aviso. El próximo tiene que llegar a tiempo a cada aldea.",
"In 1972, the Bangladesh Red Cross Society starts the Cyclone Preparedness Programme, run with the government from 1973.":
"En 1972, la Sociedad de la Cruz Roja de Bangladés inicia el Programa de Preparación ante Ciclones, junto con el gobierno desde 1973.",
"Volunteers from the coast's own villages carry each warning the last mile.":
"Voluntarios de las propias aldeas de la costa llevan cada aviso la última milla.",
"They go house to house with megaphones, and lead people to shelters.":
"Van de casa en casa con megáfonos, y guían a la gente a los refugios.",
"Their flags rise with the danger, one, then two, then three: a signal the whole village can read.":
"Sus banderas suben con el peligro, una, luego dos, luego tres: una señal que toda la aldea puede leer.",
"In November 2007, Cyclone Sidr strikes the same coast, with winds as strong as 1970's, though at low tide.":
"En noviembre de 2007, el ciclón Sidr golpea la misma costa, con vientos tan fuertes como los de 1970, aunque con marea baja.",
"Warnings have gone out for days, and the highest signal has flown since the day before.":
"Los avisos llevan días saliendo, y la señal más alta ondea desde el día anterior.",
"More than 40,000 volunteers carry them, and a million and a half people are in shelters.":
"Más de 40,000 voluntarios los llevan, y un millón y medio de personas están en refugios.",
"About 3,400 die: still too many, and about one for every hundred in 1970.":
"Mueren unas 3,400 personas: todavía demasiadas, y cerca de una por cada cien de 1970.",
"Data has a last mile too.":
"Los datos también tienen una última milla.",
"In June 2026, the night's file doesn't come, and the graduation list is built without it.":
"En junio de 2026, el archivo de la noche no llega, y la lista de graduación se construye sin él.",
"Every check passes. 23 graduates are missing, and nothing says so.":
"Todos los controles pasan. Faltan 23 graduados, y nada lo dice.",
"This time, someone notices in time, and all 23 are on the list.":
"Esta vez, alguien lo nota a tiempo, y los 23 están en la lista.",
"Each night at two, the student system sends its nightly file: the day's names and results, and the awards the exam boards approved.":
"Cada noche a las dos, el sistema de estudiantes envía su archivo: nombres y resultados del día, y los títulos que aprobaron las juntas.",
"At three, the night's update builds the graduation list.":
"A las tres, la actualización nocturna construye la lista de graduación.",
"On Wednesday night, 17 June, the file didn't come: a full disk on the student system's side held it.":
"El miércoles 17 de junio por la noche, el archivo no llegó: un disco lleno del lado del sistema de estudiantes lo retuvo.",
"At three, the list was built from what was there: the file of the night before.":
"A las tres, la lista se construyó con lo que había: el archivo de la noche anterior.",
"689 graduates, and every check green.":
"689 graduados, y todos los controles en verde.",
"Even the check against the boards' own lists passed: they come in the same transfer, so they were a day old too.":
"Hasta el control contra las listas de las juntas pasó: llegan en la misma transferencia, así que también tenían un día.",
"Missing: 23 graduates the boards approved on Wednesday.":
"Faltaban: 23 graduados que las juntas aprobaron el miércoles.",
"Late data looks complete.":
"Los datos atrasados parecen completos.",
"Each check looks at what's there. None can see what hasn't arrived.":
"Cada control mira lo que hay. Ninguno puede ver lo que no ha llegado.",
"Thursday, 8 am. The list is due at the printer at five.":
"Jueves, 8 de la mañana. La lista debe llegar a la imprenta a las cinco.",
"Sam Okafor, who runs the platform, sees in Databricks' monitoring that the student system's tables are late.":
"Sam Okafor, que lleva la plataforma, ve en el monitoreo de Databricks que las tablas del sistema de estudiantes están atrasadas.",
"dbt's freshness check says how late: the student system's data is thirty hours old.":
"El control de frescura de dbt dice cuánto: los datos del sistema de estudiantes tienen treinta horas.",
"There was a level, a warning after a day: set by the builders, agreed with nobody, and never run at night.":
"Había un nivel, un aviso al cabo de un día: puesto por quienes construyen, acordado con nadie, y nunca ejecutado de noche.",
"A level its users never agreed is a signal nobody understands.":
"Un nivel que sus usuarios nunca acordaron es una señal que nadie entiende.",
"Sam calls the student system team, and Malia Fonoti, who sends the list. Malia holds the send.":
"Sam llama al equipo del sistema de estudiantes, y a Malia Fonoti, que envía la lista. Malia detiene el envío.",
"At 11:40 the file arrives; at 12:10 the list is built again, with 712 graduates.":
"A las 11:40 llega el archivo; a las 12:10 la lista se construye de nuevo, con 712 graduados.",
"Malia's team checks the 23 new names, and at 3:20 the list goes.":
"El equipo de Malia revisa los 23 nombres nuevos, y a las 3:20 la lista sale.",
"The December before, six graduates were left off, and nobody saw. Their certificates were printed late, and posted.":
"El diciembre anterior, seis graduados quedaron fuera, y nadie lo vio. Sus diplomas se imprimieron tarde, y se enviaron por correo.",
"On Monday, Malia and Sam meet Mei Tanaka, who owns the list.":
"El lunes, Malia y Sam se reúnen con Mei Tanaka, que está a cargo de la lista.",
"The platform can see that a table is late. Only its users can say when late is too late.":
"La plataforma puede ver que una tabla está atrasada. Solo sus usuarios pueden decir cuándo es demasiado tarde.",
"The certificates can't wait: they need yesterday's awards on the list when it goes to the printer.":
"Los diplomas no pueden esperar: necesitan los títulos de ayer en la lista cuando va a la imprenta.",
"Seating the Great Hall can: it's counted a week before, from a list a few days old.":
"Los asientos del Aula Magna sí: se cuentan una semana antes, con una lista de hace unos días.",
"Planning's count for the government comes after the year's end: weeks are fine.":
"El conteo de Planificación para el gobierno llega después del cierre del año: unas semanas está bien.",
"One list, three clocks. The strictest sets the level: a day old at most, at the send.":
"Una lista, tres relojes. El más estricto fija el nivel: un día como máximo, al enviarla.",
"A nightly file meets it. For fresher data, Hot, warm, cold shows how it moves.":
"Un archivo nocturno lo cumple. Para datos más frescos, Caliente, tibio, frío muestra cómo se mueven.",
"Malia agrees it, Mei owns it, and it goes beside the list's columns, in dbt.":
"Malia lo acuerda, Mei es su responsable, y va junto a las columnas de la lista, en dbt.",
"Rules that run left timeliness in pencil, with no checks. This is its first rule.":
"Reglas que se ejecutan dejó la puntualidad a lápiz, sin controles. Esta es su primera regla.",
"From now on, the list says how old it is.":
"Desde ahora, la lista dice su antigüedad.",
"Old, counted from when? Every record has three dates.":
"¿Antigüedad contada desde cuándo? Cada registro tiene tres fechas.",
"When it happened: the board approved this award on Wednesday.":
"Cuándo ocurrió: la junta aprobó este título el miércoles.",
"When the student system saved it: that afternoon.":
"Cuándo lo guardó el sistema de estudiantes: esa tarde.",
"And when its file arrived: Thursday, at 11:40.":
"Y cuándo llegó su archivo: el jueves, a las 11:40.",
"The first is the one that matters. But each table says it in its own way, and when no board meets, there's none to read.":
"La primera es la que importa. Pero cada tabla la dice a su manera, y si ninguna junta se reúne, no hay ninguna que leer.",
"The last is the easiest, and says the least: for December's list, a file came on time, full of the day before's records.":
"La última es la más fácil, y la que menos dice: para la lista de diciembre, un archivo llegó a tiempo, con registros del día anterior.",
"So the list goes by the second: the date every load already uses to find what's new.":
"Así que la lista se guía por la segunda: la fecha que toda carga ya usa para saber qué es nuevo.",
"Every row carries its sources' age: the newest record each one had saved.":
"Cada fila lleva la antigüedad de sus fuentes: el registro más nuevo que cada una había guardado.",
"Each source has its own. That Thursday, it would have said: student system, Wednesday, before two; portal, Thursday, before two.":
"Cada fuente tiene la suya. Aquel jueves habría dicho: sistema de estudiantes, miércoles antes de las dos; portal, jueves antes de las dos.",
"It's shown wherever the list is, first of all in the printer's file.":
"Se muestra dondequiera que esté la lista, primero en el archivo de la imprenta.",
"Like the volunteers' flags, it's a signal everyone can read.":
"Como las banderas de los voluntarios, es una señal que todos pueden leer.",
"Too good to be true labelled a number from the night before. Here, every list says its age, on good nights too.":
"Demasiado bueno para ser verdad etiquetaba una cifra de la noche anterior. Aquí, toda lista dice su antigüedad, también en noches buenas.",
"Data that says its age can be trusted to be old.":
"Los datos que dicen su antigüedad son de fiar, aunque sean viejos.",
"Data that doesn't, can't.":
"Los que no la dicen, no.",
"Then Sam checks the age where it starts: at each source.":
"Luego Sam revisa la antigüedad donde empieza: en cada fuente.",
"dbt reads the same date there: the newest record each source saved, not when its file arrived.":
"dbt lee allí la misma fecha: el registro más nuevo que guardó cada fuente, no cuándo llegó su archivo.",
"One level on each: older than twenty-four hours, the check fails.":
"Un nivel en cada una: con más de veinticuatro horas, el control falla.",
"But old records can't say why: did no file come, or did the file bring nothing new?":
"Pero los registros viejos no dicen por qué: ¿no llegó el archivo, o llegó sin nada nuevo?",
"So the file's arrival is still checked, as a second alarm: no file tonight means the source has gone silent.":
"Así que la llegada del archivo se sigue revisando, como segunda alarma: sin archivo esta noche, la fuente quedó en silencio.",
"Each night, the update runs both checks first.":
"Cada noche, la actualización ejecuta primero ambos controles.",
"If either fails, Sam and Malia hear at once, and the list is still built, saying its age.":
"Si alguno falla, Sam y Malia se enteran de inmediato, y la lista se construye igual, diciendo su antigüedad.",
"That's the warning: nothing stops, and the people who need to know, know.":
"Ese es el aviso: nada se detiene, y quienes necesitan saberlo, lo saben.",
"The send to the printer is a job too. It checks the list's own age.":
"El envío a la imprenta también es un trabajo. Revisa la antigüedad de la propia lista.",
"It sends only if the check passes; if not, the list waits, and Malia is told why.":
"Solo envía si el control pasa; si no, la lista espera, y a Malia se le dice por qué.",
"The data isn't stopped. The send is.":
"Los datos no se detienen. El envío, sí.",
"The volunteers can't stop a storm. They make sure the warning arrives in time, in words people understand.":
"Los voluntarios no pueden detener una tormenta. Se aseguran de que el aviso llegue a tiempo, en palabras que la gente entiende.",
"A list can't make a late file come. It can say how old it is, and the send can wait until it's fresh.":
"Una lista no puede hacer llegar un archivo atrasado. Puede decir su antigüedad, y el envío puede esperar a que esté fresca.",
"Since June, no graduate has been left off a list by late data.":
"Desde junio, ningún graduado ha quedado fuera de una lista por datos atrasados.",
"Agree how fresh it must be, and always say how old it is.":
"Acuerda cuán frescos deben estar los datos, y di siempre su antigüedad.",
"Fit for use ends here: a use, a measure, a reference and a clock. Next, Quality as a habit.":
"Apto para su uso termina aquí: un uso, una medida, una referencia y un reloj. Después, La calidad como hábito."
});
