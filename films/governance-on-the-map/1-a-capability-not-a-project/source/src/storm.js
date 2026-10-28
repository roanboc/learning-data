/* ===== A capability, not a project: floods, and the projects they brought =====
   Holland in 1953: the storm on a dike at night, the sea driven up its slope and over its crest, the rain; the storm barrier built across
   an estuary afterwards, in stages, its piers, its road, its gates, the last crane leaving; and today, two of the water board's people
   walking a dike in the rain, as the board did in 1300. Every name starts with cp_ or CP_. */

/* ---------- the storm, on the dike at night (the place storm) ---------- */
// the sea's level as the storm drives it up (s, 0 to 1): from the river's usual level to just under the crest; and where the dike's outer
// slope meets it
const cp_stormLv=s=>lerp(CP_D.water,CP_D.crest-0.3,easeCam(clamp(s,0,1)));
const cp_outX=lv=>lerp(CP_D.out,-1.6,clamp((lv-CP_D.water)/(CP_D.crest-CP_D.water),0,1));
// where the waves break over the crest: [Z, the seconds between them, when the first comes]
const CP_SPRAY=[[5.5,2.3,0.2],[8.5,2.7,1.3],[12,2.1,0.7],[17,2.5,1.9],[24,2.2,0.4],[33,2.6,1.5],[46,2.4,1.0],[64,2.2,0.1]];
// the sea risen up the slope, dark, its waves running in at the dike in lines and breaking white; spray thrown over the crest, the water
// running down the side towards us; the rain, driven across. s: how high the sea has come (0 to 1)
function cp_storm(ctx,t,s){const D=CP_D,C=D.C,pj=(X,Y,Z)=>cp_pj(C,X,Y,Z),Z=CP_DZ,lv=cp_stormLv(s),ox=cp_outX(lv),R=wc_rng(811);
  // the sea: the far water, then up the slope to its new edge
  const edge=Z.map(z=>pj(ox,lv,z)),far=pj(D.far,lv,900),sea=[[-60,C.hz+8],[far[0],C.hz+8],...edge.slice().reverse(),[-60,H+60]];
  ctx.save();wc_tr(ctx,sea);ctx.fillStyle=rgba([34,44,62],0.94);ctx.fill();ctx.clip();
  // lines of waves, parallel to the dike, running in at it and breaking white as they reach it
  ctx.lineCap="round";for(let i=0;i<14;i++){const ph=((t*0.42+i/14)%1),X=lerp(ox-44,ox-0.6,Math.pow(ph,0.7)),a=0.16+0.5*Math.pow(ph,2.4);ctx.strokeStyle=rgba([150,164,190],a);
    for(let seg=0;seg<3;seg++){const z0=[1.6,9,34][seg],z1=[9,34,260][seg];ctx.lineWidth=[5,3,1.6][seg]*(0.6+ph);ctx.beginPath();
      for(let z=z0;z<=z1;z*=1.06){const q=pj(X+0.4*Math.sin(z*0.6+i+t*1.3),lv+0.2,z);z===z0?ctx.moveTo(q[0],q[1]):ctx.lineTo(q[0],q[1]);}ctx.stroke();}}
  // flecks of foam, drifting in
  for(let i=0;i<220;i++){const z=Z[Math.floor(Math.pow(R(),1.8)*Z.length*0.75)],X=ox-((R()*40+t*1.8*(0.6+R()*0.6))%40)-0.4,q=pj(X,lv+0.15,z),k=cp_k(C,z);
    ctx.fillStyle=rgba([170,182,204],0.18+R()*0.3);ctx.fillRect(q[0],q[1],Math.max(1,k*(0.2+R()*0.5)),Math.max(1,k*0.03));}
  ctx.restore();
  // the sea along its edge on the slope, heaving: a pale line, broken
  ctx.save();ctx.strokeStyle=rgba([176,188,210],0.55);ctx.lineCap="round";for(let j=0;j<Z.length-1;j+=1){const z=Z[j],k=cp_k(C,z);if(z>400)break;
    const a=0.3+0.5*Math.max(0,Math.sin(z*0.9-t*3.1)),q0=pj(ox+0.25*Math.sin(z+t*2.2),lv,z),q1=pj(ox+0.25*Math.sin(Z[j+1]+t*2.2),lv,Z[j+1]);
    ctx.globalAlpha=a;ctx.lineWidth=Math.max(1,k*0.09);ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q1[0],q1[1]);ctx.stroke();}ctx.restore();
  // water over the crest, running down the slope towards us where the waves break over it most
  if(s>0.5)for(const [z0,z1,sd] of [[7.4,10.4,821],[15.6,19.4,823]]){const e=clamp((s-0.5)*2,0,1),T_=pj(1.6,D.crest,z0),T2=pj(1.6,D.crest,z1),B2=pj(D.in,0,z1),B1=pj(D.in,0,z0);
    cp_falls(ctx,T_,T2,B2,B1,t,{a:0.55*e,col:[60,74,96],foam:0.5,n:26,seed:sd,speed:1.2});}
  // spray thrown up over the crest as each wave breaks, and falling on the far side of it
  for(const [z0,per,off] of CP_SPRAY){const b=(((t-off)%per+per)%per)/1.3;if(b>1||s<0.25)continue;const R2=wc_rng((z0*13)|0),k=cp_k(C,z0),hh=lerp(1.6,4.2,R2())*clamp(s*1.4,0,1);
    for(let i=0;i<26;i++){const dz=(R2()-0.5)*2.4,dx=lerp(-0.6,3.2,R2()),u=clamp(b*(0.8+0.4*R2()),0,1),q=pj(-1.6+dx*u,D.crest+hh*Math.sin(Math.PI*u)*(0.6+0.6*R2()),z0+dz),r=k*(0.08+R2()*0.22)*(0.6+u);
      const g=ctx.createRadialGradient(q[0],q[1],0,q[0],q[1],r*2.2);g.addColorStop(0,rgba([196,206,226],0.5*(1-u)));g.addColorStop(1,rgba([196,206,226],0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(q[0],q[1],r*2.2,0,TAU);ctx.fill();}
    ctx.fillStyle=rgba([210,218,234],0.7*(1-b));for(let i=0;i<30;i++){const dz=(R2()-0.5)*2,dx=lerp(-0.4,2.6,R2()),u=clamp(b*(0.7+0.6*R2()),0,1),q=pj(-1.6+dx*u,D.crest+hh*1.2*Math.sin(Math.PI*u)*R2(),z0+dz);
      ctx.beginPath();ctx.arc(q[0],q[1],Math.max(1,k*0.025),0,TAU);ctx.fill();}}
  cp_rain(ctx,t,{n:340,slant:0.42,col:[176,188,210],a:0.34,len:70,speed:1500,seed:831});}
// rain across the frame: thin streaks falling, driven aslant by the wind (o.slant, across for each down)
function cp_rain(ctx,t,o){o=o||{};const R=wc_rng(o.seed||833),sl=o.slant||0.2,len=o.len||50,sp=o.speed||1200,span=H+len*2;ctx.save();ctx.lineCap="round";
  for(let i=0;i<(o.n||200);i++){const y=((R()*span+t*sp*(0.8+0.4*R()))%span)-len,x=((R()*(W+400)+y*sl)%(W+400))-200,l=len*(0.6+R()*0.7);
    ctx.strokeStyle=rgba(o.col||[200,206,214],(o.a||0.3)*(0.5+R()*0.7));ctx.lineWidth=0.8+R()*1.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+l*sl,y+l);ctx.stroke();}ctx.restore();}

