/* Learning Data: "Pausa para pensar" para Too good to be true, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (night, tuesdays, level, reload), con una pregunta cada vez. Cada "stop"
   es el laboratorio de esta película que enseña la misma idea; el data-labs de .player dice dónde están. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Omitir",lab:"Prueba la idea en un laboratorio",off:"Quitar las pausas",right:"Correcto.",wrong:"No exactamente.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "night":{stop:"tests",q:"Cada ID era único y cada campo estaba lleno. ¿Por qué el total salió mal?",
    opts:[{t:"Esa noche las pruebas de filas estaban desactivadas."},{t:"Cada copia era una fila válida: solo una prueba sobre el total, o sobre la clave de negocio, ve que sobran.",ok:true},{t:"La plataforma agregó las copias por su cuenta."}],
    why:"Las pruebas de filas miran una fila a la vez, y cada copia pasó. Una prueba sobre el total ve el salto; una prueba de unicidad sobre solicitante, carrera e ingreso ve los pares."},
  "tuesdays":{stop:"levels",q:"La advertencia se disparó, y se tomó la misma decisión equivocada. ¿Por qué?",
    opts:[{t:"Una advertencia deja pasar la cifra: solo sirve si alguien responsable la lee a tiempo.",ok:true},{t:"La advertencia fue al canal equivocado."},{t:"Las advertencias son solo para cambios pequeños."}],
    why:"Una advertencia es una nota, no un freno. Un error mantuvo la cifra del lunes, etiquetada, y la decisión esperó un día: mejor vieja y etiquetada que fresca y equivocada."},
  "level":{stop:"levels",q:"¿Por qué no convertir cada prueba en un error?",
    opts:[{t:"Los errores tardan más en ejecutarse."},{t:"Los picos reales, como los cierres de solicitudes, también se detendrían: datos buenos retenidos, y alarmas que la gente aprende a ignorar.",ok:true},{t:"Solo el negocio puede definir un error."}],
    why:"Elige el nivel según lo que costaría una cifra equivocada. Advierte lo que merece una mirada; detén lo que no debe llegar a una decisión."},
  "reload":{stop:"fix",q:"¿Por qué la plataforma no borra simplemente las copias de sus propias tablas?",
    opts:[{t:"Las tablas Delta no pueden borrar filas."},{t:"Las copias están en el origen: se corrigen ahí y se vuelve a cargar la semana, así la plataforma coincide con el origen y todos reciben la corrección.",ok:true},{t:"Borrar es más lento que recargar."}],
    why:"Se corrige una vez, en el origen. Después la plataforma reemplaza la semana afectada, y el viaje en el tiempo muestra el antes y el después."}}}};
