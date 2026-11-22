/* Learning Data: las palabras de la visita guiada ("?" en el encabezado), en español. tour.js muestra, en este orden, cada paso cuya
   parte (sel) está en la página y a la vista, así que la misma lista sirve para todas; un paso sin sel se muestra siempre. */
window.LD_TOUR_STEPS={
 text:{name:"Cómo funciona este sitio",next:"Siguiente",back:"Atrás",done:"Listo",close:"Cerrar la visita",of:"{n} de {of}"},
 steps:[
  {sel:"header.top nav",title:"Dos lugares",text:"Empieza aquí muestra la introducción. Temas reúne todo lo demás."},
  {sel:"header.top .proj",title:"El proyecto de datos de ejemplo",text:"La caja abre el proyecto detrás de muchas películas: su mapa, sus archivos y cómo ejecutarlo."},
  {sel:".sbar",title:"Dónde está esta película",text:"Su lugar en la serie. Cada paso es una película: verde cuando ya la viste. Elige una para ir a ella."},
  {sel:".seen",title:"Marcar como vista",text:"Tu avance queda en este navegador. ¿La viste en otro dispositivo? Márcala aquí."},
  {sel:".player",title:"La película",text:"Pulsa Reproducir. Los botones bajo la película saltan a cualquier capítulo."},
  {sel:"#think",title:"Pausa para pensar",text:"Si está activa, la película se detiene al final de los capítulos con una pregunta. Desactívala para verla de corrido."},
  {sel:"#cc",title:"Subtítulos",text:"Activa o desactiva los subtítulos. En las páginas en español están en español."},
  {sel:"nav.course .path",title:"Los pasos de una película",text:"Mira la película y luego prueba lo que ofrece: labs para desarmarla, situaciones para ponerte a prueba. Aquí se ve lo que ya hiciste."},
  {sel:".cont",title:"Sigue",text:"Te lleva a la siguiente película que no has visto."},
  {sel:".pmx",title:"La práctica de un vistazo",text:"Una línea de íconos: labs vistos, situaciones respondidas y respuestas correctas."},
  {sel:".tp-you",title:"Tu avance",text:"Cuatro íconos: películas vistas, labs vistos, situaciones respondidas y respuestas correctas. Sigue lleva a la próxima película que no has visto."},
  {sel:".route .r-map",title:"La ruta",text:"Cada estación es un tema, en el orden para aprenderlos. Su anillo se llena a medida que ves, y la próxima parada va marcada. Elige una para abrir su fila abajo."},
  {sel:"#ix-q",title:"Busca lo que dicen las películas",text:"Escribe una palabra. Los resultados nombran la película y las frases que la dicen, y cada frase abre la película en ese segundo."},
  {sel:".tp-goal",title:"Elige una meta",text:"Una meta numera sus películas y series, abre sus temas y atenúa el resto, aquí y en el mapa."},
  {sel:".tp-hide",title:"Solo esta ruta",text:"Oculta los temas, películas y series que no están en el camino de la meta, aquí y en el mapa."},
  {sel:".tp-cards",title:"Una ficha por serie",text:"Los íconos muestran lo que has hecho en ella, y la palabra debajo lo que sigue: Empieza, Sigue o repasa."},
  {sel:".list-view .ix-group",title:"Una fila por tema",text:"Abre una fila para ver para quién es el tema, y sus películas y series."},
  {sel:".px-lenses",title:"Mira qué se une dónde",text:"Cada lente ilumina un tipo de contexto en las piezas a las que se une: responsables, datos personales, promesas, verificaciones o una persona."},
  {sel:".px-foot",title:"Sigue una pregunta",text:"Pulsa Reproducir, o arrastra por los doce pasos. El mapa va a cada pieza, y el panel muestra el archivo real que hay detrás."},
  {sel:".px-expand",title:"Espacio para leer",text:"Abre más los detalles junto al mapa, para leer entera una tabla o un archivo. Púlsalo otra vez para devolverle el espacio al mapa."},
  {sel:".px-cx-bar",title:"Agrega el contexto",text:"Cada interruptor suma una pieza del contexto del negocio. Mira qué preguntas responde."},
  {sel:".px-stabs",title:"Estándares abiertos, línea a línea",text:"Elige un estándar y luego una nota: ilumina las líneas del archivo real que explica."},
  {sel:".more .lang",title:"Español o inglés",text:"Cada página tiene ambos. Las películas están en inglés, con subtítulos en español, y algunas tienen sonido en español."},
  {sel:".nav-tools .theme",title:"Oscuro o claro",text:"Cambia el aspecto. Tu elección se recuerda en este dispositivo."},
  {sel:".nav-tools .extra-btn, .more-btn",title:"Más opciones",text:"Cómo se hizo muestra cómo se hacen las películas. Aquí también: learn-all.org y el autor."},
  {title:"Tu progreso se queda contigo",text:"Lo que ves y respondes se guarda solo en este navegador. No se envía a ningún lado."}
 ]};
