/* Learning Data: "Pausa para pensar" de Hot, warm, cold, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (cold, warm, hot), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "cold":{q:"Al preguntarle en agosto, Finanzas quería el gasto en vivo, al minuto. ¿Por qué le sirve más una vista que se calcula cada noche?",
    opts:[{t:"El dinero se mueve entre presupuestos una vez al mes: las cifras de ayer llegan a tiempo, y cuestan menos.",ok:true},{t:"Las cifras de ayer bastan, porque un stream no puede leer el libro mayor del sistema de finanzas.",near:true},{t:"Finanzas lo pidió en vivo, así que la vista nocturna solo sirve hasta que se construya un stream."}],
    why:"Noor no tomó la respuesta de Finanzas de una pregunta: miró qué pasa después. El gasto se revisa una vez al mes, y solo entonces se mueve dinero, así que las cifras de ayer llegan a tiempo, y una corrida nocturna cuesta una parte pequeña de un stream. La plataforma podría hacer streaming; la necesidad no lo pide. Donde trabajas, ¿con qué datos se actúa días o semanas después de que cambian?"},
  "warm":{q:"Los cambios de contrato llegan ahora cada cinco minutos. ¿Por qué no traer cada uno en un segundo?",
    opts:[{t:"El sistema de RR. HH. no puede enviar un cambio más rápido que una vez cada cinco minutos."},{t:"Un segundo también llegaría a tiempo, y cuesta más o menos lo mismo que un pipeline cada cinco minutos.",near:true},{t:"Los coordinadores aprueban toda la mañana, así que cinco minutos llegan a tiempo, y cuestan mucho menos.",ok:true}],
    why:"Un coordinador que aprueba declaraciones hasta el mediodía del lunes actúa en minutos u horas, no en segundos. Cada cinco minutos llega a tiempo para eso, y un pipeline que corre cada cinco minutos cuesta mucho menos que uno que nunca se detiene. El sistema de RR. HH. ya envía cada cambio al hacerse; cada cuánto corre el pipeline lo decide el negocio. Donde trabajas, ¿quién actúa dentro de la hora?"},
  "hot":{q:"Una regla retiene ahora un pago en un segundo ante un cambio de cuenta bancaria sospechoso. ¿Por qué sigue llegando el archivo nocturno?",
    opts:[{t:"La regla necesita una segunda mirada: el archivo revisa cada cambio de noche, por si se le escapó uno."},{t:"Un evento lleva solo lo que cambió; el registro completo y cada corrección llegan en el archivo.",ok:true},{t:"Un evento lleva solo lo que cambió, así que el archivo nocturno se guarda solo para los auditores.",near:true}],
    why:"Cada evento dice solo lo que cambió, en el momento en que cambió. El registro de pago completo, y cada corrección posterior, siguen llegando en el archivo nocturno, así que lo caliente nunca va solo: necesita el camino frío al lado, y es lo más caro, porque nunca se detiene. Donde trabajas, ¿hay una acción que una máquina debe tomar en un segundo?"}
  }}};
