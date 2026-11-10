/* Learning Data: "Pausa para pensar" de A model, reasoning, hands and a loop, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (writes, hands, script), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "writes":{q:"Un modelo por sí solo dice que el conteo del día del censo es de unos 18,000. ¿Qué necesitarías antes de confiar en él?",
    opts:[{t:"De dónde salió: los registros que leyó, la regla que usó y una verificación contra una fuente en la que confías.",ok:true},{t:"Un prompt más cuidadoso que le diga usar la regla del día del censo, para que su respuesta la siga.",near:true},{t:"La misma respuesta, preguntada tres veces, para saber que no es casualidad."}],
    why:"Un modelo solo no tiene nada de eso: escribe lo probable, a partir de lo que aprendió, no de los registros de la universidad. Preguntar otra vez da otra respuesta probable, no evidencia. Donde trabajas, ¿en qué números confías porque sabes de dónde vienen?"},
  "hands":{q:"¿Por qué las tres herramientas del agente solo leen?",
    opts:[{t:"Las herramientas que escriben necesitan a una persona, y el agente debería terminar su respuesta sin esperar a nadie."},{t:"Cada herramienta tiene la etiqueta solo lectura, y el agente sigue sus etiquetas, así que nunca intenta cambiar nada por error.",near:true},{t:"Leer es todo lo que el trabajo necesita, y una herramienta que no puede cambiar nada no puede romper nada, por error o en malas manos.",ok:true}],
    why:"Cada herramienta recibe los mínimos permisos que el trabajo necesita, fijados en su cuenta, no solo en una etiqueta: una etiqueta es una pista; una cuenta, un control. Donde trabajas, ¿qué cuentas pueden cambiar más de lo que su trabajo necesita?"},
  "script":{q:"Planificación querrá el conteo del día del censo cada marzo. ¿Agente o script sencillo?",
    opts:[{t:"El agente, programado, con una prueba sobre su respuesta: ya encontró los pasos, así que puede seguirlos cada marzo.",near:true},{t:"Un script sencillo: ahora los pasos se conocen, así que una receta con una prueba lo hace en segundos, siempre igual.",ok:true},{t:"Los dos, y compararlos cada año: si coinciden, el número es correcto; si no, una persona elige uno."}],
    why:"Cuando los pasos se pueden escribir, un script sencillo es más rápido, más barato e igual cada vez, y Noor lo aprobó antes de que corriera según lo programado. Guarda los agentes para las preguntas que nadie ha respondido aún. Donde trabajas, ¿qué trabajo que hoy hace un agente podría ser un script sencillo?"}
  }}};
