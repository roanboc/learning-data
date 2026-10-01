/* One row of what, and when: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"The first of June, 1890. The United States counted its people as they were on that one day.":
"El primero de junio de 1890. Estados Unidos contó a su gente tal como estaba ese único día.",
"Counting took weeks, but a baby born after the first wasn't counted. Someone who died after it was.":
"Contar llevó semanas, pero un bebé nacido después del primero no se contó. Alguien que murió después, sí.",
"Each person became a punched card, counted by Herman Hollerith's machines.":
"Cada persona se volvió una tarjeta perforada, contada por las máquinas de Herman Hollerith.",
"One card per person, as at one day. Planning's question needs both.":
"Una tarjeta por persona, a un solo día. La pregunta de Planificación necesita las dos cosas.",
"Before any SQL, Jun's table for Planning gets one sentence.":
"Antes de escribir SQL, la tabla de Jun para Planificación recibe una oración.",
"One row per learner per award, as at census date.":
"Una fila por estudiante por título, a la fecha del censo.",
"That sentence is the grain. It says what a row is, and which day it describes.":
"Esa oración es el grano. Dice qué es una fila y qué día describe.",
"The agent drafts it from Planning's question and the census report. Noor, who owns the model, approves it.":
"El agente la redacta a partir de la pregunta de Planificación y el informe del censo. Noor, dueña del modelo, la aprueba.",
"Then it becomes a test: no two rows with the same learner and the same award.":
"Luego se vuelve una prueba: no hay dos filas con el mismo estudiante y el mismo título.",
"Here's why it matters. In July, a graduate certificate in Health changed its name.":
"Por eso importa. En julio, un certificado de posgrado en Salud cambió de nombre.",
"So the award has two versions: the old name, and the new one.":
"Así que el título tiene dos versiones: el nombre viejo y el nuevo.",
"Join the credit to the award on its key alone, and every learner meets both versions.":
"Une los créditos al título solo por su clave, y cada estudiante encuentra las dos versiones.",
"Eight learners become sixteen rows. A hundred and eighty-five credit points become three hundred and seventy.":
"Ocho estudiantes se vuelven dieciséis filas. Ciento ochenta y cinco créditos se vuelven trescientos setenta.",
"Nothing errors, and every row looks right. Only the test on the grain notices.":
"Nada falla, y cada fila parece correcta. Solo la prueba del grano lo nota.",
"Join the version that was valid on census day, and there are eight rows again.":
"Une la versión vigente el día del censo, y vuelven a ser ocho filas.",
"Those versions come from the sources. Nothing is overwritten: every change arrives as a new row, with the date it started and the date it ended.":
"Esas versiones vienen de las fuentes. Nada se sobrescribe: cada cambio llega como una fila nueva, con la fecha en que empezó y la fecha en que terminó.",
"But those dates say when the platform saw a change, not when it was true. Where a system says when something happened, the model uses that.":
"Pero esas fechas dicen cuándo la plataforma vio un cambio, no cuándo fue cierto. Donde un sistema dice cuándo pasó algo, el modelo usa esa fecha.",
"The core builds its own versions from those dated facts. Aisha's credit towards her certificate has six. Five points in October, forty-five by the end of February, and sixty in July.":
"El núcleo arma sus propias versiones con esos hechos fechados. Los créditos de Aisha para su certificado tienen seis. Cinco en octubre, cuarenta y cinco a fines de febrero y sesenta en julio.",
"So the core's grain is: one row per learner, per award, per version. A test checks that no two versions overlap.":
"Así que el grano del núcleo es: una fila por estudiante, por título, por versión. Una prueba verifica que no se solapen dos versiones.",
"Now two consumers read the same versions, and ask about different days.":
"Ahora dos consumidores leen las mismas versiones y preguntan por días distintos.",
"Planning asks about census day, the 31st of March. Aisha held forty-five of sixty points, with fifteen to go. She counts.":
"Planificación pregunta por el día del censo, el 31 de marzo. Aisha tenía cuarenta y cinco de sesenta créditos, le faltaban quince. Cuenta.",
"The wallet app asks about today. Aisha finished in July, and her wallet shows the certificate.":
"La app de billetera pregunta por hoy. Aisha terminó en julio, y su billetera muestra el certificado.",
"Ask Planning's question, learners within fifteen points of a certificate, as it was on census day: twelve. Ask it today: nine.":
"Haz la pregunta de Planificación, estudiantes a quince créditos o menos de un certificado, como era el día del censo: doce. Hazla hoy: nueve.",
"Both are right. They answer about different days.":
"Las dos son correctas. Responden sobre días distintos.",
"So each output declares its day, and one small macro picks the version valid on it.":
"Así que cada salida declara su día, y una pequeña macro elige la versión vigente ese día.",
"A learner lives in three systems, and each keeps its own versions.":
"Un estudiante vive en tres sistemas, y cada uno guarda sus propias versiones.",
"Aisha's platform account came first. Her student record took effect six days later. A short-course account arrived in January.":
"Primero llegó la cuenta de Aisha en la plataforma. Su registro de estudiante rigió seis días después. Una cuenta de cursos cortos llegó en enero.",
"Jun cuts all three at every date on which any of them changed, and stitches one timeline.":
"Jun corta los tres en cada fecha en que alguno cambió, y une una sola línea de tiempo.",
"On each date, the student system's value wins, then the platform's, then the short course's.":
"En cada fecha gana el valor del sistema de estudiantes, luego el de la plataforma, luego el de cursos cortos.",
"A change that alters nothing the model holds makes no new version. Four dates give Aisha three.":
"Un cambio que no altera nada de lo que guarda el modelo no crea versión. Cuatro fechas le dan a Aisha tres.",
"Last, Priya. She withdrew from her certificate on the 27th of March, four days before census.":
"Por último, Priya. Se retiró de su certificado el 27 de marzo, cuatro días antes del censo.",
"The student system recorded it on the 3rd of April, a week late.":
"El sistema de estudiantes lo registró el 3 de abril, una semana tarde.",
"Dated by when it was recorded, she'd still be studying on census day, and Business would count four. The census report says three.":
"Fechado por cuándo se registró, aún estaría estudiando el día del censo, y Negocios contaría cuatro. El informe del censo dice tres.",
"Dated by when it took effect, Business counts three. As in 1890, the answer describes the day, not the day it was written down.":
"Fechado por cuándo rigió, Negocios cuenta tres. Como en 1890, la respuesta describe el día, no el día en que se anotó.",
"The platforms only say when they recorded a change. That gap is accepted, and written down.":
"Las plataformas solo dicen cuándo registraron un cambio. Esa brecha se acepta y queda por escrito.",
"One row of what, and when. Declared before any SQL, and tested.":
"Una fila de qué, y cuándo. Declarado antes de escribir SQL, y probado.",
"Two consumers, one core. Before any more code, write down what each is promised.":
"Dos consumidores, un núcleo. Antes de más código, escribe qué se le promete a cada uno."
});
