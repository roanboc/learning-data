/* Learning Data: The same one, everywhere. The labs (Take it apart) and the scenarios (Make the call) of the whole series, one page
   each, from one engine, as site-tools/build_series.py makes them for a series with labs and scenarios of its own: the page loads a
   film's bundle (for the series' watercolour: shared/src/wash.js and people.js), the words (learn.en.js or learn.es.js, which set
   window.MR) and this file, and fills #series-labs or #series-quiz. The words cover every film of the series; the page says which
   films are on the site, or coming (data-films on its root: {number: {t, k, href, starts} or {t, coming}}), and only their labs and
   scenarios show. Its data-store is the progress prefix.
   A lab is one of ten kinds, described entirely by its words:
     sort      place each item in a bucket, then check: every item says why, and what goes wrong where you put it
     pick      choose one option, and see what it gets right and wrong
     steps     walk through a sequence, one step at a time
     compose   build a sentence from parts, such as a rule
     test      answer the same questions of several things, and see the verdict (the four questions of One person, many roles)
     match     compare two records field by field: each comparison adds or takes away weight, and the score lands in a band; or, as a
               search, see which details find a person
     bands     set the two thresholds that make three bands, and see what each costs
     survive   choose a rule for each field, and watch the master record take its values
     timeline  move a date across dated roles, and see who the person is on that date
     map       map each system's codes to one list, then run the test that reads it
   Pictures are drawn with the films' own components (wc_*): a lab's or a scenario's "vis" names a function in PIX below, which takes
   its words from the lab or the scenario. Without the bundle, the labs still work, on plain paper.
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
// words a picture had to cut, or that still overflow at the smallest size: kept in window.MR_MISS, so checks can list them
const MISS=(window.MR_MISS=window.MR_MISS||[]);function miss(s){s=String(s);if(MISS.indexOf(s)<0)MISS.push(s);}
// the biggest size, from size down to min, at which s fits in maxW
function fit(ctx,s,maxW,size,w,f,min){let z=size;while(z>(min||22)&&tw(ctx,String(s),z,w||600,f)>maxW)z-=1;if(tw(ctx,String(s),z,w||600,f)>maxW+1)miss(s);return z;}
function wrap(ctx,s,maxW,size,w,f){const words=String(s).split(" "),out=[];let cur="";words.forEach(wd=>{const t=cur?cur+" "+wd:wd;if(cur&&tw(ctx,t,size,w||600,f)>maxW){out.push(cur);cur=wd;}else cur=t;});if(cur)out.push(cur);return out;}
function wrapN(ctx,s,maxW,size,w,f,n){const l=wrap(ctx,s,maxW,size,w,f);if(l.length>n)miss(s);return l.slice(0,n);}
function lines(ctx,s,x,y,maxW,o){o=o||{};const z=o.size||30,ls=wrapN(ctx,s,maxW,z,o.w,o.f,o.max||9);ls.forEach((l,i)=>tx(ctx,l,x,y+i*(o.lh||z*1.28),Object.assign({},o,{size:z})));return ls.length*(o.lh||z*1.28);}
// a paper tag; y is its middle; returns its width
function tag(ctx,x,y,s,o){o=o||{};const size=o.size||28;let t=String(s);if(o.maxW){while(t.length>3&&tw(ctx,t,size,o.w||700,o.f)+40>o.maxW)t=t.slice(0,-2);if(t!==String(s)){t=t.replace(/\s+$/,"")+"…";miss(s);}}
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
    withA(ctx,A(4),()=>{card(ctx,rx,256,rw2,116,{kind:"card",wash:s>=4?"amber":null,washA:0.22,seed:234});lines(ctx,P.from,rx+22,298,rw2-44,{size:22,w:700,max:2});});}
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

/* ---------- match: two records compared, field by field; or a search, and what it finds ---------- */
// the score: the weights added up, on a scale of 0 to 100 (base + scale × total, as the films show it)
// a pair's score from its total weight: with mid, the weights are log-odds (base 2) that the two are one person, and mid sets the
// odds before any field is compared (the matcher of Who is it?: 5.69, a prior of one in 52); without it, a straight line, base + scale × total
const scoreOf=(V,tot)=>Math.max(0,Math.min(100,Math.round(V.mid!=null?100/(1+Math.pow(2,-(tot-V.mid))):(V.base||0)+(V.scale||10)*tot)));
const bandOf=(V,s)=>s>=V.hi?"link":s>=V.lo?"review":"apart";
// an email may break before its @, and nowhere else unless it must
const wb=s=>String(s).split(/(?=@)/).flatMap((p,i)=>i?[h("wbr"),p]:[p]);
function labMatch(Lb){const V=Lb.w;return V.mode==="search"?labSearch(Lb):labPair(Lb);}
function labPair(Lb){const V=Lb.w;let cur=0;const alt=V.pairs.map(p=>p.rows.map(()=>false)),call=V.pairs.map(()=>null);
  const say=h("p",{class:"mr-say",role:"status"}),rows=h("div",{class:"mr-cmp"}),sc=h("p",{class:"mr-score"}),yours=h("div",{class:"mr-controls"}),fb=h("div");
  const row=(p,i)=>{const r=p.rows[i];return alt[cur][i]&&r.alt?Object.assign({},r,r.alt):r;};
  const total=()=>V.pairs[cur].rows.reduce((a,r,i)=>a+row(V.pairs[cur],i).w,0);
  const anyAlt=()=>alt[cur].some(Boolean),now=()=>{const s=scoreOf(V,total());return{s,b:bandOf(V,s)};};
  const pic=picture(Lb,()=>{const p=V.pairs[cur],{s,b}=now();return{p,rows:p.rows.map((r,i)=>row(p,i)),score:s,band:b,call:call[cur],ok:call[cur]===b};});
  function draw(){const p=V.pairs[cur];
    rows.replaceChildren(h("div",{class:"mr-cmp-h"},h("span",null,V.field),h("span",null,p.a.id||p.a.title),h("span",null,p.b.id||p.b.title),h("span",null,V.weight)),
      ...p.rows.map((r0,i)=>{const r=row(p,i);return h("div",{class:"mr-cmp-r"+(r.w>0?" plus":r.w<0?" minus":"")},h("b",null,r.f),h("span",{class:"v"},wb(r.av)),h("span",{class:"v"},wb(r.bv)),
        h("span",{class:"w"},h("em",null,r.how),h("b",null,dec(r.w))),
        r0.alt?h("button",{type:"button",class:"mr-btn sm","aria-pressed":String(alt[cur][i]),onclick:()=>{alt[cur][i]=!alt[cur][i];call[cur]=null;draw();upd(true);}},r0.alt.t):null);}));
    yours.replaceChildren(h("span",{class:"mr-lbl"},V.your),seg(V.calls,call[cur],k=>{call[cur]=k;draw();upd(true);},V.your));
    // the right call is the band the score lands in; once a change is tried, the note says where the score is now
    const c=call[cur],{s,b}=now(),ok=c===b;fb.replaceChildren(...(c?[h("p",{class:"mr-verdict "+(ok?"ok":"no")},h("b",null,(ok?U.right:U.wrong)+" "),anyAlt()?fill(V.altNote,{s,b:V.bands[b]}):p.calls[c])]:[]));}
  function upd(anim){const t=total(),s=scoreOf(V,t),b=bandOf(V,s);sc.replaceChildren(h("span",null,V.scoreL+" "),h("b",null,String(s)),h("span",{class:"band "+b},V.bands[b]));
    say.textContent=call[cur]===b&&!anyAlt()?V.pairs[cur].say:fill(V.sayBand[b],{s,lo:V.lo,hi:V.hi});if(pic)pic.paint(anim);}
  const pairs=V.pairs.length>1?h("div",{class:"mr-controls"},h("span",{class:"mr-lbl"},V.label),seg(V.pairs.map((p,i)=>[String(i),p.t]),"0",k=>{cur=+k;draw();upd(true);},V.label)):null;
  draw();ready().then(()=>upd());return shell(Lb,pic,info(V.prompt),pairs,rows,sc,yours,fb,say);}
