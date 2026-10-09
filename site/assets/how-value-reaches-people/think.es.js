/* Learning Data: "Pausa para pensar" de How value reaches people, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (side, teams, first), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "side":{q:"Dibujado desde el lado del hogar, ¿con qué termina cada etapa del flujo de valor?",
    opts:[{t:"Con algo que recibe el hogar, como la ayuda en camino.",ok:true},{t:"Con un equipo que pasa el trabajo a otro."},{t:"Con un sistema que se actualiza."}],
    why:"El hogar no ve equipos ni sistemas, solo unas pocas etapas en orden: alguien sabe que se fue la luz, la ayuda va en camino, vuelve la luz y alguien explica qué pasó. Eso es un flujo de valor: recuperar la luz."},
  "teams":{q:"La llamada pasa por el centro de contacto, la sala de control y las cuadrillas de campo. ¿Dónde lo siente el hogar?",
    opts:[{t:"En cada paso de cada equipo."},{t:"Solo en los traspasos que salen mal.",ok:true},{t:"En ningún lado: el hogar no ve nada de eso."}],
    why:"Como con las loncheras de los dabbawalas, el detalle va donde el trabajo cambia de manos. ¿Dónde cambia de manos el trabajo camino a tus clientes, y qué traspaso notan cuando sale mal?"},
  "first":{q:"Tres fallas y dos cuadrillas libres. ¿Qué falla va primero?",
    opts:[{t:"La falla con más hogares."},{t:"La que se reportó primero."},{t:"Primero, los cables caídos, por seguridad; luego, los electrodependientes; luego, lo que devuelva la luz a más hogares.",ok:true}],
    why:"Por costumbre, las dos cuadrillas irían a la falla más grande. Una regla que depende del orden y del estado es donde un proceso merece detalle, paso a paso, con una notación como BPMN. ¿Hay una regla así escrita donde trabajas, y quién es su dueño?"}
  }}};
