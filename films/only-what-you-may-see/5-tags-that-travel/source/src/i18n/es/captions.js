/* Tags that travel: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in Conoce lo que guardas and the series: the classes are directa, seudónima, indirecta, especial and ninguna; the levels pública, interna, confidencial and
   restringida; la tabla de estudiantes, la tabla de apoyos, el apoyo en exámenes, el número de estudiante, el código, la oficina de registro, la Facultad de Salud, el dueño
   (Mei, la dueña); una etiqueta gobernada, la propagación de etiquetas, el linaje, la clasificación de datos, el cargador (registrar-loader). The Forest Stewardship Council is
   el Consejo de Administración Forestal, as it calls itself in Spanish, and a label is una etiqueta, as a tag is: the film's own rhyme. A plank is un tablón, never una tabla,
   which is the film's word for a table. The film is Etiquetas que viajan. Numbers keep the picture's comma (2,614; 68,000), as the series' other Spanish captions do. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"The early 1990s.":
"Principios de los años noventa.",
"Tropical forests are being cut much faster than ten years before.":
"Los bosques tropicales se talan mucho más rápido que diez años antes.",
"In Europe and North America, people campaign against tropical wood, and refuse to buy it.":
"En Europa y Norteamérica, la gente hace campaña contra la madera tropical, y se niega a comprarla.",
"But no buyer can tell where a plank was grown, or how.":
"Pero ningún comprador puede saber dónde creció un tablón, ni cómo.",
"Wood from a forest cut bare looks just like wood from one cared for.":
"La madera de un bosque arrasado se ve igual que la de uno bien cuidado.",
"So the cutting goes on: species disappear, and the communities who live from those forests are hit hard.":
"Así que la tala sigue: desaparecen especies, y las comunidades que viven de esos bosques reciben un duro golpe.",
"In 1992, at the Earth Summit in Rio, governments fail to agree to stop it.":
"En 1992, en la Cumbre de la Tierra en Río, los gobiernos no logran acordar detenerla.",
"Buyers need a way to tell the two woods apart.":
"Los compradores necesitan una forma de distinguir las dos maderas.",
"In 1993, 130 people from 26 countries meet in Toronto: forest and human-rights groups, timber traders, foresters.":
"En 1993, 130 personas de 26 países se reúnen en Toronto: grupos forestales y de derechos humanos, madereros, silvicultores.",
"They found the Forest Stewardship Council.":
"Fundan el Consejo de Administración Forestal.",
"An independent auditor certifies a forest against its rules.":
"Un auditor independiente certifica un bosque según sus reglas.",
"Then every company that buys, saws, makes or sells the wood is certified, and passes the claim on.":
"Luego se certifica cada empresa que compra, asierra, fabrica o vende la madera, y cada una pasa la declaración.",
"A product carries the label only if every company along the chain is certified.":
"Un producto lleva la etiqueta solo si cada empresa de la cadena está certificada.",
"Where certified wood is mixed with other wood, a rule set in advance says how it's labelled.":
"Donde la madera certificada se mezcla con otra, una regla fijada de antemano dice cómo se etiqueta.",
"By the end of 2025, over 171 million hectares of forest are certified, and over 68,000 certificates cover the chain.":
"A fines de 2025, más de 171 millones de hectáreas de bosque están certificadas, y más de 68,000 certificados cubren la cadena.",
"And a buyer can tell, from one label, where the wood began.":
"Y un comprador puede saber, por una etiqueta, dónde empezó la madera.",
"A university's data travels too, from the learner table into every table made from it.":
"Los datos de una universidad también viajan, de la tabla de estudiantes a cada tabla hecha a partir de ella.",
"If its classes don't go with it, a name hidden at the source shows on a copy.":
"Si sus clases no van con ellos, un nombre oculto en el origen se ve en una copia.",
"If they do, every copy says what it holds, and is protected for it.":
"Si van, cada copia dice lo que guarda, y se protege como corresponde.",
"Tuesday, the thirteenth of October.":
"Martes 13 de octubre.",
"In Know what you hold, Mei named a class for every column of the learner table, and a level for the table.":
"En Conoce lo que guardas, Mei nombró una clase para cada columna de la tabla de estudiantes, y un nivel para la tabla.",
"Now the platform has to read them.":
"Ahora la plataforma tiene que leerlos.",
"Sam Okafor, who runs the platform, makes each one a governed tag in Databricks.":
"Sam Okafor, que dirige la plataforma, hace de cada uno una etiqueta gobernada en Databricks.",
"Personal data takes four values: special, direct, pseudonymous and indirect.":
"Datos personales toma cuatro valores: especial, directa, seudónima e indirecta.",
"None is simply no tag.":
"Ninguna es, sin más, no tener etiqueta.",
"Level takes four more, from public to restricted, on tables only.":
"Nivel toma cuatro más, de pública a restringida, solo en tablas.",
"And faculty, with no values, marks the column that holds each row's faculty.":
"Y facultad, sin valores, marca la columna que guarda la facultad de cada fila.",
"Governed means only those values, set only by those allowed to assign them.":
"Gobernada significa solo esos valores, puestos solo por quienes pueden asignarlos.",
"Here, that's the registrar's own loader, from the project's files, so nobody sets a class by hand.":
"Aquí, es el cargador de la oficina de registro, desde los archivos del proyecto, así que nadie pone una clase a mano.",
"Before Mei confirms them, the platform takes a look of its own.":
"Antes de que Mei las confirme, la plataforma echa su propio vistazo.",
"Data classification scans the registrar's catalog, and proposes what it recognises.":
"La clasificación de datos revisa el catálogo de la oficina de registro, y propone lo que reconoce.",
"In the learner table, it finds a name, an email and a date of birth.":
"En la tabla de estudiantes, encuentra un nombre, un correo y una fecha de nacimiento.",
"Mei confirms them: direct, direct and indirect.":
"Mei las confirma: directa, directa e indirecta.",
"It proposes nothing for the student number, a format of the university's own.":
"No propone nada para el número de estudiante, un formato propio de la universidad.",
"And nothing for exam support, in the support table: extra time names no illness.":
"Ni para el apoyo en exámenes, en la tabla de apoyos: más tiempo no nombra ninguna enfermedad.",
"Only Mei knows it's given for a disability, so she names it special herself.":
"Solo Mei sabe que se da por una discapacidad, así que ella misma le da la clase especial.",
"The scan proposes.":
"El escaneo propone.",
"The owner decides, and adds what no scan can see.":
"El dueño decide, y agrega lo que ningún escaneo puede ver.",
"Her word goes into the project, in dbt.":
"Su palabra entra al proyecto, en dbt.",
"Jun Park writes each class beside its column, in the learner table's file.":
"Jun Park escribe cada clase junto a su columna, en el archivo de la tabla de estudiantes.",
"The data team reviews the code, and Mei is told what it touches.":
"El equipo de datos revisa el código, y a Mei le avisan qué toca.",
"After each build, dbt sets every class as a tag on its column.":
"Después de cada ejecución, dbt pone cada clase como etiqueta en su columna.",
"Then the faculty tag, and last, the table's level: confidential.":
"Luego la etiqueta de facultad, y al final, el nivel de la tabla: confidencial.",
"A column marked none gets no tag, and an old one is taken off.":
"Una columna marcada ninguna no recibe etiqueta, y se le quita la que tenía.",
"Change the file, and the next build changes the tags.":
"Cambia el archivo, y la siguiente ejecución cambia las etiquetas.",
"This is where the tags start: on the learner table, the first that people read.":
"Aquí empiezan las etiquetas: en la tabla de estudiantes, la primera que la gente lee.",
"Then Sam turns on tag propagation, for the classes and the faculty tag.":
"Luego Sam activa la propagación de etiquetas, para las clases y la etiqueta de facultad.",
"Now each tag follows its column through lineage: the platform's record of what each query read, and what it made.":
"Ahora cada etiqueta sigue a su columna por el linaje: el registro de la plataforma de lo que leyó cada consulta, y lo que hizo.",
"That afternoon, the registrar's loader makes the study's copy: Health's 2,614 learners.":
"Esa tarde, el cargador de la oficina de registro hace la copia del estudio: los 2,614 estudiantes de Salud.",
"Within minutes, its tags arrive: the learner code pseudonymous, the year of birth indirect, as their sources are.":
"En minutos llegan sus etiquetas: seudónima para el código, indirecta para el año de nacimiento, como sus orígenes.",
"Course and results bring none.":
"Curso y resultados no traen ninguna.",
"Nobody tags the copy.":
"Nadie etiqueta la copia.",
"Until its tags are there, a policy can't see them.":
"Hasta que sus etiquetas están ahí, una política no puede verlas.",
"So Mei checks the classes are there, and gives the copy its level: confidential.":
"Así que Mei revisa que las clases estén, y le da a la copia su nivel: confidencial.",
"The study is given its space only the next day, with the copy in it.":
"El estudio recibe su espacio recién al día siguiente, con la copia dentro.",
"And every table Anil makes from it will carry the same classes.":
"Y cada tabla que Anil haga a partir de ella llevará las mismas clases.",
"Propagation never lowers a class.":
"La propagación nunca baja una clase.",
"Suppose the copy had made the code itself, from the student number.":
"Supón que la propia copia hiciera el código, a partir del número de estudiante.",
"Lineage would bring the student number's class: direct.":
"El linaje traería la clase del número de estudiante: directa.",
"Mei's file says pseudonymous.":
"El archivo de Mei dice seudónima.",
"One column, two values for one tag: a conflict.":
"Una columna, dos valores para una etiqueta: un conflicto.",
"The platform can't choose, so it applies the value Sam set in advance: special, the strictest.":
"La plataforma no puede elegir, así que aplica el valor que Sam fijó de antemano: especial, la más estricta.",
"Like the rule for mixed wood, it's set before anything is mixed.":
"Como la regla de la madera mezclada, se fija antes de mezclar nada.",
"Nothing shows that shouldn't, but the column now says the wrong thing, and passes it on.":
"No se ve nada que no deba, pero ahora la columna dice algo equivocado, y lo pasa adelante.",
"So a value that says less is made once, at the source, by its owner.":
"Por eso un valor que dice menos lo hace una vez su dueño, en el origen.",
"The learner table holds the code beside the student number, and every table after takes the code.":
"La tabla de estudiantes guarda el código junto al número de estudiante, y cada tabla posterior toma el código.",
"And a level doesn't travel at all.":
"Y un nivel no viaja en absoluto.",
"Join a public table to a confidential one, and every table made from them would be a conflict.":
"Une una tabla pública con una confidencial, y cada tabla hecha a partir de ellas sería un conflicto.",
"Each table's level stays its owner's call.":
"El nivel de cada tabla sigue siendo decisión de su dueño.",
"A tag travels only inside the platform.":
"Una etiqueta solo viaja dentro de la plataforma.",
"A file downloaded, or a copy in another tool, carries no tag at all.":
"Un archivo descargado, o una copia en otra herramienta, no lleva ninguna etiqueta.",
"That's why the studies' workspace has downloads switched off.":
"Por eso el espacio de los estudios tiene las descargas desactivadas.",
"Inside, tags travel only where lineage can follow: into tables and views the platform's serverless compute makes.":
"Dentro, las etiquetas viajan solo donde el linaje puede seguir: a tablas y vistas que hace el cómputo sin servidor de la plataforma.",
"Anil's totals by course are counted from courses and results, which carry no class.":
"Los totales por curso de Anil se cuentan a partir de cursos y resultados, que no llevan clase.",
"So nothing travels into them.":
"Así que nada viaja hacia ellos.",
"Mei checks them, and gives them their level: public.":
"Mei los revisa, y les da su nivel: pública.",
"A label on a chair can be trusted because every company passed the claim on, by rules agreed before.":
"Se puede confiar en la etiqueta de una silla porque cada empresa pasó la declaración, con reglas acordadas antes.",
"Mei named each class once, at the source.":
"Mei nombró cada clase una vez, en el origen.",
"The platform carries it into every table made from it, and where two meet, a rule set in advance decides.":
"La plataforma la lleva a cada tabla hecha a partir de ahí, y donde dos se encuentran, decide una regla fijada de antemano.",
"Next, one policy reads those tags, wherever they land.":
"Después, una política lee esas etiquetas, dondequiera que lleguen.",
"Tag once at the source.":
"Etiqueta una vez en el origen.",
"The tag follows the data.":
"La etiqueta sigue a los datos."
});
