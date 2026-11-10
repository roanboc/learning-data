/* Scripts became software: Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's other Spanish captions: RR. HH., el personal eventual, Finanzas, el proyecto de datos, una prueba for a test, una rama for a branch,
   producción, la plataforma. New here: la exportación de nómina for payroll's export, una solicitud (de pago) for a claim, la app de solicitudes for the
   claims app, las planillas for the faculties' spreadsheets, el portátil for a laptop (as the series' page says it), el día de pago, el trabajo for a job,
   desplegar for deploy, el tablero (of a bridge), una maqueta for a model in a wind tunnel. Film and series
   titles stay in English, as the site and the picture show them, in «». The wind is given in km/h, with the narration's 40 mph beside it, as the picture does. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Washington State, the 1st of July 1940.":
"Estado de Washington, 1 de julio de 1940.",
"A new bridge opens across the Tacoma Narrows, its road hung from two great cables: a suspension bridge.":
"Se inaugura un puente nuevo sobre el estrecho de Tacoma, con la calzada colgada de dos grandes cables: un puente colgante.",
"Its deck, the road itself, is light and slender, built to the best theory of its day.":
"Su tablero, la calzada misma, es liviano y esbelto, hecho con la mejor teoría de su época.",
"From the first day, the deck rises and falls in the wind, and people call it Galloping Gertie.":
"Desde el primer día, el tablero sube y baja con el viento, y la gente lo llama Galloping Gertie.",
"Nobody had tested how wind would move a deck like it.":
"Nadie había probado cómo movería el viento un tablero así.",
"On the 7th of November, a wind of about 40 miles an hour sets it twisting, until its middle tears away and falls into the water.":
"El 7 de noviembre, un viento de unos 64 km/h (40 mph) lo hace torcerse, hasta que el tramo central se desprende y cae al agua.",
"No one is killed, but the only road across the Narrows is gone for ten years. Something had to change.":
"No muere nadie, pero la única vía para cruzar el estrecho desaparece por diez años. Algo tenía que cambiar.",
"The engineers who looked into it said such bridges must first be tested as models in a wind tunnel, where a fan blows a steady wind.":
"Los ingenieros que lo estudiaron dijeron que esos puentes debían probarse antes como maquetas en un túnel de viento, con viento constante.",
"At the University of Washington, Frederick Farquharson tests models for years.":
"En la Universidad de Washington, Frederick Farquharson prueba maquetas durante años.",
"The tests find a deck the wind can't twist: deeper, stiffer, and open to let the wind through.":
"Las pruebas dan con un tablero que el viento no tuerce: más alto, más rígido y abierto para que el viento pase.",
"The new bridge opens in 1950, tested before it was built, and it has carried traffic for 76 years.":
"El puente nuevo se inaugura en 1950, probado antes de construirse, y lleva 76 años con tránsito.",
"Wind tunnels weren't new: wings had been tested in them since the Wright brothers. Bridges took up a practice from next door.":
"Los túneles de viento no eran nuevos: se probaban alas en ellos desde los hermanos Wright. Los puentes adoptaron una práctica vecina.",
"Data work did the same, and took up how software is made.":
"El trabajo con datos hizo lo mismo: adoptó cómo se hace el software.",
"At the university, payroll's export to Finance ran for years as a script on one person's laptop.":
"En la universidad, la exportación de nómina a Finanzas corrió por años como un script en el portátil de una persona.",
"Now it's software: tested before every change, reviewed by someone else, and released the same way every time.":
"Ahora es software: probado antes de cada cambio, revisado por otra persona y publicado siempre de la misma forma.",
"Thursday, the 5th of November 2026: pay day at the university.":
"Jueves 5 de noviembre de 2026: día de pago en la universidad.",
"Every second Thursday, Rohan Desai in Finance needs to know what casual staff are paid that day, by faculty and unit.":
"Cada dos jueves, Rohan Desai, de Finanzas, necesita saber cuánto cobra ese día el personal eventual, por facultad y unidad.",
"For years, a script on one person's laptop told him.":
"Durante años, se lo dijo un script en el portátil de una persona.",
"Before six on each pay day, someone ran it by hand, and emailed its file to Finance.":
"Antes de las seis de cada día de pago, alguien lo corría a mano y enviaba el archivo a Finanzas por correo.",
"Payroll's rule was inside it: a claim approved by noon on the Monday before is paid that Thursday; approved later, it waits two weeks.":
"Adentro estaba la regla de nómina: una solicitud aprobada antes del mediodía del lunes previo se paga ese jueves; si no, espera dos semanas.",
"It worked, and nobody is to blame. Its author moved to another team, and it kept running.":
"Funcionaba, y nadie tiene la culpa. Su autor se pasó a otro equipo, y el script siguió corriendo.",
"Then in February, the claims moved into the claims app, and the spreadsheets it read stopped coming.":
"Luego, en febrero, las solicitudes pasaron a la app de solicitudes, y las planillas que leía dejaron de llegar.",
"One copy, no history of why, and no test to say if a change broke it: nobody could change it safely.":
"Una sola copia, sin historial de por qué y sin pruebas que dijeran si un cambio lo rompía: nadie podía tocarlo sin riesgo.",
"Sam Okafor, who runs the platform, and Jun Park moved it into the data project.":
"Sam Okafor, que administra la plataforma, y Jun Park lo pasaron al proyecto de datos.",
"First into Git, beside the models, where every change is kept, with who made it and why.":
"Primero a Git, junto a los modelos, donde se guarda cada cambio, con quién lo hizo y por qué.",
"Its sums became a model in dbt, and the rule is written once, on HR's calendar of pay days.":
"Sus sumas pasaron a un modelo en dbt, y la regla se escribe una vez, en el calendario de días de pago de RR. HH.",
"Ingrid Holm in HR confirmed the rule, and a change to the pay days now asks HR to review it.":
"Ingrid Holm, de RR. HH., confirmó la regla, y ahora un cambio en los días de pago pide que RR. HH. lo revise.",
"Jun wrote the tests first, at the rule's edge: approved at 11:59 on the Monday, a claim is paid that Thursday; at 12:01, two weeks later.":
"Jun escribió primero las pruebas, al límite de la regla: aprobada el lunes a las 11:59, se paga ese jueves; a las 12:01, en dos semanas.",
"In the weeds of data crafting shows how, in Declare it, then build it, Promises and proofs, and Built in layers.":
"«In the weeds of data crafting» muestra cómo, en «Declare it, then build it», «Promises and proofs» y «Built in layers».",
"Each change goes on a branch, and comes back as a pull request, with checks that build it and run every test.":
"Cada cambio va en una rama y vuelve como pull request, con verificaciones que lo construyen y corren todas las pruebas.",
"Then someone other than its author reviews it.":
"Luego lo revisa alguien que no es su autor.",
"Jun wrote the model, so Sam reviewed it; Sam wrote the job, so Jun reviewed that.":
"Jun escribió el modelo, así que lo revisó Sam; Sam escribió el trabajo, así que lo revisó Jun.",
"Nothing merges without that review, and every check green.":
"Nada se fusiona sin esa revisión y todas las verificaciones en verde.",
"Change without surprises shows how a change reaches the people it touches.":
"«Change without surprises» muestra cómo un cambio llega a las personas a las que afecta.",
"And it holds when an agent writes the change: the agent proposes, and a person approves.":
"Y vale también cuando un agente escribe el cambio: el agente propone y una persona aprueba.",
"How it runs is a file too: a Declarative Automation Bundle lists the project's jobs, and where each one runs.":
"Cómo corre también es un archivo: un Declarative Automation Bundle lista los trabajos del proyecto y dónde corre cada uno.",
"Payroll's export runs at six every Thursday, and builds and tests everything it reads.":
"La exportación de nómina corre a las seis cada jueves, y construye y prueba todo lo que lee.",
"Once a change is merged, the same files are deployed to test, and the job runs there first.":
"Cuando se fusiona un cambio, los mismos archivos se despliegan en test, y el trabajo corre ahí primero.",
"Then the release waits for Noor, the data architect. When she approves, the same files go to production.":
"Luego la versión espera a Noor, la arquitecta de datos. Cuando aprueba, los mismos archivos pasan a producción.",
"It runs as the platform's own account, never a person's: nobody deploys from a laptop.":
"Corre con la cuenta propia de la plataforma, nunca con la de una persona: nadie despliega desde un portátil.",
"The same files, the same steps, every time, so test and production can't drift apart.":
"Los mismos archivos, los mismos pasos, cada vez, para que test y producción no se desvíen.",
"This morning at six, it ran for the eighteenth time, and 856 casual staff are paid today.":
"Esta mañana a las seis corrió por decimoctava vez, y hoy cobran 856 personas del personal eventual.",
"None of this is new: software has been built this way for decades, and data work took it up, as bridges took up the wind tunnel.":
"Nada de esto es nuevo: el software se hace así hace décadas, y el trabajo con datos lo adoptó, como los puentes el túnel de viento.",
"So keep data work as software: in Git, tested, reviewed by someone else, and deployed the same way every time.":
"Así que trata el trabajo con datos como software: en Git, probado, revisado por otra persona y desplegado siempre igual.",
"The next film, A platform that watches itself, follows a night when a job fails.":
"La próxima película, «A platform that watches itself», sigue una noche en la que falla un trabajo.",
"There are already standards for this, so don't reinvent the wheel.":
"Ya hay estándares para esto, así que no reinventes la rueda.",
"Investigate, adapt, implement and iterate, starting from the official docs.":
"Investiga, adapta, implementa e itera, a partir de la documentación oficial.",
"The bridge of 1950 was tested before it was built, and it still stands.":
"El puente de 1950 se probó antes de construirse, y sigue en pie.",
"Payroll's export is tested before every change, and pay day is just another Thursday.":
"La exportación de nómina se prueba antes de cada cambio, y el día de pago es un jueves más.",
"Data work is software.":
"El trabajo con datos es software."
});
