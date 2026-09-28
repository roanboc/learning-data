/* ===== Many ways to read: the film's own pictures =====
   A library's card catalogue (a wooden cabinet, its cards, a bookcase), and the shapes for reading, drawn in the films' glass:
   a normalised core (pale blue), a data vault with its hubs, links and satellites (violet), stars that share dimensions (green)
   and wide tables, one row per learner (amber). The platform's bronze, silver and gold vaults hold them; a thin semantic layer sits on top.
   The labs and the scenarios draw with these too (LV, at the end). Every helper here starts with mw_, to keep clear of the shared files. */
const MW_V=[186,150,255],MW_S=[120,225,170],MW_W=[255,190,90],MW_C=[140,196,255],MW_SC=OFFICE.short.c,MW_WARM=[238,214,176];
// the sources, each in its system's colour (short courses keeps its office's pink)
const MW_SRC={sis:["Student system",APP.sis.c,"SIS"],lms:["Learning platform",APP.lms.c,"LMS"],fin:["Finance system",APP.fin.c,"FIN"],short:["Short-course platform",MW_SC,"SCP"]};

/* ---------- the card catalogue: drawn organic, like the past (wood with grain, paper with fibres, soft light that drifts) ---------- */
const MW_DRAWERS=["A–Al","Am–Ba","Be–Bo","Br–Ca","Ce–Co","Cr–De","Di–Er","Es–Fo","Fr–Go","Gr–Ha","He–Hu","I–Ju","Ka–La","Le–Ma","Me–Mu","N–Pa","Pe–Ri","Ro–Sm","Sn–Th","Ti–Z"];
// a soft rounded shape whose sides bow very slightly, as hand-made things do
function mw_soft(ctx,x,y,w,h,r,seed,amp){const k=amp==null?1.2:amp,j=n=>(hash(n,seed||1)-0.5)*2*k;ctx.beginPath();ctx.moveTo(x+r,y);
  ctx.quadraticCurveTo(x+w/2,y+j(1),x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.quadraticCurveTo(x+w+j(2),y+h/2,x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.quadraticCurveTo(x+w/2,y+h+j(3),x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.quadraticCurveTo(x+j(4),y+h/2,x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}
// wood: a lit side and a shadow side, and flowing grain (bezier strokes of varied weight, with the odd knot)
function mw_wood(ctx,x,y,w,h,r,base,seed,o){o=o||{};const lit=mix(base,[255,226,180],0.22),dk=mix(base,[0,0,0],0.45);ctx.save();mw_soft(ctx,x,y,w,h,r,seed,o.amp);
  let g=ctx.createLinearGradient(x,y,x+w*0.6,y+h);g.addColorStop(0,rgba(lit,1));g.addColorStop(0.55,rgba(base,1));g.addColorStop(1,rgba(dk,1));ctx.fillStyle=g;ctx.fill();ctx.clip();
  const n=o.lines||Math.max(4,Math.round(h/9)),sw=o.vertical;
  for(let i=0;i<n;i++){const u=(i+hash(i,seed+3)*0.8)/n,y0=y+u*h,amp=2+hash(i,seed+4)*5,ph=hash(i,seed+5)*6;ctx.beginPath();ctx.moveTo(x-4,y0);
    for(let k=0;k<4;k++){const x0=x-4+k*(w+8)/4,x1=x0+(w+8)/4;ctx.bezierCurveTo(x0+(x1-x0)*0.33,y0+Math.sin(ph+k*1.7)*amp,x0+(x1-x0)*0.66,y0+Math.sin(ph+k*1.7+1.3)*amp,x1,y0+Math.sin(ph+k*1.7+2.1)*amp*0.6);}
    ctx.strokeStyle=rgba(mix(base,[0,0,0],0.5),0.16+0.18*hash(i,seed+6));ctx.lineWidth=0.6+1.6*hash(i,seed+7);ctx.stroke();}
  if(o.knot!==false&&hash(seed,9)>0.55){const kx=x+w*(0.2+0.6*hash(seed,10)),ky=y+h*(0.3+0.4*hash(seed,11));ctx.strokeStyle=rgba(mix(base,[0,0,0],0.55),0.35);ctx.lineWidth=1.2;for(let q=0;q<3;q++){ctx.beginPath();ctx.ellipse(kx,ky,6+q*5,2.5+q*2,0.1,0,TAU);ctx.stroke();}}
  ctx.restore();ctx.save();mw_soft(ctx,x,y,w,h,r,seed,o.amp);ctx.strokeStyle="rgba(255,226,180,0.22)";ctx.lineWidth=1.4;ctx.stroke();ctx.restore();}
// brass: a small warm plate with a highlight
function mw_brass(ctx,x,y,w,h,r){const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,"#f3d894");g.addColorStop(0.45,"#c99d4f");g.addColorStop(1,"#7e5a26");ctx.fillStyle=g;mw_soft(ctx,x,y,w,h,r,7,0.4);ctx.fill();}
// a drawer pull: a brass loop that thickens in the middle and thins at its ends
function mw_pull(ctx,cx,cy,r){ctx.beginPath();ctx.moveTo(cx-r,cy);ctx.bezierCurveTo(cx-r,cy+r*1.25,cx+r,cy+r*1.25,cx+r,cy);ctx.bezierCurveTo(cx+r*0.8,cy+r*0.8,cx-r*0.8,cy+r*0.8,cx-r,cy);ctx.closePath();
  const g=ctx.createLinearGradient(cx,cy,cx,cy+r);g.addColorStop(0,"#f6dc98");g.addColorStop(1,"#8c6428");ctx.fillStyle=g;ctx.fill();[-1,1].forEach(sd=>{ctx.fillStyle="#e2c27a";ctx.beginPath();ctx.ellipse(cx+sd*r,cy,2.8,2.2,0,0,TAU);ctx.fill();});}
// a wooden cabinet of drawers; o.open lists the drawers pulled out, as [index, p (0..1)] (or one index, pulled by o.p); a warm light drifts across it.
// Returns where each open drawer is, in the order of o.open
function mw_cabinet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,t=o.t||0,open=Array.isArray(o.open)?o.open:(o.open==null?[]:[[o.open,o.p]]),at=[];if(a<=0.01)return null;const WOOD=[122,80,46];
  withA(ctx,a,()=>{const rows=5,cols=4,px=24,top=80,gp=10,dw=(w-px*2-(cols-1)*gp)/cols,dh=(h-top-px-(rows-1)*gp)/rows;
    ctx.save();ctx.shadowColor="rgba(0,0,0,0.75)";ctx.shadowBlur=44;ctx.shadowOffsetY=16;ctx.fillStyle="#3a2313";mw_soft(ctx,x,y,w,h,12,2);ctx.fill();ctx.restore();
    mw_wood(ctx,x,y,w,h,12,WOOD,21,{lines:34});
    mw_wood(ctx,x-16,y-22,w+32,34,8,[150,100,58],23,{lines:5,knot:false});ctx.fillStyle="#24150a";mw_soft(ctx,x+14,y+h-2,w-28,18,5,4);ctx.fill();
    mw_brass(ctx,x+w/2-105,y+28,210,32,6);T(ctx,"CATALOGUE",x+w/2,y+51,{f:"mono",w:500,size:18,align:"center",color:"rgba(60,40,16,0.95)"});
    const opened=open.map(q=>q[0]),order=[...Array(rows*cols).keys()].filter(i=>!opened.includes(i)).concat(opened);
    order.forEach(i=>{const r=Math.floor(i/cols),c=i%cols,k=opened.indexOf(i),dx=x+px+c*(dw+gp),dy=y+top+r*(dh+gp),op=k>=0?ease(clamp(open[k][1]||0,0,1)):0;
      const sc=1+0.14*op,fw=dw*sc,fh=dh*sc,fx=dx+dw/2-fw/2,fy=dy+op*dh*0.62;
      ctx.fillStyle="rgba(20,10,4,0.75)";mw_soft(ctx,dx-2,dy-2,dw+4,dh+4,6,i);ctx.fill();
      if(op>0){ctx.fillStyle="#120904";mw_soft(ctx,dx,dy,dw,dh,5,i);ctx.fill();
        ctx.fillStyle="#553619";ctx.beginPath();ctx.moveTo(dx+4,dy+4);ctx.quadraticCurveTo(dx+2,(dy+fy)/2,fx,fy+2);ctx.lineTo(fx+fw,fy+2);ctx.quadraticCurveTo(dx+dw-2,(dy+fy)/2,dx+dw-4,dy+4);ctx.closePath();ctx.fill();
        for(let k=0;k<10;k++){const u=k/10,yy=lerp(dy+8,fy-3,u),x0=lerp(dx+10,fx+6,u),x1=x0+lerp(dw-20,fw-12,u);ctx.beginPath();ctx.moveTo(x0,yy+2);ctx.quadraticCurveTo((x0+x1)/2,yy-1.5,x1,yy+2);ctx.lineTo(x1,yy+4.5);ctx.quadraticCurveTo((x0+x1)/2,yy+1,x0,yy+4.5);ctx.closePath();ctx.fillStyle=k%3?"#efe4c9":"#dccca8";ctx.fill();}}
      mw_wood(ctx,fx,fy,fw,fh,6,mix(WOOD,[160,110,64],0.35+0.2*hash(i,4)),40+i,{lines:7});
      const lw=fw*0.6,lh=fh*0.27,lx=fx+fw/2-lw/2,ly=fy+fh*0.16;mw_brass(ctx,lx-3,ly-3,lw+6,lh+6,3);ctx.fillStyle="#f2e8d0";ctx.fillRect(lx,ly,lw,lh);
      T(ctx,MW_DRAWERS[i],fx+fw/2,ly+lh*0.8,{f:"mono",w:500,size:Math.round(lh*0.78),align:"center",color:"rgba(50,36,24,0.95)"});
      mw_pull(ctx,fx+fw/2,fy+fh*0.62,fh*0.15);
      if(k>=0)at[k]={x:fx+fw/2,y:fy,dy,w:fw,h:fh};});
    // the reading-room light drifting slowly over the wood
    ctx.save();mw_soft(ctx,x-16,y-22,w+32,h+22,12,2);ctx.clip();glow(ctx,x+w*(0.35+0.25*Math.sin(t*0.23)),y+h*(0.3+0.12*Math.sin(t*0.17+1)),w*0.7,[255,214,160],0.16);ctx.restore();});
  return at;}
// a catalogue card (3 by 5 inches): the shelf mark in the upper left, the heading on the red line, the entry below, a hole for the rod.
// Paper: a lit corner, a shadowed one, fibres, edges that aren't quite straight, and a slight flutter (o.t).
// o: mark ("657 HAL"), head, lines, kind (subject headings were typed in red), bad (0..1: the mark is out of step), ok (0..1: just retyped), flip (0..1)
function mw_card(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=Math.round(w*0.6);if(a<=0.01)return h;const s=w/340,t=o.t||0,sd=o.seed||(o.head||"x").length;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate((o.rot||0)+0.006*Math.sin(t*1.3+sd));if(o.flip)ctx.scale(1,Math.max(0.04,Math.abs(Math.cos(o.flip*Math.PI))));ctx.translate(-w/2,-h/2);
    if(o.glow)glow(ctx,w/2,h/2,w*0.75,o.glowCol||[255,220,160],0.25*o.glow);
    ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=22*s;ctx.shadowOffsetY=(6+1.5*Math.sin(t*1.3+sd))*s;ctx.fillStyle="#efe5cc";mw_soft(ctx,0,0,w,h,4*s,sd,1.1*s);ctx.fill();ctx.restore();
    ctx.save();mw_soft(ctx,0,0,w,h,4*s,sd,1.1*s);ctx.clip();
    let g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#f8f0da");g.addColorStop(0.6,"#efe4c8");g.addColorStop(1,"#d9c8a2");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    for(let i=0;i<26;i++){const fx=hash(i,sd+1)*w,fy=hash(i,sd+2)*h,L=(6+hash(i,sd+3)*12)*s,an=hash(i,sd+4)*TAU;ctx.strokeStyle="rgba(150,120,80,"+(0.08+0.1*hash(i,sd+5))+")";ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(fx,fy);ctx.quadraticCurveTo(fx+Math.cos(an+0.6)*L*0.6,fy+Math.sin(an+0.6)*L*0.6,fx+Math.cos(an)*L,fy+Math.sin(an)*L);ctx.stroke();}
    const sh=((t*0.08+sd*0.13)%1.6)-0.3;g=ctx.createLinearGradient(w*(sh-0.2),0,w*(sh+0.2),h);g.addColorStop(0,"rgba(255,250,235,0)");g.addColorStop(0.5,"rgba(255,250,235,0.16)");g.addColorStop(1,"rgba(255,250,235,0)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.strokeStyle="rgba(200,60,50,0.55)";ctx.lineWidth=1.4*s;ctx.beginPath();ctx.moveTo(0,38*s);ctx.quadraticCurveTo(w/2,38.8*s,w,38*s);ctx.stroke();
    ctx.strokeStyle="rgba(90,130,190,0.2)";ctx.lineWidth=s;for(let yy=60;yy<h/s-26;yy+=22){ctx.beginPath();ctx.moveTo(0,yy*s);ctx.quadraticCurveTo(w/2,(yy+0.6)*s,w,yy*s);ctx.stroke();}
    ctx.strokeStyle="rgba(200,60,50,0.26)";ctx.beginPath();ctx.moveTo(82*s,0);ctx.lineTo(82*s,h);ctx.stroke();ctx.restore();
    const hg=ctx.createRadialGradient(w/2-2*s,h-17*s,1,w/2,h-15*s,8*s);hg.addColorStop(0,"rgba(10,6,4,0.95)");hg.addColorStop(1,"rgba(60,40,24,0.8)");ctx.fillStyle=hg;ctx.beginPath();ctx.arc(w/2,h-15*s,7*s,0,TAU);ctx.fill();
    const bad=o.bad||0,ok=o.ok||0;
    if(bad>0.01||ok>0.01){const c=bad>ok?[200,40,30]:[40,140,80],q=Math.max(bad,ok);withA(ctx,q,()=>{ctx.fillStyle=rgba(c,0.16);rr(ctx,5*s,6*s,72*s,52*s,6*s);ctx.fill();ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=2.4*s;rr(ctx,5*s,6*s,72*s,52*s,6*s);ctx.stroke();});}
    (o.mark||"").split(" ").forEach((m,i)=>T(ctx,m,14*s,28*s+i*22*s,{f:"mono",w:500,size:18*s,color:bad>0.5?"rgba(190,36,28,1)":"rgba(36,30,26,0.95)"}));
    T(ctx,o.head||"",92*s,28*s,{f:"mono",w:500,size:18*s,color:o.kind==="subject"?"rgba(176,40,30,0.95)":"rgba(30,26,24,0.95)"});
    (o.lines||[]).forEach((l,i)=>T(ctx,l,108*s,82*s+i*22*s,{f:"mono",w:500,size:15*s,color:"rgba(50,44,40,0.88)"}));
    if(o.tag)T(ctx,o.tag,w-12*s,h-10*s,{f:"mono",w:500,size:14*s,align:"right",color:"rgba(130,100,70,0.95)"});
    ctx.restore();});return h;}
const MW_CARDS={author:{kind:"author",head:"Hale, Margaret.",lines:["A treatise on accounts.","London, 1908. 212 p."],tag:"author card",seed:3},
  title:{kind:"title",head:"A treatise on accounts.",lines:["Hale, Margaret.","London, 1908. 212 p."],tag:"title card",seed:5},
  subject:{kind:"subject",head:"BOOKKEEPING.",lines:["Hale, Margaret.","A treatise on accounts."],tag:"subject card",seed:8}};
// a book's spine: cloth that curves round (a lit side and a shadow side), a rounded head, and gilt bands that follow the curve
function mw_spine(ctx,bx,top,bw,bh,col){const lit=mix(col,[255,236,200],0.25),dk=mix(col,[0,0,0],0.5);ctx.beginPath();ctx.moveTo(bx,top+bh);ctx.lineTo(bx,top+5);ctx.quadraticCurveTo(bx+bw/2,top-4,bx+bw,top+5);ctx.lineTo(bx+bw,top+bh);ctx.closePath();
  const g=ctx.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,rgba(dk,1));g.addColorStop(0.35,rgba(lit,1));g.addColorStop(0.7,rgba(col,1));g.addColorStop(1,rgba(dk,1));ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle="rgba(214,180,100,0.6)";ctx.lineWidth=1.8;[12,20].forEach(d=>{ctx.beginPath();ctx.moveTo(bx+1,top+d+2);ctx.quadraticCurveTo(bx+bw/2,top+d-2,bx+bw-1,top+d+2);ctx.stroke();});}
