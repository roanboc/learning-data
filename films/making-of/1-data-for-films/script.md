# Data for Films: script

*Script for the first of [two films on the Making of page](../README.md), draft 1, with the rigour sheet. The narration lives in [`source/src/narration.js`](source/src/narration.js), and the film re-times itself to the voice; this page copies it for reading.*

**Length:** 4:58, about 131 words a minute, with the voice speaking 69% of the time (`python tools/pace.py`).
**Voice:** the synthetic voice of every Learning Data film (Kokoro, `af_heart`).
**The frame it follows:** 2:31 of *The Inner Life of Data*, in *Refining with dbt*. The film carries *The Inner Life of Data* inside it, so that frame, and every number read from it, is the real one.

## What the picture does

| Chapter | Picture |
|---|---|
| 1. One frame | *The Inner Life of Data* plays from 2:21, stops at 2:31, and the camera dives into one pixel on the glowing edge of a lens. The pixels become squares, then squares with three numbers each; a card shows the chosen pixel's red, green and blue. The title. |
| 2. A picture is data | The camera pulls back from 150× to the whole frame, with its edges measured. A panel counts: 2,073,600 pixels, 6,220,800 numbers, 186,624,000 a second; thirty frames stack up behind the first. |
| 3. Instructions, not pixels | Simplified code on the left, a canvas on the right: a rectangle, a circle, a line, a curve and a word appear as their lines run. Then the circle's edge on a coarse grid of pixels: first covered or not, then part-covered and part-coloured, with the share of each pixel covered. Then the real source of `gate()`, the function that draws the film's lenses, as the browser runs it. |
| 4. Layers | One data tile pulled apart into five sheets (card, picture, frame, corners, timestamp), pressed back together, then redrawn with the picture last, which hides the timestamp. Two glows painted over each other, then added as light, with the numbers. The film's lenses glowing over moving tiles. A tile's picture split into its red, green and blue numbers, then red and blue slid sideways into the raw tiles' glitch. |
| 5. Components | `tile(position, size, picture, how clean)` builds a tile one input at a time. Ten rows of data become ten tiles. The real `dtile()`, two lines. One fix travelling from `style2.js` to the film, the labs and the scenarios. |
| 6. The camera | A platform drawn with the film's components, seen whole. The camera's three numbers, and the window it will show. The real `setCam()`. The camera flies into the staging models, the numbers rolling. |
| 7. Time | Tiles flow; a slider shows the moment being drawn. One tile is followed with its formula, x = 720 + 65 × (t − t₀). The clock is dragged back and forward, and the tiles follow. Constant against eased motion, with the real `easeCam`. The real `hash`, and ten tiles whose roles it decides. The same frame on two computers. |
| 8. Two ways to play | Live: a browser plays *The Inner Life of Data* while its soundtrack's playhead moves. Video: a browser with no window draws frames into an encoder, which keeps the first frame whole and then what changed. The sizes as areas. A flipbook against a recipe. |
| 9. 2:31 again | The frame returns, with each idea named over it; then *The Inner Life of Data* plays on from 2:31. The last line, and the end card. |

## Narration

### 1. One frame

> This is The Inner Life of Data, two minutes and thirty-one seconds in.

> Let's stop it here, and look closer.

> Closer.

> The picture breaks into tiny squares: pixels. And each pixel is only three numbers.

> How much red, how much green and how much blue, each from zero to two hundred and fifty-five.

### 2. A picture is data

> A frame is a grid of these numbers: nineteen hundred and twenty pixels across, and a thousand and eighty down.

> That's about two million pixels, and six million numbers, in one frame.

> The film shows thirty frames every second.

> Nobody typed those numbers. So where do they come from?

### 3. Instructions, not pixels

> From code. And code doesn't say which pixels to colour. It describes shapes.

> Fill a rectangle here, this wide, in this colour.

> A circle. A line. A curve. A word.

> The browser works out which pixels each shape covers.

> Where an edge cuts through a pixel, that pixel gets part of the colour, so the edge looks smooth instead of jagged.

> The film's real code is denser, but it's the same idea: shapes, positions and colours.

