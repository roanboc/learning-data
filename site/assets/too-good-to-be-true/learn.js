/* Learning Data: Too good to be true. Three training labs (Take it apart) and ten evaluation scenarios (Make the call).
   The words come from learn.en.js or learn.es.js (window.TG); the pictures are the film's own components (assets/too-good-to-be-true/film.js):
   the gauge, the application tiles, the version panes. Progress stays in this browser, under "ld-too-good-to-be-true:" (visited labs, answers);
   path.js paints the stepper and the topic cards from it. */
(()=>{"use strict";
const P="ld-too-good-to-be-true",L=window.TG;if(!L)return;const U=L.ui;
const get=(k,d)=>{try{const v=localStorage.getItem(P+":"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}};
const set=(k,v)=>{try{localStorage.setItem(P+":"+k,JSON.stringify(v));}catch(e){}
  // path.js repaints the stepper on "storage", which only other tabs fire: fire it here too
  try{window.dispatchEvent(new StorageEvent("storage",{key:P+":"+k}));}catch(e){}};
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const k in attrs||{}){const v=attrs[k];if(v==null||v===false)continue;if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else if(k==="html")e.innerHTML=v;else e.setAttribute(k,v===true?"":v);}
  kids.flat().forEach(c=>{if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(c));});return e;}
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
// rounded up: rounding down lands on the last frame of the chapter before
const chapterStart=id=>{try{const s=SCENES.find(x=>x.id===id);return s?Math.ceil(s.start):0;}catch(e){return 0;}};
const watchLink=id=>"../#t="+chapterStart(id);
const ready=()=>window.FILM&&FILM.ready?FILM.ready:Promise.resolve();
function stage(w,hgt,draw,label){const cv=h("canvas",{role:"img","aria-label":label||""});
  function paint(){const d=Math.min(window.devicePixelRatio||1,2),cw=Math.max(300,Math.round((cv.clientWidth||w)*d));if(cv.width!==cw){cv.width=cw;cv.height=Math.round(cw*hgt/w);}
    const ctx=cv.getContext("2d"),k=cv.width/w;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.setTransform(k,0,0,k,0,0);
    ctx.fillStyle="#070b16";ctx.fillRect(0,0,w,hgt);draw(ctx);}
  cv.style.aspectRatio=w+"/"+hgt;if("ResizeObserver" in window)new ResizeObserver(()=>paint()).observe(cv);return{el:cv,paint};}
function seg(opts,cur,on,label){const s=h("div",{class:"seg",role:"group","aria-label":label||""});opts.forEach(([k,t])=>s.append(h("button",{type:"button","aria-pressed":String(k===cur),
  onclick:()=>{s.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===k)));on(k);},"data-k":k},t)));return s;}
const labOf=id=>L.labs.find(x=>x.id===id);

/* ---------- Lab 1 · Set the levels: a term of nights, two levels ---------- */
// the overnight change in applications, one value per night: small growth, four closing dates (real), a week copied twice and a week lost (wrong)
const NIGHTS=(()=>{const a=[];for(let i=0;i<100;i++){const r=Math.sin(i*12.9898)*43758.5453;a.push({v:0.3+(r-Math.floor(r))*1.6,k:"ok"});}
  [[14,9.5],[37,14],[58,12.5],[83,15]].forEach(([i,v])=>a[i]={v,k:"real"});a[66]={v:38.3,k:"dup"};a[46]={v:-31,k:"lost"};return a;})();
