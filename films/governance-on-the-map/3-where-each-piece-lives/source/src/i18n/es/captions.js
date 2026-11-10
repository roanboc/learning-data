/* Where each piece lives: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series: gobernanza de datos, never gobierno; dueño and dueña; a piece's home is su hogar, as in the enterprise architecture and master data films,
   and a copy, una copia; one way is en un solo sentido; to drift is desviarse, and drift, el desvío; a check is un control, and a sync, una sincronización; a column's
   class is su clase; the catalogue, el catálogo; the data platform, la plataforma de datos; the data team's repository, el repositorio del equipo de datos; the
   tracker, el gestor de incidencias; the council's minutes, las actas del consejo. Learners near an award are estudiantes cerca de un título, as in the series' films, and
   the planner is una planificadora (the film says her request). Sam's caption gives no gender the film doesn't. In the opening, the annals are los anales, the four archives los archivos,
   the two scholars dos eruditos del lugar, and the five sets, cinco juegos. The next series is Gobernanza que puedes usar, as on its page. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Korea, under the Joseon kings.":
"Corea, bajo los reyes de Joseon.",
"Every day, historians at court write down what's said and done.":
"Cada día, los historiadores de la corte anotan lo que se dice y se hace.",
"When a king dies, one office makes the record of his reign, his annals, from their notes, and prints them.":
"Cuando muere un rey, una oficina hace el registro de su reinado, sus anales, a partir de esas notas, y los imprime.",
"Every copy is the same, kept in four archives, and nobody may change one, not even a king.":
"Todas las copias son iguales, se guardan en cuatro archivos, y nadie puede cambiar ninguna, ni siquiera un rey.",
"In 1592, war comes up the roads, and three of the four archives burn.":
"En 1592, la guerra sube por los caminos, y tres de los cuatro archivos arden.",
"Only Jeonju's copy is left.":
"Solo queda la copia de Jeonju.",
"If it burns too, 175 years of the kingdom's memory are gone: what was decided, by whom, and why.":
"Si también arde, se pierden 175 años de la memoria del reino: qué se decidió, quién lo decidió y por qué.",
"Something has to change.":
"Algo tiene que cambiar.",
"Two local scholars carry it into the mountains, and guard it, in turns, for more than a year.":
"Dos eruditos del lugar la llevan a las montañas, y la cuidan, por turnos, durante más de un año.",
"After the war, the court prints the annals again, from that one copy.":
"Después de la guerra, la corte vuelve a imprimir los anales, a partir de esa única copia.",
"Five sets, far apart: one in the capital, four high in the mountains.":
"Cinco juegos, lejos unos de otros: uno en la capital, cuatro en lo alto de las montañas.",
"Every few years, a historian climbs to each archive, airs the books, and writes down what he finds.":
"Cada pocos años, un historiador sube a cada archivo, airea los libros y anota lo que encuentra.",
"The annals survive, complete: 472 years, twenty-five kings, 888 books.":
"Los anales sobreviven, completos: 472 años, veinticinco reyes, 888 libros.",
"Today, anyone can read them online, free.":
"Hoy, cualquiera puede leerlos en línea, gratis.",
"Jeonju's copy could rebuild the rest because every copy was made from one source, one way, and nobody wrote in one.":
"La copia de Jeonju pudo rehacer las demás porque todas salieron de una sola fuente, en un solo sentido, y nadie escribió en ninguna.",
"It's the same with data.":
"Con los datos pasa lo mismo.",
"A copy can be trusted when it's made from its home, one way, and checked.":
"Se puede confiar en una copia cuando sale de su hogar, en un solo sentido, y se controla.",
"February.":
"Febrero.",
"A planner in the Faculty of Business asks to read Planning's list of learners near an award, to plan next year's courses.":
"Una planificadora de la Facultad de Negocios pide leer la lista de Planificación de estudiantes cerca de un título, para planear cursos.",
"On the data platform, the table's page names its owner: Jun.":
"En la plataforma de datos, la página de la tabla nombra a su dueño: Jun.",
"So her request goes to Jun, and waits.":
"Así que su solicitud va a Jun, y espera.",
"But Jun only built it.":
"Pero Jun solo la construyó.",
"Since October, its owner is Clara, in Planning.":
"Desde octubre, su dueña es Clara, de Planificación.",
"Nine days later, Jun sees the request, and passes it on.":
"Nueve días después, Jun ve la solicitud, y la reenvía.",
"Had he said yes, someone who isn't the owner would have decided who may see it.":
"Si hubiera dicho que sí, alguien que no es el dueño habría decidido quién puede verla.",
"The page was typed by hand when the table was built, and nobody kept it in step.":
"La página se escribió a mano cuando se construyó la tabla, y nadie la mantuvo al día.",
"Sam runs the data platform, and wants its pages to name the right owner.":
"Sam lleva la plataforma de datos, y quiere que sus páginas nombren al dueño correcto.",
"So Sam asks Yusuf where governance's pieces live.":
"Sam le pregunta a Yusuf dónde viven las piezas de la gobernanza.",
"Yusuf counts seven places.":
"Yusuf cuenta siete lugares.",
"The architecture tool, which holds Noor's map.":
"La herramienta de arquitectura, que guarda el mapa de Noor.",
"The glossary.":
"El glosario.",
"The document library, with the policies and the council's minutes.":
"La biblioteca de documentos, con las políticas y las actas del consejo.",
"The data team's repository: owners, classes, tables, checks, decisions, and each product's promise.":
"El repositorio del equipo de datos: dueños, clases, tablas, controles, decisiones y la promesa de cada producto.",
"The data platform: who may read what, and the record of who read it.":
"La plataforma de datos: quién puede leer qué, y el registro de quién lo leyó.",
"The catalogue, where people find products.":
"El catálogo, donde la gente encuentra productos.",
"And the tracker, for issues and requests.":
"Y el gestor de incidencias, para problemas y solicitudes.",
"Some pieces sit in more than one place.":
"Algunas piezas están en más de un lugar.",
"One copy no longer matched the others: it had drifted.":
"Una copia ya no coincidía con las otras: se había desviado.",
"Noor puts each place on her map, as an application, with what it holds.":
"Noor pone cada lugar en su mapa, como una aplicación, con lo que guarda.",
"Then she sets one rule.":
"Luego fija una regla.",
"Every piece has one home, where it's changed, and an owner, who decides it.":
"Cada pieza tiene un solo hogar, donde se cambia, y un dueño, que la decide.",
"Every other place keeps a copy, and says where it came from, and when.":
"Los demás lugares guardan una copia, y dicen de dónde vino, y cuándo.",
"A product's owner, for one, lives in the data team's repository.":
"El dueño de un producto, por ejemplo, vive en el repositorio del equipo de datos.",
"The catalogue and the platform's page copy it.":
"El catálogo y la página de la plataforma lo copian.",
"As with the annals, nobody writes in a copy.":
"Como con los anales, nadie escribe en una copia.",
"A fix goes to its home, and every copy follows.":
"Una corrección va a su hogar, y cada copia la sigue.",
"Then the flows between them, each one way.":
"Luego, los flujos entre ellos, cada uno en un solo sentido.",
"Definitions go from the map to the glossary.":
"Las definiciones van del mapa al glosario.",
"From the glossary, they go to every tool that reads them: the data team's copy, the dashboards, and the assistant.":
"Del glosario, van a cada herramienta que las lee: la copia del equipo de datos, los tableros y el asistente.",
"The map's concepts, a learner or an award, go to the data team's tables.":
"Los conceptos del mapa, un estudiante o un título, van a las tablas del equipo de datos.",
"Each column's class goes from the repository to the platform, where it sets who may read it.":
"La clase de cada columna va del repositorio a la plataforma, donde fija quién puede leerla.",
"Each product's promise goes from the repository to the catalogue.":
"La promesa de cada producto va del repositorio al catálogo.",
"Nothing flows back.":
"Nada fluye hacia atrás.",
"A copy is never a home.":
"Una copia nunca es un hogar.",
"But a copy can still drift from its home, if someone types into it, or a sync stops.":
"Pero una copia aún puede desviarse de su hogar, si alguien escribe en ella, o si se detiene una sincronización.",
"So every night, a check compares each copy with its home.":
"Así que cada noche, un control compara cada copia con su hogar.",
"The first night, it finds the old owner's name on the table's page, and wrong names on two more pages, typed by hand last year.":
"La primera noche, halla al antiguo dueño en la página de la tabla, y nombres errados en otras dos, escritos a mano el año pasado.",
"The sync puts them right by morning, and the check tells each owner what changed.":
"La sincronización los corrige antes de la mañana, y el control le avisa a cada dueño qué cambió.",
"Drift is something a check finds, not something a person remembers.":
"El desvío es algo que encuentra un control, no algo que una persona recuerda.",
"The historians climbed to each archive, and wrote down what they found.":
"Los historiadores subían a cada archivo, y anotaban lo que encontraban.",
"Here, a check does it every night.":
"Aquí, lo hace un control cada noche.",
"Each team still works in its own tool.":
"Cada equipo sigue en su propia herramienta.",
"What changes is that everyone knows which copy is theirs to change, and which only to read.":
"Lo que cambia es que todos saben qué copia les toca cambiar, y cuál solo leer.",
"The planner's next request goes straight to Clara, who decides it in a day.":
"La siguiente solicitud de la planificadora va directo a Clara, que la decide en un día.",
"And Noor's map becomes the plan for the next series, Governance you can use: each of its films builds a part of it, in the tools.":
"Y el mapa de Noor se vuelve el plan de la próxima serie, Gobernanza que puedes usar: cada película arma una parte, en las herramientas.",
"The annals lasted because every copy came from one source, one way, and was checked.":
"Los anales duraron porque cada copia salió de una sola fuente, en un solo sentido, y se controlaba.",
"Give every piece of governance one home, and every copy can be trusted.":
"Da a cada pieza de la gobernanza un solo hogar, y se podrá confiar en cada copia.",
"Everyone reads the same thing, and every request reaches the person who decides.":
"Todos leen lo mismo, y cada solicitud llega a la persona que decide."
});
