/* Learning Data: "Pausa para pensar" de A product with an owner, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (promise, steps, life), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "promise":{q:"En marzo pasado, nadie respondía por el conteo de Planificación. ¿Qué cambia al escribirlo como un producto?",
    opts:[{t:"El equipo de datos lo construye más rápido, porque ahora es un producto."},{t:"Una persona responde por él, y su promesa está escrita donde la gente mira: para qué sirve, qué contiene, cuándo está listo y dónde preguntar.",ok:true},{t:"Planificación construye la tabla, en lugar del equipo de datos."}],
    why:"Una tabla con una promesa y un dueño es un producto. Clara responde por ella, mientras Jun la sigue construyendo, Noor la diseña y Sam la opera. La ficha en el catálogo dice para qué sirve, qué contiene, que está lista a las siete el día del censo y dónde preguntar, así que nadie tiene que adivinar a quién llamar. Como en el bazar, un comprador sabe quién respalda la mercancía. ¿Qué tabla de tu trabajo dejaría a todos señalando a otro si llegara tarde?"},
  "steps":{q:"Una tabla que ordena los datos del sistema de estudiantes la usa solo el equipo de datos. ¿Es un producto?",
    opts:[{t:"Sí: cada tabla que mantiene el equipo de datos es un producto."},{t:"No, es un paso. Una tabla pasa a ser parte de un producto cuando otros equipos la usan, y entonces pertenece a uno solo.",ok:true},{t:"Sí, si pasa sus controles cada noche."}],
    why:"De las treinta y tres tablas del equipo de datos, otros equipos usan diez, y cada una de ellas pertenece a uno de seis productos. Las otras veintitrés son pasos, que solo necesita el equipo de datos, así que pueden cambiar sin preguntarle a nadie. Cada cambio se revisa: una tabla que usan otros equipos, sin producto, se devuelve, como la lista de seguimiento del equipo de aprendizaje hasta que tuvo uno. ¿Qué tablas tuyas usan otros equipos sin que nadie responda por ellas?"},
  "life":{q:"La primera edición de las credenciales está obsoleta. ¿Qué tiene que pasar antes de retirarla?",
    opts:[{t:"Nada: cuando queda obsoleta, se puede borrar el mismo día."},{t:"Se pide a sus usuarios, según el registro de quién usa qué, que pasen a la segunda edición. Cuando no queda ninguno, se retira en su fecha.",ok:true},{t:"Se avisa a una lista de correo, y se retira cuando nadie responde."}],
    why:"Obsoleta quiere decir que tiene una fecha para irse, y que se pide a sus usuarios que se cambien. El registro de quién usa qué muestra quiénes son, no una lista de correo, así que nadie queda atrás. La primera edición ya no tiene usuarios, así que a fines de marzo de 2027 se retira. ¿Qué sigue funcionando en tu trabajo sin que nadie lo use?"}
  }}};
