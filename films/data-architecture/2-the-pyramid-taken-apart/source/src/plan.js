/* ===== The pyramid, taken apart: this film's pictures =====
   Chile in 1972, in lamp-light: the telex that brought each factory's numbers to Santiago every afternoon, one number that says
   nothing alone, the wall of figures nobody could read, the software's normal band and the warning that went first to the factory's
   own manager. Then the utility's wall: the famous pyramid of data, information, knowledge and wisdom; a number with and without its
   context, the measure line by line and Grace's decision; the pyramid as a one-way factory, the definition written before anything is
   recorded, and the outage system's records of each cut; a meter's half-hourly readings and what someone chose for them; the levels
   that aren't separate and the top that's vague; and the pyramid redrawn with arrows both ways, on the data practice on the map.
   Everything is drawn to read on a phone: text at least 28 px in the frame, unless it's marked as texture. */

/* ---------- 1. Only what changed ---------- */
// the story's room: Chile at night, in lamp-light, a dark blue-grey with a warm haze near the ground, and dust in the air
function d2_night(ctx,S,t){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#10151f");g.addColorStop(0.62,"#181d29");g.addColorStop(1,"#26201b");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  glow(ctx,960,1180,900,CY_LAMP,0.06);motes(ctx,t,{col:CY_LAMP,a:0.6,n:40});}
// a card in the story: a name and a line under it, on dark glass in lamp-light
function d2_card(ctx,x,y,w,title,sub,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=sub?124:76;if(!w)w=Math.max(tw(ctx,title,o.size||36,800),sub?tw(ctx,sub,28,600):0)+60;glass(ctx,x,y,w,h,18,o.col||CY_LAMP,{glow:14,ea:0.75,fill:"rgba(20,16,12,0.92)"});
  T(ctx,title,x+28,y+50,{w:800,size:o.size||36,color:rgba(o.col||CY_LAMP,1)});if(sub)T(ctx,sub,x+28,y+96,{w:600,size:28,color:rgba(INK,0.92)});});}
// one line torn from the telex's paper, held up: what a factory sent that afternoon, typed in capitals
function d2_strip(ctx,x,y,w,s,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=o.h||96;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.012:o.rot);
  ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=18;ctx.shadowOffsetY=6;ctx.fillStyle=CY_PAPER;ctx.fillRect(-w/2,-h/2,w,h);ctx.shadowColor="transparent";
  // the paper's torn edges, top and bottom
  ctx.fillStyle="rgba(0,0,0,0.12)";for(let i=0;i<w;i+=14){ctx.fillRect(-w/2+i,-h/2,7,2+hash(i,7)*3);ctx.fillRect(-w/2+i+5,h/2-3,7,2+hash(i,9)*3);}
  T(ctx,s,-w/2+30,o.size?o.size*0.36:12,{f:"mono",w:500,size:o.size||34,color:rgba(CY_INK,0.95)});
  if(o.sig>0.01){ctx.strokeStyle=rgba(CY_SIG,o.sig);ctx.lineWidth=4;ctx.strokeRect(-w/2+3,-h/2+3,w-6,h-6);}
  ctx.restore();});}
// a factory of the time, small, with what's usual for it under it, and whether today's figure is a good day there (tick) or a bad one
function d2_usual(ctx,x,y,usual,good,a,m){if(a<=0.01)return;withA(ctx,a,()=>{daFactory(ctx,x,y,0.62,{lit:0.9});
  T(ctx,usual,x,y+52,{w:700,size:30,align:"center",color:rgba(INK,0.95)});
  if(m>0.01)withA(ctx,m,()=>{const s=good?"a good day here":"a bad day here",c=good?TRUST:BAD;tag(ctx,x,y+108,s,c,{align:"center",size:30});});});}
