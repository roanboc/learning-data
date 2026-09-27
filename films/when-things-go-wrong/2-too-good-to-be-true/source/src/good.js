/* ===== When things go wrong · Too good to be true: this episode's components =====
   Drawn with The Inner Life of Data's style (glass, luminous edges, one typeface), Silent change's components (silent.js: the dashboard's
   palette DB and dbCard, messages, video-call tiles, the clock chip) and the series' characters (people.js).
   The style frames in ../../frames/ draw with these, so what they show is what the film will use. */
const ADM=[190,150,255];                  // the admissions system's colour, like each source system's in The Inner Life of Data
const RED=BAD,AMB=[255,190,90],GRN=GOOD;
const WARN_AT=10,ERR_AT=25,G_MAX=40;      // the contract's limits on the overnight change, in %, and the gauge's full scale
const fmtN=n=>Math.round(n).toLocaleString("en-US");
const bandCol=(v,o)=>{o=o||{};const a=Math.abs(v);return a>ERR_AT&&!o.warnOnly&&!o.noRed?RED:a>WARN_AT?AMB:GRN;};

// the week's applications in bronze: tiles in pairs where the sync copied them twice
const pairCells=(dup,k)=>(r,c)=>{const h=hash(r*29+c,4);if(h>0.82)return null;return dup&&c%2===1&&r<k?[235,215,255]:ADM;};

/* the gauge: a test on a number, with a warning band (amber) and an error band (red). v is the overnight change in %.
   o.warnOnly: the test is only a warning, so there is no red band; o.none: no test at all, an empty dashed dial */
function gauge(ctx,cx,cy,r,v,o){o=o||{};const a0=Math.PI,a1=2*Math.PI,ang=p=>a0+(a1-a0)*clamp(p/G_MAX,0,1),lw=r*0.16;
  if(o.none){ctx.save();ctx.setLineDash([10,10]);ctx.strokeStyle=rgba(SOFT,0.45);ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,r,a0,a1);ctx.stroke();ctx.restore();
    T(ctx,o.noneText||"no test",cx,cy-r*0.25,{w:700,size:r*0.2,align:"center",color:rgba(SOFT,0.8)});return;}
  const bands=o.warnOnly?[[0,WARN_AT,GRN],[WARN_AT,G_MAX,AMB]]:[[0,WARN_AT,GRN],[WARN_AT,ERR_AT,AMB],[ERR_AT,G_MAX,RED]];
  ctx.save();ctx.lineCap="butt";
  // o.reveal (0 to 3): the bands draw in one after another, as the narration names them
  bands.forEach(([p0,p1,c],i)=>{const on=Math.abs(v)>=p0&&(Math.abs(v)<p1||p1===G_MAX),ra=o.reveal==null?1:clamp(o.reveal-i,0,1);if(ra<=0)return;ctx.globalAlpha=ra;ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=on?22:6;ctx.strokeStyle=rgba(c,on?0.95:0.4);ctx.lineWidth=lw;
    ctx.beginPath();ctx.arc(cx,cy,r,ang(p0)+0.012,ang(p0)+(ang(p1)-ang(p0))*ease(ra)-0.012);ctx.stroke();ctx.globalAlpha=1;});
  ctx.shadowBlur=0;
  // ticks at the two limits
  [WARN_AT].concat(o.warnOnly?[]:[ERR_AT]).forEach(p=>{const q=ang(p);ctx.strokeStyle=rgba(INK,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+Math.cos(q)*(r-lw*0.9),cy+Math.sin(q)*(r-lw*0.9));ctx.lineTo(cx+Math.cos(q)*(r+lw*0.9),cy+Math.sin(q)*(r+lw*0.9));ctx.stroke();
    T(ctx,p+"%",cx+Math.cos(q)*(r+lw*2.1),cy+Math.sin(q)*(r+lw*2.1)+6,{w:700,size:Math.max(14,r*0.12),align:"center",color:rgba(SOFT,0.95)});});
  // the needle
  const q=ang(Math.abs(v)),c=bandCol(v,o);ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=14;ctx.strokeStyle=rgba(INK,0.95);ctx.lineWidth=Math.max(3,r*0.035);ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(q)*(r-lw*0.2),cy+Math.sin(q)*(r-lw*0.2));ctx.stroke();ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(cx,cy,r*0.07,0,TAU);ctx.fill();ctx.restore();
  if(o.label!==false){T(ctx,(v>=0?"+":"−")+Math.abs(v).toFixed(Math.abs(v)<10?1:0)+"%",cx,cy+r*0.36,{w:800,size:r*0.3,align:"center",color:rgba(c,1)});
    T(ctx,o.sub||"overnight change",cx,cy+r*0.58,{w:600,size:Math.max(14,r*0.13),align:"center",color:rgba(SOFT,0.95)});}}

