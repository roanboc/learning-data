/* More than a platform: Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   tools/audio_es.py reads those captions aloud for the Spanish page, each line in its English line's time, so each caption stays about as long as its line.
   Words as on the site's Spanish pages: inscrito for enrolled, la plataforma, el sistema de estudiantes, la plataforma de aprendizaje, Finanzas, un agente de IA,
   la ruta, and each topic by the name the Topics page gives it. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"One tap became a decision.":
"Un toque se volvió una decisión.",
"A new class opened, and 140 more students got a seat.":
"Se abrió una clase nueva, y 140 estudiantes más tuvieron cupo.",
"The platform did its job.":
"La plataforma cumplió.",
"So why, a week later, do two offices bring two numbers for the same class to the same meeting?":
"¿Por qué, una semana después, dos oficinas llevan dos cifras de la misma clase a la misma reunión?",
"Start with one word: enrolled.":
"Empieza con una palabra: inscrito.",
"In one office, with one system, it means one thing. Nobody has to ask.":
"En una oficina, con un sistema, significa una cosa. Nadie pregunta.",
"Then the university grows.":
"Luego la universidad crece.",
"The student system counts everyone who signed up.":
"El sistema de estudiantes cuenta a quien se inscribió.",
"The learning platform counts everyone who can open the course.":
"La plataforma de aprendizaje cuenta a quien puede abrir el curso.",
"Finance counts everyone who has paid.":
"Finanzas cuenta a quien ya pagó.",
"Three systems, three meanings, and each one is right.":
"Tres sistemas, tres significados, todos correctos.",
"The platform moves all three, without a fault.":
"La plataforma mueve los tres, sin una falla.",
"Now add more teams.":
"Suma más equipos.",
"Add an AI agent that answers from the same data.":
"Suma un agente de IA que responde con los mismos datos.",
"Whatever the word means now is repeated everywhere, at once, and with confidence.":
"Lo que la palabra signifique ahora se repite en todas partes, a la vez, y con seguridad.",
"The platform was never the problem.":
"La plataforma nunca fue el problema.",
"What changes the answer is how the organisation works, what was defined, and who decided.":
"Lo que cambia la respuesta es cómo trabaja la organización, qué se definió, y quién decidió.",
"So where do you start? Not with the platform.":
"¿Dónde empezar? No en la plataforma.",
"Here is the route.":
"Esta es la ruta.",
"Enterprise architecture: how does this organisation work?":
"Arquitectura empresarial: ¿cómo trabaja esta organización?",
"Data governance: who decides?":
"Gobernanza de datos: ¿quién decide?",
"Those two are the foundations.":
"Esos dos son los fundamentos.",
"Then you build.":
"Y construyes.",
"Data modelling: what does each word mean?":
"Modelado de datos: ¿qué significa cada palabra?",
"Modern data basics: how does data move, run and get served today?":
"Lo básico de los datos modernos: ¿cómo se mueven, corren y se sirven hoy?",
"Analytics engineering: how is it built, and tested?":
"Ingeniería analítica: ¿cómo se construye y se prueba?",
"Data quality: is it right, and in time?":
"Calidad de datos: ¿correctos y a tiempo?",
"Two side routes leave after the foundations.":
"Dos rutas laterales salen tras los fundamentos.",
"One is about sharing and protecting.":
"Una trata de compartir y proteger.",
"Master and reference data: is it the same student everywhere?":
"Datos maestros y de referencia: ¿es el mismo estudiante en todas partes?",
"Data protection and privacy: who may see it, and for how long?":
"Protección de datos y privacidad: ¿quién puede verlo, y por cuánto tiempo?",
"The other is about agents: what may an agent do with it?":
"La otra trata de agentes: ¿qué puede hacer un agente con ello?",
"They all meet again at the end.":
"Todas se juntan al final.",
"Data management: how does it all fit in one plan?":
"Gestión de datos: ¿cómo encaja todo en un plan?",
"And last, leading data people: who leads the people who do the work?":
"Y al final, liderar equipos de datos: ¿quién lidera a quienes hacen el trabajo?",
"People have mapped this ground before.":
"Este terreno ya tiene mapas.",
"The best known map is DAMA's wheel, with governance at its centre.":
"El mapa más conocido es la rueda de DAMA, con la gobernanza en el centro.",
"Any good map will do.":
"Cualquier buen mapa sirve.",
"This one is a route, because you have to start somewhere.":
"Este es una ruta, porque por algún lado hay que empezar.",
"At every stop there are short films. Watch one.":
"Cada parada tiene películas cortas. Mira una.",
"Let it stop and ask you a question.":
"Deja que se detenga y te pregunte.",
"Take it apart in a lab.":
"Desármala en un lab.",
"Make the call in a real situation.":
"Decide tú en una situación real.",
"Pick a goal, and the route lights up your stops.":
"Elige una meta, y la ruta ilumina tus paradas.",
"Or search for a word, and find the film that says it.":
"O busca una palabra, y halla la película que la dice.",
"What you have done stays with you, in your own browser.":
"Lo que hiciste se queda contigo, en tu navegador.",
"Platforms have matured.":
"Las plataformas maduraron.",
"The hard part is everything else.":
"Lo difícil es todo lo demás.",
"Start there.":
"Empieza ahí."
});
