/* ===== Model the business: the series' pictures (shared by its two films) =====
   One true story across the series: the registers of the Ming, from 1368 (the Ming History, juan 77). The past is warm, as in From
   words to data: dusk over the fields of the lower Yangzi, the registers as bound books, the fields as plots drawn like the scales of
   a fish, and the story's people as plain silhouettes with no faces, lit at the edge, dressed for their time. Never in the style of
   Chinese painting or calligraphy: covers and slips carry no writing, and every word on screen is the film's own, in a pill.
   Drawn with The Inner Life of Data's primitives (glass, T, tag, glow, withA, fin) and From words to data's (yearTag, wrapT). */
const RG_PAPER=[238,224,196],RG_INK=[64,46,34],RG_YEL=[232,188,72],RG_EARTH=[200,132,86],RG_RIM=[255,198,146],RG_SIL=[36,27,30],MTB=[245,206,140];

// the moment a word is said in a line (as the voice reads it: the line's say, or its text), plus off
function wAt(sc,id,word,off){const ln=sc.vo.find(v=>v.id===id);if(!ln)return 0;const s=ln.say||ln.text,i=s.indexOf(word),d=sc.ends[id]-sc.cues[id];return sc.cues[id]+(i<0?0:d*i/s.length)+(off||0);}

/* ---------- shapes for silhouettes ---------- */
function rg_poly(p,P){let a=0;for(let i=0;i<P.length;i++){const[x0,y0]=P[i],[x1,y1]=P[(i+1)%P.length];a+=x0*y1-x1*y0;}if(a<0)P=P.slice().reverse();p.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)p.lineTo(P[i][0],P[i][1]);p.closePath();}
function rg_disc(p,x,y,rx,ry){p.moveTo(x+rx,y);p.ellipse(x,y,rx,ry,0,0,TAU);}
// a limb through a, b and c (shoulder, elbow, hand; or hip, knee, ankle), tapering from w0 to w1, rounded at its joints
function rg_limb(p,a,b,c,w0,w1){const P=[a,b,c],L=[],R=[];P.forEach(([x,y],i)=>{const[xa,ya]=P[Math.max(0,i-1)],[xb,yb]=P[Math.min(2,i+1)],d=Math.hypot(xb-xa,yb-ya)||1,w=lerp(w0,w1,i/2);L.push([x-(yb-ya)/d*w,y+(xb-xa)/d*w]);R.push([x+(yb-ya)/d*w,y-(xb-xa)/d*w]);});
  rg_poly(p,L.concat(R.reverse()));rg_disc(p,a[0],a[1],w0,w0);const wm=(w0+w1)/2;rg_disc(p,b[0],b[1],wm,wm);}

/* ---------- the story's people ----------
   A plain silhouette, feet at (x, y), about 300 px tall at s=1, lit at its edge from the low sun on the right of the frame.
   o.dress "tunic" (to the knee, legs below) or "robe" (to the ankle); o.head "wrap", "cap" or none; o.f 1 faces right, -1 left;
   o.walk, a phase in radians, swings the legs; o.load (0..1) leans the body under a weight. What the near hand holds, o.hold:
   "pole" (a carrying pole on the shoulder, a basket at each end, o.full heaps them), "rope" (a measuring cord, held forward),
   "hoe", "brick" (held at the chest) or "book". Arms hang down otherwise. Returns where the near hand is, in the frame. */
