/* Learning Data: "Pausa para pensar" de Who does what, end to end, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (request, roles, product), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "request":{q:"Mei escribe la definición decidida una sola vez, en el mapa de Noor. ¿Por qué nadie tiene que cambiar la copia del equipo de datos, los tableros ni el asistente?",
    opts:[{t:"El equipo de datos vuelve a escribir cada copia el día en que se decide."},{t:"El mapa publica la definición en el glosario, y cada copia sigue al glosario, en un solo sentido: cada una cambia sola y dice de dónde viene, así que ninguna copia puede decir otra cosa.",ok:true},{t:"El agente cambia cada copia cuando revisa el borrador."}],
    why:"Escrita una sola vez, en el mapa, y publicada en el glosario, la definición llega a cada copia por un solo camino, en un solo sentido. Nadie la vuelve a escribir, así que ninguna copia se desvía, y cada una dice de dónde viene. Si mañana cambiara una definición donde trabajas, ¿cuántos lugares habría que cambiar a mano?"},
  "roles":{q:"El agente ocupa el rol del revisor. ¿Qué puede hacer, y qué no?",
    opts:[{t:"Puede decidir por sí mismo los cambios simples, y dejarle los difíciles al dueño."},{t:"Puede leer el glosario y el registro de quién usa qué, y escribir su nota en el borrador: qué falta, y qué toca el cambio. No puede decidir, ni cambiar una palabra del glosario.",ok:true},{t:"Puede cambiar el glosario, siempre que el responsable de datos lo revise después."}],
    why:"Sus atribuciones están por escrito en el mapa, así que todos pueden ver qué puede hacer y qué no: lee y escribe su nota, y las personas deciden; aquí, la jefa de registro, como dueña. Quien ocupa un rol es un actor, y los actores van y vienen; el rol y sus pasos se quedan. ¿Qué controles de tu trabajo podría hacer un agente, y qué decisiones deberían quedar siempre en manos de una persona?"},
  "product":{q:"¿Por qué el glosario enumera lo que cambió cada semana, y cuenta quién lee cada término?",
    opts:[{t:"Para mostrar qué responsables de datos trabajan más."},{t:"Sus usuarios dependen de él, como los lectores dependen de un diccionario, así que necesitan ver lo nuevo. Y los conteos muestran qué términos no lee nadie, para retirarlos, cada uno con el sí de su dueño.",ok:true},{t:"El agente necesita los conteos para decidir qué definiciones son correctas."}],
    why:"Gestionado como un producto, el glosario tiene un dueño, usuarios y una promesa. La lista de la semana muestra a todos lo nuevo, como la actualización anual del diccionario, y los conteos muestran lo que ya nadie usa: este año, se retiran nueve términos. ¿Qué hay en las listas compartidas de tu equipo que ya nadie lee?"}
  }}};
