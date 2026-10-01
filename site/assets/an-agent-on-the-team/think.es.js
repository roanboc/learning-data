/* Learning Data: "Pausa para pensar" de Un agente en el equipo, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (skills, evidence, shortcut, ship), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "skills":{stop:"rule",q:"¿Por qué guardar las reglas y las skills del agente como archivos en el proyecto, y no en un prompt largo?",
    opts:[{t:"Los archivos son más cortos que los prompts."},{t:"Los archivos están versionados, se revisan en pull requests como el código, y los lee igual cada persona y cada agente.",ok:true},{t:"Los agentes no pueden leer prompts."}],
    why:"Un prompt vive en una sesión y cambia sin que nadie lo vea. AGENTS.md y los archivos de skills cambian por pull request, y todos leen la misma versión."},
  "evidence":{stop:"claims",q:"¿Qué convierte una afirmación sobre los datos en una suposición?",
    opts:[{t:"Estar equivocada."},{t:"No tener al lado ni consulta ni resultado.",ok:true},{t:"Venir de un agente."}],
    why:"Quien revisa puede volver a ejecutar una consulta; no puede volver a ejecutar una frase. Incluso un número correcto, sin su consulta, es una suposición."},
  "shortcut":{stop:"review",q:"La conciliación falló. ¿De quién es la decisión de cambiar lo que espera la prueba?",
    opts:[{t:"Del agente: encontró la falla."},{t:"De la dueña de la prueba (Planificación, en su meta), con la razón por escrito.",ok:true},{t:"De quien arregle la compilación más rápido."}],
    why:"Nunca del agente. Aquí lo esperado era correcto y el código estaba mal: el informe del censo decía 3, y 3 era verdad."},
  "ship":{stop:"review",q:"La CI está en verde. ¿Por qué igual aprueba una persona?",
    opts:[{t:"La CI a veces se equivoca."},{t:"La CI verifica lo que alguien pensó en escribir. Una persona verifica qué significa el cambio.",ok:true},{t:"Solo para que alguien cargue con la culpa."}],
    why:"Si la comparación era la esperada, si el modelo sigue diciendo lo acordado, y si aprobó el dueño correcto: ninguna verificación escrita de antemano puede juzgar eso."}
  }}};
