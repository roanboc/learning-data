/* Learning Data: What an agent is. The labs (Take it apart) and the scenarios (Make the call) of the whole series, its ten films,
   one page each, from one engine, as site-tools/build_series.py makes them for a series with labs and scenarios of its own. It is
   Governance principles' engine (assets/data-governance/learn.js), copied for this series, with its pictures drawn in the films'
   look (the white lab: matte cards, the agent's colours, the people) and two kinds of its own. The page loads a film's bundle
   (many-agents: the module's kit, cards, agent and people), the words (learn.en.js or learn.es.js, which set window.AGL) and this
   file, and fills #series-labs or #series-quiz. The words cover every film of the series; the page says which films are on the site
   (data-films on its root: {number: {t, k, href, starts}}), and only their labs and scenarios show. Its data-store is the progress
   prefix.
   A lab is one of six kinds, described entirely by its words:
     sort      place each item in a bucket, then check: every item says why, and what goes wrong where you put it
     pick      choose one option, and see what it gets right and wrong
     steps     walk through a sequence, one step at a time
     compose   build a card from parts, such as a question, a mandate or a night's rules
     wheel     a model's next word: slices for each word, a temperature that reshapes them, and spins that draw one
     swarm     emergence: ants choosing between two bridges by the scent others left, with sliders for the crowd and the scent;
               it runs only while you watch (on screen, the tab open, and for a minute at most before it pauses), at 30 frames a
               second, and draws nothing while paused. Under it, a note on the other worlds at Learning Systems (w.more)
   Pictures are drawn with the films' own components (ag_*): a lab's or a scenario's "vis" names a function in PIX below, which takes
   its words from the lab (w) or the scenario (st). Without the bundle, the labs still work, on a plain card.
   The series shows no code, so no lab links to the example project.
   Progress stays in this browser, under the page's data-store (or AGL.store): the labs visited (visited, ids) and the scenarios
   answered (quiz, keyed by number), as assets/learn/path.js counts them. smoke.py expects every lab's tab on the labs page
   ([role=tab][data-id]), the open one selected, one "Watch this part" link to its chapter (#t=), and the film shown on the scenarios
   page as data-film on its root.
   The results for all films, and for the last film, end with the series' last words (AGL.close), as its last film ends. */
(()=>{"use strict";
const L=window.AGL;if(!L)return;const U=L.ui;
const ROOT=document.getElementById("series-labs")||document.getElementById("series-quiz"),P=(ROOT&&ROOT.dataset.store)||L.store;
const get=(k,d)=>{try{const v=localStorage.getItem(P+":"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}};
const set=(k,v)=>{try{localStorage.setItem(P+":"+k,JSON.stringify(v));}catch(e){}
  // path.js repaints the stepper on "storage", which only other tabs fire: fire it here too
  try{window.dispatchEvent(new StorageEvent("storage",{key:P+":"+k}));}catch(e){}};
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const k in attrs||{}){const v=attrs[k];if(v==null||v===false)continue;if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else if(k==="html")e.innerHTML=v;else e.setAttribute(k,v===true?"":v);}
  kids.flat().forEach(c=>{if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(c));});return e;}
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
const ready=()=>window.FILM&&FILM.ready?FILM.ready:Promise.resolve();
const RM=(()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}})();
const pct=v=>Math.round(v*100)+"%";
const LERP=(a,b,u)=>a+(b-a)*u;   // the bundle has lerp too, but the swarm builds its bridges before it may have loaded

/* ---------- the films: the words name all ten; the page says which are on the site ---------- */
const PUB=(()=>{try{const d=ROOT&&ROOT.dataset.films;if(d)return JSON.parse(d);}catch(e){}return null;})();
const FILMS=L.films.filter(f=>!PUB||PUB[f.n]).map(f=>{const p=PUB?PUB[f.n]:{};
  return Object.assign({},f,{title:p.t||f.title,key:p.k||f.key,href:p.href||"../"+(p.k||f.key)+"/",starts:p.starts||{},coming:!!p.coming});});
const filmOf=n=>FILMS.find(f=>f.n===n);
const LABS=L.labs.filter(x=>filmOf(x.film)),QS=L.qs.filter(q=>filmOf(q.film));
const labOf=id=>LABS.find(x=>x.id===id);
function watchHref(Lb){const f=filmOf(Lb.film)||{},t=Lb.chapter?f.starts[Lb.chapter]:null;return f.coming?null:f.href+(t!=null?"#t="+Math.ceil(t):"");}
function closing(sel,all){const C=L.close;if(!C||!filmOf(C.film)||(!all&&sel!==C.film))return null;const href=watchHref(C);
  return h("section",{class:"mr-close","aria-labelledby":"mr-close-h"},h("h3",{id:"mr-close-h"},C.title),h("p",null,C.lead),
    h("ul",null,...C.parts.map(([b,t])=>h("li",null,h("b",null,b+": "),t))),h("p",null,C.gov),
    h("p",{class:"mr-next"},h("b",null,U.next+" "),C.next),href?h("a",{class:"btn",href},U.watch):null);}

/* ---------- the picture: the lab's pale wall, the films' cards, and a short move when something changes ---------- */
const G=()=>typeof ag_box==="function"&&typeof ag_T==="function";
function wall(ctx,vw,vh){const g=ctx.createLinearGradient(0,0,0,vh);g.addColorStop(0,"#F2F0EC");g.addColorStop(1,"#E3E0DA");ctx.fillStyle=g;ctx.fillRect(0,0,vw,vh);
  // the window's light, from the right, as in the films
  const r=ctx.createRadialGradient(vw*0.95,vh*0.1,10,vw*0.95,vh*0.1,vw*0.7);r.addColorStop(0,"rgba(255,253,246,0.55)");r.addColorStop(1,"rgba(255,253,246,0)");ctx.fillStyle=r;ctx.fillRect(0,0,vw,vh);}
