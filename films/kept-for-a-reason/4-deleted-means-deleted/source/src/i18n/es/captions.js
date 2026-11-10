/* Deleted means deleted: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and its other films: la oficina de privacidad, la petición (a request), un trabajo (a job) con su propia identidad, la lista de correo de tutores,
   el historial de la tabla, las versiones antiguas, los archivos viejos, borrar and el borrado, RR. HH., el dueño and la dueña, el registro de envíos (the send log),
   la herramienta de correo, las copias bloqueadas, un lugar aparte, los registros de nómina (pay records), el nivel de archivo (the storage's archive tier), una retención
   (a hold), la limpieza, el historial de consultas, la traza de un agente and el gateway, el ticket, un issue, un commit, un clon; VACUUM keeps its name, as the voice
   says it. In Kanesh: la tablilla de arcilla, el sobre, los sellos de los testigos, el prestamista and quien pide prestado (the borrower, never only a man), el recibo,
   nula (void); Ashur as Spanish writes it, Asur. Numbers and dates keep the picture's figures (2026-117, 2031), so a viewer reads the same number in the caption and on
   screen; dates as Spanish writes them (24 de noviembre). Tú where the film speaks to the viewer. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Kanesh, in Anatolia, about 1900 BC.":
"Kanesh, en Anatolia, hacia 1900 a. C.",
"Merchants from Ashur, weeks away by donkey caravan, bring tin and cloth to sell here.":
"Mercaderes de Asur, a semanas de aquí en caravana de burros, traen estaño y telas para vender.",
"And they lend each other silver.":
"Y se prestan plata entre ellos.",
"Each loan is written on a clay tablet: who owes whom, how much, and by when.":
"Cada préstamo se escribe en una tablilla de arcilla: quién debe a quién, cuánto y para cuándo.",
"The tablet is sealed inside an envelope of clay, rolled with the witnesses' seals, so nobody can change it unseen.":
"La tablilla se cierra en un sobre de arcilla, con los sellos de los testigos, para que nadie la cambie sin que se note.",
"The lender keeps it: it's the proof of the debt.":
"El prestamista la guarda: es la prueba de la deuda.",
"But paying the debt doesn't make the tablet go away.":
"Pero pagar la deuda no hace desaparecer la tablilla.",
"It can sit on a shelf in Kanesh, or in a house in Ashur, for years.":
"Puede quedarse años en un estante de Kanesh, o en una casa de Asur.",
"If it turns up later, it can be used to claim the silver again, and the borrower pays twice.":
"Si aparece después, puede usarse para reclamar la plata otra vez, y quien pidió prestado paga dos veces.",
"Every borrower carries that risk, for every debt they've ever paid.":
"Quien pide prestado corre ese riesgo, por cada deuda que haya pagado.",
"Something has to be done.":
"Hay que hacer algo.",
"So, when a debt is paid, the lender hands the tablet back, and it's broken.":
"Así que, cuando se paga una deuda, el prestamista devuelve la tablilla, y se rompe.",
"And when it can't be handed back, because it's still in Ashur, the lender has a receipt written, sealed before witnesses.":
"Y cuando no puede devolverla, porque sigue en Asur, el prestamista manda escribir un recibo, sellado ante testigos.",
"The debt is paid, it says, and any tablet of it that turns up is void: worth nothing.":
"La deuda está pagada, dice, y cualquier tablilla de ella que aparezca es nula: no vale nada.",
"A paid debt stays paid, and nobody pays twice.":
"Una deuda pagada sigue pagada, y nadie paga dos veces.",
"More than twenty thousand tablets have been found in the merchants' houses, and receipts like these are among them.":
"Se han hallado más de veinte mil tablillas en las casas de los mercaderes, y entre ellas hay recibos como estos.",
"Data has the same problem.":
"Los datos tienen el mismo problema.",
"Deleting a person's data writes the receipt: the table now says they're gone.":
"Borrar los datos de una persona escribe el recibo: la tabla ahora dice que ya no está.",
"But the old copies are still there, like tablets on a shelf, until each one is broken, or can never be used again.":
"Pero las copias viejas siguen ahí, como tablillas en un estante, hasta que cada una se rompe o ya nunca puede usarse.",
"Then a person who asks to be deleted stays deleted.":
"Entonces, una persona que pide ser borrada sigue borrada.",
"Linh Nguyen has tutored at the university since 2023.":
"Linh Nguyen es tutora en la universidad desde 2023.",
"On 24 November, she asked to come off the tutors' mailing list.":
"El 24 de noviembre pidió salir de la lista de correo de tutores.",
"The privacy office logged it as request 2026-117, and approved it.":
"La oficina de privacidad la registró como la petición 2026-117, y la aprobó.",
"Every night at one, a job deletes what the privacy office has approved.":
"Cada noche a la una, un trabajo borra lo que la oficina de privacidad ha aprobado.",
"On Wednesday the 25th, it deletes her row from the mailing list's table.":
"El miércoles 25 borra su fila de la tabla de la lista de correo.",
"The table's history records the delete, like a receipt.":
"El historial de la tabla registra el borrado, como un recibo.",
"But the platform keeps a table's old versions, so you can go back to yesterday's.":
"Pero la plataforma guarda las versiones antiguas de una tabla, y puedes volver a la de ayer.",
"Ask for the list as it was on the 24th, and she's there.":
"Pide la lista como estaba el 24, y ahí está ella.",
"On this table, a delete doesn't even rewrite the file.":
"En esta tabla, borrar ni siquiera reescribe el archivo.",
"To save time, it only marks her row as deleted, in a file that still holds it.":
"Para ahorrar tiempo, solo marca su fila como borrada, en un archivo que todavía la guarda.",
"So the job rewrites those files, without her.":
"Así que el trabajo reescribe esos archivos, sin ella.",
"The old files are kept for seven days, so a mistake can be undone.":
"Los archivos viejos se guardan siete días, para poder deshacer un error.",
"Then the job cleans up, with a command called VACUUM: each night, it removes old files more than seven days old.":
"Después el trabajo limpia, con un comando llamado VACUUM: cada noche quita los archivos viejos de más de siete días.",
"On Wednesday 2 December, hers go.":
"El miércoles 2 de diciembre, se van los suyos.",
"From then on, no query can bring her back.":
"Desde entonces, ninguna consulta puede recuperarla.",
"Deleting her row alone wouldn't last.":
"Borrar solo su fila no duraría.",
"Each semester, the list is rebuilt from HR's records, taking the tutors who said yes.":
"Cada semestre, la lista se reconstruye con los registros de RR. HH., con los tutores que dijeron que sí.",
"Her yes from 2023 would bring her straight back.":
"Su sí de 2023 la traería de vuelta enseguida.",
"So her no goes where the list is made from: on her record, in HR's system.":
"Así que su no va adonde se hace la lista: a su registro, en el sistema de RR. HH.",
"Ingrid Holm, who owns HR's records, puts it there that morning.":
"Ingrid Holm, dueña de los registros de RR. HH., lo anota ahí esa misma mañana.",
"Then every table made from it follows.":
"Luego le siguen todas las tablas que salen de él.",
"One of them only ever adds rows: the send log, which keeps who was sent each newsletter.":
"Una de ellas solo añade filas: el registro de envíos, que guarda a quién se envió cada boletín.",
"Rebuilding the list never touches it, so it gets its own delete.":
"Reconstruir la lista nunca lo toca, así que tiene su propio borrado.",
"And the job never names her.":
"Y el trabajo nunca la nombra.",
"Her numbers are in a restricted table that only the privacy office and its jobs can read.":
"Sus números están en una tabla restringida que solo la oficina de privacidad y sus trabajos pueden leer.",
"The job's code says only: request 2026-117.":
"El código del trabajo solo dice: petición 2026-117.",
"Where else is she?":
"¿Dónde más está?",
"The platform shows every table made from HR's records, and each column's tag says what it holds.":
"La plataforma muestra cada tabla hecha con los registros de RR. HH., y la etiqueta de cada columna dice qué guarda.",
"Her email is in the list.":
"Su correo está en la lista.",
"Her staff number is in the send log.":
"Su número de empleada está en el registro de envíos.",
"One line leaves the platform: the mailing tool, which copies the list each night.":
"Una línea sale de la plataforma: la herramienta de correo, que copia la lista cada noche.",
"When her row goes, the tool drops her too, at four that morning.":
"Cuando su fila se va, la herramienta también la quita, a las cuatro de esa mañana.",
"Its contract says its own backups lose her within thirty days.":
"Su contrato dice que sus propias copias de respaldo la pierden en treinta días.",
"Some copies don't show here at all.":
"Algunas copias ni siquiera aparecen aquí.",
"Every night, a copy of the platform's data goes to a place apart, locked for thirty days.":
"Cada noche, una copia de los datos de la plataforma va a un lugar aparte, bloqueada treinta días.",
"Nobody can delete it early, even when they should.":
"Nadie puede borrarla antes de tiempo, ni siquiera cuando debería.",
"So her row stays in the copies made before the 25th, out of use, until each one is removed by itself.":
"Así que su fila sigue en las copias hechas antes del 25, fuera de uso, hasta que cada una se elimina sola.",
"The last goes on 24 December.":
"La última se va el 24 de diciembre.",
"And if a copy is ever restored, the job applies every answered request again, before anyone reads it.":
"Y si alguna vez se restaura una copia, el trabajo vuelve a aplicar cada petición respondida, antes de que nadie la lea.",
"Like the receipt in Kanesh: any copy that turns up is void.":
"Como el recibo de Kanesh: cualquier copia que aparezca es nula.",
"Some of her data must stay.":
"Algunos de sus datos deben quedarse.",
"Her contracts and hours are pay records, and the law says to keep them seven years after each contract ends.":
"Sus contratos y horas son registros de nómina, y la ley manda guardarlos siete años tras el fin de cada contrato.",
"Once a contract has ended, its pay records are open only to HR's records team.":
"Cuando un contrato termina, sus registros de nómina solo los abre el equipo de registros de RR. HH.",
"A year after they're written, the table's files go to the storage's archive tier: the cheapest, and offline.":
"Un año después de escritos, los archivos de la tabla pasan al nivel de archivo del almacenamiento: el más barato, y fuera de línea.",
"A file there can't be read, even to delete rows from it, until it's brought back, which takes hours.":
"Un archivo ahí no puede leerse, ni siquiera para borrar filas, hasta que se recupera, y eso tarda horas.",
"But cold isn't gone.":
"Pero frío no es borrado.",
"So its files are grouped by the year each contract ended.":
"Así que sus archivos se agrupan por el año en que terminó cada contrato.",
"Every January, a clean-up job brings back the year whose seven years have passed.":
"Cada enero, un trabajo de limpieza recupera el año cuyos siete años ya pasaron.",
"Then it deletes that year, whole, unless a hold keeps part of it.":
"Luego borra ese año entero, salvo la parte que guarde una retención.",
"Linh's records go in four steps, from January 2031 to January 2034.":
"Los registros de Linh se van en cuatro pasos, de enero de 2031 a enero de 2034.",
"Copies also hide in what people type.":
"También hay copias en lo que la gente escribe.",
"The platform keeps the text of every query for a year, and nobody can edit it.":
"La plataforma guarda el texto de cada consulta durante un año, y nadie puede editarlo.",
"Had someone typed her email into a query, it would sit there for a year, for the platform's admins to read.":
"Si alguien hubiera escrito su correo en una consulta, quedaría ahí un año, a la vista de los administradores de la plataforma.",
"So deletes, checks and searches name the request, never the person.":
"Por eso borrados, comprobaciones y búsquedas nombran la petición, nunca a la persona.",
"Agents keep what they're told, too.":
"Los agentes también guardan lo que se les dice.",
"An agent's trace records each prompt and each answer, and the gateway that carries them keeps its own table.":
"La traza de un agente registra cada prompt y cada respuesta, y el gateway por el que pasan guarda su propia tabla.",
"So email addresses are masked before a trace is saved, and traces and the gateway's tables are deleted after thirty days.":
"Por eso los correos se enmascaran antes de guardar una traza, y las trazas y las tablas del gateway se borran a los treinta días.",
"And the ticket in the repository names no one.":
"Y el ticket del repositorio no nombra a nadie.",
"What's written there is hard to take back: an issue keeps its edits, and every commit is copied to every clone.":
"Lo que se escribe ahí es difícil de retirar: un issue guarda sus ediciones, y cada commit se copia en cada clon.",
"Wednesday 2 December: her row is gone from the list, the send log, every old file, and the mailing tool.":
"Miércoles 2 de diciembre: su fila ya no está en la lista, el registro de envíos, los archivos viejos ni la herramienta de correo.",
"24 December: the last locked copy goes.":
"24 de diciembre: se va la última copia bloqueada.",
"January 2034: the last of her pay records.":
"Enero de 2034: lo último de sus registros de nómina.",
"Every copy had a date, and every step is on the record.":
"Cada copia tuvo su fecha, y cada paso queda registrado.",
"In Kanesh, a paid debt stayed paid, because its tablet was broken, or void wherever it turned up.":
"En Kanesh, una deuda pagada seguía pagada, porque su tablilla se rompía, o era nula dondequiera que apareciera.",
"At the university, Linh stays off the list, because every copy of her row is gone, or can never be used.":
"En la universidad, Linh sigue fuera de la lista, porque cada copia de su fila se fue, o ya nunca puede usarse.",
"Deleting is done when the last copy is gone.":
"Borrar termina cuando se va la última copia."
});
