/* Network, storage and keys: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words: el comisario de las aguas for Frontinus's office; los canales, los depósitos de distribución, los pilones y fuentes públicas, las termas; la concesión for an
   emperor's grant of water, and el permiso for a grant in the catalog; los fontaneros for the water-men; los ramales secretos; la boquilla de bronce, marcada con el
   tamaño concedido; las cuadrillas for the gangs; el registro for Rome's records and for the storage's log alike, as the film draws them alike (and as Who did what says);
   el espacio de trabajo, desarrollo, pruebas y producción (the names on screen stay English); la cuenta de almacenamiento and el contenedor; la llave for an account key
   and for the encryption key, as Walls, doors and keys says (Red, almacenamiento y llaves is the title); el enlace firmado; el punto de conexión privado, as Microsoft's
   Spanish pages say; la lista de acceso por IP; el cómputo sin servidor, so it never meets el proceso, the series' job; un notebook; la política de red con acceso
   restringido and el modo de prueba; el conector de acceso, la credencial de almacenamiento and la ubicación externa; vincular for binding; encender and apagar, and
   la cuenta de administrador, as the series says; la bóveda; el equipo de seguridad; el proveedor de la nube. The catalogs' names stay as on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Rome, in the year 97.":
"Roma, en el año 97.",
"Nine aqueducts bring the city its water from the hills, most of the way in channels under the ground.":
"Nueve acueductos traen a la ciudad el agua de las colinas, casi todo el camino por canales bajo tierra.",
"In the city, it fills distribution tanks, and pipes carry it on:":
"En la ciudad, llena depósitos de distribución, y las tuberías la llevan más allá:",
"to public basins and fountains, to baths, and to houses that hold a grant from the emperor, for so much water.":
"a pilones y fuentes públicas, a las termas, y a casas con una concesión del emperador, por una cantidad fija de agua.",
"That year, the emperor Nerva makes Sextus Julius Frontinus the water commissioner,":
"Ese año, el emperador Nerva nombra a Sexto Julio Frontino comisario de las aguas,",
"an office, he writes, that concerns the city's health, and even its safety.":
"un cargo, escribe, que toca a la salud de la ciudad, y hasta a su seguridad.",
"Frontinus measures the water where it enters the channels, and finds about ten thousand measures more than the records give out.":
"Frontino mide el agua donde entra en los canales, y encuentra unas diez mil medidas más de las que los registros reparten.",
"On the way, it's being drawn off.":
"Por el camino, alguien la está sacando.",
"Water-men, who tend the pipes, divert it for private use, and sell it.":
"Los fontaneros, que cuidan las tuberías, la desvían para uso privado, y la venden.",
"Landowners along the way tap the channels to water their gardens.":
"Los dueños de tierras junto al camino perforan los canales para regar sus jardines.",
"Under the pavements, secret pipes are bored here and there, with branches to the shops along them.":
"Bajo el pavimento, se abren tuberías secretas aquí y allá, con ramales a las tiendas de la calle.",
"So only a little reaches the public basins and fountains, which should run day and night for the people,":
"Así, solo un poco llega a los pilones y fuentes públicas, que deberían correr día y noche para la gente,",
"and some stop altogether.":
"y algunos se quedan secos.",
"Nobody can say who draws what.":
"Nadie puede decir quién saca qué.",
"The water has to go where it's owed, and someone has to know where it goes.":
"El agua tiene que ir a donde se debe, y alguien tiene que saber a dónde va.",
"Frontinus holds the city to its rules.":
"Frontino hace cumplir las reglas de la ciudad.",
"No one may draw water from the channels.":
"Nadie puede sacar agua de los canales.",
"Whoever holds a grant draws it only at a distribution tank, through a bronze nozzle stamped with the size granted,":
"Quien tiene una concesión la saca solo en un depósito de distribución, por una boquilla de bronce marcada con el tamaño concedido,",
"and every grant is in the records.":
"y cada concesión consta en los registros.",
"The secret branch pipes come out, and so much lead comes back that he estimates the theft by it.":
"Se arrancan los ramales secretos, y vuelve tanto plomo que con él calcula el robo.",
"And the gangs who keep the channels, often sent off to private work,":
"Y las cuadrillas que cuidan los canales, que a menudo mandaban a trabajos privados,",
"now write down the day before what each will do, and the records keep what each did.":
"ahora anotan el día antes lo que hará cada una, y los registros guardan lo que hizo cada una.",
"Frontinus wrote that the supply almost doubled, as though new springs had been found.":
"Frontino escribió que el suministro casi se duplicó, como si se hubieran hallado manantiales nuevos.",
"More basins and fountains ran for the people, the city was cleaner,":
"Corrieron más pilones y fuentes para la gente, la ciudad estaba más limpia,",
"and those who had drawn water in fear now drew it by grant, free from care.":
"y quienes sacaban agua con miedo ahora la sacaban por concesión, sin preocupación.",
"A data platform's files are its water, and its catalog is the tank:":
"Los archivos de una plataforma de datos son su agua, y su catálogo es el depósito:",
"the one place to draw, where each grant is checked and every rule applied.":
"el único lugar donde sacar, donde se revisa cada permiso y se aplica cada regla.",
"Every way to the files around it is a hole in the channel.":
"Cada camino a los archivos que lo esquiva es un agujero en el canal.",
"At the university, the data platform runs on Azure Databricks, in three workspaces now: development, test and production.":
"En la universidad, la plataforma de datos corre en Azure Databricks, ahora en tres espacios de trabajo: desarrollo, pruebas y producción.",
"Production's files, every table's data, sit in an Azure storage account, a container for each area.":
"Los archivos de producción, los datos de cada tabla, están en una cuenta de almacenamiento de Azure, un contenedor por área.",
"Unity Catalog is meant to be the only way to them.":
"Unity Catalog debería ser el único camino hacia ellos.",
"Sam Okafor, who runs the platform, counts the ways to the files that skip it.":
"Sam Okafor, que lleva la plataforma, cuenta los caminos a los archivos que se lo saltan.",
"Two account keys, each of which opens every file.":
"Dos llaves de la cuenta, y cada una abre todos los archivos.",
"A link signed with one of them, made in 2024 for a supplier's one-off file, and good until the end of 2027.":
"Un enlace firmado con una de ellas, creado en 2024 para un archivo suelto de un proveedor, y válido hasta fines de 2027.",
"Six people with a role on the storage, each given for one task, and never taken back.":
"Seis personas con un rol en el almacenamiento, cada uno dado para una tarea, y nunca retirado.",
"Nine ways in, and not one asks the catalog.":
"Nueve entradas, y ninguna le pregunta al catálogo.",
"In the files, no grant, mask or filter applies: whoever reads them sees every row.":
"En los archivos no se aplica ningún permiso, máscara ni filtro: quien los lee ve todas las filas.",
"And the workspaces and the storage all have a door on the internet, open to any address.":
"Y los espacios de trabajo y el almacenamiento tienen todos una puerta en internet, abierta a cualquier dirección.",
"Nobody did anything wrong: each was the quickest way to finish a task.":
"Nadie hizo nada malo: cada uno fue la forma más rápida de terminar una tarea.",
"First, the doors in.":
"Primero, las entradas.",
"Sam gives each workspace a private endpoint: a door inside the university's own network,":
"Sam le da a cada espacio de trabajo un punto de conexión privado: una puerta dentro de la red propia de la universidad,",
"so people and jobs come in by a private path.":
"así que las personas y los procesos entran por un camino privado.",
"The machines that run the jobs reach Databricks by a private path too, and so does the build service.":
"Las máquinas que corren los procesos también llegan a Databricks por un camino privado, y el servicio de compilación igual.",
"While every team moves to it, for two weeks, an IP access list lets in only the university's own addresses.":
"Mientras cada equipo se pasa a él, durante dos semanas, una lista de acceso por IP solo deja entrar las direcciones de la universidad.",
"Then Sam switches public access off in all three workspaces:":
"Luego Sam apaga el acceso público en los tres espacios de trabajo:",
"the platform has no door on the open internet.":
"la plataforma no tiene ninguna puerta abierta a internet.",
"Then the ways out.":
"Luego, las salidas.",
"Serverless compute, which Databricks runs for the university, could reach anywhere on the internet:":
"El cómputo sin servidor, que Databricks corre para la universidad, podía llegar a cualquier sitio de internet:",
"a notebook could send a table anywhere.":
"un notebook podía mandar una tabla a cualquier parte.",
"Production gets a network policy with restricted access: only the catalog's own storage, and a short list.":
"Producción recibe una política de red con acceso restringido: solo el almacenamiento del propio catálogo, y una lista corta.",
"For a week it runs in dry run: it blocks nothing yet, and Sam sees what it would have blocked.":
"Durante una semana corre en modo de prueba: aún no bloquea nada, y Sam ve lo que habría bloqueado.",
"Then it's on: data may leave only for places on the list.":
"Luego se activa: los datos solo pueden salir hacia los sitios de la lista.",
"Now the files themselves.":
"Ahora, los archivos mismos.",
"Sam switches the storage's public access off: it's reached only by its own private endpoints.":
"Sam apaga el acceso público del almacenamiento: solo se llega a él por sus propios puntos de conexión privados.",
"He switches off its account keys, and the storage refuses anything signed with them:":
"Apaga sus llaves de la cuenta, y el almacenamiento rechaza todo lo firmado con ellas:",
"the two keys and the supplier's link open nothing now.":
"las dos llaves y el enlace del proveedor ya no abren nada.",
"The six people's roles go; each now gets what they need through the catalog, under their group's grants.":
"Los roles de las seis personas se van; cada una obtiene lo que necesita por el catálogo, con los permisos de su grupo.",
"One identity keeps a role on the files: the catalog's own, its access connector,":
"Una sola identidad conserva un rol en los archivos: la del propio catálogo, su conector de acceso,",
"an identity Azure gives it, with no secret anyone holds.":
"una identidad que le da Azure, sin ningún secreto que alguien guarde.",
"In Unity Catalog, a storage credential holds it, and an external location for each area points to its container.":
"En Unity Catalog, una credencial de almacenamiento la contiene, y una ubicación externa por área apunta a su contenedor.",
"So every read of the files goes through the catalog, which checks the grant, and applies the masks and filters.":
"Así, cada lectura de los archivos pasa por el catálogo, que revisa el permiso, y aplica las máscaras y los filtros.",
"Like Rome's tanks, the catalog is the one place to draw.":
"Como los depósitos de Roma, el catálogo es el único lugar donde sacar.",
"One more wall.":
"Un muro más.",
"By default, every workspace reaches every catalog:":
"Por defecto, cada espacio de trabajo llega a cada catálogo:",
"a notebook in development, with a grant, could read production's real records.":
"un notebook en desarrollo, con un permiso, podría leer los datos reales de producción.",
"Sam binds each catalog to its own workspace:":
"Sam vincula cada catálogo a su propio espacio de trabajo:",
"production's five, registrar, learning, planning, HR and finance, to production alone;":
"los cinco de producción, registrar, learning, planning, HR y finance, solo a producción;",
"test's to test; development's to development.":
"los de pruebas, a pruebas; los de desarrollo, a desarrollo.",
"The storage credential and the external locations are bound the same way.":
"La credencial de almacenamiento y las ubicaciones externas se vinculan igual.",
"Now a grant isn't enough: from a workspace it isn't bound to, a catalog isn't there.":
"Ahora un permiso no basta: desde un espacio de trabajo al que no está vinculado, un catálogo no aparece.",
"The files keep one more door, and it stays shut.":
"Los archivos guardan una puerta más, y sigue cerrada.",
"Some work needs the files themselves.":
"Hay trabajo que necesita los archivos mismos.",
"One morning, the nightly load stops on a row it can't read, and Jun Park must open last night's file.":
"Una mañana, la carga nocturna se detiene en una fila que no puede leer, y Jun Park tiene que abrir el archivo de anoche.",
"On the storage, one group holds one role: read and list, nothing more.":
"En el almacenamiento, un grupo tiene un rol: leer y listar, nada más.",
"It's for admin accounts only, and no one is in it.":
"Es solo para cuentas de administrador, y no hay nadie en él.",
"Jun switches on his admin account's power to read the storage, for one hour, with a reason, and Sam approves.":
"Jun enciende el poder de su cuenta de administrador para leer el almacenamiento, por una hora, con un motivo, y Sam lo aprueba.",
"Jun comes in by the private path, reads that one file, and switches off.":
"Jun entra por el camino privado, lee ese único archivo, y apaga.",
"The storage's own log keeps every read, under the account that made it, and the platform team gets an alert.":
"El registro del propio almacenamiento guarda cada lectura, con la cuenta que la hizo, y el equipo de la plataforma recibe una alerta.",
"Had he forgotten, it would have shut by itself when the hour was up.":
"Si lo hubiera olvidado, se habría cerrado sola al terminar la hora.",
"Like the gangs in Rome, the work is written down before, and recorded as it's done.":
"Como con las cuadrillas de Roma, el trabajo se anota antes, y se registra mientras se hace.",
"Last, the keys.":
"Por último, las llaves.",
"The files were always encrypted, with a key the cloud provider kept for the university.":
"Los archivos siempre estuvieron cifrados, con una llave que el proveedor de la nube guardaba para la universidad.",
"Now the key is the university's own, kept by its security team in a vault of its own.":
"Ahora la llave es de la universidad, y la guarda su equipo de seguridad en una bóveda propia.",
"The storage may use the key, never take it out.":
"El almacenamiento puede usar la llave, nunca sacarla.",
"The people who run the platform can't delete it or turn it off, and every use is recorded.":
"Quienes llevan la plataforma no pueden borrarla ni desactivarla, y cada uso queda registrado.",
"The vault makes a new version every year, and the storage picks it up within a day.":
"La bóveda crea una versión nueva cada año, y el almacenamiento la toma en menos de un día.",
"A deleted key is kept ninety days, and nobody can cut that short.":
"Una llave borrada se guarda noventa días, y nadie puede acortar ese plazo.",
"The workspace's notebooks, queries and disks use a key from the same vault.":
"Los notebooks, las consultas y los discos del espacio de trabajo usan una llave de la misma bóveda.",
"And the security team can take the key back:":
"Y el equipo de seguridad puede retirar la llave:",
"then nobody can read the files, the cloud provider included.":
"entonces nadie puede leer los archivos, ni siquiera el proveedor de la nube.",
"In Rome, water was drawn only at the tank, through a stamped nozzle, and the gangs' work was written down.":
"En Roma, el agua se sacaba solo en el depósito, por una boquilla marcada, y el trabajo de las cuadrillas se anotaba.",
"At the university, the files are reached only through the catalog,":
"En la universidad, a los archivos solo se llega por el catálogo,",
"behind private doors, with a short list out and a key of the university's own.":
"tras puertas privadas, con una lista corta de salida y una llave propia de la universidad.",
"And the one way around it is switched on for a task, and watched.":
"Y el único camino que lo esquiva se enciende para una tarea, y se vigila.",
"No path to the data skips the catalog, except the one you switch on and watch.":
"Ningún camino a los datos se salta el catálogo, salvo el que enciendes y vigilas."
});
