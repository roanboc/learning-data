/* ===== Processes, as deep as data needs: scenes =====
   Nine chapters, as in ../script.md. The qanats of Iran, as Paul Ward English tells them: at Mahan, near Kerman, the water of one of
   the town's four qanats came round in a cycle of twelve days, each day fifteen shares of time; on another, through twelve dividers,
   each sending it to certain fields at certain times; a turn missed, and a field dry until the cycle came round; in some small
   villages, lots drawn each autumn for a place in the cycle, and those near its end with none; the cycle kept in levels, its days,
   their shares and each share's six parts of sixteen minutes, down to single minutes where a share was split; and the mirab's water
   clock, a metal cup with a hole in its base, floating in water until it filled and sank. Then Tomás's next note: where each concept
   is born; Grace's process map, in four bands; its levels, breadth first and depth on pain; meter to cash at level two, a SIPOC for
   each process and the concepts each one writes first; the one branch that hurts, estimated bills; check readings at level three,
   in BPMN, where an estimated reading is born; the data practice's own processes; and back to the qanat.
   The story's pictures (the desert from above, the village, its people) are the series' own, in ../../../shared/src/ba.js; the cycle
   and its levels, the dividers, the lots and the water clock are drawn here. Made to read on a phone (tools/legible.py): text is at
   least 28 px in the frame; what's drawn small is texture. Motion: the camera glides between what the narration names and things
   arrive with a spring; in one room nothing is cut, what moves slides there, and what leaves goes before what comes in. Sound: every
   effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. A cycle of turns ---------- */
// the owners' colours, warm and close to the sand, so the water's blue is the only cool thing in the story
const B4_OWN=[[222,178,120],[196,150,108],[176,170,118],[214,156,132],[168,150,128],[226,196,150],[190,132,100]];
// The cycle of turns as a ring of twelve days, from the top, clockwise: o.p draws it round; o.hi (index) lights a day, by o.hiA, and
// o.lab numbers the days outside the ring
const B4_CX=520,B4_CY=540,B4_CR=240;
function b4_cycle(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=12,p=clamp(o.p==null?1:o.p,0,1),r0=r*0.64,ang=u=>-Math.PI/2+u*TAU;
  const seg=(u0,u1,c,al)=>{if(u1<=u0)return;ctx.fillStyle=rgba(c,al);ctx.beginPath();ctx.arc(x,y,r,ang(u0),ang(u1));ctx.arc(x,y,r0,ang(u1),ang(u0),true);ctx.closePath();ctx.fill();};
  withA(ctx,a,()=>{ctx.save();ctx.shadowColor=rgba(BAC,0.35);ctx.shadowBlur=30;ctx.fillStyle="rgba(10,14,22,0.92)";ctx.beginPath();ctx.arc(x,y,r+16,0,TAU);ctx.fill();ctx.restore();
    ctx.strokeStyle=rgba(BAC,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r+16,0,TAU);ctx.stroke();
    for(let i=0;i<n;i++){const u0=i/n,q=clamp(p*n-i,0,1);if(q<=0)break;seg(u0+0.004,u0+q/n-0.004,mix(BA_SAND,[255,255,255],0.12*(i%2)),0.55);
      const hi=o.hi===i?(o.hiA==null?1:o.hiA):0;if(hi>0.01){seg(u0+0.004,u0+1/n-0.004,BA_WATER,0.85*hi);const am=ang(u0+0.5/n);glow(ctx,x+Math.cos(am)*(r+r0)/2,y+Math.sin(am)*(r+r0)/2,r*0.3,BA_WATER,0.4*hi);}
      if(o.lab&&q>0.5){const am=ang(u0+0.5/n);withA(ctx,clamp(q*2-1,0,1),()=>T(ctx,String(i+1),x+Math.cos(am)*(r+50),y+Math.sin(am)*(r+50)+10,{w:700,size:28,align:"center",color:rgba(INK,0.85)}));}}
    withA(ctx,o.midA==null?1:o.midA,()=>{if(o.mid)T(ctx,o.mid,x,y+(o.sub?-4:14),{w:800,size:40,align:"center"});if(o.sub)T(ctx,o.sub,x,y+40,{w:600,size:28,align:"center",color:rgba(SOFT,1)});});});}
// Another qanat's water, passing twelve dividers on its way through the fields: the main channel from the left (o.p draws it in), and
// at each divider a branch to its own field, up or down by turns. o.lit[i] (0..1): divider i's turn, its branch filling and its field
// taking the water; o.wet[i] (0..1) how green each field is
const B4_DV=[...Array(12)].map((_,i)=>[1074+i*62,i%2?1:-1]),B4_DVY=560;
function b4_dividers(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const y=B4_DVY,p=clamp(o.p==null?1:o.p,0,1),x0=1030,x1=lerp(x0,1790,p),L=o.lit||[];
  withA(ctx,a,()=>{glass(ctx,1000,250,820,600,22,BAC,{glow:12,ea:0.7,fill:"rgba(8,14,24,0.92)"});
    T(ctx,"another qanat: twelve dividers",1030,304,{w:700,size:30,color:rgba(INK,0.95)});
    ctx.save();ctx.lineCap="round";ctx.strokeStyle="rgba(96,64,40,0.9)";ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();
    ctx.strokeStyle=rgba(BA_WATER,0.9);ctx.lineWidth=7;ctx.shadowColor=rgba(BA_WATER,0.6);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.restore();
    B4_DV.forEach(([x,s],i)=>{if(x>x1)return;const l=L[i]||0,yb=y+s*150,fy=s>0?yb:yb-70,wt=o.wet?o.wet[i]:0.5;
      ctx.strokeStyle="rgba(96,64,40,0.9)";ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y+s*12);ctx.lineTo(x,yb);ctx.stroke();
      if(l>0.01){ctx.save();ctx.strokeStyle=rgba(BA_WATER,0.95*l);ctx.lineWidth=5;ctx.shadowColor=rgba(BA_WATER,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x,y+s*12);ctx.lineTo(x,lerp(y+s*12,yb,clamp(l*1.6,0,1)));ctx.stroke();ctx.restore();}
      ctx.fillStyle=rgba(mix(BA_DRY,BA_GREEN,wt),0.95);rr(ctx,x-24,fy,48,70,6);ctx.fill();
      ctx.strokeStyle="rgba(40,30,20,0.35)";ctx.lineWidth=1.5;for(let k=1;k<4;k++){ctx.beginPath();ctx.moveTo(x-24+k*12,fy+6);ctx.lineTo(x-24+k*12,fy+64);ctx.stroke();}
      if(l>0.01){ctx.fillStyle=rgba(BA_WATER,0.42*l);rr(ctx,x-24,fy,48,70,6);ctx.fill();glow(ctx,x,fy+35,60,BA_WATER,0.35*l);}
      ctx.fillStyle="rgba(150,118,84,1)";ctx.fillRect(x-10,y-16,20,32);ctx.fillStyle="rgba(60,42,28,1)";ctx.fillRect(x-4,s>0?y+4:y-16,8,12);
      if(l>0.01)glow(ctx,x,y,40,BA_WATER,0.5*l);});});}
// the village, cut away, with its qanat's water running, its fields and their gates, and an owner by each field
const B4_GATES=BA_VFIELDS.map(([x])=>x-6),B4_S=0.14;
const B4_OWNERS=[[1640,1,{dress:"robe",head:"turban"}],[1790,1,{dress:"tunic",head:"cap"}],[1990,-1,{dress:"chador"}],[2150,-1,{dress:"robe",head:"cap"}]];
function b4_village(ctx,t,st){ba_secSky(ctx,{warm:0.35});ba_section(ctx,t,{water:[[BA_XM,BA_XO+30]]});
  ba_village(ctx,t,{wet:st.wet,fill:st.fill});ba_channel(ctx,t,2230,1);B4_GATES.forEach((x,i)=>ba_gate(ctx,x,st.gate[i]||0,1));
  B4_OWNERS.forEach(([x,f,o],i)=>{const a=st.own?st.own[i]:1;if(a<=0.01)return;ba_fig(ctx,x,ba_ys(x),B4_S,Object.assign({f,a,t,rimA:0.6},o));});}
// The lots, in a panel over the village: owners in a circle, a light going round them as the count does, each one counted out taking
// the next place in the cycle (o.n: how many so far, 0..7); the cycle's turns, in the order drawn, as a bar; and the water along it
// (o.w, 0..1 of the bar), which runs short, so the last turns get none (o.dry, 0..1). It sits right of the year's tag, clear of it
const B4_RING=[...Array(7)].map((_,i)=>{const an=Math.PI/2+i*TAU/7;return[960+Math.cos(an)*170,236+Math.sin(an)*30,Math.sin(an)];});
const B4_LOT=[3,6,1,4,0,5,2],B4_RDR=["robe","tunic","robe","chador","robe","tunic","robe"],B4_RHD=["turban","cap","cap",null,"turban","cap","turban"];
function b4_lots(ctx,t,a,o){if(a<=0.01)return;o=o||{};const n=o.n||0;withA(ctx,a,()=>{glass(ctx,720,40,1120,290,22,BAC,{glow:14,ea:0.75,fill:"rgba(8,14,24,0.92)"});
  T(ctx,"drawing lots for a place in the cycle",760,92,{w:700,size:30,color:rgba(INK,0.95)});
  // the owners in a circle, those at the back first; each one counted out gets a mark in its turn's colour
  B4_RING.map((p,i)=>[p,i]).sort((A,B)=>A[0][2]-B[0][2]).forEach(([[x,y,d],i])=>{const s=lerp(0.25,0.3,(d+1)/2),k=B4_LOT.indexOf(i),on=clamp(n-k,0,1),hd=B4_RHD[i];
    ba_fig(ctx,x,y+44,s,Object.assign({f:x<960?1:-1,t,rimA:0.45+0.4*on,dress:B4_RDR[i]},hd?{head:hd}:{}));
    if(on>0.01)withA(ctx,on,()=>{ctx.fillStyle=rgba(B4_OWN[i],1);ctx.beginPath();ctx.arc(x+(x<960?2:-2),y+44-s*330,7,0,TAU);ctx.fill();});});
  // the count, going round the circle
  const ck=o.count||0;if(ck>0.01&&n<7){const u=(o.k||0)%7,i0=Math.floor(u),f=u-i0,P0=B4_RING[i0],P1=B4_RING[(i0+1)%7],x=lerp(P0[0],P1[0],f),y=lerp(P0[1],P1[1],f)+44-0.28*340;glow(ctx,x,y,30,BIZ,0.7*ck);}
  // the cycle's turns, in the order drawn, and the water running along them
  const X=1220,Wd=580,Y=172,h=56,sw=Wd/7;
  T(ctx,"the cycle's turns",X,150,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});
  for(let j=0;j<7;j++){const q=clamp(n-j,0,1),i=B4_LOT[j];ctx.fillStyle=rgba(q>0.01?B4_OWN[i]:[255,255,255],q>0.01?0.6*q+0.05:0.05);ctx.fillRect(X+j*sw+3,Y,sw-6,h);}
  ctx.strokeStyle=rgba(INK,0.35);ctx.lineWidth=2;ctx.strokeRect(X-2,Y-4,Wd+4,h+8);
  const wq=clamp(o.w||0,0,1);if(wq>0.01){ctx.save();ctx.fillStyle=rgba(BA_WATER,0.9);ctx.shadowColor=rgba(BA_WATER,0.7);ctx.shadowBlur=12;ctx.fillRect(X,Y+h+14,Wd*wq,10);ctx.restore();}
  const dr=o.dry||0;if(dr>0.01)withA(ctx,dr,()=>{const x0=X+Wd*0.71;ctx.save();ctx.setLineDash([9,7]);ctx.strokeStyle=rgba(BA_RED,0.95);ctx.lineWidth=3;rr(ctx,x0,Y-8,X+Wd-x0+6,h+16,10);ctx.stroke();ctx.restore();
    tag(ctx,X+Wd-2-tw(ctx,"the end of the cycle: none",28,700)-26,Y+h+64,"the end of the cycle: none",BA_RED,{size:28});});});}
