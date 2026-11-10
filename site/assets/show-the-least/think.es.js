/* Learning Data: "Pausa para pensar" de Show the least, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (oneway, undo, totals), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  oneway:{q:"Un año de nacimiento no puede volver a ser una fecha. ¿Por qué sigue siendo indirecta?",
    opts:[{t:"Porque quien guarda la clave puede volver a convertir 1987 en 14 de mayo de 1987.",near:true},{t:"Porque en un curso pequeño, un año de nacimiento puede ser de un solo estudiante.",ok:true},{t:"Porque el acuerdo la nombra, y cada columna que nombra es indirecta."}],
    why:"Generalizar no se puede deshacer: el día y el mes desaparecen. Pero oculto no es anónimo. Junto al curso, un año de nacimiento todavía puede señalar a un solo estudiante en una clase pequeña, y quien lo conoce reconoce la fila. Por eso conserva su clase, indirecta, y sigue detrás del acuerdo. ¿Qué columnas de tus datos no dicen nada solas, pero juntas señalan a una persona?"},
  undo:{q:"El código del estudio es un hash con clave. ¿Por qué sus datos siguen siendo personales?",
    opts:[{t:"Porque la oficina de registro, que guarda la clave, todavía puede saber de quién es cada código.",ok:true},{t:"Porque cualquiera con la lista de registro puede codificar los números y emparejar los códigos.",near:true},{t:"Porque el código cambia cada año, así que los códigos de un estudiante se alinean año por año."}],
    why:"Un hash con clave se puede deshacer, pero solo con la clave: la oficina de registro puede volver a calcular el código desde cualquier número de estudiante y ver de quién es. Sin la clave, la lista de registro no empareja nada; por eso el estudio recibe el código con clave y no el codificado sin clave. Una forma que se puede deshacer mantiene los datos como personales, así que el estudio sigue detrás de su acuerdo. ¿Dónde está, en tus datos, un código a una clave de distancia de un nombre?"},
  totals:{q:"El 4 de Partería dice \"menos de 10\". ¿Por qué también se oculta el 17 de Ciencias de la salud?",
    opts:[{t:"Porque ocultarlo protege a los 17 estudiantes de Ciencias de la salud que se fueron.",near:true},{t:"Porque Ciencias de la salud es el curso más grande, así que su cifra va primero."},{t:"Porque el 80 de la facultad, menos las otras cifras, devolvería el 4.",ok:true}],
    why:"Una cifra menor que 10 se oculta para que nadie sepa quién dejó una clase pequeña. Pero el total de la facultad también se publica: 80, menos 38, 21 y 17, devuelve el 4. Ocultar una cifra más, la siguiente más pequeña, deja dos incógnitas que suman 21, así que el 4 no se puede calcular. Donde tus datos publican totales, ¿podría volver una cifra oculta a partir del resto?"}
  }}};
