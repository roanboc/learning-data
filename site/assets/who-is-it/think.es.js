/* Learning Data: "Pausa para pensar" de Who is it?, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (words, golden, weights, aisha), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs y las situaciones son de la serie, para todas sus películas
   (assets/master-and-reference-data/), así que ninguna pregunta tiene "stop"; el .player data-labs de la página lleva a ellos. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "words":{q:"La universidad guarda una lista de países, y una lista de universidades socias, cada una con contactos, convenios y fechas de renovación. ¿Cuál es un dato maestro?",
    opts:[{t:"Los países: todos los sistemas los usan."},{t:"Las universidades socias: cada una tiene sus propios datos, un responsable y una vida propia, y dos sistemas podrían guardar la misma socia con dos nombres.",ok:true},{t:"Ninguna: las dos son solo listas."}],
    why:"De una socia preguntarías «¿es esta la misma que aquella?», así que es un dato maestro. Los países vienen de un estándar, y solo eliges uno de la lista, así que son datos de referencia. Piensa en una lista de tu trabajo que ganó responsables y fechas: ¿sigue siendo una lista?"},
  "golden":{q:"El registro maestro de Linh muestra su correo laboral, con la etiqueta «RR. HH.», y el registro de RR. HH. queda tal como llegó. ¿Por qué los dos?",
    opts:[{t:"Para tener dos copias, por si se pierde una."},{t:"La etiqueta dice de dónde vino el valor, así que se puede explicar y verificar; el registro de origen se queda, así que un vínculo se puede deshacer y el sistema de RR. HH. sigue funcionando.",ok:true},{t:"Porque RR. HH. no permite que se fusionen sus registros."}],
    why:"Un registro dorado no es una copia de la fila del mejor sistema. Cada valor dice de dónde vino, y cada registro de origen queda tal como llegó, así que el registro se puede explicar, valor por valor, y deshacer, vínculo por vínculo. Si fuera solo una copia, ¿qué perderías?"},
  "weights":{q:"El mismo apellido, Nguyen, suma 2; el mismo nombre, Linh, suma 3,2. ¿Por qué el apellido cuenta menos?",
    opts:[{t:"Los apellidos importan menos que los nombres."},{t:"Mucha gente comparte un apellido común, así que dos personas distintas coinciden en él a menudo por azar, y una coincidencia frecuente dice menos.",ok:true},{t:"Los dos registros lo escriben distinto."}],
    why:"Un peso mide cuánto más a menudo coincide un valor para la misma persona que para dos personas distintas. Un apellido común coincide mucho por azar, y la búsqueda solo comparó registros con apellidos que suenan parecido, así que coincidir en él dice menos. ¿Una coincidencia en tu propio nombre diría mucho, o poco?"},
  "aisha":{q:"Los registros de las dos Aishas todavía comparten un número de estudiante. ¿Por qué el «no son la misma» de Mei debería impedir que el par vuelva?",
    opts:[{t:"Para que la cola se vea más corta."},{t:"Lo que las hacía parecer iguales sigue ahí, así que el par se propondría una y otra vez, y alguien podría vincularlo por error; su decisión, con su motivo, se guarda, así que nadie la decide dos veces.",ok:true},{t:"Porque la plataforma de aprendizaje va a borrar la cuenta."}],
    why:"Una decisión se guarda con su motivo, y el cotejo la obedece. Una fusión falsa le mostraría a una estudiante los resultados de la otra; una coincidencia perdida solo deja dos registros separados hasta que alguien los vincule. En una organización que guarda tus datos, ¿qué te costaría más: que te fusionen con otra persona, o que te tengan dos veces?"}
  }}};
