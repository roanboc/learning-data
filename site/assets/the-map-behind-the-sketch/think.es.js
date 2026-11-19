/* Learning Data: "Pausa para pensar" de The map behind the sketch, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (two, knows, kept, cross), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es el lab interactivo de esta película en el paquete de la serie,
   que enseña la misma idea; el .player data-labs de la página dice dónde está. Las respuestas correctas, en los mismos lugares que en inglés. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "two":{q:"La corte le dio a los hogares y a los campos un registro a cada uno. ¿Qué le dio eso que un solo registro de todo no le daría?",
    opts:[{t:"Un libro más corto por condado, para que los escribanos lo copiaran más rápido cada año."},{t:"Una tarea por registro: quién tenía un campo se fijaba en uno, lo que debía una familia, en el otro.",ok:true},{t:"Dos conteos de cada hogar, uno de cada registro, para cotejarlos entre sí.",near:true}],
    why:"Cada registro tenía una sola tarea, y un solo lugar resolvía cada pregunta: una disputa por un campo iba al registro de tierras, y el impuesto y el trabajo de una familia salían del registro de hogares. Dos libros que dijeran ambos quién tenía un campo darían dos respuestas."},
  "knows":{stop:"place",q:"El dominio de estudiantes es de Mei. Jun cambia cómo se construye el modelo de inscripciones, y nada de lo que significa cambia. ¿Qué le toca a Mei?",
    opts:[{t:"Revisa el pull request de Jun, porque todo cambio a los datos de su dominio necesita su aprobación.",near:true},{t:"Nada, salvo que cambie lo que significa una palabra: ella decide el significado y cómo son los datos buenos.",ok:true},{t:"Hace ella misma el cambio, porque la dueña de un dominio responde por todos sus datos."}],
    why:"Una dueña decide qué significan las palabras, y cómo son los datos buenos, y no construye nada. El equipo de datos hace el cambio y revisa el código; a Mei se le avisa qué toca, y decide solo cuando cambia un significado."},
  "kept":{q:"La copia de la plataforma y el sistema de estudiantes no coinciden en si una inscripción se dio de baja. ¿Dónde se corrige?",
    opts:[{t:"En la copia de la plataforma, porque es la tabla que leen los tableros y los reportes.",near:true},{t:"En las dos a la vez, a mano, para que los tableros y el sistema coincidan desde hoy."},{t:"En el sistema de estudiantes, donde se escribió primero; la copia sigue en su próxima carga.",ok:true}],
    why:"El sistema de estudiantes es el sistema de registro de la inscripción: cuando no coinciden, gana el registro. Un arreglo hecho en la copia se pierde en su próxima carga, y el registro sigue mal para todos los demás que lo leen."},
  "cross":{stop:"place",q:"Planificación necesita las inscripciones para su informe de corte. Al cruzar los dos mapas, ¿qué es Planificación para las inscripciones?",
    opts:[{t:"Una lectora: aprendizaje y enseñanza las crea, y Planificación las lee cuando las necesita.",ok:true},{t:"Una segunda creadora: escribe sus propias inscripciones en sus registros, contadas en la fecha de corte.",near:true},{t:"La dueña: quien cuenta algo para el gobierno decide qué significa eso que cuenta."}],
    why:"Un creador para cada cosa, y tantos lectores como la necesiten. Aprendizaje y enseñanza crea las inscripciones, en el sistema de estudiantes; Planificación las lee en su fecha de corte. Una segunda creadora significaría dos inscripciones para un estudiante, y dos cifras."}
  }}};