/* the gold painting: one big number, a gold data product. o.num, o.delta (in %), o.note (0 to 1: the amber "last good data" note),
   o.gauge: false, or the gauge's options; o.stamp: a small line under the number */
function numberPainting(ctx,x,y,w,h,o){o=o||{};const k=h/440;
  ctx.save();ctx.shadowColor=rgba(LAYER.gold,0.85);ctx.shadowBlur=30;ctx.strokeStyle=rgba(LAYER.gold,1);ctx.lineWidth=3;rr(ctx,x,y,w,h,10);ctx.stroke();ctx.restore();
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"#2a2210");g.addColorStop(0.55,"#1a160c");g.addColorStop(1,"#0f0d08");ctx.fillStyle=g;rr(ctx,x+6,y+6,w-12,h-12,7);ctx.fill();
  // a few warm brush dabs, so it reads as a painting rather than a screen
  ctx.save();rr(ctx,x+6,y+6,w-12,h-12,7);ctx.clip();for(let i=0;i<46;i++){const px=x+hash(i,21)*w,py=y+hash(i,22)*h;ctx.fillStyle=rgba(LAYER.gold,0.03+0.05*hash(i,23));ctx.beginPath();ctx.ellipse(px,py,40+70*hash(i,24),10+14*hash(i,25),hash(i,26)*3,0,TAU);ctx.fill();}ctx.restore();
  const nA=o.note||0,top=y+30*k+nA*70*k;
  if(nA>0)withA(ctx,nA,()=>{glass(ctx,x+24*k,y+22*k,w-48*k,58*k,12*k,AMB,{glow:14,ea:0.85,fill:"rgba(70,48,8,0.85)"});led(ctx,x+44*k,y+44*k,14*k,14*k,AMB);
    T(ctx,o.noteText||"Last good data as of Mon 02:00 · Checking an unusual change",x+72*k,y+59*k,{w:700,size:20*k,color:"rgba(255,226,170,1)"});});
  const gw=o.gauge===false?0:w*0.36,nx=x+40*k;
  T(ctx,o.title||"Applications for next year",nx,top+44*k,{w:700,size:30*k,color:"rgba(255,236,190,0.98)"});
  T(ctx,fmtN(o.num==null?8200:o.num),nx,top+190*k,{w:800,size:132*k,color:o.wrong?"rgba(255,244,214,1)":"rgba(255,244,214,1)"});
  if(o.delta!=null){const s=(o.delta>=0?"▲ ":"▼ ")+Math.abs(o.delta).toFixed(Math.abs(o.delta)<10?1:0)+"% overnight";T(ctx,s,nx+4*k,top+240*k,{w:700,size:26*k,color:rgba(o.deltaCol||(Math.abs(o.delta)>WARN_AT?AMB:GRN),1)});}
  T(ctx,o.stamp||"so far · intake 2027",nx+4*k,top+(o.delta!=null?280:240)*k,{w:500,size:21*k,color:"rgba(230,210,160,0.85)"});
  // a sparkline of the last fourteen nights
  const tr=o.trend||[7240,7310,7390,7460,7520,7610,7700,7760,7840,7910,7990,8060,8130,8200],sx=nx,sy=y+h-34*k,sw=w-gw-90*k,sh=56*k,lo=Math.min(...tr)*0.98,hi=Math.max(...tr)*1.01;
  ctx.beginPath();tr.forEach((q,i)=>{const px=sx+sw*i/(tr.length-1),py=sy-sh*(q-lo)/(hi-lo);i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.strokeStyle=rgba(LAYER.gold,0.8);ctx.lineWidth=2.5*k;ctx.stroke();
  const lp=[sx+sw,sy-sh*(tr[tr.length-1]-lo)/(hi-lo)];ctx.fillStyle=rgba(o.wrong?RED:LAYER.gold,1);ctx.beginPath();ctx.arc(lp[0],lp[1],5*k,0,TAU);ctx.fill();
  if(gw>0){const gx=x+w-gw/2-20*k,gy=top+200*k;gauge(ctx,gx,gy,gw*0.38,o.gaugeV!=null?o.gaugeV:o.delta||0,o.gauge||{});}
  return {x,y,w,h};}

/* the data contract for applications: this film's one line that matters is the overnight change. o.hi lights that line */
function appContract(ctx,x,y,w,o){o=o||{};const h=o.h||330,hi=o.hi||0;glass(ctx,x,y,w,h,22,[236,243,255],{glow:22,ea:0.85,fill:"rgba(10,16,32,0.95)"});
  T(ctx,"Data contract · applications",x+30,y+50,{w:800,size:28});stampV(ctx,x+w-28,y+42,"v2.3",0);
  const key=(s,yy)=>T(ctx,s,x+30,yy,{w:700,size:18,color:rgba(SOFT,0.95)}),vx=x+230;
  key("Fields",y+100);T(ctx,"applicant, course, intake, created",vx,y+100,{w:600,size:20});
  key("Freshness",y+140);T(ctx,"by 06:00 every day",vx,y+140,{w:600,size:20});
  // the line that matters
  withA(ctx,0.5+0.5*hi,()=>{if(hi>0){ctx.save();ctx.shadowColor=rgba(AMB,0.8);ctx.shadowBlur=18*hi;ctx.strokeStyle=rgba(AMB,0.7*hi);ctx.lineWidth=2;rr(ctx,x+16,y+158,w-32,76,12);ctx.stroke();ctx.restore();}
    key("Overnight change",y+188);led(ctx,vx,y+176,14,14,AMB);T(ctx,"warn above "+WARN_AT+"%",vx+24,y+190,{w:700,size:20});
    led(ctx,vx+210,y+176,14,14,RED);T(ctx,"error above "+ERR_AT+"%",vx+234,y+190,{w:700,size:20});
    T(ctx,"closing dates: real spikes up to about 15%",vx,y+220,{w:500,size:16,color:rgba(SOFT,0.95)});});
  ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+20,y+h-58);ctx.lineTo(x+w-20,y+h-58);ctx.stroke();
  key("Owners",y+h-36);[["leila","produces"],["rosa","produces"],["sam","uses"],["david","uses"]].forEach(([id,does],i)=>{const P=PEOPLE[id],px=vx+i*((w-250)/4);
    led(ctx,px,y+h-48,12,12,P.edge);T(ctx,P.name.replace("Prof. ","").split(" ")[0],px+20,y+h-36,{w:700,size:19,color:rgba(P.edge,0.95)});T(ctx,does,px+20,y+h-12,{w:500,size:14,color:rgba(SOFT,0.9)});});}