function stage(vw,vh,draw,label){const cv=h("canvas",{role:"img","aria-label":label||""});let raf=0;
  function frame(k){const d=Math.min(window.devicePixelRatio||1,2),cw=Math.max(300,Math.round((cv.clientWidth||vw)*d));if(cv.width!==cw){cv.width=cw;cv.height=Math.round(cw*vh/vw);}
    const ctx=cv.getContext("2d"),s=cv.width/vw;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.setTransform(s,0,0,s,0,0);
    wall(ctx,vw,vh);if(G()){try{draw(ctx,k);}catch(e){if(window.console)console.warn(e);}}}
  // k runs from 0 to 1 over 0.7 s after a change, so ticks draw on and things settle; with reduced motion, it's 1 at once
  function paint(anim){cancelAnimationFrame(raf);if(!anim||RM){frame(1);return;}const t0=performance.now();
    const tick=()=>{const k=Math.min(1,(performance.now()-t0)/700);frame(k);if(k<1)raf=requestAnimationFrame(tick);};tick();}
  cv.style.aspectRatio=vw+"/"+vh;if("ResizeObserver" in window)new ResizeObserver(()=>frame(1)).observe(cv);return{el:cv,paint,cv};}

/* ---------- drawing helpers, on the films' components ---------- */
const hexRGB=x=>{const m=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(x||"");return m?[parseInt(m[1],16),parseInt(m[2],16),parseInt(m[3],16)]:null;};
const OK=[50,116,80],NO=[170,56,40];
// a colour by name: one of the module's meanings (blue tools, violet the model, orange data, green a pass, amber a fail or a loop),
// red for wrong, ink, muted, or a hex
function C(k){if(Array.isArray(k))return k;const A=typeof AG!=="undefined"?AG:{};if(!k)return A.mut||[86,92,100];if(k[0]==="#")return hexRGB(k)||A.ink;
  return ({blue:A.blue,violet:A.violet,orange:A.orange,green:A.green,amber:A.amber,red:NO,ok:OK,no:NO,ink:A.ink,muted:A.mut})[k]||A.mut;}
const css=k=>!k?null:k[0]==="#"?k:({blue:"#266684",violet:"#584ec4",orange:"#ba5e36",green:"#327450",amber:"#9c6412",red:"#aa3828"})[k]||null;
const INK=()=>C("ink"),MUT=()=>C("muted");
const tw=(ctx,s,size,w)=>ag_tw(ctx,String(s),{w:w||600,size});
function tx(ctx,s,x,y,o){o=o||{};ag_T(ctx,String(s),x,y,{size:o.size||28,w:o.w||600,align:o.align,col:o.col||INK(),a:o.a,ls:o.ls});}
// words a picture had to cut, or that still overflow at the smallest size: kept in window.AGL_MISS, so checks can list them
const MISS=(window.AGL_MISS=window.AGL_MISS||[]);function miss(s){s=String(s);if(MISS.indexOf(s)<0)MISS.push(s);}
// the biggest size, from size down to min, at which s fits in maxW (down to nine tenths of min, as a browser may draw wider)
function fit(ctx,s,maxW,size,w,min){let z=size;const lo=Math.floor((min||22)*0.9);while(z>(min||22)&&tw(ctx,s,z,w)>maxW)z-=1;
  while(z>lo&&tw(ctx,s,z,w)>maxW+1)z-=1;if(tw(ctx,s,z,w)>maxW+1)miss(s);return z;}
function wrap(ctx,s,maxW,size,w){return ag_wrap(ctx,String(s),maxW,{w:w||600,size});}
function wrapN(ctx,s,maxW,size,w,n,cut){const l=wrap(ctx,s,maxW,size,w);if(l.length>n){if(!cut)miss(s);const k=l.slice(0,n);k[n-1]=k[n-1].replace(/[ ,.;:]*$/,"")+"…";return k;}return l;}
function lines(ctx,s,x,y,maxW,o){o=o||{};let z=o.size||28;const n=o.max||9,lo=Math.floor(z*0.9);while(z>lo&&wrap(ctx,s,maxW,z,o.w).length>n)z-=1;
  const ls=wrapN(ctx,s,maxW,z,o.w,n,o.cut);ls.forEach((l,i)=>tx(ctx,l,x,y+i*(o.lh||z*1.28),Object.assign({},o,{size:z})));return ls.length*(o.lh||z*1.28);}
function card(ctx,x,y,w,hh,o){o=o||{};ag_box(ctx,x,y,w,hh,o.r==null?20:o.r,{edge:o.edge?C(o.edge):null,edgeA:o.edgeA,lw:o.lw,a:o.a});}
// a small tag: a rounded card that fits its words; y is its middle; returns its width
function tag(ctx,x,y,s,o){o=o||{};let size=o.size||26,t=String(s);if(o.maxW){const lo=Math.floor(size*0.9);while(size>lo&&tw(ctx,t,size,700)+36>o.maxW)size-=1;
    while(t.length>3&&tw(ctx,t,size,700)+36>o.maxW)t=t.slice(0,-2);if(t!==String(s)){t=t.replace(/\s+$/,"")+"…";miss(s);}}
  const w=tw(ctx,t,size,700)+36,hh=size+22;card(ctx,x,y-hh/2,w,hh,{r:hh/2,edge:o.edge,edgeA:0.6,lw:2});tx(ctx,t,x+18,y+size*0.36,{size,w:700,col:o.col});return w;}
