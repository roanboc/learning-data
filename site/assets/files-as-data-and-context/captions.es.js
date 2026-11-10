/* Files as data and as context: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's pages and the earlier films: Finanzas, RR. HH., las facturas de proveedores, el proyecto de datos, la arquitecta de datos, los metadatos,
   un volumen, una revisión for a check, un caso de uso. New here: el cuaderno de bitácora, then la bitácora, for a ship's logbook; las cartas de vientos y corrientes;
   la travesía for a passage; las solicitudes de pago de horas, then las solicitudes, for claims for hours, and la app de solicitudes for the claims app; calificar for
   marking. The platform's names and functions stay as they are on screen (Databricks, Unity Catalog, ai_parse_document, ai_extract, dbt, JSON, YAML), and so do the
   files' names and the contract's ID (T-26188). Films named by their Spanish titles: Promesas y pruebas, Ingeniería de contexto, Contexto y memoria, gobernados.
   Numbers keep the picture's comma (3,860), as the module's other Spanish captions do, so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Washington, 1842. A small office of the United States Navy kept its charts, and its ships' old logbooks.":
"Washington, 1842. Una pequeña oficina de la Armada de EE. UU. guardaba sus cartas y los viejos cuadernos de bitácora de sus barcos.",
"A logbook is a ship's daily record: where it was, the wind, the weather, and the current, the sea's own flow.":
"Una bitácora es el registro diario de un barco: dónde estaba, el viento, el tiempo y la corriente, el propio flujo del mar.",
"Thousands of days at sea were written there, each ship in its own way, and nobody read them again.":
"Ahí quedaban escritos miles de días en el mar, cada barco a su manera, y nadie volvía a leerlos.",
"So captains sailed the routes they knew, not the winds and currents that were really there.":
"Así que los capitanes seguían las rutas que conocían, no los vientos y corrientes que de verdad había.",
"Passages took weeks longer than they had to: more weeks at sea for the crews, with food and water running low, and cargo and letters late.":
"Las travesías duraban semanas de más: más semanas en el mar para las tripulaciones, con poca comida y agua, y la carga y las cartas tarde.",
"Something had to change.":
"Algo tenía que cambiar.",
"So the office read its old logs into tables: the winds and currents of each patch of ocean, month by month.":
"Así que la oficina pasó sus viejas bitácoras a tablas: los vientos y corrientes de cada parcela de océano, mes a mes.",
"From them, it drew wind and current charts, free to any captain who would keep a log in one set form, and send it back.":
"Con ellas trazó cartas de vientos y corrientes, gratis para todo capitán que llevara su bitácora en un formato fijo y la enviara de vuelta.",
"In 1853, at Brussels, ten nations, with the statistician Adolphe Quetelet in the chair, agreed one log for ships of every flag.":
"En 1853, en Bruselas, diez naciones, presididas por el estadístico Adolphe Quetelet, acordaron una bitácora para barcos de toda bandera.",
"By the office's own count, ships sailing by the charts cut the average passage to California, round Cape Horn, from 183 days to 135.":
"Según la oficina, los barcos que usaban las cartas acortaron la travesía media a California, por el cabo de Hornos, de 183 días a 135.",
"And nations began to share their weather data, as they still do today.":
"Y las naciones empezaron a compartir sus datos del tiempo, como siguen haciéndolo hoy.",
"Documents today are no different: written for people, each in its own way.":
"Los documentos de hoy no son distintos: escritos para personas, cada uno a su manera.",
"What's written for people can be read into data where it's worth it, and what we write can be written as data from the start.":
"Lo escrito para personas se puede leer como datos donde vale la pena, y lo que escribimos, escribirse como datos desde el principio.",
"Today, at the university, three kinds of documents show three answers: read them, keep them, or write them as data.":
"Hoy, en la universidad, tres tipos de documentos muestran tres respuestas: leerlos, guardarlos o escribirlos como datos.",
"In October, Finance received 3,860 supplier invoices, most of them PDF files, each in its supplier's own layout.":
"En octubre, Finanzas recibió 3,860 facturas de proveedores, la mayoría en archivos PDF, cada una con el diseño de su proveedor.",
"Rohan Desai's team checks every one before it's paid: who sent it, its number, its date, its total, and each line.":
"El equipo de Rohan Desai revisa cada una antes de pagarla: quién la envió, su número, su fecha, su total y cada línea.",
"For years, they typed them in by hand, and in September, one invoice, sent twice, was paid twice.":
"Durante años las ingresaron a mano, y en septiembre una factura, enviada dos veces, se pagó dos veces.",
"Now every file lands in a volume: a place for files, governed in Unity Catalog as tables are.":
"Ahora cada archivo llega a un volumen: un lugar para archivos, gobernado en Unity Catalog como lo son las tablas.",
"A function, ai_parse_document, reads each file: its words, its tables, and where each sits on the page.":
"Una función, ai_parse_document, lee cada archivo: sus palabras, sus tablas y dónde está cada cosa en la página.",
"Another, ai_extract, takes out the fields Finance names, one row for each invoice.":
"Otra, ai_extract, saca los campos que Finanzas nombra, una fila por cada factura.",
"Each row keeps the path of its file, so anyone can open the invoice it came from.":
"Cada fila guarda la ruta de su archivo, así cualquiera puede abrir la factura de la que vino.",
"An AI model does the reading, so what it reads is checked like any other data, as the film Promises and proofs shows.":
"Quien lee es un modelo de IA, así que lo que lee se revisa como cualquier otro dato, como muestra la película Promesas y pruebas.",
"Jun Park's data project checks each one: is every field read, and do the lines add up to the total?":
"El proyecto de datos de Jun Park revisa cada una: ¿se leyó cada campo, y las líneas suman el total?",
"Then come Finance's own rules: has this number been sent before, and does Finance know the supplier?":
"Luego vienen las reglas de Finanzas: ¿ya se envió antes este número, y Finanzas conoce al proveedor?",
"Of October's 3,860, 3,734 passed every check.":
"De las 3,860 de octubre, 3,734 pasaron cada revisión.",
"126 went to a person, each with its reason. Nine had been sent twice.":
"126 fueron a una persona, cada una con su motivo. Nueve se habían enviado dos veces.",
"The function reads, the checks sort, and Rohan's team decides, as it still approves every payment.":
"La función lee, las revisiones clasifican y el equipo de Rohan decide, como sigue aprobando cada pago.",
"A signed contract is different: it's an official document, kept just as it was signed.":
"Un contrato firmado es distinto: es un documento oficial, que se guarda tal como se firmó.",
"Nobody rewrites it as a table. Beside it goes its metadata: the contract's ID, its version, the day it was signed, and where its file is.":
"Nadie lo reescribe como tabla. A su lado van sus metadatos: el ID del contrato, su versión, el día en que se firmó y dónde está su archivo.",
"The HR system writes that metadata as it makes the document, so nobody has to read it back.":
"El sistema de RR. HH. escribe esos metadatos al crear el documento, así nadie tiene que volver a leerlo.",
"Linh Nguyen's contract for this semester, T-26188, has two files: the offer HR sent on 9 July, and the contract she signed on 14 July.":
"El contrato de Linh Nguyen de este semestre, T-26188, tiene dos archivos: la oferta que envió RR. HH. el 9 de julio y el que firmó el 14.",
"The offer ended on the 13th of November. Before she signed, HR added a week for marking.":
"La oferta terminaba el 13 de noviembre. Antes de que firmara, RR. HH. agregó una semana para calificar.",
"In a folder, the two look alike. By their metadata, they don't.":
"En una carpeta, los dos se parecen. Por sus metadatos, no.",
"So if Linh asks when her contract ends, a person or an agent finds the signed version, and cites its file: the 20th of November.":
"Si Linh pregunta cuándo termina su contrato, una persona o un agente encuentra la versión firmada y cita su archivo: el 20 de noviembre.",
"The films Context engineering, and Context and memory, governed, show how a document becomes an agent's context.":
"Las películas Ingeniería de contexto y Contexto y memoria, gobernados muestran cómo un documento se vuelve contexto de un agente.",
"Who may read a contract is Ingrid Holm's to decide, in HR. Data protection, a module of its own, teaches the rest.":
"Quién puede leer un contrato lo decide Ingrid Holm, en RR. HH. La protección de datos, un módulo propio, enseña el resto.",
"Best of all is a document nobody has to read back.":
"Lo mejor es un documento que nadie tiene que volver a leer.",
"Claims for hours worked used to come as spreadsheets by email, and someone typed each one into payroll.":
"Las solicitudes de pago de horas llegaban como hojas de cálculo por correo, y alguien ingresaba cada una en la nómina.",
"Now the claims app writes each claim as data, the moment it's made: a row any system can read.":
"Ahora la app de solicitudes escribe cada una como datos, al hacerse: una fila que cualquier sistema puede leer.",
"With it goes its metadata: who claimed, on which contract, whether it's approved, and when.":
"Con ella van sus metadatos: quién la hizo, con qué contrato, si está aprobada y cuándo.",
"What each field means is written in its contract: a YAML file, in an open standard, kept with the app's code.":
"Lo que significa cada campo está escrito en su contrato: un archivo YAML, en un estándar abierto, guardado con el código de la app.",
"It's the log of 1853 again: one form, kept by everyone, so nobody has to read it back.":
"Es otra vez la bitácora de 1853: un solo formato, que todos llevan, así nadie tiene que volver a leerla.",
"Those logs were kept. More than a century later, climate scientists read them again, into over a million weather reports.":
"Esas bitácoras se guardaron. Más de un siglo después, científicos del clima las volvieron a leer: más de un millón de reportes del tiempo.",
"Keep the file and its metadata, and better readers can read it again.":
"Guarda el archivo y sus metadatos, y mejores lectores podrán volver a leerlo.",
"So Noor Rahman, the data architect, gives every document one of three answers.":
"Por eso Noor Rahman, la arquitecta de datos, da a cada documento una de tres respuestas.",
"If we write it, we write it as data, in a standard structure such as JSON or YAML, with its metadata.":
"Si lo escribimos nosotros, lo escribimos como datos, en una estructura estándar como JSON o YAML, con sus metadatos.",
"If it's official, we keep it as it is, its metadata beside it.":
"Si es oficial, lo guardamos tal como está, con sus metadatos al lado.",
"If it's written for people, we read it, with the platform's functions or a scraper, only where a use case needs it, and keep the file.":
"Si se escribió para personas, lo leemos con funciones de la plataforma o un scraper, solo si un caso de uso lo pide, y guardamos el archivo.",
"Every organisation's documents differ, and the standards are there already: don't reinvent the wheel.":
"Los documentos de cada organización son distintos, y los estándares ya existen: no reinventes la rueda.",
"Start from the official docs. Investigate, adapt, implement, iterate.":
"Empieza por la documentación oficial. Investiga, adapta, implementa, itera.",
"That closes this module: moving data, running the platform, serving it to people and agents, and reading documents.":
"Así cierra este módulo: mover datos, operar la plataforma, servirlos a personas y agentes, y leer documentos.",
"Each once took a whole team. Databricks and dbt now do much of it; what's left for people is agreeing what the data means.":
"Cada cosa requería antes un equipo entero. Databricks y dbt ahora hacen mucho; a las personas les queda acordar qué significan los datos.",
"And for documents: read them where a use case needs it, keep the file and its metadata, and write what's yours as data.":
"Y con los documentos: léelos donde un caso de uso lo pida, guarda el archivo y sus metadatos, y escribe lo tuyo como datos."
});