function levelStats(w,e){let s=0,n=0,l=0;NIGHTS.forEach(x=>{const a=Math.abs(x.v),bad=x.k==="dup"||x.k==="lost";if(a>e){if(!bad)s++;}else{if(bad)l++;if(a>w)n++;}});return{s,n,l};}
function labLevels(Lb){const W=Lb.w;let w=10,e=25;const box=h("div",{class:"lab"}),say=h("p",{class:"lab-say",role:"status"});
  const st=stage(960,460,c=>{const x0=70,x1=930,y0=80,ym=240,y1=400,sc=v=>ym-v*(ym-y0)/40;
    T(c,W.title,30,34,{w:700,size:20});
    // the bands: green up to the warning, amber to the error, red beyond
    [[0,w,GRN],[w,e,AMB],[e,45,RED]].forEach(([a,b,col])=>{if(b<=a)return;c.fillStyle=rgba(col,0.08);c.fillRect(x0,sc(Math.min(40,b)),x1-x0,sc(a)-sc(Math.min(40,b)));c.fillRect(x0,ym+(ym-sc(Math.min(40,b))),x1-x0,-(sc(Math.min(40,b))-sc(a)));});
    [[w,AMB],[e,RED]].forEach(([v,col])=>{if(v>40)return;c.strokeStyle=rgba(col,0.9);c.setLineDash([6,5]);c.lineWidth=1.5;[sc(v),ym+(ym-sc(v))].forEach(y=>{if(y<y0-2||y>y1+40)return;c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();});c.setLineDash([]);
      T(c,v+"%",x0-8,sc(v)+5,{w:700,size:14,align:"right",color:rgba(col,1)});});
    c.strokeStyle="rgba(170,200,245,0.4)";c.lineWidth=1;c.beginPath();c.moveTo(x0,ym);c.lineTo(x1,ym);c.stroke();T(c,"0",x0-8,ym+5,{w:600,size:13,align:"right",color:rgba(SOFT,0.9)});
    const bw=(x1-x0)/NIGHTS.length;NIGHTS.forEach((n,i)=>{const a=Math.abs(n.v),col=a>e?RED:a>w?AMB:GRN,y=sc(Math.max(-40,Math.min(40,n.v))),x=x0+i*bw;
      c.fillStyle=rgba(col,n.k==="ok"?0.7:1);c.fillRect(x+1,Math.min(y,ym),Math.max(2,bw-2),Math.abs(ym-y)||1);
      if(n.k!=="ok"){const lab=n.k==="real"?W.real:n.k==="dup"?W.dup:W.lost,ty=n.v>0?y-10:y+18;T(c,lab,x+bw/2,ty,{w:700,size:13,align:"center",color:n.k==="real"?"rgba(236,243,255,0.95)":"rgba(255,180,170,1)"});}});
    T(c,"1",x0,y1+36,{w:600,size:13,color:rgba(SOFT,0.9)});T(c,U.night+" 100",x1,y1+36,{w:600,size:13,align:"right",color:rgba(SOFT,0.9)});});
  const wr=h("input",{type:"range",min:1,max:40,value:w,"aria-label":W.warn}),er=h("input",{type:"range",min:2,max:60,value:e,"aria-label":W.error}),wv=h("b"),ev=h("b");
  const stats=h("div",{class:"tg-stats"});
  function upd(){w=+wr.value;e=+er.value;if(e<=w){e=w+1;er.value=e;}wv.textContent=w+"%";ev.textContent=e+"%";const r=levelStats(w,e);
    stats.replaceChildren(...[[r.s,W.stopped,r.s?"no":"ok"],[r.n,W.warned,r.n>4?"no":"ok"],[r.l,W.leaked,r.l?"no":"ok"]].map(([n,t,k])=>h("p",{class:k},h("b",null,String(n)),h("span",null,t))));
    say.textContent=fill(W.say,{w,e,s:r.s,n:r.n,l:r.l})+(r.l?W.sayLeak:r.s?W.sayStrict:W.sayGood);st.paint();}
  wr.oninput=upd;er.oninput=upd;
  const pre=h("div",{class:"lab-controls"},...W.presets.map(([k,t])=>h("button",{type:"button",class:"chip-btn sm",onclick:()=>{const v={contract:[10,25],strict:[3,5],loose:[10,60]}[k];wr.value=v[0];er.value=v[1];upd();}},t)));
  box.append(st.el,h("div",{class:"lab-controls tg-sliders"},h("label",null,h("span",{class:"lbl"},W.warn," ",wv),wr),h("label",null,h("span",{class:"lbl"},W.error," ",ev),er)),pre,stats,say);
  ready().then(upd);return box;}

/* ---------- Lab 2 · Which test catches it? ---------- */
// what each test says about each night: p passes, w warns, f fails (an error)
const TESTM={dup:{id:"p",key:"f",range:"p",change:"f",fresh:"p"},missing:{id:"p",key:"p",range:"p",change:"p",fresh:"f"},format:{id:"p",key:"p",range:"f",change:"p",fresh:"p"},
  closing:{id:"p",key:"p",range:"p",change:"w",fresh:"p"},twice:{id:"p",key:"p",range:"p",change:"p",fresh:"p"}};