function tick(ctx,x,y,s,k){ag_tick(ctx,x,y,s*Math.max(0.01,k==null?1:k),rgba(OK,1),4);}
function cross(ctx,x,y,s,k){const r=s*0.42*(k==null?1:k);ctx.save();ctx.strokeStyle=rgba(NO,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-r,y-r);ctx.lineTo(x+r,y+r);ctx.moveTo(x+r,y-r);ctx.lineTo(x-r,y+r);ctx.stroke();ctx.restore();}
function dot(ctx,x,y,r,col,a){ctx.save();ctx.globalAlpha*=a==null?1:a;ctx.fillStyle=rgba(C(col),1);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore();}
function rowMark(ctx,x,y,m,k){if(m==="ok")tick(ctx,x,y,26,k);else if(m==="no")cross(ctx,x,y,24,k);else if(m==="warn")ag_warn(ctx,x,y,28,rgba(C("amber"),1));}
function withAlpha(ctx,a,f){ctx.save();ctx.globalAlpha*=a;f();ctx.restore();}
// a stamp: a pill with a tick, in green, tilted a little
function stamp(ctx,x,y,s,col,k){ctx.save();ctx.translate(x,y);ctx.rotate(-0.06);ctx.globalAlpha*=k==null?1:k;ag_pill(ctx,0,0,String(s),{col:C(col||"green"),icon:"tick",size:28});ctx.restore();}
// a person of the series, from the waist up, the neck at (x, y); they end flat 504·s below it, at or under the picture's foot
function who(ctx,id,x,hh,s,o){if(!id||typeof ag_person!=="function"||typeof AG_CAST==="undefined"||!AG_CAST[id])return;o=o||{};
  ag_person(ctx,id,x,hh-500*s,s,{t:0,flip:o.flip,pose:o.pose,hold:o.hold});}
const short=it=>it.s||it.t;

/* ---------- the pictures ---------- */
const PIX={
  /* sort: a card for each bucket, its name in its colour, and what's been put in it; the last one placed drops in */
  shelves(ctx,w,hh,st,Lb,k){const V=Lb.w,cols=V.buckets,n=cols.length,rows=n>3?2:1,per=Math.ceil(n/rows),cw=(w-48)/per,rh=(hh-24)/rows;
    cols.forEach(([key,label,hex,sub],i)=>{const x=24+(i%per)*cw,cx=x+cw/2,y0=12+Math.floor(i/per)*rh,ch=rh-16;card(ctx,x+8,y0+8,cw-16,ch,{edge:hex||Lb.c,edgeA:0.5});
      tx(ctx,String(label).toUpperCase(),cx,y0+54,{size:fit(ctx,String(label).toUpperCase(),cw-70,28,700,20),w:700,align:"center",col:C(hex||Lb.c),ls:2});
      let ey=y0+62;if(sub){tx(ctx,sub,cx,ey+30,{size:fit(ctx,sub,cw-60,24,600,18),align:"center",col:MUT()});ey+=40;}
      ctx.save();ctx.strokeStyle="rgba(60,50,40,0.16)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+30,ey+14);ctx.lineTo(x+cw-30,ey+14);ctx.stroke();ctx.restore();
      const mine=V.items.map((it,j)=>[it,j]).filter(([it,j])=>st.pick[j]===key);let y=ey+50;const cap=Math.max(1,Math.floor((y0+ch-y+12)/50));
      mine.slice(0,cap).forEach(([it,j])=>{const drop=j===st.last?1-k:0,s=short(it);withAlpha(ctx,1-drop*0.8,()=>{const tw0=tag(ctx,x+28,y-drop*30,s,{size:fit(ctx,s,cw-130,24,700,17),maxW:cw-96});
        if(st.checked)rowMark(ctx,x+28+tw0+24,y,it.b===key?"ok":"no",k);});y+=50;});
      if(mine.length>cap)tx(ctx,"+"+(mine.length-cap),cx,y,{size:24,align:"center",col:MUT()});});},
  /* pick: who chooses, the options as cards (the chosen one lit), and what the choice gets right and wrong */
  options(ctx,w,hh,st,Lb,k){const V=Lb.w,Pc=V.pic,ops=V.opts,n=ops.length,x0=Pc.who?290:30,ow=360,top=36,gap=16,oh=Math.min(110,(hh-top*2-gap*(n-1))/n);
    if(Pc.who)who(ctx,Pc.who,150,hh,0.6);
    ops.forEach(([key,label],i)=>{const y=top+i*(oh+gap),on=key===st.pick,s=Pc.short&&Pc.short[i]||label;
      withAlpha(ctx,on?1:0.6,()=>{card(ctx,x0,y,ow,oh,{edge:on?Lb.c:null,lw:3});
        lines(ctx,s,x0+24,y+oh/2-(wrap(ctx,s,ow-48,26,700).length>1?6:-10),ow-48,{size:26,w:700,max:2});});});
    const rx=x0+ow+32,rw=w-rx-24,r=V.res[st.pick];card(ctx,rx,top,rw,hh-top*2);
    tx(ctx,String(Pc.checks).toUpperCase(),rx+26,top+52,{size:fit(ctx,String(Pc.checks).toUpperCase(),rw-52,26,700,18),w:700,col:C(Lb.c),ls:2});
    const rh=Math.min(84,(hh-top*2-96)/Pc.rows.length);
    Pc.rows.forEach((t,i)=>{const y=top+104+i*rh,m=r[i]===1?"ok":r[i]===0.5?"warn":"no";rowMark(ctx,rx+40,y-8,m,k);
      lines(ctx,t,rx+76,y,rw-100,{size:24,w:600,max:2,col:m==="no"?MUT():INK()});});},
  /* steps: each step a card, numbered; the one you're on lit, the ones done ticked, the ones to come faint */
  path(ctx,w,hh,st,Lb,k){const V=Lb.w,S=V.steps,n=S.length,rows=n>4?2:1,per=Math.ceil(n/rows),gap=18,cw=(w-48-gap*(per-1))/per,ch=(hh-48-gap*(rows-1))/rows;
    S.forEach((s,i)=>{const r=Math.floor(i/per),c=i%per,x=24+c*(cw+gap),y=24+r*(ch+gap),on=i===st.step,done=i<st.step,lab=s.s||s.t;
      withAlpha(ctx,on?1:done?0.92:0.5,()=>{card(ctx,x,y,cw,ch,{edge:on?Lb.c:done?"green":null,lw:3,edgeA:on?0.9:0.5});
        dot(ctx,x+42,y+42,22,on?Lb.c:done?"green":"muted",on?0.9:0.55);tx(ctx,String(i+1),x+42,y+52,{size:28,w:800,align:"center",col:[255,255,255]});
        if(done)tick(ctx,x+cw-36,y+42,28,1);
        const tw2=cw-36-(s.who&&on?120:0),th=lines(ctx,lab,x+20,y+104,tw2,{size:26,w:700,max:2});
        if(on&&s.d){const m=Math.floor((ch-124-th)/28);if(m>0)lines(ctx,s.d,x+20,y+104+th+12,tw2,{size:21,w:600,max:m,cut:true,col:MUT()});}});
      if(s.who&&on){ctx.save();ctx.beginPath();ctx.rect(x,y,cw,ch);ctx.clip();who(ctx,s.who,x+cw-64,y+ch+40,0.3);ctx.restore();}});},
  /* compose: a card filled in slot by slot, each part marked, and its stamp once every part is right */
  card(ctx,w,hh,st,Lb,k){const V=Lb.w,Pc=V.pic,x0=Pc.who?300:40,cw=w-x0-36,top=30;
    if(Pc.who)who(ctx,Pc.who,160,hh,0.62);
    card(ctx,x0,top,cw,hh-top*2,{edge:Lb.c,edgeA:0.45});
    tx(ctx,String(Pc.kicker).toUpperCase(),x0+30,top+56,{size:26,w:700,col:C(Lb.c),ls:3});tx(ctx,Pc.title,x0+30,top+108,{size:fit(ctx,Pc.title,cw-60,34,800,22),w:800});
    const rh=(hh-top*2-150)/V.slots.length,lw=Math.min(220,cw*0.28);
    V.slots.forEach((sl,i)=>{const y=top+146+i*rh,p=st.pick[i],o=p==null?null:sl.opts[p];
      ctx.save();ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0+28,y+rh-16);ctx.lineTo(x0+cw-28,y+rh-16);ctx.stroke();ctx.restore();
      tx(ctx,sl.label,x0+30,y+30,{size:fit(ctx,sl.label,lw-12,24,700,17),w:700,col:MUT()});
      if(o){lines(ctx,o.s||o.t,x0+30+lw,y+30,cw-lw-110,{size:24,w:600,max:Math.max(1,Math.floor((rh-20)/31)),col:o.ok?INK():NO});rowMark(ctx,x0+cw-46,y+22,o.ok?"ok":"no",k);}
      else tx(ctx,"…",x0+30+lw,y+30,{size:26,col:MUT()});});
    const good=st.pick.every((p,i)=>p!=null&&V.slots[i].opts[p].ok);
    if(good&&Pc.stamp)stamp(ctx,x0+cw-140,top+52,Pc.stamp,"green",k);},
  /* a scenario: who's in it, and the card in front of them: a kicker, its rows (each with a mark), and a stamp */
  scene(ctx,w,hh,st,Lq,k){const id=st.who,agent=st.agent,x0=id||agent?320:40,pw=w-x0-36,top=36,ph=hh-top*2;
    if(id)who(ctx,id,165,hh,0.66);
    else if(agent&&typeof ag_model==="function")ag_model(ctx,165,hh*0.5,92,{core:1,think:0.4,t:1});
    card(ctx,x0,top,pw,ph,{edge:st.c||Lq.c,edgeA:0.45});
    if(st.kicker)tx(ctx,String(st.kicker).toUpperCase(),x0+28,top+58,{size:fit(ctx,String(st.kicker).toUpperCase(),pw-56,26,700,18),w:700,col:C(st.c||Lq.c||"violet"),ls:2});
    let y=top+(st.kicker?110:74);if(st.title){const n=lines(ctx,st.title,x0+28,y,pw-56,{size:36,w:800,max:2});y+=n+16;}
    const rows=st.rows||[],rh=Math.min(124,(top+ph-36-y)/Math.max(1,rows.length));
    const lw=Math.max(pw*0.34,Math.min(pw*0.5,Math.max(0,...rows.map(r=>Array.isArray(r)&&r[1]!=null&&r[1]!==""?tw(ctx,r[0],24,700)+40:0))));
    rows.forEach((r,i)=>{const [a,b0,m]=Array.isArray(r)?r:[r,null,null],b=b0===""?null:b0,yy=y+i*rh;
      ctx.save();ctx.strokeStyle="rgba(60,50,40,0.13)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0+26,yy+rh-26);ctx.lineTo(x0+pw-26,yy+rh-26);ctx.stroke();ctx.restore();
      const mx=m?58:0,mm=Math.max(1,Math.floor((rh-28)/35));
      if(b!=null){tx(ctx,a,x0+28,yy+26,{size:fit(ctx,a,lw-16,24,700,18),w:700,col:MUT()});lines(ctx,b,x0+28+lw,yy+26,pw-lw-56-mx,{size:28,w:600,max:mm,col:m==="no"?NO:INK()});}
      else lines(ctx,a,x0+28,yy+26,pw-56-mx,{size:28,w:600,max:mm,col:m==="no"?NO:INK()});
      if(m)rowMark(ctx,x0+pw-46,yy+16,m,1);});
    if(st.stamp)stamp(ctx,x0+pw-150,top+ph-50,st.stamp[0],st.stamp[1]||"green",1);},
};

