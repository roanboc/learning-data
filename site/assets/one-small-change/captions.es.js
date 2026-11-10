/* One small change at a time: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module has them: el equipo, la revisión (a review), el tablero; Ivy's product keeps the Spanish name the series page gives it, Uso de los espacios
   docentes, and Facilities is Instalaciones; las aulas (the rooms), las reservas y los conteos, la página del producto, sus lectores. As the data quality films say
   it, un control for a check inside the job, which falla, and una prueba for a test in Jun's models; the job is un proceso. Ivy's own check by hand is su revisión
   a mano. The cycle is the one Latin America knows as PHVA: planear, hacer, verificar, actuar; so to check a change is verificar, and checked is verificado.
   Learning time is el tiempo de aprendizaje; a refresh, la actualización; a checklist, una lista de verificación; what's in the way, qué obstáculos hay.
   In Colombo, 2000: el Hospital de Mujeres de Castle Street, el director, el personal, las salas (the wards), una cesárea, los recién nacidos, el ministerio;
   5S and kaizen stay as they are, kaizen glossed as cambio para mejor; Japan's aid agency is la cooperación japonesa. The modules named are Gestión de datos
   and Calidad de datos, as the site calls them. Tú, as the film speaks to the viewer (elige, cronometra, deja, automatiza, pregunta, cambia, conserva).
   Dates in words as Spanish says them (jueves 1 de julio de 2027). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Colombo, Sri Lanka, in the year 2000.":
"Colombo, Sri Lanka, en el año 2000.",
"At the Castle Street Hospital for Women, a public hospital where mothers come to give birth, the director is Dr Wimal Karandagoda.":
"En el Hospital de Mujeres de Castle Street, un hospital público donde las madres van a dar a luz, el director es el Dr. Wimal Karandagoda.",
"Too many mothers there catch an infection after a Caesarean, a birth by operation, and too many newborn babies catch one too.":
"Demasiadas madres contraen ahí una infección después de una cesárea, un parto por operación, y demasiados recién nacidos también.",
"An infection is germs in a wound, or in a baby's body: fever and pain, days more in hospital, and real danger to mother and child.":
"Una infección son gérmenes en una herida o en el cuerpo de un bebé: fiebre y dolor, más días en el hospital y peligro real para los dos.",
"And there's no money for a fix: at first, the ministry gives nothing for it.":
"Y no hay dinero para arreglarlo: al principio, el ministerio no da nada para eso.",
"Something has to change.":
"Algo tiene que cambiar.",
"The director brings in a way of working from Japanese factories, already used by companies in Sri Lanka: five steps, called 5S.":
"El director trae una forma de trabajar de las fábricas japonesas, que ya usan empresas de Sri Lanka: cinco pasos, llamados 5S.",
"Sort out what isn't needed. Set the rest in order. Shine: clean it. Standardise: agree one way, and write it down. And sustain it.":
"Separa lo que no se necesita. Ordena el resto. Limpia. Estandariza: acuerda una forma y ponla por escrito. Y mantenlo.",
"It costs little, and everyone can see the change with their own eyes.":
"Cuesta poco, y todos pueden ver el cambio con sus propios ojos.",
"The staff of each ward do it themselves, starting with their own corner of the work.":
"El personal de cada sala lo hace por sí mismo, empezando por su propio rincón del trabajo.",
"Then comes kaizen: small changes the staff propose themselves, try, check, and keep or drop.":
"Luego viene el kaizen: cambios pequeños que el propio personal propone, prueba, verifica, y conserva o descarta.",
"At first, not everyone wants it. Ward by ward, it spreads through the hospital.":
"Al principio, no todos lo quieren. Sala por sala, se extiende por el hospital.",
"In two years, infections after a Caesarean fall by half, and in newborn babies by more than half.":
"En dos años, las infecciones tras una cesárea se reducen a la mitad, y en los recién nacidos, en más de la mitad.",
"The way spreads to other hospitals in Sri Lanka, and from 2007, with Japan's aid agency, to public hospitals in fifteen African countries.":
"El método llega a más hospitales de Sri Lanka y, desde 2007, con la cooperación japonesa, a hospitales públicos de quince países africanos.",
"Nobody was told to work harder: the people who did the work improved it, a small step at a time.":
"A nadie se le pidió esforzarse más: quienes hacían el trabajo lo mejoraron, un paso pequeño cada vez.",
"Data work has its weekly chores too, and when they're done by hand, mistakes slip through and hours go.":
"El trabajo con datos también tiene sus tareas semanales, y cuando se hacen a mano, se cuelan errores y se van las horas.",
"The person who does the work can improve it the same way: one small change at a time, each one checked.":
"Quien hace el trabajo puede mejorarlo igual: un cambio pequeño cada vez, cada uno verificado.",
"Since Thursday 1 July 2027, Ivy Reyes has owned Teaching space use: the team's data on how the university's rooms are used.":
"Desde el jueves 1 de julio de 2027, Ivy Reyes es dueña de Uso de los espacios docentes: los datos del equipo sobre el uso de las aulas.",
"Its promise to its readers: refreshed every Monday by seven in the morning, with the week before's bookings and head counts.":
"Su promesa a sus lectores: se actualiza cada lunes antes de las siete de la mañana, con las reservas y los conteos de la semana anterior.",
"At six, a job loads the week's data, and publishes the page.":
"A las seis, un proceso carga los datos de la semana y publica la página.",
"Then, from half past eight, Ivy spends two hours checking it by hand, and fixing what she finds.":
"Luego, desde las ocho y media, Ivy pasa dos horas revisándola a mano y arreglando lo que encuentra.",
"Until she's done, anyone who opens the page may read a number that's wrong. And her Monday morning is gone.":
"Hasta que termina, quien abra la página puede leer un número equivocado. Y se le va la mañana del lunes.",
"On Tuesday 20 July, at her mid-year conversation, Helena asks what she wants next.":
"El martes 20 de julio, en su conversación de mitad de año, Helena le pregunta qué quiere ahora.",
"Ivy has two answers: to make her Monday refresh better, and to teach what she learns.":
"Ivy tiene dos respuestas: mejorar su actualización de los lunes, y enseñar lo que aprende.",
"Then Helena asks what's in the way. My Monday mornings, says Ivy: two hours of checks, every week.":
"Luego Helena pregunta qué obstáculos hay. Mis mañanas de los lunes, dice Ivy: dos horas de revisiones, cada semana.",
"So Helena gives it Ivy's Thursday learning time: two hours a week, already hers, now for this.":
"Así que Helena le da para eso su tiempo de aprendizaje del jueves: dos horas semanales, ya suyas, ahora para esto.",
"That's kaizen's first idea: improvement is everyone's job, on their own work, in small steps.":
"Es la primera idea del kaizen: mejorar es tarea de todos, cada uno en su propio trabajo, a pasos pequeños.",
"Each small step runs through one cycle: plan a change, do it, check it, then act: keep it, or drop it.":
"Cada paso pequeño sigue un ciclo: planea un cambio, hazlo, verifícalo, y luego actúa: consérvalo o descártalo.",
"Walter Shewhart drew the cycle as a circle in 1939.":
"Walter Shewhart dibujó el ciclo como un círculo en 1939.",
"W. Edwards Deming taught it in Japan in 1950, where managers made it plan, do, check, act.":
"W. Edwards Deming lo enseñó en Japón en 1950, donde los directivos lo convirtieron en planear, hacer, verificar, actuar.",
"In 1986, Masaaki Imai's book took the Japanese word for this kind of improvement around the world: kaizen, change for the better.":
"En 1986, el libro de Masaaki Imai llevó por el mundo la palabra japonesa para esta forma de mejorar: kaizen, cambio para mejor.",
"Ivy starts by measuring. On Monday 26 July, she times each step of her refresh: six steps, a hundred and twenty minutes.":
"Ivy empieza por medir. El lunes 26 de julio, cronometra cada paso de su actualización: seis pasos, ciento veinte minutos.",
"Like the staff at Castle Street, she starts with her own corner of the work, and asks of each step: who needs this?":
"Como el personal de Castle Street, empieza por su propio rincón del trabajo, y de cada paso pregunta: ¿quién lo necesita?",
"Every Monday, she checks by hand fourteen rooms that once had two names.":
"Cada lunes, revisa a mano catorce aulas que alguna vez tuvieron dos nombres.",
"But since April, a test in Jun's models has checked the same fourteen.":
"Pero desde abril, una prueba en los modelos de Jun revisa esas mismas catorce.",
"So one Monday she skips her check, and reads the test instead. It covers all fourteen. She keeps the change.":
"Así que un lunes se salta su revisión y lee la prueba en su lugar. Cubre las catorce. Conserva el cambio.",
"Then the copy she makes for Facilities: since July, Facilities reads the product's page. She asks, and drops the copy.":
"Luego, la copia que hace para Instalaciones: desde julio, Instalaciones lee la página del producto. Pregunta, y deja de hacerla.",
"Two steps nobody needed are gone: ninety minutes.":
"Se fueron dos pasos que nadie necesitaba: noventa minutos.",
"Next, she writes the four steps left as one checklist: each step, in order, and what good looks like.":
"Después, escribe los cuatro pasos que quedan en una lista de verificación: cada paso, en orden, y cómo se ve si está bien.",
"The same steps every Monday show her what changes, and let anyone do it.":
"Los mismos pasos cada lunes le muestran qué cambia, y permiten que cualquiera lo haga.",
"To test the checklist, Jun follows it one Monday, and gets the same result in the same time.":
"Para probar la lista, Jun la sigue un lunes, y obtiene el mismo resultado en el mismo tiempo.",
"Only then does she automate: automate a muddle, and you get a faster muddle.":
"Solo entonces automatiza: si automatizas un desorden, obtienes un desorden más rápido.",
"In September, in her Thursday learning time, she turns one step a week into a check inside the job.":
"En septiembre, en su tiempo de aprendizaje de los jueves, convierte un paso por semana en un control dentro del proceso.",
"Sam reviews each change before it goes in. And each new check runs beside her own for a Monday, before her hand check goes.":
"Sam revisa cada cambio antes de que entre. Y cada control nuevo corre un lunes junto a su revisión a mano, antes de retirarla.",
"Now the job checks the data before it publishes. If a check fails, the page keeps last week's numbers, and Ivy is told.":
"Ahora el proceso revisa los datos antes de publicar. Si un control falla, la página mantiene las cifras anteriores y se avisa a Ivy.",
"By October, her Monday refresh takes ten minutes, checked: she reads what the checks found, and writes a note to readers.":
"Para octubre, su actualización del lunes toma diez minutos, verificada: lee lo que hallaron los controles y escribe una nota a los lectores.",
"And nobody opens the page to a number that's wrong.":
"Y nadie abre la página para encontrarse un número equivocado.",
"Helena made none of these changes herself. Her part was three things.":
"Helena no hizo ninguno de estos cambios ella misma. Su parte fueron tres cosas.",
"She asked what was in the way, each Tuesday. When Sam's week was full, she made room in it for the reviews.":
"Cada martes, preguntó qué obstáculos había. Cuando la semana de Sam estaba llena, le hizo lugar para las revisiones.",
"She gave the time: Thursday afternoons, for this, and no meeting allowed to take them.":
"Dio el tiempo: las tardes de los jueves, para esto, sin que ninguna reunión pudiera quitarlas.",
"And she showed the small wins: at the review on Thursday 7 October, she put Ivy's chart in front of the people who use the product.":
"Y mostró los pequeños logros: en la revisión del jueves 7 de octubre, puso el gráfico de Ivy frente a quienes usan el producto.",
"She named who did the work: Ivy, Jun and Sam.":
"Nombró a quienes hicieron el trabajo: Ivy, Jun y Sam.",
"No target, no programme, no speech about change: questions, time, and a chart.":
"Sin metas, sin programa, sin discursos sobre el cambio: preguntas, tiempo y un gráfico.",
"From Friday 3 September, the team's Friday half-hour makes small changes a habit for everyone: one measure, one change a week.":
"Desde el 3 de septiembre, la media hora de los viernes hace de los cambios pequeños un hábito de todos: una medida, un cambio por semana.",
"The data management films tell that story; the data quality films tell one of their own.":
"Las películas de Gestión de datos cuentan esa historia; las de Calidad de datos, una propia.",
"At Castle Street, nobody waited for a big reform. The staff changed their own wards, a step at a time, and infections fell by half.":
"En Castle Street, nadie esperó una gran reforma. El personal cambió sus propias salas, paso a paso, y las infecciones bajaron a la mitad.",
"Ivy did the same with her Monday: two hours became ten minutes, checked.":
"Ivy hizo lo mismo con su lunes: dos horas se volvieron diez minutos, con todo verificado.",
"On Monday, pick one chore of your own, and time each step.":
"El lunes, elige una tarea tuya y cronometra cada paso.",
"Drop what nobody needs, and write the rest down, the same each time.":
"Deja lo que nadie necesita, y escribe el resto, igual cada vez.",
"Automate one step at a time, and check each one before you trust it.":
"Automatiza un paso a la vez, y verifica cada uno antes de confiar en él.",
"And if you lead, ask what's in the way, give the time, and show the small wins.":
"Y si lideras, pregunta qué obstáculos hay, da el tiempo y muestra los pequeños logros.",
"Change one small thing, check it, keep what works.":
"Cambia una cosa pequeña, verifícala, conserva lo que funciona."
});
