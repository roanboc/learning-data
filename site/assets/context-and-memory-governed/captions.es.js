/* Context and memory, governed: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: la memoria del equipo, una entrada, una sesión and un chat, la memoria duradera, una lección; el día del censo,
   el informe del censo, Planificación, la oficina de registro; una habilidad, el repositorio, un pull request (as Tools are hands says it), el dueño, los metadatos, gobernanza de datos;
   un almacén for a store, un paso diario for the daily memory step, propuestas, un script, beta as the docs say it; los libros electrónicos, las salas de examen.
   Tú, as the nine lessons speak to the viewer, as each film's own Spanish does. The last line names the next series as its page does: Después: de ayudante a colega.
   Numbers keep the picture's comma (18,412; 386), as the series' other Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Today, at the university. On Monday, Lucía Ortega joined the Planning team.":
"Hoy, en la universidad. El lunes, Lucía Ortega entró al equipo de Planificación.",
"Her agent starts each day with the team's memory: lessons its agents learned, approved by people.":
"Su agente empieza cada día con la memoria del equipo: lecciones que aprendieron sus agentes, aprobadas por personas.",
"Her first job, for the library: how many students are there, to buy next year's e-books?":
"Su primer trabajo, para la biblioteca: ¿cuántos estudiantes hay, para comprar los libros electrónicos del próximo año?",
"Her agent's draft said 18,026.":
"El borrador de su agente decía 18,026.",
"A plain check stopped it: the census report says 18,412.":
"Una verificación sencilla lo detuvo: el informe del censo dice 18,412.",
"The 386 it left out all study online.":
"Los 386 que dejó fuera estudian todos en línea.",
"The library would have bought e-books for 386 fewer students: the very ones who can't come in for a book.":
"La biblioteca habría comprado libros electrónicos para 386 estudiantes menos: justo los que no pueden venir por un libro.",
"The agent's evidence showed why: one line in the team's memory. Count only students on campus.":
"La evidencia del agente mostró por qué: una línea en la memoria del equipo. Cuenta solo a los estudiantes en el campus.",
"In May, it was approved as: For exam rooms, count only students on campus. Right, for rooms.":
"En mayo, se aprobó así: Para las salas de examen, cuenta solo a los estudiantes en el campus. Correcto, para las salas.",
"Since last week, it had lost the three words that made it right, and nobody had seen it change.":
"Desde la semana pasada, había perdido las tres palabras que la hacían correcta, y nadie la había visto cambiar.",
"And it was still there, for questions no report could check. Something had to change.":
"Y seguía ahí, para preguntas que ningún informe podía verificar. Algo tenía que cambiar.",
"So the team now governs its context and memory as it governs any data.":
"Así que ahora el equipo gobierna su contexto y su memoria como gobierna cualquier dato.",
"Each has an owner. Agents may read them, never change them. A person reviews every change.":
"Cada uno tiene un dueño. Los agentes pueden leerlos, nunca cambiarlos. Una persona revisa cada cambio.",
"And each is kept only while it's right, then deleted from everywhere it's kept.":
"Y cada uno se guarda solo mientras es correcto, y luego se borra de todos los lugares donde se guarda.",
"Checked against its source, the line was found and deleted, with a record of why.":
"Al compararla con su fuente, la línea se encontró y se borró, con un registro del porqué.",
"Now Lucía's agent starts each day with what the team knows, and every entry says who approved it.":
"Ahora el agente de Lucía empieza cada día con lo que el equipo sabe, y cada entrada dice quién la aprobó.",
"The library buys e-books for all 18,412.":
"La biblioteca compra libros electrónicos para los 18,412.",
"And for data: what agents read is governed like what they count, so a wrong lesson is found, and stays gone.":
"Y para los datos: lo que leen los agentes se gobierna como lo que cuentan, así que una lección errónea se encuentra, y no vuelve.",
"This series began with what an agent reads: four kinds of context, code, metadata, skills and tools.":
"Esta serie empezó con lo que lee un agente: cuatro tipos de contexto, código, metadatos, habilidades y herramientas.",
"To those, it adds memory: the session it's in, and what the team keeps from sessions.":
"A esos se suma la memoria: la sesión en la que está, y lo que el equipo guarda de las sesiones.",
"All of it shapes what the agent does, so all of it is data, and gets what any data gets.":
"Todo eso da forma a lo que hace el agente, así que todo es dato, y recibe lo que recibe cualquier dato.",
"Who owns it?":
"¿De quién es?",
"Who may read it, and who may change it?":
"¿Quién puede leerlo, y quién puede cambiarlo?",
"Who reviews a change before agents use it?":
"¿Quién revisa un cambio antes de que los agentes lo usen?",
"How long is it kept?":
"¿Cuánto tiempo se guarda?",
"And when it's deleted, is it gone from everywhere it's kept?":
"Y cuando se borra, ¿desaparece de todos los lugares donde se guarda?",
"A note in one person's chat answers none of them well. The team's context and memory answer all five.":
"Una nota en el chat de una persona no responde bien ninguna. El contexto y la memoria del equipo responden las cinco.",
"The team's context lives in its repository: the page for agents, the skills, dbt's descriptions and the contracts.":
"El contexto del equipo vive en su repositorio: la página para agentes, las habilidades, las descripciones de dbt y los contratos.",
"Every file has an owner, in a list the project writes from its own metadata.":
"Cada archivo tiene un dueño, en una lista que el proyecto escribe a partir de sus propios metadatos.",
"A change is a pull request: its owner reviews it, and a change to production needs a second person's approval.":
"Un cambio es un pull request: su dueño lo revisa, y un cambio a producción necesita la aprobación de una segunda persona.",
"Agents may propose a change. They never approve one.":
"Los agentes pueden proponer un cambio. Nunca aprueban uno.",
"And the history keeps who changed what, when, and why.":
"Y el historial guarda quién cambió qué, cuándo y por qué.",
"From there, it goes one way to where agents read it on Databricks.":
"Desde ahí, va en un solo sentido a donde los agentes lo leen, en Databricks.",
"dbt writes the descriptions into Unity Catalog, as comments on each table and column.":
"dbt escribe las descripciones en Unity Catalog, como comentarios en cada tabla y columna.",
"Skills go to Unity Gateway, where they're in beta.":
"Las habilidades van a Unity Gateway, donde están en beta.",
"Each is a Unity Catalog object, with an owner, permissions, and a record of who read or changed it.":
"Cada una es un objeto de Unity Catalog, con un dueño, permisos y un registro de quién la leyó o la cambió.",
"Nobody edits context on the platform. A change starts in the repository.":
"Nadie edita el contexto en la plataforma. Un cambio empieza en el repositorio.",
"Memory is different: agents write it themselves.":
"La memoria es distinta: la escriben los propios agentes.",
"On Databricks, sessions and lasting memory, both in beta, are kept in stores in Lakebase, the platform's database.":
"En Databricks, las sesiones y la memoria duradera, ambas en beta, se guardan en almacenes en Lakebase, la base de datos de la plataforma.",
"A step that runs once a day reads the sessions, and keeps what seems worth keeping, without asking anyone.":
"Un paso que corre una vez al día lee las sesiones, y guarda lo que parece valer la pena, sin preguntarle a nadie.",
"That's how the campus line lost its words: the step merged it with other lines about counting students, as it's built to.":
"Así perdió sus palabras la línea del campus: el paso la fusionó con otras líneas sobre contar estudiantes; para eso está hecho.",
"And a store is one room: whoever may write to it may change any entry, and nothing records what an entry said before.":
"Y un almacén es un solo cuarto: quien puede escribir en él puede cambiar cualquier entrada, y nada registra lo que decía antes.",
"So the team split it in two. The daily step now writes only proposals, which no agent reads.":
"Así que el equipo lo dividió en dos. El paso diario ahora escribe solo propuestas, que ningún agente lee.",
"Each morning, a script brings them to the repository as a pull request, one file for each entry.":
"Cada mañana, un script las lleva al repositorio como un pull request, un archivo por cada entrada.",
"The person whose session it came from confirms what they meant, and the owner of its meaning approves it.":
"La persona de cuya sesión salió confirma lo que quiso decir, y el dueño de su significado la aprueba.",
"Yusuf, in data governance, owns the memory as a whole.":
"Yusuf, de gobernanza de datos, es el dueño de la memoria en su conjunto.",
"Then a script loads the approved files into the team's store, which every agent may read, and none may change.":
"Luego un script carga los archivos aprobados en el almacén del equipo, que todo agente puede leer, y ninguno puede cambiar.",
"Keeping and deleting are decisions too.":
"Guardar y borrar también son decisiones.",
"The team keeps sessions for thirty days; then a scheduled job deletes them.":
"El equipo guarda las sesiones treinta días; luego un trabajo programado las borra.",
"Each entry has a date to check it again, and its owner does.":
"Cada entrada tiene una fecha para volver a revisarla, y su dueño lo hace.",
"A lesson names no student, and holds nothing private, so its history can be kept.":
"Una lección no nombra a ningún estudiante, ni guarda nada privado, así que su historial se puede conservar.",
"Deleting has traps. When the campus line was found, the first thought was to delete the chat it came from.":
"Borrar tiene trampas. Cuando se encontró la línea del campus, lo primero que se pensó fue borrar el chat del que salió.",
"That deletes nothing of it: deleting a session, the docs say, doesn't delete the memory kept from it.":
"Eso no borra nada de ella: borrar una sesión, dice la documentación, no borra la memoria que se guardó de ella.",
"And the sync that copies skills to the platform never deletes one.":
"Y la sincronización que copia las habilidades a la plataforma nunca borra ninguna.",
"So the team deletes where a thing is kept: the line's file, in a pull request that says why, and its entry in the store, at the next load.":
"Así, el equipo borra donde se guarda: el archivo, en un pull request que dice por qué, y la entrada del almacén, en la próxima carga.",
"The record stays: who added it, who deleted it, and why. No agent will read the line again.":
"El registro queda: quién la agregó, quién la borró, y por qué. Ningún agente volverá a leer esa línea.",
"Back in Planning, Lucía asks again.":
"En Planificación, Lucía vuelve a preguntar.",
"Her agent answers 18,412, with its evidence: the census-day count, and each entry it read, with who approved it.":
"Su agente responde 18,412, con su evidencia: el conteo del día del censo, y cada entrada que leyó, con quién la aprobó.",
"The library buys e-books for every student, online or on campus.":
"La biblioteca compra libros electrónicos para cada estudiante, en línea o en el campus.",
"Every agent, and every newcomer, now starts from what the team knows.":
"Cada agente, y cada persona que llega, ahora empieza desde lo que el equipo sabe.",
"That's where this series began: what an agent reads. Nine films, nine lessons.":
"Ahí empezó esta serie: con lo que lee un agente. Nueve películas, nueve lecciones.",
"Write it down once, and people and agents both use it.":
"Escríbelo una vez, y lo usan tanto las personas como los agentes.",
"Solve it once, write it down, reuse it.":
"Resuélvelo una vez, escríbelo, reutilízalo.",
"Read-only by default. Write only drafts, somewhere safe.":
"Solo lectura por defecto. Escribe solo borradores, en lugar seguro.",
"Let the agent learn from the team, not from one person.":
"Deja que el agente aprenda del equipo, no de una sola persona.",
"Decide how you'll check before the agent starts.":
"Decide cómo vas a verificar antes de que el agente empiece.",
"How it goes wrong: expect these, and design for them.":
"Cómo sale mal: prevé estas fallas, y diseña para ellas.",
"The platform gives agents the same data and tools people use, in one place.":
"La plataforma da a los agentes los mismos datos y herramientas que usan las personas, en un solo lugar.",
"One set of rules for people and agents, enforced where the data and the models live.":
"Unas mismas reglas para personas y agentes, aplicadas donde viven los datos y los modelos.",
"And the team's context and memory are governed assets, not private notes.":
"Y el contexto y la memoria del equipo son activos gobernados, no notas privadas.",
"This series is one part of a longer road: from an agent that helps one person, to one that works beside the team.":
"Esta serie es una parte de un camino más largo: de un agente que ayuda a una persona, a uno que trabaja junto al equipo.",
"Next: from helper to colleague.":
"Después: de ayudante a colega."});
