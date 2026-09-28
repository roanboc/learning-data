/* Learning Data: "Pausa para pensar" de Built to write, built to read, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (ledger, wrong, read, side), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "ledger":{stop:"faster",q:"El diario anota cada asiento en orden de tiempo; el mayor guarda los mismos asientos, agrupados por cuenta. ¿Por qué llevar los dos?",
    opts:[{t:"Por si se pierde uno de los libros."},{t:"Cada forma facilita un trabajo: el diario, escribir cada asiento cuando ocurre; el mayor, leer y cuadrar una cuenta.",ok:true},{t:"El mayor es una copia más ordenada, y el diario se podría tirar."}],
    why:"Un conjunto de hechos, dos formas, dos trabajos. Y como cada asiento se pasa dos veces, el balance detecta una cifra mal copiada en un lado (aunque no un asiento que falte por completo)."},
  "wrong":{stop:"update",q:"Su nombre estaba guardado en tres filas de títulos, y solo se corrigieron dos. ¿Qué habría evitado la copia que se pasó por alto?",
    opts:[{t:"Revisar cada fila con más cuidado después de un cambio."},{t:"Guardar el nombre una sola vez, en el registro del aprendiz, con cada título apuntando al aprendiz.",ok:true},{t:"Corregir las filas en otro orden."}],
    why:"Cuando un dato vive en un solo lugar, no hay copia que pasar por alto. Para eso sirve la normalización, en una forma hecha para escribir."},
  "read":{stop:"grain",q:"La pregunta es: créditos por tipo de credencial y por mes. ¿Cuáles son los hechos, y cuáles las dimensiones?",
    opts:[{t:"Los hechos son el tipo y el mes; la dimensión son los créditos."},{t:"El hecho son los créditos; las dimensiones, el tipo de credencial y el mes.",ok:true},{t:"Los tres son hechos."}],
    why:"Los hechos son lo que sumas; las dimensiones, las palabras que van después de «por». Los créditos se suman, por tipo y por mes."},
  "side":{stop:"faster",q:"Corregir el nombre de una facultad es una edición en la forma normalizada, y miles de filas en la estrella. ¿Está mal diseñada la estrella?",
    opts:[{t:"Sí: también debería guardar el nombre una sola vez."},{t:"No: repite el nombre a propósito, para que leer necesite menos joins. El precio se paga cuando cambian los nombres, con una recarga.",ok:true},{t:"No: en una estrella los nombres nunca cambian."}],
    why:"Cada forma es rápida en su propio trabajo. La estrella cambia lecturas baratas por correcciones más caras, y por eso las dos formas se mantienen lado a lado, a partir de un mismo modelo."}
  }}};
