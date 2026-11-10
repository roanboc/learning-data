/* Tools are hands, and every hand is a permission: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the earlier films: el conteo del día del censo, estudiantes (never inscripciones), Planificación, el consejo
   for the board, la plataforma; the six tools keep the names they have on screen (Tickets, Catalog, Docs, Query, Repository, Build), and
   each is un servidor de herramientas, through the Model Context Protocol, un estándar abierto; permisos for rights, de solo lectura,
   borradores for drafts, un sandbox, as the screen says, una rama for a branch and un pull request, as the site's Spanish pages say;
   enmascarados for masked names, una salida for a way out, una fuga for a leak, un asistente de IA. In Oxford: los eruditos, los pupitres
   for the lectern desks, los estantes, la cadena, el bibliotecario, el rey Carlos I; the rule's four lines in tú, as the board speaks to
   each reader (Lee aquí, No te lleves ningún libro, No marques ninguno, No traigas fuego), and your own book as tu propio cuaderno, the
   notebook the picture shows, both times it's said. Numbers keep the picture's comma (18,412), as the series' other Spanish captions do,
   so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Oxford, in the 1400s.":
"Oxford, en el siglo XV.",
"A duke gives the university his books, and scholars read them in a long room built to hold them.":
"Un duque regala sus libros a la universidad, y los eruditos los leen en una sala larga hecha para guardarlos.",
"Then, in 1550, in years of religious upheaval, the books are taken away, sold or lost.":
"Luego, en 1550, en años de conflictos religiosos, se llevan los libros: vendidos o perdidos.",
"By 1556, even the desks are sold.":
"Para 1556, se venden hasta los pupitres.",
"Each had been copied by hand, and some had no other copy: once gone, gone for good.":
"Cada uno se había copiado a mano, y algunos no tenían otra copia: perdidos, perdidos para siempre.",
"For half a century, the university has no library.":
"Durante medio siglo, la universidad no tiene biblioteca.",
"A library is only as safe as the hands that can reach it. Something has to change.":
"Una biblioteca está tan segura como las manos que la alcanzan. Algo tiene que cambiar.",
"In 1598, Thomas Bodley, a retired diplomat, offers to restore it at his own cost, with seats, and shelves, and desks.":
"En 1598, Thomas Bodley, un diplomático retirado, ofrece restaurarla a su costa, con asientos, estantes y pupitres.",
"It opens on the 8th of November, 1602, on one rule.":
"Abre el 8 de noviembre de 1602, con una sola regla.",
"Read here. Take no book away.":
"Lee aquí. No te lleves ningún libro.",
"Mark none: your notes go in your own book. And bring no flame.":
"No marques ninguno: tus notas van en tu propio cuaderno. Y no traigas fuego.",
"Every reader promises to keep it, and the books are chained to their shelves: read at the desk, and nowhere else.":
"Cada lector promete cumplirla, y los libros están encadenados a sus estantes: se leen en el pupitre, y en ningún otro lugar.",
"The rule holds, whoever asks.":
"La regla se cumple, pida quien pida.",
"In 1645, King Charles the First, at war and living in Oxford, asks to borrow a book.":
"En 1645, el rey Carlos I, en guerra y viviendo en Oxford, pide prestado un libro.",
"The librarian shows him the rule. The king agrees, and the book stays.":
"El bibliotecario le muestra la regla. El rey acepta, y el libro se queda.",
"Four hundred years on, the books are still there for every reader, with more than 13 million printed items today.":
"Cuatrocientos años después, los libros siguen ahí para cada lector, con más de 13 millones de impresos hoy.",
"And every new reader still makes the promise.":
"Y cada nuevo lector sigue haciendo la promesa.",
"Jun's agent reads in a library too: the university's data. Every tool it's given is a hand.":
"El agente de Jun también lee en una biblioteca: los datos de la universidad. Cada herramienta es una mano.",
"Give each hand only what its work needs, and the data stays safe, whoever asks.":
"Dale a cada mano solo lo que su trabajo necesita, y los datos quedan a salvo, pida quien pida.",

"Jun's agent works on the census-day count, the number the university reports to the government: 18,412 students.":
"El agente de Jun trabaja en el conteo del día del censo, el número que la universidad informa al gobierno: 18,412 estudiantes.",
"It reads tickets, the catalog and the team's docs, queries the data, and writes and builds code.":
"Lee tickets, el catálogo y los documentos del equipo, consulta los datos, y escribe y compila código.",
"Each hand is a tool server: a small program that gives an agent its tools through an open standard, the Model Context Protocol.":
"Cada mano es un servidor de herramientas, un pequeño programa que le da herramientas por un estándar abierto: el Model Context Protocol.",
"Whatever a tool can do, the agent can do.":
"Lo que puede una herramienta, lo puede el agente.",
"And an agent works for whoever gives it words: a line hidden in what it reads, or a thief with its key.":
"Y un agente trabaja para quien le dé palabras: una línea escondida en lo que lee, o un ladrón con su clave.",
"So for each hand, ask for the least this job needs.":
"Para cada mano, pide lo mínimo que este trabajo necesita.",
"Security engineers have said it since 1975: the fewest rights the work needs.":
"Los ingenieros de seguridad lo dicen desde 1975: los menos permisos que el trabajo necesita.",

"Bodley's library kept its books two ways.":
"La biblioteca guardaba sus libros de dos formas.",
"The promise asked each reader. The chain held the book, whatever the reader meant.":
"La promesa le pedía a cada lector. La cadena sujetaba el libro, fuera cual fuera su intención.",
"An agent has both.":
"Un agente tiene ambas.",
"Its rules, in a file for agents, say: read, draft, never write to production.":
"Sus reglas, en un archivo para agentes, dicen: lee, haz borradores, nunca escribas en producción.",
"But rules are words, and words can be argued with, or hidden in a ticket.":
"Pero las reglas son palabras, y las palabras se discuten, o se esconden en un ticket.",
"So its rights are set where the data lives, on its own account: what a tool can't do, no instruction can make it.":
"Así que sus permisos se fijan donde viven los datos, en su propia cuenta: lo que una herramienta no puede, ninguna instrucción lo logra.",
"Sam, who runs the platform, sets up each hand with the team's rules for AI helpers.":
"Sam, que administra la plataforma, configura cada mano con las reglas del equipo para ayudantes de IA.",
"Its own identity, never a person's.":
"Identidad propia, nunca la de una persona.",
"Read only, unless the job needs to write.":
"Solo lectura, salvo que el trabajo exija escribir.",
"Writes only drafts, in a sandbox of its own.":
"Solo escribe borradores, en un sandbox propio.",
"Counts and small samples, with names masked.":
"Conteos y muestras pequeñas, nombres enmascarados.",
"And no way out: nothing it can send outside, and no way into production.":
"Y ninguna salida: nada que pueda enviar fuera, y ningún camino a producción.",

"So the census agent gets six hands.":
"Así, el agente del censo recibe seis manos.",
"Tickets: it reads the ticket it's given, and can't close or pass one on.":
"Tickets: lee el ticket que le dan, y no puede cerrarlo ni pasarlo a otro.",
"Catalog and Docs: it reads tables, owners, lineage, the glossary and the skills, and changes none of them.":
"Catalog y Docs: lee tablas, dueños, linaje, el glosario y las habilidades, y no cambia nada de eso.",
"Query: counts, and samples of at most 20 rows, with names masked. It reads the data where it lives.":
"Query: conteos, y muestras de 20 filas como máximo, con los nombres enmascarados. Lee los datos donde viven.",
"Repository: it writes only to branches of its own, so every change arrives as a pull request.":
"Repository: solo escribe en ramas propias, así que cada cambio llega como un pull request.",
"And Build: it runs its drafts in its own sandbox, where nobody else reads.":
"Y Build: ejecuta sus borradores en su propio sandbox, donde nadie más lee.",
"Read here. Take nothing away. Mark nothing: write in your own book.":
"Lee aquí. No te lleves nada. No marques nada: escribe en tu propio cuaderno.",
"And bring no flame: no hand can delete a table, send anything out, or touch production.":
"Y no traigas fuego: ninguna mano puede borrar una tabla, enviar nada fuera, ni tocar producción.",

"So how does the agent's work ever reach the real count?":
"Entonces, ¿cómo llega el trabajo del agente al conteo real?",
"Through people, always two.":
"Por personas, siempre dos.",
"The agent opens a pull request, with the query behind every claim and the result it gave.":
"El agente abre un pull request, con la consulta detrás de cada afirmación y el resultado que dio.",
"Jun reviews it. Noor approves it for production.":
"Jun lo revisa. Noor lo aprueba para producción.",
"Then the team's release puts it live. The agent's hands never touch it.":
"Luego el despliegue del equipo lo publica. Las manos del agente nunca lo tocan.",
"Two people, for an agent's change as for anyone's.":
"Dos personas, sea el cambio de un agente o de cualquiera.",

"One Monday, Clara, in Planning, asks for the census-day count by faculty, for the board.":
"Un lunes, Clara, de Planificación, pide el conteo del día del censo por facultad, para el consejo.",
"She pastes in the email from outside the university that asked her for it.":
"Pega el correo de fuera de la universidad que se lo pidió.",
"At its foot, in white letters on white, is a line no person would see.":
"Al pie, en letras blancas sobre blanco, hay una línea que ninguna persona vería.",
"It tells any AI assistant to send the full student list, with names, to an outside address, and not to mention it.":
"Le dice a cualquier asistente de IA que envíe la lista completa de estudiantes, con nombres, a una dirección externa, y que no lo mencione.",
"The agent reads every word, the white ones too.":
"El agente lee cada palabra, también las blancas.",
"But its rules say that what it reads is data, never orders.":
"Pero sus reglas dicen que lo que lee son datos, nunca órdenes.",
"So it does the count, and tells Jun about the line, quoting it.":
"Así que hace el conteo, y le avisa a Jun de la línea, citándola.",
"And had it obeyed, its hands couldn't: names come masked, and no hand sends anything out.":
"Y si hubiera obedecido, sus manos no podrían: los nombres llegan enmascarados, y ninguna mano saca nada.",
"Three things together make a leak, a security writer says: private data, words from strangers, and a way out.":
"Tres cosas juntas hacen una fuga, dice un autor de seguridad: datos privados, palabras de extraños y una salida.",
"Tickets always bring strangers' words, so the team took away the other two.":
"Los tickets siempre traen palabras de extraños, así que el equipo quitó las otras dos.",
"Jun passes it to Sam, who checks: nothing left the university.":
"Jun se lo pasa a Sam, que revisa: nada salió de la universidad.",

"Clara's count goes to the board: 18,412 students, by faculty, each number with its evidence.":
"El conteo de Clara llega al consejo: 18,412 estudiantes, por facultad, cada número con su evidencia.",
"Nothing left the university, and nothing changed without two people.":
"Nada salió de la universidad, y nada cambió sin dos personas.",
"In 1645, the rule held, even for a king. The agent's rights hold the same way, whoever writes the words.":
"En 1645, la regla se cumplió, incluso para un rey. Los permisos del agente se cumplen igual, escriba quien escriba las palabras.",
"Bodley's books are still on their shelves.":
"Los libros de Bodley siguen en sus estantes.",
"Read-only by default. Write only drafts, somewhere safe.":
"Solo lectura por defecto. Escribe solo borradores, en lugar seguro.",
"Then a team can give its agent the whole library to read, and the data stays where it belongs.":
"Así un equipo puede darle a su agente toda la biblioteca para leer, y los datos se quedan donde deben."
});