function labTests(Lb){const W=Lb.w,on=new Set(["id","range"]);let night="dup";const box=h("div",{class:"lab"}),say=h("p",{class:"lab-say",role:"status"}),sum=h("p",{class:"lab-info"});
  const result=n=>{const r=W.tests.filter(([k])=>on.has(k)).map(([k])=>TESTM[n][k]);return r.includes("f")?"f":r.includes("w")?"w":"p";};
  const st=stage(960,360,c=>{const N=W.nights.find(x=>x[0]===night),bad=N[2],r=result(night);
    T(c,N[1],30,40,{w:800,size:22});
    W.tests.forEach(([k,t],i)=>{const y=80+i*52,act=on.has(k),v=TESTM[night][k],col=!act?SOFT:v==="f"?RED:v==="w"?AMB:GRN;
      withA(c,act?1:0.35,()=>{glass(c,30,y,560,42,21,col,{glow:act?10:0,ea:act?0.8:0.3,fill:"rgba(7,12,24,0.9)"});T(c,t,52,y+27,{w:700,size:17});T(c,act?W.res[{p:"pass",w:"warn",f:"fail"}[v]]:"—",574,y+27,{w:700,size:16,align:"right",color:rgba(col,1)});});});
    // the verdict, with the gauge
    const vcol=bad?(r==="f"?GRN:r==="w"?AMB:RED):(r==="f"?RED:r==="w"?AMB:GRN);glass(c,620,80,310,250,20,vcol,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.92)"});
    const gv={dup:38.3,missing:0,format:0.6,closing:14,twice:0.5}[night];gauge(c,775,210,70,gv,on.has("change")?{sub:L.vis.change}:{none:true,noneText:L.vis.none});
    T(c,bad?(r==="f"?"✓":"✗"):(r==="f"?"!":"✓"),775,300,{w:800,size:30,align:"center",color:rgba(vcol,1)});});
  function upd(){const N=W.nights.find(x=>x[0]===night),bad=N[2],r=result(night);
    say.textContent=bad?(r==="f"?W.caught:r==="w"?W.warned:W.missed):(r==="f"?W.noisy:r==="w"?W.look:W.quiet);
    const c=W.nights.filter(x=>x[2]&&result(x[0])==="f").length,a=W.nights.filter(x=>!x[2]&&result(x[0])==="f").length;sum.textContent=fill(W.summary,{c,a});st.paint();}
  const tests=h("div",{class:"tg-checks",role:"group","aria-label":W.testsLabel},...W.tests.map(([k,t])=>h("label",null,h("input",{type:"checkbox",checked:on.has(k)||null,onchange:e=>{e.target.checked?on.add(k):on.delete(k);upd();}}),t)));
  box.append(st.el,h("div",{class:"lab-controls"},h("span",{class:"lbl"},W.nightLabel),seg(W.nights.map(([k,t])=>[k,t]),night,k=>{night=k;upd();},W.nightLabel)),
    h("div",{class:"lab-controls"},h("span",{class:"lbl"},W.testsLabel),tests),sum,say);ready().then(upd);return box;}

/* ---------- Lab 3 · Fix it once ---------- */
function labFix(Lb){const W=Lb.w;let pick="patch";const box=h("div",{class:"lab"}),say=h("p",{class:"lab-say",role:"status"}),list=h("ul",{class:"tg-list"});
  const st=stage(960,380,c=>{const r=W.res[pick],srcOk=r[0];
    // two columns: the source and the platform, each with its total
    [[40,W.src,srcOk?8240:11340,ADM,srcOk],[500,W.plat,8240,LAYER.bronze,true]].forEach(([x,t,n,col,ok],i)=>{glass(c,x,40,420,170,20,col,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.92)"});
      T(c,t,x+24,80,{w:800,size:22});T(c,fmtN(n),x+24,160,{w:800,size:56,color:ok?rgba(INK,1):"rgba(255,170,160,1)"});
      if(i===1&&pick==="dedupe")T(c,"bronze 11,340 · silver 8,240",x+24,195,{w:600,size:15,f:"mono",color:"rgba(255,200,160,1)"});
      if(i===0&&!srcOk)T(c,"3,100 copies",x+24,195,{w:600,size:15,f:"mono",color:"rgba(255,170,160,1)"});});
    if(pick==="source"){versionPane(c,40,230,420,130,"41","Tue 02:00",11340,RED,"");versionPane(c,500,230,420,130,"43","Tue 11:30",8240,GRN,"");}
    else{appTile(c,60,250,28,"A-40211 · 88213 · BSc Data Science · 2027");appTile(c,60,290,28,"A-47988 · 88213 · BSc Data Science · 2027",{dup:true,bad:true});}});
  function upd(){const r=W.res[pick];list.replaceChildren(...W.checks.map((t,i)=>h("li",{class:r[i]?"ok":"no"},t)));say.textContent=W.say[pick];st.paint();}
  box.append(st.el,h("div",{class:"lab-controls"},h("span",{class:"lbl"},W.label),seg(W.opts,pick,k=>{pick=k;upd();},W.label)),list,say);ready().then(upd);return box;}
