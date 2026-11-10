/* Learning Data: "Pausa para pensar" de Who is it, really?, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (trust, role, attacker), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs del módulo llegan más adelante, como un solo conjunto, así que
   ninguna pregunta tiene "stop" todavía, y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  trust:{q:"¿Por qué la plataforma no confía en una solicitud por su origen, ni siquiera dentro de su propia red?",
    opts:[{t:"Se quitó el muro alrededor de la red, así que ya no queda un dentro en el que confiar.",near:true},{t:"Una contraseña robada funciona igual dentro del muro que fuera, así que el origen no prueba nada.",ok:true},{t:"Las solicitudes de dentro se revisan más tarde, cuando el trabajo de la noche ya terminó."}],
    why:"Una contraseña robada funciona igual dentro del muro que fuera, así que el lugar de donde viene una solicitud no prueba nada. Cada solicitud dice quién es, lo prueba y recibe lo mínimo que necesita. El muro no tiene que caer; solo deja de ser la prueba. ¿Qué sistemas tuyos aún confían en lo que esté dentro de la red?"},
  role:{q:"Nueve de las 41 personas que podían leer toda la tabla de estudiantes habían cambiado de puesto. ¿Qué lo evita la próxima vez?",
    opts:[{t:"Los permisos van al grupo de un rol: si dejas el grupo, sus permisos se van contigo.",ok:true},{t:"Los permisos de cada persona tienen una fecha de fin, así que caducan al cabo de un año.",near:true},{t:"El equipo de Sam oculta la tabla, y Mei envía los datos a quien los pida."}],
    why:"Los permisos van a un rol, nunca a una persona: cada rol es un grupo, y entrar en él o dejarlo da o quita sus permisos, porque el directorio sigue los registros de Recursos Humanos. Una fecha de fin en los permisos de cada persona sigue dejándolos en las personas, a su nombre, que es como llegaron a ser 41. ¿Dónde se dan permisos a nombre de alguien en tu trabajo?"},
  attacker:{q:"En el campamento, las dos mitades de Jin Bi encajaron. ¿Por qué tenía razón al dudar?",
    opts:[{t:"A los generales se les mandaba dudar de toda orden, aunque llegara con la mitad buena."},{t:"Las mitades podían ser falsas, así que una coincidencia nunca bastaba por sí sola.",near:true},{t:"Que encajen prueba que alguien tiene la mitad, no quién es, ni que lo envió el rey.",ok:true}],
    why:"La mitad era la del rey, sacada de sus habitaciones, así que la coincidencia era real. Solo probaba que alguien tenía la mitad. Por eso la plataforma conserva la duda de Jin Bi: ¿quién es, desde dónde, en qué dispositivo, pidiendo qué, y es eso habitual? Y cada identidad recibe lo mínimo que necesita, porque una prueba se puede robar. ¿Qué podría hacer una copia del token de tu equipo?"}
  }}};
