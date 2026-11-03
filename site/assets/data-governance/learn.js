/* Learning Data: Governance principles. The labs (Take it apart) and the scenarios (Make the call) of the whole series, the prologue
   and its ten films, one page each, from one engine, as site-tools/build_series.py makes them for a series with labs and scenarios
   of its own. It is the master and reference data series' engine (assets/master-and-reference-data/learn.js), copied for this
   series and cut to the four kinds it uses, with pictures of its own. The page loads a film's bundle (off-the-shelf: the shared
   watercolour, wash.js and people.js, the series' rooms.js and its people), the words (learn.en.js or learn.es.js, which set
   window.GVL) and this file, and fills #series-labs or #series-quiz. The words cover every film of the series; the page says which
   films are on the site (data-films on its root: {number: {t, k, href, starts}}), and only their labs and scenarios show. Its
   data-store is the progress prefix. The prologue is film 0, so "all films" is ALL (-1), never 0.
   A lab is one of four kinds, described entirely by its words:
     sort      place each item in a bucket, then check: every item says why, and what goes wrong where you put it
     pick      choose one option, and see what it gets right and wrong
     steps     walk through a sequence, one step at a time
     compose   build a card from parts, such as a rule, a grant or a product's promise
   Pictures are drawn with the films' own components (wc_*, gv_*, person): a lab's or a scenario's "vis" names a function in PIX
   below, which takes its words from the lab (w) or the scenario (st). Without the bundle, the labs still work, on plain paper.
   The series' first part shows papers and people, never code, file paths or tool screens, so no lab links to the example project.
   Progress stays in this browser, under the page's data-store (or GVL.store): the labs visited (visited, ids) and the scenarios
   answered (quiz, keyed by number), as assets/learn/path.js counts them. smoke.py expects every lab's tab on the labs page
   ([role=tab][data-id]), the open one selected, one "Watch this part" link to its chapter (#t=), and the film shown on the scenarios
   page as data-film on its root.
   The results for all films, and for the last film, end with the series' last words (GVL.close), as its last film ends. */
