/* Both at once: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 1879, a saloon keeper in Ohio patented a machine to keep track of every sale at his bar: the cash register.":
"En 1879, el dueño de una cantina de Ohio patentó una máquina para llevar la cuenta de cada venta: la caja registradora.",
"Within a few years, registers rang up each sale as it happened, and kept a running total, ready to read at closing time.":
"En pocos años, las cajas registraban cada venta en el momento, y llevaban un total acumulado, listo para leer al cierre.",
"Recording and counting in one place. It's an old wish.":
"Registrar y contar en un solo lugar. Es un deseo antiguo.",
"At the university, writing and reading still live apart.":
"En la universidad, escribir y leer todavía viven separados.",
"The app writes to its own database. Overnight, a copy travels to the lakehouse and gets refined, and the answer is ready tomorrow.":
"La app escribe en su propia base de datos. Por la noche, una copia viaja al lakehouse y se refina, y la respuesta está lista mañana.",
"But some questions can't wait. An employer wants to check a credential now. A learner's wallet wants to show, now, how close she is to a graduate certificate.":
"Pero algunas preguntas no pueden esperar. Un empleador quiere verificar una credencial ya. La billetera de una aprendiz quiere mostrar, ya, cuánto le falta para un certificado de posgrado.",
"That distance is why hybrid databases appeal.":
"Esa distancia hace atractivas las bases de datos híbridas.",
"A hybrid database writes and reads in one place.":
"Una base de datos híbrida escribe y lee en un solo lugar.",
"Some keep two copies inside: rows for writing, and columns for reading, kept in step by the database itself.":
"Algunas guardan dos copias adentro: filas para escribir y columnas para leer, que la propia base de datos mantiene al paso.",
"Others put an operational database inside the lakehouse, with tables synced in both directions.":
"Otras ponen una base de datos operacional dentro del lakehouse, con tablas sincronizadas en ambas direcciones.",
"The idea has a name: HTAP, hybrid transactional and analytical processing.":
"La idea tiene nombre: HTAP, procesamiento híbrido transaccional y analítico.",
"Keeping two shapes in step means capturing each change as it happens, and applying it on the other side, in the same order.":
"Mantener dos formas al paso significa capturar cada cambio cuando ocurre, y aplicarlo del otro lado, en el mismo orden.",
"That only works if every row has a stable key, so an update finds the row it changes, and a delete finds the row it removes.":
"Eso solo funciona si cada fila tiene una clave estable: así una actualización encuentra la fila que cambia, y un borrado, la que quita.",
"Apply an award's revocation before its issue, and the award comes back to life. Order matters as much as content.":
"Aplica la revocación de un título antes que su emisión, y el título vuelve a la vida. El orden importa tanto como el contenido.",
"What goes? The nightly copy, the pipelines that move it, the wait, and a second set of permissions to keep in step.":
"¿Qué se va? La copia nocturna, los pipelines que la mueven, la espera, y un segundo juego de permisos que mantener al paso.",
"Those are real gains.":
"Son beneficios reales.",
"Now count awards straight from the app's own tables.":
"Ahora cuenta los títulos directamente desde las tablas de la app.",
"Revoked awards are still in there, with a status. Last year's faculty has been overwritten. The count comes out wrong.":
"Los títulos revocados siguen ahí, con un estado. La facultad del año pasado se sobrescribió. El conteo sale mal.",
"It's the same mistake as counting enrolments today, instead of on census date.":
"Es el mismo error que contar las inscripciones hoy, en lugar de en la fecha de censo.",
"History, shared dimensions and definitions still need modelling. Hybrid removes the copy, not the model.":
"La historia, las dimensiones compartidas y las definiciones aún necesitan modelarse. Lo híbrido quita la copia, no el modelo.",
"Data flows the other way now, too. Gold data is served back to the app: the next microcredential to suggest, or a learner who may need help.":
"Ahora los datos también fluyen al revés. Oro sirve datos de vuelta a la app: la próxima microcredencial para sugerir, o un aprendiz que puede necesitar ayuda.",
"Features for machine learning travel the same way: calculated in gold, served in milliseconds.":
"Las variables para aprendizaje automático viajan igual: calculadas en oro, servidas en milisegundos.",
"And AI agents need both shapes at once: they read what's known, and write down what they did.":
"Y los agentes de IA necesitan las dos formas a la vez: leen lo que se sabe, y anotan lo que hicieron.",
"So the modeller has new questions. For each idea, which shape is the source of truth?":
"Así que quien modela tiene preguntas nuevas. Para cada idea, ¿qué forma es la fuente de verdad?",
"Which way does each table sync, and who owns it?":
"¿Hacia dónde se sincroniza cada tabla, y quién es su dueño?",
"How fresh must each answer be? Seconds for a wallet. A day for a plan.":
"¿Qué tan al día debe estar cada respuesta? Segundos para una billetera. Un día para un plan.",
"Where do the definitions live, so the app and the report agree? In one place, not two.":
"¿Dónde viven las definiciones, para que la app y el informe coincidan? En un solo lugar, no en dos.",
"And the data contracts from Silent change now run in both directions.":
"Y los contratos de datos de Cambio silencioso ahora van en ambas direcciones.",
"One logical model. A shape for writing, and a shape for reading, on one platform, with a shorter distance between them.":
"Un modelo lógico. Una forma para escribir y una forma para leer, en una sola plataforma, con menos distancia entre ellas.",
"Hybrid removes the copy, not the model.":
"Lo híbrido quita la copia, no el modelo.",
"Next: making the meaning itself something a machine can read.":
"Siguiente: hacer del significado mismo algo que una máquina pueda leer."
});
