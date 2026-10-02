/* Learning Data: "Pausa para pensar" de Escrito una sola vez, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (four, where, diagrams, version), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "four":{stop:"home",q:"El tooltip está bien. ¿Por qué no es la solución?",
    opts:[{t:"Sí lo es: copia sus palabras en las otras tres."},{t:"Está bien por suerte: es una copia que coincide con la definición de model/conceptual.yml, y nada la mantiene así.",ok:true},{t:"Porque la gente lee el catálogo, no el tooltip: arregla primero el catálogo."}],
    why:"El tooltip coincide con el hogar, la definición que Mei aprobó en model/conceptual.yml, pero nada lo mantiene así. Arreglar a mano las tres copias malas solo vuelve a dar cuatro copias; cada una tiene que generarse desde el hogar."},
  "where":{stop:"where",q:"¿Un registro de decisiones es duplicación?",
    opts:[{t:"Sí: el YAML ya dice qué se decidió."},{t:"No: el YAML dice qué es cierto ahora; el registro dice por qué, cuándo y quién lo decidió.",ok:true},{t:"Solo cuando el YAML tiene una descripción."}],
    why:"Nada en el build guarda el porqué. Sin el registro, la próxima persona reabre la decisión."},
  "diagrams":{stop:"where",q:"¿Por qué dibujar un diagrama a mano y generar el otro?",
    opts:[{t:"Los diagramas a mano se ven mejor, así que el importante se dibuja."},{t:"El conceptual muestra significado, que deciden las personas y casi no cambia; el físico muestra estructura, que cambia con cada edición del YAML.",ok:true},{t:"dbt todavía no puede generar un diagrama conceptual; algún día se generarán los dos."}],
    why:"Dibujado a mano, el diagrama conceptual puede decir lo que importa y dejar fuera el resto. El diagrama físico muestra cada tabla, columna y clave; dibujado a mano, estaría desactualizado en una semana."},
  "version":{stop:"version",q:"¿Cuándo un cambio rompe?",
    opts:[{t:"Siempre que cambia el SQL del modelo."},{t:"Cuando un lector del modelo tal como está recibiría un error o un significado distinto.",ok:true},{t:"Cuando agrega una columna."}],
    why:"Una columna eliminada o renombrada, un tipo, una granularidad o el significado de un valor que cambia. Agregar una columna por lo general no rompe. Un cambio que rompe un modelo público es una versión nueva, con una fecha de retiro y las exposures avisadas."}
  }}};