// the wall of figures in Santiago: every factory's strip for one afternoon, too many to read; their numbers are texture. One of them,
// in trouble, is no different to look at; o.find (0..1) picks it out
const D2_WALL=[...Array(36)].map((_,i)=>[150+(i%9)*190+(Math.floor(i/9)%2)*40,170+Math.floor(i/9)*150]);
const D2_LOST=22;
function d2_wall(ctx,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{D2_WALL.forEach(([x,y],i)=>{const q=o.p==null?1:clamp((o.p*(D2_WALL.length+4)-i)/4,0,1);if(q<=0.01)return;
  withA(ctx,q*(1-(o.dim||0)*(i===D2_LOST?0:0.75)),()=>{ctx.save();ctx.translate(x+80,y+40);ctx.rotate((hash(i,3)-0.5)*0.06);ctx.fillStyle=CY_PAPER;ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=10;ctx.fillRect(-80,-40,160,80);ctx.shadowColor="transparent";
    ctx.fillStyle=rgba(CY_INK,0.55);ctx.fillRect(-64,-26,50+hash(i*7,5)*60,6);T(ctx,(n=>n>=1000?Math.floor(n/1000)+","+String(n%1000).padStart(3,"0"):String(n))(Math.floor(200+hash(i,8)*9700)),-64,22,{f:"mono",w:500,size:26,color:rgba(CY_INK,0.85),deco:1});
    if(i===D2_LOST&&o.find>0.01){ctx.strokeStyle=rgba(CY_SIG,o.find);ctx.lineWidth=4;ctx.strokeRect(-77,-37,154,74);}
    ctx.restore();});});
  if(o.find>0.01){const[x,y]=D2_WALL[D2_LOST];glow(ctx,x+80,y+40,150,CY_SIG,0.3*o.find);}});}
// a day's numbers for one factory, out of its normal: the warning the software sent, with its factory's normal at its right, small (the
// band where the number usually sits, a few days in it, and today's out of it, under it when o.low, over it otherwise); o.nhi lights the normal
function d2_warn(ctx,x,y,w,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=150;glass(ctx,x,y,w,h,16,CY_SIG,{glow:12+10*(o.hi||0),ea:0.75,fill:"rgba(22,16,10,0.94)"});
  T(ctx,"warning",x+26,y+44,{w:800,size:28,color:rgba(CY_SIG,1)});T(ctx,name,x+26,y+96,{w:700,size:30,color:rgba(INK,0.95)});
  const bw=150,bx=x+w-bw-26,nh=o.nhi||0;T(ctx,"normal",bx+bw/2,y+44,{w:700,size:28,align:"center",color:rgba(mix(CY_ANDES,INK,0.35*nh),1)});
  ctx.fillStyle=rgba(CY_ANDES,0.18+0.14*nh);ctx.fillRect(bx,y+80,bw,34);ctx.strokeStyle=rgba(CY_ANDES,0.5+0.4*nh);ctx.setLineDash([5,5]);ctx.lineWidth=1.5;ctx.strokeRect(bx,y+80,bw,34);ctx.setLineDash([]);
  const pts=[0.5,0.42,0.56,0.47,o.low?0.95:0.05],py=v=>y+64+v*70;ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2;ctx.beginPath();pts.forEach((v,i)=>{const px=bx+14+i*30;i?ctx.lineTo(px,py(v)):ctx.moveTo(px,py(v));});ctx.stroke();
  const px=bx+14+4*30,qy=py(pts[4]);glow(ctx,px,qy,18,CY_SIG,0.5);ctx.fillStyle=rgba(CY_SIG,1);ctx.beginPath();ctx.arc(px,qy,6,0,TAU);ctx.fill();});}
