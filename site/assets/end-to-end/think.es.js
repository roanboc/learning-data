/* Learning Data: "Pausa para pensar" de De principio a fin, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (question, output, ship, evolve), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "question":{stop:"where",q:"¿Por qué Finanzas tiene carpetas propias desde su primer commit?",
    opts:[{t:"Es más ordenado, y nada más."},{t:"Porque Finanzas decide con los datos: sus archivos viven según quién decide, así que se encuentran por su nombre, y algún día puede mudarse entera.",ok:true},{t:"Porque dbt necesita una carpeta por cada grupo."}],
    why:"Los marts y las exposiciones se organizan según quién decide con ellos. Con el nombre de Finanzas desde el principio, sus archivos nunca se mezclan con los de Planificación o la billetera, y después no hay nada que desenredar."},
  "output":{stop:"follow",q:"Finanzas respondió Q-FIN-01. ¿Adónde va la respuesta?",
    opts:[{t:"Al archivo de requisitos, junto a la pregunta, marcada como respondida."},{t:"Una regla en el modelo conceptual de Finanzas y una decisión en su registro, con was: Q-FIN-01. Luego la pregunta se borra.",ok:true},{t:"Al ticket del backlog, que después se cierra."}],
    why:"La pregunta era temporal; la respuesta no. Va adonde perdura y donde la lee la próxima persona, y la decisión dice de dónde vino."},
  "ship":{stop:"lives",q:"¿Por qué se borra el archivo de requisitos de Finanzas cuando su último punto está hecho?",
    opts:[{t:"Para que el proyecto diga solo lo que sigue abierto. Git conserva la historia, y lo que perdura ya está en su hogar.",ok:true},{t:"Porque dbt no puede leerlo."},{t:"Para que el repositorio sea chico."}],
    why:"Un registro de requisitos existe solo mientras tiene puntos abiertos. Cada punto, una vez hecho, fue a su hogar: una decisión, una limitación conocida, un contrato, una prueba. Lo que quedara solo diría algo que ya no es cierto."},
  "evolve":{stop:"move",q:"¿Por qué Finanzas fija las versiones del núcleo que lee?",
    opts:[{t:"La versión 1 se construye más rápido."},{t:"dbt exige una versión en cada ref."},{t:"Para que una versión nueva le llegue como una elección con fecha, y no como una sorpresa en su próximo build.",ok:true}],
    why:"Un ref sin fijar se mueve en cuanto los dueños del núcleo hacen de una versión nueva la última. Fijado, Finanzas recibe el aviso de dbt con la fecha, y se cambia cuando verificó su número."}
  }}};
