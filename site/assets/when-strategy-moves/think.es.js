/* Learning Data: "Pausa para pensar" de When strategy moves, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (walk, counter, lands), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs de la serie se están haciendo para toda la serie, así que
   ninguna pregunta tiene "stop" todavía, y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "walk":{q:"La directiva son unas pocas palabras del gobierno. Recorrida mapa abajo, ¿por qué es también la lista de quién debe aprobar?",
    opts:[{t:"El gobierno le pidió a la empresa una lista de nombres."},{t:"Cada elemento que toca tiene un responsable, y cada responsable debe aprobar su parte del cambio.",ok:true},{t:"El recorrido muestra qué sistemas nuevos comprar."}],
    why:"El cambio llega a cada capa: un impulsor y un resultado en la motivación, tres capacidades, un producto, un paso en la facturación, un socio y un acuerdo, un objeto de negocio, dos sistemas y un intercambio seguro. Cada uno tiene un responsable, así que el recorrido nombra a todos los que deben aprobar: Ama, el directorio, quien dirige comercialización, TI, y la agencia, como la otra parte. Recorrido tu propio mapa hacia abajo, ¿a quién necesitaría un cambio de estrategia?"},
  "counter":{q:"El cruce con la agencia es automático. ¿A qué hogares elegibles dejará fuera?",
    opts:[{t:"A los hogares que nunca llamaron al centro de llamadas."},{t:"A los inquilinos con la cuenta a nombre del dueño: la agencia los conoce, y la empresa no.",ok:true},{t:"A los hogares que pagan tarde sus facturas."}],
    why:"El cruce busca a las personas elegibles de la agencia entre los titulares de cuenta de la empresa. Un inquilino con la cuenta a nombre del dueño nunca es la misma persona en los dos lados, así que el cruce no encuentra a nadie. Detectados en el mostrador, y no en las primeras facturas, tienen una segunda vía: una solicitud, más adelante en el año. ¿A quién dejaría fuera una vía automática donde trabajas?"},
  "lands":{q:"Las facturas llevan ahora una línea de descuento, así que «total a pagar» significa algo nuevo. ¿Por qué no cambiar el contrato de cuentas y facturas sobre el mismo?",
    opts:[{t:"Cambiarlo sobre el mismo tomaría más tiempo de construir."},{t:"Todos los que lo leen recibirían un número distinto sin que nadie les avise. La versión 2 va junto a la versión 1, con una fecha de retiro para la anterior, y el linaje encuentra antes a los lectores.",ok:true},{t:"El número anterior estaba mal, así que nadie debería conservarlo."}],
    why:"Una medida, un informe para el regulador y un proceso de cobranza leen el total a pagar. Si se cambiara sobre el mismo, cada uno recibiría en silencio un número distinto. Como una versión nueva junto a la anterior, nada cambia para ellos hasta la fecha, y el linaje del catálogo encuentra a cada lector, así que cada responsable se entera antes. ¿Cuál de tus tablas te atreverías a cambiar sobre la misma?"}
  }}};
