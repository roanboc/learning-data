/* Learning Data: Governance you can use. The labs (Take it apart) and the scenarios (Make the call) of the whole series, one page
   each, from one engine, as site-tools/build_series.py makes them for a series with labs and scenarios of its own: the page loads a
   film's bundle (for the governance films' watercolour: master data's wash.js and the series' tools.js), the words (learn.en.js or
   learn.es.js, which set window.GP) and this file, and fills #series-labs or #series-quiz. The words cover every film of the series;
   the page says which films are on the site, or coming (data-films on its root: {number: {t, k, href, starts} or {t, coming}}), and
   only their labs and scenarios show. Its data-store is the progress prefix.
   Its frame (the films, the rail of labs, the scenarios, progress) is The same one, everywhere's engine, kept here as this series' own
   copy. A lab is one of six kinds, described entirely by its words:
     sort      place each item in a bucket, then check: every item says why, and what goes wrong where you put it
     pick      choose one option, and see what it gets right and wrong
     steps     walk through a sequence, one step at a time
     compose   build a sentence from parts, such as a request
     toggle    switch the lines of a file on and off, then run the check that reads it, as a pull request would
     level     set where a check warns and where it stops, and see what each night's data does
   Pictures are drawn with the films' own components (wc_*): a lab's or a scenario's "vis" names a function in PIX below, which takes
   its words from the lab or the scenario. Without the bundle, the labs still work, on plain paper.
   Progress stays in this browser, under the page's data-store (or GP.store): the labs visited (visited, ids) and the scenarios
   answered (quiz, keyed by number), as assets/learn/path.js counts them. smoke.py expects every lab's tab on the labs page
   ([role=tab][data-id]), the open one selected, one "Watch this part" link to its chapter (#t=), and the film shown on the scenarios
   page as data-film on its root.
   The results for all films, and for the last film, end with the series' last words (GP.close), as its last film ends. */
