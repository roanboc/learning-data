/* One person, many roles: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 1686, Sweden's church law asked every parish priest to keep a book of every household: who lived there, when they were born, whether they could read.":
"En 1686, la ley de la Iglesia de Suecia pidió a cada párroco llevar un libro de cada hogar: quién vivía ahí, cuándo nació, si sabía leer.",
"When someone moved, they carried a certificate to their new parish, and the next book took them in.":
"Si alguien se mudaba, llevaba un certificado a su nueva parroquia, y el libro siguiente lo acogía.",
"In 1947, the register gave everyone a number for life.":
"En 1947, el registro dio a cada persona un número para toda la vida.",
"One person, written down once, followed wherever they went.":
"Una persona, anotada una sola vez, seguida adondequiera que fuera.",
"Today, at the university. Linh Nguyen graduated here in 2022.":
"Hoy, en la universidad. Linh Nguyen se graduó aquí en 2022.",
"Last year, she came back to study health informatics.":
"El año pasado, volvió a estudiar informática en salud.",
"She applied online, and got a new student number.":
"Postuló en línea y recibió otro número de estudiante.",
"Nothing linked it to the number she graduated with.":
"Nada lo vinculaba al número con el que se graduó.",
"Now the university has five records of her.":
"Ahora la universidad tiene cinco registros de ella.",
"Two in the student system, under the old number and the new.":
"Dos en el sistema de estudiantes: el número antiguo y el nuevo.",
"One at the alumni office, which knows only the old one.":
"Uno en la oficina de egresados, que solo conoce el antiguo.",
"One in HR, which pays her to tutor a first-year unit.":
"Uno en RR. HH., que le paga por dar tutorías en primer año.",
"And one at the research office, for a project she joined this year.":
"Y uno en la oficina de investigación, por un proyecto de este año.",
"So her application asked for a transcript of the degree the university gave her.":
"Así que su solicitud pidió el certificado de notas del título que la misma universidad le dio.",
"And the alumni office invites her back, for a master's. She's already doing one.":
"Y la oficina de egresados la invita a volver, para una maestría. Ya está haciendo una.",
"Five records, five Linhs, and nobody sees that she's one person.":
"Cinco registros, cinco Linhs, y nadie ve que es una sola persona.",
"Linh is master data: one of the things the university is about, shared by every process and system.":
"Linh es un dato maestro: una de las cosas de las que trata la universidad, compartida por todos sus procesos y sistemas.",
"The lists that sort her, like “casual tutor” or a country, are reference data.":
"Las listas que la clasifican, como «tutora eventual» o un país, son datos de referencia.",
"What happens to her, an enrolment or a payslip, is transactional data.":
"Lo que le pasa, una matrícula o un recibo de sueldo, son datos transaccionales.",
"And the definition of a learner is metadata.":
"Y la definición de estudiante es un metadato.",
"This series is about the first two, and the next film tells them apart.":
"Esta serie trata de los dos primeros, y la próxima película los distingue.",
"Noor, the university's data architect, opens the university's own model.":
"Noor, la arquitecta de datos de la universidad, abre el modelo propio de la universidad.",
"It has a learner. A good one, with keys from three systems and a decision for every match.":
"Tiene un estudiante. Uno bueno, con claves de tres sistemas y una decisión para cada coincidencia.",
"But a learner isn't someone. It's how someone relates to the university, for a while.":
"Pero un estudiante no es alguien. Es cómo alguien se relaciona con la universidad, por un tiempo.",
"The model has no person. She says so, and writes it down.":
"El modelo no tiene persona. Ella lo dice, y lo anota.",
"So she draws four things apart.":
"Así que separa cuatro cosas.",
"The person: someone, once.":
"La persona: alguien, una sola vez.",
"The roles: student, tutor, researcher, each with a start, an end, and an owner.":
"Los roles: estudiante, tutora, investigadora, cada uno con un inicio, un fin y un responsable.",
"The contact points: an email or an address, each with a purpose, and some shared by two people.":
"Los puntos de contacto: un correo o una dirección, cada uno con un propósito, y algunos compartidos por dos personas.",
"And the identifiers: a student number belongs to the student system, a staff number to HR.":
"Y los identificadores: un número de estudiante pertenece al sistema de estudiantes; un número de personal, a RR. HH.",
"None of them is the person.":
"Ninguno de ellos es la persona.",
"Enterprise architects draw it the same way: a person, a team or an organisation is an actor, assigned to one or more roles, for a time.":
"Los arquitectos empresariales lo dibujan igual: una persona, un equipo o una organización es un actor, asignado a uno o más roles, por un tiempo.",
"Then Noor and Mei write down who keeps what.":
"Luego Noor y Mei anotan quién mantiene qué.",
"For each role, which system creates it, and who owns it.":
"Para cada rol, qué sistema lo crea y quién es su responsable.",
"For each piece of the person, which system is trusted.":
"Para cada dato de la persona, en qué sistema se confía.",
"The registrar's office keeps the legal name.":
"La oficina de registro mantiene el nombre legal.",
"Linh keeps her own preferred name, and her home address.":
"Linh mantiene ella misma su nombre preferido y su dirección.",
"HR keeps her work details.":
"RR. HH. mantiene sus datos laborales.",
"And Mei's office looks after the person: who someone is, and whether two records are one.":
"Y la oficina de Mei cuida a la persona: quién es alguien, y si dos registros son uno.",
"Every industry has a Linh.":
"Cada industria tiene una Linh.",
"A nurse admitted as a patient, in the same hospital.":
"Una enfermera ingresada como paciente, en el mismo hospital.",
"A bank customer who guarantees a friend's loan.":
"Una clienta del banco que avala el préstamo de un amigo.",
"A household where the account holder moved out, and the person who stays needs the power on.":
"Un hogar donde el titular de la cuenta se mudó, y la persona que se queda necesita seguir con luz.",
"Different words, the same four things.":
"Otras palabras, las mismas cuatro cosas.",
"The data management body of knowledge, DAMA, calls this reference and master data.":
"El cuerpo de conocimiento de la gestión de datos, DAMA, llama a esto datos de referencia y maestros.",
"It names four ways to keep it: a registry that only links, a copy for analysis, a master that systems read back, or one place where people are created.":
"Nombra cuatro formas de mantenerlos: un registro que solo enlaza, una copia para análisis, un maestro que los sistemas vuelven a leer, o un único lugar donde se crean las personas.",
"The series picks one later, and shows the tools that do it.":
"La serie elige una más adelante, y muestra sus herramientas.",
"People aren't the only master data.":
"No solo las personas son datos maestros.",
"The university also has employers and partner universities, awards and units, campuses and rooms.":
"La universidad también tiene empleadores y universidades asociadas, títulos y materias, sedes y aulas.",
"A hospital has patients, practitioners and wards.":
"Un hospital tiene pacientes, profesionales y salas.",
"A bank, customers, accounts and the firms it trades with.":
"Un banco, clientes, cuentas y las firmas con las que opera.",
"A utility, meters, connection points and poles.":
"Una eléctrica, medidores, puntos de conexión y postes.",
"A shop, products, suppliers and stores.":
"Una tienda, productos, proveedores y locales.",
"Which of them need mastering? Ask four questions.":
"¿Cuáles son datos maestros? Haz cuatro preguntas.",
"Is it a thing the business is about, not something that happens?":
"¿Es algo de lo que trata el negocio, y no algo que pasa?",
"Is it used by more than one process?":
"¿Lo usa más de un proceso?",
"Is it created or changed in more than one place, so the copies can disagree?":
"¿Se crea o se cambia en más de un lugar, de modo que las copias pueden no coincidir?",
"And does it matter when they do: money, safety, the law, or someone's trust?":
"¿Y importa cuando no coinciden: dinero, seguridad, la ley o la confianza de alguien?",
"Four yeses: master it.":
"Cuatro síes: dato maestro.",
"Eight more films follow, in four parts.":
"Siguen ocho películas más, en cuatro partes.",
"Who someone is. Roles and lists. Sharing it safely. And keeping it right.":
"Quién es alguien. Roles y listas. Compartirlo con seguridad. Y mantenerlo bien.",
"This time, when Linh applies, the university finds her first.":
"Esta vez, cuando Linh postula, la universidad la encuentra primero.",
"It adds a role, not a person.":
"Agrega un rol, no una persona.",
"Her degree is already there, and the alumni office sees she's back.":
"Su título ya está ahí, y la oficina de egresados ve que volvió.",
"Know the person, not just the role.":
"Conoce a la persona, no solo el rol."
});