function labSearch(Lb){const V=Lb.w;let cur=0;const on=V.apps.map(a=>a.given.map(g=>!!g.on));
  const say=h("p",{class:"mr-say",role:"status"}),given=h("div",{class:"mr-toggles",role:"group","aria-label":V.givenL}),found=h("div",{class:"mr-rows"}),out=h("p",{class:"mr-verdict"});
  const scores=()=>{const a=V.apps[cur];return a.cands.map(c=>{const t=c.rows.reduce((s,r)=>{const g=a.given.findIndex(x=>x.k===r.need);return s+(g>=0&&on[cur][g]?r.w:0);},0);const s=scoreOf(V,t);return{c,s,b:bandOf(V,s)};});};
  const outcome=sc=>{const best=sc.slice().sort((x,y)=>y.s-x.s)[0];return best&&best.b==="link"?["add",best]:best&&best.b==="review"?["review",best]:["create",null];};
  const pic=picture(Lb,()=>{const sc=scores();return{app:V.apps[cur],on:on[cur],sc,out:outcome(sc)};});
  function draw(){const a=V.apps[cur];given.replaceChildren(...a.given.map((g,i)=>h("label",null,h("input",{type:"checkbox",checked:on[cur][i]||null,onchange:e=>{on[cur][i]=e.target.checked;upd(true);}}),h("span",null,g.t))));}
  function upd(anim){const sc=scores(),[o,best]=outcome(sc),a=V.apps[cur];
    found.replaceChildren(...sc.map(({c,s,b})=>h("div",{class:"mr-row mr-found "+b},h("p",{class:"mr-item"},c.title+" · "+c.id),h("p",{class:"mr-why"},c.note),h("p",{class:"mr-score"},h("span",null,V.scoreL+" "),h("b",null,String(s)),h("span",{class:"band "+b},V.bands[b])))));
    const good=o===a.want;out.className="mr-verdict "+(good?"ok":"no");out.replaceChildren(h("b",null,fill(V.outcomes[o],{who:best?best.c.title+" ("+best.c.id+")":""})+". "),good?a.good:a.bad[o]||"");
    say.textContent=fill(V.say,{n:on[cur].filter(Boolean).length,of:a.given.length});if(pic)pic.paint(anim);}
  const apps=V.apps.length>1?h("div",{class:"mr-controls"},h("span",{class:"mr-lbl"},V.label),seg(V.apps.map((a,i)=>[String(i),a.t]),"0",k=>{cur=+k;draw();upd(true);},V.label)):null;
  draw();ready().then(()=>upd());return shell(Lb,pic,info(V.prompt),apps,h("p",{class:"mr-lbl mr-pad"},V.givenL),given,found,out,say);}

