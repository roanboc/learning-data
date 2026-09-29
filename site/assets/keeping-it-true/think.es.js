/* Learning Data: "Pausa para pensar" de Keeping it true, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cinco capítulos (arrives, watch, decide, e2e, remains), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "arrives":{stop:"drift",q:"Una medida nueva muestra tres cifras distintas en tres tableros. ¿Cuál es la razón más probable?",
    opts:[{t:"Uno de los tableros tiene un error."},{t:"Cada tablero calcula su propia definición de la medida.",ok:true},{t:"Los datos llegaron tarde a dos de ellos."}],
    why:"Tres cifras para una medida suelen significar tres definiciones, cada una bien calculada. Eso es deriva: lo que se usa se separó de lo escrito."},
  "watch":{stop:"drift",q:"¿Por qué notar la deriva es un buen primer trabajo para un agente de IA?",
    opts:[{t:"Puede decidir qué definición es la correcta."},{t:"Puede leer cada consulta, definición y valor nuevo, sin cansarse, y mostrar la evidencia.",ok:true},{t:"Puede cambiar los tableros por su cuenta."}],
    why:"Notar es tedioso para las personas y barato para las máquinas. Decidir qué significa cada cosa para la organización sigue siendo tarea de las personas."},
  "decide":{stop:"review",q:"El borrador del agente cambia el glosario, el modelo y las pruebas. ¿Quién lo aprueba?",
    opts:[{t:"El agente, porque lo redactó."},{t:"Los responsables: del significado, del modelo y de la construcción.",ok:true},{t:"Nadie: con las pruebas basta."}],
    why:"El agente recomienda; las personas aprueban; las pruebas comprueban el resultado. Cada capa tiene un responsable que aprueba su parte."},
  "e2e":{stop:"chain",q:"Este año se redefinió la tasa de finalización. ¿Qué pasa con el informe del año pasado?",
    opts:[{t:"Se recalcula con la nueva definición, y se reemplaza."},{t:"Conserva su cifra, que se lee con la versión de la definición del año pasado.",ok:true},{t:"Se retira, porque ya no coincide."}],
    why:"Cada cifra conserva el significado que tenía. Las versiones mantienen verdaderos los informes antiguos, y permiten recalcularlos al lado de los nuevos cuando hace falta comparar."},
  "remains":{stop:"remains",q:"Llega un patrón de modelado nuevo, que promete cambiarlo todo. ¿Qué deberías preguntarle primero?",
    opts:[{t:"Si es más nuevo que lo que usamos ahora."},{t:"Cómo guarda el significado, la identidad, el grano y el tiempo.",ok:true},{t:"Si un agente de IA puede generarlo por nosotros."}],
    why:"Cada forma es otra manera de escribir las mismas cuatro respuestas. Cómo las guarda un patrón te dice qué conserva bien y qué sacrifica."}
  }}};