// The cycle, kept in levels, a bar for each: its twelve days; a day's fifteen shares; a share's six parts of sixteen minutes; and a
// part's sixteen minutes, opened only where a share was split. Each bar opens from one cell of the bar above it. L.rows[r] (0..1)
// shows a bar, L.p[r] draws its cells in; L.open (0..1) outlines the cells that open; L.own (0..1) colours who holds what; L.water
// [row, from, to, a] lights a run of cells as the water runs; L.deep (0..1) lights the one branch that goes all the way down
const B4_LX=470,B4_LW=980,B4_LY=[212,402,592,782],B4_LH=56,B4_LN=[12,15,6,16],B4_LO=[6,3,5,-1];
const B4_LNAME=[["the cycle","12 days"],["a day","15 shares"],["a share","6 parts of 16 minutes"],["a part","16 single minutes"]];
// who holds what in the share that opens: three parts held whole by one heir, two by a buyer, and the last split, by the minute
const B4_PART=[0,0,0,1,1,2],B4_MIN=[2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3],B4_HC=[[214,156,132],[176,170,118],[226,196,150],[168,150,128]];
const b4_lcx=(r,j)=>B4_LX+B4_LW*(j+0.5)/B4_LN[r];
function b4_ladder(ctx,t,L){const op=L.open||0,own=L.own||0,dp=L.deep||0;
  for(let r=0;r<4;r++){const a=L.rows[r]||0;if(a<=0.01)continue;const n=B4_LN[r],y=B4_LY[r],cw=B4_LW/n,p=L.p?L.p[r]:1;
    withA(ctx,a,()=>{
      // the zoom from the cell above it
      if(r>0){const j=B4_LO[r-1],n0=B4_LN[r-1],y0=B4_LY[r-1]+B4_LH+16,xa=B4_LX+B4_LW*j/n0,xb=B4_LX+B4_LW*(j+1)/n0,yt=y-16;
        ctx.fillStyle=rgba(BA_WATER,0.06+0.1*dp);ctx.beginPath();ctx.moveTo(xa,y0);ctx.lineTo(xb,y0);ctx.lineTo(B4_LX+B4_LW+16,yt);ctx.lineTo(B4_LX-16,yt);ctx.closePath();ctx.fill();
        ctx.strokeStyle=rgba(BA_WATER,0.3+0.45*dp);ctx.lineWidth=2+dp;ctx.beginPath();ctx.moveTo(xa,y0);ctx.lineTo(B4_LX-16,yt);ctx.moveTo(xb,y0);ctx.lineTo(B4_LX+B4_LW+16,yt);ctx.stroke();}
      glass(ctx,B4_LX-16,y-16,B4_LW+32,B4_LH+32,18,BAC,{glow:12,ea:0.7,fill:"rgba(8,14,24,0.9)"});
      for(let j=0;j<n;j++){const q=clamp(p*n-j,0,1);if(q<=0)break;let c=mix(BA_SAND,[255,255,255],0.12*(j%2));
        if(r===2)c=mix(c,B4_HC[B4_PART[j]],own);if(r===3)c=mix(c,B4_HC[B4_MIN[j]],own);
        ctx.fillStyle=rgba(c,0.5);ctx.fillRect(B4_LX+j*cw+2,y,cw*q-4,B4_LH);}
      if(r<3&&op>0.01&&p>=1){const j=B4_LO[r];ctx.save();ctx.strokeStyle=rgba(BA_WATER,0.9*op);ctx.lineWidth=3;ctx.shadowColor=rgba(BA_WATER,0.7*dp);ctx.shadowBlur=14*dp;ctx.strokeRect(B4_LX+j*cw+1,y-3,cw-2,B4_LH+6);ctx.restore();}
      if(L.water&&L.water[0]===r){const[,j0,j1,wa]=L.water;if(wa>0.01&&j1>j0){ctx.fillStyle=rgba(BA_WATER,0.85*wa);ctx.fillRect(B4_LX+j0*cw+2,y,(j1-j0)*cw-4,B4_LH);glow(ctx,B4_LX+(j0+j1)/2*cw,y+B4_LH/2,120,BA_WATER,0.35*wa);}}
      T(ctx,B4_LNAME[r][0],80,y+22,{w:800,size:32});T(ctx,B4_LNAME[r][1],80,y+60,{w:600,size:28,color:rgba(SOFT,1)});});}}
// The water clock, close, at dusk: a basin of water on a stone ledge, cut away so its water shows, with the mirab beside it and his
// hand on its rim; in it a small metal cup with a hole in its base, floating. Water comes in through the hole (o.fill, 0..1), so the
// cup sits lower as it fills, until it fills and sinks (o.sink, 0..1), with a few bubbles
const B4_BX0=852,B4_BX1=1268,B4_BTOP=720,B4_BBOT=900,B4_WL=760,B4_CUPX=968,B4_CUPR=58,B4_CUPD=46;
function b4_clock(ctx,t,o){o=o||{};const fill=clamp(o.fill||0,0,1),sk=clamp(o.sink||0,0,1);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#2b2233");g.addColorStop(0.5,"#6e5246");g.addColorStop(0.62,"#4d3a2e");g.addColorStop(1,"#211812");ctx.fillStyle=g;ctx.fillRect(-300,-300,W+600,H+600);
  glow(ctx,1500,380,760,[255,186,120],0.2);
  // the ground, and the ledge the basin stands on
  ctx.fillStyle="rgba(40,28,20,0.6)";ctx.fillRect(-300,1010,W+600,300);
  ctx.fillStyle="#5d4a3b";ctx.fillRect(820,912,480,200);ctx.fillStyle="#76604d";ctx.fillRect(808,900,504,22);
  ctx.strokeStyle="rgba(255,220,180,0.14)";ctx.lineWidth=2;for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(820,950+k*40);ctx.lineTo(1300,950+k*40+((k%2)?4:-4));ctx.stroke();}
  // the basin, in section: its walls and floor, and the water in it
  const wall=12;ctx.fillStyle="#9a6a3e";ctx.beginPath();ctx.moveTo(B4_BX0-wall,B4_BTOP);ctx.lineTo(B4_BX0,B4_BTOP);ctx.quadraticCurveTo(B4_BX0+6,B4_BBOT-6,B4_BX0+60,B4_BBOT-wall);ctx.lineTo(B4_BX1-60,B4_BBOT-wall);
  ctx.quadraticCurveTo(B4_BX1-6,B4_BBOT-6,B4_BX1,B4_BTOP);ctx.lineTo(B4_BX1+wall,B4_BTOP);ctx.quadraticCurveTo(B4_BX1+4,B4_BBOT+4,B4_BX1-58,B4_BBOT);ctx.lineTo(B4_BX0+58,B4_BBOT);ctx.quadraticCurveTo(B4_BX0-4,B4_BBOT+4,B4_BX0-wall,B4_BTOP);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(255,214,160,0.45)";ctx.lineWidth=2;ctx.stroke();
  const inner=()=>{ctx.beginPath();ctx.moveTo(B4_BX0,B4_WL);ctx.lineTo(B4_BX0+2,B4_WL);ctx.quadraticCurveTo(B4_BX0+6,B4_BBOT-6,B4_BX0+60,B4_BBOT-wall);ctx.lineTo(B4_BX1-60,B4_BBOT-wall);ctx.quadraticCurveTo(B4_BX1-6,B4_BBOT-6,B4_BX1,B4_WL);ctx.closePath();};
  inner();const wg=ctx.createLinearGradient(0,B4_WL,0,B4_BBOT);wg.addColorStop(0,rgba(BA_WATER,0.42));wg.addColorStop(1,rgba([40,90,130],0.6));ctx.fillStyle=wg;ctx.fill();
  // the cup: where it floats, lower as it fills, then down to the floor, tipped a little
  const fb=lerp(30,6,fill),yRim=lerp(B4_WL-fb,B4_BBOT-wall-B4_CUPD-4,ease(sk)),tilt=0.16*ease(sk),cx=B4_CUPX+8*ease(sk);
  ctx.save();ctx.translate(cx,yRim);ctx.rotate(tilt);
  const cup=()=>{ctx.beginPath();ctx.moveTo(-B4_CUPR,0);ctx.quadraticCurveTo(-B4_CUPR,B4_CUPD*1.3,0,B4_CUPD);ctx.quadraticCurveTo(B4_CUPR,B4_CUPD*1.3,B4_CUPR,0);ctx.closePath();};
  // the water inside it, rising from the hole; and the jet through the hole while it's still filling
  const lv=lerp(B4_CUPD-6,6,Math.max(fill,sk));ctx.save();cup();ctx.clip();ctx.fillStyle=rgba(BA_WATER,0.55);ctx.fillRect(-B4_CUPR,lv,B4_CUPR*2,B4_CUPD*2);ctx.restore();
  if(fill<0.98&&sk<0.05&&fill>0.02){const jh=10+4*Math.sin(t*14);ctx.strokeStyle=rgba([220,244,255],0.85);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,B4_CUPD-2);ctx.lineTo(0,Math.max(lv,B4_CUPD-2-jh));ctx.stroke();}
  cup();ctx.lineWidth=5;ctx.strokeStyle="#c9a35c";ctx.stroke();ctx.fillStyle="rgba(201,163,92,0.18)";ctx.fill();
  ctx.fillStyle="#2a1c12";ctx.beginPath();ctx.arc(0,B4_CUPD-1,3.2,0,TAU);ctx.fill();ctx.strokeStyle="#e8c886";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-B4_CUPR,0);ctx.lineTo(B4_CUPR,0);ctx.stroke();
  ctx.restore();
  // as it goes down, a few bubbles rise from it
  if(sk>0.01&&sk<1)for(let k=0;k<4;k++){const u=(sk*1.6+k*0.22)%1,bx=cx+Math.sin(k*2.1+t*3)*20,by=lerp(yRim,B4_WL+6,u);ctx.strokeStyle=rgba([220,244,255],0.7*(1-u));ctx.lineWidth=2;ctx.beginPath();ctx.arc(bx,by,4+k,0,TAU);ctx.stroke();}
  // the water's surface, a line of light, rocked a little by the cup
  ctx.strokeStyle=rgba([220,244,255],0.7);ctx.lineWidth=2.5;ctx.beginPath();for(let x=B4_BX0+2;x<=B4_BX1-2;x+=8){const yy=B4_WL+Math.sin(x*0.05+t*2)*1.2*(1+2*Math.max(0,1-Math.abs(x-cx)/90));x===B4_BX0+2?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();
  // the mirab, his hand on the basin's rim
  ba_fig(ctx,700,1010,1.5,{dress:"robe",head:"turban",f:1,reach:[B4_BX0-4,B4_BTOP+2],t,rimA:0.3});}
