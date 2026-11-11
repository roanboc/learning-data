/* Growing people: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md has them: el equipo, la gestora de datos, una reunión uno a uno, retroalimentación (or comentarios, where it
   reads better), un objetivo (a person's own), una medida (the team's), hacerse cargo, el Consejo Universitario. In Japan: el maestro, el salón,
   la clase, el estudio de clases (jugyō kenkyū), una sesión de reflexión. At the university, as Many hats, one picture has them: el director de Instalaciones,
   las aulas, el edificio de aulas, el recorrido de una pregunta, las reservas, Semana Santa; the product is Uso de los espacios docentes, as the
   series' page has it, and the book keeps its name, Radical Candor, as on screen. Tú, as the film speaks to the viewer (pide, da, mira). Dates as Spanish says them (martes
   13 de abril). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Japan, in 1872. The new government sets out to give every child a school.":
"Japón, en 1872. El nuevo gobierno se propone dar una escuela a cada niño.",
"Teaching is new work, with new subjects and new methods, and few teachers are trained for it.":
"Enseñar es un trabajo nuevo, con materias y métodos nuevos, y pocos maestros están formados para ello.",
"By 1877, four schools in ten have a single teacher, and nearly one in three has a single classroom.":
"En 1877, cuatro de cada diez escuelas tienen un solo maestro, y casi una de cada tres, un solo salón.",
"A teacher alone with a class can't see what each child has understood, and nobody sees the lesson to help.":
"Un maestro solo con su grupo no ve lo que cada niño ha entendido, y nadie ve la clase para ayudar.",
"When a lesson loses the children, they fall behind, and the teacher may never learn why.":
"Cuando una clase pierde a los niños, se quedan atrás, y quizá el maestro nunca sepa por qué.",
"Teachers needed other eyes on their lessons.":
"Los maestros necesitaban otros ojos sobre sus clases.",
"Teachers opened their classrooms to each other.":
"Los maestros se abrieron sus salones unos a otros.",
"From the first year, new teachers learned by watching lessons, and teachers formed groups to learn together.":
"Desde el primer año, los maestros nuevos aprendían viendo clases, y formaron grupos para aprender juntos.",
"A visitor watched the children, not the teacher: how they answered, whether they were interested, and whether the questions suited them.":
"Quien visitaba miraba a los niños, no al maestro: cómo respondían, si les interesaba y si las preguntas les iban bien.",
"Afterwards, in a reflection session, they talked about what the children had learned, and where they got stuck.":
"Después, en una sesión de reflexión, hablaban de lo que los niños habían aprendido y de dónde se habían atorado.",
"In the 1880s, the groups began lesson study: jugyō kenkyū, in Japanese.":
"En los años 1880, los grupos crearon el estudio de clases: jugyō kenkyū, en japonés.",
"Teachers choose a goal, and plan a lesson together.":
"Los maestros eligen un objetivo, y planean juntos una clase.",
"One teaches it, while the others watch the children. Then they improve it, for next time.":
"Uno la da, mientras los demás miran a los niños. Luego la mejoran, para la próxima vez.",
"Lesson study spread to schools across Japan. Today, 99 in 100 primary teachers there say they took part in the past year.":
"El estudio de clases llegó a escuelas de todo Japón. Hoy, 99 de cada 100 maestros de primaria dicen que participaron el último año.",
"After 1999, a book about it carried it to many countries.":
"Después de 1999, un libro sobre él lo llevó a muchos países.",
"In a trial in the United States, 39 teams of teachers were split at random.":
"En un ensayo en Estados Unidos, 39 equipos de maestros se repartieron al azar.",
"Some used it for about three months, with research on how children learn fractions.":
"Algunos lo usaron unos tres meses, con investigación sobre cómo aprenden los niños las fracciones.",
"Their students understood fractions better than those of teams who trained another way.":
"Sus alumnos entendieron mejor las fracciones que los de los equipos que se formaron de otra manera.",
"At work, a new analyst can be alone too: nobody sees her work until it's done, and she hears how she's doing once a year, as a grade.":
"En el trabajo, una analista nueva también puede estar sola: nadie ve su trabajo hasta el final, y sabe cómo va una vez al año, con una nota.",
"People grow as those teachers did: with goals they help set, feedback every week about the work and its effect, and a next step.":
"La gente crece como esos maestros: con objetivos que ayuda a fijar, comentarios semanales sobre el trabajo y su efecto, y un siguiente paso.",
"At the university, a year from now, Ivy Reyes joins the data team on Monday 1 March. It's her first job, after a degree in statistics.":
"En la universidad, dentro de un año, Ivy Reyes entra al equipo de datos el lunes 1 de marzo. Es su primer empleo, tras estudiar estadística.",
"Helena Novak, the data manager, doesn't hand her a list of goals.":
"Helena Novak, la gestora de datos, no le entrega una lista de objetivos.",
"She asks Ivy to write three of her own, in her first week. On Friday 5 March, they agree them.":
"Le pide a Ivy que escriba tres propios, en su primera semana. El viernes 5 de marzo, los acuerdan.",
"One: to know the whole route of one question's data, by Easter.":
"Uno: conocer todo el recorrido de los datos de una pregunta, para Semana Santa.",
"Two: to have a pull request merged, by May.":
"Dos: que integren un pull request suyo, para mayo.",
"Three: to own a data product, by the middle of the year.":
"Tres: hacerse cargo de un producto de datos, para mediados de año.",
"Helena's part is real work to grow on: a question from Graham Ellis, the Director of Facilities, about the teaching rooms.":
"La parte de Helena es trabajo real para crecer: una pregunta de Graham Ellis, director de Instalaciones, sobre las aulas.",
"Her goals are her own. The team's measures stay the team's, and never become her targets.":
"Sus objetivos son suyos. Las medidas del equipo siguen siendo del equipo, y nunca se vuelven sus metas.",
"Like the teachers choosing their goal, she chose what to grow in.":
"Como los maestros al elegir su objetivo, ella eligió en qué crecer.",
"On Thursday 25 March, the first goal is met: the whole route of Graham's question, from his decision back to the sensors, on one page.":
"El jueves 25 de marzo cumple el primer objetivo: todo el recorrido de la pregunta de Graham, de su decisión a los sensores, en una página.",
"Every Tuesday, Ivy and Helena meet for thirty minutes. It's Ivy's time, about her, and never a status report.":
"Cada martes, Ivy y Helena se reúnen treinta minutos. Es el tiempo de Ivy, sobre ella, y nunca un informe de avance.",
"In 1996, Avraham Kluger and Angelo DeNisi brought together more than six hundred results on feedback.":
"En 1996, Avraham Kluger y Angelo DeNisi reunieron más de seiscientos resultados sobre la retroalimentación.",
"On average, feedback helped. But more than a third of the time, it made the work worse.":
"En promedio, la retroalimentación ayudó. Pero más de un tercio de las veces, empeoró el trabajo.",
"It helped least when it turned attention from the task to the person.":
"Ayudó menos cuando desvió la atención de la tarea a la persona.",
"So Helena's feedback has three parts. The Center for Creative Leadership calls them situation, behaviour and impact.":
"Por eso los comentarios de Helena tienen tres partes. El Center for Creative Leadership las llama situación, comportamiento e impacto.",
"Tuesday 13 April. Last Wednesday, reviewing the agent's draft, you checked it against Graham's own word for “used”.":
"Martes 13 de abril. El miércoles pasado, al revisar el borrador del agente, lo comparaste con lo que Graham llama «usada».",
"So his answer counts people in rooms, not bookings.":
"Así, su respuesta cuenta personas en las aulas, no reservas.",
"Not “you're brilliant”, which is about who she is: what she did, and what it changed.":
"No «eres brillante», que habla de quién es: lo que hizo, y lo que cambió.",
"Hard feedback works the same way. Kim Scott's Radical Candor, in 2017, puts it as: care personally, and challenge directly.":
"Los comentarios difíciles, igual. Radical Candor, de Kim Scott, en 2017, lo dice así: preocúpate en lo personal, y desafía de frente.",
"Tuesday 25 May. Last week, you kept your change to yourself for four days, to make it perfect.":
"Martes 25 de mayo. La semana pasada guardaste tu cambio cuatro días, para que quedara perfecto.",
"Jun had one afternoon to review it, so the review was rushed.":
"Jun tuvo una tarde para revisarlo, así que la revisión fue apresurada.",
"Ask for a review when it works, not when it's perfect.":
"Pide revisión cuando funcione, no cuando esté perfecto.",
"Small and often, while the work is fresh. Nothing waits for a review once a year.":
"Poco y seguido, mientras el trabajo está fresco. Nada espera a una evaluación de una vez al año.",
"Helena asks for feedback on herself too: what should I do differently?":
"Helena también pide comentarios sobre sí misma: ¿qué debería hacer distinto?",
"In June, Ivy tells her: when I bring you a question, you answer it at once, and I stop looking.":
"En junio, Ivy le dice: cuando te traigo una pregunta, la respondes enseguida, y dejo de buscar.",
"Helena thanks her. From then on, she first asks what Ivy has tried.":
"Helena le da las gracias. Desde entonces, primero le pregunta qué ha probado.",
"In lesson study, the group planned the lesson together, so the talk afterwards is about the lesson and the children's learning.":
"En el estudio de clases, el grupo planeó la clase junto, así que la charla de después trata de la clase y de lo que aprenden los niños.",
"On Thursday 24 June, the University Council puts off the new teaching building, and Graham writes to thank Helena.":
"El jueves 24 de junio, el Consejo Universitario aplaza el nuevo edificio de aulas, y Graham le escribe a Helena para agradecerle.",
"At the next review, she reads his note to the team.":
"En la siguiente reunión de revisión, le lee su nota al equipo.",
"She says who did each part: Ivy's route, Jun's models, Sam's sensors, and Mei's bookings.":
"Dice quién hizo cada parte: el recorrido de Ivy, los modelos de Jun, los sensores de Sam y las reservas de Mei.",
"The credit is the team's, in public.":
"El mérito es del equipo, en público.",
"From Thursday 1 July, Ivy owns her first data product: Teaching space use, the counts per room per hour, refreshed every Monday by seven.":
"Desde el 1 de julio, Ivy es dueña de su primer producto de datos, Uso de los espacios docentes: conteos por aula y hora, los lunes a las 7.",
"On Tuesday 20 July, they look back at her half year, and forward. All three goals are met.":
"El martes 20 de julio repasan su medio año, y miran adelante. Los tres objetivos están cumplidos.",
"What went well: Graham's page for the University Council. What she'd do differently: ask for review earlier.":
"Lo que salió bien: la página de Graham para el Consejo Universitario. Lo que haría distinto: pedir revisión antes.",
"And what she wants next: to make her Monday refresh better, and to teach what she learns.":
"Y lo que quiere ahora: mejorar su actualización de los lunes, y enseñar lo que aprende.",
"A growth conversation looks forward: where she wants to go, and what she needs to get there.":
"Una conversación de crecimiento mira hacia adelante: adónde quiere ir, y qué necesita para llegar.",
"On Tuesday 14 December, she has owned Teaching space use for nearly six months.":
"El martes 14 de diciembre, lleva casi seis meses a cargo de Uso de los espacios docentes.",
"Her next goal is one she chose: to coach the next graduate, in 2028.":
"Su siguiente objetivo lo eligió ella: ser mentora del próximo recién graduado, en 2028.",
"Analyst, then owner, then coach: each step with more to own.":
"Analista, luego dueña, luego mentora: en cada paso, más de qué hacerse cargo.",
"In Japan's schools, teachers have grown this way for a century and a half.":
"En las escuelas de Japón, los maestros han crecido así durante siglo y medio.",
"A goal they chose, eyes on the children's learning, and a better lesson next time.":
"Un objetivo que eligieron, la mirada en lo que aprenden los niños, y una clase mejor la próxima vez.",
"Helena did the same for Ivy: goals of her own, feedback every week about the work, and the next step.":
"Helena hizo lo mismo con Ivy: objetivos propios, comentarios cada semana sobre el trabajo, y el siguiente paso.",
"On Monday, let people write their own goals, then agree them.":
"El lunes, deja que cada quien escriba sus objetivos, y luego acuérdalos.",
"Give feedback every week: the situation, what they did, and its effect.":
"Da comentarios cada semana: la situación, lo que hizo, y su efecto.",
"Ask for feedback on yourself, and act on it.":
"Pide comentarios sobre ti, y actúa con ellos.",
"Look forward in growth conversations, and give the team the credit, in public.":
"Mira adelante en las conversaciones de crecimiento, y dale el mérito al equipo, en público.",
"Data work needs new skills. Leading the people who do it is a skill too.":
"El trabajo con datos pide habilidades nuevas. Liderar a quienes lo hacen también es una habilidad.",
"Their goals, weekly feedback about the work, the next step.":
"Sus objetivos, comentarios semanales sobre el trabajo, el siguiente paso."
});
