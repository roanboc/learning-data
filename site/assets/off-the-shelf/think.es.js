/* Learning Data: "Pausa para pensar" de Off the shelf, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (decides, for, runs), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "decides":{q:"Ambos números son correctos. ¿Por qué nadie puede decir cuál se envía al gobierno?",
    opts:[{t:"Planificación se equivocó en su informe."},{t:"Nadie ha decidido cómo se mapea el sentido de título de la universidad al del gobierno, y quien debería hacerlo sigue por confirmar.",ok:true},{t:"El glosario cambió, así que el número más antiguo está mal."}],
    why:"Un informe se generó antes del cambio del lunes en título, y el otro después; cada uno es correcto con su propio sentido. El gobierno cuenta con su propia definición, y mapear la nuestra a la suya es una decisión que todavía no tiene dueño. ¿Qué números de tu trabajo dependen de una decisión que nadie ha anotado?"},
  "for":{q:"¿Cuál es la diferencia entre gobernanza y gestión?",
    opts:[{t:"La gobernanza escribe las políticas, y la gestión las lee."},{t:"La gobernanza decide quién decide, fija las reglas y verifica que se cumplan; la gestión hace el trabajo: los dueños, los ingenieros y la plataforma.",ok:true},{t:"Son dos nombres para el mismo trabajo."}],
    why:"Como el inspector del mercado: una regla, una copia donde se hace el trabajo y alguien que verifica. La gobernanza no construye los informes ni opera la plataforma; se asegura de que cada decisión tenga un dueño y llegue al trabajo. Donde trabajas, ¿quién verifica que las reglas se cumplan?"},
  "runs":{q:"«Los datos personales se clasifican y se protegen». ¿Dónde podría ejecutarse esta línea?",
    opts:[{t:"En la política, que el consejo lee una vez al año."},{t:"Como un control de que cada columna de un modelo público esté clasificada, y una máscara que la plataforma aplica según la clasificación.",ok:true},{t:"En ningún lado: una línea así solo puede ser un principio."}],
    why:"Sam podría proteger una columna en minutos, si alguien le dijera cuál: la clasificación en la columna dice cuál, y un control verifica que esté. Una línea que no puede ejecutarse se vuelve una decisión con dueño, anotada donde el trabajo pueda encontrarla, o sobra. Elige una línea de una política que conozcas: ¿dónde se ejecutaría?"}
  }}};