scene("turns",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tCy=c("cycle"),tCo=c("complex"),tMi=c("missed"),tLo=c("lots"),tLa=c("last"),tNe=c("needed"),tLv=c("levels"),tMn=c("minutes"),tCl=c("clock"),tSa=c("sank"),tKn=c("knew"),tDe=c("deep"),tLi=c("link");
  // six places, each dissolving into the next as the whole picture changes: the desert from above; the cycle; the village and its
  // lots; the cycle's levels; the water clock; and the levels again
  const bA=fin(t,tCy-1.0,1.2),cA=fin(t,tMi-1.0,1.2),dA=fin(t,tLv-1.0,1.2),eA=fin(t,tCl-1.0,1.2),fA=fin(t,tKn-1.0,1.2);
  // from above: the qanat's chain of shafts, its water reaching the village, and the fields taking it in turn
  if(bA<0.99){setScreen(ctx,S);ctx.save();focus(ctx,t,[[0,900,440,0.8],[2.4,1300,640,1.25]],3.6);
    const tQa=w("edge","a tunnel")-0.2,tTu=w("edge","each owner in turn")-0.3;
    const fill=BA_FIELDS.map((_,i)=>pulseAt(t,tTu+i*0.32,0.9));
    ba_aerial(ctx,t,{warm:0.5,lit:fin(t,tQa,0.6),litP:clamp((t-tQa)/2.4,0,1),flow:1,green:0.66,fill});
    baTagAt(ctx,S,BA_CHAIN[9][0],BA_CHAIN[9][1],"a qanat: a tunnel from the mountains",BAC,{dy:-62,a:fin(t,tQa,0.5)*(1-fin(t,tTu-0.6,0.4))});
    baTagAt(ctx,S,1570,690,"each owner, in turn",BA_WATER,{dy:-40,a:fin(t,tTu+0.2,0.5)*(1-fin(t,tCy-1.2,0.4))});
    ctx.restore();eaYear(ctx,80,80,"Mahan, near Kerman · the twentieth century",CLAY,fin(t,0.5,0.8)*(1-fin(t,tCy-1.4,0.4)));}
  // the cycle: twelve days, a day's fifteen shares; then another qanat, its water through twelve dividers to certain fields in turn
  if(bA>0.01&&cA<0.99)withA(ctx,bA,()=>{histBg(ctx,S,t,{light:0.12});ctx.save();drift(ctx,t,sc,{z:0.015,x:900,y:520});
    // the ring goes round as the voice says the turns make a cycle; its middle names it once the twelve days are said
    const tTw=w("cycle","the turns")-0.2,tTd=w("cycle","twelve days")-0.2,tFi=w("cycle","fifteen shares")-0.2,tWp=w("complex","the water passed")-0.2,tCe=w("complex","certain fields")-0.3;
    const dayA=fin(t,tFi,0.6)*(1-fin(t,tCo-0.4,0.6));
    withA(ctx,fin(t,tCy-0.2,0.6),()=>T(ctx,"one of Mahan's four qanats",B4_CX,170,{w:700,size:30,align:"center",color:rgba(INK,0.95)}));
    b4_cycle(ctx,B4_CX,B4_CY,B4_CR,{p:clamp((t-tTw)/2.2,0,1),lab:1,hi:0,hiA:dayA,mid:"12 days",sub:"the cycle",midA:fin(t,tTd,0.5)});
    // one day, lifted out of the ring: its fifteen shares, joined to the first day by a dashed line from its outer edge
    if(dayA>0.01){withA(ctx,dayA,()=>{const am=-Math.PI/2+Math.PI/12,sx=B4_CX+Math.cos(am)*(B4_CR+18),sy=B4_CY+Math.sin(am)*(B4_CR+18);ctx.save();ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(BA_WATER,0.7);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(1150,362);ctx.stroke();ctx.restore();});
      arrive(ctx,1330,540,t,tFi,()=>withA(ctx,1-fin(t,tCo-0.4,0.6),()=>ba_day(ctx,1330,540,230,{n:15,p:clamp((t-tFi)/1.4,0,1),mid:"a day",sub:"15 shares"})),{dy:12});}
    // another qanat: its channel runs in as the voice says the water passed, and its dividers come up one by one along it
    const lit=B4_DV.map((_,i)=>pulseAt(t,tCe+i*0.42,0.9)),wet=B4_DV.map((_,i)=>lerp(0.32,0.82,fin(t,tCe+i*0.42+0.3,0.6)));
    arrive(ctx,1410,550,t,tCo-0.2,()=>b4_dividers(ctx,t,{p:clamp((t-tWp)/2.0,0,1),lit,wet}),{dy:14});
    withA(ctx,fin(t,tCe+0.2,0.5),()=>tag(ctx,1410,800,"certain fields, at certain times",BA_WATER,{align:"center",size:28}));
    ctx.restore();});
  // the village: a turn missed and a field dry; then, in some small villages, lots drawn each autumn for a place in the cycle, and
  // the water running out before its end; and what every owner needed to know
  if(cA>0.01&&dA<0.99)withA(ctx,cA,()=>{setScreen(ctx,S);ctx.save();
    const tTm=w("missed","A turn missed")-0.2,tDry=w("missed","leave a field dry")-0.3,tSl=w("lots","small villages")-0.3,tDr=w("lots","drew lots")-0.3,tPl=w("lots","their place")-0.6;
    const tWk=w("needed","when their water would come")-0.3,tSt=w("needed","when it would stop")-0.3;
    focus(ctx,t,[[0,1880,736,2.0],[tDry-0.4,1900,740,2.3],[tSl-0.4,1880,760,1.7],[tNe-0.4,1900,742,2.2]],1.8);
    // the turns go along the fields; the third field's turn is missed, and it dries
    const TA=[tTm-0.6,tTm+0.6,null,tTm+2.0],fill=[0,1,2,3].map(i=>TA[i]==null?0:pulseAt(t,TA[i],1.2));
    const dry=fin(t,tDry,2.2);
    b4_village(ctx,t,{wet:[0.86,0.86,lerp(0.86,0.22,dry),0.86],fill,gate:fill,own:[1,1,1,1]});
    const tg=(s_,x,y,col,a,o)=>baTagAt(ctx,S,x,y,s_,col,Object.assign({a},o||{}));
    tg("a turn missed: dry until it comes round",1975,ba_ys(1975)-60,BA_RED,fin(t,tDry+0.2,0.5)*(1-fin(t,tLo-0.6,0.4)),{dy:-30});
    tg("when will my water come?",1640,ba_ys(1640)-48,AMBER,fin(t,tWk,0.5)*(1-fin(t,tLv-1.4,0.4)),{dy:-40});
    tg("and when will it stop?",2150,ba_ys(2150)-48,AMBER,fin(t,tSt,0.5)*(1-fin(t,tLv-1.4,0.4)),{dy:-40});
    ctx.restore();
    // the lots, over the village
    const lA=fin(t,tDr-0.4,0.6)*(1-fin(t,tNe-0.5,0.6)),picks=clamp((t-tPl)/0.42,0,7);
    b4_lots(ctx,t,lA,{n:picks,count:fin(t,tDr,0.4),k:(t-tDr)*5.2,w:0.71*clamp((t-tLa+0.2)/1.4,0,1),dry:fin(t,w("last","usually got none")-0.3,0.5)});
    eaYear(ctx,80,80,"some small villages · each autumn",CLAY,fin(t,tSl,0.6)*(1-fin(t,tNe-0.6,0.5)));});
  // the cycle's levels: days, shares, parts of sixteen minutes, and single minutes where a share was split; then the water clock;
  // then the levels again, an owner's water coming and stopping on its minute, and only as deep as each share needs
  const lad=(L)=>{histBg(ctx,S,t,{light:0.12});ctx.save();drift(ctx,t,sc,{z:0.012,x:960,y:520});b4_ladder(ctx,t,L);};
  // the cycle's bar is there as the line begins, and fills with its days as they're said
  if(dA>0.01&&eA<0.99)withA(ctx,dA,()=>{const tDa=w("levels","its days")-0.6,tSh=w("levels","each day's shares")-0.2,tPa=w("levels","six parts")-0.3,tHe=w("minutes","heirs and buyers")-0.3,tSi=w("minutes","single minutes")-0.3;
    lad({rows:[fin(t,tLv-0.4,0.6),fin(t,tSh,0.5),fin(t,tPa,0.5),fin(t,tSi,0.5)],p:[clamp((t-tDa)/1.2,0,1),clamp((t-tSh)/1.0,0,1),clamp((t-tPa)/0.8,0,1),clamp((t-tSi)/1.0,0,1)],
      open:fin(t,tSh-0.3,0.5),own:fin(t,tHe,0.8),deep:pulseAt(t,tSi+0.6,2.0)});
    withA(ctx,fin(t,tHe+0.3,0.5),()=>{T(ctx,"split among",1490,B4_LY[2]+22,{w:700,size:28,color:rgba(INK,0.9)});T(ctx,"heirs and buyers",1490,B4_LY[2]+60,{w:700,size:28,color:rgba(INK,0.9)});});
    ctx.restore();});
  if(eA>0.01&&fA<0.99)withA(ctx,eA,()=>{setScreen(ctx,S);ctx.save();drift(ctx,t,sc,{z:0.02,x:1000,y:760});
    const tFl=w("clock","a metal cup")-0.2,tSk=w("sank","sank")-0.4;
    b4_clock(ctx,t,{fill:clamp((t-tFl)/(tSk-tFl),0,1),sink:clamp((t-tSk)/0.9,0,1)});
    ctx.restore();
    withA(ctx,fin(t,w("clock","The mirab")-0.1,0.5),()=>tag(ctx,700,500,"the mirab, the water master",BIZ,{align:"center",size:28}));
    withA(ctx,fin(t,w("clock","a water clock")-0.2,0.5),()=>tag(ctx,1060,640,"a water clock",BAC,{align:"center",size:30}));
    withA(ctx,fin(t,tFl+0.3,0.5),()=>tag(ctx,1330,700,"a metal cup, a hole in its base",BA_SAND,{size:28}));
    withA(ctx,fin(t,w("sank","one measure")-0.2,0.5),()=>tag(ctx,1330,790,"filled and sank: one measure",BA_WATER,{size:28}));});
  const tOut=1-fin(t,B-0.2,0.8);if(fA>0.01)withA(ctx,fA,()=>{if(tOut<=0.01){histBg(ctx,S,t,{light:0.12});return;}withA(ctx,tOut,()=>{const tCm=w("knew","when their water would come")-0.3,tSp=w("knew","when it would stop")-0.3,tSm=w("knew","a single minute")-0.3;
    const runs=clamp((t-tCm)/(tSp-tCm),0,1);
    const tNo=w("deep","only as deep")-0.3,lk=fin(t,tLi-0.7,0.5),lt=fin(t,tLi-0.1,0.5);
    lad({rows:[1,1,1,1].map(v=>v*(1-lk)),open:1,own:1,deep:fin(t,tNo,0.6)*(1-lk),water:[3,0,9*runs,fin(t,tCm-0.2,0.4)*(1-fin(t,tNo-0.4,0.6))]});
    withA(ctx,fin(t,tCm,0.4)*(1-fin(t,tNo-0.4,0.6)),()=>tag(ctx,b4_lcx(3,0),B4_LY[3]-44,"comes",BA_WATER,{align:"center",size:28}));
    withA(ctx,fin(t,tSp+0.2,0.4)*(1-fin(t,tNo-0.4,0.6)),()=>tag(ctx,b4_lcx(3,8),B4_LY[3]-44,"stops",BA_WATER,{align:"center",size:28}));
    withA(ctx,fin(t,tSm,0.5)*(1-fin(t,tNo-0.4,0.6)),()=>T(ctx,"down to a single minute in twelve days",960,110,{w:800,size:36,align:"center"}));
    // only as deep as each share needs
    const nA=fin(t,tNo,0.5)*(1-lk);withA(ctx,nA,()=>{T(ctx,"only as deep as each share needs",960,110,{w:800,size:36,align:"center"});
      [[1,"whole shares:","no deeper",SOFT],[2,"whole parts:","no deeper",SOFT],[3,"a split part:","to the minute",BA_WATER]].forEach(([r,a1,a2,col])=>{T(ctx,a1,1490,B4_LY[r]+22,{w:700,size:28,color:rgba(INK,0.9)});T(ctx,a2,1490,B4_LY[r]+60,{w:700,size:28,color:rgba(col,1)});});});
    ctx.restore();
    // at the utility, the same for the business's work
    // the levels leave first; then the line's words come in where they were
    withA(ctx,lt,()=>{T(ctx,"at the utility, the business's work needs",960,400,{w:800,size:40,align:"center"});
      if(t>w("link","its processes drawn in levels")-0.2)arrive(ctx,960,500,t,w("link","its processes drawn in levels")-0.2,()=>tag(ctx,960,500,"its processes, drawn in levels",BA_BUS,{align:"center",size:32}),{dy:10});
      if(t>w("link","only as deep")-0.2)arrive(ctx,960,590,t,w("link","only as deep")-0.2,()=>tag(ctx,960,590,"only as deep as each one needs",BAC,{align:"center",size:32}),{dy:10});});});});
  vign(ctx,S);
  baTitle(ctx,S,t,B+0.6,"Processes, as deep as data needs","in levels, and only as deep as each one needs","Film 4 of 5");});

/* ---------- 2. Where it's born ---------- */
// Tomás's CRUD matrix, as Who creates it, who owns it leaves it: the eight capabilities down the left, five of the concepts across the
// top, and what each capability does with each, the creating squares lit by m.cHi, the capabilities that create by m.capHi
const B4_COLS=[["outage",BA_NET],["connection point",BA_NET],["meter",BA_NET],["account",BA_RET],["bill",BA_RET]];
const B4_CRUD=[["R","R","","",""],["CU","R","R","",""],["R","","UD","",""],["","C","C","R",""],["","","","",""],["","","","R","R"],["R","R","","CRU","CRU"],["R","","","",""]];
const B4_MX0=470,B4_MCW=220,B4_MY0=204,B4_MRH=64;
function b4_matrix(ctx,t,m){const a=m.a==null?1:m.a;if(a<=0.01)return;withA(ctx,a,()=>{const R=B4_MX0+5*B4_MCW,yT=B4_MY0-8,yB=B4_MY0+8*B4_MRH-4;
  for(let i=0;i<8;i+=2){ctx.fillStyle="rgba(255,255,255,0.03)";ctx.fillRect(40,B4_MY0+i*B4_MRH-4,R-40,B4_MRH);}
  ctx.strokeStyle="rgba(255,255,255,0.10)";ctx.lineWidth=1.5;for(let j=0;j<=5;j++){const x=B4_MX0+j*B4_MCW;ctx.beginPath();ctx.moveTo(x,yT);ctx.lineTo(x,yB);ctx.stroke();}
  T(ctx,"CRUD matrix",40,96,{w:800,size:40});
  B4_COLS.forEach(([nm,dc],j)=>sticky(ctx,B4_MX0+j*B4_MCW+B4_MCW/2,150,200,80,nm,{col:NOTEC[2],glass:1,edge:mix(BA_INF,dc,0.35),size:28,rot:0}));
  BA_CAPS.forEach(([nm],i)=>{const cr=B4_CRUD[i].some(s=>s.indexOf("C")>=0);baCap(ctx,40,B4_MY0+i*B4_MRH,400,56,nm,{hi:cr?(m.capHi||0):0,dim:cr?0:(m.dim||0)});
    B4_CRUD[i].forEach((s,j)=>{if(!s)return;const x=B4_MX0+j*B4_MCW+B4_MCW/2,y=B4_MY0+i*B4_MRH+39,cc=s.indexOf("C")>=0;if(cc&&(m.cHi||0)>0.01)glow(ctx,x,y-10,110,BA_STR,0.45*m.cHi);
      T(ctx,s,x,y,{w:800,size:32,align:"center",color:cc?rgba(INK,1):rgba(SOFT,0.85*(1-0.6*(m.dim||0)))});});});});}
scene("note",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
  const tMa=c("matrix"),tPr=c("process"),tCr=w("matrix","which capability creates")-0.2,tCan=w("matrix","what the utility can do")-0.3,tHow=w("matrix","how the work runs")-0.3;
  const mA=lerp(0.25,1,fin(t,tMa-0.5,1.0))*(1-fin(t,tPr-0.2,0.8));
  b4_matrix(ctx,t,{a:mA,cHi:pulseAt(t,tCr,1.8)+0.5*fin(t,tCr+0.9,0.6),capHi:0.7*fin(t,tCan,0.6),dim:0.6*fin(t,tCan,0.6)});
  const nP=Math.min(1,pulseAt(t,w("note","where each concept is born")-0.1,1.6)+pulseAt(t,w("note","which process")-0.1,1.3)+pulseAt(t,w("note","which step")-0.1,1.2));if(nP>0.01)glow(ctx,860,470,380,NOTEC[0],0.2*nP);
  sticky(ctx,860,470,620,170,"Where is it born? "+ba_nb("In which process,")+" "+ba_nb("at which step?"),{col:NOTEC[0],size:36,rot:-0.02,a:1-fin(t,tMa-0.5,0.6)});
  baPersonR(ctx,"tomas",1790,1040,0.74,{t,expr:"calm"});
  ctx.restore();
  withA(ctx,fin(t,tCan,0.5)*(1-fin(t,tPr-0.2,0.6)),()=>tag(ctx,1090,770,"a capability: what the utility can do",BA_STR,{align:"center",size:28}));
  withA(ctx,fin(t,tHow,0.5)*(1-fin(t,tPr-0.2,0.6)),()=>tag(ctx,1090,836,"not how the work runs",AMBER,{align:"center",size:28}));
  withA(ctx,fin(t,Math.max(w("process","the processes")-0.2,tPr+0.5),0.5),()=>tag(ctx,960,540,"how the work runs: the processes",BA_BUS,{align:"center",size:34}));
  vign(ctx,S);});

/* ---------- 3. Four bands ---------- */
// Grace's process map: four bands, each with its processes (ArchiMate process elements, in the business layer's yellow), the work
// customers feel running left to right through the operational band. b4_pmapPos says where each process sits, so a later chapter can
// move them from there. o.p draws the bands in; o.hi[name] lights a process; o.band[k] a band; o.gone[k] (0..1) empties band k, its
// processes left as dashed outlines; o.lvl (0..1) marks each as a macro process, level 1
const B4_PMAP=[["strategic",["set direction","plan the network","manage risk"]],["operational",["connect a home","restore supply","meter to cash"]],
  ["support",["people","finance","technology","fleet and stores"]],["evaluation",["measure reliability","audit","improve"]]];
const B4_PM=[80,150,1500,700],B4_PALL=B4_PMAP.reduce((s,[,ps])=>s.concat(ps),[]);
function b4_pmapPos(x,y,w,h){const bh=[0.2,0.32,0.2,0.2].map(f=>f*(h-36)),pos={},band=[];let yy=y;
  B4_PMAP.forEach(([g,ps],k)=>{band.push([x,yy,w,bh[k]]);const n=ps.length,bx0=x+230,bw=(w-250-(n-1)*24)/n,bhh=Math.min(bh[k]-30,k===1?110:76),by=yy+(bh[k]-bhh)/2+(k===1?6:4);
    ps.forEach((p,i)=>{pos[p]=[bx0+i*(bw+24),by,bw,bhh];});yy+=bh[k]+12;});return{pos,band};}
