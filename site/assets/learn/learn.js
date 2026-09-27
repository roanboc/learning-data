/* Learning Data: the core of "Take it apart" (labs/: the map, the stops and the stages the labs draw on), shared with "Make the call" (scenarios/).
   Everything is drawn with the film's own components from assets/film/film.js, and the words come from the page's language pack (learn.<lang>.js).
   labs.js adds the eight labs and quiz.js the scenarios of "Make the call". */
(()=>{"use strict";
const X=window.LEARN;if(!X||typeof SCENES==="undefined"||!window.FILM)return;
const LD=window.LD={X,LABS:{},QVIS:{}};

/* ---------- small helpers ---------- */
const store={get(k,d){try{const v=localStorage.getItem("ld:"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem("ld:"+k,JSON.stringify(v));}catch(e){}}};
function h(tag,a,...kids){const e=document.createElement(tag);if(a)for(const k in a){const v=a[k];if(v==null||v===false)continue;if(k==="class")e.className=v;else if(k==="html")e.innerHTML=v;else if(k.slice(0,2)==="on")e.addEventListener(k.slice(2),v);else if(k==="style")for(const p in v){p.slice(0,2)==="--"?e.style.setProperty(p,v[p]):e.style[p]=v[p];}else e.setAttribute(k,v===true?"":v);}
  kids.flat(9).forEach(c=>{if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(c));});return e;}
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const md=s=>esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/`(.+?)`/g,"<code>$1</code>");
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
const css=c=>"rgb("+c.join(",")+")";
const clock=()=>performance.now()/1000;
const RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
const $=(s,r)=>(r||document).querySelector(s);
Object.assign(LD,{store,h,esc,md,fill,css,clock,RM,$});

/* ---------- stages: canvases that draw in logical units, with a wide and a narrow layout ---------- */
function stageBg(c,w,hh){const g=c.createLinearGradient(0,0,0,hh);g.addColorStop(0,"#0a1022");g.addColorStop(1,"#04070f");c.fillStyle=g;c.fillRect(0,0,w,hh);
  c.strokeStyle="rgba(120,160,230,0.05)";c.lineWidth=1;c.beginPath();for(let x=24;x<w;x+=48){c.moveTo(x+0.5,0);c.lineTo(x+0.5,hh);}for(let y=24;y<hh;y+=48){c.moveTo(0,y+0.5);c.lineTo(w,y+0.5);}c.stroke();}
const STAGES=new Set();let READY=false;
function Stage(host,o){
  const cv=h("canvas",o.label?{role:"img","aria-label":o.label}:{"aria-hidden":"true"});host.append(cv);
  const s={cv,ctx:cv.getContext("2d"),w:0,h:0,k:1,narrow:false,hits:[],hover:null,vis:false,fps:o.fps||60,last:0,o};
  s.resize=()=>{const cw=cv.clientWidth;if(!cw)return;s.narrow=!!o.narrow&&cw<(o.bp||560);const d=s.narrow?o.narrow:o.wide;s.w=d[0];s.h=d[1];
    const pr=Math.min(window.devicePixelRatio||1,o.dpr||2),pw=Math.round(cw*pr),ph=Math.round(pw*s.h/s.w);if(cv.width!==pw||cv.height!==ph){cv.width=pw;cv.height=ph;}s.k=pw/s.w;if(READY)s.draw(clock());};
  s.hit=(id,x,y,w,hh)=>{s.hits.push([id,x,y,w,hh]);};
  const at=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*s.w,(e.clientY-r.top)/r.height*s.h];};
  const find=e=>{const[x,y]=at(e);for(let i=s.hits.length-1;i>=0;i--){const q=s.hits[i];if(x>=q[1]&&x<=q[1]+q[3]&&y>=q[2]&&y<=q[2]+q[4])return q[0];}return null;};
  if(o.click){cv.addEventListener("pointermove",e=>{s.hover=find(e);cv.style.cursor=s.hover!=null?"pointer":"";});cv.addEventListener("pointerleave",()=>{s.hover=null;cv.style.cursor="";});cv.addEventListener("click",e=>{const id=find(e);if(id!=null)o.click(id,s);});}
  s.draw=now=>{if(!s.w)return;const c=s.ctx;c.setTransform(s.k,0,0,s.k,0,0);c.globalAlpha=1;c.globalCompositeOperation="source-over";c.shadowBlur=0;s.hits=[];(o.bg||stageBg)(c,s.w,s.h);o.draw(c,now,s);};
  if(window.ResizeObserver)new ResizeObserver(()=>s.resize()).observe(cv);else window.addEventListener("resize",s.resize);
  if(window.IntersectionObserver)new IntersectionObserver(es=>{s.vis=es[es.length-1].isIntersecting;}).observe(cv);else s.vis=true;
  s.kill=()=>{STAGES.delete(s);};STAGES.add(s);requestAnimationFrame(s.resize);return s;}
