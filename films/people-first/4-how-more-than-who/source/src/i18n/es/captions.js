/* How, more than who: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md has them: el equipo, la gestora de datos, la página del equipo. At the bridge, the words of the study that Peru's Ministry of
   Culture published: una soguilla (a family's cord), una soga (a rope), un cable (the six great ones), los maestros (the two builders), el cañón, las orillas,
   brazadas. At the university, the site's own words: el día del censo, el sistema de estudiantes, la oficina de registro, el glosario, un ticket, cursos cortos,
   estudiantes and aprendices (students and learners), un informe (a report), una cifra (a number). Numbers with the picture's comma (18,412). The films named keep
   their pages' Spanish titles (Primero el equipo; Muchos roles, una sola mirada). Tú, as the film's last chapter speaks to the viewer (discrepa, cumple, relee). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Quehue, in the high Andes of Peru.":
"Quehue, en lo alto de los Andes del Perú.",
"Every June, four communities make a new bridge of grass rope, across a gorge of the Apurímac river.":
"Cada junio, cuatro comunidades hacen un puente nuevo de sogas de paja, sobre un cañón del río Apurímac.",
"It's twenty-eight metres long. About a thousand people build it, in three days.":
"Mide veintiocho metros. Lo construyen unas mil personas, en tres días.",
"No family could raise it alone. And there's no drawing of it, and no written plan.":
"Ninguna familia podría levantarlo sola. Y no hay un dibujo del puente, ni un plan escrito.",
"Yet it has to hold. For a year, people will cross it, about fifteen metres above the river.":
"Pero tiene que resistir. Durante un año, la gente lo cruzará, a unos quince metros sobre el río.",
"Its strength depends on every cord in it. So everyone needs to know their own part, and to trust everyone else's.":
"Su fuerza depende de cada soguilla. Así que cada quien necesita saber su parte, y confiar en la de los demás.",
"What they have is a way of working that everyone knows.":
"Lo que tienen es una manera de trabajar que todos conocen.",
"Each family has promised a cord of twisted grass, forty arm spans long. First, on both banks, every cord is checked in.":
"Cada familia ha prometido una soguilla de paja torcida, de cuarenta brazadas. Primero, en ambas orillas, se verifica cada entrega.",
"Each community knows its part: which of the six cables to make, or the mat for the floor.":
"Cada comunidad sabe su parte: cuál de los seis cables hacer, o la estera para el piso.",
"Men twist the cords into ropes, and braid three ropes into each cable of the floor.":
"Los hombres tuercen las soguillas en sogas, y trenzan tres sogas en cada cable del piso.",
"One man braids until he tires. Then another takes his place.":
"Uno trenza hasta que se cansa. Entonces otro toma su lugar.",
"Then many hands pull the cables across the gorge, and tie them to old stone bases, the older guiding the younger.":
"Luego muchas manos pasan los cables sobre el cañón, y los atan a viejas bases de piedra; los mayores guían a los jóvenes.",
"On the last day, two builders weave the sides and the floor, one from each bank, until they meet in the middle.":
"El último día, dos maestros tejen los lados y el piso, uno desde cada orilla, hasta encontrarse en el medio.",
"By that afternoon, four communities have a bridge for another year. The next day, they celebrate.":
"Esa misma tarde, cuatro comunidades tienen puente para un año más. Al día siguiente, celebran.",
"Nobody was handed a plan. What they share is how they work: promises kept, and parts that everyone knows.":
"A nadie le dieron un plan. Lo que comparten es cómo trabajan: promesas cumplidas, y partes que todos conocen.",
"A data team's work is like that. Nobody can do it alone, and every part leans on someone else's.":
"El trabajo de un equipo de datos es así. Nadie puede hacerlo solo, y cada parte se apoya en la de alguien más.",
"So how a team works together counts for more than who is in it.":
"Por eso, cómo trabaja junto un equipo cuenta más que quién está en él.",
"Google once studied 180 of its own teams, to learn why some worked better than others.":
"Google estudió una vez 180 de sus propios equipos, para saber por qué unos trabajaban mejor que otros.",
"What really mattered, it found, was less about who is on the team, and more about how the team worked together.":
"Lo que de verdad importaba, encontró, era menos quién está en el equipo, y más cómo trabajaba junto el equipo.",
"First on its list came psychological safety: people speak up when it's safe to. A later film, The team comes first, is about that.":
"Primero en su lista estaba la seguridad psicológica: la gente habla cuando es seguro. De eso trata otra película, Primero el equipo.",
"Then came keeping your word, and being clear about who does what.":
"Después venían cumplir la palabra, y tener claro quién hace qué.",
"The gorge has both, from custom. In a data team, somebody has to say them out loud.":
"El cañón tiene ambas, por costumbre. En un equipo de datos, alguien tiene que decirlas en voz alta.",
"The university, Wednesday the 24th of February, 2027. Helena Novak, the data manager, is in her fourth week.":
"La universidad, miércoles 24 de febrero de 2027. Helena Novak, la gestora de datos, está en su cuarta semana.",
"Jun, the analytics engineer, has built a new model, to take over one of the old reports.":
"Jun, ingeniero de analítica, hizo un modelo nuevo, que reemplazará uno de los informes antiguos.",
"To check it, he runs both for census day last year, when the university counted its students for the government.":
"Para comprobarlo, corre ambos para el día del censo del año pasado, cuando la universidad contó a sus estudiantes para el gobierno.",
"The old report says 18,412. The new model says 19,549.":
"El informe antiguo dice 18,412. El modelo nuevo dice 19,549.",
"Tomás Ortega built that report, years ago. People still ask him what its numbers mean.":
"Tomás Ortega hizo ese informe, hace años. La gente todavía le pregunta qué significan sus cifras.",
"At the team's table, Jun says: your report is wrong. Tomás answers: your model is new.":
"En la mesa del equipo, Jun dice: tu informe está mal. Tomás responde: tu modelo es nuevo.",
"Two people do all the talking. Erin Walsh and Marta Silva haven't said a word.":
"Solo dos personas hablan. Erin Walsh y Marta Silva no han dicho ni una palabra.",
"Across 116 studies, conflict about the person harms a team's work. Disagreement about the work need not, if it stays about the work.":
"En 116 estudios, el conflicto sobre la persona daña el trabajo del equipo. El desacuerdo sobre el trabajo no, si se queda en el trabajo.",
"So Helena stops it, and says why: we've left the number, and started on each other.":
"Así que Helena lo detiene, y dice por qué: dejamos la cifra, y empezamos uno contra el otro.",
"She asks each of them for three things: what you saw, what you feel and need, and what you ask.":
"A cada uno le pide tres cosas: qué viste, qué sientes y necesitas, y qué pides.",
"Jun goes first. I saw two numbers for the same thing.":
"Jun va primero. Vi dos cifras para la misma cosa.",
"I'm worried, because I need people to trust what we publish.":
"Me preocupa, porque necesito que la gente confíe en lo que publicamos.",
"I ask that we check them side by side, before either is sent.":
"Pido que las revisemos lado a lado, antes de enviar ninguna.",
"Then Tomás. I heard my report called wrong, before anyone asked what it counts.":
"Luego Tomás. Oí decir que mi informe está mal, antes de que alguien preguntara qué cuenta.",
"That stung, because I need what I built to be read before it's replaced.":
"Me dolió, porque necesito que lo que hice se lea antes de reemplazarlo.",
"I ask to be asked.":
"Pido que me pregunten.",
"The three things come from non-violent communication, the work of the psychologist Marshall Rosenberg.":
"Las tres cosas vienen de la comunicación no violenta, obra del psicólogo Marshall Rosenberg.",
"It rests on practice and small studies, not on large trials. But feelings are in a hard conversation anyway.":
"Se apoya en práctica y estudios pequeños, no en grandes ensayos. Pero en una conversación difícil los sentimientos ya están.",
"Once they're named, they can be answered. So Jun asks: what does your report count?":
"Una vez nombrados, se les puede responder. Y Jun pregunta: ¿qué cuenta tu informe?",
"Then Helena gives everyone a turn.":
"Entonces Helena le da un turno a cada quien.",
"Erin, the platform engineer, hadn't spoken. The old report, she says, reads only the student system.":
"Erin, la ingeniera de plataforma, no había hablado. El informe antiguo, dice, solo lee el sistema de estudiantes.",
"Marta, the analyst, knows the university's numbers. She says what each of the two counts.":
"Marta, la analista, conoce las cifras de la universidad. Dice qué cuenta cada una de las dos.",
"The report counts students: people taking the units that make up a degree. That's the number sent to the government.":
"El informe cuenta estudiantes: personas que cursan las materias que forman una carrera. Es la cifra que se envía al gobierno.",
"The model counts learners: those students, and 1,137 people on short courses as well.":
"El modelo cuenta aprendices: esos estudiantes, y además 1,137 personas en cursos cortos.",
"Both numbers are right. They were never the same thing.":
"Las dos cifras están bien. Nunca fueron la misma cosa.",
"Anita Woolley and her colleagues gave small groups many kinds of task. What the best groups had, they called collective intelligence.":
"Anita Woolley y sus colegas dieron muchos tipos de tarea a grupos pequeños. A lo que tenían los mejores lo llamaron inteligencia colectiva.",
"It had little to do with how clever the cleverest member was. It went with taking turns to speak more equally.":
"Tenía poco que ver con lo listo que fuera el más listo. Iba con turnarse para hablar de forma más pareja.",
"Which number the university publishes isn't Jun's to decide, or Tomás's, or Helena's.":
"Qué cifra publica la universidad no lo decide Jun, ni Tomás, ni Helena.",
"It belongs to the registrar's office, which owns what the two words mean. So Jun asks, in a ticket.":
"Le toca a la oficina de registro, dueña de lo que significan las dos palabras. Así que Jun pregunta, en un ticket.",
"And what each word counts goes into the glossary, before a line of the model changes.":
"Y lo que cuenta cada palabra entra al glosario, antes de cambiar una sola línea del modelo.",
"On Thursday, the eight of them write one page: how we work together. Five lines, in their own words.":
"El jueves, los ocho escriben una página: cómo trabajamos juntos. Cinco líneas, con sus propias palabras.",
"How we meet: the question the day before, and a turn each.":
"Cómo nos reunimos: la pregunta un día antes, y un turno cada quien.",
"How we ask for help: early, and out loud.":
"Cómo pedimos ayuda: pronto, y en voz alta.",
"How we disagree: about the work, never the person. Say what you saw, what you need, and what you ask.":
"Cómo discrepamos: sobre el trabajo, nunca la persona. Di qué viste, qué necesitas, y qué pides.",
"How we decide: whoever owns it decides, after hearing the others, and writes it down.":
"Cómo decidimos: decide quien es dueño del tema, tras escuchar a los demás, y lo deja escrito.",
"How we say, I can't make that date: as soon as we know, with a new date.":
"Cómo decimos, no llego a esa fecha: en cuanto lo sabemos, con una fecha nueva.",
"That last line is how trust is kept. Across 112 studies, teams whose members trust each other do better work.":
"Esa última línea es cómo se cuida la confianza. En 112 estudios, los equipos cuyos miembros confían entre sí trabajan mejor.",
"Researchers call such a page a team charter. In a study of 32 student teams, the work that held up best had a good charter and a good plan.":
"Quienes investigan la llaman carta de equipo. En 32 equipos de estudiantes, el trabajo que mejor se sostuvo tenía buena carta y buen plan.",
"That's one small study. The page comes from practice, not from a trial.":
"Es un solo estudio pequeño. La página viene de la práctica, no de un ensayo.",
"At the gorge, the way is passed on by doing it, parents beside children. A team has no such years. So it writes.":
"En el cañón, la manera se pasa haciéndola, padres junto a hijos. Un equipo no tiene esos años. Por eso escribe.",
"On Friday, the page is on the wall.":
"El viernes, la página está en la pared.",
"At the gorge, that way of working still brings four communities together. It hasn't always kept the bridge.":
"En el cañón, esa manera de trabajar todavía reúne a cuatro comunidades. No siempre ha mantenido el puente.",
"Around 1970, with a steel bridge newly built beside it, the communities let it go for a time.":
"Hacia 1970, con un puente de acero recién hecho a su lado, las comunidades lo dejaron por un tiempo.",
"In 2020, the pandemic stopped the work, and in March 2021 the bridge fell.":
"En 2020, la pandemia detuvo el trabajo, y en marzo de 2021 el puente cayó.",
"In May 2025, someone cut it down in the night.":
"En mayo de 2025, alguien lo cortó de noche.",
"Each time, the communities wove it again.":
"Cada vez, las comunidades lo volvieron a tejer.",
"The weaving itself is taught only inside a builder's own family, as their tradition asks.":
"El tejido mismo se enseña solo dentro de la familia de cada maestro, como pide su tradición.",
"Fewer of the young speak Quechua, the language of the work.":
"Menos jóvenes hablan quechua, la lengua del trabajo.",
"And most people cross on the steel bridge now, so visitors help keep this one going.":
"Y hoy casi todos cruzan por el puente de acero, así que los visitantes ayudan a mantener este.",
"And custom settles who does which part: who makes the cord, who braids the cables, and who may learn to weave.":
"Y la costumbre fija quién hace qué parte: quién hace la soguilla, quién trenza los cables, y quién puede aprender a tejer.",
"That's the communities' own way, and it isn't ours to judge. It just isn't a model for a data team.":
"Es la manera propia de las comunidades, y no nos toca juzgarla. Solo que no es un modelo para un equipo de datos.",
"A data team has to ask each person. And it can't leave what it knows with one person, or one line of people.":
"Un equipo de datos tiene que preguntar a cada persona. Y no puede dejar lo que sabe en una sola persona, ni en un solo linaje.",
"Tomás asked to be asked. And what his report counts is in the glossary now, where anyone can read it.":
"Tomás pidió que le preguntaran. Y lo que cuenta su informe ya está en el glosario, donde cualquiera puede leerlo.",
"With your own team, write one page together, in your own words.":
"Con tu propio equipo, escriban juntos una página, con sus propias palabras.",
"Disagree about the work, in the open. When it turns to the person, stop, and say so.":
"Discrepa sobre el trabajo, abiertamente. Cuando se vuelva contra la persona, detente, y dilo.",
"Keep small promises, and say early when you can't.":
"Cumple las promesas pequeñas, y avisa pronto cuando no puedas.",
"The bridge is made again each June. So read your page again each quarter, and whenever someone joins.":
"El puente se hace de nuevo cada junio. Así que relee tu página cada trimestre, y cada vez que alguien se una.",
"On Monday the 1st of March, someone does. Ivy Reyes, a new graduate, opens the door.":
"El lunes 1 de marzo, alguien se une. Ivy Reyes, recién graduada, abre la puerta.",
"Her year starts in the next film: Many hats, one picture.":
"Su año empieza en la próxima película: Muchos roles, una sola mirada.",
"Agree how you work together, and keep to it.":
"Acuerda con tu equipo cómo trabajar, y cúmplelo."
});
