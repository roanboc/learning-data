/* Lists everyone uses: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   A value the film shows on screen keeps its English spelling, in «», as the systems store it.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Airlines know each airport by three letters.":
"Las aerolíneas conocen cada aeropuerto por tres letras.",
"Toronto's main airport is YYZ, after the old station code of Malton, where it stands.":
"El aeropuerto principal de Toronto es YYZ, por el antiguo código de estación de Malton, donde está.",
"Ho Chi Minh City's is SGN. The city took that name in 1976, and its code still says Saigon.":
"El de Ciudad Ho Chi Minh es SGN. La ciudad tomó ese nombre en 1976, y su código aún dice Saigón.",
"A code outlives its reason, because changing it costs everyone who uses it.":
"Un código sobrevive a su razón, porque cambiarlo les cuesta a todos los que lo usan.",
"A university runs on lists like these.":
"Una universidad funciona con listas como estas.",
"Linh studies here, and tutors a first-year unit.":
"Linh estudia aquí y da tutorías en primer año.",
"HR calls her a Casual Academic. Payroll calls her CAS. The learning platform calls her a tutor.":
"RR. HH. la llama «Casual Academic». Nómina, «CAS». La plataforma de aprendizaje, «tutor».",
"Three names for one role, and nothing written down says they match.":
"Tres nombres para un rol, y nada escrito dice que coinciden.",
"HR's own list of roles lives in a spreadsheet, attached to an email.":
"La lista de roles de RR. HH. vive en una hoja de cálculo, adjunta a un correo.",
"And no one has written down which kinds of identifier the university issues.":
"Y nadie ha anotado qué tipos de identificador emite la universidad.",
"Her status is ENR in the student system, and active on the learning platform.":
"Su estado es «ENR» en el sistema de estudiantes, y «active» en la plataforma de aprendizaje.",
"One file maps both to studying.":
"Un archivo mapea ambos a «studying».",
"Then two tests type the list of statuses again, by hand.":
"Luego dos pruebas vuelven a escribir la lista de estados, a mano.",
"Her country of birth is Vietnam in HR, Viet Nam in the student system, and VN at the research office.":
"Su país de nacimiento es «Vietnam» en RR. HH., «Viet Nam» en el sistema de estudiantes y «VN» en la oficina de investigación.",
"So a count of people by country lists her country three times.":
"Así, un conteo de personas por país muestra su país tres veces.",
"These are reference data: short lists that sort and describe everything else.":
"Estos son datos de referencia: listas cortas que clasifican y describen todo lo demás.",
"Some are the university's own, like role types. Others come from outside, like countries, or airport codes.":
"Algunas son de la propia universidad, como los tipos de rol. Otras vienen de fuera, como los países o los códigos de aeropuerto.",
"Each value has a code that systems store, and a label that people read.":
"Cada valor tiene un código para los sistemas y una etiqueta para las personas.",
"Jun, the analytics engineer, gives each list one home.":
"Jun, de ingeniería analítica, le da a cada lista un solo hogar.",
"Role types, identifier types, relationship types, consent purposes, and countries.":
"Tipos de rol, tipos de identificador, tipos de relación, propósitos de consentimiento y países.",
"Each is a table: every value with its code and label, who owns it, and the date it applies from.":
"Cada una es una tabla: cada valor con su código y etiqueta, su responsable y la fecha desde la que aplica.",
"HR owns tutor, and the registrar's office owns student.":
"«tutor» es de RR. HH., y «student», de la oficina de registro.",
"Beside it, each system's own names are mapped: Casual Academic, CAS and tutor all mean tutor.":
"Al lado se mapean los nombres de cada sistema: «Casual Academic», «CAS» y «tutor» significan «tutor».",
"Now the tests read their allowed values from the list, instead of typing them.":
"Ahora las pruebas leen sus valores permitidos desde la lista, en vez de escribirlos.",
"Change the list once, and every test that reads it follows.":
"Cambia la lista una vez, y todas las pruebas que la leen la siguen.",
"On the platform, each list is one table, and its lineage shows the tables and reports that read it.":
"En la plataforma, cada lista es una tabla, y su linaje muestra las tablas y los reportes que la leen.",
"Next year, HR will call the role Sessional Academic.":
"El próximo año, RR. HH. llamará al rol «Sessional Academic».",
"The change is a pull request, and HR, who owns tutor, approves it.":
"El cambio es un pull request, y RR. HH., responsable de «tutor», lo aprueba.",
"The new name applies from the first of January.":
"El nuevo nombre rige desde el 1 de enero.",
"The old one isn't deleted. It's ended, because Linh's past contracts still use it.":
"El antiguo no se borra. Se cierra, porque los contratos anteriores de Linh aún lo usan.",
"Some lists belong to someone else.":
"Algunas listas son de alguien más.",
"Countries come from the international standard, ISO 3166, loaded on a schedule.":
"Los países vienen del estándar internacional, ISO 3166, que se carga de forma programada.",
"Like the project's glossary, the list is copied, never typed again.":
"Como el glosario del proyecto, la lista se copia, nunca se vuelve a escribir.",
"Viet Nam appears once, with one code: VN.":
"Viet Nam aparece una vez, con un solo código: VN.",
"And the count by country lists her country once.":
"Y el conteo por país muestra su país una sola vez.",
"Some lists describe people, like titles or gender.":
"Algunas listas describen personas, como tratamiento o género.",
"Those stay short and inclusive, and are asked for only with a purpose.":
"Esas se mantienen cortas e inclusivas, y solo se piden con un propósito.",
"A title can tell whether someone is married. If it isn't needed, it isn't asked.":
"Un tratamiento puede revelar si una persona está casada. Si no hace falta, no se pregunta.",
"Every industry runs on lists like these.":
"Toda industria funciona con listas como estas.",
"A bank's customer types decide which checks each customer goes through.":
"Los tipos de cliente de un banco deciden qué controles pasa cada cliente.",
"A hospital's relationship types decide who may be told about a patient.":
"En un hospital, los tipos de relación deciden quién puede saber de un paciente.",
"Get a list wrong, and the wrong thing happens to a real person.":
"Si una lista está mal, a una persona real le pasa lo que no debía.",
"Now Linh's role, her status and her country each come from one list.":
"Ahora el rol, el estado y el país de Linh vienen cada uno de una sola lista.",
"Like an airport code, a value can outlive its reason. But now everyone knows who keeps it, and from when it applies.":
"Como un código de aeropuerto, un valor puede sobrevivir a su razón. Pero ahora todos saben quién lo mantiene, y desde cuándo aplica.",
"A list has an owner, a date and one home.":
"Una lista tiene responsable, fecha y un solo hogar."
});
