/* Learning Data: "Pausa para pensar" de Plan, define the check, do, check, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (long, define, do, check), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "long":{q:"El agente leyó 38 páginas web buscando una regla que Docs da en una consulta. ¿Qué le habría ahorrado el trabajo?",
    opts:[{t:"Un plan que nombre sus herramientas, y le dé solo esas.",ok:true},{t:"Decirle que lea menos páginas web, diez como mucho."},{t:"Un plan que nombre sus herramientas, y le deje sumar otras.",near:true}],
    why:"El agente no estaba roto: usó lo que pudo encontrar, porque nadie le había dicho qué había. Un plan que nombra Catalog, Query y Docs lo lleva a las reglas de la propia universidad, en una consulta. Donde trabajas, ¿qué tendrían que decirle a un agente que hay?"},
  "define":{q:"¿Por qué Jun aprueba las dos pruebas antes de que el agente construya nada?",
    opts:[{t:"Para que el agente conozca el objetivo, y pueda cambiar las pruebas si halla uno mejor al construir.",near:true},{t:"Para que lo correcto quede fijado antes del resultado, y el agente no pueda pasar moviendo la marca.",ok:true},{t:"Para que el agente empiece a construir antes, sin detenerse a preguntar cuáles deben ser las pruebas."}],
    why:"Una verificación decidida después del trabajo tiende a doblarse para encajar con él. Escritas primero, aprobadas por una persona y cambiadas solo por una persona, las pruebas dicen qué es correcto antes de que haya un resultado, como los 190 parámetros de Singapur, escritos antes de que la planta hiciera agua. ¿Cuáles serían tus dos primeras verificaciones?"},
  "do":{q:"Veintiocho estudiantes no tienen nivel. ¿Por qué el agente no los pone en pregrado y sigue?",
    opts:[{t:"Porque la prueba seguiría fallando con ellos en pregrado.",near:true},{t:"Porque ya había gastado sus rondas antes de llegar a ellos."},{t:"Porque a qué nivel pertenecen es un significado, y es de Mei.",ok:true}],
    why:"Ponerlos en pregrado pondría la prueba en verde y el conteo mal. El agente no descarta filas ni toca una prueba para pasar: se detiene, y pregunta a la dueña del significado, con su consulta y el resultado. Mei revisa la lista del gobierno: sin titulación, un nivel propio. ¿Quién es dueño de los significados que encontrarían tus agentes?"},
  "check":{q:"Las dos pruebas pasan. ¿Por qué el cambio todavía necesita a Jun y a Noor?",
    opts:[{t:"Una persona lo verifica contra el plan y responde por él, y una segunda persona lo aprueba.",ok:true},{t:"La propia revisión del agente encontró un problema que no pudo arreglar por su cuenta."},{t:"Una persona lo verifica contra el plan y lo aprueba sola, como quien responde por él.",near:true}],
    why:"Las pruebas en verde muestran que el trabajo cumple sus verificaciones, no que siguió el plan. Jun lee la solicitud de cambio contra el plan, y cuando la acepta, el cambio es suyo y él responde por él. Noor, una segunda persona, lo aprueba para producción. El agente también puede revisar, solo como referencia: nunca aprueba. Donde trabajas, ¿quién sería la segunda persona?"}
  }}};