const BUILD={levels:labLevels,tests:labTests,fix:labFix};

/* ---------- the labs page: a rail of stops, one lab at a time ---------- */
const labsApp=document.getElementById("tg-labs");
if(labsApp){labsApp.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":U.labsLabel}),holder=h("div");const visited=new Set(get("visited",[]));
  function show(id,focus){const Lb=labOf(id)||L.labs[0];visited.add(Lb.id);set("visited",[...visited]);
    [...rail.children].forEach(b=>{const on=b.dataset.id===Lb.id;b.setAttribute("aria-selected",String(on));b.classList.toggle("done",visited.has(b.dataset.id));});
    const i=L.labs.indexOf(Lb),nxt=L.labs[i+1];
    holder.replaceChildren(h("div",{class:"stop",style:"--c:"+Lb.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,U.lab+" "+(i+1))," "+U.of+" "+L.labs.length),h("h3",null,Lb.name),h("p",{class:"idea"},Lb.idea),h("ul",null,...Lb.points.map(p=>h("li",null,p))),
        h("details",{class:"real"},h("summary",null,U.inPractice),h("p",null,Lb.real)),
        h("div",{class:"stop-nav"},h("a",{class:"btn",href:watchLink(Lb.chapter)},U.watch),nxt?h("button",{type:"button",class:"btn primary",onclick:()=>show(nxt.id,true)},U.next+" "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},U.makeCall))),
      BUILD[Lb.id](Lb)));
    if(history.replaceState)history.replaceState(null,"","#"+Lb.id);if(focus)holder.scrollIntoView({block:"start"});}
  L.labs.forEach((Lb,i)=>rail.append(h("button",{type:"button",role:"tab","data-id":Lb.id,style:"--c:"+Lb.c,onclick:()=>show(Lb.id)},h("i",null,String(i+1)),Lb.name)));
  labsApp.append(rail,holder);show((location.hash||"").slice(1));}

/* ---------- the scenarios page: evaluation ---------- */
const V=L.vis,G=(v,sub)=>c=>gauge(c,300,190,110,v,{sub:sub||V.change});
const QV={g14:G(14),g38:G(38.3),g60:G(-60,V.tuition),g100:G(9900,V.revenue),g3:G(-3,V.rows),chan:c=>alertChannel(c,120,30,360,260,60,{}),
  pair:c=>{appTile(c,40,110,30,"A-40211 · 88213 · BSc Data Science · 2027");appTile(c,40,170,30,"A-47988 · 88213 · BSc Data Science · 2027",{dup:true});},
  reload:c=>{versionPane(c,25,60,270,190,"41","Tue 02:00",11340,RED,"");versionPane(c,305,60,270,190,"43","Tue 11:30",8240,GRN,"");},
  note:c=>committeeDash(c,60,40,480,240,{num:8200,note:true,s:0.8,noteText:"Last good data as of Mon 02:00"}),
  steps:c=>{[RED,LAYER.bronze,ADM,TECH,GRN,GRN].forEach((col,i)=>tag(c,300,48+i*46,(i+1)+"  "+V.steps[i],col,{align:"center",size:18}));}};
