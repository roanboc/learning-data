/* Learning Data: "Pausa para pensar" de Why it moves, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (means, goals, principles), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). El "stop" de una pregunta es el lab de la serie que abre, en la
   página de labs de la serie (el .player data-labs de la página es "../labs/"); una pregunta sin él no tiene enlace a un lab. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "means":{stop:"chain",q:"«Un tercio de los postes tiene más de cincuenta años». ¿Qué convierte un impulsor en una evaluación como esta?",
    opts:[{t:"Averiguar qué significa el impulsor aquí, con una fuente para la evidencia.",ok:true},{t:"Averiguar qué significa el impulsor aquí, según lo que espera la dirección.",near:true},{t:"Poner el impulsor en la diapositiva de estrategia, para que lo vea el directorio."}],
    why:"Un impulsor, como los activos que envejecen, no dice nada hasta que alguien averigua qué significa aquí, y cada evaluación tiene una fuente. Sin la evidencia, es solo una opinión."},
  "goals":{stop:"chain",q:"«Mantener las facturas asequibles» es una meta. ¿Qué la convierte en algo que cualquiera puede comprobar?",
    opts:[{t:"Pasársela a un comité que informa sobre ella al directorio una vez al año."},{t:"Un resultado con una cifra y una fecha: el cargo de red en la factura de un hogar, no más alto en términos reales en 2030.",ok:true},{t:"Un resultado con una cifra: el cargo de red en la factura de un hogar, tan bajo como se pueda, año a año.",near:true}],
    why:"Una meta es una dirección; un resultado dice cómo sabrá cualquiera que se alcanzó. Si nadie puede decir cómo se comprobará un resultado, todavía no lo es. Toma una de tus metas: ¿qué resultado la mostraría, y quién podría comprobarlo?"},
  "principles":{stop:"chain",q:"¿Por qué «Ser sostenibles» no es un principio?",
    opts:[{t:"Es muy amplio para un equipo, así que necesita un dueño."},{t:"Es una meta, así que primero necesita una cifra y una fecha.",near:true},{t:"Ninguna decisión podría incumplirlo, así que no sirve para elegir.",ok:true}],
    why:"Un principio es una regla contra la que se compara cada decisión. Comparada con los tres de Ama, la línea nueva no es la primera opción; mejorar la línea vieja, con baterías en el valle, sí. ¿Alguna decisión podría incumplir uno de tus principios?"}
  }}};
