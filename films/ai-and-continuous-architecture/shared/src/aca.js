/* ===== AI and continuous architecture: the series' components =====
   The last series on enterprise architecture, drawn in the look of The map before the data (films/enterprise-architecture/shared/src/:
   the six layers in glass, paper drafts, the same people at the same energy utility), with one true story across its six films: the
   ziggurat of Babylon, Etemenanki, rebuilt from about 620 BCE. This file holds what every film of the series draws:
   - the series' mark, four tiers rising like a tower's, and its title and end cards;
   - Babylon: its sky at dawn, the city's skyline, the Euphrates and its date palms, the tower in ruins, rising or standing, the people
     who built it as silhouettes in their own clothes, and their bricks, baskets, moulds, kilns, boats, rods and ropes; and a quote on
     clay, for what the kings' own inscriptions say (no script is imitated: a stamp's lines are plain rules, its words are in English);
   - the present: an agent as these films draw one (Keeping it true's glass orb), one nobody put on the map or one that's flagged, and
     the four steps of how far an agent may go on a task: inform, draft, verify, run (the author's method), rising like the tower.
   Each film keeps its own pictures in its own source. A change here is a new version of every film that draws with it: rebuild each
   one and publish it again (tools/publish.py --keep-sound). */

/* ---------- colours ---------- */
// the series' colour, fired brick; Babylon's clay, brick, mud brick and bitumen, its river and its dawn
const ACA=[238,164,112];
const BAB_CLAY=[226,188,140],BAB_BRICK=[178,108,70],BAB_MUD=[146,112,80],BAB_BIT=[40,32,28],BAB_RIV=[104,146,190],BAB_SUN=[255,196,132],BAB_ROPE=[226,204,160];
const ACA_WARN=[255,186,92],ACA_INK=[64,40,26];
// the horizon in the wide shot, and the tower's seven stages as the Esagila tablet gives them: [width, height] in metres, about 91
// metres square at its base and about as tall
const BAB_HZ=700,BAB_T=[[91.5,33],[78,18],[60,6],[51,6],[42,6],[33,6],[24,15]],BAB_TH=90;

/* ---------- the mark, the title and the end ---------- */
// four tiers rising, drawn from the bottom as p goes from 0 to 1: the series' mark, as its music's mark is four notes rising.
// (x, y): the middle of its base; s: its size
function acaMark(ctx,x,y,s,a,p){if(a<=0.01)return;p=p==null?1:p;withA(ctx,a,()=>{for(let i=0;i<4;i++){const q=clamp(p*4-i,0,1);if(q<=0)continue;
  const w=s*(4-i)*1.15,h=s*0.62,yy=y-(i+1)*h-i*s*0.14+(1-spring(q*1.4))*s*0.7;
  withA(ctx,clamp(q*2,0,1),()=>{ctx.save();ctx.shadowColor=rgba(ACA,0.6);ctx.shadowBlur=12;rr(ctx,x-w/2,yy,w,h,s*0.08);ctx.fillStyle=rgba(ACA,0.16);ctx.fill();
    ctx.strokeStyle=rgba(ACA,1);ctx.lineWidth=Math.max(1.6,s*0.09);ctx.stroke();ctx.restore();});}});}
// the title card, over whatever the chapter is drawing: the series, the film's title, a line under it and where it sits in the series
function acaTitle(ctx,S,t,t0,title,sub,n){const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{glow(ctx,960,470,480,ACA,0.08);acaMark(ctx,960,416,24,1,(t-t0-0.5)/1.4);T(ctx,"AI AND CONTINUOUS ARCHITECTURE",960,470,{w:800,size:30,align:"center",color:rgba(ACA,0.95)});
    T(ctx,title,960,568,{w:800,size:92,align:"center"});if(sub)T(ctx,sub,960,640,{w:600,size:36,align:"center",color:rgba(SOFT,0.95)});
    withA(ctx,fin(t,t0+1.2,0.8),()=>tag(ctx,960,718,n,ACA,{align:"center",size:28}));});}
function acaEnd(ctx,S,t,t0,title,line,n){const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)T(ctx,line,960,400,{w:700,size:44,align:"center"});acaMark(ctx,960,560,16,0.95,1);T(ctx,title,960,628,{w:800,size:44,align:"center",color:rgba(ACA,1)});
    T(ctx,"AI and continuous architecture"+(n?" · "+n:"")+" · Learning Data",960,684,{w:600,size:28,align:"center",color:rgba(SOFT,0.9)});});}

/* ---------- Babylon: sky, city, river and palms ---------- */
// The world is drawn in world space, wider than the frame, so the camera (focus) can move over it. o.dawn (0..1) goes from night to
// the moment before sunrise; o.day (0..1) on to a hazy morning. The sun comes up in the east, to the right.
const BAB_STARS=(()=>{const S=[];for(let i=0;i<240;i++)S.push({x:hash(i,601)*5100-1600,y:hash(i,602)*1900-1400,m:Math.pow(hash(i,603),3),ph:hash(i,604)*TAU});return S;})();
function bab_light(o){o=o||{};return[clamp(o.dawn==null?0.6:o.dawn,0,1),clamp(o.day||0,0,1)];}
function bab_sky(ctx,t,o){o=o||{};const hz=o.hz||BAB_HZ,[dw,dy]=bab_light(o),X0=-1600,X1=3500,Y0=-1400;
  const top=mix(mix([6,8,22],[30,36,74],dw),[92,124,168],dy),mid=mix(mix([12,12,30],[112,70,88],dw),[190,164,150],dy),low=mix(mix([20,16,28],[234,150,98],dw),[244,212,168],dy);
  const g=ctx.createLinearGradient(0,hz-900,0,hz);g.addColorStop(0,rgba(top,1));g.addColorStop(0.55,rgba(mix(top,mid,0.5),1));g.addColorStop(0.85,rgba(mid,1));g.addColorStop(1,rgba(low,1));
  ctx.fillStyle=rgba(top,1);ctx.fillRect(X0,Y0,X1-X0,hz-900-Y0+2);ctx.fillStyle=g;ctx.fillRect(X0,hz-900,X1-X0,902);
  const sx=o.sunX==null?1560:o.sunX,sg=ctx.createRadialGradient(sx,hz,10,sx,hz,1000);sg.addColorStop(0,rgba(BAB_SUN,0.5*dw+0.3*dy));sg.addColorStop(0.3,rgba(BAB_SUN,0.14*dw+0.1*dy));sg.addColorStop(1,rgba(BAB_SUN,0));
  ctx.fillStyle=sg;ctx.fillRect(X0,hz-1000,X1-X0,1000);
  const ma=clamp(1-dw*1.1,0,1)*(1-dy);if(ma>0.02&&o.moon!==false){const mx=o.moonX||360,my=hz-520;glow(ctx,mx,my,90,[236,226,200],0.12*ma);ctx.fillStyle=rgba([244,236,214],0.9*ma);ctx.beginPath();ctx.arc(mx,my,22,-0.5*Math.PI,0.5*Math.PI,false);ctx.arc(mx+9,my,19,0.5*Math.PI,-0.5*Math.PI,true);ctx.closePath();ctx.fill();}
  const sa=(1-dw*0.8)*(1-dy);if(sa>0.02)BAB_STARS.forEach(s=>{if(s.y>hz-80)return;const a=sa*(0.25+0.75*s.m)*(0.8+0.2*Math.sin(t*0.5+s.ph))*clamp((hz-80-s.y)/420,0,1);if(a<0.02)return;
    ctx.fillStyle=rgba([236,236,255],a);ctx.beginPath();ctx.arc(s.x,s.y,0.8+1.6*s.m,0,TAU);ctx.fill();});}
