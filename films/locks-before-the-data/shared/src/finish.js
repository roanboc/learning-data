/* ===== Data protection and privacy: what a film needs before it starts, and the video's motion blur =====
   prepAssets takes the place of the engine's: the fonts, and the tools' logos for a film that shows them; then the film's pictures,
   each made once and kept: each place (AG_PLACES) and its frost (glass.js), and each person the film lists in DP_PEOPLE, in their light
   (night.js). The video and the checks make them all before they start. The site's player makes the first place and its frost at once
   (the poster covers the film until then), and the rest one picture at a time while the page is idle, once the film has started, so
   nothing holds the page or the soundtrack for long; whatever is drawn before its turn comes is made the first time it's drawn. */
function dp_prepList(){const L=[];Object.keys(AG_PLACES).forEach(k=>{L.push(()=>ag_place(k),()=>dp_frostPlace(k));});
  DP_PEOPLE.forEach(p=>{const [who,light]=Array.isArray(p)?p:[p];L.push(...dp_prepSteps(who,light));});return L;}
async function prepAssets(){await fontsReady3();if(typeof LOGO_SRC!=="undefined")await loadLogos();const steps=dp_prepList();
  if(window.__RENDER__){steps.forEach(f=>f());return;}
  const cv=document.getElementById("film");if(cv&&Object.keys(AG_PLACES).length){steps.shift()();steps.shift()();}
  let i=0;const idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:1000}):setTimeout(f,60);
  const next=()=>{if(i>=steps.length)return;steps[i++]();idle(next);},go=()=>setTimeout(()=>idle(next),200);
  const box=cv&&cv.closest(".player");if(!box)return;if(box.classList.contains("started")){go();return;}
  const mo=new MutationObserver(()=>{if(box.classList.contains("started")){mo.disconnect();go();}});mo.observe(box,{attributes:true,attributeFilter:["class"]});}
// the video's motion blur, as the agent films': each frame is the average of eight moments while a shutter is open a third of a frame
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    return out.toDataURL("image/jpeg",q||0.9);};})();}