/* ---------- the lab's parts ---------- */
function seg(opts,cur,on,label){const s=h("div",{class:"mr-seg",role:"group","aria-label":label||""});
  opts.forEach(([k,t,c])=>s.append(h("button",{type:"button","aria-pressed":String(k===cur),"data-k":k,style:c?"--b:"+c:null,
    onclick:()=>{s.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===String(k))));on(k);}},t)));return s;}
function picture(Lb,state){const f=PIX[Lb.vis];if(!f)return null;const vw=Lb.vw||1200,vh=Lb.vh||620;return stage(vw,vh,(c,k)=>f(c,vw,vh,state(),Lb,k),Lb.alt||Lb.name);}
const shell=(Lb,pic,...parts)=>h("div",{class:"mr-lab",style:"--c:"+(css(Lb.c)||Lb.c)},...(pic?[pic.el]:[]),...parts);
const info=t=>t?h("p",{class:"mr-info"},t):null;
const btn=(t,on,cls)=>h("button",{type:"button",class:"mr-btn"+(cls?" "+cls:""),onclick:on},t);
function slider(label,min,max,val,on,hint){const id="r"+Math.random().toString(36).slice(2,8),out=h("output",{for:id});
  const r=h("input",{type:"range",id,min,max,step:1,value:val});const say=()=>{out.textContent=hint?hint(+r.value):r.value;};
  r.addEventListener("input",()=>{say();on(+r.value);});r.addEventListener("change",()=>{say();on(+r.value);});say();
  return{el:h("div",{class:"mr-range"},h("label",{for:id},label),r,out),r};}

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
  draw();ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),rows,h("div",{class:"mr-controls"},go,again),say);}

