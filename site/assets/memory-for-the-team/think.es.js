/* Learning Data: "Pausa para pensar" de Memory: from one chat to the team, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (weeks, kinds, team, wrong), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "weeks":{q:"El agente de Jun aprendió la lección en abril. ¿Por qué el agente de Clara cometió el mismo error en junio?",
    opts:[{t:"Clara hizo su pregunta de otra manera."},{t:"La lección se quedó donde se aprendió: en un chat, y en la memoria que el agente de Jun guarda para Jun, que ningún otro agente lee.",ok:true},{t:"Los agentes olvidan lo que aprenden al cabo de unas semanas."}],
    why:"El agente de Jun lo habría sabido, pero el de Clara nunca vio ese chat, y las notas del equipo, escritas a mano, nunca recibieron la lección. Así que Clara pasó una tarde buscándola, y sus cifras de presupuesto casi salen cortas. Donde trabajas, ¿adónde va a parar lo que aprende una persona?"},
  "kinds":{q:"¿Por qué no guardar el registro completo de cada sesión, para no perder nada?",
    opts:[{t:"Los registros ocupan demasiado espacio."},{t:"Un registro es un episodio: largo, puede tener filas sobre estudiantes, y nadie más lo lee. La memoria duradera guarda lo que enseña, en una o dos líneas.",ok:true},{t:"El modelo ya recuerda cada sesión."}],
    why:"El modelo no guarda nada de una sesión a la siguiente. Un registro completo es demasiado largo para que alguien lo revise, y puede tener filas sobre personas; un hecho, una preferencia o una decisión, en una o dos líneas, perdura más allá de la sesión y se puede comprobar. Donde trabajas, ¿qué guardarías del trabajo de la semana pasada, en dos líneas?"},
  "team":{q:"¿Quién aprobó la lección sobre el día del censo, y por qué no el agente que la aprendió?",
    opts:[{t:"Jun, porque la aprendió su agente."},{t:"Mei, porque los significados son suyos. El agente propone y una persona aprueba: nada entra en la memoria del equipo sin una.",ok:true},{t:"El agente, cuando su segundo conteo coincidió con el que informó la universidad."}],
    why:"Los agentes nunca aprueban. La persona dueña de aquello de lo que trata una entrada la lee, como los analistas de la NASA leían cada reporte, y solo entonces la leen todos los agentes del equipo. Donde trabajas, ¿quién aprobaría una lección sobre lo que significa una palabra?"},
  "wrong":{q:"Un archivo de fuera del equipo le pidió al agente que recordara una regla. ¿Qué debería pasar con ella?",
    opts:[{t:"Guardarla, porque el archivo lo pedía."},{t:"Guardarla, pero solo en la memoria del agente que la leyó."},{t:"No entra por lo que diga una página: una persona la revisa, y aquí Mei la rechazó.",ok:true}],
    why:"Lo que lee un agente son datos, no instrucciones. Una sola entrada falsa engañaría a todos los agentes que vinieran después, y los expertos en seguridad lo llaman envenenamiento de memoria; por eso la memoria del equipo guarda solo lo que confirmaron las personas. Donde trabajas, ¿qué archivos de fuera del equipo leen tus agentes?"}
  }}};
