/* ===== Built to write, built to read: the film's own pictures =====
   The merchants' books of 1494 (a journal written in time order, a ledger read by account), tables with their keys, a transaction,
   a signed document, a star with its facts and dimensions, a dimension that keeps its history, and the two shapes side by side.
   Blue is the shape built to write; green is the shape built to read; warm ink is 1494. The labs and the scenarios draw with these too. */
const BW_W=[110,190,255],BW_R=[120,225,170],BW_INK=[240,196,120],BW_AMB=[255,190,90];
const BW_FAC={sci:{n:"Science",c:[255,176,110]},eng:{n:"Engineering",c:[178,158,255]},arts:{n:"Arts",c:[240,130,180]}};
const BW_TEN=[10480,10760,10990,11120,11300,11520,11640,11730,11810,11890];   // credentials awarded, 2017 to 2026: 113,240 in ten years

/* ---------- ink, paper and a quill: 1494 ----------
   Natural things are drawn soft: curved, uneven edges, a light side and a shadow side, tapered strokes, and a little motion. */
// handwriting: Manrope, slanted, in brown ink, written out as p goes from 0 to 1; bleed (0..1) spreads fresh ink, which then settles
function bw_ink(ctx,s,x,y,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;ctx.save();ctx.font="italic "+(o.w||600)+" "+(o.size||24)+"px "+FT.sans;ctx.textAlign=o.align||"left";
  const bl=o.bleed||0,c=o.color||"rgba(64,38,20,0.92)";if(bl>0.01){ctx.shadowColor=c;ctx.shadowBlur=7*bl;ctx.fillStyle=c;ctx.globalAlpha*=0.75+0.25*(1-bl);}else ctx.fillStyle=c;
  ctx.fillText(typeOn(s,p),x,y);ctx.restore();}
function bw_inkW(ctx,s,size,w){ctx.save();ctx.font="italic "+(w||600)+" "+size+"px "+FT.sans;const m=ctx.measureText(s).width;ctx.restore();return m;}
// fresh ink: 1 while it's being written, settling over the next second
const bw_fresh=(t,t0,d)=>t<t0?0:t<t0+d?1:clamp(1-(t-t0-d)/1.0,0,1);
// an edge that isn't quite straight: from (x0,y0) to (x1,y1) through a few soft wobbles, as a path continuing the current one
function bw_edge(ctx,x0,y0,x1,y1,amp,seed,bow){const n=6,dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;let px=x0,py=y0;
  for(let i=1;i<=n;i++){const u=i/n,w=(i<n?(hash(i,seed)-0.5)*2*amp:0)+(bow||0)*Math.sin(Math.PI*u),qx=x0+dx*u+nx*w,qy=y0+dy*u+ny*w,um=(i-0.5)/n,wm=(hash(i+20,seed)-0.5)*amp+(bow||0)*Math.sin(Math.PI*um);
    ctx.quadraticCurveTo(x0+dx*um+nx*wm,y0+dy*um+ny*wm,qx,qy);px=qx;py=qy;}}
// a sheet of paper, or parchment: uneven edges, a light side and a shadow side, and a corner that lifts and settles
function bw_paper(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const t=o.t||0,seed=o.seed||3,cu=(o.curl==null?26:o.curl)*(0.8+0.2*Math.sin(t*0.9+seed));
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
    const path=()=>{ctx.beginPath();ctx.moveTo(0,0);bw_edge(ctx,0,0,w,0,1.6,seed,-2);bw_edge(ctx,w,0,w,h-cu,1.8,seed+1,1.5);ctx.quadraticCurveTo(w-cu*0.35,h-cu*0.35,w-cu,h);bw_edge(ctx,w-cu,h,0,h,1.6,seed+2,-1.5);bw_edge(ctx,0,h,0,0,1.8,seed+3,1.2);ctx.closePath();};
    ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=30;ctx.shadowOffsetY=12;path();ctx.fillStyle=o.base||"#ece0c6";ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,250,236,0.40)");g.addColorStop(0.55,"rgba(255,245,225,0)");g.addColorStop(1,"rgba(110,80,40,0.22)");path();ctx.fillStyle=g;ctx.fill();
    const e=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*0.3,w/2,h/2,Math.max(w,h)*0.75);e.addColorStop(0,"rgba(120,90,50,0)");e.addColorStop(1,"rgba(120,90,50,0.16)");path();ctx.fillStyle=e;ctx.fill();
    if(o.lines){ctx.save();path();ctx.clip();ctx.strokeStyle=o.lineCol||"rgba(90,120,170,0.16)";ctx.lineWidth=1.2;for(let yy=o.lines;yy<h-14;yy+=o.lh||40){ctx.beginPath();ctx.moveTo(18,yy);ctx.quadraticCurveTo(w/2,yy+1.5,w-18,yy);ctx.stroke();}ctx.restore();}
    // the lifted corner: its underside, lit, with a soft shadow under it
    ctx.fillStyle="rgba(0,0,0,0.18)";ctx.beginPath();ctx.moveTo(w-cu,h);ctx.quadraticCurveTo(w-cu*0.2,h-cu*0.1,w,h-cu);ctx.quadraticCurveTo(w-cu*0.1,h+cu*0.15,w-cu,h);ctx.fill();
    const cg=ctx.createLinearGradient(w-cu,h-cu,w,h);cg.addColorStop(0,"#fbf3e0");cg.addColorStop(1,"#cdbb96");ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(w-cu,h);ctx.quadraticCurveTo(w-cu*0.62,h-cu*0.62,w,h-cu);ctx.quadraticCurveTo(w-cu*0.55,h-cu*0.2,w-cu,h);ctx.fill();
    ctx.restore();});}
