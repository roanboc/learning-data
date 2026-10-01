/* Learning Data: "Pausa para pensar" de Construido en capas, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (staging, core, ctes, physical), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "staging":{stop:"layers",q:"¿Por qué no hay joins en staging?",
    opts:[{t:"Los joins son lentos, y los modelos de staging son vistas."},{t:"Un join esconde una decisión (qué registro gana, qué clave coincide) donde nadie la busca. Emparejar es una regla, y las reglas viven en intermediate.",ok:true},{t:"dbt no permite un join en un modelo de staging."}],
    why:"Staging ordena cada fuente una vez, de la misma manera, y cada paso siguiente parte de ahí. Un join en staging esconde una regla de emparejamiento; en intermediate, tiene nombre y pruebas."},
  "core":{stop:"layers",q:"¿Por qué el título se salta intermediate?",
    opts:[{t:"Tiene una sola fuente y nada que resolver: ni claves que emparejar, ni historias que coser.",ok:true},{t:"Los títulos nunca cambian, así que no necesitan pruebas."},{t:"El core solo puede leer modelos de staging."}],
    why:"Un paso que solo deja pasar filas agrega un modelo que mantener y nada que probar. Cuando llegue una segunda fuente de títulos, aparecerá un paso."},
  "ctes":{stop:"ctes",q:"¿Qué te da una CTE de importación?",
    opts:[{t:"Una consulta más rápida: la base de datos lee cada entrada una vez."},{t:"Cada modelo del que depende el archivo, listado arriba, una vez.",ok:true},{t:"Nada: es cuestión de estilo."}],
    why:"Quien revisa ve las entradas antes que la lógica, una referencia no puede esconderse en medio de un join, y cambiar una entrada es cambiar una línea."},
  "physical":{stop:"store",q:"¿Cuándo vale la pena el riesgo de una tabla incremental?",
    opts:[{t:"Siempre: fusionar solo lo que cambió siempre es más barato."},{t:"Cuando la tabla es grande y casi toda queda igual entre corridas.",ok:true},{t:"Nunca: una tabla reconstruida completa siempre es más segura."}],
    why:"El riesgo es que un cambio de lógica no llegue a las filas ya construidas: después de uno, reconstruye completa con --full-refresh, y compara con un build completo. Aquí, con 53 credenciales, está para mostrar el patrón."}
  }}};