// a shelf of books, with a brass range label on the plank; o.gaps leaves empty slots (and returns every slot's centre)
const MW_SPINES=[[91,42,36],[35,57,79],[47,74,44],[107,74,30],[59,43,79],[122,59,34],[39,64,63],[90,74,54]];
function mw_shelf(ctx,x,y,w,label,o){o=o||{};const a=o.a==null?1:o.a,slots=[],books=[],seed=o.seed||3,t=o.t||0;let bx=x+18,i=0;
  while(bx<x+w-44){const bw=24+Math.floor(hash(i,seed)*22),bh=118+hash(i,seed+1)*56;
    if((o.gaps||[]).includes(i)){slots[i]=bx+26;bx+=52;i++;continue;}books.push([bx,bw,bh,i]);slots[i]=bx+bw/2;bx+=bw;i++;}
  withA(ctx,a,()=>{const bg=ctx.createLinearGradient(0,y-200,0,y);bg.addColorStop(0,"rgba(16,9,4,0.35)");bg.addColorStop(1,"rgba(26,15,7,0.8)");ctx.fillStyle=bg;mw_soft(ctx,x-10,y-200,w+20,200,8,seed);ctx.fill();
    books.forEach(([bx,bw,bh,i])=>{const col=MW_SPINES[Math.floor(hash(i,seed+2)*MW_SPINES.length)],lean=hash(i,seed+8)>0.88?0.05:0;ctx.save();ctx.translate(bx,y);ctx.rotate(lean);mw_spine(ctx,0,-bh,bw-3,bh,col);
      ctx.fillStyle="rgba(240,230,205,0.85)";mw_soft(ctx,3,-30,bw-9,16,3,i,0.4);ctx.fill();ctx.restore();});
    mw_wood(ctx,x-14,y,w+28,24,5,[140,94,54],seed+30,{lines:4,knot:false});
    const lw=tw(ctx,label,17,500,"mono")+26;mw_brass(ctx,x+w/2-lw/2,y+2,lw,20,4);
    T(ctx,label,x+w/2,y+18,{f:"mono",w:500,size:17,align:"center",color:"rgba(60,40,16,0.95)"});
    // the reading-room light, drifting along the shelf
    ctx.save();ctx.beginPath();ctx.rect(x-10,y-200,w+20,224);ctx.clip();glow(ctx,x+w*(0.5+0.4*Math.sin(t*0.19+seed)),y-90,220,[255,214,160],0.12);ctx.restore();});
  return slots;}
