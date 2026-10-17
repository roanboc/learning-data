/* ===== The data governance series: what the films need before they start, and the video's finishing pass =====
   Loaded after the engine, so its prepAssets is the one the engine calls: the fonts and the tools' logos, then the paper and the
   pigment's grain of the master data series' watercolour (its wash.js), then each place the film paints (WC_PLACES, in the film's own
   pictures). The rendered video and the checks paint every place before they start; the site's player paints the first, then the
   others one by one while the film plays, so it starts quickly. The same as the master data series' post.js, with the logos.
   Then, for the video only (tools/render.py calls renderAt), motion blur: each video frame is the average of MB moments across a third
   of a frame (a 126-degree shutter), so movement reads as filmed. No glow: it would wash out the paper. No film grain: the paper is
   the grain. */
async function prepAssets(){await fontsReady3();await loadLogos();wc_prep();const ks=typeof WC_PLACES!=="undefined"?Object.keys(WC_PLACES):[];
  if(window.__RENDER__){ks.forEach(gv_place);return;}
  if(ks.length)gv_place(ks[0]);let i=1;const next=()=>{if(i>=ks.length)return;gv_place(ks[i++]);setTimeout(next,60);};setTimeout(next,200);}
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    return out.toDataURL("image/jpeg",q||0.9);};})();}
