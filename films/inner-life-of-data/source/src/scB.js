/* ===== v4 scenes, part B ===== */
function Iss(x,a,r){if(x<=a)return 0;if(x>=a+r)return x-a-r/2;const u=(x-a)/r;return r*(u*u*u-u*u*u*u/2);}
const RF2={X0:222,X1:1330,Y:560,V:65,INT:1.1,STG:548,DED:610,LEN:770,INTG:958,JOIN:1070};
function rfT(sc,t){const a=cue(sc,"rough")-0.3,b=Math.max(cue(sc,"rough")+4.6,cue(sc,"sources")+0.7),r=0.6;return t-(Iss(t,a,r)-Iss(t,b-r,r));}
function rfKeys(sc){if(sc._k)return sc._k;const te=x=>rfT(sc,x),V=RF2.V,I=RF2.INT;
  const kE=Math.round((te(cue(sc,"tests")+0.9)-(RF2.STG-RF2.X0)/V)/I),kO=Math.round((te(cue(sc,"orphan")+0.7)-(RF2.INTG-RF2.X0)/V)/I);
  const tf=te(cue(sc,"rough")+1),kmin=Math.ceil((tf-(520-RF2.X0)/V)/I),kmax=Math.floor((tf-(300-RF2.X0)/V)/I),EX=[];for(let k=kmin;k<=kmax;k++)EX.push(k);
  const role={};["glitch","dup","err","clock"].forEach((r,i)=>{if(EX[i]!=null)role[EX[i]]=r;});sc._k={kE,kO,EX,role};return sc._k;}
function rfProps(k,sc){const K=rfKeys(sc);let err=hash(k,51)<0.06,dup=!err&&hash(k,52)<0.1,orphan=!err&&!dup&&hash(k,53)<0.05,tag=null;
  if([K.kE-1,K.kE+1,K.kO-1,K.kO+1].indexOf(k)>=0||K.EX.indexOf(k)>=0){err=false;dup=false;orphan=false;}
  if(k===K.kE){err=true;dup=false;orphan=false;}if(k===K.kO){orphan=true;err=false;dup=false;}
  const r=K.role[k];if(r==="glitch")tag=["glitches",APP.lms.c,-60];else if(r==="dup"){dup=true;tag=["duplicate",APP.hr.c,-64];}else if(r==="err"){err=true;tag=["error",BAD,-60];}else if(r==="clock")tag=["different clocks",C.hot,66];
  return{cell:((hash(k,54)*24)|0),app:["sis","lms","hr","fin"][((k%4)+4)%4],err,dup,orphan,tag,rot:(hash(k,55)-0.5)*0.7,t0:k*RF2.INT};}
