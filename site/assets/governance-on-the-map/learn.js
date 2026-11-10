/* Learning Data: Governance on the map. The labs (Take it apart) and the scenarios (Make the call) of the whole series, one page
   each, from one engine, as site-tools/build_series.py makes them for a series with labs and scenarios of its own: the page loads a
   film's bundle (for the governance films' watercolour: wash.js, people.js and rooms.js, with Noor's map and its bands), the words
   (learn.en.js or learn.es.js, which set window.MR) and this file, and fills #series-labs or #series-quiz. The words cover the
   series' three films; the page says which films are on the site, or coming (data-films on its root: {number: {t, k, href, starts}
   or {t, coming}}), and only their labs and scenarios show. Its data-store is the progress prefix.
   The engine is the master data series' own (assets/master-and-reference-data/learn.js), copied into this series' folder so each
   series keeps its own, with the five kinds of lab these films need, each described entirely by its words:
     sort      place each item in a bucket, then check: every item says why, and what goes wrong where you put it
     pick      choose one option, and see what it gets right and wrong
     steps     walk through a sequence, one step at a time
     compose   build a sentence from parts, such as a service and its promise
     test      answer the same questions of several things, and see the verdict
   Pictures are drawn with the films' own components (wc_*, and the map's bands, GV_LAYERS): a lab's or a scenario's "vis" names a
   function in PIX below, which takes its words from the lab or the scenario. Without the bundle, the labs still work, on plain paper.
   The series shows no files, code or tool screens, as its films don't: its labs link to no file in the example project.
   Progress stays in this browser, under the page's data-store (or MR.store): the labs visited (visited, ids) and the scenarios
   answered (quiz, keyed by number), as assets/learn/path.js counts them. smoke.py expects every lab's tab on the labs page
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
  cv.style.aspectRatio=vw+"/"+vh;if("ResizeObserver" in window)new ResizeObserver(()=>frame(1)).observe(cv);return{el:cv,paint};}

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
  /* Noor's map, a band for each kind of card or each place, and the cards put on it (A capability, not a project; Where each piece lives) */
  bands(ctx,w,hh,st,Lb,k){const V=Lb.w,B=V.buckets,x0=24,lw=V.lw||270,lh=(hh-36)/B.length;
    B.forEach(([key,label,hex,sub],i)=>{const y=18+i*lh;card(ctx,x0,y+4,w-48,lh-8,{kind:"sheet",seed:5+i});wash(ctx,x0+12,y+16,lw-20,lh-32,hex||"strategy",0.55,9+i);
      tx(ctx,label,x0+28,y+lh/2+(sub?-4:10),{size:fit(ctx,label,lw-48,28,800,null,20),w:800,col:WC_DARK});
      if(sub)tx(ctx,sub,x0+28,y+lh/2+28,{size:fit(ctx,sub,lw-48,22,600,null,17),w:600,col:WC_INK});
      // the band's cards, in up to two rows; the last one put there drops in
      const mine=placed(V,st,key),wd=([it])=>{const s=short(it);return Math.min(tw(ctx,s,fit(ctx,s,300,24,700,null,17),700)+40,340)+(st.checked?44:0)+12;},
        one=mine.reduce((a,m)=>a+wd(m),0)<=w-44-(x0+lw+14),rows=one?[y+lh/2]:[y+lh/2-26,y+lh/2+28];let x=x0+lw+14,row=0,more=0;
      mine.forEach(([it,j])=>{const s=short(it),z=fit(ctx,s,300,24,700,null,17),ww=Math.min(tw(ctx,s,z,700)+40,340)+(st.checked?44:0);if(x+ww>w-44){if(row){more++;return;}row=1;x=x0+lw+14;}
        const drop=j===st.last?1-k:0;withA(ctx,1-drop*0.8,()=>{const tw0=tag(ctx,x,rows[row]-drop*24,s,{size:z,maxW:340});if(st.checked)mark(ctx,x+tw0+20,rows[row]-4,26,it.b===key,k);});x+=ww+12;});
      if(more)tx(ctx,"+"+more,w-40,y+lh/2+10,{size:24,align:"right",col:WC_MUTED});});},
  /* columns, a heading on each, and what's been put under it */
  columns(ctx,w,hh,st,Lb,k){const V=Lb.w,cols=V.buckets,cw=(w-48)/cols.length;
    if(V.title)tx(ctx,V.title,w/2,46,{size:fit(ctx,V.title,w-80,30,800,null,22),w:800,align:"center",col:WC_DARK});const top=V.title?70:18;
    cols.forEach(([key,label,hex,sub],i)=>{const x=24+i*cw,cx=x+cw/2;card(ctx,x+8,top,cw-16,hh-top-18,{kind:"sheet",seed:3+i});
      wash(ctx,x+24,top+16,cw-48,sub?96:62,hex||"business",0.5,11+i);tx(ctx,label,cx,top+58,{size:fit(ctx,label,cw-64,30,800,null,20),w:800,align:"center",col:WC_DARK});
      if(sub)tx(ctx,sub,cx,top+96,{size:fit(ctx,sub,cw-64,22,600,null,17),align:"center",col:WC_INK});
      const mine=placed(V,st,key);let y=top+(sub?150:116);const cap=Math.max(1,Math.floor((hh-y-30)/50));
      mine.slice(0,cap).forEach(([it,j])=>{const drop=j===st.last?1-k:0,s=short(it);withA(ctx,1-drop*0.8,()=>{const tw0=tag(ctx,x+26,y-drop*30,s,{size:fit(ctx,s,cw-108,24,700,null,18),maxW:cw-68});
        if(st.checked)mark(ctx,x+26+tw0+22,y-4,28,it.b===key,k);});y+=50;});
      if(mine.length>cap)tx(ctx,"+"+(mine.length-cap),cx,y,{size:24,align:"center",col:WC_MUTED});});},
  /* A capability, not a project: Govern data, its eight capabilities, each washed in the colour its evidence gives it */
  heat(ctx,w,hh,st,Lb,k){const V=Lb.w,top=V.top||"Govern data",tw0=Math.max(300,tw(ctx,top,30,800)+80);
    card(ctx,w/2-tw0/2,18,tw0,72,{kind:"card",wash:C("gold"),washA:0.5,seed:70});tx(ctx,top,w/2,64,{size:30,w:800,align:"center",col:WC_DARK});
    const n=V.items.length,per=Math.ceil(n/2),gap=14,cw=(w-48-(per-1)*gap)/per,ch=(hh-200)/2;
    V.items.forEach((it,j)=>{const col=j%per,row=Math.floor(j/per),x=24+col*(cw+gap),y=112+row*(ch+gap);if(!row)pencil(ctx,[[w/2,90],[x+cw/2,y]],{a:0.22,lw:1.6,seed:j+2});});
    V.items.forEach((it,j)=>{const col=j%per,row=Math.floor(j/per),x=24+col*(cw+gap),y=112+row*(ch+gap),b=st.pick&&st.pick[j],B=V.buckets.find(q=>q[0]===b),drop=j===st.last?1-k:0;
      card(ctx,x,y,cw,ch,{kind:"card",wash:B?C(B[2]):null,washA:0.5*(1-drop*0.7),dashed:!B,seed:80+j});
      lines(ctx,short(it),x+18,y+40,cw-36-(st.checked?30:0),{size:25,max:4,w:700,col:WC_DARK});
      if(st.checked&&B)mark(ctx,x+cw-26,y+ch-28,28,it.b===b,k);});
    // the key: what each colour says
    const ks=V.buckets.map(([key,label,hex,sub])=>[hex,label+(sub?" · "+sub:"")]),tot=ks.reduce((a,[,s])=>a+tw(ctx,s,22,600)+70,0),sc=Math.min(1,(w-48)/tot);let kx=24;
    ks.forEach(([hex,s],i)=>{const kw=(tw(ctx,s,22,600)+70)*sc;wash(ctx,kx+6,hh-66,40,40,hex,0.7,90+i);tx(ctx,s,kx+58,hh-37,{size:fit(ctx,s,kw-66,22,600,null,16),w:600,col:WC_INK});kx+=kw;});},
  /* A capability, not a project: a service, joined to the capability it serves, with its promise on the card */
  service(ctx,w,hh,st,Lb,k){const V=Lb.w,P=V.pic,pk=st.pick||[],at=i=>pk[i]==null?null:V.slots[i].opts[pk[i]],cx=w/2;
    tx(ctx,P.strategy,24,58,{size:24,w:700,col:WC_MUTED});tx(ctx,P.business,24,232,{size:24,w:700,col:WC_MUTED});
    wash(ctx,18,20,w-36,120,"strategy",0.28,3);wash(ctx,18,190,w-36,hh-208,"business",0.24,4);
    const cap=at(P.cap),capT=cap?(cap.s||cap.t):"…",cw0=Math.min(w-360,Math.max(360,tw(ctx,capT,28,800)+70));
    card(ctx,cx-cw0/2,40,cw0,80,{kind:"card",dashed:!cap,seed:31});tx(ctx,capT,cx,90,{size:fit(ctx,capT,cw0-40,28,800,null,20),w:800,align:"center",col:WC_DARK});
    if(cap)mark(ctx,cx+cw0/2+30,80,26,!!cap.ok,k);
    wc_link(ctx,cx,120,cx,214,WC_PENCIL,{vertical:true,p:cap?1:0.5,a:0.6});
    const sw=Math.min(w-260,760),sx=cx-sw/2,sy=214,sh=hh-sy-30,nm=at(P.name),nmT=nm?(nm.s||nm.t):"…";
    card(ctx,sx,sy,sw,sh,{kind:"card",dashed:!nm,seed:32});tx(ctx,nmT,sx+30,sy+54,{size:fit(ctx,nmT,sw-110,30,800,null,22),w:800,col:WC_DARK});
    if(nm)mark(ctx,sx+sw-36,sy+44,26,!!nm.ok,k);pencil(ctx,[[sx+26,sy+80],[sx+sw-26,sy+80]],{a:0.35,lw:2});
    tx(ctx,P.promise,sx+30,sy+122,{size:22,w:700,col:WC_MUTED});
    let y=sy+166;P.lines.forEach(i=>{const o=at(i),s=o?(o.s||o.t):"…";tx(ctx,s,sx+30,y,{size:fit(ctx,s,sw-110,26,600,null,18),w:600,col:o?WC_INK:WC_MUTED});if(o)mark(ctx,sx+sw-36,y-8,24,!!o.ok,k);y+=48;});},
  /* Who does what, end to end: the six steps of a service, and the one you're on: its role, who fills it, what it reads and writes */
  flow(ctx,w,hh,st,Lb,k){const V=Lb.w,S=V.steps,n=S.length,gap=12,cw=(w-48-gap*(n-1))/n,cur=st.step||0;
    S.forEach((s,i)=>{const x=24+i*(cw+gap),on=i===cur,done=i<cur;card(ctx,x,20,cw,70,{kind:"card",wash:on?C("gold"):done?C("green"):null,washA:on?0.55:0.25,dashed:!on&&!done,seed:40+i});
      tx(ctx,s.s,x+cw/2,66,{size:fit(ctx,s.s,cw-24,28,800,null,18),w:800,align:"center",col:on?WC_DARK:WC_INK});
      if(i<n-1)arrow(ctx,x+cw+1,55,x+cw+gap-1,55,WC_PENCIL,{head:6,lw:2,a:0.6});});
    const P=S[cur].pic,x=24,y=116,ww=w-48,h2=hh-y-20;card(ctx,x,y,ww,h2,{kind:"sheet",seed:49});
    const rh=(h2-30)/P.length;P.forEach(([lab,val],i)=>{const yy=y+30+i*rh+rh/2;tx(ctx,lab,x+30,yy+9,{size:fit(ctx,lab,210,24,700,null,17),w:700,col:WC_MUTED});
      withA(ctx,0.25+0.75*k,()=>lines(ctx,val,x+260,yy+9-(wrap(ctx,val,ww-300,26,600).length>1?15:0),ww-300,{size:26,max:2,w:600,col:WC_DARK}));
      if(i)pencil(ctx,[[x+24,y+30+i*rh],[x+ww-24,y+30+i*rh]],{a:0.18,lw:1.4,seed:i+50});});},
  /* Who does what, end to end: the glossary as a product: its owner and users, the promises you keep, and what you leave out */
  product(ctx,w,hh,st,Lb,k){const V=Lb.w,P=V.pic,lw=w*0.62,x=24,y=18;card(ctx,x,y,lw-12,hh-36,{kind:"card",seed:60});
    wash(ctx,x+16,y+16,lw-44,60,"information",0.45,61);tx(ctx,P.title,x+30,y+58,{size:fit(ctx,P.title,lw-80,30,800,null,22),w:800,col:WC_DARK});
    let yy=y+112;P.lines.forEach(l=>{tx(ctx,l,x+30,yy,{size:fit(ctx,l,lw-80,24,600,null,17),w:600});yy+=40;});
    tx(ctx,P.promise,x+30,yy+12,{size:24,w:700,col:WC_MUTED});yy+=44;
    const keep=placed(V,st,V.keep),cap=Math.max(1,Math.floor((hh-yy-24)/48));
    keep.slice(0,cap).forEach(([it,j])=>{const drop=j===st.last?1-k:0,s=short(it);withA(ctx,1-drop*0.8,()=>{const t0=tag(ctx,x+30,yy+10-drop*24,s,{size:fit(ctx,s,lw-170,24,700,null,17),maxW:lw-120,wash:"information",washA:0.3});
      if(st.checked)mark(ctx,x+30+t0+22,yy+6,26,it.b===V.keep,k);});yy+=48;});
    if(keep.length>cap)tx(ctx,"+"+(keep.length-cap),x+lw-50,yy-20,{size:24,align:"right",col:WC_MUTED});
    const rx=lw+16,rw=w-rx-24;card(ctx,rx,y,rw,hh-36,{kind:"sheet",seed:62});tx(ctx,P.out,rx+rw/2,y+56,{size:fit(ctx,P.out,rw-40,26,800,null,18),w:800,align:"center",col:WC_MUTED});
    let ry=y+110;const out=V.items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick&&st.pick[j]!=null&&st.pick[j]!==V.keep),rc=Math.max(1,Math.floor((hh-ry-24)/48));
    out.slice(0,rc).forEach(([it,j])=>{const s=short(it),t0=tag(ctx,rx+20,ry,s,{size:fit(ctx,s,rw-110,22,700,null,16),maxW:rw-70});
      if(st.checked)mark(ctx,rx+20+t0+18,ry-4,24,it.b!==V.keep,k);ry+=48;});
    if(out.length>rc)tx(ctx,"+"+(out.length-rc),rx+rw/2,ry,{size:22,align:"center",col:WC_MUTED});},
  /* Where each piece lives: each flow, from one place to another; green where you've called it one way, red where it flows back */
  flows(ctx,w,hh,st,Lb,k){const V=Lb.w,n=V.items.length,rh=(hh-36)/n,tw1=(w-200)/2;card(ctx,16,12,w-32,hh-24,{kind:"sheet",seed:70});
    V.items.forEach((it,j)=>{const y=18+j*rh+rh/2,b=st.pick&&st.pick[j],good=b===V.good,drop=j===st.last?1-k:0;
      const a=tag(ctx,40,y,it.f,{size:fit(ctx,it.f,tw1-60,24,700,null,16),maxW:tw1-20}),bx=w-40-tw1+20;
      tag(ctx,bx,y,it.to,{size:fit(ctx,it.to,tw1-60,24,700,null,16),maxW:tw1-20});
      const col=b==null?WC_MUTED:good?OK:NO;arrow(ctx,40+a+16,y,bx-16,y,col,{p:b==null?1:1-drop*0.6,dash:b==null?[3,10]:null,noHead:b==null,a:b==null?0.5:0.9});
      if(st.checked&&b!=null)mark(ctx,w-56,y-4,26,it.b===b,k);});},
  /* Where each piece lives: a piece in its home, and one of its copies, side by side, with what last night's check found */
  drift(ctx,w,hh,st,Lb,k){const V=Lb.w,it=V.items[st.cur],P=it.pic,done=st.done&&st.done[st.cur],cw=(w-140)/2,y=60,ch=hh-150;
    tx(ctx,P.piece,w/2,40,{size:fit(ctx,P.piece,w-80,28,800,null,20),w:800,align:"center",col:WC_DARK});
    [[P.home,V.homeL,24],[P.copy,V.copyL,w-24-cw]].forEach(([c,lab,x],i)=>{card(ctx,x,y+20,cw,ch,{kind:"card",wash:C(i?"application":"gold"),washA:i?0.22:0.32,seed:90+i});
      tx(ctx,lab,x+26,y+66,{size:22,w:700,col:WC_MUTED});lines(ctx,c.place,x+26,y+104,cw-52,{size:26,max:2,w:800,col:WC_DARK});
      pencil(ctx,[[x+22,y+170],[x+cw-22,y+170]],{a:0.3,lw:2,seed:i+3});lines(ctx,c.val,x+26,y+214,cw-52,{size:28,max:3,w:600,col:WC_INK});
      if(c.note)tx(ctx,c.note,x+26,y+ch-6,{size:fit(ctx,c.note,cw-52,22,600,null,16),w:600,col:WC_MUTED});});
    arrow(ctx,24+cw+14,y+20+ch/2,w-24-cw-14,y+20+ch/2,WC_PENCIL,{a:0.7,head:12});
    if(done){const drifted=it.verdict==="drifted",s=drifted?V.foundL:V.stepL;if(drifted)wc_ring(ctx,w-24-cw/2,y+214,cw/2-10,46,k,{col:NO});
      tag(ctx,w/2,hh-32,s,{size:fit(ctx,s,w-120,26,700,null,18),align:"center",wash:drifted?"red":"green",washA:0.35,maxW:w-60});}},
  /* Where each piece lives: one person, and for each thing, whether it's theirs to change or only to read */
  whose(ctx,w,hh,st,Lb,k){const V=Lb.w,it=V.items[st.cur],ans=(st.ans&&st.ans[st.cur])||[],done=st.done&&st.done[st.cur],lw=330;
    card(ctx,24,24,lw,hh-48,{kind:"card",wash:C(it.side==="tech"?"tech":"steward"),washA:0.3,seed:100});
    lines(ctx,it.t,48,90,lw-48,{size:32,max:2,w:800,col:WC_DARK});lines(ctx,it.role,48,190,lw-48,{size:24,max:4,w:600,col:WC_INK});
    const x0=lw+50,rh=(hh-40)/V.qs.length;V.qshort.forEach((q,i)=>{const y=20+i*rh+rh/2,a=ans[i],lab=a==null?"…":a?V.yes:V.no;
      tx(ctx,q,x0,y-6,{size:fit(ctx,q,w-x0-250,24,700,null,17),w:700,col:WC_DARK});
      tag(ctx,w-40,y-14,lab,{size:22,align:"right",wash:a==null?null:a?"green":"muted",washA:0.35,maxW:220});
      if(done)mark(ctx,w-60-Math.min(220,tw(ctx,lab,22,700)+40)-10,y-18,24,it.a[i]==null||a===it.a[i],k);
      pencil(ctx,[[x0,y+22],[w-40,y+22]],{a:0.2,lw:1.4,seed:i+7});});},
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
  opts.forEach(([k,t,c])=>s.append(h("button",{type:"button","aria-pressed":String(k===cur),"data-k":k,style:c?"--b:"+c:null,
    onclick:()=>{s.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===String(k))));on(k);}},t)));return s;}
