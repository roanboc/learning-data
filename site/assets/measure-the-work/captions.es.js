/* Measure the work, not the people: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md has them: el equipo, la gestora de datos, una medida (the team's), un objetivo (a person's own), and for Goodhart's
   target, una meta, so a person's goals and a target never share a word. The four measures: días desde una solicitud hasta el primer uso, devuelto
   (para cambios), promesas cumplidas, la carga (trabajos abiertos a la vez, frente al límite de seis); la página de medidas del equipo. The director
   of digital services is never drawn and has no pronoun in the film, so the Spanish names the role without a gender: quien dirige los servicios
   digitales, a quien Helena reporta. In Sweden: las carreteras, los conductores, Visión Cero (its name in Spanish), una barrera de cables de acero,
   las rotondas. The films named keep the Spanish titles the module gives them (Cuando alguien se queda atrás). Tú, as the film speaks to the viewer
   (mide, empareja, lee, pregunta, di que no). Dates in words as Spanish says them (jueves 15 de julio). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In 1997, 541 people died on Sweden's roads.":
"En 1997, 541 personas murieron en carreteras suecas.",
"Most crashes were put down to a driver's mistake.":
"La mayoría de choques se atribuía a un error del conductor.",
"So the answer was to teach drivers, fine them, and blame them.":
"Así que la respuesta era enseñar a los conductores, multarlos y culparlos.",
"But people always make mistakes. A tired driver drifts over the middle line.":
"Pero la gente siempre comete errores. Un conductor cansado se desvía sobre la línea central.",
"On a fast road, that mistake could kill. For hundreds of families a year, it meant someone who never came home.":
"En una carretera rápida, ese error podía matar. Para cientos de familias al año, era alguien que nunca volvió a casa.",
"Something had to change.":
"Algo tenía que cambiar.",
"In October 1997, Sweden's parliament adopted Vision Zero: no one should be killed or seriously injured on the roads.":
"En octubre de 1997, el parlamento sueco adoptó Visión Cero: nadie debería morir ni quedar gravemente herido en las carreteras.",
"Those who design and run the roads would answer for that, not only drivers.":
"Quienes diseñan y gestionan las carreteras responderían por ello, no solo los conductores.",
"Every fatal crash was studied in depth, to ask how it could have been prevented.":
"Cada choque mortal se estudió a fondo, para preguntar cómo se podría haber evitado.",
"Many people died in head-on crashes, on fast roads with two lanes.":
"Muchos morían en choques frontales, en carreteras rápidas de dos carriles.",
"So from 1998, those roads got a barrier of steel cables down the middle.":
"Desde 1998, esas carreteras tuvieron en el centro una barrera de cables de acero.",
"Roundabouts replaced crossroads, and speeds came down where people walk.":
"Las rotondas reemplazaron a los cruces, y la velocidad bajó donde la gente camina.",
"On roads given a middle barrier, deaths fell by about three quarters.":
"Con barrera central, las muertes en esas carreteras bajaron cerca de tres cuartos.",
"Across the country, while traffic grew, road deaths fell by more than half.":
"En todo el país, con más tráfico, las muertes en carretera bajaron más de la mitad.",
"Drivers still had to take care. But a mistake no longer had to cost a life.":
"Aún había que conducir con cuidado. Pero un error ya no tenía por qué costar una vida.",
"Sweden stopped asking who to blame, and measured the roads, to find what in them to fix.":
"Suecia dejó de preguntar a quién culpar, y midió las carreteras, para encontrar qué arreglar en ellas.",
"Data work is the same: when work is slow, the cause is usually in how it flows, not in who did it.":
"El trabajo con datos es igual: cuando el trabajo es lento, la causa suele estar en cómo fluye, no en quién lo hizo.",
"Measure the work, read it together, and you find what to fix.":
"Mide el trabajo, léelo en equipo, y encontrarás qué arreglar.",
"At the university, a year from now, Helena Novak is the data manager.":
"En la universidad, dentro de un año, Helena Novak es la gestora de datos.",
"Managing and leading are two sides of her one role. It did harm to call one good, and the other old-fashioned.":
"Gestionar y liderar son dos caras de su único rol. Hizo daño llamar bueno a uno, y anticuado al otro.",
"What's hard to see is hard to improve for long. So a leader measures, and there are always dates and plans to keep.":
"Lo que cuesta ver cuesta mejorarlo por mucho tiempo. Por eso quien lidera mide, y siempre hay fechas y planes que cumplir.",
"That is management, but it has to fit the work: hours or tickets per person say little about thinking work.":
"Eso es gestión, pero debe ajustarse al trabajo: las horas o los tickets por persona dicen poco del trabajo de pensar.",
"From July, the team's page of measures, from the data management module, shows how the work flows.":
"Desde julio, la página de medidas del equipo, del módulo de gestión de datos, muestra cómo fluye el trabajo.",
"Days from a request to its first use: 41 in February, 24 by June.":
"Días desde una solicitud hasta su primer uso: 41 en febrero, 24 en junio.",
"Sent back: how often work comes back for changes.":
"Devuelto: cuántas veces el trabajo vuelve para cambios.",
"Promises met: how often the team's data products keep their promise.":
"Promesas cumplidas: cuánto cumplen su promesa los productos de datos del equipo.",
"And load: pieces of work open at once, against the team's limit of six.":
"Y la carga: trabajos abiertos a la vez, frente al límite de seis del equipo.",
"Each measure has a partner that balances it: speed beside sent back, promises beside load.":
"Cada medida tiene una pareja que la equilibra: velocidad junto a lo devuelto, promesas junto a la carga.",
"Every second Thursday from 15 July, the team reads the page together, for twenty minutes.":
"Cada dos jueves desde el 15 de julio, el equipo lee la página en conjunto, durante veinte minutos.",
"Helena asks one question: what slowed the work? Never, who was slow?":
"Helena hace una sola pregunta: ¿qué frenó el trabajo? Nunca: ¿quién fue lento?",
"In Sweden, they asked what in a road let a mistake kill. Helena asks the same of the work.":
"En Suecia preguntaron qué en una carretera dejaba que un error matara. Helena pregunta lo mismo del trabajo.",
"At the first reading, they take June's 24 days apart.":
"En la primera lectura, desarman los 24 días de junio.",
"Seven of them were spent waiting for access to the data.":
"Siete de ellos se fueron en esperar acceso a los datos.",
"Access was asked for only when work started, one dataset at a time, up to five days each.":
"El acceso se pedía solo al empezar el trabajo, un conjunto de datos a la vez, hasta cinco días cada uno.",
"Nobody was slow. The wait was in how the work was arranged.":
"Nadie fue lento. La espera estaba en cómo se organizaba el trabajo.",
"From Monday 19 July, access is asked for the day a request is accepted, so it's ready when work starts.":
"Desde el lunes 19 de julio, el acceso se pide el día en que se acepta una solicitud, y está listo al empezar el trabajo.",
"By September, that wait is down from seven days to one.":
"Para septiembre, esa espera baja de siete días a uno.",
"A second cause: one piece of work in eight came back, read one way and meant another.":
"Una segunda causa: uno de cada ocho trabajos volvía, leído de una manera y pensado de otra.",
"Now, before work starts, fifteen minutes with the person who asked agrees what done looks like.":
"Ahora, antes de empezar, quince minutos con quien lo pidió acuerdan cómo se ve el trabajo terminado.",
"By December, the days are down to 14, and sent back has halved, to 6 in 100.":
"Para diciembre, los días bajan a 14, y lo devuelto baja a la mitad, a 6 de cada 100.",
"Most of the gain came from waits like these, found and removed one at a time.":
"La mayor parte de la mejora vino de esperas como estas, encontradas y quitadas una a una.",
"On Thursday 12 August, promises met has reached 82%, up from 58 in March.":
"El jueves 12 de agosto, las promesas cumplidas llegan al 82%, desde 58 en marzo.",
"On its own, a number to celebrate.":
"Por sí solo, un número para celebrar.",
"But load stands at nine pieces of work open at once, against a limit of six.":
"Pero la carga está en nueve trabajos abiertos a la vez, frente a un límite de seis.",
"New work had started before old work finished: the team kept its promises by carrying too much.":
"El trabajo nuevo empezaba antes de terminar el anterior: el equipo cumplía sus promesas cargando demasiado.",
"That can't last: tired people make mistakes.":
"Eso no puede durar: la gente cansada comete errores.",
"So the team finishes before it starts: nothing new begins until something open is done.":
"Así que el equipo termina antes de empezar: nada nuevo comienza hasta cerrar algo abierto.",
"Two requests get a not now, with a reason and a date.":
"Dos solicitudes reciben un ahora no, con una razón y una fecha.",
"By mid-September, load is back to six, and promises met keeps rising, to 86% in December.":
"A mitad de septiembre, la carga vuelve a seis, y las promesas cumplidas suben hasta 86% en diciembre.",
"Accelerate's research, in 2018, found the best teams fast and stable at once, measured side by side.":
"La investigación de Accelerate, en 2018, halló los mejores equipos rápidos y estables a la vez, medidos lado a lado.",
"Each pair keeps the other honest. Speed without sent back can hide rushed work. Promises without load can hide tired people.":
"Cada pareja mantiene honesta a la otra. La velocidad sin lo devuelto oculta prisas. Las promesas sin la carga, gente cansada.",
"On Monday 13 September, the director of digital services, Helena's manager, asks for something new.":
"El lunes 13 de septiembre, quien dirige los servicios digitales, a quien Helena reporta, pide algo nuevo.",
"A count of tickets closed by each person, each month.":
"Un conteo de tickets cerrados por cada persona, cada mes.",
"The director wants to know if the team is getting faster, and if anyone needs help: fair questions.":
"Quiere saber si el equipo es cada vez más rápido, y si alguien necesita ayuda: preguntas justas.",
"In 1975, the economist Charles Goodhart saw that a number pushed to move stops meaning what it did.":
"En 1975, el economista Charles Goodhart vio que un número forzado a moverse deja de significar lo que significaba.",
"Marilyn Strathern put it plainly: when a measure becomes a target, it ceases to be a good measure.":
"Marilyn Strathern lo dijo con claridad: cuando una medida se convierte en meta, deja de ser una buena medida.",
"Count tickets per person, and people split work small, pick easy tickets, and stop helping each other. And mistakes get hidden.":
"Cuenta tickets por persona, y la gente divide el trabajo en partes, elige tickets fáciles y deja de ayudarse. Y se ocultan errores.",
"The SPACE framework warns the same: a count of activity never shows, alone, how well people work.":
"El marco SPACE advierte lo mismo: contar actividad nunca muestra, por sí solo, qué tan bien trabaja la gente.",
"And W. Edwards Deming estimated that about 94 in 100 problems belong to the system, not to the people in it.":
"Y W. Edwards Deming estimó que unos 94 de cada 100 problemas son del sistema, no de las personas que están en él.",
"So Helena says no to the count, and shows what instead: the team's page, and what its readings changed.":
"Así que Helena dice que no al conteo, y muestra qué en su lugar: la página del equipo, y lo que cambiaron sus lecturas.",
"How each person grows stays in their own goals, agreed with her.":
"Cómo crece cada persona queda en sus propios objetivos, acordados con ella.",
"The director takes the page to the quarterly review. No one is ranked.":
"Quien dirige lleva la página a la revisión trimestral. No se clasifica a nadie.",
"Sweden stopped blaming drivers one by one, measured its roads, and fixed what turned a mistake into a death.":
"Suecia dejó de culpar a los conductores uno por uno, midió sus carreteras y arregló lo que volvía un error una muerte.",
"Helena's team measured how its work flowed, read it together, and fixed what slowed it.":
"El equipo de Helena midió cómo fluía su trabajo, lo leyó en conjunto y arregló lo que lo frenaba.",
"On Monday, measure the flow of the work: days to first use, work sent back, promises met, and load.":
"El lunes, mide el flujo del trabajo: días hasta el primer uso, trabajo devuelto, promesas cumplidas y carga.",
"Pair each measure with one that balances it.":
"Empareja cada medida con otra que la equilibre.",
"Read them together, often, and ask what slowed the work, never who.":
"Léelas en equipo, a menudo, y pregunta qué frenó el trabajo, nunca quién.",
"When someone asks for a number to rank people by, say no, and show the team's flow instead.":
"Cuando alguien pida un número para clasificar a las personas, di que no, y muestra el flujo del equipo.",
"When someone falls behind, the next film, looks at the harder case: one person's work, and what surrounds it.":
"Cuando alguien se queda atrás, la próxima película, mira el caso más difícil: el trabajo de una persona, y lo que lo rodea.",
"Measure the work together. Fix the system, not the people.":
"Mide el trabajo en equipo. Arregla el sistema, no a las personas."
});