/* ---------- bands: two thresholds, three bands, and what each costs ---------- */
function labBands(Lb){const V=Lb.w;let lo=V.lo,hi=V.hi;const say=h("p",{class:"mr-say",role:"status"}),stats=h("div",{class:"mr-stats"}),goals=h("ul",{class:"mr-checks"});
  const count=()=>{const r={auto:0,fm:0,rv:0,apart:0,mm:0};V.pts.forEach(([s,same])=>{if(s>=hi){r.auto++;if(!same)r.fm++;}else if(s>=lo)r.rv++;else{r.apart++;if(same)r.mm++;}});return r;};
  const pic=picture(Lb,()=>({lo,hi,r:count()}));
  const slider=(lbl,get,setv)=>{const val=h("output",null,String(get()));const inp=h("input",{type:"range",min:"0",max:"100",step:"1",value:String(get()),"aria-label":lbl,
      oninput:e=>{setv(+e.target.value);inp.value=String(get());val.textContent=String(get());inp.setAttribute("aria-valuetext",String(get()));upd(true);}});
    return h("label",{class:"mr-slider"},h("span",null,lbl),inp,val);};
  const sHi=slider(V.hiL,()=>hi,v=>{hi=Math.max(v,lo);}),sLo=slider(V.loL,()=>lo,v=>{lo=Math.min(v,hi);});
  function upd(anim){const r=count();stats.replaceChildren(...[["auto",r.auto],["fm",r.fm],["rv",r.rv],["mm",r.mm]].map(([k,n])=>h("p",{class:k==="fm"&&n?"no":k==="mm"&&n?"warn":""},h("b",null,String(n)),h("span",null,V.stat[k]))));
    const ok=V.goals.map(g=>g.k==="fm"?r.fm<=g.max:g.k==="mm"?r.mm<=g.max:r.rv<=g.max);goals.replaceChildren(...V.goals.map((g,i)=>h("li",{class:ok[i]?"ok":"no"},g.t)));
    say.textContent=ok.every(Boolean)?fill(V.sayGood,{rv:r.rv}):r.fm?fill(V.sayFm,{n:r.fm}):r.mm>V.goals.find(g=>g.k==="mm").max?fill(V.sayMm,{n:r.mm}):fill(V.sayRv,{n:r.rv});if(pic)pic.paint(anim);}
  ready().then(()=>upd());return shell(Lb,pic,info(V.prompt),h("div",{class:"mr-sliders"},sHi,sLo),stats,goals,say);}

