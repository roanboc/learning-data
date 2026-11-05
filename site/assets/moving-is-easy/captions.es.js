/* Moving is easy, agreeing is the work: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's pages and the earlier films: el sistema de RR. HH., Finanzas, el sistema financiero, la plataforma, el periodo lectivo, la arquitecta
   de datos (Noor), que dirige la plataforma (Sam), una consulta en su sitio, un conector gestionado, un espejo, bronce, ocasional for casual. New here: el ancho
   de vía for a railway's gauge, Nueva Gales del Sur, el contrato for both Linh's contract and the contract at an interface, as the English says. The films the
   narration names keep their Spanish titles (La vida interior de los datos, Productos en formatos abiertos, El mercado de datos, Cambio silencioso; Una plataforma
   que se vigila a sí misma until that film names itself). Names on screen stay as they are: pay_type, CAS, FT, CON, HI101, T-26188, Enterprise Integration
   Patterns, Open Data Contract Standard, Microsoft Fabric, Databricks, dbt. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"June 1883, on the Murray River, the border between two British colonies: New South Wales and Victoria.":
"Junio de 1883, en el río Murray, la frontera entre dos colonias británicas: Nueva Gales del Sur y Victoria.",
"At Albury, a new bridge joins the railway from Sydney to the railway from Melbourne.":
"En Albury, un puente nuevo une el ferrocarril de Sídney con el ferrocarril de Melbourne.",
"But each colony had built its railway to its own gauge: the distance between the two rails.":
"Pero cada colonia había construido su ferrocarril con su propio ancho de vía: la distancia entre los dos rieles.",
"Victoria's rails were about a hand's length further apart, so no train could run on both.":
"Los rieles de Victoria estaban casi un palmo más separados: ningún tren podía circular por ambos.",
"At Albury, every passenger had to change trains, and every crate and bale of wool was lifted into another wagon.":
"En Albury, cada pasajero tenía que cambiar de tren, y cada cajón y fardo de lana se pasaba a mano a otro vagón.",
"It cost travellers time, and traders money, on every journey.":
"Costaba tiempo a los viajeros, y dinero a los comerciantes, en cada viaje.",
"Each colony had its reasons: New South Wales changed its gauge with a new engineer, and Victoria kept the one both had first chosen.":
"Cada colonia tuvo sus razones: Nueva Gales del Sur cambió de ancho con un ingeniero nuevo; Victoria mantuvo el que ambas eligieron antes.",
"For 79 years, everything stopped at Albury. Something had to change.":
"Durante 79 años, todo se detuvo en Albury. Algo tenía que cambiar.",
"In 1962, Australia's government, with New South Wales and Victoria, opened a new line from Albury to Melbourne, built to one agreed gauge.":
"En 1962, el gobierno de Australia, con Nueva Gales del Sur y Victoria, abrió una línea de Albury a Melbourne, con un solo ancho acordado.",
"Freight ran straight through that January, and from April, passengers did too, with nobody changing trains.":
"La carga pasó sin detenerse ese enero, y desde abril también los pasajeros, sin que nadie cambiara de tren.",
"Within a year, the freight it carried had grown by a third.":
"En un año, la carga que transportaba había crecido un tercio.",
"At the university, HR's contracts once reached Finance as a file each teaching period.":
"En la universidad, los contratos de RR. HH. llegaban antes a Finanzas como un archivo cada periodo lectivo.",
"Rohan Desai's team spent two days working out what each column meant.":
"El equipo de Rohan Desai pasaba dos días averiguando qué significaba cada columna.",
"Moving the data was never the hard part. Agree what it means, once, and it passes straight through.":
"Mover los datos nunca fue lo difícil. Acuerda qué significan, una vez, y pasan sin detenerse.",
"Modern data basics is about what the tools now make easier.":
"Lo básico de los datos modernos trata de lo que las herramientas hoy facilitan.",
"Moving data, running a platform, serving data to people and agents, and reading documents all used to take whole teams.":
"Mover datos, operar una plataforma, servir datos a personas y agentes, y leer documentos antes exigía equipos enteros.",
"Databricks and dbt now do much of it.":
"Hoy Databricks y dbt hacen gran parte de eso.",
"Each film shows what got easier, what still needs people to agree, and where the official docs take you next.":
"Cada película muestra qué se facilitó, qué aún requiere que las personas acuerden, y adónde te lleva la documentación oficial.",
"We don't go deep, on purpose: courses and the official docs do that, and they stay up to date.":
"No profundizamos, a propósito: eso lo hacen los cursos y la documentación oficial, que se mantienen al día.",
"These films give the architectural advice: what matters, what to choose, and why.":
"Estas películas dan el consejo de arquitectura: qué importa, qué elegir y por qué.",
"Our story follows one contract. Linh Nguyen tutors HI101 this semester, on contract T-26188.":
"Nuestra historia sigue un contrato. Linh Nguyen es tutora de HI101 este semestre, con el contrato T-26188.",
"It was born in the HR system, which sends its data in two shapes, as The Inner Life of Data shows.":
"Nació en el sistema de RR. HH., que envía sus datos en dos formas, como muestra La vida interior de los datos.",
"Events: each change as it's made. HR recorded Linh's contract on 14 July, and it reached the platform as one change.":
"Eventos: cada cambio en cuanto se hace. RR. HH. registró el contrato de Linh el 14 de julio, y llegó a la plataforma como un cambio.",
"And batches: on 20 July, the first day of the teaching period, the HR system sent its whole file again.":
"Y lotes: el 20 de julio, primer día del periodo lectivo, el sistema de RR. HH. volvió a enviar su archivo completo.",
"Events, messages and batches have had names since Hohpe and Woolf's Enterprise Integration Patterns, over twenty years ago.":
"Eventos, mensajes y lotes tienen nombre desde Enterprise Integration Patterns, de Hohpe y Woolf, hace más de veinte años.",
"What changed is how little it now takes to move them.":
"Lo que cambió es lo poco que hoy cuesta moverlos.",
"A managed connector brings a system's data in.":
"Un conector gestionado trae los datos de un sistema.",
"Sam Okafor, who runs the platform, picked the HR system and the tables to bring.":
"Sam Okafor, que dirige la plataforma, eligió el sistema de RR. HH. y las tablas que traer.",
"The connector reads only what changed, tries again when a read fails, and keeps its place.":
"El conector lee solo lo que cambió, reintenta cuando una lectura falla y no pierde su lugar.",
"Linh's contract lands in bronze, just as the HR system sent it.":
"El contrato de Linh llega a bronce, tal como lo envió el sistema de RR. HH.",
"A query in place reads another system without copying it in.":
"Una consulta en su sitio lee otro sistema sin copiarlo.",
"Finance's general ledger stays in the finance system, and the platform reads it there, without changing it.":
"El libro mayor de Finanzas se queda en el sistema financiero, y la plataforma lo lee ahí, sin cambiarlo.",
"For large volumes, or quick answers, the docs recommend a connector instead.":
"Para grandes volúmenes, o respuestas rápidas, la documentación recomienda un conector.",
"A mirror goes the other way: it shows the university's catalog in another team's tool, without copying it out.":
"Un espejo va en sentido contrario: muestra el catálogo de la universidad en la herramienta de otro equipo, sin copiarlo.",
"Rohan works in Microsoft Fabric, and the platform's tables appear there, read where they live.":
"Rohan trabaja en Microsoft Fabric, y las tablas de la plataforma aparecen ahí, leídas donde viven.",
"A share gives a partner the data where it lives, as Products in open formats and The marketplace showed.":
"Compartir le da a un socio los datos donde viven, como mostraron Productos en formatos abiertos y El mercado de datos.",
"And an API serves data on request: an app asks, and gets just what it needs.":
"Y una API sirve datos a pedido: una aplicación pregunta y recibe justo lo que necesita.",
"Each does what teams once built and mended by hand. Moving is easy now.":
"Cada una hace lo que antes los equipos hacían y arreglaban a mano. Mover ya es fácil.",
"So what's left for people? The contract at each interface: what the data means where two systems meet.":
"¿Qué les queda a las personas? El contrato en cada interfaz: qué significan los datos donde se unen dos sistemas.",
"Ingrid Holm, in HR, owns the HR system's data.":
"Ingrid Holm, de RR. HH., es dueña de sus datos.",
"Noor Rahman, the data architect, agrees its contract with her.":
"Noor Rahman, la arquitecta de datos, acuerda con ella su contrato.",
"First, what each field means. pay_type has three values: CAS, FT and CON.":
"Primero, qué significa cada campo. pay_type tiene tres valores: CAS, FT y CON.",
"CON means continuing, not contract. Read it wrong, and Finance counts continuing staff as casual.":
"CON significa continuo, no contrato. Si se lee mal, Finanzas cuenta al personal continuo como ocasional.",
"Second, who answers for it: Ingrid, by name.":
"Segundo, quién responde: Ingrid, con nombre propio.",
"Third, what a deletion means. When a contract is cancelled, HR deletes it.":
"Tercero, qué significa un borrado. Cuando se cancela un contrato, RR. HH. lo borra.",
"So the contract says how that arrives: as a change, with its time, never as a row that's just missing from the next file.":
"Así que el contrato dice cómo llega: como un cambio, con su hora, nunca como una fila que solo falta en el próximo archivo.",
"The platform then closes that contract, and keeps its history.":
"Luego la plataforma cierra ese contrato y conserva su historial.",
"Fourth, what's personal. Names, birth dates and emails come across, marked personal.":
"Cuarto, qué es personal. Nombres, fechas de nacimiento y correos pasan, marcados como personales.",
"Bank details and rates of pay never leave HR.":
"Datos bancarios y tarifas de pago nunca salen de RR. HH.",
"They write it down in the Open Data Contract Standard, and Jun Park's tests check every row against it.":
"Lo escriben en el Open Data Contract Standard, y las pruebas de Jun Park revisan cada fila contra él.",
"Silent change shows what happens when a new value arrives, and only one side knows what it means.":
"Cambio silencioso muestra qué pasa cuando llega un valor nuevo y solo un lado sabe qué significa.",
"And A platform that watches itself shows a night when a field changes, and its contract doesn't.":
"Y Una plataforma que se vigila a sí misma muestra una noche en que un campo cambia y su contrato no.",
"At Albury, the trains always ran. What took 79 years was agreeing the gauge.":
"En Albury, los trenes siempre circularon. Lo que tomó 79 años fue acordar el ancho de vía.",
"Now HR's contracts reach Rohan in Fabric the day they're made, meaning just what HR means, and nobody spends two days on them.":
"Hoy los contratos de RR. HH. llegan a Rohan en Fabric el día en que se hacen, con el sentido que les da RR. HH., y nadie pierde dos días.",
"There are already standards for this.":
"Ya existen estándares para esto.",
"Enterprise Integration Patterns for how data moves, and the Open Data Contract Standard for what it means.":
"Enterprise Integration Patterns para cómo se mueven los datos, y el Open Data Contract Standard para qué significan.",
"Don't reinvent the wheel. Investigate, adapt, implement and iterate, starting from the official docs.":
"No reinventes la rueda. Investiga, adapta, implementa e itera, partiendo de la documentación oficial.",
"If these basics are still a struggle where you work, look first at your governance or your tooling: other modules here show both.":
"Si estas bases aún te cuestan donde trabajas, mira primero tu gobierno de datos o tus herramientas: otros módulos de aquí muestran ambos.",
"Let the tools move it; spend your time on the contract.":
"Deja que las herramientas lo muevan; dedica tu tiempo al contrato."
});