function b4_pmap(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[x,y,w,h]=B4_PM,{pos,band}=b4_pmapPos(x,y,w,h),hi=o.hi||{};
  withA(ctx,a,()=>{B4_PMAP.forEach(([g,ps],k)=>{const q=o.p==null?1:clamp(o.p*4-k,0,1);if(q<=0)return;const[bx,by,bw,bh]=band[k],bhi=o.band?o.band[k]||0:0,gone=o.gone?o.gone[k]||0:0;
    withA(ctx,q,()=>{ctx.fillStyle=rgba(BA_BUS,0.05+0.07*bhi);rr(ctx,bx,by,bw,bh,12);ctx.fill();ctx.save();if(bhi>0){ctx.shadowColor=rgba(BA_BUS,0.8);ctx.shadowBlur=18*bhi;}ctx.strokeStyle=rgba(BA_BUS,0.3+0.6*bhi);ctx.lineWidth=1.5+1.5*bhi;rr(ctx,bx,by,bw,bh,12);ctx.stroke();ctx.restore();
      T(ctx,g,bx+20,by+40,{f:"mono",w:600,size:28,color:rgba(BA_BUS,0.95)});
      if(k===1){const p0=pos[ps[0]],my=p0[1]+p0[3]/2;ctx.save();ctx.strokeStyle="rgba(255,234,130,0.45)";ctx.lineWidth=3;ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(bx+200,my);ctx.lineTo(bx+bw-14,my);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle="rgba(255,234,130,0.6)";ctx.beginPath();ctx.moveTo(bx+bw-6,my);ctx.lineTo(bx+bw-24,my-10);ctx.lineTo(bx+bw-24,my+10);ctx.closePath();ctx.fill();ctx.restore();}
      ps.forEach(p=>{const[px,py,pw,ph]=pos[p];if(gone>0.01)withA(ctx,gone,()=>ba_ghostBox(ctx,"process",px,py,pw,ph,BA_BUS));if(gone<0.99)archEl(ctx,px,py,pw,ph,p,BA_BUS,"process",{a:1-gone,size:28,gs:12,hi:hi[p]||0});});});});});}
scene("bands",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.015,x:820,y:500});
  const tSo=c("sort"),tOp=c("ops"),tEm=c("empty"),tOn=c("one");
  const tB=["strategic","operational","support","evaluation"].map(s_=>w("map",s_)-0.2),tGr=w("map","Grace's")-0.3;
  const band=tB.map((t0,k)=>pulseAt(t,t0,1.2)+(k===1?fin(t,w("ops","operational band")-0.2,0.5)*(1-fin(t,tEm-0.4,0.6)):0));
  const hi={};B4_PMAP[1][1].forEach((p,i)=>{hi[p]=pulseAt(t,w("ops",["connecting a home","restoring supply","meter to cash"][i])-0.2,1.3);});
  const tD=w("empty","nobody setting direction")-0.3,tMs=w("empty","nobody measuring")-0.3;
  const gone=[fin(t,tD,0.5)*(1-fin(t,tOn-0.6,0.6)),0,0,fin(t,tMs,0.5)*(1-fin(t,tOn-0.6,0.6))];
  const lv=fin(t,w("one","level one")-0.2,0.6);B4_PALL.forEach((p,i)=>{hi[p]=Math.max(hi[p]||0,0.8*pulseAt(t,w("one","These thirteen")-0.1+i*0.08,1.0));});
  b4_pmap(ctx,t,{p:clamp((t-tGr)/2.4,0,1)*1.02,band,hi,gone});
  ctx.restore();
  arrive(ctx,1790,760,t,tGr,()=>withA(ctx,1-fin(t,sc.dur-1.6,1.0),()=>baPersonR(ctx,"grace",1790,1050,0.7,{t,expr:"calm"})),{dy:20});
  // the bands only sort them
  withA(ctx,fin(t,w("sort","only sort them")-0.2,0.5)*(1-fin(t,tOp-0.5,0.5)),()=>tag(ctx,830,62,"bands sort the processes; they aren't elements",BAC,{align:"center",size:28}));
  withA(ctx,fin(t,w("ops","the work customers feel")-0.2,0.5)*(1-fin(t,tEm-0.5,0.5)),()=>tag(ctx,830,62,"the operational band: the work customers feel",BA_BUS,{align:"center",size:28}));
  withA(ctx,fin(t,tD+0.2,0.5)*(1-fin(t,tOn-0.6,0.5)),()=>tag(ctx,830,62,"an empty band: a finding in itself",BA_RED,{align:"center",size:28}));
  withA(ctx,lv,()=>tag(ctx,830,62,"level 1: macro processes, 8 to 15 for a whole organisation",BA_BUS,{align:"center",size:28}));
  vign(ctx,S);});

/* ---------- 4. Levels, and how deep ---------- */
// The tree of levels: the thirteen macro processes in a row (level 1), each with its processes below it (level 2, B4_N2 of them), and
// one branch, under meter to cash, drawn down to a flow of activities (level 3). B4_T1(i) is where macro process i sits.
const B4_N2=[4,5,3,6,7,5,4,3,5,3,3,4,4],B4_T1=i=>[220+i*122,200,110,60],B4_T2=(i,k)=>[220+i*122+7,290+k*30,96,22],B4_MC=5,B4_CR2=1;
const B4_BANDX=[[0,2],[3,5],[6,9],[10,12]];
// the flow under one level-2 process: start, a task, a choice, two tasks and an end, small (texture)
function b4_mini(ctx,cx,cy,a,col){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.fillStyle="rgba(10,14,26,0.95)";ctx.lineWidth=2.5;
  const P=[[cx-170,cy],[cx-100,cy],[cx-10,cy],[cx+80,cy-22],[cx+80,cy+22],[cx+170,cy]];
  ctx.beginPath();ctx.moveTo(cx-158,cy);ctx.lineTo(cx-128,cy);ctx.moveTo(cx-72,cy);ctx.lineTo(cx-34,cy);ctx.moveTo(cx+14,cy);ctx.lineTo(cx+50,cy-22);ctx.moveTo(cx+14,cy);ctx.lineTo(cx+50,cy+22);ctx.moveTo(cx+110,cy-22);ctx.lineTo(cx+158,cy);ctx.moveTo(cx+110,cy+22);ctx.lineTo(cx+158,cy);ctx.stroke();
  ctx.beginPath();ctx.arc(P[0][0],P[0][1],12,0,TAU);ctx.fill();ctx.stroke();rr(ctx,P[1][0]-28,cy-16,56,32,8);ctx.fill();ctx.stroke();
  ctx.save();ctx.translate(P[2][0],cy);ctx.rotate(Math.PI/4);ctx.fillRect(-16,-16,32,32);ctx.strokeRect(-16,-16,32,32);ctx.restore();
  rr(ctx,P[3][0]-28,P[3][1]-14,56,28,8);ctx.fill();ctx.stroke();rr(ctx,P[4][0]-28,P[4][1]-14,56,28,8);ctx.fill();ctx.stroke();ctx.lineWidth=5;ctx.beginPath();ctx.arc(P[5][0],P[5][1],12,0,TAU);ctx.fill();ctx.stroke();ctx.restore();});}
// What the tree shows, from o: o.l1 (0..1) the macro processes in their row (or o.l1R(i), each one's rect while it moves from the
// map); o.l2[i] (0..1) each one's processes; o.deep (0..1) the branch drawn to level 3; o.dash (0..1) the branches not drawn deeper;
// o.labs[k] the levels' names; o.hi2 (0..1) lights the process that goes deeper
function b4_tree(ctx,t,o){o=o||{};const l1=o.l1==null?1:o.l1;
  const lab=(k,s_,y)=>{const v=o.labs?o.labs[k]||0:0;if(v>0.01)withA(ctx,v,()=>T(ctx,s_,40,y,{f:"mono",w:600,size:28,color:rgba(BA_BUS,0.95)}));};
  lab(0,"level 1",240);lab(1,"level 2",330);lab(2,"level 3",640);lab(3,"level 4",740);
  // the processes under each macro process, and the dashed foot of each branch not drawn deeper
  for(let i=0;i<13;i++){const v=o.l2?o.l2[i]||0:0;if(v<=0.01)continue;const n=B4_N2[i],[x1,y1,w1]=B4_T1(i);
    withA(ctx,v,()=>{ctx.strokeStyle=rgba(BA_BUS,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1+w1/2,y1+60);ctx.lineTo(x1+w1/2,284);ctx.stroke();
      for(let k=0;k<n;k++){const q=clamp(v*n-k,0,1);if(q<=0)break;const[x,y,ww,hh]=B4_T2(i,k),hi=i===B4_MC&&k===B4_CR2?(o.hi2||0):0;
        ctx.fillStyle=rgba(mix(BA_BUS,BA_RED,0.6*hi),0.16+0.3*hi);rr(ctx,x,y,ww*q,hh,6);ctx.fill();ctx.strokeStyle=rgba(mix(BA_BUS,BA_RED,0.6*hi),0.6+0.4*hi);ctx.lineWidth=1.5+1.5*hi;rr(ctx,x,y,ww*q,hh,6);ctx.stroke();
        if(hi>0.01)glow(ctx,x+ww/2,y+hh/2,70,BA_RED,0.35*hi);}
      const ds=o.dash||0;if(ds>0.01&&!(i===B4_MC&&(o.deep||0)>0.5))withA(ctx,ds*v,()=>{const[x,y,ww]=B4_T2(i,n);ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=2;rr(ctx,x,y+2,ww,18,6);ctx.stroke();ctx.restore();});});}
  // the one branch drawn down to level 3: its line comes down to a bracket over the whole flow, which it opens
  const dp=o.deep||0;if(dp>0.01){const[x,y,ww,hh]=B4_T2(B4_MC,B4_CR2),cx=x+ww/2,col=mix(BA_BUS,BA_RED,0.5*(o.hi2||0));withA(ctx,dp,()=>{ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+ww,y+hh/2);ctx.lineTo(x+ww+16,y+hh/2);ctx.lineTo(x+ww+16,588);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx-14,598);ctx.lineTo(cx-14,588);ctx.lineTo(cx+354,588);ctx.lineTo(cx+354,598);ctx.stroke();});
    b4_mini(ctx,cx+170,640,dp,col);}
  // the macro processes, in their row: too small there for their names, which fade as they leave the map (r.ta, 0..1), at full size
  for(let i=0;i<13;i++){const r=o.l1R?o.l1R(i):null,a=r?r.a:l1;if(a<=0.01)continue;const[x,y,ww,hh]=r?[r.x,r.y,r.w,r.h]:B4_T1(i),ta=r&&r.ta!=null?r.ta:0;
    archEl(ctx,x,y,ww,hh,"",BA_BUS,"process",{a,gs:r?r.gs:8,hi:o.hi1?o.hi1[i]||0:0});
    if(ta>0.01)withA(ctx,a*ta,()=>{const nm=B4_PALL[i],ls=wrapT(ctx,nm,0,0,ww-64,{size:28,w:700,measure:true});wrapT(ctx,nm,x+ww/2-8,y+hh/2+10-(ls.length-1)*16,ww-64,{size:28,w:700,align:"center",color:rgba(INK,0.96),lh:32});});}}