// a book, open: one page or a spread of two, on a soft leather cover; the pages bow towards the spine, and a corner breathes
function bw_book(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const t=o.t||0,n=o.pages||1,pw=w/n;withA(ctx,a,()=>{ctx.save();
  // the cover: leather, lit from the upper left, with a stitched edge
  const cv=()=>{ctx.beginPath();ctx.moveTo(x-12,y-6);bw_edge(ctx,x-12,y-6,x+w+14,y-8,1.2,11,-3);bw_edge(ctx,x+w+14,y-8,x+w+16,y+h+18,1.2,12,2);bw_edge(ctx,x+w+16,y+h+18,x-14,y+h+18,1.2,13,-3);bw_edge(ctx,x-14,y+h+18,x-12,y-6,1.2,14,2);ctx.closePath();};
  ctx.shadowColor="rgba(0,0,0,0.65)";ctx.shadowBlur=36;ctx.shadowOffsetY=14;cv();ctx.fillStyle="#3c2213";ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const lg=ctx.createLinearGradient(x,y,x+w,y+h);lg.addColorStop(0,"rgba(150,90,50,0.55)");lg.addColorStop(0.5,"rgba(90,50,26,0.2)");lg.addColorStop(1,"rgba(20,10,4,0.5)");cv();ctx.fillStyle=lg;ctx.fill();
  ctx.strokeStyle="rgba(214,160,96,0.35)";ctx.lineWidth=1.4;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(x-4,y+2);ctx.quadraticCurveTo(x+w/2,y-4,x+w+6,y);ctx.lineTo(x+w+8,y+h+10);ctx.quadraticCurveTo(x+w/2,y+h+14,x-6,y+h+10);ctx.closePath();ctx.stroke();ctx.setLineDash([]);
  // the page block under the top pages
  for(let k=3;k>=1;k--){ctx.fillStyle=k%2?"#cdb88e":"#e2d2ae";ctx.beginPath();ctx.moveTo(x+(n===2?0:4),y+k*2);ctx.quadraticCurveTo(x+w/2,y+k*2-(n===2?10:3),x+w+k*2,y+k*2);ctx.lineTo(x+w+k*2,y+h+k*2.4);ctx.quadraticCurveTo(x+w/2,y+h+k*2.4-(n===2?6:2),x+(n===2?-k*2:4),y+h+k*2.4);ctx.closePath();ctx.fill();}
  for(let i=0;i<n;i++){const px=x+i*pw,sp=n===2,lift=sp?10:4,inner=sp?(i?px:px+pw):null;
    const pg=()=>{ctx.beginPath();if(sp){if(i===0){ctx.moveTo(px+pw,y+6);ctx.bezierCurveTo(px+pw-40,y-lift,px+40,y-lift*0.4,px,y);bw_edge(ctx,px,y,px-2,y+h,1.4,20+i,-1);ctx.bezierCurveTo(px+40,y+h-lift*0.2,px+pw-40,y+h-lift*0.8,px+pw,y+h+4);}
        else{ctx.moveTo(px,y+6);ctx.bezierCurveTo(px+40,y-lift,px+pw-40,y-lift*0.4,px+pw,y);bw_edge(ctx,px+pw,y,px+pw+2,y+h,1.4,30,1);ctx.bezierCurveTo(px+pw-40,y+h-lift*0.2,px+40,y+h-lift*0.8,px,y+h+4);}}
      else{ctx.moveTo(px,y+2);ctx.bezierCurveTo(px+pw*0.3,y-lift,px+pw*0.7,y-lift*0.5,px+pw,y);bw_edge(ctx,px+pw,y,px+pw+1,y+h,1.4,40,1);ctx.bezierCurveTo(px+pw*0.7,y+h-lift*0.3,px+pw*0.3,y+h-lift*0.6,px,y+h+2);}
      ctx.closePath();};
    const g=ctx.createLinearGradient(px,y,px+pw,y+h);g.addColorStop(0,"#f3e7cb");g.addColorStop(0.6,"#e8d8b4");g.addColorStop(1,"#d3bd93");pg();ctx.fillStyle=g;ctx.fill();
    ctx.save();pg();ctx.clip();
    if(sp){const gx=i?px:px+pw-60,sg=ctx.createLinearGradient(gx,0,gx+60,0);sg.addColorStop(i?0:1,"rgba(70,40,14,0.38)");sg.addColorStop(i?1:0,"rgba(70,40,14,0)");ctx.fillStyle=sg;ctx.fillRect(gx,y-20,60,h+40);}
    else{const sg=ctx.createLinearGradient(px,0,px+40,0);sg.addColorStop(0,"rgba(70,40,14,0.32)");sg.addColorStop(1,"rgba(70,40,14,0)");ctx.fillStyle=sg;ctx.fillRect(px,y-20,40,h+40);}
    for(let k=0;k<22;k++){ctx.fillStyle="rgba(140,100,50,"+(0.02+0.035*hash(k,i+7))+")";ctx.beginPath();ctx.ellipse(px+hash(k,i+3)*pw,y+hash(k,i+5)*h,6+hash(k,i+9)*22,4+hash(k,i+11)*14,hash(k,i)*3,0,TAU);ctx.fill();}
    ctx.strokeStyle="rgba(120,80,40,0.15)";ctx.lineWidth=1.1;for(let yy=y+(o.top||96);yy<y+h-16;yy+=(o.lh||40)){ctx.beginPath();ctx.moveTo(px+22,yy);ctx.quadraticCurveTo(px+pw/2,yy+(sp?2:1),px+pw-22,yy);ctx.stroke();}
    ctx.strokeStyle="rgba(170,60,40,0.22)";const mx=px+(o.margin||70);ctx.beginPath();ctx.moveTo(mx,y+10);ctx.quadraticCurveTo(mx+1.5,y+h/2,mx,y+h-10);ctx.stroke();ctx.restore();
    // the outer bottom corner lifts a little, and settles
    const ox=sp&&i===0?px:px+pw,dir=sp&&i===0?1:-1,cu=16+5*Math.sin(t*0.8+i*2);
    const cg=ctx.createLinearGradient(ox,y+h-cu,ox+dir*cu,y+h);cg.addColorStop(0,"#fbf2dc");cg.addColorStop(1,"#c7b088");ctx.fillStyle="rgba(0,0,0,0.14)";ctx.beginPath();ctx.moveTo(ox+dir*cu,y+h+2);ctx.quadraticCurveTo(ox+dir*cu*0.1,y+h+cu*0.1,ox,y+h-cu);ctx.lineTo(ox,y+h+3);ctx.closePath();ctx.fill();
    ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(ox+dir*cu,y+h+2);ctx.quadraticCurveTo(ox+dir*cu*0.62,y+h-cu*0.62,ox,y+h-cu);ctx.quadraticCurveTo(ox+dir*cu*0.25,y+h-cu*0.3,ox+dir*cu,y+h+2);ctx.fill();}
  if(n===2){ctx.strokeStyle="rgba(60,34,14,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+pw,y+4);ctx.quadraticCurveTo(x+pw+1,y+h/2,x+pw,y+h+4);ctx.stroke();}
  if(o.title)bw_ink(ctx,o.title,x+(o.titleX||40),y+56,{size:36,w:800,color:"rgba(90,40,20,0.95)"});
  ctx.restore();});}
// a quill, its nib at (x,y), leaning up and to the right: a tapered shaft, a soft vane lit on one side, and fine barbs; it sways as it writes
function bw_quill(ctx,x,y,s,a,t){if(a<=0.01)return;t=t||0;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*7)*0.025+Math.sin(t*1.3)*0.02);ctx.scale(s,s);
  const P0=[0,0],P1=[46,-118],P2=[186,-306],at_=u=>[(1-u)*(1-u)*P0[0]+2*(1-u)*u*P1[0]+u*u*P2[0],(1-u)*(1-u)*P0[1]+2*(1-u)*u*P1[1]+u*u*P2[1]],
    nrm=u=>{const dx=2*(1-u)*(P1[0]-P0[0])+2*u*(P2[0]-P1[0]),dy=2*(1-u)*(P1[1]-P0[1])+2*u*(P2[1]-P1[1]),L=Math.hypot(dx,dy)||1;return[-dy/L,dx/L];};
  glow(ctx,96,-170,130,BW_INK,0.12);
  const fl=Math.sin(t*2.1)*0.06;
  // the vane: wider on one side than the other, curving to the tip
  const side=(sgn,wmax,u0)=>{ctx.beginPath();const A=[];for(let i=0;i<=24;i++){const u=u0+(1-u0)*i/24,q=at_(u),nn=nrm(u),env=Math.pow(Math.sin(Math.PI*Math.min(1,(u-u0)/(1-u0)*0.98)),0.7)*(1-0.35*(u-u0)),wv=wmax*env*(1+fl*sgn);A.push([q[0]+nn[0]*wv*sgn,q[1]+nn[1]*wv*sgn]);}
    const q0=at_(u0);ctx.moveTo(q0[0],q0[1]);for(let i=1;i<A.length-1;i++){const m=[(A[i][0]+A[i+1][0])/2,(A[i][1]+A[i+1][1])/2];ctx.quadraticCurveTo(A[i][0],A[i][1],m[0],m[1]);}const e=at_(1);ctx.lineTo(e[0],e[1]);
    for(let i=24;i>=0;i--){const q=at_(u0+(1-u0)*i/24);ctx.lineTo(q[0],q[1]);}ctx.closePath();};
  // its shadow on the page first
  ctx.save();ctx.shadowColor="rgba(40,24,10,0.38)";ctx.shadowBlur=14;ctx.shadowOffsetX=16;ctx.shadowOffsetY=12;ctx.fillStyle="rgba(0,0,0,0.01)";side(-1,40,0.2);ctx.fill();side(1,24,0.26);ctx.fill();ctx.restore();
  let g=ctx.createLinearGradient(-20,-280,160,-40);g.addColorStop(0,"#fffaf0");g.addColorStop(1,"#d2bf98");side(-1,40,0.2);ctx.fillStyle=g;ctx.fill();
  g=ctx.createLinearGradient(40,-300,200,-60);g.addColorStop(0,"#e6d6b4");g.addColorStop(1,"#94805c");side(1,24,0.26);ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle="rgba(120,90,50,0.55)";ctx.lineWidth=1.3;side(-1,40,0.2);ctx.stroke();side(1,24,0.26);ctx.stroke();
  // fine barbs, and a split in the vane
  ctx.lineCap="round";for(let i=0;i<16;i++){const u=0.26+i*0.045,q=at_(u),nn=nrm(u),sg=i%2?1:-1,len=(sg<0?26:15)*Math.sin(Math.PI*(u-0.2)/0.8);
    ctx.strokeStyle="rgba(150,120,80,"+(0.25+0.2*hash(i,4))+")";ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.quadraticCurveTo(q[0]+nn[0]*sg*len*0.6+6,q[1]+nn[1]*sg*len*0.6-4,q[0]+nn[0]*sg*len+10,q[1]+nn[1]*sg*len-12);ctx.stroke();}
  const sq=at_(0.62),sn=nrm(0.62);ctx.strokeStyle="rgba(60,40,20,0.45)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(sq[0],sq[1]);ctx.quadraticCurveTo(sq[0]-sn[0]*14+4,sq[1]-sn[1]*14-4,sq[0]-sn[0]*26+10,sq[1]-sn[1]*26-10);ctx.stroke();
  // the shaft: thick near the hand, thin at both ends
  ctx.beginPath();const L=[],R=[];for(let i=0;i<=30;i++){const u=i/30,q=at_(u),nn=nrm(u),wd=0.6+3.4*Math.sin(Math.PI*Math.min(1,u*1.25))*(1-u*0.6);L.push([q[0]+nn[0]*wd,q[1]+nn[1]*wd]);R.push([q[0]-nn[0]*wd,q[1]-nn[1]*wd]);}
  ctx.moveTo(L[0][0],L[0][1]);L.forEach(q=>ctx.lineTo(q[0],q[1]));R.reverse().forEach(q=>ctx.lineTo(q[0],q[1]));ctx.closePath();g=ctx.createLinearGradient(0,-150,20,-140);g.addColorStop(0,"#b89868");g.addColorStop(1,"#6e5230");ctx.fillStyle=g;ctx.fill();
  // the nib, dark with ink, and a bead of ink at its tip
  ctx.fillStyle="#24160c";ctx.beginPath();ctx.moveTo(-1,1);ctx.quadraticCurveTo(4,-10,10,-22);ctx.quadraticCurveTo(14,-18,16,-16);ctx.quadraticCurveTo(8,-8,-1,1);ctx.fill();
  ctx.fillStyle="rgba(40,24,12,"+(0.5+0.3*Math.sin(t*3))+")";ctx.beginPath();ctx.arc(0,1,2.4,0,TAU);ctx.fill();
  ctx.restore();});}