function rg_fig(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return[x,y];const f=o.f||1,dr=o.dress||"tunic",col=o.col||RG_SIL,rim=o.rim||RG_RIM,p=new Path2D(),pr=new Path2D();
  const ph=o.walk,wk=ph!=null,sw=wk?Math.sin(ph):0,lift=wk?Math.max(0,Math.cos(ph)):0,bob=wk?Math.abs(Math.sin(ph))*4:0,ld=o.load||0;
  // head, neck and headwear
  rg_disc(p,4,-270+bob,19,23);rg_poly(p,[[-8,-254+bob],[8,-254+bob],[8,-234+bob],[-8,-234+bob]]);
  if(o.head==="cap")rg_disc(p,3,-285+bob,21,12);if(o.head==="wrap"){rg_disc(p,4,-284+bob,22,11);rg_disc(p,-15,-280+bob,7,6);}
  // the body in its dress
  const R=dr==="robe"?[[9,-240],[24,-236],[38,-228],[42,-214],[39,-190],[35,-165],[31,-135],[33,-110],[37,-70],[41,-35],[45,-8]]:[[9,-240],[24,-236],[38,-228],[42,-214],[39,-190],[35,-165],[31,-135],[34,-112],[38,-92]];
  rg_poly(p,R.concat(R.slice().reverse().map(([u,v])=>[-u,v])).map(([u,v])=>[u,v+bob]));
  // legs: below the tunic, they swing as the figure walks; under a robe, only the feet show
  if(dr==="tunic"){[[-1,-sw],[1,sw]].forEach(([k,q])=>{const hx=k*10,ax=hx+q*24+4,ay=-8-(q>0?lift*10:0);rg_limb(p,[hx,-96+bob],[hx+q*10+8,-52+bob*0.5],[ax,ay],12,8);rg_disc(p,ax+8,ay+2,13,6);});}
  else{rg_disc(p,-10+(-sw)*14,-4,13,6);rg_disc(p,18+sw*14,-4-lift*3,13,6);}
  // arms: the far one down; the near one down, or on what it holds
  rg_limb(p,[-36,-222+bob],[-46,-166+bob],[-50,-114+bob],9,6.5);rg_disc(p,-50,-110+bob,7,8);
  const hd=o.hold,Hn=hd==="pole"?[40,-238]:hd==="rope"?[62,-150]:hd==="brick"?[46,-176]:hd==="book"?[40,-180]:hd==="hoe"?[52,-140]:[50,-114],S0=[36,-222];
  const Hb=[Hn[0],Hn[1]+bob],E=[(S0[0]+Hb[0])/2+(hd==="pole"?14:8),(S0[1]+Hb[1])/2+(hd==="pole"?6:5)+bob];rg_limb(p,[S0[0],S0[1]+bob],E,Hb,9,6.5);rg_disc(p,Hb[0],Hb[1]+3,7,8);
  // what the hand holds, in the same dark as the figure
  if(hd==="pole"){const by=-232+bob,sway=wk?Math.sin(ph*2)*3:0;pr.rect(-100,by-4,206,7);[[-92,1],[98,-1]].forEach(([bx,k])=>{const cx=bx+sway*k,top=-148+bob,full=o.full||0;
      pr.moveTo(bx-1,by);pr.lineTo(cx-15,top);pr.lineTo(cx-13,top);pr.lineTo(bx+1,by);pr.lineTo(cx+15,top);pr.lineTo(cx+13,top);pr.closePath();
      rg_poly(pr,[[cx-26,top],[cx+26,top],[cx+20,top+44],[cx-20,top+44]]);if(full>0)rg_disc(pr,cx,top+2,24,10*full);});}
  if(hd==="hoe"){pr.moveTo(Hn[0]-14,Hn[1]-24+bob);pr.lineTo(Hn[0]-8,Hn[1]-26+bob);pr.lineTo(118,-12);pr.lineTo(112,-8);pr.closePath();rg_poly(pr,[[104,-20],[134,-26],[136,-4],[110,-4]]);}
  if(hd==="brick")pr.rect(30,-196+bob,46,26);
  if(hd==="book")pr.rect(26,-206+bob,30,44);
  if(hd==="rope")rg_disc(pr,Hn[0]+6,Hn[1]+bob,6,6);
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(f*ld*0.09);ctx.scale(s*f,s);ctx.fillStyle=rgba(col,1);ctx.fill(p);ctx.fill(pr);
    // the rim of light down the lit side, inside the figure only
    ctx.save();ctx.clip(p);const rg=ctx.createLinearGradient(f>0?-70:70,0,f>0?70:-70,0);rg.addColorStop(0,rgba(rim,0));rg.addColorStop(0.68,rgba(rim,0));rg.addColorStop(1,rgba(rim,o.rimA==null?0.6:o.rimA));ctx.fillStyle=rg;ctx.fillRect(-160,-330,320,340);ctx.restore();
    ctx.restore();});
  const c=Math.cos(f*ld*0.09),sn=Math.sin(f*ld*0.09),hx=Hb[0]*s*f+(hd==="rope"?6*s*f:0),hy=Hb[1]*s;return[x+hx*c-hy*sn,y+hx*sn+hy*c];}

/* ---------- the land at dusk ----------
   Side on, in the world the camera looks at: the walls of Nanjing and a gate at the left (x up to 380), the road out of the gate,
   villages of households along it (x 1300 to 2400), fields of rice below it, and a rich estate behind its own walls at the right
   (x 2700 to 3460). The sky and the hills sit further back and move less as the camera pans. o.dim darkens the land. */
const RG_HOUSES=[[1340,650,0.9],[1460,660,1.05],[1590,646,0.85],[1720,664,1.0],[1850,652,0.9],[1985,668,1.1],[2120,650,0.88],[2250,664,1.0],[2380,654,0.92]];
/* the rice fields below the road: rows of plots, taller as they come nearer. The plots of a row share their sides, which lean a
   little, and two rows share the dike between them, which bends gently along the land (rg_dike). Each plot is water that holds the
   sky, the far edge brighter than the near; about half have young rice in rows. */
let RG_PAD=null;const RG_ROWY=[];
function rg_dike(r,x){return RG_ROWY[r]+Math.sin(x*0.0031+r*1.7)*5*(1+r*0.35)+Math.sin(x*0.011+r)*2*(1+r*0.2);}
function rg_paddies(){if(RG_PAD)return RG_PAD;let y=742;for(let r=0;r<=7;r++){RG_ROWY[r]=y;y+=Math.round(30*Math.pow(1.3,r));}const P=[];
  for(let r=0;r<7;r++){let x=380,skL=(hash(r,4)-0.5)*40;
    while(x<5000){const w=(190+hash(r*31+Math.round(x),5)*230)*(0.85+r*0.07),skR=(hash(r*17+Math.round(x+w),6)-0.5)*(40+r*8);
      P.push({x,y:RG_ROWY[r],w,h:RG_ROWY[r+1]-RG_ROWY[r],skL,skR,rice:hash(r*13+Math.round(x),7)>0.46,k:hash(r*7+Math.round(x),8),r});x+=w;skL=skR;}}
  return RG_PAD=P;}
// a plot's outline: along its far dike, down its right side, back along its near dike
function rg_padPts(q){if(q.pts)return q.pts;const r=q.r,x0t=q.x+q.skL,x1t=q.x+q.w+q.skR,n=6,P=[];
  for(let i=0;i<=n;i++){const xx=lerp(x0t,x1t,i/n);P.push([xx,rg_dike(r,xx)]);}for(let i=n;i>=0;i--){const xx=lerp(q.x,q.x+q.w,i/n);P.push([xx,rg_dike(r+1,xx)]);}return q.pts=P;}
