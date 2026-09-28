/* Learning Data: "Pausa para pensar" de Meaning machines can read, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (before, guesses, four, standards), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "before":{stop:"standard",q:"Wilkins intentó clasificar todo el universo. La lista de causas de muerte se hizo para que hospitales y países pudieran comparar. ¿Por qué perduró la lista?",
    opts:[{t:"Era más fácil de imprimir."},{t:"Se hizo para un propósito, y la compartían quienes necesitaban comparar.",ok:true},{t:"Las categorías de Wilkins estaban mal."}],
    why:"Las definiciones compartidas permiten que desconocidos comparen, y perduran cuando sirven a un propósito para el que la gente las sigue usando. Una clasificación de todo no le sirve a nadie en particular."},
  "guesses":{stop:"ground",q:"Genie encontró las tablas correctas y aun así dio la cifra equivocada. ¿Qué faltaba?",
    opts:[{t:"Una base de datos más rápida."},{t:"La regla de apilamiento, en una forma que pudiera leer.",ok:true},{t:"Más filas de datos."}],
    why:"La regla vivía en un documento de política que ninguna herramienta lee. Un asistente responde con lo que puede leer, así que adivinó a partir de los nombres de las columnas."},
  "four":{stop:"layers",q:"¿Dónde va «un diplomado de posgrado acepta hasta cuatro microcredenciales aprobadas»?",
    opts:[{t:"En el glosario."},{t:"En la ontología.",ok:true},{t:"En la capa semántica."}],
    why:"Es una relación con un límite y una condición: una regla que una máquina puede comprobar. El glosario explica palabras; la capa semántica calcula cifras."},
  "standards":{stop:"standard",q:"Tres definiciones oficiales de microcredencial no coinciden del todo. ¿Qué haces?",
    opts:[{t:"Usar la más nueva en todas partes, sin decirlo."},{t:"Elegir una a propósito, relacionar las otras con ella, y registrar las diferencias.",ok:true},{t:"Ignorar las tres, y escribir la tuya."}],
    why:"Revisar, adoptar, extender, registrar. Un estándar ahorra empezar de cero, pero solo una elección deliberada, y escrita, mantiene las cifras comparables."}
  }}};
