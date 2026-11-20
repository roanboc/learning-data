/* Learning Data: The same one, everywhere. The labs (Take it apart) and the scenarios (Make the call) of the whole series, one page
   each, from one engine, as site-tools/build_series.py makes them for a series with labs and scenarios of its own: the page loads a
   film's bundle (for the series' watercolour: shared/src/wash.js and people.js), the words (learn.en.js or learn.es.js, which set
   window.MR) and this file, and fills #series-labs or #series-quiz. The words cover every film of the series; the page says which
   films are on the site, or coming (data-films on its root: {number: {t, k, href, starts} or {t, coming}}), and only their labs and
   scenarios show. Its data-store is the progress prefix.
   Every lab is a playground (kind "play"), one for each film, as the author set on 18 November 2026: a picture changed by buttons and
   switches, with three to five experiments (w.goals) the visitor ticks by making them happen. Each playground's own rules are in PLAY
   below, its words in the pack. The sorting, picking and stepping labs of before became scenarios of the series' evaluation.
   Pictures are drawn with the films' own components (wc_*): a lab's or a scenario's "vis" names a function in PIX below, which takes
   its words from the lab or the scenario. Without the bundle, the labs still work, on plain paper.
   Progress stays in this browser, under the page's data-store (or MR.store): the labs visited (visited, ids) and the scenarios
   answered (quiz, keyed by number), as assets/learn/path.js counts them, and each playground's ticked experiments (goals).
   smoke.py expects every lab's tab on the labs page
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
// a colour by name: a role (student, tutor…), an industry (health, bank…), a side (person, steward), or a hex
function C(k){if(Array.isArray(k))return k;if(!k)return WC_PENCIL;if(k[0]==="#")return hexRGB(k)||WC_PENCIL;
  return WC_ROLE[k]||WC_IND[k]||({person:WC_SIDE.none,steward:WC_SIDE.biz,tech:WC_SIDE.tech,ink:WC_INK,muted:WC_MUTED,no:WC_NO,ok:WC_ROLEINK.alumna,amber:WC_ROLE.applicant,badge:WC_BADGE})[k]||WC_PENCIL;}
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
// Linh, as the master record: white paper in a pencil line, banded in her roles' colours
function linh(ctx,x,y,s,roles,o){o=o||{};wc_white(ctx,"linh",x,y,s,(roles||[]).map(r=>typeof r==="string"?{col:C(r)}:{col:C(r.r),dashed:r.dashed,a:r.a}),{a:o.a});}
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
const PIX={
  /* One person, many roles: the four shelves, each with what's been put on it */
  kinds(ctx,w,hh,st,Lb,k){const V=Lb.w,cols=V.buckets,cw=(w-60)/cols.length;
    cols.forEach(([key,label,hex,sub],i)=>{const x=30+i*cw,cx=x+cw/2;card(ctx,x+8,22,cw-16,hh-44,{kind:"sheet",seed:3+i});
      wash(ctx,x+24,38,cw-48,58,hex||"person",0.45,11+i);tx(ctx,label,cx,78,{size:fit(ctx,label,cw-60,30,800,null,20),w:800,align:"center",col:WC_DARK});
      if(sub)tx(ctx,sub,cx,124,{size:fit(ctx,sub,cw-50,24,600,null,17),align:"center",col:WC_MUTED});
      // the shelf's emblem: the person, a few chips, a stream of dabs, a glossary card
      const ey=150;if(key==="master")linh(ctx,cx,ey+118,0.2,["student","tutor","researcher","alumna"]);
      else if(key==="reference"){["student","applicant","tutor"].forEach((c,j)=>wash(ctx,cx-92+j*64,ey+38,52,30,c,0.8,20+j));pencil(ctx,[[cx-104,ey+84],[cx+104,ey+84]],{a:0.5});}
      else if(key==="txn"){for(let j=0;j<10;j++)wash(ctx,cx-108+j*23,ey+46+Math.sin(j*0.8)*16,15,15,["student","researcher","tutor"][j%3],0.75,30+j);}
      else{card(ctx,cx-82,ey+14,164,90,{kind:"card",seed:41});tx(ctx,V.glossary||"learner",cx,ey+68,{size:26,w:500,f:"mono",align:"center"});}
      pencil(ctx,[[x+30,ey+130],[x+cw-30,ey+130]],{a:0.35,lw:2,seed:7+i});
      // what's been put on the shelf; the last one put there drops in
      const mine=V.items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick[j]===key);let y=ey+170;
      // as many as the shelf holds, each label shrunk to fit before it's cut; a count says how many more
      const cap=Math.max(1,Math.floor((hh-ey-190)/48));
      mine.slice(0,cap).forEach(([it,j])=>{const drop=j===st.last?1-k:0,s=short(it);withA(ctx,1-drop*0.8,()=>{const tw0=tag(ctx,x+26,y-drop*30,s,{size:fit(ctx,s,cw-136,24,700,null,17),maxW:cw-96});
        if(st.checked)mark(ctx,x+26+tw0+22,y-4,28,it.b===key,k);});y+=48;});
      if(mine.length>cap)tx(ctx,"+"+(mine.length-cap),cx,y,{size:24,align:"center",col:WC_MUTED});});},
  /* One person, many roles: Linh, and four lanes: the person, her roles, her contact points, her identifiers */
  lanes(ctx,w,hh,st,Lb,k){const V=Lb.w,lanes=V.buckets,x0=290,lh=(hh-40)/lanes.length;
    const roles=V.items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick[j]==="role"&&it.role).map(([it])=>it.role);
    linh(ctx,148,hh/2+190,0.52,roles);
    lanes.forEach(([key,label,hex],i)=>{const y=20+i*lh;card(ctx,x0,y+6,w-x0-24,lh-12,{kind:"sheet",seed:5+i});wash(ctx,x0+18,y+22,200,40,hex||"person",0.4,9+i);
      tx(ctx,label,x0+30,y+52,{size:fit(ctx,label,180,28,800,null,17),w:800,col:WC_DARK});
      // the lane's things, in up to two rows; the last one put there drops in
      const mine=V.items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick[j]===key);let x=x0+236,row=0;const rows=[y+lh/2-26,y+lh/2+28];
      mine.forEach(([it,j])=>{const s=short(it),z=fit(ctx,s,260,24,700,null,17),ww=Math.min(tw(ctx,s,z,700)+40,300)+(st.checked?44:0);if(x+ww>w-44){if(row)return;row=1;x=x0+236;}
        const drop=j===st.last?1-k:0;withA(ctx,1-drop*0.8,()=>{const tw0=tag(ctx,x,rows[row]-drop*24,s,{size:z,maxW:300,wash:it.role||null});if(st.checked)mark(ctx,x+tw0+20,rows[row]-4,26,it.b===key,k);});x+=ww+12;});});},
  /* One person, many roles: who keeps what, as Noor and Mei's sheet */
  keeps(ctx,w,hh,st,Lb,k){const V=Lb.w,rows=V.items,top=96,rh=(hh-top-26)/rows.length;card(ctx,24,20,w-48,hh-40,{kind:"sheet",seed:8});
    tx(ctx,V.sheet,48,70,{size:fit(ctx,V.sheet,w*0.5-72,32,800,null,22),w:800,col:WC_DARK});tx(ctx,V.keeper,w*0.5,70,{size:26,w:700,col:WC_MUTED});
    rows.forEach((it,j)=>{const y=top+j*rh+rh/2,b=st.pick[j],B=V.buckets.find(x=>x[0]===b);
      pencil(ctx,[[44,top+j*rh],[w-44,top+j*rh]],{a:0.25,lw:1.6,seed:j+3});tx(ctx,short(it),48,y+10,{size:fit(ctx,short(it),w*0.44,28,700,null,17),w:700});
      if(B){tag(ctx,w*0.5,y,B[1],{size:fit(ctx,B[1],w*0.5-150,26,700,null,16),wash:B[3]||B[2],maxW:w*0.5-110});if(st.checked)mark(ctx,w-70,y,32,it.b===b,k);}
      else tx(ctx,"…",w*0.5,y+10,{size:28,col:WC_MUTED});});},
  /* One person, many roles: a thing, and the four questions */
  test(ctx,w,hh,st,Lb,k){const V=Lb.w,it=V.items[st.cur],ans=st.ans[st.cur]||[],done=st.done[st.cur],cw=Math.min(380,w*0.32),cx=40+cw/2;
    // a thing in its industry's colour; mastered, it clears to white paper and takes the series' mark
    const white=done&&it.verdict==="master";card(ctx,40,50,cw,hh-100,{kind:"card",wash:white?null:it.ind,washA:0.55,seed:12});
    tx(ctx,V.kindOf[it.ind]||"",cx,112,{size:26,w:700,col:WC_MUTED,align:"center"});
    lines(ctx,it.t,cx,186,cw-56,{size:fit(ctx,it.t,(cw-56)*2,40,800,null,30),w:800,align:"center",col:WC_DARK,max:3,lh:48});
    if(white)wc_mark(ctx,cx,hh*0.62,cw*0.62,k*1.4,1);
    if(done){const v=V.verdicts[it.verdict];withA(ctx,k,()=>tag(ctx,cx,hh-120,v,{size:fit(ctx,v,cw-80,30,800),w:800,align:"center",wash:it.verdict==="master"?"ok":it.verdict==="txn"?"researcher":"amber",maxW:cw-30}));}
    const x=40+cw+40,qh=(hh-60)/V.qs.length,tx0=x+72,tmax=w-x-310;V.qs.forEach((q,i)=>{const y=30+i*qh,cy=y+qh/2;card(ctx,x,y+8,w-x-40,qh-16,{kind:"card",seed:20+i});
      tx(ctx,(i+1)+"",x+30,cy+12,{size:36,w:800,col:WC_MUTED});const ls=wrap(ctx,q,tmax,27,700);ls.slice(0,2).forEach((l,j)=>tx(ctx,l,tx0,cy+10+(j-(ls.length>1?0.5:0))*34,{size:27,w:700}));
      const a=ans[i];if(a!=null)tag(ctx,w-200,cy,a?V.yes:V.no,{size:26,align:"center",wash:a?"ok":"no",washA:0.3});
      if(done&&a!=null&&it.a[i]!=null)mark(ctx,w-110,cy-2,30,a===it.a[i],k);else if(done&&it.a[i]==null)tx(ctx,"–",w-110,cy+10,{size:30,col:WC_MUTED,align:"center"});});},
  /* ---------- scenario vignettes: drawn from each scenario's words (st) ---------- */
  // records, as each system holds them: cards in their role's colour; a pencil ring on one, and a person above if st.person
  records(ctx,w,hh,st){const cs=st.cards||[],n=cs.length,cw=Math.min(440,(w-60)/Math.min(n,2)-20),ch=st.tall?150:118,per=Math.min(n,2),
      // with no person above them, the cards and their line sit together in the middle
      cardsH=Math.ceil(n/per)*(ch+22)-22,top=st.person?hh*0.42:Math.max(60,(hh-cardsH-(st.say?84:0))/2);
    if(st.person)linh(ctx,w/2,top-14,0.26,st.person===true?[]:st.person);
    cs.forEach((c,i)=>{const col=i%per,row=Math.floor(i/per),x=w/2-(per*(cw+20)-20)/2+col*(cw+20),y=top+row*(ch+22);
      // the film's card writes a note in mono 28 and never shrinks it: a longer one is written here, at a size that fits
      const nt=c.note?(c.fresh?"✓ ":"")+c.note:null,fits=!nt||tw(ctx,nt,28,500,"mono")<=cw-56;
      // and its number shrinks when a long title, or the wash that runs 20 past it, would run into it
      const room=c.id?cw-56-tw(ctx,c.title,30,800)-32:0,idz=c.id?fit(ctx,c.id,room,28,500,"mono",18):28;
      wc_roleCard(ctx,x,y,cw,ch,c.role,c.title,idz<28?null:c.id,fits?c.note:null,{dashed:c.dashed,fresh:c.fresh,seed:30+i});
      if(idz<28)tx(ctx,c.id,x+cw-24,y+48,{size:idz,w:500,f:"mono",align:"right"});
      if(!fits)tx(ctx,nt,x+32,y+96,{size:fit(ctx,nt,cw-56,28,500,"mono",16),w:500,f:"mono",col:c.fresh?WC_ROLEINK.student:WC_MUTED});
      if(c.ring)wc_ring(ctx,x+cw/2,y+ch/2,cw/2+16,ch/2+14,1,{col:NO});
      if(c.mark!=null)mark(ctx,x+cw-26,y+ch-30,30,c.mark,1);});
    if(st.say)tag(ctx,w/2,st.person?hh-40:top+cardsH+62,st.say,{size:28,align:"center",maxW:w-40});},
  // a few tags in a row or a column, optionally washed, with a heading
  tags(ctx,w,hh,st){if(st.title)head(ctx,w/2,64,st.title,st.sub,{align:"center",size:34});const ts=st.tags||[],y0=st.title?(st.sub?190:150):80,gap=(hh-y0-30)/Math.max(1,ts.length);
    ts.forEach((t,i)=>{const o=typeof t==="string"?{t}:t,y=y0+i*gap+gap/2;tag(ctx,w/2,y,o.t,{size:fit(ctx,o.t,w-140,30,700),align:"center",wash:o.c,maxW:w-60});if(o.mark!=null)mark(ctx,w-60,y-4,34,o.mark,1);});},
  // a small table: a name and its columns, for "which table is a person?"
  tables(ctx,w,hh,st){const ts=st.tables||[],n=ts.length,cw=(w-40)/n;ts.forEach((t,i)=>{const x=20+i*cw;card(ctx,x+8,30,cw-16,hh-60,{kind:"sheet",wash:t.c,washA:0.18,seed:50+i});
      tx(ctx,t.name,x+cw/2,86,{size:fit(ctx,t.name,cw-50,30,700,"mono"),f:"mono",w:500,align:"center",col:WC_DARK});pencil(ctx,[[x+30,108],[x+cw-30,108]],{a:0.4,lw:2});
      t.cols.forEach((c,j)=>tx(ctx,c,x+cw/2,156+j*44,{size:fit(ctx,c,cw-50,26,500,"mono"),f:"mono",w:500,align:"center",col:WC_MUTED}));
      if(t.tag)tag(ctx,x+cw/2,hh-70,t.tag,{size:24,align:"center",maxW:cw-30});});},
  // the person, banded, with a few tags around her
  person(ctx,w,hh,st){linh(ctx,w*0.27,hh-50,0.62,st.bands||[]);const ts=st.tags||[],gap=Math.min(110,(hh-80)/Math.max(1,ts.length)),y0=hh/2-gap*(ts.length-1)/2;
    ts.forEach((t,i)=>{const o=typeof t==="string"?{t}:t;tag(ctx,w*0.5,y0+i*gap,o.t,{size:fit(ctx,o.t,w*0.47-40,32,700),wash:o.c,maxW:w*0.47});});},
  /* ---------- films 2 to 9 ---------- */
  /* Who is it?: Linh's five records, and what the chosen way of making one Linh does with them */
  golden(ctx,w,hh,st,Lb,k){const V=Lb.w,R=V.recs,W0=V.words,pk=st.pick,x0=30,cw=420,ch=100,gap=(hh-40-R.length*ch)/(R.length-1),ys=R.map((c,i)=>20+i*(ch+gap)),ex=x0+cw+10;
    R.forEach((c,i)=>{const gone=pk==="merge"&&i===1;rec(ctx,x0,ys[i],cw,ch,c,{dashed:gone,seed:60+i});if(gone)cross(ctx,x0+cw-34,ys[i]+ch-30,30,k);});
    if(pk==="merge"){const my=(ys[0]+ys[1])/2,mx=600;[0,1].forEach(i=>wc_link(ctx,ex,ys[i]+ch/2,mx-6,my+ch/2,C("student"),{p:k,lw:3,a:0.8}));
      rec(ctx,mx,my,430,ch,{role:"student",title:R[0].title,id:R[0].id,note:W0.merged},{seed:70});
      [2,3,4].forEach(i=>{const t=W0.apart,tw1=tag(ctx,mx,ys[i]+ch/2,t,{size:26});cross(ctx,mx+tw1+30,ys[i]+ch/2-2,28,k);});}
    else if(pk==="copy"){[1,2,3,4].forEach(i=>{withA(ctx,k,()=>wash(ctx,x0+16,ys[i]+14,cw-32,ch-28,"student",0.22,80+i));wc_link(ctx,ex,ys[0]+ch/2,ex+40,ys[i]+ch/2,C("ink"),{p:k,a:0.5});});
      const tx0=600;tag(ctx,tx0,ys[0]+ch/2,R[0].id+": "+W0.copied,{size:26,maxW:w-tx0-20});
      [[W0.source,ys[2]+ch/2],[W0.before,ys[3]+ch/2]].forEach(([t,y])=>{const tw1=tag(ctx,tx0,y,t,{size:28});cross(ctx,tx0+tw1+34,y-2,30,k);});}
    else{const fx=700,fy=hh-26;linh(ctx,fx,fy,0.44,["student","tutor","researcher","alumna"]);
      R.forEach((c,i)=>wc_link(ctx,ex,ys[i]+ch/2,fx-60,fy-200+(i-2)*26,C(c.role),{p:k,a:0.75,lw:3}));
      const mx=880,mw=w-mx-20,M=V.master;card(ctx,mx,30,mw,hh-60,{kind:"sheet",seed:90});tx(ctx,M.id,mx+mw/2,94,{size:38,w:600,f:"mono",align:"center",col:WC_DARK});
      pencil(ctx,[[mx+24,122],[mx+mw-24,122]],{a:0.4,lw:2});
      M.fields.forEach(([f,s,c],i)=>{const y=184+i*126;tx(ctx,f,mx+24,y,{size:fit(ctx,f,mw-48,26,800,null,18),w:800,col:WC_DARK});tag(ctx,mx+24,y+46,s,{size:fit(ctx,s,mw-80,22,700,null,16),wash:c,maxW:mw-40});});}},
  /* Who is it?: two records, field by field, the weight each comparison adds, and the score on a line from 0 to 100 */
  match(ctx,w,hh,st,Lb,k){const V=Lb.w,p=st.p,cw=(w-120)/2,cx=w/2;rec(ctx,40,18,cw,100,p.a,{seed:61});rec(ctx,w-40-cw,18,cw,100,p.b,{seed:62});
    const y0=140,rh=Math.min(70,(hh-320)/st.rows.length);
    st.rows.forEach((r,i)=>{const mid=y0+i*rh+rh/2,c=r.w>0?OK:r.w<0?NO:WC_MUTED,bw=Math.min(120,Math.abs(r.w)*20);
      tx(ctx,r.av,cx-140,mid+8,{size:fit(ctx,r.av,cx-190,24,500,"mono",15),f:"mono",w:500,align:"right"});
      tx(ctx,r.bv,cx+140,mid+8,{size:fit(ctx,r.bv,cx-190,24,500,"mono",15),f:"mono",w:500});
      tx(ctx,r.f,cx,mid-14,{size:fit(ctx,r.f,250,22,700,null,15),w:700,col:WC_MUTED,align:"center"});
      if(r.w)wash(ctx,r.w>0?cx:cx-bw*k,mid-2,Math.max(8,bw*k),30,c,0.45,70+i);
      tx(ctx,dec(r.w),cx,mid+21,{size:24,w:800,col:c,align:"center"});
      pencil(ctx,[[60,mid+rh/2],[w-60,mid+rh/2]],{a:0.14,lw:1.4,seed:i+5});});
    const gy=hh-74,gx0=80,gx1=w-80,X=s=>gx0+(gx1-gx0)*s/100;
    [[0,V.lo,"apart",WC_SIDE.none],[V.lo,V.hi,"review",WC_ROLE.applicant],[V.hi,100,"link",OK]].forEach(([a,b,key,c],i)=>{wash(ctx,X(a),gy-16,X(b)-X(a),32,c,0.5,80+i);
      const t=V.bands[key];tx(ctx,t,(X(a)+X(b))/2,gy+46,{size:fit(ctx,t,X(b)-X(a)-10,22,700,null,14),w:700,align:"center",col:WC_MUTED});});
    const sx=X(st.score);pencil(ctx,[[sx,gy-30],[sx,gy+22]],{lw:4,a:0.95,col:WC_DARK});tx(ctx,String(st.score),sx,gy-40,{size:42,w:800,align:"center",col:WC_DARK});
    if(st.call){const t=(V.calls.find(c=>c[0]===st.call)||[,""])[1],right=sx>w*0.6;withA(ctx,k,()=>{const tw1=tag(ctx,right?sx-50:sx+50,gy-56,t,{size:24,align:right?"right":"left",wash:st.ok?"ok":"no",washA:0.3});
      mark(ctx,right?sx-70-tw1:sx+70+tw1,gy-58,28,st.ok,k);});}},
  /* Who is it?: an intake's pairs on a line from 0 to 100; the two lines split them into three bands */
  bands(ctx,w,hh,st,Lb,k){const V=Lb.w,gx0=160,gx1=w-40,X=s=>gx0+(gx1-gx0)*s/100,top=64,bot=hh-110,rows=[top+(bot-top)*0.27,top+(bot-top)*0.74];
    [[0,st.lo,"apart",WC_SIDE.none],[st.lo,st.hi,"review",WC_ROLE.applicant],[st.hi,100,"link",OK]].forEach(([a,b,key,c],i)=>{if(b<=a)return;wash(ctx,X(a),top,X(b)-X(a),bot-top,c,0.22,90+i);
      const t=V.zones[key];if(X(b)-X(a)>70)tx(ctx,t,(X(a)+X(b))/2,top-18,{size:fit(ctx,t,X(b)-X(a)-8,24,700,null,14),w:700,align:"center",col:WC_MUTED});});
    V.rowsL.forEach((t,i)=>tx(ctx,t,24,rows[i]+8,{size:fit(ctx,t,gx0-40,24,700,null,15),w:700,col:WC_DARK}));
    V.pts.forEach(([s,same],i)=>{const x=X(s),y=rows[same?0:1]+(((i*37)%5)-2)*20;
      if(same){ctx.fillStyle=rgba(WC_ROLE.student,0.85);ctx.beginPath();ctx.arc(x,y,10,0,TAU);ctx.fill();}else{ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.stroke();}
      if(!same&&s>=st.hi)cross(ctx,x,y,32,k);if(same&&s<st.lo)wc_ring(ctx,x,y,18,18,k,{col:WC_ROLE.applicant,lw:3.4});});
    // the two lines' tags, each as wide as its words: the second drops to a row of its own only when they would touch
    const L2=[[st.lo,V.loL],[st.hi,V.hiL]].map(([s,t])=>{const x=X(s),q=t+" "+s,wd=tw(ctx,q,22,700)+40,al=x>w-160?"right":x<gx0+100?"left":"center",l=al==="left"?x:al==="right"?x-wd:x-wd/2;return {x,q,al,l,r:l+wd};}),
      near=L2[1].l<L2[0].r+14;
    L2.forEach((o,i)=>{pencil(ctx,[[o.x,top-6],[o.x,bot+8]],{lw:3.4,a:0.95,col:WC_DARK,seed:3+i});tag(ctx,o.x,bot+34+(i&&near?50:0),o.q,{size:22,align:o.al});});},
  /* Which value wins: Linh's master record, field by field: the value each rule chooses, with its source */
  golden2(ctx,w,hh,st,Lb,k){const V=Lb.w,F=V.fields;linh(ctx,150,hh-26,0.44,["student","tutor","researcher","alumna"]);
    const x0=310,cw=w-x0-20;card(ctx,x0,20,cw,hh-40,{kind:"sheet",seed:95});tx(ctx,V.title,x0+30,72,{size:30,w:800,col:WC_DARK});
    const top=96,rh=(hh-top-34)/F.length,vx=x0+232,vmax=cw-232-70;
    F.forEach((f,i)=>{const y=top+i*rh,mid=y+rh/2,p=st.pick[i];pencil(ctx,[[x0+20,y],[x0+cw-20,y]],{a:0.22,lw:1.6,seed:i+11});
      const fl=tw(ctx,f.f,26,800)>190?wrapN(ctx,f.f,190,24,800,null,2):[f.f],fz=fl.length>1?Math.min(...fl.map(l=>fit(ctx,l,190,24,800,null,17))):fit(ctx,f.f,190,26,800,null,17);
      fl.forEach((l,j)=>tx(ctx,l,x0+30,mid+9+(fl.length>1?(j-0.5)*28:0),{size:fz,w:800,col:WC_DARK}));
      if(p==null){tx(ctx,"…",vx,mid+9,{size:28,col:WC_MUTED});return;}
      const r=f.rules[p],win=r.win==null?[]:[].concat(r.win);
      if(!win.length)tx(ctx,"—",vx,mid+9,{size:30,col:WC_MUTED});
      else if(win.length>1){let x=vx;win.forEach(j=>{const v=f.vals[j],S=V.src[v.src]||{};const t=v.note||v.v,mw=(vmax-24)/win.length;x+=tag(ctx,x,mid,t,{size:fit(ctx,t,mw-40,21,700,null,15),wash:S.c,maxW:mw})+8;});}
      else{const v=f.vals[win[0]],S=V.src[v.src]||{},z=fit(ctx,v.v,vmax-250,26,700,null,17),vw=tw(ctx,v.v,z,700)+16;tx(ctx,v.v,vx,mid+9,{size:z,w:700});const mw=Math.max(120,vmax-vw);tag(ctx,vx+vw,mid,S.t,{size:fit(ctx,S.t,mw-40,21,700,null,15),wash:S.c,maxW:mw});}
      mark(ctx,x0+cw-40,mid-2,30,r.ok,k);});},
  /* Which value wins: the rule in words, part by part, above the same rule as the model's YAML declares it */
  rule(ctx,w,hh,st,Lb,k){const V=Lb.w,n=V.slots.length,hd=[].concat(V.field),ind=V.indent!=null?V.indent:"  ",th=104+n*62,lx=410;
    card(ctx,20,20,w-40,th,{kind:"sheet",seed:96});tx(ctx,V.title,50,68,{size:30,w:800,col:WC_DARK});
    V.slots.forEach((sl,i)=>{const y=126+i*62,p=st.pick[i];
      // a label too long for its column takes two lines rather than shrinking
      const ls=tw(ctx,sl.label,22,700)>lx-70?wrapN(ctx,sl.label,lx-70,20,700,null,2):[sl.label],lz=ls.length>1?Math.min(...ls.map(l=>fit(ctx,l,lx-70,20,700,null,16))):fit(ctx,sl.label,lx-70,22,700,null,17);
      ls.forEach((l,j)=>tx(ctx,l,50,y+(ls.length>1?j*24-4:8),{size:lz,w:700,col:WC_MUTED}));
      if(p==null){tx(ctx,"…",lx,y+8,{size:28,col:WC_MUTED});return;}
      const o=sl.opts[p],z=fit(ctx,o.t,w-lx-130,24,700,null,18),tw1=tag(ctx,lx,y,o.t,{size:z,wash:o.ok?"ok":"no",washA:0.3,maxW:w-lx-90});mark(ctx,lx+tw1+26,y-2,26,o.ok,k);});
    const cy=th+40,L=hd.concat(V.slots.map((sl,i)=>ind+(st.pick[i]==null?"…":sl.opts[st.pick[i]].code))),lh=Math.min(40,(hh-cy-130)/Math.max(1,L.length-1));
    card(ctx,20,cy,w-40,hh-cy-20,{kind:"card",seed:97});tx(ctx,V.model,50,cy+42,{size:fit(ctx,V.model,w-120,24,500,"mono",17),f:"mono",w:500,col:WC_MUTED});
    L.forEach((l,i)=>{const j=i-hd.length,bad=j>=0&&st.pick[j]!=null&&!V.slots[j].opts[st.pick[j]].ok;
      tx(ctx,l,50,cy+86+i*lh,{size:fit(ctx,l,w-120,24,500,"mono",15),f:"mono",w:500,col:bad?NO:WC_DARK});});},
  /* Which value wins: Linh's two names, each with the documents and screens given to it */
  names(ctx,w,hh,st,Lb,k){const V=Lb.w,B=V.buckets,pw=(w-60)/2;
    B.forEach(([key,label,hex,big],i)=>{const x=20+i*(pw+20);card(ctx,x,20,pw,hh-40,{kind:"sheet",seed:100+i});wash(ctx,x+20,36,pw-40,52,hex,0.4,110+i);
      tx(ctx,label,x+pw/2,72,{size:28,w:800,align:"center",col:WC_DARK});const bs=fit(ctx,big,pw-60,54,800,null,30);tx(ctx,big,x+pw/2,162,{size:bs,w:800,align:"center",col:WC_DARK});
      if(key==="legal"&&V.parts){const words=big.split(" "),sp=tw(ctx," ",bs,800);let wx=x+pw/2-tw(ctx,big,bs,800)/2;
        // each part's name under its word, pushed apart where the words are short, with a pencil stroke from the word to its name
        const cs=words.map(wd=>{const ww=tw(ctx,wd,bs,800),c0=wx+ww/2;wx+=ww+sp;return c0;}),lw=words.map((wd,j)=>tw(ctx,V.parts[j]||"",22,600)),at=cs.slice();
        for(let j=1;j<at.length;j++)at[j]=Math.max(at[j],at[j-1]+(lw[j-1]+lw[j])/2+18);
        const over=at.length?at[at.length-1]+lw[lw.length-1]/2-(x+pw-24):0;if(over>0)for(let j=0;j<at.length;j++)at[j]-=over;
        at.forEach((ax,j)=>{pencil(ctx,[[cs[j],176],[ax,190]],{a:0.4,lw:1.6,seed:30+j});tx(ctx,V.parts[j]||"",ax,212,{size:22,w:600,col:WC_MUTED,align:"center"});});}
      pencil(ctx,[[x+30,232],[x+pw-30,232]],{a:0.3,lw:2,seed:7+i});
      V.items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick[j]===key).forEach(([it,j],n)=>{const tx0=x+30+(n%2)*(pw/2-10),ty=278+Math.floor(n/2)*58,drop=j===st.last?1-k:0;
        withA(ctx,1-drop*0.8,()=>{const tw1=tag(ctx,tx0,ty-drop*24,short(it),{size:fit(ctx,short(it),pw/2-108,22,700,null,17),maxW:pw/2-64});if(st.checked)mark(ctx,tx0+tw1+18,ty-4,24,it.b===key,k);});});});},
  /* Roles come and go: her dated roles across the years, a line at the date, and her figure wearing the roles open that day */
  timeline(ctx,w,hh,st,Lb,k){const V=Lb.w,[y0]=V.from.split("-").map(Number),[y1]=V.to.split("-").map(Number),N=(y1-y0)*12,x0=300,x1=w-30,top=46,lh=(hh-top-70)/V.roles.length;
    const X=s=>{const [y,m,d]=s.split("-").map(Number);return x0+(x1-x0)*(((y-y0)*12+(m-1)+((d||1)-1)/31)/N);};
    const end=s=>{if(s==null)return x1;const [y,m]=s.split("-").map(Number);return X(m===12?(y+1)+"-01":y+"-"+String(m+1).padStart(2,"0"));};
    linh(ctx,150,hh-26,0.44,st.open);
    for(let y=y0;y<=y1;y++){const x=X(y+"-01");pencil(ctx,[[x,top-4],[x,hh-66]],{a:0.12,lw:1.2,seed:y});if(y<y1)tx(ctx,String(y),(x+X((y+1)+"-01"))/2,top-16,{size:20,col:WC_MUTED,align:"center"});}
    const d=ymd(st.at);
    V.roles.forEach((r,i)=>{const y=top+i*lh,on=st.open.includes(r.k);tx(ctx,r.t,x0+6,y+28,{size:22,w:800,col:CI(r.k)});
      r.spans.forEach((sp,j)=>{const a=X(sp[0]+(sp[0].length<8?"-01":"")),b=end(sp[1]);wash(ctx,a,y+38,Math.max(5,b-a-2),lh-52,r.c,inSpan(sp,d)?0.85:0.32,120+i*9+j);});
      if(on)tick(ctx,x0-24,y+lh/2+4,26,k);});
    const ax=X(st.at);pencil(ctx,[[ax,top-6],[ax,hh-62]],{lw:3.6,a:0.95,col:WC_DARK,seed:2});tag(ctx,ax,hh-34,fdate(st.at),{size:22,align:ax>w-110?"right":ax<x0+90?"left":"center"});},
  /* Roles come and go: Linh on census date, and what each way of counting adds up for her */
  count(ctx,w,hh,st,Lb,k){const V=Lb.w,T=V.tally,pk=st.pick,S=V.stats[pk],x0=380;linh(ctx,170,hh-26,0.44,["student","tutor","researcher","alumna"]);
    tx(ctx,S[0][0],x0,98,{size:64,w:800,col:WC_DARK});tx(ctx,S[0][1],x0,142,{size:fit(ctx,S[0][1],w-x0-40,26,600,null,17),w:600,col:WC_MUTED});
    const y0=196;
    if(pk==="rows")T.rows.forEach((c,i)=>{rec(ctx,x0,y0+i*118,430,100,c,{seed:130+i});withA(ctx,k,()=>tag(ctx,x0+460,y0+i*118+50,"+1",{size:30,wash:"no",washA:0.3}));});
    else if(pk==="roles")T.roles.forEach(([r,t],i)=>{wc_chip(ctx,x0,y0+i*82,360,62,r,t);withA(ctx,k,()=>tag(ctx,x0+390,y0+i*82+31,"+1",{size:30,wash:"no",washA:0.3}));});
    else{wc_ring(ctx,170,hh-26-150,120,172,k,{col:OK});withA(ctx,k,()=>tag(ctx,x0,y0+50,"+1 · "+T.person,{size:30,wash:"ok",washA:0.35}));}
    tx(ctx,S[1][0]+" "+S[1][1],x0,hh-40,{size:28,w:800,col:pk==="people"?OK:NO});},
  /* Lists everyone uses: each system's codes, the list, and a line from each code to the value it's mapped to */
  map(ctx,w,hh,st,Lb,k){const V=Lb.w,l=V.lists[st.cur],n=l.codes.length,rh=(hh-40)/n,lw=410,lx=w-lw-24,lrh=Math.min(92,(hh-200)/l.rows.length);
    card(ctx,lx,20,lw,hh-40,{kind:"sheet",seed:140});tx(ctx,l.name,lx+lw/2,66,{size:28,w:800,align:"center",col:WC_DARK});
    const cwid=Math.max(...l.rows.map(r=>tw(ctx,r[0],24,500,"mono")+40)),ry={};
    l.rows.forEach(([c,t],i)=>{const y=96+i*lrh+lrh/2;ry[c]=y;tag(ctx,lx+22,y,c,{size:24,f:"mono",w:500,wash:"amber",washA:0.3});
      tx(ctx,t,lx+22+cwid+14,y+8,{size:fit(ctx,t,lw-cwid-60,24,600,null,15),w:600});});
    const ny=hh-74;ry[""]=ny;card(ctx,lx+16,ny-34,lw-32,68,{kind:"card",dashed:true,seed:141});tx(ctx,V.notList,lx+lw/2,ny+8,{size:24,w:700,align:"center",col:WC_MUTED});
    l.codes.forEach((c,i)=>{const y=20+i*rh+rh/2,p=st.pick[i];tx(ctx,c.sys,40,y-16,{size:20,w:600,col:WC_MUTED});const tw1=tag(ctx,40,y+14,c.v,{size:24,f:"mono",w:500,wash:c.c,washA:0.3,maxW:lx-200});
      if(p!=null){const good=p===c.ok;wc_link(ctx,40+tw1+6,y+14,lx+(p===""?16:20),ry[p],st.ran?(good?OK:NO):WC_PENCIL,{p:k,a:st.ran?0.9:0.5,lw:3});if(st.ran)mark(ctx,40+Math.max(tw1,tw(ctx,c.sys,20,600)+8)+30,y-16,24,good,1);}});},
  /* Lists everyone uses: the tutor's row on the role type list, and what each way of renaming it does */
  change(ctx,w,hh,st,Lb,k){const T=Lb.w.table,pk=st.pick;
    if(pk==="each"){const n=T.systems.length,rh=(hh-60)/n;T.systems.forEach(([s,t,c],i)=>{const y=30+i*rh+rh/2;tx(ctx,s,60,y+9,{size:26,w:700,col:WC_MUTED});tag(ctx,400,y,t,{size:26,wash:c,washA:0.3,maxW:560});cross(ctx,w-80,y-2,30,k);});return;}
    const x0=40,W2=w-80,C4=[30,170,520,750],top=30,th=pk==="dated"?250:190;card(ctx,x0,top,W2,th,{kind:"sheet",seed:150});
    T.h.forEach((t,i)=>tx(ctx,t,x0+C4[i],top+46,{size:22,w:700,col:WC_MUTED}));pencil(ctx,[[x0+20,top+64],[x0+W2-20,top+64]],{a:0.3,lw:1.6,seed:4});
    const row=(y,v)=>v.forEach((t,i)=>tx(ctx,t,x0+C4[i],y,{size:i===1?26:24,w:i===1?700:500,f:i===1?null:"mono",col:WC_DARK}));
    if(pk==="overwrite"){const y=top+140,ow=tw(ctx,T.old,24,600);tx(ctx,T.old,x0+C4[1],y-40,{size:24,w:600,col:WC_MUTED});pencil(ctx,[[x0+C4[1]-4,y-48],[x0+C4[1]+(ow+8)*k,y-48]],{col:NO,lw:2.8,a:0.95});row(y,[T.code,T.neu,"—","—"]);}
    else{row(top+116,[T.code,T.old,T.since,T.until]);withA(ctx,k,()=>{wash(ctx,x0+C4[1]-12,top+152,330,46,"ok",0.25,151);row(top+186,[T.code,T.neu,T.from,"—"]);});}
    const by=top+th+56,rw=tag(ctx,x0,by,T.report+": "+(pk==="overwrite"?T.neu:T.old),{size:26});mark(ctx,x0+rw+30,by-2,30,pk!=="overwrite",k);
    if(pk==="dated"){const aw=tag(ctx,x0,by+72,T.approved,{size:26,wash:"ok",washA:0.3});tick(ctx,x0+aw+30,by+70,30,k);}},
  /* For this purpose only: Linh, two of her records, the appeal's email, and her wish where it's been put */
  wish(ctx,w,hh,st,Lb,k){const P=Lb.w.pic,pk=st.pick,held=pk==="person";linh(ctx,170,hh-26,0.44,["student","tutor","researcher","alumna"]);
    const rx=400,rw=400,ys=[40,236];P.recs.forEach((c,i)=>rec(ctx,rx,ys[i],rw,100,c,{seed:160+i}));
    const ax=w-150,ay=210;wc_envelope(ctx,ax,ay,1.2,0);tx(ctx,P.appeal,ax,ay+76,{size:24,w:700,align:"center",col:WC_DARK});
    const tip=wc_link(ctx,ax-80,ay,rx+rw+8,ys[1]+50,C("donor"),{p:held?k*0.55:k,a:0.8,lw:3});if(held&&tip)cross(ctx,tip[0],tip[1],34,k);
    if(pk==="sheet"){card(ctx,rx-10,hh-176,rw+150,140,{kind:"sheet",seed:165});tx(ctx,P.sheet,rx+12,hh-132,{size:22,w:700,col:WC_MUTED});}
    const wp=pk==="old"?[rx,ys[0]+128]:pk==="sheet"?[rx+12,hh-84]:[24,66],ww=tag(ctx,wp[0],wp[1],P.wish,{size:24,wash:"donor",washA:0.35,maxW:held?360:rw+120});
    if(held)wc_link(ctx,24+ww/2,wp[1]+26,160,hh-320,C("donor"),{p:k,vertical:true,a:0.6});
    tag(ctx,ax,ay+136,held?P.held:P.sent,{size:26,align:"center",wash:held?"ok":"no",washA:0.3});},
  /* For this purpose only: her request, and the records a search finds or misses */
  request(ctx,w,hh,st,Lb,k){const P=Lb.w.pic,pk=st.pick;card(ctx,w/2-310,16,620,84,{kind:"card",seed:170});tx(ctx,P.ask,w/2,68,{size:28,w:800,align:"center",col:WC_DARK});
    const cols=4,gx=24,cw=(w-2*gx-3*16)/4,ch=128,gy=140,all=P.recs.map(c=>[c,true]).concat(pk==="name"?P.others.map(c=>[c,false]):[]);
    all.forEach(([c,mine],i)=>{const x=gx+(i%cols)*(cw+16),y=gy+Math.floor(i/cols)*(ch+96),found=mine?(pk==="person"?1:pk==="name"?c.name:c.num):1;
      rec(ctx,x,y,cw,ch,mine?c:{title:c.title,id:c.id,note:c.note},{dashed:!found,stack:true,seed:175+i});
      if(mine&&found)tick(ctx,x+cw-30,y+ch+34,30,k);else if(mine)tag(ctx,x,y+ch+34,P.missed,{size:20,wash:"no",washA:0.25});
      else{tag(ctx,x,y+ch+34,P.notHer,{size:20,wash:"no",washA:0.25});cross(ctx,x+cw-30,y+ch+32,30,k);}});
    if(pk==="person"){const fx=gx+3*(cw+16)+cw/2,fy=gy+ch+96+ch+70;linh(ctx,fx,fy,0.2,["student","tutor","researcher","alumna"]);
      all.forEach(([c],i)=>{const x=gx+(i%cols)*(cw+16)+cw/2,y=gy+Math.floor(i/cols)*(ch+96)+ch;wc_link(ctx,fx,fy-110,x,y+6,C(c.role),{p:k,a:0.45,vertical:true});});}},
  /* One person, many systems: the four ways to keep master data, side by side; the chosen one stands out.
     pic.back: the systems that read the person back (the others are only linked to it); all of them when it is missing */
  styles(ctx,w,hh,st,Lb,k){const V=Lb.w,P=V.pic,ks=V.opts.map(o=>o[0]),pw=(w-40)/ks.length;
    ks.forEach((key,i)=>{const x=20+i*pw,on=key===st.pick,cx=x+pw/2,fy=hh*0.53,sy=[hh*0.72,hh*0.86],pos=P.systems.map((s,j)=>[x+pw*(j%2?0.73:0.27),sy[Math.floor(j/2)]]);
      withA(ctx,on?1:0.4,()=>{card(ctx,x+5,16,pw-10,hh-32,{kind:"sheet",wash:on?Lb.c:null,washA:0.12,seed:180+i});
        const t=P.titles[key];tx(ctx,t,cx,64,{size:fit(ctx,t,pw-40,26,800,null,17),w:800,align:"center",col:WC_DARK});
        if(key!=="registry")linh(ctx,cx,fy,0.17,["student","tutor","researcher","alumna"]);else tag(ctx,cx,fy-50,P.links,{size:20,align:"center"});
        const dot=(p,c)=>{if(!p)return;ctx.fillStyle=rgba(c,0.9);ctx.beginPath();ctx.arc(p[0],p[1],6,0,TAU);ctx.fill();};
        pos.forEach(([px,py],j)=>{const c=C(P.systems[j][0]),q=on?k:1;
          if(key==="registry"){const [qx,qy]=pos[(j+1)%pos.length];wc_link(ctx,px,py-16,qx,qy-16,WC_PENCIL,{p:q,a:0.55});}
          else if(key==="consolidation")dot(wc_link(ctx,px,py-22,cx,fy-60,c,{p:q,a:0.75,vertical:true}),c);
          else if(key==="coexistence"){if(!P.back||P.back.includes(P.systems[j][0])){dot(wc_link(ctx,px-6,py-22,cx-6,fy-60,c,{p:q,a:0.75,vertical:true}),c);dot(wc_link(ctx,cx+6,fy-60,px+6,py-22,c,{p:q,a:0.75,vertical:true}),c);}else wc_link(ctx,px,py-22,cx,fy-60,WC_PENCIL,{p:q,a:0.55,vertical:true});}
          else dot(wc_link(ctx,cx,fy-60,px,py-22,c,{p:q,a:0.8,vertical:true}),c);});
        pos.forEach(([px,py],j)=>tag(ctx,px,py,P.systems[j][1],{size:fit(ctx,P.systems[j][1],pw/2-46,20,700,null,15),align:"center",wash:P.systems[j][0],washA:0.45,maxW:pw/2-6}));});});},
  /* One person, many systems: an application, what it gives the search, the people found with their scores, and what it does */
  search(ctx,w,hh,st,Lb,k){const V=Lb.w,a=st.app,ax=24,aw=430;card(ctx,ax,20,aw,hh-40,{kind:"card",role:"applicant",sw:tw(ctx,a.t,26,800)+36,seed:190});
    tx(ctx,a.t,ax+30,64,{size:fit(ctx,a.t,aw-60,26,800,null,17),w:800,col:WC_DARK});
    a.given.forEach((g,i)=>{const on=st.on[i];withA(ctx,on?1:0.38,()=>tag(ctx,ax+24,134+i*76,g.t,{size:fit(ctx,g.t,aw-88,21,700,null,15),wash:on?"applicant":null,washA:0.35,maxW:aw-48}));});
    const cx=500,cw=w-cx-24,ch=130;
    st.sc.forEach(({c,s,b},i)=>{const y=34+i*(ch+28),col=b==="link"?OK:b==="review"?CI("applicant"):WC_MUTED;card(ctx,cx,y,cw,ch,{kind:"card",seed:195+i});
      tx(ctx,c.title+" · "+c.id,cx+26,y+46,{size:fit(ctx,c.title+" · "+c.id,cw-190,26,800,null,17),w:800,col:WC_DARK});tx(ctx,c.note,cx+26,y+84,{size:fit(ctx,c.note,Math.min(cw-190,cw-tw(ctx,V.bands[b],19,700)-110),22,600,null,15),w:600,col:WC_MUTED});
      tx(ctx,String(s),cx+cw-30,y+62,{size:44,w:800,align:"right",col});tag(ctx,cx+cw-26,y+104,V.bands[b],{size:19,align:"right",wash:b==="link"?"ok":b==="review"?"amber":null,washA:0.3});
      wc_link(ctx,ax+aw+4,150,cx-6,y+ch/2,b==="link"?OK:WC_PENCIL,{p:k,a:b==="apart"?0.22:0.7,lw:3});});
    const [o,best]=st.out,good=o===a.want,ot=fill(V.outcomes[o],{who:best?best.c.title+" ("+best.c.id+")":""}),ow=tag(ctx,cx,hh-56,ot,{size:24,wash:good?"ok":"no",washA:0.3,maxW:cw-60});mark(ctx,cx+ow+30,hh-58,30,good,k);},
  /* A hub at work: the hub's screen; the part of it each step is about stands out */
  hub(ctx,w,hh,st,Lb,k){const P=Lb.w.pic,s=st.step,A=i=>s===i?1:s>i?0.72:0.28,B=(i,x,y,ww,h2)=>card(ctx,x,y,ww,h2,{kind:"card",wash:s===i?"steward":null,washA:0.16,seed:200+i});
    withA(ctx,A(0),()=>{B(0,24,24,300,hh-48);tx(ctx,P.inbox+" · "+P.items.length,48,74,{size:26,w:800,col:WC_DARK});P.items.forEach((t,i)=>tag(ctx,46,118+i*58,t,{size:20,wash:i===0?"steward":null,washA:0.45,maxW:256}));});
    const px=344,pw=430;
    withA(ctx,A(1),()=>{B(1,px,24,pw,232);tx(ctx,"74",px+28,90,{size:52,w:800,col:CI("applicant")});
      P.weights.forEach(([f,v],i)=>{const y=86+i*52,bx=px+250,bw=Math.abs(v)*18*(s===1?k:1);tx(ctx,f,px+120,y,{size:20,w:700,col:WC_MUTED});
        wash(ctx,v<0?bx-bw:bx,y-20,Math.max(6,bw),24,v>0?OK:NO,0.6,205+i);tx(ctx,dec(v),px+pw-20,y,{size:20,w:800,align:"right",col:v>0?OK:NO});});});
    withA(ctx,A(2),()=>{B(2,px,272,pw,150);tag(ctx,px+24,322,P.flip,{size:22,wash:"ok",washA:0.3,maxW:pw-48});P.hears.forEach((t,i)=>tag(ctx,px+24+i*170,382,t,{size:20,maxW:160}));});
    withA(ctx,A(4),()=>{B(4,px,438,pw,hh-462);const cy=438+(hh-462)/2,done=s>=5;
      if(done)tick(ctx,px+60,cy,40,1);else{wc_ring(ctx,px+60,cy,30,30,s===4?k:1,{col:WC_SIDE.biz,lw:5});}
      tx(ctx,done?P.committed:P.tray,px+110,cy+9,{size:fit(ctx,P.tray,pw-140,24,700,null,16),w:700,col:WC_DARK});});
    const nx=px+pw+20,nw=w-nx-24;
    withA(ctx,A(3),()=>{B(3,nx,24,nw,300);P.note.forEach((l,i)=>tx(ctx,l,nx+24,72+i*42,{size:fit(ctx,l,nw-48,21,600,i===2?"mono":null,14),w:i===2?500:600,f:i===2?"mono":null,col:WC_INK}));
      wc_badge(ctx,nx+24,270,P.suggests);});
    withA(ctx,A(5),()=>{B(5,nx,340,nw,hh-364);P.hears.forEach((t,i)=>{const y=394+i*62,tw1=tag(ctx,nx+24,y,t,{size:22,maxW:nw-100});if(s>=5)tick(ctx,nx+24+tw1+26,y-2,26,s===5?k:1);});
      tag(ctx,nx+24,hh-74,P.source,{size:20,wash:"student",washA:0.3,maxW:nw-48});});},
  /* A hub at work: three hubs, each with the five things a hub must do */
  choose(ctx,w,hh,st,Lb,k){const V=Lb.w,ks=V.opts.map(o=>o[0]),pw=(w-60)/ks.length;
    ks.forEach((key,i)=>{const x=20+i*(pw+10),on=key===st.pick,r=V.res[key],rh=(hh-190)/V.short.length;withA(ctx,on?1:0.45,()=>{card(ctx,x,20,pw,hh-40,{kind:"sheet",wash:on?Lb.c:null,washA:0.14,seed:210+i});
      tx(ctx,V.opts[i][1],x+pw/2,76,{size:32,w:800,align:"center",col:WC_DARK});pencil(ctx,[[x+30,100],[x+pw-30,100]],{a:0.3,lw:2,seed:i+2});
      V.short.forEach((t,j)=>{const y=150+j*rh;tx(ctx,t,x+40,y+9,{size:26,w:700});mark(ctx,x+pw-60,y,30,r[j]===1,on?k:1);});});});},
  /* Kept, not cleaned: open duplicates over two years, one line for each way; the chosen one stands out */
  chart(ctx,w,hh,st,Lb,k){const G=Lb.w.chart,x0=120,x1=w-270,y0=50,y1=hh-80,X=t=>x0+(x1-x0)*t/(G.x.length-1),Y=v=>y1-(y1-y0)*v/G.max;
    [0,1000,2000,3000,4000].forEach(v=>{pencil(ctx,[[x0,Y(v)],[x1,Y(v)]],{a:0.12,lw:1.2,seed:v+1});tx(ctx,num(v),x0-14,Y(v)+7,{size:20,col:WC_MUTED,align:"right"});});
    G.x.forEach((t,i)=>tx(ctx,t,X(i),hh-42,{size:20,col:WC_MUTED,align:"center"}));tx(ctx,G.y,x0,28,{size:20,w:700,col:WC_MUTED});
    const order=Object.keys(G.lines).sort((a,b)=>(a===st.pick)-(b===st.pick));
    order.forEach((key,i)=>{const on=key===st.pick,pts=G.lines[key].map(([t,v])=>[X(t),Y(v)]),col=key==="entry"?OK:key==="cleanup"?WC_ROLE.applicant:NO,last=pts[pts.length-1];
      wc_pencil(ctx,pts,on?k:1,{col:on?col:WC_PENCIL,lw:on?5:2.4,a:on?0.95:0.3,seed:220+i});
      tx(ctx,G.names[key],last[0]+14,last[1]+8,{size:on?22:20,w:on?800:600,col:on?col:WC_MUTED,a:on?1:0.7});});},
  /* Kept, not cleaned: one value from an outside list to the university's own, by pull request */
  agentpr(ctx,w,hh,st,Lb,k){const P=Lb.w.pic,s=st.step,A=i=>s===i?1:s>i?0.72:0.28;
    withA(ctx,A(0),()=>{card(ctx,24,40,300,230,{kind:"card",wash:"public",washA:0.18,seed:230});tx(ctx,P.outside,46,88,{size:24,w:800,col:WC_DARK});tx(ctx,P.gov,46,120,{size:20,col:WC_MUTED});
      tag(ctx,46,182,P.value,{size:fit(ctx,P.value,216,20,700,null,16),wash:"amber",washA:0.4,maxW:256});wc_badge(ctx,46,232,P.isNew);});
    const px=360,pw=480;
    withA(ctx,Math.max(A(1),A(3)),()=>{card(ctx,px,40,pw,hh-80,{kind:"sheet",seed:231});tx(ctx,P.pr,px+28,90,{size:fit(ctx,P.pr,pw-56,26,800,null,17),w:800,col:WC_DARK});
      tx(ctx,P.drafted,px+28,124,{size:20,col:WC_MUTED});P.lines.forEach((l,i)=>tx(ctx,l,px+28,176+i*40,{size:fit(ctx,l,pw-56,22,500,"mono",14),f:"mono",w:500}));});
    if(s>=1)wc_link(ctx,326,150,px-4,150,WC_PENCIL,{p:s===1?k:1,a:0.6});
    withA(ctx,A(2),()=>P.tests.forEach((t,i)=>{const y=362+i*48;tx(ctx,t,px+76,y+8,{size:22,w:700});if(s>=2)tick(ctx,px+46,y,26,s===2?k:1);}));
    const rx=px+pw+24,rw2=w-rx-24;
    withA(ctx,A(3),()=>{card(ctx,rx,110,rw2,116,{kind:"card",wash:s>=3?"ok":null,washA:0.22,seed:233});lines(ctx,P.approved,rx+22,152,rw2-80,{size:22,w:700,max:2});if(s>=3)tick(ctx,rx+rw2-34,150,28,s===3?k:1);});
    withA(ctx,A(4),()=>{card(ctx,rx,256,rw2,116,{kind:"card",wash:s>=4?"amber":null,washA:0.22,seed:234});lines(ctx,P.from,rx+22,298,rw2-44,{size:22,w:700,max:2});});},
  /* One person, many roles: an actor stays the same; its roles start and end, each with its own dates */
  actor(ctx,w,hh,st,Lb){const lw=w*0.34,rx=24+lw+24,rw=w-rx-24,fx=24+lw/2,fy=hh/2+20;
    card(ctx,24,20,lw,hh-40,{kind:"sheet",seed:21});
    tx(ctx,"An actor",24+lw/2,80,{size:fit(ctx,"An actor",lw-40,44,800,null,26),w:800,align:"center",col:WC_DARK});
    tx(ctx,"stays the same",24+lw/2,124,{size:fit(ctx,"stays the same",lw-50,28,600,null,20),align:"center",col:WC_MUTED});
    ctx.fillStyle="#3f7fd6";ctx.beginPath();ctx.arc(fx,fy-96,44,0,Math.PI*2);ctx.fill();
    wash(ctx,fx-74,fy-40,148,170,"#3f7fd6",0.45,22);
    card(ctx,rx,20,rw,hh-40,{kind:"sheet",seed:22});
    tx(ctx,"Roles",rx+rw/2,80,{size:fit(ctx,"Roles",rw-40,44,800,null,26),w:800,align:"center",col:WC_DARK});
    tx(ctx,"each with a start and an end",rx+rw/2,124,{size:fit(ctx,"each with a start and an end",rw-50,28,600,null,20),align:"center",col:WC_MUTED});
    const bx=rx+250,bw=rw-290,rows=[["Student","#0e9692",0,1],["Tutor","#8e6be0",0.1,0.2],["Tutor","#8e6be0",0.4,0.5],["Alumna","#26a060",0.6,1]];
    rows.forEach(([name,col,a,b],i)=>{const y=206+i*84;
      ctx.strokeStyle="#7a8190";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(fx+46,fy-96);ctx.lineTo(rx+24,y+8);ctx.stroke();
      tx(ctx,name,rx+24,y+10,{size:fit(ctx,name,200,26,700,null,20),w:700,col:WC_DARK});
      wash(ctx,bx+bw*a,y-6,bw*(b-a),34,col,0.6,30+i);});
    tx(ctx,"2022 to 2026",bx,hh-60,{size:fit(ctx,"2022 to 2026",bw,22,600,null,18),w:600,col:WC_MUTED});
    tx(ctx,"today",bx+bw,hh-60,{size:fit(ctx,"today",bw,22,600,null,18),w:600,align:"right",col:WC_MUTED});
  },
};

