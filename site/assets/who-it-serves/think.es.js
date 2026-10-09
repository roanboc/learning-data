/* Learning Data: "Pausa para pensar" de Who it serves, and how it pays, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (segments, fit, pays), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "segments":{q:"Un inquilino usa la electricidad y paga la factura, el propietario decide si hay paneles solares y el regulador decide el precio. ¿Qué te dice eso de los clientes?",
    opts:[{t:"El inquilino es el único cliente."},{t:"El regulador es un segmento de clientes."},{t:"Quién paga, quién usa y quién decide suelen ser personas distintas.",ok:true}],
    why:"Los segmentos salen de mirar los tres. El ministro y el regulador importan igual, pero no son clientes: tienen su propio lugar en el mapa. Donde trabajas, ¿son las mismas personas?"},
  "fit":{q:"En el lienzo de los hogares con paneles solares, un dolor no tiene nada que lo alivie: esperar meses para conectar paneles nuevos. ¿Qué tiene que decir el lienzo?",
    opts:[{t:"Nada: un hueco no importa."},{t:"Si es una capacidad que falta, o un cliente al que la empresa decidió no atender.",ok:true},{t:"Que esos hogares deben salir del lienzo."}],
    why:"El encaje es una regla: cada dolor necesita algo que lo alivie. Farah tiene claro que sí atienden a esos hogares, así que es una capacidad que falta, y va a la lista."},
  "pays":{q:"¿Por qué cada oferta tiene su propio lienzo de modelo de negocio, en vez de uno para toda la empresa?",
    opts:[{t:"Porque cada oferta tiene su propia economía: quién paga, qué gana y cuál es su mayor costo.",ok:true},{t:"Porque cada equipo quiere el suyo."},{t:"Porque el regulador lo exige."}],
    why:"La red gana lo que el regulador permite, la venta minorista gana con las tarifas, y el gobierno paga el plan de ayuda. Un solo lienzo las mezclaría. ¿Dos de tus ofertas comparten una misma partida del presupuesto?"}
  }}};
