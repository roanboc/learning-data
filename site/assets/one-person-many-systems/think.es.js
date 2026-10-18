/* Learning Data: "Pausa para pensar" de One person, many systems, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (after, lightest, search, apart), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "after":{q:"La universidad ya vincula los registros de Linh y la cuenta una sola vez en sus informes. ¿Por qué igual podría recibir un tercer número de estudiante?",
    opts:[{t:"La oficina de Mei vincula registros solo una vez al año."},{t:"Las dos actúan cuando el registro ya existe, y a ninguna se le pregunta antes de que la solicitud cree uno.",ok:true},{t:"El lakehouse no guarda números de estudiante."}],
    why:"La forma de registro vincula los registros que ya están, y una copia para análisis los reúne después. Ninguno está en el camino de la solicitud, así que esta todavía crea primero una persona, y el duplicado se encuentra más tarde, si es que se encuentra. En una organización que conozcas, ¿un duplicado se detecta cuando se crea, o después?"},
  "lightest":{q:"¿Por qué no dejar que un solo lugar cree a todas las personas de la universidad?",
    opts:[{t:"No evitaría los duplicados."},{t:"También los evitaría, pero todos los sistemas tendrían que cambiar, y ese único lugar nunca podría detenerse, cuando las personas solo entran por dos puertas.",ok:true},{t:"Una universidad no puede tener una sola lista de sus personas."}],
    why:"La forma centralizada evita los duplicados al costo más alto: todos los sistemas dejan de crear personas y dependen de un solo lugar que siempre debe estar disponible. En la universidad, las personas se crean en dos puertas, así que hacer que esas dos vuelvan a leer a la persona resuelve el problema por menos. ¿Dónde se crean las personas, o los clientes, en una organización que conozcas?"},
  "search":{q:"¿Por qué una coincidencia probable espera a la oficina de Mei, en vez de que decida la búsqueda?",
    opts:[{t:"La búsqueda es demasiado lenta para decidir."},{t:"Una fusión equivocada le da la historia de una persona a otra, así que una persona decide una vez, con una razón, y la decisión se guarda.",ok:true},{t:"La oficina de Mei aprueba cada solicitud."}],
    why:"Se puede actuar con seguridad ante una coincidencia clara, y también cuando no hay ninguna. Una coincidencia probable es donde están los errores, y una fusión falsa, dos personas hechas una, hace más daño que una coincidencia perdida: le muestra los registros de una persona a otra. Si fuera tu registro, ¿qué querrías que revisara una persona?"},
  "apart":{q:"Las dos postulantes se llaman Linh Nguyen. ¿Qué habría salido mal si la búsqueda hubiera comparado solo el nombre?",
    opts:[{t:"Nada: un nombre completo basta para distinguir a las personas."},{t:"A la segunda Linh le habrían dado los registros de la primera: su título, sus notas, su correo.",ok:true},{t:"La solicitud se habría detenido con un error."}],
    why:"Los nombres se comparten, sobre todo los comunes, así que la búsqueda compara varias cosas: la fecha de nacimiento, el correo, un número anterior. Solo coincide el nombre, así que ella pasa a ser una persona nueva, con razón, y nada la une a Linh. ¿Cuántas personas comparten tu nombre, y qué las distingue de ti?"}
  }}};
