/* An agent that checks: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the analytics films: gobernanza (de datos), never gobierno; dueño; título for an award; carpeta for a binder; verificación for a check,
   and "revisa" for what the agent does, as the series' page names the film (Un agente que revisa);
   "skill", feminine, as An agent on the team says it; and tú, so the skill's steps speak to the agent as its page does ("You find, draft and flag"). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Imagined: the university, a few years from now.":
"Un futuro imaginado: la universidad, dentro de unos años.",
"Before going home, Anil Kurian, an analyst in the Faculty of Health, adds a column to a list: each learner's date of birth.":
"Antes de irse, Anil Kurian, analista de la Facultad de Salud, agrega una columna a una lista: la fecha de nacimiento de cada estudiante.",
"At three in the morning, an agent reads the change against governance's written rules.":
"A las tres de la mañana, un agente lee el cambio frente a las reglas escritas de gobernanza.",
"Nothing says the new column is personal data, so nothing would protect it.":
"Nada indica que la nueva columna sea un dato personal, así que nada la protegería.",
"The agent doesn't change it, or approve it. It leaves a comment: the line, the rule, and a fix to consider.":
"El agente no lo cambia ni lo aprueba. Deja un comentario: la línea, la regla y una corrección a considerar.",
"At eight, Anil reads it, agrees, and marks the column as personal data.":
"A las ocho, Anil lo lee, está de acuerdo y marca la columna como dato personal.",
"What this shows: rules written as checks, applied by an agent to every change, at any hour, and a person who decides.":
"Lo que muestra: reglas escritas como verificaciones, que un agente aplica a cada cambio, a cualquier hora, y una persona que decide.",
"Back to today, and Anil's first change: the list itself.":
"Volvamos a hoy, y al primer cambio de Anil: la lista en sí.",
"Every learner studying for one of the faculty's awards, how far each is from finishing, and a name and an email to call.":
"Cada estudiante que cursa uno de los títulos de la facultad, cuánto le falta para terminar, y un nombre y un correo para contactarlo.",
"Three checks fail, with thirteen problems.":
"Fallan tres verificaciones: trece problemas.",
"Each says what's missing. None says what's right for this list, or who decides.":
"Cada una dice qué falta. Ninguna dice qué es lo correcto para esta lista, ni quién decide.",
"So Anil asks Jun, and waits. Every change that nobody else owns waits for Jun.":
"Así que Anil le pregunta a Jun, y espera. Todo cambio sin otro dueño espera a Jun.",
"So Yusuf and Noor write governance's rules as a skill: the steps an agent follows on every change.":
"Así que Yusuf y Noor escriben las reglas de gobernanza como una skill: los pasos que un agente sigue en cada cambio.",
"It's a file in the project, in plain words, for anyone to read.":
"Es un archivo del proyecto, en palabras simples, que cualquiera puede leer.",
"Run the checks. Find the owner. Take each definition from the glossary, or have governance confirm there's none.":
"Ejecuta las verificaciones. Busca al dueño. Toma cada definición del glosario, o que gobernanza confirme que no hay ninguna.",
"Class every column, with evidence. Test each rule about the data; track the ones about what people do.":
"Clasifica cada columna, con evidencia. Prueba cada regla sobre los datos; da seguimiento a las de lo que hace la gente.",
"Name what it touches. Then report, once, to the people who decide.":
"Nombra lo que afecta. Luego informa, una sola vez, a las personas que deciden.",
"And it never approves, edits the glossary, weakens a test, or shows a value from the data.":
"Y nunca aprueba, ni edita el glosario, ni debilita una prueba, ni muestra un valor de los datos.",
"The agent reviews Anil's change. Two things pass: it touches nothing else, and needs no new glossary term.":
"El agente revisa el cambio de Anil. Dos cosas pasan: no afecta a nada más y no necesita un término nuevo en el glosario.",
"Then three findings, each with its line, the rule it breaks, a draft, and who decides.":
"Luego, tres hallazgos, cada uno con su línea, la regla que incumple, un borrador y quién decide.",
"One: nobody answers for it, so no owner would be asked to review a change.":
"Uno: nadie responde por ella, así que a ningún dueño se le pediría revisar un cambio.",
"Two: ten columns don't say whether they identify a person.":
"Dos: diez columnas no dicen si identifican a una persona.",
"It counts, and shows no values: all seven rows of the email column look like an email.":
"Cuenta, y no muestra valores: las siete filas de la columna de correo parecen un correo.",
"Three: a rule, only the faculty's own awards, has no test. The draft checks that every row's faculty is HLT.":
"Tres: una regla, solo los títulos de la propia facultad, no tiene prueba. El borrador verifica que la facultad de cada fila sea HLT.",
"Where the agent wasn't sure, it said so.":
"Donde el agente no estaba seguro, lo dijo.",
"Two columns look alike: long coded keys. One stands for a learner.":
"Dos columnas se parecen: claves largas y codificadas. Una representa a un estudiante.",
"The other has two values for seven learners, and its description says it's made from the award's code.":
"La otra tiene dos valores para siete estudiantes, y su descripción dice que sale del código del título.",
"Maybe not a person at all. But when in doubt, the skill says, draft the stricter class, and ask.":
"Quizá no sea una persona. Pero ante la duda, dice la skill, propón la clase más estricta, y pregunta.",
"Anil confirms: a course, not a person.":
"Anil confirma: un programa, no una persona.",
"So it's classed as identifying no one, with Anil's reason in the review.":
"Así que se clasifica como que no identifica a nadie, con la razón de Anil en la revisión.",
"Then the owners decide: the faculty, its classes and its rule; Yusuf, the new owner; Jun, the code.":
"Luego deciden los dueños: la facultad, sus clases y su regla; Yusuf, el nuevo dueño; Jun, el código.",
"The agent decided nothing. It brought each decision to the right person, with the evidence.":
"El agente no decidió nada. Llevó cada decisión a la persona indicada, con la evidencia.",
"Binder 26 says: AI use follows the organisation's data policies. The agent is governed, too.":
"La carpeta 26 dice: el uso de IA sigue las políticas de datos de la organización. El agente también está gobernado.",
"It has its own identity, reads only what it's granted, and writes only in its own workspace.":
"Tiene su propia identidad, lee solo lo que se le concede y escribe solo en su propio espacio de trabajo.",
"It works from counts and small samples, never bulk personal data, and only reads the glossary.":
"Trabaja con conteos y muestras pequeñas, nunca con datos personales en masa, y solo lee el glosario.",
"And it can't approve: approvals come from owners, and the agent owns nothing.":
"Y no puede aprobar: aprueban los dueños, y el agente no es dueño de nada.",
"So the binder's line goes green: it runs, in the agent's access, its steps, and the owners' approvals.":
"Así que la línea de la carpeta se pone verde: se ejecuta en los accesos del agente, sus pasos y las aprobaciones de los dueños.",
"An agent can only follow what's written down, plainly enough to check.":
"Un agente solo puede seguir lo escrito con claridad, lo bastante para verificarlo.",
"Remember policy 12's last line: “Staff take care to use terms correctly.” No agent can check care.":
"Recuerda la última línea de la política 12: “El personal cuida de usar bien los términos”. Ningún agente puede verificar el cuidado.",
"And the steps themselves are open: anyone can read them, and argue with them.":
"Y los pasos mismos están a la vista: cualquiera puede leerlos y discutirlos.",
"A change to a step is reviewed like any other: data governance approves it, and the next review follows it.":
"Un cambio a un paso se revisa como cualquier otro: lo aprueba gobernanza de datos, y la siguiente revisión lo sigue.",
"People trust a review they can read, question and overrule.":
"La gente confía en una revisión que puede leer, cuestionar y anular.",
"That night, a few years from now, is made of what you've just seen:":
"Esa noche, dentro de unos años, está hecha de lo que acabas de ver:",
"rules written as checks, steps in plain words, an agent with little access, and people who decide.":
"reglas escritas como verificaciones, pasos en palabras simples, un agente con pocos accesos y personas que deciden.",
"An agent checks what's written. People decide.":
"Un agente revisa lo escrito. Las personas deciden."
});
