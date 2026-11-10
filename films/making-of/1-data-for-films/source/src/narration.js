// Making of · Data for Films. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line, a natural breath between sentences. The few longer stops are in breath.js.
const NARR={
"frame":{"name":"One frame","lead":4.2,"tail":1.0,"vo":[
 {"id":"this","gap":0.8,"text":"This is The Inner Life of Data, two minutes and thirty-one seconds in."},
 {"id":"stop","gap":0.8,"text":"Let's stop it here, and look closer."},
 {"id":"closer","gap":1.4,"text":"Closer."},
 {"id":"squares","gap":0.8,"text":"The picture breaks into tiny squares: pixels. And each pixel is only three numbers."},
 {"id":"rgb","gap":0.8,"text":"How much red, how much green and how much blue, each from zero to two hundred and fifty-five."}]},
"data":{"name":"A picture is data","lead":1.2,"tail":1.0,"vo":[
 {"id":"grid","gap":0.8,"text":"A frame is a grid of these numbers: nineteen hundred and twenty pixels across, and a thousand and eighty down."},
 {"id":"count","gap":0.8,"text":"That's about two million pixels, and six million numbers, in one frame."},
 {"id":"thirty","gap":0.8,"text":"The film shows thirty frames every second."},
 {"id":"where","gap":0.8,"text":"Nobody typed those numbers. So where do they come from?"}]},
"draw":{"name":"Instructions, not pixels","lead":1.0,"tail":1.0,"vo":[
 {"id":"code","gap":0.8,"text":"From code. And code doesn't say which pixels to colour. It describes shapes."},
 {"id":"rect","gap":0.8,"text":"Fill a rectangle here, this wide, in this colour."},
 {"id":"more","gap":0.8,"text":"A circle. A line. A curve. A word."},
 {"id":"raster","gap":0.8,"text":"The browser works out which pixels each shape covers."},
 {"id":"edge","gap":0.8,"text":"Where an edge cuts through a pixel, that pixel gets part of the colour, so the edge looks smooth instead of jagged."},
 {"id":"real","gap":0.8,"text":"The film's real code is denser, but it's the same idea: shapes, positions and colours."}]},
"layers":{"name":"Layers","lead":1.0,"tail":1.0,"vo":[
 {"id":"tile","gap":0.8,"text":"Take one of the film's data tiles. It's drawn in five layers."},
 {"id":"five","gap":0.8,"text":"A dark card, a piece of the picture, a frame, corner marks, and a timestamp."},
 {"id":"order","gap":0.8,"text":"Order matters. Whatever is drawn later covers what came before, like paint."},
 {"id":"swap","gap":0.8,"text":"Draw the picture last, and the timestamp disappears."},
 {"id":"light","gap":0.8,"text":"Light is different. Where two glows overlap, the code adds their numbers together, as real light does."},
 {"id":"lens","gap":0.8,"text":"That's how the lenses shine."},
 {"id":"glitch","gap":0.8,"text":"And a raw tile's glitch is done with the numbers too: the code slides the red and blue a few pixels sideways."}]},
"parts":{"name":"Components","lead":1.0,"tail":1.0,"vo":[
 {"id":"hand","gap":0.8,"text":"Nobody draws each tile by hand. The tile is a function."},
 {"id":"give","gap":0.8,"text":"Give it a position, a size, a piece of the picture and how clean it is, and it draws itself."},
 {"id":"rows","gap":0.8,"text":"Feed it ten rows of data, and you get ten tiles."},
 {"id":"really","gap":0.8,"text":"Here's the real one: two lines, called in almost every frame of the film."},
 {"id":"same","gap":0.8,"text":"The film, the labs and the scenarios call the same functions. Fix one, and the fix lands everywhere."}]},
"camera":{"name":"The camera","lead":1.0,"tail":1.0,"vo":[
 {"id":"world","gap":0.8,"text":"The whole platform is drawn at its own size, much bigger than the screen."},
 {"id":"notlens","gap":0.8,"text":"So the camera isn't a lens. It's three numbers: where to look, across and down, and how far to zoom."},
 {"id":"before","gap":0.8,"text":"One instruction applies them before anything is drawn."},
 {"id":"fly","gap":0.8,"text":"Change the numbers smoothly, and we fly from the whole platform into one housing."}]},
"time":{"name":"Time","lead":1.0,"tail":1.0,"vo":[
 {"id":"moves","gap":0.8,"text":"So far, one frame. But a film moves."},
 {"id":"function","gap":0.8,"text":"Every frame is a function of time. Give the code a moment, and it draws that moment."},
 {"id":"where","gap":0.8,"text":"Where is this tile now? It set off from here, at this speed, this long ago. So it's there."},
 {"id":"back","gap":0.8,"text":"Go back, or jump ahead, and the code simply draws that moment instead."},
 {"id":"ease","gap":0.8,"text":"Motion needs care. At a constant speed, it looks mechanical. Eased in and out, it looks calm."},
 {"id":"random","gap":0.8,"text":"Even what looks random isn't. Which tiles are glitched or duplicated comes from a formula."},
 {"id":"exact","gap":0.8,"text":"So the same moment draws the same way, every time, on any computer."}]},
"play":{"name":"Two ways to play","lead":1.0,"tail":1.0,"vo":[
 {"id":"two","gap":0.8,"text":"That gives the films two ways to play."},
 {"id":"live","gap":0.8,"text":"On the site, your browser downloads the code and the soundtrack. Each time your screen refreshes, it asks the soundtrack how far it has played, and draws that moment."},
 {"id":"video","gap":0.8,"text":"For a video file, a browser with no window draws every frame, thirty for each second, and hands them to an encoder."},
 {"id":"diff","gap":0.8,"text":"The encoder mostly keeps what changed from one frame to the next."},
 {"id":"sizes","gap":0.8,"text":"Stored as raw numbers, The Inner Life of Data would take about eighty gigabytes. The video takes about two hundred megabytes. The code and the sound, about seven."},
 {"id":"flip","gap":0.8,"text":"A flipbook keeps every page. The live film keeps none: it's the recipe. The video is a flipbook, made from that recipe."}]},
"again":{"name":"2:31 again","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Now let's put the frame back together."},
 {"id":"list","gap":0.8,"text":"Numbers. Shapes. Layers. Components. A camera. And time."},
 {"id":"on","gap":1.2,"text":"And the film plays on."},
 {"id":"end","gap":0.8,"text":"A picture is data. A film is a function."}]}
};
