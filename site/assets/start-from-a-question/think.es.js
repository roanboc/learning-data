/* Learning Data: "Pausa para pensar" de Empieza por una pregunta, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (ask, slice, owners, split), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "ask":{stop:"scope",q:"¿Por qué una pregunta necesita una decisión detrás?",
    opts:[{t:"La decisión dice quién pregunta, para que el equipo de datos sepa qué pedido construir primero.",near:true},{t:"No la necesita: cualquier pregunta clara basta para empezar a modelar, y la decisión viene después."},{t:"La decisión dice qué tan exacta, qué tan actual y desde cuándo debe ser la respuesta, y una cifra a alcanzar.",ok:true}],
    why:"Una pregunta sin decisión no tiene un «terminado». La decisión de Planificación (los cupos en las últimas unidades de cada facultad) fija la fecha (la del censo) y el número que alcanzar: el doce del informe del censo."},
  "slice":{stop:"slice",q:"Ahora Planificación pregunta también por los aranceles. ¿Qué entidad agregas a este modelo?",
    opts:[{t:"Ninguna, por ahora. Los aranceles son otra pregunta, con su porción y responsables.",ok:true},{t:"Arancel e inscripción, porque los aranceles se cobran por cada inscripción."},{t:"Arancel, pero solo cuando se haya nombrado a su responsable en esta porción.",near:true}],
    why:"No estires esta pregunta para cubrir la siguiente. Termínala; después la pregunta de los aranceles tiene su propia decisión, porción y responsables, y amplía el modelo."},
  "owners":{stop:"owners",q:"¿Por qué nombrar al responsable de cada significado antes de mirar los datos?",
    opts:[{t:"Es una formalidad: al final decide el equipo de datos, pero nombrar un responsable da a cada significado alguien que lo firme."},{t:"Las fuentes no van a coincidir. Alguien tiene que decidir qué significado gana, y hay que saber quién es antes de que empiece la discusión.",ok:true},{t:"Las fuentes no van a coincidir, y el responsable debe revisar antes los datos de cada fuente, así que necesita tiempo antes de modelar.",near:true}],
    why:"Tres sistemas dirán tres cosas de un mismo estudiante. Mei es dueña de estudiante, credencial y título, así que cuando no coincidan, la decisión es suya, no de la fuente que más grite."},
  "split":{stop:"kinds",q:"Una insignia no da créditos. ¿Debería ser una entidad propia?",
    opts:[{t:"Dejar las insignias fuera del modelo, porque una credencial sin créditos no se cuenta en ningún informe."},{t:"Sí: tiene la misma identidad que cualquier credencial, pero un ciclo de vida propio, porque las insignias no vencen.",near:true},{t:"No: tiene la misma identidad y el mismo ciclo de vida que cualquier credencial. Los créditos son un atributo, no una razón para separar.",ok:true}],
    why:"La identifica el identificador de su emisor, se emite en una fecha y quizá se revoca: una insignia es un tipo de credencial. Solo se separa por otra identidad, granularidad o ciclo de vida."}
  }}};