// one of a factory's few numbers, day by day, as the software watched it: da.js's daIndicator, with its normal coming in on its own, so
// the days come first and the normal worked out from them after. vals: each day, 0..1 of the chart's height; o.p (0..1) the days shown,
// each fading in; o.band (0..1) the normal; o.lit (0..1) lights a day out of it
function d2_ind(ctx,x,y,w,h,vals,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const[b0,b1]=o.range||[0.36,0.66],n=vals.length,p=o.p==null?1:o.p,bA=o.band==null?1:o.band,lit=o.lit==null?1:o.lit;
  glass(ctx,x,y,w,h,16,CY_ANDES,{glow:10,ea:0.7,fill:"rgba(10,12,18,0.92)"});const ix=x+28,iw=w-56,iy=y+70,ih=h-96;
  if(o.title)T(ctx,o.title,x+28,y+48,{w:700,size:30,color:rgba(INK,0.95)});
  if(bA>0.01)withA(ctx,bA,()=>{ctx.fillStyle=rgba(CY_ANDES,0.16);ctx.fillRect(ix,iy+ih*(1-b1),iw,ih*(b1-b0));ctx.strokeStyle=rgba(CY_ANDES,0.45);ctx.setLineDash([6,6]);ctx.lineWidth=1.6;
    [b0,b1].forEach(b=>{ctx.beginPath();ctx.moveTo(ix,iy+ih*(1-b));ctx.lineTo(ix+iw,iy+ih*(1-b));ctx.stroke();});ctx.setLineDash([]);
    T(ctx,"normal",ix+iw-8,iy+ih*(1-b1)-14,{w:700,size:28,align:"right",color:rgba(CY_ANDES,1)});});
  const P=vals.map((v,i)=>[ix+iw*(i+0.5)/n,iy+ih*(1-v)]),q=i=>clamp(p*n-i,0,1);
  ctx.strokeStyle=rgba(SOFT,0.4);ctx.lineWidth=2;for(let i=1;i<n;i++){const k=q(i);if(k<=0)break;ctx.beginPath();ctx.moveTo(P[i-1][0],P[i-1][1]);ctx.lineTo(lerp(P[i-1][0],P[i][0],k),lerp(P[i-1][1],P[i][1],k));ctx.stroke();}
  P.forEach(([px,py],i)=>{const k=q(i);if(k<=0.01)return;const out=vals[i]<b0||vals[i]>b1;withA(ctx,k,()=>{
    if(out&&lit>0.01){glow(ctx,px,py,22,CY_SIG,0.5*lit);ctx.fillStyle=rgba(mix(INK,CY_SIG,lit),1);ctx.beginPath();ctx.arc(px,py,5+2*lit,0,TAU);ctx.fill();}
    else{ctx.fillStyle=rgba(INK,0.85);ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();}});});});}
// a sheet of paper pinned to the wall, as The map before the data pins its drafts: fn draws on it
function d2_pin(ctx,x,y,w,h,a,rot,fn){if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:rot||0,fill:"#efe8da",plain:1});fn&&fn();ctx.fillStyle="#c44";ctx.beginPath();ctx.arc(x+w/2,y+14,7,0,TAU);ctx.fill();});}
// a clock face, for the time a manager is given to put a problem right; p (0..1) sweeps its hand round once
function d2_clock(ctx,x,y,r,p,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle="rgba(20,16,12,0.92)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,CY_LAMP,0.9,3);
  for(let i=0;i<12;i++){const q=i/12*TAU;ctx.strokeStyle=rgba(CY_LAMP,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+Math.sin(q)*r*0.78,y-Math.cos(q)*r*0.78);ctx.lineTo(x+Math.sin(q)*r*0.9,y-Math.cos(q)*r*0.9);ctx.stroke();}
  if(p>0.001){ctx.fillStyle=rgba(CY_LAMP,0.22);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r*0.74,-Math.PI/2,-Math.PI/2+TAU*clamp(p,0,1));ctx.closePath();ctx.fill();}
  const q=TAU*clamp(p,0,1);ctx.strokeStyle=rgba(CY_LAMP,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(q)*r*0.7,y-Math.cos(q)*r*0.7);ctx.stroke();ctx.lineCap="butt";});}
