/* Learning Data: "Pausa para pensar" de It feels like understanding, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (fluent, meanings, knowing), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "fluent":{q:"La respuesta del agente llegó con una verificación superada y su evidencia adjunta. ¿Qué le dice eso a Jun?",
    opts:[{t:"Que el número sirve para el plan de Anil."},{t:"Que su total coincidió con lo que verificó. Si contó lo que Anil necesita, solo la evidencia y una persona pueden decirlo.",ok:true},{t:"Nada en absoluto."}],
    why:"Una verificación confirma lo que compara, nada más. Una verificación superada y un clip hacen que una respuesta parezca terminada; no dicen qué significa el número. Donde trabajas, ¿qué respuestas parecen terminadas porque llegan con una marca?"},
  "meanings":{q:"El agente contó 2,160 y su verificación pasó. ¿Por qué pasó?",
    opts:[{t:"Comparó el total con la misma tabla que había contado: confirmó la suma, no el significado.",ok:true},{t:"La verificación estaba rota."},{t:"El agente cambió los datos."}],
    why:"La suma estaba bien; la pregunta era otra. Una verificación contra la propia fuente del agente no puede detectar otro significado. Donde trabajas, ¿qué palabra significa una cosa para ti y otra en la tabla de la que informas?"},
  "knowing":{q:"¿Qué cambio habría detectado el error antes de que la facultad planificara sus asesores?",
    opts:[{t:"Una explicación más larga del agente."},{t:"Un segundo agente que apruebe al primero."},{t:"Comparar el conteo con la propia lista de estudiantes de la facultad, cada vez.",ok:true}],
    why:"Un conteo que el agente no hizo muestra la diferencia enseguida, con una regla simple. Las explicaciones más largas dan más confianza, no más exactitud, y un agente nunca aprueba: su marca es de referencia, y decide una persona. Donde trabajas, ¿con qué podrías comparar los números de un agente?"}
  }}};
