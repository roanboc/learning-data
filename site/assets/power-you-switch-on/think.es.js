/* Learning Data: "Pausa para pensar" de Power you switch on, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (second, switched, who), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs del módulo llegan más adelante, como un solo conjunto, así que
   ninguna pregunta tiene "stop" todavía, y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "second":{q:"Alguien roba el acceso diario de Jun. ¿A qué puede llegar?",
    opts:[{t:"También a su cuenta de administrador, porque las dos cuentas son de Jun."},{t:"A nada, porque todo el poder de Jun está en su cuenta de administrador.",near:true},{t:"A su trabajo de cada día: su código, sus pruebas y los procesos que vigila.",ok:true}],
    why:"Su cuenta diaria conserva su trabajo de cada día, y nada más. La cuenta de administrador es una cuenta aparte, nunca usada para el correo ni la web, que solo entra con una llave de acceso, así que un acceso diario robado no llega a ella. El gran poder sí está allí, pero la cuenta diaria sigue llegando a su trabajo diario. ¿A qué llegaría alguien con tu acceso de cada día?"},
  "switched":{q:"Jun debe restaurar una tabla, media hora de trabajo. ¿Qué enciende?",
    opts:[{t:"Todo el poder de administrador, cuatro horas, para no quedarse a medias."},{t:"Restaurar una tabla, el tiempo que el trabajo necesita, con el sí de Sam.",ok:true},{t:"Restaurar una tabla, el tiempo que el trabajo necesita, aprobado por él.",near:true}],
    why:"Solo el poder que la tarea necesita, el tiempo que necesita, y el sí de otro especialista: Sam aprueba el de Jun, Jun el de Sam, y nadie aprueba el suyo. El poder correcto por el tiempo correcto es la mitad de un encendido; el sí de otra persona es la otra mitad. ¿Quién dice que sí al trabajo de administración donde estás?"},
  "who":{q:"Clara, analista de Planeación, necesita una columna que no ve. ¿Qué pasa ahora?",
    opts:[{t:"Lo pide al equipo de plataforma, que decide si ella puede verla.",near:true},{t:"Recibe una cuenta de administrador, encendida una hora para leerla."},{t:"Lo pide al dueño de los datos y, si acepta, la ve en el catálogo.",ok:true}],
    why:"Los usuarios de negocio y los analistas nunca reciben una cuenta de administrador. Su trabajo pasa por el catálogo, así que Clara pide acceso al dueño de los datos, no poder, y ve la columna a través de su rol, enmascarada donde haga falta. El equipo de plataforma mantiene la plataforma en marcha, pero no decide quién puede ver los datos. ¿Quién decide quién puede ver los tuyos?"}
  }}};
