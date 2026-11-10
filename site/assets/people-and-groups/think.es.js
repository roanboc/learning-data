/* Learning Data: "Pausa para pensar" de People and groups, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (directory, power, tokens), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs del módulo llegan más adelante, como un solo conjunto, así que
   ninguna pregunta tiene "stop" todavía, y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  directory:{q:"Alguien de la oficina del registro pasa a Finanzas. ¿Qué cambia Sam en la plataforma?",
    opts:[{t:"Lo pasa al grupo de Finanzas en Databricks, y el directorio copia el cambio."},{t:"Nada: la plataforma copia el directorio cada noche, así que se mueve para la mañana.",near:true},{t:"Nada: el directorio cambia sus grupos, y la plataforma los lee cuando entra.",ok:true}],
    why:"Los grupos se cambian en un solo lugar, el directorio, y Databricks vuelve a leer los grupos de una persona cada vez que entra, así que el cambio no pide nada en la plataforma. No espera a una copia nocturna; y un grupo del directorio no se puede cambiar en Databricks. ¿Dónde se registra en tu trabajo un cambio de equipo?"},
  power:{q:"Jun tiene que restaurar una tabla esta tarde. ¿Qué hace?",
    opts:[{t:"Enciende el grupo de tablas desde su cuenta de administrador, dice por qué, y Sam aprueba.",ok:true},{t:"Entra con su cuenta de administrador, que sigue en el grupo de tablas, lista para esto.",near:true},{t:"Le pide a Sam que ponga su cuenta de todos los días en el grupo de tablas por la tarde."}],
    why:"El poder de administrador vive en grupos en los que nadie está. La cuenta de administrador de Jun solo es apta para admin_table_restorers: la enciende para la tarea, da el motivo, Sam aprueba, y se apaga sola. Una cuenta de administrador que sigue en el grupo es poder permanente, la llave que dura más que la estancia; y su cuenta de todos los días nunca recibe poder de administrador. ¿Quién en tu equipo tiene poder de administrador ahora mismo, y desde cuándo?"},
  tokens:{q:"¿Por qué los seis pueden anular sus tokens personales sin perder nada?",
    opts:[{t:"Sam le da a cada uno un token propio del proceso, guardado en una bóveda y cambiado cada mes."},{t:"Su línea de comandos ahora entra por el navegador, y guarda sus propios pases breves.",ok:true},{t:"Ahora cada uno recibe un token que vence en una hora, y lo pega en la línea de comandos.",near:true}],
    why:"La CLI de Databricks entra por el navegador, con la misma llave de acceso, y guarda sus propios pases, de una hora, en el almacén seguro del equipo: nada que copiar ni pegar. Los pases breves están bien, pero nadie los maneja; y un token propio del proceso es para el proceso, no para las personas. ¿Qué herramientas de tu portátil aún te piden pegar un token?"}
  }}};
