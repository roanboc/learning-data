/* One person, many systems: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Before 1874, every pair of countries that exchanged letters needed a postal treaty of its own.":
"Antes de 1874, cada par de países que se enviaban cartas necesitaba su propio tratado postal.",
"A letter's price depended on its route.":
"El precio de una carta dependía de su ruta.",
"That year, in Bern, twenty-one countries signed one treaty instead.":
"Ese año, en Berna, veintiún países firmaron en cambio un solo tratado.",
"They became one postal territory, with one rate for a letter, and each kept the postage it collected.":
"Formaron un solo territorio postal, con una sola tarifa por carta, y cada país conservó el franqueo que cobraba.",
"Nobody built a post office for the world. Each country kept its own, and they shared the rules.":
"Nadie construyó una oficina de correos para el mundo. Cada país mantuvo la suya, y compartieron las reglas.",
"Today, at the university, Linh Nguyen wants to apply for a PhD.":
"Hoy, en la universidad, Linh Nguyen quiere postular a un doctorado.",
"Last time she applied, she got a second student number, and Mei's office had to link the two.":
"La última vez que postuló, recibió un segundo número de estudiante, y la oficina de Mei tuvo que vincularlos.",
"The application still creates a person first, and nobody looks until later.":
"La solicitud todavía crea primero una persona, y nadie revisa hasta después.",
"And four systems need to know who she is: the student system, HR, the research office and the alumni office.":
"Y cuatro sistemas necesitan saber quién es: el sistema de estudiantes, RR. HH., la oficina de investigación y la oficina de egresados.",
"Noor, the data architect, lays out four ways to give them one person.":
"Noor, la arquitecta de datos, presenta cuatro formas de darles una sola persona.",
"A registry only links. It knows which records are one person, and asks each system for the rest.":
"Un registro solo enlaza. Sabe qué registros son una misma persona, y pide el resto a cada sistema.",
"A copy for analysis gathers everyone in the lakehouse, so reports count each person once.":
"Una copia para análisis reúne a todos en el lakehouse, así los informes cuentan a cada persona una vez.",
"A master that systems read back keeps the person in one place, and each system reads her from it.":
"Un maestro que los sistemas vuelven a leer guarda a la persona en un solo lugar, y cada sistema la lee de ahí.",
"Or one place creates every person, and the systems only read.":
"O un solo lugar crea a cada persona, y los sistemas solo leen.",
"The university already has the first two: Mei's links, and the copy in the lakehouse.":
"La universidad ya tiene las dos primeras: los vínculos de Mei y la copia en el lakehouse.",
"Both find Linh after the fact. Neither stops a third number.":
"Ambas encuentran a Linh a posteriori. Ninguna evita un tercer número.",
"The last two do, but every system that reads back has to change.":
"Las dos últimas sí, pero cada sistema que vuelve a leer tiene que cambiar.",
"So which is the lightest way that still works?":
"¿Y cuál es la forma más liviana que funciona?",
"New people come in at two doors: the application and HR.":
"Las personas nuevas entran por dos puertas: la solicitud y RR. HH.",
"So those two read the person back. The research and alumni offices only add roles, so links are enough for them.":
"Así que esas dos vuelven a leer a la persona. Investigación y egresados solo agregan roles: les bastan los vínculos.",
"Like Bern: no post office for the world. Each system keeps its own, and they share the person.":
"Como en Berna: ninguna oficina de correos para el mundo. Cada sistema mantiene lo suyo, y comparten a la persona.",
"Others need a heavier way. A bank's customer hub is read by every product system.":
"Otros necesitan una forma más pesada. Cada sistema de productos de un banco lee su hub de clientes.",
"Many countries keep one population register, and agencies ask it instead of keeping their own.":
"Muchos países tienen un solo registro de población, y los organismos lo consultan en vez de llevar el suyo.",
"And one change at the door: before the application creates a person, it searches for one.":
"Y un cambio en la puerta: antes de crear una persona, la solicitud busca si ya existe.",
"It compares the name, the birth date, the email, and any number from before.":
"Compara el nombre, la fecha de nacimiento, el correo y cualquier número anterior.",
"A clear match adds a role. A likely one waits for Mei's office to decide.":
"Una coincidencia clara agrega un rol. Una probable espera a que decida la oficina de Mei.",
"Only when nobody matches is a new person made.":
"Solo si nadie coincide se crea una persona nueva.",
"Noor and Mei write down who may create a person: only the application and HR, after a search.":
"Noor y Mei anotan quién puede crear una persona: solo la solicitud y RR. HH., después de buscar.",
"The research and alumni offices never do. They add roles to people already there.":
"Las oficinas de investigación y de egresados nunca lo hacen. Agregan roles a personas que ya están.",
"In October, Linh applies for her PhD.":
"En octubre, Linh postula a su doctorado.",
"The search finds her: the same birth date, the same email, and the student number she gave.":
"La búsqueda la encuentra: la misma fecha de nacimiento, el mismo correo y el número de estudiante que dio.",
"So the application adds a role, applicant, to the person she already is. No new number, and nothing to merge later.":
"Así, la solicitud agrega un rol, postulante, a la persona que ya es. Ningún número nuevo, y nada que fusionar después.",
"The same week, another Linh Nguyen applies. It's a common Vietnamese name.":
"Esa misma semana, postula otra Linh Nguyen. Es un nombre vietnamita común.",
"But she was born in another year, writes from another email, and has never studied here.":
"Pero nació otro año, escribe desde otro correo y nunca ha estudiado aquí.",
"Only the name agrees. So she becomes a new person, with her own number, and none of Linh's history.":
"Solo coincide el nombre. Así que es una persona nueva, con su propio número y nada de la historia de Linh.",
"Behind the search is the person, published as a data product, and owned by Mei's office.":
"Detrás de la búsqueda está la persona, publicada como producto de datos, a cargo de la oficina de Mei.",
"A contract fixes its shape, and a new version marks any change to it, so nothing that reads it breaks by surprise.":
"Un contrato fija su forma, y una nueva versión marca cualquier cambio, para que nada de lo que la lee se rompa por sorpresa.",
"dbt builds and tests it, and Databricks governs who may read it.":
"dbt la construye y la prueba, y Databricks gobierna quién puede leerla.",
"A synced table serves it to the application, while the applicant waits.":
"Una tabla sincronizada se la entrega a la solicitud mientras quien postula espera.",
"In Bern, each country kept its post office, and they shared the rules.":
"En Berna, cada país mantuvo su oficina de correos, y compartieron las reglas.",
"Here, each system keeps its records, and they share one person.":
"Aquí, cada sistema mantiene sus registros, y comparten una sola persona.",
"Choose the lightest way that solves the problem.":
"Elige la forma más liviana que resuelva el problema."
});
