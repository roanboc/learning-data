/* Learning Data: "Pausa para pensar" de Teachers of data, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (beside, warn, measured), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "beside":{q:"Un control detiene el cambio de Anil. ¿Qué lo hace más que una multa?",
    opts:[{t:"Deja que Anil se salte la regla esta vez, si lo pide."},{t:"Su mensaje dice qué falta, y enlaza una página escrita para él: qué pide la regla, por qué, cómo arreglarlo y a quién preguntar.",ok:true},{t:"Manda su cambio a una fila, donde alguien lo aprueba."}],
    why:"Un control que solo dice que no es una multa sin mimo. Anil arregló su cambio en un par de minutos porque el mensaje y su página estaban escritos para quien el control detiene, en sus palabras, y dicen a quién preguntar: el horario de atención, cada jueves por la tarde. Piensa en la última vez que una regla te detuvo: ¿te dijo por qué, y cómo arreglarlo?"},
  "warn":{q:"Los responsables de datos acuerdan una regla nueva: cada columna que leen otros equipos dice qué contiene. ¿Por qué solo advierte hasta el 1 de diciembre?",
    opts:[{t:"Para poder quitar la regla sin ruido si la gente se queja."},{t:"Para que la gente aprenda primero por qué y cómo: cada advertencia enlaza su página y dice qué día se vuelve un error, y para entonces no queda nada que detener.",ok:true},{t:"Porque una advertencia se revisa más rápido que un error."}],
    why:"Es el orden de Bogotá: la gente alrededor, luego el mimo, y la multa al final. La regla se acordó con los responsables de datos, se explicó con su razón, que dos suposiciones dan dos números, y corrió como advertencia antes de una fecha que todos conocían. A las cuatro semanas, ya no quedaban advertencias. ¿Qué regla de tu trabajo funcionaría mejor si primero advirtiera, con una fecha que todos conozcan?"},
  "measured":{q:"La carpeta 29 dice que la madurez de la gobernanza se evalúa cada año. ¿Por qué Yusuf la mide, en cambio, desde el trabajo?",
    opts:[{t:"Una evaluación cada año toma demasiado tiempo."},{t:"Una puntuación decía cómo se veía la gobernanza en papel. Las medidas que salen del trabajo, cada día, dicen si se usa: cuánto de lo que leen otros equipos está descrito y tiene dueño, qué controles fallaron y de quién son, y quién vino al horario de atención y volvió.",ok:true},{t:"Porque ahora el gobierno pide una medida cada día."}],
    why:"La puntuación de 2.1 no cambió nada de lo que hacía la gente. Las medidas que salen del trabajo muestran dónde se usa la gobernanza y dónde todavía no, y de quién es el siguiente paso; y la gente que vuelve al horario de atención muestra que la ayuda vale la pena. ¿Qué contarías en tu trabajo para ver si una regla se usa?"}
  }}};