// the city on the horizon: low houses with flat roofs, the walls' towers, and palms, in the haze; the sacred precinct round the tower is open
const BAB_SKY=(()=>{const R=[];let x=-1600;let i=0;while(x<3500){const w=30+hash(i,611)*70,tower=hash(i,612)>0.86;R.push([x,w,tower?42+hash(i,613)*24:8+hash(i,614)*26,tower]);x+=w+(hash(i,615)>0.7?18:2);i++;}return R;})();
function bab_city(ctx,t,o){o=o||{};const hz=o.hz||BAB_HZ,[dw,dy]=bab_light(o),col=mix(mix([16,12,16],[70,46,46],dw),[150,126,108],dy),gap=o.gap||[700,1220];
  ctx.save();ctx.fillStyle=rgba(col,1);BAB_SKY.forEach(([x,w,h,tw_])=>{if(x+w>gap[0]&&x<gap[1])h*=0.35;ctx.fillRect(x,hz-h,w,h+2);if(tw_){for(let k=0;k<3;k++)ctx.fillRect(x+k*w/3+2,hz-h-6,w/3-6,6);}});ctx.restore();
  for(let i=0;i<9;i++){const x=-900+i*560+hash(i,617)*200;if(x>gap[0]-60&&x<gap[1]+60)continue;bab_palm(ctx,x,hz+2,70+hash(i,618)*36,t,{col,lean:(hash(i,619)-0.5)*0.3,rim:0.12*dw});}}
// a date palm: a trunk that tapers and leans a little, a crown of feathery fronds that arch and droop, moving slowly in the air, and a
// few old fronds hanging under it; (x,y) its foot, h its height. o.col: its colour; o.rim: the dawn along its trunk
function bab_palm(ctx,x,y,h,t,o){o=o||{};const col=o.col||[18,14,14],lean=o.lean||0,tx=x+lean*h,ty=y-h,sw=Math.sin(t*0.45+x*0.013)*0.035,sd=Math.round(x*7)%997;
  ctx.save();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x-h*0.03,y);ctx.quadraticCurveTo(x+lean*h*0.45-h*0.026,y-h*0.55,tx-h*0.014,ty);ctx.lineTo(tx+h*0.014,ty);ctx.quadraticCurveTo(x+lean*h*0.45+h*0.026,y-h*0.55,x+h*0.03,y);ctx.closePath();ctx.fill();
  if(o.rim>0.01){ctx.strokeStyle=rgba(BAB_SUN,o.rim);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+h*0.03,y);ctx.quadraticCurveTo(x+lean*h*0.45+h*0.026,y-h*0.55,tx+h*0.014,ty);ctx.stroke();}
  ctx.strokeStyle=rgba(col,1);ctx.lineCap="round";
  // the old fronds, hanging
  ctx.lineWidth=Math.max(0.8,h*0.008);ctx.beginPath();for(let k=0;k<6;k++){const dx=(k/5-0.5)*h*0.16;ctx.moveTo(tx,ty+h*0.02);ctx.quadraticCurveTo(tx+dx*1.6,ty+h*0.06,tx+dx*1.2,ty+h*0.16+hash(k,sd)*h*0.04);}ctx.stroke();
  // the crown: each frond a spine with leaflets along it, longer in its middle
  const N=13;for(let k=0;k<N;k++){const an=-Math.PI/2+(k/(N-1)-0.5)*Math.PI*1.65+sw*(1+k%3)+(hash(k,sd+1)-0.5)*0.18,L=h*(0.34+0.12*hash(k,sd+2)),up=Math.sin(an)<0?1:0.4;
    const ex=tx+Math.cos(an)*L,ey=ty+Math.sin(an)*L*0.5+L*(0.5-0.3*up)*Math.abs(Math.cos(an))+L*0.12,mx=tx+Math.cos(an)*L*0.5,my=ty+Math.sin(an)*L*0.6-L*0.1*up;
    ctx.lineWidth=Math.max(0.8,h*0.009);ctx.beginPath();ctx.moveTo(tx,ty);ctx.quadraticCurveTo(mx,my,ex,ey);ctx.stroke();
    ctx.lineWidth=Math.max(0.5,h*0.0042);ctx.beginPath();for(let j=2;j<12;j++){const u=j/12,v=1-u,px=v*v*tx+2*v*u*mx+u*u*ex,py=v*v*ty+2*v*u*my+u*u*ey,dx=2*v*(mx-tx)+2*u*(ex-mx),dy=2*v*(my-ty)+2*u*(ey-my),dl=Math.hypot(dx,dy)||1,nx=-dy/dl,ny=dx/dl,ll=L*0.2*Math.sin(Math.PI*Math.min(1,u*1.15));
      ctx.moveTo(px,py);ctx.lineTo(px+(nx*0.9+dx/dl*0.5)*ll,py+(ny*0.9+dy/dl*0.5)*ll+ll*0.35);ctx.moveTo(px,py);ctx.lineTo(px+(-nx*0.9+dx/dl*0.5)*ll,py+(-ny*0.9+dy/dl*0.5)*ll+ll*0.35);}ctx.stroke();}
  ctx.restore();}