/* ---------- survive: a rule for each field, and the master record it makes ---------- */
function labSurvive(Lb){const V=Lb.w,pick=V.fields.map(()=>null);const say=h("p",{class:"mr-say",role:"status"}),box=h("div",{class:"mr-rows"});
  const pic=picture(Lb,()=>({pick}));
  function draw(){box.replaceChildren(...V.fields.map((f,i)=>{const r=pick[i]==null?null:f.rules[pick[i]],win=r?r.win:null;
    return h("div",{class:"mr-row"+(r?r.ok?" ok":" no":"")},h("p",{class:"mr-item"},f.f),
      h("ul",{class:"mr-vals"},...f.vals.map((v,j)=>h("li",{class:win!=null&&(Array.isArray(win)?win.includes(j):win===j)?"win":"",style:"--b:"+(V.src[v.src]||{}).c},h("span",{class:"v"},v.v),h("span",{class:"src"},(V.src[v.src]||{}).t+(v.when?" · "+v.when:"")+(v.note?" · "+v.note:""))))),
      h("div",{class:"mr-controls mr-slot"},h("span",{class:"mr-lbl"},V.ruleL),seg(f.rules.map((r,j)=>[String(j),r.t]),pick[i]==null?null:String(pick[i]),k=>{pick[i]=+k;draw();upd(true);},f.f)),
      r?h("p",{class:"mr-why"},h("b",null,r.ok?U.right:U.wrong)," ",r.why):null);}));}
  function upd(anim){const n=pick.filter(p=>p!=null).length,good=pick.filter((p,i)=>p!=null&&V.fields[i].rules[p].ok).length;
    say.textContent=n<V.fields.length?fill(V.sayStart,{n,of:V.fields.length}):good===V.fields.length?V.sayGood:fill(V.sayFix,{n:good,of:V.fields.length});if(pic)pic.paint(anim);}
  draw();ready().then(()=>upd());return shell(Lb,pic,info(V.prompt),box,say);}

/* ---------- timeline: dated roles, and who the person is on a date ---------- */
const ymd=s=>{const [y,m,d]=s.split("-").map(Number);return y*372+(m-1)*31+(d||1)-1;};
// a span runs from the first day of its first month to the last day of its last month; an end of null is still open
const inSpan=(sp,d)=>ymd(sp[0]+(sp[0].length<8?"-01":""))<=d&&(sp[1]==null||d<=ymd(sp[1]+(sp[1].length<8?"-31":"")));
function fdate(s){const [y,m,d]=s.split("-").map(Number);return (d?d+" ":"")+U.months[m-1]+" "+y;}
function labTimeline(Lb){const V=Lb.w,[y0]=V.from.split("-").map(Number),[y1]=V.to.split("-").map(Number),N=(y1-y0)*12;let at=V.start;
  const say=h("p",{class:"mr-say",role:"status"}),open=h("p",{class:"mr-open"}),asks=h("ul",{class:"mr-checks"});
  const toIdx=s=>{const [y,m]=s.split("-").map(Number);return (y-y0)*12+m-1;},fromIdx=i=>{const y=y0+Math.floor(i/12),m=i%12+1;return y+"-"+String(m).padStart(2,"0")+"-15";};
  const opens=()=>{const d=ymd(at);return V.roles.filter(r=>r.spans.some(sp=>inSpan(sp,d))).map(r=>r.k);};
  const pic=picture(Lb,()=>({at,open:opens()}));
  const val=h("output",null,fdate(at)),inp=h("input",{type:"range",min:"0",max:String(N-1),step:"1",value:String(toIdx(at)),"aria-label":V.dateL,"aria-valuetext":fdate(at),
    oninput:e=>{at=fromIdx(+e.target.value);upd(true);}});
  const presets=h("div",{class:"mr-seg",role:"group","aria-label":V.presetL},...V.presets.map(([d,t])=>h("button",{type:"button",onclick:()=>{at=d;upd(true);}},t)));
  function upd(anim){const o=opens();inp.value=String(toIdx(at));val.textContent=fdate(at);inp.setAttribute("aria-valuetext",fdate(at));
    [...presets.children].forEach((b,i)=>b.setAttribute("aria-pressed",String(V.presets[i][0]===at)));
    open.replaceChildren(h("b",null,V.openL+" "),...(o.length?o.map(k=>{const r=V.roles.find(x=>x.k===k);return h("span",{class:"mr-chip",style:"--b:"+r.c},r.t);}):[h("span",null,V.none)]));
    const yes=a=>a.any?a.any.some(k=>o.includes(k)):a.all.every(g=>g.some(k=>o.includes(k)));
    asks.replaceChildren(...V.asks.map(a=>h("li",{class:yes(a)?"ok":"no"},a.q+" ",h("b",null,yes(a)?V.yes:V.no))));
    const hit=V.presets.find(p=>p[0]===at);say.textContent=hit&&hit[2]?hit[2]:fill(V.say,{d:fdate(at),n:o.length});if(pic)pic.paint(anim);}
  ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),h("div",{class:"mr-sliders"},h("label",{class:"mr-slider"},h("span",null,V.dateL),inp,val)),
    h("div",{class:"mr-controls"},h("span",{class:"mr-lbl"},V.presetL),presets),open,asks,say);}

