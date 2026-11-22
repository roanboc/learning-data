/* Learning Data: Governance on the map. The labs (Take it apart) and the scenarios (Make the call) of the whole series, one page
   each, from one engine, as site-tools/build_series.py makes them for a series with labs and scenarios of its own: the page loads a
   film's bundle (for the governance films' watercolour: wash.js, people.js and rooms.js, with Noor's map and its bands), the words
   (learn.en.js or learn.es.js, which set window.MR) and this file, and fills #series-labs or #series-quiz. The words cover the
   series' three films; the page says which films are on the site, or coming (data-films on its root: {number: {t, k, href, starts}
   or {t, coming}}), and only their labs and scenarios show. Its data-store is the progress prefix.
   The engine is the master data series' own (assets/master-and-reference-data/learn.js), copied into this series' folder so each
   series keeps its own. Every lab is a playground (kind "play"): a picture the visitor changes with buttons and switches, with three
   to five experiments ticked as they happen (labPlay and PLAY below). The scenarios are the series' one evaluation.
   Pictures are drawn with the films' own components (wc_*, and the map's bands, GV_LAYERS): each playground draws its own, and a
   scenario's "vis" names a function in PIX below, which takes its words from the scenario. Without the bundle, the labs still work, on plain paper.
   The series shows no files, code or tool screens, as its films don't: its labs link to no file in the example project.
   Progress stays in this browser, under the page's data-store (or MR.store): the labs visited (visited, ids), the experiments done (goals,
   by lab) and the scenarios answered (quiz, keyed by number), as assets/learn/path.js counts them. smoke.py expects every lab's tab on the labs page
   ([role=tab][data-id]), the open one selected, one "Watch this part" link to its chapter (#t=), and the film shown on the scenarios
   page as data-film on its root.
   The results for all films, and for the last film, end with the series' last words (MR.close), as its last film ends. */
