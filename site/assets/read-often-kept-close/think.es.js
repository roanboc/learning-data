/* Learning Data: "Pausa para pensar" de Read often, kept close, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (tiers, records, years), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "tiers":{q:"Los niveles de almacenamiento en la nube se llaman caliente, templado, frío y archivo. ¿Qué decide en qué nivel va un archivo?",
    opts:[{t:"Cuán fresco debe estar: caliente si alguien actúa al instante, archivo si es años después.",near:true},{t:"Cuán viejo es: cada archivo baja un nivel cada año, lo siga leyendo alguien o no."},{t:"Cuán seguido se lee: seguido, donde leer es barato; casi nunca, donde guardar es barato.",ok:true}],
    why:"Los niveles suenan a la temperatura de los datos, pero responden otra pregunta: no cuándo alguien actúa con los datos, sino cuán seguido alguien los lee. Cada nivel más abajo cuesta menos guardar y más leer, así que lo que se lee seguido queda donde leer es barato. Donde trabajas, ¿qué se guarda en el almacenamiento más caro pero casi no se lee?"},
  "records":{q:"Los registros de pago de más de un año están ahora en el nivel de archivo, el más barato. ¿Qué cede la universidad a cambio?",
    opts:[{t:"Velocidad: un año archivado tarda horas en volver antes de leerse, lo que basta para una auditoría.",ok:true},{t:"Nada: un año archivado se lee tan rápido como uno reciente, porque la tabla sabe dónde están sus archivos.",near:true},{t:"El derecho a borrarlos: una vez archivados, deben guardarse para siempre, más allá de siete años."}],
    why:"El nivel de archivo es el lugar más barato para guardar datos, y el más lento para leer: un archivo ahí no se lee hasta traerlo de vuelta, lo que tarda horas. La tabla sabe qué archivos están archivados, así que una consulta dice cuáles traer; eso no los hace rápidos. Para registros de pago que se leen de vez en cuando, en una auditoría, es un trato justo. Donde trabajas, ¿qué se guarda años pero casi no se lee?"},
  "years":{q:"Siete años después de que termina el contrato de Linh, su registro de pago se borra. ¿Qué decide que sean siete años?",
    opts:[{t:"La plataforma: el nivel de archivo borra solo cualquier archivo que lleve siete años guardado."},{t:"La ley y el negocio, y la regla queda escrita en el contrato de los registros de pago.",ok:true},{t:"Cuán seguido se lee: cuando nadie lo ha leído en un tiempo, el registro se puede borrar.",near:true}],
    why:"Cuán seguido se leen los datos decide dónde se guardan; cuánto tiempo se guardan lo fijan la ley y el negocio. La ley australiana pide guardar los registros de pago siete años, y la regla queda en el contrato de los datos, así que el borrado corre en una fecha fijada de antemano. Donde trabajas, ¿quién decide cuánto tiempo se guarda cada tipo de dato?"}
  }}};
