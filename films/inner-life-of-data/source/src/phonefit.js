/* ===== The phone layer, kept to the film's own picture =====
   From words to data's phone.js (loaded just before this file) raises text to 28 px on any canvas as wide as the frame. This
   film's player also serves the site's labs, which draw its components on canvases of their own and size their text for their
   real width (PLAYBOOK.md, "Labs and scenarios keep their sizes"); a lab canvas can be as wide as the frame by chance. So here
   the layer acts only on the canvas the film draws its frame on, and on the copy the engine draws a chapter's last moment on
   during each dissolve (OFF, in engine3.js). phone.js itself stays as it is: it is copied into other films' players. */
let PH_C=null;
renderFrame=(f=>function(ctx,S,t){PH_C=ctx.canvas;return f(ctx,S,t);})(renderFrame);
phK=(f=>function(ctx){const c=ctx.canvas;return c===PH_C||(typeof OFF!=="undefined"&&OFF&&c===OFF)?f(ctx):0;})(phK);
