/* Learning Data: "Pausa para pensar" de Plan, define the check, do, check, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (long, define, do, check), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "long":{q:"El agente leyó 38 páginas web buscando una regla que Docs da en una consulta. ¿Qué le habría ahorrado el trabajo?",
    opts:[{t:"Un agente más rápido, que lea las páginas antes."},{t:"Un plan que nombre sus herramientas, y le dé solo esas.",ok:true},{t:"Decirle que lea menos páginas web."}],
    why:"El agente no estaba roto: usó lo que pudo encontrar, porque nadie le había dicho qué había. Un plan que nombra Catalog, Query y Docs lo lleva a las reglas de la propia universidad, en una consulta. Donde trabajas, ¿qué tendrían que decirle a un agente que hay?"},
  "define":{q:"Nadie sabe todavía cuántos estudiantes hay en cada nivel. Entonces, ¿qué pueden decir las dos verificaciones de Jun?",
    opts:[{t:"El número de cada nivel, tomado del informe del año pasado."},{t:"Lo que debe cumplir cualquier respuesta correcta: los niveles suman 18,412, y cada estudiante tiene exactamente un nivel.",ok:true},{t:"Nada, hasta que el agente tenga un resultado que mirar."}],
    why:"Nadie sabe todavía la respuesta: por eso Clara la pidió. Pero cualquier respuesta correcta debe cumplir dos cosas: los niveles suman 18,412, el conteo que ya coincide con el informe del censo, y cada estudiante tiene exactamente un nivel, como lo define el glosario. Verifican cómo se relacionan las partes y qué significan las palabras, no los números, y Jun las aprueba antes de cualquier trabajo. ¿Qué debe ser cierto de una respuesta que todavía no conoces?"},
  "do":{q:"Veintiocho estudiantes no tienen nivel. ¿Por qué el agente no los pone en pregrado y sigue?",
    opts:[{t:"Porque la prueba seguiría fallando."},{t:"Porque a qué nivel pertenecen es un significado, y es de Mei.",ok:true},{t:"Porque ya había gastado sus rondas."}],
    why:"Ponerlos en pregrado pondría la prueba en verde y el conteo mal. El agente no descarta filas ni toca una prueba para pasar: se detiene, y pregunta a la dueña del significado, con su consulta, el resultado y dos opciones que suman. Mei revisa la lista del gobierno: sin titulación, un nivel propio. Y como ninguno tenía nivel desde 2021, los años anteriores pasan a Planificación, para que las personas los revisen. ¿Quién es dueño de los significados que encontrarían tus agentes?"},
  "check":{q:"Las dos pruebas pasan. ¿Por qué el cambio todavía necesita a Jun y a Noor?",
    opts:[{t:"No los necesita: con las pruebas en verde, el cambio puede ir a producción."},{t:"Una persona lo verifica contra el plan y responde por él, y una segunda persona lo aprueba.",ok:true},{t:"La propia revisión del agente encontró un problema que no pudo arreglar."}],
    why:"Las pruebas en verde muestran que el trabajo cumple sus verificaciones, no que siguió el plan. Jun lee la solicitud de cambio contra el plan, y cuando la acepta, el cambio es suyo y él responde por él. Noor, una segunda persona, lo aprueba para producción. El agente también puede revisar, solo como referencia: nunca aprueba. Donde trabajas, ¿quién sería la segunda persona?"}
  }}};
