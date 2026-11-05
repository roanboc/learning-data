/* Learning Data: "Pausa para pensar" de Many ways to read, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (cards, integrate, present, serve), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "cards":{stop:"shapes",q:"Una biblioteca archivaba cada libro en tres fichas: autor, título y tema. ¿Qué costaba eso?",
    opts:[{t:"Cada ficha debía mantenerse al día con el libro, o los lectores iban al estante equivocado.",ok:true},{t:"Los lectores tenían que revisar los tres cajones para saber si un libro no estaba."},{t:"Cada ficha debía escribirse a mano, así que un libro nuevo esperaba semanas sus tres fichas.",near:true}],
    why:"Las copias facilitan la lectura y complican mantenerse al día. Cada forma para leer es una copia como esas fichas: ordenada para una pregunta, y mantenida al día."},
  "integrate":{stop:"source",q:"Llega la plataforma de cursos cortos. ¿Qué cambia en un data vault?",
    opts:[{t:"Se agrega un hub nuevo, y los satélites existentes reciben columnas nuevas.",near:true},{t:"Se agregan satélites y filas nuevas; ninguna tabla existente se modifica.",ok:true},{t:"Los hubs se rediseñan para que encajen las claves de la nueva plataforma."}],
    why:"Un vault recibe una fuente nueva agregando. Los hubs guardan las claves de negocio, y las descripciones de cada fuente llegan como satélites, con su fuente y su hora de carga."},
  "present":{stop:"shapes",q:"¿Por qué la estrella de credenciales otorgadas y la de cuotas comparten una dimensión Aprendiz?",
    opts:[{t:"Para que cada estrella se cargue con las filas de aprendices de la otra.",near:true},{t:"Porque un esquema estrella permite una sola dimensión por tema."},{t:"Para que una pregunta cruce las dos estrellas, y sus respuestas coincidan.",ok:true}],
    why:"Dimensiones conformadas: las mismas claves y atributos, para que las estrellas se alineen en los mismos aprendices y las mismas fechas."},
  "serve":{stop:"where",q:"Una tabla ancha de aprendices convierte «¿cerca de un diplomado?» en un filtro. ¿Cuál es el costo?",
    opts:[{t:"Muchas columnas que mantener, y medidas que pueden terminar definidas dos veces.",ok:true},{t:"Los asistentes de IA no pueden leer tablas con más de unas decenas de columnas."},{t:"Filtros más lentos, porque la base debe recorrer cada columna de cada fila.",near:true}],
    why:"Las tablas anchas repiten a propósito. Define cada medida una vez, antes o en una capa semántica, y que cada tabla la lea de ahí."}
  }}};
