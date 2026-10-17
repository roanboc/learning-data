/* ===== Which value wins: scenes =====
   Ten chapters, as in ../script.md: HMS Beagle in Plymouth Sound in 1831, and her twenty-two clocks; Linh's records, linked and still
   different; one order for every field, hidden in the SQL, and the newest value winning; her two names; a rule for each field, in the
   model's YAML; her four emails, each a contact point; every value with its source; a rule change, seen before it runs; a bank and a
   shop; and the Beagle coming home, thirty-three seconds out. Drawn in watercolour (shared/src/wash.js), made to read on a phone
   (tools/legible.py): text is at least 28 px in the frame. The camera moves in on whatever the narration is about, and every shot
   drifts slowly; things arrive with a spring. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs
   to here, so keep the two in step. */

// the camera, as The map before the data moves it (keys are [time, x, y, zoom], each move eased over d seconds), kept inside the place
function m3_focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z);x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// every scene's start and end: the place under the camera (or none, when the scene paints its own), and over it all, the paper
function m3_open(ctx,S,t,sc,place,keys,o){o=o||{};setScreen(ctx,S);ctx.save();const cam=m3_focus(ctx,t,keys,o.d||1.6);drift(ctx,t,sc,{z:o.z==null?0.018:o.z,x:o.dx||960,y:o.dy||560});
  if(place)m3_place(ctx,place);return cam;}
function m3_close(ctx,S){ctx.restore();setScreen(ctx,S);}
// a pencil arc over the shelves, from one clock to another, drawn on as p goes 0 to 1
function m3_arc(ctx,x0,y0,x1,y1,lift,p,o){if(p<=0)return;const pts=[],cx=(x0+x1)/2,cy=Math.min(y0,y1)-lift;for(let i=0;i<=20;i++){const u=i/20,a=(1-u)*(1-u),b=2*(1-u)*u,d=u*u;
  pts.push([a*x0+b*cx+d*x1,a*y0+b*cy+d*y1]);}wc_pencil(ctx,pts,p,Object.assign({lw:2.2,a:0.6,dash:[3,9],amp:0.6,seed:Math.round(x0+x1)},o||{}));}
// a value's source, the rule that chose it and how old it is: the parts side by side, the source in its ink, each fading in with a[i]
function m3_prov(ctx,x,y,src,parts,a){let xx=x;parts.forEach((s,i)=>{const al=a&&a[i]!=null?a[i]:1,str=(i?" · ":"")+s;if(al>0.01)wc_T(ctx,str,xx,y,{w:600,size:28,col:i===0?m3_ink(src):WC_INK,a:al});
  xx+=tw(ctx,str,28,600);});return xx;}
// a pointer, clicking
function m3_cursor(ctx,x,y,a,press){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);const k=1-0.12*(press||0);ctx.scale(k,k);ctx.beginPath();ctx.moveTo(0,0);
  ctx.lineTo(0,36);ctx.lineTo(9,28);ctx.lineTo(16,42);ctx.lineTo(23,39);ctx.lineTo(16,25);ctx.lineTo(28,25);ctx.closePath();ctx.fillStyle=rgba([255,255,255],1);ctx.fill();
  ctx.strokeStyle=rgba(WC_INK,0.9);ctx.lineWidth=2.2;ctx.lineJoin="round";ctx.stroke();ctx.restore();});}

/* ---------- 1. Twenty-two clocks ---------- */
scene("clocks",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tP=c("plymouth"),tHMS=w("plymouth","HMS Beagle"),tT=c("time"),tEW=w("time","east or west"),tDr=w("drift","And clocks drift"),tTwo=c("two"),tWh=w("two","which one"),
    tM=c("many"),t22=w("many","twenty-two"),tR=c("rated"),tWr=w("rated","written down"),tSt=c("standards"),tStd=w("standards","the standards"),tChk=w("standards","checked against"),
    tBf=c("before"),tDec=w("before","decided before");
  // the camera: the Sound, in towards the Beagle; back for the card; the cabin, in on the rate book, out for the standards, down to the
  // book as it shuts; out again for the clocks, ticking, before the title
  m3_open(ctx,S,t,sc,null,[[0,960,540,1],[tP+0.8,1080,520,1.1],[tT-0.5,960,470,1],[tM-0.4,960,500,1],[tR-0.3,520,665,1.3],[tSt-0.3,960,500,1],[tBf-0.2,905,600,1.06],[B,960,520,1]]);
  const cab=fin(t,tM-0.7,0.9);
  if(cab<0.99){m3_place(ctx,"sound");m3_ship(ctx,1110,M3_WL,0.9,t,{});
    withA(ctx,1-fin(t,tT-1.0,0.4),()=>arrive(ctx,1124,300,t,tHMS-0.1,()=>wc_tag(ctx,1124,300,"HMS Beagle",{align:"center"}),{dy:8}));
    // how a ship finds its longitude, over the Sound, quietened; its home clock drifts, and a second one disagrees
    const lc=fin(t,tT-0.4,0.6)*(1-fin(t,tM-1.1,0.4));m3_hush(ctx,0.5*fin(t,tT-0.4,0.6)*(1-cab));
    if(lc>0.01)withA(ctx,lc,()=>{const L=M3_LON,home=55200+Math.max(0,Math.floor((t-tT)*2)/2)+240*ease(clamp((t-tDr)/1.6,0,1)),home2=55000+Math.max(0,Math.floor((t-tTwo)*2)/2);
      arrive(ctx,L.x+L.w/2,L.y+L.h/2,t,tT-0.4,()=>m3_lon(ctx,t,{home,home2,drift:fin(t,tDr+0.9,0.6),two:fin(t,tTwo+0.1,0.6),arrow:clamp((t-tEW+0.2)/0.8,0,1)}),{dy:24,d:0.9});
      arrive(ctx,L.x+915,L.y+L.h+46,t,tWh+0.2,()=>wc_tag(ctx,L.x+915,L.y+L.h+46,"which is wrong?",{align:"center"}),{dy:8});});}
  if(cab>0.01){m3_place(ctx,"cabin",cab);withA(ctx,cab,()=>{
    // the twenty-two clocks spring onto their shelves, each ticking at its own rate
    M3_CLK.forEach((k,i)=>arrive(ctx,k.x,k.y-62,t,tM-0.3+i*0.05,()=>m3_box(ctx,i,t),{dy:-18,d:0.6}));
    withA(ctx,1-fin(t,tR-0.4,0.5),()=>arrive(ctx,960,470,t,t22+0.2,()=>wc_tag(ctx,960,470,"22 clocks",{align:"center"}),{dy:8}));
    // the two thought best: ringed in gold, the standards; every other clock checked against them in turn, a pencil arc that comes and
    // goes, and ticked
    const fade=1-0.7*fin(t,B+0.2,1.2);withA(ctx,fade,()=>M3_CLK.forEach((k,i)=>{if(M3_STD.includes(i))return;const sj=i<11?0:1,s=M3_CLK[M3_STD[sj]],d=Math.abs(k.x-s.x)/148,
      t0=tChk-0.1+d*0.16,p=clamp((t-t0)/0.5,0,1),aa=0.6*(1-fin(t,t0+0.7,0.9));if(aa>0.01)m3_arc(ctx,s.x,s.y-128,k.x,k.y-128,18+d*5,p,{a:aa});
      wc_tick(ctx,k.x,k.y-16,18,M3_GOLDINK,clamp((t-t0-0.45)/0.3,0,1),2.6);}));
    M3_STD.forEach((i,j)=>{const k=M3_CLK[i];wc_ring(ctx,k.x,k.y-62,82,84,clamp((t-tStd-0.1-j*0.45)/0.8,0,1),{col:M3_GOLD,lw:5,seed:61+j});
      const bw=Math.round(tw(ctx,"standard",28,700)+28);arrive(ctx,k.x,k.y-152,t,tStd+0.3+j*0.45,()=>wc_badge(ctx,k.x-bw/2,k.y-152,"standard"),{dy:8});});
    // the rate book: each clock's drift, written down; it shuts on its ribbon
    arrive(ctx,430,745,t,tR-0.4,()=>m3_rateBook(ctx,t,430,745,{head:tR+0.1,rows:tWr-0.4,shut:clamp((t-tDec)/0.8,0,1)}),{dy:30,d:0.9});
    arrive(ctx,1150,770,t,tDec+0.5,()=>wc_tag(ctx,1150,770,"decided before they disagree",{align:"center"}),{dy:8});});}
  m3_close(ctx,S);
  wc_year(ctx,64,80,"December 1831 · Plymouth",fin(t,0.4,0.6)*(1-fin(t,tT-0.6,0.4)));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  wc_title(ctx,S,t,B+0.6,"Which value wins","a rule for each field, and who says so","Film 3 of 9 · master and reference data");});

