/* Learning Data: "Pausa para pensar" de Day one, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (pieces, looking, data), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "pieces":{q:"Tomás tiene un organigrama, una lista de 140 sistemas y un manual de procesos. ¿Por qué todavía no entiende la empresa?",
    opts:[{t:"Algunos documentos están equivocados."},{t:"Cada uno es cierto, pero es una pieza de un rompecabezas distinto.",ok:true},{t:"Todavía no leyó el manual."}],
    why:"El organigrama muestra quién reporta a quién; la lista de sistemas, lo que se compró. Nada de eso dice qué tiene que ser capaz de hacer la empresa, ni por qué. Piensa en tu primera semana en un lugar nuevo: ¿qué te dieron, y qué quedó fuera?"},
  "looking":{q:"¿Por dónde debería empezar un mapa de la organización?",
    opts:[{t:"Por los sistemas: son lo más fácil de listar."},{t:"Por el organigrama: muestra quién hace qué."},{t:"Por qué existe, y para quién: cada capa de abajo se deduce de la de arriba.",ok:true}],
    why:"Si empiezas por abajo, puedes describir cada sistema a la perfección y aun así no saber para qué sirve ninguno. La mayoría de los traspasos empiezan por la lista de sistemas: ¿qué sale mal cuando se empieza ahí?"},
  "data":{q:"«Una lectura estimada del medidor vale solo hasta la siguiente lectura real». ¿Qué le da el mapa a esta regla?",
    opts:[{t:"Un lugar: el proceso que crea el dato, su dueño y la meta a la que sirve.",ok:true},{t:"Una tabla donde guardarla."},{t:"Una prueba que corre cada noche."}],
    why:"Cada regla de datos afirma algo sobre la organización. Sin el mapa, una regla es una suposición, y cuando falla, nadie sabe quién debería corregirla. Elige una regla de datos que conozcas: ¿podrías nombrar su proceso, su dueño y su meta?"}
  }}};
