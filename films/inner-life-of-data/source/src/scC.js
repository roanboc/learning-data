/* ===== v4 scenes, part C ===== */
const ORDER24=(()=>{const a=[...Array(24).keys()];for(let i=a.length-1;i>0;i--){const j=Math.floor(hash(i,77)*(i+1));const tmp=a[i];a[i]=a[j];a[j]=tmp;}return a;})();
const KSRC=[{n:"Intranet",x:150,ic:"doc"},{n:"Policy library",x:560,ic:"books"},{n:"Handbook",x:1060,ic:"hand"},{n:"Process maps",x:1470,ic:"flow"}];

/* ---------- read on a phone: this file's own helpers ----------
   The phone layer (From words to data's phone.js, loaded after the scenes) draws every word at least 28 px high in the frame,
   after the camera's zoom. These chapters place their words by the size they're really drawn at, move the camera in on what the
   narration names, and mark what is only texture as decoration; where the layer isn't loaded (a lab), they draw as before. */
const il_C_sz=(ctx,s)=>typeof phSz==="function"?phSz(ctx,s):s;
const il_C_deco=(on,fn)=>typeof phAsDeco==="function"?phAsDeco(on,fn):fn();
// a component drawn larger as a whole about (x,y), so its box keeps its proportions around words drawn larger
function il_C_big(ctx,x,y,k,fn){if(Math.abs(k-1)<0.001)return fn();ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-x,-y);try{return fn();}finally{ctx.restore();}}
// a chip (style2.js) grown as a whole until its smaller line (its title, when it has none) is drawn at size s
function il_C_chip(ctx,x,y,k,title,sub,o,s){o=o||{};const b=sub?(o.ss||17):(o.ts||22);return il_C_big(ctx,x,y,(s||22)/b,()=>chip(ctx,x,y,k,title,sub,o));}
// a system card, drawn as sysCard (ui3.js) draws one, with its title and its line under it at sizes that read once the camera is
// close; it grows to the right to hold them, so lanes still meet its left edge. Its icon is a picture, not words. Returns its box.
function il_C_sys(ctx,x,y,w,h,title,sub,c,icon,ts,ss){ts=ts||24;ss=ss||22;const W=Math.max(w,32+Math.max(tw(ctx,title,ts,700),sub?tw(ctx,sub,ss,500):0)+(icon?76:24)),H=sub?Math.max(h,ts+ss*1.2+30):Math.max(h,ts+30);
  glass(ctx,x,y,W,H,16,c,{glow:16,ea:0.6});led(ctx,x+12,y+16,5,H-32,c);
  if(sub){T(ctx,title,x+32,y+H/2-ss*0.2,{w:700,size:ts});T(ctx,sub,x+32,y+H/2+ss*0.95,{w:500,size:ss,color:rgba(SOFT,0.95)});}else T(ctx,title,x+32,y+H/2+ts*0.36,{w:700,size:ts});
  if(icon)il_C_deco(true,()=>icon(ctx,x+W-44,y+H/2));return{x,y,w:W,h:H};}
// the four places a university's knowledge lives, side by side across the frame, each card as wide as its name is drawn once the
// camera rests on the sky (zoom 1.0, where the phone layer draws it at 28), so the row holds still while the camera rises to it
function il_C_klay(ctx){const ts=typeof phMin==="function"&&phMin(ctx)?28:22,ws=KSRC.map(s=>Math.max(300,32+tw(ctx,s.n,ts,700)+76)),tot=ws.reduce((a,b)=>a+b,0),gap=clamp((1760-tot)/3,40,160);
  let x=960-(tot+3*gap)/2;return ws.map(w=>{const o={x,w,c:x+w/2};x+=w+gap;return o;});}

