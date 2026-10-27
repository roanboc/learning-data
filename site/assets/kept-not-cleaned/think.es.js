/* Learning Data: "Pausa para pensar" de Kept, not cleaned, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (return, entry, measures, agent), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs y las situaciones son de la serie, para todas sus películas
   (assets/master-and-reference-data/), así que ninguna pregunta tiene "stop"; el .player data-labs de la página lleva a ellos. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "return":{q:"Una limpieza fusionó dos mil registros duplicados, y un año después había mil cien nuevos. ¿Por qué?",
    opts:[{t:"La limpieza pasó por alto la mitad."},{t:"Nada cambió donde se crean los registros: cada admisión seguía dando un número nuevo a los egresados que volvían, y a quienes postulaban por dos vías.",ok:true},{t:"Los duplicados no se pueden evitar, solo limpiar."}],
    why:"Una limpieza quita los duplicados que hay, una vez. La forma en que se creaban los nuevos siguió funcionando, admisión tras admisión, y el segundo número de Linh fue uno de ellos. Piensa en una carpeta o una lista que ordenaste alguna vez. ¿Cuánto duró ordenada?"},
  "entry":{q:"¿Por qué la búsqueda en la solicitud perdura, si la limpieza no?",
    opts:[{t:"Fusiona duplicados más rápido que la limpieza."},{t:"Detiene un duplicado antes de que se cree, cada vez que alguien postula, en vez de encontrarlo después.",ok:true},{t:"Se ejecuta una vez al año, después de cada admisión."}],
    why:"La búsqueda trabaja donde se crean los registros: una coincidencia clara agrega un rol a alguien ya conocido, y una probable espera en la cola de Mei, así que los duplicados nuevos se mantienen bajo cincuenta por admisión. Como la forma del río, deja fuera a la mayoría, y la cola saca el resto. ¿Dónde, en tu trabajo, un control al inicio ahorraría una limpieza después?"},
  "measures":{q:"Cada uno de los cinco indicadores de la oficina de Mei tiene un límite. ¿Por qué?",
    opts:[{t:"Para que el tablero tenga algo que colorear."},{t:"Para que diga cuándo actuar: pasado su límite, alguien mira, antes de que se acumulen los casos.",ok:true},{t:"Para que los indicadores nunca tengan que cambiar."}],
    why:"Un número solo describe. Con un límite acordado con su responsable, dice cuándo alguien debe mirar, como las barras de hierro en el lecho del río dicen hasta dónde excavar. De los cinco indicadores, ¿cuál querrías ver primero un lunes por la mañana?"},
  "agent":{q:"Un agente redactó cómo encaja el nuevo tipo de visa en las categorías de arancel de la universidad. ¿Por qué lo aprueba la oficina de admisiones, y no el agente?",
    opts:[{t:"El agente no puede leer la lista."},{t:"La responsable responde por la lista: el agente propone, con su evidencia, la responsable decide, y el motivo queda guardado.",ok:true},{t:"Las listas de fuera nunca cambian las de la universidad."}],
    why:"El agente ahorra el borrador. La oficina de admisiones, responsable de la lista, revisa la evidencia y decide, así que alguien responde por cada valor que clasifica a las personas. ¿Qué listas de tu organización cambian desde fuera, y quién aprobaría el cambio?"}
  }}};
