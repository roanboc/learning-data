/* Learning Data: "Pausa para pensar" de Why it moves, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (means, goals, principles), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "means":{q:"«Un tercio de los postes tiene más de cincuenta años». ¿Qué convierte un impulsor en una evaluación como esta?",
    opts:[{t:"Averiguar qué significa el impulsor aquí, con una fuente para la evidencia.",ok:true},{t:"Una opinión firme de alguien con cargo alto."},{t:"Ponerlo en una diapositiva."}],
    why:"Un impulsor, como los activos que envejecen, no dice nada hasta que alguien averigua qué significa aquí, y cada evaluación tiene una fuente. Sin la evidencia, es solo una opinión."},
  "goals":{q:"«Mantener las facturas asequibles» es una meta. ¿Qué la convierte en algo que cualquiera puede comprobar?",
    opts:[{t:"Repetirla en cada plan."},{t:"Pasársela a un comité."},{t:"Un resultado con una cifra y una fecha: el cargo de red en la factura de un hogar, no más alto en términos reales en 2030.",ok:true}],
    why:"Una meta es una dirección; un resultado dice cómo sabrá cualquiera que se alcanzó. Si nadie puede decir cómo se comprobará un resultado, todavía no lo es. Toma una de tus metas: ¿qué resultado la mostraría, y quién podría comprobarlo?"},
  "principles":{q:"¿Por qué «Ser sostenibles» no es un principio?",
    opts:[{t:"Es demasiado largo."},{t:"Ninguna decisión podría incumplirlo, así que no sirve para elegir.",ok:true},{t:"La sostenibilidad es una meta, no un valor."}],
    why:"Un principio es una regla contra la que se compara cada decisión. Comparada con los tres de Ama, la línea nueva no es la primera opción; mejorar la línea vieja, con baterías en el valle, sí. ¿Alguna decisión podría incumplir uno de tus principios?"}
  }}};
