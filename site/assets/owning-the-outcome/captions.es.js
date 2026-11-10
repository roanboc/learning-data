/* Owning the outcome: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md has them: el equipo, el equipo de datos, la gestora de datos, hacerse cargo and ser dueña de (ownership: answering for
   an outcome), and the series' own: Uso de los espacios docentes (the product), Instalaciones (Facilities), la oficina de registro, el horario, un aula,
   los conteos, el flujo, la actualización (the refresh), una prueba (a check), el modelo, un pull request. In Kenya: las tierras altas del centro, los
   arroyos, la leña, los manantiales, las plántulas y sus viveros, el Movimiento Cinturón Verde, el Consejo Nacional de Mujeres de Kenia, el Premio Nobel
   de la Paz. The references: la malla de datos (Zhamak Dehghani) and la dueña del producto de datos; una matriz RACI, whose A stays "accountable", as on
   screen, said as quien rinde cuentas; la cultura justa (Sidney Dekker). The films named keep their Spanish titles: Un producto con dueño, and Mide el
   trabajo, no a las personas. Tú, as the film speaks to the viewer (conoce, vigila, dilo, arregla, hazte cargo). Dates as Spanish says them (el jueves
   1 de julio, el martes 17 de agosto, las ocho y diez). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Kenya, in the 1970s.":
"Kenia, en los setenta.",
"In the hills of the central highlands, rural women tell Wangari Maathai, a biologist, what's going wrong.":
"En las colinas de las tierras altas del centro, mujeres rurales le cuentan a Wangari Maathai, bióloga, qué está fallando.",
"Their streams are drying up. Their food is less sure. Each year, they walk further for firewood.":
"Sus arroyos se están secando. Su comida es menos segura. Cada año caminan más lejos por leña.",
"The forests had been cleared, for farms, for tea and coffee to sell, and for plantations of timber.":
"Los bosques se habían talado para granjas, para té y café de venta, y para plantaciones de madera.",
"Each choice made sense to the people who made it.":
"Cada decisión tenía sentido para quien la tomó.",
"But without trees, the soil washed off the hills, and the springs ran dry.":
"Pero sin árboles, la lluvia se llevó la tierra de las colinas, y los manantiales se secaron.",
"The women fetched the water, gathered the firewood and grew the food. So the harm fell first on them, and on their children.":
"Las mujeres acarreaban el agua, juntaban la leña y cultivaban la comida. Así que el daño cayó primero sobre ellas y sus hijos.",
"Something had to change.":
"Algo tenía que cambiar.",
"In 1977, Maathai started the Green Belt Movement, with the National Council of Women of Kenya.":
"En 1977, Maathai fundó el Movimiento Cinturón Verde, con el Consejo Nacional de Mujeres de Kenia.",
"Groups of women grew seedlings in their own nurseries, from the seeds of local trees, and planted them out.":
"Grupos de mujeres criaron plántulas en sus propios viveros, con semillas de árboles locales, y las plantaron.",
"They were paid a small sum for each tree still alive months later, not for each seedling put in the ground.":
"Se les pagaba una pequeña suma por cada árbol aún vivo meses después, no por cada plántula sembrada.",
"So they answered for living trees, not for the planting.":
"Así respondían por árboles vivos, no por la siembra.",
"Since then, more than fifty million trees have been planted in Kenya.":
"Desde entonces, se han plantado en Kenia más de cincuenta millones de árboles.",
"They give fuel, food and shelter, and thousands of women earned an income from them.":
"Dan combustible, comida y refugio, y miles de mujeres obtuvieron un ingreso de ellos.",
"In 2004, Wangari Maathai became the first African woman to win the Nobel Peace Prize.":
"En 2004, Wangari Maathai fue la primera mujer africana en ganar el Premio Nobel de la Paz.",
"Data work has its seedlings too: a job that ran, a report that was sent.":
"Los datos también tienen sus plántulas: un proceso que corrió, un reporte enviado.",
"Owning the outcome means answering for what they're for.":
"Hacerse cargo del resultado es responder por para qué sirven.",
"At the university, a year from now, Ivy Reyes becomes the owner of her first data product, on Thursday 1 July.":
"En la universidad, dentro de un año, Ivy Reyes se vuelve dueña de su primer producto de datos, el jueves 1 de julio.",
"Teaching space use: for every teaching room and every hour, what was booked, and how many people came. Counts, never people.":
"Uso de los espacios docentes: para cada aula y cada hora, qué se reservó y cuántas personas llegaron. Conteos, nunca personas.",
"Zhamak Dehghani's data mesh calls her the data product owner: she answers for what the product does for its readers.":
"La malla de datos de Zhamak Dehghani la llama dueña del producto de datos: responde por lo que el producto hace por sus lectores.",
"A product with an owner shows how a product gets one. This film is about the owning.":
"Un producto con dueño muestra cómo un producto consigue uno. Esta película trata de hacerse cargo.",
"Its promise: refreshed every Monday by seven, with the week before.":
"Su promesa: actualizado cada lunes antes de las siete, con la semana anterior.",
"Ivy knows its readers by name: Graham Ellis at Facilities, and Mei Tanaka at the registrar's office, with their teams.":
"Ivy conoce a sus lectores por su nombre: Graham Ellis en Instalaciones y Mei Tanaka en la oficina de registro, con sus equipos.",
"And she knows what it's for: next year's timetable will move about one peak class in six, and release rooms nobody uses.":
"Y sabe para qué sirve: el horario del próximo año moverá cerca de una de cada seis clases de hora pico, y liberará aulas sin uso.",
"Which ones, they'll choose from her counts.":
"Cuáles, lo elegirán con sus conteos.",
"So what Ivy owns isn't Monday's job. It's that the timetable change is judged on true counts.":
"Lo que Ivy tiene a su cargo no es el proceso del lunes. Es que el cambio de horario se juzgue con conteos verdaderos.",
"Many people do part of the work. Facilities keeps the sensors, Sam the platform, and Jun reviews her changes.":
"Muchas personas hacen parte del trabajo. Instalaciones mantiene los sensores, Sam la plataforma, y Jun revisa sus cambios.",
"One person answers for the outcome. In a RACI chart, that's the A, for accountable, and there's only one.":
"Una sola persona responde por el resultado. En una matriz RACI es la A, de accountable, quien rinde cuentas, y solo hay una.",
"Helena gives her the authority to match.":
"Helena le da la autoridad que va con eso.",
"Ivy can hold a refresh, change the model with a review, and tell the readers, without asking first.":
"Ivy puede detener una actualización, cambiar el modelo con una revisión y avisar a los lectores, sin pedir permiso.",
"On Tuesday 17 August, Facilities upgrades the sensors in forty rooms.":
"El martes 17 de agosto, Instalaciones mejora los sensores de cuarenta aulas.",
"The new ones send a count every quarter of an hour, not once an hour. More detail: a real improvement.":
"Los nuevos envían un conteo cada cuarto de hora, no una vez por hora. Más detalle: una mejora real.",
"Nobody expects it to change the data, so nobody tells the data team.":
"Nadie espera que cambie los datos, así que nadie le avisa al equipo de datos.",
"On Monday 23 August, the refresh runs at seven, as promised. Every check passes.":
"El lunes 23 de agosto, la actualización corre a las siete, como se prometió. Todas las pruebas pasan.",
"At the Green Belt, a seedling in the ground earned nothing until it lived.":
"En el Cinturón Verde, una plántula sembrada no ganaba nada hasta que vivía.",
"So Ivy reads the numbers, not only the tick.":
"Por eso Ivy lee los números, no solo el visto bueno.",
"In forty rooms, from Tuesday the seventeenth, the counts have dropped to about a quarter.":
"En cuarenta aulas, desde el martes 17, los conteos bajaron a cerca de una cuarta parte.",
"In those rooms, booked hours with nobody in them jump from one in five to more than half.":
"En esas aulas, las horas reservadas sin nadie dentro saltan de una de cada cinco a más de la mitad.",
"If nobody noticed, the timetable team would release rooms that classes really use.":
"Si nadie lo notara, el equipo de horarios liberaría aulas que las clases sí usan.",
"Ivy doesn't wait to be sure, or to be asked.":
"Ivy no espera a estar segura, ni a que le pregunten.",
"At ten past eight, she writes to the readers: the counts for forty rooms look wrong; don't use them yet; the right ones by tomorrow.":
"A las ocho y diez, escribe a los lectores: los conteos de cuarenta aulas se ven mal; no los usen aún; los correctos, mañana.",
"Saying it first, before the fix, is part of owning it.":
"Decirlo primero, antes de arreglarlo, es parte de hacerse cargo.",
"With Sam, she opens the feed for one room.":
"Con Sam, abre el flujo de un aula.",
"Since Tuesday, four counts arrive each hour. The model was built for one.":
"Desde el martes llegan cuatro conteos por hora. El modelo se hizo para uno.",
"A step meant to drop the odd repeat kept the first count of each hour, and dropped the other three.":
"Un paso pensado para quitar alguna repetición se quedó con el primer conteo de cada hora y descartó los otros tres.",
"The first comes as one class leaves and the next arrives, so the rooms looked nearly empty.":
"El primero llega cuando una clase sale y la siguiente entra, así que las aulas parecían casi vacías.",
"The fix is hers: keep the hour's highest count, as the old sensors sent.":
"El arreglo es suyo: guardar el conteo más alto de la hora, como los sensores viejos.",
"Jun reviews her pull request, as someone other than its author reviews every change.":
"Jun revisa su pull request, porque alguien que no es su autor revisa cada cambio.",
"The days since Tuesday are run again, and on Tuesday morning the readers have the right counts, with a short note.":
"Los días desde el martes se vuelven a correr, y el martes en la mañana los lectores tienen los conteos correctos, con una nota breve.",
"What happened, what it touched, what's fixed, and what changes.":
"Qué pasó, qué afectó, qué se arregló y qué cambia.",
"Some of it isn't hers to fix. The sensors are Facilities'.":
"Una parte no le toca arreglarla. Los sensores son de Instalaciones.",
"So she raises it with Graham. From now on, Facilities tells the data team before a sensor changes.":
"Así que lo plantea con Graham. Desde ahora, Instalaciones avisa al equipo de datos antes de cambiar un sensor.",
"And she adds a check of her own: each room's counts against its own last four weeks.":
"Y agrega una prueba propia: los conteos de cada aula contra sus últimas cuatro semanas.",
"A drop like this one now holds the refresh, and tells her, before anyone reads it.":
"Una caída como esta ahora detiene la actualización y le avisa, antes de que alguien la lea.",
"Nobody here did anything wrong.":
"Aquí nadie hizo nada mal.",
"Facilities made the sensors better. Sam's platform loaded every count. The step was right for the data it was built for.":
"Instalaciones mejoró los sensores. La plataforma de Sam cargó cada conteo. El paso era correcto para los datos para los que se hizo.",
"Each was right about what they saw. What failed was the way the parts fit together.":
"Cada uno tenía razón sobre lo que veía. Lo que falló fue cómo encajaban las partes.",
"Sidney Dekker calls it a just culture: when something goes wrong, ask what happened and what must change, not who to blame.":
"Sidney Dekker lo llama cultura justa: cuando algo sale mal, pregunta qué pasó y qué debe cambiar, no a quién culpar.",
"Helena's first question isn't who. It's what happened, and what Ivy needs.":
"La primera pregunta de Helena no es quién. Es qué pasó y qué necesita Ivy.",
"That's why Ivy could say it first: where nobody is blamed, saying it early is safe.":
"Por eso Ivy pudo decirlo primero: donde no se culpa a nadie, decirlo pronto es seguro.",
"Being accountable means giving an account: what happened, and how the next time goes better.":
"Rendir cuentas es dar cuenta: qué pasó, y cómo la próxima vez sale mejor.",
"The women of the Green Belt answered for trees still standing months later, not for the planting.":
"Las mujeres del Cinturón Verde respondían por árboles aún en pie meses después, no por la siembra.",
"Ivy answers for true counts, not for a job that ran. In June 2029, the timetable change will be judged on them.":
"Ivy responde por conteos verdaderos, no por un proceso que corrió. En junio de 2029, el cambio de horario se juzgará con ellos.",
"On Monday, know who uses your work, and for which decision.":
"El lunes, conoce quién usa tu trabajo, y para qué decisión.",
"Watch what it's for, not only whether it ran.":
"Vigila para qué sirve, no solo si corrió.",
"When something's wrong, say so first, even before the fix.":
"Cuando algo esté mal, dilo primero, aun antes del arreglo.",
"Fix what's yours, raise what isn't, and mend how the parts fit together, never blaming a person.":
"Arregla lo tuyo, plantea lo que no lo es, y repara cómo encajan las partes, sin culpar nunca a una persona.",
"Measure the work, not the people, the next film, asks how a team can tell its work is getting better.":
"Mide el trabajo, no a las personas, la siguiente película, pregunta cómo sabe un equipo que su trabajo mejora.",
"Own what it's for, not only what you did.":
"Hazte cargo de para qué sirve, no solo de lo que hiciste."
});
