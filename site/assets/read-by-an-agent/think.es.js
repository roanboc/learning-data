/* Learning Data: "Pausa para pensar" de Read by an agent, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (empty, proposes, before), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "empty":{q:"El agente contó 412 graduados cuya fecha de confirmación estaba vacía. ¿Qué hizo que su respuesta fuera errónea?",
    opts:[{t:"Su consulta leyó la columna equivocada, no la fecha de confirmación."},{t:"Vacío significaba dos cosas, y el agente no le preguntó a Mei cuál.",near:true},{t:"Vacío significaba dos cosas, y nada escrito decía cuál.",ok:true}],
    why:"El agente contó exactamente lo que se le pidió, con lo que podía leer. Vacío significaba \"aún no\" y también \"confirmado en papel\", y solo Mei lo sabía. Un agente no puede ir hasta su escritorio, así que el significado tiene que estar en los datos y en su descripción. ¿Cuál de tus columnas leería mal un agente hoy?"},
  "proposes":{q:"Genie Code propuso un control que falla cada vez que un graduado aún no ha confirmado su nombre. ¿Por qué lo rechazó Jun?",
    opts:[{t:"Lo propuso un agente, y solo las personas pueden escribir los controles."},{t:"Trata de lo que hacen las personas, así que se vuelve un conteo que sigue Malia.",ok:true},{t:"Trata de lo que hacen las personas, así que se vuelve un control que espera a Malia.",near:true}],
    why:"Un control dice si los datos están bien. Los graduados que aún no han respondido no son datos erróneos; son trabajo pendiente, y de Malia. Por eso es un conteo que ella sigue cada semana, en su propio modelo, y la respuesta de confianza del agente a su pregunta. Las otras dos propuestas del agente sí se volvieron controles, así que quién lo propuso no fue la razón. ¿Qué falla tu equipo como control cuando en realidad es una tarea?"},
  "before":{q:"Un agente responde tu pregunta al instante, seguro de sí, y muestra su consulta. ¿Qué deberías hacer antes de actuar?",
    opts:[{t:"Comprobar que encaja con lo que sabes, y preguntar al responsable de los datos si no.",ok:true},{t:"Comprobar que encaja con lo que sabes, y preguntar otra vez al agente si no.",near:true},{t:"Confiar en ella: el agente mostró la consulta que hizo, así que el conteo es correcto."}],
    why:"Una respuesta puede ser segura, venir con su consulta y aun así contar lo que no es. Malia vio que una quinta parte de la lista no encajaba con un portal que 95 de cada 100 graduados responden en dos semanas, y le preguntó a Mei, que sabía qué significaba vacío. Preguntar otra vez al agente habría leído el mismo silencio. ¿La respuesta de quién comprobarías antes de actuar esta semana?"}
  }}};
