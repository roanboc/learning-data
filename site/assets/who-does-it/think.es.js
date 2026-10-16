/* Learning Data: "Pausa para pensar" de Who does it, and where meaning changes, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (names, agent, one), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "names":{q:"Tomás escribió «Sam» en el paso «decidir quién va primero». ¿Por qué Grace lo tachó?",
    opts:[{t:"Sam tomó mal la decisión."},{t:"Un paso lo hace un rol, el controlador de turno; Sam es solo el actor que lo ocupó esa noche.",ok:true},{t:"Los pasos no deberían decir quién los hace."}],
    why:"La semana que viene otra persona hará el turno de noche, y el paso no cambia. Los roles se quedan; los actores, personas o equipos, van y vienen. En tus propios mapas de procesos, ¿cuántos pasos llevan el nombre de una persona?"},
  "agent":{q:"El agente agrupa los avisos de corte y propone un orden. Un aviso dice que hay un cable caído. ¿Qué pasa?",
    opts:[{t:"El agente envía la cuadrilla más cercana."},{t:"El agente lo ordena con los demás, por número de avisos."},{t:"Pasa directo al controlador de turno: el agente recomienda, y una persona decide.",ok:true}],
    why:"Un agente de IA es un actor como cualquier otro, con sus atribuciones escritas: puede agrupar avisos y proponer; no puede enviar una cuadrilla; los cables caídos y las personas electrodependientes se escalan. Si un agente trabaja con tu equipo, ¿dónde están escritas sus atribuciones, y quién es su responsable?"},
  "one":{q:"¿Por qué no una sola definición de «cliente» para toda la empresa?",
    opts:[{t:"No le serviría a ningún lado, y llevaría lo que sabe la red al otro lado del muro.",ok:true},{t:"Porque acordar una definición llevaría demasiado tiempo."},{t:"Porque solo comercialización tiene clientes."}],
    why:"El cliente de comercialización es quien tiene una cuenta; el de la red, un punto de conexión. Cada dominio conserva su significado, y el borde recibe una traducción: una lista corta y acordada de lo que cruza, y cómo. ¿Dónde significa una misma palabra dos cosas donde trabajas?"}
  }}};
