/* What an agent may read: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words, as in the series' films before it: Babilonia, la torre-templo, la empresa for the utility, el chat del sitio web, un agente, un responsable for an
   owner, quien dirige comercialización for the head of retail, Farah "la defensora de los clientes", Ama "la responsable regulatoria", Inés "la nueva
   arquitecta de datos", la práctica de datos, el ticket, el pull request, en pruebas for in test, una entidad de servicio for a service principal; and, new
   here, Uruk, Borsippa, Etemenanki, una tablilla, el escriba, cotejar for checking a copy against its original (comprobar for data), los iniciados, los
   codos (cubits), una exportación, el centro de atención for the contact centre, las necesidades médicas, el titular de la cuenta (the glossary's account
   holder), un producto de datos, un nivel (público, interno, confidencial, restringido), una máscara, el lugar propio del chat (its place of its own), el
   inicio de sesión, la pequeña herramienta and "pásalo a una persona ya" for its one answer, un esquema, un índice de búsqueda, una función. Numbers as
   the series writes them: 229 a. C., 180 codos, 91,5 metros, 41,000 preguntas. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Uruk, in the south of Babylonia, December 229 BCE.":"Uruk, en el sur de Babilonia, diciembre de 229 a. C.",
"A scribe is copying a tablet that gives the measures of Babylon's temple-tower, Etemenanki, stage by stage.":"Un escriba copia una tablilla con las medidas de la torre-templo de Babilonia, Etemenanki, piso por piso.",
"His original is a tablet from Borsippa, a city near Babylon.":"Su original es una tablilla de Borsippa, una ciudad cerca de Babilonia.",
"Every copy was made by hand, and every hand could slip.":"Cada copia se hacía a mano, y cada mano podía equivocarse.",
"A copy of a copy carried every slip before it: one wrong number, and the tower's measures were wrong for everyone who read them after.":"Una copia de una copia arrastraba cada error anterior: un número mal, y las medidas de la torre quedaban mal para todo el que las leyera.",
"And this was learning kept for the initiated, the scholars trained to read it, not for every eye.":"Y era un saber guardado para los iniciados, los eruditos formados para leerlo, no para cualquier ojo.",
"A reader had to know where a copy came from, that it had been checked, and who it was meant for.":"Quien leía tenía que saber de dónde venía una copia, que se había cotejado, y para quién era.",
"So the scribe copies the tablet from Borsippa, and checks his copy against it.":"Así que el escriba copia la tablilla de Borsippa, y coteja su copia con ella.",
"At its end, he writes where it came from, and that it was copied and checked.":"Al final, escribe de dónde venía, y que fue copiada y cotejada.",
"And he writes who may read it: \"May the initiate instruct the initiate. The uninitiate must not see.\"":"Y escribe quién puede leerla: «Que el iniciado instruya al iniciado. El no iniciado no debe verla».",
"His tablet came down to us, and it still tells its reader how far to trust it.":"Su tablilla llegó hasta nosotros, y aún le dice a quien la lee cuánto confiar en ella.",
"The base it gives, 180 cubits, about 90 metres a side, is close to what archaeologists measured in the ground: 91.5 metres.":"La base que da, 180 codos, unos 90 metros por lado, se acerca a lo que los arqueólogos midieron en el suelo: 91,5 metros.",
"At the energy utility today, the website's chat answers households: their bills, their prices, and planned work in their street.":"Hoy, en la empresa de energía, el chat del sitio web responde a los hogares: sus facturas, sus precios y los trabajos en su calle.",
"What it says depends on what it reads.":"Lo que dice depende de lo que lee.",
"Like the scribe's tablet, what it reads should come from the original, checked, and say who may read it.":"Como la tablilla del escriba, lo que lee debería venir del original, comprobado, y decir quién puede leerlo.",
"Farah, the customer advocate, brings Tomás two complaints about the chat.":"Farah, la defensora de los clientes, le trae a Tomás dos quejas sobre el chat.",
"A household was quoted last year's price, and planned its winter by it.":"A un hogar le dieron el precio del año pasado, y planeó su invierno con él.",
"And a caller who wasn't the account holder was told that someone in the home needs power for medical equipment.":"Y a alguien que llamó sin ser el titular de la cuenta le dijeron que en esa casa alguien necesita luz para un equipo médico.",
"The chat's first version read whatever it could reach.":"La primera versión del chat leía todo lo que alcanzaba.",
"Its prices came from an export on a shared drive: a copy of a copy, which nobody kept up to date.":"Sus precios salían de una exportación en una carpeta compartida: una copia de una copia, que nadie actualizaba.",
"And it read the contact centre's notes, where people's medical needs are written down.":"Y leía las notas del centro de atención, donde se anotan las necesidades médicas de las personas.",
"One family planned on a price that had changed; another's medical needs reached a stranger, and Ama, the regulatory lead, reported a breach.":"Una familia planeó con un precio ya cambiado; las necesidades médicas de otra llegaron a un extraño, y Ama, responsable regulatoria, reportó una brecha.",
"An agent that answers the public has to read the official figures, and only what it's meant to read.":"Un agente que responde al público tiene que leer las cifras oficiales, y solo lo que le toca leer.",
"Inés Duarte, the utility's new data architect, takes it on with Tomás.":"Inés Duarte, la nueva arquitecta de datos de la empresa, lo asume con Tomás.",
"She draws the chat's context, what it reads to answer, from the data practice on Tomás's map.":"Toma el contexto del chat, lo que lee para responder, de la práctica de datos en el mapa de Tomás.",
"The map shows the data products it needs: tariffs, planned work by street, help pages, and a household's account.":"El mapa muestra los productos de datos que necesita: tarifas, trabajos programados por calle, páginas de ayuda y la cuenta de un hogar.",
"Each is kept by its own team, with a contract: what it holds, how fresh it is, and who owns it.":"Cada uno lo lleva su propio equipo, con un contrato: qué contiene, qué tan al día está y quién responde por él.",
"And the glossary's terms come with them, so \"account holder\" means to the chat what it means to the utility.":"Y los términos del glosario vienen con ellos: «titular de la cuenta» significa para el chat lo mismo que para la empresa.",
"The chat reads those products, and nothing else: no exports, no copies of copies.":"El chat lee esos productos, y nada más: ni exportaciones, ni copias de copias.",
"When prices change, the tariffs product changes that day, and so does the chat's answer.":"Cuando cambian los precios, el producto de tarifas cambia ese día, y también la respuesta del chat.",
"Each product on the map also has a level: public, internal, confidential or restricted.":"Cada producto del mapa tiene además un nivel: público, interno, confidencial o restringido.",
"The chat may read public and internal ones.":"El chat puede leer los públicos y los internos.",
"Restricted ones, like people's medical needs, it never reads.":"Los restringidos, como las necesidades médicas, nunca los lee.",
"Inés doesn't leave them in reach behind a mask, where one wrong rule would let them through.":"Inés no los deja a su alcance tras una máscara, donde una regla equivocada los dejaría pasar.",
"She gives the chat a place of its own, holding only what it may read: what it may not read isn't there at all.":"Le da al chat un lugar propio, que solo tiene lo que puede leer: lo que no puede leer ni siquiera está ahí.",
"And the chat's own identity can reach that place, and nothing else.":"Y la identidad propia del chat puede llegar a ese lugar, y a nada más.",
"A household's account is confidential, so it isn't there either.":"La cuenta de un hogar es confidencial, así que tampoco está ahí.",
"The chat reads one only on its holder's own sign-in, as the website does: theirs, and no one else's.":"El chat lee una solo cuando su titular inicia sesión, como hace el sitio web: la suya, y la de nadie más.",
"When planned work will cut a street's power, some homes must hear it from a person first.":"Si un trabajo programado cortará la luz de una calle, algunos hogares deben saberlo antes por una persona.",
"The chat can't tell which: that would mean reading medical needs.":"El chat no puede saber cuáles: eso sería leer necesidades médicas.",
"So the team that keeps the list offers it a small tool: given a signed-in household, it answers only \"hand this to a person now\", or not.":"Así que el equipo de la lista le ofrece una pequeña herramienta: dado un hogar que inició sesión, solo responde «pásalo a una persona ya», o no.",
"Never why: the person who calls them back sees why, and first checks who they're speaking to.":"Nunca el porqué: la persona que les devuelve la llamada ve el porqué, y primero comprueba con quién habla.",
"The chat hands over, and tells the household a person will call that day.":"El chat lo pasa, y le dice al hogar que una persona llamará ese mismo día.",
"The head of retail, who answers for the chat, asks for the change in a ticket.":"Quien dirige comercialización, que responde por el chat, pide el cambio en un ticket.",
"In the ticket, each product's owner agrees, as for any new reader: Grace for planned work, retail for tariffs and accounts.":"En el ticket, cada responsable acepta, como con todo lector nuevo: Grace por los trabajos programados, comercialización por tarifas y cuentas.",
"The data team builds the chat's place, and reviews the change in a pull request.":"El equipo de datos construye el lugar del chat, y revisa el cambio en un pull request.",
"Before the ticket closes, Ama checks, in test, that nothing restricted is in the chat's place.":"Antes de que se cierre el ticket, Ama comprueba, en pruebas, que no haya nada restringido en el lugar del chat.",
"On Databricks, the chat runs as an app with its own identity, a service principal.":"En Databricks, el chat funciona como una app con su propia identidad, una entidad de servicio.",
"Its place is one schema in Unity Catalog: it may select from the products there, and nothing else.":"Su lugar es un esquema en Unity Catalog: puede consultar los productos que hay ahí, y nada más.",
"Its help pages are in a search index it may read.":"Sus páginas de ayuda, en un índice de búsqueda que puede leer.",
"The small tool is a Unity Catalog function the chat may run. It reads only the list of homes to hand to a person, and answers yes or no.":"La pequeña herramienta es una función de Unity Catalog que el chat puede ejecutar. Solo lee la lista de hogares a derivar a una persona, y responde sí o no.",
"Databricks advises the same: one identity for each agent, granted only what it needs.":"Databricks aconseja lo mismo: una identidad para cada agente, con permiso solo para lo que necesita.",
"In Uruk, the scribe copied from the original, checked his copy, and wrote who may read it.":"En Uruk, el escriba copió del original, cotejó su copia, y escribió quién puede leerla.",
"At the utility, the chat reads the official products, kept up to date by their contracts, and only what it's meant to read.":"En la empresa, el chat lee los productos oficiales, al día por sus contratos, y solo lo que le toca leer.",
"In the three months since, it has answered 41,000 questions about prices, every one from this year's tariffs.":"En los tres meses desde entonces, ha respondido 41,000 preguntas sobre precios, todas con las tarifas de este año.",
"And no caller has heard about any household but their own.":"Y nadie que llamó ha sabido de otro hogar que no sea el suyo.",
"An agent's context belongs on the map: the products it may read, with contracts and terms, in a place of its own, under its own identity.":"El contexto de un agente va en el mapa: los productos que puede leer, con contratos y términos, en un lugar propio, con su propia identidad.",
"Next: a first draft, not a blank page.":"Luego: un primer borrador, no una página en blanco."
});