// a parchment plate with a title, for the book the scene comes from
function bw_plate(ctx,x,y,s,sub,a,k,t){if(a<=0.01)return;k=k||1;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(k,k);const w=Math.max(bw_inkW(ctx,s,40,800),sub?tw(ctx,sub,22,600):0)+90,h=sub?118:78;
  bw_paper(ctx,-w/2,-h/2,w,h,{t:t||0,seed:7,curl:14,base:"#e8d6ae"});
  bw_ink(ctx,s,0,sub?-6:14,{size:40,w:800,align:"center",color:"rgba(80,36,18,0.95)"});if(sub)T(ctx,sub,0,34,{w:600,size:22,align:"center",color:"rgba(90,60,36,0.9)"});ctx.restore();});}
// Venice, in silhouette, low on the horizon, with the lagoon moving under it
function bw_venice(ctx,y,a,t){if(a<=0.01)return;t=t||0;withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(40,24,14,0.9)";ctx.beginPath();ctx.moveTo(0,y+40);
  const B=[[0,30],[120,20],[160,-30],[200,-30],[210,20],[330,10],[360,-60],[372,-160],[384,-170],[396,-160],[408,-60],[430,10],[520,0],[540,-40],[560,-70],[600,-80],[640,-70],[660,-40],[700,0],[760,-20],[800,-20],[820,10],
    [980,20],[1040,-10],[1060,-50],[1090,-60],[1120,-50],[1140,-10],[1300,10],[1340,-40],[1350,-110],[1362,-118],[1374,-110],[1384,-40],[1420,10],[1560,0],[1600,-30],[1680,-30],[1700,10],[1920,20],[1920,60]];
  B.forEach(([bx,by])=>ctx.lineTo(bx,y+by));ctx.lineTo(1920,1080);ctx.lineTo(0,1080);ctx.closePath();ctx.fill();
  [[600,-80,40],[1090,-60,30]].forEach(([bx,by,r])=>{ctx.beginPath();ctx.arc(bx,y+by+6,r,Math.PI,TAU);ctx.fill();});
  for(let k=0;k<6;k++){const yy=y+52+k*16;ctx.strokeStyle="rgba(255,200,130,"+(0.07-0.009*k)+")";ctx.lineWidth=1.6;ctx.beginPath();for(let xx=0;xx<=1920;xx+=40){const wv=Math.sin(xx*0.012+t*0.7+k*1.7)*3+Math.sin(xx*0.031-t*0.5+k)*1.5;xx?ctx.lineTo(xx,yy+wv):ctx.moveTo(xx,yy+wv);}ctx.stroke();}
  ctx.restore();});}

// a printed certificate, on paper: the holder's name as the data had it; o.bad rings the holder's line
function bw_cert(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=Math.round(w*0.7);if(a<=0.01)return h;withA(ctx,a,()=>{
  bw_paper(ctx,x,y,w,h,{t:o.t||0,seed:5,curl:22,base:"#f2ead6"});ctx.strokeStyle="rgba(150,120,60,0.55)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+16,y+16);bw_edge(ctx,x+16,y+16,x+w-16,y+16,0.6,51,0);bw_edge(ctx,x+w-16,y+16,x+w-16,y+h-30,0.6,52,0);bw_edge(ctx,x+w-16,y+h-30,x+16,y+h-16,0.6,53,0);bw_edge(ctx,x+16,y+h-16,x+16,y+16,0.6,54,0);ctx.stroke();
  T(ctx,"Certificate",x+w/2,y+66,{w:800,size:36,align:"center",color:"rgba(60,44,30,0.95)"});
  [["issued by",o.issuer],["awarded to",o.holder],["for",o.claim],["on",o.date]].forEach(([k,v],i)=>{const yy=y+128+i*50;T(ctx,k,x+40,yy,{w:600,size:21,color:"rgba(110,86,54,0.95)"});T(ctx,v,x+190,yy,{w:800,size:27,color:"rgba(52,40,30,0.95)"});});
  waxSeal(ctx,x+w-70,y+h-70,34,WAX,1,1);
  if(o.bad>0.01)withA(ctx,o.bad,()=>{ctx.strokeStyle=rgba(BAD,0.95);ctx.lineWidth=3.4;ctx.beginPath();ctx.ellipse(x+190+tw(ctx,o.holder,27,800)/2,y+178-9,tw(ctx,o.holder,27,800)/2+26,26,-0.02,0,TAU);ctx.stroke();});});
  return h;}

