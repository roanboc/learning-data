/* A hub at work: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Four-digit numbers are written without a separator (1240), as Spanish style asks, so they read as the same number as on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Monday morning. Mei, whose office decides who someone is, opens the hub.":
"Lunes por la mañana. Mei, cuya oficina decide quién es alguien, abre el hub.",
"Earlier in this series, the university wrote down its rules: when two records are one person, and which value wins.":
"Antes en esta serie, la universidad escribió sus reglas: cuándo dos registros son una persona, y qué valor gana.",
"A hub puts those rules to work, every day.":
"Un hub pone esas reglas a trabajar, cada día.",
"This one is LakeFusion, which runs inside Databricks. Another hub could take its place.":
"Este es LakeFusion, que funciona dentro de Databricks. Otro hub podría ocupar su lugar.",
"Over the weekend, 1,240 changes came in from four systems.":
"Durante el fin de semana, llegaron 1240 cambios de cuatro sistemas.",
"The rules dealt with nearly all of them.":
"Las reglas resolvieron casi todos.",
"1,180 matched someone the university already knows.":
"1180 coincidieron con alguien que la universidad ya conoce.",
"52 were new people.":
"52 eran personas nuevas.",
"8 were too close to call, so they wait for Mei.":
"8 eran demasiado dudosos, así que esperan a Mei.",
"She starts with the one someone is waiting on.":
"Empieza por el que alguien está esperando.",
"On Saturday, Rafael Souza applied to come back for a master's, like Linh last year.":
"El sábado, Rafael Souza postuló para volver a hacer una maestría, como Linh el año pasado.",
"Before it makes a new person, the application now searches for one.":
"Antes de crear una persona nueva, la solicitud ahora busca una.",
"It found a likely match, but not a sure one.":
"Encontró una coincidencia probable, pero no segura.",
"So instead of a new student number, his application waits for Mei.":
"Así que, en vez de un nuevo número de estudiante, su solicitud espera a Mei.",
"The hub shows why the rules gave it 74.":
"El hub muestra por qué las reglas le dieron 74.",
"The same given and family names add a lot.":
"Los mismos nombres y apellidos suman mucho.",
"Birth dates one digit apart, probably a typo, add a little.":
"Dos fechas que difieren en un dígito, quizá un error, suman un poco.",
"A new email takes a little away: his student one closed when he graduated.":
"Un correo nuevo resta un poco: el de estudiante se cerró cuando se graduó.",
"74 is in the band where a person decides.":
"74 está en la franja donde decide una persona.",
"If the dates agreed, it would be 93, and linked without asking anyone.":
"Si las fechas coincidieran, sería 93, y se vincularía sin preguntar a nadie.",
"An AI helper has read the case, and drafted a note.":
"Un asistente de IA leyó el caso y redactó una nota.",
"On the form, he wrote that he'd studied here: a bachelor's, finished in 2019.":
"En el formulario, escribió que estudió aquí: una licenciatura, terminada en 2019.",
"The old record says the same thing, in other words.":
"El registro antiguo dice lo mismo, con otras palabras.",
"The helper reads meaning, not only spelling.":
"El asistente lee el sentido, no solo la ortografía.",
"It suggests they're the same person. It doesn't decide.":
"Sugiere que son la misma persona. No decide.",
"Mei decides. She links them, and writes down why.":
"Mei decide. Los vincula y anota por qué.",
"The hub keeps her name, the time, and her reason.":
"El hub guarda su nombre, la hora y su razón.",
"Her decision teaches the helper, too.":
"Su decisión también le enseña al asistente.",
"And it can be undone: unlinking is one step, and every version is kept.":
"Y se puede deshacer: desvincular es un paso, y se guarda cada versión.",
"Then the change is published, not pushed: each system reads what concerns it.":
"Luego el cambio se publica, no se envía: cada sistema lee lo que le concierne.",
"His application moves on under his old number, with his degree already on file.":
"Su solicitud sigue con su número antiguo, con su título ya registrado.",
"The alumni office stops inviting him back.":
"La oficina de egresados deja de invitarlo a volver.",
"And it never sees his birth date. It doesn't need it.":
"Y nunca ve su fecha de nacimiento. No la necesita.",
"His record shows where each value came from.":
"Su registro muestra de dónde vino cada valor.",
"His names and his birth date come from the student system, checked when he first enrolled.":
"Sus nombres y su fecha de nacimiento vienen del sistema de estudiantes, verificados al matricularse.",
"His email comes from the application: the newest one he's confirmed.":
"Su correo viene de la solicitud: el más reciente que confirmó.",
"The typo stays on the application, but it doesn't win.":
"El error queda en la solicitud, pero no gana.",
"On Friday, Leila, a steward in admissions, checks fifty of the week's automatic links, mostly ones that only just passed.":
"El viernes, Leila, responsable de datos en admisiones, revisa 50 vínculos automáticos de la semana, sobre todo los que apenas pasaron.",
"She sees each pair of records, but not what the rules decided, so she isn't swayed.":
"Ve cada par de registros, pero no lo que decidieron las reglas, para no dejarse influir.",
"This week, one was wrong, and Mei unlinks it.":
"Esta semana, uno estaba mal, y Mei lo desvincula.",
"If more than three were wrong, automatic linking would stop.":
"Si más de tres estuvieran mal, la vinculación automática se detendría.",
"Every match would wait for a person, until new rules were agreed.":
"Cada coincidencia esperaría a una persona, hasta acordar reglas nuevas.",
"Whatever the hub, at a university, a hospital or a bank, ask it five questions.":
"Sea cual sea el hub, en una universidad, un hospital o un banco, hazle cinco preguntas.",
"Can it explain every match, and every value?":
"¿Puede explicar cada coincidencia, y cada valor?",
"Can every decision be undone?":
"¿Se puede deshacer cada decisión?",
"Do people decide what's unsure, and check what isn't?":
"¿Las personas deciden lo dudoso, y revisan lo que no lo es?",
"Does each office see only what it needs?":
"¿Cada oficina ve solo lo que necesita?",
"And do systems read the changes, instead of being overwritten?":
"¿Y los sistemas leen los cambios, en vez de ser sobrescritos?",
"Rules act. AI suggests. People decide.":
"Las reglas actúan. La IA sugiere. La gente decide.",
"And everything can be explained, and undone.":
"Y todo se puede explicar, y deshacer."
});