function picture(Lb,state){const f=PIX[Lb.vis];if(!f)return null;const vw=Lb.vw||1200,vh=Lb.vh||620;return stage(vw,vh,(c,k)=>f(c,vw,vh,state(),Lb,k),Lb.alt||Lb.name);}
const shell=(Lb,pic,...parts)=>h("div",{class:"mr-lab",style:"--c:"+Lb.c},...(pic?[pic.el]:[]),...parts);
const info=t=>t?h("p",{class:"mr-info"},t):null;
const btn=(t,on,cls)=>h("button",{type:"button",class:"mr-btn"+(cls?" "+cls:""),onclick:on},t);

/* ---------- sort: every item in its bucket ---------- */
function labSort(Lb){const V=Lb.w,say=h("p",{class:"mr-say",role:"status"}),pick={};let checked=false,last=-1;
  const pic=picture(Lb,()=>({pick,checked,last})),rows=h("div",{class:"mr-rows"});
  const go=btn(U.check,()=>{checked=true;last=-1;draw();upd(true);},"go"),again=btn(U.again,()=>{for(const k in pick)delete pick[k];checked=false;last=-1;draw();upd();});
  const bname=k=>(V.buckets.find(b=>b[0]===k)||[,""])[1];
  function draw(){rows.replaceChildren(...V.items.map((it,i)=>{const ok=checked&&pick[i]===it.b,no=checked&&pick[i]!==it.b;
    return h("div",{class:"mr-row"+(ok?" ok":no?" no":"")},h("p",{class:"mr-item"},it.t),
      seg(V.buckets.map(b=>[b[0],b[1],b[2]]),pick[i],k=>{pick[i]=k;last=i;if(checked){checked=false;draw();}upd(true);},it.t),
      checked?h("p",{class:"mr-why"},h("b",null,ok?U.right:fill(U.belongs,{b:bname(it.b)}))," ",no&&it.no&&it.no[pick[i]]?it.no[pick[i]]+" ":"",it.why):null);}));}
  function upd(anim){const n=Object.keys(pick).length,right=V.items.filter((it,i)=>pick[i]===it.b).length;go.disabled=n<V.items.length;
    say.textContent=checked?fill(right===V.items.length?V.sayAll:V.saySome,{n:right,of:V.items.length}):(n<V.items.length?fill(U.placed,{n,of:V.items.length}):U.ready);if(pic)pic.paint(anim);}
  draw();ready().then(()=>upd());return shell(Lb,pic,info(V.prompt),rows,h("div",{class:"mr-controls"},go,again),say);}

