/* Learning Data: "Pausa para pensar" de Many agents, and what emerges, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (little, many, board, alive), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "little":{q:"Ningún estornino guía la bandada. Entonces, ¿cómo gira toda la bandada a la vez?",
    opts:[{t:"Cada ave se guía por sus seis o siete vecinos más cercanos, y el giro pasa de ave en ave.",ok:true},{t:"Cada ave mira toda la bandada a la vez, así que todas ven un giro apenas empieza.",near:true},{t:"Sigue al ave más vieja, al frente, que conoce el camino y marca cada giro."}],
    why:"El giro pasa de vecino en vecino, y toda la bandada gira como una sola, sin líder ni plan: el todo hace lo que ninguna parte planeó. Donde trabajas, ¿qué pasa porque muchas personas siguen unos pocos hábitos simples, sin que nadie lo planee?"},
  "many":{q:"Probado por separado, ningún agente del estudio de los nombres prefería un nombre. ¿Por qué el grupo sí se inclinó?",
    opts:[{t:"Los investigadores eligieron un nombre por ellos, y los agentes solo lo siguieron."},{t:"Cada agente tenía una inclinación muy pequeña para verse sola, y el grupo las sumó.",near:true},{t:"La inclinación nació de cómo los agentes se encontraban y se copiaban, no de ninguno de ellos.",ok:true}],
    why:"Un grupo puede hacer lo que ninguna de sus partes hace sola, y solo se ve probando el grupo, trabajando como trabajará de verdad. Donde trabajas, ¿qué verificación mira cada parte por separado, y no vería lo que las partes hacen juntas?"},
  "board":{q:"El agente revisor detectó la palabra equivocada. Entonces, ¿por qué aprobó las razones Clara, y no el agente revisor?",
    opts:[{t:"El agente revisor podía aprobar, pero las razones eran borradores de Clara, así que ella aprobó su propio trabajo tras corregir la alerta.",near:true},{t:"Los agentes nunca aprueban: las razones van al consejo, así que decide una persona que responde por ellas, con la alerta delante.",ok:true},{t:"El agente revisor no estaba lo bastante seguro para aprobar, y un agente aprueba solo cuando está del todo seguro de lo que revisó."}],
    why:"Los agentes redactaron y el agente revisor alertó; Clara decidió, y ella responde por las razones. La alerta la ayudó a decidir, y ahora una prueba simple detecta la próxima carrera sin facultad, sin un agente. Donde trabajas, ¿quién aprueba lo que redacta un agente?"},
  "alive":{q:"Según la respuesta de Maturana y Varela, ¿está vivo un equipo de agentes?",
    opts:[{t:"No: un ser vivo produce sin parar las partes que lo producen, y a los agentes de hoy los hacen, inician y detienen las personas.",ok:true},{t:"Sí, en parte: un equipo de agentes se mantiene en marcha mientras funciona, así que está vivo hasta que una persona lo detiene.",near:true},{t:"Sí: actúa por su cuenta y hace cosas que nadie planeó, que es lo que Maturana y Varela llamaban vivo."}],
    why:"Hacer lo que nadie planeó es emergencia, no vida. Una célula se hace a sí misma; los agentes de hoy no se hacen ni se reparan solos, y funcionan solo porque nosotros los hacemos funcionar. ¿Qué tendría que cambiar para que llamaras viva a una máquina?"}
  }}};