/* ---------- the lab's parts ---------- */
function seg(opts,cur,on,label){const s=h("div",{class:"mr-seg",role:"group","aria-label":label||""});
  opts.forEach(([k,t,c])=>s.append(h("button",{type:"button","aria-pressed":String(k===cur),"data-k":k,style:c?"--b:"+c:null,
    onclick:()=>{s.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===String(k))));on(k);}},t)));return s;}
const shell=(Lb,pic,...parts)=>h("div",{class:"mr-lab",style:"--c:"+Lb.c},...(pic?[pic.el]:[]),...parts);
const info=t=>t?h("p",{class:"mr-info"},t):null;
const btn=(t,on,cls)=>h("button",{type:"button",class:"mr-btn"+(cls?" "+cls:""),onclick:on},t);
const ymd=s=>{const [y,m,d]=s.split("-").map(Number);return y*372+(m-1)*31+(d||1)-1;};
// a span runs from the first day of its first month to the last day of its last month; an end of null is still open
const inSpan=(sp,d)=>ymd(sp[0]+(sp[0].length<8?"-01":""))<=d&&(sp[1]==null||d<=ymd(sp[1]+(sp[1].length<8?"-31":"")));
function fdate(s){const [y,m,d]=s.split("-").map(Number);return (d?d+" ":"")+U.months[m-1]+" "+y;}
const score2=(tot,mid)=>Math.round(100/(1+Math.pow(2,-(tot-mid))));
const bandOf=(s,V)=>s>=V.hi?"link":s>=V.lo?"review":"apart";

