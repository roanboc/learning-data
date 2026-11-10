/* Learning Data: "Pausa para pensar" de No secret to lose, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (ladder, climb, people), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs del módulo llegan más adelante, como un solo conjunto, así que
   ninguna pregunta tiene "stop" todavía, y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "ladder":{q:"¿Por qué la meta son los dos peldaños de arriba, y no un certificado?",
    opts:[{t:"La clave de un certificado sale en cada entrada, así que se puede copiar en el camino.",near:true},{t:"En los dos de arriba, la plataforma crea un pase por ejecución, y nadie guarda un secreto.",ok:true},{t:"En los dos de arriba, un pase no tiene fecha de fin, así que nunca hay que renovar nada."}],
    why:"En los dos peldaños de arriba, la plataforma crea un pase nuevo en cada ejecución; nadie lo ve ni lo guarda, y vence antes de una hora. La clave de un certificado nunca sale del proceso, por eso está por encima de un secreto en una bóveda, pero la clave sigue guardada en algún sitio, y hay que renovarla antes de que venza. ¿Cuáles de tus procesos aún guardan un secreto en algún sitio?"},
  "climb":{q:"Jun pasa a otro equipo. ¿Por qué no se rompe nada?",
    opts:[{t:"Sam le da al nuevo equipo el token de Jun, así que el proceso entra igual que antes."},{t:"El proceso ahora entra con un token propio, que Sam creó antes de que Jun se fuera.",near:true},{t:"El proceso entra con su propia identidad, con los permisos del rol de carga, no los de Jun.",ok:true}],
    why:"El proceso corre como registrar-loader, la plataforma responde por él, y sus permisos vienen del rol de carga, así que nunca dependió de Jun. Un token propio del proceso estaría un peldaño por encima del de Jun, pero seguiría siendo papel al portador que alguien tiene que guardar. ¿A nombre de quién corren tus procesos programados?"},
  "people":{q:"Una página falsa se ve igual que la de la universidad. ¿Qué forma de entrar no le da nada que pueda usar?",
    opts:[{t:"Una llave de acceso: se queda en tu dispositivo, y solo responde al sitio real.",ok:true},{t:"Una app en tu teléfono: su código cambia cada pocos segundos, así que no sirve.",near:true},{t:"Una contraseña larga: una página falsa no puede adivinarla, así que no entra como tú."}],
    why:"Una llave de acceso solo responde al sitio real, así que una página falsa no obtiene nada que pueda usar. El código de una app, o tu sí, puede pasarlo la página falsa en los segundos en que vale; un código por SMS, igual; y una contraseña escrita en la página simplemente se entrega. ¿Cómo entras hoy al trabajo?"}
  }}};