(()=>{"use strict";
const L=window.GP;if(!L)return;const U=L.ui;
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
const repoLinks=x=>!(x&&x.repo&&x.repo.length&&L.repoBase)?null:h("p",{class:"gp-repo"},h("b",null,U.repo+" "),
  ...x.repo.flatMap((f,i)=>[i?" · ":"",h("a",{href:L.repoBase.replace(/\/blob\/main\//,f.endsWith("/")?"/tree/main/":"/blob/main/")+f.replace(/\/$/,""),target:"_blank",rel:"noopener"},h("code",null,f))]));

/* ---------- the films: the words name all nine; the page says which are on the site, or coming ---------- */
const PUB=(()=>{try{const d=ROOT&&ROOT.dataset.films;if(d)return JSON.parse(d);}catch(e){}return null;})();
// a film's title (t), key (k), page (href) and chapters' starts come from the page; a coming film has its title and "coming"
const FILMS=L.films.filter(f=>!PUB||PUB[f.n]).map(f=>{const p=PUB?PUB[f.n]:{};
  return Object.assign({},f,{title:p.t||f.title,key:p.k||f.key,href:p.href||"../"+(p.k||f.key)+"/",starts:p.starts||{},coming:!!p.coming});});
const filmOf=n=>FILMS.find(f=>f.n===n);
const LABS=L.labs.filter(x=>filmOf(x.film)),QS=L.qs.filter(q=>filmOf(q.film));
const labOf=id=>LABS.find(x=>x.id===id);
// "Watch this part": the film's page, at the lab's chapter when it has one; a film still being made has none
function watchHref(Lb){const f=filmOf(Lb.film)||{},t=Lb.chapter?f.starts[Lb.chapter]:null;return f.coming?null:f.href+(t!=null?"#t="+Math.ceil(t):"");}
// the series' last words (GP.close), from its last film's closing chapter: under the results for all films, and for that film
function closing(sel){const C=L.close;if(!C||!filmOf(C.film)||(sel&&sel!==C.film))return null;const href=watchHref(C);
  return h("section",{class:"gp-close","aria-labelledby":"gp-close-h"},h("h3",{id:"gp-close-h"},C.title),h("p",null,C.lead),
    h("ul",null,...C.parts.map(([b,t])=>h("li",null,h("b",null,b+": "),t))),h("p",null,C.gov),
    C.next?h("p",{class:"gp-next"},h("b",null,U.next+" "),C.next):null,href?h("a",{class:"btn",href},U.watch):null);}

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
  cv.style.aspectRatio=vw+"/"+vh;if("ResizeObserver" in window)new ResizeObserver(()=>frame(1)).observe(cv);return{el:cv,paint};}

/* ---------- drawing helpers, on the series' components ---------- */
const hexRGB=x=>{const m=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(x||"");return m?[parseInt(m[1],16),parseInt(m[2],16),parseInt(m[3],16)]:null;};
// a colour by name: a role (student, tutor…), an industry (health, bank…), a side (person, steward), or a hex
function C(k){if(Array.isArray(k))return k;if(!k)return WC_PENCIL;if(k[0]==="#")return hexRGB(k)||WC_PENCIL;
  return WC_ROLE[k]||WC_IND[k]||({person:WC_SIDE.none,steward:WC_SIDE.biz,tech:WC_SIDE.tech,ink:WC_INK,muted:WC_MUTED,no:WC_NO,ok:WC_ROLEINK.alumna,amber:WC_ROLE.applicant,badge:WC_BADGE})[k]||WC_PENCIL;}
// text in a role's colour, dark enough to read on paper
const CI=k=>(typeof k==="string"&&WC_ROLEINK[k])||(k==="no"?WC_NO:k==="ok"?WC_ROLEINK.alumna:WC_INK);
const OK=[22,120,68],NO=[184,56,40];
function tx(ctx,s,x,y,o){o=o||{};wc_T(ctx,String(s),x,y,{size:o.size||30,w:o.w||600,f:o.f,align:o.align,col:o.col||WC_INK,a:o.a});}
// words a picture had to cut, or that still overflow at the smallest size: kept in window.GP_MISS, so checks can list them
const MISS=(window.GP_MISS=window.GP_MISS||[]);function miss(s){s=String(s);if(MISS.indexOf(s)<0)MISS.push(s);}
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
// Linh, as the master record: white paper in a pencil line, banded in her roles' colours
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
const AMB=[176,116,0];
// a check's light: a tick when it passes, a cross when it stops, an amber dot when it warns, a pencil ring before it has run
function light(ctx,x,y,s,st,k){if(st==="pass")tick(ctx,x,y,s,k);else if(st==="fail")cross(ctx,x,y,s*0.8,k);
  else if(st==="warn"){ctx.fillStyle=rgba(AMB,0.9);ctx.beginPath();ctx.arc(x,y,s*0.36*(k==null?1:Math.max(0.3,k)),0,TAU);ctx.fill();}
  else{ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,s*0.34,0,TAU);ctx.stroke();}}
const stCol=st=>st==="pass"?OK:st==="fail"?NO:st==="warn"?AMB:WC_MUTED;
// a row of option chips, the chosen one washed in the lab's colour; returns the row's height
function chips(ctx,w,y,opts,cur,c){const n=opts.length,gap=12,cw=(w-48-gap*(n-1))/n;
  opts.forEach(([key,t],i)=>{const x=24+i*(cw+gap),on=key===cur;withA(ctx,on?1:0.5,()=>{card(ctx,x,y,cw,62,{kind:"card",wash:on?c:null,washA:0.3,seed:300+i});
    tx(ctx,t,x+cw/2,y+40,{size:fit(ctx,t,cw-28,22,800,null,15),w:800,align:"center",col:WC_DARK});});});return 62;}
const PIX={
  /* sort: the buckets side by side, each with what's been put in it; the last one put there drops in */
  shelves(ctx,w,hh,st,Lb,k){const V=Lb.w,cols=V.buckets;if(cols.length>4)return PIX.lanes(ctx,w,hh,st,Lb,k);const cw=(w-60)/cols.length;
    cols.forEach(([key,label,hex,sub],i)=>{const x=30+i*cw,cx=x+cw/2;card(ctx,x+8,22,cw-16,hh-44,{kind:"sheet",seed:3+i});
      wash(ctx,x+24,38,cw-48,58,hex||"person",0.45,11+i);tx(ctx,label,cx,78,{size:fit(ctx,label,cw-60,28,800,null,17),w:800,align:"center",col:WC_DARK});
      if(sub)tx(ctx,sub,cx,126,{size:fit(ctx,sub,cw-50,22,600,null,15),align:"center",col:WC_MUTED});
      const ey=sub?146:112;pencil(ctx,[[x+30,ey],[x+cw-30,ey]],{a:0.35,lw:2,seed:7+i});
      const mine=V.items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick[j]===key);let y=ey+44;
      const cap=Math.max(1,Math.floor((hh-ey-80)/50));
      mine.slice(0,cap).forEach(([it,j])=>{const drop=j===st.last?1-k:0,s=short(it);withA(ctx,1-drop*0.8,()=>{tag(ctx,x+22,y-drop*30,s,{size:fit(ctx,s,cw-112,22,700,null,15),maxW:cw-72});
        if(st.checked)mark(ctx,x+cw-30,y-4,24,it.b===key,k);});y+=50;});
      if(mine.length>cap)tx(ctx,"+"+(mine.length-cap),cx,y,{size:22,align:"center",col:WC_MUTED});});},
  /* sort, with more buckets than fit side by side: a lane for each, its label on the left, what's been put in it along the lane */
  lanes(ctx,w,hh,st,Lb,k){const V=Lb.w,ls=V.buckets,lw=250,lh=(hh-40)/ls.length;
    ls.forEach(([key,label,hex,sub],i)=>{const y=20+i*lh;card(ctx,24,y+4,w-48,lh-8,{kind:"sheet",seed:5+i});wash(ctx,40,y+16,lw-30,lh-32,hex||"person",0.4,9+i);
      const ty=y+lh/2+(sub?-4:8);tx(ctx,label,54,ty,{size:fit(ctx,label,lw-58,24,800,null,15),w:800,col:WC_DARK});if(sub)tx(ctx,sub,54,ty+26,{size:fit(ctx,sub,lw-58,18,600,null,13),col:WC_MUTED});
      const mine=V.items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick[j]===key);let x=lw+44;
      mine.forEach(([it,j])=>{const s=short(it),z=fit(ctx,s,330,22,700,null,15),ww=Math.min(tw(ctx,s,z,700)+40,370)+(st.checked?40:0);if(x+ww>w-40){tx(ctx,"+",x,y+lh/2+8,{size:24,col:WC_MUTED});x=w;return;}
        const drop=j===st.last?1-k:0;withA(ctx,1-drop*0.8,()=>{const tw0=tag(ctx,x,y+lh/2-drop*20,s,{size:z,maxW:370});if(st.checked)mark(ctx,x+tw0+20,y+lh/2-4,24,it.b===key,k);});x+=ww+12;});});},
  /* pick: the options as chips; under them, what the chosen one gets right and wrong */
  options(ctx,w,hh,st,Lb,k){const V=Lb.w,r=V.res[st.pick],rows=V.short||V.checks;chips(ctx,w,20,V.opts,st.pick,Lb.c);
    const top=106;card(ctx,24,top,w-48,hh-top-20,{kind:"sheet",seed:310});const t=(V.opts.find(o=>o[0]===st.pick)||[,""])[1];
    tx(ctx,t,52,top+52,{size:fit(ctx,t,w-110,30,800,null,20),w:800,col:WC_DARK});pencil(ctx,[[48,top+72],[w-48,top+72]],{a:0.3,lw:2,seed:5});
    const rh=Math.min(84,(hh-top-120)/rows.length);rows.forEach((s,i)=>{const y=top+112+i*rh,v=r[i];
      lines(ctx,s,104,y+8,w-200,{size:24,w:700,max:2,lh:28});light(ctx,66,y,32,v===1?"pass":v===0.5?"warn":"fail",k);});},
  /* steps: the sequence as cards, the step you're on in the lab's colour, the ones before it ticked */
  flow(ctx,w,hh,st,Lb,k){const S=Lb.w.steps,n=S.length,per=n<=4?n:Math.ceil(n/2),rows=Math.ceil(n/per),gap=18,cw=(w-48-gap*(per-1))/per,ch=(hh-40-gap*(rows-1))/rows;
    S.forEach((s,i)=>{const col=i%per,row=Math.floor(i/per),x=24+col*(cw+gap),y=20+row*(ch+gap),on=i===st.step,past=i<st.step;
      withA(ctx,on?1:past?0.8:0.36,()=>{card(ctx,x,y,cw,ch,{kind:"card",wash:on?Lb.c:null,washA:0.22,seed:320+i});
        tx(ctx,String(i+1),x+26,y+50,{size:34,w:800,col:WC_MUTED});
        const p=s.p||s.t;lines(ctx,p,x+26,y+92,cw-52,{size:fit(ctx,p,(cw-52)*3,26,800,null,19),w:800,col:WC_DARK,max:3,lh:32});
        if(s.who)tag(ctx,x+20,y+ch-38,s.who,{size:fit(ctx,s.who,cw-80,20,700,null,15),wash:on?"ok":null,washA:0.25,maxW:cw-40});
        if(past)tick(ctx,x+cw-34,y+40,28,1);});
      if(col<per-1&&i<n-1)pencil(ctx,[[x+cw+3,y+ch/2],[x+cw+gap-3,y+ch/2]],{a:0.4,lw:2.4,seed:i});});},
  /* compose: the form or sentence, slot by slot, each part with its mark */
  sentence(ctx,w,hh,st,Lb,k){const V=Lb.w,n=V.slots.length;card(ctx,24,20,w-48,hh-40,{kind:"sheet",seed:330});
    tx(ctx,V.form||V.head,52,72,{size:fit(ctx,V.form||V.head,w-110,30,800,null,20),w:800,col:WC_DARK});if(V.formSub)tx(ctx,V.formSub,52,106,{size:22,w:600,col:WC_MUTED});
    const top=V.formSub?132:110,rh=(hh-top-50)/n;V.slots.forEach((sl,i)=>{const y=top+i*rh,p=st.pick[i];pencil(ctx,[[48,y],[w-48,y]],{a:0.2,lw:1.6,seed:i+2});
      tx(ctx,sl.label,52,y+36,{size:fit(ctx,sl.label,w-110,21,700,null,15),w:700,col:WC_MUTED});
      if(p==null){tx(ctx,"…",52,y+rh*0.72,{size:28,col:WC_MUTED});return;}
      const o=sl.opts[p],tw1=tag(ctx,52,y+rh*0.66,o.t,{size:fit(ctx,o.t,w-220,22,700,null,15),wash:o.ok?"ok":"no",washA:0.28,maxW:w-170});mark(ctx,52+tw1+28,y+rh*0.66-2,26,o.ok,k);});},
  /* toggle: the file as it stands, its missing lines as gaps, and the check's lights beside it */
  file(ctx,w,hh,st,Lb,k){const V=Lb.w,fw=Math.round(w*0.56),on=st.on,ks=V.toggles.map(t=>t.k);
    card(ctx,20,20,fw,hh-40,{kind:"sheet",seed:340});tx(ctx,V.path,44,64,{size:fit(ctx,V.path,fw-60,22,500,"mono",14),w:500,f:"mono",col:WC_MUTED});
    pencil(ctx,[[40,82],[fw,82]],{a:0.3,lw:1.6,seed:3});
    // the lines as they stand: a run of missing lines shows as one gap
    const isOn=key=>key==null||on[ks.indexOf(key)],L=V.code.filter(([key],i)=>isOn(key)||i===0||isOn(V.code[i-1][0])),lh=Math.min(38,(hh-130)/V.code.length);
    L.forEach(([key,t],i)=>{const y=118+i*lh;
      if(isOn(key)){if(key!=null)withA(ctx,0.5,()=>wash(ctx,36,y-24,fw-36,lh-4,Lb.c,0.35,350+i));tx(ctx,t,44,y,{size:fit(ctx,t,fw-50,21,500,"mono",13),w:500,f:"mono",col:WC_DARK});}
      else tx(ctx,"…",44,y,{size:22,f:"mono",w:500,col:WC_MUTED,a:0.7});});
    const px=fw+40,pw=w-px-20,C2=V.checks,res=st.res;card(ctx,px,20,pw,hh-40,{kind:"card",seed:360});
    tx(ctx,V.panel,px+24,64,{size:fit(ctx,V.panel,pw-48,24,800,null,17),w:800,col:WC_DARK});
    if(st.ran){const f=res.filter(r=>r==="fail").length,wn=res.filter(r=>r==="warn").length,sum=f?fill(V.sumFail,{n:f}):wn?fill(V.sumWarn,{n:wn}):V.sumPass;
      tx(ctx,sum,px+24,98,{size:fit(ctx,sum,pw-48,20,700,null,14),w:700,col:f?NO:wn?AMB:OK});}
    const rh=Math.min(74,(hh-150)/C2.length);C2.forEach((c,i)=>{const y=144+i*rh;light(ctx,px+40,y,30,st.ran?res[i]:null,k);
      lines(ctx,c.s,px+70,y+8,pw-86,{size:fit(ctx,c.s,(pw-86)*2,21,700,null,15),w:700,max:2,lh:26,col:st.ran?WC_DARK:WC_MUTED});});},
  /* pick: the table, as the chosen reader sees it: values, or stars where a policy masks them */
  masked(ctx,w,hh,st,Lb,k){const V=Lb.w,T=V.table,ms=V.mask[st.pick]||[],n=T.cols.length;chips(ctx,w,20,V.opts,st.pick,Lb.c);
    // each column as wide as its longest value needs
    const need=T.cols.map((c,i)=>Math.max(c.length,...T.rows.map(r=>r[i].length))+3),sum=need.reduce((a,b)=>a+b,0),cx=[];let acc=24;need.forEach(q=>{cx.push(acc);acc+=(w-48)*q/sum;});
    const cwOf=i=>(w-48)*need[i]/sum,top=106;card(ctx,24,top,w-48,hh-top-20,{kind:"sheet",seed:370});tx(ctx,T.name,48,top+46,{size:24,w:500,f:"mono",col:WC_MUTED});
    T.cols.forEach((c,i)=>{const x=cx[i]+14,cw=cwOf(i),cls=T.cls[i];tx(ctx,c,x,top+92,{size:fit(ctx,c,cw-22,20,500,"mono",13),w:500,f:"mono",col:WC_DARK});
      tag(ctx,x,top+126,V.clsL[cls],{size:fit(ctx,V.clsL[cls],cw-60,17,700,null,13),wash:cls==="direct"?"no":cls==="pseud"?"amber":"ok",washA:0.3,maxW:cw-18});});
    pencil(ctx,[[44,top+152],[w-44,top+152]],{a:0.3,lw:1.6,seed:4});
    const rh=Math.min(64,(hh-top-190)/T.rows.length);T.rows.forEach((r,j)=>{const y=top+196+j*rh;r.forEach((v,i)=>{const x=cx[i]+14,cw=cwOf(i),hid=ms.includes(i),s=hid?"***":v;
      withA(ctx,hid?Math.max(0.5,k):1,()=>tx(ctx,s,x,y,{size:fit(ctx,s,cw-22,21,500,"mono",13),w:500,f:"mono",col:hid?WC_MUTED:WC_INK}));});});},
  /* level: each night's count as a bar, the line where it warns and the line where it stops, and what the night did */
  level(ctx,w,hh,st,Lb,k){const V=Lb.w,N=V.nights,x0=90,x1=w-30,y0=60,y1=hh-96,max=V.max||10,bw=(x1-x0)/N.length,Y=v=>y1-(y1-y0)*Math.min(v,max)/max;
    for(let v=0;v<=max;v+=2){pencil(ctx,[[x0,Y(v)],[x1,Y(v)]],{a:0.1,lw:1.2,seed:v+1});tx(ctx,String(v),x0-16,Y(v)+7,{size:20,col:WC_MUTED,align:"right"});}
    tx(ctx,V.yL,x0,34,{size:20,w:700,col:WC_MUTED});
    N.forEach((nt,i)=>{const x=x0+i*bw+bw*0.2,ww=bw*0.6,o=st.out[i],c=o==="fail"?NO:o==="warn"?AMB:OK;
      if(nt.n>0)wash(ctx,x,Y(nt.n*k),ww,Math.max(4,y1-Y(nt.n*k)),c,0.55,380+i);tx(ctx,String(nt.n),x+ww/2,Y(nt.n)-12,{size:22,w:800,align:"center",col:WC_DARK});
      tx(ctx,nt.d,x+ww/2,y1+30,{size:fit(ctx,nt.d,bw-6,19,600,null,13),align:"center",col:WC_MUTED});
      const lt=V.outL[o];tx(ctx,lt,x+ww/2,y1+62,{size:fit(ctx,lt,bw-6,19,800,null,13),w:800,align:"center",col:c});});
    const line=(v,c,t,seed)=>{const y=Y(v);wc_pencil(ctx,[[x0,y],[x1,y]],1,{col:c,lw:3,a:0.85,seed});tag(ctx,x1,y-24,t,{size:18,align:"right",wash:c===NO?"no":"amber",washA:0.3});};
    line(st.warn-0.5,AMB,fill(V.warnAt,{n:st.warn}),3);line(st.stop+0.5,NO,fill(V.stopAt,{n:st.stop}),4);},
  /* ---------- scenario vignettes: drawn from each scenario's words (st) ---------- */
  // a few tags in a column, optionally washed, with a heading
  tags(ctx,w,hh,st){if(st.title)head(ctx,w/2,64,st.title,st.sub,{align:"center",size:34});const ts=st.tags||[],y0=st.title?(st.sub?190:150):80,gap=(hh-y0-30)/Math.max(1,ts.length);
    ts.forEach((t,i)=>{const o=typeof t==="string"?{t}:t,y=y0+i*gap+gap/2;tag(ctx,w/2,y,o.t,{size:fit(ctx,o.t,w-140,34,700),align:"center",wash:o.c,maxW:w-60});if(o.mark!=null)mark(ctx,w-50,y-4,32,o.mark,1);});},
  // a file: its path and its lines, some washed, some marked; the block sits in the middle of the card
  code(ctx,w,hh,st){card(ctx,30,30,w-60,hh-60,{kind:"sheet",seed:400});tx(ctx,st.path||"",64,90,{size:fit(ctx,st.path||"",w-130,28,500,"mono",16),w:500,f:"mono",col:WC_MUTED});
    pencil(ctx,[[56,116],[w-56,116]],{a:0.3,lw:1.6,seed:2});const ls=st.lines||[],lh=60,top=116+Math.max(60,(hh-116-(st.say?150:60)-ls.length*lh)/2);
    ls.forEach((l,i)=>{const o=typeof l==="string"?{t:l}:l,y=top+i*lh+30;if(o.c)wash(ctx,48,y-38,w-96,lh-8,o.c,0.3,410+i);
      tx(ctx,o.t,64,y,{size:fit(ctx,o.t,w-(o.mark!=null?200:136),30,500,"mono",16),w:500,f:"mono",col:WC_DARK});if(o.mark!=null)mark(ctx,w-80,y-10,32,o.mark,1);});
    if(st.say)tag(ctx,w/2,hh-96,st.say,{size:fit(ctx,st.say,w-160,30,700,null,18),align:"center",wash:st.sayC,washA:0.3,maxW:w-80});},
  // a message, a request or a page: who it's from, its title, its lines, and chips under it, the block in the middle of the card
  note(ctx,w,hh,st){card(ctx,40,40,w-80,hh-80,{kind:"card",seed:420});const mw=w-170,TL=wrapN(ctx,st.title||"",mw,40,800,null,2),
      LS=(st.lines||[]).map(l=>wrapN(ctx,l,mw,30,600,null,3)),cs=st.chips||[],H=(st.from?56:0)+TL.length*50+30+LS.reduce((a,l)=>a+l.length*40+16,0)+(cs.length?80:0);
    let y=Math.max(110,(hh-H)/2+30);
    if(st.from){tx(ctx,st.from,84,y,{size:fit(ctx,st.from,mw,26,700,null,16),w:700,col:WC_MUTED});y+=56;}
    TL.forEach(l=>{tx(ctx,l,84,y,{size:fit(ctx,l,mw,40,800,null,24),w:800,col:WC_DARK});y+=50;});pencil(ctx,[[80,y-18],[w-80,y-18]],{a:0.25,lw:1.6,seed:3});y+=30;
    LS.forEach(L2=>{L2.forEach(l=>{tx(ctx,l,84,y,{size:fit(ctx,l,mw,30,600,null,18),w:600});y+=40;});y+=16;});
    let x=84;const cy=Math.min(hh-100,y+30);cs.forEach(c=>{const o=typeof c==="string"?{t:c}:c,ww=tag(ctx,x,cy,o.t,{size:26,wash:o.c,washA:0.32,maxW:w-160-(x-84)});x+=ww+14;});},
  // a small table: its name, its columns, its rows; a star is a masked value
  grid(ctx,w,hh,st){const cols=st.cols||[],n=cols.length,cw=(w-100)/n;card(ctx,30,30,w-60,hh-60,{kind:"sheet",seed:430});
    tx(ctx,st.name||"",64,94,{size:fit(ctx,st.name||"",w-130,28,500,"mono",16),w:500,f:"mono",col:WC_MUTED});
    const rs=st.rows||[],rh=64,top=Math.max(170,(hh-(st.say?150:60)-90-rs.length*rh)/2+90);
    cols.forEach((c,i)=>tx(ctx,c,50+i*cw+14,top,{size:fit(ctx,c,cw-24,28,700,null,16),w:700,col:WC_DARK}));pencil(ctx,[[56,top+24],[w-56,top+24]],{a:0.3,lw:1.6,seed:5});
    rs.forEach((r,j)=>{const y=top+80+j*rh;if(st.ring===j)wash(ctx,48,y-42,w-96,rh-6,st.ringC||"amber",0.3,440+j);r.forEach((v,i)=>tx(ctx,v,50+i*cw+14,y,{size:fit(ctx,v,cw-24,28,500,"mono",15),w:500,f:"mono",col:v.indexOf("*")>=0?WC_MUTED:WC_INK}));});
    if(st.say)tag(ctx,w/2,hh-96,st.say,{size:fit(ctx,st.say,w-160,30,700,null,18),align:"center",wash:st.sayC,washA:0.3,maxW:w-80});},
  // a check's results: each with its light, the list in the middle of the card
  results(ctx,w,hh,st){card(ctx,40,40,w-80,hh-80,{kind:"card",seed:450});tx(ctx,st.title||"",84,110,{size:fit(ctx,st.title||"",w-170,36,800,null,22),w:800,col:WC_DARK});
    if(st.sub)tx(ctx,st.sub,84,154,{size:fit(ctx,st.sub,w-170,26,600,null,16),w:600,col:WC_MUTED});
    const it=st.items||[],rh=96,h0=st.sub?190:150,top=h0+Math.max(20,(hh-h0-(st.say?150:70)-it.length*rh)/2);
    it.forEach((o,i)=>{const y=top+i*rh+40;light(ctx,108,y,40,o.st,1);lines(ctx,o.t,152,y+10,w-250,{size:fit(ctx,o.t,(w-250)*2,30,700,null,20),w:700,max:2,lh:36,col:o.st==="none"?WC_MUTED:WC_DARK});});
    if(st.say)tag(ctx,w/2,hh-110,st.say,{size:fit(ctx,st.say,w-180,28,700,null,18),align:"center",wash:st.sayC,washA:0.3,maxW:w-120});},
};

/* ---------- the lab's parts ---------- */
function seg(opts,cur,on,label){const s=h("div",{class:"gp-seg",role:"group","aria-label":label||""});
  opts.forEach(([k,t,c])=>s.append(h("button",{type:"button","aria-pressed":String(k===cur),"data-k":k,style:c?"--b:"+c:null,
    onclick:()=>{s.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===String(k))));on(k);}},t)));return s;}
function picture(Lb,state){const f=PIX[Lb.vis];if(!f)return null;const vw=Lb.vw||1200,vh=Lb.vh||620;return stage(vw,vh,(c,k)=>f(c,vw,vh,state(),Lb,k),Lb.alt||Lb.name);}
const shell=(Lb,pic,...parts)=>h("div",{class:"gp-lab",style:"--c:"+Lb.c},...(pic?[pic.el]:[]),...parts);
const info=t=>t?h("p",{class:"gp-info"},t):null;
const btn=(t,on,cls)=>h("button",{type:"button",class:"gp-btn"+(cls?" "+cls:""),onclick:on},t);

/* ---------- sort: every item in its bucket ---------- */
function labSort(Lb){const V=Lb.w,say=h("p",{class:"gp-say",role:"status"}),pick={};let checked=false,last=-1;
  const pic=picture(Lb,()=>({pick,checked,last})),rows=h("div",{class:"gp-rows"});
  const go=btn(U.check,()=>{checked=true;last=-1;draw();upd(true);},"go"),again=btn(U.again,()=>{for(const k in pick)delete pick[k];checked=false;last=-1;draw();upd();});
  const bname=k=>(V.buckets.find(b=>b[0]===k)||[,""])[1];
  function draw(){rows.replaceChildren(...V.items.map((it,i)=>{const ok=checked&&pick[i]===it.b,no=checked&&pick[i]!==it.b;
    return h("div",{class:"gp-row"+(ok?" ok":no?" no":"")},h("p",{class:"gp-item"},it.t),
      seg(V.buckets.map(b=>[b[0],b[1],b[2]]),pick[i],k=>{pick[i]=k;last=i;if(checked){checked=false;draw();}upd(true);},it.t),
      checked?h("p",{class:"gp-why"},h("b",null,ok?U.right:fill(U.belongs,{b:bname(it.b)}))," ",no&&it.no&&it.no[pick[i]]?it.no[pick[i]]+" ":"",it.why):null);}));}
  function upd(anim){const n=Object.keys(pick).length,right=V.items.filter((it,i)=>pick[i]===it.b).length;go.disabled=n<V.items.length;
    say.textContent=checked?fill(right===V.items.length?V.sayAll:V.saySome,{n:right,of:V.items.length}):(n<V.items.length?fill(U.placed,{n,of:V.items.length}):U.ready);if(pic)pic.paint(anim);}
  draw();ready().then(()=>upd());return shell(Lb,pic,info(V.prompt),rows,h("div",{class:"gp-controls"},go,again),say);}

/* ---------- pick: one option, and what it gets right ---------- */
function labPick(Lb){const V=Lb.w;let cur=V.opts[0][0];const say=h("p",{class:"gp-say",role:"status"}),list=h("ul",{class:"gp-checks"}),stats=h("div",{class:"gp-stats"});
  const pic=picture(Lb,()=>({pick:cur}));
  function upd(anim){const r=V.res[cur];list.replaceChildren(...V.checks.map((t,i)=>h("li",{class:r[i]===1?"ok":r[i]===0.5?"warn":"no"},t)));
    stats.replaceChildren(...(V.stats&&V.stats[cur]?V.stats[cur].map(([n,t])=>h("p",null,h("b",null,n),h("span",null,t))):[]));say.textContent=V.say[cur];if(pic)pic.paint(anim);}
  ready().then(()=>upd());return shell(Lb,pic,info(V.prompt),h("div",{class:"gp-controls"},h("span",{class:"gp-lbl"},V.label),seg(V.opts,cur,k=>{cur=k;upd(true);},V.label)),stats,list,say);}

/* ---------- steps: a sequence, one step at a time ---------- */
function labSteps(Lb){const V=Lb.w;let cur=0;const say=h("p",{class:"gp-say",role:"status"}),ol=h("ol",{class:"gp-steps"});
  const pic=picture(Lb,()=>({step:cur}));
  const prev=btn("← "+U.back,()=>{if(cur>0){cur--;upd(true);}}),next=btn(U.nextStep+" →",()=>{if(cur<V.steps.length-1){cur++;upd(true);}},"go");
  function upd(anim){ol.replaceChildren(...V.steps.map((s,i)=>h("li",{class:i<cur?"done":i===cur?"on":"",...(i===cur?{"aria-current":"step"}:{})},h("b",null,s.t),i===cur?h("span",null,s.d):null)));
    prev.disabled=cur===0;next.disabled=cur===V.steps.length-1;say.textContent=cur===V.steps.length-1?V.sayEnd:fill(U.stepOf,{n:cur+1,of:V.steps.length});if(pic)pic.paint(anim);}
  ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),ol,h("div",{class:"gp-controls"},prev,next),say);}