/* ---------- play: a playground with experiments ---------- */
// Every lab is a playground (kind "play"), one for each film, as the author set on 18 November 2026: the visitor switches, picks and
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
// a result line under a picture: a tag, washed green or red, with its tick or cross
function verdict(ctx,x,y,t,good,k,maxW){const ww=tag(ctx,x,y,t,{size:24,wash:good?"ok":"no",washA:0.3,maxW:maxW||900});mark(ctx,x+ww+30,y-2,30,good,k);return ww;}

/* ---------- 1 · One person, many roles: five records, one person ---------- */
// Linh's five records, kept apart, folded into one system, or each pointed to one person. Each action says what that way does.
PLAY.five_records=(Lb,api)=>{const W=Lb.w,S={way:"apart",act:null};const okOf=a=>W.ok[a].includes(S.way);
  api.seg(api.group(W.wayL),W.ways,S.way,k=>{S.way=k;S.act=null;api.say(W.ways.find(x=>x[0]===k)[1]+".");},W.wayL);
  const r=api.group(W.actL);W.acts.forEach(([a,t])=>api.btn(r,t,()=>{S.act=a;const good=okOf(a);api.say(W.res[a][S.way],good?"ok":"no");if(good)api.reach(a==="apply"?"transcript":a);}));
  const read=[[W.read.recs,()=>S.way==="one"?"1":"5"],[W.read.people,()=>S.way==="apart"?"5":"1",()=>S.way==="apart"?"no":"ok"],[W.read.roles,()=>(S.way==="one"?"1":"4")+" / 4",()=>S.way==="one"?"no":"ok"]];
  return {vh:640,readouts:read,draw(ctx,w,hh,k){const fx=210,fy=hh-90,rx=430,rw=w-rx-40,ch=84,gap=12;
    linh(ctx,fx,fy,0.5,S.way==="apart"?[]:["student","tutor","researcher","alumna"],{a:S.way==="apart"?0.55:1});
    tx(ctx,W.person,fx,hh-40,{size:24,w:700,align:"center",col:S.way==="apart"?WC_MUTED:WC_DARK});
    W.recs.forEach((c,i)=>{const y=24+i*(ch+gap),gone=S.way==="one"&&(c.role==="tutor"||c.role==="researcher");
      withA(ctx,gone?0.4:1,()=>rec(ctx,rx,y,rw,ch,c,{seed:300+i,dashed:gone}));
      if(gone){pencil(ctx,[[rx+16,y+ch-14],[rx+rw-16,y+14]],{col:NO,lw:3,a:0.8,seed:310+i});tag(ctx,rx+rw-20,y+ch-8,W.folded,{size:18,align:"right",wash:"no",washA:0.25});}
      if(S.way==="linked")wc_link(ctx,rx-6,y+ch/2,fx+70,fy-200+i*22,C(c.role),{p:k,a:0.75,lw:3});
      if(S.way==="one"&&!gone)wc_link(ctx,rx-6,y+ch/2,fx+70,fy-150,WC_PENCIL,{p:k,a:0.5,lw:2.4});});
    if(S.act){const good=okOf(S.act),t=W.acts.find(a=>a[0]===S.act)[2];withA(ctx,k,()=>verdict(ctx,24,40,t,good,k,360));}}};};