/* ---------- pick: one option, and what it gets right ---------- */
function labPick(Lb){const V=Lb.w;let cur=V.opts[0][0];const say=h("p",{class:"mr-say",role:"status"}),list=h("ul",{class:"mr-checks"}),stats=h("div",{class:"mr-stats"});
  const pic=picture(Lb,()=>({pick:cur}));
  function upd(anim){const r=V.res[cur];list.replaceChildren(...V.checks.map((t,i)=>h("li",{class:r[i]===1?"ok":r[i]===0.5?"warn":"no"},t)));
    stats.replaceChildren(...(V.stats&&V.stats[cur]?V.stats[cur].map(([n,t])=>h("p",null,h("b",null,n),h("span",null,t))):[]));say.textContent=V.say[cur];if(pic)pic.paint(anim);}
  ready().then(()=>upd());return shell(Lb,pic,info(V.prompt),h("div",{class:"mr-controls"},h("span",{class:"mr-lbl"},V.label),seg(V.opts,cur,k=>{cur=k;upd(true);},V.label)),stats,list,say);}

/* ---------- steps: a sequence, one step at a time ---------- */
function labSteps(Lb){const V=Lb.w;let cur=0;const say=h("p",{class:"mr-say",role:"status"}),ol=h("ol",{class:"mr-steps"});
  const pic=picture(Lb,()=>({step:cur}));
  const prev=btn("← "+U.back,()=>{if(cur>0){cur--;upd(true);}}),next=btn(U.nextStep+" →",()=>{if(cur<V.steps.length-1){cur++;upd(true);}},"go");
  function upd(anim){ol.replaceChildren(...V.steps.map((s,i)=>h("li",{class:i<cur?"done":i===cur?"on":"",...(i===cur?{"aria-current":"step"}:{})},h("b",null,s.t),i===cur?h("span",null,s.d):null)));
    prev.disabled=cur===0;next.disabled=cur===V.steps.length-1;say.textContent=cur===V.steps.length-1?V.sayEnd:fill(U.stepOf,{n:cur+1,of:V.steps.length});if(pic)pic.paint(anim);}
  ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),ol,h("div",{class:"mr-controls"},prev,next),say);}

