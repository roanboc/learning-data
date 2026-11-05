/* Learning Data: "Pausa para pensar" de Working with agents on Databricks, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (ask, tools, build), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "ask":{q:"El agente Census day se prueba con las preguntas detrás de las tres respuestas de Salud. ¿Por qué probarlo con errores que cometieron otros agentes?",
    opts:[{t:"Porque son las trampas en las que cae una pregunta real, cada una con su respuesta correcta en SQL.",ok:true},{t:"Porque el agente aprende de esas pruebas, así que no volverá a cometer esos errores.",near:true},{t:"Porque esos agentes también se probaron con ellos, así que los dos puntajes se comparan."}],
    why:"La carga leída como personas y una carrera conjunta contada en una facultad son las trampas en las que cae una pregunta real. Cada prueba tiene su respuesta correcta en SQL, así que después de cada cambio el equipo ve de inmediato si el agente sigue acertando, antes de que alguien dependa de él. Donde trabajas, ¿qué respuestas equivocadas serían buenas pruebas?"},
  "tools":{q:"El equipo de datos escribió el conteo del censo una sola vez, como una función. ¿Por qué no dejar que cada agente escriba su propia consulta?",
    opts:[{t:"Los agentes escriben buenas consultas, pero una función corre más rápido.",near:true},{t:"Que cada agente escriba su propio conteo es lo que le dio a Salud tres respuestas.",ok:true},{t:"La consulta de cada agente se revisa igual, así que una función ahorra la revisión."}],
    why:"Un conteo es un trabajo conocido, así que una función simple y probada lo hace igual cada vez. Escrita una vez, cada agente que la llama obtiene la misma cifra, y su comentario dice qué cuenta. Donde trabajas, ¿qué conteo escribe la gente una y otra vez?"},
  "build":{q:"El agente que revisa el censo pasa su evaluación. ¿Por qué Jun sigue decidiendo qué significa su nota?",
    opts:[{t:"Porque Jun escribió su evaluación, así que solo Jun puede leer sus notas."},{t:"Porque pasó en casos pasados, pero todavía no en suficientes para decidir.",near:true},{t:"Porque su nota es evidencia, y una persona decide qué significa.",ok:true}],
    why:"La evaluación muestra cómo le fue al agente con casos pasados, no que acierte esta noche. Su nota es evidencia: las filas, las consultas y cada paso que dio. Un agente nunca aprueba: una persona lee la evidencia y decide, y cualquier arreglo en producción lo revisa una persona y lo aprueba una segunda. Donde trabajas, ¿quién lee la evidencia antes de una decisión?"}
  }}};
