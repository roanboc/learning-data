/* ===== The data governance series: what the films need before they start, and the video's finishing pass =====
   Loaded after the engine, so its prepAssets is the one the engine calls: the fonts and the tools' logos, then the paper and the
   pigment's grain of the master data series' watercolour (its wash.js), then each place the film paints (WC_PLACES, in the film's own
   pictures). The rendered video and the checks paint every place before they start; the site's player paints the first, then the
   others one by one while the film plays, so it starts quickly. The same as the master data series' post.js, with the logos, but
   each of the others waits until the page is idle (or a second has passed): back to back, the prologue's 38 places held the
   page for seconds at a time on a slow machine, so a click on "Watch again" landed late and the film had run on.
   And none of the others is painted before the visitor starts the film (Play, a chapter or the bar). A place takes 0.1 to 0.4 s
   on a fast machine and several times that on a laptop or phone, and keeps a full-size picture (8 MB) in memory: these films have
   10 to 38 places, against master data's 5 to 8, so painting them all as the page opened froze the page again and again while
   the visitor was only reading it (2 November 2026).
   Where the film was published with its places drawn as pictures (places/ beside film.js, master data's wash.js), the player paints
   none: it waits for the pictures of the moment it starts at, and shows each place as its picture. Painted while the film played,
   they froze it again and again on a laptop, the soundtrack running on (5 November 2026).
   Then, for the video only (tools/render.py calls renderAt), motion blur: each video frame is the average of MB moments across a third
   of a frame (a 126-degree shutter), so movement reads as filmed. No glow: it would wash out the paper. No film grain: the paper is
   the grain. */
async function prepAssets(){await fontsReady3();await loadLogos();if(window.__RENDER__)wc_prep();else await wc_prepSoft();const ks=typeof WC_PLACES!=="undefined"?Object.keys(WC_PLACES):[];
  if(window.__RENDER__){ks.forEach(gv_place);return;}
  if(await wc_picsLoad()){await wc_picsReady(window.FILM&&FILM.time?FILM.time():0);return;}
  const cv0=document.getElementById("film");if(ks.length&&cv0){await new Promise(r=>setTimeout(r,0));gv_place(ks[0]);}let i=1;const idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:1000}):setTimeout(f,60);
  const next=()=>{if(i>=ks.length)return;gv_place(ks[i++]);idle(next);},go=()=>setTimeout(()=>idle(next),200);
  // a page without a player (labs, scenarios) paints a place only when it first draws it (the kept picture is made then), never all of
  // them ahead: painting every place as a labs page opened held it for seconds (4 November 2026)
  const cv=document.getElementById("film"),box=cv&&cv.closest(".player");if(!box)return;if(box.classList.contains("started")){go();return;}
  const mo=new MutationObserver(()=>{if(box.classList.contains("started")){mo.disconnect();go();}});mo.observe(box,{attributes:true,attributeFilter:["class"]});}
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    return out.toDataURL("image/jpeg",q||0.9);};})();}
if(!window.__RENDER__)renderFrame=wc_liveFrame(renderFrame);
