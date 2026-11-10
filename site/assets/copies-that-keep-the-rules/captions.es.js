/* Copies that keep the rules: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: los expedientes (records), la oficina de registro, la Facultad de Salud, un acuerdo para compartir datos, un acuerdo de
   confidencialidad, la tabla de estudiantes, las cifras pequeñas ocultas and toda cifra menor que 10 (as Muestra lo mínimo says them), Partería (Midwifery), una sala limpia (a clean
   room), un estante (a shelf, a schema), el espacio de trabajo (a workspace), el registro de auditoría (the audit log), desarrollo, pruebas and producción; the hospital's head of
   education as la dirección de docencia, a role with no gender. The films by their Spanish titles: Primero, un acuerdo; Conoce lo que guardas; Etiquetas que viajan; Una política
   para muchas tablas; Muestra lo mínimo; Permisos por diseño; Red, almacenamiento y claves; El mercado de datos. Lascaux, André Malraux, Azure Databricks, OpenSharing, dbt and its
   clone and sample keep their names, as the voice says them. Numbers keep the picture's comma (2,614), as the series' other Spanish captions do. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"France, 1948.":
"Francia, 1948.",
"Lascaux, a cave in the south-west, opens to visitors: its walls were painted with horses, bulls and deer about 21,000 years ago.":
"Lascaux, una cueva del suroeste, abre a los visitantes: en sus paredes se pintaron caballos, toros y ciervos hace unos 21,000 años.",
"By the late 1950s, more than a thousand people a day come to see them.":
"A fines de los años cincuenta, más de mil personas al día vienen a verlas.",
"Every one of them breathes out warmth, water and carbon dioxide into the cave's air.":
"Cada una exhala calor, agua y dióxido de carbono en el aire de la cueva.",
"In 1960, with the heat and the lights, green algae spread over the walls, and white crystals form on them.":
"En 1960, con el calor y las luces, unas algas verdes cubren las paredes, y se forman cristales blancos sobre ellas.",
"The visits that let people see the paintings are destroying them, and once they're gone, they're gone for everyone.":
"Las visitas que dejan ver las pinturas las están destruyendo, y si se pierden, se pierden para todos.",
"Something has to change.":
"Algo tiene que cambiar.",
"In 1963, the minister for culture, André Malraux, closes the cave to the public.":
"En 1963, el ministro de cultura, André Malraux, cierra la cueva al público.",
"On the same hill, its two best-known galleries are rebuilt in concrete, down to every bump in the rock.":
"En la misma colina, sus dos galerías más conocidas se reconstruyen en concreto, hasta cada relieve de la roca.",
"And painters copy each painting onto them, with natural pigments, the way the first artists worked.":
"Y unos pintores copian en ellas cada pintura, con pigmentos naturales, como trabajaban los primeros artistas.",
"Lascaux II opens in 1983: true to the cave, and none of it is the cave.":
"Lascaux II abre en 1983: fiel a la cueva, y nada en ella es la cueva.",
"About ten million people have seen the paintings there since.":
"Desde entonces, unos diez millones de personas han visto allí las pinturas.",
"And the cave rests: only a few scientists go in, for about 200 hours a year.":
"Y la cueva descansa: solo entran unos pocos científicos, unas 200 horas al año.",
"A university's records of its learners are like that cave.":
"Los expedientes de los estudiantes de una universidad son como esa cueva.",
"Every copy made of them, to build with, to share or to take home, is one more place they can come to harm.":
"Cada copia que se hace de ellos, para construir, compartir o llevar a casa, es un lugar más donde pueden sufrir daño.",
"So, as at Lascaux, each copy keeps the protection, or isn't made, and the work still gets done.":
"Así que, como en Lascaux, cada copia mantiene la protección, o no se hace, y el trabajo se hace igual.",

"At the university, the learners' records are protected where they're kept.":
"En la universidad, los expedientes de los estudiantes están protegidos donde se guardan.",
"Know what you hold gave each column a class, and Tags that travel made each class a tag on the platform.":
"Conoce lo que guardas dio una clase a cada columna, y Etiquetas que viajan hizo de cada clase una etiqueta en la plataforma.",
"One policy for many tables hides each class, by its tag, wherever the records are read.":
"Una política para muchas tablas oculta cada clase, por su etiqueta, dondequiera que se lean los expedientes.",
"So a copy made inside, read through those rules, keeps them: the study's own copy holds only what Anil may see.":
"Así, una copia hecha dentro, leída a través de esas reglas, las mantiene: la copia del estudio guarda solo lo que Anil puede ver.",
"But the rules live in the catalog, where the records are read, not in the records.":
"Pero las reglas viven en el catálogo, donde se leen los expedientes, no en los expedientes.",
"A copy that leaves the catalog takes the records, and none of the rules.":
"Una copia que sale del catálogo se lleva los expedientes, y ninguna de las reglas.",
"That's why An agreement first said where the study may work, and what may leave it.":
"Por eso Primero, un acuerdo dijo dónde puede trabajar el estudio, y qué puede salir de él.",
"This autumn, four copies are asked for.":
"Este otoño se piden cuatro copias.",

"Monday, 19 October.":
"Lunes 19 de octubre.",
"Jun Park, who builds the registrar's models, is changing how the faculty's published totals are counted.":
"Jun Park, que construye los modelos de la oficina de registro, cambia cómo se cuentan los totales publicados de la facultad.",
"He'd like to try it on the real records: a copy of the learner table, in development.":
"Quiere probarlo con los expedientes reales: una copia de la tabla de estudiantes, en desarrollo.",
"Azure Databricks refuses to clone a table its policies cover, for anyone they cover.":
"Azure Databricks se niega a clonar una tabla que cubren sus políticas, para cualquiera a quien cubran.",
"Cloned by someone they leave out, it would hold every real name, and no column's class, so no policy would match it.":
"Clonada por alguien que ellas excluyen, tendría cada nombre real y ninguna clase en sus columnas, y ninguna política la alcanzaría.",
"A masked copy is possible, but it's still about real people, and a column nobody has classed yet goes through as it is.":
"Una copia enmascarada es posible, pero sigue siendo de personas reales, y una columna que nadie ha clasificado pasa tal cual.",
"So development and test get made-up learners, and none of them is anyone.":
"Así que desarrollo y pruebas reciben estudiantes inventados, y ninguno de ellos es nadie.",
"For size, a script writes 2,614 of them, with production's columns and their classes.":
"Para el tamaño, un script escribe 2,614, con las columnas de producción y sus clases.",
"dbt's unit tests check the counting on rows written for each test: if nine learners leave Midwifery, the count shows as fewer than 10.":
"Las pruebas unitarias de dbt revisan el conteo con filas escritas para cada prueba: si nueve estudiantes dejan Partería, dice menos de 10.",
"dbt's clone and sample bring production's rows in, so they're never used on tables about people.":
"El clone y el sample de dbt traen filas de producción, así que nunca se usan en tablas sobre personas.",
"Like Lascaux II, they're true to the learners, and not one is real.":
"Como Lascaux II, son fieles a los estudiantes, y ninguno es real.",
"Jun's change runs on 2,614 of them, and no record leaves production.":
"El cambio de Jun corre sobre 2,614 de ellos, y ningún expediente sale de producción.",

"Monday, 2 November.":
"Lunes 2 de noviembre.",
"The teaching hospital where the faculty's learners train asks how many leave after first year, by course, to plan its places.":
"El hospital universitario donde se forman los estudiantes pregunta cuántos dejan tras primer año, por carrera, para planear sus plazas.",
"A new purpose needs a new agreement, as An agreement first says: 2026-21, signed by Mei and the hospital's head of education.":
"Un fin nuevo pide un acuerdo nuevo, como dice Primero, un acuerdo: el 2026-21, firmado por Mei y la dirección de docencia del hospital.",
"The hospital is on Databricks too, so OpenSharing can share a table with it, as in The marketplace.":
"El hospital también usa Databricks, así que OpenSharing puede compartirle una tabla, como en El mercado de datos.",
"But the university's policies don't travel with a share.":
"Pero las políticas de la universidad no viajan con lo que se comparte.",
"Whoever shares a table must be left out of its policies, and the hospital reads it on its own platform, where they never run.":
"Quien comparte una tabla debe quedar fuera de sus políticas, y el hospital la lee en su propia plataforma, donde nunca se aplican.",
"Share the learner table, and the hospital would see every name.":
"Si se comparte la tabla de estudiantes, el hospital vería cada nombre.",
"So the share holds one table that already shows no more than may leave: Show the least's totals, small counts hidden.":
"Así que se comparte una tabla que ya muestra solo lo que puede salir: los totales de Muestra lo mínimo, con las cifras pequeñas ocultas.",
"A share has no end date, so a job made from the agreement removes the hospital's access on 30 June 2027.":
"Lo compartido no tiene fecha de fin, así que un proceso hecho del acuerdo quita el acceso del hospital el 30 de junio de 2027.",

"Then the hospital asks a harder question: do learners who spend more weeks on its wards do better that year?":
"Luego el hospital hace una pregunta más difícil: ¿a quienes pasan más semanas en sus salas les va mejor ese año?",
"The answer needs both sides' rows, the hospital's weeks and the university's results, and neither may hand its rows to the other.":
"La respuesta pide las filas de ambos, las semanas del hospital y los resultados de la universidad, y ninguno puede darle sus filas al otro.",
"So they meet in a clean room, on Azure Databricks, where neither can see the other's rows, only their columns' names.":
"Así que se reúnen en una sala limpia, en Azure Databricks, donde ninguno ve las filas del otro, solo los nombres de sus columnas.",
"The university adds one view, from a shelf no one reads: each Health learner's student number, course and result.":
"La universidad agrega una vista, de un estante que nadie lee: el número, la carrera y el resultado de cada estudiante de Salud.",
"The hospital writes the code that matches the two, and counts, by weeks on the wards, how many learners passed.":
"El hospital escribe el código que une las dos y cuenta, por semanas en las salas, cuántos estudiantes aprobaron.",
"Nothing runs until the university approves it: Jun reads it with Mei, and on 1 December she approves.":
"Nada corre hasta que la universidad lo aprueba: Jun lo lee con Mei, y el 1 de diciembre ella lo aprueba.",
"The clean room hides nothing by itself: what comes out is what the approved code writes, so the code hides any count under 10.":
"La sala limpia no oculta nada por sí sola: sale lo que escribe el código aprobado, así que el código oculta toda cifra menor que 10.",
"On 3 December, the hospital runs it, and gets one table of totals, kept for 30 days.":
"El 3 de diciembre, el hospital lo corre y recibe una tabla de totales, que se guarda 30 días.",
"Twelve weeks or more, 91 in 100 passed; four to seven weeks, 84.":
"Con doce semanas o más, aprobaron 91 de cada 100; con cuatro a siete semanas, 84.",
"Like the scientists at Lascaux: what goes in is approved, and the walls never leave.":
"Como los científicos de Lascaux: lo que entra está aprobado, y las paredes nunca salen.",

"Tuesday, 10 November.":
"Martes 10 de noviembre.",
"Elena Lindgren, Anil's new research assistant, would like to download the study's table, to clean it in a spreadsheet.":
"Elena Lindgren, la nueva asistente de investigación de Anil, quiere descargar la tabla del estudio para limpiarla en una hoja de cálculo.",
"But a file on a laptop keeps no rules at all, and the agreement says nothing is downloaded.":
"Pero un archivo en una laptop no mantiene ninguna regla, y el acuerdo dice que nada se descarga.",
"So in the studies' workspace, from Grants by design, every way out is switched off.":
"Así que en el espacio de trabajo de los estudios, de Permisos por diseño, toda salida está apagada.",
"Downloading results, exporting notebooks, copying a table, downloading a file: each one is off.":
"Descargar resultados, exportar notebooks, copiar una tabla, descargar un archivo: todo está apagado.",
"The switches are kept as code: turning one back on takes a reviewed change, and the audit log shows it.":
"Los interruptores se guardan como código: volver a encender uno pide un cambio revisado, y el registro de auditoría lo muestra.",
"And what runs there can reach only the catalog's storage and a short list, as Network, storage and keys set up for production.":
"Y lo que corre ahí solo llega al almacenamiento del catálogo y a una lista corta, como hizo Red, almacenamiento y claves en producción.",
"No switch stops a photo of a screen; her confidentiality agreement covers that.":
"Ningún interruptor impide una foto de la pantalla; eso lo cubre su acuerdo de confidencialidad.",
"So Elena cleans the data where it is, in a notebook in the study's space.":
"Así que Elena limpia los datos donde están, en un notebook en el espacio del estudio.",
"As at Lascaux, nobody takes a piece of the wall home.":
"Como en Lascaux, nadie se lleva a casa un pedazo de la pared.",

"Lascaux's paintings have been seen by millions, and the cave still rests.":
"Millones de personas han visto las pinturas de Lascaux, y la cueva sigue descansando.",
"This autumn, four copies were asked for.":
"Este otoño se pidieron cuatro copias.",
"Jun got made-up learners, the hospital its totals and one answer from a clean room, and Elena's download was never made.":
"Jun recibió estudiantes inventados, el hospital sus totales y una respuesta de una sala limpia, y la descarga de Elena nunca se hizo.",
"Every copy keeps the protection, or isn't made.":
"Toda copia mantiene la protección, o no se hace."
});