function rg_padPath(ctx,q){const P=rg_padPts(q);ctx.beginPath();P.forEach(([u,v],i)=>i?ctx.lineTo(u,v):ctx.moveTo(u,v));ctx.closePath();}
// where the road runs at x: a point between its two edges, read from the curves it's drawn with
let RG_ROAD=null;
function rg_roadY(x){if(!RG_ROAD){RG_ROAD=[];const b=(u,p0,p1,p2,p3)=>{const m=1-u;return m*m*m*p0+3*m*m*u*p1+3*m*u*u*p2+u*u*u*p3;};for(let i=0;i<=240;i++){const u=i/240,y0=b(u,640,640,690,700),y1=b(u,690,690,730,738);RG_ROAD.push([b(u,190,900,1500,3600),lerp(y0,y1,0.6)]);}}
  if(x>=3600)return 722.8+(x-3600)*0.002;const i=RG_ROAD.findIndex(p=>p[0]>=x);if(i<=0)return RG_ROAD[i<0?RG_ROAD.length-1:0][1];const a=RG_ROAD[i-1],c=RG_ROAD[i];return lerp(a[1],c[1],(x-a[0])/(c[0]-a[0]));}
function rg_par(cam,f){return{x:960+(cam.x-960)*f,y:540+(cam.y-540)*f,z:1+(cam.z-1)*f};}
// the sun's place in the sky, and where its light falls on the water, in the land's own coordinates
const RG_SUN=[1560,500];
function rg_glintX(cam){const pc=rg_par(cam,0.12),sx=W/2+(RG_SUN[0]-pc.x)*pc.z;return cam.x+(sx-W/2)/cam.z;}
function rg_sky(ctx,S,cam,t){setCam(ctx,S,rg_par(cam,0.12));const g=ctx.createLinearGradient(0,-300,0,620);g.addColorStop(0,"#170f22");g.addColorStop(0.38,"#3e2640");g.addColorStop(0.62,"#93525a");g.addColorStop(0.8,"#e2986a");g.addColorStop(0.92,"#f4c68c");g.addColorStop(1,"#f6d8a4");
  ctx.fillStyle=g;ctx.fillRect(-3000,-1400,9000,3200);
  // the sun, low behind the far hills
  const[sx,sy]=RG_SUN;glow(ctx,sx,sy,520,[255,214,160],0.42);glow(ctx,sx,sy,150,[255,236,200],0.7);ctx.fillStyle="rgba(255,240,214,0.95)";ctx.beginPath();ctx.arc(sx,sy,46,0,TAU);ctx.fill();
  // long thin clouds, dark above and lit from below, warmer as they come down to the sun
  for(let i=0;i<9;i++){const cy=100+i*42+hash(i,2)*26,cx=((hash(i,3)*4200+t*(2.4+i*0.5))%4800)-1500,w=380+hash(i,4)*720,h=6+hash(i,5)*9,lit=i/8;
    const dk=mix([62,38,64],[150,84,98],lit),lt=mix([190,112,118],[255,204,164],lit);
    [[-w*0.16,-h*0.5,0.5,0.8,dk,0.42],[0,0,1,1,dk,0.5],[w*0.06,h*0.7,0.78,0.42,lt,0.62]].forEach(([ox,oy,sw,sh,col,al])=>{const ww=w*sw,x0=cx+ox-ww/2,gr=ctx.createLinearGradient(x0,0,x0+ww,0);
      gr.addColorStop(0,rgba(col,0));gr.addColorStop(0.28,rgba(col,al));gr.addColorStop(0.72,rgba(col,al));gr.addColorStop(1,rgba(col,0));ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(cx+ox,cy+oy,ww/2,h*sh,0,0,TAU);ctx.fill();});}}
