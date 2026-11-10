/* An agent that checks: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the analytics films: gobernanza (de datos), never gobierno; dueño; título for an award; carpeta for a binder; verificación for a check,
   and "revisa" for what the agent does, as the series' page names the film (Un agente que revisa); lista de verificación for the checklist; asistentes de IA for
   AI helpers; firmar for sign off, and registro for the register; vacíos for the sign-off sheet's gaps; and tú, so the checklist's steps speak to the
   agent as its page does ("You find, draft and flag"). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Imagined: the university, a few years from now.":
"Un futuro imaginado: la universidad, dentro de unos años.",
"Before going home, Anil Kurian, an analyst in the Faculty of Health, adds a column to a list: each learner's date of birth.":
"Antes de irse, Anil Kurian, analista de la Facultad de Salud, agrega una columna a una lista: la fecha de nacimiento de cada estudiante.",
"Nothing marks it as personal data, so nothing hides it: anyone who can open the list would see when each learner was born.":
"Nada la marca como dato personal, así que nada la oculta: quien pueda abrir la lista vería cuándo nació cada estudiante.",
"In the wrong hands, with a name and an email, it can help someone pretend to be that learner.":
"En malas manos, con un nombre y un correo, puede ayudar a alguien a hacerse pasar por ese estudiante.",
"Someone has to catch it, and today, that means waiting for the one person who knows the rules.":
"Alguien tiene que detectarlo, y hoy eso significa esperar a la única persona que conoce las reglas.",
"At three that night, an AI agent reads the change against governance's written rules.":
"A las tres de esa noche, un agente de IA lee el cambio frente a las reglas escritas de gobernanza.",
"It doesn't edit the change, or approve it. It leaves a note: where, the rule, who decides, and a fix to consider.":
"No edita el cambio ni lo aprueba. Deja una nota: dónde, la regla, quién decide y una corrección a considerar.",
"At eight, Anil reads it, agrees, and marks the column as personal data.":
"A las ocho, Anil lo lee, está de acuerdo y marca la columna como dato personal.",
"No one had to wait, and no one saw a date of birth they shouldn't.":
"Nadie tuvo que esperar, y nadie vio una fecha de nacimiento que no debía.",
"What this shows: rules written plainly enough to check, applied by an agent to every change, at any hour, and a person who decides.":
"Lo que muestra: reglas tan claras que se pueden verificar, que un agente aplica a cada cambio, a cualquier hora, y una persona que decide.",
"Back to today, and Anil's first change: the list itself.":
"Volvamos a hoy, y al primer cambio de Anil: la lista en sí.",
"Every learner studying for one of the faculty's awards, how far each is from finishing, and a name and an email to call.":
"Cada estudiante que cursa uno de los títulos de la facultad, cuánto le falta para terminar, y un nombre y un correo para contactarlo.",
"The checks send it back, with four gaps.":
"Las verificaciones lo devuelven: cuatro vacíos.",
"Each says what's missing. None says what's right for this list, or who decides.":
"Cada una dice qué falta. Ninguna dice qué es lo correcto para esta lista, ni quién decide.",
"So Anil asks Jun, who knows the rules, and waits.":
"Anil le pregunta a Jun, que conoce las reglas, y espera.",
"Every change nobody else owns waits for Jun, and the advisers wait for their list.":
"Todo cambio sin otro dueño espera a Jun, y los asesores esperan su lista.",
"So Yusuf and Noor write governance's rules as a checklist: the steps an agent follows on every change.":
"Así que Yusuf y Noor escriben las reglas como una lista de verificación: los pasos que un agente sigue en cada cambio.",
"It's one page, in plain words, for anyone to read.":
"Una sola página, en palabras simples, para cualquiera.",
"The rules no longer live with one person.":
"Las reglas ya no dependen de una sola persona.",
"Start from the glossary: take each definition from it, or have governance confirm there's none. Find the owner. Run the checks.":
"Empieza por el glosario: toma de él cada definición, o que gobernanza confirme que no hay. Busca al dueño. Ejecuta las verificaciones.",
"Classify every column, with evidence. Check each rule about the data; track the ones about what people do.":
"Clasifica cada columna, con evidencia. Verifica cada regla sobre los datos; da seguimiento a las de lo que hace la gente.",
"Name what it touches. Then report, once, to the people who decide.":
"Nombra lo que afecta. Luego informa, una sola vez, a las personas que deciden.",
"And it never approves, edits the glossary, weakens a check, or shows a value from the data.":
"Y nunca aprueba, ni edita el glosario, ni debilita una verificación, ni muestra un valor de los datos.",
"It's the page the agent followed on the night we imagined.":
"Es la página que siguió el agente en la noche que imaginamos.",
"The data team's AI agent reviews Anil's change. Two things pass.":
"El agente de IA del equipo de datos revisa el cambio de Anil. Dos cosas pasan.",
"Then three findings, each with where it is and the rule, and what the checks couldn't say: a draft, and who decides.":
"Luego, tres hallazgos, cada uno con dónde está y la regla, y lo que las verificaciones no decían: un borrador y quién decide.",
"One: nobody answers for it, so no owner would be told what a change touches.":
"Uno: nadie responde por ella, así que a ningún dueño se le avisaría de lo que toca un cambio.",
"Two: ten columns don't say whether they identify a person.":
"Dos: diez columnas no dicen si identifican a una persona.",
"It counts, and shows no values: all seven rows of the email column look like an email.":
"Cuenta, y no muestra valores: las siete filas de la columna de correo parecen un correo.",
"Three, which no check could find: the faculty wrote a rule, only its own awards, and nothing checks it.":
"Tres, que ninguna verificación podía hallar: la facultad escribió una regla, solo sus títulos, y nada la verifica.",
"The draft checks that every row's faculty is Health.":
"El borrador verifica que cada fila sea de Salud.",
"Where the agent wasn't sure, it said so.":
"Donde el agente no estaba seguro, lo dijo.",
"Two columns look alike: long codes. One stands for a learner.":
"Dos columnas se parecen: códigos largos. Una representa a un estudiante.",
"The other has two values for seven learners, and its description says it's made from the award.":
"La otra tiene dos valores para siete estudiantes, y su descripción dice que sale del título.",
"Maybe not a person at all. But when in doubt, the checklist says, draft the stricter class, and ask.":
"Quizá no sea una persona. Pero ante la duda, dice la lista de verificación, propón la clase más estricta, y pregunta.",
"Anil confirms: a course, not a person.":
"Anil confirma: un programa, no una persona.",
"So it's classed as identifying no one, with Anil's reason in the review.":
"Así que se clasifica como que no identifica a nadie, con la razón de Anil en la revisión.",
"Then the meaning is written first: the faculty puts its classes and its rule in the glossary, and Yusuf names the new owner.":
"Luego, primero se escribe el significado: la facultad pone sus clases y su regla en el glosario, y Yusuf nombra al nuevo dueño.",
"Jun, in the data team, reviews the change against them, and the owners are told what it touches.":
"Jun, del equipo de datos, revisa el cambio contra ellos, y a los dueños se les avisa de lo que toca.",
"The advisers get their list.":
"Los asesores reciben su lista.",
"The agent decided nothing. It brought each decision to the right person, with the evidence.":
"El agente no decidió nada. Llevó cada decisión a la persona indicada, con la evidencia.",
"Binder 26 says: AI use follows the organisation's data policies.":
"La carpeta 26 dice: el uso de IA sigue las políticas de datos de la organización.",
"The agent is governed too, by the rules for AI helpers.":
"También al agente lo gobiernan las reglas para asistentes de IA.",
"It has its own identity, reads only what Sam grants it, and writes only in its own workspace.":
"Tiene su propia identidad, lee solo lo que Sam le concede y escribe solo en su propio espacio de trabajo.",
"It works from counts and small samples, never bulk personal data, and only reads the glossary.":
"Trabaja con conteos y muestras pequeñas, nunca con datos personales en masa, y solo lee el glosario.",
"And it can't approve: the data team does, and the agent owns nothing.":
"Y no puede aprobar: lo hace el equipo de datos, y el agente no es dueño de nada.",
"That's why, on the night we imagined, it only left a note.":
"Por eso, en la noche que imaginamos, solo dejó una nota.",
"So the binder's line goes green: it runs, in the agent's access, its checklist, and the data team's approval.":
"Así que la línea de la carpeta se pone verde: se ejecuta en los accesos del agente, su lista y la aprobación del equipo de datos.",
"An agent can only follow what's written down, plainly enough to check.":
"Un agente solo puede seguir lo escrito con claridad, lo bastante para verificarlo.",
"Remember policy 12's last line: “Staff take care to use terms correctly.” No agent can check care.":
"Recuerda la última línea de la política 12: “El personal cuida de usar bien los términos”. Ningún agente puede verificar el cuidado.",
"And the checklist itself is open: anyone can read it, and argue with it.":
"Y la lista de verificación está a la vista: cualquiera puede leerla y discutirla.",
"A change to the checklist is reviewed like any other: data governance approves it, and the next review follows it.":
"Un cambio a la lista se revisa como cualquier otro: lo aprueba gobernanza de datos, y la siguiente revisión lo sigue.",
"People trust a review they can read, question and overrule.":
"La gente confía en una revisión que puede leer, cuestionar y anular.",
"That night, a few years from now, is made of what you've just seen:":
"Esa noche, dentro de unos años, está hecha de lo que acabas de ver:",
"a checklist in plain words, rules for AI helpers, a register of who owns what, and people who decide.":
"una lista de verificación simple, reglas para asistentes de IA, un registro de quién es dueño de qué, y personas que deciden.",
"What data governance gains: every change checked against the same rules, at any hour, and no one waiting for one person.":
"Lo que gana la gobernanza de datos: cada cambio verificado con las mismas reglas, a toda hora, sin esperar a una sola persona.",
"Personal data marked before anyone sees it, and each decision made by the right person, with the evidence, written down.":
"Datos personales marcados antes de que alguien los vea, y cada decisión tomada por la persona indicada, con la evidencia, por escrito.",
"An agent checks what's written. People decide.":
"Un agente revisa lo escrito. Las personas deciden."
});
