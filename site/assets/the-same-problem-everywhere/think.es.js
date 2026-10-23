/* Learning Data: "Pausa para pensar" de The same problem, everywhere, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (written, first, machines), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "written":{q:"¿Por qué la gobernanza está en el centro de la rueda del DMBOK?",
    opts:[{t:"Porque es el área más antigua de la gestión de datos."},{t:"Porque las demás áreas solo encajan, y se mantienen en equilibrio, cuando alguien tiene autoridad para decidir.",ok:true},{t:"Porque la gobernanza es la herramienta sobre la que funcionan las demás áreas."}],
    why:"La arquitectura, el modelado, la seguridad, la calidad y los metadatos tiran cada uno para su lado. Sin alguien con autoridad para decidir, cada área toma sus propias decisiones y se van separando, como las líneas de negocio del banco en 2008, cada una con sus nombres para los mismos clientes. Donde trabajas, ¿quién decide cuando dos áreas no están de acuerdo?"},
  "first":{q:"Diez años después de los principios de los bancos, ¿por qué tan pocos de los bancos más grandes los cumplían todos?",
    opts:[{t:"Los principios pedían una tecnología que los bancos aún no tenían."},{t:"Sus programas solían tener poco presupuesto, poco alcance y poca atención de sus juntas directivas.",ok:true},{t:"La mayoría de los bancos había decidido que los principios no aplicaban para ellos."}],
    why:"Los reguladores también encontraron sistemas antiguos y trabajo manual, pero los sistemas no eran toda la historia: que los datos cuadren requiere decisiones, dinero y atención de la alta dirección. En tu organización, ¿quién de la alta dirección responde por sus datos?"},
  "machines":{q:"¿Qué pide la ley europea de IA sobre los datos con que aprende la IA?",
    opts:[{t:"Que los sistemas de IA aprendan solo de datos creados por quienes los hacen."},{t:"Gobernanza de los datos con que aprenden los sistemas de alto riesgo.",ok:true},{t:"Nada: la ley cubre lo que hacen los sistemas de IA, no sus datos."}],
    why:"Una máquina aprende lo que sus datos le enseñen, así que quienes la entrenan deben preguntarse de dónde salieron los datos y quién decidió que podían usarlos. En 2024, el DMBOK agregó gobernanza y ética para la IA, y se está escribiendo una tercera edición. Si tu equipo entrenara un modelo mañana, ¿quién decidiría con qué datos puede aprender?"}
  }}};
