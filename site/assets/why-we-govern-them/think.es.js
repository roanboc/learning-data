/* Learning Data: "Pausa para pensar" de Why we govern them, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (identity, limits, review), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "identity":{q:"El agente de Jun trabaja con el nombre de Jun. ¿Por qué está bien mientras aprende, pero no cuando trabaja para el equipo?",
    opts:[{t:"Nunca está bien: un agente jamás debe usar el nombre de una persona."},{t:"Mientras aprende, sus herramientas solo leen y sus borradores esperan en un entorno aislado. Trabajando para el equipo, sus cambios parecerían de Jun, y detenerlo sería detener a Jun.",ok:true},{t:"Cuando ya es lo bastante bueno, el nombre deja de importar."}],
    why:"Mientras aprende, poco puede salir mal: solo lee, y sus borradores esperan en un entorno aislado. Trabajando para el equipo, sus cambios parecerían de Jun, y para detenerlo habría que detenerlo a él. Con un nombre propio, el equipo ve como suyo todo lo que hace, y puede detenerlo solo a él, como la sala de control veía cada tren. Donde trabajas, ¿podrías distinguir los cambios de una herramienta de los de la persona que la configuró?"},
  "limits":{q:"El agente podría hacer mucho más de lo que permite su mandato. ¿Quién decide cuánto hace solo?",
    opts:[{t:"El agente, porque sabe mejor que nadie lo que puede hacer."},{t:"Su capacidad: cuanto más capaz es, más puede hacer solo."},{t:"Su dueño, en un mandato escrito: qué tareas, dónde y cómo se revisa cada una. Se puede bajar en cualquier momento, y el agente nunca puede subirlo.",ok:true}],
    why:"Cuánto hace solo un agente es una decisión, aparte de lo capaz que sea: a un agente muy capaz se le puede pedir igual que consulte primero a una persona. Su dueño firma el mandato y, como la velocidad en la cabina, se fija desde fuera. ¿Qué tarea de tu equipo dejarías que un agente hiciera solo, y cuál guardarías para que una persona la revise?"},
  "review":{q:"La revisión que hace el agente de su propio cambio es minuciosa y segura. ¿Por qué una persona sigue aprobando cada cambio en producción?",
    opts:[{t:"Los agentes nunca aprueban: suena seguro, y sentirse seguro no es saber. No puede responder por el cambio, y una persona sí.",ok:true},{t:"Porque la revisión de un agente suele estar mal."},{t:"Solo hasta que haya hecho suficientes cambios sin errores."}],
    why:"La revisión de un agente es solo de referencia. Su dueño revisa su evidencia, no su tono, y una segunda persona aprueba el cambio, igual que con los cambios de las personas. La regla no existe porque el agente sea malo, sino porque no puede responder por lo que hace. ¿Quién revisa los cambios que llegan a producción en tu trabajo, y lo notaría si el autor fuera un agente?"}
  }}};
