/* Learning Data: "Pausa para pensar" de For this purpose only, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (wish, wishes, platform, request), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "wish":{q:"Linh pidió a la oficina de egresados que no le pidieran donaciones, y aun así la campaña le llegó. ¿Por qué?",
    opts:[{t:"La oficina de egresados olvidó anotarlo."},{t:"Su no se anotó en su registro de egresada, y la campaña la encontró por el sistema de estudiantes, que nunca se enteró.",ok:true},{t:"Ella había cambiado de opinión."}],
    why:"Un deseo guardado en el registro de un rol solo llega a las listas que leen ese registro. La campaña fue a los estudiantes y egresados de la facultad, y encontró a Linh como estudiante, donde nada decía que no. ¿Alguna vez le pediste a una organización que no te contactara, y aun así te escribió, por otra puerta?"},
  "wishes":{q:"¿Por qué el no de Linh a las donaciones va en la persona, y no en su registro de egresada?",
    opts:[{t:"Su registro de egresada se va a borrar pronto."},{t:"Es un deseo suyo, no de un rol: por cualquier rol que una lista la encuentre, el no va con ella.",ok:true},{t:"Solo el registro de la persona puede guardar una fecha."}],
    why:"Los propósitos de un rol dicen para qué son sus datos. Un deseo dice lo que ella quiere, dondequiera que aparezca. Guardado en la persona, con su propósito, su fecha, a quién lo dijo y cómo cambiarlo, cierra cada puerta que ese propósito abriría. ¿Dónde estará hoy un \"no me contacten\" que alguna vez le diste a una organización?"},
  "platform":{q:"El equipo de campañas pide las notas de los mejores estudiantes del año. ¿Qué hace la plataforma?",
    opts:[{t:"Rechaza la tabla entera."},{t:"Oculta las notas, que están etiquetadas para la enseñanza, y deja fuera a cualquiera cuyos deseos digan que no.",ok:true},{t:"Le pide a Jun que quite las notas a mano."}],
    why:"dbt escribe el propósito de cada columna como una etiqueta, y una prueba falla si un dato personal no tiene propósito. Dos políticas en Unity Catalog leen las etiquetas: una máscara de columna le oculta al equipo de campañas lo etiquetado para la enseñanza, y un filtro de filas deja fuera a quien dijo que no. Cada una se escribe una vez, y toda tabla con esas etiquetas la sigue. ¿Cuáles de tus tablas necesitarían un propósito primero?"},
  "request":{q:"Si Linh pidiera que la olvidaran, ¿por qué la universidad no podría borrar todo lo que tiene de ella?",
    opts:[{t:"Borrar datos personales nunca está permitido."},{t:"Cada rol guarda solo lo que debe: su título para siempre, los datos de su proyecto mientras sus reglas lo exijan, y un pequeño registro de su no, para que siga valiendo.",ok:true},{t:"Sus registros están vinculados, así que ninguno se puede borrar."}],
    why:"El olvido se decide rol por rol, partiendo de la persona: queda lo que una ley, una regla o su propio deseo todavía necesita, y el resto se va. Guardar que dijo que no es lo que hace que un \"no me contacten\" siga funcionando. ¿Qué tendría que guardar de ti una organización que te conoce, y por cuánto tiempo?"}
  }}};
