/* Learning Data: "Pausa para pensar" de Know what you hold, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (classes, holds, follows), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. Las respuestas correctas, en los mismos lugares que en inglés. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  classes:{q:"El código postal de un estudiante no nombra a nadie por sí solo. ¿Qué clase recibe?",
    opts:[{t:"Ninguna: no nombra a nadie por sí solo, así que no dice quién es.",near:true},{t:"Indirecta: solo no nombra a nadie, pero con un curso puede señalar a uno.",ok:true},{t:"Directa: un código postal es parte de una dirección, y una dirección nombra a alguien."}],
    why:"Un código postal no nombra a nadie, pero pocos estudiantes comparten uno, y con un curso o un año de nacimiento puede señalar a una sola persona. Eso es indirecta: señala a alguien junto con otras columnas. Donde trabajas, ¿qué columnas no nombran a nadie solas, pero juntas podrían señalar a una persona?"},
  holds:{q:"Una columna llamada necesidades alimentarias tiene valores como halal, kosher y vegetariano. ¿Qué clase recibe?",
    opts:[{t:"Especial: algunos valores pueden revelar la fe de un estudiante, y vale la más estricta.",ok:true},{t:"Ninguna: lo que alguien come es una elección, y no nombra a nadie por sí solo."},{t:"Indirecta: con un curso y un cumpleaños, una dieta podría señalar a un estudiante.",near:true}],
    why:"Halal y kosher pueden revelar la fe de un estudiante, y la fe es especial, como la salud. Una dieta quizá también ayude a señalar a alguien, pero una columna recibe la clase más estricta que le aplica, y decide su dueño, que sabe qué significan los valores. Donde trabajas, ¿qué columna esconde en su nombre lo que dicen sus valores?"},
  follows:{q:"Los totales por curso de Anil se cuentan a partir de columnas que señalan a estudiantes. ¿De dónde sale su clase?",
    opts:[{t:"De las columnas de las que se cuentan: una clase sigue a sus datos a todas partes.",near:true},{t:"De quien hace el conteo, porque crea la tabla nueva por su cuenta."},{t:"Del dueño: un total guarda algo nuevo, así que recibe su clase de nuevo.",ok:true}],
    why:"Una columna que pasa tal como es conserva su clase. Un paso que cambia lo que guarda, un código, un año, un total, hace algo nuevo, y su dueño lo nombra: aquí, ninguna, en una tabla pública, con todo conteo menor de diez oculto. Donde trabajas, ¿quién nombra la clase de una tabla hecha a partir de otras?"}
  }}};
