/* An agreement first: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: un acuerdo de confidencialidad, un acuerdo para compartir datos, el contrato del acuerdo, un permiso (a grant), el registro de
   acuerdos, la oficina de registro, los expedientes (records), la Facultad de Salud, el equipo de la plataforma, gobernanza de datos, el dueño and la dueña; the films by their
   Spanish titles (Quién puede verlo, El mercado de datos, Quién decide, Agentes de IA en el trabajo con datos); the Five Safes keep their English name, as the voice says it;
   the Official Secrets Act as la Ley de Secretos Oficiales. The six lines of the confidentiality agreement in the first person, as the signer says them.
   Numbers keep the picture's comma (2,614), as the series' other Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"England, 1939.":
"Inglaterra, 1939.",
"At Bletchley Park, Britain's codebreakers set to work on the enemy's coded radio messages.":
"En Bletchley Park, los descifradores británicos se ponen a trabajar en los mensajes de radio cifrados del enemigo.",
"By 1945, almost nine thousand people work there, three in four of them women.":
"Para 1945, casi nueve mil personas trabajan allí, tres de cada cuatro, mujeres.",
"Each of them learns the war's best-kept secret: the enemy's messages can be read.":
"Cada una aprende el secreto mejor guardado de la guerra: los mensajes del enemigo se pueden leer.",
"Ships crossing the Atlantic are steered away from submarines, because the submarines' orders have been read.":
"Los barcos que cruzan el Atlántico se desvían de los submarinos, porque se han leído las órdenes de los submarinos.",
"If the enemy found out, it would change its codes, and the ships would sail into them.":
"Si el enemigo se enterara, cambiaría sus códigos, y los barcos navegarían directo hacia ellos.",
"One careless word, from any one of thousands, could give it away.":
"Una palabra descuidada, de cualquiera entre miles, podría delatarlo.",
"Something has to come before the secret.":
"Algo tiene que ir antes del secreto.",
"So the people who run Bletchley put a promise first.":
"Así que quienes dirigen Bletchley ponen primero una promesa.",
"Before anyone is told what the work is, they sign the Official Secrets Act: a promise to keep what they learn to themselves.":
"Antes de que les digan cuál es el trabajo, firman la Ley de Secretos Oficiales: la promesa de guardarse lo que aprendan.",
"Then each is told only what their own part needs.":
"Luego, a cada quien le dicen solo lo que su propia parte necesita.",
"What they read goes only to a few named commanders, by an officer who waits while it's read, then takes it back and destroys it.":
"Lo que leen va solo a unos pocos comandantes con nombre, por un oficial que espera mientras lo leen, y luego lo recoge y lo destruye.",
"And nothing done with it may give the secret away.":
"Y nada de lo que se haga con ello puede delatar el secreto.",
"It holds.":
"Se cumple.",
"The enemy never learns its messages are read, and the ships keep their warning.":
"El enemigo nunca sabe que sus mensajes se leen, y los barcos conservan su aviso.",
"And all those thousands keep it for almost thirty years, until 1974.":
"Y esos miles lo guardan casi treinta años, hasta 1974.",
"A university holds secrets too, and a study may ask for them.":
"Una universidad también guarda secretos, y un estudio puede pedirlos.",
"A no fails the learners it could help; a yes with nothing written could expose them.":
"Un no les falla a los estudiantes a quienes podría ayudar; un sí sin nada escrito podría exponerlos.",
"So, as at Bletchley, two papers come first, and access comes last.":
"Así que, como en Bletchley, primero van dos papeles, y el acceso va al final.",
"The study gets what it needs, and not one learner is named.":
"El estudio obtiene lo que necesita, y ningún estudiante aparece con su nombre.",
"Monday, 5 October 2026.":
"Lunes 5 de octubre de 2026.",
"Anil Kurian, in the Faculty of Health, wants to study how its learners progress, and where they need support.":
"Anil Kurian, de la Facultad de Salud, quiere estudiar cómo avanzan sus estudiantes, y dónde necesitan apoyo.",
"So he asks the registrar's office for the records of the faculty's 2,614 learners.":
"Así que pide a la oficina de registro los expedientes de los 2,614 estudiantes de la facultad.",
"Mei Tanaka owns them, for the office.":
"Mei Tanaka es su dueña, por la oficina.",
"Who may see it gave every access a purpose and an end date, and The marketplace put the asking in one place.":
"Quién puede verlo le dio a cada acceso un propósito y una fecha de fin, y El mercado de datos puso las solicitudes en un solo lugar.",
"But a purpose and a date don't say what the study must never have, where it may work, or what may leave it.":
"Pero un propósito y una fecha no dicen qué nunca debe tener el estudio, dónde puede trabajar, ni qué puede salir de él.",
"Left unsaid, names could sit beside results, and who gets extra time, and why, could travel wherever the work goes.":
"Sin decirlo, los nombres podrían quedar junto a los resultados, y quién tiene tiempo extra, y por qué, podría viajar adonde vaya el trabajo.",
"So two papers come first: one each person signs, and one for each use.":
"Así que primero van dos papeles: uno que firma cada persona, y uno para cada uso.",
"The first is each person's own: a confidentiality agreement.":
"El primero es de cada persona: un acuerdo de confidencialidad.",
"I keep what I see to myself.":
"Me guardo lo que veo.",
"I use it only for the work it's given for.":
"Lo uso solo para el trabajo para el que me lo dan.",
"I keep no copy where it isn't allowed.":
"No guardo copias donde no está permitido.",
"I answer for the data I'm given.":
"Respondo por los datos que me dan.",
"I report anything that goes wrong, at once.":
"Aviso de inmediato si algo sale mal.",
"And it holds after I leave.":
"Y vale después de que me vaya.",
"Everyone who works with the university's data signs it before any access: staff, contractors, researchers, the data team.":
"Quien trabaja con datos de la universidad lo firma antes de cualquier acceso: personal, contratistas, investigadores, el equipo de datos.",
"It's renewed every year, and Yusuf Demir, in data governance, keeps them.":
"Se renueva cada año, y Yusuf Demir, de gobernanza de datos, los guarda.",
"Access comes through groups, never to a person by name, and a person stays in a group only while their promise is signed and current.":
"El acceso llega por grupos, nunca a una persona por nombre, y alguien sigue en un grupo solo mientras su promesa esté firmada y vigente.",
"An agent signs nothing: its owner signs, and answers for it, as AI agents in data work shows.":
"Un agente no firma nada: firma su dueño, que responde por él, como muestra Agentes de IA en el trabajo con datos.",
"Anil renewed his in February.":
"Anil renovó el suyo en febrero.",
"As at Bletchley, the promise comes before the secret, and outlasts the work.":
"Como en Bletchley, la promesa va antes del secreto, y dura más que el trabajo.",
"The second is for this use: a data sharing agreement, written line by line.":
"El segundo es para este uso: un acuerdo para compartir datos, escrito línea por línea.",
"Its purpose: how learners in the Faculty of Health progress, and where they need support.":
"Su propósito: cómo avanzan los estudiantes de la Facultad de Salud, y dónde necesitan apoyo.",
"From the registrar's learner records: 2,614 learners.":
"De los expedientes de estudiantes del registro: 2,614 estudiantes.",
"It may have each learner's course and results, their year of birth, and a code in place of who they are.":
"Puede tener el curso y los resultados de cada estudiante, su año de nacimiento, y un código en lugar de quién es.",
"Never anything that names a learner, and nothing about their health.":
"Nunca nada que nombre a un estudiante, y nada sobre su salud.",
"Only the study's group, each member with a signed promise.":
"Solo el grupo del estudio, cada miembro con una promesa firmada.",
"Only on the platform, in the study's own space, with nothing downloaded.":
"Solo en la plataforma, en el espacio propio del estudio, sin descargar nada.",
"What may leave: totals, with any count under ten hidden.":
"Lo que puede salir: totales, con cualquier conteo menor de diez oculto.",
"It ends on 30 June 2027; then the study's copy is deleted, and the totals stay.":
"Termina el 30 de junio de 2027; luego se borra la copia del estudio, y los totales se quedan.",
"Statistics offices call these questions the Five Safes: people, project, setting, data and outputs.":
"Las oficinas de estadística llaman a estas preguntas los Five Safes: personas, proyecto, entorno, datos y resultados.",
"Mei signs as the owner, who answers for the data, as Who decides set out; Anil signs for the study.":
"Mei firma como dueña, que responde por los datos, como estableció Quién decide; Anil firma por el estudio.",
"Yusuf keeps it in the register of agreements: what was agreed, by whom, and until when.":
"Yusuf lo guarda en el registro de acuerdos: qué se acordó, quién lo acordó, y hasta cuándo.",
"As at Bletchley, the data reaches only the people named, stays where it's kept, and leaves only in a form that names no one.":
"Como en Bletchley, los datos llegan solo a las personas nombradas, se quedan donde se guardan, y salen solo sin nombrar a nadie.",
"Only now comes access, and it's made from the agreement.":
"Solo ahora llega el acceso, y se hace a partir del acuerdo.",
"Its terms are written again where the platform reads them: the agreement's contract.":
"Sus términos se escriben de nuevo donde la plataforma los lee: el contrato del acuerdo.",
"The columns: course, results, year of birth, learner code. The group: the study's. The end: 30 June 2027.":
"Las columnas: curso, resultados, año de nacimiento, código de estudiante. El grupo: el del estudio. El fin: 30 de junio de 2027.",
"The platform team makes the grant from the contract, never by hand, so it can't give more than the agreement says.":
"El equipo de la plataforma hace el permiso a partir del contrato, nunca a mano, así que no puede dar más de lo que dice el acuerdo.",
"Every grant names its agreement. No agreement, no grant.":
"Cada permiso nombra su acuerdo. Sin acuerdo, no hay permiso.",
"In November, the faculty asks the study for the names of learners who need support, to call them.":
"En noviembre, la facultad le pide al estudio los nombres de los estudiantes que necesitan apoyo, para llamarlos.",
"That's a new purpose, and the study's agreement doesn't stretch to it.":
"Es un propósito nuevo, y el acuerdo del estudio no se estira hasta ahí.",
"The support team asks Mei for an agreement of its own.":
"El equipo de apoyo le pide a Mei un acuerdo propio.",
"Wednesday, 30 June 2027.":
"Miércoles 30 de junio de 2027.",
"The grant ends by itself, on the date the agreement set.":
"El permiso termina solo, en la fecha que fijó el acuerdo.",
"The study's copy is deleted, and Yusuf closes the agreement in the register.":
"Se borra la copia del estudio, y Yusuf cierra el acuerdo en el registro.",
"The totals stay, with every count under ten hidden.":
"Los totales se quedan, con cada conteo menor de diez oculto.",
"Anil's promise doesn't end: it holds after the work, and after he leaves.":
"La promesa de Anil no termina: vale después del trabajo, y después de que se vaya.",
"At Bletchley, the promise came first, and the secret held for almost thirty years.":
"En Bletchley, la promesa fue primero, y el secreto se guardó casi treinta años.",
"At the university, the study learned what it needed from 2,614 learners' records, and not one learner was named.":
"En la universidad, el estudio aprendió lo que necesitaba de los expedientes de 2,614 estudiantes, y ninguno apareció con su nombre.",
"Access is the end of an agreement, not the start.":
"El acceso es el final de un acuerdo, no el comienzo."
});