/* ---------- map: each system's codes to one list, then the test that reads it ---------- */
function labMap(Lb){const V=Lb.w;let cur=0;const pick=V.lists.map(l=>l.codes.map(()=>null)),ran=V.lists.map(()=>false);
  const say=h("p",{class:"mr-say",role:"status"}),rows=h("div",{class:"mr-rows"}),log=h("pre",{class:"mr-log","aria-live":"polite"});
  const pic=picture(Lb,()=>({cur,pick:pick[cur],ran:ran[cur]}));
  const run=btn(V.run,()=>{ran[cur]=true;draw();upd(true);},"go");
  function draw(){const l=V.lists[cur];rows.replaceChildren(...l.codes.map((c,i)=>{const p=pick[cur][i],ok=ran[cur]&&p===c.ok,no=ran[cur]&&p!==c.ok;
    return h("div",{class:"mr-row"+(ok?" ok":no?" no":"")},h("p",{class:"mr-item"},h("span",{class:"mr-sys",style:"--b:"+(c.c||"#64606f")},c.sys)," ",h("code",null,c.v)),
      seg(l.rows.map(r=>[r[0],r[0]+" · "+r[1]]).concat([["",V.notList]]),p,k=>{pick[cur][i]=k;if(ran[cur]){ran[cur]=false;draw();}upd(true);},c.sys+" "+c.v),
      ran[cur]?h("p",{class:"mr-why"},h("b",null,ok?U.right:U.wrong)," ",c.why):null);}));
    log.replaceChildren(...(ran[cur]?l.codes.map((c,i)=>{const p=pick[cur][i],ok=p===c.ok;return h("span",{class:ok?"pass":"fail"},(ok?"PASS ":"FAIL ")+c.sys+": "+c.v+" → "+(p||"?")+"\n");}):[]));}
  function upd(anim){const l=V.lists[cur],n=pick[cur].filter(p=>p!=null).length,good=l.codes.filter((c,i)=>pick[cur][i]===c.ok).length;run.disabled=n<l.codes.length;
    say.textContent=ran[cur]?(good===l.codes.length?l.sayAll:fill(l.saySome,{n:good,of:l.codes.length})):(n<l.codes.length?fill(U.placed,{n,of:l.codes.length}):U.ready);if(pic)pic.paint(anim);}
  const lists=V.lists.length>1?h("div",{class:"mr-controls"},h("span",{class:"mr-lbl"},V.label),seg(V.lists.map((l,i)=>[String(i),l.name]),"0",k=>{cur=+k;draw();upd(true);},V.label)):null;
  draw();ready().then(()=>upd());return shell(Lb,pic,info(V.prompt),lists,rows,h("div",{class:"mr-controls"},run),log,say);}

const BUILD={sort:labSort,pick:labPick,steps:labSteps,compose:labCompose,test:labTest,match:labMatch,bands:labBands,survive:labSurvive,timeline:labTimeline,map:labMap};
L.BUILD=BUILD;L.PIX=PIX;L.lib={h,seg,stage,picture,shell,info,btn,fill,num,dec,tx,fit,wrap,lines,tag,card,linh,tick,cross,mark,pencil,wash,head,C,CI,OK,NO};

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
