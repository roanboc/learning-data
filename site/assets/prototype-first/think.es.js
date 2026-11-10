/* Learning Data: "Pause and think" for Prototype first, in Spanish. Keep the keys in step with think.en.js.
   The film stops at the end of three chapters (real, rounds, enough), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  real:{q:"El 7 de abril, el primer borrador del agente cuenta cada hora reservada como usada. ¿Cómo se detecta antes de que alguien construya sobre él?",
    opts:[{t:"Jun lo encuentra al revisar el cambio ese día, porque quien revisa está para ver lo que el autor no vio."},{t:"Ivy lee ella misma las notas del agente hasta el final y contrasta su borrador con lo que contaron los sensores.",ok:true},{t:"Ivy le pide al agente que contraste su propio borrador con los sensores, y este le informa las horas que contó mal.",near:true}],
    why:"Rápido no es descuidado. El agente propone y las personas revisan: Ivy leyó sus notas hasta el final, donde decía lo que había supuesto, y contrastó ella misma el borrador con los conteos de personas. Luego el uso de aulas, tal como lo entiende Graham, entró al glosario, el modelo se construyó a partir de él, y Jun revisó el cambio de Ivy: nadie aprobó su propio trabajo. ¿Dónde se escondería un supuesto equivocado en un borrador que no escribiste tú?"},
  rounds:{q:"Cada viernes, Helena le hace a Graham la misma pregunta: ¿qué le haría cambiar de opinión? ¿Qué le da su respuesta al equipo?",
    opts:[{t:"Lo que la siguiente ronda tiene que mostrar, y una forma de saber cuándo basta para su decisión.",ok:true},{t:"Lo que la siguiente ronda tiene que mostrar, para que el tablero sume un gráfico por semana hasta Pascua.",near:true},{t:"Una lista completa de lo que debe hacer el tablero, para construirlo todo antes de que vuelva a mirarlo."}],
    why:"Su respuesta convierte un pedido vago en una prueba que los datos pueden pasar o no: llenas toda la semana, o no; luego, ¿se sostendrá en 2030? Cada ronda responde una de esas preguntas con lo real en la pantalla, y cuando su decisión tiene lo que necesita, las rondas paran: una cuarta solo la puliría. ¿Qué le haría cambiar de opinión a quien espera tu trabajo?"},
  enough:{q:"Después de la tercera ronda, las rondas paran. ¿Qué queda del prototipo?",
    opts:[{t:"El modelo revisado y el tablero, con lo que significa uso de aulas escrito en las notas del propio equipo.",near:true},{t:"Solo lo aprendido: un prototipo se tira, y el producto se vuelve a construir desde el principio."},{t:"La definición en el glosario, el modelo revisado y un tablero del que Ivy es dueña desde julio.",ok:true}],
    why:"El prototipo se hizo bien desde el primer día: datos reales, gobernados, una definición en el glosario de la que Graham es dueño, y un modelo construido a partir de ella y revisado por Jun. Así que no se tira nada. Lo que enseñó se queda en el producto, y el tablero se vuelve un producto propio, con Ivy como dueña. ¿Qué dejaría tu prototipo si parara este viernes?"}
  }}};