// the ground: the beaten earth of the precinct round the tower, its enclosure wall behind it, the plain, and the Euphrates on the right,
// between banks of reeds, catching the light; haze lies along the horizon as the sun comes
function bab_ground(ctx,t,o){o=o||{};const hz=o.hz||BAB_HZ,[dw,dy]=bab_light(o),X0=-1600,X1=3500,Y1=2600;
  const far=mix(mix([24,18,20],[86,60,50],dw),[160,132,100],dy),near=mix(mix([9,7,9],[40,27,22],dw),[96,74,54],dy),sil=mix(mix([14,11,13],[52,36,34],dw),[120,98,80],dy);
  const g=ctx.createLinearGradient(0,hz,0,hz+420);g.addColorStop(0,rgba(far,1));g.addColorStop(1,rgba(near,1));ctx.fillStyle=g;ctx.fillRect(X0,hz,X1-X0,Y1-hz);
  // the precinct: a broad, paler court round the tower
  ctx.save();const cg=ctx.createRadialGradient(960,hz+70,30,960,hz+70,640);cg.addColorStop(0,rgba(mix(far,BAB_SUN,0.16+0.12*dy),0.75));cg.addColorStop(1,rgba(far,0));ctx.translate(960,hz+70);ctx.scale(1,0.2);ctx.translate(-960,-(hz+70));ctx.fillStyle=cg;ctx.fillRect(200,hz-700,1520,1540);ctx.restore();
  // the enclosure wall behind the tower, with its towers and gates
  if(o.wall!==false){ctx.fillStyle=rgba(sil,1);ctx.fillRect(560,hz+6,800,12);for(let x=562;x<1358;x+=9)ctx.fillRect(x,hz+3,5,3);for(let i=0;i<=8;i++){const x=560+i*100;ctx.fillRect(x-8,hz-4,16,22);for(let k=-1;k<=1;k++)ctx.fillRect(x+k*6-2,hz-7,4,3);}
    ctx.fillStyle=rgba(mix(sil,BAB_SUN,0.5),0.3*dw+0.2*dy);ctx.fillRect(560,hz+6,800,1.2);}
  // haze along the horizon as the light comes
  const hg=ctx.createLinearGradient(0,hz-40,0,hz+60);hg.addColorStop(0,rgba(BAB_SUN,0));hg.addColorStop(0.5,rgba(mix(BAB_SUN,[255,255,255],0.2),0.1*dw+0.12*dy));hg.addColorStop(1,rgba(BAB_SUN,0));ctx.fillStyle=hg;ctx.fillRect(X0,hz-40,X1-X0,100);
  // the river, from the haze on the right to the foreground, with the sky in it, between reeds
  if(o.river!==false){const rv=mix(mix([10,14,26],[44,46,66],dw),[96,118,138],dy),bank=mix(mix([8,7,8],[30,22,20],dw),[78,62,48],dy);
    const RB=u=>[lerp(1700,1500,u)+Math.sin(u*3)*30,hz+2+u*u*700],LB=u=>[lerp(1760,2600,u)-Math.sin(u*2.4)*40,hz+2+u*u*700];
    ctx.save();ctx.beginPath();for(let i=0;i<=20;i++){const[x,y]=RB(i/20);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}for(let i=20;i>=0;i--){const[x,y]=LB(i/20);ctx.lineTo(x,y);}ctx.closePath();
    const rg=ctx.createLinearGradient(0,hz,0,hz+600);rg.addColorStop(0,rgba(mix(rv,BAB_SUN,0.32*dw+0.12*dy),1));rg.addColorStop(1,rgba(rv,1));ctx.fillStyle=rg;ctx.fill();ctx.clip();
    ctx.fillStyle=rgba(mix(BAB_SUN,[255,255,255],0.3),0.04+0.1*dw);for(let i=0;i<28;i++){const u=i/28,[lx]=RB(u),[rx]=LB(u),yy=hz+4+u*u*680,ww=(rx-lx)*(0.2+0.3*hash(i,633)),xx=lx+(rx-lx)*(0.2+0.5*hash(i,634))+Math.sin(t*0.5+i*1.7)*8;ctx.fillRect(xx,yy,ww,1.2+u*2.4);}ctx.restore();
    // the near bank's reeds, a little at a time along it
    ctx.strokeStyle=rgba(bank,1);ctx.lineCap="round";ctx.beginPath();for(let i=0;i<70;i++){const u=hash(i,635)*0.95,[bx,by]=RB(u),hh=(10+hash(i,636)*26)*(0.4+u*1.4),lw=Math.sin(t*0.7+i)*0.06;ctx.moveTo(bx-6+hash(i,637)*10,by+3);ctx.quadraticCurveTo(bx,by-hh*0.6,bx+(hash(i,638)-0.5)*hh*0.5+lw*hh,by-hh);}ctx.lineWidth=1.6;ctx.stroke();
    for(let i=0;i<3;i++){const u=0.05+i*0.11,[px,py]=RB(u);bab_palm(ctx,px-24-u*60,py+6,110+u*150,t,{col:bank,lean:-0.1+hash(i,631)*0.2,rim:0.18*dw});}}
  // the near ground, darker, framing the picture
  const ng=ctx.createLinearGradient(0,hz+120,0,hz+330);ng.addColorStop(0,"rgba(0,0,0,0)");ng.addColorStop(1,"rgba(0,0,0,0.35)");ctx.fillStyle=ng;ctx.fillRect(X0,hz+120,X1-X0,Y1);}

