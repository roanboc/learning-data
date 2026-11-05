/* Learning Data: "Pausa para pensar" de Un agente en el equipo, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (skills, evidence, shortcut, ship), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "skills":{stop:"rule",q:"¿Por qué guardar las reglas y las skills del agente como archivos en el proyecto, y no en un prompt largo?",
    opts:[{t:"Los archivos están versionados, se revisan en pull requests como el código, y los lee igual cada persona y cada agente.",ok:true},{t:"Los archivos cargan más rápido que un prompt, así que el agente lee sus reglas antes de cada paso sin ir más lento.",near:true},{t:"Los archivos son privados de cada agente, así que ninguna otra persona ni agente puede cambiar sus reglas por error."}],
    why:"Un prompt vive en una sesión y cambia sin que nadie lo vea. AGENTS.md y los archivos de skills cambian por pull request, y todos leen la misma versión."},
  "evidence":{stop:"claims",q:"¿Qué convierte una afirmación sobre los datos en una suposición?",
    opts:[{t:"Tener consulta, pero no la firma del dueño.",near:true},{t:"Venir de un agente, no de una persona."},{t:"No tener al lado ni consulta ni resultado.",ok:true}],
    why:"Quien revisa puede volver a ejecutar una consulta; no puede volver a ejecutar una frase. Incluso un número correcto, sin su consulta, es una suposición."},
  "shortcut":{stop:"review",q:"La conciliación falló. ¿De quién es la decisión de cambiar lo que espera la prueba?",
    opts:[{t:"Del agente, si escribe la razón y una persona aprueba el pull request.",near:true},{t:"De la dueña de la prueba (Planificación, en su meta), con la razón por escrito.",ok:true},{t:"Del equipo de datos, porque la prueba corre en su propia compilación."}],
    why:"Nunca del agente. Aquí lo esperado era correcto y el código estaba mal: el informe del censo decía 3, y 3 era verdad."},
  "ship":{stop:"review",q:"La CI está en verde. ¿Por qué igual aprueba una persona?",
    opts:[{t:"La CI verifica lo que alguien pensó en escribir. Una persona verifica qué significa el cambio.",ok:true},{t:"La CI no ve los datos, así que una persona corre las pruebas en producción primero.",near:true},{t:"Para que el cambio tenga un dueño a quien culpar si sale mal."}],
    why:"Si la comparación era la esperada, si el modelo sigue diciendo lo acordado, y si aprobó el dueño correcto: ninguna verificación escrita de antemano puede juzgar eso."}
  }}};
