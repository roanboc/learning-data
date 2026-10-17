/* Learning Data: "Pausa para pensar" de One person, many roles, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (four, apart, keeps, entities), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "four":{q:"Linh le avisó al sistema de estudiantes su nuevo correo. ¿Por qué su certificado y su recibo de sueldo siguen llegando al correo familiar?",
    opts:[{t:"El sistema de estudiantes perdió el cambio."},{t:"Cada sistema guarda su propio registro de ella, y nada les dice a los demás que son la misma persona.",ok:true},{t:"Minh volvió a poner el correo de antes."}],
    why:"Cuatro sistemas guardan cada uno un rol: una estudiante, una usuaria de la plataforma, una clienta, una tutora. Ninguno guarda a la persona, así que un cambio que se le avisa a uno nunca llega a los demás. ¿Cuáles de tus propios datos tendrías que cambiar en más de un lugar?"},
  "apart":{q:"Linh y Minh pueden compartir el correo familiar, pero nunca un número de estudiante. ¿Por qué?",
    opts:[{t:"Un correo importa menos que un número."},{t:"Un punto de contacto es una forma de llegar a las personas, y dos pueden compartirlo; un identificador lo emite un sistema para nombrar un solo registro.",ok:true},{t:"El sistema de estudiantes no guarda correos."}],
    why:"Un punto de contacto tiene un propósito, y un correo familiar o una dirección pueden ser de dos personas. Un identificador pertenece al sistema que lo emitió, para nombrar exactamente un registro, así que si dos personas lo comparten, siempre es un error. ¿Qué podría salir mal si lo compartieran?"},
  "keeps":{q:"El nombre legal de Linh, su nombre preferido y sus datos laborales la describen a ella. ¿Por qué cada uno tiene un responsable distinto?",
    opts:[{t:"Cada sistema quiere su propia copia."},{t:"Cada dato es confiable donde se crea y se verifica: la oficina de registro para su nombre legal, Linh para su nombre preferido, RR. HH. para sus datos laborales.",ok:true},{t:"El registro de la persona no puede guardar nombres."}],
    why:"Quién mantiene qué se decide dato por dato, no sistema por sistema, y la oficina de Mei cuida si dos registros son uno. Piensa en una organización que te conoce de dos maneras, como cliente y como empleado, por ejemplo. ¿Quién mantiene tu nombre ahí, y quién se enteraría si lo cambiaras?"},
  "entities":{q:"Los medidores de una empresa de energía están en su sistema de activos, en el de facturación y en la app de sus cuadrillas, y un medidor equivocado da una factura equivocada. ¿Qué dicen las cuatro preguntas?",
    opts:[{t:"Una transacción: cada medidor se lee todos los meses."},{t:"Dato maestro: algo de lo que trata la empresa, que usa más de un proceso, que se guarda en más de un lugar, y que importa cuando las copias no coinciden.",ok:true},{t:"Datos de referencia: los medidores son solo una lista."}],
    why:"Cuatro síes: dato maestro. Una lectura es una transacción, y una lista de tipos de medidor serían datos de referencia, pero el medidor en sí es una de las cosas de las que trata la empresa. Elige una organización que conozcas: nombra algo que debería gestionar como dato maestro, una lista que sea de referencia, y un hecho que sea una transacción."}
  }}};
