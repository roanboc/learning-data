/* A path for every provider: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Port Newark, New Jersey, in April 1956.":
"Port Newark, Nueva Jersey, en abril de 1956.",
"A trucking man, Malcom McLean, sends an old tanker, the Ideal X, to Houston with 58 metal boxes on its deck.":
"Un transportista, Malcom McLean, envía un viejo petrolero, el Ideal X, a Houston con 58 cajas de metal en cubierta.",
"Each box is lifted on and off whole, by crane, instead of sack by sack and crate by crate.":
"Cada caja se sube y se baja entera, con una grúa, en vez de saco a saco y cajón a cajón.",
"By McLean's own figures, loading costs under 16 cents a ton, against $5.83 by hand.":
"Según las cifras de McLean, cargar cuesta menos de 16 centavos por tonelada, frente a 5,83 dólares a mano.",
"But a box needs a crane strong enough to lift it, at both ends of the trip.":
"Pero una caja necesita una grúa con fuerza para alzarla, en los dos extremos del viaje.",
"Few ports have one, and building one takes years, and money most of them don't have.":
"Pocos puertos tienen una, y construirla lleva años y dinero que la mayoría no tiene.",
"For those ports, the box changes nothing: ships still sit at the quay for days, unloaded by hand, and their goods cost more.":
"Para esos puertos, la caja no cambia nada: los barcos pasan días en el muelle, se descargan a mano, y sus mercancías cuestan más.",
"Something has to change, or the box will stop wherever the cranes do.":
"Algo tiene que cambiar, o la caja se detendrá donde se detengan las grúas.",
"In October 1957, McLean's company sends out a rebuilt ship, the Gateway City, with two cranes of its own.":
"En octubre de 1957, la empresa de McLean hace zarpar un barco reformado, el Gateway City, con dos grúas propias.",
"They run on rails along its deck, and reach out over the quay.":
"Corren sobre rieles a lo largo de la cubierta y se extienden sobre el muelle.",
"Now a port with a quay can take boxes, crane or not.":
"Ahora un puerto con muelle puede recibir cajas, tenga grúa o no.",
"Over the years, ports build cranes of their own, and the ships' cranes are no longer needed there.":
"Con los años, los puertos construyen sus propias grúas, y allí ya no hacen falta las de los barcos.",
"Ships with their own cranes still call at ports that have none.":
"Los barcos con grúas propias aún hacen escala en puertos que no tienen.",
"The box's savings reached each port before it could meet the standard, and each port joined the standard when it could.":
"El ahorro de la caja llegó a cada puerto antes de que pudiera cumplir el estándar, y cada puerto se sumó al estándar cuando pudo.",
"Data has its standard ways too, and providers who can't meet them yet.":
"Los datos también tienen sus formas estándar, y proveedores que aún no pueden cumplirlas.",
"A path for each of them lets their data arrive now, not after every one of them catches up.":
"Un camino para cada uno deja que sus datos lleguen ya, no cuando todos se pongan al día.",
"These films borrow from architecture to run a data team's services. This one is about the data coming in.":
"Estas películas toman de la arquitectura para dirigir los servicios de un equipo de datos. Esta trata de los datos que llegan.",
"June 2027, at a university, a year from now.":
"Junio de 2027, en una universidad, dentro de un año.",
"Helena Novak, the data manager, and Noor Rahman, the data architect, write the team's preferred way to receive data, on one page.":
"Helena Novak, la gestora de datos, y Noor Rahman, la arquitecta de datos, escriben en una página la forma preferida de recibir datos.",
"The source publishes its data as a governed product, with an owner and a contract.":
"La fuente publica sus datos como un producto gobernado, con un dueño y un contrato.",
"It sends each change as an event, the moment it happens.":
"Envía cada cambio como un evento, en el momento en que ocurre.",
"And it says what was deleted, so a deletion reaches every copy.":
"Y dice qué se borró, para que un borrado llegue a cada copia.",
"Contracts and deletions have films of their own: Moving is easy, agreeing is the work, and Deleted means deleted.":
"Los contratos y los borrados tienen sus propias películas: Mover es fácil, acordar es el trabajo, y Borrado es borrado.",
"Sam Okafor, who runs the data platform, lists the systems the team takes data from.":
"Sam Okafor, que lleva la plataforma de datos, enumera los sistemas de los que el equipo toma datos.",
"The rooms' sensors can do all of it.":
"Los sensores de las aulas pueden hacerlo todo.",
"Payroll, on a system from 2004, sends one file a night.":
"La nómina, en un sistema de 2004, envía un archivo cada noche.",
"The new timetable, bought as a service in 2026, can give its changes, but can't say what was deleted.":
"El horario nuevo, comprado como servicio en 2026, puede dar sus cambios, pero no puede decir qué se borró.",
"And the Faculty of Health books its nine clinical labs in a spreadsheet.":
"Y la Facultad de Salud reserva sus nueve laboratorios clínicos en una hoja de cálculo.",
"Old systems fall short of the preferred way, and so do new ones.":
"Los sistemas viejos no llegan a la forma preferida, y los nuevos tampoco.",
"So the page gets a second half: a decision tree, for the providers who can't meet it.":
"Así que la página tiene una segunda mitad: un árbol de decisión, para los proveedores que no pueden cumplirla.",
"First: can it send each change as an event? Then use the events.":
"Primero: ¿puede enviar cada cambio como un evento? Entonces usa los eventos.",
"If not, can it give its changes since a given time? Then fetch them every hour.":
"Si no, ¿puede dar sus cambios desde un momento dado? Entonces tráelos cada hora.",
"Can it say what was deleted? If not, compare its full list with ours every night. What's gone from its list was deleted.":
"¿Puede decir qué se borró? Si no, compara cada noche su lista completa con la nuestra. Lo que falta en su lista se borró.",
"Only a file? Take the whole file each night, and compare it the same way.":
"¿Solo un archivo? Toma el archivo entero cada noche y compáralo igual.",
"A spreadsheet? A data partner moves it into a governed table, with an owner.":
"¿Una hoja de cálculo? Un referente de datos la pasa a una tabla gobernada, con un dueño.",
"The first paths have names: event-driven integration, and change data capture.":
"Los primeros caminos tienen nombre: integración por eventos y captura de cambios de datos.",
"Every branch ends in a recommendation, and every path still keeps a contract with an owner.":
"Cada rama termina en una recomendación, y cada camino mantiene un contrato con un dueño.",
"The tree is kept as text in the team's repository, and its picture is drawn from it.":
"El árbol se guarda como texto en el repositorio del equipo, y su imagen se dibuja a partir de él.",
"Monday 14 June: Sam tests the new timetable.":
"Lunes 14 de junio: Sam prueba el horario nuevo.",
"Mei Tanaka, in the registrar's office, cancels a class. The hourly changes never mention it.":
"Mei Tanaka, de la oficina de registro, cancela una clase. Los cambios de cada hora nunca lo mencionan.",
"So on the platform, the class stays booked.":
"Así que en la plataforma, la clase sigue reservada.",
"Graham Ellis, the Director of Facilities, would see a booked room with nobody in it: a room that looks wasted, when it was free all along.":
"Graham Ellis, director de Instalaciones, vería un aula reservada y vacía: un aula que parece desperdiciada, cuando siempre estuvo libre.",
"The vendor can add deletions to its changes, but not before its renewal, in 2028.":
"El proveedor puede sumar los borrados a sus cambios, pero no antes de su renovación, en 2028.",
"The tree has the answer: the changes every hour, and the full list of bookings every night.":
"El árbol tiene la respuesta: los cambios cada hora, y la lista completa de reservas cada noche.",
"Each night, a booking on the platform that's missing from the full list is marked deleted.":
"Cada noche, una reserva de la plataforma que falta en la lista completa se marca como borrada.",
"The new timetable goes live on Monday 19 July.":
"El horario nuevo entra en servicio el lunes 19 de julio.",
"By Friday 30 July, the first week of teaching, the nightly comparison has found 212 deleted bookings the changes never mentioned.":
"Al viernes 30 de julio, primera semana de clases, la comparación nocturna ya halló 212 reservas borradas que los cambios no mencionaron.",
"212 hours that would have looked booked and empty on Graham's page stay off it.":
"212 horas que habrían parecido reservadas y vacías en la página de Graham quedan fuera de ella.",
"The rooms' sensors take the preferred way: each hour's count arrives as an event.":
"Los sensores de las aulas siguen la forma preferida: el conteo de cada hora llega como un evento.",
"Payroll's file is taken whole each night and compared, for Finance's casual staff costs.":
"El archivo de la nómina se toma entero cada noche y se compara, para los costos de personal eventual de Finanzas.",
"A weaker path is checked more often.":
"Un camino más débil se revisa más a menudo.",
"If a night's file is much smaller than the night before, the comparison stops, and asks a person.":
"Si el archivo de una noche es mucho más pequeño que el de la anterior, la comparación se detiene y pregunta a una persona.",
"On Tuesday 24 August, payroll's file arrives cut short, and the check stops it before 2,400 staff are marked as gone.":
"El martes 24 de agosto, el archivo de la nómina llega cortado, y la revisión lo detiene antes de que 2400 empleados se den por idos.",
"Anil Kurian, the Faculty of Health's data partner, moves the labs' spreadsheet into a governed table, and owns it.":
"Anil Kurian, referente de datos de la Facultad de Salud, pasa la hoja de los laboratorios a una tabla gobernada, y es su dueño.",
"And each provider is asked for its next step up, in writing.":
"Y a cada proveedor se le pide, por escrito, su siguiente paso hacia arriba.",
"The timetable: its deletions, in the 2028 renewal. Payroll: a file of its changes, at its next upgrade. The labs: into the timetable.":
"El horario: sus borrados, en la renovación de 2028. La nómina: un archivo de cambios, en su próxima mejora. Los laboratorios: al horario.",
"The team lifts its providers towards the preferred way, a step at a time.":
"El equipo eleva a sus proveedores hacia la forma preferida, paso a paso.",
"But it never holds the data back, waiting for the ideal.":
"Pero nunca retiene los datos esperando lo ideal.",
"On Thursday 30 September, Graham's page shows every teaching room and every lab, from four sources, by four paths.":
"El jueves 30 de septiembre, la página de Graham muestra cada aula y cada laboratorio, de cuatro fuentes, por cuatro caminos.",
"Graham doesn't see the paths. He sees counts he can trust.":
"Graham no ve los caminos. Ve conteos en los que puede confiar.",
"And Helena's page is still one page: the preferred way, the tree, and each provider's next step.":
"Y la página de Helena sigue siendo una: la forma preferida, el árbol y el siguiente paso de cada proveedor.",
"The Gateway City took its own cranes to ports that had none, and the box reached them years before their cranes did.":
"El Gateway City llevó sus propias grúas a puertos que no tenían, y la caja les llegó años antes que sus grúas.",
"Helena's team did the same: a path for every provider, and Graham's counts true from the first week.":
"El equipo de Helena hizo lo mismo: un camino para cada proveedor, y los conteos de Graham ciertos desde la primera semana.",
"On Monday, write your preferred way on one page.":
"El lunes, escribe tu forma preferida en una página.",
"Draw the tree for the providers who can't meet it, each branch with its recommendation.":
"Dibuja el árbol para los proveedores que no pueden cumplirla, cada rama con su recomendación.",
"Ask each provider for its next step up, in its contract or its renewal.":
"Pide a cada proveedor su siguiente paso hacia arriba, en su contrato o en su renovación.",
"Check the weaker paths more often, and don't hold value back.":
"Revisa más a menudo los caminos más débiles, y no retengas el valor.",
"One preferred way, a path for every provider, and value first.":
"Una forma preferida, un camino para cada proveedor, y el valor primero."
});
