/* Learning Data: "Pausa para pensar" de Who decides, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (cord, roles, asked), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs y situaciones de la serie son suyos, para todas sus películas
   (assets/data-governance/), así que ninguna pregunta tiene "stop"; el .player data-labs de la página lleva a ellos. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "cord":{q:"¿Por qué la línea no se detiene en cuanto alguien tira de la cuerda?",
    opts:[{t:"Porque una línea detenida cuesta demasiado, así que solo un accidente grave justifica detenerla."},{t:"Para que el supervisor juzgue cada tirón antes: la línea se detiene solo por los problemas que el supervisor considera graves.",near:true},{t:"Para que nadie tenga miedo de tirarla: la mayoría de los problemas se arreglan antes de terminar la tarea, y la línea se detiene solo cuando no se puede.",ok:true}],
    why:"La línea se detiene al final de la tarea, en un lugar fijo, en parte porque la gente no se animaba a tirar de la cuerda si toda la línea se detenía de golpe. Un derecho que la gente teme usar es un derecho en el papel. Donde trabajas, ¿qué hace fácil, o difícil, pedir una decisión?"},
  "roles":{q:"El equipo de Sam puede cambiar cualquier tabla. ¿Quién decide qué significa título?",
    opts:[{t:"Mei, su dueña. El equipo de Sam es el custodio: opera la plataforma, pero no decide qué significan los datos.",ok:true},{t:"El equipo de Sam, como custodio, tras consultar a Mei: quien puede cambiar la tabla escribe qué significa.",near:true},{t:"El consejo, porque todas las áreas de la universidad usan la palabra título."}],
    why:"Poder cambiar algo no da el derecho a decidir qué significa. El dueño responde por el significado, el responsable de datos lo cuida día a día y el custodio opera la plataforma; una persona puede tener dos de esos roles, como Mei. En tu trabajo, ¿quién puede cambiar una tabla de la que dependes, y quién decide qué significa?"},
  "asked":{q:"¿Por qué cada hoja de ruta se llena a partir del registro, y nunca de memoria?",
    opts:[{t:"Para que el consejo vea cada cambio de quién decide qué antes de llenar cualquier hoja."},{t:"Para que no se desactualice: si cambia un nombre en el registro, todas las hojas lo siguen, y nadie tiene que recordar a quién preguntar.",ok:true},{t:"Para que sea más rápido: el registro lista a todos, y cada hoja se copia de él una sola vez, cuando se crea por primera vez.",near:true}],
    why:"Como la cuerda al alcance, la hoja de ruta hace que el trabajo llame a quien decide, por nombre, en el momento en que importa. Cuando cambia un responsable de datos, un solo cambio en el registro llega a cada solicitud. En tu trabajo, ¿cómo encuentra un cambio a la persona que decide?"}
  }}};
