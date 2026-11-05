/* Learning Data: "Pausa para pensar" de Context engineering, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (word, reads, team), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "word":{q:"La respuesta del agente trae su consulta, y suena segura. ¿Qué debería comprobar Jun antes de que Planificación la use?",
    opts:[{t:"Qué significa la palabra, y quién lo dice.",ok:true},{t:"Que la consulta cuente la tabla correcta.",near:true},{t:"Que la cifra se parezca a la del año pasado."}],
    why:"Una consulta que corre puede contar lo que no es. La respuesta solo es tan correcta como el significado con el que contó, y ese significado tiene un dueño. Donde trabajas, ¿qué palabras tendría que adivinar un agente?"},
  "reads":{q:"Al contexto del agente le faltaba el significado de «commencing», de nuevo ingreso. ¿Cuál de los cuatro tipos debería tenerlo?",
    opts:[{t:"El código: las recetas del repositorio y sus pruebas."},{t:"Los metadatos: lo que significan las palabras, escrito por sus dueños.",ok:true},{t:"La memoria: lo que las sesiones pasadas aprendieron de la palabra.",near:true}],
    why:"El significado de una palabra va en los metadatos, donde su dueño lo escribe una vez. Luego el código del proyecto lo copia con su origen, y la columna, la prueba y el contrato dicen lo mismo. Donde trabajas, ¿dónde está escrito lo que significa una palabra?"},
  "team":{q:"Cada persona del equipo había configurado su propio agente, con sus propias notas. ¿Qué sale mal?",
    opts:[{t:"Los agentes comparten una memoria, así que una nota errónea de uno llega a todos."},{t:"Las notas de cada agente son cuidadosas, así que coinciden, pero nadie las revisa.",near:true},{t:"Cada agente sabe solo lo que le dijo su dueño, y sus respuestas no coinciden.",ok:true}],
    why:"Tres juegos de notas dieron tres significados a una palabra, como los libros de cantos con el nombre de su maestro. Un solo contexto, en el proyecto, revisado como el código, con un dueño para cada significado, da a cada persona y a cada agente la misma página, y un cambio hecho una vez les llega a todos. ¿Qué notas tendrían que leer hoy tus agentes?"}
  }}};
