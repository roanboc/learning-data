/* Learning Data: "Pausa para pensar" de Silent change, en español (Latinoamérica). Mantén las claves iguales a think.en.js.
   La película está en inglés; las preguntas, las respuestas y los nombres de los capítulos están en español.
   Cada "stop" es el lab de La vida interior de los datos que enseña la misma idea. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Omitir",lab:"Prueba la idea en un lab",off:"Quitar las pausas",right:"Correcto.",wrong:"No exactamente.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "night":{stop:"refine",q:"La prueba falló a las 2:40 de la madrugada. ¿Por qué nadie tuvo que despertarse?",
    opts:[{t:"La actualización siguió, y las filas nuevas se marcaron para revisarlas en la mañana.",near:true},{t:"La actualización se detuvo y quedaron las cifras buenas de ayer, marcadas como de ayer.",ok:true},{t:"La prueba corrigió los datos por sí sola, así que las cifras estaban bien al amanecer."}],
    why:"Una prueba que falla detiene todo lo que sigue, así que quedan los últimos datos buenos, con un aviso que dice su antigüedad. No le llegó a nadie nada incorrecto, así que la alerta podía esperar hasta la mañana."},
  "bronze":{stop:"capture",q:"Bronce guardó las filas con el nuevo estado. ¿Por qué es mejor que descartarlas?",
    opts:[{t:"No se pierde nada: las filas pasan directo a los dashboards, marcadas con el estado nuevo que traen.",near:true},{t:"Databricks no puede borrar filas de una tabla una vez que se cargaron en ella."},{t:"No se pierde nada: cuando el nuevo estado tiene un significado, la plataforma reconstruye a partir de lo que llegó.",ok:true}],
    why:"Bronce guarda lo que llegó, incluso un valor que nada más adelante entiende todavía. Después de la corrección, plata y oro se reconstruyen desde ahí, sin pedirle al sistema de estudiantes que vuelva a enviar los datos."},
  "halves":{stop:"meaning",q:"¿Quién debe decidir si un estudiante en lista de espera cuenta como inscrito?",
    opts:[{t:"Quien responde, en el negocio, por lo que significa “inscrito”.",ok:true},{t:"El equipo que agregó el estado nuevo al sistema de origen.",near:true},{t:"El equipo de datos que encontró el problema esa noche."}],
    why:"Lo que significa un valor es una decisión de negocio. El equipo de Ben sabía qué cambió y el de Sam puede construir la regla, pero solo quien es responsable de la definición puede decir qué cuenta. Mei decidió: inscrito significa tener un lugar a la fecha de corte."},
  "contract":{stop:"gold",q:"¿Cuándo se revisa un contrato de datos?",
    opts:[{t:"En cada cambio propuesto, antes de publicarlo, pero no en las cargas.",near:true},{t:"En cada carga, y en cada cambio propuesto antes de publicarlo.",ok:true},{t:"Solo cuando falla una prueba, para ver qué lado lo rompió."}],
    why:"Un contrato solo ayuda si se sigue revisando. La plataforma revisa cada carga, y el entorno de pruebas del sistema de estudiantes revisa cada cambio propuesto antes de publicarlo. Así el siguiente cambio llegó a ambos lados como una conversación, no como una sorpresa."}}}};
