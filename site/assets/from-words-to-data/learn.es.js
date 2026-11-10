/* Learning Data: From words to data, in Spanish: the series' one pack of labs (training) and scenarios
   (evaluation), for all its films: one lab for each film's main idea, and one situation for each lab. Keep the keys in step with
   learn.en.js. Each lab and each situation is its film's own: assets/from-words-to-data/learn.js loads that film's
   words (assets/<film>/learn.es.js: the lab by its id, the situation by its place "q" in the film's qs) and its bundle, for the
   film's own pictures, only when a visitor opens it. Each lab starts with id, kind, film, chapter, c, name, and each situation with
   type, n, lab, film, as site-tools/build_series.py's series_learn() reads them. */
window.FW={lang:"es",store:"ld-from-words-to-data",
ui:{lab:"Lab",of:"de",inPractice:"En la práctica",watch:"Ver esta parte",next:"Siguiente:",makeCall:"Tú decides →",
  scenario:"Situación",score:"Puntaje",answered:"respondidas",toGo:"por responder",good:"Buena decisión",notQuite:"No del todo",
  explore:"Explóralo en el lab:",nextQ:"Siguiente situación",results:"Ver tus resultados",again:"Empezar de nuevo",check:"Comprobar",
  up:"Subir",down:"Bajar",labsLabel:"Labs",qsLabel:"Situaciones",right:"Correcto.",wrong:"No del todo:",belongs:"va en «{b}».",
  placed:"{n} de {of} ubicados.",ready:"Todos ubicados: comprueba tus respuestas.",back:"Atrás",nextStep:"Siguiente paso",stepOf:"Paso {n} de {of}."},
loading:"Cargando el lab…",failed:"Esta parte no se cargó. Vuelve a cargar la página para intentarlo de nuevo.",
labs:[
 {id:"count",kind:"count",film:1,chapter:"paper",c:"#ffd166",name:"Cuenta las credenciales"},
 {id:"fit",kind:"pick",film:2,chapter:"logical",c:"#ffd166",name:"Ajuste y brecha"},
 {id:"update",kind:"pick",film:3,chapter:"wrong",c:"#6ebeff",name:"Rompe la actualización"},
 {id:"shapes",kind:"pick",film:4,chapter:"argue",c:"#ba96ff",name:"Misma pregunta, cuatro formas"},
 {id:"order",kind:"steps",film:5,chapter:"sync",c:"#78d4dc",name:"Aplica los cambios en orden"},
 {id:"ground",kind:"pick",film:6,chapter:"again",c:"#6eb4ff",name:"Dale una base a la respuesta"},
 {id:"review",kind:"sort",film:7,chapter:"decide",c:"#ffd166",name:"Aprobar o rechazar"}
],
qs:[
 {type:"choice",n:11,lab:"count",film:1,q:0,title:"Dos cifras, una pregunta"},
 {type:"choice",n:21,lab:"fit",film:2,q:0,title:"«Nuestro modelo es estándar»"},
 {type:"choice",n:31,lab:"update",film:3,q:0,title:"Tres copias de un correo"},
 {type:"choice",n:41,lab:"shapes",film:4,q:0,title:"¿Quién lo dijo, y cuándo?"},
 {type:"choice",n:51,lab:"order",film:5,q:1,title:"Un título revocado, válido otra vez"},
 {type:"choice",n:61,lab:"ground",film:6,q:0,title:"Seguro, y equivocado"},
 {type:"choice",n:71,lab:"review",film:7,q:1,title:"Una definición plausible"}
],
done:[["Todas bien resueltas.", "Distingues una palabra de la idea a la que apunta, eliges la forma que necesita una pregunta y mantienes un significado fiel cuando cambia."], ["Casi todas.", "Vuelve a mirar las situaciones que fallaste, y los labs a los que te llevan."], ["Un buen comienzo.", "Prueba de nuevo los labs: qué se cuenta, y dónde vive cada forma, es donde fallan la mayoría de las cifras."], ["Vale la pena otra mirada.", "Mira de nuevo las películas y vuelve: cada situación te lleva al lab que la trata."]]};
