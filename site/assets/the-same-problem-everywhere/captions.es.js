/* The same problem, everywhere: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series: gobernanza de datos, gestión de datos, dueño, cuerpo de conocimiento; a bank's board is its junta directiva, and "the top" is la alta dirección. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Autumn 2008.":
"Otoño de 2008.",
"As the financial crisis spreads, a bank's board asks its risk team one question: if another bank fails, how much do we stand to lose?":
"La crisis financiera se extiende, y la junta de un banco pregunta a su equipo de riesgos: si quiebra otro banco, ¿cuánto podemos perder?",
"The answer is somewhere in the bank, in every business line, each with its own systems and its own names for the same customers.":
"La respuesta está en alguna parte del banco, en cada línea de negocio, cada una con sus sistemas y sus nombres para los mismos clientes.",
"By Monday, nobody can add it up.":
"Para el lunes, nadie consigue sumarlo.",
"It wasn't just one bank.":
"No fue solo un banco.",
"The regulators later found that many banks couldn't add up their risks quickly or accurately.":
"Más tarde, los reguladores vieron que muchos bancos no podían sumar sus riesgos con rapidez ni precisión.",
"The numbers were all there.":
"Los números estaban todos ahí.",
"Nobody could put them together, or say which to trust.":
"Nadie podía juntarlos, ni decir en cuáles confiar.",
"It wasn't a new problem, either.":
"Tampoco era un problema nuevo.",
"In the 1970s, companies began sharing data between departments.":
"En los 70, las empresas empezaron a compartir datos entre áreas.",
"That raised new questions: who owns this data, and who may see it?":
"Eso trajo preguntas nuevas: ¿de quién son estos datos y quién puede verlos?",
"A new job grew up to look after it: data administration, with a dictionary of what each piece of data meant.":
"Surgió un oficio nuevo para cuidarlos: la administración de datos, con un diccionario de lo que significaba cada dato.",
"In 1980, in Los Angeles, the people doing that job started meeting, to share what they'd learned.":
"En 1980, en Los Ángeles, quienes hacían ese oficio empezaron a reunirse para compartir lo aprendido.",
"Their association, DAMA, soon had chapters in city after city.":
"Su asociación, DAMA, pronto tuvo capítulos en una ciudad tras otra.",
"Every organisation had been learning the same lessons alone.":
"Cada organización había ido aprendiendo sola las mismas lecciones.",
"Now they could learn them together.":
"Ahora podían aprenderlas juntas.",
"In 2002, after accounting scandals, a law in the United States made chief executives sign for their company's figures,":
"En 2002, tras escándalos contables, una ley de Estados Unidos obligó a los directores ejecutivos a firmar las cifras de su empresa,",
"and answer for the controls behind them.":
"y a responder por los controles tras ellas.",
"Someone at the top now answered for the numbers, and for how they were made.":
"Ahora alguien de la alta dirección respondía por los números y por cómo se elaboraban.",
"In 2009, DAMA published what its members had learned, as a body of knowledge for data management: the DMBOK.":
"En 2009, DAMA publicó lo que sus miembros habían aprendido, como un cuerpo de conocimiento de gestión de datos: el DMBOK.",
"It draws the work as a wheel: architecture, modelling, security, quality, metadata, and more.":
"Dibuja el trabajo como una rueda: arquitectura, modelado, seguridad, calidad, metadatos y más.",
"At the centre, like a hub, is governance.":
"En el centro, como un eje, está la gobernanza.",
"The other areas only fit together, and stay in balance, when someone has the authority to decide.":
"Las demás áreas solo encajan, y se mantienen en equilibrio, cuando alguien tiene autoridad para decidir.",
"Other guides cover the same ground, or part of it.":
"Otras guías cubren el mismo terreno, o parte de él.",
"This series takes what they agree on, and shows it at work.":
"Esta serie toma aquello en lo que coinciden y lo muestra en acción.",
"After the crisis, the banks' regulators wrote principles for their data, and the first was governance: a condition for all the rest.":
"Tras la crisis, los reguladores escribieron principios para los datos de los bancos; el primero, la gobernanza: condición de todo lo demás.",
"Someone had to own the bank's risk data, and answer for its quality.":
"Los datos de riesgo debían tener un dueño que respondiera por su calidad.",
"Ten years later, only two of thirty-one of the world's biggest banks met them all.":
"Diez años después, solo dos de los treinta y un bancos más grandes del mundo los cumplían todos.",
"Their programmes were often underfunded, narrow, and short of attention from their boards.":
"Sus programas solían tener poco presupuesto, poco alcance y poca atención de sus juntas directivas.",
"Making data add up takes more than systems.":
"Que los datos cuadren requiere más que sistemas.",
"It takes decisions, money, and attention from the top.":
"Requiere decisiones, dinero y atención de la alta dirección.",
"As data grew, so did the questions about how it's used.":
"Al crecer los datos, crecieron las preguntas sobre cómo se usan.",
"In 2017, the DMBOK's second edition gave more room to ethics: not only whether we can use data, but whether we should.":
"En 2017, la segunda edición del DMBOK dio más espacio a la ética: no solo si podemos usar los datos, sino si debemos.",
"In 2018, a European law made organisations answer for the personal data they hold, and be able to prove it.":
"En 2018, una ley europea obligó a las organizaciones a responder por los datos personales que tienen, y a poder demostrarlo.",
"Governing data now meant answering to the people it's about, too.":
"Gobernar datos ya era también responder ante las personas que describen.",
"Now machines learn from data, whatever it teaches them.":
"Ahora las máquinas aprenden de los datos, enseñen lo que enseñen.",
"So the people training them have to ask: where did this data come from, and who decided we could use it?":
"Así que quienes las entrenan deben preguntarse: ¿de dónde salieron estos datos y quién decidió que podíamos usarlos?",
"In 2024, a revision of the DMBOK added governance and ethics for AI.":
"En 2024, una revisión del DMBOK agregó gobernanza y ética para la IA.",
"The same year, Europe's law on AI asked for governance of the data that high-risk systems learn from.":
"Ese mismo año, la ley europea de IA pidió gobernanza de los datos con que aprenden los sistemas de alto riesgo.",
"And a third edition is being written, with new sections on AI governance, data ethics and sustainability.":
"Y se está escribiendo una tercera edición, con secciones nuevas sobre gobernanza de la IA, ética de datos y sostenibilidad.",
"Its makers call it a living body of knowledge.":
"Sus autores la llaman un cuerpo de conocimiento vivo.",
"It's planned for 2027.":
"Está prevista para 2027.",
"So why does the DMBOK still matter today?":
"¿Y por qué el DMBOK sigue importando hoy?",
"Because the question it answers never changed.":
"Porque la pregunta que responde nunca cambió.",
"In 1980, in 2008, and in every system that learns: who decides about this data, and who answers for it?":
"En 1980, en 2008 y en cada sistema que aprende: ¿quién decide sobre estos datos y quién responde por ellos?",
"The book keeps growing, but governance stays at the centre.":
"El libro no deja de crecer, pero la gobernanza sigue en el centro.",
"Today, at a university, a new data governance lead is about to meet the same question.":
"Hoy, en una universidad, un nuevo líder de gobernanza de datos está por toparse con la misma pregunta."
});
