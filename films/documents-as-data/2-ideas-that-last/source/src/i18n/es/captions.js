/* Ideas that last, features you test: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's pages and the earlier films: Finanzas, el proyecto de datos, el equipo de datos, un caso de uso, las facturas de proveedores. New here:
   un pie artificial, una prótesis for a limb, ponerse en cuclillas for squat, curado como un neumático for rubber cured like a tyre; investigar, adaptar, implementar, iterar for the loop's four steps; un sandbox, un ticket. The series by their Spanish titles:
   Datos que se mueven, Datos como software, De las tablas a las decisiones, Documentos y comentarios finales. Numbers as on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Jaipur, India, in the 1960s. At the city's hospital, the Sawai Man Singh, people came in who had lost a leg.":
"Jaipur, India, en los años sesenta. Al hospital de la ciudad, el Sawai Man Singh, llegaban personas que habían perdido una pierna.",
"The hospital could fit them with an artificial foot, made to a design from abroad.":
"El hospital podía ponerles un pie artificial, hecho con un diseño del extranjero.",
"It had to be worn in a shoe. But many of them walked barefoot, in fields that were often under water.":
"Había que usarlo con zapato. Pero muchos andaban descalzos, en campos que a menudo estaban bajo el agua.",
"And it was heavy and stiff: on it, nobody could squat, or sit on the floor, as people did to eat, to talk and to work.":
"Y era pesado y rígido: con él, nadie podía ponerse en cuclillas, ni sentarse en el suelo, como se hacía para comer, conversar y trabajar.",
"So people who lived barefoot gave it up, and with it, the work a foot would have let them do.":
"Así que quienes vivían descalzos lo dejaban, y con él, el trabajo que un pie les habría permitido hacer.",
"They needed a foot for the life they lived, not for a shoe.":
"Necesitaban un pie para la vida que llevaban, no para un zapato.",
"Pramod Karan Sethi, the head of orthopaedics, worked with Ram Chandra Sharma, a craftsman who shaped aluminium.":
"Pramod Karan Sethi, jefe de ortopedia, trabajó con Ram Chandra Sharma, un artesano que trabajaba el aluminio.",
"Sharma made feet of wood and rubber, cured like a tyre, and Sethi fitted them on patients.":
"Sharma hacía pies de madera y caucho, curado como un neumático, y Sethi los probaba en pacientes.",
"Each patient walked on it, squatted, sat on the floor, and said where it hurt. Then they changed it, and tried again.":
"Cada paciente caminaba con él, se ponía en cuclillas, se sentaba en el suelo y decía dónde dolía. Luego lo cambiaban, y volvían a probar.",
"By the end of the 1960s, they had a foot that looked and bent like a bare one.":
"Al final de los años sesenta, tenían un pie que parecía y se doblaba como uno descalzo.",
"On it, people walked barefoot, squatted, sat cross-legged, worked in wet fields, and even climbed trees.":
"Con él, la gente andaba descalza, se ponía en cuclillas, se sentaba cruzada de piernas, trabajaba en campos mojados y hasta trepaba árboles.",
"It could be made in about an hour, for far less than a foot from abroad.":
"Se podía hacer en cerca de una hora, por mucho menos que un pie del extranjero.",
"From 1975, a society in Jaipur has fitted it free: more than 700,000 limbs so far, in India and in forty-four other countries.":
"Desde 1975, una sociedad de Jaipur lo pone gratis: más de 700.000 prótesis hasta hoy, en India y en otros cuarenta y cuatro países.",
"And the foot kept changing: plastics took over from wood and aluminium, while the first question stayed: how does this person live?":
"Y el pie siguió cambiando: los plásticos reemplazaron a la madera y al aluminio, y la primera pregunta quedó: ¿cómo vive esta persona?",
"Data platforms change too, every month. What lasts is the ideas, and a quick, honest way to test what's new.":
"Las plataformas de datos también cambian, cada mes. Lo que perdura son las ideas, y una forma rápida y honesta de probar lo nuevo.",
"This topic walked the university's platform, from where data is born to who reads it.":
"Este tema recorrió la plataforma de la universidad, desde donde nacen los datos hasta quién los lee.",
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
"It's the workshop in Jaipur again: the sooner you try it on a real need, the sooner you learn where it hurts.":
"Es otra vez el taller de Jaipur: cuanto antes lo pruebas en una necesidad real, antes sabes dónde duele.",
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
"The rubber feet of the 1960s are long gone. The method, start from how people live and try it on them, is still how the foot is made.":
"Los pies de caucho de los sesenta ya no existen. El método, partir de cómo vive la gente y probarlo con ella, sigue siendo cómo se hace.",
"So keep the ideas, and test the features: small, soon, and on a real need.":
"Así que guarda las ideas, y prueba las funciones: en pequeño, pronto y sobre una necesidad real.",
"That closes this topic: moving data, running the platform, serving it to people and agents, and reading documents.":
"Con esto cierra el tema: mover datos, operar la plataforma, servirlos a personas y agentes, y leer documentos.",
"Each once took a whole team. Databricks and dbt now do much of it; what's left for people is agreeing what the data means.":
"Cada cosa requería antes todo un equipo. Databricks y dbt hacen hoy gran parte; a las personas les queda acordar qué significan los datos.",
"Start from the official docs. Investigate, adapt, implement, iterate, and keep going.":
"Empieza por la documentación oficial. Investiga, adapta, implementa, itera, y sigue adelante."
});