### 4. Layers

> Take one of the film's data tiles. It's drawn in five layers.

> A dark card, a piece of the picture, a frame, corner marks, and a timestamp.

> Order matters. Whatever is drawn later covers what came before, like paint.

> Draw the picture last, and the timestamp disappears.

> Light is different. Where two glows overlap, the code adds their numbers together, as real light does.

> That's how the lenses shine.

> And a raw tile's glitch is done with the numbers too: the code slides the red and blue a few pixels sideways.

### 5. Components

> Nobody draws each tile by hand. The tile is a function.

> Give it a position, a size, a piece of the picture and how clean it is, and it draws itself.

> Feed it ten rows of data, and you get ten tiles.

> Here's the real one: two lines, called in almost every frame of the film.

> The film, the labs and the scenarios call the same functions. Fix one, and the fix lands everywhere.

### 6. The camera

> The whole platform is drawn at its own size, much bigger than the screen.

> So the camera isn't a lens. It's three numbers: where to look, across and down, and how far to zoom.

> One instruction applies them before anything is drawn.

> Change the numbers smoothly, and we fly from the whole platform into one housing.

### 7. Time

> So far, one frame. But a film moves.

> Every frame is a function of time. Give the code a moment, and it draws that moment.

> Where is this tile now? It set off from here, at this speed, this long ago. So it's there.

> Go back, or jump ahead, and the code simply draws that moment instead.

> Motion needs care. At a constant speed, it looks mechanical. Eased in and out, it looks calm.

> Even what looks random isn't. Which tiles are glitched or duplicated comes from a formula.

> So the same moment draws the same way, every time, on any computer.

### 8. Two ways to play

> That gives the films two ways to play.

> On the site, your browser downloads the code and the soundtrack. Each time your screen refreshes, it asks the soundtrack how far it has played, and draws that moment.

> For a video file, a browser with no window draws every frame, thirty for each second, and hands them to an encoder.

> The encoder mostly keeps what changed from one frame to the next.

> Stored as raw numbers, The Inner Life of Data would take about eighty gigabytes. The video takes about two hundred megabytes. The code and the sound, about seven.

> A flipbook keeps every page. The live film keeps none: it's the recipe. The video is a flipbook, made from that recipe.

### 9. 2:31 again

> Now let's put the frame back together.

> Numbers. Shapes. Layers. Components. A camera. And time.

> And the film plays on.

> A picture is data. A film is a function.

## Rigour sheet

What each claim rests on. Behaviour marked *Chromium* was checked on 27 September 2026 in Chromium 141, the browser the release workflow renders with; the film's own code was read on the same day.

