/* Learning Data: "Pause and think" for Less, on purpose, in Spanish. Keep the keys in step with think.en.js.
   The film stops at the end of three chapters (use, stop, time), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  use:{q:"Por cada cosa en la pared, el equipo pregunta quién la usa, y para qué. ¿Por qué preguntarlo antes de dejar algo?",
    opts:[{t:"Para mostrarle al consejo de datos cuánto trabajo tiene, y pedir dos personas más para el equipo."},{t:"Para que cada recorte salga de lo que la gente usa de verdad, y nadie pierda algo que aún necesita.",ok:true},{t:"Para que cada recorte salga de lo que usa el propio equipo, y nadie conserve algo que no necesita.",near:true}],
    why:"La respuesta viene de quienes usan cada cosa: los registros, para los informes (21 los leen unas 260 personas; 17, nadie), y los propios lectores y quienes pidieron el trabajo. Un recorte hecho desde la mirada del equipo podría dejar algo que otra persona aún necesita. ¿Qué hay en la pared de tu equipo que nadie que puedas nombrar usa?"},
  stop:{q:"El lunes 31 de mayo, los 17 informes se apagan, no se borran. ¿Por qué apagarlos primero?",
    opts:[{t:"Para que sus últimos lectores puedan seguir abriéndolos hasta que el antiguo almacén cierre en diciembre.",near:true},{t:"Porque borrar un informe necesita la aprobación del consejo de datos, y el consejo se reúne una vez al mes."},{t:"Para que cualquiera pueda volver en un día, hasta que el antiguo almacén de datos cierre en diciembre.",ok:true}],
    why:"Apagados, nadie puede abrirlos; por eso la persona que aún necesitaba las cifras del año pasado recibió antes una copia. Pero cualquiera de los 17 puede volver a encenderse en un día, hasta diciembre: todo recorte se puede deshacer, y nadie tiene que temerle. Apágalo, espera, y luego bórralo. ¿Qué podrías apagar este mes, y aún traer de vuelta?"},
  time:{q:"Cada persona recupera unas cinco horas semanales. ¿Qué evita que ese tiempo se vuelva a llenar?",
    opts:[{t:"Una regla: todo lo nuevo necesita un lector, una razón y un responsable; y cada trimestre, todo vuelve a la pared.",ok:true},{t:"Una regla: todo lo nuevo necesita un responsable y una razón; y cada trimestre, todo vuelve a la pared.",near:true},{t:"Las cinco horas quedan reservadas como tiempo de concentración en cada agenda, sin lugar para reuniones nuevas."}],
    why:"Cada cosa en la pared se agregó por una buena razón, y aun así se acumularon: lo que les faltaba a los 17 informes era un lector. Por eso la regla pide las tres cosas: alguien que lo use, para qué, y quién lo cuida. Y en cada revisión trimestral, todo vuelve a la pared, así que lo que pierde a sus lectores puede dejarse otra vez. ¿Qué cosa nueva de tu equipo este año tiene un lector que puedas nombrar?"}
  }}};
