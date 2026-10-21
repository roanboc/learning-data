/* Learning Data: "Pausa para pensar" de Fixed where it starts, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (back, never, rule), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "back":{q:"Staging limpiaba los correos cada noche, y nada se rompía. ¿Por qué no bastaba?",
    opts:[{t:"Staging era demasiado lento para limpiar todos los correos a tiempo."},{t:"Limpiaba donde el problema se veía, no donde empezaba: el formulario seguía creando correos así, y cada sistema que los leía tenía que limpiarlos otra vez.",ok:true},{t:"La política no permite limpiar en staging."}],
    why:"El trapeador trabaja cada noche, y la gotera nunca para. El formulario guardaba cada correo tal como se escribía, y finanzas y la lista de correo volvían a limpiar los mismos correos. Siguiendo el rastro, un correo llevó al formulario, donde nadie había escrito nada mal. ¿Dónde se limpia lo mismo dos veces en tu trabajo?"},
  "never":{q:"Ahora el formulario recorta y verifica cada correo. ¿Para qué guardar una prueba que nunca debería fallar?",
    opts:[{t:"El tablero necesita una prueba en esa celda para mostrar verde."},{t:"Es una promesa a todos los que leen los correos, y si el formulario alguna vez se rompe, por ejemplo tras una actualización, su dueño se entera primero.",ok:true},{t:"Staging todavía limpia los correos, y la prueba revisa la limpieza."}],
    why:"Un arreglo en el origen puede deshacerse solo: una nueva versión del formulario, una actualización del proveedor. La regla se queda como prueba, así que si alguna vez falla, el equipo de aprendizaje se entera primero, antes que nadie más adelante, y la limpieza en staging se puede quitar para siempre. ¿Cuál de tus arreglos dejaría de funcionar sin que nadie lo notara?"},
  "rule":{q:"¿Regla o monitoreo? «Una microcredencial lleva créditos». «Las insignias de anoche no se parecen a las de otras noches».",
    opts:[{t:"Las dos son reglas: escribe una prueba para cada una."},{t:"La primera es algo que sabes, así que es una prueba con dueño. La segunda es lo que detecta el monitoreo; cuando confirmas lo que encontró, se vuelve una regla.",ok:true},{t:"Las dos son monitoreo: deja que aprenda qué es lo normal."}],
    why:"Prueba lo que sabes; vigila lo que no sabes. Todas las pruebas pasaron la noche en que la mitad de las insignias llegó con cero créditos, porque ninguna regla lo nombraba. El monitoreo conocía la forma habitual, una de cada doce, y avisó al dueño que dicen los metadatos. Cuando se confirmó la causa, la sorpresa se volvió una regla, una prueba con dueño. ¿Qué sorpresa ha tenido tu equipo que ninguna prueba detectaría todavía?"}
  }}};
