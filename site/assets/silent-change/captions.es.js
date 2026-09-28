/* Silent change: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"It's 7:58 on the morning before census date.":
 "Son las 7:58, la mañana antes de la fecha de corte.",
"Ana, the Head of School, has a meeting at nine to confirm which classes will run.":
 "Ana, directora de la Escuela, tiene una reunión a las nueve para confirmar qué clases se abren.",
"Her dashboard shows yesterday's numbers, with a note: last good data, as of 11:02 last night.":
 "Su dashboard muestra las cifras de ayer, con un aviso: últimos datos buenos, de las 11:02 de anoche.",
"The numbers aren't wrong. They're a day old, and the dashboard says so.":
 "Las cifras no están mal. Tienen un día, y el dashboard lo dice.",
"Ana messages Sam: are these numbers safe to use?":
 "Ana le escribe a Sam: ¿se pueden usar estas cifras?",
"Six hours earlier, at 2:40 in the morning, the nightly build begins.":
 "Seis horas antes, a las 2:40 de la madrugada, empieza la actualización nocturna.",
"Enrolment changes reach the platform all day, as events or in files. Once a night, dbt builds the numbers from them.":
 "Los cambios de inscripción llegan a la plataforma todo el día, como eventos o en archivos. Cada noche, dbt construye las cifras con ellos.",
"Before anything is built on them, dbt tests them. One test checks that every enrolment has a status it knows.":
 "Antes de construir nada encima, dbt los prueba. Una prueba verifica que cada inscripción tenga un estado conocido.",
"Tonight, some have a status it has never seen.":
 "Esta noche, algunas tienen un estado que nunca vio.",
"So the build stops there. Everything downstream is skipped, and the dashboard keeps the last good numbers, with that note.":
 "Así que la actualización se detiene ahí. Todo lo que sigue se omite, y el dashboard conserva las últimas cifras buenas, con ese aviso.",
"An alert is filed for the morning. Nothing wrong reached anyone, so nobody needs to be woken.":
 "Se deja una alerta para la mañana. No le llegó a nadie nada incorrecto, así que no hay que despertar a nadie.",
"A good platform fails loudly, and safely.":
 "Una buena plataforma falla a la vista, y sin riesgo.",
"At 7:59, Sam, the data engineer on call, is already reading the alert.":
 "A las 7:59, Sam, de guardia en ingeniería de datos, ya está leyendo la alerta.",
"Sam replies: yesterday's numbers are safe. I'm checking today's, and I'll be back to you by 8:45.":
 "Sam responde: las cifras de ayer son seguras. Estoy revisando las de hoy, y te aviso antes de las 8:45.",
"Say what you know, and what you don't. That's how trust survives a bad morning.":
 "Di lo que sabes, y lo que no. Así sobrevive la confianza a una mala mañana.",
"Every number on the dashboard has a lineage: the steps that built it.":
 "Cada cifra del dashboard tiene un linaje: los pasos que la construyeron.",
"Sam follows it backwards, one step at a time.":
 "Sam lo sigue hacia atrás, paso a paso.",
"From the dashboard, to the data product behind it. Then to the model that joins enrolments to their units.":
 "Del dashboard, al producto de datos que lo alimenta. Luego al modelo que une las inscripciones con sus unidades.",
"Then to staging, where the test failed. The rows that failed it were kept aside, so they can be looked at.":
 "Luego a staging, donde falló la prueba. Las filas que no la pasaron se apartaron, para poder revisarlas.",
"Upstream, in bronze, the rows are exactly as the student system sent them.":
 "Río arriba, en bronce, las filas están tal como las envió el sistema de estudiantes.",
"Fifteen enrolments in Data Science 101 have a new status: waitlisted.":
 "Quince inscripciones en Data Science 101 tienen un estado nuevo: en lista de espera.",
"Bronze keeps what arrived, even what nothing downstream understands yet. Nothing was lost. Something was new.":
 "Bronce guarda lo que llegó, incluso lo que nada más adelante entiende todavía. No se perdió nada. Algo era nuevo.",
"Sam asks the student system team: did enrolments change last night?":
 "Sam pregunta al equipo del sistema de estudiantes: ¿cambiaron las inscripciones?",
"Ben replies: yes, waitlists went live. It's in our release notes.":
 "Ben responde: sí, activamos las listas de espera. Está en nuestras notas de versión.",
"Then Sam calls the registrar's office. Mei says: yes, we introduced waitlists, and we emailed every School.":
 "Luego Sam llama a la oficina de registro escolar. Mei dice: sí, creamos las listas de espera, y avisamos por correo a cada Escuela.",
"Two weeks earlier, both had announced the change.":
 "Dos semanas antes, ambos equipos avisaron del cambio.",
"The registrar's office emailed every School. The student system team published release notes.":
 "La oficina de registro escolar escribió a cada Escuela. El equipo del sistema de estudiantes publicó notas de versión.",
"Each notice reached its own people. Neither reached the platform, or the people who rely on its numbers.":
 "Cada aviso llegó a su propia gente. Ninguno llegó a la plataforma, ni a quienes dependen de sus cifras.",
"Ben knew what changed. Mei knew what it meant. Neither knew the numbers depended on it.":
 "Ben sabía qué cambió. Mei sabía qué significaba. Nadie sabía que las cifras dependían de eso.",
"So, is a waitlisted student enrolled? Sam doesn't guess. It's a business question.":
 "Entonces, ¿un estudiante en lista de espera está inscrito? Sam no adivina. Es una pregunta de negocio.",
"Mei decides: no. Enrolled means holding a seat on census date, and a waitlisted student doesn't hold one yet.":
 "Mei decide: no. Inscrito significa tener un lugar a la fecha de corte, y quien está en lista de espera todavía no lo tiene.",
"The sketch, our model of what things mean, gains a new status.":
 "El boceto, nuestro modelo de significados, gana un estado nuevo.",
"Now the fix is small. In dbt, waitlisted becomes a known status, one that doesn't count as enrolled.":
 "Ahora la corrección es pequeña. En dbt, la lista de espera pasa a ser un estado conocido, que no cuenta como inscrito.",
"A colleague reviews it, like any code. Tests run on just what changed, and they pass.":
 "Alguien del equipo la revisa, como cualquier código. Las pruebas corren solo sobre lo que cambió, y pasan.",
"The skipped models run again.":
 "Se reanudan los modelos omitidos.",
"Had the waitlist been counted, the dashboard would have shown Data Science 101 at 108% full.":
 "Si se hubiera contado la lista de espera, el dashboard habría mostrado Data Science 101 al 108%.",
"That's believable. Classes do fill up. Nobody would have questioned it, and Ana might have booked a bigger room for students without a seat.":
 "Es creíble. Las clases sí se llenan. Nadie lo habría cuestionado, y Ana podría haber reservado un salón más grande para estudiantes sin lugar.",
"Time travel lays last night's table beside this morning's: 94% yesterday, 96% today.":
 "Time travel pone la tabla de anoche junto a la de esta mañana: 94% ayer, 96% hoy.",
"At 8:40, the note disappears. At nine, Ana confirms the classes.":
 "A las 8:40, el aviso desaparece. A las nueve, Ana confirma las clases.",
"Later that week, the four of them meet: Mei and Ben, who produce the data, and Sam and Ana, who use it.":
 "Más tarde esa semana, se reúnen los cuatro: Mei y Ben, que producen los datos, y Sam y Ana, que los usan.",
"They agree a data contract for enrolments.":
 "Acuerdan un contrato de datos de inscripciones.",
"It lists the fields, the allowed statuses and what each one means, and how fresh the data must be.":
 "Lista los campos, los estados permitidos y qué significa cada uno, y qué tan actuales deben ser los datos.",
"It names an owner on each side, technical and business. Changing it needs both sides to agree.":
 "Nombra un responsable de cada lado, técnico y de negocio. Cambiarlo requiere el acuerdo de ambos lados.",
"And the platform keeps checking it: on every load, at the door, and on every proposed change, before it ships.":
 "Y la plataforma lo sigue revisando: en cada carga, en la entrada, y en cada cambio propuesto, antes de publicarlo.",
"Three weeks later, Ben's team adds another status: deferred.":
 "Tres semanas después, el equipo de Ben agrega otro estado: diferido.",
"In their test environment, before release, the contract check turns amber, and all four owners are told.":
 "En su entorno de pruebas, antes de publicar, la revisión del contrato se pone en ámbar, y se avisa a los cuatro responsables.",
"Mei defines what deferred means. Sam's team adds it. The contract becomes version 1.1.":
 "Mei define qué significa diferido. El equipo de Sam lo agrega. El contrato pasa a la versión 1.1.",
"On Monday, the dashboard simply updates. No note, no alert, and nobody woken.":
 "El lunes, el dashboard simplemente se actualiza. Sin aviso, sin alerta, y sin despertar a nadie.",
"Changes will keep coming. That's a university doing its job.":
 "Los cambios seguirán llegando. Es una universidad haciendo su trabajo.",
"The platform's job is to make each one visible, to everyone it touches, in time.":
 "El trabajo de la plataforma es hacer visible cada uno, a todos a quienes afecta, a tiempo.",
"Seen by both sides, before it ships.":
 "Visto por ambos lados, antes de publicarse."
});
