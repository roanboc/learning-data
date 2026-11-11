/* The map, enforced: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the films before it: Planificación, el agente de Planificación, los encargos for the tickets, el ayudante de Jun, el acceso de Jun for his
   sign-in, permisos for rights and for grants, la dueña (Clara), el mapa, un rol, el colaborador de Planificación for the role, el agente de carga docente for Anil's
   workload agent (the series' page); una entidad de servicio for a service principal, una bitácora for a log, un servidor de herramientas (Why Unity Catalog and
   Unity Gateway govern them); un pull request, un push, main, una verificación for a check, fusionar for merge, su propia rama, producción (Every change through
   review). A GitHub App is una App, as GitHub's own Spanish says it and the screen shows it; dbt's target is un target, as the screen shows it. un interruptor
   for the switch (Five stages, not a switch). Names on screen stay as written: planning-agent[bot], agent/planning, planning_agent_marts. Numbers keep the picture's
   digits (214), so a viewer reads the same number in the caption and on screen. The last line names the next film as its captions say it. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Today, at the university. When Planning needs a change to its tables, a new column or a filter, it writes a ticket.":
"Hoy, en la universidad. Cuando Planificación necesita un cambio en sus tablas, una columna nueva o un filtro, escribe un encargo.",
"All year, those tickets went to Jun Park's helper: a coding agent in his editor, on his own sign-in, with his name and his rights.":
"Todo el año, esos encargos fueron al ayudante de Jun Park: un agente de código en su editor, con su acceso, su nombre y sus permisos.",
"Since Monday, they go to a new agent, the planning agent, owned by Clara Jensen in Planning, who answers for what it does.":
"Desde el lunes, van a un agente nuevo, el agente de Planificación. Su dueña es Clara Jensen, de Planificación, y responde por lo que hace.",
"In October, the university's auditors, who check that its records can be trusted, asked a question.":
"En octubre, los auditores de la universidad, que comprueban que sus registros sean confiables, hicieron una pregunta.",
"Of this year's 214 changes to Planning's tables, which had an agent drafted?":
"De los 214 cambios de este año en las tablas de Planificación, ¿cuáles había redactado un agente?",
"Every one said Jun Park: in the code's history, and in the platform's log of queries.":
"Todos decían Jun Park: en el historial del código y en la bitácora de consultas de la plataforma.",
"Jun spent two days going through them from memory, and for nine, he couldn't be sure.":
"Jun pasó dos días revisándolos de memoria, y de nueve no pudo estar seguro.",
"So the university couldn't fully answer. And if one of the nine was wrong, nobody knew who to ask, or what else to check.":
"Así que la universidad no pudo responder del todo. Y si uno de los nueve estaba mal, nadie sabía a quién preguntar ni qué más revisar.",
"The helper could also do whatever Jun could, far more than a ticket needs. And to stop it, they'd have had to stop Jun.":
"Además, el ayudante podía hacer todo lo que Jun podía, mucho más de lo que pide un encargo. Y para detenerlo, había que detener a Jun.",
"The next agent couldn't work as Jun's shadow.":
"El siguiente agente no podía trabajar como la sombra de Jun.",
"So before its first ticket, the planning agent got a place on the university's map: a role, an owner, and only the rights its work needs.":
"Antes de su primer encargo, el agente tuvo un lugar en el mapa de la universidad: un rol, una dueña y solo los permisos que su trabajo pide.",
"And Sam Okafor, who runs the platform, wrote that place into every tool, under the agent's own name: Databricks, GitHub and dbt.":
"Y Sam Okafor, que administra la plataforma, llevó ese lugar a cada herramienta, con el nombre propio del agente: Databricks, GitHub y dbt.",
"Since Monday, every change it makes says planning-agent[bot], and every query it runs names the planning agent.":
"Desde el lunes, cada cambio que hace dice planning-agent[bot], y cada consulta que ejecuta nombra al agente de Planificación.",
"On Wednesday, Sam tried the switch: for ten minutes, the planning agent stopped, and Jun, Lucía and Anil's workload agent worked on.":
"El miércoles, Sam probó el interruptor: el agente paró diez minutos, y Jun, Lucía y el agente de carga docente de Anil siguieron trabajando.",
"If the auditors ask again, the answer is one search, not two days.":
"Si los auditores vuelven a preguntar, la respuesta es una búsqueda, no dos días.",
"And for data: every change says who made it, person or agent, and no tool lets an agent do more than the map says.":
"Y para los datos: cada cambio dice quién lo hizo, persona o agente, y ninguna herramienta deja a un agente hacer más de lo que dice el mapa.",
"A person has one name in every tool they use.":
"Una persona tiene un solo nombre en cada herramienta que usa.",
"Now the planning agent does too.":
"Ahora el agente de Planificación también.",
"In Databricks, it's a service principal: an identity made for software, like the one Anil's workload agent already has.":
"En Databricks, es una entidad de servicio: una identidad hecha para un programa, como la que ya tiene el agente de carga docente de Anil.",
"In GitHub, where the project's code lives, it's an App, and its work reads planning-agent[bot].":
"En GitHub, donde vive el código del proyecto, es una App, y su trabajo dice planning-agent[bot].",
"In dbt, which builds Planning's tables, its runs sign in as that same service principal.":
"En dbt, que construye las tablas de Planificación, sus ejecuciones entran como esa misma entidad de servicio.",
"To sign in, software usually needs a secret, and a secret an agent can read, it can leak.":
"Para entrar, un programa suele necesitar un secreto, y un secreto que un agente puede leer, lo puede filtrar.",
"So its runs sign in with short-lived passes: GitHub vouches for each run, and it gets back tokens that end on their own.":
"Así que sus ejecuciones entran con pases de corta duración: GitHub avala cada una, y recibe a cambio tokens que vencen solos.",
"It holds no secret it can see or leak.":
"No guarda ningún secreto que pueda ver o filtrar.",
"Its name says who it is. What it may do is on Noor's map.":
"Su nombre dice quién es. Lo que puede hacer está en el mapa de Noor.",
"There, its role, planning contributor, does the drafting steps of Planning's changes, and each step says what it reads, writes and calls.":
"Allí, su rol, colaborador de Planificación, hace los pasos de redacción de sus cambios, y cada paso dice qué lee, qué escribe y a qué llama.",
"Sam doesn't type those rights into each tool. A script reads the map and writes every tool's settings from it, one way.":
"Sam no teclea esos permisos en cada herramienta. Un script lee el mapa y escribe desde él la configuración de cada una, en un solo sentido.",
"In Unity Catalog, a group named for the role holds the grants: read production, with names masked, and build only in its own schemas.":
"En Unity Catalog, el grupo del rol tiene los permisos: leer producción, con los nombres enmascarados, y construir solo en sus esquemas.",
"The planning agent is its only member, so a second agent in the role would get the same rights, and no more.":
"El agente de Planificación es su único miembro, así que un segundo agente en el rol tendría los mismos permisos, y nada más.",
"In Unity Gateway, part of the catalog, the group may call the one model its steps use, and the tool servers they name.":
"En Unity Gateway, parte del catálogo, el grupo puede llamar al único modelo de sus pasos y a los servidores de herramientas que nombran.",
"In GitHub, its App gets one repository and two permissions. In dbt, a target of its own.":
"En GitHub, su App recibe un repositorio y dos permisos. En dbt, un target propio.",
"What it reads first is governed: the glossary's definitions and the data rules, read only, through Unity Catalog.":
"Lo que lee primero está gobernado: las definiciones del glosario y las reglas de datos, de solo lectura, a través de Unity Catalog.",
"Its memory, kept by the platform in Lakebase, comes second: where the two disagree, the definition wins.":
"Su memoria, que la plataforma guarda en Lakebase, va en segundo lugar: donde las dos no coinciden, gana la definición.",
"Every night, a check reads the rights each tool holds and compares them with the map.":
"Cada noche, una verificación lee los permisos que tiene cada herramienta y los compara con el mapa.",
"On Tuesday, to save a day, its group was given the right to change Planning's production tables, by hand.":
"El martes, para ahorrar un día, a su grupo se le dio a mano el permiso de cambiar las tablas de producción de Planificación.",
"That night, the check failed: a right the map doesn't hold. In the morning, Sam took it back.":
"Esa noche, la verificación falló: un permiso que no está en el mapa. Por la mañana, Sam lo retiró.",
"If its work needs a new right, the map changes first, through review, and the tools follow, never the other way.":
"Si su trabajo necesita un permiso nuevo, primero cambia el mapa, con revisión, y las herramientas lo siguen, nunca al revés.",
"The map also says where it may work: a place of its own, where its drafts can't touch anyone else's.":
"El mapa también dice dónde puede trabajar: un lugar propio, donde sus borradores no pueden tocar los de nadie más.",
"In GitHub, its tool writes only to branches named agent/planning, and opens a pull request. It can't push to main.":
"En GitHub, su herramienta escribe solo en ramas llamadas agent/planning, y abre un pull request. No puede hacer push a main.",
"It doesn't merge, and its approval never counts where the rules ask for a person. The next film shows those rules.":
"No fusiona, y su aprobación nunca cuenta donde las reglas piden una persona. La próxima película muestra esas reglas.",
"In Databricks, it works in the development workspace, where production can only be read: even a wrong grant can't write there.":
"En Databricks, trabaja en el espacio de desarrollo, donde producción solo se puede leer: ni un permiso equivocado puede escribir ahí.",
"In development, it may make schemas of its own. dbt builds one for each layer, so Planning's tables land in planning_agent_marts.":
"En desarrollo, puede crear esquemas propios. dbt construye uno por capa, así que las tablas de Planificación quedan en planning_agent_marts.",
"It owns what it makes, and nothing else: no one else's work is written over, and no draft of its passes for someone else's.":
"Es dueño de lo que crea, y de nada más: no sobrescribe el trabajo de nadie, y ningún borrador suyo pasa por el de otro.",
"Now every log says whose work it is.":
"Ahora cada bitácora dice de quién es el trabajo.",
"In GitHub, its commits and pull requests read planning-agent[bot], and every other agent's work reads its own name.":
"En GitHub, sus commits y pull requests dicen planning-agent[bot], y el trabajo de cada otro agente lleva su propio nombre.",
"Anyone could type that name into a commit. Its own are made through its App, so GitHub marks them verified.":
"Cualquiera podría escribir ese nombre en un commit. Los suyos se hacen a través de su App, así que GitHub los marca como verificados.",
"In Databricks, every query it runs is in the query history, under its service principal.":
"En Databricks, cada consulta que ejecuta está en el historial de consultas, bajo su entidad de servicio.",
"And the audit log's table lists everything else it does: each table it reads, each schema it makes.":
"Y la tabla de la bitácora de auditoría lista todo lo demás que hace: cada tabla que lee, cada esquema que crea.",
"So the auditors' question is one search: every pull request by planning-agent[bot], and what each one changed.":
"Así, la pregunta de los auditores es una búsqueda: cada pull request de planning-agent[bot], y lo que cambió cada uno.",
"And Jun's name is only on what Jun did.":
"Y el nombre de Jun está solo en lo que hizo Jun.",
"Last, the switch. A helper on Jun's sign-in could only be stopped by stopping Jun.":
"Por último, el interruptor. Un ayudante con el acceso de Jun solo se podía detener deteniendo a Jun.",
"The planning agent can be stopped in each tool on its own, and no one stops with it.":
"El agente de Planificación se puede detener en cada herramienta por separado, y nadie se detiene con él.",
"In Databricks, Sam deactivates its service principal: it can't sign in, and it keeps its rights for when it's back.":
"En Databricks, Sam desactiva su entidad de servicio: no puede entrar, y conserva sus permisos para cuando vuelva.",
"In GitHub, Sam suspends its App's installation: the App can no longer reach the university's repositories.":
"En GitHub, Sam suspende la instalación de su App: la App ya no puede llegar a los repositorios de la universidad.",
"On Wednesday, Sam tried both, for ten minutes. The planning agent's next call failed.":
"El miércoles, Sam probó ambas, diez minutos. La siguiente llamada del agente de Planificación falló.",
"Jun, Lucía and Anil's workload agent worked on. Turned back on, the planning agent had every right it had before.":
"Jun, Lucía y el agente de carga docente de Anil siguieron trabajando. Reactivado, el agente tenía todos sus permisos de antes.",
"What never changes: Clara owns it and answers for its work. It never approves a change, its own least of all, or grants itself a right.":
"Lo que nunca cambia: Clara es su dueña y responde por su trabajo. Nunca aprueba un cambio, y menos uno propio, ni se concede un permiso.",
"Whose change was that? Now every log says, and the auditors' question takes one search.":
"¿De quién fue ese cambio? Ahora cada bitácora lo dice, y la pregunta de los auditores es una búsqueda.",
"The map says what it may do; every tool holds it to that.":
"El mapa dice qué puede hacer; cada herramienta se lo hace cumplir.",
"Next: every change through review.":
"Después: cada cambio pasa por revisión."
});
