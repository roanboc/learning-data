/* Learning Data: "Pausa para pensar" de What it must be able to do, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (who, how, heat), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "who":{q:"«Operaciones de Red» es un recuadro del primer mapa de capacidades de Tomás. ¿Qué tiene de malo?",
    opts:[{t:"Nada: es lo que hace el equipo."},{t:"Debería dividirse en dos recuadros."},{t:"Es un equipo, quién hace el trabajo. Los equipos cambian; lo que hay que hacer se queda.",ok:true}],
    why:"El equipo de Grace eran dos equipos hace dos años, y el año que viene puede ser parte de otro. Una capacidad es lo que hay que hacer, lo haga quien lo haga. Piensa en la última reestructuración donde trabajas: ¿qué tenía que seguir siendo capaz de hacer la organización después?"},
  "how":{q:"«Usar el sistema de cortes» y «Despachar desde la sala de control»: ¿qué capacidad hay debajo de las dos?",
    opts:[{t:"Gestionar los cortes.",ok:true},{t:"Operar la sala de control."},{t:"Comprar un sistema de cortes nuevo."}],
    why:"La primera nombra un sistema: con qué. La segunda nombra un proceso: cómo. Una capacidad sobrevive a una reestructuración, a un sistema nuevo y a un proceso nuevo; si un recuadro no sobreviviría, no es una capacidad."},
  "heat":{q:"Conectar clientes está en rojo en el mapa de calor. ¿Qué hace que valga la pena actuar sobre ese color?",
    opts:[{t:"El rojo siempre significa que el equipo está fallando."},{t:"Su evidencia: conectar una instalación solar nueva tarda treinta y cuatro días hábiles, y la meta es diez.",ok:true},{t:"La mayoría votó por el rojo."}],
    why:"Cada color se apoya en evidencia, como cada nota de la pared. Un mapa de calor muestra dónde duele, así que muestra adónde debería ir el dinero. ¿Dónde le duele hoy a tu organización, y qué evidencia sujetarías a esa tarjeta?"}
  }}};