// the software's first printout: wide paper with its holes down both sides, the suite's name and a few rows (texture)
function d2_printout(ctx,x,y,w,h,p,a){if(a<=0.01)return;withA(ctx,a,()=>{const hh=h*clamp(p,0,1);if(hh<4)return;ctx.save();ctx.beginPath();ctx.rect(x-10,y,w+20,hh);ctx.clip();
  sheet(ctx,x,y,w,h,{rot:0,fill:"#eef0e4"});for(let i=0;i<h/26;i++){ctx.fillStyle=i%2?"rgba(150,190,160,0.18)":"rgba(0,0,0,0)";ctx.fillRect(x+40,y+i*26,w-80,26);}
  for(let i=0;i<h/30;i++){ctx.fillStyle="#d9dccf";ctx.beginPath();ctx.arc(x+18,y+15+i*30,6,0,TAU);ctx.arc(x+w-18,y+15+i*30,6,0,TAU);ctx.fill();}
  T(ctx,"CYBERSTRIDE",x+60,y+58,{f:"mono",w:500,size:34,color:rgba(CY_INK,0.95)});
  for(let r=0;r<7;r++)for(let c=0;c<4;c++){ctx.fillStyle=rgba(CY_INK,0.5);ctx.fillRect(x+60+c*((w-120)/4),y+100+r*30,40+hash(r*4+c,13)*60,7);}
  ctx.restore();});}

/* ---------- the utility's measure ---------- */
// a measure, as The map before the data drew one: a card with a dial, its name and its value; v (0..1) moves the needle
function d2_dial(ctx,x,y,w,name,val,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=o.h||150;glass(ctx,x,y,w,h,18,o.col||BUSC,{glow:12+12*(o.hi||0),ea:0.8,fill:"rgba(16,14,8,0.94)"});
  const cx=x+80,cy=y+h/2+22,r=46;ctx.strokeStyle=rgba(o.col||BUSC,0.5);ctx.lineWidth=6;ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,TAU);ctx.stroke();
  const q=Math.PI+Math.PI*clamp(o.v==null?0.45:o.v,0,1);ctx.strokeStyle=rgba(INK,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(q)*r*0.9,cy+Math.sin(q)*r*0.9);ctx.stroke();ctx.lineCap="butt";
  wrapT(ctx,name,x+150,y+52,w-180,{size:30,w:700,color:rgba(INK,0.95),lh:38});if(val)T(ctx,val,x+150,y+h-28,{f:"mono",w:500,size:34,color:rgba(mix(o.col||BUSC,INK,0.3),1)});});}

/* ---------- 2. A famous pyramid ---------- */
// the pyramid, in glass: data at the bottom, then information, knowledge and wisdom. cx: its middle; by: its base; w, h: its size.
// o.p (0..1) builds it from the bottom; o.hi[k] lights level k; o.lines (0..1) how firmly its levels are drawn apart (0: one shape);
// o.half (0..1) splits it down the middle and dims its right half; o.fog (0..1) clouds its top; o.word: false hides the names, or
// a function gives each level's name its own alpha
const D2_LEV=["data","information","knowledge","wisdom"],D2_LCOL=[INFC,[150,205,215],[170,180,240],[220,190,250]];
function d2_pyr(ctx,cx,by,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const p=o.p==null?1:o.p,L=o.lines==null?1:o.lines,hi=o.hi||[],sz=o.size||32;
  const yAt=f=>by-h*f,half=f=>w/2*(1-f);
  for(let k=0;k<4;k++){const q=clamp(p*4-k,0,1);if(q<=0)continue;const f0=k/4,f1=(k+1)/4,col=D2_LCOL[k],y0=yAt(f0),y1=yAt(f1),d=(1-spring(q*1.3))*30;
    withA(ctx,clamp(q*2,0,1)*(k===3?1-0.7*(o.fog||0):1),()=>{ctx.save();ctx.translate(0,d);ctx.beginPath();ctx.moveTo(cx-half(f0),y0);ctx.lineTo(cx+half(f0),y0);ctx.lineTo(cx+half(f1),y1);if(k<3)ctx.lineTo(cx-half(f1),y1);ctx.closePath();
      ctx.fillStyle=rgba(col,0.1+0.12*(hi[k]||0));ctx.fill();ctx.strokeStyle=rgba(col,(0.35+0.6*L)*(0.8+0.2*(hi[k]||0)));ctx.lineWidth=2.5;if(L<1)ctx.setLineDash([4+10*L,10*(1-L)+2]);ctx.stroke();ctx.setLineDash([]);
      if(hi[k]>0.01){ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=24*hi[k];ctx.stroke();}ctx.restore();
      const wa=typeof o.word==="function"?o.word(k):o.word===false?0:1;if(wa>0.01){const ty=(y0+y1)/2+sz*0.36+d+(k===3?12:0);withA(ctx,wa,()=>T(ctx,D2_LEV[k],cx,ty,{w:700,size:k===3?Math.min(sz,30):sz,align:"center",color:rgba(mix(col,INK,0.4),1)}));}});}
  if(o.fog>0.01){glow(ctx,cx,yAt(0.86),170,[200,200,215],0.35*o.fog);withA(ctx,o.fog,()=>T(ctx,"?",cx+70,yAt(0.86),{w:800,size:44,align:"center",color:rgba(SOFT,1)}));}
  // the split: a line down the middle, the left half right, the right half dimmed
  if(o.half>0.01){withA(ctx,o.half,()=>{ctx.save();ctx.beginPath();ctx.moveTo(cx,by);ctx.lineTo(cx+w/2,by);ctx.lineTo(cx,by-h);ctx.closePath();ctx.fillStyle="rgba(8,8,12,0.55)";ctx.fill();
    ctx.strokeStyle=rgba(INK,0.8);ctx.lineWidth=3;ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(cx,by+24);ctx.lineTo(cx,by-h-24);ctx.stroke();ctx.restore();});}});}
