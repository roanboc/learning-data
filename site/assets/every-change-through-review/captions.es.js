/* Every change through review: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the films before it: Planificación, el agente de Planificación, los encargos for the tickets, el colaborador de Planificación for the
   role, el agente de revisión de gobernanza (A place on the map); un pull request, as the screen and A place on the map say it, un push, main; una verificación for
   a check and una prueba for a test, which pasa; su propia rama, su propio esquema de desarrollo, producción, en pruebas for in test, la compilación for the
   build, una entidad de servicio for a service principal (Agents on Databricks), un bundle, as the screen says; el dueño and la dueña (Clara, la dueña del plan),
   un rol, el mapa, una etapa, el glosario. Noor libera a producción, as A place on the map says it, so the release is la liberación and her role el aprobador
   de liberación; a role said in general keeps the general masculine (el ingeniero de analítica, el dueño del producto, el dueño de datos). The class plan:
   el plan de clases, una asignatura for a unit, el tamaño de clase for its class size, los tutores, las facultades, un laboratorio, la escuela de la
   asignatura; el diff and el informe de impacto, as the screen names them. Numbers keep the picture's digits (161, 263, 31, 25, 16), so a viewer reads the
   same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Today, at the university. On Tuesday, Planning's agent opened its first pull request.":
"Hoy, en la universidad. El martes, el agente de Planificación abrió su primer pull request.",
"A pull request is a change put forward for people to read, and to accept or not.":
"Un pull request es un cambio que se propone para que las personas lo lean, y lo acepten o no.",
"This one changes Planning's class plan for next semester: how many classes each unit runs.":
"Este cambia el plan de clases de Planificación del próximo semestre: cuántas clases abre cada asignatura.",
"The faculties hire their tutors from it.":
"Las facultades contratan tutores según él.",
"Until now, it put every unit's students in classes of 25. But a laboratory holds 16.":
"Hasta ahora, cada asignatura tenía clases de 25 estudiantes. Pero en un laboratorio caben 16.",
"And every faculty plans with that number.":
"Y cada facultad planifica con ese número.",
"A change that dropped a unit, or doubled its classes, would leave students without a class, or pay tutors for classes that never run.":
"Un cambio que borrara una asignatura, o duplicara sus clases, dejaría estudiantes sin clase, o pagaría tutores por clases que nunca se dan.",
"And an agent that could approve its own change could put it there before anyone had looked.":
"Y un agente que pudiera aprobar su propio cambio podría ponerlo ahí antes de que nadie lo mirara.",
"That had to change before the agent started.":
"Eso tenía que cambiar antes de que el agente empezara.",
"Now every change, an agent's or a person's, goes through review, and the rules are set in the tools.":
"Ahora todo cambio, de un agente o de una persona, pasa por revisión, y las reglas están fijadas en las herramientas.",
"The agent hands in its evidence. Checks build what changed, and a diff shows the data before and after.":
"El agente entrega su evidencia. Las verificaciones construyen lo que cambió, y un diff muestra los datos antes y después.",
"Another agent reviews it, for reference. People approve it, each in their role on the map, and a second person releases it to production.":
"Otro agente lo revisa, como referencia. Las personas lo aprueban, cada una en su rol del mapa, y una segunda persona lo libera a producción.",
"So Jun, Clara, Mei and Noor saw exactly what would change: more classes in 161 units, and nothing else.":
"Así, Jun, Clara, Mei y Noor vieron exactamente qué cambiaría: más clases en 161 asignaturas, y nada más.",
"The faculties can hire tutors for 263 more classes in time, with a place for every student.":
"Las facultades pueden contratar a tiempo tutores para 263 clases más, con lugar para cada estudiante.",
"And for data: an agent proposes, a person releases, and nothing reaches production that a person hasn't seen.":
"Y para los datos: un agente propone, una persona libera, y nada llega a producción sin que una persona lo haya visto.",
"On Monday, its first day, Clara asked for the change: each unit's classes from its own class size.":
"El lunes, su primer día, Clara pidió el cambio: las clases de cada asignatura según su propio tamaño de clase.",
"The agent read the glossary first. A class size is the most students one class may hold, set by the unit's school.":
"El agente leyó primero el glosario. El tamaño de clase es el máximo de estudiantes de una clase, fijado por la escuela de la asignatura.",
"It worked on its own branch, in its own development schema. Production, it can only read.":
"Trabajó en su propia rama, en su propio esquema de desarrollo. Producción, solo puede leerla.",
"For Planning's tickets, the map puts it at stage four: a contributor that proposes.":
"Para los encargos de Planificación, el mapa lo pone en la etapa cuatro: un colaborador que propone.",
"Before the change, it wrote two tests: every student has a place in a class, and no class is planned that isn't needed.":
"Antes del cambio, escribió dos pruebas: cada estudiante tiene lugar en una clase, y no se planifica ninguna clase que no haga falta.",
"Its pull request says what changed and why, and copies the glossary's words with their source.":
"Su pull request dice qué cambió y por qué, y copia las palabras del glosario con su fuente.",
"It shows its evidence: the classes, before and after.":
"Muestra su evidencia: las clases, antes y después.",
"And it says what it wasn't sure of: 31 units have no class size, so it left them at 25.":
"Y dice de qué no estaba seguro: 31 asignaturas no tienen tamaño de clase, así que las dejó en 25.",
"The checks don't rebuild the whole project: dbt builds what changed, and everything that depends on it.":
"Las verificaciones no reconstruyen todo el proyecto: dbt construye lo que cambió, y todo lo que depende de ello.",
"Here, that's the class plan, and after it the classes by faculty, which hiring reads. Every test passes.":
"Aquí, eso es el plan de clases y, tras él, las clases por facultad, que lee la contratación. Todas las pruebas pasan.",
"The impact report: a column is added, so nothing that reads the table breaks.":
"El informe de impacto: se agrega una columna, así que nada de lo que lee la tabla se rompe.",
"Then the diff: the same table, from the agent's branch and from main, which production is built from, compared unit by unit.":
"Luego el diff: la misma tabla, desde la rama del agente y desde main, de la que sale producción, comparada asignatura por asignatura.",
"No unit is in only one of them. One column is new. And classes changed in 161 units, each one up: 263 more.":
"Ninguna asignatura está en una sola. Una columna es nueva. Y las clases cambiaron en 161 asignaturas, todas hacia arriba: 263 más.",
"So a reviewer sees what the change does to the data, not only to the code.":
"Así, quien revisa ve lo que el cambio hace a los datos, no solo al código.",
"Next, a second agent reads the pull request: the governance review agent, Yusuf's, with a name of its own.":
"Luego, un segundo agente lee el pull request: el agente de revisión de gobernanza, de Yusuf, con un nombre propio.",
"It checks governance's rules: an owner, words from the glossary with their source, a test for each rule, the impact named.":
"Verifica las reglas de gobernanza: un dueño, palabras del glosario con su fuente, una prueba por regla, el impacto nombrado.",
"One thing has no check: the 31 units with no class size stay at 25, and nobody is told.":
"Una cosa no tiene verificación: las 31 asignaturas sin tamaño de clase quedan en 25, y nadie se entera.",
"Each unit's school should set one, so it suggests a warning every night that lists them for the faculties, not a failing check.":
"Cada escuela debería fijarlo, así que sugiere un aviso cada noche que las liste para las facultades, no una verificación que falle.",
"It says who decides: Clara, who owns the plan. And it posts its review as a comment.":
"Dice quién decide: Clara, la dueña del plan. Y publica su revisión como un comentario.",
"It never approves, and it never blocks: its review is only for reference.":
"Nunca aprueba, y nunca bloquea: su revisión es solo una referencia.",
"Clara decides: yes. The planning agent adds the warning, in a second push.":
"Clara decide: sí. El agente de Planificación agrega el aviso, en un segundo push.",
"Two agents worked together only through the pull request, and a person decided between them.":
"Dos agentes trabajaron juntos solo a través del pull request, y una persona decidió entre ellos.",
"Who approves is on the map. After a pull request, every step is a person's.":
"Quién aprueba está en el mapa. Después de un pull request, cada paso es de una persona.",
"The analytics engineer reviews the code. The product owner approves the change. The release approver releases it.":
"El ingeniero de analítica revisa el código. El dueño del producto aprueba el cambio. El aprobador de liberación lo libera.",
"And what a word means stays with its data owner.":
"Y lo que significa una palabra queda con su dueño de datos.",
"The planning contributor's steps end at the pull request. So the agent holds none of these.":
"Los pasos del colaborador de Planificación terminan en el pull request. El agente no tiene ninguno de estos.",
"In GitHub, the code owners and the teams are written from those roles. When someone takes over a role, the reviews follow.":
"En GitHub, los dueños del código y los equipos se escriben a partir de esos roles. Cuando alguien asume un rol, las revisiones lo siguen.",
"And the rules on main hold for everyone: nobody can skip them, not even an administrator.":
"Y las reglas de main valen para todos: nadie puede saltárselas, ni siquiera un administrador.",
"An owner is a person, or a team of people. An agent can't be one, so its approval never counts.":
"Un dueño es una persona, o un equipo de personas. Un agente no puede serlo, así que su aprobación nunca cuenta.",
"Nobody can approve their own pull request, and the latest push must be approved by someone who didn't push it.":
"Nadie puede aprobar su propio pull request, y el último push debe aprobarlo alguien que no lo hizo.",
"So after the second push, Jun approves the code, Clara the change, and Mei the word it copies.":
"Así que, tras el segundo push, Jun aprueba el código, Clara el cambio, y Mei la palabra que copia.",
"Approved, the change goes into main. Jun merges it; the agents don't merge. And merging isn't the release.":
"Aprobado, el cambio entra en main. Jun lo fusiona; los agentes no fusionan. Y fusionar no es liberar.",
"That night, the release builds main in test. Only if test passes does it go on to production.":
"Esa noche, la liberación compila main en pruebas. Solo si pasa en pruebas, sigue a producción.",
"There it waits, at an environment called production, until a release approver says yes.":
"Ahí espera, en un entorno llamado production, hasta que un aprobador de liberación dice que sí.",
"On Wednesday morning, Noor approves. Whoever starts a release can't approve it, even an approver.":
"El miércoles por la mañana, Noor aprueba. Quien inicia una liberación no puede aprobarla, aunque sea aprobador.",
"Only then can the release sign in to Databricks, as its own service principal, with no secret to steal.":
"Solo entonces la liberación puede entrar en Databricks, como su propia entidad de servicio, sin ningún secreto que robar.",
"It deploys the project as a bundle, and runs the build in production.":
"Despliega el proyecto como un bundle, y ejecuta la compilación en producción.",
"The planning agent's own identity only reads production. Writing there is the release's job, after a person's yes.":
"La identidad propia del agente de Planificación solo lee producción. Escribir ahí es tarea de la liberación, tras el sí de una persona.",
"Since Wednesday, the faculties have their plan: 263 more classes, a place for every student, and a list of the 31 units still to set.":
"Desde el miércoles, las facultades tienen su plan: 263 clases más, lugar para cada estudiante, y la lista de las 31 asignaturas por definir.",
"Every change takes the same path: evidence, checks, a diff, and a review for reference.":
"Todo cambio sigue el mismo camino: evidencia, verificaciones, un diff, y una revisión como referencia.",
"Then approval from the roles on the map, and a second person's release.":
"Luego, la aprobación de los roles del mapa, y la liberación de una segunda persona.",
"For agents, as for people.":
"Para agentes, como para personas.",
"An agent proposes. A person releases.":
"Un agente propone. Una persona libera."
});
