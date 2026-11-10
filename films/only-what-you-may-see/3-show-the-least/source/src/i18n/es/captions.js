/* Show the least: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in Who may see it and Governed in Unity Catalog: the classes are directa, indirecta, especial, seudónima and ninguna; the stars of a mask are asteriscos;
   scrambled is codificado; a student number un número de estudiante; the registrar's office la oficina de registro. The ways: dejarlo fuera, enmascararlo entero,
   enmascararlo en parte, generalizar, un hash con clave, un token, el cifrado, totales con las cifras pequeñas ocultas, filtrar filas. The roll is el padrón, the
   printed paper la papeleta, the box la urna; the help desk la mesa de ayuda; a vault una bóveda; Midwifery Partería. Numbers keep the picture's comma (2,614); tú,
   as the film speaks to the viewer. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Victoria, 1856: the colony is about to elect its first parliament.":
"Victoria, 1856: la colonia está por elegir su primer parlamento.",
"Until then, a man said his vote out loud, so anyone could learn it: his employer, his landlord, a candidate.":
"Hasta entonces, un hombre decía su voto en voz alta, y cualquiera podía saberlo: su patrón, su casero, un candidato.",
"A vote against them could cost a worker his job, or a tenant his home.":
"Un voto en su contra podía costarle a un trabajador su empleo, o a un inquilino su casa.",
"So a man might not dare vote as he wished. Something had to change.":
"Así que un hombre podía no atreverse a votar como quería. Algo tenía que cambiar.",
"That March, the colony passed a secret ballot, worked out by Henry Chapman, one of its lawmakers.":
"Ese marzo, la colonia aprobó el voto secreto, ideado por Henry Chapman, uno de sus legisladores.",
"An official marked the voter off the roll, and handed him a printed paper with every candidate's name.":
"Un funcionario marcaba al votante en el padrón y le daba una papeleta impresa con el nombre de cada candidato.",
"Alone, he crossed out the names he didn't want, folded it, and put it in the box.":
"A solas, tachaba los nombres que no quería, la doblaba y la metía en la urna.",
"At the end, the papers were counted, and the totals announced.":
"Al final, se contaban las papeletas y se anunciaban los totales.",
"Now a worker or a tenant could vote as he wished: nobody could see his vote, so nobody could punish him for it.":
"Ahora un trabajador o un inquilino podía votar como quería: nadie veía su voto, así que nadie podía castigarlo por él.",
"Britain took it up in 1872; by 1892, so had 38 American states.":
"Gran Bretaña lo adoptó en 1872; para 1892, también 38 estados de Estados Unidos.",
"The roll says who voted, and nothing about how. The box says how, and nothing about who.":
"El padrón dice quién votó, y nada de cómo. La urna dice cómo, y nada de quién.",
"Today, at the university, Anil Kurian studies how learners in the Faculty of Health progress.":
"Hoy, en la universidad, Anil Kurian estudia cómo avanzan los estudiantes de la Facultad de Salud.",
"Their records, as kept, would show him far more: names, birthdays, and which of his own faculty's learners have a disability.":
"Sus registros, tal como se guardan, le mostrarían mucho más: nombres, cumpleaños y qué estudiantes de su facultad tienen una discapacidad.",
"Hide it all, and the study can't follow anyone from one year to the next.":
"Si se oculta todo, el estudio no puede seguir a nadie de un año al siguiente.",
"So Mei Tanaka, who owns the records, picks a way to hide each column that keeps what the study needs.":
"Así que Mei Tanaka, dueña de los registros, elige para cada columna una forma de ocultarla que conserve lo que el estudio necesita.",
"The study follows 2,614 learners, year by year, and never sees who they are.":
"El estudio sigue a 2,614 estudiantes, año tras año, y nunca ve quiénes son.",
"And for data: show the least that still answers the question.":
"Y para los datos: muestra lo mínimo que aún responde la pregunta.",
"The study's agreement says what it may have: each learner's course and results, their year of birth, and a code in place of who they are.":
"El acuerdo dice qué puede tener el estudio: curso y resultados de cada estudiante, su año de nacimiento y un código en lugar de quién es.",
"And never anything that names a learner, or anything about their health.":
"Y nunca nada que nombre a un estudiante, ni nada sobre su salud.",
"Each column already has the class its owner set: direct, indirect, special, or none.":
"Cada columna ya tiene la clase que le dio su dueña: directa, indirecta, especial o ninguna.",
"So which way should hide each one? There are nine, and three questions tell them apart.":
"¿Qué forma debe ocultar cada una? Hay nueve, y tres preguntas las distinguen.",
"What does the reader see?":
"¿Qué ve quien lee?",
"Can it be undone, and by whom?":
"¿Se puede deshacer, y quién puede?",
"And what can the reader still work out?":
"¿Y qué puede todavía calcular quien lee?",
"Exam support is about health, and the agreement says never.":
"El apoyo en exámenes es sobre salud, y el acuerdo dice nunca.",
"So leave it out: the study isn't given the support table.":
"Así que se deja fuera: al estudio no se le da la tabla de apoyos.",
"Names and emails name a learner: the registrar's office needs them, the study never does, so mask them whole.":
"Los nombres y correos nombran a un estudiante: la oficina de registro los necesita, el estudio nunca, así que se enmascaran enteros.",
"The columns stay, but for the study every value reads as stars, and stars can't be turned back.":
"Las columnas siguen, pero para el estudio cada valor se lee como asteriscos, y los asteriscos no se pueden revertir.",
"The help desk needs a little more: to check it has the right learner on the phone.":
"La mesa de ayuda necesita un poco más: comprobar que tiene al estudiante correcto al teléfono.",
"So mask them in part: the last two digits, and the first letter.":
"Así que se enmascaran en parte: los dos últimos dígitos y la primera letra.",
"Enough to recognise a record, too little to look anyone up.":
"Lo bastante para reconocer un registro, muy poco para buscar a alguien.",
"The date of birth helps the study see how age shapes progress, so generalise it: 14 May 1987 becomes 1987.":
"La fecha de nacimiento ayuda a ver cómo la edad influye en el avance, así que se generaliza: 14 de mayo de 1987 pasa a 1987.",
"The day and month are gone, and can't come back.":
"El día y el mes desaparecen, y no pueden volver.",
"But hidden isn't anonymous: in a small course, one year of birth may fit only one learner.":
"Pero oculto no es anónimo: en un curso pequeño, un año de nacimiento puede corresponder a un solo estudiante.",
"So it stays indirect, and stays behind the agreement.":
"Así que sigue siendo indirecta, y sigue detrás del acuerdo.",
"Last, filter rows: the study gets only the Faculty of Health's 2,614 learners.":
"Por último, filtrar filas: el estudio recibe solo a los 2,614 estudiantes de la Facultad de Salud.",
"That hides no value; it leaves out other people's rows.":
"Eso no oculta ningún valor; deja fuera las filas de otras personas.",
"The study must follow each learner from year to year, so the student number becomes a code.":
"El estudio debe seguir a cada estudiante de un año a otro, así que el número de estudiante se vuelve un código.",
"The learner code you've seen before scrambles the number, and scrambled isn't anonymous: with the registrar's list, anyone can match it.":
"El código de estudiante que ya viste codifica el número, y codificado no es anónimo: con la lista de registro, cualquiera puede emparejarlo.",
"So the study's code mixes in a secret key: a keyed hash.":
"Así que el código del estudio mezcla una clave secreta: un hash con clave.",
"Without the key, the list matches nothing.":
"Sin la clave, la lista no empareja nada.",
"With it, the registrar's office can find whose code it is: undone, but only with the key, kept sealed, apart from the study.":
"Con ella, la oficina de registro puede saber de quién es el código: se deshace, pero solo con la clave, sellada y lejos del estudio.",
"So the code stays pseudonymous, behind the agreement.":
"Así que el código sigue siendo seudónimo, detrás del acuerdo.",
"In Britain's ballot of 1872, each paper had a number, matched to its voter only in a sealed packet, opened only to trace a fraud.":
"En el voto británico de 1872, cada papeleta tenía un número, unido al votante solo en un paquete sellado, abierto solo ante un fraude.",
"A token is a stand-in, paired with the real value in a vault: only the vault's owner can turn it back, to reach the person again.":
"Un token es un sustituto, unido al valor real en una bóveda: solo su dueño puede revertirlo, para volver a contactar a la persona.",
"This study reaches no one, so it takes the keyed hash.":
"Este estudio no contacta a nadie, así que usa el hash con clave.",
"And encryption keeps the whole value where it's stored or moved: unreadable without the key, all there for anyone allowed to read it.":
"Y el cifrado guarda el valor entero donde se almacena o se mueve: ilegible sin la clave, completo para quien puede leerlo.",
"When the study is done, it may publish totals, with any count under 10 hidden.":
"Cuando el estudio termine, puede publicar totales, con toda cifra menor que 10 oculta.",
"Here, learners who left after their first year, by course.":
"Aquí, estudiantes que dejaron tras su primer año, por curso.",
"Midwifery's 4 is a small count: in a class that size, people would know who left.":
"El 4 de Partería es una cifra pequeña: en una clase de ese tamaño, se sabría quién se fue.",
"So it reads: fewer than 10.":
"Así que dice: menos de 10.",
"But the faculty's total is there too: 80, less 38, 21 and 17, gives the 4 back.":
"Pero el total de la facultad también está: 80, menos 38, 21 y 17, devuelve el 4.",
"So one more count is hidden, and the 4 can't be worked out.":
"Así que se oculta una cifra más, y el 4 no se puede calcular.",
"Totals can't be undone, and they still answer the question: about 9 in 10 first-year learners went on to second year.":
"Los totales no se pueden deshacer, y aún responden la pregunta: cerca de 9 de cada 10 estudiantes de primer año pasaron a segundo.",
"As in 1856: everyone sees the totals, and nobody sees a vote.":
"Como en 1856: todos ven los totales, y nadie ve un voto.",
"So for each line of the agreement, Mei picks the way that keeps what the study needs.":
"Así, para cada línea del acuerdo, Mei elige la forma que conserva lo que el estudio necesita.",
"A code in place of who they are: a keyed hash.":
"Un código en lugar de quién es: un hash con clave.",
"Their year of birth: generalise.":
"Su año de nacimiento: generalizar.",
"Nothing that names a learner: mask it whole.":
"Nada que nombre a un estudiante: enmascararlo entero.",
"Nothing about their health: leave it out.":
"Nada sobre su salud: dejarlo fuera.",
"Only its 2,614 learners: filter rows. And only totals leave, with small counts hidden.":
"Solo sus 2,614 estudiantes: filtrar filas. Y solo salen totales, con las cifras pequeñas ocultas.",
"Each new column gets its class from her: the code pseudonymous, the year still indirect.":
"Cada columna nueva recibe de ella su clase: el código, seudónima; el año, aún indirecta.",
"Later films build these ways on the platform, so each class is hidden the same way, every time.":
"Las próximas películas construyen estas formas en la plataforma, para ocultar cada clase igual, siempre.",
"And an agent helping the study sees what the study sees, never more.":
"Y un agente que ayuda al estudio ve lo que ve el estudio, nunca más.",
"The roll, the box and the totals: each shows the least that still answers its question.":
"El padrón, la urna y los totales: cada uno muestra lo mínimo que aún responde su pregunta.",
"Samuel's row now answers the study's question, and says nothing about who he is.":
"La fila de Samuel ahora responde la pregunta del estudio, y no dice nada de quién es.",
"Show the least that still answers the question.":
"Muestra lo mínimo que aún responde la pregunta."
});