/* a row check: a small pill with a tick or a cross. state: "pass", "fail" or "idle" */
function checkPill(ctx,x,y,s,state,o){o=o||{};const c=state==="pass"?GRN:state==="fail"?RED:SOFT,size=o.size||19,w=tw(ctx,s,size,700,o.mono?"mono":undefined)+64,h=size+22;
  glass(ctx,x,y,w,h,h/2,c,{glow:state==="idle"?4:16,ea:state==="idle"?0.4:0.9,fill:"rgba(7,12,24,0.9)"});
  ctx.save();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3;ctx.lineCap="round";const ix=x+22,iy=y+h/2;ctx.beginPath();
  if(state==="fail"){ctx.moveTo(ix-6,iy-6);ctx.lineTo(ix+6,iy+6);ctx.moveTo(ix+6,iy-6);ctx.lineTo(ix-6,iy+6);}else{ctx.moveTo(ix-7,iy);ctx.lineTo(ix-2,iy+6);ctx.lineTo(ix+8,iy-6);}ctx.stroke();ctx.restore();
  T(ctx,s,x+42,y+h/2+size*0.36,{w:700,size,f:o.mono?"mono":undefined});return w;}

/* a data tile with an ID tag: an application as a row. dup: the copy, drawn a touch lighter */
function appTile(ctx,x,y,s,id,o){o=o||{};const c=o.col||ADM;ctx.save();ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=12;ctx.fillStyle=rgba(c,o.dup?0.6:0.9);rr(ctx,x,y,s,s,6);ctx.fill();ctx.restore();
  ctx.fillStyle="rgba(255,255,255,0.35)";rr(ctx,x+5,y+5,s*0.4,s*0.22,3);ctx.fill();
  if(id){const tx=x+s+8;glass(ctx,tx,y+s/2-15,tw(ctx,id,15,500,"mono")+18,30,8,o.bad?RED:[170,205,255],{glow:4,ea:0.6,fill:"rgba(6,10,20,0.9)"});T(ctx,id,tx+9,y+s/2+5,{w:500,size:15,f:"mono"});}}

