/* Learning Data: "Pausa y piensa" para Quién hizo qué, en español. Mantén las claves al paso de think.en.js.
   La película se detiene al final de tres capítulos (store, night, copy), con una pregunta cada uno. think.js las muestra,
   y las lista de nuevo en "Piénsalo" (#think-list). Los labs del módulo llegan después, juntos, así que ninguna pregunta
   tiene "stop" todavía, y el data-labs del .player de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa y piensa",kicker:"Pausa y piensa",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Quitar las pausas",right:"Correcto.",wrong:"No exactamente.",start:"Reproducir con pausas para pensar",answer:"Respuesta:",watch:"Mira esta parte"},
  qs:{
  store:{q:"¿Por qué cada registro va a un almacén que guarda el equipo de seguridad, con una copia bloqueada?",
    opts:[{t:"Porque la plataforma borra su tabla de auditoría a los 90 días, y la revisión necesita una copia.",near:true},{t:"Para que dure más que la memoria de cada herramienta, y nadie de quienes registra pueda cambiarlo.",ok:true},{t:"Para que el equipo de la plataforma limpie los registros viejos cuando la revisión los apruebe."}],
    why:"Cada herramienta guarda su registro por su propio tiempo: la plataforma un año, GitHub seis meses y sus subidas de código una semana, el directorio un mes. Enviados al escribirse a un almacén aparte, con una copia bloqueada un año, los registros duran más que todas, y nadie de quienes registran puede cambiarlos. La plataforma guarda su propia tabla un año, no 90 días. ¿Dónde viven los registros de tu plataforma, y quién podría cambiarlos?"},
  night:{q:"¿Por qué la guardia termina las sesiones de Jun antes de leer qué hizo la copia?",
    opts:[{t:"Quien tiene la copia es Jun hasta que termine, así que cada minuto abierta todavía puede actuar.",ok:true},{t:"Porque terminar las sesiones también borra todo lo que la copia se llevó de GitHub esa noche."},{t:"Porque el almacén recibe el registro de una sesión solo cuando esa sesión ya ha terminado.",near:true}],
    why:"Una sesión copiada es papel al portador: quien la tiene es Jun hasta que termine, así que leer primero deja la puerta abierta mientras lees. Los registros no esperan a que termine la sesión: cada uno se envía al escribirse. Y terminar una sesión no recupera nada de lo que ya se copió. En tu equipo, ¿quién puede terminar de noche todas las sesiones de una persona?"},
  copy:{q:"Una tabla se borró por error hace tres semanas y nadie lo notó. ¿Qué la recupera?",
    opts:[{t:"Su propio historial, porque una tabla puede volver a cualquier versión que haya tenido.",near:true},{t:"Una cuenta de emergencia, porque su poder siempre está encendido y no necesita aprobación."},{t:"Una copia bloqueada de antes del error, guardada 30 días donde nadie podía borrarla.",ok:true}],
    why:"El historial de una tabla deshace errores durante siete días; después, sus versiones viejas se limpian. Las copias de cada noche van a un lugar aparte y quedan bloqueadas 30 días, así que una copia de antes del error sigue ahí, y nadie pudo borrarla. Una cuenta de emergencia deja entrar a alguien; no recupera nada. ¿Cuándo restauró tu equipo una copia por última vez, y la comprobó?"}
  }}};