/* ---------- 2 · Who is it?: same person? ---------- */
// three pairs, each with its fields' weights; a what-if per pair; a call for each; HR's check for the second; and one step to unlink
PLAY.same_person=(Lb,api)=>{const W=Lb.w,M=W.msg,S={i:0,alt:[false,false,false],dec:[null,null,null],asked:false,hr:false};
  const rows=i=>W.pairs[i].rows.map(r=>S.alt[i]&&r.alt?Object.assign({},r,r.alt):r),tot=i=>rows(i).reduce((a,r)=>a+r.w,0),sc=i=>score2(tot(i),W.mid),bd=i=>bandOf(sc(i),W);
  const bname=i=>W.bands[bd(i)];
  const g1=api.group(W.pairL);let altB=null,hrB=null;
  api.seg(g1,W.pairs.map((p,i)=>[String(i),p.t]),"0",k=>{S.i=+k;altB.textContent=W.pairs[S.i].altT;altB.setAttribute("aria-pressed",String(S.alt[S.i]));hrB.disabled=S.i!==1;api.say(fill(M.pair,{t:W.pairs[S.i].t,s:sc(S.i),b:bname(S.i)}));},W.pairL);
  const g2=api.group();altB=api.toggle(g2,W.pairs[0].altT,false,v=>{S.alt[S.i]=v;api.say(fill(v?M.alt:M.altOff,{s:sc(S.i),b:bname(S.i)}));});
  const g3=api.group();W.calls.forEach(([c,t])=>api.btn(g3,t,()=>call(c),c==="link"?"go":""));
  hrB=api.btn(g3,W.hrB,()=>{if(!S.asked){api.say(M.p1.hrFirst,"warn");return;}S.hr=true;api.say(M.p1.hr,"ok");});hrB.disabled=true;
  api.btn(g3,W.undoB,()=>{const j=S.dec.findIndex(d=>d==="link");if(j<0){api.say(M.nothing,"warn");return;}S.dec[j]=null;api.say(M.undo,"ok");api.reach("undo");},"sm");
  function call(c){const i=S.i;S.dec[i]=c;
    if(i===0){api.say(M.p0[c],c==="apart"?"no":"ok");if(c==="link"&&bd(0)==="link")api.reach("auto");}
    else if(i===1){if(c==="review"){S.asked=true;api.say(M.p1.review,"ok");}else if(c==="link"){if(S.asked&&S.hr){api.say(M.p1.link,"ok");api.reach("typo");}else api.say(M.p1.guess,"no");}else api.say(M.p1.apart,"no");}
    else{api.say(M.p2[c],c==="link"?"no":"ok");if(c==="apart")api.reach("aisha");}}
  return {vh:660,readouts:[[W.read.score,()=>String(sc(S.i))],[W.read.band,()=>bname(S.i)],[W.read.kept,()=>String(S.dec.filter(Boolean).length)]],
    draw(ctx,w,hh,k){const p=W.pairs[S.i],rs=rows(S.i),s=sc(S.i),d=S.dec[S.i],ok=d==null?null:S.i===0?d!=="apart":S.i===1?(d==="review"||(d==="link"&&S.asked&&S.hr)):d==="apart";
      PIX.match(ctx,w,hh,{p,rows:rs,score:s,call:d,ok},{w:{lo:W.lo,hi:W.hi,bands:W.bands,calls:W.calls}},k);}};};

