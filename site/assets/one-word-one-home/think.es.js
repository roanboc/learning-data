/* Learning Data: "Pausa para pensar" de One word, one home, en español. Mantén las claves iguales a think.en.js.
   La película se detiene al final de cuatro capítulos (none, read, change, agree), con una pregunta cada vez. think.js las muestra,
   y las lista otra vez en "Piénsalo" (#think-list). La serie todavía no tiene labs, así que ninguna pregunta tiene "stop",
   y el .player data-labs de la página está vacío. */
window.LEARN={lang:"es",
think:{ui:{toggle:"Pausa para pensar",kicker:"Pausa para pensar",cont:"Continuar",skip:"Saltar",lab:"Prueba la idea en un lab",off:"Desactivar las pausas",right:"Correcto.",wrong:"No del todo.",start:"Ver con pausas para pensar",answer:"Respuesta:",watch:"Ver esta parte"},
  qs:{
  "none":{q:"Cada uno de los cinco glosarios se hizo por una buena razón. ¿Por qué cinco son peor que uno?",
    opts:[{t:"Cinco tardan mucho en leerse, así que la gente deja de leerlos."},{t:"Nadie sabe en cuál confiar, así que cada uno guarda el suyo, y un cambio llega solo a uno.",ok:true},{t:"La mayoría están mal, así que los informes de sus equipos también."}],
    why:"Cada glosario es correcto para el equipo que lo escribió. Pero entre todos guardan tres sentidos de título, a dos solo los encuentran quienes los hicieron, y el más grande nunca se abre. Cuando título cambió el lunes, uno cambió y cuatro nunca se enteraron. ¿En cuántos lugares se define una palabra clave donde trabajas?"},
  "read":{q:"La hoja de cálculo de Planificación todavía necesita la palabra título. ¿Qué debería hacer ahora?",
    opts:[{t:"Copiar la definición del glosario en su propia pestaña, y actualizarla cada período."},{t:"Mantener sus propias palabras, ya que Planificación las escribió primero."},{t:"Enlazar al término en el glosario, para leer sus palabras en vez de guardar las suyas.",ok:true}],
    why:"Una copia solo sirve si se hace a partir del glosario, en un solo sentido, y se revisa: la copia del equipo de datos dice de dónde vienen sus palabras, y cada noche se compara con el glosario. Una copia mantenida a mano se desvía, como cuatro el lunes. ¿Cuál de tus herramientas guarda su propia copia de una definición?"},
  "change":{q:"Las palabras nuevas dicen «al menos 6 créditos». ¿Dónde debería vivir el 6?",
    opts:[{t:"En un solo lugar, como una regla de negocio con dueño, que lee cada informe.",ok:true},{t:"En cada informe que cuenta títulos, calculado a su manera."},{t:"Solo en las palabras del glosario, para que las lean las personas."}],
    why:"Un número en un significado también es una regla. Guardado una vez, como una regla de negocio de la que Mei es dueña, todos los informes leen el mismo 6, y cuando cambian las palabras, la regla cambia en un solo lugar. Mira una definición que uses: ¿esconde un número?"},
  "agree":{q:"¿Quién decidió que una microcredencial cuenta desde 6 créditos?",
    opts:[{t:"El glosario, cuando se actualizó el término el lunes."},{t:"Mei y las facultades, que lo discutieron en un taller; el glosario guarda lo que acordaron.",ok:true},{t:"El equipo de datos, cuando guardó la regla en un solo lugar."}],
    why:"El glosario guarda el acuerdo; no lo hace. Las personas discuten las palabras, y el dueño del término las aprueba. Y quienes mantenían los otros glosarios pierden algo que construyeron, así que se les agradece, y sus mejores definiciones pasan al que se queda. ¿El trabajo de quién llevarías al único glosario?"}
  }}};