// the hills, two ridges; behind the far one, smoke from the war, rising in dark plumes that lean in the wind and thin as smoke (0..1) falls
function rg_hills(ctx,S,cam,t,smoke){[[0.32,470,"#6e4250",44,0.004,1.3],[0.58,520,"#4e3141",34,0.006,2.1]].forEach(([f,y0,c,amp,fr,ph],n)=>{setCam(ctx,S,rg_par(cam,f));
  if(n===0&&smoke>0)for(let k=0;k<3;k++){const bx=700+k*780+hash(k,7)*120;for(let i=0;i<12;i++){const u=(t*0.035+i/12+k*0.31)%1,x=bx+u*u*300+Math.sin(u*5+k*2)*24,y=470-u*400,r=26+u*120,al=0.3*smoke*Math.sin(Math.PI*Math.min(1,u*1.4))*(1-u*0.5);
    if(al<=0.004)continue;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,"rgba(44,30,40,"+al+")");g.addColorStop(1,"rgba(44,30,40,0)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);}}
  ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-2400,1400);for(let x=-2400;x<=5600;x+=40)ctx.lineTo(x,y0-amp*(0.6+0.4*Math.sin(x*fr+ph))*(0.7+0.3*Math.sin(x*fr*2.7+ph*3)));ctx.lineTo(5600,1400);ctx.closePath();ctx.fill();});}
// a roof with eaves that lift at the ends, its eave line at y, w wide and h high
function rg_roof(ctx,cx,y,w,h,col){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(cx-w/2-24,y+4);ctx.quadraticCurveTo(cx-w/2+10,y+h*0.1,cx-w*0.32,y-h*0.55);ctx.lineTo(cx+w*0.32,y-h*0.55);ctx.quadraticCurveTo(cx+w/2-10,y+h*0.1,cx+w/2+24,y+4);ctx.lineTo(cx+w/2-6,y+14);ctx.lineTo(cx-w/2+6,y+14);ctx.closePath();ctx.fill();}
function rg_wall(ctx){const Y=640,T0=478,c="#2d2126";ctx.fillStyle=c;ctx.fillRect(-900,T0,1280,Y-T0+40);
  for(let x=-900;x<380;x+=34)ctx.fillRect(x,T0-16,20,18);
  // the gate: an arch through the wall, and its tower on top, two roofs
  ctx.fillStyle="#1a1216";ctx.beginPath();ctx.moveTo(70,Y+40);ctx.lineTo(70,568);ctx.arc(130,568,60,Math.PI,0);ctx.lineTo(190,Y+40);ctx.closePath();ctx.fill();
  ctx.fillStyle=c;ctx.fillRect(18,404,224,78);rg_roof(ctx,130,404,300,60,c);ctx.fillRect(48,330,164,46);rg_roof(ctx,130,334,240,54,c);
  // rim light on the wall's top and the tower's right side
  ctx.fillStyle="rgba(255,190,140,0.32)";ctx.fillRect(-900,T0,1280,3);ctx.fillRect(238,404,4,78);ctx.fillRect(374,T0,6,Y-T0+40);}
function rg_house(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="#6a4a3a";ctx.fillRect(-58,-74,116,74);ctx.fillStyle="rgba(255,190,140,0.22)";ctx.fillRect(40,-74,18,74);
  ctx.fillStyle="#2a1d20";ctx.beginPath();ctx.moveTo(-78,-70);ctx.quadraticCurveTo(-50,-80,-40,-112);ctx.lineTo(40,-112);ctx.quadraticCurveTo(50,-80,78,-70);ctx.lineTo(70,-62);ctx.lineTo(-70,-62);ctx.closePath();ctx.fill();
  ctx.fillStyle="#22181a";ctx.fillRect(-14,-44,28,44);const lit=o.lit==null?1:o.lit;ctx.fillStyle="rgba(255,"+(196+30*lit)+",120,"+(0.25+0.6*lit)+")";ctx.fillRect(-46,-50,20,18);ctx.fillRect(26,-50,20,18);ctx.restore();
  if(lit>0.2)glow(ctx,x,y-40*s,70*s,[255,200,120],0.16*lit);}
// the rich estate: a garden of trees, a hall of two roofs with its windows lit, and its own walls, tiled along the top, with a gate
function rg_estate(ctx){const D="#211719",Wl="#30232a";
  [[2752,566,1.05],[2990,560,0.8],[3236,552,0.7],[3418,562,1.15]].forEach(([tx,ty,s])=>{ctx.fillStyle="#291f25";ctx.fillRect(tx-5*s,ty-74*s,10*s,74*s);[[0,-100,48,30],[-32,-80,34,24],[32,-82,36,24],[4,-126,32,22]].forEach(([u,v,rx,ry])=>{ctx.beginPath();ctx.ellipse(tx+u*s,ty+v*s,rx*s,ry*s,0,0,TAU);ctx.fill();});
    ctx.fillStyle="rgba(255,190,140,0.16)";ctx.beginPath();ctx.ellipse(tx+30*s,ty-104*s,18*s,22*s,0,-1.2,1.2);ctx.fill();});
  ctx.fillStyle="#3a2a2c";ctx.fillRect(2900,476,380,90);ctx.fillStyle="rgba(255,206,130,0.78)";for(let i=0;i<6;i++)ctx.fillRect(2922+i*60,500,26,26);
  ctx.fillStyle="#34262a";ctx.fillRect(2966,412,248,48);ctx.fillStyle="rgba(255,206,130,0.6)";for(let i=0;i<4;i++)ctx.fillRect(2990+i*56,424,20,18);
  rg_roof(ctx,3090,476,440,72,D);rg_roof(ctx,3090,414,300,54,D);
  ctx.fillStyle=Wl;ctx.fillRect(2700,566,760,104);ctx.fillStyle="rgba(0,0,0,0.18)";ctx.fillRect(2700,640,760,30);
  ctx.fillStyle=D;ctx.beginPath();ctx.moveTo(2688,570);ctx.lineTo(3472,570);ctx.lineTo(3462,554);ctx.lineTo(2698,554);ctx.closePath();ctx.fill();
  ctx.fillStyle="#1a1215";ctx.fillRect(3052,604,76,66);rg_roof(ctx,3090,598,116,26,D);
  ctx.fillStyle="rgba(255,190,140,0.3)";ctx.fillRect(2698,554,764,2.5);ctx.fillRect(3456,570,4,100);}
// grain owed: a sack, tied at the top
function rg_sack(ctx,x,y,s,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="#b48a58";ctx.beginPath();ctx.moveTo(-22,0);ctx.quadraticCurveTo(-28,-30,-12,-44);ctx.lineTo(12,-44);ctx.quadraticCurveTo(28,-30,22,0);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,226,170,0.35)";ctx.beginPath();ctx.moveTo(10,-40);ctx.quadraticCurveTo(24,-28,20,-2);ctx.lineTo(14,-2);ctx.quadraticCurveTo(16,-26,6,-40);ctx.closePath();ctx.fill();
  ctx.fillStyle="#7a5a36";ctx.fillRect(-12,-50,24,8);ctx.beginPath();ctx.ellipse(0,-54,10,6,0,0,TAU);ctx.fill();ctx.restore();});}
