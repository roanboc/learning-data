/* Rules that let people decide: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md has them: el equipo, la gestora de datos, el Consejo Universitario (never "el consejo", which is the data council), los referentes
   de datos. In Bali: los arroceros, el subak (los subaks), el templo del agua, el calendario, las plagas, el saltahojas pardo del arroz, el banco. At the
   university: la oficina de registro, el horario, las reservas, un aula, los conteos, el gobierno de datos, el glosario, la plantilla, la hoja de ruta, una persona
   "responsable de horarios" for each faculty's timetable officer (quien planifica, where the English says "their"), los reportes de aulas. Teaching space use,
   Data mesh and Team Topologies keep their names. Tú, as the film speaks to the viewer (escribe, haz, di, observa, agrega). Dates in words as Spanish says
   them (el lunes 4 de octubre), and the 1970s and 1980s as la década de 1970 and de 1980. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Bali, Indonesia, in the 1970s.":
"Bali, Indonesia, en la década de 1970.",
"For over a thousand years, rice farmers here have shared the water that runs down from the mountains.":
"Desde hace más de mil años, los arroceros de aquí comparten el agua que baja de las montañas.",
"Farmers who take water from one canal form a subak: a group that decides, together, how to share it.":
"Los agricultores que toman agua de un mismo canal forman un subak: un grupo que decide, en común, cómo repartirla.",
"Groups along a river meet at a water temple, and agree a calendar: who plants first, and who follows.":
"Los grupos a lo largo de un río se reúnen en un templo del agua y acuerdan un calendario: quién siembra primero y quién después.",
"Planting in turns shares the water, so the fields downstream don't run dry.":
"Sembrar por turnos reparte el agua, y así los campos de río abajo no se secan.",
"And fields harvested together lie empty together, so the pests that live on rice go hungry.":
"Y los campos que se cosechan juntos quedan vacíos juntos, y las plagas que viven del arroz pasan hambre.",
"Then the country set out to grow more rice, fast.":
"Entonces el país se propuso cultivar más arroz, y rápido.",
"Farmers were told to plant new, quick-growing rice as often as they could, whatever the temples' calendar said.":
"Se les dijo que sembraran un arroz nuevo y rápido tan a menudo como pudieran, sin importar el calendario de los templos.",
"The planners wanted the country fed, and the new rice gave more grain.":
"Los planificadores querían alimentar al país, y el arroz nuevo daba más grano.",
"But with every field on its own clock, the pests always found rice next door.":
"Pero con cada campo a su propio ritmo, las plagas siempre encontraban arroz en el campo de al lado.",
"A tiny insect, the brown planthopper, destroyed about two million tons of rice across Indonesia in 1977.":
"Un insecto diminuto, el saltahojas pardo del arroz, destruyó unos dos millones de toneladas de arroz en Indonesia en 1977.",
"In the dry season, farms downstream waited for water that didn't come.":
"En la estación seca, las fincas de río abajo esperaban un agua que no llegaba.",
"For a farming family, a lost harvest meant a season's food and income gone.":
"Para una familia campesina, una cosecha perdida era la comida y los ingresos de una temporada.",
"Someone had to show the planners what the temples already knew.":
"Alguien tenía que mostrarles a los planificadores lo que los templos ya sabían.",
"In the 1980s, the anthropologist Stephen Lansing and the ecologist James Kremer built a computer model of two rivers and their 172 subaks.":
"En la década de 1980, el antropólogo Stephen Lansing y el ecólogo James Kremer hicieron un modelo informático de dos ríos y sus 172 subaks.",
"It showed that the temples' calendar gave the biggest harvests, balancing hungry pests against shared water.":
"Mostró que el calendario de los templos daba las mayores cosechas, equilibrando plagas hambrientas y agua compartida.",
"In 1988 they took it to the bank that had paid for new irrigation works, and the bank agreed.":
"En 1988 lo llevaron al banco que había pagado nuevas obras de riego, y el banco les dio la razón.",
"Officials let the temples set the planting again, and farmers were no longer told to plant as fast as they could.":
"Las autoridades dejaron que los templos fijaran de nuevo la siembra, y ya no se pidió a los agricultores sembrar lo más rápido posible.",
"The pests came under control, and farmers sprayed less.":
"Las plagas quedaron bajo control, y los agricultores fumigaron menos.",
"The bank's final report said no project it had reviewed ran itself as well as Bali's.":
"El informe final del banco dijo que ningún proyecto revisado funcionaba solo tan bien como el de Bali.",
"And in 2012, UNESCO listed the subak landscape as World Heritage.":
"Y en 2012, la UNESCO inscribió el paisaje de los subaks como Patrimonio Mundial.",
"A data team can make the planners' mistake: every decision taken in one place, far from the work.":
"Un equipo de datos puede cometer el error de los planificadores: cada decisión tomada en un solo lugar, lejos del trabajo.",
"This film follows a team that gives the decisions back, and finds what no central plan had looked for.":
"Esta película sigue a un equipo que devuelve las decisiones, y encuentra lo que ningún plan central había buscado.",
"A university, a year from now, in September 2027.":
"Una universidad, dentro de un año, en septiembre de 2027.",
"In June, the University Council asked for a new timetable from February, with fewer classes at peak hours, and put off a new building.":
"En junio, el Consejo Universitario pidió un nuevo horario desde febrero, con menos clases en las horas pico, y aplazó un edificio nuevo.",
"Each of the four faculties has a timetable officer who plans its classes.":
"Cada una de las cuatro facultades tiene su responsable de horarios, que planifica sus clases.",
"To plan, they need to know which rooms are used, and when. That's in one data product: Teaching space use.":
"Para planificar, necesitan saber qué aulas se usan, y cuándo. Eso está en un producto de datos: Teaching space use.",
"But only the data team worked with it, so every room question came to them.":
"Pero solo el equipo de datos trabajaba con él, así que cada pregunta sobre aulas llegaba a ellos.",
"From July to September, the faculties asked for 27 room reports.":
"De julio a septiembre, las facultades pidieron 27 reportes de aulas.",
"Each took about a day and a half to make, and waited about two weeks in the list.":
"Cada uno tomaba un día y medio de trabajo, y esperaba unas dos semanas en la lista.",
"Helena Novak, the data manager, saw more: when two faculties asked at once, she chose whose rooms came first.":
"Helena Novak, la gestora de datos, vio algo más: cuando dos facultades pedían a la vez, ella elegía qué aulas iban primero.",
"Every room decision in the university now passed through one small team, and through her.":
"Cada decisión sobre aulas en la universidad pasaba ahora por un equipo pequeño, y por ella.",
"The people who knew the courses were waiting for the people who knew the data.":
"Quienes conocían los cursos esperaban a quienes conocían los datos.",
"So she decided to stop deciding: the faculties would read the data themselves.":
"Así que decidió dejar de decidir: las facultades leerían los datos por sí mismas.",
"Yusuf Demir, who leads data governance, drafted the rules for letting the faculties in.":
"Yusuf Demir, que dirige el gobierno de datos, redactó las reglas para dejar entrar a las facultades.",
"His first list had eleven, each guarding against something that had gone wrong somewhere.":
"Su primera lista tenía once, cada una contra algo que había salido mal en algún lugar.",
"Of each, they asked: what goes wrong here, now, without it?":
"De cada una se preguntaron: ¿qué sale mal aquí, ahora, sin ella?",
"Three were needed now.":
"Tres hacían falta ahora.",
"One: room use means one thing for everyone, the share of hours in which someone was counted, so the faculties' numbers add up.":
"Una: el uso de un aula es lo mismo para todos, la proporción de horas con alguien contado, para que las cifras de las facultades cuadren.",
"Two: the product's promise holds: counts per room per hour, never a person, so nobody is watched.":
"Dos: la promesa del producto se cumple: conteos por aula y por hora, nunca una persona, para que nadie sea vigilado.",
"Three: before you publish a new measure from it, ask its owner, Ivy, so each new number means one thing, written down first.":
"Tres: antes de publicar una medida nueva con él, pregunta a su dueña, Ivy, para que cada número nuevo signifique una cosa, escrita primero.",
"The other eight went in a drawer, to come out only when a real problem showed.":
"Las otras ocho fueron a un cajón, para salir solo cuando apareciera un problema real.",
"The political economist Elinor Ostrom studied fishing grounds, forests and irrigation that people had shared for centuries.":
"La economista política Elinor Ostrom estudió pesquerías, bosques y riegos que la gente había compartido durante siglos.",
"The ones that lasted had a few clear rules, fitted to the place, made and changed by the people who live by them.":
"Los que duraron tenían unas pocas reglas claras, ajustadas al lugar, hechas y cambiadas por la gente que vive de ellas.",
"Helena agreed the three with the four officers, not for them, and any of them can ask to change one.":
"Helena acordó las tres con los cuatro responsables de horarios, no en su lugar, y cualquiera puede pedir cambiar una.",
"Rules say what's right. Tools make it easy.":
"Las reglas dicen lo correcto. Las herramientas lo facilitan.",
"Ivy and Jun made a template: a page on the platform with booked hours beside counted ones, and room use worked out the agreed way.":
"Ivy y Jun hicieron una plantilla en la plataforma: las horas reservadas junto a las contadas, y el uso calculado como se acordó.",
"An officer copies it, picks their faculty's rooms, and asks their own questions: an afternoon, not two weeks.":
"Quien planifica la copia, elige las aulas de su facultad y hace sus propias preguntas: una tarde, no dos semanas.",
"Anil, Health's data partner, sat with its officer for her first hour.":
"Anil, referente de datos de Salud, acompañó a su responsable en su primera hora.",
"Beside the numbers, one box says who decides what.":
"Junto a los números, un recuadro dice quién decide qué.",
"The faculties decide their classes, and Ivy decides what the numbers mean.":
"Las facultades deciden sus clases, e Ivy decide qué significan los números.",
"The team keeps the platform, and the registrar's office keeps the timetable.":
"El equipo cuida la plataforma, y la oficina de registro cuida el horario.",
"Data mesh and the book Team Topologies agree: decisions with the people who know the work, on a platform that makes the hard parts easy.":
"Data mesh y el libro Team Topologies coinciden: las decisiones, con quienes conocen el trabajo, en una plataforma que facilita lo difícil.",
"On Monday 4 October, the officers started, and the team stopped making room reports by hand.":
"El lunes 4 de octubre, los responsables de horarios empezaron, y el equipo dejó de hacer reportes de aulas a mano.",
"Lucy Tran, Engineering's timetable officer, opened the template that Monday.":
"Lucy Tran, responsable de horarios de Ingeniería, abrió la plantilla ese lunes.",
"Engineering books its own teaching labs, so they had never been in the university's room reports.":
"Ingeniería reserva sus propios laboratorios docentes, así que nunca habían estado en los reportes de aulas de la universidad.",
"The labs have sensors too, so Lucy put her faculty's lab bookings beside their counts.":
"Los laboratorios también tienen sensores, así que Lucy puso sus reservas junto a sus conteos.",
"Every Monday morning, nine of Engineering's twelve labs were booked, and the sensors counted nobody in them.":
"Cada lunes por la mañana, nueve de los doce laboratorios de Ingeniería estaban reservados, y los sensores no contaban a nadie.",
"Nobody had asked: no report had ever put the two side by side.":
"Nadie lo había preguntado: ningún reporte había juntado las dos cosas.",
"Lucy knew who to ask: two first-year courses had moved their lab classes to Thursdays, and their Monday bookings had rolled over every year.":
"Lucy sabía a quién preguntar: dos cursos de primero habían pasado sus laboratorios al jueves, y sus reservas del lunes se repetían cada año.",
"Lab use was a new measure, so before she shared it, Lucy asked Ivy.":
"El uso de laboratorios era una medida nueva: antes de compartirla, Lucy consultó a Ivy.",
"Ivy wrote it in the glossary the same way as room use, and the team built it into the product, for every faculty.":
"Ivy la escribió en el glosario igual que el uso de las aulas, y el equipo la incorporó al producto, para todas las facultades.",
"Engineering released the nine Monday mornings, and put its request for two new labs on hold.":
"Ingeniería liberó las nueve mañanas de lunes, y dejó en pausa su pedido de dos laboratorios nuevos.",
"Then something nobody planned happened.":
"Entonces pasó algo que nadie había planeado.",
"Within three weeks, Health had copied Lucy's page for its clinical skills rooms, and Arts for its studios.":
"En tres semanas, Salud había copiado la página de Lucy para sus salas de habilidades clínicas, y Artes para sus talleres.",
"One faculty's question had become three, and nobody had sent an instruction.":
"La pregunta de una facultad se había vuelto tres, y nadie había enviado una instrucción.",
"Lansing and Kremer saw the same in their model. Each year, every subak looked at its four nearest neighbours, and copied the best harvest.":
"Lansing y Kremer vieron lo mismo en su modelo. Cada año, cada subak miraba a sus cuatro vecinos más cercanos, y copiaba la mejor cosecha.",
"Within about eight years, groups planting together appeared, much like the real temple networks, and harvests rose.":
"En unos ocho años, aparecieron grupos que sembraban juntos, muy parecidos a las redes de templos reales, y las cosechas subieron.",
"Nobody had drawn them.":
"Nadie los había dibujado.",
"By Friday 26 November, all four faculties had sent the registrar's office their plans for February.":
"Para el viernes 26 de noviembre, las cuatro facultades habían enviado a la oficina de registro sus planes para febrero.",
"Together, they moved one peak class in six, as the University Council had asked.":
"Juntas, movieron una de cada seis clases de hora pico, como había pedido el Consejo Universitario.",
"In October and November the team made no room reports by hand, and the time went back to the roadmap.":
"En octubre y noviembre el equipo no hizo ningún reporte de aulas a mano, y ese tiempo volvió a la hoja de ruta.",
"Helena's job changed too: less deciding, more watching what emerged, and asking what it taught.":
"El trabajo de Helena también cambió: menos decidir, más observar lo que surgía, y preguntarse qué enseñaba.",
"One real problem did show: Health sent its heads of school a copy of its page from three weeks before, and two planned from old numbers.":
"Sí apareció un problema real: Salud mandó a sus jefes de escuela una copia de hacía tres semanas, y dos planificaron con cifras viejas.",
"So one rule came out of the drawer, with its reason: share the live page, not a copy, because copies go stale.":
"Así que una regla salió del cajón, con su razón: comparte la página viva, no una copia, porque las copias envejecen.",
"And the template now shows the date of its data in the corner.":
"Y la plantilla ahora muestra en la esquina la fecha de sus datos.",
"Four rules, each with its reason, and still room to decide.":
"Cuatro reglas, cada una con su razón, y todavía espacio para decidir.",
"In Bali, nobody planned every field. Each subak decided its own work, a shared calendar timed it together, and the harvests held.":
"En Bali, nadie planificó cada campo. Cada subak decidió su propio trabajo, un calendario común lo coordinó, y las cosechas se sostuvieron.",
"At the university, four officers planned their own rooms, a few rules kept the numbers true, and what nobody had looked for came to light.":
"En la universidad, cuatro responsables planificaron sus aulas, pocas reglas mantuvieron fieles las cifras, y apareció lo que nadie buscaba.",
"On Monday, write few rules, each with its reason.":
"El lunes, escribe pocas reglas, cada una con su razón.",
"Make the right way the easy way.":
"Haz que el camino correcto sea el fácil.",
"Say who decides what.":
"Di quién decide qué.",
"Watch what emerges, and learn from it.":
"Observa lo que surge, y aprende de ello.",
"And add a rule only when a real problem shows.":
"Y agrega una regla solo cuando aparezca un problema real.",
"A few clear rules, good tools, and trust.":
"Unas pocas reglas claras, buenas herramientas y confianza."
});
