/* Learning Data: labs 5 to 8 of "Take it apart" (meaning, two speeds, ways out, apps and Genie). */
(()=>{"use strict";
const LD=window.LD;if(!LD)return;
const{h,md,fill,css,clock,Stage,textBlock,miniCard,lockBadge,copyStack,X}=LD;
const HOT=[90,220,255],AMBER=[255,200,90],TEAL=[47,211,192];
const ease2=t=>ease(clamp(t,0,1));
const pathPts=a=>a.map(p=>P(p[0],p[1]));
const along=(pts,u)=>at(mk(pathPts(pts)),clamp(u,0,1));
const num=(n,loc)=>Math.round(n).toLocaleString(loc);

/* ===== 5. Meaning: define it once, who sees what, knowledge where it lives ===== */
LD.LABS.meaning=(host,S)=>{const L=S.lab,sh=LD.shell(host,S,{tabs:true});let kill=null,cur=null;
  const TABS=[["define",L.tabs.define],["who",L.tabs.who],["know",L.tabs.know]];
  const tabBtns=TABS.map(([k,l])=>h("button",{type:"button",class:"chip-btn","aria-pressed":"false",onclick:()=>show(k)},l));sh.tabs.append(...tabBtns);
  function show(k){if(cur===k)return;cur=k;tabBtns.forEach((b,i)=>b.setAttribute("aria-pressed",TABS[i][0]===k));if(kill){kill();kill=null;}sh.stage.textContent="";sh.controls.textContent="";sh.read.textContent="";
    [...sh.box.querySelectorAll(".lab-extra")].forEach(e=>e.remove());kill=({define,who,know})[k]();}
  // define it once: three teams, three numbers, one certified definition
  function define(){const D=L.define;let on=false;const loc=X.lang==="es"?"es-MX":"en-US";
    const cards=h("div",{class:"lab-cards lab-extra"});sh.stage.append(cards);
    const els=D.teams.map(t=>{const n=h("div",{class:"num"},num(t.n,loc)),d=h("p",null,t.def),b=h("span",{class:"badge dim"},D.own);const card=h("div",{class:"mcard"},h("h5",null,t.team),n,d,h("p",{style:{marginTop:"8px"}},b));cards.append(card);return{card,n,d,b,t};});
    const defc=h("p",{class:"lab-info lab-extra"});sh.box.insertBefore(defc,sh.say);
    function paint(){els.forEach(e=>{e.card.classList.toggle("cert",on);e.d.textContent=on?D.shared:e.t.def;e.b.className="badge "+(on?"gold":"dim");e.b.textContent=on?D.certified:D.own;});defc.innerHTML=on?md(D.catalog):md(D.before);sh.setSay(md(on?D.msgOn:D.msgOff));}
    function animate(){const t0=clock(),from=els.map(e=>parseInt(e.n.textContent.replace(/\D/g,""),10)||0);(function step(){const f=ease2((clock()-t0)/0.8);els.forEach((e,i)=>{e.n.textContent=num(lerp(from[i],on?D.shared_n:e.t.n,f),loc);});if(f<1)requestAnimationFrame(step);})();}
    sh.toggle(D.adopt,v=>{on=v;paint();animate();});paint();return null;}
  // who sees what: one table, a row filter and column masks per person
  function who(){const W=L.who;let role="officer";
    sh.controls.append(h("span",{class:"lbl"},W.as));sh.seg(null,Object.keys(W.roles).map(k=>[k,W.roles[k].label]),role,k=>{role=k;paint();},W.as);
    const wrap=h("div",{class:"utab-wrap"}),tab=h("table",{class:"utab"});wrap.append(tab);sh.stage.append(wrap);const pol=h("p",{class:"policy lab-extra"});sh.box.insertBefore(pol,sh.say);
    function paint(){const R=W.roles[role];tab.innerHTML="";const hd=h("tr");W.cols.forEach(c=>hd.append(h("th",{scope:"col"},c)));tab.append(h("thead",null,hd));const tb=h("tbody");
      W.rows.forEach(r=>{const gone=R.rows&&!R.rows.includes(r[0]);const tr=h("tr",{class:gone?"gone":null});r.forEach((v,i)=>{const m=R.mask.includes(i);tr.append(h("td",{class:m?"mask":null},m?"••••":v));});tb.append(tr);});
      tab.append(tb);pol.innerHTML=md(R.policy);sh.setSay(md(R.say));}
    paint();return null;}
  // knowledge where it lives: connect sources through MCP into Genie Ontology
  function know(){const K=L.know,on=[false,false,false,false],sent=[0,0,0,0];let limited=false;
    const SRC=[["lib",[120,200,255]],["doc",[255,176,64]],["books",[176,123,255]],["flow",[120,240,170]]];
    K.sources.forEach((s,i)=>sh.toggle(s[0],v=>{on[i]=v;if(v)sent[i]=clock();msg();}));
    sh.toggle(K.perm,v=>{limited=v;msg();});
    function msg(){const n=on.filter(Boolean).length;sh.setSay(md(!n?K.msg0:limited&&on[1]?K.msgPerm:fill(K.msgN,{n})));}
    function draw(c,now,s){const nw=s.narrow,act=on.filter(Boolean).length/4;
      const bx=nw?270:640,by=nw?486:250,bs=nw?0.44:0.5;brainNet(c,bx,by,bs,now,0.25+0.75*act,{labels:true});
      T(c,"Genie Ontology",bx,by+(nw?136:150),{w:800,size:20,align:"center",color:rgba(LAYER.gold,1)});
      SRC.forEach(([ic,col],i)=>{const x=nw?20:24,y=nw?14+i*84:40+i*104,w=nw?450:250,hh=nw?72:78;
        const blocked=limited&&i===1,a=on[i]?1:0.45;
        const pts=nw?[[x+w,y+hh/2],[506+i*6,y+hh/2],[506+i*6,370],[bx+60+i*14,by-80]]:[[x+w,y+hh/2],[x+w+60,y+hh/2],[bx-190,by-40+i*26]];
        if(on[i]){lane(c,pathPts(pts),blocked?[140,150,170]:[120,235,170],blocked?0.35:0.9);
          if(!blocked)spawn(now,0.9,1.1,i*0.3,u=>{const q=along(pts,u);glow(c,q.x,q.y,12,[120,235,170],1);});}
        withA(c,a,()=>sysCard(c,x,y,w,hh,K.sources[i][0],K.sources[i][1],col,ICON[ic]));
        if(on[i])tag(c,nw?x+w-70:x+w+62,nw?y+hh/2:y+hh/2-20,blocked?K.hidden:"MCP",blocked?[160,170,190]:[120,235,170],{align:"center",size:12});});}
    const stg=Stage(sh.stage,{wide:[960,470],narrow:[540,650],bp:560,label:L.tabs.know,draw});msg();return()=>stg.kill();}
  show("define");return()=>{if(kill)kill();};};

/* ===== 6. Two speeds: send each question to the engine that fits ===== */
LD.LABS.speeds=(host,S)=>{const L=S.lab,sh=LD.shell(host,S);
  const st={q:0,ans:{},anim:null};
  const list=h("div",{class:"qlist lab-extra"});sh.box.insertBefore(list,sh.controls);
  const items=L.qs.map((q,i)=>{const badge=h("span",{class:"badge dim"},L.pending);const b=h("button",{type:"button","aria-pressed":i===0?"true":"false",onclick:()=>{st.q=i;items.forEach((x,j)=>x.b.setAttribute("aria-pressed",j===i));sh.setSay(md(L.pickEngine));}},h("span",null,q.q),badge);list.append(b);return{b,badge};});
  sh.controls.append(h("span",{class:"lbl"},L.send));
  sh.btn(L.base,()=>send("base"),{class:"chip-btn",style:{"--c":css(TEAL)}});sh.btn(L.house,()=>send("house"),{class:"chip-btn"});
  const rRows=sh.readout(L.rowsRead),rTime=sh.readout(L.time),rScore=sh.readout(L.score);
  function send(eng){const q=L.qs[st.q],ok=q.eng===eng;st.ans[st.q]=ok;st.anim={eng,t0:clock(),ok,q};
    const it=items[st.q];it.badge.className="badge "+(ok?"good":"bad");it.badge.textContent=ok?(eng==="base"?L.baseShort:L.houseShort)+" ✓":L.retry;
    const m=eng==="base"?q.base:q.house;rRows(m[0]);rTime(m[1]);rScore(Object.values(st.ans).filter(Boolean).length+" / "+L.qs.length);
    sh.setSay((ok?'<span class="ok">✓ </span>':'<span class="warn">✗ </span>')+md(ok?q.why:q.wrong));
    if(ok){const nx=L.qs.findIndex((_,i)=>st.ans[i]!==true);if(nx>=0&&nx!==st.q)setTimeout(()=>{if(st.anim&&st.anim.q===q){st.q=nx;items.forEach((x,j)=>x.b.setAttribute("aria-pressed",j===nx));}},1600);}}
  function draw(c,now,s){const nw=s.narrow,A=st.anim,u=A?now-A.t0:99;
    const ph=nw?[130,190,1.05]:[160,200,1.3],hx=nw?[272,70,250,200]:[560,60,360,240],cb=nw?[130,372]:[160,396],ch=nw?[397,372]:[740,396];
    // the sync between the two
    const y1=nw?455:150,y2=nw?505:250,xa=nw?130:300,xb=nw?400:520;
    lane(c,pathPts([[xb,y1],[xa,y1]]),TEAL,0.7);lane(c,pathPts([[xa,y2],[xb,y2]]),LAYER.gold,0.7);
    spawn(now,1.2,1.4,0,v=>{glow(c,lerp(xb,xa,v),y1,10,TEAL,1);glow(c,lerp(xa,xb,v),y2,10,LAYER.gold,1);});
    tag(c,(xa+xb)/2,y1-24,L.synced,TEAL,{align:"center",size:13});tag(c,(xa+xb)/2,y2+26,L.flowBack,LAYER.gold,{align:"center",size:13});
    // Lakebase: the desk
    const onB=A&&A.eng==="base"?1-sstep(4,5,u):0;if(onB)glow(c,ph[0],ph[1],180,TEAL,0.25*onB);
    phone3(c,ph[0],ph[1],ph[2],{screen:"seat",ans:A&&A.eng==="base"?fin(u,0.15,0.2):0});
    chip(c,cb[0],cb[1],"databricks","Lakebase",L.baseSub,{align:"center",ts:19,ss:14,edge:onB?TEAL:null});
    if(A&&A.eng==="base"&&u<5)tag(c,ph[0],ph[1]-ph[2]*140,A.q.base[1],A.ok?GOOD:AMBER,{align:"center",size:15});
    // Lakehouse: the reading room
    const onH=A&&A.eng==="house"?1-sstep(5,6,u):0,scan=A&&A.eng==="house"?clamp(u/1.6,0,1):0;const[gx,gy,gw,gh]=hx,cols=13,rows=8,cw=gw/cols,chh=gh/rows;
    glass(c,gx-12,gy-12,gw+24,gh+24,14,onH?LAYER.gold:null,{glow:onH?20:0,ea:0.7});
    for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const v=0.2+0.8*Math.abs(Math.sin(r*1.3+k*0.7)),lit=onH&&k/cols<scan;c.fillStyle=rgba(mix([30,40,70],lit?LAYER.gold:[90,120,170],lit?v:0.35*v),1);rr(c,gx+k*cw+2,gy+r*chh+2,cw-4,chh-4,3);c.fill();}
    if(onH&&scan<1){const sx=gx+scan*gw;c.save();c.globalCompositeOperation="lighter";c.fillStyle=rgba(LAYER.gold,0.7);c.fillRect(sx-2,gy-8,4,gh+16);c.restore();}
    T(c,L.weeks,gx+gw,gy+gh+30,{w:600,size:13,align:"right",color:rgba(SOFT,0.9)});T(c,L.classes,gx,gy-20,{w:600,size:13,color:rgba(SOFT,0.9)});
    chip(c,ch[0],ch[1],"databricks","Lakehouse",L.houseSub,{align:"center",ts:19,ss:14,edge:onH?LAYER.gold:null});
    if(A&&A.eng==="house"&&u<6)tag(c,gx+gw/2,gy+gh/2,A.q.house[1],A.ok?GOOD:AMBER,{align:"center",size:15});}
  const stg=Stage(sh.stage,{wide:[960,450],narrow:[540,560],bp:560,label:L.title,draw});
  rScore("0 / "+L.qs.length);sh.setSay(md(L.start));return()=>stg.kill();};

/* ===== 7. Ways out: change the original and see who notices ===== */
LD.LABS.out=(host,S)=>{const L=S.lab,sh=LD.shell(host,S);
  const st={v:0,t0:-99,copyV:0,copyT:-99,sqlV:0,evV:0,shareV:0,lastQ:clock()};
  const val=v=>v?L.withdrawn:L.enrolled;
  const chg=sh.btn(L.change,()=>{st.v=1-st.v;st.t0=clock();chg.textContent=st.v?L.changeBack:L.change;sh.setSay(md(L.msgChanged));},{class:"chip-btn go"});
  sh.btn(L.copyJob,()=>{if(st.copyV===st.v){sh.setSay(md(L.msgCopySame));return;}st.copyT=clock();st.copyTo=st.v;sh.setSay(md(L.msgCopyRun));});
  const rCopies=sh.readout(L.copies),rLatest=sh.readout(L.latest);
  function consumer(c,x,y,w,hh,col,title,sub,value,state,stCol,nw){glass(c,x,y,w,hh,14,col,{glow:12,ea:0.55});led(c,x+10,y+12,4,hh-24,col);
    T(c,title,x+24,y+30,{w:700,size:nw?17:19});T(c,sub,x+24,y+52,{w:500,size:13,color:rgba(SOFT,0.95)});
    const vx=x+w-16;T(c,L.record+": "+value,vx,y+30,{w:700,size:nw?14:15,align:"right",color:rgba(value===val(st.v)?INK:[255,160,150],1)});
    tag(c,vx-tw(c,state,12,700)-26,y+hh-18,state,stCol,{size:12});}
  function draw(c,now,s){const nw=s.narrow,u=now-st.t0;
    // the consumers catch up
    if(u>1.6)st.evV=st.v;
    if(now-st.lastQ>3){st.lastQ=now;st.sqlV=st.v;}
    st.shareV=st.v;
    const cu=now-st.copyT;if(cu>1.3&&st.copyT>0&&st.copyV!==st.copyTo){st.copyV=st.copyTo;sh.setSay(md(L.msgCopyDone));}
    const latest=[st.evV,st.sqlV,st.copyV,st.shareV].filter(v=>v===st.v).length;rLatest(latest+" / 4");rCopies("1");
    // gold: the original
    const g=nw?[20,16,500,122]:[24,92,200,380];
    if(nw){glass(c,g[0],g[1],g[2],g[3],18,LAYER.gold,{glow:20,ea:0.7});chip(c,g[0]+16,g[1]+36,"databricks",L.gold,null,{ts:18});}
    else vault(c,g[0],g[1],g[2],g[3],LAYER.gold,(r,k)=>hash(r*9+k,4)>0.55?null:DOM[["students","teaching","research","finance"][(hash(r*5+k,6)*4)|0]].c,L.gold,null);
    const rc=nw?[g[0]+220,g[1]+26,264,70]:[g[0]+12,g[1]+g[3]-96,g[2]-24,80];const flash=u<0.8?1-u/0.8:0;
    glass(c,rc[0],rc[1],rc[2],rc[3],12,flash?LAYER.gold:[170,200,245],{fill:"rgba(7,12,24,0.95)",glow:flash?24:0});T(c,"Alex Rivera · DS101",rc[0]+14,rc[1]+28,{w:700,size:15});T(c,val(st.v),rc[0]+14,rc[1]+54,{w:800,size:18,color:rgba(st.v?[255,160,150]:GOOD,1)});
    // four ways out
    const rowsY=nw?[228,388,548,708]:[88,210,332,454],ix=nw?64:300,cx=nw?122:470,cw=nw?400:470,chh=nw?104:88;
    rowsY.forEach((y,i)=>{const from=nw?[40,g[1]+g[3]]:[g[0]+g[2],y],p=nw?[[40,g[1]+g[3]],[40,y],[ix-34,y]]:[[g[0]+g[2],clamp(y,g[1]+30,g[1]+g[3]-30)],[g[0]+g[2]+30,y],[ix-40,y]];
      lane(c,pathPts(p),LAYER.gold,0.55);lane(c,pathPts([[ix+40,y],[cx,y]]),[235,240,255],i===2&&st.copyV!==st.v?0.25:0.6);});
    // 1 events: the bell rings, and the system comes back for what it needs
    {const y=rowsY[0],ring=u<1.4?1-u/1.4:0;bellGlyph(c,ix,y,0.62,ring);T(c,L.ways[0],ix,y+(nw?42:46),{w:700,size:13,align:"center",color:rgba(SOFT,1)});
      if(u>0.2&&u<0.8)glow(c,lerp(ix+40,cx,(u-0.2)/0.6),y,12,LAYER.gold,1);if(u>0.8&&u<1.6){const w=(u-0.8)/0.8,x=w<0.5?lerp(cx,ix+40,w*2):lerp(ix+40,cx,(w-0.5)*2);dtile(c,x,y,24,0,{cell:5,q:2},1);}
      consumer(c,cx,y-chh/2,cw,chh,DOM.finance.c,L.cons[0][0],L.cons[0][1],val(st.evV),st.evV===st.v?(u<4?L.stUpdated:L.stLatest):L.stNotified,st.evV===st.v?GOOD:AMBER,nw);}
    // 2 SQL endpoint: reads the original on every query
    {const y=rowsY[1],q=now-st.lastQ;chip(c,ix,y,"databricks","SQL",null,{align:"center",ts:15,lh:22});T(c,L.ways[1],ix,y+(nw?42:46),{w:700,size:13,align:"center",color:rgba(SOFT,1)});
      if(q<0.7){glow(c,lerp(cx,ix+40,q/0.7),y,10,HOT,1);}
      consumer(c,cx,y-chh/2,cw,chh,DOM.teaching.c,L.cons[1][0],L.cons[1][1],val(st.sqlV),st.sqlV===st.v?L.stLatest:L.stNextQuery,st.sqlV===st.v?GOOD:AMBER,nw);}
    // 3 copies: somebody has to keep them up to date
    {const y=rowsY[2];copyStack(c,ix-30,y-2,st.copyV!==st.v,4);T(c,L.ways[2],ix,y+(nw?42:46),{w:700,size:13,align:"center",color:rgba(SOFT,1)});
      if(cu<1.3&&st.copyT>0){const q=along([[ix+40,y],[cx,y]],cu/1.3);c.fillStyle="rgba(236,242,250,0.95)";rr(c,q.x-12,q.y-9,24,18,3);c.fill();}
      consumer(c,cx,y-chh/2,cw,chh,[200,210,225],L.cons[2][0],L.cons[2][1],val(st.copyV),st.copyV===st.v?L.stCopied:L.stStale,st.copyV===st.v?GOOD:BAD,nw);}
    // 4 zero-copy: the projector shows the original, live
    {const y=rowsY[3];projector2(c,ix-6,y,0.62,false);cone(c,ix+22,y,cx,y-chh/2+6,cx,y+chh/2-6,LAYER.gold,0.9);T(c,L.ways[3],ix,y+(nw?42:46),{w:700,size:13,align:"center",color:rgba(SOFT,1)});
      consumer(c,cx,y-chh/2,cw,chh,DOM.research.c,L.cons[3][0],L.cons[3][1],val(st.shareV),L.stLive,GOOD,nw);}}
  const stg=Stage(sh.stage,{wide:[960,530],narrow:[540,780],bp:560,label:L.title,draw});
  sh.setSay(md(L.start));return()=>stg.kill();};

/* ===== 8. Apps and Genie: ask, and fix a record ===== */
LD.LABS.people=(host,S)=>{const L=S.lab,sh=LD.shell(host,S,{tabs:true});let kill=null,cur=null;
  const TABS=[["genie",L.tabs.genie],["app",L.tabs.app]];
  const tabBtns=TABS.map(([k,l])=>h("button",{type:"button",class:"chip-btn","aria-pressed":"false",onclick:()=>show(k)},l));sh.tabs.append(...tabBtns);
  function show(k){if(cur===k)return;cur=k;tabBtns.forEach((b,i)=>b.setAttribute("aria-pressed",TABS[i][0]===k));if(kill){kill();kill=null;}sh.stage.textContent="";sh.controls.textContent="";sh.read.textContent="";[...sh.box.querySelectorAll(".lab-extra")].forEach(e=>e.remove());kill=(k==="genie"?genie:app)();}
  function genie(){const G=L.genie,st={p:"head",q:"seats",t0:clock()};
    sh.controls.append(h("span",{class:"lbl"},G.who));sh.seg(null,Object.keys(G.people).map(k=>[k,G.people[k]]),st.p,k=>{st.p=k;st.t0=clock();say();},G.who);
    const list=h("div",{class:"qlist lab-extra"});sh.box.insertBefore(list,sh.controls);
    const qb=Object.keys(G.qs).map(k=>{const b=h("button",{type:"button","aria-pressed":k===st.q?"true":"false",onclick:()=>{st.q=k;st.t0=clock();qb.forEach(x=>x.setAttribute("aria-pressed",x===b));say();}},h("span",null,G.qs[k]));list.append(b);return b;});
    function say(){const A=G.ans[st.p][st.q];sh.setSay(md(A.say));}
    function draw(c,now,s){const nw=s.narrow,u=now-st.t0,A=G.ans[st.p][st.q];
      const br=nw?[270,112,0.33]:[210,168,0.36],ob=nw?[270,262,26]:[210,352,30],gc=nw?[270,322]:[210,432];
      brainNet(c,br[0],br[1],br[2],now,0.4+0.5*(u<2?1-u/2:0),{labels:false});c.save();c.setLineDash([4,8]);c.strokeStyle=rgba(LAYER.gold,0.55);c.lineWidth=2;c.beginPath();c.moveTo(ob[0],ob[1]-ob[2]-6);c.lineTo(br[0],br[1]+br[2]*200);c.stroke();c.restore();
      orb(c,ob[0],ob[1],ob[2]*(1+(u<1.2?0.15*Math.sin(u*14)*(1-u/1.2):0)),now);chip(c,gc[0],gc[1],"databricks","Genie",G.guided,{align:"center",edge:LAYER.gold,ts:18,ss:13});
      tag(c,nw?20:24,nw?24:28,G.asking+": "+G.people[st.p],[170,200,245],{size:13});
      const bq=nw?[20,368,500,88]:[392,22,548,96],qa=fin(u,0,0.35);
      withA(c,qa,()=>{glass(c,bq[0],bq[1],bq[2],bq[3],16,[230,236,248],{glow:10,ea:0.6,fill:"rgba(244,241,234,0.97)"});textBlock(c,G.qs[st.q],bq[0]+20,bq[1]+36,bq[2]-40,{w:700,size:nw?19:21,color:"#141821"},nw?26:28);});
      const ac=nw?[20,472,500,318]:[392,136,548,330],aa=fin(u,0.7,0.5);
      withA(c,aa,()=>{glass(c,ac[0],ac[1],ac[2],ac[3],16,LAYER.gold,{glow:16,ea:0.7,fill:"rgba(8,14,26,0.96)"});let y=ac[1]+42;
        T(c,A.title,ac[0]+22,y,{w:800,size:nw?22:26});y+=12;
        const lh=nw?22:27;A.lines.forEach((l,i)=>{c.save();c.globalAlpha*=fin(u,1+i*0.25,0.3);y+=textBlock(c,l,ac[0]+22,y+24,ac[2]-(A.masked&&i===0?130:44),{w:600,size:nw?16:19,color:rgba(SOFT,1)},lh)*lh;c.restore();});y+=20;
        if(A.sugg){c.save();c.globalAlpha*=fin(u,1.6,0.3);c.fillStyle="rgba(120,240,170,0.14)";rr(c,ac[0]+18,y,ac[2]-36,42,8);c.fill();T(c,A.sugg,ac[0]+32,y+28,{w:700,size:nw?15:18,color:rgba(GOOD,1)});c.restore();y+=58;}
        withA(c,fin(u,1.9,0.3),()=>{T(c,G.sources,ac[0]+22,y+8,{w:700,size:13,color:rgba(SOFT,0.8)});let tx=ac[0]+22,ty=y+34;A.src.forEach(sr=>{const w=tw(c,sr,14,700)+26;if(tx+w>ac[0]+ac[2]-16){tx=ac[0]+22;ty+=34;}tag(c,tx,ty,sr,LAYER.gold,{size:14});tx+=w+8;});});
        if(A.masked)withA(c,fin(u,2.2,0.3),()=>lockBadge(c,ac[0]+ac[2]-90,ac[1]+24,1,G.masked));});}
    const stg=Stage(sh.stage,{wide:[960,490],narrow:[540,800],bp:560,label:L.tabs.genie,draw});say();return()=>stg.kill();}
  function app(){const P_=L.app,st={t0:-99};
    sh.btn(P_.fix,()=>{st.t0=clock();sh.setSay(md(P_.msgFix));},{class:"chip-btn go"});sh.btn(P_.reset,()=>{st.t0=-99;sh.setSay(md(P_.start));});
    function draw(c,now,s){const nw=s.narrow,u=st.t0>0?now-st.t0:-1;
      const sc=nw?[20,64,500,290]:[30,70,470,290],lb=nw?[270,420]:[640,215],vt=nw?[170,500,200,210]:[790,60,150,330];
      screen2(c,sc[0],sc[1],sc[2],sc[3],[150,200,255]);chip(c,sc[0]+sc[2]/2,sc[1]-30,"databricks","Databricks App",P_.appSub,{align:"center",ts:17,ss:13});
      c.save();c.fillStyle="#eef1f7";const rx=sc[0]+24,ry=sc[1]+24,rw=sc[2]-48,rh=sc[3]-48;rr(c,rx,ry,rw,rh,12);c.fill();c.fillStyle="#c9d3e3";c.beginPath();c.arc(rx+60,ry+70,38,0,TAU);c.fill();
      T(c,"Alex Rivera",rx+118,ry+64,{w:800,size:26,color:"#141821"});T(c,P_.sid+" 10482213",rx+118,ry+92,{w:600,size:16,color:"#4b5563"});
      const ty=u<0?0:clamp((u-0.2)/1.4,0,1),val=ty<=0?"BSc Dta Sci":"BSc Data Science".slice(0,Math.max(4,Math.round(16*ty)));
      T(c,P_.degree,rx+22,ry+168,{w:700,size:17,color:"#4b5563"});c.fillStyle=ty>0?"rgba(60,190,110,0.28)":"rgba(255,90,90,0.25)";rr(c,rx+110,ry+140,rw-130,40,8);c.fill();T(c,val,rx+122,ry+167,{f:"mono",w:500,size:19,color:"#141821"});c.restore();
      const pts=nw?[[270,sc[1]+sc[3]],[270,lb[1]],[270,vt[1]+30]]:[[sc[0]+sc[2],lb[1]],[lb[0],lb[1]],[vt[0]+20,lb[1]]];lane(c,pathPts(pts),GOOD,0.8);
      vault(c,vt[0],vt[1],vt[2],vt[3],LAYER.bronze,(r,k)=>hash(r*5+k,3)>0.6?null:APP.sis.c,L.bronze,null);
      chip(c,lb[0],lb[1],"databricks","Lakebase",P_.lbSub,{align:"center",ts:17,ss:13,edge:u>1.7&&u<3.2?GOOD:null});
      if(u>1.7){const w=clamp((u-1.7)/2.2,0,1),q=along(pts,ease2(w));dtile(c,q.x,q.y,36,0,{cell:7,q:2},1-sstep(0.92,1,w));}
      if(u>2.3)withA(c,fin(u,2.3),()=>tag(c,nw?270:lb[0],nw?lb[1]+48:lb[1]+50,P_.saved,GOOD,{align:"center",size:13}));
      if(u>3.9)withA(c,fin(u,3.9),()=>tag(c,nw?270:vt[0]+vt[2]/2,nw?vt[1]+vt[3]+22:vt[1]+vt[3]+26,P_.back,GOOD,{align:"center",size:13}));}
    const stg=Stage(sh.stage,{wide:[960,440],narrow:[540,760],bp:560,label:L.tabs.app,draw});sh.setSay(md(P_.start));return()=>stg.kill();}
  show("genie");return()=>{if(kill)kill();};};
})();
