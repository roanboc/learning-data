/* Learning Data: "Pausa para pensar" de Un camino para cada proveedor, en español. Las claves van al paso de think.en.js, y las respuestas
   correctas y las casi correctas en los mismos lugares. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un laboratorio",off:"Quitar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  tree:{q:"Un proveedor puede dar sus cambios desde un momento dado, pero no puede decir qué se borró. ¿Qué camino le da el árbol?",
    opts:[{t:"Esperar a que el proveedor sume los borrados, y no tomar sus datos hasta que cumpla la forma preferida."},{t:"Sus cambios cada hora, y su lista completa comparada cada noche con la nuestra para hallar lo borrado.",ok:true},{t:"Sus cambios cada hora, y una persona que quita cualquier reserva que parezca cancelada cuando la ve.",near:true}],
    why:"Los cambios desde un momento cubren lo que se agregó o cambió; solo una lista completa, comparada cada noche, muestra lo que falta. Una persona que busca cancelaciones a ojo se perdería la mayoría, y esperar al proveedor retiene los datos. ¿Cuál de tus fuentes no puede decir qué se borró?"},
  gone:{q:"En la primera semana de clases, la comparación nocturna halló 212 reservas borradas. ¿Por qué le importa a Graham?",
    opts:[{t:"Muestra que la plataforma se construyó mal, porque una plataforma bien hecha nunca guardaría una reserva borrada."},{t:"Muestra que el proveedor del horario rompió su contrato, así que la universidad puede pedir su dinero.",near:true},{t:"Cada una habría mostrado un aula reservada y vacía: una hora que parece perdida, cuando estaba libre.",ok:true}],
    why:"El proveedor cumplió lo que vende: cambios, pero no borrados, hasta su renovación de 2028. La plataforma hizo lo que se le dio. Lo que importa es la página de Graham: 212 horas que habrían parecido reservadas y vacías quedan fuera. ¿Cómo se vería un borrado perdido en tus informes?"},
  paths:{q:"La comparación nocturna de la nómina se detiene si el archivo de una noche es mucho más pequeño que el anterior. ¿Por qué?",
    opts:[{t:"Un camino más débil se revisa más: un archivo cortado daría por idos a empleados que siguen ahí.",ok:true},{t:"Un archivo más pequeño significa que muchos se fueron, así que una persona debe aprobar tantos cambios.",near:true},{t:"El sistema de la nómina es viejo, así que una persona revisa cada archivo nocturno antes de usarlo."}],
    why:"Comparar un archivo entero toma lo que falta como borrado, así que un archivo cortado parece 2400 personas idas. La revisión lo detiene y pregunta a una persona. Una gran caída rara vez son bajas reales, y revisar cada archivo a mano no duraría. ¿Cuál de tus caminos más débiles no tiene un freno?"}
  }}};