/* ---------- the journal and the ledger ---------- */
// four entries, as they happened: date, what happened, ducats, the account debited, the account credited
const BW_J=[["8 Nov","Cloth bought for cash",40,"Cloth","Cash"],["9 Nov","Spices sold for cash",25,"Cash","Spices"],["11 Nov","Spices bought for cash",30,"Spices","Cash"],["12 Nov","Cloth sold for cash",55,"Cash","Cloth"]];
const BW_JX=100,BW_JY=180,BW_JW=620,BW_JH=570;         // the journal
const BW_LX=790,BW_LY=180,BW_LW=1030,BW_LH=570;        // the ledger, a spread of two pages
// where each account sits on the ledger's pages
const BW_ACC={Cloth:{x:BW_LX+36,y:BW_LY+112},Spices:{x:BW_LX+36,y:BW_LY+344},Cash:{x:BW_LX+BW_LW/2+30,y:BW_LY+112}};
function bw_entryY(i){return BW_JY+132+i*112;}
// the ledger line an entry lands on: side 0 is debit, 1 is credit; k counts the lines already on that side of the account
function bw_cell(acc,side,k){const A=BW_ACC[acc];return{x:A.x+(side?248:14),r:A.x+(side?448:214),y:A.y+108+k*40};}
function bw_postings(){const L=[];const cnt={};BW_J.forEach((e,i)=>{[[e[3],0],[e[4],1]].forEach(([acc,side])=>{const key=acc+side;cnt[key]=cnt[key]||0;L.push({i,acc,side,k:cnt[key]++,amt:e[2],date:e[0]});});});return L;}
const BW_POST=bw_postings();

/* ---------- today: awards written one by one, and ten years read at once ---------- */
function bw_awardTile(ctx,x,y,w,h,a,flash){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,8,BW_W,{glow:6+14*(flash||0),ea:0.5+0.5*(flash||0),fill:"rgba(8,16,34,0.92)"});
  ctx.fillStyle=rgba(TRUST,0.9);ctx.beginPath();ctx.arc(x+16,y+h/2-4,7,0,TAU);ctx.fill();ctx.fillRect(x+12,y+h/2+1,3,10);ctx.fillRect(x+18,y+h/2+1,3,10);
  ctx.fillStyle=rgba(INK,0.55);rr(ctx,x+30,y+h/2-8,w-42,5,2);ctx.fill();ctx.fillStyle=rgba(SOFT,0.35);rr(ctx,x+30,y+h/2+4,(w-42)*0.6,5,2);ctx.fill();
  if(flash)glow(ctx,x+w/2,y+h/2,w*0.8,BW_W,0.35*flash);});}
// a slab of one year's data, drawn in depth; lit (0..1) when it's being read
function bw_slab(ctx,x,y,w,d,col,a,label,lit){if(a<=0.01)return;withA(ctx,a,()=>{const th=16,sk=70;lit=lit||0;
  ctx.fillStyle=rgba(mix([14,26,30],col,0.18+0.35*lit),0.95);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w+sk,y-d);ctx.lineTo(x+sk,y-d);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(col,0.45+0.5*lit);ctx.lineWidth=1.6;ctx.stroke();
  ctx.fillStyle=rgba(mix([8,16,20],col,0.10+0.3*lit),0.95);ctx.fillRect(x,y,w,th);ctx.strokeRect(x,y,w,th);
  for(let i=0;i<14;i++){ctx.fillStyle=rgba(col,(0.15+0.55*lit)*(0.5+0.5*hash(i,label.length)));ctx.fillRect(x+sk*0.5+14+i*(w-40)/14,y-d*0.5-3,(w-40)/14-6,6);}
  if(lit>0.02)glow(ctx,x+w/2+sk/2,y-d/2,w*0.55,col,0.18*lit);
  T(ctx,label,x+w+sk+20,y-d/2+7,{f:"mono",w:500,size:18,color:rgba(col,0.6+0.4*lit)});});}

/* ---------- tables, keys and links: the shape built to write ---------- */
// a key, for the column that identifies each row
function bw_key(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=6;
  ctx.beginPath();ctx.arc(-5,0,5.5,0,TAU);ctx.moveTo(0.5,0);ctx.lineTo(12,0);ctx.moveTo(8,0);ctx.lineTo(8,5);ctx.moveTo(12,0);ctx.lineTo(12,5);ctx.stroke();ctx.restore();});}
// an arrow out of a cell: this column points to a row in another table
function bw_fkMark(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.2;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(-7,6);ctx.lineTo(6,-7);ctx.moveTo(-1,-7);ctx.lineTo(6,-7);ctx.lineTo(6,0);ctx.stroke();ctx.restore();});}
/* a table of rows. o: name, cols [[name,"pk"|"fk"|""]], rows, col, a, cw (column widths), size, rh (row height), keyA, fkA,
   rowA(j) (a row's opacity), rowBg(j) ([colour, alpha] behind a row), cell(j,i) ({text, col, hi, strike, bold}). Returns its geometry. */
function bw_tbl(ctx,x,y,o){const cols=o.cols,rows=o.rows,sz=o.size||22,rh=o.rh||50,hh=o.name?48:0,ch=o.ch||44,col=o.col||BW_W,a=o.a==null?1:o.a;
  const cw=o.cw||cols.map((c,i)=>Math.max(tw(ctx,c[0],sz-2,500,"mono")+(c[1]?30:0),...rows.map(r=>tw(ctx,String(r[i]),sz,500,"mono")))+30);
  const w=cw.reduce((p,v)=>p+v,0),h=hh+ch+rh*rows.length,cx=[];let acc=x;cw.forEach(v=>{cx.push(acc);acc+=v;});
  const G={x,y,w,h,cx,cw,rh,rowY:j=>y+hh+ch+rh*j+rh/2,colX:i=>cx[i]+cw[i]/2,headY:y+hh+ch/2};if(a<=0.01)return G;
  withA(ctx,a,()=>{if(o.hi)glow(ctx,x+w/2,y+h/2,Math.max(w,h)*0.7,o.hiCol||col,0.25*o.hi);
    glass(ctx,x,y,w,h,12,col,{glow:(o.glow||14)+12*(o.hi||0),ea:0.7+0.3*(o.hi||0),fill:"rgba(7,12,24,0.95)",lw:o.dash?0.01:1.6});
    if(o.dash){ctx.save();ctx.setLineDash([9,7]);ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=1.8;rr(ctx,x,y,w,h,12);ctx.stroke();ctx.restore();}
    if(o.name)T(ctx,o.name,x+16,y+33,{f:"mono",w:500,size:Math.max(18,sz-2),color:rgba(col,1)});
    ctx.fillStyle=rgba(col,0.07);ctx.fillRect(x+1,y+hh,w-2,ch);
    cols.forEach((c,i)=>{let tx=cx[i]+14;if(c[1]==="pk"){bw_key(ctx,tx+7,G.headY,1.1,REF,o.keyA==null?1:o.keyA);tx+=28;}if(c[1]==="fk"){bw_fkMark(ctx,tx+7,G.headY,1.1,col,o.fkA==null?1:o.fkA);tx+=28;}
      T(ctx,c[0],tx,G.headY+7,{f:"mono",w:500,size:sz-2,color:rgba(c[1]==="pk"?REF:SOFT,1)});});
    ctx.strokeStyle="rgba(170,200,245,0.16)";ctx.lineWidth=1;for(let j=0;j<=rows.length;j++){ctx.beginPath();ctx.moveTo(x+8,y+hh+ch+rh*j);ctx.lineTo(x+w-8,y+hh+ch+rh*j);ctx.stroke();}
    rows.forEach((r,j)=>{const ra=o.rowA?o.rowA(j):1;if(ra<=0.01)return;withA(ctx,ra,()=>{const ry=G.rowY(j);
      if(o.rowBg){const b=o.rowBg(j);if(b&&b[1]>0.01){ctx.fillStyle=rgba(b[0],0.16*b[1]);rr(ctx,x+4,ry-rh/2+2,w-8,rh-4,6);ctx.fill();}}
      r.forEach((v,i)=>{const st=(o.cell&&o.cell(j,i))||{},s=st.text!=null?st.text:String(v),c=st.col||INK;
        if(st.hi>0.01){ctx.fillStyle=rgba(st.hiCol||c,0.2*st.hi);rr(ctx,cx[i]+5,ry-rh/2+4,cw[i]-10,rh-8,6);ctx.fill();ctx.strokeStyle=rgba(st.hiCol||c,0.85*st.hi);ctx.lineWidth=2;rr(ctx,cx[i]+5,ry-rh/2+4,cw[i]-10,rh-8,6);ctx.stroke();}
        T(ctx,s,cx[i]+14,ry+sz*0.36,{f:"mono",w:500,size:sz,color:rgba(c,st.dim?0.45:0.95)});
        if(st.strike>0.01){const sw=tw(ctx,s,sz,500,"mono");ctx.strokeStyle=rgba(BAD,st.strike);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(cx[i]+10,ry);ctx.lineTo(cx[i]+18+sw*st.strike,ry);ctx.stroke();}});});});});
  return G;}