(()=>{"use strict";
const L=window.MR;if(!L)return;const U=L.ui;
const ROOT=document.getElementById("series-labs")||document.getElementById("series-quiz"),P=(ROOT&&ROOT.dataset.store)||L.store;
const get=(k,d)=>{try{const v=localStorage.getItem(P+":"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}};
const set=(k,v)=>{try{localStorage.setItem(P+":"+k,JSON.stringify(v));}catch(e){}
  // path.js repaints the stepper on "storage", which only other tabs fire: fire it here too
  try{window.dispatchEvent(new StorageEvent("storage",{key:P+":"+k}));}catch(e){}};
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const k in attrs||{}){const v=attrs[k];if(v==null||v===false)continue;if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else if(k==="html")e.innerHTML=v;else e.setAttribute(k,v===true?"":v);}
  kids.flat().forEach(c=>{if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(c));});return e;}
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
// thousands with a comma in English and a dot in Spanish (es-ES leaves four-digit numbers ungrouped, so it's done by hand)
const num=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,L.lang==="es"?".":",");
const dec=n=>(n>0?"+":n<0?"−":"")+Math.abs(n).toFixed(1).replace(".",L.lang==="es"?",":".");
const ready=()=>window.FILM&&FILM.ready?FILM.ready:Promise.resolve();
const RM=(()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}})();
const repoLinks=x=>!(x&&x.repo&&x.repo.length&&L.repoBase)?null:h("p",{class:"mr-repo"},h("b",null,U.repo+" "),
  ...x.repo.flatMap((f,i)=>[i?" · ":"",h("a",{href:L.repoBase.replace(/\/blob\/main\//,f.endsWith("/")?"/tree/main/":"/blob/main/")+f.replace(/\/$/,""),target:"_blank",rel:"noopener"},h("code",null,f))]));

/* ---------- the films: the words name all three; the page says which are on the site, or coming ---------- */
const PUB=(()=>{try{const d=ROOT&&ROOT.dataset.films;if(d)return JSON.parse(d);}catch(e){}return null;})();
// a film's title (t), key (k), page (href) and chapters' starts come from the page; a coming film has its title and "coming"
const FILMS=L.films.filter(f=>!PUB||PUB[f.n]).map(f=>{const p=PUB?PUB[f.n]:{};
  return Object.assign({},f,{title:p.t||f.title,key:p.k||f.key,href:p.href||"../"+(p.k||f.key)+"/",starts:p.starts||{},coming:!!p.coming});});
const filmOf=n=>FILMS.find(f=>f.n===n);
const LABS=L.labs.filter(x=>filmOf(x.film)),QS=L.qs.filter(q=>filmOf(q.film));
const labOf=id=>LABS.find(x=>x.id===id);
// "Watch this part": the film's page, at the lab's chapter when it has one; a film still being made has none
function watchHref(Lb){const f=filmOf(Lb.film)||{},t=Lb.chapter?f.starts[Lb.chapter]:null;return f.coming?null:f.href+(t!=null?"#t="+Math.ceil(t):"");}
// the series' last words (MR.close), from its last film's closing chapter: under the results for all films, and for that film
function closing(sel){const C=L.close;if(!C||!filmOf(C.film)||(sel&&sel!==C.film))return null;const href=watchHref(C);
  return h("section",{class:"mr-close","aria-labelledby":"mr-close-h"},h("h3",{id:"mr-close-h"},C.title),h("p",null,C.lead),
    h("ul",null,...C.parts.map(([b,t])=>h("li",null,h("b",null,b+": "),t))),h("p",null,C.gov),
    h("p",{class:"mr-next"},h("b",null,U.next+" "),C.next),href?h("a",{class:"btn",href},U.watch):null);}

/* ---------- the picture: paper, the films' watercolour, and a short move when something changes ---------- */
const G=()=>typeof wc_panel==="function"&&typeof WC!=="undefined"&&WC.ready;
function stage(vw,vh,draw,label){const cv=h("canvas",{role:"img","aria-label":label||""});let raf=0;
  function frame(k){const d=Math.min(window.devicePixelRatio||1,2),cw=Math.max(300,Math.round((cv.clientWidth||vw)*d));if(cv.width!==cw){cv.width=cw;cv.height=Math.round(cw*vh/vw);}
    const ctx=cv.getContext("2d"),s=cv.width/vw;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.setTransform(s,0,0,s,0,0);
    ctx.fillStyle="rgb(251,247,238)";ctx.fillRect(0,0,vw,vh);
    if(G()){try{draw(ctx,k);}catch(e){if(window.console)console.warn(e);}
      ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=0.7;ctx.drawImage(WC.paper,0,0,W,H,0,0,vw,vh);ctx.restore();}}
  // k runs from 0 to 1 over 0.7 s after a change, so ticks draw on and lines grow; with reduced motion, it's 1 at once
  function paint(anim){cancelAnimationFrame(raf);if(!anim||RM){frame(1);return;}const t0=performance.now();
    const tick=()=>{const k=Math.min(1,(performance.now()-t0)/700);frame(k);if(k<1)raf=requestAnimationFrame(tick);};tick();}
  cv.style.aspectRatio=vw+"/"+vh;if("ResizeObserver" in window)new ResizeObserver(()=>frame(1)).observe(cv);FRAMES.set(cv,frame);return{el:cv,paint};}

/* ---------- drawing helpers, on the series' components ---------- */
const hexRGB=x=>{const m=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(x||"");return m?[parseInt(m[1],16),parseInt(m[2],16),parseInt(m[3],16)]:null;};
// a colour by name: a band of the map or a governance colour, a role (student, tutor…), a side (person, steward, tech), or a hex
// the governance films' own: the map's bands by name (strategy, business, information, application…) and GV's gold, green, amber, red
const GVC=k=>{if(typeof GV==="undefined")return null;const b=typeof GV_LAYERS!=="undefined"?GV_LAYERS.find(l=>l[0].toLowerCase()===k):null;
  return b?b[1]:({gold:GV.gold,green:GV.green,amber:GV.amber,red:GV.red,grey:GV.grey})[k]||null;};
function C(k){if(Array.isArray(k))return k;if(!k)return WC_PENCIL;if(k[0]==="#")return hexRGB(k)||WC_PENCIL;
  return GVC(k)||WC_ROLE[k]||WC_IND[k]||({person:WC_SIDE.none,steward:WC_SIDE.biz,tech:WC_SIDE.tech,ink:WC_INK,muted:WC_MUTED,no:WC_NO,ok:WC_ROLEINK.alumna,amber:WC_ROLE.applicant,badge:WC_BADGE})[k]||WC_PENCIL;}
// text in a role's colour, dark enough to read on paper
const CI=k=>(typeof k==="string"&&WC_ROLEINK[k])||(k==="no"?WC_NO:k==="ok"?WC_ROLEINK.alumna:WC_INK);
const OK=[22,120,68],NO=[184,56,40];
function tx(ctx,s,x,y,o){o=o||{};wc_T(ctx,String(s),x,y,{size:o.size||30,w:o.w||600,f:o.f,align:o.align,col:o.col||WC_INK,a:o.a});}
// words a picture had to cut, or that still overflow at the smallest size: kept in window.MR_MISS, so checks can list them
const MISS=(window.MR_MISS=window.MR_MISS||[]);function miss(s){s=String(s);if(MISS.indexOf(s)<0)MISS.push(s);}
// A web font that comes after a picture was drawn, as on a slow connection, leaves its words cut short as the fallback font measured
// them: forget those, and draw again each picture on the page (FRAMES finds a canvas's drawing, and lets it go with the canvas)
const FRAMES=new WeakMap();
if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener("loadingdone",()=>{MISS.length=0;
  document.querySelectorAll("canvas").forEach(c=>{const f=FRAMES.get(c);if(f)f(1);});});
// the biggest size, from size down to min, at which s fits in maxW. A browser can draw text a little wider than another, so a word
// that still overflows at min may go down to nine tenths of it, and to nine tenths of its size in lines() and tag(), before it is cut
function fit(ctx,s,maxW,size,w,f,min){let z=size;const lo=Math.floor((min||22)*0.9);while(z>(min||22)&&tw(ctx,String(s),z,w||600,f)>maxW)z-=1;
  while(z>lo&&tw(ctx,String(s),z,w||600,f)>maxW+1)z-=1;if(tw(ctx,String(s),z,w||600,f)>maxW+1)miss(s);return z;}
function wrap(ctx,s,maxW,size,w,f){const words=String(s).split(" "),out=[];let cur="";words.forEach(wd=>{const t=cur?cur+" "+wd:wd;if(cur&&tw(ctx,t,size,w||600,f)>maxW){out.push(cur);cur=wd;}else cur=t;});if(cur)out.push(cur);return out;}
function wrapN(ctx,s,maxW,size,w,f,n){const l=wrap(ctx,s,maxW,size,w,f);if(l.length>n)miss(s);return l.slice(0,n);}
function lines(ctx,s,x,y,maxW,o){o=o||{};let z=o.size||30;const n=o.max||9,lo=Math.floor(z*0.9);while(z>lo&&wrap(ctx,s,maxW,z,o.w,o.f).length>n)z-=1;const ls=wrapN(ctx,s,maxW,z,o.w,o.f,n);ls.forEach((l,i)=>tx(ctx,l,x,y+i*(o.lh||z*1.28),Object.assign({},o,{size:z})));return ls.length*(o.lh||z*1.28);}
// a paper tag; y is its middle; returns its width
function tag(ctx,x,y,s,o){o=o||{};let size=o.size||28,t=String(s);if(o.maxW){const lo=Math.floor(size*0.9);while(size>lo&&tw(ctx,t,size,o.w||700,o.f)+40>o.maxW)size-=1;while(t.length>3&&tw(ctx,t,size,o.w||700,o.f)+40>o.maxW)t=t.slice(0,-2);if(t!==String(s)){t=t.replace(/\s+$/,"")+"…";miss(s);}}
  return wc_tag(ctx,x,y,t,{size,w:o.w||700,f:o.f,align:o.align,wash:o.wash?C(o.wash):null,washA:o.washA||0.42,col:o.col});}
function card(ctx,x,y,w,hh,o){o=o||{};wc_panel(ctx,x,y,w,hh,{kind:o.kind||"card",role:o.role?C(o.role):null,sw:o.sw||0,wash:o.wash?C(o.wash):null,washA:o.washA,dashed:o.dashed,seed:o.seed});}
function tick(ctx,x,y,s,k){wc_tick(ctx,x,y,s,OK,k==null?1:k);}
function cross(ctx,x,y,s,k){wc_cross(ctx,x,y,s,NO,k==null?1:k);}
function mark(ctx,x,y,s,good,k){if(good)tick(ctx,x,y,s,k);else cross(ctx,x,y,s*0.8,k);}
function pencil(ctx,pts,o){wc_pencil(ctx,pts,1,Object.assign({lw:2.6,a:0.8},o||{}));}
function wash(ctx,x,y,w,hh,c,a,seed){wc_wash(ctx,wc_resample(wc_rect(x,y,w,hh),10),C(c),{kind:"swatch",line:false,a:a==null?0.5:a,seed:seed||7});}
function head(ctx,x,y,t,sub,o){o=o||{};tx(ctx,t,x,y,{size:o.size||34,w:800,col:WC_DARK,align:o.align});if(sub)tx(ctx,sub,x,y+(o.size||34)+6,{size:o.subSize||26,w:600,col:WC_MUTED,align:o.align});}
const short=(it)=>it.s||it.t;
// a record, compact: its role's brushstroke behind the title, the system's own number, and a note under it
function rec(ctx,x,y,w,hh,c,o){o=o||{};const t0=tw(ctx,c.title,26,800);card(ctx,x,y,w,hh,{kind:"card",role:c.role||null,sw:c.role?t0+30:0,dashed:o.dashed,seed:o.seed});
  // the number sits beside the title, or under it (o.stack) when the card is narrow
  const st=!!(o.stack&&c.id),iw=c.id&&!st?tw(ctx,c.id,24,500,"mono")+18:0;
  tx(ctx,c.title,x+24,y+42,{size:fit(ctx,c.title,w-44-iw,26,800,null,17),w:800,col:WC_DARK});
  if(c.id)tx(ctx,c.id,st?x+24:x+w-20,st?y+78:y+42,{size:24,w:500,f:"mono",align:st?"left":"right"});
  if(c.note&&hh>(st?104:70))tx(ctx,c.note,x+24,st?y+112:y+78,{size:fit(ctx,c.note,w-44,24,600,null,15),w:600,col:WC_MUTED});}


/* ---------- the pictures ---------- */
// the items a sort has put in a bucket, with their places in the list
const placed=(V,st,key)=>V.items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick&&st.pick[j]===key);
// an arrow in pencil, from one point to another, its head at the end
function arrow(ctx,x0,y0,x1,y1,col,o){o=o||{};const p=o.p==null?1:o.p,x=x0+(x1-x0)*p,y=y0+(y1-y0)*p,a=Math.atan2(y1-y0,x1-x0),s=o.head||16;
  ctx.save();ctx.strokeStyle=rgba(col||WC_PENCIL,o.a==null?0.85:o.a);ctx.lineWidth=o.lw||3.4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x,y);ctx.stroke();ctx.setLineDash([]);
  if(p>0.6&&!o.noHead){ctx.beginPath();ctx.moveTo(x-s*Math.cos(a-0.45),y-s*Math.sin(a-0.45));ctx.lineTo(x,y);ctx.lineTo(x-s*Math.cos(a+0.45),y-s*Math.sin(a+0.45));ctx.stroke();}ctx.restore();}
// a card with a heading and lines under it, each line wrapped to the card
function noteCard(ctx,x,y,w,hh,head0,ls,o){o=o||{};card(ctx,x,y,w,hh,{kind:"card",wash:o.wash||null,washA:o.washA||0.22,dashed:o.dashed,seed:o.seed||(x|0)});
  let yy=y+(o.top||50);if(head0){const z=fit(ctx,head0,w-48,o.headSize||30,800,null,22);tx(ctx,head0,x+24,yy,{size:z,w:800,col:WC_DARK});yy+=z+18;}
  (ls||[]).forEach(l=>{const L0=typeof l==="string"?{t:l}:l;const used=lines(ctx,L0.t,x+24,yy,w-48-(L0.mark!=null?44:0),{size:o.size||26,max:L0.max||3,w:L0.b?700:600,col:L0.c?CI(L0.c):(L0.b?WC_DARK:WC_INK)});
    if(L0.mark!=null)mark(ctx,x+w-34,yy-8,28,L0.mark,o.k==null?1:o.k);yy+=used+(o.gap||10);});}
// how tall noteCard() draws a card for these words
function noteH(ctx,w,head0,ls,o){o=o||{};let hgt=(o.top||50)+28;if(head0)hgt+=(o.headSize||30)+18;
  (ls||[]).forEach(l=>{const L0=typeof l==="string"?{t:l}:l,z=o.size||26;hgt+=Math.min(L0.max||3,wrap(ctx,L0.t,w-48-(L0.mark!=null?44:0),z,L0.b?700:600).length)*z*1.28+(o.gap||10);});return hgt;}
const PIX={
  /* the scenarios: a few tags in a row or a column, optionally washed, with a heading */
  tags(ctx,w,hh,st){if(st.title)head(ctx,w/2,64,st.title,st.sub,{align:"center",size:34});const ts=st.tags||[],y0=st.title?(st.sub?190:150):80,gap=(hh-y0-30)/Math.max(1,ts.length);
    ts.forEach((t,i)=>{const o=typeof t==="string"?{t}:t,y=y0+i*gap+gap/2;tag(ctx,w/2,y,o.t,{size:fit(ctx,o.t,w-140,30,700),align:"center",wash:o.c,maxW:w-60});if(o.mark!=null)mark(ctx,w-60,y-4,34,o.mark,1);});},
  /* the scenarios: one card, pinned, with a heading and its lines */
  note(ctx,w,hh,st){const cw=Math.min(w-80,st.w||820),o={wash:st.c?C(st.c):null,washA:0.22,size:34,headSize:38,top:84,gap:14},ch=Math.min(hh-60,Math.max(300,noteH(ctx,cw,st.title,st.lines,o))),y=(hh-ch)/2;
    noteCard(ctx,w/2-cw/2,y,cw,ch,st.title,st.lines,o);if(typeof gv_pin==="function")gv_pin(ctx,w/2,y+14,C("red"),1.4);},
  /* the scenarios: two cards side by side, such as a home and its copy, or before and after */
  two(ctx,w,hh,st){const cs=st.cards||[],cw=(w-80)/2,o={washA:0.25,size:30,headSize:32,top:64,gap:12},
      ch=Math.min(hh-(st.say?170:80),Math.max(280,...cs.map(c=>noteH(ctx,cw,c.title,c.lines,o)))),y=(hh-(st.say?110:0)-ch)/2;
    cs.forEach((c,i)=>noteCard(ctx,24+i*(cw+32),y,cw,ch,c.title,c.lines,Object.assign({wash:c.c?C(c.c):null},o)));
    if(cs.length===2&&st.arrow)arrow(ctx,24+cw+4,y+ch/2,24+cw+28,y+ch/2,WC_PENCIL,{head:10});
    if(st.say)tag(ctx,w/2,hh-62,st.say,{size:fit(ctx,st.say,w-120,28,700,null,18),align:"center",wash:st.sayC||null,maxW:w-40});},
};

/* ---------- the lab's parts ---------- */
function seg(opts,cur,on,label){const s=h("div",{class:"mr-seg",role:"group","aria-label":label||""});
  const paintS=()=>s.replaceChildren(...opts.map(([k,t])=>h("button",{type:"button","aria-pressed":String(k===cur),onclick:()=>{cur=k;paintS();on(k);}},t)));paintS();return s;}
const shell=(Lb,pic,...parts)=>h("div",{class:"mr-lab",style:"--c:"+Lb.c},...(pic?[pic.el]:[]),...parts);
const info=t=>t?h("p",{class:"mr-info"},t):null;
const btn=(t,on,cls)=>h("button",{type:"button",class:"mr-btn"+(cls?" "+cls:""),onclick:on},t);

/* ---------- play: a picture the visitor changes, with experiments ticked as they happen ---------- */
// Every lab is a playground (kind "play", the site's standard since Data that moves): the visitor picks options, flips switches,
// presses, and watches the picture change; each playground has three to five experiments (w.goals), each ticked when the visitor makes
// it happen, and its end once all are ticked. PLAY[id](Lb, api) gives its state, its controls (built with api.group, api.seg,
// api.toggle and api.btn), its readouts ([[label, () => value, () => "ok" | "no" | ""]]), its picture's height (vh) and its drawing
// (draw(ctx, w, hh, k), k running 0 to 1 after each change). api.say(text, tone) says what happened; api.reach(key) ticks an
// experiment. Start again puts everything back as it was, the ticks included. Ticks are kept in this browser, under "goals".
const PLAY={};
function labPlay(Lb){const W=Lb.w,G=W.goals,all=get("goals",{})||{};let got=new Set(all[Lb.id]||[]);
  const box=h("div",{class:"mr-lab mr-play",style:"--c:"+Lb.c});let P=null,pic=null,rd=[],say=null,list=null,end=null;
  const api={
    say:(t,tone)=>{say.className="mr-say"+(tone?" "+tone:"");say.textContent=t;},
    reach:k=>{if(got.has(k)||!G.some(g=>g[0]===k))return;got.add(k);all[Lb.id]=[...got];set("goals",all);paintGoals(k);},
    paint:anim=>{if(pic)pic.paint(anim!==false);},
    refresh:()=>{rd.forEach(([el,f,c])=>{el.querySelector("b").textContent=f();el.className=c?c()||"":"";});},
    group:label=>{const g=h("div",{class:"mr-controls mr-prow"},label?h("span",{class:"mr-lbl"},label):null);ctrl.append(g);return g;},
    seg:(row,items,cur,fn,lbl)=>{const s=seg(items,cur,k=>{fn(k);api.refresh();api.paint();},lbl);row.append(s);return s;},
    toggle:(row,label,on,fn)=>{const b=h("button",{type:"button",class:"mr-btn","aria-pressed":String(!!on),onclick:()=>{const v=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(v));fn(v);api.refresh();api.paint();}},label);row.append(b);return b;},
    btn:(row,label,fn,cls)=>{const b=btn(label,()=>{fn();api.refresh();api.paint();},cls);row.append(b);return b;}};
  let ctrl=null;
  function paintGoals(just){list.replaceChildren(...G.map(([k,t],i)=>h("li",{class:got.has(k)?"ok":""},h("i",{"aria-hidden":"true"},got.has(k)?"✓":String(i+1)),h("span",null,t),got.has(k)?h("span",{class:"sr"}," · "+U.reached):null)));
    const n=got.size,done=n===G.length;end.replaceChildren(...(done?[h("p",{class:"mr-end"},W.end)]:[]));
    if(just){const g=G.find(x=>x[0]===just);say.append(h("span",{class:"mr-got"}," "+fill(U.reachedOne,{t:g[1]})));if(done)say.append(h("span",{class:"sr"}," "+W.end));}
    list.setAttribute("aria-label",U.goals+" · "+fill(U.nOf,{n,of:G.length}));}
  function build(){box.replaceChildren();rd=[];ctrl=h("div",{class:"mr-ctrl"});say=h("p",{class:"mr-say",role:"status"});list=h("ol",{class:"mr-goals"});end=h("div",{class:"mr-endbox"});
    const stats=h("div",{class:"mr-stats"});P=PLAY[Lb.id](Lb,api);const vw=1200,vh=P.vh||620;
    pic=stage(vw,vh,(c,k)=>P.draw(c,vw,vh,k),W.alt||Lb.name);
    (P.readouts||[]).forEach(([label,f,c])=>{const el=h("p",null,h("b",null,"–"),h("span",null,label));stats.append(el);rd.push([el,f,c]);});
    const again=btn(U.again,()=>{got=new Set();all[Lb.id]=[];set("goals",all);build();api.say(W.start);paintGoals();},"sm mr-again");
    box.append(h("div",{class:"mr-pic"},pic.el),info(W.prompt),h("div",{class:"mr-goalbox"},h("p",{class:"mr-gh"},U.goals),list),ctrl,stats,say,end,h("div",{class:"mr-foot"},again));
    api.refresh();ready().then(()=>pic.paint(false));}
  build();api.say(W.start);paintGoals();return box;}
// a card with a heading and a value under it, centred, optionally washed, faded, dashed or struck through
function box2(ctx,x,y,w,hh,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{card(ctx,x,y,w,hh,{kind:"card",wash:o.wash?C(o.wash):null,washA:o.washA||0.4,dashed:o.dashed,seed:o.seed||(x|0)});
  if(o.label)tx(ctx,o.label,x+w/2,y+(o.t?40:hh/2+9),{size:fit(ctx,o.label,w-36,o.lsize||26,800,null,17),w:800,align:"center",col:WC_DARK});
  if(o.t)lines(ctx,o.t,x+w/2,y+(o.label?78:hh/2-6),w-30,{size:o.size||22,max:o.max||2,w:600,align:"center",col:o.col||WC_INK});
  if(o.cross)pencil(ctx,[[x+16,y+hh-14],[x+w-16,y+14]],{col:NO,lw:3,a:0.8,seed:(x|0)+3});});}
// a small round token, such as a request on its way
function dot(ctx,x,y,r,col,a){ctx.save();ctx.globalAlpha*=a==null?1:a;ctx.fillStyle="rgb("+col.join(",")+")";ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore();}

/* ---------- 1 · A capability, not a project: kept up every year ---------- */
// Noor's map: a team, a project or Govern data at the top, its eight capabilities below, coloured by their evidence or left blank;
// June ends the project, a restructure merges the team, and David asks where next year's money goes
PLAY.kept_up=(Lb,api)=>{const W=Lb.w,M=W.msg,S={top:"team",heat:false,june:false,reorg:false,money:false};
  const lost=()=>S.june&&S.top!=="cap",broken=()=>lost()||(S.reorg&&S.top==="team");
  api.seg(api.group(W.topL),W.tops,S.top,k=>{S.top=k;S.money=false;api.say(M[k],k==="cap"?"ok":"warn");},W.topL);
  api.toggle(api.group(),W.heatT,false,v=>{S.heat=v;S.money=false;api.say(v?M.heatOn:M.heatOff,v?"ok":"warn");if(v)api.reach("heat");});
  const g=api.group(W.yearL);
  api.btn(g,W.juneB,()=>{S.june=true;const t=S.top;api.say(t==="cap"?M.juneCap:t==="team"?M.juneTeam:M.juneProject,t==="cap"?"ok":"no");if(t==="cap")api.reach("june");});
  api.btn(g,W.reorgB,()=>{S.reorg=true;const t=S.top;api.say(t==="cap"?M.reorgCap:t==="team"?M.reorgTeam:M.reorgProject,t==="cap"?"ok":"no");if(t==="cap")api.reach("reorg");});
  api.btn(g,W.moneyB,()=>{S.money=S.top==="cap"&&S.heat;if(S.top!=="cap"){api.say(M.moneyTop,"warn");return;}if(!S.heat){api.say(M.moneyNo,"no");return;}api.say(M.moneyHeat,"ok");api.reach("money");});
  const n=W.caps.length,by=c=>W.caps.filter(x=>x.h===c).length;
  return {vh:640,readouts:[[W.read.after,()=>(S.june&&S.top!=="cap"?0:n)+" / "+n,()=>S.june?(S.top==="cap"?"ok":"no"):""],
      [W.read.green,()=>S.heat?by("green")+" / "+n:"?"],[W.read.gaps,()=>S.heat?String(n-by("green")):"?",()=>S.money?"ok":""]],
    draw(ctx,w,hh,k){const top=W.tops.find(t=>t[0]===S.top)[1],bk=broken(),gone=lost();
      wash(ctx,18,16,w-36,140,"strategy",0.28,3);wash(ctx,18,176,w-36,hh-192,"business",0.22,4);
      tx(ctx,W.bands.strategy,36,50,{size:22,w:700,col:WC_MUTED});tx(ctx,W.bands.business,36,210,{size:22,w:700,col:WC_MUTED});
      const tw0=Math.min(w-420,Math.max(380,tw(ctx,top,30,800)+90)),tx0=w/2-tw0/2;
      box2(ctx,tx0,42,tw0,92,{label:top,lsize:30,wash:S.top==="cap"?"gold":null,washA:0.5,dashed:bk,a:bk?0.55:1,cross:bk,seed:70});
      if(S.top==="project")tag(ctx,tx0+tw0+20,88,gone?W.gone:W.ended,{size:22,wash:gone?"red":"amber",washA:0.35,maxW:w-tx0-tw0-40});
      if(S.top==="team"&&S.reorg)tag(ctx,tx0+tw0+20,88,W.redraw,{size:22,wash:"red",washA:0.35,maxW:w-tx0-tw0-40});
      const per=4,gap=14,cw=(w-48-(per-1)*gap)/per,ch=(hh-250-gap)/2,cy=228;
      const rank=c=>c.h==="red"?"1":c.h==="amber"?"2":null;
      const pos=j=>[24+(j%per)*(cw+gap),cy+Math.floor(j/per)*(ch+gap)];
      W.caps.forEach((c,j)=>{const [x,y]=pos(j);if(y===cy)pencil(ctx,[[w/2,134],[x+cw/2,y]],{a:gone?0.1:S.top==="cap"?0.4:0.18,lw:1.8,seed:j+2});});
      W.caps.forEach((c,j)=>{const [x,y]=pos(j);
        withA(ctx,gone?0.35+0.65*(1-k):1,()=>{card(ctx,x,y,cw,ch,{kind:"card",wash:S.heat?C(c.h):null,washA:0.45*(S.heat?k:0)+(S.heat?0.1:0),dashed:gone||!S.heat,seed:80+j});
          lines(ctx,c.t,x+18,y+38,cw-36-(S.money&&rank(c)?56:0),{size:23,max:2,w:800,col:WC_DARK});
          if(S.heat)lines(ctx,c.e,x+18,y+ch-44,cw-36,{size:19,max:2,w:600,col:WC_INK});});
        if(S.money&&rank(c))withA(ctx,k,()=>tag(ctx,x+cw-14,y+30,rank(c),{size:24,align:"right",wash:c.h,washA:0.6}));});
      if(gone)withA(ctx,k,()=>tag(ctx,w/2,cy+ch+gap/2,W.ended,{size:26,align:"center",wash:"red",washA:0.4,maxW:w-80}));}};};

/* ---------- 2 · Who does what, end to end: one request ---------- */
// six steps of Define or change a term, each naming a person or a role and who fills it; the agent's rights; where the decided term
// is written; Clara's request moves along the steps, and stops where a name on leave holds it
PLAY.end_to_end=(Lb,api)=>{const W=Lb.w,M=W.msg,S={names:"names",agent:"note",pub:"each",asked:false,leave:false};
  const stopped=()=>S.leave&&S.names==="names",ran=()=>S.asked&&!stopped(),one=()=>ran()&&S.pub==="map";
  api.seg(api.group(W.stepsL),W.names,S.names,k=>{S.names=k;S.asked=false;api.say(M[k],k==="roles"?"ok":"warn");},W.stepsL);
  api.seg(api.group(W.agentL),W.rights,S.agent,k=>{S.agent=k;S.asked=false;api.say(M[k],k==="note"?"ok":"no");},W.agentL);
  api.seg(api.group(W.pubL),W.pubs,S.pub,k=>{S.pub=k;if(!ran()){api.say(M[k],k==="map"?"ok":"warn");return;}
    api.say(k==="map"?M.copiesMap:M.copiesEach,k==="map"?"ok":"no");if(k==="map")api.reach("copies");},W.pubL);
  const g=api.group();
  api.btn(g,W.askB,()=>{S.asked=true;if(stopped()){api.say(M.runStopped,"no");return;}const good=S.agent==="note";
    api.say(M.runOk+" "+(good?M.agentOk:M.agentDecides)+" "+(S.pub==="map"?M.copiesMap:M.copiesEach),good&&S.pub==="map"?"ok":good?"warn":"no");
    if(good){api.reach("decided");api.reach("agent");}if(S.pub==="map")api.reach("copies");if(S.leave&&good)api.reach("leave");},"go");
  api.btn(g,W.leaveB,()=>{S.leave=true;S.asked=false;const r=S.names==="roles";api.say(r?M.leaveRoles:M.leaveNames,r?"ok":"no");if(r)api.reach("leave");});
  return {vh:600,readouts:[[W.read.days,()=>!S.asked?"–":stopped()?"> 10":"8",()=>!S.asked?"":stopped()?"no":"ok"],[W.read.counts,()=>one()?"1":"3",()=>one()?"ok":""]],
    draw(ctx,w,hh,k){const St=W.steps,n=St.length,gap=12,cw=(w-48-gap*(n-1))/n,ch=190,y=24;
      const at=!S.asked?0:stopped()?1:n-1;
      St.forEach((s,i)=>{const x=24+i*(cw+gap),away=S.leave&&s.alt,held=away&&S.names==="names",dec=i===3&&S.agent==="decide";
        let who=away&&S.names==="roles"?s.alt:dec?St[2].who:s.who;
        const reached=S.asked&&i<=at;card(ctx,x,y,cw,ch,{kind:"card",wash:held&&S.asked?C("red"):reached?C(i===at&&stopped()?"red":"green"):null,washA:0.3,seed:40+i});
        tx(ctx,s.s,x+cw/2,y+40,{size:fit(ctx,s.s,cw-24,26,800,null,17),w:800,align:"center",col:WC_DARK});
        if(S.names==="roles")lines(ctx,s.role,x+cw/2,y+80,cw-20,{size:20,max:2,w:600,align:"center",col:WC_MUTED});
        lines(ctx,who,x+cw/2,y+(S.names==="roles"?140:100),cw-20,{size:21,max:2,w:800,align:"center",col:dec?NO:held?NO:WC_INK});
        if(dec)cross(ctx,x+cw-24,y+ch-24,22);
        if(i<n-1)arrow(ctx,x+cw+1,y+ch/2,x+cw+gap-1,y+ch/2,WC_PENCIL,{head:6,lw:2,a:0.6});});
      // the request, Clara's, on its way along the steps
      if(S.asked){const cx=i=>24+i*(cw+gap)+cw/2,p=RM?1:k,xx=cx(0)+(cx(at)-cx(0))*p;dot(ctx,xx,y+ch+30,13,C("gold"));
        const lab=stopped()?W.stopped:fill(W.days,{n:8});tag(ctx,Math.min(w-30,Math.max(30,xx)),y+ch+70,lab,{size:22,align:"center",wash:stopped()?"red":"green",washA:0.3,maxW:300});}
      // how completion is counted, faculty by faculty
      const by=y+ch+110,bh=hh-by-20;card(ctx,24,by,w-48,bh,{kind:"sheet",seed:49});
      tx(ctx,W.read.counts,48,by+44,{size:22,w:700,col:WC_MUTED});
      if(one())withA(ctx,k,()=>{const t0=tag(ctx,48,by+bh/2+16,W.one,{size:26,wash:"green",washA:0.35,maxW:w-160});tick(ctx,48+t0+30,by+bh/2+12,30,k);});
      else{let x=48;const mw=(w-120)/3;W.counts.forEach((c,i)=>{x+=tag(ctx,x,by+bh/2+16,c,{size:fit(ctx,c,mw-50,23,700,null,16),wash:"amber",washA:0.3,maxW:mw})+16;});}}};};

/* ---------- 3 · Where each piece lives: one home, every copy ---------- */
// the owner of Learners near an award, at home in the data team's repository, and its copies on the platform's page and in the
// catalogue; the page typed by hand or copied from home; a nightly check; Clara becomes the owner, a planner asks, someone types a
// name into the page, and Sam is asked to fix it
PLAY.one_home=(Lb,api)=>{const W=Lb.w,M=W.msg,S={page:"typed",check:false,moved:false,asked:false,typed:false,sam:false};
  const home=()=>S.moved?W.clara:W.jun;
  const page=()=>{if(S.typed&&!S.check)return W.typo;if(S.typed&&S.check)return home();return S.page==="synced"?home():W.jun;};
  const drifted=()=>page()!==home(),toJun=()=>page()===W.jun;
  api.seg(api.group(W.pageL),W.pages,S.page,k=>{S.page=k;S.asked=false;S.sam=false;S.typed=false;api.say(M[k],k==="synced"?"ok":"warn");},W.pageL);
  api.toggle(api.group(),W.checkT,false,v=>{S.check=v;S.typed=false;api.say(v?M.checkOn:M.checkOff,v?"ok":"warn");});
  const g=api.group(W.termL);
  api.btn(g,W.moveB,()=>{S.moved=true;S.asked=false;const t=S.page==="typed";api.say(t?M.moveTyped:M.moveSynced,t?"no":"ok");if(t)api.reach("drift");});
  api.btn(g,W.askB,()=>{if(!S.moved){api.say(M.askFirst,"warn");return;}S.asked=true;const j=toJun();api.say(j?M.askJun:M.askClara,j?"no":"ok");if(!j)api.reach("request");});
  api.btn(g,W.typeB,()=>{S.typed=true;S.asked=false;api.say(S.check?M.typeCheck:M.typeNo,S.check?"ok":"no");if(S.check)api.reach("check");});
  api.btn(g,W.samB,()=>{S.sam=true;const ok=S.page==="synced";api.say(ok?M.samOk:M.samNo,ok?"ok":"no");if(ok)api.reach("whose");});
  return {vh:600,readouts:[[W.read.shows,()=>page(),()=>drifted()?"no":S.moved?"ok":""],[W.read.wait,()=>!S.asked?"–":toJun()?fill(W.days,{n:9}):W.day,()=>!S.asked?"":toJun()?"no":"ok"]],
    draw(ctx,w,hh,k){tx(ctx,W.piece,w/2,44,{size:fit(ctx,W.piece,w-80,28,800,null,20),w:800,align:"center",col:WC_DARK});
      const hx=24,hw=420,hy=86,hh2=hh-130;card(ctx,hx,hy,hw,hh2,{kind:"card",wash:C("gold"),washA:0.32,seed:90});
      tag(ctx,hx+24,hy+40,W.homeTag,{size:20,wash:"gold",washA:0.5});lines(ctx,W.home,hx+24,hy+100,hw-48,{size:26,max:2,w:800,col:WC_DARK});
      pencil(ctx,[[hx+20,hy+170],[hx+hw-20,hy+170]],{a:0.3,lw:2,seed:3});
      withA(ctx,S.moved?0.3+0.7*k:1,()=>tx(ctx,home(),hx+24,hy+226,{size:fit(ctx,home(),hw-48,32,700,null,20),w:700,col:WC_INK}));
      const cx=hx+hw+150,cw=w-cx-24,ch=(hh2-20)/2;
      W.copies.forEach((c,i)=>{const y=hy+i*(ch+20),v=i===0?page():home(),synced=i===1||S.page==="synced",bad=i===0&&drifted();
        card(ctx,cx,y,cw,ch,{kind:"card",wash:C("application"),washA:0.22,seed:91+i});
        tag(ctx,cx+20,y+34,W.copyTag,{size:18,wash:"application",washA:0.4});tx(ctx,c,cx+20,y+82,{size:fit(ctx,c,cw-40,24,800,null,17),w:800,col:WC_DARK});
        const z=fit(ctx,v,cw-200,28,700,null,18);tx(ctx,v,cx+20,y+ch-30,{size:z,w:700,col:bad?NO:WC_INK});
        if(bad){const vw2=tw(ctx,v,z,700);wc_ring(ctx,cx+20+vw2/2,y+ch-40,vw2/2+16,26,k,{col:NO});tag(ctx,cx+cw-16,y+ch-38,W.drifted,{size:20,align:"right",wash:"red",washA:0.35});}
        else if(i===0&&S.typed&&S.check)withA(ctx,k,()=>tag(ctx,cx+cw-16,y+ch-38,W.putRight,{size:20,align:"right",wash:"green",washA:0.35}));
        arrow(ctx,hx+hw+10,hy+hh2/2,cx-12,y+ch/2,synced?WC_PENCIL:WC_MUTED,{head:12,a:synced?0.75:0.4,dash:synced?null:[4,10],noHead:!synced});});
      // the planner's request, on its way to whoever the page names
      if(S.asked){const j=toJun(),y0=hy+ch/2,x0=cx+cw/2;withA(ctx,k,()=>tag(ctx,x0,hy+ch+10,j?"→ "+W.jun+" · "+fill(W.days,{n:9}):"→ "+W.clara+" · "+W.day,{size:22,align:"center",wash:j?"red":"green",washA:0.35,maxW:cw}));}
      if(S.sam)withA(ctx,k,()=>{const ok=S.page==="synced",x=ok?hx+hw/2:cx+cw/2,y=ok?hy+hh2-40:hy+ch-90;mark(ctx,x,y,30,ok,k);});}};};

const BUILD=Object.assign({},window.LD_CLASSIC&&window.LD_CLASSIC.kinds,{play:labPlay});  // one more lab a film, in the classic kinds (site/assets/learn/classic.js)
L.BUILD=BUILD;L.PIX=PIX;L.lib={h,seg,stage,shell,info,btn,fill,num,dec,tx,fit,wrap,lines,tag,card,tick,cross,mark,pencil,wash,head,arrow,noteCard,C,CI,OK,NO};

/* ---------- the labs page: one rail of every lab of the series, in film order, one lab at a time; no film level ---------- */
const labsApp=document.getElementById("series-labs");
if(labsApp&&LABS.length){labsApp.textContent="";const visited=new Set(get("visited",[]));let film=LABS[0].film;
  const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),holder=h("div");
  const ofFilm=n=>LABS.filter(x=>x.film===n);
  rail.append(...LABS.map(Lb=>h("button",{type:"button",role:"tab","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(LABS.indexOf(Lb)+1)),Lb.name)));
  const tabs=()=>[...rail.children];
  // the rail is one stop for the keyboard: arrows move along it, Home and End go to its ends
  rail.addEventListener("keydown",e=>{const bs=tabs(),k=bs.indexOf(document.activeElement);if(k<0)return;let j=null;
    if(e.key==="ArrowRight"||e.key==="ArrowDown")j=(k+1)%bs.length;else if(e.key==="ArrowLeft"||e.key==="ArrowUp")j=(k-1+bs.length)%bs.length;else if(e.key==="Home")j=0;else if(e.key==="End")j=bs.length-1;
    if(j==null)return;e.preventDefault();bs[j].focus();show(bs[j].dataset.id);});
  function show(id,focus){const Lb=labOf(id)||LABS[0];visited.add(Lb.id);set("visited",[...visited]);film=Lb.film;
    tabs().forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    const all=LABS.indexOf(Lb),nxt=LABS[all+1],f=filmOf(film);
    holder.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(all+1))," "+U.of+" "+LABS.length+" · "+f.title),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,p))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real),repoLinks(Lb)),
        h("div",{class:"stop-nav"},watchHref(Lb)?h("a",{class:"btn",href:watchHref(Lb)},U.watch):h("span",{class:"mr-coming"},fill(U.coming,{n:f.n})),nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.kind]?BUILD[Lb.kind](Lb):h("p",null,"")));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus)holder.scrollIntoView({block:"start"});}
  labsApp.append(rail,holder);
  const fromHash=()=>{const hs=(location.hash||"").slice(1),fm=/^film-(\d+)$/.exec(hs);return fm&&ofFilm(+fm[1]).length?ofFilm(+fm[1])[0].id:hs;};
  show(fromHash());window.addEventListener("hashchange",()=>{const id=fromHash();if(labOf(id))show(id,true);});}

