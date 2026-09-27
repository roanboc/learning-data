/* ===== When things go wrong · Silent change: this episode's components =====
   Drawn with the first film's style (glass, luminous edges, one typeface) and the series' characters (people.js). */
const SCENES=[];const cue=(sc,id)=>sc.cues[id];
function scene(id,draw){const n=NARR[id];SCENES.push({id,name:n.name,lead:n.lead,tail:n.tail,vo:n.vo,draw});}
const fout=(t,a,d)=>1-sstep(a,a+(d||0.6),t);
const brief=(t,a,d)=>fin(t,a,0.4)*fout(t,a+(d||3));
const AMBER=[255,190,90],SK=[150,225,255],GOLDC=LAYER.gold;
function camKeys(ctx,S,keys,t){const cam=camAt(keys,t);setCam(ctx,S,cam);return cam;}
// the background of the platform world, or of a room at dawn (warm light from a window on the left)
function world(ctx,S){setScreen(ctx,S);bg2(ctx);}
function room(ctx,S,t,o){o=o||{};setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,o.top||"#0c1428");g.addColorStop(1,"#05080f");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const wx=o.wx==null?90:o.wx,wy=90,ww=380,wh=520;ctx.save();rr(ctx,wx,wy,ww,wh,10);ctx.clip();
  const sky=ctx.createLinearGradient(0,wy,0,wy+wh);sky.addColorStop(0,"#16264c");sky.addColorStop(0.55,"#5b4a78");sky.addColorStop(0.85,"#e0876a");sky.addColorStop(1,"#f6c37e");ctx.fillStyle=sky;ctx.fillRect(wx,wy,ww,wh);
  glow(ctx,wx+ww*0.6,wy+wh*0.95,180+10*Math.sin(t*0.4),[255,190,120],0.5);
  ctx.fillStyle="#0d1020";[[0,110,70],[60,70,120],[170,140,50],[210,90,80],[300,120,80]].forEach(([x,h2,w2])=>ctx.fillRect(wx+x,wy+wh-h2,w2,h2));
  ctx.fillStyle="rgba(255,214,150,0.8)";for(let i=0;i<14;i++){if(hash(i,3)>0.5)ctx.fillRect(wx+hash(i,1)*ww,wy+wh-hash(i,2)*100,4,5);}
  ctx.restore();ctx.strokeStyle="rgba(20,26,44,0.95)";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh);ctx.moveTo(wx,wy+wh*0.45);ctx.lineTo(wx+ww,wy+wh*0.45);ctx.stroke();
  glass(ctx,wx,wy,ww,wh,10,[255,200,150],{glow:24,ga:0.2,fill:"rgba(0,0,0,0)",ea:0.4});
  const spill=ctx.createRadialGradient(wx+ww*0.6,wy+wh,40,wx+ww*0.6,wy+wh,900);spill.addColorStop(0,"rgba(255,170,110,0.16)");spill.addColorStop(1,"rgba(255,170,110,0)");ctx.fillStyle=spill;ctx.fillRect(0,0,W,H);}
// a small clock chip, top left
function clockChip(ctx,S,s,sub,a){setScreen(ctx,S);withA(ctx,a==null?1:a,()=>{glass(ctx,64,52,sub?300:150,64,18,[170,205,255],{glow:10,ea:0.5,fill:"rgba(8,14,28,0.85)"});
  T(ctx,s,92,96,{w:800,size:32,f:"mono"});if(sub)T(ctx,sub,92+tw(ctx,s,32,800,"mono")+18,94,{w:600,size:20,color:rgba(SOFT,0.95)});});}
// a message bubble: who, what, and a colour for the sender's side; typing dots before it appears
function msg(ctx,x,y,w,who,text,c,a,typing){if(a<=0.01&&!typing)return;const lines=[];ctx.save();ctx.font=font(600,26);let cur="";text.split(" ").forEach(s=>{const tr=cur?cur+" "+s:s;if(ctx.measureText(tr).width>w-48&&cur){lines.push(cur);cur=s;}else cur=tr;});if(cur)lines.push(cur);ctx.restore();
  const h=52+lines.length*36;withA(ctx,Math.max(a,typing?1:0),()=>{glass(ctx,x,y,w,typing&&a<0.5?84:h,20,c,{glow:12,ea:0.65,fill:"rgba(9,15,30,0.92)"});T(ctx,who,x+24,y+32,{w:800,size:18,color:rgba(c,0.95)});
    if(a<0.5&&typing){for(let i=0;i<3;i++){ctx.fillStyle=rgba(INK,0.4+0.5*Math.max(0,Math.sin(typing*6-i*0.8)));ctx.beginPath();ctx.arc(x+34+i*20,y+60,5,0,TAU);ctx.fill();}}
    else withA(ctx,a,()=>lines.forEach((l,i)=>T(ctx,l,x+24,y+72+i*36,{w:600,size:26})));});return h;}