/* ---------- compose: a sentence from parts ---------- */
function labCompose(Lb){const V=Lb.w,pick=V.slots.map(()=>null),say=h("p",{class:"mr-say",role:"status"}),out=h("p",{class:"mr-sentence"}),notes=h("ul",{class:"mr-checks"});
  const pic=picture(Lb,()=>({pick}));
  const slots=V.slots.map((sl,i)=>h("div",{class:"mr-controls mr-slot"},h("span",{class:"mr-lbl"},sl.label),seg(sl.opts.map((o,j)=>[String(j),o.t]),null,k=>{pick[i]=+k;upd(true);},sl.label)));
  function upd(anim){out.replaceChildren(h("b",null,V.head+" "),...V.slots.map((sl,i)=>pick[i]==null?h("span",{class:"gap"},"… "):h("span",{class:sl.opts[pick[i]].ok?"ok":"no"},sl.opts[pick[i]].t+" ")));
    notes.replaceChildren(...V.slots.map((sl,i)=>pick[i]==null?null:h("li",{class:sl.opts[pick[i]].ok?"ok":"no"},sl.opts[pick[i]].why)).filter(Boolean));
    const done=pick.every(p=>p!=null),good=done&&pick.every((p,i)=>V.slots[i].opts[p].ok);say.textContent=!done?V.sayStart:good?V.sayGood:V.sayFix;if(pic)pic.paint(anim);}
  ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),...slots,out,notes,say);}