/* ---------- 2. Linked, and still different ---------- */
// Linh, as the person, on the left; her five records; her record, the person, on the right
const M3_LX=196,M3_LY=876,M3_LS=0.78,M3_ALL=["student","tutor","researcher","alumna"].map(r=>({col:WC_ROLE[r]}));
const M3_S2={x:1010,y:96,w:870};let M3_L2=null;
const m3_recFrom=i=>[M3_RX+M3_RW-24,m3_ry(i)+M3_RH/2];
scene("linked",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tL=c("linked"),tFive=w("linked","five records"),tMei=w("linked","Mei's office"),tN=c("needs"),tNm=w("needs","one name"),tBd=w("needs","one birth date"),tReach=w("needs","a way to reach"),
    tDis=w("disagree","agree"),tC=c("counts"),tGroups=[w("counts","Four ways"),w("counts","Two birth dates"),w("counts","Two mobile"),w("counts","Four emails")],tWh=c("which");
  if(!M3_L2)M3_L2=m3_recLayout(M3_S2.x,M3_S2.y,M3_S2.w);const Lay=M3_L2;
  // the camera: the campus; down the sheet as its values arrive; in on it for the question
  m3_open(ctx,S,t,sc,"campus",[[0,960,540,1],[tC-0.4,1000,520,1.03],[tWh-0.3,1000,500,1.05]]);
  m3_hush(ctx,0.58*fin(t,tL-0.5,0.8));
  // Linh, the person, in white paper, and the lines to her five records
  wc_white(ctx,"linh",M3_LX,M3_LY,M3_LS,M3_ALL,{a:fin(t,tL-0.4,0.8)});
  arrive(ctx,M3_LX,368,t,tL,()=>wc_tag(ctx,M3_LX,368,"Linh",{align:"center"}),{dy:8});
  M3_R5.forEach((r,i)=>{const t0=tFive-0.1+i*0.16;wc_link(ctx,M3_LX+70,M3_LY-330,M3_RX-8,m3_ry(i)+M3_RH/2,m3_col(r[0]),{p:clamp((t-t0-0.3)/0.6,0,1),a:0.8});
    // and when they don't agree, each shakes its head
    const sh=t>tDis&&t<tDis+1.2?Math.sin((t-tDis-i*0.07)*24)*7*Math.exp(-(t-tDis)*3.2)*(t>tDis+i*0.07?1:0):0;
    ctx.save();ctx.translate(sh,0);arrive(ctx,M3_RX+M3_RW/2,m3_ry(i)+M3_RH/2,t,t0,()=>m3_rec5(ctx,i),{dy:14});ctx.restore();});
  arrive(ctx,652,92,t,tMei-0.2,()=>wc_tag(ctx,652,92,"one person · decided by Mei's office",{align:"center",wash:M3_GOLD,washA:0.4}),{dy:8});
  // her record, the person: a field for each thing she needs; then each field's values, from the records that hold them
  arrive(ctx,M3_S2.x+M3_S2.w/2,M3_S2.y+Lay.h/2,t,tN-0.3,()=>m3_sheet(ctx,M3_S2.x,M3_S2.y,M3_S2.w,Lay.h,
    Lay.rows.map(([lab,y],i)=>[lab,y,fin(t,[tNm,tBd,tReach,tReach+0.3][i]-0.1,0.5)])),{dy:20,d:0.9});
  M3_FIELDS.forEach(([lab,keys],g)=>keys.forEach((k,j)=>m3_fly(ctx,k,clamp((t-tGroups[g]-j*0.22)/0.9,0,1),m3_recFrom(M3_FROM[k]),Lay.at[k])));
  const q="which value wins?";m3_note(ctx,q,M3_S2.x+M3_S2.w-36-tw(ctx,q,32,700),M3_S2.y+60,clamp((t-tWh+0.1)/0.9,0,1),{size:32});
  m3_close(ctx,S);
  wc_year(ctx,64,80,"today · the university",fin(t,0.3,0.6)*(1-fin(t,tL-0.2,0.5)));wc_paperOver(ctx,S);});

