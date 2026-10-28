/* Who does what, end to end: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series: gobernanza de datos, never gobierno; dueño and dueña; Mei is la responsable de datos, so dueño, responsable and custodio never share a word;
   la oficina de registro, and the registrar, la jefa de registro; título for an award, and finalización for a completion, as a completion rate is una tasa de
   finalización; Planificación, informe, tablero, glosario, un término, un servicio, una solicitud, el registro de quién usa qué; a chart of who's responsible for
   what is un cuadro, as in Off the shelf; nobody retypes it is nadie lo vuelve a escribir, as in A map people and agents can read. The steps are pedir, redactar,
   revisar, decidir, publicar and seguir; the reviewer is el revisor, and the agent's rights, sus atribuciones; the line on actors keeps the caption of Who does it,
   and where meaning changes, word for word. In the opening, the Royal Spanish Academy is la Real Academia Española, the Americas América, and "to budget" is
   presupuestar, Palma's own word, the one place the captions keep it. A way in is a door, una puerta de entrada, and having none, no tener por dónde entrar.
   The colleague who fills in for Mei is alguien de su oficina, so the caption gives no gender the film doesn't. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Madrid, 1892.":
"Madrid, 1892.",
"Ricardo Palma, a writer from Lima, joins the meetings of the Royal Spanish Academy, which makes the dictionary of Spanish.":
"Ricardo Palma, escritor de Lima, asiste a las sesiones de la Real Academia Española, que hace el diccionario del español.",
"He brings more than three hundred words used every day in the Americas, and asks for them to go in.":
"Lleva más de trescientas palabras que se usan a diario en América, y pide que las incluyan.",
"Most are turned down, among them the word for ‘to budget’.":
"La mayoría son rechazadas, entre ellas la palabra ‘presupuestar’.",
"People look in the dictionary to see if a word is right, so words left out count as wrong.":
"La gente busca en el diccionario si una palabra es correcta, así que las que faltan cuentan como incorrectas.",
"And the millions who use them have no way in.":
"Y los millones que las usan no tienen por dónde entrar.",
"Seventeen years later, Palma is still asking a friend in Madrid what became of ‘to budget’.":
"Diecisiete años después, Palma aún le pregunta a un amigo en Madrid qué pasó con ‘presupuestar’.",
"Something has to change.":
"Algo tiene que cambiar.",
"In 1951, the academies of the Americas form an association, and Spain's academy soon joins their work.":
"En 1951, las academias de América forman una asociación, y la de España pronto se suma a su trabajo.",
"Today, they make the dictionary together.":
"Hoy, hacen el diccionario juntas.",
"Members of each academy propose words from where they live.":
"Los miembros de cada academia proponen palabras de donde viven.",
"A commission drafts each change, the Spanish Academy approves it, and every other academy gives its view before it goes in.":
"Una comisión redacta cada cambio, la Real Academia lo aprueba, y todas las demás academias opinan antes de que entre.",
"Twenty-three academies make one dictionary, free online, for more than six hundred million people.":
"Veintitrés academias hacen un solo diccionario, gratis en línea, para más de seiscientos millones de personas.",
"Each year's update lists what changed.":
"La actualización de cada año enumera lo que cambió.",
"And ‘to budget’ is in it.":
"Y ‘presupuestar’ está en él.",
"It's the same with data.":
"Con los datos pasa lo mismo.",
"When anyone can ask for a term, and every step has someone to do it, everyone can use the same words.":
"Cuando cualquiera puede pedir un término, y cada paso tiene a alguien que lo haga, todos pueden usar las mismas palabras.",
"January.":
"Enero.",
"Clara, in Planning, compares how many learners complete their awards, faculty by faculty.":
"Clara, de Planificación, compara cuántos estudiantes completan su título, facultad por facultad.",
"But three faculties count a completion three ways.":
"Pero tres facultades cuentan una finalización de tres maneras.",
"Business, when the last mark is in.":
"Negocios, cuando está la última nota.",
"Science, when the examiners confirm the marks.":
"Ciencias, cuando los examinadores confirman las notas.",
"Health, when the award is conferred.":
"Salud, cuando se otorga el título.",
"So the same learners look nine points less likely to complete in Health.":
"Así, en Salud, los mismos estudiantes parecen nueve puntos menos propensos a terminar.",
"Before, a question like this went round by email, and nobody decided.":
"Antes, una pregunta así daba vueltas por correo, y nadie decidía.",
"Now there's a service for it: define or change a term, decided within ten working days.":
"Ahora hay un servicio para eso: definir o cambiar un término, decidido en diez días hábiles.",
"Clara asks.":
"Clara lo pide.",
"Noor and Yusuf follow her request from start to finish, through the rooms where it happens.":
"Noor y Yusuf siguen su solicitud de principio a fin, por las salas donde ocurre.",
"Mei, the steward, drafts what completion means, with an example.":
"Mei, la responsable de datos, redacta qué significa finalización, con un ejemplo.",
"An agent checks that the draft has everything a term needs, and lists what it touches: three reports, and two dashboards.":
"Un agente revisa que el borrador tenga todo lo que un término necesita, y enumera lo que toca: tres informes y dos tableros.",
"The registrar, the owner, decides.":
"La jefa de registro, la dueña, decide.",
"Mei writes it once, on Noor's map, and the map publishes it to the glossary.":
"Mei lo escribe una sola vez, en el mapa de Noor, y el mapa lo publica en el glosario.",
"And every copy follows, one way: the data team's copy, the dashboards, and the assistant that answers questions in plain words.":
"Y cada copia lo sigue, en un solo sentido: la del equipo de datos, los tableros y el asistente que responde con palabras sencillas.",
"Ask, draft, check, decide, publish, follow.":
"Pedir, redactar, revisar, decidir, publicar, seguir.",
"Each step is done by a role: the one who asks, the steward, the reviewer, the owner.":
"Cada paso lo hace un rol: quien pide, el responsable de datos, el revisor, el dueño.",
"Whoever fills a role is an actor: a person, or a team. Actors come and go; roles stay.":
"Quien ocupa un rol es un actor: una persona o un equipo. Los actores van y vienen; los roles se quedan.",
"Here, one actor is software: the agent fills the reviewer's role, with its rights written down.":
"Aquí, un actor es software: el agente ocupa el rol del revisor, con sus atribuciones por escrito.",
"It may read the glossary and the record of who uses what, and write its note.":
"Puede leer el glosario y el registro de quién usa qué, y escribir su nota.",
"It may not decide, or change a word in the glossary.":
"No puede decidir, ni cambiar una palabra del glosario.",
"People decide.":
"Las personas deciden.",
"The academies work the same way: their members change, and the steps stay.":
"Las academias funcionan igual: sus miembros cambian, y los pasos se quedan.",
"Each step reads something, and writes something for the next.":
"Cada paso lee algo, y escribe algo para el siguiente.",
"The request: which term, why, and who it affects.":
"La solicitud: qué término, por qué, y a quién afecta.",
"The draft: a definition, an example, an owner, and its status, proposed.":
"El borrador: una definición, un ejemplo, un dueño, y su estado, propuesto.",
"The agent's note: what's missing, and what the change touches.":
"La nota del agente: qué falta, y qué toca el cambio.",
"The decision: who decided, when, and why.":
"La decisión: quién decidió, cuándo, y por qué.",
"Then the term, and its copies, each saying where it came from.":
"Luego el término, y sus copias, cada una diciendo de dónde viene.",
"On the map, each of these is information the service keeps, with a home of its own.":
"En el mapa, cada una es información que el servicio guarda, con su propio lugar.",
"On his first day, Yusuf found a chart of who's responsible for what, with half its names still to be confirmed.":
"En su primer día, Yusuf encontró un cuadro de quién es responsable de qué, con la mitad de los nombres aún por confirmar.",
"Now it's drawn from the map: every step, its role, and who fills it today.":
"Ahora sale del mapa: cada paso, su rol, y quién lo ocupa hoy.",
"In February, Mei takes three weeks' leave.":
"En febrero, Mei se toma tres semanas de licencia.",
"A colleague fills her steward's role, and the chart changes that day, and back again when she returns.":
"Alguien de su oficina ocupa su rol de responsable, y el cuadro cambia ese día, y vuelve a cambiar cuando ella regresa.",
"Nobody retypes it.":
"Nadie lo vuelve a escribir.",
"A steward is a role with time to do it, not a name on a chart.":
"Un responsable de datos es un rol con tiempo para hacerlo, no un nombre en un cuadro.",
"And the glossary itself is run as a product.":
"Y el propio glosario se gestiona como un producto.",
"It has an owner: Yusuf, for data governance.":
"Tiene un dueño: Yusuf, de gobernanza de datos.",
"Its users: people, reports, the tables that link to it, and agents.":
"Sus usuarios: personas, informes, las tablas que lo enlazan, y agentes.",
"And a promise: every term has an owner, a definition, an example and a status, and a change is decided within ten working days.":
"Y una promesa: cada término tiene un dueño, una definición, un ejemplo y un estado, y un cambio se decide en diez días hábiles.",
"Each week, it lists what changed.":
"Cada semana, enumera lo que cambió.",
"And it counts who reads each term.":
"Y cuenta quién lee cada término.",
"This year, nine terms nobody read are retired, each with its owner's yes.":
"Este año, nueve términos que nadie leía se retiran, cada uno con el sí de su dueño.",
"Like the dictionary's yearly list, the week's list shows everyone what's new.":
"Como la lista anual del diccionario, la lista de la semana muestra a todos lo nuevo.",
"All along, Clara could see where her request was, without chasing anyone.":
"Todo el tiempo, Clara pudo ver dónde estaba su solicitud, sin tener que perseguir a nadie.",
"It was decided in eight working days.":
"Se decidió en ocho días hábiles.",
"Now the faculties count a completion one way, and the nine points between them are gone.":
"Ahora las facultades cuentan una finalización de una sola manera, y los nueve puntos entre ellas ya no están.",
"Palma had to ask a friend what became of his word.":
"Palma tuvo que preguntarle a un amigo qué pasó con su palabra.",
"Clara can see where hers is.":
"Clara puede ver dónde está la suya.",
"A service followed end to end gives anyone a way in, a step for every role, and words everyone can use.":
"Un servicio seguido de principio a fin da a cualquiera una puerta de entrada, un paso para cada rol, y palabras que todos pueden usar."
});
