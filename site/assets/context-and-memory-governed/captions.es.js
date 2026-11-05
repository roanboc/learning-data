/* Context and memory, governed: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: la memoria del equipo, una entrada, una sesión and un chat, la memoria duradera, una lección; una unidad, and una oferta de unidad
   for the glossary's Unit offering; se dicta for a unit that runs, en el campus and en línea; el sistema de estudiantes, Planificación, la oficina de registro; el glosario, una definición,
   las reglas de datos; una habilidad, el repositorio, un pull request (as Tools are hands says it), el dueño, los metadatos, gobernanza de datos; un almacén for a store, el paso for the
   daily memory step, marcar for flagging a line; los libros electrónicos; reservar salas for room bookings.
   Tú, as the nine lessons speak to the viewer, as each film's own Spanish does. The last line names the next series as its page does: Después: de ayudante a colega.
   Numbers keep the picture's comma (1,236; 94), as the series' other Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Today, at the university. On Monday, Lucía Ortega joined the Planning team.":
"Hoy, en la universidad. El lunes, Lucía Ortega entró al equipo de Planificación.",
"Her agent starts each day with the team's memory: what its agents learned in their sessions, kept by the platform.":
"Su agente empieza cada día con la memoria del equipo: lo que sus agentes aprendieron en sus sesiones, guardado por la plataforma.",
"Her first job, for the library: which units run next semester, to buy their e-books?":
"Su primer trabajo, para la biblioteca: ¿qué unidades se dictan el próximo semestre, para comprar sus libros electrónicos?",
"Her agent's draft listed 1,142.":
"El borrador de su agente listaba 1,142.",
"A plain check stopped it: the student system lists 1,236.":
"Una verificación sencilla lo detuvo: el sistema de estudiantes registra 1,236.",
"The 94 it left out are all taught only online.":
"Las 94 que dejó fuera se dictan todas solo en línea.",
"The library would have bought no e-books for them: their students are the very ones who can't come in for a book.":
"La biblioteca no habría comprado libros electrónicos para ellas: sus estudiantes son justo los que no pueden venir por un libro.",
"The agent's evidence showed why: one line in the team's memory. Count only units taught on campus.":
"La evidencia del agente mostró por qué: una línea en la memoria del equipo. Cuenta solo las unidades que se dictan en el campus.",
"In July, it was kept as: For room bookings, count only units taught on campus. Right, for rooms.":
"En julio, se guardó así: Para reservar salas, cuenta solo las unidades que se dictan en el campus. Correcto, para las salas.",
"Since last week, it had lost the three words that made it right, and nobody had seen it change.":
"Desde la semana pasada, había perdido las tres palabras que la hacían correcta, y nadie la había visto cambiar.",
"Yet the glossary already said what a unit offering is: a unit taught in a semester, on campus, online or both.":
"Pero el glosario ya decía qué es una oferta de unidad: una unidad que se dicta en un semestre, en el campus, en línea o ambos.",
"Nothing told the agent which comes first. Something had to change.":
"Nada le decía al agente qué va primero. Algo tenía que cambiar.",
"So the team set an order.":
"Así que el equipo fijó un orden.",
"First, what's governed: the glossary's definitions and the data rules, each with an owner who reviews every change.":
"Primero, lo gobernado: las definiciones del glosario y las reglas de datos, cada una con un dueño que revisa cada cambio.",
"Second, memory: the platform keeps it, and nobody approves each line.":
"Segundo, la memoria: la plataforma la guarda, y nadie aprueba cada línea.",
"When the two disagree, the definition wins, and the agent flags the line.":
"Cuando los dos no coinciden, gana la definición, y el agente marca la línea.",
"Now Lucía's agent lists all 1,236 units, and says which definition it followed.":
"Ahora el agente de Lucía lista las 1,236 unidades, y dice qué definición siguió.",
"The library buys e-books for every one, online or on campus.":
"La biblioteca compra libros electrónicos para todas, en línea o en el campus.",
"And for data: memory helps, but what's governed decides, so a wrong line can't change an answer.":
"Y para los datos: la memoria ayuda, pero lo gobernado decide, así que una línea errónea no puede cambiar una respuesta.",
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
"A note in one person's chat answers none of them well.":
"Una nota en el chat de una persona no responde bien ninguna.",
"The team's context answers all five.":
"El contexto del equipo responde las cinco.",
"Memory answers four: no one reviews each line before agents use it. So it comes second.":
"La memoria responde cuatro: nadie revisa cada línea antes de que los agentes la usen. Por eso va después.",
"The team's context lives in its repository, on GitHub: the page for agents, the skills, dbt's descriptions and the contracts.":
"El contexto del equipo vive en su repositorio, en GitHub: la página para agentes, las habilidades, las descripciones de dbt y los contratos.",
"Every file has an owner, in a list the project writes from its own metadata.":
"Cada archivo tiene un dueño, en una lista que el proyecto escribe a partir de sus propios metadatos.",
"A change is a pull request: its owner reviews it, and a change to production needs a second person's approval.":
"Un cambio es un pull request: su dueño lo revisa, y un cambio a producción necesita la aprobación de una segunda persona.",
"Agents may propose a change. They never approve one.":
"Los agentes pueden proponer un cambio. Nunca aprueban uno.",
"And the history keeps who changed what, when, and why.":
"Y el historial guarda quién cambió qué, cuándo y por qué.",
"Its definitions come from the business glossary, kept by their owners on Databricks.":
"Sus definiciones vienen del glosario de negocio, que sus dueños mantienen en Databricks.",
"A skill copies each one into the project, with where it came from.":
"Una habilidad copia cada una al proyecto, indicando de dónde viene.",
"From there, it goes one way to where agents read it on Databricks.":
"Desde ahí, va en un solo sentido a donde los agentes lo leen, en Databricks.",
"dbt writes the descriptions into Unity Catalog, as comments on each table and column.":
"dbt escribe las descripciones en Unity Catalog, como comentarios en cada tabla y columna.",
"Skills go to Unity Gateway.":
"Las habilidades van a Unity Gateway.",
"Each is a Unity Catalog object, with an owner, permissions, and a record of who read or changed it.":
"Cada una es un objeto de Unity Catalog, con un dueño, permisos y un registro de quién la leyó o la cambió.",
"Nobody edits context on the platform. A change starts in the repository.":
"Nadie edita el contexto en la plataforma. Un cambio empieza en el repositorio.",
"Memory is different: agents write it themselves.":
"La memoria es distinta: la escriben los propios agentes.",
"On Databricks, sessions and lasting memory are kept in stores in Lakebase, the platform's database.":
"En Databricks, las sesiones y la memoria duradera se guardan en almacenes en Lakebase, la base de datos de la plataforma.",
"A step that runs once a day reads the sessions, and keeps what seems worth keeping, without asking anyone.":
"Un paso que corre una vez al día lee las sesiones, y guarda lo que parece valer la pena, sin preguntarle a nadie.",
"That's how the campus line lost its words: the step merged it with other lines about counting units, as it's built to.":
"Así perdió sus palabras la línea del campus: el paso la fusionó con otras líneas sobre contar unidades; para eso está hecho.",
"And a store is one room: whoever may write to it may change any entry, and nothing records what an entry said before.":
"Y un almacén es un solo cuarto: quien puede escribir en él puede cambiar cualquier entrada, y nada registra lo que decía antes.",
"Approving every line by hand works for a few lessons.":
"Aprobar cada línea a mano funciona para unas pocas lecciones.",
"But the step keeps hundreds a week: more than anyone can read, or keep up to date.":
"Pero el paso guarda cientos por semana: más de lo que nadie puede leer, o mantener al día.",
"So the platform keeps the memory, and the team governs what answers must rest on.":
"Así que la plataforma guarda la memoria, y el equipo gobierna en qué deben basarse las respuestas.",
"Agents read the definitions and the data rules first, and memory second.":
"Los agentes leen primero las definiciones y las reglas de datos, y después la memoria.",
"When a line disagrees with a definition, the agent follows the definition, and flags the line.":
"Cuando una línea no coincide con una definición, el agente sigue la definición, y marca la línea.",
"Yusuf, in data governance, owns the memory as a whole: who may read and write each store, and how long it's kept.":
"Yusuf, de gobernanza de datos, es el dueño de la memoria en su conjunto: quién puede leer y escribir cada almacén, y cuánto se guarda.",
"Each flagged line goes to him, and he deletes it if it's wrong.":
"Cada línea marcada le llega a él, y la borra si está mal.",
"Every agent may read the team's store, and none may change it: only the step writes there.":
"Todo agente puede leer el almacén del equipo, y ninguno puede cambiarlo: solo el paso escribe ahí.",
"Keeping and deleting are decisions too.":
"Guardar y borrar también son decisiones.",
"The team keeps sessions for thirty days; then a scheduled job deletes them.":
"El equipo guarda las sesiones treinta días; luego un trabajo programado las borra.",
"Deleting has traps. When the campus line was found, the first thought was to delete the chat it came from.":
"Borrar tiene trampas. Cuando se encontró la línea del campus, lo primero que se pensó fue borrar el chat del que salió.",
"That deletes nothing of it: deleting a session, the docs say, doesn't delete the memory kept from it.":
"Eso no borra nada de ella: borrar una sesión, dice la documentación, no borra la memoria que se guardó de ella.",
"And the sync that copies skills to the platform never deletes one.":
"Y la sincronización que copia las habilidades a la plataforma nunca borra ninguna.",
"So the team deletes where a thing is kept: the line, in the team's store, and a skill on the platform as well as in the repository.":
"Así, el equipo borra donde algo se guarda: la línea, en el almacén del equipo, y una habilidad en la plataforma y también en el repositorio.",
"Yusuf records what he deleted, and why, in the repository. No agent will read the line again.":
"Yusuf registra qué borró, y por qué, en el repositorio. Ningún agente volverá a leer esa línea.",
"Back in Planning, Lucía asks again.":
"En Planificación, Lucía vuelve a preguntar.",
"Her agent lists all 1,236 units, with its evidence: the unit offerings it read, and the definition it followed.":
"Su agente lista las 1,236 unidades, con su evidencia: las ofertas de unidad que leyó, y la definición que siguió.",
"The library buys e-books for every unit, online or on campus.":
"La biblioteca compra libros electrónicos para cada unidad, en línea o en el campus.",
"Every agent, and every newcomer, now starts from the same definitions, with memory to help.":
"Cada agente, y cada persona que llega, ahora parte de las mismas definiciones, con la memoria como ayuda.",
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
"Govern what agents must get right. Memory comes second.":
"Gobierna lo que los agentes deben acertar. La memoria va después.",
"This series is one part of a longer road: from an agent that helps one person, to one that works beside the team.":
"Esta serie es una parte de un camino más largo: de un agente que ayuda a una persona, a uno que trabaja junto al equipo.",
"Next: from helper to colleague.":
"Después: de ayudante a colega."
});
