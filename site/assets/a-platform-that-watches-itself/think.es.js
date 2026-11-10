/* Learning Data: "Pause and think" for A platform that watches itself, in Spanish. Keep the keys in step with think.en.js.
   The film stops at the end of three chapters (watch, approve, contract), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  watch:{q:"La tarea de horas falló a las 22:03. Al amanecer, ¿qué espera en la bandeja de Sam?",
    opts:[{t:"Una alerta por cada tarea y tabla que falló, cada una con su registro, para que Sam llegue a una causa."},{t:"Un hallazgo: el fallo, su causa seguida por el linaje, lo que toca, y un arreglo para que lo revise una persona.",ok:true},{t:"Un hallazgo: el fallo, su causa seguida por el linaje, lo que toca, y el arreglo que ya aplicó en producción.",near:true}],
    why:"Genie ZeroOps agrupa en un solo hallazgo lo que rompe una causa: qué falló, la causa que siguió por el linaje (el cambio de la app en las horas, a las 15:02), lo que toca el fallo (las horas para el sistema de nómina, la exportación de nómina y el costo de la docencia ocasional) y un arreglo propuesto. No cambia datos ni código de producción sin la revisión de una persona. ¿Adónde se iría la primera hora de rastreo de tu equipo sin linaje?"},
  approve:{q:"Sam pidió el arreglo en una rama nueva y abrió la solicitud de cambio. ¿Quién la aprueba para producción?",
    opts:[{t:"Sam, que contrastó la causa con las horas, pidió la rama y abrió la solicitud de cambio.",near:true},{t:"Genie ZeroOps, cuando pasan las pruebas de la solicitud, porque halló la causa y escribió el arreglo."},{t:"Noor, que no escribió el cambio, una vez que Sam lo revisó y pasan las pruebas de la solicitud.",ok:true}],
    why:"Sam revisó la propuesta del agente y es el autor de la solicitud, así que la aprueba otra persona: Noor, a las 9:05, por el mismo camino que todo cambio. Un agente nunca aprueba, por bueno que sea su arreglo. ¿Quién aprueba un cambio a producción donde trabajas, y es alguna vez el autor del propio cambio?"},
  contract:{q:"¿Qué evita que la misma noche vuelva con el próximo cambio de la app?",
    opts:[{t:"La dueña de los datos de la app cambia primero su contrato, y así quienes leen las horas lo saben antes.",ok:true},{t:"La plataforma lee las horas en cualquier forma que envíe la app, y la tarea nunca vuelve a fallar por ellas.",near:true},{t:"Genie ZeroOps vigila más de cerca la tarea de horas, y encuentra el próximo fallo unos minutos antes."}],
    why:"El arreglo resolvió la noche: la plataforma lee 1:30 como 1.5. Pero el próximo cambio puede ser en otro campo, y solo el contrato les dice a todos los que leen las horas qué guarda cada campo. Por eso la solicitud de Sam le pide a Ingrid Holm, dueña de esos datos, cambiar primero el contrato la próxima vez, como cambió la lista de verificación del Apolo para las misiones siguientes. ¿Cuál de tus fuentes podría cambiar lo que guarda un campo sin avisarte?"}
  }}};
