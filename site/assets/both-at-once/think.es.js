/* Learning Data: "Pausa para pensar" de Both at once, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (distance, sync, doesnt, questions), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "distance":{stop:"fresh",q:"Una credencial se revoca a las 15:00. Un empleador la verifica a las 16:00, y la respuesta sale de la copia de anoche. ¿Qué ve el empleador?",
    opts:[{t:"Revocada."},{t:"Válida: la copia todavía no lo sabe.",ok:true},{t:"Un error: la credencial no aparece."}],
    why:"La copia de anoche se hizo antes de la revocación. Hasta la próxima copia, el lado de lectura dice que la credencial es válida: esa es la distancia que acortan las bases de datos híbridas."},
  "sync":{stop:"order",q:"El lado de lectura recibe «revocar A-1042» antes que «emitir A-1042». ¿Qué termina mostrando?",
    opts:[{t:"Revocada."},{t:"Emitida: la credencial vuelve a la vida.",ok:true},{t:"Nada: rechaza los dos cambios."}],
    why:"La revocación no encuentra ninguna fila, así que no cambia nada; después, la emisión agrega la credencial como emitida. Los cambios se deben aplicar en el orden en que ocurrieron."},
  "doesnt":{stop:"where",q:"La tabla de títulos de la app está al día y es exacta. ¿Por qué contar desde ella los títulos de Ciencias del año pasado da un resultado equivocado?",
    opts:[{t:"La base de datos híbrida lee más lento."},{t:"Guarda el estado de hoy: los títulos revocados siguen ahí, las facultades se sobrescribieron y no hay historia.",ok:true},{t:"Las tablas en vivo redondean sus cifras."}],
    why:"Una tabla hecha para escribir guarda el estado actual de cada fila. Contar el pasado necesita historia, dimensiones compartidas y una definición: un modelo."},
  "questions":{stop:"fresh",q:"¿Qué respuesta tiene que estar al día en segundos?",
    opts:[{t:"Un informe de planificación a diez años."},{t:"Un empleador que verifica si una credencial sigue siendo válida.",ok:true},{t:"El reporte al gobierno en la fecha de censo."}],
    why:"El empleador está esperando un dato que puede cambiar. Un plan puede usar los datos de anoche; el reporte de censo debe quedar fijo en su fecha."}
  }}};
