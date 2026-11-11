/* Learning Data: "Pause and think" for Many hats, one picture, in Spanish. Keep the keys in step with think.en.js.
   The film stops at the end of three chapters (parts, page, shape), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  parts:{q:"Helena le da a Ivy un mes con cada parte del trabajo del equipo. ¿Para qué es ese mes, según Helena?",
    opts:[{t:"Para que Ivy aprenda cada trabajo lo bastante bien como para reemplazar a quien falte en el equipo."},{t:"Para que Ivy aprenda lo suficiente de cada parte para seguirla, y enseñe a cada uno a hacerla mejor.",near:true},{t:"Para que Ivy aprenda lo suficiente de cada parte para seguirla, y vea lo que queda entre los roles.",ok:true}],
    why:"Cada uno conoce a fondo una parte, y tiene razón en ella, y cumple más roles de los que dice su puesto. Helena no busca un reemplazo ni un juez: busca a alguien que aprenda lo suficiente de cada parte para seguirla, y pregunte a cada uno quién la usa y para qué decisión, para que se vea lo que queda entre los roles. ¿Quién en tu equipo podría ver hoy el conjunto?"},
  page:{q:"En la página de Ivy, las reservas se encuentran con los conteos. ¿Por qué nadie había visto que 14 aulas quedarían fuera?",
    opts:[{t:"Las aulas se renumeraron en un sistema y no en el otro, y la unión quedaba entre los roles de dos personas.",ok:true},{t:"Los sensores de esas aulas se instalaron en el lugar equivocado, y la unión quedaba entre los roles de dos personas.",near:true},{t:"Nadie reservó esas 14 aulas en marzo, así que no había reservas que poner junto a lo que contaban los sensores."}],
    why:"Nadie se equivocó: el horario estaba bien, y los sensores también. Catorce aulas se renumeraron en el horario después de instalar sus sensores, y la unión quedaba entre los roles de Mei y los de Sam, así que revisarla no era tarea de nadie. Unidos tal cual, esas aulas quedarían fuera sin aviso. Después, Helena le dio un responsable a la unión. ¿Qué queda en tu equipo entre los roles de dos personas?"},
  shape:{q:"Helena no necesitaba que Ivy conociera el horario como Mei, ni los sensores como Sam. ¿Qué necesitaba de ella?",
    opts:[{t:"Conocer a fondo cada parte que lleva el equipo, del horario a los modelos, y lo suficiente del negocio para unirlas.",near:true},{t:"Su propio fondo, la estadística, y lo suficiente del negocio, los sistemas y los datos para unirlos.",ok:true},{t:"Una mirada de gestora sobre todo el equipo, dejando atrás su estadística, para que los especialistas hagan lo profundo."}],
    why:"Esa es la T: un trazo profundo, su estadística, y una barra ancha arriba. Ningún líder debería esperar que alguien domine todas las partes a fondo: Mei y Sam siguieron siendo esenciales, y emparejaron las 14 aulas en un día. Pero alguien tiene que ver el conjunto, y quien lidera se asegura de que alguien lo vea. ¿A quién de tu equipo le ensancharías primero la barra?"}
  }}};
