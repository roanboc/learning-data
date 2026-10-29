/* Governed in Unity Catalog: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in Who may see it: the classes are directa, seudónima and ninguna; the stars of a mask are asteriscos; a tag is una etiqueta, a code un código, a student number
   un número de estudiante, the learner table la tabla de estudiantes, and the registrar's office la oficina de registro; a purpose and an end date are un propósito y una
   fecha de fin. As in Governed in dbt: dueño, una construcción for a build, el control for the check, la plataforma, el catálogo. Here a grant is un permiso (to grant,
   conceder), scrambled is codificado, a log una bitácora, preview versión preliminar, and next term's places los cupos del próximo semestre. Discover and dbt keep
   their names. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Today, in the platform team's room.":
"Hoy, en la sala del equipo de plataforma.",
"Sam Okafor runs the data platform, where the university's tables are kept and read.":
"Sam Okafor dirige la plataforma de datos, donde se guardan y se leen las tablas de la universidad.",
"Yusuf asks him who can read the learner table, with every learner's name, email and student number.":
"Yusuf le pregunta quién puede leer la tabla de estudiantes, con el nombre, el correo y el número de cada estudiante.",
"When Yusuf first asked what slowed him down, Sam said: tell me which column, I'll protect it in minutes.":
"Cuando Yusuf le preguntó qué lo frenaba, Sam dijo: dime qué columna, y la protejo en minutos.",
"Nobody could tell him, so access was all or nothing, given by hand:":
"Nadie podía decírselo, así que el acceso era todo o nada, dado a mano:",
"a form, an emailed approval, and three weeks later, the whole table, to one person, with no end date.":
"un formulario, una aprobación por correo, y tres semanas después, toda la tabla, a una persona, sin fecha de fin.",
"Sam finds forty-one people who can read it.":
"Sam encuentra cuarenta y una personas que pueden leerla.",
"Nine have moved to other jobs, and still see every learner's name and email.":
"Nueve cambiaron de puesto, y todavía ven el nombre y el correo de cada estudiante.",
"Something had to change.":
"Algo tenía que cambiar.",
"Now each build tells the platform which columns identify a person, from the classes in the project.":
"Ahora cada construcción le dice a la plataforma qué columnas identifican a una persona, según las clases del proyecto.",
"One policy shows stars in those columns to everyone outside the registrar's office, on every table, even tables not built yet.":
"Una sola política muestra asteriscos en esas columnas a todos fuera de la oficina de registro, en cada tabla, aun las que no existen.",
"And access goes to groups, until a date.":
"Y el acceso va a grupos, hasta una fecha.",
"By the end of December, two groups can read the learner table, not forty-one people.":
"A fines de diciembre, dos grupos pueden leer la tabla de estudiantes, no cuarenta y una personas.",
"Each new table is protected as it's built.":
"Cada tabla nueva queda protegida al construirse.",
"And Sam protects a column in minutes, because the project tells him which.":
"Y Sam protege una columna en minutos, porque el proyecto le dice cuál.",
"On the platform, the project's tables sit in the university's catalog, a schema for each layer the project builds.":
"En la plataforma, las tablas del proyecto están en el catálogo de la universidad, un esquema por cada capa que construye.",
"But people look for data by area, not by layer.":
"Pero la gente busca datos por área, no por capa.",
"So each table carries its area as a tag, from the domain its model names,":
"Así que cada tabla lleva su área como etiqueta, del dominio que nombra su modelo,",
"and the Discover page lays the tables out by area: student, course, planning, finance, and more.":
"y la página Discover ordena las tablas por área: estudiante, curso, planificación, finanzas, y más.",
"Who may read a table is a grant, and a grant goes to a group, never to a person.":
"Quién puede leer una tabla es un permiso, y un permiso va a un grupo, nunca a una persona.",
"In the project, each column's class says whether it identifies a person: direct, pseudonymous or none.":
"En el proyecto, la clase de cada columna dice si identifica a una persona: directa, seudónima o ninguna.",
"After each table builds, dbt writes the class to the platform, as a tag on the column.":
"Después de construir cada tabla, dbt escribe la clase en la plataforma, como etiqueta en la columna.",
"The tag is governed: an admin created it once, with only those three values, so nobody can tag a column \"maybe\".":
"La etiqueta está gobernada: un administrador la creó una vez, solo con esos tres valores, y nadie puede poner \"quizás\".",
"Change a class in the project, and the next build changes the tag.":
"Cambia una clase en el proyecto, y la siguiente construcción cambia la etiqueta.",
"For tables the project doesn't build, the platform's classifier finds columns that look personal, for their owner to class.":
"Para tablas fuera del proyecto, el clasificador de la plataforma halla columnas que parecen personales, y su dueño las clasifica.",
"Then one policy masks every column tagged direct, in the whole catalog, for everyone but the registrar's office.":
"Luego una política enmascara cada columna etiquetada directa, en todo el catálogo, para todos menos la oficina de registro.",
"It isn't set table by table: a table built tomorrow, with an email in it, is masked as soon as it's tagged.":
"No se define tabla por tabla: una tabla construida mañana, con un correo, queda enmascarada en cuanto se etiqueta.",
"A policy can filter rows the same way; this one masks.":
"Una política puede filtrar filas de la misma forma; esta enmascara.",
"Clara reads the learner table, and sees each learner's status, and stars where the names and emails are.":
"Clara lee la tabla de estudiantes, y ve el estado de cada uno, y asteriscos donde están los nombres y los correos.",
"The registrar's office sees the values, and so does the identity that runs the build.":
"La oficina de registro ve los valores, y también la identidad que ejecuta la construcción.",
"The learner code is pseudonymous: the student number, scrambled the same way in every table, so tables can be joined without names.":
"El código de estudiante es seudónimo: el número de estudiante, codificado igual en cada tabla, para unir tablas sin nombres.",
"Scrambled isn't anonymous.":
"Codificado no es anónimo.",
"With the registrar's list, anyone can scramble every number on it and match them.":
"Con la lista de la oficina de registro, cualquiera puede codificar cada número y hacerlos coincidir.",
"So the code is still personal: the policy leaves it readable, for counting, and reading it takes a purpose and an end date.":
"Así que el código sigue siendo personal: la política lo deja legible, para contar, y leerlo pide un propósito y una fecha de fin.",
"Access goes to groups, never to people.":
"El acceso va a grupos, nunca a personas.",
"Mei, for the registrar's office, said yes to Clara: to plan next term's places, until 15 December.":
"Mei, por la oficina de registro, le dijo que sí a Clara: para los cupos del próximo semestre, hasta el 15 de diciembre.",
"So Sam doesn't grant the table to Clara.":
"Así que Sam no le concede la tabla a Clara.",
"He grants it to a Planning group, and Clara joins the group in the university's directory, until that date.":
"Se la concede a un grupo de Planificación, y Clara entra al grupo en el directorio de la universidad, hasta esa fecha.",
"The platform reads its groups from there.":
"La plataforma lee sus grupos de ahí.",
"When someone changes jobs, the directory moves them, and their access follows.":
"Cuando alguien cambia de puesto, el directorio lo mueve, y su acceso lo sigue.",
"On 15 December, her access ends by itself.":
"El 15 de diciembre, su acceso termina solo.",
"The platform also draws each column's lineage.":
"La plataforma también dibuja el linaje de cada columna.",
"Pick the learner's email, and it shows every table it flows into, down to the column.":
"Elige el correo del estudiante, y muestra cada tabla a la que llega, hasta la columna.",
"Tags can follow lineage by themselves, in beta.":
"Las etiquetas pueden seguir el linaje solas, en beta.",
"Here they don't need to: every table the email reaches is built by the project, which classes it there too,":
"Aquí no hace falta: cada tabla a la que llega el correo la construye el proyecto, que también la clasifica allí,",
"and the check stops a table that doesn't.":
"y el control detiene una tabla que no lo hace.",
"And the platform keeps a log, in preview, of who read each table, and when.":
"Y la plataforma lleva una bitácora, en versión preliminar, de quién leyó cada tabla, y cuándo.",
"So Sam can answer what Yusuf wanted to know: who read the learner table this month.":
"Así Sam puede responder lo que Yusuf quería saber: quién leyó la tabla de estudiantes este mes.",
"Each December, the access review reads the grants themselves: who can read each table, through which group, and who's in it.":
"Cada diciembre, la revisión de accesos lee los permisos mismos: quién puede leer cada tabla, por qué grupo, y quién está en él.",
"Forty-one people gave way to two groups:":
"Cuarenta y una personas dieron paso a dos grupos:",
"the registrar's office, which keeps the learners' records, and the data team, which builds the tables.":
"la oficina de registro, que guarda los expedientes de los estudiantes, y el equipo de datos, que construye las tablas.",
"Clara plans next term's places with the statuses she needs, and stars where the names are.":
"Clara planifica los cupos del próximo semestre con los estados que necesita, y asteriscos donde están los nombres.",
"On Noor's map, the project says what each column is, and the platform holds the line:":
"En el mapa de Noor, el proyecto dice qué es cada columna, y la plataforma lo hace valer:",
"classes become tags, tags meet one policy, and groups carry the dates.":
"las clases pasan a etiquetas, las etiquetas a una política, y los grupos llevan las fechas.",
"Sam protects a column in minutes now, because the project tells him which.":
"Ahora Sam protege una columna en minutos, porque el proyecto le dice cuál.",
"The platform enforces what the metadata says.":
"La plataforma hace cumplir lo que dicen los metadatos."
});
