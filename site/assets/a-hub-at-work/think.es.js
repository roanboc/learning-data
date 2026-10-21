/* Learning Data: "Pausa para pensar" de A hub at work, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (why, ai, publish, friday), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "why":{q:"Las reglas dieron 74 a la coincidencia de Rafael. ¿Y si sus dos fechas de nacimiento coincidieran?",
    opts:[{t:"Seguiría en 74: las fechas de nacimiento no cuentan."},{t:"93, en la franja donde las reglas vinculan solas, sin preguntar a nadie.",ok:true},{t:"Habría decidido el asistente de IA."}],
    why:"Cada comparación suma peso o lo resta, y la franja donde cae el puntaje dice quién actúa: desde 90, las reglas vinculan solas; de 60 a 90, decide una persona; bajo 60, los registros quedan separados. Un dígito en una fecha de nacimiento llevó a Rafael de una franja a la otra. ¿Qué campo de tus sistemas, mal escrito, cambiaría quién decide?"},
  "ai":{q:"El asistente de IA lee el formulario de Rafael y su registro antiguo, y sugiere que son la misma persona. ¿Por qué no los vincula él mismo?",
    opts:[{t:"No puede leer un formulario."},{t:"Sugiere y explica; los casos dudosos para las reglas los decide una persona, y se guardan su nombre y su razón.",ok:true},{t:"Solo vincula registros los fines de semana."}],
    why:"Las reglas actúan en los casos claros; el asistente lee el sentido además de la ortografía, y redacta una nota; los casos dudosos quedan en manos de personas, que responden por ellos. Su decisión también le enseña al asistente. ¿Dónde pondrías el límite de lo que un asistente de IA puede hacer con registros sobre personas?"},
  "publish":{q:"La oficina de egresados necesita saber que Rafael está postulando. ¿Por qué no ve su fecha de nacimiento?",
    opts:[{t:"Se borró cuando se graduó."},{t:"Cada sistema lee solo lo que le concierne, y una máscara de columna oculta su fecha de nacimiento a una oficina que no la necesita.",ok:true},{t:"El flujo lleva cambios, nunca personas."}],
    why:"El hub publica cada cambio, y cada sistema lee lo que le concierne, en vez de que le sobrescriban sus registros. Lo que una oficina puede ver sigue a su propósito: la oficina de egresados deja de invitarlo a volver sin ver nunca su fecha de nacimiento. Piensa en un campo que tu equipo recibe pero nunca usa. ¿Debería recibirlo?"},
  "friday":{q:"Leila revisa cincuenta vínculos automáticos sin ver lo que decidieron las reglas. ¿Por qué ocultárselo?",
    opts:[{t:"Para que la revisión sea más rápida."},{t:"Para no influirla: quien revisa viendo la respuesta tiende a darle la razón.",ok:true},{t:"Porque las decisiones de las reglas son secretas."}],
    why:"Una revisión a ciegas mide las reglas con honestidad: esta semana, un vínculo de cada cincuenta estaba mal, y Mei lo desvinculó. La oficina también acordó una regla: si más de tres de cada cincuenta están mal, la vinculación automática se detiene, y cada coincidencia espera a una persona hasta acordar reglas nuevas. ¿Cuál sería tu umbral, y quién acordaría las reglas nuevas?"}
  }}};
