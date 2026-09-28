/* Meaning machines can read: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"In the 1750s, Linnaeus gave each species a two-part name, and a place in a hierarchy. Scientists still use his system.":
"En la década de 1750, Linneo dio a cada especie un nombre de dos partes, y un lugar en una jerarquía. La ciencia aún usa su sistema.",
"A century earlier, John Wilkins designed a language to classify everything in the universe. It never took hold.":
"Un siglo antes, John Wilkins diseñó una lengua para clasificar todo lo que hay en el universo. Nunca prosperó.",
"In 1860, Florence Nightingale asked hospitals to record the same things, in the same way, so that they could be compared.":
"En 1860, Florence Nightingale pidió a los hospitales registrar lo mismo, de la misma manera, para poder compararlos.",
"An international list of causes of death followed in 1893. Today, it's the International Classification of Diseases.":
"Le siguió, en 1893, una lista internacional de causas de muerte. Hoy es la Clasificación Internacional de Enfermedades.",
"Shared definitions let strangers compare. The ones that last are made for a purpose, not for everything.":
"Las definiciones compartidas permiten que desconocidos comparen. Las que perduran se hacen para un propósito, no para todo.",
"At the university, the Head of School asks Genie: which learners are one microcredential away from a graduate certificate?":
"En la universidad, la directora de la escuela le pregunta a Genie: ¿qué aprendices están a una microcredencial de un diplomado de posgrado?",
"Genie finds the tables. It finds a column called is_micro, and another called stack_ok.":
"Genie encuentra las tablas. Encuentra una columna llamada is_micro, y otra llamada stack_ok.",
"But the stacking rules live in a policy document that no tool can read. Genie guesses, and it's wrong.":
"Pero las reglas de apilamiento viven en un documento de política que ninguna herramienta lee. Genie adivina, y se equivoca.",
"An AI assistant answers from what it can read. Meaning kept in documents is invisible to it.":
"Un asistente de IA responde con lo que puede leer. El significado guardado en documentos es invisible para él.",
"There are four common ways to write meaning down, and they stack. A glossary: words and their definitions, for people.":
"Hay cuatro formas comunes de escribir el significado, y se apilan. Un glosario: palabras y sus definiciones, para personas.",
"A taxonomy: kinds of things in a hierarchy, like Linnaeus's.":
"Una taxonomía: clases de cosas en una jerarquía, como la de Linneo.",
"An ontology: concepts, the relationships between them, and rules that a machine can check and reason with.":
"Una ontología: conceptos, las relaciones entre ellos, y reglas que una máquina puede comprobar y usar para razonar.",
"And a semantic layer: how each number is calculated, defined once.":
"Y una capa semántica: cómo se calcula cada cifra, definida una sola vez.",
"They aren't rivals. Each one answers a different question.":
"No son rivales. Cada una responde una pregunta distinta.",
"In the ontology, the rules are written as statements. A microcredential is a kind of credential. A graduate certificate accepts up to four approved microcredentials towards its credit.":
"En la ontología, las reglas se escriben como afirmaciones. Una microcredencial es una clase de credencial. Un diplomado de posgrado acepta hasta cuatro microcredenciales aprobadas para sus créditos.",
"Connect the university's data to these statements, and it becomes a knowledge graph: learners, credentials and courses, linked by what they mean.":
"Conecta los datos de la universidad con estas afirmaciones, y se vuelven un grafo de conocimiento: aprendices, credenciales y cursos, unidos por lo que significan.",
"It's Aristotle's recipe made formal: the kind of thing, and what sets it apart, in a form a machine can use.":
"Es la receta de Aristóteles, formalizada: la clase de cosa, y lo que la distingue, en una forma que una máquina puede usar.",
"In the semantic layer, credentials awarded this year is defined once: what's counted, what's left out, which date, and at what grain.":
"En la capa semántica, «credenciales otorgadas este año» se define una sola vez: qué se cuenta, qué se deja fuera, qué fecha y con qué grano.",
"Dashboards, spreadsheets and Genie all ask it, instead of each writing its own version.":
"Tableros, planillas y Genie le preguntan a ella, en lugar de escribir cada uno su propia versión.",
"Open formats for sharing these definitions between tools are starting to appear.":
"Empiezan a aparecer formatos abiertos para compartir estas definiciones entre herramientas.",
"You don't have to start from a blank page. Finance, health, insurance and retail all publish shared models, and so does education.":
"No tienes que empezar con una hoja en blanco. Finanzas, salud, seguros y comercio minorista publican modelos compartidos, y la educación también.",
"Digital credentials have open standards too, with issuer, holder and evidence in them.":
"Las credenciales digitales también tienen estándares abiertos, con emisor, titular y evidencia.",
"Even microcredential has official definitions: from Australia, from the European Union, and from UNESCO. They don't quite match.":
"Hasta «microcredencial» tiene definiciones oficiales: de Australia, de la Unión Europea y de la UNESCO. No coinciden del todo.",
"So choose deliberately. Check, adopt, extend and record, as in A Sharper Sketch, at every layer.":
"Así que elige a propósito. Revisa, adopta, extiende y registra, como en Un boceto más preciso, en cada capa.",
"The Head of School asks again. This time, Genie asks back: approved for stacking, or all microcredentials?":
"La directora vuelve a preguntar. Esta vez, Genie repregunta: ¿aprobadas para apilar, o todas las microcredenciales?",
"Then it answers, and shows the definition it used.":
"Luego responde, y muestra la definición que usó.",
"Studies have found that grounding an assistant in explicit meaning makes its answers measurably more accurate. The difference is the meaning it can read.":
"Varios estudios muestran que basar un asistente en significado explícito hace sus respuestas más precisas, de forma medible. La diferencia es el significado que puede leer.",
"The triangle from the start of the series returns: the word, in English and in Spanish; the idea, now written in the ontology; and the data it points to.":
"Vuelve el triángulo del comienzo de la serie: la palabra, en inglés y en español; la idea, ahora escrita en la ontología; y los datos a los que apunta.",
"Next: keeping all of it true, while everything changes.":
"Siguiente: que todo siga siendo verdad, mientras todo cambia."
});
