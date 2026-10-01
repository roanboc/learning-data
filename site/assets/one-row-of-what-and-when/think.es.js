/* Learning Data: "Pausa para pensar" de Una fila de qué, y cuándo, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (grain, fan, was, late), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "grain":{stop:"grain",q:"¿Por qué escribir el grano antes del SQL?",
    opts:[{t:"Para que la documentación quede completa."},{t:"Dice qué tiene que producir la consulta, así el SQL se puede revisar contra él.",ok:true},{t:"dbt necesita un grano para construir la tabla."}],
    why:"Escrito antes, el grano dice qué tiene que producir la consulta; escrito después, describe lo que el SQL haya hecho. Como prueba, atrapa un join equivocado en cada corrida. dbt no tiene un campo para el grano."},
  "fan":{stop:"fan",q:"La prueba del grano falló. ¿Qué está mal: los datos, el join o el grano?",
    opts:[{t:"Los datos: el título no debería tener dos versiones."},{t:"El join: ignoró la fecha, así que cada estudiante encontró las dos versiones.",ok:true},{t:"El grano: debería permitir dos filas por estudiante y título."}],
    why:"Los datos están bien (el título de verdad tiene dos versiones), y el grano también. El join ignoró la fecha, así que cada estudiante encontró las dos versiones."},
  "was":{stop:"asat",q:"¿Doce o nueve: cuál es correcto?",
    opts:[{t:"Doce: coincide con el informe del censo."},{t:"Nueve: es el más nuevo."},{t:"Los dos: la misma pregunta, hecha sobre dos días.",ok:true}],
    why:"Estudiantes a 15 créditos o menos de un certificado de posgrado: doce a la fecha del censo, que es lo que preguntó Planificación; nueve a hoy. El grano de la salida dice qué día describe."},
  "late":{stop:"when",q:"Las plataformas no registran cuándo rigió un cambio. ¿Qué fecha usas para ellas?",
    opts:[{t:"La fecha en que lo registraron, aceptada y escrita como una brecha.",ok:true},{t:"La fecha de hoy, cuando se construye el modelo."},{t:"Una fecha en que rigió, adivinada a partir del sistema de estudiantes."}],
    why:"La fecha de registro es la única que hay. Se acepta, y queda por escrito como la brecha 6, para que nadie la confunda con cuándo pasó el cambio."}
  }}};
