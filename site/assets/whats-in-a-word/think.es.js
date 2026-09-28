/* Learning Data: "Pausa para pensar" de What's in a word, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (answers, calls, gavagai, edges), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "answers":{stop:"count",q:"Cuatro oficinas dan cuatro cifras para una pregunta. ¿Cuál es la razón más probable?",
    opts:[{t:"Tres de sus sistemas tienen errores."},{t:"Cada oficina cuenta una idea distinta con la misma palabra.",ok:true},{t:"Algunos datos están desactualizados."}],
    why:"Cada cifra era correcta para lo que contaba. La palabra «credencial» apuntaba a cuatro ideas distintas, una por oficina."},
  "calls":{stop:"words",q:"Una llamada de leopardo significa cualquier leopardo. El silbido de un delfín significa un delfín. En un modelo de datos, ¿cuál es cuál?",
    opts:[{t:"Las dos son categorías."},{t:"La llamada es una categoría; el silbido funciona como un identificador.",ok:true},{t:"Las dos son identificadores."}],
    why:"Una categoría agrupa cosas de una clase; un identificador distingue una cosa en particular. Todo modelo de datos necesita ambos: una entidad Aprendiz, y un ID de aprendiz."},
  "gavagai":{stop:"grain",q:"Una tabla tiene una fila por estudiante por asignatura. Alguien cuenta sus filas para saber cuántos estudiantes hay. ¿Qué sale mal?",
    opts:[{t:"Nada: una fila es un estudiante."},{t:"Los estudiantes con varias asignaturas se cuentan varias veces: el grano no coincide con la pregunta.",ok:true},{t:"Quedan fuera las asignaturas sin estudiantes."}],
    why:"El grano es un estudiante en una asignatura. Contar estudiantes es contar ID de estudiante distintos, no filas."},
  "edges":{stop:"count",q:"Todos están de acuerdo en que un título es una credencial. ¿Dónde no se pondrán de acuerdo las cuatro oficinas?",
    opts:[{t:"Sobre los títulos."},{t:"En los bordes: insignias y certificados.",ok:true},{t:"En ningún lado, si sus sistemas son precisos."}],
    why:"Las categorías tienen un centro claro y bordes difusos. Las definiciones se escriben para los bordes: ahí es donde se separan los conteos."}
  }}};
