/* Learning Data: "Pausa para pensar" de Qué lo hace el mismo, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (profile, sets, apart, hash), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "profile":{stop:"claims",q:"¿Por qué guardar la consulta junto a cada afirmación sobre los datos?",
    opts:[{t:"Para que la afirmación se vea más técnica."},{t:"Para que cualquiera pueda ejecutarla de nuevo y ver el mismo resultado.",ok:true},{t:"Porque la consulta es más rápida que preguntarle al equipo de la fuente."}],
    why:"Una afirmación sin su consulta es una suposición, y quien revisa la trata como tal. Con la consulta y su resultado, cualquiera puede comprobarla, hoy o el año que viene."},
  "sets":{stop:"same",q:"S-20417 en la plataforma y S-20417 en el sistema de estudiantes: ¿siempre el mismo estudiante?",
    opts:[{t:"Sí: el mismo ID es la misma persona."},{t:"Solo si el campo de la plataforma de verdad contiene el ID de estudiante, y se escribió bien.",ok:true},{t:"No: las claves de dos sistemas nunca coinciden."}],
    why:"Primero califica cada clave con su conjunto de claves, para que nada se confunda por accidente. Luego decide por una regla, o por una persona cuando no se puede confiar en la regla."},
  "apart":{stop:"same",q:"Todas las pruebas pasaron. ¿Cómo se coló la unión equivocada?",
    opts:[{t:"Se desactivó una prueba."},{t:"Ninguna prueba sabía que eran dos personas distintas, hasta que una persona lo escribió.",ok:true},{t:"Las pruebas corrieron sobre datos viejos."}],
    why:"Las pruebas solo comprueban lo que está escrito. La decisión de Mei se volvió una fila de datos, el código la lee, y ahora una prueba falla si las dos se vuelven a unir."},
  "hash":{stop:"hash",q:"¿Por qué guardar la clave legible junto al hash?",
    opts:[{t:"Por si cambia la función de hash."},{t:"Un hash no se puede leer ni comprobar a simple vista; la clave al lado lleva cualquier fila de vuelta a su fuente.",ok:true},{t:"Porque los hashes chocan seguido."}],
    why:"0905e6e2… no le dice nada a nadie. SIS|S-20417 al lado se puede leer, comprobar contra la fuente, y volver a pasar por el hash para probar que coincide."}
  }}};
