/* Learning Data: "Pausa para pensar" de Today, and where it's going, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (find, path, why), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). El "stop" de una pregunta es el lab de la serie que abre, en la
   página de labs de la serie (el .player data-labs de la página es "../labs/"); una pregunta sin él no tiene enlace a un lab. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "find":{stop:"place",q:"Ubicados en el mapa, los sistemas muestran tres debajo de una capacidad, una capacidad con solo una hoja de cálculo, y un sistema debajo de ninguna. ¿Por qué la lista de 140 no podía mostrarlo?",
    opts:[{t:"Una lista dice qué se compró y quién lo usa, así que muestra superposiciones, pero no los huecos ni los sistemas en la sombra.",near:true},{t:"Una lista solo dice qué se compró; solo ubicados frente a las capacidades muestran superposiciones, huecos y sistemas en la sombra.",ok:true},{t:"La lista estaba desactualizada, y no incluía las hojas de cálculo ni los sistemas que los equipos hicieron por su cuenta."}],
    why:"Una lista dice qué se compró; un mapa dice para qué sirve cada sistema. Las superposiciones, los huecos y los sistemas en la sombra aparecen solo cuando los sistemas se ubican debajo de las capacidades a las que sirven. ¿Qué mostrarían los sistemas de tu organización, ubicados así?"},
  "path":{q:"¿Por qué el modelo de capacidad va antes que el intercambio en el barrio en el camino?",
    opts:[{t:"El intercambio en el barrio necesita el presupuesto del modelo de capacidad para empezar.",near:true},{t:"Es el más barato de los dos, así que se termina primero y paga el siguiente."},{t:"Intercambiar electricidad en una calle exige saber cuánto aguanta esa calle.",ok:true}],
    why:"El orden en que se cierran las brechas sigue lo que depende de qué. Las mesetas son los estados estables intermedios. En tus propios planes, ¿qué trabajo depende, sin que se note, de otro?"},
  "why":{q:"Tres años después, alguien pregunta por qué se apagó la herramienta de tormentas. ¿Qué le responde?",
    opts:[{t:"El registro de la decisión: qué se decidió, qué más se consideró y quién decidió.",ok:true},{t:"El dibujo del objetivo, que muestra que la herramienta ya no está y qué la reemplazó.",near:true},{t:"Quien se acuerde de la reunión, si todavía está en la empresa."}],
    why:"Cada decisión del camino queda escrita con su porqué, para que la razón sobreviva a las personas que estaban en la sala. ¿Dónde guarda tu equipo sus decisiones, y podría alguien recién llegado encontrar la razón de una?"}
  }}};
