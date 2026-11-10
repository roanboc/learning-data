/* Learning Data: "Pausa para pensar" de An agreement first, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (promise, agreement, grant), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  promise:{q:"Anil no renovó este año su acuerdo de confidencialidad. ¿Qué pasa con su acceso?",
    opts:[{t:"Nada todavía: el acuerdo del estudio dura hasta el 30 de junio de 2027, y su acceso también.",near:true},{t:"Sus grupos se pausan hasta que lo renueve; el acuerdo del estudio y su permiso no cambian.",ok:true},{t:"Mei lo renueva por él, ya que es dueña de los expedientes del estudio y firma su acuerdo."}],
    why:"El acuerdo de confidencialidad de cada persona es una condición para estar en cualquier grupo que da acceso: mientras esté firmado y vigente, está dentro; cuando vence, sus grupos se pausan hasta que lo renueve. El acuerdo del estudio no cambia, y nadie puede firmar la promesa de otra persona. Donde trabajas, ¿quién revisa que todos los que tienen acceso hayan firmado este año?"},
  agreement:{q:"Anil quiere revisar los números del estudio en su laptop, en casa. ¿Qué le deja llevarse el acuerdo?",
    opts:[{t:"Una copia de los expedientes, una vez que les quite los nombres y el apoyo en exámenes.",near:true},{t:"Cualquier cosa, mientras haya firmado su acuerdo de confidencialidad y se la guarde."},{t:"Solo totales, con todo conteo menor de 10 oculto; los expedientes se quedan en su espacio.",ok:true}],
    why:"El acuerdo dice dónde puede trabajar el estudio, en la plataforma, en su propio espacio, sin descargar nada, y qué puede salir: totales, con todo conteo menor de 10 oculto. Quitar los nombres todavía deja en una laptop los resultados, el año de nacimiento y el código de cada estudiante. ¿Qué puede salir hoy de tu plataforma, y quién lo decidió?"},
  grant:{q:"La facultad le pide al estudio los nombres de los estudiantes que necesitan apoyo, para llamarlos. ¿Qué debe pasar?",
    opts:[{t:"El equipo de apoyo le pide a la dueña un acuerdo propio, para ese propósito.",ok:true},{t:"Se amplía el acuerdo del estudio para sumar los nombres, ya que son los mismos datos.",near:true},{t:"Anil envía los nombres que pueda deducir, ya que tiene los expedientes de los estudiantes."}],
    why:"Un propósito nuevo necesita un acuerdo nuevo: el del estudio dice para qué es, y llamar a estudiantes no lo es. El equipo de apoyo le pide a Mei, la dueña, que decide; cómo se llega a alguien sin que el estudio sepa quién es lo cuenta Muestra lo mínimo. ¿Cuál de tus acuerdos se estiró sin que nadie lo notara?"}
  }}
};
