/* Learning Data: "Pausa para pensar" de A reason to keep it, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (six, yes, newuse), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  six:{q:"RR. HH. guarda los datos bancarios de Linh. ¿Cuál de las seis razones lo permite?",
    opts:[{t:"Su consentimiento: los escribió en el formulario al postularse.",near:true},{t:"Un contrato: RR. HH. los necesita para pagarle por su trabajo.",ok:true},{t:"Un interés legítimo: a nómina le resulta útil tenerlos a mano."}],
    why:"RR. HH. emplea a Linh y le paga, así que sus datos bancarios se basan en su contrato: sin ellos, no podría pagarle. Sí los escribió en el formulario de 2023, pero dar un dato no es aceptarlo, y su no no habría detenido su pago, así que el consentimiento no es la razón. ¿Qué datos de tu trabajo se basan en un contrato?"},
  yes:{q:"¿Por qué “Acepto que la universidad use mis datos personales para fines de RR. HH.” era la razón equivocada?",
    opts:[{t:"No decía por cuánto tiempo RR. HH. guardaría sus datos personales.",near:true},{t:"El consentimiento solo se puede pedir una vez contratado el tutor."},{t:"Un no no podía detener lo que la ley y su contrato necesitan.",ok:true}],
    why:"Un sí es una razón solo donde un no es una opción real. Si Linh hubiera dicho que no, RR. HH. igual tendría que guardar sus registros de pago, porque una ley lo exige, y no podría pagarle sin sus datos bancarios, que su contrato necesita. Al formulario antiguo sí le faltaba decir cuánto se guarda cada dato, pero eso es un hueco en lo que se le dijo, no la razón por la que su sí era el equivocado. ¿Dónde pide un formulario que conoces un sí que un no no podría cambiar?"},
  newuse:{q:"Planificación pide las horas de los tutores. ¿Qué hace seguro el sí de Ingrid?",
    opts:[{t:"Horas por asignatura y periodo, las pequeñas juntas, y ningún nombre.",ok:true},{t:"No se comparten nombres, así que las horas de cada asignatura van tal cual.",near:true},{t:"Planificación es parte de la universidad, así que los datos no salen de ella."}],
    why:"El plan de Clara necesita horas por asignatura y periodo lectivo, así que eso es todo lo que recibe: sin nombres, sin sueldos, sin datos bancarios. Quitar los nombres no basta por sí solo: una asignatura con un solo tutor mostraría sus horas, así que las asignaturas pequeñas se cuentan juntas. Quedarse dentro de la universidad no hace que un uso nuevo encaje: la revisión pregunta para qué es. ¿Qué conteos de tu trabajo podrían mostrar a una persona?"}
  }}};
