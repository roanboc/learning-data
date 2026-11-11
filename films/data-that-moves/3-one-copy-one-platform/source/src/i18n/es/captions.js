/* One copy, one platform: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series' page and the module's other captions: Nómina (the team) and la nómina (a pay run), Finanzas, RR. HH., el día de pago, la docencia ocasional,
   una declaración de horas for a casual claim (las declaraciones), una planilla for a spreadsheet, una segunda forma for a second form; Noor is la arquitecta de datos, as on every page.
   In 1609: el libro for the bank's ledger, florines for guilders, letras de cambio for bills, el ayuntamiento for the town hall; the Wisselbank keeps its name.
   The platform's names stay as they are on screen: Lakebase, Postgres, the lakehouse, Unity Catalog, Databricks. Other films by their Spanish titles, in «»:
   «Las dos cosas a la vez», «Una plataforma que se vigila sola» and «Mover es fácil, acordar es el trabajo». Tú, as the film's last lines speak to the viewer.
   Numbers keep the picture's comma and point (1,000; 856), as the module's other Spanish captions do. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Amsterdam, around 1600.":
"Ámsterdam, hacia 1600.",
"Ships from all over Europe trade there, and merchants pay each other in coin.":
"Barcos de toda Europa comercian allí, y los mercaderes se pagan unos a otros en monedas.",
"Between 800 and 1,000 kinds of coin change hands, many clipped, shaved at the edge for their silver, or worn thin.":
"Circulan entre 800 y 1,000 tipos de moneda, muchas recortadas, limadas en el borde por su plata, o gastadas.",
"Every payment means weighing coins, and nobody knows what a bag of them is really worth.":
"Cada pago obliga a pesar monedas, y nadie sabe cuánto vale de verdad una bolsa de ellas.",
"On average, coin there is worth about 9% less than good coin: a merchant owed a thousand guilders may get coin worth about nine hundred.":
"En promedio, allí la moneda vale un 9% menos que la buena: a quien le deben mil florines le pagan en moneda que vale unos novecientos.",
"Payments are slow, disputed and risky. Amsterdam's trade needs money everyone can trust.":
"Los pagos son lentos, discutidos y riesgosos. El comercio de Ámsterdam necesita un dinero en el que todos confíen.",
"On the 31st of January 1609, the city opens an exchange bank, the Wisselbank, in its town hall.":
"El 31 de enero de 1609, la ciudad abre un banco de cambio, el Wisselbank, en su ayuntamiento.",
"Merchants bring their coin once. The bank weighs it, and writes its value in its ledger, on the merchant's own page.":
"Los mercaderes traen su moneda una sola vez. El banco la pesa y anota su valor en su libro, en la página del propio mercader.",
"From then on, a payment is a line moved from page to page, with no coin carried, and the ledger shows what each merchant holds.":
"Desde entonces, un pago es una línea que pasa de una página a otra, sin cargar monedas, y el libro muestra lo que tiene cada mercader.",
"Merchants pay about 5% more for a guilder in the ledger than for one in coin.":
"Los mercaderes pagan cerca de un 5% más por un florín del libro que por uno en monedas.",
"For over a century, bills from all over Europe are paid there.":
"Por más de un siglo, allí se pagan letras de cambio de toda Europa.",
"Data has its bags of coin too: the same data copied into every system that needs it, each copy a little different.":
"Los datos también tienen sus bolsas de monedas: los mismos datos copiados en cada sistema que los necesita, cada copia un poco distinta.",
"At the university, tutors' claims went round by email, and payroll and Finance each kept a copy that never quite agreed.":
"En la universidad, las declaraciones de horas iban por correo, y Nómina y Finanzas guardaban cada una su copia, que nunca cuadraba.",
"Now each claim is written once, and payroll and Finance read that one copy.":
"Ahora cada declaración se escribe una vez, y Nómina y Finanzas leen esa única copia.",
"Thursday, the 5th of November 2026: pay day at the university.":
"Jueves 5 de noviembre de 2026: día de pago en la universidad.",
"Linh Nguyen tutors HI101 on a casual contract, paid for the hours she claims.":
"Linh Nguyen es tutora de HI101 con un contrato ocasional, y cobra las horas que declara.",
"Claims used to be spreadsheets sent by email and typed again by payroll.":
"Antes, las declaraciones eran planillas enviadas por correo, que Nómina volvía a tipear.",
"The faculty kept its own tally, and Finance saw the hours only after pay day.":
"La facultad llevaba su propia cuenta, y Finanzas veía las horas solo después del día de pago.",
"So when the university built an app for claims, the usual design was ready:":
"Cuando la universidad creó una app de declaraciones, el diseño de siempre estaba listo:",
"the app on its own database, a pipeline copying each change to an analytics platform, and reports on the copy.":
"la app en su propia base de datos, un pipeline que copia cada cambio a una plataforma analítica, y reportes sobre la copia.",
"Two platforms, a pipeline between them, two sets of permissions, and a copy always a little behind.":
"Dos plataformas, un pipeline entre ellas, dos juegos de permisos y una copia siempre un poco atrasada.",
"Noor, the data architect, chose one copy on one platform instead.":
"Noor, la arquitecta de datos, eligió en cambio una copia en una plataforma.",
"The claims app is built on Lakebase, the Postgres database in Databricks.":
"La app de declaraciones está hecha sobre Lakebase, la base de datos Postgres de Databricks.",
"Linh writes each claim once, as a row, and her coordinator approves it in that same row.":
"Linh escribe cada declaración una vez, como fila, y su coordinación la aprueba en esa misma fila.",
"Postgres serves the app. The platform keeps the same rows in a second form for analysis, so the lakehouse reads them without slowing it.":
"Postgres atiende a la app. La plataforma guarda las mismas filas en una segunda forma para análisis, y el lakehouse las lee sin frenarla.",
"Payroll's list of claims still waiting and the job that builds the hours to pay both read that copy.":
"La lista de Nómina de declaraciones pendientes y el proceso que arma las horas a pagar leen esa copia.",
"So does Finance's casual teaching cost, and all three read through Unity Catalog.":
"También el costo de la docencia ocasional de Finanzas, y los tres leen a través de Unity Catalog.",
"Each table has one writer. The app writes the claims.":
"Cada tabla tiene un solo escritor: la app escribe las declaraciones.",
"The lakehouse writes the contracts from the HR system, and a copy goes to the app, which checks each claim against its contract.":
"El lakehouse escribe los contratos del sistema de RR. HH., y una copia va a la app, que valida cada declaración con su contrato.",
"As in Amsterdam's ledger, a claim is written once, and read where it's written.":
"Como en el libro de Ámsterdam, una declaración se escribe una vez, y se lee donde se escribe.",
"What's gone: the pipeline, the second database, and the work of keeping two copies in step.":
"Lo que desaparece: el pipeline, la segunda base de datos y el trabajo de mantener dos copias sincronizadas.",
"The integration services that ran between separate platforms come together on one.":
"Los servicios de integración que corrían entre plataformas separadas se juntan en una sola.",
"One catalog governs who may read the claims for analysis, with the same permissions, lineage and audit as every other table.":
"Un catálogo gobierna quién puede leer las declaraciones para análisis, con los mismos permisos, linaje y auditoría que las demás tablas.",
"What still moves? Payroll pays from a payroll system the university buys, which isn't on the platform.":
"¿Qué se sigue moviendo? Nómina paga desde un sistema de nómina que la universidad compra, y que no está en la plataforma.",
"So each pay run, the hours to pay leave the platform by noon on Tuesday, under a contract with payroll.":
"Así que en cada nómina, las horas a pagar salen de la plataforma antes del mediodía del martes, bajo un contrato con Nómina.",
"One thing moves, on purpose, instead of a copy of everything.":
"Se mueve una sola cosa, a propósito, en vez de una copia de todo.",
"The night it fails comes later, in A platform that watches itself.":
"La noche en que falla llega después, en «Una plataforma que se vigila sola».",
"So, what should you choose?":
"Entonces, ¿qué conviene elegir?",
"Keep one copy where you can, and move data only when a reader truly needs it somewhere else.":
"Guarda una sola copia donde puedas, y mueve datos solo cuando quien los lee de verdad los necesita en otro lugar.",
"Decide which system writes each table, and let the others read it.":
"Decide qué sistema escribe cada tabla, y deja que los demás la lean.",
"Where a system you buy keeps its own copy, agree the contract at that interface, as Moving is easy, agreeing is the work showed.":
"Si un sistema comprado guarda su copia, acuerda el contrato en esa interfaz, como mostró «Mover es fácil, acordar es el trabajo».",
"Both at once showed one database that writes and reads. Here, one copy serves a whole platform.":
"«Las dos cosas a la vez» mostró una base de datos que escribe y lee. Aquí, una sola copia sirve a toda una plataforma.",
"There are already standards for this, so don't reinvent the wheel.":
"Ya hay estándares para esto, así que no reinventes la rueda.",
"Investigate, adapt, implement and iterate, starting from the official docs.":
"Investiga, adapta, implementa e itera, partiendo de la documentación oficial.",
"In Amsterdam, a payment became a line moved in one ledger, and the same ledger showed what everyone held.":
"En Ámsterdam, un pago pasó a ser una línea movida en un solo libro, y el mismo libro mostraba lo que tenía cada uno.",
"At the university, Linh's claim is one row: she writes it, her coordinator approves it, payroll pays it and Finance counts it.":
"En la universidad, la declaración de Linh es una fila: ella la escribe, su coordinación la aprueba, Nómina la paga y Finanzas la cuenta.",
"Today, 856 casual staff are paid from rows like hers, and no team had to copy a claim to get there.":
"Hoy cobran 856 personas con contrato ocasional, desde filas como la suya, y ningún equipo tuvo que copiar una declaración.",
"Keep one copy, governed once.":
"Guarda una copia, gobernada una vez."
});