// a line of verse on a card, and who wrote it, when
function d2_quote(ctx,x,y,w,line,who,a){if(a<=0.01)return;withA(ctx,a,()=>{const ls=wrapT(ctx,line,0,0,w-60,{size:32,w:600,measure:true}),h=60+ls.length*42+50;
  glass(ctx,x,y,w,h,18,[220,190,250],{glow:10,ea:0.7,fill:"rgba(14,12,20,0.94)"});wrapT(ctx,line,x+30,y+52,w-60,{size:32,w:600,color:rgba(INK,0.95),lh:42});
  T(ctx,who,x+30,y+h-26,{w:600,size:28,color:rgba(SOFT,1)});});}
// a dated chip: when, and who
function d2_when(ctx,x,y,when,who,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=Math.max(tw(ctx,when,30,800),tw(ctx,who,28,600))+56;glass(ctx,x,y,w,100,16,o.col||SOFT,{glow:8,ea:0.6,fill:"rgba(10,12,18,0.92)"});
  T(ctx,when,x+28,y+42,{f:"mono",w:500,size:30,color:rgba(INK,0.95)});T(ctx,who,x+28,y+80,{w:600,size:28,color:rgba(SOFT,1)});});}

/* ---------- 3. What it gets right ---------- */
// a point the pyramid gets right, ticked: a chip with a gold tick at its left
function d2_right(ctx,x,y,s,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,s,30,700)+92;glass(ctx,x,y-34,w,68,34,TRUST,{glow:10+12*(o.hi||0),ea:0.7,fill:"rgba(16,14,8,0.92)"});
  kt_gtick(ctx,x+34,y,15,1);T(ctx,s,x+64,y+11,{w:700,size:30,color:rgba(INK,0.95)});});}
// interruptions per customer, per year, line by line: a bar for each line, the worst two lit
const D2_LINES=[["line 14",2.6],["line 9",2.1],["line 21",1.2],["line 3",0.9],["line 27",0.6]];
function d2_bars(ctx,x,y,w,h,p,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,BUSC,{glow:10,ea:0.7,fill:"rgba(16,14,8,0.92)"});
  T(ctx,"interruptions per customer, per year",x+30,y+52,{w:700,size:30,color:rgba(INK,0.95)});
  const top=y+90,bh=(h-120)/D2_LINES.length,maxV=3;D2_LINES.forEach(([n,v],i)=>{const q=clamp(p*D2_LINES.length-i,0,1);if(q<=0)return;const by=top+i*bh,lit=i<2&&o.lit;
    T(ctx,n,x+30,by+bh/2+10,{w:600,size:28,color:rgba(INK,0.9)});const bx=x+170,bw=(w-300)*v/maxV*ease(q);
    ctx.fillStyle=rgba(lit?mix(BUSC,BAD,0.4):BUSC,lit?0.8:0.45);rr(ctx,bx,by+bh*0.22,bw,bh*0.56,6);ctx.fill();
    withA(ctx,q,()=>T(ctx,v.toFixed(1),bx+bw+14,by+bh/2+10,{f:"mono",w:500,size:28,color:rgba(INK,0.9)}));});});}