/* ---------- compose: a sentence from parts ---------- */
function labCompose(Lb){const V=Lb.w,pick=V.slots.map(()=>null),say=h("p",{class:"gp-say",role:"status"}),out=h("p",{class:"gp-sentence"}),notes=h("ul",{class:"gp-checks"});
  const pic=picture(Lb,()=>({pick}));
  const slots=V.slots.map((sl,i)=>h("div",{class:"gp-controls gp-slot"},h("span",{class:"gp-lbl"},sl.label),seg(sl.opts.map((o,j)=>[String(j),o.t]),null,k=>{pick[i]=+k;upd(true);},sl.label)));
  function upd(anim){out.replaceChildren(h("b",null,V.head+" "),...V.slots.map((sl,i)=>pick[i]==null?h("span",{class:"gap"},"… "):h("span",{class:sl.opts[pick[i]].ok?"ok":"no"},sl.opts[pick[i]].t+" ")));
    notes.replaceChildren(...V.slots.map((sl,i)=>pick[i]==null?null:h("li",{class:sl.opts[pick[i]].ok?"ok":"no"},sl.opts[pick[i]].why)).filter(Boolean));
    const done=pick.every(p=>p!=null),good=done&&pick.every((p,i)=>V.slots[i].opts[p].ok);say.textContent=!done?V.sayStart:good?V.sayGood:V.sayFix;if(pic)pic.paint(anim);}
  ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),...slots,out,notes,say);}


