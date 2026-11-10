/* Learning Data: "Where next?" when a film ends. The words and links come from the page's <template id="next-panel">,
   so this file holds no URLs and no text. It reuses the "Pause and think" overlay (.think), and [data-again] plays the film again.
   Escape closes it until the film plays again.
   Keyboard: focus moves into the panel only if it was on the film (or nowhere), and goes back to the Play button when the panel closes. */
(()=>{"use strict";
const F=window.FILM,box=document.querySelector(".player"),tpl=document.getElementById("next-panel");
if(!F||!box||!tpl||!tpl.content||typeof TL==="undefined")return;
const area=document.getElementById("watch")||box,play=document.getElementById("play");
let panel=null,closed=false,was=false;
function hide(){if(!panel)return;const had=panel.contains(document.activeElement);panel.remove();panel=null;
  if(had&&play)play.focus({preventScroll:true});}
function show(focus){panel=document.createElement("div");panel.className="think next";panel.setAttribute("role","dialog");
  panel.append(tpl.content.cloneNode(true));const h=panel.querySelector("h3");if(h){h.id="next-panel-h";panel.setAttribute("aria-labelledby","next-panel-h");}
  const again=panel.querySelector("[data-again]");if(again)again.onclick=()=>{hide();F.play();};   // play() at the end starts again from 0
  panel.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();hide();closed=true;}
    // Space on a link would reach the player and start the film again; links open with Enter
    else if(e.key===" "&&e.target.closest("a"))e.stopPropagation();});
  box.insertBefore(panel,box.querySelector(".bar"));
  // focus moves to the panel only when the film has just played to its end, not while someone drags the scrubber,
  // and only if it was on the film: someone reading elsewhere on the page keeps their place
  const first=panel.querySelector("a,button"),a=document.activeElement;
  if(focus&&first&&(!a||a===document.body||area.contains(a)))first.focus({preventScroll:true});}
(function tick(){if(F.time){const p=F.playing();if(p)closed=false;const end=!p&&F.time()>=TL.total-0.05;
  if(end&&!panel&&!closed)show(was);else if(!end&&panel)hide();was=p;}requestAnimationFrame(tick);})();
})();
