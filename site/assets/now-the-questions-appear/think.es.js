/* Learning Data: "Pausa para pensar" de Now the questions appear, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (up, count, build), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "up":{q:"El siguiente pedido es un tablero de todos los cortes, actualizado cada minuto, para la pantalla de la recepción. ¿Por qué no llega a nada?",
    opts:[{t:"Actualizarlo cada minuto costaría demasiado."},{t:"Nadie va a decidir nada con él, así que no llega a ninguna decisión ni a ninguna meta.",ok:true},{t:"La recepción no está en el mapa."}],
    why:"Un pedido importa cuando alguien va a decidir algo con su respuesta, a tiempo. Seguida hacia arriba, la pregunta de los planificadores llega a una decisión, una capacidad y una meta. El tablero de la recepción es tan inmediato como la llamada del capitán, pero nadie decide nada con él, así que no encuentra ninguna decisión. Seguidos hacia arriba, ¿cuáles de los informes de tu equipo llegarían a una decisión?"},
  "count":{q:"Dos informes cuentan los días para conectar una instalación solar nueva: treinta y cuatro, y veintiuno. ¿Cuál está mal?",
    opts:[{t:"El informe de conexiones: treinta y cuatro días es demasiado lento para ser cierto."},{t:"Ninguno: cada uno pone en marcha y detiene el reloj en un momento distinto, y la medida necesita una sola definición, por escrito.",ok:true},{t:"El informe de la red: veintiuno es demasiado bueno para ser cierto."}],
    why:"Los dos tienen razón sobre lo que cuentan, y ninguno es la medida. Grace la escribe una sola vez: desde una solicitud completa hasta el medidor nuevo, en días hábiles, de lunes a viernes, sin feriados. Entonces, quien la cuente obtiene el mismo número. ¿Qué número cuenta tu organización de dos maneras?"},
  "build":{q:"Veintiún pedidos llegan a una decisión. ¿Por qué necesitan cuatro productos de datos, y no veintiún informes?",
    opts:[{t:"Construir cuatro es más barato que construir veintiuno."},{t:"Agrupado por capacidad y dominio, cada producto responde muchas preguntas, tiene un solo responsable y se queda de su lado del muro.",ok:true},{t:"Los veintiún informes serían todos iguales."}],
    why:"Construido pedido por pedido, cada informe queda a cargo de alguien distinto. Delimitado por capacidad y dominio, un producto de datos responde muchas preguntas, tiene un solo responsable y mantiene el significado de cada dominio de su lado del muro. ¿Cómo están delimitados hoy tus productos de datos?"}
  }}};