/* ---------- 3. One order, hidden in the SQL ---------- */
const M3_S3={x:110,y:96,w:870};let M3_L3=null;
scene("hidden",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tPk=c("picks"),tO=c("order"),tN1=w("order","the student system"),tN2=w("order","the learning platform"),tN3=w("order","short courses"),tE=c("every"),tEv=w("every","for every field"),
    tIn=w("every","inside the SQL"),tOwn=w("every","the people who own"),tSee=w("every","can't see"),tQ=c("quick"),tNw=w("quick","the newest value"),tRs=c("resend"),tHR=w("resend","HR sends"),
    tF1=w("resend","its whole file"),tF2=w("resend","every teaching"),tNew=w("resend","always look new"),tTy=c("typo"),tTypo=w("typo","HR's typo"),tOld=w("typo","her old mobile"),
    tTr=c("transcript"),tPr=w("transcript","print her name"),tTru=c("truest");
  if(!M3_L3)M3_L3=m3_recLayout(M3_S3.x,M3_S3.y,M3_S3.w);const Lay=M3_L3;
  // the camera: the code; out to Mei; then her record, HR's file and the transcript
  m3_open(ctx,S,t,sc,"office",[[0,780,420,1.1],[tE-0.3,960,500,1],[tQ-0.4,960,540,1],[tTy-0.3,960,500,1.02],[tTru-0.4,960,520,1]]);
  // the model's SQL: one order for every field, numbered as it's read out, ringed; Mei, outside it
  const p1=1-fin(t,tQ-1.0,0.5);
  if(p1>0.01)withA(ctx,p1,()=>{const C=M3_CODE;ctx.save();ctx.translate(-120*(1-p1),0);
    arrive(ctx,C.x+C.w/2,C.y+C.h/2,t,tPk-0.4,()=>m3_code(ctx,{nums:[fin(t,tN1,0.4),fin(t,tN2,0.4),fin(t,tN3,0.4)]}),{dy:20,d:0.9});
    const cw=m3_cw(),rx=64*cw/2+2;wc_ring(ctx,C.x+106+64*cw/2,C.y+331,rx,56,clamp((t-tEv)/0.9,0,1),{seed:71});
    arrive(ctx,C.x+C.w/2-40,C.y+C.h+44,t,tEv+0.6,()=>wc_tag(ctx,C.x+C.w/2-40,C.y+C.h+44,"one order · every field",{align:"center"}),{dy:8});
    const bw=Math.round(tw(ctx,"in the SQL",28,700)+28);arrive(ctx,C.x+C.w-34-bw/2,C.y+46,t,tIn,()=>wc_badge(ctx,C.x+C.w-34-bw,C.y+46,"in the SQL"),{dy:6});ctx.restore();
    const ex=fin(t,tOwn-0.2,0.6);arrive(ctx,1530,700,t,tOwn-0.6,()=>m3_person(ctx,"mei",1530,1010,0.95,{pose:"stand",pose2:"explain",mix:ex,expr:t>tSee?"concerned":"calm",t,flip:true}),{d:0.9,from:0.97});
    arrive(ctx,1480,354,t,tOwn-0.3,()=>{wc_panel(ctx,1310,300,340,108,{kind:"card"});wc_T(ctx,"Mei Tanaka",1338,346,{w:800,size:32,col:WC_DARK});wc_T(ctx,"registrar's office",1338,386,{w:600,size:28,col:WC_MUTED});},{dy:12});
    m3_note(ctx,"?",1650,530,clamp((t-tSee)/0.4,0,1),{size:76,col:WC_INK,align:"center"});});
  // her record, under "the newest wins": HR sends its whole file again, and its values take every field
  const p2=fin(t,tQ-0.45,0.6);
  if(p2>0.01)withA(ctx,p2,()=>{const R=M3_S3,hw=fin(t,tNew,0.7),hrK={hrn:1,dobHR:1,mobHR:1,eWork:1};
    arrive(ctx,R.x+R.w/2,R.y+Lay.h/2,t,tQ-0.45,()=>{m3_sheet(ctx,R.x,R.y,R.w,Lay.h,Lay.rows);
      M3_FIELDS.forEach(([lab,keys])=>keys.forEach(k=>{const [x,y]=Lay.at[k];m3_val(ctx,x,y,k,hrK[k]?{win:hw}:{dim:0.8*hw});}));},{dy:16,d:0.9});
    const rs="newest wins",rw=Math.round(tw(ctx,rs,28,700)+44),rx=R.x+R.w-30-rw;arrive(ctx,rx+rw/2,R.y+46,t,tNw,()=>{wc_panel(ctx,rx,R.y+20,rw,52,{kind:"tag",dashed:true,role:WC_PENCIL,seed:3});
      wc_T(ctx,rs,rx+22,R.y+56,{w:700,size:28,col:WC_DARK});},{dy:6});
    // HR, and its file, sent again: once in February, once in July
    arrive(ctx,1610,180,t,tHR-0.3,()=>wc_roleCard(ctx,1380,120,460,120,"tutor","HR","E-4417",null,{note:"sends its whole file"}),{dy:12});
    [[tF1,"sent Feb 2026",1290,330],[tF2,"sent Jul 2026",1560,366]].forEach(([t0,s,x1,y1])=>{const p=clamp((t-t0)/0.9,0,1);if(p<=0)return;const e=ease(p);
      m3_file(ctx,lerp(1610,x1,e),lerp(200,y1,e)-Math.sin(e*Math.PI)*60,lerp(0.4,0.82,e),s,clamp(p*3,0,1));});
    // the typo and the old mobile; the name as HR typed it, on her transcript
    const ring=(k,t0,seed)=>{const [x,y]=Lay.at[k],vw=m3_vw(k);wc_ring(ctx,x+vw/2,y,vw/2+20,40,clamp((t-t0)/0.7,0,1),{col:WC_NO,seed});return x+vw;};
    const xd=ring("dobHR",tTypo,73);m3_note(ctx,"typo",xd+30,Lay.at.dobHR[1]+10,clamp((t-tTypo-0.4)/0.5,0,1),{size:32,col:WC_NO});
    const xm=ring("mobHR",tOld,75);m3_note(ctx,"old",xm+30,Lay.at.mobHR[1]+10,clamp((t-tOld-0.4)/0.5,0,1),{size:32,col:WC_NO});
    ring("hrn",tPr,77);
    arrive(ctx,1540,588,t,tTr+0.1,()=>m3_transcript(ctx,1240,470,600,"Linh Nguyen","born 14 May 2001"),{dy:16});
    wc_cross(ctx,1740,560,96,WC_NO,clamp((t-tTru+0.5)/0.6,0,1));
    m3_note(ctx,"newest isn't truest",1540,786,clamp((t-tTru-0.1)/1.0,0,1),{size:40,align:"center"});});
  m3_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 4. Two names, both hers ---------- */
scene("names",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tL=c("legal"),tFam=w("legal","family name first"),tAcc=w("legal","with its accents"),tPass=w("legal","her passport"),tCk=c("checked"),tLo=c("lost"),tLa=w("lost","lost the accents"),
    tHR=w("lost","HR turned"),tLN=w("lost","Linh Nguyen"),tCh=c("chose"),tBo=c("both"),tTr=c("transcript"),tCl=c("class"),tID=w("class","her ID card"),tRu=c("rule"),tOwn=w("rule","its own rule");
  m3_open(ctx,S,t,sc,"plain",[[0,980,470,1.04],[tLo-0.3,960,540,1],[tRu-0.3,960,520,1.02]]);
  const N=M3_NAME,parts=m3_nameParts(ctx),dimV=fin(t,tBo-0.2,0.6);
  // her legal name, large: family name first, with its accents; what each part is, in pencil
  arrive(ctx,N.x+N.w/2,N.y+N.h/2,t,tL-0.3,()=>{wc_panel(ctx,N.x,N.y,N.w,N.h,{kind:"card",seed:51});wc_T(ctx,"NGUYỄN Thị Linh",N.x+N.w/2,N.y+124,{w:800,size:76,align:"center",col:WC_DARK});},{dy:16,d:0.9});
  // each label under its part, nudged apart where two would touch
  const lab=["family name","middle name","given name"].map((s,i)=>{const [x,pw]=parts[i];return {s,lw:tw(ctx,s,28,600),cx:x+pw/2};});
  for(let k=0;k<2;k++)for(let i=1;i<lab.length;i++){const a=lab[i-1],b=lab[i],o=a.cx+a.lw/2+28-(b.cx-b.lw/2);if(o>0){a.cx-=o/2;b.cx+=o/2;}}
  lab.forEach((l,i)=>m3_note(ctx,l.s,l.cx-l.lw/2,N.y+186,clamp((t-tFam-i*0.45)/0.7,0,1),{size:28,w:600,col:WC_MUTED}));
  // the accents, ringed
  const ac=[[0,"NGUYỄ"],[1,"Thị"]];ac.forEach(([i,s],j)=>{const [x]=parts[i],cx=x+tw(ctx,s,76,800)-tw(ctx,s.slice(-1),76,800)/2;wc_ring(ctx,cx,N.y+86,26,48,clamp((t-tAcc-j*0.3)/0.6,0,1),{seed:81+j,lw:2.6});});
  // her passport, and the student system's check
  arrive(ctx,1550,250,t,tPass-0.3,()=>m3_passport(ctx,1340,130),{dy:16});
  wc_tick(ctx,1710,330,54,WC_ROLEINK.student,clamp((t-tCk-0.3)/0.5,0,1),6);
  withA(ctx,1-fin(t,tTr-0.3,0.5),()=>arrive(ctx,1550,404,t,tCk+0.4,()=>wc_tag(ctx,1550,404,"checked · student system · Jul 2025",{align:"center",col:WC_ROLEINK.student}),{dy:8}));
  // the other ways it's been written: without its accents, and turned round
  withA(ctx,1-0.7*dimV,()=>{arrive(ctx,380,514,t,tLo-0.1,()=>m3_variant(ctx,120,450,520,"Nguyen Thi Linh","ao","alumni office · 2019 record"),{dy:14});
    const vx=150,nw=tw(ctx,"Nguy",40,800),ew=tw(ctx,"e",40,800),tx=vx+tw(ctx,"Nguyen Th",40,800),iw=tw(ctx,"i",40,800);
    wc_ring(ctx,vx+nw+ew/2,492,18,30,clamp((t-tLa-0.2)/0.6,0,1),{seed:83,lw:2.6});wc_ring(ctx,tx+iw/2,492,16,30,clamp((t-tLa+0.1)/0.6,0,1),{seed:85,lw:2.6});
    arrive(ctx,960,514,t,tHR-0.2,()=>m3_variant(ctx,700,450,520,"Linh Nguyen","hr","HR · 2023"),{dy:14});
    const lw2=tw(ctx,"Linh",40,800),gw=tw(ctx,"Linh Nguyen",40,800);m3_swap(ctx,730+lw2/2,730+lw2+tw(ctx," ",40,800)+(gw-lw2-tw(ctx," ",40,800))/2,454,clamp((t-tLN)/0.7,0,1));});
  // the name she chose, set by her
  arrive(ctx,1570,514,t,tCh+0.2,()=>{wc_panel(ctx,1300,450,540,128,{kind:"card",seed:57});wc_T(ctx,"Linh",1330,506,{w:800,size:40,col:WC_DARK});
    m3_dot(ctx,1340,544,"self");wc_T(ctx,"preferred · set by Linh",1362,554,{w:600,size:28,col:WC_INK});},{dy:14});
  // what each is for: her transcript, the legal name; her class lists and her ID card, the one she chose
  wc_link(ctx,670,N.y+N.h+6,670,632,WC_ROLE.student,{p:clamp((t-tTr)/0.6,0,1),vertical:true,a:0.8});
  arrive(ctx,670,692,t,tTr+0.2,()=>m3_use(ctx,440,632,460,"Transcript","NGUYỄN Thị Linh"),{dy:12});
  [[1350,tCl],[1690,tID]].forEach(([x,t0])=>wc_link(ctx,1570,584,x,632,WC_PENCIL,{p:clamp((t-t0)/0.6,0,1),vertical:true,a:0.7}));
  arrive(ctx,1350,692,t,tCl+0.2,()=>m3_use(ctx,1190,632,320,"Class list","Linh"),{dy:12});
  arrive(ctx,1690,692,t,tID+0.2,()=>m3_use(ctx,1540,632,300,"ID card","Linh",{photo:true}),{dy:12});
  // two names, each needing its own rule
  [[N.x+20,N.y-26,"legal name",0],[1320,424,"preferred name",1]].forEach(([x,y,s,i])=>{const tl=tRu+0.3+i*0.5;arrive(ctx,x+100,y,t,tl,()=>{const tw0=wc_tag(ctx,x,y,s,{wash:M3_GOLD,washA:0.25});
    const rw=Math.round(tw(ctx,"rule?",28,700)+40);withA(ctx,fin(t,tOwn+i*0.3,0.4),()=>{wc_panel(ctx,x+tw0+12,y-26,rw,52,{kind:"tag",dashed:true,role:WC_PENCIL,seed:i+9});wc_T(ctx,"rule?",x+tw0+32,y+10,{w:700,size:28,col:WC_DARK});});},{dy:8});});
  m3_close(ctx,S);wc_paperOver(ctx,S);});
