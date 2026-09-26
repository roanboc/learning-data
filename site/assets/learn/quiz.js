/* Learning Data: "Make the call", scenarios in four formats (choose, sort, order, spot the row), each with a small scene drawn with the film's components. */
(()=>{"use strict";
const LD=window.LD;if(!LD)return;
const{h,md,esc,fill,css,Stage,store,X,$}=LD;const Q=X.quiz;
const HOT=[90,220,255],WARM=[255,176,64];

/* ---------- the little scenes ---------- */
const CAP=()=>X.stops.capture.lab;
const V=LD.QVIS;
V.lanes=(c,now)=>{hub(c,110,170,52,now);T(c,Q.vis.integ,110,258,{w:700,size:15,align:"center",color:rgba(SOFT,1)});
  lane(c,[P(162,150),P(560,90)].map(p=>p),HOT,0.9);spawn(now,0.5,0.7,0,u=>glow(c,lerp(162,560,u),lerp(150,90,u),12,HOT,1));tag(c,380,82,CAP().hot,HOT,{align:"center",size:15});
  lane(c,[P(162,200),P(560,270)],WARM,0.8);spawn(now,2.2,3,0,u=>fileIcon2(c,lerp(162,560,u),lerp(200,270,u),now));tag(c,380,292,CAP().warm,WARM,{align:"center",size:15});};
function fileIcon2(c,x,y,now){LD.fileIcon(c,x,y,APP.hr.c,"HR","new",now);}
V.checkpoint=(c,now)=>{chip(c,300,62,"databricks","Auto Loader",fill(CAP().ckpt,{n:5}),{align:"center",ts:19,ss:14,edge:WARM});
  for(let i=0;i<8;i++){const x=90+i*60,y=190,st=i<5?"read":"new";LD.fileIcon(c,x,y,i%2?APP.fin.c:APP.hr.c,i%2?"FIN":"HR",st,now);}
  c.save();c.strokeStyle=rgba(BAD,1);c.lineWidth=4;c.setLineDash([8,6]);c.beginPath();c.moveTo(390,130);c.lineTo(390,250);c.stroke();c.restore();tag(c,390,280,Q.vis.crash,BAD,{align:"center",size:14});};
V.fill312=(c,now)=>{glass(c,70,36,460,268,18,BAD,{glow:22,ea:0.8});T(c,X.stops.sketch.lab.fill.toUpperCase(),100,76,{w:800,size:14,color:rgba(SOFT,0.95)});T(c,X.stops.sketch.lab.klassName,100,104,{w:700,size:19});
  T(c,"312%",100,196,{w:800,size:80,color:rgba(BAD,1)});tag(c,100,262,X.stops.sketch.lab.testsPass,GOOD,{size:15});};
V.nullrow=(c,now)=>{[0,1,2].forEach(i=>dtile(c,110+i*96,120,62,(i-1)*0.06,{cell:3+i*5,q:0,app:"sis",err:i===2},1));
  c.save();c.fillStyle="rgba(10,16,32,0.96)";rr(c,330,210,210,40,9);c.fill();c.strokeStyle=rgba(DBT,0.9);c.lineWidth=2;rr(c,330,210,210,40,9);c.stroke();c.restore();T(c,"stg_enrolments",435,236,{f:"mono",w:500,size:16,align:"center"});
  tag(c,380,282,"not_null ?",[255,200,90],{align:"center",size:13});logo(c,"dbt",470,40,40);};
V.order=(c,now)=>{logo(c,"dbt",40,30,40);for(let i=0;i<5;i++){const x=64+i*108,y=190;if(i)lane(c,[P(x-62,y),P(x-46,y)],DBT,0.8);c.save();c.fillStyle="rgba(10,16,32,0.96)";rr(c,x-46,y-30,92,60,10);c.fill();c.strokeStyle=rgba(DBT,0.6+0.4*Math.abs(Math.sin(now*1.5+i)));c.lineWidth=2;rr(c,x-46,y-30,92,60,10);c.stroke();c.restore();T(c,"?",x,y+10,{w:800,size:26,align:"center",color:rgba(DBT,1)});T(c,String(i+1),x,y-44,{w:800,size:14,align:"center",color:rgba(SOFT,1)});}};
V.contract=(c,now)=>{const G=X.stops.gold.lab,A=G.aud.gov;plaque(c,90,34,420,[[G.dp,A.product],[G.mart,A.mart,"dbt"],[G.exposure,A.exposure,"dbt"],[G.owner,A.owner]],DOM.students.c);tag(c,300,300,Q.vis.renamed,BAD,{align:"center",size:14});};
V.paintings=(c,now)=>{const K=[["realism","finance"],["modern","research"],["rules","students"],["live","teaching"]];K.forEach(([k,d],i)=>{const x=40+(i%2)*270,y=26+Math.floor(i/2)*152,w=250,hh=128;ledFrame(c,x+6,y+6,w-12,hh-12,DOM[d].c,painting2(k),{pad:4,lw:2,glow:14});if(k==="live")liveOverlay(c,x+6,y+6,w-12,hh-12,now);});};
V.three=(c,now)=>{const n=["11,240","10,980","10,412"],cols=[[255,176,64],[255,138,92],[77,163,255]];n.forEach((v,i)=>{const x=24+i*188;glass(c,x,70,172,150,16,cols[i],{glow:14,ea:0.6});T(c,Q.vis.teams[i],x+16,104,{w:700,size:15,color:rgba(SOFT,1)});T(c,v,x+16,162,{w:800,size:34});});
  T(c,Q.vis.enrolled,300,268,{w:700,size:18,align:"center",color:rgba(SOFT,1)});T(c,"?",300,318,{w:800,size:34,align:"center",color:rgba(LAYER.gold,0.6+0.4*Math.sin(now*3))});};
V.lock=(c,now)=>{glass(c,60,40,400,250,14,[176,123,255],{glow:14,ea:0.6});for(let r=0;r<6;r++){const y=70+r*36,dim=r===2||r===4;c.fillStyle=dim?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.08)";rr(c,80,y,360,28,6);c.fill();
    for(let k=0;k<4;k++){const x=92+k*88;if(k===2){c.fillStyle="rgba(140,150,170,0.6)";rr(c,x,y+8,60,12,6);c.fill();}else{c.fillStyle=dim?"rgba(200,215,235,0.1)":"rgba(200,215,235,0.45)";rr(c,x,y+9,40+((r*7+k*5)%30),10,5);c.fill();}}}
  LD.lockBadge(c,480,110,1.3,Q.vis.masked);};
V.speeds=(c,now)=>{phone3(c,150,170,1.15,{screen:"seat",ans:1});for(let r=0;r<7;r++)for(let k=0;k<11;k++){const v=0.2+0.8*Math.abs(Math.sin(r*1.3+k*0.7+now*0.2));c.fillStyle=rgba(mix([30,40,70],LAYER.gold,v),1);rr(c,300+k*25,70+r*28,21,24,3);c.fill();}
  T(c,"Lakebase",150,325,{w:800,size:17,align:"center",color:rgba([47,211,192],1)});T(c,"Lakehouse",437,325,{w:800,size:17,align:"center",color:rgba(LAYER.gold,1)});};
V.ways=(c,now)=>{const r=(now%2.4)/2.4;bellGlyph(c,80,150,0.7,r<0.6?1-r/0.6:0);chip(c,225,150,"databricks","SQL",null,{align:"center",ts:15,lh:22});LD.copyStack(c,330,160,true,4);projector2(c,470,150,0.62,false);cone(c,498,150,590,100,590,200,LAYER.gold,0.9);
  Q.vis.ways.forEach((w,i)=>T(c,w,[80,225,352,480][i],240,{w:700,size:14,align:"center",color:rgba(SOFT,1)}));};
V.genie=(c,now)=>{brainNet(c,150,120,0.26,now,0.8,{labels:false});orb(c,150,250,26,now);glass(c,290,60,290,120,14,[230,236,248],{glow:10,ea:0.6,fill:"rgba(244,241,234,0.97)"});LD.textBlock(c,X.stops.people.lab.genie.qs.seats,306,96,258,{w:700,size:17,color:"#141821"},22);
  c.fillStyle="rgba(244,241,234,0.97)";c.beginPath();c.moveTo(300,160);c.lineTo(200,240);c.lineTo(330,176);c.fill();};

function gridOnly(c,w,hh){c.clearRect(0,0,w,hh);c.strokeStyle="rgba(120,160,230,0.05)";c.lineWidth=1;c.beginPath();for(let x=24;x<w;x+=48){c.moveTo(x+0.5,0);c.lineTo(x+0.5,hh);}for(let y=10;y<hh;y+=48){c.moveTo(0,y+0.5);c.lineTo(w,y+0.5);}c.stroke();}

/* ---------- the scenarios ---------- */
LD.buildQuiz=()=>{
  const root=$("#quiz-app");if(!root)return;root.textContent="";
  const QS=Q.qs,saved=store.get("quiz",{}),S={cur:Math.min(saved.cur||0,QS.length-1),ans:saved.ans||{},sum:!!saved.sum};let kill=null;
  const save=()=>store.set("quiz",{cur:S.cur,ans:S.ans,sum:S.sum});
  const bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":Q.ui.progress}),score=h("p",{class:"score",style:{margin:0}});
  const restart=h("button",{type:"button",class:"btn",onclick:()=>{S.ans={};S.cur=0;S.sum=false;save();render();}},"↺ "+Q.ui.restart);
  bar.append(dots,h("div",{style:{display:"flex",gap:"12px",alignItems:"center",flexWrap:"wrap"}},score,restart));
  const host=h("div");root.append(bar,host);
  const stopOf=q=>LD.stop(q.stop);
  function renderBar(){dots.textContent="";QS.forEach((q,i)=>{const a=S.ans[i];dots.append(h("button",{type:"button",class:a?(a.ok?"ok":"no"):null,"aria-current":!S.sum&&i===S.cur?"true":"false","aria-label":fill(Q.ui.goto,{n:i+1})+(a?" · "+(a.ok?Q.ui.right:Q.ui.wrong):""),onclick:()=>{S.cur=i;S.sum=false;save();render();}},String(i+1)));});
    const n=Object.keys(S.ans).length,ok=Object.values(S.ans).filter(a=>a.ok).length;score.innerHTML=esc(Q.ui.score)+" "+ok+" <span>/ "+n+" · "+esc(fill(Q.ui.left,{n:QS.length-n}))+"</span>";restart.hidden=!n;}
  function render(){if(kill){kill();kill=null;}renderBar();host.textContent="";if(S.sum)return summary();card(S.cur);}
  function card(i){const q=QS[i],s=stopOf(q),a=S.ans[i];
    const vis=h("div",{class:"qvis"}),body=h("div",{class:"qbody"});const box=h("article",{class:"qcard",style:{"--c":css(s.c)},"aria-labelledby":"q-h"},vis,body);host.append(box);
    if(V[q.vis]){const st=Stage(vis,{wide:[600,340],bg:gridOnly,draw:(c,now)=>V[q.vis](c,now)});kill=()=>st.kill();}
    body.append(h("p",{class:"qtag"},h("i"),fill(Q.ui.scenario,{n:i+1,of:QS.length})+" · "+s.name),h("h3",{id:"q-h"},q.title),h("p",{class:"qsit",html:md(q.sit)}));
    const feed=h("div",{"aria-live":"polite"});
    const done=(ok,pick,why)=>{S.ans[i]={ok,pick};save();renderBar();showFeed(ok,why);foot();};
    function showFeed(ok,why){feed.textContent="";feed.append(h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,(ok?"✓ ":"✗ ")+(ok?Q.ui.good:Q.ui.notQuite)),h("p",{html:md((why?why+" ":"")+q.why)})));}
    // four formats
    if(q.type==="choice"){const opts=h("div",{class:"qopts",role:"group","aria-label":q.title});const bs=q.opts.map((o,k)=>{const b=h("button",{type:"button",class:"qopt",onclick:()=>pick(k)},h("span",{class:"k"},"ABCDEFG"[k]),h("span",null,o.t,h("small",{hidden:true})));opts.append(b);return b;});
      function mark(k){bs.forEach((b,j)=>{b.disabled=true;const o=q.opts[j];if(o.ok)b.classList.add("ok");else if(j===k)b.classList.add("no");if(j===k||o.ok){const sm=b.querySelector("small");if(o.why){sm.hidden=false;sm.textContent=o.why;}}});}
      function pick(k){if(S.ans[i])return;mark(k);done(!!q.opts[k].ok,k,"");}
      body.append(opts);if(a){mark(a.pick);showFeed(a.ok,"");}}
    else if(q.type==="sort"){const wrap=h("div",{class:"qsort"+(q.buckets.length>2?" stack":"")}),sel=a?a.pick.slice():q.items.map(()=>null);
      const rows=q.items.map((it,k)=>{const seg=h("div",{class:"qseg",role:"group","aria-label":it.t});q.buckets.forEach(([bk,bl])=>{seg.append(h("button",{type:"button","aria-pressed":sel[k]===bk?"true":"false",onclick:e=>{if(S.ans[i])return;sel[k]=bk;[...seg.children].forEach(x=>x.setAttribute("aria-pressed",x===e.currentTarget));chk.disabled=sel.includes(null);}},bl));});
        const row=h("div",{class:"row"},h("span",{class:"t"},it.t),seg);wrap.append(row);return row;});
      const chk=h("button",{type:"button",class:"btn primary",disabled:sel.includes(null)?true:null,onclick:()=>{if(S.ans[i])return;check();const n=q.items.filter((it,k)=>sel[k]===it.b).length;done(n===q.items.length,sel.slice(),fill(Q.ui.nOf,{n,of:q.items.length}));}},Q.ui.check);
      function check(){rows.forEach((r,k)=>{const ok=sel[k]===q.items[k].b;r.classList.add(ok?"ok":"no");if(!ok){const right=q.buckets.find(b=>b[0]===q.items[k].b)[1];r.append(h("p",{class:"fix"},"→ "+right+(q.items[k].why?": "+q.items[k].why:"")));}[...r.querySelectorAll("button")].forEach(b=>b.disabled=true);});chk.remove();}
      body.append(wrap,chk);if(a){check();const n=q.items.filter((it,k)=>sel[k]===it.b).length;showFeed(a.ok,fill(Q.ui.nOf,{n,of:q.items.length}));}}
    else if(q.type==="order"){let ord=a?a.pick.slice():q.start.slice();const ol=h("ol",{class:"qorder"});
      function draw(checked){ol.textContent="";ord.forEach((k,pos)=>{const ok=checked&&k===pos;const li=h("li",{class:checked?(ok?"ok":"no"):null},h("span",{class:"n"},String(pos+1)),h("span",null,q.items[k]),
          checked?h("span",{style:{fontSize:"13px",color:ok?"var(--good)":"var(--bad)"}},ok?"✓":fill(Q.ui.belongs,{n:k+1})):h("span",{class:"mv"},h("button",{type:"button","aria-label":Q.ui.up+": "+q.items[k],disabled:pos===0?true:null,onclick:()=>move(pos,-1)},"↑"),h("button",{type:"button","aria-label":Q.ui.down+": "+q.items[k],disabled:pos===ord.length-1?true:null,onclick:()=>move(pos,1)},"↓")));ol.append(li);});}
      function move(pos,d){const j=pos+d;[ord[pos],ord[j]]=[ord[j],ord[pos]];draw(false);const b=ol.children[j].querySelectorAll(".mv button")[d<0?0:1];if(b&&!b.disabled)b.focus();else{const o=ol.children[j].querySelector(".mv button:not([disabled])");if(o)o.focus();}}
      const chk=h("button",{type:"button",class:"btn primary",onclick:()=>{if(S.ans[i])return;draw(true);chk.remove();const n=ord.filter((k,p)=>k===p).length;done(n===ord.length,ord.slice(),fill(Q.ui.nOf,{n,of:ord.length}));}},Q.ui.check);
      body.append(ol);if(a){draw(true);const n=ord.filter((k,p)=>k===p).length;showFeed(a.ok,fill(Q.ui.nOf,{n,of:ord.length}));}else{draw(false);body.append(chk);}}
    else if(q.type==="spot"){const hd=h("div",{class:"qhead","aria-hidden":"true"},q.cols.map(c=>h("span",null,c)));const list=h("div",{style:{display:"grid",gap:"6px",margin:"4px 0 12px"}});
      const bs=q.rows.map((r,k)=>{const b=h("button",{type:"button",class:"qopt",style:{gridTemplateColumns:"1fr 1fr 1.4fr",fontFamily:"var(--mono)",fontSize:"12.5px",fontWeight:"500"},onclick:()=>{if(S.ans[i])return;mark(k);done(k===q.answer,k,q.rowWhy[k]||"");}},r.map(v=>h("span",{class:v===""?"empty":null,style:v===""?{color:"var(--bad)",fontStyle:"italic"}:null},v===""?Q.ui.empty:v)));list.append(b);return b;});
      function mark(k){bs.forEach((b,j)=>{b.disabled=true;if(j===q.answer)b.classList.add("ok");else if(j===k)b.classList.add("no");});}
      body.append(hd,list);if(a){mark(a.pick);showFeed(a.ok,q.rowWhy[a.pick]||"");}}
    body.append(feed);
    const ft=h("div",{class:"qfoot"});body.append(ft);
    function foot(){ft.textContent="";const last=Object.keys(S.ans).length===QS.length;
      ft.append(h("a",{class:"link",href:LD.labsHref(q.stop)},fill(Q.ui.explore,{n:s.n,name:s.name})));
      if(S.ans[i]){const nx=QS.findIndex((_,j)=>j>i&&!S.ans[j]),nx2=nx<0?QS.findIndex((_,j)=>!S.ans[j]):nx;
        ft.append(h("button",{type:"button",class:"btn primary",onclick:()=>{if(last){S.sum=true;}else S.cur=nx2;save();render();root.scrollIntoView({block:"start"});}},last?Q.ui.results+" →":Q.ui.next+" →"));}}
    foot();}
  function summary(){const n=QS.length,ok=Object.values(S.ans).filter(a=>a.ok).length,p=Math.round(ok/n*100);
    const band=Q.bands.find(b=>ok>=b[0]);const mast=h("div",{class:"mastery"});
    LD.STOPS.forEach(s=>{const qs=QS.map((q,i)=>[q,i]).filter(([q])=>q.stop===s.id);if(!qs.length)return;const good=qs.filter(([q,i])=>S.ans[i]&&S.ans[i].ok).length;
      mast.append(h("a",{class:good===qs.length?"ok":"no",style:{"--c":css(s.c)},href:LD.labsHref(s.id),title:Q.ui.review},h("i"),s.name+" "+good+"/"+qs.length));});
    const miss=LD.STOPS.filter(s=>QS.some((q,i)=>q.stop===s.id&&!(S.ans[i]&&S.ans[i].ok)));
    host.append(h("div",{class:"qdone"},h("div",{class:"ring",style:{"--p":p}},h("b",null,ok+"/"+n)),
      h("div",null,h("h3",null,band[1]),h("p",null,band[2]),h("p",{style:{fontWeight:700,color:"var(--fg)",marginBottom:"6px"}},Q.ui.byStop),mast,
        h("div",{class:"cta"},miss.length?h("a",{class:"btn primary",href:LD.labsHref(miss[0].id)},fill(Q.ui.reviewFirst,{name:miss[0].name})):null,h("button",{type:"button",class:"btn",onclick:()=>{S.ans={};S.cur=0;S.sum=false;save();render();}},"↺ "+Q.ui.restart)))));}
  render();};
})();