// the Head of School's dashboard: the class-fill data product, a gold painting, with the "last good data" banner
function dashboard(ctx,x,y,w,h,o){o=o||{};glass(ctx,x,y,w,h,24,[170,205,255],{glow:18,ea:0.5,fill:"rgba(8,14,28,0.9)"});
  T(ctx,"Enrolments · census date tomorrow",x+32,y+52,{w:800,size:26});T(ctx,o.day||"Tuesday",x+w-32,y+52,{w:600,size:20,align:"right",color:rgba(SOFT,0.95)});
  const px=x+32,py=y+86,pw=w*0.42,ph=pw*0.7;ledFrame(ctx,px,py,pw,ph,GOLDC,painting2("modern"),{glow:18});
  T(ctx,"Class fill",px+pw+36,py+34,{w:700,size:22,color:rgba(SOFT,0.95)});T(ctx,"Data Science 101",px+pw+36,py+70,{w:800,size:30});
  T(ctx,o.num||"94%",px+pw+36,py+188,{w:800,size:108,color:o.numCol||rgba(INK,0.98)});T(ctx,"of 120 seats",px+pw+40,py+228,{w:500,size:22,color:rgba(SOFT,0.95)});
  if(o.ghost>0)withA(ctx,o.ghost,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(BAD,0.9);ctx.lineWidth=3;rr(ctx,px+pw+24,py+86,w-pw-88,170,16);ctx.stroke();ctx.restore();
    T(ctx,"108%",px+pw+44,py+196,{w:800,size:108,color:rgba(BAD,0.95)});T(ctx,"if the waitlist had counted",px+pw+44,py+236,{w:600,size:20,color:rgba(BAD,0.95)});});
  const by=y+h-96;if(o.banner>0)withA(ctx,o.banner,()=>{glass(ctx,x+24,by,w-48,70,18,AMBER,{glow:14+8*(o.pulse||0),fill:"rgba(80,54,12,0.6)"});led(ctx,x+50,by+28,14,14,AMBER);
    T(ctx,"Last good data: yesterday, 23:02",x+80,by+45,{w:700,size:26,color:"rgba(255,228,176,1)"});});
  if(o.ok>0)withA(ctx,o.ok,()=>{glass(ctx,x+24,by,w-48,70,18,GOOD,{glow:12,fill:"rgba(12,50,32,0.5)"});led(ctx,x+50,by+28,14,14,GOOD);T(ctx,o.okText||"Up to date: today, 08:40",x+80,by+45,{w:700,size:26,color:"rgba(200,255,220,1)"});});}
// a person in a video-call tile: head and shoulders, name and role
function callTile(ctx,id,x,y,w,h,o){o=o||{};const P=PEOPLE[id];glass(ctx,x,y,w,h,20,P.edge,{glow:o.hi?22:12,ea:o.hi?0.9:0.55,fill:"rgba(14,22,42,0.92)"});
  ctx.save();rr(ctx,x+3,y+3,w-6,h-6,18);ctx.clip();const s=o.s||h/190,k=s*P.build.h;person(ctx,id,x+w/2,y+h*0.52+505*k,s,{pose:"stand",expr:o.expr||"calm",t:o.t||0,glow:0.3});ctx.restore();
  withA(ctx,o.label==null?1:o.label,()=>{glass(ctx,x+12,y+h-50,tw(ctx,P.name.replace("Prof. ",""),18,700)+30,38,12,P.edge,{glow:6,ea:0.5,fill:"rgba(6,10,20,0.85)"});T(ctx,P.name.replace("Prof. ",""),x+27,y+h-25,{w:700,size:18});});}
// the quarantine tray: rows that failed a test, kept aside to be looked at
function tray(ctx,x,y,w,n,t,a){withA(ctx,a,()=>{glass(ctx,x,y,w,86,16,BAD,{glow:12,ea:0.6,fill:"rgba(40,10,14,0.55)"});T(ctx,"kept aside · "+n+" rows",x+18,y+28,{w:700,size:19,color:"rgba(255,180,170,1)"});
  for(let i=0;i<Math.min(n,15);i++){const bx=x+18+i*((w-36)/15),by=y+42+Math.sin(t*1.3+i)*2;ctx.fillStyle=rgba(AMBER,0.75);rr(ctx,bx,by,(w-36)/15-6,26,5);ctx.fill();}});}