scene("levels",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.015,x:820,y:500});
  const tTh=c("three"),tAp=c("apqc"),tBr=c("breadth"),tPa=c("pain"),tSa=c("says"),tMa=c("mahan");
  // the map's macro processes move into a row, the first level of the tree; the bands' names go with them
  const{pos,band}=b4_pmapPos(...B4_PM),mv=i=>ease(clamp((t-0.3-i*0.04)/1.5,0,1)),bandA=1-fin(t,0.2,0.8);
  if(bandA>0.01)withA(ctx,bandA,()=>band.forEach(([bx,by,bw,bh])=>{ctx.fillStyle=rgba(BA_BUS,0.05);rr(ctx,bx,by,bw,bh,12);ctx.fill();ctx.strokeStyle=rgba(BA_BUS,0.3);ctx.lineWidth=1.5;rr(ctx,bx,by,bw,bh,12);ctx.stroke();}));
  B4_PMAP.forEach(([g],k)=>{const u=mv(B4_BANDX[k][0]),[bx,by]=band[k],x0=B4_T1(B4_BANDX[k][0])[0];T(ctx,g,lerp(bx+20,x0,u),lerp(by+40,182,u),{f:"mono",w:600,size:28,color:rgba(BA_BUS,0.95)});});
  // level 2 under meter to cash, then everywhere; level 3 as an example, then only where it hurts; and the branches not drawn deeper
  const tL2=w("two","Level two")-0.2,tEx=w("three","drawn as a flow")-0.4,tL4=w("three","Level four")-0.2,tOut=w("three","stays out")-0.3;
  const ex=fin(t,tEx,0.6)*(1-fin(t,tBr-0.3,0.6)),deep=Math.max(ex,fin(t,w("pain","level three only")-0.3,0.6));
  const l2=B4_N2.map((_,i)=>i===B4_MC?fin(t,tL2+0.3,0.9):fin(t,w("breadth","everywhere")-0.6+i*0.07,0.8));
  b4_tree(ctx,t,{l1R:i=>{const p=pos[B4_PALL[i]],q=B4_T1(i),u=mv(i);return{x:lerp(p[0],q[0],u),y:lerp(p[1],q[1],u),w:lerp(p[2],q[2],u),h:lerp(p[3],q[3],u),ta:1-clamp(u/0.3,0,1),gs:lerp(12,8,u),a:1};},
    l2,deep,dash:fin(t,w("says","weren't drawn deeper")-0.3,0.8),hi2:fin(t,w("pain","what hurts")-0.3,0.6),
    labs:[fin(t,0.9,0.6),fin(t,tL2,0.5),fin(t,tEx,0.5),fin(t,tL4,0.5)*(1-fin(t,tBr-0.3,0.6))],hi1:B4_PALL.map((_,i)=>i===B4_MC?0.6*fin(t,tL2,0.6):0)});
  // level 4: each task, kept out of the model
  const l4=fin(t,tL4,0.5)*(1-fin(t,tBr-0.3,0.6));if(l4>0.01)withA(ctx,l4,()=>{const x=700,y=708;ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=2;rr(ctx,x,y,220,48,10);ctx.stroke();ctx.restore();
    T(ctx,"tasks",x+110,y+34,{w:700,size:28,align:"center",color:rgba(SOFT,1)});kt_rcross(ctx,x+250,y+24,16,fin(t,tOut,0.4));
    withA(ctx,fin(t,tOut,0.5),()=>tag(ctx,x+290,y+24,"out of the model",BA_RED,{size:28}));});
  ctx.restore();
  // what level 2 is
  const cA=fin(t,tL2+0.4,0.6)*(1-fin(t,tBr-0.3,0.6));if(cA>0.01)withA(ctx,cA,()=>{glass(ctx,1300,560,560,300,20,BA_BUS,{glow:14,ea:0.85,fill:"rgba(8,12,22,0.95)"});
    T(ctx,"level 2 · a process",1330,612,{f:"mono",w:500,size:28,color:rgba(BA_BUS,1)});
    [["a trigger",w("two","a trigger")],["an output",w("two","an output")],["one person accountable",w("two","one person accountable")]].forEach(([s_,t0],k)=>withA(ctx,fin(t,t0-0.2,0.4),()=>T(ctx,s_,1330,670+k*46,{w:700,size:32})));
    withA(ctx,fin(t,w("two","three to eight")-0.2,0.5),()=>T(ctx,"3 to 8 under each macro process",1330,826,{w:600,size:28,color:rgba(SOFT,1)}));});
  // which macro process the example opens: meter to cash, named above its chip
  const mcA=fin(t,tL2,0.5);if(mcA>0.01)withA(ctx,mcA,()=>{const[x,y,ww]=B4_T1(B4_MC),cx=x+ww/2;ctx.strokeStyle=rgba(BA_BUS,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,152);ctx.lineTo(cx,y-4);ctx.stroke();
    tag(ctx,cx,130,"meter to cash",BA_BUS,{align:"center",size:28});});
  // the reference
  const aA=fin(t,w("apqc","APQC's process framework")-0.3,0.5)*(1-fin(t,tBr-0.3,0.6));if(aA>0.01)withA(ctx,aA,()=>{glass(ctx,40,770,690,96,18,BAC,{glow:12,ea:0.8,fill:"rgba(8,12,22,0.95)"});
    T(ctx,"drawn from APQC's process framework",64,812,{w:700,size:28});T(ctx,"which has a version for utilities",64,848,{w:600,size:28,color:rgba(SOFT,1)});});
  // breadth first, depth on pain, and the map saying what wasn't drawn deeper
  withA(ctx,fin(t,w("breadth","Breadth first")-0.2,0.5)*(1-fin(t,tMa-0.5,0.5)),()=>tag(ctx,830,62,"breadth first: levels 1 and 2, everywhere",BA_BUS,{align:"center",size:28}));
  withA(ctx,fin(t,w("pain","where someone can name what hurts")-0.3,0.5)*(1-fin(t,tMa-0.5,0.5)),()=>tag(ctx,1055,706,"where it hurts",BA_RED,{align:"center",size:28}));
  withA(ctx,fin(t,w("says","weren't drawn deeper")-0.2,0.5),()=>{ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=2;rr(ctx,40,786,60,24,6);ctx.stroke();ctx.restore();T(ctx,"not drawn deeper",116,808,{w:700,size:28,color:rgba(SOFT,1)});});
  // as in Mahan: days and shares everywhere, minutes only where a share is split
  const mA=fin(t,w("mahan","As in Mahan")-0.2,0.6);if(mA>0.01)withA(ctx,mA,()=>{glass(ctx,1300,560,560,306,20,BAC,{glow:14,ea:0.8,fill:"rgba(8,14,24,0.95)"});
    T(ctx,"as in Mahan",1330,608,{w:800,size:32});
    // the days, each with its shares under it; one share opened into its six parts, and one part split to the minute
    for(let d=0;d<12;d++){const x=1330+d*40;ctx.fillStyle=rgba(mix(BA_SAND,[255,255,255],0.12*(d%2)),0.5);ctx.fillRect(x,632,34,22);ctx.fillStyle=rgba(BA_SAND,0.3);ctx.fillRect(x+3,662,28,10);}
    const dx=1330+6*40,mp=fin(t,w("mahan","minutes only")-0.3,0.6),px=dx+17-66;ctx.strokeStyle=rgba(BA_WATER,0.6+0.4*mp);ctx.lineWidth=2;ctx.strokeRect(dx+2,660,30,14);
    withA(ctx,mp,()=>{for(let k=0;k<6;k++){ctx.fillStyle=rgba(k===5?BA_WATER:BA_SAND,k===5?0.6:0.5);ctx.fillRect(px+k*22,690,18,12);}for(let k=0;k<16;k++){ctx.fillStyle=rgba(BA_WATER,0.75);ctx.fillRect(px+5*22+9-64+k*8,714,6,12);}glow(ctx,px+5*22+9,716,70,BA_WATER,0.4);});
    T(ctx,"days and shares everywhere,",1330,780,{w:600,size:28,color:rgba(INK,0.92)});T(ctx,"minutes only where a share is split",1330,818,{w:600,size:28,color:rgba(BA_WATER,1)});});
  vign(ctx,S);});

/* ---------- 5. Meter to cash ---------- */
// Meter to cash, opened: the macro process at the top, its five processes at level 2 in a row below it, each named
const B4_L2=["read meters","check readings","make bills","collect payments","answer billing questions"],B4_RX=k=>80+k*318,B4_RY=300,B4_RW=300,B4_RH=100,B4_HD=[646,108,440,88];
// what the row shows: o.l2R(k) each process's rect while it moves from the tree (else in place); o.names (0..1, or k=>0..1 for each);
// o.hi[k], o.dim[k];
// o.head (0..1) the macro process; o.link (0..1) the lines from it to each process
function b4_row(ctx,t,o){o=o||{};const hd=o.headR?o.headR():{x:B4_HD[0],y:B4_HD[1],w:B4_HD[2],h:B4_HD[3],sz:32,gs:13,a:o.head==null?1:o.head};
  const lk=o.link||0;if(lk>0.01)withA(ctx,lk,()=>{ctx.strokeStyle=rgba(BA_BUS,0.45);ctx.lineWidth=2.5;B4_L2.forEach((_,k)=>{const x=B4_RX(k)+B4_RW/2;ctx.beginPath();ctx.moveTo(B4_HD[0]+B4_HD[2]/2,B4_HD[1]+B4_HD[3]);ctx.lineTo(B4_HD[0]+B4_HD[2]/2,250);ctx.lineTo(x,250);ctx.lineTo(x,B4_RY);ctx.stroke();});});
  if(hd.a>0.01)archEl(ctx,hd.x,hd.y,hd.w,hd.h,"meter to cash",BA_BUS,"process",{a:hd.a,size:hd.sz,gs:hd.gs,deco:hd.sz<28?1:0,hi:o.headHi||0});
  B4_L2.forEach((nm,k)=>{const r=o.l2R?o.l2R(k):null,x=r?r.x:B4_RX(k),y=r?r.y:B4_RY,ww=r?r.w:B4_RW,hh=r?r.h:B4_RH,dm=o.dim?o.dim[k]||0:0,a=(r?r.a:1)*(1-0.7*dm);if(a<=0.01)return;
    const nA=o.names==null?1:typeof o.names==="function"?o.names(k):o.names,hi=o.hi?o.hi[k]||0:0;
    withA(ctx,a,()=>{glass(ctx,x,y,ww,hh,16,BA_BUS,{glow:12+16*hi,ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(BA_BUS,0.14+0.14*hi);rr(ctx,x,y,ww,hh,16);ctx.fill();
      if(hi>0.01){ctx.save();ctx.strokeStyle=rgba(o.hiCol||BA_BUS,0.95*hi);ctx.lineWidth=4;ctx.shadowColor=rgba(o.hiCol||BA_BUS,0.8);ctx.shadowBlur=16;rr(ctx,x-7,y-7,ww+14,hh+14,20);ctx.stroke();ctx.restore();}
      if(ww>200){archGlyph(ctx,"process",x+ww-25,y+22,12,BA_BUS);if(nA>0.01)withA(ctx,nA,()=>wrapT(ctx,nm,x+ww/2-8,y+hh/2+10-(tw(ctx,nm,30,700)>ww-60?16:0),ww-60,{size:30,w:700,align:"center",lh:34,color:rgba(INK,0.96)}));}});});}
// a concept the processes read and write, as a note in the information layer's salmon, glass once it's on the map; o.dash: not on
// the map yet; o.born (0..1): where it's born, marked under it
const B4_CON={reading:[300,640,"meter reading",BA_NET],account:[875,640,"account",BA_RET],bill:[1190,640,"bill",BA_RET],payment:[1510,640,"payment",BA_RET]};
function b4_con(ctx,id,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[x,y,nm,dc]=B4_CON[id];
  withA(ctx,a,()=>{if(o.dash){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(BA_INF,0.95);ctx.lineWidth=3;rr(ctx,x-110,y-38,220,76,10);ctx.stroke();ctx.restore();ctx.fillStyle=rgba(BA_INF,0.08);rr(ctx,x-110,y-38,220,76,10);ctx.fill();
      T(ctx,nm,x,y+10,{w:700,size:28,align:"center",color:rgba(BA_INF,1)});}
    else sticky(ctx,x,y,220,76,nm,{col:NOTEC[2],glass:1,edge:mix(BA_INF,dc,0.35),size:28,rot:0});
    if((o.hi||0)>0.01)glow(ctx,x,y,150,BA_INF,0.3*o.hi);
    const b=o.born||0;if(b>0.01)withA(ctx,b,()=>tag(ctx,x,y+72,"born here",BA_OK,{align:"center",size:28}));});}
// ArchiMate's access line from a process to a concept: dashed, its arrowhead on the concept where the process writes it, on the
// process where it only reads; o.first (0..1): the first write, drawn solid and lit
function b4_acc(ctx,k,id,p,o){o=o||{};if(p<=0.01)return;const[x1,y1]=B4_CON[id],x0=B4_RX(k)+B4_RW/2+(o.dx||0),y0=B4_RY+B4_RH,wr=!!o.write,fi=o.first||0,ya=y1-38;
  const col=mix(BA_INF,[255,255,255],0.25*fi);ctx.save();ctx.globalAlpha*=clamp(p*1.5,0,1);ctx.strokeStyle=rgba(col,0.75+0.25*fi);ctx.lineWidth=2.4+1.6*fi;if(fi<0.5)ctx.setLineDash([9,8]);if(fi>0.01){ctx.shadowColor=rgba(BA_INF,0.7*fi);ctx.shadowBlur=12*fi;}
  const u=clamp(p,0,1),xm=lerp(x0,x1,u),ym=lerp(y0,ya,u);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xm,ym);ctx.stroke();ctx.setLineDash([]);
  if(u>=1){const[hx,hy,an]=wr?[x1+(x0-x1)*0.0,ya,Math.atan2(ya-y0,x1-x0)]:[x0,y0,Math.atan2(y0-ya,x0-x1)];ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(hx-Math.cos(an-0.4)*14,hy-Math.sin(an-0.4)*14);ctx.lineTo(hx-Math.cos(an+0.4)*14,hy-Math.sin(an+0.4)*14);ctx.closePath();ctx.fill();}
  ctx.restore();}
// A SIPOC, for one process: who supplies it, what comes in, the process, what goes out and to whom, with its trigger and its owner
function b4_sipoc(ctx,x,y,w,h,a,o){if(a<=0.01)return;o=o||{};withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,BA_BUS,{glow:14,ea:0.85,fill:"rgba(8,12,22,0.96)"});
  const C=[["S","supplier","read meters",BA_BUS],["I","input","readings",BA_INF],["P","process","check readings",BA_BUS],["O","output","readings",BA_INF],["C","customer","make bills",BA_BUS]],cw=(w-60)/5;
  C.forEach(([l,nm,it,col],k)=>{const cx=x+30+cw*(k+0.5),q=o.cols?o.cols[k]||0:1;withA(ctx,q,()=>{T(ctx,l,cx,y+82,{w:800,size:56,align:"center",color:rgba(BA_BUS,1)});T(ctx,nm,cx,y+124,{f:"mono",w:500,size:28,align:"center",color:rgba(SOFT,1)});
    const hi=o.hiCol?o.hiCol[k]||0:0;if(hi>0.01)glow(ctx,cx,y+180,110,col,0.35*hi);wrapT(ctx,it,cx,y+190,cw-30,{size:30,w:700,align:"center",lh:34,color:rgba(mix(INK,col,0.3),1)});});
    if(k<4){ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+30+cw*(k+1),y+40);ctx.lineTo(x+30+cw*(k+1),y+250);ctx.stroke();}});
  withA(ctx,o.foot||0,()=>{ctx.strokeStyle=rgba(BA_BUS,0.3);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+30,y+272);ctx.lineTo(x+w-30,y+272);ctx.stroke();
    T(ctx,"trigger: each billing day",x+40,y+322,{w:700,size:30});T(ctx,"owner: metering lead",x+w-40,y+322,{w:700,size:30,align:"right",color:rgba(TRUST,1)});});});}
