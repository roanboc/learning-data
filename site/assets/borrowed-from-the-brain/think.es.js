/* Learning Data: "Pausa para pensar" de Borrowed from the brain, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (cell, borrowed, sure), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "cell":{q:"El pulso de una célula nerviosa tiene siempre el mismo tamaño. Entonces, ¿cómo aprende algo un cerebro?",
    opts:[{t:"Sus pulsos crecen a medida que aprende."},{t:"Sus conexiones cambian: el vínculo entre dos células que se disparan juntas se fortalece.",ok:true},{t:"Le crece una célula nueva por cada cosa que aprende."}],
    why:"Un pulso es todo o nada, así que lo que cambia es con cuánta fuerza llega el mensaje de una célula a la siguiente. Hebb lo propuso en 1949, y experimentos con conejos en 1973 mostraron vínculos que se fortalecían con el uso. Los modelos tomaron esa sola idea: un número por cada conexión, que se ajusta al aprender. ¿Qué se fortalece en tu trabajo cuanto más se usa?"},
  "borrowed":{q:"¿Qué tomaron prestado de las células nerviosas los modelos de hoy?",
    opts:[{t:"Una copia funcional de un cerebro, solo que más pequeña."},{t:"Una idea: unidades simples que suman entradas con pesos, conexiones que cambian al aprender, y capas.",ok:true},{t:"Nada: la palabra neuronal es solo un nombre."}],
    why:"McCulloch y Pitts dibujaron la célula de Cajal como una unidad que suma sus entradas y se dispara al pasar de un nivel fijado, Rosenblatt dio un peso a cada conexión, y las capas vinieron de las células de Hubel y Wiesel que se disparan ante bordes. Pero una célula real es mucho más compleja: en 2021 hizo falta una red de cinco a ocho capas para imitar una, y un niño aprende una palabra con pocos ejemplos, mientras que un modelo necesita muchísimos. ¿Dónde más funcionó una idea prestada sin copiar todo?"},
  "sure":{q:"Cuando se le pidió tres veces el cumpleaños de un investigador, un modelo dio tres fechas distintas, todas mal. ¿Por qué?",
    opts:[{t:"Tenía la temperatura alta, así que inventó a propósito."},{t:"El dato no estaba, así que escribió palabras probables: un cumpleaños no tiene patrón que aprender, y las pruebas premian adivinar antes que dejar en blanco.",ok:true},{t:"Estaba averiado: un modelo que funciona nunca hace esto."}],
    why:"Un modelo elige cada palabra al azar entre lo probable, y aun al mínimo queda un poco de azar, así que un dato que falta sale distinto cada vez, cada respuesta tan fluida como la anterior. Los cerebros también rellenan huecos, con la misma seguridad. Una respuesta fluida no está verificada: verifícala contra la evidencia, como se verificaron los dibujos de Cajal. ¿Qué respuestas llegan fluidas a tu trabajo, pero sin verificar?"}
  }}};
