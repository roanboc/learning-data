/* Fixed where it starts: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series: gobernanza, dueño, la carpeta 15, prueba for a test and control for a check, el equipo de aprendizaje, la billetera, insignias and
   microcredenciales, and staging, as in the analytics engineering films. The scorecard is el tablero de calidad, as the series' page names film 5's. An issue
   someone tracks is una incidencia; the leak that drips is una gotera, and the mop un trapeador. Where a problem starts is su origen, as in the film's title. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Vienna, 1847. The city's general hospital has two maternity clinics.":
"Viena, 1847. El hospital general de la ciudad tiene dos clínicas de maternidad.",
"In the first, where doctors and their students work, about one mother in ten dies of fever.":
"En la primera, donde trabajan los médicos y sus estudiantes, muere de fiebre cerca de una madre de cada diez.",
"In the second, where midwives work, about one in thirty.":
"En la segunda, donde trabajan parteras, cerca de una de cada treinta.",
"Ignaz Semmelweis, a young doctor in the first clinic, looks for what's different.":
"Ignaz Semmelweis, un médico joven de la primera clínica, busca qué es distinto.",
"The doctors and students come to the ward from the autopsy room. The midwives don't.":
"Los médicos y los estudiantes llegan a la sala desde la de autopsias. Las parteras, no.",
"So he has everyone wash their hands in chlorinated lime before they examine a mother.":
"Así que hace que todos se laven las manos con cal clorada antes de examinar a una madre.",
"Within months, deaths in the first clinic fall to the level of the second.":
"En pocos meses, las muertes en la primera clínica bajan al nivel de la segunda.",
"The fever showed in the beds. It started on the doctors' hands, on their way in.":
"La fiebre se veía en las camas. Empezaba en las manos de los médicos, al entrar.",
"Where a problem shows is often not where it starts.":
"Donde un problema se ve no suele ser donde empieza.",
"Today, Yusuf opens binder 15. Its policy says the root causes of data quality issues are addressed.":
"Hoy, Yusuf abre la carpeta 15. Su política dice que se atienden las causas raíz de los problemas de calidad de datos.",
"But on the quality scorecard, one cell is still amber.":
"Pero en el tablero de calidad, una celda sigue en ámbar.",
"Short-course emails, with spaces and capitals.":
"Correos de cursos cortos, con espacios y mayúsculas.",
"The issue goes to their owner, Tom's learning team. The first answer is the old one: it's cleaned in staging.":
"La incidencia va a su dueño, el equipo de aprendizaje de Tom. La primera respuesta es la de siempre: se limpia en staging.",
"Every night for a year, staging has trimmed each email and written it in lower case.":
"Cada noche, desde hace un año, staging recorta cada correo y lo escribe en minúsculas.",
"Without it, one learner could end up with two wallets.":
"Sin eso, un estudiante podría terminar con dos billeteras.",
"And every system that reads these emails cleans them again.":
"Y cada sistema que lee estos correos los vuelve a limpiar.",
"It's a mop under a leak. It works every night, and the leak never stops.":
"Es un trapeador bajo una gotera. Trabaja cada noche, y la gotera nunca para.",
"Yusuf follows one email back to where it's made.":
"Yusuf sigue un correo hacia atrás, hasta donde se crea.",
"From the wallet, through staging, to the short-course sign-up form.":
"De la billetera, pasando por staging, al formulario de inscripción a cursos cortos.",
"The form keeps each email as it's typed, in a plain text box, so phones start it with a capital.":
"El formulario guarda cada correo como se escribe, en un campo de texto simple, así que el teléfono lo empieza con mayúscula.",
"And picking a suggestion can leave a space at the end.":
"Y elegir una sugerencia puede dejar un espacio al final.",
"More than one email in three arrives that way.":
"Más de un correo de cada tres llega así.",
"Nobody typed anything wrong. It shows in staging, but it starts here, at the form.":
"Nadie escribió nada mal. Se ve en staging, pero empieza aquí, en el formulario.",
"This time, the issue has an owner, a cause, a date, and a check that proves it's closed.":
"Esta vez, la incidencia tiene un dueño, una causa, una fecha y un control que demuestra que está cerrada.",
"Tom's team makes the box an email box, so phones stop adding the capital.":
"El equipo de Tom hace del campo un campo de correo, y el teléfono ya no pone la mayúscula.",
"And the form trims each email, writes it in lower case and checks its shape, before it's saved.":
"Y el formulario recorta cada correo, lo escribe en minúsculas y verifica su forma, antes de guardarlo.",
"Nobody has to type more carefully. The form does the work.":
"Nadie tiene que escribir con más cuidado. El formulario hace el trabajo.",
"Tom's team corrects the old emails in their platform. Then the clean-up in staging can go.":
"El equipo de Tom corrige los correos antiguos en su plataforma. Luego, la limpieza en staging se puede quitar.",
"The rule stays, as a test that should never fail: a promise to everyone who reads them.":
"La regla se queda, como una prueba que nunca debería fallar: una promesa a todos los que los leen.",
"If it ever fails, the form has broken, and its owner hears first.":
"Si alguna vez falla, el formulario se rompió, y su dueño se entera primero.",
"The cell turns green: not because the emails were cleaned, but because they were right where they were typed.":
"La celda se pone verde: no porque se limpiaron los correos, sino porque ya estaban bien donde se escribieron.",
"One night, the learning platform sends something no rule names.":
"Una noche, la plataforma de aprendizaje envía algo que ninguna regla nombra.",
"Half the new badges arrive with zero credit. Most are microcredentials that should carry five.":
"La mitad de las insignias nuevas llega con cero créditos. La mayoría son microcredenciales que deberían llevar cinco.",
"Every test passes. The value is there, and it's a number.":
"Todas las pruebas pasan. El valor está ahí, y es un número.",
"But the wallet shows them as plain badges, with no credit.":
"Pero la billetera las muestra como insignias simples, sin créditos.",
"Monitoring knows each table's usual shape: when it arrives, how many rows, how many empty, how the values spread.":
"El monitoreo conoce la forma habitual de cada tabla: cuándo llega, cuántas filas, cuántos vacíos, cómo se reparten los valores.",
"Usually, one badge in twelve has no credit. Last night, one in two.":
"Normalmente, una insignia de cada doce no tiene créditos. Anoche, una de cada dos.",
"It tells the owner the metadata names: the learning team.":
"Avisa al dueño que nombran los metadatos: el equipo de aprendizaje.",
"The cause is last week's update to the learning platform. Tom's team fixes it there, and sends the badges again.":
"La causa: la actualización de la semana pasada en la plataforma de aprendizaje. El equipo de Tom la arregla ahí y reenvía las insignias.",
"Then the surprise becomes a rule: a microcredential carries credit. A test, with an owner.":
"Entonces la sorpresa se vuelve una regla: una microcredencial lleva créditos. Una prueba, con dueño.",
"Prevent what you can, where it starts. Test what you know. Watch for what you don't.":
"Prevén lo que puedas, en su origen. Prueba lo que sabes. Vigila lo que no sabes.",
"And every surprise you confirm becomes a rule.":
"Y cada sorpresa que confirmas se vuelve una regla.",
"Nobody blamed Tom's team. The form did what it was built to do. They got the evidence, and help to change it.":
"Nadie culpó al equipo de Tom. El formulario funcionaba como se diseñó. Recibieron la evidencia, y ayuda para cambiarlo.",
"Back in Vienna, Semmelweis was right. But the washing was slow, and it hurt the skin.":
"De vuelta en Viena, Semmelweis tenía razón. Pero el lavado era lento, y dañaba la piel.",
"Germs weren't known yet, so his only proof was his numbers. He waited years to publish them.":
"Aún no se conocían los gérmenes: su única evidencia eran sus números. Esperó años para publicarlos.",
"And when doctors doubted him, he blamed them, in angry open letters.":
"Y cuando los médicos dudaron de él, los culpó en furiosas cartas abiertas.",
"Washing became the rule only after his death, once germs were known.":
"El lavado se volvió regla solo tras su muerte, cuando ya se conocían los gérmenes.",
"A fix at the start lasts when it's easy to keep, and when people get the evidence, not the blame.":
"Un arreglo en el origen dura cuando es fácil de mantener, y cuando la gente recibe la evidencia, no la culpa.",
"Fix the cause. Then make the fix a check.":
"Arregla la causa. Luego, haz del arreglo un control."
});