/* ---------- the storm barrier, built across an estuary (the place barrier) ---------- */
// Seen from a dune on the near shore, 12 m up: the estuary, wide and grey, its far shore a thin line; the barrier runs out from near on the
// left to far off on the right. CP_E: the camera; the barrier's two ends ([X, Z]); how many piers; a pier's height, width, and its house
// on top; the road's height; the gates' height, and where they hang when they're open
const CP_E={C:{F:1500,hz:430,eye:12,yaw:0},a:[-150,160],b:[640,1020],n:22,ph:27,pw:9,house:[11,5],road:[21,24],gate:[11,13]};
const cp_e=(X,Y,Z)=>cp_pj(CP_E.C,X,Y,Z),cp_eK=(X,Z)=>CP_E.C.F/Z;
// pier i: where it stands, and the barrier's direction
function cp_pierAt(i){const E=CP_E,u=i/(E.n-1),d=[E.b[0]-E.a[0],E.b[1]-E.a[1]],L=Math.hypot(d[0],d[1]);return{X:lerp(E.a[0],E.b[0],u),Z:lerp(E.a[1],E.b[1],u),d:[d[0]/L,d[1]/L]};}
function cp_paintBarrier(ctx){const E=CP_E,C=E.C,hz=C.hz,R=wc_rng(841);cp_sky(ctx,hz+4,47,{n:8});
  // the far shore: low land, a line of dunes, a lighthouse
  wc_wash(ctx,[[-60,hz-4],[W+60,hz-8],[W+60,hz+8],[-60,hz+8]],[150,160,150],{kind:"ground",depth:0.3,seed:843,line:false});
  cp_hedge(ctx,x=>hz-2-2*Math.sin(x/170),900,W+40,9,0.3,845,[140,152,140]);const lh=[1420,hz-4];wc_part(ctx,wc_rect(lh[0]-5,lh[1]-34,10,34),[200,90,80],0.35);wc_part(ctx,wc_rect(lh[0]-7,lh[1]-40,14,7),[90,96,104],0.35);
  // the estuary: grey near the far shore, darker and greener towards us, long strokes of light on it
  const sea=[[-60,hz+6],[W+60,hz+6],[W+60,H+60],[-60,H+60]];wc_wash(ctx,sea,[132,150,158],{kind:"ground",line:false,depth:0.85,seed:847});
  ctx.save();wc_tr(ctx,sea);ctx.clip();const g=ctx.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgba(214,222,226,0.6)");g.addColorStop(0.4,"rgba(214,222,226,0.15)");g.addColorStop(1,"rgba(60,84,92,0.25)");
  ctx.fillStyle=g;ctx.fillRect(0,hz,W,H-hz);ctx.globalCompositeOperation="screen";for(let i=0;i<160;i++){const y=lerp(hz+8,H,Math.pow(R(),1.7)),k=(y-hz)/(H-hz),x=R()*W,w=(30+R()*170)*(0.3+k);
    ctx.fillStyle=rgba([255,255,255],0.06+R()*0.12);ctx.fillRect(x,y,w,1+k*2.6);}ctx.restore();
  // the dune we stand on, at the bottom left: sand, marram grass in tufts
  const dune=[[-60,H+60],[-60,820],[220,790],[520,836],[760,900],[900,H+60]];wc_wash(ctx,dune,[222,206,168],{kind:"ground",line:false,depth:1,seed:849});
  ctx.save();ctx.lineCap="round";for(let i=0;i<260;i++){const x=-40+R()*820,yb=lerp(800,1000,R()),top=x<220?lerp(820,790,(x+60)/280):x<520?lerp(790,836,(x-220)/300):lerp(836,900,(x-520)/240);if(yb<top+6)continue;
    const h=24+R()*60,lean=(R()-0.3)*0.5;ctx.strokeStyle=rgba(R()<0.5?[168,170,108]:[136,146,92],0.85);ctx.lineWidth=1.6+R()*2;ctx.beginPath();ctx.moveTo(x,yb);ctx.quadraticCurveTo(x+lean*h*0.4,yb-h*0.6,x+lean*h,yb-h);ctx.stroke();}ctx.restore();}