function tick(){const now=clock();if(READY)for(const s of STAGES){if(!s.vis||!s.cv.isConnected)continue;if(s.fps<60&&now-s.last<1/s.fps-0.004)continue;s.last=now;s.draw(now);}requestAnimationFrame(tick);}
Object.assign(LD,{Stage,stageBg});

/* ---------- canvas helpers shared by labs and scenarios ---------- */
function textBlock(c,s,x,y,maxW,o,lh){o=o||{};c.save();c.font=font(o.w||600,o.size||20,o.f);const words=String(s).split(" "),lines=[];let cur="";words.forEach(wd=>{const t=cur?cur+" "+wd:wd;if(c.measureText(t).width>maxW&&cur){lines.push(cur);cur=wd;}else cur=t;});if(cur)lines.push(cur);c.restore();
  lines.forEach((l,i)=>T(c,l,x,y+i*(lh||(o.size||20)*1.3),o));return lines.length;}
function fileIcon(c,x,y,col,lab,state,now){const w=30,hh=38,x0=x-w/2,y0=y-hh/2;c.save();if(state==="new")glow(c,x,y,30,col,0.22+0.12*Math.sin(now*4));
  c.beginPath();c.moveTo(x0,y0);c.lineTo(x0+w-10,y0);c.lineTo(x0+w,y0+10);c.lineTo(x0+w,y0+hh);c.lineTo(x0,y0+hh);c.closePath();c.fillStyle=state==="read"?"rgba(18,26,42,0.95)":rgba(col,0.2);c.fill();c.strokeStyle=rgba(col,state==="read"?0.4:0.95);c.lineWidth=1.6;c.stroke();
  T(c,lab,x,y+4,{w:800,size:10,align:"center",color:rgba(col,state==="read"?0.55:1)});if(state==="read")T(c,"✓",x+9,y+15,{w:800,size:13,color:rgba(GOOD,1)});c.restore();}
function miniCard(c,x,y,w,hh,col,title,sub){glass(c,x,y,w,hh,12,col,{glow:12,ea:0.6});led(c,x+9,y+12,4,hh-24,col);T(c,title,x+22,y+hh/2-3,{w:800,size:18});if(sub)T(c,sub,x+22,y+hh/2+17,{w:500,size:13,color:rgba(SOFT,0.95)});}
function stateCol(st){return st==="pass"?GOOD:st==="fail"?BAD:st==="warn"?[255,200,90]:st==="run"?CYAN:st==="skip"?[120,132,150]:DBT;}
function lockBadge(c,x,y,s,label){c.save();c.fillStyle="rgba(120,130,150,0.94)";rr(c,x,y,64*s,72*s,8*s);c.fill();c.strokeStyle="#fff";c.lineWidth=2.4*s;rr(c,x+22*s,y+22*s,20*s,16*s,3*s);c.stroke();c.beginPath();c.arc(x+32*s,y+22*s,7*s,Math.PI,0);c.stroke();if(label)T(c,label,x+32*s,y+60*s,{size:11*s,w:700,align:"center",color:"#fff"});c.restore();}
function copyStack(c,x,y,stale,n){for(let i=(n||4)-1;i>=0;i--){c.fillStyle=i?"rgba(214,226,244,0.55)":"rgba(236,242,250,0.95)";rr(c,x+i*7,y-i*7,44,32,5);c.fill();}if(stale){c.fillStyle=rgba(BAD,1);c.beginPath();c.arc(x+48,y-28,9,0,TAU);c.fill();T(c,"!",x+48,y-23,{w:800,size:13,align:"center",color:"#fff"});}}
Object.assign(LD,{textBlock,fileIcon,miniCard,stateCol,lockBadge,copyStack});

/* ---------- the stops ---------- */
const STOPS=[["capture","in",[255,176,64]],["sketch","sketch",[150,225,255]],["refine","refine",[255,105,75]],["gold","gold",[255,209,102]],["meaning","meaning",[176,123,255]],["speeds","speeds",[47,211,192]],["out","out",[77,163,255]],["people","people",[120,240,170]]]
  .map(([id,scene,c],i)=>Object.assign({id,scene,c,n:i+1},X.stops[id]));
LD.STOPS=STOPS;LD.stop=id=>STOPS.find(s=>s.id===id);

