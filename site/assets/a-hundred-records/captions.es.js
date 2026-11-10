/* A hundred records: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's series (series.json): la lista de graduación, los diplomas, la oficina de registro académico, la responsable de graduaciones,
   un control (a check), las tildes (accents, as the series' pages say), un título (an award). New here: la cervecería, la cebada, las parcelas, una prueba
   (a barley trial), las fichas (Gosset's cards), la mesa de trabajo (the team's bench), la medición del viernes por la tarde (Redman's Friday afternoon
   measurement), el perfilado de datos and un perfil (profiling, a profile), un cuaderno (a notebook, as Microsoft Learn says), las métricas personalizadas,
   el monitoreo, retener (a check that holds the list for a person). Films the voice names keep their Spanish titles (La calidad en la plataforma; La fábrica
   oculta until that film names itself). Numbers as on screen (2,031; 3,000; 41; 79), since the picture shows them; names on screen stay as they are (Student, dbt). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Dublin, 1899. A young chemist, William Gosset, joins a large brewery.":
"Dublín, 1899. Un joven químico, William Gosset, entra en una gran cervecería.",
"It wants better barley: which kind to grow, and how, for the best beer.":
"Quiere mejor cebada: qué variedad sembrar, y cómo, para la mejor cerveza.",
"But a trial means sowing a few plots and waiting a whole season, so it gives only a handful of results.":
"Pero cada prueba exige sembrar unas parcelas y esperar toda una temporada: da solo un puñado de resultados.",
"And a handful can mislead. The brewery could choose the wrong barley and live with it for a year, or turn good barley away.":
"Y un puñado puede engañar. La cervecería podía elegir la cebada equivocada y cargar con ella un año, o rechazar una buena.",
"The mathematics of the day worked for large numbers of measurements. Nobody could say how far a few could be trusted.":
"Las matemáticas de la época servían para grandes cantidades de mediciones. Nadie sabía cuánto fiarse de unas pocas.",
"Something had to change.":
"Algo tenía que cambiar.",
"So Gosset worked out how much a few results can tell you, and how sure of it you can be.":
"Así que Gosset calculó cuánto dicen unos pocos resultados, y qué tan seguro puedes estar de ello.",
"Before he could prove it on paper, he tried it by hand: 3,000 measurements on 3,000 cards, shuffled, and drawn four at a time.":
"Antes de probarlo en papel, lo ensayó a mano: 3,000 mediciones en 3,000 fichas, barajadas y sacadas de cuatro en cuatro.",
"In 1908 he published it, with tables anyone could use, as Student: the brewery let its staff publish, but not under their own names.":
"En 1908 lo publicó, con tablas que cualquiera podía usar, como Student: la cervecería dejaba publicar a su personal, no con su nombre.",
"Now a few careful trials were enough to decide, and his tables said when more were needed.":
"Ahora unas pocas pruebas cuidadosas bastaban para decidir, y sus tablas decían cuándo hacían falta más.",
"In his paper, eleven pairs of trials showed that seed dried in a kiln probably gave a little more grain, and almost certainly worse barley.":
"En su artículo, once pares de pruebas mostraron que la semilla secada al horno probablemente rendía algo más, y casi seguro peor cebada.",
"His way is still used wherever people can't measure everything: in medicine, in farming, in factories.":
"Su método aún se usa donde no se puede medir todo: en la medicina, en el campo, en las fábricas.",
"And for data: a few records, looked at closely, can say how good a whole list is.":
"Y en los datos: unos pocos registros, vistos de cerca, dicen qué tan buena es toda una lista.",
"At the university, the graduation list passed every check. Yet in December, 41 degree certificates were printed again.":
"En la universidad, la lista de graduación pasaba todos los controles. Aun así, en diciembre se reimprimieron 41 diplomas.",
"So, on a Friday in February, three people looked closely at a hundred of its records.":
"Así que un viernes de febrero, tres personas revisaron de cerca cien de sus registros.",
"79 were perfect: an honest number, and a map of where to look, before a single new check was written.":
"79 estaban perfectos: un número honesto, y un mapa de dónde mirar, antes de escribir un solo control nuevo.",
"Friday, 6 February, two o'clock, at the data team's bench.":
"Viernes 6 de febrero, a las dos, en la mesa del equipo de datos.",
"Malia Fonoti runs the ceremonies. Mei Tanaka, in the registrar's office, answers for names and awards. Jun Park builds the list.":
"Malia Fonoti organiza las ceremonias. Mei Tanaka, de registro académico, responde por nombres y títulos. Jun Park construye la lista.",
"In January, they agreed what the list is for, and what each use needs. A certificate needs every name exactly right.":
"En enero acordaron para qué sirve la lista y qué necesita cada uso. Un diploma necesita cada nombre exactamente bien.",
"Jun brings December's list, the last one built in full, and its hundred most recent records.":
"Jun trae la lista de diciembre, la última construida completa, y sus cien registros más recientes.",
"For each, the fields a certificate and a ceremony need: the names, the award, the ceremony, and the date the degree is conferred.":
"De cada uno, los campos que necesitan un diploma y una ceremonia: los nombres, el título, la ceremonia y la fecha en que se otorga.",
"They go through them one by one, and mark every field that's wrong. A record with nothing marked is perfect.":
"Los revisan uno por uno y marcan cada campo que está mal. Un registro sin nada marcado está perfecto.",
"Two hours later: 79 perfect.":
"Dos horas después: 79 perfectos.",
"21 have at least one error, 26 errors in all.":
"21 tienen al menos un error, 26 errores en total.",
"15 are in names: accents lost, names cut short, given and family names swapped.":
"15 en los nombres: tildes perdidas, nombres cortados, nombre y apellido intercambiados.",
"6 are in awards, 3 in ceremonies, 2 in dates.":
"6 en títulos, 3 en ceremonias, 2 en fechas.",
"Thomas Redman, a pioneer of data quality, calls this the Friday afternoon measurement.":
"Thomas Redman, pionero de la calidad de datos, la llama la medición del viernes por la tarde.",
"It needs no special tools: a hundred records, the people who know them, and an afternoon.":
"No necesita herramientas especiales: cien registros, las personas que los conocen y una tarde.",
"December's list has 2,031 graduates. Can a hundred records speak for them all?":
"La lista de diciembre tiene 2,031 graduados. ¿Pueden cien registros hablar por todos?",
"It's Gosset's question again: how far can a few be trusted?":
"Otra vez la pregunta de Gosset: ¿cuánto fiarse de unos pocos?",
"If the hundred are like the rest, the answer is good to about eight either way: between 71 and 87 perfect in every hundred.":
"Si los cien son como el resto, la respuesta vale con unos ocho de margen: entre 71 y 87 perfectos de cada cien.",
"Not exact. But enough to act on: about one record in five is wrong.":
"No es exacto. Pero basta para actuar: cerca de uno de cada cinco está mal.",
"Why the most recent? They show the list as it's made now, not as it was made years ago.":
"¿Por qué los más recientes? Muestran la lista como se hace hoy, no como se hacía hace años.",
"And everyone understands 79 of a hundred.":
"Y todo el mundo entiende 79 de cien.",
"It also raises a puzzle. December's 41 reprints were about 2 certificates in 100.":
"También plantea un enigma. Los 41 diplomas reimpresos en diciembre eran cerca de 2 de cada 100.",
"The hundred say 21 records in 100 have an error: over 400 on December's list.":
"Según los cien, 21 de cada 100 tienen un error: más de 400 en la lista de diciembre.",
"So someone had been putting most of them right by hand before the list went, and nobody counted that work.":
"Así que alguien venía corrigiendo a mano casi todos antes de enviar la lista, y nadie contaba ese trabajo.",
"The hidden factory, a later film, follows it.":
"La fábrica oculta, una película posterior, lo sigue.",
"A hundred records say how good the list is, not where to look among two thousand.":
"Cien registros dicen qué tan buena es la lista, no dónde mirar entre dos mil.",
"So Jun has the platform describe the whole list.":
"Jun hace que la plataforma describa toda la lista.",
"A notebook shows a quick profile in one click. For one the team keeps and refreshes, he sets up Databricks' data profiling.":
"Un cuaderno muestra un perfil rápido con un clic. Para uno que el equipo guarde y actualice, configura el perfilado de Databricks.",
"It reads every row and describes each column.":
"Lee cada fila y describe cada columna.",
"How many values are empty, how many are different, which are shortest and longest, and which come up most.":
"Cuántos valores están vacíos, cuántos son distintos, cuáles son los más cortos y largos, y cuáles se repiten más.",
"He profiles December's list, all 2,031 graduates.":
"Perfila la lista de diciembre, los 2,031 graduados.",
"Two things stand out.":
"Dos cosas destacan.",
"The longest family name is exactly 30 characters: the length of the field in the student system. Names cut short.":
"El apellido más largo tiene justo 30 caracteres: el largo del campo en el sistema de estudiantes. Nombres cortados.",
"And among the most frequent family names, the same name twice: once as written, once in capitals.":
"Y entre los apellidos más frecuentes, el mismo dos veces: una como se escribe, otra en mayúsculas.",
"So Jun adds counts of his own, as custom metrics.":
"Jun agrega conteos propios, como métricas personalizadas.",
"41 family names exactly 30 characters long.":
"41 apellidos de exactamente 30 caracteres.",
"312 in capitals only, every one of a student admitted before 2020.":
"312 solo en mayúsculas, todos de estudiantes admitidos antes de 2020.",
"And not one name with a letter outside A to Z. Eight in the hundred had lost their accents. Here, every accent is gone.":
"Y ni un nombre con una letra fuera de la A a la Z. Ocho de los cien habían perdido sus tildes. Aquí no queda ninguna.",
"The hundred had none in capitals: all of them were students admitted since 2020.":
"Los cien no tenían ninguno en mayúsculas: todos eran de estudiantes admitidos desde 2020.",
"Only the profile, which reads every row, could see them.":
"Solo el perfil, que lee cada fila, podía verlos.",
"The hundred said how good. The profile said where to look.":
"Los cien dijeron qué tan buena. El perfil dijo dónde mirar.",
"Only now does Jun write checks, starting with what the profile showed.":
"Solo ahora Jun escribe controles, empezando por lo que mostró el perfil.",
"A family name exactly as long as the field may have been cut short.":
"Un apellido tan largo como el campo puede haber quedado cortado.",
"A family name in capitals only.":
"Un apellido solo en mayúsculas.",
"And a list of more than 200 names without a single accent.":
"Y una lista de más de 200 nombres sin una sola tilde.",
"Eight in the hundred had lost theirs, so a list with none isn't chance.":
"Ocho de los cien habían perdido las suyas: una lista sin ninguna no es casualidad.",
"Mei owns all three. Before any ran, she and Malia agreed their level.":
"Mei responde por los tres. Antes de correrlos, ella y Malia acordaron su nivel.",
"Each holds the list for a person to look; none stops it on its own.":
"Cada uno retiene la lista para que alguien la revise; ninguno la detiene solo.",
"Jun writes them in the project, with dbt. From Monday, they run every night.":
"Jun los escribe en el proyecto, con dbt. Desde el lunes, corren cada noche.",
"The platform's monitoring watches the rest, such as whether each table arrives on time, as Quality on the platform showed.":
"El monitoreo de la plataforma vigila el resto, como si cada tabla llega a tiempo, como mostró La calidad en la plataforma.",
"But some of the hundred's errors, no check of the list can see.":
"Pero algunos errores de los cien no los ve ningún control de la lista.",
"The swapped names, the awards, the ceremonies and the dates were all allowed values. Allowed, and wrong.":
"Los nombres intercambiados, los títulos, las ceremonias y las fechas eran valores permitidos. Permitidos, y erróneos.",
"To find those, the list needs something outside it to compare with. That's the next film.":
"Para hallarlos, la lista necesita algo externo con qué compararse. Eso, en la próxima película.",
"Back in Dublin, Gosset never tried every barley. A few careful trials were enough, and his tables said when more were needed.":
"En Dublín, Gosset nunca probó todas las cebadas. Unas pocas pruebas cuidadosas bastaban, y sus tablas decían cuándo hacían falta más.",
"The team did the same with its list: a hundred records, looked at by the people who know them, then the whole list described.":
"El equipo hizo lo mismo con su lista: cien registros, revisados por quienes los conocen, y luego toda la lista descrita.",
"79 is where they start. Each time they measure again, the number will say whether their changes worked.":
"79 es su punto de partida. Cada vez que vuelvan a medir, el número dirá si sus cambios funcionaron.",
"And because they measured first, the checks go where the errors are, not where checks are easy to write.":
"Y como midieron primero, los controles van donde están los errores, no donde es fácil escribirlos.",
"Look at a hundred records before you write a single check.":
"Revisa cien registros antes de escribir un solo control."
});