// a link between two tables: from a key (one) to the rows that point to it (many), as a bar and a crow's foot, along an elbow
function bw_rel(ctx,x0,y0,x1,y1,col,a,o){o=o||{};const p=o.p==null?1:o.p;if(a<=0.01||p<=0)return;const ym=o.ym==null?(y0+y1)/2:o.ym,pts=[[x0,y0],[x0,ym],[x1,ym],[x1,y1]];
  const L=[0];for(let i=1;i<4;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const tot=L[3]*clamp(p,0,1);
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=o.lw||2.2;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=8;if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);for(let i=1;i<4;i++){if(L[i]<=tot)ctx.lineTo(pts[i][0],pts[i][1]);else{const f=(tot-L[i-1])/((L[i]-L[i-1])||1);ctx.lineTo(lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f));break;}}ctx.stroke();ctx.setLineDash([]);
  if(p>=1){const d0=Math.sign(ym-y0)||1,d1=Math.sign(y1-ym)||1;ctx.beginPath();ctx.moveTo(x0-11,y0+d0*12);ctx.lineTo(x0+11,y0+d0*12);ctx.stroke();
    if(o.one1){ctx.beginPath();ctx.moveTo(x1-11,y1-d1*12);ctx.lineTo(x1+11,y1-d1*12);ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(x1-12,y1);ctx.lineTo(x1,y1-d1*18);ctx.lineTo(x1+12,y1);ctx.moveTo(x1,y1);ctx.lineTo(x1,y1-d1*18);ctx.stroke();}}
  ctx.restore();}
// one write inside a transaction: pending (dashed), done (solid), failed (red) or rolled back (struck through)
function bw_write(ctx,x,y,w,h,title,line,st,a){if(a<=0.01)return;withA(ctx,a,()=>{const c=st==="fail"?BAD:st==="back"?SOFT:st==="done"?BW_W:BW_W;
  glass(ctx,x,y,w,h,12,c,{glow:st==="done"?16:8,ea:st==="pend"?0.01:0.85,fill:st==="done"?"rgba(12,26,52,0.95)":"rgba(7,12,24,0.9)"});
  if(st==="pend"||st==="back"){ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(c,0.8);ctx.lineWidth=1.8;rr(ctx,x,y,w,h,12);ctx.stroke();ctx.restore();}
  T(ctx,title,x+20,y+38,{w:800,size:25,color:rgba(c,1)});T(ctx,line,x+20,y+78,{f:"mono",w:500,size:20,color:rgba(INK,st==="back"?0.4:0.9)});
  if(st==="back"){ctx.strokeStyle=rgba(BAD,0.8);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x+14,y+71);ctx.lineTo(x+w-14,y+71);ctx.stroke();T(ctx,"↺",x+w-34,y+40,{w:800,size:30,align:"center",color:rgba(BW_AMB,1)});}
  if(st==="fail")cross_(ctx,x+w-34,y+32,30,BAD,1);if(st==="done")tick_(ctx,x+w-34,y+34,30,GOOD,1);});}

/* ---------- a document: one credential, written and signed as one piece ---------- */
// o: p (how much is written), hl {claim, evidence} (0..1), sign (0..1), check (0..1), col, a. Returns its height.
function bw_doc(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||BW_W,hl=o.hl||{},p=o.p==null?1:o.p,h=o.h||620;if(a<=0.01)return h;
  const part=k=>clamp(p*7-k,0,1);
  withA(ctx,a,()=>{const f=40;ctx.save();ctx.shadowColor=rgba(col,0.55);ctx.shadowBlur=18+14*(o.glow||0);ctx.fillStyle="rgba(8,14,30,0.95)";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-f,y);ctx.lineTo(x+w,y+f);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=1.8;ctx.stroke();ctx.fillStyle=rgba(col,0.25);ctx.beginPath();ctx.moveTo(x+w-f,y);ctx.lineTo(x+w-f,y+f);ctx.lineTo(x+w,y+f);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    const kv=(k,v,xx,yy,q)=>withA(ctx,q,()=>{T(ctx,k,xx,yy,{f:"mono",w:500,size:21,color:rgba(REF,1)});T(ctx,v,xx+190,yy,{w:700,size:25,color:rgba(INK,0.95)});});
    withA(ctx,part(0),()=>{T(ctx,"credential",x+30,y+52,{w:800,size:32,color:rgba(TRUST,1)});T(ctx,"one document",x+w-62,y+50,{f:"mono",w:500,size:19,align:"right",color:rgba(SOFT,1)});});
    kv("type","Microcredential",x+30,y+104,part(1));kv("issuer","the university",x+30,y+144,part(1.5));kv("holder","Aisha Salem",x+30,y+184,part(2));
    const blk=(yy,name,rowsK,q,hi)=>withA(ctx,q,()=>{const bh=48+rowsK.length*40;if(hi>0.01)glow(ctx,x+w/2,yy+bh/2,w*0.5,TRUST,0.2*hi);
      glass(ctx,x+26,yy,w-52,bh,12,hi>0.01?TRUST:col,{glow:6+12*hi,ea:0.45+0.5*hi,fill:"rgba(14,24,46,0.9)"});T(ctx,name,x+46,yy+32,{w:800,size:23,color:rgba(hi>0.01?TRUST:col,1)});
      rowsK.forEach(([k,v],i)=>kv(k,v,x+66,yy+72+i*40,1));});
    blk(y+212,"claim",[["achieved","Data visualisation"],["credit points","12"]],part(3),hl.claim||0);
    blk(y+358,"evidence",[["project","a dashboard, passed"],["assessed","20 Sep 2026"]],part(4),hl.evidence||0);
    const sg=o.sign||0;if(sg>0.01)withA(ctx,sg,()=>{const sx=x+w-74,sy=y+h-56,r=26+8*(1-ease(sg));ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=2.6;ctx.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU+Math.PI/6;ctx.lineTo(sx+Math.cos(an)*r,sy+Math.sin(an)*r);}ctx.closePath();ctx.stroke();
      T(ctx,"✓",sx,sy+9,{w:800,size:26,align:"center",color:rgba(TRUST,1)});T(ctx,"proof · signed as one piece",x+30,y+h-46,{f:"mono",w:500,size:20,color:rgba(TRUST,1)});});
    const ck=o.check||0;if(ck>0.01)withA(ctx,ck,()=>{glow(ctx,x+w-74,y+h-56,70,GOOD,0.4*ck);ring(ctx,x+w-74,y+h-56,40,GOOD,1,3);});});
  return h;}
