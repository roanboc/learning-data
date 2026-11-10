/* Learning Data: "Pausa para pensar" de Forgetting a person, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (story, places, list, stays), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. Las respuestas correctas están en los mismos lugares que en inglés. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  story:{q:"La página del periódico siguió en línea. ¿Qué quitó la sentencia del tribunal?",
    opts:[{t:"La página misma, porque el tiempo había vuelto irrelevante la vieja deuda",near:true},{t:"Los enlaces a ella desde una búsqueda de su nombre",ok:true},{t:"Toda mención de la subasta, dondequiera que estuviera en línea"},{t:"El derecho del periódico a publicar avisos como ese"}],
    why:"La página era cierta y se publicó legalmente, así que se quedó. Lo que se fue fue el enlace desde su nombre: dieciséis años después, ya no tenía razón. Donde trabajas, ¿qué seguiría apareciendo bajo el nombre de una persona mucho después de dejar de importar?"},
  places:{q:"¿Por qué no basta buscar «Linh Nguyen» en cada sistema?",
    opts:[{t:"Su nombre se escribe de tres formas, y muchos lugares solo guardan números",ok:true},{t:"Sus seis números bastarían para encontrarlo todo, sin hacer falta nombres",near:true},{t:"Los nombres son datos personales, así que la oficina no puede buscarlos"},{t:"La oficina debe ver su pasaporte antes de poder buscar nada"}],
    why:"Se busca por cada número y cada forma de su nombre, en documentos y herramientas además de tablas, y se sigue el linaje hasta las copias. Solo con sus números se perderían los documentos que solo la nombran. Donde trabajas, ¿podrías listar hoy cada lugar donde están los datos de una persona?"},
  list:{q:"¿Por qué la universidad guarda su no, en vez de solo borrar su fila?",
    opts:[{t:"Para preguntarle otra vez el próximo semestre si cambió de opinión"},{t:"Porque la ley dice que una fila borrada debe dejar una nota"},{t:"Para que su fila siga en la lista, marcada «no enviar»",near:true},{t:"Para que la próxima reconstrucción no la añada por su sí de 2023",ok:true}],
    why:"La lista se reconstruye cada semestre a partir de los contratos y del sí guardado en la persona. Su no reemplaza ese sí, así que nada que lea el sí antiguo la vuelve a añadir; su fila sale de la lista. Donde trabajas, ¿qué listas se reconstruyen desde otro lugar?"},
  stays:{q:"Sus registros de pago deben guardarse hasta 2033. ¿Qué hace la universidad con ellos?",
    opts:[{t:"Los borra igual, porque su derecho al olvido va primero"},{t:"Los guarda, y puede usarlos para cualquier otra cosa hasta 2033"},{t:"Los guarda solo por esa razón, lo dice, y los borra en 2033",ok:true},{t:"Los guarda por la ley, pero no le dice nada, porque ella no puede cambiarlo",near:true}],
    why:"La ley los exige, así que se quedan, guardados solo por esa razón y leídos solo por quien los necesita. La respuesta dice qué se queda, por qué y hasta cuándo, y un no dice cómo impugnarlo. Donde trabajas, ¿la respuesta a una persona dice qué se queda, y hasta cuándo?"}
  }}};
