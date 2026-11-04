/* Learning Data: "Pausa para pensar" de More than a junior, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (more, lose, asked), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "more":{q:"El agente leyó 33 tablas en un minuto. ¿Por qué eso lo hace más peligroso, y no solo más útil?",
    opts:[{t:"Porque al leer tan rápido comete más errores que un junior."},{t:"Porque su rapidez sirve en los dos sentidos: con las riendas sueltas, podría cambiar todas las tablas mal tan rápido como bien.",ok:true},{t:"No lo hace: cuanto más rápido trabaja, más seguro está el proyecto."}],
    why:"La lentitud de un junior hace pequeños sus errores. La del agente no, así que algo más debe limitarlo: sus permisos. Donde trabajas, ¿qué podría cambiar un agente en un minuto si nada lo detuviera?"},
  "lose":{q:"Un junior habría preguntado antes de borrar tres tablas. ¿Por qué el agente no lo hizo, y qué mantuvo seguro el cambio?",
    opts:[{t:"Fue descuidado, y Jun tuvo suerte de darse cuenta."},{t:"Sabía que las tablas se podían borrar, así que no necesitaba preguntar."},{t:"No tiene carrera ni nada que perder, así que nada lo empujó a preguntar. Sus permisos dejaron el cambio como borrador en un sandbox, hasta que una persona encontró la tabla anual.",ok:true}],
    why:"El agente no es descuidado; no tiene nada que perder. Por eso su prudencia viene de sus permisos: lee, solo escribe borradores en un sandbox, y una persona revisa antes de que otra apruebe. Donde trabajas, ¿qué tabla se lee solo una vez al año?"},
  "asked":{q:"¿Cuál es la mejor forma de revisar el conteo del agente: «Son 4,867, ¿verdad?» o «¿Cuántos títulos este año? Muestra la consulta.»?",
    opts:[{t:"La segunda: deja la respuesta fuera de la pregunta, y pide la evidencia.",ok:true},{t:"La primera: decirle lo que esperas ahorra tiempo."},{t:"Cualquiera: el agente da la misma respuesta de las dos formas."}],
    why:"Como la gente alrededor de Hans, una pregunta puede delatar la respuesta: los modelos se inclinan hacia la respuesta que insinuamos, y su razonamiento casi nunca lo dice. Pregunta sin la respuesta, mira cómo llegó al resultado y compáralo con un conteo que no hizo. Donde trabajas, ¿cómo pides una cifra que ya esperas?"}
  }}};
