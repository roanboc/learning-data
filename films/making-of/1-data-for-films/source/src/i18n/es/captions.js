/* Data for Films: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"This is The Inner Life of Data, two minutes and thirty-one seconds in.":
 "Esta es La vida interior de los datos, en el minuto 2:31.",
"Let's stop it here, and look closer.":
 "Detengámosla aquí, y miremos de cerca.",
"Closer.":
 "Más cerca.",
"The picture breaks into tiny squares: pixels. And each pixel is only three numbers.":
 "La imagen se divide en cuadritos: píxeles. Y cada píxel es solo tres números.",
"How much red, how much green and how much blue, each from zero to two hundred and fifty-five.":
 "Cuánto rojo, cuánto verde y cuánto azul, cada uno de 0 a 255.",
"A frame is a grid of these numbers: nineteen hundred and twenty pixels across, and a thousand and eighty down.":
 "Un cuadro es una cuadrícula de estos números: 1,920 píxeles a lo ancho, y 1,080 a lo alto.",
"That's about two million pixels, and six million numbers, in one frame.":
 "Son unos dos millones de píxeles, y seis millones de números, en un solo cuadro.",
"The film shows thirty frames every second.":
 "La película muestra treinta cuadros por segundo.",
"Nobody typed those numbers. So where do they come from?":
 "Nadie escribió esos números. Entonces, ¿de dónde vienen?",
"From code. And code doesn't say which pixels to colour. It describes shapes.":
 "Del código. Y el código no dice qué píxeles pintar. Describe formas.",
"Fill a rectangle here, this wide, in this colour.":
 "Rellena un rectángulo aquí, de este ancho, de este color.",
"A circle. A line. A curve. A word.":
 "Un círculo. Una línea. Una curva. Una palabra.",
"The browser works out which pixels each shape covers.":
 "El navegador calcula qué píxeles cubre cada forma.",
"Where an edge cuts through a pixel, that pixel gets part of the colour, so the edge looks smooth instead of jagged.":
 "Donde un borde corta un píxel, ese píxel recibe parte del color, así el borde se ve suave y no dentado.",
"The film's real code is denser, but it's the same idea: shapes, positions and colours.":
 "El código real de la película es más denso, pero la idea es la misma: formas, posiciones y colores.",
"Take one of the film's data tiles. It's drawn in five layers.":
 "Toma una de las piezas de datos de la película. Se dibuja en cinco capas.",
"A dark card, a piece of the picture, a frame, corner marks, and a timestamp.":
 "Una tarjeta oscura, un trozo de imagen, un marco, marcas de esquina y una marca de tiempo.",
"Order matters. Whatever is drawn later covers what came before, like paint.":
 "El orden importa. Lo que se dibuja después tapa lo anterior, como la pintura.",
"Draw the picture last, and the timestamp disappears.":
 "Dibuja la imagen al final, y la marca de tiempo desaparece.",
"Light is different. Where two glows overlap, the code adds their numbers together, as real light does.":
 "La luz es distinta. Donde dos brillos se superponen, el código suma sus números, como hace la luz real.",
"That's how the lenses shine.":
 "Así brillan los lentes.",
"And a raw tile's glitch is done with the numbers too: the code slides the red and blue a few pixels sideways.":
 "Y la falla de una pieza en bruto también se hace con números: el código corre el rojo y el azul unos píxeles hacia un lado.",
"Nobody draws each tile by hand. The tile is a function.":
 "Nadie dibuja cada pieza a mano. La pieza es una función.",
"Give it a position, a size, a piece of the picture and how clean it is, and it draws itself.":
 "Dale una posición, un tamaño, un trozo de la imagen y qué tan limpia está, y se dibuja sola.",
"Feed it ten rows of data, and you get ten tiles.":
 "Dale diez filas de datos, y obtienes diez piezas.",
"Here's the real one: two lines, called in almost every frame of the film.":
 "Aquí está la real: dos líneas, llamadas en casi cada cuadro de la película.",
"The film, the labs and the scenarios call the same functions. Fix one, and the fix lands everywhere.":
 "La película, los labs y las situaciones llaman a las mismas funciones. Corrige una, y la corrección llega a todas partes.",
"The whole platform is drawn at its own size, much bigger than the screen.":
 "Toda la plataforma se dibuja a su propio tamaño, mucho más grande que la pantalla.",
"So the camera isn't a lens. It's three numbers: where to look, across and down, and how far to zoom.":
 "Así que la cámara no es un lente. Son tres números: adónde mirar, a lo ancho y a lo alto, y cuánto acercarse.",
"One instruction applies them before anything is drawn.":
 "Una instrucción los aplica antes de dibujar nada.",
"Change the numbers smoothly, and we fly from the whole platform into one housing.":
 "Cambia los números suavemente, y volamos de la plataforma entera a una sola carcasa.",
"So far, one frame. But a film moves.":
 "Hasta ahora, un cuadro. Pero una película se mueve.",
"Every frame is a function of time. Give the code a moment, and it draws that moment.":
 "Cada cuadro es una función del tiempo. Dale al código un momento, y dibuja ese momento.",
"Where is this tile now? It set off from here, at this speed, this long ago. So it's there.":
 "¿Dónde está esta pieza ahora? Salió de aquí, a esta velocidad, hace este tiempo. Así que está ahí.",
"Go back, or jump ahead, and the code simply draws that moment instead.":
 "Retrocede, o salta hacia adelante, y el código simplemente dibuja ese otro momento.",
"Motion needs care. At a constant speed, it looks mechanical. Eased in and out, it looks calm.":
 "El movimiento necesita cuidado. A velocidad constante, se ve mecánico. Suavizado al inicio y al final, se ve tranquilo.",
"Even what looks random isn't. Which tiles are glitched or duplicated comes from a formula.":
 "Incluso lo que parece aleatorio no lo es. Qué piezas tienen fallas o se duplican sale de una fórmula.",
"So the same moment draws the same way, every time, on any computer.":
 "Así, el mismo momento se dibuja igual, cada vez, en cualquier computadora.",
"That gives the films two ways to play.":
 "Eso da dos formas de ver las películas.",
"On the site, your browser downloads the code and the soundtrack. Each time your screen refreshes, it asks the soundtrack how far it has played, and draws that moment.":
 "En el sitio, tu navegador descarga el código y la banda sonora. Cada vez que tu pantalla se actualiza, le pregunta a la banda sonora cuánto avanzó, y dibuja ese momento.",
"For a video file, a browser with no window draws every frame, thirty for each second, and hands them to an encoder.":
 "Para un archivo de video, un navegador sin ventana dibuja cada cuadro, treinta por segundo, y se los pasa a un codificador.",
"The encoder mostly keeps what changed from one frame to the next.":
 "El codificador guarda sobre todo lo que cambió de un cuadro al siguiente.",
"Stored as raw numbers, The Inner Life of Data would take about eighty gigabytes. The video takes about two hundred megabytes. The code and the sound, about seven.":
 "Guardada como números en bruto, La vida interior de los datos ocuparía unos 80 gigabytes. El video ocupa unos 200 megabytes. El código y el sonido, unos siete.",
"A flipbook keeps every page. The live film keeps none: it's the recipe. The video is a flipbook, made from that recipe.":
 "Un folioscopio guarda cada página. La película en vivo no guarda ninguna: es la receta. El video es un folioscopio, hecho con esa receta.",
"Now let's put the frame back together.":
 "Ahora, volvamos a armar el cuadro.",
"Numbers. Shapes. Layers. Components. A camera. And time.":
 "Números. Formas. Capas. Componentes. Una cámara. Y el tiempo.",
"And the film plays on.":
 "Y la película sigue.",
"A picture is data. A film is a function.":
 "Una imagen son datos. Una película es una función."
});
