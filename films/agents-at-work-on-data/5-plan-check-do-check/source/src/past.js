/* ===== Plan, define the check, do, check: Singapore, 1998 to 2003 =====
   The opening's places, painted full-frame in the module's matte style (no outlines, muted colours, daylight from the right, soft
   contact shadows), dressed for their time. Each is a place painted once (AG_PLACES.pc*); what moves in it is drawn live by the
   helpers beside it. Every name here starts with pc_ or PC_. Water is a pale sea-glass green (PC_SEA) and the rain a pale grey
   (PC_RAIN): neither is one of the module's meaning colours, and nothing in Singapore wears them.
     pc_scr(ctx, S, fn)             draw in screen space, whatever the camera is doing (a tag)
     pc_tag(ctx, text, a, o)        the place and year, on a small card at the top left
     pc_rain(ctx, t, front, a)      a band of rain moving in from the left, as far as front (x); it falls on the sea as rings
     pc_flow(ctx, pts, col, t, o)   water moving along a pipe: o.u how much has arrived, o.w its width
     pc_bottle(ctx, x, y, h, o)     a plain glass bottle, no label: o.line (the mark on it), o.fill (0 to 1, up to the mark), o.pour
     pc_glass(ctx, x, y, s, o)      a drinking glass, o.fill
     pc_list(ctx, x, y, w, u, o)    "How it will be judged · 190 measures", unrolling as u goes 0 to 1
     pc_year(ctx, x, y, w, roll, o) a small calendar card turning from 2000 to 2002 as roll goes 0 to 2
   The places: pcCity (the island city across the water), pcMap (the island, the strait and the mainland), pcStreet (a sink, its
   drain, the pipe under the road and a plant, cut open), pcKitchen (a kitchen of the late 1990s), pcPlant (the test plant),
   pcPanel (the panel's room; its table is drawn live, over the people: pc_panelTable), pcStadium (the parade at dusk; the raised
   bottles are drawn live: pc_crowd), pcReservoir and pcBench (a laboratory bench, today). */

const PC_SEA=[178,208,196],PC_SEAD=[128,164,154],PC_RAIN=[196,200,204],PC_LEAF=[98,126,94];
const PC_SKIN=[[232,196,164],[214,170,134],[180,128,98],[128,88,66],[238,208,186]];

/* ---------------------------------------------------------------- small helpers */
const pc_shade=(c,k)=>[c[0]*k,c[1]*k,c[2]*k];
// a Catmull-Rom spline through the points, n steps between each
function pc_smooth(pts,n){const out=[],Q=[pts[0]].concat(pts,[pts[pts.length-1]]);
  for(let i=1;i<Q.length-2;i++)for(let k=0;k<n;k++){const u=k/n,u2=u*u,u3=u2*u,f=(a,b,c,d)=>0.5*(2*b+(-a+c)*u+(2*a-5*b+4*c-d)*u2+(-a+3*b-3*c+d)*u3);
    out.push([f(Q[i-1][0],Q[i][0],Q[i+1][0],Q[i+2][0]),f(Q[i-1][1],Q[i][1],Q[i+1][1],Q[i+2][1])]);}out.push(pts[pts.length-1]);return out;}
// a closed smooth outline through the points (it wraps round)
function pc_loopPts(pts,n){const k=pts.length,Q=[pts[k-1]].concat(pts,[pts[0],pts[1]]),out=[];
  for(let i=1;i<=k;i++)for(let j=0;j<n;j++){const u=j/n,u2=u*u,u3=u2*u,f=(a,b,c,d)=>0.5*(2*b+(-a+c)*u+(2*a-5*b+4*c-d)*u2+(-a+3*b-3*c+d)*u3);
    out.push([f(Q[i-1][0],Q[i][0],Q[i+1][0],Q[i+2][0]),f(Q[i-1][1],Q[i][1],Q[i+1][1],Q[i+2][1])]);}return out;}
function pc_path(c,Q){c.moveTo(Q[0][0],Q[0][1]);for(let i=1;i<Q.length;i++)c.lineTo(Q[i][0],Q[i][1]);c.closePath();}
function pc_poly(c,Q){c.beginPath();pc_path(c,Q);}
// an irregular soft blob: an ellipse whose edge wanders (amp), for crowns of trees and clouds
function pc_blobPts(cx,cy,rx,ry,seed,amp,n){n=n||48;const out=[];for(let i=0;i<n;i++){const a=i/n*TAU,k=1+amp*(AG_NZ.fbm(Math.cos(a)*1.6+seed*3.1,Math.sin(a)*1.6+seed*1.7,3)-0.5)*2;
  out.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);}return out;}
function pc_blob(c,cx,cy,rx,ry,seed,amp,fill){pc_poly(c,pc_blobPts(cx,cy,rx,ry,seed,amp));c.fillStyle=fill;c.fill();}
// a sky: top to low, with a soft glow where the sun is, sun [x, y, r, a]
function pc_sky(c,top,low,hz,sun,mid){const g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(top,1));if(mid)g.addColorStop(mid[1],rgba(mid[0],1));g.addColorStop(1,rgba(low,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz+2);
  if(sun){const r=c.createRadialGradient(sun[0],sun[1],8,sun[0],sun[1],sun[2]);r.addColorStop(0,"rgba(255,246,228,"+(sun[3]||0.5)+")");r.addColorStop(1,"rgba(255,246,228,0)");c.fillStyle=r;c.fillRect(0,0,W,hz+2);}}
// light from the right over a whole place, and its near edge a little darker
function pc_light(c,k){k=k==null?1:k;let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,"+0.12*k+")");g.addColorStop(0.55,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,246,228,"+0.08*k+")");
  c.fillStyle=g;c.fillRect(0,0,W,H);g=c.createLinearGradient(0,900,0,H);g.addColorStop(0,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(40,34,28,"+0.12*k+")");c.fillStyle=g;c.fillRect(0,900,W,H-900);}
function pc_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// the place and year, on a small card at the top left, in screen space
function pc_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const f={w:500,size:28,f:"mono"},w=ag_tw(ctx,s,f)+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,32,24,0.2)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,12);ctx.fillStyle="rgba(243,241,237,0.95)";ctx.fill();ctx.restore();
  ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,12);ctx.stroke();ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();}
// a tree of the tropics: a short trunk and a wide, layered crown, lit from the right; s 1 is about 300 px tall
function pc_tree(c,x,y,s,seed,o){o=o||{};const R=ag_rnd(seed),leaf=o.leaf||PC_LEAF,trunk=o.trunk||[100,90,80],wide=o.wide||1;c.save();c.translate(x,y);c.scale(s,s);
  if(!o.noShadow)ag_floorShadow(c,-60,6,170*wide,18,0.22);
  c.fillStyle=rgba(trunk,1);c.beginPath();c.moveTo(-14,0);c.bezierCurveTo(-12,-50,-10,-90,-40,-150);c.lineTo(-30,-156);c.bezierCurveTo(-8,-120,0,-118,6,-126);
  c.bezierCurveTo(16,-150,36,-170,60,-180);c.lineTo(64,-172);c.bezierCurveTo(34,-150,18,-100,16,0);c.closePath();c.fill();
  const cy=-220,base=[[0,cy,190*wide,70,0.2]];for(let i=0;i<10;i++){const a=R()*TAU,r=R();base.push([Math.cos(a)*150*wide*r,cy+Math.sin(a)*40*r-8,70+R()*60,36+R()*22,0.25]);}
  base.forEach((b,i)=>pc_blob(c,b[0],b[1],b[2],b[3],seed+i*0.37,b[4],rgba(pc_shade(leaf,0.74),1)));
  base.slice(1).forEach((b,i)=>{const k=clamp(0.5+b[0]/300-(b[1]-cy)/120,0,1);pc_blob(c,b[0]+12,b[1]-12,b[2]*0.74,b[3]*0.66,seed+i*1.3,0.3,rgba(mix(leaf,pc_shade(leaf,1.24),k),1));});
  for(let i=0;i<10;i++){const a=R()*TAU,r=R();pc_blob(c,Math.cos(a)*110*wide*r+60,cy-30+Math.sin(a)*26*r,22+R()*14,12+R()*8,seed+i*2.1,0.3,rgba(pc_shade(leaf,1.32),0.5));}
  c.restore();}