// the barrier at st: piers rising one by one from the water (st.piers, 0 to 1 along it), the road set on them (st.road), the gates hung
// (st.gates) and lowered into the water (st.close); the floating crane at work beside the newest pier, and leaving (st.leave)
function cp_barrier(ctx,t,st){const E=CP_E,n=E.n,pr=st.piers||0,rd=st.road||0,gt=st.gates||0,cl=st.close||0,lv=st.leave||0,up=i=>easeCam(clamp(pr*n*1.15-i*1.05,0,1)),
    on=(i,v)=>clamp(v*n*1.2-i*1.1,0,1),concrete=[204,202,194],shade=[164,164,160];
  const corners=(i,y0,y1,w)=>{const p=cp_pierAt(i),h=(w||E.pw)/2;return[cp_e(p.X-p.d[0]*h,y1,p.Z-p.d[1]*h),cp_e(p.X+p.d[0]*h,y1,p.Z+p.d[1]*h),cp_e(p.X+p.d[0]*h,y0,p.Z+p.d[1]*h),cp_e(p.X-p.d[0]*h,y0,p.Z-p.d[1]*h)];};
  // the piers' reflections in the water, faint and wavering
  ctx.save();for(let i=0;i<n;i++){const u=up(i);if(u<=0.01)continue;const q=corners(i,0,-E.ph*u*0.55);ctx.fillStyle="rgba(70,86,96,0.16)";wc_tr(ctx,q);ctx.fill();}ctx.restore();
  for(let i=n-1;i>=0;i--){const u=up(i),p=cp_pierAt(i),k=cp_eK(p.X,p.Z);
    // the gate between this pier and the next, farther one: steel, ribbed, hung open high up, then lowered to the water
    if(i<n-1&&gt>0.01){const g=on(i,gt);if(g>0.01){const q=cp_pierAt(i+1),h=E.pw/2,y0=lerp(E.gate[0],-1.2,easeCam(clamp(cl*1.2-i*0.012,0,1))),y1=y0+E.gate[1],
      A=[p.X+p.d[0]*h,p.Z+p.d[1]*h],B=[q.X-q.d[0]*h,q.Z-q.d[1]*h],pts=[cp_e(A[0],y1,A[1]),cp_e(B[0],y1,B[1]),cp_e(B[0],y0,B[1]),cp_e(A[0],y0,A[1])];
      ctx.save();ctx.globalAlpha*=clamp(g*2,0,1);ctx.beginPath();ctx.rect(-W,-H,3*W,cp_e(A[0],-0.05,A[1])[1]+H);ctx.clip();wc_tr(ctx,pts);ctx.fillStyle=rgba([104,112,124],1);ctx.fill();
      ctx.strokeStyle=rgba([70,76,86],0.8);ctx.lineWidth=Math.max(1,k*0.12);for(let r=1;r<5;r++){const a=[lerp(pts[3][0],pts[0][0],r/5),lerp(pts[3][1],pts[0][1],r/5)],b=[lerp(pts[2][0],pts[1][0],r/5),lerp(pts[2][1],pts[1][1],r/5)];
        ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();}}
    // the road from this pier's top to the next one's
    if(i<n-1&&rd>0.01){const r=on(i,rd);if(r>0.01){const q=cp_pierAt(i+1),m=[lerp(p.X,q.X,easeCam(r)),lerp(p.Z,q.Z,easeCam(r))],pts=[cp_e(p.X,E.road[1],p.Z),cp_e(m[0],E.road[1],m[1]),cp_e(m[0],E.road[0],m[1]),cp_e(p.X,E.road[0],p.Z)];
      wc_tr(ctx,pts);ctx.fillStyle=rgba([150,150,146],1);ctx.fill();ctx.strokeStyle=rgba([228,228,222],0.8);ctx.lineWidth=Math.max(1,k*0.1);ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);ctx.lineTo(pts[1][0],pts[1][1]);ctx.stroke();}}
    // the pier: rising out of the water, its face lit, its far edge in shade, the house on its top
    if(u>0.01){const top=E.ph*u,q=corners(i,-0.4,top);ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cp_e(p.X,-0.05,p.Z)[1]+H);ctx.clip();
      wc_tr(ctx,q);const g=ctx.createLinearGradient(q[0][0],0,q[1][0],0);g.addColorStop(0,rgba(concrete,1));g.addColorStop(0.75,rgba(concrete,1));g.addColorStop(1,rgba(shade,1));ctx.fillStyle=g;ctx.fill();
      ctx.strokeStyle=rgba([120,120,118],0.5);ctx.lineWidth=1;ctx.stroke();
      // the stains of the tide along its foot
      const s=corners(i,-0.4,1.6);wc_tr(ctx,s);ctx.fillStyle="rgba(96,104,96,0.45)";ctx.fill();ctx.restore();
      if(u>0.98){const hs=corners(i,top,top+E.house[1],E.house[0]);wc_tr(ctx,hs);ctx.fillStyle=rgba([226,224,216],1);ctx.fill();ctx.strokeStyle=rgba([140,140,136],0.7);ctx.lineWidth=1;ctx.stroke();
        const rf=corners(i,top+E.house[1],top+E.house[1]+0.8,E.house[0]+0.6);wc_tr(ctx,rf);ctx.fillStyle=rgba([96,100,108],1);ctx.fill();}
      // a ripple of white where it meets the water
      const f=cp_e(p.X,0,p.Z);ctx.fillStyle="rgba(240,244,244,0.6)";ctx.beginPath();ctx.ellipse(f[0],f[1],k*E.pw*0.5,Math.max(1.5,k*0.25),0,0,TAU);ctx.fill();}}
  // the floating crane: a pontoon, a tall boom leaning over the newest pier, its hook's cable; working, then sailing away
  const front=clamp(Math.floor(pr*n*1.15/1.05),0,n-1),fp=cp_pierAt(front),nn=[0.738,-0.676],go=easeCam(clamp(lv,0,1));
  const cx=fp.X+nn[0]*34+go*420,cz=fp.Z+nn[1]*34-go*60,k=cp_eK(cx,cz);if(cz>10){const b=cp_e(cx,0,cz),hull=[cp_e(cx-16,0,cz-6),cp_e(cx+16,0,cz-6),cp_e(cx+16,3,cz-6),cp_e(cx-16,3,cz-6)];
    wc_tr(ctx,hull);ctx.fillStyle=rgba([70,72,80],1);ctx.fill();const dk=[cp_e(cx-16,3,cz-6),cp_e(cx+16,3,cz-6),cp_e(cx+12,6,cz-6),cp_e(cx-12,6,cz-6)];wc_tr(ctx,dk);ctx.fillStyle=rgba([196,82,62],1);ctx.fill();
    const foot=cp_e(cx-6,6,cz-6),tip=cp_e(cx-6-lerp(26,10,go),lerp(58,70,go),cz-6+lerp(10,0,go));ctx.strokeStyle=rgba([196,82,62],1);ctx.lineCap="round";ctx.lineWidth=Math.max(2,k*1.4);
    ctx.beginPath();ctx.moveTo(foot[0],foot[1]);ctx.lineTo(tip[0],tip[1]);ctx.stroke();ctx.lineWidth=Math.max(1,k*0.6);const f2=cp_e(cx+8,6,cz-6);ctx.beginPath();ctx.moveTo(f2[0],f2[1]);ctx.lineTo(tip[0],tip[1]);ctx.stroke();
    ctx.strokeStyle=rgba([50,50,54],0.9);ctx.lineWidth=Math.max(1,k*0.12);const hook=[tip[0],lerp(tip[1],cp_e(fp.X,E.ph*0.9,fp.Z)[1],1-go)];ctx.beginPath();ctx.moveTo(tip[0],tip[1]);ctx.lineTo(hook[0],hook[1]);ctx.stroke();
    // its wake as it goes
    if(go>0.02){ctx.strokeStyle="rgba(240,244,244,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b[0]-k*18,b[1]+2);ctx.lineTo(b[0]-k*18-k*40*go,b[1]+4);ctx.stroke();}}}

/* ---------- today: the board's people walk a dike in the rain (the place today) ---------- */
// two of the water board's people, in rain jackets with their hoods up: one with a clipboard, one with a probe
Object.assign(PEOPLE,{
  cpInspA:{name:"",role:"dike inspector",side:"",edge:[236,232,226],seed:77,skin:[214,170,138],hair:{style:"cropped",c:[60,46,36]},hat:"hood",hatC:[222,178,56],
    top:{kind:"overshirt",c:[222,178,56],inner:[214,170,52]},bottom:{c:[52,58,72]},shoe:[44,44,48],build:{sh:74,hip:62,h:0.99}},
  cpInspB:{name:"",role:"dike inspector",side:"",edge:[236,232,226],seed:78,skin:[176,128,98],hair:{style:"bob",c:[50,40,34],streak:[96,80,66]},hat:"hood",hatC:[58,88,74],
    top:{kind:"overshirt",c:[58,88,74],inner:[52,80,68]},bottom:{c:[62,62,66]},shoe:[40,40,44],build:{sh:66,hip:62,h:0.95}}
});
// a clipboard held at the side in one hand, its sheet under a clear cover
function cp_heldClip(cx,P_,hands){const h=hands[0];cx.save();cx.translate(h[0]-8,h[1]-46);cx.rotate(-0.1);cx.fillStyle="rgba(40,30,20,0.22)";cx.fillRect(-52,-66,112,150);
  cx.fillStyle=rgba([90,74,60],1);cx.fillRect(-58,-72,112,150);cx.fillStyle="#f6f4ee";cx.fillRect(-50,-60,96,128);cx.fillStyle=rgba([70,70,74],1);cx.fillRect(-22,-80,40,16);
  cx.fillStyle="rgba(120,130,150,0.45)";for(let i=0;i<6;i++)cx.fillRect(-42,-44+i*18,72-(i%3)*14,4);cx.restore();fingers(cx,P_,[h]);}
// someone walking towards us along the dike's crest from Z0 to Z1 at X, setting off at t0 (1.2 m a second); o as person's. Returns
// whether they're still walking
function cp_crestWalk(ctx,id,t,t0,X,Z0,Z1,o){const D=CP_D,T_=Math.abs(Z1-Z0)/1.2,u=clamp((t-t0)/T_,0,1),Zp=lerp(Z0,Z1,u<0.5?2*u*u:1-2*(1-u)*(1-u)),moving=u>0&&u<1,
    ph=(t-t0)*Math.PI*3.2,sw=moving?Math.sin(ph):0,bob=moving?Math.abs(sw)*0.025:0;
  cp_who(ctx,D.C,id,X,D.crest+bob,Zp,Object.assign({t},o,moving&&!(o&&o.keep)?{pose:"stand",pose2:sw>0?"walkA":"walkB",mix:Math.abs(sw)}:{}));return moving;}
// the rain over today's dike: the far land softened (cp_rainHaze, drawn before the people, so they stay clear: thickest at the horizon,
// fading out above and below it, so it leaves no edge), then the light greyed and streaks falling (cp_rainDay, over everything)
function cp_rainHaze(ctx){const hz=CP_D.C.hz,y1=hz+170;ctx.save();const g=ctx.createLinearGradient(0,0,0,y1);g.addColorStop(0,"rgba(236,240,244,0.0)");
  g.addColorStop(hz/y1,"rgba(236,240,244,0.66)");g.addColorStop(1,"rgba(236,240,244,0.0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,y1);ctx.restore();}
function cp_rainDay(ctx,t){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([196,202,210],1);ctx.fillRect(0,0,W,H);ctx.restore();
  cp_rain(ctx,t,{n:260,slant:0.16,col:[226,230,236],a:0.3,len:46,speed:1100,seed:861});}