/* ---------- 3 · Which value wins ---------- */
// Linh's master record, field by field: one order for every field, the newest sent, or a rule for each field; HR's resend makes its old
// values the newest; a dry run lists what a new rule would change
PLAY.which_value=(Lb,api)=>{const W=Lb.w,M=W.msg,S={rule:"order",resent:false,dry:false};
  const win=f=>{const v=S.rule==="newest"?f.newest[S.resent?1:0]:f[S.rule];return [].concat(v);};
  const good=(f,i)=>{const w=win(f);return W.ok[i]==="all"?w.length===f.vals.length:w.length===1&&w[0]===W.ok[i];};
  const right=()=>W.fields.filter(good).length;
  const check=()=>{if(S.rule==="field"){api.reach("name");api.reach("emails");if(S.resent)api.reach("resend");}else if(S.rule==="order"&&S.resent)api.reach("resend");};
  api.seg(api.group(W.ruleL),W.rules,S.rule,k=>{S.rule=k;S.dry=false;api.say(k==="newest"&&S.resent?M.newestAfter:M[k],k==="field"?"ok":k==="order"?"warn":S.resent?"no":"warn");check();},W.ruleL);
  const g=api.group();
  api.btn(g,W.resendB,()=>{S.resent=true;S.dry=false;const bad=S.rule==="newest";api.say(M.resend+(bad?M.resendBad:M.resendOk),bad?"no":"ok");check();});
  api.btn(g,W.dryB,()=>{if(S.rule!=="field"){api.say(M.dryCode,"warn");return;}S.dry=true;api.say(M.dry,"ok");api.reach("dry");});
  return {vh:620,readouts:[[W.read.right,()=>right()+" / "+W.fields.length,()=>right()===W.fields.length?"ok":"no"],[W.read.where,()=>W.whereV[S.rule]]],
    draw(ctx,w,hh,k){const F=W.fields;linh(ctx,150,hh-26,0.44,["student","tutor","researcher","alumna"]);
      const x0=310,cw=w-x0-20;card(ctx,x0,20,cw,hh-40,{kind:"sheet",seed:95});tx(ctx,W.title,x0+30,72,{size:30,w:800,col:WC_DARK});
      if(S.dry)tag(ctx,x0+cw-30,62,"1,284".replace(",",L.lang==="es"?".":","),{size:24,align:"right",wash:"amber",washA:0.35});
      const top=96,rh=(hh-top-34)/F.length,vx=x0+240,vmax=cw-240-70;
      F.forEach((f,i)=>{const y=top+i*rh,mid=y+rh/2,ws=win(f);pencil(ctx,[[x0+20,y],[x0+cw-20,y]],{a:0.22,lw:1.6,seed:i+11});
        tx(ctx,f.f,x0+30,mid+9,{size:fit(ctx,f.f,196,26,800,null,17),w:800,col:WC_DARK});
        if(ws.length>1){let x=vx;const mw=(vmax-24)/ws.length;ws.forEach(j=>{const v=f.vals[j],Sx=W.src[v.src]||{};x+=tag(ctx,x,mid,v.v,{size:fit(ctx,v.v,mw-40,21,700,null,15),wash:Sx.c,maxW:mw})+8;});}
        else{const v=f.vals[ws[0]],Sx=W.src[v.src]||{},z=fit(ctx,v.v,vmax-230,26,700,null,17),vw2=tw(ctx,v.v,z,700)+16,changed=S.resent&&S.rule==="newest"&&v.src==="hr";
          withA(ctx,changed?Math.max(0.35,k):1,()=>{tx(ctx,v.v,vx,mid+9,{size:z,w:700});const mw=Math.max(120,vmax-vw2);tag(ctx,vx+vw2,mid,Sx.t,{size:fit(ctx,Sx.t,mw-40,21,700,null,15),wash:Sx.c,maxW:mw});});}
        mark(ctx,x0+cw-40,mid-2,30,good(f,i),k);});}};};

