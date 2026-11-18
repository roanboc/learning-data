/* No two alike: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as the module's numbers.md has them: el equipo, la gestora de datos, los cinco grandes rasgos (each a matter of degree: por grado), Cómo trabajo.
   The traits are said of a person (una persona: abierta, organizada, extrovertida, amable, estable). A type is un tipo only where the film means a test's
   types; the students "of every kind" are de toda clase. Una prueba for a test; no test is named, here or anywhere. In Lu: el maestro, los alumnos,
   frenar and impulsar for the two answers' reasons. The bridge's grass is paja, as the Peruvian study of the bridge and the series' other films say it. The next film keeps the
   series' Spanish title (El cómo, más que el quién). Numbers keep the picture's comma (2,500), as the module's other films do. Tú, as the film speaks
   to the viewer (averigua, pregúntale, escribe, arma). Dates in words as Spanish says them (lunes 15 de febrero). */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"The other films of this series follow a bridge in Peru, woven from grass.":
"Las otras películas de esta serie siguen un puente en Perú, tejido con paja.",
"This one leaves it. One blade of grass is like another, and a person isn't like anyone.":
"Esta lo deja. Una brizna de paja es como otra, y una persona no se parece a nadie.",
"So it begins in Lu, in what is now eastern China, about 2,500 years ago.":
"Por eso empieza en Lu, en lo que hoy es el este de China, hace unos 2,500 años.",
"A teacher there, Kong Qiu, whom the West calls Confucius, turns no student away.":
"Un maestro de allí, Kong Qiu, a quien Occidente llama Confucio, no rechaza a ningún alumno.",
"Whoever brings the smallest gift, a bundle of dried meat, is taught. So his students are of every kind.":
"Quien trae el regalo más pequeño, un atado de carne seca, recibe enseñanza. Así que tiene alumnos de toda clase.",
"Zilu is bold. The teacher tells him he wouldn't take to war a man who fights tigers with his bare hands.":
"Zilu es audaz. El maestro le dice que no llevaría a la guerra a quien pelea con tigres a mano limpia.",
"Ran You holds back. The teacher tells him: it isn't strength you lack. You set your own limit.":
"Ran You se contiene. El maestro le dice: no es fuerza lo que te falta. Tú mismo te pones el límite.",
"One rule for both would fail one of them.":
"Una misma regla para los dos le fallaría a uno de ellos.",
"Tell both to go ahead, and Zilu fights the tiger. Tell both to wait, and Ran You never starts.":
"Diles a los dos que avancen, y Zilu pelea con el tigre. Diles que esperen, y Ran You nunca empieza.",
"Each of them needs an answer of his own.":
"Cada uno necesita una respuesta propia.",
"One day Zilu asks: when I hear something, should I act on it at once?":
"Un día Zilu pregunta: cuando oigo algo, ¿debo actuar de inmediato?",
"The teacher says: your father and elder brothers are alive. How can you act at once?":
"El maestro dice: tu padre y tus hermanos mayores viven. ¿Cómo vas a actuar de inmediato?",
"He means: ask them first.":
"Quiere decir: pregúntales primero.",
"Then Ran You asks the very same question. The teacher says: act at once.":
"Luego Ran You hace exactamente la misma pregunta. El maestro dice: actúa de inmediato.",
"A third student, Gongxi Hua, has heard both answers. I'm confused, he says. May I ask?":
"Un tercer alumno, Gongxi Hua, oyó las dos respuestas. Estoy confundido, dice. ¿Puedo preguntar?",
"The teacher tells him: Ran You holds back, so I urged him on. Zilu has the energy of two, so I held him back.":
"El maestro le dice: Ran You se contiene, por eso lo impulsé. Zilu tiene energía por dos, por eso lo frené.",
"He has answered the person, as well as the question.":
"Respondió a la persona, además de a la pregunta.",
"Each gets the answer he needs.":
"Cada uno recibe la respuesta que necesita.",
"And asked if the two could serve in government, the teacher says yes to both: one is decisive, the other skilled.":
"Y cuando le preguntan si los dos podrían servir en el gobierno, el maestro dice que sí: uno es decidido, el otro hábil.",
"A historian later counts seventy-seven students who mastered what he taught. These two, so unlike, are both among them.":
"Un historiador cuenta después setenta y siete alumnos que dominaron lo que enseñaba. Estos dos, tan distintos, están entre ellos.",
"A data team is like that school: no two people work the same way, and one way of working for all leaves someone out.":
"Un equipo de datos es como esa escuela: no hay dos personas que trabajen igual, y una sola forma de trabajar deja a alguien fuera.",
"Find out how each one works, and the team hears what every one of them knows.":
"Averigua cómo trabaja cada persona, y el equipo escucha lo que cada una sabe.",
"At the university, in February 2027, Helena Novak is in her third week as the data manager.":
"En la universidad, en febrero de 2027, Helena Novak está en su tercera semana como gestora de datos.",
"On Monday 15 February, she and her team of seven plan the next two weeks.":
"El lunes 15 de febrero, ella y su equipo de siete planean las próximas dos semanas.",
"For the whole hour, Erin Walsh, the platform engineer, says nothing.":
"Durante toda la hora, Erin Walsh, la ingeniera de plataforma, no dice nada.",
"Helena reads it as lack of interest. It's her first guess, and it's wrong.":
"Helena lo toma como falta de interés. Es su primera suposición, y está equivocada.",
"On Tuesday morning, Erin sends her a short note: two things the plan missed.":
"El martes por la mañana, Erin le manda una nota breve: dos cosas que el plan pasó por alto.",
"One of them: two pieces of platform work can't both be tested in the same week.":
"Una de ellas: dos trabajos de la plataforma no se pueden probar en la misma semana.",
"On Wednesday, in Erin's weekly half hour, Helena asks instead of guessing: how do you work best in a meeting like Monday's?":
"El miércoles, en la media hora semanal de Erin, Helena pregunta en vez de suponer: ¿cómo trabajas mejor en una reunión como la del lunes?",
"Erin says: I think after a meeting, not in it. Send me the question the day before, and I'll come with an answer.":
"Erin dice: pienso después de una reunión, no durante. Mándame la pregunta el día anterior, y llegaré con una respuesta.",
"The teacher in Lu had known his students for years. Helena has known her team for two weeks.":
"El maestro de Lu conocía a sus alumnos desde hacía años. Helena conoce a su equipo desde hace dos semanas.",
"But a person can say how they work. So she asks.":
"Pero una persona puede decir cómo trabaja. Así que pregunta.",
"How do people differ? Most research describes it with five broad traits, often called the Big Five.":
"¿En qué se diferencian las personas? La mayoría de los estudios lo describe con cinco grandes rasgos, a menudo llamados Big Five.",
"How open to new things. How organised. How outgoing. How agreeable. How steady under pressure.":
"Qué tan abierta a lo nuevo. Qué tan organizada. Qué tan extrovertida. Qué tan amable. Qué tan estable bajo presión.",
"Each is a scale, not a box: people differ by degree, not by type.":
"Cada uno es una escala, no una casilla: las personas se diferencian por grado, no por tipo.",
"Nobody stays at one point. In one study, over two or three weeks, a typical person showed nearly every level of every trait.":
"Nadie se queda en un punto. En un estudio, en dos o tres semanas, una persona típica mostró casi todos los niveles de cada rasgo.",
"Each kept a usual level of their own, and moved around it with the situation.":
"Cada una mantuvo un nivel habitual propio, y se movió a su alrededor según la situación.",
"The years move it too: on average, people grow more organised and steadier, most of all between twenty and forty.":
"Los años también lo mueven: en promedio, la gente se vuelve más organizada y más estable, sobre todo entre los veinte y los cuarenta.",
"And the five aren't the last word: among farmers and foragers in Bolivia, researchers didn't find them.":
"Y los cinco no son la última palabra: entre agricultores y recolectores de Bolivia, los investigadores no los encontraron.",
"No place on a scale is the right one, and a team has a use for each.":
"Ningún lugar de una escala es el correcto, y a un equipo le sirve cada uno.",
"A team needs the one who rushes ahead and the one who holds back, the one who thinks aloud and the one who thinks afterwards.":
"Un equipo necesita a quien se lanza y a quien se contiene, a quien piensa en voz alta y a quien piensa después.",
"So traits are for understanding people, never for assessing them.":
"Así que los rasgos sirven para entender a las personas, nunca para evaluarlas.",
"How someone is doing shows in the results of their work, and in how the team works together.":
"Cómo le va a alguien se ve en los resultados de su trabajo, y en cómo trabaja junto el equipo.",
"On Thursday, at the team's table, Yusuf Demir has an idea.":
"El jueves, en la mesa del equipo, Yusuf Demir tiene una idea.",
"In an earlier job he took a test that sorts people into types, each with its letters. It gave his team words for their differences.":
"En otro trabajo hizo una prueba que clasifica a la gente en tipos, cada uno con sus letras. Dio a su equipo palabras para sus diferencias.",
"A type is a scale, cut in two. One side gets one label, and the other side gets another.":
"Un tipo es una escala cortada en dos. Un lado recibe una etiqueta, y el otro lado recibe otra.",
"But most people are near the middle, close to the cut.":
"Pero la mayoría de las personas está cerca del medio, junto al corte.",
"In 1991 a research council looked at one such test. Of the people who took it twice, typically four in ten got the same type again.":
"En 1991 un consejo de investigación revisó una prueba así. Al hacerla dos veces, en general cuatro de cada diez obtuvieron el mismo tipo.",
"The scores held up well enough. But near the cut, a small change in a score is a different label.":
"Los puntajes se mantuvieron bastante bien. Pero cerca del corte, un pequeño cambio en el puntaje es otra etiqueta.",
"So Helena says yes, as a way to start talking, with four rules.":
"Así que Helena dice que sí, como una forma de empezar a conversar, con cuatro reglas.",
"It's each person's choice. Your results are yours, and you share what you choose.":
"Cada persona decide si la hace. Tus resultados son tuyos, y compartes lo que tú elijas.",
"They're read as degrees, not boxes. And they're never used to hire, to hand out work or to judge anyone.":
"Se leen como grados, no como casillas. Y nunca se usan para contratar, repartir el trabajo ni juzgar a nadie.",
"The people behind that test ask for three of the four themselves.":
"Quienes están detrás de esa prueba piden ellos mismos tres de las cuatro.",
"A test can start a conversation. It can't decide anything.":
"Una prueba puede iniciar una conversación. No puede decidir nada.",
"What the team keeps is a page that each person writes in their own words: How I work.":
"Lo que el equipo conserva es una página que cada persona escribe con sus propias palabras: Cómo trabajo.",
"It has five headings. When I do my best work. How to ask me for something.":
"Tiene cinco encabezados. Cuándo hago mi mejor trabajo. Cómo pedirme algo.",
"How to disagree with me. What wears me out. What I'm getting better at.":
"Cómo discrepar conmigo. Qué me desgasta. En qué estoy mejorando.",
"Helena writes hers first, and shares it that Thursday.":
"Helena escribe la suya primero, y la comparte ese jueves.",
"Under the last heading she writes: asking, instead of guessing.":
"Bajo el último encabezado escribe: preguntar, en vez de suponer.",
"Each of the seven writes one too, and shares what they choose.":
"Cada una de las siete personas escribe también la suya, y comparte lo que elige.",
"By Friday 26 February, all seven have shared a page. Two left a heading out, and that's theirs to leave.":
"Para el viernes 26 de febrero, las siete han compartido una página. Dos dejaron un encabezado sin llenar, y están en su derecho.",
"Erin's says: ask me in writing, the day before.":
"La de Erin dice: pídemelo por escrito, el día anterior.",
"No page says what kind of person anyone is. Each says how to work with one person.":
"Ninguna página dice qué clase de persona es alguien. Cada una dice cómo trabajar con una persona.",
"Helena doesn't ask Erin to change. She changes the meeting.":
"Helena no le pide a Erin que cambie. Cambia la reunión.",
"From Monday 22 February, in every meeting she runs, the question goes out the working day before.":
"Desde el lunes 22 de febrero, en cada reunión que ella dirige, la pregunta se envía el día hábil anterior.",
"Everyone writes for two minutes before anyone talks. Then each person gets a turn.":
"Todos escriben durante dos minutos antes de que alguien hable. Luego cada persona tiene su turno.",
"And anyone can add something until the end of the next day.":
"Y cualquiera puede agregar algo hasta el final del día siguiente.",
"That Monday, Erin speaks in her turn.":
"Ese lunes, Erin habla en su turno.",
"It suits the one who thinks aloud and the one who thinks afterwards. Nobody has to become someone else.":
"Le sirve a quien piensa en voz alta y a quien piensa después. Nadie tiene que volverse otra persona.",
"The teacher held one student back and urged the other on, and a leader changes her way too.":
"El maestro frenó a un alumno e impulsó al otro, y quien lidera también cambia su manera.",
"But he decided what each one needed. Helena asks, and each person says it for themselves.":
"Pero él decidió lo que cada uno necesitaba. Helena pregunta, y cada persona lo dice por sí misma.",
"So on Monday, don't sort your people: not by a type, a test or a first impression.":
"Así que el lunes, no clasifiques a tu gente: ni por un tipo, ni por una prueba, ni por una primera impresión.",
"Ask each one how they work best. Write your own page first. And build the team's ways for the whole range.":
"Pregúntale a cada persona cómo trabaja mejor. Escribe primero tu propia página. Y arma las formas del equipo para todo el abanico.",
"What matters even more is how they work together. That's the next film: How, more than who.":
"Lo que importa aún más es cómo trabajan juntas. Esa es la próxima película: El cómo, más que el quién.",
"Ask each person how they work. Never sort them.":
"Pregúntale a cada persona cómo trabaja. Nunca las clasifiques."
});
