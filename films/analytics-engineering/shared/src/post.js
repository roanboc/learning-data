/* ===== In the weeds of data crafting: the video's finishing pass =====
   Loaded after the engine. Only the rendered video uses it (tools/render.py calls renderAt); the site's player draws live, as before.
   Motion blur: each video frame is the average of MB moments across a third of a frame (a 126-degree shutter), so movement reads as filmed; eight moments keep fast things smooth rather than doubled.
   Then a soft glow on the bright parts, and a fine grain that changes every frame. Stills (tools/stills.py) show neither. */
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d"),B=mkCanvas(W/4,H/4),bx=B.getContext("2d"),G=mkCanvas(256,256),gx=G.getContext("2d");
  // grain: a tile of soft noise, shifted every frame
  const im=gx.createImageData(256,256);for(let i=0;i<im.data.length;i+=4){const v=128+(hash(i,7)-0.5)*255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}gx.putImageData(im,0,0);
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    // glow: a blurred, darkened copy of the bright parts, added softly
    bx.filter="blur(6px) brightness(0.85) contrast(1.6)";bx.clearRect(0,0,B.width,B.height);bx.drawImage(A,0,0,B.width,B.height);bx.filter="none";
    ox.globalCompositeOperation="screen";ox.globalAlpha=0.16;ox.drawImage(B,0,0,W,H);
    // grain
    const f=Math.round(t*30),dx=(f*97)%256,dy=(f*61)%256;ox.globalCompositeOperation="overlay";ox.globalAlpha=0.05;
    for(let y=-dy;y<H;y+=256)for(let x=-dx;x<W;x+=256)ox.drawImage(G,x,y);
    ox.globalCompositeOperation="source-over";ox.globalAlpha=1;return out.toDataURL("image/jpeg",q||0.9);};})();}