scene("refine",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cRe=c("recipes"),cRu=c("runs"),cCl=c("closer"),cRo=c("rough"),cSo=c("sources"),cSt=c("staging"),cTe=c("tests"),cIn=c("inter"),cOr=c("orphan"),cSi=c("silver"),cTr=c("trace");
  const cam=camAt([[0,820,520,0.95],[cCl-0.2,820,520,0.95],[cCl+1.3,400,560,2.4],[Math.max(cRo+3.8,cSo-0.1),420,560,2.4],[cSo+0.3,420,540,1.5],[cSt-0.2,420,540,1.5],[cSt+0.5,690,520,1.55],[cTe-0.1,690,520,1.55],[cTe+0.6,610,560,1.9],[cIn-0.2,610,560,1.9],[cIn+0.5,1070,520,1.55],[cOr-0.1,1070,520,1.55],[cOr+0.6,1000,560,1.9],[cSi-0.2,1000,560,1.9],[cSi+0.8,1560,480,1.35],[cTr-0.1,1560,480,1.35],[cTr+1.2,960,540,0.95],[sc.dur+2,960,540,0.97]],t);
  bgW(ctx,S,cam);const te=rfT(sc,t),Y=RF2.Y;
  vault(ctx,30,440,190,330,LAYER.bronze,(r,cc)=>hash(r*31+cc,5)>0.7?null:APP[["sis","lms","hr","fin"][(hash(r*7+cc,6)*4)|0]].c,null);T(ctx,"Bronze",125,482,{w:800,size:22,align:"center",color:rgba(LAYER.bronze,1)});
  beam(ctx,[P(222,Y),P(1330,Y)],[210,225,255],[[40,0.03],[14,0.06]]);
  const pA=fin(t,cRe);withA(ctx,pA,()=>{glass(ctx,340,176,960,132,18,DBT,{glow:18,ea:0.55});logo(ctx,"dbt",366,196,44);T(ctx,"dbt",424,230,{w:800,size:34});T(ctx,"models, tests, docs and lineage, in version control",424,262,{w:500,size:19,color:rgba(SOFT,0.95)});T(ctx,"select * from {{ ref('stg_enrolments') }}",424,292,{f:"mono",w:500,size:17,color:"rgba(255,190,170,0.95)"});
    const nx=[900,990,1080,1170,1250];nx.forEach((x,i)=>{const lit=t>cTr?clamp((t-cTr-0.3-(4-i)*0.3)/0.3,0,1):0;if(i){ctx.strokeStyle=rgba(DBT,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(nx[i-1]+12,236+(i%2)*28);ctx.lineTo(x-12,236+((i+1)%2)*28);ctx.stroke();}ctx.fillStyle=rgba(mix(DBT,[255,240,200],lit),0.95);ctx.beginPath();ctx.arc(x,236+((i+1)%2)*28,10+4*lit,0,TAU);ctx.fill();if(lit>0)glow(ctx,x,236+((i+1)%2)*28,30,LAYER.gold,lit*0.8);});});
  const housing=(x0,x1,a)=>withA(ctx,a,()=>{glass(ctx,x0,450,x1-x0,220,22,DBT,{glow:14,ea:0.45,fill:"rgba(30,20,30,0.28)"});const ta=fin(t,cTe-0.2);for(let k=0;k<Math.floor((x1-x0-40)/26);k++){const cx=x0+26+k*26;ctx.save();ctx.globalAlpha*=ta;ctx.strokeStyle=rgba(GOOD,0.9);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(cx-5,662);ctx.lineTo(cx-1,666);ctx.lineTo(cx+6,657);ctx.stroke();ctx.restore();}});
  const gA=[fin(t,cRe+0.8),fin(t,cRe+1.3),fin(t,cRe+1.8)];housing(540,840,gA[1]);housing(950,1190,gA[2]);
  withA(ctx,gA[0],()=>gate(ctx,330,Y,180,[190,225,255],"tests"));withA(ctx,gA[1],()=>{gate(ctx,RF2.DED,Y,180,[190,225,255],"dedupe");gate(ctx,RF2.LEN,Y,180,[190,225,255],"lens");});withA(ctx,gA[2],()=>gate(ctx,RF2.JOIN,Y,180,[190,225,255],"join"));
  [[340,"sources","declared, freshness checked",0,cSo],[690,"staging models","clean each source, one clock",1,cSt],[1070,"intermediate models","joined as the sketch says",2,cIn]].forEach(([x,tt,sb,i,cc])=>withA(ctx,gA[i],()=>{const hl=t>cc&&t<cc+2.5?0.6*(1-(t-cc)/2.5):0;ctx.save();ctx.strokeStyle=rgba(DBT,0.45);ctx.setLineDash([4,6]);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,310);ctx.lineTo(x,358);ctx.moveTo(x,422);ctx.lineTo(x,450);ctx.stroke();ctx.restore();if(hl>0)glow(ctx,x,390,160,DBT,hl);chip(ctx,x,390,"dbt",tt,sb,{align:"center",ts:20,ss:16,lh:28});}));
  withA(ctx,fin(t,cTe-0.2),()=>[[350,"✓ tests: freshness, not null"],[690,"✓ tests: unique, accepted values"],[1070,"✓ tests: relationships"]].forEach(([x,sb])=>tag(ctx,x,712,sb,GOOD,{align:"center",size:16})));
  withA(ctx,fin(t,cRu-0.1),()=>{glass(ctx,340,792,960,84,18,DBX,{glow:16,ea:0.5});logo(ctx,"databricks",362,810,48);T(ctx,"SQL warehouse",424,832,{w:800,size:26});T(ctx,"runs the SQL that dbt compiles",424,860,{w:500,size:18,color:rgba(SOFT,0.95)});
    for(let r=0;r<3;r++)for(let cc=0;cc<18;cc++){ctx.fillStyle=rgba(DBX,0.2+0.7*Math.abs(Math.sin(t*2+r*18+cc*1.7+hash(r*18+cc,3)*6)));rr(ctx,760+cc*28,806+r*20,20,12,3);ctx.fill();}});
  const sA=0.45+0.55*fin(t,cIn),t0f=cIn+1.0,t1f=cSi+0.4;
  withA(ctx,sA,()=>{glass(ctx,1392,318,468,318,14,LAYER.silver,{glow:24});const ex=1404,ey=330,cw=444/6,ch=294/4;const filled=cc=>{const i=ORDER24.indexOf(cc);const tc=t0f+i*(t1f-t0f)/24;return sstep(tc+0.7,tc+0.9,t);};
    sketchA(ctx,ex+6,ey+10,432,270,false,0.5*(1-sstep(cSi,cSi+1.5,t)),{});pictureCells(ctx,ex,ey,444,294,filled);
    for(let i=0;i<24;i++){const cc=ORDER24[i],tc=t0f+i*(t1f-t0f)/24;if(t<tc||t>tc+0.9)continue;const u=ease((t-tc)/0.8),tx=ex+(cc%6)*cw+cw/2,ty=ey+((cc/6)|0)*ch+ch/2;const q=at(mk(bez(P(1200,Y),P(1300,Y),P(tx-100,ty),P(tx,ty),12)),u);dtile(ctx,q.x,q.y,lerp(46,cw,u),0,{cell:cc,q:2},1-sstep(0.85,1,(t-tc)/0.9));}
    if(t>cSi-0.3)chip(ctx,1626,284,"databricks","Silver","one consistent picture",{align:"center",edge:LAYER.silver});});
  withA(ctx,fin(t,cIn+0.5),()=>tag(ctx,1626,662,"pieces placed by the sketch",[150,225,255],{align:"center",size:17}));
  const k1=Math.floor(te/RF2.INT),k0=Math.floor((te-(RF2.X1-RF2.X0)/RF2.V)/RF2.INT)-1,tags=[];let failE=-1,failO=-1;
  for(let k=k0;k<=k1;k++){const p=rfProps(k,sc),x=RF2.X0+(te-p.t0)*RF2.V;if(x<RF2.X0-10||x>RF2.X1+10)continue;
    const q=x<RF2.DED?0:(x<RF2.LEN?1:2),sm=1-sstep(RF2.LEN-40,RF2.LEN,x),y=Y+Math.sin(te*1.7+k)*10*sm,al=sstep(RF2.X0,RF2.X0+24,x)*(1-sstep(RF2.X1-70,RF2.X1,x));
    if(p.err&&x>=RF2.STG){const d=(x-RF2.STG)/RF2.V;if(d<0.5){glow(ctx,RF2.STG,y,40+60*(1-d/0.5),BAD,1-d/0.5);failE=Math.max(failE,1-d/0.5);}if(d<3.5)failE=Math.max(failE,0.01);continue;}
    if(p.orphan&&x>=RF2.INTG){const d=(x-RF2.INTG)/RF2.V;if(d<0.5)glow(ctx,RF2.INTG,y,40+60*(1-d/0.5),BAD,1-d/0.5);if(d<3.5)failO=1;continue;}
    const sp={cell:p.cell,q,app:p.app,err:p.err||(p.orphan&&x>RF2.LEN+30)};
    if(p.dup&&x<RF2.DED+40){const m=sstep(RF2.DED-6,RF2.DED+36,x);dtile(ctx,x-38*(1-m),y+14*(1-m),46,p.rot*1.2*sm,sp,al*(1-m));}
    dtile(ctx,x,y,q===2?50:46,p.rot*sm,sp,al);if(p.tag)tags.push([x,y+p.tag[2],p.tag[0],p.tag[1]]);}
  const exA=fin(t,cRo-0.2)*(1-sstep(Math.max(cRo+4.2,cSo+0.3),Math.max(cRo+4.8,cSo+0.9),t));if(exA>0)withA(ctx,exA,()=>tags.forEach(g=>tag(ctx,g[0],g[1],g[2],g[3],{align:"center",size:15})));
  if(failE>0)withA(ctx,Math.min(1,failE*4),()=>tag(ctx,512,505,"✗ not_null",BAD,{align:"center",size:15}));if(failO>0)tag(ctx,912,505,"✗ relationships",BAD,{align:"center",size:15});
  withA(ctx,fin(t,cSt+1.2),()=>{dtile(ctx,1520,790,120,-0.05,{cell:14,q:0,app:"lms",hi:true});dtile(ctx,1730,790,120,0,{cell:14,q:2,hi:true});T(ctx,"raw",1520,870,{w:700,size:18,align:"center",color:rgba(APP.lms.c,1)});T(ctx,"clean",1730,870,{w:700,size:18,align:"center"});ctx.save();ctx.strokeStyle=rgba(INK,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1600,790);ctx.lineTo(1648,790);ctx.moveTo(1636,778);ctx.lineTo(1650,790);ctx.lineTo(1636,802);ctx.stroke();ctx.restore();});
  if(t>cTr){const u=ease(clamp((t-cTr-0.2)/2.2,0,1)),L=mk([P(1400,478),P(1330,Y),P(RF2.JOIN,Y),P(RF2.LEN,Y),P(RF2.DED,Y),P(330,Y),P(125,Y),P(-400,Y)]),n=60,sub=[];for(let i=0;i<=n;i++)sub.push(at(L,u*i/n));beam(ctx,sub,LAYER.gold,[[16,0.08],[6,0.25],[2.2,0.95]]);withA(ctx,fin(t,cTr+1.4),()=>tag(ctx,700,630,"lineage: every step recorded",LAYER.gold,{align:"center",size:17}));}
  // the breather: a fresh batch runs clean, the checks ripple, new pieces land in silver, and light runs back along the lineage to bronze
  const B=c("breath");if(sc.breathe&&t>B){
    [B+0.6,B+3.8].forEach(s0=>{const v=(t-s0)/1.4;if(v>0&&v<1){glow(ctx,lerp(300,1190,v),662,60,GOOD,0.8*Math.sin(v*Math.PI));glow(ctx,lerp(300,1190,v),712,40,GOOD,0.4*Math.sin(v*Math.PI));}});
    const ex=1404,ey=330,cw=444/6,chh=294/4;[1.2,2.6,4.0].forEach((d,i)=>{const s0=B+d,v=(t-s0)/0.9;if(v<0)return;const cc=ORDER24[(i*7+3)%24],tx=ex+(cc%6)*cw+cw/2,ty=ey+((cc/6)|0)*chh+chh/2;
      if(v<1){const q=at(mk(bez(P(1300,Y),P(1360,Y),P(tx-100,ty),P(tx,ty),12)),ease(v));dtile(ctx,q.x,q.y,lerp(46,cw,v),0,{cell:cc,q:2},1);}else if(v<1.8)glow(ctx,tx,ty,60,LAYER.silver,0.6*(1-(v-1)/0.8));});
    const Lm=mk([P(1400,478),P(1330,Y),P(RF2.JOIN,Y),P(RF2.LEN,Y),P(RF2.DED,Y),P(330,Y),P(125,Y)]);[B+2.0,B+4.6].forEach(s0=>{const v=(t-s0)/2.0;if(v>0&&v<1){const q=at(Lm,ease(v));glow(ctx,q.x,q.y,26,C.white,0.9);glow(ctx,q.x,q.y,90,LAYER.gold,0.45);}});}
  vign(ctx,S);
});

