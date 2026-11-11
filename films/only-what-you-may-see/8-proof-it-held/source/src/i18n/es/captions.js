/* Proof it held: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: el acuerdo, el contrato del acuerdo, un permiso (a grant), el grupo del estudio, el directorio, la revisión de acceso,
   la oficina de registro, la Facultad de Salud, una clase (a class of personal data: directo, seudónimo, indirecto, especial), una política, el linaje, el registro de
   auditoría, el registro de acuerdos de Yusuf; the vaccine vial monitor as el monitor de vial de vacuna (as the WHO's Spanish pages call it); the films by their Spanish
   titles (Primero, un acuerdo; Agentes de IA en el trabajo con datos; Guardado por una razón). Numbers keep the picture's comma (2,614), as the series' other
   Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"From the 1970s, health workers carried polio vaccine to clinics and villages all over the world.":
"Desde los años setenta, trabajadores de salud llevaban vacuna contra la polio a clínicas y pueblos de todo el mundo.",
"Polio can leave a child paralysed for life.":
"La polio puede dejar a un niño paralizado de por vida.",
"The vaccine is two drops by mouth, from a small bottle: a vial.":
"La vacuna son dos gotas por la boca, de un frasco pequeño: un vial.",
"It had to stay cold the whole way, from the factory to the child.":
"Tenía que viajar fría todo el camino, de la fábrica al niño.",
"But heat spoils it, and leaves no sign.":
"Pero el calor la daña, y no deja señal.",
"A vial left too long in the sun looks just like a good one.":
"Un vial que pasó demasiado tiempo al sol se ve igual que uno bueno.",
"So health workers threw away vials they couldn't vouch for.":
"Así que los trabajadores tiraban los viales de los que no podían responder.",
"Or a child was given vaccine that no longer worked, and the family thought the child was safe.":
"O un niño recibía una vacuna que ya no servía, y la familia creía que estaba protegido.",
"Health workers needed to see, on the vial itself, whether the cold had held.":
"Los trabajadores de salud necesitaban ver, en el propio vial, si el frío se había mantenido.",
"In 1979, the World Health Organization asked for a way to show it.":
"En 1979, la Organización Mundial de la Salud pidió una forma de mostrarlo.",
"PATH, a health non-profit, worked for years with a company on one: the vaccine vial monitor.":
"PATH, una organización de salud sin fines de lucro, trabajó años con una empresa en una: el monitor de vial de vacuna.",
"It's a square inside a circle, printed on each vial's label.":
"Es un cuadrado dentro de un círculo, impreso en la etiqueta de cada vial.",
"Heat darkens the square, a little at a time, and it never turns light again.":
"El calor oscurece el cuadrado, poco a poco, y nunca vuelve a aclararse.",
"Lighter than the circle, the vaccine can be used.":
"Más claro que el círculo, la vacuna se puede usar.",
"As dark as the circle, or darker, the vial is thrown away.":
"Tan oscuro como el círculo, o más, el vial se tira.",
"In 1996, the first monitors went onto polio vaccine, for a few cents a vial.":
"En 1996, los primeros monitores llegaron a la vacuna contra la polio, por unos centavos por vial.",
"Now, at the moment of use, a health worker could see which vials were still good.":
"Ahora, en el momento de usarla, un trabajador de salud podía ver qué viales seguían buenos.",
"UNICEF and the World Health Organization estimate it saves over $14 million a year, in good vaccine no longer thrown away.":
"UNICEF y la Organización Mundial de la Salud estiman que ahorra más de 14 millones de dólares al año, en vacuna buena que ya no se tira.",
"And a child got vaccine that still protects them.":
"Y un niño recibía una vacuna que aún lo protege.",
"Protecting data has the same problem.":
"Proteger los datos tiene el mismo problema.",
"A protection that failed looks just like one that held, and a name seen by the wrong person leaves no mark.":
"Una protección que falló se ve igual que una que se cumplió, y un nombre visto por quien no debía no deja marca.",
"This film adds the monitor to Anil's study: proof, whenever someone asks, that each protection held.":
"Esta película le pone el monitor al estudio de Anil: la prueba, cuando alguien la pida, de que cada protección se cumplió.",
"So the university can show any learner who asks who could see their data, and who did.":
"Así la universidad puede mostrarle a cualquier estudiante quién podía ver sus datos, y quién los vio.",
"Three months ago, in An agreement first, Mei Tanaka signed an agreement for Anil Kurian's study of 2,614 learners.":
"Hace tres meses, en Primero, un acuerdo, Mei Tanaka firmó un acuerdo para el estudio de Anil Kurian sobre 2,614 estudiantes.",
"Since then, every protection was built, from classes to copies.":
"Desde entonces se construyó cada protección, de las clases a las copias.",
"Today, Tuesday 12 January 2027, is the study's first review.":
"Hoy, martes 12 de enero de 2027, es la primera revisión del estudio.",
"Yusuf Demir, who keeps the agreements, asks one question of each line: can we prove it held?":
"Yusuf Demir, que guarda los acuerdos, le hace una pregunta a cada línea: ¿podemos demostrar que se cumplió?",
"Who: only the study's group may read it.":
"Quién: solo el grupo del estudio puede leerlo.",
"Never: nothing that names a learner, nothing about their health.":
"Nunca: nada que nombre a un estudiante, nada sobre su salud.",
"Where: only in the study's own space.":
"Dónde: solo en el espacio propio del estudio.",
"Ends: 30 June 2027.":
"Termina: 30 de junio de 2027.",
"Four promises, four proofs, each read from a record, not from anyone's memory.":
"Cuatro promesas, cuatro pruebas, cada una leída de un registro, no de la memoria de nadie.",
"First: who could read the study's tables?":
"Primero: ¿quién podía leer las tablas del estudio?",
"On the platform, the grants answer it: each made from the contract, to the study's group.":
"En la plataforma lo responden los permisos: cada uno hecho del contrato, para el grupo del estudio.",
"No grant names a person, and none was made by hand.":
"Ningún permiso nombra a una persona, y ninguno se hizo a mano.",
"So the question is who's in the group, and that lives in the directory, Microsoft Entra ID.":
"Así que la pregunta es quién está en el grupo, y eso vive en el directorio, Microsoft Entra ID.",
"Every three months, its access review asks Mei, who signed the agreement, whether each member still needs it.":
"Cada tres meses, su revisión de acceso le pregunta a Mei, que firmó el acuerdo, si cada miembro aún lo necesita.",
"A review left unanswered for a week takes the access away.":
"Una revisión sin respuesta durante una semana quita el acceso.",
"Two people are in the group: Anil, and Elena Lindgren, a research assistant who joined in November.":
"Hay dos personas en el grupo: Anil, y Elena Lindgren, asistente de investigación que entró en noviembre.",
"In December, Elena moved to another project.":
"En diciembre, Elena pasó a otro proyecto.",
"She still works at the university, so her account works, and nothing took her out.":
"Sigue trabajando en la universidad, así que su cuenta funciona, y nada la sacó.",
"Mei keeps Anil, and removes Elena; when the review closes, the directory takes her out by itself.":
"Mei deja a Anil y quita a Elena; cuando la revisión se cierra, el directorio la saca por sí solo.",
"Now Anil tells Yusuf the day anyone leaves the study: the review is the net, not the plan.":
"Ahora Anil le avisa a Yusuf el día que alguien deja el estudio: la revisión es la red, no el plan.",
"An agent working for the study would be on the list too, answered for by its owner, as AI agents in data work shows.":
"Un agente del estudio también estaría en la lista, y su dueño respondería por él, como muestra Agentes de IA en el trabajo con datos.",
"Second: does every personal column have a class, and every class a policy?":
"Segundo: ¿cada columna personal tiene una clase, y cada clase una política?",
"Like a monitor on every vial, every column needs its class.":
"Como un monitor en cada vial, cada columna necesita su clase.",
"Each morning at seven, a query on the platform looks for two gaps.":
"Cada mañana a las siete, una consulta en la plataforma busca dos huecos.",
"A column the platform's classification finds personal, with no class from its owner.":
"Una columna que la clasificación de la plataforma halla personal, sin clase de su dueña.",
"And a class that has to be hidden, with no policy to hide it.":
"Y una clase que hay que ocultar, sin una política que la oculte.",
"If it finds one, an alert goes to Yusuf and Sam.":
"Si encuentra uno, le llega una alerta a Yusuf y a Sam.",
"On Friday 8 January, it found one.":
"El viernes 8 de enero, encontró uno.",
"The exam support team had started keeping each learner's mobile number, to text them their exam arrangements.":
"El equipo de apoyo en exámenes había empezado a guardar el celular de cada estudiante, para enviarle por mensaje sus adaptaciones.",
"The night load brought it into the support table as a new column.":
"La carga de la noche lo trajo a la tabla de apoyos como una columna nueva.",
"The data project stops a new column with no class, but it doesn't build this table.":
"El proyecto de datos frena una columna nueva sin clase, pero esta tabla no la construye él.",
"A day later, the platform's classification found it a phone number.":
"Un día después, la clasificación de la plataforma vio que era un número de teléfono.",
"At half past nine, Mei classed it direct: it names a person by itself.":
"A las nueve y media, Mei le dio la clase directo: nombra a una persona por sí sola.",
"The policy for direct masks it from then on, with no new rule written.":
"La política para directo la enmascara desde entonces, sin escribir ninguna regla nueva.",
"But for thirty-one hours, the column had no class.":
"Pero durante treinta y una horas, la columna no tuvo clase.",
"Where did it go, and who read it?":
"¿A dónde fue, y quién la leyó?",
"Lineage is the platform's record of what each query read and what it made, column by column.":
"El linaje es el registro de la plataforma de lo que cada consulta leyó y lo que hizo, columna por columna.",
"The mobile column went nowhere: no query made anything from it.":
"La columna del celular no fue a ninguna parte: ninguna consulta hizo nada con ella.",
"And the study's protected columns: the student number reaches it only as the learner code, the date of birth only as the year.":
"Y las columnas protegidas del estudio: el número de estudiante le llega solo como el código, la fecha de nacimiento solo como el año.",
"Names, emails and exam support never reach it.":
"Nombres, correos y apoyo en exámenes nunca le llegan.",
"Then, who read? The audit log keeps who read each table, and when.":
"Luego, ¿quién leyó? El registro de auditoría guarda quién leyó cada tabla, y cuándo.",
"In those thirty-one hours, only the night load read the support table.":
"En esas treinta y una horas, solo la carga de la noche leyó la tabla de apoyos.",
"And over the three months, the study's tables were read by Anil, and by Elena until 11 December. No one else.":
"Y en los tres meses, las tablas del estudio las leyeron Anil, y Elena hasta el 11 de diciembre. Nadie más.",
"After an earthquake in Yogyakarta, in Indonesia, the power was out for days.":
"Tras un terremoto en Yogyakarta, en Indonesia, no hubo luz durante días.",
"The monitors showed most of the vaccine was still good: 50,000 doses that would have been thrown away.":
"Los monitores mostraron que casi toda la vacuna seguía buena: 50,000 dosis que se habrían tirado.",
"Proof finds the harm, and it shows where there was none.":
"La prueba encuentra el daño, y muestra dónde no lo hubo.",
"The gap was real; the records show no one saw a number they shouldn't.":
"El hueco era real; los registros muestran que nadie vio un número que no debía.",
"Last: the agreement ends on 30 June 2027, and access must end with it.":
"Por último: el acuerdo termina el 30 de junio de 2027, y el acceso debe terminar con él.",
"Each member's place in the group was given until that date.":
"El lugar de cada miembro en el grupo se dio hasta esa fecha.",
"On the day, the directory takes them out, and the grants made from the contract end.":
"Ese día, el directorio los saca, y los permisos hechos del contrato terminan.",
"But an ending is a promise too, until it's checked.":
"Pero un final también es una promesa, hasta que se comprueba.",
"On 1 July, Yusuf checks: the group is empty, no grant names the agreement, and the study's space is gone.":
"El 1 de julio, Yusuf comprueba: el grupo está vacío, ningún permiso nombra el acuerdo, y el espacio del estudio ya no está.",
"Only the totals stay.":
"Solo quedan los totales.",
"Every proof is kept with the agreement, in Yusuf's register.":
"Cada prueba se guarda con el acuerdo, en el registro de Yusuf.",
"The monitor on the vial doesn't keep the vaccine cold.":
"El monitor del vial no mantiene fría la vacuna.",
"It shows whether the cold held, at the moment of use.":
"Muestra si el frío se mantuvo, en el momento de usarla.",
"The study's records don't protect its data either.":
"Los registros del estudio tampoco protegen sus datos.",
"They show, whenever someone asks, that the protection held:":
"Muestran, cuando alguien lo pida, que la protección se cumplió:",
"who could read, who did, where each column went, and that it all ended on its date.":
"quién podía leer, quién leyó, a dónde fue cada columna, y que todo terminó en su fecha.",
"Protection you can't prove is protection you hope for.":
"Protección que no puedes demostrar es protección que solo esperas.",
"Next, Kept for a reason: why data is kept, for how long, and how a person is forgotten.":
"Después, Guardado por una razón: por qué se guardan los datos, por cuánto tiempo, y cómo se olvida a una persona."
});
