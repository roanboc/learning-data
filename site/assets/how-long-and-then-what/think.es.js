/* Learning Data: "Pausa para pensar" de How long, and then what, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (schedule, clock, hold), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  schedule:{q:"¿Por qué la universidad escribe una fila por cada tipo de registro, y no una fecha de fin para cada registro?",
    opts:[{t:"Una fila decide por cada registro de su tipo, incluso los que aún no existen, de antemano.",ok:true},{t:"Cada dueño fija la fecha de un registro cuando deja de usarse, uno a uno, según haga falta.",near:true},{t:"La plataforma puede borrar todos los tipos de registro el mismo día de cada año, de una vez."}],
    why:"Una fila por tipo de registro decide una sola vez, antes de que existan los registros, como los calendarios de Washington en 1943. Fijar la fecha de cada registro cuando deja de usarse es volver a decidir montón a montón, lo que el calendario sustituyó."},
  clock:{q:"El primer contrato de Linh terminó en junio de 2023 y el último en noviembre de 2026. ¿Por qué sus nóminas se guardan hasta fechas distintas?",
    opts:[{t:"Sus nóminas más nuevas tienen más datos suyos, así que el calendario las guarda unos años más."},{t:"Cada nómina se guarda 7 años desde el día en que se escribió, así que las nuevas duran más.",near:true},{t:"Las nóminas de cada contrato se guardan 7 años desde el fin de ese contrato, no una fecha común.",ok:true}],
    why:"El reloj empieza con un hecho, el fin de cada contrato: los registros de su primer contrato se guardan hasta el 23 de junio de 2030, los del último hasta el 20 de noviembre de 2033. Contar desde el día en que se escribió cada registro es otro reloj, no el del calendario."},
  hold:{q:"Las nóminas de 2019 de una antigua tutora deben irse en enero, pero su reclamación de pago no está resuelta. ¿Qué pasa con ellas?",
    opts:[{t:"Una retención las guarda para siempre, porque una reclamación resuelta podría volver algún día.",near:true},{t:"Una retención las guarda hasta que se resuelva su reclamación; luego se van en la siguiente limpieza.",ok:true},{t:"Se van en enero, como estaba previsto: el calendario no cambia sus fechas por una persona."}],
    why:"La oficina jurídica pone una retención que nombra sus registros de 2019, su razón, quién la puso y quién la levanta. La limpieza se salta esos registros, y solo esos. Cuando se resuelve la reclamación, se levanta la retención y se van: una retención dura lo que dura su razón, nunca por si acaso."}
  }}};