/* ---------- the tower ---------- */
// Etemenanki, seen from the south: seven stages of brick, the great stair up its middle and the temple on top. cx: its middle; by: the
// ground it stands on; s: pixels to a metre. o.m: how many metres of it stand (BAB_TH, about 90, when it's whole); o.ruin (0..1): the
// mound of fallen brick the kings found; o.ghost (0..1): the whole tower, outlined, as it was to be; o.dawn, o.day: the light, from the
// east (the right); o.hi (0..1): a warm glow along its top, as the sun reaches it.
function bab_stageBox(i,cx,by,s){let y=by;for(let k=0;k<i;k++)y-=BAB_T[k][1]*s;const[w,h]=BAB_T[i];return[cx-w*s/2,y-h*s,w*s,h*s];}
function bab_tower(ctx,cx,by,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[dw,dy]=bab_light(o),m=clamp(o.m==null?BAB_TH:o.m,0,BAB_TH),ru=clamp(o.ruin||0,0,1);
  const lit=mix(mix([70,48,40],[196,130,92],dw),[214,172,128],dy),shade=mix(mix([22,16,16],[72,44,38],dw),[128,98,76],dy);
  withA(ctx,a,()=>{
    if(ru>0.01)withA(ctx,ru,()=>bab_mound(ctx,cx,by,s,lit,shade));
    if(m>0.05){ctx.save();ctx.beginPath();ctx.rect(cx-200*s,by-m*s,400*s,m*s+2);ctx.clip();
      for(let i=0;i<7;i++){const[x,y,w,h]=bab_stageBox(i,cx,by,s);if(by-(y+h)>m*s+1)break;
        const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(shade,1));g.addColorStop(0.55,rgba(mix(shade,lit,0.55),1));g.addColorStop(1,rgba(lit,1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h+0.5);
        // the walls' buttresses and recesses, and the courses of brick
        const bw=5.5*s;let bk=0;for(let bx=x+bw*0.6;bx<x+w-bw*0.5;bx+=bw){ctx.fillStyle="rgba(0,0,0,"+(0.05+0.04*hash(bk++,i*31+5))+")";ctx.fillRect(bx,y+2,Math.max(1,s*1.2),h-2);}
        ctx.strokeStyle="rgba(0,0,0,0.12)";ctx.lineWidth=Math.max(0.6,s*0.18);ctx.beginPath();for(let yy=y+h-1.6*s;yy>y+1;yy-=1.6*s){ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);}ctx.stroke();
        // the terrace on top, catching the light
        if(i<6){const[nx,,nw]=bab_stageBox(i+1,cx,by,s);ctx.fillStyle=rgba(mix(lit,BAB_SUN,0.35),0.55);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(nx+nw+s*2,y-s*1.4);ctx.lineTo(nx-s*2,y-s*1.4);ctx.closePath();ctx.fill();}
        if(i===6){ctx.fillStyle="rgba(10,6,6,0.75)";const dw_=4*s,dh=8*s;ctx.beginPath();ctx.moveTo(cx-dw_/2,y+h);ctx.lineTo(cx-dw_/2,y+h-dh+dw_/2);ctx.arc(cx,y+h-dh+dw_/2,dw_/2,Math.PI,0);ctx.lineTo(cx+dw_/2,y+h);ctx.closePath();ctx.fill();
          ctx.fillStyle=rgba(mix(lit,[255,240,210],0.25),0.5);ctx.fillRect(x,y,w,s*1.2);}}
      // the great stair, up the middle of the south face to the second stage
      const sw=9*s,st=(BAB_T[0][1]+BAB_T[1][1])*s;ctx.fillStyle=rgba(mix(shade,lit,0.7),1);ctx.fillRect(cx-sw/2,by-st,sw,st);ctx.strokeStyle="rgba(0,0,0,0.22)";ctx.lineWidth=Math.max(0.6,s*0.2);
      ctx.beginPath();for(let yy=by-0.9*s;yy>by-st;yy-=0.9*s){ctx.moveTo(cx-sw/2,yy);ctx.lineTo(cx+sw/2,yy);}ctx.stroke();ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(cx-sw/2-s*0.8,by-st,s*0.8,st);ctx.fillRect(cx+sw/2,by-st,s*0.8,st);
      // where the work has reached: a rough top course, if the tower isn't finished
      if(m<BAB_TH-0.5){ctx.fillStyle=rgba(mix(lit,BAB_SUN,0.3),0.7);let i=0;while(i<6&&by-bab_stageBox(i,cx,by,s)[1]<m*s)i++;const[x,,w]=bab_stageBox(i,cx,by,s);for(let k=0;k<24;k++){const bx=x+(k+0.5)*w/24,bh=s*(0.6+hash(k,641)*1.4);ctx.fillRect(bx-w/60,by-m*s,w/30,bh);}}
      ctx.restore();
      if(o.hi>0.01){const gy=by-m*s;withA(ctx,o.hi,()=>glow(ctx,cx,gy,140*s/6,BAB_SUN,0.35));}}
    if((o.ghost||0)>0.01)withA(ctx,o.ghost,()=>{ctx.save();ctx.setLineDash([10,9]);ctx.strokeStyle=rgba(ACA,0.95);ctx.lineWidth=2.4;ctx.shadowColor=rgba(ACA,0.8);ctx.shadowBlur=14;ctx.beginPath();
      const L=[],R=[];for(let i=0;i<7;i++){const[x,y,w,h]=bab_stageBox(i,cx,by,s);L.push([x,y+h],[x,y]);R.unshift([x+w,y],[x+w,y+h]);}ctx.moveTo(L[0][0],L[0][1]);L.concat(R).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.stroke();ctx.restore();});});}
// the mound the tower had become: its core still standing a little, its brick fallen round it, and broken walls along its edges
function bab_mound(ctx,cx,by,s,lit,shade){const w=104*s,h=19*s;ctx.save();ctx.beginPath();ctx.moveTo(cx-w/2,by);
  for(let k=0;k<=24;k++){const u=k/24,x=cx-w/2+u*w,b=Math.sin(Math.PI*u),y=by-h*Math.pow(b,0.7)*(0.85+0.3*hash(k,651))-(Math.abs(u-0.5)<0.18?h*0.35*hash(k,652):0);ctx.lineTo(x,y);}
  ctx.lineTo(cx+w/2,by);ctx.closePath();const g=ctx.createLinearGradient(cx-w/2,0,cx+w/2,0);g.addColorStop(0,rgba(shade,1));g.addColorStop(1,rgba(mix(shade,lit,0.85),1));ctx.fillStyle=g;ctx.fill();
  ctx.clip();ctx.fillStyle="rgba(0,0,0,0.18)";for(let k=0;k<40;k++){const x=cx+(hash(k,653)-0.5)*w*0.9,y=by-hash(k,654)*h*0.9;ctx.fillRect(x,y,s*(1.2+hash(k,655)*2.2),s*0.9);}
  ctx.fillStyle=rgba(mix(lit,BAB_SUN,0.2),0.28);for(let k=0;k<9;k++){const x=cx+(hash(k,657)-0.5)*w*0.7,hh=h*(0.3+0.5*hash(k,656));ctx.save();ctx.translate(x,by-hh);ctx.rotate((hash(k,658)-0.5)*0.6);ctx.fillRect(-s*1.1,-s*0.4,s*2.2,s*0.8);ctx.restore();}ctx.restore();}

/* ---------- the people of Babylon ---------- */
// a tapering limb along pts, w0 wide at its start and w1 at its end: arms and legs drawn with weight, not as sticks (added to the path)
function bab_limb(ctx,pts,w0,w1){for(let i=1;i<pts.length;i++){const[x0,y0]=pts[i-1],[x1,y1]=pts[i],u0=(i-1)/(pts.length-1),u1=i/(pts.length-1),a=lerp(w0,w1,u0)/2,b=lerp(w0,w1,u1)/2,an=Math.atan2(y1-y0,x1-x0),nx=-Math.sin(an),ny=Math.cos(an);
  ctx.moveTo(x0+nx*a,y0+ny*a);ctx.lineTo(x1+nx*b,y1+ny*b);ctx.arc(x1,y1,b,an+Math.PI/2,an-Math.PI/2,true);ctx.lineTo(x0-nx*a,y0-ny*a);ctx.arc(x0,y0,a,an-Math.PI/2,an+Math.PI/2,true);ctx.closePath();}}
