/* One map, in the repo: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, and the video takes es.srt.
   Words as the module has them: el equipo, la gestora de datos, la arquitecta de datos, el consejo de datos (el consejo), los socios de datos,
   los ingenieros principales, el viejo almacén de datos. Ordnance Survey, OS MasterMap, TOID, ArchiMate, The Open Group, Mermaid and draw.io keep their names;
   a tile is un cuadro, a pull request keeps its name, a decision record is un registro de decisión, the current and target state are el estado actual y el objetivo.
   The film named keeps its Spanish title on the site: Dónde vive cada pieza. Tú, as the film speaks to the viewer. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Great Britain, in the late 1990s.":
"Gran Bretaña, a finales de los años noventa.",
"Ordnance Survey, the national mapping agency, keeps the most detailed maps of the country.":
"Ordnance Survey, la agencia cartográfica nacional, tiene los mapas más detallados del país.",
"Its paper maps have been turned into digital ones, and cut into tiles, square by square.":
"Sus mapas de papel se han vuelto digitales, y se han cortado en cuadros, uno a uno.",
"But on a tile, a building is only lines on a picture. It has no name, no number, nothing to point to.":
"Pero en un cuadro, un edificio son solo líneas en un dibujo. No tiene nombre, ni número, nada a qué apuntar.",
"Councils, water companies and the emergency services each keep their own records of the same buildings and roads.":
"Los ayuntamientos, las compañías de agua y los servicios de emergencia llevan cada uno sus registros de los mismos edificios y calles.",
"Each matches its records to the lines in its own way.":
"Cada uno une sus registros a las líneas a su manera.",
"So one school can be one thing in a council's records, and another in a water company's.":
"Así, una escuela puede ser una cosa en los registros de un ayuntamiento, y otra en los de una compañía de agua.",
"Nobody can be sure that two records mean the same place.":
"Nadie puede estar seguro de que dos registros hablen del mismo lugar.",
"And when a new road is built, each of them must find it, and change it, on its own.":
"Y cuando se construye una calle nueva, cada uno tiene que encontrarla, y cambiarla, por su cuenta.",
"Each keeping its own copy of the same streets can't go on.":
"Que cada uno guarde su propia copia de las mismas calles no puede seguir así.",
"In 2001, Ordnance Survey launches OS MasterMap: one seamless database of the whole country, instead of tiles.":
"En 2001, Ordnance Survey lanza OS MasterMap: una sola base de datos continua de todo el país, en lugar de cuadros.",
"Every feature in it, about 440 million at first, gets its own identifier, a TOID, with a version and a date.":
"Cada elemento, unos 440 millones al principio, recibe su propio identificador, un TOID, con una versión y una fecha.",
"Surveyors, on the ground and from the air, keep it up to date, and users receive only what has changed.":
"Topógrafos, en el terreno y desde el aire, la mantienen al día, y los usuarios reciben solo lo que cambió.",
"Now a council and a water company can point to the same building by its identifier, with no doubt which one they mean.":
"Ahora un ayuntamiento y una compañía de agua pueden señalar el mismo edificio por su identificador, sin dudar de cuál hablan.",
"Each change carries its version and its date, so anyone can see what changed, and when.":
"Cada cambio lleva su versión y su fecha, así que cualquiera puede ver qué cambió, y cuándo.",
"By 2016, it holds over 500 million features.":
"En 2016, tiene más de 500 millones de elementos.",
"A data team's architecture has the same problem: one picture of its platform, kept in copies that drift apart.":
"La arquitectura de un equipo de datos tiene el mismo problema: una imagen de su plataforma, guardada en copias que se separan.",
"Keep one source, date every change, and make every copy from it.":
"Guarda una sola fuente, pon fecha a cada cambio, y saca de ella cada copia.",
"These films are the product owner's side of a data manager's job, borrowed from architecture.":
"Estas películas son el lado de dueña de producto del trabajo de una gestora de datos, tomado de la arquitectura.",
"A university, in the spring of 2027. Helena Novak, the data manager, has a target picture for the data platform.":
"Una universidad, en la primavera de 2027. Helena Novak, la gestora de datos, tiene una imagen objetivo de la plataforma de datos.",
"It exists three times: Noor's map in the architecture tool, a page on the wiki, and the slides for the data council.":
"Existe tres veces: el mapa de Noor en la herramienta de arquitectura, una página en la wiki, y las diapositivas para el consejo de datos.",
"Each was right the day it was made. Each has been changed by hand, on its own, since.":
"Cada una era correcta el día en que se hizo. Desde entonces, cada una se ha cambiado a mano, por su cuenta.",
"On Tuesday 25 May, Helena asks the council to retire the old warehouse.":
"El martes 25 de mayo, Helena pide al consejo retirar el viejo almacén de datos.",
"The council's slide still shows the old warehouse in the target.":
"La diapositiva del consejo aún muestra el viejo almacén en el objetivo.",
"Which picture is true? Nobody in the room can say for sure.":
"¿Qué imagen es la verdadera? Nadie en la sala puede decirlo con certeza.",
"Project managers have the same trouble: who does what, when and how, sits in a deck from March.":
"Los jefes de proyecto tienen el mismo problema: quién hace qué, cuándo y cómo, está en una presentación de marzo.",
"Noor, the data architect, says what Ordnance Survey found: copies drift. Keep one source.":
"Noor, la arquitecta de datos, dice lo que descubrió Ordnance Survey: las copias se separan. Guarda una sola fuente.",
"In June, the map's source moves into the data team's repository, as files, beside the platform's code.":
"En junio, la fuente del mapa pasa al repositorio del equipo de datos, como archivos, junto al código de la plataforma.",
"Noor writes it in ArchiMate's exchange format, a standard language for architecture, from The Open Group.":
"Noor lo escribe en el formato de intercambio de ArchiMate, un lenguaje estándar de arquitectura, de The Open Group.",
"She adds only what is the team's own, such as each product's owner. Standards first; then what's relevant to you.":
"Añade solo lo propio del equipo, como el dueño de cada producto. Primero los estándares; luego lo que te importa a ti.",
"The diagrams are kept as text too, in Mermaid, or as draw.io files, so a change to a picture is a change you can read.":
"Los diagramas también se guardan como texto, en Mermaid o como archivos de draw.io, así que un cambio en un dibujo es un cambio que se lee.",
"Each night, everything else is made from it: the architecture tool's views, the wiki, and the picture on the monthly page.":
"Cada noche, todo lo demás sale de él: las vistas de la herramienta de arquitectura, la wiki y el dibujo de la página mensual.",
"And the project managers' page of who does what, when and how.":
"Y la página de los jefes de proyecto sobre quién hace qué, cuándo y cómo.",
"Of the team's seven places for its work, from Where each piece lives, the map's source now lives in one: the repository.":
"De los siete lugares del equipo para su trabajo, de Dónde vive cada pieza, la fuente del mapa ahora vive en uno: el repositorio.",
"The wiki and the slides can't disagree with the map any more. They're made from it.":
"La wiki y las diapositivas ya no pueden contradecir al mapa. Salen de él.",
"Every change to the map is a pull request, with its reason, reviewed by someone other than its author.":
"Cada cambio del mapa es una pull request, con su motivo, revisada por alguien que no es su autor.",
"Noor, Helena and the principal engineers, Sam and Jun, review. Data partners in the faculties propose.":
"Noor, Helena y los ingenieros principales, Sam y Jun, revisan. Los socios de datos de las facultades proponen.",
"In July, Sam's team adds the rooms' sensor feed to the platform.":
"En julio, el equipo de Sam añade a la plataforma el flujo de los sensores de las aulas.",
"The same pull request adds the feed to the map's current state. The code and the map change together.":
"La misma pull request añade el flujo al estado actual del mapa. El código y el mapa cambian juntos.",
"And a check fails if a new source has no place on the map.":
"Y una comprobación falla si una fuente nueva no tiene lugar en el mapa.",
"Nobody waits for a funded project to update the current state and the target.":
"Nadie espera a un proyecto con fondos para actualizar el estado actual y el objetivo.",
"Wait for that, and the team ends up building tomorrow's legacy.":
"Si se espera a eso, el equipo acaba construyendo el legado de mañana.",
"A big choice gets a short decision record beside it, as Michael Nygard proposed in 2011: what was decided, and why.":
"Una decisión grande lleva al lado un registro breve, como propuso Michael Nygard en 2011: qué se decidió, y por qué.",
"In August, Helena asks the team's agent to draft the change that retires the old warehouse, from her notes.":
"En agosto, Helena pide al agente del equipo que redacte, desde sus notas, el cambio que retira el viejo almacén.",
"In minutes, it writes the new target state, and draws its diagram, as text.":
"En minutos, escribe el nuevo estado objetivo, y dibuja su diagrama, como texto.",
"Noor reviews it, line by line.":
"Noor lo revisa, línea por línea.",
"One relationship is wrong: payroll's reports still read from the old warehouse, after it's gone.":
"Una relación está mal: los informes de nómina aún leen del viejo almacén, cuando ya no existe.",
"She asks for the fix, checks it, and approves.":
"Pide la corrección, la revisa, y aprueba.",
"The agent films have the same rule: an agent proposes, and a person decides.":
"Las películas de agentes tienen la misma regla: un agente propone, y una persona decide.",
"The map isn't one person's job. It starts with Helena: she opened its first pull request herself.":
"El mapa no es trabajo de una sola persona. Empieza con Helena: ella abrió su primera pull request.",
"The principal engineers keep it with her, and anyone on the team can propose a change.":
"Los ingenieros principales lo cuidan con ella, y cualquiera del equipo puede proponer un cambio.",
"By Friday 17 December, the old warehouse is retired, and 63 changes of the year are in the map's history, each with its reason.":
"El viernes 17 de diciembre, el viejo almacén está retirado, y 63 cambios del año están en la historia del mapa, cada uno con su motivo.",
"At its reviews, the council reads that history, not a slide made the night before.":
"En sus revisiones, el consejo lee esa historia, no una diapositiva hecha la noche anterior.",
"Ordnance Survey stopped keeping its map in pieces: one database, every feature with its identifier, every change with its date.":
"Ordnance Survey dejó de guardar su mapa en pedazos: una base de datos, cada elemento con su identificador, cada cambio con su fecha.",
"Helena's team did the same with its architecture: one map, and every other picture made from it.":
"El equipo de Helena hizo lo mismo con su arquitectura: un solo mapa, y cada otra imagen sale de él.",
"On Monday, put your architecture in a repository, as files, in a standard language.":
"El lunes, pon tu arquitectura en un repositorio, como archivos, en un lenguaje estándar.",
"Review every change like code, and update the current and target state in the change that moves them.":
"Revisa cada cambio como el código, y actualiza el estado actual y el objetivo en el cambio que los mueve.",
"Make the wiki, the slides and the who-does-what pages from it.":
"Saca de él la wiki, las diapositivas y las páginas de quién hace qué.",
"Let agents draft the structure and the diagrams, and review what they draft.":
"Deja que los agentes redacten la estructura y los diagramas, y revisa lo que redactan.",
"And make architecture everyone's job, starting with yours.":
"Y haz de la arquitectura el trabajo de todos, empezando por el tuyo.",
"One map in the repository; every change updates it; everything else comes from it.":
"Un solo mapa en el repositorio; cada cambio lo actualiza; todo lo demás sale de él."
});