// a pencil arrow that swaps two words: an arc over the first to the second, and back under, as p goes 0 to 1
function m3_swap(ctx,x0,x1,y,p){if(p<=0)return;const top=[],m=(x0+x1)/2;for(let i=0;i<=16;i++){const u=i/16;top.push([lerp(x0,x1,u),y-Math.sin(u*Math.PI)*34]);}
  wc_pencil(ctx,top,clamp(p*2,0,1),{lw:2.6,seed:91});if(p>0.5){const a=Math.atan2(top[16][1]-top[15][1],top[16][0]-top[15][0]);ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=2.6;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(x1-14*Math.cos(a-0.5),y-14*Math.sin(a-0.5));ctx.lineTo(x1,y);ctx.lineTo(x1-14*Math.cos(a+0.5),y-14*Math.sin(a+0.5));ctx.stroke();ctx.restore();}}

/* ---------- 5. A rule for each field ---------- */
const M3_S5={x:1040,y:80,w:800,h:680};
// where each row's values are: [label baseline, first line's middle, second line's middle]
const M3_R5Y={legal:[122,160,222],pref:[282,320,320],birth:[380,418,480],mobile:[540,578,640]};
scene("rules",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tWr=c("writes"),tTr=c("trust"),tStd=w("trust","the Beagle's standards"),tMost=w("trust","trusts most"),tLe=c("legal"),tPass=w("legal","checked her passport"),tPf=c("preferred"),tFL=w("preferred","from Linh"),
    tBi=c("birth"),tWa=c("waits"),tWM=w("waits","waits for Mei"),tPi=c("pin"),tTypo=w("pin","still has the typo"),tPins=w("pin","Mei pins"),tReason=w("pin","with a reason"),
    tMo=c("mobile"),tConf=w("mobile","she confirmed"),tSent=w("mobile","not the newest one sent"),tCh=c("chain"),tC1=w("chain","the most trusted source"),tC2=w("chain","the newest confirmed"),
    tC3=w("chain","the most complete"),tD=c("dbt"),tSQL=w("dbt","into the SQL"),tTest=w("dbt","into tests");
  m3_open(ctx,S,t,sc,"officeB",[[0,960,540,1],[tLe-0.4,965,530,1.025],[tCh-0.4,960,540,1]]);
  const R=M3_S5,x0=R.x+30,yy=k=>R.y+M3_R5Y[k][1],yy2=k=>R.y+M3_R5Y[k][2],vw=m3_vw;
  // Jun, and his name until the camera moves in
  const ex=fin(t,tWr+0.4,0.6)*(1-fin(t,tTr+0.4,0.6))+fin(t,tD-0.3,0.6);
  arrive(ctx,180,700,t,-0.3,()=>person(ctx,"jun",180,1010,0.92,{pose:"stand",pose2:"explain",mix:clamp(ex,0,1),expr:t>tD+1?"relieved":"calm",t}),{d:0.8});
  withA(ctx,1-fin(t,tLe-0.5,0.5),()=>arrive(ctx,180,164,t,tWr-0.2,()=>{wc_panel(ctx,24,110,316,108,{kind:"card"});wc_T(ctx,"Jun Park",52,156,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,"analytics engineer",52,196,{w:600,size:28,col:WC_MUTED});},{dy:12}));
  // the YAML: one field's rule at a time, typed, then folded to its line
  const ty=[clamp((t-tLe+0.2)/1.9,0,1),clamp((t-tPf+0.2)/1.3,0,1),clamp((t-tBi+0.2)/1.9,0,1),clamp((t-tMo+0.2)/1.4,0,1)],fo=[fin(t,tPf-0.4,0.6),fin(t,tBi-0.4,0.6),fin(t,tMo-0.4,0.6),fin(t,tCh-0.2,0.6)];
  arrive(ctx,M3_Y.x+M3_Y.w/2,M3_Y.y+M3_Y.h/2,t,tWr-0.1,()=>m3_yaml(ctx,{type:ty,fold:fo}),{dy:20,d:0.9});
  // her record: each row's values, until its rule decides; the record steps away for what dbt writes
  const ra=1-fin(t,tD-0.3,0.6);
  if(ra>0.01)withA(ctx,ra,()=>{ctx.save();ctx.translate(140*(1-ra),0);arrive(ctx,R.x+R.w/2,R.y+R.h/2,t,tWr+0.3,()=>{m3_sheet(ctx,R.x,R.y,R.w,R.h,[["legal name",R.y+M3_R5Y.legal[0]],
      ["preferred name",R.y+M3_R5Y.pref[0]],["birth date",R.y+M3_R5Y.birth[0]],["mobile",R.y+M3_R5Y.mobile[0]]]);},{dy:16,d:0.9});
    const ap=fin(t,tWr+0.6,0.6);if(ap<=0.01){ctx.restore();return;}withA(ctx,ap,()=>{
      // legal name: the student system's, which checked her passport; the three others fold away behind it
      const dL=fin(t,tPass,0.8),wL=vw("legal");
      [["ron",x0+vw("hrn")+14,yy2("legal"),3],["hrn",x0,yy2("legal"),2],["alum",x0+wL+14,yy("legal"),1]].forEach(([k,sx,sy,i])=>{const e=ease(dL);
        m3_val(ctx,lerp(sx,x0+6*i,e),lerp(sy,yy("legal")+5*i,e),k,{dim:0.85*dL});});
      m3_val(ctx,x0,yy("legal"),"legal",{win:dL});withA(ctx,fin(t,tPass+0.5,0.4),()=>wc_badge(ctx,x0+wL+20,yy("legal"),"+3"));
      withA(ctx,fin(t,tPass+0.6,0.5),()=>m3_prov(ctx,x0,yy2("legal")+10,"sis",["student system","trusted source"]));
      // preferred name: hers
      const dP=fin(t,tFL,0.6);m3_val(ctx,x0,yy("pref"),"pref",{win:dP});withA(ctx,fin(t,tFL+0.3,0.5),()=>m3_prov(ctx,x0+vw("pref")+20,yy("pref")+10,"self",["set by Linh","self-service"]));
      // birth date: the student system's; HR's waits for Mei, who pins the right one, with a reason
      const dB=fin(t,tBi+0.9,0.8),wB=vw("dob"),e=ease(dB);
      m3_val(ctx,lerp(x0+wB+14,x0,e),lerp(yy("birth"),yy2("birth"),e),"dobHR",{dim:0.6*dB});m3_val(ctx,x0,yy("birth"),"dob",{win:dB});
      const wH=vw("dobHR"),bA=fin(t,tWM-0.1,0.4)*(1-fin(t,tTypo,0.4));if(bA>0.01)withA(ctx,bA,()=>wc_badge(ctx,x0+wH+16,yy2("birth"),"waits for Mei",{role:M3_AMBER}));
      m3_note(ctx,"has a typo",x0+wH+18,yy2("birth")+10,clamp((t-tTypo-0.1)/0.7,0,1),{size:30,col:WC_NO});
      m3_pin(ctx,x0+wB-16,yy("birth")-14,clamp((t-tPins)/0.5,0,1));
      withA(ctx,fin(t,tReason-0.1,0.5),()=>wc_T(ctx,"pinned by Mei · until Oct 2027",x0+wB+30,yy("birth")+10,{w:600,size:28,col:M3_GOLDINK}));
      // mobile: the newest she confirmed, not the newest sent
      const dM=fin(t,tConf,0.8),wM=vw("mob"),em=ease(dM);
      m3_val(ctx,lerp(x0+wM+14,x0,em),lerp(yy("mobile"),yy2("mobile"),em),"mobHR",{dim:0.6*dM});m3_val(ctx,x0,yy("mobile"),"mob",{win:dM});
      withA(ctx,fin(t,tConf+0.4,0.5),()=>wc_T(ctx,"confirmed Jul 2025",x0+wM+20,yy("mobile")+10,{w:600,size:28,col:WC_ROLEINK.student}));
      withA(ctx,fin(t,tSent,0.5),()=>wc_T(ctx,"confirmed 2023 · sent Jul 2026",x0+vw("mobHR")+20,yy2("mobile")+10,{w:600,size:28,col:WC_MUTED}));
      // each field's most trusted source, ringed in gold, like the Beagle's standards
      [["legal",yy("legal")],["pref",yy("pref")],["dob",yy("birth")],["mob",yy("mobile")]].forEach(([k,y],i)=>wc_ring(ctx,x0+26,y,20,20,clamp((t-tMost-i*0.18)/0.5,0,1),{col:M3_GOLD,lw:3.4,seed:95+i}));});
    ctx.restore();});
  // the order every other field falls back on
  m3_chain(ctx,1095,820,[fin(t,tC1-0.1,0.5),fin(t,tC2-0.1,0.5),fin(t,tC3-0.1,0.5)]);
  // what dbt writes from the YAML: the SQL, and tests that read the same rules
  const da=fin(t,tSQL-0.6,0.5);if(da>0.01){m3_arrow(ctx,M3_Y.x+M3_Y.w+8,230,1086,230,clamp((t-tSQL+0.5)/0.6,0,1),{lw:3});m3_arrow(ctx,M3_Y.x+M3_Y.w+8,500,1086,500,clamp((t-tTest+0.2)/0.6,0,1),{lw:3});
    const bw=Math.round(tw(ctx,"dbt",28,700)+28);withA(ctx,da,()=>wc_badge(ctx,M3_Y.x+M3_Y.w+56-bw/2,368,"dbt"));}
  arrive(ctx,1470,216,t,tSQL-0.3,()=>m3_sqlCard(ctx,1100,100,740,clamp((t-tSQL)/1.6,0,1)),{dy:16});
  arrive(ctx,1470,498,t,tTest-0.2,()=>m3_testCard(ctx,1100,400,740,[clamp((t-tTest-0.2)/0.8,0,1),clamp((t-tTest-0.8)/0.8,0,1)]),{dy:16});
  m3_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 6. Four emails, each for something ---------- */
const M3_CX=250,M3_CW=920,m3_cy=i=>180+i*140;
// a pencil underline from x0 to x1, drawn on as p goes 0 to 1
function m3_under(ctx,x0,x1,y,p,seed){if(p<=0)return;const pts=[];for(let i=0;i<=8;i++){const u=i/8;pts.push([lerp(x0,x1,u),y+Math.sin(u*Math.PI)*2.4-u*2]);}
  wc_pencil(ctx,pts,p,{lw:3,a:0.9,seed,amp:0.8});}
scene("emails",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tCo=c("column"),tFour=w("column","Linh has four"),tSt=c("study"),tStaff=w("study","Her staff email"),tPe=c("personal"),tNewer=w("personal","a newer one"),tNo=c("none"),tEach=w("none","Each is for"),
    tKe=c("kept"),tCP=w("kept","a contact point"),tPu=w("kept","its purpose"),tSo=w("kept","its source"),tDay=w("kept","the day she"),tUs=c("use"),tHR=w("use","HR writes"),tAO=w("use","The alumni office");
  m3_open(ctx,S,t,sc,"plain",[[0,948,465,1.16],[tSt-0.3,960,500,1.04],[tUs-0.9,1005,520,1]]);
  // one email column, one cell; the other three don't fit
  const tab=1-fin(t,tSt-0.2,0.5),cards=[tSt-0.1,tStaff-0.1,tPe+0.1,tNewer-0.1];
  if(tab>0.01)withA(ctx,tab,()=>{arrive(ctx,660,410,t,tCo-0.3,()=>{wc_panel(ctx,360,340,600,140,{kind:"card",seed:61});wc_T(ctx,"email",390,390,{w:600,size:30,f:"mono",col:WC_DARK});
      ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.4);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(372,412);ctx.lineTo(948,412);ctx.stroke();ctx.restore();
      wc_T(ctx,M3_V.eStudy[0],390,458,{w:500,size:28,f:"mono",col:WC_DARK});},{dy:16});
    ["eWork","eOld","eNew"].forEach((k,i)=>{const p=clamp((t-tFour-i*0.25)/0.9,0,1);if(p<=0)return;const bump=Math.sin(clamp((p-0.55)/0.45,0,1)*Math.PI)*-22,x=1000+340*(1-ease(clamp(p/0.6,0,1)))+bump;
      m3_val(ctx,x,362+i*66,k,{});});});
  // four contact points, centred until the two offices that write to her arrive: each with what it's for, where it comes from, and when she last confirmed it
  const slide=250*(1-ease(fin(t,tUs-0.9,1.3)));ctx.save();ctx.translate(slide,0);
  arrive(ctx,M3_CX,140,t,tCP-0.2,()=>wc_T(ctx,"contact points",M3_CX,142,{w:800,size:36,col:WC_DARK}),{dy:8});
  M3_CP.forEach((cp,i)=>arrive(ctx,M3_CX+M3_CW/2,m3_cy(i)+59,t,cards[i],()=>m3_contact(ctx,M3_CX,m3_cy(i),M3_CW,i,{pl:1+1.2*fin(t,tEach+i*0.15,0.5)*(1-fin(t,tKe,0.8))}),{dy:14}));
  // its purpose, ringed; its source and the day she last confirmed it, underlined
  const pw=Math.round(tw(ctx,"study",28,800)+40),sn=tw(ctx,"student system",28,600),dot=tw(ctx," · ",28,600),dw=tw(ctx,"confirmed Jul 2025",28,600),y0=m3_cy(0);
  wc_ring(ctx,M3_CX+M3_CW-28-pw/2,y0+43,pw/2+18,34,clamp((t-tPu)/0.6,0,1),{seed:101});
  m3_under(ctx,M3_CX+58,M3_CX+64+sn,y0+108,clamp((t-tSo)/0.5,0,1),103);m3_under(ctx,M3_CX+60+sn+dot,M3_CX+64+sn+dot+dw,y0+108,clamp((t-tDay)/0.5,0,1),105);
  // the address the alumni office writes to: the personal one it has had since 2019
  const ow=tw(ctx,M3_V.eOld[0],30,500,"mono");m3_under(ctx,M3_CX+26,M3_CX+32+ow,m3_cy(2)+64,clamp((t-tAO-0.5)/0.6,0,1),107);
  ctx.restore();
  // who writes to which: HR to her staff email; the alumni office to that personal one
  [[tHR,"hr","HR","writes to work",1,286],[tAO,"ao","alumni office","writes to personal",2,516]].forEach(([t0,src,name,note,i,y])=>{
    wc_link(ctx,1336,y+56,M3_CX+M3_CW+8+Math.round(slide),m3_cy(i)+59,m3_col(src),{p:clamp((t-t0-0.3)/0.6,0,1),a:0.85});
    arrive(ctx,1550,y+56,t,t0-0.1,()=>wc_roleCard(ctx,1340,y,420,112,M3_SRC[src].role,name,null,null,{note,seed:i+5}),{dy:12});});
  m3_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 7. Every value, with its source ---------- */
const M3_S7={x:140,y:80,w:1080,h:690},M3_R7=[["legal name","legal","sis",["student system","trusted source","Jul 2025"]],["preferred name","pref","self",["Linh","self-service","Aug 2025"]],
  ["birth date","dob","sis",["student system","pinned by Mei","until Oct 2027"]],["mobile","mob","sis",["student system","newest confirmed","Jul 2025"]]];
const m3_y7=i=>M3_S7.y+146+i*118;
scene("sources",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tSa=c("says"),tWhere=w("says","where it came from"),tRule=w("says","which rule"),tOld=w("says","how old"),tLo=c("lost"),tStill=w("lost","still there"),tClick=w("lost","one click"),
    tWhy=c("why"),tMar=w("why","the fourteenth of March"),tRe=c("read"),tTrn=w("read","Her transcript"),tCls=w("read","her class list"),tAO=w("read","the alumni office");
  m3_open(ctx,S,t,sc,"plain",[[0,960,460,1.1],[tLo-0.4,990,440,1.03],[tWhy-0.3,720,480,1.1],[tRe-0.3,960,540,1]]);
  const R=M3_S7,vx=R.x+270;
  // the record, centred until the values that lost step out beside it
  const slide=280*(1-ease(fin(t,tLo-0.5,1.2)));ctx.save();ctx.translate(slide,0);
  arrive(ctx,R.x+R.w/2,R.y+R.h/2,t,-0.4,()=>{m3_sheet(ctx,R.x,R.y,R.w,R.h,M3_R7.map(([lab],i)=>[lab,m3_y7(i)+10]).concat([["email",m3_y7(4)+10]]));
    M3_R7.forEach(([lab,k,src,parts],i)=>{const y=m3_y7(i);m3_val(ctx,vx,y,k,{win:1});if(k==="dob")m3_pin(ctx,vx+m3_vw("dob")-16,y-14,1);
      m3_prov(ctx,vx,y+52,src,parts,[fin(t,tWhere,0.5),fin(t,tRule,0.5),fin(t,tOld,0.5)]);});
    const y4=m3_y7(4),s4="4 contact points",w4=Math.round(tw(ctx,s4,28,700)+44);wc_panel(ctx,vx,y4-26,w4,52,{kind:"tag",seed:7});wc_T(ctx,s4,vx+22,y4+10,{w:700,size:28,col:WC_DARK});
    withA(ctx,fin(t,tWhere,0.5),()=>wc_T(ctx,"each by its purpose",vx,y4+62,{w:600,size:28,col:WC_INK}));},{dy:16,d:0.9});
  // the values that lost: still there, one click away
  const bx=vx+m3_vw("legal")+20,by=m3_y7(0);withA(ctx,fin(t,tStill-0.4,0.4),()=>wc_badge(ctx,bx,by,"+3"));
  const press=fin(t,tClick,0.15)*(1-fin(t,tClick+0.2,0.2));m3_cursor(ctx,bx+50,by-16,fin(t,tStill,0.4)*(1-fin(t,tWhy-0.4,0.5)),press);
  // why her record says 14 March: the answer, right there under it
  m3_under(ctx,vx-2,vx+4+tw(ctx,"student system · pinned by Mei · until Oct 2027",28,600),m3_y7(2)+66,clamp((t-tMar)/0.7,0,1),113);
  ctx.restore();
  const op=fin(t,tClick+0.1,0.5)*(1-fin(t,tWhy-0.5,0.5));if(op>0.01)withA(ctx,op,()=>{wc_link(ctx,bx+52,by,1272,186,WC_PENCIL,{p:clamp((t-tClick-0.1)/0.5,0,1),a:0.7});
    arrive(ctx,1542,206,t,tClick+0.2,()=>{wc_panel(ctx,1272,84,540,250,{kind:"card",dashed:true,role:WC_PENCIL,seed:111});wc_T(ctx,"not chosen, still kept",1300,130,{w:700,size:28,col:WC_MUTED});
      [["alum","alumni office"],["hrn","HR"],["ron","research office"]].forEach(([k,s],i)=>{const y=176+i*56;m3_val(ctx,1300,y,k,{dim:0.5});wc_T(ctx,s,1300+m3_vw(k)+16,y+10,{w:600,size:28,col:m3_ink(M3_V[k][1])});});},{dy:12});});
  // what reads from it: her transcript, her class list, the alumni office
  [["Transcript","legal name",0,tTrn],["Class list","preferred name",1,tCls],["Alumni office","personal email",4,tAO]].forEach(([title,line,row,t0],i)=>{const y=300+i*134;
    wc_link(ctx,R.x+R.w+6,m3_y7(row),1314,y+52,WC_PENCIL,{p:clamp((t-t0-0.2)/0.6,0,1),a:0.7});
    arrive(ctx,1580,y+52,t,t0-0.1,()=>m3_use(ctx,1320,y,520,title,line),{dy:12});});
  m3_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 8. See it before it changes ---------- */
scene("dryrun",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tCh=c("change"),tAs=c("asks"),tNew=w("asks","asks for a new one"),tPE=w("asks","for personal email"),tRec=w("asks","confirmed most recently"),tDr=c("dry"),tDry=w("dry","a dry run"),
    tList=w("dry","lists every value"),tCo=c("count"),tOne=w("count","One thousand"),tLinh=w("count","Linh's among"),tAp=c("approve"),tSmp=w("approve","checks a sample"),tReg=w("approve","the registrar"),
    tAps=w("approve","approves"),tRu=c("runs"),tV2=w("runs","version two"),tDate=w("runs","with its date");
  m3_open(ctx,S,t,sc,"office",[[0,960,540,1],[tDr-0.3,906,560,1.06],[tRu-0.3,960,540,1]]);
  // the rule as it is; the alumni office's request; the new rule, a draft, until it's approved; then version two, with its date.
  // The old version steps back behind the new one, its tab still showing
  const RX=80,RY=96,v1=fin(t,tCh-0.2,0.5),dr=fin(t,tNew,0.6),back=ease(dr);
  if(v1>0.01)withA(ctx,v1,()=>{const x=RX+72*back,y=RY-14*back;wc_panel(ctx,x,y,560,172,{kind:"card",seed:41});
    withA(ctx,1-back,()=>{wc_T(ctx,"personal email",x+30,y+56,{w:800,size:32,col:WC_DARK});wc_T(ctx,"trusted source",x+30,y+104,{w:600,size:30,col:WC_INK});});
    wc_badge(ctx,lerp(x+30,x+494,back),lerp(y+142,y+86,back),"v1");});
  if(dr>0.01)arrive(ctx,RX+280,RY+86,t,tNew,()=>m3_rule(ctx,RX,RY,{type:clamp((t-tRec+0.4)/0.9,0,1),solid:fin(t,tV2-0.1,0.6),date:fin(t,tDate,0.5)}),{dy:16});
  arrive(ctx,1120,162,t,tAs-0.1,()=>{wc_roleCard(ctx,760,96,720,132,"alumna","alumni office",null,null,{seed:5});
    wc_T(ctx,typeOn("personal email: the one confirmed most recently",clamp((t-tPE)/1.4,0,1)),792,192,{w:600,size:28,col:WC_INK});},{dy:12});
  // the dry run: every value it would change, Linh's first; Mei's ticks on a sample; the registrar's stamp
  const D=M3_DX;arrive(ctx,D.x+D.w/2,D.y+D.h/2,t,tDry-0.3,()=>m3_dry(ctx,t,{count:fin(t,tOne-0.1,0.5),rows:[0,1,2].map(i=>clamp((t-tList-i*0.4)/1.2,0,1)),
    more:fin(t,tOne+1.2,0.5),hi:fin(t,tLinh,0.5),ticks:[clamp((t-tSmp)/0.4,0,1),0,clamp((t-tSmp-0.5)/0.4,0,1)]}),{dy:16,d:0.9});
  m3_stamp(ctx,t,D.x+D.w-190,D.y+D.h-84,tAps-0.05,"approved","the registrar");
  // Mei, by her window as before, pointing to the sample she checks; her name until the dry run takes the room
  const ex=fin(t,tSmp-0.3,0.6)*(1-fin(t,tRu,0.6));
  arrive(ctx,1560,700,t,-0.3,()=>m3_person(ctx,"mei",1560,1010,0.95,{pose:"stand",pose2:"explain",mix:ex,expr:t>tAps?"relieved":"calm",t,flip:true}),{d:0.8});
  withA(ctx,1-fin(t,tDry-0.8,0.5),()=>arrive(ctx,1528,354,t,0.3,()=>{wc_panel(ctx,1380,300,296,108,{kind:"card"});wc_T(ctx,"Mei Tanaka",1408,346,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,"registrar's office",1408,386,{w:600,size:28,col:WC_MUTED});},{dy:12}));
  m3_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 9. Elsewhere ---------- */
scene("elsewhere",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tBk=c("bank"),tSt=c("statements"),tLeg=w("statements","legal name"),tAp=c("app"),tGr=w("app","greets them"),tSh=c("shop"),tBill=w("shop","a billing address"),tDel=w("shop","a delivery address"),
    tEach=w("shop","each for"),tSa=c("same"),tQ=[w("same","which value"),w("same","for what"),w("same","who says so")];
  m3_open(ctx,S,t,sc,"plainB",[[0,960,430,1.08],[tSh-0.3,1380,430,1.08],[tSa-0.3,960,540,1]]);
  // the bank, centred, until the shop arrives beside it; then each dims while the other speaks
  const dim=i=>1-0.55*(i===0?fin(t,tSh-0.3,0.5)*(1-fin(t,tSa-0.3,0.5)):0),slide=465*(1-ease(fin(t,tSh-1.2,1.0)));
  ctx.save();ctx.translate(slide,0);withA(ctx,dim(0),()=>arrive(ctx,M3_PAN[0][0]+M3_PW/2,M3_PY+M3_PH/2,t,tBk-0.3,()=>m3_panel(ctx,0),{dy:16}));
  // a bank: her statement in her legal name; its app greets her by the one she chose
  withA(ctx,dim(0),()=>{const X=M3_PAN[0][0];arrive(ctx,X+290,420,t,tSt-0.2,()=>{wc_panel(ctx,X+40,200,500,380,{kind:"card",seed:71});wc_T(ctx,"Statement",X+70,256,{w:800,size:32,col:WC_DARK});
      wc_T(ctx,"account holder",X+70,330,{w:600,size:28,col:WC_MUTED});withA(ctx,fin(t,tLeg-0.2,0.5),()=>wc_T(ctx,"NGUYỄN THỊ LINH",X+70,378,{w:800,size:32,col:WC_DARK}));
      ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.3);ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(X+70,430+i*34);ctx.lineTo(X+500-(i%2)*90,430+i*34);ctx.stroke();}ctx.restore();},{dy:14});
    arrive(ctx,X+700,380,t,tGr-0.4,()=>m3_phone(ctx,X+590,180,1),{dy:14});});ctx.restore();
  arrive(ctx,M3_PAN[1][0]+M3_PW/2,M3_PY+M3_PH/2,t,tSh-0.2,()=>m3_panel(ctx,1),{dy:16});
  // a shop: a billing address and a delivery address, each for something
  withA(ctx,dim(1),()=>{const X=M3_PAN[1][0];arrive(ctx,X+435,400,t,tSh-0.2,()=>{wc_panel(ctx,X+40,190,790,430,{kind:"card",seed:73});wc_T(ctx,"Order",X+70,246,{w:800,size:32,col:WC_DARK});
      withA(ctx,fin(t,tBill-0.1,0.5),()=>{wc_T(ctx,"billing address",X+70,312,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"7 Hill Road",X+70,356,{w:800,size:32,col:WC_DARK});
        wc_T(ctx,"checked with the card",X+70,400,{w:600,size:28,col:WC_INK});});
      withA(ctx,fin(t,tDel-0.1,0.5),()=>{wc_T(ctx,"deliver to",X+70,470,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"Building 4, the university",X+70,514,{w:800,size:32,col:WC_DARK});
        wc_T(ctx,"this order",X+70,558,{w:600,size:28,col:WC_INK});});},{dy:14});
    [[332,tEach],[502,tEach+0.3]].forEach(([y,t0])=>{const s=y<400?"for paying":"for this parcel",tw0=Math.round(tw(ctx,s,28,700)+40);withA(ctx,fin(t,t0,0.4),()=>{
      wc_panel(ctx,X+790-tw0,y-26,tw0,52,{kind:"tag",wash:M3_GOLD,washA:0.3,seed:y});wc_T(ctx,s,X+790-tw0+20,y+10,{w:700,size:28,col:WC_DARK});});});});
  // the same question, everywhere
  const items=["which value","for what","who says so"],ws=items.map(s=>Math.round(tw(ctx,s,30,700)+44)),tot=ws.reduce((a,b)=>a+b,0)+2*24;let x=960-tot/2;
  items.forEach((s,i)=>{const xx=x;arrive(ctx,xx+ws[i]/2,776,t,tQ[i]-0.1,()=>{wc_panel(ctx,xx,748,ws[i],56,{kind:"tag",seed:i+13});wc_T(ctx,s,xx+22,787,{w:700,size:30,col:WC_DARK});},{dy:8});x+=ws[i]+24;});
  m3_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 10. Thirty-three seconds ---------- */
scene("home",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tH=c("home"),tCame=w("home","the Beagle came home"),tO=c("out"),tFive=w("out","five years"),tSec=w("out","thirty-three seconds"),tSe=c("settled"),tBef=w("settled","settled before"),
    tPort=w("settled","checked at every port"),tSa=c("same"),tWr=w("same","written down"),tNight=w("same","tested every night"),tK=c("declared");
  m3_open(ctx,S,t,sc,null,[[0,1100,500,1.06],[tO-0.3,900,470,1.03],[tSa-0.4,960,540,1],[tK-0.3,960,530,1.02]]);
  const pl=fin(t,tSa-0.6,0.9),dk=1-0.65*fin(t,tK-0.4,0.6);
  if(pl<0.99){m3_place(ctx,"falmouth");m3_ship(ctx,lerp(1600,1240,1-Math.pow(1-clamp(t/18,0,1),2)),M3_FHZ+112,0.84,t,{set:true});
    // after five years around the world, the clocks out by thirty-three seconds; then, in turn, the rate book, shut, and every port ticked
    withA(ctx,(1-pl)*(1-fin(t,tSe-0.3,0.4)),()=>arrive(ctx,690,232,t,tFive-0.3,()=>{wc_panel(ctx,300,130,780,210,{kind:"card",seed:121});wc_T(ctx,"five years, around the world",340,190,{w:600,size:30,col:WC_INK});
      withA(ctx,fin(t,tSec-0.2,0.5),()=>wc_T(ctx,"out by 33 seconds",340,268,{w:800,size:52,col:WC_DARK}));m3_dial(ctx,968,236,62,15*3600+33,{});},{dy:16}));
    withA(ctx,1-pl,()=>{for(let i=0;i<7;i++){const px=700+i*78,p=clamp((t-tPort-i*0.18)/0.4,0,1);ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.8*fin(t,tPort-0.4,0.4));ctx.beginPath();ctx.arc(px,290,7,0,TAU);ctx.fill();ctx.restore();
        if(i<6)wc_link(ctx,px+10,290,px+68,290,WC_PENCIL,{p:fin(t,tPort-0.4+i*0.05,0.4),a:0.6,lw:2.4});wc_tick(ctx,px,262,30,M3_GOLDINK,p,4);}
      arrive(ctx,934,348,t,tPort+0.6,()=>wc_tag(ctx,934,348,"checked at every port",{align:"center"}),{dy:8});});}
  if(pl>0.01){m3_place(ctx,"plain",pl);withA(ctx,pl*dk,()=>{
    // Linh's rules beside the rate book: both written down before anything disagrees, and checked
    arrive(ctx,470,660,t,tSa+0.3,()=>wc_tag(ctx,470,660,"the Beagle's clocks",{align:"center"}),{dy:8});
    arrive(ctx,1250,400,t,tWr-0.2,()=>{wc_panel(ctx,860,200,780,330,{kind:"card",seed:123});wc_T(ctx,"_core_person__models.yml",890,252,{w:600,size:28,f:"mono",col:WC_DARK});
      ["legal_name","preferred_name","birth_date","mobile"].forEach((s,i)=>wc_T(ctx,"  - name: "+s+" …",890,318+i*46,{w:500,size:28,f:"mono",col:WC_DARK}));},{dy:16});
    arrive(ctx,1250,580,t,tWr+0.3,()=>wc_tag(ctx,1250,580,"Linh's rules",{align:"center"}),{dy:8});
    wc_tick(ctx,1088,664,44,WC_ROLEINK.alumna,clamp((t-tNight)/0.5,0,1),5.5);
    arrive(ctx,1278,664,t,tNight+0.2,()=>wc_tag(ctx,1278,664,"tested every night",{align:"center"}),{dy:8});});}
  // the rate book, carried across the cut from the sky over Falmouth to its place beside Linh's rules
  {const k=ease(pl);withA(ctx,dk,()=>arrive(ctx,430,290,t,tBef-0.3,()=>m3_rateBook(ctx,t,lerp(430,470,k),lerp(290,440,k),{head:-9,rows:-9,shut:1}),{dy:20}));}
  m3_close(ctx,S);
  wc_year(ctx,64,80,"October 1836 · Falmouth",fin(t,0.4,0.6)*(1-fin(t,tSa-0.6,0.4)));wc_paperOver(ctx,S);
  // the line, then carried down onto the end card, above the veil, landing where the card's own line fades in and takes it over
  const KL="The rule is declared, not hidden in the SQL.",kl=fin(t,tK-0.1,0.6),ky=lerp(830,420,fin(t,B+0.3,1.1)),kg=kl*(1-fin(t,B+0.8,0.9));
  if(kg>0.01){setScreen(ctx,S);withA(ctx,kg,()=>{ctx.save();ctx.translate(960,ky-16);ctx.scale(1,0.2);const g=ctx.createRadialGradient(0,0,10,0,0,640);
    g.addColorStop(0,rgba(WC_PAPER,0.94));g.addColorStop(0.7,rgba(WC_PAPER,0.7));g.addColorStop(1,rgba(WC_PAPER,0));ctx.fillStyle=g;ctx.fillRect(-640,-640,1280,1280);ctx.restore();});}
  wc_end(ctx,S,t,B+0.8,"Which value wins",KL,"Film 3 of 9");
  if(kl>0.01&&t<B+2.4){setScreen(ctx,S);withA(ctx,kl,()=>wc_T(ctx,KL,960,ky,{w:700,size:48,align:"center",col:WC_DARK}));}});
