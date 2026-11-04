/* Learning Data: "Pausa para pensar" de Skills and workflows, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (skill, workflow, night), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "skill":{q:"¿Por qué Jun hace la tarea una vez más a mano antes de escribir la skill?",
    opts:[{t:"Para mostrarle al agente lo rápido que lo hace una persona."},{t:"Para que la skill guarde los pasos y las causas que enseñó la tarea real, no una suposición sobre ellos.",ok:true},{t:"Porque un agente no puede leer un archivo que no escribió."}],
    why:"Como las formas de al-Juarismi, aprendidas en casos reales, una skill vale lo que le enseñó la tarea detrás de ella: sus pasos, y cada causa vista hasta ahora, con quién la resolvió. El agente lee solo el nombre y la línea de cada skill hasta que una tarea necesita los pasos. ¿Qué tarea haces tan seguido que escribirla una vez le ahorraría un día a la próxima persona?"},
  "workflow":{q:"Cada noche, el conteo se construye, se prueba y se compara con el informe del censo. ¿Dónde va el agente en esa tarea?",
    opts:[{t:"En cada paso, para que detecte cualquier cosa rara."},{t:"Solo cuando las cifras no coinciden, como un paso más, para averiguar por qué; decide una persona.",ok:true},{t:"En ninguna parte: con un flujo de trabajo, nunca hace falta un agente."}],
    why:"Los pasos conocidos funcionan mejor como pasos simples: siempre de la misma forma, más baratos y fáciles de comprobar. Hace falta pensar solo cuando el conteo y el informe del censo difieren y nadie sabe aún por qué. Incluso entonces, el agente hace el borrador; decide una persona. ¿Qué paso de tu trabajo se hace a criterio cuando bastarían pasos simples?"},
  "night":{q:"La noche del 21 de octubre, ninguna de las causas de la skill explica los catorce registros de más. ¿Qué pasa después?",
    opts:[{t:"El agente los deja fuera, y se lo cuenta al equipo en la mañana."},{t:"El agente pregunta en su informe; Mei decide; Jun agrega la causa a la skill y un paso fijo con una prueba; Noor aprueba.",ok:true},{t:"El flujo de trabajo se detiene hasta que alguien escriba una skill nueva."}],
    why:"El agente busca y pregunta, en su sandbox; nunca decide qué cuenta. Una persona resuelve la causa nueva, queda escrita en la skill, y como la regla ya se conoce, se vuelve un paso simple: la noche siguiente no se llama a ningún agente. Cada caso nuevo, escrito una vez, nunca se resuelve dos veces. ¿Dónde está escrita la última causa que resolvió tu equipo?"}
  }}};
