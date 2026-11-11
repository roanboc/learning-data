/* Ideas that last, features you test: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's pages and the earlier films: Finanzas, el proyecto de datos, el equipo de datos, un caso de uso, las facturas de proveedores. New here:
   la roya del tallo for stem rust, el fitomejorador for a plant breeder, la Secretaría de Agricultura for Mexico's Ministry of Agriculture (its name in 1945),
   bushels por acre as on screen; investigar, adaptar, implementar, iterar for the loop's four steps; un sandbox, un ticket. The series by their Spanish titles:
   Datos que se mueven, Datos como software, De las tablas a las decisiones, Documentos y comentarios finales. Numbers as on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Mexico, 1944. In the Yaqui Valley of Sonora, in the north, farmers hardly grew wheat any more.":
"México, 1944. En el valle del Yaqui, en Sonora, en el norte, los agricultores casi ya no sembraban trigo.",
"Stem rust, a fungus that chokes the plant, could ruin a whole field of wheat at once.":
"La roya del tallo, un hongo que asfixia la planta, podía arruinar todo un campo de trigo de una vez.",
"One field there that year was expected to give only ten bushels an acre: a poor harvest for a season's work.":
"Ese año, de un campo de allí se esperaban solo diez bushels por acre: una cosecha pobre para una temporada de trabajo.",
"For a farmer, a ruined field meant a year's work and seed lost, and Mexico bought wheat from abroad for its bread.":
"Para un agricultor, un campo arruinado era un año de trabajo y de semilla perdido, y México compraba trigo afuera para su pan.",
"And breeding a wheat that resisted the rust was slow: one generation a year, and many years before it reached a farm.":
"Y criar un trigo que resistiera la roya era lento: una generación al año, y muchos años antes de llegar a una granja.",
"Farmers couldn't wait a decade for every new wheat.":
"Los agricultores no podían esperar una década por cada trigo nuevo.",
"From 1945, a wheat program of Mexico's Ministry of Agriculture, with the plant breeder Norman Borlaug, tried another way.":
"Desde 1945, un programa de trigo de la Secretaría de Agricultura de México, con el fitomejorador Norman Borlaug, probó otro camino.",
"They grew two generations a year: one in summer, in the highlands near Mexico City, and one in winter, in Sonora, far to the north.":
"Sembraron dos generaciones al año: una en verano, en las tierras altas cerca de Ciudad de México, y otra en invierno, en Sonora, al norte.",
"Each season, they crossed plants, tested them in the field, kept the few that did best, and sowed those in the other place.":
"Cada temporada cruzaban plantas, las probaban en el campo, guardaban las pocas mejores y las sembraban en el otro lugar.",
"Many breeders said a wheat should be bred only where it would grow. The team tried it anyway, and measured.":
"Muchos fitomejoradores decían que un trigo solo debía criarse donde iba a crecer. El equipo lo probó igual, y midió.",
"It cut the time to breed a new wheat in half, and the new wheats grew well in both places, and far beyond.":
"Redujo a la mitad el tiempo para criar un trigo nuevo, y los trigos nuevos crecieron bien en ambos lugares, y mucho más allá.",
"By 1956, Mexico grew all the wheat it needed. In the program's first twenty years, its harvest tripled.":
"Para 1956, México cultivaba todo el trigo que necesitaba. En los primeros veinte años del programa, su cosecha se triplicó.",
"And the testing never stopped: the rust kept changing, so the wheat had to change too.":
"Y las pruebas nunca pararon: la roya seguía cambiando, así que el trigo también tenía que cambiar.",
"Data platforms change too, every month. What lasts is the ideas, and a quick, honest way to test what's new.":
"Las plataformas de datos también cambian, cada mes. Lo que perdura son las ideas, y una forma rápida y honesta de probar lo nuevo.",
"This module walked the university's platform, from where data is born to who reads it.":
"Este módulo recorrió la plataforma de la universidad, desde donde nacen los datos hasta quién los lee.",
"In Data that moves, moving data was easy, and agreeing what each field means was the work.":
"En Datos que se mueven, mover datos era fácil, y acordar qué significa cada campo era el trabajo.",
"How fresh data must be came from when someone acts on it, and most analysis was fine a day old.":
"Qué tan frescos deben ser los datos dependía de cuándo alguien actúa con ellos, y casi todo análisis aguantaba un día.",
"And each claim was written once, on one platform, for everyone to read.":
"Y cada solicitud se escribía una vez, en una plataforma, para que todos la leyeran.",
"In Data as software, scripts became software: tested, reviewed by the data team, and released the same way every time.":
"En Datos como software, los scripts se volvieron software: probados, revisados por el equipo de datos y publicados siempre igual.",
"And the platform watched itself, while a person decided what to change.":
"Y la plataforma se vigilaba sola, mientras una persona decidía qué cambiar.",
"In From tables to decisions, answers came on demand, and each measure was defined in the open, as each part of the business means it.":
"En De las tablas a las decisiones, las respuestas llegaban a pedido, y cada medida se definía a la vista, como la entiende cada área.",
"And every reader, a person or an agent, read those definitions as itself.":
"Y cada lector, persona o agente, leía esas definiciones como sí mismo.",
"And here, in Documents and closing remarks, each document was read, kept, or written as data.":
"Y aquí, en Documentos y comentarios finales, cada documento se leyó, se guardó o se escribió como datos.",
"Each idea is older than the tools that showed it.":
"Cada idea es más vieja que las herramientas que la mostraron.",
"The tools change fast: new features every month, new names, new limits.":
"Las herramientas cambian rápido: funciones nuevas cada mes, nombres nuevos, límites nuevos.",
"A film that taught every button would be out of date within months.":
"Una película que enseñara cada botón quedaría vieja en pocos meses.",
"So these films stay with what changes slowly: agree what data means, test it, govern it, and serve it when the business acts.":
"Así, estas películas tratan lo que cambia despacio: acordar qué significan los datos, probarlos, gobernarlos y servirlos cuando se actúa.",
"For the how, go to the source: each tool's official documentation and training, kept up to date by the people who build it.":
"Para el cómo, ve a la fuente: la documentación y la formación oficiales de cada herramienta, al día gracias a quienes la construyen.",
"Not on Databricks? The ideas still hold. Check what your own platform offers for each one: most have an answer, under another name.":
"¿No usas Databricks? Las ideas siguen valiendo. Revisa qué ofrece tu plataforma para cada una: casi todas tienen respuesta, con otro nombre.",
"Don't choose a feature because it's new, or a platform because a film showed it. Choose what answers a real need.":
"No elijas una función porque es nueva, ni una plataforma porque la mostró una película. Elige lo que responde a una necesidad real.",
"So how do you keep up? With a loop, small and quick: investigate, adapt, implement, iterate.":
"¿Y cómo mantenerse al día? Con un ciclo, pequeño y rápido: investigar, adaptar, implementar, iterar.",
"It's the breeders' two seasons again: the shorter the loop, the more you learn in the same time.":
"Son otra vez las dos temporadas de los fitomejoradores: cuanto más corto el ciclo, más aprendes en el mismo tiempo.",
"Investigate starts from a real need, not from the feature. Rohan's team typed every invoice by hand, and asked for a better way in a ticket.":
"Investigar parte de una necesidad real, no de la función. El equipo de Rohan ingresaba cada factura a mano, y pidió algo mejor en un ticket.",
"Jun read the official docs on the functions that read documents: what they do, what they cost, and where they stop.":
"Jun leyó la documentación oficial de las funciones que leen documentos: qué hacen, cuánto cuestan y dónde se detienen.",
"Adapt means trying it small, on your own data, in a sandbox, for a set time: two days, on 200 of September's invoices.":
"Adaptar es probarlo en pequeño, con tus datos, en un sandbox, por un tiempo fijo: dos días, con 200 facturas de septiembre.",
"Jun compared what the functions read with what Finance had typed: 188 of the 200 matched, and most of the 12 that didn't were poor scans.":
"Jun comparó lo leído por las funciones con lo que Finanzas ingresó: 188 de 200 coincidían, y casi todas las otras 12 eran malos escaneos.",
"Two days told the team what months of guessing couldn't: where it works, and where it doesn't.":
"Dos días le dijeron al equipo lo que meses de suposiciones no podían: dónde funciona y dónde no.",
"Implement means one use case, done properly: in the data project, with its tests, and a way back.":
"Implementar es un caso de uso, bien hecho: en el proyecto de datos, con sus pruebas y una forma de volver atrás.",
"The data team reviewed the change. Then Rohan's team checked October's results, and only then was the ticket closed.":
"El equipo de datos revisó el cambio. Luego el equipo de Rohan revisó los resultados de octubre, y solo entonces se cerró el ticket.",
"Iterate means watching what happens, and trying again: each month, the team looks at what went to a person, and why.":
"Iterar es observar qué pasa, y volver a probar: cada mes, el equipo mira qué fue a una persona, y por qué.",
"Not every trial ends in yes. They tried letting the model pick each invoice's cost centre.":
"No toda prueba termina en sí. Probaron que el modelo eligiera el centro de costos de cada factura.",
"But Finance's supplier list already gave it, so they dropped it.":
"Pero la lista de proveedores de Finanzas ya lo daba, así que lo dejaron.",
"A trial that ends in no costs two days, not a year.":
"Una prueba que termina en no cuesta dos días, no un año.",
"The wheats of the 1950s are long gone from the fields. The method, two places and two seasons, is still used by wheat breeders today.":
"Los trigos de los años cincuenta ya no están en los campos. El método, dos lugares y dos temporadas, lo siguen usando hoy.",
"So keep the ideas, and test the features: small, soon, and on a real need.":
"Así que guarda las ideas, y prueba las funciones: en pequeño, pronto y sobre una necesidad real.",
"That closes this module: moving data, running the platform, serving it to people and agents, and reading documents.":
"Con esto cierra el módulo: mover datos, operar la plataforma, servirlos a personas y agentes, y leer documentos.",
"Each once took a whole team. Databricks and dbt now do much of it; what's left for people is agreeing what the data means.":
"Cada cosa requería antes todo un equipo. Databricks y dbt hacen hoy gran parte; a las personas les queda acordar qué significan los datos.",
"Start from the official docs. Investigate, adapt, implement, iterate, and keep going.":
"Empieza por la documentación oficial. Investiga, adapta, implementa, itera, y sigue adelante."
});
