/* Learning Data: "Pausa para pensar" de An agent that checks, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (today, decides, written), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "today":{q:"El cambio de Anil vuelve con cuatro vacíos. ¿Por qué todavía tiene que esperar a alguien?",
    opts:[{t:"Las verificaciones fallan, así que alguien tiene que leer cada cambio a mano."},{t:"Las verificaciones dicen qué falta, no qué es lo correcto para esta lista, ni quién lo decide.",ok:true},{t:"Jun tiene que aprobar cada cambio de la universidad."}],
    why:"Una verificación puede decir que una columna no tiene clase. No puede decir si las columnas de esta lista identifican a una persona, ni quién responde por la lista: esas son decisiones de quienes son dueños de los datos. Hasta que alguien las nombre, todo cambio sin otro dueño espera a la única persona que conoce las reglas. En tu trabajo, ¿qué solicitudes esperan a una sola persona?"},
  "decides":{q:"El agente vio un código largo con dos valores para siete estudiantes. ¿Por qué no lo clasificó como que no identifica a nadie?",
    opts:[{t:"Un agente siempre elige la clase más estricta, para cada columna."},{t:"La evidencia no coincidía, así que la lista de verificación dice proponer la clase más estricta y preguntar al dueño, que sabe de qué sale el código.",ok:true},{t:"No tenía permiso para leer los valores del código."}],
    why:"Una clase es una afirmación sobre los datos, y decide qué se protege. Los conteos decían que quizá no era una persona; el código se parecía a uno que sí lo es. Así que el agente propuso la clase más estricta, dijo que no estaba seguro y preguntó, y Anil, que conoce la lista, decidió. ¿Dónde querrías que un asistente dijera “no estoy seguro” en vez de adivinar?"},
  "written":{q:"“El personal cuida de usar bien los términos.” ¿Podría verificarlo un agente? ¿Qué podría ocupar su lugar?",
    opts:[{t:"Sí, si el agente lee cada informe."},{t:"No: el cuidado no se puede verificar. Sí se puede verificar que cada término de un informe venga del glosario, o puede ser una decisión con dueño; o la línea se va.",ok:true},{t:"No, así que la línea debe quedarse como está."}],
    why:"Un agente solo puede seguir lo que está escrito con la claridad suficiente para verificarlo, y “cuidar” no señala nada que revisar. Que cada término de un informe venga del glosario es algo que una verificación puede confirmar cada noche. Elige una línea de una política que conozcas: ¿podría verificarla un agente?"}
  }}};