// a small document, for stacks of them
function bw_miniDoc(ctx,x,y,w,h,col,a){if(a<=0.01)return;const f=w*0.3;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(mix([8,14,30],col,0.2),0.95);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-f,y);ctx.lineTo(x+w,y+f);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=1;ctx.stroke();ctx.restore();}
// a document database: a cabinet of whole documents
function bw_store(ctx,x,y,w,h,col,a,t){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,col,{glow:18,ea:0.8,fill:"rgba(8,14,30,0.92)"});
  for(let r=0;r<3;r++)for(let c=0;c<5;c++)bw_miniDoc(ctx,x+40+c*(w-80)/5,y+100+r*(h-130)/3,44,60,col,0.5+0.4*hash(r*5+c,3));});}

/* ---------- the star: the shape built to read ---------- */
// the fact at the centre: its grain, its measures (what you add up) and its keys; o.g (grain), o.m (measures), o.k (keys), each 0..1
function bw_fact(ctx,cx,cy,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||440,h=o.h||280,x=cx-w/2,y=cy-h/2,col=BW_R;if(a<=0.01)return{x:cx,y:cy,w,h};
  withA(ctx,a,()=>{if(o.hi)glow(ctx,cx,cy,w*0.8,col,0.3*o.hi);glass(ctx,x,y,w,h,16,col,{glow:18+10*(o.hi||0),ea:0.9,fill:"rgba(8,20,22,0.95)"});
    T(ctx,"FACT",x+24,y+36,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});T(ctx,"credential awarded",x+24,y+72,{w:800,size:32,color:rgba(col,1)});
    withA(ctx,o.g==null?1:o.g,()=>{if(o.gHi)glow(ctx,cx,y+110,w*0.5,TRUST,0.3*o.gHi);T(ctx,"one row per credential awarded",x+24,y+114,{f:"mono",w:500,size:19,color:rgba(TRUST,0.75+0.25*(o.gHi||0))});});
    ctx.strokeStyle=rgba(col,0.3);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+14,y+136);ctx.lineTo(x+w-14,y+136);ctx.stroke();
    [["award","count"],["credit points","sum"]].forEach(([m,how],i)=>withA(ctx,clamp((o.m==null?1:o.m)*2-i,0,1),()=>{const yy=y+178+i*40;
      T(ctx,"Σ",x+34,yy,{w:800,size:28,align:"center",color:rgba(col,1)});T(ctx,m,x+60,yy,{w:700,size:25});T(ctx,how,x+w-24,yy,{f:"mono",w:500,size:19,align:"right",color:rgba(SOFT,1)});}));
    withA(ctx,o.k==null?1:o.k,()=>T(ctx,"+ a key to each dimension",x+24,y+h-18,{f:"mono",w:500,size:18,color:rgba(SOFT,0.9)}));});
  return{x:cx,y:cy,w,h};}
// one dimension: a name, and what you can filter or group by
function bw_dim(ctx,x,y,name,sub,o){o=o||{};return ent(ctx,{x,y,name,sub,col:o.col||BW_R,a:o.a,s:o.s||1,hi:o.hi||0,subA:1});}
const BW_DIMS={learner:["Learner","name · faculty · dates"],kind:["Credential kind","award · micro · badge"],faculty:["Faculty","name · school"],date:["Date","day · month · year"]};
// a whole star, at (cx,cy): P maps each dimension to its place; o.dimA, o.join (0..1 per dimension: a join lit), o.hi
function bw_star(ctx,cx,cy,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const P=o.P||{learner:[-340,-230],kind:[340,-230],faculty:[-340,240],date:[340,240]},da=o.dimA||{},jn=o.join||{},ds=o.ds||s;
  withA(ctx,a,()=>{const F={x:cx,y:cy,w:(o.fw||440)*s,h:(o.fh||280)*s};
    Object.keys(P).forEach(k=>{const q=da[k]==null?1:da[k];if(q<=0.01)return;const D=entBox(ctx,{x:cx+P[k][0]*s,y:cy+P[k][1]*s,name:(o.names||{})[k]||BW_DIMS[k][0],sub:o.nosub?null:BW_DIMS[k][1],s:ds});
      relLine(ctx,F,D,"*","1",{col:jn[k]>0.01?mix(BW_R,[255,255,255],0.4*jn[k]):BW_R,a:q*(o.relA==null?1:o.relA),s:ds,lw:2.2+2.4*(jn[k]||0)});
      if(jn[k]>0.01)glow(ctx,(F.x+D.x)/2,(F.y+D.y)/2,90*s,BW_R,0.35*jn[k]);});
    if(o.small){const w=F.w,h=F.h;glass(ctx,cx-w/2,cy-h/2,w,h,14*s,BW_R,{glow:16,ea:0.9,fill:"rgba(8,20,22,0.95)"});T(ctx,o.factName||"credential awarded",cx,cy-4*s,{w:800,size:32*s,align:"center",color:rgba(BW_R,1)});
      T(ctx,o.factSub||"Σ count · credit points",cx,cy+36*s,{f:"mono",w:500,size:24*s,align:"center",color:rgba(SOFT,1)});}
    else bw_fact(ctx,cx,cy,Object.assign({w:F.w,h:F.h},o.fact||{}));
    Object.keys(P).forEach(k=>{const q=da[k]==null?1:da[k];bw_dim(ctx,cx+P[k][0]*s,cy+P[k][1]*s,(o.names||{})[k]||BW_DIMS[k][0],o.nosub?null:BW_DIMS[k][1],{a:q,s:ds,hi:(o.dimHi||{})[k]||0});});});}
// small signs of each shape, for the end: a web of small tables, and a star
function bw_normIcon(ctx,x,y,s,a,col){if(a<=0.01)return;col=col||BW_W;withA(ctx,a,()=>{const B=[[-70,-40],[20,-56],[80,10],[-10,30],[-80,40],[60,62]],E=[[0,1],[1,2],[1,3],[3,4],[3,5],[0,3]];
  ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2;E.forEach(([i,j])=>{ctx.beginPath();ctx.moveTo(x+B[i][0]*s,y+B[i][1]*s);ctx.lineTo(x+B[j][0]*s,y+B[j][1]*s);ctx.stroke();});
  B.forEach(([bx,by])=>{glass(ctx,x+bx*s-20*s,y+by*s-12*s,40*s,24*s,5*s,col,{glow:8,ea:0.9,fill:"rgba(8,14,30,0.95)"});ctx.fillStyle=rgba(col,0.6);ctx.fillRect(x+bx*s-12*s,y+by*s-2*s,24*s,3*s);});});}
