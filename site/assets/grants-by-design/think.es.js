/* Learning Data: "Pausa para pensar" de Grants by design, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de tres capítulos (doors, tomorrow, code), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. Las respuestas correctas, en los mismos lugares que en inglés. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  doors:{q:"La mesa de ayuda tiene SELECT sobre la tabla de estudiantes, y ningún derecho sobre el catálogo del registro ni su estante core. ¿Qué puede leer?",
    opts:[{t:"La tabla de estudiantes: SELECT es el derecho que la lee, se dé donde se dé.",near:true},{t:"La tabla y el resto de core, porque un derecho en una tabla abre su estante."},{t:"Nada: sin USE CATALOG ni USE SCHEMA, su SELECT no abre ninguna puerta.",ok:true}],
    why:"Un grupo lee una tabla solo con los tres derechos: entrar a la sala (USE CATALOG), al estante (USE SCHEMA) y a la tabla (SELECT). SELECT solo no abre nada, como en las islas a un sitio solo se llega desde su desembarcadero, por su sendero. Donde trabajas, ¿quién tiene un derecho sobre una tabla que no lleva a ninguna parte?"},
  tomorrow:{q:"Esta noche el proceso construye una tabla nueva en el estante core del registro. ¿Quién puede leerla mañana por la mañana?",
    opts:[{t:"Cada grupo que lee core, desde su primer minuto: los permisos del estante llegan a ella.",ok:true},{t:"Nadie todavía: su propietario da permiso a cada lector cuando alguien pide la tabla.",near:true},{t:"Todos en la cuenta, porque BROWSE deja que cualquiera la encuentre y vea qué guarda."}],
    why:"Un permiso en un estante llega a cada tabla que hay en él, las de hoy y todas las que se hagan después. Nadie pide y nadie da permisos: la oficina del registro, la mesa de ayuda, Planificación y el estudio la leen desde su primer minuto, y cada uno ve lo que le muestran las políticas. BROWSE deja que todos la encuentren y la pidan, nunca que la lean. Donde trabajas, ¿cuánto espera una tabla nueva a su primer lector?"},
  code:{q:"Planificación necesita leer también el estante reference del registro. ¿Cómo recibe el permiso?",
    opts:[{t:"Sam lo da ahora en Catalog Explorer, y después lo escribe en el archivo.",near:true},{t:"Con un cambio en el archivo del plan, aprobado por el equipo de Mei, desde main.",ok:true},{t:"Lo da quien dirige Planificación, porque un grupo puede pasar lo que puede leer."}],
    why:"El plan se escribe una vez, como código, junto al del proceso: unas pocas líneas para cada estante y sus lectores. Esos archivos son del equipo de Mei, así que el cambio entra solo con su sí, y luego sigue el camino a producción. Nadie puede dar permisos a mano: solo el grupo de propietarios, y su único miembro despliega solo desde main. Donde trabajas, ¿dónde está la lista de quién puede leer qué, y quién aprueba un cambio en ella?"}
  }}};