// the fields: water that holds the sky, the sun's light on it, young rice in rows, and the dikes between the plots
function rg_fields(ctx,cam){const P=rg_paddies(),x0=cam.x-W/2/cam.z-240,x1=cam.x+W/2/cam.z+240,gx=rg_glintX(cam),vis=P.filter(q=>q.x+q.w+60>=x0&&q.x-60<=x1);
  vis.forEach(q=>{const r=q.r,ty=q.y,by=q.y+q.h,c0=mix(mix([240,184,132],[150,86,100],r/6),[255,214,170],0.18*q.k),c1=mix(c0,[44,26,42],0.42+0.05*r);
    rg_padPath(ctx,q);const g=ctx.createLinearGradient(0,ty-8,0,by+8);g.addColorStop(0,rgba(c0,1));g.addColorStop(1,rgba(c1,1));ctx.fillStyle=g;ctx.fill();});
  // the low sun on the water: a column of light below it, brightest on the far plots
  ctx.save();ctx.translate(gx,742);ctx.scale(1,4.2);const sg=ctx.createRadialGradient(0,0,0,0,0,150);sg.addColorStop(0,"rgba(255,232,196,0.62)");sg.addColorStop(0.5,"rgba(255,214,170,0.22)");sg.addColorStop(1,"rgba(255,214,170,0)");ctx.fillStyle=sg;ctx.fillRect(-150,0,300,150);ctx.restore();
  // young rice, in rows across the plot, each shoot a small fan of leaves
  vis.forEach(q=>{if(!q.rice)return;const r=q.r,n=Math.max(2,Math.floor(q.h/(6+r*2.6))),sp=10+r*3.6,th=3.2+r*1.7,P2=rg_padPts(q),x0t=P2[0][0],x1t=P2[6][0],x0b=q.x,x1b=q.x+q.w;
    ctx.strokeStyle=rgba(mix([58,82,44],[96,116,60],q.k),0.9);ctx.lineWidth=1.1+r*0.34;ctx.lineCap="round";ctx.beginPath();
    for(let j=0;j<n;j++){const v=(j+0.7)/n,xl=lerp(x0t,x0b,v)+sp*0.5,xr=lerp(x1t,x1b,v)-sp*0.3;let m=0;for(let xx=xl+hash(j,r)*sp*0.5;xx<xr;xx+=sp,m++){const yy=lerp(rg_dike(r,xx),rg_dike(r+1,xx),v)-1,hh=th*(0.8+0.4*hash(m*7+j,r+q.k*50)),lean=(hash(m*3+j,r+11)-0.5)*hh*0.3;
      // three leaves from one root, bending out
      ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx-hh*0.08,yy-hh*0.6,xx-hh*0.46+lean,yy-hh*0.92);ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx+hh*0.1,yy-hh*0.6,xx+hh*0.48+lean,yy-hh*0.86);ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx+hh*0.02,yy-hh*0.7,xx+hh*0.1+lean,yy-hh*1.16);}}ctx.stroke();});
  // the dikes: earth between the plots, lit along their tops
  const wd=r=>2.6+r*1.5;ctx.strokeStyle="#2c1e18";ctx.lineJoin="round";ctx.lineCap="round";
  const xa=Math.max(380,x0),xb=Math.min(5000,x1);for(let r=0;r<=7;r++){ctx.lineWidth=wd(Math.min(r,6));ctx.beginPath();for(let x=xa;x<=xb+40;x+=40)x===xa?ctx.moveTo(x,rg_dike(r,x)):ctx.lineTo(x,rg_dike(r,x));ctx.stroke();}
  vis.forEach(q=>{const P2=rg_padPts(q);ctx.lineWidth=wd(q.r)*0.8;ctx.beginPath();ctx.moveTo(P2[0][0],P2[0][1]);ctx.lineTo(P2[13][0],P2[13][1]);ctx.stroke();});
  ctx.strokeStyle="rgba(255,196,146,0.34)";for(let r=0;r<7;r++){ctx.lineWidth=1.2+r*0.3;ctx.beginPath();for(let x=xa;x<=xb+40;x+=40){const yy=rg_dike(r,x)-wd(r)*0.42;x===xa?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();}
  // a warm haze over the far fields, and the near ones in the evening's shadow
  const hz=ctx.createLinearGradient(0,742,0,830);hz.addColorStop(0,"rgba(246,196,150,0.24)");hz.addColorStop(1,"rgba(246,196,150,0)");ctx.fillStyle=hz;ctx.fillRect(x0,742,x1-x0,88);
  const sh=ctx.createLinearGradient(0,960,0,1290);sh.addColorStop(0,"rgba(16,9,16,0)");sh.addColorStop(1,"rgba(16,9,16,0.6)");ctx.fillStyle=sh;ctx.fillRect(x0,960,x1-x0,400);}
// the land and its villages; the people, sacks and pills are the scene's
function rg_land(ctx,S,cam,t,o){o=o||{};rg_sky(ctx,S,cam,t);rg_hills(ctx,S,cam,t,o.smoke||0);setCam(ctx,S,cam);
  const g=ctx.createLinearGradient(0,560,0,1200);g.addColorStop(0,"#6b4d38");g.addColorStop(0.3,"#4b3527");g.addColorStop(1,"#21160f");ctx.fillStyle=g;ctx.fillRect(-2000,560,7600,900);
  rg_wall(ctx);rg_estate(ctx);RG_HOUSES.forEach(([hx,hy,s],i)=>rg_house(ctx,hx,hy,s,{lit:o.lit?o.lit(i):0.8}));
  // the road out of the gate, along the villages, worn into two ruts
  ctx.fillStyle="#a07c5a";ctx.beginPath();ctx.moveTo(190,640);ctx.bezierCurveTo(900,640,1500,690,3600,700);ctx.lineTo(4700,702);ctx.lineTo(4700,740);ctx.lineTo(3600,738);ctx.bezierCurveTo(1500,730,900,690,70,690);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,214,160,0.22)";ctx.beginPath();ctx.moveTo(190,640);ctx.bezierCurveTo(900,640,1500,690,3600,700);ctx.lineTo(4700,702);ctx.lineTo(4700,708);ctx.lineTo(3600,706);ctx.bezierCurveTo(1500,696,900,646,190,646);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(70,48,32,0.32)";ctx.lineWidth=3;[0.4,0.75].forEach(k=>{ctx.beginPath();for(let x=200;x<=4700;x+=60){const yy=lerp(rg_roadY(x)-16,rg_roadY(x)+12,k);x===200?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();});
  rg_fields(ctx,cam);
  if(o.dim)dark(ctx,S,o.dim);}

