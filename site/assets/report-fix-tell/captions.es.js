/* Report, fix, tell: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's pages: la lista de graduación, el diploma, el control (a check), el portal, la oficina de registro (the registrar's office), admisiones, el
   sistema de estudiantes, la matrícula (enrolment). New here: el aviso and avisar for a report and reporting, in India and at the university alike, as the English uses
   one word; buscar y contener for search and contain; la tilde for the accent on the e, and la eñe for the n that lost its tilde; el registro de incidencias for the
   issue log; los clientes y creadores de los datos, after Redman. The films the narration names keep their Spanish titles: Reglas que se ejecutan, and La fábrica
   oculta for The hidden factory until that film names itself in Spanish. Names on screen stay as they are: Andres Penaloza, Andrés Peñaloza, S-16874, Rs 50,
   Rs 1,000, dbt, Databricks. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"India, 1974: the last years of a campaign to end smallpox.":
"India, 1974: los últimos años de una campaña para acabar con la viruela.",
"Smallpox passed from person to person: it killed many who caught it, and scarred most who lived.":
"La viruela pasaba de persona a persona: mataba a muchos contagiados, y marcaba a casi todos los que vivían.",
"That year it came back hard: more than 116,000 cases by the end of May.":
"Ese año volvió con fuerza: más de 116,000 casos a fines de mayo.",
"It hid in villages and city streets, far from any clinic.":
"Se escondía en aldeas y en ciudades, lejos de cualquier clínica.",
"A case nobody reported passed it to the next family, and the next: a chain.":
"Un caso sin aviso la pasaba a la familia vecina, y a la siguiente: una cadena.",
"Vaccinating everyone couldn't reach everyone, and it found the ones missed.":
"Vacunar a todos no llegaba a todos, y la viruela encontraba a los que quedaban fuera.",
"Something had to change: every chain had to be found, and stopped where it was.":
"Algo tenía que cambiar: había que encontrar cada cadena y detenerla donde estaba.",
"So India's health workers, with the World Health Organization, changed what they did: search, and contain.":
"Así que el personal de salud de la India, con la Organización Mundial de la Salud, cambió lo que hacía: buscar y contener.",
"More than a hundred thousand of them went house to house.":
"Más de cien mil de ellos fueron casa por casa.",
"Anyone who reported a case was promised a reward, and every report was answered at once.":
"A quien avisara de un caso se le prometía una recompensa, y cada aviso se respondía de inmediato.",
"Guards stayed at the sick person's door, day and night, and everyone around was vaccinated: the chain stopped there.":
"Unos guardias se quedaban en la puerta del enfermo, día y noche, y se vacunaba a todos alrededor: la cadena se detenía ahí.",
"And whoever reported it was paid, so people kept reporting.":
"Y a quien avisaba se le pagaba, así que la gente seguía avisando.",
"In May 1975, a year on, India found its last case.":
"En mayo de 1975, un año después, la India halló su último caso.",
"In 1977, India was declared free of smallpox, and in 1980, the world.":
"En 1977, la India fue declarada libre de viruela, y en 1980, el mundo.",
"At the university, a name printed wrong on a degree certificate is a case too.":
"En la universidad, un nombre mal impreso en un diploma también es un caso.",
"The certificate is printed again, and a graduate crosses the stage holding an empty folder.":
"El diploma se imprime de nuevo, y un graduado cruza el escenario con una carpeta vacía.",
"A report is worth only what happens next: answer it, fix it where it started, and tell them, and the next is found before it's printed.":
"Un aviso vale solo por lo que pasa después: respóndelo, arréglalo donde empezó y cuéntaselo, y el próximo aparece antes de imprimirse.",
"Monday 12 October 2026: the portal opens for December's graduates, to check their name as it will be printed.":
"Lunes 12 de octubre de 2026: el portal abre para que los graduados de diciembre revisen su nombre tal como se imprimirá.",
"That evening, Andrés Peñaloza reads his: Andres Penaloza.":
"Esa noche, Andrés Peñaloza lee el suyo: Andres Penaloza.",
"No accent on the e. No tilde on the n.":
"Sin tilde en la e. Sin la eñe: solo una n.",
"He presses \"This isn't my name\", and types it as he writes it.":
"Pulsa «Este no es mi nombre» y lo teclea como él lo escribe.",
"No check had ever held it: it's short, and every letter is allowed.":
"Ningún control lo había retenido: es corto, y todas sus letras son válidas.",
"His record dates from 2018, made by an old online form that took only A to Z, in capitals.":
"Su registro es de 2018, de un antiguo formulario en línea que solo aceptaba de la A a la Z, en mayúsculas.",
"When he came back for his Master's, the capitals were typed again by hand, as ordinary letters, and it looked right.":
"Cuando volvió para su maestría, las mayúsculas se escribieron de nuevo a mano, como letras normales, y parecía correcto.",
"People find errors no check can see.":
"Las personas hallan errores que ningún control ve.",
"So make it easy to say so, where they see the data.":
"Así que hazles fácil decirlo, donde ven los datos.",
"His report is a row of data: who, the name shown, the name given, and when.":
"Su aviso es una fila de datos: quién, el nombre que se mostró, el nombre que dio y cuándo.",
"And the portal says what happens next: \"The registrar's office will answer by Wednesday 14 October.\"":
"Y el portal dice qué pasa después: «La oficina de registro responderá a más tardar el miércoles 14 de octubre».",
"The report goes straight to the people who own names: the registrar's office, Mei's team.":
"El aviso va directo a quienes son dueños de los nombres: la oficina de registro, el equipo de Mei.",
"Their promise: an answer within two working days.":
"Su promesa: una respuesta en dos días hábiles.",
"Every report is kept in a model of its own, with its owner, when it's due, and when it was answered and told.":
"Cada aviso se guarda en un modelo propio, con su dueño, cuándo vence, y cuándo se respondió y se comunicó.",
"Answering in time is about what people do, not whether the data is right.":
"Responder a tiempo depende de lo que hacen las personas, no de si los datos están bien.",
"So it's tracked and reviewed every week, never failed as a check.":
"Así que se sigue y se revisa cada semana, y nunca falla como un control.",
"Each morning, an alert on Databricks tells the registrar's office which reports are due that day.":
"Cada mañana, una alerta en Databricks le dice a la oficina de registro qué avisos vencen ese día.",
"In India, every report was answered at once: a promise kept is what makes people report again.":
"En la India, cada aviso se respondía de inmediato: una promesa cumplida hace que la gente vuelva a avisar.",
"Wednesday 14 October: Mei's team checks his name against the passport seen at his enrolment.":
"Miércoles 14 de octubre: el equipo de Mei revisa su nombre contra el pasaporte que se vio en su matrícula.",
"It matches, and they correct it in the student system itself: not in the list, and not in a copy.":
"Coincide, y lo corrigen en el propio sistema de estudiantes: no en la lista, ni en una copia.",
"That night, the update carries it to the list, the portal and the printer's file: every copy at once.":
"Esa noche, la actualización lo lleva a la lista, al portal y al archivo de la imprenta: a todas las copias a la vez.",
"Fixed in the list, it would be undone by the next night's update.":
"Arreglado en la lista, la actualización de la noche siguiente lo desharía.",
"Fixed in a spreadsheet, it would be wrong again next year, as The hidden factory showed.":
"Arreglado en una hoja de cálculo, volvería a estar mal el año siguiente, como mostró La fábrica oculta.",
"Like guards at the door, a fix where the error started stops it there.":
"Como los guardias en la puerta, un arreglo donde empezó el error lo detiene ahí.",
"Then the portal tells him: \"Your name will be printed as Andrés Peñaloza. Thank you for telling us.\"":
"Luego el portal le dice: «Tu nombre se imprimirá como Andrés Peñaloza. Gracias por avisarnos».",
"A report that disappears teaches people not to bother.":
"Un aviso que desaparece enseña a la gente a no molestarse.",
"In India, every reporter was paid, so the next one reported too.":
"En la India, a quien avisaba se le pagaba, así que el siguiente también avisaba.",
"In October, 64 graduates reported their name.":
"En octubre, 64 graduados avisaron de su nombre.",
"61 were put right within two working days, and three waited for a document. Every one was told.":
"61 se corrigieron en dos días hábiles, y tres esperaron un documento. A todos se les avisó.",
"And the people who make the data hear what it cost: a graduate who had to find their own name wrong.":
"Y quienes hacen los datos se enteran de lo que costó: un graduado que tuvo que encontrar mal su propio nombre.",
"The admissions team, who made the old forms, now get a note each month.":
"Admisiones, que hizo los formularios antiguos, ahora recibe una nota cada mes.",
"October's note: 38 names from the old online form, and 11 from the paper forms.":
"La nota de octubre: 38 nombres del antiguo formulario en línea, y 11 de los de papel.",
"So from November, admissions asks every student who comes back to check their name against their passport.":
"Así que desde noviembre, admisiones pide a cada estudiante que vuelve que revise su nombre contra su pasaporte.",
"Thomas Redman calls them data's customers and its creators: tell the creators what an error cost, and the next one isn't made.":
"Thomas Redman los llama clientes y creadores de los datos: cuéntales a los creadores lo que costó un error, y el siguiente no se comete.",
"Read together, the reports show where errors are born: of the first 19, 12 came from the old form, like Andrés's.":
"Leídos juntos, los avisos muestran dónde nacen los errores: de los primeros 19, 12 venían del formulario antiguo, como el de Andrés.",
"Each kind of error a person finds becomes a check, so nobody has to find it again.":
"Cada tipo de error que alguien encuentra se vuelve un control, y nadie tiene que volver a encontrarlo.",
"Jun adds one: a name the old form made, still in plain letters, A to Z, not yet confirmed by its graduate.":
"Jun agrega uno: un nombre del formulario antiguo, aún en letras simples, de la A a la Z, sin confirmar por su graduado.",
"It can't see a missing accent. But it can see where a name was born.":
"No puede ver una tilde que falta. Pero sí puede ver dónde nació un nombre.",
"It holds each one for Mei's team, and dbt keeps them in a table her team reads.":
"Retiene cada uno para el equipo de Mei, y dbt los guarda en una tabla que lee su equipo.",
"On its first night, it holds 83.":
"En su primera noche, retiene 83.",
"The registrar's office writes to each: our old form dropped accents, so please look closely at your name.":
"La oficina de registro escribe a cada uno: nuestro formulario antiguo quitaba las tildes, así que mira bien tu nombre.",
"Within a week, seven had given back the accents the old form took.":
"En una semana, siete recuperaron las tildes que el formulario antiguo les quitó.",
"Mei logs it in the issue log, as Rules that run showed.":
"Mei lo anota en el registro de incidencias, como mostró Reglas que se ejecutan.",
"As in India, where everyone around a case was vaccinated, before the chain could spread.":
"Como en la India, donde se vacunaba a todos alrededor de un caso, antes de que la cadena se extendiera.",
"In India, after the last case, the reward rose to a thousand rupees, four months' pay, and every report was answered.":
"En la India, después del último caso, la recompensa subió a mil rupias, cuatro meses de paga, y cada aviso se respondió.",
"None was smallpox: that's how they knew it was gone.":
"Ninguno era viruela: así supieron que se había ido.",
"At the university, every report is answered, fixed where it started, and told, and each kind of error becomes a check.":
"En la universidad, cada aviso se responde, se arregla donde empezó y se comunica, y cada tipo de error se convierte en un control.",
"Andrés's certificate will read Andrés Peñaloza.":
"El diploma de Andrés dirá Andrés Peñaloza.",
"Answer every report, fix it where it started, and tell them.":
"Responde cada aviso, arréglalo donde empezó y cuéntaselo."
});
