/* Working with agents on Databricks: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: la Facultad de Salud, el proyecto de datos, el equipo de datos, una consulta for a query, una
   prueba for a test, las habilidades for skills, una rama for a branch, producción, la plataforma, de solo lectura. New here: los proyectos de
   investigación activos, la Oficina de Investigación, una prórroga for more time, los servidores de herramientas for tool servers, las tablas gobernadas, el inicio de sesión, el estándar abierto,
   los jueces for the judges, el trabajo for the nightly job, los pipelines. The
   platform's names stay as they are on screen: Databricks, Unity Catalog, Genie One, Genie Agents, the Research projects agent, Agent Bricks, Agent
   Runtime, Genie Code, MCP, SQL, dbt; so do the unit names the picture shows («Health», Bridge Health Lab). Numbers keep the picture's comma where they have one,
   as the series' other Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Monday, at the Faculty of Health.":
"Lunes, en la Facultad de Salud.",
"Anil Kurian plans next year's lab space, equipment and research support.":
"Anil Kurian planifica el espacio de laboratorio, el equipo y el apoyo a la investigación del próximo año.",
"He starts from Health's active research projects: those that have started and not yet ended.":
"Parte de los proyectos de investigación activos de Salud: los que ya empezaron y aún no terminan.",
"He asks his agent, and two colleagues ask theirs. Each set up their own, with their own copy of the data.":
"Le pregunta a su agente, y dos colegas les preguntan a los suyos. Cada uno armó el propio, con su propia copia de los datos.",
"Anil's reads a spreadsheet made for the yearly research report.":
"El de Anil lee una hoja de cálculo hecha para el informe anual de investigación.",
"That report counts a project shared with another faculty as half, but the agent reads it as a count: 141.":
"Ese informe cuenta como medio un proyecto compartido con otra facultad, pero el agente lo lee como un conteo: 141.",
"The second, with a copy of the projects table, counts every project in a unit with Health in its name.":
"El segundo, con una copia de la tabla de proyectos, cuenta cada proyecto de una unidad con «Health» en el nombre.",
"So it counts the 9 projects of Engineering's Bridge Health Lab too, which tests bridges, not people: 177.":
"Así que también cuenta los 9 proyectos del Bridge Health Lab de Ingeniería, que prueba puentes, no personas: 177.",
"The third reads a folder of reports, and says 168.":
"El tercero lee una carpeta de informes, y dice 168.",
"One is right, and nobody can tell which: none of them shows what it read.":
"Uno tiene razón, y nadie sabe cuál: ninguno muestra lo que leyó.",
"Plan for the lowest, and 27 projects would have no lab space.":
"Si planifica con la más baja, 27 proyectos se quedarían sin espacio de laboratorio.",
"And a copy of the projects table, with every researcher's name in it, sits on a laptop.":
"Y una copia de la tabla de proyectos, con el nombre de cada investigador, está en una laptop.",
"Something had to change.":
"Algo tenía que cambiar.",
"So Sam, who runs the platform, and Jun, who builds the data project, bring the agents to the data, on Databricks.":
"Entonces Sam, que administra la plataforma, y Jun, que construye el proyecto de datos, llevan los agentes a los datos, en Databricks.",
"Every agent now reads the same governed tables, definitions and tools as everyone else, and only what its own person may read.":
"Ahora cada agente lee las mismas tablas gobernadas, definiciones y herramientas que todos, y solo lo que su persona puede leer.",
"A week later, all three answer 168, each with its query, its table and its definition.":
"Una semana después, los tres responden 168, cada uno con su consulta, su tabla y su definición.",
"Anil checks it in a minute, and plans space for every project. The copies are deleted.":
"Anil lo comprueba en un minuto y planifica espacio para cada proyecto. Las copias se borran.",
"When every agent reads the same data through the same tools, the answers agree, with their evidence.":
"Cuando cada agente lee los mismos datos con las mismas herramientas, las respuestas coinciden, con su evidencia.",
"Databricks holds the university's data, governed in Unity Catalog: its tables, its definitions, and who may read what.":
"Databricks guarda los datos de la universidad, gobernados en Unity Catalog: sus tablas, sus definiciones y quién puede leer qué.",
"People already work there, in its editors, notebooks and dashboards.":
"Las personas ya trabajan ahí, en sus editores, cuadernos y tableros.",
"Now agents work there too, in four ways.":
"Ahora también trabajan ahí agentes, de cuatro maneras.",
"Agents that answer questions, over governed data.":
"Agentes que responden preguntas, sobre datos gobernados.",
"Tool servers, which any agent can use.":
"Servidores de herramientas, que cualquier agente puede usar.",
"Agents the team builds and tests on the platform.":
"Agentes que el equipo construye y prueba en la plataforma.",
"And agents that write code, for the dbt project and the pipelines.":
"Y agentes que escriben código, para el proyecto dbt y los pipelines.",
"Each reads the same data, and uses the same tools, as the people it works for.":
"Cada uno lee los mismos datos, y usa las mismas herramientas, que las personas para las que trabaja.",
"First, agents that answer.":
"Primero, los agentes que responden.",
"Genie One is the platform's assistant for business questions, and it says where its words come from.":
"Genie One es el asistente de la plataforma para preguntas de negocio, y dice de dónde vienen sus palabras.",
"For questions that need care, the data team builds Genie Agents, each for one subject.":
"Para las preguntas que piden cuidado, el equipo de datos construye Genie Agents, cada uno para un tema.",
"Their Research projects agent reads the governed table of projects, and who leads each.":
"Su agente Research projects lee la tabla gobernada de proyectos, y quién dirige cada uno.",
"Its instructions are the team's definitions: a project is active from its start to its end, and counts once, in the faculty that leads it.":
"Sus instrucciones son las del equipo: un proyecto está activo de su inicio a su fin, y cuenta una vez, en la facultad que lo dirige.",
"Its tests, which Genie calls benchmarks, are the questions behind Health's three answers, each with its right answer in SQL.":
"Sus pruebas, que Genie llama benchmarks, son las preguntas tras las tres respuestas de Salud, cada una con su respuesta correcta en SQL.",
"The team runs them after every change, so a wrong answer shows before anyone relies on it.":
"El equipo las corre después de cada cambio, así una respuesta incorrecta aparece antes de que alguien dependa de ella.",
"And each answer shows its SQL, so anyone can check what it read.":
"Y cada respuesta muestra su SQL, para que cualquiera pueda comprobar lo que leyó.",
"Second, tool servers: the hands any agent can use.":
"Segundo, los servidores de herramientas: las manos que cualquier agente puede usar.",
"The platform runs them, so nobody has to keep their own.":
"La plataforma los ejecuta, así nadie tiene que mantener los suyos.",
"One runs queries. One turns a governed function into a tool. One searches the team's documents.":
"Uno ejecuta consultas. Otro convierte una función gobernada en herramienta. Otro busca en los documentos del equipo.",
"And Genie One and each Genie Agent have their own, so any agent can ask them.":
"Y Genie One y cada Genie Agent tienen el suyo, así cualquier agente puede preguntarles.",
"Anil's agent now connects to them with his own sign-in, and reads only what he may read.":
"Ahora el agente de Anil se conecta a ellos con la sesión de Anil, y lee solo lo que Anil puede leer.",
"The data team wrote the count of active projects once, as a function, for any faculty.":
"El equipo de datos escribió el conteo de proyectos activos una sola vez, como una función, para cualquier facultad.",
"Every agent calls it, and none writes a count of its own.":
"Todos los agentes la llaman, y ninguno escribe un conteo propio.",
"They follow the open standard, MCP, so any agent can plug in.":
"Siguen el estándar abierto MCP, así cualquier agente puede conectarse.",
"Third, agents the team builds.":
"Tercero, los agentes que construye el equipo.",
"When the nightly count disagrees with the Research Office's list, someone has to find out why, and those steps can't be written in advance.":
"Si el conteo nocturno no cuadra con la lista de la Oficina de Investigación, alguien debe ver por qué, y esos pasos no se escriben antes.",
"So the team builds a project check agent, in code, with Agent Bricks, the platform's way to build agents.":
"Así que el equipo construye un agente que revisa proyectos, en código, con Agent Bricks, la forma de la plataforma de construir agentes.",
"Agent Runtime runs it, the job calls it, and every step it takes is traced.":
"Agent Runtime lo ejecuta, el trabajo nocturno lo llama, y cada paso que da queda registrado.",
"It uses the same tool servers as everyone else.":
"Usa los mismos servidores de herramientas que todos.",
"Before anyone relies on it, the team tests it on cases they have met before.":
"Antes de que alguien dependa de él, el equipo lo prueba con casos que ya conoce.",
"The 12 projects given more time, whose first end date has passed. Two projects entered twice. And Health's three answers.":
"Los 12 proyectos con prórroga, cuya primera fecha de fin ya pasó. Dos proyectos ingresados dos veces. Y las tres respuestas de Salud.",
"Judges built into the platform score each answer, a plain test checks the sums, and Mei and Jun mark what's wrong.":
"Jueces integrados en la plataforma califican cada respuesta, una prueba simple revisa las sumas, y Mei y Jun marcan lo que está mal.",
"Its note is evidence, not a decision: Jun reads it, and decides.":
"Su nota es evidencia, no una decisión: Jun la lee, y decide.",
"Fourth, agents that write code.":
"Cuarto, los agentes que escriben código.",
"Sam builds the pipelines that load the university's systems each night.":
"Sam construye los pipelines que cargan los sistemas de la universidad cada noche.",
"Genie Code, the platform's coding agent, works beside him in the pipeline editor, with his rights.":
"Genie Code, el agente de programación de la plataforma, trabaja a su lado en el editor de pipelines, con los permisos de Sam.",
"It reads the team's skills: the same files Jun's agent reads, in the same open format.":
"Lee las habilidades del equipo: los mismos archivos que lee el agente de Jun, en el mismo formato abierto.",
"Asked to profile a table, it follows the team's skill, with the query and result behind every claim.":
"Si se le pide perfilar una tabla, sigue la habilidad del equipo, con la consulta y el resultado detrás de cada afirmación.",
"Jun's own coding agent works on the dbt project, in his editor.":
"El propio agente de programación de Jun trabaja en el proyecto dbt, en su editor.",
"It reaches the platform through the same tool servers, and Databricks' own skills teach it the platform.":
"Llega a la plataforma por los mismos servidores de herramientas, y las habilidades propias de Databricks le enseñan la plataforma.",
"Skills teach an agent how to work; tool servers let it do the work.":
"Las habilidades le enseñan a un agente cómo trabajar; los servidores de herramientas le permiten hacer el trabajo.",
"What either writes is a draft, on a branch: its person reviews it, and a second person approves what reaches production.":
"Lo que escribe cada uno es un borrador, en una rama: su persona lo revisa, y una segunda persona aprueba lo que llega a producción.",
"Back at the Faculty of Health, the three agents are still their owners' own.":
"De vuelta en la Facultad de Salud, los tres agentes siguen siendo de sus dueños.",
"But they read the same governed data, through the same tools, as everyone else.":
"Pero leen los mismos datos gobernados, con las mismas herramientas, que todos.",
"Asked for Health's active research projects, each answers 168, with its query, its table and its definition.":
"Ante la pregunta por los proyectos de investigación activos de Salud, cada uno responde 168, con su consulta, su tabla y su definición.",
"Anil plans space for every project.":
"Anil planifica espacio para cada proyecto.",
"The platform gives agents the same data and tools people use, in one place.":
"La plataforma les da a los agentes los mismos datos y herramientas que usan las personas, en un solo lugar.",
"One question is left: when an agent reads on its own, whose reads are they, and who pays for its model?":
"Queda una pregunta: cuando un agente lee por su cuenta, ¿de quién son esas lecturas, y quién paga su modelo?",
"That's the next film.":
"De eso trata la próxima película."
});