/* ---------- toggle: the lines of a file, and the check that reads it ---------- */
// a check passes when every line it needs is in the file; otherwise it fails, or warns when its level is "warn"
function labToggle(Lb){const V=Lb.w,on=V.toggles.map(t=>!!t.on);let ran=false;
  const say=h("p",{class:"gp-say",role:"status"}),box=h("div",{class:"gp-toggles",role:"group","aria-label":V.togglesL}),log=h("ul",{class:"gp-checks","aria-live":"polite"});
  const ks=V.toggles.map(t=>t.k),res=()=>V.checks.map(c=>c.need.every(n=>on[ks.indexOf(n)])?"pass":c.level==="warn"?"warn":"fail");
  const pic=picture(Lb,()=>({on,ran,res:res()}));
  const run=btn(V.run,()=>{ran=true;draw();upd(true);},"go");
  function draw(){box.replaceChildren(...V.toggles.map((t,i)=>h("label",null,h("input",{type:"checkbox",checked:on[i]||null,onchange:e=>{on[i]=e.target.checked;ran=false;draw();upd(true);}}),h("span",null,t.label))));
    const r=res();log.replaceChildren(...(ran?V.checks.map((c,i)=>h("li",{class:r[i]==="pass"?"ok":r[i]==="warn"?"warn":"no"},h("b",null,c.t+" "),r[i]==="pass"?(c.pass||""):c.fail)):[]));}
  function upd(anim){const r=res(),f=r.filter(x=>x==="fail").length,wn=r.filter(x=>x==="warn").length;
    say.textContent=!ran?fill(V.sayStart,{n:on.filter(Boolean).length,of:on.length}):f?fill(V.sayFix,{n:f}):wn?fill(V.sayWarn,{n:wn}):V.sayGood;if(pic)pic.paint(anim);}
  draw();ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),h("p",{class:"gp-lbl gp-pad"},V.togglesL),box,h("div",{class:"gp-controls"},run),log,say);}

