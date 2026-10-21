/* Learning Data: "Pausa para pensar" de Who may see it, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (column, purpose, stars), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "column":{q:"La clave de un título, SIS|S-20417|GCDA, parece un código. ¿Qué clase tiene su columna?",
    opts:[{t:"Ninguna: es un código, y un código solo nunca es un dato personal."},{t:"Directa: lleva el ID del estudiante, que identifica a alguien por sí solo.",ok:true},{t:"Seudónima: solo el sistema de estudiantes puede saber de quién es."}],
    why:"Casi todas las claves de credenciales son solo códigos, pero la clave de un título lleva el ID del estudiante, y un ID de estudiante identifica a una persona por sí solo. Por eso Mei clasificó la columna directa: la línea del tribunal, trazada en la columna. Nada puede darse por insignificante. ¿Qué códigos de tus datos llevan un identificador dentro?"},
  "purpose":{q:"Clara solo ve claves codificadas. ¿Por qué su acceso igual necesita un propósito y una fecha de fin?",
    opts:[{t:"No lo necesita: una vez codificada la clave, nadie puede saber nunca quién es."},{t:"Una clave sigue siendo un dato personal: cualquiera con los IDs de estudiantes podría codificarlos y compararlos.",ok:true},{t:"Solo porque todo acceso necesita una fecha, muestren lo que muestren sus columnas."}],
    why:"La clave es el ID del estudiante, codificado siempre de la misma manera. Cualquiera con la lista de IDs podría pasar cada uno y encontrar la clave que coincide, así que la clave es seudónima: sigue siendo un dato personal. Por eso hasta las claves llevan un propósito y una fecha de fin. ¿Qué parece anónimo en tus datos, pero podría revertirse?"},
  "stars":{q:"Ahora Clara necesita nombres, para un propósito nuevo. ¿Qué pasa?",
    opts:[{t:"Copia la tabla en una hoja de cálculo que puede guardar y compartir."},{t:"Le pide a la oficina de registro, dueña de la tabla de estudiantes, y dice para qué.",ok:true},{t:"Le pide al equipo de datos, que construye la tabla, que quite la máscara."}],
    why:"Mei decide por su oficina: sí, para ese propósito y hasta una fecha, o su oficina hace el paso que necesita nombres. Yusuf le dijo a Clara por qué están los asteriscos y le mostró cómo obtener más, porque un no sin salida es como las tablas terminan copiadas en hojas de cálculo. Cuando alguien te pide más datos, ¿qué salida le das?"}
  }}};
