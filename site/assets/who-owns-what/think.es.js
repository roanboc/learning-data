/* Learning Data: "Pausa para pensar" de Quién es dueño de qué, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (domains, access, grants, shared), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "domains":{stop:"domains",q:"¿Quién es dueño del significado de una microcredencial?",
    opts:[{t:"Mei, en la oficina de registro: es dueña de toda credencial."},{t:"El equipo de aprendizaje: es dueño del tipo microcredencial, dentro de la credencial que es de Mei.",ok:true},{t:"El grupo de Noor: construye core_credential."}],
    why:"model/conceptual.yml nombra al equipo de aprendizaje dueño del tipo microcredencial (y de las insignias), y de los conjuntos de claves LMS y SC. La credencial en su conjunto es de Mei, por eso el meta.owner de core_credential es ella; el equipo de aprendizaje decide qué es una microcredencial, dentro de ella."},
  "access":{stop:"access",q:"La billetera hace ref() al mart de Planificación, y dbt lo permite. ¿Por qué sigue estando mal?",
    opts:[{t:"No está mal: si dbt lo permite, está bien."},{t:"El mart está hecho a la medida de la pregunta de Planificación y cambia cuando Planificación lo necesita. La billetera debe construir sobre el núcleo público.",ok:true},{t:"Porque el mart es privado del grupo de Planificación."}],
    why:"El mart es el contrato de consumidor de Planificación. La billetera dependería sin aviso de las decisiones de otro consumidor. Los consumidores construyen sobre el núcleo público; en un solo proyecto, solo la revisión detiene el atajo."},
  "grants":{stop:"read",q:"¿Se puede leer la tabla de un modelo privado?",
    opts:[{t:"No: privado la oculta a todos fuera de su grupo."},{t:"Sí, si un permiso lo deja.",ok:true},{t:"Solo los modelos del mismo grupo."}],
    why:"El acceso trata de qué modelos pueden hacer ref() a cuáles, cuando dbt analiza. Leer una tabla depende de los permisos de la plataforma."},
  "shared":{stop:"shared",q:"¿Qué se rompe primero cuando los dominios dejan de compartir claves?",
    opts:[{t:"El build: fallan las pruebas de claves."},{t:"Los joins entre dominios: el mismo estudiante tiene dos claves, y los joins no encuentran nada.",ok:true},{t:"Nada, mientras las claves de cada proyecto sean únicas."}],
    why:"El mismo estudiante tiene dos claves, los joins entre dominios no encuentran nada, y los conteos se separan, sin que falle ninguna prueba en ningún proyecto."}
  }}};