/* ---------- level: where a check warns, where it stops, and what each night does ---------- */
// a night warns from warn rows on, and stops above stop rows
function labLevel(Lb){const V=Lb.w;let warn=V.warn,stop=V.stop;const say=h("p",{class:"gp-say",role:"status"}),stats=h("div",{class:"gp-stats"}),goals=h("ul",{class:"gp-checks"});
  const outs=()=>V.nights.map(nt=>nt.n>stop?"fail":nt.n>=warn?"warn":"pass");
  const pic=picture(Lb,()=>({warn,stop,out:outs()}));
  const slider=(lbl,min,max,get,setv)=>{const val=h("output",null,String(get()));const inp=h("input",{type:"range",min:String(min),max:String(max),step:"1",value:String(get()),"aria-label":lbl,"aria-valuetext":String(get()),
      oninput:e=>{setv(+e.target.value);inp.value=String(get());val.textContent=String(get());inp.setAttribute("aria-valuetext",String(get()));upd(true);}});
    return h("label",{class:"gp-slider"},h("span",null,lbl),inp,val);};
  const sW=slider(V.warnL,1,V.max,()=>warn,v=>{warn=Math.min(v,stop+1);}),sS=slider(V.stopL,1,V.max,()=>stop,v=>{stop=Math.max(v,warn-1);});
  function upd(anim){const o=outs(),c=k=>o.filter(x=>x===k).length;
    stats.replaceChildren(...[["pass",c("pass")],["warn",c("warn")],["fail",c("fail")]].map(([k,n])=>h("p",{class:k==="fail"&&n?"no":k==="warn"&&n?"warn":""},h("b",null,String(n)),h("span",null,V.stat[k]))));
    const ok=V.goals.map(g=>o[g.night]===g.want);goals.replaceChildren(...V.goals.map((g,i)=>h("li",{class:ok[i]?"ok":"no"},g.t)));
    const bad=V.goals.findIndex((g,i)=>!ok[i]);say.textContent=bad<0?fill(V.sayGood,{warn,stop}):V.goals[bad].miss;if(pic)pic.paint(anim);}
  ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),h("div",{class:"gp-sliders"},sW,sS),stats,goals,say);}

