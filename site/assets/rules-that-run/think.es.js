/* Learning Data: "Pausa para pensar" de Rules that run, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (runs, level, list), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. Palabras como en los subtítulos: control, dueño, nivel, la actualización
   nocturna, una inscripción en persona, el equipo de aprendizaje, Planificación, el tablero de calidad. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "runs":{q:"Un control falla a las 2 de la mañana. Antes de esta película, ¿quién se habría enterado?",
    opts:[{t:"El equipo de datos, que arreglaría los datos por su cuenta antes de la mañana."},{t:"Nadie en particular: el resultado solo nombraba el control, no de quién es.",ok:true},{t:"El dueño del sistema, en la próxima encuesta de primavera."}],
    why:"Un resultado decía pasa, advierte o falla, y solo nombraba el control: no de quién eran los datos que verificaba, ni qué tipo de calidad. Así una advertencia corrió cada noche durante un año sin que nadie la leyera. Cuando cada control tiene un dueño y una dimensión en el registro de reglas, el tablero dice de quién es, y una falla llega a su dueño con una fecha. ¿Cuáles de tus controles llegarían a una persona mañana por la mañana?"},
  "level":{q:"Una inscripción sin correo advierte; seis detienen la actualización nocturna. ¿Quién lo eligió, y por qué?",
    opts:[{t:"La gobernanza de datos, para que todas las reglas tengan el mismo nivel."},{t:"El equipo de aprendizaje, dueño de los datos: una o dos inscripciones en persona por periodo son normales, y más significa que algo se rompió.",ok:true},{t:"El equipo de datos, porque ejecuta los controles."}],
    why:"El nivel es del dueño, no de la gobernanza. El equipo de aprendizaje sabe que una o dos inscripciones en persona por periodo son normales y les da seguimiento, así que cualquiera advierte; más de cinco significa que algo se rompió, así que se detiene. Planificación eligió lo contrario para su número del censo, porque va al gobierno. Cada dueño firma el nivel y su motivo en una tarjeta de regla, porque una regla que su dueño no entiende se ignora, y luego se apaga. ¿Quién debería fijar el nivel de tu control más importante?"},
  "list":{q:"«Cada inscripción en persona tiene seguimiento en una semana.» ¿Un control, o una lista?",
    opts:[{t:"Un control: si una inscripción en persona espera más de una semana, se detiene la actualización nocturna."},{t:"Una lista: trata de lo que hace la gente, así que son casos que atiende el equipo de aprendizaje.",ok:true},{t:"Ninguno: los dueños lo califican cada primavera en la encuesta."}],
    why:"Dar seguimiento a una inscripción en persona trata de lo que hace la gente, no de los datos, así que nunca detiene la actualización: es una lista de casos que atiende el equipo de aprendizaje. El control sigue siendo solo sobre los datos: una inscripción sin correo. ¿Cuáles de tus reglas tratan en realidad de lo que hace la gente?"}
  }}};