/* ---------- pick: one option, and what it gets right ---------- */
function labPick(Lb){const V=Lb.w;let cur=V.opts[0][0];const say=h("p",{class:"mr-say",role:"status"}),list=h("ul",{class:"mr-checks"});
  const pic=picture(Lb,()=>({pick:cur}));
  function upd(anim){const r=V.res[cur];list.replaceChildren(...V.checks.map((t,i)=>h("li",{class:r[i]===1?"ok":r[i]===0.5?"warn":"no"},t)));say.textContent=V.say[cur];if(pic)pic.paint(anim);}
  ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),h("div",{class:"mr-controls"},h("span",{class:"mr-lbl"},V.label),seg(V.opts,cur,k=>{cur=k;upd(true);},V.label)),list,say);}

/* ---------- steps: a sequence, one step at a time ---------- */
function labSteps(Lb){const V=Lb.w;let cur=0;const say=h("p",{class:"mr-say",role:"status"}),ol=h("ol",{class:"mr-steps"});
  const pic=picture(Lb,()=>({step:cur}));
  const prev=btn("← "+U.back,()=>{if(cur>0){cur--;upd(true);}}),next=btn(U.nextStep+" →",()=>{if(cur<V.steps.length-1){cur++;upd(true);}},"go");
  function upd(anim){ol.replaceChildren(...V.steps.map((s,i)=>h("li",{class:i<cur?"done":i===cur?"on":"",...(i===cur?{"aria-current":"step"}:{})},h("b",null,s.t),i===cur?h("span",null,s.d):null)));
    prev.disabled=cur===0;next.disabled=cur===V.steps.length-1;say.textContent=cur===V.steps.length-1?V.sayEnd:fill(U.stepOf,{n:cur+1,of:V.steps.length});if(pic)pic.paint(anim);}
  ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),ol,h("div",{class:"mr-controls"},prev,next),say);}

/* ---------- compose: a card from parts ---------- */
function labCompose(Lb){const V=Lb.w,pick=V.slots.map(()=>null),say=h("p",{class:"mr-say",role:"status"}),out=h("p",{class:"mr-sentence"}),notes=h("ul",{class:"mr-checks"});
  const pic=picture(Lb,()=>({pick}));
  const slots=V.slots.map((sl,i)=>h("div",{class:"mr-controls mr-slot"},h("span",{class:"mr-lbl"},sl.label),seg(sl.opts.map((o,j)=>[String(j),o.t]),null,k=>{pick[i]=+k;upd(true);},sl.label)));
  function upd(anim){out.replaceChildren(h("b",null,V.head+" "),...V.slots.map((sl,i)=>pick[i]==null?h("span",{class:"gap"},"… "):h("span",{class:sl.opts[pick[i]].ok?"ok":"no"},sl.opts[pick[i]].t+" ")));
    notes.replaceChildren(...V.slots.map((sl,i)=>pick[i]==null?null:h("li",{class:sl.opts[pick[i]].ok?"ok":"no"},sl.opts[pick[i]].why)).filter(Boolean));
    const done=pick.every(p=>p!=null),good=done&&pick.every((p,i)=>V.slots[i].opts[p].ok);say.textContent=!done?V.sayStart:good?V.sayGood:V.sayFix;if(pic)pic.paint(anim);}
  ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),...slots,out,notes,say);}

/* ---------- wheel: the next word, drawn like a spin of a wheel; the temperature reshapes the slices ----------
   Each word's slice is its chance; at temperature T, chance^(1/T), shared out again, with a small floor, since even turned right
   down a little chance stays. A spin draws one word; ten spins draw ten. */
