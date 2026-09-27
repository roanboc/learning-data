# Drawn in code

*Treatment for a short film on the Making of page, v0.1: a first proposal. Status: for discussion; see [Decisions to make](#decisions-to-make).*

## The promise

**Who for:** anyone who has watched one of the films and wondered how it was made. A teenager understands it, and a graphics engineer agrees with it.

**The theme: a picture is data, and a film is a function.** Every frame of *The Inner Life of Data* is about six million numbers. Nobody wrote those numbers. Code gives instructions (a rectangle here, a glow there, this tile on top of that one), the browser turns them into pixels, and time decides which instructions run. The same recipe draws the film live in your browser and bakes it into a video file.

**Logline.** Freeze one frame of *The Inner Life of Data*, zoom in until one pixel fills the screen, and build that frame back up: from one number, to shapes, to layers, to components, to a camera, to time, until the film plays again.

**Why it's worth making.** It's the most visible use of data on the site, and the one people ask about. It also explains why the site plays a 230 KB file instead of a 150 MB video, and why a fix in the code reaches the film, the labs and the video at once.

## The spine: one frame, taken apart and built again

Follow one moment, **2:31** of *The Inner Life of Data*: the gold gallery, with a vault, data tiles, paintings, glow and a caption. It has every kind of element in it. The film goes down to a single pixel, then climbs back up, adding one idea at a time, until 2:31 is whole and the film plays on.

| Chapter | What happens | What it teaches |
|---|---|---|
| **0. One frame** | The film plays, then freezes at 2:31. The camera dives in until the picture breaks into squares, then into one square showing three numbers: `252, 218, 124`. | What you see on a screen is a grid of coloured squares, and each colour is three numbers: red, green and blue. |
| **1. A picture is data** | Zoom out slowly. The numbers become colours; a 16 × 9 grid becomes a 1920 × 1080 one. A counter: 2,073,600 pixels, 6.2 million numbers, 30 times a second. | Scale. A frame is a table of numbers, and a film is a lot of them. |
| **2. Instructions, not pixels** | The screen splits: one line of code on the left, what it draws on the right. `fillRect`, then a circle, a line, a curve, a word. Zoom into a curve's edge: pixels part-covered by the shape are part-coloured. | Nobody writes pixels. Code describes shapes, and the browser works out which pixels each shape covers (rasterising), softening the edges (anti-aliasing). |
| **3. Layers** | One data tile is built in five steps: background, glass, edge light, icon, label. Swap the order, and the label disappears under the glass. Two lights overlap, and where they meet they add up, like real light. | Order matters: what's drawn later covers what's drawn earlier. Transparency mixes colours; "lighter" blending adds them, which is how glow works. |
| **4. Components** | The tile becomes a function: give it a colour, a label and a fill level, and it draws itself. Call it twenty times with twenty rows of data, and a vault fills with tiles. The same for a vault, a painting, a plaque. | Components, fed by data. The same function draws the film, the labs and the scenarios, so a fix lands everywhere. |
| **5. The camera** | The whole world is drawn once, far larger than the screen. The camera is one instruction applied before everything else: move and scale. Change two numbers, and we fly from the platform overview into the gallery. | A camera is a transformation, not a lens. Zooms are numbers changing over time. |
| **6. Time** | A slider appears under the frame, labelled `t`. Drag it, and the tiles move, the lights pulse, the caption changes. Draw two curves: linear motion looks mechanical; an eased curve looks calm. Sparkles that look random are the same every time. | Every frame is a function of time: give the code a moment, and it draws that moment. Easing makes motion feel natural. "Random" is a formula, so any frame can be drawn again, exactly. |
| **7. Two ways to play** | Split in two. **Live:** the browser asks the soundtrack "where are we?" at every screen refresh, and draws that moment. **Video:** a browser with no window draws every 1/30 s, and the frames go into a video file, which mostly stores what changed between them. The numbers side by side: raw frames about 70 GB, the video about 150 MB, the code and sound about 7 MB. | A recipe and a meal. The live film is small, sharp at any size and interactive; the video plays anywhere. Both come from one source. |
| **8. 2:31 again** | Every layer returns in order, in a few seconds: numbers, shapes, layers, components, camera, time. The frame is whole, and the film plays on from 2:31. | Everything together, once, fast, so the viewer sees how much is happening in each frame. |

## The hardest mechanism, and the twist

The idea that's hardest to explain is **"every frame is a function of time"**. The usual picture of animation, a flipbook, breaks exactly there: a flipbook stores every page, and this film stores none. That break is the twist of chapter 7. The video file *is* the flipbook, made at the end; the live film is the recipe that made it.

## Look and sound

- **The film's own design language:** dark glass, luminous edges and the same components, so viewers recognise them.
- **Code on screen, but short:** one or two lines at a time, in the mono font, with the line that's running lit. Real code from the film, simplified only where the rigour sheet says so.
- **Numbers are shown, not read aloud.** The narration says "six million numbers"; the counter shows the exact value.
- **Music:** lighter and more playful than *The Inner Life of Data*, building as the layers return in chapter 8.
- **Length:** 5 to 6 minutes, about 125 words a minute, with room after chapters 1, 3 and 6, where the new ideas land.

## Labs (optional)

The site already draws live, so this film suits labs better than any other:

- **Pixel peeper:** zoom into any frame of any film until you see the numbers, and the part-coloured pixels at an edge.
- **Build a tile:** turn layers on and off, change their order and blending, and see the result.
- **Scrub time:** drag `t` and change the easing curve; watch the same motion feel mechanical or calm.

## Rigour to check when scripting

- How the browser rasterises a 2D canvas (in software or on the graphics card, depending on the browser), and what anti-aliasing does at an edge.
- 8-bit colour per channel in sRGB, and what the canvas stores (red, green, blue and transparency).
- Blending: `source-over` and `lighter`, and what the film uses each for.
- `requestAnimationFrame`: it follows the screen's refresh rate (60 Hz on most screens, 120 Hz on some), not a fixed 60.
- The audio clock: how precise `currentTime` is, and why the film follows it.
- The render: frames drawn by headless Chromium, passed to ffmpeg, encoded as H.264 with keyframes and difference frames, and colour stored at a quarter of the resolution (`yuv420p`).
- Exact figures on the day: the code and soundtrack sizes, the video size, the frame count and the raw size of *The Inner Life of Data*.

## Decisions to make

1. **Where it lives.** On the Making of page, as its own film with chapters, or as a new topic ("How the films are drawn")?
2. **The frame to follow.** 2:31 (the gold gallery) has the most kinds of element. The organisational brain or the platform overview are alternatives.
3. **How much code to show.** Real lines from the film (more honest, a bit harder) or cleaned-up versions (easier, but then the rigour sheet must say so).
4. **The title.** *Drawn in code*; alternatives: *One frame at a time*, *A film is a function*. In Spanish, *Dibujado en código*.
5. **Labs.** None, or the three above.
6. **The last line.** A proposal: "A picture is data. A film is a function."

## Next checkpoints

1. Agree this treatment.
2. Script with a rigour sheet and pacing report.
3. Style frames: one pixel's three numbers, the split screen of code and result, the tile's layers pulled apart, and the `t` slider.
4. A voice test, and the first cut.