function bw_starIcon(ctx,x,y,s,a,col){if(a<=0.01)return;col=col||BW_R;withA(ctx,a,()=>{const B=[[-72,-44],[72,-44],[-72,44],[72,44]];ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2;
  B.forEach(([bx,by])=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+bx*s,y+by*s);ctx.stroke();});
  B.forEach(([bx,by])=>{glass(ctx,x+bx*s-20*s,y+by*s-12*s,40*s,24*s,5*s,col,{glow:8,ea:0.9,fill:"rgba(8,20,22,0.95)"});});
  glass(ctx,x-30*s,y-18*s,60*s,36*s,7*s,col,{glow:14,ea:1,fill:"rgba(10,30,26,0.95)"});T(ctx,"Σ",x,y+8*s,{w:800,size:20*s,align:"center",color:rgba(col,1)});});}
// the planners' answer: awards by faculty, stacked, one bar a year
function bw_chart(ctx,x,y,w,h,p,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,BW_R,{glow:14,ea:0.8,fill:"rgba(7,14,18,0.94)"});
  T(ctx,o.title||"awards, by faculty and year",x+20,y+38,{w:800,size:22,color:rgba(BW_R,1)});const bx=x+22,by=y+h-40,bw=(w-44)/10,mh=h-130,mx=12000;
  BW_TEN.forEach((v,i)=>{const q=clamp(p*10-i*0.6,0,1),sh=[0.44,0.34,0.22];let acc=0;["sci","eng","arts"].forEach((k,j)=>{const hh=v/mx*mh*sh[j]*ease(q);ctx.fillStyle=rgba(BW_FAC[k].c,0.85);rr(ctx,bx+i*bw+4,by-acc-hh,bw-8,hh,3);ctx.fill();acc+=hh;});
    if(i===0||i===9)T(ctx,String(2017+i),bx+i*bw+bw/2,by+26,{f:"mono",w:500,size:18,align:"center",color:rgba(SOFT,1)});});
  let lx=x+20;["sci","eng","arts"].forEach(k=>{ctx.fillStyle=rgba(BW_FAC[k].c,1);ctx.fillRect(lx,y+58,14,14);T(ctx,BW_FAC[k].n,lx+20,y+72,{w:600,size:18,color:rgba(SOFT,1)});lx+=tw(ctx,BW_FAC[k].n,18,600)+44;});});}

/* ---------- words the planner types, with some of them lit ---------- */
// a question in a bubble, laid out word by word so single words can light up; hi(word index) gives 0..1
function bw_qBubble(ctx,x,y,w,words,o){o=o||{};const sz=o.size||28,lh=sz*1.36,a=o.a==null?1:o.a,col=o.col||BW_R;const pos=[];let cx=0,row=0;
  ctx.save();ctx.font=font(700,sz);const sp=ctx.measureText(" ").width;words.forEach(wd=>{const ww=ctx.measureText(wd).width;if(cx>0&&cx+ww>w-56){cx=0;row++;}pos.push([cx,row,ww]);cx+=ww+sp;});ctx.restore();
  const h=(row+1)*lh+40,B={x,y,w,h,pos:pos.map(([px,r,ww])=>[x+28+px,y+20+sz*1.05+r*lh,ww])};if(a<=0.01)return B;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:16,ea:0.75,fill:"rgba(7,12,24,0.93)"});ctx.fillStyle="rgba(7,12,24,0.93)";ctx.strokeStyle=rgba(col,0.75);ctx.lineWidth=1.6;
    const tx=x+50;ctx.beginPath();ctx.moveTo(tx,y+h-1);ctx.lineTo(tx-8,y+h+26);ctx.lineTo(tx+30,y+h-1);ctx.fill();ctx.stroke();
    words.forEach((wd,i)=>{const[px,py,ww]=B.pos[i],q=o.hi?o.hi(i):0;if(q>0.01){ctx.fillStyle=rgba(o.hiCol?o.hiCol(i):TRUST,0.22*q);rr(ctx,px-6,py-sz*0.95,ww+12,sz*1.3,8);ctx.fill();}
      T(ctx,wd,px,py,{w:700,size:sz,color:q>0.01?rgba(mix(INK,o.hiCol?o.hiCol(i):TRUST,q),1):rgba(INK,1)});});});
  return B;}

/* ---------- pictures for the labs and the scenarios (site/assets/built-to-write-built-to-read/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW): every word it shows comes from FW.vis, so
   the Spanish pages show Spanish. Table and column names, IDs, numbers and people's names stay as they are. Labs are 960 wide and shown
   at about 45%, so their text is 22 px or more; the scenarios' canvases are 600 × 320, shown at about 70%, with text of 18 px or more. */
