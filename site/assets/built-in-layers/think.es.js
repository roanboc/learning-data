/* Learning Data: "Pausa para pensar" de Construido en capas, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (staging, core, ctes, physical), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "staging":{stop:"layers",q:"¿Por qué no hay joins en staging?",
    opts:[{t:"Un join va en staging solo si las dos tablas vienen de la misma fuente, porque así no esconde ninguna decisión; entre fuentes, va a intermediate.",near:true},{t:"Los modelos de staging son vistas, y un join en una vista corre en cada lectura, así que los joins esperan al core, donde las tablas se construyen cada noche."},{t:"Un join esconde una decisión (qué registro gana, qué clave coincide) donde nadie la busca. Emparejar es una regla, y las reglas viven en intermediate.",ok:true}],
    why:"Staging ordena cada fuente una vez, de la misma manera, y cada paso siguiente parte de ahí. Un join en staging esconde una regla de emparejamiento; en intermediate, tiene nombre y pruebas."},
  "core":{stop:"layers",q:"¿Por qué el título se salta intermediate?",
    opts:[{t:"Los títulos son definitivos al emitirse, así que el core los lee directo de la fuente."},{t:"Tiene una sola fuente y nada que resolver: ni claves que emparejar, ni historiales que coser.",ok:true},{t:"Tiene una sola fuente, así que no necesita pruebas: nada puede contradecir a un solo sistema.",near:true}],
    why:"Un paso que solo deja pasar filas agrega un modelo que mantener y nada que probar. Cuando llegue una segunda fuente de títulos, aparecerá un paso."},
  "ctes":{stop:"ctes",q:"¿Qué te da una CTE de importación?",
    opts:[{t:"Cada modelo del que depende el archivo, listado arriba, una vez.",ok:true},{t:"Una consulta más rápida: la base lee cada entrada una vez.",near:true},{t:"Una prueba de cada entrada, que corre antes de la lógica."}],
    why:"Quien revisa ve las entradas antes que la lógica, una referencia no puede esconderse en medio de un join, y cambiar una entrada es cambiar una línea."},
  "physical":{stop:"store",q:"¿Cuándo vale la pena el riesgo de una tabla incremental?",
    opts:[{t:"Cuando la tabla es grande y casi todas sus filas cambian en cada corrida.",near:true},{t:"Siempre: fusionar solo lo que cambió es más barato, sea cual sea el tamaño."},{t:"Cuando la tabla es grande y casi toda queda igual entre corridas.",ok:true}],
    why:"El riesgo es que un cambio de lógica no llegue a las filas ya construidas: después de uno, reconstruye completa con --full-refresh, y compara con un build completo. Aquí, con 53 credenciales, está para mostrar el patrón."}
  }}};