const quizApp=document.getElementById("tg-quiz");
if(quizApp){quizApp.textContent="";const QS=L.qs,ans=get("quiz",{});let cur=0;
  const bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":U.qsLabel}),score=h("p",{class:"score"}),card=h("div");bar.append(dots,score);quizApp.append(h("div",{class:"quiz"},bar,card));
  const labName=id=>(labOf(id)||{name:""}).name,labHref=id=>"../labs/#"+id;
  function paintBar(){dots.replaceChildren(...QS.map((q,i)=>h("button",{type:"button",class:ans[i]?(ans[i].ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":U.scenario+" "+(i+1),onclick:()=>{cur=i;render();}},String(i+1))));
    const n=Object.keys(ans).length,ok=Object.values(ans).filter(a=>a.ok).length;score.replaceChildren(U.score+" "+ok+" ",h("span",null,U.of+" "+n+" "+U.answered+" · "+(QS.length-n)+" "+U.toGo));}
  function done(ok){ans[cur]={ok};set("quiz",ans);paintBar();}
  const feed=(ok,q)=>h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?U.good:U.notQuite),h("p",null,q.why));
  function foot(q){const last=cur===QS.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:labHref(q.lab)},U.explore+" "+labName(q.lab)),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results();else{cur+=1;render();}}},last?U.results:U.nextQ));}
  function render(){paintBar();const q=QS[cur],body=h("div",{class:"qbody"}),vis=stage(600,320,c=>{(QV[q.vis]||(()=>{}))(c);},q.title),out=h("div");
    body.append(h("p",{class:"qtag",style:"--c:"+((labOf(q.lab)||{}).c||"#78c8ff")},h("i"),U.scenario+" "+(cur+1)+" "+U.of+" "+QS.length),h("h3",null,q.title),h("p",{class:"qsit"},q.sit));
    if(q.type==="choice"){const box=h("div",{class:"qopts"});q.opts.forEach((o,i)=>box.append(h("button",{type:"button",class:"qopt",onclick:()=>{[...box.children].forEach((b,j)=>{b.disabled=true;if(q.opts[j].ok)b.classList.add("ok");});
      if(!o.ok){box.children[i].classList.add("no");box.children[i].append(h("small",null,o.why));}done(!!o.ok);out.replaceChildren(feed(!!o.ok,q),foot(q));}},h("span",{class:"k"},"ABC"[i]),h("span",null,o.t))));body.append(box);}
    if(q.type==="order"){let ord=q.items.map((t,i)=>i).sort((a,b)=>((a*7+3)%q.items.length)-((b*7+3)%q.items.length));const box=h("ol",{class:"qorder"});
      const draw=()=>box.replaceChildren(...ord.map((ix,p)=>h("li",null,h("span",{class:"n"},String(p+1)),h("span",null,q.items[ix]),h("span",{class:"mv"},h("button",{type:"button","aria-label":U.up,onclick:()=>{if(p>0){[ord[p-1],ord[p]]=[ord[p],ord[p-1]];draw();}}},"↑"),h("button",{type:"button","aria-label":U.down,onclick:()=>{if(p<ord.length-1){[ord[p+1],ord[p]]=[ord[p],ord[p+1]];draw();}}},"↓")))));draw();
      body.append(box,h("button",{type:"button",class:"btn primary",onclick:e=>{const ok=ord.every((ix,p)=>ix===p);[...box.children].forEach((li,p)=>{li.classList.add(ord[p]===p?"ok":"no");li.querySelectorAll("button").forEach(b=>b.disabled=true);});e.target.remove();done(ok);out.replaceChildren(feed(ok,q),foot(q));}},U.check));}
    body.append(out);card.replaceChildren(h("div",{class:"qcard"},h("div",{class:"qvis"},vis.el),body));ready().then(()=>vis.paint());}
  function results(){paintBar();const ok=Object.values(ans).filter(a=>a.ok).length,n=QS.length,band=L.done[ok>=n?0:ok>=n-3?1:ok>=n/2?2:3];
    const by={};QS.forEach((q,i)=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(ans[i]&&ans[i].ok)by[k].ok++;});
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/n*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",null,band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:labHref(k),class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+(labOf(k)||{c:"#a0b2cd"}).c},h("i"),labName(k)+" · "+by[k].ok+"/"+by[k].n))),
      h("button",{type:"button",class:"btn",onclick:()=>{for(const k in ans)delete ans[k];set("quiz",ans);cur=0;render();}},U.again))));}
  const first=QS.findIndex((q,i)=>!ans[i]);if(first<0)results();else{cur=first;render();}}
})();
