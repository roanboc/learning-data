/* Learning Data: In the weeds of data crafting, in Spanish: the series' one pack of labs (training) and scenarios
   (evaluation), for all its films: one lab for each film's main idea, and one situation for each lab. Keep the keys in step with
   learn.en.js. Each lab and each situation is its film's own: assets/from-words-to-data/learn.js loads that film's
   words (assets/<film>/learn.es.js: the lab by its id, the situation by its place "q" in the film's qs) and its bundle, for the
   film's own pictures, only when a visitor opens it. Each lab starts with id, kind, film, chapter, c, name, and each situation with
   type, n, lab, film, as site-tools/build_series.py's series_learn() reads them. */
window.FW={lang:"es",store:"ld-in-the-weeds",
ui:{lab:"Lab",of:"de",inPractice:"En la práctica",watch:"Ver esta parte",next:"Siguiente:",makeCall:"Tú decides →",
  scenario:"Situación",score:"Puntaje",answered:"respondidas",toGo:"por responder",good:"Buena decisión",notQuite:"No del todo",
  explore:"Explóralo en el lab:",nextQ:"Siguiente situación",results:"Ver tus resultados",again:"Empezar de nuevo",check:"Comprobar",
  up:"Subir",down:"Bajar",labsLabel:"Labs",qsLabel:"Situaciones",right:"Correcto.",wrong:"No del todo:",belongs:"va en «{b}».",
  placed:"{n} de {of} ubicados.",ready:"Todos ubicados: comprueba tus respuestas.",back:"Atrás",nextStep:"Siguiente paso",stepOf:"Paso {n} de {of}.",repo:"Míralo en el proyecto:"},
loading:"Cargando el lab…",failed:"Esta parte no se cargó. Vuelve a cargar la página para intentarlo de nuevo.",
labs:[
 {id:"blueprint",kind:"sort",film:1,chapter:"name",c:"#9fc4ff",name:"¿Plano u obra?"},
 {id:"scope",kind:"pick",film:2,chapter:"ask",c:"#78d79b",name:"Acótalo"},
 {id:"same",kind:"pick",film:3,chapter:"apart",c:"#ffd166",name:"¿La misma estudiante?"},
 {id:"grain",kind:"compose",film:4,chapter:"grain",c:"#e6b8ff",name:"Declara el grano"},
 {id:"catch",kind:"pick",film:5,chapter:"tests",c:"#9cd678",name:"¿Qué prueba lo detecta?"},
 {id:"once",kind:"count",film:6,chapter:"once",c:"#78d79b",name:"Una regla, dos veces"},
 {id:"access",kind:"pick",film:7,chapter:"access",c:"#b29cff",name:"¿Público o protegido?"},
 {id:"review",kind:"pick",film:8,chapter:"shortcut",c:"#6fd6c8",name:"Revisa la pull request del agente"},
 {id:"affected",kind:"count",film:9,chapter:"version",c:"#78d79b",name:"¿A quién afecta?"}
],
qs:[
 {type:"choice",n:11,lab:"blueprint",film:1,q:0,title:"¿Dónde está el modelo?"},
 {type:"choice",n:21,lab:"scope",film:2,q:0,title:"¿Modelar todo primero?"},
 {type:"choice",n:31,lab:"same",film:3,q:0,title:"Dos cuentas, un ID de estudiante"},
 {type:"choice",n:41,lab:"grain",film:4,q:1,title:"El número del censo en la app"},
 {type:"choice",n:51,lab:"catch",film:5,q:3,title:"Verdadero o falso: la clave primaria"},
 {type:"choice",n:61,lab:"once",film:6,q:4,title:"Una segunda suma"},
 {type:"choice",n:71,lab:"access",film:7,q:0,title:"Ya está hecho"},
 {type:"choice",n:81,lab:"review",film:8,q:2,title:"En verde, y 40 filas distintas"},
 {type:"choice",n:91,lab:"affected",film:9,q:2,title:"Solo un mart"}
],
done:[["Todas bien resueltas.", "Sabes declarar un modelo antes de construirlo, dejar cada regla en un solo lugar, probarla con tests y revisar un cambio antes de que entre."], ["Casi todas.", "Vuelve a mirar las situaciones que fallaste, y los labs a los que te llevan."], ["Un buen comienzo.", "Prueba de nuevo los labs: el grano, los tests y las revisiones es donde fallan la mayoría de los cambios."], ["Vale la pena otra mirada.", "Mira de nuevo las películas y vuelve: cada situación te lleva al lab que la trata."]]};
