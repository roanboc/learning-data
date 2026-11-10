/* Learning Data: "Pausa para pensar" de Tags that travel, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (found, follows, conflict), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  found:{q:"Un escaneo no propone ninguna clase para una columna de notas en texto libre. ¿Qué le dice eso a su dueña?",
    opts:[{t:"Que no guarda nada personal: el escaneo conoce las clases y no encontró ninguna.",near:true},{t:"Nada aún: un escaneo propone solo lo que reconoce, así que su dueña la revisa.",ok:true},{t:"Que puede quedarse como está hasta que un escaneo posterior proponga algo."}],
    why:"Un escaneo propone lo que reconoce, como un nombre, un correo o una fecha de nacimiento. Una nota puede guardar cualquier cosa, y lo que la hace personal puede estar solo en su sentido, como el apoyo en exámenes, que se da por una discapacidad. No encontrar nada no es lo mismo que no haya nada: la dueña lee la columna y decide. ¿Qué columnas tuyas no marcaría ningún escaneo?"},
  follows:{q:"Anil crea una tabla nueva a partir de la copia del estudio, con el código del estudiante. ¿Qué clase lleva el código?",
    opts:[{t:"Seudónima, llevada desde la copia por propagación, sin que nadie la etiquete.",ok:true},{t:"Ninguna hasta que Anil la etiquete, porque creó la tabla en su propio espacio."},{t:"Seudónima, pero solo cuando Mei la confirme en un archivo, como en el origen.",near:true}],
    why:"La propagación sigue el linaje: una tabla hecha de una columna etiquetada recibe su clase en minutos, sin que nadie la etiquete. Mei nombró la clase una vez, en el origen, y nada aguas abajo la espera; solo el nivel de una tabla lo da ella cada vez. ¿Dónde en tu plataforma alguien todavía vuelve a poner una clase a mano?"},
  conflict:{q:"Una columna de una tabla nueva se hace con una columna etiquetada directa y otra seudónima. ¿Qué recibe?",
    opts:[{t:"Seudónima: la plataforma se queda con el valor más suave, para que la columna sirva."},{t:"Directa: el más estricto de los dos valores que se encontraron, así no se muestra nada.",near:true},{t:"Especial: dos valores que se encuentran son un conflicto, y vale el valor fijado antes.",ok:true}],
    why:"La propagación no compara valores. Dos valores para una etiqueta en una columna son un conflicto, y la plataforma aplica el valor fijado antes para esa etiqueta, aquí especial, la más estricta. No se muestra nada que no deba, pero la columna ahora dice lo que no es y lo pasa, así que se arregla en el origen. ¿Qué columnas tuyas se hacen de dos etiquetadas?"}
  }}
};
