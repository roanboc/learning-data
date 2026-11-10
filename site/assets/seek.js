/* Go back or forward 10 seconds in the film on the page, as on most video sites (asked by Rodrigo, 4 November 2026: dragging the bar
   back a few seconds was hard, above all on a phone). One file for every film page, so no film's bundle changes:
   - two buttons in the bar, after Play: back 10 s and forward 10 s;
   - on a phone or tablet, a double tap on the left half of the film goes back 10 s and on the right half forward 10 s; more taps
     on the same side, quickly after, go 10 s more each (a double tap there no longer opens full screen; a mouse double click still does);
   - on a computer, the left and right arrow keys, while most of the player is on screen and no other control has focus.
   Each jump shows a short cue on that side of the film ("-10 s"), and says it to a screen reader. It uses only FILM.seek and FILM.time,
   which every film's player has; it adds listeners and nothing that runs while the film plays.
   Play speed (asked 5 November 2026): a button after them opens a list of speeds (0.5× to 2×); the choice is kept in this browser. */
(function(){
  const cv=document.getElementById("film"),box=cv&&cv.closest(".player"),bar=box&&box.querySelector(".bar"),play=document.getElementById("play");
  if(!box||!bar||!play)return;
  const ES=(document.documentElement.lang||"").startsWith("es"),STEP=10,
    T=ES?{back:"Atrás 10 segundos",fwd:"Adelante 10 segundos",said:(d,t)=>(d<0?"Atrás ":"Adelante ")+Math.abs(d)+" segundos, en "+t}
        :{back:"Back 10 seconds",fwd:"Forward 10 seconds",said:(d,t)=>(d<0?"Back ":"Forward ")+Math.abs(d)+" seconds, at "+t};
  const mk=(id,txt,lab)=>{const b=document.createElement("button");b.type="button";b.id=id;b.className="seek-btn";b.textContent=txt;b.setAttribute("aria-label",lab);b.title=lab+(ES?" (flechas ← →)":" (arrow keys ← →)");return b;};
  const back=mk("back10","−10",T.back),fwd=mk("fwd10","+10",T.fwd);
  back.insertAdjacentHTML("beforeend",'<span class="u"> s</span>');fwd.insertAdjacentHTML("beforeend",'<span class="u"> s</span>');
  // play speed: a button that opens the list of speeds; the soundtrack sets the film's clock, so its rate sets the film's (pitch kept)
  const au=document.getElementById("snd"),SPEEDS=[0.5,0.75,1,1.25,1.5,2],speed=document.createElement("button");
  speed.type="button";speed.id="speed";speed.className="seek-btn";speed.setAttribute("aria-haspopup","listbox");speed.setAttribute("aria-expanded","false");
  const sp=x=>String(x).replace(".",ES?",":".")+"×";
  const menu=document.createElement("div");menu.className="speed-menu";menu.id="speed-menu";menu.setAttribute("role","listbox");menu.hidden=true;
  menu.setAttribute("aria-label",ES?"Velocidad":"Speed");speed.setAttribute("aria-controls","speed-menu");
  SPEEDS.forEach(x=>{const o=document.createElement("button");o.type="button";o.setAttribute("role","option");o.dataset.rate=x;
    o.textContent=x===1?(ES?"Normal":"Normal"):sp(x);o.onclick=()=>{setSpeed(x,true);closeMenu(true);};menu.appendChild(o);});
  box.appendChild(menu);
  function setSpeed(x,keep){if(!SPEEDS.includes(x))x=1;if(au){au.defaultPlaybackRate=x;au.playbackRate=x;if("preservesPitch" in au)au.preservesPitch=true;}
    speed.textContent=sp(x);speed.dataset.rate=x;speed.classList.toggle("on",x!==1);
    const lab=(ES?"Velocidad: ":"Speed: ")+sp(x);speed.setAttribute("aria-label",lab);speed.title=lab;
    [...menu.children].forEach(o=>o.setAttribute("aria-selected",String(parseFloat(o.dataset.rate)===x)));
    if(keep){try{localStorage.setItem("ld-speed",String(x));}catch(e){}}}
  function openMenu(){const br=box.getBoundingClientRect(),r=speed.getBoundingClientRect();menu.hidden=false;
    menu.style.left=Math.max(4,Math.min(r.left-br.left,br.width-menu.offsetWidth-4))+"px";menu.style.bottom=(br.bottom-r.top+6)+"px";
    speed.setAttribute("aria-expanded","true");const cur=menu.querySelector('[aria-selected="true"]')||menu.firstChild;cur.focus();show();}
  function closeMenu(focus){if(menu.hidden)return;menu.hidden=true;speed.setAttribute("aria-expanded","false");if(focus)speed.focus();later();}
  speed.onclick=()=>{if(menu.hidden)openMenu();else closeMenu(false);};
  menu.addEventListener("keydown",e=>{const os=[...menu.children],i=os.indexOf(document.activeElement);
    if(e.key==="Escape"){e.stopPropagation();e.preventDefault();closeMenu(true);}
    else if(["ArrowUp","ArrowLeft","ArrowDown","ArrowRight"].includes(e.key)){e.preventDefault();e.stopPropagation();const d=e.key==="ArrowUp"||e.key==="ArrowLeft"?-1:1;os[(i+d+os.length)%os.length].focus();}
    else if(e.key==="Tab")closeMenu(false);});
  document.addEventListener("pointerdown",e=>{if(!menu.hidden&&!menu.contains(e.target)&&e.target!==speed)closeMenu(false);},true);
  let saved=1;try{saved=parseFloat(localStorage.getItem("ld-speed"))||1;}catch(e){}
  setSpeed(saved,false);
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
    if(lastSide===side&&now-lastT<350){jump(side==="l"?-1:1);lastT=0;tapToggle();}else{lastT=now;lastSide=side;tapToggle();}},{passive:true});
  // the player's own double click opens full screen; on a touch screen the double tap seeks instead
  box.addEventListener("dblclick",e=>{if(e.target===cv&&lastType&&lastType!=="mouse"){e.stopPropagation();e.preventDefault();}},true);
  // the arrow keys, under the same rule as the player's own keys (Space, F)
  const fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
  window.addEventListener("keydown",e=>{if((e.key!=="ArrowLeft"&&e.key!=="ArrowRight")||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.defaultPrevented)return;
    const tg=e.target instanceof Element?e.target:document.body,own=box.contains(tg);
    if(own&&tg.closest(".think,.speed-menu"))return;
    if(!own&&tg.closest&&tg.closest("a,button,input,select,textarea,[contenteditable],[role=button],[role=radio],[role=option],[tabindex]"))return;
    if(!fsEl()){const r=box.getBoundingClientRect(),seen=Math.min(r.bottom,innerHeight)-Math.max(r.top,0);if(r.height<=0||seen/r.height<0.55)return;}
    e.preventDefault();jump(e.key==="ArrowLeft"?-1:1);});
  /* on a phone (up to 640 px) and in full screen, the film's title and the bar sit over the picture, as on video sites: they show
     while the film is paused, and hide 3 s after it starts playing or after the last touch, key or mouse move; a tap on the film
     brings them back (a second tap hides them again; a double tap still goes back or forward 10 s). Asked 5 November 2026. */
  const title=document.createElement("div"),name=(cv.getAttribute("aria-label")||"").replace(/^[^:]*:\s*/,"");
  title.className="film-title";title.setAttribute("aria-hidden","true");title.textContent=name;box.appendChild(title);
  const phone=window.matchMedia("(max-width:640px)"),isPlaying=()=>play.dataset.state==="pause"||play.dataset.state==="load";
  let idle=null;
  function place(){if(!box.classList.contains("ov"))return;const b=box.clientHeight-(cv.offsetTop+cv.offsetHeight);bar.style.bottom=Math.max(0,b)+"px";title.style.top=cv.offsetTop+"px";}
  function mode(){const on=phone.matches||!!fsEl();box.classList.toggle("ov",on);if(!on){bar.style.bottom="";box.classList.remove("hide");}else place();later();}
  function show(){box.classList.remove("hide");later();}
  function later(){clearTimeout(idle);if(!box.classList.contains("ov")||!isPlaying()||!menu.hidden||box.contains(document.activeElement)&&document.activeElement!==play&&bar.contains(document.activeElement)&&document.activeElement.matches(":focus-visible"))return;
    idle=setTimeout(()=>{if(isPlaying()&&menu.hidden){box.classList.add("hide");}},3000);}
  function tapToggle(){if(!box.classList.contains("ov"))return;if(box.classList.contains("hide"))show();else if(isPlaying()){clearTimeout(idle);box.classList.add("hide");}}
  // a click on the film with a mouse, in full screen: the same as a tap
  cv.addEventListener("click",e=>{if(lastType==="mouse"&&fsEl())tapToggle();});
  box.addEventListener("pointermove",e=>{if(e.pointerType==="mouse")show();},{passive:true});
  box.addEventListener("focusin",()=>show());window.addEventListener("keydown",()=>{if(box.classList.contains("ov"))show();});
  new MutationObserver(()=>{if(isPlaying())later();else show();}).observe(play,{attributes:true,attributeFilter:["data-state"]});
  (phone.addEventListener?phone.addEventListener("change",mode):phone.addListener(mode));
  ["fullscreenchange","webkitfullscreenchange"].forEach(ev=>document.addEventListener(ev,mode));
  if("ResizeObserver" in window)new ResizeObserver(place).observe(box);
  mode();
  /* full screen on a phone turns the film sideways, as on video sites; a button in the bar turns it back upright (and again sideways),
     and the choice is kept in this browser. Only where the browser lets a page turn the screen (Android browsers, not iPhone Safari,
     which offers no full screen for the player either). */
  const touch=window.matchMedia("(pointer:coarse)").matches,so=screen.orientation,canTurn=!!(so&&so.lock)&&touch;
  let orient="landscape";try{orient=localStorage.getItem("ld-orient")==="portrait"?"portrait":"landscape";}catch(e){}
  const rot=document.createElement("button");rot.type="button";rot.id="rotate";rot.hidden=true;
  const rotLab=()=>{const l=orient==="landscape"?(ES?"Ver en vertical":"Turn upright"):(ES?"Ver en horizontal":"Turn sideways");rot.setAttribute("aria-label",l);rot.title=l;rot.dataset.to=orient==="landscape"?"portrait":"landscape";};
  rotLab();(document.getElementById("fs")||bar.lastChild).before(rot);
  async function turn(){try{await so.lock(orient);}catch(e){}}
  rot.onclick=()=>{orient=orient==="landscape"?"portrait":"landscape";try{localStorage.setItem("ld-orient",orient);}catch(e){}rotLab();turn();};
  if(canTurn)["fullscreenchange","webkitfullscreenchange"].forEach(ev=>document.addEventListener(ev,()=>{
    if(fsEl()===box){rot.hidden=false;turn();}else{rot.hidden=true;try{so.unlock();}catch(e){}}}));
  /* the screen stays on while the film plays (a phone would otherwise dim and lock), where the browser offers it; let go on pause */
  let lock=null;
  async function wake(){const want=isPlaying()&&document.visibilityState==="visible";
    try{if(want&&!lock&&navigator.wakeLock){lock=await navigator.wakeLock.request("screen");lock.addEventListener("release",()=>{lock=null;});}
      else if(!want&&lock){const l=lock;lock=null;await l.release();}}catch(e){lock=null;}}
  new MutationObserver(wake).observe(play,{attributes:true,attributeFilter:["data-state"]});
  document.addEventListener("visibilitychange",wake);
})();
