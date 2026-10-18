/* Which value wins: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Plymouth, December 1831. HMS Beagle is about to sail around the world.":
"Plymouth, diciembre de 1831. El HMS Beagle está por zarpar para dar la vuelta al mundo.",
"At sea, the time back home tells a ship how far east or west it has come.":
"En el mar, la hora de casa le dice a un barco cuánto avanzó hacia el este o el oeste.",
"So it carries clocks. And clocks drift.":
"Por eso lleva relojes. Y los relojes se desvían.",
"With two that disagree, you can't tell which one is wrong.":
"Con dos que no coinciden, no puedes saber cuál está mal.",
"The Beagle carries twenty-two.":
"El Beagle lleva veintidós.",
"In port, each one's drift is measured and written down.":
"En puerto, se mide y se anota cuánto se desvía cada uno.",
"The two thought best are the standards, and the others are checked against them.":
"Los dos considerados mejores son los patrones, y los demás se comparan con ellos.",
"Which clock to trust is decided before the clocks disagree.":
"En qué reloj confiar se decide antes de que los relojes discrepen.",
"Today, at the university.":
"Hoy, en la universidad.",
"Linh's five records are linked now: Mei's office decided they're one person.":
"Los cinco registros de Linh ya están vinculados: la oficina de Mei decidió que son una sola persona.",
"So the person needs one name, one birth date, and a way to reach her.":
"Así que la persona necesita un nombre, una fecha de nacimiento y un medio de contacto.",
"But her records don't agree.":
"Pero sus registros no coinciden.",
"Four ways of writing her name. Two birth dates. Two mobile numbers. Four emails.":
"Cuatro formas de escribir su nombre. Dos fechas de nacimiento. Dos números de celular. Cuatro correos.",
"Which value wins?":
"¿Qué valor gana?",
"The university's model already picks one.":
"El modelo de la universidad ya elige uno.",
"For the learner, it takes the student system first, then the learning platform, then short courses.":
"Para el estudiante, toma primero el sistema de estudiantes, después la plataforma de aprendizaje y los cursos cortos.",
"One order, for every field, inside the SQL, where the people who own the data can't see it.":
"Un solo orden, para todos los campos, dentro del SQL, donde los responsables de los datos no pueden verlo.",
"For the person, the quick fix is to let the newest value win.":
"Para la persona, la solución rápida es dejar que gane el valor más nuevo.",
"But HR sends its whole file again every teaching period, so its values always look new.":
"Pero RR. HH. vuelve a enviar su archivo completo cada periodo lectivo, así que sus valores siempre parecen nuevos.",
"Her birth date becomes HR's typo, and her old mobile comes back.":
"Su fecha de nacimiento queda con la errata de RR. HH., y vuelve su viejo celular.",
"Her transcript would print her name as HR typed it.":
"Su certificado de notas saldría con su nombre como lo tipeó RR. HH.",
"Newest isn't truest.":
"Lo más nuevo no es lo más cierto.",
"Her legal name is Nguyễn Thị Linh: family name first, with its accents, as on her passport.":
"Su nombre legal es Nguyễn Thị Linh: primero el apellido, con sus acentos, como en su pasaporte.",
"The student system checked it when she enrolled.":
"El sistema de estudiantes lo verificó al matricularse.",
"Her old record lost the accents, and HR turned it round: Linh Nguyen.":
"Su registro antiguo perdió los acentos, y RR. HH. lo dio vuelta: Linh Nguyen.",
"The name she goes by, Linh, she set herself.":
"El nombre que usa, Linh, lo eligió ella misma.",
"Both are hers, for different things.":
"Los dos son suyos, para cosas distintas.",
"Her transcript carries her legal name.":
"Su certificado de notas lleva su nombre legal.",
"Her class lists and her ID card, the one she chose.":
"Sus listas de clase y su credencial, el que eligió.",
"So the person keeps two names, and each needs its own rule.":
"Así que la persona tiene dos nombres, y cada uno, su propia regla.",
"So Jun writes the rules down, field by field, in the model's YAML.":
"Así que Jun anota las reglas, campo por campo, en el YAML del modelo.",
"Like the Beagle's standards, each field has the source it trusts most.":
"Como los relojes patrón del Beagle, cada campo tiene su fuente más confiable.",
"Her legal name, from the student system, which checked her passport.":
"Su nombre legal, del sistema de estudiantes, que verificó su pasaporte.",
"Her preferred name, from Linh herself.":
"Su nombre preferido, de la propia Linh.",
"Her birth date, from the student system.":
"Su fecha de nacimiento, del sistema de estudiantes.",
"If another system sends a different one, it waits for Mei.":
"Si otro sistema envía una distinta, espera a Mei.",
"HR's still has the typo, so Mei pins the right one, with a reason, until next year.":
"La de RR. HH. aún tiene la errata, así que Mei fija la correcta, con un motivo, hasta el próximo año.",
"Her mobile: the newest one she confirmed, not the newest one sent.":
"Su celular: el más nuevo que ella confirmó, no el más nuevo que llegó.",
"Every other field falls back on the same order: the most trusted source, then the newest confirmed value, then the most complete.":
"Todos los demás campos recurren al mismo orden: la fuente más confiable, luego el valor confirmado más nuevo, luego el más completo.",
"And dbt turns the rules into the SQL, and into tests that check them.":
"Y dbt convierte las reglas en el SQL, y en pruebas que las verifican.",
"An email column holds one email. Linh has four.":
"Una columna de correo guarda un correo. Linh tiene cuatro.",
"Her student email, for her studies. Her staff email, for her tutoring.":
"Su correo de estudiante, para sus estudios. Su correo de personal, para sus tutorías.",
"A personal one from 2019, and a newer one from her application.":
"Uno personal de 2019, y otro más nuevo de su postulación.",
"None of them is wrong. Each is for something.":
"Ninguno está mal. Cada uno sirve para algo.",
"So each is kept as a contact point: its purpose, its source, and the day she last confirmed it.":
"Así que cada uno se guarda como punto de contacto: su propósito, su fuente y el día en que lo confirmó por última vez.",
"HR writes to her staff email. The alumni office, to a personal one.":
"RR. HH. le escribe a su correo de personal. La oficina de egresados, a uno personal.",
"Now each value in Linh's record says where it came from, which rule chose it, and how old it is.":
"Ahora cada valor del registro de Linh dice de dónde vino, qué regla lo eligió y qué antigüedad tiene.",
"The values that lost are still there, one click away.":
"Los valores que perdieron siguen ahí, a un clic.",
"So if anyone asks why her record says 14 March, the answer is right there.":
"Así, si alguien pregunta por qué su registro dice 14 de marzo, la respuesta está ahí mismo.",
"Her transcript, her class list and the alumni office all read from it.":
"Su certificado de notas, su lista de clase y la oficina de egresados leen de él.",
"Rules change too.":
"Las reglas también cambian.",
"The alumni office asks for a new one: for personal email, the one people confirmed most recently.":
"La oficina de egresados pide una nueva: para el correo personal, el que cada persona confirmó más recientemente.",
"Before it runs, a dry run lists every value it would change.":
"Antes de aplicarla, una simulación lista cada valor que cambiaría.",
"1,284, Linh's among them.":
"1284, entre ellos el de Linh.",
"Mei checks a sample, and the registrar, who owns the data, approves.":
"Mei revisa una muestra, y la jefatura de registro, responsable de los datos, la aprueba.",
"Then it runs, as version two, with its date.":
"Luego se aplica, como versión dos, con su fecha.",
"A bank knows two names too.":
"Un banco también conoce dos nombres.",
"Statements carry the account holder's legal name.":
"Los estados de cuenta llevan su nombre legal.",
"The app greets them by the one they chose.":
"La app saluda con el nombre que eligió.",
"A shop keeps a billing address and a delivery address, each for something.":
"Una tienda guarda una dirección de facturación y una de envío, cada una para algo.",
"Different places, the same question: which value, for what, and who says so.":
"Lugares distintos, la misma pregunta: qué valor, para qué, y quién lo dice.",
"In October 1836, the Beagle came home.":
"En octubre de 1836, el Beagle volvió a casa.",
"After five years around the world, its clocks were out by just thirty-three seconds.":
"Tras cinco años dando la vuelta al mundo, sus relojes se desviaron apenas 33 segundos.",
"Which clock to trust was settled before they disagreed, and checked at every port.":
"En qué reloj confiar se decidió antes de que discreparan, y se comprobó en cada puerto.",
"Linh's rules work the same way: written down before her records disagree, and tested every night.":
"Las reglas de Linh funcionan igual: escritas antes de que sus registros discrepen, y probadas cada noche.",
"The rule is declared, not hidden in the SQL.":
"La regla se declara, no se esconde en el SQL."
});