/* ---------- 4. Gold: business domains, data products, exposures ---------- */
const GW=[{d:"teaching",k:"live",x:1000},{d:"students",k:"rules",x:1480},{d:"research",k:"modern",x:1960},{d:"finance",k:"realism",x:2440}];
scene("gold",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cSp=c("split"),cPr=c("products"),cSu=c("subject"),cAn=c("analysts"),cEx=c("execs"),cRp=c("reports"),cLi=c("live"),cMa=c("marts"),cXp=c("exposure"),cGo=c("gold");
  const cam=camAt([[0,380,540,1.2],[cSp+0.3,380,540,1.2],[cSp+2.6,1470,540,0.62],[cSu-0.2,1470,540,0.62],[cAn+0.4,2660,470,1.9],[cEx-0.3,2660,470,1.9],[cEx+0.4,2180,470,1.9],[cRp-0.3,2180,470,1.9],[cRp+0.4,1700,470,1.9],[cLi-0.3,1700,470,1.9],[cLi+0.4,1220,470,1.9],[cMa-0.3,1220,470,1.9],[cMa+0.6,1700,560,1.3],[cGo-0.2,1700,560,1.3],[cGo+1.0,1470,540,0.62]].concat(sc.breathe?[[c("breath")+0.4,1470,540,0.62],[c("breath")+3.0,1230,560,1.45],[sc.dur+2,1250,560,1.5]]:[[sc.dur+2,1470,540,0.64]]),t);
  bgW(ctx,S,cam);
  glass(ctx,46,366,508,348,16,LAYER.silver,{glow:24});ctx.drawImage(master2(1),60,380,480,320);chip(ctx,300,330,"databricks","Silver","one consistent picture",{align:"center",edge:LAYER.silver});
  const scanX=60+((t*0.35)%1)*480;ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle="rgba(200,230,255,0.5)";ctx.fillRect(scanX-2,380,4,320);ctx.restore();
  lane(ctx,[P(556,540),P(664,556)],[255,255,255],1);
  ctx.save();ctx.shadowColor="rgba(200,225,255,0.8)";ctx.shadowBlur=20;ctx.beginPath();ctx.moveTo(700,488);ctx.lineTo(752,590);ctx.lineTo(648,590);ctx.closePath();ctx.fillStyle="rgba(200,225,255,0.14)";ctx.fill();ctx.strokeStyle="rgba(230,240,255,0.95)";ctx.lineWidth=2.5;ctx.stroke();ctx.restore();
  const lit=fin(t,cSp+0.2,1.0);
  GW.forEach((w,i)=>{const d=DOM[w.d].c,ry=150+i*14,cx=w.x+220;if(lit>0){const L=[P(730,560),P(760,ry),P(cx,ry),P(cx,250)];lane(ctx,L,d,lit);spawn(t,0.7,1.4,i*0.17,u=>{const q=at(mk(L),u);glow(ctx,q.x,q.y,12,d,lit);});}
    const wa=fin(t,cSp+1.0+i*0.35);withA(ctx,wa,()=>{glass(ctx,w.x,250,440,600,20,d,{glow:22,ea:0.55});led(ctx,w.x+24,264,392,3,d);T(ctx,DOM[w.d].n,w.x+24,302,{w:800,size:26});T(ctx,(22+i*6)+" data products",w.x+416,302,{w:600,size:16,align:"right",color:rgba(d,1)});
      const rv=clamp((t-cSp-1.6-i*0.35)/1.2,0,1);if(rv>0){ctx.save();ctx.beginPath();ctx.rect(w.x,560-240*rv,440,300);ctx.clip();ledFrame(ctx,w.x+40,320,360,240,d,painting2(w.k),{pad:10,glow:26});if(w.k==="live")liveOverlay(ctx,w.x+40,320,360,240,t);ctx.restore();}
      for(let n=0;n<6;n++){const r=(n/3)|0,k=n%3,a2=clamp((t-cSp-2.2-i*0.3-n*0.08)/0.4,0,1);if(a2<=0)continue;withA(ctx,a2,()=>{ledFrame(ctx,w.x+40+k*127,604+r*112,114,76,d,pv(w.d,n),{pad:3,lw:1.8,glow:10});pvLive(ctx,w.d,n,w.x+40+k*127,604+r*112,114,76,t);T(ctx,pvTitle(w.d,n),w.x+37+k*127,604+r*112+98,{w:600,size:12.5,color:rgba(SOFT,0.95)});});}});});
  const aud=[[cAn,"for analysts","every detail",3],[cEx,"for executives","the essence",2],[cRp,"for government reports","strict rules",1],[cLi,"for live operations","right now",0]];
  aud.forEach(([cc,a1,a2,i])=>withA(ctx,fin(t,cc+0.3)*(1-sstep(cMa-0.3,cMa+0.2,t)),()=>{const w=GW[i];tag(ctx,w.x+220,586,a1+" · "+a2,DOM[w.d].c,{align:"center",size:17});}));
  withA(ctx,fin(t,cMa+0.2)*(1-sstep(cGo+0.6,cGo+1.2,t)),()=>{const h=plaque(ctx,1500,600,400,[["DATA PRODUCT","Census enrolments"],["DBT MART","fct_census_enrolments · contract","dbt"],["DBT EXPOSURE","Government census report","dbt"],["OWNER","Student services"]],DOM.students.c);
    const xa=fin(t,cXp);if(xa>0){ctx.save();ctx.globalAlpha*=xa;ctx.shadowColor=rgba(DBT,0.9);ctx.shadowBlur=18;ctx.strokeStyle=rgba(DBT,0.95);ctx.lineWidth=2.5;rr(ctx,1508,600+16+2*52-6,384,52,10);ctx.stroke();ctx.restore();}});
  // the breather: in the Teaching wing, a live data product shows its plaque, and its exposure lights up
  const B=c("breath");if(sc.breathe&&t>B+2.2)withA(ctx,fin(t,B+2.2,0.6)*(1-sstep(sc.dur-0.5,sc.dur,t)),()=>{plaque(ctx,1012,604,416,[["DATA PRODUCT","Rooms in use now"],["DBT MART","fct_rooms_live · contract","dbt"],["DBT EXPOSURE","Campus operations screen","dbt"],["OWNER","Timetabling"]],DOM.teaching.c);
    const xa=fin(t,B+3.4);if(xa>0){ctx.save();ctx.globalAlpha*=xa;ctx.shadowColor=rgba(DBT,0.9);ctx.shadowBlur=18;ctx.strokeStyle=rgba(DBT,0.95);ctx.lineWidth=2.5;rr(ctx,1020,604+16+2*52-6,400,52,10);ctx.stroke();ctx.restore();}});
  vign(ctx,S);
});