// a block of flats or offices seen from far off: its face w x h from (x, y), lit from the right; o.floors of windows in rows or
// o.cols columns; o.corr the long corridors of a slab block; o.side a sliver of its right side; o.base its colour
function pc_bldg(c,x,y,w,h,o){o=o||{};const base=o.base||[218,212,200];
  if(o.side){c.fillStyle=rgba(pc_shade(base,1.06),1);c.beginPath();c.moveTo(x+w,y);c.lineTo(x+w+o.side,y+o.side*0.16);c.lineTo(x+w+o.side,y+h);c.lineTo(x+w,y+h);c.closePath();c.fill();}
  c.fillStyle=rgba(base,1);c.fillRect(x,y,w,h);
  const fl=o.floors||0,pitch=fl?(h-(o.top||10))/fl:0,win=o.win||[118,126,132];
  for(let f=0;f<fl;f++){const yy=y+(o.top||10)+f*pitch;
    if(o.corr){c.fillStyle=rgba(pc_shade(base,0.78),0.8);c.fillRect(x+2,yy+pitch*0.3,w-4,pitch*0.34);c.fillStyle="rgba(255,252,244,0.22)";c.fillRect(x+2,yy+pitch*0.64,w-4,Math.max(1,pitch*0.12));}
    else if(o.cols){const cw=(w-8)/o.cols;for(let k=0;k<o.cols;k++){c.fillStyle=rgba(win,0.62);c.fillRect(x+4+k*cw+cw*0.2,yy+pitch*0.22,cw*0.6,pitch*0.5);}}
    else{c.fillStyle=rgba(win,0.5);c.fillRect(x+4,yy+pitch*0.24,w-8,pitch*0.4);}}
  if(o.glass){const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(mix(base,[150,164,176],0.5),0.5));g.addColorStop(1,"rgba(255,255,255,0.08)");c.fillStyle=g;c.fillRect(x,y,w,h);}
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(40,34,28,0.1)");g.addColorStop(1,"rgba(255,248,236,0.08)");c.fillStyle=g;c.fillRect(x,y,w,h);
  if(o.roof){c.fillStyle=rgba(pc_shade(base,0.84),1);c.fillRect(x-3,y-6,w+6,6);}}
// a line of green along a shore or a bank, its foot at y: many overlapping crowns, lit from the right; o.top how high it rises, o.amp
// how much that varies, o.dark to shade a nearer line
function pc_greenLine(c,y,seed,o){o=o||{};const R=ag_rnd(seed),top=o.top||40,amp=o.amp||20,dk=o.dark||1,n=o.n||70;
  for(let i=0;i<n;i++){const x=(i+R()*0.8)*W/n*1.04-30,h=top+(R()-0.3)*amp,rx=24+R()*36,ry=14+R()*14,leaf=pc_shade(mix(PC_LEAF,[132,150,118],R()*0.6),dk);
    pc_blob(c,x,y-h*0.55,rx,ry+h*0.25,seed+i*0.7,0.28,rgba(pc_shade(leaf,0.8),1));pc_blob(c,x+8,y-h*0.62,rx*0.7,ry*0.8+h*0.12,seed+i*1.9,0.3,rgba(mix(leaf,pc_shade(leaf,1.25),0.6),1));}
  c.fillStyle=rgba(pc_shade(PC_LEAF,0.66*dk),1);c.fillRect(0,y-10,W,12);}
// low hills along a line: points [x, y], filled down to bottom
function pc_hills(c,pts,bottom,col){const S=pc_smooth(pts,10);c.beginPath();c.moveTo(S[0][0],bottom);for(const p of S)c.lineTo(p[0],p[1]);c.lineTo(S[S.length-1][0],bottom);c.closePath();c.fillStyle=rgba(col,1);c.fill();}

/* ---------------------------------------------------------------- water moving along a pipe, and a band of rain
   pc_flow: pts the pipe's path; col its water; o.u (0 to 1) how much of the path the water has reached; o.w its width; o.speed in
   px a second; o.a. The pipe's bore is drawn by the place; this draws the water in it, its soft body and short dashes moving along. */
function pc_flow(ctx,pts,col,t,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u,w=o.w||10,sp=o.speed||90;if(a<=0.01||u<=0.01)return;
  const S=pc_smooth(pts,10),L=[0];for(let i=1;i<S.length;i++)L.push(L[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));const tot=L[L.length-1]||1,show=tot*clamp(u,0,1);
  const pt=d=>{let i=1;while(i<L.length-1&&L[i]<d)i++;const k=(d-L[i-1])/((L[i]-L[i-1])||1);return[lerp(S[i-1][0],S[i][0],k),lerp(S[i-1][1],S[i][1],k)];};
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(S[0][0],S[0][1]);for(let i=1;i<S.length&&L[i]<=show;i++)ctx.lineTo(S[i][0],S[i][1]);const e=pt(show);ctx.lineTo(e[0],e[1]);
  ctx.strokeStyle=rgba(col,0.55*a);ctx.lineWidth=w;ctx.stroke();
  const dash=o.dash||28,gap=o.gap||34,off=((t*sp)%(dash+gap)+dash+gap)%(dash+gap);ctx.strokeStyle=rgba(mix(col,[255,255,255],0.45),0.8*a);ctx.lineWidth=Math.max(2,w*0.32);
  for(let d=-dash-gap+off;d<show;d+=dash+gap){const d0=Math.max(0,d),d1=Math.min(show,d+dash);if(d1-d0<2)continue;const p0=pt(d0),p1=pt((d0+d1)/2),p2=pt(d1);
    ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.lineTo(p2[0],p2[1]);ctx.stroke();}
  ctx.restore();}
