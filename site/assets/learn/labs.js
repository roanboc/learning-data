/* Learning Data: the eight labs of "Take it apart". Each lab draws with the film's components (appCard, hub, vault, chip, tag, dtile, sketchA, painting2, ledFrame, plaque, phone3, orb, brainNet, bellGlyph, projector2...). */
(()=>{"use strict";
const LD=window.LD;if(!LD)return;
const{h,md,fill,css,clock,Stage,textBlock,fileIcon,miniCard,stateCol,lockBadge,copyStack,X}=LD;
const HOT=[90,220,255],WARM=[255,176,64],AMBER=[255,200,90],GREY=[120,132,150];
const ease2=t=>ease(clamp(t,0,1));
const pathPts=a=>a.map(p=>P(p[0],p[1]));
function along(pts,u){return at(mk(pathPts(pts)),clamp(u,0,1));}

/* ===== 1. Capture: events and files ===== */
LD.LABS.capture=(host,S)=>{const L=S.lab,sh=LD.shell(host,S);
  const st={ev:[],files:[],rows:[],ckpt:0,down:false,lat:null,reading:0,batch:0,n:0};
  const LY={
    wide:{cards:{sis:[16,26,282,86],lms:[16,128,282,86],hr:[16,340,282,86],fin:[16,442,282,86]},hub:[440,120],hubR:52,integ:[440,214],zb:[656,120],hotTag:[656,52],zone:[330,346,190,170],al:[656,430],warmTag:[656,360],vault:[800,26,140,470],asTag:[870,522],
      evA:a=>{const y=a==="sis"?69:171;return[[298,y],[340,y],[440,120]];},evB:[[440,120],[800,120],[836,120]],drop:a=>[298,a==="hr"?383:485],readB:[[520,430],[800,430],[836,430]],slot:i=>[356+(i%4)*38,i<4?420:470]},
    narrow:{mini:{sis:[12,14,120,64],lms:[140,14,120,64],hr:[278,14,120,64],fin:[406,14,120,64]},hub:[140,196],hubR:46,integ:[146,282],zb:[140,378],hotTag:[140,440],zone:[296,120,230,170],al:[411,378],warmTag:[411,440],vault:[20,476,500,300],asTag:[270,806],
      evA:a=>{const x=a==="sis"?72:200;return[[x,78],[x,120],[140,196]];},evB:[[140,196],[140,476],[140,510]],drop:a=>[a==="hr"?338:466,78],readB:[[411,290],[411,476],[411,510]],slot:i=>[326+(i%4)*48,i<4?196:250]}};
  const say=sh.setSay,rLat=sh.readout(L.readLat),rCk=sh.readout(L.readCk),rRows=sh.readout(L.readRows);
  function readouts(){rLat(st.lat==null?"–":st.lat.toFixed(1)+" s");rCk(fill(L.files,{n:st.ckpt}));rRows(String(st.rows.length));}readouts();
  sh.btn(L.enrol,()=>{st.n++;st.ev.push({t0:clock(),app:st.n%3===0?"lms":"sis",k:st.n});say(md(st.down?L.msgSentDown:L.msgSent));},{class:"chip-btn go"});
  sh.btn(L.drop,()=>{const now=clock();let fs=st.files;while(fs.filter(f=>!f.gone).length>6){const r=fs.find(f=>f.read&&!f.gone);if(!r)break;r.gone=true;}
    if(fs.filter(f=>!f.gone).length>6){say(md(L.msgFull));return;}const used=fs.filter(f=>!f.gone).map(f=>f.slot);const free=[0,1,2,3,4,5,6,7].filter(i=>!used.includes(i));
    st.batch++;["hr","fin"].forEach((a,i)=>fs.push({app:a,t0:now+i*0.25,slot:free[i],night:st.batch}));say(md(L.msgFiles));});
  sh.btn(L.run,()=>{const now=clock(),fresh=st.files.filter(f=>!f.gone&&!f.read&&f.readAt==null&&now>=f.t0+0.8);
    if(st.reading){return;}if(!fresh.length){say(md(st.files.some(f=>!f.gone&&now<f.t0+0.8)?L.msgWait:L.msgNone));return;}
    fresh.forEach((f,i)=>{f.readAt=now+i*0.4;});st.reading=fresh.length;st.readN=fresh.length;say(md(L.msgReading));});
  sh.toggle(L.outage,v=>{st.down=v;const now=clock();if(!v)st.ev.forEach(e=>{if(e.held&&e.rel==null)e.rel=now;});say(md(v?L.msgDown:L.msgUp));});
  function update(now){
    st.ev.forEach(e=>{if(e.done)return;const a=e.t0+0.7;if(now>=a&&!e.atHub){e.atHub=true;if(st.down){e.held=true;say(md(L.msgRetry));}}
      if(e.held&&!st.down&&e.rel==null)e.rel=now;const leave=e.held?(e.rel==null?Infinity:e.rel):a;
      if(now>=leave+1.1){e.done=true;st.rows.push(e.app);st.lat=leave+1.1-e.t0;say(md(fill(e.held?L.msgLandedHeld:L.msgLanded,{s:st.lat.toFixed(1)})));readouts();}});
    st.files.forEach(f=>{if(f.readAt!=null&&!f.read&&now>=f.readAt+1.2){f.read=true;st.ckpt++;st.rows.push(f.app);st.reading--;readouts();if(!st.reading)say(md(fill(L.msgRead,{n:st.readN,c:st.ckpt})));}});}
  function draw(c,now,s){update(now);const Y=s.narrow?LY.narrow:LY.wide;
    // lanes
    ["sis","lms"].forEach(a=>lane(c,pathPts(Y.evA(a)),APP[a].c,0.8));lane(c,pathPts(Y.evB),HOT,st.down?0.25:0.9);
    ["hr","fin"].forEach(a=>{const d=Y.drop(a),z=Y.zone;lane(c,pathPts(s.narrow?[d,[d[0],z[1]]]:[d,[z[0],d[1]]]),APP[a].c,0.6);});lane(c,pathPts(Y.readB),WARM,0.9);
    // sources
    if(s.narrow)Object.keys(Y.mini).forEach(a=>{const q=Y.mini[a];miniCard(c,q[0],q[1],q[2],q[3],APP[a].c,APP[a].s,L.subShort[a]);});
    else Object.keys(Y.cards).forEach(a=>{const q=Y.cards[a];appCard(c,q[0],q[1],q[2],q[3],a,{ts:18,sub:L.sub[a],n:0});});
    // the hot path
    hub(c,Y.hub[0],Y.hub[1],Y.hubR,now);const cs=s.narrow?{ts:17,ss:12}:{ts:19,ss:14};chip(c,Y.integ[0],Y.integ[1],null,L.integ,L.integSub,Object.assign({align:"center"},cs));
    withA(c,st.down?0.35:1,()=>chip(c,Y.zb[0],Y.zb[1],"databricks","Zerobus Ingest",L.zbSub,Object.assign({align:"center",edge:HOT},cs)));
    if(st.down)tag(c,Y.zb[0],Y.zb[1]+46,L.unreach,BAD,{align:"center",size:14});
    tag(c,Y.hotTag[0],Y.hotTag[1],L.hot,HOT,{align:"center",size:14});
    // the warm path
    const z=Y.zone;glass(c,z[0],z[1],z[2],z[3],14,WARM,{glow:10,ea:0.5});T(c,L.zone,z[0]+14,z[1]+26,{w:700,size:17});T(c,L.zoneSub,z[0]+14,z[1]+46,{w:500,size:13,color:rgba(SOFT,0.95)});
    chip(c,Y.al[0],Y.al[1],"databricks","Auto Loader",fill(L.ckpt,{n:st.ckpt}),Object.assign({align:"center",edge:st.reading?WARM:null},cs));
    tag(c,Y.warmTag[0],Y.warmTag[1],L.warm,WARM,{align:"center",size:14});
    // bronze
    const v=Y.vault,cols=Math.floor((v[2]-44)/23),rows=st.rows.slice(-cols*Math.floor((v[3]-150)/23));
    vault(c,v[0],v[1],v[2],v[3],LAYER.bronze,(r,k)=>{const i=r*cols+k;return i<rows.length?APP[rows[i]].c:null;},L.bronze,null);
    tag(c,Y.asTag[0],Y.asTag[1],L.asArrived,LAYER.bronze,{align:"center",size:14});
    // files
    st.files.forEach(f=>{if(f.gone)return;const sl=Y.slot(f.slot),d=Y.drop(f.app),u=(now-f.t0)/0.8;if(u<0)return;
      if(u<1){const q=P(lerp(d[0],sl[0],ease2(u)),lerp(d[1],sl[1],ease2(u))-Math.sin(u*Math.PI)*30);fileIcon(c,q.x,q.y,APP[f.app].c,APP[f.app].s,"new",now);return;}
      fileIcon(c,sl[0],sl[1],APP[f.app].c,APP[f.app].s,f.read?"read":(f.readAt!=null&&now>=f.readAt?"read":"new"),now);
      if(f.readAt!=null&&!f.read&&now>=f.readAt){const w=(now-f.readAt)/1.2,pts=[sl].concat(Y.readB),q=along(pts,ease2(w));dtile(c,q.x,q.y,30,0,{cell:(f.slot*5+f.night*3)%24,q:0,app:f.app},1-sstep(0.9,1,w));}});
    // events
    let held=0;st.ev.forEach(e=>{if(e.done)return;const u=(now-e.t0)/0.7,sp={cell:(e.k*7)%24,q:0,app:e.app};
      if(u<1){const q=along(Y.evA(e.app),ease2(u));dtile(c,q.x,q.y,30,0,sp,1);return;}
      const leave=e.held?(e.rel==null?Infinity:e.rel):e.t0+0.7;
      if(now<leave){const a=now*2.2+e.k*1.7,r=Y.hubR*0.95;dtile(c,Y.hub[0]+Math.cos(a)*r,Y.hub[1]+Math.sin(a)*r,26,0,sp,1);held++;return;}
      const w=(now-leave)/1.1,q=along(Y.evB,ease2(w));dtile(c,q.x,q.y,30,0,sp,1-sstep(0.9,1,w));});
    if(held)tag(c,Y.hub[0],Y.hub[1]-Y.hubR-20,L.retrying,WARM,{align:"center",size:14});}
  const stg=Stage(sh.stage,{wide:[960,560],narrow:[540,830],bp:540,label:L.title,draw});
  say(md(L.start));return()=>stg.kill();};

/* ===== 2. The sketch: what does an enrolment link to? ===== */
LD.LABS.sketch=(host,S)=>{const L=S.lab,sh=LD.shell(host,S);
  const st={wrong:true,t:clock()-5,from:312,to:312,tv:clock()-5,sel:null};
  const val=w=>w?312:98;
  sh.controls.append(h("span",{class:"lbl"},L.linkLabel));
  sh.seg(null,[["course",L.course],["class",L.klass]],"course",k=>{const w=k==="course";if(w===st.wrong)return;const now=clock();st.from=cur(now);st.to=val(w);st.tv=now;st.wrong=w;st.t=now;st.sel=null;info();say();},L.linkLabel);
  const infoBox=h("p",{class:"lab-info"}),defs=h("div",{class:"lab-controls"});sh.box.insertBefore(defs,sh.say);sh.box.insertBefore(infoBox,sh.say);
  function defBtns(){defs.textContent="";defs.append(h("span",{class:"lbl"},L.defsLabel));(st.wrong?["Student","Course","Enrolment","Class"]:["Student","Enrolment","Class","Term","Course"]).forEach(n=>defs.append(h("button",{type:"button",class:"chip-btn sm","aria-pressed":st.sel===n?"true":"false",onclick:()=>{st.sel=st.sel===n?null:n;info();}},L.ent[n])));}
  function cur(now){return lerp(st.from,st.to,ease2((now-st.tv)/0.8));}
  function info(){defBtns();const d=st.sel&&L.defs[st.sel];infoBox.innerHTML=d?"<b>"+LD.esc(L.ent[st.sel]||st.sel)+".</b> "+md(d):md(L.defHint);}
  function say(){sh.setSay(md(st.wrong?L.msgWrong:L.msgRight));}
  function geo(s){return s.narrow?{sk:[10,16,520,330],card:[20,370,500,320]}:{sk:[16,40,580,420],card:[616,70,324,380]};}
  function boxes(wrong,sk){const E=wrong?{Student:[0.2,0.25],Course:[0.62,0.22],Enrolment:[0.62,0.72],Class:[0.2,0.76]}:{Student:[0.18,0.24],Class:[0.84,0.24],Enrolment:[0.51,0.24],Term:[0.84,0.76],Course:[0.18,0.76]};
    const sc=Math.min(1.4,sk[2]/800),bw=210*sc,bh=58*sc;return Object.keys(E).map(n=>[n,sk[0]+E[n][0]*sk[2]-bw/2,sk[1]+E[n][1]*sk[3]-bh/2,bw,bh]);}
  function draw(c,now,s){const g=geo(s),sk=g.sk,f=ease2((now-st.t)/0.9);
    if(f<1)sketchA(c,sk[0],sk[1],sk[2],sk[3],!st.wrong,1-f,{});
    sketchA(c,sk[0],sk[1],sk[2],sk[3],st.wrong,f,{rel:clamp((now-st.t)/1.2,0,1)});
    boxes(st.wrong,sk).forEach(([n,x,y,w,hh])=>{s.hit(n,x,y,w,hh);if(st.sel===n||s.hover===n){c.save();c.shadowColor=rgba(INK,0.9);c.shadowBlur=16;c.strokeStyle=rgba(INK,st.sel===n?0.95:0.5);c.lineWidth=2.5;rr(c,x-6,y-6,w+12,hh+12,14);c.stroke();c.restore();}});
    const q=g.card,v=cur(now),bad=v>100.5,col=bad?BAD:GOOD;
    glass(c,q[0],q[1],q[2],q[3],18,col,{glow:18,ea:0.7});
    T(c,L.fill.toUpperCase(),q[0]+22,q[1]+36,{w:800,size:14,color:rgba(SOFT,0.95)});T(c,L.klassName,q[0]+22,q[1]+64,{w:700,size:17});
    T(c,Math.round(v)+"%",q[0]+22,q[1]+(s.narrow?140:150),{w:800,size:s.narrow?64:72,color:rgba(col,1)});
    const bx=q[0]+22,by=q[1]+(s.narrow?166:180),bw=q[2]-44;c.fillStyle="rgba(255,255,255,0.08)";rr(c,bx,by,bw,14,7);c.fill();const cap=bw/3.3;c.fillStyle=rgba(col,0.9);rr(c,bx,by,Math.min(bw,cap*v/100),14,7);c.fill();
    c.strokeStyle="rgba(255,255,255,0.8)";c.lineWidth=2;c.beginPath();c.moveTo(bx+cap,by-6);c.lineTo(bx+cap,by+20);c.stroke();T(c,L.seats100,bx+cap,by+38,{w:600,size:13,align:"center",color:rgba(SOFT,0.9)});
    const calc=st.wrong?L.calcWrong:L.calcRight;textBlock(c,calc,q[0]+22,by+(s.narrow?72:78),q[2]-44,{w:600,size:16,color:rgba(INK,0.92)},22);
    tag(c,q[0]+22,q[1]+q[3]-26,st.wrong?L.testsPass:L.fits,GOOD,{size:14});}
  const stg=Stage(sh.stage,{wide:[960,500],narrow:[540,700],bp:540,label:L.title,draw,click:n=>{st.sel=st.sel===n?null:n;info();}});
  info();say();return()=>stg.kill();};

/* ===== 3. Refining with dbt: break something, run dbt build ===== */
LD.LABS.refine=(host,S)=>{const L=S.lab,sh=LD.shell(host,S);
  const NODES=[{id:"src",name:"src_sis",layer:0,tests:[]},{id:"stgE",name:"stg_enrolments",layer:1,tests:["not_null","unique"]},{id:"stgC",name:"stg_classes",layer:1,tests:["not_null","unique"]},{id:"int",name:"int_class_enrolments",layer:2,tests:["relationships"]},{id:"fct",name:"fct_class_fill",layer:3,tests:["contract"]},{id:"exp",name:L.expName,layer:4,tests:[],exp:true}];
  const EDGES=[["src","stgE"],["src","stgC"],["stgE","int"],["stgC","int"],["int","fct"],["fct","exp"]];
  const POS={wide:{src:[92,232],stgE:[292,160],stgC:[292,304],int:[492,232],fct:[690,232],exp:[862,232]},narrow:{src:[270,112],stgE:[150,242],stgC:[390,242],int:[270,392],fct:[270,540],exp:[270,684]}};
  const inc={late:false,nulls:false,dupe:false,orphan:false,rename:false};let run=null,sel=null;
  const reset=()=>{run=null;nBuild=0;if(go)go.disabled=false;log.textContent="";st={};NODES.forEach(n=>{st[n.id]={s:"idle",t:{}};});};let st={};
  const log=h("div",{class:"lab-log","aria-label":L.logLabel,role:"log"}),infoBox=h("p",{class:"lab-info"});
  sh.controls.append(h("span",{class:"lbl"},L.breakLabel));
  Object.keys(inc).forEach(k=>sh.toggle(L.inc[k],v=>{inc[k]=v;reset();say(md(L.msgArmed));}));
  const go=h("button",{type:"button",class:"chip-btn go",onclick:()=>start()},"▶ "+L.run);
  const rst=h("button",{type:"button",class:"chip-btn",onclick:()=>{reset();say(md(L.start));}},L.reset);
  const row2=h("div",{class:"lab-controls"},go,rst);sh.box.insertBefore(row2,sh.read);sh.box.insertBefore(log,sh.read);sh.box.insertBefore(infoBox,sh.read);
  const say=sh.setSay;
  function plan(){const steps=[],res={};const push=(node,kind,name,r,line)=>steps.push({node,kind,name,r,line});
    push("src","fresh","freshness",inc.late?"warn":"pass",inc.late?["warn","src_sis.enrolments","WARN · "+L.lateAge]:["pass","src_sis.enrolments","PASS"]);
    push("stgE","model","stg_enrolments","pass",["pass","stg_enrolments","OK"+(inc.dupe?" · "+L.dupeRemoved:"")]);
    push("stgE","test","not_null",inc.nulls?"fail":"pass",[inc.nulls?"fail":"pass","not_null_stg_enrolments_student_id",inc.nulls?"FAIL 1":"PASS"]);
    push("stgE","test","unique","pass",["pass","unique_stg_enrolments_enrolment_id","PASS"]);
    push("stgC","model","stg_classes","pass",["pass","stg_classes","OK"]);
    push("stgC","test","not_null","pass",["pass","not_null_stg_classes_class_id","PASS"]);
    push("stgC","test","unique","pass",["pass","unique_stg_classes_class_id","PASS"]);
    const intSkip=inc.nulls;push("int","model","int_class_enrolments",intSkip?"skip":"pass",[intSkip?"skip":"pass","int_class_enrolments",intSkip?"SKIP":"OK"]);
    const relFail=!intSkip&&inc.orphan;push("int","test","relationships",intSkip?"skip":relFail?"fail":"pass",[intSkip?"skip":relFail?"fail":"pass","relationships_int_class_enrolments_class_id",intSkip?"SKIP":relFail?"FAIL 1":"PASS"]);
    const fSkip=intSkip||relFail,fFail=!fSkip&&inc.rename;push("fct","model","fct_class_fill",fSkip?"skip":fFail?"fail":"pass",[fSkip?"skip":fFail?"fail":"pass","fct_class_fill"+(fFail?" · contract":""),fSkip?"SKIP":fFail?"ERROR":"OK"]);
    push("fct","test","contract",fSkip?"skip":fFail?"fail":"pass",null);
    push("exp","exp",L.expName,fSkip||fFail?"warn":"pass",null);return steps;}
  function start(){reset();const steps=plan(),t0=clock();run={steps,t0,i:-1};log.innerHTML='<span>$ dbt source freshness</span>\n';say(md(L.msgRunning));go.disabled=true;}
  function advance(now){if(!run)return;const dt=0.42,due=Math.floor((now-run.t0)/dt);while(run.i<Math.min(due,run.steps.length-1)){run.i++;const p=run.steps[run.i];apply(p);}
    if(run.i>=run.steps.length-1&&!run.done&&now-run.t0>run.steps.length*dt+0.2){run.done=true;finish();}}
  let nBuild=0;
  function apply(p){const n=st[p.node];if(p.kind==="fresh"){n.s=p.r;}else if(p.kind==="model"){n.s=p.r==="pass"?"pass":p.r;}else if(p.kind==="test"){n.t[p.name]=p.r;if(p.r==="fail")n.s="fail";}else if(p.kind==="exp"){n.s=p.r;}
    if(p.kind==="model"&&p.node==="stgE")log.innerHTML+='<span>$ dbt build</span>\n';
    if(p.line){const[cl,name,res]=p.line;const idx=p.kind==="fresh"?"  ":"  "+(++nBuild)+" of 9 ";const dots=".".repeat(Math.max(2,44-name.length));log.innerHTML+='<span class="'+cl+'">'+idx+LD.esc(name)+" "+dots+" "+LD.esc(res)+"</span>\n";log.scrollTop=log.scrollHeight;}
    const running=run.steps[run.i+1];if(running&&running.kind==="model"&&st[running.node].s==="idle")st[running.node].s="run";}
  function finish(){go.disabled=false;const steps=run.steps,c={pass:0,fail:0,skip:0,warn:0};steps.forEach(p=>{if(p.kind==="model"||p.kind==="test"){if(p.kind==="test"&&p.name==="contract")return;c[p.r]++;}});
    log.innerHTML+='<span class="'+(c.fail?"fail":"pass")+'">  Done. PASS='+c.pass+" WARN=0 ERROR="+c.fail+" SKIP="+c.skip+" TOTAL="+(c.pass+c.fail+c.skip)+"</span>\n";log.scrollTop=log.scrollHeight;nBuild=0;
    const msgs=[];if(inc.late)msgs.push(L.out.late);if(inc.nulls)msgs.push(L.out.nulls);if(inc.dupe)msgs.push(L.out.dupe);if(inc.orphan&&!inc.nulls)msgs.push(L.out.orphan);if(inc.rename&&!inc.nulls&&!inc.orphan)msgs.push(L.out.rename);
    if(inc.orphan&&inc.nulls)msgs.push(L.out.masked);if(inc.rename&&(inc.nulls||inc.orphan))msgs.push(L.out.masked2);
    if(!msgs.length)msgs.push(L.out.ok);say(msgs.map(m=>md(m)).join(" "));}
  const lin=(id,dir)=>{const out=new Set([id]);let grow=true;while(grow){grow=false;EDGES.forEach(([a,b])=>{const[f,t]=dir>0?[a,b]:[b,a];if(out.has(f)&&!out.has(t)){out.add(t);grow=true;}});}return out;};
  const nodeRow=h("div",{class:"lab-controls"});sh.box.insertBefore(nodeRow,infoBox);
  function nodeBtns(){nodeRow.textContent="";nodeRow.append(h("span",{class:"lbl"},L.lineageLabel));NODES.forEach(n=>nodeRow.append(h("button",{type:"button",class:"chip-btn sm","aria-pressed":sel===n.id?"true":"false",onclick:()=>{sel=sel===n.id?null:n.id;info();}},n.name)));}
  function info(){nodeBtns();if(!sel){infoBox.innerHTML=md(L.clickHint);return;}infoBox.innerHTML="<b>"+LD.esc(NODES.find(n=>n.id===sel).name)+"</b> · "+md(L.nodes[sel]);}
  function nodeFs(c,n){return n.exp?Math.min(13,13*136/tw(c,n.name,13,700)):15;}
  function nodeW(c,n){return tw(c,n.name,nodeFs(c,n),n.exp?700:500,n.exp?"sans":"mono")+28;}
  function draw(c,now,s){advance(now);const Pp=s.narrow?POS.narrow:POS.wide;
    // the layers behind the models
    const bands=[[L.layers[0],LAYER.bronze],[L.layers[1],LAYER.silver],[L.layers[2],LAYER.gold],[L.layers[3],DBT]];
    if(s.narrow){const R=[[40,178],[184,462],[468,610],[616,740]];R.forEach((r,i)=>{c.fillStyle=rgba(bands[i][1],0.05);rr(c,10,r[0],520,r[1]-r[0],14);c.fill();T(c,bands[i][0],22,r[0]+22,{w:800,size:12,color:rgba(bands[i][1],0.95)});});}
    else{const R=[[14,172],[178,596],[602,780],[786,946]];R.forEach((r,i)=>{c.fillStyle=rgba(bands[i][1],0.05);rr(c,r[0],24,r[1]-r[0],420,14);c.fill();T(c,bands[i][0],(r[0]+r[1])/2,48,{w:800,size:12,align:"center",color:rgba(bands[i][1],0.95)});});
      dtile(c,92,384,46,-0.05,{cell:9,q:0,app:"sis"},0.95);dtile(c,392,384,46,0,{cell:9,q:2},0.95);ledFrame(c,652,362,76,50,LAYER.gold,painting2("rules"),{pad:3,lw:1.5,glow:8});ledFrame(c,826,362,70,47,DOM.students.c,pv("students",1),{pad:3,lw:1.5,glow:8});}
    logo(c,"dbt",s.narrow?482:22,s.narrow?14:414,s.narrow?24:22);
    const hi=sel?new Set([...lin(sel,1),...lin(sel,-1)]):null;
    EDGES.forEach(([a,b])=>{const A=Pp[a],B=Pp[b],na=NODES.find(n=>n.id===a),nb=NODES.find(n=>n.id===b),sa=st[a].s,sb=st[b].s;
      const col=sb==="skip"?GREY:(sa==="pass"||sa==="warn")&&sb!=="idle"?LAYER.gold:DBT;const dim=hi&&!(hi.has(a)&&hi.has(b));
      c.save();c.globalAlpha*=dim?0.15:1;c.strokeStyle=rgba(col,sb==="idle"?0.55:0.9);c.lineWidth=sb==="idle"?2:3;if(sb==="skip")c.setLineDash([6,6]);c.beginPath();
      if(s.narrow){c.moveTo(A[0],A[1]+18);c.bezierCurveTo(A[0],A[1]+70,B[0],B[1]-70,B[0],B[1]-18);}else{const wa=nodeW(c,na)/2,wb=nodeW(c,nb)/2;c.moveTo(A[0]+wa,A[1]);c.bezierCurveTo(A[0]+wa+40,A[1],B[0]-wb-40,B[1],B[0]-wb,B[1]);}c.stroke();c.restore();});
    NODES.forEach(n=>{const[x,y]=Pp[n.id],w=nodeW(c,n),S_=st[n.id].s,col=stateCol(S_==="idle"?"":S_),dim=hi&&!hi.has(n.id);
      c.save();c.globalAlpha*=dim?0.25:1;if(S_==="run")glow(c,x,y,70,CYAN,0.35+0.2*Math.sin(now*8));if(S_==="pass")glow(c,x,y,60,LAYER.gold,0.22);
      c.fillStyle=n.exp?"rgba(255,105,75,0.18)":"rgba(10,16,32,0.96)";rr(c,x-w/2,y-18,w,36,9);c.fill();c.strokeStyle=rgba(col,S_==="idle"?0.8:1);c.lineWidth=sel===n.id?3:1.8;if(S_==="skip")c.setLineDash([5,5]);rr(c,x-w/2,y-18,w,36,9);c.stroke();c.setLineDash([]);
      T(c,n.name,x,y+5,{f:n.exp?"sans":"mono",w:n.exp?700:500,size:nodeFs(c,n),align:"center",color:S_==="skip"?rgba(GREY,1):rgba(INK,0.96)});
      if(S_!=="idle"&&S_!=="run"){const g=S_==="pass"?"✓":S_==="fail"?"✗":S_==="warn"?"!":"–";c.fillStyle=rgba(col,1);c.beginPath();c.arc(x+w/2,y-18,11,0,TAU);c.fill();T(c,g,x+w/2,y-13,{w:800,size:14,align:"center",color:"#0a0f1c"});}
      // tests under each model
      const ts=n.id==="src"?["freshness"]:n.tests;let tx=x-(ts.length*112-8)/2;ts.forEach(t=>{const r=n.id==="src"?(S_==="idle"||S_==="run"?"idle":S_):(st[n.id].t[t]||"idle"),tc=r==="idle"?SOFT:stateCol(r),g=r==="pass"?" ✓":r==="fail"?" ✗":r==="warn"?" !":r==="skip"?" –":"";
        c.save();c.fillStyle="rgba(7,12,24,0.9)";rr(c,tx,y+26,104,22,11);c.fill();c.strokeStyle=rgba(tc,0.8);c.lineWidth=1.3;rr(c,tx,y+26,104,22,11);c.stroke();c.restore();T(c,t+g,tx+52,y+41,{w:700,size:11.5,align:"center",color:rgba(tc,1)});tx+=112;});
      if(n.exp&&S_!=="idle")tag(c,x,y+(s.narrow?58:40),S_==="pass"?L.refreshed:L.keptGood,S_==="pass"?GOOD:AMBER,{align:"center",size:12});
      c.restore();s.hit(n.id,x-w/2,y-20,w,44);});}
  const stg=Stage(sh.stage,{wide:[960,450],narrow:[540,760],bp:560,label:L.title,draw,click:id=>{sel=sel===id?null:id;info();}});
  reset();info();say(md(L.start));return()=>stg.kill();};

/* ===== 4. Gold: one subject, four audiences ===== */
LD.LABS.gold=(host,S)=>{const L=S.lab,sh=LD.shell(host,S);
  const AUD=["analysts","execs","gov","live"],KIND={analysts:"realism",execs:"modern",gov:"rules",live:"live"};
  const st={a:"gov",prev:null,t:clock()-5};
  sh.controls.append(h("span",{class:"lbl"},L.pick));
  sh.seg(null,AUD.map(a=>[a,L.aud[a].label]),st.a,a=>{if(a===st.a)return;st.prev=st.a;st.a=a;st.t=clock();props();},L.pick);
  const cards=h("div",{class:"lab-cards"});sh.box.insertBefore(cards,sh.read);
  function props(){const A=L.aud[st.a];cards.innerHTML="";[[L.grain,A.grain],[L.fresh,A.fresh],[L.rules,A.rules]].forEach(([k,v])=>cards.append(h("div",{class:"mcard"},h("p",null,k),h("h5",null,v))));sh.setSay(md(A.say));}
  function draw(c,now,s){const f=ease2((now-st.t)/0.7),A=L.aud[st.a],dk=A.dom,dc=DOM[dk].c;
    const fr=s.narrow?[40,70,460,307]:[30,70,510,340],pl=s.narrow?[30,430,480]:[576,70,360];
    // domain row
    const doms=["teaching","students","research","finance"],dy=s.narrow?16:18,dw=s.narrow?122:224;
    doms.forEach((d,i)=>{const x=(s.narrow?12:36)+i*(s.narrow?130:228),on=d===dk,cc=DOM[d].c;withA(c,on?1:0.4,()=>{glass(c,x,dy,dw-(s.narrow?8:12),36,10,on?cc:null,{glow:on?14:0,ea:0.8,fill:"rgba(7,12,24,0.9)"});led(c,x+8,dy+9,4,18,cc);T(c,DOM[d].n,x+20,dy+24,{w:700,size:s.narrow?13:15});if(!s.narrow)T(c,L.counts[i],x+dw-24,dy+24,{w:600,size:12,align:"right",color:rgba(cc,1)});});});
    const draw1=(a,al)=>{const k=KIND[a],cc=DOM[L.aud[a].dom].c;withA(c,al,()=>{ledFrame(c,fr[0],fr[1],fr[2],fr[3],cc,painting2(k));if(k==="live")liveOverlay(c,fr[0],fr[1],fr[2],fr[3],now);});};
    if(st.prev&&f<1)draw1(st.prev,1-f);draw1(st.a,st.prev?f:1);
    tag(c,fr[0]+16,fr[1]+fr[3]-26,L.aud[st.a].style,dc,{size:15});
    const px=pl[0]+(1-f)*24;withA(c,f,()=>{const k=0.84;c.save();c.translate(px,pl[1]);c.scale(k,k);plaque(c,0,0,pl[2]/k,[[L.dp,A.product],[L.mart,A.mart,"dbt"],[L.exposure,A.exposure,"dbt"],[L.owner,A.owner]],dc);c.restore();});}
  const stg=Stage(sh.stage,{wide:[960,450],narrow:[540,680],bp:560,label:L.title,draw});
  props();return()=>stg.kill();};

})();
