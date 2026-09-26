# Cómo se hizo *La vida interior de los datos*

*Un viaje de aprendizaje: lo que exploramos, discutimos, hicimos mal y aprendimos al crear una película de seis minutos sobre plataformas de datos.*

La película se hizo en dos días, el 25 y el 26 de septiembre de 2026, en una sola conversación de trabajo larga entre el autor y Claude, un modelo de IA creado por Anthropic. El autor aportó el encargo, el conocimiento de la plataforma y la mayoría de las objeciones. Claude propuso opciones, verificó datos, escribió el código y renderizó cada cuadro. Esta página cuenta la historia desde la primera pregunta hasta el sitio publicado, con las lecciones que vale la pena reutilizar.

## De un vistazo

| Etapa | Qué pasó | Qué produjo |
|---|---|---|
| 1. El encargo | Explicar una plataforma de datos con Databricks y dbt para que un adolescente la entienda y un ingeniero de datos esté de acuerdo | Una lista de componentes que la película debía mostrar |
| 2. La analogía | Se pusieron a prueba ríos, bibliotecas, cyberpunk, tuberías industriales y el cuerpo humano | Un recorrido documental donde los datos viajan como luz |
| 3. Los hechos | Cada afirmación sobre un producto se verificó con fuentes actuales | Una hoja de rigor, y varios productos con nombre nuevo |
| 4. El estilo | Cuatro tableros de estilo, y luego "no hay una luz mejor que otra" | Luz que lleva imágenes, dos zooms, pinturas para cada público |
| 5. El mapa de metáforas | Imprimir, escanear, proyectores, un boceto, un cerebro | Un mundo coherente |
| 6. El primer corte | Una película muda de 4:56, hecha por completo con código | Revisión y correcciones cuadro por cuadro |
| 7. La gran revisión | Sistema de registro, estilo, dbt, el boceto, logotipos, exposures | Un nuevo lenguaje de diseño |
| 8. Puntos de control | Cinco cuadros de estilo, un boceto de sonido, cuatro pruebas de voz | Acuerdo antes de reconstruir |
| 9. El segundo corte | 6:17 con narración, música y sonido, sincronizados con la voz | Productos de datos variados, un cerebro, actualizaciones en vivo |
| 10. La publicación | Un sitio, el código fuente y esta historia | Este repositorio |

## 1. El encargo

El primer mensaje pedía tres cosas:

- **Qué mostrar:** eventos con Zerobus Ingest, archivos con Auto Loader, transformación con dbt, significado y modelado, trabajo transaccional y analítico lado a lado, y todas las formas en que los datos salen de la plataforma: eventos, SQL endpoints, plataformas de integración y uso compartido sin copias (sharing, mirroring, federación). Además, Databricks Apps, Genie Agents y Genie Ontology.
- **Para quién:** "que cualquiera lo entienda, incluso un adolescente", sin perder el rigor de la ingeniería de datos.
- **Una restricción:** inspirada en la plataforma real de una universidad, pero sin nombrarla nunca, para poder compartirla.

Un segundo mensaje ubicó la historia en la educación superior, para que otras universidades pudieran usarla, y pidió mostrar cómo la plataforma llega al conocimiento más amplio de la organización (páginas de la intranet, portales, definiciones y procesos) a través de MCP.

## 2. Encontrar la analogía

La primera pregunta fue la analogía: ¿ríos, bibliotecas, cyberpunk, tuberías industriales o el cuerpo humano? Cada una se puso a prueba con la idea más difícil de la película: compartir sin copias.

- **Ríos:** conocidos, pero el agua no puede estar en dos lugares a la vez, así que enseñan mal el zero-copy.
- **Bibliotecas:** buenas para catálogos y definiciones, pero estáticas. Sin eventos, sin flujo.
- **Cyberpunk:** una estética, no una analogía, y transmite vigilancia y caos, lo contrario de los datos gobernados.
- **Tuberías industriales:** buenas para el refinado, pero frías, y las tuberías sugieren copiar.
- **Cuerpo humano:** el mejor estilo de cámara, pero asignar órganos a herramientas se vuelve forzado.

La respuesta fue ninguna: un recorrido documental por la plataforma real, al estilo de *The Inner Life of the Cell* y *Powers of Ten*, con los datos viajando como luz. La idea clave fue que toda analogía física se rompe con el zero-copy, así que esa ruptura se convirtió en el giro dramático de la película.

> **Lección:** pon a prueba una analogía con el mecanismo más difícil de explicar, no con el más fácil.

## 3. Verificar los hechos

Antes de cualquier animación, cada afirmación sobre un producto se verificó con fuentes actuales. Varias cosas habían cambiado ese año:

- Delta Sharing había cambiado de nombre a **OpenSharing**, dbt Cloud se había convertido en la **dbt platform**, y dbt Explorer ahora es **Catalog**.
- **Genie Ontology** y **Lakehouse Sync** de Lakebase (los cambios que regresan a Delta) estaban en Public Preview, así que la película los presenta como nuevos.
- **Las tablas sincronizadas de Lakebase son una copia administrada**, no zero-copy, y el guion lo dice.
- **El mirroring de Azure Databricks en Fabric** replica los metadatos y lee los datos mediante accesos directos (shortcuts), sin copiarlos. El mirroring de otras fuentes sí copia.

Todo lo que la película simplifica está escrito en una **hoja de rigor** dentro del [guion](https://github.com/roanboc/learning-data/blob/main/films/inner-life-of-data/script.md) (en inglés): qué muestra cada escena, la tecnología real y lo que agregaría un experto.

> **Lección:** los nombres y la madurez de los productos cambian rápido. Verifícalos al publicar, y di "preview" cuando algo esté en preview.

## 4. De la luz a las imágenes

Primero vinieron cuatro tableros de estilo: luz viva, una fábrica de vidrio, un plano técnico y un campus en miniatura.

![Los cuatro primeros tableros de estilo: luz viva, fábrica de vidrio, plano técnico y campus en miniatura](../../journey/img/01-style-boards.jpg)

Luego llegó la objeción que cambió la película: "la luz no tiene realmente un proceso de refinado, no hay una luz mejor que otra", y "ninguna de estas opciones muestra la idea de datos distintos, con formas de servicio distintas, para públicos distintos". Un primer intento agregó un banco de filtros y lentes para refinar la luz, pero seguía sin mostrar datos distintos para públicos distintos.

El avance vino de las ideas del autor, unos intercambios después:

- **Datos como paquetes, no como puntos:** imágenes fragmentadas que se vuelven más nítidas y completas a medida que se refinan.
- **Acercar y alejar la cámara,** como en *The Inner Life of the Cell*: la luz que se mueve por la plataforma en la toma abierta, y las imágenes que lleva en el primer plano. Física y arte juntos.
- **Pinturas al final:** el tema es el dominio de negocio, y el estilo depende de para quién es.

Claude validó la idea con un cambio. La primera versión ligaba los estilos a los canales de entrega, por ejemplo el Renacimiento a los SQL endpoints. Un canal es cómo te llega una imagen, no cómo se pinta, y a los expertos esa relación les parecería arbitraria. Así que el estilo pasó a ser **la necesidad del público**: el realismo les da a los analistas cada detalle, un estilo moderno les da a los directivos lo esencial, las reglas estrictas producen los reportes al gobierno, como los conteos a la fecha de corte, y una impresión en vivo sirve a las operaciones. Claude también señaló que el mundo del arte ya habla el idioma del gobierno de datos: catálogo, procedencia, restauración, autenticación y curadores.

Los límites que se acordaron en esta etapa: como máximo tres zooms, solo pinturas originales, y ningún estilo de pintura con puntos, que en Australia puede leerse como pintura aborigen de puntos, protegida por protocolos culturales.

> **Lección:** dale a cada capa de una metáfora una sola tarea. Aquí, la luz explica el movimiento y las imágenes explican el significado.

## 5. El mapa de metáforas

Casi todo el mundo de la película se construyó haciéndole una pregunta a cada objeto: ¿qué significa esto en la plataforma? Los aportes del autor fueron muchas veces los mejores: imprimir una imagen como escribir datos, escanearla como leerlos, y proyectores para el zero-copy. Después llegaron el boceto y el cerebro.

| En la película | En la plataforma |
|---|---|
| Un toque escrito en el sistema académico | Una escritura en el sistema de registro, antes de que la plataforma la vea |
| Un color de luz por cada sistema de origen | Dominios de aplicación (datos alineados a la fuente) |
| El centro de la plataforma de integración | Enrutamiento de mensajes, reintentos y seguridad |
| El carril de Zerobus Ingest | Eventos transmitidos a tablas Delta en segundos |
| La zona de aterrizaje y Auto Loader | Archivos en almacenamiento en la nube, cada uno cargado exactamente una vez |
| Bóvedas de vidrio: bronce, plata, oro | Tablas Delta en cada capa medallion |
| Mosaicos con fallas, duplicados y a destiempo | Problemas reales de los datos en bruto |
| El boceto | El modelo conceptual: entidades y relaciones |
| Módulos de dbt con marcas de verificación | Modelos de fuentes, staging e intermedios, con pruebas |
| El SQL warehouse debajo | El cómputo de Databricks que ejecuta el SQL que compila dbt |
| Un prisma hacia los colores de los dominios de negocio | De datos alineados a la fuente a datos alineados al dominio |
| Pinturas y sus placas | Productos de datos (marts con contratos) y exposures de dbt |
| El panel de Catalog | dbt Catalog: definiciones, fuentes, linaje, exposures |
| El panel de Unity Catalog | Certificación, control de acceso y enmascaramiento |
| El cerebro de la organización | Genie Ontology |
| Un fichero de escritorio | Lakebase, una copia rápida para las apps |
| Una campana, una sala de lectura, copias, un proyector | Eventos, SQL endpoints, copias de integración, compartir sin copias |

## 6. El primer corte

El primer corte se hizo por completo con código: un motor de animación en canvas, una función por escena y una cámara que se desplaza y hace zoom por un solo mundo. Cada cuadro es una función pura del tiempo, así que la película se podía renderizar cuadro por cuadro en un navegador sin interfaz y revisarse como software.

![La refinería en el primer corte: impresiones en bruto etiquetadas como errores, duplicados y relojes distintos](../../journey/img/02-first-cut-refinery.jpg)

El ciclo de revisión era simple: renderizar cuadros en los momentos en que la narración menciona algo, mirarlos, corregir, repetir. Así se detectaron una refinería saturada, etiquetas que chocaban con los subtítulos, una cámara que nunca se quedaba quieta frente a una pintura, archivos que parecían libreros y un render que se detenía al terminar una sesión (resuelto renderizando en bloques reanudables). El primer corte duraba 4:56, sin sonido, con subtítulos.

![La galería de oro en el primer corte, con pinturas renacentistas, modernas e impresionistas](../../journey/img/03-first-cut-gold.jpg)

## 7. La gran revisión

La revisión que hizo el autor del primer corte fue el punto de quiebre. Cada punto hizo la película más precisa o más coherente:

- **Empezar en el sistema de registro.** En el primer corte, el teléfono escribía directo en la plataforma. En la realidad, el sistema académico guarda primero la inscripción, y después la plataforma la recibe.
- **Un solo lenguaje de diseño.** Los dibujos anticuados junto a lentes cristalinos se veían mezclados. Todo pasó a vidrio oscuro, bordes luminosos, íconos de línea fina y una sola tipografía, incluidos los marcos de las pinturas.
- **Hacer visible a dbt, y mostrar las capas juntas.** El linaje se perdía entre los pasos. Una nueva vista general muestra bronce, plata y oro sobre el Databricks Lakehouse, con el grafo de linaje de dbt arriba.
- **Mostrar de quién es cada componente,** con los logotipos oficiales de Databricks y dbt, sin alterar.
- **El boceto va primero.** El modelo conceptual es el boceto en bruto del mundo, y sin él la imagen nunca tiene sentido. Ahora la película también muestra el boceto equivocado: nada encaja, y una cifra más adelante marca 312%.
- **Pinturas como productos de datos.** Claude agregó una precisión aquí. En dbt, un **exposure** declara un uso posterior, como un dashboard, un reporte o una app. El producto de datos en sí es un mart con un contrato y un responsable. Así que la pintura se convirtió en el producto de datos, y su placa en el exposure.
- **De dominios de aplicación a dominios de negocio,** eventos a través de una plataforma de integración, y mosaicos que se ven digitales y no de papel. En palabras del autor, los anteriores parecían "más bien servilletas".

> **Lección:** una imagen puede ser hermosa y aun así estar equivocada. La pregunta detrás de cada punto de la revisión era "¿así es como funciona de verdad?"

## 8. Puntos de control antes de reconstruir

Reconstruir todo era costoso, así que el nuevo estilo se acordó primero con cinco **cuadros de estilo**.

![Cuadro de estilo: del sistema de registro a la plataforma](../../journey/img/04-style-frame-sources.jpg)

Los cuadros generaron una ronda más de objeciones. Dos compuertas decían "staging models", lo cual confundía, y las pruebas aparecían como un solo paso cuando en la práctica corren en todas partes. La solución fue un módulo por cada capa de dbt (fuentes, staging, intermedios), cada uno con sus propias pruebas, y dos fallas detenidas exactamente donde se detectarían en la realidad.

![Cuadro de estilo: capas de dbt con pruebas en cada paso, ejecutándose en un SQL warehouse de Databricks](../../journey/img/05-style-frame-dbt.jpg)

El audio pasó por los mismos puntos de control. El primer corte no tenía sonido porque Claude había dicho que no podía producir una voz, y el autor lo cuestionó. La música y los efectos de sonido se podían sintetizar con código, y un modelo de voz de código abierto ([Kokoro](https://huggingface.co/hexgrad/Kokoro-82M), Apache 2.0) podía correr sin conexión. Siguieron un boceto de sonido de 40 segundos y cuatro pruebas de voz de cinco segundos, y se eligió la voz femenina estadounidense.

> **Lección:** los puntos de control baratos, como un cuadro fijo o un clip de cinco segundos, ahorran reconstrucciones costosas.

## 9. El segundo corte

La película reconstruida está sincronizada con su narración. Cada una de sus 82 líneas se grabó por separado, y cada escena coloca su animación en el momento en que se dice su línea. La música baja bajo la voz, unos 60 efectos de sonido caen en momentos clave de la historia, y la mezcla está normalizada para la web.

![El boceto, equivocado contra correcto: piezas que nunca encajan y piezas que se acomodan en su lugar](../../journey/img/06-final-sketch.jpg)

La última ronda de comentarios fue sobre riqueza y honestidad:

- **Variedad, no copias.** Cada dominio ahora muestra seis productos de datos distintos y con nombre, en lugar de recortes repetidos de una misma pintura.
- **El consumo es parte de la plataforma.** Databricks Apps, Genie, y los dashboards y SQL se sumaron a la vista de extremo a extremo.
- **Un cerebro de la organización.** Genie Ontology se convirtió en una red neuronal con forma de cerebro, con las entidades del boceto como centros.
- **Lo que está en vivo debe verse en vivo.** Los productos de datos en vivo ahora se actualizan, con luces que se encienden y se apagan.
- **Las pausas intencionales deben verse intencionales.** Una pausa dramática que se desvanecía casi a negro parecía una falla, así que se convirtió en una pausa luminosa de un segundo con el proyector encendiéndose.

![Genie Ontology como el cerebro de la organización, alimentado con el conocimiento de la universidad a través de MCP](../../journey/img/07-final-brain.jpg)

![Toda la plataforma en una vista: de los sistemas de origen, pasando por bronce, plata y oro, a los dominios de negocio y el consumo](../../journey/img/08-final-overview.jpg)

## 10. Lo que salió mal en el camino

Los errores fueron parte del proceso, y casi todos enseñaron algo:

- Al principio, Claude descartó el audio demasiado rápido. La solución fue un modelo de voz sin conexión y sonido sintetizado.
- Se dijo que unos clips de voz estaban adjuntos cuando no lo estaban, y el autor tuvo que preguntar dónde estaban.
- Los renders en segundo plano se detenían al terminar una sesión, y un trabajo de voz se quedó sin memoria junto al renderizador. Ambos se volvieron trabajos reanudables, ejecutados de uno en uno.
- Un diagrama de relaciones se dibujó primero con las patas de gallo al revés.
- Las etiquetas chocaban con los subtítulos hasta que cada escena se revisó contra el área de subtítulos.

## Lecciones aprendidas

1. **Pon a prueba las analogías con el mecanismo más difícil.** El zero-copy descartó los ríos y las tuberías.
2. **Dale a cada capa de una metáfora una sola tarea.** La luz se mueve; las imágenes llevan el significado.
3. **Asigna cada objeto a un mecanismo,** y lleva una hoja de rigor con lo que la imagen simplifica.
4. **Muestra el refinado en un solo registro.** El mismo fragmento está en bruto en bronce, limpio en plata y adaptado a un público en oro.
5. **Empieza donde nacen los datos,** en el sistema de registro.
6. **Muestra el modelo conceptual, y muéstralo fallando.** El boceto equivocado enseña más que el correcto.
7. **Mantén claros los roles.** dbt escribe y prueba las recetas; Databricks ejecuta, guarda y gobierna.
8. **Verifica nombres y madurez al publicar.** Los productos cambian de nombre, y lo que está en preview no tiene disponibilidad general.
9. **La coherencia le gana al adorno.** Usa un solo lenguaje de diseño, y varía el contenido en lugar de repetirlo.
10. **Usa puntos de control baratos.** Los cuadros de estilo y las pruebas de voz de cinco segundos van antes de las reconstrucciones completas.
11. **Crea contenido multimedia como código.** Cuando las escenas están sincronizadas con la narración, cambiar una línea vuelve a sincronizar toda la película.
12. **Valida mirando y midiendo,** y di claramente lo que no puedes verificar. Claude no podía escuchar el audio, así que el autor juzgó el balance.
13. **Las objeciones son el motor.** Casi todas las mejoras empezaron con "eso no es del todo correcto".

## Reutilízala

El [código fuente y la guía para reconstruir la película](https://github.com/roanboc/learning-data/blob/main/films/inner-life-of-data/source/README.md) (en inglés) están en este repositorio, y la [guía práctica](https://github.com/roanboc/learning-data/blob/main/PLAYBOOK.md) (en inglés) reúne lo que conviene reutilizar en la próxima película o curso. Para adaptar la película a otra universidad, cambia la narración en `src/narration.js`, o en `src/i18n/es/narration.js` para la versión en español (por ejemplo "clase", "fecha de corte" y los nombres de los dominios), vuelve a generar la voz y renderiza de nuevo.