scene("meaning",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cNo=c("noise"),cBr=c("bricks"),cCa=c("catalog"),cDe=c("define"),cUc=c("uc"),cKn=c("knowledge"),cMc=c("mcp"),cRd=c("reads"),cOn=c("onto");
  // the wall of pictures; in on the dbt Catalog as it's named; down to Unity Catalog under it, the frame's top edge just under the
  // Catalog's tabs, so its rows sit well inside the frame; up to the sky of knowledge, slowly, once the line about Unity Catalog ends
  const cam=camAt([[0,960,540,1.0],[cCa-0.9,968,543,1.015],[cCa+0.8,1500,372,1.35],[cUc-0.6,1500,380,1.36],[cUc+1.0,1500,688,1.35],[cKn-1.2,1500,684,1.36],[cKn+2.2,960,-560,1.0],[sc.dur+2,960,-560,1.03]],t);bgW(ctx,S,cam);
  const nz=(1-sstep(cNo+0.5,cBr,t))*0.9;
  // the pictures are what the wall shows; their captions are texture
  for(let r=0;r<3;r++)for(let k=0;k<4;k++){const n=r*4+k,dk=["students","teaching","research","finance"][(n+r)%4],vi=(n*5+r)%6,d=DOM[dk].c,X=90+k*245,Y=220+r*200;ledFrame(ctx,X,Y,190,126,d,pv(dk,vi),{pad:5,lw:2,glow:12});pvLive(ctx,dk,vi,X,Y,190,126,t);T(ctx,pvTitle(dk,vi),X-2,Y+152,{w:600,size:15,color:rgba(SOFT,0.95),deco:1});
    if(nz>0){for(let j=0;j<70;j++){ctx.fillStyle=hash(j,n+Math.floor(t*14))>0.5?"rgba(255,255,255,"+0.6*nz+")":"rgba(0,0,0,"+0.6*nz+")";ctx.fillRect(X+hash(j,n*3+Math.floor(t*12))*190,Y+hash(j+50,n*5+Math.floor(t*12))*126,5,5);}}}
  // the shared language: its words in the empty half beside the wall, clear of the pictures' own words, three rows of two, each row
  // centred and each word after the one before it at the size it's drawn; they leave before the Catalog arrives in the same place
  const wA=fin(t,cBr+0.3)*(1-sstep(cCa-0.8,cCa-0.15,t));if(wA>0)withA(ctx,wA,()=>{const ts=il_C_sz(ctx,22),gp=56;[["census date","enrolled student"],["class fill rate","research income"],["waitlist","degree code"]].forEach((row,r)=>{
    const ws=row.map(w=>tw(ctx,w,ts,700)+26);let x=1460-(ws[0]+gp+ws[1])/2;
    row.forEach((w,j)=>{const i=r*2+j;tag(ctx,x+Math.sin(t*0.6+i)*12,376+r*120+Math.sin(t*0.9+i*2)*14,w,[255,228,170],{size:22});x+=ws[j]+gp;});});});
  withA(ctx,fin(t,cCa-0.1),()=>{glass(ctx,1120,180,760,380,18,DBT,{glow:16,ea:0.5,fill:"rgba(7,12,24,0.94)"});logo(ctx,"dbt",1144,200,34);T(ctx,"Catalog",1188,230,{w:800,size:28});T(ctx,"in dbt",1200+tw(ctx,"Catalog",il_C_sz(ctx,28),800),230,{w:500,size:18,color:rgba(SOFT,0.9)});
    // the tabs, each as wide as its word is drawn, close under the title, so the Unity Catalog shot can leave them out above its
    // top edge with room before the rows
    const bs=il_C_sz(ctx,16),bh=bs+16,TY=264;let tx=1144;["Definitions","Sources","Lineage","Data products"].forEach((s,i)=>{const w=tw(ctx,s,bs,700)+26;ctx.fillStyle=i===0?"rgba(255,105,75,0.9)":"rgba(255,255,255,0.08)";rr(ctx,tx,TY-bh/2,w,bh,bh/2);ctx.fill();T(ctx,s,tx+13,TY+bs*0.36,{w:700,size:16,color:i===0?"#fff":rgba(INK,0.85)});tx+=w+10;});
    // what each picture shows, where it came from, who owns it: the values after the longest question, as drawn
    const dC=nextCue(sc,"catalog")-cCa,rows=[["What it shows","Enrolled students by class",cCa+0.2],["Where it came from","Student system → staging → marts",cCa+dC*0.45],["Who owns it","Student services",cCa+dC*0.75]],
      ls=il_C_sz(ctx,19),vx=1144+Math.max(...rows.map(r=>tw(ctx,r[0],ls,700)))+28;
    rows.forEach(([a,b,tt],i)=>withA(ctx,fin(t,tt,0.4),()=>{const y=316+i*50;ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.beginPath();ctx.moveTo(1144,y+34);ctx.lineTo(1856,y+34);ctx.stroke();T(ctx,a,1144,y+24,{w:700,size:19,color:rgba(SOFT,0.95)});T(ctx,b,vx,y+24,{w:700,size:20});}));
    withA(ctx,fin(t,cDe,0.5),()=>{const s1=il_C_sz(ctx,18),s2=il_C_sz(ctx,22),y1=478+s1*0.9,y2=y1+6+s2*0.95,h=Math.max(76,y2-452);glass(ctx,1136,466,728,h,12,LAYER.gold,{glow:14,ea:0.8,fill:"rgba(60,48,20,0.55)"});
      T(ctx,"Enrolled student",1156,y1,{w:800,size:18,color:rgba(LAYER.gold,1)});T(ctx,"still enrolled on census date",1156,y2,{w:700,size:22});});});
  withA(ctx,fin(t,cUc-0.1),()=>{glass(ctx,1120,590,760,280,18,DBX,{glow:16,ea:0.5,fill:"rgba(7,12,24,0.94)"});logo(ctx,"databricks",1144,608,36);T(ctx,"Unity Catalog",1192,638,{w:800,size:26});
    const dU=nextCue(sc,"uc")-cUc;
    withA(ctx,fin(t,cUc+0.2,0.4),()=>{const nw=tw(ctx,"fct_census_enrolments",il_C_sz(ctx,19),500,"mono");T(ctx,"fct_census_enrolments",1144,692,{f:"mono",w:500,size:19});tag(ctx,1144+nw+18,685,"✓ certified",GOOD,{size:16});});
    // who sees what: the second column after the longer of the two names, as they're drawn
    withA(ctx,fin(t,cUc+dU*0.35,0.4),()=>{const s=il_C_sz(ctx,18),vx=1144+Math.max(tw(ctx,"Student services",s,700),tw(ctx,"Analysts",s,700))+26;
      T(ctx,"Student services",1144,742,{w:700,size:18});T(ctx,"can see everything",vx,742,{w:500,size:18,color:rgba(SOFT,0.95)});T(ctx,"Analysts",1144,780,{w:700,size:18});T(ctx,"names and IDs masked",vx,780,{w:500,size:18,color:rgba(SOFT,0.95)});});
    // a student's row with the name masked: the bar after the word, the degree after the bar
    withA(ctx,fin(t,cUc+dU*0.7,0.4),()=>{const s=il_C_sz(ctx,18),y=838,bx=1144+tw(ctx,"Student",s,600)+14,bw=200,lx=bx+bw/2;T(ctx,"Student",1144,y,{w:600,size:18,color:rgba(SOFT,0.9)});
      ctx.fillStyle="rgba(140,150,175,0.85)";rr(ctx,bx,y-20,bw,28,6);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=2.5;rr(ctx,lx-9,y-13,18,14,3);ctx.stroke();ctx.beginPath();ctx.arc(lx,y-13,6,Math.PI,0);ctx.stroke();
      T(ctx,"Degree: BSc Data Science",bx+bw+18,y,{w:600,size:18,color:rgba(SOFT,0.9)});});});
  const sky=fin(t,cKn-0.6,1.2);
  withA(ctx,sky,()=>{const KL=il_C_klay(ctx);KSRC.forEach((s,i)=>withA(ctx,fin(t,cKn+0.8+i*0.5),()=>sysCard(ctx,KL[i].x,-1000,KL[i].w,110,s.n,null,[120,180,255],ICON[s.ic])));
    const BX=960,BY=-565,BS=0.78,act=0.15+0.35*fin(t,cMc)+0.5*fin(t,cOn),ents=[0,1,2,3,4].map(i=>brainHub(BX,BY,BS,i));
    brainNet(ctx,BX,BY,BS,t,act,{});
    // the breather: snippets keep arriving, and new connections light up across the brain
    const Bm=c("breath");if(sc.breathe&&t>Bm){spawn(t,0.45,1.6,Bm,(u,k)=>{const n=BRAIN.E.length,e=BRAIN.E[(((k*53+7)%n)+n)%n],a=BRAIN.N[e[0]],b=BRAIN.N[e[1]],f=Math.sin(u*Math.PI);ctx.save();ctx.strokeStyle=rgba(LAYER.gold,0.8*f);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(BX+a[0]*BS,BY+a[1]*BS);ctx.lineTo(BX+b[0]*BS,BY+b[1]*BS);ctx.stroke();ctx.restore();glow(ctx,BX+a[0]*BS,BY+a[1]*BS,30,LAYER.gold,0.8*f);glow(ctx,BX+b[0]*BS,BY+b[1]*BS,30,LAYER.gold,0.8*f);});}
    const mA=fin(t,cMc);KSRC.forEach((s,i)=>{if(mA<=0)return;const gx=KL[i].c,gy=-860,tg=ents[[0,1,2,3][i]];withA(ctx,mA,()=>{ctx.save();ctx.lineWidth=6;ctx.strokeStyle=metal(ctx,gx-20,0,gx+20,0,MET.silver);ctx.beginPath();ctx.ellipse(gx,gy,20,11,0,0,TAU);ctx.stroke();ctx.restore();});
      const L=[P(gx,gy+10),P(lerp(gx,tg.x,0.5),gy+70),P(tg.x,tg.y-30)];beam(ctx,L,C.mcp,[[12,0.05*mA],[4,0.2*mA],[1.6,0.9*mA]]);
      if(t>cRd)spawn(t,2.0,1.6,cRd+i*0.35,u=>{const q=at(mk(L),u);withA(ctx,1-sstep(0.85,1,u),()=>{ctx.fillStyle="#f4f1ea";rr(ctx,q.x-40,q.y-14,80,28,5);ctx.fill();ctx.fillStyle="#6b7280";ctx.fillRect(q.x-30,q.y-5,50,4);ctx.fillRect(q.x-30,q.y+3,34,4);});glow(ctx,q.x,q.y,36,C.mcp,0.35);});});
    withA(ctx,fin(t,cMc+0.4)*(1-sstep(cOn,cOn+0.6,t)),()=>chip(ctx,300,-700,null,"MCP","one standard plug for AI",{align:"center",edge:C.mcp}));
    const gA=fin(t,cOn-0.2);if(gA>0){const L=mk([P(1500,170),P(1500,-150),P(1200,-330),P(1128,-430)]),n=40,sub=[];for(let i=0;i<=n;i++)sub.push(at(L,gA*i/n));beam(ctx,sub,LAYER.gold,[[16,0.06],[6,0.22],[2.2,0.95]]);
      withA(ctx,gA,()=>{glow(ctx,960,-600,420,LAYER.gold,0.12);chip(ctx,960,-292,"databricks","Genie Ontology","the organisational brain",{align:"center",edge:LAYER.gold});});}});
  vign(ctx,S);
});

