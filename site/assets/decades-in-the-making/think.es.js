/* Learning Data: "Pausa para pensar" de Decades in the making, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (learns, power, web), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs del módulo llegan más adelante, como un solo conjunto, así que
   ninguna pregunta tiene "stop", y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "learns":{q:"En 1958, un periódico dijo que la Marina esperaba que el perceptrón caminara, hablara y fuera consciente de su existencia. ¿Qué podía hacer en realidad?",
    opts:[{t:"Leer las tarjetas en voz alta, y decir de qué lado estaba marcada cada una."},{t:"Distinguir las tarjetas marcadas a la izquierda de las marcadas a la derecha, tras cincuenta intentos, ajustando un poco sus números después de cada error.",ok:true},{t:"Aprender cualquier patrón, con suficientes tarjetas."}],
    why:"Aprendió una cosa simple a partir de ejemplos, y eso era nuevo y real. Las esperanzas iban muy por delante: una sola capa no puede aprender algunos patrones, y las computadoras eran lentas. Cuando llega una herramienta nueva a tu trabajo, ¿cómo distingues lo que hace hoy de lo que la gente espera que haga?"},
  "power":{q:"En 2012, una red muy por delante de las demás ganó un concurso de imágenes. ¿Qué tenía de nuevo?",
    opts:[{t:"Una idea nueva sobre cómo aprenden las redes, descubierta ese año."},{t:"No las ideas, que tenían décadas, sino los datos y la potencia: más de un millón de fotos etiquetadas, y dos chips gráficos lo bastante rápidos para entrenar una red mucho más grande.",ok:true},{t:"Fue la primera red con más de una capa."}],
    why:"Aprender de ejemplos venía de 1958, y aprender de los errores en muchas capas, de 1986. Lo que cambió fueron los datos y la potencia: un millón de fotos etiquetadas, y chips hechos para videojuegos que hacen cientos de sumas pequeñas a la vez. Sus cinco mejores respuestas fallaron 15 veces de cada cien; la siguiente mejor propuesta, 26. ¿Qué cosa de tu trabajo ha esperado, no una idea nueva, sino los datos o la potencia para hacerla?"},
  "web":{q:"El modelo más grande de 2020 escribía con fluidez. ¿Por qué no intentaba ayudar?",
    opts:[{t:"Le habían pedido que diera respuestas cortas."},{t:"Solo había aprendido a adivinar la palabra siguiente de textos de la web y de libros, así que continuaba lo que le dieran: a una pregunta, le seguía con más preguntas.",ok:true},{t:"No tenía suficientes números que ajustar."}],
    why:"Adivinar la palabra siguiente, miles de millones de veces, le enseñó gramática, hechos y formas de escribir, pero no lo que quiere quien pregunta. En 2022, entrenar con las respuestas que la gente prefería hizo útil a un modelo. Escribir con fluidez no es lo mismo que intentar ayudar: ¿dónde podría haberte engañado una respuesta fluida?"}
  }}};