/* ---------- 4 · Roles come and go: who is she on a date? ---------- */
PLAY.on_a_date=(Lb,api)=>{const W=Lb.w,M=W.msg,S={keep:"status",at:null};
  const openOn=s=>{const d=ymd(s);return W.roles.filter(r=>r.spans.some(sp=>inSpan(sp,d))).map(r=>r.k);};
  const open=()=>openOn(S.keep==="status"||!S.at?W.today:S.at);
  const has=k=>open().includes(k);
  const look=()=>{if(!S.at)return;if(S.keep==="status"){api.say(fill(M.statusAt,{d:fdate(S.at)})+(S.at<W.today.slice(0,4)+"-01-01"?" "+M.statusLast:""),"no");return;}
    api.say(M[S.at],"ok");api.reach({"2026-03-31":"census","2025-03-31":"lastyear","2026-01-15":"between","2027-01-15":"ends"}[S.at]);};
  api.seg(api.group(W.keepL),W.keeps,S.keep,k=>{S.keep=k;if(S.at)look();else api.say(M[k]);},W.keepL);
  api.seg(api.group(W.dateL),W.dates,null,k=>{S.at=k;look();},W.dateL);
  const yn=b=>b?W.yes:W.no;
  return {vh:600,readouts:[[W.read.student,()=>yn(has("student"))],[W.read.works,()=>yn(has("student")&&(has("tutor")||has("researcher")))],[W.read.alum,()=>yn(has("alumna")&&has("student"))]],
    draw(ctx,w,hh,k){const at=S.keep==="status"||!S.at?W.today:S.at;
      PIX.timeline(ctx,w,hh,{at,open:open()},{w:{from:W.from,to:W.to,roles:W.roles}},k);
      if(S.keep==="status"){withA(ctx,0.92,()=>tag(ctx,300,24,W.status+(S.at?" · "+fdate(S.at):""),{size:22,wash:"no",washA:0.28}));}}};};

