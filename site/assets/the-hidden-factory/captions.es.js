/* The hidden factory: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module and the series: la lista de graduación, el diploma (a certificate printed), el graduado, la imprenta, impreso de nuevo; un control for a
   check, que retiene (holds) o detiene (stops); la oficina de registro académico (the registrar's office), la oficina de Mei; el sistema de estudiantes; el portal;
   el equipo de graduaciones; la hoja de cálculo, la copia; el apellido (the family name) and el campo (the field), las tildes (accents); el cuadro de mando (the
   scorecard); la plataforma. Redman's hidden data factory is la fábrica oculta de datos, and Feigenbaum's hidden plant la planta oculta; the fishbone, una espina de
   pescado, its bones las espinas; the governance film Fixed where it starts is called by its Spanish title, Arreglado en el origen. In 1899, the Dead Letter Office
   is la Oficina de Cartas Muertas and its readers, los empleados; the ZIP Code is el código ZIP. Numbers keep the picture's comma (2,031), as the module's other
   Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Washington, 1899.":
"Washington, 1899.",
"More than six million letters and parcels a year end up in one office: the Dead Letter Office.":
"Más de seis millones de cartas y paquetes al año terminan en una oficina: la Oficina de Cartas Muertas.",
"A dead letter is one the post can't deliver, and can't send back.":
"Una carta muerta es una que el correo no puede entregar ni devolver.",
"Most often, people have moved on without leaving an address.":
"Casi siempre, la gente se mudó sin dejar una dirección.",
"Or a letter to a city gives no street and number, or a town is spelt the way it sounds.":
"O una carta a una ciudad no lleva calle ni número, o un pueblo está escrito como suena.",
"In one room, clerks, many of them women, work out where each should have gone.":
"En una sala, empleados, muchos de ellos mujeres, averiguan adónde debía ir cada una.",
"The best known, Patti Lyle Collins, works out about a thousand a day.":
"La más conocida, Patti Lyle Collins, resuelve unas mil al día.",
"It's skilled work, unseen by the senders, and it never fixes the next letter.":
"Es un trabajo experto, que los remitentes no ven, y nunca arregla la carta siguiente.",
"Nearly three million a year are destroyed: news someone never gets.":
"Casi tres millones al año se destruyen: noticias que alguien nunca recibe.",
"Something has to change where the address is written, not where it ends up.":
"Algo tiene que cambiar donde se escribe la dirección, no donde termina la carta.",
"In 1943, with experienced clerks gone to the war, big cities get zones: a number the sender writes, so new clerks can sort by it.":
"En 1943, con los expertos en la guerra, las ciudades grandes tienen zonas: un número que pone el remitente, y los nuevos clasifican por él.",
"In 1963, the post brings in the ZIP Code: five digits on every letter, written by the sender.":
"En 1963, el correo crea el código ZIP: cinco dígitos en cada carta, escritos por el remitente.",
"Now anyone, and soon machines, can sort a letter by its number.":
"Ahora cualquiera, y pronto las máquinas, clasifica una carta por su número.",
"By 1969, 83% of Americans use it, and it has saved the post billions since.":
"En 1969 lo usa el 83% de los estadounidenses; desde entonces, ha ahorrado miles de millones.",
"The fix moved to the start: written once, by the person who knows the address.":
"El arreglo pasó al principio: escrito una vez, por la persona que conoce la dirección.",
"At the university, two people put the graduation list's names right by hand before every ceremony, in a copy.":
"En la universidad, dos personas corrigen a mano los nombres de la lista de graduación antes de cada ceremonia, en una copia.",
"So every new list brings the same errors back.":
"Así que cada lista nueva trae de vuelta los mismos errores.",
"Count that work, fix each error where it's born, and a name is put right once, for every list after.":
"Cuenta ese trabajo, arregla cada error donde nace, y un nombre se corrige una vez, para todas las listas siguientes.",
"Malia Fonoti runs the graduations. Before each list goes to the printer, she and a colleague check every name by hand.":
"Malia Fonoti lleva las graduaciones. Antes de que cada lista vaya a la imprenta, ella y alguien de su equipo revisan cada nombre a mano.",
"On Monday 20 October 2025, they download December's list from the platform into a spreadsheet: 2,031 names.":
"El lunes 20 de octubre de 2025, descargan la lista de diciembre de la plataforma a una hoja de cálculo: 2,031 nombres.",
"Each is checked against the documents seen at enrolment; where it doesn't match, they phone the graduate.":
"Cada uno se compara con los documentos vistos en la matrícula; si no coincide, llaman al graduado.",
"They correct the spreadsheet, and on 13 November it goes to the printer.":
"Corrigen la hoja de cálculo, y el 13 de noviembre va a la imprenta.",
"In December, 41 certificates still have to be printed again.":
"En diciembre, aún hay que imprimir de nuevo 41 diplomas.",
"Yet in February, a close look at a hundred of the list's records found 21 with an error.":
"Pero en febrero, una revisión detallada de cien registros de la lista halló 21 con un error.",
"One record in five, but only 41 certificates in 2,031?":
"¿Un registro de cada cinco, pero solo 41 diplomas de 2,031?",
"Like the readers in Washington, Malia's team puts the rest right at the end, unseen.":
"Como los empleados de Washington, el equipo de Malia corrige el resto al final, sin que nadie lo vea.",
"Thomas Redman, who has spent his career on data quality, calls this a hidden data factory:":
"Thomas Redman, que ha dedicado su carrera a la calidad de datos, llama a esto una fábrica oculta de datos:",
"the extra steps one team adds to put right the data another team makes.":
"los pasos extra que un equipo añade para corregir los datos que hace otro equipo.",
"Decades before, in factories, Armand Feigenbaum called it the hidden plant.":
"Décadas antes, en las fábricas, Armand Feigenbaum la llamó la planta oculta.",
"It's careful work, and until the errors stop, it's needed.":
"Es un trabajo cuidadoso y, mientras sigan los errores, hace falta.",
"But it hides three things.":
"Pero esconde tres cosas.",
"The hours, because nobody counts them.":
"Las horas, porque nadie las cuenta.",
"How good the data really is, because the printer sees only what gets past.":
"Qué tan buenos son de verdad los datos, porque la imprenta solo ve lo que se escapa.",
"And the cause, because no fix reaches the place where the errors are born.":
"Y la causa, porque ningún arreglo llega al lugar donde nacen los errores.",
"Redman's advice: count it, then take what you find to the people who make the data.":
"El consejo de Redman: cuéntalo, y lleva lo que encuentres a las personas que hacen los datos.",
"In August 2026, Noor Rahman, the data architect, counts it with Malia, three ways.":
"En agosto de 2026, Noor Rahman, la arquitecta de datos, lo cuenta con Malia, de tres maneras.",
"The hours, from the team's own calendar: about 240 for December's list, 50 for March's, 30 for July's.":
"Las horas, del propio calendario del equipo: unas 240 para la lista de diciembre, 50 para la de marzo, 30 para la de julio.",
"320 hours a year: two months of one person's work.":
"320 horas al año: dos meses de trabajo de una persona.",
"The rounds, from Databricks' system tables:":
"Las rondas, de las tablas de sistema de Databricks:",
"its query history and audit log show the list queried and downloaded on three Mondays, one before each list.":
"su historial de consultas y su registro de auditoría muestran la lista consultada y descargada tres lunes, uno antes de cada lista.",
"And the corrections: December's copy, as it went to the printer, against the list the platform built the night before.":
"Y las correcciones: la copia de diciembre, tal como fue a la imprenta, frente a la lista que la plataforma armó la noche anterior.",
"517 names had been changed by hand, and 26 more had got past them: the names printed again.":
"517 nombres se habían cambiado a mano, y otros 26 se les habían escapado: los nombres impresos de nuevo.",
"So 543 of 2,031 names were wrong when the list left the platform: about one in four.":
"Así que 543 de 2,031 nombres estaban mal al salir de la plataforma: uno de cada cuatro.",
"A right name takes about two minutes to check. A wrong one, about twenty: find the document, phone the graduate, type it again.":
"Un nombre correcto tarda unos dos minutos en revisarse. Uno mal, unos veinte: buscar el documento, llamar, escribirlo otra vez.",
"So the wrong names took about 170 of December's 240 hours.":
"Así que los nombres mal se llevaron unas 170 de las 240 horas de diciembre.",
"Redman's rule of ten, a rule of thumb: a record with an error costs about ten times as much to finish.":
"La regla del diez de Redman, una regla práctica: un registro con un error cuesta unas diez veces más terminarlo.",
"Beatriz Fonseca de Albuquerque Cavalcanti graduates twice this year: a graduate certificate in March, a master's in December.":
"Beatriz Fonseca de Albuquerque Cavalcanti se gradúa dos veces este año: un certificado de posgrado en marzo y una maestría en diciembre.",
"Her family name has 33 characters.":
"Su apellido tiene 33 caracteres.",
"In February, the portal showed it cut short, and she corrected it: March's certificate was right.":
"En febrero, el portal lo mostraba cortado, y ella lo corrigió: el diploma de marzo salió bien.",
"In August, her master's joins December's list, cut short again.":
"En agosto, su maestría entra en la lista de diciembre: el apellido, cortado otra vez.",
"With Mei and Malia, Noor and Jun ask why, five times.":
"Con Mei y Malia, Noor y Jun preguntan por qué, cinco veces.",
"Why is it cut? The list takes the student system's name, unless she confirms it for that ceremony.":
"¿Por qué está cortado? La lista toma el nombre del sistema de estudiantes, salvo que ella lo confirme para esa ceremonia.",
"Why is it still cut there? Her correction went to March's list, not to the student system.":
"¿Por qué sigue cortado allí? Su corrección fue a la lista de marzo, no al sistema de estudiantes.",
"Why? Only the registrar's office changes the student system, and nothing sent it there.":
"¿Por qué? Solo la oficina de registro académico cambia el sistema de estudiantes, y nada la envió allí.",
"Why was it cut at all? The family name field holds 30 characters.":
"¿Por qué se cortó? El campo del apellido admite 30 caracteres.",
"Why 30? It was set when the system was built, and it fitted most names then.":
"¿Por qué 30? Se fijó cuando se construyó el sistema, y entonces cabían la mayoría de los nombres.",
"Two causes: a field too short, and no way back.":
"Dos causas: un campo muy corto, y ningún camino de vuelta.",
"Inside the platform, Unity Catalog's lineage draws the same path, column by column:":
"Dentro de la plataforma, el linaje de Unity Catalog dibuja el mismo camino, columna por columna:",
"from the name on the list back to the student system's family name.":
"desde el nombre en la lista hasta el apellido del sistema de estudiantes.",
"Before the platform and after it, people have to tell you.":
"Antes de la plataforma y después, te lo tienen que decir las personas.",
"To find every cause, the team draws a fishbone, as Kaoru Ishikawa taught: the problem at its head, the causes along its bones.":
"Para ver las causas, el equipo traza una espina de pescado, como enseñó Kaoru Ishikawa: el problema en la cabeza, las causas en las espinas.",
"Four bones: people, process, systems, and interfaces, where data passes from one system to another.":
"Cuatro espinas: personas, proceso, sistemas e interfaces, donde los datos pasan de un sistema a otro.",
"People: paper forms before 2015 had one box for the whole name, split by whoever typed it in: 35 swapped.":
"Personas: los formularios en papel de antes de 2015 tenían una casilla para todo el nombre, dividido al teclearlo: 35 invertidos.",
"Process: every fix made in a copy, with no way back.":
"Proceso: cada arreglo hecho en una copia, sin camino de vuelta.",
"Systems: the 30-character field, 39 names cut short; and until 2019, an online form that took only A to Z, in capitals: 312 names.":
"Sistemas: el campo de 30 caracteres, 39 nombres cortados; y hasta 2019, un formulario web solo de la A a la Z, en mayúsculas: 312 nombres.",
"Interfaces: the nightly file to the platform, in an old encoding that turned é into e.":
"Interfaces: el archivo nocturno a la plataforma, en una codificación antigua que convertía la é en e.",
"143 names stored right lost their accents on the way in.":
"143 nombres guardados bien perdieron sus tildes al entrar.",
"Nobody did anything wrong. Each cause made sense when it was made.":
"Nadie hizo nada mal. Cada causa tenía sentido cuando se creó.",
"As Fixed where it starts showed: fix it where it starts, with its owner.":
"Como mostró Arreglado en el origen: se arregla en el origen, con su dueño.",
"On the night of Monday 14 September, the student system team, with Sam, changes two things:":
"La noche del lunes 14 de septiembre, el equipo del sistema de estudiantes, con Sam, cambia dos cosas:",
"the nightly file keeps every letter, and the family name field holds 100 characters.":
"el archivo nocturno conserva cada letra, y el campo del apellido admite 100 caracteres.",
"From that day, every correction is made once, in the student system, by Mei's office; the graduations team keeps no copy.":
"Desde ese día, la oficina de Mei hace cada corrección una vez, en el sistema de estudiantes; el equipo de graduaciones no guarda copia.",
"Old names are put right as each graduate confirms theirs, those graduating first.":
"Los nombres viejos se corrigen cuando cada graduado confirma el suyo, primero quienes se gradúan antes.",
"And Jun adds checks in dbt where the names are born: on the student system's records, each night, owned by Mei.":
"Y Jun agrega controles en dbt donde nacen los nombres: sobre los registros del sistema de estudiantes, cada noche, a cargo de Mei.",
"A family name exactly 30 characters long, or in capitals only, holds for her office: a list to work through.":
"Un apellido de exactamente 30 caracteres, o solo en mayúsculas, queda retenido para su oficina: una lista por revisar.",
"A night's file with not one letter outside A to Z stops the update: the list keeps the night before's names, and Sam is told.":
"Un archivo sin una letra fuera de la A a la Z detiene la actualización: la lista guarda los nombres de la noche anterior y se avisa a Sam.",
"A doubt about one name waits for a person; a file losing letters for everyone stops.":
"Una duda sobre un nombre espera a una persona; un archivo que pierde letras para todos se detiene.",
"By the morning of Tuesday 15 September, 161 names on December's list have their accents back, and nobody typed them.":
"En la mañana del martes 15 de septiembre, 161 nombres de la lista de diciembre recuperan sus tildes, y nadie las escribió.",
"The check holds Beatriz's name, and Mei's office writes it in full, once, for every list after.":
"El control retiene el nombre de Beatriz, y la oficina de Mei lo escribe entero, una vez, para cada lista siguiente.",
"Each round's hours go on the scorecard, beside the checks, so everyone can watch them fall.":
"Las horas de cada ronda van al cuadro de mando, junto a los controles, para que todos las vean bajar.",
"The post stopped placing letters one by one, and put a code on them at the start, written by the person who knew.":
"El correo dejó de ubicar las cartas una por una, y les puso un código al principio, escrito por quien lo sabía.",
"At the university, each name is now put right where it's born, by the people who own it.":
"En la universidad, cada nombre se corrige ahora donde nace, por las personas a cargo de él.",
"Count the work spent fixing data by hand. Then fix where it's born.":
"Cuenta el trabajo de corregir datos a mano. Luego arregla donde nace."
});
