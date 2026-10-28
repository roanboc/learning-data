/* Learning Data: "Pausa para pensar" de A capability, not a project, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (what, colour, ask), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "what":{q:"Las tres primeras tarjetas de Yusuf eran el equipo de gobernanza, el glosario y la reunión de los responsables de datos. ¿Por qué ninguna se quedó arriba en el mapa?",
    opts:[{t:"El mapa de Noor solo tiene lugar para una tarjeta en la banda de estrategia."},{t:"Cada una es quien hace el trabajo, una aplicación o cómo se hace, y cada una puede cambiar: un equipo se reorganiza, un glosario se reemplaza, una reunión cambia. Lo que sobrevive a las tres es la capacidad: gobernar los datos.",ok:true},{t:"El vicerrector financia herramientas, no equipos."}],
    why:"Una capacidad es qué hay que hacer, lo haga quien lo haga, y sobrevive a una reestructuración, a un sistema nuevo y a un proceso nuevo. Una junta de agua no es sus miembros, ni sus palas: es mantener seca la tierra. Piensa en algo que tu organización siempre debe poder hacer: ¿cómo lo nombrarías sin nombrar un equipo ni un sistema?"},
  "colour":{q:"¿Por qué Cambiar sin sorpresas está en ámbar, y no en verde?",
    opts:[{t:"Nadie la ha puesto en marcha todavía."},{t:"Quién usa qué todavía se escribe a mano: funciona mientras la gente se acuerde de mantenerlo, y nada en el trabajo muestra que funciona.",ok:true},{t:"Cuesta más que las otras capacidades."}],
    why:"Verde es donde el propio trabajo muestra que una capacidad funciona, cada noche, como el control nocturno que encuentra cualquier copia de un término que se ha desviado. Ámbar es donde todavía depende de que la gente se acuerde, y rojo donde aún no pasa nada. Coloreado con evidencia, el mapa muestra adónde debería ir el dinero del próximo año. ¿Cuáles de las tareas de tu equipo estarían en ámbar?"},
  "ask":{q:"Las capacidades están en el mapa. ¿Por qué la universidad también escribe servicios?",
    opts:[{t:"Un servicio es más barato de mantener que una capacidad."},{t:"Nadie pide una capacidad; la gente pide ayuda. Un servicio es lo que puede pedir, nombrado como lo pediría, con una promesa, como un término nuevo decidido en diez días hábiles, y sus usuarios lo revisan cada año.",ok:true},{t:"Los marcos de referencia piden un servicio por cada capacidad."}],
    why:"Clara pregunta qué significa una cifra; Anil pide ver unos datos. Nombrado como lo pedirían, cada servicio dice qué recibe la gente y para cuándo, y, como en las juntas de agua, quien depende de él tiene voz en él. Es también lo que el vicerrector puede leer en una página. ¿Qué le pediría a la gobernanza de datos la gente donde trabajas, con sus propias palabras?"}
  }}};
