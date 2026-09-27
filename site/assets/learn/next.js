/* Learning Data: "Where next?" when a film ends. The words and links come from the page's <template id="next-panel">,
   so this file holds no URLs and no text. It reuses the "Pause and think" overlay (.think), and [data-again] plays the film again.
   Escape closes it until the film plays again. */
(()=>{"use strict";
const F=window.FILM,box=document.querySelector(".player"),tpl=document.getElementById("next-panel");
if(!F||!box||!tpl||!tpl.content||typeof TL==="undefined")return;
let panel=null,closed=false,was=false;
function hide(){if(panel){panel.remove();panel=null;}}
function show(focus){panel=document.createElement("div");panel.className="think next";panel.setAttribute("role","dialog");
  panel.append(tpl.content.cloneNode(true));const h=panel.querySelector("h3");if(h){h.id="next-panel-h";panel.setAttribute("aria-labelledby","next-panel-h");}
  const again=panel.querySelector("[data-again]");if(again)again.onclick=()=>{hide();F.play();};   // play() at the end starts again from 0
  panel.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();hide();closed=true;}});
  box.insertBefore(panel,box.querySelector(".bar"));
  // focus moves to the panel only when the film has just played to its end, not while someone drags the scrubber
  const first=panel.querySelector("a,button");if(focus&&first)first.focus({preventScroll:true});}
(function tick(){if(F.time){const p=F.playing();if(p)closed=false;const end=!p&&F.time()>=TL.total-0.05;
  if(end&&!panel&&!closed)show(was);else if(!end&&panel)hide();was=p;}requestAnimationFrame(tick);})();
})();
