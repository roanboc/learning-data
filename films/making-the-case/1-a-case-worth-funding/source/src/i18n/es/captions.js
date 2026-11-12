/* A case worth funding: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series' pages (series.json): el viejo almacén de datos, los reportes, el consejo de datos, la gestora de datos, Finanzas, contador de gestión,
   RR. HH., el caso, una petición clara, un dueño (an owner). From the governance and quality films: registro académico (the registrar's office), el catálogo,
   la plataforma. New here: la Zanja de Clinton, los comisionados del canal, la legislatura, los peajes (tolls), las naciones haudenosaunee, el modelo de cinco
   casos del Tesoro británico (the Five Case Model), una lista de control (a checklist, not a form), los registros del almacén (its logs), el periodo de
   recuperación (payback), la gestión de beneficios (benefits management), quien dirige los servicios digitales (the director, whom the film doesn't name).
   Films and modules the voice names keep their Spanish titles (Una capacidad, no un proyecto; Liderar equipos de datos). Sums as on screen (A$310,000;
   A$380,000; A$930,000), since the picture shows them; the 1816 dollars in words, as the voice says them. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"New York State, in 1816.":
"El estado de Nueva York, en 1816.",
"Farms and towns were spreading west, around the Great Lakes, with grain to sell on the coast.":
"Granjas y pueblos se extendían hacia el oeste, junto a los Grandes Lagos, con grano para vender en la costa.",
"But the only way east was by wagon, on rough roads.":
"Pero la única vía hacia el este era en carreta, por caminos difíciles.",
"Moving a ton from Buffalo, on Lake Erie, to New York City cost about a hundred dollars, and took weeks.":
"Llevar una tonelada de Buffalo, en el lago Erie, a la ciudad de Nueva York costaba unos cien dólares, y tardaba semanas.",
"A family out west could grow plenty, and still not sell it at a price that paid.":
"Una familia del oeste podía cosechar mucho, y aun así no venderlo a un precio que le compensara.",
"A canal could carry it, but it would run 363 miles, through forest and swamp.":
"Un canal podría llevarlo, pero tendría 363 millas, entre bosques y pantanos.",
"The federal government wouldn't pay; President Jefferson had called the idea little short of madness. Critics called it Clinton's Ditch.":
"El gobierno federal no pagaría; el presidente Jefferson llamó a la idea poco menos que una locura. Los críticos, la Zanja de Clinton.",
"If Washington wouldn't pay, the canal needed someone who would.":
"Si Washington no pagaba, el canal necesitaba a alguien que sí lo hiciera.",
"DeWitt Clinton and the state's canal commissioners made the case to New York's legislature.":
"DeWitt Clinton y los comisionados del canal del estado presentaron el caso a la legislatura de Nueva York.",
"Where it would run, from the Hudson to Lake Erie; what it would cost, about seven million dollars; and how taxes and tolls would repay it.":
"Por dónde iría, del Hudson al lago Erie; cuánto costaría, unos siete millones de dólares; y cómo lo pagarían impuestos y peajes.",
"On 15 April 1817, the legislature said yes.":
"El 15 de abril de 1817, la legislatura dijo que sí.",
"Thousands dug it with picks and shovels, many just arrived from Ireland and Wales, led by engineers who learned on the job.":
"Miles lo cavaron con picos y palas, muchos recién llegados de Irlanda y Gales, guiados por ingenieros que aprendían sobre la marcha.",
"It crossed the homelands of the Haudenosaunee nations, much of it taken from them in the years before.":
"Cruzaba las tierras de las naciones haudenosaunee, que en gran parte les habían quitado en los años anteriores.",
"It opened on 26 October 1825, two years ahead of plan.":
"Se inauguró el 26 de octubre de 1825, dos años antes de lo previsto.",
"Moving a ton now cost under nine dollars, not a hundred, and took days, not weeks.":
"Llevar una tonelada costaba ahora menos de nueve dólares, no cien, y tardaba días, no semanas.",
"Within ten years, the tolls had paid back the seven million.":
"En diez años, los peajes habían devuelto los siete millones.",
"Within fifteen years, New York was the busiest port in the country.":
"En quince años, Nueva York era el puerto más activo del país.",
"A data team asks for money too: to build something new, or to stop paying for something old.":
"Un equipo de datos también pide dinero: para construir algo nuevo, o para dejar de pagar algo viejo.",
"Its case needs the same parts: the choices, what each costs once and every year, what it saves, and who will see the benefit.":
"Su caso necesita las mismas partes: las opciones, lo que cada una cuesta una vez y cada año, lo que ahorra, y quién verá el beneficio.",
"May 2027, at the university.":
"Mayo de 2027, en la universidad.",
"The old warehouse has run on the university's own servers since 2012.":
"El viejo almacén de datos funciona en los servidores de la universidad desde 2012.",
"Its licence, servers and support cost A$310,000 a year.":
"Su licencia, servidores y soporte cuestan A$310,000 al año.",
"The licence ends on 31 December; if nobody decides, it renews for three more years.":
"La licencia vence el 31 de diciembre; si nadie decide, se renueva por tres años más.",
"Helena Novak, the data manager, will ask the data council to retire it, on Tuesday 25 May.":
"Helena Novak, la gestora de datos, pedirá al consejo de datos retirarlo, el martes 25 de mayo.",
"She starts from the decision she needs, in one line: retire the old warehouse this year, or pay for three more.":
"Empieza por la decisión que necesita, en una línea: retirar el viejo almacén este año, o pagar tres años más.",
"Governance gets a budget line every year, as A capability, not a project showed. This ask is money once, to stop paying every year.":
"La gobernanza recibe presupuesto cada año, como mostró Una capacidad, no un proyecto. Esto es dinero una vez, para dejar de pagar cada año.",
"A good case answers five questions; the UK Treasury's Five Case Model names them.":
"Un buen caso responde cinco preguntas; el modelo de cinco casos del Tesoro británico las nombra.",
"Is it needed? Is it the best value? Can it be bought? Can it be afforded? Can it be delivered?":
"¿Hace falta? ¿Es la opción de mejor valor? ¿Se puede comprar? ¿Se puede costear? ¿Se puede llevar a cabo?",
"Helena uses them as a checklist, not a form.":
"Helena las usa como lista de control, no como formulario.",
"She keeps heavy methods for critical systems, where a mistake can cost lives.":
"Deja los métodos pesados para los sistemas críticos, donde un error puede costar vidas.",
"Everywhere else, a light one lets her try, learn and change course quickly.":
"En todo lo demás, uno ligero le permite probar, aprender y cambiar de rumbo rápido.",
"Then the options, and one always carries on as now: doing nothing has a price too.":
"Luego las opciones, y una siempre sigue como hasta ahora: no hacer nada también tiene un precio.",
"Option A: renew the licence for three years. A$930,000, for an old version on old servers.":
"Opción A: renovar la licencia por tres años. A$930,000, por una versión vieja en servidores viejos.",
"Option B: move all 38 reports as they are. A$520,000, once.":
"Opción B: mover los 38 reportes tal como están. A$520,000, una vez.",
"But the warehouse's own logs show who opens what.":
"Pero los propios registros del almacén muestran quién abre qué.",
"17 of the 38 reports haven't been opened in a year. The other 21 are used by about 260 people.":
"17 de los 38 reportes no se han abierto en un año. Los otros 21 los usan unas 260 personas.",
"Option C: move those 21, rebuilt on the platform from governed products, and retire the 17 nobody opens. A$380,000, once.":
"Opción C: mover esos 21, reconstruidos en la plataforma con productos gobernados, y retirar los 17 que nadie abre. A$380,000, una vez.",
"C is the one Helena recommends. A and B stay on the page, so the council can see why.":
"C es la que Helena recomienda. A y B se quedan en la página, para que el consejo vea por qué.",
"Then the costs, once and every year: the canal's case counted its tolls, not only the digging.":
"Luego los costos, una vez y cada año: el caso del canal contó sus peajes, no solo la excavación.",
"Running the 21 rebuilt reports will cost about A$40,000 a year, from the platform's own cost records.":
"Mantener los 21 reportes reconstruidos costará unos A$40,000 al año, según los registros de costos de la plataforma.",
"So A$310,000 a year stops, and A$40,000 starts: a saving of A$270,000 a year, from January 2028.":
"Así, dejan de pagarse A$310,000 al año y empiezan A$40,000: un ahorro de A$270,000 al año, desde enero de 2028.",
"The A$380,000 is paid back in about 17 months: the case's payback, the time until the saving covers the cost.":
"Los A$380,000 se recuperan en unos 17 meses: el periodo de recuperación, el tiempo hasta que el ahorro cubre el costo.",
"Over five years, it saves A$970,000.":
"En cinco años, ahorra A$970,000.",
"Rohan Desai, Finance's management accountant, checks every figure before it goes to the council.":
"Rohan Desai, contador de gestión de Finanzas, revisa cada cifra antes de que llegue al consejo.",
"Then the council can argue about the choice, not the numbers.":
"Así el consejo puede discutir la elección, no las cifras.",
"Then the benefits, each with an owner and a date.":
"Luego los beneficios, cada uno con un dueño y una fecha.",
"The saving, from January 2028, belongs to the director of digital services, whose budget pays for the licence today.":
"El ahorro, desde enero de 2028, es de quien dirige los servicios digitales, cuyo presupuesto paga hoy la licencia.",
"Some benefits aren't money.":
"Algunos beneficios no son dinero.",
"Every report reads one staff list, not the warehouse's old copy: Ingrid Holm in HR owns that, from December.":
"Cada reporte lee una sola lista de personal, no la vieja copia del almacén: eso es de Ingrid Holm, de RR. HH., desde diciembre.",
"And every report has an owner, named in the catalog by March 2028: that benefit is Helena's.":
"Y cada reporte tiene un dueño, nombrado en el catálogo para marzo de 2028: ese beneficio es de Helena.",
"Benefits management, as John Ward and Elizabeth Daniel describe it, adds one more step: track the benefits after the decision.":
"La gestión de beneficios, como la describen John Ward y Elizabeth Daniel, añade un paso más: seguir los beneficios tras la decisión.",
"Each quarter, the council will see each benefit against its date. Without that, the case was only a pitch.":
"Cada trimestre, el consejo verá cada beneficio frente a su fecha. Sin eso, el caso era solo un argumento de venta.",
"Tuesday 25 May. The data council meets.":
"Martes 25 de mayo. Se reúne el consejo de datos.",
"Helena has ten minutes and one page, with Rohan beside her.":
"Helena tiene diez minutos y una página, con Rohan a su lado.",
"The page leads with the decision; the leading data people module shows how to write one.":
"La página empieza por la decisión; el módulo Liderar equipos de datos enseña a escribir una.",
"Then the ask, said plainly: A$380,000 and two of the team for six months, and a decision today.":
"Luego la petición, dicha claramente: A$380,000 y dos personas del equipo por seis meses, y una decisión hoy.",
"Mei, from the registrar's office, asks what waiting a year would cost.":
"Mei, de registro académico, pregunta cuánto costaría esperar un año.",
"The answer is on the page: waiting is option A, three more years of the old licence, A$930,000.":
"La respuesta está en la página: esperar es la opción A, tres años más de la vieja licencia, A$930,000.",
"The council says yes, that day.":
"El consejo dice que sí, ese mismo día.",
"The Erie Canal's case put one decision plainly: the route, the cost, and how it would be paid back.":
"El caso del canal de Erie planteó una decisión con claridad: la ruta, el costo, y cómo se pagaría.",
"Its tolls repaid it within ten years. Helena's case should repay itself in 17 months, and the council will see it every quarter.":
"Sus peajes lo pagaron en diez años. El caso de Helena debería pagarse en 17 meses, y el consejo lo verá cada trimestre.",
"On Monday, start from the decision you need.":
"El lunes, empieza por la decisión que necesitas.",
"Always show the option of carrying on as now.":
"Muestra siempre la opción de seguir como hasta ahora.",
"Count running costs, not only building.":
"Cuenta los costos de operar, no solo los de construir.",
"Give each benefit an owner and a date, and track it after.":
"Dale a cada beneficio un dueño y una fecha, y síguelo después.",
"Have Finance check the money. One page, ten minutes, and ask for a decision, with a date.":
"Pide a Finanzas que revise el dinero. Una página, diez minutos, y pide una decisión, con fecha.",
"Options, costs, benefits with owners, and one clear ask.":
"Opciones, costos, beneficios con dueño, y una petición clara."
});