const BUILD={sort:labSort,pick:labPick,steps:labSteps,compose:labCompose,toggle:labToggle,level:labLevel};
L.BUILD=BUILD;L.PIX=PIX;L.lib={h,seg,stage,picture,shell,info,btn,fill,num,tx,fit,wrap,lines,tag,card,tick,cross,mark,pencil,wash,head,light,C,OK,NO};

/* ---------- the labs page: a film, then a rail of its labs, one lab at a time ---------- */
const labsApp=document.getElementById("series-labs");
if(labsApp&&LABS.length){labsApp.textContent="";const visited=new Set(get("visited",[]));let film=LABS[0].film;
  const films=h("div",{class:"gp-films",role:"group","aria-label":U.filmsLabel}),rails=h("div"),holder=h("div");
  const ofFilm=n=>LABS.filter(x=>x.film===n);
  function paintFilms(){films.replaceChildren(...FILMS.filter(f=>ofFilm(f.n).length).map(f=>{const ls=ofFilm(f.n),seen=ls.filter(x=>visited.has(x.id)).length;
    return h("button",{type:"button","aria-pressed":String(f.n===film),onclick:()=>show(ofFilm(f.n)[0].id)},h("i",null,String(f.n)),h("span",null,f.title),h("small",null,fill(U.seen,{n:seen,of:ls.length})));}));}
  // one rail of tabs for each film, all on the page; only the open film's shows
  rails.append(...FILMS.filter(f=>ofFilm(f.n).length).map(f=>h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel+" · "+f.title,"data-film":String(f.n)},
    ...ofFilm(f.n).map((Lb,i)=>h("button",{type:"button",role:"tab","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)))));
  const tabs=()=>[...rails.querySelectorAll("[role=tab]")];
  function paintRail(){[...rails.children].forEach(r=>{r.hidden=r.dataset.film!==String(film);});}
  function show(id,focus){const Lb=labOf(id)||LABS[0];visited.add(Lb.id);set("visited",[...visited]);if(Lb.film!==film){film=Lb.film;paintRail();}paintFilms();
    tabs().forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    const ls=ofFilm(film),i=ls.indexOf(Lb),nxt=ls[i+1],f=filmOf(film);
    holder.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+ls.length+" · "+f.title),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,p))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real),repoLinks(Lb)),
        h("div",{class:"stop-nav"},watchHref(Lb)?h("a",{class:"btn",href:watchHref(Lb)},U.watch):h("span",{class:"gp-coming"},fill(U.coming,{n:f.n})),nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/#film-"+film},U.makeCall))),
      BUILD[Lb.kind]?BUILD[Lb.kind](Lb):h("p",null,"")));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus)holder.scrollIntoView({block:"start"});}
  labsApp.append(films,rails,holder);paintRail();
  const fromHash=()=>{const hs=(location.hash||"").slice(1),fm=/^film-(\d+)$/.exec(hs);return fm&&ofFilm(+fm[1]).length?ofFilm(+fm[1])[0].id:hs;};
  show(fromHash());window.addEventListener("hashchange",()=>{const id=fromHash();if(labOf(id))show(id,true);});}

