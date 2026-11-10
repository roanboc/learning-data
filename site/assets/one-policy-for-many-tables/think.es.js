/* Learning Data: "Pausa para pensar" de One policy for many tables, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (parts, ways, through, appears), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie aún no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. Las respuestas correctas y las casi correctas, en los mismos lugares que en inglés. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  parts:{q:"Supón que la nueva tabla de Jun no tuviera columna de facultad. ¿Qué vería el estudio en ella?",
    opts:[{t:"Ninguna fila: un filtro que no puede decidir sobre una fila la deja oculta."},{t:"Las filas de todos: un filtro sin columna que encontrar no se aplica.",ok:true},{t:"Solo las filas de Salud: el filtro del estante alcanza todas sus tablas.",near:true}],
    why:"Un filtro de filas necesita la columna que encuentra por su etiqueta. La política del estante sí alcanza todas sus tablas, pero donde ninguna columna lleva la etiqueta de facultad no se aplica, y se ven todas las filas. Por eso cada tabla con estudiantes lleva su facultad. ¿Cuáles de tus tablas se le escaparían a un filtro así?"},
  ways:{q:"Enmascararlo entero vuelve las palabras tres asteriscos. ¿Por qué deja vacía una fecha?",
    opts:[{t:"Para que el estudio pueda contar cuántos estudiantes nacieron cada año."},{t:"Porque una fecha es indirecta, y un valor indirecto siempre queda vacío.",near:true},{t:"Porque una máscara da el tipo de su columna, y los asteriscos no son una fecha.",ok:true}],
    why:"Una máscara debe devolver el mismo tipo que su columna: una columna de fechas debe seguir teniendo una fecha, o la consulta falla. Tres asteriscos son palabras, así que para lo que no son palabras la máscara devuelve un valor vacío. Una fecha de nacimiento es indirecta, pero su propia política la generaliza a un año, no la vacía. ¿Qué columnas de tus datos no son palabras?"},
  through:{q:"La mesa de ayuda recibe la política que enmascara los nombres en parte. ¿Por qué pasa también la que los enmascara enteros?",
    opts:[{t:"Para que una sola máscara llegue a cada columna: dos distintas paran la consulta.",ok:true},{t:"Para que la mesa de ayuda vea cada valor entero, como la oficina de registro."},{t:"Para que la máscara en parte se aplique primero, y la que oculta todo al final.",near:true}],
    why:"Para un lector, cada columna puede tener una sola máscara. Dos distintas no se aplican una tras otra: la consulta se detiene con un error. Por eso la mesa de ayuda pasa la política que enmascara los nombres enteros, y recibe la que los enmascara en parte. Donde trabajas, ¿quién decide qué lectores ven un valor en parte?"},
  appears:{q:"Una tabla nueva llega sin su nivel. ¿Quién puede leer sus filas?",
    opts:[{t:"Todos los de su estante, con cada columna enmascarada según su clase.",near:true},{t:"Solo quien la construye, hasta que su dueña le dé un nivel y apliquen las reglas.",ok:true},{t:"Todos los de su estante, tal como está, hasta que alguien note que no tiene nivel."}],
    why:"Una tabla sin nivel queda cerrada para todos menos el proceso que la construye, como la carga sin nombre de la Guía 111. Las máscaras por clase se aplicarían a sus columnas clasificadas, pero el cierre oculta antes todas las filas, hasta que Mei le da su nivel. ¿Qué mostraría hoy tu plataforma de una tabla que nadie ha descrito?"}
  }}};
