/* Learning Data: las palabras de la visita guiada ("?" en el encabezado), en español. tour.js muestra, en este orden, cada paso cuya
   parte (sel) está en la página y a la vista, así que la misma lista sirve para todas; un paso sin sel se muestra siempre. */
window.LD_TOUR_STEPS={
 text:{name:"Cómo funciona este sitio",next:"Siguiente",back:"Atrás",done:"Listo",close:"Cerrar la visita",of:"{n} de {of}"},
 steps:[
  {sel:"header.top nav",title:"Tres lugares",text:"Empieza aquí muestra la introducción. Temas reúne todo lo demás. Cómo se hizo cuenta cómo se hacen las películas."},
  {sel:".player",title:"La película",text:"Pulsa Reproducir. Los botones bajo la película saltan a cualquier capítulo."},
  {sel:"#think",title:"Pausa para pensar",text:"Si está activa, la película se detiene al final de los capítulos con una pregunta. Desactívala para verla de corrido."},
  {sel:"#cc",title:"Subtítulos",text:"Activa o desactiva los subtítulos. En las páginas en español están en español."},
  {sel:"nav.course .path",title:"Los pasos de una película",text:"Mira la película y luego prueba lo que ofrece: labs para desarmarla, situaciones para ponerte a prueba. Aquí se ve lo que ya hiciste."},
  {sel:".view-switch",title:"Dos vistas",text:"La ruta de aprendizaje muestra cómo se conectan los temas. La lista muestra cada tema en una fila, con un buscador."},
  {sel:".route .r-goals",title:"Elige una meta",text:"Una meta ilumina una ruta corta y numera sus paradas. Toda la ruta vuelve a mostrarlo todo."},
  {sel:".route .r-map, .route .r-rail",title:"La ruta",text:"Cada estación es un tema. Elige una para ver sus películas y series. Su anillo se llena a medida que ves."},
  {sel:"#ix-q",title:"Busca lo que dicen las películas",text:"Escribe una palabra. Los resultados nombran la película y las frases que la dicen, y cada frase abre la película en ese segundo."},
  {sel:".list-view .ix-group",title:"Una fila por tema",text:"Abre una fila para ver para quién es el tema, y sus películas y series."},
  {sel:".more .lang",title:"Español o inglés",text:"Cada página tiene ambos. Las películas están en inglés, con subtítulos en español, y algunas tienen sonido en español."},
  {sel:".nav-tools .theme",title:"Oscuro o claro",text:"Cambia el aspecto. Tu elección se recuerda en este dispositivo."},
  {title:"Tu progreso se queda contigo",text:"Lo que ves y respondes se guarda solo en este navegador. No se envía a ningún lado."}
 ]};
