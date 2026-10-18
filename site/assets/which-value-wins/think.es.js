/* Learning Data: "Pausa para pensar" de Which value wins, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (hidden, rules, emails, dryrun), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "hidden":{q:"La solución rápida deja que gane el valor más nuevo. ¿Por qué la fecha de nacimiento de Linh queda con la errata de RR. HH.?",
    opts:[{t:"RR. HH. es la fuente en la que más confía la universidad."},{t:"RR. HH. vuelve a enviar su archivo completo cada periodo lectivo, así que sus valores siempre parecen los más nuevos, errata incluida.",ok:true},{t:"El sistema de estudiantes perdió su fecha de nacimiento."}],
    why:"Más nuevo significa el último recibido, no el último confirmado, así que una fuente que lo reenvía todo gana siempre. Y un solo orden para todos los campos, dentro del SQL, esconde la elección a los responsables de los datos. ¿Cuál de tus sistemas vuelve a enviar su archivo completo cada noche?"},
  "rules":{q:"RR. HH. envía una fecha de nacimiento distinta de la del sistema de estudiantes. ¿Qué hace la regla de Jun?",
    opts:[{t:"El valor de RR. HH. ocupa el campo, porque es más nuevo."},{t:"Se queda el valor del sistema de estudiantes, y el de RR. HH. espera a Mei, que puede fijar el correcto con un motivo, hasta una fecha.",ok:true},{t:"El registro guarda las dos fechas y las muestra lado a lado."}],
    why:"Cada campo tiene la fuente en la que más confía, como los dos relojes patrón del Beagle. Un valor distinto de otra fuente no ocupa el campo: espera a que una persona decida. Todos los demás campos recurren al mismo orden: la fuente más confiable, luego el valor confirmado más nuevo, luego el más completo. ¿Qué campo de tus datos confiarías a una sola fuente?"},
  "emails":{q:"Linh tiene cuatro correos. ¿Por qué ninguno gana?",
    opts:[{t:"Los correos son demasiado difíciles de comparar."},{t:"Ninguno está mal: cada uno sirve para algo, así que cada uno se guarda como punto de contacto, con su propósito, su fuente y el día en que lo confirmó por última vez.",ok:true},{t:"La columna de correo puede guardar cuatro valores."}],
    why:"No todos los campos tienen un solo valor correcto. Su correo de estudiante es para estudiar, el de personal para el trabajo, y dos son personales, así que cada oficina usa el de su propósito: RR. HH. le escribe a su correo de personal, la oficina de egresados a uno personal. ¿Qué se rompería si se guardara solo uno?"},
  "dryrun":{q:"La oficina de egresados pide una nueva regla para el correo personal. ¿Qué pasa antes de aplicarla?",
    opts:[{t:"Se aplica de inmediato, y reemplaza la regla anterior sin dejar rastro."},{t:"Una simulación lista cada valor que cambiaría, 1284 en total; Mei revisa una muestra, y la jefatura de registro, responsable de los datos, la aprueba.",ok:true},{t:"Jun la prueba solo con el registro de Linh."}],
    why:"Las reglas también cambian. Una simulación muestra cada valor que un cambio tocaría antes de tocar ninguno, el responsable de los datos lo aprueba, y se aplica como versión dos, con su fecha, para que cualquiera vea qué regla eligió un valor, y cuándo. En tu organización, ¿quién debería aprobar un cambio a una regla así?"}
  }}};