/* ---------- 5. The layers together ---------- */
scene("layers",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cBa=c("back"),cAp=c("appdom"),cBs=c("bsg"),cBu=c("busdom"),cDg=c("dbtgov"),cDx=c("dbx"),dB=nextCue(sc,"bsg")-cBs;
  const cam=sc._cam||camAt([[0,1135,560,1.1],[cBa+2.2,1135,540,0.88],[cBu-0.2,1135,540,0.88],[cBu+0.8,1700,600,1.2],[cDg-0.3,1700,600,1.2],[cDg+0.8,860,320,1.35],[cDx-0.2,860,320,1.35],[cDx+0.8,1000,690,1.1],[sc.dur+2,1135,560,0.9]],t);
  bgW(ctx,S,cam);
  withA(ctx,fin(t,cBa),()=>{glass(ctx,120,190,1480,236,20,DBT,{glow:18,ea:0.5});logo(ctx,"dbt",146,214,46);T(ctx,"dbt",146,302,{w:800,size:34});T(ctx,"recipes, tests,",146,334,{w:500,size:19,color:rgba(SOFT,0.95)});T(ctx,"docs, lineage",146,358,{w:500,size:19,color:rgba(SOFT,0.95)});
    [[540,"sources"],[860,"staging"],[1060,"intermediate"],[1260,"marts"],[1470,"exposures"]].forEach(([x,n])=>T(ctx,n.toUpperCase(),x,226,{w:800,size:14,align:"center",color:rgba(DBT,0.85)}));
    const N={src_sis:[540,262],src_lms:[540,318],src_hr:[540,374],stg_enrolments:[860,280],stg_classes:[860,356],int_class_enrolments:[1060,318],fct_class_fill:[1260,280],dim_students:[1260,356],"Executive dashboard":[1470,280],"Census report":[1470,356]};
    const E=[["src_sis","stg_enrolments"],["src_lms","stg_enrolments"],["src_sis","stg_classes"],["stg_enrolments","int_class_enrolments"],["stg_classes","int_class_enrolments"],["int_class_enrolments","fct_class_fill"],["stg_enrolments","dim_students"],["fct_class_fill","Executive dashboard"],["fct_class_fill","Census report"],["dim_students","Census report"]];
    const nw=n=>tw(ctx,n,15,500,"mono")+24,g=clamp((t-cDg-0.2)/2.6,0,1),col=x=>clamp((g*1.3-(x-540)/930),0,1);
    ctx.save();E.forEach(([a,b])=>{const A=N[a],B=N[b],f=col(B[0]);ctx.strokeStyle=rgba(mix(DBT,LAYER.gold,f),0.45+0.5*f);ctx.lineWidth=2+1.5*f;ctx.beginPath();ctx.moveTo(A[0]+nw(a)/2,A[1]);ctx.bezierCurveTo(A[0]+nw(a)/2+40,A[1],B[0]-nw(b)/2-40,B[1],B[0]-nw(b)/2,B[1]);ctx.stroke();});ctx.restore();
    Object.keys(N).forEach(n=>{const[x,y]=N[n],w=nw(n),ex=n[0]===n[0].toUpperCase(),f=col(x);if(f>0)glow(ctx,x,y,60,LAYER.gold,0.35*f);ctx.fillStyle=ex?"rgba(255,105,75,0.22)":"rgba(10,16,32,0.95)";rr(ctx,x-w/2,y-17,w,34,8);ctx.fill();ctx.strokeStyle=rgba(mix(DBT,LAYER.gold,f),ex?1:0.75);ctx.lineWidth=1.6;rr(ctx,x-w/2,y-17,w,34,8);ctx.stroke();T(ctx,n,x,y+6,{f:"mono",w:500,size:15,align:"center"});});});
  withA(ctx,fin(t,cDg+0.4),()=>[[720,"dbt compiles the SQL"],[1100,"Databricks runs it"]].forEach(([x,s],i)=>{ctx.save();ctx.strokeStyle=rgba(DBT,0.55);ctx.setLineDash([5,7]);ctx.lineDashOffset=-t*20;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,428);ctx.lineTo(x,788);ctx.stroke();ctx.restore();tag(ctx,x,446,s,i?[255,160,140]:DBT,{align:"center",size:14});}));
  const V=[[420,"Bronze",LAYER.bronze,(r,cc)=>hash(r*31+cc,5)>0.75?null:APP[["sis","lms","hr","fin"][(hash(r*7+cc,6)*4)|0]].c,"keeps what arrived"],[780,"Silver",LAYER.silver,(r,cc)=>hash(r*31+cc,8)>0.8?null:[220,232,255],"makes it consistent"],[1140,"Gold",LAYER.gold,(r,cc)=>hash(r*31+cc,9)>0.8?null:DOM[["students","teaching","research","finance"][(hash(r*5+cc,7)*4)|0]].c,"makes it useful"]];
  V.forEach(([x,n,e,f,cap],i)=>withA(ctx,fin(t,cBa+0.3+i*0.2),()=>{vault(ctx,x,462,240,310,e,f,n,null);withA(ctx,fin(t,cBs+i*dB/3),()=>tag(ctx,x+120,742,cap,e,{align:"center",size:15}));}));
  withA(ctx,fin(t,cBa+0.2),()=>{glass(ctx,380,792,1040,80,18,DBX,{glow:16+16*fin(t,cDx)*(1-sstep(cDx+2,cDx+3,t)),ea:0.5});logo(ctx,"databricks",400,808,48);T(ctx,"Databricks Lakehouse",460,842,{w:800,size:26});
    [[895,"Delta Lake storage"],[1095,"SQL warehouses"],[1285,"Unity Catalog"]].forEach(([x,s],i)=>withA(ctx,0.5+0.5*fin(t,cDx+0.4+i*0.5),()=>tag(ctx,x,832,s,[255,160,140],{align:"center",size:17})));});
  const apA=fin(t,cBa+0.4),pulse=t>cAp&&t<cAp+2.5?1-(t-cAp)/2.5:0;
  withA(ctx,apA,()=>{T(ctx,"APPLICATION DOMAINS",40,456,{w:800,size:15,color:rgba(SOFT,0.9)});["sis","lms","hr","fin"].forEach((a,i)=>{appCard(ctx,40,470+i*100,300,86,a,{ts:20,sub:" ",n:0});if(pulse>0)glow(ctx,190,513+i*100,160,APP[a].c,0.4*pulse);const L=[P(342,513+i*100),P(380,513+i*100),P(400,617),P(420,617)];lane(ctx,L,APP[a].c,0.9);spawn(t,0.9,0.9,i*0.2,u=>{const q=at(mk(L),u);glow(ctx,q.x,q.y,10,APP[a].c,1);});});
    lane(ctx,[P(660,617),P(780,617)],[235,240,255],0.9);lane(ctx,[P(1020,617),P(1140,617)],[235,240,255],0.9);spawn(t,0.6,0.8,0,u=>{glow(ctx,lerp(660,780,u),617,10,C.white,1);glow(ctx,lerp(1020,1140,u),617,10,C.white,1);});});
  const buA=fin(t,cBa+0.6),bp=t>cBu&&t<cBu+2.5?1-(t-cBu)/2.5:0;
  withA(ctx,buA,()=>{T(ctx,"BUSINESS DOMAINS",1470,456,{w:800,size:15,color:rgba(SOFT,0.9)});["students","teaching","research","finance"].forEach((d,i)=>{const y=470+i*100,cc=DOM[d].c;glass(ctx,1470,y,410,86,14,cc,{glow:14+20*bp,ea:0.6});led(ctx,1482,y+14,5,58,cc);T(ctx,DOM[d].n,1502,y+36,{w:700,size:21});
    for(let k=0;k<4;k++){ledFrame(ctx,1502+k*64,y+47,52,33,cc,pv(d,k),{pad:2,lw:1.5,glow:8});pvLive(ctx,d,k,1502+k*64,y+47,52,33,t);}T(ctx,"+"+(18+i*5),1786,y+70,{w:700,size:18,color:rgba(cc,1)});
    const L=[P(1380,617),P(1420,617),P(1440,y+43),P(1470,y+43)];lane(ctx,L,cc,0.9);spawn(t,0.9,0.7,i*0.2,u=>{const q=at(mk(L),u);glow(ctx,q.x,q.y,10,cc,1);});});});
  const coA=fin(t,cBa+0.8),cp=t>cBu&&t<cBu+3?1-(t-cBu)/3:0;
  withA(ctx,coA,()=>{T(ctx,"CONSUMPTION",1932,456,{w:800,size:15,color:rgba(SOFT,0.9)});[513,613,713,813].forEach(y=>lane(ctx,[P(1882,y),P(1908,y)],[235,240,255],0.7));lane(ctx,[P(1908,513),P(1908,813)],[235,240,255],0.6);
    const ys=[530,650,770];ys.forEach(y=>lane(ctx,[P(1908,y),P(1934,y)],[235,240,255],0.8));spawn(t,0.8,0.8,0.3,u=>{glow(ctx,1908,lerp(513,813,u),10,C.white,0.9);});
    [["Databricks Apps","for staff and students"],["Genie","ask in plain words"],["Dashboards and SQL","for analysts and leaders"]].forEach(([a,b],k)=>{if(cp>0)glow(ctx,2080,ys[k],170,LAYER.gold,0.35*cp);chip(ctx,1934,ys[k],"databricks",a,b,{ts:19,ss:15,lh:28});});});
  // the breather: one pulse of light travels through the whole platform, from a source system to Genie
  const Bb=cue(sc,"breath");if(sc.breathe&&t>Bb){const path=mk([P(190,513),P(400,617),P(540,617),P(900,617),P(1260,617),P(1440,560),P(1675,513),P(1908,513),P(1908,650),P(2090,650)]),u=ease(clamp((t-Bb-0.4)/(sc.breathe-1.6),0,1)),q=at(path,u),fa=1-sstep(sc.dur-0.8,sc.dur,t);
    glow(ctx,q.x,q.y,50,C.white,0.95*fa);glow(ctx,q.x,q.y,160,LAYER.gold,0.45*fa);const sub=[];for(let i=0;i<=40;i++)sub.push(at(path,u*i/40));beam(ctx,sub,LAYER.gold,[[14,0.06*fa],[5,0.22*fa],[2,0.9*fa]]);}
  vign(ctx,S);
});
