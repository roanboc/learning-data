/* ===== The data governance series: the video's finishing pass =====
   Loaded after the engine. Only the rendered video uses it (tools/render.py calls renderAt); the site's player draws live.
   Motion blur: each video frame is the average of MB moments across a third of a frame (a 126-degree shutter), so movement reads as
   filmed. No glow (it washes out the town's pastels) and no film grain (noise doesn't compress). Stills (tools/stills.py) don't show it. */
if(window.__RENDER__){(function(){const MB=6,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    return out.toDataURL("image/jpeg",q||0.9);};})();}
