/* Learning Data: "Pausa para pensar" de Empieza por una pregunta, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (ask, slice, owners, split), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "ask":{stop:"scope",q:"¿Por qué una pregunta necesita una decisión detrás?",
    opts:[{t:"Para que el pedido suene lo bastante importante como para construirlo."},{t:"No la necesita: cualquier pregunta clara basta para empezar a modelar."},{t:"La decisión dice qué tan exacta, qué tan actual y desde cuándo debe ser la respuesta, y da un número que alcanzar.",ok:true}],
    why:"Una pregunta sin decisión no tiene un «terminado». La decisión de Planificación (los cupos en las últimas unidades de cada facultad) fija la fecha (la del censo) y el número que alcanzar: el doce del informe del censo."},
  "slice":{stop:"slice",q:"Ahora Planificación pregunta también por los aranceles. ¿Qué entidad agregas a este modelo?",
    opts:[{t:"Ninguna, por ahora. Los aranceles son una pregunta nueva, con su propia porción y sus propios responsables.",ok:true},{t:"Arancel: son los mismos estudiantes, así que encaja."},{t:"Arancel e inscripción, por si acaso."}],
    why:"No estires esta pregunta para cubrir la siguiente. Termínala; después la pregunta de los aranceles tiene su propia decisión, porción y responsables, y amplía el modelo."},
  "owners":{stop:"owners",q:"¿Por qué nombrar al responsable de cada significado antes de mirar los datos?",
    opts:[{t:"Para poder culpar al responsable si las cifras están mal."},{t:"Las fuentes no van a coincidir. Alguien tiene que decidir qué significado gana, y hay que saber quién es antes de que empiece la discusión.",ok:true},{t:"Es una formalidad: al final decide el equipo de datos."}],
    why:"Tres sistemas dirán tres cosas de un mismo estudiante. Mei es dueña de estudiante, credencial y título, así que cuando no coincidan, la decisión es suya, no de la fuente que más grite."},
  "split":{stop:"kinds",q:"Una insignia no da créditos. ¿Debería ser una entidad propia?",
    opts:[{t:"Sí: sin créditos es otra cosa."},{t:"Dejar las insignias fuera del modelo."},{t:"No: tiene la misma identidad y el mismo ciclo de vida que cualquier credencial. Los créditos son un atributo, no una razón para separar.",ok:true}],
    why:"La identifica el identificador de su emisor, se emite en una fecha y quizá se revoca: una insignia es un tipo de credencial. Solo se separa por otra identidad, granularidad o ciclo de vida."}
  }}};