// rain from the left as far as front (x): its cloud's shadow over the sky and the city, streaks falling, and rings on the sea below hz
const PC_DROPS=(()=>{const R=ag_rnd(808),out=[];for(let i=0;i<220;i++)out.push([R()*2200-140,R(),0.6+R()*0.6,R()]);return out;})();
function pc_rain(ctx,t,front,a,hz){if(a<=0.01||front<=-200)return;hz=hz||PC_HZ;ctx.save();ctx.globalAlpha*=a;
  let g=ctx.createLinearGradient(front-700,0,front+120,0);g.addColorStop(0,"rgba(104,112,120,0.34)");g.addColorStop(0.82,"rgba(104,112,120,0.22)");g.addColorStop(1,"rgba(104,112,120,0)");
  ctx.fillStyle=g;ctx.fillRect(-200,0,front+320,hz-60);ctx.globalAlpha=a*0.6;ctx.fillRect(-200,hz-60,front+320,60);ctx.globalAlpha=a*0.25;ctx.fillRect(-200,hz,front+320,50);ctx.globalAlpha=a;
  ctx.strokeStyle=rgba(PC_RAIN,0.5);ctx.lineCap="round";
  for(const d of PC_DROPS){if(d[0]>front)continue;const y=((d[1]*1300+t*820*d[2])%1300)-160,x=d[0]-y*0.18;if(y>hz+60)continue;ctx.lineWidth=1.6+d[3];
    ctx.globalAlpha=a*clamp((front-d[0])/160,0,1)*0.7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-11,y+52);ctx.stroke();}
  ctx.globalAlpha=a;for(let i=0;i<46;i++){const x=hash(i,3)*front,y=hz+30+hash(i,7)*(H-hz-200),ph=(t*1.4+hash(i,11))%1;if(x>front-40)continue;
    ctx.strokeStyle=rgba(PC_RAIN,0.6*(1-ph));ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(x,y,6+ph*26*(0.6+(y-hz)/600),2+ph*7*(0.6+(y-hz)/600),0,0,TAU);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- a bottle, a glass, the list, a calendar */
// a plain glass bottle standing at (x, y), h tall: o.line the mark (0 to 1 up the body), o.fill (0 to 1 of the way to it), o.pour
// (0 to 1, a thin stream into its neck), o.a, o.tilt (radians, about its foot)
function pc_bottle(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=h*0.36,nk=h*0.12,sh=h*0.22,body=h-nk-sh,line=o.line==null?0.78:o.line;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);if(o.tilt)ctx.rotate(o.tilt);
  const P_=c=>{c.moveTo(-w/2+w*0.12,0);c.quadraticCurveTo(-w/2,0,-w/2,-w*0.12);c.lineTo(-w/2,-body);c.bezierCurveTo(-w/2,-body-sh*0.6,-nk*0.9,-body-sh*0.7,-nk*0.62,-body-sh);
    c.lineTo(-nk*0.62,-h+h*0.02);c.lineTo(nk*0.62,-h+h*0.02);c.lineTo(nk*0.62,-body-sh);c.bezierCurveTo(nk*0.9,-body-sh*0.7,w/2,-body-sh*0.6,w/2,-body);c.lineTo(w/2,-w*0.12);c.quadraticCurveTo(w/2,0,w/2-w*0.12,0);c.closePath();};
  if(!o.noShadow)ag_floorShadow(ctx,AG.sdx*h/120,2,w*0.9,h*0.06,0.26);
  // the water inside, up to the mark
  const lvl=body*line*clamp(o.fill==null?1:o.fill,0,1);
  if(lvl>0.5){ctx.save();ctx.beginPath();P_(ctx);ctx.clip();const g=ctx.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,rgba(pc_shade(PC_SEA,0.86),0.85));g.addColorStop(0.7,rgba(PC_SEA,0.75));g.addColorStop(1,rgba(mix(PC_SEA,[255,255,255],0.4),0.7));
    ctx.fillStyle=g;ctx.fillRect(-w,-lvl,2*w,lvl+2);ctx.fillStyle="rgba(255,255,255,0.55)";ctx.fillRect(-w/2,-lvl-1,w,2.2);ctx.restore();}
  // the glass: a faint tint, its edge, a long highlight on the window's side
  ctx.beginPath();P_(ctx);ctx.fillStyle="rgba(226,236,236,0.28)";ctx.fill();ctx.strokeStyle="rgba(112,128,132,0.6)";ctx.lineWidth=Math.max(1.4,h/90);ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,0.6)";ctx.beginPath();ag_rect(ctx,w/2-w*0.2,-body+w*0.1,w*0.09,body*0.78,w*0.05);ctx.fill();
  // the mark: a small line etched on the glass
  const my=-body*line;ctx.strokeStyle="rgba(60,64,70,0.85)";ctx.lineWidth=Math.max(1.6,h/70);ctx.beginPath();ctx.moveTo(-w/2-2,my);ctx.lineTo(-w/2+w*0.32,my);ctx.stroke();
  // o.mark (0 to 1): the mark picked out, a soft light along it and a short line on across the glass, as what the water must reach
  const mk=clamp(o.mark||0,0,1);if(mk>0.01){ctx.save();ctx.lineCap="round";ctx.strokeStyle="rgba(255,255,255,"+0.7*mk+")";ctx.lineWidth=Math.max(6,h/22);
    ctx.beginPath();ctx.moveTo(-w/2-8,my);ctx.lineTo(w/2+8,my);ctx.stroke();ctx.strokeStyle="rgba(60,64,70,"+0.8*mk+")";ctx.lineWidth=Math.max(1.6,h/70);
    ctx.setLineDash([h/40,h/50]);ctx.beginPath();ctx.moveTo(-w/2+w*0.32,my);ctx.lineTo(w/2+8,my);ctx.stroke();ctx.restore();}
  // the cap ring
  ctx.fillStyle="rgba(150,160,162,0.7)";ctx.fillRect(-nk*0.7,-h+h*0.01,nk*1.4,h*0.035);
  if(o.pour>0.01){ctx.strokeStyle=rgba(pc_shade(PC_SEA,0.8),0.9*clamp(o.pour,0,1));ctx.lineWidth=Math.max(3,h/45);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,-h-h*0.7);ctx.lineTo(0,-lvl);ctx.stroke();}
  ctx.restore();}
// a drinking glass standing at (x, y), s 1 about 120 px tall: o.fill (0 to 1)
function pc_glass(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  const P_=c=>{c.moveTo(-34,-120);c.lineTo(34,-120);c.lineTo(28,-4);c.quadraticCurveTo(27,0,22,0);c.lineTo(-22,0);c.quadraticCurveTo(-27,0,-28,-4);c.closePath();};
  if(!o.noShadow)ag_floorShadow(ctx,-8,2,40,6,0.24);
  const f=clamp(o.fill==null?0.8:o.fill,0,1)*104;
  if(f>0.5){ctx.save();ctx.beginPath();P_(ctx);ctx.clip();ctx.fillStyle=rgba(PC_SEA,0.62);ctx.fillRect(-40,-f-6,80,f+6);ctx.fillStyle="rgba(255,255,255,0.6)";ctx.fillRect(-40,-f-7,80,2.4);ctx.restore();}
  ctx.beginPath();P_(ctx);ctx.fillStyle="rgba(230,238,238,0.3)";ctx.fill();ctx.strokeStyle="rgba(112,128,132,0.65)";ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,0.6)";ctx.fillRect(18,-110,5,92);ctx.restore();}
// the list of measures, unrolling from its top (u 0 to 1): a long sheet with its head and three kinds of measure, then where they
// come from; o.k[0..3] each line's own fade; returns its box
function pc_list(ctx,x,y,w,u,o){o=o||{};const a=o.a==null?1:o.a,H_=392,h=lerp(96,H_,ag_sine(clamp(u,0,1))),b={x,y,w,h:H_};if(a<=0.01||u<=0)return b;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,h,18,{});ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  ag_T(ctx,"HOW IT WILL BE JUDGED",x+28,y+48,{w:700,size:28,ls:4,col:AG.mut});ag_T(ctx,"190 measures",x+28,y+102,{w:800,size:48});
  const k=o.k||[1,1,1,1],rows=["physical","chemical","microbiological"];
  rows.forEach((s,i)=>{const ka=clamp(k[i],0,1);if(ka<=0)return;const yy=y+170+i*52;ctx.strokeStyle="rgba(60,64,70,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,yy-10);ctx.lineTo(x+48,yy-10);ctx.stroke();
    ag_T(ctx,s,x+62,yy,{w:600,size:32,a:ka});});
  const ka=clamp(k[3],0,1);if(ka>0){ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+28,y+318);ctx.lineTo(x+w-28,y+318);ctx.stroke();
    ag_T(ctx,"from the world's drinking-water standards",x+28,y+360,{w:500,size:28,col:AG.mut,a:ka});}
  ctx.restore();
  // the roll at its foot, while it unrolls
  const ru=1-ag_in(u,0.9,0.1);if(ru>0.01){ctx.save();ctx.globalAlpha*=ru;const ry=y+h;const g=ctx.createLinearGradient(0,ry-14,0,ry+14);g.addColorStop(0,"#E9E6E0");g.addColorStop(0.5,"#F6F4F0");g.addColorStop(1,"#D8D3CA");
    ctx.fillStyle=g;ctx.beginPath();ag_rect(ctx,x-6,ry-14,w+12,28,14);ctx.fill();ctx.restore();}
  ctx.restore();return b;}
// a small calendar card: its year rolls from 2000 to 2002 as roll goes 0 to 2
function pc_year(ctx,x,y,w,roll,o){o=o||{};const a=o.a==null?1:o.a,h=140;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,16,{});
  ctx.save();ctx.beginPath();ag_rect(ctx,x,y,w,h,16);ctx.clip();ctx.fillStyle=rgba(AG_OAK.dark,0.9);ctx.fillRect(x,y,w,40);ctx.restore();
  for(const rx of [x+w*0.28,x+w*0.72]){ctx.fillStyle="#5A564F";ctx.beginPath();ag_rect(ctx,rx-5,y-12,10,26,5);ctx.fill();}
  const r=clamp(roll,0,2),i=Math.min(1,Math.floor(r)),f=ag_sine(r-i);ctx.save();ctx.beginPath();ctx.rect(x,y+42,w,h-42);ctx.clip();
  const ys=["2000","2001","2002"];if(r>=2)ag_T(ctx,ys[2],x+w/2,y+110,{w:800,size:44,align:"center"});
  else{ag_T(ctx,ys[i],x+w/2,y+110-70*f,{w:800,size:44,align:"center",a:1-f});ag_T(ctx,ys[i+1],x+w/2,y+110+70*(1-f),{w:800,size:44,align:"center",a:f});}
  ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- Singapore, the late 1990s: the island city across the water */