// the lineage, as a row of steps: each step can light up as the red thread reaches it
const LIN=[["exposure","dashboard"],["fct_class_fill","data product"],["int_class_enrolments","joins enrolments to classes"],["stg_enrolments","staging · tested"],["bronze.enrolments","as it arrived"]];
function lineage(ctx,x0,y,dx,o){o=o||{};const pts=LIN.map((_,i)=>[x0-i*dx,y]);
  ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.stroke();
  // the red thread, moving back along the lineage one step at a time
  if(o.k>0){const k=Math.min(o.k,pts.length-1),i=Math.floor(k),f=k-i,end=i<pts.length-1?[lerp(pts[i][0],pts[i+1][0],f),y]:pts[i];
    beam(ctx,[{x:pts[0][0],y},{x:end[0],y}],BAD,[[22,0.08],[9,0.22],[3,0.85],[1.5,1]]);glow(ctx,end[0],y,36,BAD,0.7);}
  pts.forEach((p,i)=>{const [n,sub]=LIN[i],bad=i===3&&o.bad,on=o.k>=i-0.05,c=bad?BAD:i===4?LAYER.bronze:i===0?GOLDC:[170,205,255];const w=Math.max(tw(ctx,n,22,700,"mono"),tw(ctx,sub,17,500))+44;
    glass(ctx,p[0]-w/2,y-48,w,96,18,c,{glow:on?22:8,ea:on?0.95:0.45,fill:"rgba(8,14,28,0.92)"});T(ctx,n,p[0],y-6,{w:700,size:22,f:"mono",align:"center"});T(ctx,sub,p[0],y+26,{w:500,size:17,align:"center",color:rgba(SOFT,0.95)});
    if(i===3)gate(ctx,p[0],y-110,70,bad?BAD:GOOD,"tests");});return pts;}
// the conceptual sketch: student, enrolment and class, with the enrolment's statuses
function sketch(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const box=(bx,by,name,sub)=>{glass(ctx,bx-110,by-44,220,88,16,SK,{glow:14,ea:0.8,fill:"rgba(10,20,40,0.9)"});T(ctx,name,bx,by+(sub?-2:9),{w:800,size:26,align:"center"});if(sub)T(ctx,sub,bx,by+26,{w:500,size:16,align:"center",color:rgba(SOFT,0.95)});};
  ctx.strokeStyle=rgba(SK,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-230,0);ctx.lineTo(-110,0);ctx.moveTo(110,0);ctx.lineTo(230,0);ctx.stroke();
  box(-340,0,"Student");box(0,0,"Enrolment","status · date");box(340,0,"Class","Data Science 101");
  const st=[["enrolled","holds a seat",GOOD,1],["withdrawn","left before census",SOFT,1],["waitlisted","waiting for a seat · not enrolled",AMBER,o.newA||0]];
  st.forEach(([n,m,c,a],i)=>withA(ctx,a,()=>{const yy=96+i*62;ctx.strokeStyle=rgba(SK,0.45);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,44);ctx.lineTo(0,yy-2);ctx.stroke();
    glass(ctx,-150,yy-24,300,50,14,c,{glow:i===2?14+10*(o.glowNew||0):8,ea:0.8,fill:"rgba(8,14,28,0.92)"});T(ctx,n,-128,yy+9,{w:700,size:20,f:"mono"});T(ctx,m,168,yy+8,{w:500,size:17,color:rgba(c,0.95)});}));
  ctx.restore();}