function labWheel(Lb){const V=Lb.w,words=V.words,say=h("p",{class:"mr-say",role:"status"}),stats=h("div",{class:"mr-stats"});
  let T=1,got=[],spin=-1,seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  const temp=v=>Math.max(0.1,v/10);
  function shares(){const raw=words.map(([,p])=>Math.pow(p,1/T)),s=raw.reduce((a,b)=>a+b,0),fl=0.003,q=raw.map(r=>Math.max(fl,r/s)),t=q.reduce((a,b)=>a+b,0);return q.map(x=>x/t);}
  function draw1(){const q=shares();let u=rnd(),i=0;for(;i<q.length-1;i++){if(u<q[i])break;u-=q[i];}return i;}
  const COL=["violet","blue","orange","green","amber","muted"];
  const pic=stage(1200,620,(ctx,k)=>{const q=shares(),cx=330,cy=318,R=250;let a0=-Math.PI/2;
    // where the pointer rests: the middle of the last word drawn, turned to over the change's 0.7 s
    q.forEach((p,i)=>{const a1=a0+p*Math.PI*2;ctx.save();ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,a0,a1);ctx.closePath();
      ctx.fillStyle=rgba(C(COL[i%COL.length]),i===spin?0.85:0.5);ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.9)";ctx.lineWidth=3;ctx.stroke();ctx.restore();
      a0=a1;});
    ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=18;ctx.fillStyle="#F3F1ED";ctx.beginPath();ctx.arc(cx,cy,46,0,Math.PI*2);ctx.fill();ctx.restore();
    if(spin>=0){let s=-Math.PI/2;for(let i=0;i<spin;i++)s+=q[i]*Math.PI*2;const m=s+q[spin]*Math.PI;const ang=-Math.PI/2+(m+Math.PI/2)*ag_sine(k);
      ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);ctx.fillStyle="#57524C";ctx.beginPath();ctx.moveTo(R+14,0);ctx.lineTo(30,-14);ctx.lineTo(30,14);ctx.closePath();ctx.fill();ctx.restore();}
    // each slice's chance, over the pointer
    a0=-Math.PI/2;q.forEach(p=>{const a1=a0+p*Math.PI*2;if(p>0.045){const m=(a0+a1)/2,rx=cx+Math.cos(m)*R*0.7,ry=cy+Math.sin(m)*R*0.7;
      ctx.save();ctx.shadowColor="rgba(30,26,40,0.45)";ctx.shadowBlur=6;tx(ctx,pct(p),rx,ry+10,{size:30,w:800,align:"center",col:[255,255,255]});ctx.restore();}a0=a1;});
    // the key, and the sentence with the word drawn
    const x0=640,cw=520;card(ctx,x0,36,cw,548,{edge:Lb.c,edgeA:0.4});
    tx(ctx,String(V.kicker).toUpperCase(),x0+28,92,{size:24,w:700,col:C(Lb.c),ls:2});
    const th=lines(ctx,V.stem,x0+28,140,cw-56,{size:26,w:700,max:2});
    words.forEach(([wd],i)=>{const y=140+th+16+i*44;dot(ctx,x0+44,y-9,13,COL[i%COL.length],i===spin?0.9:0.55);
      tx(ctx,wd,x0+72,y,{size:fit(ctx,wd,cw-210,26,i===spin?800:600,18),w:i===spin?800:600});tx(ctx,pct(q[i]),x0+cw-30,y,{size:26,w:700,align:"right",col:MUT()});});
    const yT=140+th+16+words.length*44+14;tx(ctx,fill(V.tempIs,{t:T.toFixed(1)}),x0+28,yT,{size:26,w:700,col:C("violet")});
    if(got.length){tx(ctx,V.lastSpins,x0+28,yT+44,{size:22,w:700,col:MUT()});lines(ctx,got.slice(-6).map(i=>words[i][0]).join(" · "),x0+28,yT+76,cw-56,{size:24,w:600,max:2,cut:true});}
  },Lb.alt||Lb.name);
  function upd(anim){const q=shares(),n=got.length,diff=new Set(got).size,top=got.filter(i=>i===0).length;
    stats.replaceChildren(h("p",null,h("b",null,pct(q[0])),h("span",null,fill(V.chanceOf,{w:words[0][0]}))),h("p",null,h("b",null,String(n)),h("span",null,V.spins)),h("p",{class:diff>1?"warn":null},h("b",null,String(diff)),h("span",null,V.different)));
    say.textContent=spin<0?fill(V.sayStart,{t:T.toFixed(1)}):fill(n>1?V.sayMany:V.sayOne,{w:words[spin][0],n,d:diff,top,t:T.toFixed(1)})+(T<=0.3?" "+V.sayLow:T>=1.6?" "+V.sayHigh:"");pic.paint(anim);}
  const sl=slider(V.tempLabel,1,20,10,v=>{T=temp(v);upd(true);},v=>temp(v).toFixed(1));
  const one=btn(V.spinOne,()=>{spin=draw1();got.push(spin);upd(true);},"go"),ten=btn(V.spinTen,()=>{for(let i=0;i<10;i++){spin=draw1();got.push(spin);}upd(true);}),
    clear=btn(U.again,()=>{got=[];spin=-1;upd();});
  ready().then(()=>upd());upd();return shell(Lb,pic,info(V.prompt),sl.el,h("div",{class:"mr-controls"},one,ten,clear),stats,say);}

/* ---------- swarm: ants choose a bridge by the scent others left ----------
   The colony's nest is on the left, food on the right, and two bridges between: a short one and a long one. Each ant, at either
   end, picks a bridge by the scent on each, as Deneubourg and Goss modelled real ants in 1989: the chance of a bridge grows with
   (k + its scent) to a power that
   grows as "follow" rises (0, a coin toss; 2, as the model has it). Each crossing adds scent to its bridge, and
   all scent fades at the "fade" rate. The short bridge is crossed sooner, so its scent builds faster, and most ants end up on it,
   though no ant compares the two. If it opens later, the long bridge's scent can keep them there: a habit no ant chose. */
