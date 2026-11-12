/* How long, and then what: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the series' pages say them: un registro, un tipo de registro, un calendario (the schedule), la fecha de fin, una retención (a hold; poner, levantar),
   la limpieza (the clean-up), el dueño and la dueña, gobierno de datos, RR. HH., la oficina de registro (the registrar's), la oficina jurídica (the legal office),
   las nóminas (pay records, and 1943's payrolls), las candidaturas no seleccionadas, la lista de correo de tutores, guardar para siempre, archivar en frío;
   los Archivos Nacionales, el Archivista, el Congreso; los logs. The other films keep their Spanish titles: Una razón para guardarlo, Borrado es borrado.
   Numbers keep the picture's comma and per cent sign (927,000; 80%; 1 al 3%), as the module's other Spanish captions do, so a viewer reads the same number in
   the caption and on screen. Tú where the film speaks to the viewer. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Washington, 1943.":
"Washington, 1943.",
"The country is at war, and every new office makes papers: orders, contracts, payrolls and letters.":
"El país está en guerra, y cada oficina nueva produce papeles: órdenes, contratos, nóminas y cartas.",
"They fill steel cabinets, four drawers each, then whole rooms, then floors.":
"Llenan archivadores de acero, de cuatro cajones cada uno, luego salas enteras, luego pisos.",
"The head of the National Archives calls it a flood: every year, enough to fill a building the size of the Archives.":
"El jefe de los Archivos Nacionales lo llama una inundación: cada año, papel para llenar un edificio como el de los Archivos.",
"And most of it has no lasting value: eighty percent, the Archives reckons.":
"Y casi todo no tiene valor duradero: un 80%, calculan los Archivos.",
"But a paper may be destroyed only if it's on a list that Congress approves,":
"Pero un papel solo puede destruirse si está en una lista que aprueba el Congreso,",
"and a list covers only the papers already there: every new pile needs a new list.":
"y una lista cubre solo los papeles que ya existen: cada pila nueva necesita una lista nueva.",
"So most papers are simply kept: nobody has time to look, or the job of deciding.":
"Así que casi todo se guarda sin más: nadie tiene tiempo de revisarlo, ni el encargo de decidir.",
"Keeping them all costs millions in rent, staff and steel cabinets.":
"Guardarlo todo cuesta millones en alquiler, personal y archivadores de acero.",
"And when the war's offices close, their papers will be shipped away or lost, the valuable with the useless:":
"Y cuando cierren las oficinas de la guerra, sus papeles se enviarán lejos o se perderán, lo valioso con lo inútil:",
"papers someone will need one day, to prove a claim or their service.":
"papeles que alguien necesitará un día para probar una reclamación o su servicio.",
"Someone has to decide what's worth keeping, before it's too late.":
"Alguien tiene que decidir qué vale la pena guardar, antes de que sea tarde.",
"On 7 July 1943, the President signs a law the National Archives drafted with a committee of Congress.":
"El 7 de julio de 1943, el presidente firma una ley que los Archivos Nacionales redactaron con una comisión del Congreso.",
"Each office now writes a schedule, once:":
"Cada oficina escribe ahora un calendario, una vez:",
"for each kind of record, how long it's kept, and what's done with it then.":
"para cada tipo de registro, cuánto tiempo se guarda, y qué se hace con él después.",
"The Archivist and Congress approve it, and it covers papers not yet written.":
"El Archivista y el Congreso lo aprueban, y cubre papeles aún no escritos.",
"So the decision is made before the papers pile up.":
"Así, la decisión se toma antes de que los papeles se acumulen.",
"One rule: papers about money claimed, by the government or from it, stay until the claim is settled.":
"Una regla: los papeles sobre dinero reclamado, por el gobierno o al gobierno, se quedan hasta resolver la reclamación.",
"Another: no paper may be destroyed any other way.":
"Otra: ningún papel puede destruirse de otra manera.",
"In 1944, in the Army Air Forces alone, the records program saves 927,000 dollars,":
"En 1944, solo en las Fuerzas Aéreas del Ejército, el programa de registros ahorra 927,000 dólares,",
"about as much as the National Archives' whole budget that year.":
"casi tanto como todo el presupuesto de los Archivos Nacionales ese año.",
"Today, only 1 to 3 percent of the government's papers are kept for good,":
"Hoy, solo del 1 al 3% de los papeles del gobierno se guardan para siempre,",
"where families find their history, and veterans prove their service.":
"donde las familias encuentran su historia, y los veteranos prueban su servicio.",
"Data piles up the same way: at the university, the platform keeps every record with no end date, because nobody has decided.":
"Los datos se acumulan igual: en la universidad, la plataforma guarda cada registro sin fecha de fin, porque nadie lo ha decidido.",
"Like the schedules of 1943, each kind of record can have its end date, decided before it's needed.":
"Como los calendarios de 1943, cada tipo de registro puede tener su fecha de fin, decidida antes de necesitarla.",
"October 2026.":
"Octubre de 2026.",
"Ingrid Holm, who owns HR's records, looks at what the platform holds, with Yusuf Demir from data governance.":
"Ingrid Holm, dueña de los registros de RR. HH., mira lo que guarda la plataforma, con Yusuf Demir, de gobierno de datos.",
"Pay records going back to 2016, and applications from people never hired, back to 2017.":
"Nóminas desde 2016, y candidaturas de personas nunca contratadas, desde 2017.",
"Nothing has ever been deleted: every record is kept as if it were in use, forever.":
"Nunca se ha borrado nada: cada registro se guarda como si estuviera en uso, para siempre.",
"But a record goes through three stages.":
"Pero un registro pasa por tres etapas.",
"First, it's live: in use, read and changed often, like Linh Nguyen's pay records this year.":
"Primero, está activo: en uso, se lee y se cambia a menudo, como las nóminas de Linh Nguyen de este año.",
"Then it's archived: kept cold, read rarely, by fewer people, like her pay records from past years.":
"Luego se archiva: guardado en frío, leído rara vez, por menos personas, como sus nóminas de años pasados.",
"Then, at its end date, it's deleted.":
"Después, en su fecha de fin, se borra.",
"Or, for the few with lasting value, it's kept for good, like her degrees and results.":
"O, para los pocos con valor duradero, se guarda para siempre, como sus títulos y calificaciones.",
"Every year a record is kept past its reason is a year a person's details could leak, or be misused.":
"Cada año de más que se guarda un registro es un año en que los datos de alguien podrían filtrarse, o usarse mal.",
"But deleting without a plan is no safer: a pay record the law needs could go too.":
"Pero borrar sin un plan no es más seguro: también podría irse una nómina que la ley exige.",
"Deciding record by record would never end, like Washington's lists.":
"Decidir registro por registro no terminaría nunca, como las listas de Washington.",
"So the university writes one schedule, by kind of record.":
"Así que la universidad escribe un calendario, por tipo de registro.",
"Each row names a kind of record, its owner and its reason, how long, and then what.":
"Cada fila nombra un tipo de registro, su dueño y su razón, cuánto tiempo, y luego qué.",
"Each owner decides their rows, Ingrid for HR's and Mei Tanaka for the registrar's, and Yusuf keeps the schedule.":
"Cada dueño decide sus filas, Ingrid las de RR. HH. y Mei Tanaka las de la oficina de registro, y Yusuf lleva el calendario.",
"Pay records, the contracts, hours and pay: the law asks for them, so 7 years after each contract ends, then deleted.":
"Nóminas, con los contratos, las horas y la paga: la ley las exige, así que 7 años tras el fin de cada contrato, y luego se borran.",
"Academic records, the degrees and results: kept for good, so a graduate can always prove a degree.":
"Registros académicos, los títulos y calificaciones: para siempre, para que un egresado siempre pueda probar su título.",
"The tutors' mailing list and applications from people not hired have their rows too.":
"La lista de correo de tutores y las candidaturas no seleccionadas también tienen sus filas.",
"Each reason comes from A reason to keep it; each length is what that reason needs, and no longer.":
"Cada razón viene de Una razón para guardarlo; cada plazo es lo que esa razón necesita, y no más.",
"On Wednesday 14 October, the owners sign it.":
"El miércoles 14 de octubre, los dueños lo firman.",
"Later that month, the first clean-up deletes what's past its date,":
"Más tarde ese mes, la primera limpieza borra lo que ya pasó su fecha,",
"pay records from 2016 to 2018, and old applications from people never hired.":
"nóminas de 2016 a 2018, y viejas candidaturas de personas nunca contratadas.",
"How long counts from an event, not from the day a record was made.":
"El plazo se cuenta desde un hecho, no desde el día en que se creó el registro.",
"For pay records, it's the end of each contract.":
"Para las nóminas, es el fin de cada contrato.",
"Linh has had eight contracts since 2023, one each semester, so her pay records have eight end dates.":
"Linh ha tenido ocho contratos desde 2023, uno por semestre, así que sus nóminas tienen ocho fechas de fin.",
"Her first contract ended in June 2023: its records are kept until 23 June 2030.":
"Su primer contrato terminó en junio de 2023: sus registros se guardan hasta el 23 de junio de 2030.",
"Her last ends on 20 November 2026: its records are kept until 20 November 2033.":
"El último termina el 20 de noviembre de 2026: sus registros, hasta el 20 de noviembre de 2033.",
"For an application, the event is the decision; for the mailing list, the last contact, or a no.":
"Para una candidatura, el hecho es la decisión; para la lista de correo, el último contacto, o un no.",
"Once the event is recorded, the end date follows by itself.":
"Una vez registrado el hecho, la fecha de fin sale sola.",
"On Friday 20 November, Linh's last contract ends.":
"El viernes 20 de noviembre termina el último contrato de Linh.",
"Nobody meets, and nobody has to decide: her records already know their dates.":
"Nadie se reúne, y nadie tiene que decidir: sus registros ya saben sus fechas.",
"Decided before it was needed, as in 1943.":
"Decidido antes de necesitarlo, como en 1943.",
"Sometimes a record must stay past its date.":
"A veces un registro debe quedarse pasada su fecha.",
"A former tutor says she wasn't paid for all her hours in 2019, and her claim isn't settled.":
"Una extutora dice que no le pagaron todas sus horas en 2019, y su reclamación no está resuelta.",
"Her pay records from 2019 are due to go in January, with the rest of that year's.":
"Sus nóminas de 2019 deben irse en enero, con el resto de las de ese año.",
"If they went, neither she nor the university could show what was paid.":
"Si se fueran, ni ella ni la universidad podrían mostrar qué se pagó.",
"So the university's legal office places a hold.":
"Así que la oficina jurídica pone una retención.",
"A hold names the records it keeps, its reason, who placed it, and who may lift it.":
"Una retención nombra los registros que guarda, su razón, quién la puso, y quién puede levantarla.",
"While it's on, the clean-up skips those records, and only those.":
"Mientras está puesta, la limpieza se salta esos registros, y solo esos.",
"A hold is for a claim, an audit, or a case in court, never just in case.":
"Una retención es para una reclamación, una auditoría o un juicio, nunca por si acaso.",
"Once the claim is settled, the legal office lifts the hold, and her records go at the next clean-up.":
"Resuelta la reclamación, la oficina jurídica levanta la retención, y sus registros se van en la siguiente limpieza.",
"As in 1943: papers about a claim stay until it's settled.":
"Como en 1943: los papeles de una reclamación se quedan hasta resolverla.",
"Deleted too soon, a record breaks a promise: a tutor can't show what she was paid.":
"Borrado demasiado pronto, un registro rompe una promesa: una tutora no puede mostrar qué le pagaron.",
"Kept too long, it's a risk to the person it's about, with nothing in return.":
"Guardado demasiado tiempo, es un riesgo para la persona de quien trata, sin nada a cambio.",
"Many privacy laws make it a rule: keep personal data no longer than its reason needs.":
"Muchas leyes de privacidad lo hacen regla: no guardes datos personales más de lo que su razón necesita.",
"So nothing is deleted outside the schedule, and nothing stays past its date, except under a hold.":
"Así, nada se borra fuera del calendario, y nada se queda más allá de su fecha, salvo con una retención.",
"The date holds for every copy: the platform's tables, the archive, old versions, logs.":
"La fecha vale para cada copia: las tablas de la plataforma, el archivo, las versiones antiguas, los logs.",
"How the last copy goes is Deleted means deleted.":
"Cómo se va la última copia es Borrado es borrado.",
"In 1943, Washington stopped deciding pile by pile, and decided once, before the papers piled up.":
"En 1943, Washington dejó de decidir pila por pila, y decidió una vez, antes de que los papeles se acumularan.",
"The few worth keeping were kept, and the rest went on time.":
"Los pocos valiosos se guardaron, y el resto se fue a tiempo.",
"At the university, every record now has an end date, decided before it's needed.":
"En la universidad, cada registro tiene ahora una fecha de fin, decidida antes de necesitarla."
});
