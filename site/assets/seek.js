/* Go back or forward 10 seconds in the film on the page, as on most video sites (asked by Rodrigo, 4 November 2026: dragging the bar
   back a few seconds was hard, above all on a phone). One file for every film page, so no film's bundle changes:
   - two buttons in the bar, after Play: back 10 s and forward 10 s;
   - on a phone or tablet, a double tap on the left half of the film goes back 10 s and on the right half forward 10 s; more taps
     on the same side, quickly after, go 10 s more each (a double tap there no longer opens full screen; a mouse double click still does);
   - on a computer, the left and right arrow keys, while most of the player is on screen and no other control has focus.
   Each jump shows a short cue on that side of the film ("-10 s"), and says it to a screen reader. It uses only FILM.seek and FILM.time,
   which every film's player has; it adds listeners and nothing that runs while the film plays.
   Play speed (asked 5 November 2026): a button after them steps through 1×, 1.25×, 1.5×, 2×, 0.5× and 0.75×, kept in this browser. */
(function(){
  const cv=document.getElementById("film"),box=cv&&cv.closest(".player"),bar=box&&box.querySelector(".bar"),play=document.getElementById("play");
  if(!box||!bar||!play)return;
  const ES=(document.documentElement.lang||"").startsWith("es"),STEP=10,
    T=ES?{back:"Atrás 10 segundos",fwd:"Adelante 10 segundos",said:(d,t)=>(d<0?"Atrás ":"Adelante ")+Math.abs(d)+" segundos, en "+t}
        :{back:"Back 10 seconds",fwd:"Forward 10 seconds",said:(d,t)=>(d<0?"Back ":"Forward ")+Math.abs(d)+" seconds, at "+t};
  const mk=(id,txt,lab)=>{const b=document.createElement("button");b.type="button";b.id=id;b.className="seek-btn";b.textContent=txt;b.setAttribute("aria-label",lab);b.title=lab+(ES?" (flechas ← →)":" (arrow keys ← →)");return b;};
  const back=mk("back10","−10",T.back),fwd=mk("fwd10","+10",T.fwd);
  back.insertAdjacentHTML("beforeend",'<span class="u"> s</span>');fwd.insertAdjacentHTML("beforeend",'<span class="u"> s</span>');
  // play speed: one button that steps through the speeds; the soundtrack sets the film's clock, so its rate sets the film's (pitch kept)
  const au=document.getElementById("snd"),SPEEDS=[1,1.25,1.5,2,0.5,0.75],speed=document.createElement("button");
  speed.type="button";speed.id="speed";speed.className="seek-btn";
  const sp=x=>String(x).replace(".",ES?",":".")+"×";
  function setSpeed(x,keep){if(!SPEEDS.includes(x))x=1;if(au){au.defaultPlaybackRate=x;au.playbackRate=x;if("preservesPitch" in au)au.preservesPitch=true;}
    speed.textContent=sp(x);speed.dataset.rate=x;speed.classList.toggle("on",x!==1);
    const lab=(ES?"Velocidad: ":"Speed: ")+sp(x);speed.setAttribute("aria-label",lab);speed.title=lab+(ES?" (pulsa para cambiar)":" (press to change)");
    if(keep){try{localStorage.setItem("ld-speed",String(x));}catch(e){}}}
  let saved=1;try{saved=parseFloat(localStorage.getItem("ld-speed"))||1;}catch(e){}
  setSpeed(saved,false);
  speed.onclick=()=>{const x=parseFloat(speed.dataset.rate);setSpeed(SPEEDS[(SPEEDS.indexOf(x)+1)%SPEEDS.length],true);};
  // a browser may put the rate back when the soundtrack loads
  if(au)au.addEventListener("loadedmetadata",()=>setSpeed(parseFloat(speed.dataset.rate),false));
  play.after(back,fwd,speed);
  // Play's state as an attribute, so a phone can show it as an icon (the film sets the button's words: Play, Pause, Loading…)
  const UIW=(window.L10N&&L10N.ui)||{},st=()=>{const w=play.textContent.trim();play.dataset.state=w===(UIW.pause||"Pause")?"pause":w===(UIW.load||"Loading…")?"load":"play";};
  st();new MutationObserver(st).observe(play,{childList:true,characterData:true,subtree:true});
  // the cue over the film, one for each side, and a line for screen readers
  const cue=s=>{const d=document.createElement("div");d.className="seek-cue "+s;d.setAttribute("aria-hidden","true");d.appendChild(document.createElement("span"));box.appendChild(d);return d;};
  const cues={l:cue("l"),r:cue("r")},live=document.createElement("span");live.className="seek-said";live.setAttribute("role","status");box.appendChild(live);
  const fmt=x=>{x=Math.max(0,Math.floor(x));return Math.floor(x/60)+":"+String(x%60).padStart(2,"0");};
  let run={side:null,n:0,until:0},hide=null;
  function jump(dir){const F=window.FILM;if(!F||!F.seek||!F.time)return;
    const now=performance.now(),side=dir<0?"l":"r";
    if(run.side===side&&now<run.until)run.n+=1;else run={side,n:1,until:0};run.until=now+900;
    F.seek(F.time()+dir*STEP);
    const c=cues[side],o=cues[side==="l"?"r":"l"];o.classList.remove("on");
    c.style.top=cv.offsetTop+"px";c.style.height=cv.offsetHeight+"px";
    c.firstChild.textContent=(dir<0?"−":"+")+run.n*STEP+" s";c.classList.add("on");
    clearTimeout(hide);hide=setTimeout(()=>{c.classList.remove("on");live.textContent=T.said(dir*run.n*STEP,fmt(F.time()));},700);}
  back.onclick=()=>jump(-1);fwd.onclick=()=>jump(1);
  // a double tap on the film (touch or pen only): the side of the film it lands on
  let lastT=0,lastSide=null,lastType="";
  cv.addEventListener("pointerdown",e=>{lastType=e.pointerType;},{passive:true});
  cv.addEventListener("pointerup",e=>{if(e.pointerType==="mouse"||!box.classList.contains("started"))return;
    const r=cv.getBoundingClientRect(),side=e.clientX<r.left+r.width/2?"l":"r",now=performance.now();
    if(run.side===side&&now<run.until){jump(side==="l"?-1:1);lastT=0;return;}  // more taps after a double tap: 10 s more each
    if(lastSide===side&&now-lastT<350){jump(side==="l"?-1:1);lastT=0;}else{lastT=now;lastSide=side;}},{passive:true});
  // the player's own double click opens full screen; on a touch screen the double tap seeks instead
  box.addEventListener("dblclick",e=>{if(e.target===cv&&lastType&&lastType!=="mouse"){e.stopPropagation();e.preventDefault();}},true);
  // the arrow keys, under the same rule as the player's own keys (Space, F)
  const fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
  window.addEventListener("keydown",e=>{if((e.key!=="ArrowLeft"&&e.key!=="ArrowRight")||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.defaultPrevented)return;
    const tg=e.target instanceof Element?e.target:document.body,own=box.contains(tg);
    if(own&&tg.closest(".think"))return;
    if(!own&&tg.closest&&tg.closest("a,button,input,select,textarea,[contenteditable],[role=button],[role=radio],[role=option],[tabindex]"))return;
    if(!fsEl()){const r=box.getBoundingClientRect(),seen=Math.min(r.bottom,innerHeight)-Math.max(r.top,0);if(r.height<=0||seen/r.height<0.55)return;}
    e.preventDefault();jump(e.key==="ArrowLeft"?-1:1);});
})();
