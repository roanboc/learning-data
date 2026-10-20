/* Learning Data: "Pausa para pensar" de A map people and agents can read, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (risk, views, rights), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). El "stop" de una pregunta es el lab de la serie que abre, en la
   página de labs de la serie (el .player data-labs de la página es "../labs/"); una pregunta sin él no tiene enlace a un lab. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "risk":{stop:"navigator",q:"Tomás mantiene el mapa al día él mismo, cada semana. ¿Por qué sigue sin pasar la prueba del navegante?",
    opts:[{t:"Está en diapositivas, y las diapositivas no pueden contener un mapa."},{t:"Solo él puede cambiarlo: sin él, nadie podría mantenerlo fiel, ni navegar con él.",ok:true},{t:"Las copias de las presentaciones son más nuevas que la suya."}],
    why:"Un mapa vive mientras la gente lo usa, lo mantiene fiel y puede transmitirlo. El mapa de Tomás se usa, y es fiel mientras él está, pero solo él puede cambiarlo, y sus copias se desfasan sin él. Guardado como texto, con quien es responsable de cada parte revisando sus cambios, deja de depender de una sola persona. ¿Quién es la única persona que puede actualizar un mapa, un modelo o un glosario en tu organización?"},
  "views":{stop:"navigator",q:"El glosario dice que una lectura es la energía usada, y deja fuera la energía que exportan los paneles solares. ¿Por qué no se corrige en el glosario?",
    opts:[{t:"El glosario es del equipo de datos, no de la red."},{t:"El glosario se genera del mapa: corregido ahí, no coincidiría con las demás vistas, y se perdería la próxima vez que se generen las vistas.",ok:true},{t:"Una definición no puede cambiar una vez que su responsable la confirmó."}],
    why:"Cada vista se genera del mapa, en un solo sentido, así que todas coinciden. La corrección va al mapa, su responsable la confirma, y el glosario, los modelos, dbt y el catálogo la siguen. ¿Dónde se guarda a mano la misma definición en dos lugares de tu organización?"},
  "rights":{stop:"navigator",q:"El agente del mapa lee todo y redacta cambios en segundos. ¿Por qué su propio archivo dice que no puede confirmar ninguno?",
    opts:[{t:"Los agentes no pueden escribir en los archivos del mapa."},{t:"Un mapa es fiel cuando lo confirman sus responsables: el agente redacta, y quien es responsable decide, y responde por ello.",ok:true},{t:"El mapa cambiaría demasiado seguido."}],
    why:"Redactar es un trabajo que un agente hace bien: encontrar lo que toca un cambio, y escribirlo. Confirmar es decir que el mapa es fiel, y solo quien es responsable de esa parte puede decirlo. Sus atribuciones están por escrito, como las de cualquiera: lee, redacta y pregunta; las personas confirman. ¿Qué cambios dejarías que un agente redacte en tu organización, y quién los confirmaría?"}
  }}};