const PC_HZ=690;
AG_PLACES.pcCity=c=>{const HZ=PC_HZ;
  pc_sky(c,[166,182,194],[234,232,224],HZ,[1780,300,900,0.45],[[208,214,214],0.55]);
  for(const cl of [[380,170,320,40,1],[1000,118,400,46,2],[1520,214,280,30,3]]){pc_blob(c,cl[0],cl[1],cl[2],cl[3],cl[4],0.4,"rgba(250,248,242,0.5)");pc_blob(c,cl[0]+30,cl[1]-8,cl[2]*0.6,cl[3]*0.6,cl[4]+9,0.4,"rgba(255,252,246,0.5)");}
  // far hills, in the haze
  pc_hills(c,[[0,560],[260,540],[520,566],[760,548],[1080,572],[1340,546],[1620,560],[1920,540]],HZ,[166,180,164]);
  let g=c.createLinearGradient(0,500,0,HZ);g.addColorStop(0,"rgba(232,232,226,0)");g.addColorStop(0.5,"rgba(232,232,226,0.45)");g.addColorStop(1,"rgba(232,232,226,0.1)");c.fillStyle=g;c.fillRect(0,500,W,HZ-500);
  // towers behind, pale in the haze
  const far=[[860,380,90],[960,330,70],[1040,300,96],[1150,352,80],[1240,410,92],[780,436,74]];
  for(const b of far)pc_bldg(c,b[0],b[1],b[2],HZ-b[1],{base:[200,204,206],floors:Math.round((HZ-b[1])/18),win:[164,170,176],glass:1,side:8,roof:1});
  // blocks of flats: long slabs with their corridors, and tall point blocks, in the city's pale creams and greys
  const flats=[[40,470,300,[224,218,204],1],[330,500,210,[214,206,196],0],[560,452,230,[226,220,210],1],[1320,476,260,[222,214,200],1],[1590,446,150,[212,208,200],0],[1750,490,220,[226,222,212],1]];
  for(const f of flats){const hh=HZ-12-f[1];pc_bldg(c,f[0],f[1],f[2],hh,{base:f[3],floors:Math.round(hh/16),corr:f[4],cols:f[4]?0:Math.round(f[2]/26),side:12,roof:1});}
  g=c.createLinearGradient(0,400,0,HZ);g.addColorStop(0,"rgba(236,234,228,0)");g.addColorStop(0.6,"rgba(236,234,228,0.26)");g.addColorStop(1,"rgba(236,234,228,0)");c.fillStyle=g;c.fillRect(0,400,W,HZ-400);
  // the green along the shore: a few rain trees with wide crowns over a dense, uneven line of smaller ones, and the sea wall
  pc_greenLine(c,HZ-8,77,{top:52,amp:34});
  for(const [x,s,k] of [[150,0.42,1],[690,0.36,2],[1420,0.4,3],[1860,0.34,4]])pc_tree(c,x,HZ-6,s,40+k,{noShadow:true,wide:1.4,leaf:mix(PC_LEAF,[120,140,110],0.3)});
  pc_greenLine(c,HZ-2,91,{top:22,amp:16,dark:0.86});
  c.fillStyle=rgba([196,194,186],1);c.fillRect(0,HZ-6,W,10);c.fillStyle="rgba(40,34,28,0.16)";c.fillRect(0,HZ+4,W,3);
  // the sea: pale sea-glass, the city's reflection broken by small waves, glints where the light falls
  g=c.createLinearGradient(0,HZ,0,H);g.addColorStop(0,rgba(mix(PC_SEA,[236,238,232],0.25),1));g.addColorStop(1,rgba(pc_shade(PC_SEA,0.86),1));c.fillStyle=g;c.fillRect(0,HZ+6,W,H-HZ);
  for(const f of flats.concat(far.map(b=>[b[0],b[1],b[2],[200,204,206]]))){const rh=Math.min(260,(HZ-f[1])*0.7);const rg=c.createLinearGradient(0,HZ,0,HZ+rh);rg.addColorStop(0,rgba(pc_shade(f[3],0.92),0.22));rg.addColorStop(1,rgba(f[3],0));
    c.fillStyle=rg;c.fillRect(f[0],HZ+8,f[2],rh);}
  const R=ag_rnd(51);for(let i=0;i<260;i++){const y=HZ+12+Math.pow(R(),1.6)*(H-HZ-12),x=R()*W,l=12+R()*60*(0.4+(y-HZ)/300);c.fillStyle=R()<0.5?"rgba(255,255,255,0.2)":rgba(pc_shade(PC_SEA,0.8),0.22);c.fillRect(x,y,l,1.6+(y-HZ)/260);}
  pc_light(c,0.8);};
function pc_cityLife(ctx,t,front,a){pc_rain(ctx,t,front,a,PC_HZ);}

/* ---------------------------------------------------------------- the map: the island at the bottom, the mainland's tip across a
   narrow strait, the causeway that carries the water pipes, the sea round them */
const PC_ISL=[[560,742],[600,690],[680,640],[780,600],[880,560],[930,548],[1010,556],[1100,566],[1180,556],[1270,560],[1360,590],[1440,620],[1500,660],[1488,700],
  [1420,724],[1320,742],[1220,770],[1140,790],[1060,800],[960,792],[860,786],[760,776],[660,770]];
