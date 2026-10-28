/* ===== A capability, not a project: the water board =====
   What the board does on the dikes, and the land it keeps: three small pictures of a dike that's never finished; the gap mended; the
   board gathered on the dike; each landowner's stretch staked out; the board walking the crest, and a fine; three cards on the sky; the
   land kept and ploughed; the charter of 1255; the same kind of land today, two people cycling on the dike; the dike from above. Every
   name starts with cp_ or CP_. */

/* ---------- a dike that's never finished: three small pictures ---------- */
// The same stretch, cut through as the film's cut through the land is drawn (cp_paintSection), small, on a card: the land on the left,
// low, with its peat under it; the dike of clay, grassed; the river on the right, higher than the land; the old clay under them all; a
// slice of it, its top seen going back, the far land behind. i: 0, it settles (its top sinks, a pencil line where it was); 1, it wears
// (cattle have worn a track up its side, a cow on it); 2, storms break it (at night, waves tear a bite out of its river side). u, how
// far along it is (0 to 1). CP_VG: the card's size; the horizon; the slice's depth as seen; the land's top, the river's level (in the
// storm, higher), its bed, the old clay's top; the dike: its feet, its crest's ends and height
const CP_VG={w:600,h:360,hz:92,off:[14,-30],land:250,water:196,storm:172,bed:292,clay:318,dike:{x0:120,c0:290,c1:360,x1:499,cy:146}};
const cp_vgBack=(a,b)=>{const o=CP_VG.off;return[a,b,[b[0]+o[0],b[1]+o[1]],[a[0]+o[0],a[1]+o[1]]];};
// what doesn't change: the sky, the far land and the far river, the land's slice and the old clay
function cp_vigBack(i){return wc_kept("cpVigBack"+i,CP_VG.w,CP_VG.h,q=>{const V=CP_VG,w=V.w,h=V.h,D=V.dike,o=V.off,R=wc_rng(531+i),night=i===2;
  const g=q.createLinearGradient(0,0,0,V.hz);g.addColorStop(0,rgba(night?[150,160,182]:[178,198,220],1));g.addColorStop(1,rgba([238,238,232],1));q.fillStyle=g;q.fillRect(0,0,w,V.hz+4);
  for(let j=0;j<3;j++)cp_cloud(q,80+j*200+R()*40,44+18*(j%2),130,34,535+j+i*3,night);
  // the far land along the horizon, pale
  wc_wash(q,[[-10,V.hz-2],[w+10,V.hz-2],[w+10,V.land],[-10,V.land]],[178,192,158],{kind:"ground",line:false,depth:0.35,seed:539+i});
  q.save();q.fillStyle=rgba(mix(CP.ditch,[176,190,156],0.4),0.7);for(let j=0;j<6;j++){const y=V.hz+5+Math.pow(j/5,1.6)*110;q.fillRect(-10,y,w+20,1+j*0.3);}q.restore();
  cp_hedge(q,()=>V.hz+2,-10,w+10,7,0.3,541+i,[156,174,134]);cp_farm(q,70,V.hz+5,0.07,{seed:9,smoke:false});cp_church(q,520,V.hz+3,0.14,0.3);
  // the old clay, under everything
  wc_wash(q,[[-10,V.clay],[w+10,V.clay],[w+10,h+10],[-10,h+10]],CP.deep,{kind:"ground",line:false,depth:1,seed:545});
  q.save();q.strokeStyle=rgba(wc_dim(CP.deep,0.2),0.3);q.lineWidth=1.4;for(let y=V.clay+14;y<h;y+=16){q.beginPath();q.moveTo(-10,y);for(let x=-10;x<=w+10;x+=30)q.lineTo(x,y+Math.sin(x/70+y)*2);q.stroke();}q.restore();
  // the land: its top going back, grass with a ditch across it; its peat, cut, down to the old clay
  const top=cp_vgBack([-10,V.land],[D.x0+2,V.land]);wc_wash(q,top,mix(CP.grass,CP.grass2,0.3),{kind:"ground",line:false,depth:0.9,seed:547});
  q.save();wc_tr(q,top);q.clip();q.fillStyle=rgba(CP.ditch,0.85);q.fillRect(-10,V.land+o[1]*0.55,D.x0+40,2.4);q.restore();cp_grass(q,top,CP.grass,60,549,6,4,V.land,V.land+o[1]);
  cp_peat(q,[[-10,V.land],[D.x0,V.land],[D.x1,V.bed],[w+10,V.bed],[w+10,V.clay+2],[-10,V.clay+2]],551);
  wc_wash(q,wc_band([[-10,V.land],[D.x0,V.land]],3,3),CP.turf,{kind:"ground",line:false,depth:1,seed:553});
  // the river's bed, silt, under the water
  wc_wash(q,[[D.x1-30,V.bed-2],[w+10,V.bed-2],[w+10,V.clay+2],[D.x1+10,V.clay+2]],mix(CP.clay,CP.deep,0.5),{kind:"ground",line:false,depth:1,seed:555});});}
