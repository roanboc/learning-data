/* Learning Data: "Pausa para pensar" de A person asks, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (places, off, proof), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  places:{q:"El trabajo busca los seis números de Linh en cada columna que señalan las etiquetas. ¿Por qué eso solo pasaría por alto los marts de la billetera, la planificación y las finanzas?",
    opts:[{t:"Sus columnas no están etiquetadas como personales, así que el trabajo nunca las mira.",near:true},{t:"Se reconstruyen cada noche, así que sus filas ya no están cuando el trabajo busca."},{t:"La guardan solo como un código hecho con su número, no con el número mismo.",ok:true}],
    why:"Los marts guardan un código hecho con su número de estudiante en lugar del número, así que buscar el número no encuentra nada ahí. Las etiquetas igual señalan esas columnas, como seudónimas, así que el trabajo hace el mismo código con su número y busca ese. Donde trabajas, ¿qué tablas guardan a las personas solo como códigos?"},
  off:{q:"Se borra la fila de Linh de la lista de correo. ¿Qué impide que la reconstrucción del próximo semestre la agregue otra vez?",
    opts:[{t:"Su no, guardado en la persona en lugar de su sí: la reconstrucción solo toma un sí.",ok:true},{t:"Limpiar las versiones antiguas de la tabla de la lista, siete días después del borrado.",near:true},{t:"Su contrato terminó, así que ya no es una de las tutoras ocasionales."}],
    why:"La reconstrucción lee los contratos ocasionales de los últimos dos años, así que ella sigue entre ellos, y solo toma a quienes tienen un sí en la persona. Su no reemplazó su sí, así que la reconstrucción la deja fuera. Limpiar las versiones antiguas quita copias viejas de la lista; no cambia lo que toma la próxima lista. Donde trabajas, ¿qué traería de vuelta a una persona borrada?"},
  proof:{q:"¿Cómo muestra el equipo que solo la oficina de privacidad y sus trabajos leyeron los números de Linh?",
    opts:[{t:"Sus números nunca se escribieron, así que nadie más pudo haberlos leído."},{t:"El registro de auditoría lista cada lectura de la tabla de claves, y quién la hizo.",ok:true},{t:"El ticket enlaza cada paso con la ejecución que lo hizo, y con quién la ejecutó.",near:true}],
    why:"Cada lectura de una tabla está en el registro de auditoría, con quién la hizo, así que las lecturas de la tabla de claves muestran quién vio sus números: la oficina y sus dos trabajos. El ticket prueba que cada paso se hizo, y quién lo hizo, pero no quién más leyó la tabla. No escribir un número lo deja fuera del texto de una consulta; no muestra quién leyó la tabla. Donde trabajas, ¿podrías mostrar quién leyó los datos de una persona el mes pasado?"}
  }}
};