/* the map: the film's "layers together" scene, drawn live, with a button over each part */
const CAM={x:1125,y:532,z:0.869};
const SPOTS=[["sources","capture",30,462,350,864],["bronze","capture",412,454,668,780],["dbt","refine",112,182,1608,434],["silver","refine",772,454,1028,780],["gold","gold",1132,454,1388,780],["domains","gold",1462,462,1888,864],
  ["sqlwh","speeds",1003,810,1187,854],["uc","meaning",1200,810,1372,854],["apps","people",1926,494,2240,566],["genie","people",1926,614,2240,686],["dash","out",1926,734,2240,806]];
function buildMap(root){
  const wrap=h("div",{class:"map"});root.append(wrap);
  const L=SCENES.find(s=>s.id==="layers");const fake=Object.assign({},L,{cues:{back:-100,appdom:-100,bsg:-100,busdom:-100,dbtgov:-100,dbx:-100},_cam:CAM});
  Stage(wrap,{wide:[1920,1080],fps:30,dpr:1.5,bg:()=>{},draw:(c,now,s)=>{c.save();L.draw(c,s.k,50+(RM?8:now),fake);c.restore();}});
  const sx=x=>960+(x-CAM.x)*CAM.z,sy=y=>540+(y-CAM.y)*CAM.z,Y0=220,HH=640;
  SPOTS.forEach(([k,stop,x0,y0,x1,y1])=>{const st=LD.stop(stop),a=sx(x0),b=Math.min(1916,sx(x1)),t=sy(y0),u=sy(y1);
    const btn=h("button",{type:"button",class:"hot","data-stop":stop,"aria-label":X.map[k]+" · "+X.ui.stop+" "+st.n+": "+st.name,title:X.map[k]+" → "+st.name,style:{left:(a/1920*100)+"%",top:((t-Y0)/HH*100)+"%",width:((b-a)/1920*100)+"%",height:((u-t)/HH*100)+"%","--c":css(st.c)},onclick:()=>openStop(stop,true)},h("span",null,String(st.n)));
    wrap.append(btn);});
  wrap.append(h("p",{class:"map-note","aria-hidden":"true"},X.ui.mapNote));
  return wrap;}

