/* Learning Data: "Pause and think" for The question behind the request, in Spanish. Keep the keys in step with think.en.js.
   The film stops at the end of three chapters (listen, agree, answer), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  listen:{q:"Graham pidió un tablero del uso de las aulas para Semana Santa. ¿Qué necesitaban averiguar primero Helena y Noor?",
    opts:[{t:"La decisión que tomará con él, para cuándo, quién más decide y qué le haría cambiar de idea.",ok:true},{t:"Los gráficos que querrá ver en él, para cuándo, quién más lo abrirá y qué haría que lo usara.",near:true},{t:"Qué datos de las aulas ya tiene el equipo, para construir el tablero antes de Semana Santa."}],
    why:"Un pedido suele nombrar lo que alguien supone que es la solución. Detrás del tablero de Graham había una decisión: si pedir al Consejo Universitario, que decide el 24 de junio, un nuevo edificio de aulas, y qué le haría cambiar de idea. Unas pocas preguntas abiertas, y luego sobre todo escuchar, la encontraron en media hora. ¿Qué decidirá con su informe la próxima persona que te lo pida?"},
  agree:{q:"Cerca del final, Graham detuvo a Helena en una palabra: “uso”. ¿Por qué importaba tanto esa palabra?",
    opts:[{t:"Mostró que había cambiado de idea: ya no quería un tablero, así que el equipo podía dejarlo."},{t:"Decidió los datos: con “uso” quería decir aulas reservadas, así que bastaba con el horario.",near:true},{t:"Decidió los datos: con “uso” quería decir personas en el aula, así que faltaban los conteos.",ok:true}],
    why:"Con “uso”, Graham quería decir personas en el aula, y una reserva no es uso. Esa palabra decidió los datos: las reservas del horario, junto a los conteos de personas del sensor de cada aula. Quedó en la página con sus palabras, bajo la pregunta, junto a su pedido. ¿Qué palabra del último pedido que recibiste podía significar dos cosas?"},
  answer:{q:"En toda la semana, las aulas estaban reservadas el 38% del tiempo; en la hora pico, el 93%. ¿Cómo ayudó la pregunta acordada?",
    opts:[{t:"Preguntaba por toda la semana, no por algunas horas, así que el equipo mostró el promedio que el pico escondía.",near:true},{t:"Preguntaba por algunas horas, no solo por la semana, así que el equipo halló el pico que el promedio escondía.",ok:true},{t:"Fijaba Semana Santa como fecha, así que el equipo le dio a Graham un primer número rápido, para afinarlo después."}],
    why:"La pregunta, muy pocas aulas o muy pocas a algunas horas, llevó al equipo a las horas: el 93% de las aulas reservadas de 10:00 a 14:00, de martes a jueves, frente al 38% de toda la semana. Los académicos tenían razón sobre la hora pico, y Graham sobre los lunes por la mañana: el promedio de la semana escondía ambas cosas. ¿Cómo se vería tu última respuesta en su hora de más trabajo?"}
  }}};