const bw_row=(c,x,y,w,h,col,a)=>glass(c,x,y,w,h,10,col,{glow:8,ea:0.7*(a==null?1:a),fill:"rgba(8,14,30,0.94)"});
const LV={
  // Break the update: one name change, on three ways of storing the name
  update:(c,w,h,st,L)=>{const V=L.vis.update,k=st.pick||"once";
    if(k==="once"){const A=bw_tbl(c,40,34,{name:"learner",cols:[["learner_id","pk"],["name",""]],rows:[["L-204","Aisha Salem"]],size:26,rh:56,cell:(j,i)=>i===1?{hi:1,col:BW_W}:null});
      for(let i=0;i<3;i++){const x=60+i*210,y=290;bw_row(c,x,y,180,64,BW_W);T(c,"award",x+90,y+41,{f:"mono",w:500,size:26,align:"center",color:rgba(SOFT,1)});arrowTo(c,x+90,y-6,A.x+A.w-70,A.y+A.h+8,BW_W,0.85,{bend:0.1,head:14,lw:2.4});}
      tag(c,760,120,V.one,GOOD,{align:"center",size:30});}
    else if(k==="every"){const R=[["A-9001","Aisha Salem"],["A-9002","Aisha Salem"],["A-9004","Aisha Karim"]];
      const T_=bw_tbl(c,40,34,{name:"awards",cols:[["award_id","pk"],["learner_name",""]],rows:R,size:26,rh:56,cell:(j,i)=>i===1?{hi:1,col:j===2?BAD:BW_W,hiCol:j===2?BAD:BW_W}:null});
      [0,1].forEach(j=>tick_(c,T_.x+T_.w+34,T_.rowY(j),34,GOOD,1));cross_(c,T_.x+T_.w+34,T_.rowY(2),32,BAD,1);
      tag(c,760,200,V.three,BAD,{align:"center",size:30});}
    else{[0,1,2].forEach(i=>{const x=190+i*200,y=34+i*16;bw_miniDoc(c,x,y,180,236,BW_W,1);T(c,"Aisha Karim",x+18,y+80,{w:700,size:24,color:rgba(INK,1)});
        c.fillStyle=rgba(SOFT,0.35);[118,150,182].forEach(yy=>{rr(c,x+18,y+yy,130,8,3);c.fill();});c.strokeStyle=rgba(TRUST,0.95);c.lineWidth=2.4;c.beginPath();for(let q=0;q<6;q++){const an=q/6*TAU+Math.PI/6;c.lineTo(x+146+Math.cos(an)*18,y+206+Math.sin(an)*18);}c.closePath();c.stroke();});
      tag(c,480,344,V.docs,TRUST,{align:"center",size:28});}},
  // Declare the grain: rows of the fact table at the chosen grain
  grain:(c,w,h,st,L)=>{const V=L.vis.grain,k=st.pick||"cred",K=V.kinds;const G={
      cred:{cols:[["award_id","pk"],["learner",""],["kind",""],["faculty",""],["cp",""]],rows:[["A-9001","L-204",K.award,"Science","240"],["A-9002","L-204",K.micro,"Science","12"],["A-9004","L-204",K.micro,"Engineering","12"],["A-9003","L-311",K.micro,"Arts","6"]]},
      year:{cols:[["learner",""],["year",""],["faculty",""],["awards",""],["cp",""]],rows:[["L-204","2025","Science","1","240"],["L-204","2026","Science?","2","24"],["L-311","2026","Arts","1","6"]]},
      learner:{cols:[["learner",""],["awards",""],["cp",""]],rows:[["L-204","3","264"],["L-311","1","6"]]}}[k];
    T(c,V[k],40,50,{w:800,size:30,color:rgba(TRUST,1)});
    bw_tbl(c,40,78,{cols:G.cols,rows:G.rows,col:BW_R,size:24,rh:52,cell:(j,i)=>k==="year"&&j===1&&i===2?{col:BW_AMB,hi:1,hiCol:BW_AMB}:null});},
  // Which shape answers this faster? The two shapes, side by side
  shapes:(c,w,h,st,L)=>{const V=L.vis.shapes;bw_normIcon(c,w*0.27,h*0.56,1.7,1,BW_W);bw_starIcon(c,w*0.73,h*0.56,1.7,1,BW_R);
    T(c,V.write,w*0.27,56,{w:800,size:32,align:"center",color:rgba(BW_W,1)});T(c,V.read,w*0.73,56,{w:800,size:32,align:"center",color:rgba(BW_R,1)});
    c.strokeStyle="rgba(170,200,245,0.2)";c.lineWidth=1.5;c.beginPath();c.moveTo(w/2,30);c.lineTo(w/2,h-30);c.stroke();},
  // scenarios: one email, three copies
  anomaly:(c,w,h,st,L)=>{const V=L.vis.anomaly;[["enrolment","aisha.s@mail.com",0],["award","aisha.s@mail.com",0],["alumni","aisha.k@uni.edu",1]].forEach(([tb,em,bad],i)=>{const y=28+i*72;bw_row(c,30,y,540,58,bad?BAD:BW_W);
      T(c,tb,52,y+37,{f:"mono",w:500,size:22,color:rgba(SOFT,1)});T(c,em,230,y+37,{f:"mono",w:500,size:22,color:rgba(bad?BAD:BW_W,1)});});
    tag(c,300,276,V.note,BAD,{align:"center",size:22});},
  // a transaction that stopped halfway
  half:(c,w,h,st,L)=>{const V=L.vis.half;V.parts.forEach((p,i)=>{const y=24+i*72,bad=i===2;bw_row(c,30,y,540,60,bad?BAD:BW_W);T(c,p,54,y+39,{w:700,size:24,color:rgba(bad?BAD:INK,1)});
      if(bad)cross_(c,536,y+30,28,BAD,1);else tick_(c,536,y+31,28,GOOD,1);});
    T(c,V.saved,300,290,{w:800,size:26,align:"center",color:rgba(BAD,1)});},
  // a long report on the app's database, on its busiest morning
  rush:(c,w,h,st,L)=>{const V=L.vis.rush;glass(c,24,30,270,250,18,BW_W,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(c,V.app,159,72,{w:800,size:22,align:"center",color:rgba(BW_W,1)});T(c,V.time,159,104,{w:600,size:19,align:"center",color:rgba(SOFT,1)});
    for(let i=0;i<5;i++){c.fillStyle=rgba(BW_W,0.55);rr(c,52+i*46,138,32,32,6);c.fill();}T(c,V.queue,159,230,{w:700,size:20,align:"center",color:rgba(BAD,1)});
    glass(c,318,30,258,250,18,BW_R,{glow:10,ea:0.6,fill:"rgba(7,14,18,0.94)"});T(c,V.report,447,72,{w:800,size:22,align:"center",color:rgba(BW_R,1)});T(c,V.joins,447,112,{w:600,size:20,align:"center",color:rgba(SOFT,1)});
    arrowTo(c,318,175,300,175,BAD,0.9,{head:12});T(c,V.running,447,220,{w:700,size:20,align:"center",color:rgba(BW_AMB,1)});},
  // a fact table with two grains in it
  mixed:(c,w,h,st,L)=>{const V=L.vis.mixed;bw_tbl(c,40,20,{name:"fact_awards",cols:[["row",""],["learner",""],["awards",""]],rows:[["A-9001","L-204","1"],["A-9002","L-204","1"],[V.total,"L-204","2"],["A-9003","L-311","1"]],size:20,rh:40,col:BW_R,cell:(j,i)=>j===2?{col:BAD,hi:1,hiCol:BAD}:null});
    T(c,V.sum,300,300,{w:800,size:22,align:"center",color:rgba(BAD,1)});},
  // a million documents, and a count that opens every one
  docstack:(c,w,h,st,L)=>{const V=L.vis.docstack;for(let r=0;r<7;r++)for(let k=0;k<20;k++)bw_miniDoc(c,24+k*28,24+r*34,20,26,k<5?BW_AMB:BW_W,k<5?0.75:0.4);c.fillStyle=rgba(BW_AMB,0.9);c.fillRect(24+5*28-5,16,4,250);
    T(c,V.note,300,300,{w:700,size:21,align:"center",color:rgba(BW_AMB,1)});},
  // a faculty overwritten, and last year's report changes
  overwrite:(c,w,h,st,L)=>{const V=L.vis.overwrite;bw_row(c,30,30,540,64,BW_AMB);T(c,"Aisha Salem",52,70,{w:700,size:24,color:rgba(INK,1)});T(c,"Engineering",330,70,{f:"mono",w:500,size:22,color:rgba(BW_AMB,1)});
    T(c,"Science",330,124,{f:"mono",w:500,size:22,color:rgba(SOFT,0.7)});c.strokeStyle=rgba(BAD,0.85);c.lineWidth=2.4;c.beginPath();c.moveTo(326,116);c.lineTo(430,116);c.stroke();T(c,V.over,52,124,{w:600,size:20,color:rgba(SOFT,1)});
    glass(c,30,160,540,120,16,BAD,{glow:12,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(c,V.report,52,200,{w:700,size:21,color:rgba(SOFT,1)});T(c,V.then,52,254,{w:800,size:26,color:rgba(INK,1)});T(c,V.now,560,254,{w:800,size:26,align:"right",color:rgba(BAD,1)});},
  // bronze, silver, gold: refinement, not shape
  medal:(c,w,h,st,L)=>{const V=L.vis.medal;[["bronze",24],["silver",212],["gold",400]].forEach(([k,x],i)=>{glass(c,x,30,176,200,16,LAYER[k],{glow:14,ea:0.85,fill:"rgba(7,12,24,0.92)"});T(c,V.layers[i],x+88,66,{w:800,size:22,align:"center",color:rgba(LAYER[k],1)});});
    bw_normIcon(c,112,160,0.85,0.55,BW_W);bw_normIcon(c,300,160,0.85,1,BW_W);bw_starIcon(c,488,160,0.85,1,BW_R);
    T(c,V.note,300,284,{w:700,size:20,align:"center",color:rgba(SOFT,1)});},
  // the star, in four steps
  star:(c,w,h,st,L)=>{const V=L.vis.star;c.save();c.translate(w/2,h/2);c.scale(0.6,0.6);c.translate(-960,-520);
    bw_star(c,960,520,1,{nosub:true,small:true,fw:430,fh:170,ds:1.3,P:{learner:[-300,-180],kind:[300,-180],faculty:[-300,180],date:[300,180]},names:V.dims,factName:V.fact,factSub:V.sub});c.restore();}
};