// a leg from the hip, walking with phase ph (or standing), its foot pointing forward; added to the path
function bab_leg(ctx,hx,hy,ang,bend){const kx=hx+Math.sin(ang)*24,ky=hy+Math.cos(ang)*24,sa=ang-bend,fx=kx+Math.sin(sa)*25,fy=ky+Math.cos(sa)*25;bab_limb(ctx,[[hx,hy],[kx,ky],[fx,fy]],10,5.6);
  ctx.moveTo(fx-2,fy-2.6);ctx.quadraticCurveTo(fx+7,fy-3.4,fx+9.5,fy+0.4);ctx.lineTo(fx-2.4,fy+0.8);ctx.closePath();}
// an arm from the shoulder (sx,sy) through the elbow to the hand, with a small hand at its end; added to the path
function bab_arm(ctx,sx,sy,ex,ey,hx,hy){bab_limb(ctx,[[sx,sy],[ex,ey],[hx,hy]],7.4,4.8);ctx.moveTo(hx+3,hy);ctx.ellipse(hx,hy,3,3.6,0,0,TAU);}
// a person of Babylon, in profile, as a silhouette against the dawn, lit along their edge from the east (the right): feet at (x,y), h
// pixels tall, facing o.dir (1: right, -1: left). kind: "walk"; "stand"; "carry" (a basket of bricks on the head, steadied with one
// hand); "mould" (kneeling at a brick mould); "rod" (a measuring rod held upright); "rope" (a rope held out in front, low); "pole"
// (pushing a boat along). Men wear a tunic to the knee, a beard and their hair to the neck; o.veil: a woman's shawl over her head; o.king:
// the king's tall rounded cap and a robe to the ankle. o.step: the walk's phase, so they walk while it changes. The whole figure is one
// silhouette, filled once, so no limb shows through another; its rim is the same shape, a little towards the light. Returns where the
// hand on what they hold is, in the frame, for a rope to start from.
function bab_folk(ctx,x,y,h,kind,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return null;const k=h/100,dir=o.dir||1,ph=o.step||0,col=o.col||[20,15,14],rim=o.rim==null?0.55:o.rim;
  const walk=kind==="walk"||kind==="carry",sw=walk?Math.sin(ph):0,hand=[];
  const path=()=>{ctx.beginPath();
    if(kind==="mould"){// kneeling on one knee, bent over the mould on the ground in front
      bab_limb(ctx,[[-4,-34],[10,-14],[12,0]],10,6);ctx.moveTo(10,-2.6);ctx.quadraticCurveTo(18,-3.4,20.5,0.4);ctx.lineTo(9.6,0.8);ctx.closePath();
      bab_limb(ctx,[[-6,-32],[-14,-2],[-30,-2]],10,6);
      ctx.moveTo(-12,-30);ctx.quadraticCurveTo(-14,-52,4,-68);ctx.quadraticCurveTo(12,-72,16,-66);ctx.quadraticCurveTo(14,-50,4,-36);ctx.quadraticCurveTo(10,-30,12,-24);ctx.lineTo(-14,-22);ctx.closePath();
      ctx.moveTo(25.6,-74);ctx.ellipse(19.6,-75,6,6.8,0.5,0,TAU);if(!o.veil){ctx.moveTo(18,-68);ctx.lineTo(25,-66);ctx.lineTo(22,-60);ctx.lineTo(16,-63);ctx.closePath();}
      bab_arm(ctx,8,-62,20,-44,30,-24);bab_arm(ctx,10,-64,26,-46,38,-24);hand.push([38,-24]);
      ctx.moveTo(26,-10);ctx.lineTo(54,-10);ctx.lineTo(54,0);ctx.lineTo(26,0);ctx.closePath();}
    else{const hem=o.king?-5:-25;
      bab_leg(ctx,0,-50,0.42*sw,sw>0?0.32*sw:0.06);bab_leg(ctx,0,-50,-0.42*sw,sw<0?-0.32*sw:0.06);
      // the tunic, belted, to the knee (the king's robe to the ankle)
      const fl=o.king?10.5:11.5;ctx.moveTo(-6,-81);ctx.quadraticCurveTo(-8.5,-66,-6.5,-56);ctx.quadraticCurveTo(-9,-40,-fl,hem);ctx.lineTo(fl+1,hem);ctx.quadraticCurveTo(9,-40,6.5,-56);ctx.quadraticCurveTo(8.5,-68,6,-81);ctx.quadraticCurveTo(0,-84,-6,-81);ctx.closePath();
      ctx.moveTo(-2.6,-87);ctx.lineTo(3.6,-87);ctx.lineTo(3.4,-79);ctx.lineTo(-2.8,-79);ctx.closePath();
      ctx.moveTo(7.7,-92.5);ctx.ellipse(1.5,-92.5,6.2,7,0,0,TAU);ctx.moveTo(7.2,-94.4);ctx.lineTo(9,-91.4);ctx.lineTo(7.2,-90.2);ctx.closePath();
      if(o.veil){ctx.moveTo(1,-100.6);ctx.quadraticCurveTo(-8,-100,-9.5,-86);ctx.quadraticCurveTo(-11,-72,-9,-58);ctx.lineTo(-5,-60);ctx.quadraticCurveTo(-5,-80,1,-86);ctx.closePath();}
      else{ctx.moveTo(-4.4,-97.5);ctx.quadraticCurveTo(-7.4,-90,-6.4,-83);ctx.lineTo(-1,-84);ctx.closePath();ctx.moveTo(1.4,-88.6);ctx.lineTo(7.6,-88.2);ctx.quadraticCurveTo(8.2,-82,6.4,-79);ctx.lineTo(1,-79.4);ctx.closePath();}
      if(o.king&&kind!=="carry"){ctx.moveTo(-5.6,-97);ctx.lineTo(-4.8,-111);ctx.quadraticCurveTo(1.2,-116.5,7,-111);ctx.lineTo(7.6,-97);ctx.closePath();}
      const sx=0,sy=-79;
      if(kind==="carry"){bab_arm(ctx,sx,sy,8,-89,5,-101);hand.push([5,-101]);bab_arm(ctx,sx,sy,-4*sw-1,-63,-6*sw-1,-49);
        // the basket on the head, and the bricks in it
        ctx.moveTo(-11,-103);ctx.lineTo(15,-103);ctx.lineTo(11,-98);ctx.lineTo(-7,-98);ctx.closePath();if(o.load==null||o.load>0){ctx.rect(-9,-109,7,6);ctx.rect(-1,-110,7,7);ctx.rect(7,-108.5,6,5.5);}}
      else if(kind==="rod"){bab_arm(ctx,sx,sy,5,-64,13,-71);hand.push([13,-71]);bab_arm(ctx,sx,sy,-1,-63,-1,-49);ctx.rect(12,-120,2.4,120);}
      else if(kind==="rope"){bab_arm(ctx,sx,sy,7,-64,17,-58);bab_arm(ctx,sx,sy,4,-63,14,-55);hand.push([17,-58]);}
      else if(kind==="pole"){bab_arm(ctx,sx,sy,9,-74,13,-84);bab_arm(ctx,sx,sy,9,-66,18,-66);hand.push([13,-84]);}
      else{const sa=walk?0.36*sw:0.05;bab_arm(ctx,sx,sy,Math.sin(-sa)*17,sy+Math.cos(sa)*17,Math.sin(-sa*1.4)*33+1,sy+Math.cos(sa*1.4)*32);}}};
  const draw=(fill,ox,oy)=>{ctx.save();ctx.translate(x+ox,y+oy);ctx.scale(k*dir,k);path();ctx.fillStyle=fill;ctx.fill("nonzero");ctx.restore();};
  withA(ctx,a,()=>{if(rim>0.01)draw(rgba(mix(col,BAB_SUN,0.85),rim),Math.max(1.2,h*0.012),-Math.max(0.4,h*0.004));draw(rgba(col,1),0,0);});
  return hand.length?[x+hand[0][0]*k*dir,y+hand[0][1]*k]:null;}