(()=>{"use strict";
const L=window.GVL;if(!L)return;const U=L.ui;
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
// the series' last words (GVL.close), from its last film's closing chapter: under the results for all films, and for that film
function closing(sel,all){const C=L.close;if(!C||!filmOf(C.film)||(!all&&sel!==C.film))return null;const href=watchHref(C);
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
// a colour by name: one of the series' meanings (gold decides, green runs, grey can go, red has no owner, amber warns, cyan the
// technical side), a class of personal data, a side (biz, tech), or a hex
function C(k){if(Array.isArray(k))return k;if(!k)return WC_PENCIL;if(k[0]==="#")return hexRGB(k)||WC_PENCIL;
  const G=typeof GV!=="undefined"?GV:{};
  return ({gold:G.gold,green:G.green,grey:G.grey,red:G.red,amber:G.amber,cyan:WC_SIDE.tech,biz:WC_SIDE.biz,tech:WC_SIDE.tech,ink:WC_INK,muted:WC_MUTED,
    direct:typeof GV_CLASS!=="undefined"?GV_CLASS.direct:null,pseudonymous:typeof GV_CLASS!=="undefined"?GV_CLASS.pseudonymous:null,ok:OK,no:NO})[k]||WC_PENCIL;}
// text in a meaning's colour, dark enough to read on paper
const CI=k=>{const G=typeof GV!=="undefined"?GV:{};return ({gold:G.goldInk,green:G.greenInk,grey:G.greyInk,red:G.redInk,amber:G.amberInk,cyan:G.cyanInk,ok:OK,no:NO})[k]||WC_INK;};
const OK=[22,120,68],NO=[184,56,40];
// the same names as CSS colours, for the buttons that choose a bucket
const CSS={gold:"#ecaa22",green:"#28a060",grey:"#949caa",red:"#cc3e32",amber:"#ec882c",cyan:"#3d8fd9",biz:"#ecaa22",tech:"#3d8fd9",direct:"#923470",pseudonymous:"#d6a0c6"};
const css=k=>!k?null:k[0]==="#"?k:CSS[k]||null;
function tx(ctx,s,x,y,o){o=o||{};wc_T(ctx,String(s),x,y,{size:o.size||30,w:o.w||600,f:o.f,align:o.align,col:o.col||WC_INK,a:o.a});}
// words a picture had to cut, or that still overflow at the smallest size: kept in window.GVL_MISS, so checks can list them
const MISS=(window.GVL_MISS=window.GVL_MISS||[]);function miss(s){s=String(s);if(MISS.indexOf(s)<0)MISS.push(s);}
// the biggest size, from size down to min, at which s fits in maxW. A browser can draw text a little wider than another, so a word
// that still overflows at min may go down to nine tenths of it, and to nine tenths of its size in lines() and tag(), before it is cut
function fit(ctx,s,maxW,size,w,f,min){let z=size;const lo=Math.floor((min||22)*0.9);while(z>(min||22)&&tw(ctx,String(s),z,w||600,f)>maxW)z-=1;
  while(z>lo&&tw(ctx,String(s),z,w||600,f)>maxW+1)z-=1;if(tw(ctx,String(s),z,w||600,f)>maxW+1)miss(s);return z;}
function wrap(ctx,s,maxW,size,w,f){const words=String(s).split(" "),out=[];let cur="";words.forEach(wd=>{const t=cur?cur+" "+wd:wd;if(cur&&tw(ctx,t,size,w||600,f)>maxW){out.push(cur);cur=wd;}else cur=t;});if(cur)out.push(cur);return out;}
function wrapN(ctx,s,maxW,size,w,f,n,cut){const l=wrap(ctx,s,maxW,size,w,f);if(l.length>n){if(!cut)miss(s);const k=l.slice(0,n);k[n-1]=k[n-1].replace(/[ ,.;:]*$/,"")+"…";return k;}return l;}
function lines(ctx,s,x,y,maxW,o){o=o||{};let z=o.size||30;const n=o.max||9,lo=Math.floor(z*0.9);while(z>lo&&wrap(ctx,s,maxW,z,o.w,o.f).length>n)z-=1;const ls=wrapN(ctx,s,maxW,z,o.w,o.f,n,o.cut);ls.forEach((l,i)=>tx(ctx,l,x,y+i*(o.lh||z*1.28),Object.assign({},o,{size:z})));return ls.length*(o.lh||z*1.28);}
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

// a person of the series, standing, feet at y; s about 1 is a person 480 high
function who(ctx,id,x,y,s,o){if(!id||typeof PEOPLE==="undefined"||!PEOPLE[id])return;o=o||{};person(ctx,id,x,y,s,{pose:o.pose||"stand",expr:o.expr||"calm",t:0,flip:o.flip});}
// a row's mark: ok a tick, no a cross, warn an amber dot, "" nothing
function rowMark(ctx,x,y,m,k){if(m==="ok")tick(ctx,x,y,26,k);else if(m==="no")cross(ctx,x,y,22,k);else if(m==="warn")wash(ctx,x-12,y-12,26,26,"amber",0.85,61);}

/* ---------- the pictures ---------- */
const PIX={
  /* sort: a column for each bucket, its name washed in its colour, and what's been put in it; the last one placed drops in */
  // more than four buckets take two rows
  shelves(ctx,w,hh,st,Lb,k){const V=Lb.w,cols=V.buckets,n=cols.length,rows=n>4?2:1,per=Math.ceil(n/rows),cw=(w-60)/per,rh=(hh-24)/rows;
    cols.forEach(([key,label,hex,sub,id],i)=>{const x=30+(i%per)*cw,cx=x+cw/2,y0=Math.floor(i/per)*rh,hh2=y0+rh+(rows>1?12:24);card(ctx,x+8,y0+22,cw-16,rh-(rows>1?12:20),{kind:"sheet",seed:3+i});
      wash(ctx,x+24,y0+38,cw-48,58,hex||Lb.c,0.45,11+i);tx(ctx,label,cx,y0+78,{size:fit(ctx,label,cw-60,30,800,null,20),w:800,align:"center",col:WC_DARK});
      let ey=y0+112;if(sub){tx(ctx,sub,cx,ey+16,{size:fit(ctx,sub,cw-50,24,600,null,17),align:"center",col:WC_MUTED});ey+=34;}
      if(id){who(ctx,id,cx,ey+190,0.36);ey+=200;}
      pencil(ctx,[[x+30,ey+12],[x+cw-30,ey+12]],{a:0.35,lw:2,seed:7+i});
      const mine=V.items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick[j]===key);let y=ey+52;
      const cap=Math.max(1,Math.floor((hh2-ey-70)/48));
      mine.slice(0,cap).forEach(([it,j])=>{const drop=j===st.last?1-k:0,s=short(it);withA(ctx,1-drop*0.8,()=>{const tw0=tag(ctx,x+26,y-drop*30,s,{size:fit(ctx,s,cw-136,24,700,null,17),maxW:cw-96});
        if(st.checked)mark(ctx,x+26+tw0+22,y-4,28,it.b===key,k);});y+=48;});
      if(mine.length>cap)tx(ctx,"+"+(mine.length-cap),cx,y,{size:24,align:"center",col:WC_MUTED});});},
  /* pick: who chooses, the options as cards (the chosen one washed), and what the choice gets right and wrong */
  options(ctx,w,hh,st,Lb,k){const V=Lb.w,P=V.pic,ops=V.opts,n=ops.length,x0=P.who?250:30,ow=380,top=40,gap=16,oh=Math.min(110,(hh-top*2-gap*(n-1))/n);
    if(P.who)who(ctx,P.who,140,hh-60,0.92,{pose:P.pose||"listen"});
    ops.forEach(([key,label],i)=>{const y=top+i*(oh+gap),on=key===st.pick,s=P.short&&P.short[i]||label;
      withA(ctx,on?1:0.55,()=>{card(ctx,x0,y,ow,oh,{kind:"card",wash:on?Lb.c:null,washA:0.3,seed:20+i});
        lines(ctx,s,x0+26,y+oh/2-(wrap(ctx,s,ow-52,26,700).length>1?6:-10),ow-52,{size:26,w:700,max:2,col:WC_DARK});});});
    const rx=x0+ow+40,rw=w-rx-30,r=V.res[st.pick];card(ctx,rx,top,rw,hh-top*2,{kind:"sheet",seed:30});
    tx(ctx,P.checks,rx+28,top+52,{size:fit(ctx,P.checks,rw-56,28,800,null,20),w:800,col:WC_DARK});
    const rh=Math.min(78,(hh-top*2-100)/P.rows.length);
    P.rows.forEach((t,i)=>{const y=top+110+i*rh,m=r[i]===1?"ok":r[i]===0.5?"warn":"no";rowMark(ctx,rx+42,y-8,m,k);
      lines(ctx,t,rx+78,y,rw-104,{size:24,w:600,max:2,col:m==="no"?WC_MUTED:WC_INK});});},
  /* steps: each step a card, numbered; the one you're on washed, the ones done ticked, the ones to come faint */
  path(ctx,w,hh,st,Lb,k){const V=Lb.w,S=V.steps,n=S.length,rows=n>4?2:1,per=Math.ceil(n/rows),gap=18,cw=(w-60-gap*(per-1))/per,ch=(hh-60-gap*(rows-1))/rows;
    S.forEach((s,i)=>{const r=Math.floor(i/per),c=i%per,x=30+c*(cw+gap),y=30+r*(ch+gap),on=i===st.step,done=i<st.step,lab=s.s||s.t;
      withA(ctx,on?1:done?0.9:0.45,()=>{card(ctx,x,y,cw,ch,{kind:on?"sheet":"card",wash:on?Lb.c:done?"green":null,washA:on?0.3:0.12,seed:40+i});
        wash(ctx,x+20,y+20,46,46,on?Lb.c:done?"green":"grey",0.6,50+i);tx(ctx,String(i+1),x+43,y+54,{size:28,w:800,align:"center",col:WC_DARK});
        if(done)tick(ctx,x+cw-36,y+44,28,1);
        const tw2=cw-40-(s.who&&on?110:0),th=lines(ctx,lab,x+20,y+112,tw2,{size:26,w:700,max:2,col:WC_DARK});
        // the step you're on says what happens, as far as its card has room
        if(on&&s.d){const n=Math.floor((ch-130-th)/28);if(n>0)lines(ctx,s.d,x+20,y+112+th+12,tw2,{size:21,w:600,max:n,col:WC_INK,cut:true});}
        if(s.who&&on)who(ctx,s.who,x+cw-60,y+ch-14,0.34);});});},
  /* compose: a card filled in slot by slot, each value marked, and its stamp once every slot is right */
  card(ctx,w,hh,st,Lb,k){const V=Lb.w,P=V.pic,x0=P.who?280:60,cw=w-x0-50,top=36;
    if(P.who)who(ctx,P.who,150,hh-50,0.9,{pose:P.pose||"hold"});
    card(ctx,x0,top,cw,hh-top*2,{kind:"sheet",seed:70});wash(ctx,x0+28,top+26,Math.min(cw-56,tw(ctx,P.kicker,24,800)+44),44,Lb.c,0.4,71);
    tx(ctx,P.kicker,x0+50,top+58,{size:24,w:800,col:WC_DARK});tx(ctx,P.title,x0+30,top+118,{size:fit(ctx,P.title,cw-60,34,800,null,22),w:800,col:WC_DARK});
    const rh=(hh-top*2-170)/V.slots.length,lw=Math.min(240,cw*0.3);
    V.slots.forEach((sl,i)=>{const y=top+176+i*rh,p=st.pick[i],o=p==null?null:sl.opts[p];
      pencil(ctx,[[x0+28,y+rh-18],[x0+cw-28,y+rh-18]],{a:0.25,lw:1.6,seed:72+i});
      tx(ctx,sl.label,x0+30,y+30,{size:fit(ctx,sl.label,lw-10,24,700,null,17),w:700,col:WC_MUTED});
      if(o){lines(ctx,o.s||o.t,x0+30+lw,y+30,cw-lw-110,{size:24,w:600,max:Math.max(1,Math.floor((rh-20)/31)),col:o.ok?WC_INK:CI("no")});rowMark(ctx,x0+cw-44,y+22,o.ok?"ok":"no",k);}
      else tx(ctx,"…",x0+30+lw,y+30,{size:26,col:WC_MUTED});});
    const good=st.pick.every((p,i)=>p!=null&&V.slots[i].opts[p].ok);
    if(good&&P.stamp&&typeof gv_stamp==="function")gv_stamp(ctx,x0+cw-150,top+100,P.stamp,k,{size:30,col:CI("green"),rot:-0.08});},
  /* a scenario: who's in it, and the paper in front of them: a kicker, its rows (each with a mark), and a stamp */
  scene(ctx,w,hh,st,Lq,k){const id=st.who,x0=id?330:50,pw=w-x0-40,top=40,ph=hh-top*2;
    if(id)who(ctx,id,175,hh-40,1.0,{pose:st.pose||"listen"});
    card(ctx,x0,top,pw,ph,{kind:"sheet",seed:80});
    if(st.kicker){wash(ctx,x0+26,top+26,Math.min(pw-52,tw(ctx,st.kicker,24,800)+44),44,st.c||Lq.c||"gold",0.4,81);tx(ctx,st.kicker,x0+48,top+58,{size:fit(ctx,st.kicker,pw-96,24,800,null,17),w:800,col:WC_DARK});}
    let y=top+(st.title?120:110);if(st.title){lines(ctx,st.title,x0+30,y,pw-60,{size:32,w:800,max:2,col:WC_DARK});y+=st.title&&wrap(ctx,st.title,pw-60,32,800).length>1?96:56;}
    const rows=st.rows||[],rh=Math.min(92,(top+ph-40-y)/Math.max(1,rows.length));
    // the label column grows to its widest label (up to half the sheet), so a browser that draws text a little wider cuts nothing
    const lw=Math.max(pw*0.36,Math.min(pw*0.5,Math.max(0,...rows.map(r=>Array.isArray(r)&&r[1]!=null&&r[1]!==""?tw(ctx,String(r[0]),22,700)+40:0))));
    rows.forEach((r,i)=>{const [a,b0,m]=Array.isArray(r)?r:[r,null,null],b=b0===""?null:b0,yy=y+i*rh;pencil(ctx,[[x0+26,yy+rh-26],[x0+pw-26,yy+rh-26]],{a:0.22,lw:1.6,seed:82+i});
      const mx=m?58:0;
      if(b!=null){tx(ctx,a,x0+30,yy+22,{size:fit(ctx,a,lw-16,22,700,null,16),w:700,col:WC_MUTED});lines(ctx,b,x0+30+lw,yy+22,pw-lw-60-mx,{size:24,w:600,max:Math.max(1,Math.floor((rh-24)/30)),col:m==="no"?CI("no"):WC_INK});}
      else lines(ctx,a,x0+30,yy+22,pw-60-mx,{size:24,w:600,max:Math.max(1,Math.floor((rh-24)/30)),col:m==="no"?CI("no"):WC_INK});
      if(m)rowMark(ctx,x0+pw-46,yy+14,m,1);});
    if(st.stamp&&typeof gv_stamp==="function")gv_stamp(ctx,x0+pw-170,top+ph-70,st.stamp[0],1,{size:28,col:CI(st.stamp[1]||"red"),rot:-0.07});},
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
      seg(V.buckets.map(b=>[b[0],b[1],css(b[2])]),pick[i],k=>{pick[i]=k;last=i;if(checked){checked=false;draw();}upd(true);},it.t),
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

const BUILD={sort:labSort,pick:labPick,steps:labSteps,compose:labCompose};
L.BUILD=BUILD;L.PIX=PIX;L.lib={h,seg,stage,picture,shell,info,btn,fill,num,tx,fit,wrap,lines,tag,card,tick,cross,mark,pencil,wash,head,who,C,CI,OK,NO};

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
if(quizApp&&QS.length){quizApp.textContent="";const ans=get("quiz",{}),ALL=-1;let sel=ALL,list=QS,cur=0;
  const films=h("div",{class:"mr-films",role:"group","aria-label":U.filmsLabel}),bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),card=h("div");
  bar.append(dots,score);quizApp.append(films,h("div",{class:"quiz"},bar,card));
  const labName=id=>(labOf(id)||{name:""}).name,labHref=id=>"../labs/#"+id,A=q=>ans[q.n];
  function paintFilms(){const fs=FILMS.filter(f=>QS.some(q=>q.film===f.n));films.replaceChildren(...[ALL,...fs.map(f=>f.n)].map(n=>{const one=n!==ALL,qs=one?QS.filter(q=>q.film===n):QS,a=qs.filter(A).length,f=filmOf(n);
    return h("button",{type:"button","aria-pressed":String(n===sel),onclick:()=>{pick(n);}},one?h("i",null,String(n)):null,h("span",null,one?f.title:U.allFilms),h("small",null,fill(U.done,{n:a,of:qs.length})));}));}
  function pick(n,keep){sel=n;const one=n!==ALL;list=one?QS.filter(q=>q.film===n):QS;quizApp.dataset.film=one?String(n):"all";if(history.replaceState)history.replaceState(null,"","#"+(one?"film-"+n:"all"));
    paintFilms();const first=list.findIndex(q=>!A(q));if(first<0)results();else{cur=first;render();}}
  function paintBar(){dots.replaceChildren(...list.map((q,i)=>h("button",{type:"button",class:A(q)?(A(q).ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1),onclick:()=>{cur=i;render();}},String(i+1))));
    const as=list.filter(A),ok=as.filter(q=>A(q).ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+as.length+" "+U.answered+" · "+(list.length-as.length)+" "+U.toGo));}
  function done(q,ok,pk){ans[q.n]={ok,pick:pk};set("quiz",ans);paintBar();paintFilms();}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why),repoLinks(q));
  function foot(q){const last=cur===list.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:labHref(q.lab)},U.explore+" "+labName(q.lab)),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results();else{cur+=1;render();}}},last?U.results:U.nextQ));}
  function render(){paintBar();const q=list[cur],f=PIX[q.vis],body=h("div",{class:"qbody"}),out=h("div"),prev=A(q),Lq=labOf(q.lab)||{};
    const vis=stage(1000,760,c=>{if(f)f(c,1000,760,q.st||{},Lq,1);},q.alt||q.title);
    body.append(h("p",{class:"qtag",style:"--c:"+(Lq.c||"#0e9692")},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+list.length+(sel!==ALL?"":" · "+filmOf(q.film).title)),h("h3",null,q.title),h("p",{class:"qsit"},q.sit));
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
  function results(){paintBar();const ok=list.filter(q=>A(q)&&A(q).ok).length,n=list.length,band=((sel!==ALL&&filmOf(sel).done)||L.done)[ok>=n?0:ok>=n-2?1:ok>=n/2?2:3];
    const by={};list.forEach(q=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(A(q)&&A(q).ok)by[k].ok++;});
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/n*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",null,band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:labHref(k),class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+(labOf(k)||{c:"#a0b2cd"}).c},h("i"),labName(k)+" · "+by[k].ok+"/"+by[k].n))),
      h("button",{type:"button",class:"btn",onclick:()=>{list.forEach(q=>delete ans[q.n]);set("quiz",ans);paintFilms();cur=0;render();}},U.again)),closing(sel===ALL?0:sel,sel===ALL)));}
  const fromHash=()=>{const hs=(location.hash||"").slice(1),fm=/^film-(\d+)$/.exec(hs),todo=QS.find(q=>!A(q));return fm&&QS.some(q=>q.film===+fm[1])?+fm[1]:hs==="all"?ALL:todo?todo.film:ALL;};
  pick(fromHash());window.addEventListener("hashchange",()=>{const n=fromHash();if(n!==sel)pick(n);});}
})();
