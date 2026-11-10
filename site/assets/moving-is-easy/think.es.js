/* Learning Data: "Pausa para pensar" de Moving is easy, agreeing is the work, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (promise, ways, contract), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "promise":{q:"Eventos, mensajes y lotes tienen nombre desde 2003. ¿Qué cambió desde entonces?",
    opts:[{t:"Sus nombres: las herramientas los llaman distinto, así que el libro ya no sirve."},{t:"Los patrones: los eventos reemplazaron a los lotes, y nadie envía archivos completos.",near:true},{t:"Lo poco que cuesta moverlos: las herramientas hacen lo que antes hacían equipos.",ok:true}],
    why:"Eventos, mensajes y lotes son las ideas que Hohpe y Woolf nombraron en 2003, y el sistema de RR. HH. todavía envía ambas formas: cada cambio en cuanto se hace, y su archivo completo cada periodo lectivo. Lo que cambió es el trabajo: un conector gestionado hoy lee solo lo que cambió, reintenta y no pierde su lugar, donde antes un equipo lo construía a mano. ¿Qué formas envía tu sistema más ocupado?"},
  "ways":{q:"El libro mayor de Finanzas se lee en su sitio, sin copiarlo. ¿Cuándo recomienda la documentación un conector?",
    opts:[{t:"Cuando el libro mayor tiene datos personales, así que hay que copiarlo para gobernarlo."},{t:"Para grandes volúmenes o respuestas rápidas, cuando leer el otro sistema cada vez es lento.",ok:true},{t:"Cuando Finanzas quiere cambiar el libro mayor, ya que una consulta en su sitio solo lee.",near:true}],
    why:"Una consulta en su sitio lee el sistema financiero donde vive el libro mayor y no cambia nada, así que no hay copia que mantener al día; ninguna de las dos cambia el libro mayor, que Finanzas lleva en su propio sistema. Para grandes volúmenes, o respuestas que deben llegar rápido, la documentación recomienda un conector gestionado, que trae los datos una vez y luego solo lo que cambió. ¿Cuál de tus fuentes se lee tanto que convendría traerla?"},
  "contract":{q:"RR. HH. borra un contrato cancelado. ¿Por qué el contrato de datos de su sistema dice que el borrado llega como un cambio, con su hora?",
    opts:[{t:"Para que la plataforma sepa que se canceló, y cuándo, y pueda cerrarlo y conservar su historial.",ok:true},{t:"Para que la plataforma también borre la fila, y los dos sistemas queden exactamente iguales.",near:true},{t:"Porque una fila que falta significa lo mismo, así que el próximo archivo lo mostraría igual."}],
    why:"Una fila que solo falta en el próximo archivo puede ser un contrato cancelado, una exportación que falló o un filtro que alguien cambió. Enviado como un cambio con su hora, el borrado dice qué pasó y cuándo, así que la plataforma cierra el contrato, lo marca como no vigente y conserva su historial para quien pregunte después. ¿Cómo llega hoy un borrado a tu plataforma?"}
  }}};