/* an order scenario's first showing: its steps mixed, the same way each time for one scenario and another way for the next, and
   never in order, in reverse, in either from some step on round to the one before it, or with more than a few steps where
   they belong or still following one another (the first mix left 3 or 7 steps as they were, turned 4 round and cut 6 in two,
   and did the same to every scenario) */
const mixed=(n,s)=>{const hs=x=>{x=Math.imul(x^x>>>16,0x45d9f3b);x=Math.imul(x^x>>>16,0x45d9f3b);return(x^x>>>16)>>>0;},run=o=>[1,n-1].some(d=>o.every((k,p)=>!p||(k-o[p-1]+n)%n===d)),fine=o=>n<4?o.some((k,p)=>k!==p):!run(o)&&o.filter((k,p)=>k===p).length<=n/4&&o.filter((k,p)=>p&&k===o[p-1]+1).length<=n/3;for(let t=0;t<60;t++){const key=Array.from({length:n},(_,i)=>hs(((s|0)+1)*7919+t*104729+i*1013+n)),o=key.map((_,i)=>i).sort((a,b)=>key[a]-key[b]||a-b);if(fine(o))return o;}return Array.from({length:n},(_,i)=>(2*i+1)%(n|1));};
/* ---------- the scenarios page: evaluation, one list of every scenario of the series; no film level ---------- */
const quizApp=document.getElementById("series-quiz");
if(quizApp&&QS.length){quizApp.textContent="";const ans=get("quiz",{});let sel=0,list=QS,cur=0;
  /* a saved answer keeps the place of the option picked: where that place no longer gives the result saved with it (the options
     have moved since), the scenario is asked again */
  {let moved=0;QS.forEach(q=>{const a=ans[q.n];if(!a||q.type!=="choice"||a.pick==null)return;const o=q.opts[a.pick];if(!o||!!o.ok!==!!a.ok){delete ans[q.n];moved++;}});if(moved)set("quiz",ans);}
  const bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),card=h("div");
  bar.append(dots,score);quizApp.append(h("div",{class:"quiz"},bar,card));
  const labName=id=>(labOf(id)||{name:""}).name,labHref=id=>"../labs/#"+id,A=q=>ans[q.n];
  // n: a film whose scenarios to start at (from #film-<n>), its first one left, or its first; otherwise the first one left
  function pick(n){const of=q=>!n||q.film===n,todo=QS.findIndex(q=>of(q)&&!A(q)),first=QS.findIndex(of);
    if(n&&history.replaceState)history.replaceState(null,"",location.pathname+location.search);
    if(todo>=0)cur=todo;else if(n&&first>=0)cur=first;else{results();return;}render();}
  function paintBar(){dots.replaceChildren(...list.map((q,i)=>h("button",{type:"button",class:A(q)?(A(q).ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1),onclick:()=>{cur=i;render();}},String(i+1))));
    const as=list.filter(A),ok=as.filter(q=>A(q).ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+as.length+" "+U.answered+" · "+(list.length-as.length)+" "+U.toGo));}
  function done(q,ok,pk){ans[q.n]={ok,pick:pk};set("quiz",ans);paintBar();}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why),repoLinks(q));
  function foot(q){const last=cur===list.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:labHref(q.lab)},U.explore+" "+labName(q.lab)),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results();else{cur+=1;render();}}},last?U.results:U.nextQ));}
  function render(){paintBar();quizApp.dataset.film=String(list[cur].film);const q=list[cur],f=PIX[q.vis],body=h("div",{class:"qbody"}),out=h("div"),prev=A(q),Lq=labOf(q.lab)||{};
    const vis=stage(1000,760,c=>{if(f)f(c,1000,760,q.st||{},Lq,1);},q.alt||q.title);
    body.append(h("p",{class:"qtag",style:"--c:"+(Lq.c||"#0e9692")},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+list.length+(sel?"":" · "+filmOf(q.film).title)),h("h3",null,q.title),h("p",{class:"qsit"},q.sit));
    if(q.type==="choice"){const box=h("div",{class:"qopts"});
      const answer=(i,save)=>{[...box.children].forEach((b,j)=>{b.disabled=true;if(q.opts[j].ok)b.classList.add("ok");});const o=q.opts[i];
        if(!o.ok){box.children[i].classList.add("no");box.children[i].append(h("small",null,o.why));}if(save)done(q,!!o.ok,i);out.replaceChildren(feed(!!o.ok,q),foot(q));};
      q.opts.forEach((o,i)=>box.append(h("button",{type:"button",class:"qopt",onclick:()=>answer(i,true)},h("span",{class:"k"},"ABCD"[i]),h("span",null,o.t))));body.append(box);
      if(prev&&prev.pick!=null&&q.opts[prev.pick])answer(prev.pick,false);}
    if(q.type==="order"){const n=q.items.length;let ord=prev&&Array.isArray(prev.pick)&&prev.pick.length===n?prev.pick.slice():mixed(q.items.length,q.n);const box=h("ol",{class:"qorder"});
      const draw=()=>box.replaceChildren(...ord.map((ix,p)=>h("li",null,h("span",{class:"n"},String(p+1)),h("span",null,q.items[ix]),h("span",{class:"mv"},h("button",{type:"button","aria-label":U.up+": "+q.items[ix],onclick:()=>{if(p>0){[ord[p-1],ord[p]]=[ord[p],ord[p-1]];draw();}}},"↑"),h("button",{type:"button","aria-label":U.down+": "+q.items[ix],onclick:()=>{if(p<ord.length-1){[ord[p+1],ord[p]]=[ord[p],ord[p+1]];draw();}}},"↓")))));draw();
      const chk=h("button",{type:"button",class:"btn primary",onclick:()=>finish(true)},U.check);
      function finish(save){const ok=ord.every((ix,p)=>ix===p);[...box.children].forEach((li,p)=>{li.classList.add(ord[p]===p?"ok":"no");li.querySelectorAll("button").forEach(b=>b.disabled=true);});chk.remove();if(save)done(q,ok,ord.slice());out.replaceChildren(feed(ok,q),foot(q));}
      body.append(box,chk);if(prev)finish(false);}
    body.append(out);card.replaceChildren(h("div",{class:"qcard"},h("div",{class:"qvis mr-qvis"},vis.el),body));ready().then(()=>vis.paint());}
  function results(){paintBar();const ok=list.filter(q=>A(q)&&A(q).ok).length,n=list.length,band=((sel&&filmOf(sel).done)||L.done)[ok>=n?0:ok>=n-2?1:ok>=n/2?2:3];
    const by={};list.forEach(q=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(A(q)&&A(q).ok)by[k].ok++;});
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/n*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",null,band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:labHref(k),class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+(labOf(k)||{c:"#a0b2cd"}).c},h("i"),labName(k)+" · "+by[k].ok+"/"+by[k].n))),
      h("button",{type:"button",class:"btn",onclick:()=>{list.forEach(q=>delete ans[q.n]);set("quiz",ans);cur=0;render();}},U.again)),closing(sel)));}
  const fromHash=()=>{const fm=/^#film-(\d+)$/.exec(location.hash||"");return fm&&QS.some(q=>q.film===+fm[1])?+fm[1]:0;};
  pick(fromHash());window.addEventListener("hashchange",()=>{const n=fromHash();if(n)pick(n);});}
})();
