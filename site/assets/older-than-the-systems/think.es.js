/* Learning Data: "Pausa para pensar" de Older than the systems, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (model, meet, person, logical), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "model":{stop:"parts",q:"Una licencia de conducir, una certificación de un proveedor y un doctorado. ¿Qué tienen en común?",
    opts:[{t:"Poco: son cosas distintas, de lugares distintos."},{t:"Las mismas partes: un emisor, un titular, una afirmación, evidencia y una fecha, que otra persona puede comprobar.",ok:true},{t:"Todas se guardan en bases de datos."}],
    why:"Los materiales y los emisores cambian; las partes no. Por eso un solo modelo conceptual sirve para toda credencial, y dura más que cualquier sistema que la guarde."},
  "meet":{stop:"fit",q:"Seis sistemas necesitan compartir credenciales. Conectados por pares, ¿cuántas traducciones podrían hacer falta? ¿Y con un modelo compartido?",
    opts:[{t:"Seis por pares, seis con un modelo."},{t:"Quince por pares, seis con un modelo.",ok:true},{t:"Treinta por pares, una con un modelo."}],
    why:"Cada par entre seis sistemas son 6 × 5 ÷ 2 = 15 traducciones. Con un modelo compartido, cada sistema se traduce una vez: seis, y el significado queda escrito en un solo lugar."},
  "person":{stop:"source",q:"El correo de Aisha es distinto en la plataforma de aprendizaje y en el directorio de TI. ¿Cuál deberían usar todos?",
    opts:[{t:"El que se cambió más recientemente."},{t:"El del sistema de registro del correo: el directorio de TI.",ok:true},{t:"El de la plataforma de aprendizaje, porque ella la usa más."}],
    why:"Cada dato tiene un sistema de registro, donde se crea y se corrige. Los otros sistemas guardan copias, y deberían tomarlas de ahí."},
  "logical":{stop:"fit",q:"El modelo lógico no nombra ninguna base de datos ni ningún producto. ¿Por qué es una ventaja?",
    opts:[{t:"No lo es: no se puede construir hasta que nombre uno."},{t:"Se puede poner al lado de cualquier sistema: para elegir un paquete, relacionar sus campos o mudarse a uno nuevo.",ok:true},{t:"Ahorra costos de licencias."}],
    why:"Como es preciso pero no técnico, el modelo lógico es una vara de medir que dura más que cada sistema que se mide con ella."}
  }}};