/* ---------- 4. The question comes first ---------- */
// a definition card, typed as it's said: its kicker, then its words; its size is the whole text's, so nothing moves as it types
function d2_def(ctx,x,y,w,kicker,text,p,a,o){o=o||{};const sz=o.size||30,ls=wrapT(ctx,text,0,0,w-48,{size:sz,w:700,measure:true}),h=84+ls.length*sz*1.25,col=o.col||BUSC;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:14+12*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.95)"});T(ctx,kicker,x+24,y+42,{f:"mono",w:500,size:28,color:rgba(col,1)});
    let n=Math.round(clamp(p,0,1)*text.length);ls.forEach((l,i)=>{if(n<=0)return;T(ctx,l.slice(0,n),x+24,y+88+i*sz*1.25,{w:700,size:sz});n-=l.length+1;});});return h;}
// the outage system's records of each cut, as a table: a connection point, when the power went, when it came back. rows (0..n) shown;
// o.mark[i] (0..1) labels row i with what the definition makes of it
const D2_CUTS=[["CP-0048213","14:02","15:47","interruption"],["CP-0051177","09:10","09:13","momentary"],["CP-0039402","22:40","23:31","interruption"]];
function d2_cuts(ctx,x,y,w,rows,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const rh=62,h=110+D2_CUTS.length*rh;glass(ctx,x,y,w,h,16,INFC,{glow:10+10*(o.hi||0),ea:0.75,fill:"rgba(18,12,10,0.94)"});
  T(ctx,"cut",x+28,y+48,{w:800,size:32,color:rgba(mix(INFC,INK,0.3),1)});T(ctx,"in outage system",x+110,y+48,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});
  const cols=[x+28,x+300,x+430];["connection point","off","on"].forEach((s,i)=>T(ctx,s,cols[i],y+92,{w:600,size:28,color:rgba(SOFT,1)}));
  D2_CUTS.forEach((r,i)=>{const q=clamp(rows-i,0,1);if(q<=0)return;const ry=y+110+i*rh+40;withA(ctx,q,()=>{[r[0],r[1],r[2]].forEach((s,k)=>T(ctx,s,cols[k],ry,{f:"mono",w:500,size:30,color:rgba(INK,0.95)}));
    const m=o.mark?o.mark(i):0;if(m>0.01)withA(ctx,m,()=>tag(ctx,x+w-28-tw(ctx,r[3],28,700)-26,ry-10,r[3],r[3]==="momentary"?SOFT:BUSC,{size:28}));});});});}

/* ---------- 5. No raw data ---------- */
// a meter's readings, every half hour, in kilowatt hours to one decimal place; o.hi: which part of it is lit ("time", "unit", "dp")
const D2_READ=[["00:00","0.4"],["00:30","0.3"],["01:00","0.3"],["01:30","0.5"],["02:00","0.4"],["02:30","0.6"]];
function d2_readings(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=440,rh=56,h=120+D2_READ.length*rh;glass(ctx,x,y,w,h,16,INFC,{glow:10,ea:0.75,fill:"rgba(18,12,10,0.94)"});
  T(ctx,"meter readings",x+28,y+50,{w:800,size:32,color:rgba(mix(INFC,INK,0.3),1)});
  const hl=k=>o.hi&&o.hi[k]?o.hi[k]:0;
  withA(ctx,1,()=>{T(ctx,"time",x+40,y+100,{w:600,size:28,color:rgba(mix(SOFT,CY_SIG,hl("time")),1)});T(ctx,"kWh",x+300,y+100,{w:700,size:28,color:rgba(mix(SOFT,CY_SIG,hl("unit")),1)});});
  D2_READ.forEach(([tm,v],i)=>{const ry=y+150+i*rh;T(ctx,tm,x+40,ry,{f:"mono",w:500,size:30,color:rgba(mix(INK,CY_SIG,hl("time")*0.8),0.95)});
    T(ctx,v,x+300,ry,{f:"mono",w:500,size:30,color:rgba(mix(INK,CY_SIG,hl("dp")*0.8),0.95)});});});}