/* ---------- the registers ---------- */
/* a register: a bound book, sewn along its right edge as the books of the time were, its cover in o.col, a blank paper slip for its
   title. o.open (0..1) swings the cover open to a spread twice as wide, about the same centre (cx, cy); o.left and o.right then draw
   on its two pages (ctx, x, y, w, h). w and h are one page. */
function rg_book(ctx,cx,cy,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const u=clamp(o.open||0,0,1),col=o.col||RG_YEL,L=cx-w/2-u*w/2,Hx=L+w,y=cy-h/2,X=Hx-w*Math.cos(Math.PI*u);
  withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=30;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(mix(col,[40,26,16],0.45),1);ctx.fillRect(L-6,y-6,(u>0.5?X:Hx)-L+12,h+12);ctx.restore();
    const page=(px,pw)=>{ctx.fillStyle=rgba(RG_PAPER,1);ctx.fillRect(px,y,pw,h);const g=ctx.createLinearGradient(px,0,px+pw,0);g.addColorStop(0,"rgba(120,90,50,0.10)");g.addColorStop(1,"rgba(120,90,50,0.22)");ctx.fillStyle=g;ctx.fillRect(px,y,pw,h);};
    if(u>0){page(L,w);if(o.left)withA(ctx,fin(u,0.55,0.45),()=>o.left(ctx,L,y,w,h));}
    if(u<0.5){const cw=Hx-X,k=cw/w;
      // the pages, a little proud of the cover at its open edge and at its foot
      ctx.fillStyle=rgba(mix(RG_PAPER,[150,118,80],0.3),1);ctx.fillRect(X-5*k,y+5,cw,h);ctx.strokeStyle="rgba(110,84,52,0.45)";ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<4;i++){ctx.moveTo(X-5*k+i*1.4*k,y+5+h-1);ctx.lineTo(X-5*k+i*1.4*k,y+8);}ctx.stroke();
      // the cover: cloth in its colour, finely woven, darker at its edges, with a frame pressed in
      ctx.fillStyle=rgba(col,1);ctx.fillRect(X,y,cw,h);ctx.save();ctx.beginPath();ctx.rect(X,y,cw,h);ctx.clip();ctx.strokeStyle="rgba(70,40,12,0.09)";ctx.lineWidth=1.4;ctx.beginPath();for(let d=-h;d<cw;d+=6){ctx.moveTo(X+d,y+h);ctx.lineTo(X+d+h,y);}ctx.stroke();ctx.restore();
      const g=ctx.createLinearGradient(X,y,X+cw,y+h);g.addColorStop(0,"rgba(255,255,255,0.16)");g.addColorStop(0.6,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(60,30,10,0.3)");ctx.fillStyle=g;ctx.fillRect(X,y,cw,h);
      ctx.strokeStyle=rgba(mix(col,[40,22,8],0.5),0.55);ctx.lineWidth=2;ctx.strokeRect(X+9*k,y+9,cw-18*k-16*k,h-18);
      // the title slip, top left: plain paper in a thin frame, with nothing written on it
      ctx.fillStyle=rgba(mix(RG_PAPER,col,0.18),1);ctx.fillRect(X+cw*0.12,y+h*0.07,cw*0.19,h*0.5);ctx.strokeStyle=rgba(mix(col,[40,22,8],0.55),0.7);ctx.lineWidth=1.6;ctx.strokeRect(X+cw*0.12+3*k,y+h*0.07+3,cw*0.19-6*k,h*0.5-6);
      // the binding: four stitches through holes along the right edge, and the corners wrapped in silk
      ctx.strokeStyle=rgba(mix(col,[30,18,10],0.6),0.9);ctx.lineWidth=2;for(let i=0;i<4;i++){const sy=y+h*(0.14+i*0.24);ctx.beginPath();ctx.moveTo(Hx-16*k,sy);ctx.lineTo(Hx,sy);ctx.stroke();ctx.beginPath();ctx.arc(Hx-16*k,sy,2.5,0,TAU);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(Hx-16*k,y);ctx.lineTo(Hx-16*k,y+h);ctx.stroke();ctx.fillStyle=rgba(mix(col,[30,18,10],0.45),1);ctx.fillRect(Hx-8*k,y,8*k,10);ctx.fillRect(Hx-8*k,y+h-10,8*k,10);}
    else{const cw=X-Hx;page(Hx,cw);if(o.right&&u>0.95)withA(ctx,fin(u,0.95,0.05),()=>o.right(ctx,Hx,y,cw,h));ctx.fillStyle="rgba(80,50,20,0.25)";ctx.fillRect(Hx-3,y,6,h);}});}
// ink on a register's page: short rows of strokes, like entries written in columns; no real characters
function rg_entries(ctx,x,y,w,h,n,seed,a){withA(ctx,a==null?1:a,()=>{ctx.strokeStyle=rgba(RG_INK,0.55);ctx.lineCap="round";const cols=n||8,cw=w/(cols+1);
  for(let c=0;c<cols;c++){const cx=x+w-cw*(c+1);ctx.lineWidth=3;for(let r=0;r<7;r++){const yy=y+h*0.1+r*h*0.115,l=h*0.05*(0.5+hash(c*9+r,seed||1));ctx.beginPath();ctx.moveTo(cx,yy);ctx.lineTo(cx,yy+l);ctx.stroke();}}});}
/* a village unit of the Yellow Registers: 110 households, the ten heads in a row above (o.head is this year's, lit), and below them
   ten groups of ten. Drawn in ink on paper, house by house as o.p goes from 0 to 1. s=1 is about 560 px wide. */