function labSwarm(Lb){const V=Lb.w,say=h("p",{class:"mr-say",role:"status"}),stats=h("div",{class:"mr-stats"});
  const VW=1200,VH=640,NEST=[110,300],FOOD=[1090,300];
  // each bridge, as points from the nest to the food, offset by f(u) from the straight line; its length
  const bridge=f=>{const p=[];for(let i=0;i<=80;i++){const u=i/80;p.push([LERP(NEST[0]+60,FOOD[0]-60,u),NEST[1]+f(u)]);}
    p.unshift(NEST.slice());p.push(FOOD.slice());let len=0;const acc=[0];for(let i=1;i<p.length;i++){len+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);acc.push(len);}return{p,acc,len};};
  const S_=u=>Math.sin(Math.PI*u);
  // 0 short, an arch above; 1 long, winding below, about 1.7 times as long
  const B=[bridge(u=>-150*S_(u)),bridge(u=>140*S_(u)+110*S_(u)*Math.sin(9*Math.PI*u))];
  const at=(b,s)=>{const A=b.acc,P=b.p;let i=1;while(i<A.length-1&&A[i]<s)i++;const u=(s-A[i-1])/((A[i]-A[i-1])||1);return[LERP(P[i-1][0],P[i][0],u),LERP(P[i-1][1],P[i][1],u)];};
  let n=150,follow=6,fade=2,late=false,ants=[],scent=[0,0],t=0,hist=[],running=false,raf=0,ranFor=0,last=0,shown=-1,visible=true,seed=11;
  const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  const SPEED=200,OPEN=30,SEC=1/30;
  function reset(){seed=11;t=0;scent=[0,0];hist=[];shown=-1;ants=[];for(let i=0;i<n;i++)ants.push({b:-1,s:0,dir:1,wait:rnd()*12});}
  const openShort=()=>!late||t>=OPEN;
  // how strongly scent pulls: the exponent, from 0 (scent ignored: a coin toss) to 3; k = 6, a little scent counts for little
  function choose(){if(!openShort())return 1;const e=follow*0.3,a=Math.pow(6+scent[0],e),b=Math.pow(6+scent[1],e);return rnd()<a/(a+b)?0:1;}
  function step(dt){t+=dt;const f=Math.exp(-(fade/10)*0.25*dt);scent[0]*=f;scent[1]*=f;
    for(const a of ants){if(a.wait>0){a.wait-=dt;if(a.wait<=0){a.b=choose();a.s=0;a.dir=1;}continue;}
      a.s+=SPEED*dt;if(a.s>=B[a.b].len){scent[a.b]+=1;a.s=0;a.dir=-a.dir;a.b=choose();}}
    if(Math.floor(t)!==Math.floor(t-dt))hist.push(share());if(hist.length>120)hist.shift();}
  function share(){let on=[0,0];for(const a of ants)if(a.b>=0&&a.wait<=0)on[a.b]++;const s=on[0]+on[1];return s?on[0]/s:0;}
  const pic=stage(VW,VH,(ctx)=>{const tot=scent[0]+scent[1]||1;
    B.forEach((b,i)=>{const open=i===1||openShort(),sh=scent[i]/tot;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
      ctx.strokeStyle=open?"rgba(156,136,106,0.55)":"rgba(156,136,106,0.18)";ctx.lineWidth=34;if(!open)ctx.setLineDash([10,16]);ctx.beginPath();b.p.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.setLineDash([]);
      if(open&&sh>0.02){ctx.strokeStyle=rgba(C("green"),0.15+0.7*sh);ctx.lineWidth=6+20*sh;ctx.beginPath();b.p.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}ctx.restore();
      const m=b.p[Math.floor(b.p.length/2)];tx(ctx,(i?V.long:V.short)+(open?"":" · "+V.closed),VW/2,i?NEST[1]+305:NEST[1]-150-36,{size:26,w:700,align:"center",col:open?INK():MUT()});});
    ctx.fillStyle="#36373C";for(const a of ants){if(a.wait>0||a.b<0)continue;const b=B[a.b],[x,y]=at(b,a.dir>0?a.s:b.len-a.s);ctx.beginPath();ctx.arc(x,y,4.2,0,Math.PI*2);ctx.fill();}
    [[NEST,V.nest],[FOOD,V.food]].forEach(([p,label],i)=>{ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=16;ctx.fillStyle=i?rgba(C("orange"),0.9):"#C9B48F";ctx.beginPath();ctx.arc(p[0],p[1],46,0,Math.PI*2);ctx.fill();ctx.restore();
      tx(ctx,label,p[0],p[1]+86,{size:26,w:700,align:"center"});});
    // on the left, what share of the ants is on the short bridge, and over time, as a line
    tx(ctx,pct(share()),40,72,{size:44,w:800,col:C("green")});tx(ctx,V.onShort,40,108,{size:24,w:600,col:MUT()});
    const gx=VW-330,gy=40,gw=290,gh=96;card(ctx,gx,gy,gw,gh,{r:14});ctx.save();ctx.strokeStyle="rgba(60,50,40,0.18)";ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(gx+14,gy+gh/2);ctx.lineTo(gx+gw-14,gy+gh/2);ctx.stroke();ctx.setLineDash([]);
    if(hist.length>1){ctx.strokeStyle=rgba(C("green"),1);ctx.lineWidth=3;ctx.beginPath();hist.forEach((v,i)=>{const x=gx+14+(gw-28)*i/119,y=gy+gh-12-(gh-24)*v;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();}ctx.restore();
    tx(ctx,fill(V.time,{t:Math.floor(t)}),gx+gw,gy+gh+34,{size:22,w:600,align:"right",col:MUT()});},Lb.alt||Lb.name);
  function words(){const s=share();return s>0.8?V.saySettledShort:s<0.2&&t>8?V.saySettledLong:V.sayMixed;}
  function upd(force){const s=share(),sec=Math.floor(t/10);
    stats.replaceChildren(h("p",null,h("b",null,pct(s)),h("span",null,V.onShort)),h("p",null,h("b",null,String(n)),h("span",null,V.antsN)),h("p",null,h("b",null,String(Math.floor(t))),h("span",null,V.seconds)));
    // the words change every ten seconds of the colony's time, or when something is pressed: often enough to follow, not to chatter
    if(force||sec!==shown){shown=sec;say.textContent=(t<0.5?V.sayStart:fill(words(),{p:pct(s),t:Math.floor(t)}))+(late&&!openShort()?" "+fill(V.sayWaiting,{t:OPEN}):"")+(running?"":" "+V.sayPaused);}
    pic.paint(false);}
  function loop(now){raf=0;if(!running||!visible)return;if(now-last>=1000/30-2){const dt=Math.min(0.1,(now-last)/1000||SEC);last=now;ranFor+=dt;for(let i=0;i<3;i++)step(SEC*1.5);
      if(ranFor>60){running=false;upd(true);go.textContent=V.run;go.setAttribute("aria-pressed","false");say.textContent=V.sayMinute;return;}upd();}
    raf=requestAnimationFrame(loop);}
  function play(on){running=on;go.textContent=on?V.pause:V.run;go.setAttribute("aria-pressed",String(on));if(on){ranFor=0;last=performance.now();if(!raf)raf=requestAnimationFrame(loop);}upd(true);}
  const go=btn(V.run,()=>play(!running),"go");
  const again=btn(U.again,()=>{reset();upd(true);});
  const ants_=slider(V.antsLabel,1,8,3,v=>{n=v*50;reset();upd(true);},v=>String(v*50));
  const fol=slider(V.followLabel,0,10,6,v=>{follow=v;upd(true);},v=>v===0?V.not:v>=8?V.closely:String(v));
  const fad=slider(V.fadeLabel,0,10,2,v=>{fade=v;upd(true);},v=>v===0?V.never:v>=8?V.fast:String(v));
  const when=seg([["start",V.fromStart],["late",V.later]],"start",k=>{late=k==="late";reset();upd(true);},V.whenLabel);
  if("IntersectionObserver" in window)new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);if(visible&&running&&!raf){last=performance.now();raf=requestAnimationFrame(loop);}}).observe(pic.el);
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&running)play(false);});
  reset();ready().then(()=>upd(true));upd(true);
  const more=V.more?h("aside",{class:"mr-more"},h("h4",null,V.more.h),h("p",null,V.more.p),h("ul",null,...V.more.links.map(([t,href,line])=>h("li",null,h("a",{href,target:"_blank",rel:"noopener"},t),line?" "+line:""))),
    h("p",null,h("a",{class:"btn",href:V.more.all[1],target:"_blank",rel:"noopener"},V.more.all[0]))):null;
  return shell(Lb,pic,info(V.prompt),h("div",{class:"mr-controls"},go,again),h("div",{class:"mr-controls mr-slot"},h("span",{class:"mr-lbl"},V.whenLabel),when),ants_.el,fol.el,fad.el,stats,say,more);}