scene("cash",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.012,x:860,y:480});
  const tFi=c("five"),tSi=c("sipoc"),tOb=c("objects"),tBo=c("born"),tMs=c("missing");
  // the tree as the chapter before leaves it, everything but meter to cash leaving; meter to cash moves to the top, its five
  // processes into a row below it
  const off=fin(t,0.1,0.7),mv=ease(clamp((t-0.5)/1.5,0,1)),mvK=k=>ease(clamp((t-0.6-k*0.06)/1.5,0,1));
  if(off<0.99)withA(ctx,1-off,()=>{b4_tree(ctx,t,{l1R:i=>i===B4_MC?{a:0}:{x:B4_T1(i)[0],y:200,w:110,h:60,sz:20,gs:8,a:1},l2:B4_N2.map((_,i)=>i===B4_MC?0:1),deep:1,dash:1,hi2:1,labs:[1,1,1,0]});
    T(ctx,"not drawn deeper",116,808,{w:700,size:28,color:rgba(SOFT,1)});ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=2;rr(ctx,40,786,60,24,6);ctx.stroke();ctx.restore();
    B4_PMAP.forEach(([g],k)=>T(ctx,g,B4_T1(B4_BANDX[k][0])[0],182,{f:"mono",w:600,size:28,color:rgba(BA_BUS,0.95)}));});
  const hd=()=>{const[x0,y0,w0,h0]=B4_T1(B4_MC);return{x:lerp(x0,B4_HD[0],mv),y:lerp(y0,B4_HD[1],mv),w:lerp(w0,B4_HD[2],mv),h:lerp(h0,B4_HD[3],mv),sz:mv<0.98?lerp(20,32,mv)*(mv>0.5?1:1):32,gs:lerp(8,13,mv),a:1};};
  const tP=w("five","read meters")-0.3,nameT=k=>w("five",B4_L2[k])-0.2;
  // the SIPOC for check readings
  const sA=fin(t,tSi-0.2,0.6)*(1-fin(t,tOb-0.5,0.6)),tS=w("sipoc","who supplies it")-0.2;
  const hiRow=B4_L2.map((_,k)=>(k===1?sA:0));
  b4_row(ctx,t,{headR:hd,l2R:k=>{const[x0,y0,w0,h0]=B4_T2(B4_MC,k),u=mvK(k);return{x:lerp(x0,B4_RX(k),u),y:lerp(y0,B4_RY,u),w:lerp(w0,B4_RW,u),h:lerp(h0,B4_RH,u),a:1};},
    names:k=>fin(t,nameT(k),0.4),link:fin(t,1.8,0.6),hi:B4_L2.map((_,k)=>Math.max(pulseAt(t,nameT(k),1.0),hiRow[k])),headHi:pulseAt(t,w("m2c","Meter to cash")-0.1,1.4)});
  // names, as the narration gives them: each fades in as it's named
  ctx.restore();ctx.save();drift(ctx,t,sc,{z:0.012,x:860,y:480});
  withA(ctx,fin(t,w("m2c","one macro process")-0.2,0.5),()=>tag(ctx,B4_HD[0]-24-tw(ctx,"level 1",28,700)-26,B4_HD[1]+44,"level 1",BA_BUS,{size:28}));
  withA(ctx,fin(t,w("m2c","from a meter's reading")-0.2,0.5),()=>tag(ctx,B4_HD[0]+B4_HD[2]+24,B4_HD[1]+44,"a reading → a paid bill",BAC,{size:28}));
  withA(ctx,fin(t,w("five","At level two")-0.2,0.5),()=>tag(ctx,B4_RX(4)+B4_RW+24,B4_RY-30,"level 2",BA_BUS,{size:28}));
  if(sA>0.01){const k=1,x=B4_RX(k)+B4_RW/2;withA(ctx,sA,()=>{ctx.strokeStyle=rgba(BA_BUS,0.6);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,B4_RY+B4_RH);ctx.lineTo(x,470);ctx.stroke();});
    arrive(ctx,860,640,t,tSi-0.2,()=>b4_sipoc(ctx,100,470,1540,360,1-fin(t,tOb-0.5,0.6),{cols:[0,1,2,3,4].map(k=>fin(t,tS+[0,0.6,0.9,1.3,1.8][k],0.4)),hiCol:[0,1,0,1,0].map(v=>v*pulseAt(t,w("sipoc","what comes in")-0.1,2.4)),foot:fin(t,w("sipoc","its trigger")-0.3,0.6)}),{dy:14});}
  // the concepts they read and write, and where each is born: the first process that writes it
  const oA=fin(t,tOb,0.6),cHi=id=>pulseAt(t,w("objects",{reading:"readings",account:"accounts",bill:"bills"}[id])-0.2,1.2);
  const fR=fin(t,w("born","readings in reading meters")-0.3,0.6),fB=fin(t,w("born","bills in making bills")-0.3,0.6),fP=fin(t,w("missing","born in collecting")-0.3,0.6);
  if(oA>0.01){b4_acc(ctx,0,"reading",oA,{write:1,first:fR});b4_acc(ctx,1,"reading",oA,{dx:-40});b4_acc(ctx,2,"reading",oA,{dx:-60});b4_acc(ctx,2,"account",oA,{dx:-10});b4_acc(ctx,2,"bill",oA,{write:1,first:fB,dx:40});
    b4_acc(ctx,3,"bill",oA,{dx:-40});b4_acc(ctx,4,"account",oA,{dx:-60});
    ["reading","account","bill"].forEach(id=>b4_con(ctx,id,{a:oA,hi:cHi(id),born:id==="reading"?fR:id==="bill"?fB:0}));}
  const pA=fin(t,w("missing","the payment")-0.3,0.6);if(pA>0.01){b4_acc(ctx,3,"payment",pA,{write:1,first:fP,dx:40});b4_con(ctx,"payment",{a:pA,dash:1,born:fP});
    withA(ctx,fin(t,w("missing","wasn't on the map yet")-0.3,0.5),()=>tag(ctx,B4_CON.payment[0],B4_CON.payment[1]+132,"not on the map yet",BA_RED,{align:"center",size:28}));}
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Where it hurts ---------- */
// a meter, small and plain: a box with its dial; o.out: no reading tonight; o.bad: its reading fails a check
function b4_meter(ctx,x,y,o){o=o||{};ctx.save();ctx.fillStyle="rgba(26,30,40,0.95)";rr(ctx,x-34,y-46,68,92,10);ctx.fill();ctx.strokeStyle=rgba(o.out?BA_RED:BA_NET,0.8);ctx.lineWidth=2.5;rr(ctx,x-34,y-46,68,92,10);ctx.stroke();
  ctx.fillStyle=rgba(o.out?[90,60,60]:[120,200,160],0.9);rr(ctx,x-22,y-32,44,24,5);ctx.fill();ctx.strokeStyle=rgba(SOFT,0.6);ctx.beginPath();ctx.arc(x,y+18,12,0,TAU);ctx.stroke();ctx.restore();}
// a household's bills, month by month: three estimates, then the one that caught up all at once (o.p shows them in turn)
function b4_bills(ctx,t,x,y,a,o){if(a<=0.01)return;o=o||{};withA(ctx,a,()=>{glass(ctx,x,y,760,400,20,BA_RET,{glow:12,ea:0.8,fill:"rgba(10,8,14,0.95)"});
  T(ctx,"one household's bills",x+30,y+52,{w:700,size:30});const base=y+340,H_=[78,86,82,250],M=["Nov","Dec","Jan","Feb"];
  for(let k=0;k<4;k++){const q=clamp((o.p||0)*4-k,0,1);if(q<=0)break;const bx=x+60+k*170,hh=H_[k]*ease(q),col=k<3?AMBER:BA_RED;
    ctx.fillStyle=rgba(col,0.5);rr(ctx,bx,base-hh,120,hh,8);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;rr(ctx,bx,base-hh,120,hh,8);ctx.stroke();
    T(ctx,M[k],bx+60,base+40,{w:700,size:28,align:"center",color:rgba(SOFT,1)});if(k<3&&q>0.6)T(ctx,"E",bx+60,base-hh/2+11,{w:800,size:32,align:"center"});}
  withA(ctx,clamp((o.p||0)*4-2.6,0,1),()=>T(ctx,"E: an estimate",x+560,y+52,{w:600,size:28,color:rgba(AMBER,1)}));});}
// What BPMN draws, in its own shapes: a step (a task, a rounded box), their order (sequence flows, arrows) and a choice (a gateway, a
// diamond with an X, its flows leaving it to one task or another). o.st, o.or, o.ch (0..1) bring each in as the voice names it
function b4_legend(ctx,x,y,o){o=o||{};const col=[200,214,240],st=o.st||0,or=o.or||0,ch=o.ch||0;if(st+or+ch<=0.01)return;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  const box=(bx,by,bw,bh,a)=>{if(a<=0.01)return;withA(ctx,a,()=>glass(ctx,bx,by,bw,bh,14,col,{glow:8,ea:0.8,fill:"rgba(10,14,26,0.95)"}));};
  const arrow=(x0,y0,x1,y1,a)=>{if(a<=0.01)return;const u=clamp(a,0,1),xe=lerp(x0,x1,u),ye=lerp(y0,y1,u),an=Math.atan2(y1-y0,x1-x0);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();
    if(u>=1){ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an-0.45)*14,y1-Math.sin(an-0.45)*14);ctx.lineTo(x1-Math.cos(an+0.45)*14,y1-Math.sin(an+0.45)*14);ctx.closePath();ctx.fill();}};
  // the steps: one before the choice, one on each way out of it
  box(x,y-40,170,80,st);box(x+480,y-90,140,60,st*(0.5+0.5*ch));box(x+480,y+30,140,60,st*(0.5+0.5*ch));
  // their order: the flow from the first step to the choice
  arrow(x+170,y,x+322,y,clamp(or*1.4,0,1));
  // the choice: the gateway, and a flow to each step after it
  if(ch>0.01)withA(ctx,clamp(ch*2,0,1),()=>{const gx=x+370;ctx.save();ctx.translate(gx,y);ctx.rotate(Math.PI/4);ctx.fillStyle="rgba(10,14,26,0.95)";ctx.fillRect(-34,-34,68,68);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.strokeRect(-34,-34,68,68);ctx.restore();
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(gx-12,y-12);ctx.lineTo(gx+12,y+12);ctx.moveTo(gx+12,y-12);ctx.lineTo(gx-12,y+12);ctx.stroke();});
  arrow(x+418,y-8,x+478,y-58,clamp(ch*1.6-0.5,0,1));arrow(x+418,y+8,x+478,y+58,clamp(ch*1.6-0.5,0,1));
  // what each is, under it
  withA(ctx,st,()=>T(ctx,"a step",x+85,y+130,{w:700,size:28,align:"center",color:rgba(INK,0.92)}));withA(ctx,or,()=>T(ctx,"their order",x+246,y+130,{w:700,size:28,align:"center",color:rgba(INK,0.92)}));
  withA(ctx,ch,()=>T(ctx,"a choice",x+410,y+130,{w:700,size:28,align:"center",color:rgba(INK,0.92)}));ctx.restore();}
scene("pain",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.012,x:860,y:480});
  const tFa=c("farah"),tNi=c("nightly"),tWe=c("weeks"),tDe=c("deeper");
  // the concepts leave; only check readings stays lit
  const off=fin(t,0.1,0.8),one=fin(t,w("one","one branch")-0.2,0.6);
  if(off<0.99)withA(ctx,1-off,()=>{["reading","account","bill"].forEach(id=>b4_con(ctx,id,{born:id==="reading"||id==="bill"?1:0}));b4_con(ctx,"payment",{dash:1,born:1});
    b4_acc(ctx,0,"reading",1,{write:1,first:1});b4_acc(ctx,1,"reading",1,{dx:-40});b4_acc(ctx,2,"reading",1,{dx:-60});b4_acc(ctx,2,"account",1,{dx:-10});b4_acc(ctx,2,"bill",1,{write:1,first:1,dx:40});b4_acc(ctx,3,"bill",1,{dx:-40});b4_acc(ctx,4,"account",1,{dx:-60});b4_acc(ctx,3,"payment",1,{write:1,first:1,dx:40});
    tag(ctx,B4_CON.payment[0],B4_CON.payment[1]+132,"not on the map yet",BA_RED,{align:"center",size:28});});
  const deep=fin(t,w("deeper","level three")-0.3,0.6);
  b4_row(ctx,t,{head:1-0.6*one,link:1-0.6*one,hi:[0,Math.max(one,deep),0,0,0],hiCol:mix(BA_BUS,BA_RED,0.5),dim:[1,0,1,1,1].map(v=>v*one)});
  withA(ctx,1-off,()=>{tag(ctx,B4_HD[0]-24-tw(ctx,"level 1",28,700)-26,B4_HD[1]+44,"level 1",BA_BUS,{size:28});tag(ctx,B4_HD[0]+B4_HD[2]+24,B4_HD[1]+44,"a reading → a paid bill",BAC,{size:28});tag(ctx,B4_RX(4)+B4_RW+24,B4_RY-30,"level 2",BA_BUS,{size:28});});
  // last winter's complaints, as Farah found them
  const fA=fin(t,w("farah","complaints about bills doubled")-0.3,0.6)*(1-fin(t,tNi-0.5,0.6));
  if(fA>0.01){arrive(ctx,380,560,t,w("farah","complaints about bills doubled")-0.3,()=>withA(ctx,fA,()=>baCount(ctx,100,460,560,200,"×2","complaints about bills","last winter",BA_RET)),{dy:12});
    if(t>w("farah","two in three")-0.3)arrive(ctx,1010,560,t,w("farah","two in three")-0.3,()=>withA(ctx,fA,()=>baCount(ctx,700,460,620,200,"2 in 3","about estimated bills","Farah, reading them",BA_RED)),{dy:12});}
  arrive(ctx,1790,760,t,w("farah","Farah")-0.4,()=>baPersonR(ctx,"farah",1790,1050,0.7,{t,expr:"calm"}),{dy:20});
  // every night, a reading from each meter; one sends none, one fails a check, and the bill uses an estimate
  const nA=fin(t,tNi-0.2,0.6)*(1-fin(t,tWe-0.5,0.6)),tSe=w("nightly","send a reading")-0.2,tDn=w("nightly","When one doesn't")-0.2,tFl=w("nightly","fails a check")-0.2,tEs=w("nightly","uses an estimate")-0.3;
  if(nA>0.01)withA(ctx,nA,()=>{tag(ctx,100,500,"every night",BA_NET,{size:28});
    for(let k=0;k<5;k++){const x=150+k*120,y=720,out=k===2&&t>tDn,bad=k===4;b4_meter(ctx,x,y,{out});
      // its reading, up to read meters
      if(!(k===2&&t>tDn)){const u=clamp((t-tSe-k*0.12)/1.2,0,1);if(u>0&&u<1){const px=lerp(x,B4_RX(0)+B4_RW/2,u),py=lerp(y-46,B4_RY+B4_RH,u);glow(ctx,px,py,22,bad&&t>tFl-0.6?BA_RED:BA_NET,0.8);}}
      if(out)withA(ctx,fin(t,tDn,0.4),()=>T(ctx,"none",x,y+80,{w:700,size:28,align:"center",color:rgba(BA_RED,1)}));
      if(bad&&t>tFl)withA(ctx,fin(t,tFl,0.4),()=>T(ctx,"fails",x,y+80,{w:700,size:28,align:"center",color:rgba(BA_RED,1)}));}
    if(t>tEs)arrive(ctx,1050,520,t,tEs,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AMBER,0.95);ctx.lineWidth=3;rr(ctx,940,482,220,76,10);ctx.stroke();ctx.restore();T(ctx,"an estimate",1050,530,{w:700,size:28,align:"center",color:rgba(AMBER,1)});
      arrowTo(ctx,1050,482,B4_RX(2)+B4_RW/2,B4_RY+B4_RH+6,AMBER,0.9,{p:clamp((t-tEs-0.2)/0.6,0,1),lw:2.5,head:12});},{dy:10});});
  // a household's bills: estimate after estimate, then one that caught up all at once
  const bA=fin(t,tWe-0.2,0.6)*(1-fin(t,w("deeper","level three")-0.6,0.6));
  b4_bills(ctx,t,100,450,bA,{p:clamp((t-w("weeks","estimate after estimate")+0.4)/2.6,0,1)});
  withA(ctx,bA*fin(t,w("weeks","caught up all at once")-0.3,0.5),()=>tag(ctx,900,640,"then one that caught up",BA_RED,{size:28}));
  withA(ctx,bA*fin(t,w("weeks","stopped sending for weeks")-0.3,0.5),()=>tag(ctx,900,560,"no readings, for weeks",SOFT,{size:28}));
  // check readings goes deeper, drawn in BPMN: its steps, their order and the choices between them
  withA(ctx,deep,()=>{tag(ctx,B4_RX(1)+B4_RW/2,B4_RY+B4_RH+46,"level 3, in BPMN",mix(BA_BUS,BA_RED,0.4),{align:"center",size:28});});
  b4_legend(ctx,420,620,{st:fin(t,w("deeper","steps")-0.2,0.5),or:fin(t,w("deeper","their order")-0.2,0.6),ch:fin(t,w("deeper","the choices")-0.2,0.7)});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Level three ---------- */
