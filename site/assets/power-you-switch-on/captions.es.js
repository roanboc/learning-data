/* Power you switch on: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words, as the series says them: encender and apagar for switching a power on and off, and el encendido for a switch-on; la cuenta de administrador for the admin
   account and la cuenta diaria for the everyday account; el gran poder; el especialista de datos; el equipo de plataforma, its custodio in data governance;
   el catálogo, el almacenamiento, la configuración de administración, restaurar una tabla, la puerta trasera; entrar for signing in, la llave de acceso for a passkey;
   la oficina de registro for the registrar's office, and el expediente for a student's record, so la bitácora is the admin account's own record; la carga de las dos
   for the two o'clock load; la bóveda, el disco for the dial, los cerrojos for the bolts, and la cerradura de tiempo for the time lock. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"The United States, in the 1870s.":
"Estados Unidos, en la década de 1870.",
"A bank keeps its money in a vault, a strong room behind an iron door.":
"Un banco guarda su dinero en una bóveda, un cuarto blindado tras una puerta de hierro.",
"The door's lock opens to a row of numbers, turned on a dial.":
"La cerradura se abre con una serie de números, marcados en un disco.",
"Only a few of the bank's men know them.":
"Solo unos pocos hombres del banco los conocen.",
"But robbers have found a way round the iron.":
"Pero los ladrones encontraron cómo rodear el hierro.",
"At night, they go to the home of a man who knows the numbers.":
"De noche, van a la casa de un hombre que conoce los números.",
"They hold his family, take him to the bank, and make him open the vault.":
"Retienen a su familia, lo llevan al banco y lo obligan a abrir la bóveda.",
"No lock can stop that: the right numbers, from the right man, open the door.":
"Ninguna cerradura detiene eso: los números correctos, del hombre correcto, abren la puerta.",
"So every banker who knows them, and his family, is in danger.":
"Así que cada banquero que los conoce, y su familia, está en peligro.",
"The vault has to stay shut, even to the man who knows the numbers.":
"La bóveda tiene que seguir cerrada, incluso para el hombre que sabe los números.",
"In Rochester, New York, a lock maker, James Sargent, builds clocks into a vault's lock.":
"En Rochester, Nueva York, un cerrajero, James Sargent, pone relojes dentro de la cerradura de una bóveda.",
"Each evening, the bank sets the hour it may open.":
"Cada tarde, el banco fija la hora en que podrá abrirse.",
"Until that hour, no one can open it, even with the right numbers.":
"Hasta esa hora, nadie puede abrirla, ni con los números correctos.",
"In May 1874, the first is fitted to a bank's vault, in Morrison, Illinois.":
"En mayo de 1874, se instala la primera en la bóveda de un banco, en Morrison, Illinois.",
"One Friday night in May 1875, in Great Barrington, Massachusetts, eight robbers hold the Deland family at home,":
"Una noche de viernes de mayo de 1875, en Great Barrington, Massachusetts, ocho ladrones retienen a la familia Deland en su casa,",
"and take Fred Deland, who knows the numbers, to his bank.":
"y llevan a Fred Deland, que conoce los números, a su banco.",
"He turns the dial, but the bolts that hold the door won't move:":
"Él gira el disco, pero los cerrojos que sujetan la puerta no se mueven:",
"the new time lock, put on three days before, holds them.":
"la nueva cerradura de tiempo, instalada tres días antes, los detiene.",
"The robbers take a few bonds from a desk, and flee; the vault stays shut.":
"Los ladrones toman unos bonos de un escritorio y huyen; la bóveda sigue cerrada.",
"Now, taking a banker from his home at night opens nothing.":
"Ahora, sacar a un banquero de su casa de noche no abre nada.",
"Sargent's lock sells in the thousands, and banks soon expect one.":
"La cerradura de Sargent se vende por miles, y pronto los bancos esperan tener una.",
"The university's platform has the same problem.":
"La plataforma de la universidad tiene el mismo problema.",
"Sam's and Jun's everyday accounts hold its greatest power, every hour of every day.":
"Las cuentas diarias de Sam y de Jun tienen su mayor poder, a toda hora, todos los días.",
"Whoever takes one of those accounts takes all of it.":
"Quien se apodera de una de esas cuentas se lleva todo.",
"It needs what the bank had: great power, shut until it's needed.":
"Necesita lo que tenía el banco: un gran poder, cerrado hasta que haga falta.",
"Most work on the platform goes through the catalog.":
"Casi todo el trabajo en la plataforma pasa por el catálogo.",
"It checks every request, and shows each person what their role allows, masked where it must be.":
"Revisa cada solicitud, y muestra a cada persona lo que su rol permite, enmascarado donde debe estarlo.",
"Some work can't go through it.":
"Algunos trabajos no pueden pasar por él.",
"The storage: the files under every table.":
"El almacenamiento: los archivos bajo cada tabla.",
"There, no mask and no filter applies: every name and every date of birth, in the clear.":
"Ahí no aplica ninguna máscara ni ningún filtro: cada nombre y cada fecha de nacimiento, a la vista.",
"Walls, doors and keys shut that back door.":
"Muros, puertas y llaves cierran esa puerta trasera.",
"The admin settings: what the whole platform allows, such as who may sign in, and how.":
"La configuración de administración: lo que permite toda la plataforma, como quién puede entrar, y cómo.",
"And restoring a table: putting it back as it was, over everyone's work since.":
"Y restaurar una tabla: dejarla como estaba, sobre el trabajo de todos desde entonces.",
"That's great power over data.":
"Eso es un gran poder sobre los datos.",
"In data governance, the platform team are its keepers: they keep the platform running, and don't decide what the data means.":
"En el gobierno de datos, el equipo de plataforma es su custodio: mantiene la plataforma en marcha, y no decide qué significan los datos.",
"Until now, that power sat in Sam's and Jun's everyday accounts:":
"Hasta ahora, ese poder estaba en las cuentas diarias de Sam y de Jun:",
"the same accounts that open their email, and every link in it.":
"las mismas cuentas que abren su correo, y cada enlace que trae.",
"Some had gone to others too, each for one task, and never come back.":
"Una parte también había ido a otros, cada vez para una tarea, y nunca había vuelto.",
"So each data specialist gets a second account, of their own: an admin account.":
"Así que cada especialista de datos recibe una segunda cuenta, propia: una cuenta de administrador.",
"Jun's is his alone.":
"La de Jun es solo suya.",
"It's never shared, and never used for email or the web.":
"Nunca se comparte, y nunca se usa para el correo ni la web.",
"It signs in only with a passkey, and only for a task.":
"Entra solo con una llave de acceso, y solo para una tarea.",
"His everyday account keeps his daily work: writing code, testing it, watching the jobs run.":
"Su cuenta diaria conserva su trabajo de cada día: escribir código, probarlo, vigilar los procesos.",
"And the admin account?":
"¿Y la cuenta de administrador?",
"It has no power either, until it's switched on.":
"Tampoco tiene poder, hasta que se enciende.",
"That makes two locks.":
"Eso hace dos cerraduras.",
"A stolen everyday sign-in doesn't reach the admin account.":
"Un acceso diario robado no llega a la cuenta de administrador.",
"And whoever steals the admin account finds its power off, and can't switch it on alone.":
"Y quien roba la cuenta de administrador encuentra su poder apagado, y no puede encenderlo solo.",
"A second account isn't always practical: it can cost a second licence.":
"Una segunda cuenta no siempre es práctica: puede costar una segunda licencia.",
"In that case, the power stays in the everyday account, but switched off, until a task needs it.":
"En ese caso, el poder se queda en la cuenta diaria, pero apagado, hasta que una tarea lo pida.",
"That's one lock, not two: still far safer than power that's always on.":
"Es una cerradura, no dos: aun así, mucho más seguro que un poder siempre encendido.",
"To switch it on, Jun says what for.":
"Para encenderlo, Jun dice para qué.",
"Which power: only the one the task needs, to read the storage, change the settings, or restore a table.":
"Qué poder: solo el que la tarea necesita, para leer el almacenamiento, cambiar la configuración o restaurar una tabla.",
"A reason, in words someone else can check.":
"Un motivo, en palabras que otra persona pueda revisar.",
"And a time: what the task needs, four hours at most.":
"Y un tiempo: lo que la tarea necesita, cuatro horas como máximo.",
"Another specialist approves: Sam approves Jun's, Jun approves Sam's, and no one approves their own.":
"Otro especialista aprueba: Sam aprueba el de Jun, Jun el de Sam, y nadie aprueba el suyo.",
"The moment it's on, the platform team gets an alert.":
"En cuanto se enciende, el equipo de plataforma recibe una alerta.",
"Everything the admin account does is recorded, under its own name.":
"Todo lo que hace la cuenta de administrador queda registrado, con su propio nombre.",
"When the time is up, the power switches off by itself; or Jun switches it off as soon as he's done.":
"Cuando se acaba el tiempo, el poder se apaga solo; o Jun lo apaga en cuanto termina.",
"A time lock opened at its hour, for whoever had the numbers.":
"Una cerradura de tiempo se abría a su hora, para quien tuviera los números.",
"This power opens only for a task, and only when someone else says yes.":
"Este poder se abre solo para una tarea, y solo cuando otra persona dice que sí.",
"Like the first bankers with a time lock, Sam and Jun find it slow at first: it keeps them out too.":
"Como los primeros banqueros con cerradura de tiempo, Sam y Jun lo ven lento al principio: también los deja fuera.",
"It costs a minute, and a yes.":
"Cuesta un minuto, y un sí.",
"One morning, the two o'clock load has stopped.":
"Una mañana, la carga de las dos se detuvo.",
"It met a row it couldn't read, in last night's file from the registrar's office.":
"Encontró una fila que no pudo leer, en el archivo de anoche de la oficina de registro.",
"To find it, Jun must open that file, in the storage.":
"Para hallarla, Jun debe abrir ese archivo, en el almacenamiento.",
"His everyday account can't: the back door is shut.":
"Su cuenta diaria no puede: la puerta trasera está cerrada.",
"So he switches on his admin account's power to read the storage, for one hour.":
"Así que enciende el poder de su cuenta de administrador para leer el almacenamiento, por una hora.",
"His reason: open last night's file.":
"Su motivo: abrir el archivo de anoche.",
"Sam reads it, and approves.":
"Sam lo lee, y aprueba.",
"The alert reaches the platform team, and matches the morning's task.":
"La alerta llega al equipo de plataforma, y coincide con la tarea de la mañana.",
"Jun opens the file, and goes straight to the row, number 9,317.":
"Jun abre el archivo, y va directo a la fila, la número 9,317.",
"A date of birth that doesn't exist: the thirty-first of February.":
"Una fecha de nacimiento que no existe: el treinta y uno de febrero.",
"He tells the registrar's office which record to fix, by its student number, and switches off:":
"Le dice a la oficina de registro qué expediente corregir, por su número de estudiante, y apaga:",
"fourteen minutes of his hour.":
"catorce minutos de su hora.",
"The record keeps it all: who switched on, why, who said yes, what was read, and when it ended.":
"La bitácora lo guarda todo: quién encendió, por qué, quién dijo que sí, qué se leyó, y cuándo terminó.",
"That night, the load runs clean.":
"Esa noche, la carga corre sin errores.",
"And Jun asks what every switch-on is worth asking: could the next one be avoided?":
"Y Jun se pregunta lo que vale preguntar en cada encendido: ¿se podría evitar el próximo?",
"Now the load sets a row it can't read aside, in a table the catalog guards, for the registrar's office to see.":
"Ahora la carga aparta la fila que no puede leer, en una tabla que el catálogo protege, para que la vea la oficina de registro.",
"Who gets an admin account?":
"¿Quién recibe una cuenta de administrador?",
"Only the data specialists who keep the platform running: here, Sam and Jun.":
"Solo los especialistas de datos que mantienen la plataforma en marcha: aquí, Sam y Jun.",
"Never business users, like Mei Tanaka in the registrar's office.":
"Nunca los usuarios de negocio, como Mei Tanaka, de la oficina de registro.",
"Never analysts, like Clara Jensen in Planning.":
"Nunca los analistas, como Clara Jensen, de Planeación.",
"Their work goes through the catalog, which shows each of them what their role allows.":
"Su trabajo pasa por el catálogo, que muestra a cada una lo que su rol permite.",
"If they need more, they ask the data's owner for access, not for power.":
"Si necesitan más, piden acceso al dueño de los datos, no poder.",
"And never an agent.":
"Y nunca un agente.",
"An agent can propose a task that needs power; a person decides, and does it with their own admin account.":
"Un agente puede proponer una tarea que necesita poder; una persona decide, y la hace con su propia cuenta de administrador.",
"AI agents in data work shows how agents get their rights.":
"Agentes de IA en el trabajo con datos muestra cómo reciben sus permisos.",
"One exception: two emergency accounts, locked away for the day nothing else works.":
"Una excepción: dos cuentas de emergencia, guardadas bajo llave para el día en que nada más funcione.",
"Who did what shows how they're watched.":
"Quién hizo qué muestra cómo se vigilan.",
"In Great Barrington, in 1875, the right numbers, from the right man, weren't enough:":
"En Great Barrington, en 1875, los números correctos, del hombre correcto, no bastaron:",
"the vault opened only at its hour.":
"la bóveda solo se abrió a su hora.",
"On the platform, the right account isn't enough either.":
"En la plataforma, la cuenta correcta tampoco basta.",
"Its power is off, until it's switched on for a task, and someone else says yes.":
"Su poder está apagado, hasta que se enciende para una tarea, y otra persona dice que sí.",
"Whoever takes Jun's everyday account gets his everyday work, and nothing more.":
"Quien se apodera de la cuenta diaria de Jun obtiene su trabajo de cada día, y nada más.",
"Great power is a separate account, switched on for a task.":
"El gran poder es una cuenta aparte, que se enciende para una tarea."
});