const BUILD={sort:labSort,pick:labPick,steps:labSteps,compose:labCompose,wheel:labWheel,swarm:labSwarm};
L.BUILD=BUILD;L.PIX=PIX;

/* ---------- the labs page: a film, then a rail of its labs, one lab at a time ---------- */
const labsApp=document.getElementById("series-labs");
if(labsApp&&LABS.length){labsApp.textContent="";const visited=new Set(get("visited",[]));let film=LABS[0].film;
  const films=h("div",{class:"mr-films",role:"group","aria-label":U.filmsLabel}),rails=h("div"),holder=h("div");
  const ofFilm=n=>LABS.filter(x=>x.film===n);
  function paintFilms(){films.replaceChildren(...FILMS.filter(f=>ofFilm(f.n).length).map(f=>{const ls=ofFilm(f.n),seen=ls.filter(x=>visited.has(x.id)).length;
    return h("button",{type:"button","aria-pressed":String(f.n===film),onclick:()=>show(ofFilm(f.n)[0].id)},h("i",null,String(f.n)),h("span",null,f.title),h("small",null,fill(U.seen,{n:seen,of:ls.length})));}));}
  rails.append(...FILMS.filter(f=>ofFilm(f.n).length).map(f=>h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel+" · "+f.title,"data-film":String(f.n)},
    ...ofFilm(f.n).map((Lb,i)=>h("button",{type:"button",role:"tab","data-id":Lb.id,style:"--c:"+(css(Lb.c)||Lb.c),onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)))));
  const tabs=()=>[...rails.querySelectorAll("[role=tab]")];
  function paintRail(){[...rails.children].forEach(r=>{r.hidden=r.dataset.film!==String(film);});}
  // the next lab of the series, across films
  function show(id,focus){const Lb=labOf(id)||LABS[0];visited.add(Lb.id);set("visited",[...visited]);if(Lb.film!==film){film=Lb.film;paintRail();}paintFilms();
    tabs().forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;b.classList.toggle("done",visited.has(b.dataset.id));});
    const ls=ofFilm(film),i=ls.indexOf(Lb),all=LABS.indexOf(Lb),nxt=LABS[all+1],f=filmOf(film);
    holder.replaceChildren(h("div",{class:"stop",style:"--c:"+(css(Lb.c)||Lb.c)},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(all+1))," "+U.of+" "+LABS.length+" · "+f.title),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,p))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},watchHref(Lb)?h("a",{class:"btn",href:watchHref(Lb)},U.watch):h("span",{class:"mr-coming"},U.coming),nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
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
  function pick(n){sel=n;const one=n!==ALL;list=one?QS.filter(q=>q.film===n):QS;quizApp.dataset.film=one?String(n):"all";if(history.replaceState)history.replaceState(null,"","#"+(one?"film-"+n:"all"));
    paintFilms();const first=list.findIndex(q=>!A(q));if(first<0)results();else{cur=first;render();}}
  function paintBar(){dots.replaceChildren(...list.map((q,i)=>h("button",{type:"button",class:A(q)?(A(q).ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1),onclick:()=>{cur=i;render();}},String(i+1))));
    const as=list.filter(A),ok=as.filter(q=>A(q).ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+as.length+" "+U.answered+" · "+(list.length-as.length)+" "+U.toGo));}
  function done(q,ok,pk){ans[q.n]={ok,pick:pk};set("quiz",ans);paintBar();paintFilms();}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why));
  function foot(q){const last=cur===list.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:labHref(q.lab)},U.explore+" "+labName(q.lab)),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results();else{cur+=1;render();}}},last?U.results:U.nextQ));}
  function render(){paintBar();const q=list[cur],f=PIX[q.vis],body=h("div",{class:"qbody"}),out=h("div"),prev=A(q),Lq=labOf(q.lab)||{};
    const vis=stage(1000,760,c=>{if(f)f(c,1000,760,q.st||{},Lq,1);},q.alt||q.title);
    body.append(h("p",{class:"qtag",style:"--c:"+(css(Lq.c)||"#584ec4")},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+list.length+(sel!==ALL?"":" · "+filmOf(q.film).title)),h("h3",null,q.title),h("p",{class:"qsit"},q.sit));
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
  function results(){paintBar();const ok=list.filter(q=>A(q)&&A(q).ok).length,n=list.length,band=L.done[ok>=n?0:ok>=n-2?1:ok>=n/2?2:3];
    const by={};list.forEach(q=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(A(q)&&A(q).ok)by[k].ok++;});
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/n*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",null,band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:labHref(k),class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+(css((labOf(k)||{}).c)||"#a0b2cd")},h("i"),labName(k)+" · "+by[k].ok+"/"+by[k].n))),
      h("button",{type:"button",class:"btn",onclick:()=>{list.forEach(q=>delete ans[q.n]);set("quiz",ans);paintFilms();cur=0;render();}},U.again)),closing(sel===ALL?0:sel,sel===ALL)));}
  const fromHash=()=>{const hs=(location.hash||"").slice(1),fm=/^film-(\d+)$/.exec(hs),todo=QS.find(q=>!A(q));return fm&&QS.some(q=>q.film===+fm[1])?+fm[1]:hs==="all"?ALL:todo?todo.film:ALL;};
  pick(fromHash());window.addEventListener("hashchange",()=>{const n=fromHash();if(n!==sel)pick(n);});}
})();