| Claim | What's true | What the picture simplifies |
|---|---|---|
| A pixel is three numbers, 0 to 255 | The canvas stores each pixel as four 8-bit numbers, red, green, blue and alpha (transparency), in sRGB (*Chromium*: `getImageData` returns a `Uint8ClampedArray`, colour space `srgb`). The numbers on screen are read from the real frame at 2:31. | The film leaves out alpha, which is 255 (opaque) everywhere in a finished frame. Screens with wide colour or HDR can use more than 8 bits; the films don't. |
| 1,920 × 1,080, thirty frames a second | The films are designed at 1920×1080 and rendered at 30 frames a second (`tools/render.py`). | On the site, the live player draws at your screen's size, up to 1920 wide, and at your screen's refresh rate. |
| Code describes shapes; the browser works out the pixels | Canvas 2D calls (`fillRect`, `arc`, `lineTo`, `bezierCurveTo`, `fillText`) are rasterised by the browser, in Chromium by the Skia library, on the processor or the graphics card. | The "simplified code" is pseudo-code; the real calls take numbers in the same order. |
| Edge pixels get part of the colour | Anti-aliasing: a pixel the edge crosses is blended by how much of it the shape covers. | The grid on screen is worked out by the film with 8×8 samples per pixel. Browsers compute coverage their own way, and the exact shades can differ between browsers. |
| Later drawings cover earlier ones | The default compositing, `source-over`, paints each shape over what's there (*Chromium*: blue then orange gives 255, 110, 60). | — |
| Glows add up, as light does | The film's `glow()` and `beam()` draw with `lighter`, which adds the numbers and caps them at 255 (*Chromium*: 70, 130, 255 plus 255, 110, 60 gives 255, 240, 255). | Real light adds in linear light; `lighter` adds the stored sRGB numbers, which is close enough for glow. |
| The glitch slides red and blue sideways | `tile2()` in `style2.js` reads each raw tile's red from a few pixels to one side and its blue from the other, adds bands, dropouts and scan lines, and tints it by its source system. | The film shows only the channel shift. |
| The tile is a function, called in almost every frame | `dtile()` in `style2.js`, two lines, draws every data tile in the films, the labs and the scenarios; `tile2()` builds and caches the tile's picture. | The simplified `tile(...)` names four of its inputs; the real one also takes rotation, transparency, the source system and whether the tile failed a test. |
| The camera is three numbers, applied before anything is drawn | `setCam()` in `core.js` sets one transform (move, then scale) from the camera's x, y and zoom; each scene sets it before drawing its world. | The platform flown over in chapter 6 is drawn for this film with the same components; it isn't *The Inner Life of Data*'s own layout. |
| Every frame is a function of time | Each scene is a function `draw(ctx, S, t)`; tiles on the beam are at x = 720 + 65 × (t − t₀) in this film's platform, as in the refinery of *The Inner Life of Data*. | — |
| Eased motion | The camera moves along `easeCam`, half a cosine wave. | — |
| What looks random isn't | `hash()` in `core.js` is a formula (a sine, scaled, keeping the fraction), so the same input always gives the same number, and which tiles are glitched, duplicated or failing is decided by it. | — |
| The same moment, on any computer | Because of the above, a frame depends only on its time. Fonts are embedded in the render page, so renders don't depend on the machine's fonts. | Different browsers can still draw text and edges a little differently; the release workflow always renders with the same Chromium. |
| Live: the browser asks the soundtrack how far it has played | The player runs on `requestAnimationFrame`, which calls it before each screen refresh (60 times a second on most screens, more on some), and while the sound plays it sets the time from the audio's `currentTime` (`engine3.js`). It draws only while the player is on screen. | — |
| Video: a browser with no window draws every frame | `tools/render.py` opens the film in headless Chromium with Playwright, asks for each frame at 1/30 s steps as a JPEG, and pipes them to ffmpeg, which encodes H.264 (CRF 18, colour at a quarter of the resolution, `yuv420p`), in chunks that can resume. | "Keeps what changed": H.264 stores some frames whole and predicts the others from their neighbours, storing the differences. |
| 84 GB, 200 MB, 7 MB | *The Inner Life of Data* is 7:32 (452.2 s): 13,566 frames × 6,220,800 bytes = 84.4 GB as raw 8-bit RGB. Its video in release v3.0 is 195.5 MB. On the site it plays from `film.js` (228 KB) and `soundtrack.mp3` (6.3 MB), 6.6 MB together. | Sizes in decimal units. The video also carries sound; the raw figure doesn't. |
| A flipbook and a recipe | The video stores every frame (compressed); the player stores none and draws each on demand. | The video is "a flipbook" in that sense only: it keeps whole frames and differences, not 13,566 separate pictures. |

## References

- The films' code: [`core.js`](../../inner-life-of-data/source/src/core.js) (`hash`, `easeCam`, `setCam`, `glow`), [`style2.js`](../../inner-life-of-data/source/src/style2.js) (`gate`, `tile2`, `dtile`), [`engine3.js`](../../inner-life-of-data/source/src/engine3.js) (the timeline and the player), [`render.py`](../../inner-life-of-data/source/tools/render.py) (the video).
- HTML Living Standard, the 2D canvas: `fillRect`, `arc`, `getImageData`, `globalCompositeOperation`.
- Compositing and Blending Level 1 (W3C): `source-over` and `lighter` (plus-lighter).
- ITU-T H.264, Advanced video coding for generic audiovisual services.
- Release v3.0 of this repository, for the video's size.
