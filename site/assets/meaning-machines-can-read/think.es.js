/* Learning Data: "Pausa para pensar" de Meaning machines can read, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cinco capítulos (before, guesses, four, model, standards), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "before":{stop:"standard",q:"Wilkins intentó clasificar todo el universo. La lista de causas de muerte se hizo para que hospitales y países pudieran comparar. ¿Por qué perduró la lista?",
    opts:[{t:"Era más fácil de imprimir y enviar que los libros de Wilkins, así que más gente la conservó."},{t:"Se hizo para un propósito, y la compartían quienes necesitaban comparar.",ok:true},{t:"Se hizo para todos los propósitos a la vez, así que cualquiera hallaba ahí su causa.",near:true}],
    why:"Las definiciones compartidas permiten que desconocidos comparen, y perduran cuando sirven a un propósito para el que la gente las sigue usando. Una clasificación de todo no le sirve a nadie en particular."},
  "guesses":{stop:"ground",q:"Genie leyó las tablas, la política y una página web antigua, y aun así dio la cifra equivocada. ¿Qué faltaba?",
    opts:[{t:"Una definición gestionada de la regla de apilamiento, con un responsable y una versión.",ok:true},{t:"Más documentos para leer, para que Genie pudiera comparar más fuentes de la regla."},{t:"Una página web más nueva con la regla de apilamiento, para que Genie no leyera la vieja.",near:true}],
    why:"Genie podía leer los documentos, pero no coincidían, y nada decía cuál estaba vigente. El significado fuera de un glosario gestionado puede contradecirse, o estar mal."},
  "four":{stop:"layers",q:"¿Dónde va «un diplomado de posgrado acepta hasta cuatro microcredenciales aprobadas»?",
    opts:[{t:"En la capa semántica."},{t:"En el glosario.",near:true},{t:"En la ontología.",ok:true}],
    why:"Es una relación con un límite y una condición: una regla que una máquina puede comprobar. El glosario explica palabras; la capa semántica calcula cifras."},
  "model":{stop:"follow",q:"El glosario, el modelo conceptual y la ontología describen microcredencial. ¿Qué evita que se separen?",
    opts:[{t:"Que cada equipo mantenga su copia con cuidado, y las comparen una vez al año."},{t:"Que cada concepto se escriba una sola vez, en el mapa de arquitectura, y cada vista se tome de él.",ok:true},{t:"Que la ontología sea la maestra, y el glosario y el modelo se copien de ella a mano.",near:true}],
    why:"Un mapa, muchas vistas. La definición, las relaciones y las reglas se escriben una sola vez, con sus responsables; el glosario, los modelos, la ontología en OWL y las pruebas se toman del mapa, en un solo sentido, así que coinciden."},
  "standards":{stop:"standard",q:"Tres definiciones oficiales de microcredencial no coinciden del todo. ¿Qué haces?",
    opts:[{t:"Elegir una a propósito, relacionar las otras con ella, y registrar las diferencias.",ok:true},{t:"Elegir la más nueva, relacionar las otras con ella, y descartar las diferencias.",near:true},{t:"Ignorar las tres, y escribir la tuya, la que mejor le sirva a la universidad."}],
    why:"Revisar, adoptar, extender, registrar. Un estándar ahorra empezar de cero, pero solo una elección deliberada, y escrita, mantiene las cifras comparables."}
  }}};