/* ---------- test: the same questions, asked of several things ---------- */
function labTest(Lb){const V=Lb.w;let cur=0;const ans=V.items.map(()=>V.qs.map(()=>null)),done=V.items.map(()=>false);
  const say=h("p",{class:"mr-say",role:"status"}),things=h("div",{class:"mr-controls"}),qs=h("div",{class:"mr-rows"}),verdict=h("p",{class:"mr-verdict"});
  const pic=picture(Lb,()=>({cur,ans,done}));
  const go=btn(U.check,()=>{done[cur]=true;draw();upd(true);},"go");
  function drawThings(){things.replaceChildren(h("span",{class:"mr-lbl"},V.label),seg(V.items.map((it,i)=>[String(i),(done[i]?"✓ ":"")+it.t]),String(cur),k=>{cur=+k;draw();upd(true);},V.label));}
  function draw(){const it=V.items[cur];drawThings();qs.replaceChildren(...V.qs.map((q,i)=>{const a=ans[cur][i],ok=done[cur]&&(it.a[i]==null||a===it.a[i]),no=done[cur]&&!ok;
      return h("div",{class:"mr-row"+(ok?" ok":no?" no":"")},h("p",{class:"mr-item"},(i+1)+". "+q),
        seg([["1",V.yes],["0",V.no]],a==null?null:String(a),k=>{ans[cur][i]=+k;if(done[cur]){done[cur]=false;draw();}upd(true);},q),
        done[cur]?h("p",{class:"mr-why"},h("b",null,ok?U.right:U.wrong)," ",it.why[i]):null);}));
    verdict.replaceChildren(...(done[cur]?[h("b",null,V.verdicts[it.verdict]+". "),it.say]:[]));}
  function upd(anim){const n=ans[cur].filter(a=>a!=null).length;go.disabled=n<V.qs.length;const nd=done.filter(Boolean).length;
    say.textContent=done[cur]?fill(V.sayDone,{n:nd,of:V.items.length}):n<V.qs.length?fill(V.sayAsk,{n,of:V.qs.length}):U.ready;if(pic)pic.paint(anim);}
  draw();ready().then(()=>upd());return shell(Lb,pic,info(V.prompt),things,qs,h("div",{class:"mr-controls"},go),verdict,say);}