/* the committee's screen, in the style of a Databricks dashboard (the palette DB comes from silent.js) */
function committeeDash(ctx,x,y,w,h,o){o=o||{};const s=o.s||1;glass(ctx,x-10,y-10,w+20,h+20,18,[170,205,255],{glow:16,ea:0.45,fill:"rgba(8,14,28,0.95)"});
  ctx.save();rr(ctx,x,y,w,h,10);ctx.clip();ctx.fillStyle=DB.canvas;ctx.fillRect(x,y,w,h);ctx.fillStyle=DB.card;ctx.fillRect(x,y,w,52*s);ctx.fillStyle=DB.line;ctx.fillRect(x,y+52*s,w,1.2);
  const lw=logo(ctx,"databricks",x+16*s,y+14*s,24*s);T(ctx,"Admissions · planning",x+28*s+lw,y+34*s,{w:700,size:18*s,color:DB.text});T(ctx,o.day||"Tuesday 10:05",x+w-16*s,y+34*s,{w:500,size:14*s,align:"right",color:DB.muted});
  let cy=y+68*s;if(o.note){ctx.fillStyle=DB.warnBg;rr(ctx,x+14*s,cy,w-28*s,44*s,5);ctx.fill();ctx.fillStyle=DB.warnLine;rr(ctx,x+14*s,cy,5*s,44*s,3);ctx.fill();
    T(ctx,"⚠  "+(o.noteText||"Last good data as of Mon 02:00 · Checking an unusual change"),x+30*s,cy+28*s,{w:600,size:15*s,color:DB.warn});cy+=56*s;}
  const cw=w-28*s,ch=y+h-cy-14*s;dbCard(ctx,x+14*s,cy,cw,ch);const p=18*s,num=o.num==null?8200:o.num;
  T(ctx,"Applications for next year",x+14*s+p,cy+p+16*s,{w:700,size:18*s,color:DB.text});T(ctx,"gold.applications_daily",x+14*s+p,cy+p+38*s,{w:500,size:13*s,f:"mono",color:DB.muted});
  T(ctx,fmtN(num),x+14*s+p,cy+p+112*s,{w:700,size:74*s,color:DB.text});
  if(o.delta!=null){const up=o.delta>=0,dc=Math.abs(o.delta)>WARN_AT?DB.green:DB.muted;T(ctx,(up?"▲ ":"▼ ")+Math.abs(o.delta).toFixed(Math.abs(o.delta)<10?1:0)+"% vs yesterday",x+14*s+p+tw(ctx,fmtN(num),74*s,700)+16*s,cy+p+106*s,{w:700,size:17*s,color:dc});}
  // the last fourteen days; a jump at the end when the number is wrong
  const tr=o.trend||[7240,7310,7390,7460,7520,7610,7700,7760,7840,7910,7990,8060,8130,num],sx=x+14*s+p,sy=cy+ch-p-10*s,sw=cw-2*p,sh=Math.max(20,ch-150*s-p),lo=6800,hi=Math.max(...tr)*1.04;
  if(sh>24){ctx.beginPath();tr.forEach((q,i)=>{const px=sx+sw*i/(tr.length-1),py=sy-sh*(q-lo)/(hi-lo);i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.lineTo(sx+sw,sy);ctx.lineTo(sx,sy);ctx.closePath();ctx.fillStyle="rgba(7,122,157,0.10)";ctx.fill();
    ctx.beginPath();tr.forEach((q,i)=>{const px=sx+sw*i/(tr.length-1),py=sy-sh*(q-lo)/(hi-lo);i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.strokeStyle=DB.blue;ctx.lineWidth=2.5*s;ctx.stroke();}
  ctx.restore();
  if(o.crack)withA(ctx,o.crack,()=>{ctx.save();ctx.strokeStyle="rgba(40,48,60,0.85)";ctx.shadowColor="rgba(255,255,255,0.9)";ctx.shadowBlur=3;ctx.lineWidth=2.5;ctx.beginPath();
    const pts=[[0.08,0.1],[0.3,0.34],[0.26,0.46],[0.52,0.62],[0.49,0.74],[0.8,0.96]];pts.forEach(([u,v],i)=>{const px=x+u*w,py=y+v*h;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.moveTo(x+0.3*w,y+0.34*h);ctx.lineTo(x+0.44*w,y+0.28*h);ctx.moveTo(x+0.52*w,y+0.62*h);ctx.lineTo(x+0.64*w,y+0.58*h);ctx.stroke();ctx.restore();});}

/* the planner's board: what the committee decided */
function planBoard(ctx,x,y,w,lines,c){const h=28+lines.length*40;glass(ctx,x,y,w,h,16,c,{glow:12,ea:0.7,fill:"rgba(8,14,28,0.9)"});
  lines.forEach((l,i)=>{const [s,strike]=Array.isArray(l)?l:[l];T(ctx,s,x+22,y+44+i*40,{w:i?600:800,size:i?20:26,color:i?rgba(INK,0.95):rgba(c,1)});
    if(strike){const lw=tw(ctx,s,i?20:26,i?600:800);ctx.strokeStyle=rgba(RED,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+18,y+37+i*40);ctx.lineTo(x+26+lw,y+37+i*40);ctx.stroke();}});return h;}

/* a channel of alerts: amber notes piling up, unread. n: how many; o.owned: a short list with owners instead */
function alertChannel(ctx,x,y,w,h,n,o){o=o||{};glass(ctx,x,y,w,h,18,[170,205,255],{glow:10,ea:0.45,fill:"rgba(8,14,28,0.92)"});
  T(ctx,o.name||"#data-alerts",x+20,y+36,{w:800,size:21,f:"mono"});const badge=n+" unread",bw=tw(ctx,badge,16,800)+24;glass(ctx,x+w-bw-16,y+16,bw,30,15,AMB,{glow:8,ea:0.9,fill:"rgba(70,48,8,0.9)"});T(ctx,badge,x+w-16-bw/2,y+37,{w:800,size:16,align:"center",color:"rgba(255,226,170,1)"});
  ctx.save();rr(ctx,x+2,y+56,w-4,h-58,16);ctx.clip();const texts=["row count 3% below average","late file · finance","null rate up · email","test warned · 2 rows","schema drift · library","duplicate keys · 1 row"];
  for(let i=0;i<Math.min(n,12);i++){const yy=y+64+i*34,hi=o.hi===i;if(yy+34>y+h)break;ctx.fillStyle=hi?"rgba(90,62,10,0.95)":"rgba(40,32,14,"+(0.8-i*0.05)+")";rr(ctx,x+14,yy,w-28,28,6);ctx.fill();ctx.fillStyle=rgba(AMB,hi?1:0.55);rr(ctx,x+14,yy,4,28,2);ctx.fill();
    T(ctx,hi?"⚠ applications +38% (warn)":"⚠ "+texts[i%texts.length],x+28,yy+19,{w:hi?700:500,size:14,color:hi?"rgba(255,230,170,1)":"rgba(230,210,170,"+(0.75-i*0.04)+")"});}
  ctx.restore();}

/* a version pane: the table at one moment, as time travel shows it */
function versionPane(ctx,x,y,w,h,ver,when,num,c,note){glass(ctx,x,y,w,h,18,c,{glow:16,ea:0.8,fill:"rgba(8,14,28,0.92)"});
  T(ctx,"version "+ver,x+22,y+36,{w:700,size:18,f:"mono",color:rgba(c,1)});T(ctx,when,x+w-22,y+36,{w:600,size:18,align:"right",color:rgba(SOFT,0.95)});
  T(ctx,fmtN(num),x+22,y+h*0.62,{w:800,size:Math.min(64,h*0.36)});if(note)T(ctx,note,x+22,y+h-20,{w:600,size:17,color:rgba(SOFT,0.95)});}
