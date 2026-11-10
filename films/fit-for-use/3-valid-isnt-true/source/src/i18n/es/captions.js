/* Valid isn't true: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module: la lista de graduación, el diploma (a degree certificate), el graduado, el título (an award) and la doble titulación, impreso de nuevo;
   un control for a check, which pasa; permitido (allowed), coincidir (agree) and cierto (true), and the dimensions válido, consistente and exacto, la exactitud;
   una referencia; las juntas examinadoras and sus listas aprobadas (the exam boards' approved lists); la oficina de registro; el sistema de estudiantes; el portal;
   el documento de identidad visto en la matrícula; el contrato de datos, la conciliación; el cuadro de mando (the scorecard). The portal's buttons are said in
   Spanish in the captions and stay English on screen. In Japan: el shogunato, el levantamiento (the survey), un tramo, la brújula, el grado de latitud.
   Numbers keep the picture's comma (1,064; 1,013), as the site's other Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Japan, in 1800.":
"Japón, en 1800.",
"Ino Tadataka, a retired merchant of 55, set out from Edo, today's Tokyo,":
"Ino Tadataka, un comerciante retirado de 55 años, salió de Edo, la actual Tokio,",
"to map the coast of Ezo, the northern island now called Hokkaido.":
"para cartografiar la costa de Ezo, la isla del norte que hoy se llama Hokkaido.",
"The maps of the time were drawn largely from estimates: a cape could sit miles from where it really lay.":
"Los mapas de la época se dibujaban sobre todo a partir de estimaciones: un cabo podía quedar a millas de donde estaba.",
"And with Russian ships appearing in the north, the government, the shogunate, wanted a true map of that coast.":
"Y con barcos rusos apareciendo en el norte, el gobierno, el shogunato, quería un mapa fiel de esa costa.",
"His teams measured it on foot: each stretch with a rope or a chain, and its direction with a compass.":
"Sus equipos la midieron a pie: cada tramo con una cuerda o una cadena, y su dirección con una brújula.",
"But every stretch adds a small error.":
"Pero cada tramo suma un pequeño error.",
"The errors pile up, unseen, because each measure looks right on its own.":
"Los errores se acumulan, sin verse, porque cada medida parece bien por sí sola.",
"A map made only from its own measures can agree with itself, line after line, and still put a cape miles out.":
"Un mapa hecho solo con sus propias medidas puede coincidir consigo mismo, línea tras línea, y aun así desviar un cabo millas.",
"Something had to change: the survey needed a reference its errors couldn't reach.":
"Algo tenía que cambiar: el levantamiento necesitaba una referencia que sus errores no pudieran alcanzar.",
"So, by day, they measured the coast; and on clear nights, they measured the stars.":
"Así que, de día, midieron la costa; y en las noches despejadas, midieron las estrellas.",
"A star's height, as it crosses the south, says how far north you stand, and no error in the walk can change it.":
"La altura de una estrella, cuando cruza el sur, dice cuán al norte estás, y ningún error del camino puede cambiarla.",
"Where the walk and the stars disagreed, they corrected the walk.":
"Donde el camino y las estrellas no coincidían, corregían el camino.",
"His teams walked for seventeen years.":
"Sus equipos caminaron durante diecisiete años.",
"In 1821, three years after he died, they finished the map of all Japan, the base of the country's maps for decades.":
"En 1821, tres años después de su muerte, terminaron el mapa de todo Japón, la base de los mapas del país durante décadas.",
"His length for one degree of latitude, north to south, is within a fraction of one per cent of today's.":
"Su longitud para un grado de latitud, de norte a sur, está a una fracción del uno por ciento de la de hoy.",
"At the university, in February 2026, every name on the graduation list passed the checks that say a name is allowed.":
"En la universidad, en febrero de 2026, cada nombre de la lista de graduación pasó los controles que dicen si un nombre está permitido.",
"Eighty-eight were still wrong.":
"Ochenta y ocho seguían mal.",
"The list needed its stars.":
"La lista necesitaba sus estrellas.",
"The graduates themselves put all 88 right, before a single certificate was printed.":
"Los propios graduados corrigieron los 88, antes de que se imprimiera un solo diploma.",
"February 2026.":
"Febrero de 2026.",
"The list for the March ceremonies holds 1,064 graduates.":
"La lista de las ceremonias de marzo tiene 1,064 graduados.",
"Every night, Jun's checks ask whether each name is allowed:":
"Cada noche, los controles de Jun preguntan si cada nombre está permitido:",
"not empty, nothing but letters, spaces, hyphens and apostrophes,":
"que no esté vacío, que solo tenga letras, espacios, guiones y apóstrofos,",
"and at most 30 characters, the length of the student system's field.":
"y como mucho 30 caracteres, la longitud del campo del sistema de estudiantes.",
"All 1,064 pass.":
"Los 1,064 pasan.",
"In data quality's words, every name is valid.":
"En palabras de la calidad de datos, cada nombre es válido.",
"But valid only means allowed.":
"Pero válido solo quiere decir permitido.",
"Zoë Lefèvre's name, without its accents, is allowed.":
"El nombre de Zoë Lefèvre, sin sus tildes, está permitido.",
"So is a name cut short, or a given name where the family name should be.":
"También un nombre cortado, o un nombre de pila donde debería ir el apellido.",
"The team's first checks, from a hundred records, raise two doubts:":
"Los primeros controles del equipo, de cien registros, plantean dos dudas:",
"twelve names exactly 30 characters long, and not one accent on the whole list.":
"doce nombres de 30 caracteres exactos, y ni una tilde en toda la lista.",
"But no check can say which of the twelve were cut short, or whose accents are missing.":
"Pero ningún control puede decir cuáles de los doce quedaron cortados, ni a quién le faltan tildes.",
"That's a question about the world, not about the data.":
"Esa es una pregunta sobre el mundo, no sobre los datos.",
"Ino had the stars.":
"Ino tenía las estrellas.",
"A list needs a reference too: something outside the data that knows the truth, and that the data's errors can't reach.":
"Una lista también necesita una referencia: algo fuera de los datos que sepa la verdad, y que sus errores no puedan alcanzar.",
"The list has three, from the closest to the truth.":
"La lista tiene tres, de la más cercana a la verdad.",
"The graduate, who knows their own name.":
"El graduado, que conoce su propio nombre.",
"The identity document seen at enrolment, checked once by the registrar's office.":
"El documento de identidad visto en la matrícula, revisado una vez por la oficina de registro.",
"And a record kept apart: the exam boards' approved lists, which say who completed each award, and when.":
"Y un registro aparte: las listas aprobadas por las juntas examinadoras, que dicen quién completó cada título, y cuándo.",
"The closer the reference, the more it can tell you, and the harder it is to reach.":
"Cuanto más cercana la referencia, más te puede decir, y más difícil es llegar a ella.",
"A graduate can tell you anything about their name, but you have to ask, and wait.":
"Un graduado puede decirte todo sobre su nombre, pero hay que preguntarle, y esperar.",
"The boards' lists are there every night, and know nothing of spelling.":
"Las listas de las juntas están ahí cada noche, y no saben nada de ortografía.",
"Checking data against a reference measures its accuracy: whether it's true.":
"Comparar los datos con una referencia mide su exactitud: si son ciertos.",
"So the registrar's office asked.":
"Así que la oficina de registro preguntó.",
"From Monday 9 to Friday 20 February, as graduates registered for the March ceremonies,":
"Del lunes 9 al viernes 20 de febrero, mientras los graduados se inscribían en las ceremonias de marzo,",
"the portal showed each one their name, exactly as it would be printed,":
"el portal le mostró a cada uno su nombre, tal como se imprimiría,",
"and two buttons: “This is my name”, and “This isn't my name”.":
"y dos botones: “Este es mi nombre” y “Este no es mi nombre”.",
"Zoë Lefèvre saw hers without its accents, pressed “This isn't my name”, and typed it as she writes it.":
"Zoë Lefèvre vio el suyo sin tildes, pulsó “Este no es mi nombre” y lo escribió como ella lo escribe.",
"1,013 of the 1,064 answered: 95 per cent.":
"Respondieron 1,013 de los 1,064: el 95 por ciento.",
"925 confirmed their name as it was.":
"925 confirmaron su nombre tal como estaba.",
"88 corrected it: 51 had lost their accents, 19 had given and family names swapped,":
"88 lo corrigieron: 51 habían perdido sus tildes, 19 tenían el nombre y el apellido invertidos,",
"11 were cut short, and 7 were misspelt.":
"11 estaban cortados, y 7 mal escritos.",
"All 88 had been allowed.":
"Los 88 estaban permitidos.",
"A certificate carries a graduate's legal name,":
"Un diploma lleva el nombre legal del graduado,",
"so Mei's team checked each correction against the next reference: the document seen at enrolment.":
"así que el equipo de Mei comparó cada corrección con la siguiente referencia: el documento visto en la matrícula.",
"84 matched.":
"84 coincidieron.",
"Four graduates had changed their name since, and each sent the document that shows the new one.":
"Cuatro graduados se habían cambiado el nombre desde entonces, y cada uno envió el documento que muestra el nuevo.",
"The list took each name as its graduate confirmed it, with the date.":
"La lista tomó cada nombre tal como lo confirmó su graduado, con la fecha.",
"The 51 who didn't answer were printed as the student system held them.":
"Los 51 que no respondieron se imprimieron tal como los tenía el sistema de estudiantes.",
"One was among the twelve exactly 30 characters long, and the document settled it: that name really is that long.":
"Uno estaba entre los doce de 30 caracteres exactos, y el documento lo resolvió: ese nombre de verdad es así de largo.",
"A check can raise a doubt.":
"Un control puede plantear una duda.",
"Only a reference can settle it.":
"Solo una referencia puede resolverla.",
"Then the awards.":
"Luego, los títulos.",
"A graduate of a double degree, like Arts and Laws, has two awards, and two certificates.":
"Un graduado de una doble titulación, como Artes y Derecho, tiene dos títulos, y dos diplomas.",
"On Monday 23 February, Jun's new check compared the list with the exam boards' approved lists, award by award.":
"El lunes 23 de febrero, el nuevo control de Jun comparó la lista con las listas aprobadas por las juntas, título por título.",
"The boards had approved 1,101.":
"Las juntas habían aprobado 1,101.",
"The list held 1,099.":
"La lista tenía 1,099.",
"The missing two were Bachelor of Arts awards,":
"Los dos que faltaban eran títulos de Licenciatura en Artes,",
"for two graduates of Arts and Laws whom the student system held with Laws only.":
"de dos graduados de Artes y Derecho que el sistema de estudiantes tenía solo con Derecho.",
"Every row on the list passed its checks: what was wrong was what wasn't there.":
"Cada fila de la lista pasó sus controles: lo que estaba mal era lo que no estaba.",
"It was found three days before the list went, and both Arts certificates were printed.":
"Se encontró tres días antes de que la lista saliera, y se imprimieron los dos diplomas de Artes.",
"Every other award, and every date, agreed.":
"Los demás títulos, y todas las fechas, coincidieron.",
"The boards' lists could see the gap because they're kept apart,":
"Las listas de las juntas podían ver el hueco porque se llevan aparte,",
"made from the boards' own decisions, not from the student system.":
"hechas con las propias decisiones de las juntas, no con el sistema de estudiantes.",
"A copy of the student system would have agreed with the list, and both would be wrong:":
"Una copia del sistema de estudiantes habría coincidido con la lista, y las dos estarían mal:",
"consistent, in data quality's words, not accurate.":
"consistentes, en palabras de la calidad de datos, no exactas.",
"And like Ino's stars, each reference sees some things and not others.":
"Y como las estrellas de Ino, cada referencia ve unas cosas y no otras.",
"The stars fixed how far north, not how far east: that needed an exact clock his teams could carry, and they had none.":
"Las estrellas fijaban cuán al norte, no cuán al este: eso pedía un reloj exacto que sus equipos pudieran llevar, y no tenían.",
"The boards' lists can say an award is missing, not how a name is spelled.":
"Las listas de las juntas pueden decir que falta un título, no cómo se escribe un nombre.",
"So every check now says which reference it uses.":
"Así que ahora cada control dice qué referencia usa.",
"Beside each check in the project, Jun writes its owner, what it measures, and, for an accuracy check, its reference.":
"Junto a cada control del proyecto, Jun escribe su responsable, qué mide, y, si es de exactitud, su referencia.",
"The name checks measure validity: they have no reference but the rule itself,":
"Los controles de nombres miden la validez: no tienen más referencia que la propia regla,",
"so they can say a name is allowed, and no more.":
"así que pueden decir que un nombre está permitido, y nada más.",
"The awards check measures accuracy, against the boards' approved lists.":
"El control de títulos mide la exactitud, contra las listas aprobadas por las juntas.",
"For names, the reference is the graduate, and the list keeps the date each name was confirmed.":
"Para los nombres, la referencia es el graduado, y la lista guarda la fecha en que se confirmó cada uno.",
"And the test it runs names its method: reconciliation, award by award.":
"Y la prueba que ejecuta nombra su método: conciliación, título por título.",
"And the scorecard counts them apart: allowed, and true.":
"Y el cuadro de mando los cuenta por separado: permitido, y cierto.",
"A check is only as true as its reference.":
"Un control es tan cierto como su referencia.",
"Say which one it uses, and whoever reads the result knows what it can tell them, and what it can't.":
"Di cuál usa, y quien lea el resultado sabrá qué le puede decir, y qué no.",
"Ino's teams walked the coast by day, and checked it against the stars by night.":
"Los equipos de Ino recorrían la costa de día, y la comprobaban con las estrellas de noche.",
"The walk said how far they had come.":
"El camino decía cuánto habían avanzado.",
"The stars said how far north they really were.":
"Las estrellas decían cuán al norte estaban de verdad.",
"On Thursday 26 February, the March list went to the printer":
"El jueves 26 de febrero, la lista de marzo salió hacia la imprenta",
"with 88 names put right by the graduates themselves, and two awards found in the boards' lists.":
"con 88 nombres corregidos por los propios graduados, y dos títulos hallados en las listas de las juntas.",
"Every name had been allowed all along.":
"Cada nombre estuvo permitido todo el tiempo.",
"Now 1,013 of them had been confirmed by the person they belong to.":
"Ahora 1,013 los había confirmado la persona a quien pertenecen.",
"A check says it's allowed.":
"Un control dice que está permitido.",
"Only a reference says it's true.":
"Solo una referencia dice que es cierto."
});