/* ---------- 5 · Lists everyone uses: one list, every code ---------- */
PLAY.map_codes=(Lb,api)=>{const W=Lb.w,M=W.msg,S={home:"sheet",map:false,counted:false,renamed:false,def:false,last:null};
  const homeCheck=()=>{if(S.home==="table"&&S.map)api.reach("home");};
  api.seg(api.group(W.homeL),W.homes,S.home,k=>{S.home=k;S.renamed=false;S.def=false;api.say(M[k],k==="table"?"ok":"warn");homeCheck();},W.homeL);
  api.toggle(api.group(),W.mapT,false,v=>{S.map=v;S.counted=false;api.say(v?M.mapOn:M.mapOff,v?"ok":"warn");homeCheck();});
  const g=api.group();
  api.btn(g,W.countB,()=>{S.counted=true;S.last="count";api.say(S.map?M.countMap:M.countNo,S.map?"ok":"no");if(S.map)api.reach("once");});
  api.btn(g,W.renameB,()=>{S.renamed=true;S.last="rename";const ok=S.home==="table";api.say(ok?M.renameTable:M.renameSheet,ok?"ok":"no");if(ok)api.reach("rename");});
  api.btn(g,W.defB,()=>{S.def=true;S.last="def";const ok=S.home==="table";api.say(ok?M.defTable:M.defSheet,ok?"ok":"no");if(ok)api.reach("def");});
  return {vh:640,readouts:[[W.read.typed,()=>S.home==="table"?"1":"3",()=>S.home==="table"?"ok":"no"],[W.read.counted,()=>S.map?"1":"3",()=>S.map?"ok":"no"]],
    draw(ctx,w,hh,k){const lx=w-470,lw=446,top=24,rh=76;
      W.codes.forEach((c,i)=>{const y=top+30+i*rh;tx(ctx,c.sys,40,y-8,{size:20,w:600,col:WC_MUTED});const t1=tag(ctx,40,y+22,c.v,{size:24,f:"mono",w:500,wash:c.c,washA:0.3,maxW:lx-200});
        if(S.map)wc_link(ctx,40+t1+6,y+22,lx-6,top+92,OK,{p:k,a:0.75,lw:3});});
      card(ctx,lx,top,lw,150,{kind:"sheet",seed:140,dashed:S.home!=="table"});tx(ctx,W.list,lx+lw/2,top+44,{size:24,w:800,align:"center",col:WC_DARK});
      tag(ctx,lx+24,top+96,W.row[0],{size:24,f:"mono",w:500,wash:"amber",washA:0.3});tx(ctx,W.row[1],lx+110,top+104,{size:24,w:700});
      // the count: one row for Viet Nam, or three
      const cy=top+4*rh+50;tx(ctx,W.countL,40,cy,{size:22,w:800,col:WC_DARK});
      if(S.counted){const ns=S.map?["Viet Nam"]:["Vietnam","Viet Nam","VN","VNM"];let x=40;ns.forEach(n=>{x+=tag(ctx,x,cy+44,n+" · 1",{size:22,wash:S.map?"ok":"no",washA:0.3})+10;});mark(ctx,x+24,cy+42,28,S.map,k);}
      // the role list: the tutor's row, renamed or not
      const ry=top+180;card(ctx,lx,ry,lw,hh-ry-24,{kind:"sheet",seed:141,dashed:S.home!=="table"});tx(ctx,W.roleList,lx+lw/2,ry+42,{size:22,w:800,align:"center",col:WC_DARK});
      tag(ctx,lx+24,ry+92,W.roleRow,{size:22,f:"mono",w:500,wash:"tutor",washA:0.3});
      if(S.renamed&&S.home==="table"){withA(ctx,0.6,()=>tx(ctx,W.oldName+" · "+W.ended,lx+24,ry+150,{size:fit(ctx,W.oldName+" · "+W.ended,lw-48,22,600,null,15),w:600,col:WC_MUTED}));
        withA(ctx,k,()=>tx(ctx,W.newName+" · "+W.from,lx+24,ry+190,{size:fit(ctx,W.newName+" · "+W.from,lw-48,22,700,null,15),w:700,col:OK}));}
      else{tx(ctx,S.renamed?W.newName:W.oldName,lx+24,ry+150,{size:22,w:700});if(S.renamed)cross(ctx,lx+lw-44,ry+144,28,k);}
      if(S.def){const ok=S.home==="table";verdict(ctx,lx+24,hh-64,"DEF",ok,k,200);}}};};

/* ---------- 6 · For this purpose only ---------- */
PLAY.may_use=(Lb,api)=>{const W=Lb.w,M=W.msg,S={tags:false,wish:false,pol:false,last:null,good:null};
  const g=api.group(W.setL);
  api.toggle(g,W.tagsT,false,v=>{S.tags=v;S.last=null;api.say(v?M.tagsOn:M.tagsOff);});
  api.toggle(g,W.wishT,false,v=>{S.wish=v;S.last=null;api.say(v?M.wishOn:M.wishOff);});
  api.toggle(g,W.polT,false,v=>{S.pol=v;S.last=null;api.say(v?M.polOn:M.polOff);});
  const a=api.group(W.actL),go=(key,ok,yes,no,goal)=>{S.last=key;S.good=ok;api.say(ok?yes:no,ok?"ok":"no");if(ok)api.reach(goal);};
  api.btn(a,W.topB,()=>go("top",S.tags&&S.pol,M.topOk,M.topNo,"results"));
  api.btn(a,W.appealB,()=>{const ok=S.wish&&S.pol;S.last="appeal";S.good=ok;api.say(ok?M.appealOk:S.wish?M.appealPol:M.appealRec,ok?"ok":"no");if(ok)api.reach("no");});
  api.btn(a,W.colB,()=>go("col",S.tags,M.colOk,M.colNo,"test"));
  api.btn(a,W.askB,()=>go("ask",S.tags&&S.wish,M.askOk,M.askNo,"request"));
  return {vh:620,readouts:[[W.read.policies,()=>S.pol?"2":"0"],[W.read.reached,()=>S.wish&&S.pol?W.no:W.yes,()=>S.wish&&S.pol?"ok":"no"]],
    draw(ctx,w,hh,k){linh(ctx,170,hh-26,0.44,["student","tutor","researcher","alumna"]);const rx=380,rw=430,ys=[40,240];
      W.recs.forEach((c,i)=>{rec(ctx,rx,ys[i],rw,110,c,{seed:160+i});if(S.tags)withA(ctx,k,()=>tag(ctx,rx+rw-16,ys[i]+138,W.tagW[i],{size:20,align:"right",wash:"amber",washA:0.3}));});
      const ax=w-150,ay=230;wc_envelope(ctx,ax,ay,1.2,0);tx(ctx,W.appeal,ax,ay+76,{size:24,w:700,align:"center",col:WC_DARK});
      const held=S.wish&&S.pol;if(S.last==="appeal"){const tip=wc_link(ctx,ax-80,ay,rx+rw+8,ys[0]+56,C("donor"),{p:held?k*0.55:k,a:0.8,lw:3});if(held&&tip)cross(ctx,tip[0],tip[1],34,k);}
      const wp=S.wish?[24,66]:[rx,ys[1]+176],ww=tag(ctx,wp[0],wp[1],W.wish,{size:24,wash:"donor",washA:0.35,maxW:S.wish?330:rw});
      if(S.wish)wc_link(ctx,24+ww/2,wp[1]+26,160,hh-320,C("donor"),{p:k,vertical:true,a:0.6});
      if(S.pol)tag(ctx,ax,ay-110,W.policy,{size:20,align:"center",wash:"ok",washA:0.3});
      if(S.last&&S.last!=="appeal"){const t=W[{top:"topB",col:"colB",ask:"askB"}[S.last]];withA(ctx,k,()=>verdict(ctx,rx,hh-50,t,S.good,k,rw+80));}}};};

