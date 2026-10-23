/* Learning Data: "Pausa para pensar" de Lists everyone uses, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (typed, home, change, people), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Los labs y las situaciones son de la serie, para todas sus películas
   (assets/master-and-reference-data/), así que ninguna pregunta tiene "stop"; el .player data-labs de la página lleva a ellos. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "typed":{q:"Un conteo de personas por país muestra el país de Linh tres veces. ¿Por qué?",
    opts:[{t:"Vivió en tres países."},{t:"Tres sistemas escriben su país de tres formas, «Vietnam», «Viet Nam» y «VN», y ninguna lista compartida dice que son un solo valor.",ok:true},{t:"El conteo suma a cada persona una vez por cada sistema."}],
    why:"Cada sistema escribió su propia lista de países, así que un país tiene tres grafías, y un conteo agrupa por grafía. Una sola lista de países, con un código para cada uno, lo deja en una fila. ¿Dónde has visto lo mismo escrito de dos formas en un mismo reporte?"},
  "home":{q:"RR. HH. llama al rol de Linh «Casual Academic», nómina «CAS» y la plataforma de aprendizaje «tutor». ¿Qué hace el mapeo de Jun?",
    opts:[{t:"Cambia el nombre del rol a «tutor» en todos los sistemas."},{t:"Anota que el nombre de cada sistema significa un valor de la lista, «tutor», así cada sistema puede mantener su propio nombre.",ok:true},{t:"Borra los nombres que no coinciden."}],
    why:"Los sistemas mantienen sus propios códigos. La lista guarda el único valor que todos significan, con su responsable y la fecha desde la que aplica, y el mapeo dice qué nombre significa qué, así nadie tiene que cambiar un sistema para ponerse de acuerdo en un significado. En tu organización, ¿quién sería responsable de cada tipo de rol?"},
  "change":{q:"El nuevo nombre del rol que usa RR. HH. rige desde el 1 de enero. ¿Por qué el nombre antiguo se cierra, y no se borra?",
    opts:[{t:"Borrarlo rompería la hoja de cálculo."},{t:"Los contratos anteriores de Linh aún lo usan, así que sigue siendo válido para las fechas en que aplicó.",ok:true},{t:"RR. HH. podría cambiar de opinión."}],
    why:"Los valores de una lista tienen fechas: cada uno aplica desde un día, y puede terminar un día, así los registros antiguos se siguen leyendo bien. El cambio llega como un pull request, y el responsable del valor, RR. HH. para «tutor», lo aprueba antes de que aplique. ¿Qué lista que conozcas cambió un nombre con los años?"},
  "people":{q:"¿Por qué el formulario deja de pedir un tratamiento, Mr, Mrs, Miss, Ms o Mx?",
    opts:[{t:"Los tratamientos ocupan demasiado espacio."},{t:"Un tratamiento puede revelar si una persona está casada, y la universidad no lo necesita, así que no se pregunta.",ok:true},{t:"Solo se puede elegir un tratamiento."}],
    why:"Las listas sobre personas se mantienen cortas e inclusivas, y cada una se pide solo con un propósito, como el género que el gobierno pide a las universidades informar, con una línea para otro término y la opción de no decirlo. Piensa en un formulario que llenaste: ¿qué pregunta no tenía un propósito que pudieras ver?"}
  }}};