// The BPMN diagram for check readings, with BPMN's shapes: a start event (a thin circle), tasks (rounded boxes), a gateway (a diamond
// with an X), an end event (a thick circle), sequence flows, a text annotation, and data objects (a page with its corner folded). o.p
// (0..1) draws it in, in order; o.hi[part] lights one; o.est (0..1) the estimated reading, born in the estimate task
const B4_BP={e0:[150,420],t1:[250,362,320,116],g1:[690,420],t2:[1000,362,320,116],e1:[1430,420],t3:[480,620,420,116]};
function b4_data(ctx,x,y,w,h,title,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const f=26,col=o.col||BA_INF;ctx.save();ctx.shadowColor=rgba(col,0.5+0.4*(o.hi||0));ctx.shadowBlur=14+18*(o.hi||0);
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-f,y);ctx.lineTo(x+w,y+f);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fillStyle="rgba(14,10,12,0.96)";ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4+1.6*(o.hi||0);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-f,y);ctx.lineTo(x+w,y+f);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+w-f,y);ctx.lineTo(x+w-f,y+f);ctx.lineTo(x+w,y+f);ctx.stroke();wrapT(ctx,title,x+18,y+46,w-50,{size:28,w:700,color:rgba(INK,0.96),lh:32});});}
function b4_bpmn(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,q=i=>clamp(p*8-i,0,1),col=[200,214,240],hi=o.hi||{},A=B4_BP;
  withA(ctx,a,()=>{ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
    const flow=(pts,k,lab,lx,ly)=>{const u=q(k);if(u<=0)return;const P_=mk(pts.map(([x,y])=>P(x,y))),e=at(P_,u);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
      let d=0;for(let i=1;i<pts.length;i++){const sl=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(d+sl<=u*P_.total){ctx.lineTo(pts[i][0],pts[i][1]);d+=sl;}else{ctx.lineTo(e.x,e.y);break;}}ctx.stroke();
      if(u>=1){const[x1,y1]=pts[pts.length-1],[x0,y0]=pts[pts.length-2],an=Math.atan2(y1-y0,x1-x0);ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an-0.45)*15,y1-Math.sin(an-0.45)*15);ctx.lineTo(x1-Math.cos(an+0.45)*15,y1-Math.sin(an+0.45)*15);ctx.closePath();ctx.fill();
        if(lab)T(ctx,lab,lx,ly,{w:700,size:28,color:rgba(SOFT,1)});}};
    const task=([x,y,w,h],lab,k,key)=>{const u=q(k);if(u<=0)return;const h_=hi[key]||0;withA(ctx,u,()=>{glass(ctx,x,y,w,h,16,col,{glow:8+18*h_,ea:0.8,fill:"rgba(10,14,26,0.95)"});
      if(h_>0.01){ctx.save();ctx.strokeStyle=rgba(o.hiCol&&o.hiCol[key]||[255,214,150],0.9*h_);ctx.lineWidth=3.5;rr(ctx,x-6,y-6,w+12,h+12,20);ctx.stroke();ctx.restore();}
      const ls=wrapT(ctx,lab,0,0,w-40,{size:30,w:700,measure:true});ls.forEach((l,i)=>T(ctx,l,x+w/2,y+h/2+11-(ls.length-1)*17+i*34,{w:700,size:30,align:"center"}));});};
    const ev=([x,y],end,k)=>{const u=q(k);if(u<=0)return;withA(ctx,u,()=>{ctx.fillStyle="rgba(10,14,26,0.95)";ctx.beginPath();ctx.arc(x,y,26,0,TAU);ctx.fill();ctx.strokeStyle=rgba(end?[232,110,96]:[120,210,130],1);ctx.lineWidth=end?7:3;ctx.beginPath();ctx.arc(x,y,26,0,TAU);ctx.stroke();});};
    const gate=([x,y],lab,k)=>{const u=q(k);if(u<=0)return;withA(ctx,u,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillStyle="rgba(10,14,26,0.95)";ctx.fillRect(-31,-31,62,62);ctx.strokeStyle=rgba(hi.g1?[255,214,150]:col,1);ctx.lineWidth=3;ctx.strokeRect(-31,-31,62,62);ctx.restore();
      ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-12,y-12);ctx.lineTo(x+12,y+12);ctx.moveTo(x+12,y-12);ctx.lineTo(x-12,y+12);ctx.stroke();if(hi.g1)glow(ctx,x,y,70,[255,214,150],0.35*hi.g1);
      T(ctx,lab,x,y-64,{w:800,size:30,align:"center"});});};
    ev(A.e0,false,0);withA(ctx,q(0),()=>T(ctx,"billing day",A.e0[0],A.e0[1]+66,{w:700,size:28,align:"center",color:rgba(SOFT,1)}));
    flow([[A.e0[0]+28,A.e0[1]],[A.t1[0],A.e0[1]]],1);task(A.t1,"check each reading",1,"t1");
    // the check, as a text annotation under it
    const an=q(2);if(an>0)withA(ctx,an,()=>{const x=A.t1[0]+24,y=A.t1[1]+A.t1[3]+44;ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+18,y);ctx.lineTo(x,y);ctx.lineTo(x,y+92);ctx.lineTo(x+18,y+92);ctx.stroke();
      ctx.save();ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(x+40,A.t1[1]+A.t1[3]);ctx.lineTo(x,y);ctx.stroke();ctx.restore();T(ctx,"in range?",x+30,y+36,{w:700,size:28,color:rgba(INK,0.9)});T(ctx,"no lower than the last?",x+30,y+76,{w:700,size:28,color:rgba(INK,0.9)});});
    flow([[A.t1[0]+A.t1[2],A.g1[1]],[A.g1[0]-44,A.g1[1]]],2);gate(A.g1,"passes?",3);
    flow([[A.g1[0]+44,A.g1[1]],[A.t2[0],A.g1[1]]],4,"yes",A.g1[0]+90,A.g1[1]-16);task(A.t2,"send to billing",4,"t2");
    flow([[A.t2[0]+A.t2[2],A.e1[1]],[A.e1[0]-28,A.e1[1]]],5);ev(A.e1,true,5);
    flow([[A.g1[0],A.g1[1]+44],[A.g1[0],A.t3[1]]],6,"no, or none came",A.g1[0]+20,A.g1[1]+118);task(A.t3,"estimate from the same month last year",6,"t3");
    flow([[A.t3[0]+A.t3[2],A.t3[1]+58],[A.t2[0]+A.t2[2]/2,A.t3[1]+58],[A.t2[0]+A.t2[2]/2,A.t2[1]+A.t2[3]+4]],7,"in its place",A.t3[0]+A.t3[2]+24,A.t3[1]+42);
    // the estimated reading, born in the estimate task
    const es=o.est||0;if(es>0.01){withA(ctx,es,()=>{ctx.save();ctx.setLineDash([4,6]);ctx.strokeStyle=rgba(BA_INF,0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(A.t3[0]+A.t3[2]-60,A.t3[1]+A.t3[3]);ctx.lineTo(960,772);ctx.stroke();ctx.restore();});
      b4_data(ctx,960,744,260,116,"estimated reading",{a:es,hi:o.estHi||0,col:mix(BA_INF,AMBER,0.35)});}
    ctx.restore();});}
// the data team's table of readings: its columns and rows, each a meter, a day, a number and its read_type, actual or estimated, as
// Rules with a home's data rule (RUL-020) marks every reading and A map people and agents can read's catalogue names the column.
// Taken from the meters, it holds only what they read: the meter that stopped sending leaves its rows empty. o.born (0..1) brings
// in its estimates, in their places, once the data team takes its readings from the check
const B4_TROWS=[["M-20417","12 Jan","4,182"],["M-20417","13 Jan","4,201"],["M-31188","12 Jan","9,760"],["M-31188","13 Jan","9,771"],["M-48022","12 Jan","2,044"],["M-48022","13 Jan","2,059"]],B4_TB=["actual","actual","estimated","estimated","actual","actual"];
function b4_table(ctx,t,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=470,bn=o.born||0;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,TECH,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(8,12,22,0.95)"});
  T(ctx,"table · meter readings",x+28,y+52,{f:"mono",w:500,size:28,color:rgba(TECH,1)});
  [["meter",28],["day",230],["kWh",390]].forEach(([s_,dx])=>T(ctx,s_,x+dx,y+108,{f:"mono",w:500,size:28,color:rgba(INK,0.8)}));
  T(ctx,"read_type",x+510,y+108,{f:"mono",w:500,size:28,color:rgba(TRUST,1)});
  ctx.strokeStyle=rgba(TECH,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+20,y+126);ctx.lineTo(x+w-20,y+126);ctx.stroke();
  B4_TROWS.forEach((r,i)=>{const yy=y+176+i*50,es=B4_TB[i]==="estimated",ra=es?clamp(bn*3-(i-2)*0.4,0,1):1;if(ra<=0.01)return;
    withA(ctx,ra,()=>{[[28,r[0]],[230,r[1]],[390,r[2]]].forEach(([dx,s_])=>T(ctx,s_,x+dx,yy,{w:600,size:28,color:rgba(INK,0.86)}));
      T(ctx,B4_TB[i],x+510,yy,{w:700,size:28,color:rgba(es?AMBER:BA_OK,1)});});});});}
// the glossary's entry for meter reading, with the owner's new line: a reading is what the check sends on, read or estimated
function b4_gloss(ctx,t,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,250,18,BA_INF,{glow:12,ea:0.8,fill:"rgba(12,9,12,0.95)"});
  T(ctx,"business glossary · meter reading",x+28,y+50,{f:"mono",w:500,size:28,color:rgba(BA_INF,1)});
  withA(ctx,o.line||0,()=>{T(ctx,"a reading: what the check sends on,",x+28,y+112,{w:700,size:32});T(ctx,"read from the meter, or estimated",x+28,y+156,{w:700,size:30,color:rgba(TRUST,1)});
    T(ctx,"owner: Grace",x+28,y+214,{w:700,size:28,color:rgba(TRUST,1)});kt_gtick(ctx,x+28+tw(ctx,"owner: Grace",28,700)+30,y+204,14,o.tick||0);});});}