/* ---------- 7 · One person, many systems: search before you create ---------- */
PLAY.search_first=(Lb,api)=>{const W=Lb.w,M=W.msg,S={mode:"create",on:{dob:false,email:false,num:false},app:0,ran:false,out:null,nums:2,wait:0};
  const scores=a=>a.cands.map(c=>{let t=c.w.name;W.given.forEach(([g])=>{if(S.on[g])t+=c.w[g];});const s=Math.max(0,Math.min(99,Math.round(W.base+W.scale*t)));return {c,s,b:bandOf(s,W)};});
  const decide=a=>{const sc=scores(a),best=sc.reduce((m,x)=>x.s>m.s?x:m,sc[0]),links=sc.filter(x=>x.b==="link");
    if(links.length===1)return ["add",links[0],sc];if(sc.some(x=>x.b!=="apart"))return ["review",null,sc];return ["create",null,sc];};
  api.seg(api.group(W.modeL),W.modes,S.mode,k=>{S.mode=k;S.ran=false;api.say(M[k]);},W.modeL);
  const g=api.group(W.givenL);W.given.forEach(([k2,t])=>api.toggle(g,t,false,v=>{S.on[k2]=v;S.ran=false;const ls=W.given.filter(([x])=>S.on[x]).map(([,y])=>y);api.say(ls.length?fill(M.on,{list:[W.nameL].concat(ls).join(", ")}):M.onlyName);}));
  const r=api.group();W.apps.forEach((a,i)=>api.btn(r,a.b,()=>{S.app=i;S.ran=true;
    if(S.mode==="create"){S.out=["create",null,[]];if(a.key==="linh"){S.nums++;api.say(M.linhCreate,"no");}else api.say(M.otherCreateBlind,"warn");return;}
    const d=decide(a);S.out=d;
    if(d[0]==="review"){S.wait++;api.say(M.review,"ok");api.reach("wait");}
    else if(a.key==="linh"){if(d[0]==="add"&&d[1].c.id==="P-10482"){api.say(M.linhAdd,"ok");api.reach("role");}else{S.nums++;api.say(M.linhCreate,"no");}}
    else{if(d[0]==="create"){api.say(M.otherCreate,"ok");api.reach("other");}else api.say(M.otherAdd,"no");}}));
  return {vh:620,readouts:[[W.read.numbers,()=>String(S.nums),()=>S.nums>2?"no":""],[W.read.waiting,()=>String(S.wait)]],
    draw(ctx,w,hh,k){const a=W.apps[S.app],ax=24,aw=430;card(ctx,ax,20,aw,hh-40,{kind:"card",role:"applicant",sw:tw(ctx,a.t,26,800)+36,seed:190});
      tx(ctx,a.t,ax+30,64,{size:fit(ctx,a.t,aw-60,26,800,null,17),w:800,col:WC_DARK});
      [["name",W.nameL]].concat(W.given).forEach(([g2,lab],i)=>{const on=g2==="name"||(S.mode==="search"&&S.on[g2]),t=lab+": "+a.given[g2];withA(ctx,on?1:0.38,()=>tag(ctx,ax+24,134+i*76,t,{size:fit(ctx,t,aw-88,21,700,null,15),wash:on?"applicant":null,washA:0.35,maxW:aw-48}));});
      const cx=500,cw=w-cx-24,ch=130;
      if(S.mode==="create"){card(ctx,cx,60,cw,ch,{kind:"card",dashed:true,seed:197});tx(ctx,W.outcomes.create,cx+cw/2,60+ch/2+10,{size:28,w:800,align:"center",col:WC_DARK});
        wc_link(ctx,ax+aw+4,150,cx-6,60+ch/2,WC_PENCIL,{p:k,a:0.7,lw:3});if(S.ran)verdict(ctx,cx,hh-56,W.outcomes.create,a.key!=="linh",k,cw-60);return;}
      const sc=scores(a);sc.forEach(({c,s,b},i)=>{const y=34+i*(ch+28),col=b==="link"?OK:b==="review"?CI("applicant"):WC_MUTED;card(ctx,cx,y,cw,ch,{kind:"card",seed:195+i});
        tx(ctx,c.title+" · "+c.id,cx+26,y+46,{size:fit(ctx,c.title+" · "+c.id,cw-190,26,800,null,17),w:800,col:WC_DARK});tx(ctx,c.note,cx+26,y+84,{size:fit(ctx,c.note,cw-260,22,600,null,15),w:600,col:WC_MUTED});
        tx(ctx,String(s),cx+cw-30,y+62,{size:44,w:800,align:"right",col});tag(ctx,cx+cw-26,y+104,W.bands[b],{size:19,align:"right",wash:b==="link"?"ok":b==="review"?"amber":null,washA:0.3});
        wc_link(ctx,ax+aw+4,150,cx-6,y+ch/2,b==="link"?OK:WC_PENCIL,{p:k,a:b==="apart"?0.22:0.7,lw:3});});
      if(S.ran&&S.out){const [o,best]=S.out,good=o===a.want||o==="review",ot=fill(W.outcomes[o],{who:best?best.c.title+" ("+best.c.id+")":""});verdict(ctx,cx,hh-56,ot,good,k,cw-60);}}};};

/* ---------- 8 · A hub at work: Monday at the hub ---------- */
PLAY.one_review=(Lb,api)=>{const W=Lb.w,M=W.msg,S={step:0,flip:false,ai:false,linked:false,pub:false,fri:false,undone:false,waiting:8};
  const m=api.group(W.monL);
  api.btn(m,W.openB,()=>{S.step=Math.max(S.step,1);api.say(M.open);});
  api.toggle(m,W.flipT,false,v=>{if(!S.step){api.say(M.openFirst,"warn");return;}S.flip=v;S.step=Math.max(S.step,2);api.say(v?M.flipOn:M.flipOff,"ok");if(v)api.reach("flip");});
  api.btn(m,W.aiB,()=>{if(!S.step){api.say(M.openFirst,"warn");return;}S.ai=true;S.step=3;api.say(M.ai,"ok");});
  api.btn(m,W.linkB,()=>{if(!S.step){api.say(M.openFirst,"warn");return;}S.linked=true;S.step=4;if(S.waiting===8)S.waiting=7;api.say(S.ai?M.linkAi:M.linkNoAi,"ok");api.reach("reason");if(S.ai)api.reach("ai");},"go");
  api.btn(m,W.pubB,()=>{if(!S.linked){api.say(M.linkFirst,"warn");return;}S.pub=true;S.step=5;api.say(M.pub,"ok");api.reach("publish");});
  const f=api.group(W.friL);
  api.btn(f,W.checkB,()=>{S.fri=true;S.undone=false;api.say(M.check,"warn");});
  api.btn(f,W.unlinkB,()=>{if(!S.fri){api.say(M.checkFirst,"warn");return;}S.undone=true;api.say(M.unlink,"ok");api.reach("undo");});
  return {vh:860,readouts:[[W.read.score,()=>S.flip?"93":"74"],[W.read.waiting,()=>String(S.waiting)],[W.read.wrong,()=>S.fri?(S.undone?"0":"1")+" / 50":"–",()=>S.fri?(S.undone?"ok":"no"):""]],
    draw(ctx,w,hh,k){const hub=700;ctx.save();ctx.beginPath();ctx.rect(0,0,w,hub);ctx.clip();PIX.hub(ctx,w,hub,{step:S.step},{w:{pic:W.pic}},k);ctx.restore();
      if(S.flip)withA(ctx,k,()=>tag(ctx,450,62,W.pic.flip,{size:22,wash:"ok",washA:0.35,maxW:330}));
      const fx=24,fy=hub+6,fw=w-48;withA(ctx,S.fri?1:0.35,()=>{card(ctx,fx,fy,fw,hh-fy-20,{kind:"card",wash:S.fri?"steward":null,washA:0.18,seed:290});
        tx(ctx,S.fri?W.pic.friday:W.friL,fx+30,fy+56,{size:fit(ctx,W.pic.friday,fw-60,28,800,null,18),w:800,col:WC_DARK});
        tx(ctx,W.pic.limit,fx+30,fy+100,{size:fit(ctx,W.pic.limit,fw/2,22,600,null,15),w:600,col:WC_MUTED});});
      if(S.undone)verdict(ctx,fx+fw/2+20,fy+92,W.unlinkB,true,k,fw/2-120);}};};

/* ---------- 9 · Kept, not cleaned: clean up, or check at entry? ---------- */
PLAY.cleanup_or_entry=(Lb,api)=>{const W=Lb.w,M=W.msg,S={pick:"nothing",ran:false,meas:false,alert:false};
  api.seg(api.group(W.wayL),W.opts,S.pick,k=>{S.pick=k;S.ran=false;api.say(M[k]);},W.wayL);
  api.toggle(api.group(),W.measT,false,v=>{S.meas=v;S.alert=false;api.say(v?M.measOn:M.measOff,v?"ok":"warn");});
  const g=api.group();
  api.btn(g,W.runB,()=>{S.ran=true;const p=S.pick;api.say(M["run"+p[0].toUpperCase()+p.slice(1)],p==="entry"?"ok":"no");if(p==="cleanup")api.reach("back");if(p==="entry"){api.reach("under");api.reach("phd");}},"go");
  api.btn(g,W.alertB,()=>{S.alert=true;api.say(S.meas?M.alertOn:M.alertOff,S.meas?"ok":"no");if(S.meas)api.reach("alert");});
  const end=()=>{const l=W.chart.lines[S.pick];return l[l.length-1][1];};
  return {vh:600,readouts:[[W.read.waiting,()=>S.ran?num(end()):"–",()=>S.ran?(S.pick==="entry"?"ok":"no"):""],[W.read.projects,()=>S.ran?(S.pick==="cleanup"?"2":"0"):"–"]],
    draw(ctx,w,hh,k){const G=W.chart,pick=S.ran?S.pick:"__";PIX.chart(ctx,w,hh,{pick},{w:{chart:G}},k);
      if(S.meas){const t=W.measures;withA(ctx,0.95,()=>tag(ctx,w-24,40,t,{size:20,align:"right",wash:S.alert?"ok":"steward",washA:0.3,maxW:520}));}
      if(S.ran&&S.pick==="entry")withA(ctx,k,()=>tag(ctx,140,70,W.phd,{size:22,wash:"student",washA:0.3,maxW:640}));}};};

const BUILD=Object.assign({},window.LD_CLASSIC&&window.LD_CLASSIC.kinds,{play:labPlay});  // up to three more labs a film, in the classic kinds (site/assets/learn/classic.js)
L.BUILD=BUILD;L.PIX=PIX;L.lib={h,seg,stage,shell,info,btn,fill,num,dec,tx,fit,wrap,lines,tag,card,linh,tick,cross,mark,pencil,wash,head,C,CI,OK,NO};

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
