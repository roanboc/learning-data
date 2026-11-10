/* Walls, doors and keys: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words: Ragusa, Mrkan and Cavtat as the film says them; el Consejo Mayor for the Great Council; el rector; el islote for the islet; la peste for the plague;
   la plataforma, el espacio de trabajo for a workspace, el catálogo, el almacenamiento for storage, los archivos for the files; un camino privado for a private path;
   la puerta trasera for the back door; una cuenta de administrador, encendida, as the series says "switched on"; desarrollo, pruebas y producción;
   la llave for the data's key (a key that opens a lock, not a sign-in key); el equipo de seguridad; las copias de seguridad and un respaldo for backups;
   RR. HH. for HR; and the other films' Spanish titles as their pages give them (check at build: ¿Quién es, de verdad?, Poder que se enciende,
   De una rama a producción, Borrado es borrado; Quién decide is on the site). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Ragusa, on the Adriatic coast, in the 1370s.":
"Ragusa, en la costa del Adriático, en la década de 1370.",
"Today it's Dubrovnik, in Croatia.":
"Hoy es Dubrovnik, en Croacia.",
"Then, it's a small republic of merchants, behind high stone walls.":
"Entonces es una pequeña república de mercaderes, tras altas murallas de piedra.",
"It lives by trade, and its ships sail the whole Mediterranean.":
"Vive del comercio, y sus barcos navegan todo el Mediterráneo.",
"Sailors, merchants and goods come in every day, through only a few gates.":
"Marineros, mercaderes y mercancías entran cada día, por unas pocas puertas.",
"But ships can bring more than goods.":
"Pero un barco puede traer más que mercancías.",
"In 1348, they brought the plague: a sickness that spread fast, and killed within days.":
"En 1348 trajeron la peste: una enfermedad que se extendía rápido y mataba en pocos días.",
"It killed thousands in the city, and kept coming back.":
"Mató a miles en la ciudad, y volvió una y otra vez.",
"At the gate, nobody could tell a sick traveller from a well one.":
"En la puerta, nadie podía distinguir a un viajero enfermo de uno sano.",
"Shut the port, and the city loses its living.":
"Si cierra el puerto, la ciudad pierde su sustento.",
"Leave it open, and the sickness walks in, to every family behind the walls.":
"Si lo deja abierto, la enfermedad entra, hasta cada familia tras las murallas.",
"Something has to change.":
"Algo tiene que cambiar.",
"On 27 July 1377, the Great Council, the nobles who made the city's laws, passed a new one.":
"El 27 de julio de 1377, el Consejo Mayor, los nobles que hacían las leyes de la ciudad, aprobó una nueva.",
"Anyone coming from a place with plague must first spend a month apart: on the islet of Mrkan, or in the town of Cavtat, down the coast.":
"Quien venga de un lugar con peste debe pasar antes un mes aparte: en el islote de Mrkan, o en el pueblo de Cavtat, costa abajo.",
"Only then may they enter the city.":
"Solo entonces puede entrar en la ciudad.",
"No one from the city may go to them: whoever does, stays the month too.":
"Nadie de la ciudad puede ir con ellos: quien vaya, se queda también el mes.",
"Later, health officers watch every ship and every gate.":
"Más tarde, oficiales de sanidad vigilan cada barco y cada puerta.",
"The port stays open, and the city keeps its living.":
"El puerto sigue abierto, y la ciudad conserva su sustento.",
"When the sickness comes now, it's held on an island, not let loose in the streets.":
"Cuando llega la enfermedad, ahora queda en una isla, no suelta por las calles.",
"Ragusa is the first city known to have made it a law.":
"Ragusa es la primera ciudad conocida que lo hizo ley.",
"Other ports followed, and the wait grew to forty days: the word quarantine comes from the Italian for forty.":
"Otros puertos la siguieron, y la espera creció a cuarenta días: de ahí viene la palabra cuarentena.",
"The university's data has the same problem: people and jobs must reach it every day, and whoever breaks in shouldn't reach it all.":
"Los datos de la universidad tienen el mismo problema: personas y procesos llegan a ellos cada día, y un intruso no debe llegar a todo.",
"It needs what Ragusa had: a few doors, each with a rule, and a place apart for what isn't trusted yet.":
"Necesitan lo que tenía Ragusa: pocas puertas, cada una con una regla, y un lugar aparte para lo que aún no es de confianza.",
"At the university, the nightly job no longer carries Jun's token.":
"En la universidad, el proceso nocturno ya no lleva el token de Jun.",
"But Sam Okafor, who runs the data platform, asks what an attacker would: if someone did get in, how far could they go?":
"Pero Sam Okafor, que dirige la plataforma de datos, se pregunta lo que un atacante: si alguien entrara, ¿hasta dónde llegaría?",
"Today, the platform's door is on the open internet: anyone, anywhere, can reach it.":
"Hoy, la puerta de la plataforma da a internet abierta: cualquiera, desde donde sea, llega a ella.",
"Inside, one workspace holds people's experiments and the nightly job's real records.":
"Dentro, un solo espacio de trabajo reúne las pruebas de la gente y los datos reales del proceso nocturno.",
"From there, every area's data is in reach: the registrar's records, learning, planning, HR and finance.":
"Desde ahí, los datos de cada área están al alcance: los del registro, aprendizaje, planificación, RR. HH. y finanzas.",
"A way runs straight to the files in storage, past the catalog that checks who may read what.":
"Un camino va directo a los archivos del almacenamiento, sin pasar por el catálogo que revisa quién puede leer qué.",
"Data can be sent anywhere.":
"Los datos pueden ir a donde sea.",
"The backups sit beside the data, where any admin can delete them.":
"Las copias están junto a los datos, donde cualquier administrador puede borrarlas.",
"And the cloud provider keeps the data's key, which the university can't take back.":
"Y el proveedor de la nube guarda la llave de los datos, que la universidad no puede retirar.",
"Nobody chose this: the platform started small, and grew.":
"Nadie lo eligió: la plataforma empezó pequeña, y creció.",
"First, Sam writes down who secures what.":
"Primero, Sam anota quién protege qué.",
"The cloud provider secures its buildings, its machines, and the network between them.":
"El proveedor de la nube protege sus edificios, sus máquinas y la red entre ellas.",
"The platform's makers secure its software, and how it checks every request.":
"Quienes hacen la plataforma protegen su software, y cómo revisa cada petición.",
"The university secures the rest: who gets in, what each may do, its settings, its keys and its copies.":
"La universidad protege el resto: quién entra, qué puede hacer cada uno, su configuración, sus llaves y sus copias.",
"Whatever the contract says, the data is the university's to protect, and the walls are the university's to draw.":
"Diga lo que diga el contrato, proteger los datos le toca a la universidad, y también trazar los muros.",
"They follow the areas on the university's map, each with the owner Who decides wrote down.":
"Siguen las áreas del mapa de la universidad, cada una con el dueño que anotó Quién decide.",
"A wall doesn't make anyone inside it trusted: every request is still checked, as Who is it, really? showed.":
"Un muro no vuelve de confianza a nadie dentro: cada petición se sigue revisando, como mostró ¿Quién es, de verdad?",
"But walls keep the ways in few and the rooms small, so a mistake, or an intruder, stays where it started.":
"Pero los muros dejan pocas entradas y salas pequeñas, y así un error, o un intruso, se queda donde empezó.",
"Then, the doors.":
"Luego, las puertas.",
"The platform's door comes off the open internet: people and jobs reach it only by a private path, from the university's own network.":
"La puerta de la plataforma sale de internet abierta: personas y procesos llegan solo por un camino privado, desde la red de la universidad.",
"The platform reaches the storage by a private path too.":
"La plataforma también llega al almacenamiento por un camino privado.",
"And the way out is watched: data may leave only for places on a short list.":
"Y la salida se vigila: los datos solo pueden ir a lugares de una lista corta.",
"Storage keeps files, and knows nothing of who may see which column: no masks, no rules.":
"El almacenamiento guarda archivos, y no sabe quién puede ver cada columna: ni máscaras, ni reglas.",
"So the catalog becomes the files' only door: it checks every request, and applies every rule on the way.":
"Así, el catálogo pasa a ser la única puerta de los archivos: revisa cada petición, y aplica cada regla al pasar.",
"The back door, straight to the files, stays shut.":
"La puerta trasera, directa a los archivos, queda cerrada.",
"Only an admin account, switched on to read the storage, opens it, as Power you switch on shows.":
"Solo una cuenta de administrador, encendida para leer el almacenamiento, la abre, como muestra Poder que se enciende.",
"Like Ragusa's walls: a few gates, and at each one, a rule.":
"Como las murallas de Ragusa: pocas puertas, y en cada una, una regla.",
"Next, one workspace becomes three: development, test and production.":
"Después, un espacio de trabajo se vuelve tres: desarrollo, pruebas y producción.",
"In development, people try new things; in test, a change is tried as it will run.":
"En desarrollo, la gente prueba cosas nuevas; en pruebas, un cambio se ensaya tal como correrá.",
"Production holds the real records, and runs the nightly load.":
"Producción tiene los datos reales, y corre la carga nocturna.",
"Each reaches only its own data.":
"Cada uno llega solo a sus propios datos.",
"Development and test get made-up or masked data, never a copy of production's.":
"Desarrollo y pruebas reciben datos inventados o enmascarados, nunca una copia de los de producción.",
"So a mistake in development stays there, and an intruder there finds no real records.":
"Así, un error en desarrollo se queda ahí, y un intruso ahí no encuentra datos reales.",
"A change moves one way, along one reviewed path, which From a branch to production builds.":
"Un cambio avanza en un solo sentido, por un único camino revisado, que construye De una rama a producción.",
"Like the islet off Ragusa: what isn't trusted yet waits apart, and comes in only through the gate, after the wait.":
"Como el islote frente a Ragusa: lo que aún no es de confianza espera aparte, y entra solo por la puerta, tras la espera.",
"Now, the locks themselves.":
"Ahora, las cerraduras en sí.",
"The data is kept encrypted, on disk and on the move: unreadable without its key.":
"Los datos se guardan cifrados, en disco y en tránsito: ilegibles sin su llave.",
"So what matters is who holds the key.":
"Así que lo que importa es quién tiene la llave.",
"Until now, the cloud provider did.":
"Hasta ahora, la tenía el proveedor.",
"Now it's the university's own, kept by its security team in a vault of its own.":
"Ahora es de la universidad, y la guarda su equipo de seguridad en una bóveda propia.",
"The platform may use it, but never take it out, and those who run the platform can't delete it.":
"La plataforma puede usarla, pero nunca sacarla, y quienes operan la plataforma no pueden borrarla.",
"The security team can take it back: then nobody can read the data, not even the cloud provider.":
"El equipo de seguridad puede retirarla: entonces nadie puede leer los datos, ni siquiera el proveedor de la nube.",
"Lose that key, and the data is lost with it: so every use is recorded, and a deleted key is kept ninety days, which nobody can cut short.":
"Si se pierde esa llave, se pierden los datos: por eso cada uso se registra, y una llave borrada se guarda noventa días que nadie acorta.",
"In Ragusa, for centuries, the gates were shut each evening, and their keys taken to the rector, the head of the republic, until morning.":
"En Ragusa, durante siglos, las puertas se cerraban cada tarde, y sus llaves iban al rector, el jefe de la república, hasta la mañana.",
"Everyone knew who held them.":
"Todos sabían quién las tenía.",
"Last, the copies.":
"Por último, las copias.",
"An attacker who gets in often deletes the backups first, then locks the data, and asks for money to unlock it.":
"Un atacante que entra suele borrar primero las copias de seguridad, luego bloquea los datos, y pide dinero para liberarlos.",
"So every night, a copy of production's data goes to a place apart, with admins of its own.":
"Por eso, cada noche, una copia de los datos de producción va a un lugar aparte, con sus propios administradores.",
"Each copy is locked for thirty days: nobody can change or delete it before then, not even an admin.":
"Cada copia queda bloqueada treinta días: nadie puede cambiarla ni borrarla antes, ni siquiera un administrador.",
"And once a month, Sam's team restores one, to prove it works: a copy nobody has restored is a hope, not a backup.":
"Y una vez al mes, el equipo de Sam restaura una para probarla: una copia que nadie ha restaurado es una esperanza, no un respaldo.",
"A lock that strong cuts both ways: a copy can't be deleted early, even when it should be, and Deleted means deleted comes back to that.":
"Un bloqueo tan fuerte corta en ambos sentidos: una copia no puede borrarse antes, aunque deba, y Borrado es borrado vuelve sobre eso.",
"Sam walks the attacker's path once more.":
"Sam recorre otra vez el camino del atacante.",
"From the open internet, there's no door to find.":
"Desde internet abierta, no hay puerta que encontrar.",
"With a stolen way in, there's only what that one person may reach, in one workspace, through the catalog's checks.":
"Con un acceso robado, solo queda lo que esa persona puede alcanzar, en un espacio de trabajo, pasando las revisiones del catálogo.",
"No back door to the files, nowhere to send them, no key to take, and no copy to delete.":
"Ni puerta trasera a los archivos, ni adónde enviarlos, ni llave que llevarse, ni copia que borrar.",
"In 1377, Ragusa stayed open to the world, through a few gates, each with its rule.":
"En 1377, Ragusa siguió abierta al mundo, por pocas puertas, cada una con su regla.",
"The university's data stays open to the people and jobs that need it.":
"Los datos de la universidad siguen abiertos a las personas y procesos que los usan.",
"Few doors, each with a lock you can see.":
"Pocas puertas, cada una con su cerradura a la vista."
});
