/* Who is it, really?: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words: la tarja for the tally (a token split in two whose halves must match; contraseña would read as a password here); el proceso for the job and los datos del
   registro for the registrar's records, as the series says; entrar for signing in; el token, as the series keeps it; el permiso for a right; el rol de carga for the
   loader role, as No secret to lose says; dueño, ingeniero de analítica and responsable de datos for the map's three roles, as the governance films name them;
   confianza cero for zero trust; the Threat Modeling Manifesto's four questions as its Spanish readers ask them; Proteger, NIST's own Spanish name for Protect;
   los Reinos Combatientes for the Warring States; el señor de Xinling for Lord Xinling. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"China, about 2,300 years ago.":
"China, hace unos 2300 años.",
"Seven kingdoms are at war, and each keeps armies on its borders, days from the capital.":
"Siete reinos están en guerra, y cada uno tiene ejércitos en sus fronteras, a días de la capital.",
"The king can't be at every border, so his orders travel with messengers.":
"El rey no puede estar en cada frontera, así que sus órdenes viajan con mensajeros.",
"The most dangerous is an order to raise troops.":
"La más peligrosa es una orden de levantar tropas.",
"If anyone could bring one, a forged letter or a messenger's lie could put an army on the march.":
"Si cualquiera pudiera traer una, una carta falsa o la mentira de un mensajero pondrían un ejército en marcha.",
"Soldiers could die for an order nobody gave, or be turned against the king himself.":
"Los soldados podrían morir por una orden que nadie dio, o volverse contra el propio rey.",
"And the commander at his post sees only the man who brings it.":
"Y el comandante, en su puesto, solo ve al hombre que la trae.",
"The commander needs a way to know an order truly comes from the king.":
"El comandante necesita una forma de saber que una orden de verdad viene del rey.",
"The answer is a tally: a small bronze tiger, cut in two along its back.":
"La respuesta es una tarja: un pequeño tigre de bronce, cortado en dos a lo largo del lomo.",
"The king keeps the right half, and the commander takes the left to his post.":
"El rey se queda con la mitad derecha, y el comandante lleva la izquierda a su puesto.",
"An order to raise troops comes with the king's half, and counts only if the two halves fit together.":
"Una orden de levantar tropas llega con la mitad del rey, y solo vale si las dos mitades encajan.",
"So the commander needn't trust the messenger, only the match.":
"Así, el comandante no tiene que confiar en el mensajero, solo en que encajen.",
"One tiger, now in a museum in Xi'an, carries its rule in forty characters of gold.":
"Un tigre, hoy en un museo de Xi'an, lleva su regla en cuarenta caracteres de oro.",
"For fifty soldiers or more, the halves must match, and only then may they march.":
"Para cincuenta soldados o más, las mitades deben encajar, y solo entonces pueden marchar.",
"Only a beacon fire, an attack at the border, lets him act without it.":
"Solo una hoguera de alarma, un ataque en la frontera, le deja actuar sin ella.",
"The power to send soldiers stays with the king, however far the order travels.":
"El poder de enviar soldados se queda con el rey, por lejos que viaje la orden.",
"A request to a data platform is an order too: read these records, change that table.":
"Una solicitud a una plataforma de datos también es una orden: lee estos registros, cambia esa tabla.",
"It should count only when it proves who sent it, so every request starts with one question: who is it, really?":
"Solo debería valer si prueba quién la envió, así que toda solicitud empieza con una pregunta: ¿quién es, en realidad?",
"Sam Okafor runs the university's data platform.":
"Sam Okafor dirige la plataforma de datos de la universidad.",
"Every night at two, a job loads the registrar's records onto it.":
"Cada noche a las dos, un proceso carga en ella los datos del registro.",
"It signs in with Jun Park's personal token, so to the platform, the job is Jun.":
"Entra con el token personal de Jun Park, así que, para la plataforma, el proceso es Jun.",
"And the platform has one workspace, open to the internet.":
"Y la plataforma tiene un solo espacio de trabajo, abierto a internet.",
"For years, security meant a wall round the network, and whoever was inside it was trusted.":
"Durante años, la seguridad fue un muro alrededor de la red, y se confiaba en quien estuviera dentro.",
"But a stolen password works as well inside the wall as out.":
"Pero una contraseña robada funciona igual dentro del muro que fuera.",
"So the platform trusts no request for where it comes from.":
"Así que la plataforma no confía en una solicitud por su origen.",
"Each one says who it is, and proves it, and is checked against what that identity may do, and what's usual for it.":
"Cada una dice quién es, lo prueba, y se compara con lo que esa identidad puede hacer y con lo que es habitual para ella.",
"It gets the least it needs, and the next request is checked again.":
"Recibe lo mínimo que necesita, y la siguiente solicitud se vuelve a comprobar.",
"This is zero trust: not trusting no one, but trusting nothing without proof.":
"Esto es confianza cero: no es no confiar en nadie, sino no confiar en nada sin prueba.",
"On the platform, there are three kinds of who.":
"En la plataforma hay tres tipos de quién.",
"A person: Mei Tanaka in the registrar's office, or Jun, who builds the data project.":
"Una persona: Mei Tanaka, en la oficina del registro, o Jun, que construye el proyecto de datos.",
"A workload: a job or a service that runs with no one at the keyboard, like the nightly load.":
"Una carga de trabajo: un proceso o un servicio que corre sin nadie al teclado, como la carga nocturna.",
"And an agent: an AI assistant doing a task someone gave it.":
"Y un agente: un asistente de IA que hace una tarea que alguien le dio.",
"Each gets a name of its own, an identity, and a person who answers for it.":
"Cada uno recibe un nombre propio, una identidad, y una persona que responde por él.",
"A job never borrows a person's name, and neither does an agent.":
"Un proceso nunca toma prestado el nombre de una persona, y un agente tampoco.",
"The films of AI agents in data work show how an agent gets its own.":
"Las películas de Agentes de IA muestran cómo un agente recibe el suyo.",
"Then what each one does shows under its own name.":
"Así, lo que hace cada uno aparece bajo su propio nombre.",
"Next: what may each one do?":
"Después: ¿qué puede hacer cada uno?",
"Sam's team once found 41 people who could read the whole learner table, each given it by name.":
"El equipo de Sam halló una vez a 41 personas que podían leer toda la tabla de estudiantes, cada una a su nombre.",
"Nine had moved to other jobs, and still could.":
"Nueve se habían ido a otros puestos, y todavía podían.",
"So rights go to a role, never to a person.":
"Así, los permisos van a un rol, nunca a una persona.",
"The roles are on the university's map: a data owner, an analytics engineer, a data steward.":
"Los roles están en el mapa de la universidad: un dueño de datos, un ingeniero de analítica, un responsable de datos.",
"Each role is a group, holding what the role's work needs, and no more.":
"Cada rol es un grupo, con lo que necesita el trabajo del rol, y nada más.",
"Join the group, and you have its rights; leave it, and they're gone.":
"Entra al grupo, y tienes sus permisos; sal de él, y se van.",
"And who may use the registrar's data is Mei's to say, as its owner.":
"Y quién puede usar los datos del registro lo decide Mei, como su dueña.",
"People join, move and leave, and their groups have to follow.":
"La gente entra, cambia de puesto y se va, y sus grupos deben seguirla.",
"The university's directory takes it from HR's records, so nobody has to remember.":
"El directorio de la universidad lo toma de Recursos Humanos, así que nadie tiene que acordarse.",
"A joiner gets an account on the first day, and no access yet.":
"Quien entra recibe una cuenta el primer día, y todavía ningún acceso.",
"First, they sign a confidentiality agreement: six lines, in their own voice.":
"Primero, firma un acuerdo de confidencialidad: seis líneas, en primera persona.",
"Everyone who works with the data signs it, signs again every year, and stays in a group only while theirs is current.":
"Todos los que trabajan con los datos lo firman, lo vuelven a firmar cada año, y siguen en un grupo solo mientras el suyo esté vigente.",
"An agent signs nothing: its owner signs for it.":
"Un agente no firma nada: su dueño firma por él.",
"A mover leaves the old group as they join the new one, so no right travels with them.":
"Quien cambia de puesto sale del grupo anterior al entrar en el nuevo, así que ningún permiso viaja con él.",
"A leaver's account is turned off on their last day, and every right goes with it.":
"La cuenta de quien se va se apaga su último día, y todos sus permisos con ella.",
"But the nightly job runs as Jun: when he moves, it stops, or goes on with whatever he may do next.":
"Pero el proceso nocturno corre como Jun: cuando él cambie de puesto, se detendrá, o seguirá con lo que él pueda hacer después.",
"Before Sam builds anything, he thinks like an attacker.":
"Antes de construir nada, Sam piensa como un atacante.",
"Four questions: what are we working on? What can go wrong?":
"Cuatro preguntas: ¿en qué estamos trabajando? ¿Qué puede salir mal?",
"What are we going to do about it? And did we do a good enough job?":
"¿Qué vamos a hacer al respecto? ¿Y hicimos un trabajo lo bastante bueno?",
"What can go wrong starts with the oldest trick: being someone else.":
"Lo que puede salir mal empieza con el truco más viejo: hacerse pasar por otro.",
"The tallies had that weak spot too.":
"Las tarjas también tenían ese punto débil.",
"In 257 BC, Qin had Handan, the capital of Zhao, under siege.":
"En el 257 a. C., Qin tenía sitiada a Handan, la capital de Zhao.",
"Wei's king sent an army to help, then, afraid of Qin, told it to wait.":
"El rey de Wei envió un ejército a ayudar y luego, por miedo a Qin, le ordenó esperar.",
"Lord Xinling, a prince of Wei, wanted it to march, and had the king's half taken from his rooms.":
"El señor de Xinling, un príncipe de Wei, quería que marchara, e hizo sacar la mitad del rey de sus aposentos.",
"At the camp, Jin Bi, the general, fitted the halves together, and they matched.":
"En el campamento, Jin Bi, el general, juntó las mitades, y encajaron.",
"Still he doubted: would the king send one man in a single chariot to take his army?":
"Aun así dudó: ¿enviaría el rey a un solo hombre en un solo carro para quitarle su ejército?",
"He was killed, and the army marched: Handan was saved, by an order the king never gave.":
"Lo mataron, y el ejército marchó: Handan se salvó, por una orden que el rey nunca dio.",
"A match proves someone holds the half, not who they are, or that the king sent them.":
"Que encajen prueba que alguien tiene la mitad, no quién es, ni que el rey lo envió.",
"So the platform keeps Jin Bi's doubt: who is it, from where, on which device, asking for what, and is that usual?":
"Así que la plataforma conserva la duda de Jin Bi: ¿quién es, desde dónde, en qué dispositivo, pidiendo qué, y es eso habitual?",
"And since a proof can be stolen, each identity gets only the least it needs.":
"Y como una prueba se puede robar, cada identidad recibe solo lo mínimo que necesita.",
"For the nightly job, what can go wrong is plain: a copy of Jun's token is Jun.":
"Para el proceso nocturno, lo que puede salir mal está claro: una copia del token de Jun es Jun.",
"So what are we going to do about it? The nightly job gets a name of its own: registrar-loader.":
"Entonces, ¿qué vamos a hacer al respecto? El proceso nocturno recibe un nombre propio: registrar-loader.",
"Sam owns it, and answers for it.":
"Sam es su dueño, y responde por él.",
"Its rights come from a role written for it: the loader role.":
"Sus permisos vienen de un rol escrito para él: el rol de carga.",
"It may read the registrar's nightly files and write the registrar's tables, and nothing in any other area.":
"Puede leer los archivos nocturnos del registro y escribir sus tablas, y nada en ninguna otra área.",
"Mei, who owns that data, agrees, before the job ever signs in under its new name.":
"Mei, dueña de esos datos, da su acuerdo antes de que el proceso entre con su nombre nuevo.",
"This is where most security work starts.":
"Aquí empieza casi todo el trabajo de seguridad.",
"NIST's Cybersecurity Framework puts it first under Protect: every user, service and device known, checked, and given the least it needs.":
"El Marco de Ciberseguridad del NIST lo pone primero en Proteger: todo usuario, servicio y equipo conocido, comprobado y con lo mínimo.",
"In the Warring States, a bronze tiger let a commander trust an order without trusting the man who brought it.":
"En los Reinos Combatientes, un tigre de bronce dejaba a un comandante confiar en una orden sin confiar en quien la traía.",
"On the platform, every request can say who it is, and get the least it needs.":
"En la plataforma, cada solicitud puede decir quién es, y recibir lo mínimo que necesita.",
"Did we do a good enough job? Not yet: tonight, the job still signs in with Jun's token.":
"¿Hicimos un trabajo lo bastante bueno? Todavía no: esta noche, el proceso sigue entrando con el token de Jun."
});
