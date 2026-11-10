/* Learning Data: "Pausa para pensar" de Proof it held, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (review, gap, reads, ends), con una pregunta cada vez. think.js las
   muestra, y las lista otra vez en "Piénsalo" (#think-list). Los labs del módulo llegan más adelante, como un solo conjunto,
   así que ninguna pregunta tiene "stop" todavía, y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Quitar las pausas",right:"Correcto.",wrong:"No exactamente.",start:"Reproducir con pausas para pensar",answer:"Respuesta:",watch:"Mira esta parte"},
  qs:{
  "review":{q:"Elena pasó a otro proyecto en diciembre. ¿Por qué siguió en el grupo del estudio?",
    opts:[{t:"Su acuerdo de confidencialidad estaba vigente, y eso basta para seguir en el grupo.",near:true},{t:"La revisión mantenía a todos aquellos cuyo revisor no respondía en una semana."},{t:"Seguía trabajando en la universidad, así que nada avisó al directorio del cambio.",ok:true}],
    why:"Cambiar de proyecto no es algo de lo que el directorio se entere: su cuenta siguió funcionando, y su lugar también. Un acuerdo de confidencialidad vigente hace falta para seguir en el grupo, pero no saca a quien ya se fue. La revisión es la red que lo atrapa, y desde ahora Anil avisa a Yusuf el día que alguien deja el estudio. Donde trabajas, ¿qué pasa con el acceso de alguien que cambia de equipo?"},
  "gap":{q:"Desde las nueve y media del 8 de enero, la nueva columna de celulares quedó enmascarada. ¿Qué la enmascaró?",
    opts:[{t:"Mei le dio la clase direct, y la política para direct la cubrió al momento.",ok:true},{t:"Sam escribió una máscara solo para esa columna, en cuanto le llegó la alerta."},{t:"La clasificación vio que era un teléfono, y ese hallazgo la enmascara solo.",near:true}],
    why:"La política sigue a la clase, no a la columna: en cuanto Mei, su dueña, la clasificó como direct, la política para direct la enmascaró, sin escribir ninguna regla nueva. La clasificación solo dice a qué se parece una columna; su dueña decide su clase. Donde trabajas, ¿quién decide la clase de una columna nueva, y en cuánto tiempo?"},
  "reads":{q:"¿Cómo sabe el equipo que nadie vio un número de celular mientras la columna no tenía clase?",
    opts:[{t:"Nadie dijo haber visto uno, y el acuerdo prohíbe sacar datos del espacio del estudio."},{t:"La auditoría dice que solo la leyó la carga nocturna, y el linaje, que no salió de ahí.",ok:true},{t:"La política para direct enmascaraba toda columna nueva hasta que su dueña la clasificara.",near:true}],
    why:"Que nadie haya dicho nada es esperanza, no prueba. La política tampoco podía ayudar: oculta una clase, y la columna aún no tenía ninguna. La prueba está en dos registros que guarda la plataforma: la auditoría, que muestra quién leyó la tabla y cuándo, y el linaje, que muestra adónde fue cada columna. ¿Cuál de las protecciones de tus datos podrías probar hoy, con un registro?"},
  "ends":{q:"El 30 de junio de 2027, ¿qué saca a Anil del grupo del estudio?",
    opts:[{t:"Su lugar en el grupo termina en esa fecha, y el directorio lo quita solo.",ok:true},{t:"La última revisión de Mei, en la que responde que no para cada miembro.",near:true},{t:"Yusuf, que vacía el grupo a mano al final del último día del acuerdo."}],
    why:"Cada lugar en el grupo se dio hasta el fin del acuerdo, así que termina solo, sin que nadie tenga que responder, y los permisos hechos desde el contrato terminan el mismo día. Las revisiones siguen comprobando hasta entonces, y la comprobación de Yusuf del 1 de julio prueba que terminó. Donde trabajas, ¿qué acceso no tiene fecha de fin?"}
  }}};