scene("speeds",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cNo=c("now"),cYe=c("years"),cJo=c("jobs"),cLa=c("lake"),cSy=c("sync"),q0=cNo+3.4;
  // close on the phone and the desk copy that answers it; across to every record, over years; back to Lakebase as it's named; and out
  // a little to the gold copy it's kept in sync with. Never wider than a zoom of 1.3, so the phone's words keep inside its screen.
  // The two pans across start as the line before them ends, and take over 3 s, so the camera glides rather than whips.
  const cam=camAt([[0,525,410,1.5],[cYe-0.7,535,412,1.52],[cYe+2.6,1712,440,1.36],[cLa-0.8,1722,442,1.38],[cLa+2.3,525,410,1.5],[cSy-0.3,535,414,1.52],[cSy+1.3,735,590,1.3],[sc.dur+2,738,590,1.32]],t);bgW(ctx,S,cam);
  // the phone, the desk copy (Lakebase) and the gold copy it syncs with on the left; every record, over years, on the right
  const ph={x:230,y:430,s:1.8},QA=ph.x+60*ph.s,PX=450,PY=290,DX=260,VX=770,VY=650,VW=280,VH=130;
  // the desk copy's words at 21.6, the size that reads at the widest this chapter goes, so its rows are measured once
  const rs=21.6,rowS="DS101 · Tue 9 am · 1 seat left",rw=Math.max(332,tw(ctx,rowS,rs,700)+32),pw=Math.max(380,rw+48,62+tw(ctx,"a fast desk copy for apps",rs,500)+24),ms={x:(QA+PX)/2,y:ph.y+70};
  ctx.save();ctx.strokeStyle="rgba(170,200,245,0.16)";ctx.lineWidth=2;ctx.setLineDash([10,12]);ctx.beginPath();ctx.moveTo(1110,190);ctx.lineTo(1110,640);ctx.stroke();ctx.restore();
  withA(ctx,fin(t,cNo),()=>T(ctx,"One answer, right now",525,150,{w:800,size:40,align:"center"}));withA(ctx,fin(t,cYe),()=>T(ctx,"Every record, over years",1440+DX,150,{w:800,size:40,align:"center"}));
  const ans=fin(t,q0+0.35,0.25);phone3(ctx,ph.x,ph.y,ph.s,{screen:"seat",ans});
  // the breather: three more seat checks answer at once, while one long scan crosses the whole history
  const B=c("breath"),Q=sc.breathe?[0.3,1.2,2.1].map(x=>B+x):[];let flash=0;
  Q.forEach(q=>{if(t>q-0.3&&t<q)glow(ctx,lerp(QA,PX,(t-q+0.3)/0.3),ph.y,24,C.hot,1);if(t>q+0.05&&t<q+0.35)glow(ctx,lerp(PX,QA,(t-q-0.05)/0.3),ph.y,24,GOOD,1);if(t>q&&t<q+0.8)flash=Math.max(flash,1-(t-q)/0.8);});
  if(t>q0-0.3&&t<q0){glow(ctx,lerp(QA,PX,(t-q0+0.3)/0.3),ph.y,24,C.hot,1);}if(t>q0+0.3&&t<q0+0.6){glow(ctx,lerp(PX,QA,(t-q0-0.3)/0.3),ph.y,24,GOOD,1);}
  glass(ctx,PX,PY,pw,300,18,DBX,{glow:16,ea:0.5,fill:"rgba(7,12,24,0.92)"});withA(ctx,fin(t,cLa-0.2),()=>{logo(ctx,"databricks",PX+20,PY+16,32);T(ctx,"Lakebase",PX+62,PY+44,{w:800,size:26});T(ctx,"a fast desk copy for apps",PX+62,PY+50+rs,{w:500,size:rs,color:rgba(SOFT,0.95)});});
  for(let r=0;r<5;r++){const hl=r===2?ans:0,y=PY+96+r*38;ctx.fillStyle=hl>0?rgba(mix([40,60,100],GOOD,hl),0.9):"rgba(120,150,200,0.18)";rr(ctx,PX+24,y,rw,30,7);ctx.fill();if(r===2&&hl>0.5)T(ctx,rowS,PX+40,y+15+rs*0.36,{w:700,size:rs,color:"#08140c"});}
  withA(ctx,fin(t,q0+0.5,0.3),()=>tag(ctx,ms.x,ms.y,"8 ms",GOOD,{align:"center",size:rs}));if(flash>0){glow(ctx,PX+pw/2,PY+186,170,GOOD,0.35*flash);glow(ctx,ms.x,ms.y,60,GOOD,0.5*flash);}
  withA(ctx,fin(t,cYe-0.2),()=>{for(let s2=0;s2<7;s2++){ctx.fillStyle=rgba(mix(APP[["sis","lms","hr","fin"][s2%4]].c,[30,40,60],0.55),1);rr(ctx,1030+DX+s2*14,300-s2*6,110,330+s2*6,8);ctx.fill();}
    ctx.save();ctx.globalCompositeOperation="lighter";const sy=300+((t*0.8)%1)*330;ctx.fillStyle=rgba(C.hot,0.8);ctx.fillRect(1030+DX,sy,210,4);ctx.restore();glow(ctx,1135+DX,sy,60,C.hot,0.5);
    const hm=sstep(cYe+0.6,cYe+3.6,t);for(let r=0;r<8;r++)for(let k=0;k<14;k++){const v=0.25+0.75*Math.abs(Math.sin(r*1.7+k*0.6)*Math.cos(k*0.3+r));ctx.fillStyle=hm*14>k?rgba(mix([40,60,110],[255,140,90],v),0.95):"rgba(40,50,70,0.35)";rr(ctx,1280+DX+k*40,300+r*40,34,34,6);ctx.fill();}
    if(sc.breathe&&t>B+0.3&&t<sc.dur-0.2){const v=clamp((t-B-0.3)/(sc.breathe-0.9),0,1),sx=1280+DX+v*560;ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=rgba(C.hot,0.55);ctx.fillRect(sx-2,292,4,334);ctx.restore();glow(ctx,sx,460,90,C.hot,0.35);}
    T(ctx,"weeks →",1280+DX,650,{w:600,size:18,color:rgba(SOFT,0.85)});T(ctx,"classes ↓",1280+DX,286,{w:600,size:18,color:rgba(SOFT,0.85)});});
  withA(ctx,fin(t,cJo),()=>chip(ctx,1560+DX,666,"databricks","Lakehouse","history at scale",{align:"center"}));
  // the gold copy under the desk copy: synced into it, with changes flowing back; each tag beside it, clear of the phone
  const sa=fin(t,cSy-0.1);withA(ctx,sa,()=>{vault(ctx,VX,VY,VW,VH,LAYER.gold,(r,k)=>hash(r*9+k,4)>0.7?null:DOM[["students","teaching","research","finance"][(r+k)%4]].c,null);
    const bx=PX+pw/2,A=[P(VX+60,VY),P(VX+16,VY-30),P(bx-40,PY+300)],Bl=[P(bx+40,PY+300),P(VX+130,VY-30),P(VX+170,VY)];lane(ctx,A,LAYER.gold,sa);lane(ctx,Bl,GOOD,sa);spawn(t,0.7,0.9,cSy,u=>glow(ctx,at(mk(A),u).x,at(mk(A),u).y,14,LAYER.gold,1));spawn(t,0.7,0.9,cSy+0.35,u=>glow(ctx,at(mk(Bl),u).x,at(mk(Bl),u).y,14,GOOD,1));
    const ts=il_C_sz(ctx,rs),w1=tw(ctx,"synced automatically",ts,700)+26,w2=tw(ctx,"changes flow back",ts,700)+26;tag(ctx,VX-24-w1/2,VY+50,"synced automatically",LAYER.gold,{align:"center",size:rs});tag(ctx,VX+VW+24+w2/2,VY+90,"changes flow back",GOOD,{align:"center",size:rs});});
  vign(ctx,S);
});

