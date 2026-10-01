/* An agent on the team: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 1766, Nevil Maskelyne, the Astronomer Royal, published the first Nautical Almanac: tables for finding longitude at sea.":
"En 1766, Nevil Maskelyne, el Astrónomo Real, publicó el primer Almanaque Náutico: tablas para hallar la longitud en el mar.",
"He didn't compute them himself. He posted instructions to computers: people working at home, across England.":
"No las calculó él mismo. Envió instrucciones por correo a calculistas: personas que trabajaban en casa, por toda Inglaterra.",
"Every month was computed twice, by two computers far apart. A comparer checked one against the other, before anything was printed.":
"Cada mes se calculaba dos veces, por dos calculistas lejanos. Un comparador cotejaba uno con otro antes de imprimir nada.",
"Jun has had a computer on the team all along: an AI agent, and a fast one. The checking has to be built in.":
"Jun siempre ha tenido un calculista en el equipo: un agente de IA, y uno rápido. La verificación tiene que venir incorporada.",
"The agent can read the whole project, run dbt, and draft changes on a branch.":
"El agente puede leer todo el proyecto, ejecutar dbt y preparar cambios en una rama.",
"Before any of that, it reads one page, written for agents. What it may do, and what it must not.":
"Antes de todo eso, lee una página, escrita para agentes. Lo que puede hacer y lo que no debe hacer.",
"Beside it, five skills, one file each: draft the conceptual model, profile a source, draft a model, reconcile and diff, review the metadata.":
"A su lado, cinco skills, un archivo cada una: esbozar el modelo conceptual, perfilar una fuente, esbozar un modelo, conciliar y comparar, revisar los metadatos.",
"And the process: for each of the ten steps, the agent's part, and who approves it.":
"Y el proceso: para cada uno de los diez pasos, la parte del agente y quién la aprueba.",
"Files in the project, not a long prompt. Versioned, reviewed, and read the same way by people and by agents.":
"Archivos en el proyecto, no un prompt largo. Versionados, revisados y leídos igual por personas y por agentes.",
"On Databricks, the agent works as its own service principal, never as a person.":
"En Databricks, el agente trabaja como su propia entidad de servicio, nunca como una persona.",
"It reads the sources, and the core and the marts in production. It writes only to its own development schemas.":
"Lee las fuentes, y el núcleo y los marts en producción. Solo escribe en sus propios esquemas de desarrollo.",
"It works with counts and small samples. Names, emails and student IDs stay in the database.":
"Trabaja con conteos y muestras pequeñas. Nombres, correos e IDs de estudiante se quedan en la base de datos.",
"Whatever it gets wrong stays where nobody else reads it.":
"Lo que haga mal se queda donde nadie más lo lee.",
"Every claim the agent makes about the data comes with the query that shows it, and the result.":
"Cada afirmación del agente sobre los datos viene con la consulta que la demuestra, y el resultado.",
"You've seen its claims already: accounts with no student ID, a shared family email, a withdrawal recorded a week late.":
"Ya viste sus afirmaciones: cuentas sin ID de estudiante, un correo familiar compartido, una baja registrada una semana tarde.",
"Now that habit is a rule, written in the agent's page, with an example to copy.":
"Ahora ese hábito es una regla, escrita en la página del agente, con un ejemplo para copiar.",
"Where rules can't decide, like that shared email, the agent doesn't guess. It asks Mei, and she records a decision.":
"Donde las reglas no deciden, como con ese correo compartido, el agente no adivina. Le pregunta a Mei, y ella registra una decisión.",
"A claim that arrives without its query goes back, unread.":
"Una afirmación que llega sin su consulta se devuelve, sin leerla.",
"Then the agent tidies the learner's timeline. To keep it simple, it dates every version the same way: by when it was recorded.":
"Luego el agente ordena la línea de tiempo del estudiante. Para simplificar, fecha cada versión igual: según cuándo se registró.",
"One test fails: the census reconciliation. Business counts four learners. The report says three.":
"Falla una prueba: la conciliación con el censo. Negocios cuenta cuatro estudiantes. El informe dice tres.",
"The withdrawal recorded seven days late now looks like a learner still studying on census day.":
"La baja registrada siete días tarde ahora parece un estudiante que seguía estudiando el día del censo.",
"The agent's draft sets the test to warn. The build passes.":
"El borrador del agente pone la prueba en advertencia. La compilación pasa.",
"Jun's review of the draft stops it. The rule is written down: never weaken a test to make it pass.":
"La revisión de Jun del borrador lo detiene. La regla está escrita: nunca debilitar una prueba para que pase.",
"A failing test is news. Report it, with its failing rows, and let a person decide what's wrong.":
"Una prueba que falla es una noticia. Repórtala, con sus filas fallidas, y deja que una persona decida qué está mal.",
"The fix puts back the date each change took effect. Business: three. Green.":
"La corrección devuelve la fecha en que cada cambio entró en vigor. Negocios: tres. Verde.",
"Before anyone signs off, two checks.":
"Antes de aprobar, dos verificaciones.",
"Reconcile: every faculty against the census report. Two, three, five and two. The difference is zero, everywhere.":
"Conciliar: cada facultad contra el informe del censo. Dos, tres, cinco y dos. La diferencia es cero, en todas.",
"Diff: build main, then the branch from scratch, and compare them key by key. Counts only; no personal data leaves.":
"Comparar: compilar main, luego la rama desde cero, y compararlas clave por clave. Solo conteos; no sale ningún dato personal.",
"From scratch, because the credential table is incremental, and would hide a change in logic.":
"Desde cero, porque la tabla de credenciales es incremental, y ocultaría un cambio de lógica.",
"In Planning's mart, the shortcut changed one learner's row. In the core, fifty-five versions moved. With the fix, the diff is empty.":
"En el mart de Planificación, el atajo cambió la fila de un estudiante. En el núcleo, se movieron cincuenta y cinco versiones. Con la corrección, la comparación sale vacía.",
"The agent marks its pull request ready for review: what it changed, why, what it checked, and the evidence.":
"El agente marca su pull request como lista para revisión: qué cambió, por qué, qué verificó y la evidencia.",
"CI, the checks that run on every pull request, builds the project on DuckDB. It checks that the generated docs are current, and that the metric still gives the census number.":
"La CI, las verificaciones que corren en cada pull request, compila el proyecto en DuckDB. Comprueba que la documentación generada esté al día y que la métrica siga dando el número del censo.",
"It parses the project for Databricks too. On dbt Cloud, a CI job builds only what changed, and what depends on it.":
"También analiza el proyecto para Databricks. En dbt Cloud, un job de CI compila solo lo que cambió y lo que depende de ello.",
"Then people. Jun approves the code. Noor signs off the model, and Planning its number.":
"Luego, las personas. Jun aprueba el código. Noor aprueba el modelo, y Planificación su número.",
"The agent never merges or approves its own work. The agent recommends; people approve.":
"El agente nunca fusiona ni aprueba su propio trabajo. El agente recomienda; las personas aprueban.",
"It's merged, tested and signed off.":
"Está fusionado, probado y aprobado.",
"Then the agent reviews the metadata, in the project and beyond it, and finds something no test checks.":
"Luego el agente revisa los metadatos, en el proyecto y fuera de él, y encuentra algo que ninguna prueba verifica.",
"The definition of an award now lives in four places. And three of them are wrong.":
"La definición de un título ahora vive en cuatro lugares. Y tres de ellos están mal."
});