// a book of essays, its title on the cover
function d2_book(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{const w=330,h=420;ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=24;ctx.shadowOffsetY=10;ctx.fillStyle="#d9d2c2";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.fillStyle="#2c2a33";ctx.fillRect(x,y,18,h);T(ctx,"“Raw Data”",x+w/2+9,y+130,{w:800,size:40,align:"center",color:"rgba(40,36,40,0.95)"});
  T(ctx,"Is an",x+w/2+9,y+184,{w:700,size:34,align:"center",color:"rgba(40,36,40,0.9)"});T(ctx,"Oxymoron",x+w/2+9,y+236,{w:800,size:40,align:"center",color:"rgba(40,36,40,0.95)"});
  ctx.fillStyle="rgba(40,36,40,0.35)";ctx.fillRect(x+70,y+280,w-122,2);T(ctx,"2013",x+w/2+9,y+h-44,{f:"mono",w:500,size:28,align:"center",color:"rgba(40,36,40,0.85)"});});}

/* ---------- 7. Arrows both ways ---------- */
// a business object, as ArchiMate draws one, with its definition inside it under its name: defined once, in the business's words;
// o.def (0..1) shows the definition
function d2_bo(ctx,x,y,w,h,name,def,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;archEl(ctx,x,y,w,h,"",BUSC,"object",o);
  withA(ctx,a,()=>{T(ctx,name,x+w/2,y+54,{w:800,size:34,align:"center",color:rgba(INK,0.97)});withA(ctx,o.def==null?1:o.def,()=>T(ctx,def,x+w/2,y+h-34,{w:600,size:28,align:"center",color:rgba(INK,0.9)}));});}
// the redrawn picture, as a column: a decision, its question, the measure, the definition and the records; each box comes in as it's
// named. k (0..5) how many are in; o.hi[i] lights box i
const D2_CHAIN=[["decision","renew which lines first",BUSC],["question","which lines fail most often?",BUSC],["measure","interruptions per customer, per year",BUSC],
  ["definition","interruption: more than five minutes",BUSC],["records","each cut, on and off, at each connection point",INFC]];
const D2_CX=900,D2_CY0=96,D2_CH=118,D2_CG=40,D2_CW=800;
const d2_boxY=i=>D2_CY0+i*(D2_CH+D2_CG);
function d2_chain(ctx,k,o){o=o||{};const hi=o.hi||[];D2_CHAIN.forEach(([kick,s,col],i)=>{const q=clamp(k-i,0,1);if(q<=0.01)return;const x=D2_CX-D2_CW/2,y=d2_boxY(i);
  withA(ctx,q*(o.a==null?1:o.a),()=>{glass(ctx,x,y,D2_CW,D2_CH,16,col,{glow:10+14*(hi[i]||0),ea:0.75,fill:"rgba(16,14,10,0.94)"});
    T(ctx,kick,x+28,y+44,{w:800,size:28,color:rgba(mix(col,INK,0.25),1)});T(ctx,s,x+28,y+90,{w:700,size:30,color:rgba(INK,0.95)});});});}
// an arrow on one side of the column, from box i to box j: down on the left (j below i), up on the right, bowed outwards, with its
// word beside it
function d2_link(ctx,i,j,p,word,a){if(a<=0.01||p<=0.01)return;const down=j>i,x=down?D2_CX-D2_CW/2-60:D2_CX+D2_CW/2+60,y0=d2_boxY(i)+D2_CH*(down?0.6:0.4),y1=d2_boxY(j)+D2_CH*(down?0.4:0.6);
  const col=down?BUSC:INFC;withA(ctx,a,()=>{arrowTo(ctx,x,y0,x,y1,col,0.95,{p,lw:3.2,bend:0.22});
    if(word)withA(ctx,fin(p,0.6,0.4),()=>T(ctx,word,down?x-56:x+56,(y0+y1)/2+10,{w:700,size:28,align:down?"right":"left",color:rgba(mix(col,INK,0.3),1)}));});}