let RAIL,PANEL,MAP,CUR=null,KILL=[];
function buildExplore(){
  const root=$("#explore-app");if(!root)return;root.textContent="";
  MAP=buildMap(root);
  RAIL=h("div",{class:"stops",role:"tablist","aria-label":X.ui.stops});
  const visited=store.get("visited",[]);
  STOPS.forEach(s=>RAIL.append(h("button",{type:"button",role:"tab",id:"tab-"+s.id,"aria-controls":"stop-panel","aria-selected":"false",tabindex:"-1",class:visited.includes(s.id)?"done":null,style:{"--c":css(s.c)},onclick:()=>openStop(s.id)},h("i",null,h("b",null,String(s.n))),s.name)));
  RAIL.addEventListener("keydown",e=>{const i=STOPS.findIndex(s=>s.id===CUR);let j=null;if(e.key==="ArrowRight")j=(i+1)%STOPS.length;else if(e.key==="ArrowLeft")j=(i+STOPS.length-1)%STOPS.length;else if(e.key==="Home")j=0;else if(e.key==="End")j=STOPS.length-1;if(j!=null){e.preventDefault();openStop(STOPS[j].id);$("#tab-"+STOPS[j].id).focus();}});
  PANEL=h("div",{class:"stop",id:"stop-panel",role:"tabpanel"});
  root.append(RAIL,PANEL);
  const want=(location.hash.match(/^#(?:explore[-/])?(\w+)$/)||[])[1];
  openStop(LD.stop(want)?want:store.get("stop","capture"),false);
  if(LD.stop(want))requestAnimationFrame(()=>RAIL.scrollIntoView());
  window.addEventListener("hashchange",()=>{const id=location.hash.slice(1);if(LD.stop(id)&&id!==CUR)openStop(id,true);});}
function openStop(id,scroll){
  const s=LD.stop(id)||STOPS[0];id=s.id;
  KILL.forEach(f=>{try{f();}catch(e){}});KILL=[];CUR=id;
  [...RAIL.children].forEach(b=>{const on=b.id==="tab-"+id;b.setAttribute("aria-selected",on);b.tabIndex=on?0:-1;});
  PANEL.setAttribute("aria-labelledby","tab-"+id);
  const tab=$("#tab-"+id);if(RAIL.scrollWidth>RAIL.clientWidth)RAIL.scrollTo({left:tab.offsetLeft-RAIL.offsetLeft-(RAIL.clientWidth-tab.offsetWidth)/2,behavior:RM?"auto":"smooth"});
  MAP.querySelectorAll(".hot").forEach(b=>b.classList.toggle("on",b.dataset.stop===id));
  const visited=store.get("visited",[]);if(!visited.includes(id)){visited.push(id);store.set("visited",visited);}$("#tab-"+id).classList.add("done");store.set("stop",id);
  PANEL.textContent="";PANEL.style.setProperty("--c",css(s.c));
  const i=STOPS.indexOf(s),nx=STOPS[(i+1)%STOPS.length];
  const watch=h("button",{type:"button",class:"btn",onclick:()=>clip(s)},"▶ "+X.ui.watch+" · "+fmt(FILM.sceneStart(s.scene)));
  const next=i<STOPS.length-1?h("button",{type:"button",class:"btn",onclick:()=>{openStop(nx.id,true);}},X.ui.next+": "+nx.name+" →"):h("a",{class:"btn primary",href:LD.quizHref},X.ui.toQuiz+" →");
  const text=h("div",{class:"stop-text"},
    h("p",{class:"kicker",html:"<b>"+esc(X.ui.stop+" "+s.n)+"</b> "+esc(X.ui.of)+" "+STOPS.length+" · "+esc(s.name)}),
    h("h3",null,s.title),h("p",{class:"idea"},s.idea),
    h("ul",null,s.points.map(p=>h("li",{html:md(p)}))),
    h("details",{class:"real"},h("summary",null,X.ui.real),h("p",{html:md(s.real)})),
    h("div",{class:"stop-nav"},watch,next));
  const labHost=h("div",{class:"stop-lab"});
  PANEL.append(text,labHost);
  const lab=LD.LABS[id];if(lab){const k=lab(labHost,s);if(k)KILL.push(k);}
  if(location.hash.slice(1)!==id)history.replaceState(null,"","#"+id);
  if(scroll)RAIL.scrollIntoView();}
LD.openStop=(id,scroll)=>{openStop(id,scroll);};
/* "Watch this part": the film plays that chapter in a pop-up player, and stops at its end */
function clip(s){const d=$("#clip");if(!d||!d.showModal){location.href=LD.homeHref+"#t="+Math.ceil(FILM.sceneStart(s.scene));return;}
  $("#clip-h").textContent=s.name+" · "+fmt(FILM.sceneStart(s.scene));if(!d.open)d.showModal();FILM.playScene(s.scene,true);}
function clipSetup(){const d=$("#clip");if(!d)return;d.addEventListener("close",()=>{if(FILM.pause)FILM.pause();});d.addEventListener("click",e=>{if(e.target===d||e.target.closest("[data-close]"))d.close();});}
/* the labs and the scenarios are sibling pages, in each language */
LD.labsHref=id=>"../labs/"+(id?"#"+id:"");LD.quizHref="../scenarios/";LD.homeHref="../";

/* the frame every lab shares: a title, a hint, a stage, controls and what just happened */
LD.shell=(host,s,o)=>{o=o||{};const lab=s.lab;
  const box=h("div",{class:"lab",style:{"--c":css(s.c)}});
  const head=h("div",{class:"lab-head"},h("h4",null,h("small",null,X.ui.lab),lab.title));
  const hint=h("p",{class:"lab-hint"},lab.hint);
  const tabs=h("div",{class:"lab-tabs"}),stage=h("div",{class:"lab-stage"}),controls=h("div",{class:"lab-controls"}),read=h("div",{class:"lab-read"}),say=h("p",{class:"lab-say","aria-live":"polite"});
  box.append(head,hint,tabs,stage,controls,read,say);host.append(box);if(!o.tabs)tabs.remove();
  const btn=(label,fn,a)=>{const b=h("button",Object.assign({type:"button",class:"chip-btn",onclick:fn},a||{}),label);controls.append(b);return b;};
  const toggle=(label,fn,on)=>{const b=btn(label,()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",v);fn(v);},{"aria-pressed":on?"true":"false"});return b;};
  const seg=(parent,items,cur,fn,lbl)=>{const g=h("div",{class:"seg",role:"group","aria-label":lbl||""});items.forEach(([k,l])=>{const b=h("button",{type:"button","aria-pressed":k===cur?"true":"false",onclick:()=>{[...g.children].forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(k);}},l);g.append(b);});(parent||controls).append(g);return g;};
  const readout=(label)=>{const v=h("b",null,"–");read.append(h("span",null,label+":",v));return t=>{v.textContent=t;};};
  const setSay=(html)=>{say.innerHTML=html;};
  return{box,tabs,stage,controls,read,say,btn,toggle,seg,readout,setSay};};

/* ---------- start ---------- */
function start(){clipSetup();buildExplore();if(LD.buildQuiz)LD.buildQuiz();}
FILM.ready.then(()=>{READY=true;STAGES.forEach(s=>s.resize());});
requestAnimationFrame(tick);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
