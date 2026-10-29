/* Products in open formats: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the governance series: gobernanza de datos, never gobierno; dueño and dueña, Planificación, título for an award, estudiantes cerca de un título, el día
   del censo, los cupos del próximo semestre, la oficina de registro's los expedientes de estudiantes, and los responsables de datos for the stewards. As in A product
   with an owner: producto de datos, el catálogo, niveles de servicio, el registro de quién usa qué, una versión, obsoleta and se retira. As in Governed in dbt: el control
   for a check, una prueba for a test, una solicitud de cambio for a pull request, la plataforma; as in Where each piece lives, su hogar and una copia. Here a data contract
   is un contrato de datos, a promise una promesa, an open standard un estándar abierto, a file un archivo, the model el modelo and its code el código, the readers sus
   lectores, a policy una política, a domain un dominio, and a business term un término de negocio. The script, dbt, Bitol, the Linux Foundation, Ontos, Databricks Labs
   and the two standards keep their names. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Today, in Noor's room, Noor and Clara go over Clara's product.":
"Hoy, en la sala de Noor, Noor y Clara revisan el producto de Clara.",
"Noor designs the university's data and its six data products: data with a promise, and an owner who keeps it.":
"Noor diseña los datos de la universidad y sus seis productos de datos: datos con una promesa, y un dueño que la cumple.",
"Clara's is the count of learners near an award, ready by seven on census day.":
"El de Clara es el conteo de estudiantes cerca de un título, listo a las siete el día del censo.",
"But the promises were typed by hand into a catalogue, where people look for data, and the tables changed every week.":
"Pero las promesas se escribían a mano en un catálogo, donde la gente busca datos, y las tablas cambiaban cada semana.",
"So the catalogue could promise a column the table no longer had.":
"Así, el catálogo podía prometer una columna que la tabla ya no tenía.",
"And on census day, a faculty's report could break, just when it's needed to plan next semester's places.":
"Y el día del censo, el informe de una facultad podía fallar cuando hace falta para planear los cupos del próximo semestre.",
"And each catalogue kept its promises in its own format: change the catalogue, and every promise is typed again.":
"Y cada catálogo guardaba sus promesas en su propio formato: cambia el catálogo, y cada promesa se escribe otra vez.",
"Something had to change.":
"Algo tenía que cambiar.",
"Now each promise is a file, kept with the code, in two open standards that any tool can read:":
"Ahora cada promesa es un archivo, guardado con el código, en dos estándares abiertos que lee cualquier herramienta:",
"one for the product, and one for its table's contract.":
"uno para el producto, y otro para el contrato de su tabla.",
"The contract is written from the table's own code, so the two can't disagree, and a change that would break it stops.":
"El contrato se escribe desde el propio código de la tabla, así que no pueden diferir, y un cambio que lo rompería se detiene.",
"When Jun added a column to credentials, its contract grew by a line, by itself, and no report broke.":
"Cuando Jun agregó una columna a las credenciales, su contrato creció una línea, solo, y ningún informe se rompió.",
"All ten tables other teams read have a promise that's checked on every change.":
"Las diez tablas que leen otros equipos tienen una promesa que se controla en cada cambio.",
"And whichever catalogue shows them, the promises stay the university's.":
"Y sea cual sea el catálogo que las muestre, las promesas siguen siendo de la universidad.",
"Each product starts as a short file its owner writes.":
"Cada producto empieza como un archivo corto que escribe su dueño.",
"Clara's says what the product is for, and how to use it.":
"El de Clara dice para qué es el producto, y cómo usarlo.",
"It names her as its owner, the table it offers, and its service levels: built every night, and ready by seven on census day.":
"Nombra a Clara como dueña, la tabla que ofrece y sus niveles de servicio: construida cada noche, y lista a las siete el día del censo.",
"And it says where to ask.":
"Y dice dónde preguntar.",
"The data team builds the table. Clara keeps the promise.":
"El equipo de datos construye la tabla. Clara cumple la promesa.",
"The contract is the promise about the table itself:":
"El contrato es la promesa sobre la tabla misma:",
"each column, its type, whether it's always there, whether it can identify a person, and the tests it must pass.":
"cada columna, su tipo, si siempre está, si puede identificar a una persona, y las pruebas que debe pasar.",
"Nobody types it.":
"Nadie lo escribe a mano.",
"A script writes it from the model, the code that builds the table, and from the product's file, in the Open Data Contract Standard.":
"Lo escribe un script, desde el modelo, el código que construye la tabla, y el archivo del producto, en el Open Data Contract Standard.",
"Side by side, each line of the model has its line in the contract.":
"Lado a lado, cada línea del modelo tiene su línea en el contrato.",
"On every pull request, a check fails if they've drifted apart, or if the contract breaks the standard's rules.":
"En cada solicitud de cambio, un control falla si se han desviado, o si el contrato rompe las reglas del estándar.",
"Not every table is a product.":
"No toda tabla es un producto.",
"Of the data team's thirty-three tables, ten are read by other teams, and each is in exactly one of six products.":
"De las treinta y tres tablas del equipo de datos, otros equipos leen diez, y cada una está en uno solo de seis productos.",
"The same script checks that too.":
"El mismo script también lo controla.",
"A new table other teams read, in no product, stops its pull request until a product takes it in.":
"Una tabla nueva que leen otros equipos, sin producto, detiene su solicitud de cambio hasta que un producto la incluya.",
"When a model changes, its contract follows, by itself.":
"Cuando un modelo cambia, su contrato lo sigue, solo.",
"But some changes break the readers.":
"Pero algunos cambios rompen a sus lectores.",
"Rename a column in Clara's table, and the impact check fails: it's breaking, so it needs a new version.":
"Renombra una columna de la tabla de Clara, y el control de impacto falla: rompe, así que necesita una versión nueva.",
"So the old version stays, with a date to go, and the new one goes beside it.":
"Así, la versión vieja se queda, con una fecha de retiro, y la nueva va a su lado.",
"Credentials already has two: the first retires on the 31st of March 2027, and its contract says it's deprecated, on its way out.":
"Las credenciales ya tienen dos: la primera se retira el 31 de marzo de 2027, y su contrato dice que es obsoleta, de salida.",
"Better still, add: a new column breaks nobody.":
"Mejor aún, agrega: una columna nueva no rompe a nadie.",
"Each product also says who reads it, from the record of who uses what: Planning's census dashboard reads Clara's table.":
"Cada producto dice también quién lo lee, del registro de quién usa qué: el tablero del censo de Planificación lee la tabla de Clara.",
"And it names what it's built from: two of Mei's products, the learner records and the awards.":
"Y nombra de qué está hecho: dos productos de Mei, los expedientes de estudiantes y los títulos.",
"So when one of them changes, Mei knows who to tell, before anything ships.":
"Así, cuando uno de ellos cambia, Mei sabe a quién avisar, antes de que salga nada.",
"Both files are written in open standards: one for data products, one for data contracts.":
"Los dos archivos usan estándares abiertos: uno para productos de datos, otro para contratos de datos.",
"They're kept by Bitol, at the Linux Foundation: free for anyone to use, and versioned.":
"Los mantiene Bitol, en la Linux Foundation: libres para que cualquiera los use, y con versiones.",
"Tools that know them can read the files, and a check holds every file to the standard's rules.":
"Las herramientas que los conocen leen los archivos, y un control exige a cada archivo las reglas del estándar.",
"The project keeps the versions its catalogue reads today, and moves when the catalogue does.":
"El proyecto guarda las versiones que su catálogo lee hoy, y cambia cuando cambia el catálogo.",
"On the platform, the university's catalogue is Ontos, from Databricks Labs.":
"En la plataforma, el catálogo de la universidad es Ontos, de Databricks Labs.",
"It imports each contract from its file, and lays the products out by domain, each with its team.":
"Importa cada contrato desde su archivo, y ordena los productos por dominio, cada uno con su equipo.",
"A steward reviews a product before it's published.":
"Un responsable de datos revisa un producto antes de que se publique.",
"Each night, a policy checks every product: an active one with no owner is tagged, and governance is told.":
"Cada noche, una política revisa cada producto: a uno activo sin dueño se le pone una etiqueta, y se avisa a gobernanza.",
"And it can link each column to the business term it holds.":
"Y puede enlazar cada columna con el término de negocio que contiene.",
"But a Labs project comes as it is, with no formal support.":
"Pero un proyecto de Labs viene tal como es, sin soporte formal.",
"So the files stay at home, in the project, and the catalogue holds a copy.":
"Por eso los archivos se quedan en su hogar, en el proyecto, y el catálogo guarda una copia.",
"On census day next March, a faculty will open Clara's product in the catalogue, read its promise, and plan from it by seven.":
"En el censo del próximo marzo, una facultad abrirá el producto de Clara en el catálogo, leerá su promesa y planeará con él a las siete.",
"If the catalogue has changed by then, the promise hasn't:":
"Si para entonces el catálogo cambió, la promesa no:",
"it's a file, in an open format, kept with the code, and any tool that knows the standard can read it.":
"es un archivo, en un formato abierto, guardado con el código, y cualquier herramienta que conozca el estándar lo lee.",
"A contract in an open format outlives the tool.":
"Un contrato en un formato abierto dura más que la herramienta."
});
