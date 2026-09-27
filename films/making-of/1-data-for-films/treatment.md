# Data for Films

*Treatment for the first of [two films on the Making of page](../README.md), v0.2: the main decisions are made (see [Decisions](#decisions)). Status: agreed in outline; next, the script.*

## The promise

**Who for:** anyone who has watched one of the films and wondered how it was made. A teenager understands it, and a graphics engineer agrees with it.

**The theme: a picture is data, and a film is a function.** Every frame of *The Inner Life of Data* is about six million numbers. Nobody wrote those numbers. Code gives instructions (a rectangle here, a glow there, this tile on top of that one), the browser turns them into pixels, and time decides which instructions run. The same recipe draws the film live in your browser and bakes it into a video file.

**Logline.** Freeze one frame of *The Inner Life of Data*, zoom in until one pixel fills the screen, and build that frame back up: from one number, to shapes, to layers, to components, to a camera, to time, until the film plays again.

**Why it's worth making.** It's the most visible use of data on the site, and the one people ask about. It also explains why the site plays about 7 MB of code and sound instead of a 150 MB video, and why a fix in the code reaches the film, the labs and the video at once.

## The frame to follow: 2:31, refining with dbt

The film follows one moment, **2:31** of *The Inner Life of Data*, in *Refining with dbt*. It has every kind of element the film uses, in one picture:

- **Shapes and text:** the housings, their labels and the line of dbt code across the top.
- **Images:** the dbt logo, and a painting at the edge of the frame.
- **Light:** the glass lenses and their glow, which only look right because light adds up.
- **Components fed by data:** data tiles with their timestamps, rows of check marks, and the SQL warehouse's grid of lights.
- **Motion:** tiles travelling through the lenses and getting sharper, so the frame means nothing without time.
- **A failure:** one tile stopped by the relationships test, in red.

It's also the chapter where the film shows code, so the film about code starts from a frame that already shows some.

## The spine: one frame, taken apart and built again

| Chapter | What happens | What it teaches |
|---|---|---|
| **0. One frame** | The film plays, then freezes at 2:31. The camera dives in until the picture breaks into squares, then into one square showing three numbers (read from the real frame when scripting). | What you see on a screen is a grid of coloured squares, and each colour is three numbers: red, green and blue. |
| **1. A picture is data** | Zoom out slowly. The numbers become colours; a 16 × 9 grid becomes a 1920 × 1080 one. A counter: 2,073,600 pixels, 6.2 million numbers, 30 times a second. | Scale. A frame is a table of numbers, and a film is a lot of them. |
| **2. Instructions, not pixels** | The screen splits: one line of code on the left, what it draws on the right. A rectangle, a circle, a line, a curve, a word. Zoom into a curve's edge: pixels part-covered by the shape are part-coloured. Then, for three seconds, the real line that draws a housing, dense and unedited, before going back to the simple version. | Nobody writes pixels. Code describes shapes, and the browser works out which pixels each shape covers (rasterising), softening the edges (anti-aliasing). The real code is the same idea, only more of it. |
| **3. Layers** | One data tile is built in five steps: background, picture, frame, corner marks, timestamp. Swap the order, and the timestamp disappears under the picture. Then a lens: two glows overlap, and where they meet they add up, like real light. | Order matters: what's drawn later covers what's drawn earlier. Transparency mixes colours; "lighter" blending adds them, which is how glow works. |
| **4. Components** | The tile becomes a function: give it a picture, a sharpness and a timestamp, and it draws itself. Call it with ten rows of data, and a queue of tiles fills the housing. The same for the check marks: one per test result. A glimpse of the real function. | Components, fed by data. The same function draws the film, the labs and the scenarios, so a fix lands everywhere. |
| **5. The camera** | The whole platform is drawn once, far larger than the screen. The camera is one instruction applied before everything else: move and scale. Change two numbers, and we fly from the platform overview into the housing at 2:31. | A camera is a transformation, not a lens. Zooms are numbers changing over time. |
| **6. Time** | A slider appears under the frame, labelled `t`. Drag it, and the tiles move through the lenses and sharpen, the check marks tick, the red tile stops. Two curves side by side: linear motion looks mechanical; an eased curve looks calm. The glitches on raw tiles look random, yet are the same every time. | Every frame is a function of time: give the code a moment, and it draws that moment. Easing makes motion feel natural. "Random" is a formula, so any frame can be drawn again, exactly. |
| **7. Two ways to play** | Split in two. **Live:** at every screen refresh, the browser asks the soundtrack "where are we?" and draws that moment. **Video:** a browser with no window draws every 1/30 of a second, and the frames go into a video file, which mostly stores what changed between them. The numbers side by side: raw frames about 80 GB, the video about 150 MB, the code and sound about 7 MB. | A recipe and a meal. The live film is small, sharp at any size and interactive; the video plays anywhere. Both come from one source. |
| **8. 2:31 again** | Every layer returns in order, in a few seconds: numbers, shapes, layers, components, camera, time. The frame is whole, and the film plays on from 2:31. | Everything together, once, fast, so the viewer sees how much happens in every frame. |

## The hardest mechanism, and the twist

The idea that's hardest to explain is **"every frame is a function of time"**. The usual picture of animation, a flipbook, breaks exactly there: a flipbook stores every page, and this film stores none. That break is the twist of chapter 7. The video file *is* the flipbook, made at the end; the live film is the recipe that made it.

## Look and sound

- **The film's own design language:** dark glass, luminous edges and the same components, so viewers recognise them.
- **Code on screen, simplified first, then real.** Each idea starts with one or two clean lines, in the mono font, with the running line lit. Twice (chapters 2 and 4), the real code appears for a few seconds, dense and unedited, then the film goes back to the simple version. The rigour sheet lists every simplification.
- **Numbers are shown, not read aloud.** The narration says "six million numbers"; the counter shows the exact value.
- **Music:** lighter and more playful than *The Inner Life of Data*, building as the layers return in chapter 8.
- **Length:** 5 to 6 minutes, about 125 words a minute, with room after chapters 1, 3 and 6, where the new ideas land.

## Rigour to check when scripting

- How the browser rasterises a 2D canvas (in software or on the graphics card, depending on the browser), and what anti-aliasing does at an edge.
- 8-bit colour per channel in sRGB, and what the canvas stores (red, green, blue and transparency).
- Blending: `source-over` and `lighter`, and what the film uses each for.
- `requestAnimationFrame`: it follows the screen's refresh rate (60 Hz on most screens, 120 Hz on some), not a fixed 60.
- The audio clock: how precise `currentTime` is, and why the film follows it.
- The render: frames drawn by headless Chromium, passed to ffmpeg as JPEG, encoded as H.264 with keyframes and difference frames, and colour stored at a quarter of the resolution (`yuv420p`).
- Exact figures on the day: the film is 7:32 today (13,566 frames at 30 fps, about 84 GB as raw frames); the code and soundtrack sizes; the video size; the pixel values at 2:31.

## Decisions

Made by the author on 27 September 2026:

1. **Where it lives:** on the Making of page, at the top, as the first of two films. The second shows how the films are made, by a person and Claude (see [its treatment](../2-the-process/treatment.md)).
2. **The frame to follow:** Claude's choice, 2:31 in *Refining with dbt*, for the reasons above.
3. **Code on screen:** simplified first, then a quick look at the real code.
4. **The title:** *Data for Films*.
5. **Labs:** none.

Still open: the last line. A proposal: "A picture is data. A film is a function."

## Next checkpoints

1. ~~Agree this treatment.~~ Done in outline.
2. Script with a rigour sheet and pacing report.
3. Style frames: one pixel's three numbers, the split screen of code and result, the tile's layers pulled apart, and the `t` slider.
4. A voice test, and the first cut.
