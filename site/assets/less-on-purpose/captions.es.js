/* Less, on purpose: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md has them: el equipo, la gestora de datos, una reunión uno a uno, el consejo de datos. At the university: el antiguo
   almacén de datos, la plataforma, los informes, las alertas, las reuniones fijas, una reunión de pie, el tablero del equipo, un responsable (an owner).
   In Britain: el gobierno, un ministerio (a department), los contribuyentes; the names stay as the picture has them (GOV.UK, Directgov, Business Link,
   Government Digital Service, Design Museum). Numbers keep the picture's comma (3,800), as the module's other Spanish captions do. The next film's Spanish
   title is the series page's words for it (Un cambio pequeño cada vez). Tú, as the film speaks to the viewer (haz, pregunta, deja, mide, conserva).
   Dates in words as Spanish says them (martes 4 de mayo). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Britain, in 2010.":
"Gran Bretaña, en 2010.",
"The government publishes millions of pages on the web, across hundreds of websites, most of them run by one department alone.":
"El gobierno publica millones de páginas en la web, en cientos de sitios, la mayoría a cargo de un solo ministerio.",
"To renew a passport or pay a tax, people first have to work out which part of government does it, and which of its sites to trust.":
"Para renovar un pasaporte o pagar un impuesto, primero hay que averiguar qué parte del gobierno lo hace, y en cuál de sus sitios confiar.",
"The same advice sits on several sites, in different words. People lose time, and can't be sure which page is right.":
"El mismo consejo está en varios sitios, con otras palabras. La gente pierde tiempo y no sabe qué página es la correcta.",
"And taxpayers pay around 560 million pounds a year for all those websites.":
"Y los contribuyentes pagan unos 560 millones de libras al año por todos esos sitios.",
"Government online has to become one place, and simpler.":
"El gobierno en línea tiene que volverse un solo lugar, y más sencillo.",
"In October 2010, Martha Lane Fox, the government's digital champion, reports on its main public website, Directgov.":
"En octubre de 2010, Martha Lane Fox, la promotora digital del gobierno, informa sobre su principal sitio público, Directgov.",
"Her advice: one website for the whole of government, and one team that answers for what people find there.":
"Su consejo: un solo sitio para todo el gobierno, y un equipo que responda por lo que la gente encuentra ahí.",
"Don't move the old pages across. Write only what people need, and archive the rest.":
"No trasladar las páginas viejas. Escribir solo lo que la gente necesita, y archivar el resto.",
"A new team, the Government Digital Service, builds that website.":
"Un equipo nuevo, el Government Digital Service, construye ese sitio.",
"It reads every page of Directgov, and later of Business Link, the site for businesses, and what people searched for.":
"Lee cada página de Directgov, y después de Business Link, el sitio para empresas, y lo que la gente buscaba.",
"It keeps only what meets a real need, and writes that again.":
"Conserva solo lo que cubre una necesidad real, y lo reescribe.",
"In 2012, it writes down its design principles. The first: start with what people need. The second: do less.":
"En 2012, pone por escrito sus principios de diseño. El primero: empezar por lo que la gente necesita. El segundo: hacer menos.",
"Government should only do what only government can do.":
"El gobierno solo debe hacer lo que solo el gobierno puede hacer.",
"In October 2012, GOV.UK replaces both sites, with far fewer pages: about 3,800 pieces of content.":
"En octubre de 2012, GOV.UK reemplaza a los dos sitios, con muchas menos páginas: unos 3,800 contenidos.",
"In tests, people finish 61 tasks in 100, against 46 on Business Link, and a minute faster.":
"En pruebas, la gente completa 61 tareas de cada 100, frente a 46 en Business Link, y un minuto más rápido.",
"And it's expected to cost taxpayers up to 70 million pounds a year less.":
"Y se espera que cueste a los contribuyentes hasta 70 millones de libras menos al año.",
"The next spring, London's Design Museum names it Design of the Year.":
"La primavera siguiente, el Design Museum de Londres lo nombra Diseño del Año.",
"A data team's work piles up the same way: reports, meetings and alerts, each added for a good reason, and rarely taken away.":
"El trabajo de un equipo de datos se acumula igual: informes, reuniones y alertas, cada uno añadido por una buena razón, y rara vez retirado.",
"Stop what nobody uses, and the time goes back to the work that matters.":
"Deja lo que nadie usa, y el tiempo vuelve al trabajo que importa.",
"But simpler doesn't just happen. Someone has to choose it.":
"Pero lo simple no ocurre solo. Alguien tiene que elegirlo.",
"This series follows four ideas for leading a team: minimalism, kaizen, Ubuntu, and decentralisation and emergence.":
"Esta serie sigue cuatro ideas para dirigir un equipo: minimalismo, kaizen, Ubuntu, y descentralización y emergencia.",
"It begins with minimalism: keeping only what does a job, so that what's left is done well.":
"Empieza por el minimalismo: conservar solo lo que cumple una función, para que lo que queda se haga bien.",
"At the university, a year from now, Helena Novak leads a data team of eight.":
"En la universidad, dentro de un año, Helena Novak dirige un equipo de datos de ocho.",
"On Tuesday 4 May, they put everything they run and attend on one wall.":
"El martes 4 de mayo, ponen en una pared todo lo que mantienen y a lo que asisten.",
"There are 38 old reports, and the warehouse's logs show that 17 haven't been opened in a year.":
"Hay 38 informes antiguos, y los registros del almacén de datos muestran que 17 no se han abierto en un año.",
"Each person spends about eight hours a week in standing meetings.":
"Cada persona pasa unas ocho horas a la semana en reuniones fijas.",
"And the platform sends about 60 alerts a week. Most of them need nothing.":
"Y la plataforma envía unas 60 alertas a la semana. La mayoría no requiere nada.",
"Each was added for a good reason: a request, a project, a night when something broke.":
"Cada cosa se agregó por una buena razón: una solicitud, un proyecto, una noche en que algo falló.",
"In 2021, a study in Nature found that when people set out to make something better, they mostly add to it.":
"En 2021, un estudio en Nature halló que, cuando la gente se propone mejorar algo, casi siempre le agrega cosas.",
"They rarely think of taking anything away.":
"Rara vez piensa en quitar algo.",
"When a university's new president asked for ideas, only about one in ten took something away.":
"Cuando el nuevo rector de una universidad pidió ideas, solo alrededor de una de cada diez quitaba algo.",
"So Helena asks the team to choose, together, what to keep and what to stop.":
"Así que Helena le pide al equipo que elija, en conjunto, qué conservar y qué dejar.",
"For each thing on the wall, they ask: who uses it, and for what?":
"Por cada cosa en la pared, preguntan: ¿quién la usa, y para qué?",
"For the reports, the logs answer: 21 are read by about 260 people. The other 17, by nobody, for a year or more.":
"Para los informes, responden los registros: 21 los leen unas 260 personas. Los otros 17, nadie, desde hace un año o más.",
"Before they stop anything, they agree what each kind of thing is for.":
"Antes de dejar algo, acuerdan para qué sirve cada tipo de cosa.",
"A meeting is for deciding together, or helping someone. Not for reading out what the team's board already shows.":
"Una reunión es para decidir juntos o ayudar a alguien. No para leer en voz alta lo que ya muestra el tablero del equipo.",
"An alert is for someone who must act now.":
"Una alerta es para alguien que debe actuar ya.",
"A report is for a decision someone makes.":
"Un informe es para una decisión que alguien toma.",
"Then they design the week they want: a 15-minute stand-up each morning, and planning on Monday.":
"Luego diseñan la semana que quieren: una reunión de pie de 15 minutos cada mañana, y la planificación el lunes.",
"A review with the people who asked, every second Thursday, and a half-hour one-to-one.":
"Una revisión con quienes pidieron el trabajo, cada dos jueves, y una reunión uno a uno de media hora.",
"About three hours a week each, instead of eight.":
"Unas tres horas a la semana por persona, en lugar de ocho.",
"From Monday 10 May, that's the week. The other standing meetings stop, like the weekly round of updates the board now shows.":
"Desde el lunes 10 de mayo, esa es la semana. Las demás reuniones fijas terminan, como la ronda semanal de avances que ya muestra el tablero.",
"For each of the 17 reports, the team first writes to its last readers, and to whoever asked for it.":
"Por cada uno de los 17 informes, el equipo escribe primero a sus últimos lectores y a quien lo pidió.",
"Most have moved on. One reader needs last year's figures, and gets a copy.":
"La mayoría ya no lo usa. Alguien necesita las cifras del año pasado y recibe una copia.",
"On Tuesday 25 May, the data council approves the plan: the 21 reports people read will move to the platform, and the 17 won't.":
"El martes 25 de mayo, el consejo de datos aprueba el plan: los 21 informes que la gente lee pasarán a la plataforma, y los 17 no.",
"On Monday 31 May, the 17 are switched off, not deleted.":
"El lunes 31 de mayo, los 17 se apagan, no se borran.",
"Until the old warehouse closes in December, any of them can be switched back on within a day.":
"Hasta que el antiguo almacén de datos cierre en diciembre, cualquiera puede volver a encenderse en un día.",
"GOV.UK did the same with its old pages: it didn't move them, it archived them, where they could still be found.":
"GOV.UK hizo lo mismo con sus páginas viejas: no las trasladó, las archivó, donde aún se podían encontrar.",
"Sam, who answers the platform's alerts, goes through them with Noor and Jun, one kind at a time, asking: when this fires, what do we do?":
"Sam, que atiende las alertas de la plataforma, las revisa con Noor y Jun, un tipo a la vez, preguntando: cuando esto salta, ¿qué hacemos?",
"Where the answer is nothing, the alert becomes a line in a summary each Monday morning.":
"Si la respuesta es nada, la alerta pasa a ser una línea en un resumen cada lunes por la mañana.",
"By Monday 7 June, about 12 alerts a week reach Sam, and each one needs someone to act, with a note that says what to do.":
"Para el lunes 7 de junio, a Sam le llegan unas 12 alertas por semana, y cada una pide que alguien actúe, con una nota que dice qué hacer.",
"The team chooses every cut, and any cut can be undone.":
"El equipo elige cada recorte, y todo recorte se puede deshacer.",
"The word minimalism comes from art. In the United States in the 1960s, it named work pared down to its simplest forms.":
"La palabra minimalismo viene del arte. En Estados Unidos, en los años sesenta, nombraba obras reducidas a sus formas más simples.",
"For a team, two ideas from Japan come closer.":
"Para un equipo, dos ideas de Japón se acercan más.",
"In Japanese aesthetics, kanso means simplicity: plain, with nothing extra.":
"En la estética japonesa, kanso significa simplicidad: lo sencillo, sin nada de más.",
"And lean, which grew out of Japan's car factories, calls work that adds no value muda: waste.":
"Y lean, que nació en las fábricas de autos de Japón, llama muda al trabajo que no agrega valor: desperdicio.",
"But the team never calls anyone's work waste. Every report on that wall once answered someone's real question.":
"Pero el equipo nunca llama desperdicio al trabajo de nadie. Cada informe en esa pared respondió alguna vez una pregunta real.",
"The designer Dieter Rams put the aim in three words: less, but better.":
"El diseñador Dieter Rams resumió el objetivo en tres palabras: menos, pero mejor.",
"Less isn't the point. Better is: what stays gets the time, and gets better.":
"Lo importante no es menos. Es mejor: lo que queda recibe el tiempo, y mejora.",
"In June, the team measures what came back.":
"En junio, el equipo mide lo que recuperó.",
"Each person has about five hours a week back from meetings. Across eight people, that's about one person's whole week, every week.":
"Cada persona recupera unas cinco horas semanales de reuniones. Entre ocho personas, es casi la semana entera de una persona, cada semana.",
"And every alert that reaches Sam now matters.":
"Y cada alerta que le llega a Sam ahora importa.",
"The time goes to the work people use: rebuilding on the platform the 21 reports they read, each with an owner.":
"El tiempo va al trabajo que la gente usa: rehacer en la plataforma los 21 informes que lee, cada uno con un responsable.",
"To keep that time, they agree one rule: anything new needs a reader, a reason and an owner.":
"Para conservar ese tiempo, acuerdan una regla: todo lo nuevo necesita un lector, una razón y un responsable.",
"And at each quarterly review, everything goes back on the wall.":
"Y en cada revisión trimestral, todo vuelve a la pared.",
"GOV.UK didn't try to fix every old page. It found what people needed, did less, and did it well.":
"GOV.UK no intentó arreglar cada página vieja. Encontró lo que la gente necesitaba, hizo menos, y lo hizo bien.",
"Helena's team did the same. It kept what people use, and got a person's week back, every week.":
"El equipo de Helena hizo lo mismo. Conservó lo que la gente usa, y recuperó la semana de una persona, cada semana.",
"On Monday, list everything your team runs and attends.":
"El lunes, anota todo lo que tu equipo mantiene y a lo que asiste.",
"Ask who uses each thing, and for what.":
"Pregunta quién usa cada cosa, y para qué.",
"Stop the rest together, and openly: switch it off, wait, then delete.":
"Deja el resto en equipo y a la vista: apágalo, espera, y luego bórralo.",
"Measure the time you get back, and protect it.":
"Mide el tiempo que recuperas, y protégelo.",
"The next film, One small change at a time, shows how to improve what you keep.":
"La próxima película, Un cambio pequeño cada vez, muestra cómo mejorar lo que conservas.",
"Keep what people use; stop the rest, together.":
"Conserva lo que la gente usa; deja el resto, en equipo."
});