// the data contract for enrolments: what arrives, what's allowed and what it means, how fresh, and an owner in each corner
function contract(ctx,x,y,w,h,o){o=o||{};const ver=o.ver||"1.0";glass(ctx,x,y,w,h,24,[236,243,255],{glow:24+10*(o.glow||0),ea:0.9,fill:"rgba(10,16,32,0.95)"});
  T(ctx,"Data contract · enrolments",x+36,y+60,{w:800,size:34});stampV(ctx,x+w-40,y+50,"v"+ver,o.verFlash||0);
  const rows=[["Fields","student, class, status, date"],["Statuses","enrolled · withdrawn · waitlisted"+(o.deferred?" · deferred":"")],["Meaning","enrolled = holds a seat on census date"],["Freshness","by 06:00 every day"]];
  rows.forEach(([k,v],i)=>withA(ctx,o.rows==null?1:clamp(o.rows*rows.length-i,0,1),()=>{const yy=y+118+i*66;T(ctx,k,x+36,yy+24,{w:700,size:21,color:rgba(SOFT,0.95)});T(ctx,v,x+196,yy+24,{w:600,size:25,f:k==="Statuses"?"mono":undefined});}));
  const C=[["mei",x+26,y+h-108,"produces"],["ben",x+w/2+8,y+h-108,"produces"],["ana",x+26,y+h-58,"uses"],["sam",x+w/2+8,y+h-58,"uses"]];
  ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+26,y+h-136);ctx.lineTo(x+w-26,y+h-136);ctx.stroke();
  C.forEach(([id,cx,cy,does],i)=>{const P=PEOPLE[id],a=o.sign?clamp(o.sign*4-i,0,1):0,n=o.notice?o.notice:0;withA(ctx,0.35+0.65*Math.max(a,n),()=>{led(ctx,cx+8,cy+12,12,12,P.edge);
    T(ctx,P.name.split(" ")[0]+" · "+P.side.toLowerCase()+" · "+does,cx+30,cy+24,{w:700,size:21,color:rgba(P.edge,0.95)});});});}
function stampV(ctx,x,y,s,flash){const w=tw(ctx,s,22,800,"mono")+26;glass(ctx,x-w,y-22,w,40,12,GOOD,{glow:8+20*flash,ea:0.8,fill:"rgba(10,30,20,0.8)"});T(ctx,s,x-w/2,y+6,{w:800,size:22,f:"mono",align:"center",color:"rgba(200,255,220,1)"});}
// the platform in one row: the student system, the contract at the door, bronze, the dbt test gate, silver, gold and the data product
function platformRow(ctx,t,o){o=o||{};const y=o.y||470;
  sysCard(ctx,70,y-60,290,120,"Student system","enrolment events",APP.sis.c);
  const lanes=[[360,y],[520,y]],d=o.door||0;
  lane(ctx,[{x:360,y},{x:560,y}],APP.sis.c,0.8);
  if(d>0)withA(ctx,d,()=>{glass(ctx,440,y-92,84,184,16,[236,243,255],{glow:14+8*Math.sin(t*1.5),ea:0.8,fill:"rgba(12,18,34,0.9)"});T(ctx,"contract",482,y+118,{w:700,size:16,align:"center",color:rgba(INK,0.9)});
    for(let i=0;i<4;i++){ctx.fillStyle=rgba(i%2?TECH:BIZ,0.9);ctx.fillRect(452,y-72+i*38,60,6);}});
  const cells=(err)=>(r,c)=>{const k=hash(r*13+c,7);return k<0.08&&err?AMBER:k<0.8?APP.sis.c:null;};
  vault(ctx,560,y-150,240,300,LAYER.bronze,cells(o.err),"Bronze","as it arrived");
  const g=o.gate||GOOD;lane(ctx,[{x:800,y},{x:900,y}],APP.sis.c,0.6);gate(ctx,900,y,150,g,"tests");chip(ctx,900,y-130,"dbt","tests","",{align:"center",edge:g});
  const dim=o.skip?0.35:1;withA(ctx,dim,()=>{lane(ctx,[{x:930,y},{x:1000,y}],[214,228,255],0.6);vault(ctx,1000,y-150,240,300,LAYER.silver,(r,c)=>hash(r*7+c,3)<0.7?[214,228,255]:null,"Silver","consistent");
    lane(ctx,[{x:1240,y},{x:1300,y}],GOLDC,0.6);vault(ctx,1300,y-150,240,300,LAYER.gold,(r,c)=>hash(r*5+c,2)<0.6?GOLDC:null,"Gold","class fill");lane(ctx,[{x:1540,y},{x:1600,y}],GOLDC,0.6);});
  ledFrame(ctx,1600,y-110,250,175,GOLDC,painting2("modern"),{glow:18});T(ctx,o.num||"94%",1725,y+118,{w:800,size:44,align:"center"});
  if(o.skip)withA(ctx,o.skip,()=>{tag(ctx,1120,y+200,"skipped",SOFT,{align:"center",size:17});tag(ctx,1420,y+200,"skipped",SOFT,{align:"center",size:17});});
  if(o.banner>0)withA(ctx,o.banner,()=>tag(ctx,1725,y-150,"last good data · yesterday 23:02",AMBER,{align:"center",size:16}));}