scene("out",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cFo=c("four"),cEv=c("events"),cSq=c("sql"),cCp=c("copies"),cSt=c("stale"),cTw=c("twist"),cPr=c("projector"),cSh=c("share"),cMi=c("mirror"),cFe=c("fed"),cOn=c("one");
  const pzT=(sc.pauses&&sc.pauses.twist)||1;
  // all four ways from afar; in on events, the SQL endpoint, and the copies beside the gold they come from; out again for the twist;
  // then along the projector's row: the projector and OpenSharing, Mirroring, Federation; and back for zero-copy, to the projector
  // and both screens it lights. The long pans start as the line before them ends and take 2.7-3.4 s, so the camera glides.
  const cam=camAt([[0,1100,650,0.74],[cEv-0.8,1100,650,0.76],[cEv+1.4,720,300,1.5],[cSq-0.8,730,302,1.52],[cSq+2.0,1660,300,1.3],[cCp-0.8,1665,302,1.31],[cCp+1.2,850,370,1.3],[cTw-pzT-1.5,853,372,1.31],[cTw-0.2,1100,650,0.74],
    [cPr+0.4,800,1050,1.3],[cSh-0.2,805,1050,1.31],[cSh+1.4,960,1050,1.3],[cMi-0.4,965,1050,1.31],[cMi+1.5,1680,1050,1.3],[cFe-0.7,1685,1050,1.31],[cFe+2.0,2700,1075,1.3],[cOn-0.8,2705,1075,1.31],[cOn+2.6,1180,1105,1.3],[sc.dur+2,1180,1105,1.33]],t);
  bgW(ctx,S,cam);const dim=(a,b)=>0.35+0.65*fin(t,a,b||0.6);
  // every word here is drawn at least 22 units high, which reads once the camera is in to 1.27 or closer; from further away (the four
  // ways at once, the twist) the whole map is a picture seen from afar, and its words are texture
  il_C_deco(cam.z<1.27,()=>{
  // the gold, with its name as a chip of its own over it
  vault(ctx,120,280,300,560,LAYER.gold,(r,k)=>hash(r*13+k,3)>0.8?null:DOM[["students","teaching","research","finance"][(hash(r*7+k,2)*4)|0]].c,null,null);il_C_chip(ctx,270,342,"databricks","Gold","data products",{align:"center",edge:LAYER.gold});
  const chg=cSt+0.2;if(t>chg&&t<chg+1.2)glow(ctx,270,560,240,LAYER.gold,0.6*(1-(t-chg)/1.2));
  // the copies pile up beside the older system, which grows to hold its words
  const SX=1000+Math.max(300,32+Math.max(tw(ctx,"Older system",24,700),tw(ctx,"can't read the originals",22,500))+76)+70;
  // during the hold, the original changes again, and the copies fall behind again
  const chg2=(sc.ends.stale||cSt)+0.8;if(t>chg2&&t<chg2+1.2)glow(ctx,270,560,240,LAYER.gold,0.6*(1-(t-chg2)/1.2));if(t>chg2+0.3&&t<chg2+2.0)glow(ctx,SX+30,520,110,BAD,0.5*Math.sin((t-chg2-0.3)/1.7*Math.PI));
  withA(ctx,dim(cEv-0.3),()=>{lane(ctx,[P(422,420),P(680,360)],LAYER.gold,0.9);hub(ctx,760,360,78,t*0.6);il_C_chip(ctx,760,478,null,"Integration platform",null,{align:"center",edge:CYAN,ts:18});
    const ring=clamp((t-cEv-0.8)/2.4,0,1);bellGlyph(ctx,760,212,1,ring>0&&ring<1?1-ring*0.3:0);
    il_C_sys(ctx,1000,190,300,86,"Learning platform",null,[150,190,255],ICON.lms);il_C_sys(ctx,1000,296,300,86,"Library",null,[150,190,255],ICON.lib);
    [[1000,233],[1000,339]].forEach(([x,y],i)=>{const s0=cEv+0.9+i*0.3;if(t>s0&&t<s0+1)lane(ctx,[P(838,360),P(x,y)],LAYER.gold,1-(t-s0));const s1=cEv+2.6+i*0.5;if(t>s1&&t<s1+2){const u=(t-s1)/2,f=u<0.5?u*2:(1-u)*2;lane(ctx,[P(x,y),P(lerp(x,420,f),lerp(y,500,f))],C.hot,1);if(u>0.4&&u<0.6)glow(ctx,420,500,60,C.hot,0.8);}});});
  // the SQL endpoint, out on the right, so the copies' words beside the older system stay clear of it
  const SQ=1900,SL=[P(270,280),P(270,110),P(SQ,110),P(SQ,176)];
  withA(ctx,dim(cSq-0.3),()=>{lane(ctx,SL,C.hot,0.8);screen2(ctx,SQ-200,176,400,210,[150,200,255]);bars(ctx,SQ-170,206,340,150,t,C.hot,7);il_C_chip(ctx,SQ,430,"databricks","SQL endpoint","a reading room for big questions",{align:"center"});
    if(t>cSq&&t<cCp+0.5)spawn(t,0.15,1.3,cSq,(u,k)=>{const q=at(mk(SL),u);glow(ctx,q.x,q.y,9,C.hot,1);});});
  withA(ctx,dim(cCp-0.3),()=>{const oc=il_C_sys(ctx,1000,430,300,86,"Older system","can't read the originals",[200,200,215],ICON.old),cr=oc.x+oc.w;lane(ctx,[P(838,380),P(1000,473)],C.warm,0.9);
    if(t>cCp)spawn(t,0.6,1.1,cCp,(u,k)=>{const x=lerp(cr+24,SX-22,u);ctx.fillStyle="rgba(236,240,246,0.95)";rr(ctx,x-18,470-(k%3)*3,36,26,4);ctx.fill();});
    for(let i=0;i<4;i++){const x=SX+i*10,y=520-i*6;ctx.fillStyle="rgba(236,240,246,0.95)";rr(ctx,x-18,y,36,26,4);ctx.fill();if(t>chg+0.4){ctx.fillStyle=rgba(BAD,0.95);ctx.beginPath();ctx.arc(x+16,y+2,9,0,TAU);ctx.fill();T(ctx,"!",x+16,y+7,{w:800,size:13,align:"center",color:"#fff",deco:1});}}
    withA(ctx,fin(t,chg+0.6),()=>tag(ctx,SX+15,590,"out of date",BAD,{align:"center",size:22}));});
  // the projector's row, lower than before, so a close look at it leaves the copies and the SQL endpoint out of the frame
  const pa=dim(cPr-0.2);withA(ctx,pa,()=>{lane(ctx,[P(270,840),P(270,1010),P(650,1010)],LAYER.gold,0.9);projector2(ctx,700,1010,1.2,false);il_C_chip(ctx,700,910,null,"Projector","the original, shown elsewhere",{align:"center",edge:LAYER.gold});
    // the two screens close to the projector, so the closing look holds the projector's name and both screens at once
    [{x:1040,c:fin(t,cSh),n:"OpenSharing",s:"partner university",ic:ICON.uni},{x:1480,c:fin(t,cMi),n:"Mirroring",s:"Microsoft Fabric",ic:null}].forEach(o=>{screen2(ctx,o.x,910,380,210,DOM.research.c);if(o.c>0){cone(ctx,760,1010,o.x,910,o.x,1120,LAYER.gold,o.c);withA(ctx,o.c,()=>{if(o.n==="OpenSharing")ctx.drawImage(pv("research",0),o.x+8,918,364,194);else[["teaching",0],["students",0],["research",3],["finance",1]].forEach(([dk,vi],k)=>{ctx.drawImage(pv(dk,vi),o.x+10+(k%2)*182,920+((k/2)|0)*97,178,93);pvLive(ctx,dk,vi,o.x+10+(k%2)*182,920+((k/2)|0)*97,178,93,t);ctx.strokeStyle=rgba(DOM[dk].c,0.9);ctx.lineWidth=2;ctx.strokeRect(o.x+10+(k%2)*182,920+((k/2)|0)*97,178,93);});glow(ctx,o.x+190+130*Math.sin(t*1.3),1015,40,DOM.research.c,0.6);});}withA(ctx,o.c,()=>il_C_chip(ctx,o.x+190,1170,null,o.n,o.s,{align:"center",edge:DOM.research.c,ts:20,ss:16}));});
    const fe=fin(t,cFe);withA(ctx,fe,()=>{screen2(ctx,2250,930,280,180,C.mcp);cone(ctx,2620,1020,2530,930,2530,1110,C.mcp,1);projector2(ctx,2660,1020,1.1,true);il_C_sys(ctx,2740,960,320,110,"Research grants system","stays where it lives",[150,230,190],ICON.doc);for(let r=0;r<5;r++){ctx.fillStyle=rgba(C.mcp,0.85);rr(ctx,2270,950+r*30,120+((r*37)%80),14,4);ctx.fill();}il_C_chip(ctx,2390,1170,null,"Federation","their data, where it lives",{align:"center",edge:C.mcp,ts:20,ss:16});});});
  // zero-copy, under the projector, in the closing look at the projector and its two screens
  withA(ctx,fin(t,cOn),()=>il_C_chip(ctx,925,1290,null,"Zero-copy","projected, never copied",{align:"center",edge:LAYER.gold}));
  if(t>cTw-pzT-0.1&&t<cTw+0.6){const a=clamp((t-cTw+pzT+0.1)/(pzT+0.1),0,1)*(1-sstep(cTw+0.2,cTw+0.6,t));glow(ctx,756,1010,40+70*a,[255,236,190],0.7*a);}
  // the breather: the original changes; both projected screens show it in the same instant, while the copy falls behind
  const B=c("breath");if(sc.breathe&&t>B){[0.6,2.2].forEach(d=>{const u=t-B-d;if(u>0&&u<1.4){const a=1-u/1.4;glow(ctx,270,560,260,LAYER.gold,0.6*a);if(u>0.15)[[1230,1015],[1670,1015]].forEach(([x,y])=>glow(ctx,x,y,240,[255,245,220],0.5*(1-(u-0.15)/1.25)));}if(u>0.3&&u<2.3)glow(ctx,SX+30,520,120,BAD,0.5*Math.sin((u-0.3)/2*Math.PI));});}
  });
  vign(ctx,S);
});