// a basket of woven reed, centred on (cx, its foot cy), w wide, as a picture on a card: o.load, the bricks in it
function bab_basket(ctx,cx,cy,w,o){o=o||{};const h=w*0.42,b=[mix(ACA_INK,BAB_ROPE,0.55),mix(ACA_INK,BAB_ROPE,0.3)];
  if((o.load||0)>0.01){ctx.fillStyle=rgba(BAB_BRICK,1);for(let i=0;i<3;i++){const bw=w*0.3;ctx.fillRect(cx-w*0.42+i*bw*1.05,cy-h-bw*0.5*o.load,bw,bw*0.5);}}
  ctx.beginPath();ctx.moveTo(cx-w/2,cy-h);ctx.lineTo(cx+w/2,cy-h);ctx.lineTo(cx+w*0.36,cy);ctx.lineTo(cx-w*0.36,cy);ctx.closePath();ctx.fillStyle=rgba(b[1],1);ctx.fill();
  ctx.strokeStyle=rgba(b[0],0.9);ctx.lineWidth=Math.max(0.8,w*0.03);ctx.beginPath();for(let i=1;i<4;i++){const yy=cy-h*i/4;ctx.moveTo(cx-w*(0.36+0.14*i/4),yy);ctx.lineTo(cx+w*(0.36+0.14*i/4),yy);}ctx.stroke();
  ctx.fillStyle=rgba(b[0],1);ctx.fillRect(cx-w/2-1,cy-h-w*0.04,w+2,w*0.06);}

/* ---------- bricks, kilns, boats, ropes and rods ---------- */
// a brick, square as Babylon's were (about 33 cm a side), centred at (cx,cy), w pixels across; fired unless o.mud. o.stamp (0..1): a
// stamp pressed into its face, its lines drawn as plain rules (the films don't imitate the script; they say in English what it said)
function bab_brick(ctx,cx,cy,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const base=o.mud?BAB_MUD:BAB_BRICK,r=w*0.04;
  withA(ctx,a,()=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(o.rot||0);ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=w*0.08;ctx.shadowOffsetY=w*0.03;
    const g=ctx.createLinearGradient(-w/2,-w/2,w/2,w/2);g.addColorStop(0,rgba(mix(base,[255,230,190],0.18),1));g.addColorStop(1,rgba(mix(base,[0,0,0],0.25),1));rr(ctx,-w/2,-w/2,w,w,r);ctx.fillStyle=g;ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    ctx.fillStyle="rgba(0,0,0,0.12)";for(let i=0;i<60;i++){const px=(hash(i,661)-0.5)*w*0.92,py=(hash(i,662)-0.5)*w*0.92;ctx.fillRect(px,py,w*0.012+hash(i,663)*w*0.01,w*0.01);}
    ctx.strokeStyle="rgba(255,236,200,0.18)";ctx.lineWidth=Math.max(1,w*0.012);rr(ctx,-w/2+w*0.02,-w/2+w*0.02,w-w*0.04,w-w*0.04,r);ctx.stroke();
    const sp=clamp(o.stamp||0,0,1);if(sp>0.01){const sw=w*0.56,sh=w*0.36;withA(ctx,sp,()=>{ctx.fillStyle="rgba(0,0,0,0.22)";rr(ctx,-sw/2,-sh/2,sw,sh,w*0.015);ctx.fill();ctx.strokeStyle="rgba(0,0,0,0.32)";ctx.lineWidth=Math.max(1,w*0.012);ctx.stroke();
      ctx.strokeStyle="rgba(255,236,200,0.16)";for(let i=1;i<6;i++){const yy=-sh/2+i*sh/6;ctx.beginPath();ctx.moveTo(-sw/2+w*0.04,yy);ctx.lineTo(sw/2-w*0.04-(i%2)*w*0.06,yy);ctx.stroke();}});}
    ctx.restore();});}
