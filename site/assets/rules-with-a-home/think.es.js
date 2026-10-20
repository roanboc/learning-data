/* Learning Data: "Pausa para pensar" de Rules with a home, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (split, expect, onto), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). El "stop" de una pregunta es el lab de la serie que abre, en la
   página de labs de la serie (el .player data-labs de la página es "../labs/"); una pregunta sin él no tiene enlace a un lab. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "split":{stop:"rule",q:"La regla del primer día estaba en el muro entre la red y comercialización, y no tenía responsable. ¿Por qué son en realidad dos reglas?",
    opts:[{t:"La red y comercialización no están de acuerdo sobre lo que significa."},{t:"Cada lado hace su parte: la red reemplaza la estimación y la envía, comercialización corrige la factura, y la lectura reemplazada cruza en la lista acordada.",ok:true},{t:"Dos reglas cortas son más fáciles de probar que una larga."}],
    why:"Una regla que cruza el borde de un dominio son dos reglas, una a cada lado, unidas por lo que cruza. En el muro, la regla no era de nadie, y el script que la cumplía falló durante meses sin que nadie lo notara. Divididas, cada regla tiene un responsable que puede arreglarla: Grace, la de la red; quien dirige comercialización, la de comercialización. ¿Cuál de tus reglas vive entre dos equipos?"},
  "expect":{q:"¿De dónde vienen las expectativas de calidad de las lecturas del medidor?",
    opts:[{t:"De la lista de verificación estándar del equipo de datos."},{t:"Del paso que las usa: su nivel de servicio, sus propios pasos y las reglas adjuntas a él.",ok:true},{t:"De lo que la herramienta de control pueda medir."}],
    why:"Las fija el paso de lectura. Su nivel de servicio da la oportunidad: una estimación reemplazada en dos días hábiles. Sus propios pasos dan la completitud: toda estimación reemplazada, o explicada. Otra regla adjunta a él da la validez: toda lectura marcada como real o estimada. ¿El nivel de servicio de qué paso fija lo que tus datos deben cumplir?"},
  "onto":{q:"Las reglas y los conceptos están escritos como una ontología, lista para OWL. ¿Por qué OWL no encuentra la factura sin corregir?",
    opts:[{t:"La ontología no tiene ninguna regla sobre facturas."},{t:"OWL razona solo a partir de lo que se dice: para OWL, una corrección que nunca ocurrió es desconocida, no una falla. Encontrar la factura es tarea de la tabla de seguimiento.",ok:true},{t:"OWL no puede leer los datos del sistema de facturación."}],
    why:"OWL trabaja en un mundo abierto: lo que no se dice puede ser cierto igual, así que una corrección que nunca ocurrió es simplemente desconocida. Una prueba de datos tampoco la encontraría: los datos pueden estar bien y una factura, sin corregir. La tabla de seguimiento generada de la regla de comercialización incluye cada factura que no se corrigió en la siguiente, para el equipo de facturación, cada mañana. En tu trabajo, ¿qué necesita razonamiento, y qué solo necesita una lista que alguien revise?"}
  }}};