/* ---------- the scenarios page: evaluation, a film at a time or all of them ---------- */
const quizApp=document.getElementById("series-quiz");
if(quizApp&&QS.length){quizApp.textContent="";const ans=get("quiz",{});let sel=0,list=QS,cur=0;
  const films=h("div",{class:"gp-films",role:"group","aria-label":U.filmsLabel}),bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),card=h("div");
  bar.append(dots,score);quizApp.append(films,h("div",{class:"quiz"},bar,card));
  const labName=id=>(labOf(id)||{name:""}).name,labHref=id=>"../labs/#"+id,A=q=>ans[q.n];
  function paintFilms(){const fs=FILMS.filter(f=>QS.some(q=>q.film===f.n));films.replaceChildren(...[0,...fs.map(f=>f.n)].map(n=>{const qs=n?QS.filter(q=>q.film===n):QS,a=qs.filter(A).length,f=filmOf(n);
    return h("button",{type:"button","aria-pressed":String(n===sel),onclick:()=>{pick(n);}},n?h("i",null,String(n)):null,h("span",null,n?f.title:U.allFilms),h("small",null,fill(U.done,{n:a,of:qs.length})));}));}
  function pick(n,keep){sel=n;list=n?QS.filter(q=>q.film===n):QS;quizApp.dataset.film=String(n||0);if(history.replaceState)history.replaceState(null,"","#"+(n?"film-"+n:"all"));
    paintFilms();const first=list.findIndex(q=>!A(q));if(first<0)results();else{cur=first;render();}}
  function paintBar(){dots.replaceChildren(...list.map((q,i)=>h("button",{type:"button",class:A(q)?(A(q).ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1),onclick:()=>{cur=i;render();}},String(i+1))));
    const as=list.filter(A),ok=as.filter(q=>A(q).ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+as.length+" "+U.answered+" · "+(list.length-as.length)+" "+U.toGo));}
  function done(q,ok,pk){ans[q.n]={ok,pick:pk};set("quiz",ans);paintBar();paintFilms();}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why),repoLinks(q));
  function foot(q){const last=cur===list.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:labHref(q.lab)},U.explore+" "+labName(q.lab)),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results();else{cur+=1;render();}}},last?U.results:U.nextQ));}
  function render(){paintBar();const q=list[cur],f=PIX[q.vis],body=h("div",{class:"qbody"}),out=h("div"),prev=A(q),Lq=labOf(q.lab)||{};
    const vis=stage(1000,760,c=>{if(f)f(c,1000,760,q.st||{},Lq,1);},q.alt||q.title);
    body.append(h("p",{class:"qtag",style:"--c:"+(Lq.c||"#0e9692")},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+list.length+(sel?"":" · "+filmOf(q.film).title)),h("h3",null,q.title),h("p",{class:"qsit"},q.sit));
    if(q.type==="choice"){const box=h("div",{class:"qopts"});
      const answer=(i,save)=>{[...box.children].forEach((b,j)=>{b.disabled=true;if(q.opts[j].ok)b.classList.add("ok");});const o=q.opts[i];
        if(!o.ok){box.children[i].classList.add("no");box.children[i].append(h("small",null,o.why));}if(save)done(q,!!o.ok,i);out.replaceChildren(feed(!!o.ok,q),foot(q));};
      q.opts.forEach((o,i)=>box.append(h("button",{type:"button",class:"qopt",onclick:()=>answer(i,true)},h("span",{class:"k"},"ABCD"[i]),h("span",null,o.t))));body.append(box);
      if(prev&&prev.pick!=null&&q.opts[prev.pick])answer(prev.pick,false);}
    if(q.type==="order"){const n=q.items.length;let ord=prev&&Array.isArray(prev.pick)&&prev.pick.length===n?prev.pick.slice():q.items.map((t,i)=>i).sort((a,b)=>((a*7+3)%n)-((b*7+3)%n));const box=h("ol",{class:"qorder"});
      const draw=()=>box.replaceChildren(...ord.map((ix,p)=>h("li",null,h("span",{class:"n"},String(p+1)),h("span",null,q.items[ix]),h("span",{class:"mv"},h("button",{type:"button","aria-label":U.up+": "+q.items[ix],onclick:()=>{if(p>0){[ord[p-1],ord[p]]=[ord[p],ord[p-1]];draw();}}},"↑"),h("button",{type:"button","aria-label":U.down+": "+q.items[ix],onclick:()=>{if(p<ord.length-1){[ord[p+1],ord[p]]=[ord[p],ord[p+1]];draw();}}},"↓")))));draw();
      const chk=h("button",{type:"button",class:"btn primary",onclick:()=>finish(true)},U.check);
      function finish(save){const ok=ord.every((ix,p)=>ix===p);[...box.children].forEach((li,p)=>{li.classList.add(ord[p]===p?"ok":"no");li.querySelectorAll("button").forEach(b=>b.disabled=true);});chk.remove();if(save)done(q,ok,ord.slice());out.replaceChildren(feed(ok,q),foot(q));}
      body.append(box,chk);if(prev)finish(false);}
    body.append(out);card.replaceChildren(h("div",{class:"qcard"},h("div",{class:"qvis gp-qvis"},vis.el),body));ready().then(()=>vis.paint());}
  function results(){paintBar();const ok=list.filter(q=>A(q)&&A(q).ok).length,n=list.length,band=((sel&&filmOf(sel).done)||L.done)[ok>=n?0:ok>=n-2?1:ok>=n/2?2:3];
    const by={};list.forEach(q=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(A(q)&&A(q).ok)by[k].ok++;});
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/n*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",null,band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:labHref(k),class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+(labOf(k)||{c:"#a0b2cd"}).c},h("i"),labName(k)+" · "+by[k].ok+"/"+by[k].n))),
      h("button",{type:"button",class:"btn",onclick:()=>{list.forEach(q=>delete ans[q.n]);set("quiz",ans);paintFilms();cur=0;render();}},U.again)),closing(sel)));}
  const fromHash=()=>{const hs=(location.hash||"").slice(1),fm=/^film-(\d+)$/.exec(hs),todo=QS.find(q=>!A(q));return fm&&QS.some(q=>q.film===+fm[1])?+fm[1]:hs==="all"?0:todo?todo.film:0;};
  pick(fromHash());window.addEventListener("hashchange",()=>{const n=fromHash();if(n!==sel)pick(n);});}
})();