const BUILD={sort:labSort,pick:labPick,steps:labSteps,compose:labCompose,test:labTest};
L.BUILD=BUILD;L.PIX=PIX;L.lib={h,seg,stage,picture,shell,info,btn,fill,num,dec,tx,fit,wrap,lines,tag,card,tick,cross,mark,pencil,wash,head,arrow,noteCard,C,CI,OK,NO};

/* ---------- the labs page: a film, then a rail of its labs, one lab at a time ---------- */
const labsApp=document.getElementById("series-labs");
if(labsApp&&LABS.length){labsApp.textContent="";const visited=new Set(get("visited",[]));let film=LABS[0].film;
  const films=h("div",{class:"mr-films",role:"group","aria-label":U.filmsLabel}),rails=h("div"),holder=h("div");
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
        h("div",{class:"stop-nav"},watchHref(Lb)?h("a",{class:"btn",href:watchHref(Lb)},U.watch):h("span",{class:"mr-coming"},fill(U.coming,{n:f.n})),nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/#film-"+film},U.makeCall))),
      BUILD[Lb.kind]?BUILD[Lb.kind](Lb):h("p",null,"")));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus)holder.scrollIntoView({block:"start"});}
  labsApp.append(films,rails,holder);paintRail();
  const fromHash=()=>{const hs=(location.hash||"").slice(1),fm=/^film-(\d+)$/.exec(hs);return fm&&ofFilm(+fm[1]).length?ofFilm(+fm[1])[0].id:hs;};
  show(fromHash());window.addEventListener("hashchange",()=>{const id=fromHash();if(labOf(id))show(id,true);});}

