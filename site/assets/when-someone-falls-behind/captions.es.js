/* When someone falls behind: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md has them: el equipo, la gestora de datos, una reunión uno a uno, un objetivo (a person's own), una medida (the
   team's). In Fremont: la planta, la línea, las quejas, el cordón, un jefe de equipo. At the university: el antiguo almacén de datos, la plataforma,
   los informes, escritos como código y revisados, los días desde una solicitud hasta el primer uso, el desarrollador de informes. The films named
   keep the Spanish titles this film assumes for them (El equipo primero, Hacer crecer a las personas). Tú, as the film speaks to the viewer
   (lee, pregunta, despeja, deja). Dates in words as Spanish says them (miércoles 26 de mayo). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Fremont, California, in 1982.":
"Fremont, California, en 1982.",
"General Motors closes its car plant there, and thousands of workers lose their jobs.":
"General Motors cierra allí su planta de autos, y miles de trabajadores pierden su empleo.",
"The plant had a name as one of the worst in the country.":
"La planta tenía fama de ser una de las peores del país.",
"On a normal day, one worker in five didn't come in, and complaints ran into the thousands.":
"Un día normal, uno de cada cinco trabajadores no venía, y las quejas se contaban por miles.",
"Cars left the line with parts missing, or fitted wrong.":
"Los autos salían de la línea con piezas que faltaban, o mal puestas.",
"Many said the problem was the workers.":
"Muchos decían que el problema eran los trabajadores.",
"For the people who bought those cars, it meant faults to fix. For the workers, it meant no job, and a name that followed them.":
"Para quien compraba esos autos, eran fallas que arreglar. Para los trabajadores, no tener empleo, y una fama que los seguía.",
"Something had to change.":
"Algo tenía que cambiar.",
"In 1984, General Motors and Toyota reopen the plant together, as NUMMI.":
"En 1984, General Motors y Toyota reabren juntas la planta, como NUMMI.",
"More than eight in ten of its new workers are the same people, hired back.":
"Más de ocho de cada diez de sus nuevos trabajadores son las mismas personas, contratadas de nuevo.",
"Groups of thirty fly to a Toyota plant in Japan, and work beside the people there for two weeks.":
"Grupos de treinta viajan a una planta de Toyota en Japón, y trabajan dos semanas junto a la gente de allí.",
"Back in Fremont, they work in small teams, and a team leader steps in whenever something goes wrong.":
"De vuelta en Fremont, trabajan en equipos pequeños, y un jefe de equipo ayuda cada vez que algo sale mal.",
"Anyone can pull a cord above the line to call for help. If the problem isn't fixed, the line stops.":
"Cualquiera puede tirar de un cordón sobre la línea para pedir ayuda. Si el problema no se resuelve, la línea se para.",
"Within two years, its cars have about as few faults as those Toyota builds in Japan.":
"En dos años, sus autos tienen casi tan pocas fallas como los que Toyota fabrica en Japón.",
"Absence and complaints fall steeply. One study found the old way would need half as many workers again to build the same car.":
"Las ausencias y las quejas caen en picada. Un estudio vio que a la antigua harían falta un 50% más de trabajadores para el mismo auto.",
"Managers had seen the absences. Workers had seen a line that never stopped, and nobody to help. Both were right about what they saw.":
"Los gerentes veían las ausencias. Los trabajadores, una línea que nunca paraba y nadie que ayudara. Los dos tenían razón en lo que veían.",
"The same people, in a different system, did some of the best work in the country.":
"Las mismas personas, en otro sistema, hicieron uno de los mejores trabajos del país.",
"When someone's work falls behind, look first at what surrounds them.":
"Cuando el trabajo de alguien se queda atrás, mira primero lo que lo rodea.",
"What they were taught, what's in their way, and what they're asked to do.":
"Lo que le enseñaron, lo que le estorba, y lo que se le pide hacer.",
"At the university, a year from now, the data team moves its reports off the old warehouse.":
"En la universidad, dentro de un año, el equipo de datos saca sus informes del antiguo almacén de datos.",
"Each report is now written as code on the platform, and reviewed before anyone reads it.":
"Cada informe se escribe ahora como código en la plataforma, y se revisa antes de que alguien lo lea.",
"The team's days from a request to first use fall from 41 in February to 24 by June.":
"Los días del equipo desde una solicitud hasta el primer uso bajan de 41 en febrero a 24 en junio.",
"Tomás Ortega, the report developer, built most of the old reports. He knows every one, and who reads it.":
"Tomás Ortega, el desarrollador de informes, hizo casi todos los informes antiguos. Conoce cada uno, y a quién lo lee.",
"His work speeds up too, but less, and unevenly: some weeks keep pace with the team, others go back for changes.":
"Su trabajo también se acelera, pero menos, y de forma desigual: unas semanas va al ritmo del equipo, otras vuelve para cambios.",
"Helena Novak, the data manager, first read the team as a whole, as The team comes first showed.":
"Helena Novak, la gestora de datos, primero miró al equipo como un todo, como mostró El equipo primero.",
"Its shared work is going well. One person's is falling behind it.":
"Su trabajo en conjunto va bien. El de una persona se está quedando atrás.",
"Before she judges, she asks.":
"Antes de juzgar, pregunta.",
"Two old books give her the questions.":
"Dos libros antiguos le dan las preguntas.",
"Robert Mager and Peter Pipe asked: could they do it if they had to? If not, it's a skill. If they could, something is in the way.":
"Robert Mager y Peter Pipe preguntaban: ¿podría hacerlo si tuviera que hacerlo? Si no, es una habilidad. Si sí, algo le estorba.",
"Thomas Gilbert said: look at what surrounds the work, its information, its tools and its rewards, before you look at the person.":
"Thomas Gilbert decía: mira lo que rodea al trabajo, su información, sus herramientas y sus recompensas, antes de mirar a la persona.",
"In his one-to-one on Wednesday 26 May, Helena asks Tomás what's getting in his way.":
"En su reunión uno a uno del miércoles 26 de mayo, Helena le pregunta a Tomás qué le está estorbando.",
"The first cause is training. The tools changed, and nobody taught them.":
"La primera causa es la formación. Las herramientas cambiaron, y nadie las enseñó.",
"The others learned by doing, while Tomás kept the old reports running.":
"Los demás aprendieron haciendo, mientras Tomás mantenía en marcha los informes antiguos.",
"So he pairs with Jun twice a week, and his Thursday learning time is protected. He'd been giving it up to clear his list.":
"Así que trabaja en pareja con Jun dos veces por semana, y se protege su tiempo de aprender del jueves. Lo cedía para vaciar su lista.",
"The second is fit for the role. His strength is the people who read the reports, more than the code behind them.":
"La segunda es el encaje con el rol. Su fuerte son las personas que leen los informes, más que el código que hay detrás.",
"So the readers' release notes and their training become his, while he keeps building.":
"Así que las notas de cada versión y la formación de los lectores pasan a ser suyas, mientras sigue construyendo.",
"In June, he tells Helena he's having a hard time at home. Nobody needs to know more.":
"En junio, le cuenta a Helena que está pasando un momento difícil en casa. Nadie necesita saber más.",
"That's a good reason too, and it asks for patience. For two months his load is lighter, and nobody asks for more.":
"Esa también es una buena razón, y pide paciencia. Durante dos meses su carga es menor, y nadie le pide más.",
"At NUMMI, pulling the cord brought help, not blame. Helena's part is the same: clear what's in the way.":
"En NUMMI, tirar del cordón traía ayuda, no culpa. El papel de Helena es el mismo: despejar lo que estorba.",
"Amy Edmondson calls it psychological safety: people say what's wrong when it's safe to.":
"Amy Edmondson lo llama seguridad psicológica: la gente dice lo que está mal cuando es seguro decirlo.",
"How far behind is he? Not behind Helena's expectations: behind the team.":
"¿Cuánto se ha quedado atrás? No respecto de lo que Helena espera: respecto del equipo.",
"In February, before the move, Tomás took 40 days from a request to first use. The team took 41.":
"En febrero, antes del cambio, Tomás tardaba 40 días desde una solicitud hasta el primer uso. El equipo, 41.",
"By June, the new tools had brought the team to 24. Tomás was at 35.":
"En junio, las nuevas herramientas habían llevado al equipo a 24. Tomás estaba en 35.",
"He had improved. The team had improved faster, because the tools lifted everyone.":
"Él había mejorado. El equipo había mejorado más rápido, porque las herramientas ayudaron a todos.",
"So his gap is read against the team's own change, never against a colleague, and it stays between him and Helena.":
"Así que su brecha se mide contra el propio cambio del equipo, nunca contra un compañero, y queda entre él y Helena.",
"Tomás writes his own plan: what he'll learn, by when, and what he needs. Helena agrees it.":
"Tomás escribe su propio plan: qué aprenderá, para cuándo, y qué necesita. Helena lo acepta.",
"They read it together on the first Wednesday of each month.":
"Lo leen juntos el primer miércoles de cada mes.",
"The gains come unevenly. September goes well. In October, a report goes back twice.":
"Los avances llegan de forma desigual. Septiembre va bien. En octubre, un informe vuelve dos veces.",
"By December, the team is at 14 days, and Tomás at 20. The gap has closed by about half.":
"En diciembre, el equipo está en 14 días, y Tomás en 20. La brecha se ha cerrado más o menos a la mitad.",
"On Wednesday 15 December, Helena says it plainly: the plan goes on into 2028.":
"El miércoles 15 de diciembre, Helena lo dice con claridad: el plan sigue en 2028.",
"And if building reports stops being where he's strongest, they'll talk about a role that fits him better. He hears it now, not later.":
"Y si hacer informes deja de ser su fuerte, hablarán de un rol que le encaje mejor. Lo escucha ahora, no más tarde.",
"Lifting someone's work can take months, or even years. Patience is part of the plan.":
"Mejorar el trabajo de alguien puede llevar meses, o incluso años. La paciencia es parte del plan.",
"Through all of it, his measures are his own, and his reasons stay private.":
"En todo momento, sus medidas son suyas, y sus razones siguen siendo privadas.",
"At NUMMI, the people didn't change first. What surrounded them did, and then their work did.":
"En NUMMI, las personas no cambiaron primero. Cambió lo que las rodeaba, y después su trabajo.",
"Helena did the same: she found the causes, cleared what she could, and gave it time.":
"Helena hizo lo mismo: encontró las causas, despejó lo que pudo, y le dio tiempo.",
"On Monday, read the team's shared work before anyone's own.":
"El lunes, mira el trabajo en conjunto del equipo antes que el de cada uno.",
"Ask before you judge, and look for the cause: training, fit, or a hard time.":
"Pregunta antes de juzgar, y busca la causa: formación, encaje, o un momento difícil.",
"Clear the blockers first, and measure against the team's change, not your expectations.":
"Despeja primero los obstáculos, y mide contra el cambio del equipo, no contra lo que esperas.",
"Let them write the plan, read it each month, and say honestly where it's going.":
"Deja que escriban el plan, léanlo cada mes, y di con honestidad hacia dónde va.",
"Growing people, the next film, follows the everyday case: goals, feedback, and a next step.":
"Hacer crecer a las personas, la próxima película, sigue el caso de cada día: objetivos, comentarios, y un siguiente paso.",
"Find the cause, clear the way, and give it time.":
"Encuentra la causa, despeja el camino, y dale tiempo."
});