// a kiln of mud brick, a beehive with courses of brick, its mouth glowing on the ground in front; smoke rises from its top slowly.
// (x,y): the middle of its foot; s: its scale (1 is 130 px tall). o.col: its silhouette
function bab_kiln(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[24,18,16],fire=o.fire==null?1:o.fire;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    for(let i=0;i<5;i++){const u=((t*0.06+i*0.2)%1),sx=Math.sin(t*0.35+i*2)*16*u+u*30,sy=-128-u*240;ctx.fillStyle=`rgba(130,118,116,${0.1*(1-u)*fire})`;ctx.beginPath();ctx.ellipse(sx,sy,18+u*60,10+u*28,0,0,TAU);ctx.fill();}
    ctx.beginPath();ctx.moveTo(-84,0);ctx.bezierCurveTo(-92,-70,-46,-130,0,-130);ctx.bezierCurveTo(46,-130,92,-70,84,0);ctx.closePath();ctx.fillStyle=rgba(col,1);ctx.fill();
    ctx.save();ctx.clip();ctx.strokeStyle=rgba(mix(col,BAB_SUN,0.25),0.5);ctx.lineWidth=1.2;ctx.beginPath();for(let yy=-12;yy>-128;yy-=12){ctx.moveTo(-90,yy);ctx.lineTo(90,yy);}ctx.stroke();
    const rg=ctx.createLinearGradient(-90,0,90,0);rg.addColorStop(0,"rgba(255,196,132,0)");rg.addColorStop(1,"rgba(255,196,132,0.22)");ctx.fillStyle=rg;ctx.fillRect(-90,-130,180,130);ctx.restore();
    ctx.fillStyle=rgba(col,1);ctx.fillRect(-14,-142,28,14);
    if(fire>0.01){const fl=0.88+0.12*Math.sin(t*2.6)*Math.sin(t*1.7+1);glow(ctx,0,-14,110,[255,140,60],0.32*fire*fl);ctx.fillStyle=`rgba(255,${150+18*Math.sin(t*2.2)|0},70,${0.92*fire})`;
      ctx.beginPath();ctx.moveTo(-20,0);ctx.lineTo(-20,-24);ctx.arc(0,-24,20,Math.PI,0);ctx.lineTo(20,0);ctx.closePath();ctx.fill();ctx.fillStyle=`rgba(255,226,170,${0.7*fire*fl})`;ctx.beginPath();ctx.ellipse(0,-6,12,8,0,Math.PI,0);ctx.fill();}
    ctx.restore();});}
// a river boat with its cargo of bitumen in baskets, and its boatman with a pole, moving on the water. (x,y): the waterline's middle;
// s: its scale (1 is about 300 px long)
function bab_boat(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[20,15,14],bob=Math.sin(t*1.1+x*0.01)*2.4;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y+bob);ctx.scale(s,s);
    ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(-160,-46);ctx.quadraticCurveTo(-140,-6,-90,0);ctx.lineTo(90,0);ctx.quadraticCurveTo(140,-6,160,-46);ctx.quadraticCurveTo(130,-22,90,-20);ctx.lineTo(-90,-20);ctx.quadraticCurveTo(-130,-22,-160,-46);ctx.closePath();ctx.fill();
    for(let i=0;i<4;i++){ctx.fillStyle=rgba(BAB_BIT,1);ctx.beginPath();ctx.ellipse(-60+i*34,-28,16,11,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba(mix(col,BAB_ROPE,0.4),0.9);ctx.lineWidth=1.6;ctx.stroke();}
    ctx.restore();const hd=bab_folk(ctx,x+96*s,y+bob-20*s,100*s,"pole",t,{col,dir:-1,rim:o.rim});
    if(hd){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,2.8*s);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(hd[0]+18*s,hd[1]-30*s);ctx.lineTo(hd[0]-60*s,y+40*s);ctx.stroke();ctx.restore();}
    ctx.save();ctx.strokeStyle=rgba(BAB_SUN,0.25);ctx.lineWidth=1.4;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-150*s-i*30,y+4+i*5);ctx.lineTo(x+150*s+i*30,y+4+i*5);ctx.stroke();}ctx.restore();});}
// a rope stretched along pts, drawn as far as p (0..1), sagging a little between its pegs
function bab_rope(ctx,pts,p,o){o=o||{};if(p<=0)return;const segs=[];let L=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);segs.push(d);L+=d;}let left=L*clamp(p,0,1);
  ctx.save();ctx.strokeStyle=rgba(o.col||BAB_ROPE,o.a==null?0.9:o.a);ctx.lineWidth=o.lw||2.4;ctx.lineCap="round";ctx.shadowColor=rgba(BAB_SUN,0.4);ctx.shadowBlur=6;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length&&left>0;i++){const f=Math.min(1,left/segs[i-1]),[x0,y0]=pts[i-1],[x1,y1]=pts[i],ex=lerp(x0,x1,f),ey=lerp(y0,y1,f),sag=Math.min(10,segs[i-1]*0.02)*f;ctx.quadraticCurveTo((x0+ex)/2,(y0+ey)/2+sag,ex,ey);left-=segs[i-1];}ctx.stroke();
  ctx.shadowBlur=0;ctx.fillStyle=rgba(mix(BAB_BIT,BAB_ROPE,0.3),1);let acc=0;pts.forEach((q,i)=>{if(i>0)acc+=segs[i-1];if(acc<=L*p+0.5){ctx.fillRect(q[0]-2,q[1]-12,4,14);}});ctx.restore();}
// a measuring rod of reed, from (x0,y0) to (x1,y1), with its marks
function bab_rod(ctx,x0,y0,x1,y1,o){o=o||{};ctx.save();ctx.strokeStyle=rgba(o.col||mix([20,15,14],BAB_ROPE,0.5),1);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();
  const n=o.n||6,an=Math.atan2(y1-y0,x1-x0),nx=-Math.sin(an)*5,ny=Math.cos(an)*5;ctx.lineWidth=1.6;ctx.beginPath();for(let i=1;i<n;i++){const u=i/n,x=lerp(x0,x1,u),y=lerp(y0,y1,u);ctx.moveTo(x-nx,y-ny);ctx.lineTo(x+nx,y+ny);}ctx.stroke();ctx.restore();}