/* ---------- the scenarios page: evaluation, a film at a time or all of them ---------- */
const quizApp=document.getElementById("series-quiz");
if(quizApp&&QS.length){quizApp.textContent="";const ans=get("quiz",{});let sel=0,list=QS,cur=0;
  const films=h("div",{class:"mr-films",role:"group","aria-label":U.filmsLabel}),bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),card=h("div");
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
    body.append(out);card.replaceChildren(h("div",{class:"qcard"},h("div",{class:"qvis mr-qvis"},vis.el),body));ready().then(()=>vis.paint());}
  function results(){paintBar();const ok=list.filter(q=>A(q)&&A(q).ok).length,n=list.length,band=((sel&&filmOf(sel).done)||L.done)[ok>=n?0:ok>=n-2?1:ok>=n/2?2:3];
    const by={};list.forEach(q=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(A(q)&&A(q).ok)by[k].ok++;});
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/n*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",null,band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:labHref(k),class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+(labOf(k)||{c:"#a0b2cd"}).c},h("i"),labName(k)+" · "+by[k].ok+"/"+by[k].n))),
      h("button",{type:"button",class:"btn",onclick:()=>{list.forEach(q=>delete ans[q.n]);set("quiz",ans);paintFilms();cur=0;render();}},U.again)),closing(sel)));}
  const fromHash=()=>{const hs=(location.hash||"").slice(1),fm=/^film-(\d+)$/.exec(hs),todo=QS.find(q=>!A(q));return fm&&QS.some(q=>q.film===+fm[1])?+fm[1]:hs==="all"?0:todo?todo.film:0;};
  pick(fromHash());window.addEventListener("hashchange",()=>{const n=fromHash();if(n!==sel)pick(n);});}
})();
