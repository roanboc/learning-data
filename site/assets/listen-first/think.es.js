/* Learning Data: "Pause and think" for Listen first, in Spanish. Keep the keys in step with think.en.js.
   The film stops at the end of three chapters (ask, count, layers), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  ask:{q:"Helena hace las mismas tres preguntas a las 31 personas. ¿Por qué las mismas tres cada vez?",
    opts:[{t:"Para que cada conversación sea corta, y las 31 quepan en sus primeras seis semanas."},{t:"Para poner las respuestas lado a lado, y ver patrones que ninguna charla sola mostraría.",ok:true},{t:"Para poner las respuestas lado a lado, y ver cuáles de las 31 personas se equivocan.",near:true}],
    why:"Las mismas preguntas, hechas a todos, dan respuestas que puede poner lado a lado. La solicitud lenta de una persona es una historia; once vías para pedir, vistas en 31 respuestas, son un patrón. Nadie se equivoca: cada uno tiene razón en lo que ve. ¿Qué le preguntarías a todas las personas con quienes trabajas?"},
  count:{q:"La gente le dijo a Helena que las solicitudes eran lentas. ¿Por qué cuenta también desde el gestor de incidencias?",
    opts:[{t:"Las personas muestran dónde duele; el gestor, cuánto: 41 días hábiles, en promedio, hasta el primer uso.",ok:true},{t:"El gestor muestra dónde duele; las personas, cuánto, porque saben bien cuánto tiempo esperaron.",near:true},{t:"Las respuestas de la gente no son confiables, así que en la situación actual solo entran los números."}],
    why:"Necesita las dos cosas. Las personas muestran dónde duele, con sus propias palabras; los sistemas muestran cuánto: 41 días hábiles de la solicitud al primer uso, y 17 informes que nadie abrió en un año. Ninguna de las dos sola da la situación actual. ¿Qué cuenta uno de tus sistemas que nadie ha mirado?"},
  layers:{q:"Ingrid dijo: «Nuestra lista de personal está bien. Son las copias». ¿Dónde van las tres copias en la situación actual?",
    opts:[{t:"En la capa de aplicación, porque cada copia de la lista vive en uno de los sistemas de la universidad.",near:true},{t:"En la capa de tecnología, porque las copias se guardan en los servidores propios y en la nube."},{t:"En la capa de información, que dice qué es cada dato, dónde nace y en qué lugares se copia.",ok:true}],
    why:"La capa de información dice de qué tratan los datos, dónde nace cada uno y dónde se copia: los datos del personal nacen en Recursos Humanos, y se copian dos veces. Los sistemas que guardan las copias están en la capa de aplicación, a su lado. Por eso Helena le da a la información una capa propia: ahí se ven los problemas de los datos. ¿Qué datos tuyos viven en más de una copia?"}
  }}};
