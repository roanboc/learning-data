/* Learning Data: "Pausa para pensar" de One copy, one platform, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (usual, copy, fewer), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "usual":{q:"En el diseño de siempre, un pipeline copia cada cambio de la base de datos de la app a una plataforma analítica. ¿Qué cuesta esa copia?",
    opts:[{t:"Dos plataformas, un pipeline que operar, dos juegos de permisos y una copia siempre un poco atrasada.",ok:true},{t:"Dos plataformas que pagar, pero un solo juego de permisos, porque las dos guardan las mismas declaraciones.",near:true},{t:"Solo el almacenamiento: son los mismos datos, así que la copia sigue bien sin que nadie trabaje en ella."}],
    why:"La película hace la cuenta: dos plataformas, el pipeline entre ellas, dos juegos de permisos que mantener al día y una copia siempre un poco atrasada respecto de la app. Los mismos datos no significan las mismas reglas: cada plataforma da sus propios accesos. ¿Qué cuesta una copia donde trabajas?"},
  "copy":{q:"La lista de Nómina, el proceso de horas y el costo de Finanzas leen las filas que escribe la app. ¿Por qué la app no se vuelve más lenta?",
    opts:[{t:"Porque los lectores esperan a la noche, cuando nadie está escribiendo declaraciones en la app."},{t:"Porque un pipeline del equipo copia las filas cada noche, y el lakehouse lee esa copia.",near:true},{t:"Porque la plataforma guarda las filas en una segunda forma, y el lakehouse lee esa forma.",ok:true}],
    why:"Dos motores, una copia que gestionas: Postgres atiende a la app, y la plataforma guarda las mismas filas en una segunda forma para análisis, así que el lakehouse las lee sin frenarla. Ningún equipo arma ni corre esa segunda forma: un pipeline nocturno era el del diseño de siempre. ¿Cuáles de tus reportes leen una copia solo para no hacer más lenta una app?"},
  "fewer":{q:"En esta plataforma, una sola cosa sigue saliendo: las horas a pagar, antes del mediodía de cada martes. ¿Por qué esa?",
    opts:[{t:"Porque el equipo de Nómina no trabaja en la plataforma, así que necesita su propia copia de cada declaración.",near:true},{t:"Porque Nómina paga desde un sistema de nómina que la universidad compra, y que no está en la plataforma.",ok:true},{t:"Porque el pago está más seguro en una segunda copia que en las mismas filas que escribe la app cada día."}],
    why:"Nómina paga desde un sistema de nómina que la universidad compra, fuera de la plataforma, así que las horas a pagar salen de ella antes del mediodía del martes, bajo un contrato con Nómina. Se mueve una sola cosa, a propósito, en vez de una copia de todo: las declaraciones se quedan donde se escriben. ¿Qué sistema que compras guarda su propia copia, y qué dice su contrato?"}
  }}};
