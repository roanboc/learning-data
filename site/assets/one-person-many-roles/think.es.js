/* Learning Data: "Pausa para pensar" de One person, many roles, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (five, apart, keeps, entities), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs y las situaciones son de la serie, para todas sus películas
   (assets/master-and-reference-data/), así que ninguna pregunta tiene "stop"; el .player data-labs de la página lleva a ellos. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "five":{q:"La solicitud de Linh le pidió el certificado de notas de un título que le dio la misma universidad. ¿Por qué no lo sabía?",
    opts:[{t:"El título era demasiado antiguo para guardarlo."},{t:"La solicitud le dio un nuevo número de estudiante, y nada lo vinculó con el registro de su título, que está con el número anterior.",ok:true},{t:"Todavía no se había graduado."}],
    why:"Cinco registros guardan a una sola persona, cada uno en su sistema, y el sistema de estudiantes guarda dos de ellos, con dos números. Ninguno guarda a la persona, así que lo que sabe un registro, los demás no lo ven. ¿Alguna vez una organización te pidió algo que ya tenía sobre ti?"},
  "apart":{q:"Linh y su hermano pueden compartir la dirección de su casa, pero nunca un número de estudiante. ¿Por qué?",
    opts:[{t:"Una dirección importa menos que un número."},{t:"Un punto de contacto es una forma de llegar a las personas, y dos pueden compartirlo; un identificador lo emite un sistema para nombrar un solo registro.",ok:true},{t:"El sistema de estudiantes no guarda direcciones."}],
    why:"Un punto de contacto tiene un propósito, y la dirección de una casa puede ser de todos los que viven ahí. Un identificador pertenece al sistema que lo emitió, para nombrar exactamente un registro, así que si dos personas lo comparten, siempre es un error. ¿Qué podría salir mal si lo compartieran?"},
  "keeps":{q:"El nombre legal de Linh, su nombre preferido y sus datos laborales la describen a ella. ¿Por qué cada uno tiene un responsable distinto?",
    opts:[{t:"Cada sistema quiere su propia copia."},{t:"Cada dato es confiable donde se crea y se verifica: la oficina de registro para su nombre legal, Linh para su nombre preferido, RR. HH. para sus datos laborales.",ok:true},{t:"El registro de la persona no puede guardar nombres."}],
    why:"Quién mantiene qué se decide dato por dato, no sistema por sistema, y la oficina de Mei cuida si dos registros son uno. Piensa en una organización que te conoce de dos maneras, como cliente y como empleado, por ejemplo. ¿Quién mantiene tu nombre ahí, y quién se enteraría si lo cambiaras?"},
  "entities":{q:"Los medidores de una empresa de energía están en su sistema de activos, en el de facturación y en la app de sus cuadrillas, y un medidor equivocado da una factura equivocada. ¿Qué dicen las cuatro preguntas?",
    opts:[{t:"Una transacción: cada medidor se lee todos los meses."},{t:"Dato maestro: algo de lo que trata la empresa, que usa más de un proceso, que se guarda en más de un lugar, y que importa cuando las copias no coinciden.",ok:true},{t:"Datos de referencia: los medidores son solo una lista."}],
    why:"Cuatro síes: dato maestro. Una lectura es una transacción, y una lista de tipos de medidor serían datos de referencia, pero el medidor en sí es una de las cosas de las que trata la empresa. Elige una organización que conozcas: nombra algo que debería gestionar como dato maestro, una lista que sea de referencia, y un hecho que sea una transacción."}
  }}};
