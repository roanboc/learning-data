/* Who may see it: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series: Planificación, título for an award, dueño, gobernanza; the registrar's office is la oficina de registro, as in the master data films. The classes are
   directa, seudónima and ninguna; the stars of a mask are asteriscos; the access list is la lista de accesos, a label una etiqueta, a code un código, a student number un número de estudiante. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"West Germany, April 1983.":
"Alemania Occidental, abril de 1983.",
"Every resident is to answer the census, so the country can plan housing, schools and transport.":
"Cada residente debe responder el censo, para que el país planifique vivienda, escuelas y transporte.",
"But the same law lets each town hall add the answers, by name, to its records on each resident.":
"Pero la misma ley deja que cada municipio agregue las respuestas, con nombre, a sus registros de cada residente.",
"With computers, answers like these add up to a picture of each person, and nobody knows who will see it, or what for.":
"Con computadoras, respuestas como estas forman un retrato de cada persona, y nadie sabe quién lo verá, ni para qué.",
"Hundreds of groups call for a boycott.":
"Cientos de grupos llaman al boicot.",
"The Constitutional Court stops the count.":
"El Tribunal Constitucional detiene el conteo.",
"The country still needs a way to count, without knowing who said what.":
"El país aún necesita una forma de contar, sin saber quién dijo qué.",
"The court rules that, in principle, each person decides what is disclosed about them, and how it's used.":
"El tribunal falla que, en principio, cada persona decide qué se revela sobre ella y cómo se usa.",
"The court doesn't forbid counting.":
"El tribunal no prohíbe contar.",
"It draws a line.":
"Traza una línea.",
"Names and addresses are kept apart from the answers, and removed as soon as possible.":
"Los nombres y las direcciones se guardan aparte de las respuestas, y se eliminan lo antes posible.",
"And answers given to be counted never go into the town hall's records.":
"Y las respuestas dadas para contar nunca entran en los registros del municipio.",
"In 1987, the count goes ahead that way: the country counts its 61 million people, and they keep their privacy.":
"En 1987, el censo se hace así: el país cuenta a sus 61 millones de personas, y ellas conservan su privacidad.",
"Counting people is one permission.":
"Contar personas es un permiso.",
"Knowing who they are is another.":
"Saber quiénes son es otro.",
"In a university's data, the court's line runs between columns: who may see each one, for what, and until when.":
"En los datos de una universidad, la línea del tribunal pasa entre columnas: quién puede ver cada una, para qué y hasta cuándo.",
"The university has a census too.":
"La universidad también tiene un censo.",
"Planning counts its learners, and its list of those near an award has no names: counting doesn't need them.":
"Planificación cuenta a sus estudiantes, y su lista de quienes están cerca de un título no tiene nombres: contar no los necesita.",
"Clara, in Planning, wants to know which of them are still studying, to plan next term's places.":
"Clara, de Planificación, quiere saber cuáles siguen estudiando, para planificar los cupos del próximo periodo.",
"For that, she needs each learner's status, from the learner table.":
"Para eso necesita el estado de cada estudiante, de la tabla de estudiantes.",
"Yusuf opens the next binder.":
"Yusuf abre la siguiente carpeta.",
"Policy 6, Data protection, says personal data is classified and protected.":
"La política 6, Protección de datos, dice que los datos personales se clasifican y protegen.",
"It doesn't say which data, or how.":
"No dice qué datos, ni cómo.",
"Until now, a request like Clara's went one way.":
"Hasta ahora, una solicitud como la de Clara seguía un camino.",
"A form.":
"Un formulario.",
"An approval, by email.":
"Una aprobación, por correo.",
"Three weeks later, the whole learner table, names and emails included, granted to her by name.":
"Tres semanas después, toda la tabla de estudiantes, con nombres y correos, concedida a ella por nombre.",
"And nothing ever ended it.":
"Y nada le puso fin.",
"The platform team checks who can read that table today: forty-one people.":
"El equipo de plataforma revisa quién puede leer esa tabla hoy: cuarenta y una personas.",
"Nine have moved to other jobs, and still see every learner's name and email.":
"Nueve ya están en otros puestos, y aún ven el nombre y el correo de cada estudiante.",
"Nobody did anything wrong.":
"Nadie hizo nada mal.",
"The path just had no end.":
"El camino no tenía final.",
"Now the path starts somewhere else: at the column.":
"Ahora el camino empieza en otro lugar: en la columna.",
"Every column other teams read carries a class: what it tells about a person.":
"Cada columna que leen otros equipos lleva una clase: lo que dice de una persona.",
"Direct, if it identifies someone by itself, like a name or an email.":
"Directa, si identifica a alguien por sí sola, como un nombre o un correo.",
"Pseudonymous, if it only can with something kept elsewhere.":
"Seudónima, si solo puede con algo que se guarda en otro lugar.",
"Or none.":
"O ninguna.",
"Each owner writes the classes in a register, column by column.":
"Cada dueño escribe las clases en un registro, columna por columna.",
"And every change is checked: a column with no class goes to its owner, with a question.":
"Y cada cambio se revisa: una columna sin clase va a su dueño, con una pregunta.",
"One reached Mei: a credential's code.":
"Una llegó a Mei: el código de una credencial.",
"It looks harmless, and most are.":
"Parece inofensivo, y casi todos lo son.",
"But an award's code holds the student number.":
"Pero el código de un título lleva el número de estudiante.",
"Nothing can be assumed insignificant.":
"Nada puede darse por insignificante.",
"Mei classed it direct: the court's line, drawn at the column.":
"Mei la clasificó directa: la línea del tribunal, trazada en la columna.",
"The class travels with its column, as a label, into every table the column reaches.":
"La clase viaja con su columna, como etiqueta, a cada tabla a la que llega la columna.",
"One rule reads the label: the registrar's office sees direct personal data, and everyone else sees stars.":
"Una regla lee la etiqueta: la oficina de registro ve los datos personales directos, y los demás ven asteriscos.",
"The platform team applies it by label, not table by table.":
"El equipo de plataforma la aplica por etiqueta, no tabla por tabla.",
"So the email is masked in every table it reaches, and in tables built tomorrow.":
"Así, el correo se enmascara en cada tabla a la que llega, y en las tablas de mañana.",
"Clara's request goes to the registrar's office, which owns the learner table.":
"La solicitud de Clara va a la oficina de registro, dueña de la tabla de estudiantes.",
"Mei says yes, for her office: to plan next term's places, until 15 December.":
"Mei dice que sí, por su oficina: para planificar los cupos, hasta el 15 de diciembre.",
"The access goes to a Planning group, not to Clara by name, and ends by itself on that date.":
"El acceso va a un grupo de Planificación, no a Clara por nombre, y termina solo en esa fecha.",
"Clara sees each learner's code and status.":
"Clara ve el código y el estado de cada estudiante.",
"Student numbers, names and emails are stars.":
"Números de estudiante, nombres y correos son asteriscos.",
"The learner code names no one by itself.":
"El código de estudiante no nombra a nadie por sí solo.",
"But with the registrar's list, it leads back to a person.":
"Pero con la lista de la oficina de registro, lleva hasta una persona.",
"So it's still personal data: even codes come with a purpose and an end date.":
"Así que sigue siendo personal: hasta los códigos llevan un propósito y una fecha de fin.",
"The data team's AI agent sees stars too, and works from counts and samples.":
"El agente de IA del equipo de datos también ve asteriscos, y trabaja con conteos y muestras.",
"Clara asks Yusuf why the names are stars.":
"Clara pregunta a Yusuf por qué los nombres son asteriscos.",
"He tells her why, as the court did: Planning counts learners; it doesn't need to know who they are.":
"Le dice por qué, como hizo el tribunal: Planificación cuenta estudiantes; no necesita saber quiénes son.",
"And he shows her the way to more: if a purpose needs names, she asks the registrar's office, and says what it's for.":
"Y le muestra cómo obtener más: si un propósito necesita nombres, le pide a la oficina de registro, y dice para qué.",
"A no without a way forward is how tables end up copied into spreadsheets.":
"Un no sin salida es como las tablas terminan copiadas en hojas de cálculo.",
"Clara's plan goes to the faculties, and on 15 December her access ends by itself.":
"El plan de Clara va a las facultades, y el 15 de diciembre su acceso termina solo.",
"Later that month, Yusuf's review takes minutes: he reads the access list itself.":
"Más tarde ese mes, la revisión de Yusuf toma minutos: lee la propia lista de accesos.",
"The forty-one names are two groups now, each with a reason to be there.":
"Los cuarenta y un nombres son ahora dos grupos, cada uno con una razón para estar ahí.",
"Policy 6 now says which data, and how: owners class each column, and decide who may see it, for what, and until when.":
"La política 6 ahora dice qué datos, y cómo: los dueños clasifican cada columna, y deciden quién puede verla, para qué y hasta cuándo.",
"The platform team protects each class, and Yusuf reviews who has access.":
"El equipo de plataforma protege cada clase, y Yusuf revisa quién tiene acceso.",
"Like the census of 1987, Planning gets its numbers, and learners keep their privacy.":
"Como en el censo de 1987, Planificación obtiene sus cifras, y los estudiantes conservan su privacidad.",
"Classify once, at the column, and protect it everywhere.":
"Clasifica una vez, en la columna, y protégela en todas partes."
});
