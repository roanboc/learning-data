/* Learning Data: "Pausa para pensar" de Governed in Unity Catalog, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (tag, key, groups), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "tag":{q:"Una tabla nueva para otro equipo tiene un correo, y su modelo no clasifica la columna. ¿Qué pasa?",
    opts:[{t:"La política la enmascara igual, porque parece un correo."},{t:"El control de gobernanza falla en su solicitud de cambio: no puede fusionarse hasta que la columna tenga una clase, así que la tabla nunca llega a la plataforma sin su etiqueta.",ok:true},{t:"El clasificador de la plataforma la etiqueta como directa por sí solo."}],
    why:"La política se guía por la etiqueta, no por cómo se ve una columna: una columna sin etiqueta mostraría sus valores. Por eso el proyecto no deja entrar un modelo que leen otros equipos sin una clase en cada columna, y la construcción escribe la etiqueta. Para las tablas que el proyecto no construye, el clasificador de la plataforma sugiere, y su dueño las clasifica. En tu trabajo, ¿qué tablas podrían tener datos personales sin nada que lo diga?"},
  "key":{q:"El código de estudiante sigue siendo personal. ¿Por qué la política no muestra asteriscos en él también?",
    opts:[{t:"Planificación cuenta y une estudiantes con él, sin nombres, y los asteriscos lo impedirían. Por eso lo protege quién puede leer la tabla, para qué y hasta cuándo.",ok:true},{t:"Porque un código codificado no se puede asociar con nadie."},{t:"Porque la política solo enmascara las columnas que tienen nombres."}],
    why:"Codificado no es anónimo: con la lista de la oficina de registro, cualquiera podría codificar cada número y hacerlo coincidir. Así que el código sigue siendo personal, y leerlo pide un propósito y una fecha de fin, como el acceso de Clara, por un grupo. Los asteriscos lo ocultarían justo del conteo para el que se guarda. En tus datos, ¿qué columnas están codificadas, y quién podría hacerlas coincidir?"},
  "groups":{q:"Clara pasa a Finanzas en enero. ¿Qué pasa con su acceso a la tabla de estudiantes?",
    opts:[{t:"Lo conserva hasta que alguien se lo quite a mano."},{t:"Los grupos de Finanzas reciben su acceso a la tabla de estudiantes."},{t:"Ya terminó el 15 de diciembre, con su lugar en el grupo. Y cada vez que alguien cambia de puesto, el directorio lo saca de los grupos de su equipo anterior, y el acceso en la plataforma lo sigue.",ok:true}],
    why:"El acceso va a grupos, y la fecha de fin se guarda donde están los miembros del grupo, en el directorio de la universidad, que la plataforma lee. Nadie tiene que acordarse de quitarlo: los nueve que cambiaron de puesto conservaron el suyo porque el acceso antiguo se daba a personas, a mano. En tu trabajo, ¿cómo termina el acceso de alguien que cambia de puesto?"}
  }}};