// the one book we follow, standing at (x, y) on a shelf, with its shelf mark on a label above it
function mw_book(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w=46,h=196;
  if(o.hi)glow(ctx,x,y-h/2,150,[255,214,150],0.45*o.hi);
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;mw_spine(ctx,x-w/2,y-h,w,h,[40,96,74]);ctx.restore();
  ctx.strokeStyle="rgba(230,196,110,0.9)";ctx.lineWidth=2.4;[h-54].forEach(d=>{ctx.beginPath();ctx.moveTo(x-w/2+1,y-h+d+2);ctx.quadraticCurveTo(x,y-h+d-3,x+w/2-1,y-h+d+2);ctx.stroke();});
  ctx.save();ctx.translate(x+6,y-h/2-20);ctx.rotate(-Math.PI/2);T(ctx,"HALE · ACCOUNTS",0,0,{w:800,size:13,align:"center",color:"rgba(240,214,150,0.95)"});ctx.restore();
  ctx.fillStyle="#f2e8d0";mw_soft(ctx,x-w/2+5,y-40,w-10,28,4,2,0.5);ctx.fill();T(ctx,(o.mark||"").split(" ")[0],x,y-21,{f:"mono",w:500,size:11,align:"center",color:"rgba(40,30,20,0.95)"});
  if(o.mark&&o.label!==false){const mw=tw(ctx,o.mark,20,500,"mono")+26,ly=y-h-46;withA(ctx,o.labA==null?1:o.labA,()=>{ctx.fillStyle="#f3ead4";mw_soft(ctx,x-mw/2,ly-18,mw,36,7,4,0.8);ctx.fill();
    ctx.strokeStyle=o.flash?rgba(GOOD,0.9):"rgba(120,90,50,0.6)";ctx.lineWidth=o.flash?3:1.4;mw_soft(ctx,x-mw/2,ly-18,mw,36,7,4,0.8);ctx.stroke();
    T(ctx,o.mark,x,ly+7,{f:"mono",w:500,size:20,align:"center",color:"rgba(36,30,26,0.98)"});ctx.strokeStyle="rgba(238,224,196,0.5)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x,ly+18);ctx.quadraticCurveTo(x+3,(ly+18+y-h)/2,x,y-h-4);ctx.stroke();});}});}
// the reading room's light: soft beams from a high window, swaying very slightly
function mw_libLight(ctx,t,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha*=a;
  for(let i=0;i<3;i++){const sw=Math.sin(t*0.21+i*1.7)*26,x0=260+i*170+sw,g=ctx.createLinearGradient(x0,0,x0+620,1080);g.addColorStop(0,"rgba(255,214,160,0.07)");g.addColorStop(1,"rgba(255,214,160,0)");ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(x0,-10);ctx.bezierCurveTo(x0+200,300,x0+420,700,x0+560+sw,1090);ctx.lineTo(x0+700+sw,1090);ctx.bezierCurveTo(x0+520,700,x0+300,300,x0+110,-10);ctx.closePath();ctx.fill();}
  ctx.restore();}

/* ---------- small glass pieces ---------- */
// a panel for a glyph or a group, in a shape's colour
function mw_panel(ctx,x,y,w,h,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{if(o.hi)glow(ctx,x+w/2,y+h/2,Math.max(w,h)*0.6,col,0.22*o.hi);glass(ctx,x,y,w,h,20,col,{glow:14+12*(o.hi||0),ea:0.55+0.4*(o.hi||0),fill:"rgba(7,12,24,0.9)"});});}
// a source system: its colour, its name
function mw_source(ctx,x,y,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const c=MW_SRC[k][1],n=o.name||MW_SRC[k][0],w=o.w||320,h=o.h||76;
  withA(ctx,a,()=>{if(o.hi)glow(ctx,x+w/2,y+h/2,w*0.6,c,0.3*o.hi);const room=tw(ctx,n,22,700)+32+74<w;sysCard(ctx,x,y,w,h,n,o.sub||"",c,room?(cx,xx,yy)=>dbGlyph(cx,xx,yy+4,c,0.8):null);if(o.isNew)tag(ctx,x+w-10,y-4,o.newLabel||"new",c,{size:o.newSize||15});});}
// a tick in a small dark disc, for "unchanged" and "agrees"
function mw_ok(ctx,x,y,r,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle="rgba(7,12,24,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,col,1,2);tick_(ctx,x,y+1,r*1.3,col,1);});}
function mw_no(ctx,x,y,r,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle="rgba(7,12,24,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,BAD,1,2);cross_(ctx,x,y,r*1.2,BAD,1);});}
// a plain glowing line between two points, drawn up to p
function mw_line(ctx,x0,y0,x1,y1,col,a,o){o=o||{};const p=o.p==null?1:o.p;if(a<=0.01||p<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||2.2;ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=o.blur==null?8:o.blur;if(o.dash)ctx.setLineDash(o.dash);ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,p),lerp(y0,y1,p));ctx.stroke();ctx.restore();}
// a dot travelling along a line, for data or a question moving
function mw_dot(ctx,x0,y0,x1,y1,u,col,a,r){if(a<=0.01||u<0||u>1)return;const x=lerp(x0,x1,u),y=lerp(y0,y1,u);glow(ctx,x,y,(r||6)*4,col,0.5*a);withA(ctx,a,()=>{ctx.fillStyle=rgba(mix(col,[255,255,255],0.4),1);ctx.beginPath();ctx.arc(x,y,r||6,0,TAU);ctx.fill();});}

/* ---------- the data vault: hubs, links and satellites ---------- */
function mw_key(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4*s;ctx.lineCap="round";ctx.beginPath();ctx.arc(x-7*s,y,6*s,0,TAU);ctx.moveTo(x-1*s,y);ctx.lineTo(x+12*s,y);ctx.moveTo(x+8*s,y);ctx.lineTo(x+8*s,y+5*s);ctx.moveTo(x+12*s,y);ctx.lineTo(x+12*s,y+5*s);ctx.stroke();ctx.restore();}
// a hub: one row per business key, the thing that identifies a learner or a credential
// o.key2 {key, a, label}: a second business key, a new row, grows in under the first (in the new source's pink); the hub's top stays put
function mw_hub(ctx,x,y,name,key,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||280,k2=o.key2,g=k2?ease(clamp(k2.a||0,0,1)):0,h=106+32*g,top=y-53;if(a<=0.01)return{x,y,w,h,top};
  withA(ctx,a,()=>{const hi=o.hi||0;if(hi)glow(ctx,x,y,w*0.7,MW_V,0.3*hi);glass(ctx,x-w/2,top,w,h,14,MW_V,{glow:16+10*hi,ea:0.95,lw:2.6,fill:"rgba(30,20,56,0.94)"});
    T(ctx,"HUB",x-w/2+16,top+24,{f:"mono",w:500,size:14,color:rgba(MW_V,0.9)});T(ctx,name,x,y-4,{w:800,size:28,align:"center",color:rgba(mix(MW_V,[255,255,255],0.35),1)});
    mw_key(ctx,x-w/2+30,y+30,1,MW_V);T(ctx,key,x-w/2+52,y+36,{f:"mono",w:500,size:17,color:rgba(INK,0.9)});
    if(g>0.01)withA(ctx,g,()=>{ctx.strokeStyle=rgba(MW_SC,0.35);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-w/2+16,y+49);ctx.lineTo(x+w/2-16,y+49);ctx.stroke();
      mw_key(ctx,x-w/2+30,y+64,1,MW_SC);T(ctx,k2.key,x-w/2+52,y+70,{f:"mono",w:500,size:17,color:rgba(MW_SC,1)});if(k2.label)T(ctx,k2.label,x+w/2-14,y+70,{f:"mono",w:500,size:14,align:"right",color:rgba(MW_SC,0.9)});});
    if(o.ok)mw_ok(ctx,x+w/2-6,top+6,15,GOOD,o.ok);});return{x,y,w,h,top};}
// a link: one row per relationship between hubs
function mw_link(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||250,h=84;if(a<=0.01)return{x,y,w,h};
  withA(ctx,a,()=>{const hi=o.hi||0,c=mix(MW_V,[255,255,255],0.2);if(hi)glow(ctx,x,y,w*0.6,MW_V,0.28*hi);ctx.save();ctx.shadowColor=rgba(MW_V,0.8);ctx.shadowBlur=14+10*hi;ctx.beginPath();
    ctx.moveTo(x-w/2+26,y-h/2);ctx.lineTo(x+w/2-26,y-h/2);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w/2-26,y+h/2);ctx.lineTo(x-w/2+26,y+h/2);ctx.lineTo(x-w/2,y);ctx.closePath();ctx.fillStyle="rgba(22,16,44,0.94)";ctx.fill();ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();
    T(ctx,"LINK",x,y-14,{f:"mono",w:500,size:14,align:"center",color:rgba(MW_V,0.9)});T(ctx,name,x,y+16,{w:700,size:21,align:"center",color:rgba(INK,0.95)});
    if(o.ok)mw_ok(ctx,x+w/2-18,y-h/2+4,15,GOOD,o.ok);});return{x,y,w,h};}
// a satellite: the descriptions, one version per change, each with its source and the time it arrived
function mw_sat(ctx,x,y,w,attrs,src,time,o){o=o||{};const a=o.a==null?1:o.a,h=66;if(a<=0.01)return{x,y,w,h};const sc=MW_SRC[src][1];
  withA(ctx,a,()=>{const hi=o.hi||0,edge=o.edge||mix(MW_V,[255,255,255],0.1);if(hi)glow(ctx,x+w/2,y+h/2,w*0.6,edge,0.26*hi);glass(ctx,x,y,w,h,10,edge,{glow:8+10*hi,ea:0.6+0.35*hi,fill:"rgba(16,14,34,0.94)"});
    ctx.fillStyle=rgba(edge,0.8);rr(ctx,x+8,y+10,5,h-20,2.5);ctx.fill();T(ctx,attrs,x+24,y+28,{w:700,size:18,color:rgba(INK,0.95)});
    const sh=o.srcHi||0;if(sh>0.01)withA(ctx,sh,()=>{ctx.fillStyle=rgba(TRUST,0.16);rr(ctx,x+18,y+36,w-28,24,6);ctx.fill();ctx.strokeStyle=rgba(TRUST,0.8);ctx.lineWidth=1.6;rr(ctx,x+18,y+36,w-28,24,6);ctx.stroke();});
    ctx.fillStyle=rgba(sc,1);ctx.beginPath();ctx.arc(x+30,y+48,5,0,TAU);ctx.fill();T(ctx,MW_SRC[src][2],x+42,y+54,{f:"mono",w:500,size:15,color:rgba(sc,1)});
    T(ctx,time,x+w-12,y+54,{f:"mono",w:500,size:15,align:"right",color:rgba(SOFT,1)});
    if(o.ok)mw_ok(ctx,x+w-4,y+4,13,GOOD,o.ok);});return{x,y,w,h};}

/* ---------- stars: facts in the middle, dimensions around ---------- */
function mw_starShape(ctx,x,y,r,col,a){withA(ctx,a==null?1:a,()=>{ctx.beginPath();for(let i=0;i<10;i++){const an=-Math.PI/2+i*Math.PI/5,rr_=i%2?r*0.45:r;ctx.lineTo(x+Math.cos(an)*rr_,y+Math.sin(an)*rr_);}ctx.closePath();ctx.fillStyle=rgba(col,0.9);ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;});}
function mw_fact(ctx,x,y,name,grain,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||300,h=o.h||112;if(a<=0.01)return{x,y,w,h};
  withA(ctx,a,()=>{const hi=o.hi||0;if(hi)glow(ctx,x,y,w*0.75,MW_S,0.35*hi);glass(ctx,x-w/2,y-h/2,w,h,16,MW_S,{glow:16+12*hi,ea:0.85+0.15*hi,lw:2.4,fill:"rgba(8,30,24,0.94)"});
    mw_starShape(ctx,x-w/2+38,y-(o.bare?0:14),18,MW_S,1);if(!o.bare)T(ctx,"FACT",x-w/2+38,y+26,{f:"mono",w:500,size:14,align:"center",color:rgba(MW_S,0.9)});
    T(ctx,name,x-w/2+72,y+(o.bare?11:-4),{w:800,size:mw_fs(ctx,name,31,800,w-86,20),color:rgba(mix(MW_S,[255,255,255],0.3),1)});if(grain)T(ctx,grain,x-w/2+72,y+28,{w:600,size:17,color:rgba(SOFT,1)});
    if(o.num)T(ctx,o.num,x+w/2-16,y-6,{f:"mono",w:500,size:18,align:"right",color:rgba(MW_S,1)});});return{x,y,w,h};}
function mw_dim(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,sh=!!o.shared,w=o.w||(sh?290:220),h=sh?86:60;if(a<=0.01)return{x,y,w,h};
  withA(ctx,a,()=>{const hi=o.hi||0,c=sh?mix(MW_S,[255,255,255],0.25):mix(MW_S,[150,170,190],0.45);if(hi)glow(ctx,x,y,w*0.7,MW_S,0.3*hi);
    glass(ctx,x-w/2,y-h/2,w,h,12,c,{glow:sh?14+10*hi:6,ea:sh?0.95:0.55,lw:sh?2.4:1.4,fill:"rgba(7,16,20,0.94)"});
    T(ctx,name,x,y+(o.sub?-2:8),{w:sh?800:700,size:sh?28:22,align:"center",color:rgba(c,1)});if(o.sub)T(ctx,o.sub,x,y+26+((o.subSize||16)-16)*0.6,{f:"mono",w:500,size:o.subSize||16,align:"center",color:rgba(o.subCol||SOFT,1)});});return{x,y,w,h};}
// the edge of a box, towards a point: so lines meet boxes, not their centres
function mw_edge(b,tx,ty){const dx=tx-b.x,dy=ty-b.y,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,k=Math.min(Math.abs(ux)>1e-6?b.w/2/Math.abs(ux):1e9,Math.abs(uy)>1e-6?b.h/2/Math.abs(uy):1e9);return[b.x+ux*k,b.y+uy*k];}
function mw_join(ctx,A,B,col,a,o){const p=mw_edge(A,B.x,B.y),q=mw_edge(B,A.x,A.y);mw_line(ctx,p[0],p[1],q[0],q[1],col,a,o);}
// the bus matrix: business processes down the side, shared dimensions across the top, a tick where a process uses a dimension
function mw_bus(ctx,x,y,rows,cols,ticks,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lw=o.lw||300,cw=o.cw||150,hh=o.hh||96,rh=o.rh||84;
  withA(ctx,a,()=>{glass(ctx,x-24,y-24,lw+cols.length*cw+48,hh+rows.length*rh+48,20,MW_S,{glow:14,ea:0.45,fill:"rgba(7,14,20,0.9)"});
    rows.forEach((r,i)=>cols.forEach((cc,j)=>{ctx.strokeStyle="rgba(170,230,200,0.10)";ctx.lineWidth=1;rr(ctx,x+lw+j*cw+8,y+hh+i*rh+8,cw-16,rh-16,8);ctx.stroke();}));
    (o.hiCols||[]).forEach(ci=>{const q=o.hiA==null?1:o.hiA;if(q>0.01){ctx.fillStyle=rgba(MW_S,0.10*q);rr(ctx,x+lw+ci*cw+6,y+4,cw-12,hh+rows.length*rh-8,12);ctx.fill();ctx.strokeStyle=rgba(MW_S,0.5*q);ctx.lineWidth=1.6;rr(ctx,x+lw+ci*cw+6,y+4,cw-12,hh+rows.length*rh-8,12);ctx.stroke();}});
    cols.forEach((c,j)=>withA(ctx,o.colA?o.colA(j):1,()=>{const cx=x+lw+j*cw+cw/2;ctx.save();ctx.translate(cx,y+hh-16);ctx.rotate(-0.42);T(ctx,c,0,0,{w:700,size:21,color:rgba((o.hiCols||[]).includes(j)?mix(MW_S,[255,255,255],0.3):INK,0.95)});ctx.restore();}));
    rows.forEach((r,i)=>withA(ctx,o.rowA?o.rowA(i):1,()=>{const ry=y+hh+i*rh;T(ctx,r,x+8,ry+rh/2+9,{w:800,size:26,color:rgba(mix(MW_S,[255,255,255],0.3),1)});
      ctx.strokeStyle="rgba(170,220,200,0.14)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,ry);ctx.lineTo(x+lw+cols.length*cw,ry);ctx.stroke();}));
    ticks.forEach((row,i)=>row.forEach((v,j)=>{if(!v)return;const q=o.tickA?o.tickA(i,j):1;if(q<=0.01)return;const cx=x+lw+j*cw+cw/2,cy=y+hh+i*rh+rh/2;tick_(ctx,cx,cy,34,MW_S,q);}));});}

/* ---------- wide tables: one row per learner ---------- */
const MW_WCOLS=[["learner",180],["current course",320],["credit so far",190],["credentials",470],["next step",330],["…",90]];
const MW_WROWS=[["Aisha K.","Grad Cert Data Science","45 of 60",["BSc 2022","Data viz ✦","SQL ✦"],"Machine learning ✦"],
  ["Tomás R.","Bachelor of IT","120 of 240",["Excel badge"],"Year 2 units"],
  ["Priya N.","Grad Cert Data Science","50 of 60",["BA 2019","Statistics ✦"],"Capstone"],
  ["Li W.","Short course: Python","10 of 60",["Python ✦"],"Data viz ✦"]];
// a wide table: o.cols, o.rows, o.colA(j) (a header, as it's named), o.rowA(i), o.rowHi(i), o.colHi(j), o.dim(i) (rows a filter leaves out), o.cell(i,j) override
function mw_wide(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cols=o.cols||MW_WCOLS,rows=o.rows||MW_WROWS,rh=o.rh||60,hh=52,W_=cols.reduce((s,c)=>s+c[1],0),h=hh+rows.length*rh,col=o.col||MW_W;
  withA(ctx,a,()=>{glass(ctx,x-12,y-12,W_+24,h+24,16,col,{glow:16,ea:0.7,fill:"rgba(20,14,6,0.9)"});if(o.name)T(ctx,o.name,x,y-24,{f:"mono",w:500,size:20,color:rgba(col,1)});
    let cx=x;cols.forEach((c,j)=>{const hA=o.colA?o.colA(j):1,hi=o.colHi?o.colHi(j):0;
      if(hi>0.01){ctx.fillStyle=rgba(o.hiCol||col,0.14*hi);rr(ctx,cx+2,y,c[1]-4,h,8);ctx.fill();ctx.strokeStyle=rgba(o.hiCol||col,0.8*hi);ctx.lineWidth=2;rr(ctx,cx+2,y,c[1]-4,h,8);ctx.stroke();}
      withA(ctx,hA,()=>T(ctx,c[0],cx+14,y+34,{f:"mono",w:500,size:20,color:rgba(hi>0.5&&o.hiCol?o.hiCol:col,1)}));cx+=c[1];});
    ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x,y+hh);ctx.lineTo(x+W_,y+hh);ctx.stroke();
    rows.forEach((r,i)=>{const ra=o.rowA?o.rowA(i):1;if(ra<=0.01)return;const ry=y+hh+i*rh,dim=o.dim?o.dim(i):0,rhA=o.rowHi?o.rowHi(i):0;
      withA(ctx,ra*(1-0.72*dim),()=>{if(rhA>0.01){ctx.fillStyle=rgba(o.rowHiCol||col,0.16*rhA);rr(ctx,x,ry+4,W_,rh-8,8);ctx.fill();ctx.strokeStyle=rgba(o.rowHiCol||col,0.85*rhA);ctx.lineWidth=2;rr(ctx,x,ry+4,W_,rh-8,8);ctx.stroke();}
        let cx=x;cols.forEach((c,j)=>{const ov=o.cell?o.cell(i,j):null,v=ov!=null?ov:r[j],tx=cx+14,ty=ry+rh/2+8,cA=o.colA?Math.max(o.colA(j),0):1;
          withA(ctx,cA,()=>{if(Array.isArray(v)){let bx=tx;v.forEach(s=>{const bw=tw(ctx,s,17,700)+20;if(bx+bw>cx+c[1]-8)return;ctx.fillStyle=rgba(col,0.14);rr(ctx,bx,ty-22,bw,30,15);ctx.fill();ctx.strokeStyle=rgba(col,0.55);ctx.lineWidth=1.2;rr(ctx,bx,ty-22,bw,30,15);ctx.stroke();T(ctx,s,bx+10,ty,{w:700,size:17,color:rgba(INK,0.95)});bx+=bw+8;});}
            else if(v!=null)T(ctx,v,tx,ty,{w:j===0?800:600,size:21,color:j===0?rgba(INK,1):rgba(INK,0.88)});});cx+=c[1];});
        if(i<rows.length-1){ctx.strokeStyle="rgba(255,220,170,0.08)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,ry+rh);ctx.lineTo(x+W_,ry+rh);ctx.stroke();}});});
    // more columns, off to the right
    if(o.more){const g=ctx.createLinearGradient(x+W_-160,0,x+W_+12,0);g.addColorStop(0,"rgba(20,14,6,0)");g.addColorStop(1,"rgba(20,14,6,0.95)");ctx.fillStyle=g;ctx.fillRect(x+W_-160,y-10,172,h+20);}});
  return{w:W_,h};}
// a learner, as a simple glass figure
function mw_learner(ctx,x,y,s,col,a){withA(ctx,a==null?1:a,()=>{glow(ctx,x,y-40*s,90*s,col,0.25);ctx.fillStyle="rgba(10,14,26,0.95)";ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.6;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=12;
  ctx.beginPath();ctx.arc(x,y-62*s,24*s,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x-44*s,y);ctx.quadraticCurveTo(x-44*s,y-34*s,x,y-34*s);ctx.quadraticCurveTo(x+44*s,y-34*s,x+44*s,y);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;});}

/* ---------- the four shapes, as glyphs (for panels, the platform, the labs) ---------- */
// a normalised core: many small tables, each fact in one place, joined by keys
function mw_coreGlyph(ctx,cx,cy,s,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p,col=o.col||MW_C;if(a<=0.01)return;
  withA(ctx,a,()=>{const P_=[[-110,-44],[0,-44],[110,-44],[-110,44],[0,44],[110,44]],tw_=76*s,th=52*s;
    [[0,1],[1,2],[0,3],[1,4],[2,5],[4,5]].forEach(([i,j],k)=>{if(p*6<Math.max(i,j)+0.5)return;mw_line(ctx,cx+P_[i][0]*s,cy+P_[i][1]*s,cx+P_[j][0]*s,cy+P_[j][1]*s,col,0.7,{lw:1.8*s,blur:4});});
    P_.forEach(([dx,dy],i)=>{const q=clamp(p*6-i,0,1);if(q<=0)return;withA(ctx,q,()=>{const x=cx+dx*s-tw_/2,y=cy+dy*s-th/2;ctx.fillStyle="rgba(8,14,30,0.96)";rr(ctx,x,y,tw_,th,6*s);ctx.fill();ctx.fillStyle=rgba(col,0.55);rr(ctx,x,y,tw_,13*s,6*s);ctx.fill();
      ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=1.8*s;rr(ctx,x,y,tw_,th,6*s);ctx.stroke();ctx.fillStyle=rgba(col,0.45);for(let r=0;r<2;r++)ctx.fillRect(x+8*s,y+22*s+r*11*s,tw_-16*s-hash(i*3+r,4)*16*s,4*s);});});});}
// a data vault: two hubs (keys), a link between them, satellites stacking up under each
function mw_vaultGlyph(ctx,cx,cy,s,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p,col=o.col||MW_V,nx=o.extra||0;if(a<=0.01)return;
  withA(ctx,a,()=>{const hub=(x,y)=>{ctx.fillStyle="rgba(34,22,62,0.96)";rr(ctx,x-30*s,y-24*s,60*s,48*s,7*s);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4*s;ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=10;rr(ctx,x-30*s,y-24*s,60*s,48*s,7*s);ctx.stroke();ctx.shadowBlur=0;mw_key(ctx,x,y,0.9*s,col);};
    const L=[-100,-40],R=[100,-40];
    if(p>0.3){mw_line(ctx,cx-70*s,cy-40*s,cx-34*s,cy-40*s,col,0.9,{lw:2*s,blur:4});mw_line(ctx,cx+34*s,cy-40*s,cx+70*s,cy-40*s,col,0.9,{lw:2*s,blur:4});
      withA(ctx,clamp((p-0.3)*4,0,1),()=>{ctx.beginPath();const w=68*s,h=34*s,x=cx,y=cy-40*s;ctx.moveTo(x-w/2+10*s,y-h/2);ctx.lineTo(x+w/2-10*s,y-h/2);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w/2-10*s,y+h/2);ctx.lineTo(x-w/2+10*s,y+h/2);ctx.lineTo(x-w/2,y);ctx.closePath();ctx.fillStyle="rgba(26,18,48,0.96)";ctx.fill();ctx.strokeStyle=rgba(mix(col,[255,255,255],0.25),1);ctx.lineWidth=2*s;ctx.stroke();});}
    [L,R].forEach(([dx,dy],k)=>{if(p<0.05+k*0.1)return;hub(cx+dx*s,cy+dy*s);
      const n=(k?2:3),sats=n+(nx>0?1:0);for(let i=0;i<sats;i++){const q=clamp((p-0.5)*6-i*0.8,0,1)*(i>=n?clamp(nx,0,1):1);if(q<=0)continue;const x=cx+dx*s-36*s,y=cy+dy*s+34*s+i*20*s,isNew=i>=n;
        withA(ctx,q,()=>{ctx.fillStyle="rgba(16,14,34,0.96)";rr(ctx,x,y,72*s,15*s,4*s);ctx.fill();ctx.strokeStyle=rgba(isNew?MW_SC:mix(col,[160,170,200],0.3),0.95);ctx.lineWidth=1.6*s;rr(ctx,x,y,72*s,15*s,4*s);ctx.stroke();ctx.fillStyle=rgba(isNew?MW_SC:col,0.6);ctx.fillRect(x+6*s,y+5.5*s,40*s-hash(i+k*5,3)*14*s,4*s);});
        if(i===0&&q>0)mw_line(ctx,cx+dx*s,cy+dy*s+24*s,cx+dx*s,y,col,0.6*q,{lw:1.4*s,blur:0});}});});}
// a star: a fact in the middle, dimensions around it
function mw_starGlyph(ctx,cx,cy,s,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p,col=o.col||MW_S;if(a<=0.01)return;
  withA(ctx,a,()=>{const n=o.n||5;for(let i=0;i<n;i++){const q=clamp(p*n-i,0,1);if(q<=0)continue;const an=-Math.PI/2+i*TAU/n,x=cx+Math.cos(an)*96*s,y=cy+Math.sin(an)*72*s;
      mw_line(ctx,cx,cy,x,y,col,0.7*q,{lw:1.8*s,blur:4});withA(ctx,q,()=>{ctx.fillStyle="rgba(7,16,20,0.96)";rr(ctx,x-26*s,y-14*s,52*s,28*s,6*s);ctx.fill();ctx.strokeStyle=rgba(mix(col,[150,170,190],0.35),0.95);ctx.lineWidth=1.6*s;rr(ctx,x-26*s,y-14*s,52*s,28*s,6*s);ctx.stroke();});}
    ctx.fillStyle="rgba(8,30,24,0.97)";rr(ctx,cx-38*s,cy-26*s,76*s,52*s,8*s);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4*s;ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=10;rr(ctx,cx-38*s,cy-26*s,76*s,52*s,8*s);ctx.stroke();ctx.shadowBlur=0;mw_starShape(ctx,cx,cy,13*s,col,1);});}
// a wide table: one long row per learner, many columns, more off to the right
function mw_wideGlyph(ctx,cx,cy,s,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p,col=o.col||MW_W,nc=o.cols||11,cw=24*s,w=nc*cw,h=86*s,x=cx-w/2,y=cy-h/2;if(a<=0.01)return;
  withA(ctx,a,()=>{ctx.fillStyle="rgba(20,14,6,0.96)";rr(ctx,x,y,w,h,8*s);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.2*s;ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=10;rr(ctx,x,y,w,h,8*s);ctx.stroke();ctx.shadowBlur=0;
    ctx.fillStyle=rgba(col,0.45);rr(ctx,x,y,w,18*s,8*s);ctx.fill();
    for(let j=1;j<nc;j++){const q=clamp(p*nc-j,0,1);ctx.strokeStyle=rgba(col,0.25*q+0.05);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+j*cw,y+2);ctx.lineTo(x+j*cw,y+h-2);ctx.stroke();}
    for(let r=0;r<3;r++)for(let j=0;j<nc;j++){const q=clamp(p*nc-j,0,1);if(q<=0)continue;ctx.fillStyle=rgba(j===(o.newCol==null?-1:o.newCol)?MW_SC:col,(0.35+0.4*hash(r*13+j,2))*q);ctx.fillRect(x+j*cw+5*s,y+28*s+r*18*s,cw-10*s,6*s);}
    if(o.hiRow!=null){ctx.strokeStyle=rgba(col,0.95*o.hiRow);ctx.lineWidth=2;rr(ctx,x+2,y+22*s+0*18*s,w-4,17*s,4);ctx.stroke();}
    // more columns, off to the right: a fade inside the glyph's own edge (none when a new column is the point)
    if(o.newCol==null){ctx.save();rr(ctx,x,y,w,h,8*s);ctx.clip();const g=ctx.createLinearGradient(x+w-44*s,0,x+w,0);g.addColorStop(0,"rgba(20,14,6,0)");g.addColorStop(1,"rgba(20,14,6,0.92)");ctx.fillStyle=g;ctx.fillRect(x+w-44*s,y-4,44*s+4,h+8);ctx.restore();}});}
const MW_SHAPES={core:["normalised core",MW_C,mw_coreGlyph],vault:["data vault",MW_V,mw_vaultGlyph],star:["star",MW_S,mw_starGlyph],wide:["wide table",MW_W,mw_wideGlyph]};

/* ---------- tools that ask questions ---------- */
function mw_dashIcon(ctx,x,y,s,a,t){withA(ctx,a==null?1:a,()=>{glass(ctx,x-60*s,y-42*s,120*s,84*s,10*s,CYAN,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.94)"});[0.5,0.8,0.62,0.9].forEach((v,i)=>{const hh=v*48*s*(0.9+0.1*Math.sin((t||0)*1.3+i));ctx.fillStyle=rgba(CYAN,0.8);rr(ctx,x-44*s+i*24*s,y+30*s-hh,16*s,hh,3*s);ctx.fill();});});}
function mw_sheetIcon(ctx,x,y,s,a){withA(ctx,a==null?1:a,()=>{const c=[120,220,140];glass(ctx,x-60*s,y-42*s,120*s,84*s,10*s,c,{glow:12,ea:0.8,fill:"rgba(7,14,12,0.94)"});ctx.fillStyle=rgba(c,0.5);rr(ctx,x-60*s,y-42*s,120*s,16*s,8*s);ctx.fill();
  ctx.strokeStyle=rgba(c,0.45);ctx.lineWidth=1;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x-60*s+i*30*s,y-26*s);ctx.lineTo(x-60*s+i*30*s,y+42*s);ctx.stroke();}for(let j=1;j<4;j++){ctx.beginPath();ctx.moveTo(x-60*s,y-26*s+j*17*s);ctx.lineTo(x+60*s,y-26*s+j*17*s);ctx.stroke();}});}
function mw_mlIcon(ctx,x,y,s,a,t){withA(ctx,a==null?1:a,()=>{const c=[150,210,255],L=[[-40,-24],[-40,0],[-40,24],[0,-14],[0,14],[40,0]];[[0,3],[0,4],[1,3],[1,4],[2,3],[2,4],[3,5],[4,5]].forEach(([i,j])=>mw_line(ctx,x+L[i][0]*s,y+L[i][1]*s,x+L[j][0]*s,y+L[j][1]*s,c,0.6,{lw:1.4,blur:0}));
  L.forEach(([dx,dy],i)=>{const v=0.6+0.4*Math.sin((t||0)*2+i);glow(ctx,x+dx*s,y+dy*s,14*s,c,0.3*v);ctx.fillStyle=rgba(c,0.95);ctx.beginPath();ctx.arc(x+dx*s,y+dy*s,6*s,0,TAU);ctx.fill();});});}
// Genie: the orb, and its chip
function mw_genie(ctx,x,y,t,a,o){o=o||{};withA(ctx,a==null?1:a,()=>{orb(ctx,x,y,o.r||26,t);if(o.chip!==false)chip(ctx,x,y+(o.r||26)+44,"databricks","Genie",o.sub||"AI assistant",{align:"center",edge:LAYER.gold,ts:20,ss:15});});}
// the semantic layer: a thin band of light, where each number is defined once
function mw_sem(ctx,x,y,w,t,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const c=o.col||[200,236,255],h=o.h||34;glow(ctx,x+w/2,y,w*0.55,c,0.16+0.05*Math.sin(t*1.6));
  const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(c,0.1));g.addColorStop(0.5,rgba(c,0.32+0.08*Math.sin(t*2)));g.addColorStop(1,rgba(c,0.1));ctx.fillStyle=g;rr(ctx,x,y-h/2,w,h,h/2);ctx.fill();
  ctx.save();ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=16;ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=2;rr(ctx,x,y-h/2,w,h,h/2);ctx.stroke();ctx.restore();
  for(let i=0;i<5;i++){const u=((t*0.12+i/5)%1);glow(ctx,x+20+u*(w-40),y,16,c,0.4*Math.sin(u*Math.PI));}
  if(o.label)T(ctx,o.label,x+w/2,y+7,{w:700,size:o.size||18,align:"center",color:"rgba(230,246,255,0.98)"});});}

/* ---------- the platform: bronze, silver and gold, with every shape in its place ---------- */
// o: a (whole), sA (sources), bA/sA2/gA (vaults), core/vault (in silver), star/wide (in gold), sem (the semantic layer), tools, flow (data moving), t
const MW_PL={src:[190,190],bronze:[150,380,350,450],silver:[590,380,580,450],gold:[1260,380,610,450]};
function mw_platform(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[bx,by,bw,bh]=MW_PL.bronze,[sx,sy,sw,sh]=MW_PL.silver,[gx,gy,gw,gh]=MW_PL.gold,ym=by+bh/2+40;
  withA(ctx,a,()=>{const q=k=>o[k]==null?1:o[k];
    // sources, above bronze
    withA(ctx,q("srcA"),()=>{["sis","lms","fin","short"].forEach((k,i)=>{const x=bx+14+i*84,y=MW_PL.src[1],c=MW_SRC[k][1];glass(ctx,x,y-30,72,60,12,c,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.92)"});dbGlyph(ctx,x+36,y+2,c,0.7);
      mw_line(ctx,x+36,y+32,x+36,by-4,c,0.45,{lw:1.6,dash:[5,7],blur:0});if(o.flow)for(let n=0;n<2;n++){const u=((t*0.45+n*0.5+i*0.23)%1);mw_dot(ctx,x+36,y+32,x+36,by-4,u,c,0.9*Math.sin(u*Math.PI),4);}});
      T(ctx,o.srcLabel||"sources",bx+bw/2,MW_PL.src[1]-50,{w:700,size:22,align:"center",color:rgba(SOFT,1)});});
    const cellsB=(r,c)=>hash(r*11+c,5)<0.62?[[255,176,64],[126,224,140],[255,226,122],[255,128,168]][Math.floor(hash(r*7+c,6)*4)]:null;
    withA(ctx,q("bA"),()=>vault(ctx,bx,by,bw,bh,LAYER.bronze,cellsB,"Bronze","as it arrived"));
    withA(ctx,q("sA2"),()=>{lane(ctx,[{x:bx+bw,y:ym},{x:sx,y:ym}],LAYER.silver,0.6);vault(ctx,sx,sy,sw,sh,LAYER.silver,()=>null,"Silver","integrated");});
    withA(ctx,q("gA"),()=>{lane(ctx,[{x:sx+sw,y:ym},{x:gx,y:ym}],LAYER.gold,0.6);vault(ctx,gx,gy,gw,gh,LAYER.gold,()=>null,"Gold","presented and served");});
    if(o.flow){[[bx+bw,sx,LAYER.silver],[sx+sw,gx,LAYER.gold]].forEach(([x0,x1,c],k)=>{for(let n=0;n<3;n++){const u=((t*0.35+n/3+k*0.17)%1);mw_dot(ctx,x0,ym,x1,ym,u,c,0.9*Math.sin(u*Math.PI),5);}});}
    // silver: a normalised core, or a data vault
    const inY=sy+sh/2+40,lab=o.labels||{};
    withA(ctx,o.core||0,()=>{mw_coreGlyph(ctx,sx+sw*0.25,inY-24,0.84,{});T(ctx,lab.core||"normalised core",sx+sw*0.25,inY+86,{w:700,size:24,align:"center",color:rgba(MW_C,1)});});
    withA(ctx,Math.min(o.core||0,o.vault||0),()=>T(ctx,lab.or||"or",sx+sw*0.5,inY-14,{w:700,size:24,align:"center",color:rgba(SOFT,1)}));
    withA(ctx,o.vault||0,()=>{mw_vaultGlyph(ctx,sx+sw*0.76,inY-10,0.84,{extra:o.extra||0});T(ctx,lab.vault||"data vault",sx+sw*0.76,inY+86,{w:700,size:24,align:"center",color:rgba(MW_V,1)});});
    // gold: stars for people, wide tables for tools
    withA(ctx,o.star||0,()=>{mw_starGlyph(ctx,gx+gw*0.25,inY-24,0.94,{});T(ctx,lab.star||"stars",gx+gw*0.25,inY+86,{w:700,size:24,align:"center",color:rgba(MW_S,1)});T(ctx,lab.people||"for people",gx+gw*0.25,inY+114,{w:600,size:19,align:"center",color:rgba(SOFT,1)});});
    withA(ctx,o.wide||0,()=>{mw_wideGlyph(ctx,gx+gw*0.74,inY-24,1.02,{newCol:o.newCol});T(ctx,lab.wide||"wide tables",gx+gw*0.74,inY+86,{w:700,size:24,align:"center",color:rgba(MW_W,1)});T(ctx,lab.tools||"for tools",gx+gw*0.74,inY+114,{w:600,size:19,align:"center",color:rgba(SOFT,1)});});
    // the semantic layer, on top of gold, and the tools that ask it
    const ly=gy-46;mw_sem(ctx,gx,ly,gw,t,o.sem||0,{h:40,size:20,label:o.semLabel||"semantic layer · each measure defined once"});
    withA(ctx,o.tools||0,()=>{const tx=[gx+110,gx+gw/2,gx+gw-110],ty=196;mw_dashIcon(ctx,tx[0],ty,0.8,1,t);mw_sheetIcon(ctx,tx[1],ty,0.8,1);mw_genie(ctx,tx[2],ty-6,t,1,{r:22,chip:false});
      (lab.toolNames||["dashboard","spreadsheet","Genie"]).forEach((s,i)=>T(ctx,s,tx[i],ty-54,{w:700,size:21,align:"center",color:rgba(SOFT,1)}));
      tx.forEach((x,i)=>{mw_line(ctx,x,ty+38,x,ly-18,[200,236,255],0.5,{lw:1.6,dash:[5,7],blur:0});if(o.flow){const u=((t*0.5+i*0.31)%1);mw_dot(ctx,x,ty+38,x,ly-18,u,[200,236,255],0.9*Math.sin(u*Math.PI),4);}});});});}

/* ---------- pictures for the labs and the scenarios (site/assets/many-ways-to-read/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW). Every word comes from FW.vis, so the
   Spanish pages show Spanish. Lab pictures (960 wide) show at about 45%, so their text is 22 px or more; scenario pictures
   (600 wide) show at about 70%, so theirs is 18 px or more. */
const mw_fit=(c,w,h,bw,bh)=>{const k=Math.min(w/bw,h/bh);c.translate((w-bw*k)/2,(h-bh*k)/2);c.scale(k,k);return k;};
const mwV=L=>(L&&L.vis)||{};
const mw_fs=(c,s,size,wt,max,min)=>{let z=size;while(z>(min||16)&&tw(c,s||"",z,wt)>max)z--;return z;};
const LV={
  // Same question, four shapes: the chosen shape, large, and how much work the question takes in it
  shapes:(c,w,h,st,L)=>{const V=mwV(L),k=st.pick||"core",sh=MW_SHAPES[k],lab=(L.labs.find(x=>x.kind==="pick")||{w:{opts:[]}}).w.opts.find(o=>o[0]===k);c.save();mw_fit(c,w,h,960,420);
    tag(c,480,38,V.q||"",TRUST,{align:"center",size:24});
    mw_panel(c,40,82,500,318,sh[1],{hi:0.6});sh[2](c,290,218,1.45,{});T(c,lab?lab[1]:"",290,378,{w:800,size:30,align:"center",color:rgba(sh[1],1)});
    const J={core:5,vault:8,star:3,wide:0}[k],ok=J===0,col=ok?GOOD:J>4?BAD:TRUST;
    T(c,ok?"1":String(J),740,200,{w:800,size:96,align:"center",color:rgba(col,1)});T(c,ok?(V.filter||""):(V.joins||""),740,248,{w:700,size:28,align:"center",color:rgba(col,1)});
    const n=ok?1:J,bw=34,gap=10,x0=740-(n*(bw+gap)-gap)/2;for(let i=0;i<n;i++){const x=x0+i*(bw+gap);c.strokeStyle=rgba(col,0.9);c.lineWidth=2.4;rr(c,x,300,bw,26,6);c.stroke();if(i<n-1){c.beginPath();c.moveTo(x+bw,313);c.lineTo(x+bw+gap,313);c.stroke();}}
    c.restore();},
  // Add a source: what the short-course platform changes in each shape, step by step
  source:(c,w,h,st,L)=>{const V=mwV(L),s=st.step||0;c.save();mw_fit(c,w,h,960,420);
    const items=[["core",MW_C,mw_coreGlyph,128,V.coreRes,BAD],["vault",MW_V,mw_vaultGlyph,360,V.vaultRes,GOOD],["star",MW_S,mw_starGlyph,592,V.starRes,TRUST],["wide",MW_W,mw_wideGlyph,824,V.wideRes,TRUST]];
    const on=[null,"core","vault","star","wide",null][Math.min(5,s)];
    withA(c,s===0||s===5?1:0.45,()=>{mw_source(c,30,18,"short",{w:400,h:76,isNew:true,name:V.srcName,newLabel:V.isNew,newSize:18});});
    withA(c,s===0?1:0.45,()=>{arrowTo(c,440,56,540,56,MW_SC,0.8,{head:12});glass(c,550,18,210,76,16,LAYER.bronze,{glow:s===0?20:8,ea:0.9,fill:"rgba(26,16,10,0.92)"});T(c,V.bronze||"",655,66,{w:800,size:26,align:"center",color:rgba(LAYER.bronze,1)});});
    items.forEach(([k,col,f,x,res,rc],i)=>{const act=on===k||(s===5&&k==="vault"),shown=s>=i+1;withA(c,act?1:(s===5?0.55:0.4),()=>{mw_panel(c,x-112,126,224,210,col,{hi:act?0.8:0});
      f(c,x,222,0.74,{extra:k==="vault"&&shown?1:0,newCol:k==="wide"&&shown?9:null,cols:k==="wide"&&shown?10:9});
      T(c,V[k]||"",x,322,{w:800,size:mw_fs(c,V[k],22,800,200),align:"center",color:rgba(col,1)});
      if(shown){tag(c,x,372,res||"",rc,{align:"center",size:22});if(k==="vault")mw_ok(c,x+100,138,16,GOOD,1);}});});
    c.restore();},
  // Where does each shape live? Four places, and the items put in each
  where:(c,w,h,st,L)=>{const V=mwV(L),lab=L.labs.find(x=>x.kind==="sort"),pick=st.pick||{};c.save();mw_fit(c,w,h,960,420);
    const Z={bronze:[20,150,220,LAYER.bronze,V.bronze],silver:[256,150,330,LAYER.silver,V.silver],gold:[602,150,338,LAYER.gold,V.gold]};
    Object.keys(Z).forEach(k=>{const[x,y,zw,col,nm]=Z[k];glass(c,x,y,zw,258,18,col,{glow:14,ea:0.8,fill:"rgba(8,12,22,0.9)"});T(c,nm||"",x+zw/2,y+36,{w:800,size:26,align:"center",color:rgba(col,1)});});
    const nSem=lab.w.items.filter((it,i)=>pick[i]==="sem").length,semH=Math.max(110,87+42*(nSem-1));
    mw_sem(c,602,14+semH/2,338,1.2,1,{h:semH,col:[200,236,255]});T(c,V.sem||"",771,42,{w:800,size:22,align:"center",color:"rgba(230,246,255,0.98)"});
    const by={};lab.w.items.forEach((it,i)=>{const b=pick[i];if(!b)return;const n=by[b]=(by[b]||0)+1,ok=it.b===b,col=st.checked?(ok?GOOD:BAD):INK,txt=it.s||it.t;
      let x,y;if(b==="sem"){x=771;y=72+(n-1)*42;}else{const[zx,zy,zw]=Z[b];x=zx+zw/2;y=zy+80+(n-1)*50;}
      const cw=b==="bronze"?210:320,fz=mw_fs(c,txt,22,700,cw-30),tw_=Math.min(cw,tw(c,txt,fz,700)+30);glass(c,x-tw_/2,y-19,tw_,38,19,col,{glow:8,ea:0.9,fill:"rgba(7,12,24,0.96)"});T(c,txt,x,y+fz*0.36,{w:700,size:fz,align:"center",color:rgba(col,1)});});
    c.restore();},
  // scenarios
  audit:(c,w,h,st,L)=>{const V=mwV(L);tag(c,300,34,V.whoWhen||"",TRUST,{align:"center",size:20});c.save();c.translate(95,70);c.scale(1.3,1.3);
    mw_sat(c,0,0,320,V.statusNew||"","sis","2026-03-03 02:10",{srcHi:1,hi:0.5});mw_sat(c,0,86,320,V.statusOld||"","sis","2026-02-10 02:08",{});c.restore();},
  twostars:(c,w,h,st,L)=>{const V=mwV(L);mw_fact(c,150,70,V.awards||"","",{w:270,h:84,bare:true});mw_fact(c,450,70,V.fees||"","",{w:270,h:84,bare:true});
    mw_line(c,150,112,150,190,MW_S,0.7);mw_line(c,450,112,450,190,MW_S,0.7);
    mw_dim(c,150,236,V.learner||"",{shared:true,w:250,sub:"L-20417",subSize:20});mw_dim(c,450,236,V.learner||"",{shared:true,w:250,sub:"F-88213",subSize:20,subCol:EDGE_});T(c,"≠",300,252,{w:800,size:44,align:"center",color:rgba(BAD,1)});},
  twice:(c,w,h,st,L)=>{const V=mwV(L),cols=[[V.learner||"",150],[V.creditSoFar||"",250]];
    mw_wide(c,40,40,{rh:54,cols,rows:[["Aisha K.","45 "+(V.of||"")+" 60"]],name:V.learners||"",colHi:j=>j===1?1:0,hiCol:BAD});
    mw_wide(c,40,198,{rh:54,cols,rows:[["Aisha K.","50 "+(V.of||"")+" 60"]],name:V.courseProgress||"",colHi:j=>j===1?1:0,hiCol:BAD});T(c,"≠",520,196,{w:800,size:64,align:"center",color:rgba(BAD,1)});},
  vaultq:(c,w,h,st,L)=>{const V=mwV(L);mw_vaultGlyph(c,300,190,1.55,{});const pts=[[70,110],[150,130],[160,250],[300,120],[330,210],[450,130],[470,260],[240,270],[520,200]];
    c.save();c.strokeStyle=rgba(EDGE_,0.85);c.lineWidth=3;c.setLineDash([8,6]);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.restore();
    tag(c,300,40,V.query||"",EDGE_,{align:"center",size:22});},
  monthly:(c,w,h,st,L)=>{const V=mwV(L);(V.months||[]).forEach((m,i)=>{const x=35+i*110;mw_line(c,x+45,86,300,160,MW_SC,0.45,{lw:1.6,dash:[5,6],blur:0});glass(c,x,30,90,56,12,MW_SC,{glow:8,ea:0.8,fill:"rgba(7,12,24,0.92)"});T(c,m,x+45,66,{w:800,size:22,align:"center",color:rgba(MW_SC,1)});});
    mw_vaultGlyph(c,300,208,1.25,{extra:1});},
  copies:(c,w,h,st,L)=>{const V=mwV(L);(V.faculties||[]).forEach((f,i)=>{const x=80+i*146;mw_starGlyph(c,x,150,0.6,{});T(c,f,x,236,{w:800,size:20,align:"center",color:rgba(MW_S,1)});T(c,(V.copy||"")+" "+(i+1),x,70,{w:700,size:18,align:"center",color:rgba(SOFT,1)});});
    tag(c,300,286,V.fourStars||"",EDGE_,{align:"center",size:20});},
  fashion:(c,w,h,st,L)=>{mw_panel(c,30,30,240,210,MW_S,{});mw_starGlyph(c,150,135,0.85,{});mw_panel(c,330,30,240,210,MW_W,{});mw_wideGlyph(c,450,135,0.82,{});arrowTo(c,276,135,322,135,EDGE_,0.9,{head:14,lw:3});
    tag(c,300,284,(mwV(L).modern)||"",EDGE_,{align:"center",size:20});},
  order:(c,w,h,st,L)=>{const V=mwV(L),S_=[[V.srcShort,MW_SC],[V.bronze,LAYER.bronze],[V.silver,LAYER.silver],[V.gold,LAYER.gold],[V.sem,[200,236,255]]];
    S_.forEach(([s,col],i)=>{const x=14+i*92,y=30+i*57,ww=Math.max(120,tw(c,s||"",19,800)+34);if(i<4)arrowTo(c,x+50,y+42,x+120,y+62,col,0.7,{head:10,bend:0.2});glass(c,x,y,ww,42,21,col,{glow:10,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,s||"",x+ww/2,y+28,{w:800,size:19,align:"center",color:rgba(col,1)});});}
};
