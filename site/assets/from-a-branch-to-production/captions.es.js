/* From a branch to production: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words: el proceso for the job and los datos del registro for the registrar's records, as the series says; entrar for signing in; la llave for the deploy's key;
   desarrollo, pruebas y producción for the three rooms (the names on screen stay English); un pull request and los checks, as the site's captions and GitHub's Spanish pages say; un conjunto de reglas for
   a ruleset, and los propietarios del código for code owners, as GitHub's Spanish docs do; el log for a log, so it never meets el registro; el paquete for a bundle;
   el flujo de trabajo for a workflow, and el trabajo for one of its jobs; fusionar for merge; la Asamblea Constitucional and el Tribunal Constitucional, the bodies' names.
   Film titles as each film's page gives them in Spanish: check Muros, puertas y llaves; Cargas sin secretos; Poder que se enciende; Red, almacenamiento y llaves;
   and Cada cambio, revisado against those films' title_es when building (Quién decide is the governance film's). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"South Africa, 1993.":
"Sudáfrica, 1993.",
"After decades of apartheid, the parties negotiating its end have to agree how a new constitution will be written.":
"Tras décadas de apartheid, los partidos que negocian su fin deben acordar cómo se escribirá una nueva constitución.",
"In April 1994, all South Africans will vote together for the first time.":
"En abril de 1994, todos los sudafricanos votarán juntos por primera vez.",
"The winners will hold most of the seats in the parliament that writes it.":
"Los ganadores tendrán la mayoría de los escaños del parlamento que la escriba.",
"The smaller parties fear what a winning majority could write: rights a later vote could take away, courts that answer to a party.":
"Los partidos pequeños temen lo que escribiría una mayoría: derechos que otra votación podría quitar, tribunales al servicio de un partido.",
"And the party expected to win won't accept a constitution written by negotiators nobody elected.":
"Y el partido que se espera que gane no aceptará una constitución escrita por negociadores que nadie eligió.",
"Something has to change in how a constitution is made.":
"Algo tiene que cambiar en cómo se hace una constitución.",
"So they agree the principles first: 34 of them, from rights for everyone to judges no party controls.":
"Así que acuerdan primero los principios: 34, desde derechos para todos hasta jueces que ningún partido controla.",
"They write them into a temporary constitution, in force from 27 April 1994, and nobody may change them.":
"Los escriben en una constitución provisional, vigente desde el 27 de abril de 1994, y nadie puede cambiarlos.",
"The new parliament, sitting as the Constitutional Assembly, will write the final text.":
"El nuevo parlamento, reunido como Asamblea Constitucional, escribirá el texto final.",
"It will count only once the new Constitutional Court, which didn't write it, certifies that every part keeps every principle.":
"Solo valdrá cuando el nuevo Tribunal Constitucional, que no lo escribió, certifique que cada parte cumple cada principio.",
"On 8 May 1996, the Assembly adopts its text, with 86 percent of its members.":
"El 8 de mayo de 1996, la Asamblea aprueba su texto, con el 86 por ciento de sus miembros.",
"On 6 September, the Court's judges, all agreeing, decline to certify it.":
"El 6 de septiembre, los jueces del Tribunal, todos de acuerdo, se niegan a certificarlo.",
"In nine respects, it falls short.":
"En nueve puntos, no cumple.",
"Among them, the rights in it could be changed too easily.":
"Entre ellos, sus derechos podían cambiarse con demasiada facilidad.",
"And the officials who check on the government and its money aren't protected enough from it.":
"Y quienes vigilan al gobierno y su dinero no están lo bastante protegidos frente a él.",
"In five weeks, the Assembly fixes all nine, and on 11 October it adopts the amended text.":
"En cinco semanas, la Asamblea corrige los nueve, y el 11 de octubre aprueba el texto enmendado.",
"On 4 December, the Court certifies it.":
"El 4 de diciembre, el Tribunal lo certifica.",
"President Mandela signs it on 10 December 1996, and it comes into force on 4 February 1997.":
"El presidente Mandela la firma el 10 de diciembre de 1996, y entra en vigor el 4 de febrero de 1997.",
"Nearly thirty years on, it's still the country's constitution.":
"Casi treinta años después, sigue siendo la constitución del país.",
"Every side could trust it, because no side could put it into force alone.":
"Todas las partes podían confiar en ella, porque ninguna podía ponerla en vigor sola.",
"Elected people wrote it; judges who hadn't written it checked it against promises fixed before; and it counted only once both were done.":
"La escribieron personas elegidas; jueces que no la escribieron la revisaron frente a promesas fijadas antes; y solo valió con ambos.",
"A change to production can work the same way.":
"Un cambio en producción puede funcionar igual.",
"At the university, a job loads the registrar's records every night at two.":
"En la universidad, un proceso carga los datos del registro cada noche a las dos.",
"In Walls, doors and keys, its one workspace became three: development, test and production.":
"En Muros, puertas y llaves, su único espacio de trabajo se volvió tres: desarrollo, pruebas y producción.",
"In Workloads without secrets, its deploy got a key with no secret in it: the job's own identity, registrar-loader.":
"En Cargas sin secretos, su despliegue recibió una llave sin ningún secreto: la identidad propia del proceso, registrar-loader.",
"But nothing guards the way in.":
"Pero nada vigila la entrada.",
"Whatever reaches main, the branch in GitHub that production is built from, goes straight to production.":
"Todo lo que llega a main, la rama de GitHub de la que sale producción, pasa directo a producción.",
"Anyone on the team can push to it, at any hour, and nobody else has to read the change.":
"Cualquiera del equipo puede subir cambios, a cualquier hora, y nadie más tiene que leerlos.",
"One unread change could stop every student's record from loading, or send it where it shouldn't go.":
"Un cambio sin leer podría impedir que se cargue el registro de cada estudiante, o mandarlo adonde no debe.",
"And anyone who stole one of the team's sign-ins could do the same.":
"Y quien robara el acceso de alguien del equipo podría hacer lo mismo.",
"Production needs one way in, with a gate.":
"Producción necesita una sola entrada, con un control.",
"So before the next change is written, Sam sets the rules, as South Africa fixed its principles first.":
"Así que, antes del próximo cambio, Sam fija las reglas, como Sudáfrica fijó primero sus principios.",
"A ruleset on main: every change comes as a pull request, and nobody pushes to main, rewrites it or deletes it.":
"Un conjunto de reglas en main: cada cambio llega como un pull request, y nadie sube a main, ni la reescribe ni la borra.",
"A code owner approves each change, and the last push is approved by someone who didn't push it.":
"Un propietario del código aprueba cada cambio, y el último push lo aprueba alguien que no lo hizo.",
"The checks must pass.":
"Los checks deben pasar.",
"And nobody may bypass it, not even an owner of the organisation.":
"Y nadie puede saltárselo, ni siquiera un propietario de la organización.",
"Who owns what was decided in Who decides.":
"Quién es dueño de qué se decidió en Quién decide.",
"The code owners file names the platform team for the job.":
"El archivo CODEOWNERS nombra al equipo de plataforma para el proceso.",
"The platform team and data governance own the workflows, and the file itself.":
"Plataforma y gobernanza de datos son dueños de los flujos de trabajo y del propio archivo.",
"GitHub reads that file from main, not from the pull request, so no change picks its own reviewers.":
"GitHub lee ese archivo de main, no del pull request, así que ningún cambio elige quién lo revisa.",
"And the ruleset isn't in the code at all: no pull request can loosen it.":
"Y el conjunto de reglas no está en el código: ningún pull request puede aflojarlo.",
"Jun has the next change.":
"Jun tiene el próximo cambio.",
"One morning in Power you switch on, the load stopped on a row it couldn't read.":
"Una mañana, en Poder que se enciende, la carga se detuvo en una fila que no podía leer.",
"Jun switched on his admin account to open last night's file.":
"Jun encendió su cuenta de administrador para abrir el archivo de esa noche.",
"Now the job should set such a row aside, and load the rest.":
"Ahora el proceso debe apartar una fila así, y cargar el resto.",
"Jun writes it on a branch, and tries it in development, in a copy under his own name, on made-up records.":
"Jun lo escribe en una rama, y lo prueba en desarrollo, en una copia a su nombre, con datos inventados.",
"Then he opens a pull request.":
"Luego abre un pull request.",
"The checks run: the job's tests, and code scanning.":
"Corren los checks: las pruebas del proceso y el análisis de código.",
"Sam reviews it.":
"Sam lo revisa.",
"One line writes each set-aside row to the job's log, names and all.":
"Una línea escribe cada fila apartada en el log del proceso, con nombres y todo.",
"A log keeps whatever it's given, outside the table's masks, for 30 days.":
"Un log guarda lo que recibe, fuera de las máscaras de la tabla, durante 30 días.",
"Sam asks for that line to go.":
"Sam pide quitar esa línea.",
"Jun takes it out and pushes again, and Sam approves this last push.":
"Jun la quita y vuelve a subir, y Sam aprueba este último push.",
"Sent back, fixed, checked again.":
"Devuelto, corregido, revisado otra vez.",
"Jun merges it.":
"Jun lo fusiona.",
"Merging doesn't put it in production.":
"Fusionarlo no lo pone en producción.",
"The deploy runs on GitHub's machines placed inside the university's network.":
"El despliegue corre en máquinas de GitHub ubicadas dentro de la red de la universidad.",
"So it reaches the workspaces by the private path from Network, storage and keys.":
"Así llega a los espacios de trabajo por el camino privado de Red, almacenamiento y llaves.",
"It goes to test first.":
"Primero va a pruebas.",
"It signs in as registrar-loader-test, deploys the bundle, the job and its settings as files, and runs the job once on test's records.":
"Entra como registrar-loader-test, despliega el paquete, el proceso y su configuración en archivos, y lo corre una vez en pruebas.",
"It passes.":
"Pasa.",
"Then production waits for a release approver: Noor Rahman.":
"Luego producción espera a quien aprueba las entregas: Noor Rahman.",
"Whoever started the run can't approve it, and only main may deploy here.":
"Quien inició la ejecución no puede aprobarla, y solo main puede desplegar aquí.",
"Noor sees what changed, who reviewed it, and the test run, and approves.":
"Noor ve qué cambió, quién lo revisó y la ejecución en pruebas, y aprueba.",
"Now the workflow asks Databricks to sign it in as registrar-loader.":
"Ahora el flujo de trabajo pide a Databricks entrar como registrar-loader.",
"Databricks lets in only this repository's job in the environment production: the one that waited for Noor.":
"Databricks deja entrar solo al trabajo de este repositorio en el entorno production: el que esperó a Noor.",
"The bundle deploys from main, in production mode, and the job runs as registrar-loader.":
"El paquete se despliega desde main, en modo producción, y el proceso corre como registrar-loader.",
"There, people may look at it, never change it.":
"Allí, las personas pueden mirarlo, nunca cambiarlo.",
"Two people said yes, and a machine did the rest.":
"Dos personas dijeron sí, y una máquina hizo el resto.",
"One way in is easy to miss: code nobody at the university wrote.":
"Una entrada se pasa por alto: código que nadie en la universidad escribió.",
"The deploy runs two actions, small programs from other people: one fetches the code, one installs Databricks' tool.":
"El despliegue usa dos acciones, pequeños programas de otros: una trae el código, otra instala la herramienta de Databricks.",
"They run right beside the production key.":
"Corren justo al lado de la llave de producción.",
"An action named by a tag or a branch runs whatever the name points to that day, and the name can be moved.":
"Una acción nombrada por una etiqueta o una rama corre lo que ese nombre señale ese día, y el nombre se puede mover.",
"Code scanning reads the workflows too, and flags the one that isn't GitHub's own.":
"El análisis de código lee también los flujos, y marca la que no es de GitHub.",
"Sam pins both, GitHub's own too, to the commit he checked, its version written beside it.":
"Sam fija las dos, también la de GitHub, al commit que revisó, con su versión escrita al lado.",
"A commit can't change.":
"Un commit no puede cambiar.",
"Dependabot proposes each new version, and any fix for a known flaw in the job's libraries, as a pull request, reviewed like any other.":
"Dependabot propone cada versión nueva, y cada arreglo de un fallo conocido en las bibliotecas del proceso, como un pull request revisado.",
"And the workflow's own token can only read: only the two deploying jobs may ask to sign in.":
"Y el token del flujo de trabajo solo puede leer: solo los dos trabajos que despliegan pueden pedir entrar.",
"At two on Wednesday morning, the job runs the reviewed code.":
"A las dos de la mañana del miércoles, el proceso corre el código revisado.",
"A week later, a row is unreadable again.":
"Una semana después, otra fila no se puede leer.",
"The job sets it aside, and every other record is in by a quarter past two.":
"El proceso la aparta, y todos los demás registros están cargados a las dos y cuarto.",
"The registrar's office fixes the row by half past nine, and nobody switched on any power to see it.":
"La oficina del registro corrige la fila antes de las nueve y media, y nadie encendió ningún poder para verla.",
"As in South Africa, the rules came first, someone who hadn't written the change checked it, and it counted only once both were done.":
"Como en Sudáfrica, las reglas vinieron primero, alguien que no escribió el cambio lo revisó, y solo valió cuando ambos terminaron.",
"In an emergency, the same path, faster, or an admin account switched on, approved and recorded.":
"En una emergencia, el mismo camino, más rápido, o una cuenta de administrador encendida, aprobada y registrada.",
"An agent's change takes the same path, as Every change through review shows.":
"El cambio de un agente sigue el mismo camino, como muestra Cada cambio, revisado.",
"Production changes only through a reviewed path.":
"Producción cambia solo por un camino revisado."
});