/* ---------- clay: what the kings wrote ---------- */
// a tablet of clay, for a quote from an inscription: warm, its edges soft and a little uneven, pressed with a few marks of the hand
function bab_clay(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=22;ctx.shadowOffsetY=8;ctx.beginPath();const R=Math.min(28,h*0.25),n=28;
  for(let i=0;i<=n;i++){const u=i/n,j=(hash(i,671)-0.5)*3;ctx.lineTo(x+R+u*(w-2*R),y+j);}ctx.quadraticCurveTo(x+w,y,x+w,y+R);for(let i=0;i<=n/2;i++){const u=i/(n/2);ctx.lineTo(x+w+(hash(i,672)-0.5)*3,y+R+u*(h-2*R));}
  ctx.quadraticCurveTo(x+w,y+h,x+w-R,y+h);for(let i=0;i<=n;i++){const u=i/n;ctx.lineTo(x+w-R-u*(w-2*R),y+h+(hash(i,673)-0.5)*3);}ctx.quadraticCurveTo(x,y+h,x,y+h-R);for(let i=0;i<=n/2;i++){const u=i/(n/2);ctx.lineTo(x+(hash(i,674)-0.5)*3,y+h-R-u*(h-2*R));}
  ctx.quadraticCurveTo(x,y,x+R,y);ctx.closePath();const g=ctx.createLinearGradient(x,y,x+w*0.3,y+h);g.addColorStop(0,rgba(mix(BAB_CLAY,[255,240,214],0.15),1));g.addColorStop(1,rgba(mix(BAB_CLAY,[120,80,50],0.35),1));ctx.fillStyle=g;ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.clip();ctx.fillStyle="rgba(90,56,30,0.10)";for(let i=0;i<90;i++){ctx.beginPath();ctx.arc(x+hash(i,675)*w,y+hash(i,676)*h,0.8+hash(i,677)*1.6,0,TAU);ctx.fill();}
  const ig=ctx.createLinearGradient(0,y,0,y+h);ig.addColorStop(0,"rgba(255,246,226,0.18)");ig.addColorStop(0.1,"rgba(255,246,226,0)");ig.addColorStop(0.9,"rgba(60,30,10,0)");ig.addColorStop(1,"rgba(60,30,10,0.2)");ctx.fillStyle=ig;ctx.fillRect(x,y,w,h);ctx.restore();}
// a quote on clay: the words, in English, and where they come from; returns its height
function bab_quote(ctx,x,y,w,q,src,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||36,ls=wrapT(ctx,q,0,0,w-80,{size:sz,w:700,measure:true}),lh=sz*1.24,h=84+ls.length*lh+(src?44:0);if(a<=0.01)return h;
  withA(ctx,a,()=>{bab_clay(ctx,x,y,w,h);ls.forEach((l,i)=>T(ctx,(i===0?"“":"")+l+(i===ls.length-1?"”":""),x+40-(i===0?sz*0.42:0),y+58+i*lh,{w:700,size:sz,color:rgba(ACA_INK,0.96)}));
    if(src)T(ctx,src,x+40,y+h-34,{f:"mono",w:500,size:28,color:rgba(mix(ACA_INK,BAB_BRICK,0.5),1)});});return h;}
// a label for Babylon: a tag in clay's colours, readable on a phone
function bab_tag(ctx,x,y,s,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>tag(ctx,x,y,s,o.col||BAB_CLAY,{align:o.align||"center",size:o.size||30}));}

/* ---------- the present: agents and how far they may go ---------- */
// an agent, as these films draw one (Keeping it true's glass orb, kt_agent): o.ghost (0..1) one nobody put on the map, faint, in a
// dashed ring; o.warn (0..1) one flagged, in an amber ring; o.name: its name under it; o.busy: how hard it's working
function aca_agent(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const gh=clamp(o.ghost||0,0,1);
  withA(ctx,a*(1-0.55*gh),()=>kt_agent(ctx,x,y,r,t,{busy:o.busy||0,spin:o.spin||x*0.01}));
  if(gh>0.01)withA(ctx,a*gh,()=>{ctx.save();ctx.setLineDash([8,8]);ctx.lineDashOffset=-t*6;ctx.strokeStyle=rgba(KT_AI,0.8);ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x,y,r*1.95,0,TAU);ctx.stroke();ctx.restore();});
  if((o.warn||0)>0.01)withA(ctx,a*o.warn,()=>{ctx.save();ctx.strokeStyle=rgba(ACA_WARN,1);ctx.lineWidth=3.2;ctx.shadowColor=rgba(ACA_WARN,0.7);ctx.shadowBlur=12;ctx.beginPath();ctx.arc(x,y,r*1.95,0,TAU);ctx.stroke();ctx.restore();});
  if(o.name)withA(ctx,a*(o.nameA==null?1:o.nameA),()=>T(ctx,o.name,x,y+r*1.95+(o.size||28)+10,{w:700,size:o.size||28,align:"center",color:rgba(o.ncol||KT_AI,1)}));}
// how far an agent may go on a task, as four steps rising like the tower's tiers: inform, draft, verify, run. The owner of a process
// sets one step for each of its tasks; an agent earns a higher one over time (the AI agents module's Five stages), never by a switch.
const ACA_STEPS=["inform","draft","verify","run"];
// the four steps, from their foot at (x,y), w wide: o.p (0..1) draws them; o.on: the step that's set (0 to 3), or -1 for none; o.hi
// (0..1) lights it; o.size: the words' size. Returns each step's box [x, y, w, h].
function aca_steps(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p,on=o.on==null?-1:o.on,sh=o.sh||70,gap=o.gap||10,sw=(w-gap*3)/4,B=[];
  for(let i=0;i<4;i++)B.push([x+i*(sw+gap),y-(i+1)*sh,sw,(i+1)*sh]);if(a<=0.01)return B;
  withA(ctx,a,()=>{B.forEach(([bx,by,bw,bh],i)=>{const q=clamp(p*4-i,0,1);if(q<=0)return;const lit=i===on?(o.hi==null?1:o.hi):0,col=mix(KT_AI,[255,255,255],0.1*lit),dy=(1-spring(q*1.4))*30;
    withA(ctx,clamp(q*2,0,1),()=>{glass(ctx,bx,by+dy,bw,bh,10,col,{glow:8+16*lit,ea:0.8,fill:"rgba(6,14,20,0.92)"});ctx.fillStyle=rgba(col,0.08+0.3*lit);rr(ctx,bx,by+dy,bw,bh,10);ctx.fill();
      T(ctx,ACA_STEPS[i],bx+bw/2,by+dy+bh-22,{w:800,size:o.size||30,align:"center",color:rgba(mix(INK,KT_AI,0.35+0.5*lit),1)});});});});return B;}
// a task's step, as a pill: four small bars, lit as high as the step, and its name. k: 0 to 3, or -1 for "a person": not at all
function aca_stepPill(ctx,x,y,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const sz=o.size||28,s=k<0?(o.none||"a person"):ACA_STEPS[k],col=k<0?BIZ:KT_AI,w=tw(ctx,s,sz,800)+80,h=sz+22,X=o.align==="right"?x-w:o.align==="center"?x-w/2:x;
  withA(ctx,a,()=>{glass(ctx,X,y-h/2,w,h,h/2,col,{glow:10+12*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.92)"});
    for(let i=0;i<4;i++){const bh=5+i*4,bx=X+16+i*9;ctx.fillStyle=rgba(col,k>=i?1:0.22);ctx.fillRect(bx,y+9-bh,6,bh);}
    T(ctx,s,X+60,y+sz*0.36,{w:800,size:sz,color:rgba(col,1)});});return w;}
