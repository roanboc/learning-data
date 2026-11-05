/* Learning Data: "Pausa para pensar" de Decláralo, luego constrúyelo, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (recap, name, lives, steps), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). Cada "stop" es un lab de esta película que enseña la misma idea;
   el .player data-labs de la página dice dónde están esos labs. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "recap":{stop:"blueprint",q:"Dos equipos cuentan credenciales y obtienen cifras distintas. ¿Están mal los datos o el significado?",
    opts:[{t:"Casi siempre los datos: la copia de cada equipo se cargó un día distinto.",near:true},{t:"Casi siempre el significado: cada equipo cuenta lo que cree que es una credencial.",ok:true},{t:"Ninguno: dos conteos de lo mismo siempre difieren un poco."}],
    why:"Cuatro oficinas dieron cuatro cifras, y ninguna estaba mal: cada una contaba una idea distinta bajo la misma palabra. Primero se acuerda el significado, después se construye."},
  "name":{stop:"blueprint",q:"dbt te muestra un archivo llamado modelo. ¿Qué contiene en realidad?",
    opts:[{t:"El modelo de datos: lo que los datos deben ser.",near:true},{t:"La tabla misma, con sus columnas y sus filas."},{t:"Una consulta: un paso que hace una tabla o una vista.",ok:true}],
    why:"Un modelo de dbt es un SELECT y su configuración: un paso de la obra. El modelo de datos es lo que esa tabla debe ser, declarado a su lado."},
  "lives":{stop:"lives",q:"Necesitas saber qué significa una fila de una tabla. ¿Dónde miras?",
    opts:[{t:"En su YAML (la granularidad, la clave, el contrato) y en el modelo conceptual a su lado.",ok:true},{t:"Solo en su YAML: la granularidad, la clave y el contrato dicen todo lo que significa una fila.",near:true},{t:"En el SQL que la construye, porque la consulta decide qué contiene cada fila."}],
    why:"El SQL dice cómo se hace la tabla, no qué debe ser una fila. La granularidad y las claves se declaran en el YAML del modelo, y el significado en el modelo conceptual del dominio, junto al código."},
  "steps":{stop:"steps",q:"Un agente redacta tus pruebas y tu SQL. ¿Qué sigue siendo tuyo?",
    opts:[{t:"Escribir el mensaje del commit, porque los borradores y las pruebas del agente llevan todo lo demás."},{t:"Aprobar: el significado, el contrato y el cambio. El agente redacta y comprueba, con evidencia.",ok:true},{t:"Comprobar: vuelves a correr tú las pruebas del agente, y si pasan, el cambio puede entrar.",near:true}],
    why:"El agente recomienda; las personas aprueban. Redactar ya es barato; juzgar el borrador, y ser dueño del significado, sigue siendo el trabajo."}
  }}};