const PC_MAIN=[[0,500],[260,540],[460,600],[580,628],[680,600],[790,556],[880,522],[930,510],[1010,516],[1100,526],[1180,518],[1270,520],[1360,546],[1440,568],[1540,556],[1700,500],[1920,466]];
const PC_CW=[928,508,932,552];   // the causeway: from the mainland's shore to the island's
AG_PLACES.pcMap=c=>{
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(mix(PC_SEA,[236,238,232],0.3),1));g.addColorStop(1,rgba(mix(PC_SEA,[220,226,222],0.1),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // soft depth: the sea a little deeper away from the shores
  const R=ag_rnd(7);for(let i=0;i<40;i++){const x=R()*W,y=R()*H;g=c.createRadialGradient(x,y,0,x,y,180+R()*160);g.addColorStop(0,rgba(pc_shade(PC_SEA,0.94),0.18));g.addColorStop(1,rgba(PC_SEA,0));c.fillStyle=g;c.fillRect(x-360,y-360,720,720);}
  // the mainland: its shore, then the land up to the frame's top
  const M=pc_smooth(PC_MAIN,8);c.save();c.shadowColor="rgba(60,70,66,0.18)";c.shadowBlur=24;c.shadowOffsetY=8;c.beginPath();c.moveTo(0,0);for(const p of M)c.lineTo(p[0],p[1]);c.lineTo(W,0);c.closePath();
  g=c.createLinearGradient(0,0,0,520);g.addColorStop(0,rgba([200,204,176],1));g.addColorStop(1,rgba([222,218,194],1));c.fillStyle=g;c.fill();c.restore();
  c.strokeStyle="rgba(255,255,248,0.5)";c.lineWidth=3;c.beginPath();M.forEach((p,i)=>i?c.lineTo(p[0],p[1]+2):c.moveTo(p[0],p[1]+2));c.stroke();
  // forest on the mainland, and the river the water is drawn from
  for(let i=0;i<26;i++){const x=R()*W,y=40+R()*380;g=c.createRadialGradient(x,y,0,x,y,120);g.addColorStop(0,"rgba(140,160,120,0.22)");g.addColorStop(1,"rgba(140,160,120,0)");c.fillStyle=g;c.fillRect(x-120,y-120,240,240);}
  const RV=pc_smooth([[1660,0],[1610,90],[1530,170],[1480,240],[1462,310],[1490,420],[1530,548]],8);c.lineCap="round";c.lineJoin="round";
  c.strokeStyle=rgba(mix(PC_SEA,[236,238,232],0.2),1);c.lineWidth=14;c.beginPath();RV.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  c.strokeStyle="rgba(255,255,255,0.35)";c.lineWidth=3;c.stroke();
  // the island, a little warmer, with a soft shore
  const I=pc_loopPts(PC_ISL,8);c.save();c.shadowColor="rgba(60,70,66,0.2)";c.shadowBlur=26;c.shadowOffsetY=10;pc_poly(c,I);g=c.createLinearGradient(0,540,0,800);g.addColorStop(0,rgba([224,220,198],1));g.addColorStop(1,rgba([214,208,186],1));c.fillStyle=g;c.fill();c.restore();
  c.save();pc_poly(c,I);c.clip();for(let i=0;i<14;i++){const x=640+R()*820,y=590+R()*180;g=c.createRadialGradient(x,y,0,x,y,90);g.addColorStop(0,"rgba(150,168,132,0.22)");g.addColorStop(1,"rgba(150,168,132,0)");c.fillStyle=g;c.fillRect(x-90,y-90,180,180);}c.restore();
  c.strokeStyle="rgba(255,255,248,0.55)";c.lineWidth=3;pc_poly(c,I);c.stroke();
  // two small islands off the south coast
  pc_blob(c,1010,842,46,14,3,0.3,rgba([218,212,190],1));pc_blob(c,760,824,30,10,5,0.3,rgba([218,212,190],1));
  // the causeway across the strait: a pale road on its embankment
  c.strokeStyle=rgba([190,186,172],1);c.lineWidth=16;c.lineCap="round";c.beginPath();c.moveTo(PC_CW[0],PC_CW[1]-6);c.lineTo(PC_CW[2],PC_CW[3]+6);c.stroke();
  c.strokeStyle=rgba([236,232,220],1);c.lineWidth=10;c.beginPath();c.moveTo(PC_CW[0],PC_CW[1]-6);c.lineTo(PC_CW[2],PC_CW[3]+6);c.stroke();
  pc_light(c,0.6);};
// the pipes along the causeway, and the water they bring from the mainland into the island (u 0 to 1)
const PC_PIPES=[[[1452,300],[1300,360],[1120,426],[980,474],[923,506],[924,566],[934,640]],[[1460,314],[1308,374],[1128,440],[988,488],[937,512],[940,566],[952,640]]];
function pc_mapLife(ctx,t,u,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  for(const p of PC_PIPES){ctx.strokeStyle="rgba(96,104,108,0.7)";ctx.lineWidth=9;ctx.lineCap="round";ctx.lineJoin="round";const S=pc_smooth(p,10);ctx.beginPath();S.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();
    ctx.strokeStyle="rgba(236,238,236,0.6)";ctx.lineWidth=4;ctx.stroke();pc_flow(ctx,p,pc_shade(PC_SEA,0.7),t,{u,w:6,speed:60,dash:16,gap:20});}
  ctx.restore();}

/* ---------------------------------------------------------------- a sink, its drain, the pipe under the road, and a plant, cut open */
const PC_ST={gr:560,used:[[300,452],[300,600],[330,700],[600,710],[900,712],[1040,700],[1060,600],[1066,520]],clean:[[1430,470],[1500,470],[1560,470],[1640,470],[1700,500]]};
AG_PLACES.pcStreet=c=>{const G=PC_ST.gr;
  pc_sky(c,[184,196,202],[232,230,222],G,[1700,200,700,0.4]);
  // the ground, cut through: soil in soft layers, darker as it goes down
  let g=c.createLinearGradient(0,G,0,H);g.addColorStop(0,rgba([170,150,124],1));g.addColorStop(0.5,rgba([150,130,106],1));g.addColorStop(1,rgba([128,110,90],1));c.fillStyle=g;c.fillRect(0,G,W,H-G);
  ag_grain(c,0,G,W,H-G,2.4,13);for(const [y,k] of [[640,0.08],[780,0.06],[930,0.07]]){c.fillStyle="rgba(255,240,220,"+k+")";c.fillRect(0,y,W,8);}
  // the road and the pavement on top
  c.fillStyle=rgba([150,150,148],1);c.fillRect(0,G-10,W,22);c.fillStyle=rgba([196,192,184],1);c.fillRect(0,G-16,W,8);
  // the flat, cut open: its wall, a window with the day outside, the counter and the sink
  ag_soft(c,k=>k.rect(60,150,520,G-166),[226,220,208],[240,236,228],520,220,400,"rgba(60,50,40,0.18)",22,0.5);
  c.fillStyle=rgba([206,214,214],1);c.fillRect(170,210,250,160);c.fillStyle="rgba(255,255,255,0.35)";c.fillRect(180,220,230,140);
  for(let i=0;i<6;i++){c.fillStyle="rgba(120,126,128,0.35)";c.fillRect(176,222+i*24,238,5);}
  c.fillStyle=rgba([188,178,160],1);c.fillRect(100,440,440,22);c.fillStyle=rgba([164,152,134],1);c.fillRect(110,462,420,G-478);
  c.fillStyle=rgba([210,214,214],1);c.beginPath();c.moveTo(220,440);c.lineTo(380,440);c.lineTo(366,470);c.lineTo(234,470);c.closePath();c.fill();
  c.strokeStyle="rgba(120,124,126,0.8)";c.lineWidth=6;c.beginPath();c.moveTo(352,440);c.lineTo(352,396);c.lineTo(322,396);c.stroke();
  // the pipe from the drain down under the road, and along to the plant
  const S=pc_smooth(PC_ST.used,10);c.lineCap="round";c.lineJoin="round";c.strokeStyle=rgba([104,108,110],1);c.lineWidth=26;c.beginPath();S.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  c.strokeStyle=rgba([62,60,58],1);c.lineWidth=16;c.stroke();
  // the plant: a low hall, cut open, its two stages inside
  ag_soft(c,k=>k.rect(1000,250,520,G-266),[222,224,222],[240,242,240],1460,300,420,"rgba(60,50,40,0.2)",22,0.5);
  c.fillStyle=rgba([196,200,198],1);c.fillRect(986,236,548,18);
  // stage one: fine membranes, a bundle of long white tubes
  for(let i=0;i<5;i++){const y=330+i*30;ag_soft(c,k=>ag_rect(k,1050,y,180,22,11),[238,238,236],[252,252,250],1200,y+4,90,"rgba(60,50,40,0.18)",6,0.6);}
  // stage two: a chamber of ultraviolet light, a cool white glow inside
  ag_soft(c,k=>ag_rect(k,1290,320,150,170,24),[210,214,216],[236,238,240],1420,340,140,"rgba(60,50,40,0.2)",10,0.6);
  g=c.createRadialGradient(1365,405,6,1365,405,70);g.addColorStop(0,"rgba(250,252,255,0.95)");g.addColorStop(1,"rgba(232,240,246,0)");c.fillStyle=g;c.fillRect(1290,320,150,170);
  c.strokeStyle=rgba([104,108,110],1);c.lineWidth=14;c.beginPath();c.moveTo(1066,530);c.lineTo(1066,400);c.lineTo(1050,400);c.stroke();
  c.strokeStyle=rgba([150,156,158],1);c.lineWidth=12;c.beginPath();c.moveTo(1230,400);c.lineTo(1290,404);c.stroke();
  // the pipe on to the glass
  const S2=pc_smooth(PC_ST.clean,10);c.strokeStyle=rgba([150,156,158],1);c.lineWidth=16;c.beginPath();S2.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  c.strokeStyle=rgba([214,218,218],1);c.lineWidth=9;c.stroke();
  // a small shelf for the glass
  c.fillStyle=rgba(AG_OAK.base,1);c.fillRect(1640,556,220,14);c.fillStyle=rgba(AG_OAK.dark,1);c.fillRect(1640,570,220,6);
  pc_light(c,0.7);};
function pc_streetLife(ctx,t,o){const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  pc_flow(ctx,PC_ST.used,[150,138,116],t,{u:o.used||0,w:10,speed:70});
  // inside the plant the water runs through the membranes, then past the light, and comes out clear
  const m=o.mem||0;if(m>0.01){for(let i=0;i<5;i++){const y=341+i*30;ctx.fillStyle=rgba(PC_SEA,0.5*m);ctx.fillRect(1056,y-4,lerp(0,168,clamp(m*1.4-i*0.08,0,1)),8);}}
  pc_flow(ctx,PC_ST.clean,PC_SEA,t,{u:o.clean||0,w:7,speed:60});
  pc_glass(ctx,1750,556,1.1,{fill:o.glass||0});ctx.restore();}

/* ---------------------------------------------------------------- a kitchen of the late 1990s: small white tiles, a louvred window,
   the counter with a kettle and a dish rack */
AG_PLACES.pcKitchen=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([224,222,214],1));g.addColorStop(1,rgba([212,208,198],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // tiles: a fine grid of joints, the window's light across them
  c.strokeStyle="rgba(150,146,138,0.28)";c.lineWidth=1.4;for(let x=0;x<=W;x+=38){c.beginPath();c.moveTo(x,0);c.lineTo(x,760);c.stroke();}for(let y=0;y<=760;y+=38){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // the window on the right, its louvres of glass, the day outside
  c.fillStyle=rgba([186,196,196],1);c.fillRect(1380,120,420,380);g=c.createLinearGradient(1380,120,1800,500);g.addColorStop(0,"rgba(255,255,250,0.75)");g.addColorStop(1,"rgba(236,240,236,0.4)");c.fillStyle=g;c.fillRect(1392,132,396,356);
  for(let i=0;i<9;i++){const y=146+i*38;c.fillStyle="rgba(150,160,160,0.35)";c.fillRect(1392,y,396,6);c.fillStyle="rgba(255,255,255,0.5)";c.fillRect(1392,y+6,396,2);}
  c.fillStyle=rgba([170,166,156],1);c.fillRect(1370,500,440,14);
  g=c.createRadialGradient(1500,420,40,1500,420,900);g.addColorStop(0,"rgba(255,250,236,0.35)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the counter behind them: its top, its cupboards, and on it a kettle and a dish rack
  c.fillStyle=rgba([188,182,170],1);c.fillRect(0,756,W,24);c.fillStyle=rgba([206,198,184],1);c.fillRect(0,780,W,300);
  for(let x=0;x<W;x+=240){c.fillStyle="rgba(60,50,40,0.12)";c.fillRect(x,790,3,290);c.fillStyle="rgba(60,50,40,0.25)";c.fillRect(x+200,860,18,5);}
  ag_soft(c,k=>{k.moveTo(240,756);k.bezierCurveTo(236,680,250,650,300,650);k.bezierCurveTo(350,650,364,680,360,756);k.closePath();},[196,200,202],[236,238,240],340,680,90,"rgba(40,34,28,0.25)",10,0.6);
  c.strokeStyle=rgba([90,92,96],1);c.lineWidth=7;c.beginPath();c.arc(300,646,30,Math.PI*1.1,Math.PI*1.9);c.stroke();
  c.strokeStyle="rgba(150,152,150,0.9)";c.lineWidth=3;for(let i=0;i<8;i++){c.beginPath();c.moveTo(1500+i*22,756);c.lineTo(1496+i*22,690);c.stroke();}c.fillStyle="rgba(230,232,232,0.9)";c.fillRect(1490,700,40,56);c.fillRect(1560,690,40,66);
  pc_light(c,0.7);};
// the two neighbours: one holds a glass of the water up and looks at it, the other looks at it too
const PC_W1={name:"A woman in her kitchen",key:"pc-w1",skin:[222,186,152],hair:{style:"bob",c:[30,26,28]},top:{kind:"shirt",c:[160,120,118]},breath:0.3};
const PC_W2={name:"Her neighbour",key:"pc-w2",skin:[176,126,96],hair:{style:"bun",c:[28,24,26]},earrings:[226,196,140],top:{kind:"tunic",c:[176,168,142]},breath:0.27};

/* ---------------------------------------------------------------- the test plant, 1998 to 2000: racks of long white tubes under a
   steel roof, their pipes, trees behind; dry until the list is complete */
const PC_PL={pipes:[[[1880,760],[1700,760],[1640,720],[1640,640]],[[1220,640],[1220,700],[1300,760],[1500,760]]]};
AG_PLACES.pcPlant=c=>{const HZ=640;pc_sky(c,[178,192,200],[234,232,224],HZ,[1760,260,800,0.45]);
  pc_greenLine(c,HZ+4,41,{top:120,amp:60,n:46});for(const [x,s] of [[220,0.6],[760,0.52]])pc_tree(c,x,HZ+6,s,70+x,{noShadow:true,wide:1.4});pc_greenLine(c,HZ+10,43,{top:40,amp:30,dark:0.88,n:60});
  let g=c.createLinearGradient(0,HZ,0,H);g.addColorStop(0,rgba([196,194,188],1));g.addColorStop(1,rgba([168,166,160],1));c.fillStyle=g;c.fillRect(0,HZ,W,H-HZ);ag_grain(c,0,HZ,W,H-HZ,1.8,21);
  // the hall's roof and its columns
  c.fillStyle=rgba([150,156,160],1);c.beginPath();c.moveTo(1040,190);c.lineTo(1900,160);c.lineTo(1900,200);c.lineTo(1040,226);c.closePath();c.fill();
  for(const x of [1070,1330,1600,1870]){c.fillStyle=rgba([136,142,146],1);c.fillRect(x,206,14,HZ+120-206);}
  g=c.createLinearGradient(0,226,0,HZ+80);g.addColorStop(0,"rgba(40,40,44,0.2)");g.addColorStop(1,"rgba(40,40,44,0.05)");c.fillStyle=g;c.fillRect(1070,226,820,HZ+80-226);
  // two racks of pressure tubes, four high
  for(const [x0,x1] of [[1110,1450],[1500,1840]]){c.fillStyle=rgba([120,126,130],1);c.fillRect(x0,300,10,420);c.fillRect(x1-10,300,10,420);
    for(let i=0;i<6;i++){const y=320+i*62;ag_soft(c,k=>ag_rect(k,x0+14,y,x1-x0-28,40,20),[238,238,234],[252,252,248],x1-80,y+6,180,"rgba(60,50,40,0.2)",8,0.6);
      c.fillStyle=rgba([170,174,176],1);c.fillRect(x0+10,y+6,12,28);c.fillRect(x1-22,y+6,12,28);}}
  // the pipes in, and out
  for(const p of PC_PL.pipes){const S=pc_smooth(p,8);c.lineCap="round";c.lineJoin="round";c.strokeStyle=rgba([110,116,120],1);c.lineWidth=22;c.beginPath();S.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();
    c.strokeStyle=rgba([198,202,204],1);c.lineWidth=12;c.stroke();}
  ag_floorShadow(c,1480,760,520,30,0.2);pc_light(c,0.7);};
function pc_plantLife(ctx,t,run,a){if(a<=0.01||run<=0.01)return;ctx.save();ctx.globalAlpha*=a;for(const p of PC_PL.pipes)pc_flow(ctx,p,PC_SEA,t,{u:run,w:8,speed:70});
  for(const [x0,x1] of [[1110,1450],[1500,1840]])for(let i=0;i<6;i++){const y=320+i*62,k=clamp(run*1.6-i*0.1,0,1);ctx.fillStyle=rgba(PC_SEA,0.34*k);ctx.beginPath();ag_rect(ctx,x0+16,y+14,(x1-x0-32)*k,12,6);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- the panel's room, 2000 to 2002: a pale wall with a board where
   results are pinned, a window on the right; the long table is drawn live, over the people */
const PC_PANEL={top:760,people:[[330,588,0.7,0],[620,580,0.7,1],[900,592,0.7,2],[1210,584,0.7,3],[1500,590,0.7,4]]};
AG_PLACES.pcPanel=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([226,220,208],1));g.addColorStop(1,rgba([210,204,192],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle=rgba([196,190,178],1);c.fillRect(0,690,W,8);
  // the board
  ag_soft(c,k=>ag_rect(k,240,130,1340,250,10),[214,206,190],[228,222,208],1400,160,600,"rgba(60,50,40,0.18)",14,0.5);
  c.strokeStyle="rgba(150,136,112,0.6)";c.lineWidth=6;c.beginPath();ag_rect(c,240,130,1340,250,10);c.stroke();
  // the window
  c.fillStyle=rgba([188,196,196],1);c.fillRect(1660,110,240,520);g=c.createLinearGradient(1660,110,1900,630);g.addColorStop(0,"rgba(255,255,250,0.8)");g.addColorStop(1,"rgba(232,238,236,0.4)");c.fillStyle=g;c.fillRect(1672,122,216,496);
  c.fillStyle=rgba([170,166,156],1);c.fillRect(1772,122,8,496);
  g=c.createRadialGradient(1700,360,60,1700,360,1100);g.addColorStop(0,"rgba(255,250,236,0.3)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  pc_light(c,0.6);};
// the experts, invented: from Singapore and from abroad, in the jackets of the time
const PC_EX=[
  {name:"An engineer from Singapore",key:"pc-e1",skin:[226,188,154],hair:{style:"side",c:[40,36,38]},glasses:[40,44,54],top:{kind:"suit",c:[64,66,72],inner:[236,236,232],tie:[96,74,70]},breath:0.27},
  {name:"A professor from abroad",key:"pc-e2",skin:[236,206,186],hair:{style:"cropped",c:[176,172,168]},top:{kind:"blazer",c:[120,104,88],inner:[232,230,222]},breath:0.24},
  {name:"A chemist from Singapore",key:"pc-e3",skin:[182,130,100],hair:{style:"bun",c:[30,26,28]},earrings:[226,196,140],top:{kind:"blazer",c:[92,96,104],inner:[236,234,228]},breath:0.3},
  {name:"A doctor from abroad",key:"pc-e4",skin:[120,82,62],hair:{style:"cropped",c:[52,46,44]},glasses:[36,38,44],top:{kind:"suit",c:[78,74,70],inner:[232,234,238],tie:[110,96,80]},breath:0.25},
  {name:"A water scientist from abroad",key:"pc-e5",skin:[232,198,172],hair:{style:"bob",c:[150,120,88]},top:{kind:"blazer",c:[150,136,116],inner:[236,232,226]},breath:0.29}];
function pc_panelPeople(ctx,t,o){o=o||{};PC_PANEL.people.forEach(([x,y,s,i])=>ag_person(ctx,PC_EX[i],x,y,s,{t:t+i*0.7,flip:i>=3,cut:PC_PANEL.top,gaze:o.gaze||[1,-1.4],nod:o.nod?o.nod(i):0}));}
function pc_panelTable(ctx){const y=PC_PANEL.top;let g=ctx.createLinearGradient(0,y,0,y+40);g.addColorStop(0,rgba(mix(AG_OAK.dark,[90,70,50],0.4),1));g.addColorStop(1,rgba(mix(AG_OAK.dark,[70,54,40],0.5),1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(100,y);ctx.lineTo(1820,y);ctx.lineTo(1900,y+70);ctx.lineTo(20,y+70);ctx.closePath();ctx.fill();
  g=ctx.createLinearGradient(0,y+70,0,H);g.addColorStop(0,rgba(mix(AG_OAK.dark,[60,48,36],0.55),1));g.addColorStop(1,rgba(mix(AG_OAK.dark,[44,36,28],0.7),1));ctx.fillStyle=g;ctx.fillRect(20,y+70,1880,H-y-70);
  ctx.fillStyle="rgba(255,240,220,0.18)";ctx.fillRect(100,y,1720,2);ctx.fillStyle="rgba(255,240,220,0.1)";ctx.fillRect(20,y+70,1880,3);
  for(const x of [500,960,1420]){ctx.fillStyle="rgba(30,24,18,0.18)";ctx.fillRect(x,y+90,3,H-y-90);}
  // papers on it, and glasses of water
  for(const x of [300,600,880,1190,1480]){ctx.fillStyle="rgba(244,242,236,0.95)";ctx.beginPath();ctx.moveTo(x-60,y+16);ctx.lineTo(x+50,y+14);ctx.lineTo(x+58,y+50);ctx.lineTo(x-66,y+52);ctx.closePath();ctx.fill();
    pc_glass(ctx,x+110,y+44,0.36,{fill:0.7,noShadow:true});}}

/* ---------------------------------------------------------------- the parade, 9 August 2002, at dusk: the stands full, people from
   behind; their raised hands and bottles are drawn live (pc_crowd) */
const PC_CROWD=(()=>{const R=ag_rnd(2002),out=[];for(let row=0;row<6;row++){const y=660+row*74+row*row*6,s=0.5+row*0.15,n=Math.round(19-row*1.9),dx=W/n;
  for(let i=0;i<n;i++){const x=dx*(i+0.5)+(R()-0.5)*dx*0.55+(row%2)*dx*0.3;if(R()<0.12)continue;out.push({x,y:y+(R()-0.5)*10,s:s*(0.92+R()*0.16),row,ph:R(),up:R()<0.86,top:R()<0.5?[146,74,78]:[226,224,218],skin:PC_SKIN[(R()*PC_SKIN.length)|0],hair:R()<0.85?[30,26,26]:[96,80,66]});}}return out;})();
AG_PLACES.pcStadium=c=>{const HZ=380;pc_sky(c,[118,128,154],[226,196,184],HZ,[960,HZ+40,900,0.35],[[178,170,180],0.6]);
  // the far stands, a band of small heads in red and white under the roof's edge
  c.fillStyle=rgba([84,88,100],1);c.beginPath();c.moveTo(0,HZ-40);c.quadraticCurveTo(960,HZ-120,W,HZ-40);c.lineTo(W,HZ-20);c.quadraticCurveTo(960,HZ-96,0,HZ-20);c.closePath();c.fill();
  let g=c.createLinearGradient(0,HZ-30,0,HZ+130);g.addColorStop(0,rgba([110,104,112],1));g.addColorStop(1,rgba([136,124,126],1));c.fillStyle=g;c.beginPath();c.moveTo(0,HZ-24);c.quadraticCurveTo(960,HZ-100,W,HZ-24);c.lineTo(W,HZ+140);c.quadraticCurveTo(960,HZ+70,0,HZ+140);c.closePath();c.fill();
  const R=ag_rnd(9);for(let i=0;i<2600;i++){const x=R()*W,u=R(),yb=HZ-20+u*150-Math.sin(x/W*Math.PI)*70*(1-u*0.6);c.fillStyle=R()<0.5?"rgba(170,84,86,0.55)":"rgba(236,232,226,0.5)";c.fillRect(x,yb,3+u*2,3+u*2);}
  // the field, with the evening's light on it
  g=c.createLinearGradient(0,HZ+90,0,640);g.addColorStop(0,rgba([132,146,124],1));g.addColorStop(1,rgba([110,124,104],1));c.fillStyle=g;c.beginPath();c.moveTo(0,HZ+128);c.quadraticCurveTo(960,HZ+58,W,HZ+128);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  g=c.createRadialGradient(960,560,40,960,560,700);g.addColorStop(0,"rgba(255,236,214,0.3)");g.addColorStop(1,"rgba(255,236,214,0)");c.fillStyle=g;c.fillRect(0,HZ,W,H-HZ);
  // the floodlights' soft glow at the roof's corners
  for(const [x,y] of [[160,170],[1760,170]]){g=c.createRadialGradient(x,y,4,x,y,240);g.addColorStop(0,"rgba(255,250,236,0.85)");g.addColorStop(0.2,"rgba(255,246,226,0.3)");g.addColorStop(1,"rgba(255,246,226,0)");c.fillStyle=g;c.fillRect(x-240,y-240,480,480);}
  // the near stands: rows of people from behind, heads and shoulders
  g=c.createLinearGradient(0,600,0,H);g.addColorStop(0,rgba([92,86,92],1));g.addColorStop(1,rgba([70,66,72],1));c.fillStyle=g;c.fillRect(0,600,W,H-600);
  for(const p of PC_CROWD){c.save();c.translate(p.x,p.y);c.scale(p.s,p.s);
    c.fillStyle=rgba(pc_shade(p.top,0.86),1);c.beginPath();c.moveTo(-58,90);c.bezierCurveTo(-58,20,-40,0,0,0);c.bezierCurveTo(40,0,58,20,58,90);c.closePath();c.fill();
    c.fillStyle="rgba(255,246,236,0.14)";c.beginPath();c.moveTo(14,6);c.bezierCurveTo(40,8,54,24,56,90);c.lineTo(36,90);c.closePath();c.fill();
    c.fillStyle=rgba(pc_shade(p.skin,0.8),1);c.fillRect(-10,-24,20,28);c.fillStyle=rgba(p.hair,1);c.beginPath();c.ellipse(0,-44,24,28,0,0,TAU);c.fill();
    c.fillStyle="rgba(255,240,226,0.12)";c.beginPath();c.ellipse(8,-52,12,14,0,0,TAU);c.fill();c.restore();}
  pc_light(c,0.5);};
// the raised bottles: the wave from left to right (u 0 to 1) raises a hand and a bottle in each; drink (0 to 1) tips them back
function pc_crowd(ctx,t,u,drink,a){if(a<=0.01||u<=0.001)return;ctx.save();ctx.globalAlpha*=a;
  for(const p of PC_CROWD){if(!p.up)continue;const k=ag_sine(clamp(u*1.6-p.x/W*0.6-p.ph*0.08,0,1));if(k<=0.01)continue;ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.s,p.s);
    const sx=34,sy=16,hx=sx+lerp(6,26,k),hy=lerp(40,-110,k)+Math.sin(t*2+p.ph*6)*3,dr=ag_sine(drink)*(0.5+0.5*p.ph);
    ctx.strokeStyle=rgba(pc_shade(p.top,0.8),1);ctx.lineWidth=14;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo(sx+18,lerp(30,-30,k),hx,hy+14);ctx.stroke();
    ctx.fillStyle=rgba(pc_shade(p.skin,0.85),1);ctx.beginPath();ctx.arc(hx,hy+10,8,0,TAU);ctx.fill();
    pc_bottle(ctx,hx,hy+16,48,{fill:1,line:0.8,tilt:lerp(0.06,-1.0,dr)+Math.sin(t*1.3+p.ph*5)*0.04,noShadow:true});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- since 2003: a reservoir among trees, clear water flowing in */
AG_PLACES.pcReservoir=c=>{const HZ=560;pc_sky(c,[170,186,196],[236,234,226],HZ,[1700,240,800,0.5]);
  pc_hills(c,[[0,470],[340,440],[700,470],[1100,430],[1500,460],[1920,436]],HZ,[150,168,146]);
  pc_greenLine(c,HZ,61,{top:100,amp:50,n:50});for(const [x,s] of [[360,0.55],[1180,0.62],[1650,0.5]])pc_tree(c,x,HZ+2,s,90+x,{noShadow:true,wide:1.5});pc_greenLine(c,HZ+4,63,{top:34,amp:20,dark:0.9,n:64});
  let g=c.createLinearGradient(0,HZ,0,H);g.addColorStop(0,rgba(mix(PC_SEA,[236,238,232],0.3),1));g.addColorStop(1,rgba(pc_shade(PC_SEA,0.88),1));c.fillStyle=g;c.fillRect(0,HZ,W,H-HZ);
  const R=ag_rnd(33);for(let i=0;i<200;i++){const y=HZ+8+Math.pow(R(),1.5)*(H-HZ),x=R()*W,l=14+R()*70*(0.4+(y-HZ)/300);c.fillStyle=R()<0.5?"rgba(255,255,255,0.22)":rgba(pc_shade(PC_SEA,0.82),0.22);c.fillRect(x,y,l,1.6+(y-HZ)/300);}
  g=c.createLinearGradient(0,HZ,0,HZ+100);g.addColorStop(0,"rgba(80,100,80,0.26)");g.addColorStop(1,"rgba(80,100,80,0)");c.fillStyle=g;c.fillRect(0,HZ,W,100);
  // the inflow: a low concrete outfall on the near left bank, its mouth just above the water
  c.fillStyle=rgba([150,160,140],1);c.beginPath();c.moveTo(0,600);c.quadraticCurveTo(260,610,420,700);c.lineTo(420,1080);c.lineTo(0,1080);c.closePath();c.fill();
  ag_soft(c,k=>k.rect(120,600,260,120),[196,194,188],[222,220,214],330,620,200,"rgba(40,34,28,0.3)",12,0.5);
  c.fillStyle=rgba([70,76,78],1);c.beginPath();ag_rect(c,170,640,170,56,10);c.fill();
  pc_light(c,0.6);};
function pc_reservoirLife(ctx,t,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<4;i++)pc_flow(ctx,[[190+i*44,684],[200+i*44,700],[230+i*44,740],[260+i*46,770]],mix(PC_SEA,[255,255,255],0.35),t+i*0.3,{w:9,speed:110,dash:18,gap:16});
  for(let i=0;i<5;i++){const ph=(t*0.5+i/5)%1;ctx.strokeStyle="rgba(255,255,255,"+0.45*(1-ph)+")";ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(330,780,40+ph*260,8+ph*50,0,0,TAU);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- today: a laboratory bench with its row of sample bottles */
AG_PLACES.pcBench=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([226,228,226],1));g.addColorStop(1,rgba([212,214,212],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle=rgba([196,206,208],1);c.fillRect(1320,90,520,420);g=c.createLinearGradient(1320,90,1840,510);g.addColorStop(0,"rgba(255,255,252,0.85)");g.addColorStop(1,"rgba(236,240,240,0.4)");c.fillStyle=g;c.fillRect(1332,102,496,396);
  c.fillStyle=rgba([180,184,184],1);c.fillRect(1576,102,8,396);
  g=c.createRadialGradient(1580,300,60,1580,300,1100);g.addColorStop(0,"rgba(255,252,240,0.35)");g.addColorStop(1,"rgba(255,252,240,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // shelves of the lab behind, and the bench: a pale top, its edge, the cupboards under it
  for(const y of [230,380]){c.fillStyle=rgba([200,202,200],1);c.fillRect(120,y,1060,12);c.fillStyle="rgba(60,50,40,0.12)";c.fillRect(120,y+12,1060,5);
    for(let i=0;i<14;i++){const x=150+i*74,h=60+((i*37)%30);c.fillStyle="rgba(186,196,198,0.7)";c.fillRect(x,y-h,40,h);c.fillStyle="rgba(255,255,255,0.4)";c.fillRect(x+30,y-h+6,5,h-12);}}
  c.fillStyle=rgba([232,232,228],1);c.fillRect(0,690,W,34);c.fillStyle=rgba([196,198,196],1);c.fillRect(0,724,W,12);c.fillStyle=rgba([210,212,210],1);c.fillRect(0,736,W,344);
  for(let x=0;x<W;x+=320){c.fillStyle="rgba(60,50,40,0.1)";c.fillRect(x,746,3,334);}
  pc_light(c,0.6);};
// the row of sample bottles on the bench, each filled to its line, and a numbered tag on each
function pc_benchBottles(ctx,t,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;for(let i=0;i<9;i++){const x=300+i*150;pc_bottle(ctx,x,700,170,{fill:1,line:0.74});
  ctx.fillStyle="rgba(244,242,236,0.95)";ctx.fillRect(x-26,640,52,26);ctx.fillStyle="rgba(90,92,96,0.6)";ctx.fillRect(x-18,650,36,4);ctx.fillRect(x-18,657,24,3);}ctx.restore();}
