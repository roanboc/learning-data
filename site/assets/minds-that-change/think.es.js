/* Learning Data: "Pausa para pensar" de Minds that change, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (three, ours, check), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "three":{q:"El agente le dio a Clara tres respuestas en dos días, cada una tan segura como la anterior. ¿Qué les faltaba a las tres?",
    opts:[{t:"Una puntuación de cuán seguro estaba, para saber cuál elegir."},{t:"De dónde salió cada respuesta: la consulta que hizo y las filas que contó.",ok:true},{t:"Nada: la última respuesta es la que vale."}],
    why:"Sin evidencia, nadie podía saber qué respuesta era correcta, y resultó que la del lunes lo era. Una puntuación de cuán seguro estaba no ayudaría: cada respuesta ya era tan segura como la anterior, y la revisión 2025 que citó no existe. Donde trabajas, ¿qué respuestas llegan sin decir de dónde salieron?"},
  "ours":{q:"Clara estaba segura de que Salud perdió más estudiantes de primer año el año pasado, pero fue Ciencias. ¿Fue descuidada, o mintió?",
    opts:[{t:"Descuidada: debió acordarse."},{t:"Mintió, para respaldar la respuesta del agente."},{t:"Ninguna de las dos: la memoria se reconstruye cada vez que recordamos, y la suya había unido dos años en uno.",ok:true}],
    why:"Las versiones del cuento de Bartlett y la pregunta de Loftus y Palmer muestran que la memoria llena sus vacíos con lo que parece probable, y está segura de ello. Su propio informe del año pasado lo resolvió, sin culpar a nadie. ¿Cuándo descubriste por última vez que un recuerdo del que estabas seguro era falso?"},
  "check":{q:"Contado de dos formas, el número no coincidía por tres: 134 y 131. ¿Por qué es una buena noticia?",
    opts:[{t:"El agente puede elegir el número mayor, por si acaso."},{t:"La segunda forma encontró tres estudiantes contados dos veces, que una sola forma ocultaba.",ok:true},{t:"No lo es: si dos formas no coinciden, el agente no sirve."}],
    why:"Como en los patrones de los recitadores, un error se nota cuando dos formas deben coincidir. El agente lo dijo en vez de elegir uno, se corrigió el doble conteo, y ahora una verificación simple lo busca cada noche; Clara firmó con la evidencia delante. ¿Qué número de tu trabajo querrías obtener de una segunda forma antes de que alguien actúe?"}
  }}};