function rg_unit(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p;if(a<=0.01)return;const hs=(hx,hy,k,lit,big)=>{ctx.save();ctx.translate(hx,hy);ctx.scale(k,k);
    ctx.fillStyle=lit?rgba(RG_YEL,1):rgba(RG_INK,big?0.9:0.7);ctx.beginPath();ctx.moveTo(-15,-12);ctx.lineTo(0,-24);ctx.lineTo(15,-12);ctx.closePath();ctx.fill();ctx.fillRect(-11,-12,22,16);ctx.restore();};
  withA(ctx,a,()=>{for(let i=0;i<10;i++){const q=clamp(p*14-i*0.25,0,1);if(q<=0)continue;withA(ctx,q,()=>{const hx=x+(i-4.5)*56*s,lit=o.head===i;if(lit){ctx.fillStyle=rgba(RG_YEL,0.28);rr(ctx,hx-26*s,y-58*s,52*s,70*s,8*s);ctx.fill();}hs(hx,y,1.25*s,lit,1);});}
    const ln=clamp(p*14-2.3,0,1);if(ln>0){ctx.strokeStyle=rgba(RG_INK,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-280*s,y+22*s);ctx.lineTo(x-280*s+560*s*ln,y+22*s);ctx.stroke();}
    for(let g=0;g<10;g++)for(let k=0;k<10;k++){const i=10+g*10+k,q=clamp(p*14-2.5-(g*10+k)*0.1,0,1);if(q<=0)continue;withA(ctx,q,()=>hs(x+(g-4.5)*56*s+((k%2)-0.5)*22*s,y+(58+Math.floor(k/2)*30)*s,0.62*s,o.head===g&&o.jia,0));}});}
/* the fish-scale register's plots: a valley of fields drawn plot by plot. Each plot is a cell of a grid of hexagons whose corners are
   moved, and whose sides bow a little, the same way for the two plots that share them, so neighbours fit edge to edge and no two look
   alike. A river runs through them, and an uneven border holds them. Drawn out from the left as o.p goes from 0 to 1. */
const RG_SC={};
function rg_cells(n,seed){const key=n+"_"+seed;if(RG_SC[key])return RG_SC[key];const jit=(v,k)=>(hash(Math.round(v[0]*100),Math.round(v[1]*100)+seed+k)-0.5)*0.4;
  const C=[];for(let j=0;j<n;j++)for(let i=0;i<n*1.8;i++){const cx=i+(j%2?0.5:0),cy=j*0.866,P=[];for(let k=0;k<6;k++){const an=Math.PI/6+k*Math.PI/3;P.push([cx+Math.cos(an)*0.577,cy+Math.sin(an)*0.577]);}
    const J=P.map(v=>[v[0]+jit(v,0),v[1]+jit(v,2)]);C.push({P:J,cx,cy,k:hash(i*31+j,seed+5),kind:hash(i*17+j,seed+9)});}
  C.mx=Math.max(...C.map(c=>c.cx))+0.6;C.my=Math.max(...C.map(c=>c.cy))+0.6;C.sort((a,b)=>a.cx-b.cx||a.cy-b.cy);return RG_SC[key]=C;}
// a side that bows: its control point moves off the middle the same way whichever plot draws it
function rg_bow(ctx,ax,ay,bx,by,seed){const s=ax<bx||(ax===bx&&ay<by),x0=s?ax:bx,y0=s?ay:by,x1=s?bx:ax,y1=s?by:ay,d=(hash(Math.round(x0*7+y0*3),Math.round(x1*5+y1*11)+seed)-0.5)*0.22;ctx.quadraticCurveTo((ax+bx)/2-(y1-y0)*d,(ay+by)/2+(x1-x0)*d,bx,by);}
function rg_scales(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p;if(a<=0.01)return;const C=rg_cells(o.n||8,o.seed||3),cx0=x+w/2,cy0=y+h/2;
  const edge=ctx2=>{ctx2.beginPath();for(let i=0;i<=56;i++){const th=i/56*TAU,r=1+0.07*Math.sin(3*th+1)+0.05*Math.sin(5*th+2.3)+0.03*Math.sin(9*th);const px=cx0+Math.cos(th)*w/2*0.96*r,py=cy0+Math.sin(th)*h/2*0.93*r;i?ctx2.lineTo(px,py):ctx2.moveTo(px,py);}ctx2.closePath();};
  withA(ctx,a,()=>{ctx.save();edge(ctx);ctx.clip();const N=C.length,sx=v=>x+(v[0]+0.3)/C.mx*w,sy=v=>y+(v[1]+0.3)/C.my*h;
    C.forEach((c,i)=>{const q=clamp(p*N*1.15-i,0,1);if(q<=0)return;
      withA(ctx,q,()=>{ctx.beginPath();const P=c.P.map(v=>[sx(v),sy(v)]);ctx.moveTo(P[0][0],P[0][1]);for(let k=1;k<=6;k++){const A=P[k-1],B=P[k%6];rg_bow(ctx,A[0],A[1],B[0],B[1],o.seed||3);}ctx.closePath();const hi=o.hi&&o.hi(i);
        ctx.fillStyle=hi?rgba(RG_EARTH,0.85):c.kind<0.34?rgba(mix([206,204,160],[184,190,140],c.k),0.9):c.kind<0.67?rgba(mix([222,200,154],[200,176,128],c.k),0.9):rgba(mix([228,214,178],[212,192,150],c.k),0.9);ctx.fill();
        ctx.strokeStyle=rgba(RG_INK,0.85);ctx.lineWidth=2.2;ctx.stroke();
        // a few strokes in each plot, like its number and its holder's name written in it
        ctx.strokeStyle=rgba(RG_INK,0.4);ctx.lineWidth=2;const mx=sx([c.cx,c.cy]),my=sy([c.cx,c.cy]);ctx.beginPath();ctx.moveTo(mx-6,my-8);ctx.lineTo(mx-6,my+8);ctx.moveTo(mx+5,my-6);ctx.lineTo(mx+5,my+4);ctx.stroke();});});
    // the river through the valley, in a pale wash between two lines of ink
    const rv=fin(p,0.35,0.4);if(rv>0)withA(ctx,rv,()=>{const path=()=>{ctx.beginPath();ctx.moveTo(x-20,y+h*0.66);ctx.bezierCurveTo(x+w*0.3,y+h*0.9,x+w*0.55,y+h*0.28,x+w+20,y+h*0.42);};
      path();ctx.strokeStyle=rgba(RG_INK,0.75);ctx.lineWidth=20;ctx.stroke();path();ctx.strokeStyle="rgba(168,186,186,1)";ctx.lineWidth=15;ctx.stroke();});
    ctx.restore();ctx.strokeStyle=rgba(RG_INK,0.65);ctx.lineWidth=3;edge(ctx);ctx.stroke();});}