scene("flow",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.012,x:860,y:480});
  const tPs=c("pass"),tFl=c("fail"),tSe=c("sees"),tSm=c("same"),tGr=c("grace"),tRe=c("retail"),tFa=c("farah");
  // the row as the chapter before leaves it; then check readings moves up to head the flow, and the rest leave
  const off=fin(t,0.1,0.7),mv=ease(clamp((t-0.4)/1.5,0,1));
  if(off<0.99)withA(ctx,1-off,()=>{b4_row(ctx,t,{head:0.4,link:0.4,hi:[0,0,0,0,0],dim:[1,1,1,1,1].map((v,k)=>k===1?0:1),l2R:k=>k===1?{a:0}:null});
    tag(ctx,B4_RX(1)+B4_RW/2,B4_RY+B4_RH+46,"level 3, in BPMN",mix(BA_BUS,BA_RED,0.4),{align:"center",size:28});});
  const bOut=1-fin(t,tSm-0.6,0.6),hx=lerp(B4_RX(1),80,mv),hy=lerp(B4_RY,96,mv),hw=lerp(B4_RW,420,mv),hh=lerp(B4_RH,84,mv);
  withA(ctx,bOut,()=>{archEl(ctx,hx,hy,hw,hh,"check readings",BA_BUS,"process",{size:30,gs:12,hi:0.6*(1-mv)});
    withA(ctx,fin(t,1.6,0.5),()=>tag(ctx,540,138,"level 3 · BPMN",mix(BA_BUS,BA_RED,0.4),{size:28}));
    const tG=w("gather","every reading is checked")-0.6;
    b4_bpmn(ctx,t,{p:clamp((t-tG)/1.8,0,1)*0.375+clamp((t-tPs+0.2)/1.0,0,1)*0.25+clamp((t-tFl+0.2)/2.0,0,1)*0.375,
      hi:{t1:pulseAt(t,w("gather","in range")-0.2,1.6),g1:pulseAt(t,tPs-0.1,1.4),t2:pulseAt(t,w("pass","goes to billing")-0.2,1.2),t3:pulseAt(t,w("fail","an estimate is made")-0.3,1.6)+fin(t,tSe,0.6)},hiCol:{t3:AMBER},
      est:fin(t,w("sees","a second kind of reading")-0.4,0.6),estHi:pulseAt(t,w("sees","born here")-0.2,1.6)+0.5*fin(t,w("sees","not at the meter")-0.2,0.6)});
    withA(ctx,fin(t,w("sees","born here")-0.2,0.5),()=>tag(ctx,1250,802,"born here, not at the meter",AMBER,{size:28}));});
  // later in the room: the data team's table, taken from the meters, so no estimate is in it; the owner's decision; the bill; the
  // ticket; Farah's count
  const L2=fin(t,tSm-0.1,0.6);if(L2>0.01){const tB=w("same","took readings from the meters")-0.3;
    arrive(ctx,460,520,t,tSm-0.1,()=>b4_table(ctx,t,100,190,720,{born:fin(t,w("retail","take readings from the check")+0.2,1.2),hi:pulseAt(t,tB,1.6)}),{dy:14});
    withA(ctx,fin(t,tB+0.2,0.5)*(1-fin(t,tGr-0.5,0.5)),()=>tag(ctx,460,710,"from the meters: no estimates",BA_RED,{align:"center",size:28}));
    const qA=fin(t,w("same","Farah couldn't see")-0.3,0.5)*(1-fin(t,tFa-0.5,0.5));if(qA>0.01)withA(ctx,qA,()=>{glass(ctx,880,190,700,124,18,AMBER,{glow:12,ea:0.85,fill:"rgba(8,12,22,0.95)"});T(ctx,"which households",908,242,{w:700,size:32});T(ctx,"are getting estimates?",908,288,{w:700,size:32});});
    const gA=fin(t,tGr-0.2,0.6)*(1-fin(t,tFa-0.5,0.5));if(gA>0.01)arrive(ctx,1230,460,t,tGr-0.2,()=>b4_gloss(ctx,t,880,340,700,{a:gA,line:fin(t,w("grace","what the check sends on")-0.3,0.5),tick:fin(t,w("grace","decides")-0.1,0.4)}),{dy:12});
    // the head of retail's bill, under the table, stamped; and the ticket to the data team, under the glossary
    const rA=fin(t,tRe-0.2,0.6)*(1-fin(t,tFa-0.5,0.5));if(rA>0.01){arrive(ctx,260,776,t,tRe-0.2,()=>withA(ctx,rA,()=>{sheet(ctx,100,690,320,176,{rot:-0.015,plain:true});ctx.save();ctx.translate(260,778);ctx.rotate(-0.015);
        T(ctx,"bill",-136,-38,{w:800,size:32,color:"rgba(40,32,26,0.95)"});T(ctx,"January",-136,0,{w:600,size:28,color:"rgba(70,58,48,0.95)"});
        const st=fin(t,w("retail","each bill says")-0.2,0.4);if(st>0.01){ctx.globalAlpha*=st;ctx.translate(48,34);ctx.rotate(-0.12);ctx.strokeStyle="rgba(196,96,40,0.95)";ctx.lineWidth=4;rr(ctx,-96,-30,192,56,8);ctx.stroke();T(ctx,"estimated",0,9,{w:800,size:30,align:"center",color:"rgba(196,96,40,1)"});}ctx.restore();
        tag(ctx,446,778,"head of retail",TRUST,{size:28});}),{dy:12});
      if(t>w("retail","a ticket")-0.3)arrive(ctx,1230,734,t,w("retail","a ticket")-0.3,()=>withA(ctx,rA,()=>baTicket(ctx,880,612,700,{kicker:"ticket · data team",ask:"take readings from the check",from:"from: Grace and the head of retail",col:BA_BUS})),{dy:12});}
    // now Farah can see who has had estimates, and for how long: her count comes in once the cards before it have gone
    if(t>tFa+0.05)arrive(ctx,1230,290,t,tFa+0.05,()=>baCount(ctx,880,190,700,200,"4,120","households with estimates","this winter",BA_RET),{dy:12});
    withA(ctx,fin(t,w("farah","for how long")-0.2,0.5),()=>tag(ctx,880,440,"380 of them for four weeks or more",AMBER,{size:28}));}
  arrive(ctx,1790,760,t,-1,()=>baPersonR(ctx,"farah",1790,1050,0.7,{t,expr:"calm"}),{dy:20});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. The data practice on the map ---------- */
// an access line across the short gap between a process and the concept it reads: dashed, as ArchiMate draws access, with short
// handles so it doesn't swing out past the concept (p draws it along)
function b4_pacc(ctx,x0,y0,x1,y1,p){if(p<=0.01)return;const P=[[x0,y0],[x0+36,y0],[x1-36,y1],[x1,y1]],n=32,m=Math.round(n*clamp(p,0,1));ctx.save();ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(BA_INF,0.75);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x0,y0);
  for(let i=1;i<=m;i++){const u=i/n,v=1-u,x=v*v*v*P[0][0]+3*v*v*u*P[1][0]+3*v*u*u*P[2][0]+u*u*u*P[3][0],y=v*v*v*P[0][1]+3*v*v*u*P[1][1]+3*v*u*u*P[2][1]+u*u*u*P[3][1];ctx.lineTo(x,y);}ctx.stroke();ctx.restore();}
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  arrive(ctx,500,120,t,0.2,()=>{T(ctx,"the data practice, on the map",120,128,{w:800,size:38});tag(ctx,1800-tw(ctx,"business layer",28,700)-26,116,"business layer",BA_BUS,{size:28});},{dy:-10});
  const at={p_request:w("joins","answering a data request")-0.3,p_build:w("joins","building a data product")-0.3,p_source:w("joins","taking on a source")-0.3};
  const tSa=w("same","what it reads and writes")-0.3,tNo=w("none","None goes deeper")-0.2;
  // the service's two access lines from the films before pass where this film's processes now sit: drawn first, and each process
  // laid on an underlay of the wall's own dark, so they run behind the processes, not through their names
  baPracticeAccess(ctx,"requests","cp",1,{a:0.75});baPracticeAccess(ctx,"requests","account",1,{lift:330,a:0.75});
  ["p_request","p_build","p_source"].forEach(id=>{const e=BA_PRACTICE.find(r=>r[0]===id),v=fin(t,at[id],0.6);if(e&&v>0.01)withA(ctx,v,()=>{ctx.fillStyle="rgb(6,9,18)";rr(ctx,e[4]+2,e[5]+2,e[6]-4,e[7]-4,14);ctx.fill();});});
  baPractice(ctx,t,{film:4,at,pre:fin(t,0.4,0.8),owners:true,ownersA:1,ghost:1,hi:{p_request:pulseAt(t,w("same","at level two")-0.2,1.6),p_build:pulseAt(t,w("same","at level two"),1.6),p_source:pulseAt(t,w("same","at level two")+0.2,1.6)}});
  baPracticeLine(ctx,"team","tickets",1,BA_BUS);baPracticeLine(ctx,"tickets","requests",1,BA_BUS);
  // each reads meter readings: its access line, short and straight across the gap, as the narration says what it reads and writes
  const ac=clamp((t-tSa)/0.9,0,1);["p_request","p_build","p_source"].forEach((id,k)=>{const e=BA_PRACTICE.find(r=>r[0]===id);if(e)b4_pacc(ctx,e[4]+e[6],e[5]+e[7]/2,1100,490+k*18,clamp(ac*1.3-k*0.15,0,1));});
  // the first of them at level two, as each level-2 process of the utility is drawn: its trigger, output and owner; and, once the
  // voice says none goes deeper, its level 3, not drawn (the card sits over the later films' outlines, below the processes)
  const cA=fin(t,w("same","its trigger")-0.3,0.5);if(cA>0.01)withA(ctx,cA,()=>{glass(ctx,600,596,400,252,18,BA_BUS,{glow:12,ea:0.85,fill:"rgba(8,12,22,0.96)"});
    T(ctx,"answer a data request",620,638,{f:"mono",w:500,size:28,color:rgba(BA_BUS,1)});
    [["trigger: a ticket",w("same","its trigger")],["output: an answer",w("same","its output")],["owner: data team lead",w("same","its owner")]].forEach(([s_,t0],k)=>withA(ctx,fin(t,t0-0.2,0.4),()=>T(ctx,s_,620,684+k*40,{w:700,size:30,color:k===2?rgba(TRUST,1):rgba(INK,0.95)})));
    const nA=fin(t,tNo,0.6);if(nA>0.01)withA(ctx,nA,()=>{ctx.strokeStyle=rgba(BA_BUS,0.3);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(620,780);ctx.lineTo(980,780);ctx.stroke();
      ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(SOFT,0.85);ctx.lineWidth=2;rr(ctx,620,798,56,30,8);ctx.stroke();ctx.restore();T(ctx,"level 3: not drawn",694,823,{w:700,size:28,color:rgba(SOFT,1)});});});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. As deep as it needs ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tU=c("utility"),tN=c("next"),mA=fin(t,tU-0.9,1.3);
  // on a qanat: the cycle in its levels, down to the minute only where a share was split, an owner's water coming on its minute
  if(mA<0.99){histBg(ctx,S,t,{light:0.12});ctx.save();drift(ctx,t,sc,{z:0.012,x:960,y:520});
    const tM=w("village","down to the minute")-0.3,tK=w("village","every owner knew")-0.3,run=clamp((t-tK)/2.4,0,1);
    b4_ladder(ctx,t,{rows:[1,1,1,1],open:1,own:1,deep:fin(t,tM,0.6),water:[3,0,9*run,fin(t,tK-0.2,0.4)]});
    withA(ctx,fin(t,tM,0.5)*(1-fin(t,tU-0.7,0.5)),()=>T(ctx,"to the minute, only where a share was split",960,110,{w:800,size:36,align:"center"}));
    withA(ctx,fin(t,tK+0.4,0.5)*(1-fin(t,tU-0.7,0.5)),()=>{T(ctx,"every owner:",1490,B4_LY[3]+22,{w:700,size:28,color:rgba(INK,0.9)});T(ctx,"when it comes",1490,B4_LY[3]+60,{w:700,size:28,color:rgba(BA_WATER,1)});});
    ctx.restore();}
  // at the utility: every process to level two, and only the branch that hurt drawn deeper, to where an estimate is born; then Tomás's
  // next note
  const eOut=1-fin(t,B+0.9,0.7);if(mA>0.01)withA(ctx,mA,()=>{wallBg(ctx,S,t);if(eOut>0.01)withA(ctx,eOut,()=>{ctx.save();drift(ctx,t,sc,{z:0.015,x:820,y:500});
    const tL2=w("utility","drawn to level two")-0.3,tHu=w("utility","the branch that hurt")-0.3,tEs=w("utility","an estimate is born")-0.3,dim=1-0.72*fin(t,tN-0.6,0.8);
    withA(ctx,dim,()=>{b4_tree(ctx,t,{l1:1,l2:B4_N2.map((_,i)=>fin(t,tL2+i*0.05,0.5)),deep:fin(t,tHu,0.6),hi2:fin(t,tHu,0.6),dash:fin(t,tHu+0.6,0.6),labs:[1,1,fin(t,tHu,0.5),0]});
      B4_PMAP.forEach(([g],k)=>T(ctx,g,B4_T1(B4_BANDX[k][0])[0],182,{f:"mono",w:600,size:28,color:rgba(BA_BUS,0.95)}));
      withA(ctx,fin(t,tHu+0.2,0.5),()=>tag(ctx,1252,612,"check readings",mix(BA_BUS,BA_RED,0.4),{size:28}));
      withA(ctx,fin(t,tEs,0.5),()=>tag(ctx,1252,670,"where an estimate is born",AMBER,{size:28}));});
    arrive(ctx,860,470,t,tN-0.2,()=>sticky(ctx,860,470,640,170,"What does the business expect of it? "+ba_nb("The rules on it,")+" "+ba_nb("how good it must be?"),{col:NOTEC[0],size:34,rot:-0.02}),{dy:-16});
    arrive(ctx,1780,760,t,tN-0.4,()=>baPersonR(ctx,"tomas",1790,1040,0.74,{t,expr:"calm"}),{dy:20});ctx.restore();});});
  vign(ctx,S);
  baEnd(ctx,S,t,B+1.4,"Processes, as deep as data needs","Every process drawn to level two, "+ba_nb("deeper only where it hurts."),"Film 4 of 5");});

// where the chapters meet (From words to data's joins.js): Four bands to Level three all happen on the wall, each opening on what the
// chapter before leaves there, so each camera carries on from there and nothing shows twice. Where the whole picture changes, what
// was there leaves first and the next comes in over its own background, so no words show through other words: the title card leaves
// before Tomás's note comes onto the wall, the flow and its people before the data practice's map, and that map before the qanat
const CHAPTER_JOINS={glide:["bands","levels","cash","pain","flow"],leave:["note","practice","end"],
  bare:{note:(ctx,S,t)=>{wallBg(ctx,S,t);vign(ctx,S);},practice:(ctx,S,t)=>{setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});vign(ctx,S);},end:(ctx,S,t)=>{histBg(ctx,S,t,{light:0.12});vign(ctx,S);}}};
