/* Learning Data: "Pausa para pensar" de Promesas y pruebas, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (gaps, enterprise, tests, levels), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "gaps":{stop:"decide",q:"¿Por qué “aceptar y documentar” es una decisión real, y no rendirse?",
    opts:[{t:"No lo es: significa que la brecha era demasiado difícil de corregir."},{t:"La toma el responsable, con una razón, y le dice a cada consumidor lo que los datos no pueden hacer.",ok:true},{t:"Es algo provisorio hasta que alguien escriba una regla."}],
    why:"Brecha 10: ninguna fuente registra un vencimiento, así que nada en el modelo puede decir que una credencial venció, y el registro lo dice. Una brecha no escrita sorprende a alguien después."},
  "enterprise":{stop:"contract",q:"¿Quién puede cambiar un contrato público, y cómo?",
    opts:[{t:"Cualquiera que necesite cambiar una columna, editando el YAML."},{t:"Su responsable, con una versión nueva junto a la anterior, y una fecha para retirar la anterior.",ok:true},{t:"Nadie: un contrato público no puede cambiar nunca."}],
    why:"Un cambio que rompe no se edita en el lugar: llega como versión nueva, y los consumidores se mueven a su ritmo. Una película posterior muestra cómo."},
  "tests":{stop:"catch",q:"¿Por qué escribir las pruebas antes que el modelo?",
    opts:[{t:"Para tener algo que ejecutar mientras se escribe el SQL."},{t:"Dicen qué es estar terminado, de una forma que una máquina puede verificar; el trabajo del código es ponerlas en verde.",ok:true},{t:"Porque dbt no construye un modelo sin sus pruebas."}],
    why:"Escritas primero, y revisadas por los responsables de los datos, las pruebas fijan qué significa terminado. Nadie puede redefinirlo en silencio para que encaje con el código."},
  "levels":{stop:"levels",q:"¿Quién fija la severidad de una prueba?",
    opts:[{t:"La persona cuya construcción queda bloqueada."},{t:"El responsable de los datos, con una razón, escrita en la descripción de la prueba y en el registro de decisiones.",ok:true},{t:"Nadie: toda prueba que falla detiene la construcción."}],
    why:"Aquí decidió el equipo de aprendizaje: advertir si hay alguna inscripción sin correo, detener si hay más de cinco. No la persona cuya construcción se bloquea."}
  }}};