/* warp and weft: threads that run two ways and together make a cloth. o.pw and o.pf (0..1) lay the warp (down, in o.wc) and the weft
   (across, in o.fc); where they cross, each goes over and under in turn */
function rg_weave(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const nw=o.nw||12,nf=o.nf||8,pw=o.pw==null?1:o.pw,pf=o.pf==null?1:o.pf,wc=o.wc||RG_EARTH,fc=o.fc||RG_YEL,tw_=w/nw*0.66,th=h/nf*0.66;
  const warp=(i,y0,y1)=>{const cx=x+(i+0.5)*w/nw;ctx.fillStyle=rgba(mix(wc,[40,22,12],0.25),1);ctx.fillRect(cx-tw_/2,y0,tw_,y1-y0);ctx.fillStyle=rgba(wc,1);ctx.fillRect(cx-tw_*0.36,y0,tw_*0.72,y1-y0);ctx.fillStyle="rgba(255,236,200,0.2)";ctx.fillRect(cx-tw_*0.1,y0,tw_*0.16,y1-y0);};
  const weft=(j,x0,x1)=>{const cy=y+(j+0.5)*h/nf;ctx.fillStyle=rgba(mix(fc,[60,40,10],0.25),1);ctx.fillRect(x0,cy-th/2,x1-x0,th);ctx.fillStyle=rgba(fc,1);ctx.fillRect(x0,cy-th*0.36,x1-x0,th*0.72);ctx.fillStyle="rgba(255,250,220,0.22)";ctx.fillRect(x0,cy-th*0.12,x1-x0,th*0.16);};
  withA(ctx,a,()=>{for(let i=0;i<nw;i++){const q=clamp(pw*nw*1.3-i*1.0,0,1);if(q>0)warp(i,y,y+h*ease(q));}
    for(let j=0;j<nf;j++){const q=clamp(pf*nf*1.3-j,0,1);if(q<=0)continue;const xe=x+w*ease(q);weft(j,x,xe);
      // where the weft goes under, the warp is drawn again on top of it, with a little shadow either side
      for(let i=0;i<nw;i++){const cx=x+(i+0.5)*w/nw;if(cx>xe||(i+j)%2===0)continue;if(clamp(pw*nw*1.3-i,0,1)<=0)continue;const cy=y+(j+0.5)*h/nf;ctx.fillStyle="rgba(20,10,6,0.28)";ctx.fillRect(cx-tw_/2-3,cy-th/2,tw_+6,th);warp(i,cy-th/2-2,cy+th/2+2);}}});}
// the series' mark: a knot of two threads each way
function mtb_knot(ctx,x,y,s,a){withA(ctx,a,()=>rg_weave(ctx,x-s,y-s,2*s,2*s,{nw:3,nf:3,wc:RG_EARTH,fc:MTB}));}

/* ---------- the series' title and its end ---------- */
function mtb_title(ctx,S,t,t0,t1,title,sub){const oA=fin(t,t0,0.8)*(1-fin(t,t1,0.7)),tA=fin(t,t0+0.4,0.8)*(1-fin(t,t1-0.1,0.6));if(oA<=0)return;setScreen(ctx,S);
  const g=ctx.createRadialGradient(960,520,80,960,520,900);g.addColorStop(0,"rgba(8,5,10,"+0.62*oA+")");g.addColorStop(1,"rgba(8,5,10,"+0.3*oA+")");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  withA(ctx,tA,()=>{mtb_knot(ctx,960,392,22,1);T(ctx,"MODEL THE BUSINESS",960,462,{w:800,size:28,align:"center",color:rgba(MTB,0.98)});T(ctx,title,960,560,{w:800,size:96,align:"center"});if(sub)T(ctx,sub,960,624,{w:600,size:30,align:"center",color:rgba([236,224,206],0.95)});});}
function mtb_end(ctx,S,t,t0,title,line){const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;dark(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)T(ctx,line,960,420,{w:700,size:44,align:"center"});mtb_knot(ctx,960,522,18,1);T(ctx,title,960,612,{w:800,size:44,align:"center",color:rgba(MTB,1)});
    T(ctx,"Model the business · Learning Data",960,664,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)});});}
// a pill for the past: warm glass, its words in the story's colours
function rg_pill(ctx,x,y,s,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const sz=phSz(ctx,o.size||30),w=tw(ctx,s,sz,700)+40,h=sz+26,X=o.align==="left"?x:o.align==="right"?x-w:x-w/2;
  glass(ctx,X,y-h/2,w,h,h/2,col,{glow:12,ea:0.85,fill:"rgba(26,16,12,0.9)"});T(ctx,s,X+20,y+sz*0.36,{w:700,size:sz,color:rgba(col,1)});});}
// make what the films draw again and again before the film plays: the fish-scale plots
function rg_prep(){rg_paddies();rg_cells(8,3);}
