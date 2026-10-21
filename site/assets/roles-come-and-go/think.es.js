/* Learning Data: "Pausa para pensar" de Roles come and go, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (flags, terms, line, table), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "flags":{q:"Planificación volvió a calcular el censo del año pasado, y Linh apareció como estudiante, meses antes de volver. ¿Qué salió mal?",
    opts:[{t:"El sistema de estudiantes tenía mal la fecha de su regreso."},{t:"Cada sistema le manda a la plataforma solo cómo la ve hoy, y lo sobrescribe cada noche, así que una pregunta sobre el año pasado sigue recibiendo la respuesta de hoy.",ok:true},{t:"Planificación contó en la fecha de censo equivocada."}],
    why:"Un estado es cierto por un día. El sistema de estudiantes sabe que volvió en julio de 2025, pero la plataforma guardó solo la palabra de hoy, inscrita, así que cada fecha recibe la respuesta de hoy. Piensa en una lista de sí o no que lleves, como el personal actual o los miembros activos. ¿Qué diría sobre el año pasado?"},
  "terms":{q:"El 15 de enero de 2026, entre semestres, ¿Linh es tutora?",
    opts:[{t:"Sí: ha dado tutorías cada semestre desde 2023."},{t:"No: ese día no hay ningún contrato abierto. Sigue siendo la misma persona, y su próximo contrato empieza con el semestre 1.",ok:true},{t:"Solo si el sistema de RR. HH. todavía dice personal eventual."}],
    why:"RR. HH. le ofrece trabajo un periodo lectivo a la vez, así que el rol de tutora empieza y termina con cada contrato. El 15 de enero no hay ningún contrato abierto, así que no es parte del personal; en la fecha de censo, el 31 de marzo, el contrato del semestre 1 sí lo está, así que lo es. ¿Qué roles, donde trabajas, empiezan y terminan con un periodo o un contrato?"},
  "line":{q:"En la fecha de censo, Linh tiene cuatro roles abiertos. Planificación cuenta a los estudiantes que también trabajan aquí. ¿Cuántas veces cuenta ella?",
    opts:[{t:"Tres: una como estudiante, otra como tutora y otra como investigadora."},{t:"Una: Planificación cuenta personas, y ella es una persona con un rol de estudiante y un rol de trabajo abiertos ese día.",ok:true},{t:"Cuatro: una por cada rol abierto, egresada incluida."}],
    why:"La pregunta de Planificación es sobre personas, así que cuenta personas, y los roles abiertos en la fecha de censo son el filtro: tres filas, una persona. ¿Cuáles de tus reportes cuentan roles, o filas, cuando quieren decir personas?"},
  "table":{q:"El contrato del semestre 1 de Linh empezó el 23 de febrero, pero se cargó el 6 de abril, antes de que se publicara el reporte del censo, el 14 de abril. ¿Está en el conteo de la fecha de censo de Planificación como parte del personal?",
    opts:[{t:"No: en la fecha de censo, la plataforma todavía no tenía su contrato."},{t:"Sí: el contrato es válido desde el 23 de febrero. recorded_at dice cuándo lo supo la plataforma, y eso solo importa para lo que se sabía en un día dado.",ok:true},{t:"Solo si RR. HH. lo vuelve a cargar con una fecha anterior."}],
    why:"Las fechas de un rol dicen cuándo fue cierto, y recorded_at dice cuándo lo supo la plataforma. Si se pregunta al 31 de marzo, el contrato cuenta, porque era válido ese día. Si se pregunta qué se sabía el 1 de abril, no contaría, porque no se registró hasta el 6 de abril. Las dos preguntas son válidas, y una sola tabla responde cada una."}
  }}};