// the dike: its clay, cut, banded where each layer was laid; its slopes and top going back, grassed, the turf's skin along them; for
// i 1, the track the cattle have worn up its side, bare
function cp_vigDike(i){const V=CP_VG,D=V.dike;return wc_kept("cpVigDike"+i,V.w,V.h,q=>{const R=wc_rng(561+i),o=V.off,prof=[[D.x0,V.land],[D.c0,D.cy],[D.c1,D.cy],[D.x1,V.bed]];
  for(const [a,b,k] of [[prof[2],prof[3],-0.16],[prof[1],prof[2],0.04],[prof[0],prof[1],0.12]]){const f=cp_vgBack(a,b),col=mix(CP.grass2,CP.sedge,0.25);wc_wash(q,f,k>0?wc_lit(col,k):wc_dim(col,-k),{kind:"ground",line:false,depth:0.95,seed:563+i+(k*100|0)});
    cp_grass(q,f,CP.grass2,50,565+(k*100|0),5,4,Math.max(a[1],b[1]),Math.min(a[1],b[1])+o[1]);}
  const cut=[...prof,[D.x0+60,V.land+8]];wc_wash(q,cut,CP.clay,{kind:"ground",line:false,depth:1,seed:567});q.save();wc_tr(q,cut);q.clip();q.strokeStyle=rgba(CP.clayDk,0.4);q.lineWidth=1.6;
  for(let y=D.cy+12;y<V.bed;y+=12){q.beginPath();q.moveTo(D.x0-20,y+R()*2);q.bezierCurveTo(D.x0+120,y-2,D.x1-120,y+2,D.x1+20,y);q.stroke();}
  q.fillStyle=rgba(CP.clayDk,0.25);for(let j=0;j<120;j++)q.fillRect(D.x0+R()*(D.x1-D.x0),D.cy+R()*(V.bed-D.cy),1.5+R()*2,1.2);q.restore();
  q.save();q.strokeStyle=rgba(CP.turf,0.95);q.lineWidth=5;q.lineJoin="round";q.lineCap="round";q.beginPath();prof.forEach((p,j)=>j?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke();
  q.strokeStyle=rgba(wc_dim(CP.grass3,0.4),0.45);q.lineWidth=1.2;q.beginPath();prof.forEach((p,j)=>j?q.lineTo(p[0]+o[0],p[1]+o[1]):q.moveTo(p[0]+o[0],p[1]+o[1]));q.stroke();q.restore();
  if(i===1){// the track: bare clay, up the land's slope slantwise, from the field to the crest
    const pt=(u,v)=>[lerp(D.x0,D.c0,u)+o[0]*v,lerp(V.land,D.cy,u)+o[1]*v],tr=[];for(let j=0;j<=10;j++){const u=j/10;tr.push(pt(u,0.18+0.62*u+0.05*Math.sin(u*9)));}
    for(let j=10;j>=0;j--){const u=j/10;tr.push(pt(u,0.32+0.62*u+0.05*Math.sin(u*9+1)));}wc_wash(q,tr,wc_lit(CP.clay,0.08),{kind:"ground",line:false,depth:1,seed:569});
    q.save();q.strokeStyle=rgba(CP.clayDk,0.5);q.lineWidth=1.2;for(let j=0;j<14;j++){const u=0.05+j/14*0.9,a=pt(u,0.25+0.62*u);q.beginPath();q.moveTo(a[0]-3,a[1]);q.lineTo(a[0]+3,a[1]+1);q.stroke();}q.restore();}});}
// the river: its top going back, the light on it; its water, cut, deepening to its bed; lv, its level; cy and ft, where the dike's
// crest and outer foot are, if it has settled
function cp_vigRiver(q,lv,t,night,cy,ft){const V=CP_VG,D=V.dike,w=V.w,c=cy==null?D.cy:cy,f=ft==null?V.bed:ft,x=D.c1+(lv-c)*(D.x1-D.c1)/(f-c),R=wc_rng(571);
  const top=cp_vgBack([x,lv],[w+10,lv]);q.fillStyle=rgba(night?[108,130,150]:mix(CP.river,CP.riverLt,0.2),1);wc_tr(q,top);q.fill();
  q.save();wc_tr(q,top);q.clip();q.globalCompositeOperation="screen";for(let j=0;j<14;j++){const v=R(),y=lv+V.off[1]*v,xx=x+V.off[0]*v+((R()*300+t*(night?60:12))%300);q.fillStyle=rgba([255,255,255],0.2+R()*0.2);q.fillRect(xx,y,14+R()*30,1.2);}q.restore();
  const cut=[[x,lv],[w+10,lv],[w+10,V.bed],[D.x1,V.bed],[D.x1,f]];q.fillStyle=rgba(night?[70,90,112]:CP.riverDk,0.93);wc_tr(q,cut);q.fill();
  q.save();wc_tr(q,cut);q.clip();const g=q.createLinearGradient(0,lv,0,V.bed);g.addColorStop(0,"rgba(255,255,255,0.4)");g.addColorStop(1,"rgba(255,255,255,0)");q.globalCompositeOperation="screen";q.fillStyle=g;q.fillRect(x,lv,w,V.bed-lv);q.restore();
  q.save();q.strokeStyle=rgba(CP.riverDk,0.8);q.lineWidth=1.6;q.beginPath();q.moveTo(x,lv);q.lineTo(w+10,lv);q.stroke();q.restore();return x;}
function cp_vigPaint(q,i,t,u){const V=CP_VG,D=V.dike,w=V.w,h=V.h,night=i===2,uu=clamp(u,0,1);q.drawImage(cp_vigBack(i),0,0);
  if(i===0){// it settles: the dike squashed down about its foot, its crest sinking; the river where it was
    // each point moves towards the dike's base line (y = a + b x), so its feet stay where they are
    const s=26*easeCam(uu),b=(V.bed-V.land)/(D.x1-D.x0),a=V.land-b*D.x0,yb=x=>a+b*x,f=1-s/(yb((D.c0+D.c1)/2)-D.cy);
    q.save();q.transform(1,(1-f)*b,0,f,0,(1-f)*a);q.drawImage(cp_vigDike(0),0,0);q.restore();cp_vigRiver(q,V.water,t,false,D.cy*f+(1-f)*yb(D.c1),V.bed);
    q.save();q.setLineDash([9,6]);q.strokeStyle=rgba(WC_PENCIL,0.9*clamp(uu*4,0,1));q.lineWidth=2.2;q.beginPath();q.moveTo(D.c0-46,D.cy);q.lineTo(D.c1+30,D.cy);q.stroke();q.restore();return;}
  q.drawImage(cp_vigDike(i),0,0);
  if(i===1){cp_vigRiver(q,V.water,t);// a cow coming up the track
    const a=clamp(0.1+uu*0.75,0,1),x=lerp(D.x0+8,D.c0-10,a)+V.off[0]*(0.25+0.62*a),y=lerp(V.land,D.cy,a)+V.off[1]*(0.25+0.62*a)+Math.abs(Math.sin(t*4))*0.8;
    q.save();q.translate(x,y);q.rotate(-0.5);cp_cow(q,0,0,0.5,0,true);q.restore();return;}
  // storms break it: the river high and at night; waves run in, white along their tops, and break on the dike, throwing spray; each
  // takes a little more of its river side, until a bite is torn out of it; rain
  const lv=V.storm,bite=easeCam(clamp(uu*1.15,0,1)),bx=D.c1+(lv-D.cy)*(D.x1-D.c1)/(V.bed-D.cy);
  if(bite>0.01){// the bite: a scoop out of the outer slope at the water's level, half above it, half below, its edge raw clay
    const L=Math.hypot(D.x1-D.c1,V.bed-D.cy),d=[(D.x1-D.c1)/L,(V.bed-D.cy)/L],n=[-d[1],d[0]],hw=24,dp=34*bite,edge=[];
    for(let j=0;j<=16;j++){const an=j/16*Math.PI,r=1+0.06*Math.sin(j*0.9+1);edge.push([bx+d[0]*hw*Math.cos(an)+n[0]*dp*Math.sin(an)*r,lv+d[1]*hw*Math.cos(an)+n[1]*dp*Math.sin(an)*r]);}
    q.save();wc_tr(q,edge);q.clip();q.fillStyle=rgba([58,66,84],1);q.fillRect(0,0,w,lv);q.fillStyle=rgba([84,104,126],1);q.fillRect(0,lv,w,h);q.restore();
    q.save();q.lineJoin="round";q.strokeStyle=rgba(wc_lit(CP.clay,0.2),1);q.lineWidth=3.4;q.beginPath();edge.forEach((p,j)=>j?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke();
    q.strokeStyle=rgba(CP.clayDk,0.9);q.lineWidth=1.2;q.beginPath();edge.forEach((p,j)=>j?q.lineTo(p[0]+n[0]*2.4,p[1]+n[1]*2.4):q.moveTo(p[0]+n[0]*2.4,p[1]+n[1]*2.4));q.stroke();
    // lumps of clay fallen into the water at its foot
    q.fillStyle=rgba(CP.clayDk,1);for(const [u,v,r] of [[0.8,0.3,5],[1.2,0.1,4],[1.0,0.55,3.4]]){const x=bx+d[0]*hw*u+n[0]*dp*v,y=lv+d[1]*hw*u+n[1]*dp*v+6;q.beginPath();q.ellipse(x,y,r*bite+1,r*0.7*bite+1,0.3,0,TAU);q.fill();}q.restore();}
  cp_vigRiver(q,lv,t,true);
  q.save();q.lineCap="round";for(let j=0;j<5;j++){const ph=(t*0.5+j/5)%1,x=w+20-ph*(w+20-bx),y=lv-4-10*Math.sin(Math.PI*ph),a2=Math.sin(Math.PI*ph);
    q.fillStyle=rgba([70,92,116],0.95*a2);q.beginPath();q.moveTo(x-30,lv+1);q.quadraticCurveTo(x-10,y-6,x+14,y+2);q.quadraticCurveTo(x+24,lv-2,x+34,lv+1);q.closePath();q.fill();
    q.strokeStyle=rgba(CP.foam,0.9*a2);q.lineWidth=3;q.beginPath();q.moveTo(x-18,y+3);q.quadraticCurveTo(x-4,y-8,x+14,y+2);q.stroke();}
  const hit=(t*0.5)%1,sp=Math.max(0,Math.sin(Math.PI*clamp((hit-0.7)/0.3,0,1))),R=wc_rng(577);for(let j=0;j<22;j++){const r=2+R()*6,ang=-Math.PI*(0.3+R()*0.55),d=sp*(16+R()*54);
    q.fillStyle=rgba(CP.foam,0.8*sp);q.beginPath();q.arc(bx-10+Math.cos(ang)*d,lv-6+Math.sin(ang)*d,r*(0.4+sp*0.6),0,TAU);q.fill();}
  q.fillStyle=rgba(CP.foam,0.7);q.beginPath();for(let j=0;j<=10;j++){const x=bx-8+j*12,y=lv-2-3*Math.sin(j*1.7+t*6);j?q.lineTo(x,y):q.moveTo(x,y);}for(let j=10;j>=0;j--)q.lineTo(bx-8+j*12,lv+4);q.closePath();q.fill();q.restore();
  q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba([104,114,150],1);q.fillRect(0,0,w,h);q.restore();
  q.save();q.strokeStyle="rgba(214,222,238,0.4)";q.lineWidth=1.1;for(let j=0;j<46;j++){const x=(R()*w+t*80)%w,y=(R()*h+t*400)%h;q.beginPath();q.moveTo(x,y);q.lineTo(x-5,y+14);q.stroke();}q.restore();}
// a picture on its card at (cx, cy), s its scale: paper round it, tipped a little, a shadow; it springs in as a goes to 1
function cp_vignette(ctx,i,cx,cy,s,t,u,a){if(a<=0.01)return;const V=CP_VG,w=V.w,h=V.h,[bc,bx]=wc_buf("cpVig"+i,w,h);cp_vigPaint(bx,i,t,u);
  const k=0.9+0.1*spring(clamp(a,0,1)),rot=[-0.03,0.018,-0.012][i];ctx.save();ctx.globalAlpha*=clamp(a*1.6,0,1);ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(s*k,s*k);
  ctx.fillStyle="rgba(60,50,40,0.2)";ctx.fillRect(-w/2-8,-h/2-4,w+30,h+30);ctx.fillStyle=rgba([250,247,240],1);ctx.fillRect(-w/2-14,-h/2-14,w+28,h+28);
  ctx.drawImage(bc,-w/2,-h/2);ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=1.5;ctx.strokeRect(-w/2,-h/2,w,h);ctx.restore();}

/* ---------- on the dike's crest (the places crest, crestKept, crestWalk) ---------- */
const cp_d=(X,Y,Z)=>cp_pj(CP_D.C,X,Y,Z);
// someone on the crest at (X, Z), seen from the front (o as person's), or from behind (o.back)
function cp_onCrest(ctx,id,X,Z,o){o=o||{};const C=CP_D.C,Y=o.Y==null?CP_D.crest:o.Y;if(!o.back)return cp_who(ctx,C,id,X,Y,Z,o);
  const z=cp_z(C,X,Z);if(z<0.6)return null;const p=cp_pj(C,X,Y,Z),s=C.F/z*1.7/560;cp_personBack(ctx,id,p[0],p[1],s,o);return{x:p[0],y:p[1],s};}
// someone seen from behind, standing: drawn as the series draws people from the front, with nothing of their front (no neckline, purse,
// apron or beard) and their head from behind: hair over it, or a hood, a coif or a veil
function cp_backOf(id){const k="cpBack_"+id;if(!PEOPLE[k]){const P=PEOPLE[id];PEOPLE[k]=Object.assign({},P,{top:Object.assign({},P.top,{inner:P.top.c,purse:false,apron:null,belt:null}),beard:null,glasses:null,earrings:null});}return k;}
function cp_backHead(ctx,P){const h=P.hat,hc=P.hatC||[238,232,218];
  if(h==="hood"){ctx.beginPath();ctx.moveTo(-54,-20);ctx.bezierCurveTo(-60,-92,60,-92,54,-20);ctx.bezierCurveTo(58,30,70,70,96,112);ctx.quadraticCurveTo(0,134,-96,112);ctx.bezierCurveTo(-70,70,-58,30,-54,-20);ctx.closePath();
    litFill(ctx,darken(hc,0.06),-96,-92,96,130);seam(ctx,hc,0.4);ctx.strokeStyle=rgba(darken(hc,0.3),0.45);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(0,-86);ctx.quadraticCurveTo(4,10,0,120);ctx.stroke();return;}
  if(h==="veil"){ctx.beginPath();ctx.moveTo(-50,-30);ctx.bezierCurveTo(-58,-86,58,-86,50,-30);ctx.bezierCurveTo(56,20,66,60,70,104);ctx.quadraticCurveTo(0,118,-70,104);ctx.bezierCurveTo(-66,60,-56,20,-50,-30);ctx.closePath();
    litFill(ctx,darken(hc,0.04),-70,-86,70,110);seam(ctx,hc,0.3);ctx.strokeStyle=rgba(darken(hc,0.25),0.4);ctx.lineWidth=2;for(const x of [-24,6,30]){ctx.beginPath();ctx.moveTo(x*0.6,-60);ctx.quadraticCurveTo(x,20,x*1.3,104);ctx.stroke();}return;}
  for(const s of [-1,1]){ell(ctx,s*41,2,7,11);litFill(ctx,darken(P.skin,0.1),-50,-12,50,12);}headPath(ctx);litFill(ctx,darken(P.skin,0.1),-42,-56,42,51);
  ctx.beginPath();bumpy(ctx,0,-8,46,54,Math.PI*0.86,Math.PI*2.14,40,0.06,P.seed);ctx.quadraticCurveTo(20,42,0,44);ctx.quadraticCurveTo(-20,42,-40,30);ctx.closePath();litFill(ctx,P.hair.c,-46,-64,46,44);
  if(h==="coif"){ctx.beginPath();ctx.moveTo(-46,14);ctx.bezierCurveTo(-54,-84,54,-84,46,14);ctx.quadraticCurveTo(0,30,-46,14);ctx.closePath();litFill(ctx,darken(hc,0.04),-54,-84,54,30);seam(ctx,hc,0.35);
    ctx.strokeStyle=rgba(darken(hc,0.25),0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-80);ctx.lineTo(0,24);ctx.stroke();}}
function cp_personBack(ctx,id,x,y,s,o){const k=head;head=(c,P)=>cp_backHead(c,P);try{person(ctx,cp_backOf(id),x,y,s,o||{});}finally{head=k;}}
/* ---------- the gap mended (the place polder, from the farm's mound) ---------- */
// a place painted at twice the frame's size, for a camera that starts close and pulls back without blurring it
function cp_placeHi(key){return wc_kept("cpHi:"+key,W*2,H*2,q=>{q.scale(2,2);WC_PLACES[key](q);});}
// The breach (CP_A.breach) filled with fresh clay up to the crest, and new turf laid on it in rows from the foot up (u, 0 to 1, how much
// is laid); people at work on it: two digging clay at its foot, two laying turf, one carrying a square of turf up to them; the flood's
// water still lying in the fields near it, in pools that shrink (dry, 0 to 1)
function cp_mendPolder(ctx,t,u,dry){const A=CP_A,C=A.C,P=cp_aP,[bx,bw]=A.breach,T=A.toe,K=A.crest[0],Hc=A.crest[1],x0=bx-bw,x1=bx+bw,R=wc_rng(591),
    sl=(X,v)=>[X,v*Hc,lerp(T,K,v)];
  for(const [X,Z,rx,rz,sd] of [[2,50,6,4.5,601],[36,47,7,5,603],[14,64,3,2.4,605]]){const k=1-0.45*clamp(dry,0,1),L=[];
    for(let i=0;i<28;i++){const a=i/28*TAU,w=1+0.14*Math.sin(a*3+sd)+0.06*Math.sin(a*7+sd*2);L.push([X+Math.cos(a)*rx*k*w,0.03,Z+Math.sin(a)*rz*k*w]);}const pts=P(L);if(pts.length>2)cp_pool(ctx,pts,0.8,sd);}
  // fresh clay over the gap, wider at its foot, its edges ragged where it meets the old turf; darker where it's still wet
  const L=[];for(let i=0;i<=12;i++){const X=lerp(x0-1.6,x1+1.6,i/12);L.push(sl(X+0.2*Math.sin(i*2.1),0.02*Math.sin(i*1.7)));}
  for(let i=1;i<=8;i++){const v=i/8;L.push(sl(lerp(x1+1.6,x1+0.3,v)+0.1*Math.sin(i*2.7),Math.min(v,0.985)));}for(let i=1;i<12;i++){const X=lerp(x1+0.3,x0-0.3,i/12);L.push(sl(X,0.985));}
  for(let i=0;i<8;i++){const v=1-i/8;L.push(sl(lerp(x0-1.6,x0-0.3,v)-0.1*Math.sin(i*2.3+1),Math.min(v,0.985)));}
  const patch=P(L);wc_wash(ctx,patch,mix(CP.clay,CP.clayDk,0.2),{kind:"ground",line:false,depth:0.85,seed:593});
  cp_mottle(ctx,patch,120,595,cp_aK(bx,T),cp_aK(bx,K),cp_a(bx,0,T)[1],cp_a(bx,Hc,K)[1],{dark:[150,120,96],size:0.5});
  // the new turf: squares, row by row from the foot, each row from the left, a little out of line; the newest fading in
  const nx=12,nv=7,n=nx*nv,on=n*clamp(u,0,1);for(let j=0;j<Math.ceil(on);j++){const r=Math.floor(j/nx),c=j%nx,a=clamp(on-j,0,1),jx=(hash(j,3)-0.5)*0.12,jv=(hash(j,5)-0.5)*0.02,
      X0=lerp(x0-1.4+r*0.16,x1+1.4-r*0.16,c/nx)+jx,X1=lerp(x0-1.4+r*0.16,x1+1.4-r*0.16,(c+1)/nx)+jx,v0=r/nv+jv,v1=(r+1)/nv+jv,
      sq=P([[X0+0.07,v0*Hc+0.02,lerp(T,K,v0)+0.05],[X1-0.07,v0*Hc+0.02,lerp(T,K,v0)+0.05],[X1-0.07,v1*Hc+0.02,lerp(T,K,v1)-0.05],[X0+0.07,v1*Hc+0.02,lerp(T,K,v1)-0.05]]);
    if(sq.length<3)continue;withA(ctx,a,()=>{ctx.fillStyle=rgba(wc_dim(mix(mix(CP.grass2,CP.grass3,0.3+0.4*hash(j,7)),CP.sedge,0.3),0.04),1);wc_tr(ctx,sq);ctx.fill();ctx.strokeStyle=rgba(CP.peat,0.4);ctx.lineWidth=0.7;ctx.stroke();});}
  // a stack of cut turf at the foot, ready to go up
  for(let i=0;i<5;i++){const q=cp_a(x0-0.4+(i%2)*0.5,0.12+i*0.13,T-1.4),k=cp_aK(x0,T-1.4);ctx.fillStyle=rgba(i%2?CP.peat:mix(CP.grass3,CP.sedge,0.3),1);ctx.fillRect(q[0]-0.45*k,q[1]-0.07*k,0.9*k,0.13*k);}
  // the people: two dig clay at the foot, two kneel to the turf on the slope, one carries a square of turf up from the foot
  const ph=(o)=>cp_dig(t+o,1.6);
  for(const [id,X,Z,o,fl] of [["cpDig",x0-3.2,T-1.6,0,false],["cpHus",x1+3,T-1.2,0.7,true]])
    cp_who(ctx,C,id,X,0,Z,{pose:"cp_digDown",pose2:"cp_digUp",mix:ph(o),t,flip:fl,wide:true,carry:cp_heldSpade({ground:-4,clod:clamp((ph(o)-0.35)/0.4,0,1)})});
  const r=Math.floor(on/nx),vr=Math.min(0.95,(r+0.6)/nv);
  for(const [id,X,o] of [["cpOwner",lerp(x0,x1,0.3),0],["cpOwnerC",lerp(x0,x1,0.72),0.9]]){const b=Math.sin(t*2.2+o);
    cp_who(ctx,C,id,X,vr*Hc,lerp(T,K,vr)-0.3,{pose:"cp_reachDown",pose2:"cp_basket",mix:0.5+0.5*b,t});}
  const e=clamp((t%4.2)/3.4,0,1),vc=lerp(0,vr-0.12,e),wk=Math.sin(t*6);
  cp_who(ctx,C,"cpSon",lerp(x0+1,x0+3,e),vc*Hc,lerp(T-2.5,lerp(T,K,vc),Math.min(1,e*3))-0.3,{pose:"cp_basket",pose2:wk>0?"walkA":"walkB",mix:e<1?Math.abs(wk)*0.5:0,t,carry:cp_heldTurf});}
// a square of turf held in both hands, grass up
function cp_heldTurf(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-14);
  cx.fillStyle=rgba(CP.peat,1);rr(cx,-84,-6,168,34,6);cx.fill();cx.fillStyle=rgba(mix(CP.grass2,CP.grass3,0.4),1);rr(cx,-86,-20,172,22,8);cx.fill();
  cx.strokeStyle=rgba(wc_dim(CP.grass3,0.3),0.9);cx.lineWidth=2.4;cx.lineCap="round";for(let i=0;i<16;i++){const x=-80+i*10.5;cx.beginPath();cx.moveTo(x,-16);cx.lineTo(x+(hash(i,3)-0.5)*6,-30-hash(i,5)*10);cx.stroke();}
  cx.restore();fingers(cx,P_,[l,r]);}

/* ---------- the dike from the field: each landowner's stretch, and the board's walk (the places bank and bankWalk) ---------- */
// The breach's view (cp_paintBreach) of other stretches, kept. For the stakes (bank): the ditches across the field are where each
// landowner's land ends, so each field is as wide as the stretch of dike above it. For the board's walk (bankWalk): closer, and one
// stretch has begun to slump, its crest sagging a little, the turf under it slid and the clay bare. CP_B's own values are swapped in
// while they're painted or drawn on (cp_withB)
// the three landowners' colours, as they wear them: madder, woad, and woad over madder
const CP_OWN=[[176,84,64],[70,104,140],[140,92,130]];
const CP_BANK={C:{F:1500,hz:640,eye:1.7},dX:[-10.25,6.75,10.25],cols:[CP.grass,CP.hay,CP.grass2,CP.grass3],sag:[0,1],low:4.4};
const CP_BWALK={C:{F:1700,hz:740,eye:1.7},toe:10,c0:14.5,c1:17.5,ditch:[7.6,9.2],sag:[0.5,6.5],low:4.05,dX:[-6.5,10.5],cols:[CP.grass2,CP.grass,CP.hay]};
function cp_withB(v,fn){const k={};for(const n in v)k[n]=CP_B[n];Object.assign(CP_B,v);try{return fn();}finally{Object.assign(CP_B,k);}}
// draw fn above the crest's line only: what stands on the crest stands behind its near edge
function cp_aboveCrest(ctx,fn){const B=CP_B,L=[];for(let X=-30;X<=30;X+=0.5)L.push(cp_b(X,cp_bCrest(X),B.c0));ctx.save();ctx.beginPath();ctx.moveTo(-50,-50);L.forEach(q=>ctx.lineTo(q[0],q[1]));
  ctx.lineTo(W+50,-50);ctx.closePath();ctx.clip();try{fn();}finally{ctx.restore();}}
// someone on the crest at X, a little behind its near edge; o as person's
function cp_onBank(ctx,id,X,o){const B=CP_B,Z=B.c0+0.3;return cp_who(ctx,B.C,id,X,cp_bCrest(X),Z,o);}
// the landowners' stretches: S [{x0, x1, col, mark}], each staked at its start, and the last at its end too, as it's driven in (a(i,
// end), 0 to 1)
function cp_bankStakes(ctx,S,a){cp_aboveCrest(ctx,()=>S.forEach((s,i)=>{cp_bankStake(ctx,s.x0,a(i,0),s.col,s.mark);if(i===S.length-1)cp_bankStake(ctx,s.x1,a(i,1),s.col,null);}));}
// a stake on the crest at X, driven in as u goes to 1 (it drops in and settles), a board on it with the owner's colour and house mark
function cp_bankStake(ctx,X,u,col,mark){if(u<=0.01)return;const B=CP_B,Z=B.c0+0.35,k=B.C.F/Z,dr=0.5*(1-spring(clamp(u,0,1))),b=cp_b(X,cp_bCrest(X)+dr,Z),h=1.55,top=cp_b(X,cp_bCrest(X)+dr+h,Z);
  withA(ctx,clamp(u*4,0,1),()=>{ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba(CP_WOODDK,1);ctx.lineWidth=Math.max(2,0.1*k);ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(top[0],top[1]);ctx.stroke();
    ctx.strokeStyle=rgba(wc_lit(CP_WOOD,0.1),1);ctx.lineWidth=Math.max(1,0.045*k);ctx.beginPath();ctx.moveTo(b[0]-0.015*k,b[1]);ctx.lineTo(top[0]-0.015*k,top[1]);ctx.stroke();
    if(mark!=null){const s=0.62*k,bx=top[0]-s/2,by=top[1]+0.08*k;ctx.fillStyle=rgba(wc_lit(CP_WOOD,0.32),1);rr(ctx,bx,by,s,s*0.78,s*0.08);ctx.fill();ctx.strokeStyle=rgba(CP_WOODDK,0.9);ctx.lineWidth=Math.max(1,s*0.035);ctx.stroke();
      ctx.fillStyle=rgba(col,0.9);ctx.fillRect(bx,by+s*0.66,s,s*0.12);cp_mark(ctx,mark,bx+s/2,by+s*0.33,s*0.26);}ctx.restore();});}
// a spade held upright in the right hand, its blade on the ground beside the foot: the grip a little above the hand
function cp_heldSpadeUp(cx,P_,hands){const h=hands[1],tip=[h[0]+26,0],L=Math.hypot(h[0]-tip[0],h[1]-tip[1])||1,d=[(h[0]-tip[0])/L,(h[1]-tip[1])/L],n=[-d[1],d[0]],s1=[tip[0]+d[0]*112,tip[1]+d[1]*112],top=[tip[0]+d[0]*400,tip[1]+d[1]*400];
  cx.save();cx.lineCap="round";cx.strokeStyle=rgba(CP_WOODDK,1);cx.lineWidth=15;cx.beginPath();cx.moveTo(s1[0],s1[1]);cx.lineTo(top[0],top[1]);cx.stroke();cx.strokeStyle=rgba(CP_WOOD,1);cx.lineWidth=9;cx.beginPath();cx.moveTo(s1[0],s1[1]);cx.lineTo(top[0],top[1]);cx.stroke();
  cx.strokeStyle=rgba(CP_WOODDK,1);cx.lineWidth=13;cx.beginPath();cx.moveTo(top[0]+n[0]*26,top[1]+n[1]*26);cx.lineTo(top[0]-n[0]*26,top[1]-n[1]*26);cx.stroke();
  const bl=[[s1[0]+n[0]*22,s1[1]+n[1]*22],[tip[0]+n[0]*28,tip[1]+n[1]*28],[tip[0]-n[0]*28,tip[1]-n[1]*28],[s1[0]-n[0]*22,s1[1]-n[1]*22]];cx.fillStyle=rgba(CP_WOOD,1);cx.beginPath();bl.forEach((q,i)=>i?cx.lineTo(q[0],q[1]):cx.moveTo(q[0],q[1]));
  cx.closePath();cx.fill();cx.strokeStyle=rgba(CP_WOODDK,0.8);cx.lineWidth=2.4;cx.stroke();cx.fillStyle=rgba([96,98,104],1);cx.fillRect(Math.min(tip[0]-28,tip[0]+28),tip[1]-20,56,20);cx.restore();fingers(cx,P_,[h]);}
// someone walking along the crest from X0 to X1, setting off at t0 (1.3 m a second); returns where they are, and draws them
function cp_bankWalker(ctx,id,t,t0,X0,X1,o){const B=CP_B,Z=B.c0+0.3,a=cp_b(X0,cp_bCrest(X0),Z)[0],b=cp_b(X1,cp_bCrest(X1),Z)[0],k=B.C.F/Z,w=gv_walk(t,t0,a,b,1.3*k),X=lerp(X0,X1,(w.x-a)/((b-a)||1)),
    q=cp_b(X,cp_bCrest(X),Z),s=k*1.7/560;w.bob*=s/0.35;gv_walker(ctx,id,w,q[1],s,Object.assign({t},o||{}));return{X,moving:w.moving,end:w.end};}

// a house mark, a farm's sign cut in wood: a few straight strokes, centred at (x, y), r its half size
function cp_mark(ctx,m,x,y,r){const L=[[[0,-1],[0,1],[-0.6,-0.4],[0,-1],[0.6,-0.4]],[[0,1],[0,-1],[-0.55,-0.5],[0.55,-0.5]],[[-0.6,-0.9],[0.6,0.9],[0,-1],[0,1],[0.6,-0.9],[-0.6,0.9]],
    [[0,-1],[0,1],[0.6,0.3],[-0.3,0.3]],[[-0.6,1],[0,-1],[0.6,1],[-0.4,0.3],[0.4,0.3]]][m%5];
  ctx.save();ctx.strokeStyle=rgba([60,44,32],0.95);ctx.lineWidth=Math.max(1.2,r*0.22);ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
  // pairs of points are strokes, except the first mark's arrowhead, which runs on
  if(m%5===0){ctx.moveTo(x,y-r);ctx.lineTo(x,y+r);ctx.moveTo(x-0.6*r,y-0.4*r);ctx.lineTo(x,y-r);ctx.lineTo(x+0.6*r,y-0.4*r);}
  else for(let i=0;i+1<L.length;i+=2){ctx.moveTo(x+L[i][0]*r,y+L[i][1]*r);ctx.lineTo(x+L[i+1][0]*r,y+L[i+1][1]*r);}ctx.stroke();ctx.restore();}

// a card on the sky, pinned, springing in at t0: one word, large
function cp_skyCard(ctx,t,t0,x,y,s,rot,col){const a=fin(t,t0,0.4);if(a<=0.01)return;const k=0.85+0.15*spring(fin(t,t0,0.6)),w=Math.round(tw(ctx,s,48,700)+96),h=104;
  ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(k,k);withA(ctx,a,()=>{gv_card(ctx,-w/2,-h/2,w,h,[s],{size:48,headSize:48,align:"center",y0:68,wash:col,washA:0.22,pinCol:GV.red});});ctx.restore();}

/* ---------- the land kept: ploughing, a cart of hay, the yard (on the place farm) ---------- */
// The strip beyond the first ditch being ploughed: an ox drawing the plough slowly to the left, a boy at its head, the ploughman at the
// handles, the turned earth behind them, gulls after the worms; in the yard, the children, their mother coming out with a basket, hens
// pecking. t0: when they set off
function cp_farmLife(ctx,t,t0){const F=CP_F,C=F.C,p=cp_f,P=L=>cp_proj(C,L,1),e=t-t0,R=wc_rng(571),[d0,d1]=CP_FD;
  // the strip being ploughed: its far half done on earlier passes; the near half turned behind the plough as it goes; furrows along it
  const Z=24.2,Xo=13.2-e*0.62,zz=[d0+0.9,d1-0.9],earth=(x0,za,zb)=>{const pts=P([[x0,0.01,za],[60,0.01,za],[60,0.01,zb],[x0,0.01,zb]]);if(pts.length<3)return;
    wc_wash(ctx,pts,mix(CP.peat,CP.clay,0.3),{kind:"ground",line:false,depth:0.9,seed:(za*10)|0,a:0.95});ctx.save();ctx.strokeStyle=rgba(CP.peatDk,0.5);ctx.lineCap="round";
    for(let z=za+0.2;z<zb;z+=0.32){const a=p(Math.max(x0,3),0.02,z),b=p(60,0.02,z);ctx.lineWidth=Math.max(1,cp_fK(0,z)*0.035);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();};
  earth(7.6,Z+1.3,zz[1]);earth(Math.max(7.6,Xo+2.3),Z-1.3,Z+1.3);
  // the ox and the plough: the beam from the yoke, the share in the earth, two handles back to the ploughman's hands
  const q=p(Xo,0,Z),k=cp_fK(Xo,Z);cp_ox(ctx,q[0],q[1],k,true,e);const pl=p(Xo+2.1,0,Z),hd=p(Xo+2.8,0.92,Z),hd2=p(Xo+2.75,0.98,Z+0.25);
  ctx.save();ctx.strokeStyle=rgba(CP_WOODDK,1);ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=Math.max(1.5,0.08*k);ctx.beginPath();ctx.moveTo(q[0]+0.85*k,q[1]-1.05*k);ctx.lineTo(pl[0]-0.2*k,pl[1]-0.3*k);ctx.lineTo(pl[0],pl[1]);ctx.stroke();
  ctx.lineWidth=Math.max(1.2,0.06*k);ctx.beginPath();ctx.moveTo(pl[0],pl[1]);ctx.lineTo(hd[0],hd[1]);ctx.moveTo(pl[0]+0.05*k,pl[1]);ctx.lineTo(hd2[0],hd2[1]);ctx.stroke();
  ctx.fillStyle=rgba([90,86,82],1);ctx.beginPath();ctx.moveTo(pl[0]-0.35*k,pl[1]+0.02*k);ctx.lineTo(pl[0]+0.1*k,pl[1]-0.28*k);ctx.lineTo(pl[0]+0.15*k,pl[1]+0.04*k);ctx.closePath();ctx.fill();ctx.restore();
  const wk=Math.sin(e*4.4);cp_who(ctx,C,"cpSon",Xo-0.7,0,Z-0.9,{pose:"stand",pose2:wk>0?"walkB":"walkA",mix:Math.abs(wk)*0.8,t,flip:true});
  cp_who(ctx,C,"cpOwnerC",Xo+3.2,0,Z+0.2,{pose:"cp_plough",pose2:wk>0?"walkA":"walkB",mix:Math.abs(wk)*0.4,t,flip:true});
  // gulls after the plough, wheeling low over the turned earth
  for(let i=0;i<5;i++){const ph=e*0.8+i*1.3,X=Xo+3.8+i*0.9+Math.sin(ph)*0.8,Y=0.9+0.5*Math.sin(ph*0.7+i)+i*0.22,g=p(X,Y,Z+0.6+i*0.4);cp_gull(ctx,g[0],g[1],cp_fK(X,Z)*1.25,t*7+i*2,i%2);}
  // the yard: hens pecking near us, the children by the door, their mother coming out with a basket of cheeses
  for(const [X,Z2,col,o,fl] of [[-1.8,5.4,[238,230,212],0,0],[-0.8,6.4,[172,108,62],1.3,1],[1.2,5.8,[226,214,190],2.1,0],[2.6,6.6,[150,92,56],0.7,1]]){const h=p(X,0,Z2),pk=Math.max(0,Math.sin(t*3.1+o*2.3));
    cp_hen(ctx,h[0],h[1],cp_fK(X,Z2),col,pk,fl);}
  cp_who(ctx,C,"cpKid",-0.9,0,8.9,{t,flip:true,pose:"stand"});cp_who(ctx,C,"cpKid2",0.2,0,9.4,{t,pose:"wave",flip:true});
  const we=clamp(e/3.6,0,1),ww=Math.sin(e*5);cp_who(ctx,C,"cpWife",lerp(-2.4,1.4,we),0,lerp(11.6,10.4,we),{pose:"cp_basket",pose2:we<1?(ww>0?"walkA":"walkB"):null,mix:we<1?Math.abs(ww)*0.6:0,t,flip:true,carry:cp_heldBasket});}
// a gull in flight at (x, y), s its span in px, flapping (ph); white, grey on its back and wings, the tips dark
function cp_gull(ctx,x,y,s,ph,fl){const f=Math.sin(ph),w=s/2,d=fl?-1:1;ctx.save();ctx.translate(x,y);ctx.scale(d,1);ctx.lineCap="round";ctx.lineJoin="round";
  ctx.fillStyle=rgba([244,244,240],1);ctx.beginPath();ctx.ellipse(0,0,w*0.32,w*0.1,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba([196,200,206],1);ctx.lineWidth=Math.max(1.2,w*0.12);ctx.beginPath();ctx.moveTo(-w,-w*0.45*f-w*0.1);ctx.quadraticCurveTo(-w*0.45,-w*0.35*f-w*0.25,0,0);ctx.quadraticCurveTo(w*0.45,-w*0.35*f-w*0.25,w,-w*0.45*f-w*0.1);ctx.stroke();
  ctx.strokeStyle=rgba([60,62,66],0.9);ctx.lineWidth=Math.max(1,w*0.1);ctx.beginPath();ctx.moveTo(-w,-w*0.45*f-w*0.1);ctx.lineTo(-w*0.8,-w*0.42*f-w*0.14);ctx.moveTo(w,-w*0.45*f-w*0.1);ctx.lineTo(w*0.8,-w*0.42*f-w*0.14);ctx.stroke();
  ctx.fillStyle=rgba([232,180,60],1);ctx.beginPath();ctx.moveTo(w*0.32,-w*0.02);ctx.lineTo(w*0.42,0);ctx.lineTo(w*0.32,w*0.03);ctx.fill();ctx.restore();}
// a hen at (x, y), k px a metre, col its feathers; pk, how far its head is down to peck (0 to 1); fl, facing left
function cp_hen(ctx,x,y,k,col,pk,fl){ctx.save();ctx.translate(x,y);if(fl)ctx.scale(-1,1);const c=k*0.01;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.fillStyle="rgba(60,50,40,0.18)";ctx.beginPath();ctx.ellipse(0,0,24*c,5*c,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba([200,150,70],1);ctx.lineWidth=Math.max(1,2.2*c);ctx.beginPath();ctx.moveTo(-4*c,-14*c);ctx.lineTo(-5*c,0);ctx.moveTo(4*c,-14*c);ctx.lineTo(5*c,0);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-22*c,-24*c);ctx.quadraticCurveTo(-30*c,-46*c,-20*c,-48*c);ctx.quadraticCurveTo(-14*c,-36*c,-8*c,-30*c);ctx.closePath();litFill(ctx,darken(col,0.12),-30*c,-48*c,-8*c,-24*c);
  ctx.beginPath();ctx.ellipse(-2*c,-24*c,20*c,12*c,-0.1,0,TAU);litFill(ctx,col,-22*c,-36*c,18*c,-12*c);seam(ctx,col,0.4);
  ctx.strokeStyle=rgba(darken(col,0.25),0.6);ctx.lineWidth=Math.max(0.8,1.4*c);ctx.beginPath();ctx.moveTo(-14*c,-26*c);ctx.quadraticCurveTo(-2*c,-20*c,10*c,-26*c);ctx.stroke();
  const hx=14*c+pk*8*c,hy=-38*c+pk*30*c;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.5,8*c);ctx.beginPath();ctx.moveTo(10*c,-28*c);ctx.lineTo(hx,hy);ctx.stroke();
  ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(hx,hy,6*c,0,TAU);ctx.fill();ctx.fillStyle=rgba([200,52,44],1);ctx.beginPath();ctx.ellipse(hx-1*c,hy-6*c,3.4*c,2.6*c,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.ellipse(hx+3*c,hy+5*c,1.8*c,2.6*c,0,0,TAU);ctx.fill();ctx.fillStyle=rgba([226,170,60],1);ctx.beginPath();ctx.moveTo(hx+5*c,hy-1.5*c);ctx.lineTo(hx+10*c,hy+0.5*c);ctx.lineTo(hx+5*c,hy+2*c);ctx.fill();
  ctx.fillStyle=rgba([30,26,24],1);ctx.beginPath();ctx.arc(hx+1.5*c,hy-1*c,1.1*c,0,TAU);ctx.fill();ctx.restore();}
// an ox from the side, walking (e, seconds walked) to the left: the series' cow, in the ox's colour, a yoke over its neck
function cp_ox(ctx,x,y,k,left,e){ctx.save();ctx.translate(x,y-Math.abs(Math.sin(e*4.6))*0.03*k);cp_cow(ctx,0,0,k*0.017,4,!left);
  ctx.strokeStyle=rgba(CP_WOODDK,1);ctx.lineCap="round";ctx.lineWidth=Math.max(1.5,0.1*k);const s=left?-1:1;ctx.beginPath();ctx.moveTo(s*0.75*k,-1.42*k);ctx.lineTo(s*0.95*k,-1.1*k);ctx.stroke();ctx.restore();}

/* ---------- the charter of 1255 ---------- */
// The board's charter on an oak table, seen from above: a sheet of parchment, its writing in lines too small to read, a coloured
// initial, folds; at its foot, a seal of wax on a cord; a quill and ink beside it
function cp_paintCharter(ctx){const R=wc_rng(581);wc_wash(ctx,[[-40,-40],[W+40,-40],[W+40,H+40],[-40,H+40]],[150,112,76],{kind:"ground",line:false,seed:583});
  ctx.save();ctx.strokeStyle=rgba([110,78,52],0.35);ctx.lineCap="round";for(let i=0;i<70;i++){const y=R()*H,x0=-40+R()*400;ctx.lineWidth=1+R()*2;ctx.beginPath();ctx.moveTo(x0,y);
    ctx.bezierCurveTo(x0+500,y+(R()-0.5)*20,x0+1100,y+(R()-0.5)*30,x0+1700+R()*400,y+(R()-0.5)*20);ctx.stroke();}ctx.restore();
  // the parchment, tipped a little, its edges uneven and darker
  ctx.save();ctx.translate(950,470);ctx.rotate(-0.025);const pw=920,ph=640,pts=[];for(let i=0;i<=40;i++){const u=i/40;pts.push([-pw/2+u*pw,-ph/2+(R()-0.5)*4]);}for(let i=0;i<=30;i++){const u=i/30;pts.push([pw/2+(R()-0.5)*4,-ph/2+u*ph]);}
  for(let i=0;i<=40;i++){const u=i/40;pts.push([pw/2-u*pw,ph/2+(R()-0.5)*4]);}for(let i=0;i<=30;i++){const u=i/30;pts.push([-pw/2+(R()-0.5)*4,ph/2-u*ph]);}
  ctx.fillStyle="rgba(50,36,24,0.3)";ctx.save();ctx.translate(10,14);wc_tr(ctx,pts);ctx.fill();ctx.restore();
  wc_wash(ctx,pts,[236,222,190],{kind:"plaster",line:false,seed:585});ctx.save();wc_tr(ctx,pts);ctx.clip();const g=ctx.createRadialGradient(0,0,ph*0.3,0,0,pw*0.62);g.addColorStop(0,"rgba(255,250,236,0)");
  g.addColorStop(1,"rgba(150,116,70,0.38)");ctx.fillStyle=g;ctx.fillRect(-pw,-ph,pw*2,ph*2);
  // the folds
  ctx.strokeStyle="rgba(140,110,70,0.3)";ctx.lineWidth=2;for(const x of [-pw/6,pw/6]){ctx.beginPath();ctx.moveTo(x,-ph/2);ctx.lineTo(x+3,ph/2);ctx.stroke();}ctx.beginPath();ctx.moveTo(-pw/2,ph*0.06);ctx.lineTo(pw/2,ph*0.06);ctx.stroke();
  // the writing: a book hand's upright strokes in words, too small to read, with a tall stroke or a tail here and there; ruled lines
  // under it, faint; at its head, a square of red with a blue knot in it, the way a scribe opened a charter, but no letter
  ctx.strokeStyle="rgba(150,120,90,0.18)";ctx.lineWidth=1;for(let l=0;l<24;l++){const y=-ph/2+70+l*21.5;ctx.beginPath();ctx.moveTo(-pw/2+56,y+0.5);ctx.lineTo(pw/2-54,y+0.5);ctx.stroke();}
  const ix=-pw/2+97,iy=-ph/2+95;wc_wash(ctx,wc_rect(ix-37,iy-37,74,74),[176,62,50],{kind:"door",lw:1,seed:587});ctx.save();ctx.strokeStyle=rgba([46,70,130],0.95);ctx.lineWidth=3.4;ctx.lineCap="round";
  ctx.beginPath();ctx.arc(ix,iy,22,0,TAU);ctx.stroke();for(let i=0;i<4;i++){const an=i*Math.PI/2+Math.PI/4;ctx.beginPath();ctx.arc(ix+Math.cos(an)*13,iy+Math.sin(an)*13,10,an+Math.PI*0.6,an+Math.PI*1.4+Math.PI);ctx.stroke();}
  ctx.fillStyle=rgba([226,190,96],1);ctx.beginPath();ctx.arc(ix,iy,5,0,TAU);ctx.fill();ctx.strokeStyle=rgba([46,70,130],0.7);ctx.lineWidth=1.4;for(let i=0;i<6;i++){const an=i/6*TAU;ctx.beginPath();ctx.moveTo(ix+Math.cos(an)*28,iy+Math.sin(an)*28);
    ctx.quadraticCurveTo(ix+Math.cos(an+0.3)*40,iy+Math.sin(an+0.3)*40,ix+Math.cos(an+0.55)*34,iy+Math.sin(an+0.55)*34);ctx.stroke();}ctx.restore();
  ctx.save();ctx.strokeStyle="rgba(58,42,32,0.86)";ctx.lineCap="round";ctx.lineJoin="round";for(let l=0;l<24;l++){const y=-ph/2+70+l*21.5,x0=-pw/2+(l<3?150:62),x1=pw/2-60-(l===23?380:0),hh=l<3?8:6.6;
    for(let x=x0;x<x1;){const n=2+Math.floor(R()*6);if(x+n*4.2>x1)break;ctx.lineWidth=1.5;ctx.beginPath();for(let m=0;m<n;m++){const xm=x+m*4.2,tall=R()<0.13,tail=!tall&&R()<0.07;
        ctx.moveTo(xm,y-(tall?hh*1.75:hh));ctx.lineTo(xm+0.4,tail?y+hh*0.7:y);if(m<n-1){ctx.moveTo(xm+0.4,y);ctx.lineTo(xm+4.2,y-hh*0.75);}}ctx.stroke();
      ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(x-1,y-hh);ctx.lineTo(x+1.2,y-hh-1.6);ctx.stroke();x+=n*4.2+5+(R()<0.15?4:0);}}ctx.restore();
  // the fold at its foot, with slits for the cord
  ctx.fillStyle="rgba(140,110,70,0.18)";ctx.fillRect(-pw/2,ph/2-70,pw,70);ctx.strokeStyle="rgba(140,110,70,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-pw/2,ph/2-70);ctx.lineTo(pw/2,ph/2-70);ctx.stroke();
  ctx.fillStyle="rgba(90,66,44,0.8)";ctx.fillRect(-14,ph/2-44,8,20);ctx.fillRect(8,ph/2-44,8,20);ctx.restore();
  // the cord and the seal hanging from it, lying on the table below the sheet
  ctx.strokeStyle=rgba([170,52,46],1);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-10,ph/2-34);ctx.bezierCurveTo(-30,ph/2+40,-16,ph/2+80,-4,ph/2+118);ctx.moveTo(12,ph/2-34);ctx.bezierCurveTo(30,ph/2+40,20,ph/2+80,6,ph/2+118);ctx.stroke();
  ctx.fillStyle="rgba(50,30,20,0.3)";ctx.beginPath();ctx.ellipse(8,ph/2+200,98,98,0,0,TAU);ctx.fill();const sg=ctx.createRadialGradient(-20,ph/2+160,10,0,ph/2+190,100);sg.addColorStop(0,rgba([178,74,52],1));sg.addColorStop(1,rgba([110,36,28],1));
  ctx.fillStyle=sg;ctx.beginPath();for(let i=0;i<30;i++){const a=i/30*TAU,r=94+R()*6;ctx.lineTo(Math.cos(a)*r,ph/2+190+Math.sin(a)*r);}ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba([90,28,22],0.7);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,ph/2+190,70,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(0,ph/2+190,56,0,TAU);ctx.stroke();
  // on the seal, a dike and water, in relief: no letters
  ctx.beginPath();ctx.moveTo(-40,ph/2+204);ctx.lineTo(-14,ph/2+176);ctx.lineTo(14,ph/2+176);ctx.lineTo(40,ph/2+204);ctx.stroke();ctx.lineWidth=2.4;for(const dy of [212,222]){ctx.beginPath();ctx.moveTo(-36,ph/2+dy);
    ctx.quadraticCurveTo(-18,ph/2+dy-6,0,ph/2+dy);ctx.quadraticCurveTo(18,ph/2+dy+6,36,ph/2+dy);ctx.stroke();}
  ctx.fillStyle="rgba(255,220,200,0.25)";ctx.beginPath();ctx.ellipse(-34,ph/2+150,22,12,-0.5,0,TAU);ctx.fill();ctx.restore();
  // a quill and an inkpot, to the right
  ctx.save();ctx.translate(1600,380);ctx.fillStyle="rgba(40,30,20,0.3)";ctx.beginPath();ctx.ellipse(10,70,64,22,0,0,TAU);ctx.fill();ctx.fillStyle=rgba([70,60,54],1);ctx.beginPath();ctx.ellipse(0,0,56,56,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([30,26,24],1);ctx.beginPath();ctx.ellipse(0,0,26,26,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.25)";ctx.beginPath();ctx.ellipse(-20,-22,14,8,-0.6,0,TAU);ctx.fill();
  ctx.rotate(0.5);ctx.fillStyle="rgba(40,28,20,0.22)";ctx.beginPath();ctx.moveTo(34,96);ctx.quadraticCurveTo(-6,196,70,322);ctx.quadraticCurveTo(100,206,58,100);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba([226,218,200],1);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-6,10);ctx.lineTo(70,330);ctx.stroke();ctx.fillStyle=rgba([236,230,214],0.95);ctx.beginPath();ctx.moveTo(20,90);
  ctx.quadraticCurveTo(-30,190,48,320);ctx.quadraticCurveTo(80,200,40,96);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(150,140,120,0.5)";ctx.lineWidth=1.4;ctx.stroke();ctx.restore();}

/* ---------- today: two people cycling on the dike (the place today) ---------- */
Object.assign(PEOPLE,{
  cpRideA:{name:"",role:"cyclist",side:"",edge:[236,232,226],seed:75,skin:[230,190,160],hair:{style:"bob",c:[196,150,96],streak:[226,192,140]},top:{kind:"sweater",c:[196,92,72],inner:[230,222,210]},bottom:{c:[60,70,96]},shoe:[60,60,66],build:{sh:66,hip:62,h:0.96}},
  cpRideB:{name:"",role:"cyclist",side:"",edge:[236,232,226],seed:76,skin:[150,104,76],hair:{style:"cropped",c:[40,32,28]},top:{kind:"overshirt",c:[86,120,96],inner:[220,216,206]},bottom:{c:[70,66,62]},shoe:[50,46,44],build:{sh:76,hip:64,h:1.0}}
});
// someone riding a bicycle towards us along the road on the crest, at (X, Z): the front wheel in front of their legs, their hands on the
// bars, pedalling (t)
function cp_rider(ctx,id,X,Z,t){const D=CP_D,C=D.C,z=cp_z(C,X,Z);if(z<1)return;const g=cp_pj(C,X,D.crest,Z),k=C.F/z,ph=t*7+X,pedal=Math.sin(ph)*0.03;
  const wr=0.34*k,cx=g[0],cy=g[1]-wr,hb=cy-0.78*k;ctx.save();ctx.strokeStyle=rgba([36,36,40],1);ctx.lineWidth=Math.max(1.4,0.045*k);ctx.beginPath();ctx.ellipse(cx,cy,Math.max(1.2,wr*0.1),wr,0,0,TAU);ctx.stroke();ctx.restore();
  const r=cp_who(ctx,C,id,X,D.crest+0.36+pedal,Z,{pose:"cp_ride",t});
  ctx.save();ctx.strokeStyle=rgba([150,40,40],1);ctx.lineWidth=Math.max(1.2,0.035*k);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,hb);ctx.stroke();
  ctx.strokeStyle=rgba([50,50,56],1);ctx.lineWidth=Math.max(1.2,0.03*k);ctx.beginPath();ctx.moveTo(cx-0.3*k,hb-0.04*k);ctx.quadraticCurveTo(cx,hb+0.03*k,cx+0.3*k,hb-0.04*k);ctx.stroke();
  ctx.fillStyle=rgba([250,240,190],0.95);ctx.beginPath();ctx.arc(cx,cy-0.5*k,Math.max(1,0.045*k),0,TAU);ctx.fill();ctx.restore();return r;}

/* ---------- the dike from above (the place aerial) ---------- */
// The polder's camera lifted 25 m up: the fields to the dike, the dike's crest and its far side, the river beyond
const CP_AERIAL={F:1000,hz:40,eye:25,yaw:0.06,cx:-17};
function cp_paintAerial(ctx){const k=CP_A.C;CP_A.C=CP_AERIAL;try{cp_paintPolder(ctx,{stage:"dike",aerial:true});}finally{CP_A.C=k;}}
// each landowner's land, seen from above, and their stretch of the dike: S [{x0, x1, col}], the fields between x0 and x1 tinted in their
// colour, spreading back from the dike towards us (u(i), 0 to 1), the dike's slope above them tinted too, and a stake at each end
const CP_LANDS=[{x0:-71,x1:-6,col:CP_OWN[0]},{x0:-6,x1:22,col:CP_OWN[1]},{x0:22,x1:36,col:CP_OWN[2]}];
function cp_aerialLands(ctx,S,u){const k=CP_A.C;CP_A.C=CP_AERIAL;try{const A=CP_A,T=A.toe,K=A.crest[0],P=cp_aP;
    // the small landowner's field: a ditch dug across the strip, so their land is only part of it
    cp_water(ctx,P([[35,0,T-7.6],[37,0,T-7.6],[37,0,1],[35,0,1]]),CP.ditch,0.9,611);
    S.forEach((s,i)=>{const e=easeCam(clamp(u(i),0,1));if(e<=0.01)return;const zf=lerp(T-7.6,1,e);ctx.save();ctx.globalCompositeOperation="color";ctx.fillStyle=rgba(s.col,1);
      const fd=P([[s.x0+1,0,T-7.6],[s.x1-1,0,T-7.6],[s.x1-1,0,zf],[s.x0+1,0,zf]]);ctx.globalAlpha=0.42;wc_tr(ctx,fd);ctx.fill();
      ctx.globalCompositeOperation="multiply";ctx.globalAlpha=0.14;wc_tr(ctx,fd);ctx.fill();ctx.globalCompositeOperation="color";
      ctx.globalAlpha=0.6*clamp(e*3,0,1);wc_tr(ctx,P([[s.x0,0.02,T],[s.x1,0.02,T],[s.x1,A.crest[1]+0.02,K],[s.x0,A.crest[1]+0.02,K]]));ctx.fill();ctx.restore();
      withA(ctx,clamp(e*3,0,1),()=>{for(const X of i===S.length-1?[s.x0,s.x1]:[s.x0]){const a=cp_a(X,A.crest[1],K+0.4),b=cp_a(X,A.crest[1]+2.2,K+0.4);ctx.strokeStyle=rgba(CP_WOODDK,1);ctx.lineWidth=2.4;ctx.lineCap="round";
        ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.fillStyle=rgba(s.col,1);ctx.fillRect(b[0]-1,b[1],8,5);}});});
    // the farms, willows and cattle stand on the land, over the colour
    ctx.drawImage(wc_kept("cpAerialThings",W,H,q=>cp_polderThings(q,{aerial:true})),0,0);}finally{CP_A.C=k;}}
