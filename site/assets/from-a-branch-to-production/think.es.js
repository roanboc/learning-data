/* Learning Data: "Pausa para pensar" de From a branch to production, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (rules, door, supply), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs del módulo llegan más adelante, como un solo conjunto, así que
   ninguna pregunta tiene "stop" todavía, y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Quitar las pausas",right:"Correcto.",wrong:"No exactamente.",start:"Reproducir con pausas para pensar",answer:"Respuesta:",watch:"Mira esta parte"},
  qs:{
  "rules":{q:"¿Por qué GitHub lee el archivo de propietarios del código de main, y no del pull request?",
    opts:[{t:"Para que un cambio no elija a quién lo revisa editando el archivo con que se le revisa.",ok:true},{t:"Para que revisen los propietarios más nuevos, los que vienen escritos en el cambio.",near:true},{t:"Para que cualquiera pueda cambiar el archivo, ya que todo cambio acaba en main."}],
    why:"GitHub pide la revisión a los propietarios del archivo en main, la base del pull request. Si leyera la copia del propio pull request, un cambio podría nombrar a quien quisiera para aprobarlo, o a nadie. La copia más nueva es justo la que nadie ha revisado. ¿Quién aprueba un cambio a tus propias reglas?"},
  "door":{q:"La entrada de registrar-loader desde GitHub nombra el entorno production. ¿Qué añade eso?",
    opts:[{t:"Cualquier flujo, en cualquier rama, puede desplegar si su archivo nombra production."},{t:"Solo entran las ejecuciones desde main, haya dicho sí o no quien aprueba las entregas.",near:true},{t:"Solo entra el trabajo que esperó en production el sí de quien aprueba las entregas.",ok:true}],
    why:"Databricks compara exactamente el sujeto de la entrada, y el sujeto nombra el entorno. Solo un trabajo en production, que deja desplegar solo desde main y espera a quien aprueba las entregas sin haber iniciado la ejecución, recibe una entrada con ese sujeto. Main no basta: sin esa aprobación, una fusión desplegaría sin que nadie la lea. ¿Cuáles de tus despliegues podrían empezar sin un segundo sí?"},
  "supply":{q:"¿Por qué Sam fija cada acción a un commit, y no a una etiqueta?",
    opts:[{t:"Una vez fijada, una acción ya no necesita actualizarse ni revisarse nunca.",near:true},{t:"Una etiqueta se puede mover a otro código; un commit siempre es el mismo código.",ok:true},{t:"Un commit corre más rápido, y el token del flujo no puede leer etiquetas."}],
    why:"Una etiqueta es un nombre que su dueño, o un ladrón, puede mover a otro código; un commit nombra el código mismo. Fijarla deja quieto lo que corre, pero siguen llegando versiones: Dependabot propone cada una como un pull request, revisado como cualquier otro cambio. ¿Qué acciones de tus flujos se nombran hoy por una etiqueta?"}
  }}};
